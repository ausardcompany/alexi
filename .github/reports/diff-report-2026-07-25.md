# Upstream Changes Report
Generated: 2026-07-25 08:06:52

## Summary
- kilocode: 75 commits, 225 files changed
- opencode: 26 commits, 118 files changed

## kilocode Changes (aa22680fe..eab61d853)

### Commits

- eab61d853 - Merge pull request #12505 from Kilo-Org/fix/run-duplicate-events (Joshua Lambert, 2026-07-24)
- d6b45d323 - Merge pull request #12410 from Kilo-Org/investigate-pane-auto-resize-behavior (Joshua Lambert, 2026-07-24)
- 61a704334 - fix(ci): pass KILO_ORG_ID to docs-sync LLM steps (#12519) (Igor Šćekić, 2026-07-24)
- e3fc1d73a - Merge pull request #12517 from Kilo-Org/chore/jetbrains-cli-pin-v7.4.16 (Kirill Kalishev, 2026-07-24)
- 3c9e0e198 - Merge pull request #12518 from Kilo-Org/achieved-pumpkin (Kirill Kalishev, 2026-07-24)
- 32652b017 - fix(jetbrains): prune bundled CLI cache (kirillk, 2026-07-24)
- d266efcda - chore(jetbrains): rename bundled publish workflow (kirillk, 2026-07-24)
- d39b22040 - fix(jetbrains): harden bundled release workflow (kirillk, 2026-07-24)
- e1ef4f989 - Merge branch 'main' into investigate-pane-auto-resize-behavior (Joshua Lambert, 2026-07-24)
- 452d0eb55 - feat(jetbrains): publish bundled CLI builds (kirillk, 2026-07-24)
- 2a5c6e2af - chore(jetbrains): bump CLI pin to v7.4.16 (kilo-maintainer[bot], 2026-07-24)
- f80ebff83 - release: v7.4.16 (kilo-maintainer[bot], 2026-07-24)
- 1346963e5 - feat: daily docs-sync bot keeping kilo-docs in sync with merged PRs (#12512) (Igor Šćekić, 2026-07-24)
- c72817e67 - fix(cli): bound skill discovery in non-git projects (#12475) (LCZcn96, 2026-07-24)
- bada1c389 - Merge pull request #12515 from Kilo-Org/fix/silent-kilo-pass-refresh (Joshua Lambert, 2026-07-24)
- c4af7072e - Merge pull request #12516 from Kilo-Org/jetbrains/release/v7.0.10 (Kirill Kalishev, 2026-07-24)
- 783be6c43 - docs(jetbrains): edit changelog for v7.0.10 (Kirill Kalishev, 2026-07-24)
- 489601e5f - release(jetbrains): v7.0.10 (kilo-maintainer[bot], 2026-07-24)
- 9e1b54d87 - fix: activate plan handoff sessions and retry recovered question replies (#12511) (Johnny Eric Amancio, 2026-07-24)
- 5bd5b9000 - Merge pull request #12513 from Kilo-Org/standardize-queued-message-remove-button (Marius, 2026-07-24)
- 5b866245c - Merge pull request #12494 from Kilo-Org/feat/explain-tool-auto-approval (bagatao@anaconda.com, 2026-07-24)
- faa810f3e - test(gateway): cover Kilo Pass response failures (Josh Lambert, 2026-07-24)
- f715e2f5f - fix(tui): silence optional Kilo Pass failures (Josh Lambert, 2026-07-24)
- c3a38ea1c - Merge branch 'feat/explain-tool-auto-approval' of github.com:Kilo-Org/kilocode into feat/explain-tool-auto-approval (Bruno Agatao, 2026-07-24)
- 9c1645708 - Merge remote-tracking branch 'origin/main' into feat/explain-tool-auto-approval (Bruno Agatao, 2026-07-24)
- c1f057ad5 - fix(ui): align queued message remove button with message action buttons (marius-kilocode, 2026-07-24)
- e511ed74b - Merge pull request #12496 from Kilo-Org/fix/preserve-other-finish-reason (Marius, 2026-07-24)
- 470d78bfa - Merge branch 'main' into fix/preserve-other-finish-reason (Marius, 2026-07-24)
- 1ea363b99 - Merge pull request #12510 from Kilo-Org/docs/fix-fireworks-pricing-link (Marius, 2026-07-24)
- 81e73bcf3 - Merge pull request #12509 from Kilo-Org/filter-sessions-by-worktree (Marius, 2026-07-24)
- ce83cf655 - docs: fix Fireworks AI pricing link in ai-providers page (marius-kilocode, 2026-07-24)
- b3e6fb780 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-07-24)
- 99c04c716 - feat(agent-manager): filter sessions by worktree (marius-kilocode, 2026-07-24)
- 6edf6ca7e - Merge branch 'main' into feat/explain-tool-auto-approval (bagatao@anaconda.com, 2026-07-24)
- 0fe46ecb8 - fix: recover from read-only database files at startup (#12508) (Johnny Eric Amancio, 2026-07-24)
- d4da7ddff - chore(vscode): format AssistantMessage import (Bruno Agatao, 2026-07-24)
- 40fd27d22 - fix(cli): validate persisted Vercel request IDs (marius-kilocode, 2026-07-24)
- 0eb9face8 - Merge remote-tracking branch 'origin/main' into feat/explain-tool-auto-approval (Bruno Agatao, 2026-07-24)
- b36b24e82 - fix(cli): track auto-approval provenance per permission pattern, not per key (Bruno Agatao, 2026-07-24)
- 9ecdfdc19 - fix(vscode): persist both response identifiers (marius-kilocode, 2026-07-24)
- d29f1bdd4 - fix(vscode): show both response identifiers (marius-kilocode, 2026-07-24)
- 2fcb137eb - fix: preserve unexpected provider finish reasons (marius-kilocode, 2026-07-24)
- 1a3c71917 - Merge pull request #12491 from Kilo-Org/granite-anemone (Kirill Kalishev, 2026-07-24)
- f0b3a829b - Delete .kilo/plans/1784814134016-jetbrains-session-scroll-perf.md (Kirill Kalishev, 2026-07-24)
- e6f421608 - Merge pull request #12497 from Kilo-Org/revert/stream-stall-watchdog (Marius, 2026-07-24)
- 7f37d015e - fix(cli): tag permission rules by origin so auto-approval provenance is accurate (Bruno Agatao, 2026-07-24)
- 207feccdb - fix(ui): restore unrelated deleteQueued string dropped during i18n move (Bruno Agatao, 2026-07-24)
- 75862be1d - refactor(ui): move tool-approval provenance UI into kilo-owned packages (Bruno Agatao, 2026-07-24)
- a4177125b - Merge pull request #12485 from rakshith1928/fix/12477-compaction-maxoutputtokens-leak (Christiaan Arnoldus, 2026-07-24)
- 62f1093c6 - docs(cli): clarify upstream event revert (Josh Lambert, 2026-07-24)
- bcf8b8b9a - fix(cli): emit run events once (Josh Lambert, 2026-07-23)
- 79e606ebc - fix(jetbrains): scope transcript scroll-hover work to the hovered pane (kirillk, 2026-07-23)
- ff2d42071 - fix(jetbrains): address diff-preview review feedback (kirillk, 2026-07-23)
- 8228a4d04 - fix(jetbrains): address diff-preview review feedback (kirillk, 2026-07-23)
- 95ae0e0b3 - fix(jetbrains): improve chat transcript scrolling performance in large sessions (kirillk, 2026-07-23)
- 2b13e7da2 - fix(jetbrains): polish diff previews (kirillk, 2026-07-23)
- dd3104400 - fix(jetbrains): distinguish multi-file patches (kirillk, 2026-07-23)
- b2a3a8dc1 - fix(jetbrains): widen preview popovers (kirillk, 2026-07-23)
- 73942c3f2 - fix(jetbrains): open exact edit tool file links (kirillk, 2026-07-23)
- 5c526f140 - feat(jetbrains): render edit tool diffs (kirillk, 2026-07-23)
- 23963e32c - chore: document stream watchdog revert (marius-kilocode, 2026-07-23)
- 8e9bdaeb2 - Revert "fix(cli): prevent stalled agent streams (#12249)" (marius-kilocode, 2026-07-23)
- 69960b1fd - Merge remote-tracking branch 'origin/main' into feat/explain-tool-auto-approval (Bruno Agatao, 2026-07-23)
- ff02a977c - test(cli): cover approval-provenance metadata preservation (Bruno Agatao, 2026-07-23)
- 85dbf443a - chore: changeset for tool auto-approval provenance (Bruno Agatao, 2026-07-23)
- 59782aea1 - docs: note project config reload for auto-approve (Bruno Agatao, 2026-07-23)
- e72068d0a - feat(vscode): surface tool auto-approval provenance in chat (Bruno Agatao, 2026-07-23)
- e38986062 - feat(ui): show why a tool call was auto-approved (Bruno Agatao, 2026-07-23)
- c1530a9df - feat(cli): record tool-call approval provenance on tool metadata (Bruno Agatao, 2026-07-23)
- 073df1645 - feat(cli): resolve why a tool call was auto-approved (Bruno Agatao, 2026-07-23)
- 4250ad9a7 - feat(cli): track config scope for each permission key (Bruno Agatao, 2026-07-23)
- 651b16591 - Update .changeset/compaction-maxoutputtokens-leak.md (rakshith1928, 2026-07-23)
- 079fd04b4 - chore: add changeset for maxOutputTokens leak fix (Rakshith N, 2026-07-23)
- 56be86ef0 - fix(cli): stop leaking maxOutputTokens into provider options during compaction (Rakshith N, 2026-07-23)
- 85d65a313 - fix(vscode): preserve active editor pane (Josh Lambert, 2026-07-18)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt` (+276, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/PatchBody.kt` (+191, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ReadToolView.kt` (+4, -17)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt` (+35, -112)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolMarkdownBody.kt` (+102, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt` (+239, -47)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
- `packages/opencode/src/kilocode/permission/provenance.ts` (+101, -0)
- `packages/opencode/src/permission/index.ts` (+20, -4)
- `packages/opencode/test/kilocode/permission/next.always-rules.test.ts` (+9, -9)
- `packages/opencode/test/kilocode/permission/permission-origins.test.ts` (+84, -0)
- `packages/opencode/test/kilocode/permission/provenance.test.ts` (+228, -0)
- `packages/opencode/test/permission/next.test.ts` (+3, -3)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/database/database.ts` (+2, -0)
- `packages/core/src/kilocode/db-preflight.ts` (+68, -0)
- `packages/core/src/v1/config/provider.ts` (+2, -4)
- `packages/core/src/v1/session.ts` (+2, -0)
- `packages/core/test/kilocode/db-preflight.test.ts` (+123, -0)

#### Other Changes
- `.changeset/agent-notify-user-tool.md` (+0, -5)
- `.changeset/calm-lists-enter.md` (+0, -5)
- `.changeset/cli-live-reconnect.md` (+0, -5)
- `.changeset/config-schema-injection-jsonc.md` (+0, -5)
- `.changeset/first-content-watchdog.md` (+0, -5)
- `.changeset/grumpy-cougars-see.md` (+0, -7)
- `.changeset/harden-planning-agent-edits.md` (+0, -5)
- `.changeset/jetbrains-bundled-cli.md` (+5, -0)
- `.changeset/queue-changed-snapshot.md` (+0, -5)
- `.changeset/quiet-json-events.md` (+5, -0)
- `.changeset/remote-instance-advertisement.md` (+0, -5)
- `.changeset/remote-session-file-attachments.md` (+0, -5)
- `.changeset/run-cloud-agent.md` (+0, -5)
- `.changeset/session-mentions.md` (+0, -6)
- `.changeset/session-tab-switcher.md` (+0, -5)
- `.changeset/show-vercel-response-id.md` (+0, -6)
- `.changeset/steady-editor-tabs.md` (+5, -0)
- `.changeset/token-throughput-v2.md` (+0, -6)
- `.github/docs-sync/collect.mjs` (+137, -0)
- `.github/docs-sync/edit-prompt.md` (+24, -0)
- `.github/docs-sync/edit.mjs` (+122, -0)
- `.github/docs-sync/extract-json.mjs` (+76, -0)
- `.github/docs-sync/filter-worthy.mjs` (+24, -0)
- `.github/docs-sync/lib.mjs` (+113, -0)
- `.github/docs-sync/prepare-branch.mjs` (+61, -0)
- `.github/docs-sync/triage-prompt.md` (+19, -0)
- `.github/docs-sync/triage.mjs` (+111, -0)
- `.github/docs-sync/upsert-pr.mjs` (+241, -0)
- `.github/docs-sync/watermark.mjs` (+75, -0)
- `.github/workflows/docs-sync.yml` (+166, -0)
- `.github/workflows/publish-jetbrains-bundled.yml` (+321, -0)
- `.github/workflows/publish-jetbrains.yml` (+14, -0)
- `bun.lock` (+26, -26)
- `package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/ai-providers/fireworks.md` (+1, -1)
- `packages/kilo-docs/pages/getting-started/settings/auto-approving-actions.md` (+4, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/history-sessionlist/worktree-sources-chromium-linux.png` (+3, -0)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-gateway/src/api/kilo-pass.ts` (+2, -6)
- `packages/kilo-gateway/test/api/kilo-pass.test.ts` (+30, -2)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/AGENTS.md` (+1, -0)
- `packages/kilo-jetbrains/CHANGELOG.md` (+33, -0)
- `packages/kilo-jetbrains/README.md` (+1, -1)
- `packages/kilo-jetbrains/RELEASE_TODO.md` (+4, -0)
- `packages/kilo-jetbrains/RELEASING.md` (+10, -0)
- `packages/kilo-jetbrains/backend/build.gradle.kts` (+19, -1)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloBackendCliManager.kt` (+2, -2)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloRepoCli.kt` (+57, -9)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/KiloRepoCliTest.kt` (+46, -0)
- `packages/kilo-jetbrains/build-tasks/src/main/kotlin/StageBundledCliTask.kt` (+225, -0)
- `packages/kilo-jetbrains/build-tasks/src/main/kotlin/StageRepoCliTask.kt` (+18, -1)
- `packages/kilo-jetbrains/docs/bundled-release-plan.md` (+64, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/scroll/SessionScroll.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionLayout.kt` (+34, -7)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanel.kt` (+45, -13)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/popup/HeaderPopup.kt` (+34, -6)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/style/SessionUiStyle.kt` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/MessageView.kt` (+33, -14)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/TurnView.kt` (+20, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/ViewFactory.kt` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/hybrid/MdDiffHighlight.kt` (+90, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/hybrid/MdLanguage.kt` (+9, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/hybrid/MdViewHybrid.kt` (+60, -14)
- `packages/kilo-jetbrains/frontend/src/main/resources/kilo.jetbrains.frontend.xml` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ar.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_bs.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_da.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_de.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_es.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_fr.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ja.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ko.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_nl.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_no.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pl.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pt_BR.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ru.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_th.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_tr.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_uk.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_CN.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_TW.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionLayoutTest.kt` (+82, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanelTest.kt` (+176, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/EditToolViewTest.kt` (+476, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ReadToolViewTest.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ReasoningViewTest.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ShellToolViewTest.kt` (+29, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ToolBodyStressTest.kt` (+38, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/md/MdViewHybridTest.kt` (+20, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/md/hybrid/MdDiffHighlightTest.kt` (+31, -0)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-memory/package.json` (+1, -1)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/basic-tool.css` (+22, -0)
- `packages/kilo-ui/src/components/basic-tool.tsx` (+13, -3)
- `packages/kilo-ui/src/components/message-part.css` (+12, -15)
- `packages/kilo-ui/src/components/message-part.tsx` (+38, -32)
- `packages/kilo-ui/src/components/tool-approval.tsx` (+86, -0)
- `packages/kilo-vscode/CHANGELOG.md` (+35, -0)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+3, -2)
- `packages/kilo-vscode/src/SettingsEditorProvider.ts` (+2, -2)
- `packages/kilo-vscode/src/extension.ts` (+11, -36)
- `packages/kilo-vscode/src/kilo-provider/handlers/question.ts` (+45, -23)
- `packages/kilo-vscode/tests/history-accessibility.spec.ts` (+25, -0)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/unit/extension-arch.test.ts` (+27, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-followup.test.ts` (+1, -1)
- `packages/kilo-vscode/tests/unit/local-tabs.test.ts` (+20, -0)
- `packages/kilo-vscode/tests/unit/question-handler.test.ts` (+86, -10)
- `packages/kilo-vscode/tests/unit/session-outcome.test.ts` (+44, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/AssistantMessage.tsx` (+41, -29)
- `packages/kilo-vscode/webview-ui/src/components/history/HistoryView.tsx` (+64, -14)
- `packages/kilo-vscode/webview-ui/src/components/history/SessionList.tsx` (+10, -3)
- `packages/kilo-vscode/webview-ui/src/components/shared/TurnOutcome.tsx` (+6, -2)
- `packages/kilo-vscode/webview-ui/src/context/local-tabs.tsx` (+3, -6)
- `packages/kilo-vscode/webview-ui/src/context/session-outcome.ts` (+18, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/stories/history.stories.tsx` (+21, -0)
- `packages/kilo-vscode/webview-ui/src/styles/history.css` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/parts.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/utils/local-tabs.ts` (+16, -0)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/llm/src/schema/ids.ts` (+9, -1)
- `packages/opencode/CHANGELOG.md` (+49, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/cli/cmd/run.ts` (+3, -4)
- `packages/opencode/src/cli/cmd/run/demo.ts` (+1, -2)
- `packages/opencode/src/cli/cmd/run/event.ts` (+0, -53)
- `packages/opencode/src/cli/cmd/run/session-data.ts` (+1, -2)
- `packages/opencode/src/cli/cmd/run/stream.transport.ts` (+5, -4)
- `packages/opencode/src/cli/cmd/run/subagent-data.ts` (+1, -2)
- `packages/opencode/src/config/config.ts` (+23, -0)
- `packages/opencode/src/kilocode/provider/provider.ts` (+0, -168)
- `packages/opencode/src/kilocode/session/compaction-chunks.ts` (+4, -10)
- `packages/opencode/src/kilocode/session/llm.ts` (+14, -313)
- `packages/opencode/src/kilocode/session/processor.ts` (+9, -1)
- `packages/opencode/src/kilocode/session/prompt.ts` (+17, -5)
- `packages/opencode/src/kilocode/session/response-metadata.ts` (+9, -2)
- `packages/opencode/src/kilocode/tui/config.ts` (+1, -0)
- `packages/opencode/src/provider/provider.ts` (+47, -16)
- `packages/opencode/src/session/llm.ts` (+6, -45)
- `packages/opencode/src/session/processor.ts` (+15, -3)
- `packages/opencode/src/session/tools.ts` (+10, -2)
- `packages/opencode/src/skill/index.ts` (+1, -1)
- `packages/opencode/src/storage/db.ts` (+2, -0)
- `packages/opencode/test/cli/run/run-process.test.ts` (+20, -4)
- `packages/opencode/test/cli/run/stream.transport.test.ts` (+52, -24)
- `packages/opencode/test/kilocode/non-git-global-skills.test.ts` (+74, -0)
- `packages/opencode/test/kilocode/provider/provider.test.ts` (+0, -168)
- `packages/opencode/test/kilocode/sandbox/session-tools.test.ts` (+1, -0)
- `packages/opencode/test/kilocode/session-compaction-chunks.test.ts` (+133, -0)
- `packages/opencode/test/kilocode/session-generation-id.test.ts` (+23, -0)
- `packages/opencode/test/kilocode/session-processor-empty-tool-calls.test.ts` (+15, -3)
- `packages/opencode/test/kilocode/session-response-metadata.test.ts` (+11, -0)
- `packages/opencode/test/kilocode/session-stream-watchdog.test.ts` (+0, -626)
- `packages/opencode/test/kilocode/session/llm.test.ts` (+20, -68)
- `packages/opencode/test/kilocode/session/session-stream-watchdog.test.ts` (+0, -499)
- `packages/opencode/test/provider/header-timeout.test.ts` (+1, -67)
- `packages/opencode/test/session/llm.test.ts` (+2, -2)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+55, -45)
- `packages/sdk/openapi.json` (+8, -11)
- `packages/server/package.json` (+1, -1)
- `packages/storybook/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `script/check-workflows.ts` (+2, -0)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index a1554885e..d5f73a398 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.4.15",
+  "version": "7.4.16",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/database/database.ts
```diff
diff --git a/packages/core/src/database/database.ts b/packages/core/src/database/database.ts
index fe03a6281..6cecde150 100644
--- a/packages/core/src/database/database.ts
+++ b/packages/core/src/database/database.ts
@@ -7,6 +7,7 @@ import { Global } from "../global"
 import { Flag } from "../flag/flag"
 import { isAbsolute, join } from "path"
 import { existsSync } from "fs" // kilocode_change
+import { DbPreflight } from "../kilocode/db-preflight" // kilocode_change
 import { DatabaseMigration } from "./migration"
 import { InstallationChannel } from "../installation/version"
 import { LayerNode } from "../effect/layer-node"
@@ -38,6 +39,7 @@ export const layer = Layer.effect(
 )
 
 export function layerFromPath(filename: string) {
+  DbPreflight.assertWritable(filename) // kilocode_change - actionable error (and self-heal for kilo-owned files) instead of an opaque wal_checkpoint crash on read-only db files
   return layer.pipe(Layer.provide(sqliteLayer({ filename })))
 }
 
```

#### packages/core/src/kilocode/db-preflight.ts
```diff
diff --git a/packages/core/src/kilocode/db-preflight.ts b/packages/core/src/kilocode/db-preflight.ts
new file mode 100644
index 000000000..4f2119808
--- /dev/null
+++ b/packages/core/src/kilocode/db-preflight.ts
@@ -0,0 +1,68 @@
+export * as DbPreflight from "./db-preflight"
+
+import { accessSync, chmodSync, constants, statSync } from "fs"
+import path from "path"
+import { Global } from "../global"
+import { Log } from "../util/log"
+
+const log = Log.create({ service: "db-preflight" })
+
+function writable(target: string) {
+  try {
+    accessSync(target, constants.W_OK)
+    return true
+  } catch {
+    return false
+  }
+}
+
+function exists(target: string) {
+  try {
+    statSync(target)
+    return true
+  } catch {
+    return false
+  }
+}
+
+// Startup runs `PRAGMA wal_checkpoint(PASSIVE)`, which must write the database and its
+// WAL sidecars. A stray read-only file otherwise kills the process deep inside Effect
+// with an opaque "attempt to write a readonly database".
+export function assertWritable(filename: string, trusted: string = Global.Path.data) {
+  if (!filename || filename === ":memory:" || filename.startsWith("file:")) return
+  const dir = path.dirname(filename)
+  const owned = path.resolve(dir) === path.resolve(trusted)
+  let missing = false
+  for (const file of [filename, `${filename}-wal`, `${filename}-shm`]) {
+    if (!exists(file)) {
+      missing = true
+      continue
+    }
+    if (writable(file)) continue
+    let cause: unknown
+    if (owned) {
+      // chmod only succeeds for files the current user owns, which is exactly the safe repair scope
```

#### packages/core/src/v1/config/provider.ts
```diff
diff --git a/packages/core/src/v1/config/provider.ts b/packages/core/src/v1/config/provider.ts
index a2cac706d..4b884fc0d 100644
--- a/packages/core/src/v1/config/provider.ts
+++ b/packages/core/src/v1/config/provider.ts
@@ -115,11 +115,9 @@ export const Info = Schema.Struct({
           description:
             "Timeout in milliseconds to wait for response headers. Provider integrations may set defaults. Set to false to disable timeout.",
         }),
-        // kilocode_change: accept `false` so internal callers can disable the
-        // watchdog. PositiveInt already excludes 0, so a public zero stays invalid.
-        chunkTimeout: Schema.optional(Schema.Union([PositiveInt, Schema.Literal(false)])).annotate({
+        chunkTimeout: Schema.optional(PositiveInt).annotate({
           description:
-            "Timeout in milliseconds between streamed SSE chunks for this provider. If no chunk arrives within this window, the request is aborted. Set to false to disable the idle watchdog. The pre-content bound is only shape-aware for OpenAI-compatible SSE and otherwise uses the request `timeout` budget.",
+            "Timeout in milliseconds between streamed SSE chunks for this provider. If no chunk arrives within this window, the request is aborted.",
         }),
       }),
       [Schema.Record(Schema.String, Schema.Any)],
```

#### packages/core/src/v1/session.ts
```diff
diff --git a/packages/core/src/v1/session.ts b/packages/core/src/v1/session.ts
index bb193febc..eef2cee8d 100644
--- a/packages/core/src/v1/session.ts
+++ b/packages/core/src/v1/session.ts
@@ -253,6 +253,8 @@ export const StepFinishPart = Schema.Struct({
       modelID: ModelV2.ID,
     }),
   ),
+  generationID: Schema.optional(Schema.String), // kilocode_change
+  vercelID: Schema.optional(Schema.String), // kilocode_change
   metrics: Schema.optional(
     Schema.Struct({
       prompt: Schema.optional(Schema.Finite),
```


*... and more files (showing first 5)*

## opencode Changes (ce7f54d..2b2b69d)

### Commits

- 2b2b69d - fix(app): refresh V1 MCP state (#38816) (Brendan Allan, 2026-07-25)
- 9e8b217 - fix(app): refresh V1 providers after auth (#38786) (opencode-agent[bot], 2026-07-25)
- 5e2a625 - chore: generate (opencode-agent[bot], 2026-07-25)
- 065dc27 - fix(core): branch-keyed repository cache with gated reference readiness (#38759) (Kit Langton, 2026-07-24)
- a85d8d2 - sync release versions for v1.18.5 (opencode, 2026-07-24)
- 2b2aacc - fix(provider): generalize Claude adaptive thinking (#38757) (Aiden Cline, 2026-07-24)
- 7840562 - fix(llm): revert response message phases (#38761) (Aiden Cline, 2026-07-24)
- 53669ca - chore: generate (opencode-agent[bot], 2026-07-24)
- 4b19ea2 - fix(llm): preserve response message phases (#38452) (Aiden Cline, 2026-07-24)
- 553b42f - Merge branch 'dev' of github.com:anomalyco/opencode into dev (Frank, 2026-07-24)
- e62b09e - zen: opus 5 (Frank, 2026-07-24)
- f516651 - fix(opencode): preserve grep symlink paths (#38581) (Zach Bruggeman, 2026-07-24)
- e639969 - fix(opencode): preserve grep symlink paths (#38581) (Zach Bruggeman, 2026-07-24)
- 909db63 - fix(app): restore optimistic timeline state (#38693) (Brendan Allan, 2026-07-24)
- 66495a2 - chore: generate (opencode-agent[bot], 2026-07-24)
- 9ba82a1 - fix(app): gate legacy server features (#38651) (Brendan Allan, 2026-07-24)
- b628066 - fix(app): preserve inline file mentions (#38663) (Brendan Allan, 2026-07-24)
- ae4be98 - chore: generate (opencode-agent[bot], 2026-07-24)
- ad78ef5 - feat(app): support current pty transport (#38463) (Brendan Allan, 2026-07-24)
- 67a0478 - fix(app): gate config permission auto-accept (#38650) (Brendan Allan, 2026-07-24)
- aaa42fe - fix(app): isolate v2 servers from legacy layout (#38649) (Brendan Allan, 2026-07-24)
- 3337495 - chore: generate (opencode-agent[bot], 2026-07-24)
- 80a4fe8 - fix(app): remove diff rendering from file-specific tabs (#38662) (Brendan Allan, 2026-07-24)
- 91ed256 - refactor(app): resolve server protocol state (#38648) (Brendan Allan, 2026-07-24)
- c4545ab - chore: generate (opencode-agent[bot], 2026-07-24)
- 57ddfeb - fix(app): classify existing web profiles for layout transition (#38117) (Devin R Leopold, 2026-07-24)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/grep.ts` (+4, -1)
- `packages/opencode/test/tool/grep.test.ts` (+2, -0)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/console/core/package.json` (+1, -1)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/reference.ts` (+1, -5)
- `packages/core/src/repository-cache.ts` (+40, -42)
- `packages/core/src/repository.ts` (+8, -2)
- `packages/core/test/reference.test.ts` (+1, -1)
- `packages/core/test/repository-cache.test.ts` (+36, -1)
- `packages/core/test/repository.test.ts` (+6, -0)
- `packages/stats/core/package.json` (+1, -1)

#### Other Changes
- `bun.lock` (+28, -28)
- `packages/app/V1_API_MIGRATION.md` (+220, -0)
- `packages/app/e2e/regression/remote-session-settings.spec.ts` (+37, -5)
- `packages/app/e2e/regression/review-line-comment.spec.ts` (+3, -2)
- `packages/app/e2e/regression/review-state-persistence.spec.ts` (+9, -6)
- `packages/app/e2e/regression/review-terminal-stacked.spec.ts` (+63, -21)
- `packages/app/e2e/regression/terminal-composer-focus.spec.ts` (+36, -18)
- `packages/app/e2e/regression/terminal-hidden.spec.ts` (+42, -5)
- `packages/app/e2e/regression/terminal-tab-switch.spec.ts` (+29, -9)
- `packages/app/package.json` (+1, -1)
- `packages/app/src/app.tsx` (+24, -0)
- `packages/app/src/components/dialog-connect-provider.tsx` (+3, -3)
- `packages/app/src/components/dialog-custom-provider.tsx` (+1, -0)
- `packages/app/src/components/dialog-select-server.tsx` (+19, -1)
- `packages/app/src/components/prompt-input/submit.test.ts` (+3, -0)
- `packages/app/src/components/prompt-input/submit.ts` (+1, -0)
- `packages/app/src/components/settings-general.tsx` (+7, -5)
- `packages/app/src/components/settings-providers.tsx` (+31, -26)
- `packages/app/src/components/settings-v2/dialog-settings-v2.tsx` (+18, -2)
- `packages/app/src/components/settings-v2/general.tsx` (+7, -5)
- `packages/app/src/components/settings-v2/providers.tsx` (+40, -30)
- `packages/app/src/components/status-popover-body.tsx` (+35, -24)
- `packages/app/src/components/terminal.tsx` (+62, -23)
- `packages/app/src/context/global-sync/bootstrap.test.ts` (+13, -3)
- `packages/app/src/context/global-sync/bootstrap.ts` (+9, -2)
- `packages/app/src/context/layout.tsx` (+1, -1)
- `packages/app/src/context/models.tsx` (+1, -1)
- `packages/app/src/context/permission.tsx` (+1, -0)
- `packages/app/src/context/server-sdk.tsx` (+13, -1)
- `packages/app/src/context/settings.test.ts` (+7, -0)
- `packages/app/src/context/settings.tsx` (+11, -1)
- `packages/app/src/context/terminal.tsx` (+63, -38)
- `packages/app/src/hooks/use-providers.ts` (+6, -4)
- `packages/app/src/pages/layout.tsx` (+1, -1)
- `packages/app/src/pages/session.tsx` (+0, -3)
- `packages/app/src/pages/session/composer/session-composer-controls.ts` (+27, -23)
- `packages/app/src/pages/session/file-tabs.tsx` (+11, -50)
- `packages/app/src/pages/session/review-tab.tsx` (+2, -1)
- `packages/app/src/pages/session/session-side-panel.tsx` (+5, -15)
- `packages/app/src/pages/session/timeline/message-timeline.tsx` (+1, -0)
- `packages/app/src/pages/session/timeline/projection.ts` (+2, -0)
- `packages/app/src/pages/session/timeline/rows-current.test.ts` (+36, -0)
- `packages/app/src/pages/session/timeline/rows.ts` (+9, -0)
- `packages/app/src/pages/session/v2/review-diff-kinds.ts` (+3, -2)
- `packages/app/src/pages/session/v2/review-panel-v2.tsx` (+2, -1)
- `packages/app/src/pages/session/v2/session-file-browser-tab.tsx` (+1, -14)
- `packages/app/src/utils/diffs.test.ts` (+2, -1)
- `packages/app/src/utils/diffs.ts` (+2, -1)
- `packages/app/src/utils/server-compat.test.ts` (+84, -3)
- `packages/app/src/utils/server-compat.ts` (+17, -3)
- `packages/app/src/utils/session-message.test.ts` (+17, -1)
- `packages/app/src/utils/session-message.ts` (+7, -0)
- `packages/app/src/utils/terminal-websocket-url.test.ts` (+31, -3)
- `packages/app/src/utils/terminal-websocket-url.ts` (+10, -3)
- `packages/cli/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/mail/package.json` (+1, -1)
- `packages/console/support/package.json` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/enterprise/package.json` (+1, -1)
- `packages/function/package.json` (+1, -1)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/provider/transform.ts` (+36, -17)
- `packages/opencode/test/provider/transform.test.ts` (+109, -3)
- `packages/opencode/test/server/httpapi-reference.test.ts` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/session-ui/src/components/message-file.test.ts` (+11, -13)
- `packages/session-ui/src/components/message-file.ts` (+1, -2)
- `packages/session-ui/src/components/session-diff.ts` (+2, -1)
- `packages/session-ui/src/components/session-review.tsx` (+3, -2)
- `packages/session-ui/src/components/session-turn.tsx` (+2, -1)
- `packages/session-ui/src/context/data.tsx` (+2, -1)
- `packages/session-ui/src/v2/components/session-review-file-preview-v2.tsx` (+2, -1)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/server/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/ar/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/bs/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/da/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/de/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/es/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/fr/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/it/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/ja/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/ko/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/nb/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/pl/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/ru/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/th/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/tr/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+2, -0)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 6a04328..be70f69 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.18.4",
+  "version": "1.18.5",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 761bee1..7ecdd92 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.18.4",
+  "version": "1.18.5",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/reference.ts
```diff
diff --git a/packages/core/src/reference.ts b/packages/core/src/reference.ts
index 5303dbd..1e1ab9d 100644
--- a/packages/core/src/reference.ts
+++ b/packages/core/src/reference.ts
@@ -58,7 +58,6 @@ const layer = Layer.effect(
       finalize: (draft) =>
         Effect.gen(function* () {
           materialized.clear()
-          const seen = new Map<string, string | undefined>()
           for (const [name, source] of draft.list()) {
             if (source.type === "local") {
               materialized.set(
@@ -82,14 +81,11 @@ const layer = Layer.effect(
                 continue
               }
             }
-            const target = Repository.cachePath(global.repos, repository)
-            if (seen.has(target) && seen.get(target) !== source.branch) continue
-            seen.set(target, source.branch)
             materialized.set(
               name,
               new Info({
                 name,
-                path: AbsolutePath.make(target),
+                path: AbsolutePath.make(Repository.cachePath(global.repos, repository, source.branch)),
                 ...(source.description === undefined ? {} : { description: source.description }),
                 ...(source.hidden === undefined ? {} : { hidden: source.hidden }),
                 source,
```

#### packages/core/src/repository-cache.ts
```diff
diff --git a/packages/core/src/repository-cache.ts b/packages/core/src/repository-cache.ts
index 9882367..cab2f63 100644
--- a/packages/core/src/repository-cache.ts
+++ b/packages/core/src/repository-cache.ts
@@ -1,3 +1,10 @@
+/**
+ * Local tracking checkouts for remote Git references, one per remote and
+ * branch. Each checkout permanently tracks a single ref: the requested branch
+ * when the cache key has one, otherwise the remote default branch. Content
+ * follows "newest wins": refresh fetches and hard-resets, so readers may
+ * observe the checkout move underneath them.
+ */
 import path from "path"
 import { Context, Effect, Layer, Schema } from "effect"
 import { FSUtil } from "./fs-util"
@@ -135,7 +142,7 @@ const layer: Layer.Layer<Service, never, FSUtil.Service | Git.Service | EffectFl
           if (input.branch) yield* validateBranch(input.branch)
 
           const repository = input.reference.label
-          const localPath = Repository.cachePath(global.repos, input.reference)
+          const localPath = Repository.cachePath(global.repos, input.reference, input.branch)
           const cloneTarget = Repository.parse(input.reference.remote) ?? input.reference
 
           return yield* flock
@@ -143,21 +150,28 @@ const layer: Layer.Layer<Service, never, FSUtil.Service | Git.Service | EffectFl
               Effect.gen(function* () {
                 yield* cacheOperation(fs.ensureDir(path.dirname(localPath)), "ensure cache directory", localPath)
 
-                const exists = yield* fs.existsSafe(localPath)
                 const existing = yield* git.repo.discover(AbsolutePath.make(localPath))
                 const origin = existing ? yield* git.remote.get(existing) : undefined
                 const originReference = origin ? Repository.parse(origin) : undefined
-                const reuse = Boolean(existing && originReference && Repository.same(originReference, cloneTarget))
-                if (exists && !reuse) {
+                // Discovery walks upward, so an enclosing repository with a
+                // matching origin could masquerade as the cache entry; reuse
+                // requires the checkout to live exactly at the cache path.
+                const worktree = existing ? yield* fs.resolve(localPath) : undefined
+                const reuse = Boolean(
+                  existing &&
+                    existing.worktree === worktree &&
+                    originReference &&
+                    Repository.same(originReference, cloneTarget),
+                )
+                if (!reuse && (yield* fs.existsSafe(localPath))) {
                   yield* cacheOperation(fs.remove(localPath, { recursive: true }), "remove stale cache", localPath)
                 }
 
-                const currentBranch = reuse && existing ? yield* git.history.branch(existing) : undefined
-                const status = statusForRepository({
```

#### packages/core/src/repository.ts
```diff
diff --git a/packages/core/src/repository.ts b/packages/core/src/repository.ts
index dbc6a8f..8ee5be6 100644
--- a/packages/core/src/repository.ts
+++ b/packages/core/src/repository.ts
@@ -118,8 +118,14 @@ export function isRemote(reference: Reference): reference is RemoteReference {
   return !isFile(reference)
 }
 
-export function cachePath(root: string, reference: Reference): string {
-  return path.join(root, ...reference.host.split(":"), ...reference.segments)
+/**
+ * Checkouts are keyed by remote and branch: a branch-specific reference gets
+ * its own directory so branchless refreshes can never move it. The branch is
+ * percent-encoded because valid branch names may contain `/`.
+ */
+export function cachePath(root: string, reference: Reference, branch?: string): string {
+  const base = path.join(root, ...reference.host.split(":"), ...reference.segments)
+  return branch ? `${base}@${encodeURIComponent(branch)}` : base
 }
 
 export function cacheIdentity(reference: Reference): string {
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/src/database/database.ts
- `src/core/` - review core changes from packages/core/src/kilocode/db-preflight.ts
- `src/core/` - review core changes from packages/core/src/v1/config/provider.ts
- `src/core/` - review core changes from packages/core/src/v1/session.ts
- `src/core/` - review core changes from packages/core/test/kilocode/db-preflight.test.ts
- `src/permission/` - review permission changes from packages/opencode/src/kilocode/permission/provenance.ts
- `src/permission/` - review permission changes from packages/opencode/src/permission/index.ts
- `src/permission/` - review permission changes from packages/opencode/test/kilocode/permission/next.always-rules.test.ts
- `src/permission/` - review permission changes from packages/opencode/test/kilocode/permission/permission-origins.test.ts
- `src/permission/` - review permission changes from packages/opencode/test/kilocode/permission/provenance.test.ts
- `src/permission/` - review permission changes from packages/opencode/test/permission/next.test.ts
- `src/tool/EditToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt changes
- `src/tool/PatchBody.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/PatchBody.kt changes
- `src/tool/ReadToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ReadToolView.kt changes
- `src/tool/ShellToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt changes
- `src/tool/ToolMarkdownBody.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolMarkdownBody.kt changes
- `src/tool/ToolSupport.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt changes
- `src/tool/grep.test.ts` - update based on opencode packages/opencode/test/tool/grep.test.ts changes
- `src/tool/grep.ts` - update based on opencode packages/opencode/src/tool/grep.ts changes
