# Upstream Changes Report
Generated: 2026-10-09 12:42:22

## Summary
- kilocode: 68 commits, 132 files changed
- opencode: 6 commits, 61 files changed

## kilocode Changes (bed08b09e..b3036eb73)

### Commits

- b3036eb73 - Merge pull request #14809 from kr1shna-exe/fix/14339-mcp-interrupted-startup (Andrea Giammarchi, 2026-10-09)
- 6e557a75e - Merge branch 'main' into fix/14339-mcp-interrupted-startup (Andrea Giammarchi, 2026-10-09)
- f9768b45a - Merge pull request #14926 from Suwanwa/fix/jetbrains-timeline-navigation (Andrea Giammarchi, 2026-10-09)
- d9c09f25d - Merge branch 'main' into fix/jetbrains-timeline-navigation (Andrea Giammarchi, 2026-10-09)
- c5da978c7 - Merge pull request #14816 from kr1shna-exe/fix/14454-single-load-prune (Andrea Giammarchi, 2026-10-09)
- ec93cb2a4 - Merge branch 'main' into fix/14454-single-load-prune (Andrea Giammarchi, 2026-10-09)
- aa3f7dd0e - Merge pull request #14524 from kimnamu/fix/bedrock-tool-result-images (Andrea Giammarchi, 2026-10-09)
- 5a0ce1c8b - Merge pull request #14830 from abdulhusainahk/fix/14823-serve-shutdown-deadline (Andrea Giammarchi, 2026-10-09)
- 97b1d457c - Merge branch 'main' into fix/bedrock-tool-result-images (Andrea Giammarchi, 2026-10-09)
- 1e9b33f62 - Merge branch 'main' into fix/14823-serve-shutdown-deadline (Andrea Giammarchi, 2026-10-09)
- 507d3bca8 - Merge pull request #14064 from cpruijsen/fix/issue-14040 (Andrea Giammarchi, 2026-10-09)
- 63ea11f7e - Merge pull request #14519 from jsilvermist/fix/vscode-drive-root-startup (Andrea Giammarchi, 2026-10-09)
- c13e32b43 - Merge pull request #14757 from thomasbrugman/fix/custom-zai-thinking (Andrea Giammarchi, 2026-10-09)
- 79981bf55 - Merge pull request #14651 from quanzhuo/issues/13983 (Andrea Giammarchi, 2026-10-09)
- c32a219df - Merge pull request #14037 from maphew/fix/cli/task-bare-model-name (Andrea Giammarchi, 2026-10-09)
- 7435a4639 - Merge pull request #14192 from maphew/fix/shell-tmp-cloud-session (Andrea Giammarchi, 2026-10-09)
- 974723450 - Merge pull request #14906 from Kilo-Org/fix/goal-command-alias (Kirill Kalishev, 2026-10-08)
- 0e7b0c290 - Merge pull request #14933 from Kilo-Org/fix/deps-next-16-3-8 (Andrea Giammarchi, 2026-10-08)
- c0c76aceb - Merge pull request #14932 from Kilo-Org/refactor-integrated-browser-performance (Marius, 2026-10-08)
- 8c212e024 - Merge pull request #14934 from Kilo-Org/update-sidebar-pr-view-icon (Marius, 2026-10-08)
- 6e033dc59 - fix(vscode): use open-in-browser icon for PR panel (marius-kilocode, 2026-10-08)
- 3bf8951f4 - fix(deps): Update Next.js due Dependabot alerts (webreflection, 2026-10-08)
- afb1a1835 - Merge pull request #14930 from Kilo-Org/add-subagent-open-tooltip (Marius, 2026-10-08)
- ffb299bdc - Merge pull request #14929 from Kilo-Org/chore/community-triage-followups (Bruno Agatão, 2026-10-08)
- f852d1717 - feat(vscode): show page cursors in integrated browser preview (marius-kilocode, 2026-10-08)
- 098837142 - fix(vscode): add tooltip to subagent open button (marius-kilocode, 2026-10-08)
- 6b854c749 - chore: run community triage tests in CI and skip needs-triage on reopen (Bruno Agatao, 2026-10-08)
- f906f877b - Merge pull request #14928 from Kilo-Org/reorder-projects-agent-manager (Marius, 2026-10-08)
- 528cf7e04 - Merge pull request #14914 from Kilo-Org/chore-improve-community-contributions-setup (Bruno Agatão, 2026-10-08)
- e1d3583e1 - Merge pull request #14528 from Kilo-Org/fix/agent-tool-explicit-session-intent (Marius, 2026-10-08)
- 791e733d0 - fix: allow small clock skew for commit dates in community triage (Bruno Agatao, 2026-10-08)
- 6522b4a57 - feat(agent-manager): reorder projects with drag and drop (marius-kilocode, 2026-10-08)
- 307b88fad - fix: ignore future-dated commits in community triage (Bruno Agatao, 2026-10-08)
- 0e842fa9c - fix: harden community triage lookups and classification (Bruno Agatao, 2026-10-08)
- 297abe6c2 - fix(jetbrains): restore session timeline navigation (Suwanwa, 2026-10-08)
- 3123b1a57 - fix: remove duplicate component dropdown from feature request (Bruno Agatao, 2026-10-08)
- 6794e2346 - fix: address review feedback on community triage (Bruno Agatao, 2026-10-08)
- 89a01cf23 - chore: add community PR and issue triage automation (Bruno Agatao, 2026-10-08)
- 2dd87e7bb - fix(cli): expose a reserved command-name clash as /goal:command (kirillk, 2026-10-07)
- 2f0f29cf8 - Merge branch 'main' into fix/agent-tool-explicit-session-intent (Andrea Giammarchi, 2026-10-06)
- e38a045c6 - fix(cli): bound serve shutdown after signals (Abdul Kanchwala, 2026-10-06)
- 3ad45fdcf - fix(cli): reuse the loaded transcript when pruning large payloads (Krishna, 2026-10-06)
- 6acd854af - test(cli): wait for the stored MCP client instead of sleeping (Krishna, 2026-10-06)
- 3b0be767c - fix(cli): clean up MCP servers when their startup is interrupted (Krishna, 2026-10-05)
- 42eb7f9f7 - fix(cli): resolve main conflict and tighten agent session intent wording (Bruno Agatao, 2026-10-05)
- 15c38488e - Merge branch 'main' into fix/cli/task-bare-model-name (matt wilkie, 2026-10-04)
- e8ca36cbf - Merge branch 'main' into fix/shell-tmp-cloud-session (matt wilkie, 2026-10-04)
- f6236e601 - Merge branch 'main' into fix/custom-zai-thinking (Thomas Brugman, 2026-10-02)
- f01c7ddb0 - fix(cli): limit Z.ai thinking defaults to built-in providers (Thomas Brugman, 2026-10-02)
- 27f72dd17 - fix(cli): avoid duplicate compaction overflow errors (全卓, 2026-09-29)
- 07848e1a2 - fix(cli): surface terminal compaction failures (全卓, 2026-09-29)
- 5b09118e8 - Merge remote-tracking branch 'upstream/main' into fix/cli/task-bare-model-name (matt wilkie, 2026-09-28)
- 65d0234c5 - Merge remote-tracking branch 'upstream/main' into fix/shell-tmp-cloud-session (matt wilkie, 2026-09-28)
- c66d1a01d - Merge branch 'main' into fix/shell-tmp-cloud-session (matt wilkie, 2026-09-28)
- 7c105b567 - Merge branch 'main' into fix/shell-tmp-cloud-session (Andrea Giammarchi, 2026-09-28)
- 348a46fd0 - test(cli): cover slash display-name branch in task model tests (maphew, 2026-09-27)
- 4abafa9de - fix(cli): resolve slash-containing task model names from the catalog (maphew, 2026-09-27)
- ca197fdd7 - fix(cli): match bare task model names by id before display name (maphew, 2026-09-27)
- 4ed8e7b46 - fix(cli): resolve bare model names for task subagents (maphew, 2026-09-27)
- 88239c6c0 - fix(opencode): drop unused Global import in shell prompt (maphew, 2026-09-27)
- 4290338d8 - fix(opencode): address review - extract shell tmp to kilocode mirror (maphew, 2026-09-27)
- 9c96d6104 - fix(opencode): point cloud sessions at a permitted temp dir (maphew, 2026-09-27)
- c4f99e4a1 - test(cli): trim the Bedrock tool-result image test fixture (kimnamu, 2026-09-24)
- 6f90fe19f - fix(cli): require explicit user intent before starting Agent Manager sessions or worktrees (kiloconnect[bot], 2026-09-24)
- adf502643 - fix(cli): send tool-result images as user content for Bedrock GPT-6 models (kimnamu, 2026-09-24)
- 2f2d46408 - test(vscode): verify existing directory guard across platforms (Jason Allen, 2026-09-23)
- 46428e718 - fix(vscode): start the backend in Windows drive-root workspaces (Jason Allen, 2026-09-23)
- 1ed91edf7 - fix(cli): avoid false frontmatter errors when saving command files (Christopher Pruijsen, 2026-09-12)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/agent-manager.txt` (+1, -1)
- `packages/opencode/src/kilocode/tool/shell-tmp.ts` (+31, -0)
- `packages/opencode/src/kilocode/tool/task.ts` (+73, -4)
- `packages/opencode/src/tool/shell/prompt.ts` (+2, -2)
- `packages/opencode/src/tool/task.ts` (+1, -0)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
(no changes)

#### Other Changes
- `.changeset/agent-manager-project-reorder.md` (+5, -0)
- `.changeset/agent-session-explicit-intent.md` (+5, -0)
- `.changeset/bedrock-tool-result-images.md` (+5, -0)
- `.changeset/cloud-session-shell-tmp.md` (+5, -0)
- `.changeset/command-frontmatter-instance.md` (+5, -0)
- `.changeset/custom-zai-thinking.md` (+5, -0)
- `.changeset/fix-compaction-terminal-errors.md` (+5, -0)
- `.changeset/fix-vscode-drive-root-startup.md` (+5, -0)
- `.changeset/goal-command-alias.md` (+5, -0)
- `.changeset/jetbrains-timeline-navigation.md` (+5, -0)
- `.changeset/mcp-interrupted-startup.md` (+5, -0)
- `.changeset/native-browser-feedback.md` (+5, -0)
- `.changeset/pr-panel-open-browser-icon.md` (+5, -0)
- `.changeset/serve-shutdown-deadline.md` (+5, -0)
- `.changeset/single-load-payload-prune.md` (+5, -0)
- `.changeset/subagent-open-tooltip.md` (+5, -0)
- `.changeset/task-bare-model-name.md` (+5, -0)
- `.github/ISSUE_TEMPLATE/bug-report.yml` (+20, -0)
- `.github/ISSUE_TEMPLATE/feature-request.yml` (+20, -0)
- `.github/pull_request_template.md` (+2, -0)
- `.github/workflows/community-label.yml` (+47, -0)
- `.github/workflows/community-sweep.yml` (+67, -0)
- `.github/workflows/community-triage-test.yml` (+36, -0)
- `CONTRIBUTING.md` (+2, -0)
- `bun.lock` (+11, -11)
- `docs/community-triage.md` (+157, -0)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/automate/extending/plugins.md` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/agents/goals.md` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/agents/model-selection.md` (+2, -0)
- `packages/kilo-docs/pages/customize/workflows.md` (+4, -0)
- `packages/kilo-docs/pnpm-lock.yaml` (+44, -44)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/scroll/SessionScroll.kt` (+17, -7)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/SessionHeaderPanel.kt` (+3, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/TimelinePanel.kt` (+19, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionScrollTest.kt` (+62, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/header/SessionHeaderPanelTest.kt` (+44, -1)
- `packages/kilo-vscode/src/agent-manager/browser-lifecycle.ts` (+5, -0)
- `packages/kilo-vscode/src/agent-manager/project/messages.ts` (+9, -0)
- `packages/kilo-vscode/src/agent-manager/project/registry.ts` (+23, -0)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+21, -1)
- `packages/kilo-vscode/src/browser-tab/BrowserTabProvider.ts` (+11, -1)
- `packages/kilo-vscode/src/services/browser-automation/browser-broker.ts` (+13, -0)
- `packages/kilo-vscode/src/services/browser-automation/browser-stream.ts` (+181, -0)
- `packages/kilo-vscode/src/services/cli-backend/server-manager.ts` (+2, -2)
- `packages/kilo-vscode/src/services/cli-backend/server-utils.ts` (+6, -0)
- `packages/kilo-vscode/src/shared/browser-stream.ts` (+43, -0)
- `packages/kilo-vscode/tests/fixtures/browser-panel-render.tsx` (+84, -1)
- `packages/kilo-vscode/tests/unit/agent-project-messages.test.ts` (+29, -0)
- `packages/kilo-vscode/tests/unit/browser-message.test.ts` (+45, -0)
- `packages/kilo-vscode/tests/unit/browser-stream.test.ts` (+197, -3)
- `packages/kilo-vscode/tests/unit/project-order.test.ts` (+55, -0)
- `packages/kilo-vscode/tests/unit/server-cwd.test.ts` (+47, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/BrowserPanel.tsx` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectList.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectsSection.tsx` (+182, -65)
- `packages/kilo-vscode/webview-ui/agent-manager/SidebarSectionHeader.tsx` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+39, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRPanel.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/project-order.ts` (+49, -0)
- `packages/kilo-vscode/webview-ui/browser-tab/messages.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/browser/StreamViewport.tsx` (+10, -1)
- `packages/kilo-vscode/webview-ui/browser/adapter.ts` (+6, -1)
- `packages/kilo-vscode/webview-ui/browser/controller.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/browser/index.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/browser/types.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskToolExpanded.tsx` (+12, -8)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/stories/agent-manager.stories.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+14, -1)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+7, -0)
- `packages/opencode/src/cli/cmd/serve.ts` (+7, -0)
- `packages/opencode/src/command/index.ts` (+3, -1)
- `packages/opencode/src/effect/instance-state.ts` (+5, -1)
- `packages/opencode/src/kilocode/command/reserved.ts` (+42, -7)
- `packages/opencode/src/kilocode/config-validation.ts` (+7, -6)
- `packages/opencode/src/kilocode/effect/instance-state.ts` (+9, -0)
- `packages/opencode/src/kilocode/mcp/cleanup.ts` (+45, -0)
- `packages/opencode/src/kilocode/session/compaction-chunks.ts` (+2, -1)
- `packages/opencode/src/kilocode/session/prompt.ts` (+1, -1)
- `packages/opencode/src/mcp/index.ts` (+2, -0)
- `packages/opencode/src/provider/transform.ts` (+1, -1)
- `packages/opencode/src/session/compaction.ts` (+40, -17)
- `packages/opencode/src/session/message-v2.ts` (+7, -1)
- `packages/opencode/src/session/processor.ts` (+4, -1)
- `packages/opencode/src/session/prompt.ts` (+7, -13)
- `packages/opencode/test/kilocode/agent-manager-tool.test.ts` (+7, -0)
- `packages/opencode/test/kilocode/bedrock-tool-result-images.test.ts` (+70, -0)
- `packages/opencode/test/kilocode/cli/cmd/serve-shutdown.test.ts` (+104, -0)
- `packages/opencode/test/kilocode/command/reserved.test.ts` (+110, -8)
- `packages/opencode/test/kilocode/config-validation.test.ts` (+51, -2)
- `packages/opencode/test/kilocode/fixture/mcp-pid-stdio.ts` (+36, -0)
- `packages/opencode/test/kilocode/instance-state-interrupt.test.ts` (+56, -0)
- `packages/opencode/test/kilocode/mcp-interrupted-state.test.ts` (+87, -0)
- `packages/opencode/test/kilocode/provider/custom-zai-thinking.test.ts` (+55, -0)
- `packages/opencode/test/kilocode/server/command-reserved.test.ts` (+3, -0)
- `packages/opencode/test/kilocode/session-compaction-cap.test.ts` (+157, -2)
- `packages/opencode/test/kilocode/session-compaction-chunks.test.ts` (+30, -13)
- `packages/opencode/test/kilocode/session-prompt-compaction-safety.test.ts` (+41, -2)
- `packages/opencode/test/kilocode/session-pruning.test.ts` (+44, -0)
- `packages/opencode/test/kilocode/session/goal.test.ts` (+37, -20)
- `packages/opencode/test/kilocode/tool-shell-prompt.test.ts` (+93, -0)
- `packages/opencode/test/kilocode/tool-task-model.test.ts` (+202, -7)
- `script/check-workflows.ts` (+3, -0)
- `script/kilocode/community-triage.test.ts` (+167, -0)
- `script/kilocode/community-triage.ts` (+528, -0)

