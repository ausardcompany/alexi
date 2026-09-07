# Upstream Changes Report
Generated: 2026-09-07 11:46:04

## Summary
- kilocode: 53 commits, 158 files changed
- opencode: 11 commits, 8 files changed

## kilocode Changes (1e4693558..1a5ee1882)

### Commits

- 1a5ee1882 - Merge pull request #13864 from Kilo-Org/chore/allow-nullish-equality (Marius, 2026-09-07)
- 0aecbe23c - Merge pull request #13865 from Kilo-Org/fix-indexing-trimend (Marius, 2026-09-07)
- 7f0948c66 - fix(vscode): trim Git command output (marius-kilocode, 2026-09-07)
- 18e8b147e - Merge pull request #13863 from Kilo-Org/fix-windows-indexing (Marius, 2026-09-07)
- 204c8058b - chore(vscode): allow intentional nullish comparisons (marius-kilocode, 2026-09-07)
- 89513d7b3 - Merge pull request #13862 from Kilo-Org/fix-diff-viewer-issue (Marius, 2026-09-07)
- f40f91141 - Merge pull request #13861 from Kilo-Org/agent-existing-worktree (Marius, 2026-09-07)
- 77fae17b7 - Merge pull request #13854 from Kilo-Org/investigate-windows-startup-performance (Marius, 2026-09-07)
- c373eb3d7 - fix(vscode): harden Git worktree path resolution (marius-kilocode, 2026-09-07)
- 9f85c149a - test(cli): include launcher helper in fixtures (marius-kilocode, 2026-09-07)
- 35ba4aa70 - fix(vscode): soften diff deletion indicators (marius-kilocode, 2026-09-07)
- e207b4235 - feat(agent-manager): target existing managed worktrees (marius-kilocode, 2026-09-07)
- 9d030d990 - refactor(cli): isolate Windows CPU cache (marius-kilocode, 2026-09-07)
- 3cde93b39 - Merge pull request #13853 from Kilo-Org/fix-inline-pr-comment-dates (Marius, 2026-09-07)
- 489338a0d - test(cli): allow measured macOS runner noise (marius-kilocode, 2026-09-07)
- 652605ae3 - Merge pull request #13856 from Kilo-Org/refactor-agent-manager-app (Marius, 2026-09-07)
- 7303f12d2 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-07)
- 49a301999 - test(cli): preserve startup timings in unit artifacts (marius-kilocode, 2026-09-07)
- ef5d8d96f - Merge origin/main into fix-inline-pr-comment-dates (marius-kilocode, 2026-09-07)
- 4af512d11 - test(cli): retain a startup speed check on each platform (marius-kilocode, 2026-09-07)
- 4c92bb4ff - refactor(vscode): extract agent manager tab dragging (marius-kilocode, 2026-09-07)
- 91f5d0865 - Merge pull request #13855 from Kilo-Org/validate-existing-fix (Marius, 2026-09-07)
- 84df1cbd0 - test(vscode): cover missing PR comment dates (marius-kilocode, 2026-09-07)
- 6f4d1beb3 - refactor(vscode): share PR comment timestamps (marius-kilocode, 2026-09-07)
- d75ae546b - fix(tui): restore Home and End prompt navigation (marius-kilocode, 2026-09-07)
- c02e0c956 - Merge pull request #13541 from Kilo-Org/integrate-pr-comments-into-diff-ui (Marius, 2026-09-07)
- 8ae61973b - fix(cli): cache Windows CPU checks and benchmark startup (marius-kilocode, 2026-09-07)
- 1be0f7e11 - fix(vscode): show dates on inline PR comments (marius-kilocode, 2026-09-07)
- 962e88e72 - Merge pull request #13848 from Kilo-Org/fix-cli-message-display (Marius, 2026-09-07)
- 7edad3934 - Merge pull request #13847 from Kilo-Org/improve-subagent-rendering-performance (Marius, 2026-09-07)
- 261edcde5 - fix(cli): show shared agent board messages (marius-kilocode, 2026-09-07)
- 0d85e9a0a - Merge pull request #13794 from Kilo-Org/fix-issue-13724 (Marius, 2026-09-07)
- c4575328f - fix(vscode): distinguish unmapped threads from unavailable previews (marius-kilocode, 2026-09-07)
- 9903abbe4 - fix(vscode): improve subagent transcript performance (marius-kilocode, 2026-09-07)
- 78d8d2a3e - Merge pull request #13834 from Kilo-Org/jetbrains/release/v7.1.6-rc.2 (Kirill Kalishev, 2026-09-06)
- 5bf602ad4 - docs(jetbrains): edit changelog for v7.1.6-rc.2 (Kirill Kalishev, 2026-09-06)
- d9dec8b09 - release(jetbrains): v7.1.6-rc.2 (kilo-maintainer[bot], 2026-09-06)
- 7de8f5b87 - Merge pull request #13562 from Kilo-Org/chore/jetbrains-cli-pin-v7.5.6 (Kirill Kalishev, 2026-09-06)
- fa39ed433 - Merge branch 'fix/jetbrains-internal-badge-icon' of github.com:Kilo-Org/kilocode into chore/jetbrains-cli-pin-v7.5.6 (kirillk, 2026-09-06)
- 033cd0bad - Merge remote-tracking branch 'origin/main' into chore/jetbrains-cli-pin-v7.5.6 (kirillk, 2026-09-06)
- c4815a0dd - fix(jetbrains): replace internal badge-icon APIs in worktree row icons (kirillk, 2026-09-06)
- a729c8f8f - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-04)
- 7474eccac - fix(vscode): resolve PR review and CI regressions (marius-kilocode, 2026-09-04)
- 2dc5951b4 - fix(vscode): keep prompt undo and redo inside the webview (marius-kilocode, 2026-09-04)
- 687e41a37 - chore: merge latest main CI fix (marius-kilocode, 2026-09-04)
- 55808e5c1 - fix(agent-manager): resolve main conflicts and preserve inline reviews (marius-kilocode, 2026-09-04)
- ee7c0d8b4 - chore: merge main into inline PR reviews (marius-kilocode, 2026-09-03)
- 1c2610cd7 - chore: merge main into inline PR reviews (marius-kilocode, 2026-09-01)
- 9cadae764 - chore: merge main into inline PR reviews (marius-kilocode, 2026-09-01)
- e3b0c07f3 - chore: merge main into inline PR reviews (marius-kilocode, 2026-08-31)
- 6b0f8036c - chore(jetbrains): bump CLI pin to v7.5.6 (kilo-maintainer[bot], 2026-08-28)
- 760af6289 - fix(vscode): preserve cached PR comment annotations (marius-kilocode, 2026-08-28)
- 3141112eb - feat(vscode): show PR review comments inline in diffs (marius-kilocode, 2026-08-28)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/agent-manager.ts` (+25, -2)
- `packages/opencode/src/kilocode/tool/agent-manager.txt` (+1, -1)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
(no changes)

#### Other Changes
- `.changeset/chat-input-undo.md` (+5, -0)
- `.changeset/cli-board-messages.md` (+5, -0)
- `.changeset/fast-subagent-transcripts.md` (+5, -0)
- `.changeset/fix-indexing-git-path.md` (+5, -0)
- `.changeset/fix-session-prompt-home-end.md` (+5, -0)
- `.changeset/inline-pr-comment-dates.md` (+5, -0)
- `.changeset/inline-pr-review-comments.md` (+6, -0)
- `.changeset/managed-worktree-target.md` (+6, -0)
- `.changeset/solid-deletion-bars.md` (+5, -0)
- `.changeset/windows-cli-startup.md` (+5, -0)
- `.github/workflows/test.yml` (+1, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/diff-panel-with-pr-threads-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/full-screen-diff-with-pr-threads-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/pr-panel-comments-200-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/pr-panel-comments-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/user-message-many-review-comments-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/user-message-mixed-review-comments-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/user-message-review-comments-chromium-linux.png` (+2, -2)
- `packages/kilo-jetbrains/CHANGELOG.md` (+6, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeIcons.kt` (+5, -13)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/LiveBadgeIcon.kt` (+83, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/WorktreeIconsTest.kt` (+54, -10)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-ui/src/components/diff.tsx` (+58, -2)
- `packages/kilo-ui/src/components/message-part.tsx` (+2, -1)
- `packages/kilo-ui/src/pierre/index.ts` (+9, -0)
- `packages/kilo-ui/src/pierre/scroll.ts` (+29, -0)
- `packages/kilo-ui/tests/diff-indicators.spec.ts` (+35, -0)
- `packages/kilo-vscode/eslint.config.mjs` (+2, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+50, -11)
- `packages/kilo-vscode/src/agent-manager/PRStatusPoller.ts` (+84, -31)
- `packages/kilo-vscode/src/agent-manager/pr-status-bridge.ts` (+2, -2)
- `packages/kilo-vscode/src/agent-manager/pr/am-pr-types.ts` (+11, -2)
- `packages/kilo-vscode/src/agent-manager/pr/am-pr-utils.ts` (+73, -23)
- `packages/kilo-vscode/src/agent-manager/pr/pr-comment-context.ts` (+220, -55)
- `packages/kilo-vscode/src/agent-manager/project/paths.ts` (+17, -12)
- `packages/kilo-vscode/src/agent-manager/tool-start.ts` (+30, -3)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+3, -0)
- `packages/kilo-vscode/src/agent-manager/worktree-diff-controller.ts` (+8, -11)
- `packages/kilo-vscode/src/diff/DiffViewerProvider.ts` (+204, -44)
- `packages/kilo-vscode/src/diff/SourceController.ts` (+3, -14)
- `packages/kilo-vscode/src/diff/pr-poller.ts` (+117, -0)
- `packages/kilo-vscode/src/diff/types.ts` (+2, -0)
- `packages/kilo-vscode/src/extension.ts` (+42, -45)
- `packages/kilo-vscode/src/kilo-provider/editor-actions.ts` (+17, -0)
- `packages/kilo-vscode/src/shared/pr-comment-preview.ts` (+134, -0)
- `packages/kilo-vscode/src/shared/pr-review.ts` (+21, -0)
- `packages/kilo-vscode/src/shared/review-comments.ts` (+49, -10)
- `packages/kilo-vscode/tests/diff-scroll-preservation.spec.ts` (+38, -0)
- `packages/kilo-vscode/tests/fixtures/board-tool-render.tsx` (+155, -0)
- `packages/kilo-vscode/tests/fixtures/pr-comments-render.tsx` (+275, -9)
- `packages/kilo-vscode/tests/fixtures/session-provider-activity.tsx` (+99, -1)
- `packages/kilo-vscode/tests/prompt-undo.spec.ts` (+105, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-diff-state.test.ts` (+32, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-tool-project.test.ts` (+26, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-tool-start.test.ts` (+95, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-worktree-diffs.test.ts` (+44, -18)
- `packages/kilo-vscode/tests/unit/agent-project-paths.test.ts` (+83, -3)
- `packages/kilo-vscode/tests/unit/am-pr-status-bridge.test.ts` (+162, -2)
- `packages/kilo-vscode/tests/unit/am-pr-utils.test.ts` (+90, -0)
- `packages/kilo-vscode/tests/unit/board-tool-render.test.ts` (+51, -0)
- `packages/kilo-vscode/tests/unit/diff-preview-request.test.ts` (+165, -0)
- `packages/kilo-vscode/tests/unit/diff-scroll-anchor.test.ts` (+61, -0)
- `packages/kilo-vscode/tests/unit/diff-viewer-css-arch.test.ts` (+6, -1)
- `packages/kilo-vscode/tests/unit/diff-viewer-provider.test.ts` (+284, -11)
- `packages/kilo-vscode/tests/unit/draft-store.test.ts` (+20, -1)
- `packages/kilo-vscode/tests/unit/extension-arch.test.ts` (+31, -20)
- `packages/kilo-vscode/tests/unit/kilo-provider-route-integration.test.ts` (+91, -0)
- `packages/kilo-vscode/tests/unit/pr-comment-context.test.ts` (+332, -73)
- `packages/kilo-vscode/tests/unit/pr-comments-render.test.ts` (+1, -1)
- `packages/kilo-vscode/tests/unit/pr-review-editor.test.ts` (+74, -0)
- `packages/kilo-vscode/tests/unit/pr-status-merge.test.ts` (+43, -0)
- `packages/kilo-vscode/tests/unit/prompt-drafts.test.ts` (+96, -0)
- `packages/kilo-vscode/tests/unit/remote-comments.test.ts` (+271, -0)
- `packages/kilo-vscode/tests/unit/review-comments-pr.test.ts` (+105, -1)
- `packages/kilo-vscode/tests/unit/source-controller.test.ts` (+19, -22)
- `packages/kilo-vscode/tests/unit/worktree-diff-controller.test.ts` (+7, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+39, -97)
- `packages/kilo-vscode/webview-ui/agent-manager/DiffPanel.tsx` (+33, -101)
- `packages/kilo-vscode/webview-ui/agent-manager/DiffPanelCache.tsx` (+6, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/SubagentPanel.tsx` (+7, -6)
- `packages/kilo-vscode/webview-ui/agent-manager/diff-review-scope.ts` (+14, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fa.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fr.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/it.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ja.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ko.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/nl.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/no.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/pl.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ru.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/th.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/tr.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/uk.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zh.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zht.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/CopyButton.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRAvatar.tsx` (+28, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRCommentCard.tsx` (+66, -27)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRCommentTime.tsx` (+11, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRComments.tsx` (+38, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRConversation.tsx` (+2, -4)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRPanel.tsx` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRPanelHost.tsx` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/pr-comment-payload.ts` (+36, -13)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/pr-panel.css` (+42, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/pr-types.ts` (+15, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/review.ts` (+82, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/subagent-tabs.ts` (+3, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/tab-drag.ts` (+70, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/worktree-diffs.ts` (+12, -12)
- `packages/kilo-vscode/webview-ui/diff-viewer/DiffViewerApp.tsx` (+54, -16)
- `packages/kilo-vscode/webview-ui/diff-viewer/FullScreenDiffView.tsx` (+37, -104)
- `packages/kilo-vscode/webview-ui/diff-viewer/PRCommentDiff.tsx` (+73, -19)
- `packages/kilo-vscode/webview-ui/diff-viewer/ReviewDiffItem.tsx` (+29, -7)
- `packages/kilo-vscode/webview-ui/diff-viewer/diff-requests.ts` (+5, -5)
- `packages/kilo-vscode/webview-ui/diff-viewer/diff-state.ts` (+10, -0)
- `packages/kilo-vscode/webview-ui/diff-viewer/remote-comment-renderer.tsx` (+404, -0)
- `packages/kilo-vscode/webview-ui/diff-viewer/remote-comments.css` (+60, -0)
- `packages/kilo-vscode/webview-ui/diff-viewer/remote-comments.ts` (+198, -0)
- `packages/kilo-vscode/webview-ui/diff-viewer/review-controller.ts` (+167, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+26, -4)
- `packages/kilo-vscode/webview-ui/src/components/chat/ReviewComments.tsx` (+54, -7)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/stories/agent-manager.stories.tsx` (+110, -3)
- `packages/kilo-vscode/webview-ui/src/stories/chat.stories.tsx` (+39, -0)
- `packages/kilo-vscode/webview-ui/src/styles/prompt-input.css` (+14, -2)
- `packages/kilo-vscode/webview-ui/src/types/messages/agent-manager.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+22, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+9, -1)
- `packages/kilo-vscode/webview-ui/src/utils/draft-store.ts` (+4, -1)
- `packages/kilo-vscode/webview-ui/src/utils/pr-review.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/utils/prompt-drafts.ts` (+41, -4)
- `packages/opencode/bin/kilo` (+12, -27)
- `packages/opencode/bin/kilocode/windows-avx2.cjs` (+85, -0)
- `packages/opencode/script/kilocode/test-profile.ts` (+1, -0)
- `packages/opencode/src/kilocode/agent-manager/event.ts` (+1, -0)
- `packages/opencode/test/kilocode/agent-manager-tool.test.ts` (+47, -0)
- `packages/opencode/test/kilocode/bin-startup.test.ts` (+245, -0)
- `packages/opencode/test/kilocode/bin-tree-sitter-env.test.ts` (+6, -0)
- `packages/opencode/test/kilocode/startup-speed.test.ts` (+110, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+1, -0)
- `packages/sdk/openapi.json` (+3, -0)
- `packages/tui/src/component/prompt/index.tsx` (+3, -1)
- `packages/tui/src/kilocode/board-tool.tsx` (+114, -0)
- `packages/tui/src/routes/session/index.tsx` (+7, -0)
- `packages/tui/test/kilocode/board-tool.test.tsx` (+179, -0)
- `packages/tui/test/kilocode/session-home-end.test.tsx` (+301, -0)
- `script/kilocode-duplication-allowlist.json` (+0, -9)

### Key Diffs

#### packages/opencode/src/kilocode/tool/agent-manager.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/agent-manager.ts b/packages/opencode/src/kilocode/tool/agent-manager.ts
index 6df15867d..ff5be507b 100644
--- a/packages/opencode/src/kilocode/tool/agent-manager.ts
+++ b/packages/opencode/src/kilocode/tool/agent-manager.ts
@@ -60,6 +60,14 @@ const StartParams = Schema.Struct({
     description:
       "Set true only when tasks are alternative versions of the same work to compare. Omit or false for independent sessions.",
   }),
+  worktreeID: Schema.optional(
+    Schema.NullOr(
+      Schema.String.check(Schema.makeFilter((value) => (value.trim() ? undefined : "worktreeID must not be blank"))),
+    ),
+  ).annotate({
+    description:
+      "Start sessions only. Existing managed worktree ID returned by action=list in the caller's project. Requires mode local; omit or null to use the caller's directory. Never use a path or branch name.",
+  }),
   tasks: Schema.Array(Task)
     .check(Schema.isMinLength(1), Schema.isMaxLength(20))
     .annotate({ description: "Agent Manager sessions to start" }),
@@ -132,7 +140,15 @@ export const Params = Schema.Union([
   Schema.Struct({
     ...StartParams.fields,
     tasks: Schema.Union([StartParams.fields.tasks, Schema.fromJsonString(StartParams.fields.tasks)]),
-  }),
+  }).check(
+    Schema.makeFilter((params) => {
+      if (params.worktreeID == null) return undefined
+      if (params.mode !== "local") return "worktreeID requires mode local"
+      if (params.versions === true) return "worktreeID cannot be combined with versions true"
+      if (params.tasks.some((task) => task.branchName != null)) return "worktreeID cannot be combined with branchName"
+      return undefined
+    }),
+  ),
   ListParams,
   PromptParams,
   StopParams,
@@ -159,6 +175,7 @@ const WireParams = Schema.Struct({
   tasks: Schema.optional(Schema.NullOr(StartParams.fields.tasks)).annotate({
     description: "Start sessions only. Agent Manager sessions to start. Send null whenever action is set.",
   }),
+  worktreeID: StartParams.fields.worktreeID,
   action: Schema.optional(
     Schema.NullOr(Schema.Literals(["list", "prompt", "stop", "move", "answer"])).annotate({
       description:
@@ -419,7 +436,11 @@ export const AgentManagerTool = Tool.define<
             permission: "agent_manager",
             patterns: [params.mode],
             always: [params.mode],
-            metadata: { mode: params.mode, count: tasks.length },
+            metadata: {
```

#### packages/opencode/src/kilocode/tool/agent-manager.txt
```diff
diff --git a/packages/opencode/src/kilocode/tool/agent-manager.txt b/packages/opencode/src/kilocode/tool/agent-manager.txt
index 421f81eef..18a50ed40 100644
--- a/packages/opencode/src/kilocode/tool/agent-manager.txt
+++ b/packages/opencode/src/kilocode/tool/agent-manager.txt
@@ -12,7 +12,7 @@ To start sessions, keep using the existing `mode` and `tasks` input without an a
 
 Modes:
 - `worktree`: creates a new Agent Manager git worktree for each task, like the New Worktree dialog.
-- `local`: creates Agent Manager sessions in the current workspace directory without git worktree isolation.
+- `local`: creates sessions in the caller's directory, or an existing managed worktree selected by `worktreeID` from `action: "list"`.
 
 Each task may provide a prompt, a short display name, a branch name, a `model`, an optional `provider`, and a model-specific reasoning `variant`. By default, omit `model`, `provider`, and `variant`: prompted tasks inherit the exact model and reasoning variant used by the current turn. Only specify `model` when the user explicitly asks to use or compare a different model, and only specify `variant` when the user explicitly asks for a different reasoning variant. A variant can be specified without a model to override the inherited model's variant. Specify `provider` with `model` to force a model-name match to one provider ID. Never choose a different model merely because work is being fanned out. Specify an override `model` by name (e.g. "Claude Opus 4.1"); the name is matched leniently (case-insensitive, punctuation/spacing-insensitive, order-independent), so an approximate name like "opus 4.1" works and you do not need the exact name. Agent Manager picks the provider for you, preferring the provider used by the current turn and falling back to the Kilo Gateway. A qualified `provider/model` ID is also accepted to force a specific provider. If the name is ambiguous and matches several different models, the tool returns the candidates so you can choose. A model or variant selection requires an initial prompt so the session can persist that selection. Keep display names short because Agent Manager cards are narrow. Branch names are sanitized before worktree creation. Use `agent_manager_models` to search available models and variants on demand instead of guessing or loading the full model catalog. Prepared sessions without an initial prompt use the normal defaults. The agent and base branch settings always use the normal defaults.
 
```


## opencode Changes (337fd14..57ef382)

### Commits

- 57ef382 - feat(console): publish oauth client metadata document (#47737) (Aiden Cline, 2026-09-07)
- f914cac - docs (Dax Raad, 2026-09-07)
- 53fec37 - chore: generate (opencode-agent[bot], 2026-09-07)
- a03bba5 - docs (Dax Raad, 2026-09-07)
- 56d4fb2 - chore: generate (opencode-agent[bot], 2026-09-07)
- 13e3744 - docs(go): document client session compatibility (Dax Raad, 2026-09-06)
- e207624 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-09-06)
- ea2d59d - fix(provider): preserve explicit OpenAI service tiers (#47671) (opencode-agent[bot], 2026-09-06)
- bec9ee4 - fix(provider): bump Azure SDK to 3.0.93 (#47664) (opencode-agent[bot], 2026-09-06)
- c470c79 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-09-06)
- 23ec4f5 - fix(provider): bump OpenAI SDK to 3.0.88 (#47659) (opencode-agent[bot], 2026-09-06)

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
- `packages/core/package.json` (+2, -2)

#### Other Changes
- `bun.lock` (+30, -13)
- `nix/hashes.json` (+4, -4)
- `package.json` (+2, -1)
- `packages/console/app/src/routes/oauth/opencode/client.json.ts` (+38, -0)
- `packages/opencode/package.json` (+2, -2)
- `packages/web/src/content/docs/go.mdx` (+38, -10)
- `patches/@ai-sdk%2Fopenai@3.0.88.patch` (+280, -0)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 5e6ccd4..47b733d 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -64,7 +64,7 @@
     "@ai-sdk/alibaba": "1.0.17",
     "@ai-sdk/amazon-bedrock": "4.0.166",
     "@ai-sdk/anthropic": "3.0.111",
-    "@ai-sdk/azure": "3.0.88",
+    "@ai-sdk/azure": "3.0.93",
     "@ai-sdk/cerebras": "2.0.41",
     "@ai-sdk/cohere": "3.0.27",
     "@ai-sdk/deepinfra": "2.0.41",
@@ -73,7 +73,7 @@
     "@ai-sdk/google-vertex": "4.0.181",
     "@ai-sdk/groq": "3.0.31",
     "@ai-sdk/mistral": "3.0.51",
-    "@ai-sdk/openai": "3.0.84",
+    "@ai-sdk/openai": "3.0.88",
     "@ai-sdk/openai-compatible": "2.0.41",
     "@ai-sdk/perplexity": "3.0.26",
     "@ai-sdk/provider": "3.0.8",
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/tool/agent-manager.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager.ts changes
- `src/tool/agent-manager.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager.txt changes
