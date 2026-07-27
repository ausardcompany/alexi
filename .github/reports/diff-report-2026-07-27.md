# Upstream Changes Report
Generated: 2026-07-27 09:53:02

## Summary
- kilocode: 12 commits, 22 files changed
- opencode: 13 commits, 52 files changed

## kilocode Changes (a19d44c3e..b2735bfbc)

### Commits

- b2735bfbc - fix(cli): flush the session ingest tail on shutdown (#12545) (Igor Šćekić, 2026-07-27)
- 614c21ee8 - Merge pull request #12544 from Kilo-Org/fix/opus-5-adaptive-thinking (Christiaan Arnoldus, 2026-07-27)
- 17cc58112 - Merge pull request #12514 from Kilo-Org/fix-cli-subprocess-timeouts (Marius, 2026-07-27)
- 737bc7b39 - docs: include sonnet in adaptive thinking note (chrarnoldus, 2026-07-26)
- 8aeff4856 - fix(cli): cover future sonnet adaptive versions (chrarnoldus, 2026-07-26)
- a69a7cc5c - fix(cli): cover future opus adaptive versions (chrarnoldus, 2026-07-26)
- b8d83fb53 - fix(cli): support adaptive thinking for opus 5 (chrarnoldus, 2026-07-26)
- 85a5ebf3e - Merge branch 'main' into fix-cli-subprocess-timeouts (Marius, 2026-07-24)
- c4aebfe30 - fix(cli): tolerate process signal failures in test runner (marius-kilocode, 2026-07-24)
- 14934c736 - fix(cli): resolve OpenTUI links across install layouts (marius-kilocode, 2026-07-24)
- f3a400335 - fix(cli): resolve bundled OpenTUI native modules (marius-kilocode, 2026-07-24)
- a33493e72 - fix(cli): stabilize cross-platform subprocess tests (marius-kilocode, 2026-07-24)

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
- `.changeset/adaptive-opus-five.md` (+5, -0)
- `.changeset/ingest-shutdown-flush.md` (+5, -0)
- `.changeset/steady-cli-subprocess-tests.md` (+5, -0)
- `packages/opencode/script/kilocode/test-cli.ts` (+51, -0)
- `packages/opencode/script/test-runner.ts` (+117, -14)
- `packages/opencode/src/cli/cmd/serve.ts` (+2, -0)
- `packages/opencode/src/cli/cmd/tui.ts` (+3, -0)
- `packages/opencode/src/cli/tui/worker-shutdown.ts` (+14, -0)
- `packages/opencode/src/cli/tui/worker.ts` (+12, -2)
- `packages/opencode/src/kilo-sessions/ingest-drain.ts` (+18, -0)
- `packages/opencode/src/kilo-sessions/ingest-queue.ts` (+126, -16)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+13, -0)
- `packages/opencode/src/kilocode/cli/setup.ts` (+18, -0)
- `packages/opencode/src/provider/transform.ts` (+7, -5)
- `packages/opencode/test/kilocode/cli-shutdown.test.ts` (+56, -2)
- `packages/opencode/test/kilocode/sessions/ingest-drain.test.ts` (+61, -0)
- `packages/opencode/test/kilocode/sessions/ingest-queue.test.ts` (+375, -0)
- `packages/opencode/test/kilocode/sessions/worker-shutdown.test.ts` (+55, -0)
- `packages/opencode/test/kilocode/test-cli.test.ts` (+96, -0)
- `packages/opencode/test/kilocode/test-runner-cleanup.test.ts` (+132, -35)
- `packages/opencode/test/kilocode/transform-opus-4.7.test.ts` (+72, -0)
- `packages/opencode/test/lib/cli-process.ts` (+17, -2)

### Key Diffs

(no key diffs to show)

## opencode Changes (7534d23..0b4edfc)

### Commits

