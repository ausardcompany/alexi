# Upstream Changes Report
Generated: 2026-09-17 11:07:39

## Summary
- kilocode: 27 commits, 254 files changed
- opencode: 8 commits, 65 files changed

## kilocode Changes (c23548f4f..8db973de9)

### Commits

- 8db973de9 - Merge pull request #14235 from Kilo-Org/aquatic-guardian (Marius, 2026-09-17)
- 8bcfbb5dd - fix(ci): avoid PR-scoped Zig cache writes (marius-kilocode, 2026-09-17)
- 504749021 - fix(ci): cache and verify Zig downloads with bounded mirror fallback (marius-kilocode, 2026-09-17)
- 4334b3b53 - Merge pull request #14225 from Kilo-Org/fix/stale-session-status-blocks-reload (Marius, 2026-09-17)
- 059726510 - Merge pull request #14221 from Kilo-Org/disable-feature-in-ssh-environments (Marius, 2026-09-17)
- 633f4c0ee - release: v7.7.3 (kilo-maintainer[bot], 2026-09-17)
- e31aa5769 - fix(opencode): keep busy status writes after successful publication (marius-kilocode, 2026-09-17)
- 88d23150b - fix(opencode): clear session status before publishing status events (marius-kilocode, 2026-09-17)
- 6c066a587 - fix(vscode): disable voice input in remote windows (marius-kilocode, 2026-09-17)
- ad099d8ea - Merge pull request #14209 from Kilo-Org/remove-kilo-claw (Marius, 2026-09-16)
- f67097430 - Merge pull request #14210 from Kilo-Org/refactor-search-scope-to-messages (Marius, 2026-09-16)
- 91aa83495 - Merge pull request #14207 from Kilo-Org/remove-dev-stats (Marius, 2026-09-16)
- e12b519c9 - Merge pull request #14208 from Kilo-Org/remove-review-aliases (Marius, 2026-09-16)
- a955c15e6 - chore(vscode): drop leftover question dock id and pin search range assertion (marius-kilocode, 2026-09-16)
- 1e598e8ba - Merge pull request #14180 from Kilo-Org/explicit-model-selection-lost (Andrea Giammarchi, 2026-09-16)
- 10f1f5bc7 - Merge remote-tracking branch 'origin/remove-kilo-claw' into remove-kilo-claw (marius-kilocode, 2026-09-16)
- 7fa7f5136 - chore: fix prettier formatting after KiloClaw removal (marius-kilocode, 2026-09-16)
- b7ebdc521 - Merge remote-tracking branch 'origin/main' into refactor-search-scope-to-messages (marius-kilocode, 2026-09-16)
- 843709697 - fix(vscode): match chat search against message text only (marius-kilocode, 2026-09-16)
- 9e791aea5 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-16)
- 3eaf47ba5 - refactor: remove KiloClaw (marius-kilocode, 2026-09-16)
- 1d187e857 - refactor(cli): remove deprecated review command aliases (marius-kilocode, 2026-09-16)
- e4ca8306b - chore: remove dead dev:stats script from root package.json (marius-kilocode, 2026-09-16)
- 0d2fee251 - fix(vscode): discard empty draft caches after goal promotion (webreflection, 2026-09-16)
- fa6cc2d4f - docs(vscode): explain model preference edge-case fixes (webreflection, 2026-09-16)
- 50f7d01ad - fix(vscode): preserve effort intent and live session defaults (webreflection, 2026-09-16)
- dd2f2f9a9 - fix(vscode): default model not persistent after explicit user choice (webreflection, 2026-09-15)

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

