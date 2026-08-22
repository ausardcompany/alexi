# Upstream Changes Report
Generated: 2026-08-22 06:39:59

## Summary
- kilocode: 118 commits, 302 files changed
- opencode: 26 commits, 121 files changed

## kilocode Changes (fe760ab02..ff74e2ea3)

### Commits

- ff74e2ea3 - Merge pull request #11611 from Kilo-Org/feat/provider-usage-center (Kirill Kalishev, 2026-08-21)
- 7ce4b20d5 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-08-21)
- a41cdd4b3 - fix: sync bun.lock workspace versions after merge (kirillk, 2026-08-21)
- c0a86f9a0 - Merge remote-tracking branch 'origin/main' into feat/provider-usage-center (kirillk, 2026-08-21)
- 097a922ec - fix(vscode): align slash command selection with display order (#13188) (LCZcn96, 2026-08-21)
- ed150aedd - Merge pull request #13275 from Kilo-Org/chore/jetbrains-cli-pin-v7.4.23 (Kirill Kalishev, 2026-08-21)
- 671a73de9 - Merge pull request #13306 from Kilo-Org/show-agent-changes-in-sidebar (Marius, 2026-08-21)
- c171b12fc - fix(vscode): use a minimum prompt input gutter (#13310) (Marius, 2026-08-21)
- 871b5276a - Merge pull request #13221 from Kilo-Org/make-pty-processes-durable-across-reloads (Marius, 2026-08-21)
- 03396c43e - fix(agent-manager): satisfy merged app line limit (marius-kilocode, 2026-08-21)
- f94d0e4d4 - Merge remote-tracking branch 'origin/main' into show-agent-changes-in-sidebar (marius-kilocode, 2026-08-21)
- cf400ab18 - Merge pull request #13309 from Kilo-Org/fix-column-prefix-model-search (Marius, 2026-08-21)
- 04c3e2abd - Merge pull request #13304 from Kilo-Org/fix-agent-manager-multi-project-session-loading (Marius, 2026-08-21)
- a04b09395 - fix(agent-manager): address edit preview review findings (marius-kilocode, 2026-08-21)
- fd0b63961 - fix(model-selector): match colon-prefixed names (marius-kilocode, 2026-08-21)
- ed0602167 - refactor(agent-manager): clarify PTY cleanup lifecycle names (marius-kilocode, 2026-08-21)
- 35d9933eb - fix(agent-manager): stay within app line limit (marius-kilocode, 2026-08-21)
- a503e2a68 - Merge remote-tracking branch 'origin/main' into show-agent-changes-in-sidebar (marius-kilocode, 2026-08-21)
- 904d3e9b3 - fix(agent-manager): address review feedback (marius-kilocode, 2026-08-21)
- abcb6cb59 - feat(agent-manager): preview edits in side panel (marius-kilocode, 2026-08-21)
- 7a448d7fa - Merge remote-tracking branch 'origin/main' into fix-agent-manager-multi-project-session-loading (marius-kilocode, 2026-08-21)
- 6e5571409 - fix(agent-manager): scope multi-project session state (marius-kilocode, 2026-08-21)
- f958a5a56 - Merge pull request #13301 from Kilo-Org/fix/max-steps-user-message (Christiaan Arnoldus, 2026-08-21)
- a3c591e1e - Merge pull request #13255 from Kilo-Org/branch-pick (Kirill Kalishev, 2026-08-21)
- 13f16969a - fix(llm): preserve coalescing helper types (chrarnoldus, 2026-08-21)
- 406c1910b - refactor(llm): share user message coalescing (chrarnoldus, 2026-08-21)
- 4fd330fbe - Merge pull request #13272 from Kilo-Org/fix-long-code-references-in-pr-comments (Marius, 2026-08-21)
- 705f6b7da - test(llm): expect coalesced Gemini user content (chrarnoldus, 2026-08-21)
- 5caa48b30 - Merge pull request #13287 from Kilo-Org/fix/jetbrains-slash-completion-fast-typing (Kirill Kalishev, 2026-08-21)
- 1663c27e7 - fix(llm): preserve provider message alternation (chrarnoldus, 2026-08-21)
- 43c449156 - fix(cli): send max-step instruction as user message (chrarnoldus, 2026-08-21)
- b39277a45 - refactor(jetbrains): unify changes card open action; add sub-agent translations (kirillk, 2026-08-20)
- b743c0084 - Merge remote-tracking branch 'origin/main' into branch-pick (kirillk, 2026-08-20)
- 009dd1947 - fix(jetbrains): keep task open action in the non-fit left group (kirillk, 2026-08-20)
- aac28987e - fix(jetbrains): bound task popup instead of resizing the frame (kirillk, 2026-08-20)
- 09a08fbac - fix(jetbrains): stabilize slash completion (kirillk, 2026-08-20)
- 61f389297 - feat(jetbrains): live sub-agent body in collapsed task popup (kirillk, 2026-08-20)
- ba87c7285 - chore(jetbrains): sync bun.lock version to 7.4.22 (kirillk, 2026-08-20)
- 1f669a73b - fix(jetbrains): place sub-agent open action after summary text (kirillk, 2026-08-20)
- b65d11a45 - fix(jetbrains): open sub-agent via shared header open action (kirillk, 2026-08-20)
- f6ccea49b - fix(jetbrains): register subagent editor kind before VFS open (kirillk, 2026-08-20)
- 45afcce46 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-08-20)
- 4ff744f2d - Merge origin/main into fix-long-code-references-in-pr-comments (marius-kilocode, 2026-08-20)
- b08c42175 - fix(agent-manager): address PTY cleanup review findings (marius-kilocode, 2026-08-20)
- 43b0857d3 - Merge branch 'main' into make-pty-processes-durable-across-reloads (marius-kilocode, 2026-08-20)
- 00640da67 - chore(jetbrains): bump CLI pin to v7.4.23 (kilo-maintainer[bot], 2026-08-20)
- 58c6d689c - fix(agent-manager): start PR polling during hydration (marius-kilocode, 2026-08-20)
- 3f770e66f - fix(agent-manager): harden PR refresh state (marius-kilocode, 2026-08-20)
- a9e9570b6 - test(vscode): add PR comment context story data (marius-kilocode, 2026-08-20)
- c941aa399 - fix(agent-manager): stabilize PR review comments (marius-kilocode, 2026-08-20)
- cbd4b1cbf - feat(jetbrains): open sub-agent sessions in editor tabs (kirillk, 2026-08-19)
- 80382209e - fix(agent-manager): prevent PTYs escaping worktree cleanup (marius-kilocode, 2026-08-19)
- dac894dae - fix(provider-usage): address review feedback (Josh Lambert, 2026-08-18)
- aa7488dd5 - Merge remote-tracking branch 'origin/main' into refactor/provider-usage-center-split (Josh Lambert, 2026-08-12)
- c6dfb18f5 - fix(vscode): reload usage after invalidation (Josh Lambert, 2026-08-12)
- f0f737a02 - fix(vscode): cache provider usage on profile open (Josh Lambert, 2026-08-12)
- 611bfbc4b - refactor(provider-usage): simplify usage loading (Josh Lambert, 2026-08-12)
- 763967180 - refactor(core): keep provider usage internals private (Josh Lambert, 2026-08-11)
- 385829c47 - fix(vscode): clarify stale provider usage (Josh Lambert, 2026-08-11)
- 7bb5a09ce - fix(core): retain cloud discovery state on failed refresh (Josh Lambert, 2026-08-11)
- dec3e1796 - refactor(core): scope provider usage by location (Josh Lambert, 2026-08-10)
- fe8120427 - Merge remote-tracking branch 'origin/main' into refactor/provider-usage-center-split (Josh Lambert, 2026-08-07)
- 70b348864 - Merge branch 'main' into feat/provider-usage-center (Joshua Lambert, 2026-08-07)
- 1fe5e86c6 - Merge branch 'main' into feat/provider-usage-center (Joshua Lambert, 2026-08-07)
- 54e3c9a16 - fix(provider-usage): honor Cloud usage readiness (Josh Lambert, 2026-08-06)
- a86f7e99a - chore: remove unrelated Agent Manager cap workaround (Josh Lambert, 2026-08-06)
- af5cfdc1c - Merge remote-tracking branch 'origin/main' into refactor/provider-usage-center-split (Josh Lambert, 2026-08-06)
- b419460d7 - fix(tui): render provider usage inside the dialog viewport (Josh Lambert, 2026-08-06)
- 90ff62144 - Merge branch 'main' into feat/provider-usage-center (Joshua Lambert, 2026-08-06)
- b5668f3ab - test: drop redundant empty-usage service case (Josh Lambert, 2026-08-06)
- 979c358fb - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-08-06)
- 991a08702 - fix(vscode): render refresh failure notice alongside cached usage (Josh Lambert, 2026-08-06)
- 19c8caa9d - fix(gateway): hide canceled Kilo Pass subscriptions (Josh Lambert, 2026-08-06)
- 17e55e63a - fix: address provider usage bot review comments (Josh Lambert, 2026-08-05)
- 0240c4a86 - fix: address provider usage review findings (Josh Lambert, 2026-08-05)
- dd0fe9b45 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-08-05)
- 3b04f6d02 - refactor(ui): centralize provider usage components (Josh Lambert, 2026-08-05)
- e4e2069cd - refactor(gateway): clarify network fetch names (Josh Lambert, 2026-08-05)
- eeb31fd97 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-08-05)
- 4d206d28d - test(vscode): remove retired usage story (Josh Lambert, 2026-08-05)
- 50cc3ea10 - refactor(provider-usage): split personal top-ups (Josh Lambert, 2026-08-04)
- a01faad7e - refactor(provider-usage): narrow initial usage center scope (Josh Lambert, 2026-08-04)
- 254a36573 - Merge remote-tracking branch 'origin/main' into HEAD (Josh Lambert, 2026-08-04)
- 4d379dbc3 - Merge remote-tracking branch 'origin/main' into feat/provider-usage-center (Josh Lambert, 2026-08-04)
- 917f3a260 - refactor(provider-usage): stop consuming cloud auto top-up threshold (Josh Lambert, 2026-07-31)
- 1dd0bd230 - refactor: standardize auto top-up projection on cents (Josh Lambert, 2026-07-17)
- b044bd7e6 - refactor: expose auto top-up threshold in dollars (Josh Lambert, 2026-07-17)
- 19745ab33 - test(cli): remove obsolete managed routing scenario (Josh Lambert, 2026-07-17)
- 4990fec7e - refactor(cli): simplify managed routing detection (Josh Lambert, 2026-07-17)
- 1b341a3b2 - Merge remote-tracking branch 'origin/feat/provider-usage-center' into feat/provider-usage-center (Josh Lambert, 2026-07-16)
- 11f348103 - Merge remote-tracking branch 'origin/main' into feat/provider-usage-center (Josh Lambert, 2026-07-16)
- ad8ade253 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-07-10)
- d2fbeb9cf - fix(vscode): show Kilo Pass paid and bonus credits (Josh Lambert, 2026-07-10)
- 57cf3c546 - fix(vscode): label managed plans as Kilo Gateway (Josh Lambert, 2026-07-10)
- e6707a9e7 - fix(cli): hide managed quota without managed routing (Josh Lambert, 2026-07-10)
- 51d5551f3 - Merge remote-tracking branch 'origin/feat/provider-usage-center' into feat/provider-usage-center (Josh Lambert, 2026-07-09)
- d4ee38383 - fix(cli): hide managed quota after key replacement (Josh Lambert, 2026-07-09)
- 980030c0e - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-07-09)
- b1693dd0b - Merge remote-tracking branch 'origin/feat/provider-usage-center' into feat/provider-usage-center (Josh Lambert, 2026-07-09)
- 1f26beae3 - fix(vscode): place personal top-ups under balance (Josh Lambert, 2026-07-09)
- 2433fb916 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-07-09)
- 27f54081c - Merge remote-tracking branch 'origin/feat/provider-usage-center' into feat/provider-usage-center (Josh Lambert, 2026-07-09)
- fd5426760 - fix(vscode): order profile plans by source (Josh Lambert, 2026-07-09)
- 0d9386d44 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-07-09)
- 9866c5037 - fix(vscode): prioritize Kilo Pass in plan usage (Josh Lambert, 2026-07-09)
- 07667bf5e - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-07-09)
- d138577f1 - fix(vscode): prioritize provider usage in profile (Josh Lambert, 2026-07-09)
- 0deccbb3f - fix(cli): hide unsupported MiniMax video quota (Josh Lambert, 2026-07-09)
- fac8e8d45 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-07-09)
- 9f06db324 - fix(vscode): make profile content scrollable (Josh Lambert, 2026-07-09)
- 4ec401056 - Merge remote-tracking branch 'origin/feat/provider-usage-center' into feat/provider-usage-center (Josh Lambert, 2026-07-09)
- 4eab467ec - chore(vscode): format provider usage cards (Josh Lambert, 2026-07-09)
- ce4bf2c14 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-07-09)
- af017a57e - refactor: reuse existing Kilo Pass usage (Josh Lambert, 2026-07-09)
- d45830f9f - Merge remote-tracking branch 'origin/main' into feat/provider-usage-center (Josh Lambert, 2026-07-09)
- e175362cf - fix(cli): classify MiniMax status three as excluded (Josh Lambert, 2026-06-26)
- da661d4af - refactor: trim auto top-up usage metadata (Josh Lambert, 2026-06-26)
- 486f66c02 - feat: add provider usage center (Josh Lambert, 2026-06-23)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt` (+7, -12)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/TaskToolView.kt` (+96, -4)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionDiffView.kt` (+3, -3)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/src/kilocode/provider-usage.ts` (+395, -0)
- `packages/core/src/kilocode/provider-usage/cloud.ts` (+138, -0)
- `packages/core/src/kilocode/provider-usage/minimax/native.ts` (+34, -0)
- `packages/core/src/kilocode/provider-usage/minimax/usage.ts` (+284, -0)
- `packages/core/src/kilocode/pty/termination.ts` (+1, -1)
- `packages/core/src/location-services.ts` (+2, -0)
- `packages/core/src/session/runner/llm.ts` (+1, -1)
- `packages/core/test/kilocode-provider-usage-cloud.test.ts` (+93, -0)
- `packages/core/test/kilocode-provider-usage-location.test.ts` (+37, -0)
- `packages/core/test/kilocode-provider-usage-minimax.test.ts` (+396, -0)
- `packages/core/test/kilocode-provider-usage.test.ts` (+694, -0)
- `packages/core/test/kilocode/pty-termination.test.ts` (+17, -2)
- `packages/core/test/session-runner.test.ts` (+1, -1)
- `packages/kilo-vscode/src/agent-manager/orchestration-setup.ts` (+2, -2)