- 0b4edfc - chore: generate (opencode-agent[bot], 2026-07-27)
- 4469cec - refactor(app): move prompt effects into controller (#39073) (Brendan Allan, 2026-07-27)
- b06768a - feat(app): add project selector shortcut (#39074) (Brendan Allan, 2026-07-27)
- bc2d3df - sync release versions for v1.18.7 (opencode, 2026-07-27)
- 35075bb - fix(desktop): install Electron before development (#39052) (Luke Parker, 2026-07-27)
- a9afed0 - fix(desktop): remove titlebar inset in fullscreen (#38793) (Luke Parker, 2026-07-27)
- 09afffe - fix(app): preserve shadowed command owners (#39044) (Brendan Allan, 2026-07-27)
- de78da8 - chore: generate (opencode-agent[bot], 2026-07-27)
- 9ca2b44 - Connect provider e2e test (#39039) (Brendan Allan, 2026-07-27)
- 7ffc22c - chore: generate (opencode-agent[bot], 2026-07-27)
- 759f6af - fix(app): add scroll to project selector dropdown (#39016) (David Siewert, 2026-07-27)
- 1ad63cf - sync release versions for v1.18.6 (opencode, 2026-07-27)
- 7d8195e - fix(ui): keep mutable selects open (#39027) (Rahul A Mistry, 2026-07-27)

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
- `packages/console/core/package.json` (+1, -1)
- `packages/core/package.json` (+1, -1)
- `packages/stats/core/package.json` (+1, -1)

#### Other Changes
- `bun.lock` (+28, -28)
- `packages/app/e2e/user-story/model-selection-flow.spec.ts` (+97, -0)
- `packages/app/e2e/utils/mock-server.ts` (+20, -3)
- `packages/app/package.json` (+1, -1)
- `packages/app/src/components/dialog-connect-provider.tsx` (+2, -1)
- `packages/app/src/components/dialog-select-directory-v2.tsx` (+1, -0)
- `packages/app/src/components/dialog-select-directory.tsx` (+2, -2)
- `packages/app/src/components/dialog-select-model-unpaid-v2.tsx` (+2, -1)
- `packages/app/src/components/prompt-input-v2.tsx` (+60, -71)
- `packages/app/src/components/prompt-project-selector.tsx` (+37, -33)
- `packages/app/src/components/titlebar.tsx` (+10, -92)
- `packages/app/src/context/command.test.ts` (+22, -7)
- `packages/app/src/context/command.tsx` (+14, -5)
- `packages/app/src/context/platform.tsx` (+3, -0)
- `packages/app/src/pages/new-session.tsx` (+8, -0)
- `packages/app/src/pages/session.tsx` (+5, -8)
- `packages/cli/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/mail/package.json` (+1, -1)
- `packages/console/support/package.json` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/desktop/scripts/predev.ts` (+2, -0)
- `packages/desktop/src/main/ipc.ts` (+5, -0)
- `packages/desktop/src/main/windows.ts` (+11, -0)
- `packages/desktop/src/preload/index.ts` (+6, -0)
- `packages/desktop/src/preload/types.ts` (+2, -0)
- `packages/desktop/src/renderer/index.tsx` (+3, -0)
- `packages/desktop/src/renderer/window-fullscreen.ts` (+8, -0)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/enterprise/package.json` (+1, -1)
- `packages/function/package.json` (+1, -1)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/server/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/v2/components/select-v2.tsx` (+1, -0)
- `packages/web/package.json` (+1, -1)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index be70f69..140c32e 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.18.5",
+  "version": "1.18.7",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 7ecdd92..c91df0d 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.18.5",
+  "version": "1.18.7",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/stats/core/package.json
```diff
diff --git a/packages/stats/core/package.json b/packages/stats/core/package.json
index f621709..d1e74ec 100644
--- a/packages/stats/core/package.json
+++ b/packages/stats/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/stats-core",
-  "version": "1.18.5",
+  "version": "1.18.7",
   "private": true,
   "type": "module",
   "license": "MIT",
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- No specific recommendations - review changes manually
