# Upstream Changes Report
Generated: 2026-06-29 11:01:36

## Summary
- kilocode: 44 commits, 136 files changed
- opencode: 29 commits, 93 files changed

## kilocode Changes (0134fe1ee..3037ef6af)

### Commits

- 3037ef6af - Merge pull request #11785 from Kilo-Org/bead-apogee (Marius, 2026-06-29)
- b354e9941 - Merge branch 'main' into bead-apogee (Marius, 2026-06-29)
- ac22b40fd - Merge pull request #11218 from sylwester-liljegren/feat/file-links-2-fs-validation (Mark IJbema, 2026-06-29)
- f90ea35e5 - Merge pull request #11781 from Kilo-Org/mark/allow-translated-readme-opencode-link (Mark IJbema, 2026-06-29)
- 341474a44 - fix(agent-manager): define PR badge status icon colors in CSS (marius-kilocode, 2026-06-29)
- f48a5eabb - Merge branch 'main' into bead-apogee (Marius, 2026-06-29)
- d89b1b6e1 - Add Agent requirements (#11762) (Imanol Maiztegui, 2026-06-29)
- f9a977d52 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-29)
- 8cebfb474 - Merge branch 'main' into feat/file-links-2-fs-validation (Mark IJbema, 2026-06-29)
- 5e22a7b25 - fix(agent-manager): color PR badge by state, show checks as icon (marius-kilocode, 2026-06-29)
- 63e270a9c - Merge pull request #11602 from Kilo-Org/fix/autocomplete-error-messages-byok-credits (Mark IJbema, 2026-06-29)
- 0a69b89b2 - Merge pull request #11770 from Kilo-Org/ludicrous-circus (Marius, 2026-06-29)
- 833531f02 - Merge pull request #11776 from Kilo-Org/mark/anaconda-i18n-translations (Mark IJbema, 2026-06-29)
- ff1a0b61e - fix: allow upstream attribution in translated readmes (Mark IJbema, 2026-06-29)
- 76ad88cf4 - Merge pull request #11774 from Kilo-Org/dog-shovel (Marius, 2026-06-29)
- 2da40afed - fix(vscode): translate Anaconda Desktop provider strings in all locales (Mark IJbema, 2026-06-29)
- be4f09c8a - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-29)
- 454962357 - perf(vscode): open model, mode, and variant selectors instantly (marius-kilocode, 2026-06-29)
- 2fc5df7b9 - Merge pull request #11730 from Kilo-Org/mark/fix-jetbrains-workspace-flake (Mark IJbema, 2026-06-29)
- a3b7ce4c9 - test(jetbrains): name mock CLI virtual threads (Mark IJbema, 2026-06-29)
- 60ac27772 - fix(vscode): stabilize sandbox button across session switches (marius-kilocode, 2026-06-29)
- 33b37592a - Merge pull request #11610 from Kilo-Org/radial-rock (Marius, 2026-06-29)
- b6afd1d78 - Merge pull request #11719 from Kilo-Org/mark/show-german-i18n-diffs (Mark IJbema, 2026-06-29)
- 05f570285 - Merge pull request #11744 from Kilo-Org/legend-snap (Marius, 2026-06-29)
- e7db09ed8 - fix(vscode): improve autocomplete error messages to cover BYOK and credits scenarios (markijbema, 2026-06-29)
- 7bd233d80 - Merge pull request #11615 from Kilo-Org/docs/add-translated-readmes-directory (Mark IJbema, 2026-06-29)
- 715f6621f - Merge pull request #11613 from Kilo-Org/docs/remove-root-translated-readmes (Mark IJbema, 2026-06-29)
- 6d25c1bb1 - fix(cli): allow importing cloud-only sessions (Josh Lambert, 2026-06-26)
- ba4b693e9 - fix(vscode): preserve global permission labels (Josh Lambert, 2026-06-26)
- b622ed043 - test(core): isolate remote normalization fixture (Josh Lambert, 2026-06-26)
- 88571dca1 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-26)
- d2dff8844 - fix(vscode): show full external permission paths (Josh Lambert, 2026-06-26)
- 3ae6d2b08 - test(jetbrains): serve mock requests on virtual threads (markijbema, 2026-06-26)
- 4e2fb78a0 - test(jetbrains): await mock server shutdown (markijbema, 2026-06-26)
- f6ca36823 - fix(jetbrains): expose void teardown to JUnit (markijbema, 2026-06-26)
- 90b6b2e09 - test(jetbrains): stabilize workspace reload lifecycle (markijbema, 2026-06-26)
- 61582a843 - chore: clarify german diff visibility (Mark IJbema, 2026-06-26)
- 1111d42ee - chore: show german translation diffs (Mark IJbema, 2026-06-26)
- a0837f9aa - docs: add translated readmes in translations directory (Iván Uruchurtu, 2026-06-23)
- 1b6dcf745 - docs: remove root translated readmes (Iván Uruchurtu, 2026-06-23)
- c2076c842 - fix(vscode): resolve real path before validating file-link containment (Sylwester Liljegren, 2026-06-18)
- d497be631 - fix(vscode): scope file-link validation and fallback to the session root (Sylwester Liljegren, 2026-06-18)
- 81aad79f9 - fix(vscode): harden file-link fallback and type validateFiles message (Sylwester Liljegren, 2026-06-14)
- ed5fc5a45 - feat(vscode): add filesystem validation protocol for file links (Sylwester Liljegren, 2026-06-14)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
(no changes)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+39, -1)
- `packages/opencode/test/agent/agent.test.ts` (+2, -0)
- `packages/opencode/test/agent/plugin-agent-regression.test.ts` (+2, -0)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/test/project.test.ts` (+3, -3)

#### Other Changes
- `.changeset/agent-manager-pr-status-icon.md` (+5, -0)
- `.changeset/agent-requirements.md` (+6, -0)
- `.changeset/anaconda-desktop-translations.md` (+5, -0)
- `.changeset/fix-autocomplete-error-messages.md` (+7, -0)
- `.changeset/import-cloud-session-first.md` (+5, -0)
- `.changeset/keep-sandbox-toggle-drafts.md` (+1, -1)
- `.changeset/open-model-selector-faster.md` (+5, -0)
- `.changeset/show-external-permission-paths.md` (+5, -0)
- `.gitattributes` (+6, -1)
- `README.md` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/permission-dock-dropdown/external-dir-expanded-pending-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager-sections/with-pr-badges-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-requirements-checking-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-requirements-malformed-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-requirements-missing-extension-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-requirements-missing-tools-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-requirements-ready-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-external-dir-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/shared/model-selector-large-catalog-chromium-linux.png` (+3, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/MockCliServer.kt` (+4, -3)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/workspace/KiloBackendWorkspaceTest.kt` (+17, -21)
- `packages/kilo-vscode/src/KiloProvider.ts` (+61, -4)
- `packages/kilo-vscode/src/kilo-provider/agent-requirements-controller.ts` (+198, -0)
- `packages/kilo-vscode/src/kilo-provider/agent-requirements.ts` (+103, -0)
- `packages/kilo-vscode/src/kilo-provider/editor-actions.ts` (+69, -14)
- `packages/kilo-vscode/src/kilo-provider/file-links.ts` (+40, -0)
- `packages/kilo-vscode/src/path-utils.ts` (+28, -0)
- `packages/kilo-vscode/src/services/autocomplete/i18n/en.ts` (+2, -2)
- `packages/kilo-vscode/src/services/marketplace/types.ts` (+5, -0)
- `packages/kilo-vscode/tests/model-selector-accessibility.spec.ts` (+47, -0)
- `packages/kilo-vscode/tests/permission-dock-dropdown.spec.ts` (+15, -0)
- `packages/kilo-vscode/tests/unit/agent-requirements.test.ts` (+201, -0)
- `packages/kilo-vscode/tests/unit/marketplace-installer.test.ts` (+44, -0)
- `packages/kilo-vscode/tests/unit/path-utils.test.ts` (+45, -1)
- `packages/kilo-vscode/tests/unit/permission-description.test.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/prompt-drafts.test.ts` (+5, -1)
- `packages/kilo-vscode/tests/unit/prompt-input-connection-guard.test.ts` (+29, -7)
- `packages/kilo-vscode/tests/unit/prompt-input-utils.test.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+10, -7)
- `packages/kilo-vscode/webview-ui/agent-manager/WorktreeItem.tsx` (+48, -6)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/App.tsx` (+38, -5)
- `packages/kilo-vscode/webview-ui/src/components/chat/AgentRequirements.tsx` (+193, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/ChatView.tsx` (+25, -12)
- `packages/kilo-vscode/webview-ui/src/components/chat/PermissionDock.tsx` (+19, -3)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+91, -57)
- `packages/kilo-vscode/webview-ui/src/components/chat/prompt-input-utils.ts` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModeSwitcher.tsx` (+23, -4)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelSelector.tsx` (+205, -207)
- `packages/kilo-vscode/webview-ui/src/components/shared/PopupSelector.tsx` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/components/shared/ThinkingSelector.tsx` (+4, -2)
- `packages/kilo-vscode/webview-ui/src/context/agent-requirements-state.ts` (+10, -0)
- `packages/kilo-vscode/webview-ui/src/context/agent-requirements.tsx` (+104, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+74, -5)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+75, -5)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+75, -5)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+75, -5)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+79, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+24, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+76, -5)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+75, -5)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+76, -5)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+75, -5)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+78, -6)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+76, -5)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+76, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+75, -5)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+75, -5)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+74, -5)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+75, -5)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+75, -5)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+73, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+73, -4)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+47, -24)
- `packages/kilo-vscode/webview-ui/src/stories/chat.stories.tsx` (+136, -1)
- `packages/kilo-vscode/webview-ui/src/stories/composite.stories.tsx` (+3, -3)
- `packages/kilo-vscode/webview-ui/src/stories/section-header.stories.tsx` (+81, -6)
- `packages/kilo-vscode/webview-ui/src/stories/shared.stories.tsx` (+25, -0)
- `packages/kilo-vscode/webview-ui/src/styles/agent-requirements.css` (+298, -0)
- `packages/kilo-vscode/webview-ui/src/styles/chat.css` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/styles/model-selector.css` (+6, -1)
- `packages/kilo-vscode/webview-ui/src/styles/permission-dock.css` (+23, -0)
- `packages/kilo-vscode/webview-ui/src/styles/prompt-input.css` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/types/marketplace.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/agents.ts` (+46, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/config.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+19, -1)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/src/utils/prompt-drafts.ts` (+6, -3)
- `packages/opencode/src/cli/cmd/tui/component/prompt/index.tsx` (+24, -0)
- `packages/opencode/src/cli/cmd/tui/thread.ts` (+2, -2)
- `packages/opencode/src/config/agent.ts` (+3, -0)
- `packages/opencode/src/config/config.ts` (+3, -0)
- `packages/opencode/src/kilocode/agent-requirements.ts` (+305, -0)
- `packages/opencode/src/kilocode/cli/agent-requirements.ts` (+116, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/thread.ts` (+2, -2)
- `packages/opencode/src/kilocode/cloud-session.ts` (+4, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/kilocode.ts` (+17, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilocode.ts` (+7, -0)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/session.ts` (+5, -1)
- `packages/opencode/src/session/prompt.ts` (+24, -14)
- `packages/opencode/src/session/session.ts` (+4, -1)
- `packages/opencode/test/kilocode/agent-requirements-cli.test.ts` (+176, -0)
- `packages/opencode/test/kilocode/agent-requirements.test.ts` (+307, -0)
- `packages/opencode/test/kilocode/cli/tui/thread.test.ts` (+55, -1)
- `packages/opencode/test/kilocode/server/httpapi-exercise-scenarios.ts` (+13, -0)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+38, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+105, -0)
- `packages/sdk/openapi.json` (+361, -0)
- `packages/ui/src/context/data.tsx` (+4, -0)
- `script/check-forbidden-strings.ts` (+1, -0)
- `README.ar.md => translations/README.ar.md` (+3, -3)
- `README.bn.md => translations/README.bn.md` (+3, -3)
- `README.br.md => translations/README.br.md` (+3, -3)
- `README.bs.md => translations/README.bs.md` (+3, -3)
- `README.da.md => translations/README.da.md` (+3, -3)
- `README.de.md => translations/README.de.md` (+3, -3)
- `README.es.md => translations/README.es.md` (+3, -3)
- `README.fr.md => translations/README.fr.md` (+3, -3)
- `README.gr.md => translations/README.gr.md` (+3, -3)
- `README.it.md => translations/README.it.md` (+3, -3)
- `README.ja.md => translations/README.ja.md` (+3, -3)
- `README.ko.md => translations/README.ko.md` (+3, -3)
- `README.no.md => translations/README.no.md` (+3, -3)
- `README.pl.md => translations/README.pl.md` (+3, -3)
- `README.ru.md => translations/README.ru.md` (+3, -3)
- `README.th.md => translations/README.th.md` (+3, -3)
- `README.tr.md => translations/README.tr.md` (+3, -3)
- `README.uk.md => translations/README.uk.md` (+3, -3)
- `README.vi.md => translations/README.vi.md` (+3, -3)
- `README.zh.md => translations/README.zh.md` (+3, -3)
- `README.zht.md => translations/README.zht.md` (+3, -3)

### Key Diffs

#### packages/core/test/project.test.ts
```diff
diff --git a/packages/core/test/project.test.ts b/packages/core/test/project.test.ts
index 9980f65e5..db408f522 100644
--- a/packages/core/test/project.test.ts
+++ b/packages/core/test/project.test.ts
@@ -119,14 +119,14 @@ describe("ProjectV2.resolve", () => {
         Effect.promise(() => tmpdir()),
         (tmp) => Effect.promise(() => tmp[Symbol.asyncDispose]()),
       )
-      yield* Effect.promise(() => initRepo(ssh.path, { commit: true, remote: "git@github.com:owner/repo.git" }))
-      yield* Effect.promise(() => initRepo(https.path, { commit: true, remote: "https://github.com/owner/repo.git" }))
+      yield* Effect.promise(() => initRepo(ssh.path, { commit: true, remote: "git@example.com:owner/repo.git" }))
+      yield* Effect.promise(() => initRepo(https.path, { commit: true, remote: "https://example.com/owner/repo.git" }))
       const project = yield* Project.Service
 
       const a = yield* project.resolve(abs(ssh.path))
       const b = yield* project.resolve(abs(https.path))
 
-      expect(a.id).toBe(remoteID("github.com/owner/repo"))
+      expect(a.id).toBe(remoteID("example.com/owner/repo"))
       expect(b.id).toBe(a.id)
     }),
   )
