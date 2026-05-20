# Upstream Changes Report
Generated: 2026-05-20 09:35:46

## Summary
- kilocode: 61 commits, 107 files changed
- opencode: 41 commits, 250 files changed

## kilocode Changes (4c0e6987b..39affcc14)

### Commits

- 39affcc14 - ci: skip jetbrains tests (#10433) (Imanol Maiztegui, 2026-05-20)
- 95a5fa5c5 - Merge pull request #10411 from reeceshuttle/update-mercury-edit-2 (Mark IJbema, 2026-05-20)
- 8537e85d8 - chore: update model to mercury-edit-2 (Reece Shuttleworth, 2026-05-19)
- 6f3725803 - Merge pull request #10304 from baco/update-ascii-logo (Catriel Müller, 2026-05-19)
- fbbeb3c7a - fix: fix flaky test (Catriel Müller, 2026-05-19)
- 72a5a84f8 - Merge branch 'main' into update-ascii-logo (Catriel Müller, 2026-05-19)
- ba09fa8f0 - refactor: unify kilo logos (Catriel Müller, 2026-05-19)
- 62f492de3 - fix: fix shadows (Catriel Müller, 2026-05-19)
- a92e6e508 - refactor: safe render on ssh (Catriel Müller, 2026-05-19)
- 739564535 - refactor: fallback support (Catriel Müller, 2026-05-19)
- db7518806 - refactor: fix logo shadows (Catriel Müller, 2026-05-19)
- 86342e373 - ci: exclude jetbrains from root typecheck (#10397) (Imanol Maiztegui, 2026-05-19)
- 9b3e1818c - Merge pull request #10288 from Kilo-Org/stylish-bloom (Marius, 2026-05-19)
- cce24c238 - Merge pull request #10221 from Kilo-Org/striped-patch (Kirill Kalishev, 2026-05-19)
- f6bb9972e - release: v7.3.1 (kilo-maintainer[bot], 2026-05-19)
- 046567eda - Merge pull request #10377 from mjnaderi/patch-1 (Marius, 2026-05-19)
- 6cdfe6802 - Merge remote-tracking branch 'origin/main' into stylish-bloom (marius-kilocode, 2026-05-19)
- 7f0685a78 - Merge branch 'main' into striped-patch (Kirill Kalishev, 2026-05-19)
- b44fd2d73 - Merge pull request #10322 from Kilo-Org/rainbow-hotel (Kirill Kalishev, 2026-05-19)
- d966bf55e - Merge branch 'main' into rainbow-hotel (Kirill Kalishev, 2026-05-19)
- 86585a341 - fix(vscode): add missing ProviderProvider and ConfigProvider to DiffViewerApp (#10389) (kilo-code-bot[bot], 2026-05-19)
- d8163c895 - docs: update KiloClaw pricing post-beta (#10295) (Aarav, 2026-05-19)
- 7c8817a33 - Merge pull request #10382 from Kilo-Org/mark/collapsible-model-picker-sections (Mark IJbema, 2026-05-19)
- 522c5b50a - feat(vscode): show match dot on collapsed model picker groups during search (kiloconnect[bot], 2026-05-19)
- 24454bf79 - fix(vscode): honor collapse state during model picker search (Mark IJbema, 2026-05-19)
- 6ce2ded75 - feat(vscode): make model picker sections collapsible (kiloconnect[bot], 2026-05-19)
- 6392a88bc - Fix misplaced section in AGENTS.md (Mohammad Javad Naderi, 2026-05-19)
- 5c74c819c - docs(jetbrains): reorganize AGENTS.md for logical grouping and deduplication (kirillk, 2026-05-18)
- b5be9977e - test(jetbrains): stabilize history timezone assertions (kirillk, 2026-05-18)
- 23e48c0fb - test(jetbrains): stabilize backend loading state test (kirillk, 2026-05-18)
- eeca40407 - docs(jetbrains): consolidate agent guidance (kirillk, 2026-05-18)
- d37cdd61f - fix(jetbrains): serialize history deletes (kirillk, 2026-05-18)
- 1c5931552 - chore: ignore .secrets directory (kirillk, 2026-05-18)
- 215421433 - refactor(jetbrains): extract QuestionResultParser and add unit tests (kirillk, 2026-05-18)
- 2ef26e44d - Merge remote-tracking branch 'origin/main' into striped-patch (kirillk, 2026-05-18)
- 4cd17dcc5 - fix(jetbrains): ignore stale workspace reloads (kirillk, 2026-05-18)
- 18fbc4298 - chore: remove plan from question parity PR (kirillk, 2026-05-18)
- 44942c1f6 - test(jetbrains): snapshot captured log messages (kirillk, 2026-05-18)
- 1bae6adfe - Merge remote-tracking branch 'origin/rainbow-hotel' into rainbow-hotel (kirillk, 2026-05-18)
- 6b5952694 - fix(jetbrains): prevent empty question replies (kirillk, 2026-05-18)
- 32b3a43fd - Merge branch 'main' into rainbow-hotel (Kirill Kalishev, 2026-05-18)
- 59e680ffe - Merge remote-tracking branch 'origin/main' into rainbow-hotel (kirillk, 2026-05-18)
- 9164f42c4 - refactor(jetbrains): organize question views (kirillk, 2026-05-18)
- 7b0b12375 - fix(jetbrains): collapse answered-question card by default (kirillk, 2026-05-18)
- 276276bbc - feat(jetbrains): add review step and answered-question card for question tool parity (kirillk, 2026-05-18)
- 5051a595f - feat(jetbrains): hide active question tool row in transcript for parity with VS Code (kirillk, 2026-05-18)
- 7437ec03a - docs(jetbrains): plan question tool parity (kirillk, 2026-05-18)
- ad982ba51 - fix(jetbrains): align question prompt layout (kirillk, 2026-05-18)
- 4ffcfabe1 - feat(jetbrains): show questions one at a time with radio/checkbox rows (kirillk, 2026-05-18)
- ae31cf218 - feat(jetbrains): render question/permission prompts in scrollable transcript (kirillk, 2026-05-17)
- e83c804fc - Merge remote-tracking branch 'origin/main' into rainbow-hotel (kirillk, 2026-05-17)
- eac749c46 - feat(tui): update ascii style to mimic company's logo (Dionisio E Alonso, 2026-05-15)
- 853736f1f - style(vscode): format history search focus (marius-kilocode, 2026-05-15)
- d19294922 - test(vscode): isolate markdown annotation mutation helper (marius-kilocode, 2026-05-15)
- e5bc6f096 - Merge remote-tracking branch 'origin/main' into stylish-bloom (marius-kilocode, 2026-05-15)
- 889d56758 - fix(vscode): focus session history search (marius-kilocode, 2026-05-15)
- 5492b905a - Merge remote-tracking branch 'origin/main' into rainbow-hotel (kirillk, 2026-05-13)
- 092757556 - Merge remote-tracking branch 'origin/main' into striped-patch (kirillk, 2026-05-13)
- 4174c0f92 - docs(kilo-jetbrains): add threading and coroutine context annotations section to skill guide (kirillk, 2026-05-13)
- 4bfa644e0 - test(vscode): assert question replies as compact strings (kirillk, 2026-05-09)
- 93e7cb1e2 - feat(vscode): support multi-question prompts in QuestionPanel and add controller stream test (kirillk, 2026-05-09)

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
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/templating/AutocompleteTemplate.ts` (+1, -1)

#### Other Changes
- `.changeset/agent-manager-prompt-picker.md` (+0, -5)
- `.changeset/bright-searches-count.md` (+0, -5)
- `.changeset/clever-networks-resume.md` (+0, -5)
- `.changeset/continue-worktree-sessions.md` (+0, -5)
- `.changeset/focused-sessions-find.md` (+5, -0)
- `.changeset/inline-review-speech.md` (+0, -5)
- `.changeset/jetbrains-question-carousel.md` (+5, -0)
- `.changeset/jetbrains-scrollable-prompts.md` (+5, -0)
- `.changeset/markdown-review-voice.md` (+0, -5)
- `.changeset/mermaid-security-fixes.md` (+0, -6)
- `.changeset/shiny-sessions-export.md` (+0, -5)
- `.changeset/smart-views-restore.md` (+0, -5)
- `.changeset/swift-voices-send.md` (+0, -5)
- `.github/workflows/test.yml` (+1, -1)
- `.gitignore` (+1, -0)
- `AGENTS.md` (+12, -13)
- `bun.lock` (+14, -14)
- `install` (+39, -3)
- `package.json` (+2, -2)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/features/autocomplete/index.md` (+3, -3)
- `packages/kilo-docs/pages/kiloclaw/faq/pricing.md` (+1, -1)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/.kilo/skills/jetbrains-ui-style/SKILL.md` (+0, -1335)
- `packages/kilo-jetbrains/AGENTS.md` (+404, -598)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/workspace/KiloBackendWorkspace.kt` (+5, -1)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendAppServiceTest.kt` (+16, -15)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/MockCliServer.kt` (+4, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/TestLog.kt` (+7, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+14, -29)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/history/HistoryController.kt` (+4, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/Message.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/SessionModel.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/PermissionPanel.kt` (+0, -83)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/QuestionPanel.kt` (+0, -92)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanel.kt` (+66, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/style/SessionUiStyle.kt` (+1, -11)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/MessageView.kt` (+72, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/PermissionView.kt` (+100, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/ViewFactory.kt` (+14, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/question/QuestionResultParser.kt` (+44, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/question/QuestionResultView.kt` (+281, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/question/QuestionView.kt` (+471, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+11, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionUiLayoutTest.kt` (+60, -24)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/JsonSessionStreamTest.kt` (+124, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/SessionControllerTestBase.kt` (+10, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/history/HistoryControllerTest.kt` (+3, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/PermissionPanelTest.kt` (+0, -115)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/QuestionPanelTest.kt` (+0, -134)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanelTest.kt` (+206, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/PermissionViewTest.kt` (+74, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/QuestionResultViewTest.kt` (+223, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/QuestionViewTest.kt` (+521, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/question/QuestionResultParserTest.kt` (+155, -0)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-vscode/CHANGELOG.md` (+22, -0)
- `packages/kilo-vscode/package.json` (+3, -3)
- `packages/kilo-vscode/src/services/autocomplete/__tests__/settings.spec.ts` (+10, -3)
- `packages/kilo-vscode/src/services/autocomplete/classic-auto-complete/__tests__/uselessSuggestionFilter.test.ts` (+1, -1)
- `packages/kilo-vscode/src/shared/autocomplete-models.ts` (+11, -3)
- `packages/kilo-vscode/webview-ui/diff-viewer/DiffViewerApp.tsx` (+7, -1)
- `packages/kilo-vscode/webview-ui/src/components/history/CloudSessionList.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/components/history/HistoryView.tsx` (+17, -2)
- `packages/kilo-vscode/webview-ui/src/components/history/SessionList.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelSelector.tsx` (+135, -89)
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
- `packages/kilo-vscode/webview-ui/src/styles/model-selector.css` (+37, -0)
- `packages/opencode/CHANGELOG.md` (+10, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/component/kilo-logo.tsx` (+3, -8)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+4, -10)
- `packages/opencode/src/cli/logo.ts` (+3, -5)
- `packages/opencode/src/cli/ui.ts` (+4, -6)
- `packages/opencode/src/kilocode/cli/logo.ts` (+86, -0)
- `packages/opencode/test/kilocode/logo.test.ts` (+32, -0)
- `packages/opencode/test/session/prompt.test.ts` (+27, -3)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 9f1fd76ff..e592447cd 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.3.0",
+  "version": "7.3.1",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/templating/AutocompleteTemplate.ts
```diff
diff --git a/packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/templating/AutocompleteTemplate.ts b/packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/templating/AutocompleteTemplate.ts
index 93c4de15e..229fdbf5e 100644
--- a/packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/templating/AutocompleteTemplate.ts
+++ b/packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/templating/AutocompleteTemplate.ts
@@ -1,6 +1,6 @@
 // Fill in the middle prompts
 //
-// We only expose Codestral and Mercury Edit as autocomplete models — every
+// We only expose Codestral and Mercury Edit 2 as autocomplete models — every
 // other FIM template in the upstream continuedev list is unreachable.
 
 import { CompletionOptions } from "../../index.js"
```


## opencode Changes (2339aac..13006d6)

### Commits

- 13006d6 - chore: generate (opencode-agent[bot], 2026-05-20)
- 539b118 - run: add shell mode to prompt (#28315) (Simon Klee, 2026-05-20)
- 11f7e5a - chore: generate (opencode-agent[bot], 2026-05-20)
- 38b406f - app: Initial tabs impl (#28436) (Brendan Allan, 2026-05-20)
- 4702cdd - chore: generate (opencode-agent[bot], 2026-05-20)
- 82c5d45 - Add Windows desktop app menu (#28420) (Luke Parker, 2026-05-20)
- 66d409d - fix(opencode): Update directory and path fields of imported session (#27516) (OpeOginni, 2026-05-19)
- 4ad261d - Skip git setup for processor tool test (#28406) (Kit Langton, 2026-05-19)
- 59c99dc - Skip snapshot seed file commits (#28405) (Kit Langton, 2026-05-19)
- a8f7c5e - Run CLI subprocess tests concurrently (#28399) (Kit Langton, 2026-05-19)
- 34cae2f - fix(action): remove orphan symlink breaking GitHub Action staging (#28390) (Kit Langton, 2026-05-19)
- e94d46a - fix(config): resolve agent/command names from relative paths (#28359) (Kit Langton, 2026-05-19)
- c035c35 - fix(config): tolerate invalid OPENCODE_PERMISSION JSON (#28388) (Kit Langton, 2026-05-19)
- b70b459 - Skip LLM server for prompt tests without LLM calls (#28391) (Kit Langton, 2026-05-19)
- e3c8d22 - chore: generate (opencode-agent[bot], 2026-05-19)
- 80e5fb1 - refactor(test/cli): migrate harness short-lived path to AppProcess + FileSystem (#28366) (Kit Langton, 2026-05-19)
- bc6c4c7 - chore(triage): add 'starptech' to core and inference teams (#28376) (Dustin Deus, 2026-05-19)
- 4db2746 - Reduce snapshot batch test fixture sizes (#28381) (Kit Langton, 2026-05-19)
- 71e9007 - chore: generate (opencode-agent[bot], 2026-05-19)
- ea27114 - go: update referral invite ui style (Frank, 2026-05-19)
- 64d67f2 - sync (Frank, 2026-05-19)
- a99337f - chore: generate (opencode-agent[bot], 2026-05-19)
- b20b569 - chore(go): referral improvements (#28368) (Victor Navarro, 2026-05-19)
- c449d3d - Migrate remaining legacy tools config tests (#28363) (Kit Langton, 2026-05-19)
- e4eb98b - chore: generate (opencode-agent[bot], 2026-05-19)
- b32f071 - feat(go): referral support (#28345) (Victor Navarro, 2026-05-19)
- 512e34a - Migrate MCP config tests to instance fixtures (#28338) (Kit Langton, 2026-05-19)
- 7051796 - test(cli): tier-A read-only command smoke tests (#28274) (Kit Langton, 2026-05-19)
- b67f5d7 - test(opencode/run): skip Windows-only scrollback replay failure (#28261) (Kit Langton, 2026-05-19)
- eec0843 - chore: generate (opencode-agent[bot], 2026-05-19)
- 55baa16 - test(lib): extract snapshot normalizer utility for cross-OS stability (#28356) (Kit Langton, 2026-05-19)
- c79a963 - fix(tool): tolerate plugin tool defs with missing args (#28357) (Kit Langton, 2026-05-19)
- 8dd6448 - use keymap state for layer visibility (#26246) (Sebastian, 2026-05-19)
- 18b9cec - test(cli): help-text snapshots for every CLI command (#28267) (Kit Langton, 2026-05-19)
- 2932a7a - fix(app): invalidate provider queries after config update to show custom providers immediately (#28313) (Shawn, 2026-05-19)
- 922b2e1 - refactor(app): remove Accessor wrapping from timeline row renders (#28334) (Brendan Allan, 2026-05-19)
- a2ee437 - chore: generate (opencode-agent[bot], 2026-05-19)
- 6618e2b - feat(native-llm): route Anthropic API-key models through native runtime (#28271) (Kit Langton, 2026-05-19)
- cb15b3a - test(cli): subprocess integration tests for opencode acp (#28265) (Kit Langton, 2026-05-19)
- ee16f08 - Fix legacy pgup/pgdown TUI keybind aliases (#28275) (Sebastian, 2026-05-19)
- 9790a61 - chore(docs): remove beta zen go (#28317) (Dustin Deus, 2026-05-19)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `.opencode/tool/github-triage.ts` (+2, -2)
- `packages/opencode/src/tool/registry.ts` (+5, -2)
- `packages/opencode/test/tool/registry.test.ts` (+90, -5)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/console/core/migrations/20260513173355_groovy_jane_foster/migration.sql` (+47, -0)
- `packages/console/core/migrations/20260513173355_groovy_jane_foster/snapshot.json` (+3229, -0)
- `packages/console/core/migrations/20260516082200_long_spirit/migration.sql` (+20, -0)
- `packages/console/core/migrations/20260516082200_long_spirit/snapshot.json` (+3063, -0)
- `packages/console/core/migrations/20260516110447_classy_wilson_fisk/migration.sql` (+4, -0)
- `packages/console/core/migrations/20260516110447_classy_wilson_fisk/snapshot.json` (+3029, -0)
- `packages/console/core/migrations/20260516112143_cynical_dexter_bennett/migration.sql` (+3, -0)
- `packages/console/core/migrations/20260516112143_cynical_dexter_bennett/snapshot.json` (+3013, -0)
- `packages/console/core/migrations/20260516222132_referral_code_length/migration.sql` (+2, -0)
- `packages/console/core/migrations/20260516222132_referral_code_length/snapshot.json` (+3013, -0)
- `packages/console/core/migrations/20260518181630_secret_strong_guy/migration.sql` (+2, -0)
- `packages/console/core/migrations/20260518181630_secret_strong_guy/snapshot.json` (+3013, -0)
- `packages/console/core/src/billing.ts` (+20, -0)
- `packages/console/core/src/identifier.ts` (+1, -0)
- `packages/console/core/src/referral.ts` (+398, -0)
- `packages/console/core/src/schema/referral.sql.ts` (+25, -0)
- `packages/console/core/src/schema/workspace.sql.ts` (+2, -1)
- `packages/core/src/flag/flag.ts` (+3, -1)

#### Other Changes
- `packages/app/package.json` (+1, -0)
- `packages/app/src/components/titlebar.tsx` (+363, -139)
- `packages/app/src/components/windows-app-menu.tsx` (+111, -0)
- `packages/app/src/context/directory-sync.ts` (+596, -0)
- `packages/app/src/context/global-sync.tsx` (+31, -1)
- `packages/app/src/context/platform.tsx` (+4, -0)
- `packages/app/src/context/sync.tsx` (+1, -454)
- `packages/app/src/desktop-menu.ts` (+221, -0)
- `packages/app/src/index.css` (+58, -0)
- `packages/app/src/pages/directory-layout.tsx` (+11, -1)
- `packages/app/src/pages/session/message-timeline.tsx` (+41, -67)
- `packages/console/app/src/component/go-referral.css` (+289, -0)
- `packages/console/app/src/component/go-referral.tsx` (+300, -0)
- `packages/console/app/src/component/modal.css` (+67, -0)
- `packages/console/app/src/component/modal.tsx` (+30, -8)
- `packages/console/app/src/i18n/ar.ts` (+33, -0)
- `packages/console/app/src/i18n/br.ts` (+34, -0)
- `packages/console/app/src/i18n/da.ts` (+33, -0)
- `packages/console/app/src/i18n/de.ts` (+35, -0)
- `packages/console/app/src/i18n/en.ts` (+33, -0)
- `packages/console/app/src/i18n/es.ts` (+34, -0)
- `packages/console/app/src/i18n/fr.ts` (+35, -0)
- `packages/console/app/src/i18n/it.ts` (+34, -0)
- `packages/console/app/src/i18n/ja.ts` (+33, -0)
- `packages/console/app/src/i18n/ko.ts` (+33, -0)
- `packages/console/app/src/i18n/no.ts` (+33, -0)
- `packages/console/app/src/i18n/pl.ts` (+33, -0)
- `packages/console/app/src/i18n/ru.ts` (+35, -0)
- `packages/console/app/src/i18n/th.ts` (+33, -0)
- `packages/console/app/src/i18n/tr.ts` (+34, -0)
- `packages/console/app/src/i18n/zh.ts` (+33, -0)
- `packages/console/app/src/i18n/zht.ts` (+33, -0)
- `packages/console/app/src/lib/format-reset-time.ts` (+47, -0)
- `packages/console/app/src/lib/referral-invite.ts` (+28, -0)
- `packages/console/app/src/middleware.ts` (+10, -6)
- `packages/console/app/src/routes/auth/[...callback].ts` (+11, -1)
- `packages/console/app/src/routes/black.css` (+61, -59)
- `packages/console/app/src/routes/black/subscribe/[plan].tsx` (+7, -2)
- `packages/console/app/src/routes/stripe/webhook.ts` (+8, -1)
- `packages/console/app/src/routes/workspace-picker.css` (+4, -0)
- `packages/console/app/src/routes/workspace-picker.tsx` (+27, -32)
- `packages/console/app/src/routes/workspace.css` (+1, -0)
- `packages/console/app/src/routes/workspace/[id]/billing/black-section.tsx` (+3, -16)
- `packages/console/app/src/routes/workspace/[id]/go/index.tsx` (+11, -2)
- `packages/console/app/src/routes/workspace/[id]/go/lite-section.module.css` (+2, -0)
- `packages/console/app/src/routes/workspace/[id]/go/lite-section.tsx` (+57, -82)
- `packages/console/app/src/routes/zen/util/handler.ts` (+4, -0)
- `packages/console/function/src/auth.ts` (+4, -1)
- `packages/desktop/src/main/desktop-menu-actions.ts` (+84, -0)
- `packages/desktop/src/main/index.ts` (+4, -2)
- `packages/desktop/src/main/ipc.ts` (+5, -0)
- `packages/desktop/src/main/menu.ts` (+52, -126)
- `packages/desktop/src/preload/index.ts` (+1, -0)
- `packages/desktop/src/preload/types.ts` (+3, -1)
- `packages/desktop/src/renderer/index.tsx` (+19, -1)
- `packages/desktop/src/renderer/webview-zoom.ts` (+8, -4)
- `packages/opencode/specs/tui-plugins.md` (+63, -0)
- `packages/opencode/src/cli/cmd/import.ts` (+11, -4)
- `packages/opencode/src/cli/cmd/run/footer.prompt.tsx` (+68, -9)
- `packages/opencode/src/cli/cmd/run/footer.view.tsx` (+38, -24)
- `packages/opencode/src/cli/cmd/run/prompt.shared.ts` (+2, -1)
- `packages/opencode/src/cli/cmd/run/runtime.queue.ts` (+8, -6)
- `packages/opencode/src/cli/cmd/run/session-data.ts` (+141, -0)
- `packages/opencode/src/cli/cmd/run/stream.transport.ts` (+116, -51)
- `packages/opencode/src/cli/cmd/run/tool.ts` (+32, -3)
- `packages/opencode/src/cli/cmd/run/types.ts` (+5, -0)
- `packages/opencode/src/cli/cmd/tui/app.tsx` (+23, -20)
- `packages/opencode/src/cli/cmd/tui/component/command-palette.tsx` (+79, -0)
- `packages/opencode/src/cli/cmd/tui/component/prompt/autocomplete.tsx` (+10, -7)
- `packages/opencode/src/cli/cmd/tui/component/prompt/index.tsx` (+2, -4)
- `packages/opencode/src/cli/cmd/tui/context/command-palette.tsx` (+0, -163)
- `packages/opencode/src/cli/cmd/tui/keymap.tsx` (+116, -9)
- `packages/opencode/src/cli/cmd/tui/plugin/api.tsx` (+8, -0)
- `packages/opencode/src/cli/cmd/tui/plugin/runtime.ts` (+12, -0)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+4, -6)
- `packages/opencode/src/cli/cmd/tui/routes/session/permission.tsx` (+3, -6)
- `packages/opencode/src/cli/cmd/tui/routes/session/question.tsx` (+4, -5)
- `packages/opencode/src/cli/cmd/tui/routes/session/subagent-footer.tsx` (+5, -6)
- `packages/opencode/src/cli/cmd/tui/ui/dialog.tsx` (+9, -2)
- `packages/opencode/src/config/agent.ts` (+3, -3)
- `packages/opencode/src/config/command.ts` (+2, -2)
- `packages/opencode/src/config/config.ts` (+5, -1)
- `packages/opencode/src/config/entry-name.ts` (+11, -8)
- `packages/opencode/src/provider/sdk/copilot/AGENTS.md` (+0, -1)
- `packages/opencode/src/session/llm/native-runtime.ts` (+7, -4)
- `packages/opencode/test/cli/acp/acp-process.test.ts` (+70, -0)
- `packages/opencode/test/cli/help/__snapshots__/help-snapshots.test.ts.snap` (+623, -0)
- `packages/opencode/test/cli/help/help-snapshots.test.ts` (+132, -0)
- `packages/opencode/test/cli/run/entry.body.test.ts` (+67, -0)
- `packages/opencode/test/cli/run/run-process.test.ts` (+4, -4)
- `packages/opencode/test/cli/run/runtime.queue.test.ts` (+60, -2)
- `packages/opencode/test/cli/run/scrollback.surface.test.ts` (+72, -28)
- `packages/opencode/test/cli/run/session-data.test.ts` (+184, -0)
- `packages/opencode/test/cli/run/subagent-data.test.ts` (+1, -1)
- `packages/opencode/test/cli/smokes/read-only.test.ts` (+115, -0)
- `packages/opencode/test/cli/tui/keymap.test.tsx` (+54, -0)
- `packages/opencode/test/cli/tui/plugin-toggle.test.ts` (+64, -0)
- `packages/opencode/test/config/config.test.ts` (+176, -206)
- `packages/opencode/test/config/entry-name.test.ts` (+57, -0)
- `packages/opencode/test/fixture/tui-plugin.ts` (+5, -0)
- `packages/opencode/test/fixtures/recordings/session/native-anthropic-tool-loop.json` (+49, -0)
- `packages/opencode/test/fixtures/recordings/session/native-openai-tool-call.json` (+0, -31)
- `packages/opencode/test/fixtures/recordings/session/native-zen-tool-call.json` (+0, -31)
- `packages/opencode/test/fixtures/recordings/session/native-zen-tool-loop.json` (+49, -0)
- `packages/opencode/test/lib/cli-process.ts` (+199, -49)
- `packages/opencode/test/lib/snapshot.ts` (+73, -0)
- `packages/opencode/test/session/llm-native-recorded.test.ts` (+213, -219)
- `packages/opencode/test/session/llm-native.test.ts` (+26, -6)
- `packages/opencode/test/session/processor-effect.test.ts` (+1, -1)
- `packages/opencode/test/session/prompt.test.ts` (+106, -95)
- `packages/opencode/test/snapshot/snapshot.test.ts` (+7, -6)
- `packages/plugin/src/tui.ts` (+6, -0)
- `packages/ui/package.json` (+2, -1)
- `packages/ui/src/v2/components/accordion-v2.css` (+141, -0)
- `packages/ui/src/v2/components/accordion-v2.stories.tsx` (+177, -0)
- `packages/ui/src/v2/components/accordion-v2.tsx` (+86, -0)
- `packages/ui/src/v2/components/avatar-v2.css` (+71, -0)
- `packages/ui/src/v2/components/avatar-v2.stories.tsx` (+85, -0)
- `packages/ui/src/v2/components/avatar-v2.tsx` (+59, -0)
- `packages/ui/src/v2/components/badge-v2.css` (+28, -0)
- `packages/ui/src/v2/components/badge-v2.stories.tsx` (+54, -0)
- `packages/ui/src/v2/components/badge-v2.tsx` (+20, -0)
- `packages/ui/src/v2/components/basic-tool-v2.css` (+164, -0)
- `packages/ui/src/v2/components/basic-tool-v2.stories.tsx` (+137, -0)
- `packages/ui/src/v2/components/basic-tool-v2.tsx` (+139, -0)
- `packages/ui/src/v2/components/button-v2.css` (+147, -0)
- `packages/ui/src/v2/components/button-v2.stories.tsx` (+147, -0)
- `packages/ui/src/v2/components/button-v2.tsx` (+35, -0)
- `packages/ui/src/v2/components/checkbox-v2.css` (+181, -0)
- `packages/ui/src/v2/components/checkbox-v2.stories.tsx` (+92, -0)
- `packages/ui/src/v2/components/checkbox-v2.tsx` (+65, -0)
- `packages/ui/src/v2/components/dialog-v2.css` (+150, -0)
- `packages/ui/src/v2/components/dialog-v2.stories.tsx` (+174, -0)
- `packages/ui/src/v2/components/dialog-v2.tsx` (+77, -0)
- `packages/ui/src/v2/components/diff-changes-v2.css` (+25, -0)
- `packages/ui/src/v2/components/diff-changes-v2.stories.tsx` (+60, -0)
- `packages/ui/src/v2/components/diff-changes-v2.tsx` (+28, -0)
- `packages/ui/src/v2/components/field-v2.css` (+96, -0)
- `packages/ui/src/v2/components/field-v2.stories.tsx` (+135, -0)
- `packages/ui/src/v2/components/field-v2.tsx` (+265, -0)
- `packages/ui/src/v2/components/icon-button-v2.css` (+146, -0)
- `packages/ui/src/v2/components/icon-button-v2.stories.tsx` (+105, -0)
- `packages/ui/src/v2/components/icon-button-v2.tsx` (+37, -0)
- `packages/ui/src/v2/components/icon.tsx` (+29, -0)
- `packages/ui/src/v2/components/inline-input-v2.css` (+219, -0)
- `packages/ui/src/v2/components/inline-input-v2.stories.tsx` (+141, -0)
- `packages/ui/src/v2/components/inline-input-v2.tsx` (+90, -0)
- `packages/ui/src/v2/components/keybind-v2.css` (+73, -0)
- `packages/ui/src/v2/components/keybind-v2.stories.tsx` (+82, -0)
- `packages/ui/src/v2/components/keybind-v2.tsx` (+30, -0)
- `packages/ui/src/v2/components/line-comment-v2.css` (+205, -0)
- `packages/ui/src/v2/components/line-comment-v2.stories.tsx` (+88, -0)
- `packages/ui/src/v2/components/line-comment-v2.tsx` (+155, -0)
- `packages/ui/src/v2/components/menu-v2.css` (+186, -0)
- `packages/ui/src/v2/components/menu-v2.stories.tsx` (+216, -0)
- `packages/ui/src/v2/components/menu-v2.tsx` (+225, -0)
- `packages/ui/src/v2/components/radio-v2.css` (+202, -0)
- `packages/ui/src/v2/components/radio-v2.stories.tsx` (+92, -0)
- `packages/ui/src/v2/components/radio-v2.tsx` (+72, -0)
- `packages/ui/src/v2/components/segmented-control-v2.css` (+81, -0)
- `packages/ui/src/v2/components/segmented-control-v2.stories.tsx` (+107, -0)
- `packages/ui/src/v2/components/segmented-control-v2.tsx` (+208, -0)
- `packages/ui/src/v2/components/select-v2.css` (+196, -0)
- `packages/ui/src/v2/components/select-v2.stories.tsx` (+174, -0)
- `packages/ui/src/v2/components/select-v2.tsx` (+194, -0)
- `packages/ui/src/v2/components/switch-v2.css` (+150, -0)
- `packages/ui/src/v2/components/switch-v2.stories.tsx` (+64, -0)
- `packages/ui/src/v2/components/switch-v2.tsx` (+28, -0)
- `packages/ui/src/v2/components/tabs-v2.css` (+223, -0)
- `packages/ui/src/v2/components/tabs-v2.stories.tsx` (+168, -0)
- `packages/ui/src/v2/components/tabs-v2.tsx` (+147, -0)
- `packages/ui/src/v2/components/text-input-v2.css` (+145, -0)
- `packages/ui/src/v2/components/text-input-v2.stories.tsx` (+141, -0)
- `packages/ui/src/v2/components/text-input-v2.tsx` (+67, -0)
- `packages/ui/src/v2/components/text-shimmer-v2.css` (+125, -0)
- `packages/ui/src/v2/components/text-shimmer-v2.stories.tsx` (+70, -0)
- `packages/ui/src/v2/components/text-shimmer-v2.tsx` (+63, -0)
- `packages/ui/src/v2/components/textarea-v2.css` (+78, -0)
- `packages/ui/src/v2/components/textarea-v2.stories.tsx` (+111, -0)
- `packages/ui/src/v2/components/textarea-v2.tsx` (+31, -0)
- `packages/ui/src/v2/components/toast-v2.css` (+201, -0)
- `packages/ui/src/v2/components/toast-v2.stories.tsx` (+151, -0)
- `packages/ui/src/v2/components/toast-v2.tsx` (+144, -0)
- `packages/ui/src/v2/components/tool-error-card-v2.css` (+201, -0)
- `packages/ui/src/v2/components/tool-error-card-v2.stories.tsx` (+91, -0)
- `packages/ui/src/v2/components/tool-error-card-v2.tsx` (+166, -0)
- `packages/ui/src/v2/components/tooltip-v2.css` (+54, -0)
- `packages/ui/src/v2/components/tooltip-v2.stories.tsx` (+91, -0)
- `packages/ui/src/v2/components/tooltip-v2.tsx` (+146, -0)
- `packages/ui/src/v2/styles/colors.css` (+171, -0)
- `packages/ui/src/v2/styles/tailwind.css` (+2, -0)
- `packages/ui/src/v2/styles/theme.css` (+374, -0)
- `packages/web/src/content/docs/ar/go.mdx` (+0, -4)
- `packages/web/src/content/docs/ar/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/bs/go.mdx` (+0, -4)
- `packages/web/src/content/docs/bs/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/da/go.mdx` (+0, -4)
- `packages/web/src/content/docs/da/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/de/go.mdx` (+0, -4)
- `packages/web/src/content/docs/de/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/es/go.mdx` (+0, -4)
- `packages/web/src/content/docs/es/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/fr/go.mdx` (+0, -4)
- `packages/web/src/content/docs/fr/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/go.mdx` (+0, -4)
- `packages/web/src/content/docs/it/go.mdx` (+0, -4)
- `packages/web/src/content/docs/it/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/ja/go.mdx` (+0, -4)
- `packages/web/src/content/docs/ja/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/ko/go.mdx` (+0, -4)
- `packages/web/src/content/docs/ko/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/nb/go.mdx` (+0, -4)
- `packages/web/src/content/docs/nb/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/pl/go.mdx` (+0, -4)
- `packages/web/src/content/docs/pl/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/pt-br/go.mdx` (+0, -4)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/ru/go.mdx` (+0, -4)
- `packages/web/src/content/docs/ru/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/th/go.mdx` (+0, -4)
- `packages/web/src/content/docs/th/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/tr/go.mdx` (+0, -4)
- `packages/web/src/content/docs/tr/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+0, -4)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+0, -4)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+0, -4)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+0, -4)
- `perf/test-suite.md` (+8, -0)

### Key Diffs

#### .opencode/tool/github-triage.ts
```diff
diff --git a/.opencode/tool/github-triage.ts b/.opencode/tool/github-triage.ts
index 35db446..f25ca48 100644
--- a/.opencode/tool/github-triage.ts
+++ b/.opencode/tool/github-triage.ts
@@ -4,8 +4,8 @@ import { tool } from "@opencode-ai/plugin"
 const TEAM = {
   tui: ["kommander", "simonklee"],
   desktop_web: ["Hona", "Brendonovich"],
-  core: ["jlongster", "rekram1-node", "nexxeln", "kitlangton"],
-  inference: ["fwang", "MrMushrooooom"],
+  core: ["jlongster", "rekram1-node", "nexxeln", "kitlangton", "starptech"],
+  inference: ["fwang", "MrMushrooooom", "starptech"],
   windows: ["Hona"],
 } as const
 
```

#### packages/console/core/migrations/20260513173355_groovy_jane_foster/migration.sql
```diff
diff --git a/packages/console/core/migrations/20260513173355_groovy_jane_foster/migration.sql b/packages/console/core/migrations/20260513173355_groovy_jane_foster/migration.sql
new file mode 100644
index 0000000..76f85ee
--- /dev/null
+++ b/packages/console/core/migrations/20260513173355_groovy_jane_foster/migration.sql
@@ -0,0 +1,47 @@
+CREATE TABLE `referral_code` (
+	`id` varchar(30) NOT NULL,
+	`workspace_id` varchar(30) NOT NULL,
+	`time_created` timestamp(3) NOT NULL DEFAULT (now()),
+	`time_updated` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
+	`time_deleted` timestamp(3),
+	`code` varchar(10) NOT NULL,
+	CONSTRAINT PRIMARY KEY(`workspace_id`,`id`),
+	CONSTRAINT `referral_code_workspace_id` UNIQUE INDEX(`workspace_id`),
+	CONSTRAINT `referral_code_code` UNIQUE INDEX(`code`)
+);
+--> statement-breakpoint
+CREATE TABLE `referral_reward` (
+	`id` varchar(30) NOT NULL,
+	`workspace_id` varchar(30) NOT NULL,
+	`time_created` timestamp(3) NOT NULL DEFAULT (now()),
+	`time_updated` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
+	`time_deleted` timestamp(3),
+	`referral_id` varchar(30) NOT NULL,
+	`source` enum('inviter','invitee') NOT NULL,
+	`amount` bigint NOT NULL,
+	`applied_by_user_id` varchar(30),
+	`time_applied` timestamp(3),
+	CONSTRAINT PRIMARY KEY(`workspace_id`,`id`),
+	CONSTRAINT `referral_reward_referral_source` UNIQUE INDEX(`referral_id`,`source`)
+);
+--> statement-breakpoint
+CREATE TABLE `referral` (
+	`id` varchar(30) NOT NULL,
+	`workspace_id` varchar(30) NOT NULL,
+	`time_created` timestamp(3) NOT NULL DEFAULT (now()),
+	`time_updated` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
+	`time_deleted` timestamp(3),
+	`inviter_workspace_id` varchar(30) NOT NULL,
+	`invitee_account_id` varchar(30) NOT NULL,
+	`invitee_user_id` varchar(30) NOT NULL,
+	`referral_code_id` varchar(30) NOT NULL,
+	`stripe_customer_id` varchar(255) NOT NULL,
+	`stripe_subscription_id` varchar(255) NOT NULL,
+	CONSTRAINT PRIMARY KEY(`workspace_id`,`id`),
+	CONSTRAINT `referral_invitee_account_id` UNIQUE INDEX(`invitee_account_id`),
+	CONSTRAINT `referral_stripe_subscription_id` UNIQUE INDEX(`stripe_subscription_id`)
+);
+--> statement-breakpoint
```

#### packages/console/core/migrations/20260513173355_groovy_jane_foster/snapshot.json
```diff
diff --git a/packages/console/core/migrations/20260513173355_groovy_jane_foster/snapshot.json b/packages/console/core/migrations/20260513173355_groovy_jane_foster/snapshot.json
new file mode 100644
index 0000000..3fb58d1
--- /dev/null
+++ b/packages/console/core/migrations/20260513173355_groovy_jane_foster/snapshot.json
@@ -0,0 +1,3229 @@
+{
+  "version": "6",
+  "dialect": "mysql",
+  "id": "91a9afa8-a5b1-4fa4-b71d-b3ae866744c9",
+  "prevIds": ["c742e0f2-5d89-4216-b843-059d00680f13"],
+  "ddl": [
+    {
+      "name": "account",
+      "entityType": "tables"
+    },
+    {
+      "name": "auth",
+      "entityType": "tables"
+    },
+    {
+      "name": "benchmark",
+      "entityType": "tables"
+    },
+    {
+      "name": "billing",
+      "entityType": "tables"
+    },
+    {
+      "name": "coupon",
+      "entityType": "tables"
+    },
+    {
+      "name": "lite",
+      "entityType": "tables"
+    },
+    {
+      "name": "payment",
+      "entityType": "tables"
+    },
+    {
+      "name": "subscription",
+      "entityType": "tables"
+    },
+    {
+      "name": "usage",
+      "entityType": "tables"
+    },
+    {
+      "name": "ip_rate_limit",
```

#### packages/console/core/migrations/20260516082200_long_spirit/migration.sql
```diff
diff --git a/packages/console/core/migrations/20260516082200_long_spirit/migration.sql b/packages/console/core/migrations/20260516082200_long_spirit/migration.sql
new file mode 100644
index 0000000..471552c
--- /dev/null
+++ b/packages/console/core/migrations/20260516082200_long_spirit/migration.sql
@@ -0,0 +1,20 @@
+DROP TABLE `referral_code`;--> statement-breakpoint
+DROP INDEX `referral_reward_referral_source` ON `referral_reward`;--> statement-breakpoint
+DROP INDEX `referral_stripe_subscription_id` ON `referral`;--> statement-breakpoint
+DROP INDEX `referral_inviter_workspace_id` ON `referral`;--> statement-breakpoint
+DROP INDEX `referral_code_id` ON `referral`;--> statement-breakpoint
+ALTER TABLE `referral_reward` DROP PRIMARY KEY;--> statement-breakpoint
+ALTER TABLE `referral` DROP PRIMARY KEY;--> statement-breakpoint
+ALTER TABLE `referral_reward` MODIFY COLUMN `workspace_id` varchar(30);--> statement-breakpoint
+ALTER TABLE `workspace` ADD `referral_code` varchar(16);--> statement-breakpoint
+ALTER TABLE `referral_reward` ADD PRIMARY KEY (`id`);--> statement-breakpoint
+ALTER TABLE `referral` ADD PRIMARY KEY (`id`);--> statement-breakpoint
+CREATE INDEX `referral_workspace_id` ON `referral` (`workspace_id`);--> statement-breakpoint
+CREATE UNIQUE INDEX `workspace_referral_code` ON `workspace` (`referral_code`);--> statement-breakpoint
+ALTER TABLE `referral_reward` DROP COLUMN `source`;--> statement-breakpoint
+ALTER TABLE `referral_reward` DROP COLUMN `applied_by_user_id`;--> statement-breakpoint
+ALTER TABLE `referral` DROP COLUMN `inviter_workspace_id`;--> statement-breakpoint
+ALTER TABLE `referral` DROP COLUMN `invitee_user_id`;--> statement-breakpoint
+ALTER TABLE `referral` DROP COLUMN `referral_code_id`;--> statement-breakpoint
+ALTER TABLE `referral` DROP COLUMN `stripe_customer_id`;--> statement-breakpoint
+ALTER TABLE `referral` DROP COLUMN `stripe_subscription_id`;
\ No newline at end of file
```

#### packages/console/core/migrations/20260516082200_long_spirit/snapshot.json
```diff
diff --git a/packages/console/core/migrations/20260516082200_long_spirit/snapshot.json b/packages/console/core/migrations/20260516082200_long_spirit/snapshot.json
new file mode 100644
index 0000000..2bdb0af
--- /dev/null
+++ b/packages/console/core/migrations/20260516082200_long_spirit/snapshot.json
@@ -0,0 +1,3063 @@
+{
+  "version": "6",
+  "dialect": "mysql",
+  "id": "e93db4f6-6e8b-43f4-b883-59d2fd6ede53",
+  "prevIds": ["1f04bd59-35b0-493b-9d55-cfa08207ba8e", "91a9afa8-a5b1-4fa4-b71d-b3ae866744c9"],
+  "ddl": [
+    {
+      "name": "account",
+      "entityType": "tables"
+    },
+    {
+      "name": "auth",
+      "entityType": "tables"
+    },
+    {
+      "name": "benchmark",
+      "entityType": "tables"
+    },
+    {
+      "name": "billing",
+      "entityType": "tables"
+    },
+    {
+      "name": "coupon",
+      "entityType": "tables"
+    },
+    {
+      "name": "lite",
+      "entityType": "tables"
+    },
+    {
+      "name": "payment",
+      "entityType": "tables"
+    },
+    {
+      "name": "subscription",
+      "entityType": "tables"
+    },
+    {
+      "name": "usage",
+      "entityType": "tables"
+    },
+    {
+      "name": "ip_rate_limit",
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/templating/AutocompleteTemplate.ts
- `src/tool/github-triage.ts` - update based on opencode .opencode/tool/github-triage.ts changes
- `src/tool/registry.test.ts` - update based on opencode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on opencode packages/opencode/src/tool/registry.ts changes
