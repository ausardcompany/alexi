# Upstream Changes Report
Generated: 2026-06-28 08:53:01

## Summary
- kilocode: 13 commits, 17 files changed
- opencode: 17 commits, 134 files changed

## kilocode Changes (c9d7016ea..0134fe1ee)

### Commits

- 0134fe1ee - Merge pull request #11608 from Kilo-Org/feat/tui-routed-model-usage (Marian Alexandru Alecu, 2026-06-27)
- 02633eb8c - test(sdk): keep model usage coverage focused (Josh Lambert, 2026-06-26)
- 611fcb161 - fix(sdk): stabilize generated API contract (Josh Lambert, 2026-06-26)
- 5de54f9e8 - fix(sdk): preserve nullable billing date (Josh Lambert, 2026-06-26)
- 92a756ed3 - chore(sdk): refresh model usage API (Josh Lambert, 2026-06-26)
- 4786e38c8 - fix(tui): reuse compact routed labels (Josh Lambert, 2026-06-26)
- 0cb5afaa3 - chore(tui): minimize routed model diff (Josh Lambert, 2026-06-26)
- 831e5a309 - fix(tui): resolve routed model display names (Josh Lambert, 2026-06-26)
- 287edf119 - fix(tui): show model display names (Josh Lambert, 2026-06-26)
- 85e2c7e5c - fix(tui): group model usage by provider (Josh Lambert, 2026-06-26)
- bcacb7688 - refactor(tui): clarify session tree helper (Josh Lambert, 2026-06-26)
- e81befbb4 - fix(tui): address model usage review (Josh Lambert, 2026-06-26)
- f5f9b6b6e - feat(tui): show usage by routed model (Josh Lambert, 2026-06-26)

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
- `.changeset/show-routed-step-models.md` (+2, -1)
- `packages/opencode/src/cli/cmd/generate.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/routes/session/usage.ts` (+0, -26)
- `packages/opencode/src/kilocode/plugins/model-usage.ts` (+73, -0)
- `packages/opencode/src/kilocode/plugins/sidebar-usage.tsx` (+121, -33)
- `packages/opencode/src/kilocode/server/httpapi/groups/kilocode.ts` (+15, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilocode.ts` (+12, -1)
- `packages/opencode/src/kilocode/server/httpapi/public.ts` (+2, -0)
- `packages/opencode/src/kilocode/session/model-usage.ts` (+171, -0)
- `packages/opencode/test/cli/tui/usage.test.ts` (+0, -61)
- `packages/opencode/test/kilocode/cli/cmd/tui/model-usage.test.ts` (+87, -0)
- `packages/opencode/test/kilocode/server/httpapi-exercise-scenarios.ts` (+13, -0)
- `packages/opencode/test/kilocode/server/httpapi-public.test.ts` (+2, -0)
- `packages/opencode/test/kilocode/session-model-usage.test.ts` (+160, -0)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+38, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+64, -0)
- `packages/sdk/openapi.json` (+385, -202)

### Key Diffs

(no key diffs to show)

## opencode Changes (6861fed..dfeb1b5)

### Commits

- dfeb1b5 - feat(client): generate complete protocol client (#34164) (Kit Langton, 2026-06-27)
- 61a7f6d - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-28)
- 6446b8a - fix(sdk): preserve V2Event name for SSE streams (#34171) (Dax, 2026-06-27)
- ae53163 - fix(app): transition draft project updates (#34252) (Brendan Allan, 2026-06-28)
- 4120281 - chore: generate (opencode-agent[bot], 2026-06-27)
- a31698f - refactor(core): move more tests to nodes (#34248) (James Long, 2026-06-27)
- 6248542 - chore: generate (opencode-agent[bot], 2026-06-27)
- d25c91e - refactor(core): move session test to nodes (#34245) (James Long, 2026-06-27)
- 5d63020 - test(core): cover app node builder graphs (#34244) (James Long, 2026-06-27)
- 062f545 - chore: generate (opencode-agent[bot], 2026-06-27)
- a76c691 - refactor(core): rename app node modules (#34238) (James Long, 2026-06-27)
- 2b91a6f - fix(tui): register `prompt.skills` keybinds (#34180) (Ben Guthrie, 2026-06-27)
- 10579cc - chore: generate (opencode-agent[bot], 2026-06-27)
- 25702e0 - feat(app): new debug bar (#34237) (Aarav Sareen, 2026-06-27)
- ecc5c44 - refactor(core): make node build bind maps conditionally (#34218) (James Long, 2026-06-27)
- f5a0b92 - feat(app): minor visual updates (#34205) (Aarav Sareen, 2026-06-27)
- 2caa016 - fix(app): batch new session tab navigation (#34196) (Brendan Allan, 2026-06-27)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/core/src/tool/application-tools.ts` (+1, -1)
- `packages/core/src/tool/builtins.ts` (+2, -2)
- `packages/core/src/tool/read-filesystem.ts` (+1, -1)
- `packages/core/src/tool/registry.ts` (+1, -1)
- `packages/opencode/src/tool/registry.ts` (+1, -1)
- `packages/opencode/test/tool/registry.test.ts` (+2, -3)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
- `packages/core/src/permission/saved.ts` (+1, -1)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+2, -2)
- `packages/core/src/agent.ts` (+1, -1)
- `packages/core/src/aisdk.ts` (+1, -1)
- `packages/core/src/background-job.ts` (+1, -1)
- `packages/core/src/catalog.ts` (+1, -1)
- `packages/core/src/command.ts` (+1, -1)
- `packages/core/src/config.ts` (+1, -1)
- `packages/core/src/credential.ts` (+1, -1)
- `packages/core/src/cross-spawn-spawner.ts` (+2, -2)
- `packages/core/src/database/database.ts` (+1, -1)
- `packages/core/src/effect/{node-build.ts => app-node-builder.ts}` (+11, -5)
- `packages/core/src/effect/{layer-node-platform.ts => app-node-platform.ts}` (+2, -2)
- `packages/core/src/effect/{node.ts => app-node.ts}` (+1, -1)
- `packages/core/src/effect/{layer-node => }/layer-node.ts` (+177, -31)
- `packages/core/src/effect/layer-node/index.ts` (+0, -2)
- `packages/core/src/effect/layer-node/layer-node-tree.ts` (+0, -118)
- `packages/core/src/event.ts` (+1, -1)
- `packages/core/src/file-mutation.ts` (+1, -1)
- `packages/core/src/filesystem.ts` (+1, -1)
- `packages/core/src/filesystem/search.ts` (+1, -1)
- `packages/core/src/filesystem/watcher.ts` (+1, -1)
- `packages/core/src/fs-util.ts` (+2, -2)
- `packages/core/src/git.ts` (+1, -1)
- `packages/core/src/global.ts` (+1, -1)
- `packages/core/src/image.ts` (+1, -1)
- `packages/core/src/instruction-context.ts` (+1, -1)
- `packages/core/src/integration.ts` (+1, -1)
- `packages/core/src/location-mutation.ts` (+1, -1)
- `packages/core/src/location-service-map.ts` (+1, -1)
- `packages/core/src/location-services.ts` (+6, -6)
- `packages/core/src/location.ts` (+1, -1)
- `packages/core/src/models-dev.ts` (+2, -2)
- `packages/core/src/npm.ts` (+2, -2)
- `packages/core/src/permission.ts` (+1, -1)
- `packages/core/src/plugin.ts` (+1, -1)
- `packages/core/src/plugin/internal.ts` (+2, -2)
- `packages/core/src/policy.ts` (+1, -1)
- `packages/core/src/process.ts` (+1, -1)
- `packages/core/src/project.ts` (+1, -1)
- `packages/core/src/project/copy.ts` (+1, -1)
- `packages/core/src/project/directories.ts` (+1, -1)
- `packages/core/src/pty.ts` (+1, -1)
- `packages/core/src/pty/ticket.ts` (+1, -1)
- `packages/core/src/question.ts` (+1, -1)
- `packages/core/src/reference.ts` (+1, -1)
- `packages/core/src/reference/guidance.ts` (+1, -1)
- `packages/core/src/repository-cache.ts` (+1, -1)
- `packages/core/src/ripgrep.ts` (+1, -1)
- `packages/core/src/ripgrep/binary.ts` (+2, -2)
- `packages/core/src/session.ts` (+1, -1)
- `packages/core/src/session/execution.ts` (+1, -1)
- `packages/core/src/session/execution/local.ts` (+1, -1)
- `packages/core/src/session/projector.ts` (+1, -1)
- `packages/core/src/session/runner/llm.ts` (+2, -2)
- `packages/core/src/session/runner/model.ts` (+1, -1)
- `packages/core/src/session/store.ts` (+1, -1)
- `packages/core/src/session/todo.ts` (+1, -1)
- `packages/core/src/skill.ts` (+1, -1)
- `packages/core/src/skill/discovery.ts` (+2, -2)
- `packages/core/src/skill/guidance.ts` (+1, -1)
- `packages/core/src/snapshot.ts` (+1, -1)
- `packages/core/src/system-context/builtins.ts` (+1, -1)
- `packages/core/src/system-context/registry.ts` (+1, -1)
- `packages/core/src/tool-output-store.ts` (+1, -1)
- `packages/core/src/util/effect-flock.ts` (+1, -1)
- `packages/core/test/effect/cross-spawn-spawner.test.ts` (+2, -1)
- `packages/core/test/effect/layer-node/layer-node-types.test.ts` (+2, -3)
- `packages/core/test/effect/layer-node/layer-node.test.ts` (+10, -14)
- `packages/core/test/effect/layer-node/node-build.test.ts` (+61, -57)
- `packages/core/test/filesystem/search.test.ts` (+2, -1)
- `packages/core/test/git.test.ts` (+2, -1)
- `packages/core/test/integration.test.ts` (+5, -5)
- `packages/core/test/location-filesystem.test.ts` (+14, -9)
- `packages/core/test/location-mutation.test.ts` (+14, -7)
- `packages/core/test/plugin/skill.test.ts` (+3, -11)
- `packages/core/test/process/process.test.ts` (+2, -1)
- `packages/core/test/project-directories.test.ts` (+4, -3)
- `packages/core/test/project.test.ts` (+3, -6)
- `packages/core/test/question.test.ts` (+4, -3)
- `packages/core/test/ripgrep.test.ts` (+2, -1)
- `packages/core/test/session-projector.test.ts` (+13, -16)
- `packages/core/test/session-todo.test.ts` (+4, -2)
- `packages/core/test/skill.test.ts` (+5, -5)
- `packages/core/test/system-context/builtins.test.ts` (+15, -11)

