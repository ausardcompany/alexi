# Upstream Changes Report
Generated: 2026-05-19 09:45:58

## Summary
- kilocode: 51 commits, 99 files changed
- opencode: 91 commits, 243 files changed

## kilocode Changes (a23fe160d..4c0e6987b)

### Commits

- 4c0e6987b - Merge pull request #10381 from Kilo-Org/mark/remove-upstream-vscode-sdk (Mark IJbema, 2026-05-19)
- 523e3d8f0 - chore: remove upstream vscode sdk (Mark IJbema, 2026-05-19)
- 264526b45 - Merge pull request #10358 from Kilo-Org/typical-duckling (Catriel Müller, 2026-05-18)
- 8611910a0 - refactor: improve ui timing (Catriel Müller, 2026-05-18)
- e2e646b87 - refactor: update links (Catriel Müller, 2026-05-18)
- 1fce31a77 - Merge branch 'main' into typical-duckling (Catriel Müller, 2026-05-18)
- dda23cefa - Revert "test(cli): avoid global timer patching" (Catriel Müller, 2026-05-18)
- 928c80d8f - test(cli): avoid global timer patching (Catriel Müller, 2026-05-18)
- 4de0e30e9 - Merge pull request #10355 from Kilo-Org/mark/forbid-opncd-share-url (Mark IJbema, 2026-05-18)
- eaabc9962 - fix: add kilocode_change markers and update nvidia-headers test for rebrand (Mark IJbema, 2026-05-18)
- 621af97e4 - fix(cli): use link-checker-safe network probe (Catriel Müller, 2026-05-18)
- 2aa1b9507 - refactor: resolve comments (Catriel Müller, 2026-05-18)
- 1a9a668ba - Merge pull request #9984 from Kilo-Org/unleashed-romano (Kirill Kalishev, 2026-05-18)
- dfb80cdd7 - chore(jetbrains): upgrade IntelliJ Gradle plugin to 2.16.0 (kirillk, 2026-05-18)
- 1f71d25a6 - ci: skip check-forbidden-strings.ts in source-links extraction (Mark IJbema, 2026-05-18)
- c224f5040 - docs: list deferred forbidden-string candidates and wire into upstream-merge agent (Mark IJbema, 2026-05-18)
- 3185e8d58 - fix: rebrand upstream attribution and bug-report URLs (Mark IJbema, 2026-05-18)
- ad8d57707 - fix(cli): address network reconnect review (Catriel Müller, 2026-05-18)
- b894f8d41 - fix(jetbrains): bypass JetBrains cache redirector (kirillk, 2026-05-18)
- 5cdb34338 - Merge branch 'main' into unleashed-romano (Kirill Kalishev, 2026-05-18)
- 413222f01 - fix(cli): auto-resume network reconnects (Catriel Müller, 2026-05-18)
- 3aba363c4 - ci: move forbidden-strings check to its own workflow (Mark IJbema, 2026-05-18)
- 84a72b9e3 - Merge pull request #10354 from Kilo-Org/mark/review-md-guidance (Mark IJbema, 2026-05-18)
- ad981b248 - Merge pull request #10350 from Kilo-Org/brian/addImages (Brian Turcotte, 2026-05-18)
- 7992aadf3 - chore(scripts): extract forbidden string check into dedicated script (kiloconnect[bot], 2026-05-18)
- 2c6bb834d - chore(vscode): forbid legacy opncd.ai/s/ share URL in check-kilocode-change (kiloconnect[bot], 2026-05-18)
- 98e7c25fd - docs: add REVIEW.md with reviewbot guidance (Mark IJbema, 2026-05-18)
- d5ba460b1 - Merge pull request #10303 from Kilo-Org/docs/kiloclaw-remove-beta-messaging (Mark IJbema, 2026-05-18)
- 85a4213ca - docs: add screenshots to Slack, GitHub, and Linear pages (Brian Turcotte, 2026-05-18)
- cdbcdb1ef - Merge branch 'main' into unleashed-romano (Kirill Kalishev, 2026-05-16)
- 4238f3fb8 - fix(jetbrains): make delete action wait Windows-safe (kirillk, 2026-05-16)
- 85b553510 - chore: remove unrelated formatting changes (kirillk, 2026-05-16)
- 9fdd740b1 - fix(jetbrains): eliminate flaky waitFor in delete test without EDT deadlock (kirillk, 2026-05-16)
- ef3782061 - fix(jetbrains): make delete test deterministic by fixing data races (kirillk, 2026-05-15)
- 41ec40b34 - docs(kilo-docs): remove free beta messaging from KiloClaw pages (kiloconnect[bot], 2026-05-15)
- 25fdf3347 - Merge branch 'main' into unleashed-romano (Kirill Kalishev, 2026-05-15)
- 1b806cca3 - fix(jetbrains): test:ci always exits 0 to avoid flaky Windows CI failures (kirillk, 2026-05-15)
- 8a212afbd - Merge branch 'main' into unleashed-romano (Kirill Kalishev, 2026-05-15)
- f32f097a2 - fix: use forward slashes in Windows temp path for JSON in KiloBackendModelStateManagerTest (kirillk, 2026-05-15)
- 2150c6824 - fix: annotate Java setup, fix gradlew.bat path, fix flaky test assertions (kirillk, 2026-05-15)
- 78c31d4a7 - fix: add Java 21 setup for Windows CI and fix SessionRecoveryTest assertions (kirillk, 2026-05-15)
- 4712bae89 - fix: remove checkCli from processResources to unblock compile/test (kirillk, 2026-05-15)
- d06a10dbb - ci: fix JetBrains typecheck/test CI race conditions (kirillk, 2026-05-15)
- c79785ea9 - Merge remote-tracking branch 'origin/main' into unleashed-romano (kirillk, 2026-05-14)
- cc90649d7 - ci(jetbrains): add test:ci script and include in CI build (kirillk, 2026-05-11)
- cf105cc07 - Merge branch 'main' into unleashed-romano (Kirill Kalishev, 2026-05-11)
- 20d873cc5 - Merge branch 'main' into unleashed-romano (Kirill Kalishev, 2026-05-11)
- 95b3fac4e - fix(jetbrains): replace Gap.small() with Gap.sm() after main merge (kirillk, 2026-05-11)
- 1db62ed02 - Merge remote-tracking branch 'origin/main' into unleashed-romano (kirillk, 2026-05-11)
- dad94abbb - ci(jetbrains): include plugin build in typecheck (kirillk, 2026-05-09)
- cfb3ab8c9 - Merge branch 'main' into unleashed-romano (Kirill Kalishev, 2026-05-09)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/bash.ts` (+0, -1)

#### Agent System (packages/*/src/agent/)
- `.kilo/agent/upstream-merge.md` (+9, -1)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/src/kilocode/global.ts` (+4, -1)

