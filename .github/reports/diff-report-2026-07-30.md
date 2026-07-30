# Upstream Changes Report
Generated: 2026-07-30 08:27:26

## Summary
- kilocode: 48 commits, 200 files changed
- opencode: 5 commits, 10 files changed

## kilocode Changes (0d853df3e..3b8bd23e1)

### Commits

- 3b8bd23e1 - Merge pull request #12660 from Kilo-Org/docs/agent-manager-tool-manage-sessions (Emilie Lima Schario, 2026-07-29)
- 1b134cef7 - Update Cerebras model IDs (#12620) (Ryan Loney, 2026-07-29)
- af4cb4220 - fix(vscode): persist MCP server toggle state (#12624) (Hardik Sharma, 2026-07-29)
- 592d2418c - Merge pull request #12663 from Kilo-Org/session/agent_31de1956-06ff-4839-b349-1d973a7cd5bb (Emilie Lima Schario, 2026-07-29)
- d7c6d0acc - Merge pull request #12667 from Kilo-Org/docs/mobile-app-new-features (Emilie Lima Schario, 2026-07-29)
- 969ca6010 - Merge pull request #12668 from Kilo-Org/docs/jetbrains-settings (Emilie Lima Schario, 2026-07-29)
- 485727c4a - Merge pull request #12669 from Kilo-Org/session/agent_d1b1af85-0b40-4a60-b868-22bc0fd1c90c (Emilie Lima Schario, 2026-07-29)
- cced1fdd0 - docs(kilo-docs): update auto-approve settings documentation (emilieschario, 2026-07-29)
- 8b6bc1551 - docs(kilo-docs): document JetBrains plugin settings (emilieschario, 2026-07-29)
- 1c1f17f07 - docs: document mobile app remote sessions, PR review, and session cost (emilieschario, 2026-07-29)
- a76aea718 - Merge pull request #12661 from Kilo-Org/session/agent_5049bc3a-0abb-4232-a891-e10de4908e98 (Emilie Lima Schario, 2026-07-29)
- 95b2bdced - Merge pull request #12662 from Kilo-Org/docs/past-chats-context-mention (Joshua Lambert, 2026-07-29)
- 626543695 - docs(checkpoints): document revert banner warnings and snapshot restoration (emilieschario, 2026-07-29)
- 558cfeefb - Merge pull request #12608 from hdcodedev/chore/jetbrains-centralize-test-dependency-versions (Kirill Kalishev, 2026-07-29)
- 771e8097f - docs(kilo-docs): add documentation for referencing past chats via @ mentions (emilieschario, 2026-07-29)
- dc8def241 - docs(docs): add keyboard shortcut for reasoning effort variants (emilieschario, 2026-07-29)
- 13a4a5c4c - docs(agent-manager): document session overview, prompt, and stop (emilieschario, 2026-07-29)
- d57977496 - fix(ci): docs-sync bot passes --auto, drains its backlog, and reports readable causes; fix(cli): honest exit codes for headless runs (#12605) (Igor Šćekić, 2026-07-29)
- 5e5751701 - Merge branch 'main' into chore/jetbrains-centralize-test-dependency-versions (hdcode.dev, 2026-07-29)
- dbcd5825d - fix(agent-manager): keep terminal cursor visible (#12658) (Marius, 2026-07-29)
- d6380b246 - feat(vscode): add Persian (Farsi) UI language (#12424) (Babak S, 2026-07-29)
- bba2dba0a - refactor(vscode): deduplicate config snapshots (#12650) (Marius, 2026-07-29)
- 21d96806a - refactor(agent-manager): consolidate import transaction (#12651) (Marius, 2026-07-29)
- efe3f6282 - refactor(vscode): share webview provider shell (#12648) (Marius, 2026-07-29)
- 32fd1c976 - Merge pull request #12641 from Kilo-Org/fluttering-belt (Christiaan Arnoldus, 2026-07-29)
- 5ad8b2f12 - fix(cli): promote stable releases to rc (#12647) (Marius, 2026-07-29)
- af4bd4d35 - Merge branch 'main' into fluttering-belt (Christiaan Arnoldus, 2026-07-29)
- a0364858a - release: v7.4.17 (kilo-maintainer[bot], 2026-07-29)
- e4fcb061b - Merge pull request #12639 from Kilo-Org/fix-premature-stop-warning-flicker (Marius, 2026-07-29)
- a89132962 - refactor(telemetry): preserve event property precedence (Christiaan Arnoldus, 2026-07-29)
- 304c75e60 - feat(telemetry): include host OS properties (Christiaan Arnoldus, 2026-07-29)
- 26dac197f - feat(i18n): mention @ file references in chat input placeholder (#11984) (sylwester-liljegren, 2026-07-29)
- 8a47d8b78 - fix(vscode): stop flashing interruption warning on queued follow-up handoff (marius-kilocode, 2026-07-29)
- 92076e707 - feat(tui): register `/auto-approve` slash command for toggling auto-approve mode (#12444) (Aarav, 2026-07-29)
- 26a96b3c4 - Merge pull request #12601 from Kilo-Org/fix/exclude-gpt-5-6-chatgpt (Christiaan Arnoldus, 2026-07-29)
- 2bc500bbc - Merge pull request #12635 from Kilo-Org/refactor-worktree-terminal-namespace (Marius, 2026-07-29)
- 0abe474b6 - feat(tui): make Context sidebar section collapsible (#11986) (Aarav, 2026-07-29)
- 4c5c24289 - feat(agent-manager): show worktree name on hover card (#12634) (Marius, 2026-07-29)
- b094be072 - Merge branch 'main' into fix/exclude-gpt-5-6-chatgpt (Christiaan Arnoldus, 2026-07-29)
- 23039c0fb - feat(agent-manager): support multiple side-panel terminals (#12633) (Marius, 2026-07-29)
- 1dba24621 - Merge branch 'main' into refactor-worktree-terminal-namespace (Marius, 2026-07-29)
- 4e83fb30d - refactor(vscode): extract apply-to-local and worktree diff workflows out of AgentManagerApp (#12636) (Marius, 2026-07-29)
- 9f528a231 - refactor(agent-manager): namespace terminal keys (marius-kilocode, 2026-07-29)
- 782b85d21 - Merge branch 'main' into fix/exclude-gpt-5-6-chatgpt (Christiaan Arnoldus, 2026-07-29)
- 0850e4504 - Merge branch 'main' into chore/jetbrains-centralize-test-dependency-versions (hdcode.dev, 2026-07-29)
- 7041ab640 - chore(jetbrains): centralize test dependency versions (HDCode, 2026-07-28)
- 9203f47f2 - Merge branch 'main' into fix/exclude-gpt-5-6-chatgpt (Christiaan Arnoldus, 2026-07-28)
- dab2e79d6 - fix(cli): exclude gpt-5.6 from ChatGPT subscriptions (Christiaan Arnoldus, 2026-07-28)

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
- `.changeset/adaptive-opus-five.md` (+0, -5)
- `.changeset/agent-manager-modifier-shortcut-peek.md` (+0, -5)
- `.changeset/agent-manager-side-terminal.md` (+0, -5)
- `.changeset/agent-manager-terminal-destination-consistency.md` (+0, -5)
- `.changeset/atomic-session-revert.md` (+0, -6)
- `.changeset/calm-cursors-fit.md` (+5, -0)
- `.changeset/console-headless-credentials.md` (+0, -5)
- `.changeset/fast-agent-manager-terminals.md` (+0, -5)
- `.changeset/fix-nix-bun-pin.md` (+0, -5)
- `.changeset/fix-scoped-mode-cycling.md` (+0, -5)
- `.changeset/fix-vscode-settings-save.md` (+0, -5)
- `.changeset/fresh-rc-upgrades.md` (+5, -0)
- `.changeset/fuzzy-pandas-listen.md` (+5, -0)
- `.changeset/fuzzy-tildes-smile.md` (+0, -5)
- `.changeset/headless-run-honest-exit.md` (+13, -0)
- `.changeset/ingest-shutdown-flush.md` (+0, -5)
- `.changeset/instant-prompt-tooltips.md` (+0, -5)
- `.changeset/jetbrains-bundled-cli.md` (+0, -5)
- `.changeset/jetbrains-queued-prompts.md` (+0, -5)
- `.changeset/kilo-exa-websearch.md` (+0, -5)
- `.changeset/opencode-v1-17-5-to-v1-17-9.md` (+0, -30)
- `.changeset/persian-language.md` (+5, -0)
- `.changeset/prompt-rail.md` (+0, -5)
- `.changeset/pwsh-permission-fail-closed.md` (+0, -5)
- `.changeset/quiet-json-events.md` (+0, -5)
- `.changeset/quiet-vscode-watchers.md` (+0, -6)
- `.changeset/reliable-vscode-message-copy.md` (+0, -5)
- `.changeset/safe-windows-snapshot-diffs.md` (+0, -6)
- `.changeset/stalled-provider-first-byte.md` (+0, -5)
- `.changeset/steady-cli-subprocess-tests.md` (+0, -5)
- `.changeset/steady-editor-tabs.md` (+0, -5)
- `.changeset/tidy-am-i18n-keys.md` (+0, -5)
- `.changeset/tidy-mice-report.md` (+5, -0)
- `.changeset/tui-variant-shortcut-hint.md` (+0, -5)
- `.github/docs-sync/edit.mjs` (+6, -1)
- `.github/docs-sync/lib.mjs` (+62, -4)
- `.github/docs-sync/redact-stream.mjs` (+25, -0)
- `.github/docs-sync/selftest.mjs` (+501, -17)
- `.github/docs-sync/triage.mjs` (+6, -1)
- `.github/workflows/docs-sync.yml` (+27, -4)
- `bun.lock` (+35, -35)
- `package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/ai-providers/cerebras.md` (+1, -1)
- `packages/kilo-docs/pages/automate/agent-manager.md` (+3, -1)
- `packages/kilo-docs/pages/code-with-ai/agents/context-mentions.md` (+8, -0)
- `packages/kilo-docs/pages/code-with-ai/agents/model-selection.md` (+1, -0)
- `packages/kilo-docs/pages/code-with-ai/features/checkpoints.md` (+9, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/jetbrains.md` (+8, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/mobile.md` (+41, -0)
- `packages/kilo-docs/pages/getting-started/settings/auto-approving-actions.md` (+1, -1)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/CHANGELOG.md` (+12, -0)
- `packages/kilo-jetbrains/frontend/build.gradle.kts` (+2, -2)
- `packages/kilo-jetbrains/gradle/libs.versions.toml` (+6, -1)
- `packages/kilo-memory/package.json` (+1, -1)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-telemetry/src/__tests__/telemetry.test.ts` (+19, -2)
- `packages/kilo-telemetry/src/telemetry.ts` (+10, -0)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-vscode/CHANGELOG.md` (+73, -0)
- `packages/kilo-vscode/eslint.config.mjs` (+7, -11)
- `packages/kilo-vscode/package.json` (+9, -5)
- `packages/kilo-vscode/src/KiloProvider.ts` (+15, -63)
- `packages/kilo-vscode/src/agent-manager/SessionTerminalManager.ts` (+40, -25)
- `packages/kilo-vscode/src/agent-manager/terminal-manager.ts` (+10, -0)
- `packages/kilo-vscode/src/agent-manager/terminal-routing.ts` (+41, -7)
- `packages/kilo-vscode/src/agent-manager/worktree-importer.ts` (+22, -74)
- `packages/kilo-vscode/src/kilo-provider-utils.ts` (+1, -1)
- `packages/kilo-vscode/src/kilo-provider/config-snapshot.ts` (+21, -0)
- `packages/kilo-vscode/src/services/cli-backend/i18n/fa.ts` (+6, -0)
- `packages/kilo-vscode/src/services/cli-backend/i18n/index.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/autocomplete/fa.ts` (+27, -0)
- `packages/kilo-vscode/src/services/i18n/fa.ts` (+7, -0)
- `packages/kilo-vscode/src/services/i18n/index.ts` (+2, -0)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/unit/agent-behaviour-patches.test.ts` (+41, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+119, -65)
- `packages/kilo-vscode/tests/unit/agent-manager-i18n-split.test.ts` (+2, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-terminal-layout.test.ts` (+15, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-terminal-routing.test.ts` (+129, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-terminal-side.test.ts` (+18, -15)
- `packages/kilo-vscode/tests/unit/agent-manager-terminal-state.test.ts` (+165, -47)
- `packages/kilo-vscode/tests/unit/agent-manager-worktree-diffs.test.ts` (+103, -0)
- `packages/kilo-vscode/tests/unit/i18n-keys.test.ts` (+6, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-indexing-refresh.test.ts` (+32, -5)
- `packages/kilo-vscode/tests/unit/language-utils.test.ts` (+5, -0)
- `packages/kilo-vscode/tests/unit/session-outcome.test.ts` (+7, -0)
- `packages/kilo-vscode/tests/unit/session-terminal-manager.test.ts` (+15, -3)
- `packages/kilo-vscode/tests/visual-regression.spec.mts` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+50, -391)
- `packages/kilo-vscode/webview-ui/agent-manager/WorktreeItem.tsx` (+12, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+57, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/apply-to-local.tsx` (+285, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fa.ts` (+207, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fr.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/it.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ja.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ko.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/nl.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/no.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/pl.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ru.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/th.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/tr.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/uk.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zh.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zht.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/SideTerminalPanel.tsx` (+107, -21)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/SortableTerminalTab.tsx` (+85, -49)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/TerminalTab.tsx` (+10, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/render.tsx` (+12, -4)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/side.ts` (+11, -9)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/state.ts` (+186, -69)
- `packages/kilo-vscode/webview-ui/agent-manager/worktree-diffs.ts` (+118, -0)
- `packages/kilo-vscode/webview-ui/kiloclaw/context/language.tsx` (+2, -0)
- `packages/kilo-vscode/webview-ui/kiloclaw/i18n/fa.ts` (+95, -0)
- `packages/kilo-vscode/webview-ui/src/App.tsx` (+18, -97)
- `packages/kilo-vscode/webview-ui/src/components/chat/QuestionDock.tsx` (+16, -6)
- `packages/kilo-vscode/webview-ui/src/components/chat/SuggestBar.tsx` (+3, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/TabDnd.tsx` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/components/settings/AgentBehaviourTab.tsx` (+11, -6)
- `packages/kilo-vscode/webview-ui/src/components/settings/agent-behaviour-patches.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/src/context/config.tsx` (+10, -1)
- `packages/kilo-vscode/webview-ui/src/context/language-utils.ts` (+3, -1)
- `packages/kilo-vscode/webview-ui/src/context/language.tsx` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/context/provider-shell.tsx` (+96, -0)
- `packages/kilo-vscode/webview-ui/src/context/session-outcome.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+1288, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/stories/agent-manager.stories.tsx` (+44, -3)
- `packages/kilo-vscode/webview-ui/src/styles/question-dock.css` (+3, -2)
- `packages/kilo-vscode/webview-ui/src/types/messages/config.ts` (+9, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+10, -1)
- `packages/kilo-vscode/webview-ui/src/types/messages/sessions.ts` (+1, -1)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+59, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/script/kilocode/npm-publish.ts` (+4, -0)
- `packages/opencode/script/publish.ts` (+13, -10)
- `packages/opencode/src/cli/cmd/run.ts` (+14, -1)
- `packages/opencode/src/kilocode/cli/cmd/tui/app.tsx` (+3, -0)
- `packages/opencode/src/kilocode/memory/turn.ts` (+3, -1)
- `packages/opencode/src/kilocode/session/event.ts` (+4, -1)
- `packages/opencode/src/plugin/openai/codex.ts` (+1, -1)
- `packages/opencode/src/session/prompt.ts` (+4, -2)
- `packages/opencode/test/cli/run/run-process.test.ts` (+66, -9)
- `packages/opencode/test/kilocode/npm-publish.test.ts` (+10, -0)
- `packages/opencode/test/kilocode/session-prompt-queue.test.ts` (+90, -0)
- `packages/opencode/test/plugin/codex.test.ts` (+10, -0)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+1, -1)
- `packages/sdk/openapi.json` (+144, -106)
- `packages/server/package.json` (+1, -1)
- `packages/storybook/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/tui/src/feature-plugins/sidebar/context.tsx` (+23, -7)
- `packages/ui/package.json` (+1, -1)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index ddb4d33d3..e64a66062 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.4.16",
+  "version": "7.4.17",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```


## opencode Changes (7565e03..f720490)

### Commits

- f720490 - fix(console): add public fetch compatibility flag (Frank, 2026-07-30)
- 341c64c - feat: discover Modal models (#39066) (Deven Navani, 2026-07-29)
- 1e17856 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-29)
- a6f7fe7 - docs(ecosystem): add opencode-tavily plugin (#38709) (Lakshya Agarwal, 2026-07-29)
- 02f50a6 - chore: bump gitlab-ai-provider to 6.12.1 (#39490) (Vladimir Glafirov, 2026-07-29)

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
- `bun.lock` (+3, -3)
- `infra/console.ts` (+6, -2)
- `nix/hashes.json` (+4, -4)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/plugin/index.ts` (+2, -0)
- `packages/opencode/src/plugin/modal/modal.ts` (+17, -0)
- `packages/opencode/src/plugin/modal/models.ts` (+133, -0)
- `packages/opencode/test/plugin/modal-models.test.ts` (+198, -0)
- `packages/web/src/content/docs/ecosystem.mdx` (+1, -0)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 2325bcc..cc1f5d6 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -108,7 +108,7 @@
     "drizzle-orm": "catalog:",
     "effect": "catalog:",
     "fuzzysort": "3.1.0",
-    "gitlab-ai-provider": "6.12.0",
+    "gitlab-ai-provider": "6.12.1",
     "glob": "13.0.5",
     "google-auth-library": "10.5.0",
     "gray-matter": "4.0.3",
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/package.json
