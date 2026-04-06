# Upstream Changes Report
Generated: 2026-04-06 07:45:49

## Summary
- kilocode: 2 commits, 66 files changed
- opencode: 12 commits, 46 files changed

## kilocode Changes (cb0c58c0..e10324aa)

### Commits

- e10324aa - release: v7.1.21 (kilo-maintainer[bot], 2026-04-05)
- c0a08add - Session migration improvements (#8367) (Imanol Maiztegui, 2026-04-05)

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
- `bun.lock` (+16, -16)
- `package.json` (+1, -1)
- `packages/app/package.json` (+1, -1)
- `packages/desktop-electron/package.json` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+4, -0)
- `packages/kilo-vscode/src/kilo-provider/handlers/migration.ts` (+34, -16)
- `packages/kilo-vscode/src/legacy-migration/legacy-types.ts` (+24, -2)
- `packages/kilo-vscode/src/legacy-migration/migration-service.ts` (+48, -10)
- `packages/kilo-vscode/src/legacy-migration/migration-session-progress.ts` (+37, -0)
- `packages/kilo-vscode/src/legacy-migration/sessions/migrate.ts` (+62, -10)
- `packages/kilo-vscode/tests/unit/legacy-migration/migrate.test.ts` (+63, -4)
- `packages/kilo-vscode/tests/unit/legacy-migration/session-summary-state.test.ts` (+33, -0)
- `packages/kilo-vscode/webview-ui/src/components/migration/ForceReimportDialog.tsx` (+47, -0)
- `packages/kilo-vscode/webview-ui/src/components/migration/MigrationWizard.tsx` (+111, -34)
- `packages/kilo-vscode/webview-ui/src/components/migration/RunningMigrationDialog.tsx` (+40, -0)
- `packages/kilo-vscode/webview-ui/src/components/migration/SessionMigrationCard.tsx` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/components/migration/SessionMigrationProgress.tsx` (+102, -0)
- `packages/kilo-vscode/webview-ui/src/components/migration/SessionMigrationSummary.tsx` (+164, -0)
- `packages/kilo-vscode/webview-ui/src/components/migration/index.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/components/migration/migration.css` (+300, -0)
- `packages/kilo-vscode/webview-ui/src/components/migration/session-migration-format.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/components/migration/session-migration-summary-format.ts` (+49, -0)
- `packages/kilo-vscode/webview-ui/src/components/migration/session-migration-summary-state.ts` (+76, -0)
- `packages/kilo-vscode/webview-ui/src/context/language.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+29, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+29, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+32, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+29, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+29, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages.ts` (+33, -4)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/kilocode/session-import/service.ts` (+27, -3)
- `packages/opencode/src/kilocode/session-import/types.ts` (+1, -0)
- `packages/opencode/test/kilocode/session-import-service.test.ts` (+121, -0)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+2, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+1, -0)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/util/package.json` (+1, -1)
- `script/upstream/package.json` (+1, -1)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

(no key diffs to show)

## opencode Changes (3a0e00d..517e6c9)

### Commits

- 517e6c9 - release: v1.3.17 (opencode, 2026-04-06)
- a4a9ea4 - fix(tui): revert kitty keyboard events workaround on windows (#20180) (Luke Parker, 2026-04-06)
- eaa272e - fix: show clear error when Cloudflare provider env vars are missing (#20399) (MC, 2026-04-06)
- 70b636a - zen: normalize ipv6 (Frank, 2026-04-06)
- a8fd015 - zen: remove header check (Frank, 2026-04-05)
- 342436d - release: v1.3.16 (opencode, 2026-04-06)
- 77a462c - fix(tui): default Ctrl+Z to undo on Windows (#21138) (Luke Parker, 2026-04-06)
- 9965d38 - fix: pass both 'openai' and 'azure' providerOptions keys for @ai-sdk/azure (#20272) (Corné Steenhuis, 2026-04-06)
- f0f1e51 - fix(core): implement proper configOptions for acp (#21134) (George Harker, 2026-04-05)
- 4712c18 - feat(tui): make the mouse disablable (#6824, #7926) (#13748) (Gautier DI FOLCO, 2026-04-05)
- 9e156ea - chore: update nix node_modules hashes (opencode-agent[bot], 2026-04-06)
- 68f4aa2 - fix(plugin): parse package specifiers with npm-package-arg and sanitize win32 cache paths (#21135) (Luke Parker, 2026-04-06)

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
- `packages/console/core/src/subscription.ts` (+0, -2)

#### Other Changes
- `bun.lock` (+18, -16)
- `nix/hashes.json` (+4, -4)
- `packages/app/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/routes/zen/util/handler.ts` (+2, -1)
- `packages/console/app/src/routes/zen/util/rateLimiter.ts` (+2, -3)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/mail/package.json` (+1, -1)
- `packages/desktop-electron/package.json` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/enterprise/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/function/package.json` (+1, -1)
- `packages/opencode/package.json` (+3, -1)
- `packages/opencode/src/acp/agent.ts` (+84, -0)
- `packages/opencode/src/auth/index.ts` (+1, -0)
- `packages/opencode/src/cli/cmd/tui/app.tsx` (+5, -1)
- `packages/opencode/src/cli/cmd/tui/component/dialog-provider.tsx` (+11, -1)
- `packages/opencode/src/cli/cmd/tui/component/prompt/index.tsx` (+1, -15)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/home/tips-view.tsx` (+3, -1)
- `packages/opencode/src/config/tui-schema.ts` (+1, -0)
- `packages/opencode/src/config/tui.ts` (+9, -1)
- `packages/opencode/src/flag/flag.ts` (+1, -0)
- `packages/opencode/src/npm/index.ts` (+7, -1)
- `packages/opencode/src/plugin/cloudflare.ts` (+67, -0)
- `packages/opencode/src/plugin/index.ts` (+9, -1)
- `packages/opencode/src/plugin/shared.ts` (+22, -6)
- `packages/opencode/src/provider/provider.ts` (+38, -7)
- `packages/opencode/src/provider/transform.ts` (+6, -0)
- `packages/opencode/test/config/tui.test.ts` (+48, -0)
- `packages/opencode/test/npm.test.ts` (+18, -0)
- `packages/opencode/test/plugin/shared.test.ts` (+88, -0)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+3, -0)
- `packages/sdk/openapi.json` (+9, -0)
- `packages/slack/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/util/package.json` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/cli.mdx` (+1, -0)
- `packages/web/src/content/docs/config.mdx` (+2, -3)
- `packages/web/src/content/docs/tui.mdx` (+3, -1)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 3a1fa33..ae5185e 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.3.15",
+  "version": "1.3.17",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/console/core/src/subscription.ts
```diff
diff --git a/packages/console/core/src/subscription.ts b/packages/console/core/src/subscription.ts
index 9d6c3ce..bee5818 100644
--- a/packages/console/core/src/subscription.ts
+++ b/packages/console/core/src/subscription.ts
@@ -9,8 +9,6 @@ export namespace Subscription {
     free: z.object({
       promoTokens: z.number().int(),
       dailyRequests: z.number().int(),
-      checkHeader: z.string(),
-      fallbackValue: z.number().int(),
     }),
     lite: z.object({
       rollingLimit: z.number().int(),
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- No specific recommendations - review changes manually
