# Upstream Changes Report
Generated: 2026-07-06 10:23:37

## Summary
- kilocode: 0 commits, 0 files changed
- opencode: 17 commits, 75 files changed

## kilocode Changes (1fc8f066f..1fc8f066f)

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

## opencode Changes (b7e4f1e..b0e41ff)

### Commits

- b0e41ff - fix(app): use selected home project for new sessions (#35530) (Brendan Allan, 2026-07-06)
- 977a40a - chore: generate (opencode-agent[bot], 2026-07-06)
- dffecb6 - fix(desktop): gate first launch onboarding (#34930) (Brendan Allan, 2026-07-06)
- 7f57d2a - feat(app): show draft server status in titlebar (#35521) (Brendan Allan, 2026-07-06)
- 377d5d2 - fix(app): avoid shortcut settings flash (#35349) (opencode-agent[bot], 2026-07-06)
- 38bb38e - refactor(app): unify provider connect dialog (#35518) (Brendan Allan, 2026-07-06)
- 3a149ba - fix(app): optimize large review panes (#35375) (Luke Parker, 2026-07-06)
- 14df88e - fix(app): preserve provider dialog backdrop (#35370) (opencode-agent[bot], 2026-07-06)
- e12cb7f - chore: generate (opencode-agent[bot], 2026-07-06)
- d4f7039 - fix(codemode): unify catalog signatures (#35452) (Aiden Cline, 2026-07-06)
- e0ec9be - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-06)
- 2b34df9 - fix(mcp): preserve metadata across tool pages (#35439) (Aiden Cline, 2026-07-05)
- 68f225a - fix(provider): preserve OpenRouter small model effort (#35478) (opencode-agent[bot], 2026-07-05)
- e9f5d34 - fix(tui): shorten home tips (#31966) (David Hill, 2026-07-05)
- d3459eb - test(mcp): replace module mocks with real servers (#35450) (Aiden Cline, 2026-07-05)
- be73f46 - refactor(codemode): namespace public types (#35425) (Aiden Cline, 2026-07-05)
- f14eafe - refactor(codemode): remove generic agent tool (#35417) (Aiden Cline, 2026-07-05)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/code-mode.ts` (+7, -21)
- `packages/opencode/test/tool/code-mode-integration.test.ts` (+4, -2)
- `packages/opencode/test/tool/code-mode.test.ts` (+30, -14)
- `packages/opencode/test/tool/registry.test.ts` (+1, -1)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
(no changes)

#### Other Changes
- `nix/hashes.json` (+4, -4)
- `packages/app/e2e/performance/timeline/review-pane-scaling-benchmark.spec.ts` (+312, -0)
- `packages/app/e2e/regression/review-tab-switch.spec.ts` (+29, -11)
- `packages/app/e2e/regression/review-terminal-stacked.spec.ts` (+212, -0)
- `packages/app/src/app.tsx` (+53, -34)
- `packages/app/src/components/dialog-connect-provider.tsx` (+214, -87)
- `packages/app/src/components/dialog-custom-provider.tsx` (+165, -166)
- `packages/app/src/components/dialog-manage-models.tsx` (+3, -3)
- `packages/app/src/components/dialog-select-model-unpaid.tsx` (+6, -7)
- `packages/app/src/components/dialog-select-model.tsx` (+4, -4)
- `packages/app/src/components/dialog-select-provider.tsx` (+0, -87)
- `packages/app/src/components/dialog-settings.tsx` (+17, -4)
- `packages/app/src/components/file-tree-v2-model.test.ts` (+46, -0)
- `packages/app/src/components/file-tree-v2-model.ts` (+77, -0)
- `packages/app/src/components/file-tree-v2.tsx` (+144, -297)
- `packages/app/src/components/session/session-header.tsx` (+2, -2)
- `packages/app/src/components/settings-keybinds.tsx` (+4, -10)
- `packages/app/src/components/settings-providers.tsx` (+13, -17)
- `packages/app/src/components/settings-v2/dialog-settings-v2.tsx` (+17, -3)
- `packages/app/src/components/settings-v2/providers.tsx` (+11, -19)
- `packages/app/src/components/titlebar.tsx` (+22, -1)
- `packages/app/src/components/virtual-scroll-element.test.ts` (+18, -0)
- `packages/app/src/components/virtual-scroll-element.ts` (+4, -0)
- `packages/app/src/context/server.tsx` (+4, -1)
- `packages/app/src/index.ts` (+6, -0)
- `packages/app/src/pages/layout.tsx` (+2, -2)
- `packages/app/src/pages/new-session.tsx` (+26, -6)
- `packages/app/src/pages/session.tsx` (+15, -3)
- `packages/app/src/pages/session/session-side-panel.tsx` (+30, -7)
- `packages/app/src/pages/session/usage-exceeded-dialogs.tsx` (+5, -3)
- `packages/app/src/pages/session/v2/review-diff-kinds.test.ts` (+7, -0)
- `packages/app/src/pages/session/v2/review-diff-kinds.ts` (+2, -1)
- `packages/app/src/pages/session/v2/review-panel-v2.tsx` (+0, -1)
- `packages/app/src/pages/session/v2/session-file-list-v2.tsx` (+93, -46)
- `packages/app/test-browser/solid-virtual.test.ts` (+15, -0)
- `packages/codemode/README.md` (+34, -29)
- `packages/codemode/codemode.md` (+63, -55)
- `packages/codemode/src/codemode.ts` (+63, -115)
- `packages/codemode/src/index.ts` (+3, -21)
- `packages/codemode/src/tool-api.ts` (+2, -0)
- `packages/codemode/src/tool-runtime.ts` (+137, -180)
- `packages/codemode/src/tool.ts` (+2, -2)
- `packages/codemode/test/codemode.test.ts` (+144, -93)
- `packages/codemode/test/enumeration.test.ts` (+4, -4)
- `packages/codemode/test/parity.test.ts` (+1, -1)
- `packages/codemode/test/promise.test.ts` (+7, -4)
- `packages/codemode/test/signature.test.ts` (+44, -38)
- `packages/desktop/src/main/index.ts` (+3, -0)
- `packages/desktop/src/main/ipc.ts` (+6, -0)
- `packages/desktop/src/main/onboarding.ts` (+28, -0)
- `packages/desktop/src/main/store-keys.ts` (+1, -0)
- `packages/desktop/src/preload/index.ts` (+3, -0)
- `packages/desktop/src/preload/types.ts` (+2, -0)
- `packages/desktop/src/renderer/index.tsx` (+14, -2)
- `packages/desktop/src/renderer/onboarding.tsx` (+79, -0)
- `packages/opencode/src/mcp/browser.ts` (+37, -0)
- `packages/opencode/src/mcp/index.ts` (+4, -18)
- `packages/opencode/src/provider/transform.ts` (+0, -3)
- `packages/opencode/test/fixture/mcp-lifecycle-stdio.ts` (+26, -0)
- `packages/opencode/test/mcp/catalog.test.ts` (+61, -1)
- `packages/opencode/test/mcp/headers.test.ts` (+69, -94)
- `packages/opencode/test/mcp/lifecycle.test.ts` (+501, -1245)
- `packages/opencode/test/mcp/oauth-auto-connect.test.ts` (+242, -309)
- `packages/opencode/test/mcp/oauth-browser.test.ts` (+192, -210)
- `packages/opencode/test/provider/transform.test.ts` (+3, -3)
- `packages/session-ui/src/v2/components/session-review-file-preview-v2-virtualize.test.ts` (+13, -0)
- `packages/session-ui/src/v2/components/session-review-file-preview-v2-virtualize.ts` (+5, -0)
- `packages/session-ui/src/v2/components/session-review-file-preview-v2.tsx` (+5, -0)
- `packages/session-ui/src/v2/components/session-review-v2.tsx` (+47, -38)
- `packages/tui/src/feature-plugins/home/tips-view.tsx` (+17, -17)
- `patches/@modelcontextprotocol%2Fsdk@1.29.0.patch` (+50, -0)

### Key Diffs

#### packages/opencode/src/tool/code-mode.ts
```diff
diff --git a/packages/opencode/src/tool/code-mode.ts b/packages/opencode/src/tool/code-mode.ts
index a97dee9..332d4b4 100644
--- a/packages/opencode/src/tool/code-mode.ts
+++ b/packages/opencode/src/tool/code-mode.ts
@@ -1,14 +1,7 @@
 import * as Tool from "./tool"
 import { CallToolResultSchema, type CallToolResult } from "@modelcontextprotocol/sdk/types.js"
 import { Cause, Effect, Schema } from "effect"
-import {
-  CodeMode,
-  Tool as SandboxTool,
-  toolError,
-  type ExecuteResult,
-  type JsonSchema,
-  type ToolDefinition,
-} from "@opencode-ai/codemode"
+import { CodeMode, Tool as SandboxTool, toolError } from "@opencode-ai/codemode"
 import { MCP } from "@/mcp"
 import { McpCatalog } from "@/mcp/catalog"
 import { Agent } from "@/agent/agent"
@@ -18,18 +11,11 @@ import { Plugin } from "@/plugin"
 
 export const CODE_MODE_TOOL = "execute"
 
-const DESCRIPTION = [
-  "Execute a JavaScript/TypeScript program that orchestrates the connected MCP tools inside a confined runtime.",
-  "The full usage guide and the catalog of available tools follow below.",
-].join("\n")
+const DESCRIPTION = "Run a confined orchestration script with access to connected MCP tools."
 
 export const Parameters = Schema.Struct({
   code: Schema.String.annotate({
-    description: [
-      "JavaScript source to execute.",
-      "Inside CodeMode, `tools` contains only the MCP/CodeMode tools listed in this execute tool's description; top-level opencode tools like bash, read, or lsp are not available unless listed there.",
-      "Call available tools using the exact signatures shown in this execute tool's description, compose the results, and `return` the final value.",
-    ].join(" "),
+    description: "Script body executed by the confined interpreter.",
   }),
 })
 
@@ -132,13 +118,13 @@ function projectMcpResult(result: CallToolResult, collect: (attachment: Attachme
 type Run = (input: unknown) => Effect.Effect<unknown, unknown>
 
 function toolTree(catalog: readonly CatalogEntry[], run: (entry: CatalogEntry) => Run) {
-  const tree: Record<string, Record<string, ToolDefinition>> = {}
+  const tree: Record<string, Record<string, SandboxTool.Definition>> = {}
   for (const entry of catalog) {
     const namespace = (tree[entry.server] ??= {})
     namespace[entry.local] = SandboxTool.make({
```

#### packages/opencode/test/tool/code-mode-integration.test.ts
```diff
diff --git a/packages/opencode/test/tool/code-mode-integration.test.ts b/packages/opencode/test/tool/code-mode-integration.test.ts
index f36b6c8..671acd8 100644
--- a/packages/opencode/test/tool/code-mode-integration.test.ts
+++ b/packages/opencode/test/tool/code-mode-integration.test.ts
@@ -177,8 +177,10 @@ describe("code mode integration (real MCP server)", () => {
   test("the appended catalog inlines full signatures with real MCP schemas", () => {
     expect(description).toContain("Available tools (COMPLETE list")
     expect(description).toContain("- fixtures (4 tools)")
-    expect(description).toContain("tools.fixtures.add(input: { a: number; b: number }): Promise<{ sum: number }>")
-    expect(description).toContain("tools.fixtures.get_text(input: { name: string }): Promise<unknown>")
+    expect(description).toContain(
+      "tools.fixtures.add(input: {\n  a: number,\n  b: number,\n}): Promise<{\n  sum: number,\n}>",
+    )
+    expect(description).toContain("tools.fixtures.get_text(input: {\n  name: string,\n}): Promise<unknown>")
     expect(description).toContain("// Add two numbers and return the structured sum")
     expect(description).not.toContain("$codemode")
     expect(description).toContain("## Workflow")
```

#### packages/opencode/test/tool/code-mode.test.ts
```diff
diff --git a/packages/opencode/test/tool/code-mode.test.ts b/packages/opencode/test/tool/code-mode.test.ts
index a220f14..34b3faa 100644
--- a/packages/opencode/test/tool/code-mode.test.ts
+++ b/packages/opencode/test/tool/code-mode.test.ts
@@ -98,6 +98,13 @@ describe("code mode execute", () => {
     const decode = Schema.decodeUnknownEffect(Parameters)
     await expect(Effect.runPromise(decode({ code: "return 1" }))).resolves.toEqual({ code: "return 1" })
     await expect(Effect.runPromise(decode({}))).rejects.toThrow()
+    expect(Schema.toJsonSchemaDocument(Parameters).schema).toMatchObject({
+      properties: {
+        code: {
+          description: "Script body executed by the confined interpreter.",
+        },
+      },
+    })
   })
 
   test("groups multi-underscore server names by longest matching prefix", () => {
@@ -124,13 +131,15 @@ describe("code mode execute", () => {
       },
       ["weather"],
     )
-    expect(description).toContain("tools.weather.current(input: { city: string }): Promise<{ tempC: number }>")
+    expect(description).toContain(
+      "tools.weather.current(input: {\n  city: string,\n}): Promise<{\n  tempC: number,\n}>",
+    )
   })
 
   test("the static base description carries no catalog; the registry appends it", async () => {
     const tool = await build({ github_list_issues: mcpTool("list_issues", () => "") })
     expect(tool.id).toBe(CODE_MODE_TOOL)
-    expect(tool.description).toContain("confined runtime")
+    expect(tool.description).toBe("Run a confined orchestration script with access to connected MCP tools.")
     expect(tool.description).not.toContain("Available tools")
     expect(tool.description).not.toContain("list_issues")
   })
@@ -150,7 +159,7 @@ describe("code mode execute", () => {
     expect(description).toContain("- github (2 tools)")
     expect(description).toContain("- linear (1 tool)")
     expect(description).toContain(
-      "tools.github.create_issue(input: { title: string; body?: string }): Promise<unknown>",
+      "tools.github.create_issue(input: {\n  title: string,\n  body?: string,\n}): Promise<unknown>",
     )
     expect(description).toContain("tools.github.list_issues(")
     expect(description).toContain("tools.linear.search(")
@@ -159,9 +168,8 @@ describe("code mode execute", () => {
     expect(description).not.toContain("Browse one namespace")
     expect(description).toContain("## Workflow")
     expect(description).toContain("1. Pick a tool from the list under `## Available tools`")
-    expect(description).toContain(
```

#### packages/opencode/test/tool/registry.test.ts
```diff
diff --git a/packages/opencode/test/tool/registry.test.ts b/packages/opencode/test/tool/registry.test.ts
index f3ccd59..c8c5fac 100644
--- a/packages/opencode/test/tool/registry.test.ts
+++ b/packages/opencode/test/tool/registry.test.ts
@@ -132,7 +132,7 @@ describe("tool.registry", () => {
 
       expect(ids).toContain("execute")
       expect(tools.map((tool) => tool.id)).toContain("execute")
-      expect(execute?.description).toContain("tools.weather.current(input: { city: string })")
+      expect(execute?.description).toContain("tools.weather.current(input: {\n  city: string,\n})")
     }),
   )
 
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/tool/code-mode-integration.test.ts` - update based on opencode packages/opencode/test/tool/code-mode-integration.test.ts changes
- `src/tool/code-mode.test.ts` - update based on opencode packages/opencode/test/tool/code-mode.test.ts changes
- `src/tool/code-mode.ts` - update based on opencode packages/opencode/src/tool/code-mode.ts changes
- `src/tool/registry.test.ts` - update based on opencode packages/opencode/test/tool/registry.test.ts changes
