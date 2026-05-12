# Upstream Changes Report
Generated: 2026-05-12 08:41:55

## Summary
- kilocode: 116 commits, 217 files changed
- opencode: 76 commits, 273 files changed

## kilocode Changes (08a3e0a09..64e45eaba)

### Commits

- 64e45eaba - fix(vscode): use VS Code placeholder color for input fields (#10159) (Marius, 2026-05-12)
- e805d2f75 - fix(vscode): refresh checkpoint header stats (#10156) (Marius, 2026-05-12)
- d8245a0ce - fix(ui): restore Mermaid node labels stripped by DOMPurify (#10158) (Marius, 2026-05-12)
- 8af638e7e - Fix expired Codex auth recovery (#10136) (Marius, 2026-05-12)
- 9fd631c43 - Merge pull request #10078 from Kilo-Org/LigiaZ-patch-1 (Ligia Zanchet, 2026-05-12)
- 645e80525 - release: v7.2.52 (kilo-maintainer[bot], 2026-05-11)
- 1f252acce - release: v7.2.51 (kilo-maintainer[bot], 2026-05-11)
- 41596c556 - Merge pull request #10152 from Kilo-Org/glittery-writer (Catriel Müller, 2026-05-11)
- 6308e7d54 - update source links (Catriel Müller, 2026-05-11)
- 020018317 - refactor(vscode): import normalizeUrls from shared kilocode util in PermissionDock (Catriel Müller, 2026-05-11)
- ed64e9b06 - Merge pull request #10151 from Kilo-Org/feat/default-model-to-free (Joshua Lambert, 2026-05-11)
- a0dcf7617 - fix(cli): strip trailing sentence punctuation from URL matches in normalizeUrls (Catriel Müller, 2026-05-11)
- 906447894 - test(cli): add unit tests for normalizeUrls homograph protection (Catriel Müller, 2026-05-11)
- 9c572ccbb - chore(kilo-docs): exclude example punycode domain from link checker (Catriel Müller, 2026-05-11)
- ab8af8009 - update source links (Catriel Müller, 2026-05-11)
- ea023b06d - fix(cli): prune tool outputs for large requests (#10143) (Marius, 2026-05-11)
- da92a3000 - fix: add missing kilocode_change markers to all annotated lines (Catriel Müller, 2026-05-11)
- 9fe37aeb3 - refactor: extract normalizeUrls into src/kilocode/util/url.ts (Catriel Müller, 2026-05-11)
- 862fed158 - fix(cli): normalize IDN hostnames to punycode in permission dialogs (Catriel Müller, 2026-05-11)
- b3bde8e74 - feat(gateway): change default model to kilo-auto/free (Josh Lambert, 2026-05-11)
- ac9d83373 - Merge pull request #10097 from Kilo-Org/accidental-matrix (Kirill Kalishev, 2026-05-11)
- 01b7b7d99 - Enhance auto-docs workflow for better PR integration (Ligia Zanchet, 2026-05-11)
- 00313bfcd - fix(tool): clarify semantic_search returns snippets not file paths (#10142) (Truffle, 2026-05-11)
- 1b452c6cb - Merge pull request #10145 from thomasboom/docs/cleanup-questions-readme (Catriel Müller, 2026-05-11)
- f383258f8 - Merge pull request #10121 from shssoichiro/apply-auto-to-subagents (Catriel Müller, 2026-05-11)
- 0676243df - ux(cli): remove `--dangerously-skip-permissions` (#10114) (Josh Holmer, 2026-05-11)
- 29d456b2e - Merge branch 'main' into accidental-matrix (Kirill Kalishev, 2026-05-11)
- 57996115a - fix(cli): prevent nested subagent delegation (#10137) (Marius, 2026-05-11)
- 0a5807b1b - fix(cli): improve model info panel scrollbar padding and capabilities display (Catriel Müller, 2026-05-11)
- 4065364a8 - fix(model-info-panel): resolve review comments - merge imports, guard fmtDate, use Show render-prop (Aarav Sharma, 2026-05-11)
- 9d4c4eefc - feat(cli): improve model info panel with modality and description support (Aarav Sharma, 2026-05-11)
- baeec988a - test(vscode): cover nested subagent cost breakdown (#10138) (Marius, 2026-05-11)
- 54e595e27 - release: v7.2.50 (kilo-maintainer[bot], 2026-05-11)
- 482a3b19d - fix(vscode): correct subagent cost breakdown after sync (#10134) (Marius, 2026-05-11)
- 3a7ee126c - fix(upstream): rename shadowing path local in writeVersion (kiloconnect[bot], 2026-05-11)
- 413c5ce3c - feat(upstream): record last merged tag in .opencode-version (kiloconnect[bot], 2026-05-11)
- 792a996f4 - fix(upstream-merge): always reconcile package.json post-merge (Mark IJbema, 2026-05-11)
- 3a03c7378 - fix(upstream-merge): preserve ours' key order in package.json dep merge (Mark IJbema, 2026-05-11)
- 7fb217b4d - chore(upstream): preserve & prune root package.json entries on merge (Mark IJbema, 2026-05-11)
- be47492e8 - fix: restore root package.json entries dropped by upstream-compat (Mark IJbema, 2026-05-11)
- d01e63cb8 - Fix cursor positioning when text ends with newline (#10133) (Imanol Maiztegui, 2026-05-11)
- 7fed01f8c - fix(vscode): keep revert checkpoints accessible (#10129) (Marius, 2026-05-11)
- 1465303b3 - chore: ignore generated Kilo config artifacts (#10128) (Marius, 2026-05-11)
- 5bc05966e - fix(vscode): improve review comment icon contrast (#10130) (Marius, 2026-05-11)
- 55ea2c76b - refactor(upstream): improve compatibility commit lookup using semver (kiloconnect[bot], 2026-05-11)
- 62447fc1f - fix: preserve upstream ancestry on kilo merge (kiloconnect[bot], 2026-05-11)
- 6dc1b25f8 - fix: resolve compat bases from version tags (kiloconnect[bot], 2026-05-11)
- ca61c5c71 - fix: keep compat branches linear (kiloconnect[bot], 2026-05-11)
- 241da24f6 - fix: preserve upstream compat merge bases (kiloconnect[bot], 2026-05-11)
- 98fbee8a9 - chore(upstream): implement compatibility base tracking for merges (kiloconnect[bot], 2026-05-11)
- 47a13fd8f - fix(vscode): stabilize shell command streaming (#10127) (Marius, 2026-05-11)
- ef620c314 - fix(vscode): hide empty task header graph (#10125) (Marius, 2026-05-11)
- 33a233fd1 - fix(cli): prevent nested subagent delegation (#10137) (Marius, 2026-05-11)
- f2d5b4e33 - Merge branch 'main' into docs/cleanup-questions-readme (Thomas Boom, 2026-05-11)
- d7d041597 - docs: move Kilo CLI origin to FAQ section (Thomas Boom, 2026-05-11)
- 9e28ec7d0 - Merge pull request #10120 from IamCoder18/cli-model-picker-parity (Catriel Müller, 2026-05-11)
- 8e90f2969 - fix(cli): improve model info panel scrollbar padding and capabilities display (Catriel Müller, 2026-05-11)
- a0a2708b2 - test(vscode): cover nested subagent cost breakdown (#10138) (Marius, 2026-05-11)
- f70ea87ab - Merge branch 'main' into cli-model-picker-parity (Catriel Müller, 2026-05-11)
- 7a69410ac - release: v7.2.50 (kilo-maintainer[bot], 2026-05-11)
- 0e8d2fe09 - fix(vscode): correct subagent cost breakdown after sync (#10134) (Marius, 2026-05-11)
- 51b35d0b9 - fix(model-info-panel): resolve review comments - merge imports, guard fmtDate, use Show render-prop (Aarav Sharma, 2026-05-10)
- 3b44205a3 - feat(cli): improve model info panel with modality and description support (Aarav Sharma, 2026-05-10)
- 70366cbb8 - Merge branch 'main' into accidental-matrix (Kirill Kalishev, 2026-05-10)
- 9963b0271 - fix(cli): apply `--auto` flag to subagents from Task tool (Josh Holmer, 2026-05-10)
- bd384b7a1 - Merge branch 'main' into accidental-matrix (Kirill Kalishev, 2026-05-09)
- f4c7e7760 - fix(jetbrains): use top-level buildString (kirillk, 2026-05-09)
- d1b48b4f1 - fix(jetbrains): address bot review warnings (json escape, data race, list events) (kirillk, 2026-05-09)
- 4ccf9d6ec - Merge remote-tracking branch 'origin/main' into accidental-matrix (kirillk, 2026-05-09)
- f7e737785 - fix(jetbrains): improve cloud history loading (kirillk, 2026-05-09)
- ed1af58cf - fix(jetbrains): widen recent timestamp gap (kirillk, 2026-05-09)
- 50381a1d5 - test(jetbrains): cover history route state (kirillk, 2026-05-09)
- e7126ad8e - docs(jetbrains): document ui style constant ownership (kirillk, 2026-05-08)
- 73e6b40fb - refactor(jetbrains): rename session controller package (kirillk, 2026-05-08)
- d63c75299 - refactor(jetbrains): batch transparent component setup (kirillk, 2026-05-08)
- 8326a5a80 - docs(jetbrains): document ui style tokens (kirillk, 2026-05-08)
- 6f0b15b7c - refactor(jetbrains): simplify ui gap tokens (kirillk, 2026-05-08)
- d40c17132 - refactor(jetbrains): colocate component style tokens (kirillk, 2026-05-08)
- e9a73cc6f - refactor(jetbrains): group session view style tokens (kirillk, 2026-05-08)
- bc9b98b74 - refactor(jetbrains): group message view styles (kirillk, 2026-05-08)
- 2acbadd04 - refactor(jetbrains): group reasoning view styles (kirillk, 2026-05-08)
- 776d0b5b6 - refactor(jetbrains): group view style constants (kirillk, 2026-05-08)
- 7ee0f093c - refactor(jetbrains): move session styles into style package (kirillk, 2026-05-08)
- 94721182a - refactor(jetbrains): uppercase timeline style constants (kirillk, 2026-05-08)
- 368f73c87 - refactor(jetbrains): inline hover icon size (kirillk, 2026-05-08)
- 7d51a1203 - refactor(jetbrains): extract shared ui controls (kirillk, 2026-05-08)
- 42924e804 - refactor(jetbrains): move session layout styles (kirillk, 2026-05-08)
- 7594a05b7 - refactor(jetbrains): move prompt styles into session ui (kirillk, 2026-05-08)
- 6fbcfa760 - refactor(jetbrains): move recent session styles (kirillk, 2026-05-08)
- c169cff09 - styles (kirillk, 2026-05-08)
- 3930fb61c - refactor(jetbrains): move timeline styles into session ui (kirillk, 2026-05-08)
- cf22a6ede - refactor(jetbrains): rename SessionStyle to SessionEditorStyle (kirillk, 2026-05-08)
- c9c1f999a - chore: bump plugin lock files to @kilocode/plugin 7.2.40 (kirillk, 2026-05-08)
- 2448e1f06 - refactor(jetbrains): update remaining Gap alias usages after Space removal (kirillk, 2026-05-08)
- 5461f51b3 - refactor(jetbrains): remove UiStyle.Space and replace with Gap calls (kirillk, 2026-05-08)
- 391379f16 - fix(jetbrains): refine empty session layout (kirillk, 2026-05-08)
- c87bf9f07 - Update auto-docs workflow for PR handling (Ligia Zanchet, 2026-05-08)
- a7e5c4f0a - feat(jetbrains): improve history navigation (kirillk, 2026-05-07)
- 373b90a5c - refactor(jetbrains): share history helpers with empty state (kirillk, 2026-05-07)
- 2faa74d8b - feat(jetbrains): add history back button (kirillk, 2026-05-07)
- d630d66d8 - fix(jetbrains): remove redundant session overload (kirillk, 2026-05-07)
- b2be20950 - refactor(jetbrains): replace open callback in SessionUi with manager: SessionManager? (kirillk, 2026-05-07)
- bb5b63b23 - refactor(jetbrains): collapse SessionUi id/session/target into single ref: SessionRef? (kirillk, 2026-05-07)
- c7f9add7d - refactor(jetbrains): remove local/key/log helpers from SessionController, keep only ref and sid (kirillk, 2026-05-07)
- 3d6586c88 - fix(jetbrains): session loading state, history panel loading indicator, and model dedup (kirillk, 2026-05-07)
- 6b5ace20b - fix(jetbrains): unify session identity in SessionRef and gate recents behind blank controller (kirillk, 2026-05-07)
- 16e0d314c - fix(jetbrains): open history panel sessions (kirillk, 2026-05-07)
- b237dc33c - fix(jetbrains): focus history filter (kirillk, 2026-05-06)
- 5a216e5d0 - fix(jetbrains): format cloud history times (kirillk, 2026-05-06)
- 98ef2c9a5 - fix(jetbrains): refresh history theme (kirillk, 2026-05-06)
- bb304a1ed - fix(jetbrains): refresh history panels on reopen (kirillk, 2026-05-06)
- 1335d2fb2 - Merge branch 'agreeable-marlin' into accidental-matrix (kirillk, 2026-05-06)
- 32a8b63c8 - Merge branch 'main' of github.com:Kilo-Org/kilocode into accidental-matrix (kirillk, 2026-05-06)
- e8f570cc7 - feat(jetbrains): add native session history (kirillk, 2026-05-06)
- 88563fa67 - feat(jetbrains): add session history (kirillk, 2026-05-06)
- 8645f5b88 - fix(jetbrains): align agent steps test assertions (kirillk, 2026-05-06)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/semantic-search.txt` (+2, -1)
- `packages/opencode/src/kilocode/tool/task.ts` (+5, -0)
- `packages/opencode/src/tool/bash.ts` (+3, -1)
- `packages/opencode/src/tool/task.ts` (+1, -1)
- `packages/opencode/src/tool/webfetch.ts` (+8, -5)
- `packages/opencode/test/tool/task.test.ts` (+1, -0)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)

#### Other Changes
- `.changeset/agent-manager-tab-add-button.md` (+0, -5)
- `.changeset/agent-manager-tab-controls.md` (+0, -5)
- `.changeset/bright-checkpoints-graph.md` (+5, -0)
- `.changeset/codex-chatgpt-reauth.md` (+6, -0)
- `.changeset/hide-empty-task-header-graph.md` (+0, -5)
- `.changeset/jetbrains-empty-panel-layout.md` (+5, -0)
- `.changeset/jetbrains-history-navigation.md` (+5, -0)
- `.changeset/jetbrains-history-tabs.md` (+5, -0)
- `.changeset/jetbrains-session-history.md` (+5, -0)
- `.changeset/jetbrains-session-loading-state.md` (+5, -0)
- `.changeset/placeholder-vscode-token.md` (+5, -0)
- `.changeset/revert-checkpoints-stay.md` (+0, -5)
- `.changeset/review-plus-contrast.md` (+0, -6)
- `.changeset/silent-mermaid-labels.md` (+6, -0)
- `.changeset/stable-shell-streaming.md` (+0, -5)
- `.github/workflows/auto-docs.yml` (+100, -22)
- `README.md` (+6, -1)
- `bun.lock` (+14, -16)
- `package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/kilo-docs/lychee.toml` (+2, -0)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli-reference.md` (+0, -1)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-with-todos-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/source-links.md` (+7, -1)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-gateway/src/api/constants.ts` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/AGENTS.md` (+36, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendSessionManager.kt` (+65, -4)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloCliDataParser.kt` (+21, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloSessionRpcApiImpl.kt` (+7, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendSessionManagerTest.kt` (+98, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/KiloCliDataParserTest.kt` (+27, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/MockCliServer.kt` (+16, -0)
- `packages/kilo-jetbrains/build.gradle.kts` (+6, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/KiloToolWindowFactory.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/HistoryAction.kt` (+22, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloSessionService.kt` (+22, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionManager.kt` (+7, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionRef.kt` (+40, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionScroll.kt` (+7, -7)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionSidePanelManager.kt` (+101, -13)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+35, -70)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUiFactory.kt` (+4, -9)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/{update => controller}/DelayedState.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/{update => controller}/SessionController.kt` (+209, -82)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/{update => controller}/SessionControllerEvent.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/{update => controller}/SessionQueueCondenser.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/{update => controller}/SessionUpdateQueue.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/history/HistoryController.kt` (+122, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/history/HistoryItem.kt` (+28, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/history/HistoryListRenderer.kt` (+128, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/history/HistoryListUi.kt` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/history/HistoryModel.kt` (+120, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/history/HistoryPanel.kt` (+440, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/history/HistoryTime.kt` (+82, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/SessionModel.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/SessionState.kt` (+3, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/ConnectionPanel.kt` (+10, -9)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/EmptySessionPanel.kt` (+162, -97)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/LoadingPanel.kt` (+25, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/PermissionPanel.kt` (+3, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/ProgressPanel.kt` (+8, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/QuestionPanel.kt` (+3, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/ReasoningPicker.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionLayout.kt` (+9, -8)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanel.kt` (+15, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/ContextBar.kt` (+5, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/SessionHeaderPanel.kt` (+18, -17)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/TimelinePanel.kt` (+10, -10)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/mode/ModePicker.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/mode/ModePickerRenderer.kt` (+13, -24)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/model/ModelPicker.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/model/ModelPickerRenderer.kt` (+5, -10)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/PromptPanel.kt` (+38, -23)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/{SessionStyle.kt => style/SessionEditorStyle.kt}` (+15, -9)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/style/SessionUiStyle.kt` (+124, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/CompactionView.kt` (+6, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/GenericView.kt` (+4, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/MessageView.kt` (+27, -13)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/PartView.kt` (+4, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/ReasoningView.kt` (+26, -18)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/TextView.kt` (+3, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/ToolView.kt` (+34, -25)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/TurnView.kt` (+8, -7)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/CenterShrinkPanel.kt` (+38, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/HoverIcon.kt` (+65, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/PickerButton.kt` (+65, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/UiStyle.kt` (+17, -272)
- `packages/kilo-jetbrains/frontend/src/main/resources/kilo.jetbrains.frontend.xml` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+31, -4)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/NewSessionActionTest.kt` (+5, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionRefTest.kt` (+62, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionSidePanelManagerTest.kt` (+215, -12)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionUiFactoryTest.kt` (+33, -8)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionUiLayoutTest.kt` (+85, -10)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionUiTestBase.kt` (+11, -4)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/{update => controller}/AppWatchingTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/{update => controller}/ChatLoggingFlowTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/{update => controller}/ConfigSelectionTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/{update => controller}/ConnectionDelayTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/{update => controller}/DelayedStateTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/DisposedStateTest.kt` (+128, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/{update => controller}/HistoryLoadingTest.kt` (+28, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/{update => controller}/ListenerLifecycleTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/{update => controller}/MessageListTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/{update => controller}/ProgressTrackingTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/{update => controller}/PromptLifecycleTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/{update => controller}/SessionArtifactsTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/{update => controller}/SessionControllerTestBase.kt` (+22, -13)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/{update => controller}/SessionCreationTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/{update => controller}/SessionHeaderControllerTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/{update => controller}/SessionQueueCondenserTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/{update => controller}/SessionRecoveryTest.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/{update => controller}/SessionUpdateQueueTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/{update => controller}/StatusComputationTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/{update => controller}/TurnLifecycleTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/ViewSwitchingTest.kt` (+350, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/{update => controller}/WorkspaceWatchingTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/history/HistoryControllerTest.kt` (+372, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/model/SessionModelTest.kt` (+11, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/ConnectionPanelTest.kt` (+5, -5)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/EmptySessionPanelTest.kt` (+69, -15)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/PermissionPanelTest.kt` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/PromptPanelTest.kt` (+4, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/QuestionPanelTest.kt` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/{SessionStyleTest.kt => SessionEditorStyleTest.kt}` (+6, -5)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanelTest.kt` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/header/SessionHeaderPanelTest.kt` (+6, -6)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/update/ViewSwitchingTest.kt` (+0, -212)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ReasoningViewTest.kt` (+6, -6)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/TextViewTest.kt` (+3, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ToolViewTest.kt` (+9, -9)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/TurnViewTest.kt` (+7, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeSessionRpcApi.kt` (+32, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/UiStyleTest.kt` (+13, -11)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/md/MdViewTest.kt` (+1, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloSessionRpcApi.kt` (+7, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/HistoryDto.kt` (+18, -0)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/text-field.css` (+1, -1)
- `packages/kilo-vscode/CHANGELOG.md` (+27, -0)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/tests/unit/errorUtils.test.ts` (+21, -0)
- `packages/kilo-vscode/tests/unit/session-queue.test.ts` (+31, -0)
- `packages/kilo-vscode/tests/unit/session-utils.test.ts` (+91, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+4, -4)
- `packages/kilo-vscode/webview-ui/kiloclaw/kiloclaw.css` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/ErrorDisplay.tsx` (+53, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/PermissionDock.tsx` (+4, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskHeader.tsx` (+3, -3)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskTimeline.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/context/session-queue.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/context/session-utils.ts` (+28, -1)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+40, -11)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/styles/model-selector.css` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/styles/prompt-input.css` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/styles/question-dock.css` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/utils/errorUtils.ts` (+19, -0)
- `packages/opencode/CHANGELOG.md` (+14, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/cli/cmd/run.ts` (+21, -19)
- `packages/opencode/src/cli/cmd/tui/routes/session/permission.tsx` (+3, -2)
- `packages/opencode/src/kilocode/cli/run-auto.ts` (+47, -0)
- `packages/opencode/src/kilocode/components/model-info-panel-utils.ts` (+8, -2)
- `packages/opencode/src/kilocode/components/model-info-panel.tsx` (+114, -27)
- `packages/opencode/src/kilocode/provider/codex-refresh.ts` (+102, -0)
- `packages/opencode/src/kilocode/util/url.ts` (+38, -0)
- `packages/opencode/src/plugin/codex.ts` (+4, -15)
- `packages/opencode/src/session/compaction.ts` (+21, -8)
- `packages/opencode/src/session/message-v2.ts` (+9, -0)
- `packages/opencode/src/session/prompt.ts` (+22, -4)
- `packages/opencode/test/kilocode/cli-run-auto-helper.test.ts` (+59, -0)
- `packages/opencode/test/kilocode/codex-auth-refresh.test.ts` (+123, -0)
- `packages/opencode/test/kilocode/model-info-panel-utils.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/run-auto.test.ts` (+177, -0)
- `packages/opencode/test/kilocode/semantic-search.test.ts` (+8, -0)
- `packages/opencode/test/kilocode/task-nesting.test.ts` (+193, -0)
- `packages/opencode/test/kilocode/util/url.test.ts` (+144, -0)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/kilocode/markdown-mermaid.ts` (+6, -0)
- `script/upstream/package.json` (+1, -1)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 3fc50a9ce..32ffc2df5 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.2.49",
+  "version": "7.2.52",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/opencode/src/kilocode/tool/semantic-search.txt
```diff
diff --git a/packages/opencode/src/kilocode/tool/semantic-search.txt b/packages/opencode/src/kilocode/tool/semantic-search.txt
index f7b1f3671..f4cd41664 100644
--- a/packages/opencode/src/kilocode/tool/semantic-search.txt
+++ b/packages/opencode/src/kilocode/tool/semantic-search.txt
@@ -1,4 +1,5 @@
-- Find files most relevant to the search query using semantic search.
+- Find code snippets most relevant to the search query using semantic search.
+- Returns matching content with file paths, line ranges, and relevance scores.
 - Searches based on meaning rather than exact text matches.
 - By default searches entire workspace, with capability to filter by path.
 
```

#### packages/opencode/src/kilocode/tool/task.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/task.ts b/packages/opencode/src/kilocode/tool/task.ts
index 633defeb8..b349ab86b 100644
--- a/packages/opencode/src/kilocode/tool/task.ts
+++ b/packages/opencode/src/kilocode/tool/task.ts
@@ -24,6 +24,11 @@ export namespace KiloTask {
     if (info.mode === "primary") throw new Error(`Agent "${name}" is a primary agent and cannot be used as a subagent`)
   }
 
+  /** Kilo keeps delegation one level deep to avoid recursive subagent chains. */
+  export function nestedTask(): false {
+    return false
+  }
+
   /**
    * Build inherited permission rules from the calling agent.
    * Merges the static agent definition with the session's accumulated permissions
```

#### packages/opencode/src/tool/bash.ts
```diff
diff --git a/packages/opencode/src/tool/bash.ts b/packages/opencode/src/tool/bash.ts
index f29230548..df171c24a 100644
--- a/packages/opencode/src/tool/bash.ts
+++ b/packages/opencode/src/tool/bash.ts
@@ -20,6 +20,7 @@ import { Shell } from "@/shell/shell"
 import { BashArity } from "@/permission/arity"
 import * as Truncate from "./truncate"
 import { Plugin } from "@/plugin"
+import { normalizeUrls } from "@/kilocode/util/url" // kilocode_change
 import { Effect, Stream } from "effect"
 import { ChildProcess } from "effect/unstable/process"
 import { ChildProcessSpawner } from "effect/unstable/process/ChildProcessSpawner"
@@ -238,6 +239,7 @@ function preview(text: string) {
   return "...\n\n" + text.slice(-MAX_METADATA_LENGTH)
 }
 
+
 function tail(text: string, maxLines: number, maxBytes: number) {
   const lines = text.split("\n")
   if (lines.length <= maxLines && Buffer.byteLength(text, "utf-8") <= maxBytes) {
@@ -296,7 +298,7 @@ const ask = Effect.fn("BashTool.ask")(function* (ctx: Tool.Context, scan: Scan,
     permission: "bash",
     patterns: Array.from(scan.patterns),
     always: Array.from(scan.always),
-    metadata: { command }, // kilocode_change
+    metadata: { command: normalizeUrls(command) }, // kilocode_change
   })
 })
 
```

#### packages/opencode/src/tool/task.ts
```diff
diff --git a/packages/opencode/src/tool/task.ts b/packages/opencode/src/tool/task.ts
index 62ed942e8..33ab459a3 100644
--- a/packages/opencode/src/tool/task.ts
+++ b/packages/opencode/src/tool/task.ts
@@ -62,7 +62,7 @@ export const TaskTool = Tool.define(
       KiloTask.validate(next, params.subagent_type)
       // kilocode_change end
 
-      const canTask = next.permission.some((rule) => rule.permission === id)
+      const canTask = KiloTask.nestedTask() // kilocode_change - Kilo disallows subagents spawning subagents
       const canTodo = next.permission.some((rule) => rule.permission === "todowrite")
 
       const parent = yield* sessions.get(ctx.sessionID)
```


*... and more files (showing first 5)*

## opencode Changes (c933504..caf1151)

### Commits

- caf1151 - refactor(app): centralize sync query options (#25941) (Luke Parker, 2026-05-12)
- ff38bbe - refactor(desktop): remove configureEnv callback from spawnLocalServer (#27022) (Brendan Allan, 2026-05-12)
- 2481dde - chore: remove codesearch tool (#27019) (Shoubhit Dash, 2026-05-12)
- 61174b7 - fix(tui): make websearch provider label reactive (#26943) (Matt H, 2026-05-12)
- 907281a - chore: generate (opencode-agent[bot], 2026-05-12)
- 3992e2a - feat(app): add ctrl/cmd+number keybinds to switch projects (#26280) (Brendan Allan, 2026-05-12)
- ea6eabe - chore: generate (opencode-agent[bot], 2026-05-12)
- 36d40fe - Track session usage totals (#26644) (Dax, 2026-05-12)
- e36bc20 - fix(tui): fix flicker by avoiding redundant workspace session sync (#26997) (James Long, 2026-05-12)
- 4875757 - feat: create global opencode.jsonc if no configs exist (#26992) (Aiden Cline, 2026-05-11)
- 5cc8480 - chore: generate (opencode-agent[bot], 2026-05-12)
- 2b432d9 - fix(tui): scope events by project (#26936) (James Long, 2026-05-11)
- 591eb66 - chore: generate (opencode-agent[bot], 2026-05-12)
- ddce776 - ignore: add codebase skill to repo (#26990) (Aiden Cline, 2026-05-12)
- 1a28924 - fix: grep external directory permission evaluation (#26958) (Aiden Cline, 2026-05-11)
- 8713748 - fix(app): use keyed Show for project in layout (#26985) (Brendan Allan, 2026-05-12)
- 78a2639 - fix(app): open next project when closing current one (#26987) (Brendan Allan, 2026-05-12)
- cc1835e - test(provider): migrate config-backed cases to Effect runner (#26969) (Kit Langton, 2026-05-12)
- 0f5d4ae - test(project): stabilize VCS branch update test (#26979) (Kit Langton, 2026-05-11)
- ce72020 - test(tool): migrate edit tests to Effect runner (#26977) (Kit Langton, 2026-05-11)
- c43d606 - agent: use Effect schema for generated agent object (#26973) (Kit Langton, 2026-05-11)
- 1007630 - Migrate runtime validators to Effect Schema (#26975) (Kit Langton, 2026-05-11)
- 9e8274d - Remove internal Zod schemas (#26974) (Kit Langton, 2026-05-11)
- 74aa735 - fix(tui): guard prompt submit against concurrent invocation (#26972) (Kit Langton, 2026-05-12)
- 8030a6c - Emit LLM stream lifecycle events (#26971) (Kit Langton, 2026-05-11)
- e5aa516 - Remove effect-zod bridge (#26956) (Kit Langton, 2026-05-11)
- abb1ee6 - docs(test): add Effect migration orchestration notes (#26963) (Kit Langton, 2026-05-11)
- c400357 - test(project): migrate VCS tests to Effect runner (#26965) (Kit Langton, 2026-05-11)
- 0d9c534 - test(snapshot): migrate snapshot tests to Effect runner (#26964) (Kit Langton, 2026-05-11)
- 5773d43 - ci: GitHub Actions dependencies (#26962) (Aiden Cline, 2026-05-11)
- e0e9414 - chore: generate (opencode-agent[bot], 2026-05-12)
- 44edb63 - test(session): migrate message pagination to Effect runner (#26957) (Kit Langton, 2026-05-12)
- fbd52ca - test(file): migrate file tests to Effect runner (#26959) (Kit Langton, 2026-05-12)
- 8015ff7 - chore: generate (opencode-agent[bot], 2026-05-12)
- ec95841 - docs(test): plan Effect test migration (#26954) (Kit Langton, 2026-05-11)
- 061efc6 - Fix run JSON output draining (#26955) (Kit Langton, 2026-05-11)
- fe374ae - feat(app): persist todo dock collapsed state (#26953) (Brendan Allan, 2026-05-11)
- 46edc98 - Validate TUI config with Effect Schema (#26952) (Kit Langton, 2026-05-11)
- fdeb274 - test(agent): isolate plugin agent regression (#26948) (Kit Langton, 2026-05-11)
- 59e6967 - Generate config schema from Effect Schema (#26939) (Kit Langton, 2026-05-11)
- 0c619cb - chore: generate (opencode-agent[bot], 2026-05-11)
- 0cf9010 - zen: tps rate limit (Frank, 2026-05-11)
- 812668a - Generate TUI schema from Effect Schema (#26945) (Kit Langton, 2026-05-11)
- a5c35bf - Avoid bootstrapping server plugins from TUI plugin runtime (#26938) (Kit Langton, 2026-05-11)
- bdd5a80 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-11)
- fd65d29 - Drop unused opencode Zod statics (#26935) (Kit Langton, 2026-05-11)
- d3caac5 - chore(deps): upgrade effect to 4.0.0-beta.65 (#26934) (Kit Langton, 2026-05-11)
- fe7ca34 - Drop Config Info Zod static (#26933) (Kit Langton, 2026-05-11)
- cc95197 - Drop prompt input Zod statics (#26923) (Kit Langton, 2026-05-11)
- 9067218 - fix(core): always start worktrees as detached (#26931) (James Long, 2026-05-11)
- 42a0453 - Drop small session Zod statics (#26921) (Kit Langton, 2026-05-11)
- 4d9eb6c - Validate structured output tests with Effect Schema (#26919) (Kit Langton, 2026-05-11)
- c060c43 - Drop LSP config Zod statics (#26920) (Kit Langton, 2026-05-11)
- 45adfed - Drop unused domain Zod statics (#26927) (Kit Langton, 2026-05-11)
- 0bced8e - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-11)
- 8d9b971 - Drop unused small ID Zod statics (#26908) (Kit Langton, 2026-05-11)
- c7e084c - Simplify single-backend HttpApi exerciser (#26906) (Kit Langton, 2026-05-11)
- 6f2f759 - Clean up post-Hono references (#26903) (Kit Langton, 2026-05-11)
- cddab63 - chore: generate (opencode-agent[bot], 2026-05-11)
- 12583b1 - feat(tui): pin, quick-switch, and cycle recent sessions (#26858) (Shoubhit Dash, 2026-05-11)
- df386bd - feat(skill): enable customize-opencode by default, link full schema (#26899) (Kit Langton, 2026-05-11)
- 25b12ed - chore: generate (opencode-agent[bot], 2026-05-11)
- 023e1c7 - refactor(llm): colocate per-type factories on their namespaces (#26799) (Kit Langton, 2026-05-11)
- 52f7ba7 - fix(llm): drop removed dispatch option from recorded cache tests (#26900) (Kit Langton, 2026-05-11)
- 19fce2b - chore: generate (opencode-agent[bot], 2026-05-11)
- 4bae84c - feat(scout): autocomplete configured mentions (#26843) (Shoubhit Dash, 2026-05-11)
- f240bba - chore(http-recorder): remove content-matching dispatch mode (#26792) (Kit Langton, 2026-05-11)
- bcee247 - Define project update input with Effect Schema (#26803) (Kit Langton, 2026-05-11)
- 64c5042 - Parse command config with Effect Schema (#26801) (Kit Langton, 2026-05-11)
- 6592d80 - chore: generate (opencode-agent[bot], 2026-05-11)
- d821650 - add default diff parser for markdown fenced code blocks (#26887) (Sebastian, 2026-05-11)
- 6c9f12b - chore: exclude status 429 from free model alerts (#26879) (Victor Navarro, 2026-05-11)
- fca89e5 - chore: generate (opencode-agent[bot], 2026-05-11)
- 1eff01b - sync (Frank, 2026-05-11)
- e93b1f3 - chore: generate (opencode-agent[bot], 2026-05-11)
- 8874d4a - zen: deekseek v4 flash free (Frank, 2026-05-11)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/codesearch.ts` (+0, -63)
- `packages/opencode/src/tool/codesearch.txt` (+0, -12)
- `packages/opencode/src/tool/grep.ts` (+11, -10)
- `packages/opencode/src/tool/json-schema.ts` (+164, -0)
- `packages/opencode/src/tool/mcp-websearch.ts` (+0, -5)
- `packages/opencode/src/tool/registry.ts` (+64, -13)
- `packages/opencode/src/tool/schema.ts` (+0, -2)
- `packages/opencode/src/tool/tool.ts` (+2, -0)
- `packages/opencode/src/tool/webfetch.ts` (+3, -2)
- `packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap` (+15, -9)
- `packages/opencode/test/tool/edit.test.ts` (+399, -597)
- `packages/opencode/test/tool/grep.test.ts` (+53, -0)
- `packages/opencode/test/tool/parameters.test.ts` (+35, -3)
- `packages/opencode/test/tool/registry.test.ts` (+88, -4)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+12, -12)
- `packages/opencode/test/agent/plugin-agent-regression.test.ts` (+27, -1)

#### Permission System (**/permission/)
- `packages/opencode/src/permission/index.ts` (+9, -27)
- `packages/opencode/src/permission/schema.ts` (+0, -3)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/console/core/migrations/20260511220522_fine_shaman/migration.sql` (+7, -0)
- `packages/console/core/migrations/20260511220522_fine_shaman/snapshot.json` (+2685, -0)
- `packages/console/core/src/model.ts` (+1, -0)
- `packages/console/core/src/schema/ip.sql.ts` (+11, -0)
- `packages/core/src/effect-zod.ts` (+0, -370)
- `packages/core/src/flag/flag.ts` (+1, -11)
- `packages/core/src/schema.ts` (+0, -2)

#### Other Changes
- `.github/actions/setup-bun/action.yml` (+2, -2)
- `.github/actions/setup-git-committer/action.yml` (+1, -1)
- `.github/workflows/beta.yml` (+1, -1)
- `.github/workflows/close-issues.yml` (+2, -2)
- `.github/workflows/close-stale-prs.yml` (+1, -1)
- `.github/workflows/compliance-close.yml` (+1, -1)
- `.github/workflows/containers.yml` (+4, -4)
- `.github/workflows/deploy.yml` (+2, -2)
- `.github/workflows/docs-locale-sync.yml` (+1, -1)
- `.github/workflows/docs-update.yml` (+2, -2)
- `.github/workflows/duplicate-issues.yml` (+2, -2)
- `.github/workflows/generate.yml` (+1, -1)
- `.github/workflows/nix-eval.yml` (+2, -2)
- `.github/workflows/nix-hashes.yml` (+5, -5)
- `.github/workflows/notify-discord.yml` (+1, -1)
- `.github/workflows/opencode.yml` (+2, -2)
- `.github/workflows/pr-management.yml` (+2, -2)
- `.github/workflows/pr-standards.yml` (+2, -2)
- `.github/workflows/publish-github-action.yml` (+1, -1)
- `.github/workflows/publish-vscode.yml` (+1, -1)
- `.github/workflows/publish.yml` (+26, -26)
- `.github/workflows/release-github-action.yml` (+1, -1)
- `.github/workflows/review.yml` (+1, -1)
- `.github/workflows/stats.yml` (+1, -1)
- `.github/workflows/storybook.yml` (+1, -1)
- `.github/workflows/sync-zed-extension.yml` (+1, -1)
- `.github/workflows/test.yml` (+9, -9)
- `.github/workflows/triage.yml` (+1, -1)
- `.github/workflows/typecheck.yml` (+1, -1)
- `.opencode/opencode.jsonc` (+1, -5)
- `.opencode/skills/improve-codebase-architecture/DEEPENING.md` (+37, -0)
- `.opencode/skills/improve-codebase-architecture/INTERFACE-DESIGN.md` (+44, -0)
- `.opencode/skills/improve-codebase-architecture/LANGUAGE.md` (+53, -0)
- `.opencode/skills/improve-codebase-architecture/SKILL.md` (+71, -0)
- `bun.lock` (+7, -13)
- `infra/monitoring.ts` (+38, -24)
- `nix/hashes.json` (+4, -4)
- `package.json` (+3, -3)
- `packages/app/src/components/dialog-select-file.tsx` (+2, -1)
- `packages/app/src/components/dialog-select-mcp.tsx` (+4, -2)
- `packages/app/src/components/prompt-input.tsx` (+6, -6)
- `packages/app/src/components/settings-keybinds.tsx` (+2, -0)
- `packages/app/src/components/status-popover-body.tsx` (+4, -2)
- `packages/app/src/context/command.tsx` (+10, -7)
- `packages/app/src/context/global-sync.tsx` (+43, -28)
- `packages/app/src/context/global-sync/child-store.test.ts` (+1, -1)
- `packages/app/src/context/global-sync/child-store.ts` (+7, -10)
- `packages/app/src/context/layout.tsx` (+13, -0)
- `packages/app/src/i18n/en.ts` (+1, -0)
- `packages/app/src/pages/layout.tsx` (+33, -17)
- `packages/app/src/pages/layout/sidebar-workspace.tsx` (+5, -3)
- `packages/app/src/pages/session/composer/session-composer-region.tsx` (+5, -0)
- `packages/app/src/pages/session/composer/session-todo-dock.tsx` (+10, -11)
- `packages/console/app/src/routes/zen/util/handler.ts` (+24, -4)
- `packages/console/app/src/routes/zen/util/modelTpsLimiter.ts` (+89, -0)
- `packages/console/function/package.json` (+0, -2)
- `packages/desktop/src/main/index.ts` (+11, -17)
- `packages/desktop/src/main/server.ts` (+0, -2)
- `packages/http-recorder/README.md` (+9, -14)
- `packages/http-recorder/src/effect.ts` (+3, -7)
- `packages/http-recorder/src/matching.ts` (+0, -18)
- `packages/http-recorder/test/record-replay.test.ts` (+7, -32)
- `packages/llm/AGENTS.md` (+8, -4)
- `packages/llm/src/llm.ts` (+4, -28)
- `packages/llm/src/protocols/anthropic-messages.ts` (+67, -35)
- `packages/llm/src/protocols/bedrock-converse.ts` (+73, -19)
- `packages/llm/src/protocols/gemini.ts` (+17, -9)
- `packages/llm/src/protocols/openai-chat.ts` (+14, -4)
- `packages/llm/src/protocols/openai-responses.ts` (+51, -27)
- `packages/llm/src/protocols/utils/lifecycle.ts` (+88, -0)
- `packages/llm/src/protocols/utils/tool-stream.ts` (+47, -15)
- `packages/llm/src/tool-runtime.ts` (+2, -2)
- `packages/llm/test/cache-policy.test.ts` (+9, -5)
- `packages/llm/test/llm.test.ts` (+14, -14)
- `packages/llm/test/provider/anthropic-messages-cache.recorded.test.ts` (+2, -3)
- `packages/llm/test/provider/anthropic-messages.recorded.test.ts` (+5, -5)
- `packages/llm/test/provider/anthropic-messages.test.ts` (+45, -23)
- `packages/llm/test/provider/bedrock-converse-cache.recorded.test.ts` (+2, -3)
- `packages/llm/test/provider/bedrock-converse.test.ts` (+16, -16)
- `packages/llm/test/provider/gemini-cache.recorded.test.ts` (+2, -3)
- `packages/llm/test/provider/gemini.test.ts` (+61, -33)
- `packages/llm/test/provider/openai-chat.test.ts` (+43, -25)
- `packages/llm/test/provider/openai-compatible-chat.test.ts` (+4, -4)
- `packages/llm/test/provider/openai-responses-cache.recorded.test.ts` (+3, -3)
- `packages/llm/test/provider/openai-responses.test.ts` (+59, -29)
- `packages/llm/test/recorded-scenarios.ts` (+3, -3)
- `packages/llm/test/tool-runtime.test.ts` (+11, -4)
- `packages/llm/test/tool-stream.test.ts` (+15, -4)
- `packages/opencode/migration/20260510033149_session_usage/migration.sql` (+6, -0)
- `packages/opencode/migration/20260510033149_session_usage/snapshot.json` (+1519, -0)
- `packages/opencode/parsers-config.ts` (+10, -0)
- `packages/opencode/script/schema.ts` (+60, -47)
- `packages/opencode/specs/effect/errors.md` (+8, -7)
- `packages/opencode/specs/effect/migration.md` (+2, -10)
- `packages/opencode/specs/effect/routes.md` (+10, -17)
- `packages/opencode/specs/effect/schema.md` (+41, -87)
- `packages/opencode/specs/effect/server-package.md` (+42, -652)
- `packages/opencode/specs/openapi-translation-cleanup.md` (+1, -1)
- `packages/opencode/src/auth/index.ts` (+2, -4)
- `packages/opencode/src/cli/cmd/run.ts` (+6, -4)
- `packages/opencode/src/cli/cmd/stats.ts` (+2, -10)
- `packages/opencode/src/cli/cmd/tui/app.tsx` (+50, -1)
- `packages/opencode/src/cli/cmd/tui/component/dialog-session-list.tsx` (+95, -36)
- `packages/opencode/src/cli/cmd/tui/component/prompt/autocomplete.tsx` (+147, -3)
- `packages/opencode/src/cli/cmd/tui/component/prompt/index.tsx` (+19, -1)
- `packages/opencode/src/cli/cmd/tui/config/keybind.ts` (+91, -40)
- `packages/opencode/src/cli/cmd/tui/config/tui-migrate.ts` (+28, -26)
- `packages/opencode/src/cli/cmd/tui/config/tui-schema.ts` (+26, -28)
- `packages/opencode/src/cli/cmd/tui/config/tui.ts` (+21, -13)
- `packages/opencode/src/cli/cmd/tui/context/editor-zed.ts` (+25, -22)
- `packages/opencode/src/cli/cmd/tui/context/editor.ts` (+85, -76)
- `packages/opencode/src/cli/cmd/tui/context/event.ts` (+13, -19)
- `packages/opencode/src/cli/cmd/tui/context/local.tsx` (+191, -1)
- `packages/opencode/src/cli/cmd/tui/context/sync.tsx` (+6, -8)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/home/tips-view.tsx` (+9, -0)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/sidebar/context.tsx` (+2, -1)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/system/session-v2.tsx` (+0, -12)
- `packages/opencode/src/cli/cmd/tui/plugin/api.tsx` (+3, -0)
- `packages/opencode/src/cli/cmd/tui/plugin/runtime.ts` (+30, -39)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+5, -4)
- `packages/opencode/src/cli/cmd/tui/routes/session/subagent-footer.tsx` (+1, -1)
- `packages/opencode/src/command/index.ts` (+2, -8)
- `packages/opencode/src/config/agent.ts` (+3, -6)
- `packages/opencode/src/config/attachment.ts` (+3, -8)
- `packages/opencode/src/config/command.ts` (+8, -8)
- `packages/opencode/src/config/config.ts` (+16, -25)
- `packages/opencode/src/config/console-state.ts` (+1, -4)
- `packages/opencode/src/config/formatter.ts` (+2, -6)
- `packages/opencode/src/config/layout.ts` (+1, -5)
- `packages/opencode/src/config/lsp.ts` (+3, -5)
- `packages/opencode/src/config/mcp.ts` (+5, -14)
- `packages/opencode/src/config/model-id.ts` (+1, -10)
- `packages/opencode/src/config/parse.ts` (+2, -14)
- `packages/opencode/src/config/permission.ts` (+4, -19)
- `packages/opencode/src/config/plugin.ts` (+2, -6)
- `packages/opencode/src/config/provider.ts` (+3, -6)
- `packages/opencode/src/config/reference.ts` (+1, -5)
- `packages/opencode/src/config/server.ts` (+2, -5)
- `packages/opencode/src/config/skills.ts` (+1, -3)
- `packages/opencode/src/control-plane/adapters/worktree.ts` (+3, -5)
- `packages/opencode/src/control-plane/types.ts` (+3, -3)
- `packages/opencode/src/data-migration.ts` (+101, -2)
- `packages/opencode/src/file/index.ts` (+4, -11)
- `packages/opencode/src/file/ripgrep.ts` (+2, -3)
- `packages/opencode/src/file/watcher.ts` (+0, -1)
- `packages/opencode/src/format/index.ts` (+1, -5)
- `packages/opencode/src/installation/index.ts` (+5, -10)
- `packages/opencode/src/lsp/lsp.ts` (+6, -18)
- `packages/opencode/src/mcp/auth.ts` (+27, -25)
- `packages/opencode/src/mcp/index.ts` (+2, -8)
- `packages/opencode/src/patch/index.ts` (+4, -5)
- `packages/opencode/src/plugin/github-copilot/models.ts` (+39, -38)
- `packages/opencode/src/project/project.ts` (+9, -15)
- `packages/opencode/src/project/schema.ts` (+0, -2)
- `packages/opencode/src/project/vcs.ts` (+6, -14)
- `packages/opencode/src/provider/auth.ts` (+6, -11)
- `packages/opencode/src/provider/provider.ts` (+5, -10)
- `packages/opencode/src/provider/schema.ts` (+1, -7)
- `packages/opencode/src/provider/transform.ts` (+6, -4)
- `packages/opencode/src/pty/index.ts` (+4, -7)
- `packages/opencode/src/pty/schema.ts` (+0, -2)
- `packages/opencode/src/question/index.ts` (+7, -23)
- `packages/opencode/src/question/schema.ts` (+0, -3)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/experimental.ts` (+2, -2)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/provider.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/pty.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/session.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/compression.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/public.ts` (+4, -4)
- `packages/opencode/src/session/message-v2.ts` (+44, -105)
- `packages/opencode/src/session/message.ts` (+16, -38)
- `packages/opencode/src/session/projectors.ts` (+51, -0)
- `packages/opencode/src/session/prompt.ts` (+84, -52)
- `packages/opencode/src/session/revert.ts` (+1, -3)
- `packages/opencode/src/session/session.sql.ts` (+8, -2)
- `packages/opencode/src/session/session.ts` (+45, -20)
- `packages/opencode/src/session/status.ts` (+2, -6)
- `packages/opencode/src/session/summary.ts` (+1, -3)
- `packages/opencode/src/session/todo.ts` (+1, -6)
- `packages/opencode/src/skill/index.ts` (+6, -10)
- `packages/opencode/src/skill/prompt/customize-opencode.md` (+36, -13)
- `packages/opencode/src/snapshot/index.ts` (+2, -7)
- `packages/opencode/src/storage/json-migration.ts` (+6, -0)
- `packages/opencode/src/sync/README.md` (+10, -10)
- `packages/opencode/src/sync/schema.ts` (+0, -2)
- `packages/opencode/src/util/named-schema-error.ts` (+3, -13)
- `packages/opencode/src/v2/session.ts` (+20, -0)
- `packages/opencode/src/worktree/index.ts` (+30, -19)
- `packages/opencode/test/EFFECT_TEST_MIGRATION.md` (+225, -0)
- `packages/opencode/test/cli/cmd/tui/sync-fixture.tsx` (+28, -5)
- `packages/opencode/test/cli/cmd/tui/sync.test.tsx` (+41, -1)
- `packages/opencode/test/cli/tui/plugin-loader.test.ts` (+31, -1)
- `packages/opencode/test/cli/tui/prompt-submit-race.test.ts` (+98, -0)
- `packages/opencode/test/cli/tui/use-event.test.tsx` (+31, -27)
- `packages/opencode/test/config/config.test.ts` (+57, -9)
- `packages/opencode/test/config/lsp.test.ts` (+0, -18)
- `packages/opencode/test/effect/runner.test.ts` (+10, -3)
- `packages/opencode/test/fake/account.ts` (+9, -0)
- `packages/opencode/test/fake/auth.ts` (+8, -0)
- `packages/opencode/test/fake/npm.ts` (+8, -0)
- `packages/opencode/test/fake/skill.ts` (+8, -0)
- `packages/opencode/test/file/index.test.ts` (+768, -854)
- `packages/opencode/test/fixture/tui-plugin.ts` (+1, -0)
- `packages/opencode/test/preload.ts` (+0, -5)
- `packages/opencode/test/project/instance-bootstrap.test.ts` (+1, -3)
- `packages/opencode/test/project/vcs.test.ts` (+290, -302)
- `packages/opencode/test/project/worktree.test.ts` (+54, -9)
- `packages/opencode/test/provider/provider.test.ts` (+60, -73)
- `packages/opencode/test/server/global-session-list.test.ts` (+1, -3)
- `packages/opencode/test/server/httpapi-config.test.ts` (+1, -1)
- `packages/opencode/test/server/httpapi-exercise/backend.ts` (+7, -16)
- `packages/opencode/test/server/httpapi-exercise/runner.ts` (+12, -12)
- `packages/opencode/test/server/httpapi-exercise/types.ts` (+0, -1)
- `packages/opencode/test/server/httpapi-experimental.test.ts` (+4, -5)
- `packages/opencode/test/server/httpapi-instance.test.ts` (+2, -3)
- `packages/opencode/test/session/compaction.test.ts` (+2, -2)
- `packages/opencode/test/session/messages-pagination.test.ts` (+570, -738)
- `packages/opencode/test/session/prompt.test.ts` (+67, -1)
- `packages/opencode/test/session/retry.test.ts` (+12, -12)
- `packages/opencode/test/session/schema-decoding.test.ts` (+2, -35)
- `packages/opencode/test/session/session-schema.test.ts` (+2, -0)
- `packages/opencode/test/session/structured-output.test.ts` (+35, -30)
- `packages/opencode/test/skill/skill.test.ts` (+10, -10)
- `packages/opencode/test/snapshot/snapshot.test.ts` (+1023, -1437)
- `packages/opencode/test/util/effect-zod.test.ts` (+0, -754)
- `packages/plugin/src/tui.ts` (+2, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+46, -7)
- `packages/sdk/openapi.json` (+147, -8)
- `packages/web/src/content/docs/ar/zen.mdx` (+46, -42)
- `packages/web/src/content/docs/bs/zen.mdx` (+46, -42)
- `packages/web/src/content/docs/da/zen.mdx` (+46, -42)
- `packages/web/src/content/docs/de/zen.mdx` (+46, -42)
- `packages/web/src/content/docs/es/zen.mdx` (+46, -42)
- `packages/web/src/content/docs/fr/zen.mdx` (+46, -42)
- `packages/web/src/content/docs/it/zen.mdx` (+46, -42)
- `packages/web/src/content/docs/ja/zen.mdx` (+46, -42)
- `packages/web/src/content/docs/ko/zen.mdx` (+46, -42)
- `packages/web/src/content/docs/nb/zen.mdx` (+46, -42)
- `packages/web/src/content/docs/pl/zen.mdx` (+46, -42)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+46, -42)
- `packages/web/src/content/docs/ru/zen.mdx` (+46, -42)
- `packages/web/src/content/docs/th/zen.mdx` (+46, -42)
- `packages/web/src/content/docs/tr/zen.mdx` (+46, -42)
- `packages/web/src/content/docs/tui.mdx` (+6, -0)
- `packages/web/src/content/docs/zen.mdx` (+46, -42)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+46, -42)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+46, -42)
- `specs/v2/todo.md` (+4, -2)

### Key Diffs

#### packages/console/core/migrations/20260511220522_fine_shaman/migration.sql
```diff
diff --git a/packages/console/core/migrations/20260511220522_fine_shaman/migration.sql b/packages/console/core/migrations/20260511220522_fine_shaman/migration.sql
new file mode 100644
index 0000000..3af8255
--- /dev/null
+++ b/packages/console/core/migrations/20260511220522_fine_shaman/migration.sql
@@ -0,0 +1,7 @@
+CREATE TABLE `model_tps_rate_limit` (
+	`id` varchar(255) NOT NULL,
+	`interval` bigint NOT NULL,
+	`qualify` int NOT NULL,
+	`unqualify` int NOT NULL,
+	CONSTRAINT PRIMARY KEY(`id`,`interval`)
+);
```

#### packages/console/core/migrations/20260511220522_fine_shaman/snapshot.json
```diff
diff --git a/packages/console/core/migrations/20260511220522_fine_shaman/snapshot.json b/packages/console/core/migrations/20260511220522_fine_shaman/snapshot.json
new file mode 100644
index 0000000..b175f6d
--- /dev/null
+++ b/packages/console/core/migrations/20260511220522_fine_shaman/snapshot.json
@@ -0,0 +1,2685 @@
+{
+  "version": "6",
+  "dialect": "mysql",
+  "id": "c742e0f2-5d89-4216-b843-059d00680f13",
+  "prevIds": ["b3b243c0-8097-4d8a-a439-243d5a7d543f"],
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

#### packages/console/core/src/model.ts
```diff
diff --git a/packages/console/core/src/model.ts b/packages/console/core/src/model.ts
index dc3febe..b0851c4 100644
--- a/packages/console/core/src/model.ts
+++ b/packages/console/core/src/model.ts
@@ -36,6 +36,7 @@ export namespace ZenData {
         model: z.string(),
         priority: z.number().optional(),
         tpmLimit: z.number().optional(),
+        tpsGoal: z.number().optional(),
         weight: z.number().optional(),
         disabled: z.boolean().optional(),
         storeModel: z.string().optional(),
```

#### packages/console/core/src/schema/ip.sql.ts
```diff
diff --git a/packages/console/core/src/schema/ip.sql.ts b/packages/console/core/src/schema/ip.sql.ts
index 94087ab..975dcfa 100644
--- a/packages/console/core/src/schema/ip.sql.ts
+++ b/packages/console/core/src/schema/ip.sql.ts
@@ -40,3 +40,14 @@ export const ModelTpmRateLimitTable = mysqlTable(
   },
   (table) => [primaryKey({ columns: [table.id, table.interval] })],
 )
+
+export const ModelTpsRateLimitTable = mysqlTable(
+  "model_tps_rate_limit",
+  {
+    id: varchar("id", { length: 255 }).notNull(),
+    interval: bigint("interval", { mode: "number" }).notNull(),
+    qualify: int("qualify").notNull(),
+    unqualify: int("unqualify").notNull(),
+  },
+  (table) => [primaryKey({ columns: [table.id, table.interval] })],
+)
```

#### packages/core/src/effect-zod.ts
```diff
diff --git a/packages/core/src/effect-zod.ts b/packages/core/src/effect-zod.ts
deleted file mode 100644
index 42d89ec..0000000
--- a/packages/core/src/effect-zod.ts
+++ /dev/null
@@ -1,370 +0,0 @@
-import { Effect, Option, Schema, SchemaAST } from "effect"
-import z from "zod"
-
-/**
- * Annotation key for providing a hand-crafted Zod schema that the walker
- * should use instead of re-deriving from the AST.  Attach it via
- * `Schema.String.annotate({ [ZodOverride]: z.string().startsWith("per") })`.
- */
-export const ZodOverride: unique symbol = Symbol.for("effect-zod/override")
-
-// AST nodes are immutable and frequently shared across schemas (e.g. a single
-// Schema.Class embedded in multiple parents). Memoizing by node identity
-// avoids rebuilding equivalent Zod subtrees and keeps derived children stable
-// by reference across callers.
-const walkCache = new WeakMap<SchemaAST.AST, z.ZodTypeAny>()
-
-// Shared empty ParseOptions for the rare callers that need one — avoids
-// allocating a fresh object per parse inside refinements and transforms.
-const EMPTY_PARSE_OPTIONS = {} as SchemaAST.ParseOptions
-
-export function zod<S extends Schema.Top>(schema: S): z.ZodType<Schema.Schema.Type<S>> {
-  return walk(schema.ast) as z.ZodType<Schema.Schema.Type<S>>
-}
-
-/**
- * Derive a Zod value from an Effect Schema (or a Schema-backed export with a
- * `.zod` static) and narrow the result to `z.ZodObject<any>` so `.shape`,
- * `.omit`, `.extend`, and friends are accessible.
- *
- * The `zod()` walker returns `z.ZodType<T>` because not every AST node decodes
- * to an object; this helper keeps the "I started from a `Schema.Struct`" cast
- * in one place instead of sprinkling `as unknown as z.ZodObject<any>` across
- * call sites.
- *
- * The return is intentionally loose — carrying Schema field types through the
- * mapped `.omit()` / `.extend()` surface triggers brand-intersection
- * explosions for branded primitives (`string & Brand<"SessionID">` extends
- * `object` via the brand and gets walked into the prototype by `DeepPartial`,
- * mapped-schema helpers, and zod's inference through `z.ZodType<T | undefined>`
- * wrappers also can't reconstruct `T` cleanly. Consumers that care about the
- * post-`.omit()` shape should cast `c.req.valid(...)` to the expected type.
- */
-export function zodObject<S extends Schema.Top>(schema: S): z.ZodObject<any> {
-  const derived: z.ZodTypeAny = "zod" in schema && isZodType(schema.zod) ? schema.zod : walk(schema.ast)
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/src/agent/agent.ts
- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/test/agent/plugin-agent-regression.test.ts
- `src/core/` - review core changes from packages/core/package.json
- `src/tool/bash.ts` - update based on kilocode packages/opencode/src/tool/bash.ts changes
- `src/tool/codesearch.ts` - update based on opencode packages/opencode/src/tool/codesearch.ts changes
- `src/tool/codesearch.txt.ts` - update based on opencode packages/opencode/src/tool/codesearch.txt changes
- `src/tool/edit.test.ts` - update based on opencode packages/opencode/test/tool/edit.test.ts changes
- `src/tool/grep.test.ts` - update based on opencode packages/opencode/test/tool/grep.test.ts changes
- `src/tool/grep.ts` - update based on opencode packages/opencode/src/tool/grep.ts changes
- `src/tool/json-schema.ts` - update based on opencode packages/opencode/src/tool/json-schema.ts changes
- `src/tool/mcp-websearch.ts` - update based on opencode packages/opencode/src/tool/mcp-websearch.ts changes
- `src/tool/parameters.test.ts.snap.ts` - update based on opencode packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap changes
- `src/tool/parameters.test.ts` - update based on opencode packages/opencode/test/tool/parameters.test.ts changes
- `src/tool/registry.test.ts` - update based on opencode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on opencode packages/opencode/src/tool/registry.ts changes
- `src/tool/schema.ts` - update based on opencode packages/opencode/src/tool/schema.ts changes
- `src/tool/semantic-search.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/semantic-search.txt changes
- `src/tool/task.test.ts` - update based on kilocode packages/opencode/test/tool/task.test.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/kilocode/tool/task.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/tool/task.ts changes
- `src/tool/tool.ts` - update based on opencode packages/opencode/src/tool/tool.ts changes
- `src/tool/webfetch.ts` - update based on kilocode packages/opencode/src/tool/webfetch.ts changes
- `src/tool/webfetch.ts` - update based on opencode packages/opencode/src/tool/webfetch.ts changes
