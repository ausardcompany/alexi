# Planning Task: Analyze Upstream Changes for Alexi

You are a senior software architect analyzing upstream changes from three AI coding assistant repositories:
- **kilocode** (Kilo-Org/kilocode) - Kilo AI coding assistant
- **opencode** (anomalyco/opencode) - OpenCode AI terminal assistant  
- **claude-code** (anthropics/claude-code) - Anthropic's Claude Code CLI

## Diff Report

# Upstream Changes Report
Generated: 2026-06-20 08:58:03

## Summary
- kilocode: 64 commits, 122 files changed
- opencode: 6 commits, 35 files changed

## kilocode Changes (4bfd65264..ec0dd783a)

### Commits

- ec0dd783a - Merge pull request #10005 from Kilo-Org/catrielmuller/run-commands (Catriel Müller, 2026-06-19)
- 6e1f902d6 - refactor: rebase (Catriel Müller, 2026-06-19)
- 533c2017f - release: v7.3.50 (kilo-maintainer[bot], 2026-06-19)
- 1d030dcbb - feat(cli): support compact and summarize built-ins in kilo run --command (Catriel Müller, 2026-06-19)
- a193a4fb7 - Merge pull request #11026 from IamCoder18/cli-console-headless-display-check (Catriel Müller, 2026-06-19)
- e2ebf8b7c - docs: add changeset for Linux display detection fix (Aarav Sharma, 2026-06-19)
- b3abf09f6 - cli: skip browser open for kilo console on headless Linux (Aarav Sharma, 2026-06-19)
- be692aa53 - Merge pull request #11028 from IamCoder18/cli-server-hostname-url-display (Catriel Müller, 2026-06-19)
- e7770cfb5 - Merge pull request #11467 from Kilo-Org/fix/jetbrains-training-disclosure (Christiaan Arnoldus, 2026-06-19)
- e64a58060 - refactor: fix kilo markers (Catriel Müller, 2026-06-19)
- d8ceb9efb - Merge pull request #11475 from Kilo-Org/second-smile (Marius, 2026-06-19)
- 3d4ccc25c - fix(cli): preserve custom subagent permissions (marius-kilocode, 2026-06-19)
- f232e95a3 - Merge pull request #11301 from Kilo-Org/console-explore-privacy-filter (Christiaan Arnoldus, 2026-06-19)
- 0255a4a7e - Merge pull request #11155 from Kilo-Org/fix/local-review-scale-sub-agents (Marian Alexandru Alecu, 2026-06-19)
- 3babed6a5 - refactor: fix windows test (Catriel Müller, 2026-06-19)
- a0305b337 - test(review): update prompt assertions (Alex Alecu, 2026-06-19)
- 02bbf661b - refactor: fix ipv6 (Catriel Müller, 2026-06-19)
- d9bb823c7 - refactor: address comments (Catriel Müller, 2026-06-19)
- db26772c6 - Merge branch 'main' into fix/local-review-scale-sub-agents (Marian Alexandru Alecu, 2026-06-19)
- 646d2104c - Merge pull request #9795 from Fatty911/docs/chunk-idle-timeout-silent-dropout (Catriel Müller, 2026-06-19)
- 55957a153 - Merge pull request #11418 from Kilo-Org/docs/custom-provider-options (Christiaan Arnoldus, 2026-06-19)
- 0bbc33adc - fix(server,daemon,u): annotate Kilo-specific upstream changes and resolve review findings (Aarav Sharma, 2026-06-19)
- a6ded9b60 - feat(server,daemon): show local and network URLs for 0.0.0.0 binds (Aarav Sharma, 2026-06-19)
- 30e62509b - Merge branch 'main' into docs/custom-provider-options (Christiaan Arnoldus, 2026-06-19)
- 2edb3eeca - fix(cli): limit privacy filtering to gateway models (chrarnoldus, 2026-06-19)
- c1589777f - Merge pull request #11212 from IamCoder18/fix/headless-docs-dialog (Catriel Müller, 2026-06-19)
- f317bfcaf - chore(jetbrains): remove disclosure changeset (chrarnoldus, 2026-06-19)
- 4d018deff - Merge branch 'main' into docs/custom-provider-options (Christiaan Arnoldus, 2026-06-19)
- 220a97e96 - fix(jetbrains): disclose prompt-training models (chrarnoldus, 2026-06-19)
- ab7c32d7d - refactor: kilocode isolation (Catriel Müller, 2026-06-19)
- 77a72858d - refactor: merge main (Catriel Müller, 2026-06-19)
- 5a18c2a46 - Merge pull request #11319 from grandmaster451/fix/headless-docs-url (Catriel Müller, 2026-06-19)
- baf5cea43 - fix(cli): scope privacy filter to Kilo Gateway (chrarnoldus, 2026-06-19)
- c82964205 - fix(vscode): keep chat streaming after revert (#11464) (Marius, 2026-06-19)
- 2700c39eb - Merge branch 'main' into console-explore-privacy-filter (Christiaan Arnoldus, 2026-06-19)
- 32e124d55 - Merge branch 'main' into docs/custom-provider-options (Christiaan Arnoldus, 2026-06-19)
- 033aefec9 - Apply suggestion from @chrarnoldus (Christiaan Arnoldus, 2026-06-19)
- f2bb02dd8 - Merge pull request #11446 from nyxst4ck/fix/settings-context-help (Catriel Müller, 2026-06-19)
- 12d20074b - fix(cli): fall back to item.options for chunkTimeout when not in merged options (Fatty911, 2026-06-19)
- c3e15d148 - docs(cli): add chunkTimeout to provider options and propagate to streamText (Fatty911, 2026-06-19)
- e8bcb70b9 - fix: minimal css fix (Catriel Müller, 2026-06-19)
- b0e7f4ac4 - Merge pull request #11463 from Kilo-Org/uttermost-reindeer (Marius, 2026-06-19)
- f71442351 - fix: Add vercel bypass token to opencode release watcher (#11460) (Johnny Eric Amancio, 2026-06-19)
- f67ea4dea - Merge pull request #11455 from Kilo-Org/opaque-mole (Marius, 2026-06-19)
- 909ec73b9 - fix(agent-manager): speed up worktree hover cards (marius-kilocode, 2026-06-19)
- 4d0933371 - fix: hide provider errors after session revert (marius-kilocode, 2026-06-19)
- 37026c392 - Merge branch 'main' into fix/local-review-scale-sub-agents (Marian Alexandru Alecu, 2026-06-19)
- 5d7b1bf4a - fix(console): add context to settings fields (nyxst4ck, 2026-06-19)
- 2d9e55d91 - docs: retain custom provider screenshots (chrarnoldus, 2026-06-18)
- ac3550b76 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-18)
- 8b32375fe - docs(vscode): clarify custom provider protocols (chrarnoldus, 2026-06-18)
- c44240228 - docs: clarify reasoning split API support (chrarnoldus, 2026-06-18)
- e5115c90e - docs: scope provider API recommendations to VS Code (chrarnoldus, 2026-06-18)
- 0e614dd45 - docs: refine custom provider recommendations (chrarnoldus, 2026-06-18)
- 9569166fe - fix(tui): use kilocode_change start/end markers for headless docs fallback (grandmaster451, 2026-06-18)
- 51f3a0a14 - docs: document custom provider API options (chrarnoldus, 2026-06-18)
- 7d6e2a5c5 - Merge branch 'main' into console-explore-privacy-filter (Christiaan Arnoldus, 2026-06-17)
- fb37d9c77 - fix(tui): show docs URL in dialog when browser cannot open on headless systems (grandmaster451, 2026-06-16)
- b4cdbf205 - docs: clarify Console privacy filter release note (chrarnoldus, 2026-06-16)
- 081b65325 - feat(cli): filter prompt-training models in Explore (chrarnoldus, 2026-06-16)
- 8649ab6dc - fix(cli): improve headless docs dialog UX (Aarav Sharma, 2026-06-13)
- 5e02f67cb - feat(cli): extend dead-code track to flag bloated functions and files (kiloconnect[bot], 2026-06-12)
- ba5f681b3 - fix(cli): resolve conflicting instructions in local-review prompt files (kiloconnect[bot], 2026-06-12)
- 1af563935 - fix(cli): scale local-review sub-agents based on diff size and complexity (kiloconnect[bot], 2026-06-12)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/task.ts` (+11, -4)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)

#### Other Changes
- `.changeset/bright-badgers-bring-keys.md` (+0, -7)
- `.changeset/deny-gateway-data-collection.md` (+0, -6)
- `.changeset/keep-diff-identifiers-intact.md` (+0, -5)
- `.changeset/quiet-subagent-finishes.md` (+0, -7)
- `.changeset/quiet-terminal-panel.md` (+0, -5)
- `.changeset/run-compact-summarize.md` (+5, -0)
- `.changeset/stabilize-agent-manager-transcripts.md` (+0, -5)
- `.changeset/widen-chat-lane-further.md` (+0, -5)
- `.github/workflows/watch-opencode-releases.yml` (+4, -1)
- `bun.lock` (+21, -21)
- `package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-console/src/routes/config/AgentsRoute.tsx` (+5, -1)
- `packages/kilo-console/src/routes/config/ModelsRoute.tsx` (+18, -0)
- `packages/kilo-console/src/routes/config/state/models.test.ts` (+20, -0)
- `packages/kilo-console/src/routes/config/state/models.ts` (+7, -0)
- `packages/kilo-console/src/routes/config/state/privacy.ts` (+13, -0)
- `packages/kilo-console/src/styles/models.css` (+10, -0)
- `packages/kilo-console/src/styles/responsive.css` (+1, -0)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/ai-providers/openai-compatible.md` (+5, -2)
- `packages/kilo-docs/pages/ai-providers/v0.md` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/agents/custom-models.md` (+17, -3)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/providers-configure-chromium-linux.png` (+2, -2)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloCliDataParser.kt` (+2, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorkspaceDtoMapper.kt` (+1, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/workspace/KiloWorkspaceState.kt` (+1, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/KiloCliDataParserTest.kt` (+11, -1)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloWorkspaceDtoMapperTest.kt` (+44, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+11, -10)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionController.kt` (+12, -11)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/SessionModel.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/model/ModelPicker.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/models/ModelsSettingsUi.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/WorkspaceWatchingTest.kt` (+18, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/model/ModelPickerTest.kt` (+19, -6)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/ProviderDto.kt` (+1, -0)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-vscode/CHANGELOG.md` (+34, -0)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+100, -29)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/unit/kilo-provider-load-messages.test.ts` (+272, -2)
- `packages/kilo-vscode/tests/unit/revert-checkpoints.test.ts` (+3, -5)
- `packages/kilo-vscode/tests/unit/session-queue.test.ts` (+51, -6)
- `packages/kilo-vscode/tests/unit/transcript-rows.test.ts` (+27, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/WorktreeItem.tsx` (+3, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+5, -4)
- `packages/kilo-vscode/webview-ui/src/context/session-queue.ts` (+21, -6)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+4, -2)
- `packages/kilo-vscode/webview-ui/src/context/transcript-rows.ts` (+13, -10)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+3, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+3, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+3, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+3, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+3, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+3, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+3, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+3, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+3, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+3, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+3, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+3, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+3, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+3, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+3, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+3, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+3, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+3, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+3, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+3, -3)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+35, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/cli/cmd/run.ts` (+49, -9)
- `packages/opencode/src/cli/cmd/serve.ts` (+10, -1)
- `packages/opencode/src/cli/cmd/tui/app.tsx` (+9, -1)
- `packages/opencode/src/cli/cmd/web.ts` (+15, -52)
- `packages/opencode/src/kilocode/cli/cmd/console.ts` (+16, -9)
- `packages/opencode/src/kilocode/cli/cmd/daemon.ts` (+9, -1)
- `packages/opencode/src/kilocode/cli/cmd/run.ts` (+56, -1)
- `packages/opencode/src/kilocode/cli/cmd/tui/component/dialog-headless-link.tsx` (+41, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/util/display.ts` (+4, -0)
- `packages/opencode/src/kilocode/cli/server-urls.ts` (+38, -0)
- `packages/opencode/src/kilocode/daemon/daemon.ts` (+9, -0)
- `packages/opencode/src/kilocode/review/local-review-uncommitted.txt` (+23, -9)
- `packages/opencode/src/kilocode/review/local-review.txt` (+23, -9)
- `packages/opencode/src/kilocode/session/builtin-commands.ts` (+14, -0)
- `packages/opencode/src/kilocode/session/llm.ts` (+17, -0)
- `packages/opencode/src/server/server.ts` (+10, -0)
- `packages/opencode/src/session/llm.ts` (+1, -0)
- `packages/opencode/src/session/prompt.ts` (+3, -0)
- `packages/opencode/src/session/revert.ts` (+6, -0)
- `packages/opencode/test/cli/run/run-process.test.ts` (+20, -11)
- `packages/opencode/test/kilocode/cli/cmd/console.test.ts` (+36, -0)
- `packages/opencode/test/kilocode/cli/cmd/run-message.test.ts` (+53, -0)
- `packages/opencode/test/kilocode/local-review-command.test.ts` (+18, -10)
- `packages/opencode/test/kilocode/run-network.test.ts` (+99, -3)
- `packages/opencode/test/kilocode/session/llm.test.ts` (+33, -0)
- `packages/opencode/test/kilocode/session/revert.test.ts` (+85, -0)
- `packages/opencode/test/kilocode/task-nesting.test.ts` (+74, -0)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/components/provider-icons/sprite.svg` (+5, -7)
- `script/check-opencode-annotations.ts` (+1, -0)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 6a9be3c50..3c8c63fdb 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.3.49",
+  "version": "7.3.50",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/opencode/src/kilocode/tool/task.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/task.ts b/packages/opencode/src/kilocode/tool/task.ts
index d70f6b8f6..17f06cb4f 100644
--- a/packages/opencode/src/kilocode/tool/task.ts
+++ b/packages/opencode/src/kilocode/tool/task.ts
@@ -42,12 +42,18 @@ export namespace KiloTask {
   }
 
   /**
-   * Build inherited permission rules from the calling agent.
+   * Build inherited permission ceilings from the calling agent.
    * Merges the static agent definition with the session's accumulated permissions
-   * so restrictions survive multi-hop chains (plan → general → explore).
+   * so denials survive multi-hop chains (plan → general → explore) without
+   * overriding the selected subagent's own allowlist with parent ask/allow rules.
+   *
+   * OpenCode removed parent-agent inheritance entirely in anomalyco/opencode#31696.
+   * Kilo intentionally differs: parent denials remain hard ceilings for Plan Mode
+   * and MCP restrictions, while parent ask/allow rules must not replace the
+   * selected subagent's policy. Preserve this distinction during upstream merges.
    *
    * The caller must resolve `caller` (Agent.Info) and `session` (Session.Info)
-   * before calling — this function is pure/synchronous.
+   * before calling. This function is pure/synchronous.
    */
   export function inherited(input: {
     caller: Agent.Info
@@ -58,7 +64,8 @@ export namespace KiloTask {
     const prefixes = Object.keys(input.mcp ?? {}).map((k) => k.replace(/[^a-zA-Z0-9_-]/g, "_") + "_")
     const isMcp = (p: string) => prefixes.some((prefix) => p.startsWith(prefix))
     return rules.filter(
-      (r: Permission.Rule) => r.permission === "edit" || r.permission === "bash" || isMcp(r.permission),
+      (r: Permission.Rule) =>
+        r.action === "deny" && (r.permission === "edit" || r.permission === "bash" || isMcp(r.permission)),
     )
   }
 
```


