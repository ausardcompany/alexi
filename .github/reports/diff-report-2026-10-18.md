# Upstream Changes Report
Generated: 2026-10-18 10:30:55

## Summary
- kilocode: 2 commits, 1 files changed
- opencode: 33 commits, 199 files changed

## kilocode Changes (1552877e8..2a1903f29)

### Commits

- 2a1903f29 - Merge pull request #15188 from Kilo-Org/chore/jetbrains-cli-pin-v7.8.14 (Kirill Kalishev, 2026-10-17)
- 08687cc77 - chore(jetbrains): bump CLI pin to v7.8.14 (kilo-maintainer[bot], 2026-10-16)

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
- `packages/kilo-jetbrains/package.json` (+1, -1)

### Key Diffs

(no key diffs to show)

## opencode Changes (22e771f..214fb7f)

### Commits

- 214fb7f - docs(console): add harness setup guides (#56364) (Victor Navarro, 2026-10-18)
- 60a5a6c - fix(ai): treat null Responses stream fields as absent (#56669) (Aiden Cline, 2026-10-18)
- 63c1a27 - fix(core): tolerate sandboxed filesystem denials during location boot (#55817) (Aiden Cline, 2026-10-17)
- 49e9786 - fix(core): bound skill discovery and watches (#55597) (Aiden Cline, 2026-10-17)
- c38d83c - fix(protocol): accept idle in the message type filter (#56504) (Aiden Cline, 2026-10-17)
- 3bdab63 - fix(core): report shell exit only after output is captured (#56321) (Aiden Cline, 2026-10-17)
- 3099ec2 - chore(console): retire the Black pages and redirect them to Go (#56612) (Kit Langton, 2026-10-17)
- 4745089 - chore(core): refresh bundled models.dev snapshot (opencode-agent[bot], 2026-10-18)
- e4b2afc - fix(www): scroll wide docs tables and label the docs search (#56592) (Kit Langton, 2026-10-17)
- a124688 - fix(console): fix marketing copy, stale stats and redirected links (#56589) (Kit Langton, 2026-10-17)
- 0168c62 - fix(console): redirect /en URLs to the unprefixed English pages (#56593) (Kit Langton, 2026-10-17)
- a416379 - fix(console): make the mobile menu and copy buttons keyboard accessible (#56591) (Kit Langton, 2026-10-17)
- 49be0c5 - docs(www): fix contradictions and typos in the v2 docs (#56588) (Kit Langton, 2026-10-17)
- 797d2af - perf(console): load only the IBM Plex Mono faces the site uses (#56595) (Kit Langton, 2026-10-17)
- eb9351c - feat(console): redirect /llms.txt to the docs index (#56594) (Kit Langton, 2026-10-17)
- 3a96edc - fix(console): show an error when newsletter signup fails (#56587) (Kit Langton, 2026-10-17)
- 8f7b012 - docs(www): format yield* in Effect snippets (#56568) (Kit Langton, 2026-10-17)
- fd7bb3b - chore(console): remove the unused /temp page (#56566) (Kit Langton, 2026-10-17)
- 736d2fe - fix(console): give marketing pages complete social preview tags (#56565) (Kit Langton, 2026-10-17)
- 3921f77 - fix(console): take the page language from the URL only (#56564) (Kit Langton, 2026-10-17)
- c78b6ee - fix: add v2 docs to the sitemap and fix its broken entries (#56534) (Kit Langton, 2026-10-17)
- cbbfd22 - test(app): fix races in the mobile timeline scroll e2e tests (#55881) (Filip, 2026-10-18)
- 579b86f - docs(console): align card fee and billing wording with the billing page (#56532) (Kit Langton, 2026-10-17)
- 9d97a5b - fix(console): send localized changelog URLs to the changelog worker (#56531) (Kit Langton, 2026-10-17)
- 53cd745 - fix(console): render FAQ answers in the server HTML (#56535) (Kit Langton, 2026-10-17)
- 657c566 - fix(console): give each marketing page a single meta description (#56533) (Kit Langton, 2026-10-17)
- 07e7254 - fix(console): link header GitHub item to the repository root (#56529) (Kit Langton, 2026-10-17)
- 594af42 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-10-17)
- 23359e9 - chore: upgrade typecheck to TypeScript 7.0.2 (#56300) (opencode-agent[bot], 2026-10-17)
- 86c7f7c - fix(core): retry buffered generations with shared policy (#56497) (Aiden Cline, 2026-10-17)
- 8c173a8 - chore(core): refresh bundled models.dev snapshot (opencode-agent[bot], 2026-10-17)
- a49f179 - chore(infra): remove honeycomb and random providers (#56370) (Victor Navarro, 2026-10-17)
- a801306 - chore(infra): remove dead honeycomb monitoring and log processor (#56226) (Victor Navarro, 2026-10-17)

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
- `packages/core/src/config/plugin/compatibility.ts` (+5, -5)
- `packages/core/src/config/plugin/instruction.ts` (+14, -6)
- `packages/core/src/config/plugin/skill-scan.ts` (+46, -0)
- `packages/core/src/config/plugin/skill.ts` (+6, -6)
- `packages/core/src/config/watch.ts` (+1, -1)
- `packages/core/src/database/migration.ts` (+3, -1)
- `packages/core/src/filesystem.ts` (+3, -8)
- `packages/core/src/generate.ts` (+2, -0)
- `packages/core/src/model-retry.ts` (+73, -0)
- `packages/core/src/models-dev/snapshot.txt` (+1, -1)
- `packages/core/src/session/generate.ts` (+2, -1)
- `packages/core/src/session/runner/retry.ts` (+10, -47)
- `packages/core/src/shell.ts` (+64, -50)
- `packages/core/src/skill.ts` (+8, -2)
- `packages/core/test/config/config.test.ts` (+37, -1)
- `packages/core/test/config/skill.test.ts` (+7, -6)
- `packages/core/test/config/watch.test.ts` (+3, -2)
- `packages/core/test/generate.test.ts` (+101, -2)
- `packages/core/test/instruction-discovery.test.ts` (+43, -2)
- `packages/core/test/session-generate.test.ts` (+38, -1)
- `packages/core/test/session-runner-retry.test.ts` (+1, -1)
- `packages/core/test/util/fs-util.test.ts` (+50, -0)
- `packages/core/tsconfig.json` (+1, -0)
- `packages/core/tsconfig.tests.json` (+1, -0)
- `packages/stats/core/package.json` (+2, -2)

#### Other Changes
- `.github/workflows/deploy.yml` (+0, -1)
- `bun.lock` (+73, -63)
- `infra/console.ts` (+0, -10)
- `infra/monitoring.ts` (+0, -287)
- `infra/secret.ts` (+0, -10)
- `nix/hashes.json` (+3, -3)
- `package.json` (+4, -3)
- `packages/ai/package.json` (+2, -2)
- `packages/ai/src/protocols/open-responses.ts` (+32, -25)
- `packages/ai/src/protocols/shared.ts` (+12, -1)
- `packages/ai/test/provider/openai-compatible-responses.test.ts` (+47, -7)
- `packages/ai/tsconfig.json` (+1, -0)
- `packages/app/e2e/regression/mobile-timeline-scroll.spec.ts` (+34, -6)
- `packages/app/e2e/tsconfig.json` (+1, -1)
- `packages/app/e2e/utils/prompt-motion.ts` (+16, -6)
- `packages/app/package.json` (+3, -3)
- `packages/app/tsconfig.json` (+2, -0)
- `packages/cli/package.json` (+2, -2)
- `packages/cli/src/server-process.ts` (+5, -1)
- `packages/cli/tsconfig.json` (+1, -0)
- `packages/client/package.json` (+2, -2)
- `packages/client/src/effect/api/api.ts` (+1, -0)
- `packages/client/src/promise/generated/types.ts` (+4, -0)
- `packages/client/tsconfig.json` (+1, -0)
- `packages/codemode/package.json` (+2, -2)
- `packages/codemode/tsconfig.json` (+1, -0)
- `packages/console/app/package.json` (+2, -2)
- `packages/console/app/public/robots.txt` (+1, -0)
- `packages/console/app/script/generate-sitemap.ts` (+9, -3)
- `packages/console/app/src/app.tsx` (+9, -5)
- `packages/console/app/src/asset/lander/screenshot-splash.png` (+-, --)
- `packages/console/app/src/component/email-signup.tsx` (+17, -7)
- `packages/console/app/src/component/faq.tsx` (+1, -1)
- `packages/console/app/src/component/go-plan-chart.tsx` (+1, -1)
- `packages/console/app/src/component/header.tsx` (+16, -3)
- `packages/console/app/src/component/limits-graph.tsx` (+1, -1)
- `packages/console/app/src/component/social-meta.tsx` (+23, -0)
- `packages/console/app/src/component/spotlight.css` (+0, -15)
- `packages/console/app/src/component/spotlight.tsx` (+0, -820)
- `packages/console/app/src/config.ts` (+3, -3)
- `packages/console/app/src/context/language.tsx` (+2, -2)
- `packages/console/app/src/entry-server.tsx` (+2, -4)
- `packages/console/app/src/i18n/ar.ts` (+1, -43)
- `packages/console/app/src/i18n/br.ts` (+1, -43)
- `packages/console/app/src/i18n/da.ts` (+1, -43)
- `packages/console/app/src/i18n/de.ts` (+1, -43)
- `packages/console/app/src/i18n/en.ts` (+17, -59)
- `packages/console/app/src/i18n/es.ts` (+1, -43)
- `packages/console/app/src/i18n/fr.ts` (+1, -44)
- `packages/console/app/src/i18n/it.ts` (+1, -45)
- `packages/console/app/src/i18n/ja.ts` (+1, -43)
- `packages/console/app/src/i18n/ko.ts` (+1, -43)
- `packages/console/app/src/i18n/no.ts` (+1, -43)
- `packages/console/app/src/i18n/pl.ts` (+1, -43)
- `packages/console/app/src/i18n/ru.ts` (+1, -44)
- `packages/console/app/src/i18n/th.ts` (+1, -43)
- `packages/console/app/src/i18n/tr.ts` (+1, -43)
- `packages/console/app/src/i18n/uk.ts` (+1, -43)
- `packages/console/app/src/i18n/zh.ts` (+1, -43)
- `packages/console/app/src/i18n/zht.ts` (+1, -43)
- `packages/console/app/src/lib/language.ts` (+15, -1)
- `packages/console/app/src/middleware.ts` (+18, -0)
- `packages/console/app/src/routes/black.css` (+0, -843)
- `packages/console/app/src/routes/black.tsx` (+0, -283)
- `packages/console/app/src/routes/black/common.tsx` (+0, -65)
- `packages/console/app/src/routes/black/index.tsx` (+0, -122)
- `packages/console/app/src/routes/black/workspace.css` (+0, -214)
- `packages/console/app/src/routes/black/workspace.tsx` (+0, -238)
- `packages/console/app/src/routes/brand/index.css` (+2, -1)
- `packages/console/app/src/routes/brand/index.tsx` (+2, -0)
- `packages/console/app/src/routes/changelog/index.tsx` (+0, -2)
- `packages/console/app/src/routes/docs/[...path].ts` (+3, -5)
- `packages/console/app/src/routes/docs/index.ts` (+3, -5)
- `packages/console/app/src/routes/download/index.css` (+2, -1)
- `packages/console/app/src/routes/download/index.tsx` (+2, -0)
- `packages/console/app/src/routes/enterprise/index.tsx` (+2, -0)
- `packages/console/app/src/routes/go/index.tsx` (+9, -25)
- `packages/console/app/src/routes/honeycomb/webhook.ts` (+0, -111)
- `packages/console/app/src/routes/index.tsx` (+20, -6)
- `packages/console/app/src/routes/llms.txt.ts` (+4, -0)
- `packages/console/app/src/routes/temp.tsx` (+0, -179)
- `packages/console/app/src/routes/zen/index.tsx` (+8, -2)
- `packages/console/app/src/style/component/faq.css` (+4, -0)
- `packages/console/app/src/style/component/focus.css` (+9, -0)
- `packages/console/app/src/style/index.css` (+2, -0)
- `packages/console/app/test/language.test.ts` (+29, -0)
- `packages/console/function/package.json` (+0, -22)
- `packages/console/function/src/log-processor.ts` (+0, -95)
- `packages/console/function/sst-env.d.ts` (+0, -10)
- `packages/console/function/tsconfig.json` (+0, -12)
- `packages/containers/tsconfig.json` (+1, -0)
- `packages/desktop/package.json` (+3, -3)
- `packages/gui-extensions/package.json` (+2, -2)
- `packages/http-recorder/package.json` (+2, -2)
- `packages/http-recorder/test/tsconfig.json` (+1, -0)
- `packages/http-recorder/tsconfig.json` (+1, -0)
- `packages/httpapi-codegen/package.json` (+2, -2)
- `packages/httpapi-codegen/tsconfig.json` (+1, -0)
- `packages/latex/package.json` (+2, -2)
- `packages/latex/tsconfig.json` (+1, -0)
- `packages/merman/package.json` (+2, -2)
- `packages/merman/tsconfig.json` (+1, -0)
- `packages/plugin-browser/package.json` (+2, -2)
- `packages/plugin-browser/tsconfig.json` (+1, -0)
- `packages/plugin/package.json` (+2, -2)
- `packages/plugin/tsconfig.json` (+1, -0)
- `packages/plugins/figma/package.json` (+2, -2)
- `packages/plugins/figma/tsconfig.json` (+1, -0)
- `packages/protocol/openapi.json` (+2, -1)
- `packages/protocol/package.json` (+2, -2)
- `packages/protocol/src/groups/message.ts` (+16, -14)
- `packages/protocol/tsconfig.json` (+1, -0)
- `packages/schema/package.json` (+2, -2)
- `packages/schema/tsconfig.json` (+1, -0)
- `packages/script/tsconfig.json` (+1, -0)
- `packages/sdk/package.json` (+2, -2)
- `packages/sdk/tsconfig.json` (+1, -0)
- `packages/server/package.json` (+2, -2)
- `packages/server/test/message.test.ts` (+4, -0)
- `packages/server/tsconfig.json` (+1, -0)
- `packages/session-ui/package.json` (+2, -2)
- `packages/session-ui/performance/markdown-lifetime/ui-styles.d.ts` (+3, -0)
- `packages/simulation/package.json` (+2, -2)
- `packages/simulation/tsconfig.json` (+1, -0)
- `packages/stats/app/package.json` (+2, -2)
- `packages/stats/server/package.json` (+2, -2)
- `packages/theme/package.json` (+2, -2)
- `packages/theme/tsconfig.json` (+1, -0)
- `packages/tui/package.json` (+2, -2)
- `packages/tui/src/component/terminal-pane.tsx` (+1, -1)
- `packages/tui/tsconfig.json` (+1, -0)
- `packages/ui/package.json` (+2, -2)
- `packages/util/package.json` (+2, -2)
- `packages/util/src/fs-util.ts` (+27, -6)
- `packages/util/src/glob.ts` (+2, -0)
- `packages/util/tsconfig.json` (+1, -0)
- `script/lint-changed.ts` (+5, -1)
- `script/profile-typecheck.ts` (+4, -4)
- `services/changelog/package.json` (+2, -2)
- `services/files/package.json` (+2, -2)
- `services/update/package.json` (+2, -2)
- `services/www/astro.config.ts` (+2, -1)
- `services/www/openapi.json` (+2, -1)
- `services/www/public/openapi.json` (+2, -1)
- `services/www/src/docs/components/DocsHeader.astro` (+1, -1)
- `services/www/src/docs/content/agents.mdx` (+1, -1)
- `services/www/src/docs/content/build/client/effect.mdx` (+27, -25)
- `services/www/src/docs/content/build/plugins/effect.mdx` (+12, -12)
- `services/www/src/docs/content/build/plugins/effect/rpc.mdx` (+5, -5)
- `services/www/src/docs/content/cli/commands.mdx` (+2, -1)
- `services/www/src/docs/content/cli/theme.mdx` (+2, -2)
- `services/www/src/docs/content/cli/web.mdx` (+3, -3)
- `services/www/src/docs/content/config.mdx` (+1, -1)
- `services/www/src/docs/content/console/go.mdx` (+6, -4)
- `services/www/src/docs/content/console/harnesses/claude-code.mdx` (+92, -0)
- `services/www/src/docs/content/console/harnesses/codex.mdx` (+98, -0)
- `services/www/src/docs/content/console/harnesses/hermes.mdx` (+58, -0)
- `services/www/src/docs/content/console/harnesses/index.mdx` (+87, -0)
- `services/www/src/docs/content/console/harnesses/pi.mdx` (+66, -0)
- `services/www/src/docs/content/console/harnesses/raycast.mdx` (+40, -0)
- `services/www/src/docs/content/console/index.mdx` (+1, -0)
- `services/www/src/docs/content/console/models.mdx` (+4, -11)
- `services/www/src/docs/content/index.mdx` (+6, -6)
- `services/www/src/docs/content/skills.mdx` (+5, -2)
- `services/www/src/docs/content/themes.mdx` (+1, -1)
- `services/www/src/docs/layouts/DocsLayout.astro` (+2, -2)
- `services/www/src/docs/lib/navigation.ts` (+15, -1)
- `services/www/src/docs/lib/sitemap.ts` (+16, -0)
- `services/www/src/docs/rehype-table-scroll.ts` (+41, -0)
- `services/www/src/pages/sitemap.xml.ts` (+9, -0)
- `sst-env.d.ts` (+0, -13)
- `sst.config.ts` (+0, -5)
- `tsconfig.json` (+3, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index f33c3c7..b88ea5b 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -24,7 +24,7 @@
     "build": "bun run script/build.ts",
     "update-models-snapshot": "bun run script/update-models-snapshot.ts",
     "test": "bun run script/test.ts",
-    "typecheck": "tsgo -b tsconfig.json tsconfig.tests.json"
+    "typecheck": "tsc -b tsconfig.json tsconfig.tests.json"
   },
   "exports": {
     "./*": "./src/*.ts"
```

#### packages/core/src/config/plugin/compatibility.ts
```diff
diff --git a/packages/core/src/config/plugin/compatibility.ts b/packages/core/src/config/plugin/compatibility.ts
index 792048d..2ca898a 100644
--- a/packages/core/src/config/plugin/compatibility.ts
+++ b/packages/core/src/config/plugin/compatibility.ts
@@ -8,6 +8,7 @@ import { Config } from "../../config.js"
 import { Watcher } from "../../filesystem/watcher.js"
 import { Skill } from "../../skill.js"
 import { SkillFile } from "./skill-file.js"
+import { SkillScan } from "./skill-scan.js"
 
 export const Plugin = define({
   id: "opencode.config.compatibility",
@@ -24,7 +25,9 @@ export const Plugin = define({
       target: string,
       type: "file" | "directory",
     ) {
-      const updates = yield* watcher.subscribe({ path: target, type })
+      const updates = yield* watcher.subscribe(
+        type === "directory" ? { path: target, type, ignore: SkillScan.ignore } : { path: target, type },
+      )
       yield* FiberMap.run(
         watches,
         `${type}:${target}`,
@@ -43,10 +46,7 @@ export const Plugin = define({
           const resolved = yield* fs.realPath(directory).pipe(Effect.orElseSucceed(() => undefined))
           if (!resolved) continue
           yield* watch(resolved, "directory")
-          const files = yield* fs
-            .scan("{*.md,**/SKILL.md}", { cwd: resolved, absolute: true, include: "file", symlink: true, dot: true })
-            .pipe(Effect.orElseSucceed(() => [] as string[]))
-          for (const filepath of files.toSorted()) {
+          for (const filepath of yield* SkillScan.scan(resolved)) {
             const content = yield* fs.readFileStringSafe(filepath).pipe(Effect.orElseSucceed(() => undefined))
             if (!content) continue
             const parsed = SkillFile.parse(resolved, filepath, content)
```

#### packages/core/src/config/plugin/instruction.ts
```diff
diff --git a/packages/core/src/config/plugin/instruction.ts b/packages/core/src/config/plugin/instruction.ts
index 5fe1f79..133bf18 100644
--- a/packages/core/src/config/plugin/instruction.ts
+++ b/packages/core/src/config/plugin/instruction.ts
@@ -61,16 +61,24 @@ export const Plugin = define({
         yield* updates.pipe(Stream.runForEach(publish), Effect.forkScoped({ startImmediately: true }))
       }
 
+      // A missing file may be mid-save and is transient; a denied file (e.g. outside a sandbox grant) stays absent.
       const read = Effect.fn("ConfigInstructionPlugin.read")(function* (filepath: string) {
-        const content = yield* fs.readFileStringSafe(filepath)
-        if (content !== undefined) return new InstructionDiscovery.File({ path: filepath, content })
-        yield* Effect.logDebug("instruction file skipped", { path: filepath, reason: "unavailable" })
+        return yield* fs.readFileString(filepath).pipe(
+          Effect.map((content) => new InstructionDiscovery.File({ path: filepath, content })),
+          Effect.catchIf(
+            (error) => error.reason._tag === "NotFound" || FSUtil.isAccessDenied(error),
+            (error) =>
+              Effect.logDebug("instruction file skipped", { path: filepath, reason: error.reason._tag }).pipe(
+                Effect.as(error.reason._tag === "NotFound" ? undefined : ("denied" as const)),
+              ),
+          ),
+        )
       })
 
       const globalSource = Effect.fn("ConfigInstructionPlugin.globalSource")(function* () {
         if (!discovery.global || !(yield* fs.isFile(globalFile))) return []
         const file = yield* read(globalFile)
-        return file ? [file] : []
+        return file instanceof InstructionDiscovery.File ? [file] : []
       })
 
       const projectSource = Effect.fn("ConfigInstructionPlugin.projectSource")(function* () {
@@ -82,7 +90,7 @@ export const Plugin = define({
         const discovered = new Set(walked.filter((file) => discovery.global || file !== globalFile))
         const files = yield* Effect.forEach(discovered, read, { concurrency: "unbounded" })
         if (files.some((file) => file === undefined)) return Instructions.unavailable
-        return files.filter((file): file is InstructionDiscovery.File => file !== undefined)
+        return files.filter((file) => file instanceof InstructionDiscovery.File)
       })
 
       // Relative patterns search upward from the location to the project root. Without
@@ -115,7 +123,7 @@ export const Plugin = define({
             if (watched.has(resolved)) continue
             watched.add(resolved)
             const file = yield* read(resolved)
-            if (file) files.push(file)
+            if (file instanceof InstructionDiscovery.File) files.push(file)
           }
         }
```

#### packages/core/src/config/plugin/skill-scan.ts
```diff
diff --git a/packages/core/src/config/plugin/skill-scan.ts b/packages/core/src/config/plugin/skill-scan.ts
new file mode 100644
index 0000000..c955270
--- /dev/null
+++ b/packages/core/src/config/plugin/skill-scan.ts
@@ -0,0 +1,46 @@
+export * as SkillScan from "./skill-scan.js"
+
+import { FSUtil } from "@opencode/util/fs-util"
+import path from "path"
+import { Effect } from "effect"
+
+const MAX_DEPTH = 6
+
+export const ignore = [...FSUtil.ignoreGlobs, "**/.*", "**/.*/**"]
+
+export const scan = Effect.fn("SkillScan.scan")(function* (root: string) {
+  const fs = yield* FSUtil.Service
+  const files: string[] = []
+  const queue = [{ directory: root, depth: 0 }]
+  for (const item of queue) {
+    const entries = yield* fs.readDirectoryEntries(item.directory).pipe(Effect.orElseSucceed(() => []))
+    const children = yield* Effect.forEach(
+      entries.filter((entry) => !entry.name.startsWith(".") && !FSUtil.ignoredDirectories.includes(entry.name)),
+      (entry) => {
+        const target = path.join(item.directory, entry.name)
+        if (entry.type !== "symlink") return Effect.succeed({ name: entry.name, path: target, type: entry.type })
+        return fs.stat(target).pipe(
+          Effect.map((info) => (info.type === "Directory" ? "directory" : info.type === "File" ? "file" : "other")),
+          Effect.orElseSucceed(() => "other" as const),
+          Effect.map((type) => ({ name: entry.name, path: target, type })),
+        )
+      },
+    )
+    const skill = children.find((child) => child.type === "file" && child.name === "SKILL.md")
+    if (skill) {
+      files.push(skill.path)
+      continue
+    }
+    if (item.depth === 0)
+      files.push(
+        ...children.filter((child) => child.type === "file" && child.name.endsWith(".md")).map((child) => child.path),
+      )
+    if (item.depth < MAX_DEPTH)
+      queue.push(
+        ...children
+          .filter((child) => child.type === "directory")
+          .map((child) => ({ directory: child.path, depth: item.depth + 1 })),
+      )
+  }
```

#### packages/core/src/config/plugin/skill.ts
```diff
diff --git a/packages/core/src/config/plugin/skill.ts b/packages/core/src/config/plugin/skill.ts
index 1338cab..be62b9c 100644
--- a/packages/core/src/config/plugin/skill.ts
+++ b/packages/core/src/config/plugin/skill.ts
@@ -13,6 +13,7 @@ import { AbsolutePath } from "../../schema.js"
 import { Skill } from "../../skill.js"
 import { SkillDiscovery } from "../../skill/discovery.js"
 import { SkillFile } from "./skill-file.js"
+import { SkillScan } from "./skill-scan.js"
 
 type Source = Skill.DirectorySource | Skill.UrlSource
 
@@ -35,7 +36,9 @@ export const Plugin = define({
 
     const watch = Effect.fn("ConfigSkillPlugin.watch")(function* (directory: string, type: "file" | "directory") {
       const target = path.resolve(directory)
-      const updates = yield* watcher.subscribe({ path: target, type })
+      const updates = yield* watcher.subscribe(
+        type === "directory" ? { path: target, type, ignore: SkillScan.ignore } : { path: target, type },
+      )
       yield* FiberMap.run(
         watches,
         `${type}:${target}`,
@@ -117,12 +120,9 @@ export const Plugin = define({
       const roots = (yield* Effect.forEach(directories, watchDirectory)).flat()
       const skills: Skill.Info[] = []
       for (const directory of directories) {
-        const files = yield* fs
-          .scan("{*.md,**/SKILL.md}", { cwd: directory, absolute: true, include: "file", symlink: true, dot: true })
-          .pipe(Effect.orElseSucceed(() => [] as string[]))
-        for (const filepath of files.toSorted()) {
+        for (const filepath of yield* SkillScan.scan(directory)) {
           const resolved = yield* fs.realPath(filepath).pipe(Effect.orElseSucceed(() => filepath))
-          if (!roots.some((root) => FSUtil.contains(root, resolved))) yield* watch(path.dirname(resolved), "directory")
+          if (!roots.some((root) => FSUtil.contains(root, resolved))) yield* watch(resolved, "file")
           const content = yield* fs.readFileStringSafe(filepath).pipe(Effect.orElseSucceed(() => undefined))
           if (!content) continue
           const parsed = SkillFile.parse(directory, filepath, content)
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- No specific recommendations - review changes manually
