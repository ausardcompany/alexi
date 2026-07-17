# Upstream Changes Report
Generated: 2026-07-17 08:10:49

## Summary
- kilocode: 46 commits, 191 files changed
- opencode: 19 commits, 120 files changed

## kilocode Changes (a0ffa3ed0..957ddf11b)

### Commits

- 957ddf11b - Merge pull request #12263 from shssoichiro/fix/indexing-validation-timeout-retries (Marius, 2026-07-17)
- f85724830 - fix(ui): support bidirectional chat markdown (#11944) (Mohammad Javad Naderi, 2026-07-17)
- 6bbccbfcc - Merge pull request #12296 from Kilo-Org/fix/vscode-typecheck-workspace-errors (Joshua Lambert, 2026-07-16)
- df9e1fb1e - feat(cli): support remote slash commands and session creation (#12224) (Igor Šćekić, 2026-07-17)
- a16385389 - test(vscode): remove typecheck wiring guard (Josh Lambert, 2026-07-16)
- d7551e77b - ci(vscode): align typecheck with release build (Josh Lambert, 2026-07-16)
- 9ac93a4c9 - release: v7.4.11 (kilo-maintainer[bot], 2026-07-16)
- 306973789 - Merge pull request #12289 from Kilo-Org/fix-ts-findlast-compatibility (Joshua Lambert, 2026-07-16)
- b6472fe4e - fix(gateway): support ES2022 metadata consumers (Josh Lambert, 2026-07-16)
- bb7592874 - fix(vscode): group context controls in task header and use distinct icons (#12287) (Johnny Eric Amancio, 2026-07-16)
- 64713d481 - Merge pull request #12251 from Kilo-Org/chore/jetbrains-cli-pin-v7.4.9 (Kirill Kalishev, 2026-07-16)
- 1b1a0b655 - refactor(jetbrains): dedupe session dto mapping (kirillk, 2026-07-16)
- 456f86d10 - refactor(indexing): centralize validation deadline policy (Josh Holmer, 2026-07-16)
- 9fa2e1870 - fix(vscode): prevent question submission freeze (#12285) (Marius, 2026-07-16)
- f6ec8b87f - fix(jetbrains): handle upstream OpenAPI changes (kirillk, 2026-07-16)
- 30e7ec4ab - feat(memory): improve extension UX and activity details (#12254) (Johnny Eric Amancio, 2026-07-16)
- 5180c10c4 - fix: show messages after reverting and resubmitting (#12274) (Marius, 2026-07-16)
- e084ab749 - feat(cli): improve memory CLI UX (#12255) (Johnny Eric Amancio, 2026-07-16)
- 88afe3d3c - fix(cli): clean test runner temp environments (#12232) (dengbushi, 2026-07-16)
- 0b5ad0f8e - ci: guard Kilo-only workflows in forks (#11210) (matt wilkie, 2026-07-16)
- c6e64deef - Merge pull request #12233 from Kilo-Org/fix/gateway-stream-metadata (Christiaan Arnoldus, 2026-07-16)
- bd6915813 - feat(memory): add verbose flag and marker content snippets (#12250) (Johnny Eric Amancio, 2026-07-16)
- 55070b784 - Merge pull request #12252 from Kilo-Org/fix-issue-12241 (Marius, 2026-07-16)
- 08e5132c8 - Merge pull request #12267 from Kilo-Org/investigate-premature-stop-issue (Marius, 2026-07-16)
- 982503868 - Merge pull request #12103 from Githubguy132010/fix/chat-autoscroll-wheel-11485 (Marius, 2026-07-16)
- 904eed2cb - Merge branch 'main' into fix/chat-autoscroll-wheel-11485 (Marius, 2026-07-16)
- c021ced1a - Merge branch 'main' into fix/gateway-stream-metadata (Christiaan Arnoldus, 2026-07-16)
- c00b298ca - merge: sync main into directory mention fix (marius-kilocode, 2026-07-16)
- 9c57681a6 - test(cli): relax Windows permission timing (marius-kilocode, 2026-07-16)
- 0b715134a - fix(cli): derive incomplete retry bound (marius-kilocode, 2026-07-16)
- d1ccb227d - Merge branch 'main' into investigate-premature-stop-issue (Marius, 2026-07-16)
- 2de8e7316 - refactor(gateway): use AI SDK model middleware (chrarnoldus, 2026-07-16)
- e3124d314 - fix(cli): retry empty incomplete responses (marius-kilocode, 2026-07-16)
- ff703fba6 - fix(indexing): allow validation timeout retries (Josh Holmer, 2026-07-16)
- e67635d27 - fix(cli): restore directory @-mention expansion (marius-kilocode, 2026-07-15)
- f5456d56c - chore(jetbrains): bump CLI pin to v7.4.9 (kilo-maintainer[bot], 2026-07-15)
- e89ade85c - perf(gateway): skip irrelevant stream validation (chrarnoldus, 2026-07-15)
- 60a5daec9 - refactor(gateway): validate stream metadata with zod (chrarnoldus, 2026-07-15)
- 9aa7e7e53 - refactor(gateway): remove dead metadata paths (chrarnoldus, 2026-07-15)
- fa35813ee - fix(gateway): preserve OpenRouter stream metadata (chrarnoldus, 2026-07-15)
- 65862c1cd - Merge branch 'main' into fix/chat-autoscroll-wheel-11485 (Thomas Brugman, 2026-07-15)
- 319f159ac - fix(gateway): surface routed model and cost (chrarnoldus, 2026-07-15)
- d64f97f05 - Merge branch 'main' into fix/chat-autoscroll-wheel-11485 (Thomas Brugman, 2026-07-13)
- 4a26faf0e - Merge branch 'main' into fix/chat-autoscroll-wheel-11485 (Thomas Brugman, 2026-07-13)
- 7a15c3d39 - Merge branch 'main' into fix/chat-autoscroll-wheel-11485 (Thomas Brugman, 2026-07-13)
- 9fa8a13e2 - fix(ui): preserve auto-scroll pause after wheel up (Thomas Brugman, 2026-07-10)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/read.ts` (+10, -1)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)

#### Other Changes
- `.changeset/chat-bidi-text.md` (+5, -0)
- `.changeset/fast-local-recall.md` (+0, -5)
- `.changeset/grok-4.5-reasoning-variants.md` (+0, -5)
- `.changeset/jetbrains-custom-provider-edit.md` (+0, -5)
- `.changeset/jetbrains-custom-provider-inline-errors.md` (+0, -5)
- `.changeset/jetbrains-model-picker-close-button.md` (+0, -5)
- `.changeset/jetbrains-providers-list-actions.md` (+0, -5)
- `.changeset/remote-embedders-retry-timeouts.md` (+5, -0)
- `.changeset/remote-session-slash-commands.md` (+5, -0)
- `.github/workflows/auto-docs.yml` (+3, -0)
- `.github/workflows/check-org-member.yml` (+1, -1)
- `.github/workflows/codeql-kotlin.yml` (+1, -0)
- `.github/workflows/codeql.yml` (+1, -0)
- `.github/workflows/containers.yml` (+1, -0)
- `.github/workflows/disabled/duplicate-issues.yml.disabled` (+1, -1)
- `.github/workflows/docs-build.yml` (+1, -1)
- `.github/workflows/publish.yml` (+1, -1)
- `.github/workflows/test-vscode.yml` (+1, -1)
- `.github/workflows/test.yml` (+2, -2)
- `.github/workflows/typecheck.yml` (+1, -1)
- `.github/workflows/visual-regression.yml` (+3, -3)
- `.github/workflows/watch-opencode-releases.yml` (+1, -1)
- `bun.lock` (+26, -25)
- `package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-readable-1280-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-with-memory-200-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-with-memory-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-with-todos-chromium-linux.png` (+2, -2)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-gateway/src/gateway-metadata.ts` (+154, -0)
- `packages/kilo-gateway/src/provider.ts` (+3, -2)
- `packages/kilo-gateway/test/gateway-metadata.test.ts` (+243, -0)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-indexing/src/indexing/service-factory.ts` (+38, -20)
- `packages/kilo-indexing/test/kilocode/indexing/service-factory.test.ts` (+68, -0)
- `packages/kilo-jetbrains/CHANGELOG.md` (+12, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendSessionManager.kt` (+65, -35)
- `packages/kilo-jetbrains/build-tasks/src/main/kotlin/normalization/OpenApiSpecNormalizer.kt` (+35, -9)
- `packages/kilo-jetbrains/build-tasks/src/test/kotlin/normalization/OpenApiSpecNormalizerTest.kt` (+11, -0)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-memory/package.json` (+1, -1)
- `packages/kilo-memory/src/commands.ts` (+9, -2)
- `packages/kilo-memory/src/effect/events.ts` (+2, -0)
- `packages/kilo-memory/src/effect/httpapi.ts` (+2, -0)
- `packages/kilo-memory/src/effect/index.ts` (+2, -2)
- `packages/kilo-memory/src/effect/service.ts` (+24, -7)
- `packages/kilo-memory/src/marker-meta.ts` (+45, -3)
- `packages/kilo-memory/src/memory.ts` (+7, -1)
- `packages/kilo-memory/src/schema.ts` (+4, -0)
- `packages/kilo-memory/test/command-cases.json` (+20, -0)
- `packages/kilo-memory/test/commands.test.ts` (+1, -1)
- `packages/kilo-memory/test/core.test.ts` (+18, -1)
- `packages/kilo-memory/test/decisions.test.ts` (+80, -3)
- `packages/kilo-memory/test/effect-capture.test.ts` (+47, -1)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/icon.tsx` (+8, -0)
- `packages/kilo-ui/src/components/message-part.css` (+8, -0)
- `packages/kilo-ui/src/components/message-part.tsx` (+1, -1)
- `packages/kilo-ui/src/hooks/create-auto-scroll.test.tsx` (+37, -4)
- `packages/kilo-ui/src/hooks/create-auto-scroll.tsx` (+1, -1)
- `packages/kilo-ui/src/hooks/scroll-user-activity.ts` (+5, -1)
- `packages/kilo-vscode/CHANGELOG.md` (+26, -0)
- `packages/kilo-vscode/package.json` (+2, -3)
- `packages/kilo-vscode/src/KiloProvider.ts` (+2, -7)
- `packages/kilo-vscode/src/kilo-provider-utils.ts` (+1, -68)
- `packages/kilo-vscode/src/kilo-provider/memory.ts` (+8, -0)
- `packages/kilo-vscode/tests/fixtures/question-dock-disposal.tsx` (+74, -0)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-load-messages.test.ts` (+17, -9)
- `packages/kilo-vscode/tests/unit/kilo-provider-memory.test.ts` (+5, -2)
- `packages/kilo-vscode/tests/unit/kilo-provider-utils.test.ts` (+0, -111)
- `packages/kilo-vscode/tests/unit/memory-activity.test.ts` (+89, -0)
- `packages/kilo-vscode/tests/unit/memory-command.test.ts` (+2, -1)
- `packages/kilo-vscode/tests/unit/question-dock-disposal.test.ts` (+45, -0)
- `packages/kilo-vscode/tests/unit/revert-checkpoints.test.ts` (+2, -4)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+31, -106)
- `packages/kilo-vscode/webview-ui/agent-manager/UnassignedSessionsSection.tsx` (+109, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/AssistantMessage.tsx` (+18, -38)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/QuestionDock.tsx` (+3, -2)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskHeader.tsx` (+188, -85)
- `packages/kilo-vscode/webview-ui/src/components/chat/WelcomeEmptyState.tsx` (+3, -1)
- `packages/kilo-vscode/webview-ui/src/components/history/CloudSessionList.tsx` (+3, -1)
- `packages/kilo-vscode/webview-ui/src/components/history/SessionList.tsx` (+3, -1)
- `packages/kilo-vscode/webview-ui/src/components/settings/Settings.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/context/memory.tsx` (+107, -13)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+10, -10)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+10, -10)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+10, -10)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+10, -10)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+10, -10)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+10, -10)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+10, -10)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+10, -10)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+10, -10)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+10, -10)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+10, -10)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+10, -10)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+10, -10)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+10, -10)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+10, -10)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+10, -10)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+10, -10)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+10, -10)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+10, -10)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+10, -10)
- `packages/kilo-vscode/webview-ui/src/stories/chat.stories.tsx` (+62, -24)
- `packages/kilo-vscode/webview-ui/src/styles/task-header.css` (+156, -20)
- `packages/kilo-vscode/webview-ui/src/types/messages/memory.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/utils/memory-activity.ts` (+45, -0)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+31, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/script/test-runner.ts` (+54, -10)
- `packages/opencode/src/cli/cmd/tui/component/prompt/index.tsx` (+1, -0)
- `packages/opencode/src/cli/cmd/tui/context/sync.tsx` (+1, -3)
- `packages/opencode/src/cli/cmd/tui/plugin/internal.ts` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+11, -2)
- `packages/opencode/src/cli/cmd/tui/thread.ts` (+58, -23)
- `packages/opencode/src/cli/cmd/tui/worker.ts` (+12, -0)
- `packages/opencode/src/kilo-sessions/attached-state.ts` (+194, -0)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+42, -12)
- `packages/opencode/src/kilo-sessions/remote-command.ts` (+323, -0)
- `packages/opencode/src/kilo-sessions/remote-exit.ts` (+17, -0)
- `packages/opencode/src/kilo-sessions/remote-sender.ts` (+245, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/component/dialog-memory.tsx` (+56, -104)
- `packages/opencode/src/kilocode/cli/cmd/tui/component/memory-prompt.tsx` (+2, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/component/memory-sidebar.tsx` (+0, -150)
- `packages/opencode/src/kilocode/cli/cmd/tui/component/memory-status.tsx` (+160, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/memory-command.ts` (+38, -5)
- `packages/opencode/src/kilocode/cli/cmd/tui/memory-events.ts` (+19, -33)
- `packages/opencode/src/kilocode/cli/cmd/tui/memory-meta.ts` (+6, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/memory-state.ts` (+17, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/remote-exit-bridge.ts` (+30, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/remote-exit-rpc.ts` (+3, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/remote-exit-worker.ts` (+22, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/routes/session/memory.tsx` (+65, -10)
- `packages/opencode/src/kilocode/memory/marker.ts` (+4, -2)
- `packages/opencode/src/kilocode/plugins/{sidebar-memory.tsx => memory-status.tsx}` (+1, -1)
- `packages/opencode/src/kilocode/server/httpapi/handlers/memory.ts` (+6, -1)
- `packages/opencode/src/kilocode/session/index.ts` (+6, -20)
- `packages/opencode/src/kilocode/session/processor.ts` (+103, -2)
- `packages/opencode/src/kilocode/session/prompt.ts` (+11, -1)
- `packages/opencode/src/session/processor.ts` (+162, -69)
- `packages/opencode/test/kilocode/cli/cmd/tui/memory-command.test.ts` (+128, -25)
- `packages/opencode/test/kilocode/cli/cmd/tui/memory-status.test.tsx` (+249, -0)
- `packages/opencode/test/kilocode/cli/tui/remote-exit-bridge.test.ts` (+138, -0)
- `packages/opencode/test/kilocode/cli/tui/remote-exit-worker.test.ts` (+37, -0)
- `packages/opencode/test/kilocode/cli/tui/thread.test.ts` (+47, -1)
- `packages/opencode/test/kilocode/memory/memory-integration.test.ts` (+33, -1)
- `packages/opencode/test/kilocode/provider-cost.test.ts` (+1, -58)
- `packages/opencode/test/kilocode/server/httpapi-memory.test.ts` (+8, -2)
- `packages/opencode/test/kilocode/session-processor-incomplete-response-retry.test.ts` (+578, -0)
- `packages/opencode/test/kilocode/session-prompt-permission-refresh.test.ts` (+111, -0)
- `packages/opencode/test/kilocode/sessions/attached-state.test.ts` (+747, -0)
- `packages/opencode/test/kilocode/sessions/remote-command.test.ts` (+755, -0)
- `packages/opencode/test/kilocode/sessions/remote-exit.test.ts` (+42, -0)
- `packages/opencode/test/kilocode/sessions/remote-sender.test.ts` (+1199, -5)
- `packages/opencode/test/kilocode/test-runner-cleanup.test.ts` (+121, -0)
- `packages/opencode/test/kilocode/tui-sync-event.test.ts` (+74, -2)
- `packages/opencode/test/session/prompt.test.ts` (+2, -2)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+2, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+19, -0)
- `packages/sdk/openapi.json` (+27, -0)
- `packages/server/package.json` (+1, -1)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+2, -1)
- `packages/ui/src/components/markdown.css` (+8, -8)
- `packages/ui/src/components/markdown.tsx` (+1, -0)
- `packages/ui/src/components/message-part.tsx` (+1, -2)
- `packages/ui/src/context/marked.tsx` (+126, -111)
- `packages/ui/src/kilocode/markdown-bidi.test.ts` (+108, -0)
- `packages/ui/src/kilocode/markdown-stream-highlight.ts` (+3, -1)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 71258f03f..af410efcd 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.4.9",
+  "version": "7.4.11",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/opencode/src/tool/read.ts
```diff
diff --git a/packages/opencode/src/tool/read.ts b/packages/opencode/src/tool/read.ts
index d4813556c..905f63870 100644
--- a/packages/opencode/src/tool/read.ts
+++ b/packages/opencode/src/tool/read.ts
@@ -240,9 +240,18 @@ export const ReadTool = Tool.define<
           always: ["*"],
           metadata: {},
         })
+        // kilocode_change start - reject any canonical path change after permission approval
         if (ctx.extra?.["denyDirectory"] === true) {
-          return yield* Effect.fail(new Error(`Directory attachments cannot be expanded: ${requested}`))
+          // Re-resolve after permission approval to detect TOCTOU symlink swaps.
+          // If the canonical target changed, the approved permission no longer
+          // applies to the resolved path, so deny before listing.
+          const resolved2 = yield* fs.realPath(requested)
+          const target2 = process.platform === "win32" ? FSUtil.normalizePath(resolved2) : resolved2
+          if (target2 !== target) {
+            return yield* Effect.fail(new Error(`Directory attachments cannot be expanded: ${requested}`))
+          }
         }
+        // kilocode_change end
         const items = yield* list(target)
         const limit = Math.max(1, params.limit ?? DEFAULT_READ_LIMIT) // kilocode_change - prevent zero-limit loops
         const offset = params.offset || 1
```


## opencode Changes (1754480..3238daa)

### Commits

- 3238daa - Revert "chore: generate" (Frank, 2026-07-17)
- 90291fc - chore: generate (opencode-agent[bot], 2026-07-17)
- a414e06 - go: kimi k3 2x usage (Frank, 2026-07-17)
- 52f65f3 - feat(console): promote Kimi K3 usage limits (#37442) (opencode-agent[bot], 2026-07-17)
- 3a1c6df - fix(app): deduplicate diff summaries linearly (#37414) (Luke Parker, 2026-07-17)
- 4436678 - fix(desktop): guard destroyed recovery windows (#37406) (Luke Parker, 2026-07-17)
- 08fb473 - chore: generate (opencode-agent[bot], 2026-07-16)
- 5121352 - go: grok 4.5 and kimi k3 (Frank, 2026-07-16)
- 0bc9a28 - zen: cost multiplier (Frank, 2026-07-16)
- 1d2a7b4 - fix(console): persist desktop promo dismissal (#37121) (opencode-agent[bot], 2026-07-16)
- 453b61e - fix(stats): divide comparison sections (Adam, 2026-07-16)
- 95ebf50 - fix(provider): restore Azure Cognitive Services endpoints (#37340) (Aiden Cline, 2026-07-16)
- d8a1b93 - fix(stats): remove page gutter (Adam, 2026-07-16)
- 0c91e6a - fix(stats): refine comparison rendering (Adam, 2026-07-16)
- ef3b673 - sync release versions for v1.18.3 (opencode, 2026-07-16)
- c69abee - chore: generate (opencode-agent[bot], 2026-07-16)
- dc3ff4b - fix(app): home page scroll target (#36664) (Aarav Sareen, 2026-07-16)
- 958e08e - feat(app): cmd+k menu shows sessions on home page (#36686) (Aarav Sareen, 2026-07-16)
- 590a11e - fix(desktop): include wslServers loading in ready state (#37218) (Brendan Allan, 2026-07-16)

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
- `packages/console/core/src/model.ts` (+1, -0)
- `packages/core/package.json` (+1, -1)
- `packages/stats/core/package.json` (+1, -1)

#### Other Changes
- `.opencode/command/translate.md` (+1, -1)
- `bun.lock` (+28, -28)
- `packages/app/package.json` (+1, -1)
- `packages/app/src/components/command-palette.ts` (+90, -136)
- `packages/app/src/components/dialog-command-palette-v2.tsx` (+138, -16)
- `packages/app/src/components/settings-keybinds.tsx` (+1, -2)
- `packages/app/src/context/command.test.ts` (+15, -1)
- `packages/app/src/context/command.tsx` (+9, -2)
- `packages/app/src/i18n/ar.ts` (+1, -0)
- `packages/app/src/i18n/br.ts` (+1, -0)
- `packages/app/src/i18n/bs.ts` (+1, -0)
- `packages/app/src/i18n/da.ts` (+1, -0)
- `packages/app/src/i18n/de.ts` (+1, -0)
- `packages/app/src/i18n/en.ts` (+1, -0)
- `packages/app/src/i18n/es.ts` (+1, -0)
- `packages/app/src/i18n/fr.ts` (+1, -0)
- `packages/app/src/i18n/ja.ts` (+1, -0)
- `packages/app/src/i18n/ko.ts` (+1, -0)
- `packages/app/src/i18n/no.ts` (+1, -0)
- `packages/app/src/i18n/pl.ts` (+1, -0)
- `packages/app/src/i18n/ru.ts` (+1, -0)
- `packages/app/src/i18n/th.ts` (+1, -0)
- `packages/app/src/i18n/tr.ts` (+1, -0)
- `packages/app/src/i18n/uk.ts` (+1, -0)
- `packages/app/src/i18n/zh.ts` (+1, -0)
- `packages/app/src/i18n/zht.ts` (+1, -0)
- `packages/app/src/pages/home.tsx` (+210, -117)
- `packages/app/src/pages/new-session.tsx` (+11, -0)
- `packages/app/src/pages/session.tsx` (+10, -0)
- `packages/app/src/pages/session/timeline/rows.ts` (+3, -13)
- `packages/app/src/pages/session/timeline/summary-diffs.test.ts` (+42, -0)
- `packages/app/src/pages/session/timeline/summary-diffs.ts` (+20, -0)
- `packages/app/src/pages/session/use-session-commands.tsx` (+1, -1)
- `packages/app/test-browser/command-palette.test.ts` (+76, -0)
- `packages/cli/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/component/desktop-promo.tsx` (+14, -2)
- `packages/console/app/src/i18n/ar.ts` (+4, -4)
- `packages/console/app/src/i18n/br.ts` (+4, -4)
- `packages/console/app/src/i18n/da.ts` (+4, -4)
- `packages/console/app/src/i18n/de.ts` (+4, -4)
- `packages/console/app/src/i18n/en.ts` (+4, -4)
- `packages/console/app/src/i18n/es.ts` (+4, -4)
- `packages/console/app/src/i18n/fr.ts` (+4, -4)
- `packages/console/app/src/i18n/it.ts` (+4, -4)
- `packages/console/app/src/i18n/ja.ts` (+4, -4)
- `packages/console/app/src/i18n/ko.ts` (+4, -4)
- `packages/console/app/src/i18n/no.ts` (+4, -4)
- `packages/console/app/src/i18n/pl.ts` (+4, -4)
- `packages/console/app/src/i18n/ru.ts` (+4, -4)
- `packages/console/app/src/i18n/th.ts` (+4, -4)
- `packages/console/app/src/i18n/tr.ts` (+4, -4)
- `packages/console/app/src/i18n/uk.ts` (+4, -4)
- `packages/console/app/src/i18n/zh.ts` (+4, -4)
- `packages/console/app/src/i18n/zht.ts` (+4, -4)
- `packages/console/app/src/routes/go/index.css` (+2, -27)
- `packages/console/app/src/routes/go/index.tsx` (+35, -55)
- `packages/console/app/src/routes/workspace/[id]/go/lite-section.tsx` (+4, -2)
- `packages/console/app/src/routes/zen/util/handler.ts` (+7, -6)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/mail/package.json` (+1, -1)
- `packages/console/support/package.json` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/desktop/src/main/index.ts` (+2, -1)
- `packages/desktop/src/main/unresponsive.ts` (+2, -1)
- `packages/desktop/src/main/window-state.ts` (+29, -0)
- `packages/desktop/src/main/windows.ts` (+5, -9)
- `packages/desktop/src/renderer/index.tsx` (+2, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/enterprise/package.json` (+1, -1)
- `packages/function/package.json` (+1, -1)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/provider/provider.ts` (+4, -2)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/app/src/app.tsx` (+1, -1)
- `packages/stats/app/src/component/model-compare-detail.tsx` (+2, -3)
- `packages/stats/app/src/routes/[lab]/[model].tsx` (+0, -1)
- `packages/stats/app/src/routes/[lab]/index.tsx` (+0, -1)
- `packages/stats/app/src/routes/compare/index.tsx` (+0, -1)
- `packages/stats/app/src/routes/index.css` (+17, -11)
- `packages/stats/app/src/routes/index.tsx` (+0, -1)
- `packages/stats/server/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/components/scroll-view.css` (+1, -0)
- `packages/ui/src/components/scroll-view.test.ts` (+15, -0)
- `packages/ui/src/components/scroll-view.tsx` (+103, -25)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/ar/go.mdx` (+44, -23)
- `packages/web/src/content/docs/bs/go.mdx` (+45, -24)
- `packages/web/src/content/docs/da/go.mdx` (+45, -24)
- `packages/web/src/content/docs/de/go.mdx` (+44, -23)
- `packages/web/src/content/docs/es/go.mdx` (+45, -24)
- `packages/web/src/content/docs/fr/go.mdx` (+44, -23)
- `packages/web/src/content/docs/go.mdx` (+45, -24)
- `packages/web/src/content/docs/it/go.mdx` (+45, -24)
- `packages/web/src/content/docs/ja/go.mdx` (+44, -23)
- `packages/web/src/content/docs/ko/go.mdx` (+44, -23)
- `packages/web/src/content/docs/nb/go.mdx` (+45, -24)
- `packages/web/src/content/docs/pl/go.mdx` (+45, -24)
- `packages/web/src/content/docs/pt-br/go.mdx` (+45, -24)
- `packages/web/src/content/docs/ru/go.mdx` (+45, -24)
- `packages/web/src/content/docs/th/go.mdx` (+44, -23)
- `packages/web/src/content/docs/tr/go.mdx` (+44, -23)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+44, -23)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+44, -23)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 2532744..51636b6 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.18.2",
+  "version": "1.18.3",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/console/core/src/model.ts
```diff
diff --git a/packages/console/core/src/model.ts b/packages/console/core/src/model.ts
index 84de249..f4ac401 100644
--- a/packages/console/core/src/model.ts
+++ b/packages/console/core/src/model.ts
@@ -22,6 +22,7 @@ export namespace ZenData {
   const ModelSchema = z.object({
     name: z.string(),
     cost: ModelCostSchema,
+    costMultiplier: z.number().default(1),
     cost200K: ModelCostSchema.optional(),
     allowAnonymous: z.boolean().optional(),
     byokProvider: z.enum(["openai", "anthropic", "google"]).optional(),
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index eb5a037..34d37a8 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.18.2",
+  "version": "1.18.3",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/stats/core/package.json
```diff
diff --git a/packages/stats/core/package.json b/packages/stats/core/package.json
index 4d40971..d942879 100644
--- a/packages/stats/core/package.json
+++ b/packages/stats/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/stats-core",
-  "version": "1.18.2",
+  "version": "1.18.3",
   "private": true,
   "type": "module",
   "license": "MIT",
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/package.json
- `src/tool/read.ts` - update based on kilocode packages/opencode/src/tool/read.ts changes
