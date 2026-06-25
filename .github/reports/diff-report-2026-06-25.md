# Upstream Changes Report
Generated: 2026-06-25 09:22:58

## Summary
- kilocode: 75 commits, 133 files changed
- opencode: 69 commits, 581 files changed

## kilocode Changes (3063fde72..761b6339a)

### Commits

- 761b6339a - Merge pull request #11672 from Kilo-Org/fix-sandbox-toggle-prompt (Marius, 2026-06-25)
- af49fc749 - Merge branch 'main' into fix-sandbox-toggle-prompt (Marius, 2026-06-25)
- fb437c33e - chore(vscode): format sandbox draft test (Marius, 2026-06-25)
- 804785440 - fix(vscode): capture pending sandbox draft edits (Marius, 2026-06-25)
- e3ad3bca8 - Merge pull request #11659 from Kilo-Org/feat/linux-network-sandbox (Marius, 2026-06-25)
- cbe29c64f - fix(vscode): preserve draft when toggling sandbox (Marius, 2026-06-25)
- 9dfd2b0bf - Merge pull request #11645 from Kilo-Org/like-drawer (Marius, 2026-06-25)
- bc9856781 - Merge branch 'main' into feat/linux-network-sandbox (Marius, 2026-06-25)
- 39e82abb6 - Merge pull request #11669 from Kilo-Org/docs/fix-marketplace-settings-anchor-link (Mark IJbema, 2026-06-25)
- 0b9c043ab - Merge branch 'main' into like-drawer (Marius, 2026-06-25)
- e71909bf7 - Merge pull request #11667 from Kilo-Org/add-config-regression-review (Mark IJbema, 2026-06-25)
- 4ecf221c1 - fix: narrow CONFIG_REGRESSION check to opencode paths only (markijbema, 2026-06-25)
- 61a50daf9 - fix: correct settings anchor link in marketplace docs (kiloconnect[bot], 2026-06-25)
- db6425515 - feat: add CONFIG_REGRESSION sub-agent concern to upstream merge review (markijbema, 2026-06-25)
- e000cbe2c - Merge pull request #11660 from Kilo-Org/fix/vscode-cli-version-marker-packaging (Catriel Müller, 2026-06-24)
- 1d9970188 - test(sandbox): isolate network status fixture (marius-kilocode, 2026-06-24)
- 10d430872 - fix(sandbox): report Linux network support (marius-kilocode, 2026-06-24)
- 2a02e757f - test(sandbox): harden Linux network coverage (marius-kilocode, 2026-06-24)
- def7b660f - Merge pull request #11487 from Kilo-Org/feat/vscode-tool-call-animations (Iván Uruchurtu, 2026-06-24)
- 6e390c1d3 - fix(vscode): exclude .cli-version marker from VSIX packaging (Catriel Müller, 2026-06-24)
- cce4da313 - Merge pull request #11657 from Kilo-Org/fix/vscode-local-bwrap-bundle (Catriel Müller, 2026-06-24)
- 7f4702bec - feat(sandbox): enforce Linux network isolation (marius-kilocode, 2026-06-24)
- 0dd4ff546 - fix(vscode): bundle local bwrap helper (Catriel Müller, 2026-06-24)
- 22ca0d641 - Merge pull request #11596 from Kilo-Org/research-linux-filesystem-sandbox (Marius, 2026-06-24)
- c2afe1528 - Merge branch 'main' into research-linux-filesystem-sandbox (Marius, 2026-06-24)
- 946db0f3a - Merge pull request #11648 from Kilo-Org/docs/marketplace-page (Mark IJbema, 2026-06-24)
- 04b7ec33c - docs: add marketplace guide (Mark IJbema, 2026-06-24)
- bd623ccee - fix(vscode): use native sandbox notifications (marius-kilocode, 2026-06-24)
- 3044ab168 - Merge pull request #11369 from Kilo-Org/docs/security-agent-guide (Jean du Plessis, 2026-06-24)
- f9b3579a7 - Merge pull request #11629 from Kilo-Org/mark/fix-jetbrains-workspace-test-flake (Mark IJbema, 2026-06-24)
- 1da0d3c82 - docs: restore Clear orphaned findings heading and remove duplicate warning text (kiloconnect[bot], 2026-06-24)
- f893ed2c9 - fix(cli): integrate sandbox status backend support (marius-kilocode, 2026-06-24)
- 4eccd0e90 - Merge remote-tracking branch 'origin/main' into research-linux-filesystem-sandbox (marius-kilocode, 2026-06-24)
- 984ceaaf4 - Merge pull request #11628 from Kilo-Org/feat-tui-sandbox-toggle (Marius, 2026-06-24)
- db0c9fa50 - Merge pull request #11626 from Kilo-Org/mark/fix-openai-ws-idle-test-flake (Mark IJbema, 2026-06-24)
- 99c474747 - Merge pull request #11627 from Kilo-Org/mark/narrow-merge-minimizer-trigger (Mark IJbema, 2026-06-24)
- 0c9519c75 - Merge pull request #11594 from Kilo-Org/storm-ridge (Marius, 2026-06-24)
- 5a8d904c6 - Update packages/kilo-docs/pages/deploy-secure/security-reviews.md (Jean du Plessis, 2026-06-24)
- 01b098889 - test(sandbox): handle unavailable network backends (marius-kilocode, 2026-06-24)
- e210010e2 - test(jetbrains): isolate workspace concurrency test (markijbema, 2026-06-24)
- 2638e06ff - feat(sandbox): add session sandbox controls (marius-kilocode, 2026-06-24)
- 77d8efa6b - Merge pull request #11597 from Kilo-Org/mark/jupyter-notebook-support-stacked (Mark IJbema, 2026-06-24)
- ef5077246 - docs: narrow merge minimizer skill trigger (markijbema, 2026-06-24)
- 1bddb20a0 - test(cli): stabilize websocket idle timeout coverage (markijbema, 2026-06-24)
- 5c11cd283 - Merge pull request #11582 from Kilo-Org/mark/fuse-marketplace-tabs (Mark IJbema, 2026-06-24)
- 588b8c899 - fix(vscode): prune unavailable marketplace filters (markijbema, 2026-06-24)
- 233fb0d12 - fix(vscode): expose type filters in high contrast (markijbema, 2026-06-24)
- ebcf81f58 - fix(vscode): match marketplace display labels in search (markijbema, 2026-06-24)
- 47dfd5e68 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-24)
- 1568a43e6 - test(vscode): trim marketplace visual coverage (Mark IJbema, 2026-06-24)
- ebb744ce2 - fix(cli): reconcile Linux sandbox network tests (Marius Wichtner, 2026-06-24)
- 72b386731 - Merge branch 'main' into research-linux-filesystem-sandbox (Marius Wichtner, 2026-06-24)
- cf07116fd - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-24)
- 34540a959 - feat(vscode): add marketplace type filters (Mark IJbema, 2026-06-24)
- 92cd9d283 - fix(vscode): avoid stale autocomplete abort controllers (Mark IJbema, 2026-06-24)
- 8dc96eff6 - fix(vscode): scope notebook autocomplete aborts (Mark IJbema, 2026-06-24)
- 64c496c50 - test(cli): cover Linux mountinfo parsing (marius-kilocode, 2026-06-23)
- 3332e2660 - test(cli): avoid privileged sandbox checks (marius-kilocode, 2026-06-23)
- f16fd3d01 - fix(ci): run mount test from core package (marius-kilocode, 2026-06-23)
- 35a73627a - fix(ci): use allowed Zig setup (marius-kilocode, 2026-06-23)
- 265a21199 - chore(cli): clarify Bubblewrap licensing (marius-kilocode, 2026-06-23)
- b9439700b - feat(vscode): support Jupyter notebook autocomplete (Mark IJbema, 2026-06-23)
- 002cf96c2 - fix(vscode): remove stale sandbox resources (marius-kilocode, 2026-06-23)
- 2772ed043 - chore(ci): annotate Linux sandbox workflows (marius-kilocode, 2026-06-23)
- 209e7a71d - feat(cli): add Linux filesystem sandbox (marius-kilocode, 2026-06-23)
- f69d1cd4b - fix(cli): bound snapshot stalls during turns (marius-kilocode, 2026-06-23)
- 455848d46 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-23)
- 45eadab04 - feat(vscode): unify marketplace browsing (Mark IJbema, 2026-06-23)
- eac8a9db8 - fix(vscode): smooth short tool animations (Iván Uruchurtu, 2026-06-22)
- c367d5c4a - Merge remote-tracking branch 'origin/main' into feat/vscode-tool-call-animations (Iván Uruchurtu, 2026-06-21)
- 8d0a5590f - fix(vscode): honor reduced motion for tool previews (Iván Uruchurtu, 2026-06-21)
- f92ad06e6 - fix(vscode): release collapsed tool details (Iván Uruchurtu, 2026-06-19)
- f47c8c333 - feat(vscode): animate expandable tool details (Iván Uruchurtu, 2026-06-19)
- abba91a73 - Update packages/kilo-docs/pages/deploy-secure/security-reviews.md (Jean du Plessis, 2026-06-17)
- c9f921990 - docs(kilo-docs): expand Security Agent guide (Jean du Plessis, 2026-06-17)

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
- `packages/core/test/kilocode/linux-sandbox.test.ts` (+739, -0)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/notebook.ts` (+99, -0)

#### Other Changes
- `.changeset/animate-tool-card-reveals.md` (+5, -0)
- `.changeset/bound-snapshot-turns.md` (+5, -0)
- `.changeset/bright-notebooks-complete.md` (+5, -0)
- `.changeset/isolate-linux-network.md` (+6, -0)
- `.changeset/keep-sandbox-toggle-drafts.md` (+5, -0)
- `.changeset/mix-marketplace-categories.md` (+5, -0)
- `.changeset/notify-sandbox-state.md` (+5, -0)
- `.changeset/sandbox-agent-writes.md` (+1, -1)
- `.changeset/toggle-tui-sandbox.md` (+7, -0)
- `.changeset/vscode-cli-version-marker-packaging.md` (+5, -0)
- `.github/workflows/publish.yml` (+22, -2)
- `.github/workflows/test.yml` (+21, -2)
- `.kilo/command/review-upstream-merge.md` (+12, -0)
- `.kilo/skills/kilocode-merge-minimizer/SKILL.md` (+3, -1)
- `nix/kilo.nix` (+4, -1)
- `packages/kilo-docs/lib/nav/customize.ts` (+1, -0)
- `packages/kilo-docs/lib/nav/deploy-secure.ts` (+1, -1)
- `packages/kilo-docs/pages/automate/mcp/overview.md` (+2, -0)
- `packages/kilo-docs/pages/customize/marketplace.md` (+70, -0)
- `packages/kilo-docs/pages/deploy-secure/security-reviews.md` (+400, -108)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/marketplace/agents-tab-empty-chromium-linux.png` (+0, -3)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/marketplace/agents-tab-with-installed-chromium-linux.png` (+0, -3)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/marketplace/agents-tab-with-items-chromium-linux.png` (+0, -3)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/marketplace/empty-list-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/marketplace/mcp-tab-empty-chromium-linux.png` (+0, -3)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/marketplace/mcp-tab-with-installed-chromium-linux.png` (+0, -3)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/marketplace/mcp-tab-with-items-chromium-linux.png` (+0, -3)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/marketplace/mixed-list-with-items-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/marketplace/skills-tab-empty-chromium-linux.png` (+0, -3)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/marketplace/skills-tab-with-installed-chromium-linux.png` (+0, -3)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/marketplace/skills-tab-with-items-chromium-linux.png` (+0, -3)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/workspace/KiloBackendWorkspaceTest.kt` (+25, -13)
- `packages/kilo-sandbox/src/backend.ts` (+16, -9)
- `packages/kilo-sandbox/src/bubblewrap.ts` (+272, -0)
- `packages/kilo-sandbox/src/context.ts` (+4, -0)
- `packages/kilo-sandbox/src/index.ts` (+2, -2)
- `packages/kilo-sandbox/src/seatbelt.ts` (+1, -1)
- `packages/kilo-sandbox/test/backend.test.ts` (+117, -5)
- `packages/kilo-sandbox/test/filesystem.test.ts` (+15, -12)
- `packages/kilo-ui/src/components/basic-tool.css` (+55, -3)
- `packages/kilo-ui/src/components/basic-tool.tsx` (+10, -8)
- `packages/kilo-ui/src/components/message-part.css` (+43, -11)
- `packages/kilo-ui/src/components/message-part.tsx` (+4, -2)
- `packages/kilo-vscode/.vscodeignore` (+4, -0)
- `packages/kilo-vscode/THIRD_PARTY_LICENSES/continue.txt` (+201, -0)
- `packages/kilo-vscode/script/build.ts` (+2, -1)
- `packages/kilo-vscode/script/bwrap-helper.ts` (+101, -0)
- `packages/kilo-vscode/script/local-bin.ts` (+14, -3)
- `packages/kilo-vscode/script/watch-cli.ts` (+2, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+217, -34)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+6, -2)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+10, -0)
- `packages/kilo-vscode/src/kilo-provider-utils.ts` (+26, -6)
- `packages/kilo-vscode/src/services/autocomplete/AutocompleteServiceManager.ts` (+30, -3)
- `packages/kilo-vscode/src/services/autocomplete/__tests__/AutocompleteServiceManager.spec.ts` (+30, -1)
- `packages/kilo-vscode/src/services/autocomplete/classic-auto-complete/AutocompleteInlineCompletionProvider.ts` (+69, -54)
- `packages/kilo-vscode/src/services/autocomplete/classic-auto-complete/__tests__/AutocompleteTelemetry.test.ts` (+1, -0)
- `packages/kilo-vscode/src/services/autocomplete/classic-auto-complete/inline-utils.ts` (+16, -1)
- `packages/kilo-vscode/src/services/autocomplete/types.ts` (+2, -0)
- `packages/kilo-vscode/src/services/cli-backend/cli-resources.ts` (+98, -0)
- `packages/kilo-vscode/src/services/cli-backend/connection-utils.ts` (+1, -0)
- `packages/kilo-vscode/src/services/cli-backend/server-manager.ts` (+6, -1)
- `packages/kilo-vscode/src/services/marketplace/detection.ts` (+8, -4)
- `packages/kilo-vscode/src/services/marketplace/types.ts` (+1, -2)
- `packages/kilo-vscode/tests/accessibility.spec.ts` (+1, -2)
- `packages/kilo-vscode/tests/setup/vscode-mock.ts` (+8, -0)
- `packages/kilo-vscode/tests/unit/autocomplete-abort-scope.test.ts` (+126, -0)
- `packages/kilo-vscode/tests/unit/autocomplete-inline-utils.test.ts` (+38, -13)
- `packages/kilo-vscode/tests/unit/autocomplete-selector.test.ts` (+18, -0)
- `packages/kilo-vscode/tests/unit/autocomplete-telemetry-utils.test.ts` (+7, -7)
- `packages/kilo-vscode/tests/unit/bwrap-helper.test.ts` (+121, -0)
- `packages/kilo-vscode/tests/unit/connection-utils.test.ts` (+10, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-load-messages.test.ts` (+186, -1)
- `packages/kilo-vscode/tests/unit/kilo-provider-utils.test.ts` (+18, -0)
- `packages/kilo-vscode/tests/unit/marketplace-actions.test.ts` (+68, -0)
- `packages/kilo-vscode/tests/unit/marketplace-installer.test.ts` (+5, -0)
- `packages/kilo-vscode/tests/unit/notebook-context.test.ts` (+188, -0)
- `packages/kilo-vscode/tests/unit/prompt-drafts.test.ts` (+45, -1)
- `packages/kilo-vscode/tests/unit/prompt-input-connection-guard.test.ts` (+42, -8)
- `packages/kilo-vscode/tests/unit/prompt-input-utils.test.ts` (+33, -0)
- `packages/kilo-vscode/tests/unit/server-manager-utils.test.ts` (+68, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+174, -26)
- `packages/kilo-vscode/webview-ui/src/components/chat/prompt-input-utils.ts` (+19, -0)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/ItemCard.tsx` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/MarketplaceListView.tsx` (+71, -51)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/MarketplaceView.tsx` (+19, -70)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/marketplace.css` (+45, -24)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/utils.ts` (+46, -3)
- `packages/kilo-vscode/webview-ui/src/stories/marketplace.stories.tsx` (+37, -171)
- `packages/kilo-vscode/webview-ui/src/types/marketplace.ts` (+2, -3)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+23, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/src/utils/prompt-drafts.ts` (+23, -0)
- `packages/opencode/Dockerfile` (+8, -2)
- `packages/opencode/script/build.ts` (+68, -34)
- `packages/opencode/script/kilocode/bubblewrap.ts` (+177, -0)
- `packages/opencode/script/postinstall.mjs` (+15, -0)
- `packages/opencode/script/publish.ts` (+6, -4)
- `packages/opencode/src/cli/cmd/tui/plugin/internal.ts` (+2, -0)
- `packages/opencode/src/kilocode/plugins/sandbox.tsx` (+131, -0)
- `packages/opencode/src/kilocode/question/index.ts` (+11, -0)
- `packages/opencode/src/kilocode/sandbox/event.ts` (+15, -0)
- `packages/opencode/src/kilocode/sandbox/policy.ts` (+109, -9)
- `packages/opencode/src/kilocode/server/httpapi/groups/sandbox.ts` (+63, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/sandbox.ts` (+21, -0)
- `packages/opencode/src/kilocode/server/httpapi/server.ts` (+2, -0)
- `packages/opencode/src/kilocode/session/fork.ts` (+2, -0)
- `packages/opencode/src/kilocode/session/part-lifecycle.ts` (+9, -0)
- `packages/opencode/src/kilocode/snapshot/track.ts` (+125, -51)
- `packages/opencode/src/question/index.ts` (+6, -2)
- `packages/opencode/src/server/routes/instance/httpapi/api.ts` (+2, -0)
- `packages/opencode/src/session/session.ts` (+21, -13)
- `packages/opencode/src/session/tools.ts` (+2, -1)
- `packages/opencode/src/snapshot/index.ts` (+24, -10)
- `packages/opencode/test/kilocode/question-cancel.test.ts` (+59, -0)
- `packages/opencode/test/kilocode/sandbox/config-network.test.ts` (+12, -3)
- `packages/opencode/test/kilocode/sandbox/sdk-config.test.ts` (+16, -0)
- `packages/opencode/test/kilocode/sandbox/session.test.ts` (+52, -0)
- `packages/opencode/test/kilocode/sandbox/shell-network.test.ts` (+68, -4)
- `packages/opencode/test/kilocode/sandbox/state.test.ts` (+234, -0)
- `packages/opencode/test/kilocode/sandbox/tui.test.ts` (+33, -0)
- `packages/opencode/test/kilocode/server/httpapi-exercise-scenarios.ts` (+27, -0)
- `packages/opencode/test/kilocode/session-fork-remap.test.ts` (+45, -0)
- `packages/opencode/test/kilocode/snapshot-track-timeout.test.ts` (+92, -3)
- `packages/opencode/test/plugin/openai-ws.test.ts` (+1, -1)
- `packages/sdk/js/src/gen/types.gen.ts` (+8, -0)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+75, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+95, -0)
- `packages/sdk/openapi.json` (+236, -0)
- `packages/ui/src/components/basic-tool.tsx` (+11, -2)
- `script/check-model-tool-network.ts` (+4, -4)

### Key Diffs

#### packages/core/test/kilocode/linux-sandbox.test.ts
```diff
diff --git a/packages/core/test/kilocode/linux-sandbox.test.ts b/packages/core/test/kilocode/linux-sandbox.test.ts
new file mode 100644
index 000000000..83d5b4303
--- /dev/null
+++ b/packages/core/test/kilocode/linux-sandbox.test.ts
@@ -0,0 +1,739 @@
+import { expect, test } from "bun:test"
+import { spawnSync } from "node:child_process"
+import { createSocket } from "node:dgram"
+import fs from "node:fs/promises"
+import os from "node:os"
+import path from "node:path"
+import { Effect } from "effect"
+import { ChildProcess, ChildProcessSpawner } from "effect/unstable/process"
+import { backendSupport, run, type Profile } from "@kilocode/sandbox"
+import { CrossSpawnSpawner } from "@opencode-ai/core/cross-spawn-spawner"
+
+const linux = process.platform === "linux" ? test : test.skip
+const linuxIPv6 = process.platform === "linux" && supportsIPv6() ? test : test.skip
+
+function profile(
+  allow: ReadonlyArray<string>,
+  denyNames: ReadonlyArray<string> = [],
+  mode: Profile["network"]["mode"] = "allow",
+): Profile {
+  return {
+    filesystem: {
+      allowWrite: allow.map((path) => ({ path, kind: "subtree" })),
+      denyWrite: [],
+      denyNames,
+    },
+    network: { mode, allowedHosts: [] },
+    environment: { deny: [], set: {} },
+  }
+}
+
+function denied(base: Profile, rules: Profile["filesystem"]["denyWrite"]): Profile {
+  return { ...base, filesystem: { ...base.filesystem, denyWrite: rules } }
+}
+
+function spawn(script: string, cwd: string, policy: Profile) {
+  return Effect.scoped(
+    run(
+      policy,
+      ChildProcessSpawner.ChildProcessSpawner.use((spawner) =>
+        spawner
+          .spawn(ChildProcess.make(process.execPath, ["-e", script], { cwd }))
+          .pipe(Effect.flatMap((handle) => handle.exitCode)),
+      ),
+    ).pipe(Effect.provide(CrossSpawnSpawner.defaultLayer)),
```

#### packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/notebook.ts
```diff
diff --git a/packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/notebook.ts b/packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/notebook.ts
new file mode 100644
index 000000000..2dca033b1
--- /dev/null
+++ b/packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/notebook.ts
@@ -0,0 +1,99 @@
+// Copied from Continue's VS Code autocomplete provider:
+// https://github.com/continuedev/continue/blob/d0a3c0b626b5bebc3bef4742eec05a0242be0bab/extensions/vscode/src/autocomplete/completionProvider.ts#L226-L263
+// Copyright 2023 Continue
+// Licensed under the Apache License, Version 2.0.
+// Modified by Kilo Code for notebook paths, cursor positions, and cache scoping.
+
+import * as vscode from "vscode"
+
+export interface NotebookContext {
+  contents: string
+  filepath: string
+  position: vscode.Position
+}
+
+interface NotebookResolution {
+  notebook: vscode.NotebookDocument
+  cells: vscode.NotebookCell[]
+  cell: vscode.NotebookCell
+  index: number
+  version: number
+}
+
+const resolutions = new WeakMap<vscode.Uri, NotebookResolution>()
+
+function resolveNotebook(uri: vscode.Uri): NotebookResolution | undefined {
+  const id = uri.toString()
+  const cached = resolutions.get(uri)
+  if (
+    cached &&
+    cached.notebook.version === cached.version &&
+    vscode.workspace.notebookDocuments.includes(cached.notebook)
+  ) {
+    return cached
+  }
+
+  resolutions.delete(uri)
+  for (const notebook of vscode.workspace.notebookDocuments) {
+    const cells = notebook.getCells()
+    const index = cells.findIndex((cell) => cell.document.uri.toString() === id)
+    if (index < 0) continue
+    const resolved = { notebook, cells, cell: cells[index]!, index, version: notebook.version }
+    resolutions.set(uri, resolved)
+    return resolved
+  }
```


## opencode Changes (cacb7d0..f55d8fa)

### Commits

- f55d8fa - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-25)
- 78234fa - fix(app): use project server for prompt drafts (#33850) (Brendan Allan, 2026-06-25)
- 98dcea0 - Revert "deps: update OpenTUI to 0.4.2 (#33610)" (#33842) (Simon Klee, 2026-06-25)
- 0149d46 - feat(app): add Chrome tab cycle shortcuts (#33838) (opencode-agent[bot], 2026-06-25)
- 5471d2a - fix(app): reveal tab avatar on hover (#33824) (opencode-agent[bot], 2026-06-25)
- b44af11 - fix(app): restore tab layout consistency (#33804) (Brendan Allan, 2026-06-25)
- 717b740 - fix(app): improve home action availability (#33805) (Brendan Allan, 2026-06-25)
- b2c688f - feat(app): restyle v2 jump-to-latest button (#33809) (Aarav Sareen, 2026-06-25)
- 1b10730 - chore: generate (opencode-agent[bot], 2026-06-25)
- aee262f - feat(app): no sesssions empty state (#33315) (Aarav Sareen, 2026-06-25)
- 6ec6db4 - fix(storybook): support prompt state capture (#33798) (Brendan Allan, 2026-06-25)
- 40ddede - fix(app): update all v1 new-session icons (#32017) (Aarav Sareen, 2026-06-25)
- 71402bc - fix(app): remove produce default values in server session state (#33793) (Brendan Allan, 2026-06-25)
- d13779b - fix(app): preserve todo dock across sessions (#33778) (Brendan Allan, 2026-06-25)
- bdee94c - fix(app): close missing session tabs (#33785) (Brendan Allan, 2026-06-25)
- 9c0d813 - chore: generate (opencode-agent[bot], 2026-06-25)
- 1bcb9d7 - feat(app): ui improvements (#32438) (Aarav Sareen, 2026-06-25)
- 4c0af7c - chore: generate (opencode-agent[bot], 2026-06-25)
- d5aa5ff - feat(app): draggable tabs (#31364) (Aarav Sareen, 2026-06-25)
- 5d4f160 - chore: generate (opencode-agent[bot], 2026-06-25)
- fed8f01 - refactor(app): lift parent session navigation (#33782) (Brendan Allan, 2026-06-25)
- 259e153 - chore: generate (opencode-agent[bot], 2026-06-25)
- cfd75d6 - fix(app): separate provider lifetimes and reactive ownership (#33739) (Luke Parker, 2026-06-25)
- dc569b5 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-25)
- 546527b - chore: generate (opencode-agent[bot], 2026-06-25)
- cdd67cf - feat(sdk): add HttpApi clients and embedded host (#33445) (Kit Langton, 2026-06-24)
- c45d1db - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-25)
- ba2ba77 - fix(app): clear late session notifications (#33753) (Brendan Allan, 2026-06-25)
- 5ca1994 - chore: generate (opencode-agent[bot], 2026-06-25)
- 3b4aaaf - refactor(app): centralize session state (#33641) (Brendan Allan, 2026-06-25)
- 56a37c3 - refactor(protocol): extract server contracts (#33708) (Kit Langton, 2026-06-24)
- f9dac26 - fix(app): remove session loading stripe (#33649) (opencode-agent[bot], 2026-06-25)
- 3730125 - chore: generate (opencode-agent[bot], 2026-06-24)
- 9bb5370 - feat(core): add session snapshot and revert system (#33226) (Dax, 2026-06-24)
- 25c6abc - fix(core): lower OpenAI text verbosity (Dax Raad, 2026-06-24)
- f4afb2c - fix(core): preserve unconfigured console models (Dax Raad, 2026-06-24)
- bba7498 - fix(core): handle unavailable fff index (Dax Raad, 2026-06-24)
- e9ee212 - fix(core): disable fff broad scanning (Dax Raad, 2026-06-24)
- 68260ea - fix(core): scope fff broad scanning (Dax Raad, 2026-06-24)
- 49ea8a9 - fix(opencode): always print MCP OAuth URL (#33716) (Aiden Cline, 2026-06-24)
- 142c5c1 - docs: add GMI Cloud provider entry to providers directory (#32914) (Isaac Huang, 2026-06-24)
- 4b83f5d - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-24)
- 121decf - chore: generate (opencode-agent[bot], 2026-06-24)
- 24b0132 - refactor(schema): extract public event definitions (#33579) (Kit Langton, 2026-06-24)
- 858f35f - sync release versions for v1.17.10 (opencode, 2026-06-24)
- 20750a3 - tui: remove logo animation (#33633) (Simon Klee, 2026-06-24)
- 1ddb75d - fix: restore dev CI (#33701) (Aiden Cline, 2026-06-24)
- ea5dd9d - zen: track model tier in stats (Frank, 2026-06-24)
- 31b58b4 - chore: generate (opencode-agent[bot], 2026-06-24)
- 42bb793 - feat(core): generate model variants (Dax Raad, 2026-06-24)
- 17f312d - refactor(core): simplify model requests (Dax Raad, 2026-06-24)
- 116ac93 - fix(mcp): hide denied resource template tool (#33686) (Aiden Cline, 2026-06-24)
- 2684293 - chore: generate (opencode-agent[bot], 2026-06-24)
- e8e83af - feat(mcp): append server instructions to context (#32490) (4rcadia, 2026-06-24)
- 2e90933 - refactor(stats): simplify locale prefix stripping (Adam, 2026-06-24)
- 69f3b63 - fix(stats): strip locale prefixes from data routes (Adam, 2026-06-24)
- db7c28b - zen: migrate to new inference (Frank, 2026-06-24)
- e45f55d - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-24)
- 04c1730 - refactor(ui): isolate session components (#33670) (Victor Navarro, 2026-06-24)
- 1ef0fd5 - chore: generate (opencode-agent[bot], 2026-06-24)
- 36501a8 - docs(llm): propose AI library design (#33666) (Shoubhit Dash, 2026-06-24)
- 6281e35 - tui: fix multi-day duration formatting (#33651) (Simon Klee, 2026-06-24)
- bd149f0 - fix(enterprise): use delete for remove share (vimtor, 2026-06-24)
- 6eec983 - feat(tui): add main branch source to diff mode (#30942) (Victor Navarro, 2026-06-24)
- 0016dfd - fix(app): always apply safe area insets (#33619) (Brendan Allan, 2026-06-24)
- fe655b7 - chore: generate (opencode-agent[bot], 2026-06-24)
- 05f335c - feat(tui): add diff viewer keybind (#33365) (Victor Navarro, 2026-06-24)
- ad3651d - feat(console): add support actions (#33492) (Victor Navarro, 2026-06-24)
- 633fc6f - ci: notify the current Discord alert role (vimtor, 2026-06-24)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
(no changes)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
- `packages/core/src/permission/saved.ts` (+3, -12)
- `packages/opencode/src/permission/index.ts` (+4, -14)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/console/core/package.json` (+1, -2)
- `packages/console/core/script/referral-backfill.ts` (+0, -153)
- `packages/console/core/src/account.ts` (+51, -1)
- `packages/console/core/src/referral.ts` (+113, -0)
- `packages/console/core/src/user.ts` (+8, -0)
- `packages/console/core/src/workspace.ts` (+9, -1)
- `packages/core/package.json` (+1, -2)
- `packages/core/src/catalog.ts` (+4, -5)
- `packages/core/src/config/plugin/provider.ts` (+4, -15)
- `packages/core/src/control-plane/move-session.ts` (+36, -18)
- `packages/core/src/event.ts` (+23, -94)
- `packages/core/src/file.ts` (+6, -0)
- `packages/core/src/filesystem.ts` (+3, -15)
- `packages/core/src/filesystem/search.ts` (+11, -4)
- `packages/core/src/filesystem/watcher.ts` (+4, -11)
- `packages/core/src/git.ts` (+738, -195)
- `packages/core/src/integration.ts` (+7, -43)
- `packages/core/src/location-layer.ts` (+4, -0)
- `packages/core/src/location.ts` (+3, -18)
- `packages/core/src/model-request.ts` (+0, -102)
- `packages/core/src/models-dev.ts` (+2, -6)
- `packages/core/src/permission.ts` (+11, -35)
- `packages/core/src/plugin.ts` (+4, -10)
- `packages/core/src/plugin/internal.ts` (+3, -1)
- `packages/core/src/plugin/models-dev.ts` (+7, -11)
- `packages/core/src/plugin/provider/opencode.ts` (+5, -11)
- `packages/core/src/plugin/variant.ts` (+39, -0)
- `packages/core/src/project.ts` (+8, -8)
- `packages/core/src/project/copy-strategies.ts` (+9, -12)
- `packages/core/src/project/copy.ts` (+7, -22)
- `packages/core/src/pty.ts` (+5, -35)
- `packages/core/src/pty/schema.ts` (+1, -13)
- `packages/core/src/pty/ticket.ts` (+3, -6)
- `packages/core/src/public-event-manifest.ts` (+3, -0)
- `packages/core/src/public/agent.ts` (+0, -6)
- `packages/core/src/public/index.ts` (+0, -9)
- `packages/core/src/public/location.ts` (+0, -6)
- `packages/core/src/public/model.ts` (+0, -9)
- `packages/core/src/public/opencode.ts` (+0, -76)
- `packages/core/src/public/session.ts` (+0, -96)
- `packages/core/src/public/tool.ts` (+0, -17)
- `packages/core/src/question.ts` (+10, -58)
- `packages/core/src/reference.ts` (+4, -11)
- `packages/core/src/repository-cache.ts` (+37, -67)
- `packages/core/src/session.ts` (+280, -228)
- `packages/core/src/session/event.ts` (+2, -468)
- `packages/core/src/session/info.ts` (+3, -0)
- `packages/core/src/session/message-updater.ts` (+9, -1)
- `packages/core/src/session/projector.ts` (+63, -3)
- `packages/core/src/session/revert.ts` (+121, -0)
- `packages/core/src/session/runner/llm.ts` (+26, -0)
- `packages/core/src/session/runner/model.ts` (+2, -6)
- `packages/core/src/session/runner/publish-llm-event.ts` (+7, -8)
- `packages/core/src/session/sql.ts` (+3, -2)
- `packages/core/src/session/todo.ts` (+4, -17)
- `packages/core/src/snapshot.ts` (+258, -8)
- `packages/core/src/v1/config/migrate.ts` (+2, -7)
- `packages/core/src/v1/config/provider-options.ts` (+8, -1)
- `packages/core/src/v1/permission.ts` (+2, -65)
- `packages/core/src/v1/session.ts` (+43, -607)
- `packages/core/test/application-tools.test.ts` (+1, -1)
- `packages/core/test/catalog.test.ts` (+2, -5)
- `packages/core/test/config/config.test.ts` (+2, -2)
- `packages/core/test/config/provider-options.test.ts` (+13, -2)
- `packages/core/test/config/provider.test.ts` (+4, -6)
- `packages/core/test/event.test.ts` (+126, -138)
- `packages/core/test/git.test.ts` (+82, -25)
- `packages/core/test/legacy-event-schema.test.ts` (+16, -0)
- `packages/core/test/location-layer.test.ts` (+1, -1)
- `packages/core/test/model-request.test.ts` (+0, -44)
- `packages/core/test/move-session.test.ts` (+2, -0)
- `packages/core/test/permission.test.ts` (+2, -0)
- `packages/core/test/plugin/host.ts` (+0, -10)
- `packages/core/test/plugin/provider-opencode.test.ts` (+3, -6)
- `packages/core/test/plugin/variant.test.ts` (+79, -0)
- `packages/core/test/public-opencode.test.ts` (+0, -76)
- `packages/core/test/public-tool.test.ts` (+0, -13)
- `packages/core/test/session-create.test.ts` (+2, -0)
- `packages/core/test/session-projector.test.ts` (+55, -0)
- `packages/core/test/session-prompt.test.ts` (+2, -0)
- `packages/core/test/session-runner-model.test.ts` (+21, -36)
- `packages/core/test/session-runner-recorded.test.ts` (+4, -0)
- `packages/core/test/session-runner-tool-events.test.ts` (+9, -0)
- `packages/core/test/session-runner.test.ts` (+4, -0)
- `packages/core/test/shared-schema.test.ts` (+0, -5)
- `packages/core/test/snapshot.test.ts` (+189, -0)
- `packages/enterprise/src/core/share.ts` (+6, -0)
- `packages/enterprise/test/core/share.test.ts` (+8, -0)
- `packages/stats/core/package.json` (+1, -1)

#### Other Changes
- `.github/workflows/publish.yml` (+1, -0)
- `.github/workflows/storybook.yml` (+2, -0)
- `.github/workflows/test.yml` (+5, -0)
- `AGENTS.md` (+1, -0)
- `CONTEXT.md` (+77, -9)
- `bun.lock` (+169, -46)
- `infra/console.ts` (+1, -0)
- `infra/enterprise.ts` (+1, -0)
- `infra/secret.ts` (+1, -0)
- `infra/stats.ts` (+2, -1)
- `nix/hashes.json` (+4, -4)
- `package.json` (+3, -3)
- `packages/app/e2e/performance/timeline/session-timeline-benchmark.fixture.ts` (+0, -1)
- `packages/app/e2e/performance/timeline/timeline-test-helpers.ts` (+0, -1)
- `packages/app/e2e/regression/cross-server-tab-close.spec.ts` (+135, -0)
- `packages/app/e2e/regression/session-request-docks.spec.ts` (+132, -0)
- `packages/app/e2e/regression/session-timeline-collapse-state.spec.ts` (+0, -1)
- `packages/app/e2e/regression/session-timeline-context-resize.spec.ts` (+0, -1)
- `packages/app/e2e/regression/session-todo-dock-navigation.spec.ts` (+186, -0)
- `packages/app/e2e/smoke/session-timeline.spec.ts` (+0, -1)
- `packages/app/e2e/utils/mock-server.ts` (+11, -11)
- `packages/app/package.json` (+4, -3)
- `packages/app/src/app.tsx` (+38, -30)
- `packages/app/src/components/command-tooltip-keybind.test.ts` (+22, -0)
- `packages/app/src/components/command-tooltip-keybind.ts` (+11, -0)
- `packages/app/src/components/dialog-connect-provider.tsx` (+4, -4)
- `packages/app/src/components/dialog-custom-provider.tsx` (+3, -2)
- `packages/app/src/components/dialog-manage-models.tsx` (+3, -1)
- `packages/app/src/components/dialog-select-model-unpaid.tsx` (+7, -4)
- `packages/app/src/components/dialog-select-model.tsx` (+7, -2)
- `packages/app/src/components/dialog-select-provider.tsx` (+5, -5)
- `packages/app/src/components/prompt-input.stories.tsx` (+105, -11)
- `packages/app/src/components/prompt-input.tsx` (+11, -21)
- `packages/app/src/components/prompt-input/attachments.ts` (+66, -37)
- `packages/app/src/components/prompt-input/submission-state.ts` (+31, -0)
- `packages/app/src/components/prompt-input/submit.test.ts` (+41, -2)
- `packages/app/src/components/prompt-input/submit.ts` (+33, -41)
- `packages/app/src/components/prompt-input/transient-state.ts` (+43, -0)
- `packages/app/src/components/server/server-row-menu.tsx` (+1, -1)
- `packages/app/src/components/server/server-row.tsx` (+1, -1)
- `packages/app/src/components/session-context-usage.tsx` (+3, -1)
- `packages/app/src/components/session/session-context-tab.tsx` (+5, -3)
- `packages/app/src/components/session/session-header.tsx` (+19, -4)
- `packages/app/src/components/settings-general.tsx` (+0, -12)
- `packages/app/src/components/settings-v2/general.tsx` (+0, -12)
- `packages/app/src/components/titlebar-session-events.test.ts` (+5, -1)
- `packages/app/src/components/titlebar-session-events.ts` (+6, -0)
- `packages/app/src/components/titlebar-tab-drag.test.ts` (+141, -0)
- `packages/app/src/components/titlebar-tab-drag.ts` (+137, -0)
- `packages/app/src/components/titlebar-tab-gesture.ts` (+37, -0)
- `packages/app/src/components/titlebar-tab-nav.css` (+98, -0)
- `packages/app/src/components/titlebar-tab-nav.tsx` (+351, -0)
- `packages/app/src/components/titlebar-tab-strip.tsx` (+576, -0)
- `packages/app/src/components/titlebar.css` (+31, -0)
- `packages/app/src/components/titlebar.tsx` (+48, -427)
- `packages/app/src/context/command.tsx` (+5, -0)
- `packages/app/src/context/directory-sync.ts` (+84, -550)
- `packages/app/src/context/global-sync/bootstrap.test.ts` (+1, -1)
- `packages/app/src/context/global-sync/bootstrap.ts` (+56, -27)
- `packages/app/src/context/global-sync/child-store.test.ts` (+1, -1)
- `packages/app/src/context/global-sync/child-store.ts` (+1, -1)
- `packages/app/src/context/global-sync/event-reducer.ts` (+20, -2)
- `packages/app/src/context/global-sync/session-prefetch.test.ts` (+0, -139)
- `packages/app/src/context/global-sync/session-prefetch.ts` (+0, -107)
- `packages/app/src/context/global-sync/types.ts` (+1, -1)
- `packages/app/src/context/global-sync/utils.ts` (+1, -1)
- `packages/app/src/context/global.tsx` (+0, -3)
- `packages/app/src/context/local.tsx` (+1, -1)
- `packages/app/src/context/models.tsx` (+3, -3)
- `packages/app/src/context/prompt.tsx` (+19, -19)
- `packages/app/src/context/server-session.test.ts` (+98, -0)
- `packages/app/src/context/server-session.ts` (+634, -0)
- `packages/app/src/context/server-sync.tsx` (+18, -33)
- `packages/app/src/context/settings.tsx` (+0, -9)
- `packages/app/src/context/tabs.tsx` (+44, -25)
- `packages/app/src/hooks/provider-catalog.test.ts` (+59, -0)
- `packages/app/src/hooks/provider-catalog.ts` (+27, -0)
- `packages/app/src/hooks/use-providers.ts` (+18, -8)
- `packages/app/src/i18n/ar.ts` (+0, -2)
- `packages/app/src/i18n/br.ts` (+0, -3)
- `packages/app/src/i18n/bs.ts` (+0, -3)
- `packages/app/src/i18n/da.ts` (+0, -3)
- `packages/app/src/i18n/de.ts` (+0, -3)
- `packages/app/src/i18n/en.ts` (+3, -5)
- `packages/app/src/i18n/es.ts` (+0, -3)
- `packages/app/src/i18n/fr.ts` (+0, -3)
- `packages/app/src/i18n/ja.ts` (+0, -3)
- `packages/app/src/i18n/ko.ts` (+0, -3)
- `packages/app/src/i18n/no.ts` (+0, -3)
- `packages/app/src/i18n/pl.ts` (+0, -3)
- `packages/app/src/i18n/ru.ts` (+0, -3)
- `packages/app/src/i18n/th.ts` (+0, -3)
- `packages/app/src/i18n/tr.ts` (+0, -4)
- `packages/app/src/i18n/uk.ts` (+0, -3)
- `packages/app/src/i18n/zh.ts` (+3, -3)
- `packages/app/src/i18n/zht.ts` (+0, -2)
- `packages/app/src/index.css` (+7, -37)
- `packages/app/src/pages/directory-layout.tsx` (+23, -16)
- `packages/app/src/pages/home-session-archive.test.ts` (+51, -0)
- `packages/app/src/pages/home-session-archive.ts` (+37, -0)
- `packages/app/src/pages/home.tsx` (+211, -112)
- `packages/app/src/pages/layout-new.tsx` (+8, -1)
- `packages/app/src/pages/layout.tsx` (+10, -104)
- `packages/app/src/pages/layout/project-avatar-state.ts` (+2, -3)
- `packages/app/src/pages/layout/session-tab-avatar.tsx` (+12, -2)
- `packages/app/src/pages/layout/sidebar-items.tsx` (+18, -8)
- `packages/app/src/pages/layout/sidebar-project.tsx` (+4, -2)
- `packages/app/src/pages/layout/sidebar-workspace.tsx` (+5, -2)
- `packages/app/src/pages/new-session.tsx` (+26, -7)
- `packages/app/src/pages/session.tsx` (+140, -93)
- `packages/app/src/pages/session/composer/index.ts` (+1, -0)
- `packages/app/src/pages/session/composer/session-composer-controls.ts` (+115, -0)
- `packages/app/src/pages/session/composer/session-composer-region.tsx` (+60, -164)
- `packages/app/src/pages/session/composer/session-composer-state.test.ts` (+11, -1)
- `packages/app/src/pages/session/composer/session-composer-state.ts` (+21, -8)
- `packages/app/src/pages/session/composer/session-permission-dock.tsx` (+1, -1)
- `packages/app/src/pages/session/composer/session-question-dock.tsx` (+1, -1)
- `packages/app/src/pages/session/composer/session-todo-dock.tsx` (+2, -3)
- `packages/{ui/src/components => app/src/pages/session/composer}/todo-panel-motion.stories.tsx` (+34, -15)
- `packages/app/src/pages/session/file-tabs.tsx` (+3, -3)
- `packages/app/src/pages/session/review-tab.tsx` (+2, -2)
- `packages/app/src/pages/session/session-ownership.ts` (+37, -0)
- `packages/app/src/pages/session/timeline/message-timeline.tsx` (+47, -84)
- `packages/app/src/pages/session/timeline/model.ts` (+6, -14)
- `packages/app/src/pages/session/timeline/rows.ts` (+1, -1)
- `packages/app/src/pages/session/use-session-commands.tsx` (+73, -37)
- `packages/app/src/utils/server-errors.test.ts` (+32, -1)
- `packages/app/src/utils/server-errors.ts` (+7, -0)
- `packages/app/src/utils/session-placement.test.ts` (+0, -38)
- `packages/app/src/utils/session-placement.ts` (+0, -41)
- `packages/app/src/utils/session-route.test.ts` (+46, -1)
- `packages/app/src/utils/session-route.ts` (+25, -2)
- `packages/app/test-browser/motion-spring.test.ts` (+20, -0)
- `packages/app/test-browser/prompt-attachments.test.ts` (+90, -0)
- `packages/app/test-browser/prompt-scope.test.ts` (+14, -0)
- `packages/app/test-browser/prompt-submission-state.test.ts` (+56, -0)
- `packages/app/test-browser/prompt-transient-state.test.ts` (+36, -0)
- `packages/app/test-browser/session-ownership.test.ts` (+45, -0)
- `packages/cli/package.json` (+1, -1)
- `packages/client/README.md` (+27, -0)
- `packages/client/package.json` (+39, -0)
- `packages/client/script/build.ts` (+23, -0)
- `packages/client/src/contract.ts` (+19, -0)
- `packages/client/src/effect.ts` (+12, -0)
- `packages/client/src/generated-effect/.httpapi-codegen.json` (+1, -0)
- `packages/client/src/generated-effect/client-error.ts` (+5, -0)
- `packages/client/src/generated-effect/client.ts` (+164, -0)
- `packages/client/src/generated-effect/index.ts` (+2, -0)
- `packages/client/src/generated/.httpapi-codegen.json` (+1, -0)
- `packages/client/src/generated/client-error.ts` (+11, -0)
- `packages/client/src/generated/client.ts` (+349, -0)
- `packages/client/src/generated/index.ts` (+3, -0)
- `packages/client/src/generated/types.ts` (+631, -0)
- `packages/client/src/index.ts` (+1, -0)
- `packages/client/test/contract-identity.test.ts` (+60, -0)
- `packages/client/test/effect.test.ts` (+98, -0)
- `packages/client/test/import-boundaries.test.ts` (+68, -0)
- `packages/client/test/promise.test.ts` (+117, -0)
- `packages/client/tsconfig.json` (+9, -0)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/routes/api/support/actions/create-referral.ts` (+24, -0)
- `packages/console/app/src/routes/api/support/actions/delete-account.ts` (+21, -0)
- `packages/console/app/src/routes/honeycomb/webhook.ts` (+1, -1)
- `packages/console/app/src/routes/zen/util/handler.ts` (+2, -1)
- `packages/console/app/src/routes/zen/util/provider/anthropic.ts` (+0, -1)
- `packages/console/app/src/routes/zen/util/provider/google.ts` (+0, -1)
- `packages/console/app/src/routes/zen/util/provider/openai-compatible.ts` (+0, -1)
- `packages/console/app/src/routes/zen/util/provider/openai.ts` (+0, -1)
- `packages/console/app/src/routes/zen/util/provider/provider.ts` (+0, -1)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/function/src/log-processor.ts` (+2, -1)
- `packages/console/mail/package.json` (+1, -1)
- `packages/console/support/package.json` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/enterprise/package.json` (+2, -1)
- `packages/enterprise/src/app.css` (+1, -0)
- `packages/enterprise/src/routes/api/[...path].ts` (+16, -0)
- `packages/enterprise/src/routes/share/[shareID].tsx` (+6, -6)
- `packages/function/package.json` (+1, -1)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/httpapi-codegen/README.md` (+42, -0)
- `packages/httpapi-codegen/package.json` (+22, -0)
- `packages/httpapi-codegen/src/index.ts` (+1147, -0)
- `packages/httpapi-codegen/test/effect.ts` (+28, -0)
- `packages/httpapi-codegen/test/fixture.ts` (+45, -0)
- `packages/httpapi-codegen/test/generate.test.ts` (+897, -0)
- `packages/httpapi-codegen/test/generated-consumer.ts` (+28, -0)
- `packages/httpapi-codegen/test/generated/client-error.ts` (+5, -0)
- `packages/httpapi-codegen/test/generated/client.ts` (+16, -0)
- `packages/httpapi-codegen/test/generated/event.ts` (+39, -0)
- `packages/httpapi-codegen/test/generated/index.ts` (+2, -0)
- `packages/httpapi-codegen/test/generated/session.ts` (+96, -0)
- `packages/httpapi-codegen/test/generated/system.ts` (+25, -0)
- `packages/httpapi-codegen/test/write.test.ts` (+160, -0)
- `packages/httpapi-codegen/tsconfig.json` (+8, -0)
- `packages/llm/DESIGN.md` (+1114, -0)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/package.json` (+3, -1)
- `packages/opencode/src/cli/cmd/mcp.ts` (+6, -17)
- `packages/opencode/src/command/index.ts` (+2, -11)
- `packages/opencode/src/control-plane/workspace.ts` (+5, -21)
- `packages/opencode/src/event-manifest.ts` (+3, -0)
- `packages/opencode/src/event-v2-bridge.ts` (+2, -8)
- `packages/opencode/src/ide/index.ts` (+2, -9)
- `packages/opencode/src/installation/index.ts` (+2, -15)
- `packages/opencode/src/lsp/lsp.ts` (+2, -4)
- `packages/opencode/src/mcp/catalog.ts` (+2, -0)
- `packages/opencode/src/mcp/index.ts` (+51, -20)
- `packages/opencode/src/project/project.ts` (+10, -39)
- `packages/opencode/src/project/vcs.ts` (+3, -9)
- `packages/opencode/src/question/index.ts` (+20, -86)
- `packages/opencode/src/question/schema.ts` (+3, -9)
- `packages/opencode/src/server/event.ts` (+2, -5)
- `packages/opencode/src/server/routes/instance/httpapi/api.ts` (+12, -5)
- `packages/opencode/src/server/routes/instance/httpapi/groups/global.ts` (+3, -5)
- `packages/opencode/src/server/tui-event.ts` (+1, -53)
- `packages/opencode/src/session/compaction.ts` (+2, -9)
- `packages/opencode/src/session/message-v2.ts` (+2, -14)
- `packages/opencode/src/session/prompt.ts` (+8, -2)
- `packages/opencode/src/session/session.ts` (+19, -63)
- `packages/opencode/src/session/status.ts` (+5, -44)
- `packages/opencode/src/session/system.ts` (+28, -2)
- `packages/opencode/src/session/todo.ts` (+5, -19)
- `packages/opencode/src/snapshot/index.ts` (+2, -10)
- `packages/opencode/src/worktree/index.ts` (+2, -16)
- `packages/opencode/test/config/tui.test.ts` (+2, -0)
- `packages/opencode/test/event-manifest.test.ts` (+24, -0)
- `packages/opencode/test/mcp/lifecycle.test.ts` (+59, -0)
- `packages/opencode/test/mcp/oauth-auto-connect.test.ts` (+2, -0)
- `packages/opencode/test/mcp/oauth-browser.test.ts` (+10, -3)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+22, -0)
- `packages/opencode/test/server/httpapi-query-schema-drift.test.ts` (+1, -1)
- `packages/opencode/test/session/prompt.test.ts` (+75, -28)
- `packages/opencode/test/session/snapshot-tool-race.test.ts` (+1, -0)
- `packages/opencode/test/session/system.test.ts` (+55, -0)
- `packages/plugin/package.json` (+4, -4)
- `packages/plugin/src/tui.ts` (+1, -1)
- `packages/protocol/package.json` (+22, -0)
- `packages/protocol/src/api.ts` (+86, -0)
- `packages/{server => protocol}/src/errors.ts` (+10, -0)
- `packages/protocol/src/groups/agent.ts` (+20, -0)
- `packages/{server => protocol}/src/groups/command.ts` (+4, -5)
- `packages/{server => protocol}/src/groups/credential.ts` (+2, -3)
- `packages/protocol/src/groups/event.ts` (+59, -0)
- `packages/{server => protocol}/src/groups/fs.ts` (+4, -5)
- `packages/{server => protocol}/src/groups/health.ts` (+0, -0)
- `packages/{server => protocol}/src/groups/integration.ts` (+3, -4)
- `packages/protocol/src/groups/location.ts` (+42, -0)
- `packages/{server => protocol}/src/groups/message.ts` (+11, -14)
- `packages/{server => protocol}/src/groups/model.ts` (+4, -5)
- `packages/protocol/src/groups/permission.ts` (+95, -0)
- `packages/{server => protocol}/src/groups/project-copy.ts` (+6, -7)
- `packages/{server => protocol}/src/groups/provider.ts` (+6, -7)
- `packages/{server => protocol}/src/groups/pty.ts` (+9, -11)
- `packages/protocol/src/groups/question.ts` (+84, -0)
- `packages/{server => protocol}/src/groups/reference.ts` (+3, -4)
- `packages/protocol/src/groups/session.ts` (+280, -0)
- `packages/{server => protocol}/src/groups/skill.ts` (+4, -5)
- `packages/protocol/src/middleware/authorization.ts` (+6, -0)
- `packages/protocol/src/middleware/schema-error.ts` (+7, -0)
- `packages/protocol/test/session-cursor.test.ts` (+18, -0)
- `packages/protocol/tsconfig.json` (+8, -0)
- `packages/schema/src/catalog.ts` (+6, -0)
- `packages/schema/src/credential.ts` (+2, -2)
- `packages/schema/src/durable-event-manifest.ts` (+10, -0)
- `packages/schema/src/event-manifest.ts` (+84, -0)
- `packages/schema/src/event.ts` (+125, -0)
- `packages/schema/src/file-diff.ts` (+12, -0)
- `packages/schema/src/filesystem-watcher.ts` (+13, -0)
- `packages/schema/src/filesystem.ts` (+13, -0)
- `packages/schema/src/ide-event.ts` (+13, -0)
- `packages/schema/src/index.ts` (+7, -1)
- `packages/schema/src/installation-event.ts` (+20, -0)
- `packages/schema/src/integration-id.ts` (+7, -0)
- `packages/schema/src/integration.ts` (+51, -2)
- `packages/schema/src/legacy-event.ts` (+18, -0)
- `packages/schema/src/location.ts` (+17, -3)
- `packages/schema/src/lsp-event.ts` (+7, -0)
- `packages/schema/src/mcp-event.ts` (+21, -0)
- `packages/schema/src/model-request.ts` (+0, -31)
- `packages/schema/src/model.ts` (+3, -4)
- `packages/schema/src/models-dev.ts` (+9, -0)
- `packages/schema/src/permission-saved.ts` (+20, -0)
- `packages/schema/src/permission-v1.ts` (+67, -0)
- `packages/schema/src/permission.ts` (+48, -0)
- `packages/schema/src/plugin.ts` (+15, -0)
- `packages/schema/src/project-copy.ts` (+29, -0)
- `packages/schema/src/project-directories.ts` (+11, -0)
- `packages/schema/src/project-id.ts` (+8, -0)
- `packages/schema/src/project.ts` (+36, -5)
- `packages/schema/src/pty-ticket.ts` (+9, -0)
- `packages/schema/src/pty.ts` (+55, -0)
- `packages/schema/src/question-v1.ts` (+66, -0)
- `packages/schema/src/question.ts` (+79, -0)
- `packages/schema/src/reference.ts` (+12, -0)
- `packages/schema/src/revert.ts` (+23, -0)
- `packages/schema/src/server-event.ts` (+8, -0)
- `packages/schema/src/session-compaction-event.ts` (+13, -0)
- `packages/schema/src/session-event.ts` (+519, -0)
- `packages/schema/src/session-id.ts` (+2, -4)
- `packages/schema/src/session-input.ts` (+1, -1)
- `packages/schema/src/session-message.ts` (+3, -2)
- `packages/schema/src/session-status-event.ts` (+50, -0)
- `packages/schema/src/session-todo.ts` (+24, -0)
- `packages/schema/src/session-v1.ts` (+676, -0)
- `packages/schema/src/session.ts` (+7, -2)
- `packages/schema/src/tui-event.ts` (+58, -0)
- `packages/schema/src/vcs-event.ts` (+13, -0)
- `packages/schema/src/workspace-event.ts` (+32, -0)
- `packages/schema/src/workspace-id.ts` (+19, -0)
- `packages/schema/src/workspace.ts` (+6, -18)
- `packages/schema/src/worktree-event.ts` (+21, -0)
- `packages/schema/sst-env.d.ts` (+10, -0)
- `packages/schema/test/compatibility.test.ts` (+10, -0)
- `packages/schema/test/event-manifest.test.ts` (+53, -0)
- `packages/schema/test/event.test.ts` (+37, -0)
- `packages/schema/test/legacy-event.test.ts` (+53, -0)
- `packages/sdk-next/README.md` (+27, -0)
- `packages/sdk-next/package.json` (+25, -0)
- `packages/sdk-next/src/index.ts` (+16, -0)
- `packages/sdk-next/src/opencode.ts` (+53, -0)
- `packages/sdk-next/src/tool.ts` (+2, -0)
- `packages/sdk-next/test/embedded.test.ts` (+84, -0)
- `packages/sdk-next/test/import-boundaries.test.ts` (+53, -0)
- `packages/sdk-next/tsconfig.json` (+8, -0)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+96, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+342, -26)
- `packages/sdk/openapi.json` (+1549, -896)
- `packages/server/package.json` (+2, -1)
- `packages/server/src/api.ts` (+7, -49)
- `packages/server/src/groups/agent.ts` (+0, -22)
- `packages/server/src/groups/event.ts` (+0, -42)
- `packages/server/src/groups/permission.ts` (+0, -86)
- `packages/server/src/groups/question.ts` (+0, -75)
- `packages/server/src/groups/session.ts` (+0, -246)
- `packages/server/src/handlers.ts` (+1, -1)
- `packages/server/src/handlers/agent.ts` (+1, -1)
- `packages/server/src/handlers/command.ts` (+1, -2)
- `packages/server/src/handlers/fs.ts` (+1, -1)
- `packages/server/src/handlers/integration.ts` (+2, -2)
- `packages/server/src/handlers/message.ts` (+2, -5)
- `packages/server/src/handlers/model.ts` (+1, -1)
- `packages/server/src/handlers/permission.ts` (+2, -2)
- `packages/server/src/handlers/project-copy.ts` (+1, -1)
- `packages/server/src/handlers/provider.ts` (+2, -3)
- `packages/server/src/handlers/pty.ts` (+7, -3)
- `packages/server/src/handlers/question.ts` (+2, -2)
- `packages/server/src/handlers/reference.ts` (+1, -1)
- `packages/server/src/handlers/session.ts` (+88, -6)
- `packages/server/src/handlers/skill.ts` (+1, -1)
- `packages/server/src/{groups => }/location.ts` (+6, -51)
- `packages/server/src/middleware/authorization.ts` (+4, -7)
- `packages/server/src/middleware/schema-error.ts` (+3, -6)
- `packages/server/src/middleware/session-location.ts` (+3, -5)
- `packages/server/src/routes.ts` (+13, -5)
- `packages/session-ui/package.json` (+67, -0)
- `packages/{ui => session-ui}/src/components/apply-patch-file.test.ts` (+0, -0)
- `packages/{ui => session-ui}/src/components/apply-patch-file.ts` (+0, -0)
- `packages/{ui => session-ui}/src/components/basic-tool.css` (+0, -0)
- `packages/{ui => session-ui}/src/components/basic-tool.stories.tsx` (+1, -1)
- `packages/{ui => session-ui}/src/components/basic-tool.tsx` (+4, -4)
- `packages/{ui => session-ui}/src/components/dock-prompt.stories.tsx` (+1, -1)
- `packages/{ui => session-ui}/src/components/dock-prompt.tsx` (+1, -1)
- `packages/{ui => session-ui}/src/components/file-media.tsx` (+1, -1)
- `packages/{ui => session-ui}/src/components/file-search.tsx` (+2, -2)
- `packages/{ui => session-ui}/src/components/file-ssr.tsx` (+1, -1)
- `packages/{ui => session-ui}/src/components/file.css` (+0, -0)
- `packages/{ui => session-ui}/src/components/file.tsx` (+0, -0)
- `packages/{ui => session-ui}/src/components/line-comment-annotations.tsx` (+1, -1)
- `packages/{ui => session-ui}/src/components/line-comment-styles.ts` (+0, -0)
- `packages/{ui => session-ui}/src/components/line-comment.stories.tsx` (+0, -0)
- `packages/{ui => session-ui}/src/components/line-comment.tsx` (+4, -4)
- `packages/{ui => session-ui}/src/components/markdown-cache.tsx` (+0, -0)
- `packages/{ui => session-ui}/src/components/markdown-code-state.test.ts` (+0, -0)
- `packages/{ui => session-ui}/src/components/markdown-code-state.ts` (+0, -0)
- `packages/{ui => session-ui}/src/components/markdown-preload.test.ts` (+0, -0)
- `packages/{ui => session-ui}/src/components/markdown-shiki.worker.ts` (+0, -0)
- `packages/{ui => session-ui}/src/components/markdown-stream.test.ts` (+0, -0)
- `packages/{ui => session-ui}/src/components/markdown-stream.ts` (+0, -0)
- `packages/{ui => session-ui}/src/components/markdown-worker-protocol.test.ts` (+0, -0)
- `packages/{ui => session-ui}/src/components/markdown-worker-protocol.ts` (+0, -0)
- `packages/{ui => session-ui}/src/components/markdown-worker-queue.test.ts` (+0, -0)
- `packages/{ui => session-ui}/src/components/markdown-worker-queue.ts` (+0, -0)
- `packages/{ui => session-ui}/src/components/markdown-worker-transport.test.ts` (+0, -0)
- `packages/{ui => session-ui}/src/components/markdown-worker-transport.ts` (+0, -0)
- `packages/{ui => session-ui}/src/components/markdown-worker.ts` (+1, -1)
- `packages/{ui => session-ui}/src/components/markdown.css` (+0, -0)
- `packages/{ui => session-ui}/src/components/markdown.stories.tsx` (+2, -2)
- `packages/{ui => session-ui}/src/components/markdown.tsx` (+2, -2)
- `packages/{ui => session-ui}/src/components/message-file.test.ts` (+0, -0)
- `packages/{ui => session-ui}/src/components/message-file.ts` (+0, -0)
- `packages/{ui => session-ui}/src/components/message-nav.css` (+0, -0)
- `packages/{ui => session-ui}/src/components/message-nav.stories.tsx` (+1, -1)
- `packages/{ui => session-ui}/src/components/message-nav.tsx` (+2, -2)
- `packages/{ui => session-ui}/src/components/message-part-text.ts` (+0, -0)
- `packages/{ui => session-ui}/src/components/message-part.css` (+0, -0)
- `packages/{ui => session-ui}/src/components/message-part.stories.tsx` (+1, -1)
- `packages/{ui => session-ui}/src/components/message-part.test.ts` (+0, -0)
- `packages/{ui => session-ui}/src/components/message-part.tsx` (+16, -16)
- `packages/{ui => session-ui}/src/components/session-diff.test.ts` (+0, -0)
- `packages/{ui => session-ui}/src/components/session-diff.ts` (+0, -0)
- `packages/{ui => session-ui}/src/components/session-retry.tsx` (+4, -4)
- `packages/{ui => session-ui}/src/components/session-review.css` (+0, -0)
- `packages/{ui => session-ui}/src/components/session-review.stories.tsx` (+1, -1)
- `packages/{ui => session-ui}/src/components/session-review.tsx` (+13, -13)
- `packages/{ui => session-ui}/src/components/session-turn.css` (+0, -0)
- `packages/{ui => session-ui}/src/components/session-turn.stories.tsx` (+1, -1)
- `packages/{ui => session-ui}/src/components/session-turn.tsx` (+10, -10)
- `packages/{ui => session-ui}/src/components/shell-submessage-motion.stories.tsx` (+0, -0)
- `packages/{ui => session-ui}/src/components/shell-submessage.css` (+0, -0)
- `packages/{ui => session-ui}/src/components/timeline-playground.stories.tsx` (+2, -2)
- `packages/{ui => session-ui}/src/components/tool-count-label.css` (+0, -0)
- `packages/{ui => session-ui}/src/components/tool-count-label.tsx` (+1, -1)
- `packages/{ui => session-ui}/src/components/tool-count-summary.css` (+0, -0)
- `packages/{ui => session-ui}/src/components/tool-count-summary.stories.tsx` (+0, -0)
- `packages/{ui => session-ui}/src/components/tool-count-summary.tsx` (+0, -0)
- `packages/{ui => session-ui}/src/components/tool-error-card.css` (+0, -0)
- `packages/{ui => session-ui}/src/components/tool-error-card.stories.tsx` (+0, -0)
- `packages/{ui => session-ui}/src/components/tool-error-card.tsx` (+6, -6)
- `packages/{ui => session-ui}/src/components/tool-status-title.css` (+0, -0)
- `packages/{ui => session-ui}/src/components/tool-status-title.tsx` (+1, -1)
- `packages/{ui => session-ui}/src/context/data.tsx` (+1, -1)
- `packages/session-ui/src/context/index.ts` (+1, -0)
- `packages/{ui => session-ui}/src/pierre/comment-hover.ts` (+0, -0)
- `packages/{ui => session-ui}/src/pierre/commented-lines.ts` (+0, -0)
- `packages/{ui => session-ui}/src/pierre/diff-selection.ts` (+0, -0)
- `packages/{ui => session-ui}/src/pierre/file-find.ts` (+0, -0)
- `packages/{ui => session-ui}/src/pierre/file-runtime.ts` (+0, -0)
- `packages/{ui => session-ui}/src/pierre/file-selection.ts` (+0, -0)
- `packages/{ui => session-ui}/src/pierre/index.ts` (+0, -0)
- `packages/{ui => session-ui}/src/pierre/media.ts` (+0, -0)
- `packages/{ui => session-ui}/src/pierre/selection-bridge.ts` (+0, -0)
- `packages/{ui => session-ui}/src/pierre/virtualizer.ts` (+0, -0)
- `packages/{ui => session-ui}/src/pierre/worker.ts` (+0, -0)
- `packages/session-ui/src/styles/index.css` (+14, -0)
- `packages/{ui => session-ui}/src/v2/components/basic-tool-v2.css` (+0, -0)
- `packages/{ui => session-ui}/src/v2/components/basic-tool-v2.stories.tsx` (+0, -0)
- `packages/{ui => session-ui}/src/v2/components/basic-tool-v2.tsx` (+2, -2)
- `packages/{ui => session-ui}/src/v2/components/session-progress-indicator-v2.css` (+0, -0)
- `packages/{ui => session-ui}/src/v2/components/session-progress-indicator-v2.stories.tsx` (+0, -0)
- `packages/{ui => session-ui}/src/v2/components/session-progress-indicator-v2.tsx` (+0, -0)
- `packages/{ui => session-ui}/src/v2/components/tool-error-card-v2.css` (+0, -0)
- `packages/{ui => session-ui}/src/v2/components/tool-error-card-v2.stories.tsx` (+1, -1)
- `packages/{ui => session-ui}/src/v2/components/tool-error-card-v2.tsx` (+0, -0)
- `packages/session-ui/sst-env.d.ts` (+10, -0)
- `packages/session-ui/tsconfig.json` (+19, -0)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/app/src/app.tsx` (+6, -0)
- `packages/stats/server/package.json` (+1, -1)
- `packages/storybook/.storybook/main.ts` (+7, -2)
- `packages/storybook/.storybook/mocks/app/context/prompt.ts` (+4, -2)
- `packages/storybook/.storybook/playground-css-plugin.ts` (+4, -4)
- `packages/storybook/.storybook/preview.tsx` (+1, -0)
- `packages/storybook/package.json` (+1, -0)
- `packages/tui/package.json` (+1, -1)
- `packages/tui/src/app.tsx` (+1, -0)
- `packages/tui/src/component/dialog-provider.tsx` (+3, -3)
- `packages/tui/src/component/logo.tsx` (+17, -841)
- `packages/tui/src/config/keybind.ts` (+2, -0)
- `packages/tui/src/feature-plugins/system/diff-viewer.tsx` (+35, -17)
- `packages/tui/src/plugin/adapters.tsx` (+1, -0)
- `packages/tui/src/routes/session/index.tsx` (+1, -1)
- `packages/tui/src/ui/dialog-prompt.tsx` (+1, -1)
- `packages/tui/src/util/locale.ts` (+2, -2)
- `packages/tui/test/cli/tui/diff-viewer.test.tsx` (+45, -4)
- `packages/ui/package.json` (+3, -6)
- `packages/ui/src/components/dialog.css` (+2, -2)
- `packages/ui/src/components/motion-spring.tsx` (+17, -4)
- `packages/ui/src/components/scroll-view.css` (+5, -1)
- `packages/ui/src/context/index.ts` (+0, -1)
- `packages/ui/src/styles/index.css` (+0, -12)
- `packages/ui/src/styles/tailwind/utilities.css` (+8, -0)
- `packages/ui/src/theme/themes/oc-2.json` (+1, -1)
- `packages/ui/src/theme/v2/mapping.ts` (+1, -1)
- `packages/ui/src/v2/components/dialog-v2.css` (+2, -2)
- `packages/ui/src/v2/components/icon-button-v2.css` (+4, -4)
- `packages/ui/src/v2/components/icon.tsx` (+4, -0)
- `packages/ui/src/v2/components/project-avatar-v2.css` (+2, -2)
- `packages/ui/src/v2/components/select-v2.css` (+1, -1)
- `packages/ui/src/v2/components/tabs-v2.css` (+3, -1)
- `packages/ui/src/v2/styles/theme.css` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/providers.mdx` (+29, -0)
- `sdks/vscode/package.json` (+1, -1)
- `sst-env.d.ts` (+12, -52)
- `turbo.json` (+4, -0)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index fa401b6..1adbeae 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.17.9",
+  "version": "1.17.10",
   "private": true,
   "type": "module",
   "license": "MIT",
@@ -37,7 +37,6 @@
     "update-limits": "script/update-limits.ts",
     "promote-limits-to-dev": "script/promote-limits.ts dev",
     "promote-limits-to-prod": "script/promote-limits.ts production",
-    "referral-backfill": "script/referral-backfill.ts",
     "typecheck": "tsgo --noEmit"
   },
   "devDependencies": {
```

#### packages/console/core/script/referral-backfill.ts
```diff
diff --git a/packages/console/core/script/referral-backfill.ts b/packages/console/core/script/referral-backfill.ts
deleted file mode 100644
index c3062ad..0000000
--- a/packages/console/core/script/referral-backfill.ts
+++ /dev/null
@@ -1,153 +0,0 @@
-import { and, Database, eq, inArray, isNull } from "../src/drizzle/index.js"
-import { Identifier } from "../src/identifier.js"
-import { Referral } from "../src/referral.js"
-import { LiteTable } from "../src/schema/billing.sql.js"
-import { ReferralRewardTable, ReferralTable } from "../src/schema/referral.sql.js"
-import { UserTable } from "../src/schema/user.sql.js"
-import { WorkspaceTable } from "../src/schema/workspace.sql.js"
-
-const backfills = [
-  {
-    inviterWorkspaceID: "wrk_00000000000000000000000000",
-    inviteeWorkspaceID: "wrk_00000000000000000000000000",
-    inviteeAccountID: "acc_00000000000000000000000000",
-  },
-]
-
-console.log(`Backfilling ${backfills.length} referrals`)
-
-for (const [index, backfill] of backfills.entries()) {
-  console.log(`[${index + 1}/${backfills.length}] ${backfill.inviterWorkspaceID} -> ${backfill.inviteeWorkspaceID}`)
-  console.log(`  invitee account: ${backfill.inviteeAccountID}`)
-
-  const result = await Database.transaction(async (tx) => {
-    if (backfill.inviterWorkspaceID === backfill.inviteeWorkspaceID) throw new Error("Self-referral workspace mismatch")
-
-    const inviterWorkspace = await tx
-      .select({ id: WorkspaceTable.id })
-      .from(WorkspaceTable)
-      .where(and(eq(WorkspaceTable.id, backfill.inviterWorkspaceID), isNull(WorkspaceTable.timeDeleted)))
-      .then((rows) => rows[0])
-    if (!inviterWorkspace) throw new Error(`Inviter workspace not found: ${backfill.inviterWorkspaceID}`)
-
-    const inviteeWorkspace = await tx
-      .select({ id: WorkspaceTable.id })
-      .from(WorkspaceTable)
-      .where(and(eq(WorkspaceTable.id, backfill.inviteeWorkspaceID), isNull(WorkspaceTable.timeDeleted)))
-      .then((rows) => rows[0])
-    if (!inviteeWorkspace) throw new Error(`Invitee workspace not found: ${backfill.inviteeWorkspaceID}`)
-
-    const inviteeUser = await tx
-      .select({ id: UserTable.id })
-      .from(UserTable)
-      .where(
-        and(
```

#### packages/console/core/src/account.ts
```diff
diff --git a/packages/console/core/src/account.ts b/packages/console/core/src/account.ts
index 6d1773b..36098f5 100644
--- a/packages/console/core/src/account.ts
+++ b/packages/console/core/src/account.ts
@@ -1,9 +1,13 @@
 import { z } from "zod"
-import { eq } from "drizzle-orm"
+import { and, eq, inArray, sql } from "drizzle-orm"
 import { fn } from "./util/fn"
 import { Database } from "./drizzle"
 import { Identifier } from "./identifier"
 import { AccountTable } from "./schema/account.sql"
+import { AuthTable } from "./schema/auth.sql"
+import { UserTable } from "./schema/user.sql"
+import { KeyTable } from "./schema/key.sql"
+import { CouponTable } from "./schema/billing.sql"
 
 export namespace Account {
   export const create = fn(
@@ -20,6 +24,52 @@ export namespace Account {
       }),
   )
 
+  export const remove = fn(z.email(), async (email) => {
+    await Database.transaction(async (tx) => {
+      const account = await tx
+        .select({ id: AccountTable.id })
+        .from(AuthTable)
+        .innerJoin(AccountTable, eq(AccountTable.id, AuthTable.accountID))
+        .where(and(eq(AuthTable.provider, "email"), eq(AuthTable.subject, email)))
+        .then((rows) => rows[0])
+      if (!account) throw new Error("Account not found")
+
+      const emails = await tx
+        .select({ email: AuthTable.subject })
+        .from(AuthTable)
+        .where(and(eq(AuthTable.accountID, account.id), eq(AuthTable.provider, "email")))
+      const users = await tx.select({ id: UserTable.id }).from(UserTable).where(eq(UserTable.accountID, account.id))
+      if (users.length > 0) {
+        await tx
+          .update(KeyTable)
+          .set({ timeDeleted: sql`now()` })
+          .where(
+            inArray(
+              KeyTable.userID,
+              users.map((user) => user.id),
+            ),
+          )
+      }
+      await tx
```

#### packages/console/core/src/referral.ts
```diff
diff --git a/packages/console/core/src/referral.ts b/packages/console/core/src/referral.ts
index 9f781df..7d683f8 100644
--- a/packages/console/core/src/referral.ts
+++ b/packages/console/core/src/referral.ts
@@ -362,6 +362,119 @@ export namespace Referral {
     })
   }
 
+  export async function create(input: { inviterWorkspaceID: string; inviteeWorkspaceID: string }) {
+    return Database.transaction(async (tx) => {
+      if (input.inviterWorkspaceID === input.inviteeWorkspaceID) throw new Error("Self-referral workspace mismatch")
+
+      const inviterWorkspace = await tx
+        .select({ id: WorkspaceTable.id })
+        .from(WorkspaceTable)
+        .where(and(eq(WorkspaceTable.id, input.inviterWorkspaceID), isNull(WorkspaceTable.timeDeleted)))
+        .then((rows) => rows[0])
+      if (!inviterWorkspace) throw new Error(`Inviter workspace not found: ${input.inviterWorkspaceID}`)
+
+      const inviteeWorkspace = await tx
+        .select({ id: WorkspaceTable.id })
+        .from(WorkspaceTable)
+        .where(and(eq(WorkspaceTable.id, input.inviteeWorkspaceID), isNull(WorkspaceTable.timeDeleted)))
+        .then((rows) => rows[0])
+      if (!inviteeWorkspace) throw new Error(`Invitee workspace not found: ${input.inviteeWorkspaceID}`)
+
+      const invitee = await tx
+        .select({ accountID: UserTable.accountID, userID: UserTable.id, liteID: LiteTable.id })
+        .from(UserTable)
+        .innerJoin(
+          LiteTable,
+          and(
+            eq(LiteTable.workspaceID, UserTable.workspaceID),
+            eq(LiteTable.userID, UserTable.id),
+            isNull(LiteTable.timeDeleted),
+          ),
+        )
+        .where(
+          and(
+            eq(UserTable.workspaceID, input.inviteeWorkspaceID),
+            eq(UserTable.role, "admin"),
+            isNull(UserTable.timeDeleted),
+          ),
+        )
+        .then((rows) => rows[0])
+      if (!invitee?.accountID) throw new Error(`Invitee Lite workspace owner not found: ${input.inviteeWorkspaceID}`)
+
+      const inviterUser = await tx
+        .select({ id: UserTable.id })
+        .from(UserTable)
```

#### packages/console/core/src/user.ts
```diff
diff --git a/packages/console/core/src/user.ts b/packages/console/core/src/user.ts
index 8b7a96f..ea379b2 100644
--- a/packages/console/core/src/user.ts
+++ b/packages/console/core/src/user.ts
@@ -11,6 +11,7 @@ import { Key } from "./key"
 import { KeyTable } from "./schema/key.sql"
 import { WorkspaceTable } from "./schema/workspace.sql"
 import { AuthTable } from "./schema/auth.sql"
+import { AccountTable } from "./schema/account.sql"
 
 export namespace User {
   const assertNotSelf = (id: string) => {
@@ -161,6 +162,13 @@ export namespace User {
   export const joinInvitedWorkspaces = fn(z.void(), async () => {
     const account = Actor.assert("account")
     const invitations = await Database.use(async (tx) => {
+      const active = await tx
+        .select({ id: AccountTable.id })
+        .from(AccountTable)
+        .where(and(eq(AccountTable.id, account.properties.accountID), isNull(AccountTable.timeDeleted)))
+        .then((rows) => rows[0])
+      if (!active) throw new Error("Account is not active")
+
       const invitations = await tx
         .select({
           id: UserTable.id,
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/test/kilocode/linux-sandbox.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/notebook.ts
