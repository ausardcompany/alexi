# Upstream Changes Report
Generated: 2026-03-30 07:44:23

## Summary
- kilocode: 80 commits, 116 files changed
- opencode: 80 commits, 291 files changed

## kilocode Changes (121f6e3c..32a2fb9d)

### Commits

- 32a2fb9d - Merge pull request #7902 from Kilo-Org/mark/fix-exa-open-url (Mark IJbema, 2026-03-30)
- 43bfeef8 - fix(ui): open Exa search result links via openUrl in VS Code webview (Mark IJbema, 2026-03-30)
- f824868a - Merge pull request #7716 from Kilo-Org/feat/screenshot-test-mcp-edit-view (Mark IJbema, 2026-03-30)
- dfb5a632 - Merge branch 'main' into feat/screenshot-test-mcp-edit-view (Mark IJbema, 2026-03-30)
- 31d18eb2 - Merge pull request #7842 from Kilo-Org/session/agent_3b8192c9-9812-4c25-8772-84571066e85b (Kirill Kalishev, 2026-03-29)
- 3e201e4f - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-03-28)
- be1f54ec - fix(skills): prevent right-side crop in visual regression stories (kiloconnect[bot], 2026-03-28)
- 4e17db82 - fix(vscode): remove fixed width from McpEditView stories to prevent right-side crop (kiloconnect[bot], 2026-03-28)
- f4174e84 - fix(vscode): replace opencode references with kilo.jsonc in MCP empty state i18n strings (kiloconnect[bot], 2026-03-28)
- 43811bfa - release: v7.1.9 (kilo-maintainer[bot], 2026-03-28)
- eeebbd26 - Merge pull request #7825 from Kilo-Org/kirillk/fix-kilo-migration-auth (Kirill Kalishev, 2026-03-27)
- 271d8295 - Merge pull request #7823 from Kilo-Org/kirillk/migration-wizard (Kirill Kalishev, 2026-03-27)
- 8a2296ea - fix(vscode): write Kilo auth as OAuth during legacy migration (kirillk, 2026-03-27)
- 3348fc11 - Merge pull request #7504 from Kilo-Org/docs/code-with-ai-agents-tabs (Joshua Lambert, 2026-03-27)
- cdd46fe7 - docs(kilo-docs): address bot review — orchestrator deprecation notes (Josh Lambert, 2026-03-27)
- 0262ab18 - fix(vscode): add onMigrationComplete to mock connectionService in test (kirillk, 2026-03-27)
- 742b2cff - merge: resolve conflict with main in setup-authentication.md (Josh Lambert, 2026-03-27)
- dc885fcc - Merge branch 'main' into kirillk/migration-wizard (Kirill Kalishev, 2026-03-27)
- b05c367f - fix(vscode): fix migration wizard race condition preventing sidebar display (kirillk, 2026-03-27)
- a0e1fd82 - feat(vscode): add settings export/import to About tab (#7794) (Marius, 2026-03-27)
- 57aa3396 - fix(agent-manager): align diff panel file order with file tree (#7779) (Marius, 2026-03-27)
- b38aeccf - feat(vscode): auto-detect models for custom OpenAI-compatible providers (#7793) (Marius, 2026-03-27)
- 8102d801 - fix(cli): gate Kilo API calls behind enabled_providers to prevent data leaks (#7813) (Marius, 2026-03-27)
- 9cf83d81 - fix(cli): make FreeUsageLimitError non-retryable to prevent unrecoverable backoff loop (#7809) (Marius, 2026-03-27)
- b91627e1 - feat(vscode): add always-visible diff badge to sidebar (#7795) (Marius, 2026-03-27)
- a9b16125 - fix(sdk): add duplex: half to fix fetch in Node.js/Electron environments (#7811) (Marius, 2026-03-27)
- 2e056a54 - Merge pull request #7797 from Kilo-Org/fix/agent-manager-recover-serve-restart (Marian Alexandru Alecu, 2026-03-27)
- dc00cfc4 - fix(agent-manager): isolate prompt input drafts per pending tab (#7798) (Marius, 2026-03-27)
- 7fa25e74 - fix(vscode): recover agent manager after server restarts (Alex Alecu, 2026-03-27)
- 5072e2ba - Apply suggestions from code review (Joshua Lambert, 2026-03-27)
- af2f11a2 - Apply suggestions from code review (Joshua Lambert, 2026-03-27)
- 72291dd3 - Apply suggestions from code review (Joshua Lambert, 2026-03-27)
- d4dfa985 - Merge pull request #7777 from Kilo-Org/fix/7757-stale-session-status-reconciliation (Marian Alexandru Alecu, 2026-03-27)
- e444e9cc - Apply suggestion from @lambertjosh (Joshua Lambert, 2026-03-27)
- 3bd1ac44 - Update packages/kilo-docs/pages/code-with-ai/agents/using-agents.md (Joshua Lambert, 2026-03-27)
- 2fbd5cc5 - Update packages/kilo-docs/pages/code-with-ai/agents/using-agents.md (Joshua Lambert, 2026-03-27)
- 49bb16ca - Merge pull request #7733 from Kilo-Org/eshurakov/actually-afterthought (Evgeny Shurakov, 2026-03-27)
- 8107c5e0 - Merge pull request #7786 from Kilo-Org/session/agent_ebd83d52-2a54-4aa9-a87d-51fa777821ff (Remon Oldenbeuving, 2026-03-27)
- e698c8b7 - docs: switch shield badges to raster.shields.io (kiloconnect[bot], 2026-03-27)
- 5da33a87 - Merge pull request #7772 from Kilo-Org/update-small-model-description (Mark IJbema, 2026-03-27)
- 9d8711a6 - fix(vscode): guard reconciliation on valid data (Alex Alecu, 2026-03-27)
- 7daf66a3 - fix(vscode): reconcile stale session statuses on reconnect (Alex Alecu, 2026-03-27)
- 181c97e6 - test(vscode): add failing tests for stale session status reconciliation (Alex Alecu, 2026-03-27)
- 3445ce86 - Merge pull request #7773 from Kilo-Org/fix/cli-empty-tool-calls-loop (Marian Alexandru Alecu, 2026-03-27)
- 05a82b37 - fix(cli): prevent infinite loop on empty tool-calls (#7756) (Alex Alecu, 2026-03-27)
- 7038bce2 - fix(i18n): update small model description to mention commit message generation and prompt enhancement (kiloconnect[bot], 2026-03-27)
- a84edc32 - test(cli): add failing test for empty tool-calls loop (#7756) (Alex Alecu, 2026-03-27)
- e4f985ed - fix(vscode): remove unnecessary TABS allowlist from Settings (#7766) (Marius, 2026-03-27)
- 536f7f9e - Merge pull request #7603 from Kilo-Org/feat/builtin-config-skill (Marian Alexandru Alecu, 2026-03-27)
- f71909c9 - Merge pull request #7573 from Kilo-Org/feat/config-permission-protection (Marian Alexandru Alecu, 2026-03-27)
- 31aef067 - fix(vscode): remove unimplemented Terminal and Prompts settings tabs (#7763) (Marius, 2026-03-27)
- 38e0621b - feat(cli): add TUI settings reference to kilo-config skill (Alex Alecu, 2026-03-27)
- d904bc7d - fix(cli): guard builtin skill removal after lookup (Alex Alecu, 2026-03-27)
- 2485dc92 - docs(cli): fix managed config paths for all platforms (Alex Alecu, 2026-03-27)
- 61170cea - fix(cli): reject removal of built-in skills (Alex Alecu, 2026-03-27)
- 726a60ce - Merge branch 'main' into feat/builtin-config-skill (Marian Alexandru Alecu, 2026-03-27)
- e4600cd8 - fix(cli): normalize paths to prevent .. bypass (Alex Alecu, 2026-03-27)
- d92ea980 - Merge branch 'main' into feat/config-permission-protection (Marian Alexandru Alecu, 2026-03-27)
- 97e704d9 - docs(kilo-docs): remove F2 keybind from model selection (Josh Lambert, 2026-03-26)
- f6f5c56d - docs(kilo-docs): mark orchestrator as deprecated, add CLI model precedence (Josh Lambert, 2026-03-26)
- b85fb80c - docs(kilo-docs): fix broken anchor links and redirect chain (Josh Lambert, 2026-03-26)
- 4f5466d0 - feat(cli): include parentSessionId in heartbeat session info (Evgeny Shurakov, 2026-03-26)
- c44e53d9 - docs(kilo-docs): address review feedback — rename to agents, rewrite orchestrator, fix content (Josh Lambert, 2026-03-26)
- 97bad6d8 - fix(cli): exempt plan files and protect global config dir from silent access (Alex Alecu, 2026-03-26)
- e8558705 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-03-26)
- 59165176 - test(vscode): add screenshot stories for McpEditView (kiloconnect[bot], 2026-03-26)
- 2dba6852 - refactor(cli): extract helpers to reduce duplication (Alex Alecu, 2026-03-26)
- a2151478 - fix(cli): check movePath in apply_patch config guard (Alex Alecu, 2026-03-26)
- 6105e356 - fix(cli): detect nested config dirs in isRelative (Alex Alecu, 2026-03-26)
- ed03c647 - Merge branch 'main' into feat/config-permission-protection (Marian Alexandru Alecu, 2026-03-26)
- 8be2a522 - docs(kilo-docs): fix kiloCodeIcon tag name and orchestrator 'modes' wording (Josh Lambert, 2026-03-26)
- 9487b5fc - Update packages/kilo-docs/pages/code-with-ai/agents/chat-interface.md (Joshua Lambert, 2026-03-26)
- 3ccd762c - docs(kilo-docs): address review comments on code-with-ai/agents tabs (Josh Lambert, 2026-03-26)
- 284094a3 - docs(kilo-docs): reorder tabs to VSCode → CLI → Legacy, fix combined tabs and wording (Josh Lambert, 2026-03-25)
- df29396d - feat(cli): add built-in kilo-config skill for on-demand config reference (Alex Alecu, 2026-03-25)
- c2969d29 - fix(cli): close absolute-path bypass and extract DISABLE_ALWAYS_KEY constant (Alex Alecu, 2026-03-25)
- 21902b1d - feat(cli): hide 'Always allow' in TUI for config file edits (Alex Alecu, 2026-03-25)
- 2455a437 - feat(cli): force permission prompt for config file edits (Alex Alecu, 2026-03-25)
- 6e3d227f - feat(cli): add config path detection for permission protection (Alex Alecu, 2026-03-25)
- 57d378e0 - docs(kilo-docs): add platform tabs to code-with-ai agents pages (Josh Lambert, 2026-03-24)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/skill.ts` (+33, -7)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
- `packages/opencode/src/kilocode/permission/config-paths.ts` (+129, -0)
- `packages/opencode/src/kilocode/permission/drain.ts` (+3, -0)
- `packages/opencode/src/permission/next.ts` (+22, -1)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/kilo-docs/pages/code-with-ai/agents/orchestrator-mode.md` (+25, -27)

#### Other Changes
- `.kilocode/skills/vscode-visual-regression/SKILL.md` (+3, -2)
- `README.md` (+5, -5)
- `bun.lock` (+16, -16)
- `package.json` (+1, -1)
- `packages/app/package.json` (+1, -1)
- `packages/desktop-electron/package.json` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/kilo-docs/lib/nav/code-with-ai.ts` (+3, -3)
- `packages/kilo-docs/markdoc/partials/install-jetbrains.md` (+1, -1)
- `packages/kilo-docs/markdoc/partials/install-vscode.md` (+1, -1)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/agents/auto-model.md` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/agents/chat-interface.md` (+107, -21)
- `packages/kilo-docs/pages/code-with-ai/agents/context-mentions.md` (+89, -0)
- `packages/kilo-docs/pages/code-with-ai/agents/free-and-budget-models.md` (+3, -3)
- `packages/kilo-docs/pages/code-with-ai/agents/model-selection.md` (+27, -0)
- `packages/kilo-docs/pages/code-with-ai/agents/using-agents.md` (+263, -0)
- `packages/kilo-docs/pages/code-with-ai/agents/using-modes.md` (+0, -121)
- `packages/kilo-docs/pages/code-with-ai/index.md` (+2, -2)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli.md` (+1, -1)
- `packages/kilo-docs/pages/collaborate/teams/custom-modes-org.md` (+2, -2)
- `packages/kilo-docs/pages/customize/custom-subagents.md` (+1, -1)
- `packages/kilo-docs/pages/customize/workflows.md` (+1, -1)
- `packages/kilo-docs/pages/getting-started/quickstart.md` (+2, -2)
- `packages/kilo-docs/previous-docs-redirects.js` (+7, -1)
- `packages/kilo-docs/source-links.md` (+0, -1)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/message-part.tsx` (+10, -7)
- `packages/kilo-vscode/README.md` (+5, -5)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+97, -5)
- `packages/kilo-vscode/src/extension.ts` (+1, -1)
- `packages/kilo-vscode/src/kilo-provider/handlers/migration.ts` (+10, -4)
- `packages/kilo-vscode/src/legacy-migration/migration-service.ts` (+18, -0)
- `packages/kilo-vscode/src/services/cli-backend/connection-service.ts` (+22, -0)
- `packages/kilo-vscode/src/session-status.ts` (+13, -1)
- `packages/kilo-vscode/src/shared/fetch-models.ts` (+66, -0)
- `packages/kilo-vscode/tests/unit/file-tree.test.ts` (+108, -12)
- `packages/kilo-vscode/tests/unit/kilo-provider-session-refresh.test.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/session-status.test.ts` (+170, -0)
- `packages/kilo-vscode/tests/unit/settings-io.test.ts` (+397, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/settings/mcp-edit-view-local-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/settings/mcp-edit-view-local-with-env-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/settings/mcp-edit-view-remote-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/DiffPanel.tsx` (+6, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/FullScreenDiffView.tsx` (+6, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/file-tree-utils.ts` (+29, -0)
- `packages/kilo-vscode/webview-ui/src/App.tsx` (+56, -63)
- `packages/kilo-vscode/webview-ui/src/components/chat/ChatView.tsx` (+18, -5)
- `packages/kilo-vscode/webview-ui/src/components/migration/migration.css` (+3, -2)
- `packages/kilo-vscode/webview-ui/src/components/settings/AboutKiloCodeTab.tsx` (+117, -2)
- `packages/kilo-vscode/webview-ui/src/components/settings/AgentBehaviourTab.tsx` (+0, -15)
- `packages/kilo-vscode/webview-ui/src/components/settings/CustomProviderDialog.tsx` (+392, -20)
- `packages/kilo-vscode/webview-ui/src/components/settings/PromptsTab.tsx` (+0, -33)
- `packages/kilo-vscode/webview-ui/src/components/settings/ProvidersTab.tsx` (+22, -4)
- `packages/kilo-vscode/webview-ui/src/components/settings/Settings.tsx` (+3, -18)
- `packages/kilo-vscode/webview-ui/src/components/settings/TerminalTab.tsx` (+0, -33)
- `packages/kilo-vscode/webview-ui/src/components/settings/settings-io.ts` (+130, -0)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+31, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+34, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+33, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+32, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+35, -8)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+31, -9)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+35, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+34, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+33, -8)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+32, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+32, -9)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+32, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+33, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+32, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+31, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+31, -9)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+28, -8)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+28, -7)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/stories/settings.stories.tsx` (+68, -0)
- `packages/kilo-vscode/webview-ui/src/styles/chat.css` (+43, -13)
- `packages/kilo-vscode/webview-ui/src/types/messages.ts` (+53, -1)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/acp/agent.ts` (+10, -2)
- `packages/opencode/src/cli/cmd/tui/routes/session/permission.tsx` (+8, -1)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+1, -0)
- `packages/opencode/src/kilo-sessions/remote-protocol.ts` (+1, -0)
- `packages/opencode/src/kilocode/skills/builtin.ts` (+21, -0)
- `packages/opencode/src/kilocode/skills/kilo-config.md` (+211, -0)
- `packages/opencode/src/md.d.ts` (+4, -0)
- `packages/opencode/src/provider/models.ts` (+9, -2)
- `packages/opencode/src/server/routes/config.ts` (+10, -4)
- `packages/opencode/src/session/processor.ts` (+7, -0)
- `packages/opencode/src/session/retry.ts` (+5, -2)
- `packages/opencode/src/skill/skill.ts` (+20, -0)
- `packages/opencode/test/kilo-sessions/remote-protocol.test.ts` (+12, -0)
- `packages/opencode/test/kilocode/session-processor-empty-tool-calls.test.ts` (+229, -0)
- `packages/opencode/test/session/retry.test.ts` (+10, -0)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/client.ts` (+5, -0)
- `packages/sdk/js/src/v2/client.ts` (+5, -0)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/util/package.json` (+1, -1)
- `script/upstream/package.json` (+1, -1)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/kilo-docs/pages/code-with-ai/agents/orchestrator-mode.md
```diff
diff --git a/packages/kilo-docs/pages/code-with-ai/agents/orchestrator-mode.md b/packages/kilo-docs/pages/code-with-ai/agents/orchestrator-mode.md
index 9fca04b8..8fb065bc 100644
--- a/packages/kilo-docs/pages/code-with-ai/agents/orchestrator-mode.md
+++ b/packages/kilo-docs/pages/code-with-ai/agents/orchestrator-mode.md
@@ -1,42 +1,40 @@
 ---
 title: "Orchestrator Mode"
-description: "Using Orchestrator mode for complex multi-step tasks"
+description: "Orchestrator mode is no longer needed — agents with full tool access now support subagents natively"
 ---
 
-# Orchestrator Mode: Coordinate Complex Workflows
+# Orchestrator Mode (Deprecated)
 
-Orchestrator Mode (formerly known as Boomerang Tasks) allows you to break down complex projects into smaller, manageable pieces. Think of it like delegating parts of your work to specialized assistants. Each subtask runs in its own context, often using a different Kilo Code mode tailored for that specific job (like [`code`](/docs/code-with-ai/agents/using-modes#code-mode-default), [`architect`](/docs/code-with-ai/agents/using-modes#architect-mode), or [`debug`](/docs/code-with-ai/agents/using-modes#debug-mode)).
+{% callout type="warning" title="Deprecated — scheduled for removal" %}
+Orchestrator mode is deprecated and will be removed in a future release. In the VSCode extension and CLI, **agents with full tool access (Code, Plan, Debug) can now delegate to subagents automatically**. You no longer need a dedicated orchestrator — just pick the agent for your task and it will coordinate subagents when helpful. (Read-only agents like Ask do not support delegation.)
+{% /callout %}
 
-{% youtube url="https://www.youtube.com/watch?v=20MmJNeOODo" caption="Orchestrator Mode explained and demonstrated" /%}
+## What Changed
 
-## Why Use Orchestrator Mode?
+Previously, orchestrator mode was the only way to break complex tasks into subtasks. You had to explicitly switch to orchestrator mode, which would then delegate work to other modes like Code or Architect.
 
-- **Tackle Complexity:** Break large, multi-step projects (e.g., building a full feature) into focused subtasks (e.g., design, implementation, documentation).
-- **Use Specialized Modes:** Automatically delegate subtasks to the mode best suited for that specific piece of work, leveraging specialized capabilities for optimal results.
-- **Maintain Focus & Efficiency:** Each subtask operates in its own isolated context with a separate conversation history. This prevents the parent (orchestrator) task from becoming cluttered with the detailed execution steps (like code diffs or file analysis results), allowing it to focus efficiently on the high-level workflow and manage the overall process based on concise summaries from completed subtasks.
-- **Streamline Workflows:** Results from one subtask can be automatically passed to the next, creating a smooth flow (e.g., architectural decisions feeding into the coding task).
+Now, **subagent support is built into agents that have full tool access** (Code, Plan, Debug). When one of these agents encounters a task that would benefit from delegation — like exploring a codebase, running a parallel search, or handling a subtask in isolation — it can launch a subagent directly using the `task` tool. There's no need to switch agents first.
 
-## How It Works
+## What You Should Do
 
-1.  Using Orchestrator Mode, Kilo can analyze a complex task and suggest breaking it down into a subtask.
-2.  The parent task pauses, and the new subtask begins in a different mode.
-3.  When the subtask's goal is achieved, Kilo signals completion.
-4.  The parent task resumes with only the summary of the subtask. The parent uses this summary to continue the main workflow.
+- **Just pick the right agent for your task.** Use Code for implementation, Plan for architecture, Debug for troubleshooting. Each will orchestrate subagents where it makes sense.
+- **Add custom subagents** if you want specialized delegation behavior. See [Custom Subagents](/docs/customize/custom-subagents) for details.
+- **Stop switching to orchestrator mode** before complex tasks. Your current agent already has that capability.
 
-## Key Considerations
+## How Subagents Work
 
-- **Approval Required:** By default, you must approve the creation and completion of each subtask. This can be automated via the [Auto-Approving Actions](/docs/getting-started/settings/auto-approving-actions#subtasks) settings if desired.
-- **Context Isolation and Transfer:** Each subtask operates in complete isolation with its own conversation history. It does not automatically inherit the parent's context. Information must be explicitly passed:
-  - **Down:** Via the initial instructions provided when the subtask is created.
-  - **Up:** Via the final summary provided when the subtask finishes. Be mindful that only this summary returns to the parent.
-- **Navigation:** Kilo's interface helps you see the hierarchy of tasks (which task is the parent, which are children). You can typically navigate between active and paused tasks.
```

#### packages/opencode/src/kilocode/permission/config-paths.ts
```diff
diff --git a/packages/opencode/src/kilocode/permission/config-paths.ts b/packages/opencode/src/kilocode/permission/config-paths.ts
new file mode 100644
index 00000000..facd7098
--- /dev/null
+++ b/packages/opencode/src/kilocode/permission/config-paths.ts
@@ -0,0 +1,129 @@
+import path from "path"
+import { Global } from "@/global"
+import { KilocodePaths } from "@/kilocode/paths"
+
+export namespace ConfigProtection {
+  /**
+   * Config directory prefixes (relative paths, forward-slash normalized).
+   * Matches .kilo/, .kilocode/, .opencode/ at any depth within the project.
+   */
+  const CONFIG_DIRS = [".kilo/", ".kilocode/", ".opencode/"]
+
+  /**
+   * Subdirectories under CONFIG_DIRS that are NOT config files (e.g. plan files).
+   * Paths under these subdirs are exempt from config protection.
+   */
+  const EXCLUDED_SUBDIRS = ["plans/"]
+
+  /**
+   * Root-level config files that must be protected.
+   * Matched only when the relative path has no directory component.
+   */
+  const CONFIG_ROOT_FILES = new Set(["kilo.json", "kilo.jsonc", "opencode.json", "opencode.jsonc", "AGENTS.md"])
+
+  /** Metadata key used to signal the UI to hide the "Allow always" option. */
+  export const DISABLE_ALWAYS_KEY = "disableAlways" as const
+
+  function normalize(p: string): string {
+    return path.posix.normalize(p.replaceAll("\\", "/"))
+  }
+
+  /** Return the remainder after the config dir prefix, or undefined if excluded. */
+  function excluded(remainder: string): boolean {
+    return EXCLUDED_SUBDIRS.some((sub) => remainder.startsWith(sub))
+  }
+
+  /** Check if a project-relative path points to a config file or directory. */
+  export function isRelative(pattern: string): boolean {
+    const normalized = normalize(pattern)
+    for (const dir of CONFIG_DIRS) {
+      const bare = dir.slice(0, -1) // e.g. ".kilo"
+      // Match at root (e.g. ".kilo/foo") or nested (e.g. "packages/sub/.kilo/foo")
+      if (normalized === bare || normalized.endsWith("/" + bare)) return true
+      if (normalized.startsWith(dir)) {
+        if (excluded(normalized.slice(dir.length))) continue
```

#### packages/opencode/src/kilocode/permission/drain.ts
```diff
diff --git a/packages/opencode/src/kilocode/permission/drain.ts b/packages/opencode/src/kilocode/permission/drain.ts
index 608932a4..cfd6949c 100644
--- a/packages/opencode/src/kilocode/permission/drain.ts
+++ b/packages/opencode/src/kilocode/permission/drain.ts
@@ -1,6 +1,7 @@
 import { Bus } from "@/bus"
 import { Wildcard } from "@/util/wildcard"
 import type { PermissionNext } from "@/permission/next"
+import { ConfigProtection } from "@/kilocode/permission/config-paths"
 
 /**
  * Auto-resolve pending permissions now fully covered by approved or denied rules.
@@ -25,6 +26,8 @@ export async function drainCovered(
 ) {
   for (const [id, entry] of Object.entries(pending)) {
     if (id === exclude) continue
+    // Never auto-resolve config file edit permissions
+    if (ConfigProtection.isRequest(entry.info)) continue
     const actions = entry.info.patterns.map((pattern) =>
       evaluate(entry.info.permission, pattern, entry.ruleset, approved),
     )
```

#### packages/opencode/src/permission/next.ts
```diff
diff --git a/packages/opencode/src/permission/next.ts b/packages/opencode/src/permission/next.ts
index 5534572d..b68fafd1 100644
--- a/packages/opencode/src/permission/next.ts
+++ b/packages/opencode/src/permission/next.ts
@@ -9,6 +9,7 @@ import { fn } from "@/util/fn"
 import { Log } from "@/util/log"
 import { Wildcard } from "@/util/wildcard"
 import { drainCovered } from "@/kilocode/permission/drain" // kilocode_change
+import { ConfigProtection } from "@/kilocode/permission/config-paths" // kilocode_change
 import os from "os"
 import z from "zod"
 
@@ -188,18 +189,27 @@ export namespace PermissionNext {
     async (input) => {
       const s = await state()
       const { ruleset, ...request } = input
+      // kilocode_change start — force "ask" for config file edits
+      const protected_ = ConfigProtection.isRequest(request)
+      // kilocode_change end
       for (const pattern of request.patterns ?? []) {
         const rule = evaluate(request.permission, pattern, ruleset, s.approved)
         log.info("evaluated", { permission: request.permission, pattern, action: rule })
         if (rule.action === "deny")
           throw new DeniedError(ruleset.filter((r) => Wildcard.match(request.permission, r.permission)))
-        if (rule.action === "ask") {
+        // kilocode_change start — override "allow" to "ask" for config paths
+        if (rule.action === "ask" || (rule.action === "allow" && protected_)) {
           const id = input.id ?? Identifier.ascending("permission")
           return new Promise<void>((resolve, reject) => {
             const info: Request = {
               id,
               ...request,
+              metadata: {
+                ...request.metadata,
+                ...(protected_ ? { [ConfigProtection.DISABLE_ALWAYS_KEY]: true } : {}),
+              },
             }
+            // kilocode_change end
             s.pending[id] = {
               info,
               ruleset, // kilocode_change
@@ -227,6 +237,10 @@ export namespace PermissionNext {
       const existing = s.pending[input.requestID]
       if (!existing) throw new NotFoundError({ message: `Permission request ${input.requestID} not found` })
 
+      // kilocode_change start — skip rule persistence for config file edits
+      if (ConfigProtection.isRequest(existing.info)) return
+      // kilocode_change end
+
       // Combine metadata.rules (bash hierarchy) and always (all tools).
```

#### packages/opencode/src/tool/skill.ts
```diff
diff --git a/packages/opencode/src/tool/skill.ts b/packages/opencode/src/tool/skill.ts
index 8fcfb592..b092c6e8 100644
--- a/packages/opencode/src/tool/skill.ts
+++ b/packages/opencode/src/tool/skill.ts
@@ -7,6 +7,8 @@ import { PermissionNext } from "../permission/next"
 import { Ripgrep } from "../file/ripgrep"
 import { iife } from "@/util/iife"
 
+const BUILTIN = Skill.BUILTIN_LOCATION // kilocode_change
+
 export const SkillTool = Tool.define("skill", async (ctx) => {
   const skills = await Skill.all()
 
@@ -35,13 +37,18 @@ export const SkillTool = Tool.define("skill", async (ctx) => {
           "Invoke this tool to load a skill when a task matches one of the available skills listed below:",
           "",
           "<available_skills>",
-          ...accessibleSkills.flatMap((skill) => [
-            `  <skill>`,
-            `    <name>${skill.name}</name>`,
-            `    <description>${skill.description}</description>`,
-            `    <location>${pathToFileURL(skill.location).href}</location>`,
-            `  </skill>`,
-          ]),
+          // kilocode_change start - guard pathToFileURL for builtin skills
+          ...accessibleSkills.flatMap((skill) => {
+            const loc = skill.location === BUILTIN ? BUILTIN : pathToFileURL(skill.location).href
+            return [
+              `  <skill>`,
+              `    <name>${skill.name}</name>`,
+              `    <description>${skill.description}</description>`,
+              `    <location>${loc}</location>`,
+              `  </skill>`,
+            ]
+          }),
+          // kilocode_change end
           "</available_skills>",
         ].join("\n")
 
@@ -73,6 +80,25 @@ export const SkillTool = Tool.define("skill", async (ctx) => {
         metadata: {},
       })
 
+      // kilocode_change start - built-in skills have no filesystem directory
+      if (skill.location === BUILTIN) {
+        return {
+          title: `Loaded skill: ${skill.name}`,
+          output: [
+            `<skill_content name="${skill.name}">`,
+            `# Skill: ${skill.name}`,
```


## opencode Changes (7715252..47d2ab1)

### Commits

- 47d2ab1 - release: v1.3.7 (opencode, 2026-03-30)
- 186af27 - make variant modal less annoying (#19998) (Luke Parker, 2026-03-30)
- 6926fe1 - fix: stabilize release changelog generation (#19987) (Luke Parker, 2026-03-30)
- ee018d5 - docs: rename patch tool to apply_patch and clarify apply_patch behavior (#19979) (Chris Yang, 2026-03-29)
- 0465579 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-03-30)
- 196a03c - fix: discourage _noop tool call during LiteLLM compaction (#18539) (Knut Zuidema, 2026-03-29)
- b234370 - feat(windows): add first-class pwsh/powershell support (#16069) (Luke Parker, 2026-03-30)
- 5d2dc88 - theme colors for dialog textarea placeholders (#19939) (Sebastian, 2026-03-29)
- 0b1018f - plugins installs should preserve jsonc comments (#19938) (Sebastian, 2026-03-29)
- afb6abf - fix: ensure OPENCODE_DISABLE_CLAUDE_CODE_PROMPT is respected for project lvl CLAUDE.md (#19924) (Aiden Cline, 2026-03-29)
- e7f94f9 - release: v1.3.6 (opencode, 2026-03-29)
- 72c77d0 - fix(session): fix token usage double-counting w/ anthropic & bedrock due to AI SDK v6 upgrade (#19758) (ualtinok, 2026-03-29)
- 5c15755 - docs: add question tool to available permissions list (#19922) (Ariane Emory, 2026-03-29)
- 3a4bfeb - wip: zen (Frank, 2026-03-29)
- 1037c72 - wip: zen (Frank, 2026-03-29)
- ba00e9a - Fix variant dialog filtering (#19917) (Kit Langton, 2026-03-29)
- 963dad7 - ci: fix (Frank, 2026-03-29)
- 7e9b721 - wip: zen (Frank, 2026-03-29)
- a5b1dc0 - test: add regression coverage for sync plugin hooks (#19589) (Luke Parker, 2026-03-29)
- 0bc2f99 - release: v1.3.5 (opencode, 2026-03-29)
- 55895d0 - core: fix plugin hooks to properly handle async operations ensuring plugins can execute async code without errors (#19586) (Aiden Cline, 2026-03-29)
- 72cb9df - tweak: adjust gpt prompt to be more minimal, fix file reference annoyances (#19585) (Aiden Cline, 2026-03-28)
- f0a9075 - release: v1.3.4 (opencode, 2026-03-29)
- fee1e25 - ci: cancel stale nix-hashes runs (#19571) (Luke Parker, 2026-03-29)
- a94ac5a - zen: ZDR policy (Frank, 2026-03-28)
- 62ac45a - wip: zen (Frank, 2026-03-28)
- f7c2ef8 - wip: zen (Frank, 2026-03-28)
- 6639f92 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-03-29)
- 36aeb32 - ignore: kill todo (#19566) (Aiden Cline, 2026-03-29)
- ff37d7c - fix: nix embedded web-ui support (#19561) (Caleb Norton, 2026-03-28)
- 4f96eb2 - fix: respect semver build identifiers for nix (#11915) (Caleb Norton, 2026-03-28)
- 38af99d - prompt slot (#19563) (Sebastian, 2026-03-29)
- 772059a - chore: update nix node_modules hashes (opencode-agent[bot], 2026-03-28)
- 1f290fc - fix: update opencode-gitlab-auth to 2.0.1 (#19552) (Vladimir Glafirov, 2026-03-28)
- 77d4f99 - use theme color for prompt placeholder (#19535) (Sebastian, 2026-03-28)
- aa2d753 - feat: dialog variant menu and subagent improvements (#19537) (Dax, 2026-03-28)
- 860531c - refactor(session): effectify session processor (#19485) (Kit Langton, 2026-03-28)
- 2b86b36 - feat: open dialog for model variant selection instead of cycling (#19534) (Dax, 2026-03-28)
- 8ac2fbb - kv theme before default fallback (#19523) (Sebastian, 2026-03-28)
- 26382c6 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-03-28)
- 0981b8e - chore: generate (opencode-agent[bot], 2026-03-28)
- aa9ed00 - refactor(file): use AppFileSystem instead of raw Filesystem (#19458) (Kit Langton, 2026-03-28)
- 6086072 - upgrade opentui to 0.1.91 (#19440) (Sebastian, 2026-03-28)
- 6c14ea1 - tweak(session): add top spacing and remove obsolete docs prompt (Dax Raad, 2026-03-28)
- c3a9ec4 - fix: restore subagent footer and fix style guide violations (#19491) (Dax, 2026-03-28)
- 41b0d03 - feat: add model variant selection dialog (#19488) (Dax, 2026-03-28)
- 81eb6e6 - refactor(prompt): remove variant cycle display from footer (#19489) (Dax, 2026-03-28)
- 8446719 - refactor(session): move context into prompt footer (#19486) (Dax, 2026-03-28)
- 15a8c22 - tweak: adjust bash tool description to increase cache hit rates between projects (#19487) (Aiden Cline, 2026-03-27)
- 48326e8 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-03-28)
- 43bc555 - update effect to 4.0.0-beta.42 (#19484) (Kit Langton, 2026-03-27)
- f736116 - fix(app): more startup efficiency (#19454) (Adam, 2026-03-28)
- 82fc493 - feat(ci): use Azure Artifact Signing for Windows releases (#15201) (Luke Parker, 2026-03-28)
- 2145d97 - refactor(session): effectify SessionCompaction service (#19459) (Kit Langton, 2026-03-28)
- f3997d8 - Single target plugin entrypoints (#19467) (Sebastian, 2026-03-27)
- 02b19bc - chore: generate (opencode-agent[bot], 2026-03-27)
- 5cd54ec - refactor(format): use ChildProcessSpawner instead of Process.spawn (#19457) (Kit Langton, 2026-03-27)
- c890990 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-03-27)
- 4b9660b - refactor(core): move more responsibility to workspace routing (#19455) (James Long, 2026-03-27)
- e5f0e81 - refactor(session): effectify Session service (#19449) (Kit Langton, 2026-03-27)
- c33d999 - feat: AI SDK v6 support (#18433) (Aiden Cline, 2026-03-27)
- 7a7643c - no theme override in dev (#19456) (Sebastian, 2026-03-27)
- 6f5b70e - tweak: add additional overflow error patterns (#19446) (Aiden Cline, 2026-03-27)
- ff13524 - fix flaky plugin tests (no mock.module for bun) (#19445) (Sebastian, 2026-03-27)
- e973bbf - fix(app): default file tree to closed with minimum width (#19426) (Kit Langton, 2026-03-27)
- d36b38e - fix(desktop-electron): match dev dock icon inset on macOS (#19429) (Kit Langton, 2026-03-27)
- bdd7829 - fix(app): resize layout viewport when mobile keyboard appears (#15841) (Burak Yigit Kaya, 2026-03-27)
- a93374c - fix(ui): make streamed markdown feel more continuous (#19404) (Shoubhit Dash, 2026-03-27)
- af2ccc9 - chore(app): more spacing controls (Adam, 2026-03-27)
- a76be69 - refactor(core): split out instance and route through workspaces (#19335) (James Long, 2026-03-27)
- e528ed5 - effectify Plugin service internals (#19365) (Kit Langton, 2026-03-27)
- bb8d2cd - chore: update nix node_modules hashes (opencode-agent[bot], 2026-03-27)
- decb5e6 - effectify Skill service internals (#19364) (Kit Langton, 2026-03-27)
- 2102333 - chore: generate (opencode-agent[bot], 2026-03-27)
- 6274b06 - tui plugins (#19347) (Sebastian, 2026-03-27)
- d8ad833 - chore: generate (opencode-agent[bot], 2026-03-27)
- 7b44918 - refactor(tool-registry): yield Config/Plugin services, use Effect.forEach (#19363) (Kit Langton, 2026-03-27)
- d2bfa92 - fix(app): persist queued followups across project switches (#19421) (Shoubhit Dash, 2026-03-27)
- 3fb60d0 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-03-27)
- d341499 - fix(ui): keep partial markdown readable while responses stream (#19403) (Shoubhit Dash, 2026-03-27)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/provider/sdk/copilot/responses/tool/code-interpreter.ts` (+2, -3)
- `packages/opencode/src/provider/sdk/copilot/responses/tool/file-search.ts` (+2, -3)
- `packages/opencode/src/provider/sdk/copilot/responses/tool/image-generation.ts` (+2, -3)
- `packages/opencode/src/provider/sdk/copilot/responses/tool/local-shell.ts` (+2, -3)
- `packages/opencode/src/provider/sdk/copilot/responses/tool/web-search-preview.ts` (+2, -3)
- `packages/opencode/src/provider/sdk/copilot/responses/tool/web-search.ts` (+2, -3)
- `packages/opencode/src/tool/bash.ts` (+420, -190)
- `packages/opencode/src/tool/bash.txt` (+3, -1)
- `packages/opencode/src/tool/batch.ts` (+2, -1)
- `packages/opencode/src/tool/external-directory.ts` (+10, -5)
- `packages/opencode/src/tool/read.ts` (+3, -0)
- `packages/opencode/src/tool/registry.ts` (+61, -58)
- `packages/opencode/test/tool/bash.test.ts` (+715, -134)
- `packages/opencode/test/tool/external-directory.test.ts` (+72, -2)
- `packages/opencode/test/tool/read.test.ts` (+39, -2)

#### Agent System (packages/*/src/agent/)
- `.opencode/agent/docs.md` (+0, -34)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/console/core/package.json` (+1, -1)
- `packages/console/core/script/freeze-workspace.ts` (+39, -0)
- `packages/console/core/script/lookup-user.ts` (+63, -87)
- `packages/console/core/src/util/price.ts` (+4, -0)

#### Other Changes
- `.github/workflows/docs-locale-sync.yml` (+3, -2)
- `.github/workflows/nix-hashes.yml` (+4, -0)
- `.github/workflows/publish.yml` (+183, -1)
- `.github/workflows/sign-cli.yml` (+0, -54)
- `.gitignore` (+1, -0)
- `.opencode/command/changelog.md` (+40, -19)
- `.opencode/plugins/smoke-theme.json` (+223, -0)
- `.opencode/plugins/tui-smoke.tsx` (+891, -0)
- `.opencode/themes/.gitignore` (+1, -0)
- `.opencode/tui.json` (+18, -0)
- `.signpath/policies/opencode/test-signing.yml` (+0, -5)
- `bun.lock` (+118, -220)
- `nix/hashes.json` (+4, -4)
- `nix/node_modules.nix` (+2, -1)
- `nix/opencode.nix` (+4, -0)
- `package.json` (+8, -6)
- `packages/app/e2e/settings/settings.spec.ts` (+24, -24)
- `packages/app/index.html` (+1, -1)
- `packages/app/package.json` (+1, -1)
- `packages/app/src/app.tsx` (+12, -3)
- `packages/app/src/components/status-popover-body.tsx` (+3, -1)
- `packages/app/src/context/global-sdk.tsx` (+82, -60)
- `packages/app/src/context/global-sync.tsx` (+20, -0)
- `packages/app/src/context/global-sync/bootstrap.ts` (+16, -14)
- `packages/app/src/context/layout.tsx` (+31, -16)
- `packages/app/src/context/server.tsx` (+9, -1)
- `packages/app/src/context/settings.tsx` (+20, -22)
- `packages/app/src/pages/session.tsx` (+66, -12)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/i18n/ar.ts` (+1, -2)
- `packages/console/app/src/i18n/br.ts` (+1, -2)
- `packages/console/app/src/i18n/da.ts` (+1, -2)
- `packages/console/app/src/i18n/de.ts` (+1, -2)
- `packages/console/app/src/i18n/en.ts` (+2, -2)
- `packages/console/app/src/i18n/es.ts` (+1, -2)
- `packages/console/app/src/i18n/fr.ts` (+1, -2)
- `packages/console/app/src/i18n/it.ts` (+1, -2)
- `packages/console/app/src/i18n/ja.ts` (+1, -2)
- `packages/console/app/src/i18n/ko.ts` (+1, -2)
- `packages/console/app/src/i18n/no.ts` (+1, -2)
- `packages/console/app/src/i18n/pl.ts` (+1, -2)
- `packages/console/app/src/i18n/ru.ts` (+1, -2)
- `packages/console/app/src/i18n/th.ts` (+1, -2)
- `packages/console/app/src/i18n/tr.ts` (+1, -2)
- `packages/console/app/src/i18n/zh.ts` (+2, -2)
- `packages/console/app/src/i18n/zht.ts` (+2, -2)
- `packages/console/app/src/routes/go/index.tsx` (+1, -4)
- `packages/console/function/package.json` (+4, -4)
- `packages/console/mail/package.json` (+1, -1)
- `packages/desktop-electron/electron-builder.config.ts` (+23, -0)
- `packages/desktop-electron/icons/README.md` (+3, -0)
- `packages/desktop-electron/icons/beta/dock.png` (+-, --)
- `packages/desktop-electron/icons/dev/dock.png` (+-, --)
- `packages/desktop-electron/icons/prod/dock.png` (+-, --)
- `packages/desktop-electron/package.json` (+1, -1)
- `packages/desktop-electron/scripts/prepare.ts` (+2, -1)
- `packages/desktop-electron/scripts/utils.ts` (+3, -0)
- `packages/desktop-electron/src/main/windows.ts` (+2, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/desktop/scripts/prepare.ts` (+2, -1)
- `packages/desktop/scripts/utils.ts` (+3, -0)
- `packages/desktop/src-tauri/tauri.beta.conf.json` (+4, -0)
- `packages/desktop/src-tauri/tauri.conf.json` (+4, -0)
- `packages/desktop/src-tauri/tauri.prod.conf.json` (+4, -0)
- `packages/enterprise/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/function/package.json` (+1, -1)
- `packages/opencode/bunfig.toml` (+1, -1)
- `packages/opencode/package.json` (+28, -26)
- `packages/opencode/script/build.ts` (+3, -2)
- `packages/opencode/script/upgrade-opentui.ts` (+64, -0)
- `packages/opencode/specs/effect-migration.md` (+79, -5)
- `packages/opencode/specs/tui-plugins.md` (+389, -0)
- `packages/opencode/src/bun/index.ts` (+6, -5)
- `packages/opencode/src/bun/registry.ts` (+6, -0)
- `packages/opencode/src/cli/cmd/db.ts` (+3, -2)
- `packages/opencode/src/cli/cmd/plug.ts` (+231, -0)
- `packages/opencode/src/cli/cmd/tui/app.tsx` (+196, -183)
- `packages/opencode/src/cli/cmd/tui/component/dialog-command.tsx` (+30, -6)
- `packages/opencode/src/cli/cmd/tui/component/dialog-model.tsx` (+18, -4)
- `packages/opencode/src/cli/cmd/tui/component/dialog-status.tsx` (+2, -1)
- `packages/opencode/src/cli/cmd/tui/component/dialog-variant.tsx` (+39, -0)
- `packages/opencode/src/cli/cmd/tui/component/dialog-workspace-list.tsx` (+13, -20)
- `packages/opencode/src/cli/cmd/tui/component/error-component.tsx` (+91, -0)
- `packages/opencode/src/cli/cmd/tui/component/plugin-route-missing.tsx` (+14, -0)
- `packages/opencode/src/cli/cmd/tui/component/prompt/index.tsx` (+61, -21)
- `packages/opencode/src/cli/cmd/tui/component/startup-loading.tsx` (+63, -0)
- `packages/opencode/src/cli/cmd/tui/context/exit.tsx` (+2, -1)
- `packages/opencode/src/cli/cmd/tui/context/keybind.tsx` (+12, -9)
- `packages/opencode/src/cli/cmd/tui/context/local.tsx` (+8, -2)
- `packages/opencode/src/cli/cmd/tui/context/plugin-keybinds.ts` (+41, -0)
- `packages/opencode/src/cli/cmd/tui/context/route.tsx` (+7, -2)
- `packages/opencode/src/cli/cmd/tui/context/sdk.tsx` (+3, -0)
- `packages/opencode/src/cli/cmd/tui/context/theme.tsx` (+142, -111)
- `packages/opencode/src/cli/cmd/tui/{component/tips.tsx => feature-plugins/home/tips-view.tsx}` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/home/tips.tsx` (+50, -0)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/sidebar/context.tsx` (+63, -0)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/sidebar/files.tsx` (+62, -0)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/sidebar/footer.tsx` (+93, -0)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/sidebar/lsp.tsx` (+66, -0)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/sidebar/mcp.tsx` (+96, -0)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/sidebar/todo.tsx` (+48, -0)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/system/plugins.tsx` (+270, -0)
- `packages/opencode/src/cli/cmd/tui/plugin/api.tsx` (+420, -0)
- `packages/opencode/src/cli/cmd/tui/plugin/index.ts` (+3, -0)
- `packages/opencode/src/cli/cmd/tui/plugin/internal.ts` (+25, -0)
- `packages/opencode/src/cli/cmd/tui/plugin/runtime.ts` (+967, -0)
- `packages/opencode/src/cli/cmd/tui/plugin/slots.tsx` (+61, -0)
- `packages/opencode/src/cli/cmd/tui/routes/home.tsx` (+27, -48)
- `packages/opencode/src/cli/cmd/tui/routes/session/header.tsx` (+0, -172)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+8, -33)
- `packages/opencode/src/cli/cmd/tui/routes/session/question.tsx` (+1, -0)
- `packages/opencode/src/cli/cmd/tui/routes/session/sidebar.tsx` (+25, -278)
- `packages/opencode/src/cli/cmd/tui/routes/session/subagent-footer.tsx` (+131, -0)
- `packages/opencode/src/cli/cmd/tui/thread.ts` (+3, -2)
- `packages/opencode/src/cli/cmd/tui/ui/dialog-export-options.tsx` (+1, -0)
- `packages/opencode/src/cli/cmd/tui/ui/dialog-prompt.tsx` (+34, -8)
- `packages/opencode/src/cli/cmd/tui/ui/dialog-select.tsx` (+1, -0)
- `packages/opencode/src/cli/cmd/tui/ui/dialog.tsx` (+14, -4)
- `packages/opencode/src/cli/error.ts` (+2, -13)
- `packages/opencode/src/config/config.ts` (+108, -65)
- `packages/opencode/src/config/tui-schema.ts` (+2, -0)
- `packages/opencode/src/config/tui.ts` (+121, -27)
- `packages/opencode/src/control-plane/adaptors/worktree.ts` (+2, -10)
- `packages/opencode/src/control-plane/workspace-router-middleware.ts` (+0, -67)
- `packages/opencode/src/effect/cross-spawn-spawner.ts` (+1, -1)
- `packages/opencode/src/effect/run-service.ts` (+2, -0)
- `packages/opencode/src/file/index.ts` (+80, -87)
- `packages/opencode/src/filesystem/index.ts` (+31, -2)
- `packages/opencode/src/flag/flag.ts` (+25, -0)
- `packages/opencode/src/format/index.ts` (+41, -29)
- `packages/opencode/src/index.ts` (+14, -3)
- `packages/opencode/src/plugin/index.ts` (+214, -98)
- `packages/opencode/src/plugin/install.ts` (+384, -0)
- `packages/opencode/src/plugin/meta.ts` (+165, -0)
- `packages/opencode/src/plugin/shared.ts` (+172, -0)
- `packages/opencode/src/provider/auth.ts` (+3, -3)
- `packages/opencode/src/provider/error.ts` (+3, -0)
- `packages/opencode/src/provider/provider.ts` (+56, -17)
- `packages/opencode/src/provider/sdk/copilot/chat/convert-to-openai-compatible-chat-messages.ts` (+10, -4)
- `packages/opencode/src/provider/sdk/copilot/chat/map-openai-compatible-finish-reason.ts` (+5, -3)
- `packages/opencode/src/provider/sdk/copilot/chat/openai-compatible-chat-language-model.ts` (+74, -39)
- `packages/opencode/src/provider/sdk/copilot/chat/openai-compatible-metadata-extractor.ts` (+3, -3)
- `packages/opencode/src/provider/sdk/copilot/chat/openai-compatible-prepare-tools.ts` (+7, -11)
- `packages/opencode/src/provider/sdk/copilot/copilot-provider.ts` (+5, -5)
- `packages/opencode/src/provider/sdk/copilot/responses/convert-to-openai-responses-input.ts` (+39, -7)
- `packages/opencode/src/provider/sdk/copilot/responses/map-openai-responses-finish-reason.ts` (+3, -3)
- `packages/opencode/src/provider/sdk/copilot/responses/openai-responses-api-types.ts` (+7, -0)
- `packages/opencode/src/provider/sdk/copilot/responses/openai-responses-language-model.ts` (+112, -75)
- `packages/opencode/src/provider/sdk/copilot/responses/openai-responses-prepare-tools.ts` (+7, -11)
- `packages/opencode/src/provider/transform.ts` (+53, -25)
- `packages/opencode/src/pty/index.ts` (+1, -1)
- `packages/opencode/src/server/instance.ts` (+285, -0)
- `packages/opencode/src/server/middleware.ts` (+29, -0)
- `packages/opencode/src/server/router.ts` (+99, -0)
- `packages/opencode/src/server/routes/event.ts` (+2, -4)
- `packages/opencode/src/server/server.ts` (+21, -328)
- `packages/opencode/src/session/compaction.ts` (+332, -243)
- `packages/opencode/src/session/index.ts` (+475, -384)
- `packages/opencode/src/session/instruction.ts` (+1, -1)
- `packages/opencode/src/session/llm.ts` (+44, -15)
- `packages/opencode/src/session/message-v2.ts` (+14, -6)
- `packages/opencode/src/session/overflow.ts` (+22, -0)
- `packages/opencode/src/session/processor.ts` (+513, -389)
- `packages/opencode/src/session/prompt.ts` (+40, -33)
- `packages/opencode/src/session/prompt/gpt.txt` (+62, -71)
- `packages/opencode/src/session/retry.ts` (+41, -36)
- `packages/opencode/src/shell/shell.ts` (+56, -19)
- `packages/opencode/src/skill/index.ts` (+96, -50)
- `packages/opencode/src/util/error.ts` (+77, -0)
- `packages/opencode/src/util/filesystem.ts` (+13, -3)
- `packages/opencode/src/util/flock.ts` (+333, -0)
- `packages/opencode/src/util/{proxied.ts => network.ts}` (+6, -0)
- `packages/opencode/src/util/process.ts` (+2, -1)
- `packages/opencode/src/util/record.ts` (+3, -0)
- `packages/opencode/src/worktree/index.ts` (+8, -4)
- `packages/opencode/test/cli/tui/keybind-plugin.test.ts` (+90, -0)
- `packages/opencode/test/cli/tui/plugin-add.test.ts` (+61, -0)
- `packages/opencode/test/cli/tui/plugin-install.test.ts` (+95, -0)
- `packages/opencode/test/cli/tui/plugin-lifecycle.test.ts` (+225, -0)
- `packages/opencode/test/cli/tui/plugin-loader-entrypoint.test.ts` (+189, -0)
- `packages/opencode/test/cli/tui/plugin-loader-pure.test.ts` (+71, -0)
- `packages/opencode/test/cli/tui/plugin-loader.test.ts` (+563, -0)
- `packages/opencode/test/cli/tui/plugin-toggle.test.ts` (+157, -0)
- `packages/opencode/test/cli/tui/theme-store.test.ts` (+51, -0)
- `packages/opencode/test/cli/tui/thread.test.ts` (+41, -70)
- `packages/opencode/test/config/config.test.ts` (+174, -48)
- `packages/opencode/test/config/tui.test.ts` (+159, -2)
- `packages/opencode/test/fixture/flock-worker.ts` (+72, -0)
- `packages/opencode/test/fixture/plug-worker.ts` (+93, -0)
- `packages/opencode/test/fixture/plugin-meta-worker.ts` (+26, -0)
- `packages/opencode/test/fixture/tui-plugin.ts` (+335, -0)
- `packages/opencode/test/fixture/tui-runtime.ts` (+34, -0)
- `packages/opencode/test/format/format.test.ts` (+3, -7)
- `packages/opencode/test/plugin/auth-override.test.ts` (+14, -12)
- `packages/opencode/test/plugin/install-concurrency.test.ts` (+134, -0)
- `packages/opencode/test/plugin/install.test.ts` (+504, -0)
- `packages/opencode/test/plugin/loader-shared.test.ts` (+625, -0)
- `packages/opencode/test/plugin/meta.test.ts` (+137, -0)
- `packages/opencode/test/plugin/trigger.test.ts` (+111, -0)
- `packages/opencode/test/provider/copilot/copilot-chat-model.test.ts` (+14, -14)
- `packages/opencode/test/provider/gitlab-duo.test.ts` (+394, -390)
- `packages/opencode/test/pty/pty-shell.test.ts` (+59, -0)
- `packages/opencode/test/session/compaction.test.ts` (+680, -9)
- `packages/opencode/test/session/llm.test.ts` (+125, -2)
- `packages/opencode/test/session/message-v2.test.ts` (+26, -26)
- `packages/opencode/test/session/processor-effect.test.ts` (+838, -0)
- `packages/opencode/test/session/prompt.test.ts` (+230, -0)
- `packages/opencode/test/session/retry.test.ts` (+48, -20)
- `packages/opencode/test/session/structured-output.test.ts` (+11, -6)
- `packages/opencode/test/shell/shell.test.ts` (+73, -0)
- `packages/opencode/test/util/error.test.ts` (+38, -0)
- `packages/opencode/test/util/filesystem.test.ts` (+9, -0)
- `packages/opencode/test/util/flock.test.ts` (+383, -0)
- `packages/plugin/package.json` (+17, -2)
- `packages/plugin/src/index.ts` (+19, -4)
- `packages/plugin/src/tui.ts` (+440, -0)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+112, -112)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+56, -48)
- `packages/sdk/openapi.json` (+108, -89)
- `packages/slack/package.json` (+1, -1)
- `packages/ui/package.json` (+2, -1)
- `packages/ui/src/assets/fonts/BlexMonoNerdFontMono-Bold.woff2` (+-, --)
- `packages/ui/src/assets/fonts/BlexMonoNerdFontMono-Medium.woff2` (+-, --)
- `packages/ui/src/assets/fonts/BlexMonoNerdFontMono-Regular.woff2` (+-, --)
- `packages/ui/src/assets/fonts/ibm-plex-mono-bold.woff2` (+0, -1)
- `packages/ui/src/assets/fonts/ibm-plex-mono-medium.woff2` (+0, -1)
- `packages/ui/src/assets/fonts/ibm-plex-mono.woff2` (+0, -1)
- `packages/ui/src/assets/fonts/inter.woff2` (+-, --)
- `packages/ui/src/components/collapsible.css` (+2, -1)
- `packages/ui/src/components/font.stories.tsx` (+5, -5)
- `packages/ui/src/components/font.tsx` (+1, -63)
- `packages/ui/src/components/markdown-stream.test.ts` (+32, -0)
- `packages/ui/src/components/markdown-stream.ts` (+49, -0)
- `packages/ui/src/components/markdown.tsx` (+3, -46)
- `packages/ui/src/components/message-part.css` (+8, -5)
- `packages/ui/src/components/message-part.tsx` (+64, -26)
- `packages/ui/src/components/timeline-playground.stories.tsx` (+46, -2)
- `packages/ui/src/styles/theme.css` (+5, -4)
- `packages/util/package.json` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/ar/go.mdx` (+1, -3)
- `packages/web/src/content/docs/bs/go.mdx` (+1, -3)
- `packages/web/src/content/docs/da/go.mdx` (+1, -3)
- `packages/web/src/content/docs/de/go.mdx` (+1, -3)
- `packages/web/src/content/docs/es/go.mdx` (+1, -3)
- `packages/web/src/content/docs/fr/go.mdx` (+1, -3)
- `packages/web/src/content/docs/go.mdx` (+1, -3)
- `packages/web/src/content/docs/it/go.mdx` (+1, -3)
- `packages/web/src/content/docs/ja/go.mdx` (+1, -3)
- `packages/web/src/content/docs/ko/go.mdx` (+1, -3)
- `packages/web/src/content/docs/nb/go.mdx` (+1, -3)
- `packages/web/src/content/docs/permissions.mdx` (+1, -0)
- `packages/web/src/content/docs/pl/go.mdx` (+1, -3)
- `packages/web/src/content/docs/pt-br/go.mdx` (+1, -3)
- `packages/web/src/content/docs/ru/go.mdx` (+1, -3)
- `packages/web/src/content/docs/th/go.mdx` (+1, -3)
- `packages/web/src/content/docs/tools.mdx` (+7, -3)
- `packages/web/src/content/docs/tr/go.mdx` (+1, -3)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+1, -3)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+1, -3)
- `patches/@ai-sdk%2Fanthropic@3.0.64.patch` (+119, -0)
- `patches/@ai-sdk%2Fprovider-utils@4.0.21.patch` (+61, -0)
- `patches/@ai-sdk%2Fxai@2.0.51.patch` (+0, -108)
- `patches/@openrouter%2Fai-sdk-provider@1.5.4.patch` (+0, -128)
- `script/changelog.ts` (+169, -214)
- `script/sign-windows.ps1` (+70, -0)
- `script/version.ts` (+2, -1)
- `sdks/vscode/package.json` (+1, -1)
- `turbo.json` (+2, -1)

### Key Diffs

#### .opencode/agent/docs.md
```diff
diff --git a/.opencode/agent/docs.md b/.opencode/agent/docs.md
deleted file mode 100644
index 21cfc6a..0000000
--- a/.opencode/agent/docs.md
+++ /dev/null
@@ -1,34 +0,0 @@
----
-description: ALWAYS use this when writing docs
-color: "#38A3EE"
----
-
-You are an expert technical documentation writer
-
-You are not verbose
-
-Use a relaxed and friendly tone
-
-The title of the page should be a word or a 2-3 word phrase
-
-The description should be one short line, should not start with "The", should
-avoid repeating the title of the page, should be 5-10 words long
-
-Chunks of text should not be more than 2 sentences long
-
-Each section is separated by a divider of 3 dashes
-
-The section titles are short with only the first letter of the word capitalized
-
-The section titles are in the imperative mood
-
-The section titles should not repeat the term used in the page title, for
-example, if the page title is "Models", avoid using a section title like "Add
-new models". This might be unavoidable in some cases, but try to avoid it.
-
-Check out the /packages/web/src/content/docs/docs/index.mdx as an example.
-
-For JS or TS code snippets remove trailing semicolons and any trailing commas
-that might not be needed.
-
-If you are making a commit prefix the commit message with `docs:`
```

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 6174948..bfe7fe1 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.3.3",
+  "version": "1.3.7",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/console/core/script/freeze-workspace.ts
```diff
diff --git a/packages/console/core/script/freeze-workspace.ts b/packages/console/core/script/freeze-workspace.ts
new file mode 100644
index 0000000..d2ccf21
--- /dev/null
+++ b/packages/console/core/script/freeze-workspace.ts
@@ -0,0 +1,39 @@
+import { Billing } from "../src/billing.js"
+import { Database, eq } from "../src/drizzle/index.js"
+import { BillingTable } from "../src/schema/billing.sql.js"
+import { WorkspaceTable } from "../src/schema/workspace.sql.js"
+import { microCentsToCents } from "../src/util/price.js"
+
+// get input from command line
+const workspaceID = process.argv[2]
+
+if (!workspaceID) {
+  console.error("Usage: bun freeze-workspace.ts <workspaceID>")
+  process.exit(1)
+}
+
+// check workspace exists
+const workspace = await Database.use((tx) =>
+  tx
+    .select()
+    .from(WorkspaceTable)
+    .where(eq(WorkspaceTable.id, workspaceID))
+    .then((rows) => rows[0]),
+)
+if (!workspace) {
+  console.error("Error: Workspace not found")
+  process.exit(1)
+}
+
+const billing = await Database.use((tx) =>
+  tx
+    .select()
+    .from(BillingTable)
+    .where(eq(BillingTable.workspaceID, workspaceID))
+    .then((rows) => rows[0]),
+)
+
+const amountInDollars = microCentsToCents(billing.balance) / 100
+await Billing.grantCredit(workspaceID, 0 - amountInDollars)
+
+console.log(`Removed payment of $${amountInDollars.toFixed(2)} from workspace ${workspaceID}`)
```

#### packages/console/core/script/lookup-user.ts
```diff
diff --git a/packages/console/core/script/lookup-user.ts b/packages/console/core/script/lookup-user.ts
index 0011ae0..db783aa 100644
--- a/packages/console/core/script/lookup-user.ts
+++ b/packages/console/core/script/lookup-user.ts
@@ -18,8 +18,9 @@ import { ModelTable } from "../src/schema/model.sql.js"
 
 // get input from command line
 const identifier = process.argv[2]
+const verbose = process.argv[process.argv.length - 1] === "-v"
 if (!identifier) {
-  console.error("Usage: bun lookup-user.ts <email|workspaceID|apiKey>")
+  console.error("Usage: bun lookup-user.ts <email|workspaceID|apiKey> [-v]")
   process.exit(1)
 }
 
@@ -223,93 +224,68 @@ async function printWorkspace(workspaceID: string) {
       ),
   )
 
-  await printTable("28-Day Usage", (tx) =>
-    tx
-      .select({
-        date: sql<string>`DATE(${UsageTable.timeCreated})`.as("date"),
-        requests: sql<number>`COUNT(*)`.as("requests"),
-        inputTokens: sql<number>`SUM(${UsageTable.inputTokens})`.as("input_tokens"),
-        outputTokens: sql<number>`SUM(${UsageTable.outputTokens})`.as("output_tokens"),
-        reasoningTokens: sql<number>`SUM(${UsageTable.reasoningTokens})`.as("reasoning_tokens"),
-        cacheReadTokens: sql<number>`SUM(${UsageTable.cacheReadTokens})`.as("cache_read_tokens"),
-        cacheWrite5mTokens: sql<number>`SUM(${UsageTable.cacheWrite5mTokens})`.as("cache_write_5m_tokens"),
-        cacheWrite1hTokens: sql<number>`SUM(${UsageTable.cacheWrite1hTokens})`.as("cache_write_1h_tokens"),
-        cost: sql<number>`SUM(${UsageTable.cost})`.as("cost"),
-      })
-      .from(UsageTable)
-      .where(
-        and(
-          eq(UsageTable.workspaceID, workspace.id),
-          sql`${UsageTable.timeCreated} >= DATE_SUB(NOW(), INTERVAL 28 DAY)`,
+  if (verbose) {
+    await printTable("28-Day Usage", (tx) =>
+      tx
+        .select({
+          date: sql<string>`DATE(${UsageTable.timeCreated})`.as("date"),
+          requests: sql<number>`COUNT(*)`.as("requests"),
+          inputTokens: sql<number>`SUM(${UsageTable.inputTokens})`.as("input_tokens"),
+          outputTokens: sql<number>`SUM(${UsageTable.outputTokens})`.as("output_tokens"),
+          reasoningTokens: sql<number>`SUM(${UsageTable.reasoningTokens})`.as("reasoning_tokens"),
+          cacheReadTokens: sql<number>`SUM(${UsageTable.cacheReadTokens})`.as("cache_read_tokens"),
+          cacheWrite5mTokens: sql<number>`SUM(${UsageTable.cacheWrite5mTokens})`.as("cache_write_5m_tokens"),
+          cacheWrite1hTokens: sql<number>`SUM(${UsageTable.cacheWrite1hTokens})`.as("cache_write_1h_tokens"),
+          cost: sql<number>`SUM(${UsageTable.cost})`.as("cost"),
```

#### packages/console/core/src/util/price.ts
```diff
diff --git a/packages/console/core/src/util/price.ts b/packages/console/core/src/util/price.ts
index abdbca0..ff7a576 100644
--- a/packages/console/core/src/util/price.ts
+++ b/packages/console/core/src/util/price.ts
@@ -1,3 +1,7 @@
 export function centsToMicroCents(amount: number) {
   return Math.round(amount * 1000000)
 }
+
+export function microCentsToCents(amount: number) {
+  return Math.round(amount / 1000000)
+}
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate patterns from opencode .opencode/agent/docs.md
- `src/core/` - review core changes from packages/kilo-docs/pages/code-with-ai/agents/orchestrator-mode.md
- `src/permission/` - review permission changes from packages/opencode/src/kilocode/permission/config-paths.ts
- `src/permission/` - review permission changes from packages/opencode/src/kilocode/permission/drain.ts
- `src/permission/` - review permission changes from packages/opencode/src/permission/next.ts
- `src/tool/bash.test.ts` - update based on opencode packages/opencode/test/tool/bash.test.ts changes
- `src/tool/bash.ts` - update based on opencode packages/opencode/src/tool/bash.ts changes
- `src/tool/bash.txt.ts` - update based on opencode packages/opencode/src/tool/bash.txt changes
- `src/tool/batch.ts` - update based on opencode packages/opencode/src/tool/batch.ts changes
- `src/tool/code-interpreter.ts` - update based on opencode packages/opencode/src/provider/sdk/copilot/responses/tool/code-interpreter.ts changes
- `src/tool/external-directory.test.ts` - update based on opencode packages/opencode/test/tool/external-directory.test.ts changes
- `src/tool/external-directory.ts` - update based on opencode packages/opencode/src/tool/external-directory.ts changes
- `src/tool/file-search.ts` - update based on opencode packages/opencode/src/provider/sdk/copilot/responses/tool/file-search.ts changes
- `src/tool/image-generation.ts` - update based on opencode packages/opencode/src/provider/sdk/copilot/responses/tool/image-generation.ts changes
- `src/tool/local-shell.ts` - update based on opencode packages/opencode/src/provider/sdk/copilot/responses/tool/local-shell.ts changes
- `src/tool/read.test.ts` - update based on opencode packages/opencode/test/tool/read.test.ts changes
- `src/tool/read.ts` - update based on opencode packages/opencode/src/tool/read.ts changes
- `src/tool/registry.ts` - update based on opencode packages/opencode/src/tool/registry.ts changes
- `src/tool/skill.ts` - update based on kilocode packages/opencode/src/tool/skill.ts changes
- `src/tool/web-search-preview.ts` - update based on opencode packages/opencode/src/provider/sdk/copilot/responses/tool/web-search-preview.ts changes
- `src/tool/web-search.ts` - update based on opencode packages/opencode/src/provider/sdk/copilot/responses/tool/web-search.ts changes
