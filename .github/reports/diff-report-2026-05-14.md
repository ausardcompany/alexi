# Upstream Changes Report
Generated: 2026-05-14 08:39:02

## Summary
- kilocode: 58 commits, 143 files changed
- opencode: 94 commits, 317 files changed

## kilocode Changes (174d467a4..c60006514)

### Commits

- c60006514 - Merge pull request #10229 from Kilo-Org/oasis-maraca (Marius, 2026-05-14)
- 41e3cda97 - fix(vscode): keep worktree revert diffing local (marius-kilocode, 2026-05-14)
- 4656c671b - Merge pull request #10039 from Kilo-Org/convoy/wasteland-product-documentation/191b018d/head (John Fawcett, 2026-05-13)
- 53c83d29a - Merge pull request #10163 from Kilo-Org/disco-trapezoid (Kirill Kalishev, 2026-05-13)
- d649e2496 - chore(jetbrains): decode locale bundle unicode escapes (kirillk, 2026-05-13)
- 19988ccaa - fix(jetbrains): harden cloud history git remote lookup (kirillk, 2026-05-13)
- 4fc89dce6 - feat(jetbrains): add i18n locale bundles for 18 languages (kirillk, 2026-05-13)
- e4e3a3617 - Merge pull request #10218 from Kilo-Org/perpetual-parmesan (Marius, 2026-05-13)
- 5b333c93a - Merge branch 'main' into disco-trapezoid (Kirill Kalishev, 2026-05-13)
- d25f537a1 - feat(jetbrains): add cloud history repo-only filter (kirillk, 2026-05-13)
- a877f0d61 - fix(docs): replace dead troubleshooting links with wasteland overview (John Fawcett, 2026-05-13)
- 1acf0d7fe - Merge remote-tracking branch 'origin/main' into convoy/wasteland-product-documentation/191b018d/head (John Fawcett, 2026-05-13)
- b5b051b6a - Merge pull request #7201 from cbrunnkvist/feat/roll-call-command (Catriel Müller, 2026-05-13)
- 691b228b9 - fix(docs): hoist FitOnResize out of FlowDiagram render (John Fawcett, 2026-05-13)
- 7f6fe7fea - refactor: fix exit status code (Catriel Müller, 2026-05-13)
- 25ae09594 - docs(wasteland): polish diagrams and screenshots (John Fawcett, 2026-05-13)
- d541f851d - refactor: fix test (Catriel Müller, 2026-05-13)
- aab35c9d1 - refactor: fix test // typecheck (Catriel Müller, 2026-05-13)
- 4860e654c - feat: configure auto compaction threshold (marius-kilocode, 2026-05-13)
- dbf938841 - Merge branch 'main' into feat/roll-call-command (Catriel Müller, 2026-05-13)
- e8078b88b - refactor: fix test types (Catriel Müller, 2026-05-13)
- 54916e9c4 - refactor: address the comments (Catriel Müller, 2026-05-13)
- 2886183aa - refactor: move the command to the kilo folder (Catriel Müller, 2026-05-13)
- cdbae6c24 - Merge pull request #10165 from Kilo-Org/brian/addBotDocs (Brian Turcotte, 2026-05-13)
- d1a73a587 - fix(vscode): update custom provider docs link (#10208) (Marius, 2026-05-13)
- 177f7df04 - fix(vscode): reset todos on snapshot revert (#10206) (Marius, 2026-05-13)
- d21635c90 - docs: add issue template requirements and fix anchor links in CONTRIBUTING.md (#9266) (Vishal Kumar Singh, 2026-05-13)
- 937ef8ec7 - Merge pull request #10190 from Kilo-Org/alluring-pocket (Catriel Müller, 2026-05-13)
- 1ea86fb6e - fix(gateway): strip transient Responses item ids (#10197) (Marius, 2026-05-13)
- 14f5d3638 - Merge pull request #10198 from Kilo-Org/fix/cli-track-review-telemetry (Marian Alexandru Alecu, 2026-05-13)
- 4f13e8591 - fix(cli): track /review completions in telemetry (Alex Alecu, 2026-05-13)
- 25aae795a - fix(ui): avoid fetching provider icons during checks (Catriel Müller, 2026-05-12)
- 0026268d5 - fix(docs): add px unit to flowDiagram height to prevent CSS collapse (kiloconnect[bot], 2026-05-12)
- da1a4ad04 - docs(wasteland): add missing placeholder screenshot images (John Fawcett, 2026-05-12)
- 67b7d8d78 - docs(wasteland): add missing TODO(screenshots) comments to index.md (John Fawcett, 2026-05-12)
- 1d97a83f2 - docs: remove cross-repo section from GitHub page (Brian Turcotte, 2026-05-12)
- 95e3a6ae9 - docs: fix internal links to include /docs prefix (Brian Turcotte, 2026-05-11)
- b81349e5e - docs: fix internal links to use relative paths in slack page (Brian Turcotte, 2026-05-11)
- badd124c2 - docs: add Kilo Connect pages for Slack, GitHub, and Linear integrations (Brian Turcotte, 2026-05-11)
- 9a08ccf57 - fix(jetbrains): address history review gaps (kirillk, 2026-05-11)
- 0833ef422 - feat: support JetBrains history session actions (kirillk, 2026-05-11)
- 799ac4aee - fix: restore package-lock.json files to match main (John Fawcett, 2026-05-08)
- 957911cc7 - docs: verify and update wasteland workflow + admin pages (#10034) (John Fawcett, 2026-05-07)
- 111c48d8c - docs(wasteland): flesh out workflow.md and admin.md (John Fawcett, 2026-05-07)
- 4a352a198 - docs(wasteland): add Quick Start and Settings pages (#10033) (John Fawcett, 2026-05-07)
- 9c6250619 - docs(wasteland): flesh out quick-start and settings pages (John Fawcett, 2026-05-07)
- 7c46873b2 - docs(wasteland): Overview and Concepts pages (#10031) (John Fawcett, 2026-05-07)
- 297a0227b - feat(docs): add Wasteland Flow diagrams (#10030) (John Fawcett, 2026-05-07)
- 890211275 - docs(kilo-docs): scaffold Wasteland docs section + register in nav (#10028) (John Fawcett, 2026-05-07)
- 6be192ea8 - fix(cli): reject non-positive --timeout in roll-call (Conny Brunnkvist, 2026-04-08)
- 1536addc5 - fix(cli): escape pipes in markdown output and exit non-zero on bad regex (Conny Brunnkvist, 2026-04-08)
- aa0f60f0b - feat(cli): add markdown output mode and fix quiet/json interaction (Conny Brunnkvist, 2026-04-08)
- 81cc9f957 - fix(cli): also require text input capability in roll-call model filter (Conny Brunnkvist, 2026-04-08)
- 6b9634345 - fix(cli): exit non-zero when roll-call fails to test any models (Conny Brunnkvist, 2026-04-08)
- 658355ee7 - fix(cli): clarify roll-call tests text models only (Conny Brunnkvist, 2026-04-08)
- 5be559ff4 - fix(cli): skip non-text models in roll-call (Conny Brunnkvist, 2026-04-08)
- f9eb217e7 - fix(cli): validate --parallel and filter args in roll-call command (Conny Brunnkvist, 2026-04-08)
- f4141a3c9 - feat(cli): add roll-call command for batch-testing model connectivity (Conny Brunnkvist, 2026-04-08)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/task.ts` (+2, -0)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
(no changes)

#### Other Changes
- `.changeset/local-worktree-revert-diff.md` (+5, -0)
- `.changeset/manual-compact-limit.md` (+7, -0)
- `.changeset/reset-reverted-todos.md` (+5, -0)
- `.changeset/tame-responses-items.md` (+6, -0)
- `CONTRIBUTING.md` (+4, -15)
- `packages/kilo-docs/components/BrowserFrame/index.tsx` (+17, -1)
- `packages/kilo-docs/components/FlowDiagram/diagrams/claim-to-stamp.ts` (+213, -0)
- `packages/kilo-docs/components/FlowDiagram/diagrams/index.ts` (+6, -0)
- `packages/kilo-docs/components/FlowDiagram/diagrams/wanted-lifecycle.ts` (+144, -0)
- `packages/kilo-docs/components/FlowDiagram/diagrams/wasteland-federation.ts` (+186, -0)
- `packages/kilo-docs/components/FlowDiagram/index.tsx` (+54, -21)
- `packages/kilo-docs/lib/nav/code-with-ai.ts` (+15, -1)
- `packages/kilo-docs/pages/_app.tsx` (+2, -0)
- `packages/kilo-docs/pages/code-with-ai/gastown/wasteland/admin.md` (+334, -0)
- `packages/kilo-docs/pages/code-with-ai/gastown/wasteland/concepts.md` (+174, -0)
- `packages/kilo-docs/pages/code-with-ai/gastown/wasteland/index.md` (+73, -0)
- `packages/kilo-docs/pages/code-with-ai/gastown/wasteland/quick-start.md` (+139, -0)
- `packages/kilo-docs/pages/code-with-ai/gastown/wasteland/settings.md` (+155, -0)
- `packages/kilo-docs/pages/code-with-ai/gastown/wasteland/workflow.md` (+223, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/github.md` (+127, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/kilo-connect.md` (+28, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/linear.md` (+119, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/slack.md` (+83, -96)
- `packages/kilo-docs/pages/customize/context/context-condensing.md` (+19, -5)
- `packages/kilo-docs/previous-docs-redirects.js` (+6, -0)
- `packages/kilo-docs/public/img/gastown/wasteland/gt-bead-with-wasteland-link.png` (+-, --)
- `packages/kilo-docs/public/img/gastown/wasteland/gt-claim-detail-drawer.png` (+-, --)
- `packages/kilo-docs/public/img/gastown/wasteland/gt-mayor-claiming.png` (+-, --)
- `packages/kilo-docs/public/img/gastown/wasteland/gt-wasteland-connect-dialog.png` (+-, --)
- `packages/kilo-docs/public/img/gastown/wasteland/gt-wasteland-settings.png` (+-, --)
- `packages/kilo-docs/public/img/gastown/wasteland/wl-admin-review-inbox.png` (+-, --)
- `packages/kilo-docs/public/img/gastown/wasteland/wl-claim-drawer.png` (+-, --)
- `packages/kilo-docs/public/img/gastown/wasteland/wl-evidence-submitted.png` (+-, --)
- `packages/kilo-docs/public/img/gastown/wasteland/wl-post-form.png` (+-, --)
- `packages/kilo-docs/public/img/gastown/wasteland/wl-wanted-board.png` (+-, --)
- `packages/kilo-docs/source-links.md` (+2, -2)
- `packages/kilo-gateway/src/provider.ts` (+3, -0)
- `packages/kilo-gateway/src/responses.ts` (+49, -0)
- `packages/kilo-gateway/test/responses.test.ts` (+94, -0)
- `packages/kilo-jetbrains/backend/build.gradle.kts` (+1, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendSessionManager.kt` (+41, -8)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloCliDataParser.kt` (+8, -6)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloSessionRpcApiImpl.kt` (+5, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendSessionManagerTest.kt` (+157, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/GeneratedApiModelSerializationTest.kt` (+81, -3)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/KiloCliDataParserTest.kt` (+30, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/ProjectModelSerializationTest.kt` (+27, -3)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/SessionModelSerializationTest.kt` (+75, -10)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/MockCliServer.kt` (+14, -3)
- `packages/kilo-jetbrains/build-tasks/src/main/kotlin/FixGeneratedApiTask.kt` (+10, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/DeleteSessionAction.kt` (+47, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/OpenSessionAction.kt` (+26, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/RenameSessionAction.kt` (+47, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloSessionService.kt` (+6, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionSidePanelManager.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/history/GitRemoteUrl.kt` (+34, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/history/HistoryController.kt` (+75, -9)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/history/HistoryDataKeys.kt` (+16, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/history/HistoryListRenderer.kt` (+10, -20)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/history/HistoryListUi.kt` (+1, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/history/HistoryModel.kt` (+6, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/history/HistoryPanel.kt` (+116, -55)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/history/HistoryTime.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/EmptySessionPanel.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/SessionHeaderPanel.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/kilo.jetbrains.frontend.xml` (+20, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+22, -11)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ar.properties` (+139, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_bs.properties` (+139, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_da.properties` (+139, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_de.properties` (+139, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_es.properties` (+139, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_fr.properties` (+139, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ja.properties` (+139, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ko.properties` (+139, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_nl.properties` (+139, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_no.properties` (+139, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pl.properties` (+139, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pt_BR.properties` (+139, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ru.properties` (+139, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_th.properties` (+139, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_tr.properties` (+139, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_uk.properties` (+139, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_CN.properties` (+139, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_TW.properties` (+139, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/HistorySessionActionsTest.kt` (+488, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/app/KiloSessionServiceTest.kt` (+100, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/history/HistoryControllerTest.kt` (+378, -9)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeSessionRpcApi.kt` (+16, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloSessionRpcApi.kt` (+3, -0)
- `packages/kilo-telemetry/src/telemetry.ts` (+1, -1)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+3, -3)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+0, -1)
- `packages/kilo-vscode/src/agent-manager/worktree-diff-controller.ts` (+8, -8)
- `packages/kilo-vscode/src/diff/shared/{client.ts => reverter.ts}` (+12, -17)
- `packages/kilo-vscode/src/diff/sources/catalog.ts` (+1, -1)
- `packages/kilo-vscode/src/diff/sources/worktree.ts` (+8, -8)
- `packages/kilo-vscode/tests/unit/local-diff.test.ts` (+136, -0)
- `packages/kilo-vscode/tests/unit/todo-revert.test.ts` (+64, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskHeader.tsx` (+27, -11)
- `packages/kilo-vscode/webview-ui/src/components/settings/ContextTab.tsx` (+38, -2)
- `packages/kilo-vscode/webview-ui/src/components/settings/CustomProviderDialog.tsx` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+24, -4)
- `packages/kilo-vscode/webview-ui/src/context/todo-revert.ts` (+74, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+4, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+4, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+4, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+4, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+4, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+4, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+4, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+4, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+4, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+4, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+4, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+4, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+4, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+4, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+4, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+4, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+3, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+3, -1)
- `packages/kilo-vscode/webview-ui/src/types/messages/config.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/parts.ts` (+7, -1)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+1, -0)
- `packages/opencode/src/config/config.ts` (+7, -0)
- `packages/opencode/src/index.ts` (+2, -0)
- `packages/opencode/src/kilocode/cli/cmd/roll-call.ts` (+335, -0)
- `packages/opencode/src/kilocode/commands.ts` (+2, -0)
- `packages/opencode/src/kilocode/session/overflow.ts` (+15, -0)
- `packages/opencode/src/kilocode/session/processor.ts` (+24, -6)
- `packages/opencode/src/session/overflow.ts` (+5, -1)
- `packages/opencode/src/session/prompt.ts` (+1, -9)
- `packages/opencode/test/kilocode/cli/roll-call.test.ts` (+161, -0)
- `packages/opencode/test/kilocode/session-overflow.test.ts` (+78, -0)
- `packages/opencode/test/kilocode/session-processor-review-telemetry.test.ts` (+83, -0)
- `packages/opencode/test/session/prompt.test.ts` (+43, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+4, -0)
- `packages/sdk/openapi.json` (+13, -0)
- `packages/ui/vite.config.ts` (+2, -0)

### Key Diffs

#### packages/opencode/src/tool/task.ts
```diff
diff --git a/packages/opencode/src/tool/task.ts b/packages/opencode/src/tool/task.ts
index 33ab459a3..f39d0bee9 100644
--- a/packages/opencode/src/tool/task.ts
+++ b/packages/opencode/src/tool/task.ts
@@ -8,6 +8,7 @@ import type { SessionPrompt } from "../session/prompt"
 import { Config } from "@/config/config"
 import { KiloTask } from "../kilocode/tool/task" // kilocode_change
 import { KiloCostPropagation } from "../kilocode/session/cost-propagation" // kilocode_change
+import { KiloSessionProcessor } from "../kilocode/session/processor" // kilocode_change
 import { Effect, Schema } from "effect"
 
 export interface TaskPromptOps {
@@ -154,6 +155,7 @@ export const TaskTool = Tool.define(
         () =>
           Effect.gen(function* () {
             const parts = yield* ops.resolvePromptParts(params.prompt)
+            KiloSessionProcessor.markReviewTelemetry(parts, params.command) // kilocode_change - carry review command into child session telemetry
             const result = yield* ops.prompt({
               messageID,
               sessionID: nextSession.id,
```


## opencode Changes (b0dc8e4..27ac53a)

### Commits

- 27ac53a - fix(server): stop exposing named defects (#27471) (Shoubhit Dash, 2026-05-14)
- 7801557 - refactor(server): centralize session busy mapping (#27473) (Shoubhit Dash, 2026-05-14)
- e76cf96 - fix(session): finalize interrupted assistant messages (#27254) (Aiden Cline, 2026-05-14)
- c2723b5 - chore: generate (opencode-agent[bot], 2026-05-14)
- 9675579 - fix: bug encountered when using azure gpt-5.5 w/ completions api (#26222) (Frederik, 2026-05-13)
- 4d83689 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-14)
- 2a7af6a - fix(tui): preserve text selection on question prompt options (#24988) (Nikhil Patel, 2026-05-13)
- bfd707a - chore: generate (opencode-agent[bot], 2026-05-14)
- 981e009 - fix: image resizer wasm loading, reenable image resizing (#26805) (Aiden Cline, 2026-05-13)
- c50d2b3 - Refactor event HTTP API route modules (#27441) (Aiden Cline, 2026-05-13)
- ddad098 - sync release versions for v1.14.50 (opencode, 2026-05-14)
- cda8cc7 - test(httpapi): simplify event stream regression coverage (#27427) (Kit Langton, 2026-05-14)
- b928a1f - fix(httpapi): preserve event stream context (#27425) (Kit Langton, 2026-05-13)
- 04286d0 - docs(effect): plan Instance deletion path (#27424) (Kit Langton, 2026-05-13)
- 33bb33b - chore: generate (opencode-agent[bot], 2026-05-14)
- b0ade40 - flip back to markdown renderable (#27421) (Sebastian, 2026-05-14)
- 681594b - refactor(storage): remove not found wire serializer (#27416) (Kit Langton, 2026-05-13)
- edf7649 - fix(session): type busy errors (#27410) (Kit Langton, 2026-05-14)
- 3fc7486 - test(session): fix shell-cancel race when trap hasn't installed yet (#27408) (Kit Langton, 2026-05-14)
- 8e35358 - test(format): remove formatter check sleeps (#27407) (Kit Langton, 2026-05-13)
- 5c35ea2 - notification docs (#27406) (Sebastian, 2026-05-14)
- faf8713 - chore: generate (opencode-agent[bot], 2026-05-14)
- 16c457e - refactor(core): move models.dev into core (#27347) (Dax, 2026-05-13)
- 9818c9e - fix(provider): make small model fallback optional (#27405) (Kit Langton, 2026-05-14)
- 5e41dbb - test(effect): use Effect sleep in instance state tests (#27404) (Kit Langton, 2026-05-13)
- ba5c8d3 - fix(llm): preserve tool error defects (#27403) (Kit Langton, 2026-05-13)
- 10c90eb - chore: generate (opencode-agent[bot], 2026-05-14)
- aa8a41d - effect(patch,tool): migrate patch/index and tool/read to AppFileSystem (#27155) (Kit Langton, 2026-05-13)
- 3f33be1 - effect(server): typed errors in session/sync handlers, fix concurrency (#27146) (Kit Langton, 2026-05-13)
- 42e6b7d - effect(core): track stderr truncation; polish AppProcess callers (#27353) (Kit Langton, 2026-05-13)
- ccb207f - effect(util): migrate filesystem callers to AppFileSystem.Service (#27152) (Kit Langton, 2026-05-13)
- de1e0b5 - test(workspace): effectify sync state cases (#27400) (Kit Langton, 2026-05-13)
- df3895d - cleanup: make smallOptions rely on variants (#27390) (Aiden Cline, 2026-05-13)
- 55e0af1 - fix(provider): type model not found errors (#27334) (Kit Langton, 2026-05-13)
- 5182a36 - test(workspace): use Effect for local session warp cases (#27393) (Kit Langton, 2026-05-13)
- 73e1de4 - sync release versions for v1.14.49 (opencode, 2026-05-13)
- 44b432c - sync (Frank, 2026-05-13)
- 0d8c9f3 - docs: add LayerMap example (#27388) (Kit Langton, 2026-05-13)
- 0d07449 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-13)
- 3b7a5e7 - fix keymap fallback priority and TUI config diagnostics (#27384) (Sebastian, 2026-05-13)
- c197fd9 - sync (Frank, 2026-05-13)
- 9ee1f6c - fix(server): map busy sessions in http handlers (#27375) (Shoubhit Dash, 2026-05-14)
- 20cec91 - fix(provider): restore model suggestions (#27372) (Shoubhit Dash, 2026-05-14)
- 22a5e6c - fix(run): restore non-interactive exit behavior (#27371) (Aiden Cline, 2026-05-13)
- 52f9bcb - refactor(flags): route installation client through runtime flags (#27369) (Shoubhit Dash, 2026-05-14)
- a4ebb07 - refactor(flags): route llm client through runtime flags (#27368) (Shoubhit Dash, 2026-05-14)
- 7cc968b - chore: generate (opencode-agent[bot], 2026-05-13)
- fa077b9 - zen: update sticky session logic (Frank, 2026-05-13)
- 8ad3a4b - test(util): migrate log cleanup test to Effect (#27357) (Kit Langton, 2026-05-13)
- 533495a - test(mcp): migrate OAuth auto-connect tests (#27356) (Kit Langton, 2026-05-13)
- f0635e3 - test(session): use Effect polling in processor tests (#27354) (Kit Langton, 2026-05-13)
- 25de3e4 - test(acp): use shared instance fixture for event tests (#27351) (Kit Langton, 2026-05-13)
- 655b25b - sync (Frank, 2026-05-13)
- e5d13d9 - effect(git): migrate to AppProcess.run (#27190) (Kit Langton, 2026-05-13)
- 5cdbb75 - effect(installation): migrate to AppProcess.run (#27188) (Kit Langton, 2026-05-13)
- e531984 - test(server): migrate pty websocket input test (#27348) (Kit Langton, 2026-05-13)
- 832aa94 - effect(worktree): migrate to AppProcess.run (#27186) (Kit Langton, 2026-05-13)
- 6c7f35b - effect(format): migrate to AppProcess (#27185) (Kit Langton, 2026-05-13)
- 6e25720 - test(tool): use Effect sleep in edit concurrency test (#27349) (Kit Langton, 2026-05-13)
- ca723f1 - effect(core): add stdin option to AppProcess.run; migrate snapshot+clipboard (#27224) (Kit Langton, 2026-05-13)
- 650f67a - chore: delete unused util/lock module (#27223) (Kit Langton, 2026-05-13)
- 50dccac - chore: generate (opencode-agent[bot], 2026-05-13)
- 02b8b0f - test: migrate file watcher test to Effect (#27346) (Kit Langton, 2026-05-13)
- 76c91c6 - test: migrate mcp oauth browser tests (#27345) (Kit Langton, 2026-05-13)
- ca17ca8 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-13)
- e7aed64 - chore: generate (opencode-agent[bot], 2026-05-13)
- d43124a - ignore: notes (Dax Raad, 2026-05-13)
- 7404664 - refactor: migrate installation tests to testEffect (#27342) (Kit Langton, 2026-05-13)
- 0b112e5 - test: migrate permission task config tests (#27343) (Kit Langton, 2026-05-13)
- 268d758 - refactor(flags): route control-plane workspaces through runtime flags (#27337) (Shoubhit Dash, 2026-05-13)
- 72acdf0 - chore: generate (opencode-agent[bot], 2026-05-13)
- e28ef7b - refactor(flags): route sync workspaces through runtime flags (#27336) (Shoubhit Dash, 2026-05-13)
- 5b5376a - chore: generate (opencode-agent[bot], 2026-05-13)
- 766318a - effect(snapshot): migrate to AppProcess.run (#27189) (Kit Langton, 2026-05-13)
- 8d5aa58 - test(workspace): effectify sync start coverage (#27338) (Kit Langton, 2026-05-13)
- eed0edd - refactor(flags): route session workspaces through runtime flags (#27335) (Shoubhit Dash, 2026-05-13)
- 8345152 - core: expose v2 model listing API (#25821) (Dax, 2026-05-13)
- bebe544 - chore: delete unused util/color module (#27331) (Kit Langton, 2026-05-13)
- bc25342 - chore: delete util/scrap module (#27330) (Kit Langton, 2026-05-13)
- 762020f - chore: delete unused util/network module (#27329) (Kit Langton, 2026-05-13)
- f13fc5a - refactor(flags): route event system through runtime flags (#27323) (Shoubhit Dash, 2026-05-13)
- 098bdd8 - refactor(flags): route plan mode through runtime flags (#27320) (Shoubhit Dash, 2026-05-13)
- 4d20502 - refactor(flags): route scout through runtime flags (#27318) (Shoubhit Dash, 2026-05-13)
- 5975547 - chore: generate (opencode-agent[bot], 2026-05-13)
- 5b2b300 - fix(session): tighten http error contracts (#27308) (Shoubhit Dash, 2026-05-13)
- d488e3f - chore: generate (opencode-agent[bot], 2026-05-13)
- 809af5c - fix(provider): type auth errors (#27301) (Shoubhit Dash, 2026-05-13)
- 733bd3c - chore: activate low tps alerts (vimtor, 2026-05-13)
- 374951b - chore: generate (opencode-agent[bot], 2026-05-13)
- 2e94f50 - chore: add low tps model alerts (#27055) (Victor Navarro, 2026-05-13)
- 4498fc9 - chore: generate (opencode-agent[bot], 2026-05-13)
- 2e7cf92 - fix(worktree): type expected errors (#27296) (Shoubhit Dash, 2026-05-13)
- ccf93f3 - fix(session): make message reads effectful (#27291) (Shoubhit Dash, 2026-05-13)
- 4b04171 - fix(server): remove storage not found defect fallback (#27287) (Shoubhit Dash, 2026-05-13)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/tool/code-interpreter.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/tool/file-search.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/tool/image-generation.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/tool/local-shell.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/tool/web-search-preview.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/tool/web-search.ts` (+0, -0)
- `packages/opencode/src/tool/apply_patch.ts` (+5, -1)
- `packages/opencode/src/tool/read.ts` (+45, -50)
- `packages/opencode/src/tool/task.ts` (+1, -1)
- `packages/opencode/test/tool/edit.test.ts` (+1, -1)
- `packages/opencode/test/tool/read.test.ts` (+50, -53)
- `packages/opencode/test/tool/shell.test.ts` (+1, -1)
- `packages/opencode/test/tool/truncation.test.ts` (+14, -6)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+12, -7)
- `packages/opencode/test/agent/agent.test.ts` (+57, -65)
- `packages/opencode/test/agent/plugin-agent-regression.test.ts` (+1, -0)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/console/core/migrations/20260513163955_tearful_whistler/migration.sql` (+7, -0)
- `packages/console/core/migrations/20260513163955_tearful_whistler/snapshot.json` (+2765, -0)
- `packages/console/core/package.json` (+1, -1)
- `packages/console/core/src/schema/ip.sql.ts` (+10, -0)
- `packages/core/package.json` (+31, -3)
- `packages/core/src/aisdk.ts` (+172, -0)
- `packages/core/src/catalog.ts` (+260, -0)
- `packages/core/src/flag/flag.ts` (+0, -6)
- `packages/core/src/instance-layer.ts` (+12, -0)
- `packages/core/src/instance.ts` (+10, -0)
- `packages/core/src/model.ts` (+116, -0)
- `packages/core/src/models-snapshot.d.ts` (+2, -0)
- `packages/core/src/models-snapshot.js` (+71726, -0)
- `packages/core/src/plugin.ts` (+146, -0)
- `packages/core/src/plugin/auth.ts` (+27, -0)
- `packages/core/src/plugin/boot.ts` (+71, -0)
- `packages/core/src/plugin/env.ts` (+18, -0)
- `packages/core/src/plugin/layer-map.example.ts` (+94, -0)
- `packages/core/src/plugin/models-dev.ts` (+108, -0)
- `packages/core/src/plugin/provider.ts` (+1, -0)
- `packages/core/src/plugin/provider/alibaba.ts` (+15, -0)
- `packages/core/src/plugin/provider/amazon-bedrock.ts` (+94, -0)
- `packages/core/src/plugin/provider/anthropic.ts` (+21, -0)
- `packages/core/src/plugin/provider/azure.ts` (+64, -0)
- `packages/core/src/plugin/provider/cerebras.ts` (+20, -0)
- `packages/core/src/plugin/provider/cloudflare-ai-gateway.ts` (+81, -0)
- `packages/core/src/plugin/provider/cloudflare-workers-ai.ts` (+69, -0)
- `packages/core/src/plugin/provider/cohere.ts` (+15, -0)
- `packages/core/src/plugin/provider/deepinfra.ts` (+15, -0)
- `packages/core/src/plugin/provider/dynamic.ts` (+31, -0)
- `packages/core/src/plugin/provider/gateway.ts` (+15, -0)
- `packages/core/src/plugin/provider/github-copilot.ts` (+44, -0)
- `packages/core/src/plugin/provider/gitlab.ts` (+65, -0)
- `packages/core/src/plugin/provider/google-vertex.ts` (+141, -0)
- `packages/core/src/plugin/provider/google.ts` (+15, -0)
- `packages/core/src/plugin/provider/groq.ts` (+15, -0)
- `packages/core/src/plugin/provider/index.ts` (+67, -0)
- `packages/core/src/plugin/provider/kilo.ts` (+16, -0)
- `packages/core/src/plugin/provider/llmgateway.ts` (+18, -0)
- `packages/core/src/plugin/provider/mistral.ts` (+15, -0)
- `packages/core/src/plugin/provider/nvidia.ts` (+16, -0)
- `packages/core/src/plugin/provider/openai-compatible.ts` (+17, -0)
- `packages/core/src/plugin/provider/openai.ts` (+27, -0)
- `packages/core/src/plugin/provider/opencode.ts` (+27, -0)
- `packages/core/src/plugin/provider/openrouter.ts` (+29, -0)
- `packages/core/src/plugin/provider/perplexity.ts` (+15, -0)
- `packages/core/src/plugin/provider/sap-ai-core.ts` (+44, -0)
- `packages/core/src/plugin/provider/togetherai.ts` (+15, -0)
- `packages/core/src/plugin/provider/venice.ts` (+15, -0)
- `packages/core/src/plugin/provider/vercel.ts` (+21, -0)
- `packages/core/src/plugin/provider/xai.ts` (+20, -0)
- `packages/core/src/plugin/provider/zenmux.ts` (+16, -0)
- `packages/core/src/process.ts` (+31, -4)
- `packages/core/src/provider.ts` (+120, -0)
- `packages/core/src/util/log.ts` (+5, -1)
- `packages/core/test/catalog.test.ts` (+201, -0)
- `packages/core/test/plugin/fixtures/provider-factory.ts` (+9, -0)
- `packages/core/test/plugin/provider-alibaba.test.ts` (+67, -0)
- `packages/core/test/plugin/provider-amazon-bedrock.test.ts` (+465, -0)
- `packages/core/test/plugin/provider-anthropic.test.ts` (+91, -0)
- `packages/core/test/plugin/provider-azure-cognitive-services.test.ts` (+127, -0)
- `packages/core/test/plugin/provider-azure.test.ts` (+245, -0)
- `packages/core/test/plugin/provider-cerebras.test.ts` (+102, -0)
- `packages/core/test/plugin/provider-cloudflare-ai-gateway.test.ts` (+384, -0)
- `packages/core/test/plugin/provider-cloudflare-workers-ai.test.ts` (+267, -0)
- `packages/core/test/plugin/provider-cohere.test.ts` (+86, -0)
- `packages/core/test/plugin/provider-deepinfra.test.ts` (+129, -0)
- `packages/core/test/plugin/provider-dynamic.test.ts` (+172, -0)
- `packages/core/test/plugin/provider-gateway.test.ts` (+87, -0)
- `packages/core/test/plugin/provider-github-copilot.test.ts` (+188, -0)
- `packages/core/test/plugin/provider-gitlab.test.ts` (+346, -0)
- `packages/core/test/plugin/provider-google-vertex-anthropic.test.ts` (+147, -0)
- `packages/core/test/plugin/provider-google-vertex.test.ts` (+300, -0)
- `packages/core/test/plugin/provider-google.test.ts` (+70, -0)
- `packages/core/test/plugin/provider-groq.test.ts` (+101, -0)
- `packages/core/test/plugin/provider-helper.ts` (+100, -0)
- `packages/core/test/plugin/provider-kilo.test.ts` (+90, -0)
- `packages/core/test/plugin/provider-llmgateway.test.ts` (+63, -0)
- `packages/core/test/plugin/provider-mistral.test.ts` (+106, -0)
- `packages/core/test/plugin/provider-nvidia.test.ts` (+41, -0)
- `packages/core/test/plugin/provider-openai-compatible.test.ts` (+101, -0)
- `packages/core/test/plugin/provider-openai.test.ts` (+100, -0)
- `packages/core/test/plugin/provider-opencode.test.ts` (+197, -0)
- `packages/core/test/plugin/provider-openrouter.test.ts` (+105, -0)
- `packages/core/test/plugin/provider-perplexity.test.ts` (+107, -0)
- `packages/core/test/plugin/provider-sap-ai-core.test.ts` (+127, -0)
- `packages/core/test/plugin/provider-togetherai.test.ts` (+97, -0)
- `packages/core/test/plugin/provider-venice.test.ts` (+86, -0)
- `packages/core/test/plugin/provider-vercel.test.ts` (+62, -0)
- `packages/core/test/plugin/provider-xai.test.ts` (+115, -0)
- `packages/core/test/plugin/provider-zenmux.test.ts` (+103, -0)
- `packages/core/test/process/process.test.ts` (+106, -20)

#### Other Changes
- `AGENTS.md` (+23, -0)
- `bun.lock` (+66, -33)
- `infra/monitoring.ts` (+66, -0)
- `nix/hashes.json` (+4, -4)
- `package.json` (+3, -3)
- `packages/app/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/routes/honeycomb/webhook.ts` (+26, -6)
- `packages/console/app/src/routes/zen/util/handler.ts` (+3, -3)
- `packages/console/app/src/routes/zen/util/stickyProviderTracker.ts` (+31, -5)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/function/src/stat.ts` (+15, -12)
- `packages/console/mail/package.json` (+1, -1)
- `packages/{opencode/src/v2 => core/src}/auth.ts` (+33, -15)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/README.md` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/chat/convert-to-openai-compatible-chat-messages.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/chat/get-response-metadata.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/chat/map-openai-compatible-finish-reason.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/chat/openai-compatible-api-types.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/chat/openai-compatible-chat-language-model.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/chat/openai-compatible-chat-options.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/chat/openai-compatible-metadata-extractor.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/chat/openai-compatible-prepare-tools.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/copilot-provider.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/openai-compatible-error.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/convert-to-openai-responses-input.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/map-openai-responses-finish-reason.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/openai-config.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/openai-error.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/openai-responses-api-types.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/openai-responses-language-model.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/openai-responses-prepare-tools.ts` (+0, -0)
- `packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/openai-responses-settings.ts` (+0, -0)
- `packages/{opencode/src/provider => core/src}/models.ts` (+24, -11)
- `packages/{opencode/src/v2 => core/src}/session-prompt.ts` (+0, -0)
- `packages/{opencode/src/v2 => core/src}/tool-output.ts` (+0, -0)
- `packages/{opencode/src/v2/schema.ts => core/src/v2-schema.ts}` (+1, -1)
- `packages/{opencode/test/provider/copilot => core/test/github-copilot}/convert-to-copilot-messages.test.ts` (+1, -1)
- `packages/{opencode/test/provider/copilot => core/test/github-copilot}/copilot-chat-model.test.ts` (+1, -1)
- `packages/{opencode/test/provider => core/test}/models.test.ts` (+11, -7)
- `packages/desktop/package.json` (+1, -1)
- `packages/enterprise/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/function/package.json` (+1, -1)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/llm/src/schema/errors.ts` (+1, -0)
- `packages/llm/src/schema/events.ts` (+1, -0)
- `packages/llm/src/tool-runtime.ts` (+26, -10)
- `packages/llm/test/tool-runtime.test.ts` (+21, -14)
- `packages/opencode/package.json` (+1, -2)
- `packages/opencode/script/generate.ts` (+2, -2)
- `packages/opencode/specs/effect/error-boundaries-plan.md` (+235, -0)
- `packages/opencode/specs/effect/errors.md` (+3, -0)
- `packages/opencode/specs/effect/todo.md` (+60, -2)
- `packages/opencode/specs/effect/tools.md` (+2, -4)
- `packages/opencode/src/cli/cmd/debug/index.ts` (+2, -0)
- `packages/opencode/src/cli/cmd/debug/v2.ts` (+46, -0)
- `packages/opencode/src/cli/cmd/github.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/import.ts` (+5, -4)
- `packages/opencode/src/cli/cmd/models.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/providers.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/run.ts` (+19, -7)
- `packages/opencode/src/cli/cmd/tui/config/tui.ts` (+38, -14)
- `packages/opencode/src/cli/cmd/tui/plugin/internal.ts` (+17, -15)
- `packages/opencode/src/cli/cmd/tui/plugin/runtime.ts` (+7, -2)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+9, -24)
- `packages/opencode/src/cli/cmd/tui/routes/session/question.tsx` (+18, -4)
- `packages/opencode/src/cli/cmd/tui/util/clipboard.ts` (+18, -42)
- `packages/opencode/src/cli/error.ts` (+7, -8)
- `packages/opencode/src/config/attachment.ts` (+1, -1)
- `packages/opencode/src/control-plane/workspace.ts` (+8, -4)
- `packages/opencode/src/effect/app-runtime.ts` (+1, -1)
- `packages/opencode/src/effect/promise.ts` (+17, -0)
- `packages/opencode/src/effect/runner.ts` (+7, -12)
- `packages/opencode/src/effect/runtime-flags.ts` (+2, -0)
- `packages/opencode/src/format/index.ts` (+11, -14)
- `packages/opencode/src/git/index.ts` (+20, -38)
- `packages/opencode/src/image/image.ts` (+28, -32)
- `packages/opencode/src/installation/index.ts` (+216, -223)
- `packages/opencode/src/patch/index.ts` (+77, -71)
- `packages/opencode/src/provider/auth.ts` (+17, -16)
- `packages/opencode/src/provider/model-status.ts` (+1, -2)
- `packages/opencode/src/provider/provider.ts` (+97, -47)
- `packages/opencode/src/provider/transform.ts` (+12, -28)
- `packages/opencode/src/reference/reference.ts` (+7, -5)
- `packages/opencode/src/server/routes/instance/httpapi/api.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/event.ts` (+0, -79)
- `packages/opencode/src/server/routes/instance/httpapi/groups/event.ts` (+24, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/experimental.ts` (+20, -3)
- `packages/opencode/src/server/routes/instance/httpapi/groups/provider.ts` (+22, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/session.ts` (+14, -14)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2.ts` (+4, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/instance.ts` (+59, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/model.ts` (+29, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/provider.ts` (+47, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/session.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/event.ts` (+65, -0)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/experimental.ts` (+10, -4)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/instance.ts` (+3, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/provider.ts` (+32, -11)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/session-errors.ts` (+6, -0)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/session.ts` (+42, -25)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/sync.ts` (+2, -2)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2.ts` (+7, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2/model.ts` (+19, -0)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2/provider.ts` (+32, -0)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/error.ts` (+0, -28)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+3, -2)
- `packages/opencode/src/session/compaction.ts` (+11, -6)
- `packages/opencode/src/session/llm.ts` (+5, -4)
- `packages/opencode/src/session/message-v2.ts` (+15, -26)
- `packages/opencode/src/session/processor.ts` (+31, -25)
- `packages/opencode/src/session/prompt.ts` (+83, -50)
- `packages/opencode/src/session/revert.ts` (+2, -2)
- `packages/opencode/src/session/run-state.ts` (+10, -7)
- `packages/opencode/src/session/session.ts` (+20, -13)
- `packages/opencode/src/snapshot/index.ts` (+628, -641)
- `packages/opencode/src/storage/storage.ts` (+0, -7)
- `packages/opencode/src/sync/index.ts` (+13, -6)
- `packages/opencode/src/util/color.ts` (+0, -19)
- `packages/opencode/src/util/lock.ts` (+0, -98)
- `packages/opencode/src/util/network.ts` (+0, -9)
- `packages/opencode/src/util/scrap.ts` (+0, -10)
- `packages/opencode/src/v2/model.ts` (+0, -193)
- `packages/opencode/src/v2/provider-parity-checklist.md` (+95, -0)
- `packages/opencode/src/v2/session-event.ts` (+6, -6)
- `packages/opencode/src/v2/session-message.ts` (+5, -5)
- `packages/opencode/src/v2/session.ts` (+18, -17)
- `packages/opencode/src/worktree/index.ts` (+89, -79)
- `packages/opencode/test/acp/event-subscription.test.ts` (+13, -14)
- `packages/opencode/test/cli/error.test.ts` (+17, -0)
- `packages/opencode/test/config/agent-color.test.ts` (+1, -15)
- `packages/opencode/test/config/tui.test.ts` (+19, -0)
- `packages/opencode/test/control-plane/workspace.test.ts` (+287, -194)
- `packages/opencode/test/effect/instance-state.test.ts` (+7, -7)
- `packages/opencode/test/effect/runner.test.ts` (+2, -23)
- `packages/opencode/test/effect/runtime-flags.test.ts` (+2, -0)
- `packages/opencode/test/file/index.test.ts` (+25, -24)
- `packages/opencode/test/file/watcher.test.ts` (+152, -139)
- `packages/opencode/test/format/format.test.ts` (+2, -2)
- `packages/opencode/test/image/fixtures/picture-5mb-base64.png` (+-, --)
- `packages/opencode/test/image/image.test.ts` (+41, -0)
- `packages/opencode/test/installation/installation.test.ts` (+91, -90)
- `packages/opencode/test/mcp/oauth-auto-connect.test.ts` (+122, -168)
- `packages/opencode/test/mcp/oauth-browser.test.ts` (+108, -142)
- `packages/opencode/test/patch/patch.test.ts` (+154, -119)
- `packages/opencode/test/permission-task.test.ts` (+82, -92)
- `packages/opencode/test/plugin/loader-shared.test.ts` (+11, -9)
- `packages/opencode/test/plugin/workspace-adapter.test.ts` (+16, -1)
- `packages/opencode/test/preload.ts` (+1, -0)
- `packages/opencode/test/project/worktree.test.ts` (+12, -4)
- `packages/opencode/test/provider/model-status.test.ts` (+1, -1)
- `packages/opencode/test/provider/provider.test.ts` (+53, -5)
- `packages/opencode/test/provider/transform.test.ts` (+138, -15)
- `packages/opencode/test/reference/reference.test.ts` (+119, -120)
- `packages/opencode/test/server/httpapi-error-middleware.test.ts` (+41, -0)
- `packages/opencode/test/server/httpapi-event.test.ts` (+77, -18)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+6, -0)
- `packages/opencode/test/server/httpapi-exercise/runner.ts` (+1, -1)
- `packages/opencode/test/server/httpapi-experimental.test.ts` (+17, -0)
- `packages/opencode/test/server/httpapi-provider.test.ts` (+108, -1)
- `packages/opencode/test/server/httpapi-pty-websocket.test.ts` (+12, -9)
- `packages/opencode/test/server/httpapi-raw-route-auth.test.ts` (+1, -1)
- `packages/opencode/test/server/httpapi-session.test.ts` (+54, -4)
- `packages/opencode/test/server/session-list.test.ts` (+13, -9)
- `packages/opencode/test/session/compaction.test.ts` (+4, -0)
- `packages/opencode/test/session/llm.test.ts` (+1, -1)
- `packages/opencode/test/session/messages-pagination.test.ts` (+33, -61)
- `packages/opencode/test/session/processor-effect.test.ts` (+28, -20)
- `packages/opencode/test/session/prompt.test.ts` (+147, -13)
- `packages/opencode/test/session/session.test.ts` (+15, -4)
- `packages/opencode/test/session/snapshot-tool-race.test.ts` (+8, -2)
- `packages/opencode/test/sync/index.test.ts` (+8, -10)
- `packages/opencode/test/util/lock.test.ts` (+0, -72)
- `packages/opencode/test/util/log.test.ts` (+62, -29)
- `packages/opencode/test/v2/session-message-updater.test.ts` (+11, -10)
- `packages/plugin/package.json` (+4, -4)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+97, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+320, -47)
- `packages/sdk/openapi.json` (+895, -133)
- `packages/slack/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/ar/cli.mdx` (+0, -1)
- `packages/web/src/content/docs/bs/cli.mdx` (+0, -1)
- `packages/web/src/content/docs/cli.mdx` (+0, -1)
- `packages/web/src/content/docs/config.mdx` (+38, -1)
- `packages/web/src/content/docs/da/cli.mdx` (+14, -15)
- `packages/web/src/content/docs/de/cli.mdx` (+0, -1)
- `packages/web/src/content/docs/es/cli.mdx` (+0, -1)
- `packages/web/src/content/docs/fr/cli.mdx` (+0, -1)
- `packages/web/src/content/docs/it/cli.mdx` (+0, -1)
- `packages/web/src/content/docs/ja/cli.mdx` (+0, -1)
- `packages/web/src/content/docs/ko/cli.mdx` (+0, -1)
- `packages/web/src/content/docs/nb/cli.mdx` (+0, -1)
- `packages/web/src/content/docs/pl/cli.mdx` (+0, -1)
- `packages/web/src/content/docs/pt-br/cli.mdx` (+0, -1)
- `packages/web/src/content/docs/ru/cli.mdx` (+0, -1)
- `packages/web/src/content/docs/th/cli.mdx` (+0, -1)
- `packages/web/src/content/docs/tr/cli.mdx` (+0, -1)
- `packages/web/src/content/docs/tui.mdx` (+23, -1)
- `packages/web/src/content/docs/zh-cn/cli.mdx` (+2, -2)
- `packages/web/src/content/docs/zh-tw/cli.mdx` (+0, -1)
- `patches/@silvia-odwyer%2Fphoton-node@0.3.4.patch` (+274, -3)
- `sdks/vscode/package.json` (+1, -1)
- `specs/v2/api.html` (+1161, -0)
- `specs/v2/provider-model.md` (+330, -0)

### Key Diffs

#### packages/console/core/migrations/20260513163955_tearful_whistler/migration.sql
```diff
diff --git a/packages/console/core/migrations/20260513163955_tearful_whistler/migration.sql b/packages/console/core/migrations/20260513163955_tearful_whistler/migration.sql
new file mode 100644
index 0000000..a2bcc16
--- /dev/null
+++ b/packages/console/core/migrations/20260513163955_tearful_whistler/migration.sql
@@ -0,0 +1,7 @@
+CREATE TABLE `model_sticky_provider` (
+	`id` varchar(255) PRIMARY KEY,
+	`time_created` timestamp(3) NOT NULL DEFAULT (now()),
+	`time_updated` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
+	`time_deleted` timestamp(3),
+	`provider_id` varchar(255) NOT NULL
+);
```

#### packages/console/core/migrations/20260513163955_tearful_whistler/snapshot.json
```diff
diff --git a/packages/console/core/migrations/20260513163955_tearful_whistler/snapshot.json b/packages/console/core/migrations/20260513163955_tearful_whistler/snapshot.json
new file mode 100644
index 0000000..b791735
--- /dev/null
+++ b/packages/console/core/migrations/20260513163955_tearful_whistler/snapshot.json
@@ -0,0 +1,2765 @@
+{
+  "version": "6",
+  "dialect": "mysql",
+  "id": "1f04bd59-35b0-493b-9d55-cfa08207ba8e",
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

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 986103e..e8585f2 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.14.48",
+  "version": "1.14.50",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/console/core/src/schema/ip.sql.ts
```diff
diff --git a/packages/console/core/src/schema/ip.sql.ts b/packages/console/core/src/schema/ip.sql.ts
index 975dcfa..a80fa47 100644
--- a/packages/console/core/src/schema/ip.sql.ts
+++ b/packages/console/core/src/schema/ip.sql.ts
@@ -51,3 +51,13 @@ export const ModelTpsRateLimitTable = mysqlTable(
   },
   (table) => [primaryKey({ columns: [table.id, table.interval] })],
 )
+
+export const ModelStickyProviderTable = mysqlTable(
+  "model_sticky_provider",
+  {
+    id: varchar("id", { length: 255 }).notNull(),
+    ...timestamps,
+    providerId: varchar("provider_id", { length: 255 }).notNull(),
+  },
+  (table) => [primaryKey({ columns: [table.id] })],
+)
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 6bcef68..ab54023 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.14.48",
+  "version": "1.14.50",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
@@ -26,6 +26,27 @@
     "@types/semver": "catalog:"
   },
   "dependencies": {
+    "@ai-sdk/alibaba": "1.0.17",
+    "@ai-sdk/amazon-bedrock": "4.0.96",
+    "@ai-sdk/anthropic": "3.0.71",
+    "@ai-sdk/azure": "3.0.49",
+    "@ai-sdk/cerebras": "2.0.41",
+    "@ai-sdk/cohere": "3.0.27",
+    "@ai-sdk/deepinfra": "2.0.41",
+    "@ai-sdk/gateway": "3.0.104",
+    "@ai-sdk/google": "3.0.63",
+    "@ai-sdk/google-vertex": "4.0.112",
+    "@ai-sdk/groq": "3.0.31",
+    "@ai-sdk/mistral": "3.0.27",
+    "@ai-sdk/openai": "3.0.53",
+    "@ai-sdk/openai-compatible": "2.0.41",
+    "@ai-sdk/perplexity": "3.0.26",
+    "@ai-sdk/provider": "3.0.8",
+    "@ai-sdk/provider-utils": "4.0.23",
+    "@ai-sdk/togetherai": "2.0.41",
+    "@ai-sdk/vercel": "2.0.39",
+    "@ai-sdk/xai": "3.0.82",
+    "@aws-sdk/credential-providers": "3.993.0",
     "@effect/opentelemetry": "catalog:",
     "@effect/platform-node": "catalog:",
     "@npmcli/arborist": "9.4.0",
@@ -34,14 +55,21 @@
     "@opentelemetry/context-async-hooks": "2.6.1",
     "@opentelemetry/exporter-trace-otlp-http": "0.214.0",
     "@opentelemetry/sdk-trace-base": "2.6.1",
-    "effect": "catalog:",
+    "@openrouter/ai-sdk-provider": "2.8.1",
+    "ai-gateway-provider": "3.1.2",
     "cross-spawn": "catalog:",
+    "effect": "catalog:",
+    "gitlab-ai-provider": "6.6.0",
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/src/agent/agent.ts
- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/test/agent/agent.test.ts
- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/test/agent/plugin-agent-regression.test.ts
- `src/tool/apply_patch.ts` - update based on opencode packages/opencode/src/tool/apply_patch.ts changes
- `src/tool/code-interpreter.ts` - update based on opencode packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/tool/code-interpreter.ts changes
- `src/tool/edit.test.ts` - update based on opencode packages/opencode/test/tool/edit.test.ts changes
- `src/tool/file-search.ts` - update based on opencode packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/tool/file-search.ts changes
- `src/tool/image-generation.ts` - update based on opencode packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/tool/image-generation.ts changes
- `src/tool/local-shell.ts` - update based on opencode packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/tool/local-shell.ts changes
- `src/tool/read.test.ts` - update based on opencode packages/opencode/test/tool/read.test.ts changes
- `src/tool/read.ts` - update based on opencode packages/opencode/src/tool/read.ts changes
- `src/tool/shell.test.ts` - update based on opencode packages/opencode/test/tool/shell.test.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/tool/task.ts changes
- `src/tool/task.ts` - update based on opencode packages/opencode/src/tool/task.ts changes
- `src/tool/truncation.test.ts` - update based on opencode packages/opencode/test/tool/truncation.test.ts changes
- `src/tool/web-search-preview.ts` - update based on opencode packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/tool/web-search-preview.ts changes
- `src/tool/web-search.ts` - update based on opencode packages/{opencode/src/provider/sdk/copilot => core/src/github-copilot}/responses/tool/web-search.ts changes
