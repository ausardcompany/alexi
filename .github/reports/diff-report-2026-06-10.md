# Upstream Changes Report
Generated: 2026-06-10 10:02:16

## Summary
- kilocode: 69 commits, 179 files changed
- opencode: 49 commits, 342 files changed

## kilocode Changes (574dc1920..c7a06d2f4)

### Commits

- c7a06d2f4 - Merge pull request #11016 from Kilo-Org/docs/accept-http-202-links (Joshua Lambert, 2026-06-10)
- 729c06204 - Merge pull request #10751 from Kilo-Org/fix/session-ingest-env-auth (Joshua Lambert, 2026-06-09)
- 419510cf5 - Merge pull request #11045 from Kilo-Org/jetbrains/release/v7.0.1-rc.8 (Kirill Kalishev, 2026-06-09)
- 6563aa789 - docs(jetbrains): edit changelog for v7.0.1-rc.8 (Kirill Kalishev, 2026-06-09)
- 4bece6953 - docs(jetbrains): edit changelog for v7.0.1-rc.8 (Kirill Kalishev, 2026-06-09)
- ac1451f13 - docs(jetbrains): edit changelog for v7.0.1-rc.8 (Kirill Kalishev, 2026-06-09)
- 707917c7f - release(jetbrains): v7.0.1-rc.8 (kilo-maintainer[bot], 2026-06-09)
- 08c0ef63e - Merge pull request #11015 from Kilo-Org/tide-clipper (Kirill Kalishev, 2026-06-09)
- 5792f44e4 - fix(jetbrains): release session UI editors in tests (kirillk, 2026-06-09)
- c90846a98 - fix(jetbrains): preserve session scroll intent (kirillk, 2026-06-09)
- bfa719af5 - Merge branch 'main' into tide-clipper (Kirill Kalishev, 2026-06-09)
- 9ae35e869 - Merge pull request #11011 from Kilo-Org/revert/pr-10924-session-export (Joshua Lambert, 2026-06-09)
- b7d4f7efe - style(jetbrains): compact session spacing (kirillk, 2026-06-09)
- 3658deaf4 - fix(jetbrains): keep completed reasoning expanded (kirillk, 2026-06-09)
- bbe6f25e2 - fix(jetbrains): bound streaming reasoning resources (kirillk, 2026-06-09)
- adb8d3e31 - release: v7.3.41 (kilo-maintainer[bot], 2026-06-09)
- 7a50184fa - Merge pull request #11037 from Kilo-Org/perf-agent-manager-timeline-renderer (Marius, 2026-06-09)
- 7f84c13bc - feat: add Kilo auto close workflow isolated from upstream (#11040) (Johnny Eric Amancio, 2026-06-09)
- 422bc8aca - fix(vscode): remove stale speech setting (#11039) (Marius, 2026-06-09)
- ff2e66ed3 - Merge pull request #11038 from Kilo-Org/perf-renderer-self-test (Marius, 2026-06-09)
- d363965df - test(ui): restore incremental markdown coverage (marius-kilocode, 2026-06-09)
- 9c490cfea - test(ui): run markdown DOM coverage in browser (marius-kilocode, 2026-06-09)
- fe1ac4bcc - test(ui): declare markdown DOM test dependency (marius-kilocode, 2026-06-09)
- 70f9441b5 - perf(ui): render streamed markdown incrementally (marius-kilocode, 2026-06-09)
- 1aabc41b1 - docs(vscode): clarify shared timeline behavior (marius-kilocode, 2026-06-09)
- 246ba995a - docs(agent-manager): explain timeline scroll batching (marius-kilocode, 2026-06-09)
- 15d771e8f - perf(agent-manager): coalesce timeline auto-scroll (marius-kilocode, 2026-06-09)
- c77aca3fa - Merge pull request #11033 from Kilo-Org/groovy-brook (Marius, 2026-06-09)
- fd41e295d - Merge branch 'main' into groovy-brook (Marius, 2026-06-09)
- 10520d04e - fix(vscode): avoid logging every streamed event (marius-kilocode, 2026-06-09)
- d1fa4506c - fix(jetbrains): align session view icons (kirillk, 2026-06-08)
- d8b40526e - chore(jetbrains): add UI implementation plans (kirillk, 2026-06-08)
- 5cf95c548 - fix(jetbrains): align reasoning toggle (kirillk, 2026-06-08)
- 2c0b17678 - fix(jetbrains): tune question card spacing (kirillk, 2026-06-08)
- a0c3f4be2 - fix(jetbrains): align session progress footer (kirillk, 2026-06-08)
- 952241ee0 - fix(jetbrains): refine session card outlines (kirillk, 2026-06-08)
- b9bff3b69 - fix(jetbrains): reset session card hover styling (kirillk, 2026-06-08)
- 1864e441d - fix(jetbrains): render search targets as regular text (kirillk, 2026-06-08)
- 8c4c3375b - fix(jetbrains): show search paths relative to repo (kirillk, 2026-06-08)
- 6b2d879e5 - Revert "Merge pull request #11017 from Kilo-Org/docs/fix-deepseek-link-check" (Josh Lambert, 2026-06-08)
- 8dbb83064 - Merge branch 'main' of https://github.com/Kilo-Org/kilocode into docs/accept-http-202-links (Josh Lambert, 2026-06-08)
- e56e0f245 - chore: remove local plan files (kirillk, 2026-06-08)
- 38c774ca8 - fix(jetbrains): preserve scroll position on expand (kirillk, 2026-06-08)
- 406f92afe - fix(jetbrains): left-align search tool targets (kirillk, 2026-06-08)
- 5518d6636 - feat(jetbrains): render tool output with editor bodies (kirillk, 2026-06-08)
- 7afccae4e - refactor(jetbrains): split tool view renderers (kirillk, 2026-06-08)
- 5736a3945 - feat(jetbrains): render search tools with dedicated views (kirillk, 2026-06-08)
- a40ca7aca - fix(kilo-docs): accept HTTP 202 links (Josh Lambert, 2026-06-08)
- 3ca1ab628 - Merge branch 'main' into revert/pr-10924-session-export (Joshua Lambert, 2026-06-08)
- c772cc403 - Merge remote-tracking branch 'origin/tiny-chokeberry' into tide-clipper (kirillk, 2026-06-08)
- ab37a7675 - Merge branch 'main' into revert/pr-10924-session-export (Joshua Lambert, 2026-06-08)
- 6add3130a - Merge remote-tracking branch 'origin/main' into tide-clipper (kirillk, 2026-06-08)
- 9fd22517e - Merge remote-tracking branch 'origin/main' into tiny-chokeberry (kirillk, 2026-06-08)
- 9f072b05d - chore(cli): add session export changeset (Josh Lambert, 2026-06-08)
- b1db6bb53 - Revert "Merge pull request #10924 from Kilo-Org/fix/temporarily-disable-session-export" (Josh Lambert, 2026-06-08)
- cdccebe27 - fix(jetbrains): refine reasoning block spacing (kirillk, 2026-06-07)
- 256fe3a81 - fix(jetbrains): improve streaming reasoning display (kirillk, 2026-06-05)
- 3411c37d9 - Merge remote-tracking branch 'origin/main' into tide-clipper (kirillk, 2026-06-05)
- d505677d8 - fix(jetbrains): prevent transcript scrollbar overlap (kirillk, 2026-06-05)
- d1214fcc7 - Merge remote-tracking branch 'origin/main' into tide-clipper (kirillk, 2026-06-05)
- cd80323c0 - test(jetbrains): add markdown stress leak coverage (kirillk, 2026-06-05)
- 01f288619 - fix(jetbrains): speed up session mouse wheel scrolling (kirillk, 2026-06-05)
- 3b762484f - fix(jetbrains): hide markdown separators (kirillk, 2026-06-05)
- 6fd42be1d - Update .changeset/sync-api-key-sessions.md (Joshua Lambert, 2026-06-03)
- 04e0df57d - Apply suggestion from @lambertjosh (Joshua Lambert, 2026-06-01)
- 58f18e32e - Apply suggestion from @lambertjosh (Joshua Lambert, 2026-06-01)
- 5cc89c589 - Apply suggestion from @lambertjosh (Joshua Lambert, 2026-05-30)
- 6e8d6f7d5 - docs(cli): clarify API key session sync scope (Josh Lambert, 2026-05-29)
- eb4df315c - fix(cli): sync headless sessions authenticated by API key (Josh Lambert, 2026-05-29)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt` (+188, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/GlobToolView.kt` (+23, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ReadToolView.kt` (+170, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/SearchToolView.kt` (+24, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt` (+680, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolView.kt` (+185, -0)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt` (+5, -6)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/permission/PermissionViewTest.kt` (+5, -5)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)

#### Other Changes
- `.changeset/add-ods-support.md` (+0, -5)
- `.changeset/agent-manager-model-sync.md` (+0, -5)
- `.changeset/bright-pointer-controls.md` (+0, -6)
- `.changeset/brisk-terminal-bench-details.md` (+0, -7)
- `.changeset/calm-image-events.md` (+0, -5)
- `.changeset/calm-timeline-follow.md` (+5, -0)
- `.changeset/calm-titles-return.md` (+0, -5)
- `.changeset/cloud-session-diff-restore.md` (+0, -6)
- `.changeset/fix-jetbrains-reasoning.md` (+5, -0)
- `.changeset/fix-jetbrains-session-scroll.md` (+5, -0)
- `.changeset/fix-worktree-project-skills.md` (+0, -5)
- `.changeset/gentle-canyon.md` (+5, -0)
- `.changeset/glob-jetbrains-view.md` (+5, -0)
- `.changeset/isolate-forked-subagents.md` (+0, -5)
- `.changeset/jetbrains-session-icons.md` (+5, -0)
- `.changeset/plan-followup-clean-session.md` (+0, -5)
- `.changeset/quiet-jetbrains-separators.md` (+5, -0)
- `.changeset/refine-jetbrains-card-borders.md` (+5, -0)
- `.changeset/relative-jetbrains-search-paths.md` (+5, -0)
- `.changeset/rename-mercury-autocomplete-labels.md` (+0, -5)
- `.changeset/reset-fork-costs.md` (+0, -5)
- `.changeset/reset-jetbrains-session-hover.md` (+5, -0)
- `.changeset/restore-session-export.md` (+5, -0)
- `.changeset/route-worktree-permissions.md` (+0, -5)
- `.changeset/search-jetbrains-view.md` (+5, -0)
- `.changeset/session-prompt-queue-memory-leak.md` (+0, -5)
- `.changeset/stellar-wolf.md` (+5, -0)
- `.changeset/sync-api-key-sessions.md` (+5, -0)
- `.changeset/tidy-context-preflight.md` (+0, -5)
- `.github/workflows/close-issues.yml` (+1, -0)
- `.github/workflows/close-stale-prs.yml` (+1, -1)
- `.github/workflows/kilo-auto-close.yml` (+345, -0)
- `.gitignore` (+1, -0)
- `bun.lock` (+20, -20)
- `package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-docs/lychee.toml` (+1, -0)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/ai-providers/deepseek.md` (+2, -2)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/AGENTS.md` (+16, -0)
- `packages/kilo-jetbrains/CHANGELOG.md` (+20, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+12, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/scroll/SessionScroll.kt` (+70, -24)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/ConnectionPanel.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/ProgressPanel.kt` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanel.kt` (+30, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/account/SessionAccountOverlay.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/PromptPanel.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/selection/SessionSelection.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/style/SessionUiStyle.kt` (+47, -26)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/CompactionView.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/MessageView.kt` (+89, -16)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/ReasoningView.kt` (+117, -14)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/SessionViewIcons.kt` (+25, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/TextView.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/ToolView.kt` (+0, -655)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/TurnView.kt` (+6, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/ViewFactory.kt` (+17, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/base/AbstractSessionPartView.kt` (+18, -11)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/base/BaseQuestionView.kt` (+16, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/base/GenericView.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/base/PartView.kt` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/base/PrimarySessionPartView.kt` (+25, -10)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/base/SecondarySessionPartView.kt` (+26, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/question/QuestionResultView.kt` (+53, -26)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/question/QuestionView.kt` (+10, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/todo/TodoWriteView.kt` (+11, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/layout/Stack.kt` (+57, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/MdViewHybrid.kt` (+27, -5)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/brain.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/brain_dark.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/bubble-5.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/bubble-5_dark.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/bullet-list.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/bullet-list_dark.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/checklist.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/checklist_dark.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/chevron-down.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/chevron-down_dark.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/chevron-left.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/chevron-left_dark.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/chevron-right.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/chevron-right_dark.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/code-lines.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/code-lines_dark.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/code.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/code_dark.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/console.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/console_dark.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/eye.svg` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/eye_dark.svg` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/glasses.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/glasses_dark.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/magnifying-glass-menu.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/magnifying-glass-menu_dark.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/mcp.svg` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/mcp_dark.svg` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/task.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/task_dark.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/warning.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/warning_dark.svg` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/window-cursor.svg` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/window-cursor_dark.svg` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionScrollTest.kt` (+248, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionUiTestBase.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/ProgressPanelTest.kt` (+12, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanelTest.kt` (+75, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionSelectionCopyTest.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionUiUpdateTest.kt` (+18, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/account/SessionAccountOverlayTest.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/GlobToolViewTest.kt` (+155, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/LoginRequiredViewTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/PlanExitViewTest.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/QuestionResultViewTest.kt` (+25, -8)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/QuestionViewTest.kt` (+40, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ReadToolViewTest.kt` (+8, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ReasoningViewStressTest.kt` (+63, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ReasoningViewTest.kt` (+110, -15)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/SearchToolViewTest.kt` (+196, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ToolBodyStressTest.kt` (+71, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ToolViewTest.kt` (+79, -24)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/TurnViewTest.kt` (+87, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/base/AbstractSessionPartViewTest.kt` (+27, -10)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/base/BaseQuestionViewTest.kt` (+15, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/UiStyleTest.kt` (+3, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/layout/StackTest.kt` (+33, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/md/MdViewHybridStressTest.kt` (+180, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/md/MdViewHybridTest.kt` (+94, -0)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-vscode/CHANGELOG.md` (+29, -0)
- `packages/kilo-vscode/package.json` (+1, -6)
- `packages/kilo-vscode/src/services/cli-backend/sdk-sse-adapter.ts` (+0, -4)
- `packages/kilo-vscode/tests/markdown-incremental-dom.spec.ts` (+208, -0)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/unit/sdk-sse-adapter.test.ts` (+30, -0)
- `packages/kilo-vscode/tests/unit/timeline-sizes.test.ts` (+7, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskTimeline.tsx` (+20, -4)
- `packages/kilo-vscode/webview-ui/src/utils/timeline/sizes.ts` (+11, -0)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+33, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+3, -0)
- `packages/opencode/src/kilocode/bootstrap.ts` (+0, -1)
- `packages/opencode/src/kilocode/session-export/session-export.ts` (+0, -2)
- `packages/opencode/src/session/llm.ts` (+2, -3)
- `packages/opencode/test/kilocode/kilo-sessions.test.ts` (+89, -0)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+111, -111)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/components/markdown-stream.ts` (+4, -0)
- `packages/ui/src/components/markdown.tsx` (+35, -10)
- `packages/ui/src/kilocode/markdown-incremental-dom.ts` (+128, -0)
- `packages/ui/src/kilocode/markdown-stable-blocks.test.ts` (+54, -0)
- `packages/ui/src/kilocode/markdown-stable-blocks.ts` (+25, -0)
- `script/check-workflows.ts` (+1, -0)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 8b052f80b..2ba968c74 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.3.40",
+  "version": "7.3.41",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
index d6584f0f0..e8f52e97d 100644
--- a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
@@ -10,14 +10,13 @@ import ai.kilocode.client.session.ui.selection.SessionSelection
 import ai.kilocode.client.session.ui.style.SessionEditorStyle
 import ai.kilocode.client.session.ui.style.SessionEditorStyleTarget
 import ai.kilocode.client.session.ui.style.SessionUiStyle
-import ai.kilocode.client.session.ui.style.SessionUiStyle.View.SESSION_VIEW_GAP
+import ai.kilocode.client.session.views.SessionViewIcons
 import ai.kilocode.client.ui.UiStyle
 import ai.kilocode.client.ui.layout.HAlign
 import ai.kilocode.client.ui.layout.Stack
 import ai.kilocode.client.ui.layout.VAlign
 import ai.kilocode.client.ui.layout.align
 import ai.kilocode.rpc.dto.PermissionReplyDto
-import com.intellij.icons.AllIcons
 import com.intellij.openapi.Disposable
 import com.intellij.openapi.util.Disposer
 import com.intellij.ui.ColorUtil
@@ -68,7 +67,7 @@ class PermissionView(
         isOpaque = false
         isVisible = false
 
-        card.setHeaderIcon(AllIcons.General.Warning, KiloBundle.message("session.permission.title"))
+        card.setHeaderIcon(SessionViewIcons.warning, KiloBundle.message("session.permission.title"))
         card.setContent(body)
         card.setActions(listOf(
             BaseQuestionView.Action(ID_DENY, KiloBundle.message("session.permission.deny"), primary = false) { decide("reject") },
@@ -128,7 +127,7 @@ class PermissionView(
 
     /** Adds a three-column permission detail row: tool, target, and changes. */
     private fun addDetailRow(action: String, target: String?, diffs: List<PermissionFileDiff>) {
-        val row = JPanel(BorderLayout(SESSION_VIEW_GAP, 0)).apply {
+        val row = JPanel(BorderLayout(SessionUiStyle.View.Layout.GAP, 0)).apply {
             isOpaque = false
         }
 
@@ -174,7 +173,7 @@ class PermissionView(
     private fun applyTargetPane(pane: JBHtmlPane) {
         pane.font = style.transcriptFont
         pane.foreground = style.editorForeground
-        pane.background = SessionUiStyle.View.headerHover()
+        pane.background = SessionUiStyle.View.Surface.headerHoverBgColor()
         pane.reloadCssStylesheets()
     }
 
@@ -182,7 +181,7 @@ class PermissionView(
         val sheet = StyleSheet()
         val font = style.transcriptFont
```

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt
new file mode 100644
index 000000000..24d36cff6
--- /dev/null
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt
@@ -0,0 +1,188 @@
+package ai.kilocode.client.session.views.tool
+
+import ai.kilocode.client.session.model.Content
+import ai.kilocode.client.session.model.Tool
+import ai.kilocode.client.session.model.ToolExecState
+import ai.kilocode.client.session.ui.selection.SessionSelection
+import ai.kilocode.client.session.ui.style.SessionEditorStyle
+import ai.kilocode.client.session.ui.style.SessionUiStyle
+import ai.kilocode.client.session.views.base.SecondarySessionPartView
+import ai.kilocode.client.ui.UiStyle
+import com.intellij.openapi.util.Disposer
+import com.intellij.util.concurrency.annotations.RequiresEdt
+import com.intellij.util.ui.JBUI
+import java.awt.Dimension
+import javax.swing.Icon
+
+abstract class BaseSearchToolView(
+    tool: Tool,
+    private val selection: SessionSelection? = null,
+    private val parts: ToolParts,
+    private val repo: String? = null,
+) : SecondarySessionPartView(parts.header, { parts.scroll(tool) }) {
+
+    override val contentId: String = tool.id
+
+    protected var item = tool
+    private var style = SessionEditorStyle.current()
+    private var registered = false
+    private var disposed = false
+
+    protected abstract fun toolIcon(tool: Tool): Icon
+    protected abstract fun toolTitle(tool: Tool): String
+    protected abstract fun targets(tool: Tool, repo: String?): List<String>
+    protected abstract fun viewName(): String
+
+    init {
+        bindHeader(parts.glyph, parts.title, parts.sub, parts.state, parts.center, parts.controls, parts.slot)
+        parts.targets.forEach { bindHeader(it) }
+        applyStyle(style)
+        sync()
+    }
+
+    @RequiresEdt
+    override fun expand(): Boolean {
```

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/GlobToolView.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/GlobToolView.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/GlobToolView.kt
new file mode 100644
index 000000000..ccb204da0
--- /dev/null
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/GlobToolView.kt
@@ -0,0 +1,23 @@
+package ai.kilocode.client.session.views.tool
+
+import ai.kilocode.client.plugin.KiloBundle
+import ai.kilocode.client.session.model.Tool
+import ai.kilocode.client.session.ui.selection.SessionSelection
+
+/** Renders glob calls with a stacked, collapsible search-result header. */
+class GlobToolView(
+    tool: Tool,
+    selection: SessionSelection? = null,
+    parts: ToolParts = searchParts(2),
+    repo: String? = null,
+) : BaseSearchToolView(tool, selection, parts, repo) {
+
+    companion object {
+        fun canRender(tool: Tool): Boolean = tool.name == "glob"
+    }
+
+    override fun toolIcon(tool: Tool) = icon(tool)
+    override fun toolTitle(tool: Tool) = KiloBundle.message("session.part.tool.glob")
+    override fun targets(tool: Tool, repo: String?) = listOf(globDirectory(tool, repo), globPattern(tool)).filter { it.isNotBlank() }
+    override fun viewName() = "GlobToolView"
+}
```

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ReadToolView.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ReadToolView.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ReadToolView.kt
new file mode 100644
index 000000000..d2c2a623e
--- /dev/null
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ReadToolView.kt
@@ -0,0 +1,170 @@
+package ai.kilocode.client.session.views.tool
+
+import ai.kilocode.client.session.model.Content
+import ai.kilocode.client.session.model.Tool
+import ai.kilocode.client.session.model.ToolExecState
+import ai.kilocode.client.session.model.ToolKind
+import ai.kilocode.client.session.ui.selection.SessionSelection
+import ai.kilocode.client.session.ui.style.SessionEditorStyle
+import ai.kilocode.client.session.ui.style.SessionUiStyle
+import ai.kilocode.client.session.views.base.SecondarySessionPartView
+import ai.kilocode.client.ui.UiStyle
+import com.intellij.util.concurrency.annotations.RequiresEdt
+import com.intellij.util.ui.JBUI
+import java.awt.Dimension
+import javax.swing.ScrollPaneConstants
+
+/** Renders read calls with secondary, borderless chrome. */
+class ReadToolView(
+    tool: Tool,
+    openFile: (String) -> Unit = {},
+    private val selection: SessionSelection? = null,
+    private val parts: ToolParts = toolParts(tool, openFile),
+) : SecondarySessionPartView(parts.header, parts.scroll(tool), expandable = false) {
+
+    companion object {
+        fun canRender(tool: Tool): Boolean = tool.kind == ToolKind.READ
+    }
+
+    override val contentId: String = tool.id
+
+    private var item = tool
+    private var style = SessionEditorStyle.current()
+
+    init {
+        parts.text?.let { selection?.register(it, this) }
+        bindHeader(parts.glyph, parts.title, parts.sub, parts.state, parts.center, parts.controls, parts.slot)
+        parts.text?.text = preview(item)
+        applyStyle(style)
+        sync()
+    }
+
+    @RequiresEdt
+    override fun getPreferredSize(): Dimension {
+        val size = super.getPreferredSize()
```


*... and more files (showing first 5)*

## opencode Changes (671d193..97e713e)

### Commits

- 97e713e - zen: deepseek v4 pro (Frank, 2026-06-10)
- 8264191 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-10)
- e0449c0 - fix(desktop): restore macOS auto-updates (#31621) (Luke Parker, 2026-06-10)
- 5e342f7 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-10)
- 174ab58 - fix(mcp): apply timeouts to prompts and resources (#31612) (Aiden Cline, 2026-06-09)
- 954d618 - fix(opencode): support Anthropic fallback responses (#31611) (Aiden Cline, 2026-06-09)
- 9107336 - fix(mcp): make client creation failure-safe (#31595) (Aiden Cline, 2026-06-09)
- 8a2cfc0 - feat(core): add project reference guidance (#31601) (Dax, 2026-06-10)
- 0fc33e2 - feat(app): /new-session route for new design (#31457) (Brendan Allan, 2026-06-10)
- 6c6ed68 - sync release versions for v1.17.0 (opencode, 2026-06-10)
- e9106ef - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-10)
- e9e2612 - chore: Update fff to 0.9.4 (#31583) (Dmitriy Kovalenko, 2026-06-09)
- 4ae468f - chore: generate (opencode-agent[bot], 2026-06-10)
- 7859182 - fix(core): expose partial filesystem scan results (Dax Raad, 2026-06-09)
- be8fee5 - chore: generate (opencode-agent[bot], 2026-06-10)
- 4597c68 - fix(core): prefer shorter paths for tied search scores (Dax Raad, 2026-06-09)
- c4aa049 - fix(tui): let gutter replace current marker (#31586) (Dax, 2026-06-09)
- 1d46b5c - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-10)
- 6ae6f0f - chore: generate (opencode-agent[bot], 2026-06-10)
- a0409e6 - refactor(core): unify filesystem search service (#31566) (Dax, 2026-06-09)
- ce4e658 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-09)
- 215fb39 - chore: generate (opencode-agent[bot], 2026-06-09)
- 1cc94bb - fix(desktop): update Electron stack and panel layout (#31571) (Luke Parker, 2026-06-09)
- bc42187 - zen: update email (Frank, 2026-06-09)
- 80c0b06 - feat: add X-Session-Id header for proxy cache routing affinity (#31511) (Songchao Wang, 2026-06-09)
- 381eabb - refactor(mcp): simplify service helpers (#31549) (Aiden Cline, 2026-06-09)
- c939aa0 - chore: generate (opencode-agent[bot], 2026-06-09)
- 9b8e356 - zen: add claude fable 5 (Frank, 2026-06-09)
- 07e5ea9 - feat(opencode): add typed application layer graph (#31531) (James Long, 2026-06-09)
- 7a54a2c - chore: generate (opencode-agent[bot], 2026-06-09)
- 600e405 - fix(opencode): restore effect error logging (#31551) (Dax, 2026-06-09)
- 1daf535 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-09)
- cc52dc3 - chore: generate (opencode-agent[bot], 2026-06-09)
- 132ef57 - refactor(core): simplify location filesystem (#31545) (Dax, 2026-06-09)
- 0777cf1 - fix(mcp): log actionable connection statuses (#31544) (Aiden Cline, 2026-06-09)
- c4bc902 - fix(opencode): support Claude Fable reasoning (#31546) (Aiden Cline, 2026-06-09)
- d68397b - fix(data): timestamp formatting (Adam, 2026-06-09)
- 531eebb - zen: add north mini code model (Frank, 2026-06-09)
- db9391e - drop citation_options from cohere (#31543) (Aiden Cline, 2026-06-09)
- f1c31f4 - fix(stats): use data branding assets (Adam, 2026-06-09)
- ada5b31 - chore: generate (opencode-agent[bot], 2026-06-09)
- ffcb45d - feat(tui): show project copy in session list (#31421) (James Long, 2026-06-09)
- 6566ede - refactor(core): consolidate references (#31539) (Dax, 2026-06-09)
- 0bb677c - feat(opencode): configure Cohere North model (#31536) (Aiden Cline, 2026-06-09)
- 8415ff5 - chore: generate (opencode-agent[bot], 2026-06-09)
- 3752218 - refactor(tui): centralize application exit (#31524) (Dax, 2026-06-09)
- 960eace - test(core): avoid Windows worker close race (#31532) (Aiden Cline, 2026-06-09)
- b4a6419 - chore: stats -> data (Adam, 2026-06-09)
- 7c1e61a - leave a breadcrumb comment about batchWindow zero (#31508) (Sebastian, 2026-06-09)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/core/src/tool/apply-patch.ts` (+2, -2)
- `packages/core/src/tool/bash.ts` (+2, -2)
- `packages/core/src/tool/builtins.ts` (+2, -1)
- `packages/core/src/tool/edit.ts` (+5, -6)
- `packages/core/src/tool/glob.ts` (+45, -34)
- `packages/core/src/tool/grep.ts` (+73, -52)
- `packages/core/src/tool/question.ts` (+2, -2)
- `packages/core/src/tool/read-filesystem.ts` (+304, -0)
- `packages/core/src/tool/read.ts` (+35, -17)
- `packages/core/src/tool/registry.ts` (+4, -2)
- `packages/core/src/tool/skill.ts` (+2, -2)
- `packages/core/src/tool/todowrite.ts` (+2, -2)
- `packages/core/src/tool/tool.ts` (+6, -7)
- `packages/core/src/tool/webfetch.ts` (+2, -2)
- `packages/core/src/tool/websearch.ts` (+2, -2)
- `packages/core/src/tool/write.ts` (+5, -6)
- `packages/opencode/src/tool/external-directory.ts` (+4, -3)
- `packages/opencode/src/tool/glob.ts` (+11, -19)
- `packages/opencode/src/tool/grep.ts` (+16, -44)
- `packages/opencode/src/tool/read.ts` (+2, -8)
- `packages/opencode/src/tool/registry.ts` (+26, -29)
- `packages/opencode/src/tool/skill.ts` (+11, -12)
- `packages/opencode/src/tool/truncate.ts` (+3, -0)
- `packages/opencode/test/tool/glob.test.ts` (+2, -54)
- `packages/opencode/test/tool/grep.test.ts` (+21, -62)
- `packages/opencode/test/tool/read.test.ts` (+2, -51)
- `packages/opencode/test/tool/registry.test.ts` (+3, -6)
- `packages/opencode/test/tool/skill.test.ts` (+2, -1)
- `packages/opencode/test/tool/task.test.ts` (+2, -1)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+24, -1)
- `packages/opencode/test/agent/agent.test.ts` (+22, -1)
- `packages/opencode/test/agent/plugin-agent-regression.test.ts` (+2, -0)

#### Permission System (**/permission/)
- `packages/opencode/src/permission/index.ts` (+3, -0)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/console/core/package.json` (+1, -1)
- `packages/core/package.json` (+4, -5)
- `packages/core/src/config/plugin/reference.ts` (+69, -0)
- `packages/core/src/config/reference.ts` (+4, -30)
- `packages/core/src/cross-spawn-spawner.ts` (+3, -0)
- `packages/core/src/database/database.ts` (+3, -0)
- `packages/core/src/effect/layer-node-platform.ts` (+12, -0)
- `packages/core/src/effect/layer-node.ts` (+95, -0)
- `packages/core/src/event.ts` (+2, -0)
- `packages/core/src/filesystem.ts` (+78, -579)
- `packages/core/src/filesystem/fff.bun.ts` (+4, -0)
- `packages/core/src/filesystem/ripgrep.ts` (+0, -484)
- `packages/core/src/filesystem/schema.ts` (+23, -0)
- `packages/core/src/filesystem/search.ts` (+216, -523)
- `packages/core/src/flag/flag.ts` (+0, -1)
- `packages/core/src/fs-util.ts` (+3, -0)
- `packages/core/src/git.ts` (+2, -0)
- `packages/core/src/global.ts` (+2, -0)
- `packages/core/src/image.ts` (+9, -3)
- `packages/core/src/image/photon.ts` (+2, -2)
- `packages/core/src/location-layer.ts` (+13, -8)
- `packages/core/src/location-search.ts` (+0, -190)
- `packages/core/src/location.ts` (+3, -4)
- `packages/core/src/models-dev.ts` (+3, -0)
- `packages/core/src/npm.ts` (+3, -0)
- `packages/core/src/observability/logging.ts` (+1, -0)
- `packages/core/src/plugin/boot.ts` (+7, -0)
- `packages/core/src/plugin/skill/customize-opencode.md` (+46, -0)
- `packages/core/src/process.ts` (+2, -0)
- `packages/core/src/project-reference.ts` (+0, -243)
- `packages/core/src/project.ts` (+10, -3)
- `packages/core/src/project/copy.ts` (+2, -0)
- `packages/core/src/pty/ticket.ts` (+2, -0)
- `packages/core/src/public/opencode.ts` (+2, -3)
- `packages/core/src/reference.ts` (+138, -0)
- `packages/core/src/reference/guidance.ts` (+69, -0)
- `packages/core/src/ripgrep.ts` (+123, -28)
- `packages/core/src/ripgrep/binary.ts` (+130, -0)
- `packages/core/src/session/event.ts` (+5, -6)
- `packages/core/src/session/input.ts` (+0, -1)
- `packages/core/src/session/message-updater.ts` (+0, -1)
- `packages/core/src/session/message.ts` (+7, -9)
- `packages/core/src/session/projector.ts` (+2, -0)
- `packages/core/src/session/prompt.ts` (+1, -15)
- `packages/core/src/session/runner/llm.ts` (+5, -3)
- `packages/core/src/session/runner/publish-llm-event.ts` (+5, -12)
- `packages/core/src/session/runner/to-llm-message.ts` (+2, -4)
- `packages/core/src/tool-output.ts` (+0, -11)
- `packages/core/src/util/effect-flock.ts` (+2, -0)
- `packages/core/src/v1/config/config.ts` (+3, -3)
- `packages/core/src/v1/config/migrate.ts` (+1, -2)
- `packages/core/src/v1/config/reference.ts` (+0, -24)
- `packages/core/test/application-tools.test.ts` (+3, -3)
- `packages/core/test/config/config.test.ts` (+6, -2)
- `packages/core/test/filesystem/ripgrep.test.ts` (+0, -231)
- `packages/core/test/filesystem/search.test.ts` (+33, -163)
- `packages/core/test/location-filesystem.test.ts` (+26, -537)
- `packages/core/test/location-layer.test.ts` (+19, -6)
- `packages/core/test/location-mutation.test.ts` (+1, -1)
- `packages/core/test/location-search.test.ts` (+0, -276)
- `packages/core/test/project-reference.test.ts` (+0, -299)
- `packages/core/test/project.test.ts` (+7, -5)
- `packages/core/test/reference-guidance.test.ts` (+77, -0)
- `packages/core/test/reference.test.ts` (+96, -0)
- `packages/core/test/ripgrep.test.ts` (+64, -0)
- `packages/core/test/session-compaction.test.ts` (+1, -1)
- `packages/core/test/session-runner-message.test.ts` (+8, -11)
- `packages/core/test/session-runner-recorded.test.ts` (+3, -0)
- `packages/core/test/session-runner-tool-events.test.ts` (+5, -5)
- `packages/core/test/session-runner.test.ts` (+5, -2)
- `packages/core/test/session-tool-progress.test.ts` (+1, -2)
- `packages/core/test/tool-glob.test.ts` (+0, -225)
- `packages/core/test/tool-grep.test.ts` (+0, -282)
- `packages/core/test/tool-output-store.test.ts` (+3, -3)
- `packages/core/test/tool-read.test.ts` (+118, -94)
- `packages/core/test/util/effect-flock.test.ts` (+10, -5)
- `packages/core/test/util/flock.test.ts` (+8, -6)
- `packages/stats/core/package.json` (+1, -1)

#### Other Changes
- `.github/workflows/test.yml` (+1, -23)
- `.opencode/opencode.jsonc` (+9, -2)
- `bun.lock` (+179, -77)
- `bunfig.toml` (+1, -1)
- `infra/stats.ts` (+1, -1)
- `nix/hashes.json` (+4, -4)
- `package.json` (+1, -0)
- `packages/app/package.json` (+2, -3)
- `packages/app/playwright.config.ts` (+1, -7)
- `packages/app/src/app.tsx` (+84, -8)
- `packages/app/src/components/file-tree.test.ts` (+2, -0)
- `packages/app/src/components/prompt-input.tsx` (+14, -1)
- `packages/app/src/components/prompt-input/server-attachment.test.ts` (+9, -2)
- `packages/app/src/components/prompt-input/server-attachment.ts` (+3, -3)
- `packages/app/src/components/prompt-input/submit.test.ts` (+12, -0)
- `packages/app/src/components/prompt-input/submit.ts` (+14, -2)
- `packages/app/src/components/titlebar.tsx` (+79, -6)
- `packages/app/src/context/comments.test.ts` (+2, -0)
- `packages/app/src/context/layout.tsx` (+9, -2)
- `packages/app/src/context/tabs.tsx` (+16, -9)
- `packages/app/src/context/terminal.test.ts` (+2, -0)
- `packages/app/src/pages/directory-layout.tsx` (+3, -1)
- `packages/app/src/pages/new-session.tsx` (+78, -0)
- `packages/app/src/pages/session.tsx` (+17, -14)
- `packages/app/src/pages/session/helpers.test.ts` (+9, -0)
- `packages/app/src/pages/session/helpers.ts` (+4, -0)
- `packages/app/src/pages/session/new-session-layout.test.ts` (+0, -14)
- `packages/app/src/pages/session/new-session-layout.ts` (+0, -4)
- `packages/app/src/pages/session/session-side-panel.tsx` (+17, -3)
- `packages/cli/package.json` (+1, -1)
- `packages/cli/script/build.ts` (+2, -0)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/lib/stats-proxy.ts` (+16, -3)
- `packages/console/app/src/routes/data/[...path].ts` (+8, -0)
- `packages/console/app/src/routes/data/index.ts` (+8, -0)
- `packages/console/app/src/routes/stats/[...path].ts` (+7, -7)
- `packages/console/app/src/routes/stats/index.ts` (+7, -7)
- `packages/console/function/package.json` (+2, -2)
- `packages/console/mail/package.json` (+1, -1)
- `packages/console/support/package.json` (+1, -1)
- `packages/desktop/electron-builder.config.ts` (+1, -0)
- `packages/desktop/package.json` (+5, -5)
- `packages/effect-drizzle-sqlite/package.json` (+2, -3)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/enterprise/package.json` (+1, -1)
- `packages/function/package.json` (+1, -1)
- `packages/http-recorder/package.json` (+2, -3)
- `packages/llm/package.json` (+2, -2)
- `packages/llm/src/protocols/anthropic-messages.ts` (+4, -4)
- `packages/llm/src/protocols/bedrock-converse.ts` (+6, -1)
- `packages/llm/src/protocols/gemini.ts` (+3, -3)
- `packages/llm/src/protocols/openai-chat.ts` (+8, -8)
- `packages/llm/src/protocols/openai-responses.ts` (+4, -4)
- `packages/llm/src/protocols/shared.ts` (+4, -0)
- `packages/llm/src/schema/messages.ts` (+12, -89)
- `packages/llm/src/tool.ts` (+2, -2)
- `packages/llm/test/provider/anthropic-messages.test.ts` (+3, -3)
- `packages/llm/test/provider/bedrock-converse.test.ts` (+1, -1)
- `packages/llm/test/provider/gemini.test.ts` (+2, -2)
- `packages/llm/test/provider/openai-chat.test.ts` (+17, -5)
- `packages/llm/test/provider/openai-responses.test.ts` (+3, -3)
- `packages/llm/test/recorded-scenarios.ts` (+1, -1)
- `packages/llm/test/tool-runtime.test.ts` (+38, -47)
- `packages/opencode/BUN_SHELL_MIGRATION_PLAN.md` (+0, -136)
- `packages/opencode/package.json` (+5, -4)
- `packages/opencode/script/bench-search.ts` (+11, -32)
- `packages/opencode/script/build.ts` (+3, -1)
- `packages/opencode/src/account/account.ts` (+4, -0)
- `packages/opencode/src/account/repo.ts` (+3, -0)
- `packages/opencode/src/auth/index.ts` (+3, -0)
- `packages/opencode/src/background/job.ts` (+3, -0)
- `packages/opencode/src/cli/cmd/debug/file.ts` (+4, -24)
- `packages/opencode/src/cli/cmd/debug/ripgrep.ts` (+20, -40)
- `packages/opencode/src/cli/cmd/debug/v2.ts` (+6, -3)
- `packages/opencode/src/cli/cmd/tui.ts` (+1, -1)
- `packages/opencode/src/command/index.ts` (+3, -0)
- `packages/opencode/src/config/config.ts` (+4, -0)
- `packages/opencode/src/config/reference.ts` (+0, -48)
- `packages/opencode/src/control-plane/workspace.ts` (+23, -5)
- `packages/opencode/src/effect/app-runtime.ts` (+6, -7)
- `packages/opencode/src/effect/runtime-flags.ts` (+3, -0)
- `packages/opencode/src/env/index.ts` (+3, -0)
- `packages/opencode/src/event-v2-bridge.ts` (+3, -0)
- `packages/opencode/src/format/index.ts` (+3, -0)
- `packages/opencode/src/git/index.ts` (+3, -0)
- `packages/opencode/src/image/image.ts` (+3, -0)
- `packages/opencode/src/installation/index.ts` (+4, -0)
- `packages/opencode/src/lsp/lsp.ts` (+4, -0)
- `packages/opencode/src/mcp/auth.ts` (+3, -0)
- `packages/opencode/src/mcp/index.ts` (+104, -79)
- `packages/opencode/src/plugin/index.ts` (+14, -4)
- `packages/opencode/src/plugin/tui/internal.ts` (+0, -2)
- `packages/opencode/src/project/bootstrap.ts` (+13, -17)
- `packages/opencode/src/project/instance-store.ts` (+4, -0)
- `packages/opencode/src/project/project.ts` (+12, -0)
- `packages/opencode/src/project/vcs.ts` (+3, -0)
- `packages/opencode/src/provider/auth.ts` (+3, -0)
- `packages/opencode/src/provider/provider.ts` (+11, -0)
- `packages/opencode/src/provider/transform.ts` (+16, -7)
- `packages/opencode/src/question/index.ts` (+3, -0)
- `packages/opencode/src/reference/reference.ts` (+0, -237)
- `packages/opencode/src/reference/repository-cache.ts` (+0, -320)
- `packages/opencode/src/server/routes/instance/httpapi/api.ts` (+0, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/file.ts` (+15, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/reference.ts` (+0, -60)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/file.ts` (+50, -51)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/pty.ts` (+9, -4)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/reference.ts` (+0, -27)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/error.ts` (+10, -0)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+3, -7)
- `packages/opencode/src/session/compaction.ts` (+12, -0)
- `packages/opencode/src/session/instruction.ts` (+4, -0)
- `packages/opencode/src/session/llm.ts` (+27, -1)
- `packages/opencode/src/session/llm/request.ts` (+1, -0)
- `packages/opencode/src/session/processor.ts` (+29, -12)
- `packages/opencode/src/session/prompt.ts` (+33, -86)
- `packages/opencode/src/session/prompt/reference.ts` (+0, -72)
- `packages/opencode/src/session/revert.ts` (+10, -0)
- `packages/opencode/src/session/run-state.ts` (+3, -0)
- `packages/opencode/src/session/session.ts` (+3, -0)
- `packages/opencode/src/session/status.ts` (+3, -0)
- `packages/opencode/src/session/summary.ts` (+3, -0)
- `packages/opencode/src/session/system.ts` (+35, -2)
- `packages/opencode/src/session/todo.ts` (+3, -0)
- `packages/opencode/src/share/session.ts` (+3, -0)
- `packages/opencode/src/share/share-next.ts` (+12, -0)
- `packages/opencode/src/skill/discovery.ts` (+4, -0)
- `packages/opencode/src/skill/index.ts` (+10, -0)
- `packages/opencode/src/snapshot/index.ts` (+3, -0)
- `packages/opencode/src/storage/storage.ts` (+3, -0)
- `packages/opencode/src/worktree/index.ts` (+12, -0)
- `packages/opencode/test/control-plane/workspace.test.ts` (+2, -0)
- `packages/opencode/test/effect/app-graph-types.test.ts` (+104, -0)
- `packages/opencode/test/effect/app-graph.test.ts` (+207, -0)
- `packages/opencode/test/mcp/lifecycle.test.ts` (+63, -0)
- `packages/opencode/test/plugin/workspace-adapter.test.ts` (+4, -1)
- `packages/opencode/test/provider/transform.test.ts` (+29, -0)
- `packages/opencode/test/reference/reference.test.ts` (+0, -310)
- `packages/opencode/test/server/httpapi-error-middleware.test.ts` (+11, -6)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+6, -1)
- `packages/opencode/test/server/httpapi-instance-context.test.ts` (+2, -1)
- `packages/opencode/test/server/httpapi-promptasync-context.test.ts` (+2, -1)
- `packages/opencode/test/server/httpapi-public-openapi.test.ts` (+3, -7)
- `packages/opencode/test/server/httpapi-reference.test.ts` (+23, -14)
- `packages/opencode/test/server/httpapi-sdk.test.ts` (+3, -0)
- `packages/opencode/test/server/httpapi-session.test.ts` (+2, -1)
- `packages/opencode/test/server/httpapi-workspace-routing.test.ts` (+2, -1)
- `packages/opencode/test/server/httpapi-workspace.test.ts` (+2, -1)
- `packages/opencode/test/server/project-copy.test.ts` (+11, -3)
- `packages/opencode/test/session/prompt.test.ts` (+2, -93)
- `packages/opencode/test/session/snapshot-tool-race.test.ts` (+2, -7)
- `packages/opencode/test/session/structured-output-integration.test.ts` (+4, -1)
- `packages/opencode/test/session/system.test.ts` (+2, -0)
- `packages/opencode/test/v2/session-message-updater.test.ts` (+1, -2)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/client.ts` (+1, -2)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+70, -43)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+158, -126)
- `packages/sdk/openapi.json` (+428, -360)
- `packages/server/package.json` (+1, -1)
- `packages/server/src/api.ts` (+2, -0)
- `packages/server/src/groups/fs.ts` (+22, -3)
- `packages/server/src/groups/location.ts` (+2, -2)
- `packages/server/src/groups/reference.ts` (+28, -0)
- `packages/server/src/handlers.ts` (+2, -0)
- `packages/server/src/handlers/fs.ts` (+24, -2)
- `packages/server/src/handlers/reference.ts` (+8, -0)
- `packages/server/src/middleware/session-location.ts` (+7, -4)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/app/public/banner.jpg` (+-, --)
- `packages/stats/app/public/banner.png` (+-, --)
- `packages/stats/app/src/app.tsx` (+2, -2)
- `packages/stats/app/src/routes/[lab]/[model].tsx` (+10, -10)
- `packages/stats/app/src/routes/[lab]/index.tsx` (+6, -6)
- `packages/stats/app/src/routes/index.css` (+3, -15)
- `packages/stats/app/src/routes/index.tsx` (+11, -11)
- `packages/stats/app/src/routes/stats-shell.tsx` (+22, -39)
- `packages/stats/app/vite.config.ts` (+1, -1)
- `packages/stats/server/package.json` (+1, -1)
- `packages/tui/package.json` (+3, -3)
- `packages/tui/src/app.tsx` (+111, -92)
- `packages/tui/src/component/dialog-move-session.tsx` (+1, -1)
- `packages/tui/src/component/dialog-session-list.tsx` (+9, -21)
- `packages/tui/src/component/error-component.tsx` (+5, -5)
- `packages/tui/src/component/prompt/autocomplete.tsx` (+21, -51)
- `packages/tui/src/component/prompt/index.tsx` (+3, -2)
- `packages/tui/src/context/aggregate-failures.ts` (+0, -51)
- `packages/tui/src/context/exit.tsx` (+8, -0)
- `packages/tui/src/context/project.tsx` (+7, -2)
- `packages/tui/src/context/sync-v2.tsx` (+20, -2)
- `packages/tui/src/context/sync.tsx` (+11, -22)
- `packages/tui/src/feature-plugins/builtins.ts` (+1, -6)
- `packages/tui/src/feature-plugins/session/dialog.tsx` (+0, -356)
- `packages/tui/src/feature-plugins/session/index.tsx` (+0, -32)
- `packages/tui/src/feature-plugins/session/preview-pane.tsx` (+0, -288)
- `packages/tui/src/feature-plugins/session/util.tsx` (+0, -54)
- `packages/tui/src/feature-plugins/system/session-v2.tsx` (+1, -2)
- `packages/tui/src/ui/dialog-select.tsx` (+1, -5)
- `packages/tui/src/util/renderer.ts` (+4, -2)
- `packages/tui/test/cli/tui/sync-v2.test.tsx` (+46, -0)
- `packages/tui/test/context/aggregate-failures.test.ts` (+0, -95)
- `packages/tui/test/fixture/tui-sdk.ts` (+2, -0)
- `packages/ui/package.json` (+2, -3)
- `packages/web/astro.config.mjs` (+1, -0)
- `packages/web/config.mjs` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/ar/zen.mdx` (+9, -1)
- `packages/web/src/content/docs/bs/zen.mdx` (+9, -1)
- `packages/web/src/content/docs/da/zen.mdx` (+9, -1)
- `packages/web/src/content/docs/de/zen.mdx` (+9, -1)
- `packages/web/src/content/docs/es/zen.mdx` (+9, -1)
- `packages/web/src/content/docs/fr/zen.mdx` (+9, -1)
- `packages/web/src/content/docs/it/zen.mdx` (+9, -1)
- `packages/web/src/content/docs/ja/zen.mdx` (+9, -1)
- `packages/web/src/content/docs/ko/zen.mdx` (+9, -1)
- `packages/web/src/content/docs/nb/zen.mdx` (+9, -1)
- `packages/web/src/content/docs/pl/zen.mdx` (+9, -1)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+9, -1)
- `packages/web/src/content/docs/references.mdx` (+157, -0)
- `packages/web/src/content/docs/ru/zen.mdx` (+9, -1)
- `packages/web/src/content/docs/th/zen.mdx` (+9, -1)
- `packages/web/src/content/docs/tr/zen.mdx` (+9, -1)
- `packages/web/src/content/docs/tui.mdx` (+1, -1)
- `packages/web/src/content/docs/zen.mdx` (+9, -1)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+9, -1)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+9, -1)
- `patches/@ff-labs%2Ffff-bun@0.9.3.patch` (+31, -0)
- `sdks/vscode/package.json` (+1, -1)
- `turbo.json` (+0, -19)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 72e9f1d..8de0eb9 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.16.2",
+  "version": "1.17.0",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index e720d93..3ca9618 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.16.2",
+  "version": "1.17.0",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
@@ -9,8 +9,7 @@
     "db": "bun drizzle-kit",
     "migration": "bun run script/migration.ts",
     "fix-node-pty": "bun run script/fix-node-pty.ts",
-    "test": "bun test",
-    "test:ci": "mkdir -p .artifacts/unit && bun test --timeout 30000 --reporter=junit --reporter-outfile=.artifacts/unit/junit.xml",
+    "test": "bun test --only-failures",
     "typecheck": "tsgo --noEmit"
   },
   "bin": {
@@ -63,7 +62,7 @@
   "dependencies": {
     "@ai-sdk/alibaba": "1.0.17",
     "@ai-sdk/amazon-bedrock": "4.0.112",
-    "@ai-sdk/anthropic": "3.0.71",
+    "@ai-sdk/anthropic": "3.0.82",
     "@ai-sdk/azure": "3.0.49",
     "@ai-sdk/cerebras": "2.0.41",
     "@ai-sdk/cohere": "3.0.27",
@@ -86,7 +85,7 @@
     "@effect/platform-node": "catalog:",
     "@effect/sql-sqlite-bun": "catalog:",
     "@lydell/node-pty": "catalog:",
-    "@ff-labs/fff-bun": "0.9.3",
+    "@ff-labs/fff-bun": "0.9.4",
     "@npmcli/arborist": "9.4.0",
     "@npmcli/config": "10.8.1",
     "@opencode-ai/effect-drizzle-sqlite": "workspace:*",
```

#### packages/core/src/config/plugin/reference.ts
```diff
diff --git a/packages/core/src/config/plugin/reference.ts b/packages/core/src/config/plugin/reference.ts
new file mode 100644
index 0000000..22c7664
--- /dev/null
+++ b/packages/core/src/config/plugin/reference.ts
@@ -0,0 +1,69 @@
+export * as ConfigReferencePlugin from "./reference"
+
+import path from "path"
+import { Effect } from "effect"
+import { Config } from "../../config"
+import { ConfigReference } from "../reference"
+import { Global } from "../../global"
+import { Location } from "../../location"
+import { PluginV2 } from "../../plugin"
+import { Reference } from "../../reference"
+import { AbsolutePath } from "../../schema"
+
+export const Plugin = {
+  id: PluginV2.ID.make("core/config-reference"),
+  effect: Effect.gen(function* () {
+    const config = yield* Config.Service
+    const global = yield* Global.Service
+    const location = yield* Location.Service
+    const references = yield* Reference.Service
+    const update = yield* references.transform()
+    const entries = new Map<string, Reference.Source>()
+    for (const doc of (yield* config.entries()).filter(
+      (entry): entry is Config.Document => entry.type === "document",
+    )) {
+      const directory = doc.path ? path.dirname(doc.path) : location.directory
+      for (const [name, entry] of Object.entries(doc.info.references ?? {})) {
+        if (!validAlias(name)) continue
+        entries.set(
+          name,
+          local(entry)
+            ? new Reference.LocalSource({
+                type: "local",
+                path: AbsolutePath.make(
+                  localPath(directory, global.home, typeof entry === "string" ? entry : entry.path),
+                ),
+                description: typeof entry === "string" ? undefined : entry.description,
+                hidden: typeof entry === "string" ? undefined : entry.hidden,
+              })
+            : new Reference.GitSource({
+                type: "git",
+                repository: typeof entry === "string" ? entry : entry.repository,
+                branch: typeof entry === "string" ? undefined : entry.branch,
+                description: typeof entry === "string" ? undefined : entry.description,
+                hidden: typeof entry === "string" ? undefined : entry.hidden,
```

#### packages/core/src/config/reference.ts
```diff
diff --git a/packages/core/src/config/reference.ts b/packages/core/src/config/reference.ts
index fbd6c84..4518eb4 100644
--- a/packages/core/src/config/reference.ts
+++ b/packages/core/src/config/reference.ts
@@ -5,10 +5,14 @@ import { Schema } from "effect"
 export class Git extends Schema.Class<Git>("ConfigV2.Reference.Git")({
   repository: Schema.String,
   branch: Schema.String.pipe(Schema.optional),
+  description: Schema.String.pipe(Schema.optional),
+  hidden: Schema.Boolean.pipe(Schema.optional),
 }) {}
 
 export class Local extends Schema.Class<Local>("ConfigV2.Reference.Local")({
   path: Schema.String,
+  description: Schema.String.pipe(Schema.optional),
+  hidden: Schema.Boolean.pipe(Schema.optional),
 }) {}
 
 export const Entry = Schema.Union([Schema.String, Git, Local])
@@ -16,33 +20,3 @@ export type Entry = typeof Entry.Type
 
 export const Info = Schema.Record(Schema.String, Entry)
 export type Info = typeof Info.Type
-
-export type NormalizedEntry =
-  | { readonly kind: "local"; readonly path: string }
-  | { readonly kind: "git"; readonly repository: string; readonly branch?: string }
-  | { readonly kind: "invalid"; readonly message: string }
-
-export type NormalizedInfo = Record<string, NormalizedEntry>
-
-export function validateAlias(name: string) {
-  if (name.length === 0) return "Reference alias must not be empty"
-  if (/[\/\s`,]/.test(name)) return "Reference alias must not contain /, whitespace, comma, or backtick"
-}
-
-export function normalizeEntry(entry: Entry): NormalizedEntry {
-  if (typeof entry === "string") {
-    if (entry.startsWith(".") || entry.startsWith("/") || entry.startsWith("~")) return { kind: "local", path: entry }
-    return { kind: "git", repository: entry }
-  }
-  if ("path" in entry) return { kind: "local", path: entry.path }
-  return { kind: "git", repository: entry.repository, branch: entry.branch }
-}
-
-export function normalize(info: Info): NormalizedInfo {
-  return Object.fromEntries(
-    Object.entries(info).map(([name, entry]) => {
-      const message = validateAlias(name)
-      return [name, message ? { kind: "invalid" as const, message } : normalizeEntry(entry)]
```

#### packages/core/src/cross-spawn-spawner.ts
```diff
diff --git a/packages/core/src/cross-spawn-spawner.ts b/packages/core/src/cross-spawn-spawner.ts
index ad8d412..d6e0f9f 100644
--- a/packages/core/src/cross-spawn-spawner.ts
+++ b/packages/core/src/cross-spawn-spawner.ts
@@ -24,6 +24,8 @@ import {
 import * as NodeChildProcess from "node:child_process"
 import { PassThrough } from "node:stream"
 import launch from "cross-spawn"
+import { LayerNode } from "./effect/layer-node"
+import { filesystem, path } from "./effect/layer-node-platform"
 
 const toError = (err: unknown): Error => (err instanceof globalThis.Error ? err : new globalThis.Error(String(err)))
 
@@ -501,5 +503,6 @@ export const layer: Layer.Layer<ChildProcessSpawner, never, FileSystem.FileSyste
 )
 
 export const defaultLayer = layer.pipe(Layer.provide(NodeFileSystem.layer), Layer.provide(NodePath.layer))
+export const node = LayerNode.make(layer, [filesystem, path])
 
 export * as CrossSpawnSpawner from "./cross-spawn-spawner"
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/src/agent/agent.ts
- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/test/agent/agent.test.ts
- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/test/agent/plugin-agent-regression.test.ts
- `src/core/` - review core changes from packages/core/package.json
- `src/permission/` - review permission changes from packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
- `src/permission/` - review permission changes from packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/permission/PermissionViewTest.kt
- `src/tool/BaseSearchToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt changes
- `src/tool/GlobToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/GlobToolView.kt changes
- `src/tool/ReadToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ReadToolView.kt changes
- `src/tool/SearchToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/SearchToolView.kt changes
- `src/tool/ToolSupport.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt changes
- `src/tool/ToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolView.kt changes
- `src/tool/apply-patch.ts` - update based on opencode packages/core/src/tool/apply-patch.ts changes
- `src/tool/bash.ts` - update based on opencode packages/core/src/tool/bash.ts changes
- `src/tool/builtins.ts` - update based on opencode packages/core/src/tool/builtins.ts changes
- `src/tool/edit.ts` - update based on opencode packages/core/src/tool/edit.ts changes
- `src/tool/external-directory.ts` - update based on opencode packages/opencode/src/tool/external-directory.ts changes
- `src/tool/glob.test.ts` - update based on opencode packages/opencode/test/tool/glob.test.ts changes
- `src/tool/glob.ts` - update based on opencode packages/core/src/tool/glob.ts changes
- `src/tool/glob.ts` - update based on opencode packages/opencode/src/tool/glob.ts changes
- `src/tool/grep.test.ts` - update based on opencode packages/opencode/test/tool/grep.test.ts changes
- `src/tool/grep.ts` - update based on opencode packages/core/src/tool/grep.ts changes
- `src/tool/grep.ts` - update based on opencode packages/opencode/src/tool/grep.ts changes
- `src/tool/question.ts` - update based on opencode packages/core/src/tool/question.ts changes
- `src/tool/read-filesystem.ts` - update based on opencode packages/core/src/tool/read-filesystem.ts changes
- `src/tool/read.test.ts` - update based on opencode packages/opencode/test/tool/read.test.ts changes
- `src/tool/read.ts` - update based on opencode packages/core/src/tool/read.ts changes
- `src/tool/read.ts` - update based on opencode packages/opencode/src/tool/read.ts changes
- `src/tool/registry.test.ts` - update based on opencode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on opencode packages/core/src/tool/registry.ts changes
- `src/tool/registry.ts` - update based on opencode packages/opencode/src/tool/registry.ts changes
- `src/tool/skill.test.ts` - update based on opencode packages/opencode/test/tool/skill.test.ts changes
- `src/tool/skill.ts` - update based on opencode packages/core/src/tool/skill.ts changes
- `src/tool/skill.ts` - update based on opencode packages/opencode/src/tool/skill.ts changes
- `src/tool/task.test.ts` - update based on opencode packages/opencode/test/tool/task.test.ts changes
- `src/tool/todowrite.ts` - update based on opencode packages/core/src/tool/todowrite.ts changes
- `src/tool/tool.ts` - update based on opencode packages/core/src/tool/tool.ts changes
- `src/tool/truncate.ts` - update based on opencode packages/opencode/src/tool/truncate.ts changes
- `src/tool/webfetch.ts` - update based on opencode packages/core/src/tool/webfetch.ts changes
- `src/tool/websearch.ts` - update based on opencode packages/core/src/tool/websearch.ts changes
- `src/tool/write.ts` - update based on opencode packages/core/src/tool/write.ts changes