#### Other Changes
- `bun.lock` (+1, -0)
- `nix/hashes.json` (+4, -4)
- `package.json` (+2, -1)
- `packages/app/src/components/debug-bar.tsx` (+74, -19)
- `packages/app/src/components/titlebar.tsx` (+3, -1)
- `packages/app/src/context/tabs.tsx` (+17, -15)
- `packages/app/src/pages/home.tsx` (+3, -3)
- `packages/app/src/pages/layout-new.tsx` (+1, -1)
- `packages/client/README.md` (+1, -1)
- `packages/client/script/build.ts` (+2, -4)
- `packages/client/src/contract.ts` (+37, -5)
- `packages/client/src/effect.ts` (+12, -0)
- `packages/client/src/generated-effect/client.ts` (+608, -129)
- `packages/client/src/generated/client.ts` (+621, -15)
- `packages/client/src/generated/types.ts` (+1146, -13)
- `packages/client/test/contract-identity.test.ts` (+5, -8)
- `packages/client/test/promise.test.ts` (+37, -0)
- `packages/httpapi-codegen/src/index.ts` (+40, -26)
- `packages/httpapi-codegen/test/generate.test.ts` (+105, -0)
- `packages/opencode/src/account/account.ts` (+1, -1)
- `packages/opencode/src/config/config.ts` (+1, -1)
- `packages/opencode/src/control-plane/workspace.ts` (+1, -1)
- `packages/opencode/src/installation/index.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+2, -3)
- `packages/opencode/src/session/instruction.ts` (+1, -1)
- `packages/opencode/src/session/llm.ts` (+1, -1)
- `packages/opencode/src/share/share-next.ts` (+1, -1)
- `packages/opencode/src/skill/discovery.ts` (+1, -1)
- `packages/opencode/src/worktree/index.ts` (+1, -1)
- `packages/opencode/test/git/git.test.ts` (+2, -3)
- `packages/opencode/test/server/httpapi-public-openapi.test.ts` (+17, -0)
- `packages/opencode/test/session/messages-pagination.test.ts` (+2, -3)
- `packages/opencode/test/session/processor-effect.test.ts` (+3, -4)
- `packages/opencode/test/session/retry.test.ts` (+2, -3)
- `packages/opencode/test/session/snapshot-tool-race.test.ts` (+1, -2)
- `packages/opencode/test/share/share-next.test.ts` (+4, -5)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+4, -4)
- `packages/sdk/openapi.json` (+5, -5)
- `packages/server/src/pty-environment.ts` (+1, -1)
- `packages/server/src/routes.ts` (+5, -5)
- `packages/tui/src/component/prompt/index.tsx` (+1, -0)
- `packages/tui/src/context/data.tsx` (+3, -3)
- `patches/effect@4.0.0-beta.83.patch` (+57, -0)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 636385e..edd9827 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -16,8 +16,8 @@
     "opencode": "./bin/opencode"
   },
   "exports": {
-    "./effect/layer-node": "./src/effect/layer-node/index.ts",
-    "./effect/node": "./src/effect/node.ts",
+    "./effect/layer-node": "./src/effect/layer-node.ts",
+    "./effect/app-node": "./src/effect/app-node.ts",
     "./session/runner": "./src/session/runner/index.ts",
     "./system-context": "./src/system-context/index.ts",
     "./*": "./src/*.ts"
```

