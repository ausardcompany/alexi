# Upstream Changes Report
Generated: 2026-04-17 07:49:29

## Summary
- kilocode: 61 commits, 181 files changed
- opencode: 0 commits, 0 files changed

## kilocode Changes (36c5d9e59..883f12819)

### Commits

- 883f12819 - Merge pull request #9066 from Kilo-Org/fix/custom-provider-xhigh-reasoning-effort (Christiaan Arnoldus, 2026-04-17)
- ca6f4bc45 - Merge pull request #9039 from Kilo-Org/fix/restore-tsgo-lightweight-diagnostics (Marian Alexandru Alecu, 2026-04-17)
- 06cf57dd7 - Merge pull request #9038 from Kilo-Org/kilocode-legacy-config (Marian Alexandru Alecu, 2026-04-17)
- 12f2dc2c1 - Merge pull request #9078 from Kilo-Org/remove-20-dollar-topup-bonus-v2 (Mark IJbema, 2026-04-17)
- 5277a6c93 - docs(kilo-docs): remove $20 first top-up bonus references (kiloconnect[bot], 2026-04-17)
- 79ba643cb - fix(vscode): add xhigh reasoning effort to custom provider model variants (Josh Lambert, 2026-04-16)
- 0896d2d45 - Merge pull request #9062 from Kilo-Org/fix/release-notes-cwd-bug (Mark IJbema, 2026-04-16)
- ee7604192 - chore: remove changeset, this is an infra fix not user-facing (kiloconnect[bot], 2026-04-16)
- 58336a648 - fix: read CHANGELOG with absolute path so release notes populate (kiloconnect[bot], 2026-04-16)
- f3708c55f - release: v7.2.11 (kilo-maintainer[bot], 2026-04-16)
- d9efe4050 - Merge pull request #8999 from Kilo-Org/petalite-matrix (Kirill Kalishev, 2026-04-16)
- 958a999a4 - Merge pull request #9054 from Kilo-Org/docs/kiloclaw-solo-group-chats (Alex Gold, 2026-04-16)
- 8e0922961 - fix(jetbrains): resolve split-mode directory and demote chat payload logs (kirillk, 2026-04-16)
- bea88788f - fix(cli): continue queued follow-up prompts (#9047) (Marius, 2026-04-16)
- fbed90224 - fix(jetbrains): adapt to updated OpenAPI schema and fix anyOf union deserialization (kirillk, 2026-04-16)
- 3b922d98d - Update packages/kilo-docs/pages/kiloclaw/chat-platforms/telegram.md (Alex Gold, 2026-04-16)
- adc9c526a - Update packages/kilo-docs/pages/kiloclaw/chat-platforms/slack.md (Alex Gold, 2026-04-16)
- 8b6668007 - revert: remove tsconfig.json formatting changes (Alex Gold, 2026-04-16)
- 29c468476 - docs(kilo-docs): expand KiloClaw chat platform guides with DM and channel configuration (Alex Gold, 2026-04-16)
- 2b0790518 - Merge pull request #9041 from Kilo-Org/fix/changelog-publish-runner (Mark IJbema, 2026-04-16)
- 17e8110e2 - chore(cli): remove unused tmpdir import from lightweight LSP test (Alex Alecu, 2026-04-16)
- 030adeea9 - fix(cli): remove misleading TsClient fallback in experimental mode (Alex Alecu, 2026-04-16)
- 4e0b31cd0 - fix: include changelog and release notes for prereleases too (kiloconnect[bot], 2026-04-16)
- f96346575 - fix: move changeset consumption to publish runner so changelog is committed (kiloconnect[bot], 2026-04-16)
- 83a4a0927 - fix(cli): add dedup guard to TsClient creation in Block A (Alex Alecu, 2026-04-16)
- d5d8344c7 - fix(cli): restore tsgo lightweight TypeScript diagnostics (Alex Alecu, 2026-04-16)
- fd85a1509 - fix(vscode): abort queued follow-up prompts (#9036) (Marius, 2026-04-16)
- 16f48b764 - test(cli): restore kilo-config skill legacy paths test (Alex Alecu, 2026-04-16)
- faebb41b7 - Merge pull request #9034 from Kilo-Org/imanol/snapshot (Imanol Maiztegui, 2026-04-16)
- 28aebeb15 - Merge pull request #8986 from Kilo-Org/catrielmuller/fix-memory-webfetch-test (Catriel Müller, 2026-04-16)
- 71852f246 - feat(vscode): add heap snapshot command for bundled CLI (Imanol Maiztegui, 2026-04-16)
- a32dfe4ce - Merge pull request #8996 from Kilo-Org/session/agent_ff4de034-ef4e-4209-a163-ac950e340c4b (Mark IJbema, 2026-04-16)
- d73e848cf - fix(ui): restore localized revert tooltips (#9031) (Marius, 2026-04-16)
- 58ff01a2b - chore: add changeset for gitignore lockfile patterns fix (kiloconnect[bot], 2026-04-16)
- 38c746ddd - fix(vscode): show local review follow-up questions (#9032) (Marius, 2026-04-16)
- e1da99c40 - fix(vscode): avoid stale queued message state (#9029) (Marius, 2026-04-16)
- e83d562a6 - fix(agent-manager): preserve collapsed section stats (#9030) (Marius, 2026-04-16)
- 7dc526a6c - fix(vscode): restore chat tool spacing (#9025) (Marius, 2026-04-16)
- 0885367a3 - fix(cli): add pnpm-lock.yaml and yarn.lock to .kilo/.gitignore (kiloconnect[bot], 2026-04-16)
- f64a95976 - Merge branch 'main' into petalite-matrix (Kirill Kalishev, 2026-04-15)
- ac507485f - refactor(jetbrains): organize backend tests into app/cli/workspace packages (kirillk, 2026-04-15)
- f25830cea - i18n(jetbrains): move all user-facing strings to KiloBundle (kirillk, 2026-04-15)
- 8a878a287 - refactor(jetbrains): rename chat package to session (kirillk, 2026-04-15)
- dd27ce75c - refactor(jetbrains): move services to client.app package, rename ChatModel to SessionState (kirillk, 2026-04-15)
- 00ea49f7a - refactor(jetbrains): introduce Workspace and KiloWorkspaceService, delete KiloProjectService (kirillk, 2026-04-15)
- 9c6da0731 - refactor(jetbrains): rename KiloProjectRpcApi to KiloWorkspaceRpcApi (kirillk, 2026-04-15)
- 906b87dfa - test(jetbrains): add SessionModel tests with constructor-injected fake RPC (kirillk, 2026-04-15)
- b02e8daa4 - refactor(jetbrains): rename ChatPanel to SessionUi, move UI components to chat.ui (kirillk, 2026-04-15)
- 73e92ad13 - fix(jetbrains): fix model picker selection and stale status indicator (kirillk, 2026-04-15)
- 845d8c94d - refactor(jetbrains): SessionModel owns session lifecycle, fix error parsing (kirillk, 2026-04-15)
- cee7960ff - feat: increase vcpu on test (Catriel Müller, 2026-04-15)
- d039bdf6c - feat: test runner (Catriel Müller, 2026-04-15)
- ce278ff7e - refactor(jetbrains): rename EmptyChatUi to StatusPanel (kirillk, 2026-04-15)
- ffafd9241 - chore: remove plan files from repo (kirillk, 2026-04-15)
- 88b02a1f5 - refactor(jetbrains): update services, UI components, and remove obsolete files (kirillk, 2026-04-15)
- 8dd90f1d4 - refactor(jetbrains): move app/workspace watching into SessionModel, inline SessionUi (kirillk, 2026-04-15)
- 81261dbd0 - refactor(jetbrains): extract MVC architecture for chat panel (kirillk, 2026-04-15)
- 3faed4751 - fix: fix git test (Catriel Müller, 2026-04-15)
- 090d1f01a - fix: memory test (Catriel Müller, 2026-04-15)
- 999bf4d51 - chore(jetbrains): upgrade Gradle deps and wrapper (kirillk, 2026-04-15)
- 2daebbd1c - feat(jetbrains): implement basic agent chat and refactor backend into cli/ package (kirillk, 2026-04-14)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/test/tool/skill.test.ts` (+32, -0)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
(no changes)

#### Other Changes
- `.changeset/custom-provider-xhigh-effort.md` (+5, -0)
- `.changeset/fix-provider-auth-invalidation.md` (+0, -6)
- `.changeset/gateway-models-feature-header.md` (+0, -5)
- `.changeset/git-stats-polling.md` (+0, -5)
- `.changeset/opencode-1310.md` (+0, -10)
- `.changeset/opencode-136.md` (+0, -9)
- `.changeset/opencode-137.md` (+0, -10)
- `.changeset/subsession-costs.md` (+0, -5)
- `.changeset/terminal-context-mention.md` (+0, -5)
- `.github/workflows/publish.yml` (+1, -1)
- `.github/workflows/test.yml` (+2, -2)
- `README.md` (+0, -1)
- `bun.lock` (+16, -16)
- `package.json` (+1, -1)
- `packages/app/package.json` (+1, -1)
- `packages/desktop-electron/package.json` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/ai-providers/kilocode.md` (+4, -6)
- `packages/kilo-docs/pages/getting-started/setup-authentication.md` (+2, -2)
- `packages/kilo-docs/pages/kiloclaw/chat-platforms/discord.md` (+81, -2)
- `packages/kilo-docs/pages/kiloclaw/chat-platforms/slack.md` (+96, -8)
- `packages/kilo-docs/pages/kiloclaw/chat-platforms/telegram.md` (+63, -4)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `.run/Run JetBrains Plugin.run.xml => packages/kilo-jetbrains/.run/Run IDE (Backend).run.xml` (+3, -3)
- `packages/kilo-jetbrains/.run/Run IDE (Frontend).run.xml` (+27, -0)
- `packages/kilo-jetbrains/.run/runIdeSplitMode.run.xml` (+7, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendAppService.kt` (+21, -3)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendChatManager.kt` (+187, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendConnectionService.kt` (+10, -8)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendSessionManager.kt` (+44, -48)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/{app => cli}/CliServer.kt` (+1, -1)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/{app => cli}/KiloBackendCliManager.kt` (+6, -54)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/{util => cli}/KiloBackendHttpClients.kt` (+1, -1)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloCliDataParser.kt` (+343, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloProjectRpcApiProvider.kt` (+3, -3)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloSessionRpcApiImpl.kt` (+49, -3)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/{KiloProjectRpcApiImpl.kt => KiloWorkspaceRpcApiImpl.kt}` (+12, -3)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/util/KiloLog.kt` (+2, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/workspace/KiloBackendWorkspace.kt` (+6, -6)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/{ => app}/KiloAppStateTest.kt` (+1, -1)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/{ => app}/KiloBackendAppServiceTest.kt` (+1, -1)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/{ => app}/KiloBackendSessionManagerTest.kt` (+2, -2)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/{ => app}/KiloConnectionServiceTest.kt` (+3, -14)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/{ => cli}/ApiModelSerializationTest.kt` (+1, -1)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/{ => cli}/KiloBackendHttpClientsTest.kt` (+2, -2)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/KiloCliDataParserTest.kt` (+475, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/{ => cli}/ProjectModelSerializationTest.kt` (+42, -19)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/{ => cli}/SessionModelSerializationTest.kt` (+1, -1)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/FakeCliServer.kt` (+1, -1)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/TestLog.kt` (+5, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/{ => workspace}/KiloBackendWorkspaceTest.kt` (+21, -7)
- `packages/kilo-jetbrains/build-tasks/src/main/kotlin/FixGeneratedApiTask.kt` (+54, -0)
- `packages/kilo-jetbrains/detekt.yml` (+22, -21)
- `packages/kilo-jetbrains/frontend/build.gradle.kts` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/KiloProjectService.kt` (+0, -57)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/KiloSessionService.kt` (+0, -115)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/KiloToolWindowFactory.kt` (+45, -11)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/ReinstallKiloAction.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/RestartKiloAction.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/StatusInfoAction.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/{ => app}/KiloAppService.kt` (+25, -22)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloSessionService.kt` (+146, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloWorkspaceService.kt` (+101, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/Workspace.kt` (+16, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+190, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/SessionEvent.kt` (+45, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/SessionModel.kt` (+350, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/SessionState.kt` (+121, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/LabelPicker.kt` (+94, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/MessageListPanel.kt` (+165, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/PromptPanel.kt` (+132, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/{KiloWelcomeUi.kt => session/ui/StatusPanel.kt}` (+94, -98)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/send.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/send_dark.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/stop.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/stop_dark.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+40, -7)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/model/AppWatchingTest.kt` (+19, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/model/ConfigSelectionTest.kt` (+41, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/model/HistoryLoadingTest.kt` (+31, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/model/ListenerLifecycleTest.kt` (+60, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/model/MessageListTest.kt` (+55, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/model/SessionCreationTest.kt` (+43, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/model/SessionModelTestBase.kt` (+165, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/model/StatusComputationTest.kt` (+44, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/model/TurnLifecycleTest.kt` (+53, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/model/ViewSwitchingTest.kt` (+26, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/model/WorkspaceWatchingTest.kt` (+32, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/EdtAssertions.kt` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeAppRpcApi.kt` (+47, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeSessionRpcApi.kt` (+114, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeWorkspaceRpcApi.kt` (+35, -0)
- `packages/kilo-jetbrains/gradle/libs.versions.toml` (+5, -5)
- `packages/kilo-jetbrains/gradle/wrapper/gradle-wrapper.jar` (+-, --)
- `packages/kilo-jetbrains/gradle/wrapper/gradle-wrapper.properties` (+3, -1)
- `packages/kilo-jetbrains/gradlew` (+32, -18)
- `packages/kilo-jetbrains/gradlew.bat` (+22, -18)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloSessionRpcApi.kt` (+21, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/{KiloProjectRpcApi.kt => KiloWorkspaceRpcApi.kt}` (+12, -3)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/ChatDto.kt` (+144, -0)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/message-part.tsx` (+2, -2)
- `packages/kilo-vscode/CHANGELOG.md` (+42, -0)
- `packages/kilo-vscode/README.md` (+0, -1)
- `packages/kilo-vscode/package.json` (+6, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+9, -7)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+8, -4)
- `packages/kilo-vscode/src/agent-manager/GitStatsPoller.ts` (+28, -35)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+1, -0)
- `packages/kilo-vscode/src/commands/heap-snapshot.ts` (+36, -0)
- `packages/kilo-vscode/src/extension.ts` (+3, -0)
- `packages/kilo-vscode/src/kilo-provider/abort.ts` (+21, -0)
- `packages/kilo-vscode/tests/unit/abort.test.ts` (+82, -0)
- `packages/kilo-vscode/tests/unit/session-queue.test.ts` (+94, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/chat/message-list-tool-to-queued-user-spacing-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/AssistantMessage.tsx` (+0, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/ChatView.tsx` (+3, -4)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/components/settings/CustomProviderModelCard.tsx` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/context/session-queue.ts` (+36, -7)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/stories/chat.stories.tsx` (+96, -1)
- `packages/kilo-vscode/webview-ui/src/styles/chat-layout.css` (+7, -4)
- `packages/kilo-vscode/webview-ui/src/types/messages.ts` (+2, -0)
- `packages/opencode/CHANGELOG.md` (+28, -0)
- `packages/opencode/package.json` (+3, -3)
- `packages/opencode/script/test-runner.ts` (+346, -0)
- `packages/opencode/src/config/config.ts` (+11, -1)
- `packages/opencode/src/kilocode/cli/heap-snapshot.ts` (+13, -0)
- `packages/opencode/src/kilocode/commit-message/git-context.ts` (+7, -7)
- `packages/opencode/src/kilocode/session/prompt-queue.ts` (+86, -0)
- `packages/opencode/src/lsp/index.ts` (+15, -0)
- `packages/opencode/src/lsp/server.ts` (+6, -20)
- `packages/opencode/src/server/routes/kilocode.ts` (+23, -0)
- `packages/opencode/src/session/prompt.ts` (+12, -1)
- `packages/opencode/test/kilocode/commit-message/git-context.test.ts` (+191, -372)
- `packages/opencode/test/kilocode/config-gitignore.test.ts` (+41, -0)
- `packages/opencode/test/kilocode/lsp-typescript-lightweight.test.ts` (+89, -0)
- `packages/opencode/test/kilocode/session-prompt-queue.test.ts` (+323, -0)
- `packages/opencode/test/lsp/index.test.ts` (+38, -56)
- `packages/opencode/test/memory/abort-leak.test.ts` (+1, -4)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+43, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+28, -0)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/i18n/en.ts` (+1, -1)
- `packages/ui/src/i18n/nl.ts` (+1, -1)
- `packages/ui/src/i18n/uk.ts` (+1, -1)
- `packages/util/package.json` (+1, -1)
- `script/publish.ts` (+59, -0)
- `script/upstream/package.json` (+1, -1)
- `script/upstream/transforms/transform-package-json.ts` (+36, -0)
- `script/version.ts` (+3, -37)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/opencode/test/tool/skill.test.ts
```diff
diff --git a/packages/opencode/test/tool/skill.test.ts b/packages/opencode/test/tool/skill.test.ts
index 59eaa9c50..880e5b98d 100644
--- a/packages/opencode/test/tool/skill.test.ts
+++ b/packages/opencode/test/tool/skill.test.ts
@@ -167,4 +167,36 @@ Use this skill.
       process.env.KILO_TEST_HOME = home
     }
   })
+
+  test("built-in kilo-config includes named command lookup guidance", async () => {
+    await using tmp = await tmpdir({ git: true })
+
+    const home = process.env.KILO_TEST_HOME
+    process.env.KILO_TEST_HOME = tmp.path
+
+    try {
+      await Instance.provide({
+        directory: tmp.path,
+        fn: async () => {
+          const tool = await SkillTool.init()
+          const ctx: Tool.Context = {
+            ...baseCtx,
+            ask: async () => {},
+          }
+
+          const result = await tool.execute({ name: "kilo-config" }, ctx)
+
+          expect(tool.description).toContain("where it loads things from")
+          expect(result.metadata.dir).toBe("builtin")
+          expect(result.output).toContain("Finding a named command")
+          expect(result.output).toContain("~/.config/kilo/")
+          expect(result.output).toContain("~/.kilocode/")
+          expect(result.output).toContain("**/command/")
+          expect(result.output).toContain("explicit search")
+        },
+      })
+    } finally {
+      process.env.KILO_TEST_HOME = home
+    }
+  })
 })
```


## opencode Changes (7341718..c57c531)

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

- `src/tool/skill.test.ts` - update based on kilocode packages/opencode/test/tool/skill.test.ts changes
