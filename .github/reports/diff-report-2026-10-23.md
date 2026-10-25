# Upstream Changes Report
Generated: 2026-10-23 11:08:04

## Summary
- kilocode: 56 commits, 127 files changed
- opencode: 74 commits, 589 files changed

## kilocode Changes (4481e06d8..4130f7a6e)

### Commits

- 4130f7a6e - Merge pull request #15410 from Kilo-Org/dependabot-dompurify (Andrea Giammarchi, 2026-10-23)
- ad33d4756 - Merge branch 'main' into dependabot-dompurify (Andrea Giammarchi, 2026-10-23)
- 5479d9408 - chore: restore diff-panel visual baseline from main (webreflection, 2026-10-23)
- f29df226d - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-10-23)
- 526cafcd4 - Merge pull request #15412 from Kilo-Org/dependabot-vite (Andrea Giammarchi, 2026-10-23)
- 0377248fb - chore(deps): vite updated due launch-editor dependabot alerts (webreflection, 2026-10-23)
- 62351b420 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-10-23)
- 5f2aa0b32 - chore(deps): DOMPurify updated due dependabot alerts (webreflection, 2026-10-23)
- f1040145e - Merge pull request #15194 from Kilo-Org/docs/auto-sync/other (Andrea Giammarchi, 2026-10-23)
- ca7b85ae1 - Merge pull request #15193 from Kilo-Org/docs/auto-sync/vscode (Andrea Giammarchi, 2026-10-23)
- 763e4366c - Merge pull request #15406 from Kilo-Org/fix/security-findings-argument-limit (Bruno Agatão, 2026-10-23)
- 26386d77d - fix(ci): pass security alerts to jq as files (Bruno Agatao, 2026-10-23)
- e8cce9985 - Merge remote-tracking branch 'origin/main' into HEAD (github-actions[bot], 2026-10-23)
- eb11204e8 - release: v7.8.17 (kilo-maintainer[bot], 2026-10-23)
- e4e347a0e - release: v7.8.16 (kilo-maintainer[bot], 2026-10-22)
- 1b2fb4072 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-10-22)
- 145b306b3 - Merge pull request #15365 from Kilo-Org/update-bun-for-ssl-security (Joshua Lambert, 2026-10-22)
- 028636a08 - Merge pull request #15383 from Kilo-Org/chore/bump-open (Marius, 2026-10-22)
- 44b21a719 - fix(deps): override transitive open versions (Josh Lambert, 2026-10-22)
- 0849a766f - fix(ci): retain an explicit lower-priority Ubuntu mirror fallback (Igor Šćekić, 2026-10-22)
- 82926fb30 - fix(cli): restrict browser and MCP OAuth URLs to HTTP(S) (Josh Lambert, 2026-10-22)
- 6b2ff716b - fix(ci): use the Ubuntu HTTPS archive for visual dependencies (Igor Šćekić, 2026-10-22)
- 3481ee196 - test(vscode): finalize native rendering regression boundaries (Igor Šćekić, 2026-10-22)
- 851f44dec - chore(nix): regenerate native CLI dependency hashes (Igor Šćekić, 2026-10-22)
- 67fc89bb9 - test(vscode): cover native tool transcript interactions (Igor Šćekić, 2026-10-22)
- ca265eef5 - chore(deps): bump open to 11.0.4 (marius-kilocode, 2026-10-22)
- a4fa222cd - fix(nix): include CLI build inputs and preserve the native loader (Igor Šćekić, 2026-10-22)
- 30a8cb4f8 - fix(cli): validate cache ownership without passwd lookups (Igor Šćekić, 2026-10-22)
- c2429d6f3 - fix(cli): isolate pinned runtime caches and repair browser test setup (Igor Šćekić, 2026-10-22)
- 48d17ad54 - test(ui): compile Solid JSX for Bun 1.4.4 tests (marius-kilocode, 2026-10-22)
- 4b1f92b02 - chore(cli): pin Bun 1.4.4 for the certificate fix (marius-kilocode, 2026-10-22)
- f7a4b05ad - Merge pull request #15234 from Kilo-Org/need-more-telemetry-in-omni-for-kilo-s-marketplace (Andrea Giammarchi, 2026-10-22)
- 46a1e54e6 - fix(cli): log and verify the selected Bun runtime artifact (marius-kilocode, 2026-10-22)
- 39381e657 - chore: restore main's diff panel visual baseline (webreflection, 2026-10-22)
- 9783d3d2d - Merge pull request #15375 from Kilo-Org/jetbrains/release/v7.1.12 (Kirill Kalishev, 2026-10-22)
- f327945db - docs(jetbrains): edit changelog for v7.1.12 (Kirill Kalishev, 2026-10-22)
- fc1cfc98d - release(jetbrains): v7.1.12 (kilo-maintainer[bot], 2026-10-22)
- 17e4bb824 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-10-22)
- 42bcccd39 - Merge remote-tracking branch 'origin/main' into need-more-telemetry-in-omni-for-kilo-s-marketplace (webreflection, 2026-10-22)
- e08cc5429 - Merge pull request #15262 from Kilo-Org/chore/jetbrains-cli-pin-v7.8.15 (Kirill Kalishev, 2026-10-22)
- bac469be3 - fix(cli): harden pinned runtime cache and validation (marius-kilocode, 2026-10-22)
- 3ef6b2352 - fix(jetbrains): subscribe before returning from session startup (marius-kilocode, 2026-10-22)
- 81426ab56 - fix(ci): support the pinned Bun canary (marius-kilocode, 2026-10-22)
- c7b9c3696 - fix(cli): block compromised eMudhra certificates (marius-kilocode, 2026-10-22)
- 7403eb21b - Merge remote-tracking branch 'origin/main' into HEAD (github-actions[bot], 2026-10-22)
- 670168548 - Merge remote-tracking branch 'origin/main' into HEAD (github-actions[bot], 2026-10-20)
- 355dc965f - Merge remote-tracking branch 'origin/main' into HEAD (github-actions[bot], 2026-10-20)
- 76692782f - chore(jetbrains): bump CLI pin to v7.8.15 (kilo-maintainer[bot], 2026-10-19)
- ea76a2ee9 - Merge branch 'main' into need-more-telemetry-in-omni-for-kilo-s-marketplace (Andrea Giammarchi, 2026-10-19)
- 7e789bbee - fix(metrics): Pair every MCP sign-in start with a completion (webreflection, 2026-10-19)
- df43b6526 - Merge remote-tracking branch 'origin/need-more-telemetry-in-omni-for-kilo-s-marketplace' into need-more-telemetry-in-omni-for-kilo-s-marketplace (webreflection, 2026-10-19)
- df98111b3 - fix(metrics): Keep sign-in interrupts and displaced flows accurate in MCP auth telemetry (webreflection, 2026-10-19)
- 82f9e1507 - Merge branch 'main' into need-more-telemetry-in-omni-for-kilo-s-marketplace (Andrea Giammarchi, 2026-10-19)
- 60f1ad7f1 - chore(metrics): Track MCP sign-in outcomes and catalog OAuth requirements (webreflection, 2026-10-19)
- daf9e8afd - docs: sync other with merged PRs (2026-10-17) (github-actions[bot], 2026-10-17)
- 234bb8a0a - docs: sync vscode with merged PRs (2026-10-17) (github-actions[bot], 2026-10-17)

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
- `packages/core/package.json` (+2, -1)
- `packages/core/src/open.ts` (+9, -0)
- `packages/core/test/kilocode/open.test.ts` (+23, -0)

