# Upstream Changes Report
Generated: 2026-06-03 11:01:09

## Summary
- kilocode: 49 commits, 199 files changed
- opencode: 62 commits, 438 files changed

## kilocode Changes (7433b0d75..66f053a38)

### Commits

- 66f053a38 - Merge pull request #10846 from Kilo-Org/rune-airship (Marius, 2026-06-03)
- 2f7f23dea - Add scanning (#10799) (Emilie Lima Schario, 2026-06-03)
- 312e98b20 - Merge branch 'main' into rune-airship (Marius, 2026-06-03)
- 48340fe2e - fix(vscode): preserve inline review drafts across diff refreshes (marius-kilocode, 2026-06-03)
- 0f87ebaa5 - Merge pull request #10831 from Kilo-Org/omniscient-seed (Marius, 2026-06-03)
- 5e7e15850 - Merge pull request #10833 from Kilo-Org/worried-crabapple (Catriel Müller, 2026-06-02)
- fbacc312f - refactor: add favicon (Catriel Müller, 2026-06-02)
- 8696edcb5 - fix(cli): keep console terminals stable during refresh (Catriel Müller, 2026-06-02)
- ab62726d3 - fix(docs): correct skills.urls format to use .well-known/skills/ index.json (#10756) (Aarav, 2026-06-02)
- 7d23ad570 - Merge pull request #10823 from Kilo-Org/perf/vscode-slim-transcript-payload (Marius, 2026-06-02)
- 60866a638 - fix(jetbrains): ignore stale SSE callbacks after restart (#10832) (Johnny Eric Amancio, 2026-06-02)
- 500c85056 - fix(vscode): preserve inactive shimmer whitespace (marius-kilocode, 2026-06-02)
- 837a87509 - fix: keep post-compaction replies ordered (marius-kilocode, 2026-06-02)
- ba9f6868d - docs(vscode): broaden session switch release note (marius-kilocode, 2026-06-02)
- 47111c02c - perf(vscode): avoid inactive shimmer markup (marius-kilocode, 2026-06-02)
- f7641c1b4 - Merge pull request #10829 from Kilo-Org/screeching-dedication (Marius, 2026-06-02)
- 89a81416f - Merge pull request #10806 from Kilo-Org/orderly-dinosaur (Marius, 2026-06-02)
- 4cf8e5307 - Merge pull request #10692 from Kilo-Org/fix/shell-permission-show-description (Joshua Lambert, 2026-06-02)
- e6898387f - test(cli): stabilize shell cancellation wait (marius-kilocode, 2026-06-02)
- e64c1fb65 - fix(cli): restore bodyless session forks (marius-kilocode, 2026-06-02)
- ad847d3e3 - Merge branch 'main' into perf/vscode-slim-transcript-payload (marius-kilocode, 2026-06-02)
- bff5546bd - Merge pull request #10826 from Kilo-Org/revert-10800-troubled-hawk (Catriel Müller, 2026-06-02)
- 5a5a7524f - Revert "fix: suppress false incomplete response warnings" (Catriel Müller, 2026-06-02)
- 623821ced - perf(vscode): slim transcript payloads (marius-kilocode, 2026-06-02)
- 0e60d0fd7 - revert: sort permission exceptions (#10808) (#10818) (kilo-code-bot[bot], 2026-06-02)
- a9988ba07 - Merge pull request #10810 from Kilo-Org/prism-purchase (Marius, 2026-06-02)
- 75ed1a1eb - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-06-02)
- 394536837 - style(vscode): mark timeline tooltip non-interactive (marius-kilocode, 2026-06-02)
- 8aaa62c79 - Session export capture (#10611) (Igor Šćekić, 2026-06-02)
- 28fa37d5b - perf(vscode): share timeline tooltip and lazy-mount historical bash output (marius-kilocode, 2026-06-02)
- 19b2f3145 - Merge pull request #10800 from Kilo-Org/troubled-hawk (Catriel Müller, 2026-06-02)
- b7764d69c - fix: correct architect use of plan exit to save the plan file correctly (#10798) (Johnny Eric Amancio, 2026-06-02)
- 0e4f8bcde - refactor(vscode): extract editor actions from KiloProvider (#10814) (Imanol Maiztegui, 2026-06-02)
- 60f4c052a - refactor: isolate the changes inside of the kilo folders (Catriel Müller, 2026-06-02)
- 16341a664 - fix(vscode): keep tool handoffs out of virtual history (#10816) (Imanol Maiztegui, 2026-06-02)
- a51affea0 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-06-02)
- 9926f38e4 - fix: address vulnerability on vitest dependency (#10815) (Johnny Eric Amancio, 2026-06-02)
- 5dd3dc72a - chore(cli): annotate session regression changes (Catriel Müller, 2026-06-02)
- 1212b05d6 - Merge remote-tracking branch 'origin/main' into troubled-hawk (Catriel Müller, 2026-06-02)
- c9b1ee0ef - refactor: improve the session processor (Catriel Müller, 2026-06-02)
- 3feb9d69d - release: v7.3.22 (kilo-maintainer[bot], 2026-06-02)
- 3f8afe83d - test(vscode): remove obsolete marketplace race setup (marius-kilocode, 2026-06-02)
- 5b34dfce3 - fix(vscode): defer collapsed historical tool details (marius-kilocode, 2026-06-02)
- ed3e1ac99 - fix(vscode): harden marketplace skill installs (marius-kilocode, 2026-06-02)
- 5ee56e29f - fix(cli): restore worktree family typecheck (Catriel Müller, 2026-06-01)
- 2f93185b0 - fix: suppress false incomplete response warnings (Catriel Müller, 2026-06-01)
- 671340a5a - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-05-29)
- eadfb2b80 - fix(vscode): clarify shell permission command preview (Josh Lambert, 2026-05-29)
- 9cc8fd324 - fix(vscode): show shell command description in permission approval prompt (kiloconnect[bot], 2026-05-28)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/shell.ts` (+9, -4)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)

#### Other Changes
- `.changeset/calm-marketplace-skills-install.md` (+5, -0)
- `.changeset/console-diff-refresh.md` (+5, -0)
- `.changeset/console-favicon.md` (+5, -0)
- `.changeset/fresh-compaction-order.md` (+6, -0)
- `.changeset/shell-permission-descriptions.md` (+5, -0)
- `.changeset/stable-tool-scroll.md` (+5, -0)
- `.changeset/steady-review-drafts.md` (+5, -0)
- `.changeset/steady-session-forks.md` (+5, -0)
- `.changeset/vscode-lazy-historical-tool-details.md` (+5, -0)
- `.github/codeql/codeql-config.yml` (+12, -0)
- `.github/workflows/codeql.yml` (+117, -0)
- `.github/workflows/visual-regression.yml` (+18, -15)
- `.opencode/tui.json` (+1, -1)
- `bun.lock` (+113, -51)
- `nix/hashes.json` (+4, -4)
- `package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/kilo-console/index.html` (+2, -0)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-console/public/favicon.ico` (+-, --)
- `packages/kilo-console/public/favicon.svg` (+13, -0)
- `packages/kilo-console/src/routes/projects/ProjectConsoleRoute.tsx` (+8, -5)
- `packages/kilo-docs/package.json` (+2, -2)
- `packages/kilo-docs/pages/customize/skills.md` (+36, -4)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/bash-with-permission-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-bash-many-rules-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-heredoc-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-subagent-chromium-linux.png` (+2, -2)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendConnectionService.kt` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/model/ModelPicker.kt` (+15, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/model/ModelPickerRenderer.kt` (+15, -3)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/model/ModelPickerTest.kt` (+35, -0)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/message-part.tsx` (+12, -1)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+21, -129)
- `packages/kilo-vscode/src/kilo-provider/editor-actions.ts` (+131, -0)
- `packages/kilo-vscode/src/kilo-provider/slim-metadata.ts` (+43, -7)
- `packages/kilo-vscode/src/services/marketplace/installer.ts` (+55, -26)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+9, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-load-messages.test.ts` (+69, -0)
- `packages/kilo-vscode/tests/unit/kilo-ui-contract.test.ts` (+32, -0)
- `packages/kilo-vscode/tests/unit/marketplace-installer.test.ts` (+153, -4)
- `packages/kilo-vscode/tests/unit/model-preview-data-line.test.ts` (+21, -0)
- `packages/kilo-vscode/tests/unit/model-selector-utils.test.ts` (+16, -0)
- `packages/kilo-vscode/tests/unit/review-comments.test.ts` (+92, -0)
- `packages/kilo-vscode/tests/unit/session-queue.test.ts` (+158, -0)
- `packages/kilo-vscode/tests/unit/slim-metadata.test.ts` (+39, -1)
- `packages/kilo-vscode/tests/unit/task-timeline-tooltip.test.ts` (+30, -0)
- `packages/kilo-vscode/tests/unit/textshimmer-no-timer.test.ts` (+5, -17)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+5, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/DiffPanel.tsx` (+47, -10)
- `packages/kilo-vscode/webview-ui/agent-manager/FullScreenDiffView.tsx` (+45, -8)
- `packages/kilo-vscode/webview-ui/agent-manager/MultiModelSelector.tsx` (+21, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+28, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/review-annotation-speech.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/review-annotations.ts` (+81, -16)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+10, -3)
- `packages/kilo-vscode/webview-ui/src/components/chat/PermissionCommand.tsx` (+26, -2)
- `packages/kilo-vscode/webview-ui/src/components/chat/PermissionDock.tsx` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskTimeline.tsx` (+67, -23)
- `packages/kilo-vscode/webview-ui/src/components/settings/permission-utils.ts` (+0, -1)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelPreview.tsx` (+46, -28)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelSelector.tsx` (+28, -1)
- `packages/kilo-vscode/webview-ui/src/components/shared/model-selector-utils.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/context/session-queue.ts` (+67, -25)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+3, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/stories/composite.stories.tsx` (+6, -2)
- `packages/kilo-vscode/webview-ui/src/styles/high-contrast.css` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/styles/model-selector.css` (+50, -7)
- `packages/kilo-vscode/webview-ui/src/styles/permission-dock.css` (+33, -13)
- `packages/kilo-vscode/webview-ui/src/styles/task-header.css` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/parts.ts` (+8, -1)
- `packages/kilo-vscode/webview-ui/src/types/messages/permissions.ts` (+1, -0)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/package.json` (+3, -1)
- `packages/opencode/script/build.ts` (+6, -4)
- `packages/opencode/src/cli/cmd/tui/component/dialog-model.tsx` (+16, -7)
- `packages/opencode/src/config/provider.ts` (+3, -1)
- `packages/opencode/src/index.ts` (+9, -3)
- `packages/opencode/src/kilocode/bootstrap.ts` (+33, -0)
- `packages/opencode/src/kilocode/components/free-model-disclosure.ts` (+7, -0)
- `packages/opencode/src/kilocode/components/model-info-panel.tsx` (+3, -2)
- `packages/opencode/src/kilocode/provider/provider.ts` (+2, -1)
- `packages/opencode/src/kilocode/server/httpapi/session-fork.ts` (+33, -0)
- `packages/opencode/src/kilocode/session-export/capture.ts` (+362, -0)
- `packages/opencode/src/kilocode/session-export/config.ts` (+17, -0)
- `packages/opencode/src/kilocode/session-export/eligibility.ts` (+55, -0)
- `packages/opencode/src/kilocode/session-export/envelope.ts` (+59, -0)
- `packages/opencode/src/kilocode/session-export/events.ts` (+186, -0)
- `packages/opencode/src/kilocode/session-export/index.ts` (+1, -0)
- `packages/opencode/src/kilocode/session-export/org-sources.ts` (+25, -0)
- `packages/opencode/src/kilocode/session-export/sequence.ts` (+28, -0)
- `packages/opencode/src/kilocode/session-export/session-export.ts` (+220, -0)
- `packages/opencode/src/kilocode/session-export/sync-subscriber.ts` (+158, -0)
- `packages/opencode/src/kilocode/session-export/worker.ts` (+136, -0)
- `packages/opencode/src/kilocode/session-export/worker/buffer-cap.ts` (+9, -0)
- `packages/opencode/src/kilocode/session-export/worker/chunks.ts` (+54, -0)
- `packages/opencode/src/kilocode/session-export/worker/endpoint.ts` (+16, -0)
- `packages/opencode/src/kilocode/session-export/worker/handlers.ts` (+229, -0)
- `packages/opencode/src/kilocode/session-export/worker/inbox.ts` (+44, -0)
- `packages/opencode/src/kilocode/session-export/worker/ipc.ts` (+15, -0)
- `packages/opencode/src/kilocode/session-export/worker/schema.ts` (+39, -0)
- `packages/opencode/src/kilocode/session-export/worker/scrub.ts` (+156, -0)
- `packages/opencode/src/kilocode/session-export/worker/storage.ts` (+315, -0)
- `packages/opencode/src/kilocode/session-export/worker/uploader.ts` (+336, -0)
- `packages/opencode/src/kilocode/session-export/worker/validate.ts` (+59, -0)
- `packages/opencode/src/kilocode/session-export/worker/zstd.ts` (+13, -0)
- `packages/opencode/src/kilocode/session-export/workspace-fiber.ts` (+127, -0)
- `packages/opencode/src/kilocode/session-export/workspace-provider.ts` (+277, -0)
- `packages/opencode/src/kilocode/session/index.ts` (+4, -0)
- `packages/opencode/src/kilocode/session/message-order.ts` (+66, -0)
- `packages/opencode/src/kilocode/session/prompt.ts` (+30, -13)
- `packages/opencode/src/server/routes/instance/httpapi/groups/session.ts` (+2, -2)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/session.ts` (+4, -1)
- `packages/opencode/src/session/compaction.ts` (+32, -0)
- `packages/opencode/src/session/llm.ts` (+185, -7)
- `packages/opencode/src/session/message-v2.ts` (+2, -0)
- `packages/opencode/src/session/prompt.ts` (+17, -16)
- `packages/opencode/src/session/session.ts` (+5, -1)
- `packages/opencode/test/config/config.test.ts` (+35, -0)
- `packages/opencode/test/kilocode/free-model-disclosure.test.ts` (+25, -0)
- `packages/opencode/test/kilocode/kilo-loader-auth.test.ts` (+15, -0)
- `packages/opencode/test/kilocode/session-compaction-safety.test.ts` (+102, -0)
- `packages/opencode/test/kilocode/session-export/agent.test.ts` (+27, -0)
- `packages/opencode/test/kilocode/session-export/buffer-cap.test.ts` (+32, -0)
- `packages/opencode/test/kilocode/session-export/capture.test.ts` (+503, -0)
- `packages/opencode/test/kilocode/session-export/config.test.ts` (+22, -0)
- `packages/opencode/test/kilocode/session-export/e2e.test.ts` (+225, -0)
- `packages/opencode/test/kilocode/session-export/eligibility.test.ts` (+43, -0)
- `packages/opencode/test/kilocode/session-export/events.test.ts` (+136, -0)
- `packages/opencode/test/kilocode/session-export/llm.test.ts` (+32, -0)
- `packages/opencode/test/kilocode/session-export/org-signal.test.ts` (+40, -0)
- `packages/opencode/test/kilocode/session-export/perf.test.ts` (+52, -0)
- `packages/opencode/test/kilocode/session-export/respawn.test.ts` (+212, -0)
- `packages/opencode/test/kilocode/session-export/sequence.test.ts` (+70, -0)
- `packages/opencode/test/kilocode/session-export/source-contract.test.ts` (+28, -0)
- `packages/opencode/test/kilocode/session-export/sync-subscriber.test.ts` (+170, -0)
- `packages/opencode/test/kilocode/session-export/worker.test.ts` (+62, -0)
- `packages/opencode/test/kilocode/session-export/worker/chunks.test.ts` (+45, -0)
- `packages/opencode/test/kilocode/session-export/worker/endpoint.test.ts` (+19, -0)
- `packages/opencode/test/kilocode/session-export/worker/handlers.test.ts` (+423, -0)
- `packages/opencode/test/kilocode/session-export/worker/inbox.test.ts` (+27, -0)
- `packages/opencode/test/kilocode/session-export/worker/scrub.test.ts` (+109, -0)
- `packages/opencode/test/kilocode/session-export/worker/storage.test.ts` (+147, -0)
- `packages/opencode/test/kilocode/session-export/worker/uploader.test.ts` (+549, -0)
- `packages/opencode/test/kilocode/session-export/worker/validate.test.ts` (+30, -0)
- `packages/opencode/test/kilocode/session-export/worker/zstd.test.ts` (+19, -0)
- `packages/opencode/test/kilocode/session-export/workspace-fiber.test.ts` (+141, -0)
- `packages/opencode/test/kilocode/session-export/workspace-provider.test.ts` (+286, -0)
- `packages/opencode/test/kilocode/session/platform-attribution.test.ts` (+18, -0)
- `packages/opencode/test/preload.ts` (+2, -0)
- `packages/opencode/test/server/httpapi-session.test.ts` (+0, -1)
- `packages/opencode/test/session/prompt.test.ts` (+10, -3)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+6, -0)
- `packages/sdk/openapi.json` (+17, -0)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/components/basic-tool.tsx` (+6, -2)
- `packages/ui/src/components/text-shimmer.css` (+1, -0)
- `packages/ui/src/components/text-shimmer.tsx` (+13, -8)
- `script/check-opencode-promise-facades.ts` (+1, -1)
- `script/check-workflows.ts` (+1, -0)
- `script/extract-source-links.ts` (+1, -0)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index a2d41c0b4..ddfaf9d4a 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.3.21",
+  "version": "7.3.22",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/opencode/src/tool/shell.ts
```diff
diff --git a/packages/opencode/src/tool/shell.ts b/packages/opencode/src/tool/shell.ts
index c6bc11f04..fcfdb5f2e 100644
--- a/packages/opencode/src/tool/shell.ts
+++ b/packages/opencode/src/tool/shell.ts
@@ -281,7 +281,12 @@ const parse = Effect.fn("ShellTool.parse")(function* (command: string, ps: boole
   return tree
 })
 
-const ask = Effect.fn("ShellTool.ask")(function* (ctx: Tool.Context, scan: Scan, command: string) {
+const ask = Effect.fn("ShellTool.ask")(function* (
+  ctx: Tool.Context,
+  scan: Scan,
+  command: string,
+  description?: string, // kilocode_change
+) {
   // kilocode_change
   if (scan.dirs.size > 0) {
     const globs = Array.from(scan.dirs).map((dir) => {
@@ -292,7 +297,7 @@ const ask = Effect.fn("ShellTool.ask")(function* (ctx: Tool.Context, scan: Scan,
       permission: "external_directory",
       patterns: globs,
       always: globs,
-      metadata: scan.access === "read" ? { command, access: "read" } : {}, // kilocode_change
+      metadata: scan.access === "read" ? { command, access: "read", ...(description ? { description } : {}) } : {}, // kilocode_change
     })
   }
 
@@ -301,7 +306,7 @@ const ask = Effect.fn("ShellTool.ask")(function* (ctx: Tool.Context, scan: Scan,
     permission: ShellID.ToolID,
     patterns: Array.from(scan.patterns),
     always: Array.from(scan.always),
-    metadata: { command: normalizeUrls(command) }, // kilocode_change
+    metadata: { command: normalizeUrls(command), ...(description ? { description } : {}) }, // kilocode_change
   })
 })
 
@@ -644,7 +649,7 @@ export const ShellTool = Tool.define(
                     scan.access = "unknown"
                   }
                   // kilocode_change end
-                  yield* ask(ctx, scan, params.command) // kilocode_change
+                  yield* ask(ctx, scan, params.command, params.description) // kilocode_change
                 }),
               )
 
```


## opencode Changes (d5a0ddb..56ec4b6)

### Commits

- 56ec4b6 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-03)
- 06eecc5 - tui: truncate sidebar file paths (#30531) (Simon Klee, 2026-06-03)
- b6f76e2 - chore: generate (opencode-agent[bot], 2026-06-03)
- 932fb6c - refactor(core): consolidate pty service (#30537) (Shoubhit Dash, 2026-06-03)
- c6f6843 - feat(app): add servers tab to settings dialog (#29675) (Brendan Allan, 2026-06-03)
- c36a433 - chore: generate (opencode-agent[bot], 2026-06-03)
- 707166a - fix(ui): render whole-file patches as complete diffs (#30516) (Brendan Allan, 2026-06-03)
- 01cc475 - fix(opencode): fallback to sh for curl upgrade (#30499) (Ulises Jeremias, 2026-06-03)
- a444410 - feat(app): new update button  (#30460) (Aarav Sareen, 2026-06-03)
- a3b97d9 - fix(github): enforce existing git author identity (#30507) (Ulises Jeremias, 2026-06-03)
- 134a5c8 - feat(app): polish select-v2 component (#30446) (Aarav Sareen, 2026-06-03)
- 2538c0d - feat(app): polish home projects list UI (#30436) (Aarav Sareen, 2026-06-03)
- 1111fdc - chore: generate (opencode-agent[bot], 2026-06-03)
- 5940304 - fix: rm tool reorder logic from old bug (#30483) (Aiden Cline, 2026-06-02)
- a763a14 - Revert "fix(opencode): preserve signed thinking during anthropic reorder" (#30502) (Aiden Cline, 2026-06-02)
- 42173bc - fix(opencode): preserve signed thinking during anthropic reorder (#30182) (Aiden Cline, 2026-06-02)
- 0294342 - chore: generate (opencode-agent[bot], 2026-06-03)
- 147c6c4 - feat(core): project copying and tracking directories (#30139) (James Long, 2026-06-03)
- 7a66eae - chore: generate (opencode-agent[bot], 2026-06-03)
- 70cd4bf - fix: task id passed to background job for continuation (#30485) (Aiden Cline, 2026-06-02)
- 6003217 - chore: generate (opencode-agent[bot], 2026-06-03)
- 8345255 - refactor(core): move v1 schemas into core (#30473) (Dax, 2026-06-03)
- 0543fd2 - fix(tui): stop idle background task spinner (#30484) (Aiden Cline, 2026-06-02)
- dc216e8 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-02)
- b12bc87 - chore: generate (opencode-agent[bot], 2026-06-02)
- ca2acc4 - refactor(opencode): remove JSON storage migration (#30461) (Dax, 2026-06-02)
- 113e7be - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-02)
- 30cff95 - run: enable interactive replay by default (#30465) (Simon Klee, 2026-06-02)
- cb587b6 - chore: generate (opencode-agent[bot], 2026-06-02)
- 604a5f7 - refactor(core): consolidate filesystem services (#30447) (Dax, 2026-06-02)
- b93963e - chore: generate (opencode-agent[bot], 2026-06-02)
- 70a2e84 - fix(opencode): patch empty Gemini replay messages (#30463) (Aiden Cline, 2026-06-02)
- 1acdc48 - chore: generate (opencode-agent[bot], 2026-06-02)
- 7dd2306 - refactor(opencode): improve startup time by 38% (#30453) (Dustin Deus, 2026-06-02)
- 83c12f3 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-02)
- 52ecc6d - Revert "tui: revert OpenTUI upgrade to 0.2.16 (#30383)" (#30452) (Simon Klee, 2026-06-02)
- 1f2bcc2 - chore: bump effect beta to 74 (#30449) (Kit Langton, 2026-06-02)
- 4002b85 - fix(effect-drizzle-sqlite): preserve transaction begin errors (#30448) (Kit Langton, 2026-06-02)
- 5b92b17 - chore: generate (opencode-agent[bot], 2026-06-02)
- 69345a2 - feat(stats): improve cache ratio chart (Adam, 2026-06-02)
- e54f974 - chore: generate (opencode-agent[bot], 2026-06-02)
- a639fe7 - chore(opencode): remove scout agent (#30435) (Shoubhit Dash, 2026-06-02)
- 18ba80f - fix(stats): remove leaderboard nav link (Adam, 2026-06-02)
- 882d028 - fix(plugin): restore private git install fallback (#30430) (Aiden Cline, 2026-06-02)
- 42a3538 - test: widen provider header timeout margin (#30427) (Aiden Cline, 2026-06-02)
- c466d32 - fix(tui): scope diff viewer to session directory (#30426) (James Long, 2026-06-02)
- f1af9c5 - sync (Frank, 2026-06-02)
- 091ea86 - chore: generate (opencode-agent[bot], 2026-06-02)
- 380931a - feat(core): expose project reference filesystem access (#30423) (Shoubhit Dash, 2026-06-02)
- 8a17bc4 - fix(stats): mention opencode go in top models copy (Adam, 2026-06-02)
- 212ae3d - fix(stats): clean retired provider rows during sync (#30420) (Adam, 2026-06-02)
- b3da479 - feat(core): support named migrations (#30418) (James Long, 2026-06-02)
- 3500709 - chore: generate (opencode-agent[bot], 2026-06-02)
- 5a8ef94 - feat(core): add flagged project references (#30414) (Shoubhit Dash, 2026-06-02)
- d93ca9f - feat(stats): add cache ratio section (Adam, 2026-06-02)
- 74052c7 - sync (Frank, 2026-06-02)
- 9c37286 - chore: generate (opencode-agent[bot], 2026-06-02)
- fcfd476 - chore: generate (opencode-agent[bot], 2026-06-02)
- 371ee32 - feat(core): add managed repository cache (#30408) (Shoubhit Dash, 2026-06-02)
- a78adb1 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-02)
- cd0fd99 - tui: revert OpenTUI upgrade to 0.2.16 (#30383) (Simon Klee, 2026-06-02)
- 8936914 - tui: show model context in run footer (#30380) (Simon Klee, 2026-06-02)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/apply_patch.ts` (+7, -7)
- `packages/opencode/src/tool/edit.ts` (+10, -10)
- `packages/opencode/src/tool/external-directory.ts` (+3, -3)
- `packages/opencode/src/tool/glob.ts` (+3, -3)
- `packages/opencode/src/tool/grep.ts` (+5, -7)
- `packages/opencode/src/tool/lsp.ts` (+2, -2)
- `packages/opencode/src/tool/plan.ts` (+3, -3)
- `packages/opencode/src/tool/read.ts` (+4, -4)
- `packages/opencode/src/tool/registry.ts` (+4, -16)
- `packages/opencode/src/tool/repo_clone.ts` (+0, -77)
- `packages/opencode/src/tool/repo_clone.txt` (+0, -5)
- `packages/opencode/src/tool/repo_overview.ts` (+0, -279)
- `packages/opencode/src/tool/repo_overview.txt` (+0, -4)
- `packages/opencode/src/tool/shell.ts` (+6, -6)
- `packages/opencode/src/tool/skill.ts` (+1, -1)
- `packages/opencode/src/tool/task.ts` (+33, -20)
- `packages/opencode/src/tool/tool.ts` (+5, -5)
- `packages/opencode/src/tool/truncate.ts` (+3, -3)
- `packages/opencode/src/tool/write.ts` (+7, -7)
- `packages/opencode/test/tool/apply_patch.test.ts` (+2, -2)
- `packages/opencode/test/tool/edit.test.ts` (+9, -9)
- `packages/opencode/test/tool/external-directory.test.ts` (+2, -2)
- `packages/opencode/test/tool/glob.test.ts` (+9, -9)
- `packages/opencode/test/tool/grep.test.ts` (+9, -9)
- `packages/opencode/test/tool/lsp.test.ts` (+6, -12)
- `packages/opencode/test/tool/read.test.ts` (+15, -15)
- `packages/opencode/test/tool/registry.test.ts` (+3, -26)
- `packages/opencode/test/tool/repo_clone.test.ts` (+0, -234)
- `packages/opencode/test/tool/repo_overview.test.ts` (+0, -156)
- `packages/opencode/test/tool/shell.test.ts` (+36, -36)
- `packages/opencode/test/tool/skill.test.ts` (+2, -2)
- `packages/opencode/test/tool/task.test.ts` (+76, -3)
- `packages/opencode/test/tool/truncation.test.ts` (+9, -8)
- `packages/opencode/test/tool/write.test.ts` (+2, -2)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+2, -38)
- `packages/opencode/src/agent/prompt/scout.txt` (+0, -36)
- `packages/opencode/src/agent/subagent-permissions.ts` (+3, -3)
- `packages/opencode/test/agent/agent.test.ts` (+3, -26)
- `packages/opencode/test/agent/plan-mode-subagent-bypass.test.ts` (+4, -4)
- `packages/opencode/test/agent/plugin-agent-regression.test.ts` (+4, -4)

#### Permission System (**/permission/)
- `packages/opencode/src/permission/index.ts` (+30, -34)
- `packages/opencode/test/permission/next.test.ts` (+51, -51)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/migration/20260602182828_add_project_directories/migration.sql` (+8, -0)
- `packages/core/migration/20260602182828_add_project_directories/snapshot.json` (+1664, -0)
- `packages/core/package.json` (+21, -0)
- `packages/core/script/migration.ts` (+12, -2)
- `packages/core/src/auth.ts` (+3, -3)
- `packages/core/src/config.ts` (+18, -5)
- `packages/core/src/config/reference.ts` (+31, -0)
- `packages/core/src/database/migration.gen.ts` (+1, -0)
- `packages/core/src/database/migration/20260602182828_add_project_directories.ts` (+20, -0)
- `packages/core/src/filesystem.ts` (+251, -229)
- `packages/core/src/filesystem/watcher.ts` (+140, -0)
- `packages/core/src/flag/flag.ts` (+4, -2)
- `packages/core/src/fs-util.ts` (+247, -0)
- `packages/core/src/git.ts` (+165, -12)
- `packages/core/src/location-filesystem.ts` (+0, -179)
- `packages/core/src/location-layer.ts` (+12, -4)
- `packages/core/src/models-dev.ts` (+3, -3)
- `packages/core/src/npm.ts` (+3, -3)
- `packages/core/src/plugin/agent.ts` (+0, -2)
- `packages/core/src/project-reference.ts` (+236, -0)
- `packages/core/src/project.ts` (+33, -5)
- `packages/core/src/project/copy-strategies.ts` (+41, -0)
- `packages/core/src/project/copy.ts` (+261, -0)
- `packages/core/src/project/sql.ts` (+17, -1)
- `packages/core/src/repository-cache.ts` (+291, -0)
- `packages/core/src/repository.ts` (+208, -0)
- `packages/core/src/session/projector.ts` (+13, -15)
- `packages/core/src/session/sql.ts` (+7, -7)
- `packages/core/src/util/effect-flock.ts` (+4, -4)
- `packages/core/src/v1/config/agent.ts` (+89, -0)
- `packages/core/src/v1/config/command.ts` (+12, -0)
- `packages/core/src/v1/config/config.ts` (+186, -0)
- `packages/core/src/v1/config/migrate.ts` (+212, -0)
- `packages/core/src/v1/config/plugin.ts` (+9, -0)
- `packages/core/src/v1/config/reference.ts` (+24, -0)
- `packages/core/src/{permission/legacy.ts => v1/permission.ts}` (+1, -1)
- `packages/core/src/{session/legacy.ts => v1/session.ts}` (+4, -4)
- `packages/core/test/account.test.ts` (+2, -2)
- `packages/core/test/config/config.test.ts` (+108, -2)
- `packages/core/test/database-migration.test.ts` (+1, -1)
- `packages/core/test/filesystem/filesystem.test.ts` (+34, -34)
- `packages/core/test/filesystem/ignore.test.ts` (+10, -0)
- `packages/core/test/filesystem/watcher.test.ts` (+272, -0)
- `packages/core/test/fixture/effect-flock-worker.ts` (+2, -2)
- `packages/core/test/fixture/git.ts` (+49, -0)
- `packages/core/test/git.test.ts` (+106, -0)
- `packages/core/test/location-filesystem.test.ts` (+194, -17)
- `packages/core/test/location-layer.test.ts` (+4, -2)
- `packages/core/test/location.test.ts` (+1, -0)
- `packages/core/test/models.test.ts` (+2, -2)
- `packages/core/test/npm.test.ts` (+2, -2)
- `packages/core/test/project-copy.test.ts` (+191, -0)
- `packages/core/test/project-reference.test.ts` (+302, -0)
- `packages/core/test/project.test.ts` (+62, -2)
- `packages/core/test/pty/pty-output-isolation.test.ts` (+110, -0)
- `packages/core/test/pty/pty-session.test.ts` (+91, -0)
- `packages/core/test/repository-cache.test.ts` (+125, -0)
- `packages/core/test/repository.test.ts` (+65, -0)
- `packages/core/test/util/effect-flock.test.ts` (+2, -2)
- `packages/stats/core/src/domain/geo.ts` (+27, -2)
- `packages/stats/core/src/domain/home.ts` (+25, -0)
- `packages/stats/core/src/domain/inference.test.ts` (+9, -1)
- `packages/stats/core/src/domain/inference.ts` (+12, -4)
- `packages/stats/core/src/domain/model-normalization.ts` (+4, -2)
- `packages/stats/core/src/domain/model.ts` (+32, -2)
- `packages/stats/core/src/domain/provider.ts` (+29, -2)
- `packages/stats/core/src/domain/stat.ts` (+15, -0)
- `packages/stats/core/src/stat-sync.ts` (+8, -0)

#### Other Changes
- `AGENTS.md` (+1, -0)
- `bun.lock` (+88, -37)
- `github/index.ts` (+22, -2)
- `infra/lake.ts` (+5, -37)
- `nix/hashes.json` (+4, -4)
- `package.json` (+8, -6)
- `packages/app/src/app.tsx` (+3, -3)
- `packages/app/src/components/dialog-connect-provider.tsx` (+2, -0)
- `packages/app/src/components/dialog-fork.tsx` (+1, -1)
- `packages/app/src/components/dialog-manage-models.tsx` (+1, -0)
- `packages/app/src/components/dialog-select-directory.tsx` (+9, -12)
- `packages/app/src/components/dialog-select-file.tsx` (+1, -0)
- `packages/app/src/components/dialog-select-mcp.tsx` (+1, -0)
- `packages/app/src/components/dialog-select-model-unpaid.tsx` (+2, -2)
- `packages/app/src/components/dialog-select-model.tsx` (+1, -1)
- `packages/app/src/components/dialog-select-provider.tsx` (+1, -0)
- `packages/app/src/components/dialog-select-server.tsx` (+207, -167)
- `packages/app/src/components/dialog-settings.tsx` (+9, -1)
- `packages/app/src/components/prompt-input.tsx` (+3, -1)
- `packages/app/src/components/session/session-new-design-view.tsx` (+1, -1)
- `packages/app/src/components/settings-models.tsx` (+13, -1)
- `packages/app/src/components/settings-providers.tsx` (+11, -1)
- `packages/app/src/components/settings-server-picker.tsx` (+106, -0)
- `packages/app/src/components/settings-servers.tsx` (+33, -0)
- `packages/app/src/components/settings-v2/dialog-settings-v2.tsx` (+8, -0)
- `packages/app/src/components/settings-v2/general.tsx` (+23, -2)
- `packages/app/src/components/settings-v2/settings-v2.css` (+2, -4)
- `packages/app/src/components/status-popover-body.tsx` (+80, -74)
- `packages/app/src/components/status-popover.tsx` (+9, -9)
- `packages/app/src/components/titlebar.tsx` (+26, -13)
- `packages/app/src/context/global.tsx` (+248, -0)
- `packages/app/src/context/server-sdk.tsx` (+14, -9)
- `packages/app/src/context/server-sync.tsx` (+30, -12)
- `packages/app/src/context/servers.tsx` (+0, -20)
- `packages/app/src/context/settings.tsx` (+4, -0)
- `packages/app/src/index.css` (+26, -1)
- `packages/app/src/pages/home.tsx` (+142, -117)
- `packages/app/src/pages/layout.tsx` (+5, -3)
- `packages/app/src/pages/session.tsx` (+1, -1)
- `packages/cli/src/api.ts` (+12, -0)
- `packages/cli/src/cli-api.ts` (+42, -0)
- `packages/cli/src/cli-builder.ts` (+72, -0)
- `packages/cli/src/debug/agents.ts` (+0, -31)
- `packages/cli/src/debug/index.ts` (+0, -7)
- `packages/cli/src/handlers/debug/agents.ts` (+30, -0)
- `packages/cli/src/handlers/migrate.ts` (+5, -0)
- `packages/cli/src/index.ts` (+13, -11)
- `packages/{opencode => core}/script/fix-node-pty.ts` (+0, -0)
- `packages/{opencode/src/file => core/src/filesystem}/ignore.ts` (+6, -20)
- `packages/{opencode/src/file => core/src/filesystem}/protected.ts` (+4, -10)
- `packages/{opencode/src/file => core/src/filesystem}/ripgrep.ts` (+11, -11)
- `packages/{opencode/src/pty/index.ts => core/src/pty.ts}` (+101, -166)
- `packages/{opencode => core}/src/pty/input.ts` (+0, -0)
- `packages/{opencode => core}/src/pty/pty.bun.ts` (+0, -0)
- `packages/{opencode => core}/src/pty/pty.node.ts` (+0, -0)
- `packages/{opencode => core}/src/pty/pty.ts` (+0, -0)
- `packages/{opencode => core}/src/pty/schema.ts` (+2, -3)
- `packages/{opencode => core}/src/pty/ticket.ts` (+3, -13)
- `packages/{opencode => core}/src/util/which.ts` (+1, -1)
- `packages/{opencode/src => core/src/v1}/config/attachment.ts` (+2, -2)
- `packages/{opencode/src => core/src/v1}/config/console-state.ts` (+3, -1)
- `packages/{opencode/src => core/src/v1}/config/error.ts` (+13, -2)
- `packages/{opencode/src => core/src/v1}/config/formatter.ts` (+1, -1)
- `packages/{opencode/src => core/src/v1}/config/layout.ts` (+2, -2)
- `packages/{opencode/src => core/src/v1}/config/lsp.ts` (+46, -9)
- `packages/{opencode/src => core/src/v1}/config/mcp.ts` (+3, -3)
- `packages/{opencode/src => core/src/v1}/config/permission.ts` (+2, -10)
- `packages/{opencode/src => core/src/v1}/config/provider.ts` (+5, -4)
- `packages/{opencode/src => core/src/v1}/config/server.ts` (+3, -3)
- `packages/{opencode/src => core/src/v1}/config/skills.ts` (+2, -3)
- `packages/{opencode/test/file => core/test/filesystem}/ripgrep.test.ts` (+1, -1)
- `packages/{opencode => core}/test/pty/info-schema.test.ts` (+1, -7)
- `packages/{opencode/test/server/httpapi-pty-websocket.test.ts => core/test/pty/input.test.ts}` (+2, -2)
- `packages/{opencode => core}/test/pty/ticket.test.ts` (+2, -2)
- `packages/{opencode => core}/test/util/which.test.ts` (+2, -2)
- `packages/desktop/electron.vite.config.ts` (+0, -1)
- `packages/desktop/package.json` (+0, -1)
- `packages/desktop/src/main/env.d.ts` (+0, -8)
- `packages/desktop/src/main/index.ts` (+8, -63)
- `packages/desktop/src/main/ipc.ts` (+3, -20)
- `packages/desktop/src/main/server.ts` (+0, -10)
- `packages/desktop/src/main/sidecar.ts` (+1, -21)
- `packages/desktop/src/main/windows.ts` (+0, -35)
- `packages/desktop/src/preload/index.ts` (+2, -14)
- `packages/desktop/src/preload/types.ts` (+1, -7)
- `packages/desktop/src/renderer/html.test.ts` (+1, -1)
- `packages/desktop/src/renderer/index.tsx` (+1, -1)
- `packages/desktop/src/renderer/loading.html` (+0, -21)
- `packages/desktop/src/renderer/loading.tsx` (+0, -83)
- `packages/effect-drizzle-sqlite/src/effect-sqlite/session.ts` (+33, -29)
- `packages/effect-drizzle-sqlite/test/sqlite.test.ts` (+33, -0)
- `packages/opencode/BUN_SHELL_MIGRATION_PLAN.md` (+3, -3)
- `packages/opencode/package.json` (+0, -19)
- `packages/opencode/script/schema.ts` (+2, -1)
- `packages/opencode/specs/effect/facades.md` (+4, -4)
- `packages/opencode/specs/effect/guide.md` (+2, -2)
- `packages/opencode/specs/effect/loose-ends.md` (+1, -1)
- `packages/opencode/specs/effect/migration.md` (+1, -1)
- `packages/opencode/specs/effect/todo.md` (+3, -3)
- `packages/opencode/specs/effect/tools.md` (+3, -3)
- `packages/opencode/src/acp/content.ts` (+3, -3)
- `packages/opencode/src/acp/tool.ts` (+0, -4)
- `packages/opencode/src/auth/index.ts` (+3, -3)
- `packages/opencode/src/background/job.ts` (+124, -47)
- `packages/opencode/src/cli/cmd/acp.ts` (+2, -2)
- `packages/opencode/src/cli/cmd/agent.ts` (+4, -3)
- `packages/opencode/src/cli/cmd/debug/agent.handler.ts` (+193, -0)
- `packages/opencode/src/cli/cmd/debug/agent.ts` (+7, -188)
- `packages/opencode/src/cli/cmd/debug/config.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/debug/file.ts` (+14, -17)
- `packages/opencode/src/cli/cmd/debug/index.ts` (+2, -2)
- `packages/opencode/src/cli/cmd/debug/ripgrep.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/debug/scrap.ts` (+3, -4)
- `packages/opencode/src/cli/cmd/export.ts` (+5, -5)
- `packages/opencode/src/cli/cmd/generate.ts` (+4, -2)
- `packages/opencode/src/cli/cmd/github.handler.ts` (+1593, -0)
- `packages/opencode/src/cli/cmd/github.shared.ts` (+30, -0)
- `packages/opencode/src/cli/cmd/github.ts` (+18, -1629)
- `packages/opencode/src/cli/cmd/import.ts` (+7, -7)
- `packages/opencode/src/cli/cmd/mcp.ts` (+9, -8)
- `packages/opencode/src/cli/cmd/models.ts` (+1, -2)
- `packages/opencode/src/cli/cmd/run.ts` (+10, -16)
- `packages/opencode/src/cli/cmd/run/footer.ts` (+4, -0)
- `packages/opencode/src/cli/cmd/run/footer.view.tsx` (+37, -23)
- `packages/opencode/src/cli/cmd/run/variant.shared.ts` (+5, -5)
- `packages/opencode/src/cli/cmd/serve.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/session.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/attach.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/component/prompt/autocomplete.tsx` (+1, -3)
- `packages/opencode/src/cli/cmd/tui/config/tui-schema.ts` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/config/tui.ts` (+3, -3)
- `packages/opencode/src/cli/cmd/tui/context/sync.tsx` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/sidebar/files.tsx` (+8, -1)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/system/diff-viewer.tsx` (+10, -6)
- `packages/opencode/src/cli/cmd/tui/plugin/runtime.ts` (+3, -2)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+7, -3)
- `packages/opencode/src/cli/cmd/tui/thread.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/util/clipboard.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/web.ts` (+1, -1)
- `packages/opencode/src/cli/effect-cmd.ts` (+5, -3)
- `packages/opencode/src/cli/network.ts` (+4, -2)
- `packages/opencode/src/config/agent.ts` (+6, -98)
- `packages/opencode/src/config/command.ts` (+4, -14)
- `packages/opencode/src/config/config.ts` (+17, -226)
- `packages/opencode/src/config/markdown.ts` (+1, -7)
- `packages/opencode/src/config/model-id.ts` (+0, -5)
- `packages/opencode/src/config/parse.ts` (+1, -1)
- `packages/opencode/src/config/paths.ts` (+3, -3)
- `packages/opencode/src/config/plugin.ts` (+9, -14)
- `packages/opencode/src/config/reference.ts` (+3, -24)
- `packages/opencode/src/config/variable.ts` (+1, -1)
- `packages/opencode/src/control-plane/workspace.ts` (+3, -3)
- `packages/opencode/src/effect/app-runtime.ts` (+3, -11)
- `packages/opencode/src/effect/bootstrap-runtime.ts` (+0, -4)
- `packages/opencode/src/effect/runtime-flags.ts` (+1, -1)
- `packages/opencode/src/file/index.ts` (+0, -654)
- `packages/opencode/src/file/watcher.ts` (+0, -172)
- `packages/opencode/src/format/formatter.ts` (+1, -1)
- `packages/opencode/src/image/image.ts` (+3, -3)
- `packages/opencode/src/index.ts` (+0, -44)
- `packages/opencode/src/installation/index.ts` (+8, -1)
- `packages/opencode/src/lsp/server.ts` (+1, -1)
- `packages/opencode/src/mcp/auth.ts` (+3, -6)
- `packages/opencode/src/mcp/index.ts` (+15, -14)
- `packages/opencode/src/node.ts` (+0, -1)
- `packages/opencode/src/patch/index.ts` (+4, -4)
- `packages/opencode/src/plugin/loader.ts` (+3, -2)
- `packages/opencode/src/project/bootstrap.ts` (+1, -7)
- `packages/opencode/src/project/instance-context.ts` (+3, -3)
- `packages/opencode/src/project/instance-store.ts` (+4, -4)
- `packages/opencode/src/project/project.ts` (+48, -6)
- `packages/opencode/src/project/vcs.ts` (+3, -3)
- `packages/opencode/src/provider/provider.ts` (+5, -4)
- `packages/opencode/src/provider/transform.ts` (+1, -25)
- `packages/opencode/src/pty-preparation.ts` (+30, -0)
- `packages/opencode/src/reference/reference.ts` (+7, -7)
- `packages/opencode/src/reference/repository-cache.ts` (+5, -5)
- `packages/opencode/src/server/routes/instance/httpapi/api.ts` (+2, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/config.ts` (+4, -3)
- `packages/opencode/src/server/routes/instance/httpapi/groups/file.ts` (+47, -5)
- `packages/opencode/src/server/routes/instance/httpapi/groups/global.ts` (+4, -3)
- `packages/opencode/src/server/routes/instance/httpapi/groups/mcp.ts` (+2, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/permission.ts` (+4, -4)
- `packages/opencode/src/server/routes/instance/httpapi/groups/project-copy.ts` (+67, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/project.ts` (+11, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/pty.ts` (+3, -3)
- `packages/opencode/src/server/routes/instance/httpapi/groups/session.ts` (+12, -12)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/fs.ts` (+5, -3)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/location.ts` (+8, -2)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/file.ts` (+54, -14)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/permission.ts` (+3, -3)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/project-copy.ts` (+53, -0)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/project.ts` (+11, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/pty.ts` (+83, -42)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/session.ts` (+5, -5)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2/fs.ts` (+3, -3)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+11, -11)
- `packages/opencode/src/server/shared/ui.ts` (+4, -4)
- `packages/opencode/src/session/compaction.ts` (+22, -23)
- `packages/opencode/src/session/instruction.ts` (+13, -13)
- `packages/opencode/src/session/llm.ts` (+5, -5)
- `packages/opencode/src/session/llm/request.ts` (+4, -4)
- `packages/opencode/src/session/message-v2.ts` (+6, -6)
- `packages/opencode/src/session/overflow.ts` (+5, -4)
- `packages/opencode/src/session/processor.ts` (+21, -21)
- `packages/opencode/src/session/prompt.ts` (+57, -57)
- `packages/opencode/src/session/prompt/reference.ts` (+3, -5)
- `packages/opencode/src/session/reminders.ts` (+4, -4)
- `packages/opencode/src/session/retry.ts` (+5, -5)
- `packages/opencode/src/session/revert.ts` (+4, -4)
- `packages/opencode/src/session/run-state.ts` (+14, -14)
- `packages/opencode/src/session/session.ts` (+35, -38)
- `packages/opencode/src/session/summary.ts` (+3, -5)
- `packages/opencode/src/session/tools.ts` (+3, -3)
- `packages/opencode/src/shell/shell.ts` (+1, -1)
- `packages/opencode/src/skill/discovery.ts` (+80, -81)
- `packages/opencode/src/skill/index.ts` (+6, -7)
- `packages/opencode/src/skill/prompt/customize-opencode.md` (+3, -4)
- `packages/opencode/src/snapshot/index.ts` (+624, -627)
- `packages/opencode/src/storage/json-migration.ts` (+0, -409)
- `packages/opencode/src/storage/storage.ts` (+12, -16)
- `packages/opencode/src/util/bom.ts` (+3, -7)
- `packages/opencode/src/worktree/index.ts` (+4, -4)
- `packages/opencode/test/acp/tool.test.ts` (+0, -4)
- `packages/opencode/test/background/job.test.ts` (+69, -0)
- `packages/opencode/test/cli/cmd/tui/aggregate-failures.test.ts` (+2, -2)
- `packages/opencode/test/cli/effect-cmd-instance-als.test.ts` (+3, -3)
- `packages/opencode/test/cli/github-action.test.ts` (+6, -10)
- `packages/opencode/test/cli/help/__snapshots__/help-snapshots.test.ts.snap` (+1, -1)
- `packages/opencode/test/cli/run/footer.view.test.tsx` (+3, -2)
- `packages/opencode/test/cli/run/variant.shared.test.ts` (+8, -8)
- `packages/opencode/test/cli/tui/diff-viewer.test.tsx` (+27, -1)
- `packages/opencode/test/config/config.test.ts` (+53, -53)
- `packages/opencode/test/config/lsp.test.ts` (+3, -3)
- `packages/opencode/test/config/tui.test.ts` (+36, -36)
- `packages/opencode/test/control-plane/workspace.test.ts` (+2, -2)
- `packages/opencode/test/effect/runtime-flags.test.ts` (+1, -1)
- `packages/opencode/test/file/fsmonitor.test.ts` (+0, -73)
- `packages/opencode/test/file/ignore.test.ts` (+0, -10)
- `packages/opencode/test/file/index.test.ts` (+0, -872)
- `packages/opencode/test/file/path-traversal.test.ts` (+0, -185)
- `packages/opencode/test/file/watcher.test.ts` (+0, -349)
- `packages/opencode/test/filesystem/filesystem.test.ts` (+32, -32)
- `packages/opencode/test/fixture/config.ts` (+1, -1)
- `packages/opencode/test/fixture/fixture.ts` (+6, -5)
- `packages/opencode/test/fixture/workspace.ts` (+2, -2)
- `packages/opencode/test/installation/installation.test.ts` (+19, -2)
- `packages/opencode/test/lib/cli-process.ts` (+3, -3)
- `packages/opencode/test/lib/effect.ts` (+2, -1)
- `packages/opencode/test/mcp/auth.test.ts` (+7, -7)
- `packages/opencode/test/mcp/oauth-auto-connect.test.ts` (+2, -2)
- `packages/opencode/test/mcp/oauth-browser.test.ts` (+2, -2)
- `packages/opencode/test/patch/patch.test.ts` (+2, -2)
- `packages/opencode/test/permission-task.test.ts` (+3, -3)
- `packages/opencode/test/plugin/auth-override.test.ts` (+3, -3)
- `packages/opencode/test/plugin/loader-shared.test.ts` (+9, -11)
- `packages/opencode/test/plugin/trigger.test.ts` (+2, -2)
- `packages/opencode/test/plugin/workspace-adapter.test.ts` (+3, -3)
- `packages/opencode/test/project/project-directory.test.ts` (+169, -0)
- `packages/opencode/test/project/project.test.ts` (+6, -3)
- `packages/opencode/test/project/vcs.test.ts` (+6, -6)
- `packages/opencode/test/project/worktree.test.ts` (+3, -3)
- `packages/opencode/test/provider/header-timeout.test.ts` (+2, -2)
- `packages/opencode/test/provider/model-status.test.ts` (+2, -2)
- `packages/opencode/test/provider/provider.test.ts` (+2, -2)
- `packages/opencode/test/provider/transform.test.ts` (+0, -82)
- `packages/opencode/test/pty/pty-output-isolation.test.ts` (+0, -162)
- `packages/opencode/test/pty/pty-session.test.ts` (+0, -140)
- `packages/opencode/test/pty/pty-shell.test.ts` (+42, -15)
- `packages/opencode/test/reference/reference.test.ts` (+11, -11)
- `packages/opencode/test/server/httpapi-error-middleware.test.ts` (+2, -2)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+35, -0)
- `packages/opencode/test/server/httpapi-exercise/runner.ts` (+6, -5)
- `packages/opencode/test/server/httpapi-exercise/types.ts` (+5, -4)
- `packages/opencode/test/server/httpapi-file.test.ts` (+1, -1)
- `packages/opencode/test/server/httpapi-instance-route-auth.test.ts` (+1, -1)
- `packages/opencode/test/server/httpapi-instance.test.ts` (+2, -2)
- `packages/opencode/test/server/httpapi-mcp.test.ts` (+4, -9)
- `packages/opencode/test/server/httpapi-provider.test.ts` (+6, -6)
- `packages/opencode/test/server/httpapi-pty.test.ts` (+19, -2)
- `packages/opencode/test/server/httpapi-public-openapi.test.ts` (+19, -1)
- `packages/opencode/test/server/httpapi-sdk.test.ts` (+10, -9)
- `packages/opencode/test/server/httpapi-session.test.ts` (+6, -6)
- `packages/opencode/test/server/httpapi-ui.test.ts` (+10, -10)
- `packages/opencode/test/server/project-copy.test.ts` (+88, -0)
- `packages/opencode/test/server/project-init-git.test.ts` (+3, -5)
- `packages/opencode/test/server/session-diff-missing-patch.test.ts` (+2, -2)
- `packages/opencode/test/server/session-messages.test.ts` (+7, -7)
- `packages/opencode/test/session/compaction.test.ts` (+7, -6)
- `packages/opencode/test/session/instruction.test.ts` (+4, -4)
- `packages/opencode/test/session/llm-native-recorded.test.ts` (+9, -8)
- `packages/opencode/test/session/llm.test.ts` (+23, -18)
- `packages/opencode/test/session/message-v2.test.ts` (+87, -87)
- `packages/opencode/test/session/messages-pagination.test.ts` (+17, -17)
- `packages/opencode/test/session/processor-effect.test.ts` (+23, -25)
- `packages/opencode/test/session/prompt.test.ts` (+25, -24)
- `packages/opencode/test/session/retry.test.ts` (+31, -31)
- `packages/opencode/test/session/revert-compact.test.ts` (+4, -4)
- `packages/opencode/test/session/session.test.ts` (+6, -6)
- `packages/opencode/test/session/snapshot-tool-race.test.ts` (+6, -6)
- `packages/opencode/test/session/structured-output-integration.test.ts` (+2, -2)
- `packages/opencode/test/session/structured-output.test.ts` (+9, -9)
- `packages/opencode/test/shell/shell.test.ts` (+1, -1)
- `packages/opencode/test/skill/discovery.test.ts` (+5, -5)
- `packages/opencode/test/skill/skill.test.ts` (+3, -3)
- `packages/opencode/test/snapshot/snapshot.test.ts` (+7, -7)
- `packages/opencode/test/storage/json-migration.test.ts` (+0, -856)
- `packages/opencode/test/storage/storage.test.ts` (+13, -13)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+191, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+708, -556)
- `packages/sdk/openapi.json` (+1973, -1606)
- `packages/stats/app/src/routes/index.css` (+133, -1)
- `packages/stats/app/src/routes/index.tsx` (+118, -9)
- `packages/ui/src/components/apply-patch-file.test.ts` (+1, -0)
- `packages/ui/src/components/list.css` (+1, -1)
- `packages/ui/src/components/select-v2.css` (+0, -87)
- `packages/ui/src/components/select-v2.stories.tsx` (+0, -22)
- `packages/ui/src/components/select-v2.tsx` (+0, -171)
- `packages/ui/src/components/session-diff.test.ts` (+24, -2)
- `packages/ui/src/components/session-diff.ts` (+57, -2)
- `packages/ui/src/v2/components/menu-v2.css` (+12, -12)
- `packages/ui/src/v2/components/select-v2.css` (+104, -14)
- `packages/ui/src/v2/components/select-v2.stories.tsx` (+3, -2)
- `packages/ui/src/v2/components/select-v2.tsx` (+16, -4)
- `patches/@ai-sdk%2Fgoogle@3.0.73.patch` (+69, -0)
- `patches/pacote@21.5.0.patch` (+18, -0)
- `specs/storage/remove-opencode-db.md` (+1, -1)
- `sst.config.ts` (+1, -1)

### Key Diffs

#### packages/core/migration/20260602182828_add_project_directories/migration.sql
```diff
diff --git a/packages/core/migration/20260602182828_add_project_directories/migration.sql b/packages/core/migration/20260602182828_add_project_directories/migration.sql
new file mode 100644
index 0000000..0ab2970
--- /dev/null
+++ b/packages/core/migration/20260602182828_add_project_directories/migration.sql
@@ -0,0 +1,8 @@
+CREATE TABLE `project_directory` (
+	`project_id` text NOT NULL,
+	`directory` text NOT NULL,
+	`type` text NOT NULL,
+	`time_created` integer NOT NULL,
+	CONSTRAINT `project_directory_pk` PRIMARY KEY(`project_id`, `directory`),
+	CONSTRAINT `fk_project_directory_project_id_project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON DELETE CASCADE
+);
```

#### packages/core/migration/20260602182828_add_project_directories/snapshot.json
```diff
diff --git a/packages/core/migration/20260602182828_add_project_directories/snapshot.json b/packages/core/migration/20260602182828_add_project_directories/snapshot.json
new file mode 100644
index 0000000..c96598c
--- /dev/null
+++ b/packages/core/migration/20260602182828_add_project_directories/snapshot.json
@@ -0,0 +1,1664 @@
+{
+  "version": "7",
+  "dialect": "sqlite",
+  "id": "80f2378a-ed35-45cb-9d3b-9f4837fac801",
+  "prevIds": ["7f4866d3-a95b-4141-bb59-28e31c521605", "80d6efb8-93fd-4ce5-b320-45a05aaebdd7"],
+  "ddl": [
+    {
+      "name": "workspace",
+      "entityType": "tables"
+    },
+    {
+      "name": "data_migration",
+      "entityType": "tables"
+    },
+    {
+      "name": "account_state",
+      "entityType": "tables"
+    },
+    {
+      "name": "account",
+      "entityType": "tables"
+    },
+    {
+      "name": "control_account",
+      "entityType": "tables"
+    },
+    {
+      "name": "event_sequence",
+      "entityType": "tables"
+    },
+    {
+      "name": "event",
+      "entityType": "tables"
+    },
+    {
+      "name": "permission",
+      "entityType": "tables"
+    },
+    {
+      "name": "project_directory",
+      "entityType": "tables"
+    },
+    {
+      "name": "project",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 2659589..eb4148e 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -8,6 +8,7 @@
   "scripts": {
     "db": "bun drizzle-kit",
     "migration": "bun run script/migration.ts",
+    "fix-node-pty": "bun run script/fix-node-pty.ts",
     "test": "bun test",
     "test:ci": "mkdir -p .artifacts/unit && bun test --timeout 30000 --reporter=junit --reporter-outfile=.artifacts/unit/junit.xml",
     "typecheck": "tsgo --noEmit"
@@ -23,6 +24,11 @@
       "bun": "./src/database/sqlite.bun.ts",
       "node": "./src/database/sqlite.node.ts",
       "default": "./src/database/sqlite.bun.ts"
+    },
+    "#pty": {
+      "bun": "./src/pty/pty.bun.ts",
+      "node": "./src/pty/pty.node.ts",
+      "default": "./src/pty/pty.bun.ts"
     }
   },
   "devDependencies": {
@@ -33,6 +39,15 @@
     "@types/npm-package-arg": "6.1.4",
     "@types/npmcli__arborist": "6.3.3",
     "@types/semver": "catalog:",
+    "@types/which": "3.0.4",
+    "@parcel/watcher-darwin-arm64": "2.5.1",
+    "@parcel/watcher-darwin-x64": "2.5.1",
+    "@parcel/watcher-linux-arm64-glibc": "2.5.1",
+    "@parcel/watcher-linux-arm64-musl": "2.5.1",
+    "@parcel/watcher-linux-x64-glibc": "2.5.1",
+    "@parcel/watcher-linux-x64-musl": "2.5.1",
+    "@parcel/watcher-win32-arm64": "2.5.1",
+    "@parcel/watcher-win32-x64": "2.5.1",
     "drizzle-kit": "catalog:"
   },
   "dependencies": {
@@ -60,6 +75,7 @@
     "@effect/opentelemetry": "catalog:",
     "@effect/platform-node": "catalog:",
     "@effect/sql-sqlite-bun": "catalog:",
+    "@lydell/node-pty": "catalog:",
     "@npmcli/arborist": "9.4.0",
     "@npmcli/config": "10.8.1",
     "@opencode-ai/effect-drizzle-sqlite": "workspace:*",
@@ -68,21 +84,26 @@
     "@opentelemetry/context-async-hooks": "2.6.1",
```

#### packages/core/script/migration.ts
```diff
diff --git a/packages/core/script/migration.ts b/packages/core/script/migration.ts
index 5a8fb64..d8d0f65 100644
--- a/packages/core/script/migration.ts
+++ b/packages/core/script/migration.ts
@@ -5,18 +5,28 @@ import fs from "fs/promises"
 import os from "os"
 import path from "path"
 import { pathToFileURL } from "url"
+import { parseArgs } from "util"
 
 const root = path.resolve(import.meta.dirname, "../../..")
 const sqlDir = path.join(root, "packages/core/migration")
 const tsDir = path.join(root, "packages/core/src/database/migration")
 const registry = path.join(root, "packages/core/src/database/migration.gen.ts")
+const args = parseArgs({
+  args: process.argv.slice(2),
+  options: {
+    check: { type: "boolean" },
+    name: { type: "string" },
+  },
+})
 
-if (Bun.argv.includes("--check")) {
+if (args.values.check) {
   await check()
   process.exit(0)
 }
 
-await $`bun drizzle-kit generate`.cwd(path.join(root, "packages/core"))
+await $`bun drizzle-kit generate ${args.values.name ? ["--name", args.values.name] : []}`.cwd(
+  path.join(root, "packages/core"),
+)
 
 const sqlMigrations = (await Array.fromAsync(new Bun.Glob("*/migration.sql").scan({ cwd: sqlDir })))
   .map((file) => file.split("/")[0])
```

#### packages/core/src/auth.ts
```diff
diff --git a/packages/core/src/auth.ts b/packages/core/src/auth.ts
index a3c97bc..f5f23c6 100644
--- a/packages/core/src/auth.ts
+++ b/packages/core/src/auth.ts
@@ -5,7 +5,7 @@ import { Effect, Layer, Option, Schema, Context, SynchronizedRef } from "effect"
 import { Identifier } from "./util/identifier"
 import { NonNegativeInt, withStatics } from "./schema"
 import { Global } from "./global"
-import { AppFileSystem } from "./filesystem"
+import { FSUtil } from "./fs-util"
 import { EventV2 } from "./event"
 
 export const ID = Schema.String.pipe(
@@ -131,7 +131,7 @@ export class Service extends Context.Service<Service, Interface>()("@opencode/v2
 export const layer = Layer.effect(
   Service,
   Effect.gen(function* () {
-    const fsys = yield* AppFileSystem.Service
+    const fsys = yield* FSUtil.Service
     const global = yield* Global.Service
     const events = yield* EventV2.Service
     const file = path.join(global.data, "account.json")
@@ -334,7 +334,7 @@ export const layer = Layer.effect(
 )
 
 export const defaultLayer = layer.pipe(
-  Layer.provide(AppFileSystem.defaultLayer),
+  Layer.provide(FSUtil.defaultLayer),
   Layer.provide(Global.defaultLayer),
   Layer.provide(EventV2.defaultLayer),
 )
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/src/agent/agent.ts
- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/src/agent/prompt/scout.txt
- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/src/agent/subagent-permissions.ts
- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/test/agent/agent.test.ts
- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/test/agent/plan-mode-subagent-bypass.test.ts
- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/test/agent/plugin-agent-regression.test.ts
- `src/core/` - review core changes from packages/core/package.json
- `src/tool/apply_patch.test.ts` - update based on opencode packages/opencode/test/tool/apply_patch.test.ts changes
- `src/tool/apply_patch.ts` - update based on opencode packages/opencode/src/tool/apply_patch.ts changes
- `src/tool/edit.test.ts` - update based on opencode packages/opencode/test/tool/edit.test.ts changes
- `src/tool/edit.ts` - update based on opencode packages/opencode/src/tool/edit.ts changes
- `src/tool/external-directory.test.ts` - update based on opencode packages/opencode/test/tool/external-directory.test.ts changes
- `src/tool/external-directory.ts` - update based on opencode packages/opencode/src/tool/external-directory.ts changes
- `src/tool/glob.test.ts` - update based on opencode packages/opencode/test/tool/glob.test.ts changes
- `src/tool/glob.ts` - update based on opencode packages/opencode/src/tool/glob.ts changes
- `src/tool/grep.test.ts` - update based on opencode packages/opencode/test/tool/grep.test.ts changes
- `src/tool/grep.ts` - update based on opencode packages/opencode/src/tool/grep.ts changes
- `src/tool/lsp.test.ts` - update based on opencode packages/opencode/test/tool/lsp.test.ts changes
- `src/tool/lsp.ts` - update based on opencode packages/opencode/src/tool/lsp.ts changes
- `src/tool/plan.ts` - update based on opencode packages/opencode/src/tool/plan.ts changes
- `src/tool/read.test.ts` - update based on opencode packages/opencode/test/tool/read.test.ts changes
- `src/tool/read.ts` - update based on opencode packages/opencode/src/tool/read.ts changes
- `src/tool/registry.test.ts` - update based on opencode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on opencode packages/opencode/src/tool/registry.ts changes
- `src/tool/repo_clone.test.ts` - update based on opencode packages/opencode/test/tool/repo_clone.test.ts changes
- `src/tool/repo_clone.ts` - update based on opencode packages/opencode/src/tool/repo_clone.ts changes
- `src/tool/repo_clone.txt.ts` - update based on opencode packages/opencode/src/tool/repo_clone.txt changes
- `src/tool/repo_overview.test.ts` - update based on opencode packages/opencode/test/tool/repo_overview.test.ts changes
- `src/tool/repo_overview.ts` - update based on opencode packages/opencode/src/tool/repo_overview.ts changes
- `src/tool/repo_overview.txt.ts` - update based on opencode packages/opencode/src/tool/repo_overview.txt changes
- `src/tool/shell.test.ts` - update based on opencode packages/opencode/test/tool/shell.test.ts changes
- `src/tool/shell.ts` - update based on kilocode packages/opencode/src/tool/shell.ts changes
- `src/tool/shell.ts` - update based on opencode packages/opencode/src/tool/shell.ts changes
- `src/tool/skill.test.ts` - update based on opencode packages/opencode/test/tool/skill.test.ts changes
- `src/tool/skill.ts` - update based on opencode packages/opencode/src/tool/skill.ts changes
- `src/tool/task.test.ts` - update based on opencode packages/opencode/test/tool/task.test.ts changes
- `src/tool/task.ts` - update based on opencode packages/opencode/src/tool/task.ts changes
- `src/tool/tool.ts` - update based on opencode packages/opencode/src/tool/tool.ts changes
- `src/tool/truncate.ts` - update based on opencode packages/opencode/src/tool/truncate.ts changes
- `src/tool/truncation.test.ts` - update based on opencode packages/opencode/test/tool/truncation.test.ts changes
- `src/tool/write.test.ts` - update based on opencode packages/opencode/test/tool/write.test.ts changes
- `src/tool/write.ts` - update based on opencode packages/opencode/src/tool/write.ts changes
