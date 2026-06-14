# Upstream Changes Report
Generated: 2026-06-14 09:36:08

## Summary
- kilocode: 0 commits, 0 files changed
- opencode: 16 commits, 65 files changed

## kilocode Changes (fcb8802aa..fcb8802aa)

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

## opencode Changes (d733487..7efade2)

### Commits

- 7efade2 - zen: monitor budget (Frank, 2026-06-14)
- 231f494 - fix(mcp): use SDK protocol version in debug (#32243) (Aiden Cline, 2026-06-13)
- f55a931 - feat(mcp): support client roots (#32230) (Aiden Cline, 2026-06-13)
- 42f339c - sync release versions for v1.17.6 (opencode, 2026-06-13)
- 409ba22 - fix(core): ignore unavailable project copy roots (#32234) (James Long, 2026-06-13)
- 252223a - fix(tui): handle move directory errors (#32226) (Aiden Cline, 2026-06-13)
- 11fd6f8 - chore(mcp): declare client capabilities (#32222) (Aiden Cline, 2026-06-13)
- 7143bf8 - sync release versions for v1.17.5 (opencode, 2026-06-13)
- 414c037 - chore: generate (opencode-agent[bot], 2026-06-13)
- 632f94f - fix(opencode): add authorization header to fetch requests in RunCommand (#29877) (OpeOginni, 2026-06-13)
- a6e3afe - chore: generate (opencode-agent[bot], 2026-06-13)
- 3f17453 - feat(opencode): add external browser OAuth for snowflake cortex provider (#31700) (santigc6, 2026-06-13)
- fcca731 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-13)
- c7dee9c - fix(opencode): recover expired MCP sessions (#32088) (Aiden Cline, 2026-06-13)
- 45e4606 - feat(app): bring v2 visibility settings to web (#32174) (Luke Parker, 2026-06-13)
- 9ae4a51 - fix(app): expand terminal resize gutter hitbox (#32169) (Luke Parker, 2026-06-13)

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
- `packages/console/core/src/model.ts` (+3, -0)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/plugin/provider/snowflake-cortex.ts` (+6, -3)
- `packages/core/src/project/copy.ts` (+1, -0)
- `packages/core/test/plugin/provider-snowflake-cortex.test.ts` (+42, -0)
- `packages/core/test/project-copy.test.ts` (+12, -0)
- `packages/stats/core/package.json` (+1, -1)

#### Other Changes
- `bun.lock` (+27, -26)
- `nix/hashes.json` (+4, -4)
- `package.json` (+2, -1)
- `packages/app/package.json` (+1, -1)
- `packages/app/src/components/prompt-input.tsx` (+1, -1)
- `packages/app/src/components/session/session-header.tsx` (+41, -47)
- `packages/app/src/components/settings-v2/general.tsx` (+6, -66)
- `packages/app/src/context/settings.tsx` (+20, -5)
- `packages/app/src/i18n/en.ts` (+4, -4)
- `packages/app/src/i18n/uk.ts` (+3, -4)
- `packages/app/src/pages/session.tsx` (+1, -2)
- `packages/app/src/pages/session/helpers.test.ts` (+3, -4)
- `packages/app/src/pages/session/helpers.ts` (+2, -2)
- `packages/app/src/pages/session/session-side-panel.tsx` (+2, -6)
- `packages/app/src/pages/session/terminal-panel.tsx` (+22, -17)
- `packages/app/src/pages/session/use-session-commands.tsx` (+3, -6)
- `packages/cli/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/routes/zen/util/handler.ts` (+18, -0)
- `packages/console/app/src/routes/zen/util/providerBudgetTracker.ts` (+45, -0)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/mail/package.json` (+1, -1)
- `packages/console/support/package.json` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/enterprise/package.json` (+1, -1)
- `packages/function/package.json` (+1, -1)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/cli/cmd/mcp.ts` (+2, -1)
- `packages/opencode/src/cli/cmd/providers.ts` (+0, -19)
- `packages/opencode/src/cli/cmd/run.ts` (+8, -2)
- `packages/opencode/src/mcp/index.ts` (+30, -5)
- `packages/opencode/src/plugin/index.ts` (+2, -0)
- `packages/opencode/src/plugin/snowflake-cortex.ts` (+529, -0)
- `packages/opencode/src/provider/provider.ts` (+73, -60)
- `packages/opencode/test/fixture/mcp-session-recovery.ts` (+50, -0)
- `packages/opencode/test/mcp/lifecycle.test.ts` (+34, -2)
- `packages/opencode/test/mcp/oauth-auto-connect.test.ts` (+2, -0)
- `packages/opencode/test/mcp/oauth-browser.test.ts` (+2, -0)
- `packages/opencode/test/mcp/session-recovery.test.ts` (+27, -0)
- `packages/opencode/test/plugin/snowflake-cortex.test.ts` (+278, -0)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/server/package.json` (+1, -1)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/server/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/tui/src/component/dialog-move-session.tsx` (+7, -0)
- `packages/ui/package.json` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/providers.mdx` (+54, -10)
- `patches/@modelcontextprotocol%2Fsdk@1.29.0.patch` (+401, -0)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 092e55b..e574cb7 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.17.4",
+  "version": "1.17.6",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/console/core/src/model.ts
```diff
diff --git a/packages/console/core/src/model.ts b/packages/console/core/src/model.ts
index b0851c4..4355c18 100644
--- a/packages/console/core/src/model.ts
+++ b/packages/console/core/src/model.ts
@@ -37,6 +37,8 @@ export namespace ZenData {
         priority: z.number().optional(),
         tpmLimit: z.number().optional(),
         tpsGoal: z.number().optional(),
+        budgetMode: z.enum(["always", "fill"]).optional(),
+        budgetContribution: z.number().optional(),
         weight: z.number().optional(),
         disabled: z.boolean().optional(),
         storeModel: z.string().optional(),
@@ -54,6 +56,7 @@ export namespace ZenData {
     payloadModifier: z.record(z.string(), z.any()).optional(),
     payloadMappings: z.record(z.string(), z.string()).optional(),
     adjustCacheUsage: z.boolean().optional(),
+    budget: z.number().optional(),
   })
 
   const ModelsSchema = z.object({
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index e120490..ef73201 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.17.4",
+  "version": "1.17.6",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/plugin/provider/snowflake-cortex.ts
```diff
diff --git a/packages/core/src/plugin/provider/snowflake-cortex.ts b/packages/core/src/plugin/provider/snowflake-cortex.ts
index 8dcabf2..0971f35 100644
--- a/packages/core/src/plugin/provider/snowflake-cortex.ts
+++ b/packages/core/src/plugin/provider/snowflake-cortex.ts
@@ -70,14 +70,17 @@ export const SnowflakeCortexPlugin = PluginV2.define({
     return {
       "aisdk.sdk": Effect.fn(function* (evt) {
         if (evt.model.providerID !== ProviderV2.ID.make("snowflake-cortex")) return
-        const pat =
-          process.env.SNOWFLAKE_CORTEX_PAT ?? (typeof evt.options.apiKey === "string" ? evt.options.apiKey : undefined)
+        const token =
+          process.env.SNOWFLAKE_CORTEX_TOKEN ??
+          process.env.SNOWFLAKE_CORTEX_PAT ??
+          (typeof evt.options.token === "string" ? evt.options.token : undefined) ??
+          (typeof evt.options.apiKey === "string" ? evt.options.apiKey : undefined)
         const upstream = typeof evt.options.fetch === "function" ? (evt.options.fetch as FetchLike) : undefined
         if (evt.options.includeUsage !== false) evt.options.includeUsage = true
         const mod = yield* Effect.promise(() => import("@ai-sdk/openai-compatible"))
         evt.sdk = mod.createOpenAICompatible({
           ...evt.options,
-          ...(pat ? { apiKey: pat } : {}),
+          ...(token ? { apiKey: token } : {}),
           fetch: cortexFetch(upstream) as typeof fetch,
         } as any)
       }),
```

#### packages/core/src/project/copy.ts
```diff
diff --git a/packages/core/src/project/copy.ts b/packages/core/src/project/copy.ts
index 670b0d2..0e3246b 100644
--- a/packages/core/src/project/copy.ts
+++ b/packages/core/src/project/copy.ts
@@ -245,6 +245,7 @@ export const layer = Layer.effect(
         (sourceDirectory) =>
           Effect.forEach(strategies(), (strategy) =>
             strategy.list(sourceDirectory).pipe(
+              Effect.catchTag("ProjectCopy.DirectoryUnavailableError", () => Effect.succeed([])),
               Effect.map((items) =>
                 items.map((item) => ({
                   directory: item.directory,
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- No specific recommendations - review changes manually