```

#### packages/opencode/src/agent/agent.ts
```diff
diff --git a/packages/opencode/src/agent/agent.ts b/packages/opencode/src/agent/agent.ts
index 261f5ca83..d7b1dd7e3 100644
--- a/packages/opencode/src/agent/agent.ts
+++ b/packages/opencode/src/agent/agent.ts
@@ -27,6 +27,10 @@ import * as KiloAgent from "@/kilocode/agent" // kilocode_change
 import { RuntimeFlags } from "@/effect/runtime-flags"
 import { Reference } from "@/reference/reference" // kilocode_change
 import { ConfigReference } from "@/config/reference" // kilocode_change
+import * as AgentRequirements from "@/kilocode/agent-requirements" // kilocode_change
+import { MCP } from "@/mcp" // kilocode_change
+
+export type RequirementBlockedError = InstanceType<typeof AgentRequirements.BlockedError> // kilocode_change
 
 export const Info = Schema.Struct({
   name: Schema.String,
@@ -49,6 +53,7 @@ export const Info = Schema.Struct({
   variant: Schema.optional(Schema.String),
   prompt: Schema.optional(Schema.String),
   options: Schema.Record(Schema.String, Schema.Unknown),
+  requirements: Schema.optional(AgentRequirements.Requirements), // kilocode_change
   steps: Schema.optional(Schema.Finite),
 }).annotate({ identifier: "Agent" })
 export type Info = DeepMutable<Schema.Schema.Type<typeof Info>>
@@ -64,6 +69,8 @@ export interface Interface {
   readonly list: () => Effect.Effect<Info[]>
   readonly defaultInfo: () => Effect.Effect<Info>
   readonly defaultAgent: () => Effect.Effect<string>
+  readonly requirementStatus: (agent: string) => Effect.Effect<AgentRequirements.Result> // kilocode_change
+  readonly guardRequirements: (agent: Info) => Effect.Effect<void, RequirementBlockedError> // kilocode_change
   readonly generate: (input: {
     description: string
     model?: { providerID: ProviderID; modelID: ModelID }
@@ -77,7 +84,7 @@ export interface Interface {
   >
 }
 
-type State = Omit<Interface, "generate"> & { version: string } // kilocode_change
+type State = Omit<Interface, "generate" | "requirementStatus" | "guardRequirements"> & { version: string } // kilocode_change
 
 export class Service extends Context.Service<Service, Interface>()("@opencode/Agent") {}
 
@@ -90,6 +97,7 @@ export const layer = Layer.effect(
     const auth = yield* Auth.Service
     const plugin = yield* Plugin.Service
     const skill = yield* Skill.Service
+    const mcp = yield* MCP.Service // kilocode_change
     const provider = yield* Provider.Service
     const flags = yield* RuntimeFlags.Service
 
@@ -326,6 +334,7 @@ export const layer = Layer.effect(
```

#### packages/opencode/test/agent/agent.test.ts
```diff
diff --git a/packages/opencode/test/agent/agent.test.ts b/packages/opencode/test/agent/agent.test.ts
index 8253471ef..6ffedd7e0 100644
--- a/packages/opencode/test/agent/agent.test.ts
+++ b/packages/opencode/test/agent/agent.test.ts
@@ -13,6 +13,7 @@ import { Plugin } from "../../src/plugin"
 import { Provider } from "../../src/provider/provider"
 import { Skill } from "../../src/skill"
 import { Truncate } from "../../src/tool/truncate"
+import { MCP } from "../../src/mcp" // kilocode_change
 
 const agentLayer = (flags: Partial<RuntimeFlags.Info> = {}) =>
   Agent.layer.pipe(
@@ -21,6 +22,7 @@ const agentLayer = (flags: Partial<RuntimeFlags.Info> = {}) =>
     Layer.provide(Auth.defaultLayer),
     Layer.provide(Config.defaultLayer),
     Layer.provide(Skill.defaultLayer),
+    Layer.provide(Layer.mock(MCP.Service)({})), // kilocode_change
     Layer.provide(RuntimeFlags.layer(flags)),
   )
 
```

#### packages/opencode/test/agent/plugin-agent-regression.test.ts
```diff
diff --git a/packages/opencode/test/agent/plugin-agent-regression.test.ts b/packages/opencode/test/agent/plugin-agent-regression.test.ts
index 5871b9dc2..ad32c52fd 100644
--- a/packages/opencode/test/agent/plugin-agent-regression.test.ts
+++ b/packages/opencode/test/agent/plugin-agent-regression.test.ts
@@ -10,6 +10,7 @@ import { Config } from "../../src/config/config"
 import { Env } from "../../src/env"
 import { Git } from "../../src/git" // kilocode_change
 import { RuntimeFlags } from "../../src/effect/runtime-flags"
+import { MCP } from "../../src/mcp" // kilocode_change
 import { Plugin } from "../../src/plugin"
 import { AccountTest } from "../fake/account"
 import { AuthTest } from "../fake/auth"
@@ -43,6 +44,7 @@ const dependencies = Layer.mergeAll(configLayer, pluginLayer).pipe(Layer.provide
 const agentLayer = Agent.layer.pipe(
   Layer.provide(AuthTest.empty),
   Layer.provide(SkillTest.empty),
+  Layer.provide(Layer.mock(MCP.Service)({})), // kilocode_change
   Layer.provide(provider.layer),
   Layer.provide(RuntimeFlags.layer({ disableDefaultPlugins: true })),
 )
```


## opencode Changes (dfeb1b5..c363775)

### Commits

- c363775 - chore: generate (opencode-agent[bot], 2026-06-29)
- 48fc9e3 - feat(llm): add response reducer (#34417) (Shoubhit Dash, 2026-06-29)
- 82a482b - chore: generate (opencode-agent[bot], 2026-06-29)
- 7fac843 - feat(app): align slash popover to v2 tokens (#34286) (Aarav Sareen, 2026-06-29)
- 0a5e617 - feat(app): update message part ui to v2 (#34394) (Aarav Sareen, 2026-06-29)
- b5f92c9 - docs: fix Kimi K2.7 Go model ID (#34413) (Jack, 2026-06-29)
- 2070fd9 - feat(app): improve projects sidebar reactivity (#34391) (Aarav Sareen, 2026-06-29)
- 48dc05e - chore: generate (opencode-agent[bot], 2026-06-29)
- 84bb706 - feat(app): new timeline header (#34192) (Aarav Sareen, 2026-06-29)
- be8cfa7 - chore: generate (opencode-agent[bot], 2026-06-29)
- 56a789d - feat(app): show loader on session hover (#34224) (Aarav Sareen, 2026-06-29)
- 5409151 - feat(app): sticky session list header (#34220) (Aarav Sareen, 2026-06-29)
- f90d154 - zen: budget (Frank, 2026-06-29)
- 078385d - zen: budget (Frank, 2026-06-29)
- beaaa17 - fix(app): disable empty server chevron (#34292) (Filip, 2026-06-29)
- fb59606 - test(core): fix layer node replacement type expectation (#34386) (opencode-agent[bot], 2026-06-29)
- 846d548 - chore: generate (opencode-agent[bot], 2026-06-29)
- 84336e4 - refactor(core): refine layer node replacements (#34377) (James Long, 2026-06-28)
- 01a5c69 - feat(tui): integrate ServerAuth headers into transport configuration for external served TUI thread (#29876) (OpeOginni, 2026-06-28)
- d78f91a - chore: generate (opencode-agent[bot], 2026-06-28)
- 3376229 - fix(app): wrap model.set in startTransition (#34351) (Brendan Allan, 2026-06-29)
- 5d6aa3b - chore: generate (opencode-agent[bot], 2026-06-28)
- 683aca5 - feat(desktop): Display stored totals for Tokens and Cost in Desktop Session Context (#28887) (OpeOginni, 2026-06-28)
- 92025e9 - fix(mcp): clarify debug oauth probe (#34350) (Aiden Cline, 2026-06-28)
- 411e053 - fix(mcp): reconnect after OAuth even when server is disabled (Max Anderson, 2026-06-28)
- b862d17 - zen: update alert role (Frank, 2026-06-28)
- bda0ddc - zen: new inference (Frank, 2026-06-28)
- 58ba99e - fix(desktop): avoid destroyed window permission checks (#34300) (Brendan Allan, 2026-06-28)
- 6ee817d - fix(app): disable `add project` when given server is offline (#34294) (Filip, 2026-06-28)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/test/tool/registry.test.ts` (+5, -15)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/console/core/src/model.ts` (+1, -1)
- `packages/core/src/effect/app-node-builder.ts` (+11, -12)
- `packages/core/src/effect/dfdf` (+1, -0)
- `packages/core/src/effect/layer-node.ts` (+73, -56)
- `packages/core/src/location-services.ts` (+6, -7)
- `packages/core/src/tool-output-store.ts` (+2, -0)
- `packages/core/test/application-tools.test.ts` (+7, -11)
- `packages/core/test/catalog.test.ts` (+14, -18)
- `packages/core/test/config/agent.test.ts` (+4, -2)
- `packages/core/test/config/command.test.ts` (+4, -2)
- `packages/core/test/config/config.test.ts` (+15, -12)
- `packages/core/test/credential.test.ts` (+2, -1)
- `packages/core/test/effect/layer-node/layer-node-types.test.ts` (+12, -5)
- `packages/core/test/effect/layer-node/layer-node.test.ts` (+35, -11)
- `packages/core/test/effect/layer-node/node-build.test.ts` (+25, -23)
- `packages/core/test/filesystem/filesystem.test.ts` (+4, -3)
- `packages/core/test/location-filesystem.test.ts` (+5, -14)
- `packages/core/test/location-mutation.test.ts` (+5, -14)
- `packages/core/test/models.test.ts` (+7, -6)
- `packages/core/test/plugin/models-dev.test.ts` (+6, -11)
- `packages/core/test/plugin/variant.test.ts` (+3, -15)
- `packages/core/test/project-copy.test.ts` (+4, -10)
- `packages/core/test/reference.test.ts` (+6, -21)
- `packages/core/test/repository-cache.test.ts` (+5, -12)
- `packages/core/test/session-projector.test.ts` (+1, -8)
- `packages/core/test/session-tool-progress.test.ts` (+3, -2)
- `packages/core/test/skill-discovery.test.ts` (+8, -7)
- `packages/core/test/skill.test.ts` (+1, -3)
- `packages/core/test/system-context/builtins.test.ts` (+8, -10)
- `packages/core/test/tool-output-store.test.ts` (+13, -11)
- `packages/core/test/tool-question.test.ts` (+6, -1)
- `packages/core/test/tool-read-filesystem.test.ts` (+4, -3)
- `packages/core/test/tool-skill.test.ts` (+7, -2)
- `packages/core/test/util/effect-flock.test.ts` (+4, -3)

#### Other Changes
- `packages/app/src/components/prompt-input.tsx` (+7, -3)
- `packages/app/src/components/prompt-input/slash-popover.tsx` (+164, -45)
- `packages/app/src/components/session-context-usage.tsx` (+38, -14)
- `packages/app/src/components/session/session-context-metrics.test.ts` (+31, -24)
- `packages/app/src/components/session/session-context-metrics.ts` (+17, -31)
- `packages/app/src/components/session/session-context-tab.tsx` (+9, -9)
- `packages/app/src/context/local.tsx` (+31, -27)
- `packages/app/src/context/tabs.tsx` (+8, -6)
- `packages/app/src/index.css` (+101, -0)
- `packages/app/src/pages/home.tsx` (+240, -90)
- `packages/app/src/pages/layout/session-tab-avatar.tsx` (+16, -20)
- `packages/app/src/pages/session/composer/session-composer-region.tsx` (+1, -1)
- `packages/app/src/pages/session/timeline/message-timeline.tsx` (+339, -109)
- `packages/console/app/src/routes/honeycomb/webhook.ts` (+1, -1)
- `packages/console/app/src/routes/zen/util/handler.ts` (+33, -18)
- `packages/console/app/src/routes/zen/util/modelTpsLimiter.ts` (+1, -1)
- `packages/console/app/src/routes/zen/util/providerBudgetTracker.ts` (+119, -21)
- `packages/desktop/src/main/windows.ts` (+4, -2)
- `packages/llm/src/route/client.ts` (+6, -11)
- `packages/llm/src/schema/events.ts` (+247, -1)
- `packages/llm/test/adapter.test.ts` (+1, -0)
- `packages/llm/test/fixtures/recordings/gemini-cache/reports-cachedcontenttokencount-on-identical-second-call.json` (+2, -2)
- `packages/llm/test/provider/openai-chat.test.ts` (+11, -8)
- `packages/llm/test/response.test.ts` (+60, -0)
- `packages/opencode/src/cli/cmd/mcp.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/tui.ts` (+8, -8)
- `packages/opencode/src/cli/network.ts` (+20, -4)
- `packages/opencode/src/mcp/index.ts` (+1, -1)
- `packages/opencode/test/session/processor-effect.test.ts` (+6, -16)
- `packages/opencode/test/session/snapshot-tool-race.test.ts` (+5, -10)
- `packages/opencode/test/share/share-next.test.ts` (+5, -8)
- `packages/server/src/routes.ts` (+1, -3)
- `packages/session-ui/src/components/message-part.tsx` (+90, -44)
- `packages/ui/src/v2/components/button-v2.css` (+20, -0)
- `packages/ui/src/v2/components/button-v2.tsx` (+1, -1)
- `packages/ui/src/v2/components/dialog-v2.css` (+3, -0)
- `packages/ui/src/v2/components/dialog-v2.tsx` (+2, -0)
- `packages/ui/src/v2/components/icon.tsx` (+8, -0)
- `packages/ui/src/v2/components/progress-circle-v2.css` (+13, -0)
- `packages/ui/src/v2/components/progress-circle-v2.tsx` (+52, -0)
- `packages/web/src/content/docs/ar/go.mdx` (+2, -2)
- `packages/web/src/content/docs/bs/go.mdx` (+2, -2)
- `packages/web/src/content/docs/da/go.mdx` (+2, -2)
- `packages/web/src/content/docs/de/go.mdx` (+2, -2)
- `packages/web/src/content/docs/es/go.mdx` (+2, -2)
- `packages/web/src/content/docs/fr/go.mdx` (+2, -2)
- `packages/web/src/content/docs/go.mdx` (+2, -2)
- `packages/web/src/content/docs/it/go.mdx` (+2, -2)
- `packages/web/src/content/docs/ja/go.mdx` (+2, -2)
- `packages/web/src/content/docs/ko/go.mdx` (+2, -2)
- `packages/web/src/content/docs/nb/go.mdx` (+2, -2)
- `packages/web/src/content/docs/pl/go.mdx` (+2, -2)
- `packages/web/src/content/docs/pt-br/go.mdx` (+2, -2)
- `packages/web/src/content/docs/ru/go.mdx` (+2, -2)
- `packages/web/src/content/docs/th/go.mdx` (+2, -2)
- `packages/web/src/content/docs/tr/go.mdx` (+2, -2)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+2, -2)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+2, -2)

### Key Diffs

#### packages/console/core/src/model.ts
```diff
diff --git a/packages/console/core/src/model.ts b/packages/console/core/src/model.ts
index bb0260d..84de249 100644
--- a/packages/console/core/src/model.ts
+++ b/packages/console/core/src/model.ts
@@ -37,7 +37,7 @@ export namespace ZenData {
         priority: z.number().optional(),
         tpmLimit: z.number().optional(),
         tpsGoal: z.number().optional(),
-        budgetMode: z.enum(["always", "fill"]).optional(),
+        budgetPriority: z.number().optional(),
         budgetContribution: z.number().optional(),
         weight: z.number().optional(),
         disabled: z.boolean().optional(),
```

#### packages/core/src/effect/app-node-builder.ts
```diff
diff --git a/packages/core/src/effect/app-node-builder.ts b/packages/core/src/effect/app-node-builder.ts
index a9d51b7..5f01469 100644
--- a/packages/core/src/effect/app-node-builder.ts
+++ b/packages/core/src/effect/app-node-builder.ts
@@ -1,24 +1,23 @@
-import { Layer } from "effect"
 import { buildLocationServiceMap } from "../location-services"
 import { LocationServiceMap } from "../location-service-map"
 import { LayerNode } from "./layer-node"
 import { makeGlobalNode } from "./app-node"
 
-export function build<A, E>(root: LayerNode.Node<A, E, any>, replacements?: readonly LayerNode.Replacement[]) {
-  const replacementMap = new Map(replacements?.map((item) => [item.source, item.replacement]))
+export function build<A, E>(root: LayerNode.Node<A, E, any>, replacements: LayerNode.Replacements = []) {
+  let allReplacements = replacements
 
-  if (!LayerNode.hasUnbound(root, LocationServiceMap.node)) {
-    // If the location service map is not needed, we shouldn't pull it
-    // in. Compile the graph normally
-    return LayerNode.compile(root, replacementMap)
+  // Only build the location service map if it's actually needed
+  if (LayerNode.hasUnbound(root, LocationServiceMap.node) && !hasReplacement(replacements, LocationServiceMap.node)) {
+    const locationMap = buildLocationServiceMap(replacements)
+    const locationMapNode = makeGlobalNode({ service: LocationServiceMap.Service, layer: locationMap, deps: [] })
+    allReplacements = replacements.concat([[LocationServiceMap.node, locationMapNode]])
   }
 
-  const locationMap = buildLocationServiceMap(replacementMap)
-  const locationMapNode = makeGlobalNode({ service: LocationServiceMap.Service, layer: locationMap, deps: [] })
-
-  const app = LayerNode.bind(root, LocationServiceMap.node, locationMapNode)
+  return LayerNode.compile(root, allReplacements)
+}
 
-  return LayerNode.compile(app, replacementMap)
+function hasReplacement(replacements: LayerNode.Replacements, node: LayerNode.Node<unknown, unknown, any>) {
+  return replacements.some(([source]) => source.name === node.name)
 }
 
 export * as AppNodeBuilder from "./app-node-builder"
```

#### packages/core/src/effect/dfdf
```diff
diff --git a/packages/core/src/effect/dfdf b/packages/core/src/effect/dfdf
new file mode 100644
index 0000000..77f2d57
--- /dev/null
+++ b/packages/core/src/effect/dfdf
@@ -0,0 +1 @@
+File to save in: ~/.local/share/opencode/worktree/012780/location-layer-tiers/packages/core/src/effect/
\ No newline at end of file
```

#### packages/core/src/effect/layer-node.ts
```diff
diff --git a/packages/core/src/effect/layer-node.ts b/packages/core/src/effect/layer-node.ts
index 065790f..e8b8748 100644
--- a/packages/core/src/effect/layer-node.ts
+++ b/packages/core/src/effect/layer-node.ts
@@ -111,20 +111,52 @@ export function group<const Items extends readonly AnyNode[]>(
   return { kind: "group", name: "group", dependencies }
 }
 
-export type Replacement = {
-  readonly source: Layer.Any
-  readonly replacement: Layer.Any
-}
+export type Replacement = readonly [source: AnyNode, replacement: AnyNode | Layer.Any]
+export type Replacements = readonly Replacement[]
 
 type CheckReplacementErrors<SourceError, ReplacementError> = [Exclude<ReplacementError, SourceError>] extends [never]
   ? unknown
   : { readonly "New replacement errors": Exclude<ReplacementError, SourceError> }
 
-export function replace<A, E, R, E2>(
-  source: Layer.Layer<A, E, R>,
-  replacement: Layer.Layer<NoInfer<A>, E2, never> & CheckReplacementErrors<E, NoInfer<E2>>,
-): Replacement {
-  return { source, replacement }
+type CheckReplacement<Item> = Item extends readonly [Node<infer A, infer E, infer T>, infer Replacement]
+  ? Replacement extends Node<NoInfer<A>, infer E2, T>
+    ? CheckReplacementErrors<E, NoInfer<E2>>
+    : Replacement extends Layer.Layer<NoInfer<A>, infer E2, never>
+      ? CheckReplacementErrors<E, NoInfer<E2>>
+      : { readonly "Invalid replacement": Replacement }
+  : { readonly "Invalid replacement": Item }
+
+type CheckReplacements<Items extends Replacements> = {
+  readonly [K in keyof Items]: CheckReplacement<Items[K]>
+}
+
+type ValidReplacements<Items extends Replacements> = Items & CheckReplacements<Items>
+
+function replacementNode(source: AnyNode, replacement: AnyNode | Layer.Any) {
+  const replacementNode = isNode(replacement)
+    ? replacement
+    : make({
+        ...nodeMakeIdentity(source),
+        layer: replacement as Layer.Layer<unknown, unknown>,
+        deps: [],
+        tag: source.tag,
+      })
+  if (source.name !== replacementNode.name) {
+    throw new Error(`Cannot replace ${source.name} with ${replacementNode.name}`)
+  }
```

#### packages/core/src/location-services.ts
```diff
diff --git a/packages/core/src/location-services.ts b/packages/core/src/location-services.ts
index 07669c0..7a4678a 100644
--- a/packages/core/src/location-services.ts
+++ b/packages/core/src/location-services.ts
@@ -82,17 +82,16 @@ export type LocationServices = LayerNode.Output<typeof locationServices>
 export type LocationError = LayerNode.Error<typeof locationServices>
 
 export function buildLocationServiceMap(
-  replacements?: ReadonlyMap<Layer.Any, Layer.Any>,
+  replacements: LayerNode.Replacements = [],
 ): Layer.Layer<LocationServiceMap.Service> {
   return Layer.effect(
     LocationServiceMap.Service,
     LayerMap.make(
       (ref: Location.Ref) => {
-        const location = LayerNode.hoist(
-          LayerNode.bind(locationServices, Location.node, Location.boundNode(ref)),
-          Node.tags.values.global,
-        )
-        return LayerNode.compile(location.node, replacements).pipe(
+        const allReplacements = replacements.concat([[Location.node, Location.boundNode(ref)]])
+        const location = LayerNode.hoist(locationServices, Node.tags.values.global, allReplacements)
+
+        return LayerNode.compile(location.node).pipe(
           Layer.fresh,
           Layer.tap(() =>
             Effect.logInfo("booting location services", {
@@ -100,7 +99,7 @@ export function buildLocationServiceMap(
               workspaceID: ref.workspaceID,
             }),
           ),
-          Layer.provide(LayerNode.compile(location.hoisted, replacements)),
+          Layer.provide(LayerNode.compile(location.hoisted)),
         )
       },
       { idleTimeToLive: "60 minutes" },
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/agent.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/test/agent/agent.test.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/test/agent/plugin-agent-regression.test.ts
- `src/core/` - review core changes from packages/core/test/project.test.ts
- `src/tool/registry.test.ts` - update based on opencode packages/opencode/test/tool/registry.test.ts changes
