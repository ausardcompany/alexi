# Upstream Changes Report
Generated: 2026-06-26 09:28:44

## Summary
- kilocode: 95 commits, 153 files changed
- opencode: 57 commits, 353 files changed

## kilocode Changes (761b6339a..715e10249)

### Commits

- 715e10249 - Merge pull request #11691 from Kilo-Org/mark/fix-mention-navigation-test (Mark IJbema, 2026-06-26)
- 1a51b09fc - Merge pull request #11639 from Kilo-Org/mark/clarify-marketplace (Mark IJbema, 2026-06-26)
- fc98b125b - Merge pull request #11705 from Kilo-Org/maple-squirrel (Kirill Kalishev, 2026-06-25)
- a2e547534 - Merge pull request #11616 from Kilo-Org/jetbrains-prompt-usage-telemetry (Kirill Kalishev, 2026-06-25)
- 388900271 - Merge pull request #11699 from Kilo-Org/thankful-syrup (Kirill Kalishev, 2026-06-25)
- 5291df8a0 - chore: remove unrelated VS Code packaging changes (kirillk, 2026-06-25)
- 02107028f - chore: remove CLI plugin dependency fix (kirillk, 2026-06-25)
- 8b9a32f28 - fix: improve plugin dependency and error logs (kirillk, 2026-06-25)
- f7c6ab5f3 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-25)
- bf4764753 - Merge remote-tracking branch 'origin/main' into mark/clarify-marketplace (Mark IJbema, 2026-06-25)
- 6df93d6e7 - chore(jetbrains): pin IPGP snapshot (kirillk, 2026-06-25)
- ebba5a6b8 - Merge pull request #11640 from Kilo-Org/mark/marketplace-relevance-filter (Imanol Maiztegui, 2026-06-25)
- e1ed21d3e - chore(jetbrains): keep PR focused on logging (kirillk, 2026-06-25)
- 8d82992e0 - Merge pull request #11644 from Kilo-Org/mark/native-notebook-tools (Imanol Maiztegui, 2026-06-25)
- 14dc63d57 - fix(jetbrains): show session errors in footer (kirillk, 2026-06-25)
- 307c95e97 - chore(jetbrains): use IPGP snapshot (kirillk, 2026-06-25)
- 61e87f034 - chore(vscode): format marketplace install modal (Mark IJbema, 2026-06-25)
- 5d5b2b926 - ci(docs): exclude flaky Linear link check (Mark IJbema, 2026-06-25)
- 2ea5dd7b8 - fix(vscode): snapshot marketplace install destination (Mark IJbema, 2026-06-25)
- b3f98ebb7 - test(jetbrains): await mention validation completion (markijbema, 2026-06-25)
- 6e9276d1a - Merge pull request #11693 from Kilo-Org/pretty-brush (Marius, 2026-06-25)
- 8fbb57a7c - fix(cli): validate notebook_edit before permission prompt (Mark IJbema, 2026-06-25)
- 1fb3e0679 - feat(vscode): add Parakeet speech-to-text model (marius-kilocode, 2026-06-25)
- 5271db7f3 - fix(cli): flatten notebook_edit schema for Anthropic (Mark IJbema, 2026-06-25)
- 00e9299dc - i18n(vscode): translate native notebook tools settings (Mark IJbema, 2026-06-25)
- ecf39e3d0 - perf(vscode): avoid full-notebook re-hash during execution (Mark IJbema, 2026-06-25)
- b344d1757 - Merge pull request #11681 from Kilo-Org/fluorescent-chamomile (Marius, 2026-06-25)
- 092bfc9ab - fix(cli): default notebook_read permission to ask (Mark IJbema, 2026-06-25)
- e303fa43e - chore(vscode): remove native notebook tools plan (Mark IJbema, 2026-06-25)
- 17ed67bd2 - test(jetbrains): synchronize workspace open calls (markijbema, 2026-06-25)
- e1e6a8ebc - Merge remote-tracking branch 'origin/main' into fluorescent-chamomile (marius-kilocode, 2026-06-25)
- e73d791ee - Merge pull request #11683 from Kilo-Org/camp-hippodraco (Marius, 2026-06-25)
- c470f82c6 - Merge pull request #11679 from Kilo-Org/tested-cayenne (Marius, 2026-06-25)
- b674dd935 - Merge branch 'main' into fluorescent-chamomile (Marius, 2026-06-25)
- 2e6303810 - Merge pull request #11575 from Kilo-Org/docs/cost-efficiency-model-selection (Ligia Zanchet, 2026-06-25)
- 1390dfa82 - Merge branch 'main' into camp-hippodraco (Marius, 2026-06-25)
- 5e5182730 - Merge pull request #11557 from rakshith1928/feature/improve-slash-command-sorting (Mark IJbema, 2026-06-25)
- 17292588a - Merge pull request #11685 from Kilo-Org/sudsy-pin (Marius, 2026-06-25)
- 9912e023f - test(vscode): remove obsolete sandbox icon baselines (marius-kilocode, 2026-06-25)
- 73944a2e0 - Merge pull request #11686 from Kilo-Org/mark/jetbrains-ci-path-filters (Mark IJbema, 2026-06-25)
- 9bbb6d5e9 - test(cli): update notebook reply fixture (Mark IJbema, 2026-06-25)
- 831514e5e - feat(vscode): gate notebook tools behind experiment (Mark IJbema, 2026-06-25)
- 1e39b2267 - fix(ci): scope JetBrains checks to relevant changes (markijbema, 2026-06-25)
- bbfa5702a - Merge branch 'main' into feature/improve-slash-command-sorting (Mark IJbema, 2026-06-25)
- e03fbd662 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-25)
- 9dcc23049 - Merge pull request #11676 from Kilo-Org/mark/scope-sdk-generation-formatting (Mark IJbema, 2026-06-25)
- 8db25eb19 - test(cli): loosen flaky header-timeout no-abort case (marius-kilocode, 2026-06-25)
- 641c646c9 - feat(vscode): clarify sandbox restriction states (marius-kilocode, 2026-06-25)
- 2919d2b9a - feat(vscode): expose sandbox experiment (marius-kilocode, 2026-06-25)
- 75fe210ef - fix(vscode): restrict notebook request directories (Mark IJbema, 2026-06-25)
- fdd4c5f1a - Merge remote-tracking branch 'origin/main' into fluorescent-chamomile (marius-kilocode, 2026-06-25)
- 409aaf806 - fix(vscode): bound notebook source extraction (Mark IJbema, 2026-06-25)
- 46c4ec24b - Merge branch 'main' into feature/improve-slash-command-sorting (rakshith1928, 2026-06-25)
- 54afdd0b4 - fix(vscode): release delivered notebook outcomes (Mark IJbema, 2026-06-25)
- ee862d80c - fix(cli): keep truncated notebook output valid JSON (Mark IJbema, 2026-06-25)
- 2808def87 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-25)
- 9309a8ee8 - fix(cli): remove dead notebook cancellation status (Mark IJbema, 2026-06-25)
- 27fb5500e - feat(vscode): add sandbox slash command (marius-kilocode, 2026-06-25)
- 71857e359 - test(vscode): keep prompt stories inside providers (marius-kilocode, 2026-06-25)
- 3cd521403 - fix(vscode): relax notebook execution timeouts (Mark IJbema, 2026-06-25)
- 00dfb926e - fix(vscode): preserve cached client access (Mark IJbema, 2026-06-25)
- e125e2c3f - refactor(vscode): clarify notebook cell collection (Mark IJbema, 2026-06-25)
- 37d81bf6b - feat(vscode): show network sandbox indicator (marius-kilocode, 2026-06-25)
- b0747d259 - chore(vscode): format notebook tool changes (Mark IJbema, 2026-06-25)
- 75d13ef70 - fix(vscode): stabilize native notebook tools (Mark IJbema, 2026-06-25)
- 064eb6c1d - fix: avoid repository-wide formatting during generation (markijbema, 2026-06-25)
- df7e9b191 - Merge branch 'main' into feature/improve-slash-command-sorting (Mark IJbema, 2026-06-25)
- 2a17d4905 - docs(vscode): add native notebook tools plan (Mark IJbema, 2026-06-25)
- 9d6f010ff - test(cli): cover notebook HTTP routes (Mark IJbema, 2026-06-25)
- 5c94fc771 - fix(vscode): share notebook request state (Mark IJbema, 2026-06-25)
- c193ee856 - feat(vscode): add native notebook tools (Mark IJbema, 2026-06-25)
- a4b458db0 - Merge branch 'main' into mark/clarify-marketplace (Mark IJbema, 2026-06-25)
- 39f25ee0f - fix(vscode): link marketplace help to marketplace guide (Mark IJbema, 2026-06-24)
- 4a3580262 - fix(vscode): link marketplace help to deployed docs (Mark IJbema, 2026-06-24)
- c5218553c - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-24)
- 15da733c7 - docs: clarify marketplace installs (Mark IJbema, 2026-06-24)
- 53c41c109 - chore(vscode): format relevance metadata handling (markijbema, 2026-06-24)
- 5fe01e71c - fix(vscode): distinguish filtered marketplace empty states (markijbema, 2026-06-24)
- 04d454b5b - fix(vscode): ignore malformed relevance metadata (markijbema, 2026-06-24)
- a56e817d9 - fix(vscode): refresh marketplace relevance when context changes (markijbema, 2026-06-24)
- 44b8f2ff8 - fix(vscode): scan relevance across workspace URIs (markijbema, 2026-06-24)
- 95eda826c - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-24)
- c26451577 - feat(vscode): filter marketplace by workspace relevance (Mark IJbema, 2026-06-24)
- c5791a020 - feat(jetbrains): track prompt slash and mention usage (kirillk, 2026-06-23)
- a510c951a - Merge branch 'main' into docs/cost-efficiency-model-selection (Christiaan Arnoldus, 2026-06-23)
- 26dfe9c15 - Extract sortByScore and simplify tests (Rakshith N, 2026-06-23)
- 6e9f06b6b - Remove Auto Small configuration note (Ligia Zanchet, 2026-06-23)
- 962dd2cd3 - Update packages/kilo-docs/pages/getting-started/rate-limits-and-costs.md (Ligia Zanchet, 2026-06-23)
- e92233c51 - docs: fix paid rate limits wording and add Auto Small note (kiloconnect[bot], 2026-06-23)
- d783da26d - Refine language and clarity in rate limits document (Ligia Zanchet, 2026-06-23)
- 90a843fbe - docs: rewrite rate-limits-and-costs as cost efficiency & model selection guide (kiloconnect[bot], 2026-06-23)
- 14a8d7a14 -  test(vscode): add server command merge and dedup tests for slash commands (Rakshith N, 2026-06-23)
- d086710f8 - chore: add changeset for slash-command sorting (Rakshith N, 2026-06-23)
- 590d8e43c - fix tests to not use duplicate logic (Rakshith N, 2026-06-23)
- 121c12d2f - fix(vscode): sort slash commands by relevance (exact > prefix > substring) (Rakshith N, 2026-06-23)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/notebook-host.ts` (+217, -0)
- `packages/opencode/src/kilocode/tool/registry.ts` (+46, -6)
- `packages/opencode/src/tool/registry.ts` (+5, -2)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/kilocode/agent/index.ts` (+9, -1)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
(no changes)

