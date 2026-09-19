# Upstream Changes Report
Generated: 2026-09-19 10:26:16

## Summary
- kilocode: 74 commits, 177 files changed
- opencode: 14 commits, 37 files changed

## kilocode Changes (c33d81690..a85ae672a)

### Commits

- a85ae672a - Merge pull request #13340 from rakshith1928/fix/preflight-compaction-threshold (Andrea Giammarchi, 2026-09-18)
- 02e8d3447 - Merge branch 'main' into fix/preflight-compaction-threshold (Andrea Giammarchi, 2026-09-18)
- 5857df9d0 - Merge pull request #14304 from Kilo-Org/research-and-document-kilo-memory (Marius, 2026-09-18)
- 2ee84a039 - Update packages/kilo-docs/pages/customize/context/memory.md (Alex Gold, 2026-09-18)
- d62fa025e - Update packages/kilo-docs/pages/customize/context/memory.md (Alex Gold, 2026-09-18)
- e04b397f9 - docs: document Kilo Memory on-disk storage location (kiloconnect[bot], 2026-09-18)
- 6a64c0534 - Revert "Update packages/kilo-docs/pages/customize/context/memory.md" (marius-kilocode, 2026-09-18)
- 4ed20aecd - Update packages/kilo-docs/pages/customize/context/memory.md (Alex Gold, 2026-09-18)
- 09d2cf6ff - docs: document the Kilo Memory feature (marius-kilocode, 2026-09-18)
- a8c6164a3 - Merge pull request #14292 from Kilo-Org/add-scheduled-wakeup-clock-icon (Marius, 2026-09-18)
- eb54a2fd4 - Merge pull request #14298 from Kilo-Org/chore/remove-local-comment-variant (Marius, 2026-09-18)
- cccf1af0c - Merge pull request #14299 from Kilo-Org/chore/remove-dead-message-types (Marius, 2026-09-18)
- a1f21d3c4 - Merge pull request #14297 from Kilo-Org/chore/remove-dead-project-route-api (Marius, 2026-09-18)
- 8ce815046 - Merge pull request #14300 from Kilo-Org/chore/remove-browser-automation-state (Marius, 2026-09-18)
- 307516017 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-18)
- 10b478931 - fix(vscode): keep wakeups scheduled during an in-flight seed (marius-kilocode, 2026-09-18)
- a67babddb - Merge pull request #14293 from Kilo-Org/chore/remove-small-leftovers (Marius, 2026-09-18)
- a3d5d451f - refactor(agent-manager): remove dead PR comment form props (marius-kilocode, 2026-09-18)
- 7378d5d99 - refactor(vscode): drop write-only remoteService field (marius-kilocode, 2026-09-18)
- 504888218 - refactor(agent-manager): drop unreachable route error codes (marius-kilocode, 2026-09-18)
- e00351206 - Merge pull request #14289 from Kilo-Org/chore/dedupe-spec-open-helper (Marius, 2026-09-18)
- 34340a8b4 - Merge pull request #14290 from Kilo-Org/chore/dedupe-childid-tests (Marius, 2026-09-18)
- 44e12250b - Merge pull request #14291 from Kilo-Org/chore/dedupe-worktree-finish-harness (Marius, 2026-09-18)
- 5ae2ea6d3 - Merge pull request #14288 from Kilo-Org/chore/dedupe-task-background-test (Marius, 2026-09-18)
- 3ef84734a - refactor(vscode): keep session context within the max-lines cap (marius-kilocode, 2026-09-18)
- 37d773812 - refactor(vscode): remove write-only browser automation state (marius-kilocode, 2026-09-18)
- e8bceb367 - refactor(vscode): remove dead message types and test-only helpers (marius-kilocode, 2026-09-18)
- ee1ae02ec - refactor(agent-manager): remove unused local comment variant (marius-kilocode, 2026-09-18)
- 17d787825 - refactor(agent-manager): remove dead project route api (marius-kilocode, 2026-09-18)
- 84538d039 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-18)
- 5832834aa - chore: remove small dead leftovers (marius-kilocode, 2026-09-18)
- 8c724efe5 - feat(vscode): show scheduled wakeup status in Agent Manager (marius-kilocode, 2026-09-18)
- 4ee3770cf - test(vscode): use shared fixture runner in worktree-finish test (marius-kilocode, 2026-09-18)
- c709e0350 - test(vscode): dedupe childID coverage (marius-kilocode, 2026-09-18)
- 3e8379e30 - test(vscode): share the spec open helper (marius-kilocode, 2026-09-18)
- 671e44baa - test(vscode): fold taskBackground coverage into hydration test (marius-kilocode, 2026-09-18)
- 4cfb2f87d - Merge pull request #14286 from Kilo-Org/juvenile-donkey (Marius, 2026-09-18)
- 17a5369c1 - Merge pull request #14282 from Kilo-Org/improve-injected-prompt-ui (Marius, 2026-09-18)
- 522f1f7cc - fix(vscode): match terminated retry error exactly (marius-kilocode, 2026-09-18)
- 5bbad4c2d - fix(vscode): retry terminated backend connection errors (marius-kilocode, 2026-09-18)
- dfb6fafa6 - release: v7.7.5 (kilo-maintainer[bot], 2026-09-18)
- 5a0377688 - Merge pull request #14283 from Kilo-Org/remove-experimental-plan-mode-flag (Marius, 2026-09-18)
- ce7ac1c3a - Merge commit '3a1e496434efe8efecb5597901d523ada31b4592' into remove-experimental-plan-mode-flag (marius-kilocode, 2026-09-18)
- 3a1e49643 - Merge pull request #14284 from Kilo-Org/bramble-lumber (Marius, 2026-09-18)
- e0711ed1a - Merge pull request #14279 from Kilo-Org/fix-ask-code-mode-toggle-system-prompt (Marius, 2026-09-18)
- 74748d582 - Merge pull request #14280 from Kilo-Org/investigate-session-switching-performance (Marius, 2026-09-18)
- 8601ca3cf - test(cli): expect masked heredoc patterns in permission metadata (marius-kilocode, 2026-09-18)
- b9b46a167 - Merge remote-tracking branch 'origin/improve-injected-prompt-ui' into improve-injected-prompt-ui (marius-kilocode, 2026-09-18)
- 3972504de - fix(vscode): keep injected prompts out of edit, history, and code actions (marius-kilocode, 2026-09-18)
- bab87b4ab - fix(cli): stop denying read-only bash commands with inert operators (marius-kilocode, 2026-09-18)
- f5366f4e5 - fix(cli): scope plan-to-code reminder to the code agent (marius-kilocode, 2026-09-18)
- c6f4e2a28 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-18)
- 9447d5f84 - chore: restore visual regression baseline overwritten by local reset (marius-kilocode, 2026-09-18)
- 994ac2bf2 - fix(vscode): do not collapse an injected prompt with no paragraph break (marius-kilocode, 2026-09-18)
- 18c03848a - fix(cli): remove vestigial KILO_EXPERIMENTAL_PLAN_MODE flag (marius-kilocode, 2026-09-18)
- ce01fa0b0 - refactor(cli): drop the flag-gated plan-file hint (marius-kilocode, 2026-09-18)
- 48c7b0a55 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-18)
- d0475a6f5 - feat: label prompts Kilo sends on the user's behalf (marius-kilocode, 2026-09-18)
- 205fccd09 - chore(ui): wrap the basic-tool cleanup annotation in a kilocode_change block (marius-kilocode, 2026-09-18)
- 655b13636 - test(cli): cover experimental plan-file hint and switch into plan (marius-kilocode, 2026-09-18)
- 815a81b46 - fix(vscode): release tool animations on unmount to stop transcript leak (marius-kilocode, 2026-09-18)
- cfc786a0f - fix(cli): keep agent-switch reminders in sync with the selected agent (marius-kilocode, 2026-09-18)
- bd3746d17 - Merge branch 'main' into fix/preflight-compaction-threshold (Andrea Giammarchi, 2026-09-16)
- c0677e164 - Merge branch 'main' into fix/preflight-compaction-threshold (Andrea Giammarchi, 2026-09-11)
- 415f87ee7 - chore(cli): drop dead system field from compaction types (Rakshith N, 2026-09-01)
- 030412ea0 - fix(cli): count the system prompt once in compaction estimates (Rakshith N, 2026-09-01)
- ba98e6409 - Merge remote-tracking branch 'upstream/main' into fix/preflight-compaction-threshold (Rakshith N, 2026-09-01)
- 3a2821221 - Merge remote-tracking branch 'origin/main' into fix/preflight-compaction-threshold (Rakshith N, 2026-09-01)
- e28ec562b - fix(cli): count system and tool content in compaction projection (Rakshith N, 2026-09-01)
- 54d7675f4 - fix(cli): drop the reported baseline after a cancelled response (Rakshith N, 2026-09-01)
- 937199f91 - Merge branch 'main' into fix/preflight-compaction-threshold (rakshith1928, 2026-08-27)
- 23b4a7455 - Merge branch 'main' into fix/preflight-compaction-threshold (rakshith1928, 2026-08-25)
- f607bf0e0 - fix(cli): project compaction threshold from reported usage plus new content (Rakshith N, 2026-08-24)
- f3d6d0947 - fix(cli): trigger auto-compaction at the configured context threshold (Rakshith N, 2026-08-24)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/shell-pattern.ts` (+71, -0)
- `packages/opencode/src/tool/shell.ts` (+2, -1)
- `packages/opencode/test/kilocode/tool/shell-pattern.test.ts` (+211, -0)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/flag/flag.ts` (+0, -2)

