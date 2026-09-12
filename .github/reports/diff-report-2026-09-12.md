# Upstream Changes Report
Generated: 2026-09-12 10:13:38

## Summary
- kilocode: 23 commits, 49 files changed
- opencode: 3 commits, 10 files changed

## kilocode Changes (4304a8691..c36e22634)

### Commits

- c36e22634 - Merge pull request #14057 from Kilo-Org/docs/cleanup-banners-and-show-and-tell (Emilie Lima Schario, 2026-09-11)
- 5bce9f4b4 - Merge pull request #14045 from Kilo-Org/research-compaction-model-location (Marius, 2026-09-11)
- 146a30373 - Merge pull request #14046 from Kilo-Org/fix-extension-ui-spacing (Marius, 2026-09-11)
- 6e022e47c - Merge branch 'main' into docs/cleanup-banners-and-show-and-tell (Emilie Lima Schario, 2026-09-11)
- 195259d2f - Merge pull request #13192 from maphew/fix/aux-task-small-model-fallback (Andrea Giammarchi, 2026-09-11)
- 478ee013d - docs(kilo-docs): retire stale banners and show-and-tell links (Emilie Schario, 2026-09-11)
- 715061599 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-11)
- d1e807dcd - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-11)
- d88f81292 - Merge commit 'e9390caa914d17968d608935ba5e55621d764254' into fix-extension-ui-spacing (marius-kilocode, 2026-09-11)
- 3b1c7f749 - Merge commit 'e9390caa914d17968d608935ba5e55621d764254' into research-compaction-model-location (marius-kilocode, 2026-09-11)
- e49e7862f - fix(vscode): keep the working indicator snug above the prompt (marius-kilocode, 2026-09-11)
- f64c6646d - feat(vscode): move compaction model setting to Models tab (marius-kilocode, 2026-09-11)
- 38ad122c6 - Merge remote-tracking branch 'upstream/main' into fix/aux-task-small-model-fallback Co-authored-by: kiloconnect[bot] <240665456+kiloconnect[bot]@users.noreply.github.com> (maphew, 2026-09-09)
- 2ad2c21bf - Merge remote-tracking branch 'refs/remotes/upstream/main' into fix/aux-task-small-model-fallback Co-authored-by: kiloconnect[bot] <240665456+kiloconnect[bot]@users.noreply.github.com> (maphew, 2026-09-03)
- be2a88a60 - Merge commit 'bbf6a278' into fix/aux-task-small-model-fallback Co-authored-by: kiloconnect[bot] <240665456+kiloconnect[bot]@users.noreply.github.com> (maphew, 2026-08-31)
- 0f33a6673 - test(cli): skip title generation in exact-call compaction tests (maphew, 2026-08-28)
- f24af80f9 - Merge remote-tracking branch 'upstream/main' into fix/aux-task-small-model-fallback Co-authored-by: kiloconnect[bot] <240665456+kiloconnect[bot]@users.noreply.github.com> (maphew, 2026-08-28)
- 93da68bd6 - chore: merge upstream main into fix/aux-task-small-model-fallback (maphew, 2026-08-27)
- 466ae2a25 - test(cli): relocate kilo small-model fallback tests to kilocode tree (maphew, 2026-08-22)
- 1dc515ff0 - Merge remote-tracking branch 'upstream/main' into fix/aux-task-small-model-fallback Co-authored-by: kiloconnect[bot] <240665456+kiloconnect[bot]@users.noreply.github.com> (maphew, 2026-08-22)
- bcb8275c5 - Merge branch 'main' into fix/aux-task-small-model-fallback (matt wilkie, 2026-08-18)
- 8efab7c34 - Merge branch 'main' into fix/aux-task-small-model-fallback (matt wilkie, 2026-08-18)
- 1e73d3862 - fix(cli): only use kilo-auto/small for auxiliary tasks with kilo credentials (maphew, 2026-08-18)

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
- `.changeset/compaction-model-models-tab.md` (+5, -0)
- `.changeset/quiet-docks-align.md` (+5, -0)
- `.changeset/small-model-fallback-requires-kilo-credentials.md` (+5, -0)
- `packages/kilo-docs/components/PageFooter.tsx` (+26, -0)
- `packages/kilo-docs/components/TopNav.tsx` (+0, -38)
- `packages/kilo-docs/pages/community/index.md` (+1, -3)
- `packages/kilo-docs/pages/contributing/index.md` (+0, -4)
- `packages/kilo-docs/pages/customize/custom-modes.md` (+0, -4)
- `packages/kilo-docs/pages/index.tsx` (+15, -1)
- `packages/kilo-docs/public/globals.css` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-sidebar-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-wide-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/models-accessible-labels-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/models-autocomplete-open-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/models-speech-to-text-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/settings-panel-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/session-dock-stability.spec.ts` (+62, -7)
- `packages/kilo-vscode/webview-ui/src/components/chat/ChatView.tsx` (+2, -4)
- `packages/kilo-vscode/webview-ui/src/components/chat/SessionDock.tsx` (+3, -2)
- `packages/kilo-vscode/webview-ui/src/components/settings/ContextTab.tsx` (+25, -21)
- `packages/kilo-vscode/webview-ui/src/components/settings/ModelsTab.tsx` (+18, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/Settings.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/styles/chat-layout.css` (+20, -13)
- `packages/opencode/src/kilocode/provider/provider.ts` (+18, -0)
- `packages/opencode/src/provider/provider.ts` (+14, -3)
- `packages/opencode/test/kilocode/provider/provider.test.ts` (+84, -0)
- `packages/opencode/test/kilocode/session-prompt-compaction-safety.test.ts` (+9, -3)
- `packages/opencode/test/provider/provider.test.ts` (+0, -24)