#### Other Changes
- `.changeset/align-slash-command-selection.md` (+5, -0)
- `.changeset/edit-preview-agent-manager.md` (+5, -0)
- `.changeset/fix-max-steps-prefill.md` (+5, -0)
- `.changeset/jetbrains-slash-completion-fast-typing.md` (+5, -0)
- `.changeset/model-selector-provider-prefix.md` (+5, -0)
- `.changeset/prompt-input-minimum-gutter.md` (+5, -0)
- `.changeset/provider-usage-center.md` (+7, -0)
- `.changeset/quiet-project-session-switch.md` (+5, -0)
- `.changeset/subagent-session-tabs.md` (+5, -0)
- `.changeset/worktree-pty-cleanup.md` (+5, -0)
- `bun.lock` (+1, -1)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/pr-panel-comments-200-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/pr-panel-comments-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/readable-chat-420-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-agent-manager-completed-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-idle-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-readable-420-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-with-messages-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-with-pending-question-empty-input-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/message-list-layout-correction-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-many-prompts-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-sidebar-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-wide-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/welcome-with-switcher-and-notification-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/bash-with-permission-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/glob-with-permission-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-apply-patch-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-bash-many-rules-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-edit-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-external-dir-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-heredoc-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-skill-shell-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-subagent-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-todo-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-websearch-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-write-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/question-above-chatbox-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/todo-write-with-permission-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/profile/empty-usage-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/profile/logged-in-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/profile/logged-in-personal-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/profile/not-logged-in-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/profile/organization-context-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/profile/scrollable-usage-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/profile/stale-and-unavailable-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/prompt-input/default-200-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/prompt-input/default-420-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/prompt-input/with-model-override-200-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/prompt-input/with-model-override-420-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/prompt-input/with-prompt-training-200-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/prompt-input/with-prompt-training-420-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/prompt-input/with-thinking-200-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/prompt-input/with-thinking-420-chromium-linux.png` (+2, -2)
- `packages/kilo-gateway/package.json` (+1, -0)
- `packages/kilo-gateway/src/api/kilo-pass.ts` (+5, -0)
- `packages/kilo-gateway/src/api/trpc.ts` (+175, -0)
- `packages/kilo-gateway/src/index.ts` (+8, -0)
- `packages/kilo-gateway/src/provider-usage.ts` (+110, -0)
- `packages/kilo-gateway/test/api/kilo-pass.test.ts` (+24, -0)
- `packages/kilo-gateway/test/api/trpc.test.ts` (+190, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionManager.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+84, -45)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/subagent/SubagentSessionEditorHost.kt` (+86, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/subagent/SubagentSessionEditorKind.kt` (+91, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/subagent/SubagentTitleCache.kt` (+27, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/ChangesCardView.kt` (+8, -12)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/ModifiedFilesView.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/ReasoningPicker.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanel.kt` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/SessionHeaderPanel.kt` (+3, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/mode/ModePicker.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/model/ModelPicker.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/popup/HeaderPopup.kt` (+14, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/KiloPromptCompletionProvider.kt` (+18, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/PromptPanel.kt` (+41, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/MessageView.kt` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/TurnView.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/ViewFactory.kt` (+4, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/base/HeaderOpenAction.kt` (+25, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/PickerButton.kt` (+16, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/vfs/KiloFileEditorProvider.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ar.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_bs.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_da.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_de.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_es.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_fr.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ja.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ko.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_nl.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_no.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pl.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pt_BR.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ru.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_th.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_tr.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_uk.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_CN.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_TW.properties` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionUiLayoutTest.kt` (+28, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionUiTestBase.kt` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/subagent/SubagentSessionEditorHostTest.kt` (+93, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/subagent/SubagentSessionEditorKindTest.kt` (+81, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/PromptPanelTest.kt` (+53, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/TaskToolViewTest.kt` (+122, -5)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/PickerButtonTest.kt` (+17, -0)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -0)
- `packages/kilo-ui/src/components/card.css` (+8, -0)
- `packages/kilo-ui/src/components/card.tsx` (+11, -0)
- `packages/kilo-ui/src/components/kilo-pass-meter.css` (+130, -0)
- `packages/kilo-ui/src/components/kilo-pass-meter.tsx` (+105, -0)
- `packages/kilo-ui/src/components/message-part.tsx` (+54, -47)
- `packages/kilo-ui/src/stories/card.stories.tsx` (+16, -1)
- `packages/kilo-ui/src/stories/kilo-pass-meter.stories.tsx` (+39, -0)
- `packages/kilo-ui/src/styles/index.css` (+1, -0)
- `packages/kilo-vscode/src/DiffVirtualProvider.ts` (+4, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+73, -3)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+41, -22)
- `packages/kilo-vscode/src/agent-manager/PRStatusPoller.ts` (+9, -4)
- `packages/kilo-vscode/src/agent-manager/ScriptTerminalManager.ts` (+49, -0)
- `packages/kilo-vscode/src/agent-manager/discard-worktree.ts` (+13, -12)
- `packages/kilo-vscode/src/agent-manager/pr-status-bridge.ts` (+107, -65)
- `packages/kilo-vscode/src/agent-manager/pr/am-pr-utils.ts` (+12, -1)
- `packages/kilo-vscode/src/agent-manager/pr/pr-comment-context.ts` (+70, -0)
- `packages/kilo-vscode/src/agent-manager/project/diff-branches.ts` (+30, -0)
- `packages/kilo-vscode/src/agent-manager/project/messages.ts` (+6, -1)
- `packages/kilo-vscode/src/agent-manager/project/pollers.ts` (+2, -0)
- `packages/kilo-vscode/src/agent-manager/provider-lifecycle.ts` (+28, -15)
- `packages/kilo-vscode/src/agent-manager/provider-multi-version.ts` (+11, -4)
- `packages/kilo-vscode/src/agent-manager/pty-cleanup.ts` (+28, -0)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+24, -0)
- `packages/kilo-vscode/src/agent-manager/worktree-diff-controller.ts` (+30, -4)
- `packages/kilo-vscode/src/agent-manager/worktree-importer.ts` (+11, -6)
- `packages/kilo-vscode/src/kilo-provider/handlers/auth.ts` (+4, -0)
- `packages/kilo-vscode/tests/accessibility.spec.ts` (+3, -0)
- `packages/kilo-vscode/tests/fixtures/pr-comments-render.tsx` (+106, -35)
- `packages/kilo-vscode/tests/prompt-spacing.spec.ts` (+61, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+28, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-new-worktree-project.test.ts` (+10, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-selection-actions.test.ts` (+85, -0)
- `packages/kilo-vscode/tests/unit/agent-project-restore.test.ts` (+3, -4)
- `packages/kilo-vscode/tests/unit/agent-project-selection-webview.test.ts` (+9, -9)
- `packages/kilo-vscode/tests/unit/am-pr-status-bridge.test.ts` (+70, -4)
- `packages/kilo-vscode/tests/unit/databridge-shape.test.ts` (+10, -2)
- `packages/kilo-vscode/tests/unit/edit-preview.test.ts` (+124, -0)
- `packages/kilo-vscode/tests/unit/kilo-ui-contract.test.ts` (+32, -0)
- `packages/kilo-vscode/tests/unit/model-selector-utils.test.ts` (+5, -0)
- `packages/kilo-vscode/tests/unit/pr-comment-context.test.ts` (+116, -0)
- `packages/kilo-vscode/tests/unit/pr-status-merge.test.ts` (+62, -0)
- `packages/kilo-vscode/tests/unit/project-message-ownership.test.ts` (+15, -0)
- `packages/kilo-vscode/tests/unit/project-review-state.test.ts` (+30, -0)
- `packages/kilo-vscode/tests/unit/project-session-busy.test.ts` (+31, -0)
- `packages/kilo-vscode/tests/unit/project-state-handlers.test.ts` (+42, -0)
- `packages/kilo-vscode/tests/unit/provider-usage.test.ts` (+209, -0)
- `packages/kilo-vscode/tests/unit/pty-cleanup.test.ts` (+43, -1)
- `packages/kilo-vscode/tests/unit/review-comments-pr.test.ts` (+103, -1)
- `packages/kilo-vscode/tests/unit/sandbox-bootstrap.test.ts` (+2, -1)
- `packages/kilo-vscode/tests/unit/script-terminal-manager.test.ts` (+17, -0)
- `packages/kilo-vscode/tests/unit/tab-order-sync.test.ts` (+3, -3)
- `packages/kilo-vscode/tests/unit/use-slash-command.test.ts` (+72, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+197, -197)
- `packages/kilo-vscode/webview-ui/agent-manager/EditPreviewPanel.tsx` (+81, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectBranchDialog.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectSidebarBody.tsx` (+4, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectsSection.tsx` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/SidebarBody.tsx` (+10, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/SidebarSectionHeader.tsx` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+84, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/apply-to-local.tsx` (+8, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/diff-review-scope.ts` (+14, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/edit-preview.ts` (+186, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fa.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fr.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/it.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ja.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ko.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/nl.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/no.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/pl.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ru.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/th.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/tr.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/uk.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zh.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zht.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRCommentCard.tsx` (+7, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRComments.tsx` (+91, -83)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRPanel.tsx` (+83, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRPanelHost.tsx` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/pr-comment-payload.ts` (+140, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/pr-comment-state.ts` (+70, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/pr-panel.css` (+10, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/pr-types.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/project/local-tabs.ts` (+20, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/project/message-ownership.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/project/restore.ts` (+3, -4)
- `packages/kilo-vscode/webview-ui/agent-manager/project/review-state.ts` (+57, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/project/selection.ts` (+10, -7)
- `packages/kilo-vscode/webview-ui/agent-manager/project/session-busy.ts` (+45, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/project/state-handlers.ts` (+49, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/project/switch.ts` (+24, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/revert-file.ts` (+8, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/selection-actions.ts` (+57, -8)
- `packages/kilo-vscode/webview-ui/agent-manager/side-panel-layout.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/sidebar-collapse.ts` (+9, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/subagent-tabs.ts` (+23, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/tab-order-sync.ts` (+2, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/worktree-diffs.ts` (+11, -3)
- `packages/kilo-vscode/webview-ui/diff-viewer/PRCommentDiff.tsx` (+20, -3)
- `packages/kilo-vscode/webview-ui/diff-viewer/VirtualDiffView.tsx` (+149, -0)
- `packages/kilo-vscode/webview-ui/diff-virtual/DiffVirtualApp.tsx` (+48, -106)
- `packages/kilo-vscode/webview-ui/src/App.tsx` (+21, -2)
- `packages/kilo-vscode/webview-ui/src/components/chat/PermissionDiff.tsx` (+25, -3)
- `packages/kilo-vscode/webview-ui/src/components/profile/ProfileView.tsx` (+47, -126)
- `packages/kilo-vscode/webview-ui/src/components/profile/ProviderUsageCards.tsx` (+315, -0)
- `packages/kilo-vscode/webview-ui/src/components/shared/model-selector-utils.ts` (+5, -3)
- `packages/kilo-vscode/webview-ui/src/context/diff-style.tsx` (+19, -0)
- `packages/kilo-vscode/webview-ui/src/context/server.tsx` (+59, -1)
- `packages/kilo-vscode/webview-ui/src/context/session-project.ts` (+10, -0)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+16, -2)
- `packages/kilo-vscode/webview-ui/src/hooks/useSlashCommand.ts` (+7, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+39, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+39, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+39, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+39, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+39, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+39, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+39, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+39, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+39, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+39, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+39, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+39, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+39, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+39, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+39, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+39, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+39, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+39, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+39, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+39, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+39, -0)
- `packages/kilo-vscode/webview-ui/src/stories/agent-manager.stories.tsx` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/stories/profile.stories.tsx` (+112, -22)
- `packages/kilo-vscode/webview-ui/src/styles/chat-layout.css` (+8, -9)
- `packages/kilo-vscode/webview-ui/src/styles/chat.css` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/styles/prompt-input.css` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/styles/provider-usage.css` (+82, -0)
- `packages/kilo-vscode/webview-ui/src/styles/session-actions.css` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/index.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/permissions.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/provider-usage.ts` (+18, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/utils/agent-manager-events.ts` (+11, -0)
- `packages/llm/src/protocols/anthropic-messages.ts` (+3, -6)
- `packages/llm/src/protocols/bedrock-converse.ts` (+3, -6)
- `packages/llm/src/protocols/gemini.ts` (+3, -6)
- `packages/llm/src/protocols/shared.ts` (+19, -0)
- `packages/llm/test/provider/anthropic-messages.test.ts` (+10, -1)
- `packages/llm/test/provider/bedrock-converse.test.ts` (+2, -0)
- `packages/llm/test/provider/gemini.test.ts` (+5, -1)
- `packages/opencode/src/kilocode/components/dialog-provider-usage.tsx` (+122, -0)
- `packages/opencode/src/kilocode/kilo-commands.tsx` (+13, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/kilocode.ts` (+25, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilocode.ts` (+34, -0)
- `packages/opencode/src/session/prompt.ts` (+1, -1)
- `packages/opencode/test/kilocode/server/httpapi-exercise-scenarios.ts` (+14, -0)
- `packages/opencode/test/kilocode/server/httpapi-public.test.ts` (+35, -0)
- `packages/opencode/test/session/prompt.test.ts` (+34, -0)
- `packages/schema/src/kilocode/provider-usage.ts` (+55, -0)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+79, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+113, -0)
- `packages/sdk/openapi.json` (+280, -0)
- `packages/tui/test/kilocode/model-picker.test.ts` (+20, -0)
- `packages/ui/src/context/data.tsx` (+12, -0)

### Key Diffs

#### packages/core/src/kilocode/provider-usage.ts
```diff
diff --git a/packages/core/src/kilocode/provider-usage.ts b/packages/core/src/kilocode/provider-usage.ts
new file mode 100644
index 000000000..a27f4a3bd
--- /dev/null
+++ b/packages/core/src/kilocode/provider-usage.ts
@@ -0,0 +1,395 @@
+export * as ProviderUsage from "./provider-usage"
+
+import { Context, Effect, Layer, Schema } from "effect"
+import { createHash } from "node:crypto"
+import { ProviderUsage as Contract } from "@opencode-ai/schema/kilocode/provider-usage"
+import { Catalog } from "../catalog"
+import { makeGlobalNode, makeLocationNode } from "../effect/app-node"
+import { Integration } from "../integration"
+import { PluginV2 } from "../plugin"
+import { ProviderV2 } from "../provider"
+import * as Cloud from "./provider-usage/cloud"
+import { bindings, direct, type Candidate } from "./provider-usage/minimax/usage"
+
+const successTtl = 60_000
+const errorTtl = 10_000
+const readyPlugin = PluginV2.ID.make("config-provider")
+
+interface AdapterContext {
+  candidates: readonly Candidate[]
+  failedCandidates: readonly Candidate["providerID"][]
+  cloud: (() => Promise<Cloud.CloudState>) | undefined
+  token: string | undefined
+  cloudIdentity: string | undefined
+  cloudReliable: boolean
+  fetch: typeof fetch
+  usage: typeof Cloud.fetchCodingPlanUsage
+  identityCurrent(identity: string): boolean
+  source(id: string, load: () => Promise<Contract.UsageSnapshot>, identity?: string): Promise<Contract.UsageSnapshot>
+  preserve(prefix: string, identity?: string): Contract.UsageSnapshot[]
+  prune(prefix: string, keep: string[]): void
+}
+
+interface AdapterResult {
+  items: ReadonlyArray<Contract.UsageSnapshot>
+}
+
+interface Adapter {
+  cachePrefixes: readonly string[]
+  cloudScoped?: boolean
+  run(ctx: AdapterContext): Promise<AdapterResult>
+}
+
+const managed: Adapter = {
+  cachePrefixes: ["kilo-managed:"],
```

#### packages/core/src/kilocode/provider-usage/cloud.ts
```diff
diff --git a/packages/core/src/kilocode/provider-usage/cloud.ts b/packages/core/src/kilocode/provider-usage/cloud.ts
new file mode 100644
index 000000000..74464ba45
--- /dev/null
+++ b/packages/core/src/kilocode/provider-usage/cloud.ts
@@ -0,0 +1,138 @@
+import {
+  fetchByokEntries,
+  fetchCodingPlanSubscriptions,
+  fetchCodingPlanUsage,
+  type ByokEntry,
+  type CodingPlanQuotaWindow,
+  type CodingPlanSubscription,
+} from "@kilocode/kilo-gateway"
+import type { ProviderUsage } from "@opencode-ai/schema/kilocode/provider-usage"
+
+export { fetchByokEntries, fetchCodingPlanSubscriptions, fetchCodingPlanUsage }
+
+export interface CloudState {
+  plans: Result<CodingPlanSubscription[]>
+  byok: Result<ByokEntry[]>
+}
+
+type Result<T> = { ok: true; value: T } | { ok: false }
+
+const safe = async <T>(promise: Promise<T>): Promise<Result<T>> =>
+  promise.then(
+    (value) => ({ ok: true, value }),
+    () => ({ ok: false }),
+  )
+
+export async function load(
+  token: string,
+  transport: {
+    plans: typeof fetchCodingPlanSubscriptions
+    byok: typeof fetchByokEntries
+  } = { plans: fetchCodingPlanSubscriptions, byok: fetchByokEntries },
+): Promise<CloudState> {
+  const [plans, byok] = await Promise.all([safe(transport.plans(token)), safe(transport.byok(token))])
+  return { plans, byok }
+}
+
+function base() {
+  if (!process.env.KILO_API_URL) return "https://app.kilo.ai"
+  try {
+    return new URL(process.env.KILO_API_URL).origin
+  } catch {
+    return "https://app.kilo.ai"
+  }
+}
```

#### packages/core/src/kilocode/provider-usage/minimax/native.ts
```diff
diff --git a/packages/core/src/kilocode/provider-usage/minimax/native.ts b/packages/core/src/kilocode/provider-usage/minimax/native.ts
new file mode 100644
index 000000000..0d93b2647
--- /dev/null
+++ b/packages/core/src/kilocode/provider-usage/minimax/native.ts
@@ -0,0 +1,34 @@
+import { Schema } from "effect"
+
+const IntegerField = Schema.Int
+// Matches the cloud schema: remaining percent is a 0-100 share of the base quota; boosts scale it separately.
+const PercentField = Schema.Finite.check(Schema.isGreaterThanOrEqualTo(0)).check(Schema.isLessThanOrEqualTo(100))
+
+export const ModelRemains = Schema.Struct({
+  model_name: Schema.String,
+  current_interval_total_count: Schema.optional(IntegerField),
+  current_interval_usage_count: Schema.optional(IntegerField),
+  start_time: Schema.optional(IntegerField),
+  end_time: Schema.optional(IntegerField),
+  remains_time: Schema.optional(IntegerField),
+  interval_boost_permille: Schema.optional(IntegerField),
+  current_interval_remaining_percent: Schema.optional(PercentField),
+  current_interval_status: Schema.optional(IntegerField),
+  current_weekly_total_count: Schema.optional(IntegerField),
+  current_weekly_usage_count: Schema.optional(IntegerField),
+  weekly_start_time: Schema.optional(IntegerField),
+  weekly_end_time: Schema.optional(IntegerField),
+  weekly_remains_time: Schema.optional(IntegerField),
+  weekly_boost_permille: Schema.optional(IntegerField),
+  current_weekly_remaining_percent: Schema.optional(PercentField),
+  current_weekly_status: Schema.optional(IntegerField),
+}).annotate({ identifier: "MiniMaxModelRemains" })
+export type ModelRemains = typeof ModelRemains.Type
+
+export const Native = Schema.Struct({
+  base_resp: Schema.Struct({ status_code: IntegerField }),
+  model_remains: Schema.Array(ModelRemains),
+}).annotate({ identifier: "MiniMaxNativeUsage" })
+export type Native = typeof Native.Type
+
+export const decode = Schema.decodeUnknownSync(Native)
```

#### packages/core/src/kilocode/provider-usage/minimax/usage.ts
```diff
diff --git a/packages/core/src/kilocode/provider-usage/minimax/usage.ts b/packages/core/src/kilocode/provider-usage/minimax/usage.ts
new file mode 100644
index 000000000..dac61af11
--- /dev/null
+++ b/packages/core/src/kilocode/provider-usage/minimax/usage.ts
@@ -0,0 +1,284 @@
+import { createHash } from "node:crypto"
+import { decode, type ModelRemains, type Native } from "./native"
+import type { ProviderUsage } from "@opencode-ai/schema/kilocode/provider-usage"
+
+export const bindings = {
+  "minimax-coding-plan": {
+    region: "global",
+    url: "https://api.minimax.io/v1/token_plan/remains",
+    manage: "https://platform.minimax.io/subscribe/token-plan",
+  },
+  "minimax-cn-coding-plan": {
+    region: "china",
+    url: "https://api.minimaxi.com/v1/token_plan/remains",
+    manage: "https://platform.minimaxi.com/subscribe/token-plan",
+  },
+} as const
+
+type ProviderID = keyof typeof bindings
+
+const timeout = 5_000
+const limit = 64 * 1024
+
+class MiniMaxUsageError extends Error {
+  constructor(readonly code: "network" | "http" | "too_large" | "invalid" | "application") {
+    super("MiniMax usage is temporarily unavailable.")
+    this.name = "MiniMaxUsageError"
+  }
+}
+
+async function text(response: Response) {
+  const declared = Number(response.headers.get("content-length"))
+  if (Number.isFinite(declared) && declared > limit) {
+    response.body?.cancel().catch(() => undefined)
+    throw new MiniMaxUsageError("too_large")
+  }
+
+  if (!response.body) {
+    const value = await response.arrayBuffer()
+    if (value.byteLength > limit) throw new MiniMaxUsageError("too_large")
+    return new TextDecoder().decode(value)
+  }
+
+  const reader = response.body.getReader()
+  const chunks: Uint8Array[] = []
```

#### packages/core/src/kilocode/pty/termination.ts
```diff
diff --git a/packages/core/src/kilocode/pty/termination.ts b/packages/core/src/kilocode/pty/termination.ts
index 92c0c8b9b..33b29936d 100644
--- a/packages/core/src/kilocode/pty/termination.ts
+++ b/packages/core/src/kilocode/pty/termination.ts
@@ -151,7 +151,7 @@ export async function terminate(proc: Process, input: Runtime = runtime): Promis
         windowsHide: true,
         timeout: SPAWN_TIMEOUT_MS,
       })
-      if (!killed && !state.exited) direct(proc)
+      if ((!killed || input.alive(proc.pid)) && !state.exited) direct(proc)
       if (!state.exited) await input.sleep(GRACE_MS)
       await verify(proc, state.exited, input)
       return
```


*... and more files (showing first 5)*

## opencode Changes (e11dbd0..e00890c)

### Commits

- e00890c - fix: resolve console device URLs (#44029) (Kit Langton, 2026-08-22)
- 3a4c253 - fix(provider): guard textVerbosity injection for @ai-sdk/openai-compatible providers (#43915) (joelstucki-taulia, 2026-08-21)
- 34a83b2 - fix(stats): improve chart tooltip truncation (Adam, 2026-08-21)
- ff3ef6e - chore: update nix node_modules hashes (opencode-agent[bot], 2026-08-21)
- e2ec62d - fix: bump Amazon Bedrock provider (#43909) (opencode-agent[bot], 2026-08-21)
- bcf1103 - docs(zen): update GPT 5.6 Sol pricing (#43986) (opencode-agent[bot], 2026-08-21)
- 9cb6fb6 - fix(console): cache desktop downloads (Dax Raad, 2026-08-21)
- 1b937c8 - test(opencode): align unknown finish coverage (#43895) (opencode-agent[bot], 2026-08-21)
- ad0bb6d - sync release versions for v1.18.21 (opencode, 2026-08-21)
- 487d584 - docs(zen): reflect GPT 5.6 Sol discount (#43874) (opencode-agent[bot], 2026-08-21)
- 57fa34f - fix(opencode): continue unknown finish responses (#43892) (opencode-agent[bot], 2026-08-21)
- 0af9dd6 - fix(stats): merge renamed model data (#43883) (Adam, 2026-08-21)
- 8ecd4c2 - chore: generate (opencode-agent[bot], 2026-08-21)
- 361a71f - fix(opencode): route Vertex multi-regions through REP (#42648) (opencode-agent[bot], 2026-08-21)
- fa8f170 - chore: generate (opencode-agent[bot], 2026-08-21)
- 813e6f3 - docs(go): add DeepSeek vision model (#43866) (Jack, 2026-08-21)
- ba72a6f - fix(go): align Ox Alpha model ID (#43837) (Jack, 2026-08-21)
- b6a1f95 - fix(app): preserve file search results while loading (#43836) (Brendan Allan, 2026-08-21)
- f357e70 - fix(app): register archive session command in both layouts (#41741) (Nathan Thomassin, 2026-08-21)
- a9cac91 - sync release versions for v1.18.20 (opencode, 2026-08-21)
- 35fe5b7 - fix(opencode): surface subagent tool errors (#43821) (Aiden Cline, 2026-08-21)
- 62cb3f7 - test(opencode): remove flaky subagent test (#43819) (opencode-agent[bot], 2026-08-21)
- e0b9e68 - fix(opencode): retry raw network finish errors (#43813) (opencode-agent[bot], 2026-08-21)
- 1e4c153 - chore: generate (opencode-agent[bot], 2026-08-21)
- c9dc1a1 - feat(go): add Ox Alpha to usage graph (#43809) (Jack, 2026-08-21)
- 40282c1 - fix(opencode): retry network error variants (#43806) (opencode-agent[bot], 2026-08-21)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/task.ts` (+4, -0)
- `packages/opencode/test/tool/task.test.ts` (+65, -1)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/console/core/package.json` (+1, -1)
- `packages/core/package.json` (+2, -2)
- `packages/core/src/plugin/provider/opencode.ts` (+10, -1)
- `packages/core/test/plugin/provider-opencode.test.ts` (+61, -1)
- `packages/stats/core/package.json` (+1, -1)
- `packages/stats/core/src/domain/inference.test.ts` (+11, -0)
- `packages/stats/core/src/domain/inference.ts` (+4, -0)
- `packages/stats/core/src/domain/model-normalization.ts` (+7, -1)

#### Other Changes
- `bun.lock` (+37, -35)
- `nix/hashes.json` (+4, -4)
- `packages/app/e2e/regression/file-browser-sidebar-tab-switch.spec.ts` (+38, -1)
- `packages/app/e2e/utils/mock-server.ts` (+1, -1)
- `packages/app/package.json` (+1, -1)
- `packages/app/src/pages/layout.tsx` (+0, -11)
- `packages/app/src/pages/session/session-archive.ts` (+71, -0)
- `packages/app/src/pages/session/timeline/message-timeline.tsx` (+5, -54)
- `packages/app/src/pages/session/use-session-commands.tsx` (+12, -0)
- `packages/app/src/pages/session/v2/session-file-browser-tab.tsx` (+2, -1)
- `packages/cli/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
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
- `packages/console/app/src/routes/download/[channel]/[platform].ts` (+23, -2)
- `packages/console/app/src/routes/go/index.css` (+6, -1)
- `packages/console/app/src/routes/go/index.tsx` (+11, -5)
- `packages/console/app/src/routes/workspace/[id]/go/lite-section.tsx` (+2, -0)
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
- `packages/opencode/package.json` (+2, -2)
- `packages/opencode/src/account/account.ts` (+9, -1)
- `packages/opencode/src/provider/provider.ts` (+7, -2)
- `packages/opencode/src/provider/transform.ts` (+3, -3)
- `packages/opencode/src/session/llm/ai-sdk.ts` (+3, -0)
- `packages/opencode/src/session/prompt.ts` (+1, -1)
- `packages/opencode/src/session/retry.ts` (+1, -1)
- `packages/opencode/test/account/service.test.ts` (+28, -7)
- `packages/opencode/test/cli/run/run-process.test.ts` (+13, -50)
- `packages/opencode/test/provider/provider.test.ts` (+26, -0)
- `packages/opencode/test/provider/transform.test.ts` (+1, -0)
- `packages/opencode/test/session/llm.test.ts` (+65, -0)
- `packages/opencode/test/session/processor-effect.test.ts` (+57, -0)
- `packages/opencode/test/session/prompt.test.ts` (+28, -0)
- `packages/opencode/test/session/retry.test.ts` (+3, -0)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/app/src/routes/[lab]/[model].tsx` (+2, -1)
- `packages/stats/app/src/routes/[lab]/index.tsx` (+4, -2)
- `packages/stats/app/src/routes/index.css` (+9, -2)
- `packages/stats/app/src/routes/index.tsx` (+2, -2)
- `packages/stats/server/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/ar/go.mdx` (+110, -101)
- `packages/web/src/content/docs/ar/zen.mdx` (+4, -2)
- `packages/web/src/content/docs/bs/go.mdx` (+110, -101)
- `packages/web/src/content/docs/bs/zen.mdx` (+4, -2)
- `packages/web/src/content/docs/da/go.mdx` (+110, -101)
- `packages/web/src/content/docs/da/zen.mdx` (+4, -2)
- `packages/web/src/content/docs/de/go.mdx` (+110, -101)
- `packages/web/src/content/docs/de/zen.mdx` (+4, -2)
- `packages/web/src/content/docs/es/go.mdx` (+110, -101)
- `packages/web/src/content/docs/es/zen.mdx` (+4, -2)
- `packages/web/src/content/docs/fr/go.mdx` (+110, -101)
- `packages/web/src/content/docs/fr/zen.mdx` (+4, -2)
- `packages/web/src/content/docs/go.mdx` (+110, -101)
- `packages/web/src/content/docs/it/go.mdx` (+110, -101)
- `packages/web/src/content/docs/it/zen.mdx` (+4, -2)
- `packages/web/src/content/docs/ja/go.mdx` (+110, -101)
- `packages/web/src/content/docs/ja/zen.mdx` (+4, -2)
- `packages/web/src/content/docs/ko/go.mdx` (+110, -101)
- `packages/web/src/content/docs/ko/zen.mdx` (+4, -2)
- `packages/web/src/content/docs/nb/go.mdx` (+110, -101)
- `packages/web/src/content/docs/nb/zen.mdx` (+4, -2)
- `packages/web/src/content/docs/pl/go.mdx` (+110, -101)
- `packages/web/src/content/docs/pl/zen.mdx` (+4, -2)
- `packages/web/src/content/docs/pt-br/go.mdx` (+110, -101)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+4, -2)
- `packages/web/src/content/docs/ru/go.mdx` (+110, -101)
- `packages/web/src/content/docs/ru/zen.mdx` (+4, -2)
- `packages/web/src/content/docs/th/go.mdx` (+110, -101)
- `packages/web/src/content/docs/th/zen.mdx` (+4, -2)
- `packages/web/src/content/docs/tr/go.mdx` (+110, -101)
- `packages/web/src/content/docs/tr/zen.mdx` (+4, -2)
- `packages/web/src/content/docs/zen.mdx` (+4, -2)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+110, -101)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+4, -2)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+110, -101)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+4, -2)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index dc867b4..61ae28b 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.18.19",
+  "version": "1.18.21",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index cdcdfe0..019f4b5 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.18.19",
+  "version": "1.18.21",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
@@ -62,7 +62,7 @@
   },
   "dependencies": {
     "@ai-sdk/alibaba": "1.0.17",
-    "@ai-sdk/amazon-bedrock": "4.0.112",
+    "@ai-sdk/amazon-bedrock": "4.0.158",
     "@ai-sdk/anthropic": "3.0.82",
     "@ai-sdk/azure": "3.0.88",
     "@ai-sdk/cerebras": "2.0.41",
```

#### packages/core/src/plugin/provider/opencode.ts
```diff
diff --git a/packages/core/src/plugin/provider/opencode.ts b/packages/core/src/plugin/provider/opencode.ts
index 8e1cc1a..7bd78ca 100644
--- a/packages/core/src/plugin/provider/opencode.ts
+++ b/packages/core/src/plugin/provider/opencode.ts
@@ -45,9 +45,18 @@ function oauth(http: HttpClient.HttpClient) {
     authorize: () =>
       Effect.gen(function* () {
         const device = yield* post(http, `${defaultServer}/auth/device/code`, { client_id: clientID }, Device)
+        const verification = yield* Effect.try({
+          try: () => {
+            const url = new URL(device.verification_uri_complete, `${defaultServer}/`)
+            if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("expected HTTP(S)")
+            return url
+          },
+          catch: (cause) =>
+            new Error(`Invalid device verification URL: ${cause instanceof Error ? cause.message : String(cause)}`),
+        })
         return {
           mode: "auto" as const,
-          url: `${defaultServer}${device.verification_uri_complete}`,
+          url: verification.href,
           instructions: `Enter code: ${device.user_code}`,
           callback: poll(http, defaultServer, device.device_code, Duration.seconds(device.interval)),
         }
```

#### packages/core/test/plugin/provider-opencode.test.ts
```diff
diff --git a/packages/core/test/plugin/provider-opencode.test.ts b/packages/core/test/plugin/provider-opencode.test.ts
index 20af84d..e1f8bdd 100644
--- a/packages/core/test/plugin/provider-opencode.test.ts
+++ b/packages/core/test/plugin/provider-opencode.test.ts
@@ -1,5 +1,6 @@
 import { describe, expect } from "bun:test"
 import { Effect } from "effect"
+import { HttpClient, HttpClientResponse } from "effect/unstable/http"
 import { Catalog } from "@opencode-ai/core/catalog"
 import { Credential } from "@opencode-ai/core/credential"
 import { EventV2 } from "@opencode-ai/core/event"
@@ -14,14 +15,16 @@ import { PluginTestLayer } from "./fixture"
 
 const it = testEffect(PluginTestLayer)
 
-const addPlugin = Effect.fn(function* () {
+const addPlugin = Effect.fn(function* (http?: HttpClient.HttpClient) {
   const plugin = yield* PluginV2.Service
   const host = yield* PluginHost.make(plugin)
   const events = yield* EventV2.Service
   const integration = yield* Integration.Service
+  const client = yield* HttpClient.HttpClient
   yield* OpencodePlugin.effect(host).pipe(
     Effect.provideService(EventV2.Service, events),
     Effect.provideService(Integration.Service, integration),
+    Effect.provideService(HttpClient.HttpClient, http ?? client),
   )
 })
 
@@ -82,6 +85,63 @@ describe("OpencodePlugin", () => {
     }),
   )
 
+  it.effect("resolves origin-rooted device verification URLs", () =>
+    Effect.gen(function* () {
+      const http = HttpClient.make((request) =>
+        Effect.succeed(
+          HttpClientResponse.fromWeb(
+            request,
+            Response.json({
+              device_code: "device",
+              user_code: "user",
+              verification_uri_complete: "/console/device?user_code=user&client_id=opencode-cli",
+              expires_in: 60,
+              interval: 60,
+            }),
+          ),
+        ),
+      )
+      yield* addPlugin(http)
```

#### packages/opencode/src/tool/task.ts
```diff
diff --git a/packages/opencode/src/tool/task.ts b/packages/opencode/src/tool/task.ts
index de5d396..d8ca640 100644
--- a/packages/opencode/src/tool/task.ts
+++ b/packages/opencode/src/tool/task.ts
@@ -217,6 +217,10 @@ export const TaskTool = Tool.define(
               : result.info.error.name
           return yield* Effect.fail(new Error(`Subagent failed (task_id: ${nextSession.id}): ${message}`))
         }
+        const failed = result.parts.findLast((item) => item.type === "tool" && item.state.status === "error")
+        if (failed?.type === "tool" && failed.state.status === "error") {
+          return yield* Effect.fail(new Error(`Subagent failed (task_id: ${nextSession.id}): ${failed.state.error}`))
+        }
         return result.parts.findLast((item) => item.type === "text")?.text ?? ""
       })
 
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/src/kilocode/provider-usage.ts
- `src/core/` - review core changes from packages/core/src/kilocode/provider-usage/cloud.ts
- `src/core/` - review core changes from packages/core/src/kilocode/provider-usage/minimax/native.ts
- `src/core/` - review core changes from packages/core/src/kilocode/provider-usage/minimax/usage.ts
- `src/core/` - review core changes from packages/core/src/kilocode/pty/termination.ts
- `src/core/` - review core changes from packages/core/src/location-services.ts
- `src/core/` - review core changes from packages/core/src/session/runner/llm.ts
- `src/core/` - review core changes from packages/core/test/kilocode-provider-usage-cloud.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode-provider-usage-location.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode-provider-usage-minimax.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode-provider-usage.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/pty-termination.test.ts
- `src/core/` - review core changes from packages/core/test/session-runner.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/agent-manager/orchestration-setup.ts
- `src/permission/` - review permission changes from packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionDiffView.kt
- `src/tool/EditToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt changes
- `src/tool/TaskToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/TaskToolView.kt changes
- `src/tool/task.test.ts` - update based on opencode packages/opencode/test/tool/task.test.ts changes
- `src/tool/task.ts` - update based on opencode packages/opencode/src/tool/task.ts changes