## opencode Changes (355a0bc..e6cdc54)

### Commits

- e6cdc54 - fix(tui): render console org load errors inline (#33040) (Aiden Cline, 2026-06-19)
- f092baf - tweak: remove steering wrapper that can bust cache (#33039) (Aiden Cline, 2026-06-19)
- 3f1fffe - fix(core): fix command docs in customize-opencode skill (#32718) (Grant Martin, 2026-06-19)
- c6083a4 - test(app): add manual performance diagnostics (#32937) (Luke Parker, 2026-06-19)
- 10ec856 - chore: generate (opencode-agent[bot], 2026-06-19)
- 0f6c9b3 - chore(stats): update data seo metadata (Adam, 2026-06-19)

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
- `packages/core/src/plugin/skill.ts` (+1, -1)
- `packages/core/src/plugin/skill/customize-opencode.md` (+31, -3)

#### Other Changes
- `packages/app/AGENTS.md` (+5, -0)
- `packages/app/e2e/performance/AGENTS.md` (+13, -0)
- `packages/app/e2e/performance/README.md` (+77, -0)
- `packages/app/e2e/performance/benchmark.ts` (+144, -0)
- `packages/app/e2e/performance/chrome-trace.ts` (+95, -0)
- `packages/app/e2e/performance/playwright.config.ts` (+20, -0)
- `packages/app/e2e/performance/playwright.uncapped.config.ts` (+13, -0)
- `packages/app/e2e/performance/timeline/session-tab-flash.spec.ts` (+49, -0)
- `packages/app/e2e/performance/timeline/session-tab-repaint-probe.ts` (+251, -0)
- `packages/app/e2e/performance/timeline/session-tab-switch-benchmark.spec.ts` (+79, -0)
- `packages/app/e2e/performance/timeline/session-tab-switch-metrics.ts` (+46, -0)
- `packages/app/e2e/performance/timeline/session-tab-switch-probe.ts` (+152, -0)
- `packages/app/e2e/performance/timeline/session-timeline-benchmark.fixture.ts` (+488, -0)
- `packages/app/e2e/performance/timeline/session-timeline-benchmark.spec.ts` (+85, -0)
- `packages/app/e2e/performance/timeline/session-timeline-profile.ts` (+40, -0)
- `packages/app/e2e/performance/timeline/session-timeline-stream-probe.ts` (+547, -0)
- `packages/app/e2e/performance/timeline/session-timeline-stress.fixture.ts` (+335, -0)
- `packages/app/e2e/performance/timeline/timeline-test-helpers.ts` (+67, -0)
- `packages/app/e2e/performance/unit/chrome-trace-write.test.ts` (+15, -0)
- `packages/app/e2e/performance/unit/session-tab-repaint-probe.test.ts` (+42, -0)
- `packages/app/e2e/performance/unit/session-tab-switch-metrics.test.ts` (+54, -0)
- `packages/app/e2e/performance/unit/session-timeline-stream-probe.test.ts` (+14, -0)
- `packages/app/e2e/performance/unit/session-timeline-visual-tracking.test.ts` (+16, -0)
- `packages/app/e2e/utils/mock-server.ts` (+6, -2)
- `packages/app/package.json` (+2, -1)
- `packages/app/playwright.config.ts` (+1, -0)
- `packages/opencode/src/session/prompt.ts` (+0, -18)
- `packages/opencode/test/session/prompt.test.ts` (+3, -1)
- `packages/stats/app/src/app.tsx` (+5, -2)
- `packages/stats/app/src/routes/[lab]/[model].tsx` (+4, -5)
- `packages/stats/app/src/routes/[lab]/index.tsx` (+2, -2)
- `packages/stats/app/src/routes/index.tsx` (+3, -2)
- `packages/tui/src/component/dialog-console-org.tsx` (+38, -6)

### Key Diffs

#### packages/core/src/plugin/skill.ts
```diff
diff --git a/packages/core/src/plugin/skill.ts b/packages/core/src/plugin/skill.ts
index 7c89ac8..620fdc8 100644
--- a/packages/core/src/plugin/skill.ts
+++ b/packages/core/src/plugin/skill.ts
@@ -23,7 +23,7 @@ export const Plugin = PluginV2.define({
           skill: new SkillV2.Info({
             name: "customize-opencode",
             description:
-              "Use ONLY when the user is editing or creating opencode's own configuration: opencode.json, opencode.jsonc, files under .opencode/, or files under ~/.config/opencode/. Also use when creating or fixing opencode agents, subagents, skills, plugins, MCP servers, or permission rules. Do not use for the user's own application code, or for any project that is not configuring opencode itself.",
+              "Use ONLY when the user is editing or creating opencode's own configuration: opencode.json, opencode.jsonc, files under .opencode/, or files under ~/.config/opencode/. Also use when creating or fixing opencode agents, subagents, commands, skills, plugins, MCP servers, or permission rules. Do not use for the user's own application code, or for any project that is not configuring opencode itself.",
             location: AbsolutePath.make("/builtin/customize-opencode.md"),
             content: CustomizeOpencodeContent,
           }),
```

#### packages/core/src/plugin/skill/customize-opencode.md
```diff
diff --git a/packages/core/src/plugin/skill/customize-opencode.md b/packages/core/src/plugin/skill/customize-opencode.md
index 1c1cbdf..6932dbf 100644
--- a/packages/core/src/plugin/skill/customize-opencode.md
+++ b/packages/core/src/plugin/skill/customize-opencode.md
@@ -43,6 +43,8 @@ already-loaded config until then.
 | Global config                 | `~/.config/opencode/opencode.json` (NOT `~/.opencode/`)                                                                   |
 | Project agents                | `.opencode/agent/<name>.md` or `.opencode/agents/<name>.md`                                                               |
 | Global agents                 | `~/.config/opencode/agent(s)/<name>.md`                                                                                   |
+| Project commands              | `.opencode/command/<name>.md` or `.opencode/commands/<name>.md`                                                           |
+| Global commands               | `~/.config/opencode/command(s)/<name>.md`                                                                                 |
 | Project skills                | `.opencode/skill(s)/<name>/SKILL.md`                                                                                      |
 | Global skills                 | `~/.config/opencode/skill(s)/<name>/SKILL.md`                                                                             |
 | External skills (auto-loaded) | `~/.claude/skills/<name>/SKILL.md`, `~/.agents/skills/<name>/SKILL.md`                                                    |
@@ -96,7 +98,7 @@ Every field is optional.
   },
 
   "command": {
-    "deploy": { "description": "...", "prompt": "..." }
+    "deploy": { "description": "...", "template": "..." }
   },
 
   "provider": {
@@ -151,6 +153,7 @@ Shape notes worth being explicit about:
 - `skills` is an object with `paths` and/or `urls`, not an array.
 - `references` is an object keyed by alias. Each value is a local path, Git repository, or string shorthand.
 - `agent` is an object keyed by agent name, not an array.
+- `command` is an object keyed by command name, not an array.
 - `plugin` is an array of strings or `[name, options]` tuples, not an object.
 - `mcp[name].command` is an array of strings, never a single string. `type` is required.
 - `permission` is either a string action or an object keyed by tool name.
@@ -277,6 +280,31 @@ opencode ships with `build`, `plan`, `general`, `explore`. Hidden internal agent
 `compaction`, `title`, `summary`. To override a built-in's fields, define the
 same key in `agent: { <name>: { ... } }`.
 
+## Commands
+
+opencode's command loader scans for `**/*.md` inside command directories. The
+file is named after the command, and lives directly inside the `command` folder:
+
+```
+.opencode/command/deploy.md
+```
+
+Frontmatter:
+
+```markdown
+---
+description: One sentence describing what the command does.
+agent: build
+model: anthropic/claude-sonnet-4-6
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/package.json
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/kilocode/tool/task.ts changes

## Your Task

Create a **detailed update plan** for Alexi based on the changes above.

### File Mapping
- Tool system changes → `src/tool/`
- Agent system changes → `src/agent/`
- Permission system changes → `src/permission/`
- Event bus changes → `src/bus/`
- Core orchestration changes → `src/core/`
- Provider changes → `src/providers/`
- Router changes → `src/router/`
- CLI changes → `src/cli/`

### For Each Change, Provide:
1. **File path** to modify (or create)
2. **Function/class** to change
3. **Code snippet** showing the exact change (before/after or new code)
4. **Priority**: critical | high | medium | low
5. **Reasoning**: Why this change is needed

### Important Considerations
- Maintain compatibility with SAP AI Core integration
- Preserve existing SAP-specific customizations
- Follow existing code style and patterns
- Prioritize: security fixes > bug fixes > features > refactoring
- Do NOT include changes that would break existing functionality

### Output Format

```markdown
# Update Plan for Alexi

Generated: [date]
Based on upstream commits: [list commits analyzed]

## Summary
- Total changes planned: X
- Critical: X | High: X | Medium: X | Low: X

## Changes

### 1. [Brief description]
**File**: `src/path/to/file.ts`
**Priority**: high
**Type**: feature | bugfix | security | refactor
**Reason**: [Why this change is needed]

**Current code** (if modifying):
```typescript
// existing code
```

**New code**:
```typescript
// code to add or replace with
```

### 2. [Next change...]
...

## Testing Recommendations
- [What to test after applying these changes]

## Potential Risks
- [Any breaking changes or risks to be aware of]
```

Output ONLY the plan in the format above. No conversational text.
