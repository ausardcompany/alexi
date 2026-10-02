# Upstream Changes Report
Generated: 2026-10-02 12:00:22

## Summary
- kilocode: 27 commits, 79 files changed
- opencode: 7 commits, 67 files changed

## kilocode Changes (fdebb0e10..a10fa8ebe)

### Commits

- a10fa8ebe - Merge pull request #14729 from Kilo-Org/fix-issue-14725 (Marius, 2026-10-02)
- 671c3894d - Merge pull request #14632 from Kilo-Org/feat/per-conversation-prompt-history (Bruno Agatão, 2026-10-02)
- 10ed37a26 - fix(cli): show the received worktreeID in the agent_manager mode error (marius-kilocode, 2026-10-02)
- 3351e05b6 - fix(vscode): keep the shared prompt history exactly as before (Bruno Agatao, 2026-10-02)
- 622ed1f5a - Merge pull request #14712 from Kilo-Org/fix/agent-manager-setup-task (Marius, 2026-10-01)
- 11b67894a - refactor(agent-manager): simplify setup task start error handling (marius-kilocode, 2026-10-01)
- 6fd9b7b29 - Merge pull request #14716 from Kilo-Org/fix/pty-smoke-flaky (Marius, 2026-10-01)
- 25a5c9e18 - fix(cli): make PTY release smoke test resilient to slow shell startup (marius-kilocode, 2026-10-01)
- 807d11eb6 - Merge branch 'feat/per-conversation-prompt-history' of github.com:Kilo-Org/kilocode into feat/per-conversation-prompt-history (Bruno Agatao, 2026-10-01)
- 8d9c2c33e - test(vscode): cover seeding of the shared prompt history (Bruno Agatao, 2026-10-01)
- ea92484b1 - fix(vscode): seed shared prompt history from session messages (Bruno Agatao, 2026-10-01)
- 56de973e3 - release: v7.8.3 (kilo-maintainer[bot], 2026-10-01)
- 8d7610950 - Merge branch 'main' into feat/per-conversation-prompt-history (Bruno Agatão, 2026-10-01)
- d622b8784 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-10-01)
- 2f62fd373 - Merge pull request #14714 from Kilo-Org/security-remediation/next-ghsa-vcvr-r3jv-pc5j/16d4a0574c-1 (Bruno Agatão, 2026-10-01)
- daa80f448 - feat(vscode): make shared prompt history the default, per-conversation opt-in (Bruno Agatao, 2026-10-01)
- a5e033a71 - fix(vscode): move pending prompt history to its session and bound storage (Bruno Agatao, 2026-10-01)
- b742d9488 - fix(kilo-docs): upgrade next to 16.3.6 (kiloconnect[bot], 2026-10-01)
- 36fd09281 - Merge branch 'main' into feat/per-conversation-prompt-history (Bruno Agatão, 2026-10-01)
- cef2b4629 - feat(vscode): add experimental global prompt history setting (Bruno Agatao, 2026-10-01)
- 4c0935910 - fix(agent-manager): run worktree setup for every worktree (marius-kilocode, 2026-10-01)
- 2e9c6fdd7 - test(vscode): seed per-conversation prompt history in paste-collapse spec (Bruno Agatao, 2026-09-30)
- bae911c54 - Merge branch 'feat/per-conversation-prompt-history' of github.com:Kilo-Org/kilocode into feat/per-conversation-prompt-history (Bruno Agatao, 2026-09-30)
- d4c3e4de0 - Merge remote-tracking branch 'origin/main' into feat/per-conversation-prompt-history (Bruno Agatao, 2026-09-30)
- 3fe7c832a - Merge branch 'main' into feat/per-conversation-prompt-history (Bruno Agatão, 2026-09-29)
- dbee862ca - fix(vscode): fix history cross-conversation append, unbounded growth, and side-effecting accessor (Bruno Agatao, 2026-09-28)
- fc3910b60 - feat(vscode): scope prompt input history to each conversation (Bruno Agatao, 2026-09-28)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/agent-manager.ts` (+2, -1)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/kilocode/pty/smoke.ts` (+21, -5)
- `packages/core/test/kilocode/pty-smoke.test.ts` (+24, -0)

