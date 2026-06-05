# Upstream Changes Report
Generated: 2026-06-05 09:52:26

## Summary
- kilocode: 51 commits, 134 files changed
- opencode: 51 commits, 350 files changed

## kilocode Changes (38eb5879f..049d567d1)

### Commits

- 049d567d1 - fix(ui): prevent false auto-scroll pauses from programmatic scroll events (#10942) (Imanol Maiztegui, 2026-06-05)
- b19844124 - Merge pull request #10901 from Kilo-Org/fix/webfetch-unsupported-images (Christiaan Arnoldus, 2026-06-05)
- 5c6b83ad2 - release: v7.3.33 (kilo-maintainer[bot], 2026-06-05)
- 62ff9162a - Merge pull request #10935 from Kilo-Org/fix/cli-release-build-state (Joshua Lambert, 2026-06-04)
- 7afef4aa8 - Merge branch 'main' into fix/cli-release-build-state (Joshua Lambert, 2026-06-04)
- 254b070bb - ci: limit CLI artifact validation to version (Josh Lambert, 2026-06-04)
- 8295ab309 - ci: validate Linux CLI release artifacts (Josh Lambert, 2026-06-04)
- 6cab5f18e - fix(cli): isolate release target builds (Josh Lambert, 2026-06-04)
- 77c6b802c - release: v7.3.32 (kilo-maintainer[bot], 2026-06-05)
- 734174544 - release: v7.3.31 (kilo-maintainer[bot], 2026-06-04)
- 3178592e0 - release: v7.3.30 (kilo-maintainer[bot], 2026-06-04)
- b0f22d998 - Merge pull request #10905 from Kilo-Org/npm-package-readme (Catriel Müller, 2026-06-04)
- 0af454de0 - fix(cli): preserve npm package metadata (Catriel Müller, 2026-06-04)
- c9c3341c8 - Merge pull request #10916 from Kilo-Org/different-sunday (Kirill Kalishev, 2026-06-04)
- 341c5f8bd - docs(kilo-docs): refine JetBrains EAP compatibility wording (kirillk, 2026-06-04)
- 103daf3e6 - Merge pull request #10913 from Kilo-Org/fix/book-open-check-training-icon (Kirill Kalishev, 2026-06-04)
- c45b8fbad - Merge pull request #10915 from Kilo-Org/jetbrains/release/v7.0.1-rc.7 (Kirill Kalishev, 2026-06-04)
- dc793e2cb - docs(kilo-docs): clarify JetBrains auto-update setting (kirillk, 2026-06-04)
- ddb6005e1 - docs(kilo-docs): update JetBrains EAP guidance (kirillk, 2026-06-04)
- cbebc0294 - Merge branch 'main' into fix/book-open-check-training-icon (Kirill Kalishev, 2026-06-04)
- 77db3cb31 - Update CHANGELOG.md (Kirill Kalishev, 2026-06-04)
- 88bc5d8af - release(jetbrains): v7.0.1-rc.7 (kilo-maintainer[bot], 2026-06-04)
- ae91a3452 - fix(vscode): replace brain-circuit with book-open-check for training disclosure icon (kiloconnect[bot], 2026-06-04)
- c1c6ec9d3 - Merge pull request #10910 from Kilo-Org/skitter-porkpie (Kirill Kalishev, 2026-06-04)
- 58e8efd32 - Merge branch 'main' into skitter-porkpie (Kirill Kalishev, 2026-06-04)
- d6df2d5e9 - Update packages/kilo-jetbrains/build.gradle.kts (Kirill Kalishev, 2026-06-04)
- d38c2aaf8 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-06-04)
- 2d109462d - Add Atomic Chat as a first-class local provider. (#10555) (yanalialiuk, 2026-06-04)
- 6cace2a29 - Update packages/kilo-jetbrains/build.gradle.kts (Kirill Kalishev, 2026-06-04)
- 49ccf6e45 - fix(jetbrains): render multi-release change notes (kirillk, 2026-06-04)
- 3b3ce7e80 - Merge pull request #10890 from Kilo-Org/thoracic-plume (Kirill Kalishev, 2026-06-04)
- 714f920b1 - fix(cli): report unsupported icons as tool errors (chrarnoldus, 2026-06-04)
- 165009df5 - refactor(cli): clarify icon mime handling (chrarnoldus, 2026-06-04)
- facf8b6b8 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-06-04)
- 674ae2902 - Merge pull request #10906 from Kilo-Org/christiaan/nvidia (Christiaan Arnoldus, 2026-06-04)
- 0f61fd672 - Merge pull request #10881 from Kilo-Org/christiaan/mistral (Christiaan Arnoldus, 2026-06-04)
- 1a1c0bd86 - fix(cli): narrow webfetch image rejection (chrarnoldus, 2026-06-04)
- 627afaccf - fix(kilo-docs): exclude xAI account link from checks (chrarnoldus, 2026-06-04)
- fa53e5239 - Add NVIDIA Trial Terms of Service to docs (Christiaan Arnoldus, 2026-06-04)
- 2e1945c28 - fix(cli): resolve plan exit approval submissions (#10895) (Joshua Lambert, 2026-06-04)
- bbc80dfac - fix(sdk): regenerate Mistral provider schema (chrarnoldus, 2026-06-04)
- 60059d5e6 - chore(cli): normalize npm keywords (Job Rietbergen, 2026-06-04)
- 10bf693c8 - chore(cli): mark npm package publishable (Job Rietbergen, 2026-06-04)
- e60a7562b - docs(cli): use npm-safe readme image URL (Job Rietbergen, 2026-06-04)
- d8d16ccff - docs(cli): refresh npm package readme (Job Rietbergen, 2026-06-04)
- d8217fcba - Add Mistral (Christiaan Arnoldus, 2026-06-04)
- a8a8dd872 - fix(cli): reject unsupported webfetch images (chrarnoldus, 2026-06-04)
- 806a2e614 - test(jetbrains): coordinate SSE callback contention (kirillk, 2026-06-03)
- e8b3f5e8b - test(jetbrains): stabilize backend SSE tests (kirillk, 2026-06-03)
- 9c5a461f8 - Fix (Christiaan Arnoldus, 2026-06-03)
- 495b73d58 - Add Mistral Kilo gateway provider (Christiaan Arnoldus, 2026-06-03)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/webfetch.ts` (+2, -2)
- `packages/opencode/test/tool/fixtures/models-api.json` (+85, -0)
- `packages/opencode/test/tool/webfetch.test.ts` (+52, -0)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)

#### Other Changes
- `.changeset/calm-icons-fetch.md` (+5, -0)
- `.changeset/mistral-medium-reasoning.md` (+0, -5)
- `.changeset/user-driven-auto-scroll.md` (+6, -0)
- `.github/workflows/publish.yml` (+60, -0)
- `bun.lock` (+38, -26)
- `nix/hashes.json` (+4, -4)
- `package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-docs/lib/nav/ai-providers.ts` (+1, -0)
- `packages/kilo-docs/lychee.toml` (+2, -1)
- `packages/kilo-docs/markdoc/partials/install-jetbrains.md` (+3, -1)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/ai-providers/atomic-chat.md` (+112, -0)
- `packages/kilo-docs/pages/ai-providers/index.md` (+1, -0)
- `packages/kilo-docs/pages/automate/extending/local-models.md` (+6, -6)
- `packages/kilo-docs/pages/code-with-ai/agents/auto-model.md` (+3, -1)
- `packages/kilo-docs/pages/gateway/models-and-providers.md` (+5, -5)
- `packages/kilo-docs/pages/getting-started/using-kilo-for-free.md` (+3, -1)
- `packages/kilo-docs/public/img/npm-package-readme/kilo-cli.png` (+-, --)
- `packages/kilo-gateway/package.json` (+3, -2)
- `packages/kilo-gateway/src/api/constants.ts` (+8, -1)
- `packages/kilo-gateway/src/provider.ts` (+5, -0)
- `packages/kilo-gateway/src/types.ts` (+1, -0)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/CHANGELOG.md` (+4, -4)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendAppServiceTest.kt` (+12, -7)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloConnectionServiceTest.kt` (+15, -10)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/MockCliServer.kt` (+39, -4)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/TestLog.kt` (+25, -5)
- `packages/kilo-jetbrains/build.gradle.kts` (+53, -4)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/icon.tsx` (+2, -2)
- `packages/kilo-ui/src/hooks/create-auto-scroll.tsx` (+3, -10)
- `packages/kilo-vscode/CHANGELOG.md` (+8, -0)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/unit/model-preview-data-line.test.ts` (+5, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/MultiModelSelector.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/components/settings/ProviderConnectDialog.tsx` (+33, -7)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelPreview.tsx` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelSelector.tsx` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/utils/local-providers.ts` (+11, -0)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+14, -0)
- `packages/opencode/README.md` (+8, -0)
- `packages/opencode/package.json` (+20, -2)
- `packages/opencode/script/build.ts` (+26, -3)
- `packages/opencode/script/publish.ts` (+2, -0)
- `packages/opencode/src/cli/cmd/tui/component/dialog-provider.tsx` (+6, -3)
- `packages/opencode/src/kilocode/atomic-chat-feature.ts` (+37, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/component/dialog-provider.tsx` (+20, -0)
- `packages/opencode/src/kilocode/config/default-plugins.ts` (+9, -2)
- `packages/opencode/src/kilocode/plan-followup.ts` (+20, -22)
- `packages/opencode/src/kilocode/provider-options.ts` (+4, -0)
- `packages/opencode/src/kilocode/provider/provider.ts` (+1, -0)
- `packages/opencode/src/kilocode/session/prompt.ts` (+12, -0)
- `packages/opencode/src/plugin/index.ts` (+2, -1)
- `packages/opencode/src/session/prompt.ts` (+2, -2)
- `packages/opencode/src/util/media.ts` (+8, -1)
- `packages/opencode/test/kilocode/config/atomic-chat-default-plugin.test.ts` (+24, -0)
- `packages/opencode/test/kilocode/plan-exit-detection.test.ts` (+150, -9)
- `packages/opencode/test/kilocode/plan-followup.test.ts` (+29, -3)
- `packages/plugin-atomic-chat/package.json` (+34, -0)
- `packages/plugin-atomic-chat/src/cache/model-status-cache.ts` (+115, -0)
- `packages/plugin-atomic-chat/src/cache/shared-model-status-cache.ts` (+4, -0)
- `packages/plugin-atomic-chat/src/constants.ts` (+11, -0)
- `packages/plugin-atomic-chat/src/index.ts` (+12, -0)
- `packages/plugin-atomic-chat/src/plugin/auth-hook.ts` (+14, -0)
- `packages/plugin-atomic-chat/src/plugin/chat-params-hook.ts` (+131, -0)
- `packages/plugin-atomic-chat/src/plugin/config-hook.ts` (+57, -0)
- `packages/plugin-atomic-chat/src/plugin/enhance-config.ts` (+181, -0)
- `packages/plugin-atomic-chat/src/plugin/event-hook.ts` (+16, -0)
- `packages/plugin-atomic-chat/src/plugin/get-loaded-models.ts` (+18, -0)
- `packages/plugin-atomic-chat/src/plugin/index.ts` (+31, -0)
- `packages/plugin-atomic-chat/src/types/index.ts` (+47, -0)
- `packages/plugin-atomic-chat/src/ui/toast-notifier.ts` (+81, -0)
- `packages/plugin-atomic-chat/src/utils/atomic-chat-api.ts` (+118, -0)
- `packages/plugin-atomic-chat/src/utils/format-model-name.ts` (+42, -0)
- `packages/plugin-atomic-chat/src/utils/index.ts` (+206, -0)
- `packages/plugin-atomic-chat/src/utils/should-probe-atomic-chat.ts` (+55, -0)
- `packages/plugin-atomic-chat/src/utils/validation/index.ts` (+5, -0)
- `packages/plugin-atomic-chat/src/utils/validation/safe-operations.ts` (+13, -0)
- `packages/plugin-atomic-chat/src/utils/validation/type-guards.ts` (+25, -0)
- `packages/plugin-atomic-chat/src/utils/validation/validate-config.ts` (+57, -0)
- `packages/plugin-atomic-chat/src/utils/validation/validate-hook-input.ts` (+47, -0)
- `packages/plugin-atomic-chat/src/utils/validation/validation-result.ts` (+5, -0)
- `packages/plugin-atomic-chat/test/plugin.test.ts` (+251, -0)
- `packages/plugin-atomic-chat/test/should-probe-atomic-chat.test.ts` (+46, -0)
- `packages/plugin-atomic-chat/tsconfig.json` (+14, -0)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+2, -2)
- `packages/sdk/openapi.json` (+2, -2)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/assets/icons/provider/atomic-chat.svg` (+1, -0)
- `packages/ui/src/components/provider-icons/sprite.svg` (+9, -0)
- `packages/ui/src/components/provider-icons/types.ts` (+1, -0)
- `script/check-opencode-promise-facades.ts` (+1, -1)
- `script/upstream/package.json` (+1, -1)
- `script/upstream/transforms/transform-package-json.test.ts` (+12, -1)
- `script/upstream/transforms/transform-package-json.ts` (+25, -0)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index cc5c9246b..3def0c590 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.3.29",
+  "version": "7.3.33",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/opencode/src/tool/webfetch.ts
```diff
diff --git a/packages/opencode/src/tool/webfetch.ts b/packages/opencode/src/tool/webfetch.ts
index c4c7a7a44..96d14900e 100644
--- a/packages/opencode/src/tool/webfetch.ts
+++ b/packages/opencode/src/tool/webfetch.ts
@@ -3,7 +3,7 @@ import { HttpClient, HttpClientRequest } from "effect/unstable/http"
 import * as Tool from "./tool"
 import TurndownService from "turndown"
 import DESCRIPTION from "./webfetch.txt"
