# Upstream Changes Report
Generated: 2026-06-08 10:57:46

## Summary
- kilocode: 0 commits, 0 files changed
- opencode: 17 commits, 74 files changed

## kilocode Changes (1181567b2..1181567b2)

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

## opencode Changes (e82542b..0050134)

### Commits

- 0050134 - fix(session): merge per-call tool rules into session permission (#30529) (Tommy D. Rossi, 2026-06-08)
- d46af9c - chore: generate (opencode-agent[bot], 2026-06-08)
- bea56fe - fix(lsp): resolve JDTLS root to topmost pom.xml in Java Maven multi-module projects (#28761) (huangli, 2026-06-08)
- 685a894 - fix(opencode): include acp pending tool input (#31321) (Shoubhit Dash, 2026-06-08)
- 79ea379 - zen: fix (Frank, 2026-06-08)
- 4863aed - console: update email (Frank, 2026-06-08)
- b5cb9aa - fix(opencode): respect MCP server capabilities (#31271) (Aiden Cline, 2026-06-07)
- 4d09a71 - chore: generate (opencode-agent[bot], 2026-06-08)
- 65a3f7f - fix(desktop): few WSL bugs (#31095) (Filip, 2026-06-08)
- b1d14ac - chore: update web and desktop code owners (#31289) (Luke Parker, 2026-06-08)
- 3867fa2 - chore: generate (opencode-agent[bot], 2026-06-07)
- 07808be - run: make minimal mode more minimal (#31227) (Simon Klee, 2026-06-07)
- 914a643 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-07)
- c495635 - chore: generate (opencode-agent[bot], 2026-06-07)
- 8ff4013 - chore(opencode): update MCP SDK to 1.29.0 (#31268) (Aiden Cline, 2026-06-07)
- aacdb34 - fix(opencode): avoid duplicate skill catalog (#31269) (Aiden Cline, 2026-06-07)
- 233427f - test(core): cover skill directory output (#31263) (Aiden Cline, 2026-06-07)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/registry.ts` (+1, -25)
- `packages/opencode/test/tool/skill.test.ts` (+3, -0)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/test/tool-skill.test.ts` (+4, -0)

#### Other Changes
- `.github/CODEOWNERS` (+2, -4)
- `bun.lock` (+4, -2)
- `nix/hashes.json` (+4, -4)
- `packages/app/src/components/dialog-select-server.tsx` (+10, -5)
- `packages/app/src/wsl/dialog-add-server.tsx` (+11, -11)
- `packages/app/src/wsl/settings.tsx` (+1, -5)
- `packages/console/app/src/routes/legal/privacy-policy/index.tsx` (+20, -20)
- `packages/console/app/src/routes/legal/terms-of-service/index.tsx` (+3, -3)
- `packages/console/app/src/routes/stripe/webhook.ts` (+1, -1)
- `packages/console/app/src/routes/workspace/[id]/billing/billing-section.tsx` (+1, -1)
- `packages/desktop/src/main/constants.ts` (+0, -4)
- `packages/desktop/src/main/index.ts` (+7, -3)
- `packages/desktop/src/main/server.ts` (+3, -2)
- `packages/desktop/src/main/shell-env.ts` (+4, -3)
- `packages/desktop/src/main/store-keys.ts` (+4, -0)
- `packages/desktop/src/main/store.ts` (+3, -3)
- `packages/desktop/src/main/windows.ts` (+1, -1)
- `packages/desktop/src/main/wsl/ipc.ts` (+43, -0)
- `packages/desktop/src/main/wsl/servers.test.ts` (+74, -0)
- `packages/desktop/src/main/wsl/servers.ts` (+72, -13)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/acp/event.ts` (+1, -0)
- `packages/opencode/src/acp/tool.ts` (+8, -4)
- `packages/opencode/src/cli/cmd/run/demo.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/run/entry.body.ts` (+11, -0)
- `packages/opencode/src/cli/cmd/run/footer.command.tsx` (+298, -112)
- `packages/opencode/src/cli/cmd/run/footer.menu.tsx` (+84, -37)
- `packages/opencode/src/cli/cmd/run/footer.permission.tsx` (+9, -2)
- `packages/opencode/src/cli/cmd/run/footer.prompt.tsx` (+134, -29)
- `packages/opencode/src/cli/cmd/run/footer.question.tsx` (+2, -1)
- `packages/opencode/src/cli/cmd/run/footer.subagent.tsx` (+8, -0)
- `packages/opencode/src/cli/cmd/run/footer.ts` (+104, -43)
- `packages/opencode/src/cli/cmd/run/footer.view.tsx` (+473, -423)
- `packages/opencode/src/cli/cmd/run/footer.width.ts` (+27, -0)
- `packages/opencode/src/cli/cmd/run/prompt.editor.ts` (+157, -0)
- `packages/opencode/src/cli/cmd/run/prompt.shared.ts` (+7, -1)
- `packages/opencode/src/cli/cmd/run/runtime.lifecycle.ts` (+72, -11)
- `packages/opencode/src/cli/cmd/run/runtime.queue.ts` (+12, -10)
- `packages/opencode/src/cli/cmd/run/runtime.ts` (+49, -26)
- `packages/opencode/src/cli/cmd/run/scrollback.surface.ts` (+14, -1)
- `packages/opencode/src/cli/cmd/run/scrollback.writer.tsx` (+19, -1)
- `packages/opencode/src/cli/cmd/run/session-replay.ts` (+78, -5)
- `packages/opencode/src/cli/cmd/run/splash.ts` (+22, -48)
- `packages/opencode/src/cli/cmd/run/stream.transport.ts` (+6, -9)
- `packages/opencode/src/cli/cmd/run/subagent-data.ts` (+77, -45)
- `packages/opencode/src/cli/cmd/run/theme.ts` (+137, -50)
- `packages/opencode/src/cli/cmd/run/turn-summary.ts` (+47, -0)
- `packages/opencode/src/cli/cmd/run/types.ts` (+9, -1)
- `packages/opencode/src/lsp/server.ts` (+69, -17)
- `packages/opencode/src/mcp/index.ts` (+19, -5)
- `packages/opencode/src/session/prompt.ts` (+5, -2)
- `packages/opencode/src/util/process.ts` (+2, -1)
- `packages/opencode/test/acp/event.test.ts` (+32, -0)
- `packages/opencode/test/cli/run/footer.view.test.tsx` (+442, -34)
- `packages/opencode/test/cli/run/footer.width.test.ts` (+35, -0)
- `packages/opencode/test/cli/run/prompt.editor.test.ts` (+101, -0)
- `packages/opencode/test/cli/run/runtime.queue.test.ts` (+16, -0)
- `packages/opencode/test/cli/run/runtime.test.ts` (+238, -0)
- `packages/opencode/test/cli/run/scrollback.surface.test.ts` (+17, -0)
- `packages/opencode/test/cli/run/session-replay.test.ts` (+248, -12)
- `packages/opencode/test/cli/run/stream.transport.test.ts` (+2, -2)
- `packages/opencode/test/cli/run/subagent-data.test.ts` (+98, -7)
- `packages/opencode/test/cli/run/theme.test.ts` (+25, -0)
- `packages/opencode/test/lsp/jdtls-root.test.ts` (+459, -0)
- `packages/opencode/test/mcp/lifecycle.test.ts` (+90, -0)
- `packages/opencode/test/mcp/oauth-auto-connect.test.ts` (+38, -0)
- `packages/opencode/test/mcp/oauth-browser.test.ts` (+4, -0)
- `packages/opencode/test/session/prompt.test.ts` (+27, -0)
- `packages/tui/src/component/prompt/index.tsx` (+6, -5)
- `packages/tui/src/editor.ts` (+19, -2)
- `packages/tui/test/editor.test.ts` (+10, -1)

### Key Diffs

#### packages/core/test/tool-skill.test.ts
```diff
diff --git a/packages/core/test/tool-skill.test.ts b/packages/core/test/tool-skill.test.ts
index 76f3e4d..8c08454 100644
--- a/packages/core/test/tool-skill.test.ts
+++ b/packages/core/test/tool-skill.test.ts
@@ -1,5 +1,6 @@
 import fs from "fs/promises"
 import path from "path"
+import { pathToFileURL } from "url"
 import { describe, expect } from "bun:test"
 import { Effect, Layer } from "effect"
 import { FSUtil } from "@opencode-ai/core/fs-util"
@@ -100,6 +101,9 @@ describe("SkillTool", () => {
               type: "text",
               value: SkillTool.toModelOutput(info, [reference]),
             })
+            expect(SkillTool.toModelOutput(info, [reference])).toContain(
+              `Base directory for this skill: ${pathToFileURL(directory).href}`,
+            )
             expect(
               yield* settleTool(registry, {
                 sessionID,
```

#### packages/opencode/src/tool/registry.ts
```diff
diff --git a/packages/opencode/src/tool/registry.ts b/packages/opencode/src/tool/registry.ts
index 2e90c9b..f2ab972 100644
--- a/packages/opencode/src/tool/registry.ts
+++ b/packages/opencode/src/tool/registry.ts
@@ -112,7 +112,6 @@ export const layer: Layer.Layer<
     const config = yield* Config.Service
     const plugin = yield* Plugin.Service
     const agents = yield* Agent.Service
-    const skill = yield* Skill.Service
     const truncate = yield* Truncate.Service
     const flags = yield* RuntimeFlags.Service
 
@@ -276,25 +275,6 @@ export const layer: Layer.Layer<
       return (yield* all()).map((tool) => tool.id)
     })
 
-    const describeSkill = Effect.fn("ToolRegistry.describeSkill")(function* (agent: Agent.Info) {
-      const list = yield* skill.available(agent)
-      if (list.length === 0) return "No skills are currently available."
-      return [
-        "Load a specialized skill that provides domain-specific instructions and workflows.",
-        "",
-        "When you recognize that a task matches one of the available skills listed below, use this tool to load the full skill instructions.",
-        "",
-        "The skill will inject detailed instructions, workflows, and access to bundled resources (scripts, references, templates) into the conversation context.",
-        "",
-        'Tool output includes a `<skill_content name="...">` block with the loaded content.',
-        "",
-        "The following skills provide specialized sets of instructions for particular tasks",
-        "Invoke this tool to load a skill when a task matches one of the available skills listed below:",
-        "",
-        Skill.fmt(list, { verbose: false }),
-      ].join("\n")
-    })
-
     const describeTask = Effect.fn("ToolRegistry.describeTask")(function* (agent: Agent.Info) {
       const items = (yield* agents.list()).filter((item) => item.mode !== "primary")
       const filtered = items.filter(
@@ -340,11 +320,7 @@ export const layer: Layer.Layer<
               : undefined
           return {
             id: tool.id,
-            description: [
-              output.description,
-              tool.id === TaskTool.id ? yield* describeTask(input.agent) : undefined,
-              tool.id === SkillTool.id ? yield* describeSkill(input.agent) : undefined,
-            ]
+            description: [output.description, tool.id === TaskTool.id ? yield* describeTask(input.agent) : undefined]
               .filter(Boolean)
               .join("\n"),
```

#### packages/opencode/test/tool/skill.test.ts
```diff
diff --git a/packages/opencode/test/tool/skill.test.ts b/packages/opencode/test/tool/skill.test.ts
index c0455cc..fe87479 100644
--- a/packages/opencode/test/tool/skill.test.ts
+++ b/packages/opencode/test/tool/skill.test.ts
@@ -68,6 +68,9 @@ Use this skill.
       })).find((tool) => tool.id === SkillTool.id)
       if (!tool) throw new Error("Skill tool not found")
 
+      expect(tool.description).not.toContain("tool-skill")
+      expect(tool.description).not.toContain("Skill for tool tests.")
+
       const requests: Array<Omit<PermissionV1.Request, "id" | "sessionID" | "tool">> = []
       const ctx: Tool.Context = {
         ...baseCtx,
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/tool/registry.ts` - update based on opencode packages/opencode/src/tool/registry.ts changes
- `src/tool/skill.test.ts` - update based on opencode packages/opencode/test/tool/skill.test.ts changes
