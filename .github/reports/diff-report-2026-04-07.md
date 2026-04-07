# Upstream Changes Report
Generated: 2026-04-07 07:20:06

## Summary
- kilocode: 38 commits, 105 files changed
- opencode: 32 commits, 79 files changed

## kilocode Changes (cb0c58c0..d10d25a4)

### Commits

- d10d25a4 - Merge pull request #8426 from Kilo-Org/fix/vscode-mode-picker-sync (Kirill Kalishev, 2026-04-06)
- 3aa5327d - Merge pull request #8417 from Kilo-Org/utopian-starflower (Kirill Kalishev, 2026-04-06)
- e9a635f6 - Merge branch 'main' into fix/vscode-mode-picker-sync (Kirill Kalishev, 2026-04-06)
- 19199fe6 - fix(vscode): clear stale optimistic question mode (kirillk, 2026-04-06)
- d3383bf3 - Merge pull request #8425 from Kilo-Org/lambertjosh-patch-1 (Joshua Lambert, 2026-04-06)
- 62d41be0 - fix(vscode): recover pending questions on SSE reconnect (kirillk, 2026-04-06)
- 4889cc40 - fix(vscode): roll back optimistic agent change when question reply fails (kirillk, 2026-04-06)
- 11a96f54 - fix(vscode): backfill agent selections when agentsLoaded arrives after messagesLoaded (kirillk, 2026-04-06)
- 77769f1e - Merge branch 'main' into utopian-starflower (Kirill Kalishev, 2026-04-06)
- e92f2ba3 - fix(cli): preserve specific MCP tool rules when propagating permissions to sub-agents (kirillk, 2026-04-06)
- 84e8db9e - Merge branch 'main' into fix/vscode-mode-picker-sync (Kirill Kalishev, 2026-04-06)
- fc014b12 - release: v7.1.22 (kilo-maintainer[bot], 2026-04-06)
- 84fde69a - Merge branch 'main' into fix/vscode-mode-picker-sync (Kirill Kalishev, 2026-04-06)
- 8d6e1f1f - fix(vscode): sync mode picker with agent mode changes from backend (kirillk, 2026-04-06)
- b7538a0d - Fix typo (Joshua Lambert, 2026-04-06)
- 05569ee0 - Merge pull request #8423 from Kilo-Org/lambertjosh-patch-1 (Joshua Lambert, 2026-04-06)
- 34199b72 - Improve FAQ (Joshua Lambert, 2026-04-06)
- 78bde077 - Merge pull request #8386 from Kilo-Org/noiseless-professor (Kirill Kalishev, 2026-04-06)
- e93646c5 - Merge branch 'main' into noiseless-professor (Kirill Kalishev, 2026-04-06)
- f84fd674 - fix(vscode): recover missed child-session prompts and improve delegation status text (kirillk, 2026-04-06)
- dbc635ec - Merge pull request #8287 from Kilo-Org/docs/kiloclaw-workspace-migration (Alex Gold, 2026-04-06)
- 3ee8192d - fix(cli): propagate MCP restrictions to sub-agents alongside edit and bash (kirillk, 2026-04-06)
- 92a8f48d - fix(cli): preserve inherited restrictions across multi-hop sub-agent chains (kirillk, 2026-04-06)
- 71acf03f - Merge pull request #8414 from Kilo-Org/docs/model-limit-context-output (Joshua Lambert, 2026-04-06)
- ad2aba31 - fix(cli): cache diffFull and ignore legacy local storage to prevent redundant git processes (#8400) (Varuu, 2026-04-06)
- 15f618b8 - Apply suggestions from code review (Joshua Lambert, 2026-04-06)
- 60114261 - fix(cli): apply read-only bash and MCP to plan mode; propagate bash restrictions to sub-agents (kirillk, 2026-04-06)
- 8816cb83 - fix(cli): plan mode asks for edits outside plan files; sub-agents inherit caller edit restrictions (kirillk, 2026-04-06)
- c3b28267 - Merge branch 'main' into docs/kiloclaw-workspace-migration (Alex Gold, 2026-04-06)
- 332849c9 - Revise migration instructions for OpenClaw (Alex Gold, 2026-04-06)
- c9179e1d - docs(kilo-docs): revise workspace migration FAQ to cover all migration scenarios (kiloconnect[bot], 2026-04-06)
- 2a803c1b - docs(kilo-docs): document limit.context and limit.output model settings (Joshua Lambert, 2026-04-06)
- 422ab170 - fix(ui): ignore dialog escape while popover is open (kirillk, 2026-04-05)
- 41954c3d - fix: stabilize worktree branch selector popovers (kirillk, 2026-04-05)
- e10324aa - release: v7.1.21 (kilo-maintainer[bot], 2026-04-05)
- c0a08add - Session migration improvements (#8367) (Imanol Maiztegui, 2026-04-05)
- 23bf43ec - docs(kilo-docs): move workspace migration section from dashboard to FAQ page (kiloconnect[bot], 2026-04-03)
- d6cc8516 - docs(kilo-docs): add workspace migration section to KiloClaw dashboard reference (kiloconnect[bot], 2026-04-03)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/task.ts` (+21, -0)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+4, -2)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
(no changes)

#### Other Changes
- `bun.lock` (+16, -16)
- `package.json` (+1, -1)
- `packages/app/package.json` (+1, -1)
- `packages/desktop-electron/package.json` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/agents/custom-models.md` (+39, -1)
- `packages/kilo-docs/pages/code-with-ai/platforms/vscode/whats-new.md` (+13, -2)
- `packages/kilo-docs/pages/kiloclaw/faq/general.md` (+42, -0)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+36, -1)
- `packages/kilo-vscode/src/kilo-provider/handlers/migration.ts` (+34, -16)
- `packages/kilo-vscode/src/kilo-provider/handlers/question.ts` (+38, -1)
- `packages/kilo-vscode/src/legacy-migration/legacy-types.ts` (+24, -2)
- `packages/kilo-vscode/src/legacy-migration/migration-service.ts` (+48, -10)
- `packages/kilo-vscode/src/legacy-migration/migration-session-progress.ts` (+37, -0)
- `packages/kilo-vscode/src/legacy-migration/sessions/migrate.ts` (+62, -10)
- `packages/kilo-vscode/tests/unit/kilo-provider-utils.test.ts` (+11, -1)
- `packages/kilo-vscode/tests/unit/legacy-migration/migrate.test.ts` (+63, -4)
- `packages/kilo-vscode/tests/unit/legacy-migration/session-summary-state.test.ts` (+33, -0)
- `packages/kilo-vscode/tests/unit/question-dock-utils.test.ts` (+93, -1)
- `packages/kilo-vscode/tests/unit/session-agent.test.ts` (+60, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/BranchSelect.tsx` (+2, -6)
- `packages/kilo-vscode/webview-ui/agent-manager/NewWorktreeDialog.tsx` (+6, -2)
- `packages/kilo-vscode/webview-ui/src/components/chat/QuestionDock.tsx` (+41, -3)
- `packages/kilo-vscode/webview-ui/src/components/chat/question-dock-utils.ts` (+46, -0)
- `packages/kilo-vscode/webview-ui/src/components/migration/ForceReimportDialog.tsx` (+47, -0)
- `packages/kilo-vscode/webview-ui/src/components/migration/MigrationWizard.tsx` (+111, -34)
- `packages/kilo-vscode/webview-ui/src/components/migration/RunningMigrationDialog.tsx` (+40, -0)
- `packages/kilo-vscode/webview-ui/src/components/migration/SessionMigrationCard.tsx` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/components/migration/SessionMigrationProgress.tsx` (+102, -0)
- `packages/kilo-vscode/webview-ui/src/components/migration/SessionMigrationSummary.tsx` (+164, -0)
- `packages/kilo-vscode/webview-ui/src/components/migration/index.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/components/migration/migration.css` (+300, -0)
- `packages/kilo-vscode/webview-ui/src/components/migration/session-migration-format.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/components/migration/session-migration-summary-format.ts` (+49, -0)
- `packages/kilo-vscode/webview-ui/src/components/migration/session-migration-summary-state.ts` (+76, -0)
- `packages/kilo-vscode/webview-ui/src/context/language.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/context/session-agent.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+38, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+29, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+29, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+32, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+29, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+29, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages.ts` (+34, -4)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/file/ignore.ts` (+2, -0)
- `packages/opencode/src/kilocode/session-import/service.ts` (+27, -3)
- `packages/opencode/src/kilocode/session-import/types.ts` (+1, -0)
- `packages/opencode/src/snapshot/index.ts` (+23, -0)
- `packages/opencode/test/kilocode/session-import-service.test.ts` (+121, -0)
- `packages/opencode/test/kilocode/snapshot-cache.test.ts` (+81, -0)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+2, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+1, -0)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/components/popover.tsx` (+22, -0)
- `packages/ui/src/context/dialog.tsx` (+2, -0)
- `packages/ui/src/i18n/ar.ts` (+2, -0)
- `packages/ui/src/i18n/br.ts` (+2, -0)
- `packages/ui/src/i18n/bs.ts` (+2, -0)
- `packages/ui/src/i18n/da.ts` (+2, -0)
- `packages/ui/src/i18n/de.ts` (+2, -0)
- `packages/ui/src/i18n/en.ts` (+2, -0)
- `packages/ui/src/i18n/es.ts` (+2, -0)
- `packages/ui/src/i18n/fr.ts` (+2, -0)
- `packages/ui/src/i18n/ja.ts` (+2, -0)
- `packages/ui/src/i18n/ko.ts` (+2, -0)
- `packages/ui/src/i18n/nl.ts` (+2, -0)
- `packages/ui/src/i18n/no.ts` (+2, -0)
- `packages/ui/src/i18n/pl.ts` (+2, -0)
- `packages/ui/src/i18n/ru.ts` (+2, -0)
- `packages/ui/src/i18n/th.ts` (+2, -0)
- `packages/ui/src/i18n/tr.ts` (+2, -0)
- `packages/ui/src/i18n/uk.ts` (+2, -0)
- `packages/ui/src/i18n/zh.ts` (+2, -0)
- `packages/ui/src/i18n/zht.ts` (+2, -0)
- `packages/util/package.json` (+1, -1)
- `script/upstream/package.json` (+1, -1)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/opencode/src/agent/agent.ts
```diff
diff --git a/packages/opencode/src/agent/agent.ts b/packages/opencode/src/agent/agent.ts
index 8bfbe786..b88d031e 100644
--- a/packages/opencode/src/agent/agent.ts
+++ b/packages/opencode/src/agent/agent.ts
@@ -224,18 +224,20 @@ export namespace Agent {
       },
       plan: {
         name: "plan",
-        description: "Plan mode. Disallows all edit tools.",
+        description: "Plan mode. Only allows editing plan files; asks before editing anything else.",
         options: {},
         permission: PermissionNext.merge(
           defaults,
           PermissionNext.fromConfig({
             question: "allow",
             plan_exit: "allow",
+            bash: readOnlyBash, // kilocode_change: read-only bash for plan mode (mirrors ask agent)
+            ...mcpRules, // kilocode_change: MCP with user approval for plan mode
             external_directory: {
               [path.join(Global.Path.data, "plans", "*")]: "allow",
             },
             edit: {
-              "*": "deny",
+              "*": "ask", // kilocode_change: ask (not deny) so user can approve edits outside plan files
               [path.join(".kilo", "plans", "*.md")]: "allow", // kilocode_change
               [path.join(".opencode", "plans", "*.md")]: "allow", // kilocode_change: .opencode fallback
               [path.relative(Instance.worktree, path.join(Global.Path.data, path.join("plans", "*.md")))]: "allow",
```

#### packages/opencode/src/tool/task.ts
```diff
diff --git a/packages/opencode/src/tool/task.ts b/packages/opencode/src/tool/task.ts
index 7b7eafdc..a4cd8304 100644
--- a/packages/opencode/src/tool/task.ts
+++ b/packages/opencode/src/tool/task.ts
@@ -63,6 +63,26 @@ export const TaskTool = Tool.define("task", async (ctx) => {
 
       const allowsTask = agent.permission.some((rule) => rule.permission === "task" && rule.action === "allow") // kilocode_change
 
+      // kilocode_change start — inherit edit and bash restrictions from the calling agent so
+      // sub-agents cannot perform actions the parent agent is not allowed to perform.
+      // We merge the static agent definition with the current session's accumulated permissions
+      // so that restrictions survive multi-hop chains (plan → general → explore).
+      // Agent.get() gives the base definition; session.permission carries restrictions that
+      // were themselves inherited from a grandparent, so both sources are needed.
+      const caller = await Agent.get(ctx.agent)
+      const callerSession = await Session.get(ctx.sessionID)
+      const callerRules = PermissionNext.merge(caller?.permission ?? [], callerSession.permission ?? [])
+      // Build the set of MCP server prefixes (e.g. "servername_") so we can
+      // include both server-wide wildcards ("servername_*") and specific MCP tool
+      // permissions ("servername_create_issue") in the inherited ruleset.
+      // Same sanitisation logic as agent.ts.
+      const mcpPrefixes = Object.keys(config.mcp ?? {}).map((k) => k.replace(/[^a-zA-Z0-9_-]/g, "_") + "_")
+      const isMcpRule = (p: string) => mcpPrefixes.some((prefix) => p.startsWith(prefix))
+      const inherited = callerRules.filter(
+        (r) => r.permission === "edit" || r.permission === "bash" || isMcpRule(r.permission),
+      )
+      // kilocode_change end
+
       const session = await iife(async () => {
         if (params.task_id) {
           const found = await Session.get(params.task_id).catch(() => {})
@@ -97,6 +117,7 @@ export const TaskTool = Tool.define("task", async (ctx) => {
               action: "allow" as const,
               permission: t,
             })) ?? []),
+            ...inherited, // kilocode_change — propagate caller's edit and bash restrictions
           ],
         })
       })
```


## opencode Changes (3a0e00d..3c96bf8)

### Commits

- 3c96bf8 - feat(opencode): Add PDF attachment Drag and Drop (#16926) (gitpush-gitpaid, 2026-04-07)
- 3ea6413 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-04-07)
- 885df8e - feat: add --dangerously-skip-permissions flag to opencode run (#21266) (Aiden Cline, 2026-04-06)
- f4975ef - go: add mimo (Frank, 2026-04-07)
- 37883a9 - refactor(core): add full http proxy and change workspace adaptor interface (#21239) (James Long, 2026-04-06)
- 3c31d04 - chore: bump anthropic ai sdk pkg, delete patch (#21247) (Aiden Cline, 2026-04-06)
- e64548f - chore: update nix node_modules hashes (opencode-agent[bot], 2026-04-07)
- 31f6f43 - chore: remove ai-sdk/provider-utils patch and update pkg (#21245) (Aiden Cline, 2026-04-06)
- 090ad82 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-04-06)
- d1258ac - fix: bump openrouter ai sdk pkg to fix openrouter issues (#21242) (Aiden Cline, 2026-04-06)
- 48c1b6b - tweak: move the max token exclusions to plugins  @rekram1-node (#21225) (Aiden Cline, 2026-04-06)
- 40e4cd2 - tweak: adjust chat.params hook to allow altering of the maxOutputTokens (#21220) (Aiden Cline, 2026-04-06)
- 5a6d10c - tweak: ensure copilot anthropic models have same reasoning effort model as copilot cli, also fix qwen incorrectly having variants (#21212) (Aiden Cline, 2026-04-06)
- 527b514 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-04-06)
- 535343b - refactor(server): replace Bun serve with Hono node adapters (#18335) (Dax, 2026-04-06)
- 4394e42 - upgrade opentui to 0.1.97 (#21137) (Sebastian, 2026-04-06)
- 2e4c43c - refactor: replace Bun.serve with Node http.createServer in OAuth handlers (#18327) (Dax, 2026-04-06)
- 965c751 - docs: update Cloudflare provider setup to reflect /connect prompt flow (#20589) (MC, 2026-04-06)
- 24bdd3c - chore: generate (opencode-agent[bot], 2026-04-06)
- 01f0319 - fix(lsp): MEMORY LEAK: ensure typescript server uses native project config (#19953) (Derek Barrera, 2026-04-06)
- 517e6c9 - release: v1.3.17 (opencode, 2026-04-06)
- a4a9ea4 - fix(tui): revert kitty keyboard events workaround on windows (#20180) (Luke Parker, 2026-04-06)
- eaa272e - fix: show clear error when Cloudflare provider env vars are missing (#20399) (MC, 2026-04-06)
- 70b636a - zen: normalize ipv6 (Frank, 2026-04-06)
- a8fd015 - zen: remove header check (Frank, 2026-04-05)
- 342436d - release: v1.3.16 (opencode, 2026-04-06)
- 77a462c - fix(tui): default Ctrl+Z to undo on Windows (#21138) (Luke Parker, 2026-04-06)
- 9965d38 - fix: pass both 'openai' and 'azure' providerOptions keys for @ai-sdk/azure (#20272) (Corné Steenhuis, 2026-04-06)
- f0f1e51 - fix(core): implement proper configOptions for acp (#21134) (George Harker, 2026-04-05)
- 4712c18 - feat(tui): make the mouse disablable (#6824, #7926) (#13748) (Gautier DI FOLCO, 2026-04-05)
- 9e156ea - chore: update nix node_modules hashes (opencode-agent[bot], 2026-04-06)
- 68f4aa2 - fix(plugin): parse package specifiers with npm-package-arg and sanitize win32 cache paths (#21135) (Luke Parker, 2026-04-06)

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
- `packages/console/core/src/subscription.ts` (+0, -2)

#### Other Changes
- `bun.lock` (+171, -40)
- `nix/hashes.json` (+4, -4)
- `package.json` (+4, -4)
- `packages/app/package.json` (+1, -1)
- `packages/app/script/e2e-local.ts` (+3, -3)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/routes/workspace/[id]/go/lite-section.tsx` (+2, -0)
- `packages/console/app/src/routes/zen/util/handler.ts` (+2, -1)
- `packages/console/app/src/routes/zen/util/rateLimiter.ts` (+2, -3)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/mail/package.json` (+1, -1)
- `packages/desktop-electron/package.json` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/enterprise/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/function/package.json` (+1, -1)
- `packages/opencode/package.json` (+19, -6)
- `packages/opencode/script/build-node.ts` (+15, -0)
- `packages/opencode/script/fix-node-pty.ts` (+28, -0)
- `packages/opencode/src/acp/agent.ts` (+84, -0)
- `packages/opencode/src/auth/index.ts` (+1, -0)
- `packages/opencode/src/cli/cmd/acp.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/run.ts` (+22, -9)
- `packages/opencode/src/cli/cmd/serve.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/app.tsx` (+5, -1)
- `packages/opencode/src/cli/cmd/tui/component/dialog-provider.tsx` (+11, -1)
- `packages/opencode/src/cli/cmd/tui/component/prompt/index.tsx` (+26, -26)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/home/tips-view.tsx` (+4, -2)
- `packages/opencode/src/cli/cmd/web.ts` (+1, -1)
- `packages/opencode/src/config/tui-schema.ts` (+1, -0)
- `packages/opencode/src/config/tui.ts` (+9, -1)
- `packages/opencode/src/control-plane/adaptors/worktree.ts` (+6, -2)
- `packages/opencode/src/control-plane/types.ts` (+13, -2)
- `packages/opencode/src/control-plane/workspace.ts` (+16, -2)
- `packages/opencode/src/flag/flag.ts` (+1, -0)
- `packages/opencode/src/lsp/server.ts` (+11, -1)
- `packages/opencode/src/mcp/oauth-callback.ts` (+81, -80)
- `packages/opencode/src/npm/index.ts` (+7, -1)
- `packages/opencode/src/plugin/cloudflare.ts` (+67, -0)
- `packages/opencode/src/plugin/codex.ts` (+67, -55)
- `packages/opencode/src/plugin/github-copilot/copilot.ts` (+8, -0)
- `packages/opencode/src/plugin/index.ts` (+11, -2)
- `packages/opencode/src/plugin/shared.ts` (+22, -6)
- `packages/opencode/src/provider/provider.ts` (+38, -7)
- `packages/opencode/src/provider/transform.ts` (+9, -5)
- `packages/opencode/src/pty/index.ts` (+13, -17)
- `packages/opencode/src/pty/pty.bun.ts` (+26, -0)
- `packages/opencode/src/pty/pty.node.ts` (+27, -0)
- `packages/opencode/src/pty/pty.ts` (+25, -0)
- `packages/opencode/src/server/instance.ts` (+4, -3)
- `packages/opencode/src/server/proxy.ts` (+130, -0)
- `packages/opencode/src/server/router.ts` (+68, -62)
- `packages/opencode/src/server/routes/pty.ts` (+6, -7)
- `packages/opencode/src/server/server.ts` (+91, -50)
- `packages/opencode/src/session/llm.ts` (+2, -6)
- `packages/opencode/test/config/tui.test.ts` (+48, -0)
- `packages/opencode/test/lsp/index.test.ts` (+78, -0)
- `packages/opencode/test/npm.test.ts` (+18, -0)
- `packages/opencode/test/plugin/shared.test.ts` (+88, -0)
- `packages/opencode/test/session/llm.test.ts` (+7, -10)
- `packages/plugin/package.json` (+5, -5)
- `packages/plugin/src/index.ts` (+7, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+3, -0)
- `packages/sdk/openapi.json` (+9, -0)
- `packages/slack/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/util/package.json` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/cli.mdx` (+1, -0)
- `packages/web/src/content/docs/config.mdx` (+2, -3)
- `packages/web/src/content/docs/ecosystem.mdx` (+2, -0)
- `packages/web/src/content/docs/providers.mdx` (+43, -26)
- `packages/web/src/content/docs/tui.mdx` (+3, -1)
- `patches/@ai-sdk%2Fanthropic@3.0.64.patch` (+0, -119)
- `patches/@ai-sdk%2Fprovider-utils@4.0.21.patch` (+0, -61)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 3a1fa33..ae5185e 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.3.15",
+  "version": "1.3.17",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/console/core/src/subscription.ts
```diff
diff --git a/packages/console/core/src/subscription.ts b/packages/console/core/src/subscription.ts
index 9d6c3ce..bee5818 100644
--- a/packages/console/core/src/subscription.ts
+++ b/packages/console/core/src/subscription.ts
@@ -9,8 +9,6 @@ export namespace Subscription {
     free: z.object({
       promoTokens: z.number().int(),
       dailyRequests: z.number().int(),
-      checkHeader: z.string(),
-      fallbackValue: z.number().int(),
     }),
     lite: z.object({
       rollingLimit: z.number().int(),
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/agent.ts
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/tool/task.ts changes
