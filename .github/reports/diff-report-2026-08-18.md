# Upstream Changes Report
Generated: 2026-08-18 06:42:43

## Summary
- kilocode: 52 commits, 106 files changed
- opencode: 9 commits, 35 files changed

## kilocode Changes (4239f9d98..91a337e31)

### Commits

- 91a337e31 - Merge pull request #13177 from Kilo-Org/working-handball (Marius, 2026-08-17)
- 06088ea4b - Merge pull request #13176 from Kilo-Org/fix-message-queuing-visibility (Marius, 2026-08-17)
- 3387172a5 - fix(vscode): show provider hints in model selector (marius-kilocode, 2026-08-17)
- 1e66d27e1 - Merge pull request #13158 from Kilo-Org/profile-vscode-extension-context-loading-latency (Marius, 2026-08-17)
- a7ccd2091 - Merge pull request #13174 from Kilo-Org/fix-variant-caching-default-reasoning (Marius, 2026-08-17)
- f1909f9c4 - fix(vscode): keep queued messages visible (marius-kilocode, 2026-08-17)
- 60aee1118 - fix(vscode): preserve cached reasoning variants (marius-kilocode, 2026-08-17)
- 2b6c8b6f5 - Merge pull request #13142 from hdcodedev/fix/resolve-prompt-agent-draft-pending-fallback (Marius, 2026-08-17)
- 2eb630053 - fix(cli): switch to the code model after planning (#13112) (Johnny Eric Amancio, 2026-08-17)
- 7513c2752 - Merge pull request #13167 from Kilo-Org/fix-agent-manager-diff-viewer-icon (Marius, 2026-08-17)
- a0dc2458b - Merge pull request #13168 from Kilo-Org/fix-text-streaming-regression (Marius, 2026-08-17)
- 3a426dd6a - Merge pull request #13165 from Kilo-Org/research-kilo-openai-1m-context-support (Marius, 2026-08-17)
- ba2e20a87 - fix(vscode): restore text streaming (marius-kilocode, 2026-08-17)
- bc395d6b4 - fix(agent-manager): restore live diff statistics (marius-kilocode, 2026-08-17)
- 5e6e93aa1 - fix(cli): use full GPT-5.6 OAuth context (marius-kilocode, 2026-08-17)
- 2ae7d7327 - Merge pull request #13164 from Kilo-Org/make-ts-default-with-toggle (Marius, 2026-08-17)
- 181363e1d - feat(vscode): show token throughput by default (marius-kilocode, 2026-08-17)
- 9d27403ee - Merge pull request #13159 from Kilo-Org/docs/code-reviews-remove-max-review-time (Christiaan Arnoldus, 2026-08-17)
- a40d37c45 - Merge pull request #13162 from Kilo-Org/extreme-wallet (Marius, 2026-08-17)
- 6967211f3 - test(vscode): update speech to text fallback (marius-kilocode, 2026-08-17)
- b752a07ed - Merge branch 'main' into docs/code-reviews-remove-max-review-time (Christiaan Arnoldus, 2026-08-17)
- 8ad3f9088 - fix(vscode): default speech to text to parakeet (marius-kilocode, 2026-08-17)
- f5f7963da - Merge pull request #13161 from Kilo-Org/wooden-donut (Marius, 2026-08-17)
- 73f7a4446 - Merge pull request #13160 from Kilo-Org/fix-kilo-session-indicator-scroll-bug (Marius, 2026-08-17)
- 1bc14d9b4 - fix(docs): scope marketplace link exclusions (marius-kilocode, 2026-08-17)
- 2acdb46ee - fix(ui): preserve native scroll pauses (marius-kilocode, 2026-08-17)
- d4fd7934d - fix(docs): exclude flaky VS Code marketplace pages (marius-kilocode, 2026-08-17)
- 2f390b2b6 - fix(docs): exclude flaky Requesty marketplace link (marius-kilocode, 2026-08-17)
- cba6ebc6f - fix(ui): preserve streaming chat scroll position (marius-kilocode, 2026-08-17)
- 2a108317e - docs(kilo-docs): remove maximum review time setting from Code Reviews (chrarnoldus, 2026-08-17)
- 4eeafab4e - Merge pull request #13154 from Kilo-Org/optimize-large-session-loading-performance (Marius, 2026-08-17)
- af69285e8 - Merge pull request #12977 from Kilo-Org/implement-multi-project-skeleton-loading (Marius, 2026-08-17)
- 44943e561 - Merge pull request #13156 from Kilo-Org/optimize-agent-manager-tab-latency (Marius, 2026-08-17)
- 4e20a5e5d - Merge pull request #13155 from Kilo-Org/optimize-agent-manager-top-bar-performance (Marius, 2026-08-17)
- 872e01950 - Merge pull request #13010 from Kilo-Org/efficacious-region (Marius, 2026-08-17)
- c8b21d1f0 - fix(vscode): bound file mention directory cache (marius-kilocode, 2026-08-17)
- 4a8d1e70d - Merge branch 'main' into implement-multi-project-skeleton-loading (Marius, 2026-08-17)
- d709d41eb - Merge branch 'main' into efficacious-region (Marius, 2026-08-17)
- c4dcb3d22 - fix(vscode): keep file mentions fresh (marius-kilocode, 2026-08-17)
- f9df66c9c - perf(vscode): optimize top bar and timeline calculation performance (marius-kilocode, 2026-08-17)
- be8b85c8c - perf(agent-manager): optimize tab switching and context transition latency (marius-kilocode, 2026-08-17)
- 5b06d7dea - perf(vscode): optimize large session load times and eliminate reactive cascades (marius-kilocode, 2026-08-17)
- 383aa7873 - Merge branch 'main' into profile-vscode-extension-context-loading-latency (marius-kilocode, 2026-08-17)
- 6f19a6e92 - wip: prewarm file search (marius-kilocode, 2026-08-17)
- f8dce5b45 - fix(vscode): apply the selected agent instead of the stale session agent (hdcode.dev, 2026-08-15)
- e6b243993 - fix(vscode): include chart and semantic search in built-in tools list (marius-kilocode, 2026-08-07)
- 3f875a3ca - fix(vscode): avoid direct message-part import in tool-default-open to preserve unit test isolation (marius-kilocode, 2026-08-07)
- 7ee97a4c2 - fix(i18n): fix punctuation in korean mcp tool display description (marius-kilocode, 2026-08-07)
- b5bf1d996 - feat(vscode): support mcp tool display setting in display preferences (marius-kilocode, 2026-08-07)
- 43310eeba - fix(agent-manager): polish loading toggle state (marius-kilocode, 2026-08-07)
- 1b12573c3 - fix(agent-manager): guard project loading races (marius-kilocode, 2026-08-07)
- b9a48bff9 - fix(agent-manager): hydrate background project loading (marius-kilocode, 2026-08-07)

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
- `packages/core/src/v1/config/config.ts` (+4, -0)

#### Other Changes
- `.changeset/agent-manager-project-skeleton-loading.md` (+5, -0)
- `.changeset/dynamic-speech-to-text-models.md` (+5, -0)
- `.changeset/fix-streaming-scroll-follow.md` (+5, -0)
- `.changeset/fix-text-streaming.md` (+5, -0)
- `.changeset/fresh-file-mentions.md` (+5, -0)
- `.changeset/gpt-56-oauth-context.md` (+5, -0)
- `.changeset/mcp-tool-display-setting.md` (+5, -0)
- `.changeset/optimize-agent-manager-tab-latency.md` (+5, -0)
- `.changeset/optimize-large-session-loading.md` (+5, -0)
- `.changeset/optimize-top-bar-performance.md` (+5, -0)
- `.changeset/plan-to-code-model-switch.md` (+5, -0)
- `.changeset/quiet-variants-cache.md` (+5, -0)
- `.changeset/restore-agent-manager-diff-stats.md` (+5, -0)
- `.changeset/selected-agent-over-stale-session.md` (+5, -0)
- `.changeset/show-model-provider-hints.md` (+5, -0)
- `.changeset/show-queued-prompts.md` (+5, -0)
- `.changeset/show-token-throughput-by-default.md` (+5, -0)
- `packages/kilo-docs/lychee.toml` (+2, -0)
- `packages/kilo-docs/pages/automate/code-reviews/github.md` (+1, -2)
- `packages/kilo-docs/pages/automate/code-reviews/gitlab.md` (+1, -2)
- `packages/kilo-docs/pages/automate/code-reviews/overview.md` (+3, -5)
- `packages/kilo-ui/src/components/message-part.tsx` (+8, -6)
- `packages/kilo-ui/src/hooks/create-auto-scroll.test.tsx` (+52, -0)
- `packages/kilo-ui/src/hooks/create-auto-scroll.tsx` (+12, -1)
- `packages/kilo-ui/src/hooks/scroll-user-activity.ts` (+1, -1)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+8, -8)
- `packages/kilo-vscode/src/agent-manager/project/hydrate.ts` (+37, -0)
- `packages/kilo-vscode/src/agent-manager/project/pollers.ts` (+36, -2)
- `packages/kilo-vscode/src/kilo-provider/file-search.ts` (+34, -21)
- `packages/kilo-vscode/src/kilo-provider/slim-metadata.ts` (+1, -0)
- `packages/kilo-vscode/src/kilo-provider/throughput-settings.ts` (+1, -1)
- `packages/kilo-vscode/src/speech-to-text/models.ts` (+5, -5)
- `packages/kilo-vscode/tests/model-selector-accessibility.spec.ts` (+3, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-tab-bar.test.ts` (+24, -0)
- `packages/kilo-vscode/tests/unit/agent-project-hydrate.test.ts` (+116, -0)
- `packages/kilo-vscode/tests/unit/agent-project-pollers.test.ts` (+75, -0)
- `packages/kilo-vscode/tests/unit/file-search.test.ts` (+74, -0)
- `packages/kilo-vscode/tests/unit/prompt-send-contract.test.ts` (+10, -0)
- `packages/kilo-vscode/tests/unit/session-agent.test.ts` (+8, -0)
- `packages/kilo-vscode/tests/unit/session-parts.test.ts` (+23, -1)
- `packages/kilo-vscode/tests/unit/session-variants.test.ts` (+13, -4)
- `packages/kilo-vscode/tests/unit/speech-to-text-catalog.test.ts` (+1, -1)
- `packages/kilo-vscode/tests/unit/speech-to-text-models-sync.test.ts` (+2, -2)
- `packages/kilo-vscode/tests/unit/throughput-settings-message.test.ts` (+45, -0)
- `packages/kilo-vscode/tests/unit/tool-default-open.test.ts` (+19, -2)
- `packages/kilo-vscode/tests/unit/use-file-mention.test.ts` (+330, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+74, -73)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectSidebarBody.tsx` (+92, -90)
- `packages/kilo-vscode/webview-ui/agent-manager/SidebarBody.tsx` (+3, -15)
- `packages/kilo-vscode/webview-ui/agent-manager/SidebarSectionHeader.tsx` (+4, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/Skeleton.tsx` (+59, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/TabBar.tsx` (+7, -12)
- `packages/kilo-vscode/webview-ui/agent-manager/UnassignedSessionsSection.tsx` (+4, -19)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+41, -21)
- `packages/kilo-vscode/webview-ui/agent-manager/selection-actions.ts` (+34, -23)
- `packages/kilo-vscode/webview-ui/src/components/chat/AssistantMessage.tsx` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+14, -19)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+17, -9)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskHeader.tsx` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskUsage.tsx` (+3, -12)
- `packages/kilo-vscode/webview-ui/src/components/chat/tool-default-open.ts` (+22, -1)
- `packages/kilo-vscode/webview-ui/src/components/settings/DisplayTab.tsx` (+29, -3)
- `packages/kilo-vscode/webview-ui/src/components/settings/settings-io.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelSelector.tsx` (+1, -4)
- `packages/kilo-vscode/webview-ui/src/context/display.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/context/session-agent.ts` (+11, -1)
- `packages/kilo-vscode/webview-ui/src/context/session-parts.ts` (+9, -0)
- `packages/kilo-vscode/webview-ui/src/context/session-queue.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/context/session-utils.ts` (+26, -2)
- `packages/kilo-vscode/webview-ui/src/context/session-variants.ts` (+4, -1)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+69, -69)
- `packages/kilo-vscode/webview-ui/src/hooks/useFileMention.ts` (+152, -12)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+6, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+6, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+6, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+6, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+6, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+6, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+6, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+6, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+6, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+6, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+6, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+6, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/types/messages/config.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/utils/timeline/colors.ts` (+3, -11)
- `packages/kilo-vscode/webview-ui/src/utils/timeline/geometry.ts` (+11, -7)
- `packages/kilo-vscode/webview-ui/src/utils/timeline/sizes.ts` (+35, -9)
- `packages/opencode/src/kilocode/plan-followup.ts` (+79, -56)
- `packages/opencode/src/plugin/openai/codex.ts` (+2, -2)
- `packages/opencode/test/kilocode/plan-followup.test.ts` (+264, -26)
- `packages/opencode/test/plugin/codex.test.ts` (+5, -3)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+1, -0)
- `packages/ui/src/components/tooltip.tsx` (+24, -20)

### Key Diffs

#### packages/core/src/v1/config/config.ts
```diff
diff --git a/packages/core/src/v1/config/config.ts b/packages/core/src/v1/config/config.ts
index 42d18611e..a56e60107 100644
--- a/packages/core/src/v1/config/config.ts
+++ b/packages/core/src/v1/config/config.ts
@@ -129,6 +129,10 @@ export const Info = Schema.Struct({
     description:
       "Controls whether code edit and diff blocks are expanded or collapsed by default in the VS Code chat UI",
   }),