#### Other Changes
- `.changeset/disable-kilo-folder-creation.md` (+0, -5)
- `.changeset/fix-autocompaction-threshold.md` (+5, -0)
- `.changeset/injected-prompt-header.md` (+6, -0)
- `.changeset/new-worktree-mentions.md` (+0, -5)
- `.changeset/permission-response-recovery.md` (+0, -6)
- `.changeset/remove-experimental-plan-mode-flag.md` (+5, -0)
- `.changeset/retry-transient-terminated.md` (+5, -0)
- `.changeset/scheduled-wakeup-status.md` (+5, -0)
- `.changeset/worktree-prompt-commands.md` (+0, -5)
- `artifacts/glm52-rise-video/package.json` (+1, -1)
- `bun.lock` (+32, -32)
- `package.json` (+1, -1)
- `packages/client/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/httpapi-codegen/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-docs/lib/nav/customize.ts` (+4, -0)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/customize/context/memory.md` (+137, -0)
- `packages/kilo-docs/pages/customize/index.md` (+1, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/full-screen-diff-with-changes-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/user-message-injected-command-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/user-message-injected-short-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/user-message-injected-single-paragraph-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/user-message-push-auto-sent-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/user-message-push-mixed-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/session-tabs/activity-states-1280-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/session-tabs/activity-states-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/session-tabs/multiple-sessions-200-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/session-tabs/multiple-sessions-chromium-linux.png` (+2, -2)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-memory/package.json` (+1, -1)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/grow-box.tsx` (+3, -3)
- `packages/kilo-ui/src/components/icon.tsx` (+4, -0)
- `packages/kilo-ui/src/components/motion.tsx` (+16, -1)
- `packages/kilo-ui/src/components/tool-utils.ts` (+13, -4)
- `packages/kilo-vscode/CHANGELOG.md` (+25, -0)
- `packages/kilo-vscode/docs/cli-side/plan-mode-over-prompting.md` (+1, -1)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+85, -2)
- `packages/kilo-vscode/src/agent-manager/base-update.ts` (+2, -0)
- `packages/kilo-vscode/src/agent-manager/project/route.ts` (+6, -51)
- `packages/kilo-vscode/src/extension.ts` (+5, -1)
- `packages/kilo-vscode/src/kilo-provider-utils.ts` (+44, -33)
- `packages/kilo-vscode/src/kilo-provider/handlers/cloud-session.ts` (+7, -1)
- `packages/kilo-vscode/src/kilo-provider/native-tab-title.ts` (+1, -0)
- `packages/kilo-vscode/src/services/browser-automation/browser-automation-service.ts` (+3, -26)
- `packages/kilo-vscode/src/services/cli-backend/connection-service.ts` (+0, -6)
- `packages/kilo-vscode/src/services/cli-backend/connection-utils.ts` (+26, -24)
- `packages/kilo-vscode/src/services/cli-backend/retry.ts` (+9, -1)
- `packages/kilo-vscode/src/services/code-actions/register-code-actions.ts` (+3, -3)
- `packages/kilo-vscode/src/services/code-actions/register-terminal-actions.ts` (+2, -2)
- `packages/kilo-vscode/src/session-status.ts` (+34, -0)
- `packages/kilo-vscode/src/shared/browser-feedback.ts` (+0, -8)
- `packages/kilo-vscode/src/shared/injected-prompt.ts` (+72, -0)
- `packages/kilo-vscode/src/shared/review-comments.ts` (+4, -5)
- `packages/kilo-vscode/tests/fixtures/inline-comment-form.tsx` (+17, -66)
- `packages/kilo-vscode/tests/helpers/prompt-input.ts` (+12, -0)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/paste-collapse.spec.ts` (+1, -10)
- `packages/kilo-vscode/tests/prompt-undo.spec.ts` (+1, -11)
- `packages/kilo-vscode/tests/unit/agent-project-route.test.ts` (+5, -37)
- `packages/kilo-vscode/tests/unit/agent-project-sessions.test.ts` (+9, -17)
- `packages/kilo-vscode/tests/unit/background-agents.test.ts` (+3, -3)
- `packages/kilo-vscode/tests/unit/base-update.test.ts` (+3, -1)
- `packages/kilo-vscode/tests/unit/browser-feedback.test.ts` (+1, -9)
- `packages/kilo-vscode/tests/unit/connection-utils.test.ts` (+10, -0)
- `packages/kilo-vscode/tests/unit/early-message.test.ts` (+2, -2)
- `packages/kilo-vscode/tests/unit/injected-prompt.test.ts` (+73, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-route-integration.test.ts` (+0, -2)
- `packages/kilo-vscode/tests/unit/kilo-provider-session-refresh.test.ts` (+80, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-utils.test.ts` (+14, -0)
- `packages/kilo-vscode/tests/unit/native-tab-title.test.ts` (+3, -2)
- `packages/kilo-vscode/tests/unit/retry.test.ts` (+16, -0)
- `packages/kilo-vscode/tests/unit/review-comments-pr.test.ts` (+4, -5)
- `packages/kilo-vscode/tests/unit/review-comments.test.ts` (+3, -3)
- `packages/kilo-vscode/tests/unit/session-activity.test.ts` (+50, -3)
- `packages/kilo-vscode/tests/unit/session-status.test.ts` (+86, -1)
- `packages/kilo-vscode/tests/unit/session-wakeup.test.ts` (+37, -0)
- `packages/kilo-vscode/tests/unit/settings-io.test.ts` (+0, -78)
- `packages/kilo-vscode/tests/unit/task-session.test.ts` (+0, -26)
- `packages/kilo-vscode/tests/unit/task-tool-hydration.test.ts` (+4, -0)
- `packages/kilo-vscode/tests/unit/task-tool-state.test.ts` (+0, -24)
- `packages/kilo-vscode/tests/unit/worktree-finish.test.ts` (+7, -36)
- `packages/kilo-vscode/webview-ui/agent-manager/SubagentPanel.tsx` (+2, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+11, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRCommentForm.tsx` (+16, -74)
- `packages/kilo-vscode/webview-ui/src/components/chat/ChatView.tsx` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+18, -2)
- `packages/kilo-vscode/webview-ui/src/components/chat/VscodeUserMessage.tsx` (+69, -41)
- `packages/kilo-vscode/webview-ui/src/components/chat/background-agents.ts` (+1, -6)
- `packages/kilo-vscode/webview-ui/src/components/settings/settings-io.ts` (+0, -13)
- `packages/kilo-vscode/webview-ui/src/components/shared/ActivityIcon.tsx` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/context/session-types.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/context/session-utils.ts` (+6, -5)
- `packages/kilo-vscode/webview-ui/src/context/session-wakeup.ts` (+27, -0)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+8, -5)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/stories/chat.stories.tsx` (+88, -2)
- `packages/kilo-vscode/webview-ui/src/stories/session-tabs.stories.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/styles/chat.css` (+24, -0)
- `packages/kilo-vscode/webview-ui/src/types/marketplace.ts` (+0, -6)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+9, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+5, -18)
- `packages/kilo-vscode/webview-ui/src/utils/session-activity.ts` (+16, -2)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+19, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/effect/runtime-flags.ts` (+0, -1)
- `packages/opencode/src/kilocode/session/agent-switch.txt` (+5, -0)
- `packages/opencode/src/kilocode/session/ask-code-switch.txt` (+0, -6)
- `packages/opencode/src/kilocode/session/mode-reminders.ts` (+84, -0)
- `packages/opencode/src/kilocode/session/overflow.ts` (+75, -27)
- `packages/opencode/src/kilocode/session/processor.ts` (+19, -0)
- `packages/opencode/src/kilocode/session/prompt.ts` (+0, -20)
- `packages/opencode/src/session/llm.ts` (+7, -1)
- `packages/opencode/src/session/prompt.ts` (+10, -10)
- `packages/opencode/src/session/prompt/code-switch.txt` (+0, -5)
- `packages/opencode/src/session/reminders.ts` (+4, -74)
- `packages/opencode/test/effect/runtime-flags.test.ts` (+0, -1)
- `packages/opencode/test/kilocode/ask-switch-reminder.test.ts` (+0, -247)
- `packages/opencode/test/kilocode/bash-permission-metadata.test.ts` (+8, -6)
- `packages/opencode/test/kilocode/mode-reminders.test.ts` (+194, -0)
- `packages/opencode/test/kilocode/reminders-separator.test.ts` (+0, -92)
- `packages/opencode/test/kilocode/session-overflow.test.ts` (+325, -1)
- `packages/opencode/test/kilocode/session-processor-review-telemetry.test.ts` (+15, -0)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/protocol/package.json` (+1, -1)
- `packages/schema/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk-next/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/storybook/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/components/basic-tool.tsx` (+17, -4)
- `packages/ui/src/kilocode/mermaid/markdown-mermaid.stories.tsx` (+0, -4)
- `packages/ui/src/kilocode/mermaid/markdown-mermaid.ts` (+6, -35)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 85e59d136..0ef1067b2 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.7.4",
+  "version": "7.7.5",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/flag/flag.ts
```diff
diff --git a/packages/core/src/flag/flag.ts b/packages/core/src/flag/flag.ts
index e4e1f927b..c22a64d54 100644
--- a/packages/core/src/flag/flag.ts
+++ b/packages/core/src/flag/flag.ts
@@ -96,8 +96,6 @@ export const Flag = {
 
   KILO_EXPERIMENTAL_LSP_TOOL: KILO_EXPERIMENTAL || truthy("KILO_EXPERIMENTAL_LSP_TOOL"), // kilocode_change
 
-  KILO_EXPERIMENTAL_PLAN_MODE: KILO_EXPERIMENTAL || truthy("KILO_EXPERIMENTAL_PLAN_MODE"), // kilocode_change
-
   KILO_EXPERIMENTAL_SCOUT: KILO_EXPERIMENTAL || truthy("KILO_EXPERIMENTAL_SCOUT"), // kilocode_change
 
   KILO_EXPERIMENTAL_MARKDOWN: !falsy("KILO_EXPERIMENTAL_MARKDOWN"), // kilocode_change
```

