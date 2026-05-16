# Upstream Changes Report
Generated: 2026-05-15 08:50:27

## Summary
- kilocode: 68 commits, 190 files changed
- opencode: 69 commits, 191 files changed

## kilocode Changes (c60006514..8de6c2ea8)

### Commits

- 8de6c2ea8 - release: v7.2.54 (kilo-maintainer[bot], 2026-05-15)
- b3393c739 - Merge pull request #10275 from Kilo-Org/bolder-petroleum (Marius, 2026-05-15)
- f5dc95b99 - fix(vscode): preserve spoken transcription wording (marius-kilocode, 2026-05-15)
- a4218d893 - Merge pull request #9801 from Kilo-Org/morning-tibia (Kirill Kalishev, 2026-05-14)
- 3f4237331 - Merge pull request #10222 from Kilo-Org/kiwi-acorn (Kirill Kalishev, 2026-05-14)
- 7bc46c54d - Merge pull request #10263 from Kilo-Org/axiomatic-gouda (Catriel Müller, 2026-05-14)
- 410bae8c2 - ci: add publish-jetbrains.yml to workflow allowlist (kirillk, 2026-05-14)
- 9a8225cbb - ci(jetbrains): require v-prefixed publish tags (kirillk, 2026-05-14)
- 5e4682338 - revert: remove out-of-scope fix in KiloBackendSessionManager (kirillk, 2026-05-14)
- c4716769e - Merge branch 'main' into morning-tibia (kirillk, 2026-05-14)
- 43d9dd23e - fix: comment (Catriel Müller, 2026-05-14)
- fe969a18e - fix(vscode): update speech capture tooltip (#10266) (Marius, 2026-05-14)
- 0f1626420 - fix: tests (Catriel Müller, 2026-05-14)
- 47f65f76e - Merge pull request #10265 from Kilo-Org/fix/vscode-snapshot-cli-rebuild (Marius, 2026-05-14)
- 78db58e59 - Merge pull request #10264 from Kilo-Org/mark/copy-tooltip-top (Mark IJbema, 2026-05-14)
- 900ba85b8 - fix(vscode): rebuild CLI for snapshot installs (marius-kilocode, 2026-05-14)
- 1d80231da - refactor: address the comments (Catriel Müller, 2026-05-14)
- 262c2d670 - fix(ui): place copy tooltip above button to avoid overlapping thumbs (kiloconnect[bot], 2026-05-14)
- c1a797c1f - fix(cli): chunk oversized compactions (Catriel Müller, 2026-05-14)
- cb83e473c - Merge pull request #10258 from Kilo-Org/cedar-titanosaurus (Marius, 2026-05-14)
- 576babe9f - fix(vscode): lock speech capture during startup (marius-kilocode, 2026-05-14)
- 03239c071 - refactor(vscode): simplify speech input wiring (marius-kilocode, 2026-05-14)
- 3885ff817 - fix(vscode): address speech input review issues (marius-kilocode, 2026-05-14)
- 78ffce39d - fix(vscode): expand ffmpeg fallback paths (marius-kilocode, 2026-05-14)
- c2220dc3d - Merge pull request #10256 from Kilo-Org/silky-naranja (Marius, 2026-05-14)
- 39635122a - chore: address speech input review feedback (marius-kilocode, 2026-05-14)
- 1e397c305 - chore: address speech input review (marius-kilocode, 2026-05-14)
- 1daaa0a8d - fix(agent-manager): remove redundant terminal comments cast (marius-kilocode, 2026-05-14)
- 5c9fc5b40 - chore: remove speech input plan (marius-kilocode, 2026-05-14)
- 5b841e97f - Merge remote-tracking branch 'origin/main' into cedar-titanosaurus (marius-kilocode, 2026-05-14)
- 09cb91681 - chore: keep bun lock unchanged (marius-kilocode, 2026-05-14)
- 0f76700e7 - chore: restore bun lockfile (marius-kilocode, 2026-05-14)
- 1af79731a - feat(vscode): add speech-to-text prompt input (marius-kilocode, 2026-05-14)
- da9292fbc - fix(agent-manager): support diff sidebar with terminals (marius-kilocode, 2026-05-14)
- 752022556 - Merge pull request #10243 from Kilo-Org/holistic-diadem (Marius, 2026-05-14)
- 47c22a28e - fix(ui): preserve chat tool collapse state (marius-kilocode, 2026-05-14)
- ddf3ea691 - Merge pull request #10240 from Kilo-Org/harmless-perfume (Marius, 2026-05-14)
- 09f0156bf - fix(vscode): keep worktree model search open (marius-kilocode, 2026-05-14)
- 1fbe69603 - Merge pull request #10228 from Kilo-Org/supersede-shell-command-highlighting (Marius, 2026-05-14)
- a19c91f83 - Merge pull request #10214 from Kilo-Org/docs/update-mobile-apps (arrrkady, 2026-05-14)
- 0baee717e - Merge pull request #10227 from Kilo-Org/island-medusaceratops (Marius, 2026-05-14)
- 710b9c513 - Merge pull request #10230 from Kilo-Org/pear-rudbeckia (Marius, 2026-05-14)
- f14c03165 - Merge pull request #10235 from Kilo-Org/mark/upstream-merge-no-minimizer-skill (Mark IJbema, 2026-05-14)
- 52b4350bc - docs(agent): forbid kilocode-merge-minimizer skill in upstream-merge agent (kiloconnect[bot], 2026-05-14)
- a41be4c84 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-05-14)
- af5c05de7 - fix(vscode): use inert instead of aria-hidden on collapsed sidebar (marius-kilocode, 2026-05-14)
- 1abd32ecc - fix(ui): cancel stale shell highlighting (marius-kilocode, 2026-05-14)
- 26f5393be - feat(vscode): collapsible Agent Manager sidebar with persistent state (marius-kilocode, 2026-05-14)
- dea616934 - fix(ui): harden shell highlighting rendering (marius-kilocode, 2026-05-14)
- e1e2454b4 - fix(agent-manager): hide subagent sessions from list (marius-kilocode, 2026-05-14)
- b65c4b28c - Revert "Merge remote-tracking branch 'origin/morning-tibia' into kiwi-acorn" (kirillk, 2026-05-13)
- 72bd8f837 - Merge remote-tracking branch 'origin/morning-tibia' into kiwi-acorn (kirillk, 2026-05-13)
- 911e7ce73 - feat(ui): add shell command syntax highlighting with Shiki and section labels (Sylwester Liljegren, 2026-05-14)
- b40622354 - refactor(jetbrains): extract svg icon colorizer (kirillk, 2026-05-13)
- 96d23223a - fix(jetbrains): use svg patcher for scroll icon (kirillk, 2026-05-13)
- 2d365fe70 - fix(jetbrains): reduce marketplace verifier warnings (kirillk, 2026-05-13)
- e369798a3 - docs(kilo-docs): tune mobile screenshot gallery sizing (kiloconnect[bot], 2026-05-13)
- c3acddd30 - docs(kilo-docs): add image gallery tag (kiloconnect[bot], 2026-05-13)
- 2a9144e8e - docs(kilo-docs): compress mobile app screenshots (kiloconnect[bot], 2026-05-13)
- d4e995117 - docs(kilo-docs): update mobile apps documentation (kiloconnect[bot], 2026-05-13)
- 744fb1df5 - Merge branch 'main' into morning-tibia (Kirill Kalishev, 2026-05-08)
- f27afbd6e - Merge remote-tracking branch 'origin/morning-tibia' into morning-tibia (kirillk, 2026-05-06)
- 138a02f31 - Merge branch 'unleashed-romano' into morning-tibia (kirillk, 2026-05-06)
- c104a3b47 - fix(jetbrains): map session times as doubles (kirillk, 2026-05-06)
- 06a066d13 - Merge branch 'main' into morning-tibia (Kirill Kalishev, 2026-05-06)
- 9b9741aca - Merge branch 'main' into morning-tibia (Kirill Kalishev, 2026-05-06)
- 8b34a34d1 - ci(jetbrains): annotate publish workflow (kirillk, 2026-05-03)
- b12c7cf10 - ci(jetbrains): publish marketplace rc builds (kirillk, 2026-05-03)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
(no changes)