#### Other Changes
- `.changeset/dompurify-3-4-17.md` (+5, -0)
- `.changeset/jetbrains-prompt-rail-hover.md` (+0, -5)
- `.changeset/mcp-prompt-shell-expansion.md` (+0, -5)
- `.changeset/restore-session-pr-ingest.md` (+0, -5)
- `.changeset/session-host-cloud-adapter.md` (+0, -5)
- `.changeset/vite-7-3-7.md` (+5, -0)
- `.github/actions/setup-bun/action.yml` (+16, -21)
- `.github/workflows/check-forbidden-strings.yml` (+3, -1)
- `.github/workflows/check-kilo-generated-artifacts.yml` (+3, -1)
- `.github/workflows/check-md-table-padding.yml` (+5, -1)
- `.github/workflows/check-opencode-annotations.yml` (+5, -1)
- `.github/workflows/community-label.yml` (+2, -2)
- `.github/workflows/community-sweep.yml` (+2, -2)
- `.github/workflows/community-triage-test.yml` (+2, -2)
- `.github/workflows/outdated-kilo-deps.yml` (+2, -2)
- `.github/workflows/publish.yml` (+5, -0)
- `.github/workflows/security-findings-notify.yml` (+8, -1)
- `.github/workflows/source-check-links.yml` (+5, -1)
- `.github/workflows/stale-alerts-report.yml` (+2, -2)
- `.github/workflows/stale-bot-pr-notify.yml` (+2, -2)
- `.github/workflows/test-jetbrains.yml` (+2, -2)
- `.github/workflows/visual-regression.yml` (+14, -2)
- `CONTRIBUTING.md` (+16, -2)
- `artifacts/glm52-rise-video/package.json` (+1, -1)
- `bun.lock` (+57, -128)
- `nix/bun.nix` (+15, -23)
- `nix/hashes.json` (+4, -4)
- `nix/node_modules.nix` (+6, -1)
- `package.json` (+8, -7)
- `packages/client/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/containers/bun-node/Dockerfile` (+6, -4)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/httpapi-codegen/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-docs/LEARNINGS.md` (+3, -3)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/platforms/vscode/index.md` (+4, -0)
- `packages/kilo-docs/pages/contributing/development-environment.md` (+14, -2)
- `packages/kilo-docs/pnpm-lock.yaml` (+101, -84)
- `packages/kilo-gateway/package.json` (+2, -2)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/CHANGELOG.md` (+29, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendSessionManager.kt` (+3, -1)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendSessionManagerTest.kt` (+37, -2)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-jetbrains/script/sbom.ts` (+6, -4)
- `packages/kilo-memory/package.json` (+1, -1)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-telemetry/src/__tests__/telemetry.test.ts` (+4, -0)
- `packages/kilo-telemetry/src/events.ts` (+2, -0)
- `packages/kilo-telemetry/src/index.ts` (+6, -1)
- `packages/kilo-telemetry/src/telemetry.ts` (+41, -0)
- `packages/kilo-ui/package.json` (+2, -2)
- `packages/kilo-vscode/CHANGELOG.md` (+2, -0)
- `packages/kilo-vscode/package.json` (+2, -2)
- `packages/kilo-vscode/tests/fixtures/native-tool-render.tsx` (+177, -0)
- `packages/kilo-vscode/tests/fixtures/run.ts` (+1, -1)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/setup/worker-url.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/kilo-ui-contract.test.ts` (+5, -150)
- `packages/kilo-vscode/tests/unit/project-state-handlers.test.ts` (+2, -0)
- `packages/kilo-vscode/tests/unit/speech-to-text-prewarm.test.ts` (+16, -8)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+15, -0)
- `packages/opencode/package.json` (+2, -2)
- `packages/opencode/script/build.ts` (+16, -1)
- `packages/opencode/script/kilocode/sbom.ts` (+11, -2)
- `packages/opencode/src/cli/cmd/account.ts` (+2, -2)
- `packages/opencode/src/kilocode/anaconda-desktop/tui/setup.tsx` (+2, -2)
- `packages/opencode/src/kilocode/cli/cmd/console.ts` (+2, -2)
- `packages/opencode/src/kilocode/marketplace/installer.ts` (+2, -49)
- `packages/opencode/src/kilocode/marketplace/mcp-entry.ts` (+51, -0)
- `packages/opencode/src/kilocode/marketplace/schema.ts` (+14, -0)
- `packages/opencode/src/kilocode/mcp-oauth-callback.ts` (+54, -0)
- `packages/opencode/src/kilocode/mcp/auth-telemetry.ts` (+437, -0)
- `packages/opencode/src/mcp/browser.ts` (+2, -2)
- `packages/opencode/src/mcp/index.ts` (+10, -1)
- `packages/opencode/src/mcp/oauth-callback.ts` (+6, -6)
- `packages/opencode/src/mcp/oauth-provider.ts` (+6, -0)
- `packages/opencode/src/plugin/digitalocean.ts` (+2, -2)
- `packages/opencode/src/plugin/snowflake-cortex.ts` (+2, -2)
- `packages/opencode/test/kilocode/marketplace-schema.test.ts` (+68, -0)
- `packages/opencode/test/kilocode/mcp/auth-telemetry.test.ts` (+612, -0)
- `packages/opencode/test/kilocode/sbom.test.ts` (+23, -2)
- `packages/opencode/test/mcp/oauth-provider.test.ts` (+32, -0)
- `packages/opencode/test/plugin/openai-ws.test.ts` (+1, -1)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/protocol/package.json` (+1, -1)
- `packages/schema/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk-next/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+5, -0)
- `packages/sdk/openapi.json` (+15, -0)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+2, -2)
- `packages/storybook/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -2)
- `packages/tui/src/app.tsx` (+2, -2)
- `packages/tui/src/component/dialog-retry-action.tsx` (+2, -2)
- `packages/tui/src/kilocode/link-interactions.ts` (+2, -2)
- `packages/tui/src/ui/link.tsx` (+2, -2)
- `packages/ui/bunfig.toml` (+3, -0)
- `packages/ui/package.json` (+2, -2)
- `packages/ui/src/kilocode/markdown-bidi.test.ts` (+17, -0)
- `packages/ui/test/solid-jsx.ts` (+21, -0)
- `patches/@ff-labs%2Ffff-bun@0.9.4.patch` (+79, -35)
- `patches/@silvia-odwyer%2Fphoton-node@0.3.4.patch` (+3, -3)
- `script/kilocode/bun-probe.test.ts` (+42, -0)
- `script/kilocode/bun-probe.ts` (+108, -0)
- `script/kilocode/bun.json` (+98, -0)
- `script/kilocode/bun.test.ts` (+299, -0)
- `script/kilocode/bun.ts` (+126, -0)
- `script/kilocode/sbom-products.test.ts` (+5, -0)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index a733cd8ac..16dfec38b 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.8.15",
+  "version": "7.8.17",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
@@ -79,6 +79,7 @@
     "mime-types": "3.0.2",
     "minimatch": "10.2.6",
     "npm-package-arg": "13.0.2",
+    "open": "11.0.4",
     "rotating-file-stream": "3.2.9",
     "semver": "^7.6.3",
     "xdg-basedir": "5.1.0",
```

#### packages/core/src/open.ts
```diff
diff --git a/packages/core/src/open.ts b/packages/core/src/open.ts
new file mode 100644
index 000000000..bbbcbe8ff
--- /dev/null
+++ b/packages/core/src/open.ts
@@ -0,0 +1,9 @@
+// kilocode_change - new file: backport upstream browser URL validation
+import open from "open"
+
+export function openUrl(input: string) {
+  const url = URL.canParse(input) ? new URL(input) : undefined
+  if (!url || (url.protocol !== "http:" && url.protocol !== "https:"))
+    return Promise.reject(new Error(`Only http and https links can be opened in the browser: ${input}`))
+  return open(url.href)
+}
```

#### packages/core/test/kilocode/open.test.ts
```diff
diff --git a/packages/core/test/kilocode/open.test.ts b/packages/core/test/kilocode/open.test.ts
new file mode 100644
index 000000000..9ca110326
--- /dev/null
+++ b/packages/core/test/kilocode/open.test.ts
@@ -0,0 +1,23 @@
+import { describe, expect, test } from "bun:test"
+import { openUrl } from "../../src/open"
+
+describe("openUrl", () => {
+  test("rejects values that are not URLs", async () => {
+    for (const input of ["not a url", ""]) {
+      const err = await openUrl(input).catch((err: unknown) => err)
+      expect(err).toMatchObject({ message: expect.stringContaining("Only http and https links") })
+    }
+  })
+
+  test("rejects non-http schemes", async () => {
+    for (const input of [
+      "file:///etc/hosts",
+      "javascript:alert(1)",
+      "ms-msdt:/id PCWDiagnostic",
+      "\\\\server\\share\\file.html",
+    ]) {
+      const err = await openUrl(input).catch((err: unknown) => err)
+      expect(err).toMatchObject({ message: expect.stringContaining("Only http and https links") })
+    }
+  })
+})
```


## opencode Changes (f7d5b6f..2a3e7c0)

### Commits

