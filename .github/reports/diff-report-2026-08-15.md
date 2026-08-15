# Upstream Changes Report
Generated: 2026-08-15 06:37:40

## Summary
- kilocode: 116 commits, 170 files changed
- opencode: 1 commits, 3 files changed

## kilocode Changes (67cda85c9..c8271ad6f)

### Commits

- c8271ad6f - Merge pull request #13129 from Kilo-Org/jetbrains/release/v7.0.16 (Kirill Kalishev, 2026-08-14)
- 2f123c0cf - docs(jetbrains): edit changelog for v7.0.16 (Kirill Kalishev, 2026-08-14)
- 10be87330 - release(jetbrains): v7.0.16 (kilo-maintainer[bot], 2026-08-14)
- 299c40234 - Merge pull request #13116 from Kilo-Org/chore/jetbrains-cli-pin-v7.4.22 (Kirill Kalishev, 2026-08-14)
- f41b66e8f - Merge pull request #13092 from Kilo-Org/speckled-globe (Kirill Kalishev, 2026-08-14)
- 66b21f745 - fix(jetbrains): lazily build session view bodies (kirillk, 2026-08-14)
- c34a2a3a4 - fix(cli): stop memory auto-save from parsing SSE as JSON (#13122) (Johnny Eric Amancio, 2026-08-14)
- e2966abcb - fix: keep Code agent after switching from Ask (#13121) (Johnny Eric Amancio, 2026-08-14)
- 619fa2e2e - fix(jetbrains): render todo hover preview with todo list (kirillk, 2026-08-14)
- 1500843a3 - feat(jetbrains): add hover preview popup to grep, glob, other tools, and todos (kirillk, 2026-08-14)
- 30289e68c - fix(jetbrains): hide empty messages so turns drop the stray gap (kirillk, 2026-08-14)
- e1ab78b1d - fix(jetbrains): remove empty user message stripe at turn top (kirillk, 2026-08-14)
- 9f1afe105 - fix(jetbrains): refine session card spacing (kirillk, 2026-08-14)
- c31cee51c - Merge pull request #13117 from Kilo-Org/integration/test-pipeline-speedup (yzialionka-anaconda, 2026-08-14)
- 855e31a6c - Merge branch 'main' into integration/test-pipeline-speedup (yzialionka-anaconda, 2026-08-14)
- 7c3a7d68f - docs(ci): drop stale Windows-only timeout rationale superseded by the all-OS 600s comment (Yury Zialionka, 2026-08-14)
- c3d41999b - chore: drop accidentally committed local TUI config (Yury Zialionka, 2026-08-14)
- 2246ef70b - fix(webview): preserve existing text when selecting slash command at start (#11728) (rakshith1928, 2026-08-14)
- e781e7271 - Merge pull request #12542 from Githubguy132010/codex/fix-agent-removal-persistence (bagatao@anaconda.com, 2026-08-14)
- de0a18778 - Merge branch 'main' into codex/fix-agent-removal-persistence (bagatao@anaconda.com, 2026-08-14)
- d3bee2d68 - Merge pull request #13103 from Kilo-Org/chore/remove-inferred-variants (Christiaan Arnoldus, 2026-08-14)
- 2a63bf180 - fix(ci): satisfy PR-only checks — typecheck narrowing and kilocode_change markers (Yury Zialionka, 2026-08-13)
- 8aff7ade1 - Merge origin/main: reconcile with independently landed #13091 and #13113 (Yury Zialionka, 2026-08-13)
- b7bf24815 - Merge branch 'perf/in-process-fast-tier' into integration/test-pipeline-speedup (Yury Zialionka, 2026-08-13)
- 4545a0360 - Merge branch 'perf/httpapi-optin-git-fixtures' into integration/test-pipeline-speedup (Yury Zialionka, 2026-08-13)
- 031ae4a7a - fix(test): second review round — measurement integrity and hang budget (Yury Zialionka, 2026-08-13)
- 8bd77b7fd - fix(test): isolate project.update; retry only state-reset scenarios; guard agentsReady (Yury Zialionka, 2026-08-13)
- f1bb992ff - fix(ci): bypass the turbo cache job-wide on manual dispatch (Yury Zialionka, 2026-08-13)
- 5aed6f5f1 - refactor(test): flatten tier entries; bound the demotion scan; fix a stale comment (Yury Zialionka, 2026-08-13)
- 59eadf2c2 - refactor(test): share the scenario header builder; simplify the retry loop (Yury Zialionka, 2026-08-13)
- 762db541d - Merge branch 'perf/in-process-fast-tier' into integration/test-pipeline-speedup (Yury Zialionka, 2026-08-13)
- 82ae218b7 - fix(test): give the session-export capture worker a CI-tolerant deadline (Yury Zialionka, 2026-08-13)
- df08c98b6 - Merge branch 'perf/in-process-fast-tier' into integration/test-pipeline-speedup (Yury Zialionka, 2026-08-13)
- 281cba1af - fix(ci): manual dispatch runs bypass the turbo cache (Yury Zialionka, 2026-08-13)
- c76bca1da - Merge branch 'perf/in-process-fast-tier' into integration/test-pipeline-speedup (Yury Zialionka, 2026-08-13)
- 348f90cb9 - fix(ci): apply the 600s per-file kill deadline on every OS (Yury Zialionka, 2026-08-13)
- bad627a0a - Merge branch 'perf/in-process-fast-tier' into integration/test-pipeline-speedup (Yury Zialionka, 2026-08-13)
- 2ef0705a5 - Merge branch 'perf/httpapi-optin-git-fixtures' into integration/test-pipeline-speedup (Yury Zialionka, 2026-08-13)
- b18f2e2f4 - revert(ci): keep Windows off the bun dependency cache (Yury Zialionka, 2026-08-13)
- 81eeec6a7 - fix(test): gate permission.create on agent-projection readiness (Yury Zialionka, 2026-08-13)
- 96f3c9b36 - Merge branch 'perf/in-process-fast-tier' into integration/test-pipeline-speedup (Yury Zialionka, 2026-08-13)
- c57001aa2 - revert(ci): back to six Windows shards (Yury Zialionka, 2026-08-13)
- b0ba8412d - Merge branch 'perf/in-process-fast-tier' into integration/test-pipeline-speedup (Yury Zialionka, 2026-08-13)
- 7a14036a8 - perf(ci): five Windows shards; re-enable the Windows bun dependency cache (Yury Zialionka, 2026-08-13)
- 32a883c69 - Merge branch 'perf/in-process-fast-tier' into integration/test-pipeline-speedup (Yury Zialionka, 2026-08-13)
- 6fea3d49d - Merge branch 'perf/httpapi-optin-git-fixtures' into integration/test-pipeline-speedup (Yury Zialionka, 2026-08-13)
- ef7ce90db - test(httpapi): exercise vcs.get against a git repo again (Yury Zialionka, 2026-08-13)
- fb65ca161 - fix(test): merge --update-durations over existing measurements (Yury Zialionka, 2026-08-13)
- 2d0d15f88 - Merge branch 'perf/in-process-fast-tier' into integration/test-pipeline-speedup (Yury Zialionka, 2026-08-13)
- 2b81730c5 - Merge branch 'perf/httpapi-optin-git-fixtures' into integration/test-pipeline-speedup (Yury Zialionka, 2026-08-13)
- a4539b880 - perf(test): compute batch weights from member durations; review fixes (Yury Zialionka, 2026-08-13)
- ae3a5de98 - fix(test): harden httpapi sharding against env pinning and cold-start races (Yury Zialionka, 2026-08-13)
- 366242526 - Merge branch 'perf/in-process-fast-tier' into integration/test-pipeline-speedup (Yury Zialionka, 2026-08-13)
- aea90225f - refactor(test): make batch composition self-maintaining (Yury Zialionka, 2026-08-13)
- bb2c2df46 - perf(ci): exclude runner work dirs from Defender scanning on Windows (Yury Zialionka, 2026-08-13)
- 673a6cccf - Merge branch 'perf/in-process-fast-tier' into integration/test-pipeline-speedup (Yury Zialionka, 2026-08-13)
- a7bdcfc2f - perf(test): start heavy batches first; make artifact upload non-fatal (Yury Zialionka, 2026-08-13)
- 8b1c4b07f - Merge branch 'perf/in-process-fast-tier' into integration/test-pipeline-speedup (Yury Zialionka, 2026-08-13)
- 9b9cbe896 - fix(test): honor the batch-safety guard for subdirectory tiers (Yury Zialionka, 2026-08-13)
- 2092724ff - Merge branch 'perf/in-process-fast-tier' into integration/test-pipeline-speedup (Yury Zialionka, 2026-08-13)
- eed3a153e - perf(test): batch cli, tool, and misc dirs; weight shards by measured durations (Yury Zialionka, 2026-08-13)
- 407939c9f - Merge branch 'perf/in-process-fast-tier' into integration/test-pipeline-speedup (Yury Zialionka, 2026-08-13)
- c7996e0b7 - Merge branch 'test/isolation-enablers' into integration/test-pipeline-speedup (Yury Zialionka, 2026-08-13)
- 2168857dc - perf(test): run the effect httpapi exerciser with four shards (Yury Zialionka, 2026-08-13)
- 13a6b9d45 - perf(test): split root fast tier into eight smaller batches (Yury Zialionka, 2026-08-13)
- da1fb306e - fix(test): keep the stall-simulation test out of the fast tier (Yury Zialionka, 2026-08-13)
- 9a6ff2392 - fix(test): give PTY exit propagation a CI-tolerant deadline (Yury Zialionka, 2026-08-13)
- da089f0c7 - perf(test): batch top-level kilocode tests into four hash-split fast tiers (Yury Zialionka, 2026-08-13)
- a5922ef92 - chore(jetbrains): bump CLI pin to v7.4.22 (kilo-maintainer[bot], 2026-08-13)
- f81fc2962 - fix(test): drop kilocode/permission from the fast tier (Yury Zialionka, 2026-08-13)
- 140a75393 - perf(test): expand the fast tier to four parallel batches (161 files) (Yury Zialionka, 2026-08-13)
- a4c608017 - perf(test): run isolation-safe test files in one shared process (Yury Zialionka, 2026-08-13)
- feafae38f - test: keep the database file name out of the preload comment (Yury Zialionka, 2026-08-13)
- 5d123dde4 - test(httpapi): back off one second before the scenario retry (Yury Zialionka, 2026-08-13)
- 2aa10017c - refactor(tool): resolve websearch config via Env.Service instead of process.env (Yury Zialionka, 2026-08-13)
- 2cb8ff4e4 - test(storage): make the storage root injectable and fail closed on disk databases (Yury Zialionka, 2026-08-13)
- 9e40b8057 - test(httpapi): retry failed scenarios once and surface responses on failure (Yury Zialionka, 2026-08-13)
- 7e6dc937a - fix(jetbrains): drop modified file header separator (kirillk, 2026-08-13)
- a6097d5e1 - fix(jetbrains): round session body surfaces (kirillk, 2026-08-13)
- c01476353 - perf(test): run HttpApi effect pass in two parallel shard processes (Yury Zialionka, 2026-08-13)
- 150641b5a - perf(test): make git fixtures opt-in for HttpApi exerciser scenarios (Yury Zialionka, 2026-08-13)
- fa842c8b7 - fix(jetbrains): simplify session card chrome (kirillk, 2026-08-13)
- c6c5d5329 - test(cli): cover custom family fallbacks (chrarnoldus, 2026-08-13)
- 990c72823 - Merge branch 'main' into codex/fix-agent-removal-persistence (Thomas Brugman, 2026-08-13)
- 7b48fc497 - refactor(cli): reduce inferred variant diff (chrarnoldus, 2026-08-13)
- 704f67b7c - fix: address agent removal review feedback (Thomas Brugman, 2026-08-13)
- 14c83e744 - Merge branch 'main' into codex/fix-agent-removal-persistence (bagatao@anaconda.com, 2026-08-13)
- 81e30df95 - fix(cli): preserve direct OpenAI summaries (chrarnoldus, 2026-08-13)
- 5b2def610 - fix(cli): retain custom provider fallback (chrarnoldus, 2026-08-13)
- 1f3b34871 - test(cli): remove inferred summary expectation (chrarnoldus, 2026-08-13)
- 7581cfe1a - fix(cli): retain valid Mistral reasoning link (chrarnoldus, 2026-08-13)
- c7f66e09a - docs: refresh source links (chrarnoldus, 2026-08-13)
- 591772d92 - refactor(cli): rely on catalog model variants (chrarnoldus, 2026-08-13)
- 8c4832288 - fix(jetbrains): round markdown code block corners (kirillk, 2026-08-12)
- cc786dddc - fix(jetbrains): round collapsed card hover with block arc (kirillk, 2026-08-12)
- e8a40e150 - fix(jetbrains): remove session code borders (kirillk, 2026-08-12)
- 9adcff3ee - fix(jetbrains): avoid auth on CLI asset fetches (kirillk, 2026-08-12)
- 5f03eff5f - fix(jetbrains): harden CLI release fetches (kirillk, 2026-08-12)
- ef59f0d36 - fix(jetbrains): retry rate limited CLI downloads (kirillk, 2026-08-12)
- 048e5f497 - fix(jetbrains): retry transient HTTP downloads (kirillk, 2026-08-12)
- dc38d3750 - fix(jetbrains): retry CLI release downloads (kirillk, 2026-08-12)
- 4ac47f849 - fix(jetbrains): restore session header cursor (kirillk, 2026-08-12)
- 340172af1 - fix(jetbrains): consolidate session secondary text (kirillk, 2026-08-12)
- ff8e47030 - fix(jetbrains): outline prompt bubbles (kirillk, 2026-08-12)
- bf0c6c7a9 - fix(jetbrains): bound session status overlays (kirillk, 2026-08-12)
- 706a3c3ce - fix(jetbrains): separate session backdrop from editor (kirillk, 2026-08-12)
- 0209c649f - fix(jetbrains): unify session content surfaces (kirillk, 2026-08-12)
- eabd8ce2e - docs(jetbrains): document session background strategy (kirillk, 2026-08-11)
- 3e617c12a - fix(jetbrains): avoid Islands action button frame (kirillk, 2026-08-11)
- 5496466bf - fix(jetbrains): stabilize session backdrop painting (kirillk, 2026-08-11)
- 06fc620ba - feat(jetbrains): refresh session UI colors and fix sticky header hover (kirillk, 2026-08-11)
- c7d67d8f2 - Merge upstream/main into codex/fix-agent-removal-persistence (Devin AI, 2026-08-08)
- 0409442ac - Merge remote-tracking branch 'upstream/main' into codex/fix-agent-removal-persistence (Thomas Brugman, 2026-07-30)
- 2414a2bf8 - Merge branch 'main' into codex/fix-agent-removal-persistence (Thomas Brugman, 2026-07-27)
- bfeb3ae01 - fix(cli): avoid eager agent reload after removal (Thomas Brugman, 2026-07-26)
- 5d713f7d9 - fix(vscode): persist installed agent removal (Thomas Brugman, 2026-07-26)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt` (+15, -8)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/DiffOverflow.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt` (+17, -20)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/PatchBody.kt` (+6, -9)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ReadToolView.kt` (+7, -10)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt` (+190, -103)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/TaskToolView.kt` (+9, -10)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolMarkdownBody.kt` (+5, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt` (+33, -24)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolView.kt` (+13, -5)
- `packages/opencode/src/tool/mcp-websearch.ts` (+7, -3)
- `packages/opencode/src/tool/registry.ts` (+2, -0)
- `packages/opencode/src/tool/websearch.ts` (+34, -13)
- `packages/opencode/test/tool/websearch.test.ts` (+5, -12)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/kilocode/agent/index.ts` (+42, -19)

#### Permission System (**/permission/)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt` (+12, -11)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/test/preload.ts` (+10, -0)

#### Other Changes
- `.changeset/ask-to-code-agent-switch.md` (+6, -0)
- `.changeset/borderless-jetbrains-session.md` (+5, -0)
- `.changeset/clean-agent-removal.md` (+5, -0)
- `.changeset/islands-button-borders.md` (+5, -0)
- `.changeset/jetbrains-expandable-hover-popups.md` (+5, -0)
- `.changeset/jetbrains-session-colors.md` (+5, -0)
- `.changeset/jetbrains-session-secondary-text.md` (+5, -0)
- `.changeset/memory-show-preserve-text.md` (+5, -0)
- `.changeset/memory-sse-json.md` (+5, -0)
- `.changeset/prompt-bubble-outline.md` (+5, -0)
- `.changeset/refine-jetbrains-session-spacing.md` (+5, -0)
- `.changeset/session-background-contrast.md` (+5, -0)
- `.changeset/session-card-content-surfaces.md` (+5, -0)
- `.changeset/session-status-copy-overlay.md` (+5, -0)
- `.changeset/slash-command-preserve-text.md` (+5, -0)
- `.changeset/smooth-session-backdrop.md` (+5, -0)
- `.changeset/trim-inferred-variants.md` (+5, -0)
- `.github/actions/setup-bun/action.yml` (+2, -2)
- `.github/workflows/test.yml` (+38, -8)
- `packages/kilo-jetbrains/AGENTS.md` (+23, -0)
- `packages/kilo-jetbrains/CHANGELOG.md` (+12, -0)
- `packages/kilo-jetbrains/build-tasks/src/main/kotlin/GenerateOpenApiSpecTask.kt` (+27, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+9, -30)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/history/HistoryListRenderer.kt` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/scroll/SessionScroll.kt` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/ConnectionPanel.kt` (+4, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/LoadingPanel.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/ModifiedFilesView.kt` (+8, -14)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/ProgressPanel.kt` (+7, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/RevertBanner.kt` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/RevertProgress.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionCodeScroll.kt` (+25, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionContentPanel.kt` (+43, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionLayout.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanel.kt` (+5, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionRootPanel.kt` (+19, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionSurface.kt` (+45, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionSurfacePanel.kt` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/attachment/AttachmentCard.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/empty/EmptySessionPanel.kt` (+1, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/empty/RecentsList.kt` (+3, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/BranchChangesBadge.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/ContextBar.kt` (+5, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/SessionHeaderPanel.kt` (+11, -10)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/mode/ModePickerRenderer.kt` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/model/ModelDetailsPanel.kt` (+7, -6)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/model/ModelPickerRenderer.kt` (+5, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/selection/SessionCopyTarget.kt` (+11, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/selection/SessionHoverCopyOverlay.kt` (+23, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/style/SessionEditorStyle.kt` (+2, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/style/SessionUiStyle.kt` (+89, -21)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/CompactionView.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/MessageView.kt` (+32, -14)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/PlanExitView.kt` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/ReasoningView.kt` (+17, -53)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/TextView.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/base/AbstractSessionPartView.kt` (+201, -28)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/base/BaseQuestionView.kt` (+11, -17)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/base/GenericView.kt` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/base/PrimarySessionPartView.kt` (+0, -49)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/base/SecondarySessionPartView.kt` (+0, -54)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/question/QuestionResultView.kt` (+109, -187)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/question/QuestionView.kt` (+8, -8)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/todo/TodoListPanel.kt` (+16, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/todo/TodoWriteView.kt` (+36, -20)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/UiStyle.kt` (+1, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/MdCommon.kt` (+3, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/MdViewFactory.kt` (+9, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/hybrid/MdViewHybrid.kt` (+39, -9)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionUiLayoutTest.kt` (+11, -6)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/ModifiedFilesViewTest.kt` (+56, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/ProgressPanelTest.kt` (+6, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionContentPanelTest.kt` (+74, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionEditorStyleTest.kt` (+4, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanelTest.kt` (+32, -31)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionRootPanelTest.kt` (+5, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionSelectionCopyTest.kt` (+65, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/header/SessionHeaderPanelTest.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/style/SessionUiStyleTest.kt` (+72, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/EditToolViewTest.kt` (+29, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/GlobToolViewTest.kt` (+35, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/LoginRequiredViewTest.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/MessageViewTest.kt` (+16, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/PlanExitViewTest.kt` (+11, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/PopupTestSupport.kt` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/QuestionResultViewTest.kt` (+7, -36)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/QuestionViewTest.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ReadToolViewTest.kt` (+3, -6)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ReasoningViewTest.kt` (+5, -20)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/SearchToolViewTest.kt` (+37, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ShellToolViewTest.kt` (+89, -76)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/TaskToolViewTest.kt` (+1, -8)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ToolViewTest.kt` (+46, -30)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/TurnViewTest.kt` (+16, -8)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/base/AbstractSessionPartViewTest.kt` (+137, -35)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/base/BaseQuestionViewTest.kt` (+8, -5)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/todo/TodoWriteViewTest.kt` (+86, -4)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/md/MdViewHybridTest.kt` (+48, -10)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/md/MdViewTest.kt` (+18, -3)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-memory/src/commands.ts` (+6, -4)
- `packages/kilo-memory/test/command-cases.json` (+27, -0)
- `packages/kilo-memory/test/commands.test.ts` (+3, -2)
- `packages/kilo-vscode/src/KiloProvider.ts` (+10, -8)
- `packages/kilo-vscode/src/services/agent-removal.ts` (+34, -0)
- `packages/kilo-vscode/src/services/marketplace/actions.ts` (+7, -0)
- `packages/kilo-vscode/tests/unit/agent-behaviour-patches.test.ts` (+10, -0)
- `packages/kilo-vscode/tests/unit/marketplace-actions.test.ts` (+66, -0)
- `packages/kilo-vscode/tests/unit/memory-command.test.ts` (+3, -2)
- `packages/kilo-vscode/tests/unit/prompt-input-utils.test.ts` (+32, -0)
- `packages/kilo-vscode/tests/unit/prompt-send-contract.test.ts` (+13, -0)
- `packages/kilo-vscode/tests/unit/session-agent.test.ts` (+22, -0)
- `packages/kilo-vscode/tests/unit/use-slash-command.test.ts` (+233, -5)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+13, -2)
- `packages/kilo-vscode/webview-ui/src/components/chat/prompt-input-utils.ts` (+14, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/AgentBehaviourTab.tsx` (+3, -2)
- `packages/kilo-vscode/webview-ui/src/components/settings/ModeEditView.tsx` (+12, -9)
- `packages/kilo-vscode/webview-ui/src/components/settings/agent-behaviour-patches.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/context/session-agent.ts` (+9, -0)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+9, -6)
- `packages/kilo-vscode/webview-ui/src/hooks/useSlashCommand.ts` (+19, -7)
- `packages/kilo-vscode/webview-ui/src/types/messages/agents.ts` (+1, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/script/httpapi-exercise.ts` (+50, -0)
- `packages/opencode/script/kilocode/test-durations.json` (+321, -0)
- `packages/opencode/script/test-runner.ts` (+276, -9)
- `packages/opencode/src/kilocode/memory/ports.ts` (+1, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/kilocode.ts` (+3, -1)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilocode.ts` (+12, -2)
- `packages/opencode/src/kilocode/session/ask-code-switch.txt` (+6, -0)
- `packages/opencode/src/kilocode/session/prompt.ts` (+20, -1)
- `packages/opencode/src/provider/transform.ts` (+8, -76)
- `packages/opencode/src/session/reminders.ts` (+13, -3)
- `packages/opencode/src/storage/storage.ts` (+110, -97)
- `packages/opencode/test/kilocode/agent-remove.test.ts` (+93, -4)
- `packages/opencode/test/kilocode/ask-switch-reminder.test.ts` (+247, -0)
- `packages/opencode/test/kilocode/memory/memory-ports.test.ts` (+106, -8)
- `packages/opencode/test/kilocode/provider-reasoning-options.test.ts` (+13, -0)
- `packages/opencode/test/kilocode/provider/grok-reasoning-variants.test.ts` (+0, -34)
- `packages/opencode/test/kilocode/server/httpapi-exercise-scenarios.ts` (+35, -1)
- `packages/opencode/test/kilocode/session-export/e2e.test.ts` (+7, -2)
- `packages/opencode/test/kilocode/transform-opus-4.7.test.ts` (+0, -305)
- `packages/opencode/test/preload.ts` (+19, -0)
- `packages/opencode/test/provider/transform.test.ts` (+9, -369)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+33, -2)
- `packages/opencode/test/server/httpapi-exercise/runner.ts` (+19, -5)
- `packages/opencode/test/server/httpapi-pty.test.ts` (+4, -1)
- `packages/opencode/test/storage/storage.test.ts` (+15, -38)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+3, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+1, -0)
- `packages/sdk/openapi.json` (+5, -1)
- `script/architecture-allowlist.json` (+1, -4)

### Key Diffs

#### packages/core/test/preload.ts
```diff
diff --git a/packages/core/test/preload.ts b/packages/core/test/preload.ts
index d44cffd84..8bca015c2 100644
--- a/packages/core/test/preload.ts
+++ b/packages/core/test/preload.ts
@@ -3,3 +3,13 @@ import path from "path"
 process.env.KILO_DB = ":memory:"
 process.env.KILO_MODELS_PATH = path.join(import.meta.dir, "plugin", "fixtures", "models-dev.json")
 process.env.KILO_DISABLE_MODELS_FETCH = "true"
+
+// kilocode_change start - fail closed: core unit tests do not redirect XDG dirs, so KILO_DB
+// is the only thing keeping them off the real ~/.local/share/kilo database. Verify the
+// resolved path (env is read at flag import time, so this must stay after the env writes).
+const { Database } = await import("../src/database/database")
+const resolved = Database.path()
+if (resolved !== ":memory:") {
+  throw new Error(`unit test preload: database path must resolve to ":memory:", got "${resolved}"`)
+}
+// kilocode_change end
```

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
index 91f299579..1f6e59a51 100644
--- a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
@@ -12,6 +12,7 @@ import ai.kilocode.client.session.views.base.BaseQuestionView
 import ai.kilocode.client.session.ui.selection.SessionSelection
 import ai.kilocode.client.session.ui.style.SessionEditorStyle
 import ai.kilocode.client.session.ui.style.SessionEditorStyleTarget
+import ai.kilocode.client.session.ui.style.SessionUiStyle
 import ai.kilocode.client.session.views.SessionViewIcons
 import ai.kilocode.client.ui.UiStyle
 import ai.kilocode.client.ui.iconButton
@@ -171,8 +172,8 @@ class PermissionView(
     override fun applyStyle(style: SessionEditorStyle) {
         this.style = style
         card.applyStyle(style)
-        desc.font = style.hintFont
-        desc.foreground = UiStyle.Colors.weak()
+        desc.font = SessionUiStyle.Text.Secondary.font(style)
+        desc.foreground = SessionUiStyle.Text.Secondary.foreground()
         rules.applyStyle(style)
         md?.let { applyCodeStyle(it) }
         for (dv in diffViews) {
@@ -276,7 +277,7 @@ class PermissionView(
         view.applyStyle(style)
         view.font = style.transcriptFont
         view.foreground = style.editorForeground
-        view.background = style.editorBackground
+        view.background = SessionUiStyle.Colors.codeBlockBackground()
         view.preBg = MdCommon.defaults(style).preBg
         view.codeFont = style.editorFamily
         view.component.border = JBUI.Borders.empty()
@@ -353,8 +354,8 @@ class PermissionView(
             caret.isSelectionVisible = false
             lineWrap = true
             wrapStyleWord = true
-            foreground = UiStyle.Colors.weak()
-            font = style.hintFont
+            foreground = SessionUiStyle.Text.Secondary.foreground()
+            font = SessionUiStyle.Text.Secondary.font(style)
             border = JBUI.Borders.empty()
             isVisible = false
         }
@@ -705,8 +706,8 @@ internal class PermissionRulesView(
 
         @RequiresEdt
         fun applyStyle(style: SessionEditorStyle) {
-            hint.font = style.hintFont
-            hint.foreground = UiStyle.Colors.weak()
+            hint.font = SessionUiStyle.Text.Secondary.font(style)
```

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt
index e4dcb2d91..7a1d858c5 100644
--- a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt
@@ -3,10 +3,11 @@ package ai.kilocode.client.session.views.tool
 import ai.kilocode.client.session.model.Content
 import ai.kilocode.client.session.model.Tool
 import ai.kilocode.client.session.model.ToolExecState
+import ai.kilocode.client.session.ui.popup.HeaderPopupRequest
 import ai.kilocode.client.session.ui.selection.SessionSelection
 import ai.kilocode.client.session.ui.style.SessionEditorStyle
 import ai.kilocode.client.session.ui.style.SessionUiStyle
-import ai.kilocode.client.session.views.base.SecondarySessionPartView
+import ai.kilocode.client.session.views.base.AbstractSessionPartView
 import ai.kilocode.client.ui.UiStyle
 import com.intellij.openapi.util.Disposer
 import com.intellij.util.concurrency.annotations.RequiresEdt
@@ -19,7 +20,7 @@ abstract class BaseSearchToolView(
     private val selection: SessionSelection? = null,
     private val parts: ToolParts,
     private val repo: String? = null,
-) : SecondarySessionPartView(parts.header, { parts.scroll(tool) }) {
+) : AbstractSessionPartView(parts.header, { parts.scroll(tool) }) {
 
     override val contentId: String = tool.id
 
@@ -34,8 +35,6 @@ abstract class BaseSearchToolView(
     protected abstract fun viewName(): String
 
     init {
-        bindHeader(parts.glyph, parts.title, parts.sub, parts.state, parts.left, parts.right, parts.slot)
-        parts.targets.forEach { bindHeader(it) }
         applyStyle(style)
         sync()
     }
@@ -53,7 +52,7 @@ abstract class BaseSearchToolView(
     override fun getPreferredSize(): Dimension {
         val size = super.getPreferredSize()
         if (!bodyVisible()) return size
-        val height = row.preferredSize.height + bodyMaxHeight()
+        val height = row.preferredSize.height + expandedGap() + bodyMaxHeight()
         return Dimension(size.width, minOf(size.height, height))
     }
 
@@ -66,6 +65,14 @@ abstract class BaseSearchToolView(
         if (changed) refresh()
     }
 
+    @RequiresEdt
+    override fun headerPopup(): HeaderPopupRequest? {
```

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/DiffOverflow.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/DiffOverflow.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/DiffOverflow.kt
index 273b36d59..d3f748a70 100644
--- a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/DiffOverflow.kt
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/DiffOverflow.kt
@@ -3,6 +3,7 @@ package ai.kilocode.client.session.views.tool
 import ai.kilocode.client.plugin.KiloBundle
 import ai.kilocode.client.session.model.Tool
 import ai.kilocode.client.session.ui.style.SessionEditorStyle
+import ai.kilocode.client.session.ui.style.SessionUiStyle
 import ai.kilocode.client.ui.UiStyle
 import ai.kilocode.client.ui.layout.Stack
 import com.intellij.openapi.Disposable
@@ -23,7 +24,7 @@ import javax.swing.JComponent
 @RequiresEdt
 internal fun diffOverflowPanel(open: () -> Unit): JComponent {
     val message = JBLabel(KiloBundle.message("diff.overflow.message")).apply {
-        foreground = UiStyle.Colors.weak()
+        foreground = SessionUiStyle.Text.Secondary.foreground()
     }
     val link = HyperlinkLabel(KiloBundle.message("diff.overflow.open")).apply {
         addHyperlinkListener { open() }
```

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt
index 831bfb6ea..6ef6e3186 100644
--- a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt
@@ -16,8 +16,7 @@ import ai.kilocode.client.session.ui.style.SessionEditorStyle
 import ai.kilocode.client.session.ui.style.SessionUiStyle
 import ai.kilocode.client.session.views.SessionViewIcons
 import ai.kilocode.client.session.views.base.PartHeader
-import ai.kilocode.client.session.views.base.SecondarySessionPartView
-import ai.kilocode.client.telemetry.Telemetry
+import ai.kilocode.client.session.views.base.AbstractSessionPartView
 import ai.kilocode.client.ui.DiffStatBadge
 import ai.kilocode.client.ui.ToolbarButtonAction
 import ai.kilocode.client.ui.UiStyle
@@ -47,7 +46,7 @@ class EditToolView(
     private val selection: SessionSelection? = null,
     private val parts: ToolParts = toolParts(tool, openFile),
     private var body: EditBody = editBody(tool, selection, openFile),
-) : SecondarySessionPartView(parts.header, { body.mount(tool) }), UiDataProvider, SessionCopyTarget {
+) : AbstractSessionPartView(parts.header, { body.mount(tool) }), UiDataProvider, SessionCopyTarget {
 
     override val contentId: String = tool.id
 
@@ -63,7 +62,7 @@ class EditToolView(
     )
     private val diffAnchor = hoverPlaceholder(diff)
     private val filesTag = JBLabel().apply {
-        foreground = UiStyle.Colors.weak()
+        foreground = SessionUiStyle.Text.Secondary.foreground()
         font = JBFont.small()
         isVisible = false
     }
@@ -75,11 +74,10 @@ class EditToolView(
         parts.left.next(parts.link)
         parts.left.next(filesTag)
         parts.left.next(PartHeader.centered(badge))
-        parts.left.next(PartHeader.centered(diffAnchor))
-        // parts.link is intentionally omitted: FileLinkLabel installs its own click handler that opens
-        // the file, and binding it here would also toggle the card on the same click (see ReadToolView,
-        // which likewise omits it). Header toggling still works via parts.left/row.
-        bindHeader(parts.glyph, parts.title, parts.sub, parts.state, parts.left, parts.right, parts.slot, filesTag, badge, diffAnchor)
+        parts.left.next(diffAnchor)
+        // The base binds click-to-toggle across the whole header subtree, skipping controls that own
+        // a mouse listener. parts.link (FileLinkLabel) installs its own click handler that opens the
+        // file, so it is skipped automatically and does not also toggle the card.
         applyStyle(style)
         sync()
     }
@@ -128,7 +126,7 @@ class EditToolView(
     override fun getPreferredSize(): Dimension {
```


*... and more files (showing first 5)*

## opencode Changes (e23586a..4643e65)

### Commits

- 4643e65 - fix(opencode): enable web search for Go (#42630) (opencode-agent[bot], 2026-08-14)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/registry.ts` (+6, -1)
- `packages/opencode/test/tool/websearch.test.ts` (+2, -1)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
(no changes)

#### Other Changes
- `packages/web/src/content/docs/tools.mdx` (+1, -1)

### Key Diffs

#### packages/opencode/src/tool/registry.ts
```diff
diff --git a/packages/opencode/src/tool/registry.ts b/packages/opencode/src/tool/registry.ts
index 15acc75..9167cb3 100644
--- a/packages/opencode/src/tool/registry.ts
+++ b/packages/opencode/src/tool/registry.ts
@@ -56,7 +56,12 @@ import { PermissionV1 } from "@opencode-ai/core/v1/permission"
 import { McpCatalog } from "@/mcp/catalog"
 
 export function webSearchEnabled(providerID: ProviderV2.ID, flags = { exa: false, parallel: false }) {
-  return providerID === ProviderV2.ID.opencode || flags.exa || flags.parallel
+  return (
+    providerID === ProviderV2.ID.opencode ||
+    providerID === ProviderV2.ID.make("opencode-go") ||
+    flags.exa ||
+    flags.parallel
+  )
 }
 
 type TaskDef = Tool.InferDef<typeof TaskTool>
```

#### packages/opencode/test/tool/websearch.test.ts
```diff
diff --git a/packages/opencode/test/tool/websearch.test.ts b/packages/opencode/test/tool/websearch.test.ts
index 349606d..fd5849b 100644
--- a/packages/opencode/test/tool/websearch.test.ts
+++ b/packages/opencode/test/tool/websearch.test.ts
@@ -37,8 +37,9 @@ describe("websearch provider", () => {
     expect(selectWebSearchProvider(SESSION_ID, { exa: false, parallel: true })).toBe("parallel")
   })
 
-  test("is only enabled for opencode or explicit websearch provider flags", () => {
+  test("is enabled for OpenCode providers or explicit websearch provider flags", () => {
     expect(webSearchEnabled(ProviderV2.ID.opencode, { exa: false, parallel: false })).toBe(true)
+    expect(webSearchEnabled(ProviderV2.ID.make("opencode-go"), { exa: false, parallel: false })).toBe(true)
     expect(webSearchEnabled(ProviderV2.ID.openai, { exa: false, parallel: false })).toBe(false)
     expect(webSearchEnabled(ProviderV2.ID.openai, { exa: true, parallel: false })).toBe(true)
     expect(webSearchEnabled(ProviderV2.ID.openai, { exa: false, parallel: true })).toBe(true)
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/kilocode/agent/index.ts
- `src/core/` - review core changes from packages/core/test/preload.ts
- `src/permission/` - review permission changes from packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
- `src/tool/BaseSearchToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt changes
- `src/tool/DiffOverflow.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/DiffOverflow.kt changes
- `src/tool/EditToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt changes
- `src/tool/PatchBody.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/PatchBody.kt changes
- `src/tool/ReadToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ReadToolView.kt changes
- `src/tool/ShellToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt changes
- `src/tool/TaskToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/TaskToolView.kt changes
- `src/tool/ToolMarkdownBody.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolMarkdownBody.kt changes
- `src/tool/ToolSupport.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt changes
- `src/tool/ToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolView.kt changes
- `src/tool/mcp-websearch.ts` - update based on kilocode packages/opencode/src/tool/mcp-websearch.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
- `src/tool/registry.ts` - update based on opencode packages/opencode/src/tool/registry.ts changes
- `src/tool/websearch.test.ts` - update based on kilocode packages/opencode/test/tool/websearch.test.ts changes
- `src/tool/websearch.test.ts` - update based on opencode packages/opencode/test/tool/websearch.test.ts changes
- `src/tool/websearch.ts` - update based on kilocode packages/opencode/src/tool/websearch.ts changes