#### Other Changes
- `.changeset/animated-kilo-logo.md` (+0, -5)
- `.changeset/chat-input-undo-redo.md` (+0, -5)
- `.changeset/codex-usage-visibility.md` (+0, -6)
- `.changeset/document-preview-windows-case.md` (+0, -5)
- `.changeset/fast-worktree-deletion.md` (+0, -6)
- `.changeset/fix-stale-reload-status.md` (+6, -0)
- `.changeset/inline-diff-parity.md` (+0, -5)
- `.changeset/jetbrains-paste-collapse-thresholds.md` (+0, -5)
- `.changeset/jetbrains-pr-import-errors.md` (+0, -5)
- `.changeset/jetbrains-worktree-row-menu-order.md` (+0, -5)
- `.changeset/pr-review-snapshot-reload.md` (+0, -5)
- `.changeset/remote-speech-to-text.md` (+5, -0)
- `.changeset/restore-playwright-browser-tools.md` (+0, -5)
- `.changeset/restore-prompt-window-focus.md` (+0, -5)
- `.changeset/review-diff-row-height.md` (+0, -5)
- `.changeset/skills-paths-leading-slash-and-picker-groups.md` (+0, -6)
- `.changeset/streaming-flicker.md` (+0, -5)
- `.changeset/vscode-paste-collapse.md` (+0, -5)
- `.changeset/worktree-health-recovery.md` (+0, -6)
- `.github/actions/setup-linux-sandbox/action.yml` (+48, -5)
- `.github/workflows/test.yml` (+2, -0)
- `README.md` (+0, -9)
- `artifacts/glm52-rise-video/package.json` (+1, -1)
- `bun.lock` (+42, -42)
- `package.json` (+1, -2)
- `packages/client/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/httpapi-codegen/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/features/speech-to-text.md` (+2, -0)
- `packages/kilo-docs/pages/contributing/architecture/vscode-extension.md` (+2, -3)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/sidebar-top-bar-default-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/source-links.md` (+0, -8)
- `packages/kilo-gateway/package.json` (+2, -3)
- `packages/kilo-gateway/src/api/constants.ts` (+0, -9)
- `packages/kilo-gateway/src/claw/index.ts` (+0, -39)
- `packages/kilo-gateway/src/claw/kilo-chat-client.ts` (+0, -232)
- `packages/kilo-gateway/src/claw/types.ts` (+0, -182)
- `packages/kilo-gateway/src/index.ts` (+0, -4)
- `packages/kilo-gateway/src/server/handlers.ts` (+1, -55)
- `packages/kilo-gateway/src/server/routes.ts` (+0, -103)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/CHANGELOG.md` (+14, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/KiloCliDataParserTest.kt` (+5, -5)
- `packages/kilo-memory/package.json` (+1, -1)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/message-part.tsx` (+5, -37)
- `packages/kilo-vscode/CHANGELOG.md` (+55, -0)
- `packages/kilo-vscode/esbuild.js` (+0, -1)
- `packages/kilo-vscode/knip.json` (+0, -1)
- `packages/kilo-vscode/package.json` (+4, -24)
- `packages/kilo-vscode/src/KiloProvider.ts` (+0, -3)
- `packages/kilo-vscode/src/agent-manager/multi-version.ts` (+3, -3)
- `packages/kilo-vscode/src/extension.ts` (+0, -21)
- `packages/kilo-vscode/src/features.ts` (+8, -1)
- `packages/kilo-vscode/src/kilo-provider/command-completion.ts` (+1, -1)
- `packages/kilo-vscode/src/kilo-provider/model-state.ts` (+77, -27)
- `packages/kilo-vscode/src/kiloclaw/KiloClawProvider.ts` (+0, -1296)
- `packages/kilo-vscode/src/kiloclaw/event-service-client.ts` (+0, -16)
- `packages/kilo-vscode/src/kiloclaw/kilo-chat-client.ts` (+0, -7)
- `packages/kilo-vscode/src/kiloclaw/token-manager.ts` (+0, -107)
- `packages/kilo-vscode/src/kiloclaw/types.ts` (+0, -116)
- `packages/kilo-vscode/src/kiloclaw/ulid.ts` (+0, -41)
- `packages/kilo-vscode/tests/fixtures/session-preference-loader.ts` (+169, -0)
- `packages/kilo-vscode/tests/fixtures/session-provider-activity.tsx` (+439, -16)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/unit/command-completion.test.ts` (+1, -3)
- `packages/kilo-vscode/tests/unit/font-size-arch.test.ts` (+1, -3)
- `packages/kilo-vscode/tests/unit/indexing-utils.test.ts` (+6, -0)
- `packages/kilo-vscode/tests/unit/model-state.test.ts` (+343, -0)
- `packages/kilo-vscode/tests/unit/multi-version.test.ts` (+8, -0)
- `packages/kilo-vscode/tests/unit/new-worktree-dialog-sandbox.test.ts` (+331, -25)
- `packages/kilo-vscode/tests/unit/prompt-send-contract.test.ts` (+2, -2)
- `packages/kilo-vscode/tests/unit/session-model-store.test.ts` (+29, -13)
- `packages/kilo-vscode/tests/unit/session-preference-loader.test.ts` (+20, -0)
- `packages/kilo-vscode/tests/unit/session-variant-store.test.ts` (+3, -3)
- `packages/kilo-vscode/tests/unit/session-variants.test.ts` (+40, -12)
- `packages/kilo-vscode/tests/unit/speech-to-text-availability.test.ts` (+5, -0)
- `packages/kilo-vscode/tests/unit/speech-to-text-prewarm.test.ts` (+11, -2)
- `packages/kilo-vscode/tests/unit/transcript-search-text.test.ts` (+90, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/NewWorktreeDialog.tsx` (+19, -57)
- `packages/kilo-vscode/webview-ui/agent-manager/new-worktree-models.ts` (+98, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/project/registry.ts` (+13, -1)
- `packages/kilo-vscode/webview-ui/diff-viewer/review-setup.ts` (+2, -2)
- `packages/kilo-vscode/webview-ui/kiloclaw/KiloClawApp.tsx` (+0, -79)
- `packages/kilo-vscode/webview-ui/kiloclaw/components/ConversationList.tsx` (+0, -198)
- `packages/kilo-vscode/webview-ui/kiloclaw/components/MessageArea.tsx` (+0, -344)
- `packages/kilo-vscode/webview-ui/kiloclaw/components/MessageBubble.tsx` (+0, -376)
- `packages/kilo-vscode/webview-ui/kiloclaw/components/SetupView.tsx` (+0, -32)
- `packages/kilo-vscode/webview-ui/kiloclaw/components/StatusSidebar.tsx` (+0, -213)
- `packages/kilo-vscode/webview-ui/kiloclaw/components/UpgradeView.tsx` (+0, -33)
- `packages/kilo-vscode/webview-ui/kiloclaw/components/botStatus.ts` (+0, -44)
- `packages/kilo-vscode/webview-ui/kiloclaw/context/claw.tsx` (+0, -293)
- `packages/kilo-vscode/webview-ui/kiloclaw/context/language.tsx` (+0, -91)
- `packages/kilo-vscode/webview-ui/kiloclaw/i18n/ar.ts` (+0, -41)
- `packages/kilo-vscode/webview-ui/kiloclaw/i18n/br.ts` (+0, -42)
- `packages/kilo-vscode/webview-ui/kiloclaw/i18n/bs.ts` (+0, -43)
- `packages/kilo-vscode/webview-ui/kiloclaw/i18n/da.ts` (+0, -43)
- `packages/kilo-vscode/webview-ui/kiloclaw/i18n/de.ts` (+0, -42)
- `packages/kilo-vscode/webview-ui/kiloclaw/i18n/en.ts` (+0, -94)
- `packages/kilo-vscode/webview-ui/kiloclaw/i18n/es.ts` (+0, -42)
- `packages/kilo-vscode/webview-ui/kiloclaw/i18n/fa.ts` (+0, -95)
- `packages/kilo-vscode/webview-ui/kiloclaw/i18n/fr.ts` (+0, -43)
- `packages/kilo-vscode/webview-ui/kiloclaw/i18n/it.ts` (+0, -51)
- `packages/kilo-vscode/webview-ui/kiloclaw/i18n/ja.ts` (+0, -42)
- `packages/kilo-vscode/webview-ui/kiloclaw/i18n/ko.ts` (+0, -42)
- `packages/kilo-vscode/webview-ui/kiloclaw/i18n/nl.ts` (+0, -42)
- `packages/kilo-vscode/webview-ui/kiloclaw/i18n/no.ts` (+0, -42)
- `packages/kilo-vscode/webview-ui/kiloclaw/i18n/pl.ts` (+0, -42)
- `packages/kilo-vscode/webview-ui/kiloclaw/i18n/ru.ts` (+0, -43)
- `packages/kilo-vscode/webview-ui/kiloclaw/i18n/th.ts` (+0, -41)
- `packages/kilo-vscode/webview-ui/kiloclaw/i18n/tr.ts` (+0, -43)
- `packages/kilo-vscode/webview-ui/kiloclaw/i18n/uk.ts` (+0, -43)
- `packages/kilo-vscode/webview-ui/kiloclaw/i18n/zh.ts` (+0, -41)
- `packages/kilo-vscode/webview-ui/kiloclaw/i18n/zht.ts` (+0, -41)
- `packages/kilo-vscode/webview-ui/kiloclaw/index.tsx` (+0, -11)
- `packages/kilo-vscode/webview-ui/kiloclaw/kiloclaw.css` (+0, -776)
- `packages/kilo-vscode/webview-ui/kiloclaw/lib/types.ts` (+0, -16)
- `packages/kilo-vscode/webview-ui/src/components/chat/AssistantMessage.tsx` (+4, -22)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+8, -502)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/QuestionDock.tsx` (+1, -10)
- `packages/kilo-vscode/webview-ui/src/components/chat/SidebarTopBar.tsx` (+4, -6)
- `packages/kilo-vscode/webview-ui/src/components/chat/TranscriptRow.tsx` (+0, -7)
- `packages/kilo-vscode/webview-ui/src/components/chat/question-dock-utils.ts` (+0, -27)
- `packages/kilo-vscode/webview-ui/src/components/chat/transcript-search-highlight.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/transcript-search-text.ts` (+63, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/ModelsTab.tsx` (+8, -6)
- `packages/kilo-vscode/webview-ui/src/components/speech-to-text/SpeechToTextPrewarm.tsx` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/components/speech-to-text/availability.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/context/config.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/context/local-tabs.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/context/model-selection.ts` (+6, -1)
- `packages/kilo-vscode/webview-ui/src/context/session-model-preferences.ts` (+107, -0)
- `packages/kilo-vscode/webview-ui/src/context/session-model-store.ts` (+6, -5)
- `packages/kilo-vscode/webview-ui/src/context/session-preference-loader.ts` (+55, -0)
- `packages/kilo-vscode/webview-ui/src/context/session-types.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/context/session-variant-store.ts` (+4, -2)
- `packages/kilo-vscode/webview-ui/src/context/session-variants.ts` (+52, -9)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+100, -107)
- `packages/kilo-vscode/webview-ui/src/context/transcript-search.tsx` (+3, -7)
- `packages/kilo-vscode/webview-ui/src/hooks/useSlashCommand.ts` (+0, -8)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/stories/agent-manager.stories.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/stories/tool-call-lab.stories.tsx` (+5, -5)
- `packages/kilo-vscode/webview-ui/src/types/messages/config.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+2, -6)
- `packages/kilo-vscode/webview-ui/tsconfig.json` (+1, -8)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+29, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/command/index.ts` (+1, -3)
- `packages/opencode/src/kilocode/claw/autocomplete.tsx` (+0, -316)
- `packages/opencode/src/kilocode/claw/chat.tsx` (+0, -280)
- `packages/opencode/src/kilocode/claw/client.ts` (+0, -493)
- `packages/opencode/src/kilocode/claw/dialog-conversation-list.tsx` (+0, -128)
- `packages/opencode/src/kilocode/claw/hooks.ts` (+0, -300)
- `packages/opencode/src/kilocode/claw/kilo-chat-client.ts` (+0, -6)
- `packages/opencode/src/kilocode/claw/sidebar.tsx` (+0, -216)
- `packages/opencode/src/kilocode/claw/types.ts` (+0, -43)
- `packages/opencode/src/kilocode/claw/view.tsx` (+0, -150)
- `packages/opencode/src/kilocode/cli/cmd/tui/app.tsx` (+2, -11)
- `packages/opencode/src/kilocode/components/dialog-claw-setup.tsx` (+0, -68)
- `packages/opencode/src/kilocode/components/dialog-claw-upgrade.tsx` (+0, -56)
- `packages/opencode/src/kilocode/kilo-commands.tsx` (+0, -45)
- `packages/opencode/src/kilocode/presence/service.ts` (+2, -2)
- `packages/opencode/src/kilocode/review/command.ts` (+0, -26)
- `packages/opencode/src/kilocode/server/httpapi/groups/kilo-gateway.ts` (+0, -66)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilo-gateway.ts` (+1, -53)
- `packages/opencode/src/kilocode/server/httpapi/public.ts` (+0, -10)
- `packages/opencode/src/session/prompt.ts` (+0, -69)
- `packages/opencode/src/session/status.ts` (+7, -5)
- `packages/opencode/test/kilocode/review-command.test.ts` (+2, -16)
- `packages/opencode/test/kilocode/server/httpapi-exercise-scenarios.ts` (+0, -2)
- `packages/opencode/test/kilocode/server/httpapi-public.test.ts` (+0, -10)
- `packages/opencode/test/kilocode/server/kilo-gateway-statuses.test.ts` (+0, -48)
- `packages/opencode/test/kilocode/session-prompt-permission-refresh.test.ts` (+3, -3)
- `packages/opencode/test/kilocode/session-status.test.ts` (+79, -0)
- `packages/opencode/test/session/prompt.test.ts` (+0, -32)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/protocol/package.json` (+1, -1)
- `packages/schema/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk-next/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+0, -75)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+4, -93)
- `packages/sdk/openapi.json` (+11, -245)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/storybook/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/tui/src/app.tsx` (+0, -5)
- `packages/tui/src/context/route.tsx` (+1, -7)
- `packages/tui/src/plugin/adapters.tsx` (+0, -4)
- `packages/ui/package.json` (+1, -1)
- `script/kilocode-duplication-allowlist.json` (+0, -12)
- `script/kilocode/setup-linux-sandbox.test.ts` (+133, -0)
- `script/upstream/package.json` (+1, -1)
- `translations/README.ar.md` (+0, -9)
- `translations/README.bn.md` (+0, -9)
- `translations/README.br.md` (+0, -9)
- `translations/README.bs.md` (+0, -9)
- `translations/README.da.md` (+0, -9)
- `translations/README.de.md` (+0, -9)
- `translations/README.es.md` (+0, -9)
- `translations/README.fr.md` (+0, -9)
- `translations/README.gr.md` (+0, -9)
- `translations/README.it.md` (+0, -9)
- `translations/README.ja.md` (+0, -9)
- `translations/README.ko.md` (+0, -9)
- `translations/README.no.md` (+0, -9)
- `translations/README.pl.md` (+0, -9)
- `translations/README.ru.md` (+0, -9)
- `translations/README.th.md` (+0, -9)
- `translations/README.tr.md` (+0, -9)
- `translations/README.uk.md` (+0, -9)
- `translations/README.vi.md` (+0, -9)
- `translations/README.zh.md` (+0, -9)
- `translations/README.zht.md` (+0, -9)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index a82cd99e0..70de232b1 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.7.2",
+  "version": "7.7.3",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```


