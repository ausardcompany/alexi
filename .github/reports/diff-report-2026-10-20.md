# Upstream Changes Report
Generated: 2026-10-20 11:01:17

## Summary
- kilocode: 30 commits, 120 files changed
- opencode: 65 commits, 579 files changed

## kilocode Changes (2a1903f29..5cc65d121)

### Commits

- 5cc65d121 - release: v7.8.15 (kilo-maintainer[bot], 2026-10-19)
- 00b0bc069 - Merge pull request #15254 from Kilo-Org/breezy-cobble (Kirill Kalishev, 2026-10-19)
- 08aef54eb - Merge remote-tracking branch 'origin/main' into breezy-cobble (kirillk, 2026-10-19)
- 35a747254 - Merge pull request #15257 from Kilo-Org/fix/telemetry-shutdown-isolation (Kirill Kalishev, 2026-10-19)
- 33fc81f75 - test(telemetry): isolate conda state across test orders (kirillk, 2026-10-19)
- c63711da7 - test(telemetry): assert fresh client exists before shutdown (kirillk, 2026-10-19)
- 071d267b8 - fix(telemetry): stop flaky PostHog shutdown failure in CI (kirillk, 2026-10-19)
- 2deeee5de - Merge remote-tracking branch 'origin/main' into breezy-cobble (kirillk, 2026-10-19)
- 705b5d6d1 - fix(cli): keep edit tools for subagents of allowlist callers (kirillk, 2026-10-19)
- 87cc35ce6 - Merge pull request #15205 from Kilo-Org/feat/agent-usage-api (Kirill Kalishev, 2026-10-19)
- 1ad314e31 - Merge pull request #15204 from Kilo-Org/calm-panther (Kirill Kalishev, 2026-10-19)
- e1841b3c7 - Merge pull request #15233 from Kilo-Org/chore/pause-community-auto-close (Bruno Agatão, 2026-10-19)
- 1de5cb748 - fix(cli): map audio formats in custom router decision input (#15245) (Igor Šćekić, 2026-10-19)
- 61e311cbf - feat(cli): custom auto routers with client models and local evals (#15183) (Igor Šćekić, 2026-10-19)
- 8d4cdecaf - fix: skip PRs whose labels exceed the fetched page in auto-close (Bruno Agatao, 2026-10-19)
- 520f337fa - docs: fix the closing condition for an unset variable (Bruno Agatao, 2026-10-19)
- aca3a5fe2 - Merge pull request #15235 from Kilo-Org/fix-browser-permission-persistence (Marius, 2026-10-19)
- 05fd9708a - docs: make the closing pause a requirement and align the digest wording (Bruno Agatao, 2026-10-19)
- 2f2e05268 - fix: show waiting days without a limit in the digest (Bruno Agatao, 2026-10-19)
- 7d9615a6f - docs: kilo-auto-close is the only closer, and closing is paused (Bruno Agatao, 2026-10-19)
- 73ba9bc19 - feat: let kilo-auto-close close awaiting-contributor PRs after 14 days and skip keep-open (Bruno Agatao, 2026-10-19)
- 1b6280f62 - refactor: stop closing PRs in the community sweep and merge high-value into keep-open (Bruno Agatao, 2026-10-19)
- 6fc4fe4bd - fix(vscode): keep browser_open origin rules and scope always rules (marius-kilocode, 2026-10-19)
- c61a974f9 - fix(vscode): add always-allow rules for browser_open (marius-kilocode, 2026-10-19)
- a22b47d6f - docs: explain why community closing is paused (Bruno Agatao, 2026-10-19)
- e31ff4bd2 - chore: pause automatic closing in the community sweep (Bruno Agatao, 2026-10-19)
- abe5c6cbf - fix(cli): project the cursor key when encoding agent run pages (kirillk, 2026-10-17)
- 3d118a28d - feat(cli): expose pageable agent usage HTTP API (kirillk, 2026-10-17)
- 0ee9964ec - fix(jetbrains): address worktree review feedback (kirillk, 2026-10-17)
- b3c52ecf0 - feat(jetbrains): fetch base before creating worktrees (kirillk, 2026-10-17)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/browser-open.ts` (+6, -2)
- `packages/opencode/src/kilocode/tool/task.ts` (+45, -3)
- `packages/opencode/src/tool/task.ts` (+1, -1)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
- `packages/opencode/src/kilocode/permission/allowlist.ts` (+25, -0)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)

#### Other Changes
- `.github/pull_request_template.md` (+1, -1)
- `.github/workflows/community-sweep.yml` (+2, -8)
- `.github/workflows/kilo-auto-close.yml` (+40, -4)
- `artifacts/glm52-rise-video/package.json` (+1, -1)
- `bun.lock` (+33, -33)
- `docs/community-triage.md` (+43, -27)
- `package.json` (+1, -1)
- `packages/client/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/httpapi-codegen/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-docs/markdoc/partials/cli-commands-table.md` (+1, -0)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli-reference.md` (+100, -12)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-gateway/src/api/constants.ts` (+17, -0)
- `packages/kilo-gateway/src/api/custom-router-api.ts` (+218, -0)
- `packages/kilo-gateway/src/api/custom-router.ts` (+252, -0)
- `packages/kilo-gateway/src/index.ts` (+61, -0)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/CHANGELOG.md` (+6, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorktreeRpcApiImpl.kt` (+25, -1)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloWorktreeRpcApiImplTest.kt` (+49, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/AgentManagerPanel.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/NewWorktreeDialog.kt` (+14, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeController.kt` (+5, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/plugin/KiloPluginSettings.kt` (+11, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/NewWorktreeDialogTest.kt` (+16, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/WorktreeDto.kt` (+1, -0)
- `packages/kilo-memory/package.json` (+1, -1)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-telemetry/src/__tests__/telemetry-shutdown.test.ts` (+28, -37)
- `packages/kilo-telemetry/src/__tests__/telemetry.test.ts` (+11, -0)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-vscode/CHANGELOG.md` (+6, -0)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/unit/permission-description.test.ts` (+28, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/permission-dock-utils.ts` (+12, -3)
- `packages/kilo-vscode/webview-ui/src/components/settings/PermissionEditor.tsx` (+6, -2)
- `packages/kilo-vscode/webview-ui/src/components/settings/permission-utils.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+4, -0)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+16, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/kilocode/agent-usage/index.ts` (+33, -4)
- `packages/opencode/src/kilocode/auto-routing/entries.ts` (+31, -0)
- `packages/opencode/src/kilocode/auto-routing/eval-docker.ts` (+272, -0)
- `packages/opencode/src/kilocode/auto-routing/eval-events.ts` (+59, -0)
- `packages/opencode/src/kilocode/auto-routing/eval.ts` (+384, -0)
- `packages/opencode/src/kilocode/auto-routing/messages.ts` (+157, -0)
- `packages/opencode/src/kilocode/auto-routing/router.ts` (+189, -0)
- `packages/opencode/src/kilocode/cli/cmd/auto.ts` (+266, -0)
- `packages/opencode/src/kilocode/cli/lazy-kilo-commands.ts` (+6, -0)
- `packages/opencode/src/kilocode/cli/setup.ts` (+2, -0)
- `packages/opencode/src/kilocode/commands.ts` (+2, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/agent-usage.ts` (+88, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/agent-usage.ts` (+43, -0)
- `packages/opencode/src/kilocode/server/httpapi/server.ts` (+2, -0)
- `packages/opencode/src/kilocode/session/routed-model.ts` (+31, -2)
- `packages/opencode/src/server/routes/instance/httpapi/api.ts` (+2, -0)
- `packages/opencode/src/session/llm.ts` (+58, -2)
- `packages/opencode/test/kilocode/agent-usage/agent-usage.test.ts` (+103, -3)
- `packages/opencode/test/kilocode/auto-custom-router.test.ts` (+548, -0)
- `packages/opencode/test/kilocode/auto-eval.test.ts` (+302, -0)
- `packages/opencode/test/kilocode/sandbox/http-tools.test.ts` (+4, -2)
- `packages/opencode/test/kilocode/server/httpapi-agent-usage.test.ts` (+195, -0)
- `packages/opencode/test/kilocode/server/httpapi-exercise-scenarios.ts` (+28, -0)
- `packages/opencode/test/kilocode/subagent-edit-allowlist.test.ts` (+277, -0)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/protocol/package.json` (+1, -1)
- `packages/schema/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk-next/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+87, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+110, -0)
- `packages/sdk/openapi.json` (+378, -0)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/storybook/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `script/kilocode/community-triage.test.ts` (+19, -24)
- `script/kilocode/community-triage.ts` (+11, -72)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 2ea35022d..a733cd8ac 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.8.14",
+  "version": "7.8.15",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/opencode/src/kilocode/permission/allowlist.ts
```diff
diff --git a/packages/opencode/src/kilocode/permission/allowlist.ts b/packages/opencode/src/kilocode/permission/allowlist.ts
new file mode 100644
index 000000000..2f2bbd5f4
--- /dev/null
+++ b/packages/opencode/src/kilocode/permission/allowlist.ts
@@ -0,0 +1,25 @@
+import { Wildcard } from "@opencode-ai/core/util/wildcard"
+import type { Ruleset } from "@/kilocode/permission/rule"
+
+// A scoped policy can be written either as an explicit catch-all deny or as an
+// allowlist baseline: `"*": deny` followed by path allows. `Permission.evaluate`
+// only ever sees the catch-all for a literal "*" pattern, so code that needs to
+// tell a real blanket deny apart from an allowlist baseline has to inspect the
+// rules that follow it. `editRestrictions` in `src/kilocode/agent/index.ts`
+// encodes the same distinction for the built-in plan guard.
+export namespace PermissionAllowlist {
+  /** Last rule that applies `permission`'s catch-all pattern, if any. */
+  export function catchAll(permission: string, rules: Ruleset) {
+    return rules.findLast((rule) => Wildcard.match(permission, rule.permission) && rule.pattern === "*")
+  }
+
+  /** True when a catch-all deny is only the baseline for later path exceptions. */
+  export function exceptions(permission: string, rules: Ruleset) {
+    const rule = catchAll(permission, rules)
+    if (rule?.action !== "deny") return false
+    const index = rules.lastIndexOf(rule)
+    return rules
+      .slice(index + 1)
+      .some((next) => Wildcard.match(permission, next.permission) && next.pattern !== "*" && next.action !== "deny")
+  }
+}
```

#### packages/opencode/src/kilocode/tool/browser-open.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/browser-open.ts b/packages/opencode/src/kilocode/tool/browser-open.ts
index 07e2d3c38..3012943da 100644
--- a/packages/opencode/src/kilocode/tool/browser-open.ts
+++ b/packages/opencode/src/kilocode/tool/browser-open.ts
@@ -103,8 +103,12 @@ export const BrowserOpenTool = Tool.define<
           yield* ctx.ask({
             permission: "browser_open",
             patterns: [`navigate:${url.origin}`],
-            always: [],
-            metadata: { operation: "open", url: url.href },
+            always: [`navigate:${url.origin}`],
+            metadata: {
+              operation: "open",
+              url: url.href,
+              rules: [`navigate:${url.origin}`, "navigate:*"],
+            },
           })
 
           return yield* Effect.gen(function* () {
```

#### packages/opencode/src/kilocode/tool/task.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/task.ts b/packages/opencode/src/kilocode/tool/task.ts
index 493aba21b..4378099b7 100644
--- a/packages/opencode/src/kilocode/tool/task.ts
+++ b/packages/opencode/src/kilocode/tool/task.ts
@@ -3,6 +3,7 @@ import type { BackgroundJob } from "@/background/job"
 import type { SessionID } from "@/session/schema"
 import path from "path"
 import { Permission } from "@/permission"
+import { PermissionAllowlist } from "../permission/allowlist"
 import { guarded } from "../agent"
 import { Flag } from "@opencode-ai/core/flag/flag"
 import { Global } from "@opencode-ai/core/global"
@@ -104,6 +105,12 @@ export namespace KiloTask {
    * so use a session-level edit restriction to confine a delegated workflow.
    * Parent ask/allow rules must not replace the selected subagent's policy.
    *
+   * Edit is judged on the same `edit` ruleset as the rest of the loop: the session rules for a
+   * custom delegator, everything for a native or unknown-provenance caller. A catch-all deny
+   * followed by path allows is an allowlist baseline, not a blanket denial, so only its
+   * specific denies are inherited there. Before this, such a caller lost edit/write in every
+   * delegated subagent because the baseline was collapsed into a wildcard deny.
+   *
    * Broad bash denies are deliberately NOT inherited from the calling agent. A read-only/delegating
    * agent (plan, ask, orchestrator) carries a `readOnlyBash` allowlist whose deny rules
    * (`*`, `git *`, shell-operator guards) exist only to shape that allowlist. Projecting
@@ -128,16 +135,27 @@ export namespace KiloTask {
     const edit = input.caller.native === false ? session : rules
     const prefixes = Object.keys(input.mcp ?? {}).map((k) => k.replace(/[^a-zA-Z0-9_-]/g, "_") + "_")
     const isMcp = (p: string) => prefixes.some((prefix) => p.startsWith(prefix))
+    const mutation = mutations()
     // `guarded` covers the tools a read-only mode may never regain from config; keeping
     // it here too stops a Plan-launched subagent from reaching them under a catch-all.
     // `bash` is intentionally excluded — see the doc comment above (#11523).
-    const mutation = new Set(["edit", ...guarded.filter((p) => p !== "bash")])
+    // Only `*`-permission rules can match the literal input "*", so this is true exactly
+    // for the modes whose guard sets `"*": "deny"` and for a global deny-all config.
+    const readonly = Permission.evaluate("*", "*", rules).action === "deny"
     const inherited = [
       ...rules.filter((rule) => rule.permission !== "edit"),
-      ...edit.filter((rule) => rule.permission === "edit"),
-    ].filter((r: Permission.Rule) => r.action === "deny" && (mutation.has(r.permission) || isMcp(r.permission)))
+      ...edit.filter((rule) => rule.permission === "edit" && rule.action === "deny"),
+    ].filter(
+      (r: Permission.Rule) =>
+        r.action === "deny" &&
+        (isMcp(r.permission) ||
+          (r.permission === "edit"
+            ? readonly || r.pattern !== "*" || !PermissionAllowlist.exceptions("edit", edit)
+            : mutation.has(r.permission))),
+    )
```

#### packages/opencode/src/tool/task.ts
```diff
diff --git a/packages/opencode/src/tool/task.ts b/packages/opencode/src/tool/task.ts
index 8c352eae9..8ae8c4f88 100644
--- a/packages/opencode/src/tool/task.ts
+++ b/packages/opencode/src/tool/task.ts
@@ -212,7 +212,7 @@ export const TaskTool = Tool.define(
       const fallback = SandboxPolicy.fallback(cfg)
       if (session) {
         yield* SandboxPolicy.inherit(ctx.sessionID, session.id, fallback)
-        const permission = KiloTask.merge(session.permission ?? [], childPermission)
+        const permission = KiloTask.refresh(session.permission ?? [], childPermission)
         session.permission = permission
         yield* sessions.setPermission({ sessionID: session.id, permission })
       }
```


## opencode Changes (214fb7f..d814879)

### Commits

- d814879 - feat(tui): show setting descriptions under new designs (#56100) (Aarav Sareen, 2026-10-20)
- d249607 - feat(tui): match settings and export dialogs to new designs (#56099) (Aarav Sareen, 2026-10-20)
- 2b3fc31 - fix(tui): use base color for typed search text in list dialogs (#56098) (Aarav Sareen, 2026-10-20)
- 19b1270 - feat(tui): add free model picker under new designs (#56097) (Aarav Sareen, 2026-10-20)
- d30e990 - sync release versions for v2.1.0 [skip ci] (opencode, 2026-10-20)
- 1d2190b - feat(tui): match model switcher to new designs (#56095) (Aarav Sareen, 2026-10-20)
- 6ea9cf5 - fix(stats): add missing lab logos to the top models leaderboard (#57314) (opencode-agent[bot], 2026-10-20)
- 5a36ee7 - fix(core): broadcast models.dev catalog refreshes server-wide (#57148) (Kit Langton, 2026-10-20)
- d63c8d2 - fix(tui): use faint secondary text in list dialogs (#56094) (Aarav Sareen, 2026-10-20)
- b81629e - feat(tui): match session exported dialog to new designs (#56093) (Aarav Sareen, 2026-10-20)
- 9d90d89 - fix(tui): add footer gap to simple dialogs (#56092) (Aarav Sareen, 2026-10-20)
- acdcdb8 - refactor: v2.1 minor breaking changes (#57260) (Aiden Cline, 2026-10-20)
- db45c95 - fix(codemode): honor Uint8Array.from mappers, compare byte searches without coercion, skip flatMap holes, and truncate fractional radixes (#57285) (Aiden Cline, 2026-10-20)
- 40cdf4f - chore: update nix node_modules hashes (opencode-agent[bot], 2026-10-20)
- 23a33ab - chore: bump Playwright past the Node 24.16+ install hang (#57272) (Luke Parker, 2026-10-20)
- 16c3383 - refactor(ai): avoid copying unchanged request data during sanitization (#57173) (Aiden Cline, 2026-10-19)
- 6ec5682 - refactor(core): reuse codemode runtime across executions (#57172) (Aiden Cline, 2026-10-19)
- 49f52ff - feat(schema): add streamUsage compatibility to turn off stream_options (#57255) (opencode-agent[bot], 2026-10-19)
- 57f4a36 - fix(ai): only send store on chat completions for OpenAI and Azure (#57239) (opencode-agent[bot], 2026-10-19)
- 6e9c853 - chore(core): refresh bundled models.dev snapshot (opencode-agent[bot], 2026-10-20)
- b29b08a - fix(tui): color the selected file in the diff tree (#57227) (DS, 2026-10-19)
- abcdfda - feat(console): drop enterprise form spam before it reaches Salesforce (#57166) (opencode-agent[bot], 2026-10-19)
- d85746a - docs(app): document the resource guard that prevents Suspense flashes (#57206) (Luke Parker, 2026-10-20)
- 8f7db12 - feat: restore the todowrite tool behind an experimental flag (#56947) (Aiden Cline, 2026-10-19)
- d2c4c38 - fix(core): only poll Console config while connected (#57201) (Aiden Cline, 2026-10-19)
- 6bac3b9 - refactor(desktop): drop Drive-specific service handling (#57189) (James Long, 2026-10-19)
- 31dc762 - feat(voice): add Gemini Live ephemeral token support (#56888) (Kit Langton, 2026-10-19)
- c718e6b - chore: update nix node_modules hashes (opencode-agent[bot], 2026-10-19)
- 1b2c720 - fix(core): drop undefined permission metadata values before publishing requests (#54090) (Kit Langton, 2026-10-19)
- de19af9 - fix(tui): open /models on the current model and keep the server's model order (#57151) (Kit Langton, 2026-10-19)
- 41016ab - fix(core): publish sdk.plugin.updated globally across locations (#57181) (Kit Langton, 2026-10-19)
- d9fe53e - fix(core): keep the image budget cut stable so the prompt cache survives (#56983) (Kit Langton, 2026-10-19)
- c193810 - docs(console): document personal API keys (#57188) (Victor Navarro, 2026-10-19)
- 92242b5 - feat(core): enable persistent PTYs on Windows (#56245) (James Long, 2026-10-19)
- b154f6a - fix(core): stop polling DigitalOcean routers (#57175) (opencode-agent[bot], 2026-10-19)
- a5bf171 - fix(core): keep the instruction baseline on committed revert (#54410) (Rich Rauenzahn, 2026-10-19)
- f36cda5 - fix(tui): show keyboard focus in export options (#57154) (James Long, 2026-10-19)
- 157ad7f - docs: link Learn AI Coding course (#57165) (Lane Wagner, 2026-10-19)
- cb07c55 - feat(desktop): preserve Drive-managed development state (#57112) (James Long, 2026-10-19)
- 52a10f5 - fix(tui): keep long-pending requests past Bun's fetch deadline (#55149) (Finn763, 2026-10-19)
- b56e253 - fix(cli): keep mini session waits alive (#50248) (Andrei Vince, 2026-10-19)
- 86ac38a - fix(tui): keep mini waiting when session.wait loses its transport (#57062) (Dax, 2026-10-19)
- fd65892 - fix(core): summarize the whole conversation during compaction (#57091) (Filip, 2026-10-19)
- 367c8fb - test(core): bound advance by real time instead of steps (#57119) (Filip, 2026-10-19)
- ce15cd8 - fix(core): report removed running shells as killed (#56982) (Aiden Cline, 2026-10-19)
- 815de99 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-10-19)
- c7ddff7 - chore: OpenTUI 0.6.5 (#55339) (Simon Klee, 2026-10-19)
- a15de38 - fix(merman): treat apostrophes in flowchart labels as text (#57060) (opencode-agent[bot], 2026-10-19)
- f394d9d - chore(core): refresh bundled models.dev snapshot (opencode-agent[bot], 2026-10-19)
- cec70f3 - test(gui-extensions): wait for worker rpc handlers to start before aborting (#55988) (Filip, 2026-10-19)
- 580fcab - docs(console): reveal Space Bunny as MiniMax M3.1 Flash Free (#57021) (opencode-agent[bot], 2026-10-19)
- ba06ff9 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-10-19)
- 6d6003d - chore(function): remove legacy share write endpoints (#56939) (Dax, 2026-10-18)
- ceaef65 - fix(nix): preserve root dependency peer context (#56889) (Jérôme Benoit, 2026-10-18)
- fa9da98 - feat(core): restore session archiving (#53759) (Brendan Allan, 2026-10-19)
- 18f4363 - chore: regenerate openapi spec (#56937) (Aiden Cline, 2026-10-18)
- 3171839 - fix(nix): ship the root script/ dir to the CLI build (#55494) (Fábio D. Batista, 2026-10-18)
- c6d1c09 - docs: correct plan agent permissions and use shell tool name (#56922) (opencode-agent[bot], 2026-10-18)
- fede5dd - feat(core): edit saved permissions (#56659) (Aiden Cline, 2026-10-18)
- 8c9c85c - fix(core): log providers removed by policy (#56905) (opencode-agent[bot], 2026-10-18)
- afc6805 - chore(core): refresh bundled models.dev snapshot (opencode-agent[bot], 2026-10-19)
- 501b15a - docs: point README install methods at V2 (#56839) (Aiden Cline, 2026-10-18)
- 9c2611b - chore(ci): verify Cloudflare token rotation (#56841) (Dax, 2026-10-18)
- 802f2d8 - chore(ci): run Cloudflare deploys on Blacksmith runners (#56818) (Dax, 2026-10-18)
- da9d436 - chore(core): refresh bundled models.dev snapshot (opencode-agent[bot], 2026-10-18)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/core/src/tool/plugin/todo.ts` (+83, -0)
- `packages/core/src/tool/todowrite.txt` (+7, -0)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
- `packages/core/src/permission/saved.ts` (+69, -14)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+2, -2)
- `packages/core/src/bus.ts` (+9, -3)
- `packages/core/src/codemode/tool.ts` (+58, -35)
- `packages/core/src/config/normalize.ts` (+9, -0)
- `packages/core/src/config/plugin/policy.ts` (+7, -1)
- `packages/core/src/credential.ts` (+3, -1)
- `packages/core/src/database/v1-migration.bun.ts` (+10, -6)
- `packages/core/src/integration.ts` (+1, -1)
- `packages/core/src/model-resolver.ts` (+1, -3)
- `packages/core/src/models-dev.ts` (+1, -1)
- `packages/core/src/models-dev/snapshot.txt` (+1, -1)
- `packages/core/src/permission.ts` (+5, -1)
- `packages/core/src/persistent-pty/binary.bun.ts` (+3, -3)
- `packages/core/src/persistent-pty/binary.node.ts` (+1, -2)
- `packages/core/src/plugin/internal.ts` (+2, -0)
- `packages/core/src/plugin/provider/azure.ts` (+4, -7)
- `packages/core/src/plugin/provider/digitalocean.ts` (+2, -3)
- `packages/core/src/plugin/provider/opencode.ts` (+14, -6)
- `packages/core/src/plugin/provider/snowflake-cortex.ts` (+1, -7)
- `packages/core/src/plugin/sdk.ts` (+1, -1)
- `packages/core/src/session.ts` (+4, -0)
- `packages/core/src/session/compaction.ts` (+98, -156)
- `packages/core/src/session/context.ts` (+1, -2)
- `packages/core/src/session/generate.ts` (+1, -7)
- `packages/core/src/session/history.ts` (+97, -22)
- `packages/core/src/session/inbox.ts` (+2, -2)
- `packages/core/src/session/info.ts` (+1, -1)
- `packages/core/src/session/instruction-state.ts` (+11, -3)
- `packages/core/src/session/message-updater.ts` (+13, -16)
- `packages/core/src/session/model-request.ts` (+22, -38)
- `packages/core/src/session/projector.ts` (+50, -17)
- `packages/core/src/session/provider-context.ts` (+0, -84)
- `packages/core/src/session/recent-text.ts` (+90, -0)
- `packages/core/src/session/revert.ts` (+3, -3)
- `packages/core/src/session/runner/llm.ts` (+2, -8)
- `packages/core/src/session/runner/publish-llm-event.ts` (+27, -28)
- `packages/core/src/session/runner/step.ts` (+1, -1)
- `packages/core/src/session/runner/to-llm-message.ts` (+15, -27)
- `packages/core/src/session/session.ts` (+16, -0)
- `packages/core/src/session/store.ts` (+3, -0)
- `packages/core/src/session/transfer.ts` (+4, -13)
- `packages/core/src/shell.ts` (+4, -0)
- `packages/core/src/tool.ts` (+11, -10)
- `packages/core/src/voice.ts` (+9, -4)
- `packages/core/test/bus.test.ts` (+19, -0)
- `packages/core/test/config/compaction.test.ts` (+1, -1)
- `packages/core/test/config/normalization.test.ts` (+2, -1)
- `packages/core/test/config/provider.test.ts` (+25, -0)
- `packages/core/test/credential.test.ts` (+25, -1)
- `packages/core/test/fixture/{provider-context => native}/2.0.14-media.json` (+0, -0)
- `packages/core/test/integration.test.ts` (+1, -1)
- `packages/core/test/lib/clock.ts` (+8, -2)
- `packages/core/test/model-resolver.test.ts` (+2, -2)
- `packages/core/test/models.test.ts` (+46, -0)
- `packages/core/test/permission.test.ts` (+60, -1)
- `packages/core/test/plugin/provider-azure.test.ts` (+1, -1)
- `packages/core/test/plugin/provider-digitalocean.test.ts` (+2, -51)
- `packages/core/test/plugin/supervisor.test.ts` (+40, -0)
- `packages/core/test/session-archive.test.ts` (+81, -0)
- `packages/core/test/session-compaction.test.ts` (+192, -17)
- `packages/core/test/session-create.test.ts` (+4, -7)
- `packages/core/test/session-instructions.test.ts` (+2, -2)
- `packages/core/test/session-model-request.test.ts` (+15, -0)
- `packages/core/test/session-native-compaction.test.ts` (+16, -40)
- `packages/core/test/{session-provider-context.test.ts => session-native.test.ts}` (+102, -109)
- `packages/core/test/session-projector.test.ts` (+204, -19)
- `packages/core/test/session-runner-message.test.ts` (+25, -31)
- `packages/core/test/session-runner-tool-events.test.ts` (+10, -10)
- `packages/core/test/session-runner.test.ts` (+77, -54)
- `packages/core/test/tool-execute.test.ts` (+56, -0)
- `packages/core/test/tool-todo.test.ts` (+77, -0)
- `packages/core/test/v1-migration.test.ts` (+7, -6)
- `packages/core/test/voice.test.ts` (+30, -7)
- `packages/stats/core/package.json` (+1, -1)
- `packages/stats/core/src/domain/inference.test.ts` (+10, -6)
- `packages/stats/core/src/domain/model-normalization.ts` (+2, -1)

#### Other Changes
- `.github/ISSUE_TEMPLATE/bug-report.yml` (+3, -3)
- `.github/workflows/deploy-changelog.yml` (+1, -1)
- `.github/workflows/deploy-files.yml` (+1, -1)
- `.github/workflows/deploy-posts.yml` (+1, -1)
- `.github/workflows/deploy-update.yml` (+1, -1)
- `.github/workflows/deploy-www.yml` (+1, -1)
- `.github/workflows/deploy.yml` (+1, -1)
- `.opencode/skills/unit-tests/SKILL.md` (+1, -1)
- `CHANGELOG.md` (+146, -0)
- `README.ar.md` (+8, -12)
- `README.bn.md` (+8, -12)
- `README.br.md` (+8, -12)
- `README.bs.md` (+8, -12)
- `README.da.md` (+8, -12)
- `README.de.md` (+8, -12)
- `README.es.md` (+8, -12)
- `README.fr.md` (+8, -12)
- `README.gr.md` (+8, -12)
- `README.it.md` (+8, -12)
- `README.ja.md` (+8, -12)
- `README.ko.md` (+8, -12)
- `README.md` (+8, -12)
- `README.no.md` (+8, -12)
- `README.pl.md` (+8, -12)
- `README.ru.md` (+8, -12)
- `README.th.md` (+8, -12)
- `README.tr.md` (+8, -12)
- `README.uk.md` (+8, -12)
- `README.vi.md` (+8, -12)
- `README.zh.md` (+8, -12)
- `README.zht.md` (+8, -12)
- `bun.lock` (+66, -68)
- `bunfig.toml` (+1, -1)
- `infra/app.ts` (+0, -3)
- `infra/console.ts` (+3, -0)
- `nix/hashes.json` (+3, -3)
- `nix/node_modules.nix` (+3, -1)
- `package.json` (+5, -6)
- `packages/ai/package.json` (+1, -1)
- `packages/ai/src/experimental/realtime.ts` (+38, -2)
- `packages/ai/src/protocols/alibaba-chat.ts` (+0, -1)
- `packages/ai/src/protocols/openai-chat.ts` (+13, -47)
- `packages/ai/src/protocols/venice-chat.ts` (+0, -1)
- `packages/ai/src/protocols/zai-chat.ts` (+0, -1)
- `packages/ai/src/providers/cerebras.ts` (+0, -1)
- `packages/ai/src/providers/cohere.ts` (+0, -2)
- `packages/ai/src/providers/deepinfra.ts` (+0, -1)
- `packages/ai/src/providers/deepseek.ts` (+1, -1)
- `packages/ai/src/providers/groq.ts` (+0, -1)
- `packages/ai/src/providers/meta.ts` (+1, -1)
- `packages/ai/src/providers/minimax.ts` (+1, -1)
- `packages/ai/src/providers/moonshot.ts` (+0, -1)
- `packages/ai/src/providers/togetherai.ts` (+1, -1)
- `packages/ai/src/schema/options.ts` (+2, -1)
- `packages/ai/src/utils/sanitize.ts` (+26, -7)
- `packages/ai/test/fixtures/recordings/digitalocean-chat/gpt-nano-continues-a-tool-call-with-cache-markers.json` (+2, -2)
- `packages/ai/test/fixtures/recordings/digitalocean-chat/gpt-nano-reuses-a-cached-prompt.json` (+2, -2)
- `packages/ai/test/fixtures/recordings/digitalocean-chat/haiku-continues-a-tool-call-with-cache-markers.json` (+2, -2)
- `packages/ai/test/fixtures/recordings/digitalocean-chat/haiku-reuses-a-cached-prompt.json` (+2, -2)
- `packages/ai/test/fixtures/recordings/openrouter-reasoning-tool-loop.json` (+2, -2)
- `packages/ai/test/fixtures/recordings/openrouter-reasoning.json` (+1, -1)
- `packages/ai/test/provider/native-providers.test.ts` (+3, -3)
- `packages/ai/test/provider/openai-chat.test.ts` (+48, -0)
- `packages/ai/test/realtime.test.ts` (+57, -4)
- `packages/ai/test/sanitize.test.ts` (+79, -0)
- `packages/app/AGENTS.md` (+18, -0)
- `packages/app/e2e/utils/timeline.ts` (+106, -103)
- `packages/app/package.json` (+1, -1)
- `packages/app/src/home/projects/controller.tsx` (+5, -6)
- `packages/cli/dev/tui.ts` (+0, -1)
- `packages/cli/package.json` (+2, -2)
- `packages/cli/script/opencode-pty.ts` (+4, -2)
- `packages/cli/src/commands/handlers/auth/import.ts` (+4, -2)
- `packages/cli/src/commands/handlers/session/import.ts` (+5, -4)
- `packages/cli/src/mini.ts` (+3, -0)
- `packages/cli/src/node/target.ts` (+1, -1)
- `packages/cli/src/run/noninteractive.ts` (+9, -11)
- `packages/cli/src/run/run.ts` (+2, -2)
- `packages/cli/src/services/update-preflight.tsx` (+6, -4)
- `packages/cli/src/ui/timeline.tsx` (+4, -3)
- `packages/cli/test/acp/compaction.test.ts` (+4, -4)
- `packages/cli/test/acp/prompt.test.ts` (+2, -2)
- `packages/cli/test/acp/translate.test.ts` (+6, -6)
- `packages/cli/test/auth.test.ts` (+36, -0)
- `packages/cli/test/fixture/mini-wait.ts` (+24, -0)
- `packages/cli/test/import-export.test.ts` (+8, -3)
- `packages/cli/test/mini-timeout.test.ts` (+47, -0)
- `packages/cli/test/node-assets.test.ts` (+1, -1)
- `packages/cli/test/service.test.ts` (+1, -1)
- `packages/client/package.json` (+1, -1)
- `packages/client/src/effect/api/api.ts` (+49, -27)
- `packages/client/src/effect/generated/client.ts` (+25, -2)
- `packages/client/src/promise/generated/client.ts` (+21, -1)
- `packages/client/src/promise/generated/types.ts` (+147, -1007)
- `packages/client/src/solid/data.ts` (+18, -15)
- `packages/client/test/solid-compaction.test.ts` (+3, -18)
- `packages/client/test/solid-usage.test.ts` (+0, -1)
- `packages/codemode/interpreter-support.md` (+8, -5)
- `packages/codemode/package.json` (+1, -1)
- `packages/codemode/src/stdlib/array.ts` (+6, -2)
- `packages/codemode/src/stdlib/bytes.ts` (+27, -15)
- `packages/codemode/src/stdlib/number.ts` (+2, -7)
- `packages/codemode/test/array-callbacks-test262.test.ts` (+14, -0)
- `packages/codemode/test/stdlib.test.ts` (+74, -0)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/component/go-models.ts` (+10, -2)
- `packages/console/app/src/i18n/ar.ts` (+1, -1)
- `packages/console/app/src/i18n/br.ts` (+1, -1)
- `packages/console/app/src/i18n/da.ts` (+1, -1)
- `packages/console/app/src/i18n/de.ts` (+1, -1)
- `packages/console/app/src/i18n/en.ts` (+1, -1)
- `packages/console/app/src/i18n/es.ts` (+1, -1)
- `packages/console/app/src/i18n/fr.ts` (+1, -1)
- `packages/console/app/src/i18n/it.ts` (+1, -1)
- `packages/console/app/src/i18n/ja.ts` (+1, -1)
- `packages/console/app/src/i18n/ko.ts` (+1, -1)
- `packages/console/app/src/i18n/no.ts` (+1, -1)
- `packages/console/app/src/i18n/pl.ts` (+1, -1)
- `packages/console/app/src/i18n/ru.ts` (+1, -1)
- `packages/console/app/src/i18n/th.ts` (+1, -1)
- `packages/console/app/src/i18n/tr.ts` (+1, -1)
- `packages/console/app/src/i18n/uk.ts` (+1, -1)
- `packages/console/app/src/i18n/zh.ts` (+1, -1)
- `packages/console/app/src/i18n/zht.ts` (+1, -1)
- `packages/console/app/src/lib/aws.ts` (+2, -2)
- `packages/console/app/src/lib/enterprise-spam.test.ts` (+155, -0)
- `packages/console/app/src/lib/enterprise-spam.ts` (+75, -0)
- `packages/console/app/src/lib/enterprise.ts` (+44, -9)
- `packages/console/app/src/routes/go/index.tsx` (+2, -2)
- `packages/desktop/AGENTS.md` (+1, -0)
- `packages/desktop/package.json` (+1, -1)
- `packages/desktop/scripts/dev.ts` (+2, -2)
- `packages/desktop/src/main/lifecycle/configure.ts` (+2, -3)
- `packages/desktop/src/main/service/background-service.ts` (+6, -2)
- `packages/function/package.json` (+1, -1)
- `packages/function/src/api.ts` (+0, -80)
- `packages/gui-extensions/AGENTS.md` (+1, -1)
- `packages/gui-extensions/package.json` (+1, -1)
- `packages/gui-extensions/src/microsoft-office/worker-rpc.fixture.ts` (+11, -1)
- `packages/gui-extensions/src/microsoft-office/worker-rpc.test.ts` (+20, -8)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/httpapi-codegen/package.json` (+1, -1)
- `packages/latex/package.json` (+1, -1)
- `packages/latex/src/markdown.test.ts` (+15, -7)
- `packages/merman/package.json` (+1, -1)
- `packages/merman/src/flowchart/flowchart.test.ts` (+19, -0)
- `packages/merman/src/flowchart/parser.ts` (+15, -15)
- `packages/merman/src/test/markdown.test.ts` (+28, -38)
- `packages/plugin-browser/package.json` (+1, -1)
- `packages/plugin/package.json` (+3, -3)
- `packages/plugin/src/effect/session.ts` (+2, -1)
- `packages/plugin/src/promise/session.ts` (+2, -1)
- `packages/plugins/figma/package.json` (+1, -1)
- `packages/protocol/openapi.json` (+188, -86)
- `packages/protocol/package.json` (+1, -1)
- `packages/protocol/src/errors.ts` (+9, -0)
- `packages/protocol/src/groups/permission.ts` (+25, -1)
- `packages/protocol/src/groups/session.ts` (+20, -2)
- `packages/schema/package.json` (+1, -1)
- `packages/schema/src/config/experimental.ts` (+3, -0)
- `packages/schema/src/credential-legacy.ts` (+29, -0)
- `packages/schema/src/credential.ts` (+0, -2)
- `packages/schema/src/event-manifest.ts` (+0, -2)
- `packages/schema/src/model-compatibility.ts` (+2, -0)
- `packages/schema/src/session-compaction-event.ts` (+0, -13)
- `packages/schema/src/session-event.ts` (+25, -12)
- `packages/schema/src/session-legacy.ts` (+116, -0)
- `packages/schema/src/session-message.ts` (+14, -13)
- `packages/schema/src/session-provider-context.ts` (+0, -24)
- `packages/schema/src/session.ts` (+12, -0)
- `packages/schema/test/contract-hygiene.test.ts` (+3, -3)
- `packages/schema/test/credential-legacy.test.ts` (+55, -0)
- `packages/schema/test/event-manifest.test.ts` (+4, -2)
- `packages/schema/test/session-legacy.test.ts` (+178, -0)
- `packages/schema/test/session-terminal.test.ts` (+2, -24)
- `packages/sdk/package.json` (+1, -1)
- `packages/server/package.json` (+2, -2)
- `packages/server/src/handlers/permission.ts` (+25, -1)
- `packages/server/src/handlers/session.ts` (+4, -0)
- `packages/server/test/fetch.test.ts` (+1, -1)
- `packages/server/test/message.test.ts` (+0, -1)
- `packages/server/test/permission-saved.test.ts` (+73, -0)
- `packages/server/test/session-import.test.ts` (+80, -0)
- `packages/server/test/session-update.test.ts` (+47, -19)
- `packages/session-ui/package.json` (+1, -1)
- `packages/session-ui/src/message/message-content.tsx` (+1, -1)
- `packages/session-ui/src/storybook/current-session-fixtures.ts` (+2, -4)
- `packages/session-ui/src/timeline/mermaid.stories.tsx` (+2, -2)
- `packages/session-ui/src/timeline/rows-current.test.ts` (+0, -2)
- `packages/session-ui/src/timeline/timeline-row.stories.tsx` (+1, -1)
- `packages/simulation/package.json` (+1, -1)
- `packages/simulation/src/frontend/renderer.ts` (+14, -3)
- `packages/simulation/src/frontend/simulation.ts` (+2, -1)
- `packages/simulation/test/recording.test.ts` (+19, -10)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/app/src/routes/index.tsx` (+1, -0)
- `packages/stats/app/src/routes/model-catalog.test.ts` (+9, -1)
- `packages/stats/app/src/routes/model-catalog.ts` (+2, -1)
- `packages/stats/app/test/model-catalog.test.ts` (+9, -9)
- `packages/stats/server/package.json` (+1, -1)
- `packages/theme/package.json` (+1, -1)
- `packages/theme/src/tui/syntax.ts` (+5, -4)
- `packages/tui/bunfig.toml` (+1, -1)
- `packages/tui/package.json` (+2, -3)
- `packages/tui/src/app.tsx` (+26, -15)
- `packages/tui/src/component/dialog-config.tsx` (+64, -4)
- `packages/tui/src/component/dialog-model-free.tsx` (+77, -0)
- `packages/tui/src/component/dialog-model.tsx` (+86, -81)
- `packages/tui/src/component/dialog-theme-list.tsx` (+4, -1)
- `packages/tui/src/component/fade-in-text.tsx` (+2, -2)
- `packages/tui/src/component/masked-text.ts` (+31, -28)
- `packages/tui/src/component/model-options.tsx` (+97, -0)
- `packages/tui/src/component/one-cell-spinner.tsx` (+1, -3)
- `packages/tui/src/component/patch-diff.tsx` (+2, -1)
- `packages/tui/src/component/prompt/autocomplete.tsx` (+18, -11)
- `packages/tui/src/component/prompt/index.tsx` (+25, -19)
- `packages/tui/src/component/register-spinner.ts` (+0, -6)
- `packages/tui/src/component/retry-provider.tsx` (+6, -8)
- `packages/tui/src/component/session-tabs.tsx` (+1, -3)
- `packages/tui/src/component/shimmer-text.tsx` (+1, -1)
- `packages/tui/src/component/spinner-renderable.ts` (+158, -0)
- `packages/tui/src/component/spinner.tsx` (+1, -3)
- `packages/tui/src/component/title-shimmer.tsx` (+82, -74)
- `packages/tui/src/component/todo-item.tsx` (+27, -0)
- `packages/tui/src/context/program-status.ts` (+94, -0)
- `packages/tui/src/context/session-tabs.tsx` (+24, -0)
- `packages/tui/src/context/theme.tsx` (+1, -1)
- `packages/tui/src/editor.ts` (+2, -5)
- `packages/tui/src/feature-plugins/sidebar/todo.tsx` (+58, -0)
- `packages/tui/src/feature-plugins/system/diff-viewer-file-tree.tsx` (+4, -1)
- `packages/tui/src/feature-plugins/system/diff-viewer.tsx` (+4, -4)
- `packages/tui/src/feature-plugins/system/storybook/index.tsx` (+2, -0)
- `packages/tui/src/feature-plugins/system/storybook/todo.tsx` (+166, -0)
- `packages/tui/src/mini/demo.ts` (+19, -1)
- `packages/tui/src/mini/entry.body.ts` (+2, -0)
- `packages/tui/src/mini/footer.form.tsx` (+5, -4)
- `packages/tui/src/mini/footer.permission.tsx` (+4, -3)
- `packages/tui/src/mini/footer.prompt.tsx` (+22, -28)
- `packages/tui/src/mini/footer.subagent.tsx` (+1, -3)
- `packages/tui/src/mini/footer.ts` (+5, -1)
- `packages/tui/src/mini/footer.view.tsx` (+4, -4)
- `packages/tui/src/mini/mono.ts` (+16, -15)
- `packages/tui/src/mini/prompt.editor.ts` (+7, -1)
- `packages/tui/src/mini/prompt.shared.ts` (+15, -10)
- `packages/tui/src/mini/runtime.lifecycle.ts` (+11, -7)
- `packages/tui/src/mini/scrollback.shared.ts` (+3, -7)
- `packages/tui/src/mini/scrollback.surface.ts` (+16, -4)
- `packages/tui/src/mini/scrollback.writer.tsx` (+64, -10)
- `packages/tui/src/mini/stream-v2.subagent.ts` (+3, -4)
- `packages/tui/src/mini/stream-v2.transport.ts` (+24, -6)
- `packages/tui/src/mini/theme.ts` (+12, -1)
- `packages/tui/src/mini/tool.ts` (+36, -0)
- `packages/tui/src/mini/types.ts` (+12, -1)
- `packages/tui/src/plugin/builtins.ts` (+2, -0)
- `packages/tui/src/prompt/directory-completion.ts` (+4, -5)
- `packages/tui/src/prompt/display.ts` (+19, -39)
- `packages/tui/src/prompt/history.tsx` (+4, -4)
- `packages/tui/src/prompt/mention.ts` (+25, -17)
- `packages/tui/src/prompt/part.ts` (+15, -3)
- `packages/tui/src/routes/session/composer/subagents-tab.tsx` (+3, -1)
- `packages/tui/src/routes/session/group-view.tsx` (+4, -1)
- `packages/tui/src/routes/session/index.tsx` (+43, -6)
- `packages/tui/src/routes/session/message-parts.tsx` (+6, -2)
- `packages/tui/src/routes/session/thinking-syntax.ts` (+3, -2)
- `packages/tui/src/ui/dialog-export-options.tsx` (+139, -140)
- `packages/tui/src/ui/dialog-export-result.tsx` (+8, -3)
- `packages/tui/src/ui/dialog-prompt.tsx` (+1, -0)
- `packages/tui/src/ui/dialog-select.tsx` (+82, -13)
- `packages/tui/src/ui/dialog.tsx` (+5, -3)
- `packages/tui/src/ui/spinner.ts` (+1, -1)
- `packages/tui/src/util/renderer.ts` (+11, -3)
- `packages/tui/src/util/todo.ts` (+43, -0)
- `packages/tui/test/app-lifecycle.test.tsx` (+42, -10)
- `packages/tui/test/cli/cmd/tui/model-options.test.ts` (+47, -26)
- `packages/tui/test/cli/tui/data.test.tsx` (+10, -13)
- `packages/tui/test/cli/tui/diff-viewer.test.tsx` (+6, -2)
- `packages/tui/test/cli/tui/session-rows.test.ts` (+0, -2)
- `packages/tui/test/compact-admission.test.tsx` (+4, -2)
- `packages/tui/test/completion-notices.test.tsx` (+4, -2)
- `packages/tui/test/component/dialog-export-options.test.tsx` (+68, -0)
- `packages/tui/test/component/retry-provider.test.tsx` (+5, -3)
- `packages/tui/test/component/shimmer-text.test.tsx` (+37, -0)
- `packages/tui/test/component/spinner-renderable.test.tsx` (+132, -0)
- `packages/tui/test/context/program-status.test.ts` (+73, -0)
- `packages/tui/test/copy-session-id.test.tsx` (+2, -1)
- `packages/tui/test/editor.test.ts` (+27, -7)
- `packages/tui/test/fixture/app.ts` (+11, -7)
- `packages/tui/test/fixture/fixture.ts` (+12, -1)
- `packages/tui/test/fixture/plugin/native-resources/tui.tsx` (+26, -0)
- `packages/tui/test/markdown-streaming.test.tsx` (+22, -10)
- `packages/tui/test/mini/footer.test.ts` (+2, -1)
- `packages/tui/test/mini/footer.view.test.tsx` (+56, -8)
- `packages/tui/test/mini/prompt.editor.test.ts` (+9, -7)
- `packages/tui/test/mini/prompt.shared.test.ts` (+27, -57)
- `packages/tui/test/mini/scrollback.surface.test.ts` (+57, -8)
- `packages/tui/test/mini/stream-v2.transport.test.ts` (+47, -11)
- `packages/tui/test/mini/theme.test.ts` (+18, -0)
- `packages/tui/test/new-session-id.test.tsx` (+3, -1)
- `packages/tui/test/plugin-keymap.test.tsx` (+5, -17)
- `packages/tui/test/plugin-markdown.test.tsx` (+4, -4)
- `packages/tui/test/plugin-native-resources.test.tsx` (+11, -0)
- `packages/tui/test/preload.ts` (+17, -0)
- `packages/tui/test/prompt-offset.test.tsx` (+58, -0)
- `packages/tui/test/prompt-paste.test.tsx` (+16, -0)
- `packages/tui/test/prompt-shell-failure.test.tsx` (+76, -0)
- `packages/tui/test/prompt/autocomplete.test.ts` (+11, -16)
- `packages/tui/test/prompt/display.test.ts` (+66, -37)
- `packages/tui/test/prompt/history.test.ts` (+12, -8)
- `packages/tui/test/prompt/mention.test.ts` (+22, -14)
- `packages/tui/test/prompt/part.test.ts` (+17, -28)
- `packages/tui/test/session-activity-anchor.test.tsx` (+2, -1)
- `packages/tui/test/session-backfill-disclosure.test.tsx` (+2, -1)
- `packages/tui/test/session-group-navigation.test.tsx` (+2, -1)
- `packages/tui/test/session-home.test.tsx` (+2, -1)
- `packages/tui/test/session-mount-budget.test.tsx` (+2, -1)
- `packages/tui/test/session-terminal-availability.test.tsx` (+2, -1)
- `packages/tui/test/session-wheel-focus.test.tsx` (+2, -1)
- `packages/tui/test/stats.view.test.tsx` (+2, -1)
- `packages/tui/test/theme/v2/resolve.test.ts` (+10, -5)
- `packages/tui/test/ui/link.test.tsx` (+3, -1)
- `packages/tui/test/util/renderer.test.ts` (+19, -13)
- `packages/tui/test/util/selection-keys.test.ts` (+0, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/assets/icons/provider/meituan.svg` (+6, -0)
- `packages/ui/src/assets/icons/provider/meta.svg` (+3, -0)
- `packages/ui/src/assets/icons/provider/reflection.svg` (+3, -0)
- `packages/ui/src/assets/icons/provider/stepfun.svg` (+16, -24)
- `packages/ui/src/components/provider-icons/sprite.svg` (+34, -23)
- `packages/ui/src/components/provider-icons/types.ts` (+3, -0)
- `packages/util/package.json` (+1, -1)
- `packages/util/src/no-timeout-fetch.test.ts` (+33, -0)
- `packages/util/src/no-timeout-fetch.ts` (+5, -0)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/agents.mdx` (+41, -19)
- `packages/web/src/content/docs/ar/agents.mdx` (+14, -14)
- `packages/web/src/content/docs/ar/commands.mdx` (+1, -1)
- `packages/web/src/content/docs/ar/config.mdx` (+3, -3)
- `packages/web/src/content/docs/ar/custom-tools.mdx` (+4, -4)
- `packages/web/src/content/docs/ar/permissions.mdx` (+9, -9)
- `packages/web/src/content/docs/ar/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/ar/tools.mdx` (+3, -3)
- `packages/web/src/content/docs/ar/tui.mdx` (+1, -1)
- `packages/web/src/content/docs/bs/agents.mdx` (+14, -14)
- `packages/web/src/content/docs/bs/commands.mdx` (+1, -1)
- `packages/web/src/content/docs/bs/config.mdx` (+3, -3)
- `packages/web/src/content/docs/bs/custom-tools.mdx` (+4, -4)
- `packages/web/src/content/docs/bs/permissions.mdx` (+9, -9)
- `packages/web/src/content/docs/bs/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/bs/tools.mdx` (+3, -3)
- `packages/web/src/content/docs/bs/tui.mdx` (+1, -1)
- `packages/web/src/content/docs/cli.mdx` (+7, -7)
- `packages/web/src/content/docs/commands.mdx` (+1, -1)
- `packages/web/src/content/docs/config.mdx` (+4, -4)
- `packages/web/src/content/docs/custom-tools.mdx` (+4, -4)
- `packages/web/src/content/docs/da/agents.mdx` (+14, -14)
- `packages/web/src/content/docs/da/commands.mdx` (+1, -1)
- `packages/web/src/content/docs/da/config.mdx` (+3, -3)
- `packages/web/src/content/docs/da/custom-tools.mdx` (+4, -4)
- `packages/web/src/content/docs/da/permissions.mdx` (+9, -9)
- `packages/web/src/content/docs/da/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/da/tools.mdx` (+3, -3)
- `packages/web/src/content/docs/da/tui.mdx` (+1, -1)
- `packages/web/src/content/docs/de/agents.mdx` (+14, -14)
- `packages/web/src/content/docs/de/commands.mdx` (+1, -1)
- `packages/web/src/content/docs/de/config.mdx` (+3, -3)
- `packages/web/src/content/docs/de/custom-tools.mdx` (+1, -1)
- `packages/web/src/content/docs/de/permissions.mdx` (+9, -9)
- `packages/web/src/content/docs/de/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/de/tools.mdx` (+3, -3)
- `packages/web/src/content/docs/de/tui.mdx` (+1, -1)
- `packages/web/src/content/docs/es/agents.mdx` (+14, -14)
- `packages/web/src/content/docs/es/commands.mdx` (+1, -1)
- `packages/web/src/content/docs/es/config.mdx` (+3, -3)
- `packages/web/src/content/docs/es/custom-tools.mdx` (+4, -4)
- `packages/web/src/content/docs/es/permissions.mdx` (+9, -9)
- `packages/web/src/content/docs/es/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/es/tools.mdx` (+3, -3)
- `packages/web/src/content/docs/es/tui.mdx` (+1, -1)
- `packages/web/src/content/docs/fr/agents.mdx` (+14, -14)
- `packages/web/src/content/docs/fr/commands.mdx` (+1, -1)
- `packages/web/src/content/docs/fr/config.mdx` (+3, -3)
- `packages/web/src/content/docs/fr/custom-tools.mdx` (+1, -1)
- `packages/web/src/content/docs/fr/permissions.mdx` (+9, -9)
- `packages/web/src/content/docs/fr/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/fr/tools.mdx` (+2, -2)
- `packages/web/src/content/docs/fr/tui.mdx` (+1, -1)
- `packages/web/src/content/docs/it/agents.mdx` (+14, -14)
- `packages/web/src/content/docs/it/commands.mdx` (+1, -1)
- `packages/web/src/content/docs/it/config.mdx` (+3, -3)
- `packages/web/src/content/docs/it/custom-tools.mdx` (+4, -4)
- `packages/web/src/content/docs/it/permissions.mdx` (+9, -9)
- `packages/web/src/content/docs/it/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/it/tools.mdx` (+3, -3)
- `packages/web/src/content/docs/it/tui.mdx` (+1, -1)
- `packages/web/src/content/docs/ja/agents.mdx` (+14, -14)
- `packages/web/src/content/docs/ja/commands.mdx` (+1, -1)
- `packages/web/src/content/docs/ja/config.mdx` (+3, -3)
- `packages/web/src/content/docs/ja/custom-tools.mdx` (+4, -4)
- `packages/web/src/content/docs/ja/permissions.mdx` (+12, -12)
- `packages/web/src/content/docs/ja/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/ja/tools.mdx` (+3, -3)
- `packages/web/src/content/docs/ja/tui.mdx` (+1, -1)
- `packages/web/src/content/docs/ko/agents.mdx` (+14, -14)
- `packages/web/src/content/docs/ko/commands.mdx` (+1, -1)
- `packages/web/src/content/docs/ko/config.mdx` (+3, -3)
- `packages/web/src/content/docs/ko/custom-tools.mdx` (+4, -4)
- `packages/web/src/content/docs/ko/permissions.mdx` (+9, -9)
- `packages/web/src/content/docs/ko/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/ko/tools.mdx` (+3, -3)
- `packages/web/src/content/docs/ko/tui.mdx` (+1, -1)
- `packages/web/src/content/docs/nb/agents.mdx` (+14, -14)
- `packages/web/src/content/docs/nb/commands.mdx` (+1, -1)
- `packages/web/src/content/docs/nb/config.mdx` (+3, -3)
- `packages/web/src/content/docs/nb/custom-tools.mdx` (+4, -4)
- `packages/web/src/content/docs/nb/permissions.mdx` (+9, -9)
- `packages/web/src/content/docs/nb/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/nb/tools.mdx` (+3, -3)
- `packages/web/src/content/docs/nb/tui.mdx` (+1, -1)
- `packages/web/src/content/docs/permissions.mdx` (+9, -9)
- `packages/web/src/content/docs/pl/agents.mdx` (+14, -14)
- `packages/web/src/content/docs/pl/commands.mdx` (+1, -1)
- `packages/web/src/content/docs/pl/config.mdx` (+3, -3)
- `packages/web/src/content/docs/pl/custom-tools.mdx` (+4, -4)
- `packages/web/src/content/docs/pl/permissions.mdx` (+9, -9)
- `packages/web/src/content/docs/pl/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/pl/tools.mdx` (+3, -3)
- `packages/web/src/content/docs/pl/tui.mdx` (+1, -1)
- `packages/web/src/content/docs/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/pt-br/agents.mdx` (+14, -14)
- `packages/web/src/content/docs/pt-br/commands.mdx` (+1, -1)
- `packages/web/src/content/docs/pt-br/config.mdx` (+3, -3)
- `packages/web/src/content/docs/pt-br/custom-tools.mdx` (+4, -4)
- `packages/web/src/content/docs/pt-br/permissions.mdx` (+9, -9)
- `packages/web/src/content/docs/pt-br/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/pt-br/tools.mdx` (+3, -3)
- `packages/web/src/content/docs/pt-br/tui.mdx` (+1, -1)
- `packages/web/src/content/docs/ru/agents.mdx` (+14, -14)
- `packages/web/src/content/docs/ru/commands.mdx` (+1, -1)
- `packages/web/src/content/docs/ru/config.mdx` (+3, -3)
- `packages/web/src/content/docs/ru/custom-tools.mdx` (+1, -1)
- `packages/web/src/content/docs/ru/permissions.mdx` (+9, -9)
- `packages/web/src/content/docs/ru/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/ru/tools.mdx` (+3, -3)
- `packages/web/src/content/docs/ru/tui.mdx` (+1, -1)
- `packages/web/src/content/docs/th/agents.mdx` (+13, -13)
- `packages/web/src/content/docs/th/commands.mdx` (+1, -1)
- `packages/web/src/content/docs/th/config.mdx` (+3, -3)
- `packages/web/src/content/docs/th/custom-tools.mdx` (+4, -4)
- `packages/web/src/content/docs/th/permissions.mdx` (+9, -9)
- `packages/web/src/content/docs/th/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/th/tools.mdx` (+3, -3)
- `packages/web/src/content/docs/th/tui.mdx` (+1, -1)
- `packages/web/src/content/docs/tools.mdx` (+3, -3)
- `packages/web/src/content/docs/tr/agents.mdx` (+14, -14)
- `packages/web/src/content/docs/tr/commands.mdx` (+1, -1)
- `packages/web/src/content/docs/tr/config.mdx` (+4, -4)
- `packages/web/src/content/docs/tr/custom-tools.mdx` (+4, -4)
- `packages/web/src/content/docs/tr/permissions.mdx` (+9, -9)
- `packages/web/src/content/docs/tr/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/tr/tools.mdx` (+3, -3)
- `packages/web/src/content/docs/tr/tui.mdx` (+1, -1)
- `packages/web/src/content/docs/tui.mdx` (+1, -1)
- `packages/web/src/content/docs/zh-cn/agents.mdx` (+14, -14)
- `packages/web/src/content/docs/zh-cn/commands.mdx` (+1, -1)
- `packages/web/src/content/docs/zh-cn/config.mdx` (+3, -3)
- `packages/web/src/content/docs/zh-cn/custom-tools.mdx` (+4, -4)
- `packages/web/src/content/docs/zh-cn/permissions.mdx` (+9, -9)
- `packages/web/src/content/docs/zh-cn/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/zh-cn/tools.mdx` (+3, -3)
- `packages/web/src/content/docs/zh-cn/tui.mdx` (+1, -1)
- `packages/web/src/content/docs/zh-tw/agents.mdx` (+14, -14)
- `packages/web/src/content/docs/zh-tw/commands.mdx` (+1, -1)
- `packages/web/src/content/docs/zh-tw/config.mdx` (+3, -3)
- `packages/web/src/content/docs/zh-tw/custom-tools.mdx` (+4, -4)
- `packages/web/src/content/docs/zh-tw/permissions.mdx` (+9, -9)
- `packages/web/src/content/docs/zh-tw/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/zh-tw/tools.mdx` (+3, -3)
- `packages/web/src/content/docs/zh-tw/tui.mdx` (+1, -1)
- `script/upgrade-opentui.ts` (+1, -35)
- `sdks/vscode/package.json` (+1, -1)
- `services/update/package.json` (+1, -1)
- `services/www/openapi.json` (+188, -86)
- `services/www/public/openapi.json` (+188, -86)
- `services/www/src/docs/content/build/plugins/cli.mdx` (+37, -2)
- `services/www/src/docs/content/build/plugins/index.mdx` (+1, -1)
- `services/www/src/docs/content/compaction.mdx` (+11, -9)
- `services/www/src/docs/content/config.mdx` (+14, -0)
- `services/www/src/docs/content/console/api/index.mdx` (+23, -1)
- `services/www/src/docs/content/console/api/inference.mdx` (+1, -1)
- `services/www/src/docs/content/console/go.mdx` (+9, -8)
- `services/www/src/docs/content/console/harnesses/claude-code.mdx` (+1, -1)
- `services/www/src/docs/content/console/harnesses/codex.mdx` (+2, -2)
- `services/www/src/docs/content/console/harnesses/hermes.mdx` (+1, -1)
- `services/www/src/docs/content/console/harnesses/index.mdx` (+12, -3)
- `services/www/src/docs/content/console/harnesses/pi.mdx` (+1, -2)
- `services/www/src/docs/content/console/harnesses/raycast.mdx` (+1, -2)
- `services/www/src/docs/content/console/models.mdx` (+3, -3)
- `services/www/src/docs/content/index.mdx` (+8, -0)
- `services/www/src/docs/content/migrate-v1.mdx` (+11, -0)
- `specs/v2/session.md` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index b88ea5b..40b920c 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "2.0.32",
+  "version": "2.1.0",
   "name": "@opencode/core",
   "type": "module",
   "license": "MIT",
@@ -106,7 +106,7 @@
     "@lydell/node-pty": "catalog:",
     "@modelcontextprotocol/client": "2.0.0",
     "@modelcontextprotocol/core": "2.0.0",
-    "@opencode-ai/pty": "0.2.0",
+    "@opencode-ai/pty": "0.3.1",
     "@opencode/ai": "workspace:*",
     "@opencode/codemode": "workspace:*",
     "@opencode/plugin": "workspace:*",
```

#### packages/core/src/bus.ts
```diff
diff --git a/packages/core/src/bus.ts b/packages/core/src/bus.ts
index 30bf10a..97f1257 100644
--- a/packages/core/src/bus.ts
+++ b/packages/core/src/bus.ts
@@ -12,6 +12,7 @@ import { makeGlobalNode } from "@opencode/util/effect/app-node"
 import { isDeepStrictEqual } from "node:util"
 import { Durable } from "@opencode/schema/durable-event-manifest"
 import { SessionEvent } from "@opencode/schema/session-event"
+import { SessionLegacy } from "@opencode/schema/session-legacy"
 import type { SessionID } from "@opencode/schema/session-id"
 import { AbsolutePath } from "@opencode/schema/schema"
 
@@ -70,6 +71,10 @@ const envelope = (aggregateID: string, seq: number, version: number) => ({
   version: Event.Version.make(version),
 })
 
+// Every stored event decodes through here, so payloads written in older shapes are upgraded in one place.
+const decodeStoredData = (definition: Event.DurableDefinition, data: unknown) =>
+  Schema.decodeUnknownSync(definition.data)(SessionLegacy.event(definition.type, data))
+
 const decodeSerializedEvent = (event: SerializedEvent): Event.Payload => {
   const definition = Durable.get(event.type)
   if (!definition?.durable) {
@@ -80,7 +85,7 @@ const decodeSerializedEvent = (event: SerializedEvent): Event.Payload => {
     created: event.created ?? 0,
     type: definition.type,
     durable: envelope(event.aggregateID, event.seq, definition.durable.version),
-    data: Schema.decodeUnknownSync(definition.data)(event.data),
+    data: decodeStoredData(definition, event.data),
   }
 }
 
@@ -346,7 +351,8 @@ export function configured(options?: Options) {
                             stored?.id === event.id &&
                             stored.type === versionedType(definition.type, durable.version) &&
                             stored.created === (event.created ?? 0) &&
-                            isDeepStrictEqual(stored.data, encoded)
+                            // Rows written before a payload rename compare in their upgraded shape.
+                            isDeepStrictEqual(SessionLegacy.event(definition.type, stored.data), encoded)
                           ) {
                             if (input.ownerID && row?.ownerID == null) {
                               yield* db
@@ -684,7 +690,7 @@ export function configured(options?: Options) {
                   id: event.id,
                   created: event.created ?? 0,
                   type: definition.type,
-                  data: Schema.decodeUnknownSync(definition.data)(event.data),
+                  data: decodeStoredData(definition, event.data),
                 } as Event.Payload
                 const committed = yield* commitDurableEvent(definition, payload, {
```

#### packages/core/src/codemode/tool.ts
```diff
diff --git a/packages/core/src/codemode/tool.ts b/packages/core/src/codemode/tool.ts
index ef0d5d6..5aa590f 100644
--- a/packages/core/src/codemode/tool.ts
+++ b/packages/core/src/codemode/tool.ts
@@ -1,16 +1,16 @@
 export * as CodeModeTool from "./tool.js"
 
-import { CodeMode, Namespace, Tool, toolError } from "@opencode/codemode"
+import { CodeMode, Namespace, Tool } from "@opencode/codemode"
 import type {
   Content,
-  Context,
+  Context as ToolContext,
   Error,
   Info,
   Metadata,
   Namespace as ToolNamespace,
   Result,
 } from "@opencode/schema/tool"
-import { Effect, Ref, Schema, Semaphore } from "effect"
+import { Context, Effect, Ref, Schema, Semaphore } from "effect"
 import { definition, normalizedName } from "../tool/runtime.js"
 import { CodeModeCatalog } from "./catalog.js"
 import { CodeModeWeb } from "./web.js"
@@ -47,12 +47,21 @@ type Node<T> = {
   readonly children: Map<string, Node<T>>
 }
 
-type ToolNode = Node<Tool.Tool<never>>
+type ToolNode = Node<Tool.Tool<Run>>
 
 type Tools = {
-  [name: string]: Tool.Tool<never> | Namespace.Namespace<never> | Tools
+  [name: string]: Tool.Tool<Run> | Namespace.Namespace<Run> | Tools
 }
 
+// Per-execution parts of a runtime shared by every execution against the same inventory.
+class Run extends Context.Service<
+  Run,
+  {
+    readonly executeTool: (name: string, tool: Info, input: unknown) => Effect.Effect<unknown, unknown>
+    readonly hooks: CodeMode.Hooks
+  }
+>()("@opencode/CodeModeTool/Run") {}
+
 export type Inventory = {
   readonly tools: ReadonlyMap<string, Info>
   readonly namespaces?: ReadonlyMap<string, ToolNamespace>
@@ -70,7 +79,7 @@ const description = [
 
```

#### packages/core/src/config/normalize.ts
```diff
diff --git a/packages/core/src/config/normalize.ts b/packages/core/src/config/normalize.ts
index af50de4..35d702a 100644
--- a/packages/core/src/config/normalize.ts
+++ b/packages/core/src/config/normalize.ts
@@ -467,6 +467,15 @@ function normalizeExperimental(
         )
         if (value !== undefined) result.portable_shell_scanner = value
       }
+      if (own(experimental, "todo")) {
+        const value = decodeEncoded(
+          ConfigExperimental.Info.fields.todo,
+          experimental.todo,
+          ["experimental", "todo"],
+          diagnostics,
+        )
+        if (value !== undefined) result.todo = value
+      }
       if (own(experimental, "subagent_depth")) {
         const value = decodeEncoded(
           ConfigExperimental.Info.fields.subagent_depth,
```

#### packages/core/src/config/plugin/policy.ts
```diff
diff --git a/packages/core/src/config/plugin/policy.ts b/packages/core/src/config/plugin/policy.ts
index 3c1c2a6..f555044 100644
--- a/packages/core/src/config/plugin/policy.ts
+++ b/packages/core/src/config/plugin/policy.ts
@@ -24,14 +24,20 @@ export const Plugin = define({
     // Authored documents reverse so user-global policy outranks repository policy; organization statements
     // from the connected Console follow every authored one and have the final say.
     const policies = () => ManagedPolicy.statements(loaded.entries, managed.current())
+    const runSync = Effect.runSyncWith(yield* Effect.context())
     yield* ctx.provider.transform((providers) => {
       const current = policies()
+      const denied: string[] = []
       for (const record of providers.list()) {
         const policy = current.findLast(
           (policy) => policy.action === "provider.use" && Wildcard.match(record.provider.id, policy.resource),
         )
-        if (policy?.effect === "deny") providers.remove(record.provider.id)
+        if (policy?.effect !== "deny") continue
+        providers.remove(record.provider.id)
+        // Skip unconfigured catalog entries; deny-all policies would otherwise log the whole catalog.
+        if (record.provider.activation === "enabled") denied.push(record.provider.id)
       }
+      if (denied.length) runSync(Effect.logDebug("providers denied by policy", { providers: denied }))
     })
     yield* ctx.mcp.transform((servers) => {
       const current = policies()
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/package.json
- `src/permission/` - review permission changes from packages/opencode/src/kilocode/permission/allowlist.ts
- `src/tool/browser-open.ts` - update based on kilocode packages/opencode/src/kilocode/tool/browser-open.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/kilocode/tool/task.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/tool/task.ts changes
- `src/tool/todo.ts` - update based on opencode packages/core/src/tool/plugin/todo.ts changes
- `src/tool/todowrite.txt.ts` - update based on opencode packages/core/src/tool/todowrite.txt changes