#### Other Changes
- `.changeset/agent-manager-setup-per-worktree.md` (+5, -0)
- `.changeset/per-conversation-prompt-history.md` (+5, -0)
- `artifacts/glm52-rise-video/package.json` (+1, -1)
- `bun.lock` (+43, -43)
- `nix/hashes.json` (+4, -4)
- `package.json` (+1, -1)
- `packages/client/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/httpapi-codegen/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-docs/package.json` (+2, -2)
- `packages/kilo-docs/pnpm-lock.yaml` (+44, -44)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-memory/package.json` (+1, -1)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-vscode/package.json` (+11, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+6, -0)
- `packages/kilo-vscode/src/agent-manager/SetupScriptRunner.ts` (+13, -0)
- `packages/kilo-vscode/src/agent-manager/task-runner.ts` (+8, -19)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/unit/prompt-history-storage.test.ts` (+128, -0)
- `packages/kilo-vscode/tests/unit/prompt-history.test.ts` (+211, -1)
- `packages/kilo-vscode/tests/unit/prompt-send-contract.test.ts` (+12, -2)
- `packages/kilo-vscode/tests/unit/setup-script-task.test.ts` (+26, -2)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+18, -16)
- `packages/kilo-vscode/webview-ui/src/components/chat/goal/useGoalComposer.ts` (+27, -13)
- `packages/kilo-vscode/webview-ui/src/components/settings/ExperimentalTab.tsx` (+15, -0)
- `packages/kilo-vscode/webview-ui/src/hooks/usePromptHistory.ts` (+162, -27)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+1, -0)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/test/kilocode/agent-manager-tool.test.ts` (+15, -0)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/protocol/package.json` (+1, -1)
- `packages/schema/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk-next/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/storybook/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 1ff1fa262..68ca04e7d 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.8.2",
+  "version": "7.8.3",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/kilocode/pty/smoke.ts
```diff
diff --git a/packages/core/src/kilocode/pty/smoke.ts b/packages/core/src/kilocode/pty/smoke.ts
index fa5a4e01b..662f50898 100644
--- a/packages/core/src/kilocode/pty/smoke.ts
+++ b/packages/core/src/kilocode/pty/smoke.ts
@@ -2,10 +2,13 @@ import { Shell } from "../../shell"
 import { KiloPtyTermination } from "./termination"
 import { spawn } from "#pty"
 
-const TIMEOUT = 15_000
+const TIMEOUT = 30_000
+// Shells can drop input written before they are ready to read it (for example pwsh under
+// ConPTY while PSReadLine starts), so resend the probe until the shell answers.
+const RETRY = 1_000
 
-export async function smoke() {
-  const proc = spawn(Shell.preferred(), [], {
+export async function smoke(file = Shell.preferred(), args: string[] = []) {
+  const proc = spawn(file, args, {
     name: "xterm-256color",
     cwd: process.cwd(),
     env: { ...process.env, TERM: "xterm-256color", KILO_TERMINAL: "1" } as Record<string, string>,
@@ -25,10 +28,19 @@ export async function smoke() {
     exited.resolve(event.exitCode)
   })
   const timeout = AbortSignal.timeout(TIMEOUT)
+  const probe = () => {
+    if (state.exited) return
+    try {
+      proc.write("echo KILO_PTY_READY\r")
+    } catch (err) {
+      output.reject(err)
+    }
+  }
+  const retry = setInterval(probe, RETRY)
 
   try {
     proc.resize(100, 40)
-    proc.write("echo KILO_PTY_READY\r")
+    probe()
     await Promise.race([
       output.promise,
       new Promise<never>((_, reject) =>
@@ -39,6 +51,9 @@ export async function smoke() {
         ),
       ),
     ])
+    // Stop probing before exit so no probe follows the exit command. Probes already queued
+    // only print the marker again and run before exit.
+    clearInterval(retry)
     proc.write("exit 7\r")
```

