# Upstream Changes Report
Generated: 2026-06-12 10:14:59

## Summary
- kilocode: 57 commits, 172 files changed
- opencode: 27 commits, 194 files changed

## kilocode Changes (8b2a10008..0d026ef4c)

### Commits

- 0d026ef4c - Merge pull request #11104 from Kilo-Org/flicker-hockey (Marius, 2026-06-12)
- 5128211fa - Merge pull request #11144 from Kilo-Org/feat/terminal-integrated-font (Remon Oldenbeuving, 2026-06-12)
- 84a62a12c - Merge pull request #11151 from Kilo-Org/fix/vscode-binary-diffs (Marius, 2026-06-12)
- 77fe7c9e3 - fix(vscode): keep binary diffs collapsed (marius-kilocode, 2026-06-12)
- 68fd8ccce - fix(vscode): route permission replies through request directories (#11133) (Kirill Kalishev, 2026-06-12)
- a5f151468 - test(vscode): isolate terminal font defaults (marius-kilocode, 2026-06-12)
- 3cd4628a5 - fix(vscode): complete Agent Manager terminal font sync (marius-kilocode, 2026-06-12)
- 287f75aa2 - feat(vscode): use terminal.integrated font settings in Agent Manager xterm terminals (kiloconnect[bot], 2026-06-11)
- 43f783b7d - Merge pull request #11139 from Kilo-Org/catrielmuller/fix-cli-upstream-jun-11 (Catriel Müller, 2026-06-11)
- ff7537a9d - Merge pull request #10866 from Kilo-Org/fix/10841-indexing-sidebar (Catriel Müller, 2026-06-11)
- 50b249e49 - fix: improve auto close filter logic (#11119) (Johnny Eric Amancio, 2026-06-11)
- 72266359d - chore(cli): add release note for restored commands (Catriel Müller, 2026-06-11)
- 988cb02fe - fix: fix kilo cli init (Catriel Müller, 2026-06-11)
- 71cc624f5 - fix: fix test (Catriel Müller, 2026-06-11)
- 4e0c7248a - fix: fix facades (Catriel Müller, 2026-06-11)
- e41da6520 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-11)
- a4952b083 - fix: fix tests (Catriel Müller, 2026-06-11)
- d5112edf9 - fix: code indexing on kilo core (Catriel Müller, 2026-06-11)
- 35e3cd180 - fix(cli): log indexing poll failures (Catriel Müller, 2026-06-11)
- 22149292e - Merge pull request #11124 from Kilo-Org/clover-tuck (Catriel Müller, 2026-06-11)
- 286d99cc3 - Merge pull request #11126 from Kilo-Org/strong-question (Marius, 2026-06-11)
- 2e4b59399 - fix: address Bun merge validation review (Catriel Müller, 2026-06-11)
- 50dbbb30d - fix(agent-manager): avoid blocked native autofocus (marius-kilocode, 2026-06-11)
- 9c0e4f76e - Merge pull request #10997 from Kilo-Org/telling-angora (Marius, 2026-06-11)
- b64d7e009 - fix(agent-manager): preserve named worktrees on collision (#11001) (Marius, 2026-06-11)
- cdef15c6a - Merge pull request #11075 from Kilo-Org/canyon-stage (Marius, 2026-06-11)
- 8a5a64bec - Merge pull request #11074 from Kilo-Org/adjoining-quality (Marius, 2026-06-11)
- ea92eb224 - chore: remove implementation plan (Catriel Müller, 2026-06-11)
- fee5cf441 - fix: prevent Bun downgrades during upstream merges (Catriel Müller, 2026-06-11)
- f1d07ad37 - Merge pull request #11107 from Kilo-Org/docs/update-gateway-byok-providers (Christiaan Arnoldus, 2026-06-11)
- e2b4be5bf - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-06-11)
- 83973c121 - Merge branch 'main' into docs/update-gateway-byok-providers (Joshua Lambert, 2026-06-11)
- fe4a1ffd7 - Merge pull request #11118 from Kilo-Org/carnation-trilby (Marius, 2026-06-11)
- d8457d28a - Merge pull request #11117 from Kilo-Org/fix/recover-vercel-provider-upgrades (Marius, 2026-06-11)
- 143ae8e99 - fix(vscode): dismiss stale permission responses (marius-kilocode, 2026-06-11)
- b75af0de8 - fix(cli): recover Vercel AI SDK provider upgrades (marius-kilocode, 2026-06-11)
- d245b7c20 - Merge pull request #11102 from Kilo-Org/fix-cli-notification-duplication (Marius, 2026-06-11)
- 351741f91 - docs(kilo-docs): document CLI attention sounds (marius-kilocode, 2026-06-11)
- 28df9a416 - docs: retain Codestral BYOK option (chrarnoldus, 2026-06-11)
- f150b8e8b - Merge branch 'main' into docs/update-gateway-byok-providers (Christiaan Arnoldus, 2026-06-11)
- 4a953bb24 - refactor(ui): extract user activity tracking from auto-scroll into dedicated module (#11115) (Imanol Maiztegui, 2026-06-11)
- 9eac32676 - Merge pull request #11111 from Kilo-Org/chore/celebrate-pr-11111 (Marius, 2026-06-11)
- c75800818 - fix(cli): restore local console command (marius-kilocode, 2026-06-11)
- 797c3df26 - docs: order gateway BYOK providers (chrarnoldus, 2026-06-11)
- 13a3cf55c - docs: update Kilo copyright year (Marius, 2026-06-11)
- 604e6408f - chore: remove PR milestone marker (Marius, 2026-06-11)
- c64301316 - chore: celebrate PR 11111 (Marius, 2026-06-11)
- 1d6fde23f - docs: update gateway BYOK providers (chrarnoldus, 2026-06-11)
- 514af4c36 - fix(vscode): speed up subagent transcript loading (marius-kilocode, 2026-06-11)
- 8a727084a - fix(cli): consolidate TUI notifications (marius-kilocode, 2026-06-11)
- fd566bbc6 - fix(cli): detach background task references (marius-kilocode, 2026-06-10)
- 31eb7e1c0 - test(vscode): avoid TSX import in hydration unit test (marius-kilocode, 2026-06-10)
- a86f60dc4 - fix(cli): adapt fork writer to sync service (marius-kilocode, 2026-06-10)
- e17ce0c9e - perf: speed up large session forks (marius-kilocode, 2026-06-10)
- 915ecfbef - perf(agent-manager): overlap MCP startup with worktree creation (marius-kilocode, 2026-06-10)
- abf9f7986 - refactor(vscode): keep Copilot dev setting focused (marius-kilocode, 2026-06-10)
- 26f3f72ab - fix(vscode): disable Copilot in extension dev host (marius-kilocode, 2026-06-08)

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
- `packages/core/package.json` (+3, -3)

#### Other Changes
- `.changeset/calm-agents-keep-worktrees.md` (+5, -0)
- `.changeset/dismiss-stale-permissions.md` (+5, -0)
- `.changeset/fast-session-forks.md` (+7, -0)
- `.changeset/quick-subagent-transcripts.md` (+5, -0)
- `.changeset/quiet-binary-diffs.md` (+5, -0)
- `.changeset/quiet-kilo-attention.md` (+5, -0)
- `.changeset/quiet-qdrant-warnings.md` (+5, -0)
- `.changeset/restore-kilo-cli-commands.md` (+5, -0)
- `.changeset/restore-vercel-providers.md` (+6, -0)
- `.changeset/route-shared-permissions.md` (+5, -0)
- `.changeset/scoped-indexing-settings.md` (+6, -0)
- `.changeset/terminal-integrated-font.md` (+5, -0)
- `.changeset/warm-agent-manager-mcp.md` (+5, -0)
- `.github/workflows/kilo-auto-close.yml` (+39, -18)
- `LICENSE` (+1, -1)
- `bun.lock` (+46, -12)
- `nix/hashes.json` (+4, -4)
- `package.json` (+1, -1)
- `packages/kilo-console/src/client.test.ts` (+11, -1)
- `packages/kilo-console/src/client.ts` (+18, -5)
- `packages/kilo-console/src/context/ConfigProvider.tsx` (+6, -0)
- `packages/kilo-console/src/context/config.tsx` (+1, -0)
- `packages/kilo-console/src/routes/config/AgentsRoute.tsx` (+1, -2)
- `packages/kilo-console/src/routes/config/CliNotificationsRoute.tsx` (+1, -2)
- `packages/kilo-console/src/routes/config/CliUiRoute.tsx` (+1, -2)
- `packages/kilo-console/src/routes/config/ConfigPage.tsx` (+3, -1)
- `packages/kilo-console/src/routes/config/FormattersRoute.tsx` (+1, -2)
- `packages/kilo-console/src/routes/config/IndexingRoute.tsx` (+546, -0)
- `packages/kilo-console/src/routes/config/KeybindsRoute.tsx` (+1, -2)
- `packages/kilo-console/src/routes/config/McpRoute.tsx` (+1, -2)
- `packages/kilo-console/src/routes/config/ModelsRoute.tsx` (+1, -2)
- `packages/kilo-console/src/routes/config/PermissionsRoute.tsx` (+1, -2)
- `packages/kilo-console/src/routes/config/ProvidersRoute.tsx` (+1, -2)
- `packages/kilo-console/src/routes/config/ServersRoute.tsx` (+1, -2)
- `packages/kilo-console/src/routes/config/SourcesRoute.tsx` (+1, -2)
- `packages/kilo-console/src/routes/config/ToolsRoute.tsx` (+1, -2)
- `packages/kilo-console/src/routes/config/sections.tsx` (+16, -1)
- `packages/kilo-console/src/routes/config/state/indexing.test.ts` (+62, -0)
- `packages/kilo-console/src/routes/config/state/indexing.ts` (+84, -0)
- `packages/kilo-console/src/styles.css` (+1, -0)
- `packages/kilo-console/src/styles/agents-tools.css` (+2, -2)
- `packages/kilo-console/src/styles/indexing.css` (+50, -0)
- `packages/kilo-docs/pages/automate/extending/plugins.md` (+3, -18)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli-reference.md` (+2, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli.md` (+52, -0)
- `packages/kilo-docs/pages/gateway/authentication.md` (+11, -1)
- `packages/kilo-docs/pages/getting-started/byok.md` (+9, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/indexing-kilo-catalog-loading-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/indexing-kilo-model-preset-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/indexing-provider-blur-race-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/indexing-scope-switch-chromium-linux.png` (+3, -0)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-gateway/src/api/embedding-models.ts` (+61, -14)
- `packages/kilo-gateway/src/index.ts` (+1, -0)
- `packages/kilo-gateway/test/api/embedding-models.test.ts` (+57, -19)
- `packages/kilo-ui/src/components/basic-tool.tsx` (+7, -1)
- `packages/kilo-ui/src/hooks/auto-scroll.ts` (+3, -5)
- `packages/kilo-ui/src/hooks/create-auto-scroll.tsx` (+126, -140)
- `packages/kilo-ui/src/hooks/scroll-user-activity.ts` (+50, -0)
- `packages/kilo-vscode/LICENSE` (+1, -1)
- `packages/kilo-vscode/script/launch.ts` (+1, -0)
- `packages/kilo-vscode/src/KiloProvider.ts` (+66, -40)
- `packages/kilo-vscode/src/SubAgentViewerProvider.ts` (+15, -17)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+21, -3)
- `packages/kilo-vscode/src/agent-manager/WorktreeManager.ts` (+44, -25)
- `packages/kilo-vscode/src/agent-manager/local-diff.ts` (+16, -6)
- `packages/kilo-vscode/src/agent-manager/mcp-warmup.ts` (+15, -0)
- `packages/kilo-vscode/src/agent-manager/terminal-font.ts` (+57, -0)
- `packages/kilo-vscode/src/agent-manager/terminal-routing.ts` (+4, -1)
- `packages/kilo-vscode/src/agent-manager/tool-start.ts` (+6, -0)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+10, -0)
- `packages/kilo-vscode/src/commands/toggle-auto-approve.ts` (+2, -1)
- `packages/kilo-vscode/src/diff/shared/binary.ts` (+29, -0)
- `packages/kilo-vscode/src/diff/sources/git-status.ts` (+9, -6)
- `packages/kilo-vscode/src/diff/sources/session.ts` (+3, -1)
- `packages/kilo-vscode/src/diff/sources/staged.ts` (+4, -0)
- `packages/kilo-vscode/src/diff/sources/unstaged.ts` (+7, -0)
- `packages/kilo-vscode/src/kilo-provider-utils.ts` (+1, -1)
- `packages/kilo-vscode/src/kilo-provider/handlers/permission-handler.ts` (+23, -12)
- `packages/kilo-vscode/src/kilo-provider/message-page.ts` (+1, -2)
- `packages/kilo-vscode/src/services/cli-backend/connection-service.ts` (+41, -0)
- `packages/kilo-vscode/tests/indexing-provider-blur-race.spec.ts` (+46, -2)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+14, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-diff-state.test.ts` (+14, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-mcp-warmup.test.ts` (+84, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-terminal-font.test.ts` (+101, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-tool-start.test.ts` (+91, -0)
- `packages/kilo-vscode/tests/unit/auto-approve.test.ts` (+23, -1)
- `packages/kilo-vscode/tests/unit/config-utils.test.ts` (+40, -1)
- `packages/kilo-vscode/tests/unit/diff-session-source.test.ts` (+10, -2)
- `packages/kilo-vscode/tests/unit/indexing-tab-state.test.ts` (+129, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-indexing-refresh.test.ts` (+40, -1)
- `packages/kilo-vscode/tests/unit/kilo-provider-load-messages.test.ts` (+53, -17)
- `packages/kilo-vscode/tests/unit/local-diff.test.ts` (+30, -0)
- `packages/kilo-vscode/tests/unit/permission-recovery.test.ts` (+121, -9)
- `packages/kilo-vscode/tests/unit/task-tool-hydration.test.ts` (+41, -0)
- `packages/kilo-vscode/tests/unit/worktree-manager.test.ts` (+20, -24)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/DiffPanel.tsx` (+16, -9)
- `packages/kilo-vscode/webview-ui/agent-manager/NewWorktreeDialog.tsx` (+0, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/TerminalTab.tsx` (+17, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/render.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/state.ts` (+18, -18)
- `packages/kilo-vscode/webview-ui/diff-viewer/FullScreenDiffView.tsx` (+18, -10)
- `packages/kilo-vscode/webview-ui/diff-viewer/diff-open-policy.ts` (+12, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskToolExpanded.tsx` (+24, -13)
- `packages/kilo-vscode/webview-ui/src/components/chat/task-tool-state.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/IndexingTab.tsx` (+145, -60)
- `packages/kilo-vscode/webview-ui/src/components/settings/SettingsRow.tsx` (+18, -6)
- `packages/kilo-vscode/webview-ui/src/components/settings/indexing-tab-state.ts` (+93, -0)
- `packages/kilo-vscode/webview-ui/src/context/config.tsx` (+57, -10)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+41, -5)
- `packages/kilo-vscode/webview-ui/src/stories/settings.stories.tsx` (+43, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/agent-manager.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+10, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+3, -1)
- `packages/kilo-vscode/webview-ui/src/utils/config-utils.ts` (+45, -0)
- `packages/kilo-web-ui/src/components/console.tsx` (+14, -6)
- `packages/opencode/package.json` (+3, -3)
- `packages/opencode/src/cli/cmd/tui/app.tsx` (+0, -11)
- `packages/opencode/src/cli/cmd/tui/plugin/internal.ts` (+2, -0)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+1, -41)
- `packages/opencode/src/index.ts` (+14, -4)
- `packages/opencode/src/kilocode/bell.ts` (+0, -6)
- `packages/opencode/src/kilocode/cli/cmd/tui/app.tsx` (+3, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/indexing-warning.ts` (+75, -0)
- `packages/opencode/src/kilocode/cli/setup.ts` (+80, -0)
- `packages/opencode/src/kilocode/components/dialog-indexing.tsx` (+301, -244)
- `packages/opencode/src/kilocode/components/indexing-dialog-state.ts` (+148, -0)
- `packages/opencode/src/kilocode/config/config.ts` (+3, -2)
- `packages/opencode/src/kilocode/config/overlay.ts` (+57, -3)
- `packages/opencode/src/kilocode/indexing-event.ts` (+8, -0)
- `packages/opencode/src/kilocode/indexing-warning.ts` (+29, -0)
- `packages/opencode/src/kilocode/indexing-worker-client.ts` (+61, -31)
- `packages/opencode/src/kilocode/indexing-worker-protocol.ts` (+8, -0)
- `packages/opencode/src/kilocode/indexing-worker.ts` (+31, -8)
- `packages/opencode/src/kilocode/indexing.ts` (+116, -20)
- `packages/opencode/src/kilocode/plugins/attention.ts` (+53, -0)
- `packages/opencode/src/kilocode/plugins/sidebar-indexing.tsx` (+3, -1)
- `packages/opencode/src/kilocode/server/httpapi/groups/indexing.ts` (+41, -2)
- `packages/opencode/src/kilocode/server/httpapi/handlers/config-console.ts` (+2, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/indexing.ts` (+9, -4)
- `packages/opencode/src/kilocode/server/httpapi/session-fork.ts` (+1, -5)
- `packages/opencode/src/kilocode/session/fork.ts` (+110, -56)
- `packages/opencode/src/kilocode/session/index.ts` (+3, -11)
- `packages/opencode/src/kilocode/skills/kilo-config.md` (+3, -1)
- `packages/opencode/src/session/session.ts` (+8, -4)
- `packages/opencode/test/kilocode/cli/cmd/tui/attention.test.ts` (+166, -0)
- `packages/opencode/test/kilocode/config/config.test.ts` (+20, -2)
- `packages/opencode/test/kilocode/help.test.ts` (+59, -3)
- `packages/opencode/test/kilocode/indexing-dialog-state.test.ts` (+196, -0)
- `packages/opencode/test/kilocode/indexing-startup.test.ts` (+220, -6)
- `packages/opencode/test/kilocode/indexing-warning.test.ts` (+43, -0)
- `packages/opencode/test/kilocode/indexing-worker.test.ts` (+58, -0)
- `packages/opencode/test/kilocode/plugin-dependencies.ts` (+15, -0)
- `packages/opencode/test/kilocode/project-config-update.test.ts` (+3, -3)
- `packages/opencode/test/kilocode/server/config-overlay.test.ts` (+104, -27)
- `packages/opencode/test/kilocode/server/httpapi-exercise-scenarios.ts` (+2, -0)
- `packages/opencode/test/kilocode/server/httpapi-public.test.ts` (+22, -1)
- `packages/opencode/test/kilocode/server/tui-config.test.ts` (+47, -0)
- `packages/opencode/test/kilocode/session-fork-remap.test.ts` (+162, -203)
- `packages/opencode/test/provider/provider.test.ts` (+3, -1)
- `packages/opencode/test/server/httpapi-provider.test.ts` (+5, -0)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+62, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+176, -111)
- `packages/sdk/openapi.json` (+472, -299)
- `script/check-opencode-promise-facades.ts` (+0, -1)
- `script/upstream/README.md` (+5, -1)
- `script/upstream/merge.ts` (+24, -0)
- `script/upstream/transforms/transform-package-json.test.ts` (+68, -1)
- `script/upstream/transforms/transform-package-json.ts` (+50, -0)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 1b6678dce..399035f26 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -49,7 +49,7 @@
     "@ai-sdk/amazon-bedrock": "4.0.96",
     "@ai-sdk/anthropic": "3.0.71",
     "@ai-sdk/azure": "3.0.49",
-    "@ai-sdk/cerebras": "2.0.41",
+    "@ai-sdk/cerebras": "2.0.54",
     "@ai-sdk/cohere": "3.0.27",
     "@ai-sdk/deepinfra": "2.0.41",
     "@ai-sdk/gateway": "3.0.104",
@@ -58,13 +58,13 @@
     "@ai-sdk/groq": "3.0.31",
     "@ai-sdk/mistral": "3.0.27",
     "@ai-sdk/openai": "3.0.53",
-    "@ai-sdk/openai-compatible": "2.0.41",
+    "@ai-sdk/openai-compatible": "2.0.48",
     "@ai-sdk/perplexity": "3.0.26",
     "@ai-sdk/provider": "3.0.8",
     "@ai-sdk/provider-utils": "4.0.23",
     "@ai-sdk/togetherai": "2.0.41",
     "@ai-sdk/vercel": "2.0.39",
-    "@ai-sdk/xai": "3.0.82",
+    "@ai-sdk/xai": "3.0.92",
     "@aws-sdk/credential-providers": "3.993.0",
     "@openrouter/ai-sdk-provider": "2.9.0",
     "ai-gateway-provider": "3.1.2",
```


## opencode Changes (318dbe9..bf4c647)

### Commits

- bf4c647 - chore: generate (opencode-agent[bot], 2026-06-12)
- f35bb51 - feat(app): update oc-2 colors (#31071) (Aarav Sareen, 2026-06-12)
- 2c5335d - chore: generate (opencode-agent[bot], 2026-06-12)
- 7793db3 - fix(core): preserve credential schema compatibility (Dax Raad, 2026-06-12)
- 5f77482 - chore: generate (opencode-agent[bot], 2026-06-12)
- 30aec29 - refactor(core): simplify integration credentials (#31968) (Dax, 2026-06-12)
- a9c810c - fix(tui): double file content injection in commands using $ARGUMENTS (#31245) (Tony Worm, 2026-06-11)
- fe2e4e2 - sync release versions for v1.17.4 (opencode, 2026-06-12)
- 03a2504 - fix(tui): shorten move session description (#31967) (David Hill, 2026-06-11)
- bace18c - zen: make payment method off_session (Frank, 2026-06-11)
- cd2e6f0 - chore: generate (opencode-agent[bot], 2026-06-11)
- 7e7ad37 - feat(opencode): support cwd on local MCP servers (#30676) (Grant Martin, 2026-06-11)
- ca8db31 - fix(tui): show prompt submission errors (#31949) (Aiden Cline, 2026-06-11)
- 9eb07ab - chore: generate (opencode-agent[bot], 2026-06-11)
- e07e420 - fix(stats): align deep route metadata with /data (#31930) (Adam, 2026-06-11)
- 84f94e6 - chore: generate (opencode-agent[bot], 2026-06-11)
- a150424 - fix(tui): show terminal tool failure labels (#31934) (Aiden Cline, 2026-06-11)
- 2e71292 - fix(gemini): prevent gemini incompatibility with some tools (#31877) (Linus Schlumberger, 2026-06-11)
- e2527db - fix(opencode): surface content-filter finish reason as visible error (#31745) (Kevin Dawkins, 2026-06-11)
- a1dee8b - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-11)
- 04e5ca9 - chore: bump gitlab-ai-provider to 6.9.3 and opencode-gitlab-auth to 2.1.0 (#31913) (Vladimir Glafirov, 2026-06-11)
- 6dd4d14 - chore: generate (opencode-agent[bot], 2026-06-11)
- 31c5454 - refactor(server): serve raw filesystem content (#31911) (Dax, 2026-06-11)
- 31b233e - chore: generate (opencode-agent[bot], 2026-06-11)
- 567d6ed - fix(tui): restore legacy sync consumers (#31908) (Dax, 2026-06-11)
- 2bde20c - test(opencode): simplify snapshot race layer wiring (#31827) (James Long, 2026-06-11)
- 92c70c9 - fix(tui): preserve exit epilogue during scoped shutdown (#31805) (tobwen, 2026-06-11)

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
- `packages/console/core/src/billing.ts` (+4, -1)
- `packages/core/migration/20260127222353_familiar_lady_ursula/migration.sql` (+0, -90)
- `packages/core/migration/20260127222353_familiar_lady_ursula/snapshot.json` (+0, -796)
- `packages/core/migration/20260211171708_add_project_commands/migration.sql` (+0, -1)
- `packages/core/migration/20260211171708_add_project_commands/snapshot.json` (+0, -806)
- `packages/core/migration/20260213144116_wakeful_the_professor/migration.sql` (+0, -11)
- `packages/core/migration/20260213144116_wakeful_the_professor/snapshot.json` (+0, -897)
- `packages/core/migration/20260225215848_workspace/migration.sql` (+0, -7)
- `packages/core/migration/20260225215848_workspace/snapshot.json` (+0, -959)
- `packages/core/migration/20260227213759_add_session_workspace_id/migration.sql` (+0, -2)
- `packages/core/migration/20260227213759_add_session_workspace_id/snapshot.json` (+0, -983)
- `packages/core/migration/20260228203230_blue_harpoon/migration.sql` (+0, -17)
- `packages/core/migration/20260228203230_blue_harpoon/snapshot.json` (+0, -1102)
- `packages/core/migration/20260303231226_add_workspace_fields/migration.sql` (+0, -5)
- `packages/core/migration/20260303231226_add_workspace_fields/snapshot.json` (+0, -1013)
- `packages/core/migration/20260309230000_move_org_to_state/migration.sql` (+0, -3)
- `packages/core/migration/20260309230000_move_org_to_state/snapshot.json` (+0, -1156)
- `packages/core/migration/20260312043431_session_message_cursor/migration.sql` (+0, -4)
- `packages/core/migration/20260312043431_session_message_cursor/snapshot.json` (+0, -1168)
- `packages/core/migration/20260323234822_events/migration.sql` (+0, -13)
- `packages/core/migration/20260323234822_events/snapshot.json` (+0, -1271)
- `packages/core/migration/20260410174513_workspace-name/migration.sql` (+0, -16)
- `packages/core/migration/20260410174513_workspace-name/snapshot.json` (+0, -1271)
- `packages/core/migration/20260413175956_chief_energizer/migration.sql` (+0, -13)
- `packages/core/migration/20260413175956_chief_energizer/snapshot.json` (+0, -1399)
- `packages/core/migration/20260423070820_add_icon_url_override/migration.sql` (+0, -2)
- `packages/core/migration/20260423070820_add_icon_url_override/snapshot.json` (+0, -1409)
- `packages/core/migration/20260427172553_slow_nightmare/migration.sql` (+0, -17)
- `packages/core/migration/20260427172553_slow_nightmare/snapshot.json` (+0, -1409)
- `packages/core/migration/20260428004200_add_session_path/migration.sql` (+0, -1)
- `packages/core/migration/20260428004200_add_session_path/snapshot.json` (+0, -1419)
- `packages/core/migration/20260501142318_next_venus/migration.sql` (+0, -2)
- `packages/core/migration/20260501142318_next_venus/snapshot.json` (+0, -1439)
- `packages/core/migration/20260504145000_add_sync_owner/migration.sql` (+0, -1)
- `packages/core/migration/20260504145000_add_sync_owner/snapshot.json` (+0, -1449)
- `packages/core/migration/20260507164347_add_workspace_time/migration.sql` (+0, -1)
- `packages/core/migration/20260507164347_add_workspace_time/snapshot.json` (+0, -1459)
- `packages/core/migration/20260510033149_session_usage/migration.sql` (+0, -6)
- `packages/core/migration/20260510033149_session_usage/snapshot.json` (+0, -1519)
- `packages/core/migration/20260511000411_data_migration_state/migration.sql` (+0, -4)
- `packages/core/migration/20260511000411_data_migration_state/snapshot.json` (+0, -1490)
- `packages/core/migration/20260511173437_session-metadata/migration.sql` (+0, -1)
- `packages/core/migration/20260511173437_session-metadata/snapshot.json` (+0, -1560)
- `packages/core/migration/20260601010001_normalize_storage_paths/migration.sql` (+0, -7)
- `packages/core/migration/20260601010001_normalize_storage_paths/snapshot.json` (+0, -1560)
- `packages/core/migration/20260601202201_amazing_prowler/migration.sql` (+0, -1)
- `packages/core/migration/20260601202201_amazing_prowler/snapshot.json` (+0, -1498)
- `packages/core/migration/20260602002951_lowly_union_jack/migration.sql` (+0, -11)
- `packages/core/migration/20260602002951_lowly_union_jack/snapshot.json` (+0, -1602)
- `packages/core/migration/20260602182828_add_project_directories/migration.sql` (+0, -8)
- `packages/core/migration/20260602182828_add_project_directories/snapshot.json` (+0, -1664)
- `packages/core/migration/20260603001617_session_message_projection_indexes/migration.sql` (+0, -5)
- `packages/core/migration/20260603001617_session_message_projection_indexes/snapshot.json` (+0, -1636)
- `packages/core/migration/20260603040000_session_message_projection_order/migration.sql` (+0, -6)
- `packages/core/migration/20260603040000_session_message_projection_order/snapshot.json` (+0, -1638)
- `packages/core/migration/20260603141458_session_input_inbox/migration.sql` (+0, -12)
- `packages/core/migration/20260603141458_session_input_inbox/snapshot.json` (+0, -1759)
- `packages/core/migration/20260603160727_jittery_ezekiel_stane/migration.sql` (+0, -4)
- `packages/core/migration/20260603160727_jittery_ezekiel_stane/snapshot.json` (+0, -1869)
- `packages/core/migration/20260604172448_event_sourced_session_input/migration.sql` (+0, -28)
- `packages/core/migration/20260604172448_event_sourced_session_input/snapshot.json` (+0, -1898)
- `packages/core/migration/20260605003541_add_session_context_snapshot/migration.sql` (+0, -9)
- `packages/core/migration/20260605003541_add_session_context_snapshot/snapshot.json` (+0, -1980)
- `packages/core/migration/20260605042240_add_context_epoch_agent/migration.sql` (+0, -1)
- `packages/core/migration/20260605042240_add_context_epoch_agent/snapshot.json` (+0, -1990)
- `packages/core/migration/20260611035744_credential/migration.sql` (+0, -12)
- `packages/core/package.json` (+2, -2)
- `packages/core/{migration/20260611035744_credential/snapshot.json => schema.json}` (+20, -24)
- `packages/core/script/migration.ts` (+99, -49)
- `packages/core/src/catalog.ts` (+7, -5)
- `packages/core/src/config/mcp.ts` (+3, -0)
- `packages/core/src/connector.ts` (+0, -492)
- `packages/core/src/connector/schema.ts` (+0, -9)
- `packages/core/src/credential.ts` (+48, -245)
- `packages/core/src/credential/sql.ts` (+12, -20)
- `packages/core/src/database/migration.gen.ts` (+1, -0)
- `packages/core/src/database/migration.ts` (+24, -2)
- `packages/core/src/database/migration/20260611192811_lush_chimera.ts` (+25, -0)
- `packages/core/src/database/schema.gen.ts` (+276, -0)
- `packages/core/src/filesystem.ts` (+4, -23)
- `packages/core/src/integration.ts` (+521, -0)
- `packages/core/src/integration/connection.ts` (+20, -0)
- `packages/core/src/integration/schema.ts` (+9, -0)
- `packages/core/src/location-layer.ts` (+2, -2)
- `packages/core/src/plugin/boot.ts` (+5, -5)
- `packages/core/src/plugin/models-dev.ts` (+16, -13)
- `packages/core/src/plugin/provider/openai-auth.ts` (+17, -12)
- `packages/core/src/plugin/provider/openai.ts` (+3, -3)
- `packages/core/src/v1/config/mcp.ts` (+3, -0)
- `packages/core/src/v1/config/migrate.ts` (+8, -1)
- `packages/core/src/v1/session.ts` (+4, -0)
- `packages/core/test/catalog.test.ts` (+16, -13)
- `packages/core/test/connector.test.ts` (+0, -401)
- `packages/core/test/credential.test.ts` (+21, -178)
- `packages/core/test/database-migration.test.ts` (+38, -0)
- `packages/core/test/integration.test.ts` (+401, -0)
- `packages/core/test/location-filesystem.test.ts` (+3, -4)
- `packages/core/test/location-layer.test.ts` (+2, -4)
- `packages/core/test/plugin/models-dev.test.ts` (+27, -11)
- `packages/core/test/plugin/provider-azure.test.ts` (+9, -9)
- `packages/core/test/plugin/provider-cloudflare-workers-ai.test.ts` (+9, -9)
- `packages/core/test/plugin/provider-gitlab.test.ts` (+11, -11)
- `packages/core/test/plugin/provider-helper.ts` (+14, -5)
- `packages/core/test/plugin/provider-openai.test.ts` (+15, -15)
- `packages/stats/core/package.json` (+1, -1)

#### Other Changes
- `bun.lock` (+59, -31)
- `bunfig.toml` (+1, -1)
- `nix/hashes.json` (+4, -4)
- `packages/app/package.json` (+1, -1)
- `packages/app/src/pages/home.tsx` (+2, -2)
- `packages/cli/package.json` (+1, -1)
- `packages/cli/src/commands/handlers/serve.ts` (+2, -0)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/lib/stats-proxy.ts` (+5, -1)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/mail/package.json` (+1, -1)
- `packages/console/support/package.json` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/enterprise/package.json` (+1, -1)
- `packages/function/package.json` (+1, -1)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/package.json` (+3, -3)
- `packages/opencode/src/cli/cmd/debug/file.ts` (+8, -2)
- `packages/opencode/src/mcp/index.ts` (+3, -1)
- `packages/opencode/src/provider/transform.ts` (+18, -0)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/file.ts` (+21, -6)
- `packages/opencode/src/session/prompt.ts` (+19, -1)
- `packages/opencode/test/lib/llm-server.ts` (+8, -0)
- `packages/opencode/test/mcp/lifecycle.test.ts` (+21, -2)
- `packages/opencode/test/provider/transform.test.ts` (+87, -0)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+43, -17)
- `packages/opencode/test/server/httpapi-public-openapi.test.ts` (+14, -12)
- `packages/opencode/test/server/httpapi-sdk.test.ts` (+0, -3)
- `packages/opencode/test/session/prompt.test.ts` (+46, -0)
- `packages/opencode/test/session/snapshot-tool-race.test.ts` (+21, -103)
- `packages/opencode/test/storage/workspace-time-migration.test.ts` (+0, -50)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/client.ts` (+1, -4)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+160, -110)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+165, -172)
- `packages/sdk/openapi.json` (+279, -375)
- `packages/server/package.json` (+1, -1)
- `packages/server/src/api.ts` (+4, -2)
- `packages/server/src/groups/credential.ts` (+30, -0)
- `packages/server/src/groups/fs.ts` (+5, -10)
- `packages/server/src/groups/{connector.ts => integration.ts}` (+32, -34)
- `packages/server/src/handlers.ts` (+6, -2)
- `packages/server/src/handlers/credential.ts` (+22, -0)
- `packages/server/src/handlers/fs.ts` (+11, -7)
- `packages/server/src/handlers/{connector.ts => integration.ts}` (+30, -29)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/app/public/banner.png` (+-, --)
- `packages/stats/app/src/routes/[lab]/[model].tsx` (+14, -4)
- `packages/stats/app/src/routes/[lab]/index.tsx` (+13, -8)
- `packages/stats/server/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/tui/src/app.tsx` (+5, -4)
- `packages/tui/src/component/dialog-model.tsx` (+50, -45)
- `packages/tui/src/component/dialog-workspace-create.tsx` (+1, -1)
- `packages/tui/src/component/dialog-workspace-list.tsx` (+1, -1)
- `packages/tui/src/component/prompt/autocomplete.tsx` (+11, -12)
- `packages/tui/src/component/prompt/index.tsx` (+25, -16)
- `packages/tui/src/component/use-connected.tsx` (+8, -3)
- `packages/tui/src/context/data.tsx` (+12, -14)
- `packages/tui/src/context/local.tsx` (+18, -27)
- `packages/tui/src/feature-plugins/home/footer.tsx` (+4, -5)
- `packages/tui/src/routes/home/session-destination.tsx` (+5, -3)
- `packages/tui/src/routes/session/index.tsx` (+13, -4)
- `packages/tui/src/util/renderer.ts` (+3, -4)
- `packages/tui/sst-env.d.ts` (+10, -0)
- `packages/tui/test/app-lifecycle.test.tsx` (+69, -1)
- `packages/tui/test/cli/tui/data.test.tsx` (+8, -8)
- `packages/tui/test/cli/tui/inline-tool-wrap-snapshot.test.tsx` (+28, -0)
- `packages/tui/test/fixture/tui-sdk.ts` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/script/colors.txt` (+14, -14)
- `packages/ui/src/theme/color.ts` (+13, -0)
- `packages/ui/src/theme/themes/oc-2.json` (+40, -38)
- `packages/ui/src/theme/v2/default-primitives.ts` (+8, -7)
- `packages/ui/src/theme/v2/foreground.ts` (+41, -1)
- `packages/ui/src/theme/v2/mapping.ts` (+0, -12)
- `packages/ui/src/theme/v2/resolve.ts` (+1, -1)
- `packages/ui/src/v2/components/tabs-v2.css` (+4, -3)
- `packages/ui/src/v2/styles/colors.css` (+8, -7)
- `packages/ui/src/v2/styles/theme.css` (+40, -40)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/mcp-servers.mdx` (+8, -7)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 447d372..092e55b 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.17.3",
+  "version": "1.17.4",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/console/core/src/billing.ts
```diff
diff --git a/packages/console/core/src/billing.ts b/packages/console/core/src/billing.ts
index 8230765..879cd8c 100644
--- a/packages/console/core/src/billing.ts
+++ b/packages/console/core/src/billing.ts
@@ -272,7 +272,10 @@ export namespace Billing {
         },
         payment_method_options: {
           card: {
-            setup_future_usage: "on_session",
+            setup_future_usage: "off_session",
+          },
+          link: {
+            setup_future_usage: "off_session",
           },
         },
         //payment_method_data: {
```

#### packages/core/migration/20260127222353_familiar_lady_ursula/migration.sql
```diff
diff --git a/packages/core/migration/20260127222353_familiar_lady_ursula/migration.sql b/packages/core/migration/20260127222353_familiar_lady_ursula/migration.sql
deleted file mode 100644
index 775c1a1..0000000
--- a/packages/core/migration/20260127222353_familiar_lady_ursula/migration.sql
+++ /dev/null
@@ -1,90 +0,0 @@
-CREATE TABLE `project` (
-	`id` text PRIMARY KEY,
-	`worktree` text NOT NULL,
-	`vcs` text,
-	`name` text,
-	`icon_url` text,
-	`icon_color` text,
-	`time_created` integer NOT NULL,
-	`time_updated` integer NOT NULL,
-	`time_initialized` integer,
-	`sandboxes` text NOT NULL
-);
---> statement-breakpoint
-CREATE TABLE `message` (
-	`id` text PRIMARY KEY,
-	`session_id` text NOT NULL,
-	`time_created` integer NOT NULL,
-	`time_updated` integer NOT NULL,
-	`data` text NOT NULL,
-	CONSTRAINT `fk_message_session_id_session_id_fk` FOREIGN KEY (`session_id`) REFERENCES `session`(`id`) ON DELETE CASCADE
-);
---> statement-breakpoint
-CREATE TABLE `part` (
-	`id` text PRIMARY KEY,
-	`message_id` text NOT NULL,
-	`session_id` text NOT NULL,
-	`time_created` integer NOT NULL,
-	`time_updated` integer NOT NULL,
-	`data` text NOT NULL,
-	CONSTRAINT `fk_part_message_id_message_id_fk` FOREIGN KEY (`message_id`) REFERENCES `message`(`id`) ON DELETE CASCADE
-);
---> statement-breakpoint
-CREATE TABLE `permission` (
-	`project_id` text PRIMARY KEY,
-	`time_created` integer NOT NULL,
-	`time_updated` integer NOT NULL,
-	`data` text NOT NULL,
-	CONSTRAINT `fk_permission_project_id_project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON DELETE CASCADE
-);
---> statement-breakpoint
-CREATE TABLE `session` (
-	`id` text PRIMARY KEY,
-	`project_id` text NOT NULL,
-	`parent_id` text,
```

#### packages/core/migration/20260127222353_familiar_lady_ursula/snapshot.json
```diff
diff --git a/packages/core/migration/20260127222353_familiar_lady_ursula/snapshot.json b/packages/core/migration/20260127222353_familiar_lady_ursula/snapshot.json
deleted file mode 100644
index ff76ee2..0000000
--- a/packages/core/migration/20260127222353_familiar_lady_ursula/snapshot.json
+++ /dev/null
@@ -1,796 +0,0 @@
-{
-  "version": "7",
-  "dialect": "sqlite",
-  "id": "068758ed-a97a-46f6-8a59-6c639ae7c20c",
-  "prevIds": ["00000000-0000-0000-0000-000000000000"],
-  "ddl": [
-    {
-      "name": "project",
-      "entityType": "tables"
-    },
-    {
-      "name": "message",
-      "entityType": "tables"
-    },
-    {
-      "name": "part",
-      "entityType": "tables"
-    },
-    {
-      "name": "permission",
-      "entityType": "tables"
-    },
-    {
-      "name": "session",
-      "entityType": "tables"
-    },
-    {
-      "name": "todo",
-      "entityType": "tables"
-    },
-    {
-      "name": "session_share",
-      "entityType": "tables"
-    },
-    {
-      "type": "text",
-      "notNull": false,
-      "autoincrement": false,
-      "default": null,
-      "generated": null,
-      "name": "id",
-      "entityType": "columns",
-      "table": "project"
-    },
```

#### packages/core/migration/20260211171708_add_project_commands/migration.sql
```diff
diff --git a/packages/core/migration/20260211171708_add_project_commands/migration.sql b/packages/core/migration/20260211171708_add_project_commands/migration.sql
deleted file mode 100644
index b63f147..0000000
--- a/packages/core/migration/20260211171708_add_project_commands/migration.sql
+++ /dev/null
@@ -1 +0,0 @@
-ALTER TABLE `project` ADD `commands` text;
\ No newline at end of file
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/package.json