- 2a3e7c0 - sync release versions for v2.1.4 [skip ci] (opencode, 2026-10-23)
- 74f8d48 - fix(cli): install musl native packages for cross builds on Bun 1.4.4 (#58398) (Luke Parker, 2026-10-23)
- a5dddc5 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-10-23)
- c9c1dc0 - chore: upgrade opentui v0.6.8 (#58380) (Simon Klee, 2026-10-23)
- 4d30794 - fix(core): use the agent's model when a session has none (#58355) (Aiden Cline, 2026-10-23)
- 8ecd6ad - fix(core): don't duplicate MCP servers started during initial reconciliation (#58349) (Aiden Cline, 2026-10-23)
- 7b14ad4 - fix(core): stop MCP servers in parallel on shutdown (#58351) (Aiden Cline, 2026-10-23)
- 09399e3 - fix(app): show file change count before label (#58353) (Brendan Allan, 2026-10-23)
- bdf7572 - fix(app): bundle worker dependency subpaths in dev pre-bundles (#58345) (Aiden Cline, 2026-10-23)
- 309522f - fix(core): keep MCP OAuth login waiting after stray callback requests (#58342) (Aiden Cline, 2026-10-22)
- e49157b - fix(core): keep remote MCP requests open past Bun's fetch idle timeout (#58341) (Luke Parker, 2026-10-23)
- 8482dbf - fix(app): show MCP elicitation forms in desktop and web (#58305) (Aiden Cline, 2026-10-23)
- ea4f0ca - docs(www): drop invalid cli.json fallback wording (#58333) (DS, 2026-10-22)
- 2a381f8 - feat(core): move ChatGPT context caps into a separate plugin (#58194) (Aiden Cline, 2026-10-22)
- 33726e8 - fix(core): ignore a compaction buffer that leaves the model no room (#58313) (Aiden Cline, 2026-10-22)
- 5f79a2a - feat(desktop): add native memory breakdown to heap captures (#58311) (Luke Parker, 2026-10-23)
- f523f77 - feat(core): rename precompute_compaction to background_compaction and document it (#58294) (Aiden Cline, 2026-10-22)
- 4e0bc52 - docs(www): update example models (#58290) (DS, 2026-10-22)
- 1b0c130 - docs(www): fix outdated V2 docs (#58280) (DS, 2026-10-22)
- 51599c4 - docs(web): update example models (#58296) (DS, 2026-10-22)
- 35adacb - docs: link apps and READMEs to V2 docs (#58289) (DS, 2026-10-22)
- ea1f209 - docs: fix build code samples (#58281) (DS, 2026-10-23)
- 58a2066 - docs: remove outdated website claims (#58282) (DS, 2026-10-22)
- ff83632 - docs(console): sync with current Console (#58279) (DS, 2026-10-22)
- db52b18 - docs: remove V2 details from V1 docs (#58277) (DS, 2026-10-22)
- 2633a8b - docs: fix install directory in READMEs (#58276) (DS, 2026-10-22)
- 1951c20 - docs: fix V1 SDK and CI examples (#58275) (DS, 2026-10-22)
- 53730da - docs: fix outdated V1 docs (#58274) (DS, 2026-10-22)
- 1e4661a - docs: fix broken translated pages (#58278) (DS, 2026-10-22)
- 8c5b202 - fix(stats): send User-Agent for GitHub star count (#58283) (opencode-agent[bot], 2026-10-23)
- 286425f - chore(core): refresh bundled models.dev snapshot (opencode-agent[bot], 2026-10-23)
- bc3a709 - refactor(client,schema): remove duplicate helpers and unused schema exports (#57999) (Aiden Cline, 2026-10-22)
- 9624ff1 - refactor(core): deduplicate session token types and tighten provider plugins (#57994) (Aiden Cline, 2026-10-22)
- 199ad46 - feat(desktop): capture app and server heap snapshots into one folder (#58259) (Luke Parker, 2026-10-23)
- 91a7fe5 - fix(desktop): stop AppImage executable name ending in .desktop (#58263) (Imamuzzaki Abu Salam, 2026-10-23)
- 7a62a46 - refactor: remove redundant casts and duplicate helpers across sdk, plugin, codemode, and schema (#57996) (Aiden Cline, 2026-10-22)
- cca52cf - refactor(ai): decode WebSocket frames once and derive provider option types from schemas (#58001) (Aiden Cline, 2026-10-22)
- 318e83e - fix: regenerate broken OpenAPI documents and check them in CI (#58262) (Luke Parker, 2026-10-23)
- 5f8c158 - fix(core): attribute V1 global sessions during import (#56322) (Aiden Cline, 2026-10-22)
- 3043868 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-10-22)
- 096c2ba - chore(core): update MCP SDK to 2.3.1 (#58232) (Aiden Cline, 2026-10-22)
- 84578e1 - chore: use bun check for local typechecks and TypeScript 7.1 in CI (#58253) (Luke Parker, 2026-10-23)
- 3d21312 - docs: drop V1 references from opencode-dev skill (#58257) (opencode-agent[bot], 2026-10-22)
- 6102079 - feat(cli): add debug heap-dump command (#58252) (Luke Parker, 2026-10-23)
- d93568f - fix(deps): drop vulnerable nested seroval from @solidjs/start (#58229) (opencode-agent[bot], 2026-10-22)
- 5bae6d4 - fix(core): read agent files with V2 fields as V2 (#58218) (Aiden Cline, 2026-10-22)
- cd1861d - chore: update nix node_modules hashes (opencode-agent[bot], 2026-10-22)
- 702b813 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-10-22)
- c41c3a0 - fix(core): accept MCP tools whose output schema is not a root object (#58224) (Aiden Cline, 2026-10-22)
- 0b93f0b - feat(tui): expose open_terminal over client MCP (experimental) (#57506) (James Long, 2026-10-22)
- 4a6dace - feat(server): add client MCP websocket endpoint (experimental) (#57505) (James Long, 2026-10-22)
- 561b273 - test(client): fix connectClientMcp test on Bun 1.4.4 (#58217) (James Long, 2026-10-22)
- 889abb4 - fix(core): fix MCP elicitation forms never appearing (#58184) (Aiden Cline, 2026-10-22)
- 4535146 - feat(client): add connectClientMcp helper for client-hosted MCP tools (#57504) (James Long, 2026-10-22)
- 76fd05f - refactor(ai): remove unused exports and redundant String coercions (#57995) (Aiden Cline, 2026-10-22)
- ac68d6a - fix(core): shorten compaction transcripts oldest first before dropping history (#58015) (Aiden Cline, 2026-10-22)
- 0030a70 - feat(core): add MCP transport over incoming client sockets (#57502) (James Long, 2026-10-22)
- cdf1c20 - fix(core): hide Codex models ChatGPT accounts reject (#58180) (Aiden Cline, 2026-10-22)
- 6a5973d - feat(core): add experimental background compaction summaries (#57444) (Filip, 2026-10-22)
- 09a1db3 - fix(ai): recognize more context overflow errors (#57982) (Aiden Cline, 2026-10-22)
- ad5336e - fix(infra): restore cloudflare 6.15.0 provider pin (#58158) (Dax, 2026-10-22)
- 27cdf5f - refactor(ai): avoid repeated option and SSE frame decoding in OpenAI protocols (#57993) (Aiden Cline, 2026-10-22)
- 7d771fb - ci: remove docs-update workflow (#58161) (Dax, 2026-10-22)
- 080e92d - refactor(server): remove dead PtyEnvironment service and simplify route handlers (#57992) (Aiden Cline, 2026-10-22)
- f8d3f34 - refactor(util): remove unused runtime wrappers and dead helpers (#57991) (Aiden Cline, 2026-10-22)
- c7a59b7 - fix(infra): drop applied Api Durable Object migration (#57637) (Dax, 2026-10-22)
- 58d5c02 - feat(tui): tell users to start OpenCode again after an update restart (#58139) (opencode-agent[bot], 2026-10-22)
- 62c9002 - docs(skill): explain config changes apply without restart (#58109) (opencode-agent[bot], 2026-10-22)
- 074f2fe - docs(go): replace MiniMax M3.1 Flash Free with paid MiniMax M3.1 Flash (#58102) (opencode-agent[bot], 2026-10-22)
- e965774 - sync release versions for v2.1.3 [skip ci] (opencode, 2026-10-22)
- 52a7f4a - chore(core): refresh bundled models.dev snapshot (opencode-agent[bot], 2026-10-22)
- b42c316 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-10-22)
- 37d9737 - chore: bump Bun to 1.4.4 (#58087) (opencode-agent[bot], 2026-10-22)
- da87177 - fix(desktop): stop RPM build-id links conflicting with other Electron apps (#58093) (opencode-agent[bot], 2026-10-22)

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
- `packages/core/package.json` (+6, -5)
- `packages/core/script/publish.ts` (+1, -1)
- `packages/core/src/config/normalize.ts` (+9, -0)
- `packages/core/src/config/plugin/agent.ts` (+13, -4)
- `packages/core/src/config/plugin/compaction.ts` (+1, -0)
- `packages/core/src/database/v1-migration.bun.ts` (+94, -16)
- `packages/core/src/mcp/client.ts` (+41, -21)
- `packages/core/src/mcp/index.ts` (+164, -6)
- `packages/core/src/mcp/oauth.ts` (+14, -3)
- `packages/core/src/mcp/socket-client.ts` (+88, -0)
- `packages/core/src/models-dev/snapshot.txt` (+1, -1)
- `packages/core/src/plugin/provider.ts` (+2, -0)
- `packages/core/src/plugin/provider/google-vertex.ts` (+4, -3)
- `packages/core/src/plugin/provider/openai-context-caps.ts` (+56, -0)
- `packages/core/src/plugin/provider/openai.ts` (+3, -12)
- `packages/core/src/plugin/provider/xai.ts` (+1, -1)
- `packages/core/src/plugin/skill/opencode.md` (+7, -1)
- `packages/core/src/project.ts` (+12, -6)
- `packages/core/src/pty/ticket.ts` (+25, -7)
- `packages/core/src/session/compaction.ts` (+336, -82)
- `packages/core/src/session/projector.ts` (+2, -6)
- `packages/core/src/session/recent-text.ts` (+3, -1)
- `packages/core/src/session/runner/llm.ts` (+9, -1)
- `packages/core/src/session/runner/model.ts` (+10, -2)
- `packages/core/src/session/stats.ts` (+3, -8)
- `packages/core/test/config/agent.test.ts` (+53, -0)
- `packages/core/test/config/normalization.test.ts` (+2, -0)
- `packages/core/test/fixture/mcp-union-output-schema.ts` (+41, -0)
- `packages/core/test/fixture/mcp.ts` (+1, -0)
- `packages/core/test/mcp-attach.test.ts` (+402, -0)
- `packages/core/test/mcp-oauth.test.ts` (+31, -0)
- `packages/core/test/mcp-socket-client.test.ts` (+225, -0)
- `packages/core/test/mcp.test.ts` (+127, -12)
- `packages/core/test/plugin/provider-openai-context-caps.test.ts` (+78, -0)
- `packages/core/test/plugin/provider-openai.test.ts` (+7, -26)
- `packages/core/test/pty/ticket.test.ts` (+12, -0)
- `packages/core/test/session-compaction.test.ts` (+269, -22)
- `packages/core/test/session-runner.test.ts` (+68, -27)
- `packages/core/test/v1-migration.test.ts` (+75, -2)
- `packages/stats/core/package.json` (+3, -2)

#### Other Changes
- `.github/workflows/check.yml` (+6, -2)
- `.github/workflows/deploy-changelog.yml` (+1, -1)
- `.github/workflows/deploy-files.yml` (+1, -1)
- `.github/workflows/deploy-update.yml` (+1, -1)
- `.github/workflows/docs-update.yml` (+0, -72)
- `.github/workflows/publish.yml` (+2, -2)
- `.github/workflows/test.yml` (+5, -0)
- `.opencode/skills/opencode-dev/SKILL.md` (+42, -49)
- `AGENTS.md` (+2, -0)
- `CHANGELOG.md` (+119, -0)
- `README.ar.md` (+3, -14)
- `README.bn.md` (+3, -14)
- `README.br.md` (+3, -14)
- `README.bs.md` (+3, -14)
- `README.da.md` (+3, -14)
- `README.de.md` (+3, -14)
- `README.es.md` (+3, -14)
- `README.fr.md` (+3, -14)
- `README.gr.md` (+3, -14)
- `README.it.md` (+3, -14)
- `README.ja.md` (+3, -14)
- `README.ko.md` (+3, -14)
- `README.md` (+3, -14)
- `README.no.md` (+3, -14)
- `README.pl.md` (+3, -14)
- `README.ru.md` (+3, -14)
- `README.th.md` (+3, -14)
- `README.tr.md` (+3, -14)
- `README.uk.md` (+3, -14)
- `README.vi.md` (+3, -14)
- `README.zh.md` (+3, -14)
- `README.zht.md` (+3, -14)
- `bun.lock` (+250, -699)
- `bunfig.toml` (+1, -1)
- `infra/app.ts` (+0, -7)
- `nix/hashes.json` (+3, -3)
- `package.json` (+10, -9)
- `packages/ai/package.json` (+3, -2)
- `packages/ai/src/experimental/evaluation.ts` (+2, -11)
- `packages/ai/src/protocols/anthropic-messages.ts` (+3, -4)
- `packages/ai/src/protocols/bedrock-converse.ts` (+2, -4)
- `packages/ai/src/protocols/gemini.ts` (+2, -2)
- `packages/ai/src/protocols/google-interactions.ts` (+2, -2)
- `packages/ai/src/protocols/mistral-chat.ts` (+5, -14)
- `packages/ai/src/protocols/open-responses-channel.ts` (+84, -76)
- `packages/ai/src/protocols/open-responses-continuation.ts` (+18, -3)
- `packages/ai/src/protocols/open-responses.ts` (+8, -7)
- `packages/ai/src/protocols/openai-chat.ts` (+3, -3)
- `packages/ai/src/protocols/openai-compatible-chat.ts` (+1, -3)
- `packages/ai/src/protocols/openai-compatible-responses.ts` (+1, -3)
- `packages/ai/src/protocols/openai-responses.ts` (+1, -1)
- `packages/ai/src/protocols/openai-transcription.ts` (+13, -6)
- `packages/ai/src/protocols/utils/partial-json-options.ts` (+0, -2)
- `packages/ai/src/protocols/venice-chat.ts` (+8, -32)
- `packages/ai/src/protocols/zai-chat.ts` (+12, -18)
- `packages/ai/src/protocols/zai-messages.ts` (+6, -8)
- `packages/ai/src/provider-error.ts` (+5, -3)
- `packages/ai/src/providers/cloudflare-ai-gateway.ts` (+1, -2)
- `packages/ai/src/providers/google-vertex.ts` (+2, -2)
- `packages/ai/src/providers/open-responses-options.ts` (+0, -2)
- `packages/ai/src/providers/openai-compatible.ts` (+1, -2)
- `packages/ai/src/providers/openai-options.ts` (+0, -2)
- `packages/ai/src/route/auth-options.ts` (+0, -12)
- `packages/ai/src/route/auth.ts` (+0, -5)
- `packages/ai/src/route/client.ts` (+3, -8)
- `packages/ai/src/route/executor-service.ts` (+1, -1)
- `packages/ai/test/auth-options.types.ts` (+3, -3)
- `packages/ai/test/provider-error.test.ts` (+3, -0)
- `packages/app/e2e/regression/review.spec.ts` (+4, -4)
- `packages/app/e2e/regression/side-panels.spec.ts` (+1, -1)
- `packages/app/package.json` (+6, -5)
- `packages/app/playwright.components.config.ts` (+4, -1)
- `packages/app/src/composer/state.ts` (+35, -1)
- `packages/app/src/providers/credentials/dialog.tsx` (+1, -1)
- `packages/app/src/runtime/i18n/en.ts` (+1, -0)
- `packages/app/src/session/composer/session-composer-region.tsx` (+16, -1)
- `packages/app/src/session/requests/model.ts` (+29, -1)
- `packages/app/src/session/requests/session-elicitation-dock.css` (+49, -0)
- `packages/app/src/session/requests/session-elicitation-dock.tsx` (+288, -0)
- `packages/app/src/session/requests/session-request-tree.test.ts` (+8, -0)
- `packages/app/src/session/requests/session-request-tree.ts` (+5, -2)
- `packages/app/src/session/session-screen.stories.tsx` (+53, -0)
- `packages/app/src/session/story-model.tsx` (+4, -1)
- `packages/app/src/settings/appearance/appearance.tsx` (+1, -1)
- `packages/app/src/settings/providers/extensions.tsx` (+1, -1)
- `packages/app/src/settings/workspaces/project-extensions.tsx` (+1, -1)
- `packages/app/src/shell/commands/desktop-menu.ts` (+12, -5)
- `packages/app/test-browser/fixtures/model-selection.ts` (+3, -2)
- `packages/app/vite.js` (+2, -1)
- `packages/cli/package.json` (+3, -2)
- `packages/cli/script/build.ts` (+2, -1)
- `packages/cli/src/commands/commands.ts` (+13, -0)
- `packages/cli/src/commands/handlers/debug/heap-dump.ts` (+63, -0)
- `packages/cli/src/heap.ts` (+4, -13)
- `packages/cli/src/index.ts` (+1, -0)
- `packages/cli/test/debug-heap-dump.test.ts` (+122, -0)
- `packages/client/package.json` (+6, -3)
- `packages/client/script/publish.ts` (+1, -1)
- `packages/client/src/effect/api/api.ts` (+25, -1)
- `packages/client/src/effect/generated/client.ts` (+19, -0)
- `packages/client/src/effect/service.ts` (+1, -1)
- `packages/client/src/mcp.ts` (+175, -0)
- `packages/client/src/promise/generated/client.ts` (+31, -0)
- `packages/client/src/promise/generated/types.ts` (+29, -6)
- `packages/client/src/pty-handoff.ts` (+5, -4)
- `packages/client/src/solid/data.ts` (+14, -18)
- `packages/client/test/import-boundaries.test.ts` (+5, -0)
- `packages/client/test/mcp.test.ts` (+257, -0)
- `packages/client/test/promise.test.ts` (+1, -1)
- `packages/codemode/package.json` (+3, -2)
- `packages/codemode/script/publish.ts` (+1, -1)
- `packages/codemode/src/stdlib/url.ts` (+1, -1)
- `packages/console/app/package.json` (+3, -2)
- `packages/console/app/src/component/go-models.ts` (+2, -10)
- `packages/console/app/src/config.ts` (+2, -2)
- `packages/console/app/src/i18n/ar.ts` (+5, -11)
- `packages/console/app/src/i18n/br.ts` (+5, -11)
- `packages/console/app/src/i18n/da.ts` (+5, -11)
- `packages/console/app/src/i18n/de.ts` (+6, -11)
- `packages/console/app/src/i18n/en.ts` (+5, -11)
- `packages/console/app/src/i18n/es.ts` (+5, -11)
- `packages/console/app/src/i18n/fr.ts` (+6, -11)
- `packages/console/app/src/i18n/it.ts` (+6, -11)
- `packages/console/app/src/i18n/ja.ts` (+5, -11)
- `packages/console/app/src/i18n/ko.ts` (+5, -11)
- `packages/console/app/src/i18n/no.ts` (+5, -11)
- `packages/console/app/src/i18n/pl.ts` (+5, -11)
- `packages/console/app/src/i18n/ru.ts` (+5, -11)
- `packages/console/app/src/i18n/th.ts` (+5, -11)
- `packages/console/app/src/i18n/tr.ts` (+5, -11)
- `packages/console/app/src/i18n/uk.ts` (+5, -11)
- `packages/console/app/src/i18n/zh.ts` (+5, -11)
- `packages/console/app/src/i18n/zht.ts` (+7, -11)
- `packages/console/app/src/routes/go/index.tsx` (+1, -7)
- `packages/console/app/src/routes/index.tsx` (+0, -12)
- `packages/containers/bun-node/Dockerfile` (+1, -1)
- `packages/desktop/electron-builder.config.test.ts` (+15, -3)
- `packages/desktop/electron-builder.config.ts` (+28, -4)
- `packages/desktop/package.json` (+3, -2)
- `packages/desktop/resources/linux/opencode-desktop.desktop` (+2, -2)
- `packages/function/package.json` (+1, -1)
- `packages/function/src/share.ts` (+1, -1)
- `packages/gui-extensions/README.md` (+1, -1)
- `packages/gui-extensions/package.json` (+3, -2)
- `packages/gui-extensions/src/debug/contract.ts` (+25, -0)
- `packages/gui-extensions/src/debug/i18n/en.ts` (+7, -0)
- `packages/gui-extensions/src/debug/index.ts` (+2, -0)
- `packages/gui-extensions/src/debug/main.ts` (+210, -0)
- `packages/gui-extensions/src/debug/memory-infra.test.ts` (+89, -0)
- `packages/gui-extensions/src/debug/memory-infra.ts` (+159, -0)
- `packages/gui-extensions/src/debug/renderer.tsx` (+40, -1)
- `packages/gui-extensions/src/debug/server-heap.test.ts` (+60, -0)
- `packages/gui-extensions/src/debug/server-heap.ts` (+63, -0)
- `packages/gui-extensions/src/file/i18n/en.ts` (+2, -2)
- `packages/gui-extensions/src/main.ts` (+1, -1)
- `packages/gui-extensions/src/review/i18n/en.ts` (+2, -2)
- `packages/gui-extensions/src/review/model.ts` (+1, -1)
- `packages/http-recorder/package.json` (+3, -2)
- `packages/httpapi-codegen/package.json` (+3, -2)
- `packages/latex/package.json` (+3, -2)
- `packages/merman/package.json` (+3, -2)
- `packages/plugin-browser/package.json` (+3, -2)
- `packages/plugin-browser/script/publish.ts` (+1, -1)
- `packages/plugin/package.json` (+5, -4)
- `packages/plugin/src/promise/adapter.ts` (+3, -2)
- `packages/plugin/src/promise/agent.ts` (+4, -4)
- `packages/plugin/src/promise/mcp.ts` (+4, -4)
- `packages/plugin/src/promise/model.ts` (+4, -4)
- `packages/plugin/src/promise/provider.ts` (+3, -3)
- `packages/plugin/src/promise/skill.ts` (+4, -4)
- `packages/plugin/src/promise/types.ts` (+0, -9)
- `packages/plugins/figma/package.json` (+5, -4)
- `packages/posts/package.json` (+2, -1)
- `packages/protocol/openapi.json` (+386, -0)
- `packages/protocol/package.json` (+3, -2)
- `packages/protocol/script/publish.ts` (+1, -1)
- `packages/protocol/src/api.ts` (+7, -3)
- `packages/protocol/src/client.ts` (+8, -2)
- `packages/protocol/src/groups/debug.ts` (+36, -0)
- `packages/protocol/src/groups/mcp.ts` (+151, -99)
- `packages/schema/package.json` (+3, -2)
- `packages/schema/script/publish.ts` (+1, -1)
- `packages/schema/src/config/experimental.ts` (+4, -0)
- `packages/schema/src/prompt-input.ts` (+2, -8)
- `packages/schema/src/session-event.ts` (+0, -9)
- `packages/schema/src/session-id.ts` (+3, -7)
- `packages/schema/src/session-message.ts` (+1, -2)
- `packages/schema/src/workspace-id.ts` (+0, -1)
- `packages/sdk/package.json` (+3, -2)
- `packages/sdk/script/publish.ts` (+1, -1)
- `packages/sdk/src/internal/instances.ts` (+1, -2)
- `packages/sdk/src/logging.ts` (+4, -6)
- `packages/server/package.json` (+3, -2)
- `packages/server/script/publish.ts` (+1, -1)
- `packages/server/src/handlers/debug.ts` (+49, -17)
- `packages/server/src/handlers/mcp.ts` (+102, -12)
- `packages/server/src/handlers/message.ts` (+7, -7)
- `packages/server/src/handlers/pty.ts` (+16, -57)
- `packages/server/src/handlers/worktree.ts` (+3, -6)
- `packages/server/src/middleware/authorization.ts` (+5, -2)
- `packages/server/src/process.ts` (+3, -1)
- `packages/server/src/pty-environment.ts` (+0, -19)
- `packages/server/src/routes.ts` (+2, -2)
- `packages/server/test/client-mcp.test.ts` (+305, -0)
- `packages/server/test/fetch.test.ts` (+12, -0)
- `packages/server/test/heap-dump.test.ts` (+137, -0)
- `packages/session-ui/bunfig.toml` (+2, -0)
- `packages/session-ui/package.json` (+3, -2)
- `packages/simulation/package.json` (+3, -2)
- `packages/simulation/script/publish.ts` (+1, -1)
- `packages/stats/app/bunfig.toml` (+2, -0)
- `packages/stats/app/package.json` (+3, -2)
- `packages/stats/app/src/routes/stats-shell.tsx` (+2, -1)
- `packages/stats/server/Dockerfile` (+1, -1)
- `packages/stats/server/package.json` (+3, -2)
- `packages/storybook/.storybook/mocks/app/context/server-current.ts` (+6, -0)
- `packages/theme/package.json` (+3, -2)
- `packages/theme/script/publish.ts` (+1, -1)
- `packages/tui/package.json` (+3, -2)
- `packages/tui/src/app.tsx` (+27, -8)
- `packages/tui/src/component/dialog-experiments.tsx` (+5, -0)
- `packages/tui/src/component/dialog-update.tsx` (+1, -1)
- `packages/tui/src/component/terminal-pane.tsx` (+4, -0)
- `packages/tui/src/config/index.tsx` (+6, -0)
- `packages/tui/src/context/client-mcp.tsx` (+119, -0)
- `packages/tui/src/context/client.tsx` (+10, -2)
- `packages/tui/src/context/epilogue.tsx` (+9, -1)
- `packages/tui/src/context/session-terminals.tsx` (+29, -5)
- `packages/tui/src/context/update-notification.tsx` (+10, -1)
- `packages/tui/src/routes/session/index.tsx` (+3, -4)
- `packages/tui/src/util/presentation.ts` (+12, -5)
- `packages/tui/test/app-lifecycle.test.tsx` (+116, -0)
- `packages/tui/test/client-mcp.test.tsx` (+226, -0)
- `packages/tui/test/util/presentation.test.ts` (+26, -4)
- `packages/ui/bunfig.toml` (+2, -0)
- `packages/ui/package.json` (+3, -2)
- `packages/ui/script/publish.ts` (+2, -1)
- `packages/ui/test/solid-jsx.ts` (+20, -0)
- `packages/util/package.json` (+3, -2)
- `packages/util/script/publish.ts` (+1, -1)
- `packages/util/src/effect/layer-node.ts` (+10, -6)
- `packages/util/src/effect/memo-map.ts` (+0, -3)
- `packages/util/src/effect/runtime.ts` (+0, -21)
- `packages/util/src/effect/service-use.ts` (+0, -43)
- `packages/util/src/flock.ts` (+0, -12)
- `packages/util/src/fs-util.ts` (+0, -12)
- `packages/util/src/glob.ts` (+3, -7)
- `packages/util/src/heap-snapshot.ts` (+44, -0)
- `packages/util/src/no-timeout-fetch.ts` (+1, -1)
- `packages/util/src/npm.ts` (+0, -24)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/acp.mdx` (+1, -1)
- `packages/web/src/content/docs/agents.mdx` (+32, -40)
- `packages/web/src/content/docs/ar/acp.mdx` (+1, -1)
- `packages/web/src/content/docs/ar/agents.mdx` (+20, -20)
- `packages/web/src/content/docs/ar/commands.mdx` (+4, -4)
- `packages/web/src/content/docs/ar/config.mdx` (+9, -9)
- `packages/web/src/content/docs/ar/custom-tools.mdx` (+4, -4)
- `packages/web/src/content/docs/ar/github.mdx` (+11, -11)
- `packages/web/src/content/docs/ar/models.mdx` (+7, -7)
- `packages/web/src/content/docs/ar/permissions.mdx` (+9, -9)
- `packages/web/src/content/docs/ar/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/ar/providers.mdx` (+1, -1)
- `packages/web/src/content/docs/ar/sdk.mdx` (+2, -2)
- `packages/web/src/content/docs/ar/tools.mdx` (+3, -3)
- `packages/web/src/content/docs/ar/troubleshooting.mdx` (+2, -2)
- `packages/web/src/content/docs/bs/acp.mdx` (+1, -1)
- `packages/web/src/content/docs/bs/agents.mdx` (+20, -20)
- `packages/web/src/content/docs/bs/commands.mdx` (+4, -4)
- `packages/web/src/content/docs/bs/config.mdx` (+9, -9)
- `packages/web/src/content/docs/bs/custom-tools.mdx` (+4, -4)
- `packages/web/src/content/docs/bs/github.mdx` (+34, -34)
- `packages/web/src/content/docs/bs/models.mdx` (+7, -7)
- `packages/web/src/content/docs/bs/permissions.mdx` (+9, -9)
- `packages/web/src/content/docs/bs/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/bs/providers.mdx` (+1, -1)
- `packages/web/src/content/docs/bs/sdk.mdx` (+2, -2)
- `packages/web/src/content/docs/bs/tools.mdx` (+3, -3)
- `packages/web/src/content/docs/bs/troubleshooting.mdx` (+2, -2)
- `packages/web/src/content/docs/cli.mdx` (+132, -34)
- `packages/web/src/content/docs/commands.mdx` (+4, -4)
- `packages/web/src/content/docs/config.mdx` (+21, -18)
- `packages/web/src/content/docs/custom-tools.mdx` (+4, -4)
- `packages/web/src/content/docs/da/acp.mdx` (+1, -1)
- `packages/web/src/content/docs/da/agents.mdx` (+20, -20)
- `packages/web/src/content/docs/da/commands.mdx` (+4, -4)
- `packages/web/src/content/docs/da/config.mdx` (+9, -9)
- `packages/web/src/content/docs/da/custom-tools.mdx` (+4, -4)
- `packages/web/src/content/docs/da/github.mdx` (+11, -11)
- `packages/web/src/content/docs/da/models.mdx` (+7, -7)
- `packages/web/src/content/docs/da/permissions.mdx` (+9, -9)
- `packages/web/src/content/docs/da/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/da/providers.mdx` (+1, -1)
- `packages/web/src/content/docs/da/sdk.mdx` (+2, -2)
- `packages/web/src/content/docs/da/tools.mdx` (+3, -3)
- `packages/web/src/content/docs/da/troubleshooting.mdx` (+2, -2)
- `packages/web/src/content/docs/de/acp.mdx` (+1, -1)
- `packages/web/src/content/docs/de/agents.mdx` (+20, -20)
- `packages/web/src/content/docs/de/commands.mdx` (+4, -4)
- `packages/web/src/content/docs/de/config.mdx` (+9, -9)
- `packages/web/src/content/docs/de/custom-tools.mdx` (+1, -1)
- `packages/web/src/content/docs/de/github.mdx` (+11, -11)
- `packages/web/src/content/docs/de/models.mdx` (+7, -7)
- `packages/web/src/content/docs/de/permissions.mdx` (+9, -9)
- `packages/web/src/content/docs/de/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/de/providers.mdx` (+1, -1)
- `packages/web/src/content/docs/de/sdk.mdx` (+2, -2)
- `packages/web/src/content/docs/de/tools.mdx` (+3, -3)
- `packages/web/src/content/docs/de/troubleshooting.mdx` (+2, -2)
- `packages/web/src/content/docs/ecosystem.mdx` (+0, -9)
- `packages/web/src/content/docs/es/acp.mdx` (+1, -1)
- `packages/web/src/content/docs/es/agents.mdx` (+20, -20)
- `packages/web/src/content/docs/es/commands.mdx` (+4, -4)
- `packages/web/src/content/docs/es/config.mdx` (+9, -9)
- `packages/web/src/content/docs/es/custom-tools.mdx` (+4, -4)
- `packages/web/src/content/docs/es/github.mdx` (+11, -11)
- `packages/web/src/content/docs/es/models.mdx` (+7, -7)
- `packages/web/src/content/docs/es/permissions.mdx` (+9, -9)
- `packages/web/src/content/docs/es/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/es/providers.mdx` (+1, -1)
- `packages/web/src/content/docs/es/sdk.mdx` (+2, -2)
- `packages/web/src/content/docs/es/tools.mdx` (+3, -3)
- `packages/web/src/content/docs/es/troubleshooting.mdx` (+2, -2)
- `packages/web/src/content/docs/formatters.mdx` (+0, -1)
- `packages/web/src/content/docs/fr/acp.mdx` (+1, -1)
- `packages/web/src/content/docs/fr/agents.mdx` (+20, -20)
- `packages/web/src/content/docs/fr/commands.mdx` (+4, -4)
- `packages/web/src/content/docs/fr/config.mdx` (+9, -9)
- `packages/web/src/content/docs/fr/custom-tools.mdx` (+1, -1)
- `packages/web/src/content/docs/fr/github.mdx` (+34, -34)
- `packages/web/src/content/docs/fr/models.mdx` (+7, -7)
- `packages/web/src/content/docs/fr/permissions.mdx` (+9, -9)
- `packages/web/src/content/docs/fr/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/fr/providers.mdx` (+4, -6)
- `packages/web/src/content/docs/fr/sdk.mdx` (+2, -2)
- `packages/web/src/content/docs/fr/tools.mdx` (+2, -2)
- `packages/web/src/content/docs/fr/troubleshooting.mdx` (+2, -2)
- `packages/web/src/content/docs/github.mdx` (+23, -19)
- `packages/web/src/content/docs/gitlab.mdx` (+11, -9)
- `packages/web/src/content/docs/ide.mdx` (+6, -17)
- `packages/web/src/content/docs/index.mdx` (+5, -3)
- `packages/web/src/content/docs/it/acp.mdx` (+1, -1)
- `packages/web/src/content/docs/it/agents.mdx` (+20, -20)
- `packages/web/src/content/docs/it/commands.mdx` (+4, -4)
- `packages/web/src/content/docs/it/config.mdx` (+9, -9)
- `packages/web/src/content/docs/it/custom-tools.mdx` (+4, -4)
- `packages/web/src/content/docs/it/github.mdx` (+11, -11)
- `packages/web/src/content/docs/it/models.mdx` (+7, -7)
- `packages/web/src/content/docs/it/permissions.mdx` (+9, -9)
- `packages/web/src/content/docs/it/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/it/providers.mdx` (+1, -1)
- `packages/web/src/content/docs/it/sdk.mdx` (+2, -2)
- `packages/web/src/content/docs/it/tools.mdx` (+3, -3)
- `packages/web/src/content/docs/it/troubleshooting.mdx` (+2, -2)
- `packages/web/src/content/docs/ja/acp.mdx` (+1, -1)
- `packages/web/src/content/docs/ja/agents.mdx` (+20, -20)
- `packages/web/src/content/docs/ja/commands.mdx` (+4, -4)
- `packages/web/src/content/docs/ja/config.mdx` (+9, -9)
- `packages/web/src/content/docs/ja/custom-tools.mdx` (+4, -4)
- `packages/web/src/content/docs/ja/github.mdx` (+34, -34)
- `packages/web/src/content/docs/ja/models.mdx` (+7, -7)
- `packages/web/src/content/docs/ja/permissions.mdx` (+12, -12)
- `packages/web/src/content/docs/ja/plugins.mdx` (+6, -82)
- `packages/web/src/content/docs/ja/providers.mdx` (+35, -36)
- `packages/web/src/content/docs/ja/sdk.mdx` (+2, -2)
- `packages/web/src/content/docs/ja/themes.mdx` (+0, -298)
- `packages/web/src/content/docs/ja/tools.mdx` (+3, -3)
- `packages/web/src/content/docs/ja/troubleshooting.mdx` (+2, -2)
- `packages/web/src/content/docs/keybinds.mdx` (+1, -0)
- `packages/web/src/content/docs/ko/acp.mdx` (+1, -1)
- `packages/web/src/content/docs/ko/agents.mdx` (+20, -20)
- `packages/web/src/content/docs/ko/commands.mdx` (+4, -4)
- `packages/web/src/content/docs/ko/config.mdx` (+9, -9)
- `packages/web/src/content/docs/ko/custom-tools.mdx` (+4, -4)
- `packages/web/src/content/docs/ko/github.mdx` (+11, -11)
- `packages/web/src/content/docs/ko/models.mdx` (+7, -7)
- `packages/web/src/content/docs/ko/permissions.mdx` (+9, -9)
- `packages/web/src/content/docs/ko/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/ko/providers.mdx` (+1, -1)
- `packages/web/src/content/docs/ko/sdk.mdx` (+2, -2)
- `packages/web/src/content/docs/ko/tools.mdx` (+3, -3)
- `packages/web/src/content/docs/ko/troubleshooting.mdx` (+2, -2)
- `packages/web/src/content/docs/lsp.mdx` (+36, -36)
- `packages/web/src/content/docs/mcp-servers.mdx` (+17, -17)
- `packages/web/src/content/docs/models.mdx` (+7, -7)
- `packages/web/src/content/docs/nb/acp.mdx` (+1, -1)
- `packages/web/src/content/docs/nb/agents.mdx` (+20, -20)
- `packages/web/src/content/docs/nb/commands.mdx` (+4, -4)
- `packages/web/src/content/docs/nb/config.mdx` (+9, -9)
- `packages/web/src/content/docs/nb/custom-tools.mdx` (+4, -4)
- `packages/web/src/content/docs/nb/github.mdx` (+11, -11)
- `packages/web/src/content/docs/nb/mcp-servers.mdx` (+0, -113)
- `packages/web/src/content/docs/nb/models.mdx` (+7, -7)
- `packages/web/src/content/docs/nb/permissions.mdx` (+9, -9)
- `packages/web/src/content/docs/nb/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/nb/providers.mdx` (+1, -1)
- `packages/web/src/content/docs/nb/sdk.mdx` (+2, -2)
- `packages/web/src/content/docs/nb/tools.mdx` (+3, -3)
- `packages/web/src/content/docs/permissions.mdx` (+17, -17)
- `packages/web/src/content/docs/pl/acp.mdx` (+1, -1)
- `packages/web/src/content/docs/pl/agents.mdx` (+20, -20)
- `packages/web/src/content/docs/pl/commands.mdx` (+4, -4)
- `packages/web/src/content/docs/pl/config.mdx` (+9, -9)
- `packages/web/src/content/docs/pl/custom-tools.mdx` (+4, -4)
- `packages/web/src/content/docs/pl/github.mdx` (+11, -11)
- `packages/web/src/content/docs/pl/models.mdx` (+7, -7)
- `packages/web/src/content/docs/pl/permissions.mdx` (+9, -9)
- `packages/web/src/content/docs/pl/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/pl/providers.mdx` (+1, -1)
- `packages/web/src/content/docs/pl/sdk.mdx` (+2, -2)
- `packages/web/src/content/docs/pl/tools.mdx` (+3, -3)
- `packages/web/src/content/docs/pl/troubleshooting.mdx` (+2, -2)
- `packages/web/src/content/docs/plugins.mdx` (+5, -1)
- `packages/web/src/content/docs/policies.mdx` (+6, -2)
- `packages/web/src/content/docs/providers.mdx` (+21, -22)
- `packages/web/src/content/docs/pt-br/acp.mdx` (+1, -1)
- `packages/web/src/content/docs/pt-br/agents.mdx` (+20, -20)
- `packages/web/src/content/docs/pt-br/commands.mdx` (+4, -4)
- `packages/web/src/content/docs/pt-br/config.mdx` (+9, -9)
- `packages/web/src/content/docs/pt-br/custom-tools.mdx` (+4, -4)
- `packages/web/src/content/docs/pt-br/github.mdx` (+40, -40)
- `packages/web/src/content/docs/pt-br/models.mdx` (+7, -7)
- `packages/web/src/content/docs/pt-br/permissions.mdx` (+9, -9)
- `packages/web/src/content/docs/pt-br/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/pt-br/providers.mdx` (+1, -1)
- `packages/web/src/content/docs/pt-br/sdk.mdx` (+2, -2)
- `packages/web/src/content/docs/pt-br/tools.mdx` (+3, -3)
- `packages/web/src/content/docs/pt-br/troubleshooting.mdx` (+2, -2)
- `packages/web/src/content/docs/ru/acp.mdx` (+1, -1)
- `packages/web/src/content/docs/ru/agents.mdx` (+20, -20)
- `packages/web/src/content/docs/ru/commands.mdx` (+4, -4)
- `packages/web/src/content/docs/ru/config.mdx` (+9, -9)
- `packages/web/src/content/docs/ru/custom-tools.mdx` (+1, -1)
- `packages/web/src/content/docs/ru/github.mdx` (+11, -11)
- `packages/web/src/content/docs/ru/models.mdx` (+7, -7)
- `packages/web/src/content/docs/ru/permissions.mdx` (+9, -9)
- `packages/web/src/content/docs/ru/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/ru/providers.mdx` (+1, -1)
- `packages/web/src/content/docs/ru/sdk.mdx` (+2, -2)
- `packages/web/src/content/docs/ru/tools.mdx` (+3, -3)
- `packages/web/src/content/docs/ru/troubleshooting.mdx` (+2, -2)
- `packages/web/src/content/docs/sdk.mdx` (+50, -35)
- `packages/web/src/content/docs/server.mdx` (+1, -0)
- `packages/web/src/content/docs/skills.mdx` (+1, -15)
- `packages/web/src/content/docs/th/acp.mdx` (+1, -1)
- `packages/web/src/content/docs/th/agents.mdx` (+18, -18)
- `packages/web/src/content/docs/th/commands.mdx` (+4, -4)
- `packages/web/src/content/docs/th/config.mdx` (+9, -9)
- `packages/web/src/content/docs/th/custom-tools.mdx` (+4, -4)
- `packages/web/src/content/docs/th/github.mdx` (+11, -11)
- `packages/web/src/content/docs/th/models.mdx` (+7, -7)
- `packages/web/src/content/docs/th/permissions.mdx` (+9, -9)
- `packages/web/src/content/docs/th/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/th/providers.mdx` (+1, -545)
- `packages/web/src/content/docs/th/sdk.mdx` (+2, -2)
- `packages/web/src/content/docs/th/tools.mdx` (+3, -3)
- `packages/web/src/content/docs/th/troubleshooting.mdx` (+2, -2)
- `packages/web/src/content/docs/tools.mdx` (+24, -3)
- `packages/web/src/content/docs/tr/acp.mdx` (+1, -1)
- `packages/web/src/content/docs/tr/agents.mdx` (+20, -20)
- `packages/web/src/content/docs/tr/commands.mdx` (+4, -4)
- `packages/web/src/content/docs/tr/config.mdx` (+10, -10)
- `packages/web/src/content/docs/tr/custom-tools.mdx` (+4, -4)
- `packages/web/src/content/docs/tr/github.mdx` (+11, -11)
- `packages/web/src/content/docs/tr/models.mdx` (+7, -7)
- `packages/web/src/content/docs/tr/permissions.mdx` (+9, -9)
- `packages/web/src/content/docs/tr/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/tr/providers.mdx` (+1, -1)
- `packages/web/src/content/docs/tr/sdk.mdx` (+2, -2)
- `packages/web/src/content/docs/tr/tools.mdx` (+3, -3)
- `packages/web/src/content/docs/tr/troubleshooting.mdx` (+2, -2)
- `packages/web/src/content/docs/troubleshooting.mdx` (+20, -22)
- `packages/web/src/content/docs/tui.mdx` (+10, -0)
- `packages/web/src/content/docs/zh-cn/acp.mdx` (+1, -1)
- `packages/web/src/content/docs/zh-cn/agents.mdx` (+20, -20)
- `packages/web/src/content/docs/zh-cn/commands.mdx` (+4, -4)
- `packages/web/src/content/docs/zh-cn/config.mdx` (+9, -9)
- `packages/web/src/content/docs/zh-cn/custom-tools.mdx` (+4, -4)
- `packages/web/src/content/docs/zh-cn/github.mdx` (+11, -11)
- `packages/web/src/content/docs/zh-cn/models.mdx` (+7, -7)
- `packages/web/src/content/docs/zh-cn/permissions.mdx` (+9, -9)
- `packages/web/src/content/docs/zh-cn/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/zh-cn/providers.mdx` (+1, -1)
- `packages/web/src/content/docs/zh-cn/sdk.mdx` (+2, -2)
- `packages/web/src/content/docs/zh-cn/tools.mdx` (+3, -3)
- `packages/web/src/content/docs/zh-cn/troubleshooting.mdx` (+2, -2)
- `packages/web/src/content/docs/zh-tw/acp.mdx` (+1, -1)
- `packages/web/src/content/docs/zh-tw/agents.mdx` (+20, -20)
- `packages/web/src/content/docs/zh-tw/commands.mdx` (+4, -4)
- `packages/web/src/content/docs/zh-tw/config.mdx` (+9, -9)
- `packages/web/src/content/docs/zh-tw/custom-tools.mdx` (+4, -4)
- `packages/web/src/content/docs/zh-tw/github.mdx` (+11, -11)
- `packages/web/src/content/docs/zh-tw/models.mdx` (+7, -7)
- `packages/web/src/content/docs/zh-tw/permissions.mdx` (+9, -9)
- `packages/web/src/content/docs/zh-tw/plugins.mdx` (+1, -1)
- `packages/web/src/content/docs/zh-tw/providers.mdx` (+1, -1)
- `packages/web/src/content/docs/zh-tw/sdk.mdx` (+2, -2)
- `packages/web/src/content/docs/zh-tw/tools.mdx` (+3, -3)
- `packages/web/src/content/docs/zh-tw/troubleshooting.mdx` (+2, -2)
- `patches/@modelcontextprotocol%2Fclient@2.0.0.patch` (+0, -58)
- `patches/@modelcontextprotocol%2Fclient@2.3.1.patch` (+74, -0)
- `patches/@silvia-odwyer%2Fphoton-node@0.3.4.patch` (+3, -3)
- `script/publish-winget.ts` (+1, -1)
- `sdks/vscode/package.json` (+1, -1)
- `services/changelog/package.json` (+2, -1)
- `services/files/package.json` (+2, -1)
- `services/update/package.json` (+3, -2)
- `services/www/openapi.json` (+386, -0)
- `services/www/package.json` (+2, -1)
- `services/www/public/openapi.json` (+386, -0)
- `services/www/src/docs/content/agents.mdx` (+5, -3)
- `services/www/src/docs/content/attachments.mdx` (+12, -8)
- `services/www/src/docs/content/build/client/effect.mdx` (+5, -3)
- `services/www/src/docs/content/build/plugins/cli.mdx` (+2, -2)
- `services/www/src/docs/content/build/plugins/effect.mdx` (+16, -12)
- `services/www/src/docs/content/build/plugins/index.mdx` (+21, -17)
- `services/www/src/docs/content/build/plugins/migrate-v1.mdx` (+6, -2)
- `services/www/src/docs/content/build/sdk/effect.mdx` (+1, -1)
- `services/www/src/docs/content/cli/acp.mdx` (+1, -1)
- `services/www/src/docs/content/cli/commands.mdx` (+46, -3)
- `services/www/src/docs/content/cli/config.mdx` (+3, -2)
- `services/www/src/docs/content/cli/keybinds.mdx` (+48, -34)
- `services/www/src/docs/content/commands.mdx` (+3, -3)
- `services/www/src/docs/content/compaction.mdx` (+51, -5)
- `services/www/src/docs/content/config.mdx` (+22, -7)
- `services/www/src/docs/content/console/api/budgets.mdx` (+25, -12)
- `services/www/src/docs/content/console/api/inference.mdx` (+8, -7)
- `services/www/src/docs/content/console/api/providers.mdx` (+5, -5)
- `services/www/src/docs/content/console/billing.mdx` (+2, -2)
- `services/www/src/docs/content/console/budgets.mdx` (+38, -30)
- `services/www/src/docs/content/console/go.mdx` (+25, -13)
- `services/www/src/docs/content/console/harnesses/codex.mdx` (+1, -1)
- `services/www/src/docs/content/console/harnesses/hermes.mdx` (+1, -1)
- `services/www/src/docs/content/console/harnesses/index.mdx` (+7, -4)
- `services/www/src/docs/content/console/harnesses/pi.mdx` (+2, -2)
- `services/www/src/docs/content/console/harnesses/raycast.mdx` (+2, -1)
- `services/www/src/docs/content/console/members.mdx` (+2, -3)
- `services/www/src/docs/content/console/models.mdx` (+3, -17)
- `services/www/src/docs/content/console/scim.mdx` (+2, -0)
- `services/www/src/docs/content/console/sso.mdx` (+5, -4)
- `services/www/src/docs/content/console/websearch.mdx` (+3, -3)
- `services/www/src/docs/content/console/workspaces.mdx` (+12, -5)
- `services/www/src/docs/content/migrate-v1.mdx` (+37, -11)
- `services/www/src/docs/content/models.mdx` (+16, -16)
- `services/www/src/docs/content/plugins.mdx` (+10, -6)
- `services/www/src/docs/content/providers.mdx` (+38, -9)
- `services/www/src/docs/content/troubleshooting.mdx` (+54, -2)
- `sst.config.ts` (+2, -0)
- `turbo.json` (+25, -14)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 7cad834..03725c1 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "2.1.2",
+  "version": "2.1.4",
   "name": "@opencode/core",
   "type": "module",
   "license": "MIT",
@@ -24,7 +24,8 @@
     "build": "bun run script/build.ts",
     "update-models-snapshot": "bun run script/update-models-snapshot.ts",
     "test": "bun run script/test.ts",
-    "typecheck": "tsc -b tsconfig.json tsconfig.tests.json"
+    "typecheck": "bun check --no-script -b -p tsconfig.tests.json",
+    "typecheck:tsc": "tsc -b tsconfig.json tsconfig.tests.json"
   },
   "exports": {
     "./*": "./src/*.ts"
@@ -78,7 +79,7 @@
     "@ai-sdk/openai-compatible": "2.0.41",
     "@effect/platform-node": "catalog:",
     "@effect/sql-sqlite-bun": "catalog:",
-    "@modelcontextprotocol/server": "2.0.0",
+    "@modelcontextprotocol/server": "2.3.1",
     "@opencode/http-recorder": "workspace:*",
     "@parcel/watcher-darwin-arm64": "2.5.1",
     "@parcel/watcher-darwin-x64": "2.5.1",
@@ -104,8 +105,8 @@
     "@ff-labs/fff-bun": "0.10.5",
     "@ff-labs/fff-node": "0.10.5",
     "@lydell/node-pty": "catalog:",
-    "@modelcontextprotocol/client": "2.0.0",
-    "@modelcontextprotocol/core": "2.0.0",
+    "@modelcontextprotocol/client": "2.3.1",
+    "@modelcontextprotocol/core": "2.3.1",
     "@opencode-ai/pty": "0.3.1",
     "@opencode/ai": "workspace:*",
     "@opencode/codemode": "workspace:*",
```

#### packages/core/script/publish.ts
```diff
diff --git a/packages/core/script/publish.ts b/packages/core/script/publish.ts
index f18a254..3d234c6 100644
--- a/packages/core/script/publish.ts
+++ b/packages/core/script/publish.ts
@@ -24,7 +24,7 @@ if ((await $`npm view ${pkg.name}@${pkg.version} version`.nothrow()).exitCode ==
 }
 
 try {
-  await $`bun run typecheck`
+  await $`bun run typecheck:tsc`
   await $`bun run build`
   pkg.exports = Object.fromEntries(
     Object.entries(pkg.exports).map(([key, value]) => {
```

#### packages/core/src/config/normalize.ts
```diff
diff --git a/packages/core/src/config/normalize.ts b/packages/core/src/config/normalize.ts
index 4ef02b9..e2b4ad4 100644
--- a/packages/core/src/config/normalize.ts
+++ b/packages/core/src/config/normalize.ts
@@ -476,6 +476,15 @@ function normalizeExperimental(
         )
         if (value !== undefined) result.todo = value
       }
+      if (own(experimental, "background_compaction")) {
+        const value = decodeEncoded(
+          ConfigExperimental.Info.fields.background_compaction,
+          experimental.background_compaction,
+          ["experimental", "background_compaction"],
+          diagnostics,
+        )
+        if (value !== undefined) result.background_compaction = value
+      }
       if (own(experimental, "subagent_depth")) {
         const value = decodeEncoded(
           ConfigExperimental.Info.fields.subagent_depth,
```

#### packages/core/src/config/plugin/agent.ts
```diff
diff --git a/packages/core/src/config/plugin/agent.ts b/packages/core/src/config/plugin/agent.ts
index 57abeef..6da6381 100644
--- a/packages/core/src/config/plugin/agent.ts
+++ b/packages/core/src/config/plugin/agent.ts
@@ -29,6 +29,8 @@ const decodeLegacyAgent = Schema.decodeUnknownOption(ConfigAgentV1.Info)
 type PathAction = FileAccess.ExternalDirectoryAuthorization["action"] | typeof ReadTool.name | typeof EditTool.name
 const pathActions = ["external_directory", "read", "edit"] as const satisfies readonly PathAction[]
 const agentKeys = new Set(["variant", ...Object.keys(ConfigAgent.Info.fields)])
+// Fields only V2 understands. A file that uses any of them is read as V2, whatever else it contains.
+const nativeKeys = ["permissions", "request", "system", "disabled"]
 
 export const Plugin = define({
   id: "opencode.config.agent",
@@ -42,7 +44,7 @@ export const Plugin = define({
       const files = yield* discover(fs, entry.path)
       return yield* Effect.forEach(files, (file) =>
         fs.readFileStringSafe(file.filepath).pipe(
-          Effect.map((content) => (content ? decode(file, content) : undefined)),
+          Effect.flatMap((content) => (content ? decode(file, content) : Effect.succeed(undefined))),
           Effect.orElseSucceed(() => undefined),
         ),
       ).pipe(Effect.map((documents) => documents.filter((document): document is Document => document !== undefined)))
@@ -173,7 +175,10 @@ function discover(fs: FSUtil.Interface, directory: string) {
   )
 }
 
-function decode(file: { directory: string; filepath: string; primary: boolean }, content: string) {
+const decode = Effect.fnUntraced(function* (
+  file: { directory: string; filepath: string; primary: boolean },
+  content: string,
+) {
   const markdown = ConfigMarkdown.parseOption(content)
   if (!markdown) return
   const name = path
@@ -182,7 +187,11 @@ function decode(file: { directory: string; filepath: string; primary: boolean },
     .replace(/^(agent|agents|mode|modes)\//, "")
     .replace(/\.md$/, "")
   const body = markdown.content.trim()
-  const legacy = Object.keys(markdown.data).some((key) => !agentKeys.has(key))
+  const keys = Object.keys(markdown.data)
+  const unsupported = keys.filter((key) => !agentKeys.has(key))
+  const legacy = unsupported.length > 0 && !keys.some((key) => nativeKeys.includes(key))
+  if (!legacy && unsupported.length > 0)
+    yield* Effect.logWarning("ignored unsupported agent fields", { path: file.filepath, fields: unsupported })
   // Join legacy model + variant without sending native request/permissions through migration.
   // Embedded and structured native selections, and a variant without a model, stay unchanged.
   const data =
@@ -205,4 +214,4 @@ function decode(file: { directory: string; filepath: string; primary: boolean },
     agents: { [name]: file.primary ? ConfigAgent.Info.make({ ...agent, mode: "primary" }) : agent },
   })
```

#### packages/core/src/config/plugin/compaction.ts
```diff
diff --git a/packages/core/src/config/plugin/compaction.ts b/packages/core/src/config/plugin/compaction.ts
index 7080d88..acd74c3 100644
--- a/packages/core/src/config/plugin/compaction.ts
+++ b/packages/core/src/config/plugin/compaction.ts
@@ -13,6 +13,7 @@ export const Plugin = define({
     const compaction = yield* SessionCompaction.Service
     const loaded = yield* ConfigEntryObserver.observe(config, ctx.event, compaction.reload())
     yield* compaction.transform((editor) => {
+      editor.configure({ precompute: Config.latest(loaded.entries, "experimental")?.background_compaction === true })
       for (const entry of loaded.entries) {
         if (entry.type !== "document" || !entry.info.compaction) continue
         editor.configure({
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/src/open.ts
- `src/core/` - review core changes from packages/core/test/kilocode/open.test.ts
