# Upstream Changes Report
Generated: 2026-10-21 11:18:34

## Summary
- kilocode: 0 commits, 0 files changed
- opencode: 51 commits, 224 files changed

## kilocode Changes (5cc65d121..5cc65d121)

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

## opencode Changes (d814879..3a1f9a9)

### Commits

- 3a1f9a9 - docs(go): end Step 5 Preview usage promotion (#57718) (opencode-agent[bot], 2026-10-21)
- 4d59657 - fix(console): remove free model daily request quota from Go FAQ (#57663) (opencode-agent[bot], 2026-10-21)
- 79fd806 - feat(server): list experimental voice models (#57194) (Kit Langton, 2026-10-20)
- a2cb1c4 - refactor(ai): use OpenAIChat assistant hook and drop OpenRouterBody cast (#57616) (Aiden Cline, 2026-10-21)
- d2812d1 - fix(core): tighten session title prompt (#57648) (Aiden Cline, 2026-10-21)
- c3b613c - fix(core): resolve relative directories during V1 migration (#57618) (MohammadAlMasalmeh, 2026-10-21)
- 94bc566 - fix(core): keep unsupported MCP media out of tool attachments (#57640) (Aiden Cline, 2026-10-21)
- 15adc3d - fix(core): send only changed entries in instruction updates (#57626) (Aiden Cline, 2026-10-20)
- 17ebb66 - chore(function): remove exchange_github_app_token_with_pat route (#57630) (Dax, 2026-10-21)
- c9b5a9f - refactor(ai): remove dead option/schema helpers and use knownString (#57607) (Aiden Cline, 2026-10-20)
- b991ba8 - refactor(ai): remove redundant runtime type checks on schema-decoded values (#57605) (Aiden Cline, 2026-10-20)
- 8c60f94 - refactor(ai): use typed choice.usage in openai-chat parser (#57596) (Aiden Cline, 2026-10-20)
- 4b50f5c - sync release versions for v2.1.2 [skip ci] (opencode, 2026-10-21)
- 35a2cf3 - refactor(ai): replace loose Schema.Unknown and catch-all union checks in protocols (#57606) (Aiden Cline, 2026-10-20)
- cc996ee - refactor(ai): deduplicate JSON, record, and URL query helpers (#57604) (Aiden Cline, 2026-10-20)
- 51626ee - refactor(ai): tighten EvaluationRequest typing and deduplicate request normalization (#57601) (Aiden Cline, 2026-10-20)
- 5c52626 - fix(core): generate titles at the lowest model variant (#51939) (Aiden Cline, 2026-10-20)
- c600cdd - refactor(ai,core): drop redundant typeof check on endpoint.baseURL (#57597) (Aiden Cline, 2026-10-20)
- 6843fb7 - refactor(ai): reuse JsonObject, ProviderMetadata, and responseHttp across protocols and gateways (#57615) (Aiden Cline, 2026-10-20)
- 678e49d - refactor(ai): remove unused WebSocket jsonTransport (#57611) (Aiden Cline, 2026-10-20)
- aae5214 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-10-21)
- 0ceeb24 - chore(cli): update opentunnel client (#57287) (Aiden Cline, 2026-10-20)
- aadd4d8 - feat(core): add OPENCODE_DISABLE_FREE_MODELS to hide free models (#57478) (Dax, 2026-10-20)
- dbe08dd - fix(tui): only show location unavailable when the server reports it missing (#57594) (Aiden Cline, 2026-10-20)
- 80b8762 - fix(core): forward retryAfterMs across provider session errors (#57589) (Aiden Cline, 2026-10-20)
- 7d3752c - fix(core): send legacy console.opencode.ai credentials to opencode.ai/console (#57588) (Dax, 2026-10-20)
- adcda1b - feat(tui): restore animated Go upsell modal on free usage limit (#57471) (Kit Langton, 2026-10-20)
- 5fa426f - chore(core): refresh bundled models.dev snapshot (opencode-agent[bot], 2026-10-21)
- 5c3891e - fix(app): restore free-tier usage limit dialog, timeline line, and prompt recall (#57466) (Kit Langton, 2026-10-20)
- 86a0950 - feat(tui): show free-limit notice, recall prompt, and skip failure toast (#57467) (Kit Langton, 2026-10-20)
- f2a3414 - chore(infra): delete legacy share storage (#57548) (Dax, 2026-10-20)
- 552f867 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-10-20)
- a9fa57b - feat(core): typed free-limit error with reset time (#57146) (Kit Langton, 2026-10-20)
- db1fbe8 - fix(desktop): upgrade Electron to 44.9.1 (#57533) (opencode-agent[bot], 2026-10-20)
- 4424391 - fix(install): create ~/.zshrc when it's missing so opencode lands on PATH (#57348) (Kit Langton, 2026-10-20)
- 2cb963c - docs(console): add Muse Wonder 1.0 (Frank, 2026-10-20)
- 3fdb13b - fix(stats): retry failed syncs instead of waiting an hour (#57516) (Adam, 2026-10-20)
- d898c04 - feat(core): add experimental.location_idle_timeout (#57476) (Aiden Cline, 2026-10-20)
- a13c48b - fix(ai): send expires_after.anchor for OpenAI realtime client secrets (#57514) (Kit Langton, 2026-10-20)
- 0718864 - feat(console): restore fail-open Jev spam scoring on the enterprise form (#57489) (Victor Navarro, 2026-10-20)
- 3b593dd - fix(codemode): run each job to completion (#54276) (Rhys Sullivan, 2026-10-20)
- c8e2e1e - fix(core): reuse recent Console config checks for rejected inference (#57465) (Dax, 2026-10-20)
- 772e2ae - chore(console): remove legacy Console leftovers from the website (#57434) (Victor Navarro, 2026-10-20)
- 5916014 - refactor(console): remove Jev spam scoring from enterprise form (#57446) (Victor Navarro, 2026-10-20)
- a62028d - feat(console): add hCaptcha to enterprise form (#57439) (Victor Navarro, 2026-10-20)
- 89d996c - fix(core): keep locations with running sessions or background jobs (#57416) (James Long, 2026-10-20)
- 50c5fce - chore(function): remove remaining share endpoints (#57328) (Dax, 2026-10-20)
- 133b1eb - sync release versions for v2.1.1 [skip ci] (opencode, 2026-10-20)
- e9ac459 - fix(core): build provider variants after package normalization (#57075) (Victor Navarro, 2026-10-20)
- 81b2d7a - chore(core): refresh bundled models.dev snapshot (opencode-agent[bot], 2026-10-20)
- 930c0c8 - docs(console): explain API keys and scoped permissions (#57386) (Victor Navarro, 2026-10-20)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/core/src/tool/mcp.ts` (+25, -10)
- `packages/core/src/tool/plugin/mcp-resource.ts` (+4, -1)
- `packages/core/src/tool/plugin/webfetch.ts` (+2, -10)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/config/normalize.ts` (+9, -0)
- `packages/core/src/config/plugin/provider.ts` (+3, -0)
- `packages/core/src/database/path.ts` (+7, -4)
- `packages/core/src/database/v1-migration.bun.ts` (+22, -6)
- `packages/core/src/job.ts` (+11, -0)
- `packages/core/src/location-activity.ts` (+51, -35)
- `packages/core/src/mcp/client.ts` (+2, -2)
- `packages/core/src/mcp/instructions.ts` (+8, -2)
- `packages/core/src/mime.ts` (+10, -0)
- `packages/core/src/model.ts` (+6, -0)
- `packages/core/src/models-dev/snapshot.txt` (+1, -1)
- `packages/core/src/plugin/agent.ts` (+20, -44)
- `packages/core/src/plugin/provider/opencode.ts` (+35, -6)
- `packages/core/src/reference/instructions.ts` (+8, -2)
- `packages/core/src/session/context.ts` (+27, -9)
- `packages/core/src/session/execution.ts` (+3, -6)
- `packages/core/src/session/model-request.ts` (+1, -1)
- `packages/core/src/session/run-coordinator.ts` (+3, -25)
- `packages/core/src/session/title.ts` (+10, -4)
- `packages/core/src/session/to-session-error.ts` (+10, -1)
- `packages/core/src/skill/instructions.ts` (+8, -2)
- `packages/core/src/tool-output.ts` (+9, -0)
- `packages/core/src/voice.ts` (+37, -5)
- `packages/core/test/browser-idle.test.ts` (+2, -1)
- `packages/core/test/config/normalization.test.ts` (+9, -3)
- `packages/core/test/config/provider.test.ts` (+46, -1)
- `packages/core/test/location-activity.test.ts` (+180, -113)
- `packages/core/test/location-layer.test.ts` (+16, -11)
- `packages/core/test/mcp-instructions.test.ts` (+3, -11)
- `packages/core/test/mcp.test.ts` (+57, -0)
- `packages/core/test/model-free.test.ts` (+90, -0)
- `packages/core/test/plugin/provider-opencode.test.ts` (+147, -14)
- `packages/core/test/reference-instructions.test.ts` (+36, -0)
- `packages/core/test/session-error.test.ts` (+61, -2)
- `packages/core/test/session-runner.test.ts` (+4, -2)
- `packages/core/test/session-title.test.ts` (+92, -0)
- `packages/core/test/skill/instructions.test.ts` (+14, -10)
- `packages/core/test/v1-migration.test.ts` (+38, -2)
- `packages/core/test/voice.test.ts` (+80, -33)
- `packages/stats/core/package.json` (+1, -1)
- `packages/stats/core/src/r2-sql.test.ts` (+50, -1)
- `packages/stats/core/src/r2-sql.ts` (+9, -3)

#### Other Changes
- `CHANGELOG.md` (+58, -0)
- `bun.lock` (+38, -38)
- `github/README.md` (+2, -2)
- `github/index.ts` (+9, -23)
- `infra/app.ts` (+4, -14)
- `infra/console.ts` (+5, -27)
- `infra/share.ts` (+0, -3)
- `install` (+17, -0)
- `nix/hashes.json` (+3, -3)
- `package.json` (+1, -1)
- `packages/ai/package.json` (+1, -1)
- `packages/ai/src/experimental.ts` (+1, -0)
- `packages/ai/src/experimental/evaluation.ts` (+9, -16)
- `packages/ai/src/experimental/realtime.ts` (+35, -26)
- `packages/ai/src/experimental/system-one.ts` (+12, -9)
- `packages/ai/src/llm.ts` (+4, -8)
- `packages/ai/src/media.ts` (+3, -3)
- `packages/ai/src/promise.ts` (+3, -7)
- `packages/ai/src/protocols/alibaba-chat.ts` (+3, -5)
- `packages/ai/src/protocols/alibaba-messages.ts` (+1, -1)
- `packages/ai/src/protocols/anthropic-messages.ts` (+10, -12)
- `packages/ai/src/protocols/bedrock-converse.ts` (+2, -2)
- `packages/ai/src/protocols/cohere-chat.ts` (+2, -2)
- `packages/ai/src/protocols/gemini.ts` (+14, -16)
- `packages/ai/src/protocols/google-interactions.ts` (+20, -9)
- `packages/ai/src/protocols/mistral-chat.ts` (+1, -4)
- `packages/ai/src/protocols/open-responses.ts` (+3, -3)
- `packages/ai/src/protocols/openai-chat.ts` (+4, -5)
- `packages/ai/src/protocols/utils/open-responses-options.ts` (+4, -12)
- `packages/ai/src/protocols/utils/openai-options.ts` (+0, -25)
- `packages/ai/src/protocols/utils/partial-json.ts` (+5, -4)
- `packages/ai/src/protocols/utils/tool-schema.ts` (+0, -5)
- `packages/ai/src/protocols/venice-chat.ts` (+6, -6)
- `packages/ai/src/protocols/xai-images.ts` (+3, -4)
- `packages/ai/src/provider-error.ts` (+4, -6)
- `packages/ai/src/providers/cloudflare-ai-gateway.ts` (+3, -4)
- `packages/ai/src/providers/openai-options.ts` (+6, -3)
- `packages/ai/src/providers/openrouter.ts` (+58, -47)
- `packages/ai/src/providers/vercel-ai-gateway.ts` (+7, -6)
- `packages/ai/src/route/client.ts` (+1, -11)
- `packages/ai/src/route/executor-service.ts` (+12, -2)
- `packages/ai/src/route/executor.ts` (+7, -15)
- `packages/ai/src/route/media-protocol.ts` (+3, -5)
- `packages/ai/src/route/transport/http.ts` (+5, -11)
- `packages/ai/src/route/transport/websocket.ts` (+1, -82)
- `packages/ai/src/schema/errors.ts` (+8, -4)
- `packages/ai/test/executor.test.ts` (+8, -0)
- `packages/ai/test/provider/openrouter.test.ts` (+1, -0)
- `packages/ai/test/realtime.test.ts` (+4, -1)
- `packages/app/e2e/regression/composer.spec.ts` (+173, -1)
- `packages/app/package.json` (+1, -1)
- `packages/app/src/session/composer/region.tsx` (+38, -1)
- `packages/app/src/session/revert.ts` (+4, -1)
- `packages/app/src/session/screen.tsx` (+4, -1)
- `packages/app/src/session/usage-exceeded-dialogs.tsx` (+100, -40)
- `packages/cli/package.json` (+2, -2)
- `packages/client/package.json` (+1, -1)
- `packages/client/src/effect/api/api.ts` (+17, -0)
- `packages/client/src/effect/generated/client.ts` (+13, -1)
- `packages/client/src/promise/generated/client.ts` (+12, -0)
- `packages/client/src/promise/generated/types.ts` (+16, -1)
- `packages/client/test/promise.test.ts` (+1, -1)
- `packages/codemode/interpreter-support.md` (+3, -0)
- `packages/codemode/package.json` (+1, -1)
- `packages/codemode/src/interpreter/execute.ts` (+15, -10)
- `packages/codemode/src/interpreter/extensions.ts` (+1, -1)
- `packages/codemode/src/interpreter/interpreter.ts` (+38, -15)
- `packages/codemode/src/interpreter/promises.ts` (+239, -32)
- `packages/codemode/test/promise.test.ts` (+58, -0)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/script/dev-enterprise.ts` (+2, -26)
- `packages/console/app/src/component/go-models.ts` (+2, -11)
- `packages/console/app/src/i18n/ar.ts` (+2, -1)
- `packages/console/app/src/i18n/br.ts` (+2, -1)
- `packages/console/app/src/i18n/da.ts` (+2, -1)
- `packages/console/app/src/i18n/de.ts` (+2, -1)
- `packages/console/app/src/i18n/en.ts` (+2, -1)
- `packages/console/app/src/i18n/es.ts` (+2, -1)
- `packages/console/app/src/i18n/fr.ts` (+2, -1)
- `packages/console/app/src/i18n/it.ts` (+2, -1)
- `packages/console/app/src/i18n/ja.ts` (+2, -1)
- `packages/console/app/src/i18n/ko.ts` (+2, -1)
- `packages/console/app/src/i18n/no.ts` (+2, -1)
- `packages/console/app/src/i18n/pl.ts` (+2, -1)
- `packages/console/app/src/i18n/ru.ts` (+2, -1)
- `packages/console/app/src/i18n/th.ts` (+2, -1)
- `packages/console/app/src/i18n/tr.ts` (+2, -1)
- `packages/console/app/src/i18n/uk.ts` (+2, -1)
- `packages/console/app/src/i18n/zh.ts` (+2, -1)
- `packages/console/app/src/i18n/zht.ts` (+2, -1)
- `packages/console/app/src/lib/console-account.ts` (+0, -31)
- `packages/console/app/src/lib/console-signup.test.ts` (+0, -159)
- `packages/console/app/src/lib/console-signup.ts` (+0, -19)
- `packages/console/app/src/lib/enterprise-spam.test.ts` (+7, -55)
- `packages/console/app/src/lib/enterprise-spam.ts` (+3, -9)
- `packages/console/app/src/lib/enterprise.test.ts` (+51, -0)
- `packages/console/app/src/lib/enterprise.ts` (+15, -12)
- `packages/console/app/src/lib/hcaptcha.test.ts` (+98, -0)
- `packages/console/app/src/lib/hcaptcha.ts` (+44, -0)
- `packages/console/app/src/lib/inference-proxy.ts` (+0, -61)
- `packages/console/app/src/lib/salesforce.test.ts` (+2, -9)
- `packages/console/app/src/lib/salesforce.ts` (+0, -114)
- `packages/console/app/src/middleware.ts` (+2, -3)
- `packages/console/app/src/routes/api/console-signup.ts` (+0, -8)
- `packages/console/app/src/routes/api/enterprise.ts` (+9, -0)
- `packages/console/app/src/routes/enterprise/index.tsx` (+59, -3)
- `packages/console/app/src/routes/zen/go/v1/chat/completions.ts` (+0, -6)
- `packages/console/app/src/routes/zen/go/v1/messages.ts` (+0, -6)
- `packages/console/app/src/routes/zen/go/v1/models.ts` (+0, -11)
- `packages/console/app/src/routes/zen/go/v1/responses.ts` (+0, -6)
- `packages/console/app/src/routes/zen/go/v1/systemone.ts` (+0, -6)
- `packages/console/app/src/routes/zen/go/v1/usage.ts` (+0, -6)
- `packages/console/app/src/routes/zen/util/modelsHandler.ts` (+0, -10)
- `packages/console/app/src/routes/zen/v1/chat/completions.ts` (+0, -6)
- `packages/console/app/src/routes/zen/v1/messages.ts` (+0, -6)
- `packages/console/app/src/routes/zen/v1/models.ts` (+0, -11)
- `packages/console/app/src/routes/zen/v1/models/[model].ts` (+0, -6)
- `packages/console/app/src/routes/zen/v1/responses.ts` (+0, -6)
- `packages/console/app/src/routes/zen/v1/systemone.ts` (+0, -6)
- `packages/desktop/package.json` (+2, -2)
- `packages/function/package.json` (+1, -1)
- `packages/function/src/api.ts` (+2, -196)
- `packages/gui-extensions/package.json` (+2, -2)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/httpapi-codegen/package.json` (+1, -1)
- `packages/latex/package.json` (+1, -1)
- `packages/merman/package.json` (+1, -1)
- `packages/plugin-browser/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/plugins/figma/package.json` (+1, -1)
- `packages/protocol/openapi.json` (+129, -0)
- `packages/protocol/package.json` (+1, -1)
- `packages/protocol/src/groups/voice.ts` (+29, -0)
- `packages/schema/package.json` (+1, -1)
- `packages/schema/src/config/experimental.ts` (+6, -0)
- `packages/schema/src/session-error.ts` (+3, -1)
- `packages/schema/test/session-error.test.ts` (+2, -1)
- `packages/sdk/package.json` (+1, -1)
- `packages/server/package.json` (+1, -1)
- `packages/server/src/handlers/voice.ts` (+34, -21)
- `packages/server/test/voice.test.ts` (+27, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/session-ui/src/timeline/projection.ts` (+31, -1)
- `packages/session-ui/src/timeline/rows-current.test.ts` (+57, -0)
- `packages/session-ui/src/timeline/session-timeline-row.tsx` (+28, -1)
- `packages/session-ui/src/timeline/timeline-row.ts` (+7, -1)
- `packages/simulation/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/server/package.json` (+1, -1)
- `packages/stats/server/src/stat-sync.ts` (+5, -1)
- `packages/theme/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/tui/src/component/dialog-go-upsell.tsx` (+461, -0)
- `packages/tui/src/component/go-upsell-art.ts` (+336, -0)
- `packages/tui/src/context/location.tsx` (+8, -2)
- `packages/tui/src/feature-plugins/system/notifications.ts` (+9, -2)
- `packages/tui/src/routes/session/index.tsx` (+157, -3)
- `packages/tui/test/app-lifecycle.test.tsx` (+981, -2)
- `packages/tui/test/cli/cmd/tui/notifications.test.ts` (+13, -0)
- `packages/tui/test/component/go-upsell-art.test.tsx` (+87, -0)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/i18n/en.ts` (+3, -0)
- `packages/util/package.json` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `salesforce/README.md` (+6, -7)
- `sdks/vscode/package.json` (+1, -1)
- `services/update/package.json` (+1, -1)
- `services/www/openapi.json` (+129, -0)
- `services/www/public/openapi.json` (+129, -0)
- `services/www/src/docs/content/config.mdx` (+55, -14)
- `services/www/src/docs/content/console/api/budgets.mdx` (+3, -2)
- `services/www/src/docs/content/console/api/index.mdx` (+97, -132)
- `services/www/src/docs/content/console/go.mdx` (+4, -4)
- `services/www/src/docs/content/console/members.mdx` (+2, -2)
- `services/www/src/docs/content/console/models.mdx` (+4, -0)
- `services/www/src/docs/content/models.mdx` (+18, -0)
- `services/www/src/docs/content/permissions.mdx` (+2, -1)
- `sst-env.d.ts` (+0, -2)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 40b920c..7cad834 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "2.1.0",
+  "version": "2.1.2",
   "name": "@opencode/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/config/normalize.ts
```diff
diff --git a/packages/core/src/config/normalize.ts b/packages/core/src/config/normalize.ts
index 35d702a..4ef02b9 100644
--- a/packages/core/src/config/normalize.ts
+++ b/packages/core/src/config/normalize.ts
@@ -485,6 +485,15 @@ function normalizeExperimental(
         )
         if (value !== undefined) result.subagent_depth = value
       }
+      if (own(experimental, "location_idle_timeout")) {
+        const value = decodeEncoded(
+          ConfigExperimental.Info.fields.location_idle_timeout,
+          experimental.location_idle_timeout,
+          ["experimental", "location_idle_timeout"],
+          diagnostics,
+        )
+        if (value !== undefined) result.location_idle_timeout = value
+      }
     }
   }
   if (Object.keys(result).length || (isRecord(input.experimental) && !Object.keys(input.experimental).length))
```

#### packages/core/src/config/plugin/provider.ts
```diff
diff --git a/packages/core/src/config/plugin/provider.ts b/packages/core/src/config/plugin/provider.ts
index 0c485c4..5ea1c70 100644
--- a/packages/core/src/config/plugin/provider.ts
+++ b/packages/core/src/config/plugin/provider.ts
@@ -131,6 +131,9 @@ export const Plugin = define({
             if (config.capabilities !== undefined)
               model.capabilities = Model.mergeCapabilities(config.capabilities, model.capabilities)
             if (config.limit !== undefined) model.limit = { ...model.limit, ...config.limit }
+          })
+          // Variants are spelled for the final package, which the update above normalizes from `aisdk:*`.
+          models.update(providerID, id, (model) => {
             // Configured reasoning replaces the base variants; configured variants still overlay them below.
             if (config.capabilities?.reasoning !== undefined)
               model.variants = [
```

#### packages/core/src/database/path.ts
```diff
diff --git a/packages/core/src/database/path.ts b/packages/core/src/database/path.ts
index 66a130b..8ddef89 100644
--- a/packages/core/src/database/path.ts
+++ b/packages/core/src/database/path.ts
@@ -12,12 +12,15 @@ function isWindowsStoragePath(input: string) {
   return /^[A-Za-z]:\//.test(input) || input.startsWith("//")
 }
 
-function absolute(input: string) {
+export function storedAbsolutePath(input: string) {
   const result = storagePath(input)
   // Persisted projects and sessions can move between operating systems during migration.
-  if (!nodePath.posix.isAbsolute(result) && !isWindowsStoragePath(result)) {
-    throw new Error(`Path is not absolute: ${input}`)
-  }
+  if (nodePath.posix.isAbsolute(result) || isWindowsStoragePath(result)) return result
+}
+
+function absolute(input: string) {
+  const result = storedAbsolutePath(input)
+  if (result === undefined) throw new Error(`Path is not absolute: ${input}`)
   return result
 }
 
```

#### packages/core/src/database/v1-migration.bun.ts
```diff
diff --git a/packages/core/src/database/v1-migration.bun.ts b/packages/core/src/database/v1-migration.bun.ts
index 591c792..b13aee5 100644
--- a/packages/core/src/database/v1-migration.bun.ts
+++ b/packages/core/src/database/v1-migration.bun.ts
@@ -2,6 +2,7 @@ export * as V1Migration from "./v1-migration.js"
 
 import { Cause, Effect, Layer, Option, Schema, Semaphore } from "effect"
 import { Database } from "./database.js"
+import { storedAbsolutePath } from "./path.js"
 import { SessionMessageTable, SessionTable } from "../session/sql.js"
 import { SessionV1 } from "@opencode/schema/session-v1"
 import { SessionMessage } from "../session/message.js"
@@ -580,16 +581,19 @@ export function run(options: Options = {}): Effect.Effect<RunResult, never, Data
         updateProgress({ label: "Migrating sessions", numerator: migrated + completed, denominator })
       })
       updateProgress({ label: "Migrating sessions", numerator: migrated + sourceTotal, denominator })
-      const projects = new Set(
-        (yield* db.all<{ id: string }>(sql`SELECT id FROM project`)).map((project) => project.id),
+      const projects = new Map(
+        (yield* db.all<{ id: string; worktree: string }>(sql`SELECT id, worktree FROM project`)).map((project) => [
+          project.id,
+          project.worktree,
+        ]),
       )
       while (true) {
         const state = yield* readState(db)
         const cursorValue = state?.phase === "sessions" ? state.cursor : undefined
-        const nextID = yield* db.get<{ id: string; project_id: string }>(
+        const nextID = yield* db.get<{ id: string; project_id: string; directory: string }>(
           cursorValue === undefined
-            ? sql`SELECT id, project_id FROM session ORDER BY id DESC LIMIT 1`
-            : sql`SELECT id, project_id FROM session WHERE id < ${cursorValue} ORDER BY id DESC LIMIT 1`,
+            ? sql`SELECT id, project_id, directory FROM session ORDER BY id DESC LIMIT 1`
+            : sql`SELECT id, project_id, directory FROM session WHERE id < ${cursorValue} ORDER BY id DESC LIMIT 1`,
         )
         if (!nextID) break
         yield* db
@@ -609,6 +613,18 @@ export function run(options: Options = {}): Effect.Effect<RunResult, never, Data
                   sessionID: nextID.id,
                   projectID: nextID.project_id,
                 })
+              // Legacy ACP sessions can store a cwd relative to an unknown process directory.
+              // Use the project worktree instead, and leave the original V1 row intact.
+              const directory =
+                !nextID.directory || storedAbsolutePath(nextID.directory)
+                  ? nextID.directory
+                  : (storedAbsolutePath(projects.get(projectID) ?? path.parse(global.data).root) ?? "")
+              if (directory !== nextID.directory)
+                yield* Effect.logWarning("Replaced relative V1 session directory", {
+                  sessionID: nextID.id,
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/tool/mcp-resource.ts` - update based on opencode packages/core/src/tool/plugin/mcp-resource.ts changes
- `src/tool/mcp.ts` - update based on opencode packages/core/src/tool/mcp.ts changes
- `src/tool/webfetch.ts` - update based on opencode packages/core/src/tool/plugin/webfetch.ts changes