-import { isImageAttachment } from "@/util/media"
+import { isIconMimeType, isImageAttachment } from "@/util/media" // kilocode_change
 import { normalizeUrls } from "@/kilocode/util/url" // kilocode_change
 
 const MAX_RESPONSE_SIZE = 5 * 1024 * 1024 // 5MB
@@ -108,7 +108,7 @@ export const WebFetchTool = Tool.define(
           const contentType = response.headers["content-type"] || ""
           const mime = contentType.split(";")[0]?.trim().toLowerCase() || ""
           const title = `${url} (${contentType})` // kilocode_change
-
+          if (isIconMimeType(mime)) throw new Error(`Unsupported image format: ${mime}`) // kilocode_change
           if (isImageAttachment(mime)) {
             const base64Content = Buffer.from(arrayBuffer).toString("base64")
             return {
```

#### packages/opencode/test/tool/fixtures/models-api.json
```diff
diff --git a/packages/opencode/test/tool/fixtures/models-api.json b/packages/opencode/test/tool/fixtures/models-api.json
index 5a3eb7e80..d560eced2 100644
--- a/packages/opencode/test/tool/fixtures/models-api.json
+++ b/packages/opencode/test/tool/fixtures/models-api.json
@@ -17742,6 +17742,91 @@
       }
     }
   },
