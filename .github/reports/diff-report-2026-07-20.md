# Upstream Changes Report
Generated: 2026-07-20 09:14:43

## Summary
- kilocode: 6 commits, 24 files changed
- opencode: 15 commits, 21 files changed

## kilocode Changes (938919ab7..084bceada)

### Commits

- 084bceada - fix(cli): repair cloud session imports (#12329) (Evgeny Shurakov, 2026-07-20)
- 1ed3d9b7d - Merge pull request #12397 from Kilo-Org/fix/actionable-zig-build-error (Marius, 2026-07-20)
- 29149b23a - fix(cli): explain missing Zig build dependency (marius-kilocode, 2026-07-20)
- 79fe75745 - fix(vscode): render heredoc approvals as plain text (#12304) (Marius, 2026-07-20)
- 1687d42c4 - Merge pull request #12395 from Kilo-Org/fix/skip-powershell-native-build (Marius, 2026-07-20)
- 5fed729ae - fix: skip unused PowerShell native build (marius-kilocode, 2026-07-20)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/shell-heredoc.ts` (+7, -0)
- `packages/opencode/src/tool/shell.ts` (+6, -2)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
(no changes)

#### Other Changes
- `.changeset/calm-heredocs-explain.md` (+6, -0)
- `.changeset/cloud-session-import.md` (+6, -0)
- `bun.lock` (+0, -1)
- `package.json` (+0, -1)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-heredoc-chromium-linux.png` (+2, -2)
- `packages/kilo-gateway/src/cloud-sessions.ts` (+261, -75)
- `packages/kilo-gateway/src/index.ts` (+7, -1)
- `packages/kilo-gateway/src/server/routes.ts` (+7, -1)
- `packages/kilo-gateway/test/cloud-sessions.test.ts` (+242, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/PermissionCommand.tsx` (+3, -2)
- `packages/kilo-vscode/webview-ui/src/components/chat/PermissionDock.tsx` (+3, -1)
- `packages/kilo-vscode/webview-ui/src/stories/composite.stories.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/permissions.ts` (+1, -0)
- `packages/opencode/script/kilocode/bubblewrap.ts` (+6, -1)
- `packages/opencode/src/kilocode/server/httpapi/groups/kilo-gateway.ts` (+6, -1)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilo-gateway.ts` (+122, -62)
- `packages/opencode/test/kilocode/bash-permission-metadata.test.ts` (+38, -0)
- `packages/opencode/test/kilocode/server/cloud-session-import.test.ts` (+273, -0)
- `packages/opencode/test/kilocode/server/kilo-gateway-statuses.test.ts` (+9, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+8, -0)
- `packages/sdk/openapi.json` (+20, -0)
- `script/check-opencode-promise-facades.ts` (+1, -0)

### Key Diffs

#### packages/opencode/src/kilocode/tool/shell-heredoc.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/shell-heredoc.ts b/packages/opencode/src/kilocode/tool/shell-heredoc.ts
new file mode 100644
index 000000000..2d623a71f
--- /dev/null
+++ b/packages/opencode/src/kilocode/tool/shell-heredoc.ts
@@ -0,0 +1,7 @@
+import type { ShellID } from "@/tool/shell/id"
+import type { Node } from "web-tree-sitter"
+
+export function heredocs(root: Node, kind: ShellID.Kind) {
+  if (kind !== "bash") return {}
+  return root.descendantsOfType("heredoc_redirect").length > 0 ? { heredoc: true } : {}
+}
```

#### packages/opencode/src/tool/shell.ts
```diff
diff --git a/packages/opencode/src/tool/shell.ts b/packages/opencode/src/tool/shell.ts
index daa14cf64..429a04c7f 100644
--- a/packages/opencode/src/tool/shell.ts
+++ b/packages/opencode/src/tool/shell.ts
@@ -19,6 +19,7 @@ import * as Truncate from "./truncate"
 import { Plugin } from "@/plugin"
 import { normalizeUrls } from "@/kilocode/util/url" // kilocode_change
 import { CommandTimeout } from "@/kilocode/command-timeout" // kilocode_change
+import { heredocs } from "@/kilocode/tool/shell-heredoc" // kilocode_change
 import { ChildProcess } from "effect/unstable/process"
 import { ChildProcessSpawner } from "effect/unstable/process/ChildProcessSpawner"
 import { ShellPrompt, type Parameters } from "./shell/prompt"
@@ -282,6 +283,7 @@ const ask = Effect.fn("ShellTool.ask")(function* (
   ctx: Tool.Context,
   scan: Scan,
   command: string,
+  metadata: ReturnType<typeof heredocs>, // kilocode_change
   description?: string, // kilocode_change
 ) {
   // kilocode_change
@@ -302,6 +304,7 @@ const ask = Effect.fn("ShellTool.ask")(function* (
         directories,
         patterns: globs,
         ...(scan.access === "read" ? { access: "read" as const } : {}),
+        ...metadata,
       },
       // kilocode_change end
     })
@@ -312,7 +315,7 @@ const ask = Effect.fn("ShellTool.ask")(function* (
     permission: ShellID.ToolID,
     patterns: Array.from(scan.patterns),
     always: Array.from(scan.always),
-    metadata: { command: normalizeUrls(command), ...(description ? { description } : {}) }, // kilocode_change
+    metadata: { command: normalizeUrls(command), ...(description ? { description } : {}), ...metadata }, // kilocode_change
   })
 })
 
@@ -411,11 +414,12 @@ export const ShellPermission = Effect.gen(function* () {
       Effect.gen(function* () {
         const tree = yield* Effect.acquireRelease(parse(input.command, ps), (tree) => Effect.sync(() => tree.delete()))
         const scan = yield* collect(tree.rootNode, input.cwd, ps, input.shell, instance)
+        const metadata = heredocs(tree.rootNode, ShellID.toKind(Shell.name(input.shell))) // kilocode_change
         if (!containsPath(input.cwd, instance)) {
           scan.dirs.add(input.cwd)
           scan.access = "unknown"
         }
-        yield* ask(ctx, scan, input.command, input.description)
+        yield* ask(ctx, scan, input.command, metadata, input.description) // kilocode_change
       }),
     )
```


## opencode Changes (f557328..a19b52e)

### Commits

- a19b52e - fix(app): omit empty prompt text parts (#37577) (opencode-agent[bot], 2026-07-20)
- 9105f35 - chore: generate (opencode-agent[bot], 2026-07-20)
- 3ba3954 - feat(app): review panel improvements (#36716) (Aarav Sareen, 2026-07-20)
- 3fc5af6 - feat(app): update settings description line height (#37759) (Aarav Sareen, 2026-07-20)
- 5586f96 - fix(app): restore model variant accessibility (#37857) (opencode-agent[bot], 2026-07-20)
- 3b719ab - chore: generate (opencode-agent[bot], 2026-07-20)
- 20a3a21 - feat(opencode): use adaptive thinking effort for kimi family on anthr… (#37696) (Qiping Li, 2026-07-19)
- cd46f22 - sync (Frank, 2026-07-19)
- cfa134f - Merge branch 'dev' of github.com:anomalyco/opencode into dev (Frank, 2026-07-19)
- 61653a2 - sync (Frank, 2026-07-19)
- 2a097f3 - fix(llm): expand context overflow patterns (#37840) (opencode-agent[bot], 2026-07-19)
- ba4b8e2 - feat(app): toggle debug tools from dev badge (#36689) (David Hill, 2026-07-20)
- 7985c20 - fix(app): show keybind tooltips on prompt input controls (#37824) (Rahul A Mistry, 2026-07-20)
- 67caf89 - fix(opencode): increase OpenAI header timeout (#37770) (opencode-agent[bot], 2026-07-19)
- 78587c1 - fix(app): restore question pager segments (#37575) (opencode-agent[bot], 2026-07-19)

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
- `packages/app/e2e/regression/prompt-thinking-level.spec.ts` (+1, -1)
- `packages/app/src/components/prompt-input-v2.tsx` (+4, -0)
- `packages/app/src/components/prompt-input/build-request-parts.ts` (+9, -7)
- `packages/app/src/components/settings-v2/settings-v2.css` (+4, -3)
- `packages/app/src/components/titlebar.tsx` (+21, -6)
- `packages/app/src/pages/layout-new.tsx` (+11, -2)
- `packages/app/src/pages/layout.tsx` (+10, -2)
- `packages/app/src/pages/session.tsx` (+5, -1)
- `packages/app/src/pages/session/file-tabs.tsx` (+62, -16)
- `packages/app/src/pages/session/session-side-panel.tsx` (+12, -0)
- `packages/app/src/pages/session/v2/session-file-browser-tab.tsx` (+14, -1)
- `packages/llm/src/provider-error.ts` (+11, -1)
- `packages/llm/test/provider-error.test.ts` (+24, -2)
- `packages/opencode/src/provider/provider.ts` (+1, -1)
- `packages/opencode/src/provider/transform.ts` (+30, -7)
- `packages/opencode/test/provider/header-timeout.test.ts` (+1, -1)
- `packages/opencode/test/provider/transform.test.ts` (+112, -1)
- `packages/session-ui/src/components/message-part.css` (+1, -1)
- `packages/session-ui/src/v2/components/prompt-input/index.tsx` (+50, -39)
- `packages/session-ui/src/v2/components/prompt-input/interaction.ts` (+1, -0)
- `packages/session-ui/src/v2/components/session-review-v2.css` (+1, -9)

### Key Diffs

(no key diffs to show)

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/tool/shell-heredoc.ts` - update based on kilocode packages/opencode/src/kilocode/tool/shell-heredoc.ts changes
- `src/tool/shell.ts` - update based on kilocode packages/opencode/src/tool/shell.ts changes
