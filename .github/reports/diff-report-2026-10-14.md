# Upstream Changes Report
Generated: 2026-10-14 11:20:47

## Summary
- kilocode: 19 commits, 38 files changed
- opencode: 42 commits, 296 files changed

## kilocode Changes (2a7edfedb..4ee8d1b3b)

### Commits

- 4ee8d1b3b - Merge pull request #15036 from Kilo-Org/cosmic-orchid (Kirill Kalishev, 2026-10-13)
- ff20ca72d - Merge pull request #15017 from Kilo-Org/fix/glob-respect-gitignore (Andrea Giammarchi, 2026-10-13)
- 44856c1cd - fix(jetbrains): address review feedback on live-only auto-expand (kirillk, 2026-10-13)
- cd7c29ef6 - fix(jetbrains): expand transcript blocks only while live (kirillk, 2026-10-13)
- f70f0da2d - Merge pull request #15004 from Kilo-Org/igor/fork-from-message (Igor Šćekić, 2026-10-13)
- 433fb11a6 - Merge pull request #14254 from Kilo-Org/fix/vscode-inline-esbuild-problem-matcher (Bruno Agatão, 2026-10-13)
- 54fb6ec2a - Merge remote-tracking branch 'origin/fix/glob-respect-gitignore' into fix/glob-respect-gitignore (webreflection, 2026-10-13)
- 17448f5c5 - fix(cli): apply grep include and find globs after ignore rules (webreflection, 2026-10-13)
- 39fa67607 - Merge branch 'main' into fix/glob-respect-gitignore (Andrea Giammarchi, 2026-10-13)
- f8ebadd8a - test(core): compare glob tests with the installed ripgrep on every platform (webreflection, 2026-10-13)
- e48c9785c - fix(cli): stop glob patterns from bypassing .gitignore (webreflection, 2026-10-13)
- a4731fcd6 - fix(kilo-gateway): keep imported transcript order when the export lists items in ingest order (Igor Šćekić, 2026-10-12)
- 8f6c4e264 - chore: add changeset for remote fork from message (Igor Šćekić, 2026-10-12)
- da2b05a4c - feat(opencode): advertise sessionCloneAtMessage heartbeat capability (Igor Šćekić, 2026-10-12)
- 62c4b88da - feat(opencode): fork remote clone at a message with cloneUpToMessageId (Igor Šćekić, 2026-10-12)
- 09399e485 - feat(kilo-gateway): fetch cloud session export up to a message (Igor Šćekić, 2026-10-12)
- 0ca55bb07 - fix(vscode): add file/line/column capture to inline esbuild matcher (Bruno Agatao, 2026-09-17)
- 44b060802 - Merge remote-tracking branch 'origin/main' into fix/vscode-inline-esbuild-problem-matcher (Bruno Agatao, 2026-09-17)
- 63fcea2d6 - fix(vscode): inline esbuild watch problem matcher and drop extension dependency (Bruno Agatao, 2026-09-17)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt` (+12, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt` (+10, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolView.kt` (+10, -3)
- `packages/opencode/src/kilocode/tool/glob-ignored.ts` (+14, -14)
- `packages/opencode/test/kilocode/tool/glob-ignored.test.ts` (+27, -1)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/src/kilocode/ripgrep-glob.ts` (+129, -0)
- `packages/core/src/ripgrep.ts` (+13, -10)
- `packages/core/test/kilocode/ripgrep-glob.test.ts` (+343, -0)
- `packages/core/test/kilocode/ripgrep-settlement.test.ts` (+4, -1)

#### Other Changes
- `.changeset/glob-respect-gitignore.md` (+6, -0)
- `.changeset/jetbrains-live-only-auto-expand.md` (+5, -0)
- `.changeset/remote-fork-from-message.md` (+5, -0)
- `.vscode/extensions.json` (+0, -1)
- `.vscode/tasks.json` (+21, -1)
- `packages/kilo-docs/lychee.toml` (+1, -1)
- `packages/kilo-docs/pages/contributing/development-environment.md` (+1, -2)
- `packages/kilo-gateway/src/cloud-sessions.ts` (+60, -14)
- `packages/kilo-gateway/test/cloud-sessions.test.ts` (+114, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionUpdateQueue.kt` (+25, -53)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanel.kt` (+150, -42)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/MessageView.kt` (+4, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/ReasoningView.kt` (+11, -6)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/TurnView.kt` (+3, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/ViewFactory.kt` (+11, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/util/EdtDrain.kt` (+107, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanelTest.kt` (+167, -9)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionUiUpdateTest.kt` (+3, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/util/EdtDrainTest.kt` (+82, -0)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+2, -2)
- `packages/opencode/src/kilo-sessions/remote-protocol.ts` (+4, -0)
- `packages/opencode/src/kilo-sessions/remote-sender.ts` (+12, -2)
- `packages/opencode/src/kilo-sessions/remote-ws.ts` (+2, -2)
- `packages/opencode/src/kilocode/server/import-cloud-session-in-process.ts` (+14, -5)
- `packages/opencode/test/kilocode/session-diff-restore.test.ts` (+30, -0)
- `packages/opencode/test/kilocode/sessions/remote-protocol.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/sessions/remote-sender.test.ts` (+78, -4)
- `packages/opencode/test/kilocode/sessions/remote-ws.test.ts` (+7, -7)

### Key Diffs

#### packages/core/src/kilocode/ripgrep-glob.ts
```diff
diff --git a/packages/core/src/kilocode/ripgrep-glob.ts b/packages/core/src/kilocode/ripgrep-glob.ts
new file mode 100644
index 000000000..438535eca
--- /dev/null
+++ b/packages/core/src/kilocode/ripgrep-glob.ts
@@ -0,0 +1,129 @@
+// Glob matching that keeps ripgrep's ignore rules in charge (#15003).
+//
+// Passing the agent's pattern as `--glob=<pattern>` makes it a ripgrep override, and overrides win over
+// `.gitignore`: a pattern that also matches folder names, such as `**/*`, walks `node_modules`, and
+// gitignored files that match the pattern are returned. Instead, ripgrep lists the files its ignore rules
+// allow and the pattern is applied here with the gitignore-style rules ripgrep uses for overrides.
+//
+// Hidden paths keep their previous behavior: a hidden file is returned when it matches the pattern, and a
+// hidden folder is searched only when the pattern matches the folder itself, as ripgrep does for overrides.
+// The same applies to the grep `include` filter and to `find`, which pass globs to ripgrep the same way.
+
+export interface Input {
+  readonly pattern: string
+  readonly hidden?: boolean
+  readonly include?: readonly string[]
+}
+
+export interface Walk {
+  readonly args: readonly string[]
+  readonly match: (file: string) => boolean
+}
+
+/** Match a cwd-relative path the way ripgrep matches an override glob. */
+export function compile(pattern: string) {
+  const dir = pattern.endsWith("/")
+  const body = pattern.replace(/\/+$/, "")
+  const text = body.includes("/") ? body.replace(/^\//, "") : `**/${body}`
+  const glob = new Bun.Glob(text)
+  // ripgrep treats a trailing `/**` as everything inside the folder, but not the folder itself.
+  const folders = text.endsWith("/**") ? new Bun.Glob(`${text}/*`) : glob
+  return (path: string, folder: boolean) => {
+    if (folder) return folders.match(path)
+    return !dir && glob.match(path)
+  }
+}
+
+/**
+ * Ripgrep can also apply the last path segment of the pattern as a file type. Types match file names after
+ * ignore rules, so they keep ripgrep from printing (or, for grep, reading) every file; `match` still
+ * decides, which covers the folder part of the pattern, hidden folders, and edge cases. Patterns whose
+ * braces span folders, such as `{src/*.ts,lib/*.js}`, have no single last segment and skip this.
+ */
+function prefilter(pattern: string) {
+  const name = pattern.split("/").at(-1) ?? ""
```

#### packages/core/src/ripgrep.ts
```diff
diff --git a/packages/core/src/ripgrep.ts b/packages/core/src/ripgrep.ts
index a5c6ea67b..96a5572b4 100644
--- a/packages/core/src/ripgrep.ts
+++ b/packages/core/src/ripgrep.ts
@@ -4,6 +4,7 @@ import { Context, Duration, Effect, Fiber, Layer, Schema, Stream } from "effect"
 import { ChildProcess } from "effect/unstable/process"
 import { makeGlobalNode } from "./effect/app-node"
 import { Entry, Match } from "@opencode-ai/schema/filesystem"
+import * as KiloGlob from "./kilocode/ripgrep-glob" // kilocode_change
 import * as KiloGrep from "./kilocode/ripgrep-grep" // kilocode_change
 import * as SpawnExit from "./kilocode/spawn-exit" // kilocode_change
 import * as SpawnValidation from "./kilocode/spawn-validation" // kilocode_change
@@ -72,6 +73,7 @@ export interface GlobInput {
   readonly noRequireGit?: boolean // kilocode_change - honor ignore files outside a git repository
   readonly include?: readonly string[] // kilocode_change - additional whitelist globs
   readonly exclude?: readonly string[] // kilocode_change - additional exclusion globs
+  readonly filter?: (path: string) => boolean // kilocode_change - drop paths before the result limit
 }
 
 export interface GrepInput extends KiloGrep.Options {
@@ -223,19 +225,18 @@ const layer = Layer.effect(
             ...(input.hidden ? ["--hidden"] : []),
             ...(input.follow ? ["--follow"] : []),
             ...(input.noRequireGit ? ["--no-require-git"] : []), // kilocode_change
-            `--glob=${input.pattern}`,
+            ...KiloGlob.glob(input).args, // kilocode_change - apply the pattern after ignore rules
             ...(input.include ?? []).map((glob) => `--glob=${glob}`), // kilocode_change
             ...(input.exclude ?? []).map((glob) => `--glob=!${glob}`), // kilocode_change
             "--glob=!**/.git/**",
             ".",
           ],
-          parse: (line) =>
-            Effect.succeed(
-              line
-                .replace(/^(?:\.[\\/])+/u, "")
-                .replace(/^[\\/]+/u, "")
-                .replaceAll("\\", "/"),
-            ),
+          // kilocode_change start - drop paths the pattern or filter rejects
+          parse: (line) => {
+            const file = KiloGlob.relative(line)
+            return Effect.succeed(KiloGlob.glob(input).keep(file) ? file : undefined)
+          },
+          // kilocode_change end
         }).pipe(
           // kilocode_change start - retain spawn metadata after mapping paths
           Effect.map((result) => ({
@@ -264,7 +265,7 @@ const layer = Layer.effect(
             "--files",
             ...(input.hidden ? ["--hidden"] : []),
```

#### packages/core/test/kilocode/ripgrep-glob.test.ts
```diff
diff --git a/packages/core/test/kilocode/ripgrep-glob.test.ts b/packages/core/test/kilocode/ripgrep-glob.test.ts
new file mode 100644
index 000000000..321e3ed47
--- /dev/null
+++ b/packages/core/test/kilocode/ripgrep-glob.test.ts
@@ -0,0 +1,343 @@
+import { describe, expect } from "bun:test"
+import path from "node:path"
+import { Effect } from "effect"
+import { LayerNode } from "@opencode-ai/core/effect/layer-node"
+import { Ripgrep } from "@opencode-ai/core/ripgrep"
+import { RipgrepBinary } from "@opencode-ai/core/ripgrep/binary"
+import { tmpdir } from "../fixture/tmpdir"
+import { testEffect } from "../lib/effect"
+
+const it = testEffect(LayerNode.compile(LayerNode.group([Ripgrep.node, RipgrepBinary.node])))
+
+const gitignore = ["build/", "node_modules/", "*.gen.ts", "out/*", "!out/keep.txt", ".cache/", ".env", "secret/"]
+
+const files = [
+  "src/a.ts",
+  "src/b.tsx",
+  "src/.hidden.ts",
+  "src/gen/c.gen.ts",
+  "src/gen/d.ts",
+  "build/x.ts",
+  "build/sub/y.ts",
+  "node_modules/pkg/index.ts",
+  "node_modules/pkg/dist/z.js",
+  "lib/i.ts",
+  "lib/node_modules/x/h.ts",
+  ".github/workflows/ci.yml",
+  ".github/README.md",
+  ".cache/deep/e.ts",
+  ".hidden.d/f.ts",
+  ".vscode/settings.json",
+  "docs/guide.md",
+  "docs/notes.local.md",
+  "docs/.drafts/g.md",
+  "out/drop.txt",
+  "out/keep.txt",
+  "ignored-by-dotignore/n.ts",
+  "secret/o.ts",
+  "a.ts.d/m.ts",
+  "sp ace/k l.ts",
+  ".env",
+  ".env.example",
+  ".eslintrc.json",
+  "package.json",
+  "README.md",
```

#### packages/core/test/kilocode/ripgrep-settlement.test.ts
```diff
diff --git a/packages/core/test/kilocode/ripgrep-settlement.test.ts b/packages/core/test/kilocode/ripgrep-settlement.test.ts
index fdcd8c8c1..af0fd654d 100644
--- a/packages/core/test/kilocode/ripgrep-settlement.test.ts
+++ b/packages/core/test/kilocode/ripgrep-settlement.test.ts
@@ -233,7 +233,10 @@ writeSync(1, ${JSON.stringify(output)})
           expect(passed).toContain("--fixed-strings")
           expect(passed).toContain("--ignore-case")
           expect(passed).toContain("--context=1")
-          expect(passed).toContain("--glob=*.ts")
+          // The include glob is applied after ignore rules: validated by ripgrep, prefiltered as a file type.
+          expect(passed).toContain("--pre-glob=*.ts")
+          expect(passed).toContain("--type-add=kiloglob:*.ts")
+          expect(passed).not.toContain("--glob=*.ts")
           expect(alive(pid)).toBe(true)
           if (process.platform !== "win32") {
             const child = Number(yield* Effect.promise(() => read(owned)))
```

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt
index b76c493c6..9b2879d96 100644
--- a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt
@@ -50,6 +50,7 @@ class EditToolView(
     private var body: EditBody = editBody(tool, selection, openFile),
     private val footer: ToolApprovalFooter = ToolApprovalFooter(),
     private var display: BlockDisplay = KiloPluginSettings.getCodeEditDisplay(),
+    private val live: () -> Boolean = { true },
 ) : AbstractSessionPartView(parts.header, { body.mount(tool) }, { footer }), UiDataProvider, SessionCopyTarget,
     ApprovalReasonTarget, TranscriptDisplayTarget {
 
@@ -95,7 +96,8 @@ class EditToolView(
         selection: SessionSelection?,
         openDiff: SessionDiffOpener,
         sessionId: String?,
-    ) : this(tool, openFile, selection) {
+        live: () -> Boolean = { true },
+    ) : this(tool, openFile, selection, live = live) {
         opener = openDiff
         this.sessionId = sessionId
     }
@@ -225,11 +227,17 @@ class EditToolView(
     private fun expandable(): Boolean =
         editDiff(item).isNotBlank() || output(item).isNotBlank() || !item.error.isNullOrBlank()
 
-    private fun sync(force: Boolean = false): Boolean {
+    /**
+     * [force] reapplies even when the stored display matches a divergence from the card's
+     * containment. [auto] marks an automatic expansion from construction/streaming, which [live]
+     * may suppress for history or non-streaming blocks; an explicit display change passes
+     * `auto = false` and always applies.
+     */
+    private fun sync(force: Boolean = false, auto: Boolean = true): Boolean {
         val expand = expandable()
         var changed = false
         changed = syncExpandable(expand) || changed
-        if (force || !touched) {
+        if (force || (!touched && (!auto || live()))) {
             changed = if (display == BlockDisplay.EXPANDED && expand) {
                 expand() || changed
             } else {
@@ -263,7 +271,7 @@ class EditToolView(
         // can have diverged from it while the user held a manual state.
         if (!force && this.display == next) return false
         this.display = next
-        sync(force)
+        sync(force, auto = false)
         // Same contract as update(): a state change the card applies itself must revalidate it.
         refresh()
```


*... and more files (showing first 5)*

## opencode Changes (1015cb6..34d8ded)

### Commits

- 34d8ded - sync release versions for v2.0.29 [skip ci] (opencode, 2026-10-14)
- 3a69bae - docs(go): remove DeepSeek V4 Flash and V4 Flash Vision Exp (#55332) (Jack, 2026-10-14)
- a7ad408 - fix(stats): normalize deepseek v4.1 flash codename (#55330) (黑墨水鱼, 2026-10-14)
- 6cc58b9 - docs(go): add Gemini 4 Argon Contributor (#55314) (opencode-agent[bot], 2026-10-14)
- 165cd2e - feat(desktop): pair devices through remote access (#55306) (Luke Parker, 2026-10-14)
- 5aabb61 - fix(plugin): support Figma Git installs and dev releases (#55304) (Aiden Cline, 2026-10-13)
- def5d94 - chore(tui): revert OpenTUI 0.6 upgrade (#55300) (Aiden Cline, 2026-10-13)
- f1632d0 - fix(plugin): use public Figma endpoint and OAuth defaults (#55252) (Aiden Cline, 2026-10-13)
- f576da5 - feat(core): stabilize top-level policies config (#55297) (Aiden Cline, 2026-10-13)
- 1c28c2f - fix(app): show a steer as pending from its first frame (#55251) (Luke Parker, 2026-10-14)
- 52ba7d6 - test(app): stop partial settings mocks leaking across browser tests (#55276) (Luke Parker, 2026-10-14)
- 6dc4d4e - fix(core): give managed configuration highest precedence (#55267) (Aiden Cline, 2026-10-13)
- 6a7cedc - feat(plugin): let plugins assert permissions (#54930) (Aiden Cline, 2026-10-13)
- 89e043b - fix(plugin): resolve the figma plugin's peer from the workspace (#55269) (Luke Parker, 2026-10-14)
- 7351718 - fix(plugin): keep each Promise hook rejection on its own tool call (#55263) (Aiden Cline, 2026-10-13)
- 9de9b74 - feat(desktop): refine diff view colors (#52551) (usrnk1, 2026-10-14)
- d2cedff - docs: correct Cat Jam Free data policy (#55224) (opencode-agent[bot], 2026-10-14)
- de417ed - feat(desktop): manage provider accounts and restore Console connect intro (#54101) (usrnk1, 2026-10-13)
- 293a5ba - feat(desktop): move session unread dots into tab container (#53570) (usrnk1, 2026-10-13)
- 41f6567 - docs: use supported policy action names (#55259) (opencode-agent[bot], 2026-10-13)
- 4ea42c4 - fix(session-ui): render user message attachments above text and admit inline files (#54650) (Kit Langton, 2026-10-13)
- 43bb7ba - fix(core): let v1 npm config target built-in provider routes (#55254) (opencode-agent[bot], 2026-10-13)
- 7b33bce - feat(desktop): show session tokens and cost on the session view (#53785) (usrnk1, 2026-10-13)
- 46e4695 - fix(app): retain raw media bytes up to 256 MiB for artifact previews (#55018) (Kit Langton, 2026-10-13)
- 3ec856b - feat(desktop): refresh question composer (#54822) (usrnk1, 2026-10-14)
- 2a593c0 - fix(app): suppress missing-file toast on restored and open file tabs (#55022) (Kit Langton, 2026-10-13)
- a3f7f42 - feat(core): continue responses after output token limits (#53876) (Aiden Cline, 2026-10-13)
- 7497b89 - feat(file): add trackpad zoom and pan to image previews (#54590) (Kit Langton, 2026-10-13)
- 80d43eb - chore: update nix node_modules hashes (opencode-agent[bot], 2026-10-13)
- d0a2ce3 - feat(tui): report pending session status to the terminal (#55172) (Dax, 2026-10-13)
- 8396de1 - fix(app): retain session model choices across catalog refreshes (#54481) (Kit Langton, 2026-10-13)
- 1163e6c - fix(app): fill vertical tab hover gaps (#54866) (Kit Langton, 2026-10-13)
- 573fd29 - feat(app): cycle side-panel tabs when side panel is focused (#54899) (Kit Langton, 2026-10-13)
- 84e0955 - fix(app): close browser tabs from the address field (#54501) (Kit Langton, 2026-10-13)
- e9def88 - docs(console): remove Cat Jam Free from models privacy exceptions (#55209) (opencode-agent[bot], 2026-10-13)
- 0af756b - docs(console): show Gemini 4 Argon discount with strikethrough pricing (#55206) (opencode-agent[bot], 2026-10-13)
- 55c863d - feat(update): index artifact rollout lookups (#55202) (Aiden Cline, 2026-10-13)
- d8e31d8 - fix(server): align connect route checks (#55177) (James Long, 2026-10-13)
- a00475a - docs(console): add Gemini 4 Argon to Console models (#55196) (opencode-agent[bot], 2026-10-13)
- 7410b1c - docs(console): add Cat Jam Free to Go (#55188) (Jack, 2026-10-14)
- 23e3493 - fix(update): cache D1 reads and use partial indexes for lookups (#55109) (opencode-agent[bot], 2026-10-13)
- 82833da - refactor(console): stop stripping legacy Zen headers in proxy (#55120) (Victor Navarro, 2026-10-13)

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
- `packages/core/package.json` (+1, -1)
- `packages/core/src/config.ts` (+37, -10)
- `packages/core/src/config/normalize.ts` (+30, -14)
- `packages/core/src/managed-policy.ts` (+1, -1)
- `packages/core/src/plugin/host.ts` (+10, -0)
- `packages/core/src/plugin/provider/opencode.ts` (+24, -17)
- `packages/core/src/session/runner/llm.ts` (+34, -1)
- `packages/core/src/session/runner/publish-llm-event.ts` (+68, -15)
- `packages/core/src/session/runner/step.ts` (+5, -9)
- `packages/core/src/v1/config/migrate.ts` (+8, -2)
- `packages/core/test/config/config.test.ts` (+19, -10)
- `packages/core/test/config/normalization.test.ts` (+32, -18)
- `packages/core/test/config/policy.test.ts` (+1, -2)
- `packages/core/test/config/provider.test.ts` (+15, -0)
- `packages/core/test/fixture/policy.ts` (+1, -0)
- `packages/core/test/mcp.test.ts` (+2, -2)
- `packages/core/test/plugin/host.ts` (+1, -0)
- `packages/core/test/plugin/permission-assert.test.ts` (+91, -0)
- `packages/core/test/plugin/provider-opencode.test.ts` (+8, -3)
- `packages/core/test/session-runner.test.ts` (+250, -80)
- `packages/core/test/skill.test.ts` (+3, -3)
- `packages/stats/core/package.json` (+1, -1)
- `packages/stats/core/src/domain/inference.test.ts` (+8, -1)
- `packages/stats/core/src/domain/model-normalization.ts` (+1, -0)

#### Other Changes
- `CHANGELOG.md` (+70, -0)
- `bun.lock` (+57, -51)
- `bunfig.toml` (+1, -1)
- `nix/hashes.json` (+3, -3)
- `package.json` (+5, -4)
- `packages/ai/package.json` (+1, -1)
- `packages/app/component-tests/browser-pane-restore.spec.ts` (+109, -1)
- `packages/app/component-tests/session-question-dock.spec.ts` (+177, -9)
- `packages/app/e2e/regression/composer.spec.ts` (+134, -0)
- `packages/app/e2e/regression/review.spec.ts` (+244, -10)
- `packages/app/e2e/regression/session-queue.spec.ts` (+14, -2)
- `packages/app/e2e/regression/session-request-docks.spec.ts` (+87, -0)
- `packages/app/e2e/regression/settings.spec.ts` (+458, -0)
- `packages/app/e2e/regression/tabs.spec.ts` (+365, -32)
- `packages/app/e2e/utils/mock-api.ts` (+13, -0)
- `packages/app/e2e/utils/mock-server.ts` (+34, -9)
- `packages/app/package.json` (+4, -4)
- `packages/app/src/composer/comments.test.ts` (+2, -15)
- `packages/app/src/composer/submit.test.ts` (+19, -7)
- `packages/app/src/composer/submit.ts` (+11, -2)
- `packages/app/src/providers/connect/controller.ts` (+4, -7)
- `packages/app/src/providers/connect/dialog.tsx` (+265, -82)
- `packages/app/src/providers/connect/models.css` (+1, -3)
- `packages/app/src/providers/models/select-dialog.stories.tsx` (+1, -0)
- `packages/app/src/providers/models/select-dialog.tsx` (+38, -2)
- `packages/app/src/providers/models/selection.tsx` (+8, -12)
- `packages/app/src/runtime/extension/side-region.tsx` (+15, -2)
- `packages/app/src/runtime/i18n/en.ts` (+15, -5)
- `packages/app/src/session/commands/use-session-commands.tsx` (+53, -0)
- `packages/app/src/session/requests/session-question-dock.tsx` (+184, -191)
- `packages/app/src/session/session-screen.stories.tsx` (+23, -0)
- `packages/app/src/settings/providers/account-actions.ts` (+103, -0)
- `packages/app/src/settings/providers/account-name.tsx` (+69, -0)
- `packages/app/src/settings/providers/providers.tsx` (+135, -142)
- `packages/app/src/settings/settings.css` (+33, -15)
- `packages/app/src/shell/titlebar/tab-nav.css` (+119, -10)
- `packages/app/src/shell/titlebar/tab-nav.tsx` (+23, -5)
- `packages/app/src/shell/titlebar/tab-popover.css` (+2, -1)
- `packages/app/src/shell/titlebar/tab-popover.tsx` (+27, -7)
- `packages/app/src/shell/titlebar/titlebar.css` (+8, -0)
- `packages/app/src/workspaces/files/artifact.test.ts` (+19, -3)
- `packages/app/src/workspaces/files/artifact.ts` (+5, -6)
- `packages/app/src/workspaces/files/content-cache.ts` (+2, -2)
- `packages/app/src/workspaces/files/model.tsx` (+22, -8)
- `packages/app/src/workspaces/files/types.ts` (+1, -1)
- `packages/app/test-browser/fixtures/model-selection.ts` (+5, -4)
- `packages/app/test-browser/server-notification-state.test.ts` (+15, -5)
- `packages/cli/dev/tui.ts` (+1, -0)
- `packages/cli/package.json` (+1, -1)
- `packages/cli/src/services/update-preflight.tsx` (+4, -6)
- `packages/cli/src/ui/timeline.tsx` (+3, -4)
- `packages/client/package.json` (+1, -1)
- `packages/client/src/promise/generated/types.ts` (+5, -0)
- `packages/client/src/solid/data.ts` (+46, -12)
- `packages/client/src/solid/index.ts` (+1, -0)
- `packages/client/src/solid/usage.ts` (+22, -0)
- `packages/client/test/solid-data.test.ts` (+41, -0)
- `packages/client/test/solid-pending-status.test.ts` (+49, -0)
- `packages/client/test/solid-usage.test.ts` (+43, -0)
- `packages/codemode/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/component/go-models.ts` (+40, -9)
- `packages/console/app/src/component/go-plan-chart.css` (+8, -0)
- `packages/console/app/src/component/go-plan-chart.tsx` (+20, -5)
- `packages/console/app/src/i18n/ar.ts` (+4, -1)
- `packages/console/app/src/i18n/br.ts` (+5, -1)
- `packages/console/app/src/i18n/da.ts` (+4, -1)
- `packages/console/app/src/i18n/de.ts` (+5, -1)
- `packages/console/app/src/i18n/en.ts` (+4, -1)
- `packages/console/app/src/i18n/es.ts` (+5, -1)
- `packages/console/app/src/i18n/fr.ts` (+5, -1)
- `packages/console/app/src/i18n/it.ts` (+5, -1)
- `packages/console/app/src/i18n/ja.ts` (+4, -1)
- `packages/console/app/src/i18n/ko.ts` (+4, -1)
- `packages/console/app/src/i18n/no.ts` (+4, -1)
- `packages/console/app/src/i18n/pl.ts` (+5, -1)
- `packages/console/app/src/i18n/ru.ts` (+4, -1)
- `packages/console/app/src/i18n/th.ts` (+4, -1)
- `packages/console/app/src/i18n/tr.ts` (+5, -1)
- `packages/console/app/src/i18n/uk.ts` (+5, -1)
- `packages/console/app/src/i18n/zh.ts` (+4, -1)
- `packages/console/app/src/i18n/zht.ts` (+4, -1)
- `packages/console/app/src/lib/inference-proxy.ts` (+1, -11)
- `packages/console/app/src/routes/go/index.tsx` (+10, -4)
- `packages/console/function/package.json` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/enterprise/package.json` (+1, -1)
- `packages/function/package.json` (+1, -1)
- `packages/gui-extensions/README.md` (+68, -18)
- `packages/gui-extensions/package.json` (+1, -1)
- `packages/gui-extensions/src/browser/i18n/en.ts` (+1, -0)
- `packages/gui-extensions/src/browser/model.ts` (+2, -0)
- `packages/gui-extensions/src/browser/panel.fixture.tsx` (+108, -33)
- `packages/gui-extensions/src/browser/panel.tsx` (+5, -0)
- `packages/gui-extensions/src/browser/renderer.tsx` (+19, -0)
- `packages/gui-extensions/src/context/i18n/en.ts` (+1, -0)
- `packages/gui-extensions/src/context/indicator.tsx` (+54, -14)
- `packages/gui-extensions/src/context/tab.tsx` (+4, -2)
- `packages/gui-extensions/src/file/artifact-view.tsx` (+171, -40)
- `packages/gui-extensions/src/file/artifact.test.ts` (+15, -1)
- `packages/gui-extensions/src/file/artifact.ts` (+15, -0)
- `packages/gui-extensions/src/file/i18n/en.ts` (+1, -0)
- `packages/gui-extensions/src/file/renderer.tsx` (+3, -2)
- `packages/gui-extensions/src/pairing/contract.ts` (+10, -2)
- `packages/gui-extensions/src/pairing/i18n/en.ts` (+15, -22)
- `packages/gui-extensions/src/pairing/index.ts` (+0, -2)
- `packages/gui-extensions/src/pairing/main.ts` (+38, -0)
- `packages/gui-extensions/src/pairing/page.stories.tsx` (+15, -22)
- `packages/gui-extensions/src/pairing/page.tsx` (+169, -263)
- `packages/gui-extensions/src/pairing/remote.test.ts` (+19, -0)
- `packages/gui-extensions/src/pairing/remote.ts` (+7, -0)
- `packages/gui-extensions/src/pairing/renderer.tsx` (+8, -2)
- `packages/gui-extensions/src/pairing/routes.test.ts` (+0, -63)
- `packages/gui-extensions/src/pairing/routes.ts` (+0, -65)
- `packages/gui-extensions/src/sdk/host-apis.ts` (+5, -1)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/httpapi-codegen/package.json` (+1, -1)
- `packages/latex/package.json` (+1, -1)
- `packages/latex/src/markdown.test.ts` (+7, -15)
- `packages/merman/package.json` (+1, -1)
- `packages/merman/src/test/markdown.test.ts` (+38, -28)
- `packages/plugin-browser/package.json` (+1, -1)
- `packages/plugin/package.json` (+3, -3)
- `packages/plugin/src/effect/permission.ts` (+9, -0)
- `packages/plugin/src/permission.ts` (+14, -0)
- `packages/plugin/src/promise/adapter.ts` (+20, -8)
- `packages/plugin/src/promise/permission.ts` (+8, -0)
- `packages/plugins/figma/README.md` (+1, -1)
- `packages/plugins/figma/index.ts` (+1, -2)
- `packages/plugins/figma/package.json` (+2, -2)
- `packages/protocol/openapi.json` (+37, -0)
- `packages/protocol/package.json` (+1, -1)
- `packages/protocol/src/groups/persistent-pty.ts` (+5, -3)
- `packages/protocol/src/groups/pty.ts` (+4, -5)
- `packages/protocol/src/groups/server.ts` (+5, -4)
- `packages/schema/package.json` (+1, -1)
- `packages/schema/src/config.ts` (+4, -0)
- `packages/schema/src/config/experimental.ts` (+1, -1)
- `packages/sdk/package.json` (+1, -1)
- `packages/server/package.json` (+1, -1)
- `packages/server/src/middleware/authorization.ts` (+12, -6)
- `packages/session-ui/component-tests/session-message-projection.spec.ts` (+7, -0)
- `packages/session-ui/package.json` (+1, -1)
- `packages/session-ui/src/components/dock-prompt.stories.tsx` (+14, -4)
- `packages/session-ui/src/components/message-file.test.ts` (+6, -2)
- `packages/session-ui/src/components/message-file.ts` (+2, -2)
- `packages/session-ui/src/components/message-part.css` (+9, -347)
- `packages/session-ui/src/components/question-prompt.css` (+439, -0)
- `packages/session-ui/src/message/message-content.tsx` (+24, -9)
- `packages/session-ui/src/pierre/index.ts` (+49, -6)
- `packages/session-ui/src/styles/index.css` (+1, -0)
- `packages/simulation/package.json` (+1, -1)
- `packages/simulation/src/frontend/renderer.ts` (+3, -14)
- `packages/simulation/src/frontend/simulation.ts` (+1, -2)
- `packages/simulation/test/recording.test.ts` (+10, -19)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/server/package.json` (+1, -1)
- `packages/storybook/.storybook/main.ts` (+4, -0)
- `packages/storybook/.storybook/mocks/gui-extensions/pairing.tsx` (+26, -27)
- `packages/theme/package.json` (+1, -1)
- `packages/theme/src/tui/syntax.ts` (+4, -5)
- `packages/tui/package.json` (+3, -2)
- `packages/tui/src/app.tsx` (+13, -19)
- `packages/tui/src/component/fade-in-text.tsx` (+2, -2)
- `packages/tui/src/component/masked-text.ts` (+28, -31)
- `packages/tui/src/component/one-cell-spinner.tsx` (+3, -1)
- `packages/tui/src/component/patch-diff.tsx` (+1, -2)
- `packages/tui/src/component/prompt/autocomplete.tsx` (+11, -18)
- `packages/tui/src/component/prompt/index.tsx` (+18, -22)
- `packages/tui/src/component/register-spinner.ts` (+6, -0)
- `packages/tui/src/component/retry-provider.tsx` (+8, -6)
- `packages/tui/src/component/session-tabs.tsx` (+3, -1)
- `packages/tui/src/component/shimmer-text.tsx` (+1, -1)
- `packages/tui/src/component/spinner-renderable.ts` (+0, -158)
- `packages/tui/src/component/spinner.tsx` (+3, -1)
- `packages/tui/src/component/title-shimmer.tsx` (+74, -82)
- `packages/tui/src/context/theme.tsx` (+1, -1)
- `packages/tui/src/editor.ts` (+5, -2)
- `packages/tui/src/feature-plugins/system/diff-viewer-file-tree.tsx` (+1, -3)
- `packages/tui/src/feature-plugins/system/diff-viewer.tsx` (+4, -4)
- `packages/tui/src/mini/footer.form.tsx` (+4, -5)
- `packages/tui/src/mini/footer.permission.tsx` (+3, -4)
- `packages/tui/src/mini/footer.prompt.tsx` (+28, -22)
- `packages/tui/src/mini/footer.subagent.tsx` (+3, -1)
- `packages/tui/src/mini/footer.ts` (+1, -5)
- `packages/tui/src/mini/footer.view.tsx` (+4, -4)
- `packages/tui/src/mini/mono.ts` (+15, -16)
- `packages/tui/src/mini/prompt.editor.ts` (+1, -7)
- `packages/tui/src/mini/prompt.shared.ts` (+10, -15)
- `packages/tui/src/mini/runtime.lifecycle.ts` (+7, -11)
- `packages/tui/src/mini/scrollback.shared.ts` (+7, -3)
- `packages/tui/src/mini/scrollback.surface.ts` (+4, -16)
- `packages/tui/src/mini/scrollback.writer.tsx` (+10, -27)
- `packages/tui/src/mini/theme.ts` (+1, -6)
- `packages/tui/src/prompt/directory-completion.ts` (+5, -4)
- `packages/tui/src/prompt/display.ts` (+39, -19)
- `packages/tui/src/prompt/history.tsx` (+4, -4)
- `packages/tui/src/prompt/mention.ts` (+17, -25)
- `packages/tui/src/prompt/part.ts` (+3, -15)
- `packages/tui/src/routes/session/composer/subagents-tab.tsx` (+1, -3)
- `packages/tui/src/routes/session/group-view.tsx` (+1, -4)
- `packages/tui/src/routes/session/index.tsx` (+5, -11)
- `packages/tui/src/routes/session/message-parts.tsx` (+2, -5)
- `packages/tui/src/routes/session/thinking-syntax.ts` (+2, -3)
- `packages/tui/src/ui/spinner.ts` (+1, -1)
- `packages/tui/src/util/renderer.ts` (+3, -11)
- `packages/tui/src/util/session.ts` (+2, -14)
- `packages/tui/test/app-lifecycle.test.tsx` (+10, -42)
- `packages/tui/test/cli/tui/diff-viewer.test.tsx` (+2, -6)
- `packages/tui/test/compact-admission.test.tsx` (+2, -4)
- `packages/tui/test/completion-notices.test.tsx` (+2, -4)
- `packages/tui/test/component/retry-provider.test.tsx` (+3, -5)
- `packages/tui/test/component/shimmer-text.test.tsx` (+0, -37)
- `packages/tui/test/component/spinner-renderable.test.tsx` (+0, -132)
- `packages/tui/test/copy-session-id.test.tsx` (+1, -2)
- `packages/tui/test/editor.test.ts` (+7, -27)
- `packages/tui/test/fixture/app.ts` (+7, -11)
- `packages/tui/test/markdown-streaming.test.tsx` (+10, -22)
- `packages/tui/test/mini/footer.test.ts` (+1, -2)
- `packages/tui/test/mini/footer.view.test.tsx` (+8, -56)
- `packages/tui/test/mini/prompt.editor.test.ts` (+7, -9)
- `packages/tui/test/mini/prompt.shared.test.ts` (+57, -27)
- `packages/tui/test/mini/scrollback.surface.test.ts` (+8, -57)
- `packages/tui/test/mini/theme.test.ts` (+0, -18)
- `packages/tui/test/new-session-id.test.tsx` (+1, -3)
- `packages/tui/test/plugin-markdown.test.tsx` (+4, -4)
- `packages/tui/test/prompt-offset.test.tsx` (+0, -58)
- `packages/tui/test/prompt-paste.test.tsx` (+0, -16)
- `packages/tui/test/prompt/autocomplete.test.ts` (+16, -11)
- `packages/tui/test/prompt/display.test.ts` (+37, -66)
- `packages/tui/test/prompt/history.test.ts` (+8, -12)
- `packages/tui/test/prompt/mention.test.ts` (+14, -22)
- `packages/tui/test/prompt/part.test.ts` (+28, -17)
- `packages/tui/test/session-activity-anchor.test.tsx` (+1, -2)
- `packages/tui/test/session-backfill-disclosure.test.tsx` (+1, -2)
- `packages/tui/test/session-group-navigation.test.tsx` (+1, -2)
- `packages/tui/test/session-home.test.tsx` (+1, -2)
- `packages/tui/test/session-mount-budget.test.tsx` (+1, -2)
- `packages/tui/test/session-terminal-availability.test.tsx` (+1, -2)
- `packages/tui/test/session-wheel-focus.test.tsx` (+1, -2)
- `packages/tui/test/stats.view.test.tsx` (+1, -2)
- `packages/tui/test/theme/v2/resolve.test.ts` (+5, -10)
- `packages/tui/test/ui/link.test.tsx` (+1, -3)
- `packages/tui/test/util/renderer.test.ts` (+13, -19)
- `packages/tui/test/util/selection-keys.test.ts` (+1, -0)
- `packages/tui/test/util/session.test.ts` (+1, -39)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/actions/button/button.css` (+260, -243)
- `packages/ui/src/actions/icon-button/icon-button.css` (+125, -117)
- `packages/ui/src/actions/submit.css` (+58, -53)
- `packages/ui/src/context/dialog.tsx` (+3, -0)
- `packages/ui/src/data-display/badge/badge.css` (+5, -0)
- `packages/ui/src/data-display/badge/badge.stories.tsx` (+10, -1)
- `packages/ui/src/data-display/badge/badge.tsx` (+1, -1)
- `packages/ui/src/forms/text-input/text-input.css` (+185, -180)
- `packages/ui/src/i18n/en.ts` (+1, -0)
- `packages/util/package.json` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `script/upgrade-opentui.ts` (+35, -1)
- `sdks/vscode/package.json` (+1, -1)
- `services/update/migrations/0005_artifact_rollout.sql` (+2, -0)
- `services/update/package.json` (+1, -1)
- `services/update/src/index.ts` (+61, -18)
- `services/update/test/index.test.ts` (+125, -2)
- `services/www/openapi.json` (+37, -0)
- `services/www/public/openapi.json` (+37, -0)
- `services/www/src/docs/content/config.mdx` (+22, -20)
- `services/www/src/docs/content/console/go.mdx` (+193, -198)
- `services/www/src/docs/content/console/models.mdx` (+5, -7)
- `services/www/src/docs/content/migrate-v1.mdx` (+5, -5)
- `services/www/src/docs/content/permissions.mdx` (+1, -3)
- `services/www/src/docs/content/policies.mdx` (+67, -47)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index d03f0fc..c249782 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "2.0.28",
+  "version": "2.0.29",
   "name": "@opencode/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/config.ts
```diff
diff --git a/packages/core/src/config.ts b/packages/core/src/config.ts
index 2c6546f..7945384 100644
--- a/packages/core/src/config.ts
+++ b/packages/core/src/config.ts
@@ -241,16 +241,33 @@ export const layer = (options?: Options) =>
               )
             : []
 
-        // System entries sit at lowest priority so users and projects can
-        // override ordinary defaults while reversed policy evaluation gives
-        // system policies highest file-based authority. Global entries sit
-        // below explicit and direct files; project directories rank above them.
-        // MDM preferences rank below the system directory so their policies
-        // carry the most file-based authority, matching V1 where they won.
-        const systemSupplementary = [
-          ...(sources.preferences ? yield* loadPreferences(sources.preferences).pipe(Effect.orDie) : []),
+        // Managed settings load last so they override everything, and MDM
+        // preferences outrank the system directory as in V1. Policies evaluate
+        // in reverse load order, so managed policies split off and load first
+        // to keep final file-based authority.
+        const managed = [
           ...(sources.system?.present ? yield* loadDirectory(sources.system.path).pipe(Effect.orDie) : []),
+          ...(sources.preferences ? yield* loadPreferences(sources.preferences).pipe(Effect.orDie) : []),
         ]
+        const managedPolicies = managed
+          .flatMap((entry) =>
+            entry.type === "document" && entry.info.policies
+              ? [
+                  new Document({
+                    type: "document",
+                    path: entry.path,
+                    info: new Info({ policies: entry.info.policies }),
+                  }),
+                ]
+              : [],
+          )
+          .toReversed()
+        const managedSettings = managed.map((entry) =>
+          entry.type === "document" && entry.info.policies
+            ? new Document({ ...entry, info: new Info({ ...entry.info, policies: undefined }) })
+            : entry,
+        )
+        // Global entries sit below explicit and direct files; project directories rank above them.
         const globalSupplementary = sources.global ? yield* loadDirectory(sources.global).pipe(Effect.orDie) : []
         const projectSupplementary = yield* Effect.forEach(
           sources.project.filter((root) => root.present),
@@ -260,13 +277,14 @@ export const layer = (options?: Options) =>
           Effect.map((entries) => entries.flat()),
         )
         return [
```

#### packages/core/src/config/normalize.ts
```diff
diff --git a/packages/core/src/config/normalize.ts b/packages/core/src/config/normalize.ts
index dd3fb59..4b0709a 100644
--- a/packages/core/src/config/normalize.ts
+++ b/packages/core/src/config/normalize.ts
@@ -192,6 +192,7 @@ export function normalize(input: unknown): Result {
   normalizeSkills(input, encoded, diagnostics)
   normalizeMcp(input, encoded, diagnostics)
   normalizeCompaction(input, encoded, diagnostics)
+  normalizePolicies(input, encoded, diagnostics)
   normalizeExperimental(input, encoded, diagnostics)
   normalizeWatcher(input, encoded, diagnostics)
   normalizeFormatter(input, encoded, diagnostics)
@@ -378,12 +379,13 @@ function normalizeCompaction(
   if (Object.keys(result).length || !Object.keys(input.compaction).length) encoded.compaction = result
 }
 
-function normalizeExperimental(
+// V1 provider lists and `experimental.policies` stay supported and merge into
+// top-level `policies`; within a document, later sources win ties.
+function normalizePolicies(
   input: Record<string, unknown>,
   encoded: Record<string, unknown>,
   diagnostics: Diagnostic[],
 ) {
-  const result: Record<string, unknown> = {}
   const generated: unknown[] = []
   const enabled = decodeProviderList(input, "enabled_providers", diagnostics)
   if (enabled.present && (!enabled.nonEmpty || enabled.values.length)) {
@@ -404,7 +406,32 @@ function normalizeExperimental(
       effect: "deny",
     })),
   )
-  const native: unknown[] = []
+  const experimental = isRecord(input.experimental)
+    ? decodeList(
+        input.experimental.policies,
+        ConfigPolicy.Info,
+        ["experimental", "policies"],
+        diagnostics,
+        decodeEncoded,
+      )
+    : []
+  const native = decodeList(input.policies, ConfigPolicy.Info, ["policies"], diagnostics, decodeEncoded)
+  if (
+    generated.length ||
+    experimental.length ||
+    native.length ||
+    Array.isArray(input.policies) ||
+    (isRecord(input.experimental) && Array.isArray(input.experimental.policies))
+  )
```

#### packages/core/src/managed-policy.ts
```diff
diff --git a/packages/core/src/managed-policy.ts b/packages/core/src/managed-policy.ts
index 0813a49..ad595c2 100644
--- a/packages/core/src/managed-policy.ts
+++ b/packages/core/src/managed-policy.ts
@@ -52,7 +52,7 @@ export function statements(entries: readonly Entry[], organization: State) {
     ...entries
       .filter((entry): entry is Document => entry.type === "document")
       .toReversed()
-      .flatMap((entry) => entry.info.experimental?.policies ?? [])
+      .flatMap((entry) => entry.info.policies ?? [])
       .map((policy) => ({ ...policy, message: "Blocked by configuration policy" })),
     ...organization.statements.map((policy) => ({
       ...policy,
```

#### packages/core/src/plugin/host.ts
```diff
diff --git a/packages/core/src/plugin/host.ts b/packages/core/src/plugin/host.ts
index 7477c16..8d40da4 100644
--- a/packages/core/src/plugin/host.ts
+++ b/packages/core/src/plugin/host.ts
@@ -434,6 +434,16 @@ export const make = Effect.fn("PluginHost.make")(function* (
                 : Effect.fail(new Error(`Permission request not found: ${input.requestID}`)),
             ),
           ),
+      // Plain rejections stay defects, as for built-in tools, so they end the step.
+      assert: (input) =>
+        permission.assert(input).pipe(
+          Effect.catchTags({
+            "Permission.BlockedError": (error) => Effect.fail(new Tool.Error({ message: error.message, error })),
+            "Permission.CorrectedError": (error) => Effect.fail(new Tool.Error({ message: error.feedback, error })),
+            "Session.NotFoundError": (error) =>
+              Effect.fail(new Tool.Error({ message: `Session not found: ${error.sessionID}`, error })),
+          }),
+        ),
     },
     plugin: {
       list: () => response(plugin.list()),
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/src/kilocode/ripgrep-glob.ts
- `src/core/` - review core changes from packages/core/src/ripgrep.ts
- `src/core/` - review core changes from packages/core/test/kilocode/ripgrep-glob.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/ripgrep-settlement.test.ts
- `src/tool/EditToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt changes
- `src/tool/ShellToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt changes
- `src/tool/ToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolView.kt changes
- `src/tool/glob-ignored.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/glob-ignored.test.ts changes
- `src/tool/glob-ignored.ts` - update based on kilocode packages/opencode/src/kilocode/tool/glob-ignored.ts changes