### Key Diffs

#### packages/opencode/src/kilocode/tool/agent-manager.txt
```diff
diff --git a/packages/opencode/src/kilocode/tool/agent-manager.txt b/packages/opencode/src/kilocode/tool/agent-manager.txt
index 1e1406583..38d53d65f 100644
--- a/packages/opencode/src/kilocode/tool/agent-manager.txt
+++ b/packages/opencode/src/kilocode/tool/agent-manager.txt
@@ -10,7 +10,7 @@ Permission blockers are separate from questions: a session may report `attention
 
 For any assignment request, the required sequence is: (1) call `agent_manager` with `{ "action": "list" }`; (2) read the returned `sections[].id`, `sections[].worktrees[].session.id` or `sessions[].id`, and `ungrouped[].session.id` or `sessions[].sessions[].id`; (3) call `agent_manager` with `{ "action": "move", "sessionID": "<returned session id>", "sectionID": "<returned section id>" }` once for each worktree; (4) use `sectionID: null` to unassign. Never invent IDs, use section names instead of IDs, or edit `.kilo/agent-manager.json`. The `list` result is the source of truth for IDs and assignments: each `sections` entry includes the section `id`, name, and its assigned `worktrees`; each worktree includes its worktree `id` and its session ID(s) in `session` or `sessions`; `ungrouped` lists worktrees that have no section; and `local.sessions` lists local sessions that cannot be assigned to a section. For `move`, pass the target session's ID as `sessionID` and a section ID as `sectionID`; pass `null` to unassign it. Optional filters can narrow by section ID or by `idle`, `busy`, `retry`, `offline`, or `waiting` state. Prompting, stopping, and moving are targeted only: they do not broadcast or create sessions, and prompting does not wait for the target to finish. Prompts to busy or retrying sessions are queued behind active work instead of rejected; you do not need to wait for idle before prompting. Moving a session moves its whole worktree, including multi-version siblings; local sessions cannot be assigned to a section.
 