+  "atomic-chat": {
+    "id": "atomic-chat",
+    "env": ["ATOMIC_CHAT_API_KEY"],
+    "npm": "@ai-sdk/openai-compatible",
+    "api": "http://127.0.0.1:1337/v1",
+    "name": "Atomic Chat",
+    "doc": "https://atomic.chat",
+    "models": {
+      "gemma-4-E4B-it-IQ4_XS": {
+        "id": "gemma-4-E4B-it-IQ4_XS",
+        "name": "Gemma 4 E4B Instruct (IQ4_XS)",
+        "family": "gemma",
+        "attachment": false,
+        "reasoning": false,
+        "tool_call": false,
+        "temperature": true,
+        "release_date": "2026-04-02",
+        "last_updated": "2026-04-02",
+        "modalities": {"input":["text"],"output":["text"]},
+        "open_weights": true,
+        "cost": {"input":0,"output":0},
+        "limit": {"context":32768,"output":8192}
+      },
+      "gemma-4-E4B-it-MLX-4bit": {
+        "id": "gemma-4-E4B-it-MLX-4bit",
+        "name": "Gemma 4 E4B Instruct (MLX 4-bit)",
+        "family": "gemma",
+        "attachment": false,
+        "reasoning": false,
+        "tool_call": false,
+        "temperature": true,
+        "release_date": "2026-04-02",
+        "last_updated": "2026-04-02",
+        "modalities": {"input":["text"],"output":["text"]},
+        "open_weights": true,
+        "cost": {"input":0,"output":0},
+        "limit": {"context":32768,"output":8192}
+      },
+      "Qwen3_5-9B-Q4_K_M": {
+        "id": "Qwen3_5-9B-Q4_K_M",
+        "name": "Qwen 3.5 9B (Q4_K_M)",
+        "family": "qwen",
```

#### packages/opencode/test/tool/webfetch.test.ts
```diff
diff --git a/packages/opencode/test/tool/webfetch.test.ts b/packages/opencode/test/tool/webfetch.test.ts
index 6c7f6aba7..20a48f445 100644
--- a/packages/opencode/test/tool/webfetch.test.ts
+++ b/packages/opencode/test/tool/webfetch.test.ts
@@ -82,6 +82,58 @@ describe("tool.webfetch", () => {
     )
   })
 
+  // kilocode_change start
+  test.each(["image/x-icon", "image/vnd.microsoft.icon"])("rejects %s attachments", async (mime) => {
+    const bytes = new Uint8Array([0, 0, 1, 0])
+    await withFetch(
+      () => new Response(bytes, { status: 200, headers: { "content-type": mime } }),
+      async (url) => {
+        await WithInstance.provide({
+          directory: projectRoot,
+          fn: async () => {
+            await expect(exec({ url: new URL("/favicon.ico", url).toString(), format: "markdown" })).rejects.toThrow(
+              `Unsupported image format: ${mime}`,
+            )
+          },
+        })
+      },
+    )
+  })
+
+  test("returns non-icon image responses as file attachments", async () => {
+    const bytes = new Uint8Array([0, 0, 0, 0])
+    await withFetch(
+      () => new Response(bytes, { status: 200, headers: { "content-type": "image/avif" } }),
+      async (url) => {
+        await WithInstance.provide({
+          directory: projectRoot,
+          fn: async () => {
+            const result = await exec({ url: new URL("/image.avif", url).toString(), format: "markdown" })
+            expect(result.output).toBe("Image fetched successfully")
+            expect(result.attachments?.[0].mime).toBe("image/avif")
+          },
+        })
+      },
+    )
+  })
+
+  test("keeps fastbidsheet responses as text output", async () => {
+    await withFetch(
+      () => new Response("sheet", { status: 200, headers: { "content-type": "image/vnd.fastbidsheet" } }),
+      async (url) => {
+        await WithInstance.provide({
+          directory: projectRoot,
+          fn: async () => {
```


## opencode Changes (69cfc44..a468680)

### Commits

- a468680 - chore: generate (opencode-agent[bot], 2026-06-05)
- 0c0d193 - opencode/run: refresh themes after terminal reloads (#30917) (Simon Klee, 2026-06-05)
- b278e49 - tui: guard path formatting inputs (#30469) (Simon Klee, 2026-06-05)
- c613c33 - fix(app): tab overflow (#30894) (Brendan Allan, 2026-06-05)
- 9431356 - fix(app): handle tab overflow and scrolling in titlebar (#30886) (Brendan Allan, 2026-06-05)
- f6197ce - chore: generate (opencode-agent[bot], 2026-06-05)
- 7f33576 - feat(app): improve desktop multi-server support (#30678) (Luke Parker, 2026-06-05)
- 7ae856a - chore: generate (opencode-agent[bot], 2026-06-05)
- b01eb22 - fix(cli): harden daemon lifecycle (#30844) (Dax, 2026-06-05)
- 3cf1cef - fix(tui): route permission replies to session directory (#30851) (opencode-agent[bot], 2026-06-05)
- b375890 - fix(tui): prioritize models slash autocomplete (#30848) (Aiden Cline, 2026-06-04)
- 0a36433 - chore: generate (opencode-agent[bot], 2026-06-05)
- 5426478 - fix(app): improve tab handling (#30669) (Brendan Allan, 2026-06-05)
- 3003867 - feat(tui): allow backgrounding synchronous subagents (#30488) (Kit Langton, 2026-06-04)
- 8c0edca - chore: generate (opencode-agent[bot], 2026-06-05)
- 1af8daf - feat(core): persist v2 session context epochs (#30789) (Kit Langton, 2026-06-04)
- c47cb28 - chore: generate (opencode-agent[bot], 2026-06-05)
- 2859ce6 - feat(core): add Snowflake Cortex provider (#29901) (Kamesh Sampath, 2026-06-04)
- 39babcb - chore: generate (opencode-agent[bot], 2026-06-05)
- 64dc6d3 - feat(core): attach global native tools (#30832) (Kit Langton, 2026-06-04)
- 17ba553 - sync release versions for v1.16.0 (opencode, 2026-06-05)
- 9211ef7 - chore: generate (opencode-agent[bot], 2026-06-05)
- 605ae48 - feat(app): color themes (#30824) (Aarav Sareen, 2026-06-05)
- 7555700 - chore: generate (opencode-agent[bot], 2026-06-05)
- 773d33e - feat(core): add public native API (#30828) (Kit Langton, 2026-06-04)
- 46e9863 - fix(stats): sort metric charts by top usage (Adam, 2026-06-04)
- 47f3d8b - feat(stats): refresh stats routes and homepage (#30419) (Adam, 2026-06-05)
- 134f413 - chore: generate (opencode-agent[bot], 2026-06-04)
- f011d77 - fix(llm): normalize OpenAI function tool schemas (Kit Langton, 2026-06-04)
- ab5a12d - chore: generate (opencode-agent[bot], 2026-06-04)
- 76ecf2e - refactor(core): make v2 session inputs event sourced (#30785) (Kit Langton, 2026-06-04)
- 057958c - ci: publish (Dax Raad, 2026-06-04)
- b1a7ee5 - feat(desktop): surface local server startup failures (#30822) (Luke Parker, 2026-06-04)
- 1071807 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-04)
- e464999 - upgrade opentui to 0.3.2 (#30748) (Sebastian, 2026-06-04)
- cc9b73b - tweak: background agent prompting to avoid polling issues (#30790) (Aiden Cline, 2026-06-04)
- fe5ac30 - chore: generate (opencode-agent[bot], 2026-06-04)
- ba1b660 - feat(core): moving sessions (#30640) (James Long, 2026-06-04)
- e45e0e1 - fix: bump @openrouter/ai-sdk-provider to 2.9.0 (#30800) (Colin McDonnell, 2026-06-04)
- 5b14fb4 - fix(tui): add Vue syntax highlighting (#30802) (Aiden Cline, 2026-06-04)
- 730ea6d - fix(opencode): attribute task child agent on creation (#30786) (Aiden Cline, 2026-06-04)
- 21a0fdd - fix(opencode): `ACP.loadSession` should replay all messages (#30761) (LIU Xinyu, 2026-06-04)
- cb65926 - fix(tui): show toast when variant_list keybind used with no variants (#30724) (Ariane Emory, 2026-06-04)
- 94c49b2 - make scripts executable (Dax Raad, 2026-06-04)
- 9f3a0fe - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-04)
- 7f54b1b - fix build (Dax Raad, 2026-06-04)
- 789e4d5 - fix(enterprise): install hono standard validator peer (#30740) (opencode-agent[bot], 2026-06-04)
- f5d1ae6 - zen: nemotron 3 ultra (Frank, 2026-06-04)
- 7e09660 - fix(opencode): respect disabled auto compaction on overflow (#30749) (Shoubhit Dash, 2026-06-04)
- 6d4f3b4 - feat(tui): improve experimental session switcher (#30738) (Shoubhit Dash, 2026-06-04)
- caea930 - fix(core): reset pre-launch session projections (#30728) (Kit Langton, 2026-06-04)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/core/src/tool/AGENTS.md` (+139, -0)
- `packages/core/src/tool/application-tools.ts` (+51, -0)
- `packages/core/src/tool/apply-patch.ts` (+1, -1)
- `packages/core/src/tool/bash.ts` (+1, -1)
- `packages/core/src/tool/edit.ts` (+1, -1)
- `packages/core/src/tool/glob.ts` (+1, -1)
- `packages/core/src/tool/grep.ts` (+1, -1)
- `packages/core/src/tool/native.ts` (+73, -0)
- `packages/core/src/tool/question.ts` (+1, -1)
- `packages/core/src/tool/read.ts` (+2, -2)
- `packages/core/src/tool/skill.ts` (+1, -1)
- `packages/core/src/tool/todowrite.ts` (+1, -1)
- `packages/core/src/tool/webfetch.ts` (+1, -1)
- `packages/core/src/tool/websearch.ts` (+1, -1)
- `packages/core/src/tool/write.ts` (+1, -1)
- `packages/opencode/src/tool/task.ts` (+48, -23)
- `packages/opencode/src/tool/task.txt` (+1, -1)
- `packages/opencode/test/tool/task.test.ts` (+92, -5)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
- `packages/core/src/event/sql.ts` (+2, -2)

#### Core (**/core/)
- `packages/console/core/package.json` (+1, -1)
- `packages/core/migration/20260603040000_session_message_projection_order/migration.sql` (+1, -0)
- `packages/core/migration/20260604172448_event_sourced_session_input/migration.sql` (+28, -0)
- `packages/core/migration/20260604172448_event_sourced_session_input/snapshot.json` (+1898, -0)
- `packages/core/migration/20260605003541_add_session_context_snapshot/migration.sql` (+9, -0)
- `packages/core/migration/20260605003541_add_session_context_snapshot/snapshot.json` (+1980, -0)
- `packages/core/package.json` (+3, -2)
- `packages/core/src/background-job.ts` (+85, -5)
- `packages/core/src/control-plane/move-session.ts` (+128, -0)
- `packages/core/src/database/migration.gen.ts` (+2, -0)
- `packages/core/src/database/migration/20260603040000_session_message_projection_order.ts` (+4, -10)
- `packages/core/src/database/migration/20260604172448_event_sourced_session_input.ts` (+47, -0)
- `packages/core/src/database/migration/20260605003541_add_session_context_snapshot.ts` (+21, -0)
- `packages/core/src/event.ts` (+115, -41)
- `packages/core/src/git.ts` (+166, -1)
- `packages/core/src/instruction-context.ts` (+92, -0)
- `packages/core/src/location-layer.ts` (+6, -1)
- `packages/core/src/markdown.d.ts` (+4, -0)
- `packages/core/src/opencode.ts` (+0, -39)
- `packages/core/src/plugin/provider.ts` (+2, -0)
- `packages/core/src/plugin/provider/snowflake-cortex.ts` (+86, -0)
- `packages/core/src/plugin/skill.ts` (+6, -4)
- `packages/core/src/project/copy-strategies.ts` (+9, -3)
- `packages/core/src/project/copy.ts` (+15, -3)
- `packages/core/src/public/agent.ts` (+6, -0)
- `packages/core/src/public/index.ts` (+9, -0)
- `packages/core/src/public/location.ts` (+6, -0)
- `packages/core/src/public/model.ts` (+9, -0)
- `packages/core/src/public/opencode.ts` (+76, -0)
- `packages/core/src/public/session.ts` (+91, -0)
- `packages/core/src/public/tool.ts` (+17, -0)
- `packages/core/src/session-system-context.ts` (+0, -54)
- `packages/core/src/session.ts` (+11, -32)
- `packages/core/src/session/context-epoch.ts` (+249, -0)
- `packages/core/src/session/context.ts` (+61, -16)
- `packages/core/src/session/event.ts` (+71, -3)
- `packages/core/src/session/input.ts` (+174, -106)
- `packages/core/src/session/message-id.ts` (+13, -0)
- `packages/core/src/session/message-updater.ts` (+47, -77)
- `packages/core/src/session/message.ts` (+19, -4)
- `packages/core/src/session/projector.ts` (+110, -40)
- `packages/core/src/session/runner/index.ts` (+7, -1)
- `packages/core/src/session/runner/llm.ts` (+32, -19)
- `packages/core/src/session/runner/publish-llm-event.ts` (+15, -4)
- `packages/core/src/session/runner/to-llm-message.ts` (+2, -0)
- `packages/core/src/session/sql.ts` (+20, -5)
- `packages/core/src/session/store.ts` (+7, -0)
- `packages/core/src/system-context-builtins.ts` (+47, -0)
- `packages/core/src/system-context-registry.ts` (+46, -0)
- `packages/core/src/system-context.ts` (+257, -82)
- `packages/core/src/{tool-registry.ts => tool/registry.ts}` (+32, -10)
- `packages/core/test/application-tools.test.ts` (+184, -0)
- `packages/core/test/database-migration.test.ts` (+118, -28)
- `packages/core/test/event.test.ts` (+229, -1)
- `packages/core/test/fixture/tmpdir.ts` (+2, -1)
- `packages/core/test/instruction-context.test.ts` (+297, -0)
- `packages/core/test/location-layer.test.ts` (+28, -12)
- `packages/core/test/move-session.test.ts` (+249, -0)
- `packages/core/test/opencode.test.ts` (+0, -16)
- `packages/core/test/plugin/provider-snowflake-cortex.test.ts` (+193, -0)
- `packages/core/test/project-copy.test.ts` (+97, -3)
- `packages/core/test/public-opencode.test.ts` (+38, -0)
- `packages/core/test/session-create.test.ts` (+96, -5)
- `packages/core/test/session-projector.test.ts` (+173, -38)
- `packages/core/test/session-prompt.test.ts` (+138, -50)
- `packages/core/test/session-runner-message.test.ts` (+11, -5)
- `packages/core/test/session-runner-recorded.test.ts` (+9, -5)
- `packages/core/test/session-runner-tool-registry.test.ts` (+2, -2)
- `packages/core/test/session-runner.test.ts` (+609, -21)
- `packages/core/test/session-system-context.test.ts` (+0, -70)
- `packages/core/test/session-tool-progress.test.ts` (+4, -2)
- `packages/core/test/system-context-builtins.test.ts` (+127, -0)
- `packages/core/test/system-context-registry.test.ts` (+113, -0)
- `packages/core/test/system-context.test.ts` (+281, -162)
- `packages/core/test/tool-apply-patch.test.ts` (+2, -2)
- `packages/core/test/tool-bash.test.ts` (+2, -2)
- `packages/core/test/tool-edit.test.ts` (+2, -2)
- `packages/core/test/tool-glob.test.ts` (+2, -2)
- `packages/core/test/tool-grep.test.ts` (+3, -3)
- `packages/core/test/tool-question.test.ts` (+2, -2)
- `packages/core/test/tool-read.test.ts` (+2, -2)
- `packages/core/test/tool-skill.test.ts` (+2, -2)
- `packages/core/test/tool-todowrite.test.ts` (+2, -2)
- `packages/core/test/tool-webfetch.test.ts` (+2, -2)
- `packages/core/test/tool-websearch.test.ts` (+2, -2)
- `packages/core/test/tool-write.test.ts` (+2, -2)
- `packages/stats/core/package.json` (+1, -1)
- `packages/stats/core/src/domain/geo.ts` (+15, -11)
- `packages/stats/core/src/domain/home.ts` (+352, -7)

#### Other Changes
- `.github/workflows/publish.yml` (+1, -1)
- `CONTEXT.md` (+38, -27)
- `bun.lock` (+53, -43)
- `bunfig.toml` (+1, -1)
- `nix/hashes.json` (+4, -4)
- `package.json` (+4, -3)
- `packages/app/e2e/regression/prompt-thinking-level.spec.ts` (+2, -1)
- `packages/app/e2e/regression/session-list-path-loading.spec.ts` (+3, -2)
- `packages/app/e2e/regression/session-timeline-collapse-state.spec.ts` (+6, -5)
- `packages/app/e2e/regression/session-timeline-context-resize.spec.ts` (+4, -3)
- `packages/app/e2e/smoke/session-timeline.spec.ts` (+8, -4)
- `packages/app/e2e/utils/waits.ts` (+11, -0)
- `packages/app/package.json` (+1, -1)
- `packages/app/src/app.tsx` (+37, -34)
- `packages/app/src/components/dialog-edit-project.tsx` (+10, -8)
- `packages/app/src/components/dialog-select-server.tsx` (+7, -2)
- `packages/app/src/components/prompt-input/submit.test.ts` (+1, -0)
- `packages/app/src/components/prompt-input/submit.ts` (+16, -11)
- `packages/app/src/components/settings-general.tsx` (+2, -2)
- `packages/app/src/components/settings-v2/dialog-settings-v2.tsx` (+2, -8)
- `packages/app/src/components/settings-v2/general.tsx` (+6, -6)
- `packages/app/src/components/settings-v2/providers.tsx` (+10, -10)
- `packages/app/src/components/settings-v2/settings-v2.css` (+8, -8)
- `packages/app/src/components/titlebar.tsx` (+240, -202)
- `packages/app/src/context/comments.tsx` (+10, -3)
- `packages/app/src/context/directory-sync.ts` (+12, -8)
- `packages/app/src/context/file.tsx` (+7, -2)
- `packages/app/src/context/file/view-cache.ts` (+5, -4)
- `packages/app/src/context/global-sync/bootstrap.test.ts` (+18, -1)
- `packages/app/src/context/global-sync/bootstrap.ts` (+26, -22)
- `packages/app/src/context/global-sync/child-store.test.ts` (+15, -6)
- `packages/app/src/context/global-sync/child-store.ts` (+9, -6)
- `packages/app/src/context/global-sync/session-prefetch.test.ts` (+57, -14)
- `packages/app/src/context/global-sync/session-prefetch.ts` (+22, -15)
- `packages/app/src/context/global.tsx` (+26, -123)
- `packages/app/src/context/language.tsx` (+1, -0)
- `packages/app/src/context/layout-helpers.ts` (+38, -0)
- `packages/app/src/context/layout.test.ts` (+1, -1)
- `packages/app/src/context/layout.tsx` (+50, -46)
- `packages/app/src/context/local.tsx` (+9, -6)
- `packages/app/src/context/models.tsx` (+1, -0)
- `packages/app/src/context/notification.tsx` (+2, -1)
- `packages/app/src/context/permission.tsx` (+2, -1)
- `packages/app/src/context/prompt.tsx` (+6, -3)
- `packages/app/src/context/server-sdk.test.ts` (+14, -0)
- `packages/app/src/context/server-sdk.tsx` (+25, -8)
- `packages/app/src/context/server-sync.tsx` (+48, -39)
- `packages/app/src/context/server.test.ts` (+71, -1)
- `packages/app/src/context/server.tsx` (+110, -65)
- `packages/app/src/context/settings.tsx` (+1, -4)
- `packages/app/src/context/tabs.tsx` (+140, -0)
- `packages/app/src/context/terminal.test.ts` (+6, -42)
- `packages/app/src/context/terminal.tsx` (+24, -37)
- `packages/app/src/entry.tsx` (+1, -0)
- `packages/app/src/i18n/en.ts` (+1, -0)
- `packages/app/src/pages/directory-layout.tsx` (+1, -1)
- `packages/app/src/pages/error-description.test.ts` (+17, -0)
- `packages/app/src/pages/error-description.ts` (+11, -0)
- `packages/app/src/pages/error.tsx` (+2, -1)
- `packages/app/src/pages/home.tsx` (+297, -181)
- `packages/app/src/pages/layout.tsx` (+28, -20)
- `packages/app/src/pages/layout/helpers.test.ts` (+96, -0)
- `packages/app/src/pages/layout/helpers.ts` (+40, -2)
- `packages/app/src/pages/layout/project-avatar-state.ts` (+8, -2)
- `packages/app/src/pages/session.tsx` (+8, -4)
- `packages/app/src/pages/session/composer/session-question-dock.tsx` (+8, -4)
- `packages/app/src/pages/session/session-layout.ts` (+9, -3)
- `packages/app/src/pages/session/terminal-panel.tsx` (+3, -3)
- `packages/app/src/pages/session/use-session-commands.tsx` (+20, -17)
- `packages/app/src/utils/persist.test.ts` (+26, -0)
- `packages/app/src/utils/persist.ts` (+22, -9)
- `packages/app/src/utils/server-health.test.ts` (+25, -0)
- `packages/app/src/utils/server-health.ts` (+5, -2)
- `packages/app/src/utils/server-scope.test.ts` (+61, -0)
- `packages/app/src/utils/server-scope.ts` (+73, -0)
- `packages/app/src/utils/worktree.test.ts` (+24, -12)
- `packages/app/src/utils/worktree.ts` (+24, -21)
- `packages/cli/bin/lildax.cjs` (+1, -1)
- `packages/cli/package.json` (+1, -1)
- `packages/cli/script/build.ts` (+4, -2)
- `packages/cli/script/generate.ts` (+0, -0)
- `packages/cli/script/publish.ts` (+1, -0)
- `packages/cli/src/services/daemon.ts` (+77, -38)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/mail/package.json` (+1, -1)
- `packages/console/support/package.json` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/desktop/src/main/index.test.ts` (+37, -0)
- `packages/desktop/src/main/index.ts` (+3, -2)
- `packages/desktop/src/main/initialization.ts` (+6, -0)
- `packages/desktop/src/main/server.ts` (+1, -0)
- `packages/desktop/src/renderer/index.tsx` (+4, -3)
- `packages/desktop/src/renderer/initialization.test.ts` (+73, -0)
- `packages/desktop/src/renderer/initialization.ts` (+22, -0)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/enterprise/package.json` (+2, -1)
- `packages/function/package.json` (+1, -1)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/llm/src/protocols/anthropic-messages.ts` (+24, -32)
- `packages/llm/src/protocols/openai-chat.ts` (+1, -1)
- `packages/llm/src/protocols/openai-responses.ts` (+1, -1)
- `packages/llm/src/protocols/shared.ts` (+36, -2)
- `packages/llm/test/provider/anthropic-messages.test.ts` (+55, -16)
- `packages/llm/test/provider/openai-responses.test.ts` (+52, -0)
- `packages/llm/test/recorded-scenarios.ts` (+1, -1)
- `packages/llm/test/schema.test.ts` (+0, -11)
- `packages/opencode/package.json` (+2, -2)
- `packages/opencode/parsers-config.ts` (+10, -0)
- `packages/opencode/script/build.ts` (+2, -0)
- `packages/opencode/src/acp/service.ts` (+1, -5)
- `packages/opencode/src/background/job.ts` (+2, -0)
- `packages/opencode/src/cli/cmd/providers.ts` (+19, -0)
- `packages/opencode/src/cli/cmd/run.ts` (+2, -0)
- `packages/opencode/src/cli/cmd/run/footer.ts` (+126, -3)
- `packages/opencode/src/cli/cmd/run/footer.view.tsx` (+39, -3)
- `packages/opencode/src/cli/cmd/run/runtime.lifecycle.ts` (+10, -2)
- `packages/opencode/src/cli/cmd/run/runtime.ts` (+41, -29)
- `packages/opencode/src/cli/cmd/run/scrollback.surface.ts` (+45, -0)
- `packages/opencode/src/cli/cmd/run/subagent-data.ts` (+2, -0)
- `packages/opencode/src/cli/cmd/run/theme.ts` (+5, -1)
- `packages/opencode/src/cli/cmd/run/types.ts` (+2, -0)
- `packages/opencode/src/cli/cmd/tui/app.tsx` (+9, -0)
- `packages/opencode/src/cli/cmd/tui/component/dialog-move-session.tsx` (+129, -0)
- `packages/opencode/src/cli/cmd/tui/component/dialog-workspace-file-changes.tsx` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/component/prompt/index.tsx` (+58, -163)
- `packages/opencode/src/cli/cmd/tui/component/prompt/move.tsx` (+158, -0)
- `packages/opencode/src/cli/cmd/tui/component/prompt/workspace.tsx` (+137, -0)
- `packages/opencode/src/cli/cmd/tui/config/keybind.ts` (+3, -0)
- `packages/opencode/src/cli/cmd/tui/context/path-format.tsx` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/context/sync-v2.tsx` (+128, -27)
- `packages/opencode/src/cli/cmd/tui/context/sync.tsx` (+16, -0)
- `packages/opencode/src/cli/cmd/tui/context/theme.tsx` (+112, -24)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/home/footer.tsx` (+6, -1)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/session/dialog.tsx` (+40, -19)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/session/preview-pane.tsx` (+16, -110)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/session/util.tsx` (+0, -16)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/sidebar/footer.tsx` (+7, -5)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/system/session-v2.tsx` (+3, -0)
- `packages/opencode/src/cli/cmd/tui/routes/home.tsx` (+3, -2)
- `packages/opencode/src/cli/cmd/tui/routes/home/session-destination.tsx` (+26, -0)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+54, -5)
- `packages/opencode/src/cli/cmd/tui/routes/session/permission.tsx` (+14, -4)
- `packages/opencode/src/cli/cmd/tui/ui/dialog-select.tsx` (+24, -3)
- `packages/opencode/src/provider/provider.ts` (+87, -0)
- `packages/opencode/src/server/routes/instance/httpapi/api.ts` (+3, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/control-plane.ts` (+35, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/experimental.ts` (+15, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/global.ts` (+3, -3)
- `packages/opencode/src/server/routes/instance/httpapi/groups/project-copy.ts` (+25, -6)
- `packages/opencode/src/server/routes/instance/httpapi/groups/sync.ts` (+3, -2)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/control-plane.ts` (+35, -0)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/experimental.ts` (+21, -0)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/project-copy.ts` (+103, -4)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/sync.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+8, -1)
- `packages/opencode/src/server/shared/workspace-routing.ts` (+3, -1)
- `packages/opencode/src/session/compaction.ts` (+3, -1)
- `packages/opencode/src/session/processor.ts` (+54, -34)
- `packages/opencode/src/session/prompt.ts` (+6, -0)
- `packages/opencode/src/session/run-state.ts` (+0, -1)
- `packages/opencode/src/skill/index.ts` (+2, -3)
- `packages/opencode/test/background/job.test.ts` (+50, -3)
- `packages/opencode/test/cli/run/footer.view.test.tsx` (+33, -4)
- `packages/opencode/test/cli/run/scrollback.surface.test.ts` (+79, -2)
- `packages/opencode/test/cli/run/theme.test.ts` (+37, -0)
- `packages/opencode/test/cli/tui/sync-v2.test.tsx` (+479, -58)
- `packages/opencode/test/cli/tui/theme-store.test.ts` (+26, -1)
- `packages/opencode/test/server/httpapi-control-plane.test.ts` (+63, -0)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+19, -0)
- `packages/opencode/test/server/httpapi-global.test.ts` (+4, -1)
- `packages/opencode/test/server/httpapi-session.test.ts` (+10, -9)
- `packages/opencode/test/server/httpapi-sync.test.ts` (+7, -0)
- `packages/opencode/test/server/project-copy.test.ts` (+5, -4)
- `packages/opencode/test/server/session-actions.test.ts` (+19, -0)
- `packages/opencode/test/server/workspace-routing.test.ts` (+5, -0)
- `packages/opencode/test/session/prompt.test.ts` (+30, -0)
- `packages/opencode/test/storage/workspace-time-migration.test.ts` (+2, -2)
- `packages/opencode/test/v2/session-message-updater.test.ts` (+12, -4)
- `packages/plugin/package.json` (+4, -4)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+309, -226)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+333, -25)
- `packages/sdk/openapi.json` (+1686, -468)
- `packages/server/package.json` (+1, -1)
- `packages/server/src/groups/v2/session.ts` (+1, -1)
- `packages/server/sst-env.d.ts` (+10, -0)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/app/src/routes/[lab]/[model].tsx` (+826, -0)
- `packages/stats/app/src/routes/[lab]/index.tsx` (+427, -0)
- `packages/stats/app/src/routes/index.css` (+952, -178)
- `packages/stats/app/src/routes/index.tsx` (+20, -472)
- `packages/stats/app/src/routes/model-catalog.ts` (+224, -0)
- `packages/stats/app/src/routes/stats-shell.tsx` (+493, -0)
- `packages/stats/server/package.json` (+1, -1)
- `packages/ui/package.json` (+3, -2)
- `packages/ui/script/build-oc2-v2-overrides.ts` (+32, -0)
- `packages/ui/src/components/session-review.tsx` (+0, -1)
- `packages/ui/src/context/helper.tsx` (+6, -5)
- `packages/ui/src/theme/context.tsx` (+8, -2)
- `packages/ui/src/theme/desktop-theme.schema.json` (+7, -0)
- `packages/ui/src/theme/index.ts` (+3, -0)
- `packages/ui/src/theme/loader.ts` (+14, -5)
- `packages/ui/src/theme/themes/matrix.json` (+22, -0)
- `packages/ui/src/theme/themes/oc-2.json` (+376, -0)
- `packages/ui/src/theme/types.ts` (+5, -0)
- `packages/ui/src/theme/v2/avatar.ts` (+48, -0)
- `packages/ui/src/theme/v2/default-primitives.ts` (+113, -0)
- `packages/ui/src/theme/v2/foreground.ts` (+20, -0)
- `packages/ui/src/theme/v2/mapping.ts` (+148, -0)
- `packages/ui/src/theme/v2/resolve.ts` (+153, -0)
- `packages/ui/src/v2/components/dialog-v2.css` (+3, -2)
- `packages/ui/src/v2/components/dialog-v2.stories.tsx` (+1, -1)
- `packages/ui/src/v2/components/dialog-v2.tsx` (+18, -2)
- `packages/ui/src/v2/components/project-avatar-v2.css` (+1, -1)
- `packages/ui/src/v2/styles/theme.css` (+58, -55)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/ar/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/bs/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/da/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/de/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/es/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/fr/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/it/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/ja/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/ko/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/nb/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/pl/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/providers.mdx` (+59, -0)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/ru/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/th/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/tr/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+4, -4)
- `sdks/vscode/package.json` (+1, -1)
- `specs/v2/schema-changelog.md` (+109, -4)
- `specs/v2/session.md` (+63, -3)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index e9645f8..71bc49a 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.15.13",
+  "version": "1.16.0",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/migration/20260603040000_session_message_projection_order/migration.sql
```diff
diff --git a/packages/core/migration/20260603040000_session_message_projection_order/migration.sql b/packages/core/migration/20260603040000_session_message_projection_order/migration.sql
index a56b07b..dbec67f 100644
--- a/packages/core/migration/20260603040000_session_message_projection_order/migration.sql
+++ b/packages/core/migration/20260603040000_session_message_projection_order/migration.sql
@@ -1,3 +1,4 @@
+DELETE FROM `session_message`;--> statement-breakpoint
 ALTER TABLE `session_message` ADD `seq` integer NOT NULL;--> statement-breakpoint
 DROP INDEX IF EXISTS `session_message_session_time_created_id_idx`;--> statement-breakpoint
 DROP INDEX IF EXISTS `session_message_session_type_time_created_id_idx`;--> statement-breakpoint
```

#### packages/core/migration/20260604172448_event_sourced_session_input/migration.sql
```diff
diff --git a/packages/core/migration/20260604172448_event_sourced_session_input/migration.sql b/packages/core/migration/20260604172448_event_sourced_session_input/migration.sql
new file mode 100644
index 0000000..0c89cc8
--- /dev/null
+++ b/packages/core/migration/20260604172448_event_sourced_session_input/migration.sql
@@ -0,0 +1,28 @@
+DELETE FROM `session_input`;--> statement-breakpoint
+DELETE FROM `session_message`;--> statement-breakpoint
+DELETE FROM `event`;--> statement-breakpoint
+DELETE FROM `event_sequence`;--> statement-breakpoint
+UPDATE `session` SET `workspace_id` = NULL;--> statement-breakpoint
+DELETE FROM `workspace`;--> statement-breakpoint
+DROP INDEX IF EXISTS `event_aggregate_seq_idx`;--> statement-breakpoint
+CREATE UNIQUE INDEX `event_aggregate_seq_idx` ON `event` (`aggregate_id`,`seq`);--> statement-breakpoint
+DROP INDEX IF EXISTS `session_message_session_seq_idx`;--> statement-breakpoint
+CREATE UNIQUE INDEX `session_message_session_seq_idx` ON `session_message` (`session_id`,`seq`);--> statement-breakpoint
+PRAGMA foreign_keys=OFF;--> statement-breakpoint
+CREATE TABLE `__new_session_input` (
+	`id` text PRIMARY KEY,
+	`session_id` text NOT NULL,
+	`prompt` text NOT NULL,
+	`delivery` text NOT NULL,
+	`admitted_seq` integer NOT NULL,
+	`promoted_seq` integer,
+	`time_created` integer NOT NULL,
+	CONSTRAINT `fk_session_input_session_id_session_id_fk` FOREIGN KEY (`session_id`) REFERENCES `session`(`id`) ON DELETE CASCADE
+);
+--> statement-breakpoint
+DROP TABLE `session_input`;--> statement-breakpoint
+ALTER TABLE `__new_session_input` RENAME TO `session_input`;--> statement-breakpoint
+PRAGMA foreign_keys=ON;--> statement-breakpoint
+CREATE INDEX `session_input_session_pending_delivery_seq_idx` ON `session_input` (`session_id`,`promoted_seq`,`delivery`,`admitted_seq`);--> statement-breakpoint
+CREATE UNIQUE INDEX `session_input_session_admitted_seq_idx` ON `session_input` (`session_id`,`admitted_seq`);--> statement-breakpoint
+CREATE UNIQUE INDEX `session_input_session_promoted_seq_idx` ON `session_input` (`session_id`,`promoted_seq`);
```

#### packages/core/migration/20260604172448_event_sourced_session_input/snapshot.json
```diff
diff --git a/packages/core/migration/20260604172448_event_sourced_session_input/snapshot.json b/packages/core/migration/20260604172448_event_sourced_session_input/snapshot.json
new file mode 100644
index 0000000..4e91663
--- /dev/null
+++ b/packages/core/migration/20260604172448_event_sourced_session_input/snapshot.json
@@ -0,0 +1,1898 @@
+{
+  "version": "7",
+  "dialect": "sqlite",
+  "id": "84c6ad6c-6116-48e1-b973-6fee4593496b",
+  "prevIds": ["fc92fa34-8074-44c3-88f0-a5417f7fd92d"],
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

#### packages/core/migration/20260605003541_add_session_context_snapshot/migration.sql
```diff
diff --git a/packages/core/migration/20260605003541_add_session_context_snapshot/migration.sql b/packages/core/migration/20260605003541_add_session_context_snapshot/migration.sql
new file mode 100644
index 0000000..ec98751
--- /dev/null
+++ b/packages/core/migration/20260605003541_add_session_context_snapshot/migration.sql
@@ -0,0 +1,9 @@
+CREATE TABLE `session_context_epoch` (
+	`session_id` text PRIMARY KEY,
+	`baseline` text NOT NULL,
+	`snapshot` text NOT NULL,
+	`baseline_seq` integer NOT NULL,
+	`replacement_seq` integer,
+	`revision` integer DEFAULT 0 NOT NULL,
+	CONSTRAINT `fk_session_context_epoch_session_id_session_id_fk` FOREIGN KEY (`session_id`) REFERENCES `session`(`id`) ON DELETE CASCADE
+);
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/package.json
- `src/tool/AGENTS.md.ts` - update based on opencode packages/core/src/tool/AGENTS.md changes
- `src/tool/application-tools.ts` - update based on opencode packages/core/src/tool/application-tools.ts changes
- `src/tool/apply-patch.ts` - update based on opencode packages/core/src/tool/apply-patch.ts changes
- `src/tool/bash.ts` - update based on opencode packages/core/src/tool/bash.ts changes
- `src/tool/edit.ts` - update based on opencode packages/core/src/tool/edit.ts changes
- `src/tool/glob.ts` - update based on opencode packages/core/src/tool/glob.ts changes
- `src/tool/grep.ts` - update based on opencode packages/core/src/tool/grep.ts changes
- `src/tool/models-api.json.ts` - update based on kilocode packages/opencode/test/tool/fixtures/models-api.json changes
- `src/tool/native.ts` - update based on opencode packages/core/src/tool/native.ts changes
- `src/tool/question.ts` - update based on opencode packages/core/src/tool/question.ts changes
- `src/tool/read.ts` - update based on opencode packages/core/src/tool/read.ts changes
- `src/tool/skill.ts` - update based on opencode packages/core/src/tool/skill.ts changes
- `src/tool/task.test.ts` - update based on opencode packages/opencode/test/tool/task.test.ts changes
- `src/tool/task.ts` - update based on opencode packages/opencode/src/tool/task.ts changes
- `src/tool/task.txt.ts` - update based on opencode packages/opencode/src/tool/task.txt changes
- `src/tool/todowrite.ts` - update based on opencode packages/core/src/tool/todowrite.ts changes
- `src/tool/webfetch.test.ts` - update based on kilocode packages/opencode/test/tool/webfetch.test.ts changes
- `src/tool/webfetch.ts` - update based on kilocode packages/opencode/src/tool/webfetch.ts changes
- `src/tool/webfetch.ts` - update based on opencode packages/core/src/tool/webfetch.ts changes
- `src/tool/websearch.ts` - update based on opencode packages/core/src/tool/websearch.ts changes
- `src/tool/write.ts` - update based on opencode packages/core/src/tool/write.ts changes
