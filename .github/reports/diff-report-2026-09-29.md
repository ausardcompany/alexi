# Upstream Changes Report
Generated: 2026-09-29 12:16:36

## Summary
- kilocode: 45 commits, 145 files changed
- opencode: 11 commits, 47 files changed

## kilocode Changes (318a913a2..2dfe6fc87)

### Commits

- 2dfe6fc87 - Merge pull request #14646 from Kilo-Org/jetbrains/release/v7.1.9-rc.1 (Kirill Kalishev, 2026-09-28)
- dc28df819 - docs(jetbrains): edit changelog for v7.1.9-rc.1 (Kirill Kalishev, 2026-09-28)
- 59e646fb6 - release(jetbrains): v7.1.9-rc.1 (kilo-maintainer[bot], 2026-09-28)
- 2ccf28eef - Merge pull request #14622 from Kilo-Org/merry-grove (Kirill Kalishev, 2026-09-28)
- e5f914978 - Merge pull request #14619 from Kilo-Org/clever-urchin (Kirill Kalishev, 2026-09-28)
- 148105f8b - Merge pull request #14642 from Kilo-Org/polished-lynx (Kirill Kalishev, 2026-09-28)
- 61af41d09 - Merge pull request #14641 from Kilo-Org/hidden-tundra (Kirill Kalishev, 2026-09-28)
- a1f9eae4c - fix(jetbrains): top-align settings info actions (kirillk, 2026-09-28)
- 5d918ff7b - fix(jetbrains): align settings info actions (kirillk, 2026-09-28)
- 4020ea663 - fix(jetbrains): address commands settings review (kirillk, 2026-09-28)
- ceb804be3 - fix(jetbrains): address board review feedback (kirillk, 2026-09-28)
- 9350ea821 - feat(jetbrains): rename workflows to commands (kirillk, 2026-09-28)
- 4f35e9d30 - fix(vscode): apply pending edit from quick fix (kirillk, 2026-09-28)
- d13d50df6 - Merge pull request #14640 from Kilo-Org/docs/gateway-payload-size-limit (Joshua Lambert, 2026-09-28)
- 97e6944b5 - docs(gateway): document 20MB request payload size limit (kiloconnect[bot], 2026-09-28)
- 03eacb476 - Merge pull request #14547 from Kilo-Org/kwf/cli-scheduled-session-state-1f5e (Igor Šćekić, 2026-09-28)
- 42b7cb6e1 - Merge pull request #13321 from maphew/fix/openai-custom-provider-cache-breakpoint (Andrea Giammarchi, 2026-09-28)
- 81c5d795a - test(cli): point the placement comment at the suite above it (Igor Šćekić, 2026-09-28)
- 7ac411174 - test(cli): word the placement comment without a counted runtime token (Igor Šćekić, 2026-09-28)
- f4726cad1 - test(cli): keep the cron status cases in a trailing block (Igor Šćekić, 2026-09-28)
- fae138741 - Merge remote-tracking branch 'origin/main' into kwf/cli-scheduled-session-state-1f5e (Igor Šćekić, 2026-09-28)
- 7bb060f7f - Merge pull request #14631 from Kilo-Org/fix/documents-open-in-editor (Bruno Agatão, 2026-09-28)
- 7b4cb6616 - fix(cli): count a cron wait as scheduled and print the wake time locally (Igor Šćekić, 2026-09-28)
- a7527b627 - Merge branch 'main' into fix/documents-open-in-editor (Bruno Agatão, 2026-09-28)
- 693c4025a - fix(cli): recover from provider context-limit errors by compacting (#14635) (Evgeny Shurakov, 2026-09-28)
- 53a1dba59 - Merge pull request #14504 from Kilo-Org/kwf/goal-timing-tools-synergy-99ac (Igor Šćekić, 2026-09-28)
- 7d03a3d90 - refactor(vscode): collapse openRelativeFile branches for conciseness (Bruno Agatao, 2026-09-28)
- 029802e9e - fix(vscode): fix Open in Editor button in Documents viewer (Bruno Agatao, 2026-09-28)
- 4cd7c5e5a - fix(cli): keep scheduled sessions out of every running check (Igor Šćekić, 2026-09-28)
- 769e734b4 - test(cli): join the removal cancel fiber without the global runtime (Igor Šćekić, 2026-09-28)
- 061491ffc - Merge remote-tracking branch 'origin/main' into kwf/cli-scheduled-session-state-1f5e (Igor Šćekić, 2026-09-28)
- e55ec6577 - Merge remote-tracking branch 'origin/main' into kwf/goal-timing-tools-synergy-99ac (Igor Šćekić, 2026-09-28)
- 83c1d0fff - feat(jetbrains): render board messages as markdown (kirillk, 2026-09-27)
- cecdba0c1 - docs(jetbrains): split agent guidance into skills (kirillk, 2026-09-27)
- ff087914f - test(cli): annotate duration check change with kilocode_change marker (matt wilkie, 2026-09-27)
- 5e2e522c8 - test(cli): widen unknown-model duration check for loaded CI runners (matt wilkie, 2026-09-27)
- 112adb211 - fix(cli): preserve cache breakpoints for first-party endpoints (maphew, 2026-09-27)
- a5761009c - test(cli): rename cache-breakpoint test to avoid mirror path collision (maphew, 2026-09-27)
- d5e94e031 - ci: re-trigger pipeline (flaky httpapi-pty test on loaded shard) (maphew, 2026-09-27)
- 9fac22606 - chore(cli): annotate applyCaching signature with kilocode_change marker (maphew, 2026-09-27)
- 5ff16603b - review: gate breakpoints on resolved endpoint; move test to kilocode mirror (matt wilkie, 2026-09-27)
- ad173c7e9 - fix(cli): gate prompt cache breakpoints to first-party OpenAI providers (maphew, 2026-09-27)
- 1b09c194b - fix(cli): report a scheduled session status with its wake time (Igor Šćekić, 2026-09-24)
- 6d8108569 - fix: kwf-fix-review-b75d patch delivery (Igor Šćekić, 2026-09-23)
- 1dec5d3fb - feat(cli): make goals and the timing tools one system (Igor Šćekić, 2026-09-24)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/background-process.txt` (+6, -1)
- `packages/opencode/src/kilocode/tool/board.ts` (+3, -1)
- `packages/opencode/src/kilocode/tool/cancel-wakeup.txt` (+1, -0)
- `packages/opencode/src/kilocode/tool/cron-create.txt` (+4, -0)
- `packages/opencode/src/kilocode/tool/cron-delete.txt` (+1, -0)
- `packages/opencode/src/kilocode/tool/cron-list.txt` (+2, -0)
- `packages/opencode/src/kilocode/tool/cron.ts` (+2, -1)
- `packages/opencode/src/kilocode/tool/schedule-wakeup.txt` (+4, -0)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/kilo-vscode/src/agent-manager/orchestration-domain.ts` (+2, -1)

#### Other Changes
- `.changeset/cli-scheduled-session-status.md` (+5, -0)
- `.changeset/context-overflow-recovery.md` (+5, -0)
- `.changeset/custom-provider-cache-breakpoint.md` (+5, -0)
- `.changeset/documents-open-in-editor.md` (+5, -0)
- `.changeset/jetbrains-commands-settings-info.md` (+5, -0)
- `.changeset/jetbrains-swarm-markdown-messages.md` (+5, -0)
- `.changeset/tidy-dingos-apply.md` (+5, -0)
- `.kilo/{skills/release-jetbrains/SKILL.md => command/release-jetbrains.md}` (+5, -6)
- `.kilo/skills/jetbrains-arch/SKILL.md` (+167, -0)
- `.kilo/skills/jetbrains-cli-pin/SKILL.md` (+5, -5)
- `.kilo/skills/jetbrains-dev/SKILL.md` (+84, -0)
- `.kilo/skills/jetbrains-session/SKILL.md` (+219, -0)
- `.kilo/skills/jetbrains-ui/SKILL.md` (+371, -0)
- `AGENTS.md` (+1, -1)
- `packages/kilo-console/src/client.test.ts` (+9, -0)
- `packages/kilo-console/src/client.ts` (+6, -1)
- `packages/kilo-console/src/routes/projects/ProjectConsoleRoute.tsx` (+2, -1)
- `packages/kilo-docs/pages/contributing/architecture/jetbrains-plugin.md` (+1, -1)
- `packages/kilo-docs/pages/gateway/api-reference.md` (+7, -0)
- `packages/kilo-jetbrains/AGENTS.md` (+50, -805)
- `packages/kilo-jetbrains/CHANGELOG.md` (+15, -0)
- `packages/kilo-jetbrains/RELEASE_TODO.md` (+0, -56)
- `packages/kilo-jetbrains/RELEASING.md` (+3, -5)
- `packages/kilo-jetbrains/docs/bundled-release-plan.md` (+0, -64)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/plugin/KiloDocs.kt` (+11, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/board/BoardMessagesView.kt` (+212, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/board/SessionBoardDialog.kt` (+19, -70)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/AgentBehaviorSettingsUi.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/AgentsConfigurable.kt` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/{WorkflowsConfigurable.kt => CommandsConfigurable.kt}` (+97, -89)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/McpConfigurable.kt` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/SkillsConfigurable.kt` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsInfo.kt` (+61, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsListPanel.kt` (+6, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/WrapBanner.kt` (+85, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/marketplace/MarketplaceInstallDialog.kt` (+1, -44)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/rules/RulesSettingsUi.kt` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/kilo.jetbrains.frontend.xml` (+3, -3)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+27, -14)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ar.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_bs.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_da.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_de.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_es.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_fr.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ja.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ko.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_nl.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_no.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pl.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pt_BR.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ru.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_th.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_tr.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_uk.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_CN.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_TW.properties` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/plugin/KiloBundleLocaleTest.kt` (+49, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/board/BoardMessagesViewStressTest.kt` (+80, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/board/SessionBoardDialogTest.kt` (+113, -71)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/AgentBehaviorConfigurableTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/AgentBehaviorSettingsUiTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/AgentsSettingsUiTest.kt` (+17, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/{WorkflowsSettingsUiTest.kt => CommandsSettingsUiTest.kt}` (+84, -66)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/McpSettingsUiTest.kt` (+17, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/SkillsSettingsUiTest.kt` (+17, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/base/SettingsInfoTest.kt` (+139, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/marketplace/MarketplaceInstallDialogTest.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/rules/RulesSettingsUiTest.kt` (+17, -0)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloSessionRpcApi.kt` (+1, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+5, -2)
- `packages/kilo-vscode/src/agent-manager/base-update.ts` (+2, -1)
- `packages/kilo-vscode/src/agent-manager/provider-lifecycle.ts` (+2, -1)
- `packages/kilo-vscode/src/kilo-provider/fork-session.ts` (+2, -1)
- `packages/kilo-vscode/src/review-utils.ts` (+2, -2)
- `packages/kilo-vscode/src/services/autocomplete/AutocompleteCodeActionProvider.ts` (+5, -1)
- `packages/kilo-vscode/src/services/autocomplete/AutocompleteServiceManager.ts` (+2, -2)
- `packages/kilo-vscode/src/session-status.ts` (+22, -1)
- `packages/kilo-vscode/tests/unit/autocomplete-code-action-provider.test.ts` (+21, -0)
- `packages/kilo-vscode/tests/unit/review-utils.test.ts` (+12, -0)
- `packages/kilo-vscode/tests/unit/session-status.test.ts` (+15, -0)
- `packages/llm/src/provider-error.ts` (+4, -0)
- `packages/llm/test/provider-error.test.ts` (+5, -0)
- `packages/opencode/script/test-runner.ts` (+7, -0)
- `packages/opencode/src/cli/cmd/run/stream.transport.ts` (+3, -1)
- `packages/opencode/src/cli/cmd/session.ts` (+62, -12)
- `packages/opencode/src/command/index.ts` (+2, -1)
- `packages/opencode/src/kilo-sessions/ingest-queue.ts` (+6, -1)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+56, -46)
- `packages/opencode/src/kilo-sessions/remote-protocol.ts` (+4, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/goal-sync.ts` (+4, -1)
- `packages/opencode/src/kilocode/cli/cmd/tui/terminal-title.ts` (+1, -1)
- `packages/opencode/src/kilocode/session/goal/instructions.ts` (+12, -2)
- `packages/opencode/src/kilocode/session/goal/link.ts` (+239, -0)
- `packages/opencode/src/kilocode/session/goal/policy.ts` (+6, -1)
- `packages/opencode/src/kilocode/session/goal/runner.ts` (+218, -14)
- `packages/opencode/src/kilocode/session/goal/state.ts` (+68, -3)
- `packages/opencode/src/kilocode/session/goal/tool.ts` (+1, -1)
- `packages/opencode/src/kilocode/session/index.ts` (+14, -2)
- `packages/opencode/src/kilocode/session/scheduled.ts` (+80, -0)
- `packages/opencode/src/kilocode/wakeup/index.ts` (+109, -8)
- `packages/opencode/src/kilocode/wakeup/resume.ts` (+52, -2)
- `packages/opencode/src/provider/transform.ts` (+30, -5)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/session.ts` (+10, -1)
- `packages/opencode/src/session/llm.ts` (+1, -0)
- `packages/opencode/src/session/llm/native-runtime.ts` (+2, -1)
- `packages/opencode/src/session/llm/request.ts` (+9, -1)
- `packages/opencode/src/session/session.ts` (+10, -1)
- `packages/opencode/src/snapshot/index.ts` (+5, -1)
- `packages/opencode/test/cli/run/run-process.test.ts` (+1, -1)
- `packages/opencode/test/cli/run/stream.transport.test.ts` (+44, -1)
- `packages/opencode/test/cli/session-list.test.ts` (+77, -0)
- `packages/opencode/test/kilocode/provider/transform-cache-breakpoint.test.ts` (+226, -0)
- `packages/opencode/test/kilocode/session/goal-instructions.test.ts` (+137, -0)
- `packages/opencode/test/kilocode/session/goal-link.test.ts` (+335, -0)
- `packages/opencode/test/kilocode/session/goal.test.ts` (+558, -4)
- `packages/opencode/test/kilocode/session/scheduled.test.ts` (+171, -0)
- `packages/opencode/test/kilocode/sessions/ingest-queue.test.ts` (+32, -0)
- `packages/opencode/test/kilocode/sessions/remote-protocol.test.ts` (+29, -0)
- `packages/opencode/test/kilocode/tool-registry-indexing.test.ts` (+1, -0)
- `packages/opencode/test/kilocode/tui/goal-sync.test.ts` (+46, -0)
- `packages/opencode/test/kilocode/wakeup/wakeup-cron.test.ts` (+376, -3)
- `packages/opencode/test/kilocode/wakeup/wakeup-resume.test.ts` (+817, -4)
- `packages/schema/src/session-status-event.ts` (+6, -0)
- `packages/script/tests/check-opencode-annotations.test.ts` (+30, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+4, -0)
- `packages/sdk/js/test/generated-session-status.test.ts` (+11, -0)
- `packages/sdk/openapi.json` (+14, -0)
- `packages/tui/src/component/prompt/index.tsx` (+4, -3)
- `packages/tui/src/routes/session/index.tsx` (+6, -2)
- `packages/tui/src/util/session.ts` (+6, -0)
- `packages/tui/test/util/session.test.ts` (+11, -1)
- `script/check-opencode-annotations.ts` (+9, -1)
- `script/check-opencode-promise-facades.ts` (+19, -2)

### Key Diffs

#### packages/kilo-vscode/src/agent-manager/orchestration-domain.ts
```diff
diff --git a/packages/kilo-vscode/src/agent-manager/orchestration-domain.ts b/packages/kilo-vscode/src/agent-manager/orchestration-domain.ts
index d704dc856..8dcb7dd53 100644
--- a/packages/kilo-vscode/src/agent-manager/orchestration-domain.ts
+++ b/packages/kilo-vscode/src/agent-manager/orchestration-domain.ts
@@ -1,6 +1,7 @@
 import * as fs from "fs"
 import type { KiloClient, SessionStatus } from "@kilocode/sdk/v2/client"
 import { sameDirectory } from "../kilo-provider-utils"
+import { isRunningStatus } from "../session-status"
 import type { LocalStats, WorktreeStats } from "./GitStatsPoller"
 import type { PRStatus } from "./types"
 import type { ManagedSession, Worktree, WorktreeStateManager } from "./WorktreeStateManager"
@@ -165,7 +166,7 @@ async function live(input: OverviewInput, sessions: ManagedSession[]) {
       ])
       if (status.error || perms.error || qs.error) unavailable.add(dir)
       for (const [id, value] of Object.entries(status.data ?? {}) as Array<[string, SessionStatus]>) {
-        statuses.set(id, value.type)
+        statuses.set(id, isRunningStatus(value.type) ? value.type : "idle")
       }
       for (const value of perms.data ?? []) permissions.add(value.sessionID)
       for (const value of qs.data ?? []) questions.add(value.sessionID)
```

#### packages/opencode/src/kilocode/tool/background-process.txt
```diff
diff --git a/packages/opencode/src/kilocode/tool/background-process.txt b/packages/opencode/src/kilocode/tool/background-process.txt
index 3f5102deb..8cf041a6d 100644
--- a/packages/opencode/src/kilocode/tool/background-process.txt
+++ b/packages/opencode/src/kilocode/tool/background-process.txt
@@ -2,7 +2,7 @@ Run and manage long-running background processes.
 
 Use `start` only for processes that must keep running independently after this tool call returns, such as development servers, file watchers, local services, and test watchers (`npm run dev`, `next dev`, `vite`, or `bun --watch`).
 
-`start` returns immediately and never blocks your turn. `monitor` starts the same kind of process but waits for its output, bounded by a line cap and a wall-time cap, so you read progress instead of polling. Do not start `sleep`, timers, cooldowns, delays, or polling loops with this tool. To wait a fixed time before your next action, run the wait as a normal blocking shell command and set its `timeout` higher than the wait.
+`start` returns immediately and never blocks your turn. `monitor` starts the same kind of process but waits for its output, bounded by a line cap and a wall-time cap, so you read progress instead of polling. Do not start `sleep`, timers, cooldowns, delays, or polling loops with this tool. Outside a session goal, wait a fixed time with a blocking shell command and raise its `timeout`. In a session goal, a time-based wait must use `schedule_wakeup` or `cron_create` so the goal suspends; a blocking shell sleep is progress and the goal loop will spin.
 
 Do not use the shell tool with `&`, `nohup`, `disown`, `setsid`, `Start-Process`, or similar backgrounding patterns. Processes started with this tool are tracked and shown in the CLI sidebar.
 
@@ -21,6 +21,11 @@ Monitor:
 - `monitor` also stops as soon as the process exits. Reaching either cap does not stop the process: it keeps running as a normal background process, and the result names the process `id` so you can follow up with `logs`, `status`, or `stop`.
 - Prefer `monitor` over `start` plus repeated `logs` when you need the output of a command that finishes on its own, such as a build, a test run, or a deploy. Use `start` for servers and watchers that should outlive the call.
 
+Goals:
+- In a session goal, `monitor` blocks the goal turn until the process stops, so the goal does not spin while the process runs; the process exit resumes the goal.
+- A non-terminal `start` suspends the goal until the process exits, and the exit resumes the goal.
+- Do not explore the repository, search for a deploy, or poll with bash when the goal is to wait for a deploy, build, or CI job; schedule that wait. Do not report blocked because no deploy is visible.
+
 Lifetime options for `start`:
 - By default, the process stops when its session ends, the user switches session groups, or Kilo exits.
 - Set `inherit: true` only from a subagent when the process should transfer to the immediate parent session after the subagent ends. It then follows the parent session lifetime.
```

#### packages/opencode/src/kilocode/tool/board.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/board.ts b/packages/opencode/src/kilocode/tool/board.ts
index a96308a2a..18a1db722 100644
--- a/packages/opencode/src/kilocode/tool/board.ts
+++ b/packages/opencode/src/kilocode/tool/board.ts
@@ -60,7 +60,9 @@ const snapshot = Effect.fn("BoardTools.snapshot")(function* (
     sessions.set(job.id, { state: job.status, updated: job.started_at })
   }
   for (const [id, value] of yield* status.list()) {
-    if (value.type === "idle") continue
+    // `scheduled` is derived at the status endpoint, never stored, but it
+    // describes a session doing nothing now like `idle`.
+    if (value.type === "idle" || value.type === "scheduled") continue
     sessions.set(id, { state: value.type, updated: sessions.get(id)?.updated })
   }
   return { observedAt: Date.now(), sessions } satisfies BoardStore.Snapshot
```

#### packages/opencode/src/kilocode/tool/cancel-wakeup.txt
```diff
diff --git a/packages/opencode/src/kilocode/tool/cancel-wakeup.txt b/packages/opencode/src/kilocode/tool/cancel-wakeup.txt
index 18911d205..cf09b9c9d 100644
--- a/packages/opencode/src/kilocode/tool/cancel-wakeup.txt
+++ b/packages/opencode/src/kilocode/tool/cancel-wakeup.txt
@@ -6,6 +6,7 @@ Use this tool to:
 
 Call it with action "list" first to find the id, then action "cancel" with that id.
 Cancelling an id that is already gone is safe: the tool reports it and does not fail.
+In a session goal, a wakeup the goal waits for suspends the goal until it fires; cancelling it resumes the goal with a goal turn, or settles it with a reason the user can read.
 
 Do NOT use this tool:
 - As a poll loop while waiting — the harness wakes you when the wakeup fires
```

#### packages/opencode/src/kilocode/tool/cron-create.txt
```diff
diff --git a/packages/opencode/src/kilocode/tool/cron-create.txt b/packages/opencode/src/kilocode/tool/cron-create.txt
index bbc1fbf4f..0653840f1 100644
--- a/packages/opencode/src/kilocode/tool/cron-create.txt
+++ b/packages/opencode/src/kilocode/tool/cron-create.txt
@@ -13,6 +13,10 @@ Schedule:
 - `delay` fires once after a relative span, e.g. `30s`, `5m`, `2h`, `1d`; a bare number is seconds. A delay under 10 seconds is raised to the 10-second minimum.
 - Give exactly one of `cron`, `when`, or `delay`.
 
+Goals:
+- In a session goal, creating a task suspends the goal until it fires, including every later fire of a recurring task: the goal shows as waiting and resumes itself each time. Do not report a time-based wait as blocked when a cron task can carry the goal forward. When the session goal is to wait for a deploy, build, CI job, or other time-based event, schedule that wait immediately. Do not explore the repository, search for a deploy, or poll with bash first. Do not report blocked because no deploy is visible.
+- A one-shot `when` or `delay` wait longer than the 7-day horizon is clamped to it, and the reported next fire time shows the clamped value. A recurring `cron` schedule whose next fire falls past the task's 7-day expiry is rejected instead, not clamped.
+
 Limits and behavior:
 - A session may hold at most 10 scheduled tasks; cancel one with `cron_delete` first when it is full.
 - A task expires seven days after it is created, so a forgotten loop cannot run forever. A schedule whose next fire would fall past that expiry is rejected: pick a schedule that fires within seven days.
```


*... and more files (showing first 5)*

## opencode Changes (f416138..7945de2)

### Commits

- 7945de2 - Merge branch 'dev' of github.com:anomalyco/opencode into dev (Frank, 2026-09-28)
- 8d05153 - chore: generate (opencode-agent[bot], 2026-09-28)
- d1dc00d - feat(console): refresh Go page hero and plans to match design (#51933) (vprdev, 2026-09-28)
- 90853b2 - chore: generate (opencode-agent[bot], 2026-09-28)
- d03d6e2 - fix(console): tell referral link visitors the program has ended (#51920) (vprdev, 2026-09-28)
- 09a3aa0 - zen: jev privacy policy (Frank, 2026-09-28)
- 7f964bb - fix(stats): keep chart tooltips readable (#51898) (Adam, 2026-09-28)
- ad6c72c - chore: generate (opencode-agent[bot], 2026-09-28)
- 75e1e7a - fix(console): stop Black subscription renewals (#51884) (vprdev, 2026-09-28)
- 3c893f0 - fix(console): polish Go limits chart on mobile (#51870) (Victor Navarro, 2026-09-28)
- b76bbb3 - feat(console): compare Go and Go Plus limits side by side (#51865) (Victor Navarro, 2026-09-28)

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
- `packages/console/app/src/asset/go-ornate-dark.svg` (+0, -6)
- `packages/console/app/src/asset/go-ornate-light.svg` (+0, -6)
- `packages/console/app/src/component/go-plan-chart.css` (+106, -99)
- `packages/console/app/src/component/go-plan-chart.tsx` (+49, -59)
- `packages/console/app/src/component/icon.tsx` (+15, -10)
- `packages/console/app/src/i18n/ar.ts` (+6, -3)
- `packages/console/app/src/i18n/br.ts` (+7, -3)
- `packages/console/app/src/i18n/da.ts` (+7, -3)
- `packages/console/app/src/i18n/de.ts` (+7, -3)
- `packages/console/app/src/i18n/en.ts` (+10, -6)
- `packages/console/app/src/i18n/es.ts` (+7, -3)
- `packages/console/app/src/i18n/fr.ts` (+7, -3)
- `packages/console/app/src/i18n/it.ts` (+7, -3)
- `packages/console/app/src/i18n/ja.ts` (+6, -2)
- `packages/console/app/src/i18n/ko.ts` (+6, -2)
- `packages/console/app/src/i18n/no.ts` (+7, -3)
- `packages/console/app/src/i18n/pl.ts` (+7, -3)
- `packages/console/app/src/i18n/ru.ts` (+7, -3)
- `packages/console/app/src/i18n/th.ts` (+6, -3)
- `packages/console/app/src/i18n/tr.ts` (+7, -3)
- `packages/console/app/src/i18n/uk.ts` (+7, -3)
- `packages/console/app/src/i18n/zh.ts` (+6, -3)
- `packages/console/app/src/i18n/zht.ts` (+6, -3)
- `packages/console/app/src/routes/go/index.css` (+132, -122)
- `packages/console/app/src/routes/go/index.tsx` (+42, -106)
- `packages/console/app/src/routes/stripe/webhook.ts` (+12, -0)
- `packages/console/app/src/routes/workspace/[id]/billing/black-section.module.css` (+0, -7)
- `packages/console/app/src/routes/workspace/[id]/billing/black-section.tsx` (+2, -40)
- `packages/stats/app/src/routes/index.css` (+11, -7)
- `packages/web/src/content/docs/ar/zen.mdx` (+1, -0)
- `packages/web/src/content/docs/bs/zen.mdx` (+1, -0)
- `packages/web/src/content/docs/da/zen.mdx` (+1, -0)
- `packages/web/src/content/docs/de/zen.mdx` (+1, -0)
- `packages/web/src/content/docs/es/zen.mdx` (+1, -0)
- `packages/web/src/content/docs/fr/zen.mdx` (+1, -0)
- `packages/web/src/content/docs/it/zen.mdx` (+1, -0)
- `packages/web/src/content/docs/ja/zen.mdx` (+1, -0)
- `packages/web/src/content/docs/ko/zen.mdx` (+1, -0)
- `packages/web/src/content/docs/nb/zen.mdx` (+1, -0)
- `packages/web/src/content/docs/pl/zen.mdx` (+1, -0)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+1, -0)
- `packages/web/src/content/docs/ru/zen.mdx` (+1, -0)
- `packages/web/src/content/docs/th/zen.mdx` (+1, -0)
- `packages/web/src/content/docs/tr/zen.mdx` (+1, -0)
- `packages/web/src/content/docs/zen.mdx` (+1, -0)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+1, -0)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+1, -0)

### Key Diffs

(no key diffs to show)

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/kilo-vscode/src/agent-manager/orchestration-domain.ts
- `src/tool/background-process.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/background-process.txt changes
- `src/tool/board.ts` - update based on kilocode packages/opencode/src/kilocode/tool/board.ts changes
- `src/tool/cancel-wakeup.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/cancel-wakeup.txt changes
- `src/tool/cron-create.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/cron-create.txt changes
- `src/tool/cron-delete.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/cron-delete.txt changes
- `src/tool/cron-list.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/cron-list.txt changes
- `src/tool/cron.ts` - update based on kilocode packages/opencode/src/kilocode/tool/cron.ts changes
- `src/tool/schedule-wakeup.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/schedule-wakeup.txt changes