#### packages/opencode/src/kilocode/tool/shell-pattern.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/shell-pattern.ts b/packages/opencode/src/kilocode/tool/shell-pattern.ts
new file mode 100644
index 000000000..ba3373032
--- /dev/null
+++ b/packages/opencode/src/kilocode/tool/shell-pattern.ts
@@ -0,0 +1,71 @@
+import type { Node } from "web-tree-sitter"
+import type { ShellID } from "@/tool/shell/id"
+
+// The read-only bash rulesets deny shell operators with globs such as `*>*`,
+// `*|*`, `*;*` and `*$(*`, which match the character anywhere in the pattern.
+// The shell tool used the raw command text as that pattern, so a `|` inside a
+// quoted grep regex or a `2>/dev/null` redirect denied a read-only command.
+//
+// `pattern` renders the permission pattern from the tree-sitter parse instead of
+// re-lexing the text. Operator characters are masked with `_` only where the
+// parser proves they are inert: inside literal tokens (quoted strings, ANSI-C
+// strings, escaped words, heredoc bodies) and inside redirects that cannot touch
+// a file (`/dev/null` targets and fd duplication such as `2>&1`). Every other
+// byte is emitted verbatim, so real operators, real redirects, `$(...)`,
+// backticks and `<(...)` still reach the blocklist. Anything the parser did not
+// classify (errors, non-bash grammars) falls back to the raw text, so the result
+// is never more permissive than the input.
+
+const MASK = "_"
+const OPERATORS = /[<>|&;$`\n]/g
+const LITERAL = new Set(["word", "number", "string_content", "raw_string", "ansi_c_string", "heredoc_start"])
+const DISCARD = new Set([">", ">>", ">|", "&>", "&>>", "<"])
+const DUP = new Set([">&", "<&"])
+const CLOSE = new Set([">&-", "<&-"])
+// Whitespace between children of these nodes is literal text, so a newline
+// there is not a command separator.
+const TEXT = new Set(["string", "heredoc_redirect"])
+
+function mask(text: string) {
+  return text.replace(OPERATORS, MASK)
+}
+
+// A redirect is inert when it writes to or reads from /dev/null, or only
+// duplicates or closes a file descriptor.
+function inert(node: Node) {
+  const op = node.children.find((child) => child && !child.isNamed)?.type
+  if (!op) return false
+  if (CLOSE.has(op)) return true
+  const target = node.children.findLast((child) => child?.isNamed)
+  if (!target || target.type === "file_descriptor") return false
+  if (DISCARD.has(op)) return target.type === "word" && target.text === "/dev/null"
+  if (DUP.has(op)) return target.type === "number" || target.text === "-"
+  return false
+}
```

#### packages/opencode/src/tool/shell.ts
```diff
diff --git a/packages/opencode/src/tool/shell.ts b/packages/opencode/src/tool/shell.ts
index 13053dc82..fc362d3cd 100644
--- a/packages/opencode/src/tool/shell.ts
+++ b/packages/opencode/src/tool/shell.ts
@@ -22,6 +22,7 @@ import { normalizeUrls } from "@/kilocode/util/url" // kilocode_change
 import { CommandTimeout } from "@/kilocode/command-timeout" // kilocode_change
 import { heredocs } from "@/kilocode/tool/shell-heredoc" // kilocode_change
 import { unparsed } from "@/kilocode/tool/shell-unparsed" // kilocode_change
+import { pattern } from "@/kilocode/tool/shell-pattern" // kilocode_change
 import { ChildProcess } from "effect/unstable/process"
 import { ChildProcessSpawner } from "effect/unstable/process/ChildProcessSpawner"
 import { ShellPrompt, type Parameters } from "./shell/prompt"
@@ -404,7 +405,7 @@ export const ShellPermission = Effect.gen(function* () {
       }
 
       if (tokens.length && (!cmd || !CWD.has(cmd))) {
-        scan.patterns.add(source(node))
+        scan.patterns.add(pattern(node, kind, source(node))) // kilocode_change - mask inert operators (quoted, /dev/null) for read-only rules
         scan.always.add(BashArity.prefix(tokens).join(" ") + " *")
       }
     }
```

#### packages/opencode/test/kilocode/tool/shell-pattern.test.ts
```diff
diff --git a/packages/opencode/test/kilocode/tool/shell-pattern.test.ts b/packages/opencode/test/kilocode/tool/shell-pattern.test.ts
new file mode 100644
index 000000000..975dd1fd7
--- /dev/null
+++ b/packages/opencode/test/kilocode/tool/shell-pattern.test.ts
@@ -0,0 +1,211 @@
+// The read-only bash rulesets deny operators with globs like `*>*` and `*|*`
+// that match anywhere in the permission pattern. The shell tool now renders
+// that pattern from the tree-sitter parse and masks operator characters only
+// where the parser proves they are inert (quoted strings, escaped words,
+// heredoc bodies, /dev/null redirects, fd duplication). These tests drive the
+// real ShellPermission scanner so quoting is decided by the parser, not by a
+// second hand-written lexer.
+
+import { AppNodeBuilder } from "@opencode-ai/core/effect/app-node-builder"
+import { afterEach, describe, expect, test } from "bun:test"
+import { Effect, Layer } from "effect"
+import { CrossSpawnSpawner } from "@opencode-ai/core/cross-spawn-spawner"
+import { FSUtil } from "@opencode-ai/core/fs-util"
+import type { PermissionV1 } from "@opencode-ai/core/v1/permission"
+import { hardenExplore, patchAgents } from "../../../src/kilocode/agent"
+import { Permission } from "../../../src/permission"
+import { ShellPermission } from "../../../src/tool/shell"
+import { SessionID, MessageID } from "../../../src/session/schema"
+import { disposeAllInstances, provideInstance, testInstanceStoreLayer, tmpdir } from "../../fixture/fixture"
+
+const layer = Layer.mergeAll(
+  AppNodeBuilder.build(CrossSpawnSpawner.node),
+  AppNodeBuilder.build(FSUtil.node),
+  testInstanceStoreLayer,
+)
+
+type Request = Omit<PermissionV1.Request, "id" | "sessionID" | "tool">
+
+async function patterns(dir: string, command: string, shell = "bash") {
+  const requests: Request[] = []
+  const ctx = {
+    sessionID: SessionID.make("ses_test"),
+    messageID: MessageID.make("msg_test"),
+    callID: "",
+    agent: "explore",
+    abort: AbortSignal.any([]),
+    messages: [],
+    metadata: () => Effect.void,
+    ask: (req: Request) =>
+      Effect.sync(() => {
+        requests.push(req)
+      }),
+  }
+  await Effect.runPromise(
```


## opencode Changes (3dd1b30..ae93d4a)

### Commits

- ae93d4a - fix(console): use v2 desktop downloads (#49931) (opencode-agent[bot], 2026-09-19)
- 9a53565 - chore: generate (opencode-agent[bot], 2026-09-19)
- 61eae88 - docs(web): add Jev models to Zen (Frank, 2026-09-19)
- 34b4c3c - fix(console): update systemone endpoints (Frank, 2026-09-19)
- 3c7f191 - fix(web): add v2 banner border and restore header hairline (Dax Raad, 2026-09-19)
- 7c22dbb - fix(web): use neutral colors for v2 banner (Dax Raad, 2026-09-19)
- 6da6d47 - fix(web): render v2 banner full width below header (Dax Raad, 2026-09-19)
- f1aacab - feat(web): add v2 announcement banner to legacy docs (Dax Raad, 2026-09-19)
- 4e1c496 - chore: generate (opencode-agent[bot], 2026-09-19)
- a6cad77 - docs: add DeepSeek V4.1 Flash to Zen (#49897) (Daniel Chen, 2026-09-18)
- ae2da69 - docs: add Qwen3.8 Flash to Zen (#49888) (Jack, 2026-09-19)
- 285cff5 - feat(console): switch install links to v2 (#49874) (Dax, 2026-09-19)
- 5f9d918 - chore: generate (opencode-agent[bot], 2026-09-18)
- 1573a7b - support jev (Frank, 2026-09-18)

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
- `packages/console/core/src/model.ts` (+1, -1)
- `packages/console/core/test/model.test.ts` (+15, -0)

#### Other Changes
- `packages/console/app/src/component/header.tsx` (+4, -4)
- `packages/console/app/src/lib/inference-proxy.ts` (+2, -0)
- `packages/console/app/src/routes/download/[channel]/[platform].ts` (+15, -4)
- `packages/console/app/src/routes/download/index.css` (+0, -92)
- `packages/console/app/src/routes/download/index.tsx` (+16, -78)
- `packages/console/app/src/routes/index.css` (+0, -71)
- `packages/console/app/src/routes/index.tsx` (+19, -23)
- `packages/console/app/src/routes/zen/go/v1/systemone.ts` (+13, -0)
- `packages/console/app/src/routes/zen/util/handler.ts` (+2, -0)
- `packages/console/app/src/routes/zen/util/provider/systemone.ts` (+30, -0)
- `packages/console/app/src/routes/zen/v1/systemone.ts` (+13, -0)
- `packages/console/app/test/providerUsage.test.ts` (+26, -0)
- `packages/web/astro.config.mjs` (+1, -0)
- `packages/web/config.mjs` (+1, -1)
- `packages/web/src/components/PageFrame.astro` (+97, -0)
- `packages/web/src/components/V2Banner.astro` (+82, -0)
- `packages/web/src/content/docs/ar/zen.mdx` (+9, -0)
- `packages/web/src/content/docs/bs/zen.mdx` (+90, -81)
- `packages/web/src/content/docs/da/zen.mdx` (+9, -0)
- `packages/web/src/content/docs/de/zen.mdx` (+90, -81)
- `packages/web/src/content/docs/es/zen.mdx` (+9, -0)
- `packages/web/src/content/docs/fr/zen.mdx` (+90, -81)
- `packages/web/src/content/docs/it/zen.mdx` (+9, -0)
- `packages/web/src/content/docs/ja/zen.mdx` (+9, -0)
- `packages/web/src/content/docs/ko/zen.mdx` (+9, -0)
- `packages/web/src/content/docs/nb/zen.mdx` (+9, -0)
- `packages/web/src/content/docs/pl/zen.mdx` (+9, -0)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+9, -0)
- `packages/web/src/content/docs/ru/zen.mdx` (+90, -81)
- `packages/web/src/content/docs/th/zen.mdx` (+9, -0)
- `packages/web/src/content/docs/tr/zen.mdx` (+90, -81)
- `packages/web/src/content/docs/zen.mdx` (+9, -0)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+9, -0)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+9, -0)
- `packages/web/src/styles/custom.css` (+27, -1)

### Key Diffs

#### packages/console/core/src/model.ts
```diff
diff --git a/packages/console/core/src/model.ts b/packages/console/core/src/model.ts
index d18ccc2..4305521 100644
--- a/packages/console/core/src/model.ts
+++ b/packages/console/core/src/model.ts
@@ -8,7 +8,7 @@ import { Actor } from "./actor"
 import { Resource } from "@opencode-ai/console-resource"
 
 export namespace ZenData {
-  const FormatSchema = z.enum(["anthropic", "google", "openai", "oa-compat"])
+  const FormatSchema = z.enum(["anthropic", "google", "openai", "oa-compat", "systemone"])
   export type Format = z.infer<typeof FormatSchema>
 
   const ModelCostSchema = z.object({
```

#### packages/console/core/test/model.test.ts
```diff
diff --git a/packages/console/core/test/model.test.ts b/packages/console/core/test/model.test.ts
index bf4204d..3c653b7 100644
--- a/packages/console/core/test/model.test.ts
+++ b/packages/console/core/test/model.test.ts
@@ -47,3 +47,18 @@ describe("ZenData cost200K threshold", () => {
     expect(entry(data).cost200K?.threshold).toBe(272_000)
   })
 })
+
+test("accepts the SystemOne provider format", () => {
+  expect(
+    ZenData.validate({
+      ...base,
+      providers: {
+        systemone: {
+          api: "https://api.typesafe.ai/v1",
+          apiKey: "test",
+          format: "systemone",
+        },
+      },
+    }).providers.systemone.format,
+  ).toBe("systemone")
+})
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/src/flag/flag.ts
- `src/tool/shell-pattern.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/shell-pattern.test.ts changes
- `src/tool/shell-pattern.ts` - update based on kilocode packages/opencode/src/kilocode/tool/shell-pattern.ts changes
- `src/tool/shell.ts` - update based on kilocode packages/opencode/src/tool/shell.ts changes
