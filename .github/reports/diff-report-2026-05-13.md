# Upstream Changes Report
Generated: 2026-05-13 08:45:54

## Summary
- kilocode: 34 commits, 57 files changed
- opencode: 0 commits, 0 files changed

## kilocode Changes (64e45eaba..174d467a4)

### Commits

- 174d467a4 - fix(agent-manager): exclude local state on startup (#10196) (Marius, 2026-05-13)
- edf91229a - Merge pull request #8349 from mmospanenko/feature/7507-context (Catriel Müller, 2026-05-13)
- b04e1a113 - fix: kilocode markers (Catriel Müller, 2026-05-13)
- 628166403 - fix: md scalar (Catriel Müller, 2026-05-13)
- 5b61045de - refactor: add kilocode markers (Catriel Müller, 2026-05-13)
- 2d5f6f347 - refactor: rebase from main (Catriel Müller, 2026-05-13)
- 109d59a31 - refactor: add support for all markdown files (Catriel Müller, 2026-05-12)
- 8d23e1714 - refactor: isolate kilochange (Catriel Müller, 2026-05-12)
- 3ca9941bb - feat(config): add `escapeJson` parameter to `substitute` for raw content handling (Maksym Mospanenko, 2026-05-12)
- 80edeee58 - feat(config): add {file:...} syntax support for agent markdown prompts (Maksym Mospanenko, 2026-05-12)
- 55abf13cf - Merge pull request #10095 from Kilo-Org/ionized-emmental (Kirill Kalishev, 2026-05-12)
- 8ab58a66f - chore: remove unused electron trusted dependency (#10186) (Imanol Maiztegui, 2026-05-12)
- feb8d5a09 - Merge pull request #10185 from Kilo-Org/docs/seo-title-tags-automate-tools (Rietie, 2026-05-12)
- 57fbfe798 - Apply suggestions from code review (Rietie, 2026-05-12)
- 3c34488cb - docs: add SEO title and description frontmatter to automate tools pages (kiloconnect[bot], 2026-05-12)
- cf6eedd58 - Merge pull request #8754 from shssoichiro/issue-7861 (Catriel Müller, 2026-05-12)
- b255d1085 - fix(config): remove unused trusted dependencies from package.json (#10184) (Imanol Maiztegui, 2026-05-12)
- 6f34cadc8 - Add minimum release age to bun install config (#10182) (Imanol Maiztegui, 2026-05-12)
- 305ec5c10 - Merge branch 'main' into issue-7861 (Catriel Müller, 2026-05-12)
- cc71a0dce - Merge pull request #10026 from Kilo-Org/mark/restore-root-package-json-entries (Mark IJbema, 2026-05-12)
- af902eb35 - fix: catch EEXIST from recursive mkdir on Windows (#9794) (nimgrim, 2026-05-12)
- 3ea3a1667 - Merge pull request #10157 from ScuttleBot/docs/update-2026-05-11 (Joshua Lambert, 2026-05-12)
- 93666cc58 - docs: add DeepSeek to BYOK providers, update default model to free (scuttlebot, 2026-05-11)
- db097e44d - Merge branch 'main' into ionized-emmental (Kirill Kalishev, 2026-05-11)
- 9c554f033 - Merge branch 'main' into ionized-emmental (Kirill Kalishev, 2026-05-11)
- 940a1d2a5 - Merge branch 'main' into ionized-emmental (Kirill Kalishev, 2026-05-10)
- 931b80306 - test(cli): update QuestionOption wire-shape snapshot to include mode field (kirillk, 2026-05-09)
- c7fa82766 - test(cli): add contract tests for QuestionOption Kilo-specific fields (kirillk, 2026-05-09)
- f449375e0 - fix: split kilocode_change markers for mode field in QuestionOption (kirillk, 2026-05-09)
- b539c6920 - fix(vscode): add mode field to plan follow-up Continue here option so picker updates instantly (kirillk, 2026-05-09)
- c08ff0c8f - Merge branch 'main' into ionized-emmental (Kirill Kalishev, 2026-05-09)
- 710c9dca1 - fix(vscode): sync mode model selection (kirillk, 2026-05-09)
- 681838bb7 - fix: restore root package.json entries dropped by upstream-compat (kiloconnect[bot], 2026-05-07)
- e498c02f7 - ux(cli): visually show when applied patch skips sections (Josh Holmer, 2026-05-04)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap` (+4, -0)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/src/filesystem.ts` (+34, -2)

#### Other Changes
- `.changeset/agent-manager-state-exclude.md` (+5, -0)
- `.changeset/fix-tui-diff-hunk-headers.md` (+6, -0)
- `.changeset/vscode-mode-model-sync.md` (+5, -0)
- `bun.lock` (+0, -7)
- `bunfig.toml` (+1, -0)
- `package.json` (+0, -10)
- `packages/kilo-docs/pages/automate/tools/access-mcp-resource.md` (+5, -0)
- `packages/kilo-docs/pages/automate/tools/apply-diff.md` (+5, -0)
- `packages/kilo-docs/pages/automate/tools/ask-followup-question.md` (+5, -0)
- `packages/kilo-docs/pages/automate/tools/attempt-completion.md` (+5, -0)
- `packages/kilo-docs/pages/automate/tools/browser-action.md` (+5, -0)
- `packages/kilo-docs/pages/automate/tools/delete-file.md` (+5, -0)
- `packages/kilo-docs/pages/automate/tools/execute-command.md` (+5, -0)
- `packages/kilo-docs/pages/automate/tools/list-code-definition-names.md` (+5, -0)
- `packages/kilo-docs/pages/automate/tools/list-files.md` (+5, -0)
- `packages/kilo-docs/pages/automate/tools/new-task.md` (+5, -0)
- `packages/kilo-docs/pages/automate/tools/read-file.md` (+5, -0)
- `packages/kilo-docs/pages/automate/tools/search-files.md` (+5, -0)
- `packages/kilo-docs/pages/automate/tools/semantic-search.md` (+5, -0)
- `packages/kilo-docs/pages/automate/tools/switch-mode.md` (+5, -0)
- `packages/kilo-docs/pages/automate/tools/update-todo-list.md` (+5, -0)
- `packages/kilo-docs/pages/automate/tools/use-mcp-tool.md` (+5, -0)
- `packages/kilo-docs/pages/automate/tools/write-to-file.md` (+5, -0)
- `packages/kilo-docs/pages/contributing/architecture/auto-model-tiers.md` (+3, -4)
- `packages/kilo-docs/pages/getting-started/byok.md` (+1, -0)
- `packages/kilo-docs/source-links.md` (+5, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+12, -3)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+7, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+10, -0)
- `packages/kilo-vscode/tests/unit/question-dock-utils.test.ts` (+61, -0)
- `packages/kilo-vscode/tests/unit/session-model-store.test.ts` (+72, -0)
- `packages/kilo-vscode/tests/unit/worktree-manager.test.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+30, -15)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+70, -40)
- `packages/opencode/src/cli/cmd/tui/routes/session/permission.tsx` (+34, -19)
- `packages/opencode/src/config/agent.ts` (+13, -1)
- `packages/opencode/src/config/markdown.ts` (+24, -6)
- `packages/opencode/src/config/variable.ts` (+3, -1)
- `packages/opencode/src/kilocode/config/markdown.ts` (+38, -0)
- `packages/opencode/src/kilocode/encoding.ts` (+22, -1)
- `packages/opencode/src/kilocode/plan-followup.ts` (+1, -0)
- `packages/opencode/src/kilocode/session/instruction.ts` (+7, -0)
- `packages/opencode/src/kilocode/tui/diff.ts` (+79, -0)
- `packages/opencode/src/kilocode/workflows-migrator.ts` (+2, -1)
- `packages/opencode/src/question/index.ts` (+6, -0)
- `packages/opencode/src/session/instruction.ts` (+3, -1)
- `packages/opencode/test/kilocode/config/config.test.ts` (+26, -4)
- `packages/opencode/test/kilocode/encoding.test.ts` (+23, -0)
- `packages/opencode/test/kilocode/plan-followup.test.ts` (+28, -0)
- `packages/opencode/test/kilocode/question-option-schema.test.ts` (+70, -0)
- `packages/opencode/test/kilocode/session/instruction-substitution.test.ts` (+76, -0)
- `packages/opencode/test/kilocode/tui-diff.test.ts` (+91, -0)
- `packages/opencode/test/kilocode/workflows-migrator.test.ts` (+23, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+4, -0)
- `packages/sdk/openapi.json` (+4, -0)

### Key Diffs

#### packages/core/src/filesystem.ts
```diff
diff --git a/packages/core/src/filesystem.ts b/packages/core/src/filesystem.ts
index 8faaf95f7..bc149d586 100644
--- a/packages/core/src/filesystem.ts
+++ b/packages/core/src/filesystem.ts
@@ -7,6 +7,28 @@ import { Effect, FileSystem, Layer, Schema, Context } from "effect"
 import type { PlatformError } from "effect/PlatformError"
 import { Glob } from "./util/glob"
 
+// kilocode_change start - Windows-resilient mkdir -p.
+// fs.mkdir(dir, { recursive: true }) should be idempotent, but on Windows
+// with NTFS reparse points (OneDrive), directory junctions, or WSL-served
+// paths, libuv can still throw EEXIST. This wrapper catches that specific
+// error so callers get the promised directory-exists semantics.
+//
+//   https://github.com/Kilo-Org/kilocode/issues/9618
+//   https://github.com/Kilo-Org/kilocode/issues/9755
+function isEexist(err: unknown): boolean {
+  return typeof err === "object" && err !== null && "code" in err && (err as NodeJS.ErrnoException).code === "EEXIST"
+}
+
+async function mkdirSafe(dir: string): Promise<void> {
+  try {
+    await NFS.mkdir(dir, { recursive: true })
+  } catch (err: unknown) {
+    if (isEexist(err)) return
+    throw err
+  }
+}
+// kilocode_change end
+
 export namespace AppFileSystem {
   export class FileSystemError extends Schema.TaggedErrorClass<FileSystemError>()("FileSystemError", {
     method: Schema.String,
@@ -84,7 +106,12 @@ export namespace AppFileSystem {
       })
 
       const ensureDir = Effect.fn("FileSystem.ensureDir")(function* (path: string) {
-        yield* fs.makeDirectory(path, { recursive: true })
+        // kilocode_change start - use mkdirSafe to tolerate Windows EEXIST
+        yield* Effect.tryPromise({
+          try: () => mkdirSafe(path),
+          catch: (cause) => new FileSystemError({ method: "ensureDir", cause }),
+        })
+        // kilocode_change end
       })
 
       const writeWithDirs = Effect.fn("FileSystem.writeWithDirs")(function* (
@@ -99,7 +126,12 @@ export namespace AppFileSystem {
             (e) => e.reason._tag === "NotFound",
             () =>
```

#### packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap
```diff
diff --git a/packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap b/packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap
index 359d2bf94..4445eb305 100644
--- a/packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap
+++ b/packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap
@@ -250,6 +250,10 @@ exports[`tool parameters JSON Schema (wire shape) question 1`] = `
                   "description": "Optional i18n key for the label; clients translate and still reply with \`label\`",
                   "type": "string",
                 },
+                "mode": {
+                  "description": "Optional agent/mode name to pre-select in the UI when this option is picked",
+                  "type": "string",
+                },
               },
               "ref": "QuestionOption",
               "required": [
```


## opencode Changes (caf1151..b0dc8e4)

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

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/src/filesystem.ts
- `src/tool/parameters.test.ts.snap.ts` - update based on kilocode packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap changes
