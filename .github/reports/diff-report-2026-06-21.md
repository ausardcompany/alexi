# Upstream Changes Report
Generated: 2026-06-21 09:51:31

## Summary
- kilocode: 2 commits, 9 files changed
- opencode: 21 commits, 82 files changed

## kilocode Changes (ec0dd783a..a42413247)

### Commits

- a42413247 - Merge pull request #11478 from Kilo-Org/talented-yttrium (Catriel Müller, 2026-06-20)
- 9611c8b1e - feat(cli): improve daemon stop workflow (Catriel Müller, 2026-06-19)

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
- `.changeset/attach-daemon-console.md` (+5, -0)
- `packages/kilo-docs/markdoc/partials/cli-commands-table.md` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli-reference.md` (+52, -26)
- `packages/kilo-docs/pages/contributing/architecture/cli-runtime.md` (+2, -1)
- `packages/opencode/src/kilocode/cli/cmd/console.ts` (+48, -21)
- `packages/opencode/src/kilocode/cli/cmd/daemon.ts` (+76, -36)
- `packages/opencode/src/kilocode/daemon/daemon.ts` (+59, -4)
- `packages/opencode/test/kilocode/daemon.test.ts` (+166, -0)
- `packages/opencode/test/kilocode/help.test.ts` (+18, -0)

### Key Diffs

(no key diffs to show)

## opencode Changes (e6cdc54..d4d841b)

### Commits

- d4d841b - chore: generate (opencode-agent[bot], 2026-06-21)
- 6f0e934 - fix(stats): make unique users migration idempotent (Adam, 2026-06-21)
- 233d065 - feat(stats): show model users metric (Adam, 2026-06-21)
- f12ac6f - fix(tui): reduce noisy MCP autocomplete matches (#33176) (Dax, 2026-06-20)
- d3bbfff - test(opencode): simplify message pagination layer wiring (#33157) (James Long, 2026-06-20)
- 468f425 - test(opencode): simplify session retry layer wiring (#33155) (James Long, 2026-06-20)
- d59619f - test(opencode): simplify git layer wiring (#33156) (James Long, 2026-06-20)
- 5606d2b - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-21)
- e84d94d - sync release versions for v1.17.9 (opencode, 2026-06-21)
- 4f1ae16 - chore: upgrade Effect to beta 83 (#32340) (Kit Langton, 2026-06-20)
- d99f86b - fix(tui): separate subagent tool rows (#33158) (Dax, 2026-06-20)
- 22cc758 - feat(opencode): expose High/Max thinking variants for GLM-5.2 (#32446) (imranshaiedi-byte, 2026-06-20)
- 0b7ec51 - chore: generate (opencode-agent[bot], 2026-06-20)
- 4f1a9d7 - fix(core): honor configured agent step limits (#33142) (Kit Langton, 2026-06-20)
- 503309d - fix(stats): tolerate pending user column (Adam, 2026-06-20)
- 1c76587 - chore: generate (opencode-agent[bot], 2026-06-20)
- 24c70ec - feat(stats): add unique user charts (Adam, 2026-06-20)
- 2d993cd - fix(experimental llm pkg): forward topK to Converse via additionalModelRequestFields (#33030) (Lucas Kim, 2026-06-20)
- babe507 - fix(opencode): use toLowerCase for Devstral model detection (#33109) (卫斯李, 2026-06-20)
- 009f379 - refactor(tui): simplify inline tool spacing (#33097) (Dax, 2026-06-20)
- 95237a9 - fix(stats): align model peers ranking (Adam, 2026-06-20)

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
- `packages/core/package.json` (+1, -1)
- `packages/core/src/account.ts` (+4, -4)
- `packages/core/src/aisdk.ts` (+1, -1)
- `packages/core/src/control-plane/move-session.ts` (+1, -1)
- `packages/core/src/fs-util.ts` (+1, -1)
- `packages/core/src/git.ts` (+2, -2)
- `packages/core/src/integration.ts` (+1, -1)
- `packages/core/src/npm.ts` (+1, -1)
- `packages/core/src/process.ts` (+1, -1)
- `packages/core/src/ripgrep.ts` (+1, -1)
- `packages/core/src/session/runner/index.ts` (+1, -10)
- `packages/core/src/session/runner/llm.ts` (+26, -22)
- `packages/core/src/tool-output-store.ts` (+1, -1)
- `packages/core/src/util/effect-flock.ts` (+1, -1)
- `packages/core/test/session-runner.test.ts` (+47, -49)
- `packages/stats/core/migrations/20260620000000_unique_users/migration.sql` (+3, -0)
- `packages/stats/core/package.json` (+2, -1)
- `packages/stats/core/src/database/schema.ts` (+1, -0)
- `packages/stats/core/src/domain/geo.ts` (+49, -36)
- `packages/stats/core/src/domain/home.ts` (+45, -14)
- `packages/stats/core/src/domain/inference.ts` (+5, -0)
- `packages/stats/core/src/domain/model.ts` (+104, -60)
- `packages/stats/core/src/domain/provider.ts` (+48, -35)
- `packages/stats/core/src/domain/stat.ts` (+25, -0)
- `packages/stats/core/src/ensure-unique-users.ts` (+23, -0)
- `packages/stats/core/src/honeycomb-backfill.ts` (+14, -3)
- `packages/stats/core/src/stat-sync.ts` (+7, -1)

#### Other Changes
- `.github/workflows/deploy.yml` (+14, -0)
- `bun.lock` (+46, -38)
- `nix/hashes.json` (+4, -4)
- `package.json` (+4, -4)
- `packages/app/package.json` (+1, -1)
- `packages/cli/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/mail/package.json` (+1, -1)
- `packages/console/support/package.json` (+1, -1)
- `packages/{opencode/src/session/prompt/max-steps.txt => core/src/session/runner/max-steps.ts}` (+2, -2)
- `packages/desktop/package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/examples/basic.ts` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/enterprise/package.json` (+1, -1)
- `packages/function/package.json` (+1, -1)
- `packages/http-recorder/package.json` (+4, -4)
- `packages/llm/package.json` (+1, -1)
- `packages/llm/src/protocols/bedrock-converse.ts` (+3, -0)
- `packages/llm/src/schema/errors.ts` (+1, -1)
- `packages/llm/src/schema/events.ts` (+1, -1)
- `packages/llm/test/provider/bedrock-converse.test.ts` (+20, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/account/schema.ts` (+4, -4)
- `packages/opencode/src/auth/index.ts` (+1, -1)
- `packages/opencode/src/control-plane/workspace.ts` (+1, -1)
- `packages/opencode/src/lsp/client.ts` (+1, -1)
- `packages/opencode/src/provider/provider.ts` (+2, -2)
- `packages/opencode/src/provider/transform.ts` (+24, -2)
- `packages/opencode/src/session/message-v2.ts` (+3, -0)
- `packages/opencode/src/session/prompt.ts` (+5, -2)
- `packages/opencode/test/git/git.test.ts` (+2, -1)
- `packages/opencode/test/provider/transform.test.ts` (+96, -0)
- `packages/opencode/test/session/messages-pagination.test.ts` (+4, -3)
- `packages/opencode/test/session/retry.test.ts` (+3, -2)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/server/package.json` (+1, -1)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/app/src/routes/[lab]/[model].tsx` (+145, -89)
- `packages/stats/app/src/routes/index.css` (+63, -21)
- `packages/stats/app/src/routes/index.tsx` (+55, -5)
- `packages/stats/server/package.json` (+1, -1)
- `packages/stats/server/src/ingest.ts` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/tui/src/component/prompt/autocomplete.tsx` (+2, -2)
- `packages/tui/src/routes/session/index.tsx` (+17, -34)
- `packages/tui/test/cli/tui/__snapshots__/inline-tool-wrap-snapshot.test.tsx.snap` (+10, -4)
- `packages/tui/test/cli/tui/inline-tool-wrap-snapshot.test.tsx` (+42, -30)
- `packages/ui/package.json` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index b5e95fa..fa401b6 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.17.8",
+  "version": "1.17.9",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 26449b5..7e12e5b 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.17.8",
+  "version": "1.17.9",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/account.ts
```diff
diff --git a/packages/core/src/account.ts b/packages/core/src/account.ts
index 4de8176..d364d6f 100644
--- a/packages/core/src/account.ts
+++ b/packages/core/src/account.ts
@@ -35,19 +35,19 @@ export class Org extends Schema.Class<Org>("Org")({
 
 export class AccountRepoError extends Schema.TaggedErrorClass<AccountRepoError>()("AccountRepoError", {
   message: Schema.String,
-  cause: Schema.optional(Schema.Defect),
+  cause: Schema.optional(Schema.Defect()),
 }) {}
 
 export class AccountServiceError extends Schema.TaggedErrorClass<AccountServiceError>()("AccountServiceError", {
   message: Schema.String,
-  cause: Schema.optional(Schema.Defect),
+  cause: Schema.optional(Schema.Defect()),
 }) {}
 
 export class AccountTransportError extends Schema.TaggedErrorClass<AccountTransportError>()("AccountTransportError", {
   method: Schema.String,
   url: Schema.String,
   description: Schema.optional(Schema.String),
-  cause: Schema.optional(Schema.Defect),
+  cause: Schema.optional(Schema.Defect()),
 }) {
   static fromHttpClientError(error: HttpClientError.TransportError): AccountTransportError {
     return new AccountTransportError({
@@ -94,7 +94,7 @@ export class PollExpired extends Schema.TaggedClass<PollExpired>()("PollExpired"
 export class PollDenied extends Schema.TaggedClass<PollDenied>()("PollDenied", {}) {}
 
 export class PollError extends Schema.TaggedClass<PollError>()("PollError", {
-  cause: Schema.Defect,
+  cause: Schema.Defect(),
 }) {}
 
 export const PollResult = Schema.Union([PollSuccess, PollPending, PollSlow, PollExpired, PollDenied, PollError])
```

#### packages/core/src/aisdk.ts
```diff
diff --git a/packages/core/src/aisdk.ts b/packages/core/src/aisdk.ts
index 9965ff9..769941f 100644
--- a/packages/core/src/aisdk.ts
+++ b/packages/core/src/aisdk.ts
@@ -109,7 +109,7 @@ function prepareOptions(model: ModelV2.Info, pkg: string) {
 
 export class InitError extends Schema.TaggedErrorClass<InitError>()("AISDK.InitError", {
   providerID: ProviderV2.ID,
-  cause: Schema.Defect,
+  cause: Schema.Defect(),
 }) {}
 
 function initError(providerID: ProviderV2.ID) {
```

#### packages/core/src/control-plane/move-session.ts
```diff
diff --git a/packages/core/src/control-plane/move-session.ts b/packages/core/src/control-plane/move-session.ts
index 0239eec..fa2a3cb 100644
--- a/packages/core/src/control-plane/move-session.ts
+++ b/packages/core/src/control-plane/move-session.ts
@@ -48,7 +48,7 @@ export class ResetSourceChangesError extends Schema.TaggedErrorClass<ResetSource
   {
     directory: AbsolutePath,
     message: Schema.String,
-    cause: Schema.optional(Schema.Defect),
+    cause: Schema.optional(Schema.Defect()),
   },
 ) {}
 
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- No specific recommendations - review changes manually
