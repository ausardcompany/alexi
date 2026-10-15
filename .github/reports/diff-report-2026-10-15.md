# Upstream Changes Report
Generated: 2026-10-15 10:58:15

## Summary
- kilocode: 90 commits, 163 files changed
- opencode: 78 commits, 390 files changed

## kilocode Changes (2a7edfedb..e3ef95471)

### Commits

- e3ef95471 - docs(swarm): board lives with background agents, not Experimental settings (#15106) (kilo-code-bot[bot], 2026-10-15)
- 1361658ca - release: v7.8.12 (kilo-maintainer[bot], 2026-10-15)
- 8cb92e0c5 - Merge pull request #14774 from LEN5010/research/terminal-restart-ownership-20261003 (Marius, 2026-10-15)
- 77a2bcd7f - Merge pull request #15032 from Kilo-Org/docs/ai-gateway-url (Christiaan Arnoldus, 2026-10-15)
- f150c20cc - Merge pull request #15030 from Kilo-Org/feat/kilo-ai-gateway-url (Christiaan Arnoldus, 2026-10-15)
- 5f6035b18 - Merge pull request #15053 from Kilo-Org/docs/code-reviewer-concurrency (Emilie Lima Schario, 2026-10-15)
- 937f48b74 - docs: auto-sync cloud-agent with merged PRs (through 2026-10-15) (#14555) (github-actions[bot], 2026-10-15)
- a72ad3062 - Merge pull request #15082 from Kilo-Org/jetbrains/release/v7.1.10-rc.4 (Kirill Kalishev, 2026-10-14)
- 10343312b - docs(jetbrains): edit changelog for v7.1.10-rc.4 (Kirill Kalishev, 2026-10-14)
- 35ce9cec2 - release(jetbrains): v7.1.10-rc.4 (kilo-maintainer[bot], 2026-10-14)
- 18d8d9653 - Merge pull request #15078 from Kilo-Org/chore/jetbrains-cli-pin-v7.8.10 (Kirill Kalishev, 2026-10-14)
- 62c980ac8 - chore(jetbrains): bump CLI pin to v7.8.10 (kilo-maintainer[bot], 2026-10-14)
- 0ccfcf7c3 - release: v7.8.10 (kilo-maintainer[bot], 2026-10-14)
- d8fb4417a - Merge pull request #15033 from Kilo-Org/bold-jaguar (Kirill Kalishev, 2026-10-14)
- c59ed9d28 - Merge pull request #15057 from Kilo-Org/golden-keyboard (Kirill Kalishev, 2026-10-14)
- a1ad50d60 - Merge pull request #15056 from Kilo-Org/crisp-quartz (Kirill Kalishev, 2026-10-14)
- 3d84bb65f - fix(jetbrains): only drop a restored draft once its own send landed (kirillk, 2026-10-14)
- 0e007ecf2 - fix(jetbrains): gate replay on SharedFlow.onSubscription instead of onStart (kirillk, 2026-10-14)
- 4dc849182 - docs: move rollout history from user-facing overview to architecture page (kiloconnect[bot], 2026-10-14)
- ec250a1da - docs: move code review rollout history to architecture docs (kiloconnect[bot], 2026-10-14)
- 1fac55793 - fix(jetbrains): address review feedback on prompt draft restore (kirillk, 2026-10-14)
- 25fbbbda8 - fix(jetbrains): subscribe live events before replaying pending prompts (kirillk, 2026-10-14)
- 7e1cad6c7 - fix(jetbrains): replay pending prompts on subscription instead of polling (kirillk, 2026-10-14)
- ba80d0397 - docs(core): note submatch offset caveat for non-UTF-8 grep (kirillk, 2026-10-14)
- 31906a56b - fix(core): use lossy UTF-8 instead of Windows-1252 for non-UTF-8 grep matches (kirillk, 2026-10-14)
- 987987f5d - fix(jetbrains): keep the prompt draft in step with the transcript (kirillk, 2026-10-14)
- 87ec7c7b3 - Merge pull request #15047 from Kilo-Org/daring-raccoon (Kirill Kalishev, 2026-10-14)
- 33bb45ecc - Merge pull request #15058 from Kilo-Org/gentle-ferret (Kirill Kalishev, 2026-10-14)
- 7eeca7864 - fix(jetbrains): address review feedback (kirillk, 2026-10-14)
- 649ca3c2e - Merge pull request #15034 from Kilo-Org/feat/conda-client-id-telemetry (Pedro Heyerdahl, 2026-10-14)
- 1c1879504 - refactor(jetbrains): tidy recoverPending readability (kirillk, 2026-10-14)
- 573272866 - fix(jetbrains): address review feedback on prompt reconcile (kirillk, 2026-10-14)
- 00698f3ba - fix(jetbrains): recover a missed pending prompt from backend activity (kirillk, 2026-10-14)
- df99ec0f3 - test(telemetry): verify conda ID reaches CLI events (Pedro Heyerdahl, 2026-10-14)
- 369f68a81 - Merge branch 'main' into feat/conda-client-id-telemetry (Pedro Heyerdahl, 2026-10-14)
- 31bab7163 - fix(telemetry): hide and clean up conda probe (Pedro Heyerdahl, 2026-10-14)
- fa9eeaf30 - fix(mcp): keep badges on failed reads and clear rejected clients (kirillk, 2026-10-14)
- 662993bdd - fix(mcp): address review feedback on conditional invalidation (kirillk, 2026-10-14)
- 7bf5378d2 - docs(core): note mixed-encoding decode tradeoff in grep (kirillk, 2026-10-14)
- b8d12a119 - feat(jetbrains): opt in to Marketplace error handler (kirillk, 2026-10-14)
- 0e6da3104 - fix(core): handle non-UTF-8 ripgrep matches in grep (kirillk, 2026-10-14)
- 9f9756450 - Merge branch 'main' into research/terminal-restart-ownership-20261003 (Lennard, 2026-10-14)
- 84b245b8c - docs(kilo-docs): drop legacy Kilo Gateway URLs (Christiaan Arnoldus, 2026-10-14)
- e7469f218 - Merge branch 'main' into feat/kilo-ai-gateway-url (Christiaan Arnoldus, 2026-10-14)
- de215afa2 - docs: document code review concurrency limits (Emilie Schario, 2026-10-14)
- c45321a87 - docs(kilo-docs): point legacy gateway paths at the apps/web rewrites (Christiaan Arnoldus, 2026-10-14)
- 7724ac46a - refactor(gateway): use KILO_API_URL/api/gateway/v1 as the fallback gateway base (Christiaan Arnoldus, 2026-10-14)
- fdb634f53 - fix(mcp): stop automatic OAuth reset and sync auth badges (kirillk, 2026-10-13)
- c7cea5fd9 - test(opencode): run the read-failure contract test on one database (kirillk, 2026-10-13)
- 14aa4338f - test(opencode): drop global AppRuntime from the read-failure contract test (kirillk, 2026-10-13)
- 2ce131868 - test(opencode): pin the attachment read-failure text the JetBrains notice parses (kirillk, 2026-10-13)
- 068c7c3bb - refactor(jetbrains): detect unreadable attachments without CLI changes (kirillk, 2026-10-13)
- 4ee8d1b3b - Merge pull request #15036 from Kilo-Org/cosmic-orchid (Kirill Kalishev, 2026-10-13)
- a993e7331 - Revert "fix(telemetry): hash conda client ID before capture" (Pedro Heyerdahl, 2026-10-13)
- b31031d9c - fix(telemetry): hash conda client ID before capture (Pedro Heyerdahl, 2026-10-13)
- ff20ca72d - Merge pull request #15017 from Kilo-Org/fix/glob-respect-gitignore (Andrea Giammarchi, 2026-10-13)
- 44856c1cd - fix(jetbrains): address review feedback on live-only auto-expand (kirillk, 2026-10-13)
- 5135f2e0a - fix(telemetry): ignore forwarded conda client IDs (Pedro Heyerdahl, 2026-10-13)
- 934829d7f - fix(opencode): annotate the attachment notice test assertions (kirillk, 2026-10-13)
- ffb2f16b8 - test(telemetry): focus conda ID coverage on effective user agent (Pedro Heyerdahl, 2026-10-13)
- 6523979fe - test(telemetry): consolidate conda ID coverage (Pedro Heyerdahl, 2026-10-13)
- f86cb4cb5 - fix(jetbrains): use a generic fallback for unknown notice kinds (kirillk, 2026-10-13)
- e86c9def8 - feat(telemetry): include conda client ID in Kilo events (Pedro Heyerdahl, 2026-10-13)
- cd7c29ef6 - fix(jetbrains): expand transcript blocks only while live (kirillk, 2026-10-13)
- 3e2ff35dd - fix(jetbrains): surface unreadable attachments as an inline chat notice (kirillk, 2026-10-13)
- f70f0da2d - Merge pull request #15004 from Kilo-Org/igor/fork-from-message (Igor Šćekić, 2026-10-13)
- 36ac1b7b9 - docs(kilo-docs): use ai-gateway.kilo.ai as the Kilo Gateway base URL (Christiaan Arnoldus, 2026-10-13)
- 433fb11a6 - Merge pull request #14254 from Kilo-Org/fix/vscode-inline-esbuild-problem-matcher (Bruno Agatão, 2026-10-13)
- eae9c90c5 - fix(gateway): only treat the configured AI gateway base as the gateway root (Christiaan Arnoldus, 2026-10-13)
- d7496501c - feat(gateway): route gateway traffic via KILO_AI_GATEWAY_URL (Christiaan Arnoldus, 2026-10-13)
- 54fb6ec2a - Merge remote-tracking branch 'origin/fix/glob-respect-gitignore' into fix/glob-respect-gitignore (webreflection, 2026-10-13)
- 17448f5c5 - fix(cli): apply grep include and find globs after ignore rules (webreflection, 2026-10-13)
- 39fa67607 - Merge branch 'main' into fix/glob-respect-gitignore (Andrea Giammarchi, 2026-10-13)
- f8ebadd8a - test(core): compare glob tests with the installed ripgrep on every platform (webreflection, 2026-10-13)
- e48c9785c - fix(cli): stop glob patterns from bypassing .gitignore (webreflection, 2026-10-13)
- a4731fcd6 - fix(kilo-gateway): keep imported transcript order when the export lists items in ingest order (Igor Šćekić, 2026-10-12)
- 8f6c4e264 - chore: add changeset for remote fork from message (Igor Šćekić, 2026-10-12)
- da2b05a4c - feat(opencode): advertise sessionCloneAtMessage heartbeat capability (Igor Šćekić, 2026-10-12)
- 62c4b88da - feat(opencode): fork remote clone at a message with cloneUpToMessageId (Igor Šćekić, 2026-10-12)
- 09399e485 - feat(kilo-gateway): fetch cloud session export up to a message (Igor Šćekić, 2026-10-12)
- ffb6265c8 - Merge branch 'main' into research/terminal-restart-ownership-20261003 (Lennard, 2026-10-07)
- 8b7efd6e7 - Merge branch 'main' into research/terminal-restart-ownership-20261003 (Lennard, 2026-10-06)
- 273ab0bef - Merge branch 'main' into research/terminal-restart-ownership-20261003 (Lennard, 2026-10-06)
- f16cef2a9 - Merge branch 'main' into research/terminal-restart-ownership-20261003 (Lennard, 2026-10-06)
- fc6ad128e - fix(vscode): retain terminal cleanup across router disposal (Lennard, 2026-10-06)
- 21fad1bdc - Merge branch 'main' into research/terminal-restart-ownership-20261003 (Marius, 2026-10-05)
- 09132736d - fix(vscode): retain terminal ownership across restart and teardown (LEN5010, 2026-10-03)
- 0ca55bb07 - fix(vscode): add file/line/column capture to inline esbuild matcher (Bruno Agatao, 2026-09-17)
- 44b060802 - Merge remote-tracking branch 'origin/main' into fix/vscode-inline-esbuild-problem-matcher (Bruno Agatao, 2026-09-17)
- 63fcea2d6 - fix(vscode): inline esbuild watch problem matcher and drop extension dependency (Bruno Agatao, 2026-09-17)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt` (+12, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt` (+10, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolView.kt` (+10, -3)
- `packages/opencode/src/kilocode/tool/glob-ignored.ts` (+14, -14)
- `packages/opencode/test/kilocode/tool/generate-image.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/tool/glob-ignored.test.ts` (+27, -1)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/kilocode/ripgrep-glob.ts` (+129, -0)
- `packages/core/src/kilocode/ripgrep-grep.ts` (+25, -0)
- `packages/core/src/ripgrep.ts` (+16, -13)
- `packages/core/test/kilocode/ripgrep-encoding.test.ts` (+71, -0)
- `packages/core/test/kilocode/ripgrep-glob.test.ts` (+343, -0)
- `packages/core/test/kilocode/ripgrep-settlement.test.ts` (+4, -1)
- `packages/core/test/plugin/provider-kilo.test.ts` (+1, -1)

#### Other Changes
- `.changeset/glob-search-ignored.md` (+0, -6)
- `.changeset/jetbrains-shared-session-db.md` (+0, -5)
- `.changeset/tidy-terminal-restarts.md` (+5, -0)
- `.changeset/windows-bgp-job-object.md` (+0, -5)
- `.changeset/windows-bgp-runner-stale-parent.md` (+0, -5)
- `.vscode/extensions.json` (+0, -1)
- `.vscode/tasks.json` (+21, -1)
- `CONTRIBUTING.md` (+9, -2)
- `artifacts/glm52-rise-video/package.json` (+1, -1)
- `bun.lock` (+33, -33)
- `package.json` (+1, -1)
- `packages/client/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/httpapi-codegen/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-docs/lychee.toml` (+1, -1)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/automate/agent-manager.md` (+2, -2)
- `packages/kilo-docs/pages/automate/code-reviews/overview.md` (+19, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/cloud-agent.md` (+41, -6)
- `packages/kilo-docs/pages/contributing/architecture/automation-services.md` (+3, -1)
- `packages/kilo-docs/pages/contributing/architecture/cloud-security.md` (+2, -2)
- `packages/kilo-docs/pages/contributing/architecture/index.md` (+1, -1)
- `packages/kilo-docs/pages/contributing/development-environment.md` (+1, -2)
- `packages/kilo-docs/pages/gateway/api-reference.md` (+7, -7)
- `packages/kilo-docs/pages/gateway/authentication.md` (+3, -3)
- `packages/kilo-docs/pages/gateway/index.md` (+3, -3)
- `packages/kilo-docs/pages/gateway/models-and-providers.md` (+2, -2)
- `packages/kilo-docs/pages/gateway/quickstart.md` (+4, -4)
- `packages/kilo-docs/pages/gateway/sdks-and-frameworks.md` (+11, -11)
- `packages/kilo-docs/pages/gateway/streaming.md` (+4, -4)
- `packages/kilo-docs/pages/getting-started/settings/index.md` (+1, -1)
- `packages/kilo-docs/pages/index.tsx` (+1, -1)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-gateway/src/api/constants.ts` (+26, -2)
- `packages/kilo-gateway/src/api/models.ts` (+6, -4)
- `packages/kilo-gateway/src/api/url.ts` (+32, -9)
- `packages/kilo-gateway/src/cloud-sessions.ts` (+60, -14)
- `packages/kilo-gateway/src/edit.ts` (+3, -3)
- `packages/kilo-gateway/src/fim.ts` (+2, -2)
- `packages/kilo-gateway/src/index.ts` (+5, -1)
- `packages/kilo-gateway/src/server/routes.ts` (+4, -3)
- `packages/kilo-gateway/src/types.ts` (+3, -3)
- `packages/kilo-gateway/test/api/models.test.ts` (+2, -2)
- `packages/kilo-gateway/test/api/url.test.ts` (+145, -4)
- `packages/kilo-gateway/test/cloud-sessions.test.ts` (+114, -0)
- `packages/kilo-gateway/test/edit.test.ts` (+2, -2)
- `packages/kilo-gateway/test/fim.test.ts` (+6, -6)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-indexing/test/kilocode/indexing/embedders/kilo.test.ts` (+1, -1)
- `packages/kilo-jetbrains/CHANGELOG.md` (+45, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloAgentBehaviorRpcApiImpl.kt` (+8, -1)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloSessionRpcApiImpl.kt` (+91, -17)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloSessionRpcApiImplTest.kt` (+64, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloAgentBehaviorService.kt` (+5, -7)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloMcpAuthService.kt` (+57, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+61, -33)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionController.kt` (+95, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionUpdateQueue.kt` (+25, -53)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/Message.kt` (+14, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/PromptAttachment.kt` (+37, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/SessionModel.kt` (+30, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanel.kt` (+150, -42)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/PromptPanel.kt` (+52, -18)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/MessageView.kt` (+53, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/NoticeView.kt` (+174, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/ReasoningView.kt` (+11, -6)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/TurnView.kt` (+3, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/ViewFactory.kt` (+13, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/McpConfigurable.kt` (+18, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/util/EdtDrain.kt` (+107, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/kilo.jetbrains.frontend.xml` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/app/KiloAgentBehaviorServiceTest.kt` (+4, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/app/KiloMcpAuthServiceTest.kt` (+32, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionUiLayoutTest.kt` (+60, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionUiPromptRestoreTest.kt` (+160, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/SessionRecoveryTest.kt` (+79, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/model/SessionModelTest.kt` (+62, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/PromptPanelTest.kt` (+15, -5)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanelTest.kt` (+167, -9)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionUiUpdateTest.kt` (+3, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/MessageViewTest.kt` (+56, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/McpSettingsUiTest.kt` (+16, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeAgentBehaviorRpcApi.kt` (+4, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/util/EdtDrainTest.kt` (+82, -0)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-memory/package.json` (+1, -1)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-telemetry/src/__tests__/telemetry.test.ts` (+54, -2)
- `packages/kilo-telemetry/src/conda.ts` (+52, -0)
- `packages/kilo-telemetry/src/telemetry.ts` (+18, -2)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-vscode/CHANGELOG.md` (+18, -0)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/src/agent-manager/terminal-manager.ts` (+103, -101)
- `packages/kilo-vscode/src/agent-manager/terminal-routing.ts` (+31, -5)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-terminal-manager.test.ts` (+431, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-terminal-routing.test.ts` (+162, -0)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+28, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+2, -2)
- `packages/opencode/src/kilo-sessions/remote-protocol.ts` (+4, -0)
- `packages/opencode/src/kilo-sessions/remote-sender.ts` (+12, -2)
- `packages/opencode/src/kilo-sessions/remote-ws.ts` (+2, -2)
- `packages/opencode/src/kilocode/cloud/catalog.ts` (+25, -12)
- `packages/opencode/src/kilocode/mcp/invalidation.ts` (+71, -0)
- `packages/opencode/src/kilocode/mcp/oauth-fetch.ts` (+94, -0)
- `packages/opencode/src/kilocode/mcp/sse-probe.ts` (+28, -2)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilo-gateway.ts` (+4, -4)
- `packages/opencode/src/kilocode/server/import-cloud-session-in-process.ts` (+14, -5)
- `packages/opencode/src/mcp/auth.ts` (+41, -0)
- `packages/opencode/src/mcp/index.ts` (+15, -1)
- `packages/opencode/src/mcp/oauth-provider.ts` (+44, -15)
- `packages/opencode/test/kilocode/cloud/defaults.test.ts` (+88, -5)
- `packages/opencode/test/kilocode/mcp-sse-probe.test.ts` (+45, -13)
- `packages/opencode/test/kilocode/mcp/credential-invalidation.test.ts` (+158, -0)
- `packages/opencode/test/kilocode/mcp/oauth-fetch.test.ts` (+280, -0)
- `packages/opencode/test/kilocode/mcp/provider-invalidation.test.ts` (+68, -0)
- `packages/opencode/test/kilocode/server/httpapi-kilo-edit.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/server/prompt-training-model-filter.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/session-attachment-read-failure.test.ts` (+63, -0)
- `packages/opencode/test/kilocode/session-diff-restore.test.ts` (+30, -0)
- `packages/opencode/test/kilocode/sessions/remote-protocol.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/sessions/remote-sender.test.ts` (+78, -4)
- `packages/opencode/test/kilocode/sessions/remote-ws.test.ts` (+7, -7)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/protocol/package.json` (+1, -1)
- `packages/schema/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk-next/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/storybook/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 84d3ae3b5..a292b5082 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.8.9",
+  "version": "7.8.12",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/kilocode/ripgrep-glob.ts
```diff
diff --git a/packages/core/src/kilocode/ripgrep-glob.ts b/packages/core/src/kilocode/ripgrep-glob.ts
new file mode 100644
index 000000000..438535eca
--- /dev/null
+++ b/packages/core/src/kilocode/ripgrep-glob.ts
@@ -0,0 +1,129 @@
+// Glob matching that keeps ripgrep's ignore rules in charge (#15003).
+//
+// Passing the agent's pattern as `--glob=<pattern>` makes it a ripgrep override, and overrides win over
+// `.gitignore`: a pattern that also matches folder names, such as `**/*`, walks `node_modules`, and
+// gitignored files that match the pattern are returned. Instead, ripgrep lists the files its ignore rules
+// allow and the pattern is applied here with the gitignore-style rules ripgrep uses for overrides.
+//
+// Hidden paths keep their previous behavior: a hidden file is returned when it matches the pattern, and a
+// hidden folder is searched only when the pattern matches the folder itself, as ripgrep does for overrides.
+// The same applies to the grep `include` filter and to `find`, which pass globs to ripgrep the same way.
+
+export interface Input {
+  readonly pattern: string
+  readonly hidden?: boolean
+  readonly include?: readonly string[]
+}
+
+export interface Walk {
+  readonly args: readonly string[]
+  readonly match: (file: string) => boolean
+}
+
+/** Match a cwd-relative path the way ripgrep matches an override glob. */
+export function compile(pattern: string) {
+  const dir = pattern.endsWith("/")
+  const body = pattern.replace(/\/+$/, "")
+  const text = body.includes("/") ? body.replace(/^\//, "") : `**/${body}`
+  const glob = new Bun.Glob(text)
+  // ripgrep treats a trailing `/**` as everything inside the folder, but not the folder itself.
+  const folders = text.endsWith("/**") ? new Bun.Glob(`${text}/*`) : glob
+  return (path: string, folder: boolean) => {
+    if (folder) return folders.match(path)
+    return !dir && glob.match(path)
+  }
+}
+
+/**
+ * Ripgrep can also apply the last path segment of the pattern as a file type. Types match file names after
+ * ignore rules, so they keep ripgrep from printing (or, for grep, reading) every file; `match` still
+ * decides, which covers the folder part of the pattern, hidden folders, and edge cases. Patterns whose
+ * braces span folders, such as `{src/*.ts,lib/*.js}`, have no single last segment and skip this.
+ */
+function prefilter(pattern: string) {
+  const name = pattern.split("/").at(-1) ?? ""
```

#### packages/core/src/kilocode/ripgrep-grep.ts
```diff
diff --git a/packages/core/src/kilocode/ripgrep-grep.ts b/packages/core/src/kilocode/ripgrep-grep.ts
index cac163c7f..879709762 100644
--- a/packages/core/src/kilocode/ripgrep-grep.ts
+++ b/packages/core/src/kilocode/ripgrep-grep.ts
@@ -1,5 +1,30 @@
+import { Schema, SchemaGetter } from "effect"
 import type { Match } from "@opencode-ai/schema/filesystem"
 
+// ripgrep emits base64 `bytes` instead of `text` when the data is not valid UTF-8.
+// Decode with lossy UTF-8 so valid multi-byte sequences survive intact and only
+// truly undecodable bytes become U+FFFD. This avoids guessing the source encoding
+// (which could misrepresent content to the LLM) and keeps valid portions readable.
+//
+// Caveat: submatch start/end are ripgrep byte offsets. On mixed-encoding lines
+// (valid UTF-8 multi-byte sequences alongside invalid bytes), the decoded text has
+// fewer characters than raw bytes, so the offsets no longer index into the decoded
+// string. Nothing in-repo consumes these offsets for slicing today; if that changes,
+// recompute them after decoding or drop them for bytes-decoded records.
+
+/** ripgrep `arbitrary data` (`{text}` or `{bytes}`) normalized to `{text}`. */
+export const Data = Schema.Union([
+  Schema.Struct({ text: Schema.String }),
+  Schema.Struct({ bytes: Schema.String }),
+]).pipe(
+  Schema.decodeTo(Schema.Struct({ text: Schema.String }), {
+    decode: SchemaGetter.transform((data) =>
+      "text" in data ? { text: data.text } : { text: Buffer.from(data.bytes, "base64").toString("utf8") },
+    ),
+    encode: SchemaGetter.passthrough({ strict: false }),
+  }),
+)
+
 export interface Options {
   readonly context?: number
   readonly literal?: boolean
```

#### packages/core/src/ripgrep.ts
```diff
diff --git a/packages/core/src/ripgrep.ts b/packages/core/src/ripgrep.ts
index a5c6ea67b..26d2b57f7 100644
--- a/packages/core/src/ripgrep.ts
+++ b/packages/core/src/ripgrep.ts
@@ -4,6 +4,7 @@ import { Context, Duration, Effect, Fiber, Layer, Schema, Stream } from "effect"
 import { ChildProcess } from "effect/unstable/process"
 import { makeGlobalNode } from "./effect/app-node"
 import { Entry, Match } from "@opencode-ai/schema/filesystem"
+import * as KiloGlob from "./kilocode/ripgrep-glob" // kilocode_change
 import * as KiloGrep from "./kilocode/ripgrep-grep" // kilocode_change
 import * as SpawnExit from "./kilocode/spawn-exit" // kilocode_change
 import * as SpawnValidation from "./kilocode/spawn-validation" // kilocode_change
@@ -25,13 +26,13 @@ const MAX_SUBMATCHES = 100
 const RawMatch = Schema.Struct({
   type: Schema.Literals(["match", "context"]), // kilocode_change - retain requested context records
   data: Schema.Struct({
-    path: Schema.Struct({ text: Schema.String }),
-    lines: Schema.Struct({ text: Schema.String }),
+    path: KiloGrep.Data, // kilocode_change - accept ripgrep's base64 shape for non-UTF-8 data
+    lines: KiloGrep.Data, // kilocode_change
     line_number: PositiveInt,
     absolute_offset: NonNegativeInt,
     submatches: Schema.Array(
       Schema.Struct({
-        match: Schema.Struct({ text: Schema.String }),
+        match: KiloGrep.Data, // kilocode_change
         start: NonNegativeInt,
         end: NonNegativeInt,
       }),
@@ -72,6 +73,7 @@ export interface GlobInput {
   readonly noRequireGit?: boolean // kilocode_change - honor ignore files outside a git repository
   readonly include?: readonly string[] // kilocode_change - additional whitelist globs
   readonly exclude?: readonly string[] // kilocode_change - additional exclusion globs
+  readonly filter?: (path: string) => boolean // kilocode_change - drop paths before the result limit
 }
 
 export interface GrepInput extends KiloGrep.Options {
@@ -223,19 +225,18 @@ const layer = Layer.effect(
             ...(input.hidden ? ["--hidden"] : []),
             ...(input.follow ? ["--follow"] : []),
             ...(input.noRequireGit ? ["--no-require-git"] : []), // kilocode_change
-            `--glob=${input.pattern}`,
+            ...KiloGlob.glob(input).args, // kilocode_change - apply the pattern after ignore rules
             ...(input.include ?? []).map((glob) => `--glob=${glob}`), // kilocode_change
             ...(input.exclude ?? []).map((glob) => `--glob=!${glob}`), // kilocode_change
             "--glob=!**/.git/**",
             ".",
           ],
-          parse: (line) =>
-            Effect.succeed(
```

#### packages/core/test/kilocode/ripgrep-encoding.test.ts
```diff
diff --git a/packages/core/test/kilocode/ripgrep-encoding.test.ts b/packages/core/test/kilocode/ripgrep-encoding.test.ts
new file mode 100644
index 000000000..ab1a98fdd
--- /dev/null
+++ b/packages/core/test/kilocode/ripgrep-encoding.test.ts
@@ -0,0 +1,71 @@
+import { describe, expect } from "bun:test"
+import fs from "node:fs/promises"
+import path from "node:path"
+import { Effect } from "effect"
+import { LayerNode } from "@opencode-ai/core/effect/layer-node"
+import { Ripgrep } from "@opencode-ai/core/ripgrep"
+import { tmpdir } from "../fixture/tmpdir"
+import { testEffect } from "../lib/effect"
+
+const it = testEffect(LayerNode.compile(Ripgrep.node))
+
+// "Handläggning" with a raw Latin-1 "ä" (0xE4), which is not valid UTF-8
+const latin = Buffer.concat([Buffer.from('title = "Handl'), Buffer.from([0xe4]), Buffer.from('ggning"\n')])
+
+const search = (input: { readonly content: Buffer; readonly pattern: string; readonly context?: number }) =>
+  Effect.acquireUseRelease(
+    Effect.promise(() => tmpdir()),
+    (tmp) =>
+      Effect.gen(function* () {
+        yield* Effect.promise(() => fs.writeFile(path.join(tmp.path, "legacy.java"), input.content))
+        return yield* (yield* Ripgrep.Service).grep({
+          cwd: tmp.path,
+          pattern: input.pattern,
+          context: input.context,
+          limit: 10,
+        })
+      }),
+    (tmp) => Effect.promise(() => tmp[Symbol.asyncDispose]()),
+  )
+
+describe("Ripgrep non-UTF-8 output", () => {
+  it.live("replaces non-UTF-8 bytes with U+FFFD", () =>
+    Effect.gen(function* () {
+      const result = yield* search({ content: latin, pattern: "Handl" })
+      expect(result.items).toHaveLength(1)
+      // 0xE4 is not valid UTF-8 on its own, so it becomes the replacement character
+      expect(result.items[0]?.text).toBe('title = "Handl\uFFFDggning"\n')
+      expect(result.items[0]?.submatches).toEqual([{ text: "Handl", start: 9, end: 14 }])
+    }),
+  )
+
+  it.live("replaces non-UTF-8 bytes in submatches with U+FFFD", () =>
+    Effect.gen(function* () {
+      // Unicode `.` never matches an invalid UTF-8 byte; a byte-level class does
```


*... and more files (showing first 5)*

## opencode Changes (1015cb6..4397ee4)

### Commits

- 4397ee4 - docs(console): add DeepSeek V4.1 Flash Free (#55636) (Jack, 2026-10-15)
- b47c680 - fix(ai): accept null Responses function call namespace (#55631) (Aiden Cline, 2026-10-15)
- ae8d59f - fix(core): fit compaction output limit to the request actually sent (#55613) (Aiden Cline, 2026-10-15)
- 7ced591 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-10-15)
- b55f220 - fix(core): treat *.localhost as loopback for MCP OAuth token endpoints (#55627) (Aiden Cline, 2026-10-15)
- fbf5f16 - fix(core): skip MCP list calls for unadvertised capabilities (#55474) (Kyrylo, 2026-10-15)
- 3aa26f1 - fix(core): advertise the spec-shaped MCP elicitation capability (#53196) (Don Bowman, 2026-10-15)
- a8fc567 - chore(core): redact params in database query errors (#55621) (Aiden Cline, 2026-10-15)
- 7b5f1bd - fix(core): skip codemode query for MCP servers that reject it (#55618) (Aiden Cline, 2026-10-15)
- bdf4793 - feat(app): show voice delegations from the iOS app as Voice messages (#54426) (opencode-agent[bot], 2026-10-15)
- 37df62f - fix(session-ui): show webfetch URL while the fetch runs (#55590) (Luke Parker, 2026-10-15)
- d099d2c - fix(cli): poll install download progress instead of tracing bytes (#55586) (Aiden Cline, 2026-10-14)
- 97c2019 - fix(www): serve install script from dev branch (#55587) (Aiden Cline, 2026-10-14)
- 328f74c - fix(mcp): pass tool input as permission metadata (#51062) (Luca Barbato, 2026-10-14)
- 32b1a1b - test(core): run MCP lifecycle tests against an in-process server (#55568) (Aiden Cline, 2026-10-14)
- 2ae7ec8 - fix(app): keep project settings open when the project folder is missing (#55553) (Luke Parker, 2026-10-15)
- ccd3aa7 - fix(schema): publish config schema that accepts V1 and V2 shapes (#55524) (Aiden Cline, 2026-10-14)
- e05cc4a - docs(plugin): document permission assert and fix session rules example (#55526) (Aiden Cline, 2026-10-14)
- 3943b84 - fix(cli): default the Windows service to port 45278 (#55547) (Luke Parker, 2026-10-15)
- 1e63a3b - fix(core): load configured instructions (#55539) (Filip, 2026-10-15)
- 7291f3e - fix(console): keep API route handlers out of route modules (#55541) (vprdev, 2026-10-14)
- 13afea6 - docs(console): correct Cat Jam Free privacy on Go page (#55499) (opencode-agent[bot], 2026-10-14)
- 8ffbcc2 - fix(tui): tidy docked diff panel spacing (#55467) (James Long, 2026-10-14)
- 35bb8e4 - fix(core): treat empty configured provider and model names as omitted (#55465) (opencode-agent[bot], 2026-10-14)
- 0ccfe69 - docs(console): list Cat Jam Free unavailable regions (#55466) (opencode-agent[bot], 2026-10-14)
- 07c0ff5 - feat(console): enrich Salesforce leads with Console account status (#54387) (Stefan Avram, 2026-10-14)
- fe1717b - fix(tui): put the diff side panel behind an experiment (#55456) (James Long, 2026-10-14)
- 943dc00 - fix(vscode): use the sst/opencode repository URL for Marketplace publishing (#55463) (Aiden Cline, 2026-10-14)
- cddf1dd - docs: document top-level policies in Console API response (#55461) (Aiden Cline, 2026-10-14)
- b474b84 - fix(tui): use the action disabled token for inactive key hints (#55452) (James Long, 2026-10-14)
- c0d41d2 - feat(tui): render diffs in plugin panel slots (#47152) (James Long, 2026-10-14)
- c458ad7 - fix(core): substitute empty for missing config file references (#55388) (Filip, 2026-10-14)
- f44c40b - docs: add mise install method (#55415) (opencode-agent[bot], 2026-10-14)
- 5fa0a42 - feat(app): restore option arrow session tab navigation (#54277) (opencode-agent[bot], 2026-10-14)
- d3e1de3 - docs(www): remove Ling free models from Console models (#55410) (Jack, 2026-10-14)
- 81d5708 - feat(session-ui): summarize each turn's changed files (#55064) (opencode-agent[bot], 2026-10-14)
- 34d8ded - sync release versions for v2.0.29 [skip ci] (opencode, 2026-10-14)
- 3a69bae - docs(go): remove DeepSeek V4 Flash and V4 Flash Vision Exp (#55332) (Jack, 2026-10-14)
- a7ad408 - fix(stats): normalize deepseek v4.1 flash codename (#55330) (黑墨水鱼, 2026-10-14)
- 6cc58b9 - docs(go): add Gemini 4 Argon Contributor (#55314) (opencode-agent[bot], 2026-10-14)
- 165cd2e - feat(desktop): pair devices through remote access (#55306) (Luke Parker, 2026-10-14)
- 5aabb61 - fix(plugin): support Figma Git installs and dev releases (#55304) (Aiden Cline, 2026-10-13)
- def5d94 - chore(tui): revert OpenTUI 0.6 upgrade (#55300) (Aiden Cline, 2026-10-13)
- f1632d0 - fix(plugin): use public Figma endpoint and OAuth defaults (#55252) (Aiden Cline, 2026-10-13)
- f576da5 - feat(core): stabilize top-level policies config (#55297) (Aiden Cline, 2026-10-13)
- 1c28c2f - fix(app): show a steer as pending from its first frame (#55251) (Luke Parker, 2026-10-14)
- 52ba7d6 - test(app): stop partial settings mocks leaking across browser tests (#55276) (Luke Parker, 2026-10-14)
- 6dc4d4e - fix(core): give managed configuration highest precedence (#55267) (Aiden Cline, 2026-10-13)
- 6a7cedc - feat(plugin): let plugins assert permissions (#54930) (Aiden Cline, 2026-10-13)
- 89e043b - fix(plugin): resolve the figma plugin's peer from the workspace (#55269) (Luke Parker, 2026-10-14)
- 7351718 - fix(plugin): keep each Promise hook rejection on its own tool call (#55263) (Aiden Cline, 2026-10-13)
- 9de9b74 - feat(desktop): refine diff view colors (#52551) (usrnk1, 2026-10-14)
- d2cedff - docs: correct Cat Jam Free data policy (#55224) (opencode-agent[bot], 2026-10-14)
- de417ed - feat(desktop): manage provider accounts and restore Console connect intro (#54101) (usrnk1, 2026-10-13)
- 293a5ba - feat(desktop): move session unread dots into tab container (#53570) (usrnk1, 2026-10-13)
- 41f6567 - docs: use supported policy action names (#55259) (opencode-agent[bot], 2026-10-13)
- 4ea42c4 - fix(session-ui): render user message attachments above text and admit inline files (#54650) (Kit Langton, 2026-10-13)
- 43bb7ba - fix(core): let v1 npm config target built-in provider routes (#55254) (opencode-agent[bot], 2026-10-13)
- 7b33bce - feat(desktop): show session tokens and cost on the session view (#53785) (usrnk1, 2026-10-13)
- 46e4695 - fix(app): retain raw media bytes up to 256 MiB for artifact previews (#55018) (Kit Langton, 2026-10-13)
- 3ec856b - feat(desktop): refresh question composer (#54822) (usrnk1, 2026-10-14)
- 2a593c0 - fix(app): suppress missing-file toast on restored and open file tabs (#55022) (Kit Langton, 2026-10-13)
- a3f7f42 - feat(core): continue responses after output token limits (#53876) (Aiden Cline, 2026-10-13)
- 7497b89 - feat(file): add trackpad zoom and pan to image previews (#54590) (Kit Langton, 2026-10-13)
- 80d43eb - chore: update nix node_modules hashes (opencode-agent[bot], 2026-10-13)
- d0a2ce3 - feat(tui): report pending session status to the terminal (#55172) (Dax, 2026-10-13)
- 8396de1 - fix(app): retain session model choices across catalog refreshes (#54481) (Kit Langton, 2026-10-13)
- 1163e6c - fix(app): fill vertical tab hover gaps (#54866) (Kit Langton, 2026-10-13)
- 573fd29 - feat(app): cycle side-panel tabs when side panel is focused (#54899) (Kit Langton, 2026-10-13)
- 84e0955 - fix(app): close browser tabs from the address field (#54501) (Kit Langton, 2026-10-13)
- e9def88 - docs(console): remove Cat Jam Free from models privacy exceptions (#55209) (opencode-agent[bot], 2026-10-13)
- 0af756b - docs(console): show Gemini 4 Argon discount with strikethrough pricing (#55206) (opencode-agent[bot], 2026-10-13)
- 55c863d - feat(update): index artifact rollout lookups (#55202) (Aiden Cline, 2026-10-13)
- d8e31d8 - fix(server): align connect route checks (#55177) (James Long, 2026-10-13)
- a00475a - docs(console): add Gemini 4 Argon to Console models (#55196) (opencode-agent[bot], 2026-10-13)
- 7410b1c - docs(console): add Cat Jam Free to Go (#55188) (Jack, 2026-10-14)
- 23e3493 - fix(update): cache D1 reads and use partial indexes for lookups (#55109) (opencode-agent[bot], 2026-10-13)
- 82833da - refactor(console): stop stripping legacy Zen headers in proxy (#55120) (Victor Navarro, 2026-10-13)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/core/src/tool/mcp.ts` (+1, -1)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/config.ts` (+37, -10)
- `packages/core/src/config/normalize.ts` (+30, -14)
- `packages/core/src/config/plugin/instruction.ts` (+111, -15)
- `packages/core/src/config/plugin/provider.ts` (+3, -3)
- `packages/core/src/config/variable.ts` (+17, -21)
- `packages/core/src/database/drizzle/sqlite-core/effect/session.ts` (+1, -1)
- `packages/core/src/instruction-discovery.ts` (+6, -6)
- `packages/core/src/managed-policy.ts` (+1, -1)
- `packages/core/src/mcp/client.ts` (+36, -8)
- `packages/core/src/plugin/host.ts` (+10, -0)
- `packages/core/src/plugin/provider/opencode.ts` (+24, -17)
- `packages/core/src/plugin/skill/opencode.md` (+3, -4)
- `packages/core/src/session/compaction.ts` (+27, -2)
- `packages/core/src/session/model-request.ts` (+1, -1)
- `packages/core/src/session/runner/llm.ts` (+34, -1)
- `packages/core/src/session/runner/publish-llm-event.ts` (+68, -15)
- `packages/core/src/session/runner/step.ts` (+5, -9)
- `packages/core/src/v1/config/migrate.ts` (+8, -2)
- `packages/core/test/config/config.test.ts` (+23, -12)
- `packages/core/test/config/normalization.test.ts` (+32, -18)
- `packages/core/test/config/policy.test.ts` (+1, -2)
- `packages/core/test/config/provider.test.ts` (+15, -0)
- `packages/core/test/database-drizzle.test.ts` (+2, -2)
- `packages/core/test/fixture/policy.ts` (+1, -0)
- `packages/core/test/instruction-discovery.test.ts` (+164, -7)
- `packages/core/test/location-layer.test.ts` (+4, -2)
- `packages/core/test/mcp.test.ts` (+21, -102)
- `packages/core/test/plugin/host.ts` (+1, -0)
- `packages/core/test/plugin/permission-assert.test.ts` (+91, -0)
- `packages/core/test/plugin/provider-opencode.test.ts` (+8, -3)
- `packages/core/test/session-compaction.test.ts` (+40, -0)
- `packages/core/test/session-move.test.ts` (+2, -2)
- `packages/core/test/session-runner.test.ts` (+250, -80)
- `packages/core/test/skill.test.ts` (+3, -3)
- `packages/stats/core/package.json` (+1, -1)
- `packages/stats/core/src/domain/inference.test.ts` (+9, -1)
- `packages/stats/core/src/domain/model-normalization.ts` (+1, -0)

#### Other Changes
- `CHANGELOG.md` (+70, -0)
- `bun.lock` (+57, -51)
- `bunfig.toml` (+1, -1)
- `infra/console.ts` (+6, -0)
- `install` (+20, -49)
- `nix/hashes.json` (+3, -3)
- `package.json` (+5, -4)
- `packages/ai/package.json` (+1, -1)
- `packages/ai/src/protocols/open-responses.ts` (+4, -2)
- `packages/ai/test/provider/openai-compatible-responses.test.ts` (+21, -0)
- `packages/app/component-tests/browser-pane-restore.spec.ts` (+109, -1)
- `packages/app/component-tests/session-question-dock.spec.ts` (+177, -9)
- `packages/app/e2e/regression/composer.spec.ts` (+134, -0)
- `packages/app/e2e/regression/review.spec.ts` (+244, -10)
- `packages/app/e2e/regression/session-queue.spec.ts` (+14, -2)
- `packages/app/e2e/regression/session-request-docks.spec.ts` (+87, -0)
- `packages/app/e2e/regression/settings.spec.ts` (+494, -1)
- `packages/app/e2e/regression/tabs.spec.ts` (+391, -32)
- `packages/app/e2e/utils/mock-api.ts` (+13, -0)
- `packages/app/e2e/utils/mock-server.ts` (+49, -9)
- `packages/app/package.json` (+4, -4)
- `packages/app/src/composer/comments.test.ts` (+2, -15)
- `packages/app/src/composer/submit.test.ts` (+19, -7)
- `packages/app/src/composer/submit.ts` (+11, -2)
- `packages/app/src/new-session/route.tsx` (+21, -10)
- `packages/app/src/providers/connect/controller.ts` (+4, -7)
- `packages/app/src/providers/connect/dialog.tsx` (+265, -82)
- `packages/app/src/providers/connect/models.css` (+1, -3)
- `packages/app/src/providers/models/select-dialog.stories.tsx` (+1, -0)
- `packages/app/src/providers/models/select-dialog.tsx` (+38, -2)
- `packages/app/src/providers/models/selection.tsx` (+8, -12)
- `packages/app/src/runtime/extension/side-region.tsx` (+15, -2)
- `packages/app/src/runtime/i18n/en.ts` (+23, -5)
- `packages/app/src/session/commands/use-session-commands.tsx` (+53, -0)
- `packages/app/src/session/requests/session-question-dock.tsx` (+184, -191)
- `packages/app/src/session/session-screen.stories.tsx` (+23, -0)
- `packages/app/src/session/timeline/controller.tsx` (+1, -0)
- `packages/app/src/session/timeline/message-timeline.tsx` (+4, -1)
- `packages/app/src/session/timeline/turn-diffs.test.ts` (+32, -0)
- `packages/app/src/session/timeline/turn-diffs.ts` (+30, -0)
- `packages/app/src/session/timeline/voice-delegation.test.ts` (+63, -0)
- `packages/app/src/session/timeline/voice-delegation.ts` (+33, -0)
- `packages/app/src/settings/general/general.tsx` (+11, -0)
- `packages/app/src/settings/model.test.ts` (+1, -0)
- `packages/app/src/settings/model.tsx` (+6, -0)
- `packages/app/src/settings/navigation.tsx` (+14, -2)
- `packages/app/src/settings/providers/account-actions.ts` (+103, -0)
- `packages/app/src/settings/providers/account-name.tsx` (+69, -0)
- `packages/app/src/settings/providers/extensions.tsx` (+11, -2)
- `packages/app/src/settings/providers/providers.tsx` (+135, -142)
- `packages/app/src/settings/settings.css` (+33, -15)
- `packages/app/src/settings/workspaces/project-extensions.tsx` (+14, -2)
- `packages/app/src/settings/workspaces/project-folder-missing.tsx` (+29, -0)
- `packages/app/src/settings/workspaces/project.css` (+37, -0)
- `packages/app/src/settings/workspaces/project.tsx` (+2, -0)
- `packages/app/src/shell/routes/session-ui-provider.tsx` (+23, -1)
- `packages/app/src/shell/titlebar/tab-nav.css` (+119, -10)
- `packages/app/src/shell/titlebar/tab-nav.tsx` (+18, -5)
- `packages/app/src/shell/titlebar/tab-order.test.ts` (+12, -1)
- `packages/app/src/shell/titlebar/tab-order.ts` (+12, -3)
- `packages/app/src/shell/titlebar/tab-popover.css` (+2, -1)
- `packages/app/src/shell/titlebar/tab-popover.tsx` (+27, -7)
- `packages/app/src/shell/titlebar/tab-strip.tsx` (+50, -2)
- `packages/app/src/shell/titlebar/titlebar.css` (+8, -0)
- `packages/app/src/workspaces/files/artifact.test.ts` (+19, -3)
- `packages/app/src/workspaces/files/artifact.ts` (+5, -6)
- `packages/app/src/workspaces/files/content-cache.ts` (+2, -2)
- `packages/app/src/workspaces/files/model.tsx` (+22, -8)
- `packages/app/src/workspaces/files/types.ts` (+1, -1)
- `packages/app/test-browser/fixtures/model-selection.ts` (+5, -4)
- `packages/app/test-browser/server-notification-state.test.ts` (+15, -5)
- `packages/cli/dev/tui.ts` (+1, -0)
- `packages/cli/package.json` (+1, -1)
- `packages/cli/src/services/service-config.ts` (+10, -1)
- `packages/cli/src/services/update-preflight.tsx` (+4, -6)
- `packages/cli/src/ui/timeline.tsx` (+3, -4)
- `packages/cli/test/service.test.ts` (+21, -7)
- `packages/client/package.json` (+1, -1)
- `packages/client/src/promise/generated/types.ts` (+5, -0)
- `packages/client/src/solid/data.ts` (+46, -12)
- `packages/client/src/solid/index.ts` (+1, -0)
- `packages/client/src/solid/usage.ts` (+22, -0)
- `packages/client/test/solid-data.test.ts` (+41, -0)
- `packages/client/test/solid-pending-status.test.ts` (+49, -0)
- `packages/client/test/solid-usage.test.ts` (+43, -0)
- `packages/codemode/package.json` (+1, -1)
- `packages/console/app/package.json` (+3, -2)
- `packages/console/app/script/dev-enterprise.ts` (+99, -0)
- `packages/console/app/script/salesforce-cli-response.test.ts` (+40, -0)
- `packages/console/app/script/salesforce-cli-response.ts` (+24, -0)
- `packages/console/app/src/component/go-models.ts` (+40, -9)
- `packages/console/app/src/component/go-plan-chart.css` (+8, -0)
- `packages/console/app/src/component/go-plan-chart.tsx` (+20, -5)
- `packages/console/app/src/i18n/ar.ts` (+3, -1)
- `packages/console/app/src/i18n/br.ts` (+4, -1)
- `packages/console/app/src/i18n/da.ts` (+3, -1)
- `packages/console/app/src/i18n/de.ts` (+4, -1)
- `packages/console/app/src/i18n/en.ts` (+3, -1)
- `packages/console/app/src/i18n/es.ts` (+4, -1)
- `packages/console/app/src/i18n/fr.ts` (+4, -1)
- `packages/console/app/src/i18n/it.ts` (+4, -1)
- `packages/console/app/src/i18n/ja.ts` (+3, -1)
- `packages/console/app/src/i18n/ko.ts` (+3, -1)
- `packages/console/app/src/i18n/no.ts` (+3, -1)
- `packages/console/app/src/i18n/pl.ts` (+4, -1)
- `packages/console/app/src/i18n/ru.ts` (+3, -1)
- `packages/console/app/src/i18n/th.ts` (+3, -1)
- `packages/console/app/src/i18n/tr.ts` (+4, -1)
- `packages/console/app/src/i18n/uk.ts` (+4, -1)
- `packages/console/app/src/i18n/zh.ts` (+3, -1)
- `packages/console/app/src/i18n/zht.ts` (+3, -1)
- `packages/console/app/src/lib/console-account.ts` (+31, -0)
- `packages/console/app/src/lib/console-signup.test.ts` (+159, -0)
- `packages/console/app/src/lib/console-signup.ts` (+19, -0)
- `packages/console/app/src/lib/enterprise.ts` (+156, -0)
- `packages/console/app/src/lib/inference-proxy.ts` (+1, -11)
- `packages/console/app/src/lib/salesforce.test.ts` (+112, -0)
- `packages/console/app/src/lib/salesforce.ts` (+130, -13)
- `packages/console/app/src/routes/api/console-signup.ts` (+8, -0)
- `packages/console/app/src/routes/api/enterprise.ts` (+3, -134)
- `packages/console/app/src/routes/go/index.tsx` (+7, -4)
- `packages/console/function/package.json` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/enterprise/package.json` (+1, -1)
- `packages/function/package.json` (+1, -1)
- `packages/gui-extensions/README.md` (+68, -18)
- `packages/gui-extensions/package.json` (+1, -1)
- `packages/gui-extensions/src/browser/i18n/en.ts` (+1, -0)
- `packages/gui-extensions/src/browser/model.ts` (+2, -0)
- `packages/gui-extensions/src/browser/panel.fixture.tsx` (+108, -33)
- `packages/gui-extensions/src/browser/panel.tsx` (+5, -0)
- `packages/gui-extensions/src/browser/renderer.tsx` (+19, -0)
- `packages/gui-extensions/src/context/i18n/en.ts` (+1, -0)
- `packages/gui-extensions/src/context/indicator.tsx` (+54, -14)
- `packages/gui-extensions/src/context/tab.tsx` (+4, -2)
- `packages/gui-extensions/src/file/artifact-view.tsx` (+171, -40)
- `packages/gui-extensions/src/file/artifact.test.ts` (+15, -1)
- `packages/gui-extensions/src/file/artifact.ts` (+15, -0)
- `packages/gui-extensions/src/file/i18n/en.ts` (+1, -0)
- `packages/gui-extensions/src/file/renderer.tsx` (+3, -2)
- `packages/gui-extensions/src/pairing/contract.ts` (+10, -2)
- `packages/gui-extensions/src/pairing/i18n/en.ts` (+15, -22)
- `packages/gui-extensions/src/pairing/index.ts` (+0, -2)
- `packages/gui-extensions/src/pairing/main.ts` (+38, -0)
- `packages/gui-extensions/src/pairing/page.stories.tsx` (+15, -22)
- `packages/gui-extensions/src/pairing/page.tsx` (+169, -263)
- `packages/gui-extensions/src/pairing/remote.test.ts` (+19, -0)
- `packages/gui-extensions/src/pairing/remote.ts` (+7, -0)
- `packages/gui-extensions/src/pairing/renderer.tsx` (+8, -2)
- `packages/gui-extensions/src/pairing/routes.test.ts` (+0, -63)
- `packages/gui-extensions/src/pairing/routes.ts` (+0, -65)
- `packages/gui-extensions/src/sdk/host-apis.ts` (+5, -1)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/httpapi-codegen/package.json` (+1, -1)
- `packages/latex/package.json` (+1, -1)
- `packages/latex/src/markdown.test.ts` (+7, -15)
- `packages/merman/package.json` (+1, -1)
- `packages/merman/src/test/markdown.test.ts` (+38, -28)
- `packages/plugin-browser/package.json` (+1, -1)
- `packages/plugin/package.json` (+3, -3)
- `packages/plugin/src/effect/permission.ts` (+9, -0)
- `packages/plugin/src/permission.ts` (+14, -0)
- `packages/plugin/src/promise/adapter.ts` (+20, -8)
- `packages/plugin/src/promise/permission.ts` (+8, -0)
- `packages/plugins/figma/README.md` (+1, -1)
- `packages/plugins/figma/index.ts` (+1, -2)
- `packages/plugins/figma/package.json` (+2, -2)
- `packages/protocol/openapi.json` (+37, -0)
- `packages/protocol/package.json` (+1, -1)
- `packages/protocol/src/groups/persistent-pty.ts` (+5, -3)
- `packages/protocol/src/groups/pty.ts` (+4, -5)
- `packages/protocol/src/groups/server.ts` (+5, -4)
- `packages/schema/package.json` (+1, -1)
- `packages/schema/script/config-schema.ts` (+86, -0)
- `packages/{console/app/public/config.json => schema/script/config-v1.json}` (+1, -1)
- `packages/schema/src/config.ts` (+4, -0)
- `packages/schema/src/config/experimental.ts` (+1, -1)
- `packages/sdk/package.json` (+1, -1)
- `packages/server/package.json` (+1, -1)
- `packages/server/src/middleware/authorization.ts` (+12, -6)
- `packages/session-ui/component-tests/session-message-projection.spec.ts` (+7, -0)
- `packages/session-ui/package.json` (+1, -1)
- `packages/session-ui/src/components/dock-prompt.stories.tsx` (+14, -4)
- `packages/session-ui/src/components/message-file.test.ts` (+6, -2)
- `packages/session-ui/src/components/message-file.ts` (+2, -2)
- `packages/session-ui/src/components/message-part.css` (+43, -348)
- `packages/session-ui/src/components/question-prompt.css` (+439, -0)
- `packages/session-ui/src/context/data.tsx` (+13, -0)
- `packages/session-ui/src/message/current-message.tsx` (+2, -0)
- `packages/session-ui/src/message/message-content.tsx` (+85, -23)
- `packages/session-ui/src/pierre/index.ts` (+49, -6)
- `packages/session-ui/src/storybook/current-session-fixtures.ts` (+43, -4)
- `packages/session-ui/src/storybook/current-session-story.tsx` (+3, -0)
- `packages/session-ui/src/styles/index.css` (+1, -0)
- `packages/session-ui/src/timeline/file-changes.stories.tsx` (+72, -0)
- `packages/session-ui/src/timeline/projection.ts` (+68, -24)
- `packages/session-ui/src/timeline/rows-current.test.ts` (+63, -0)
- `packages/session-ui/src/timeline/session-timeline-row.tsx` (+78, -2)
- `packages/session-ui/src/timeline/session-timeline.tsx` (+2, -0)
- `packages/session-ui/src/timeline/timeline-row.stories.tsx` (+14, -0)
- `packages/session-ui/src/timeline/timeline-row.ts` (+16, -0)
- `packages/session-ui/src/tools/tool-renderer.tsx` (+15, -2)
- `packages/simulation/package.json` (+1, -1)
- `packages/simulation/src/frontend/renderer.ts` (+3, -14)
- `packages/simulation/src/frontend/simulation.ts` (+1, -2)
- `packages/simulation/test/recording.test.ts` (+10, -19)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/server/package.json` (+1, -1)
- `packages/storybook/.storybook/main.ts` (+4, -0)
- `packages/storybook/.storybook/mocks/gui-extensions/pairing.tsx` (+26, -27)
- `packages/theme/package.json` (+1, -1)
- `packages/theme/src/tui/syntax.ts` (+4, -5)
- `packages/tui/package.json` (+3, -2)
- `packages/tui/src/app.tsx` (+13, -19)
- `packages/tui/src/component/dialog-experiments.tsx` (+7, -1)
- `packages/tui/src/component/fade-in-text.tsx` (+2, -2)
- `packages/tui/src/component/masked-text.ts` (+28, -31)
- `packages/tui/src/component/one-cell-spinner.tsx` (+3, -1)
- `packages/tui/src/component/patch-diff.tsx` (+20, -7)
- `packages/tui/src/component/prompt/autocomplete.tsx` (+11, -18)
- `packages/tui/src/component/prompt/index.tsx` (+18, -22)
- `packages/tui/src/component/register-spinner.ts` (+6, -0)
- `packages/tui/src/component/retry-provider.tsx` (+8, -6)
- `packages/tui/src/component/session-tabs.tsx` (+3, -1)
- `packages/tui/src/component/shimmer-text.tsx` (+1, -1)
- `packages/tui/src/component/spinner-renderable.ts` (+0, -158)
- `packages/tui/src/component/spinner.tsx` (+3, -1)
- `packages/tui/src/component/title-shimmer.tsx` (+74, -82)
- `packages/tui/src/config/keybind.ts` (+1, -0)
- `packages/tui/src/context/theme.tsx` (+1, -1)
- `packages/tui/src/editor.ts` (+5, -2)
- `packages/tui/src/feature-plugins/prompt/footer.tsx` (+19, -4)
- `packages/tui/src/feature-plugins/system/diff-viewer-file-tree.tsx` (+1, -3)
- `packages/tui/src/feature-plugins/system/diff-viewer.tsx` (+206, -106)
- `packages/tui/src/mini/footer.form.tsx` (+4, -5)
- `packages/tui/src/mini/footer.permission.tsx` (+3, -4)
- `packages/tui/src/mini/footer.prompt.tsx` (+28, -22)
- `packages/tui/src/mini/footer.subagent.tsx` (+3, -1)
- `packages/tui/src/mini/footer.ts` (+1, -5)
- `packages/tui/src/mini/footer.view.tsx` (+4, -4)
- `packages/tui/src/mini/mono.ts` (+15, -16)
- `packages/tui/src/mini/prompt.editor.ts` (+1, -7)
- `packages/tui/src/mini/prompt.shared.ts` (+10, -15)
- `packages/tui/src/mini/runtime.lifecycle.ts` (+7, -11)
- `packages/tui/src/mini/scrollback.shared.ts` (+7, -3)
- `packages/tui/src/mini/scrollback.surface.ts` (+4, -16)
- `packages/tui/src/mini/scrollback.writer.tsx` (+10, -27)
- `packages/tui/src/mini/theme.ts` (+1, -6)
- `packages/tui/src/prompt/directory-completion.ts` (+5, -4)
- `packages/tui/src/prompt/display.ts` (+39, -19)
- `packages/tui/src/prompt/history.tsx` (+4, -4)
- `packages/tui/src/prompt/mention.ts` (+17, -25)
- `packages/tui/src/prompt/part.ts` (+3, -15)
- `packages/tui/src/routes/session/composer/subagents-tab.tsx` (+1, -3)
- `packages/tui/src/routes/session/group-view.tsx` (+1, -4)
- `packages/tui/src/routes/session/index.tsx` (+5, -11)
- `packages/tui/src/routes/session/message-parts.tsx` (+2, -5)
- `packages/tui/src/routes/session/thinking-syntax.ts` (+2, -3)
- `packages/tui/src/ui/spinner.ts` (+1, -1)
- `packages/tui/src/util/renderer.ts` (+3, -11)
- `packages/tui/src/util/session.ts` (+2, -14)
- `packages/tui/test/app-lifecycle.test.tsx` (+10, -42)
- `packages/tui/test/cli/tui/diff-viewer.test.tsx` (+35, -11)
- `packages/tui/test/compact-admission.test.tsx` (+2, -4)
- `packages/tui/test/completion-notices.test.tsx` (+2, -4)
- `packages/tui/test/component/retry-provider.test.tsx` (+3, -5)
- `packages/tui/test/component/shimmer-text.test.tsx` (+0, -37)
- `packages/tui/test/component/spinner-renderable.test.tsx` (+0, -132)
- `packages/tui/test/config-v2.test.tsx` (+1, -0)
- `packages/tui/test/copy-session-id.test.tsx` (+1, -2)
- `packages/tui/test/editor.test.ts` (+7, -27)
- `packages/tui/test/fixture/app.ts` (+7, -11)
- `packages/tui/test/markdown-streaming.test.tsx` (+10, -22)
- `packages/tui/test/mini/footer.test.ts` (+1, -2)
- `packages/tui/test/mini/footer.view.test.tsx` (+8, -56)
- `packages/tui/test/mini/prompt.editor.test.ts` (+7, -9)
- `packages/tui/test/mini/prompt.shared.test.ts` (+57, -27)
- `packages/tui/test/mini/scrollback.surface.test.ts` (+8, -57)
- `packages/tui/test/mini/theme.test.ts` (+0, -18)
- `packages/tui/test/new-session-id.test.tsx` (+1, -3)
- `packages/tui/test/plugin-markdown.test.tsx` (+4, -4)
- `packages/tui/test/prompt-offset.test.tsx` (+0, -58)
- `packages/tui/test/prompt-paste.test.tsx` (+0, -16)
- `packages/tui/test/prompt/autocomplete.test.ts` (+16, -11)
- `packages/tui/test/prompt/display.test.ts` (+37, -66)
- `packages/tui/test/prompt/history.test.ts` (+8, -12)
- `packages/tui/test/prompt/mention.test.ts` (+14, -22)
- `packages/tui/test/prompt/part.test.ts` (+28, -17)
- `packages/tui/test/session-activity-anchor.test.tsx` (+1, -2)
- `packages/tui/test/session-backfill-disclosure.test.tsx` (+1, -2)
- `packages/tui/test/session-group-navigation.test.tsx` (+1, -2)
- `packages/tui/test/session-home.test.tsx` (+1, -2)
- `packages/tui/test/session-mount-budget.test.tsx` (+1, -2)
- `packages/tui/test/session-panel.test.tsx` (+640, -0)
- `packages/tui/test/session-terminal-availability.test.tsx` (+1, -2)
- `packages/tui/test/session-wheel-focus.test.tsx` (+1, -2)
- `packages/tui/test/stats.view.test.tsx` (+1, -2)
- `packages/tui/test/theme/v2/resolve.test.ts` (+5, -10)
- `packages/tui/test/ui/link.test.tsx` (+1, -3)
- `packages/tui/test/util/renderer.test.ts` (+13, -19)
- `packages/tui/test/util/selection-keys.test.ts` (+1, -0)
- `packages/tui/test/util/session.test.ts` (+1, -39)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/actions/button/button.css` (+260, -243)
- `packages/ui/src/actions/icon-button/icon-button.css` (+125, -117)
- `packages/ui/src/actions/submit.css` (+58, -53)
- `packages/ui/src/context/dialog.tsx` (+3, -0)
- `packages/ui/src/data-display/badge/badge.css` (+5, -0)
- `packages/ui/src/data-display/badge/badge.stories.tsx` (+10, -1)
- `packages/ui/src/data-display/badge/badge.tsx` (+1, -1)
- `packages/ui/src/forms/text-input/text-input.css` (+185, -180)
- `packages/ui/src/i18n/en.ts` (+3, -0)
- `packages/ui/src/icons/catalog.ts` (+4, -0)
- `packages/util/package.json` (+1, -1)
- `packages/web/astro.config.mjs` (+3, -2)
- `packages/web/package.json` (+1, -1)
- `patches/@modelcontextprotocol%2Fclient@2.0.0.patch` (+20, -2)
- `salesforce/README.md` (+38, -0)
- `salesforce/force-app/main/default/LeadConvertSettings/LeadConvertSettings.LeadConvertSetting-meta.xml` (+21, -0)
- `salesforce/force-app/main/default/layouts/Contact-Contact Layout.layout-meta.xml` (+294, -0)
- `salesforce/force-app/main/default/layouts/Lead-Lead Layout.layout-meta.xml` (+293, -0)
- `salesforce/force-app/main/default/objects/Contact/fields/Console_Account_ID__c.field-meta.xml` (+11, -0)
- `salesforce/force-app/main/default/objects/Contact/fields/Console_Signup_Date__c.field-meta.xml` (+8, -0)
- `salesforce/force-app/main/default/objects/Contact/fields/Has_Console_Account__c.field-meta.xml` (+8, -0)
- `salesforce/force-app/main/default/objects/Lead/fields/Console_Account_ID__c.field-meta.xml` (+11, -0)
- `salesforce/force-app/main/default/objects/Lead/fields/Console_Signup_Date__c.field-meta.xml` (+8, -0)
- `salesforce/force-app/main/default/objects/Lead/fields/Has_Console_Account__c.field-meta.xml` (+8, -0)
- `salesforce/force-app/main/default/permissionsets/Console_Account_Sync.permissionset-meta.xml` (+11, -0)
- `salesforce/force-app/main/default/standardValueSets/LeadSource.standardValueSet-meta.xml` (+69, -0)
- `salesforce/sfdx-project.json` (+6, -0)
- `script/upgrade-opentui.ts` (+35, -1)
- `sdks/vscode/package.json` (+2, -2)
- `services/update/migrations/0005_artifact_rollout.sql` (+2, -0)
- `services/update/package.json` (+1, -1)
- `services/update/src/index.ts` (+61, -18)
- `services/update/test/index.test.ts` (+125, -2)
- `services/www/openapi.json` (+37, -0)
- `services/www/public/openapi.json` (+37, -0)
- `services/www/src/docs/content/build/plugins/index.mdx` (+27, -1)
- `services/www/src/docs/content/cli/web.mdx` (+17, -2)
- `services/www/src/docs/content/config.mdx` (+24, -22)
- `services/www/src/docs/content/console/api/index.mdx` (+2, -1)
- `services/www/src/docs/content/console/go.mdx` (+193, -198)
- `services/www/src/docs/content/console/models.mdx` (+8, -15)
- `services/www/src/docs/content/index.mdx` (+3, -1)
- `services/www/src/docs/content/instructions.mdx` (+22, -4)
- `services/www/src/docs/content/migrate-v1.mdx` (+5, -5)
- `services/www/src/docs/content/permissions.mdx` (+1, -3)
- `services/www/src/docs/content/policies.mdx` (+67, -47)
- `services/www/src/docs/content/tools.mdx` (+2, -2)
- `services/www/src/pages/install.astro` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index d03f0fc..c249782 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "2.0.28",
+  "version": "2.0.29",
   "name": "@opencode/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/config.ts
```diff
diff --git a/packages/core/src/config.ts b/packages/core/src/config.ts
index 2c6546f..7945384 100644
--- a/packages/core/src/config.ts
+++ b/packages/core/src/config.ts
@@ -241,16 +241,33 @@ export const layer = (options?: Options) =>
               )
             : []
 
-        // System entries sit at lowest priority so users and projects can
-        // override ordinary defaults while reversed policy evaluation gives
-        // system policies highest file-based authority. Global entries sit
-        // below explicit and direct files; project directories rank above them.
-        // MDM preferences rank below the system directory so their policies
-        // carry the most file-based authority, matching V1 where they won.
-        const systemSupplementary = [
-          ...(sources.preferences ? yield* loadPreferences(sources.preferences).pipe(Effect.orDie) : []),
+        // Managed settings load last so they override everything, and MDM
+        // preferences outrank the system directory as in V1. Policies evaluate
+        // in reverse load order, so managed policies split off and load first
+        // to keep final file-based authority.
+        const managed = [
           ...(sources.system?.present ? yield* loadDirectory(sources.system.path).pipe(Effect.orDie) : []),
+          ...(sources.preferences ? yield* loadPreferences(sources.preferences).pipe(Effect.orDie) : []),
         ]
+        const managedPolicies = managed
+          .flatMap((entry) =>
+            entry.type === "document" && entry.info.policies
+              ? [
+                  new Document({
+                    type: "document",
+                    path: entry.path,
+                    info: new Info({ policies: entry.info.policies }),
+                  }),
+                ]
+              : [],
+          )
+          .toReversed()
+        const managedSettings = managed.map((entry) =>
+          entry.type === "document" && entry.info.policies
+            ? new Document({ ...entry, info: new Info({ ...entry.info, policies: undefined }) })
+            : entry,
+        )
+        // Global entries sit below explicit and direct files; project directories rank above them.
         const globalSupplementary = sources.global ? yield* loadDirectory(sources.global).pipe(Effect.orDie) : []
         const projectSupplementary = yield* Effect.forEach(
           sources.project.filter((root) => root.present),
@@ -260,13 +277,14 @@ export const layer = (options?: Options) =>
           Effect.map((entries) => entries.flat()),
         )
         return [
```

#### packages/core/src/config/normalize.ts
```diff
diff --git a/packages/core/src/config/normalize.ts b/packages/core/src/config/normalize.ts
index dd3fb59..4b0709a 100644
--- a/packages/core/src/config/normalize.ts
+++ b/packages/core/src/config/normalize.ts
@@ -192,6 +192,7 @@ export function normalize(input: unknown): Result {
   normalizeSkills(input, encoded, diagnostics)
   normalizeMcp(input, encoded, diagnostics)
   normalizeCompaction(input, encoded, diagnostics)
+  normalizePolicies(input, encoded, diagnostics)
   normalizeExperimental(input, encoded, diagnostics)
   normalizeWatcher(input, encoded, diagnostics)
   normalizeFormatter(input, encoded, diagnostics)
@@ -378,12 +379,13 @@ function normalizeCompaction(
   if (Object.keys(result).length || !Object.keys(input.compaction).length) encoded.compaction = result
 }
 
-function normalizeExperimental(
+// V1 provider lists and `experimental.policies` stay supported and merge into
+// top-level `policies`; within a document, later sources win ties.
+function normalizePolicies(
   input: Record<string, unknown>,
   encoded: Record<string, unknown>,
   diagnostics: Diagnostic[],
 ) {
-  const result: Record<string, unknown> = {}
   const generated: unknown[] = []
   const enabled = decodeProviderList(input, "enabled_providers", diagnostics)
   if (enabled.present && (!enabled.nonEmpty || enabled.values.length)) {
@@ -404,7 +406,32 @@ function normalizeExperimental(
       effect: "deny",
     })),
   )
-  const native: unknown[] = []
+  const experimental = isRecord(input.experimental)
+    ? decodeList(
+        input.experimental.policies,
+        ConfigPolicy.Info,
+        ["experimental", "policies"],
+        diagnostics,
+        decodeEncoded,
+      )
+    : []
+  const native = decodeList(input.policies, ConfigPolicy.Info, ["policies"], diagnostics, decodeEncoded)
+  if (
+    generated.length ||
+    experimental.length ||
+    native.length ||
+    Array.isArray(input.policies) ||
+    (isRecord(input.experimental) && Array.isArray(input.experimental.policies))
+  )
```

#### packages/core/src/config/plugin/instruction.ts
```diff
diff --git a/packages/core/src/config/plugin/instruction.ts b/packages/core/src/config/plugin/instruction.ts
index 448ccf7..5fe1f79 100644
--- a/packages/core/src/config/plugin/instruction.ts
+++ b/packages/core/src/config/plugin/instruction.ts
@@ -4,13 +4,14 @@ import { define } from "@opencode/plugin/effect/plugin"
 import { FSUtil } from "@opencode/util/fs-util"
 import { Global } from "@opencode/util/global"
 import { sameDirectory } from "@opencode/util/path"
-import { dirname, join } from "path"
-import { Effect, PubSub, Semaphore, Stream } from "effect"
+import path, { dirname, join } from "path"
+import { Effect, FiberMap, PubSub, Semaphore, Stream } from "effect"
+import { HttpClient, HttpClientRequest } from "effect/http"
+import { Config } from "../../config.js"
 import { Watcher } from "../../filesystem/watcher.js"
 import { InstructionDiscovery } from "../../instruction-discovery.js"
 import { Instructions } from "../../instructions/index.js"
 import { Location } from "../../location.js"
-import { AbsolutePath } from "../../schema.js"
 
 type Loaded =
   | { readonly type: "available"; readonly files: InstructionDiscovery.File[] }
@@ -18,17 +19,19 @@ type Loaded =
 
 export const Plugin = define({
   id: "opencode.config.instruction",
-  effect: Effect.fn(function* () {
+  effect: Effect.fn(function* (ctx) {
     const discovery = yield* InstructionDiscovery.Service
-    // Nothing this plugin watches or loads can contribute when both scopes
-    // are disabled; skip the resolves, the watcher fiber, and the transform.
-    if (!discovery.project && !discovery.global) return
+    // Activate even when both discovery scopes are disabled: configured `instructions`
+    // entries are explicit requests, not discovery.
     yield* Effect.gen(function* () {
+      const config = yield* Config.Service
       const fs = yield* FSUtil.Service
       const global = yield* Global.Service
+      const http = HttpClient.filterStatusOk(yield* HttpClient.HttpClient)
       const location = yield* Location.Service
       const watcher = yield* Watcher.Service
       const changes = yield* PubSub.sliding<string>(1)
+      const watches = yield* FiberMap.make<string>()
       const lock = Semaphore.makeUnsafe(1)
       const start = yield* fs.resolve(location.directory)
       const root = yield* fs.resolve(location.project.directory)
@@ -37,6 +40,10 @@ export const Plugin = define({
       const stop = FSUtil.contains(home, start) ? home : root
       const globalFile = yield* fs.resolve(join(global.config, "AGENTS.md"))
       const loaded: { current: Loaded } = { current: { type: "available", files: [] } }
```

#### packages/core/src/config/plugin/provider.ts
```diff
diff --git a/packages/core/src/config/plugin/provider.ts b/packages/core/src/config/plugin/provider.ts
index 748464a..95573ff 100644
--- a/packages/core/src/config/plugin/provider.ts
+++ b/packages/core/src/config/plugin/provider.ts
@@ -30,7 +30,7 @@ export const Plugin = define({
           })
         }
         integrations.update(integrationID, (integration) => {
-          integration.name = provider.name ?? integration.name
+          integration.name = provider.name || integration.name
         })
         if (provider.env !== undefined) {
           integrations.method.update({
@@ -66,7 +66,7 @@ export const Plugin = define({
             })
           provider.activation = "enabled"
           if (item.canonical !== undefined) provider.canonical = item.canonical
-          if (item.name !== undefined) provider.name = item.name
+          if (item.name) provider.name = item.name
           if (item.package !== undefined) provider.package = item.package
           if (item.compatibility !== undefined)
             provider.compatibility = { ...provider.compatibility, ...item.compatibility }
@@ -111,7 +111,7 @@ export const Plugin = define({
               if (item.settings?.baseURL !== undefined && model.settings) delete model.settings.baseURL
             }
             if (config.family !== undefined) model.family = config.family
-            if (config.name !== undefined) model.name = config.name
+            if (config.name) model.name = config.name
             if (config.modelID !== undefined) model.modelID = config.modelID
             if (config.compatibility !== undefined)
               model.compatibility = { ...model.compatibility, ...config.compatibility }
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/src/kilocode/ripgrep-glob.ts
- `src/core/` - review core changes from packages/core/src/kilocode/ripgrep-grep.ts
- `src/core/` - review core changes from packages/core/src/ripgrep.ts
- `src/core/` - review core changes from packages/core/test/kilocode/ripgrep-encoding.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/ripgrep-glob.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/ripgrep-settlement.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-kilo.test.ts
- `src/tool/EditToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt changes
- `src/tool/ShellToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt changes
- `src/tool/ToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolView.kt changes
- `src/tool/generate-image.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/generate-image.test.ts changes
- `src/tool/glob-ignored.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/glob-ignored.test.ts changes
- `src/tool/glob-ignored.ts` - update based on kilocode packages/opencode/src/kilocode/tool/glob-ignored.ts changes
- `src/tool/mcp.ts` - update based on opencode packages/core/src/tool/mcp.ts changes