#### Agent System (packages/*/src/agent/)
- `.kilo/agent/upstream-merge.md` (+6, -0)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)

#### Other Changes
- `.changeset/agent-manager-state-exclude.md` (+0, -5)
- `.changeset/bright-checkpoints-graph.md` (+0, -5)
- `.changeset/codex-chatgpt-reauth.md` (+0, -6)
- `.changeset/fix-tui-diff-hunk-headers.md` (+0, -6)
- `.changeset/local-worktree-revert-diff.md` (+0, -5)
- `.changeset/manual-compact-limit.md` (+0, -7)
- `.changeset/placeholder-vscode-token.md` (+0, -5)
- `.changeset/reset-reverted-todos.md` (+0, -5)
- `.changeset/silent-mermaid-labels.md` (+0, -6)
- `.changeset/tame-responses-items.md` (+0, -6)
- `.changeset/vscode-mode-model-sync.md` (+0, -5)
- `.github/workflows/publish-jetbrains.yml` (+167, -0)
- `bun.lock` (+14, -14)
- `package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/kilo-docs/components/Image.tsx` (+3, -2)
- `packages/kilo-docs/components/ImageGallery.tsx` (+52, -0)
- `packages/kilo-docs/components/index.js` (+1, -0)
- `packages/kilo-docs/markdoc/tags/image-gallery.markdoc.ts` (+16, -0)
- `packages/kilo-docs/markdoc/tags/index.ts` (+1, -0)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/platforms/mobile.md` (+32, -8)
- `packages/kilo-docs/public/img/mobile-apps/home.webp` (+-, --)
- `packages/kilo-docs/public/img/mobile-apps/kiloclaw-chat.webp` (+-, --)
- `packages/kilo-docs/public/img/mobile-apps/new-session.webp` (+-, --)
- `packages/kilo-docs/public/img/mobile-apps/session-chat.webp` (+-, --)
- `packages/kilo-docs/public/img/mobile-apps/session-filters.webp` (+-, --)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/message-list-tool-to-queued-user-spacing-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/components-shell/shell-execution-chromium-linux.png` (+2, -2)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-gateway/src/server/routes.ts` (+81, -8)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-i18n/src/ar.ts` (+4, -0)
- `packages/kilo-i18n/src/br.ts` (+4, -0)
- `packages/kilo-i18n/src/bs.ts` (+4, -0)
- `packages/kilo-i18n/src/da.ts` (+5, -1)
- `packages/kilo-i18n/src/de.ts` (+4, -0)
- `packages/kilo-i18n/src/en.ts` (+4, -0)
- `packages/kilo-i18n/src/es.ts` (+4, -0)
- `packages/kilo-i18n/src/fr.ts` (+5, -1)
- `packages/kilo-i18n/src/ja.ts` (+5, -1)
- `packages/kilo-i18n/src/ko.ts` (+5, -1)
- `packages/kilo-i18n/src/nl.ts` (+5, -1)
- `packages/kilo-i18n/src/no.ts` (+5, -1)
- `packages/kilo-i18n/src/pl.ts` (+4, -0)
- `packages/kilo-i18n/src/ru.ts` (+5, -1)
- `packages/kilo-i18n/src/th.ts` (+4, -0)
- `packages/kilo-i18n/src/tr.ts` (+5, -1)
- `packages/kilo-i18n/src/uk.ts` (+5, -1)
- `packages/kilo-i18n/src/zh.ts` (+4, -0)
- `packages/kilo-i18n/src/zht.ts` (+4, -0)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/README.md` (+23, -0)
- `packages/kilo-jetbrains/RELEASE_TODO.md` (+44, -0)
- `packages/kilo-jetbrains/build.gradle.kts` (+57, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/history/HistoryPanel.kt` (+10, -12)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/scroll/ScrollButtonIcon.kt` (+17, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/{ => scroll}/SessionScroll.kt` (+3, -44)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/PickerRow.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/model/ModelPicker.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/model/ModelPickerRenderer.kt` (+6, -8)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/PromptPanel.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/SvgIconColorizer.kt` (+46, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/HistorySessionActionsTest.kt` (+14, -13)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/NewSessionActionTest.kt` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/SendPromptActionTest.kt` (+4, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/StopSessionActionTest.kt` (+4, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionUiTestBase.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/model/ModelPickerTest.kt` (+2, -2)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/basic-tool.tsx` (+27, -1)
- `packages/kilo-ui/src/components/message-part.css` (+60, -2)
- `packages/kilo-ui/src/components/message-part.tsx` (+117, -37)
- `packages/kilo-ui/src/components/shell-rolling-results.tsx` (+31, -5)
- `packages/kilo-ui/src/components/tool-open-state.ts` (+33, -0)
- `packages/kilo-ui/src/util/escape-html.ts` (+3, -0)
- `packages/kilo-vscode/CHANGELOG.md` (+51, -0)
- `packages/kilo-vscode/package.json` (+10, -1)
- `packages/kilo-vscode/script/build.ts` (+4, -0)
- `packages/kilo-vscode/script/dev-snapshot.ts` (+1, -1)
- `packages/kilo-vscode/script/ffmpeg-helper.ts` (+49, -0)
- `packages/kilo-vscode/script/local-bin.ts` (+3, -0)
- `packages/kilo-vscode/src/KiloProvider.ts` (+56, -10)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+6, -0)
- `packages/kilo-vscode/src/agent-manager/WorktreeStateManager.ts` (+19, -0)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+7, -0)
- `packages/kilo-vscode/src/kilo-provider/early-message.ts` (+20, -0)
- `packages/kilo-vscode/src/services/input-tools.ts` (+49, -0)
- `packages/kilo-vscode/src/speech-to-text/capture.ts` (+278, -0)
- `packages/kilo-vscode/src/speech-to-text/config.ts` (+13, -0)
- `packages/kilo-vscode/src/speech-to-text/handler.ts` (+129, -0)
- `packages/kilo-vscode/src/speech-to-text/models.ts` (+51, -0)
- `packages/kilo-vscode/src/speech-to-text/settings.ts` (+19, -0)
- `packages/kilo-vscode/src/speech-to-text/transcribe.ts` (+111, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/kilo-ui-contract.test.ts` (+54, -0)
- `packages/kilo-vscode/tests/unit/navigate.test.ts` (+100, -0)
- `packages/kilo-vscode/tests/unit/prompt-input-utils.test.ts` (+24, -0)
- `packages/kilo-vscode/tests/unit/speech-to-text-capture.test.ts` (+22, -0)
- `packages/kilo-vscode/tests/unit/speech-to-text-models-sync.test.ts` (+19, -0)
- `packages/kilo-vscode/tests/unit/tool-open-state.test.ts` (+34, -0)
- `packages/kilo-vscode/tests/unit/worktree-state-manager.test.ts` (+34, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+110, -72)
- `packages/kilo-vscode/webview-ui/agent-manager/DiffPanel.tsx` (+10, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/FullScreenDiffView.tsx` (+10, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/NewWorktreeDialog.tsx` (+37, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/SidebarToggleButton.tsx` (+29, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+59, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fr.ts` (+2, -0)
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
- `packages/kilo-vscode/webview-ui/agent-manager/navigate.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/review-annotations.ts` (+7, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/sidebar-collapse.ts` (+38, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/TerminalTab.tsx` (+9, -0)
- `packages/kilo-vscode/webview-ui/src/App.tsx` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/AssistantMessage.tsx` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+44, -4)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskToolExpanded.tsx` (+9, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/prompt-input-utils.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/ExperimentalTab.tsx` (+46, -1)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelSelector.tsx` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/components/speech-to-text/SpeechToTextButton.tsx` (+72, -0)
- `packages/kilo-vscode/webview-ui/src/components/speech-to-text/availability.ts` (+23, -0)
- `packages/kilo-vscode/webview-ui/src/components/speech-to-text/model-selector.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/components/speech-to-text/useSpeechToText.ts` (+167, -0)
- `packages/kilo-vscode/webview-ui/src/context/config.tsx` (+23, -10)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+21, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+22, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+22, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+21, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+22, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+20, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+22, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+22, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+21, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+21, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+21, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+21, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+22, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+22, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+22, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+21, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+22, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+19, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+19, -0)
- `packages/kilo-vscode/webview-ui/src/styles/prompt-input.css` (+48, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+45, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+39, -0)
- `packages/opencode/CHANGELOG.md` (+23, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/kilocode/session/compaction-chunks.ts` (+354, -0)
- `packages/opencode/src/kilocode/session/llm.ts` (+53, -0)
- `packages/opencode/src/session/compaction.ts` (+57, -16)
- `packages/opencode/src/session/llm.ts` (+9, -0)
- `packages/opencode/src/session/prompt.ts` (+1, -0)
- `packages/opencode/test/kilocode/session-compaction-chunks.test.ts` (+582, -0)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+61, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+40, -0)
- `packages/sdk/openapi.json` (+94, -0)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/components/basic-tool.tsx` (+2, -0)
- `packages/ui/src/context/data.tsx` (+4, -0)
- `script/check-workflows.ts` (+1, -0)
- `script/upstream/package.json` (+1, -1)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### .kilo/agent/upstream-merge.md
```diff
diff --git a/.kilo/agent/upstream-merge.md b/.kilo/agent/upstream-merge.md
index d8aff1fd6..e81c9cea3 100644
--- a/.kilo/agent/upstream-merge.md
+++ b/.kilo/agent/upstream-merge.md
@@ -44,6 +44,12 @@ permission:
 
 Resolve the manual part of an upstream merge.
 
+**Do not load the `kilocode-merge-minimizer` skill.** That skill is for
+authoring new Kilo changes against shared upstream files; during an upstream
+merge it gives the wrong guidance (it nudges toward extracting Kilo logic out
+of conflict regions, which is exactly the opposite of what merge resolution
+needs). Follow the rules in this agent file instead.
+
 The user will provide the upstream version (for example `v1.1.50` or `1.1.50`)
 in their first message. If they don't, infer it from the current branch name,
 from `upstream-merge-report-<version>.md`, or from the newest relevant report
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 32ffc2df5..efde47c76 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.2.52",
+  "version": "7.2.54",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```


## opencode Changes (27ac53a..202cc86)

### Commits

- 202cc86 - refactor(flags): migrate claude code prompt flag (#27690) (Shoubhit Dash, 2026-05-15)
- 22cb039 - refactor(flags): migrate external skills flag (#27685) (Shoubhit Dash, 2026-05-15)
- 2d6bede - refactor(flags): migrate output token max to runtime flags (#27680) (Shoubhit Dash, 2026-05-15)
- 2080390 - chore: generate (opencode-agent[bot], 2026-05-15)
- 1ac3f09 - fix(watcher): resolve symlinked .git path before subscribing (#27016) (Kagura, 2026-05-15)
- ca8f578 - ci: skip previously cleaned PRs (#27670) (Aiden Cline, 2026-05-15)
- d59d996 - ci: Automate PR cleanup (#27667) (Aiden Cline, 2026-05-14)
- c43edc5 - sync release versions for v1.15.0 (opencode, 2026-05-15)
- 7a012ca - fix(tool): ignore invalid custom tool exports (Dax Raad, 2026-05-14)
- af06e52 - fix(session): ignore instruction lookup errors (#27656) (James Long, 2026-05-14)
- f807152 - core: fix event projector lookup to use versioned type keys (Dax Raad, 2026-05-14)
- b0ea7a5 - more test fixes (Dax Raad, 2026-05-14)
- 34b1be5 - chore: generate (opencode-agent[bot], 2026-05-15)
- 16639ee - test fixes (Dax Raad, 2026-05-14)
- 10c8493 - chore: generate (opencode-agent[bot], 2026-05-15)
- a50ff72 - fix: remove debug logging (Dax Raad, 2026-05-14)
- 5f4e5e6 - more typecheck fixes (Dax Raad, 2026-05-14)
- f39cf91 - fix missing event types in sdk (Dax Raad, 2026-05-14)
- f179dcb - fix(app): only run session.updated archive logic if archive state changes (#27637) (Brendan Allan, 2026-05-15)
- fd6a852 - chore: generate (opencode-agent[bot], 2026-05-15)
- e11e089 - Add Effect-native core event system (#27415) (Dax, 2026-05-15)
- 73cdba9 - feat(desktop): auto-hide menu bar on Linux and Windows (#27618) (Luna Seemann, 2026-05-15)
- 4e7a60d - sync release versions for v1.14.51 (opencode, 2026-05-15)
- e62ebd8 - chore: generate (opencode-agent[bot], 2026-05-15)
- 195f592 - refactor(server): simplify listener lifecycle (#27413) (Kit Langton, 2026-05-15)
- 7876901 - chore: generate (opencode-agent[bot], 2026-05-14)
- 4e143e3 - test(lib): promote pollWithTimeout/awaitWithTimeout helpers (#27626) (Kit Langton, 2026-05-14)
- dab567a - chore: generate (opencode-agent[bot], 2026-05-14)
- 9d35b04 - test(acp): replace fixed sleeps with pollUntil in event-subscription (#27624) (Kit Langton, 2026-05-14)
- 273ab56 - test(bus): fix flaky subscriber races with readiness latch (#27625) (Kit Langton, 2026-05-14)
- 302ba0c - test(session): de-flake shell-cancel tests by waiting for busy state (#27622) (Kit Langton, 2026-05-14)
- d35e09f - test(workspace): use runtime flags in workspace tests (#27612) (Shoubhit Dash, 2026-05-15)
- fc34c74 - refactor(flags): move channel db flag to runtime flags (#27615) (Shoubhit Dash, 2026-05-15)
- cb4f5cd - refactor(flags): move auto share to runtime flags (#27611) (Shoubhit Dash, 2026-05-15)
- d34a019 - feat(provider): add NVIDIA endpoints origin header (#27394) (nv-kasikritc, 2026-05-14)
- 43310f4 - refactor(flags): move embedded web ui flag to runtime flags (#27613) (Shoubhit Dash, 2026-05-15)
- e22cfa4 - refactor(lsp): move ty flag to runtime flags (#27610) (Shoubhit Dash, 2026-05-15)
- 93b1ccc - chore: generate (opencode-agent[bot], 2026-05-14)
- faca2b9 - refactor(flags): migrate icon discovery runtime flag (#27609) (Shoubhit Dash, 2026-05-15)
- 76ff18a - refactor(format): move oxfmt flag to runtime flags (#27608) (Shoubhit Dash, 2026-05-15)
- 9914c9a - chore: generate (opencode-agent[bot], 2026-05-14)
- f202226 - refactor(flags): move bash timeout to runtime flags (#27607) (Shoubhit Dash, 2026-05-15)
- 34198f4 - refactor(provider): use runtime flag for experimental models (#27606) (Shoubhit Dash, 2026-05-15)
- cccdeef - refactor(flags): migrate claude code skills flag to RuntimeFlags (#27605) (Shoubhit Dash, 2026-05-15)
- 83c145f - fix(plugin): scope digitalocean oauth to genai (#27599) (Musa, 2026-05-14)
- d353a6b - fix(worktree): accept missing create payload (#27582) (Kit Langton, 2026-05-14)
- d25cc42 - docs(app): stale reference to removed multi-edit tool (#27579) (bo-tato, 2026-05-14)
- 6039b89 - chore: generate (opencode-agent[bot], 2026-05-14)
- b4fc5ef - refactor(http-recorder): tighten cassette safety, fix WS leaks + docs (#26730) (Kit Langton, 2026-05-14)
- f6c8e35 - chore: generate (opencode-agent[bot], 2026-05-14)
- 94564f3 - fix(session): prevent double auto-compaction from filterCompacted reorder (#27545) (Kit Langton, 2026-05-14)
- 855bda8 - test(question): wait on question events (#27124) (Kit Langton, 2026-05-14)
- 756488d - chore: generate (opencode-agent[bot], 2026-05-14)
- 22de34c - feat: add experimental background subagents (#27084) (Shoubhit Dash, 2026-05-14)
- bdb0c16 - chore: update web stats (Adam, 2026-05-14)
- 7f7eb2e - fix(provider): remove LiteLLM workarounds ported upstream, requires LiteLLM v1.85.0-rc.2+ (#26819) (Sameer Kankute, 2026-05-14)
- e15fd0b - chore: generate (opencode-agent[bot], 2026-05-14)
- 8f90697 - chore: generate (opencode-agent[bot], 2026-05-14)
- 17af25d - chore: generate (opencode-agent[bot], 2026-05-14)
- 3c81326 - docs(effect): refresh TODO with shipped P0 and RF work (#27536) (Kit Langton, 2026-05-14)
- 9f8d8f5 - chore: generate (opencode-agent[bot], 2026-05-14)
- 337993d - feat(desktop): add mcp client registration status and authentication handling (#27525) (OpeOginni, 2026-05-14)
- e26abd8 - fix(tool): close shell truncation stream (#27517) (Shoubhit Dash, 2026-05-14)
- 8c1ce0b - refactor(flags): simplify tui plugin runtime flags (#27506) (Shoubhit Dash, 2026-05-14)
- f8c3f56 - fix(desktop): await execFilePromise and read stdout properly (#27499) (Brendan Allan, 2026-05-14)
- 7e43d3e - refactor(lsp): type initialize errors (#27494) (Shoubhit Dash, 2026-05-14)
- 52db7a7 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-14)
- be6e7b3 - refactor(provider): type init errors (#27484) (Shoubhit Dash, 2026-05-14)
- 0af2429 - deps: Upgrade OpenTUI to 0.2.10 (#27491) (Simon Klee, 2026-05-14)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/registry.ts` (+38, -23)
- `packages/opencode/src/tool/shell.ts` (+30, -14)
- `packages/opencode/src/tool/task.ts` (+197, -34)
- `packages/opencode/src/tool/task.txt` (+5, -4)
- `packages/opencode/src/tool/task_status.ts` (+179, -0)
- `packages/opencode/src/tool/task_status.txt` (+13, -0)
- `packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap` (+4, -0)
- `packages/opencode/test/tool/parameters.test.ts` (+4, -0)
- `packages/opencode/test/tool/question.test.ts` (+14, -3)
- `packages/opencode/test/tool/registry.test.ts` (+91, -22)
- `packages/opencode/test/tool/shell.test.ts` (+19, -0)
- `packages/opencode/test/tool/task.test.ts` (+324, -3)
- `packages/opencode/test/tool/task_status.test.ts` (+92, -0)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
- `packages/opencode/src/bus/bus-event.ts` (+23, -10)
- `packages/opencode/test/bus/bus-effect.test.ts` (+62, -12)

#### Core (**/core/)
- `packages/console/core/package.json` (+1, -1)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/catalog.ts` (+17, -8)
- `packages/core/src/event.ts` (+157, -0)
- `packages/core/src/flag/flag.ts` (+0, -21)
- `packages/core/src/instance-layer.ts` (+0, -12)
- `packages/core/src/instance.ts` (+0, -10)
- `packages/core/src/location-layer.ts` (+12, -0)
- `packages/core/src/location.ts` (+11, -0)
- `packages/core/src/plugin/provider/nvidia.ts` (+1, -0)
- `packages/core/src/session.ts` (+13, -0)
- `packages/core/test/catalog.test.ts` (+36, -4)
- `packages/core/test/event.test.ts` (+132, -0)
- `packages/core/test/plugin/provider-nvidia.test.ts` (+53, -1)
- `packages/core/test/plugin/provider-opencode.test.ts` (+3, -3)

#### Other Changes
- `.github/workflows/close-prs.yml` (+50, -0)
- `.github/workflows/close-stale-prs.yml` (+0, -235)
- `bun.lock` (+32, -32)
- `nix/hashes.json` (+4, -4)
- `package.json` (+3, -3)
- `packages/app/package.json` (+1, -1)
- `packages/app/src/components/dialog-select-mcp.tsx` (+12, -6)
- `packages/app/src/components/status-popover-body.tsx` (+20, -3)
- `packages/app/src/components/status-popover.tsx` (+9, -5)
- `packages/app/src/context/global-sync/event-reducer.ts` (+1, -0)
- `packages/app/src/i18n/ar.ts` (+1, -0)
- `packages/app/src/i18n/br.ts` (+1, -0)
- `packages/app/src/i18n/bs.ts` (+1, -0)
- `packages/app/src/i18n/da.ts` (+1, -0)
- `packages/app/src/i18n/de.ts` (+1, -0)
- `packages/app/src/i18n/en.ts` (+2, -1)
- `packages/app/src/i18n/es.ts` (+1, -0)
- `packages/app/src/i18n/fr.ts` (+1, -0)
- `packages/app/src/i18n/ja.ts` (+1, -0)
- `packages/app/src/i18n/ko.ts` (+1, -0)
- `packages/app/src/i18n/no.ts` (+1, -0)
- `packages/app/src/i18n/pl.ts` (+1, -0)
- `packages/app/src/i18n/ru.ts` (+1, -0)
- `packages/app/src/i18n/th.ts` (+1, -0)
- `packages/app/src/i18n/tr.ts` (+1, -0)
- `packages/app/src/i18n/zh.ts` (+1, -0)
- `packages/app/src/i18n/zht.ts` (+1, -0)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/config.ts` (+5, -5)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/mail/package.json` (+1, -1)
- `packages/{opencode/src/v2 => core/src}/session-event.ts` (+70, -75)
- `packages/{opencode/src/v2 => core/src}/session-message-updater.ts` (+0, -0)
- `packages/{opencode/src/v2 => core/src}/session-message.ts` (+12, -12)
- `packages/desktop/package.json` (+1, -1)
- `packages/desktop/src/main/apps.ts` (+1, -1)
- `packages/desktop/src/main/env.d.ts` (+1, -1)
- `packages/desktop/src/main/windows.ts` (+2, -0)
- `packages/enterprise/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/function/package.json` (+1, -1)
- `packages/http-recorder/README.md` (+14, -15)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/http-recorder/src/cassette.ts` (+32, -20)
- `packages/http-recorder/src/effect.ts` (+6, -4)
- `packages/http-recorder/src/index.ts` (+1, -2)
- `packages/http-recorder/src/matching.ts` (+1, -1)
- `packages/http-recorder/src/recorder.ts` (+6, -31)
- `packages/http-recorder/src/redaction.ts` (+2, -2)
- `packages/http-recorder/src/websocket.ts` (+17, -16)
- `packages/http-recorder/test/record-replay.test.ts` (+114, -0)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/package.json` (+1, -6)
- `packages/opencode/specs/effect/todo.md` (+47, -38)
- `packages/opencode/src/cli/cmd/db.ts` (+4, -4)
- `packages/opencode/src/cli/cmd/debug/v2.ts` (+3, -3)
- `packages/opencode/src/cli/cmd/run.ts` (+3, -2)
- `packages/opencode/src/cli/cmd/tui/plugin/runtime.ts` (+5, -3)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+8, -2)
- `packages/opencode/src/cli/error.ts` (+3, -2)
- `packages/opencode/src/effect/app-runtime.ts` (+4, -0)
- `packages/opencode/src/effect/runtime-flags.ts` (+24, -0)
- `packages/opencode/src/event-v2-bridge.ts` (+89, -0)
- `packages/opencode/src/file/watcher.ts` (+9, -3)
- `packages/opencode/src/format/formatter.ts` (+4, -3)
- `packages/opencode/src/format/index.ts` (+8, -2)
- `packages/opencode/src/lsp/client.ts` (+4, -9)
- `packages/opencode/src/lsp/lsp.ts` (+7, -6)
- `packages/opencode/src/lsp/server.ts` (+4, -3)
- `packages/opencode/src/plugin/digitalocean.ts` (+1, -1)
- `packages/opencode/src/project/project.ts` (+5, -2)
- `packages/opencode/src/provider/provider.ts` (+28, -19)
- `packages/opencode/src/provider/transform.ts` (+4, -14)
- `packages/opencode/src/server/httpapi-server.node.ts` (+0, -35)
- `packages/opencode/src/server/httpapi-server.ts` (+0, -9)
- `packages/opencode/src/server/init-projectors.ts` (+3, -0)
- `packages/opencode/src/server/projectors.ts` (+0, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/experimental.ts` (+2, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/{instance.ts => location.ts}` (+18, -18)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/message.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/model.ts` (+4, -4)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/provider.ts` (+6, -6)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/session.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2.ts` (+2, -2)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2/message.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+25, -27)
- `packages/opencode/src/server/server.ts` (+160, -100)
- `packages/opencode/src/server/shared/ui.ts` (+8, -10)
- `packages/opencode/src/session/compaction.ts` (+14, -20)
- `packages/opencode/src/session/instruction.ts` (+13, -7)
- `packages/opencode/src/session/llm.ts` (+6, -18)
- `packages/opencode/src/session/message-v2.ts` (+25, -0)
- `packages/opencode/src/session/overflow.ts` (+10, -4)
- `packages/opencode/src/session/processor.ts` (+19, -34)
- `packages/opencode/src/session/projectors-next.ts` (+29, -28)
- `packages/opencode/src/session/prompt.ts` (+14, -25)
- `packages/opencode/src/session/run-state.ts` (+41, -1)
- `packages/opencode/src/session/schema.ts` (+2, -7)
- `packages/opencode/src/session/session.sql.ts` (+1, -1)
- `packages/opencode/src/session/session.ts` (+29, -10)
- `packages/opencode/src/share/session.ts` (+4, -2)
- `packages/opencode/src/skill/index.ts` (+17, -4)
- `packages/opencode/src/storage/db.ts` (+59, -38)
- `packages/opencode/src/sync/index.ts` (+58, -21)
- `packages/opencode/src/v2/event.ts` (+0, -43)
- `packages/opencode/src/v2/session.ts` (+8, -8)
- `packages/opencode/test/AGENTS.md` (+45, -0)
- `packages/opencode/test/acp/event-subscription.test.ts` (+92, -18)
- `packages/opencode/test/cli/error.test.ts` (+8, -0)
- `packages/opencode/test/control-plane/workspace.test.ts` (+0, -4)
- `packages/opencode/test/effect/runtime-flags.test.ts` (+244, -1)
- `packages/opencode/test/file/watcher.test.ts` (+54, -0)
- `packages/opencode/test/fixture/db.ts` (+4, -3)
- `packages/opencode/test/fixture/workspace.ts` (+28, -0)
- `packages/opencode/test/lib/effect.ts` (+31, -1)
- `packages/opencode/test/lsp/index.test.ts` (+60, -0)
- `packages/opencode/test/mcp/oauth-browser.test.ts` (+8, -17)
- `packages/opencode/test/plugin/workspace-adapter.test.ts` (+1, -10)
- `packages/opencode/test/project/project.test.ts` (+39, -0)
- `packages/opencode/test/provider/provider.test.ts` (+153, -1)
- `packages/opencode/test/question/question.test.ts` (+18, -11)
- `packages/opencode/test/server/httpapi-cors.test.ts` (+18, -4)
- `packages/opencode/test/server/httpapi-exercise/backend.ts` (+2, -2)
- `packages/opencode/test/server/httpapi-exercise/runtime.ts` (+2, -2)
- `packages/opencode/test/server/httpapi-file.test.ts` (+2, -2)
- `packages/opencode/test/server/httpapi-instance-context.test.ts` (+2, -10)
- `packages/opencode/test/server/httpapi-instance.test.ts` (+3, -3)
- `packages/opencode/test/server/httpapi-listen.test.ts` (+138, -0)
- `packages/opencode/test/server/httpapi-mcp.test.ts` (+3, -3)
- `packages/opencode/test/server/httpapi-mdns.test.ts` (+82, -0)
- `packages/opencode/test/server/httpapi-promptasync-context.test.ts` (+2, -10)
- `packages/opencode/test/server/httpapi-pty.test.ts` (+2, -2)
- `packages/opencode/test/server/httpapi-raw-route-auth.test.ts` (+3, -3)
- `packages/opencode/test/server/httpapi-sdk.test.ts` (+3, -3)
- `packages/opencode/test/server/httpapi-session.test.ts` (+1, -1)
- `packages/opencode/test/server/httpapi-sync.test.ts` (+2, -2)
- `packages/opencode/test/server/httpapi-ui.test.ts` (+115, -55)
- `packages/opencode/test/server/httpapi-workspace-routing.test.ts` (+2, -10)
- `packages/opencode/test/server/session-list.test.ts` (+2, -0)
- `packages/opencode/test/server/worktree-endpoint-repro.test.ts` (+47, -5)
- `packages/opencode/test/session/compaction.test.ts` (+3, -0)
- `packages/opencode/test/session/instruction.test.ts` (+23, -3)
- `packages/opencode/test/session/message-v2.test.ts` (+107, -0)
- `packages/opencode/test/session/processor-effect.test.ts` (+2, -0)
- `packages/opencode/test/session/prompt.test.ts` (+22, -33)
- `packages/opencode/test/session/session.test.ts` (+2, -0)
- `packages/opencode/test/session/snapshot-tool-race.test.ts` (+4, -0)
- `packages/opencode/test/skill/skill.test.ts` (+116, -0)
- `packages/opencode/test/storage/db.test.ts` (+23, -8)
- `packages/opencode/test/v2/session-message-updater.test.ts` (+3, -3)
- `packages/plugin/package.json` (+4, -4)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+6, -6)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+197, -89)
- `packages/sdk/openapi.json` (+809, -303)
- `packages/slack/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/components/message-part.tsx` (+7, -3)
- `packages/web/package.json` (+1, -1)
- `script/github/close-prs.ts` (+393, -0)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index e8585f2..b58e595 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.14.50",
+  "version": "1.15.0",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index ab54023..7a7c088 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.14.50",
+  "version": "1.15.0",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/catalog.ts
```diff
diff --git a/packages/core/src/catalog.ts b/packages/core/src/catalog.ts
index 70cdba7..d27f17b 100644
--- a/packages/core/src/catalog.ts
+++ b/packages/core/src/catalog.ts
@@ -5,7 +5,8 @@ import { produce, type Draft } from "immer"
 import { ModelV2 } from "./model"
 import { PluginV2 } from "./plugin"
 import { ProviderV2 } from "./provider"
-import { Instance } from "./instance"
+import { Location } from "./location"
+import { EventV2 } from "./event"
 
 type ProviderRecord = {
   provider: ProviderV2.Info
@@ -24,6 +25,15 @@ export class ModelNotFoundError extends Schema.TaggedErrorClass<ModelNotFoundErr
   modelID: ModelV2.ID,
 }) {}
 
+export const Event = {
+  ModelUpdated: EventV2.define({
+    type: "catalog.model.updated",
+    schema: {
+      model: ModelV2.Info,
+    },
+  }),
+}
+
 export interface Interface {
   readonly provider: {
     readonly get: (providerID: ProviderV2.ID) => Effect.Effect<ProviderV2.Info, ProviderNotFoundError>
@@ -57,10 +67,11 @@ export class Service extends Context.Service<Service, Interface>()("@opencode/v2
 export const layer = Layer.effect(
   Service,
   Effect.gen(function* () {
-    yield* Instance.Service
+    yield* Location.Service
     let records = HashMap.empty<ProviderV2.ID, ProviderRecord>()
     let defaultModel: { providerID: ProviderV2.ID; modelID: ModelV2.ID } | undefined
     const plugin = yield* PluginV2.Service
+    const events = yield* EventV2.Service
 
     const resolve = (model: ModelV2.Info) => {
       const provider = Option.getOrThrow(HashMap.get(records, model.providerID)).provider
@@ -157,14 +168,12 @@ export const layer = Layer.effect(
           )
           const updated = yield* plugin.trigger("model.update", {}, { model, cancel: false })
           if (updated.cancel) return
+          const next = new ModelV2.Info({ ...updated.model, id: modelID, providerID })
           records = HashMap.set(records, providerID, {
             provider: record.provider,
```

#### packages/core/src/event.ts
```diff
diff --git a/packages/core/src/event.ts b/packages/core/src/event.ts
new file mode 100644
index 0000000..e01dc5b
--- /dev/null
+++ b/packages/core/src/event.ts
@@ -0,0 +1,157 @@
+import { Context, Effect, Layer, Option, PubSub, Schema, Stream } from "effect"
+import { Location } from "./location"
+import { withStatics } from "./schema"
+import { Identifier } from "./util/identifier"
+
+export const ID = Schema.String.pipe(
+  Schema.brand("Event.ID"),
+  withStatics((schema) => ({ create: () => schema.make("evt_" + Identifier.ascending()) })),
+)
+export type ID = typeof ID.Type
+
+export type Definition<Type extends string = string, DataSchema extends Schema.Top = Schema.Top> = {
+  readonly type: Type
+  readonly version?: number
+  readonly aggregate?: string
+  readonly data: DataSchema
+}
+
+export type Data<D extends Definition> = Schema.Schema.Type<D["data"]>
+
+export type Payload<D extends Definition = Definition> = {
+  readonly id: ID
+  readonly type: D["type"]
+  readonly data: Data<D>
+  readonly version?: number
+  readonly location?: Location.Ref
+  readonly metadata?: Record<string, unknown>
+}
+
+export type Sync = (event: Payload) => Effect.Effect<void>
+
+export const registry = new Map<string, Definition>()
+
+export function define<const Type extends string, Fields extends Schema.Struct.Fields>(input: {
+  readonly type: Type
+  readonly version?: number
+  readonly aggregate?: string
+  readonly schema: Fields
+}): Schema.Schema<Payload<Definition<Type, Schema.Struct<Fields>>>> & Definition<Type, Schema.Struct<Fields>> {
+  const Data = Schema.Struct(input.schema)
+  const Payload = Schema.Struct({
+    id: ID,
+    metadata: Schema.optional(Schema.Record(Schema.String, Schema.Unknown)),
+    type: Schema.Literal(input.type),
```

#### packages/core/src/flag/flag.ts
```diff
diff --git a/packages/core/src/flag/flag.ts b/packages/core/src/flag/flag.ts
index ec417cf..c7be32d 100644
--- a/packages/core/src/flag/flag.ts
+++ b/packages/core/src/flag/flag.ts
@@ -5,24 +5,14 @@ function truthy(key: string) {
   return value === "true" || value === "1"
 }
 
-function number(key: string) {
-  const value = process.env[key]
-  if (!value) return undefined
-  const parsed = Number(value)
-  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined
-}
-
 const OPENCODE_EXPERIMENTAL = truthy("OPENCODE_EXPERIMENTAL")
 const OPENCODE_DISABLE_CLAUDE_CODE = truthy("OPENCODE_DISABLE_CLAUDE_CODE")
-const OPENCODE_DISABLE_CLAUDE_CODE_SKILLS =
-  OPENCODE_DISABLE_CLAUDE_CODE || truthy("OPENCODE_DISABLE_CLAUDE_CODE_SKILLS")
 const copy = process.env["OPENCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT"]
 
 export const Flag = {
   OTEL_EXPORTER_OTLP_ENDPOINT: process.env["OTEL_EXPORTER_OTLP_ENDPOINT"],
   OTEL_EXPORTER_OTLP_HEADERS: process.env["OTEL_EXPORTER_OTLP_HEADERS"],
 
-  OPENCODE_AUTO_SHARE: truthy("OPENCODE_AUTO_SHARE"),
   OPENCODE_AUTO_HEAP_SNAPSHOT: truthy("OPENCODE_AUTO_HEAP_SNAPSHOT"),
   OPENCODE_GIT_BASH_PATH: process.env["OPENCODE_GIT_BASH_PATH"],
   OPENCODE_CONFIG: process.env["OPENCODE_CONFIG"],
@@ -35,14 +25,10 @@ export const Flag = {
   OPENCODE_PERMISSION: process.env["OPENCODE_PERMISSION"],
   OPENCODE_DISABLE_DEFAULT_PLUGINS: truthy("OPENCODE_DISABLE_DEFAULT_PLUGINS"),
   OPENCODE_DISABLE_LSP_DOWNLOAD: truthy("OPENCODE_DISABLE_LSP_DOWNLOAD"),
-  OPENCODE_ENABLE_EXPERIMENTAL_MODELS: truthy("OPENCODE_ENABLE_EXPERIMENTAL_MODELS"),
   OPENCODE_DISABLE_AUTOCOMPACT: truthy("OPENCODE_DISABLE_AUTOCOMPACT"),
   OPENCODE_DISABLE_MODELS_FETCH: truthy("OPENCODE_DISABLE_MODELS_FETCH"),
   OPENCODE_DISABLE_MOUSE: truthy("OPENCODE_DISABLE_MOUSE"),
   OPENCODE_DISABLE_CLAUDE_CODE,
-  OPENCODE_DISABLE_CLAUDE_CODE_PROMPT: OPENCODE_DISABLE_CLAUDE_CODE || truthy("OPENCODE_DISABLE_CLAUDE_CODE_PROMPT"),
-  OPENCODE_DISABLE_CLAUDE_CODE_SKILLS,
-  OPENCODE_DISABLE_EXTERNAL_SKILLS: truthy("OPENCODE_DISABLE_EXTERNAL_SKILLS"),
   OPENCODE_FAKE_VCS: process.env["OPENCODE_FAKE_VCS"],
   OPENCODE_SERVER_PASSWORD: process.env["OPENCODE_SERVER_PASSWORD"],
   OPENCODE_SERVER_USERNAME: process.env["OPENCODE_SERVER_USERNAME"],
@@ -56,23 +42,16 @@ export const Flag = {
   OPENCODE_EXPERIMENTAL_DISABLE_FILEWATCHER: Config.boolean("OPENCODE_EXPERIMENTAL_DISABLE_FILEWATCHER").pipe(
     Config.withDefault(false),
   ),
-  OPENCODE_EXPERIMENTAL_ICON_DISCOVERY: OPENCODE_EXPERIMENTAL || truthy("OPENCODE_EXPERIMENTAL_ICON_DISCOVERY"),
   OPENCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT:
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from .kilo/agent/upstream-merge.md
- `src/core/` - review core changes from packages/core/package.json
- `src/tool/parameters.test.ts.snap.ts` - update based on opencode packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap changes
- `src/tool/parameters.test.ts` - update based on opencode packages/opencode/test/tool/parameters.test.ts changes
- `src/tool/question.test.ts` - update based on opencode packages/opencode/test/tool/question.test.ts changes
- `src/tool/registry.test.ts` - update based on opencode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on opencode packages/opencode/src/tool/registry.ts changes
- `src/tool/shell.test.ts` - update based on opencode packages/opencode/test/tool/shell.test.ts changes
- `src/tool/shell.ts` - update based on opencode packages/opencode/src/tool/shell.ts changes
- `src/tool/task.test.ts` - update based on opencode packages/opencode/test/tool/task.test.ts changes
- `src/tool/task.ts` - update based on opencode packages/opencode/src/tool/task.ts changes
- `src/tool/task.txt.ts` - update based on opencode packages/opencode/src/tool/task.txt changes
- `src/tool/task_status.test.ts` - update based on opencode packages/opencode/test/tool/task_status.test.ts changes
- `src/tool/task_status.ts` - update based on opencode packages/opencode/src/tool/task_status.ts changes
- `src/tool/task_status.txt.ts` - update based on opencode packages/opencode/src/tool/task_status.txt changes
