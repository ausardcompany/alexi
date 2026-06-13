# Upstream Changes Report
Generated: 2026-06-13 09:17:48

## Summary
- kilocode: 65 commits, 247 files changed
- opencode: 21 commits, 121 files changed

## kilocode Changes (0d026ef4c..fcb8802aa)

### Commits

- fcb8802aa - Merge pull request #11178 from Kilo-Org/perf/durable-snapshot-initialization (Catriel Müller, 2026-06-12)
- 37a761839 - Merge pull request #11184 from Kilo-Org/snow-recorder (Marius, 2026-06-12)
- 0f2fe8db9 - perf(cli): optimize all root snapshot initialization (marius-kilocode, 2026-06-12)
- 96a16102b - fix(cli): validate external download inputs (#11179) (Marius, 2026-06-12)
- 0b34c14db - perf(cli): avoid quadratic snapshot path matching (marius-kilocode, 2026-06-12)
- adf03a982 - feat: support subagent reasoning overrides (marius-kilocode, 2026-06-12)
- 987061513 - test(cli): cover snapshot fallback and interruption edges (marius-kilocode, 2026-06-12)
- 1380be41e - fix(cli): harden snapshot materialization cleanup (marius-kilocode, 2026-06-12)
- c4f91031c - test(cli): stabilize snapshot materialization checks (marius-kilocode, 2026-06-12)
- f63e77153 - perf(cli): accelerate durable snapshot initialization (marius-kilocode, 2026-06-12)
- c6d5325d6 - release: v7.3.45 (kilo-maintainer[bot], 2026-06-12)
- 1362bcf76 - Merge pull request #11169 from Kilo-Org/immediate-tricorne (Marius, 2026-06-12)
- 579caef24 - Merge pull request #11152 from Kilo-Org/resisted-conchoraptor (Marius, 2026-06-12)
- f8b17e2f6 - fix(jetbrains): clean up prompt enhancement lifecycle (#11176) (Marius, 2026-06-12)
- a55b661b7 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-12)
- fc68b934a - fix: isolate runner startup ordering (marius-kilocode, 2026-06-12)
- 21bcd4be4 - Merge pull request #11175 from Kilo-Org/fix/vscode-hide-todo-outcome-warning (Marius, 2026-06-12)
- cacbcc628 - fix(vscode): prune stale question routes (marius-kilocode, 2026-06-12)
- 555dc2359 - feat(vscode): render submitted review comments across chat surfaces (#11173) (Marius, 2026-06-12)
- fb62e61ca - fix(vscode): hide unfinished todo warnings (marius-kilocode, 2026-06-12)
- b38f87a03 - Merge pull request #11138 from IamCoder18/cli-console-restart-on-port-mismatch (Catriel Müller, 2026-06-12)
- 57f2e794c - Add agent autonomy presets (#9750) (Marius, 2026-06-12)
- e2b56eb92 - refactor: fix test (Catriel Müller, 2026-06-12)
- e2939c755 - fix(vscode): route questions through request directories (marius-kilocode, 2026-06-12)
- 35a708062 - Merge pull request #11165 from Kilo-Org/occipital-element (Marius, 2026-06-12)
- 518aa7866 - Merge pull request #10827 from Kilo-Org/feat/opus-vscode-deep-link (Joshua Lambert, 2026-06-12)
- bf6715594 - feat(jetbrains): add prompt enhancement (marius-kilocode, 2026-06-12)
- 680f50581 - refactor: fix test (Catriel Müller, 2026-06-12)
- 7922c9278 - Merge branch 'main' into feat/opus-vscode-deep-link (Joshua Lambert, 2026-06-12)
- d8671cc39 - refactor: improve flaky test (Catriel Müller, 2026-06-12)
- be0d5ef3b - Merge branch 'main' into cli-console-restart-on-port-mismatch (Catriel Müller, 2026-06-12)
- 5413c807d - refactor: refactor solution to include daemon command (Catriel Müller, 2026-06-12)
- b90ab85c3 - ci: clarify auto-close reopen message (#11163) (Johnny Eric Amancio, 2026-06-12)
- 471120907 - release: v7.3.44 (kilo-maintainer[bot], 2026-06-12)
- 0edfcf3e3 - Merge pull request #11147 from Kilo-Org/catrielmuller/kilo-console-ui-improvements (Catriel Müller, 2026-06-12)
- 9df58d79a - fix(vscode): correct changeset package name (#11162) (Imanol Maiztegui, 2026-06-12)
- 4b5e7e622 - refactor: fix merge (Catriel Müller, 2026-06-12)
- ef017c528 - Merge branch 'main' into cli-console-restart-on-port-mismatch (Catriel Müller, 2026-06-12)
- 91eb3ed44 - Merge pull request #11148 from senguangd/fix/powershell-encoding (Catriel Müller, 2026-06-12)
- 2f7657fd8 - Merge pull request #11143 from IamCoder18/feat/cli-port-discovery-warning (Catriel Müller, 2026-06-12)
- c220a7552 - refactor: isolate the changes inside of the kilo folders (Catriel Müller, 2026-06-12)
- 303b67a26 - refactor: fix kilo marker (Catriel Müller, 2026-06-12)
- eb4d2e6ff - fix: fix kilo pierre theme (Catriel Müller, 2026-06-12)
- 912984422 - perf(agent-manager): virtualize expanded diff reviews (#11154) (Marius, 2026-06-12)
- 78d83c065 - fix(cli): inherit reasoning in task subagents (#11160) (Marius, 2026-06-12)
- 7955f865d - Render streaming assistant rows outside virtualizer (#11153) (Imanol Maiztegui, 2026-06-12)
- 65e6d0c8e - refactor: address comments (Catriel Müller, 2026-06-12)
- 846505368 - Merge branch 'main' into fix/powershell-encoding (senguangd, 2026-06-12)
- b23d3dfd7 - fix: abort prompts during startup (marius-kilocode, 2026-06-12)
- a09dafe61 - fix(vscode): abort moved active sessions (marius-kilocode, 2026-06-12)
- 6e0639b8c - fix(shell): use EncodedCommand for PowerShell to fix Windows encoding issues (Senguang Ding, 2026-06-12)
- 9a187d5aa - feat: improve Kilo Console project review (Catriel Müller, 2026-06-12)
- 12144cf82 - chore: add changeset for port discovery warning (Aarav Sharma, 2026-06-11)
- e35430580 - chore: add changeset for console restart fix (Aarav Sharma, 2026-06-11)
- 35dd730dc - feat: kilo console dialogs (Catriel Müller, 2026-06-11)
- 63294a4b2 - fix(cli): restart daemon when console requested host/port don't match (Aarav Sharma, 2026-06-11)
- 4ba2bac7a - feat(cli): warn when --port is outside discovery range (Aarav Sharma, 2026-06-11)
- 14d0cc2b9 - refactor(vscode): reuse model selection for deep links (Josh Lambert, 2026-06-11)
- 4c5b17a0e - refactor(vscode): simplify model deep link handling (Josh Lambert, 2026-06-11)
- b06d91de4 - Merge branch 'main' into feat/opus-vscode-deep-link (Joshua Lambert, 2026-06-11)
- c6ec51712 - Merge remote-tracking branch 'origin/main' into feat/opus-vscode-deep-link (Josh Lambert, 2026-06-04)
- 7691373d8 - fix(vscode): refresh catalog for model deep links (Josh Lambert, 2026-06-04)
- 235e769fb - fix(vscode): generalize model deep links (Josh Lambert, 2026-06-03)
- d1b29009d - fix(vscode): harden promoted model deep links (Josh Lambert, 2026-06-03)
- b06b42d2e - feat(kilo-vscode): support promoted model deep links (Josh Lambert, 2026-06-02)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/task.ts` (+24, -4)
- `packages/opencode/src/tool/shell.ts` (+1, -1)
- `packages/opencode/src/tool/task.ts` (+1, -0)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)

#### Other Changes
- `.changeset/avoid-repeat-compactions.md` (+0, -5)
- `.changeset/bright-subagents-reason.md` (+6, -0)
- `.changeset/calm-agents-keep-worktrees.md` (+0, -5)
- `.changeset/calm-shells-timeout.md` (+0, -5)
- `.changeset/clear-empty-models.md` (+0, -5)
- `.changeset/clear-kilo-commands.md` (+0, -5)
- `.changeset/default-lancedb-search.md` (+0, -7)
- `.changeset/dismiss-stale-permissions.md` (+0, -5)
- `.changeset/fast-agent-snapshots.md` (+0, -5)
- `.changeset/fast-agent-transcripts.md` (+0, -5)
- `.changeset/fast-regular-snapshots.md` (+5, -0)
- `.changeset/fast-session-forks.md` (+0, -7)
- `.changeset/fresh-provider-models.md` (+0, -5)
- `.changeset/honest-model-badges.md` (+0, -7)
- `.changeset/keep-error-status-inline.md` (+0, -5)
- `.changeset/prevent-subagent-questions.md` (+0, -6)
- `.changeset/quick-local-prompts.md` (+0, -5)
- `.changeset/quick-subagent-transcripts.md` (+0, -5)
- `.changeset/quiet-binary-diffs.md` (+0, -5)
- `.changeset/quiet-kilo-attention.md` (+0, -5)
- `.changeset/quiet-qdrant-warnings.md` (+0, -5)
- `.changeset/remove-vscode-paste-summary.md` (+0, -5)
- `.changeset/restore-failed-question-replies.md` (+0, -7)
- `.changeset/restore-kilo-cli-commands.md` (+0, -5)
- `.changeset/restore-scout-codesearch.md` (+0, -6)
- `.changeset/restore-vercel-providers.md` (+0, -6)
- `.changeset/route-shared-permissions.md` (+0, -5)
- `.changeset/route-worktree-questions.md` (+5, -0)
- `.changeset/scoped-indexing-settings.md` (+0, -6)
- `.changeset/secure-external-downloads.md` (+5, -0)
- `.changeset/select-custom-question-answer.md` (+0, -5)
- `.changeset/session-patches-stay-whole.md` (+0, -5)
- `.changeset/share-vscode-session-database.md` (+0, -5)
- `.changeset/steady-tui-streams.md` (+0, -5)
- `.changeset/terminal-integrated-font.md` (+0, -5)
- `.changeset/warm-agent-manager-mcp.md` (+0, -5)
- `.github/workflows/kilo-auto-close.yml` (+2, -2)
- `bun.lock` (+20, -20)
- `package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-console/src/client.ts` (+4, -1)
- `packages/kilo-console/src/components/ConfirmDialog.tsx` (+16, -6)
- `packages/kilo-console/src/components/PromptDialog.tsx` (+73, -0)
- `packages/kilo-console/src/layouts/ConfigLayout.tsx` (+0, -7)
- `packages/kilo-console/src/routes/config/ConfigSidebar.tsx` (+2, -1)
- `packages/kilo-console/src/routes/config/ConsoleUiRoute.tsx` (+100, -0)
- `packages/kilo-console/src/routes/config/sections.tsx` (+10, -0)
- `packages/kilo-console/src/routes/config/state/console.test.ts` (+36, -0)
- `packages/kilo-console/src/routes/config/state/console.ts` (+80, -0)
- `packages/kilo-console/src/routes/projects/ProjectConsoleRoute.tsx` (+269, -73)
- `packages/kilo-console/src/styles/cli-ui.css` (+14, -0)
- `packages/kilo-console/src/styles/project-console.css` (+82, -59)
- `packages/kilo-console/src/styles/providers.css` (+32, -5)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/diff-panel-with-diffs-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/full-screen-diff-with-changes-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/full-screen-diff-with-collapsed-context-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/message-list-subagent-to-queued-user-spacing-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/message-list-tool-to-queued-user-spacing-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/user-message-review-comments-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/agent-behaviour-workflows-empty-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/work-style-onboarding-200-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/work-style-onboarding-default-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/source-links.md` (+2, -0)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/CHANGELOG.md` (+6, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendChatManager.kt` (+44, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloCliDataParser.kt` (+7, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloSessionRpcApiImpl.kt` (+3, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendChatManagerTest.kt` (+51, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/MockCliServer.kt` (+9, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/KiloNotifications.kt` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloSessionService.kt` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionController.kt` (+40, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/PromptPanel.kt` (+72, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/wand-sparkles.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/wand-sparkles_dark.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+6, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ar.properties` (+6, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_bs.properties` (+6, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_da.properties` (+6, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_de.properties` (+6, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_es.properties` (+6, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_fr.properties` (+6, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ja.properties` (+6, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ko.properties` (+6, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_nl.properties` (+6, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_no.properties` (+6, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pl.properties` (+6, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pt_BR.properties` (+6, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ru.properties` (+6, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_th.properties` (+6, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_tr.properties` (+6, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_uk.properties` (+6, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_CN.properties` (+6, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_TW.properties` (+6, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/app/KiloSessionServiceTest.kt` (+9, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/PromptEnhancerTest.kt` (+67, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/PromptPanelTest.kt` (+129, -17)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeSessionRpcApi.kt` (+12, -0)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloSessionRpcApi.kt` (+3, -0)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/message-part.tsx` (+12, -6)
- `packages/kilo-vscode/CHANGELOG.md` (+78, -0)
- `packages/kilo-vscode/package.json` (+21, -2)
- `packages/kilo-vscode/src/KiloProvider.ts` (+54, -2)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+4, -3)
- `packages/kilo-vscode/src/agent-manager/local-diff.ts` (+31, -1)
- `packages/kilo-vscode/src/agent-manager/worktree-diff-controller.ts` (+13, -9)
- `packages/kilo-vscode/src/extension.ts` (+18, -10)
- `packages/kilo-vscode/src/kilo-provider/handlers/cloud-session.ts` (+4, -1)
- `packages/kilo-vscode/src/kilo-provider/handlers/question.ts` (+96, -22)
- `packages/kilo-vscode/src/kilo-provider/work-style-apply-handler.ts` (+59, -0)
- `packages/kilo-vscode/src/kilo-provider/work-style-apply.ts` (+63, -0)
- `packages/kilo-vscode/src/kilo-provider/work-style.ts` (+87, -0)
- `packages/kilo-vscode/src/services/cli-backend/connection-service.ts` (+52, -2)
- `packages/kilo-vscode/src/services/telemetry/types.ts` (+2, -0)
- `packages/kilo-vscode/src/shared/review-comments.ts` (+118, -0)
- `packages/kilo-vscode/src/shared/work-style-presets.ts` (+160, -0)
- `packages/kilo-vscode/tests/diff-scroll-preservation.spec.ts` (+51, -1)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/unit/abort-state.test.ts` (+64, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+2, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-diff-state.test.ts` (+34, -52)
- `packages/kilo-vscode/tests/unit/connection-service-question.test.ts` (+71, -0)
- `packages/kilo-vscode/tests/unit/local-diff.test.ts` (+58, -1)
- `packages/kilo-vscode/tests/unit/prompt-input-utils.test.ts` (+13, -9)
- `packages/kilo-vscode/tests/unit/question-handler.test.ts` (+293, -78)
- `packages/kilo-vscode/tests/unit/review-comments.test.ts` (+36, -0)
- `packages/kilo-vscode/tests/unit/session-outcome.test.ts` (+3, -3)
- `packages/kilo-vscode/tests/unit/settings-io.test.ts` (+12, -1)
- `packages/kilo-vscode/tests/unit/transcript-rows.test.ts` (+61, -26)
- `packages/kilo-vscode/tests/unit/work-style-apply.test.ts` (+97, -0)
- `packages/kilo-vscode/tests/unit/work-style-presets.test.ts` (+61, -0)
- `packages/kilo-vscode/tests/unit/work-style-state.test.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/DiffPanel.tsx` (+54, -32)
- `packages/kilo-vscode/webview-ui/diff-viewer/FullScreenDiffView.tsx` (+57, -56)
- `packages/kilo-vscode/webview-ui/diff-viewer/VirtualDiffList.tsx` (+40, -0)
- `packages/kilo-vscode/webview-ui/diff-viewer/diff-open-policy.ts` (+5, -22)
- `packages/kilo-vscode/webview-ui/pierre-worker.ts` (+14, -6)
- `packages/kilo-vscode/webview-ui/src/App.tsx` (+28, -13)
- `packages/kilo-vscode/webview-ui/src/components/chat/ChatView.tsx` (+4, -2)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+42, -53)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+52, -141)
- `packages/kilo-vscode/webview-ui/src/components/chat/ReviewComments.tsx` (+129, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/SidebarEmptyState.tsx` (+39, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/TranscriptRow.tsx` (+4, -4)
- `packages/kilo-vscode/webview-ui/src/components/chat/VscodeUserMessage.tsx` (+42, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/WelcomeEmptyState.tsx` (+63, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/prompt-input-utils.ts` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/components/settings/ModelsTab.tsx` (+33, -24)
- `packages/kilo-vscode/webview-ui/src/components/settings/settings-io.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/components/shared/WorkStylePicker.tsx` (+56, -0)
- `packages/kilo-vscode/webview-ui/src/context/abort-state.ts` (+50, -0)
- `packages/kilo-vscode/webview-ui/src/context/onboarding/work-style-toasts.ts` (+23, -0)
- `packages/kilo-vscode/webview-ui/src/context/session-outcome.ts` (+0, -1)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+64, -7)
- `packages/kilo-vscode/webview-ui/src/context/transcript-rows.ts` (+21, -10)
- `packages/kilo-vscode/webview-ui/src/context/work-style-state.ts` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/context/work-style.tsx` (+117, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+25, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+26, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+25, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+26, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+27, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+25, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+27, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+26, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+25, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+25, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+27, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+25, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+26, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+27, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+25, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+27, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+25, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+25, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+25, -0)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/stories/agent-manager.stories.tsx` (+4, -2)
- `packages/kilo-vscode/webview-ui/src/stories/chat.stories.tsx` (+56, -1)
- `packages/kilo-vscode/webview-ui/src/stories/settings.stories.tsx` (+32, -0)
- `packages/kilo-vscode/webview-ui/src/styles/prompt-input.css` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/styles/settings.css` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/styles/welcome.css` (+174, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/agent-manager.ts` (+1, -8)
- `packages/kilo-vscode/webview-ui/src/types/messages/config.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+27, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/parts.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+21, -0)
- `packages/kilo-vscode/webview-ui/src/utils/review-comment-markdown.ts` (+5, -33)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+60, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/cli/cmd/github.ts` (+5, -1)
- `packages/opencode/src/cli/network.ts` (+28, -4)
- `packages/opencode/src/config/config.ts` (+18, -0)
- `packages/opencode/src/effect/runner.ts` (+17, -12)
- `packages/opencode/src/kilocode/cli/cmd/console.ts` (+6, -3)
- `packages/opencode/src/kilocode/cli/cmd/daemon.ts` (+13, -3)
- `packages/opencode/src/kilocode/cli/port-warning.ts` (+11, -0)
- `packages/opencode/src/kilocode/daemon/daemon.ts` (+54, -13)
- `packages/opencode/src/kilocode/effect/runner.ts` (+24, -0)
- `packages/opencode/src/kilocode/security/github.ts` (+26, -0)
- `packages/opencode/src/kilocode/shell/shell.ts` (+16, -0)
- `packages/opencode/src/kilocode/snapshot/materialize.ts` (+231, -0)
- `packages/opencode/src/kilocode/snapshot/seed.ts` (+65, -24)
- `packages/opencode/src/lsp/server.ts` (+9, -3)
- `packages/opencode/src/shell/shell.ts` (+4, -3)
- `packages/opencode/src/snapshot/index.ts` (+113, -33)
- `packages/opencode/src/util/archive.ts` (+10, -2)
- `packages/opencode/test/kilocode/archive-security.test.ts` (+27, -0)
- `packages/opencode/test/kilocode/cli/cmd/console.test.ts` (+87, -0)
- `packages/opencode/test/kilocode/config/config.test.ts` (+37, -0)
- `packages/opencode/test/kilocode/config/console-ui.test.ts` (+23, -0)
- `packages/opencode/test/kilocode/daemon.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/runner-start-order.test.ts` (+95, -0)
- `packages/opencode/test/kilocode/security-github.test.ts` (+28, -0)
- `packages/opencode/test/kilocode/shell/shell.test.ts` (+31, -0)
- `packages/opencode/test/kilocode/snapshot-seed.test.ts` (+368, -12)
- `packages/opencode/test/kilocode/tool-task-model.test.ts` (+110, -11)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+10, -0)
- `packages/sdk/openapi.json` (+22, -0)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/context/marked.tsx` (+11, -371)
- `packages/ui/src/pierre/kilo-diff-theme.ts` (+402, -0)
- `packages/ui/src/pierre/worker.ts` (+10, -1)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 399035f26..2d0b4fb7a 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.3.42",
+  "version": "7.3.45",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/opencode/src/kilocode/tool/task.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/task.ts b/packages/opencode/src/kilocode/tool/task.ts
index ea61421eb..8590ebb87 100644
--- a/packages/opencode/src/kilocode/tool/task.ts
+++ b/packages/opencode/src/kilocode/tool/task.ts
@@ -84,6 +84,10 @@ export namespace KiloTask {
   type Saved = Model & { variant?: string }
   type Choice = { model: Model; variant?: string; sticky?: boolean; direct?: boolean }
 
+  function key(model: Model) {
+    return `${model.providerID}/${model.modelID}`
+  }
+
   function parse(value: string | null | undefined): Model | undefined {
     if (!value) return undefined
     const [providerID, ...parts] = value.split("/")
@@ -117,12 +121,14 @@ export namespace KiloTask {
   export const resolveModel = Effect.fn("KiloTask.resolveModel")(function* (input: {
     name: string
     agent: Pick<Agent.Info, "model" | "variant">
-    config: Pick<Config.Info, "subagent_model" | "subagent_variant">
+    config: Pick<Config.Info, "subagent_model" | "subagent_variant" | "subagent_variant_overrides">
     parent: Model
+    variant?: string
     provider: Provider.Interface
   }) {
     const state = yield* saved(input.name)
     const cfg = parse(input.config.subagent_model)
+    const override = (model: Model) => input.config.subagent_variant_overrides?.[key(model)] ?? undefined
     const choices: Array<Choice | undefined> = [
       state
         ? {
@@ -137,7 +143,13 @@ export namespace KiloTask {
 
     for (const choice of choices) {
       if (!choice) continue
-      if (choice.direct) return { model: choice.model, variant: choice.variant }
+      if (choice.direct) {
+        const value = override(choice.model)
+        if (!value) return { model: choice.model, variant: choice.variant }
+        const full = yield* input.provider.getModel(choice.model.providerID, choice.model.modelID)
+        const variant = full.variants?.[value] ? value : choice.variant
+        return { model: choice.model, variant }
+      }
       const full = yield* input.provider.getModel(choice.model.providerID, choice.model.modelID).pipe(
         Effect.catchTag("ProviderModelNotFoundError", (err) =>
           Effect.sync(() => {
@@ -151,13 +163,21 @@ export namespace KiloTask {
         ),
       )
       if (!full) continue
```

#### packages/opencode/src/tool/shell.ts
```diff
diff --git a/packages/opencode/src/tool/shell.ts b/packages/opencode/src/tool/shell.ts
index db3699af1..2261619cb 100644
--- a/packages/opencode/src/tool/shell.ts
+++ b/packages/opencode/src/tool/shell.ts
@@ -312,7 +312,7 @@ const ask = Effect.fn("ShellTool.ask")(function* (
 
 function cmd(shell: string, command: string, cwd: string, env: NodeJS.ProcessEnv) {
   if (process.platform === "win32" && Shell.ps(shell)) {
-    return ChildProcess.make(shell, ["-NoLogo", "-NoProfile", "-NonInteractive", "-Command", command], {
+    return ChildProcess.make(shell, Shell.args(shell, command, cwd), { // kilocode_change - encoded PowerShell args
       cwd,
       env,
       stdin: "ignore",
```

#### packages/opencode/src/tool/task.ts
```diff
diff --git a/packages/opencode/src/tool/task.ts b/packages/opencode/src/tool/task.ts
index 7d948bd85..4d80b1252 100644
--- a/packages/opencode/src/tool/task.ts
+++ b/packages/opencode/src/tool/task.ts
@@ -212,6 +212,7 @@ export const TaskTool = Tool.define(
           modelID: msg.info.modelID,
           providerID: msg.info.providerID,
         },
+        variant: msg.info.variant,
         provider,
       })
       const model = selected.model
```


## opencode Changes (bf4c647..d733487)

### Commits

- d733487 - chore: generate (opencode-agent[bot], 2026-06-13)
- 2630f45 - fix(app): fade overflowing titlebar tabs (#32082) (Luke Parker, 2026-06-13)
- dbbe67f - chore: generate (opencode-agent[bot], 2026-06-12)
- fff0ec2 - fix(tui): prevent duplicate renderable IDs (#32110) (Sebastian, 2026-06-13)
- cf2d1dd - fix(tui): restore subtask invocation spacing (#32109) (Aiden Cline, 2026-06-12)
- 27ca0f8 - docs: update North Mini Code privacy terms (#32096) (Stefan Avram, 2026-06-12)
- 73dbd8a - chore: generate (opencode-agent[bot], 2026-06-12)
- 443f103 - go: kimi 2.7 code (Frank, 2026-06-12)
- 6c36b58 - chore: generate (opencode-agent[bot], 2026-06-12)
- c2e6b18 - feat(core): refactor project copies for v2 (#31943) (James Long, 2026-06-12)
- 8d97c8d - chore: generate (opencode-agent[bot], 2026-06-12)
- f8b357b - fix(data): mobile breakpoint for nav (Adam, 2026-06-12)
- 621796d - feat(stats): add world map markers (Adam, 2026-06-12)
- ba2455e - feat(stats): use catalog pricing in efficiency and token costs (Adam, 2026-06-12)
- 44308df - fix(stats): tighten truncated label line height (Adam, 2026-06-12)
- b000256 - chore: generate (opencode-agent[bot], 2026-06-12)
- 30b2544 - refactor(opencode): build server from layer nodes (#32086) (James Long, 2026-06-12)
- 1b096b4 - fix(opencode): clear closed MCP clients (#32084) (Aiden Cline, 2026-06-12)
- be22750 - fix(opencode): expose structured MCP output (#32074) (Aiden Cline, 2026-06-12)
- 4ddfa7c - fix(stats): reorder leaderboard cards (Adam, 2026-06-12)
- 2415434 - feat(go): promote MiniMax M3 usage limits (#31986) (Jack, 2026-06-12)

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
- `packages/core/schema.json` (+13, -3)
- `packages/core/src/database/migration.gen.ts` (+1, -0)
- `packages/core/src/database/migration/20260612174303_project_dir_strategy.ts` (+29, -0)
- `packages/core/src/database/schema.gen.ts` (+2, -1)
- `packages/core/src/location-layer.ts` (+12, -0)
- `packages/core/src/project.ts` (+21, -47)
- `packages/core/src/project/copy-strategies.ts` (+10, -19)
- `packages/core/src/project/copy.ts` (+152, -132)
- `packages/core/src/project/directories.ts` (+159, -0)
- `packages/core/src/project/schema.ts` (+20, -0)
- `packages/core/src/project/sql.ts` (+6, -5)
- `packages/core/src/ripgrep.ts` (+2, -0)
- `packages/core/src/ripgrep/binary.ts` (+4, -0)
- `packages/core/test/location-layer.test.ts` (+1, -1)
- `packages/core/test/move-session.test.ts` (+4, -1)
- `packages/core/test/project-copy.test.ts` (+104, -29)
- `packages/core/test/project-directories.test.ts` (+63, -0)
- `packages/core/test/project.test.ts` (+5, -50)
- `packages/stats/core/src/domain/home.ts` (+0, -1)

#### Other Changes
- `packages/app/src/components/titlebar.css` (+46, -0)
- `packages/app/src/components/titlebar.tsx` (+88, -71)
- `packages/console/app/src/i18n/ar.ts` (+5, -4)
- `packages/console/app/src/i18n/br.ts` (+5, -4)
- `packages/console/app/src/i18n/da.ts` (+5, -4)
- `packages/console/app/src/i18n/de.ts` (+5, -4)
- `packages/console/app/src/i18n/en.ts` (+5, -4)
- `packages/console/app/src/i18n/es.ts` (+5, -4)
- `packages/console/app/src/i18n/fr.ts` (+5, -4)
- `packages/console/app/src/i18n/it.ts` (+5, -4)
- `packages/console/app/src/i18n/ja.ts` (+5, -4)
- `packages/console/app/src/i18n/ko.ts` (+5, -4)
- `packages/console/app/src/i18n/no.ts` (+5, -4)
- `packages/console/app/src/i18n/pl.ts` (+5, -4)
- `packages/console/app/src/i18n/ru.ts` (+5, -4)
- `packages/console/app/src/i18n/th.ts` (+5, -4)
- `packages/console/app/src/i18n/tr.ts` (+5, -4)
- `packages/console/app/src/i18n/uk.ts` (+5, -4)
- `packages/console/app/src/i18n/zh.ts` (+5, -4)
- `packages/console/app/src/i18n/zht.ts` (+5, -4)
- `packages/console/app/src/routes/go/index.css` (+35, -0)
- `packages/console/app/src/routes/go/index.tsx` (+22, -7)
- `packages/console/app/src/routes/workspace/[id]/go/lite-section.tsx` (+7, -8)
- `packages/opencode/src/cli/cmd/run/footer.command.tsx` (+2, -23)
- `packages/opencode/src/cli/cmd/run/footer.menu.tsx` (+0, -2)
- `packages/opencode/src/cli/cmd/run/footer.permission.tsx` (+1, -11)
- `packages/opencode/src/cli/cmd/run/footer.prompt.tsx` (+2, -3)
- `packages/opencode/src/cli/cmd/run/footer.question.tsx` (+2, -9)
- `packages/opencode/src/cli/cmd/run/footer.subagent.tsx` (+1, -7)
- `packages/opencode/src/cli/cmd/run/footer.view.tsx` (+9, -51)
- `packages/opencode/src/cli/cmd/run/scrollback.surface.ts` (+0, -6)
- `packages/opencode/src/cli/cmd/run/scrollback.writer.tsx` (+0, -1)
- `packages/opencode/src/cli/cmd/run/splash.ts` (+0, -4)
- `packages/opencode/src/mcp/catalog.ts` (+9, -3)
- `packages/opencode/src/mcp/index.ts` (+20, -2)
- `packages/opencode/src/project/project.ts` (+15, -25)
- `packages/opencode/src/server/routes/instance/httpapi/groups/project-copy.ts` (+13, -69)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/project-copy.ts` (+28, -102)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+92, -73)
- `packages/opencode/test/cli/run/footer.view.test.tsx` (+55, -15)
- `packages/opencode/test/project/project-directory.test.ts` (+42, -10)
- `packages/opencode/test/project/project.test.ts` (+3, -3)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+12, -0)
- `packages/opencode/test/server/project-copy.test.ts` (+21, -9)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+136, -96)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+227, -190)
- `packages/sdk/openapi.json` (+625, -523)
- `packages/server/src/api.ts` (+2, -0)
- `packages/server/src/groups/location.ts` (+12, -3)
- `packages/server/src/groups/project-copy.ts` (+57, -0)
- `packages/server/src/handlers.ts` (+2, -0)
- `packages/server/src/handlers/project-copy.ts` (+68, -0)
- `packages/stats/app/src/routes/[lab]/[model].tsx` (+67, -5)
- `packages/stats/app/src/routes/index.css` (+22, -8)
- `packages/stats/app/src/routes/index.tsx` (+80, -22)
- `packages/stats/app/src/routes/model-catalog.ts` (+77, -5)
- `packages/stats/app/src/routes/stats-shell.tsx` (+1, -1)
- `packages/tui/src/component/dialog-move-session.tsx` (+124, -41)
- `packages/tui/src/component/prompt/move.tsx` (+15, -3)
- `packages/tui/src/context/project.tsx` (+1, -2)
- `packages/tui/src/feature-plugins/system/diff-viewer.tsx` (+0, -2)
- `packages/tui/src/routes/session/index.tsx` (+15, -6)
- `packages/tui/src/ui/dialog-select.tsx` (+13, -4)
- `packages/tui/test/cli/tui/__snapshots__/inline-tool-wrap-snapshot.test.tsx.snap` (+16, -0)
- `packages/tui/test/cli/tui/diff-viewer.test.tsx` (+11, -9)
- `packages/tui/test/cli/tui/inline-tool-wrap-snapshot.test.tsx` (+36, -0)
- `packages/web/src/content/docs/ar/go.mdx` (+11, -13)
- `packages/web/src/content/docs/ar/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/bs/go.mdx` (+12, -14)
- `packages/web/src/content/docs/bs/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/da/go.mdx` (+12, -14)
- `packages/web/src/content/docs/da/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/de/go.mdx` (+11, -13)
- `packages/web/src/content/docs/de/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/es/go.mdx` (+12, -14)
- `packages/web/src/content/docs/es/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/fr/go.mdx` (+11, -13)
- `packages/web/src/content/docs/fr/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/go.mdx` (+12, -14)
- `packages/web/src/content/docs/it/go.mdx` (+12, -14)
- `packages/web/src/content/docs/it/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/ja/go.mdx` (+11, -13)
- `packages/web/src/content/docs/ja/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/ko/go.mdx` (+11, -13)
- `packages/web/src/content/docs/ko/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/nb/go.mdx` (+12, -14)
- `packages/web/src/content/docs/nb/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/pl/go.mdx` (+12, -14)
- `packages/web/src/content/docs/pl/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/pt-br/go.mdx` (+12, -14)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/ru/go.mdx` (+12, -14)
- `packages/web/src/content/docs/ru/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/th/go.mdx` (+11, -13)
- `packages/web/src/content/docs/th/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/tr/go.mdx` (+11, -13)
- `packages/web/src/content/docs/tr/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+11, -13)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+11, -13)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+1, -1)

### Key Diffs

#### packages/core/schema.json
```diff
diff --git a/packages/core/schema.json b/packages/core/schema.json
index 954b3b9..c041a4e 100644
--- a/packages/core/schema.json
+++ b/packages/core/schema.json
@@ -1,8 +1,8 @@
 {
   "version": "7",
   "dialect": "sqlite",
-  "id": "abd2f920-b822-49af-b8a7-2e48367d424f",
-  "prevIds": ["f25f9126-c7dc-4882-9ff4-af27e11d2da1"],
+  "id": "169a0f0f-d58f-479f-b024-fa1c7b9a09db",
+  "prevIds": ["abd2f920-b822-49af-b8a7-2e48367d424f"],
   "ddl": [
     {
       "name": "workspace",
@@ -622,7 +622,7 @@
     },
     {
       "type": "text",
-      "notNull": true,
+      "notNull": false,
       "autoincrement": false,
       "default": null,
       "generated": null,
@@ -630,6 +630,16 @@
       "entityType": "columns",
       "table": "project_directory"
     },
+    {
+      "type": "text",
+      "notNull": false,
+      "autoincrement": false,
+      "default": null,
+      "generated": null,
+      "name": "strategy",
+      "entityType": "columns",
+      "table": "project_directory"
+    },
     {
       "type": "integer",
       "notNull": true,
```

#### packages/core/src/database/migration.gen.ts
```diff
diff --git a/packages/core/src/database/migration.gen.ts b/packages/core/src/database/migration.gen.ts
index 44a3549..1e915bb 100644
--- a/packages/core/src/database/migration.gen.ts
+++ b/packages/core/src/database/migration.gen.ts
@@ -36,5 +36,6 @@ export const migrations = (
     import("./migration/20260605042240_add_context_epoch_agent"),
     import("./migration/20260611035744_credential"),
     import("./migration/20260611192811_lush_chimera"),
+    import("./migration/20260612174303_project_dir_strategy"),
   ])
 ).map((module) => module.default) satisfies DatabaseMigration.Migration[]
```

#### packages/core/src/database/migration/20260612174303_project_dir_strategy.ts
```diff
diff --git a/packages/core/src/database/migration/20260612174303_project_dir_strategy.ts b/packages/core/src/database/migration/20260612174303_project_dir_strategy.ts
new file mode 100644
index 0000000..1f09c40
--- /dev/null
+++ b/packages/core/src/database/migration/20260612174303_project_dir_strategy.ts
@@ -0,0 +1,29 @@
+import { Effect } from "effect"
+import type { DatabaseMigration } from "../migration"
+
+export default {
+  id: "20260612174303_project_dir_strategy",
+  up(tx) {
+    return Effect.gen(function* () {
+      yield* tx.run(`ALTER TABLE \`project_directory\` ADD \`strategy\` text;`)
+      yield* tx.run(`PRAGMA foreign_keys=OFF;`)
+      yield* tx.run(`
+        CREATE TABLE \`__new_project_directory\` (
+          \`project_id\` text NOT NULL,
+          \`directory\` text NOT NULL,
+          \`type\` text,
+          \`strategy\` text,
+          \`time_created\` integer NOT NULL,
+          CONSTRAINT \`project_directory_pk\` PRIMARY KEY(\`project_id\`, \`directory\`),
+          CONSTRAINT \`fk_project_directory_project_id_project_id_fk\` FOREIGN KEY (\`project_id\`) REFERENCES \`project\`(\`id\`) ON DELETE CASCADE
+        );
+      `)
+      yield* tx.run(
+        `INSERT INTO \`__new_project_directory\`(\`project_id\`, \`directory\`, \`type\`, \`time_created\`) SELECT \`project_id\`, \`directory\`, \`type\`, \`time_created\` FROM \`project_directory\`;`,
+      )
+      yield* tx.run(`DROP TABLE \`project_directory\`;`)
+      yield* tx.run(`ALTER TABLE \`__new_project_directory\` RENAME TO \`project_directory\`;`)
+      yield* tx.run(`PRAGMA foreign_keys=ON;`)
+    })
+  },
+} satisfies DatabaseMigration.Migration
```

#### packages/core/src/database/schema.gen.ts
```diff
diff --git a/packages/core/src/database/schema.gen.ts b/packages/core/src/database/schema.gen.ts
index 7330e8b..5c044ec 100644
--- a/packages/core/src/database/schema.gen.ts
+++ b/packages/core/src/database/schema.gen.ts
@@ -101,7 +101,8 @@ export default {
         CREATE TABLE \`project_directory\` (
           \`project_id\` text NOT NULL,
           \`directory\` text NOT NULL,
-          \`type\` text NOT NULL,
+          \`type\` text,
+          \`strategy\` text,
           \`time_created\` integer NOT NULL,
           CONSTRAINT \`project_directory_pk\` PRIMARY KEY(\`project_id\`, \`directory\`),
           CONSTRAINT \`fk_project_directory_project_id_project_id_fk\` FOREIGN KEY (\`project_id\`) REFERENCES \`project\`(\`id\`) ON DELETE CASCADE
```

#### packages/core/src/location-layer.ts
```diff
diff --git a/packages/core/src/location-layer.ts b/packages/core/src/location-layer.ts
index 81f3756..cdaefe2 100644
--- a/packages/core/src/location-layer.ts
+++ b/packages/core/src/location-layer.ts
@@ -9,11 +9,14 @@ import { CommandV2 } from "./command"
 import { AgentV2 } from "./agent"
 import { PluginBoot } from "./plugin/boot"
 import { Project } from "./project"
+import { ProjectCopy } from "./project/copy"
+import { ProjectDirectories } from "./project/directories"
 import { EventV2 } from "./event"
 import { Credential } from "./credential"
 import { Npm } from "./npm"
 import { ModelsDev } from "./models-dev"
 import { FSUtil } from "./fs-util"
+import { Git } from "./git"
 import { Global } from "./global"
 import { Database } from "./database/database"
 import { PermissionV2 } from "./permission"
@@ -63,6 +66,7 @@ export class LocationServiceMap extends LayerMap.Service<LocationServiceMap>()("
       CommandV2.locationLayer,
       AgentV2.locationLayer,
       PluginBoot.locationLayer,
+      ProjectCopy.locationLayer,
       FileSystem.locationLayer,
       Watcher.locationLayer,
       Pty.locationLayer,
@@ -98,6 +102,11 @@ export class LocationServiceMap extends LayerMap.Service<LocationServiceMap>()("
       Layer.provide(skillGuidance),
       Layer.provide(referenceGuidance),
     )
+
+    // Kick off a background project copy refresh to update locations now that we
+    // have a location
+    const projectCopyRefresh = Layer.effectDiscard(ProjectCopy.refreshAfterBoot).pipe(Layer.provide(services))
+
     return Layer.mergeAll(
       boot,
       services,
@@ -110,6 +119,7 @@ export class LocationServiceMap extends LayerMap.Service<LocationServiceMap>()("
       runner,
       builtInTools,
       referenceGuidance,
+      projectCopyRefresh,
     ).pipe(Layer.fresh)
   },
   idleTimeToLive: "60 minutes",
@@ -120,10 +130,12 @@ export class LocationServiceMap extends LayerMap.Service<LocationServiceMap>()("
     Npm.defaultLayer,
     ModelsDev.defaultLayer,
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/package.json
- `src/tool/shell.ts` - update based on kilocode packages/opencode/src/tool/shell.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/kilocode/tool/task.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/tool/task.ts changes