#### packages/core/test/kilocode/pty-smoke.test.ts
```diff
diff --git a/packages/core/test/kilocode/pty-smoke.test.ts b/packages/core/test/kilocode/pty-smoke.test.ts
new file mode 100644
index 000000000..8fd49b029
--- /dev/null
+++ b/packages/core/test/kilocode/pty-smoke.test.ts
@@ -0,0 +1,24 @@
+import { expect, test } from "bun:test"
+import { PtySmoke } from "../../src/kilocode/pty/smoke"
+
+// A fake shell that drops all input it reads during startup, like pwsh under ConPTY.
+const shell = `
+  const start = Date.now()
+  const state = { buf: "" }
+  process.stdin.setRawMode(true)
+  process.stdin.on("data", (data) => {
+    if (Date.now() - start < 1_500) return
+    state.buf += data.toString()
+    const lines = state.buf.split("\\r")
+    state.buf = lines.pop() ?? ""
+    for (const line of lines) {
+      if (line.startsWith("echo ")) process.stdout.write(line.slice(5) + "\\r\\n")
+      if (line.startsWith("exit ")) process.exit(Number(line.slice(5)))
+    }
+  })
+  process.stdout.write("fake shell\\r\\n")
+`
+
+test("resends the probe when the shell drops early input", async () => {
+  await expect(PtySmoke.smoke(process.execPath, ["-e", shell])).resolves.toBeUndefined()
+}, 20_000)
```