#### Other Changes
- `.changeset/clever-networks-resume.md` (+5, -0)
- `.github/workflows/check-forbidden-strings.yml` (+21, -0)
- `.github/workflows/check-opencode-annotations.yml` (+0, -1)
- `.github/workflows/test.yml` (+8, -0)
- `REVIEW.md` (+90, -0)
- `packages/kilo-docs/components/FlowDiagram/diagrams/wanted-lifecycle.ts` (+0, -1)
- `packages/kilo-docs/components/FlowDiagram/index.tsx` (+1, -5)
- `packages/kilo-docs/markdoc/partials/cli-commands-table.md` (+1, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli-reference.md` (+38, -19)
- `packages/kilo-docs/pages/code-with-ai/platforms/github.md` (+6, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/linear.md` (+6, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/slack.md` (+8, -0)
- `packages/kilo-docs/pages/kiloclaw/dashboard.md` (+0, -4)
- `packages/kilo-docs/pages/kiloclaw/faq/pricing.md` (+1, -4)
- `packages/kilo-docs/pages/kiloclaw/overview.md` (+1, -1)
- `packages/kilo-docs/public/img/connect/github/github-bug.png` (+-, --)
- `packages/kilo-docs/public/img/connect/github/github-issue.png` (+-, --)
- `packages/kilo-docs/public/img/connect/github/github-review.png` (+-, --)
- `packages/kilo-docs/public/img/connect/linear/linear-fix-issue.png` (+-, --)
- `packages/kilo-docs/public/img/connect/linear/linear-multi-repo.png` (+-, --)
- `packages/kilo-docs/public/img/connect/linear/linear-understand-issue.png` (+-, --)
- `packages/kilo-docs/public/img/connect/slack/slackbot-ask-questions.webp` (+-, --)
- `packages/kilo-docs/public/img/connect/slack/slackbot-bugs.webp` (+-, --)
- `packages/kilo-docs/public/img/connect/slack/slackbot-coding.webp` (+-, --)
- `packages/kilo-docs/public/img/connect/slack/slackbot-turn-discussions-into-PRs.webp` (+-, --)
- `packages/kilo-docs/source-links.md` (+5, -3)
- `packages/kilo-gateway/test/api/models.test.ts` (+12, -10)
- `packages/kilo-jetbrains/AGENTS.md` (+3, -2)
- `packages/kilo-jetbrains/backend/build.gradle.kts` (+17, -30)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendModelStateManagerTest.kt` (+2, -1)
- `packages/kilo-jetbrains/build-tasks/src/main/kotlin/CheckCliTask.kt` (+6, -0)
- `packages/kilo-jetbrains/build-tasks/src/main/kotlin/GenerateOpenApiSpecTask.kt` (+104, -0)
- `packages/kilo-jetbrains/build-tasks/src/main/kotlin/PrepareLocalCliTask.kt` (+0, -74)
- `packages/kilo-jetbrains/build.gradle.kts` (+18, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/HistorySessionActionsTest.kt` (+13, -5)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/SessionRecoveryTest.kt` (+14, -14)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeSessionRpcApi.kt` (+3, -3)
- `packages/kilo-jetbrains/gradle.properties` (+1, -0)
- `packages/kilo-jetbrains/gradle/libs.versions.toml` (+1, -1)
- `packages/kilo-jetbrains/package.json` (+4, -1)
- `packages/kilo-jetbrains/script/test-ci.ts` (+48, -0)
- `packages/kilo-vscode/tests/unit/file-search-items.test.ts` (+3, -3)
- `packages/kilo-vscode/tests/unit/use-file-mention.test.ts` (+4, -4)
- `packages/opencode/src/cli/cmd/tui/component/error-component.tsx` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/context/sync.tsx` (+1, -0)
- `packages/opencode/src/cli/cmd/tui/routes/session/network.tsx` (+20, -3)
- `packages/opencode/src/kilocode/cli/cmd/roll-call.ts` (+15, -4)
- `packages/opencode/src/kilocode/components/model-info-panel.tsx` (+2, -5)
- `packages/opencode/src/kilocode/provider/provider.ts` (+1, -1)
- `packages/opencode/src/kilocode/session/compaction-chunks.ts` (+24, -21)
- `packages/opencode/src/plugin/codex.ts` (+7, -1)
- `packages/opencode/src/project/bootstrap.ts` (+3, -10)
- `packages/opencode/src/provider/provider.ts` (+14, -14)
- `packages/opencode/src/session/compaction.ts` (+8, -2)
- `packages/opencode/src/session/network.ts` (+91, -6)
- `packages/opencode/test/cli/github-remote.test.ts` (+14, -6)
- `packages/opencode/test/kilocode/codex-auth-refresh.test.ts` (+2, -1)
- `packages/opencode/test/kilocode/encoding.test.ts` (+15, -16)
- `packages/opencode/test/kilocode/nvidia-headers.test.ts` (+4, -4)
- `packages/opencode/test/kilocode/provider-list-failed-state.test.ts` (+12, -2)
- `packages/opencode/test/kilocode/run-network.test.ts` (+1, -0)
- `packages/opencode/test/kilocode/session-compaction-chunks.test.ts` (+24, -6)
- `packages/opencode/test/kilocode/session/instruction-substitution.test.ts` (+1, -5)
- `packages/opencode/test/kilocode/util/url.test.ts` (+1, -3)
- `packages/opencode/test/session/network.test.ts` (+113, -1)
- `packages/script/tests/check-opencode-annotations.test.ts` (+1, -3)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+2, -0)
- `packages/sdk/openapi.json` (+7, -1)
- `packages/ui/src/components/provider-icons/sprite.svg` (+171, -0)
- `packages/ui/src/components/provider-icons/types.ts` (+3, -0)
- `script/check-forbidden-strings.ts` (+103, -0)
- `script/check-opencode-annotations.ts` (+0, -1)
- `script/check-workflows.ts` (+1, -0)
- `script/extract-source-links.ts` (+1, -1)
- `script/raw-changelog.ts` (+2, -2)
- `script/upstream/transforms/skip-files.test.ts` (+5, -0)
- `script/upstream/transforms/transform-package-json.test.ts` (+3, -3)
- `script/upstream/transforms/transform-package-json.ts` (+6, -1)
- `script/upstream/utils/config.ts` (+1, -0)
- `sdks/vscode/.gitignore` (+0, -1)
- `sdks/vscode/.vscode-test.mjs` (+0, -5)
- `sdks/vscode/.vscodeignore` (+0, -16)
- `sdks/vscode/README.md` (+0, -34)
- `sdks/vscode/bun.lock` (+0, -589)
- `sdks/vscode/esbuild.js` (+0, -54)
- `sdks/vscode/eslint.config.mjs` (+0, -34)
- `sdks/vscode/images/button-dark.svg` (+0, -1)
- `sdks/vscode/images/button-light.svg` (+0, -1)
- `sdks/vscode/images/icon.png` (+0, -1)
- `sdks/vscode/package.json` (+0, -110)
- `sdks/vscode/script/publish` (+0, -21)
- `sdks/vscode/script/release` (+0, -41)
- `sdks/vscode/src/extension.ts` (+0, -137)
- `sdks/vscode/sst-env.d.ts` (+0, -10)
- `sdks/vscode/tsconfig.json` (+0, -16)
- `turbo.json` (+11, -0)

### Key Diffs

#### .kilo/agent/upstream-merge.md
```diff
diff --git a/.kilo/agent/upstream-merge.md b/.kilo/agent/upstream-merge.md
index e81c9cea3..559f59e89 100644
--- a/.kilo/agent/upstream-merge.md
+++ b/.kilo/agent/upstream-merge.md
@@ -249,7 +249,15 @@ be broken. Check every auto-merged file for:
   files changed. Note that this tool compares against the merge base via `HEAD`
   and will be silent until the merge commit lands
 - other CI guards that touched files imply (knip for `kilo-vscode/`,
-  `check-kilocode-change`, source-links, visual regression)
+  `check-kilocode-change`, source-links, visual regression,
+  `script/check-forbidden-strings.ts`)
+- if you encounter a hardcoded upstream URL, repo path, or attribution string
+  during conflict resolution that obviously shouldn't ship in Kilo (e.g. another
+  `https://opencode.ai/...` link, an `anomalyco/opencode` reference, an
+  attribution header naming "opencode"), suggest adding a literal pattern for
+  it to `script/check-forbidden-strings.ts` in the merge summary so future
+  merges catch it automatically. Don't add it silently mid-merge — flag it for
+  the user.
 
 ### 9. Commit with the standard message
 
```

#### packages/core/src/kilocode/global.ts
```diff
diff --git a/packages/core/src/kilocode/global.ts b/packages/core/src/kilocode/global.ts
index eb5b5d06b..b57d06f7a 100644
--- a/packages/core/src/kilocode/global.ts
+++ b/packages/core/src/kilocode/global.ts
@@ -12,7 +12,10 @@ import fs from "fs/promises"
  */
 export async function ensureRealDir(p: string) {
   await fs.mkdir(p, { recursive: true })
-  const ok = await fs.stat(p).then(() => true).catch(() => false)
+  const ok = await fs
+    .stat(p)
+    .then(() => true)
+    .catch(() => false)
   if (!ok) {
     await fs.rm(p, { force: true })
     await fs.mkdir(p, { recursive: true })
```

#### packages/opencode/src/tool/bash.ts
```diff
diff --git a/packages/opencode/src/tool/bash.ts b/packages/opencode/src/tool/bash.ts
index df171c24a..4380f6067 100644
--- a/packages/opencode/src/tool/bash.ts
+++ b/packages/opencode/src/tool/bash.ts
@@ -239,7 +239,6 @@ function preview(text: string) {
   return "...\n\n" + text.slice(-MAX_METADATA_LENGTH)
 }
 
-
 function tail(text: string, maxLines: number, maxBytes: number) {
   const lines = text.split("\n")
   if (lines.length <= maxLines && Buffer.byteLength(text, "utf-8") <= maxBytes) {
```


## opencode Changes (53e89f9..2339aac)

### Commits

- 2339aac - chore(team): add starptech to the team members list (#28320) (Dustin Deus, 2026-05-19)
- 2d348da - chore: generate (opencode-agent[bot], 2026-05-19)
- cbd2620 - feat(i18n): add Ukrainian (uk) locale support (#28061) (MYMDO, 2026-05-19)
- 3bd3047 - chore: generate (opencode-agent[bot], 2026-05-19)
- dac81cd - fix(httpapi): preserve v2 openapi errors (#28298) (Shoubhit Dash, 2026-05-19)
- 2c3bcf3 - feat(httpapi): add v2 public error schemas (#28297) (Shoubhit Dash, 2026-05-19)
- d9d43d8 - test: migrate plugin config fixtures (Kit Langton, 2026-05-18)
- bcc69f0 - test: migrate managed config fixtures (Kit Langton, 2026-05-18)
- e53563f - test: migrate remaining simple config fixtures (Kit Langton, 2026-05-18)
- 7e4b02f - test: migrate config legacy tool fixtures (Kit Langton, 2026-05-18)
- 996928b - Migrate config .opencode file tests to instance fixtures (#28268) (Kit Langton, 2026-05-18)
- c032e82 - Migrate config update tests to instance fixtures (#28266) (Kit Langton, 2026-05-18)
- 6f160bb - chore: generate (opencode-agent[bot], 2026-05-19)
- ebb672a - test(cli): subprocess integration tests for opencode serve (#28263) (Kit Langton, 2026-05-19)
- 9a19e84 - Migrate config agent tests to instance fixtures (#28213) (Kit Langton, 2026-05-18)
- 338666d - Migrate config template tests to instance fixtures (#28211) (Kit Langton, 2026-05-18)
- 7b8a103 - refactor(test/lib): generalize run-process harness into cli-process (#28253) (Kit Langton, 2026-05-18)
- ee5cf45 - Migrate simple config tests to instance fixtures (#28210) (Kit Langton, 2026-05-18)
- 2e1593d - chore: generate (opencode-agent[bot], 2026-05-18)
- 0f3d168 - test(cli): subprocess integration test harness + regression suite for opencode run (#28230) (Kit Langton, 2026-05-18)
- ce09fc8 - chore: generate (opencode-agent[bot], 2026-05-18)
- 44a35c5 - test(app): add session timeline smoke coverage (#26619) (Luke Parker, 2026-05-18)
- 8a321c4 - fix(native-llm): prefer console opencode token (#28237) (Kit Langton, 2026-05-18)
- ef9e567 - sync release versions for v1.15.5 (opencode, 2026-05-18)
- b396b71 - fix(ui): guard reasoning renderer against undefined text (#28222) (Kit Langton, 2026-05-18)
- d8efc57 - refactor(session): extract prompt tool resolution (#28204) (Aiden Cline, 2026-05-18)
- e1fbed8 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-18)
- 12ae223 - fix(plugin): `ask` in tools from plugins returns promise instead of effect (#28217) (James Long, 2026-05-18)
- a88b436 - chore: generate (opencode-agent[bot], 2026-05-18)
- dbe3685 - Preview native LLM runtime stack (#27114) (Kit Langton, 2026-05-18)
- ff9d7ca - fix(core): fix file references in workspaces (#28209) (James Long, 2026-05-18)
- 88681d3 - Migrate provider lookup tests to instance fixtures (Kit Langton, 2026-05-18)
- ae2ecd1 - Migrate custom provider tests to instance fixtures (Kit Langton, 2026-05-18)
- 159d271 - refactor(sync): publish via EffectBridge.fork for codebase consistency (#28187) (Kit Langton, 2026-05-18)
- 762850d - Migrate provider config tests to instance fixtures (Kit Langton, 2026-05-18)
- b039702 - feat(tui): add syntax highlighting for elixir, fsharp, r, make, vim, xml, agda (#28198) (Kit Langton, 2026-05-18)
- 094886c - chore: generate (opencode-agent[bot], 2026-05-18)
- dc0297f - refactor(session): extract reference prompt helpers (#28197) (Shoubhit Dash, 2026-05-18)
- 3ab67f3 - Stabilize watcher test readiness (#28194) (Kit Langton, 2026-05-18)
- a2e6bd5 - refactor(reference): split materialization state (#28190) (Shoubhit Dash, 2026-05-18)
- 05ac345 - refactor(session): move prompt reminders out of core loop (#28082) (Aiden Cline, 2026-05-18)
- e3feca0 - chore: generate (opencode-agent[bot], 2026-05-18)
- 896ad7b - Speed up targeted opencode tests (Kit Langton, 2026-05-18)
- 0a94521 - chore: generate (opencode-agent[bot], 2026-05-18)
- 94828eb - refactor(repository): type cache failures (#28188) (Shoubhit Dash, 2026-05-18)
- 9619249 - refactor(repository): add cache service (#28184) (Shoubhit Dash, 2026-05-18)
- f7b5576 - chore: generate (opencode-agent[bot], 2026-05-18)
- cb35493 - fix(bus): acquire PubSub subscription eagerly to close /event race (#27959) (Kit Langton, 2026-05-18)
- 5bfd7fd - refactor(repository): clarify reference domain (#28182) (Shoubhit Dash, 2026-05-18)
- 2932b41 - chore: generate (opencode-agent[bot], 2026-05-18)
- eb389c5 - refactor(reference): normalize config entries (#28178) (Shoubhit Dash, 2026-05-18)
- 54ff0a6 - test(reference): cover configured reference contracts (#28170) (Shoubhit Dash, 2026-05-18)
- e56999f - chore: generate (opencode-agent[bot], 2026-05-18)
- 1124315 - run: refresh prompt layout after paste (#28164) (Simon Klee, 2026-05-18)
- 2bf3f30 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-18)
- 6e4db56 - upgrade opentui to 0.2.14 (#28090) (Sebastian, 2026-05-18)
- 564cde3 - fix(tui): copy pasted prompt content (#28156) (Shoubhit Dash, 2026-05-18)
- c813927 - chore: generate (opencode-agent[bot], 2026-05-18)
- 5970c12 - run: replay session history on interactive resume (#26880) (Simon Klee, 2026-05-18)
- 116a4e3 - chore: generate (opencode-agent[bot], 2026-05-18)
- 611e48c - fix(tui): collapse long tool output lines (#28148) (Shoubhit Dash, 2026-05-18)
- 836a331 - fix(ui): fix question dock overflow and message part flex layout (#28142) (Brendan Allan, 2026-05-18)
- 7afd477 - chore: generate (opencode-agent[bot], 2026-05-18)
- fe143df - fix(ui): fallback to execCommand for clipboard copy when navigator.clipboard fails (#27993) (SpiritChen51, 2026-05-18)
- e94aeca - fix(tui): use contrast-aware foreground for paste summary badge (#27969) (Kagura, 2026-05-18)
- 418c0ea - feat(desktop): add notification permission for renderer (#28119) (Brendan Allan, 2026-05-18)
- 4312e5d - chore: generate (opencode-agent[bot], 2026-05-18)
- f80f3e3 - desktop: add free limit + go usage exceeded dialogs to match tui (#27677) (Brendan Allan, 2026-05-18)
- 4792064 - chore: generate (opencode-agent[bot], 2026-05-18)
- 6849059 - fix(app): hide prompt placeholder for whitespace input (#28101) (Zayd Krunz, 2026-05-18)
- 43df145 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-18)
- 28a0bf6 - sync (Frank, 2026-05-17)
- 30e4edf - chore: generate (opencode-agent[bot], 2026-05-18)
- 5452ab6 - perf(app): virtualize session timeline rows (#26949) (Luke Parker, 2026-05-18)
- e85119a - Load models.dev snapshot from build global (#28077) (Dax, 2026-05-17)
- 71b27a1 - fix: sync PWA status bar theme-color with app color scheme (#28006) (黑墨水鱼, 2026-05-18)
- 32f37d8 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-17)
- b14ea40 - chore: generate (opencode-agent[bot], 2026-05-17)
- de846ca - chore: Upgrade Bun to the final non-rust version (#27648) (Luke Parker, 2026-05-18)
- f06b787 - fix(desktop): install the latest available update (#27953) (Luke Parker, 2026-05-18)
- 969d0f4 - chore: generate (opencode-agent[bot], 2026-05-17)
- fc19dcc - fix: sort v2 session list by updated time (#27954) (Luke Parker, 2026-05-18)
- 49c6b46 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-17)
- f97e115 - dialog prompt submit keybind + opentui event sink (#27945) (Sebastian, 2026-05-18)
- e92b1fe - core: let models layer infer its own type so layer composition no longer requires matching explicit requirements (Dax Raad, 2026-05-17)
- f98449c - sync release versions for v1.15.4 (opencode, 2026-05-17)
- 468eb68 - zen: update monitoring query (Frank, 2026-05-17)
- 23b594d - fix: preserve bus instance context (#28051) (Dax, 2026-05-17)
- 5060577 - sync (Frank, 2026-05-17)
- d3ebb1f - ignore: cleanup readme (#28049) (Aiden Cline, 2026-05-17)
- e4cc4e1 - fix(lsp): preserve instance ref for update events (#28016) (Shoubhit Dash, 2026-05-17)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/registry.ts` (+8, -2)
- `packages/opencode/src/tool/repo_clone.ts` (+10, -13)
- `packages/opencode/test/tool/glob.test.ts` (+109, -5)
- `packages/opencode/test/tool/grep.test.ts` (+103, -5)
- `packages/opencode/test/tool/read.test.ts` (+2, -2)
- `packages/opencode/test/tool/registry.test.ts` (+2, -1)
- `packages/opencode/test/tool/repo_clone.test.ts` (+19, -0)
- `packages/opencode/test/tool/skill.test.ts` (+44, -46)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
- `packages/opencode/src/bus/index.ts` (+33, -22)
- `packages/opencode/test/bus/bus-effect.test.ts` (+92, -6)

#### Core (**/core/)
- `packages/console/core/package.json` (+1, -1)
- `packages/console/core/sst-env.d.ts` (+0, -1)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/{models.ts => models-dev.ts}` (+7, -10)
- `packages/core/src/models-snapshot.d.ts` (+0, -2)
- `packages/core/src/models-snapshot.js` (+0, -71726)
- `packages/core/src/plugin/models-dev.ts` (+1, -1)
- `packages/core/test/models.test.ts` (+3, -3)

#### Other Changes
- `.github/TEAM_MEMBERS` (+1, -0)
- `README.ar.md` (+0, -12)
- `README.bn.md` (+0, -12)
- `README.br.md` (+0, -12)
- `README.bs.md` (+0, -12)
- `README.da.md` (+0, -12)
- `README.de.md` (+0, -12)
- `README.es.md` (+0, -12)
- `README.fr.md` (+0, -12)
- `README.gr.md` (+0, -12)
- `README.it.md` (+0, -12)
- `README.ja.md` (+0, -12)
- `README.ko.md` (+0, -12)
- `README.md` (+0, -12)
- `README.no.md` (+0, -12)
- `README.pl.md` (+0, -12)
- `README.ru.md` (+0, -12)
- `README.th.md` (+0, -12)
- `README.tr.md` (+0, -12)
- `README.uk.md` (+0, -12)
- `README.vi.md` (+0, -12)
- `README.zh.md` (+0, -12)
- `README.zht.md` (+0, -12)
- `bun.lock` (+39, -59)
- `infra/console.ts` (+0, -3)
- `infra/monitoring.ts` (+18, -4)
- `nix/hashes.json` (+4, -4)
- `package.json` (+6, -6)
- `packages/app/e2e/smoke/session-timeline.fixture.ts` (+314, -0)
- `packages/app/e2e/smoke/session-timeline.spec.ts` (+412, -0)
- `packages/app/e2e/todo.spec.ts` (+0, -11)
- `packages/app/e2e/utils/errors.ts` (+18, -0)
- `packages/app/e2e/utils/mock-server.ts` (+86, -0)
- `packages/app/index.html` (+0, -1)
- `packages/app/package.json` (+1, -1)
- `packages/app/public/oc-theme-preload.js` (+4, -0)
- `packages/app/src/components/dialog-usage-exceeded.tsx` (+44, -0)
- `packages/app/src/components/prompt-input.tsx` (+3, -3)
- `packages/app/src/context/global-sync/session-trim.ts` (+1, -0)
- `packages/app/src/context/language.tsx` (+6, -0)
- `packages/app/src/i18n/en.ts` (+1, -0)
- `packages/app/src/i18n/parity.test.ts` (+2, -1)
- `packages/app/src/i18n/uk.ts` (+970, -0)
- `packages/app/src/pages/session.tsx` (+66, -201)
- `packages/app/src/pages/session/composer/session-question-dock.tsx` (+3, -1)
- `packages/app/src/pages/session/message-timeline.data.ts` (+368, -0)
- `packages/app/src/pages/session/message-timeline.tsx` (+1074, -604)
- `packages/app/src/pages/session/usage-exceeded-dialogs.tsx` (+102, -0)
- `packages/app/src/pages/session/use-session-hash-scroll.ts` (+3, -16)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/i18n/index.ts` (+2, -0)
- `packages/console/app/src/i18n/uk.ts` (+785, -0)
- `packages/console/app/src/lib/language.ts` (+7, -0)
- `packages/console/app/src/routes/zen/util/dataDumper.ts` (+1, -0)
- `packages/console/app/src/routes/zen/util/ipRateLimiter.ts` (+1, -1)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/function/sst-env.d.ts` (+0, -1)
- `packages/console/mail/package.json` (+1, -1)
- `packages/console/resource/sst-env.d.ts` (+0, -1)
- `packages/containers/bun-node/Dockerfile` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/desktop/src/main/updater.ts` (+4, -12)
- `packages/desktop/src/main/windows.ts` (+7, -5)
- `packages/desktop/src/renderer/i18n/index.ts` (+6, -0)
- `packages/desktop/src/renderer/i18n/uk.ts` (+28, -0)
- `packages/desktop/src/renderer/index.html` (+0, -1)
- `packages/desktop/src/renderer/loading.html` (+0, -1)
- `packages/enterprise/package.json` (+1, -1)
- `packages/enterprise/src/entry-server.tsx` (+0, -1)
- `packages/enterprise/sst-env.d.ts` (+0, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/function/package.json` (+1, -1)
- `packages/function/sst-env.d.ts` (+0, -1)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/llm/src/schema/events.ts` (+2, -0)
- `packages/opencode/.gitignore` (+0, -2)
- `packages/opencode/package.json` (+6, -2)
- `packages/opencode/parsers-config.ts` (+76, -0)
- `packages/opencode/script/bench-test-suite.ts` (+52, -0)
- `packages/opencode/script/build-node.ts` (+2, -1)
- `packages/opencode/script/build.ts` (+2, -1)
- `packages/opencode/script/generate.ts` (+2, -11)
- `packages/opencode/script/profile-test-files.ts` (+42, -0)
- `packages/opencode/src/cli/cmd/github.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/models.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/providers.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/run.ts` (+30, -0)
- `packages/opencode/src/cli/cmd/run/footer.prompt.tsx` (+36, -1)
- `packages/opencode/src/cli/cmd/run/runtime.ts` (+10, -0)
- `packages/opencode/src/cli/cmd/run/session-replay.ts` (+188, -0)
- `packages/opencode/src/cli/cmd/run/session.shared.ts` (+2, -2)
- `packages/opencode/src/cli/cmd/run/stream.transport.ts` (+181, -53)
- `packages/opencode/src/cli/cmd/run/subagent-data.ts` (+19, -2)
- `packages/opencode/src/cli/cmd/run/types.ts` (+2, -0)
- `packages/opencode/src/cli/cmd/tui/app.tsx` (+1, -0)
- `packages/opencode/src/cli/cmd/tui/component/dialog-tag.tsx` (+3, -0)
- `packages/opencode/src/cli/cmd/tui/component/prompt/autocomplete.tsx` (+6, -3)
- `packages/opencode/src/cli/cmd/tui/component/prompt/index.tsx` (+4, -1)
- `packages/opencode/src/cli/cmd/tui/component/prompt/part.ts` (+7, -0)
- `packages/opencode/src/cli/cmd/tui/config/keybind.ts` (+1, -0)
- `packages/opencode/src/cli/cmd/tui/context/theme.tsx` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/system/session-v2.tsx` (+24, -18)
- `packages/opencode/src/cli/cmd/tui/plugin/runtime.ts` (+14, -7)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+15, -12)
- `packages/opencode/src/cli/cmd/tui/ui/dialog-prompt.tsx` (+33, -8)
- `packages/opencode/src/cli/cmd/tui/util/collapse-tool-output.ts` (+19, -0)
- `packages/opencode/src/cli/cmd/tui/util/selection.ts` (+10, -2)
- `packages/opencode/src/cli/upgrade.ts` (+24, -4)
- `packages/opencode/src/config/agent.ts` (+2, -14)
- `packages/opencode/src/config/command.ts` (+1, -8)
- `packages/opencode/src/config/reference.ts` (+46, -0)
- `packages/opencode/src/control-plane/workspace.ts` (+3, -1)
- `packages/opencode/src/effect/app-runtime.ts` (+1, -1)
- `packages/opencode/src/effect/runtime-flags.ts` (+1, -0)
- `packages/opencode/src/file/watcher.ts` (+4, -4)
- `packages/opencode/src/lsp/lsp.ts` (+1, -1)
- `packages/opencode/src/plugin/index.ts` (+1, -1)
- `packages/opencode/src/project/project.ts` (+1, -1)
- `packages/opencode/src/project/vcs.ts` (+1, -1)
- `packages/opencode/src/provider/model-status.ts` (+1, -1)
- `packages/opencode/src/provider/provider.ts` (+1, -1)
- `packages/opencode/src/provider/transform.ts` (+1, -1)
- `packages/opencode/src/reference/reference.ts` (+74, -76)
- `packages/opencode/src/reference/repository-cache.ts` (+185, -18)
- `packages/opencode/src/server/routes/instance/httpapi/errors.ts` (+122, -0)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/event.ts` (+5, -4)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/provider.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2/session.ts` (+8, -2)
- `packages/opencode/src/server/routes/instance/httpapi/public.ts` (+34, -10)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+1, -1)
- `packages/opencode/src/session/compaction.ts` (+0, -12)
- `packages/opencode/src/session/llm.ts` (+153, -80)
- `packages/opencode/src/session/llm/AGENTS.md` (+67, -0)
- `packages/opencode/src/session/llm/ai-sdk.ts` (+254, -0)
- `packages/opencode/src/session/llm/native-request.ts` (+188, -0)
- `packages/opencode/src/session/llm/native-runtime.ts` (+119, -0)
- `packages/opencode/src/session/processor.ts` (+166, -107)
- `packages/opencode/src/session/prompt.ts` (+21, -413)
- `packages/opencode/src/session/prompt/plan-mode.txt` (+70, -0)
- `packages/opencode/src/session/prompt/reference.ts` (+73, -0)
- `packages/opencode/src/session/reminders.ts` (+91, -0)
- `packages/opencode/src/session/session.ts` (+6, -7)
- `packages/opencode/src/session/tools.ts` (+208, -0)
- `packages/opencode/src/share/share-next.ts` (+11, -7)
- `packages/opencode/src/sync/index.ts` (+39, -53)
- `packages/opencode/src/util/repository.ts` (+40, -16)
- `packages/opencode/src/v2/session.ts` (+8, -6)
- `packages/opencode/test/cli/run/run-process.test.ts` (+84, -0)
- `packages/opencode/test/cli/run/scrollback.surface.test.ts` (+44, -0)
- `packages/opencode/test/cli/run/session-replay.test.ts` (+159, -0)
- `packages/opencode/test/cli/run/stream.transport.test.ts` (+482, -5)
- `packages/opencode/test/cli/serve/serve-process.test.ts` (+61, -0)
- `packages/opencode/test/cli/tui/dialog-prompt.test.tsx` (+146, -0)
- `packages/opencode/test/cli/tui/plugin-lifecycle.test.ts` (+2, -2)
- `packages/opencode/test/cli/tui/slot-replace.test.tsx` (+6, -3)
- `packages/opencode/test/config/config.test.ts` (+610, -947)
- `packages/opencode/test/config/tui.test.ts` (+2, -0)
- `packages/opencode/test/control-plane/workspace.test.ts` (+9, -5)
- `packages/opencode/test/effect/runtime-flags.test.ts` (+11, -0)
- `packages/opencode/test/file/watcher.test.ts` (+47, -17)
- `packages/opencode/test/fixture/plugin.ts` (+10, -0)
- `packages/opencode/test/fixtures/recordings/session/native-openai-tool-call.json` (+31, -0)
- `packages/opencode/test/fixtures/recordings/session/native-zen-tool-call.json` (+31, -0)
- `packages/opencode/test/lib/cli-process.ts` (+309, -0)
- `packages/opencode/test/lib/test-provider.ts` (+37, -0)
- `packages/opencode/test/lsp/index.test.ts` (+33, -2)
- `packages/opencode/test/plugin/install-concurrency.test.ts` (+3, -3)
- `packages/opencode/test/provider/model-status.test.ts` (+1, -1)
- `packages/opencode/test/provider/provider.test.ts` (+295, -432)
- `packages/opencode/test/reference/reference.test.ts` (+74, -7)
- `packages/opencode/test/server/httpapi-event-diagnostics.test.ts` (+443, -0)
- `packages/opencode/test/server/httpapi-listen.test.ts` (+25, -45)
- `packages/opencode/test/server/httpapi-provider.test.ts` (+5, -0)
- `packages/opencode/test/server/httpapi-public-openapi.test.ts` (+88, -0)
- `packages/opencode/test/server/httpapi-sdk.test.ts` (+73, -40)
- `packages/opencode/test/session/compaction.test.ts` (+89, -255)
- `packages/opencode/test/session/llm-native-recorded.test.ts` (+283, -0)
- `packages/opencode/test/session/llm-native.test.ts` (+385, -0)
- `packages/opencode/test/session/llm.test.ts` (+843, -28)
- `packages/opencode/test/session/processor-effect.test.ts` (+78, -11)
- `packages/opencode/test/session/prompt.test.ts` (+305, -359)
- `packages/opencode/test/session/snapshot-tool-race.test.ts` (+2, -0)
- `packages/opencode/test/sync/index.test.ts` (+40, -2)
- `packages/opencode/test/util/repository.test.ts` (+81, -0)
- `packages/plugin/package.json` (+4, -4)
- `packages/plugin/src/tool.ts` (+1, -2)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+12, -6)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+145, -87)
- `packages/sdk/openapi.json` (+257, -210)
- `packages/slack/package.json` (+1, -1)
- `packages/ui/package.json` (+2, -1)
- `packages/ui/src/components/basic-tool.tsx` (+61, -16)
- `packages/ui/src/components/message-part.css` (+1, -1)
- `packages/ui/src/components/message-part.tsx` (+64, -27)
- `packages/ui/src/components/timeline-playground.stories.tsx` (+1, -1)
- `packages/ui/src/context/dialog.tsx` (+2, -1)
- `packages/ui/src/i18n/ar.ts` (+9, -0)
- `packages/ui/src/i18n/br.ts` (+9, -0)
- `packages/ui/src/i18n/bs.ts` (+9, -0)
- `packages/ui/src/i18n/da.ts` (+9, -0)
- `packages/ui/src/i18n/de.ts` (+9, -0)
- `packages/ui/src/i18n/en.ts` (+9, -0)
- `packages/ui/src/i18n/es.ts` (+9, -0)
- `packages/ui/src/i18n/fr.ts` (+9, -0)
- `packages/ui/src/i18n/ja.ts` (+9, -0)
- `packages/ui/src/i18n/ko.ts` (+9, -0)
- `packages/ui/src/i18n/no.ts` (+9, -0)
- `packages/ui/src/i18n/pl.ts` (+9, -0)
- `packages/ui/src/i18n/ru.ts` (+9, -0)
- `packages/ui/src/i18n/th.ts` (+9, -0)
- `packages/ui/src/i18n/tr.ts` (+9, -0)
- `packages/ui/src/i18n/uk.ts` (+167, -0)
- `packages/ui/src/i18n/zh.ts` (+8, -0)
- `packages/ui/src/i18n/zht.ts` (+8, -0)
- `packages/ui/src/theme/context.tsx` (+4, -0)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/keybinds.mdx` (+1, -0)
- `packages/web/src/i18n/locales.ts` (+3, -0)
- `perf/test-suite.md` (+137, -0)
- `screenshot-uk.png` (+-, --)
- `script/upgrade-opentui.ts` (+123, -14)
- `sdks/vscode/package.json` (+1, -1)
- `sst-env.d.ts` (+0, -4)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index c656037..85d500f 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.15.3",
+  "version": "1.15.5",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/console/core/sst-env.d.ts
```diff
diff --git a/packages/console/core/sst-env.d.ts b/packages/console/core/sst-env.d.ts
index 088db5b..5f1d5d5 100644
--- a/packages/console/core/sst-env.d.ts
+++ b/packages/console/core/sst-env.d.ts
@@ -296,7 +296,6 @@ declare module "sst" {
     "AuthStorage": cloudflare.KVNamespace
     "Bucket": cloudflare.R2Bucket
     "EnterpriseStorage": cloudflare.R2Bucket
-    "GatewayKv": cloudflare.KVNamespace
     "LogProcessor": cloudflare.Service
     "Stat": cloudflare.Service
     "ZenData": cloudflare.R2Bucket
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index edf3ce8..feeb6ce 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.15.3",
+  "version": "1.15.5",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/{models.ts => models-dev.ts}
```diff
```

#### packages/core/src/models-snapshot.d.ts
```diff
diff --git a/packages/core/src/models-snapshot.d.ts b/packages/core/src/models-snapshot.d.ts
deleted file mode 100644
index 839eba6..0000000
--- a/packages/core/src/models-snapshot.d.ts
+++ /dev/null
@@ -1,2 +0,0 @@
-// Auto-generated by build.ts - do not edit
-export declare const snapshot: Record<string, unknown>
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from .kilo/agent/upstream-merge.md
- `src/core/` - review core changes from packages/core/src/kilocode/global.ts
- `src/tool/bash.ts` - update based on kilocode packages/opencode/src/tool/bash.ts changes
- `src/tool/glob.test.ts` - update based on opencode packages/opencode/test/tool/glob.test.ts changes
- `src/tool/grep.test.ts` - update based on opencode packages/opencode/test/tool/grep.test.ts changes
- `src/tool/read.test.ts` - update based on opencode packages/opencode/test/tool/read.test.ts changes
- `src/tool/registry.test.ts` - update based on opencode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on opencode packages/opencode/src/tool/registry.ts changes
- `src/tool/repo_clone.test.ts` - update based on opencode packages/opencode/test/tool/repo_clone.test.ts changes
- `src/tool/repo_clone.ts` - update based on opencode packages/opencode/src/tool/repo_clone.ts changes
- `src/tool/skill.test.ts` - update based on opencode packages/opencode/test/tool/skill.test.ts changes