-To start sessions, keep using the existing `mode` and `tasks` input without an action. Use start mode when the user explicitly asks you to fan out work into Agent Manager, create Agent Manager worktrees, or start multiple Agent Manager sessions for independent tasks.
+To start sessions, keep using the existing `mode` and `tasks` input without an action. Start sessions only when the user explicitly asks for new Agent Manager sessions or worktrees, or after you confirm with the user first. Never start them on your own to parallelize, delegate, or organize routine work: each session is user-visible and each worktree costs disk space and tokens.
 
 Modes:
 - `worktree`: creates a new Agent Manager git worktree for each task, like the New Worktree dialog.
```

#### packages/opencode/src/kilocode/tool/shell-tmp.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/shell-tmp.ts b/packages/opencode/src/kilocode/tool/shell-tmp.ts
new file mode 100644
index 000000000..8dc26be89
--- /dev/null
+++ b/packages/opencode/src/kilocode/tool/shell-tmp.ts
@@ -0,0 +1,31 @@
+// Cloud sessions allowlist a session-scoped temp dir instead of the shared one.
+//
+// The platform injects `external_directory` rules permitting only
+// `/tmp/<SESSION_ID>/**` (plus a few session-scoped roots) and denying
+// everything else, while the bash tool description otherwise advertises the
+// shared `Global.Path.tmp`. Naming the session dir here keeps the guidance
+// within the permitted set.
+import fs from "node:fs"
+import path from "path"
+import { Global } from "@opencode-ai/core/global"
+
+// The allowlist root is the literal `/tmp`, not `os.tmpdir()`: `os.tmpdir()`
+// follows `TMPDIR`, so deriving from it could point the model back at a denied
+// path if that override ever reaches the server process.
+const ALLOWLIST_ROOT = "/tmp"
+
+export function sessionTmp() {
+  const cloud = process.env["KILO_CLOUD_AGENT"]?.toLowerCase()
+  if (cloud !== "true" && cloud !== "1") return Global.Path.tmp
+  const session = process.env.SESSION_ID
+  if (!session || !/^[A-Za-z0-9_-]+$/.test(session)) return Global.Path.tmp
+  const dir = path.join(ALLOWLIST_ROOT, session)
+  try {
+    fs.mkdirSync(dir, { recursive: true, mode: 0o700 })
+    // lstat, not stat: a pre-existing symlink must not redirect the advertised dir
+    if (!fs.lstatSync(dir).isDirectory()) return Global.Path.tmp
+    return dir
+  } catch {
+    return Global.Path.tmp
+  }
+}
```

#### packages/opencode/src/kilocode/tool/task.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/task.ts b/packages/opencode/src/kilocode/tool/task.ts
index 3580c71e4..dc22d32e7 100644
--- a/packages/opencode/src/kilocode/tool/task.ts
+++ b/packages/opencode/src/kilocode/tool/task.ts
@@ -35,6 +35,9 @@ const ModelState = z
   .passthrough()
 
 export namespace KiloTask {
+  export const usageDescription =
+    "Subagents launched with this tool are internal to the current session and create no worktrees or interactive sessions. To start visible Agent Manager sessions, use `agent_manager` only when the user explicitly asks."
+
   export const ModelFields = {
     model: Schema.optional(Schema.NullOr(Schema.String)).annotate({
       description:
@@ -173,12 +176,60 @@ export namespace KiloTask {
   function parse(value: string | null | undefined): Model | undefined {
     if (!value) return undefined
     const [providerID, ...parts] = value.split("/")
+    const modelID = parts.join("/")
+    if (!providerID || !modelID) return undefined
     return {
       providerID: ProviderV2.ID.make(providerID),
-      modelID: ModelV2.ID.make(parts.join("/")),
+      modelID: ModelV2.ID.make(modelID),
     }
   }
 
+  /**
+   * Resolve a configured model reference. A value is matched against the
+   * provider catalog by qualified `provider/model` key, model ID, then display
+   * name, preferring the parent session's provider so a custom provider's
+   * display name (e.g. "codestral (latest)") resolves to that provider's model
+   * instead of failing with an empty model ID. A model ID or display name may
+   * itself contain `/`, so the catalog is consulted before a slash is treated
+   * as a provider separator. Unresolvable or ambiguous names log a warning and
+   * resolve to undefined, so the caller falls back to the next model source.
+   */
+  const resolve = Effect.fn("KiloTask.resolve")(function* (input: {
+    value: string
+    preferred: string
+    provider: Provider.Interface
+  }) {
+    const value = input.value.trim()
+    if (!value) return undefined
+    const providers = yield* input.provider.list()
+    const all = Object.values(providers).flatMap((provider) =>
+      Object.values(provider.models).map((model) => ({ providerID: provider.id, model })),
+    )
+    const query = value.toLowerCase()
+    const keys = all.filter((item) => `${item.providerID}/${item.model.id}`.toLowerCase() === query)
```

#### packages/opencode/src/tool/shell/prompt.ts
```diff
diff --git a/packages/opencode/src/tool/shell/prompt.ts b/packages/opencode/src/tool/shell/prompt.ts
index e8c048331..3dd013708 100644
--- a/packages/opencode/src/tool/shell/prompt.ts
+++ b/packages/opencode/src/tool/shell/prompt.ts
@@ -1,7 +1,7 @@
 import { Schema } from "effect"
 import DESCRIPTION from "./shell.txt"
 import { PositiveInt } from "@opencode-ai/core/schema"
-import { Global } from "@opencode-ai/core/global"
+import { sessionTmp } from "@/kilocode/tool/shell-tmp" // kilocode_change
 import { ShellID } from "./id"
 
 const PS = new Set(["powershell", "pwsh"])
@@ -296,7 +296,7 @@ export function render(name: string, platform: NodeJS.Platform, limits: Limits,
       intro: selected.intro,
       os: platform,
       shell: name,
-      tmp: Global.Path.tmp,
+      tmp: sessionTmp(), // kilocode_change - session-scoped temp dir in cloud sessions
       workdirSection: selected.workdirSection,
       commandSection: selected.commandSection,
       gitCommands: selected.gitCommands,
```

#### packages/opencode/src/tool/task.ts
```diff
diff --git a/packages/opencode/src/tool/task.ts b/packages/opencode/src/tool/task.ts
index d37e74eb9..8c352eae9 100644
--- a/packages/opencode/src/tool/task.ts
+++ b/packages/opencode/src/tool/task.ts
@@ -526,6 +526,7 @@ export const TaskTool = Tool.define(
     return {
       description: [
         DESCRIPTION,
+        KiloTask.usageDescription,
         ...(flags.experimentalBackgroundSubagents ? [BACKGROUND_DESCRIPTION] : []),
         KiloTask.modelDescription,
       ].join("\n\n"),
```


## opencode Changes (5d9cd9b..3884062)

### Commits

- 3884062 - docs(web): remove Fledge Alpha Free from Zen docs (#53984) (Daniel Chen, 2026-10-08)
- 687664c - refactor(console): proxy every keyless free Zen model to new inference (#53967) (Victor Navarro, 2026-10-08)
- 9c1fdf8 - feat(console): proxy remaining free Zen models and keep proxied 404 errors (#53963) (Victor Navarro, 2026-10-08)
- fa0073c - chore: generate (opencode-agent[bot], 2026-10-08)
- 03146da - feat(opencode): add Step 5 Free content (#53898) (Jack, 2026-10-08)
- 5a8c1d8 - feat(console): proxy more keyless free Zen models to new inference (#53959) (Victor Navarro, 2026-10-08)

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
- `packages/console/app/src/component/go-models.ts` (+12, -5)
- `packages/console/app/src/component/icon.tsx` (+67, -2)
- `packages/console/app/src/i18n/ar.ts` (+1, -0)
- `packages/console/app/src/i18n/br.ts` (+1, -0)
- `packages/console/app/src/i18n/da.ts` (+1, -0)
- `packages/console/app/src/i18n/de.ts` (+1, -0)
- `packages/console/app/src/i18n/en.ts` (+1, -0)
- `packages/console/app/src/i18n/es.ts` (+1, -0)
- `packages/console/app/src/i18n/fr.ts` (+1, -0)
- `packages/console/app/src/i18n/it.ts` (+1, -0)
- `packages/console/app/src/i18n/ja.ts` (+1, -0)
- `packages/console/app/src/i18n/ko.ts` (+1, -0)
- `packages/console/app/src/i18n/no.ts` (+1, -0)
- `packages/console/app/src/i18n/pl.ts` (+1, -0)
- `packages/console/app/src/i18n/ru.ts` (+1, -0)
- `packages/console/app/src/i18n/th.ts` (+1, -0)
- `packages/console/app/src/i18n/tr.ts` (+1, -0)
- `packages/console/app/src/i18n/uk.ts` (+1, -0)
- `packages/console/app/src/i18n/zh.ts` (+1, -0)
- `packages/console/app/src/i18n/zht.ts` (+1, -0)
- `packages/console/app/src/lib/inference-proxy.ts` (+4, -1)
- `packages/console/app/src/routes/go/index.css` (+30, -3)
- `packages/console/app/src/routes/go/index.tsx` (+19, -0)
- `packages/console/app/src/routes/workspace/[id]/go/lite-section.tsx` (+1, -0)
- `packages/console/app/src/routes/zen/util/handler.ts` (+2, -4)
- `packages/web/src/content/docs/ar/go.mdx` (+9, -0)
- `packages/web/src/content/docs/ar/zen.mdx` (+3, -4)
- `packages/web/src/content/docs/bs/go.mdx` (+9, -0)
- `packages/web/src/content/docs/bs/zen.mdx` (+3, -4)
- `packages/web/src/content/docs/da/go.mdx` (+9, -0)
- `packages/web/src/content/docs/da/zen.mdx` (+3, -4)
- `packages/web/src/content/docs/de/go.mdx` (+9, -0)
- `packages/web/src/content/docs/de/zen.mdx` (+3, -4)
- `packages/web/src/content/docs/es/go.mdx` (+9, -0)
- `packages/web/src/content/docs/es/zen.mdx` (+3, -4)
- `packages/web/src/content/docs/fr/go.mdx` (+9, -0)
- `packages/web/src/content/docs/fr/zen.mdx` (+3, -4)
- `packages/web/src/content/docs/go.mdx` (+9, -0)
- `packages/web/src/content/docs/it/go.mdx` (+9, -0)
- `packages/web/src/content/docs/it/zen.mdx` (+3, -4)
- `packages/web/src/content/docs/ja/go.mdx` (+9, -0)
- `packages/web/src/content/docs/ja/zen.mdx` (+3, -4)
- `packages/web/src/content/docs/ko/go.mdx` (+9, -0)
- `packages/web/src/content/docs/ko/zen.mdx` (+3, -4)
- `packages/web/src/content/docs/nb/go.mdx` (+9, -0)
- `packages/web/src/content/docs/nb/zen.mdx` (+3, -4)
- `packages/web/src/content/docs/pl/go.mdx` (+9, -0)
- `packages/web/src/content/docs/pl/zen.mdx` (+3, -4)
- `packages/web/src/content/docs/pt-br/go.mdx` (+9, -0)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+3, -4)
- `packages/web/src/content/docs/ru/go.mdx` (+9, -0)
- `packages/web/src/content/docs/ru/zen.mdx` (+3, -4)
- `packages/web/src/content/docs/th/go.mdx` (+9, -0)
- `packages/web/src/content/docs/th/zen.mdx` (+3, -4)
- `packages/web/src/content/docs/tr/go.mdx` (+9, -0)
- `packages/web/src/content/docs/tr/zen.mdx` (+3, -4)
- `packages/web/src/content/docs/zen.mdx` (+3, -4)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+9, -0)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+3, -4)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+9, -0)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+3, -4)

### Key Diffs

(no key diffs to show)

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/tool/agent-manager.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager.txt changes
- `src/tool/prompt.ts` - update based on kilocode packages/opencode/src/tool/shell/prompt.ts changes
- `src/tool/shell-tmp.ts` - update based on kilocode packages/opencode/src/kilocode/tool/shell-tmp.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/kilocode/tool/task.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/tool/task.ts changes