#### Other Changes
- `.changeset/add-parakeet-speech.md` (+5, -0)
- `.changeset/clear-marketplace-installs.md` (+5, -0)
- `.changeset/expose-sandbox-controls.md` (+5, -0)
- `.changeset/filter-relevant-marketplace.md` (+5, -0)
- `.changeset/jetbrains-session-error-logs.md` (+5, -0)
- `.changeset/native-notebook-tools.md` (+5, -0)
- `.changeset/show-sandbox-network.md` (+5, -0)
- `.changeset/slash-command-sorting.md` (+4, -0)
- `.changeset/toggle-extension-sandbox.md` (+5, -0)
- `.github/workflows/test-jetbrains.yml` (+1, -0)
- `.github/workflows/typecheck.yml` (+34, -1)
- `packages/kilo-docs/lib/nav/getting-started.ts` (+1, -1)
- `packages/kilo-docs/lychee.toml` (+2, -0)
- `packages/kilo-docs/pages/getting-started/rate-limits-and-costs.md` (+77, -32)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/marketplace/empty-list-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/marketplace/install-mcp-modal-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/marketplace/mixed-list-with-items-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/marketplace/relevant-items-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/prompt-input/sandbox-tooltip-disabled-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/prompt-input/sandbox-tooltip-enabled-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/source-links.md` (+5, -0)
- `packages/kilo-i18n/src/ar.ts` (+20, -0)
- `packages/kilo-i18n/src/br.ts` (+21, -0)
- `packages/kilo-i18n/src/bs.ts` (+21, -0)
- `packages/kilo-i18n/src/da.ts` (+21, -0)
- `packages/kilo-i18n/src/de.ts` (+23, -0)
- `packages/kilo-i18n/src/en.ts` (+20, -1)
- `packages/kilo-i18n/src/es.ts` (+22, -0)
- `packages/kilo-i18n/src/fr.ts` (+23, -0)
- `packages/kilo-i18n/src/it.ts` (+22, -0)
- `packages/kilo-i18n/src/ja.ts` (+22, -0)
- `packages/kilo-i18n/src/ko.ts` (+22, -0)
- `packages/kilo-i18n/src/nl.ts` (+22, -0)
- `packages/kilo-i18n/src/no.ts` (+21, -0)
- `packages/kilo-i18n/src/pl.ts` (+22, -0)
- `packages/kilo-i18n/src/ru.ts` (+23, -0)
- `packages/kilo-i18n/src/th.ts` (+21, -0)
- `packages/kilo-i18n/src/tr.ts` (+22, -0)
- `packages/kilo-i18n/src/uk.ts` (+23, -0)
- `packages/kilo-i18n/src/zh.ts` (+19, -0)
- `packages/kilo-i18n/src/zht.ts` (+19, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendAppService.kt` (+9, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendChatManager.kt` (+20, -2)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendConnectionService.kt` (+5, -7)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloCliDataParser.kt` (+2, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloSessionRpcApiImpl.kt` (+39, -41)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendChatManagerTest.kt` (+21, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/ChatLogSummaryTest.kt` (+61, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/KiloCliDataParserTest.kt` (+26, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloSessionRpcApiImplTest.kt` (+52, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloSessionService.kt` (+29, -14)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+4, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionController.kt` (+22, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/app/KiloSessionServiceTest.kt` (+42, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/CommandLifecycleTest.kt` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/PromptLifecycleTest.kt` (+48, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/SessionControllerTestBase.kt` (+5, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/SessionSubscriptionTest.kt` (+38, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/prompt/MentionNavigatorTest.kt` (+7, -4)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeWorkspaceRpcApi.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/TestLog.kt` (+47, -0)
- `packages/kilo-jetbrains/gradle/libs.versions.toml` (+1, -1)
- `packages/kilo-jetbrains/settings.gradle.kts` (+12, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/log/ChatLogSummary.kt` (+25, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/ChatDto.kt` (+2, -0)
- `packages/kilo-ui/src/components/icon.tsx` (+4, -0)
- `packages/kilo-vscode/src/MarketplacePanelProvider.ts` (+31, -1)
- `packages/kilo-vscode/src/agent-manager/__tests__/AgentManagerProvider.spec.ts` (+24, -0)
- `packages/kilo-vscode/src/extension.ts` (+3, -0)
- `packages/kilo-vscode/src/features.ts` (+1, -2)
- `packages/kilo-vscode/src/services/cli-backend/connection-service.test.ts` (+20, -0)
- `packages/kilo-vscode/src/services/cli-backend/connection-service.ts` (+26, -0)
- `packages/kilo-vscode/src/services/marketplace/actions.ts` (+2, -1)
- `packages/kilo-vscode/src/services/marketplace/api.ts` (+1, -0)
- `packages/kilo-vscode/src/services/marketplace/index.ts` (+23, -5)
- `packages/kilo-vscode/src/services/marketplace/relevance.ts` (+72, -0)
- `packages/kilo-vscode/src/services/marketplace/types.ts` (+15, -0)
- `packages/kilo-vscode/src/services/notebook/adapter.ts` (+460, -0)
- `packages/kilo-vscode/src/services/notebook/bridge.ts` (+368, -0)
- `packages/kilo-vscode/src/services/notebook/index.ts` (+5, -0)
- `packages/kilo-vscode/src/services/notebook/output.ts` (+95, -0)
- `packages/kilo-vscode/src/services/notebook/path.ts` (+86, -0)
- `packages/kilo-vscode/src/services/notebook/revision.ts` (+38, -0)
- `packages/kilo-vscode/src/services/notebook/types.ts` (+126, -0)
- `packages/kilo-vscode/src/speech-to-text/models.ts` (+5, -0)
- `packages/kilo-vscode/tests/model-selector-accessibility.spec.ts` (+2, -2)
- `packages/kilo-vscode/tests/unit/marketplace-actions.test.ts` (+16, -1)
- `packages/kilo-vscode/tests/unit/marketplace-relevance.test.ts` (+104, -0)
- `packages/kilo-vscode/tests/unit/notebook-bridge.test.ts` (+324, -0)
- `packages/kilo-vscode/tests/unit/notebook-core.test.ts` (+469, -0)
- `packages/kilo-vscode/tests/unit/prompt-input-connection-guard.test.ts` (+35, -2)
- `packages/kilo-vscode/tests/unit/sandboxing-settings.test.ts` (+25, -2)
- `packages/kilo-vscode/tests/unit/speech-to-text-models-sync.test.ts` (+11, -0)
- `packages/kilo-vscode/tests/unit/use-slash-command-sorting.test.ts` (+50, -0)
- `packages/kilo-vscode/tests/unit/use-slash-command.test.ts` (+90, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+66, -17)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/InstallModal.tsx` (+77, -8)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/MarketplaceListView.tsx` (+46, -7)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/MarketplaceView.tsx` (+10, -2)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/marketplace.css` (+88, -1)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/utils.ts` (+12, -1)
- `packages/kilo-vscode/webview-ui/src/components/settings/ExperimentalTab.tsx` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/context/language.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/hooks/useSlashCommand.ts` (+31, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+14, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/stories/marketplace.stories.tsx` (+47, -0)
- `packages/kilo-vscode/webview-ui/src/stories/prompt-input.stories.tsx` (+44, -1)
- `packages/kilo-vscode/webview-ui/src/styles/prompt-input.css` (+42, -0)
- `packages/kilo-vscode/webview-ui/src/types/marketplace.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/config.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+2, -1)
- `packages/opencode/src/config/config.ts` (+3, -0)
- `packages/opencode/src/config/permission.ts` (+5, -0)
- `packages/opencode/src/effect/app-runtime.ts` (+2, -0)
- `packages/opencode/src/kilocode/notebook/protocol.ts` (+177, -0)
- `packages/opencode/src/kilocode/notebook/service.ts` (+162, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/kilocode.ts` (+48, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilocode.ts` (+32, -1)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+2, -0)
- `packages/opencode/test/kilocode/notebook-service.test.ts` (+209, -0)
- `packages/opencode/test/kilocode/notebook-tools.test.ts` (+155, -0)
- `packages/opencode/test/kilocode/tool-registry-indexing-import-failure.test.ts` (+3, -0)
- `packages/opencode/test/kilocode/tool-registry-indexing.test.ts` (+17, -0)
- `packages/opencode/test/kilocode/tool-registry-semantic-import-failure.test.ts` (+3, -0)
- `packages/opencode/test/provider/header-timeout.test.ts` (+2, -2)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+27, -0)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+136, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+281, -0)
- `packages/sdk/openapi.json` (+902, -26)
- `script/generate.ts` (+0, -2)

### Key Diffs

#### packages/opencode/src/kilocode/agent/index.ts
```diff
diff --git a/packages/opencode/src/kilocode/agent/index.ts b/packages/opencode/src/kilocode/agent/index.ts
index 71baa481d..158593135 100644
--- a/packages/opencode/src/kilocode/agent/index.ts
+++ b/packages/opencode/src/kilocode/agent/index.ts
@@ -8,6 +8,7 @@ import type { Info as AgentInfo } from "../../agent/agent"
 import { Schema } from "effect"
 import path from "path"
 import { Global } from "@opencode-ai/core/global"
+import { Flag } from "@opencode-ai/core/flag/flag"
 
 import PROMPT_DEBUG from "../../agent/prompt/debug.txt"
 import PROMPT_ORCHESTRATOR from "../../agent/prompt/orchestrator.txt"
@@ -228,7 +229,13 @@ export interface KiloData {
 // Prepare kilo-specific data derived from config. Call once per state initialization.
 export function prepare(cfg: Config.Info): KiloData {
   const mcpRules = getMcpRules(cfg)
-  const defaultsPatch = Permission.fromConfig({ bash, recall: "ask" })
+  const defaultsPatch = Permission.fromConfig({
+    bash,
+    recall: "ask",
+    ...(Flag.KILO_CLIENT === "vscode" && cfg.experimental?.native_notebook_tools === true
+      ? { notebook_read: "ask" as const, notebook_edit: "ask" as const, notebook_execute: "ask" as const }
+      : {}),
+  })
   return { mcpRules, defaultsPatch }
 }
 
@@ -239,6 +246,7 @@ export function cacheKey(cfg: Config.Info) {
     mcp: cfg.mcp,
     mode: cfg.mode,
     permission: cfg.permission,
+    native_notebook_tools: cfg.experimental?.native_notebook_tools,
   })
 }
 
```

#### packages/opencode/src/kilocode/tool/notebook-host.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/notebook-host.ts b/packages/opencode/src/kilocode/tool/notebook-host.ts
new file mode 100644
index 000000000..f50f8e78c
--- /dev/null
+++ b/packages/opencode/src/kilocode/tool/notebook-host.ts
@@ -0,0 +1,217 @@
+import { Notebook, HostError } from "@/kilocode/notebook/service"
+import { Path, type Result } from "@/kilocode/notebook/protocol"
+import { NonNegativeInt } from "@opencode-ai/core/schema"
+import * as Tool from "@/tool/tool"
+import { Effect, Schema } from "effect"
+
+const Source = Schema.String.check(Schema.isMaxLength(200_000))
+const Revision = Schema.String.check(Schema.isMinLength(1), Schema.isMaxLength(200)).annotate({
+  description: "Opaque content revision returned by notebook_read or the previous successful notebook_edit",
+})
+const Index = NonNegativeInt.annotate({ description: "Zero-based cell index" })
+const LIMIT = 20_000
+
+function render(value: unknown) {
+  const text = JSON.stringify(value, (key, item) => (key === "requestPath" ? undefined : item), 2)
+  if (text.length <= LIMIT) return text
+  const preview = text.slice(0, 3_000)
+  return JSON.stringify(
+    {
+      truncated: true,
+      omittedCharacters: text.length - preview.length,
+      preview,
+    },
+    null,
+    2,
+  )
+}
+
+function abort(signal: AbortSignal) {
+  return Effect.callback<never, HostError>((resume) => {
+    const err = () => new HostError({ code: "cancelled", detail: "The notebook tool call was cancelled" })
+    if (signal.aborted) return resume(Effect.fail(err()))
+    const handler = () => resume(Effect.fail(err()))
+    signal.addEventListener("abort", handler, { once: true })
+    return Effect.sync(() => signal.removeEventListener("abort", handler))
+  })
+}
+
+function run(effect: Effect.Effect<Result, HostError>, signal: AbortSignal) {
+  return effect.pipe(Effect.raceFirst(abort(signal)), Effect.orDie)
+}
+
+const ReadParams = Schema.Struct({
+  path: Path,
```

#### packages/opencode/src/kilocode/tool/registry.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/registry.ts b/packages/opencode/src/kilocode/tool/registry.ts
index fcbbf4ba9..3e124b8d7 100644
--- a/packages/opencode/src/kilocode/tool/registry.ts
+++ b/packages/opencode/src/kilocode/tool/registry.ts
@@ -3,9 +3,11 @@ import { CodebaseSearchTool } from "../../tool/warpgrep"
 import { RecallTool } from "../../tool/recall"
 import { AgentManagerTool } from "./agent-manager"
 import { BackgroundProcessTool } from "./background-process"
+import { NotebookEditTool, NotebookExecuteTool, NotebookReadTool } from "./notebook-host"
 import * as Tool from "../../tool/tool"
 import { Flag } from "@opencode-ai/core/flag/flag"
 import { Effect } from "effect"
+import { Notebook } from "@/kilocode/notebook/service"
 import * as Log from "@opencode-ai/core/util/log"
 import { Agent } from "@/agent/agent"
 import * as Truncate from "@/tool/truncate"
@@ -31,20 +33,34 @@ export namespace KiloToolRegistry {
 
   /** Resolve Kilo-specific tool Infos outside any InstanceState, so their Truncate/Agent deps are
    * satisfied at the outer registry scope instead of leaking into InstanceState's Effect. */
-  export function infos() {
+  export function infos(notebook?: Notebook.Interface) {
     return Effect.gen(function* () {
       const codebase = yield* CodebaseSearchTool
       const recall = yield* RecallTool
       const manager = yield* AgentManagerTool
       const process = yield* BackgroundProcessTool
-      return { codebase, recall, manager, process }
+      if (!notebook) return { codebase, recall, manager, process }
+      const tools = yield* Effect.all({
+        notebookRead: NotebookReadTool,
+        notebookEdit: NotebookEditTool,
+        notebookExecute: NotebookExecuteTool,
+      }).pipe(Effect.provideService(Notebook.Service, notebook))
+      return { codebase, recall, manager, process, ...tools }
     })
   }
 
   /** Finalize Kilo-specific tools into Tool.Defs. Call this inside the InstanceState state Effect —
    * it has no Service deps beyond what Tool.init itself needs. */
   export function build(
-    tools: { codebase: Tool.Info; recall: Tool.Info; manager: Tool.Info; process: Tool.Info },
+    tools: {
+      codebase: Tool.Info
+      recall: Tool.Info
+      manager: Tool.Info
+      process: Tool.Info
+      notebookRead?: Tool.Info
+      notebookEdit?: Tool.Info
+      notebookExecute?: Tool.Info
```

#### packages/opencode/src/tool/registry.ts
```diff
diff --git a/packages/opencode/src/tool/registry.ts b/packages/opencode/src/tool/registry.ts
index c184b6e77..709af95a9 100644
--- a/packages/opencode/src/tool/registry.ts
+++ b/packages/opencode/src/tool/registry.ts
@@ -27,6 +27,7 @@ import { Provider } from "@/provider/provider"
 import { ProviderID, type ModelID } from "../provider/schema"
 import { WebSearchTool } from "./websearch"
 import { KiloToolRegistry } from "../kilocode/tool/registry" // kilocode_change
+import { Notebook } from "@/kilocode/notebook/service" // kilocode_change
 import { RepoCloneTool } from "./repo_clone"
 import { RepoOverviewTool } from "./repo_overview"
 import { Flag } from "@opencode-ai/core/flag/flag" // kilocode_change
@@ -38,7 +39,7 @@ import { ApplyPatchTool } from "./apply_patch"
 import { Glob } from "@opencode-ai/core/util/glob"
 import path from "path"
 import { pathToFileURL } from "url"
-import { Effect, Layer, Context } from "effect"
+import { Effect, Layer, Context, Option } from "effect" // kilocode_change
 import { HttpClient } from "effect/unstable/http" // kilocode_change
 import { ChildProcessSpawner } from "effect/unstable/process/ChildProcessSpawner"
 import { CrossSpawnSpawner } from "@opencode-ai/core/cross-spawn-spawner"
@@ -150,7 +151,8 @@ export const layer: Layer.Layer<
     const agent = yield* Agent.Service
     // kilocode_change start
     const suggesttool = yield* SuggestTool
-    const kiloToolInfos = yield* KiloToolRegistry.infos()
+    const notebook = Option.getOrUndefined(yield* Effect.serviceOption(Notebook.Service))
+    const kiloToolInfos = yield* KiloToolRegistry.infos(notebook)
     // kilocode_change end
 
     const state = yield* InstanceState.make<State>(
@@ -450,6 +452,7 @@ export const defaultLayer = Layer.suspend(
       // kilocode_change start - provide Kilo-owned registry dependencies
       .pipe(
         Layer.provide(Command.defaultLayer),
+        Layer.provide(Notebook.defaultLayer),
         Layer.provide(RuntimeFlags.defaultLayer),
         Layer.provide(SessionStatus.defaultLayer),
       ),
```


## opencode Changes (f55d8fa..eeb5b1d)

### Commits

- eeb5b1d - core: prevent UI imports compiling TSX source (vimtor, 2026-06-26)
- f8ceb30 - chore: generate (opencode-agent[bot], 2026-06-26)
- 78a5a03 - feat(app): refine session UI styling (#33860) (usrnk1, 2026-06-26)
- 219ba24 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-26)
- e8fea9e - feat(oauth): unify OAuth callback browser pages (#34025) (Aiden Cline, 2026-06-26)
- 1153726 - chore: generate (opencode-agent[bot], 2026-06-26)
- 929c4aa - refactor(app): replace tab drag handling with dndkit (#33880) (Brendan Allan, 2026-06-26)
- 19e510f - refactor(app): use dropdown for project selector (#33984) (opencode-agent[bot], 2026-06-26)
- 8a1608e - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-26)
- 077deb9 - fix(app): bump ghostty-web to prevent terminal resize hangs (#34020) (opencode-agent[bot], 2026-06-26)
- 41f2705 - chore: generate (opencode-agent[bot], 2026-06-26)
- ef5c9f4 - feat(sdk): expose active sessions (#33991) (Kit Langton, 2026-06-26)
- 40ecfce - fix(sdk): wake embedded session execution (#33992) (Kit Langton, 2026-06-25)
- a1f093a - refactor(opencode): stop legacy v2 event emission (#33993) (Kit Langton, 2026-06-26)
- 9859b19 - fix(ui): normalize tooltip trigger layout (#33979) (opencode-agent[bot], 2026-06-26)
- 45badf7 - fix(app): suspend hidden terminal renderer (#33990) (opencode-agent[bot], 2026-06-26)
- 28a00ad - fix(app): enable auto-accept in session settings (#33974) (opencode-agent[bot], 2026-06-26)
- 0f272d9 - tweak: hide MCP access token prefix (#33711) (Aiden Cline, 2026-06-25)
- ded29f0 - fix(core): refine small model defaults (#33926) (Aiden Cline, 2026-06-25)
- f428755 - feat(core): split MCP timeout configuration (#33977) (opencode-agent[bot], 2026-06-25)
- 17166b2 - fix(app): simplify question prompt (#33968) (opencode-agent[bot], 2026-06-26)
- 5f61d21 - feat(llm): pass strict through tool definitions for Codex parity (#33392) (Aiden Cline, 2026-06-25)
- 0568855 - chore: generate (opencode-agent[bot], 2026-06-25)
- 3fbc005 - fix(mcp): scope auth status to server URL (#33924) (Aiden Cline, 2026-06-25)
- 21c0e03 - chore: generate (opencode-agent[bot], 2026-06-25)
- a2b847e - refactor(app): split session composer (#33954) (Brendan Allan, 2026-06-25)
- fae100f - fix(app): enable composer shortcuts on drafts (#33956) (Brendan Allan, 2026-06-26)
- b60c0a5 - fix(app): use tab-scoped servers in sessions (#33946) (Brendan Allan, 2026-06-25)
- 0870a83 - chore: generate (opencode-agent[bot], 2026-06-25)
- 0e731c2 - refactor(core): support tiered layer nodes (#33937) (James Long, 2026-06-25)
- 21b78c4 - chore: generate (opencode-agent[bot], 2026-06-25)
- f444236 - feat(sdk): restore session runtime operations (#33777) (Kit Langton, 2026-06-25)
- 4480677 - feat(app): group prompt projects by server (#33941) (Brendan Allan, 2026-06-25)
- a267222 - refactor(schema): isolate v1 contracts (#33769) (Kit Langton, 2026-06-25)
- ecabab4 - chore: generate (opencode-agent[bot], 2026-06-25)
- 9e9d405 - refactor(schema): tighten public contracts (#33771) (Kit Langton, 2026-06-25)
- 5682371 - chore: generate (opencode-agent[bot], 2026-06-25)
- 10e4b87 - fix(app): persist home project selection (#33935) (Brendan Allan, 2026-06-25)
- e7c59b1 - fix(tui): load root sessions in session switcher (#33931) (Simon Klee, 2026-06-25)
- 69f75df - fix(app): adjust home search and header layout (#33923) (Brendan Allan, 2026-06-26)
- fec087b - zen: new inference (Frank, 2026-06-25)
- 4f4aa68 - zen: migrate to new inference (Frank, 2026-06-25)
- 77f2d22 - chore: generate (opencode-agent[bot], 2026-06-25)
- 7854f5b - refactor(schema): normalize module patterns (#33770) (Kit Langton, 2026-06-25)
- 5565a8e - fix(app): restore new layout shortcuts (#33929) (Brendan Allan, 2026-06-25)
- 9ad7067 - docs(schema): document package conventions (#33768) (Kit Langton, 2026-06-25)
- ddbc8d3 - chore: generate (opencode-agent[bot], 2026-06-25)
- 4f88cab - fix(app): suspend while recent models load (#33921) (Brendan Allan, 2026-06-25)
- 208cd56 - feat(stats): add i18n support (#33693) (Adam, 2026-06-25)
- c097d51 - feat(app): improve titlebar tab layout (#33914) (Brendan Allan, 2026-06-25)
- 20fd323 - chore: generate (opencode-agent[bot], 2026-06-25)
- 7f40aea - feat(server): add permission request endpoints (#33774) (Dax, 2026-06-25)
- bcff162 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-25)
- 5ea405b - fix(app): hide mobile titlebar setting in production (#33894) (Brendan Allan, 2026-06-25)
- 7c0e1b4 - sync release versions for v1.17.11 (opencode, 2026-06-25)
- f4103f5 - feat(ui): publish ui package (#33681) (Victor Navarro, 2026-06-25)
- e6c4513 - fix(client): exclude generated files from formatting (#33832) (opencode-agent[bot], 2026-06-25)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/registry.ts` (+25, -21)
- `packages/opencode/src/tool/schema.ts` (+2, -2)
- `packages/opencode/src/tool/todo.ts` (+1, -12)
- `packages/opencode/src/tool/truncate.ts` (+1, -1)
- `packages/opencode/test/tool/registry.test.ts` (+3, -3)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+6, -9)

#### Permission System (**/permission/)
- `packages/opencode/src/permission/index.ts` (+2, -3)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/console/core/package.json` (+1, -1)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/catalog.ts` (+5, -0)
- `packages/core/src/config/mcp.ts` (+12, -3)
- `packages/core/src/config/plugin/reference.ts` (+7, -5)
- `packages/core/src/control-plane/move-session.ts` (+5, -5)
- `packages/core/src/cross-spawn-spawner.ts` (+1, -1)
- `packages/core/src/database/database.ts` (+1, -1)
- `packages/core/src/effect/layer-node-platform.ts` (+11, -5)
- `packages/core/src/effect/layer-node.ts` (+194, -48)
- `packages/core/src/effect/scoped-node.ts` (+11, -0)
- `packages/core/src/event.ts` (+1, -1)
- `packages/core/src/fs-util.ts` (+1, -1)
- `packages/core/src/git.ts` (+1, -1)
- `packages/core/src/global.ts` (+1, -1)
- `packages/core/src/models-dev.ts` (+1, -1)
- `packages/core/src/npm.ts` (+5, -1)
- `packages/core/src/oauth/page.ts` (+276, -0)
- `packages/core/src/plugin.ts` (+7, -8)
- `packages/core/src/plugin/host.ts` (+14, -10)
- `packages/core/src/plugin/provider/openai.ts` (+8, -8)
- `packages/core/src/process.ts` (+1, -1)
- `packages/core/src/project.ts` (+5, -1)
- `packages/core/src/project/copy.ts` (+7, -3)
- `packages/core/src/project/directories.ts` (+3, -3)
- `packages/core/src/pty.ts` (+4, -5)
- `packages/core/src/pty/ticket.ts` (+1, -1)
- `packages/core/src/reference.ts` (+4, -4)
- `packages/core/src/ripgrep.ts` (+1, -1)
- `packages/core/src/ripgrep/binary.ts` (+5, -1)
- `packages/core/src/schema.ts` (+3, -11)
- `packages/core/src/session.ts` (+2, -1)
- `packages/core/src/session/context-epoch.ts` (+2, -2)
- `packages/core/src/session/execution.ts` (+8, -1)
- `packages/core/src/session/execution/local.ts` (+1, -0)
- `packages/core/src/session/info.ts` (+2, -2)
- `packages/core/src/session/message-id.ts` (+0, -2)
- `packages/core/src/session/projector.ts` (+2, -3)
- `packages/core/src/session/run-coordinator.ts` (+3, -1)
- `packages/core/src/session/runner/to-llm-message.ts` (+18, -5)
- `packages/core/src/session/todo.ts` (+2, -3)
- `packages/core/src/util/effect-flock.ts` (+1, -1)
- `packages/core/src/v1/config/migrate.ts` (+6, -5)
- `packages/core/test/config/config.test.ts` (+16, -8)
- `packages/core/test/move-session.test.ts` (+1, -2)
- `packages/core/test/oauth-page.test.ts` (+15, -0)
- `packages/core/test/session-prompt.test.ts` (+9, -0)
- `packages/core/test/session-run-coordinator.test.ts` (+73, -0)
- `packages/core/test/session-runner-message.test.ts` (+72, -0)
- `packages/core/test/session-runner-recorded.test.ts` (+1, -0)
- `packages/core/test/session-runner.test.ts` (+1, -0)
- `packages/core/test/shared-schema.test.ts` (+27, -1)
- `packages/core/test/tool-todowrite.test.ts` (+3, -1)
- `packages/stats/core/package.json` (+1, -1)

#### Other Changes
- `.prettierignore` (+2, -0)
- `AGENTS.md` (+3, -1)
- `CONTEXT.md` (+16, -2)
- `bun.lock` (+55, -32)
- `nix/hashes.json` (+4, -4)
- `packages/app/e2e/regression/terminal-hidden.spec.ts` (+79, -0)
- `packages/app/package.json` (+6, -2)
- `packages/app/src/app.tsx` (+45, -28)
- `packages/app/src/components/dialog-select-file.tsx` (+2, -4)
- `packages/app/src/components/prompt-input.stories.tsx` (+28, -22)
- `packages/app/src/components/prompt-input.tsx` (+3, -216)
- `packages/app/src/components/prompt-project-selector.tsx` (+490, -0)
- `packages/app/src/components/settings-dialog.tsx` (+43, -0)
- `packages/app/src/components/settings-v2/dialog-settings-v2.tsx` (+4, -2)
- `packages/app/src/components/settings-v2/general.tsx` (+15, -21)
- `packages/app/src/components/status-popover.tsx` (+4, -3)
- `packages/app/src/components/terminal.tsx` (+6, -4)
- `packages/app/src/components/titlebar-tab-drag.test.ts` (+0, -141)
- `packages/app/src/components/titlebar-tab-drag.ts` (+0, -137)
- `packages/app/src/components/titlebar-tab-gesture.test.ts` (+33, -0)
- `packages/app/src/components/titlebar-tab-gesture.ts` (+0, -20)
- `packages/app/src/components/titlebar-tab-nav.css` (+14, -16)
- `packages/app/src/components/titlebar-tab-nav.tsx` (+10, -6)
- `packages/app/src/components/titlebar-tab-strip.tsx` (+135, -380)
- `packages/app/src/components/titlebar.tsx` (+7, -0)
- `packages/app/src/context/layout.tsx` (+17, -1)
- `packages/app/src/context/models.tsx` (+11, -2)
- `packages/app/src/context/prompt.tsx` (+3, -3)
- `packages/app/src/context/server-sdk.tsx` (+1, -0)
- `packages/app/src/pages/home.tsx` (+18, -27)
- `packages/app/src/pages/layout/helpers.ts` (+1, -2)
- `packages/app/src/pages/new-session.tsx` (+63, -30)
- `packages/app/src/pages/session.tsx` (+82, -62)
- `packages/app/src/pages/session/composer/index.ts` (+3, -2)
- `packages/app/src/pages/session/composer/session-composer-controls.ts` (+77, -62)
- `packages/app/src/pages/session/composer/session-composer-region-controller.ts` (+145, -0)
- `packages/app/src/pages/session/composer/session-composer-region.tsx` (+46, -186)
- `packages/app/src/pages/session/composer/session-composer-state.ts` (+2, -2)
- `packages/app/src/pages/session/composer/session-question-dock.tsx` (+17, -15)
- `packages/app/src/pages/session/composer/todo-panel-motion.stories.tsx` (+33, -34)
- `packages/app/src/pages/session/terminal-panel.tsx` (+1, -1)
- `packages/app/src/pages/session/timeline/message-timeline.tsx` (+17, -3)
- `packages/app/src/pages/session/use-composer-commands.tsx` (+69, -0)
- `packages/app/src/pages/session/use-session-commands.tsx` (+0, -49)
- `packages/cli/package.json` (+1, -1)
- `packages/client/src/generated-effect/.httpapi-codegen.json` (+5, -1)
- `packages/client/src/generated-effect/client.ts` (+88, -49)
- `packages/client/src/generated/.httpapi-codegen.json` (+6, -1)
- `packages/client/src/generated/client.ts` (+52, -0)
- `packages/client/src/generated/types.ts` (+773, -192)
- `packages/client/sst-env.d.ts` (+10, -0)
- `packages/client/test/effect.test.ts` (+52, -3)
- `packages/client/test/promise.test.ts` (+39, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/routes/zen/util/handler.ts` (+2, -1)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/mail/package.json` (+1, -1)
- `packages/console/support/package.json` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/enterprise/package.json` (+1, -1)
- `packages/function/package.json` (+1, -1)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/httpapi-codegen/README.md` (+2, -2)
- `packages/httpapi-codegen/src/index.ts` (+30, -17)
- `packages/httpapi-codegen/sst-env.d.ts` (+10, -0)
- `packages/httpapi-codegen/test/generate.test.ts` (+5, -3)
- `packages/llm/package.json` (+1, -1)
- `packages/llm/src/protocols/openai-responses.ts` (+2, -0)
- `packages/llm/test/fixtures/recordings/openai-responses/gpt-5-5-drives-a-tool-loop.json` (+2, -2)
- `packages/llm/test/fixtures/recordings/openai-responses/gpt-5-5-streams-tool-call.json` (+1, -1)
- `packages/llm/test/fixtures/recordings/openai-responses/openai-responses-gpt-5-5-image-tool-result.json` (+1, -1)
- `packages/llm/test/provider/openai-responses.test.ts` (+1, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/account/account.ts` (+1, -1)
- `packages/opencode/src/account/repo.ts` (+1, -1)
- `packages/opencode/src/auth/index.ts` (+1, -1)
- `packages/opencode/src/background/job.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/mcp.ts` (+12, -10)
- `packages/opencode/src/command/index.ts` (+1, -1)
- `packages/opencode/src/config/config.ts` (+5, -1)
- `packages/opencode/src/control-plane/workspace.ts` (+15, -11)
- `packages/opencode/src/effect/runtime-flags.ts` (+1, -1)
- `packages/opencode/src/env/index.ts` (+1, -1)
- `packages/opencode/src/event-v2-bridge.ts` (+1, -1)
- `packages/opencode/src/format/index.ts` (+5, -1)
- `packages/opencode/src/git/index.ts` (+1, -1)
- `packages/opencode/src/image/image.ts` (+1, -1)
- `packages/opencode/src/installation/index.ts` (+1, -1)
- `packages/opencode/src/lsp/lsp.ts` (+5, -1)
- `packages/opencode/src/mcp/auth.ts` (+1, -10)
- `packages/opencode/src/mcp/index.ts` (+13, -4)
- `packages/opencode/src/mcp/oauth-callback.ts` (+6, -47)
- `packages/opencode/src/plugin/digitalocean.ts` (+2, -60)
- `packages/opencode/src/plugin/index.ts` (+5, -1)
- `packages/opencode/src/plugin/openai/codex.ts` (+4, -91)
- `packages/opencode/src/plugin/snowflake-cortex.ts` (+5, -27)
- `packages/opencode/src/plugin/xai.ts` (+5, -95)
- `packages/opencode/src/project/bootstrap.ts` (+5, -10)
- `packages/opencode/src/project/instance-store.ts` (+5, -1)
- `packages/opencode/src/project/project.ts` (+14, -10)
- `packages/opencode/src/project/vcs.ts` (+1, -1)
- `packages/opencode/src/provider/auth.ts` (+7, -7)
- `packages/opencode/src/provider/provider.ts` (+36, -40)
- `packages/opencode/src/question/index.ts` (+1, -1)
- `packages/opencode/src/session/compaction.ts` (+14, -52)
- `packages/opencode/src/session/instruction.ts` (+5, -1)
- `packages/opencode/src/session/llm.ts` (+14, -10)
- `packages/opencode/src/session/llm/request.ts` (+10, -0)
- `packages/opencode/src/session/processor.ts` (+29, -380)
- `packages/opencode/src/session/prompt.ts` (+43, -142)
- `packages/opencode/src/session/revert.ts` (+5, -8)
- `packages/opencode/src/session/run-state.ts` (+1, -1)
- `packages/opencode/src/session/schema.ts` (+3, -3)
- `packages/opencode/src/session/session.ts` (+56, -27)
- `packages/opencode/src/session/status.ts` (+1, -1)
- `packages/opencode/src/session/summary.ts` (+5, -1)
- `packages/opencode/src/session/system.ts` (+6, -2)
- `packages/opencode/src/session/todo.ts` (+3, -3)
- `packages/opencode/src/share/session.ts` (+5, -1)
- `packages/opencode/src/share/share-next.ts` (+5, -9)
- `packages/opencode/src/skill/discovery.ts` (+1, -1)
- `packages/opencode/src/skill/index.ts` (+5, -8)
- `packages/opencode/src/snapshot/index.ts` (+5, -1)
- `packages/opencode/src/storage/storage.ts` (+1, -1)
- `packages/opencode/src/sync/schema.ts` (+2, -2)
- `packages/opencode/src/worktree/index.ts` (+5, -9)
- `packages/opencode/test/effect/app-graph-types.test.ts` (+0, -108)
- `packages/opencode/test/effect/app-graph.test.ts` (+0, -204)
- `packages/opencode/test/effect/layer-node-tiers-types.test.ts` (+19, -0)
- `packages/opencode/test/effect/layer-node-tiers.test.ts` (+169, -0)
- `packages/opencode/test/effect/layer-node-types.test.ts` (+66, -0)
- `packages/opencode/test/effect/layer-node.test.ts` (+86, -0)
- `packages/opencode/test/effect/scoped-node-types.test.ts` (+23, -0)
- `packages/opencode/test/fixtures/recordings/session/native-openai-oauth-tool-loop.json` (+2, -2)
- `packages/opencode/test/fixtures/recordings/session/native-zen-tool-loop.json` (+2, -2)
- `packages/opencode/test/mcp/oauth-auto-connect.test.ts` (+24, -0)
- `packages/opencode/test/mcp/oauth-callback.test.ts` (+1, -1)
- `packages/opencode/test/provider/provider.test.ts` (+96, -0)
- `packages/opencode/test/provider/transform.test.ts` (+8, -1)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+52, -1)
- `packages/opencode/test/server/httpapi-exercise/types.ts` (+5, -1)
- `packages/opencode/test/server/httpapi-reference.test.ts` (+0, -8)
- `packages/opencode/test/server/httpapi-session.test.ts` (+18, -2)
- `packages/opencode/test/session/compaction.test.ts` (+5, -5)
- `packages/opencode/test/session/llm.test.ts` (+2, -0)
- `packages/opencode/test/session/processor-effect.test.ts` (+24, -29)
- `packages/opencode/test/session/prompt.test.ts` (+50, -8)
- `packages/opencode/test/session/schema-decoding.test.ts` (+1, -1)
- `packages/opencode/test/session/snapshot-tool-race.test.ts` (+4, -4)
- `packages/opencode/test/share/share-next.test.ts` (+3, -5)
- `packages/plugin/package.json` (+1, -1)
- `packages/protocol/src/groups/permission.ts` (+43, -1)
- `packages/protocol/src/groups/session.ts` (+67, -2)
- `packages/protocol/sst-env.d.ts` (+10, -0)
- `packages/schema/AGENTS.md` (+88, -0)
- `packages/schema/src/agent.ts` (+9, -8)
- `packages/schema/src/command.ts` (+5, -4)
- `packages/schema/src/credential.ts` (+5, -4)
- `packages/schema/src/event.ts` (+21, -21)
- `packages/schema/src/file-diff.ts` (+5, -4)
- `packages/schema/src/filesystem.ts` (+4, -3)
- `packages/schema/src/integration.ts` (+20, -19)
- `packages/schema/src/legacy-event.ts` (+1, -18)
- `packages/schema/src/llm.ts` (+8, -3)
- `packages/schema/src/location.ts` (+4, -7)
- `packages/schema/src/model.ts` (+19, -16)
- `packages/schema/src/permission-saved.ts` (+3, -3)
- `packages/schema/src/permission-v1.ts` (+1, -67)
- `packages/schema/src/permission.ts` (+8, -7)
- `packages/schema/src/plugin.ts` (+0, -2)
- `packages/schema/src/project-copy.ts` (+5, -4)
- `packages/schema/src/project-directories.ts` (+0, -1)
- `packages/schema/src/project-id.ts` (+2, -2)
- `packages/schema/src/project.ts` (+18, -15)
- `packages/schema/src/prompt.ts` (+10, -9)
- `packages/schema/src/provider.ts` (+16, -13)
- `packages/schema/src/pty-ticket.ts` (+2, -1)
- `packages/schema/src/pty.ts` (+20, -17)
- `packages/schema/src/question-v1.ts` (+1, -66)
- `packages/schema/src/question.ts` (+18, -11)
- `packages/schema/src/reference.ts` (+11, -8)
- `packages/schema/src/revert.ts` (+10, -9)
- `packages/schema/src/schema.ts` (+3, -3)
- `packages/schema/src/session-event.ts` (+41, -41)
- `packages/schema/src/session-id.ts` (+2, -2)
- `packages/schema/src/session-input.ts` (+4, -3)
- `packages/schema/src/session-message-id.ts` (+0, -11)
- `packages/schema/src/session-message.ts` (+33, -29)
- `packages/schema/src/session-status-event.ts` (+3, -2)
- `packages/schema/src/session-todo.ts` (+4, -3)
- `packages/schema/src/session-v1.ts` (+1, -676)
- `packages/schema/src/session.ts` (+9, -9)
- `packages/schema/src/skill.ts` (+3, -2)
- `packages/schema/src/tui-event.ts` (+2, -1)
- `packages/schema/src/v1/legacy-event.ts` (+18, -0)
- `packages/schema/src/v1/permission.ts` (+66, -0)
- `packages/schema/src/v1/question.ts` (+66, -0)
- `packages/schema/src/v1/session.ts` (+676, -0)
- `packages/schema/src/vcs-event.ts` (+2, -1)
- `packages/schema/src/workspace-event.ts` (+2, -2)
- `packages/schema/src/workspace-id.ts` (+2, -2)
- `packages/schema/src/worktree-event.ts` (+2, -1)
- `packages/schema/test/contract-hygiene.test.ts` (+67, -0)
- `packages/schema/test/v1-isolation.test.ts` (+28, -0)
- `packages/sdk-next/README.md` (+3, -1)
- `packages/sdk-next/src/opencode.ts` (+26, -32)
- `packages/sdk-next/sst-env.d.ts` (+10, -0)
- `packages/sdk-next/test/embedded.test.ts` (+49, -4)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+198, -21)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+1133, -478)
- `packages/sdk/openapi.json` (+4382, -1540)
- `packages/server/package.json` (+1, -1)
- `packages/server/src/handlers.ts` (+6, -2)
- `packages/server/src/handlers/permission.ts` (+38, -1)
- `packages/server/src/handlers/session.ts` (+38, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/session-ui/src/components/basic-tool.css` (+40, -9)
- `packages/session-ui/src/components/markdown-inline-code-kind.test.ts` (+32, -0)
- `packages/session-ui/src/components/markdown-inline-code-kind.ts` (+15, -0)
- `packages/session-ui/src/components/markdown.css` (+137, -24)
- `packages/session-ui/src/components/markdown.tsx` (+48, -0)
- `packages/session-ui/src/components/message-part.css` (+246, -55)
- `packages/session-ui/src/components/session-review.css` (+12, -2)
- `packages/session-ui/src/components/session-turn.css` (+12, -2)
- `packages/session-ui/src/components/tool-error-card.css` (+39, -2)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/app/src/app.tsx` (+15, -15)
- `packages/stats/app/src/component/locale-links.tsx` (+17, -0)
- `packages/stats/app/src/context/i18n.tsx` (+27, -0)
- `packages/stats/app/src/context/language.tsx` (+61, -0)
- `packages/stats/app/src/entry-server.tsx` (+21, -14)
- `packages/stats/app/src/i18n.ts` (+275, -0)
- `packages/stats/app/src/i18n/ar.ts` (+228, -0)
- `packages/stats/app/src/i18n/br.ts` (+230, -0)
- `packages/stats/app/src/i18n/da.ts` (+229, -0)
- `packages/stats/app/src/i18n/de.ts` (+230, -0)
- `packages/stats/app/src/i18n/es.ts` (+229, -0)
- `packages/stats/app/src/i18n/fr.ts` (+231, -0)
- `packages/stats/app/src/i18n/it.ts` (+230, -0)
- `packages/stats/app/src/i18n/ja.ts` (+231, -0)
- `packages/stats/app/src/i18n/ko.ts` (+231, -0)
- `packages/stats/app/src/i18n/no.ts` (+229, -0)
- `packages/stats/app/src/i18n/pl.ts` (+228, -0)
- `packages/stats/app/src/i18n/ru.ts` (+230, -0)
- `packages/stats/app/src/i18n/th.ts` (+230, -0)
- `packages/stats/app/src/i18n/tr.ts` (+230, -0)
- `packages/stats/app/src/i18n/uk.ts` (+230, -0)
- `packages/stats/app/src/i18n/zh.ts` (+229, -0)
- `packages/stats/app/src/i18n/zht.ts` (+229, -0)
- `packages/stats/app/src/lib/language.ts` (+48, -0)
- `packages/stats/app/src/routes/[lab]/[model].tsx` (+193, -140)
- `packages/stats/app/src/routes/[lab]/index.tsx` (+87, -73)
- `packages/stats/app/src/routes/index.css` (+37, -0)
- `packages/stats/app/src/routes/index.tsx` (+169, -136)
- `packages/stats/app/src/routes/stats-shell.tsx` (+142, -86)
- `packages/stats/server/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/tui/src/component/dialog-session-list.tsx` (+65, -7)
- `packages/tui/src/ui/dialog-select.tsx` (+74, -3)
- `packages/tui/test/cli/cmd/tui/sync-fixture.tsx` (+6, -3)
- `packages/tui/test/cli/cmd/tui/sync.test.tsx` (+2, -0)
- `packages/tui/test/component/dialog-session-list.test.ts` (+46, -0)
- `packages/ui/LICENSE` (+21, -0)
- `packages/ui/package.json` (+37, -4)
- `packages/ui/script/colors.txt` (+1, -0)
- `packages/ui/script/pack.ts` (+40, -0)
- `packages/ui/script/publish.ts` (+26, -0)
- `packages/ui/src/assets/fonts/Inter.ttf` (+-, --)
- `packages/ui/src/assets/fonts/JetBrainsMonoNerdFontMono-Regular.woff2` (+-, --)
- `packages/ui/src/components/accordion.css` (+31, -7)
- `packages/ui/src/components/card.css` (+26, -5)
- `packages/ui/src/components/card.tsx` (+1, -1)
- `packages/ui/src/styles/tailwind/colors.css` (+1, -0)
- `packages/ui/src/theme/themes/oc-2.json` (+20, -14)
- `packages/ui/src/theme/v2/mapping.ts` (+2, -0)
- `packages/ui/src/v2/components/icon.tsx` (+4, -0)
- `packages/ui/src/v2/components/project-avatar-v2.css` (+0, -1)
- `packages/ui/src/v2/components/tooltip-v2.css` (+4, -0)
- `packages/ui/src/v2/styles/theme.css` (+16, -0)
- `packages/ui/tsconfig.build.json` (+14, -0)
- `packages/web/package.json` (+1, -1)
- `script/publish.ts` (+3, -0)
- `sdks/vscode/package.json` (+1, -1)
- `specs/layer-node-tiers.md` (+235, -0)
- `specs/v2/config.md` (+10, -7)
- `specs/v2/instructions.md` (+1, -1)
- `specs/v2/provider-model.md` (+1, -1)
- `specs/v2/session.md` (+9, -2)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 1adbeae..bc7c31c 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.17.10",
+  "version": "1.17.11",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 19854c7..139d116 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.17.10",
+  "version": "1.17.11",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/catalog.ts
```diff
diff --git a/packages/core/src/catalog.ts b/packages/core/src/catalog.ts
index 5f90b09..63d0ae3 100644
--- a/packages/core/src/catalog.ts
+++ b/packages/core/src/catalog.ts
@@ -235,6 +235,11 @@ export const layer = Layer.effect(
           if (!record) return
           const provider = record.provider
 
+          // TODO: Remove these provider-specific assumptions once model syncing reliably reports available deployments.
+          if (providerID === ProviderV2.ID.azure || providerID === ProviderV2.ID.make("azure-cognitive-services")) {
+            return
+          }
+
           if (providerID === ProviderV2.ID.opencode) {
             const gpt5Nano = record.models.get(ModelV2.ID.make("gpt-5-nano"))
             if (gpt5Nano?.enabled && gpt5Nano.status === "active") return projectModel(gpt5Nano, provider)
```

#### packages/core/src/config/mcp.ts
```diff
diff --git a/packages/core/src/config/mcp.ts b/packages/core/src/config/mcp.ts
index 54998e1..f3a5ac9 100644
--- a/packages/core/src/config/mcp.ts
+++ b/packages/core/src/config/mcp.ts
@@ -3,6 +3,15 @@ export * as ConfigMCP from "./mcp"
 import { Schema } from "effect"
 import { PositiveInt } from "../schema"
 
+export class Timeout extends Schema.Class<Timeout>("ConfigV2.MCP.Timeout")({
+  startup: PositiveInt.pipe(Schema.optional).annotate({
+    description: "Maximum time in milliseconds to establish and initialize the MCP server.",
+  }),
+  request: PositiveInt.pipe(Schema.optional).annotate({
+    description: "Maximum time in milliseconds to wait for each MCP request after initialization.",
+  }),
+}) {}
+
 export class Local extends Schema.Class<Local>("ConfigV2.MCP.Local")({
   type: Schema.Literal("local"),
   command: Schema.String.pipe(Schema.Array),
@@ -11,7 +20,7 @@ export class Local extends Schema.Class<Local>("ConfigV2.MCP.Local")({
   }),
   environment: Schema.Record(Schema.String, Schema.String).pipe(Schema.optional),
   disabled: Schema.Boolean.pipe(Schema.optional),
-  timeout: PositiveInt.pipe(Schema.optional),
+  timeout: Timeout.pipe(Schema.optional),
 }) {}
 
 export class OAuth extends Schema.Class<OAuth>("ConfigV2.MCP.OAuth")({
@@ -28,12 +37,12 @@ export class Remote extends Schema.Class<Remote>("ConfigV2.MCP.Remote")({
   headers: Schema.Record(Schema.String, Schema.String).pipe(Schema.optional),
   oauth: Schema.Union([OAuth, Schema.Literal(false)]).pipe(Schema.optional),
   disabled: Schema.Boolean.pipe(Schema.optional),
-  timeout: PositiveInt.pipe(Schema.optional),
+  timeout: Timeout.pipe(Schema.optional),
 }) {}
 
 export const Server = Schema.Union([Local, Remote]).pipe(Schema.toTaggedUnion("type"))
 
 export class Info extends Schema.Class<Info>("ConfigV2.MCP")({
-  timeout: PositiveInt.pipe(Schema.optional),
+  timeout: Timeout.pipe(Schema.optional),
   servers: Schema.Record(Schema.String, Server).pipe(Schema.optional),
 }) {}
```

#### packages/core/src/config/plugin/reference.ts
```diff
diff --git a/packages/core/src/config/plugin/reference.ts b/packages/core/src/config/plugin/reference.ts
index 0e7b95a..d5fa53c 100644
--- a/packages/core/src/config/plugin/reference.ts
+++ b/packages/core/src/config/plugin/reference.ts
@@ -25,6 +25,8 @@ export const Plugin = define({
           const directory = doc.path ? path.dirname(doc.path) : location.directory
           for (const [name, entry] of Object.entries(doc.info.references ?? {})) {
             if (!validAlias(name)) continue
+            const description = typeof entry === "string" ? undefined : entry.description
+            const hidden = typeof entry === "string" ? undefined : entry.hidden
             entries.set(
               name,
               local(entry)
@@ -33,15 +35,15 @@ export const Plugin = define({
                     path: AbsolutePath.make(
                       localPath(directory, global.home, typeof entry === "string" ? entry : entry.path),
                     ),
-                    description: typeof entry === "string" ? undefined : entry.description,
-                    hidden: typeof entry === "string" ? undefined : entry.hidden,
+                    ...(description === undefined ? {} : { description }),
+                    ...(hidden === undefined ? {} : { hidden }),
                   })
                 : Reference.GitSource.make({
                     type: "git",
                     repository: typeof entry === "string" ? entry : entry.repository,
-                    branch: typeof entry === "string" ? undefined : entry.branch,
-                    description: typeof entry === "string" ? undefined : entry.description,
-                    hidden: typeof entry === "string" ? undefined : entry.hidden,
+                    ...(entry.branch === undefined ? {} : { branch: entry.branch }),
+                    ...(description === undefined ? {} : { description }),
+                    ...(hidden === undefined ? {} : { hidden }),
                   }),
             )
           }
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/kilocode/agent/index.ts
- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/src/agent/agent.ts
- `src/tool/notebook-host.ts` - update based on kilocode packages/opencode/src/kilocode/tool/notebook-host.ts changes
- `src/tool/registry.test.ts` - update based on opencode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/kilocode/tool/registry.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
- `src/tool/registry.ts` - update based on opencode packages/opencode/src/tool/registry.ts changes
- `src/tool/schema.ts` - update based on opencode packages/opencode/src/tool/schema.ts changes
- `src/tool/todo.ts` - update based on opencode packages/opencode/src/tool/todo.ts changes
- `src/tool/truncate.ts` - update based on opencode packages/opencode/src/tool/truncate.ts changes