## opencode Changes (e03db9b..5a83358)

### Commits

- 5a83358 - fix(console): show migrated workspaces in selector (#49520) (opencode-agent[bot], 2026-09-17)
- 88c6c7a - fix(stats): preserve container dependency lock (#49385) (Adam, 2026-09-16)
- a6183af - fix(stats): hide Union Alpha provider (#49356) (opencode-agent[bot], 2026-09-16)
- 2e018f7 - fix(stats): guard oversized model names (#49363) (opencode-agent[bot], 2026-09-16)
- 1364769 - fix(go): label Union Alpha as free (#49353) (Jack, 2026-09-16)
- 350c726 - chore: generate (opencode-agent[bot], 2026-09-16)
- ee91f19 - feat(go): add Union Alpha (#49178) (Jack, 2026-09-16)
- 501ff62 - fix(console): exclude migrated workspaces from selection (#49336) (Victor Navarro, 2026-09-16)

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
- `packages/stats/core/src/domain/inference.test.ts` (+36, -2)
- `packages/stats/core/src/domain/inference.ts` (+7, -2)
- `packages/stats/core/src/domain/model-normalization.ts` (+6, -2)

#### Other Changes
- `packages/console/app/src/component/go-models.ts` (+9, -0)
- `packages/console/app/src/component/limits-graph.css` (+5, -0)
- `packages/console/app/src/component/limits-graph.tsx` (+55, -17)
- `packages/console/app/src/i18n/ar.ts` (+2, -1)
- `packages/console/app/src/i18n/br.ts` (+2, -1)
- `packages/console/app/src/i18n/da.ts` (+2, -1)
- `packages/console/app/src/i18n/de.ts` (+2, -1)
- `packages/console/app/src/i18n/en.ts` (+2, -1)
- `packages/console/app/src/i18n/es.ts` (+2, -1)
- `packages/console/app/src/i18n/fr.ts` (+2, -1)
- `packages/console/app/src/i18n/it.ts` (+2, -1)
- `packages/console/app/src/i18n/ja.ts` (+2, -1)
- `packages/console/app/src/i18n/ko.ts` (+2, -1)
- `packages/console/app/src/i18n/no.ts` (+2, -1)
- `packages/console/app/src/i18n/pl.ts` (+2, -1)
- `packages/console/app/src/i18n/ru.ts` (+2, -1)
- `packages/console/app/src/i18n/th.ts` (+2, -1)
- `packages/console/app/src/i18n/tr.ts` (+2, -1)
- `packages/console/app/src/i18n/uk.ts` (+2, -1)
- `packages/console/app/src/i18n/zh.ts` (+2, -1)
- `packages/console/app/src/i18n/zht.ts` (+2, -1)
- `packages/console/app/src/routes/auth/index.ts` (+6, -0)
- `packages/console/app/src/routes/go/index.tsx` (+2, -1)
- `packages/console/app/src/routes/workspace/[id]/go/lite-section.tsx` (+2, -1)
- `packages/console/app/src/routes/workspace/common.tsx` (+1, -0)
- `packages/stats/server/Dockerfile` (+3, -1)
- `packages/web/src/content/docs/ar/go.mdx` (+5, -0)
- `packages/web/src/content/docs/ar/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/bs/go.mdx` (+5, -0)
- `packages/web/src/content/docs/bs/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/da/go.mdx` (+5, -0)
- `packages/web/src/content/docs/da/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/de/go.mdx` (+5, -0)
- `packages/web/src/content/docs/de/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/es/go.mdx` (+5, -0)
- `packages/web/src/content/docs/es/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/fr/go.mdx` (+5, -0)
- `packages/web/src/content/docs/fr/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/go.mdx` (+5, -0)
- `packages/web/src/content/docs/it/go.mdx` (+43, -38)
- `packages/web/src/content/docs/it/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/ja/go.mdx` (+5, -0)
- `packages/web/src/content/docs/ja/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/ko/go.mdx` (+5, -0)
- `packages/web/src/content/docs/ko/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/nb/go.mdx` (+5, -0)
- `packages/web/src/content/docs/nb/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/pl/go.mdx` (+43, -38)
- `packages/web/src/content/docs/pl/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/pt-br/go.mdx` (+5, -0)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/ru/go.mdx` (+43, -38)
- `packages/web/src/content/docs/ru/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/th/go.mdx` (+5, -0)
- `packages/web/src/content/docs/th/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/tr/go.mdx` (+5, -0)
- `packages/web/src/content/docs/tr/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+5, -0)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+5, -0)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+3, -0)

### Key Diffs

#### packages/stats/core/src/domain/inference.test.ts
```diff
diff --git a/packages/stats/core/src/domain/inference.test.ts b/packages/stats/core/src/domain/inference.test.ts
index 8f6dbea..8f7f437 100644
--- a/packages/stats/core/src/domain/inference.test.ts
+++ b/packages/stats/core/src/domain/inference.test.ts
@@ -57,6 +57,20 @@ describe("inference stat normalization", () => {
     expect(statProvider("unknown", "", "custom-provider")).toBe("custom-provider")
   })
 
+  test("maps oversized model ids to unknown before aggregation", () => {
+    expect(statModel("x".repeat(256), "")).toBe("x".repeat(256))
+    expect(statModel("x".repeat(257), "")).toBe("unknown")
+    expect(statModel("big-pickle", `provider/${"x".repeat(257)}`)).toBe("unknown")
+
+    const [query] = buildStatsQueries(new Date("2026-09-16T00:00:00.000Z"), new Date("2026-09-16T04:00:00.000Z"), {
+      namespace: "inference",
+      table: "generation",
+      dataset: "zen",
+    })
+    expect(query).toContain("WHEN length(")
+    expect(query).toContain(") > 256 THEN 'unknown'")
+  })
+
   test("keeps stealth model usage without exposing the route provider", () => {
     expect(statProvider("omen-alpha", "gpt-test-model", "test-provider")).toBe("unknown")
     expect(statProvider("OMEN-ALPHA-free:global", "gpt-test-model", "test-provider")).toBe("unknown")
@@ -71,6 +85,20 @@ describe("inference stat normalization", () => {
     expect(toRetentionAggregate({ ...row, cohort_date: "2026-08-10", eligible_users: "12" })).toMatchObject([
       { model: "omen-alpha", provider: "unknown", eligibleUsers: 12 },
     ])
+    ;["opencode-go/union-alpha", "opencode/union-alpha"].forEach((model) => {
+      expect(statModel(model, "")).toBe("union-alpha")
+      expect(statProvider(model, "gpt-test-model", "test-provider")).toBe("unknown")
+
+      const row = { ...aggregate(model, "test-provider"), provider_model: "gpt-test-model" }
+      expect(toModelAggregate(row)).toMatchObject([{ model: "union-alpha", provider: "unknown", requests: 1 }])
+      expect(toProviderAggregate(row)).toMatchObject([{ provider: "unknown", requests: 1 }])
+      expect(toGeoAggregate({ ...row, country: "US" })).toMatchObject([
+        { model: "union-alpha", provider: "unknown", country: "US", requests: 1 },
+      ])
+      expect(toRetentionAggregate({ ...row, cohort_date: "2026-08-10", eligible_users: "12" })).toMatchObject([
+        { model: "union-alpha", provider: "unknown", eligibleUsers: 12 },
+      ])
+    })
   })
 
   test("merges renamed models under their current name", () => {
@@ -170,7 +198,9 @@ describe("inference stat normalization", () => {
     expect(queries).toHaveLength(8)
     queries.forEach((query) => {
       expect(query).toContain("WHERE lower(model) NOT IN ('alpha-gpt-next')")
```

#### packages/stats/core/src/domain/inference.ts
```diff
diff --git a/packages/stats/core/src/domain/inference.ts b/packages/stats/core/src/domain/inference.ts
index 2b695e4..9635166 100644
--- a/packages/stats/core/src/domain/inference.ts
+++ b/packages/stats/core/src/domain/inference.ts
@@ -6,6 +6,7 @@ import {
   EXCLUDED_MODELS,
   FREE_MODELS,
   MODEL_AUTHOR_RULES,
+  MODEL_NAME_MAX_LENGTH,
   MODEL_NAME_ALIASES,
   RETIRED_STAT_PROVIDERS,
   STEALTH_MODELS,
@@ -466,12 +467,16 @@ function statModelSql(model: string, providerModel: string) {
       WHEN lower(${model}) = 'big-pickle' THEN regexp_replace(NULLIF(${providerModel}, ''), '^.*/', '')
       ELSE ${model}
     END, '(-free|:free|:global)+$', '')`
-  return `COALESCE(NULLIF(CASE
+  const value = `CASE
 ${Object.entries(MODEL_NAME_ALIASES)
   .map(([from, to]) => `      WHEN lower(${normalized}) = ${sqlString(from)} THEN ${sqlString(to)}`)
   .join("\n")}
       ELSE ${normalized}
-    END, ''), 'unknown')`
+    END`
+  return `CASE
+      WHEN length(${value}) > ${MODEL_NAME_MAX_LENGTH} THEN 'unknown'
+      ELSE COALESCE(NULLIF(${value}, ''), 'unknown')
+    END`
 }
 
 function freeTierSql(tier: string, model: string) {
```

#### packages/stats/core/src/domain/model-normalization.ts
```diff
diff --git a/packages/stats/core/src/domain/model-normalization.ts b/packages/stats/core/src/domain/model-normalization.ts
index 4f0ec06..081cffa 100644
--- a/packages/stats/core/src/domain/model-normalization.ts
+++ b/packages/stats/core/src/domain/model-normalization.ts
@@ -14,12 +14,15 @@ export const MODEL_AUTHOR_RULES = [
   { match: "qwen", author: "qwen" },
 ] as const
 export const EXCLUDED_MODELS = new Set(["alpha-gpt-next"])
-export const STEALTH_MODELS = new Set(["omen-alpha"])
+export const STEALTH_MODELS = new Set(["omen-alpha", "union-alpha"])
 export const FREE_MODELS = new Set(["gpt-5-nano", "grok-code", "big-pickle"])
+export const MODEL_NAME_MAX_LENGTH = 256
 export const MODEL_NAME_ALIASES: Record<string, string> = {
   "deepseek-flash": "deepseek-v4.1-flash",
   "deepseek-v4-flash-0731": "deepseek-v4-flash",
   "deepseek-v4-flash-dsv4-flash-final-rnaovd": "deepseek-v4-flash",
+  "opencode-go/union-alpha": "union-alpha",
+  "opencode/union-alpha": "union-alpha",
   "ox-alpha": "glm-5.3-flash",
   "x-preview-f": "glm-5.3-flash",
   "xiaomi/mimo-v2.5": "mimo-v2.5",
@@ -41,7 +44,8 @@ export function modelAuthor(value: string | undefined) {
 export function statModel(model: string | undefined, providerModel: string | undefined) {
   const normalized = normalizeInferenceModel(model)
   const resolved = normalized === "big-pickle" ? normalizeInferenceModel(providerModel?.split("/").at(-1)) : normalized
-  return MODEL_NAME_ALIASES[resolved.toLowerCase()] ?? resolved
+  const value = MODEL_NAME_ALIASES[resolved.toLowerCase()] ?? resolved
+  return value.length > MODEL_NAME_MAX_LENGTH ? "unknown" : value
 }
 
 export function statProvider(
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/package.json
