# Upstream Changes Report
Generated: 2026-03-25 07:04:07

## Summary
- kilocode: 57 commits, 173 files changed
- opencode: 0 commits, 0 files changed

## kilocode Changes (c3fcc989..b853ca57)

### Commits

- b853ca57 - Merge branch 'Kilo-Org:main' into main (Aleksei Sabetski, 2026-03-25)
- 10db72a7 - feat(agent-manager): auto-copy .env files into new worktrees (#7544) (Marius, 2026-03-24)
- 3c9c553b - Merge pull request #7473 from Kilo-Org/mark/fix-notification-overlap-7469 (Mark IJbema, 2026-03-24)
- a6e52547 - fix(agent-manager): preserve review comments when switching session tabs (#7538) (Marius, 2026-03-24)
- fba89737 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-03-24)
- a94b2e92 - test(vscode): add welcome screen screenshot test with account switcher and notification (Mark IJbema, 2026-03-24)
- bc975189 - fix(vscode): stack notification below account switcher on welcome screen (Mark IJbema, 2026-03-24)
- d45370c7 - Merge pull request #7530 from Kilo-Org/fix-windows-cmd-popups (Mark IJbema, 2026-03-24)
- 00aa4457 - refactor(vscode): centralise process spawning in util/process.ts to enforce windowsHide (Mark IJbema, 2026-03-24)
- 7441339a - Merge pull request #7535 from Kilo-Org/catrielmuller/kilo-custom-modes-support (Catriel Müller, 2026-03-24)
- 12652ee3 - fix: vscode lint (Catriel Müller, 2026-03-24)
- a8e0da3d - feat: Kilo gateway custom modes (Catriel Müller, 2026-03-24)
- 80aacd65 - fix: scope process.type shim to vscode context via KILO_PLATFORM env var (Mark IJbema, 2026-03-24)
- 04d0175d - fix(vscode): fix file path drop mentions to work with attachment system (#7477) (Marius, 2026-03-24)
- d6d082ea - fix(vscode): use correct SCM repository for commit message generation (#7528) (Marius, 2026-03-24)
- 53ab8e96 - fix: prevent cmd.exe windows from appearing on Windows (Mark IJbema, 2026-03-24)
- 1f7d869e - Merge pull request #7519 from Kilo-Org/docs/fix-auto-balanced-model-m27 (Scott Breitenother, 2026-03-24)
- c87457ba - fix(cli,vscode): consume stream explicitly to prevent commit message infinite loading (#7434) (kilo-code-bot[bot], 2026-03-24)
- a08905f5 - docs(kilo-docs): update Auto Balanced model from M2.5 (free) to M2.7 (paid) (kiloconnect[bot], 2026-03-24)
- b20cedb5 - release: v7.1.3 (kilo-maintainer[bot], 2026-03-24)
- 7c22d6ff - Merge pull request #7496 from Kilo-Org/mark/autocomplete-credit-exhaustion-backoff (Mark IJbema, 2026-03-24)
- 9fbb3120 - fix(vscode): restrict extractStatus regex to 4xx/5xx status codes (Mark IJbema, 2026-03-24)
- 682f8001 - fix(vscode): reset fatalNotified alongside backoff on auth changes (Mark IJbema, 2026-03-24)
- c7f12862 - Merge pull request #7516 from Kilo-Org/revert-7439-mark/bash-default-ask (Mark IJbema, 2026-03-24)
- a637715a - Revert "feat(cli,vscode): change default bash auto-approve rule to ask" (Mark IJbema, 2026-03-24)
- 84d6fa55 - fix(vscode): anchor extractStatus regex to colon to avoid false matches (Mark IJbema, 2026-03-24)
- bf07e75e - feat(agent-manager): add right-click context menus for worktrees and sessions (#7515) (Marius, 2026-03-24)
- d047d492 - Merge pull request #7494 from Kilo-Org/mark/fix-read-before-write-tool-error (Mark IJbema, 2026-03-24)
- 501d67e5 - fix(vscode): use balance check instead of FIM probe for 402 recovery (Mark IJbema, 2026-03-24)
- 630282ae - Merge pull request #7511 from Kilo-Org/mark/agents-source-links (Mark IJbema, 2026-03-24)
- 5974d895 - fix(vscode): use app.kilo.ai/credits URL for add credits link (Mark IJbema, 2026-03-24)
- 67b34b0f - fix: exclude models-snapshot.ts from source link extraction (Mark IJbema, 2026-03-24)
- 1caacec1 - Merge pull request #7509 from Kilo-Org/mark/telemetry-debug-logging (Mark IJbema, 2026-03-24)
- aa87d759 - docs: add source-links freshness check to AGENTS.md (Mark IJbema, 2026-03-24)
- a5ac7815 - chore: regenerate source-links.md (Mark IJbema, 2026-03-24)
- cf61c4b9 - feat(vscode): add debug logging for telemetry events (Mark IJbema, 2026-03-24)
- 17915549 - chore: update visual regression baselines (github-actions[bot], 2026-03-24)
- c2519114 - Merge branch 'main' into mark/fix-read-before-write-tool-error (Mark IJbema, 2026-03-24)
- 77400329 - Merge pull request #7506 from Kilo-Org/mark/tool-error-screenshot-baseline (Mark IJbema, 2026-03-24)
- c33235be - Merge branch 'main' into mark/tool-error-screenshot-baseline (Mark IJbema, 2026-03-24)
- 9f37feed - fix(vscode): reset autocomplete backoff on auth changes and add probe interval (Mark IJbema, 2026-03-24)
- c20438b0 - Merge pull request #7502 from Kilo-Org/mark/remove-holefiller (Mark IJbema, 2026-03-24)
- 55fdac3b - chore: update visual regression baselines (github-actions[bot], 2026-03-24)
- f2815973 - feat(ui): add ToolHintErrors story for visual regression baseline (Mark IJbema, 2026-03-24)
- d93e57d5 - refactor(vscode): remove strategy field from autocomplete types (Mark IJbema, 2026-03-24)
- 66478439 - fix(kilo-ui): fix user message copy button unclickable in sidebar (#7501) (Marius, 2026-03-24)
- ac616b1f - refactor(vscode): remove dead HoleFiller autocomplete code (Mark IJbema, 2026-03-24)
- 5c044af5 - fix(vscode): auto-submit custom question answer on Enter and make collapsed dock clickable (#7500) (Marius, 2026-03-24)
- 8f03cbc2 - fix(vscode): propagate SSE errors to ErrorBackoff for autocomplete (Mark IJbema, 2026-03-24)
- b6bfa64c - feat(ui): render tool-hint for common tool errors (kiloconnect[bot], 2026-03-24)
- f2c2e6d8 - fix(ui): suppress read-tool prerequisite error in ToolPartDisplay (kiloconnect[bot], 2026-03-24)
- 628a7a6f - feat(vscode): add translations for autocomplete credit/auth error notifications (Mark IJbema, 2026-03-24)
- ed54a655 - Merge pull request #7492 from Kilo-Org/kirillk/banner (Mark IJbema, 2026-03-24)
- 36515647 - Merge branch 'main' into kirillk/banner (Kirill Kalishev, 2026-03-23)
- 3f459826 - fix(vscode): clamp notification index when list shrinks and derive navigation from safeIndex (kirillk, 2026-03-23)
- 788a012a - feat(vscode): restyle onboarding notifications banner with wizard-style navigation (kirillk, 2026-03-23)
- 4c9bc9ca - fix(vscode): add circuit breaker and backoff for autocomplete API errors (kiloconnect[bot], 2026-03-23)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
(no changes)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+10, -1)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
(no changes)

#### Other Changes
- `.github/workflows/auto-docs.yml` (+3, -3)
- `AGENTS.md` (+1, -0)
- `bun.lock` (+16, -16)
- `package.json` (+1, -1)
- `packages/app/package.json` (+1, -1)
- `packages/app/src/context/language.tsx` (+1, -2)
- `packages/app/src/i18n/ar.ts` (+1, -2)
- `packages/app/src/i18n/fr.ts` (+2, -4)
- `packages/app/src/i18n/th.ts` (+1, -2)
- `packages/app/src/i18n/tr.ts` (+1, -2)
- `packages/app/src/i18n/zht.ts` (+1, -2)
- `packages/app/src/pages/layout/sidebar-items.tsx` (+1, -3)
- `packages/desktop-electron/package.json` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/desktop/src/i18n/de.ts` (+1, -2)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/agents/auto-model.md` (+14, -14)
- `packages/kilo-docs/pages/gateway/models-and-providers.md` (+5, -5)
- `packages/kilo-docs/source-links.md` (+3, -1)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-gateway/src/api/modes.ts` (+99, -0)
- `packages/kilo-gateway/src/index.ts` (+6, -0)
- `packages/kilo-gateway/src/server/routes.ts` (+75, -0)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/message-part.css` (+28, -10)
- `packages/kilo-ui/src/components/message-part.tsx` (+14, -0)
- `packages/kilo-ui/src/components/text-shimmer.tsx` (+1, -1)
- `packages/kilo-ui/src/components/tool-count-summary.tsx` (+1, -1)
- `packages/kilo-ui/src/stories/basic-tool.stories.tsx` (+1, -6)
- `packages/kilo-ui/src/stories/message-part.stories.tsx` (+88, -0)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-messagepart/full-conversation-turn-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-messagepart/tool-hint-errors-chromium-linux.png` (+3, -0)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-messagepart/user-message-story-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-sessionturn/default-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-sessionturn/with-steps-expanded-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-sessionturn/working-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/AGENTS.md` (+10, -0)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+2, -0)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+6, -1)
- `packages/kilo-vscode/src/agent-manager/GitOps.ts` (+22, -21)
- `packages/kilo-vscode/src/agent-manager/env-copy.ts` (+85, -0)
- `packages/kilo-vscode/src/agent-manager/shell-env.ts` (+7, -9)
- `packages/kilo-vscode/src/kilo-provider/handlers/auth.ts` (+6, -0)
- `packages/kilo-vscode/src/services/autocomplete/AutocompleteModel.ts` (+29, -1)
- `packages/kilo-vscode/src/services/autocomplete/AutocompleteServiceManager.ts` (+37, -1)
- `packages/kilo-vscode/src/services/autocomplete/classic-auto-complete/AutocompleteInlineCompletionProvider.ts` (+59, -15)
- `packages/kilo-vscode/src/services/autocomplete/classic-auto-complete/ErrorBackoff.ts` (+170, -0)
- `packages/kilo-vscode/src/services/autocomplete/classic-auto-complete/FillInTheMiddle.ts` (+0, -1)
- `packages/kilo-vscode/src/services/autocomplete/classic-auto-complete/HoleFiller.ts` (+0, -200)
- `packages/kilo-vscode/src/services/autocomplete/classic-auto-complete/__tests__/AutocompleteInlineCompletionProvider.test.ts` (+57, -75)
- `packages/kilo-vscode/src/services/autocomplete/classic-auto-complete/__tests__/HoleFiller.test.ts` (+0, -301)
- `packages/kilo-vscode/src/services/autocomplete/classic-auto-complete/hole-filler-utils.ts` (+0, -19)
- `packages/kilo-vscode/src/services/autocomplete/i18n/ar.ts` (+5, -0)
- `packages/kilo-vscode/src/services/autocomplete/i18n/ca.ts` (+5, -0)
- `packages/kilo-vscode/src/services/autocomplete/i18n/cs.ts` (+5, -0)
- `packages/kilo-vscode/src/services/autocomplete/i18n/de.ts` (+5, -0)
- `packages/kilo-vscode/src/services/autocomplete/i18n/en.ts` (+5, -0)
- `packages/kilo-vscode/src/services/autocomplete/i18n/es.ts` (+5, -0)
- `packages/kilo-vscode/src/services/autocomplete/i18n/fr.ts` (+5, -0)
- `packages/kilo-vscode/src/services/autocomplete/i18n/hi.ts` (+5, -0)
- `packages/kilo-vscode/src/services/autocomplete/i18n/id.ts` (+5, -0)
- `packages/kilo-vscode/src/services/autocomplete/i18n/it.ts` (+5, -0)
- `packages/kilo-vscode/src/services/autocomplete/i18n/ja.ts` (+5, -0)
- `packages/kilo-vscode/src/services/autocomplete/i18n/ko.ts` (+5, -0)
- `packages/kilo-vscode/src/services/autocomplete/i18n/nl.ts` (+5, -0)
- `packages/kilo-vscode/src/services/autocomplete/i18n/pl.ts` (+5, -0)
- `packages/kilo-vscode/src/services/autocomplete/i18n/pt-BR.ts` (+5, -0)
- `packages/kilo-vscode/src/services/autocomplete/i18n/ru.ts` (+5, -0)
- `packages/kilo-vscode/src/services/autocomplete/i18n/sk.ts` (+5, -0)
- `packages/kilo-vscode/src/services/autocomplete/i18n/th.ts` (+5, -0)
- `packages/kilo-vscode/src/services/autocomplete/i18n/tr.ts` (+5, -0)
- `packages/kilo-vscode/src/services/autocomplete/i18n/uk.ts` (+5, -0)
- `packages/kilo-vscode/src/services/autocomplete/i18n/vi.ts` (+5, -0)
- `packages/kilo-vscode/src/services/autocomplete/i18n/zh-CN.ts` (+4, -0)
- `packages/kilo-vscode/src/services/autocomplete/i18n/zh-TW.ts` (+4, -0)
- `packages/kilo-vscode/src/services/autocomplete/types.ts` (+2, -15)
- `packages/kilo-vscode/src/services/cli-backend/server-manager.ts` (+2, -2)
- `packages/kilo-vscode/src/services/commit-message/__tests__/index.spec.ts` (+87, -28)
- `packages/kilo-vscode/src/services/commit-message/index.ts` (+92, -55)
- `packages/kilo-vscode/src/services/marketplace/installer.ts` (+1, -4)
- `packages/kilo-vscode/src/services/telemetry/telemetry-proxy.ts` (+1, -0)
- `packages/kilo-vscode/src/util/process.ts` (+35, -0)
- `packages/kilo-vscode/tests/unit/autocomplete-error-backoff.test.ts` (+250, -0)
- `packages/kilo-vscode/tests/unit/env-copy.test.ts` (+131, -0)
- `packages/kilo-vscode/tests/unit/hole-filler-utils.test.ts` (+0, -61)
- `packages/kilo-vscode/tests/unit/path-mentions.test.ts` (+130, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/chat/welcome-with-switcher-and-notification-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+47, -51)
- `packages/kilo-vscode/webview-ui/agent-manager/NewWorktreeDialog.tsx` (+22, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/WorktreeItem.tsx` (+254, -198)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+29, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fr.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ja.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ko.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/nl.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/no.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/pl.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ru.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/th.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/tr.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zh.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zht.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/keybind-tokens.ts` (+23, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/sortable-tab.tsx` (+9, -1)
- `packages/kilo-vscode/webview-ui/src/App.tsx` (+1, -5)
- `packages/kilo-vscode/webview-ui/src/components/chat/KiloNotifications.tsx` (+36, -30)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+20, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/QuestionDock.tsx` (+3, -2)
- `packages/kilo-vscode/webview-ui/src/components/settings/AutoApproveTab.tsx` (+0, -1)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModeSwitcher.tsx` (+11, -6)
- `packages/kilo-vscode/webview-ui/src/context/notifications.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/context/server.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+24, -7)
- `packages/kilo-vscode/webview-ui/src/hooks/useFileMention.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/hooks/useImageAttachments.ts` (+29, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+36, -19)
- `packages/kilo-vscode/webview-ui/src/stories/agent-manager.stories.tsx` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/stories/chat.stories.tsx` (+49, -0)
- `packages/kilo-vscode/webview-ui/src/styles/chat.css` (+75, -10)
- `packages/kilo-vscode/webview-ui/src/types/messages.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/utils/path-mentions.ts` (+85, -0)
- `packages/opencode/AGENTS.md` (+6, -0)
- `packages/opencode/package.json` (+7, -7)
- `packages/opencode/src/cli/cmd/tui/component/dialog-agent.tsx` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/component/prompt/index.tsx` (+10, -6)
- `packages/opencode/src/cli/cmd/tui/context/local.tsx` (+26, -5)
- `packages/opencode/src/commit-message/generate.ts` (+58, -32)
- `packages/opencode/src/config/config.ts` (+21, -0)
- `packages/opencode/src/kilocode/modes-migrator.ts` (+37, -0)
- `packages/opencode/src/mcp/index.ts` (+9, -0)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+31, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+37, -0)
- `packages/sdk/openapi.json` (+1646, -342)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/util/package.json` (+1, -1)
- `script/extract-source-links.ts` (+5, -0)
- `script/upstream/package.json` (+1, -1)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/opencode/src/agent/agent.ts
```diff
diff --git a/packages/opencode/src/agent/agent.ts b/packages/opencode/src/agent/agent.ts
index a7a8a490..6864decb 100644
--- a/packages/opencode/src/agent/agent.ts
+++ b/packages/opencode/src/agent/agent.ts
@@ -32,6 +32,7 @@ export namespace Agent {
   export const Info = z
     .object({
       name: z.string(),
+      displayName: z.string().optional(), // kilocode_change - human-readable name for org modes
       description: z.string().optional(),
       mode: z.enum(["subagent", "primary", "all"]),
       native: z.boolean().optional(),
@@ -63,7 +64,6 @@ export namespace Agent {
     const whitelistedDirs = [Truncate.GLOB, ...skillDirs.map((dir) => path.join(dir, "*"))]
     const defaults = PermissionNext.fromConfig({
       "*": "allow",
-      bash: "ask",
       doom_loop: "ask",
       external_directory: {
         "*": "ask",
@@ -329,6 +329,11 @@ export namespace Agent {
       item.name = value.name ?? item.name
       item.steps = value.steps ?? item.steps
       item.options = mergeDeep(item.options, value.options ?? {})
+      // kilocode_change  start - populate displayName from org mode options
+      if (item.options?.displayName && typeof item.options.displayName === "string") {
+        item.displayName = item.options.displayName
+      }
+      // kilocode_change end
       item.permission = PermissionNext.merge(item.permission, PermissionNext.fromConfig(value.permission ?? {}))
     }
 
@@ -469,6 +474,10 @@ export namespace Agent {
     const agent = agents[name]
     if (!agent) throw new RemoveError({ name, message: "agent not found" })
     if (agent.native) throw new RemoveError({ name, message: "cannot remove native agent" })
+    // kilocode_change start - prevent removal of organization-managed agents
+    if (agent.options?.source === "organization")
+      throw new RemoveError({ name, message: "cannot remove organization agent — manage it from the cloud dashboard" })
+    // kilocode_change end
 
     const { unlink, readFile, writeFile } = await import("fs/promises")
     let found = false
```


## opencode Changes (2a20822..2a20822)

### Commits

(no commits)

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
(no changes)

#### Other Changes
(no changes)

### Key Diffs

(no key diffs to show)

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/agent.ts
