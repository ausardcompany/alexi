# Upstream Changes Report
Generated: 2026-04-18 07:10:58

## Summary
- kilocode: 78 commits, 235 files changed
- opencode: 0 commits, 0 files changed

## kilocode Changes (883f12819..1b4f9cd3d)

### Commits

- 1b4f9cd3d - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-04-17)
- f1cb23a21 - Merge pull request #9152 from Kilo-Org/imanol/morph-sdk-version (Christiaan Arnoldus, 2026-04-17)
- afebe32c0 - chore: align morphsdk version to 0.2.166 across packages (Imanol Maiztegui, 2026-04-17)
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
- 6231a54a5 - docs(kilo-docs): clarify balanced and free routing in auto-model guide (kiloconnect[bot], 2026-04-17)
- 25369c799 - Merge pull request #9122 from Kilo-Org/docs/changeset-contributing (Christiaan Arnoldus, 2026-04-17)
- 032761375 - docs(kilo-docs): update kilo-auto model mappings (kiloconnect[bot], 2026-04-17)
- 07df79659 - fix(cli): wrap auto-apply effect in change markers (Alex Alecu, 2026-04-17)
- a98b10ebc - docs: document changeset workflow in contributing guide (marius-kilocode, 2026-04-17)
- 31808ccc6 - fix: improve GPT and Codex subagent usage (#9076) (Josh Holmer, 2026-04-17)
- 4ef6bbff5 - feat(agent-manager): enable /sessions command to browse and resume session history (#8976) (Marius, 2026-04-17)
- 530125828 - Add folder mentions (#9023) (Marius, 2026-04-17)
- 952b3096d - Merge pull request #9018 from Kilo-Org/kilocode-suggest-code-review (Marian Alexandru Alecu, 2026-04-17)
- 64eb4343f - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-04-17)
- 343455b87 - fix(cli): preserve per-agent model overrides (#9050) (Alex Alecu, 2026-04-17)
- 9dfa2ae35 - Merge remote-tracking branch 'origin/main' into kilocode-suggest-code-review (Alex Alecu, 2026-04-17)
- 5a4daf692 - ci: trigger workflows (Alex Alecu, 2026-04-17)
- f27063987 - fix(vscode): surface config save errors instead of silently swallowing them (#9109) (Marius, 2026-04-17)
- 76f5d5dc0 - release: v7.2.12 (kilo-maintainer[bot], 2026-04-17)
- 0965571ab - fix(cli,vscode): evict idle worktree instances and stream git output (Alex Alecu, 2026-04-17)
- 7d2f5a7ec - fix(agent-manager): preserve local sessions on reload (#9040) (Marius, 2026-04-17)
- a120efdc4 - refactor(cli): drop client-gated blocking flag from suggest tool (Alex Alecu, 2026-04-17)
- 15659e8f0 - test(vscode): lock prompt input/question decoupling (Alex Alecu, 2026-04-17)
- 233a4569f - fix(vscode): decouple prompt input from question tool (Alex Alecu, 2026-04-17)
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
- e65c2d99c - fix(gateway): hide models without tool support from list (kiloconnect[bot], 2026-04-16)
- 959a8b498 - fix(cli): move queued user prompts to end of history (kiloconnect[bot], 2026-04-16)
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
- 2f3408acd - feat: restore suggest code review tool (Alex Alecu, 2026-04-16)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/read-directory.ts` (+47, -0)
- `packages/opencode/src/kilocode/tool/registry.ts` (+5, -0)
- `packages/opencode/src/tool/bash.ts` (+3, -3)
- `packages/opencode/src/tool/read.ts` (+20, -3)
- `packages/opencode/src/tool/registry.ts` (+3, -0)
- `packages/opencode/src/tool/suggest.ts` (+2, -0)
- `packages/opencode/test/tool/registry.test.ts` (+31, -0)
- `packages/opencode/test/tool/suggest.test.ts` (+2, -0)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+2, -0)
- `packages/opencode/src/kilocode/agent/index.ts` (+3, -0)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
(no changes)

#### Other Changes
- `.changeset/custom-provider-xhigh-effort.md` (+0, -5)
- `.github/workflows/publish.yml` (+9, -73)
- `.github/workflows/smoke-test.yml` (+7, -1)
- `AGENTS.md` (+2, -0)
- `bun.lock` (+21, -40)
- `nix/hashes.json` (+4, -4)
- `package.json` (+2, -2)
- `packages/app/package.json` (+1, -1)
- `packages/desktop-electron/package.json` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/kilo-docs/lib/nav/contributing.ts` (+4, -0)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/agents/auto-model.md` (+6, -2)
- `packages/kilo-docs/pages/contributing/architecture/auto-model-tiers.md` (+6, -6)
- `packages/kilo-docs/pages/contributing/architecture/config-schema.md` (+33, -0)
- `packages/kilo-docs/pages/contributing/index.md` (+27, -0)
- `packages/kilo-docs/pages/gateway/models-and-providers.md` (+22, -19)
- `packages/kilo-docs/source-links.md` (+3, -1)
- `packages/kilo-gateway/package.json` (+1, -1)
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
- `packages/kilo-vscode/src/services/cli-backend/sdk-sse-adapter.ts` (+2, -4)
- `packages/kilo-vscode/src/services/cli-backend/server-manager.ts` (+7, -0)
- `packages/kilo-vscode/src/shared/stream-messages.ts` (+24, -0)
- `packages/kilo-vscode/src/worktree-diff-client.ts` (+54, -0)
- `packages/kilo-vscode/tests/unit/connection-utils.test.ts` (+24, -0)
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
- `packages/kilo-vscode/tests/unit/session-stream-scheduler.test.ts` (+406, -0)
- `packages/kilo-vscode/tests/unit/suggestion-recovery.test.ts` (+89, -0)
- `packages/kilo-vscode/tests/unit/worktree-state-manager.test.ts` (+11, -10)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/chat/chat-view-with-pending-question-empty-input-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/chat/message-list-tool-to-queued-user-spacing-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/chat/suggest-bar-review-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/components-shell/shell-execution-chromium-linux.png` (+2, -2)
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
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+116, -35)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+19, -8)
- `packages/kilo-vscode/webview-ui/src/components/chat/SuggestBar.tsx` (+65, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/VscodeSessionTurn.tsx` (+14, -31)
- `packages/kilo-vscode/webview-ui/src/components/chat/prompt-input-utils.ts` (+44, -0)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/MarketplaceContribute.tsx` (+19, -0)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/MarketplaceListView.tsx` (+11, -1)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/marketplace.css` (+31, -1)
- `packages/kilo-vscode/webview-ui/src/components/settings/Settings.tsx` (+42, -14)
- `packages/kilo-vscode/webview-ui/src/components/shared/WorkingIndicator.tsx` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/context/config.tsx` (+30, -5)
- `packages/kilo-vscode/webview-ui/src/context/part-stash.ts` (+63, -0)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+498, -132)
- `packages/kilo-vscode/webview-ui/src/hooks/file-mention-utils.ts` (+10, -4)
- `packages/kilo-vscode/webview-ui/src/hooks/useFileMention.ts` (+14, -7)
- `packages/kilo-vscode/webview-ui/src/hooks/useSlashCommand.ts` (+9, -5)
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
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+25, -1)
- `packages/kilo-vscode/webview-ui/src/stories/chat.stories.tsx` (+59, -1)
- `packages/kilo-vscode/webview-ui/src/stories/composite.stories.tsx` (+7, -1)
- `packages/kilo-vscode/webview-ui/src/styles/chat-layout.css` (+27, -0)
- `packages/kilo-vscode/webview-ui/src/styles/chat.css` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/styles/settings.css` (+62, -14)
- `packages/kilo-vscode/webview-ui/src/styles/suggest-bar.css` (+49, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages.ts` (+88, -7)
- `packages/opencode/CHANGELOG.md` (+22, -0)
- `packages/opencode/package.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/local.tsx` (+22, -14)
- `packages/opencode/src/cli/cmd/tui/context/sync.tsx` (+18, -1)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+60, -11)
- `packages/opencode/src/cli/cmd/tui/routes/session/question.tsx` (+9, -1)
- `packages/opencode/src/cli/cmd/tui/routes/session/suggest.tsx` (+2, -0)
- `packages/opencode/src/command/index.ts` (+6, -0)
- `packages/opencode/src/config/config.ts` (+6, -1)
- `packages/opencode/src/id/id.ts` (+1, -0)
- `packages/opencode/src/kilo-sessions/remote-sender.ts` (+54, -3)
- `packages/opencode/src/kilocode/plan-followup.ts` (+1, -0)
- `packages/opencode/src/kilocode/review/review.ts` (+29, -5)
- `packages/opencode/src/kilocode/server/instance.ts` (+2, -0)
- `packages/opencode/src/kilocode/session/prompt-queue.ts` (+19, -1)
- `packages/opencode/src/kilocode/soul.txt` (+13, -0)
- `packages/opencode/src/kilocode/suggestion/index.ts` (+195, -0)
- `packages/opencode/src/kilocode/suggestion/routes.ts` (+100, -0)
- `packages/opencode/src/kilocode/suggestion/tool.ts` (+106, -0)
- `packages/opencode/src/kilocode/suggestion/tool.txt` (+17, -0)
- `packages/opencode/src/kilocode/suggestion/tui/prompt.tsx` (+173, -0)
- `packages/opencode/src/kilocode/suggestion/tui/render.tsx` (+64, -0)
- `packages/opencode/src/kilocode/suggestion/tui/sync.ts` (+58, -0)
- `packages/opencode/src/provider/transform.ts` (+6, -4)
- `packages/opencode/src/question/index.ts` (+5, -0)
- `packages/opencode/src/server/routes/suggestion.ts` (+2, -0)
- `packages/opencode/src/session/processor.ts` (+11, -1)
- `packages/opencode/src/session/prompt.ts` (+6, -1)
- `packages/opencode/src/session/prompt/codex.txt` (+1, -0)
- `packages/opencode/src/session/prompt/gpt.txt` (+1, -0)
- `packages/opencode/src/suggestion/index.ts` (+2, -0)
- `packages/opencode/test/kilocode/bash-permission-metadata.test.ts` (+47, -0)
- `packages/opencode/test/kilocode/local-model.test.ts` (+130, -2)
- `packages/opencode/test/kilocode/prompt-dismiss-contract.test.ts` (+35, -0)
- `packages/opencode/test/kilocode/read-directory.test.ts` (+116, -0)
- `packages/opencode/test/kilocode/session-prompt-queue.test.ts` (+67, -0)
- `packages/opencode/test/kilocode/sessions/remote-sender.test.ts` (+98, -0)
- `packages/opencode/test/kilocode/suggestion/suggestion.test.ts` (+145, -0)
- `packages/opencode/test/kilocode/suggestion/tool.test.ts` (+162, -0)
- `packages/opencode/test/kilocode/transform-opus-4.7.test.ts` (+89, -0)
- `packages/opencode/test/question/question.test.ts` (+28, -0)
- `packages/opencode/test/session/prompt-effect.test.ts` (+4, -1)
- `packages/opencode/test/suggestion/suggestion.test.ts` (+2, -0)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/script/src/index.ts` (+2, -0)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+113, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+158, -0)
- `packages/sdk/openapi.json` (+213, -0)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/components/markdown.tsx` (+39, -5)
- `packages/ui/src/components/message-part.tsx` (+4, -0)
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
- `script/changelog-github.cjs` (+2, -0)
- `script/upstream/package.json` (+1, -1)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/opencode/src/agent/agent.ts
```diff
diff --git a/packages/opencode/src/agent/agent.ts b/packages/opencode/src/agent/agent.ts
index d967031ed..47d063402 100644
--- a/packages/opencode/src/agent/agent.ts
+++ b/packages/opencode/src/agent/agent.ts
@@ -102,6 +102,7 @@ export namespace Agent {
               "*": "ask",
               ...Object.fromEntries(whitelistedDirs.map((dir) => [dir, "allow"])),
             },
+            suggest: "deny", // kilocode_change
             question: "deny",
             plan_enter: "deny",
             plan_exit: "deny",
@@ -130,6 +131,7 @@ export namespace Agent {
                 defaults,
                 Permission.fromConfig({
                   question: "allow",
+                  suggest: "allow", // kilocode_change
                   plan_enter: "allow",
                 }),
                 user,
```

#### packages/opencode/src/kilocode/agent/index.ts
```diff
diff --git a/packages/opencode/src/kilocode/agent/index.ts b/packages/opencode/src/kilocode/agent/index.ts
index 700c6c2c4..39a1df800 100644
--- a/packages/opencode/src/kilocode/agent/index.ts
+++ b/packages/opencode/src/kilocode/agent/index.ts
@@ -231,6 +231,7 @@ export function patchAgents(
         defaults,
         Permission.fromConfig({
           question: "allow",
+          suggest: "allow", // kilocode_change
           plan_exit: "allow",
           bash: readOnlyBash,
           ...kilo.mcpRules,
@@ -289,6 +290,7 @@ export function patchAgents(
       defaults,
       Permission.fromConfig({
         question: "allow",
+        suggest: "allow", // kilocode_change
         plan_enter: "allow",
       }),
       user,
@@ -312,6 +314,7 @@ export function patchAgents(
         glob: "allow",
         list: "allow",
         question: "allow",
+        suggest: "allow", // kilocode_change
         task: "allow",
         todoread: "allow",
         todowrite: "allow",
```

#### packages/opencode/src/kilocode/tool/read-directory.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/read-directory.ts b/packages/opencode/src/kilocode/tool/read-directory.ts
new file mode 100644
index 000000000..f26a65bf0
--- /dev/null
+++ b/packages/opencode/src/kilocode/tool/read-directory.ts
@@ -0,0 +1,47 @@
+import { Effect } from "effect"
+import { lstat } from "fs/promises"
+import * as path from "path"
+import { AppFileSystem } from "../../filesystem"
+import { Instance } from "../../project/instance"
+import { isBinaryFile, lines } from "../../tool/read"
+
+const LIMIT = 2000
+const CONCURRENCY = 8
+
+export type DirectoryFile = {
+  filepath: string
+  content: string
+}
+
+export const readDirectoryFiles = Effect.fn("KiloReadDirectory.files")(function* (
+  fs: AppFileSystem.Interface,
+  filepath: string,
+  items: string[],
+) {
+  const entries = yield* fs.readDirectoryEntries(filepath).pipe(Effect.catch(() => Effect.succeed([])))
+  const types = new Map(entries.map((entry) => [entry.name, entry.type]))
+  const files = yield* Effect.forEach(
+    items.filter((item) => !item.endsWith("/") && types.get(item) === "file"),
+    Effect.fnUntraced(function* (item) {
+      const child = path.join(filepath, item)
+      const info = yield* Effect.promise(() => lstat(child)).pipe(Effect.catch(() => Effect.void))
+      if (!info?.isFile()) return
+      const binary = yield* Effect.promise(() => isBinaryFile(child, info.size)).pipe(
+        Effect.catch(() => Effect.succeed(true)),
+      )
+      if (binary) return
+      const file = yield* Effect.promise(() => lines(child, { limit: LIMIT, offset: 1 })).pipe(
+        Effect.catch(() => Effect.void),
+      )
+      if (!file) return
+      const rel = path.relative(Instance.directory, child).replaceAll("\\", "/")
+      const note = file.cut || file.more ? "\n\n(File truncated)" : ""
+      return {
+        filepath: child,
+        content: `<file_content path="${rel}">\n${file.raw.join("\n")}${note}\n</file_content>`,
+      }
+    }),
+    { concurrency: CONCURRENCY },
```

#### packages/opencode/src/kilocode/tool/registry.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/registry.ts b/packages/opencode/src/kilocode/tool/registry.ts
index f868f5812..c6d38c324 100644
--- a/packages/opencode/src/kilocode/tool/registry.ts
+++ b/packages/opencode/src/kilocode/tool/registry.ts
@@ -26,6 +26,11 @@ export namespace KiloToolRegistry {
     return true
   }
 
+  /** Suggest tool is only registered for cli and vscode clients */
+  export function suggest(tool: Tool.Def): Tool.Def[] {
+    return ["cli", "vscode"].includes(Flag.KILO_CLIENT) ? [tool] : []
+  }
+
   /** Kilo-specific tools to append to the builtin list */
   export function extra(
     tools: { codebase: Tool.Def; recall: Tool.Def },
```

#### packages/opencode/src/tool/bash.ts
```diff
diff --git a/packages/opencode/src/tool/bash.ts b/packages/opencode/src/tool/bash.ts
index 030030128..273e326e1 100644
--- a/packages/opencode/src/tool/bash.ts
+++ b/packages/opencode/src/tool/bash.ts
@@ -280,7 +280,7 @@ async function parse(command: string, ps: boolean) {
   return tree.rootNode
 }
 
-async function ask(ctx: Tool.Context, scan: Scan) {
+async function ask(ctx: Tool.Context, scan: Scan, command: string) { // kilocode_change
   if (scan.dirs.size > 0) {
     const globs = Array.from(scan.dirs).map((dir) => {
       if (process.platform === "win32") return Filesystem.normalizePathPattern(path.join(dir, "*"))
@@ -299,7 +299,7 @@ async function ask(ctx: Tool.Context, scan: Scan) {
     permission: "bash",
     patterns: Array.from(scan.patterns),
     always: Array.from(scan.always),
-    metadata: {},
+    metadata: { command }, // kilocode_change
   })
 }
 
@@ -479,7 +479,7 @@ export const BashTool = Tool.define("bash", async () => {
       const root = await parse(params.command, ps)
       const scan = await collect(root, cwd, ps, shell)
       if (!Instance.containsPath(cwd)) scan.dirs.add(cwd)
-      await ask(ctx, scan)
+      await ask(ctx, scan, params.command) // kilocode_change
 
       return run(
         {
```


*... and more files (showing first 5)*

## opencode Changes (c57c531..95edbc0)

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
- `src/tool/bash.ts` - update based on kilocode packages/opencode/src/tool/bash.ts changes
- `src/tool/read-directory.ts` - update based on kilocode packages/opencode/src/kilocode/tool/read-directory.ts changes
- `src/tool/read.ts` - update based on kilocode packages/opencode/src/tool/read.ts changes
- `src/tool/registry.test.ts` - update based on kilocode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/kilocode/tool/registry.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
- `src/tool/suggest.test.ts` - update based on kilocode packages/opencode/test/tool/suggest.test.ts changes
- `src/tool/suggest.ts` - update based on kilocode packages/opencode/src/tool/suggest.ts changes
