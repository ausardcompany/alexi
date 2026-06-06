# Upstream Changes Report
Generated: 2026-06-06 08:34:13

## Summary
- kilocode: 42 commits, 87 files changed
- opencode: 67 commits, 334 files changed

## kilocode Changes (049d567d1..1181567b2)

### Commits

- 1181567b2 - release: v7.3.40 (kilo-maintainer[bot], 2026-06-06)
- be5f42f15 - fix: support custom plan exit paths (#10952) (Johnny Eric Amancio, 2026-06-06)
- 011477a91 - Merge pull request #10925 from Kilo-Org/improvement/cli-suggest-skills (Catriel Müller, 2026-06-05)
- f018b8ffa - release: v7.3.39 (kilo-maintainer[bot], 2026-06-05)
- 3b1549d20 - Merge pull request #10961 from Kilo-Org/catrielmuller/remove-macos-intel (Catriel Müller, 2026-06-05)
- 17f5619c5 - refactor: flag intel mac (Catriel Müller, 2026-06-05)
- 9a53a602d - Merge pull request #10958 from Kilo-Org/fix/cli-disable-bun-splitting (Catriel Müller, 2026-06-05)
- 8b5fd8970 - refactor(cli): drop morphsdk compat layer and CJS build plugin (Catriel Müller, 2026-06-05)
- 4ca470035 - fix(cli): disable Bun code-splitting to fix baseline startup crash (Catriel Müller, 2026-06-05)
- fae783dc1 - Merge pull request #10957 from Kilo-Org/fix/morphsdk-cjs-resolve-subpath (Catriel Müller, 2026-06-05)
- d7df07a1e - fix(cli): resolve morphsdk client.cjs via exported subpath (Catriel Müller, 2026-06-05)
- 7d241ee6f - Merge pull request #10956 from Kilo-Org/fix/morphsdk-cjs-build-plugin (Catriel Müller, 2026-06-05)
- bd1e3e4a1 - fix(cli): use build plugin to redirect morphsdk ESM barrel to CJS (Catriel Müller, 2026-06-05)
- d9cbaa31e - Merge pull request #10955 from Kilo-Org/fix/cli-release-validation-runtime (Catriel Müller, 2026-06-05)
- f7970c99e - fix(cli): prevent Bun ESM splitter crash and Alpine musl validation (Catriel Müller, 2026-06-05)
- 6ba7c84fc - Merge pull request #10951 from Kilo-Org/fix/vscode-preserve-sidebar-on-reload (Joshua Lambert, 2026-06-05)
- 2e2c07b29 - Merge pull request #10949 from Kilo-Org/alder-xenoposeidon (Catriel Müller, 2026-06-05)
- 452a34d7a - Merge pull request #10917 from Kilo-Org/plastic-munchkin (Kirill Kalishev, 2026-06-05)
- ed4c402fd - Merge pull request #10911 from Kilo-Org/docs/update-nvidia-nemotron-model (Ari Messer, 2026-06-05)
- 2a54288a2 - docs: update NVIDIA Nemotron model ID and description in gateway models list (kiloconnect[bot], 2026-06-05)
- ca5c4d9a9 - test(vscode): remove sidebar reload regression guard (Josh Lambert, 2026-06-05)
- 54534bd64 - fix(vscode): preserve sidebar on window reload (Josh Lambert, 2026-06-05)
- e2e070da2 - Merge pull request #10924 from Kilo-Org/fix/temporarily-disable-session-export (Joshua Lambert, 2026-06-05)
- e02efb5ce - docs(security): reflect Security Agent availability in docs (#10898) (Aarav, 2026-06-05)
- f82847868 - Merge pull request #10933 from Kilo-Org/fix/mcp-json-strict-output (Catriel Müller, 2026-06-05)
- 225b914b5 - perf(chat): reserve layout space for working indicator to prevent content shift (#10950) (Imanol Maiztegui, 2026-06-05)
- 2dd5100ee - fix(vscode): validate local CLI snapshot sidecar (Catriel Müller, 2026-06-05)
- 78117d1a2 - fix: validate CLI models snapshot before release builds (Catriel Müller, 2026-06-05)
- 6a64794a5 - fix(auto-scroll): ignore control interactions when detecting user scroll intent (#10946) (Imanol Maiztegui, 2026-06-05)
- f5b579758 - refactor(chat): use ResizeObserver to maintain scroll position on container resize (#10944) (Imanol Maiztegui, 2026-06-05)
- c992b9284 - fix(cli): annotate command Kilo changes (Evan Jacobson, 2026-06-04)
- 48466850a - Undo extra changeset (Evan Jacobson, 2026-06-04)
- 2099feba9 - fix(cli): disambiguate skill slash commands (Evan Jacobson, 2026-06-04)
- a0eb3b7cb - fix(cli): write strict JSON for MCP config (Catriel Müller, 2026-06-04)
- 881a451f8 - Changeset (Evan Jacobson, 2026-06-04)
- 8094ba6ab - feat(cli): suggest skill slash commands (Evan Jacobson, 2026-06-04)
- 189f25186 - fix(cli): temporarily disable session export (Josh Lambert, 2026-06-04)
- 80be074c9 - fix: ignore stale JetBrains publish runs (kirillk, 2026-06-04)
- 1060fa4e5 - docs(jetbrains): reference release skill (kirillk, 2026-06-04)
- a7a9ccee9 - fix: make JetBrains release merge optional (kirillk, 2026-06-04)
- 41ab86f42 - fix: address JetBrains release skill review (kirillk, 2026-06-04)
- 8ee6caf51 - feat: add JetBrains release skill (kirillk, 2026-06-04)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/plan.ts` (+41, -0)
- `packages/opencode/src/tool/plan-exit.txt` (+1, -1)
- `packages/opencode/src/tool/plan.ts` (+1, -33)
- `packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap` (+6, -1)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/kilocode/agent/index.ts` (+1, -0)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)

#### Other Changes
- `.changeset/calm-icons-fetch.md` (+0, -5)
- `.changeset/user-driven-auto-scroll.md` (+0, -6)
- `.github/workflows/publish.yml` (+182, -61)
- `.kilo/skills/release-jetbrains/SKILL.md` (+133, -0)
- `.kilo/skills/release-jetbrains/script/dispatch-prepare.ts` (+73, -0)
- `.kilo/skills/release-jetbrains/script/resolve-version.ts` (+107, -0)
- `.kilo/skills/release-jetbrains/script/update-changelog.ts` (+78, -0)
- `.kilo/skills/release-jetbrains/script/watch-publish.ts` (+87, -0)
- `bun.lock` (+20, -20)
- `package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/deploy-secure/security-reviews.md` (+1, -1)
- `packages/kilo-docs/pages/gateway/models-and-providers.md` (+1, -1)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/RELEASING.md` (+6, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloBackendCliManager.kt` (+20, -13)
- `packages/kilo-jetbrains/build-tasks/src/main/kotlin/CheckCliTask.kt` (+1, -1)
- `packages/kilo-jetbrains/build-tasks/src/main/kotlin/PrepareLocalCliTask.kt` (+10, -2)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-jetbrains/script/build.ts` (+10, -3)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/hooks/auto-scroll.ts` (+11, -0)
- `packages/kilo-ui/src/hooks/create-auto-scroll.tsx` (+19, -5)
- `packages/kilo-vscode/CHANGELOG.md` (+19, -0)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/script/build.ts` (+6, -0)
- `packages/kilo-vscode/script/local-bin.ts` (+66, -10)
- `packages/kilo-vscode/script/watch-cli.ts` (+12, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+0, -1)
- `packages/kilo-vscode/src/extension.ts` (+1, -7)
- `packages/kilo-vscode/src/kilo-provider/options.ts` (+0, -1)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/ChatView.tsx` (+1, -12)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/components/shared/WorkingIndicator.tsx` (+22, -20)
- `packages/kilo-vscode/webview-ui/src/styles/chat-layout.css` (+6, -0)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/.gitignore` (+1, -2)
- `packages/opencode/CHANGELOG.md` (+20, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/script/build.ts` (+56, -26)
- `packages/opencode/script/generate.ts` (+5, -14)
- `packages/opencode/script/kilocode/models-snapshot.ts` (+74, -0)
- `packages/opencode/src/cli/cmd/mcp.ts` (+2, -1)
- `packages/opencode/src/cli/cmd/run/footer.prompt.tsx` (+5, -4)
- `packages/opencode/src/cli/cmd/tui/component/prompt/autocomplete.tsx` (+6, -4)
- `packages/opencode/src/cli/cmd/tui/component/prompt/index.tsx` (+2, -1)
- `packages/opencode/src/command/index.ts` (+53, -11)
- `packages/opencode/src/kilocode/bootstrap.ts` (+1, -0)
- `packages/opencode/src/kilocode/cli/cmd/command-display.ts` (+14, -0)
- `packages/opencode/src/kilocode/cli/cmd/mcp.ts` (+8, -0)
- `packages/opencode/src/kilocode/plan-file.ts` (+33, -0)
- `packages/opencode/src/kilocode/plan-followup.ts` (+9, -3)
- `packages/opencode/src/kilocode/provider/models-snapshot-shape.ts` (+126, -0)
- `packages/opencode/src/kilocode/provider/models-snapshot.ts` (+32, -0)
- `packages/opencode/src/kilocode/session-export/session-export.ts` (+2, -0)
- `packages/opencode/src/kilocode/session/prompt.ts` (+62, -27)
- `packages/opencode/src/provider/models-snapshot.ts` (+0, -2)
- `packages/opencode/src/provider/models.ts` (+6, -2)
- `packages/opencode/src/session/llm.ts` (+3, -2)
- `packages/opencode/src/session/prompt.ts` (+6, -1)
- `packages/opencode/test/kilocode/agent-permission-overrides.test.ts` (+1, -0)
- `packages/opencode/test/kilocode/cli/cmd/mcp.test.ts` (+37, -0)
- `packages/opencode/test/kilocode/plan-exit-detection.test.ts` (+131, -0)
- `packages/opencode/test/kilocode/plan-file.test.ts` (+68, -0)
- `packages/opencode/test/kilocode/provider/models-snapshot.test.ts` (+129, -0)
- `packages/opencode/test/kilocode/skill-command-autocomplete.test.ts` (+57, -0)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 3def0c590..8b052f80b 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.3.33",
+  "version": "7.3.40",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/opencode/src/kilocode/agent/index.ts
```diff
diff --git a/packages/opencode/src/kilocode/agent/index.ts b/packages/opencode/src/kilocode/agent/index.ts
index 0aaad6456..c6760f965 100644
--- a/packages/opencode/src/kilocode/agent/index.ts
+++ b/packages/opencode/src/kilocode/agent/index.ts
@@ -171,6 +171,7 @@ function planEditRules(worktree: string) {
   return {
     "*": "deny" as const,
     [path.join(".kilo", "plans", "*.md")]: "allow" as const,
+    [path.join(".plans", "*.md")]: "allow" as const,
     [path.join(".opencode", "plans", "*.md")]: "allow" as const,
     [path.relative(worktree, path.join(Global.Path.data, path.join("plans", "*.md")))]: "allow" as const,
   }
```

#### packages/opencode/src/kilocode/tool/plan.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/plan.ts b/packages/opencode/src/kilocode/tool/plan.ts
new file mode 100644
index 000000000..090e7d8f5
--- /dev/null
+++ b/packages/opencode/src/kilocode/tool/plan.ts
@@ -0,0 +1,41 @@
+import { Effect, Schema } from "effect"
+import * as Tool from "@/tool/tool"
+import { InstanceState } from "@/effect/instance-state"
+import { Session } from "@/session/session"
+import { PlanFile } from "@/kilocode/plan-file"
+import EXIT_DESCRIPTION from "@/tool/plan-exit.txt"
+
+export const Parameters = Schema.Struct({
+  path: Schema.optional(
+    Schema.String.annotate({
+      description:
+        "Optional workspace-local path to the finalized plan file. Pass this when you saved the plan somewhere other than the provided plan file path.",
+    }),
+  ),
+})
+
+type Params = Schema.Schema.Type<typeof Parameters>
+
+export const PlanExitTool = Tool.define(
+  "plan_exit",
+  Effect.gen(function* () {
+    const session = yield* Session.Service
+
+    return {
+      description: EXIT_DESCRIPTION,
+      parameters: Parameters,
+      execute: (params: Params, ctx: Tool.Context) =>
+        Effect.gen(function* () {
+          const instance = yield* InstanceState.context
+          const info = yield* session.get(ctx.sessionID)
+          const file = PlanFile.resolve(params.path, instance) ?? Session.plan(info, instance)
+          const plan = PlanFile.display(file, instance)
+          return {
+            title: "Planning complete",
+            output: `Plan is ready at ${plan}. Ending planning turn.`,
+            metadata: { plan },
+          }
+        }).pipe(Effect.orDie),
+    }
+  }),
+)
```

#### packages/opencode/src/tool/plan-exit.txt
```diff
diff --git a/packages/opencode/src/tool/plan-exit.txt b/packages/opencode/src/tool/plan-exit.txt
index f204dde28..6f57896dd 100644
--- a/packages/opencode/src/tool/plan-exit.txt
+++ b/packages/opencode/src/tool/plan-exit.txt
@@ -1,6 +1,6 @@
 Signal that planning is complete and the plan is ready for implementation.
 
-Call this tool once you have finalized the plan file and are confident it is ready. This ends your planning turn and hands control back to the user.
+Call this tool once you have finalized the plan file and are confident it is ready. This ends your planning turn and hands control back to the user. If you saved the plan to a custom workspace-local path, pass that path in the `path` argument.
 
 Call this tool:
 - After you have written a complete plan to the plan file
```

#### packages/opencode/src/tool/plan.ts
```diff
diff --git a/packages/opencode/src/tool/plan.ts b/packages/opencode/src/tool/plan.ts
index 5ea70ef87..e98a68e89 100644
--- a/packages/opencode/src/tool/plan.ts
+++ b/packages/opencode/src/tool/plan.ts
@@ -1,33 +1 @@
-import path from "path"
-import { Effect, Schema } from "effect"
-import * as Tool from "./tool"
-import { Session } from "@/session/session"
-import { InstanceState } from "@/effect/instance-state"
-import EXIT_DESCRIPTION from "./plan-exit.txt"
-
-export const Parameters = Schema.Struct({})
-
-// kilocode_change start - simplified plan_exit: readiness signal only, no user prompt
-export const PlanExitTool = Tool.define(
-  "plan_exit",
-  Effect.gen(function* () {
-    const session = yield* Session.Service
-
-    return {
-      description: EXIT_DESCRIPTION,
-      parameters: Parameters,
-      execute: (_params: {}, ctx: Tool.Context) =>
-        Effect.gen(function* () {
-          const instance = yield* InstanceState.context
-          const info = yield* session.get(ctx.sessionID)
-          const plan = path.relative(instance.worktree, Session.plan(info, instance))
-          return {
-            title: "Planning complete",
-            output: `Plan is ready at ${plan}. Ending planning turn.`,
-            metadata: { plan },
-          }
-        }).pipe(Effect.orDie),
-    }
-  }),
-)
-// kilocode_change end
+export { Parameters, PlanExitTool } from "@/kilocode/tool/plan" // kilocode_change
```


*... and more files (showing first 5)*

## opencode Changes (a468680..1399323)

### Commits

- 1399323 - chore: generate (opencode-agent[bot], 2026-06-06)
- bd7eb06 - feat: desktop v2 everything WSL (#23407) (Luke Parker, 2026-06-06)
- 09d9cf0 - refactor(core): simplify search root protocol (#31060) (Kit Langton, 2026-06-06)
- 4ac4df4 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-06)
- 147169e - refactor(core): simplify filesystem read protocol (#31058) (Kit Langton, 2026-06-06)
- ceccde7 - refactor(core): simplify filesystem mutation protocol (#31059) (Kit Langton, 2026-06-06)
- 54f4974 - feat(http-recorder): prepare public beta release (#31018) (Kit Langton, 2026-06-06)
- ba57718 - feat(opencode): support non-interactive MCP add (#31054) (Aiden Cline, 2026-06-05)
- 3f0ef9b - feat(opencode): add search to auth logout command (#31053) (Aiden Cline, 2026-06-05)
- fa2b63f - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-06)
- 83dca45 - fix(core): make V2 reads media-aware and binary-safe (#31038) (Kit Langton, 2026-06-05)
- f750dea - fix(app): increase project session limit and add scrolling (#31035) (Luke Parker, 2026-06-05)
- b36b859 - fix(stats): filter market share to go (Adam, 2026-06-05)
- 7c6adcf - fix(core): scope v2 prompt cache by session (#31036) (opencode-agent[bot], 2026-06-05)
- 3e704d0 - chore: generate (opencode-agent[bot], 2026-06-05)
- 1fd9c77 - feat(app): sessions list improvements (#30941) (Aarav Sareen, 2026-06-05)
- 9ed17da - chore: generate (opencode-agent[bot], 2026-06-05)
- 24347f3 - feat(app): updates to project avatar (#30964) (Aarav Sareen, 2026-06-05)
- 93a58f5 - chore: generate (opencode-agent[bot], 2026-06-05)
- e3a55db - feat(app): improve servers UI (#30961) (Aarav Sareen, 2026-06-05)
- 015e79f - fix(session): respect directory filter with workspaces (#30804) (mridul, 2026-06-05)
- d5b2056 - fix(tui): inject reminder after moving session (#31027) (James Long, 2026-06-05)
- a645615 - fix(opencode): limit generated project copy names (#31022) (James Long, 2026-06-05)
- 499a8a4 - fix(tui): bootstrap new project copies (#31019) (James Long, 2026-06-05)
- 969bb90 - chore: generate (opencode-agent[bot], 2026-06-05)
- f591bf5 - feat(tui): delete working copies from move dialog (#31017) (James Long, 2026-06-05)
- 025e1ac - fix(core): validate public session model switches (#31012) (Kit Langton, 2026-06-05)
- 820c984 - fix(core): recover v2 context overflow (#31005) (Kit Langton, 2026-06-05)
- c814f84 - fix(tui): update tool spacing before layout (Kit Langton, 2026-06-05)
- a57fb32 - feat(core): expose session model switching (#31011) (Kit Langton, 2026-06-05)
- 05d1104 - fix(core): scope Vertex provider transforms (#31004) (Kit Langton, 2026-06-05)
- 7ebc7ff - chore: generate (opencode-agent[bot], 2026-06-05)
- a9094fd - feat(core): bound v2 tool output (#30999) (Kit Langton, 2026-06-05)
- 760d523 - chore: generate (opencode-agent[bot], 2026-06-05)
- 0bdd9aa - fix(core): preserve model request semantics (#30990) (Kit Langton, 2026-06-05)
- ca9bf7a - fix(opencode): honor Bedrock Mantle config (#31001) (Aiden Cline, 2026-06-05)
- 3bbf8c8 - fix(opencode): terminate help output with newline (#30992) (Aiden Cline, 2026-06-05)
- beae729 - feat(core): compact v2 session context (#30986) (Kit Langton, 2026-06-05)
- a7bd1cd - chore: generate (opencode-agent[bot], 2026-06-05)
- ecdfcd9 - fix(tui): show current location in working copies; order by created; change shortcut; tab to cycle actions in dialog select (#30989) (James Long, 2026-06-05)
- 3151e22 - fix(core): harden model selection edges (#30987) (Kit Langton, 2026-06-05)
- d2204e0 - feat(core): honor default session models (#30982) (Kit Langton, 2026-06-05)
- f26a9e8 - chore: generate (opencode-agent[bot], 2026-06-05)
- 12e3886 - feat(core): interrupt v2 session execution (#30850) (Kit Langton, 2026-06-05)
- 41bd912 - sync release versions for v1.16.2 (opencode, 2026-06-05)
- 8ad44cd - chore: generate (opencode-agent[bot], 2026-06-05)
- 9b09075 - fix(stats): add mobile chart end spacing (Adam, 2026-06-05)
- 76a81ac - fix(workflows): serialize desktop release uploads (#30978) (Aiden Cline, 2026-06-05)
- 3f64b5e - feat(core): admit v2 skill guidance (#30843) (Kit Langton, 2026-06-05)
- cc487dd - fix(opencode): gate reasoning summaries by provider (#30973) (Aiden Cline, 2026-06-05)
- f8cf8fa - test(opencode): remove shell timeout output race (#30974) (Aiden Cline, 2026-06-05)
- 5d7157f - test(opencode): remove disposal event wait race (#30971) (Aiden Cline, 2026-06-05)
- e9aa33d - chore: generate (opencode-agent[bot], 2026-06-05)
- 02a5ae6 - fix(core): respect v2 default agents (#30969) (Kit Langton, 2026-06-05)
- fff36b7 - chore: generate (opencode-agent[bot], 2026-06-05)
- 236cfcb - fix(opencode): prevent destructive edit matches (#30932) (Shoubhit Dash, 2026-06-05)
- a8adfb6 - fix(stats): scroll model charts to latest on mobile (Adam, 2026-06-05)
- 5c8eb0a - fix(workflows): retry nix-hashes compute-hash on transient failure (#30743) (Jérôme Benoit, 2026-06-05)
- 1e216e1 - fix(opencode): resolve Bedrock hang by using node build conditions (#30873) (alberto, 2026-06-05)
- 48106b7 - chore: bun install (#30968) (Aiden Cline, 2026-06-05)
- 0ee7cfa - fix(core): recover corrupted models cache (#30947) (Shoubhit Dash, 2026-06-05)
- a261b55 - fix: use mapError instead of orDie for context snapshot decoding (#30905) (weiconghe, 2026-06-05)
- a136caa - chore: rm fuzzy search on references (#30931) (Shoubhit Dash, 2026-06-05)
- 7a4d183 - feat(tui): add diff hunk navigation (#30935) (Shoubhit Dash, 2026-06-05)
- edbe228 - chore: generate (opencode-agent[bot], 2026-06-05)
- d721fc0 - docs: update Go Qwen tiered pricing (#30936) (Jack, 2026-06-05)
- dc985ff - fix(tui): fall back to local cwd when editor spawns in attach mode (#30583) (pcadena-lila, 2026-06-05)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/core/src/tool/apply-patch.ts` (+60, -70)
- `packages/core/src/tool/bash.ts` (+8, -7)
- `packages/core/src/tool/edit.ts` (+5, -6)
- `packages/core/src/tool/glob.ts` (+3, -3)
- `packages/core/src/tool/grep.ts` (+4, -4)
- `packages/core/src/tool/read.ts` (+173, -44)
- `packages/core/src/tool/registry.ts` (+46, -11)
- `packages/core/src/tool/skill.ts` (+22, -32)
- `packages/core/src/tool/webfetch.ts` (+4, -3)
- `packages/core/src/tool/websearch.ts` (+3, -2)
- `packages/core/src/tool/write.ts` (+4, -4)
- `packages/opencode/src/tool/edit.ts` (+35, -9)
- `packages/opencode/test/tool/edit.test.ts` (+50, -8)
- `packages/opencode/test/tool/shell.test.ts` (+2, -4)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/console/core/package.json` (+1, -1)
- `packages/core/migration/20260605042240_add_context_epoch_agent/migration.sql` (+1, -0)
- `packages/core/migration/20260605042240_add_context_epoch_agent/snapshot.json` (+1990, -0)
- `packages/core/package.json` (+3, -1)
- `packages/core/src/agent.ts` (+42, -0)
- `packages/core/src/catalog.ts` (+10, -14)
- `packages/core/src/config.ts` (+15, -14)
- `packages/core/src/config/compaction.ts` (+0, -1)
- `packages/core/src/config/plugin/agent.ts` (+2, -0)
- `packages/core/src/config/plugin/provider.ts` (+23, -7)
- `packages/core/src/database/migration.gen.ts` (+1, -0)
- `packages/core/src/database/migration/20260605042240_add_context_epoch_agent.ts` (+11, -0)
- `packages/core/src/file-mutation.ts` (+64, -72)
- `packages/core/src/filesystem.ts` (+190, -115)
- `packages/core/src/fs-util.ts` (+4, -1)
- `packages/core/src/git.ts` (+15, -4)
- `packages/core/src/instruction-context.ts` (+2, -2)
- `packages/core/src/location-layer.ts` (+21, -22)
- `packages/core/src/location-mutation.ts` (+34, -190)
- `packages/core/src/location-search.ts` (+8, -16)
- `packages/core/src/model-request.ts` (+124, -0)
- `packages/core/src/model.ts` (+5, -2)
- `packages/core/src/models-dev.ts` (+20, -2)
- `packages/core/src/permission.ts` (+22, -16)
- `packages/core/src/plugin/agent.ts` (+4, -1)
- `packages/core/src/plugin/models-dev.ts` (+11, -7)
- `packages/core/src/plugin/provider/google-vertex.ts` (+4, -1)
- `packages/core/src/project.ts` (+3, -4)
- `packages/core/src/project/copy-strategies.ts` (+4, -4)
- `packages/core/src/project/copy.ts` (+6, -2)
- `packages/core/src/public/opencode.ts` (+63, -9)
- `packages/core/src/public/session.ts` (+29, -1)
- `packages/core/src/session.ts` (+32, -10)
- `packages/core/src/session/compaction.ts` (+246, -0)
- `packages/core/src/session/context-epoch.ts` (+130, -36)
- `packages/core/src/session/error.ts` (+12, -0)
- `packages/core/src/session/event.ts` (+25, -4)
- `packages/core/src/session/execution.ts` (+7, -2)
- `packages/core/src/session/execution/local.ts` (+17, -16)
- `packages/core/src/session/{context.ts => history.ts}` (+17, -8)
- `packages/core/src/session/message-updater.ts` (+7, -47)
- `packages/core/src/session/message.ts` (+2, -1)
- `packages/core/src/session/projector.ts` (+17, -28)
- `packages/core/src/session/run-coordinator.ts` (+174, -70)
- `packages/core/src/session/runner/index.ts` (+5, -2)
- `packages/core/src/session/runner/llm.ts` (+175, -56)
- `packages/core/src/session/runner/model.ts` (+15, -9)
- `packages/core/src/session/runner/publish-llm-event.ts` (+16, -6)
- `packages/core/src/session/runner/to-llm-message.ts` (+11, -1)
- `packages/core/src/session/sql.ts` (+3, -1)
- `packages/core/src/session/store.ts` (+3, -3)
- `packages/core/src/skill.ts` (+4, -13)
- `packages/core/src/skill/guidance.ts` (+76, -0)
- `packages/core/src/{system-context-builtins.ts => system-context/builtins.ts}` (+5, -5)
- `packages/core/src/{system-context.ts => system-context/index.ts}` (+1, -1)
- `packages/core/src/{system-context-registry.ts => system-context/registry.ts}` (+2, -2)
- `packages/core/src/tool-output-store.ts` (+76, -214)
- `packages/core/src/util/token.ts` (+5, -0)
- `packages/core/src/v1/config/migrate.ts` (+16, -6)
- `packages/core/test/application-tools.test.ts` (+6, -1)
- `packages/core/test/catalog.test.ts` (+32, -0)
- `packages/core/test/config/config.test.ts` (+57, -5)
- `packages/core/test/config/provider.test.ts` (+119, -1)
- `packages/core/test/config/skill.test.ts` (+0, -1)
- `packages/core/test/database-migration.test.ts` (+26, -0)
- `packages/core/test/file-mutation.test.ts` (+74, -68)
- `packages/core/test/filesystem/filesystem.test.ts` (+15, -0)
- `packages/core/test/git.test.ts` (+1, -1)
- `packages/core/test/instruction-context.test.ts` (+1, -1)
- `packages/core/test/location-filesystem.test.ts` (+166, -8)
- `packages/core/test/location-mutation.test.ts` (+33, -87)
- `packages/core/test/location-search.test.ts` (+18, -27)
- `packages/core/test/model-request.test.ts` (+44, -0)
- `packages/core/test/models.test.ts` (+30, -3)
- `packages/core/test/permission.test.ts` (+45, -0)
- `packages/core/test/plugin/provider-google-vertex.test.ts` (+21, -0)
- `packages/core/test/project-copy.test.ts` (+37, -2)
- `packages/core/test/project.test.ts` (+5, -5)
- `packages/core/test/public-opencode.test.ts` (+140, -1)
- `packages/core/test/session-compaction.test.ts` (+18, -0)
- `packages/core/test/session-create.test.ts` (+53, -6)
- `packages/core/test/session-projector.test.ts` (+29, -4)
- `packages/core/test/session-prompt.test.ts` (+60, -3)
- `packages/core/test/session-run-coordinator.test.ts` (+627, -0)
- `packages/core/test/session-runner-message.test.ts` (+19, -3)
- `packages/core/test/session-runner-model.test.ts` (+96, -10)
- `packages/core/test/session-runner-recorded.test.ts` (+35, -7)
- `packages/core/test/session-runner-tool-events.test.ts` (+127, -0)
- `packages/core/test/session-runner-tool-registry.test.ts` (+20, -2)
- `packages/core/test/session-runner.test.ts` (+840, -13)
- `packages/core/test/skill.test.ts` (+1, -2)
- `packages/core/test/skill/guidance.test.ts` (+154, -0)
- `packages/core/test/{system-context-builtins.test.ts => system-context/builtins.test.ts}` (+4, -4)
- `packages/core/test/{system-context.test.ts => system-context/index.test.ts}` (+1, -1)
- `packages/core/test/{system-context-registry.test.ts => system-context/registry.test.ts}` (+2, -2)
- `packages/core/test/tool-apply-patch.test.ts` (+28, -5)
- `packages/core/test/tool-bash.test.ts` (+37, -10)
- `packages/core/test/tool-edit.test.ts` (+10, -59)
- `packages/core/test/tool-glob.test.ts` (+2, -12)
- `packages/core/test/tool-grep.test.ts` (+2, -12)
- `packages/core/test/tool-output-store.test.ts` (+55, -164)
- `packages/core/test/tool-read.test.ts` (+266, -221)
- `packages/core/test/tool-skill.test.ts` (+42, -14)
- `packages/core/test/tool-webfetch.test.ts` (+9, -10)
- `packages/core/test/tool-websearch.test.ts` (+8, -9)
- `packages/core/test/tool-write.test.ts` (+5, -54)
- `packages/stats/core/package.json` (+1, -1)
- `packages/stats/core/src/domain/home.ts` (+3, -3)

#### Other Changes
- `.changeset/brave-cassettes-record.md` (+5, -0)
- `.changeset/config.json` (+11, -0)
- `.github/workflows/http-recorder-release.yml` (+53, -0)
- `.github/workflows/nix-hashes.yml` (+15, -5)
- `.github/workflows/publish.yml` (+23, -6)
- `AGENTS.md` (+2, -1)
- `CONTEXT.md` (+37, -1)
- `bun.lock` (+206, -40)
- `nix/hashes.json` (+4, -4)
- `package.json` (+4, -0)
- `packages/app/package.json` (+2, -1)
- `packages/app/src/app.tsx` (+8, -6)
- `packages/app/src/components/dialog-select-file.tsx` (+9, -1)
- `packages/app/src/components/dialog-select-server.tsx` (+6, -1)
- `packages/app/src/components/prompt-input.tsx` (+20, -1)
- `packages/app/src/components/prompt-input/server-attachment.test.ts` (+25, -0)
- `packages/app/src/components/prompt-input/server-attachment.ts` (+8, -0)
- `packages/app/src/components/server/server-row-menu.tsx` (+59, -0)
- `packages/app/src/components/settings-v2/dialog-server-v2.tsx` (+129, -0)
- `packages/app/src/components/settings-v2/dialog-settings-v2.tsx` (+6, -6)
- `packages/app/src/components/settings-v2/servers.tsx` (+143, -0)
- `packages/app/src/components/settings-v2/settings-v2.css` (+141, -0)
- `packages/app/src/components/status-popover-body.tsx` (+6, -11)
- `packages/app/src/context/global-sync/child-store.test.ts` (+1, -0)
- `packages/app/src/context/global-sync/event-reducer.test.ts` (+21, -0)
- `packages/app/src/context/global-sync/event-reducer.ts` (+4, -2)
- `packages/app/src/context/platform.tsx` (+3, -5)
- `packages/app/src/context/server-sync.tsx` (+11, -6)
- `packages/app/src/context/server.test.ts` (+41, -1)
- `packages/app/src/context/server.tsx` (+18, -9)
- `packages/app/src/context/tabs.tsx` (+10, -0)
- `packages/app/src/i18n/en.ts` (+53, -0)
- `packages/app/src/index.ts` (+15, -0)
- `packages/app/src/pages/home.tsx` (+145, -155)
- `packages/app/src/wsl/context.tsx` (+36, -0)
- `packages/app/src/wsl/dialog-add-server.tsx` (+623, -0)
- `packages/app/src/wsl/settings-model.test.ts` (+57, -0)
- `packages/app/src/wsl/settings-model.ts` (+19, -0)
- `packages/app/src/wsl/settings.tsx` (+167, -0)
- `packages/app/src/wsl/types.ts` (+87, -0)
- `packages/cli/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/mail/package.json` (+1, -1)
- `packages/console/support/package.json` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/desktop/src/main/apps.ts` (+1, -20)
- `packages/desktop/src/main/constants.ts` (+1, -1)
- `packages/desktop/src/main/index.ts` (+43, -23)
- `packages/desktop/src/main/ipc.ts` (+4, -12)
- `packages/desktop/src/main/server.ts` (+1, -12)
- `packages/desktop/src/main/wsl/ipc.ts` (+64, -0)
- `packages/desktop/src/main/wsl/policy.ts` (+26, -0)
- `packages/desktop/src/main/wsl/runtime.ts` (+400, -0)
- `packages/desktop/src/main/wsl/servers.test.ts` (+93, -0)
- `packages/desktop/src/main/wsl/servers.ts` (+440, -0)
- `packages/desktop/src/main/wsl/sidecar.ts` (+129, -0)
- `packages/desktop/src/main/wsl/startup.ts` (+31, -0)
- `packages/desktop/src/preload/index.ts` (+24, -4)
- `packages/desktop/src/preload/types.ts` (+16, -4)
- `packages/desktop/src/renderer/index.tsx` (+60, -87)
- `packages/desktop/src/renderer/wsl/connections.test.ts` (+43, -0)
- `packages/desktop/src/renderer/wsl/connections.ts` (+28, -0)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/enterprise/package.json` (+1, -1)
- `packages/function/package.json` (+1, -1)
- `packages/http-recorder/LICENSE` (+21, -0)
- `packages/http-recorder/README.md` (+163, -154)
- `packages/http-recorder/package.json` (+43, -8)
- `packages/http-recorder/script/build.ts` (+20, -0)
- `packages/http-recorder/script/pack.ts` (+35, -0)
- `packages/http-recorder/script/publish.ts` (+26, -0)
- `packages/http-recorder/script/verify-package.ts` (+75, -0)
- `packages/http-recorder/src/cassette.ts` (+57, -40)
- `packages/http-recorder/src/effect.ts` (+20, -137)
- `packages/http-recorder/src/index.ts` (+16, -23)
- `packages/http-recorder/src/internal-effect.ts` (+189, -0)
- `packages/http-recorder/src/internal.ts` (+15, -0)
- `packages/http-recorder/src/matching.ts` (+4, -4)
- `packages/http-recorder/src/recorder.ts` (+26, -12)
- `packages/http-recorder/src/redaction.ts` (+6, -4)
- `packages/http-recorder/src/redactor.ts` (+62, -3)
- `packages/http-recorder/src/schema.ts` (+30, -11)
- `packages/http-recorder/src/socket.ts` (+326, -0)
- `packages/http-recorder/src/types.ts` (+108, -0)
- `packages/http-recorder/src/websocket.ts` (+92, -79)
- `packages/http-recorder/test/record-replay.test.ts` (+580, -141)
- `packages/http-recorder/tsconfig.json` (+9, -2)
- `packages/llm/AGENTS.md` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/llm/src/index.ts` (+1, -0)
- `packages/llm/src/protocols/anthropic-messages.ts` (+27, -15)
- `packages/llm/src/protocols/bedrock-converse.ts` (+11, -1)
- `packages/llm/src/protocols/gemini.ts` (+28, -6)
- `packages/llm/src/protocols/openai-chat.ts` (+72, -10)
- `packages/llm/src/protocols/openai-responses.ts` (+28, -11)
- `packages/llm/src/protocols/shared.ts` (+43, -15)
- `packages/llm/src/protocols/utils/bedrock-media.ts` (+22, -12)
- `packages/llm/src/protocols/utils/openai-options.ts` (+9, -0)
- `packages/llm/src/provider-error.ts` (+32, -0)
- `packages/llm/src/providers/openai-options.ts` (+4, -2)
- `packages/llm/src/route/executor.ts` (+13, -2)
- `packages/llm/src/schema/errors.ts` (+4, -0)
- `packages/llm/src/schema/events.ts` (+2, -0)
- `packages/llm/src/tool.ts` (+16, -4)
- `packages/llm/test/executor.test.ts` (+40, -0)
- `packages/llm/test/provider/anthropic-messages-cache.recorded.test.ts` (+1, -2)
- `packages/llm/test/provider/anthropic-messages.recorded.test.ts` (+1, -2)
- `packages/llm/test/provider/anthropic-messages.test.ts` (+23, -0)
- `packages/llm/test/provider/bedrock-converse.test.ts` (+21, -4)
- `packages/llm/test/provider/gemini.test.ts` (+105, -0)
- `packages/llm/test/provider/golden.recorded.test.ts` (+10, -6)
- `packages/llm/test/provider/openai-chat.test.ts` (+196, -4)
- `packages/llm/test/provider/openai-responses.test.ts` (+29, -2)
- `packages/llm/test/recorded-golden.ts` (+1, -1)
- `packages/llm/test/recorded-test.ts` (+29, -9)
- `packages/llm/test/recorded-websocket.ts` (+5, -5)
- `packages/llm/test/tool-runtime.test.ts` (+25, -0)
- `packages/opencode/package.json` (+2, -2)
- `packages/opencode/script/build.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/mcp.ts` (+68, -2)
- `packages/opencode/src/cli/cmd/providers.ts` (+26, -10)
- `packages/opencode/src/cli/cmd/tui/component/dialog-model.tsx` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/component/dialog-move-session.tsx` (+151, -40)
- `packages/opencode/src/cli/cmd/tui/component/dialog-workspace-file-changes.tsx` (+14, -8)
- `packages/opencode/src/cli/cmd/tui/component/prompt/autocomplete.tsx` (+26, -95)
- `packages/opencode/src/cli/cmd/tui/component/prompt/move.tsx` (+45, -11)
- `packages/opencode/src/cli/cmd/tui/config/keybind.ts` (+7, -1)
- `packages/opencode/src/cli/cmd/tui/context/project.tsx` (+2, -0)
- `packages/opencode/src/cli/cmd/tui/context/sync-v2.tsx` (+5, -23)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/home/footer.tsx` (+4, -5)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/system/diff-viewer.tsx` (+93, -1)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/system/plugins.tsx` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/system/session-v2.tsx` (+6, -31)
- `packages/opencode/src/cli/cmd/tui/routes/home/session-destination.tsx` (+16, -3)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+19, -21)
- `packages/opencode/src/cli/cmd/tui/ui/dialog-select.tsx` (+164, -52)
- `packages/opencode/src/cli/cmd/tui/util/editor.ts` (+6, -1)
- `packages/opencode/src/cli/cmd/tui/util/layout.ts` (+25, -0)
- `packages/opencode/src/index.ts` (+1, -1)
- `packages/opencode/src/provider/error.ts` (+2, -34)
- `packages/opencode/src/provider/provider.ts` (+13, -2)
- `packages/opencode/src/provider/transform.ts` (+8, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/project-copy.ts` (+5, -3)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/control-plane.ts` (+2, -0)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/project-copy.ts` (+8, -3)
- `packages/opencode/src/session/compaction.ts` (+23, -56)
- `packages/opencode/src/session/llm/request.ts` (+7, -0)
- `packages/opencode/src/session/prompt.ts` (+56, -91)
- `packages/opencode/src/session/session.ts` (+1, -1)
- `packages/opencode/src/util/token.ts` (+1, -7)
- `packages/opencode/test/cli/help/__snapshots__/help-snapshots.test.ts.snap` (+16, -7)
- `packages/opencode/test/cli/help/help-snapshots.test.ts` (+5, -0)
- `packages/opencode/test/cli/mcp-add.test.ts` (+74, -0)
- `packages/opencode/test/cli/tui/diff-viewer.test.tsx` (+108, -15)
- `packages/opencode/test/cli/tui/inline-tool-wrap-snapshot.test.tsx` (+49, -3)
- `packages/opencode/test/project/instance-bootstrap.test.ts` (+1, -1)
- `packages/opencode/test/provider/amazon-bedrock.test.ts` (+14, -8)
- `packages/opencode/test/provider/transform.test.ts` (+74, -0)
- `packages/opencode/test/server/httpapi-config.test.ts` (+1, -1)
- `packages/opencode/test/server/httpapi-instance-context.test.ts` (+1, -1)
- `packages/opencode/test/server/project-copy.test.ts` (+14, -2)
- `packages/opencode/test/server/session-list.test.ts` (+29, -4)
- `packages/opencode/test/session/llm-native-recorded.test.ts` (+26, -27)
- `packages/opencode/test/session/prompt.test.ts` (+23, -96)
- `packages/opencode/test/v2/session-message-updater.test.ts` (+15, -6)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+4, -12)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+105, -23)
- `packages/sdk/openapi.json` (+893, -133)
- `packages/server/package.json` (+1, -1)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/app/src/routes/index.css` (+5, -2)
- `packages/stats/server/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/script/colors.txt` (+1, -0)
- `packages/ui/src/context/dialog.tsx` (+63, -30)
- `packages/ui/src/styles/tailwind/colors.css` (+1, -0)
- `packages/ui/src/theme/themes/oc-2.json` (+2, -0)
- `packages/ui/src/theme/v2/mapping.ts` (+2, -0)
- `packages/ui/src/v2/components/menu-v2.css` (+7, -0)
- `packages/ui/src/v2/components/project-avatar-v2.css` (+44, -23)
- `packages/ui/src/v2/components/project-avatar-v2.stories.tsx` (+12, -2)
- `packages/ui/src/v2/components/project-avatar-v2.tsx` (+15, -8)
- `packages/ui/src/v2/styles/theme.css` (+3, -0)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/ar/go.mdx` (+18, -16)
- `packages/web/src/content/docs/bs/go.mdx` (+18, -16)
- `packages/web/src/content/docs/da/go.mdx` (+18, -16)
- `packages/web/src/content/docs/de/go.mdx` (+18, -16)
- `packages/web/src/content/docs/es/go.mdx` (+18, -16)
- `packages/web/src/content/docs/fr/go.mdx` (+18, -16)
- `packages/web/src/content/docs/go.mdx` (+18, -16)
- `packages/web/src/content/docs/it/go.mdx` (+18, -16)
- `packages/web/src/content/docs/ja/go.mdx` (+18, -16)
- `packages/web/src/content/docs/ko/go.mdx` (+18, -16)
- `packages/web/src/content/docs/nb/go.mdx` (+18, -16)
- `packages/web/src/content/docs/pl/go.mdx` (+18, -16)
- `packages/web/src/content/docs/pt-br/go.mdx` (+18, -16)
- `packages/web/src/content/docs/ru/go.mdx` (+18, -16)
- `packages/web/src/content/docs/th/go.mdx` (+18, -16)
- `packages/web/src/content/docs/tr/go.mdx` (+18, -16)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+18, -16)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+18, -16)
- `sdks/vscode/package.json` (+1, -1)
- `specs/v2/config.md` (+1, -2)
- `specs/v2/schema-changelog.md` (+41, -9)
- `specs/v2/session.md` (+54, -4)
- `specs/v2/todo.md` (+2, -2)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 71bc49a..72e9f1d 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.16.0",
+  "version": "1.16.2",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/migration/20260605042240_add_context_epoch_agent/migration.sql
```diff
diff --git a/packages/core/migration/20260605042240_add_context_epoch_agent/migration.sql b/packages/core/migration/20260605042240_add_context_epoch_agent/migration.sql
new file mode 100644
index 0000000..a9534b9
--- /dev/null
+++ b/packages/core/migration/20260605042240_add_context_epoch_agent/migration.sql
@@ -0,0 +1 @@
+ALTER TABLE `session_context_epoch` ADD `agent` text DEFAULT 'build' NOT NULL;
\ No newline at end of file
```

#### packages/core/migration/20260605042240_add_context_epoch_agent/snapshot.json
```diff
diff --git a/packages/core/migration/20260605042240_add_context_epoch_agent/snapshot.json b/packages/core/migration/20260605042240_add_context_epoch_agent/snapshot.json
new file mode 100644
index 0000000..6b893fe
--- /dev/null
+++ b/packages/core/migration/20260605042240_add_context_epoch_agent/snapshot.json
@@ -0,0 +1,1990 @@
+{
+  "version": "7",
+  "dialect": "sqlite",
+  "id": "d1bfa125-b81e-4c61-9b6e-e74abf6e488f",
+  "prevIds": ["40f7b9b8-83b4-4ea0-a59f-76a489679d88"],
+  "ddl": [
+    {
+      "name": "workspace",
+      "entityType": "tables"
+    },
+    {
+      "name": "data_migration",
+      "entityType": "tables"
+    },
+    {
+      "name": "account_state",
+      "entityType": "tables"
+    },
+    {
+      "name": "account",
+      "entityType": "tables"
+    },
+    {
+      "name": "control_account",
+      "entityType": "tables"
+    },
+    {
+      "name": "event_sequence",
+      "entityType": "tables"
+    },
+    {
+      "name": "event",
+      "entityType": "tables"
+    },
+    {
+      "name": "permission",
+      "entityType": "tables"
+    },
+    {
+      "name": "project_directory",
+      "entityType": "tables"
+    },
+    {
+      "name": "project",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 561cb93..b0d5f7b 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.16.0",
+  "version": "1.16.2",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
@@ -19,6 +19,7 @@
   "exports": {
     "./public": "./src/public/index.ts",
     "./session/runner": "./src/session/runner/index.ts",
+    "./system-context": "./src/system-context/index.ts",
     "./*": "./src/*.ts"
   },
   "imports": {
@@ -90,6 +91,7 @@
     "@opentelemetry/exporter-trace-otlp-http": "0.214.0",
     "@opentelemetry/sdk-trace-base": "2.6.1",
     "@parcel/watcher": "2.5.1",
+    "@silvia-odwyer/photon-node": "0.3.4",
     "@openrouter/ai-sdk-provider": "2.9.0",
     "ai-gateway-provider": "3.1.2",
     "bun-pty": "0.4.8",
```

#### packages/core/src/agent.ts
```diff
diff --git a/packages/core/src/agent.ts b/packages/core/src/agent.ts
index cbe561e..3e59872 100644
--- a/packages/core/src/agent.ts
+++ b/packages/core/src/agent.ts
@@ -10,6 +10,7 @@ import { State } from "./state"
 
 export const ID = Schema.String.pipe(Schema.brand("AgentV2.ID"))
 export type ID = typeof ID.Type
+export const defaultID = ID.make("build")
 
 export const Color = Schema.Union([
   Schema.String.check(Schema.isPattern(/^#[0-9a-fA-F]{6}$/)),
@@ -42,13 +43,20 @@ export class Info extends Schema.Class<Info>("AgentV2.Info")({
   }
 }
 
+export interface Selection {
+  readonly id: ID
+  readonly info: Info | undefined
+}
+
 type Data = {
   agents: Map<ID, Info>
+  default?: ID
 }
 
 export type Editor = {
   list: () => readonly Info[]
   get: (id: ID) => Info | undefined
+  default: (id: ID | undefined) => void
   update: (id: ID, fn: (agent: Draft<Info>) => void) => void
   remove: (id: ID) => void
 }
@@ -57,6 +65,9 @@ export interface Interface {
   readonly transform: State.Interface<Data, Editor>["transform"]
   readonly update: (update: State.Transform<Editor>) => Effect.Effect<void, never, Scope.Scope>
   readonly get: (id: ID) => Effect.Effect<Info | undefined>
+  readonly default: () => Effect.Effect<Info | undefined>
+  readonly resolve: (id?: ID | string) => Effect.Effect<Info | undefined>
+  readonly select: (id?: ID | string) => Effect.Effect<Selection>
   readonly all: () => Effect.Effect<Info[]>
 }
 
@@ -72,6 +83,9 @@ export const layer = Layer.effect(
       editor: (draft) => ({
         list: () => Array.fromIterable(draft.agents.values()) as Info[],
         get: (id) => draft.agents.get(id),
+        default: (id) => {
+          draft.default = id
+        },
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/kilocode/agent/index.ts
- `src/core/` - review core changes from packages/core/package.json
- `src/tool/apply-patch.ts` - update based on opencode packages/core/src/tool/apply-patch.ts changes
- `src/tool/bash.ts` - update based on opencode packages/core/src/tool/bash.ts changes
- `src/tool/edit.test.ts` - update based on opencode packages/opencode/test/tool/edit.test.ts changes
- `src/tool/edit.ts` - update based on opencode packages/core/src/tool/edit.ts changes
- `src/tool/edit.ts` - update based on opencode packages/opencode/src/tool/edit.ts changes
- `src/tool/glob.ts` - update based on opencode packages/core/src/tool/glob.ts changes
- `src/tool/grep.ts` - update based on opencode packages/core/src/tool/grep.ts changes
- `src/tool/parameters.test.ts.snap.ts` - update based on kilocode packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap changes
- `src/tool/plan-exit.txt.ts` - update based on kilocode packages/opencode/src/tool/plan-exit.txt changes
- `src/tool/plan.ts` - update based on kilocode packages/opencode/src/kilocode/tool/plan.ts changes
- `src/tool/plan.ts` - update based on kilocode packages/opencode/src/tool/plan.ts changes
- `src/tool/read.ts` - update based on opencode packages/core/src/tool/read.ts changes
- `src/tool/registry.ts` - update based on opencode packages/core/src/tool/registry.ts changes
- `src/tool/shell.test.ts` - update based on opencode packages/opencode/test/tool/shell.test.ts changes
- `src/tool/skill.ts` - update based on opencode packages/core/src/tool/skill.ts changes
- `src/tool/webfetch.ts` - update based on opencode packages/core/src/tool/webfetch.ts changes
- `src/tool/websearch.ts` - update based on opencode packages/core/src/tool/websearch.ts changes
- `src/tool/write.ts` - update based on opencode packages/core/src/tool/write.ts changes
