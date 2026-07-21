# Upstream Changes Report
Generated: 2026-07-21 08:29:44

## Summary
- kilocode: 48 commits, 209 files changed
- opencode: 17 commits, 69 files changed

## kilocode Changes (084bceada..a288dbc2e)

### Commits

- a288dbc2e - Merge pull request #12416 from Kilo-Org/vigorous-operation (Kirill Kalishev, 2026-07-20)
- 1ffdd568b - test(jetbrains): stabilize connection startup wait (kirillk, 2026-07-20)
- c564d1c23 - fix(jetbrains): translate skills settings (kirillk, 2026-07-20)
- 818788813 - fix(jetbrains): batch skill saves (kirillk, 2026-07-20)
- 88930fe39 - fix(jetbrains): narrow skill cache detection (kirillk, 2026-07-20)
- 717bfea32 - fix(jetbrains): address skills settings review (kirillk, 2026-07-20)
- 7060f8cb2 - release: v7.4.13 (kilo-maintainer[bot], 2026-07-20)
- a663c151b - Merge pull request #12335 from shssoichiro/fix/opencode-tui-start-failure (Johnny Eric Amancio, 2026-07-20)
- c35e462fd - Merge branch 'main' into fix/opencode-tui-start-failure (Johnny Eric Amancio, 2026-07-20)
- edb9098a7 - fix(jetbrains): treat remote skills as read-only (kirillk, 2026-07-20)
- b56fa5abe - Merge pull request #12314 from Kilo-Org/johnnyeric/fix-issue-12225 (Johnny Eric Amancio, 2026-07-20)
- 3bc89bf89 - Merge pull request #12191 from Kilo-Org/resisted-diamond (Kirill Kalishev, 2026-07-20)
- 5ca98f7c1 - Merge pull request #12292 from Kilo-Org/analyze-jetbrains-vscode-setting-parity (Kirill Kalishev, 2026-07-20)
- a695930d7 - fix(ui): stop diff content bleeding through sticky tool card headers (#12415) (Marius, 2026-07-20)
- aae154c76 - fix(jetbrains): detect skill editor syntax (kirillk, 2026-07-20)
- 26f930ddb - fix(jetbrains): run file mention searches concurrently (kirillk, 2026-07-20)
- 61d26e666 - feat(jetbrains): improve skills settings (kirillk, 2026-07-20)
- 197e6a347 - chore: remove unrelated package changes (kirillk, 2026-07-20)
- cea9d998e - chore: update lockfile after main merge (kirillk, 2026-07-20)
- 49641c637 - Merge remote-tracking branch 'origin/main' into resisted-diamond (kirillk, 2026-07-20)
- 520679a91 - fix: keep CLI sidebar branch label in sync with git (Johnny Amancio, 2026-07-20)
- 0cf9f902e - Merge pull request #12378 from Kilo-Org/fix/openrouter-auto-chat-list (Christiaan Arnoldus, 2026-07-20)
- 5ef52222e - Merge pull request #12403 from Kilo-Org/shift-tab-reasoning-variant-navigation (Marius, 2026-07-20)
- 5819c6899 - feat(vscode): cycle reasoning effort variants with Shift+Tab (marius-kilocode, 2026-07-20)
- 85be09b41 - Merge pull request #12401 from Kilo-Org/investigate-issue-12377 (Marius, 2026-07-20)
- ad66c908a - fix(revert): clarify workspace restoration (#12302) (Marius, 2026-07-20)
- 210a6bbf9 - feat(agent-manager): effort selection in compare models, fix worktree prompt scrollbars (marius-kilocode, 2026-07-20)
- eb55071eb - Merge branch 'main' into fix/openrouter-auto-chat-list (Christiaan Arnoldus, 2026-07-20)
- 7e8f4a7cb - fix(gateway): keep image-output models in chat list (chrarnoldus, 2026-07-20)
- d23719624 - Merge pull request #12294 from Kilo-Org/fix/es2023-libs (Christiaan Arnoldus, 2026-07-20)
- b402cc263 - fix(gateway): keep openrouter auto models in chat list (chrarnoldus, 2026-07-18)
- 99227f674 - fix(cli): avoid standalone TUI preload lookup (Josh Holmer, 2026-07-17)
- 62a020b4d - Merge branch 'main' into analyze-jetbrains-vscode-setting-parity (Kirill Kalishev, 2026-07-17)
- 63fefce17 - fix(jetbrains): keep applied settings visible (kirillk, 2026-07-17)
- 8f37445bd - fix(jetbrains): improve context pattern editing (kirillk, 2026-07-17)
- bd8411066 - fix(jetbrains): address context settings review (kirillk, 2026-07-17)
- 0602394d6 - fix(jetbrains): polish context settings UI (kirillk, 2026-07-17)
- 9b8dd9763 - Merge remote-tracking branch 'origin/main' into vigorous-operation (kirillk, 2026-07-17)
- 23cff3649 - Merge remote-tracking branch 'origin/main' into analyze-jetbrains-vscode-setting-parity (kirillk, 2026-07-17)
- b7c3c151d - Merge remote-tracking branch 'origin/main' into fix/es2023-libs Co-authored-by: kiloconnect[bot] <240665456+kiloconnect[bot]@users.noreply.github.com> (chrarnoldus, 2026-07-16)
- 6c03a5c07 - fix: allow ES2023 library APIs (chrarnoldus, 2026-07-16)
- a9a9b78b9 - feat(jetbrains): add skills settings page (kirillk, 2026-07-16)
- 6dcaeb3e9 - feat(jetbrains): add context settings page (kirillk, 2026-07-16)
- a6284d868 - Merge remote-tracking branch 'origin/main' into resisted-diamond (kirillk, 2026-07-16)
- d5222987f - fix(jetbrains): always use core file search (kirillk, 2026-07-16)
- a745a7b19 - fix(core): restore pre-push typecheck (kirillk, 2026-07-14)
- 66c344b8d - Merge remote-tracking branch 'origin/main' into resisted-diamond (kirillk, 2026-07-14)
- 4d676b68d - feat(jetbrains): add file search backend toggle (kirillk, 2026-07-13)

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
- `packages/core/package.json` (+1, -1)
- `packages/core/src/v1/session.ts` (+1, -0)

#### Other Changes
- `.changeset/agent-manager-stop-session.md` (+0, -6)
- `.changeset/align-cli-usage.md` (+0, -5)
- `.changeset/background-process-display.md` (+0, -5)
- `.changeset/calm-heredocs-explain.md` (+0, -6)
- `.changeset/chat-bidi-text.md` (+0, -5)
- `.changeset/cloud-session-import.md` (+0, -6)
- `.changeset/default-worktree-dialog.md` (+0, -5)
- `.changeset/finish-deprecated-review-command.md` (+0, -5)
- `.changeset/indexing-file-extensions.md` (+0, -7)
- `.changeset/jetbrains-skills-settings.md` (+5, -0)
- `.changeset/remote-embedders-retry-timeouts.md` (+0, -5)
- `.changeset/remote-session-slash-commands.md` (+0, -5)
- `.github/workflows/test.yml` (+1, -1)
- `.kilo/plans/jetbrains-context-settings-page.md` (+423, -0)
- `bun.lock` (+26, -26)
- `docs/jetbrains-vscode-settings-parity.md` (+87, -0)
- `package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/labs-tool-call-lab/search-previews-chromium-linux.png` (+2, -2)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-gateway/src/api/models.ts` (+0, -5)
- `packages/kilo-gateway/test/api/models.test.ts` (+82, -0)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/CHANGELOG.md` (+6, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendAppService.kt` (+8, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendSessionManager.kt` (+4, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloCliDataParser.kt` (+46, -1)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloAgentBehaviorRpcApiImpl.kt` (+159, -1)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorkspaceDtoMapper.kt` (+2, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorkspaceRpcApiImpl.kt` (+57, -103)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/workspace/KiloBackendWorkspace.kt` (+1, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/workspace/KiloWorkspaceState.kt` (+1, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendAppServiceTest.kt` (+24, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloConnectionServiceTest.kt` (+11, -3)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/KiloCliDataParserTest.kt` (+57, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloAgentBehaviorRpcApiImplTest.kt` (+152, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloWorkspaceRpcApiImplTest.kt` (+84, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/MockCliServer.kt` (+23, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/KiloNotifications.kt` (+9, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloAgentBehaviorService.kt` (+8, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloWorkspaceService.kt` (+10, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/editor/SessionEditorTextField.kt` (+1, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/KiloPromptCompletionProvider.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/KiloSettingsConfigurable.kt` (+9, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/AgentBehaviorConfigurable.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/SkillsConfigurable.kt` (+586, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsDraftState.kt` (+12, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsListModel.kt` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsListRenderer.kt` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsListView.kt` (+51, -7)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsPanel.kt` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/context/ContextConfigurable.kt` (+18, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/context/ContextSettingsState.kt` (+77, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/context/ContextSettingsUi.kt` (+388, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/kilo.jetbrains.frontend.xml` (+17, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+48, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ar.properties` (+50, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_bs.properties` (+50, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_da.properties` (+50, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_de.properties` (+50, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_es.properties` (+50, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_fr.properties` (+50, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ja.properties` (+50, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ko.properties` (+50, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_nl.properties` (+50, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_no.properties` (+50, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pl.properties` (+50, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pt_BR.properties` (+50, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ru.properties` (+50, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_th.properties` (+50, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_tr.properties` (+50, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_uk.properties` (+50, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_CN.properties` (+50, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_TW.properties` (+50, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/app/KiloAgentBehaviorServiceTest.kt` (+31, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/app/KiloWorkspaceServiceTest.kt` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/PromptPanelTest.kt` (+10, -26)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/KiloSettingsConfigurableTest.kt` (+15, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/AgentBehaviorConfigurableTest.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/SkillsSettingsUiTest.kt` (+615, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/base/SettingsDraftStateTest.kt` (+60, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/base/SettingsListViewTest.kt` (+33, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/context/ContextSettingsStateTest.kt` (+76, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/context/ContextSettingsUiTest.kt` (+324, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeAgentBehaviorRpcApi.kt` (+42, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeAppRpcApi.kt` (+24, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloAgentBehaviorRpcApi.kt` (+6, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloWorkspaceRpcApi.kt` (+1, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/KiloAppStateDto.kt` (+29, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/SkillDto.kt` (+2, -0)
- `packages/kilo-memory/package.json` (+1, -1)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/basic-tool.css` (+25, -0)
- `packages/kilo-vscode/CHANGELOG.md` (+41, -0)
- `packages/kilo-vscode/package.json` (+6, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+9, -0)
- `packages/kilo-vscode/src/agent-manager/multi-version.ts` (+5, -2)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+1, -1)
- `packages/kilo-vscode/src/kilo-provider-utils.ts` (+1, -1)
- `packages/kilo-vscode/src/kilo-provider/chat-settings.ts` (+25, -0)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/unit/chat-settings-message.test.ts` (+54, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-utils.test.ts` (+8, -0)
- `packages/kilo-vscode/tests/unit/multi-model-utils.test.ts` (+19, -0)
- `packages/kilo-vscode/tests/unit/multi-version.test.ts` (+57, -0)
- `packages/kilo-vscode/tests/unit/new-worktree-dialog-sandbox.test.ts` (+1, -1)
- `packages/kilo-vscode/tests/unit/revert-checkpoints.test.ts` (+29, -0)
- `packages/kilo-vscode/tests/unit/session-variant-store.test.ts` (+21, -0)
- `packages/kilo-vscode/tsconfig.json` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/MultiModelSelector.tsx` (+23, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/NewWorktreeDialog.tsx` (+35, -6)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+17, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fr.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/it.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ja.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ko.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/nl.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/no.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/pl.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ru.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/th.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/tr.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/uk.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zh.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zht.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/multi-model-utils.ts` (+16, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+15, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/RevertBanner.tsx` (+28, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/DisplayTab.tsx` (+14, -1)
- `packages/kilo-vscode/webview-ui/src/components/shared/ThinkingSelector.tsx` (+64, -44)
- `packages/kilo-vscode/webview-ui/src/context/config.tsx` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/context/session-variant-store.ts` (+10, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+9, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/stories/tool-call-lab.stories.tsx` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/styles/banners.css` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/agent-manager.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/sessions.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/tsconfig.json` (+1, -1)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+34, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/cli/cmd/tui.ts` (+8, -1)
- `packages/opencode/src/kilocode/bootstrap.ts` (+6, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui.ts` (+4, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/session-import.ts` (+1, -0)
- `packages/opencode/src/kilocode/watcher.ts` (+62, -0)
- `packages/opencode/src/project/instance-runtime.ts` (+4, -0)
- `packages/opencode/src/session/revert.ts` (+15, -1)
- `packages/opencode/src/session/session.ts` (+1, -0)
- `packages/opencode/test/fixture/fixture.ts` (+11, -0)
- `packages/opencode/test/kilocode/cli/tui/thread.test.ts` (+26, -0)
- `packages/opencode/test/kilocode/instance-vcs-watcher.test.ts` (+69, -0)
- `packages/opencode/test/kilocode/session/revert.test.ts` (+159, -0)
- `packages/opencode/test/kilocode/tool-registry-indexing.test.ts` (+3, -1)
- `packages/opencode/test/preload.ts` (+1, -0)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin-atomic-chat/tsconfig.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/plugin/tsconfig.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+1, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+12, -0)
- `packages/sdk/js/tsconfig.json` (+1, -1)
- `packages/sdk/openapi.json` (+48, -0)
- `packages/server/package.json` (+1, -1)
- `packages/storybook/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index bcf809158..d098834e4 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.4.11",
+  "version": "7.4.13",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/v1/session.ts
```diff
diff --git a/packages/core/src/v1/session.ts b/packages/core/src/v1/session.ts
index b951eea34..68af4065a 100644
--- a/packages/core/src/v1/session.ts
+++ b/packages/core/src/v1/session.ts
@@ -555,6 +555,7 @@ const SessionRevert = Schema.Struct({
   partID: optionalOmitUndefined(PartID),
   snapshot: optionalOmitUndefined(Schema.String),
   diff: optionalOmitUndefined(Schema.String),
+  workspace: optionalOmitUndefined(Schema.Literals(["restored", "snapshots-disabled", "unavailable"])), // kilocode_change
 })
 
 const SessionModel = Schema.Struct({
```


## opencode Changes (a19b52e..849c259)

### Commits

- 849c259 - docs: generalize session title model description (#37986) (Aiden Cline, 2026-07-20)
- 3033afb - fix(provider): normalize Mistral family tool call IDs (#37982) (Aiden Cline, 2026-07-20)
- 5a8ee27 - fix(provider): update muse-spark reasoning default and system prompt (#37562) (Matthias Reso, 2026-07-20)
- 4cc0224 - fix(opencode): display proper session import errors (#36258) (OpeOginni, 2026-07-20)
- d36a2d8 - sync release versions for v1.18.4 (opencode, 2026-07-20)
- 96ff82a - fix(console): remove desktop promo overlay (opencode-agent[bot], 2026-07-20)
- 4872c48 - fix(app): complete mentions at cursor (#37941) (opencode-agent[bot], 2026-07-20)
- 47fc6f2 - fix(app): preserve mentions during paste (#37940) (opencode-agent[bot], 2026-07-20)
- da312b0 - fix(app): preserve command menu drafts (#37942) (opencode-agent[bot], 2026-07-20)
- 70535a1 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-20)
- 43e472b - feat(app): sync embedded terminal theme (#37931) (Luke Parker, 2026-07-20)
- b67fda1 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-20)
- e2531df - chore(app): bump ghostty-web (#37923) (Luke Parker, 2026-07-20)
- cc3615b - fix(app): tolerate missing message parents (#37918) (opencode-agent[bot], 2026-07-20)
- 5542415 - fix(app): shrink Windows drawer close button (#37909) (Luke Parker, 2026-07-20)
- 8bec40a - fix(app): align Windows upgrade drawer (#37895) (Luke Parker, 2026-07-20)
- 4a81e83 - fix(app): gate notification server selection (#37890) (opencode-agent[bot], 2026-07-20)

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
- `packages/console/core/package.json` (+1, -1)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/pty/pty.node.ts` (+4, -1)
- `packages/stats/core/package.json` (+1, -1)

#### Other Changes
- `bun.lock` (+30, -30)
- `nix/hashes.json` (+4, -4)
- `packages/app/e2e/regression/prompt-input-v2-command-draft.spec.ts` (+50, -0)
- `packages/app/package.json` (+2, -2)
- `packages/app/src/addons/serialize.test.ts` (+8, -0)
- `packages/app/src/addons/serialize.ts` (+9, -1)
- `packages/app/src/components/help-button.tsx` (+32, -3)
- `packages/app/src/components/terminal.tsx` (+10, -1)
- `packages/app/src/context/notification.tsx` (+8, -1)
- `packages/app/src/context/server-session.test.ts` (+43, -0)
- `packages/app/src/context/server-session.ts` (+12, -1)
- `packages/cli/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/app.tsx` (+0, -2)
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
- `packages/opencode/src/cli/cmd/import.ts` (+14, -8)
- `packages/opencode/src/provider/transform.ts` (+2, -3)
- `packages/opencode/src/session/prompt/meta.txt` (+64, -75)
- `packages/opencode/test/cli/import.test.ts` (+36, -0)
- `packages/opencode/test/provider/transform.test.ts` (+49, -0)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/session-ui/src/v2/components/prompt-input/interaction.ts` (+12, -11)
- `packages/session-ui/src/v2/components/prompt-input/machine.test.ts` (+14, -0)
- `packages/session-ui/src/v2/components/prompt-input/machine.ts` (+8, -3)
- `packages/session-ui/src/v2/components/prompt-input/store.test.ts` (+22, -0)
- `packages/session-ui/src/v2/components/prompt-input/store.ts` (+37, -1)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/server/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/ar/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/bs/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/da/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/de/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/es/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/fr/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/it/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/ja/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/ko/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/nb/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/pl/zen.mdx` (+1, -2)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/ru/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/th/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/tr/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+1, -2)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 51636b6..6a04328 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.18.3",
+  "version": "1.18.4",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 34d37a8..17708d2 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.18.3",
+  "version": "1.18.4",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/pty/pty.node.ts
```diff
diff --git a/packages/core/src/pty/pty.node.ts b/packages/core/src/pty/pty.node.ts
index 76f415f..54691d1 100644
--- a/packages/core/src/pty/pty.node.ts
+++ b/packages/core/src/pty/pty.node.ts
@@ -4,7 +4,10 @@ import type { Opts, Proc } from "./pty"
 export type { Disp, Exit, Opts, Proc } from "./pty"
 
 export function spawn(file: string, args: string[], opts: Opts): Proc {
-  const proc = pty.spawn(file, args, opts)
+  const proc = pty.spawn(file, args, {
+    ...opts,
+    ...(process.platform === "win32" ? { useConptyDll: true } : {}),
+  })
   return {
     pid: proc.pid,
     onData(listener) {
```

#### packages/stats/core/package.json
```diff
diff --git a/packages/stats/core/package.json b/packages/stats/core/package.json
index d942879..e828912 100644
--- a/packages/stats/core/package.json
+++ b/packages/stats/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/stats-core",
-  "version": "1.18.3",
+  "version": "1.18.4",
   "private": true,
   "type": "module",
   "license": "MIT",
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/src/v1/session.ts
