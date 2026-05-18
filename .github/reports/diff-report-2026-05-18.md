# Upstream Changes Report
Generated: 2026-05-18 10:06:11

## Summary
- kilocode: 2 commits, 3 files changed
- opencode: 30 commits, 135 files changed

## kilocode Changes (a23fe160d..d5ba460b1)

### Commits

- d5ba460b1 - Merge pull request #10303 from Kilo-Org/docs/kiloclaw-remove-beta-messaging (Mark IJbema, 2026-05-18)
- 41ec40b34 - docs(kilo-docs): remove free beta messaging from KiloClaw pages (kiloconnect[bot], 2026-05-15)

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
- `packages/kilo-docs/pages/kiloclaw/dashboard.md` (+0, -4)
- `packages/kilo-docs/pages/kiloclaw/faq/pricing.md` (+1, -4)
- `packages/kilo-docs/pages/kiloclaw/overview.md` (+1, -1)

### Key Diffs

(no key diffs to show)

## opencode Changes (53e89f9..836a331)

### Commits

- 836a331 - fix(ui): fix question dock overflow and message part flex layout (#28142) (Brendan Allan, 2026-05-18)
- 7afd477 - chore: generate (opencode-agent[bot], 2026-05-18)
- fe143df - fix(ui): fallback to execCommand for clipboard copy when navigator.clipboard fails (#27993) (SpiritChen51, 2026-05-18)
- e94aeca - fix(tui): use contrast-aware foreground for paste summary badge (#27969) (Kagura, 2026-05-18)
- 418c0ea - feat(desktop): add notification permission for renderer (#28119) (Brendan Allan, 2026-05-18)
- 4312e5d - chore: generate (opencode-agent[bot], 2026-05-18)
- f80f3e3 - desktop: add free limit + go usage exceeded dialogs to match tui (#27677) (Brendan Allan, 2026-05-18)
- 4792064 - chore: generate (opencode-agent[bot], 2026-05-18)
- 6849059 - fix(app): hide prompt placeholder for whitespace input (#28101) (Zayd Krunz, 2026-05-18)
- 43df145 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-18)
- 28a0bf6 - sync (Frank, 2026-05-17)
- 30e4edf - chore: generate (opencode-agent[bot], 2026-05-18)
- 5452ab6 - perf(app): virtualize session timeline rows (#26949) (Luke Parker, 2026-05-18)
- e85119a - Load models.dev snapshot from build global (#28077) (Dax, 2026-05-17)
- 71b27a1 - fix: sync PWA status bar theme-color with app color scheme (#28006) (黑墨水鱼, 2026-05-18)
- 32f37d8 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-17)
- b14ea40 - chore: generate (opencode-agent[bot], 2026-05-17)
- de846ca - chore: Upgrade Bun to the final non-rust version (#27648) (Luke Parker, 2026-05-18)
- f06b787 - fix(desktop): install the latest available update (#27953) (Luke Parker, 2026-05-18)
- 969d0f4 - chore: generate (opencode-agent[bot], 2026-05-17)
- fc19dcc - fix: sort v2 session list by updated time (#27954) (Luke Parker, 2026-05-18)
- 49c6b46 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-17)
- f97e115 - dialog prompt submit keybind + opentui event sink (#27945) (Sebastian, 2026-05-18)
- e92b1fe - core: let models layer infer its own type so layer composition no longer requires matching explicit requirements (Dax Raad, 2026-05-17)
- f98449c - sync release versions for v1.15.4 (opencode, 2026-05-17)
- 468eb68 - zen: update monitoring query (Frank, 2026-05-17)
- 23b594d - fix: preserve bus instance context (#28051) (Dax, 2026-05-17)
- 5060577 - sync (Frank, 2026-05-17)
- d3ebb1f - ignore: cleanup readme (#28049) (Aiden Cline, 2026-05-17)
- e4cc4e1 - fix(lsp): preserve instance ref for update events (#28016) (Shoubhit Dash, 2026-05-17)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
(no changes)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
- `packages/opencode/src/bus/index.ts` (+4, -1)

#### Core (**/core/)
- `packages/console/core/package.json` (+1, -1)
- `packages/console/core/sst-env.d.ts` (+0, -1)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/{models.ts => models-dev.ts}` (+7, -10)
- `packages/core/src/models-snapshot.d.ts` (+0, -2)
- `packages/core/src/models-snapshot.js` (+0, -71726)
- `packages/core/src/plugin/models-dev.ts` (+1, -1)
- `packages/core/test/models.test.ts` (+3, -3)

#### Other Changes
- `README.ar.md` (+0, -12)
- `README.bn.md` (+0, -12)
- `README.br.md` (+0, -12)
- `README.bs.md` (+0, -12)
- `README.da.md` (+0, -12)
- `README.de.md` (+0, -12)
- `README.es.md` (+0, -12)
- `README.fr.md` (+0, -12)
- `README.gr.md` (+0, -12)
- `README.it.md` (+0, -12)
- `README.ja.md` (+0, -12)
- `README.ko.md` (+0, -12)
- `README.md` (+0, -12)
- `README.no.md` (+0, -12)
- `README.pl.md` (+0, -12)
- `README.ru.md` (+0, -12)
- `README.th.md` (+0, -12)
- `README.tr.md` (+0, -12)
- `README.uk.md` (+0, -12)
- `README.vi.md` (+0, -12)
- `README.zh.md` (+0, -12)
- `README.zht.md` (+0, -12)
- `bun.lock` (+37, -59)
- `infra/console.ts` (+0, -3)
- `infra/monitoring.ts` (+18, -4)
- `nix/hashes.json` (+4, -4)
- `package.json` (+6, -6)
- `packages/app/index.html` (+0, -1)
- `packages/app/package.json` (+1, -1)
- `packages/app/public/oc-theme-preload.js` (+4, -0)
- `packages/app/src/components/dialog-usage-exceeded.tsx` (+44, -0)
- `packages/app/src/components/prompt-input.tsx` (+3, -3)
- `packages/app/src/context/global-sync/session-trim.ts` (+1, -0)
- `packages/app/src/pages/session.tsx` (+66, -201)
- `packages/app/src/pages/session/composer/session-question-dock.tsx` (+3, -1)
- `packages/app/src/pages/session/message-timeline.data.ts` (+368, -0)
- `packages/app/src/pages/session/message-timeline.tsx` (+1074, -604)
- `packages/app/src/pages/session/usage-exceeded-dialogs.tsx` (+102, -0)
- `packages/app/src/pages/session/use-session-hash-scroll.ts` (+3, -16)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/routes/zen/util/dataDumper.ts` (+1, -0)
- `packages/console/app/src/routes/zen/util/ipRateLimiter.ts` (+1, -1)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/function/sst-env.d.ts` (+0, -1)
- `packages/console/mail/package.json` (+1, -1)
- `packages/console/resource/sst-env.d.ts` (+0, -1)
- `packages/containers/bun-node/Dockerfile` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/desktop/src/main/updater.ts` (+4, -12)
- `packages/desktop/src/main/windows.ts` (+7, -5)
- `packages/desktop/src/renderer/index.html` (+0, -1)
- `packages/desktop/src/renderer/loading.html` (+0, -1)
- `packages/enterprise/package.json` (+1, -1)
- `packages/enterprise/src/entry-server.tsx` (+0, -1)
- `packages/enterprise/sst-env.d.ts` (+0, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/function/package.json` (+1, -1)
- `packages/function/sst-env.d.ts` (+0, -1)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/.gitignore` (+0, -2)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/script/build-node.ts` (+2, -1)
- `packages/opencode/script/build.ts` (+2, -1)
- `packages/opencode/script/generate.ts` (+2, -11)
- `packages/opencode/src/cli/cmd/github.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/models.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/providers.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/app.tsx` (+1, -0)
- `packages/opencode/src/cli/cmd/tui/config/keybind.ts` (+1, -0)
- `packages/opencode/src/cli/cmd/tui/context/theme.tsx` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/ui/dialog-prompt.tsx` (+33, -8)
- `packages/opencode/src/cli/upgrade.ts` (+24, -4)
- `packages/opencode/src/config/agent.ts` (+2, -14)
- `packages/opencode/src/config/command.ts` (+1, -8)
- `packages/opencode/src/effect/app-runtime.ts` (+1, -1)
- `packages/opencode/src/file/watcher.ts` (+4, -4)
- `packages/opencode/src/lsp/lsp.ts` (+1, -1)
- `packages/opencode/src/provider/model-status.ts` (+1, -1)
- `packages/opencode/src/provider/provider.ts` (+1, -1)
- `packages/opencode/src/provider/transform.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/provider.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2/session.ts` (+8, -2)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+1, -1)
- `packages/opencode/src/session/compaction.ts` (+0, -12)
- `packages/opencode/src/v2/session.ts` (+8, -6)
- `packages/opencode/test/cli/tui/dialog-prompt.test.tsx` (+146, -0)
- `packages/opencode/test/config/tui.test.ts` (+2, -0)
- `packages/opencode/test/lsp/index.test.ts` (+33, -2)
- `packages/opencode/test/provider/model-status.test.ts` (+1, -1)
- `packages/opencode/test/provider/provider.test.ts` (+1, -1)
- `packages/opencode/test/session/llm.test.ts` (+1, -1)
- `packages/plugin/package.json` (+4, -4)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+83, -83)
- `packages/sdk/openapi.json` (+206, -206)
- `packages/slack/package.json` (+1, -1)
- `packages/ui/package.json` (+2, -1)
- `packages/ui/src/components/basic-tool.tsx` (+61, -16)
- `packages/ui/src/components/message-part.css` (+1, -1)
- `packages/ui/src/components/message-part.tsx` (+63, -26)
- `packages/ui/src/components/timeline-playground.stories.tsx` (+1, -1)
- `packages/ui/src/context/dialog.tsx` (+2, -1)
- `packages/ui/src/i18n/ar.ts` (+9, -0)
- `packages/ui/src/i18n/br.ts` (+9, -0)
- `packages/ui/src/i18n/bs.ts` (+9, -0)
- `packages/ui/src/i18n/da.ts` (+9, -0)
- `packages/ui/src/i18n/de.ts` (+9, -0)
- `packages/ui/src/i18n/en.ts` (+9, -0)
- `packages/ui/src/i18n/es.ts` (+9, -0)
- `packages/ui/src/i18n/fr.ts` (+9, -0)
- `packages/ui/src/i18n/ja.ts` (+9, -0)
- `packages/ui/src/i18n/ko.ts` (+9, -0)
- `packages/ui/src/i18n/no.ts` (+9, -0)
- `packages/ui/src/i18n/pl.ts` (+9, -0)
- `packages/ui/src/i18n/ru.ts` (+9, -0)
- `packages/ui/src/i18n/th.ts` (+9, -0)
- `packages/ui/src/i18n/tr.ts` (+9, -0)
- `packages/ui/src/i18n/zh.ts` (+8, -0)
- `packages/ui/src/i18n/zht.ts` (+8, -0)
- `packages/ui/src/theme/context.tsx` (+4, -0)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/keybinds.mdx` (+1, -0)
- `script/upgrade-opentui.ts` (+52, -10)
- `sdks/vscode/package.json` (+1, -1)
- `sst-env.d.ts` (+0, -4)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index c656037..3d6c5ec 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.15.3",
+  "version": "1.15.4",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/console/core/sst-env.d.ts
```diff
diff --git a/packages/console/core/sst-env.d.ts b/packages/console/core/sst-env.d.ts
index 088db5b..5f1d5d5 100644
--- a/packages/console/core/sst-env.d.ts
+++ b/packages/console/core/sst-env.d.ts
@@ -296,7 +296,6 @@ declare module "sst" {
     "AuthStorage": cloudflare.KVNamespace
     "Bucket": cloudflare.R2Bucket
     "EnterpriseStorage": cloudflare.R2Bucket
-    "GatewayKv": cloudflare.KVNamespace
     "LogProcessor": cloudflare.Service
     "Stat": cloudflare.Service
     "ZenData": cloudflare.R2Bucket
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index edf3ce8..3ad1187 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.15.3",
+  "version": "1.15.4",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/{models.ts => models-dev.ts}
```diff
```

#### packages/core/src/models-snapshot.d.ts
```diff
diff --git a/packages/core/src/models-snapshot.d.ts b/packages/core/src/models-snapshot.d.ts
deleted file mode 100644
index 839eba6..0000000
--- a/packages/core/src/models-snapshot.d.ts
+++ /dev/null
@@ -1,2 +0,0 @@
-// Auto-generated by build.ts - do not edit
-export declare const snapshot: Record<string, unknown>
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- No specific recommendations - review changes manually