+  mcp_tool_display: Schema.optional(Schema.Literals(["expanded", "collapsed"])).annotate({
+    description:
+      "Controls whether MCP and generic tool blocks are expanded or collapsed by default in the VS Code chat UI",
+  }),
   hide_prompt_training_models: Schema.optional(Schema.Boolean).annotate({
     description: "Hide Kilo Gateway models that may train on your prompts from model listings",
   }),
```


## opencode Changes (4d68d30..4e81a0b)

### Commits

- 4e81a0b - fix(console): preserve inference sessions (#43124) (Adam, 2026-08-18)
- 3232040 - fix(app): keep server details editable (#43169) (opencode-agent[bot], 2026-08-18)
- 040b856 - fix(cli): stop legacy preview publishing (Dax Raad, 2026-08-17)
- 65c3597 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-08-17)
- 57075d8 - fix(provider): update Google Vertex SDK (#43108) (opencode-agent[bot], 2026-08-17)
- e14acea - update ds flash limit (Frank, 2026-08-17)
- 7af274a - fix(core): fall back on oversized websocket requests (#43099) (Filip, 2026-08-17)
- a97fec8 - fix: codex data residency (#42432) (Filip, 2026-08-17)
- 2cba7e2 - fix(cli): update default console URL (#43043) (opencode-agent[bot], 2026-08-17)

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
- `packages/core/src/plugin/provider/opencode.ts` (+1, -1)

#### Other Changes
- `bun.lock` (+11, -19)
- `nix/hashes.json` (+4, -4)
- `packages/app/src/components/dialog-select-server.tsx` (+3, -3)
- `packages/console/app/src/routes/go/index.tsx` (+1, -1)
- `packages/console/app/src/routes/zen/util/handler.ts` (+1, -1)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/cli/cmd/account.ts` (+1, -1)
- `packages/opencode/src/plugin/openai/codex.ts` (+16, -4)
- `packages/opencode/src/plugin/openai/ws-pool.ts` (+3, -2)
- `packages/opencode/src/plugin/openai/ws.ts` (+6, -4)
- `packages/opencode/test/cli/account.test.ts` (+2, -2)
- `packages/opencode/test/plugin/codex.test.ts` (+169, -5)
- `packages/opencode/test/plugin/openai-ws.test.ts` (+26, -1)
- `packages/web/src/content/docs/ar/go.mdx` (+3, -3)
- `packages/web/src/content/docs/bs/go.mdx` (+3, -3)
- `packages/web/src/content/docs/da/go.mdx` (+3, -3)
- `packages/web/src/content/docs/de/go.mdx` (+3, -3)
- `packages/web/src/content/docs/es/go.mdx` (+3, -3)
- `packages/web/src/content/docs/fr/go.mdx` (+3, -3)
- `packages/web/src/content/docs/go.mdx` (+3, -3)
- `packages/web/src/content/docs/it/go.mdx` (+3, -3)
- `packages/web/src/content/docs/ja/go.mdx` (+3, -3)
- `packages/web/src/content/docs/ko/go.mdx` (+3, -3)
- `packages/web/src/content/docs/nb/go.mdx` (+3, -3)
- `packages/web/src/content/docs/pl/go.mdx` (+3, -3)
- `packages/web/src/content/docs/providers.mdx` (+4, -0)
- `packages/web/src/content/docs/pt-br/go.mdx` (+3, -3)
- `packages/web/src/content/docs/ru/go.mdx` (+3, -3)
- `packages/web/src/content/docs/th/go.mdx` (+3, -3)
- `packages/web/src/content/docs/tr/go.mdx` (+3, -3)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+3, -3)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+3, -3)
- `script/publish.ts` (+0, -3)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index ee24893..031fd95 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -70,7 +70,7 @@
     "@ai-sdk/deepinfra": "2.0.41",
     "@ai-sdk/gateway": "3.0.104",
     "@ai-sdk/google": "3.0.73",
-    "@ai-sdk/google-vertex": "4.0.128",
+    "@ai-sdk/google-vertex": "4.0.181",
     "@ai-sdk/groq": "3.0.31",
     "@ai-sdk/mistral": "3.0.51",
     "@ai-sdk/openai": "3.0.84",
```

#### packages/core/src/plugin/provider/opencode.ts
```diff
diff --git a/packages/core/src/plugin/provider/opencode.ts b/packages/core/src/plugin/provider/opencode.ts
index f07d72e..8e1cc1a 100644
--- a/packages/core/src/plugin/provider/opencode.ts
+++ b/packages/core/src/plugin/provider/opencode.ts
@@ -13,7 +13,7 @@ import { ConfigProviderV1 } from "../../v1/config/provider"
 import { ConfigProviderOptionsV1 } from "../../v1/config/provider-options"
 import { ConfigV1 } from "../../v1/config/config"
 
-const defaultServer = "https://console.opencode.ai"
+const defaultServer = "https://opencode.ai/console"
 const clientID = "opencode-cli"
 const methodID = Integration.MethodID.make("device")
 const RemoteResponse = Schema.Struct({ config: ConfigV1.Info })
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/src/v1/config/config.ts