### Key Diffs

(no key diffs to show)

## opencode Changes (193de13..95daf90)

### Commits

- 95daf90 - fix(acp): restore session options and reasoning boundaries (#48225) (Jacob Wolf, 2026-09-11)
- 0b934e9 - chore: generate (opencode-agent[bot], 2026-09-11)
- 5de2f24 - feat(console): add batch workspace block endpoints (#48491) (黑墨水鱼, 2026-09-11)

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
- `packages/console/core/src/workspace.ts` (+45, -1)

#### Other Changes
- `packages/console/app/src/routes/api/support/actions/block-workspaces.ts` (+22, -0)
- `packages/console/app/src/routes/api/support/actions/unblock-workspaces.ts` (+22, -0)
- `packages/opencode/src/acp/config-option.ts` (+5, -2)
- `packages/opencode/src/acp/event.ts` (+2, -2)
- `packages/opencode/src/acp/service.ts` (+157, -36)
- `packages/opencode/test/acp/config-option.test.ts` (+11, -0)
- `packages/opencode/test/acp/event.test.ts` (+34, -0)
- `packages/opencode/test/acp/service-session.test.ts` (+285, -5)
- `packages/opencode/test/cli/acp/config-options.test.ts` (+1, -1)

### Key Diffs

#### packages/console/core/src/workspace.ts
```diff
diff --git a/packages/console/core/src/workspace.ts b/packages/console/core/src/workspace.ts
index 432d494..a958e42 100644
--- a/packages/console/core/src/workspace.ts
+++ b/packages/console/core/src/workspace.ts
@@ -8,7 +8,7 @@ import { BillingTable } from "./schema/billing.sql"
 import { WorkspaceTable } from "./schema/workspace.sql"
 import { AccountTable } from "./schema/account.sql"
 import { Key } from "./key"
-import { and, eq, isNull, sql } from "drizzle-orm"
+import { and, eq, inArray, isNull, sql } from "drizzle-orm"
 
 export namespace Workspace {
   export const Region = z.enum(["us", "eu", "sg", "cn"])
@@ -109,6 +109,26 @@ export namespace Workspace {
     },
   )
 
+  export const blockBatch = fn(
+    z.object({
+      workspaceIDs: z.array(Identifier.schema("workspace")).min(1),
+    }),
+    async (input) => {
+      const { applied, notFound } = await setBlockedBatch(input, true)
+      return { blocked: applied, notFound }
+    },
+  )
+
+  export const unblockBatch = fn(
+    z.object({
+      workspaceIDs: z.array(Identifier.schema("workspace")).min(1),
+    }),
+    async (input) => {
+      const { applied, notFound } = await setBlockedBatch(input, false)
+      return { unblocked: applied, notFound }
+    },
+  )
+
   export const remove = fn(z.void(), async () => {
     await Database.use((tx) =>
       tx
@@ -118,3 +138,27 @@ export namespace Workspace {
     )
   })
 }
+
+// No size cap by design; large IN lists degrade on Vitess, so chunks stay fixed-size and
+// sequential to share one connection inside ambient transactions. Existence comes from the
+// follow-up select rather than rowsAffected, so no-op rows (already in the target state)
+// still report as applied instead of "not found".
+const setBlockedBatch = async (input: { workspaceIDs: string[] }, isBlocked: boolean) => {
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- No specific recommendations - review changes manually