#### packages/core/src/agent.ts
```diff
diff --git a/packages/core/src/agent.ts b/packages/core/src/agent.ts
index 6173551..ebdecb5 100644
--- a/packages/core/src/agent.ts
+++ b/packages/core/src/agent.ts
@@ -1,6 +1,6 @@
 export * as AgentV2 from "./agent"
 
-import { makeLocationNode } from "./effect/node"
+import { makeLocationNode } from "./effect/app-node"
 import { Array, Context, Effect, Layer, Types } from "effect"
 import { Agent } from "@opencode-ai/schema/agent"
 import { State } from "./state"
```

#### packages/core/src/aisdk.ts
```diff
diff --git a/packages/core/src/aisdk.ts b/packages/core/src/aisdk.ts
index 26bcef0..485faaa 100644
--- a/packages/core/src/aisdk.ts
+++ b/packages/core/src/aisdk.ts
@@ -1,6 +1,6 @@
 export * as AISDK from "./aisdk"
 
-import { makeLocationNode } from "./effect/node"
+import { makeLocationNode } from "./effect/app-node"
 import type { LanguageModelV3 } from "@ai-sdk/provider"
 import { Cause, Context, Effect, Layer, Schema, Scope } from "effect"
 import { ModelV2 } from "./model"
```

#### packages/core/src/background-job.ts
```diff
diff --git a/packages/core/src/background-job.ts b/packages/core/src/background-job.ts
index 98ba12e..4287830 100644
--- a/packages/core/src/background-job.ts
+++ b/packages/core/src/background-job.ts
@@ -2,7 +2,7 @@ export * as BackgroundJob from "./background-job"
 
 import { Cause, Clock, Context, Deferred, Effect, Exit, Layer, Scope, SynchronizedRef } from "effect"
 import { Identifier } from "./id/id"
-import { makeGlobalNode } from "./effect/node"
+import { makeGlobalNode } from "./effect/app-node"
 
 export type Status = "running" | "completed" | "error" | "cancelled"
 
```

#### packages/core/src/catalog.ts
```diff
diff --git a/packages/core/src/catalog.ts b/packages/core/src/catalog.ts
index f63f3f0..459ceb1 100644
--- a/packages/core/src/catalog.ts
+++ b/packages/core/src/catalog.ts
@@ -1,6 +1,6 @@
 export * as Catalog from "./catalog"
 
-import { makeLocationNode } from "./effect/node"
+import { makeLocationNode } from "./effect/app-node"
 import { Array, Context, Effect, Layer, Option, Order, pipe, Schema } from "effect"
 import { Catalog } from "@opencode-ai/schema/catalog"
 import { ModelV2 } from "./model"
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/tool/application-tools.ts` - update based on opencode packages/core/src/tool/application-tools.ts changes
- `src/tool/builtins.ts` - update based on opencode packages/core/src/tool/builtins.ts changes
- `src/tool/read-filesystem.ts` - update based on opencode packages/core/src/tool/read-filesystem.ts changes
- `src/tool/registry.test.ts` - update based on opencode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on opencode packages/core/src/tool/registry.ts changes
- `src/tool/registry.ts` - update based on opencode packages/opencode/src/tool/registry.ts changes