#### packages/opencode/src/kilocode/tool/agent-manager.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/agent-manager.ts b/packages/opencode/src/kilocode/tool/agent-manager.ts
index c9e698bf3..3cfc97c05 100644
--- a/packages/opencode/src/kilocode/tool/agent-manager.ts
+++ b/packages/opencode/src/kilocode/tool/agent-manager.ts
@@ -152,7 +152,8 @@ export const Params = Schema.Union([
   }).check(
     Schema.makeFilter((params) => {
       if (params.worktreeID == null) return undefined
-      if (params.mode !== "local") return "worktreeID requires mode local"
+      if (params.mode !== "local")
+        return `worktreeID ${JSON.stringify(params.worktreeID)} requires mode local. To start a new worktree, omit worktreeID or send JSON null`
       if (params.versions === true) return "worktreeID cannot be combined with versions true"
       if (params.tasks.some((task) => task.branchName != null)) return "worktreeID cannot be combined with branchName"
       return undefined
```


## opencode Changes (0112a92..1ddb087)

### Commits

- 1ddb087 - chore(stats): retire legacy s3 lake (#52515) (Adam, 2026-10-01)
- a79ecfe - feat(stats): add canonical redirects and agent-readable data formats (Adam, 2026-10-01)
- cff9078 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-10-01)
- dc31828 - chore(stats): remove s3 lake ingestion (#52572) (Adam, 2026-10-01)
- aa481b8 - fix(stats): fix data page canonicals, 404s, and sitemap coverage (#52525) (Adam, 2026-10-01)
- 63cf236 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-10-01)
- 8bb2ccf - chore(stats): retire the S3 data lake (#52514) (Adam, 2026-10-01)

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
- `packages/stats/core/package.json` (+0, -2)
- `packages/stats/core/src/athena.ts` (+0, -151)
- `packages/stats/core/src/index.ts` (+0, -1)
- `packages/stats/core/src/resource.d.ts` (+0, -9)

#### Other Changes
- `bun.lock` (+0, -10)
- `infra/console.ts` (+2, -4)
- `infra/lake.ts` (+0, -331)
- `infra/stats.ts` (+5, -102)
- `nix/hashes.json` (+4, -4)
- `packages/console/app/src/lib/content-negotiation.ts` (+13, -0)
- `packages/console/app/src/lib/stats-proxy.ts` (+21, -3)
- `packages/console/function/src/log-processor.ts` (+9, -125)
- `packages/opencode/test/cli/run/run-process.test.ts` (+2, -1)
- `packages/stats/app/src/component/agent-meta.tsx` (+40, -0)
- `packages/stats/app/src/component/chart-data-table.tsx` (+28, -0)
- `packages/stats/app/src/component/model-compare-detail.tsx` (+46, -35)
- `packages/stats/app/src/component/not-found-meta.tsx` (+12, -0)
- `packages/stats/app/src/context/i18n.tsx` (+2, -13)
- `packages/stats/app/src/i18n.ts` (+35, -0)
- `packages/stats/app/src/i18n/ar.ts` (+25, -0)
- `packages/stats/app/src/i18n/br.ts` (+26, -0)
- `packages/stats/app/src/i18n/da.ts` (+26, -0)
- `packages/stats/app/src/i18n/de.ts` (+27, -0)
- `packages/stats/app/src/i18n/es.ts` (+28, -0)
- `packages/stats/app/src/i18n/fr.ts` (+27, -0)
- `packages/stats/app/src/i18n/it.ts` (+27, -0)
- `packages/stats/app/src/i18n/ja.ts` (+26, -0)
- `packages/stats/app/src/i18n/ko.ts` (+25, -0)
- `packages/stats/app/src/i18n/no.ts` (+26, -0)
- `packages/stats/app/src/i18n/pl.ts` (+28, -0)
- `packages/stats/app/src/i18n/ru.ts` (+26, -0)
- `packages/stats/app/src/i18n/th.ts` (+25, -0)
- `packages/stats/app/src/i18n/tr.ts` (+27, -0)
- `packages/stats/app/src/i18n/uk.ts` (+26, -0)
- `packages/stats/app/src/i18n/zh.ts` (+23, -0)
- `packages/stats/app/src/i18n/zht.ts` (+23, -0)
- `packages/stats/app/src/lib/agent-formats.ts` (+658, -0)
- `packages/stats/app/src/lib/format.ts` (+49, -0)
- `packages/stats/app/src/lib/language.ts` (+19, -0)
- `packages/stats/app/src/lib/methodology.ts` (+10, -0)
- `packages/stats/app/src/lib/page-data.ts` (+151, -0)
- `packages/stats/app/src/lib/summaries.ts` (+51, -0)
- `packages/stats/app/src/middleware.ts` (+162, -0)
- `packages/stats/app/src/routes/[...404].tsx` (+18, -0)
- `packages/stats/app/src/routes/[lab]/[model].tsx` (+97, -65)
- `packages/stats/app/src/routes/[lab]/index.tsx` (+154, -102)
- `packages/stats/app/src/routes/breadcrumb-select.tsx` (+0, -1)
- `packages/stats/app/src/routes/compare-cards.tsx` (+2, -2)
- `packages/stats/app/src/routes/compare/[firstFamily]/[secondFamily].tsx` (+3, -2)
- `packages/stats/app/src/routes/compare/index.tsx` (+22, -18)
- `packages/stats/app/src/routes/index.css` (+151, -52)
- `packages/stats/app/src/routes/index.tsx` (+524, -403)
- `packages/stats/app/src/routes/model-catalog.ts` (+56, -1)
- `packages/stats/app/src/routes/section-heading.tsx` (+4, -13)
- `packages/stats/app/src/routes/sitemap.xml.ts` (+20, -2)
- `packages/stats/app/src/routes/stats-cache.ts` (+2, -1)
- `packages/stats/app/src/routes/stats-shell.tsx` (+1, -0)
- `packages/stats/app/test/agent-formats.test.ts` (+48, -0)
- `packages/stats/app/vite.config.ts` (+1, -1)
- `packages/stats/server/Dockerfile` (+1, -3)
- `packages/stats/server/package.json` (+3, -4)
- `packages/stats/server/src/ingest.ts` (+0, -166)
- `packages/stats/server/src/resource.d.ts` (+0, -11)
- `packages/stats/server/src/router.ts` (+0, -73)
- `packages/stats/server/src/server.ts` (+0, -28)
- `packages/stats/server/src/shutdown.ts` (+0, -17)
- `sst.config.ts` (+0, -7)

### Key Diffs

#### packages/stats/core/package.json
```diff
diff --git a/packages/stats/core/package.json b/packages/stats/core/package.json
index d938182..aefcf4d 100644
--- a/packages/stats/core/package.json
+++ b/packages/stats/core/package.json
@@ -7,7 +7,6 @@
   "license": "MIT",
   "exports": {
     ".": "./src/index.ts",
-    "./athena": "./src/athena.ts",
     "./config": "./src/config.ts",
     "./database": "./src/database.ts",
     "./database/*": "./src/database/*.ts",
@@ -27,7 +26,6 @@
     "typecheck": "tsgo --noEmit"
   },
   "dependencies": {
-    "@aws-sdk/client-athena": "3.933.0",
     "@planetscale/database": "1.19.0",
     "drizzle-orm": "catalog:",
     "effect": "catalog:",
```

#### packages/stats/core/src/athena.ts
```diff
diff --git a/packages/stats/core/src/athena.ts b/packages/stats/core/src/athena.ts
deleted file mode 100644
index 23aba70..0000000
--- a/packages/stats/core/src/athena.ts
+++ /dev/null
@@ -1,151 +0,0 @@
-import {
-  AthenaClient as AwsAthenaClient,
-  GetQueryExecutionCommand,
-  GetQueryResultsCommand,
-  StartQueryExecutionCommand,
-  type Row,
-} from "@aws-sdk/client-athena"
-import { Effect, Layer } from "effect"
-import * as Context from "effect/Context"
-import { Resource } from "sst/resource"
-
-const ATHENA_MAX_POLL_ATTEMPTS = 900
-const ATHENA_PAGE_SIZE = 1000
-
-export type AthenaData = Record<string, string>
-
-export class AthenaQueryError extends Error {
-  readonly _tag = "AthenaQueryError"
-  readonly queryExecutionId?: string
-
-  constructor(input: { message: string; queryExecutionId?: string; cause?: unknown }) {
-    super(input.message, { cause: input.cause })
-    this.name = "AthenaQueryError"
-    this.queryExecutionId = input.queryExecutionId
-  }
-}
-
-export class AthenaQueryTimeoutError extends Error {
-  readonly _tag = "AthenaQueryTimeoutError"
-  readonly queryExecutionId: string
-
-  constructor(input: { message: string; queryExecutionId: string }) {
-    super(input.message)
-    this.name = "AthenaQueryTimeoutError"
-    this.queryExecutionId = input.queryExecutionId
-  }
-}
-
-export declare namespace Athena {
-  export interface Service {
-    readonly query: (query: string) => Effect.Effect<AthenaData[], AthenaQueryError | AthenaQueryTimeoutError>
-  }
-}
-
```

#### packages/stats/core/src/index.ts
```diff
diff --git a/packages/stats/core/src/index.ts b/packages/stats/core/src/index.ts
index 834625f..9b7fcd0 100644
--- a/packages/stats/core/src/index.ts
+++ b/packages/stats/core/src/index.ts
@@ -1,4 +1,3 @@
-export * as Athena from "./athena"
 export * as AppConfig from "./config"
 export * as Database from "./database"
 export * as GeoStat from "./domain/geo"
```

#### packages/stats/core/src/resource.d.ts
```diff
diff --git a/packages/stats/core/src/resource.d.ts b/packages/stats/core/src/resource.d.ts
index b801777..db2167b 100644
--- a/packages/stats/core/src/resource.d.ts
+++ b/packages/stats/core/src/resource.d.ts
@@ -2,15 +2,6 @@ import "sst/resource"
 
 declare module "sst/resource" {
   export interface Resource {
-    InferenceEvent: {
-      catalog: string
-      database: string
-      region: string
-      table: string
-      tableBucket: string
-      type: "sst.sst.Linkable"
-      workgroup: string
-    }
     R2Sql: {
       accountId: string
       bucket: string
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/src/kilocode/pty/smoke.ts
- `src/core/` - review core changes from packages/core/test/kilocode/pty-smoke.test.ts
- `src/tool/agent-manager.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager.ts changes
