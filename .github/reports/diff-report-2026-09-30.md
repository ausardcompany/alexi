# Upstream Changes Report
Generated: 2026-09-30 12:02:41

## Summary
- kilocode: 49 commits, 117 files changed
- opencode: 2 commits, 20 files changed

## kilocode Changes (2dfe6fc87..c98f8740c)

### Commits

- c98f8740c - Merge pull request #14679 from Kilo-Org/remove-link-pr-feature-vscode (Marius, 2026-09-30)
- 0e7988ab4 - test(cli): make goal fork controls test deterministic (#14681) (Marius, 2026-09-30)
- eb7b4896b - test(cli): scope PR-link storage fixtures to Effect layers (marius-kilocode, 2026-09-30)
- 154a8427c - fix(cli): disable session PR linking on non-CLI backends (marius-kilocode, 2026-09-30)
- 27e0eece8 - Merge pull request #14680 from Kilo-Org/fix-goal-feature-cache-and-timers (Marius, 2026-09-30)
- 3f686be23 - fix(vscode): hold goal timer through transient offline (marius-kilocode, 2026-09-30)
- ac4a092aa - fix(goal): preserve prompt cache across goal turns and keep timers running (marius-kilocode, 2026-09-30)
- 0fd06048f - Merge pull request #14675 from Kilo-Org/repro-13963-worktree-switch (Marius, 2026-09-30)
- 1a52798ca - Merge pull request #14673 from Kilo-Org/docs-13269-multi-repo-agent-manager (Marius, 2026-09-30)
- 9a75f1d3c - Merge pull request #14672 from Kilo-Org/fix-browser-resize-black-screen (Marius, 2026-09-30)
- 9076f0301 - fix(opencode): offer the link_pr tool to CLI sessions only (marius-kilocode, 2026-09-30)
- b1ef1c9c4 - fix(agent-manager): ignore unavailable selection for latest-click token (marius-kilocode, 2026-09-30)
- 63ba85de2 - fix(vscode): keep collapsed pastes when browsing prompt history (#14590) (hdcode.dev, 2026-09-30)
- 5b336a90a - fix(agent-manager): keep latest project selection (marius-kilocode, 2026-09-30)
- 52019c9f9 - fix: report git errors when a revert or redo fails  (#14319) (hdcode.dev, 2026-09-30)
- 8767b6584 - fix(vscode): cancel the resize settle timer (marius-kilocode, 2026-09-30)
- c14daa0f3 - docs: document multi-repository Agent Manager workflows (marius-kilocode, 2026-09-30)
- 97dda4f1b - fix(vscode): keep browser preview visible on panel resize (marius-kilocode, 2026-09-30)
- 0b1e01409 - Merge pull request #14658 from Kilo-Org/docs/remove-kiloclaw-app-builder (Emilie Lima Schario, 2026-09-29)
- e9948b600 - Merge pull request #14659 from Kilo-Org/docs/chatgpt-subscription-connections (Joshua Lambert, 2026-09-29)
- 2eb419781 - Merge branch 'main' into docs/chatgpt-subscription-connections (Joshua Lambert, 2026-09-29)
- 266a5c646 - Apply suggestion from @lambertjosh (Joshua Lambert, 2026-09-29)
- ce669acc0 - docs(kilo-docs): address ChatGPT connection review feedback (Josh Lambert, 2026-09-29)
- 6bbd24fc9 - Merge pull request #14650 from Kilo-Org/kwf/owner-pr-session-link-kilocode-20260929 (Igor Šćekić, 2026-09-29)
- 20898b953 - docs(kilo-docs): explain ChatGPT login and subscription connections (Josh Lambert, 2026-09-29)
- fbf812d25 - docs: fix stale Kilo Chat destination references in automation-services (kiloconnect[bot], 2026-09-29)
- 9269ca3bf - docs: remove stale Kilo Chat reference from Webhook Agent Ingest service inventory (kiloconnect[bot], 2026-09-29)
- 130421a62 - docs: remove sunset KiloClaw and App Builder (Emilie Schario, 2026-09-29)
- 88681cac5 - Merge pull request #14656 from Kilo-Org/docs/wsl-disconnect-diagnostics (Alex Gold, 2026-09-29)
- 2c819ec7b - docs: add secrets caution and Public folder note to WSL diagnostic bundle steps (kiloconnect[bot], 2026-09-29)
- dc8c0accb - Merge pull request #14638 from Kilo-Org/codex/posthog-identity-dedup (Pedro Heyerdahl, 2026-09-29)
- 58e95208e - Merge pull request #14585 from Kilo-Org/codex/posthog-autocomplete-sampling (Pedro Heyerdahl, 2026-09-29)
- 69a6a4df4 - docs: add WSL disconnect diagnostics to troubleshooting guide (kiloconnect[bot], 2026-09-29)
- d54816fbf - Merge branch 'main' into codex/posthog-identity-dedup (Pedro Heyerdahl, 2026-09-29)
- de00d0530 - Merge branch 'main' into codex/posthog-autocomplete-sampling (Pedro Heyerdahl, 2026-09-29)
- 3eb55b097 - fix(script): reconcile promise facade ratchet with session test (Igor Šćekić, 2026-09-29)
- 56ab1e502 - fix(sessions): harden per-session PR link evidence (Igor Šćekić, 2026-09-29)
- fbf32ed8d - test(cli): refresh help snapshot for session-scoped pr commands (Igor Šćekić, 2026-09-29)
- 9cc0a9158 - fix(sessions): link a pull request to a session only on its own evidence (Igor Šćekić, 2026-09-29)
- 145aefd7f - test(telemetry): cover disabled and invalid alias markers (Pedro Heyerdahl, 2026-09-28)
- 665efe7b0 - Merge branch 'main' into codex/posthog-identity-dedup (Pedro Heyerdahl, 2026-09-28)
- 62fed980e - chore(telemetry): align error handling and notes with repo guidance (Pedro Heyerdahl, 2026-09-28)
- b334f3a5a - test(telemetry): keep focused identity regressions (Pedro Heyerdahl, 2026-09-28)
- 2cefbf953 - fix(telemetry): use lifecycle events for person properties (Pedro Heyerdahl, 2026-09-28)
- fb39c1703 - refactor(telemetry): inline identity cache and remove unnecessary file handling (Pedro Heyerdahl, 2026-09-28)
- d6426d047 - fix(telemetry): deduplicate delivered identity events across restarts (Pedro Heyerdahl, 2026-09-28)
- 69c72bafa - chore: trim telemetry test changes (Pedro Heyerdahl, 2026-09-25)
- f4d87c19c - test(vscode): isolate telemetry proxy sampling fixture (Pedro Heyerdahl, 2026-09-25)
- 234111e1c - fix(vscode): sample repetitive autocomplete failure telemetry (Pedro Heyerdahl, 2026-09-25)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/link-pr.ts` (+26, -8)
- `packages/opencode/src/kilocode/tool/registry.ts` (+2, -1)
- `packages/opencode/test/kilocode/tool/link-pr.test.ts` (+68, -28)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
(no changes)

#### Other Changes
- `.changeset/agent-manager-latest-selection.md` (+5, -0)
- `.changeset/browser-preview-resize.md` (+5, -0)
- `.changeset/calm-hogs-sample.md` (+5, -0)
- `.changeset/history-keeps-pasted-content.md` (+5, -0)
- `.changeset/quiet-identity-delivery.md` (+5, -0)
- `.changeset/revert-failure-reporting.md` (+6, -0)
- `.changeset/stable-goal-turns.md` (+6, -0)
- `.changeset/vscode-drop-link-pr-tool.md` (+5, -0)
- `.github/docs-sync/surfaces.json` (+0, -1)
- `.github/docs-sync/surfaces.test.mjs` (+0, -1)
- `.github/docs-sync/triage-prompt.md` (+1, -1)
- `packages/kilo-docs/__tests__/content-integrity.test.ts` (+1, -0)
- `packages/kilo-docs/__tests__/sitemap.test.ts` (+1, -0)
- `packages/kilo-docs/lib/nav/code-with-ai.ts` (+0, -1)
- `packages/kilo-docs/next.config.js` (+0, -5)
- `packages/kilo-docs/pages/ai-providers/openai-chatgpt-plus-pro.md` (+100, -37)
- `packages/kilo-docs/pages/ai-providers/openai.md` (+3, -1)
- `packages/kilo-docs/pages/automate/agent-manager-projects.md` (+42, -13)
- `packages/kilo-docs/pages/automate/agent-manager.md` (+2, -0)
- `packages/kilo-docs/pages/code-with-ai/app-builder.md` (+0, -110)
- `packages/kilo-docs/pages/code-with-ai/index.md` (+0, -1)
- `packages/kilo-docs/pages/contributing/architecture/automation-services.md` (+2, -11)
- `packages/kilo-docs/pages/contributing/architecture/cloud-platform.md` (+4, -103)
- `packages/kilo-docs/pages/contributing/architecture/cloud-security.md` (+11, -91)
- `packages/kilo-docs/pages/contributing/architecture/index.md` (+5, -15)
- `packages/kilo-docs/pages/getting-started/byok.md` (+12, -2)
- `packages/kilo-docs/pages/getting-started/setup-authentication.md` (+5, -5)
- `packages/kilo-docs/pages/getting-started/troubleshooting/troubleshooting-extension.md` (+22, -0)
- `packages/kilo-docs/pages/getting-started/using-kilo-for-free.md` (+2, -2)
- `packages/kilo-docs/previous-docs-redirects.js` (+7, -1)
- `packages/kilo-telemetry/src/__tests__/fixtures/identity-process.ts` (+37, -0)
- `packages/kilo-telemetry/src/__tests__/identity-delivery.test.ts` (+105, -0)
- `packages/kilo-telemetry/src/__tests__/telemetry-shutdown.test.ts` (+1, -0)
- `packages/kilo-telemetry/src/client.ts` (+37, -13)
- `packages/kilo-telemetry/src/telemetry.ts` (+18, -13)
- `packages/kilo-vscode/eslint.config.mjs` (+4, -2)
- `packages/kilo-vscode/src/KiloProvider.ts` (+13, -2)
- `packages/kilo-vscode/src/agent-manager/project/messages.ts` (+7, -0)
- `packages/kilo-vscode/src/kilo-provider-utils.ts` (+4, -2)
- `packages/kilo-vscode/src/services/browser-automation/browser-stream.ts` (+19, -0)
- `packages/kilo-vscode/src/services/telemetry/telemetry-proxy-utils.ts` (+15, -2)
- `packages/kilo-vscode/src/services/telemetry/telemetry-proxy.ts` (+1, -0)
- `packages/kilo-vscode/src/shared/revert-error.ts` (+5, -0)
- `packages/kilo-vscode/tests/fixtures/revert-toast-owner.tsx` (+59, -0)
- `packages/kilo-vscode/tests/fixtures/session-provider-activity.tsx` (+61, -0)
- `packages/kilo-vscode/tests/paste-collapse.spec.ts` (+20, -0)
- `packages/kilo-vscode/tests/unit/agent-project-selection.test.ts` (+47, -0)
- `packages/kilo-vscode/tests/unit/browser-broker.test.ts` (+2, -0)
- `packages/kilo-vscode/tests/unit/browser-stream.test.ts` (+5, -4)
- `packages/kilo-vscode/tests/unit/failure-toast.test.ts` (+10, -0)
- `packages/kilo-vscode/tests/unit/i18n-keys.test.ts` (+7, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-load-messages.test.ts` (+40, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-utils.test.ts` (+17, -1)
- `packages/kilo-vscode/tests/unit/revert-toast-owner.test.ts` (+5, -0)
- `packages/kilo-vscode/tests/unit/session-dock.test.ts` (+8, -4)
- `packages/kilo-vscode/tests/unit/telemetry-proxy-utils.test.ts` (+7, -7)
- `packages/kilo-vscode/tests/unit/working-indicator.test.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/failure-toast.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/browser/StreamViewport.tsx` (+4, -3)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+6, -4)
- `packages/kilo-vscode/webview-ui/src/components/chat/SessionDock.tsx` (+8, -1)
- `packages/kilo-vscode/webview-ui/src/components/shared/WorkingIndicator.tsx` (+4, -3)
- `packages/kilo-vscode/webview-ui/src/components/shared/working-indicator-utils.ts` (+4, -3)
- `packages/kilo-vscode/webview-ui/src/context/session-timing.ts` (+48, -1)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+31, -22)
- `packages/kilo-vscode/webview-ui/src/hooks/usePromptHistory.ts` (+24, -10)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+1, -0)
- `packages/opencode/src/cli/cmd/pr.ts` (+103, -45)
- `packages/opencode/src/event-v2-bridge.ts` (+11, -1)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+226, -70)
- `packages/opencode/src/kilo-sessions/pr-link-poller.ts` (+199, -71)
- `packages/opencode/src/kilo-sessions/pr-link.ts` (+289, -214)
- `packages/opencode/src/kilo-sessions/remote-protocol.ts` (+9, -4)
- `packages/opencode/src/kilo-sessions/remote-sender.ts` (+39, -23)
- `packages/opencode/src/kilocode/session/goal/runner.ts` (+58, -1)
- `packages/opencode/src/kilocode/snapshot/lock.ts` (+14, -0)
- `packages/opencode/src/kilocode/snapshot/materialize.ts` (+12, -3)
- `packages/opencode/src/session/tools.ts` (+4, -1)
- `packages/opencode/src/snapshot/index.ts` (+12, -3)
- `packages/opencode/test/cli/help/__snapshots__/help-snapshots.test.ts.snap` (+3, -3)
- `packages/opencode/test/cli/pr-status.test.ts` (+214, -38)
- `packages/opencode/test/kilocode/chart-tool-gating.test.ts` (+6, -0)
- `packages/opencode/test/kilocode/kilo-sessions.test.ts` (+446, -362)
- `packages/opencode/test/kilocode/legacy-sse-event.test.ts` (+8, -1)
- `packages/opencode/test/kilocode/session/goal.test.ts` (+83, -47)
- `packages/opencode/test/kilocode/session/revert.test.ts` (+173, -1)
- `packages/opencode/test/kilocode/sessions/pr-link-client.test.ts` (+171, -0)
- `packages/opencode/test/kilocode/sessions/pr-link-evidence.test.ts` (+310, -0)
- `packages/opencode/test/kilocode/sessions/pr-link.test.ts` (+443, -750)
- `packages/opencode/test/kilocode/sessions/remote-sender.test.ts` (+154, -21)
- `packages/opencode/test/kilocode/snapshot-lock.test.ts` (+40, -0)
- `packages/opencode/test/kilocode/tool-registry-indexing.test.ts` (+0, -6)
- `script/check-opencode-promise-facades.ts` (+6, -2)

### Key Diffs

#### packages/opencode/src/kilocode/tool/link-pr.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/link-pr.ts b/packages/opencode/src/kilocode/tool/link-pr.ts
index c5f3b659e..fb956545f 100644
--- a/packages/opencode/src/kilocode/tool/link-pr.ts
+++ b/packages/opencode/src/kilocode/tool/link-pr.ts
@@ -1,6 +1,6 @@
 import { Tool } from "@/tool/tool"
 import { Instance } from "@/kilocode/instance"
-import { linkMatchesWorktree, parsePrUrl } from "@/kilo-sessions/pr-link"
+import { enabled as prEnabled, linkMatchesWorktree, parsePrUrl } from "@/kilo-sessions/pr-link"
 import { Effect, Schema } from "effect"
 import * as Log from "@opencode-ai/core/util/log"
 import DESCRIPTION from "./link-pr.txt"
@@ -28,8 +28,15 @@ export const LinkPrTool = Tool.define<typeof Params, Meta, never, "link_pr">(
   Effect.succeed({
     description: DESCRIPTION,
     parameters: Params,
-    execute: (params) =>
+    execute: (params, ctx) =>
       Effect.gen(function* () {
+        if (!prEnabled()) {
+          return {
+            title: "PR linking unavailable",
+            output: "Session PR linking is only available in CLI backends.",
+            metadata: { ok: false, reason: "unsupported_client" },
+          }
+        }
         const link = parsePrUrl(params.url)
         if (!link) {
           return {
@@ -55,28 +62,39 @@ export const LinkPrTool = Tool.define<typeof Params, Meta, never, "link_pr">(
           }
         }
 
+        // Store the link against THIS session, never the worktree, so an
+        // explicit link can never fan out to another session sharing the
+        // checkout. `recordSessionLink` runs the same host/owner/repo check as
+        // `linkMatchesWorktree` and refuses a link for a fork or another repo.
         const stored = yield* Effect.tryPromise({
           try: async () => {
-            const { writePrLinkOverride } = await import("@/kilo-sessions/pr-link")
-            await writePrLinkOverride(worktree, link)
+            const { recordSessionLink } = await import("@/kilo-sessions/pr-link")
+            return recordSessionLink(ctx.sessionID, { link, evidence: "user" }, worktree)
           },
           catch: (err) => err,
         }).pipe(
-          Effect.as(true),
+          Effect.map((record) => (record ? ("ok" as const) : ("refused" as const))),
           Effect.catch((err) =>
             Effect.sync(() => {
```

#### packages/opencode/src/kilocode/tool/registry.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/registry.ts b/packages/opencode/src/kilocode/tool/registry.ts
index 2a9e3de9e..daf468044 100644
--- a/packages/opencode/src/kilocode/tool/registry.ts
+++ b/packages/opencode/src/kilocode/tool/registry.ts
@@ -24,6 +24,7 @@ import * as Network from "@/kilocode/sandbox/network"
 import { Notebook } from "@/kilocode/notebook/service"
 import { AgentManager, HostError } from "@/kilocode/agent-manager/service"
 import { KiloSessions } from "@/kilo-sessions/kilo-sessions"
+import { enabled as prEnabled } from "@/kilo-sessions/pr-link"
 import * as Log from "@opencode-ai/core/util/log"
 import type { Config } from "@/config/config"
 import type { RuntimeFlags } from "@/effect/runtime-flags"
@@ -359,7 +360,7 @@ export namespace KiloToolRegistry {
       tools.notify,
       ...(Flag.KILO_CLIENT === "vscode" && tools.openPlan ? [tools.openPlan] : []),
       tools.send,
-      tools.linkPr,
+      ...(prEnabled() ? [tools.linkPr] : []),
     ]
   }
 
```

#### packages/opencode/test/kilocode/tool/link-pr.test.ts
```diff
diff --git a/packages/opencode/test/kilocode/tool/link-pr.test.ts b/packages/opencode/test/kilocode/tool/link-pr.test.ts
index 5fc4f5ce1..6f54e4196 100644
--- a/packages/opencode/test/kilocode/tool/link-pr.test.ts
+++ b/packages/opencode/test/kilocode/tool/link-pr.test.ts
@@ -1,4 +1,4 @@
-import { afterAll, beforeEach, describe, expect, mock, test } from "bun:test"
+import { afterAll, afterEach, beforeEach, describe, expect, mock, spyOn, test } from "bun:test"
 import { Effect, Layer, Schema } from "effect"
 import fs from "node:fs/promises"
 import os from "node:os"
@@ -10,26 +10,26 @@ import { MessageID, SessionID } from "@/session/schema"
 import * as Truncate from "@/tool/truncate"
 import type { Tool } from "@/tool/tool"
 import type { InstanceContext } from "@/project/instance-context"
+import type { SessionPrLink } from "@/kilo-sessions/pr-link"
 
-// Replace the override writer before the tool module loads, keeping the real
-// `parsePrUrl` so the tool still parses the URL for real.
+// Replace the session-link recorder before the tool module loads, keeping the
+// real `parsePrUrl` so the tool still parses the URL for real.
 const realPrLink = await import("@/kilo-sessions/pr-link")
 
-const writes: { worktree: string; link: unknown }[] = []
+const writes: { sessionId: string; record: unknown; worktree: string }[] = []
 let writeError: unknown
+let refuseWrite = false
 
-const writeOverride = mock(async (worktree: string, link: unknown) => {
+const recordSessionLink = mock(async (sessionId: string, record: SessionPrLink, worktree: string) => {
   if (writeError) throw writeError
-  writes.push({ worktree, link })
+  if (refuseWrite) return undefined
+  writes.push({ sessionId, record, worktree })
+  return record
 })
 
-void mock.module("@/kilo-sessions/pr-link", () => ({
-  ...realPrLink,
-  writePrLinkOverride: writeOverride,
-}))
+const recorder = spyOn(realPrLink, "recordSessionLink").mockImplementation(recordSessionLink)
 
 const { LinkPrTool } = await import("@/kilocode/tool/link-pr")
-const { KiloToolRegistry } = await import("@/kilocode/tool/registry")
 
 const agentInfo = {
   name: "code",
@@ -69,6 +69,7 @@ const worktree = "/tmp/link-pr-worktree"
 const created: string[] = []
 
```


## opencode Changes (7945de2..2fa3363)

### Commits

- 2fa3363 - docs(web): correct GPT 6.1 Sol cache pricing (#52176) (Daniel Chen, 2026-09-29)
- f66b86c - fix(ci): sign macOS CLI with Developer ID (Dax Raad, 2026-09-29)

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
- `.github/workflows/publish.yml` (+91, -0)
- `packages/opencode/script/entitlements.plist` (+16, -0)
- `packages/web/src/content/docs/ar/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/bs/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/da/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/de/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/es/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/fr/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/it/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/ja/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/ko/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/nb/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/pl/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/ru/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/th/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/tr/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+3, -0)

### Key Diffs

(no key diffs to show)

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/tool/link-pr.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/link-pr.test.ts changes
- `src/tool/link-pr.ts` - update based on kilocode packages/opencode/src/kilocode/tool/link-pr.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/kilocode/tool/registry.ts changes
