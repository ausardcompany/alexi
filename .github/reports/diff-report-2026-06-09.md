# Upstream Changes Report
Generated: 2026-06-09 09:45:45

## Summary
- kilocode: 130 commits, 272 files changed
- opencode: 30 commits, 203 files changed

## kilocode Changes (1181567b2..574dc1920)

### Commits

- 574dc1920 - Merge pull request #11034 from Kilo-Org/nova-success (Marius, 2026-06-09)
- 82b22f785 - feat: add .ods (OpenDocument Spreadsheet) support to read tool (#10761) (Aarav, 2026-06-09)
- 0d76fa627 - fix(cli): reset forked session costs (marius-kilocode, 2026-06-09)
- feed20b72 - Merge pull request #11032 from Kilo-Org/fix/session-prompt-queue-message-id (Marius, 2026-06-09)
- 8addd087b - test(cli): use valid prompt queue message ID (marius-kilocode, 2026-06-09)
- d881bfcc6 - Merge pull request #10094 from IamCoder18/fix/agent-manager-model-sync (Marius, 2026-06-09)
- dbddefd2d - Merge pull request #10109 from IamCoder18/fix/session-prompt-queue-memory-leak (Marius, 2026-06-09)
- 372a40629 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-06-08)
- 21a808468 - Merge pull request #10996 from Kilo-Org/marius-kilocode/kilo-opencode-v1.14.48 (Marius, 2026-06-08)
- bb1cfcd27 - Merge pull request #10992 from Kilo-Org/rename-mercury-autocomplete-labels (Christiaan Arnoldus, 2026-06-08)
- da67373ad - Merge remote-tracking branch 'origin/main' into marius-kilocode/kilo-opencode-v1.14.48 (marius-kilocode, 2026-06-08)
- 08d0dd4c7 - Merge pull request #11010 from Kilo-Org/button-viburnum (Marius, 2026-06-08)
- 9a1f424e3 - fix(cli): harden proactive compaction replay (marius-kilocode, 2026-06-08)
- 9ca948938 - Merge pull request #11017 from Kilo-Org/docs/fix-deepseek-link-check (Marius, 2026-06-08)
- 8c4636b61 - fix(kilo-docs): use stable DeepSeek links (marius-kilocode, 2026-06-08)
- e7ac3bf15 - Merge remote-tracking branch 'origin/main' into marius-kilocode/kilo-opencode-v1.14.48 (marius-kilocode, 2026-06-08)
- 0b0f0959e - Merge pull request #10879 from Kilo-Org/feat/terminal-bench-model-details (Joshua Lambert, 2026-06-08)
- 621acf986 - Merge branch 'main' into feat/terminal-bench-model-details (Joshua Lambert, 2026-06-08)
- ad93990ca - fix(ui): restore pointer cursors for clickable controls (#10999) (Marius, 2026-06-08)
- 79ca8e120 - Merge pull request #11014 from Kilo-Org/fix/vscode-storybook-heap (Joshua Lambert, 2026-06-08)
- 79c6e1a1f - Merge remote-tracking branch 'origin/main' into button-viburnum (marius-kilocode, 2026-06-08)
- 994cbc002 - fix(kilo-docs): link directly to MiniMax console (#11007) (Marius, 2026-06-08)
- 0925eba8b - Merge pull request #11012 from Kilo-Org/fix/remove-session-export-worker-e2e (Marius, 2026-06-08)
- 18c3020ab - fix(cli): annotate proactive compaction hooks (marius-kilocode, 2026-06-08)
- 4b8992112 - Merge branch 'main' into feat/terminal-bench-model-details (Joshua Lambert, 2026-06-08)
- 636586a3e - ci: apply Storybook heap limit to visual job (Josh Lambert, 2026-06-08)
- 5505a567a - Merge remote-tracking branch 'origin/main' into button-viburnum (marius-kilocode, 2026-06-08)
- fd4b7a27d - test(cli): remove network-dependent session export case (marius-kilocode, 2026-06-08)
- 0d6f263bd - ci: raise VS Code Storybook heap limit (Josh Lambert, 2026-06-08)
- 6ee090b5a - Restore cloud session diffs on import (#10948) (Igor Šćekić, 2026-06-08)
- 39dbf7fd0 - test(cli): remove redundant exit binding loop (marius-kilocode, 2026-06-08)
- cc03ffc58 - fix: harden OpenCode v1.14.48 integration (marius-kilocode, 2026-06-08)
- a13064167 - fix(cli): compact before context threshold overflow (marius-kilocode, 2026-06-08)
- ece8453ad - fix(core): avoid copying visible planning chat into new sessions (#10991) (Josh Holmer, 2026-06-08)
- 2f3e32895 - Merge pull request #11004 from Kilo-Org/fix-worktree-project-skills (Marius, 2026-06-08)
- 741b00f2e - fix(cli): restore subagent isolation in session forks (#11000) (Marius, 2026-06-08)
- 16e334ff8 - fix(cli): discover project skills in worktree sessions (marius-kilocode, 2026-06-08)
- 2d7c49d2a - Update Mercury autocomplete model labels (Christiaan Arnoldus, 2026-06-08)
- 12e83e1d3 - Merge pull request #10998 from Kilo-Org/voltaic-veterinarian (Marius, 2026-06-08)
- 8918bb767 - Merge pull request #10787 from Kilo-Org/picayune-yacht (Marius, 2026-06-08)
- 65f0c3e44 - Merge pull request #10995 from Kilo-Org/fix/ignore-legacy-model-snapshots (Marius, 2026-06-08)
- a59b255b3 - fix(cli): restore automatic session titles (marius-kilocode, 2026-06-08)
- 5706abce7 - chore(cli): normalize upstream annotations (marius-kilocode, 2026-06-08)
- d71b1e344 - revert(sdk): keep generation on pinned Bun (marius-kilocode, 2026-06-08)
- 97dd46048 - fix(sdk): stabilize generated event ordering (marius-kilocode, 2026-06-08)
- 5b32c368c - refactor(sdk): simplify Bun version lookup (marius-kilocode, 2026-06-08)
- cc2167fc5 - fix(sdk): reject mismatched Bun generation (marius-kilocode, 2026-06-08)
- cf08de3f4 - resolve merge conflicts (marius-kilocode, 2026-06-08)
- 4550e0d88 - fix(cli): ignore legacy models snapshots (marius-kilocode, 2026-06-08)
- 1f5103cc1 - merge: record upstream v1.14.48 (marius-kilocode, 2026-06-08)
- e610b1d39 - refactor: kilo compat for v1.14.48 (marius-kilocode, 2026-06-08)
- 706aa5fba - Merge remote-tracking branch 'origin/main' into resolve-terminal-bench-kilo (Josh Lambert, 2026-06-05)
- 210f58782 - test: focus Terminal Bench coverage (Josh Lambert, 2026-06-05)
- b0a4f0391 - feat: show Terminal Bench model details (Josh Lambert, 2026-06-03)
- c6679eaec - fix(vscode): route worktree permission approvals correctly (marius-kilocode, 2026-06-01)
- 0c71f69cf - Merge branch 'main' into fix/agent-manager-model-sync (Aarav, 2026-05-22)
- a8f3a6944 - fix(agent-manager): compare and reset worktree model against configModel (Aarav Sharma, 2026-05-22)
- 7ac7c1e28 - chore: add changeset for agent-manager model sync (Aarav Sharma, 2026-05-16)
- df30123e5 - chore: add changeset for session prompt queue memory leak fix (Aarav Sharma, 2026-05-16)
- 7315d0d6d - Merge branch 'main' into fix/agent-manager-model-sync (Aarav, 2026-05-16)
- 0acf36b4c - chore: add @internal JSDoc to test-only helper (Aarav Sharma, 2026-05-12)
- 1403b6609 - test: add regression test for cancel memory leak (Aarav Sharma, 2026-05-12)
- 4d8ac17c2 - release: v1.14.48 (opencode, 2026-05-11)
- 38e454011 - chore: generate (opencode-agent[bot], 2026-05-11)
- 4100fcbd1 - disable image resizing (Dax Raad, 2026-05-10)
- 83cb0f60e - Drop EventV2 run facade (#26783) (Kit Langton, 2026-05-10)
- effd96755 - Use SyncEvent service at event call sites (#26782) (Kit Langton, 2026-05-10)
- 5801cce1b - chore: generate (opencode-agent[bot], 2026-05-11)
- 77e6c0d32 - feat(llm): cache hint TTL, breakpoint cap, and tool placement (#26779) (Kit Langton, 2026-05-10)
- fed716ada - Clarify compaction test harness (#26777) (Kit Langton, 2026-05-10)
- 426d92e35 - sync release versions for v1.14.47 (opencode, 2026-05-11)
- d0412a213 - chore: generate (opencode-agent[bot], 2026-05-11)
- 16aa67086 - Effectify remaining compaction process tests (#26776) (Kit Langton, 2026-05-10)
- 7cea32ee0 - Add background code migration service (#26652) (Dax, 2026-05-11)
- 128d10d9e - Simplify compaction test helpers (#26742) (Kit Langton, 2026-05-10)
- 5ef72e110 - Drop unused ID Zod statics (#26740) (Kit Langton, 2026-05-10)
- d8060dc9a - Drop compaction create facade (#26739) (Kit Langton, 2026-05-10)
- f71fb18d3 - Replace compaction create test fixtures (#26738) (Kit Langton, 2026-05-10)
- 5654dd2aa - restore managed textarea keymap handling (#26771) (Sebastian, 2026-05-11)
- 64dde0cb1 - Migrate compaction tool-call test (#26737) (Kit Langton, 2026-05-10)
- a658e43ee - Migrate compaction plugin test (#26736) (Kit Langton, 2026-05-10)
- ca8a42c97 - Migrate LLM compaction tail tests (#26734) (Kit Langton, 2026-05-10)
- 8f5f75db1 - Migrate compaction LLM test (#26733) (Kit Langton, 2026-05-10)
- 4ff0d07b1 - Migrate configurable compaction tests (#26732) (Kit Langton, 2026-05-10)
- 2a571b3ce - Migrate compaction overflow tests (#26731) (Kit Langton, 2026-05-10)
- 0fffcdfe4 - Persist session model switches outside event flag (#26765) (Dax, 2026-05-10)
- 2ba2ee52e - docs: document bun dev tmux capture (#26764) (Dax, 2026-05-10)
- 56d818fc3 - zen: fix reasoning token for openai compatible endpoint (Frank, 2026-05-10)
- 9c8da6919 - Use Effect timeout in compaction test (#26728) (Kit Langton, 2026-05-10)
- a78018697 - chore: generate (opencode-agent[bot], 2026-05-10)
- e45b6ef1d - refactor(http-recorder): use Schema.TaggedErrorClass for cassette errors (#26729) (Kit Langton, 2026-05-10)
- b616543ac - chore: generate (opencode-agent[bot], 2026-05-10)
- 2bd3d9a69 - refactor(http-recorder): hide cassette format behind Cassette seam (#26725) (Kit Langton, 2026-05-10)
- fa15dbc5e - Migrate compaction process tests (#26723) (Kit Langton, 2026-05-10)
- 312e5c7a7 - chore: generate (opencode-agent[bot], 2026-05-10)
- 049502fac - fix(server): return diagnosable body for schema rejections (#26631) (Kit Langton, 2026-05-10)
- cc2915be1 - chore: generate (opencode-agent[bot], 2026-05-10)
- ce061bf66 - Add explicit LLM stream lifecycle events (#26722) (Kit Langton, 2026-05-10)
- 3b8790e03 - zen: fix usage css on mobile (Frank, 2026-05-10)
- a4f3cedcd - Start effect-style compaction tests (Kit Langton, 2026-05-10)
- 1c9a2eb23 - chore: generate (opencode-agent[bot], 2026-05-10)
- 4fb417d3b - feat(http-recorder): default mode to "auto" (#26719) (Kit Langton, 2026-05-10)
- 11030c627 - Scope boolean query overrides (Kit Langton, 2026-05-10)
- c104098a6 - chore: generate (opencode-agent[bot], 2026-05-10)
- 49ee3ba85 - Source diff message query pattern (#26638) (Kit Langton, 2026-05-10)
- 0bddf1e75 - fix(cli): prevent memory leak in KiloSessionPromptQueue.cancel for sessions without active tails (Aarav Sharma, 2026-05-10)
- 4fc538378 - chore: generate (opencode-agent[bot], 2026-05-10)
- d28b5ad2f - refactor(http-recorder): Redactor + Recorder seams, README (#26636) (Kit Langton, 2026-05-10)
- 6589a6682 - chore: generate (opencode-agent[bot], 2026-05-10)
- 5cf9abe74 - feat(scout): materialize configured reference repos (#26692) (Shoubhit Dash, 2026-05-10)
- 903d81819 - Zen: add Ring 2.6 1T (Frank, 2026-05-10)
- 472f9e64a - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-10)
- c04fa9e25 - sync: revert (Frank, 2026-05-10)
- 3a78fb1f4 - chore: generate (opencode-agent[bot], 2026-05-10)
- 85ce6a5f9 - feat: better image handling (auto resize & max size constraints) (#26401) (Aiden Cline, 2026-05-10)
- 5217e6c1a - chore: generate (opencode-agent[bot], 2026-05-10)
- 3a7f61709 - go: add tencent icon (Frank, 2026-05-10)
- d9150413c - chore: generate (opencode-agent[bot], 2026-05-10)
- bcbc1dba2 - Go add hy3 preview (#26533) (Jack, 2026-05-10)
- ce3235e11 - sync (Frank, 2026-05-10)
- a9a2a597d - chore: generate (opencode-agent[bot], 2026-05-10)
- 3753601f8 - Format TUI paths relative to session directory (#26648) (Dax, 2026-05-10)
- fb4bab8a6 - Remove redundant ID Zod overrides (#26633) (Kit Langton, 2026-05-09)
- b3526f6ce - chore: generate (opencode-agent[bot], 2026-05-10)
- f220f02a2 - Source workspace path pattern (#26632) (Kit Langton, 2026-05-09)
- 235a86fb6 - chore: generate (opencode-agent[bot], 2026-05-10)
- 67b9c9c02 - Source HTTP API ID path patterns (#26623) (Kit Langton, 2026-05-09)
- 2f11c9f7e - sync release versions for v1.14.46 (opencode, 2026-05-10)
- e1e75a382 - style: format imports in session.tsx (Aarav Sharma, 2026-05-09)
- e362e192a - agent-manager: use configModel for new worktree dialog and clear stale overrides on config change - Replace session.selected() with session.configModel() in NewWorktreeDialog to reflect the configured model rather than the selected session model. - Add configModel to SessionContext and implement an effect that clears session overrides matching the old config model when the global config model changes, ensuring sessions pick up the new config model. (Aarav Sharma, 2026-05-09)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/ods.ts` (+27, -0)
- `packages/opencode/src/kilocode/tool/registry.ts` (+11, -4)
- `packages/opencode/src/kilocode/tool/xlsx.ts` (+19, -5)
- `packages/opencode/src/tool/glob.ts` (+13, -3)
- `packages/opencode/src/tool/grep.ts` (+4, -0)
- `packages/opencode/src/tool/read.ts` (+6, -3)
- `packages/opencode/src/tool/registry.ts` (+40, -30)
- `packages/opencode/src/tool/repo_clone.ts` (+18, -147)
- `packages/opencode/src/tool/schema.ts` (+2, -2)
- `packages/opencode/test/tool/apply_patch.test.ts` (+1, -1)
- `packages/opencode/test/tool/edit.test.ts` (+1, -1)
- `packages/opencode/test/tool/external-directory.test.ts` (+1, -1)
- `packages/opencode/test/tool/glob.test.ts` (+5, -1)
- `packages/opencode/test/tool/grep.test.ts` (+3, -1)
- `packages/opencode/test/tool/lsp.test.ts` (+1, -1)
- `packages/opencode/test/tool/question.test.ts` (+1, -1)
- `packages/opencode/test/tool/read.test.ts` (+88, -1)
- `packages/opencode/test/tool/registry.test.ts` (+8, -5)
- `packages/opencode/test/tool/repo_clone.test.ts` (+1, -1)
- `packages/opencode/test/tool/repo_overview.test.ts` (+1, -1)
- `packages/opencode/test/tool/shell.test.ts` (+1, -1)
- `packages/opencode/test/tool/skill.test.ts` (+1, -1)
- `packages/opencode/test/tool/webfetch.test.ts` (+1, -1)
- `packages/opencode/test/tool/write.test.ts` (+1, -1)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+48, -49)
- `packages/opencode/test/agent/agent.test.ts` (+22, -12)

#### Permission System (**/permission/)
- `packages/opencode/src/permission/index.ts` (+34, -35)
- `packages/opencode/src/permission/schema.ts` (+2, -2)
- `packages/opencode/test/kilocode/permission/env-read.test.ts` (+1, -1)
- `packages/opencode/test/permission/next.test.ts` (+10, -8)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
(no changes)

#### Other Changes
- `.changeset/add-ods-support.md` (+5, -0)
- `.changeset/agent-manager-model-sync.md` (+5, -0)
- `.changeset/bright-pointer-controls.md` (+6, -0)
- `.changeset/brisk-terminal-bench-details.md` (+7, -0)
- `.changeset/calm-image-events.md` (+5, -0)
- `.changeset/calm-titles-return.md` (+5, -0)
- `.changeset/cloud-session-diff-restore.md` (+6, -0)
- `.changeset/fix-worktree-project-skills.md` (+5, -0)
- `.changeset/isolate-forked-subagents.md` (+5, -0)
- `.changeset/plan-followup-clean-session.md` (+5, -0)
- `.changeset/rename-mercury-autocomplete-labels.md` (+5, -0)
- `.changeset/reset-fork-costs.md` (+5, -0)
- `.changeset/route-worktree-permissions.md` (+5, -0)
- `.changeset/session-prompt-queue-memory-leak.md` (+5, -0)
- `.changeset/tidy-context-preflight.md` (+5, -0)
- `.github/workflows/visual-regression.yml` (+9, -0)
- `.opencode-version` (+1, -1)
- `bun.lock` (+5, -1)
- `nix/hashes.json` (+4, -4)
- `package.json` (+1, -0)
- `packages/http-recorder/README.md` (+214, -0)
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
- `packages/http-recorder/sst-env.d.ts` (+10, -0)
- `packages/http-recorder/test/record-replay.test.ts` (+98, -67)
- `packages/kilo-docs/pages/ai-providers/deepseek.md` (+2, -2)
- `packages/kilo-docs/pages/ai-providers/minimax.md` (+1, -1)
- `packages/kilo-docs/pages/customize/context/context-condensing.md` (+2, -2)
- `packages/kilo-gateway/src/api/models.ts` (+8, -0)
- `packages/kilo-gateway/src/autocomplete.ts` (+5, -5)
- `packages/kilo-gateway/test/api/models.test.ts` (+78, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/SessionModelSerializationTest.kt` (+22, -0)
- `packages/kilo-ui/src/styles/globals.css` (+15, -0)
- `packages/kilo-vscode/package.json` (+3, -3)
- `packages/kilo-vscode/src/KiloProvider.ts` (+10, -8)
- `packages/kilo-vscode/src/commands/toggle-auto-approve.ts` (+2, -2)
- `packages/kilo-vscode/tests/unit/auto-approve.test.ts` (+24, -4)
- `packages/kilo-vscode/tests/unit/permission-recovery.test.ts` (+50, -6)
- `packages/kilo-vscode/webview-ui/agent-manager/NewWorktreeDialog.tsx` (+3, -3)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelPreview.tsx` (+15, -1)
- `packages/kilo-vscode/webview-ui/src/components/shared/model-preview-utils.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+71, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/styles/model-selector.css` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/providers.ts` (+4, -0)
- `packages/llm/example/tutorial.ts` (+1, -1)
- `packages/llm/src/protocols/anthropic-messages.ts` (+81, -36)
- `packages/llm/src/protocols/bedrock-converse.ts` (+66, -24)
- `packages/llm/src/protocols/gemini.ts` (+8, -4)
- `packages/llm/src/protocols/openai-chat.ts` (+3, -6)
- `packages/llm/src/protocols/openai-responses.ts` (+15, -29)
- `packages/llm/src/protocols/utils/bedrock-cache.ts` (+24, -7)
- `packages/llm/src/protocols/utils/cache.ts` (+16, -0)
- `packages/llm/src/protocols/utils/tool-stream.ts` (+14, -24)
- `packages/llm/src/schema/events.ts` (+89, -26)
- `packages/llm/src/schema/ids.ts` (+9, -0)
- `packages/llm/src/schema/messages.ts` (+3, -0)
- `packages/llm/src/tool-runtime.ts` (+14, -6)
- `packages/llm/sst-env.d.ts` (+10, -0)
- `packages/llm/test/adapter.test.ts` (+3, -1)
- `packages/llm/test/llm.test.ts` (+1, -1)
- `packages/llm/test/provider/anthropic-messages-cache.recorded.test.ts` (+48, -0)
- `packages/llm/test/provider/anthropic-messages.recorded.test.ts` (+2, -1)
- `packages/llm/test/provider/anthropic-messages.test.ts` (+131, -1)
- `packages/llm/test/provider/bedrock-converse-cache.recorded.test.ts` (+50, -0)
- `packages/llm/test/provider/bedrock-converse.test.ts` (+71, -0)
- `packages/llm/test/provider/gemini-cache.recorded.test.ts` (+47, -0)
- `packages/llm/test/provider/gemini.test.ts` (+3, -3)
- `packages/llm/test/provider/golden.recorded.test.ts` (+4, -3)
- `packages/llm/test/provider/openai-chat.test.ts` (+2, -2)
- `packages/llm/test/provider/openai-responses-cache.recorded.test.ts` (+44, -0)
- `packages/llm/test/provider/openai-responses.test.ts` (+2, -4)
- `packages/llm/test/recorded-scenarios.ts` (+12, -0)
- `packages/llm/test/recorded-test.ts` (+1, -1)
- `packages/llm/test/recorded-websocket.ts` (+2, -3)
- `packages/opencode/.gitignore` (+2, -0)
- `packages/opencode/migration/20260511000411_data_migration_state/migration.sql` (+4, -0)
- `packages/opencode/migration/20260511000411_data_migration_state/snapshot.json` (+1490, -0)
- `packages/opencode/package.json` (+19, -18)
- `packages/opencode/specs/openapi-translation-cleanup.md` (+6, -6)
- `packages/opencode/src/audio.d.ts` (+5, -0)
- `packages/opencode/src/cli/cmd/tui/app.tsx` (+18, -27)
- `packages/opencode/src/cli/cmd/tui/component/prompt/index.tsx` (+6, -9)
- `packages/opencode/src/cli/cmd/tui/component/prompt/traits.ts` (+3, -6)
- `packages/opencode/src/cli/cmd/tui/context/path-format.tsx` (+39, -0)
- `packages/opencode/src/cli/cmd/tui/keymap.tsx` (+31, -7)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+253, -276)
- `packages/opencode/src/cli/cmd/tui/routes/session/permission.tsx` (+16, -32)
- `packages/opencode/src/cli/cmd/tui/validate-session.ts` (+9, -4)
- `packages/opencode/src/config/attachment.ts` (+30, -0)
- `packages/opencode/src/config/config.ts` (+31, -27)
- `packages/opencode/src/control-plane/schema.ts` (+1, -5)
- `packages/opencode/src/control-plane/workspace.ts` (+6, -8)
- `packages/opencode/src/data-migration.sql.ts` (+6, -0)
- `packages/opencode/src/data-migration.ts` (+59, -0)
- `packages/opencode/src/effect/app-runtime.ts` (+4, -0)
- `packages/opencode/src/id/id.ts` (+0, -8)
- `packages/opencode/src/image/image.ts` (+278, -0)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+14, -2)
- `packages/opencode/src/kilocode/components/model-info-panel-utils.ts` (+8, -0)
- `packages/opencode/src/kilocode/components/model-info-panel.tsx` (+26, -1)
- `packages/opencode/src/kilocode/plan-followup.ts` (+4, -9)
- `packages/opencode/src/kilocode/plugins/sidebar-usage.tsx` (+44, -16)
- `packages/opencode/src/kilocode/provider/provider.ts` (+8, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilo-gateway.ts` (+50, -13)
- `packages/opencode/src/kilocode/server/httpapi/session-fork.ts` (+15, -9)
- `packages/opencode/src/kilocode/session-export/worker.ts` (+1, -1)
- `packages/opencode/src/kilocode/session-export/worker/ipc.ts` (+9, -1)
- `packages/opencode/src/kilocode/session-export/worker/validate.ts` (+1, -0)
- `packages/opencode/src/kilocode/session-portability/cumulative-diff.ts` (+49, -0)
- `packages/opencode/src/kilocode/session-portability/session-diff-restore.ts` (+113, -0)
- `packages/opencode/src/kilocode/session/compaction.ts` (+42, -0)
- `packages/opencode/src/kilocode/session/fork.ts` (+5, -3)
- `packages/opencode/src/kilocode/session/index.ts` (+4, -3)
- `packages/opencode/src/kilocode/session/llm.ts` (+8, -18)
- `packages/opencode/src/kilocode/session/overflow.ts` (+77, -0)
- `packages/opencode/src/kilocode/session/prompt-queue.ts` (+12, -0)
- `packages/opencode/src/kilocode/session/prompt.ts` (+4, -0)
- `packages/opencode/src/kilocode/suggestion/index.ts` (+7, -6)
- `packages/opencode/src/kilocode/tui/app-exit.ts` (+21, -0)
- `packages/opencode/src/project/bootstrap.ts` (+16, -7)
- `packages/opencode/src/provider/transform.ts` (+2, -4)
- `packages/opencode/src/pty/schema.ts` (+2, -2)
- `packages/opencode/src/question/schema.ts` (+2, -5)
- `packages/opencode/src/reference/reference.ts` (+237, -0)
- `packages/opencode/src/reference/repository-cache.ts` (+147, -0)
- `packages/opencode/src/server/routes/instance/httpapi/api.ts` (+4, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/query.ts` (+4, -0)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/permission.ts` (+15, -7)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/session.ts` (+35, -21)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/schema-error.ts` (+30, -0)
- `packages/opencode/src/server/routes/instance/httpapi/public.ts` (+33, -25)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+4, -0)
- `packages/opencode/src/server/shared/workspace-routing.ts` (+1, -0)
- `packages/opencode/src/session/compaction.ts` (+36, -35)
- `packages/opencode/src/session/llm.ts` (+40, -8)
- `packages/opencode/src/session/processor.ts` (+221, -139)
- `packages/opencode/src/session/prompt.ts` (+133, -60)
- `packages/opencode/src/session/schema.ts` (+3, -7)
- `packages/opencode/src/session/session.ts` (+13, -0)
- `packages/opencode/src/session/summary.ts` (+19, -6)
- `packages/opencode/src/skill/index.ts` (+1, -1)
- `packages/opencode/src/sync/schema.ts` (+2, -2)
- `packages/opencode/src/util/repository.ts` (+15, -0)
- `packages/opencode/src/v2/event.ts` (+0, -10)
- `packages/opencode/src/v2/session.ts` (+5, -3)
- `packages/opencode/test/account/service.test.ts` (+1, -1)
- `packages/opencode/test/cli/cmd/tui/app-exit.test.ts` (+47, -0)
- `packages/opencode/test/cli/cmd/tui/prompt-traits.test.ts` (+8, -17)
- `packages/opencode/test/cli/github-action.test.ts` (+12, -12)
- `packages/opencode/test/fixture/spreadsheet/hidden-sheet.ods` (+-, --)
- `packages/opencode/test/fixture/spreadsheet/repeated-cells.ods` (+-, --)
- `packages/opencode/test/image/image.test.ts` (+122, -0)
- `packages/opencode/test/kilocode/bash-permission-metadata.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/compaction-payload-recovery.test.ts` (+21, -7)
- `packages/opencode/test/kilocode/edit-permission-filediff.test.ts` (+1, -2)
- `packages/opencode/test/kilocode/external-directory-boundary.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/plan-followup.test.ts` (+120, -11)
- `packages/opencode/test/kilocode/question-dismiss-all.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/read-directory.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/read-docx.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/read-notebook.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/read-xlsx.test.ts` (+135, -2)
- `packages/opencode/test/kilocode/semantic-search.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/server/kilo-gateway-statuses.test.ts` (+2, -0)
- `packages/opencode/test/kilocode/session-compaction-cap.test.ts` (+12, -2)
- `packages/opencode/test/kilocode/session-compaction-chunks.test.ts` (+46, -14)
- `packages/opencode/test/kilocode/session-compaction-safety.test.ts` (+12, -12)
- `packages/opencode/test/kilocode/session-diff-restore.test.ts` (+141, -0)
- `packages/opencode/test/kilocode/session-export/capture.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/session-export/e2e.test.ts` (+0, -119)
- `packages/opencode/test/kilocode/session-export/respawn.test.ts` (+2, -1)
- `packages/opencode/test/kilocode/session-export/worker/validate.test.ts` (+8, -0)
- `packages/opencode/test/kilocode/session-fork-remap.test.ts` (+165, -5)
- `packages/opencode/test/kilocode/session-message-metadata.test.ts` (+2, -3)
- `packages/opencode/test/kilocode/session-overflow.test.ts` (+207, -1)
- `packages/opencode/test/kilocode/session-processor-empty-tool-calls.test.ts` (+4, -0)
- `packages/opencode/test/kilocode/session-processor-network-offline.test.ts` (+4, -0)
- `packages/opencode/test/kilocode/session-processor-retry-limit.test.ts` (+4, -0)
- `packages/opencode/test/kilocode/session-prompt-compaction-safety.test.ts` (+56, -2)
- `packages/opencode/test/kilocode/session-prompt-permission-refresh.test.ts` (+11, -1)
- `packages/opencode/test/kilocode/session-prompt-queue.test.ts` (+63, -33)
- `packages/opencode/test/kilocode/session-title-generation.test.ts` (+53, -0)
- `packages/opencode/test/kilocode/suggestion/auto-dismiss.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/suggestion/suggestion.test.ts` (+3, -2)
- `packages/opencode/test/kilocode/tool-encoding.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/tool-registry-indexing-import-failure.test.ts` (+49, -43)
- `packages/opencode/test/kilocode/tool-registry-semantic-import-failure.test.ts` (+54, -49)
- `packages/opencode/test/kilocode/worktree-project-skills.test.ts` (+49, -0)
- `packages/opencode/test/lib/effect.ts` (+7, -2)
- `packages/opencode/test/project/migrate-global.test.ts` (+7, -6)
- `packages/opencode/test/provider/transform.test.ts` (+6, -6)
- `packages/opencode/test/reference/reference.test.ts` (+244, -0)
- `packages/opencode/test/server/httpapi-query-schema-drift.test.ts` (+59, -4)
- `packages/opencode/test/server/httpapi-schema-error-body.test.ts` (+162, -0)
- `packages/opencode/test/server/httpapi-sdk.test.ts` (+125, -0)
- `packages/opencode/test/server/httpapi-ui.test.ts` (+12, -4)
- `packages/opencode/test/server/sdk-error-shape.test.ts` (+16, -6)
- `packages/opencode/test/server/sdk-v1-smoke.test.ts` (+60, -0)
- `packages/opencode/test/server/workspace-routing.test.ts` (+7, -0)
- `packages/opencode/test/session/compaction.test.ts` (+791, -1139)
- `packages/opencode/test/session/instruction.test.ts` (+8, -8)
- `packages/opencode/test/session/llm.test.ts` (+12, -12)
- `packages/opencode/test/session/message-v2.test.ts` (+2, -2)
- `packages/opencode/test/session/processor-effect.test.ts` (+4, -1)
- `packages/opencode/test/session/prompt.test.ts` (+163, -12)
- `packages/opencode/test/session/schema-decoding.test.ts` (+10, -11)
- `packages/opencode/test/session/shell-v2.test.ts` (+62, -0)
- `packages/opencode/test/session/snapshot-tool-race.test.ts` (+11, -1)
- `packages/plugin-atomic-chat/package.json` (+2, -1)
- `packages/sdk/js/src/gen/types.gen.ts` (+5, -5)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+132, -116)
- `packages/sdk/openapi.json` (+456, -207)
- `patches/@silvia-odwyer%2Fphoton-node@0.3.4.patch` (+14, -0)

### Key Diffs

#### packages/opencode/src/agent/agent.ts
```diff
diff --git a/packages/opencode/src/agent/agent.ts b/packages/opencode/src/agent/agent.ts
index 5bc2372e9..067273e90 100644
--- a/packages/opencode/src/agent/agent.ts
+++ b/packages/opencode/src/agent/agent.ts
@@ -25,11 +25,9 @@ import { Effect, Context, Layer, Schema } from "effect"
 import { InstanceState } from "@/effect/instance-state"
 import { zod } from "@opencode-ai/core/effect-zod"
 import { withStatics, type DeepMutable } from "@opencode-ai/core/schema"
+import { Reference } from "@/reference/reference"
 import * as KiloAgent from "@/kilocode/agent" // kilocode_change
 
-type ReferenceEntry = NonNullable<Config.Info["reference"]>[string]
-type ResolvedReference = { kind: "git"; repository: string; branch?: string } | { kind: "local"; path: string }
-
 export const Info = Schema.Struct({
   name: Schema.String,
   displayName: Schema.optional(Schema.String), // kilocode_change - human-readable name for org modes
@@ -103,7 +101,7 @@ export const layer = Layer.effect(
         } satisfies Record<string, "allow" | "ask" | "deny">
 
         const baseDefaults = Permission.fromConfig({
-          // kilocode_change: renamed from defaults
+          // kilocode_change
           "*": "allow",
           doom_loop: "ask",
           external_directory: {
@@ -290,9 +288,7 @@ export const layer = Layer.effect(
 
         // kilocode_change start - rename build→code, add debug/orchestrator/ask, patch plan/explore
         KiloAgent.patchAgents(agents, defaults, user, cfg, kilo, ctx.worktree, whitelistedDirs)
-        // kilocode_change end
 
-        // kilocode_change start - preprocess config to remap "build" key → "code"
         const agentConfigs = KiloAgent.preprocessConfig(cfg.agent ?? {})
         for (const [key, value] of Object.entries(agentConfigs)) {
           // kilocode_change end
@@ -325,69 +321,70 @@ export const layer = Layer.effect(
           KiloAgent.processConfigItem(item) // kilocode_change - populate displayName from options
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
```

#### packages/opencode/src/kilocode/tool/ods.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/ods.ts b/packages/opencode/src/kilocode/tool/ods.ts
new file mode 100644
index 000000000..70d65f86c
--- /dev/null
+++ b/packages/opencode/src/kilocode/tool/ods.ts
@@ -0,0 +1,27 @@
+import { CFB } from "xlsx"
+
+function attribute(xml: string, name: string) {
+  return xml.match(new RegExp(`(?:^|\\s)(?:[\\w.-]+:)?${name}\\s*=\\s*(["'])(.*?)\\1`))?.[2]
+}
+
+export function visibility(bytes: Uint8Array) {
+  const archive = CFB.read(bytes, { type: "buffer" })
+  const content = CFB.find(archive, "content.xml")?.content
+  if (!content) return new Set<number>()
+
+  const xml = new TextDecoder().decode(content)
+  const styles = new Set(
+    Array.from(xml.matchAll(/<style:style(?=[\s>])([^>]*)>([\s\S]*?)<\/style:style\s*>/g)).flatMap((match) => {
+      if (attribute(match[1], "family") !== "table") return []
+      const hidden = /<style:table-properties(?=[\s>])[^>]*\btable:display\s*=\s*(["'])false\1/.test(match[2])
+      const name = attribute(match[1], "name")
+      return hidden && name ? [name] : []
+    }),
+  )
+  return new Set(
+    Array.from(xml.matchAll(/<table:table(?=[\s>])([^>]*)>/g)).flatMap((match, index) => {
+      const style = attribute(match[1], "style-name")
+      return style && styles.has(style) ? [index] : []
+    }),
+  )
+}
```

#### packages/opencode/src/kilocode/tool/registry.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/registry.ts b/packages/opencode/src/kilocode/tool/registry.ts
index e99b8c8eb..d1c842c5d 100644
--- a/packages/opencode/src/kilocode/tool/registry.ts
+++ b/packages/opencode/src/kilocode/tool/registry.ts
@@ -12,6 +12,10 @@ import * as Truncate from "@/tool/truncate"
 
 const log = Log.create({ service: "kilocode-tool-registry" })
 type Deps = { agent: Agent.Interface; truncate: Truncate.Interface }
+type Loaders = {
+  indexing?: () => Promise<{ KiloIndexing: { ready: () => boolean } }>
+  semantic?: () => Promise<Pick<typeof import("@/kilocode/tool/semantic-search"), "SemanticSearchTool">>
+}
 
 export namespace KiloToolRegistry {
   const hint =
@@ -34,6 +38,7 @@ export namespace KiloToolRegistry {
   export function build(
     tools: { codebase: Tool.Info; recall: Tool.Info; manager: Tool.Info; process: Tool.Info },
     deps: Deps,
+    loaders: Loaders = {},
   ) {
     return Effect.gen(function* () {
       const base = yield* Effect.all({
@@ -42,15 +47,16 @@ export namespace KiloToolRegistry {
         manager: Tool.init(tools.manager),
         process: Tool.init(tools.process),
       })
-      const semantic = yield* semanticTool(deps)
+      const semantic = yield* semanticTool(deps, loaders)
       return { ...base, semantic }
     })
   }
 
-  function semanticTool(deps: Deps) {
+  function semanticTool(deps: Deps, loaders: Loaders) {
     return Effect.gen(function* () {
+      const indexing = loaders.indexing ?? (() => import("@/kilocode/indexing"))
       const ready = yield* Effect.tryPromise(() =>
-        import("@/kilocode/indexing").then((mod) => mod.KiloIndexing.ready()),
+        indexing().then((mod) => mod.KiloIndexing.ready()),
       ).pipe(
         Effect.catch((err) =>
           Effect.sync(() => {
@@ -61,7 +67,8 @@ export namespace KiloToolRegistry {
       )
       if (!ready) return undefined
 
-      const mod = yield* Effect.tryPromise(() => import("@/kilocode/tool/semantic-search")).pipe(
+      const semantic = loaders.semantic ?? (() => import("@/kilocode/tool/semantic-search"))
+      const mod = yield* Effect.tryPromise(() => semantic()).pipe(
```

#### packages/opencode/src/kilocode/tool/xlsx.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/xlsx.ts b/packages/opencode/src/kilocode/tool/xlsx.ts
index 13051de4b..5a92bb5d6 100644
--- a/packages/opencode/src/kilocode/tool/xlsx.ts
+++ b/packages/opencode/src/kilocode/tool/xlsx.ts
@@ -1,28 +1,31 @@
 import path from "path"
 import { Readable } from "stream"
 import { read, utils, type CellObject, type WorkBook } from "xlsx"
+import { visibility } from "./ods"
 
 const ROW_LIMIT = 50_000
 const MAX_SIZE = 50 * 1024 * 1024
 const MAX_SIZE_LABEL = `${MAX_SIZE / (1024 * 1024)} MB`
 
 export function is(filepath: string) {
-  return path.extname(filepath).toLowerCase() === ".xlsx"
+  const ext = path.extname(filepath).toLowerCase()
+  return ext === ".xlsx" || ext === ".ods"
 }
 
 export async function open(filepath: string) {
+  const ods = path.extname(filepath).toLowerCase() === ".ods"
   const file = Bun.file(filepath)
   if (file.size > MAX_SIZE) {
     throw new Error(`Cannot read spreadsheet file: ${filepath} exceeds the ${MAX_SIZE_LABEL} size limit`)
   }
   const bytes = new Uint8Array(await file.arrayBuffer())
   if (bytes[0] !== 0x50 || bytes[1] !== 0x4b) {
-    throw new Error(`Cannot read spreadsheet file: ${filepath} is not a valid XLSX workbook`)
+    throw new Error(`Cannot read spreadsheet file: ${filepath} is not a valid spreadsheet`)
   }
 
   try {
     const book = read(bytes, { type: "array", cellDates: true })
-    return Readable.from(lines(book))
+    return Readable.from(lines(book, ods ? visibility(bytes) : new Set(), ods))
   } catch (err) {
     const message = err instanceof Error ? err.message : String(err)
     throw new Error(`Cannot read spreadsheet file: ${filepath}: ${message}`, { cause: err })
@@ -43,8 +46,9 @@ function cell(value: CellObject | undefined) {
   return value.w ?? String(value.v)
 }
 
-function* lines(book: WorkBook) {
+function* lines(book: WorkBook, invisible: Set<number>, expand: boolean) {
   const sheets = book.SheetNames.filter((_, index) => {
+    if (invisible.has(index)) return false
     const hidden = book.Workbook?.Sheets?.[index]?.Hidden
     return hidden !== 1 && hidden !== 2
   })
```

#### packages/opencode/src/permission/index.ts
```diff
diff --git a/packages/opencode/src/permission/index.ts b/packages/opencode/src/permission/index.ts
index cbc14bb20..acb016ba7 100644
--- a/packages/opencode/src/permission/index.ts
+++ b/packages/opencode/src/permission/index.ts
@@ -17,11 +17,12 @@ import os from "os"
 import z from "zod" // kilocode_change
 import { evaluate as evalRule } from "./evaluate"
 import { PermissionID } from "./schema"
-import { ConfigProtection } from "@/kilocode/permission/config-paths" // kilocode_change
-import { Identifier } from "@/id/id" // kilocode_change
-import { drainCovered } from "@/kilocode/permission/drain" // kilocode_change
-import { ReadPermission } from "@/kilocode/permission/read" // kilocode_change
-import { ExternalDirectoryPermission } from "@/kilocode/permission/external-directory" // kilocode_change
+// kilocode_change start
+import { ConfigProtection } from "@/kilocode/permission/config-paths"
+import { drainCovered } from "@/kilocode/permission/drain"
+import { ReadPermission } from "@/kilocode/permission/read"
+import { ExternalDirectoryPermission } from "@/kilocode/permission/external-directory"
+// kilocode_change end
 
 const log = Log.create({ service: "permission" })
 
@@ -137,15 +138,15 @@ export type ReplyInput = Schema.Schema.Type<typeof ReplyInput>
 
 // kilocode_change start
 export const SaveAlwaysRulesInput = z.object({
-  requestID: PermissionID.zod,
+  requestID: zod(PermissionID),
   approvedAlways: z.string().array().optional(),
   deniedAlways: z.string().array().optional(),
 })
 
 export const AllowEverythingInput = z.object({
   enable: z.boolean(),
-  requestID: Identifier.schema("permission").optional(),
-  sessionID: Identifier.schema("session").optional(),
+  requestID: zod(PermissionID).optional(),
+  sessionID: zod(SessionID).optional(),
 })
 // kilocode_change end
 
@@ -153,16 +154,20 @@ export interface Interface {
   readonly ask: (input: AskInput) => Effect.Effect<void, Error>
   readonly reply: (input: ReplyInput) => Effect.Effect<boolean> // kilocode_change
   readonly list: () => Effect.Effect<ReadonlyArray<Request>>
-  readonly saveAlwaysRules: (input: z.infer<typeof SaveAlwaysRulesInput>) => Effect.Effect<boolean> // kilocode_change
-  readonly allowEverything: (input: z.infer<typeof AllowEverythingInput>) => Effect.Effect<void> // kilocode_change
-  readonly pending: (id: string) => Effect.Effect<Request | undefined> // kilocode_change
+  // kilocode_change start
+  readonly saveAlwaysRules: (input: z.infer<typeof SaveAlwaysRulesInput>) => Effect.Effect<boolean>
```


*... and more files (showing first 5)*

## opencode Changes (0050134..671d193)

### Commits

- 671d193 - docs: add uninstall troubleshooting steps (#31424) (opencode-agent[bot], 2026-06-09)
- 2ababc8 - core: fix idle CPU use in file logger (#31478) (Simon Klee, 2026-06-09)
- 5372c63 - fix(app): clip rounded session panels (#31462) (Luke Parker, 2026-06-09)
- ab701d2 - feat: add "reasoning" as interleaved field option for vLLM providers (#30477) (Ben Sandbrook, 2026-06-08)
- 384a8f5 - feat(app): tabs help button (#31454) (Brendan Allan, 2026-06-09)
- 50c9d52 - chore: generate (opencode-agent[bot], 2026-06-09)
- 1a08ee7 - feat(app): draft prompt state (#31452) (Brendan Allan, 2026-06-09)
- 79cff28 - fix(opencode): pass abort signal to MCP tool calls (#31455) (Aiden Cline, 2026-06-08)
- 0efc334 - fix(opencode): paginate MCP catalogs (#31442) (Aiden Cline, 2026-06-08)
- 277ecc5 - chore: generate (opencode-agent[bot], 2026-06-09)
- f565ff3 - feat(app): add draft tab support to tabs store (#31343) (Brendan Allan, 2026-06-09)
- 161247c - fix(opencode): generate reasoning variants for all OpenRouter models. (#30332) (Anthony Lau, 2026-06-08)
- a86ecf3 - fix: adjust item id stripping to happen prior to request signing (#31429) (Aiden Cline, 2026-06-08)
- 6e84142 - fix(opencode): support MiniMax M3 thinking toggle (#31426) (Aiden Cline, 2026-06-08)
- fc52c5a - fix(tui): trim select footer action highlight (#31411) (James Long, 2026-06-08)
- 5376661 - chore: generate (opencode-agent[bot], 2026-06-08)
- c06ad7c - refactor(core): replace legacy logger with Effect logging (#31310) (Dax, 2026-06-08)
- 0a7cb20 - fix(opencode): await run event loop (#31389) (Aiden Cline, 2026-06-08)
- f43209b - fix(session): avoid sticky prompt tool overrides (#31394) (Shoubhit Dash, 2026-06-08)
- b34d924 - fix(core): disable fff trace logs (#31380) (Shoubhit Dash, 2026-06-08)
- 9654412 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-08)
- 31d2fec - chore: upgrade OpenTUI to v0.3.4 (#31326) (Simon Klee, 2026-06-08)
- f3f59db - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-08)
- 89e2a23 - fix(core): restore npm proxy agent patch (#31373) (Aiden Cline, 2026-06-08)
- ea5f976 - chore: generate (opencode-agent[bot], 2026-06-08)
- 4119051 - fix: stabilize fff file results (#31369) (Shoubhit Dash, 2026-06-08)
- f116a55 - fix(stats): show new for leaderboard deltas (Adam, 2026-06-08)
- 89e371c - chore: generate (opencode-agent[bot], 2026-06-08)
- b1a6c40 - fix: speed up fff file search (#31366) (Shoubhit Dash, 2026-06-08)
- 1772e8e - docs(go): update MiniMax M3 pricing (#31350) (Jack, 2026-06-08)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/external-directory.ts` (+1, -2)
- `packages/opencode/src/tool/registry.ts` (+0, -4)
- `packages/opencode/src/tool/shell.ts` (+2, -5)
- `packages/opencode/src/tool/task.ts` (+26, -15)
- `packages/opencode/src/tool/truncate.ts` (+1, -6)
- `packages/opencode/test/tool/task.test.ts` (+3, -7)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
- `packages/opencode/src/permission/index.ts` (+2, -5)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/src/effect/logger.ts` (+0, -73)
- `packages/core/src/effect/observability.ts` (+0, -107)
- `packages/core/src/effect/runtime.ts` (+1, -1)
- `packages/core/src/event.ts` (+1, -3)
- `packages/core/src/filesystem/ripgrep.ts` (+5, -6)
- `packages/core/src/filesystem/search.ts` (+52, -59)
- `packages/core/src/filesystem/watcher.ts` (+10, -10)
- `packages/core/src/models-dev.ts` (+2, -4)
- `packages/core/src/observability.ts` (+21, -0)
- `packages/core/src/observability/logging.ts` (+70, -0)
- `packages/core/src/observability/otlp.ts` (+79, -0)
- `packages/core/src/observability/shared.ts` (+1, -0)
- `packages/core/src/project-reference.ts` (+5, -3)
- `packages/core/src/pty.ts` (+4, -7)
- `packages/core/src/session/logging.ts` (+1, -1)
- `packages/core/src/skill/discovery.ts` (+4, -11)
- `packages/core/src/util/log.ts` (+0, -197)
- `packages/core/src/util/opencode-process.ts` (+0, -24)
- `packages/core/src/v1/config/provider.ts` (+1, -1)
- `packages/core/test/effect/observability.test.ts` (+64, -1)
- `packages/core/test/filesystem/search.test.ts` (+20, -0)
- `packages/stats/core/src/domain/home.ts` (+9, -2)

#### Other Changes
- `bun.lock` (+18, -17)
- `nix/hashes.json` (+4, -4)
- `package.json` (+4, -4)
- `packages/app/src/components/dialog-select-file.tsx` (+1, -0)
- `packages/app/src/components/help-button.tsx` (+54, -0)
- `packages/app/src/components/prompt-input.tsx` (+1, -0)
- `packages/app/src/components/titlebar.tsx` (+2, -0)
- `packages/app/src/context/prompt.tsx` (+21, -12)
- `packages/app/src/context/tabs.tsx` (+64, -5)
- `packages/app/src/pages/layout.tsx` (+3, -0)
- `packages/app/src/pages/session.tsx` (+65, -61)
- `packages/app/src/utils/persist.test.ts` (+18, -0)
- `packages/app/src/utils/persist.ts` (+15, -0)
- `packages/console/app/src/routes/go/index.tsx` (+1, -1)
- `packages/desktop/src/main/env.d.ts` (+0, -3)
- `packages/desktop/src/main/sidecar.ts` (+1, -2)
- `packages/opencode/src/acp/event.ts` (+3, -12)
- `packages/opencode/src/acp/permission.ts` (+3, -24)
- `packages/opencode/src/acp/service.ts` (+5, -19)
- `packages/opencode/src/acp/usage.ts` (+11, -18)
- `packages/opencode/src/cli/cmd/acp.ts` (+1, -4)
- `packages/opencode/src/cli/cmd/debug/lsp.ts` (+2, -3)
- `packages/opencode/src/cli/cmd/debug/scrap.ts` (+0, -3)
- `packages/opencode/src/cli/cmd/run.ts` (+11, -2)
- `packages/opencode/src/cli/cmd/run/footer.prompt.tsx` (+38, -43)
- `packages/opencode/src/cli/cmd/run/footer.ts` (+6, -30)
- `packages/opencode/src/cli/cmd/run/otel.ts` (+0, -117)
- `packages/opencode/src/cli/cmd/run/runtime.lifecycle.ts` (+213, -237)
- `packages/opencode/src/cli/cmd/run/runtime.ts` (+557, -645)
- `packages/opencode/src/cli/cmd/run/scrollback.surface.ts` (+1, -12)
- `packages/opencode/src/cli/cmd/tui.ts` (+4, -44)
- `packages/opencode/src/cli/heap.ts` (+1, -15)
- `packages/opencode/src/cli/tui/worker.ts` (+0, -28)
- `packages/opencode/src/config/agent.ts` (+2, -11)
- `packages/opencode/src/config/command.ts` (+1, -7)
- `packages/opencode/src/config/config.ts` (+18, -25)
- `packages/opencode/src/config/managed.ts` (+2, -10)
- `packages/opencode/src/config/tui-migrate.ts` (+6, -28)
- `packages/opencode/src/config/tui.ts` (+13, -31)
- `packages/opencode/src/control-plane/workspace.ts` (+26, -130)
- `packages/opencode/src/effect/app-runtime.ts` (+1, -1)
- `packages/opencode/src/effect/bootstrap-runtime.ts` (+1, -1)
- `packages/opencode/src/effect/instance-state.ts` (+1, -4)
- `packages/opencode/src/effect/run-service.ts` (+1, -1)
- `packages/opencode/src/format/index.ts` (+13, -23)
- `packages/opencode/src/ide/index.ts` (+0, -9)
- `packages/opencode/src/image/image.ts` (+4, -10)
- `packages/opencode/src/index.ts` (+3, -69)
- `packages/opencode/src/installation/index.ts` (+1, -4)
- `packages/opencode/src/lsp/client.ts` (+1, -37)
- `packages/opencode/src/lsp/lsp.ts` (+7, -17)
- `packages/opencode/src/lsp/server.ts` (+0, -133)
- `packages/opencode/src/mcp/index.ts` (+57, -68)
- `packages/opencode/src/mcp/oauth-callback.ts` (+0, -11)
- `packages/opencode/src/mcp/oauth-provider.ts` (+0, -11)
- `packages/opencode/src/node.ts` (+0, -1)
- `packages/opencode/src/patch/index.ts` (+4, -7)
- `packages/opencode/src/plugin/digitalocean.ts` (+2, -10)
- `packages/opencode/src/plugin/github-copilot/copilot.ts` (+0, -4)
- `packages/opencode/src/plugin/index.ts` (+9, -26)
- `packages/opencode/src/plugin/openai/codex.ts` (+1, -8)
- `packages/opencode/src/plugin/openai/ws-pool.ts` (+0, -20)
- `packages/opencode/src/plugin/tui/runtime.ts` (+8, -52)
- `packages/opencode/src/plugin/xai.ts` (+2, -10)
- `packages/opencode/src/project/bootstrap.ts` (+1, -1)
- `packages/opencode/src/project/instance-store.ts` (+4, -6)
- `packages/opencode/src/project/project.ts` (+2, -5)
- `packages/opencode/src/project/vcs.ts` (+0, -7)
- `packages/opencode/src/provider/provider.ts` (+2, -55)
- `packages/opencode/src/provider/transform.ts` (+54, -18)
- `packages/opencode/src/question/index.ts` (+5, -8)
- `packages/opencode/src/reference/reference.ts` (+1, -3)
- `packages/opencode/src/server/global-lifecycle.ts` (+1, -10)
- `packages/opencode/src/server/mdns.ts` (+3, -16)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/control.ts` (+9, -3)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/event.ts` (+2, -5)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/file.ts` (+24, -2)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/global.ts` (+30, -31)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/session.ts` (+1, -3)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/sync.ts` (+3, -9)
- `packages/opencode/src/server/routes/instance/httpapi/lifecycle.ts` (+1, -4)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/error.ts` (+9, -12)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/schema-error.ts` (+14, -15)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+1, -1)
- `packages/opencode/src/server/server.ts` (+3, -4)
- `packages/opencode/src/server/shared/fence.ts` (+2, -10)
- `packages/opencode/src/session/compaction.ts` (+6, -7)
- `packages/opencode/src/session/llm.ts` (+30, -43)
- `packages/opencode/src/session/message-v2.ts` (+1, -2)
- `packages/opencode/src/session/processor.ts` (+10, -6)
- `packages/opencode/src/session/prompt.ts` (+28, -29)
- `packages/opencode/src/session/revert.ts` (+1, -4)
- `packages/opencode/src/session/session.ts` (+3, -5)
- `packages/opencode/src/session/tools.ts` (+0, -4)
- `packages/opencode/src/share/share-next.ts` (+11, -17)
- `packages/opencode/src/skill/discovery.ts` (+10, -20)
- `packages/opencode/src/skill/index.ts` (+7, -8)
- `packages/opencode/src/snapshot/index.ts` (+30, -30)
- `packages/opencode/src/storage/storage.ts` (+9, -12)
- `packages/opencode/src/temporary.ts` (+4, -6)
- `packages/opencode/src/worktree/index.ts` (+6, -9)
- `packages/opencode/test/control-plane/workspace.test.ts` (+0, -3)
- `packages/opencode/test/effect/app-runtime-logger.test.ts` (+6, -12)
- `packages/opencode/test/lsp/client.test.ts` (+1, -6)
- `packages/opencode/test/mcp/lifecycle.test.ts` (+125, -5)
- `packages/opencode/test/preload.ts` (+0, -7)
- `packages/opencode/test/project/migrate-global.test.ts` (+0, -3)
- `packages/opencode/test/project/project.test.ts` (+0, -3)
- `packages/opencode/test/provider/transform.test.ts` (+166, -12)
- `packages/opencode/test/server/global-session-list.test.ts` (+0, -3)
- `packages/opencode/test/server/httpapi-compression.test.ts` (+0, -3)
- `packages/opencode/test/server/httpapi-config.test.ts` (+0, -3)
- `packages/opencode/test/server/httpapi-cors-vary.test.ts` (+0, -3)
- `packages/opencode/test/server/httpapi-event.test.ts` (+0, -3)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+0, -2)
- `packages/opencode/test/server/httpapi-experimental.test.ts` (+0, -3)
- `packages/opencode/test/server/httpapi-file.test.ts` (+0, -3)
- `packages/opencode/test/server/httpapi-instance-route-auth.test.ts` (+0, -3)
- `packages/opencode/test/server/httpapi-listen.test.ts` (+0, -3)
- `packages/opencode/test/server/httpapi-mcp.test.ts` (+0, -3)
- `packages/opencode/test/server/httpapi-mdns.test.ts` (+0, -3)
- `packages/opencode/test/server/httpapi-provider.test.ts` (+0, -3)
- `packages/opencode/test/server/httpapi-pty.test.ts` (+0, -3)
- `packages/opencode/test/server/httpapi-reference.test.ts` (+0, -3)
- `packages/opencode/test/server/httpapi-session.test.ts` (+0, -3)
- `packages/opencode/test/server/httpapi-sync.test.ts` (+1, -7)
- `packages/opencode/test/server/httpapi-ui.test.ts` (+0, -3)
- `packages/opencode/test/server/httpapi-v2-location.test.ts` (+0, -3)
- `packages/opencode/test/server/httpapi-workspace.test.ts` (+0, -3)
- `packages/opencode/test/server/project-init-git.test.ts` (+0, -3)
- `packages/opencode/test/server/sdk-error-shape.test.ts` (+0, -3)
- `packages/opencode/test/server/sdk-v1-smoke.test.ts` (+0, -3)
- `packages/opencode/test/server/session-actions.test.ts` (+0, -3)
- `packages/opencode/test/server/session-diff-missing-patch.test.ts` (+0, -3)
- `packages/opencode/test/server/session-list.test.ts` (+0, -2)
- `packages/opencode/test/server/session-messages.test.ts` (+0, -3)
- `packages/opencode/test/server/session-select.test.ts` (+0, -3)
- `packages/opencode/test/session/compaction.test.ts` (+0, -3)
- `packages/opencode/test/session/messages-pagination.test.ts` (+0, -3)
- `packages/opencode/test/session/processor-effect.test.ts` (+0, -3)
- `packages/opencode/test/session/prompt.test.ts` (+27, -3)
- `packages/opencode/test/session/revert-compact.test.ts` (+0, -3)
- `packages/opencode/test/session/session.test.ts` (+0, -3)
- `packages/opencode/test/session/snapshot-tool-race.test.ts` (+0, -3)
- `packages/opencode/test/session/structured-output-integration.test.ts` (+0, -3)
- `packages/opencode/test/util/log.test.ts` (+0, -77)
- `packages/plugin/package.json` (+3, -3)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+2, -2)
- `packages/sdk/openapi.json` (+2, -2)
- `packages/server/src/middleware/schema-error.ts` (+4, -4)
- `packages/stats/app/src/routes/index.tsx` (+7, -2)
- `packages/tui/src/ui/dialog-select.tsx` (+0, -1)
- `packages/ui/src/components/line-comment.tsx` (+1, -0)
- `packages/ui/src/hooks/use-filtered-list.tsx` (+9, -4)
- `packages/web/src/content/docs/ar/go.mdx` (+3, -3)
- `packages/web/src/content/docs/bs/go.mdx` (+3, -3)
- `packages/web/src/content/docs/da/go.mdx` (+3, -3)
- `packages/web/src/content/docs/de/go.mdx` (+3, -3)
- `packages/web/src/content/docs/es/go.mdx` (+3, -3)
- `packages/web/src/content/docs/fr/go.mdx` (+3, -3)
- `packages/web/src/content/docs/go.mdx` (+3, -3)
- `packages/web/src/content/docs/it/go.mdx` (+3, -3)
- `packages/web/src/content/docs/ja/go.mdx` (+3, -3)
- `packages/web/src/content/docs/ko/go.mdx` (+3, -3)
- `packages/web/src/content/docs/nb/go.mdx` (+3, -3)
- `packages/web/src/content/docs/pl/go.mdx` (+3, -3)
- `packages/web/src/content/docs/pt-br/go.mdx` (+3, -3)
- `packages/web/src/content/docs/ru/go.mdx` (+3, -3)
- `packages/web/src/content/docs/th/go.mdx` (+3, -3)
- `packages/web/src/content/docs/tr/go.mdx` (+3, -3)
- `packages/web/src/content/docs/troubleshooting.mdx` (+14, -0)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+3, -3)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+3, -3)
- `patches/{@npmcli%2Fagent@4.0.0.patch => @npmcli%2Fagent@4.0.2.patch}` (+0, -0)

### Key Diffs

#### packages/core/src/effect/logger.ts
```diff
diff --git a/packages/core/src/effect/logger.ts b/packages/core/src/effect/logger.ts
deleted file mode 100644
index 69f9631..0000000
--- a/packages/core/src/effect/logger.ts
+++ /dev/null
@@ -1,73 +0,0 @@
-import { Cause, Effect, Logger, References } from "effect"
-import * as Log from "../util/log"
-
-type Fields = Record<string, unknown>
-
-const normalizeKey = (key: string) => (key === "sessionID" ? "session.id" : key)
-
-export interface Handle {
-  readonly debug: (msg?: unknown, extra?: Fields) => Effect.Effect<void>
-  readonly info: (msg?: unknown, extra?: Fields) => Effect.Effect<void>
-  readonly warn: (msg?: unknown, extra?: Fields) => Effect.Effect<void>
-  readonly error: (msg?: unknown, extra?: Fields) => Effect.Effect<void>
-  readonly with: (extra: Fields) => Handle
-}
-
-const clean = (input?: Fields): Fields =>
-  Object.fromEntries(
-    Object.entries(input ?? {})
-      .filter((entry) => entry[1] !== undefined && entry[1] !== null)
-      .map(([key, value]) => [normalizeKey(key), value]),
-  )
-
-const text = (input: unknown): string => {
-  // oxlint-disable-next-line no-base-to-string
-  if (Array.isArray(input)) return input.map((item) => String(item)).join(" ")
-  // oxlint-disable-next-line no-base-to-string
-  return input === undefined ? "" : String(input)
-}
-
-const call = (run: (msg?: unknown) => Effect.Effect<void>, base: Fields, msg?: unknown, extra?: Fields) => {
-  const ann = clean({ ...base, ...extra })
-  const fx = run(msg)
-  return Object.keys(ann).length ? Effect.annotateLogs(fx, ann) : fx
-}
-
-export const logger = Logger.make((opts) => {
-  const extra = clean(opts.fiber.getRef(References.CurrentLogAnnotations))
-  const now = opts.date.getTime()
-  for (const [key, start] of opts.fiber.getRef(References.CurrentLogSpans)) {
-    extra[`logSpan.${key}`] = `${now - start}ms`
-  }
-  if (opts.cause.reasons.length > 0) {
-    extra.cause = Cause.pretty(opts.cause)
-  }
```

#### packages/core/src/effect/observability.ts
```diff
diff --git a/packages/core/src/effect/observability.ts b/packages/core/src/effect/observability.ts
deleted file mode 100644
index 0203079..0000000
--- a/packages/core/src/effect/observability.ts
+++ /dev/null
@@ -1,107 +0,0 @@
-import { Effect, Layer, Logger } from "effect"
-import { FetchHttpClient } from "effect/unstable/http"
-import { OtlpLogger, OtlpSerialization } from "effect/unstable/observability"
-import * as EffectLogger from "./logger"
-import { Flag } from "../flag/flag"
-import { InstallationChannel, InstallationVersion } from "../installation/version"
-import { ensureProcessMetadata } from "../util/opencode-process"
-
-const base = Flag.OTEL_EXPORTER_OTLP_ENDPOINT
-export const enabled = !!base
-const processID = crypto.randomUUID()
-
-const headers = Flag.OTEL_EXPORTER_OTLP_HEADERS
-  ? Flag.OTEL_EXPORTER_OTLP_HEADERS.split(",").reduce(
-      (acc, x) => {
-        const [key, ...value] = x.split("=")
-        acc[key] = value.join("=")
-        return acc
-      },
-      {} as Record<string, string>,
-    )
-  : undefined
-
-export function resource(): { serviceName: string; serviceVersion: string; attributes: Record<string, string> } {
-  const processMetadata = ensureProcessMetadata("main")
-  const attributes: Record<string, string> = (() => {
-    const value = process.env.OTEL_RESOURCE_ATTRIBUTES
-    if (!value) return {}
-    try {
-      return Object.fromEntries(
-        value.split(",").map((entry) => {
-          const index = entry.indexOf("=")
-          if (index < 1) throw new Error("Invalid OTEL_RESOURCE_ATTRIBUTES entry")
-          return [decodeURIComponent(entry.slice(0, index)), decodeURIComponent(entry.slice(index + 1))]
-        }),
-      )
-    } catch {
-      return {}
-    }
-  })()
-
-  return {
-    serviceName: "opencode",
-    serviceVersion: InstallationVersion,
```

#### packages/core/src/effect/runtime.ts
```diff
diff --git a/packages/core/src/effect/runtime.ts b/packages/core/src/effect/runtime.ts
index e4f6827..6ad0f85 100644
--- a/packages/core/src/effect/runtime.ts
+++ b/packages/core/src/effect/runtime.ts
@@ -1,6 +1,6 @@
 import { Layer, type Context, ManagedRuntime, type Effect } from "effect"
 import { memoMap } from "./memo-map"
-import { Observability } from "./observability"
+import { Observability } from "../observability"
 
 export function makeRuntime<I, S, E>(service: Context.Service<I, S>, layer: Layer.Layer<I, E>) {
   let rt: ManagedRuntime.ManagedRuntime<I, E> | undefined
```

#### packages/core/src/event.ts
```diff
diff --git a/packages/core/src/event.ts b/packages/core/src/event.ts
index 0ad0714..476803f 100644
--- a/packages/core/src/event.ts
+++ b/packages/core/src/event.ts
@@ -410,9 +410,7 @@ export const layerWith = (options?: LayerOptions) =>
           Effect.catchCauseIf(
             (cause) => !Cause.hasInterrupts(cause),
             (cause) =>
-              Effect.logError("Event observer failed").pipe(
-                Effect.annotateLogs({ eventID: event.id, eventType: event.type, kind, cause }),
-              ),
+              Effect.logError("Event observer failed", { eventID: event.id, eventType: event.type, kind, cause }),
           ),
         )
 
```

#### packages/core/src/filesystem/ripgrep.ts
```diff
diff --git a/packages/core/src/filesystem/ripgrep.ts b/packages/core/src/filesystem/ripgrep.ts
index b8a171b..e0bc1c7 100644
--- a/packages/core/src/filesystem/ripgrep.ts
+++ b/packages/core/src/filesystem/ripgrep.ts
@@ -10,11 +10,8 @@ import { ChildProcessSpawner } from "effect/unstable/process/ChildProcessSpawner
 import { CrossSpawnSpawner } from "../cross-spawn-spawner"
 import { Global } from "../global"
 import { NonNegativeInt } from "../schema"
-import * as Log from "../util/log"
-import { sanitizedProcessEnv } from "../util/opencode-process"
 import { which } from "../util/which"
 
-const log = Log.create({ service: "ripgrep" })
 const VERSION = "15.1.0"
 const PLATFORM = {
   "arm64-darwin": { platform: "aarch64-apple-darwin", extension: "tar.gz" },
@@ -146,7 +143,9 @@ export class Service extends Context.Service<Service, Interface>()("@opencode/Ri
 export const use = serviceUse(Service)
 
 function env() {
-  const env = sanitizedProcessEnv()
+  const env = Object.fromEntries(
+    Object.entries(process.env).filter((entry): entry is [string, string] => entry[1] !== undefined),
+  )
   delete env.RIPGREP_CONFIG_PATH
   return env
 }
@@ -307,7 +306,7 @@ export const layer: Layer.Layer<Service, never, FSUtil.Service | ChildProcessSpa
           const url = `https://github.com/BurntSushi/ripgrep/releases/download/${VERSION}/${filename}`
           const archive = path.join(Global.Path.bin, filename)
 
-          log.info("downloading ripgrep", { url })
+          yield* Effect.logInfo("downloading ripgrep", { url })
           yield* fs.ensureDir(Global.Path.bin).pipe(Effect.orDie)
 
           const bytes = yield* HttpClientRequest.get(url).pipe(
@@ -418,7 +417,7 @@ export const layer: Layer.Layer<Service, never, FSUtil.Service | ChildProcessSpa
       })
 
       const tree: Interface["tree"] = Effect.fn("Ripgrep.tree")(function* (input: TreeInput) {
-        log.info("tree", input)
+        yield* Effect.logInfo("tree", input)
         const list = Array.from(yield* files({ cwd: input.cwd, signal: input.signal }).pipe(Stream.runCollect))
 
         interface Node {
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/agent.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/test/agent/agent.test.ts
- `src/permission/` - review permission changes from packages/opencode/src/permission/index.ts
- `src/permission/` - review permission changes from packages/opencode/src/permission/schema.ts
- `src/permission/` - review permission changes from packages/opencode/test/kilocode/permission/env-read.test.ts
- `src/permission/` - review permission changes from packages/opencode/test/permission/next.test.ts
- `src/tool/apply_patch.test.ts` - update based on kilocode packages/opencode/test/tool/apply_patch.test.ts changes
- `src/tool/edit.test.ts` - update based on kilocode packages/opencode/test/tool/edit.test.ts changes
- `src/tool/external-directory.test.ts` - update based on kilocode packages/opencode/test/tool/external-directory.test.ts changes
- `src/tool/external-directory.ts` - update based on opencode packages/opencode/src/tool/external-directory.ts changes
- `src/tool/glob.test.ts` - update based on kilocode packages/opencode/test/tool/glob.test.ts changes
- `src/tool/glob.ts` - update based on kilocode packages/opencode/src/tool/glob.ts changes
- `src/tool/grep.test.ts` - update based on kilocode packages/opencode/test/tool/grep.test.ts changes
- `src/tool/grep.ts` - update based on kilocode packages/opencode/src/tool/grep.ts changes
- `src/tool/lsp.test.ts` - update based on kilocode packages/opencode/test/tool/lsp.test.ts changes
- `src/tool/ods.ts` - update based on kilocode packages/opencode/src/kilocode/tool/ods.ts changes
- `src/tool/question.test.ts` - update based on kilocode packages/opencode/test/tool/question.test.ts changes
- `src/tool/read.test.ts` - update based on kilocode packages/opencode/test/tool/read.test.ts changes
- `src/tool/read.ts` - update based on kilocode packages/opencode/src/tool/read.ts changes
- `src/tool/registry.test.ts` - update based on kilocode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/kilocode/tool/registry.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
- `src/tool/registry.ts` - update based on opencode packages/opencode/src/tool/registry.ts changes
- `src/tool/repo_clone.test.ts` - update based on kilocode packages/opencode/test/tool/repo_clone.test.ts changes
- `src/tool/repo_clone.ts` - update based on kilocode packages/opencode/src/tool/repo_clone.ts changes
- `src/tool/repo_overview.test.ts` - update based on kilocode packages/opencode/test/tool/repo_overview.test.ts changes
- `src/tool/schema.ts` - update based on kilocode packages/opencode/src/tool/schema.ts changes
- `src/tool/shell.test.ts` - update based on kilocode packages/opencode/test/tool/shell.test.ts changes
- `src/tool/shell.ts` - update based on opencode packages/opencode/src/tool/shell.ts changes
- `src/tool/skill.test.ts` - update based on kilocode packages/opencode/test/tool/skill.test.ts changes
- `src/tool/task.test.ts` - update based on opencode packages/opencode/test/tool/task.test.ts changes
- `src/tool/task.ts` - update based on opencode packages/opencode/src/tool/task.ts changes
- `src/tool/truncate.ts` - update based on opencode packages/opencode/src/tool/truncate.ts changes
- `src/tool/webfetch.test.ts` - update based on kilocode packages/opencode/test/tool/webfetch.test.ts changes
- `src/tool/write.test.ts` - update based on kilocode packages/opencode/test/tool/write.test.ts changes
- `src/tool/xlsx.ts` - update based on kilocode packages/opencode/src/kilocode/tool/xlsx.ts changes
