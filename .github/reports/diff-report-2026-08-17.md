# Upstream Changes Report
Generated: 2026-08-17 06:55:45

## Summary
- kilocode: 5 commits, 19 files changed
- opencode: 7 commits, 48 files changed

## kilocode Changes (c8271ad6f..4239f9d98)

### Commits

- 4239f9d98 - Merge pull request #13023 from jperla/trustedrouter-docs (Joshua Lambert, 2026-08-16)
- 87ba0569f - Merge branch 'main' into trustedrouter-docs (Joshua Lambert, 2026-08-16)
- 90a93a7aa - feat(opencode): link sessions to their pull request (#13137) (Igor Šćekić, 2026-08-16)
- 9851253b7 - docs: recommend /connect for TrustedRouter CLI setup (Joseph Perla, 2026-08-15)
- 5766f7e96 - docs: add TrustedRouter provider page (Joseph Perla, 2026-08-08)

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
- `.changeset/session-pr-link.md` (+5, -0)
- `packages/kilo-docs/lib/nav/ai-providers.ts` (+1, -0)
- `packages/kilo-docs/markdoc/partials/cli-commands-table.md` (+1, -1)
- `packages/kilo-docs/pages/ai-providers/index.md` (+1, -0)
- `packages/kilo-docs/pages/ai-providers/trustedrouter.md` (+87, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli-reference.md` (+49, -0)
- `packages/opencode/src/cli/cmd/pr.ts` (+85, -3)
- `packages/opencode/src/kilo-sessions/ingest-queue.ts` (+9, -1)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+62, -1)
- `packages/opencode/src/kilo-sessions/pr-link.test.ts` (+159, -0)
- `packages/opencode/src/kilo-sessions/pr-link.ts` (+107, -0)
- `packages/opencode/src/kilo-sessions/remote-protocol.ts` (+11, -0)
- `packages/opencode/test/cli/help/__snapshots__/help-snapshots.test.ts.snap` (+7, -4)
- `packages/opencode/test/cli/pr-status.test.ts` (+73, -0)
- `packages/opencode/test/kilocode/help.test.ts` (+8, -0)
- `packages/opencode/test/kilocode/kilo-sessions.test.ts` (+253, -1)
- `packages/opencode/test/kilocode/sessions/ingest-queue.test.ts` (+80, -0)
- `packages/opencode/test/kilocode/sessions/remote-protocol.test.ts` (+101, -0)
- `script/check-opencode-promise-facades.ts` (+3, -2)

### Key Diffs

(no key diffs to show)

## opencode Changes (976c185..4d68d30)

### Commits

- 4d68d30 - tweak: match codex limits for openai models exactly when using chatgpt subscription (#39082) (Game On, 2026-08-17)
- 5a0e07e - chore: generate (opencode-agent[bot], 2026-08-17)
- cba6b5f - feat(opencode): native OpenAI and Anthropic passthroughs for Cloudflare AI Gateway (#42634) (Aiden Cline, 2026-08-16)
- 1c96545 - fix(stats): correct YouTube footer link (#42941) (opencode-agent[bot], 2026-08-16)
- a0f8dcc - docs: update DeepSeek V4 pricing (#42881) (Jack, 2026-08-17)
- fb8344f - chore: remove scheduled beta sync (Dax Raad, 2026-08-16)
- 3fd77ae - zen: peak pricing (Frank, 2026-08-16)

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
- `packages/console/core/src/model.ts` (+1, -0)
- `packages/core/src/plugin/provider/cloudflare-ai-gateway.ts` (+7, -1)

#### Other Changes
- `.github/workflows/beta.yml` (+0, -37)
- `packages/console/app/src/routes/go/index.tsx` (+5, -11)
- `packages/console/app/src/routes/zen/util/handler.ts` (+7, -4)
- `packages/opencode/src/plugin/cloudflare.ts` (+0, -11)
- `packages/opencode/src/plugin/openai/codex.ts` (+4, -9)
- `packages/opencode/src/provider/provider.ts` (+36, -5)
- `packages/opencode/test/plugin/cloudflare.test.ts` (+5, -48)
- `packages/opencode/test/plugin/codex.test.ts` (+3, -3)
- `packages/opencode/test/provider/cf-ai-gateway-e2e.test.ts` (+216, -40)
- `packages/stats/app/src/routes/stats-shell.tsx` (+1, -1)
- `packages/web/src/content/docs/ar/go.mdx` (+10, -6)
- `packages/web/src/content/docs/ar/zen.mdx` (+6, -2)
- `packages/web/src/content/docs/bs/go.mdx` (+10, -6)
- `packages/web/src/content/docs/bs/zen.mdx` (+6, -2)
- `packages/web/src/content/docs/da/go.mdx` (+10, -6)
- `packages/web/src/content/docs/da/zen.mdx` (+6, -2)
- `packages/web/src/content/docs/de/go.mdx` (+10, -6)
- `packages/web/src/content/docs/de/zen.mdx` (+6, -2)
- `packages/web/src/content/docs/es/go.mdx` (+10, -6)
- `packages/web/src/content/docs/es/zen.mdx` (+6, -2)
- `packages/web/src/content/docs/fr/go.mdx` (+10, -6)
- `packages/web/src/content/docs/fr/zen.mdx` (+6, -2)
- `packages/web/src/content/docs/go.mdx` (+10, -6)
- `packages/web/src/content/docs/it/go.mdx` (+10, -6)
- `packages/web/src/content/docs/it/zen.mdx` (+6, -2)
- `packages/web/src/content/docs/ja/go.mdx` (+10, -6)
- `packages/web/src/content/docs/ja/zen.mdx` (+6, -2)
- `packages/web/src/content/docs/ko/go.mdx` (+10, -6)
- `packages/web/src/content/docs/ko/zen.mdx` (+6, -2)
- `packages/web/src/content/docs/nb/go.mdx` (+10, -6)
- `packages/web/src/content/docs/nb/zen.mdx` (+6, -2)
- `packages/web/src/content/docs/pl/go.mdx` (+10, -6)
- `packages/web/src/content/docs/pl/zen.mdx` (+6, -2)
- `packages/web/src/content/docs/pt-br/go.mdx` (+10, -6)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+6, -2)
- `packages/web/src/content/docs/ru/go.mdx` (+10, -6)
- `packages/web/src/content/docs/ru/zen.mdx` (+6, -2)
- `packages/web/src/content/docs/th/go.mdx` (+10, -6)
- `packages/web/src/content/docs/th/zen.mdx` (+6, -2)
- `packages/web/src/content/docs/tr/go.mdx` (+10, -6)
- `packages/web/src/content/docs/tr/zen.mdx` (+6, -2)
- `packages/web/src/content/docs/zen.mdx` (+6, -2)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+10, -6)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+6, -2)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+10, -6)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+6, -2)

### Key Diffs

#### packages/console/core/src/model.ts
```diff
diff --git a/packages/console/core/src/model.ts b/packages/console/core/src/model.ts
index f4ac401..ffba490 100644
--- a/packages/console/core/src/model.ts
+++ b/packages/console/core/src/model.ts
@@ -24,6 +24,7 @@ export namespace ZenData {
     cost: ModelCostSchema,
     costMultiplier: z.number().default(1),
     cost200K: ModelCostSchema.optional(),
+    costPeak: ModelCostSchema.optional(),
     allowAnonymous: z.boolean().optional(),
     byokProvider: z.enum(["openai", "anthropic", "google"]).optional(),
     stickyProvider: z.enum(["strict", "prefer"]).optional(),
```

#### packages/core/src/plugin/provider/cloudflare-ai-gateway.ts
```diff
diff --git a/packages/core/src/plugin/provider/cloudflare-ai-gateway.ts b/packages/core/src/plugin/provider/cloudflare-ai-gateway.ts
index d416f6f..2803cb7 100644
--- a/packages/core/src/plugin/provider/cloudflare-ai-gateway.ts
+++ b/packages/core/src/plugin/provider/cloudflare-ai-gateway.ts
@@ -24,9 +24,15 @@ export const CloudflareAIGatewayPlugin = define({
           apiKey: config.apiKey,
           options: gatewayOptions(evt.options, metadata),
         } as any)
-        const unified = createUnified({ apiKey: config.apiKey })
         evt.sdk = {
           languageModel(modelID: string) {
+            // Workers AI is the only first-party provider whose upstream is Cloudflare itself, so it is
+            // the only one that should receive the Cloudflare token as its upstream Authorization header.
+            // The Unified API addresses Workers AI both with the explicit "workers-ai/" prefix and as
+            // bare "@cf/..." ids. Third-party providers must not receive the token; they rely on the
+            // gateway's stored/BYOK keys instead.
+            const isWorkersAi = modelID.startsWith("workers-ai/") || modelID.startsWith("@cf/")
+            const unified = createUnified(isWorkersAi ? { apiKey: config.apiKey } : {})
             return gateway(unified(modelID))
           },
         }
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- No specific recommendations - review changes manually
