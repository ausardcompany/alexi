# Upstream Changes Report
Generated: 2026-08-20 06:45:35

## Summary
- kilocode: 85 commits, 299 files changed
- opencode: 18 commits, 117 files changed

## kilocode Changes (0004b748b..9a6e081e4)

### Commits

- 9a6e081e4 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-08-19)
- b217af47a - Merge pull request #13244 from Kilo-Org/remove-alibaba-mistral-gateway-providers (Christiaan Arnoldus, 2026-08-19)
- 37ce1735c - Merge pull request #13231 from Kilo-Org/optimize-message-submission-ux-transitions (Marius, 2026-08-19)
- c36622575 - Merge pull request #13241 from Kilo-Org/improve-pr-sidebar-comment-interactions (Marius, 2026-08-19)
- 1c5f75a81 - Merge pull request #13249 from Kilo-Org/fix-todo-list-update-stalling (Marius, 2026-08-19)
- fdbfa0934 - Merge pull request #13246 from Kilo-Org/fix-tool-output-loading-bar-ui (Marius, 2026-08-19)
- 3de7df279 - fix(cli): keep todo updates incremental (marius-kilocode, 2026-08-19)
- 515d40e90 - fix(vscode): remove extra tool output gutter (marius-kilocode, 2026-08-19)
- 01049be14 - fix(vscode): keep tool scrollbar at the edge (marius-kilocode, 2026-08-19)
- efa48c8cd - fix(vscode): keep tool output actions visible (marius-kilocode, 2026-08-19)
- f39e16318 - refactor(gateway): remove Alibaba and Mistral adapters (Christiaan Arnoldus, 2026-08-19)
- 09464a95e - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-08-19)
- 566b8615f - fix(agent-manager): address PR comment review warnings (marius-kilocode, 2026-08-19)
- 05f2ff093 - Merge pull request #12607 from hdcodedev/chore/jetbrains-remove-unused-compose-plugin (Kirill Kalishev, 2026-08-19)
- dead8981a - fix(agent-manager): keep PR panel below merge line cap (marius-kilocode, 2026-08-19)
- b550030b2 - Merge pull request #13235 from Kilo-Org/refactor-notebook-service-retry (Marius, 2026-08-19)
- 300d86251 - Merge remote-tracking branch 'origin/main' into refactor-notebook-service-retry (marius-kilocode, 2026-08-19)
- dbd08c5d5 - Merge pull request #13237 from Kilo-Org/refactor-agent-manager-service (Marius, 2026-08-19)
- a59260b66 - Merge pull request #13236 from Kilo-Org/refactor-interactive-terminal-service (Marius, 2026-08-19)
- fddbd93db - fix(agent-manager): keep PR panel under line cap (marius-kilocode, 2026-08-19)
- ea4f9e0f0 - feat(agent-manager): improve PR comment interactions (marius-kilocode, 2026-08-19)
- d88a7faa5 - Merge pull request #13229 from Kilo-Org/refactor-terminal-shortcut-logic (Marius, 2026-08-19)
- 66adb2e5d - merge: update notebook branch with main (marius-kilocode, 2026-08-19)
- 457e82876 - Merge pull request #13238 from Kilo-Org/remove-flaky-session-export-e2e-tests (Marius, 2026-08-19)
- 417cf8dde - test(cli): remove flaky session export e2e tests (marius-kilocode, 2026-08-19)
- 7b2f5776a - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-08-19)
- b344f7742 - chore(cli): remove stale notebook allowlist entry (marius-kilocode, 2026-08-19)
- b14a21c53 - Merge pull request #13234 from Kilo-Org/refactor-project-id-service (Marius, 2026-08-19)
- 41d88eb8f - refactor(agent-manager): scope pending request state (marius-kilocode, 2026-08-19)
- c421aadbe - fix(vscode): address session dock review findings (marius-kilocode, 2026-08-19)
- 5cfa60c06 - chore(cli): restore notebook architecture allowlist (marius-kilocode, 2026-08-19)
- b0475ed07 - merge: resolve Agent Manager shortcut conflicts (marius-kilocode, 2026-08-19)
- dd8947abb - fix(cli): scope interactive terminal state (marius-kilocode, 2026-08-19)
- 0a1bf48b7 - refactor(cli): scope notebook state by directory (marius-kilocode, 2026-08-19)
- 31ecd72cf - fix(agent-manager): defer prompt focus until session exists (marius-kilocode, 2026-08-19)
- ec37e1ef5 - refactor(cli): scope project ID cache lifecycle (marius-kilocode, 2026-08-19)
- 7151d40ac - fix(agent-manager): harden terminal focus restoration (marius-kilocode, 2026-08-19)
- e7124b11b - Merge pull request #13230 from Kilo-Org/marvelous-albatross (Marius, 2026-08-19)
- 0f49ed4eb - Merge remote-tracking branch 'origin/main' into optimize-message-submission-ux-transitions (marius-kilocode, 2026-08-19)
- e25c170a3 - Merge pull request #13225 from Kilo-Org/busy-computer (Marius, 2026-08-19)
- a3ba4505b - chore(vscode): format terminal context contract test (marius-kilocode, 2026-08-19)
- 889768e30 - test(vscode): update session dock baselines (marius-kilocode, 2026-08-19)
- a3410f636 - fix(agent-manager): update terminal context contracts (marius-kilocode, 2026-08-19)
- f8b4ef280 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-08-19)
- 223f5dbf1 - chore: annotate legacy requirements test (marius-kilocode, 2026-08-19)
- c995fd1ae - fix(vscode): stabilize session status dock (marius-kilocode, 2026-08-19)
- 20e14cf4f - Merge pull request #13206 from Kilo-Org/fix-agent-manager-nullable-wire-fields (Marius, 2026-08-19)
- 276527f6f - Merge pull request #13228 from Kilo-Org/stabilize-flaky-test (Marius, 2026-08-19)
- 99e0e8118 - feat(agent-manager): add terminal context attachments (marius-kilocode, 2026-08-19)
- aa4f1682b - Merge pull request #13226 from Kilo-Org/remove-pr-sidebar-button (Marius, 2026-08-19)
- e31f5e921 - fix: ignore legacy agent requirements (marius-kilocode, 2026-08-19)
- 76d6ce3e7 - fix(agent-manager): make terminal shortcuts focus-aware (marius-kilocode, 2026-08-19)
- 2d49594d3 - test(cli): reset session export eligibility after tests (marius-kilocode, 2026-08-19)
- ba4573185 - fix(vscode): remove PR sidebar scroll button (marius-kilocode, 2026-08-19)
- 8d64ac6e7 - fix: remove stale agent requirements metadata (marius-kilocode, 2026-08-19)
- da1063865 - fix: remove agent requirements feature (marius-kilocode, 2026-08-19)
- c356c2f78 - Merge pull request #13224 from Kilo-Org/prevent-bash-sleep-looping (Marius, 2026-08-19)
- 26cbcf47f - Merge pull request #13222 from Kilo-Org/remove-trust-toggle-multi-project-agent-manager (Marius, 2026-08-19)
- b1755f918 - fix(cli): clarify background process waits (marius-kilocode, 2026-08-19)
- 26a9c44f6 - fix(vscode): remove multi-project trust toggle (marius-kilocode, 2026-08-19)
- 04385a248 - Merge remote-tracking branch 'origin/main' into fix-agent-manager-nullable-wire-fields (marius-kilocode, 2026-08-19)
- a61ceee6e - Merge remote-tracking branch 'origin/main' into optimize-message-submission-ux-transitions (marius-kilocode, 2026-08-19)
- 1515c0294 - Merge pull request #13214 from Kilo-Org/sundown-swe-pruner (Marius, 2026-08-19)
- a73387498 - Merge pull request #13209 from Kilo-Org/unify-inline-session-diff-viewer (Marius, 2026-08-19)
- 8ba26216d - Merge remote-tracking branch 'origin/unify-inline-session-diff-viewer' into unify-inline-session-diff-viewer (marius-kilocode, 2026-08-19)
- aa73038dc - fix(worktree): keep stale removal idempotent (marius-kilocode, 2026-08-19)
- 693f85a90 - Merge pull request #13213 from Kilo-Org/thin-dumpling (Marius, 2026-08-19)
- 7cc8c579e - Merge branch 'main' into sundown-swe-pruner (Marius, 2026-08-19)
- 357a98d69 - Merge branch 'main' into unify-inline-session-diff-viewer (Marius, 2026-08-19)
- f4bfdf640 - fix(agent-manager): stay within provider file cap (marius-kilocode, 2026-08-18)
- ff16bc2c9 - fix(agent-manager): keep PTYs durable across reloads (marius-kilocode, 2026-08-18)
- 897358b32 - fix(cli): preserve prompt tool service environment (marius-kilocode, 2026-08-18)
- e1bcb320d - fix(cli): remove experimental task-aware output pruning (marius-kilocode, 2026-08-18)
- 7582c012f - chore: remove implementation plan (marius-kilocode, 2026-08-18)
- 3793736c8 - feat(agent-manager): render PR comment diffs with Pierre (marius-kilocode, 2026-08-18)
- aab99aa17 - Merge branch 'main' into fix-agent-manager-nullable-wire-fields (Marius, 2026-08-18)
- e13c6d3ee - fix(cli): let Agent Manager tool fields be null so strict providers can omit them (marius-kilocode, 2026-08-18)
- ae50d9d7c - Merge remote-tracking branch 'origin/main' into optimize-message-submission-ux-transitions (marius-kilocode, 2026-08-18)
- e66e2b7e9 - Merge remote-tracking branch 'origin/main' into optimize-message-submission-ux-transitions (marius-kilocode, 2026-08-17)
- a08897698 - wip: include untracked files before merge (marius-kilocode, 2026-08-17)
- 9e9bf5b81 - wip: commit working tree changes (marius-kilocode, 2026-08-17)
- 4ea07a0b2 - wip: save working tree before merging main (marius-kilocode, 2026-08-17)
- 2157a5e21 - Merge branch 'main' into chore/jetbrains-remove-unused-compose-plugin (hdcode.dev, 2026-07-29)
- 82d3a7c2b - Merge branch 'main' into chore/jetbrains-remove-unused-compose-plugin (hdcode.dev, 2026-07-29)
- cf708dbac - chore(jetbrains): remove unused compose compiler plugin (HDCode, 2026-07-28)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/agent-manager.ts` (+29, -10)
- `packages/opencode/src/kilocode/tool/background-process.txt` (+3, -1)
- `packages/opencode/src/tool/todowrite.txt` (+3, -0)
- `packages/opencode/test/kilocode/tool/memory-runtime.ts` (+0, -11)
- `packages/opencode/test/kilocode/tool/notify-user.test.ts` (+0, -11)
- `packages/opencode/test/kilocode/tool/send-file.test.ts` (+0, -11)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+2, -42)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/src/kilocode/pty/registry.ts` (+264, -0)
- `packages/core/src/kilocode/pty/termination.ts` (+17, -14)
- `packages/core/src/location-services.ts` (+3, -2)
- `packages/core/src/pty.ts` (+81, -68)
- `packages/core/src/v1/config/agent.ts` (+1, -58)
- `packages/core/src/v1/config/config.ts` (+0, -11)
- `packages/core/test/kilocode/pty-durability.test.ts` (+230, -0)
- `packages/core/test/kilocode/pty-termination.test.ts` (+6, -2)

#### Other Changes
- `.changeset/agent-manager-nullable-tool-fields.md` (+5, -0)
- `.changeset/agent-manager-terminal-context.md` (+5, -0)
- `.changeset/blocking-shell-waits.md` (+5, -0)
- `.changeset/durable-agent-manager-terminals.md` (+6, -0)
- `.changeset/fix-tool-output-actions.md` (+5, -0)
- `.changeset/incremental-todo-guidance.md` (+5, -0)
- `.changeset/pierre-pr-comment-diff.md` (+5, -0)
- `.changeset/pr-comments-github-style.md` (+5, -0)
- `.changeset/remove-agent-manager-project-trust.md` (+5, -0)
- `.changeset/remove-agent-requirements.md` (+6, -0)
- `.changeset/remove-alibaba-mistral-gateway-providers.md` (+5, -0)
- `.changeset/remove-pr-sidebar-scroll-button.md` (+5, -0)
- `.changeset/remove-task-aware-output-pruning.md` (+7, -0)
- `.changeset/scoped-interactive-terminal-state.md` (+5, -0)
- `.changeset/steady-session-dock.md` (+5, -0)
- `.changeset/terminal-shortcut-focus.md` (+5, -0)
- `bun.lock` (+0, -10)
- `docs/jetbrains-vscode-settings-parity.md` (+0, -1)
- `nix/hashes.json` (+4, -4)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/pr-panel-comments-200-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/pr-panel-comments-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/readable-chat-420-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-idle-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-requirements-checking-chromium-linux.png` (+0, -3)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-requirements-malformed-chromium-linux.png` (+0, -3)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-requirements-missing-extension-chromium-linux.png` (+0, -3)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-requirements-missing-tools-chromium-linux.png` (+0, -3)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-requirements-ready-chromium-linux.png` (+0, -3)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-with-pending-question-empty-input-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-many-prompts-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-sidebar-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-wide-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-bash-many-rules-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/question-above-chatbox-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/source-links.md` (+0, -2)
- `packages/kilo-gateway/package.json` (+0, -2)
- `packages/kilo-gateway/src/api/constants.ts` (+0, -2)
- `packages/kilo-gateway/src/provider.ts` (+0, -10)
- `packages/kilo-gateway/src/types.ts` (+0, -2)
- `packages/kilo-jetbrains/build.gradle.kts` (+0, -1)
- `packages/kilo-jetbrains/gradle/libs.versions.toml` (+0, -1)
- `packages/kilo-ui/src/components/diff.tsx` (+11, -4)
- `packages/kilo-ui/src/components/message-part.css` (+5, -1)
- `packages/kilo-ui/src/components/message-part.tsx` (+45, -69)
- `packages/kilo-ui/src/components/session-diff.test.ts` (+24, -1)
- `packages/kilo-ui/src/components/session-diff.ts` (+29, -0)
- `packages/kilo-vscode/CHANGELOG.md` (+3, -0)
- `packages/kilo-vscode/package.json` (+16, -5)
- `packages/kilo-vscode/src/KiloProvider.ts` (+29, -50)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+20, -21)
- `packages/kilo-vscode/src/agent-manager/PRStatusPoller.ts` (+12, -3)
- `packages/kilo-vscode/src/agent-manager/SessionTerminalManager.ts` (+12, -4)
- `packages/kilo-vscode/src/agent-manager/discard-worktree.ts` (+36, -0)
- `packages/kilo-vscode/src/agent-manager/format-keybinding.ts` (+34, -10)
- `packages/kilo-vscode/src/agent-manager/host.ts` (+1, -1)
- `packages/kilo-vscode/src/agent-manager/pr-status-bridge.ts` (+2, -0)
- `packages/kilo-vscode/src/agent-manager/pr/am-pr-types.ts` (+2, -0)
- `packages/kilo-vscode/src/agent-manager/pr/am-pr-utils.ts` (+32, -2)
- `packages/kilo-vscode/src/agent-manager/project/context.ts` (+2, -3)
- `packages/kilo-vscode/src/agent-manager/project/contexts.ts` (+3, -8)
- `packages/kilo-vscode/src/agent-manager/project/hydrate.ts` (+1, -1)
- `packages/kilo-vscode/src/agent-manager/project/messages.ts` (+4, -14)
- `packages/kilo-vscode/src/agent-manager/project/pollers.ts` (+2, -2)
- `packages/kilo-vscode/src/agent-manager/project/registry.ts` (+0, -18)
- `packages/kilo-vscode/src/agent-manager/project/wiring.ts` (+0, -1)
- `packages/kilo-vscode/src/agent-manager/provider-lifecycle.ts` (+25, -10)
- `packages/kilo-vscode/src/agent-manager/provider-multi-version.ts` (+8, -1)
- `packages/kilo-vscode/src/agent-manager/pty-cleanup.ts` (+20, -0)
- `packages/kilo-vscode/src/agent-manager/terminal-manager.ts` (+64, -7)
- `packages/kilo-vscode/src/agent-manager/terminal-routing.ts` (+18, -2)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+8, -7)
- `packages/kilo-vscode/src/agent-manager/vscode-host.ts` (+6, -1)
- `packages/kilo-vscode/src/agent-manager/worktree-importer.ts` (+9, -0)
- `packages/kilo-vscode/src/extension.ts` (+5, -2)
- `packages/kilo-vscode/src/indexing-consent.ts` (+4, -10)
- `packages/kilo-vscode/src/kilo-provider/agent-requirements-controller.ts` (+0, -198)
- `packages/kilo-vscode/src/kilo-provider/agent-requirements.ts` (+0, -103)
- `packages/kilo-vscode/src/kilo-provider/options.ts` (+6, -0)
- `packages/kilo-vscode/src/services/marketplace/types.ts` (+0, -5)
- `packages/kilo-vscode/src/shared/review-comments.ts` (+146, -18)
- `packages/kilo-vscode/tests/fixtures/pr-comments-render.tsx` (+164, -0)
- `packages/kilo-vscode/tests/session-dock-stability.spec.ts` (+159, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+8, -7)
- `packages/kilo-vscode/tests/unit/agent-manager-diff-state.test.ts` (+15, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-focus.test.ts` (+29, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-new-worktree-project.test.ts` (+1, -5)
- `packages/kilo-vscode/tests/unit/agent-manager-session-restore.test.ts` (+77, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-terminal-output.test.ts` (+24, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-terminal-routing.test.ts` (+41, -0)
- `packages/kilo-vscode/tests/unit/agent-project-contexts.test.ts` (+16, -27)
- `packages/kilo-vscode/tests/unit/agent-project-hydrate.test.ts` (+3, -11)
- `packages/kilo-vscode/tests/unit/agent-project-messages.test.ts` (+5, -16)
- `packages/kilo-vscode/tests/unit/agent-project-pollers.test.ts` (+3, -4)
- `packages/kilo-vscode/tests/unit/agent-project-selection.test.ts` (+3, -4)
- `packages/kilo-vscode/tests/unit/agent-requirements.test.ts` (+0, -201)
- `packages/kilo-vscode/tests/unit/am-pr-utils.test.ts` (+84, -3)
- `packages/kilo-vscode/tests/unit/extension-arch.test.ts` (+27, -3)
- `packages/kilo-vscode/tests/unit/format-keybinding.test.ts` (+25, -0)
- `packages/kilo-vscode/tests/unit/kilo-ui-contract.test.ts` (+0, -5)
- `packages/kilo-vscode/tests/unit/marketplace-installer.test.ts` (+2, -7)
- `packages/kilo-vscode/tests/unit/navigate.test.ts` (+0, -1)
- `packages/kilo-vscode/tests/unit/pr-comments-render.test.ts` (+57, -0)
- `packages/kilo-vscode/tests/unit/prompt-send-contract.test.ts` (+26, -3)
- `packages/kilo-vscode/tests/unit/pty-cleanup.test.ts` (+57, -0)
- `packages/kilo-vscode/tests/unit/review-comments-pr.test.ts` (+179, -0)
- `packages/kilo-vscode/tests/unit/session-dock.test.ts` (+101, -0)
- `packages/kilo-vscode/tests/unit/session-queue.test.ts` (+44, -1)
- `packages/kilo-vscode/tests/unit/session-terminal-manager.test.ts` (+22, -1)
- `packages/kilo-vscode/tests/unit/terminal-architecture.test.ts` (+6, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+67, -56)
- `packages/kilo-vscode/webview-ui/agent-manager/DiffPanel.tsx` (+32, -42)
- `packages/kilo-vscode/webview-ui/agent-manager/NewWorktreeDialog.tsx` (+0, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectList.tsx` (+0, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectSelect.tsx` (+3, -8)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectsSection.tsx` (+1, -12)
- `packages/kilo-vscode/webview-ui/agent-manager/TabBar.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+0, -9)
- `packages/kilo-vscode/webview-ui/agent-manager/focus.ts` (+42, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+17, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+17, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+17, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+17, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+17, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+17, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+17, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fa.ts` (+17, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fr.ts` (+17, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/it.ts` (+17, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ja.ts` (+17, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ko.ts` (+17, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/nl.ts` (+17, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/no.ts` (+17, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/pl.ts` (+17, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ru.ts` (+17, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/th.ts` (+17, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/tr.ts` (+17, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/uk.ts` (+17, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zh.ts` (+17, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zht.ts` (+17, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/keybind-defaults.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRCommentCard.tsx` (+123, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRComments.tsx` (+148, -99)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRPanel.tsx` (+12, -21)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRPanelHost.tsx` (+33, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/pr-comment-payload.ts` (+55, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/pr-panel-actions.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/pr-panel.css` (+95, -101)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/pr-types.ts` (+7, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/project/store.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/selection-actions.ts` (+47, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/shortcuts.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/tab-rendering.tsx` (+7, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/SideTerminalPanel.tsx` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/TerminalTab.tsx` (+13, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/output.ts` (+52, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/render.tsx` (+16, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/state.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/diff-viewer/FullScreenDiffView.tsx` (+47, -50)
- `packages/kilo-vscode/webview-ui/diff-viewer/PRCommentDiff.tsx` (+17, -0)
- `packages/kilo-vscode/webview-ui/diff-viewer/diff-open-policy.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/diff-viewer/review-annotations.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/AgentRequirements.tsx` (+0, -193)
- `packages/kilo-vscode/webview-ui/src/components/chat/ChatView.tsx` (+36, -33)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+15, -4)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+18, -22)
- `packages/kilo-vscode/webview-ui/src/components/chat/ReviewComments.tsx` (+64, -29)
- `packages/kilo-vscode/webview-ui/src/components/chat/SessionDock.tsx` (+49, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/ExperimentalTab.tsx` (+0, -34)
- `packages/kilo-vscode/webview-ui/src/components/shared/WorkingIndicator.tsx` (+20, -30)
- `packages/kilo-vscode/webview-ui/src/components/shared/working-indicator-utils.ts` (+14, -0)
- `packages/kilo-vscode/webview-ui/src/context/agent-requirements-state.ts` (+0, -10)
- `packages/kilo-vscode/webview-ui/src/context/agent-requirements.tsx` (+0, -104)
- `packages/kilo-vscode/webview-ui/src/context/provider-shell.tsx` (+3, -6)
- `packages/kilo-vscode/webview-ui/src/context/session-queue.ts` (+4, -2)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+23, -11)
- `packages/kilo-vscode/webview-ui/src/hooks/useTerminalContext.ts` (+25, -11)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+0, -30)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+0, -30)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+0, -30)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+0, -30)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+0, -31)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+0, -30)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+0, -31)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+0, -30)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+0, -30)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+0, -31)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+0, -30)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+0, -30)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+0, -31)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+0, -30)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+0, -30)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+0, -30)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+0, -30)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+0, -30)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+0, -30)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+0, -29)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+0, -29)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+28, -52)
- `packages/kilo-vscode/webview-ui/src/stories/agent-manager.stories.tsx` (+83, -19)
- `packages/kilo-vscode/webview-ui/src/stories/chat.stories.tsx` (+40, -128)
- `packages/kilo-vscode/webview-ui/src/styles/agent-requirements.css` (+0, -294)
- `packages/kilo-vscode/webview-ui/src/styles/chat-layout.css` (+62, -7)
- `packages/kilo-vscode/webview-ui/src/styles/chat.css` (+0, -1)
- `packages/kilo-vscode/webview-ui/src/styles/session-actions.css` (+7, -1)
- `packages/kilo-vscode/webview-ui/src/types/marketplace.ts` (+0, -5)
- `packages/kilo-vscode/webview-ui/src/types/messages/agent-manager.ts` (+6, -1)
- `packages/kilo-vscode/webview-ui/src/types/messages/agents.ts` (+0, -46)
- `packages/kilo-vscode/webview-ui/src/types/messages/config.ts` (+0, -3)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+9, -16)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+9, -18)
- `packages/kilo-vscode/webview-ui/src/utils/draft-store.ts` (+3, -3)
- `packages/opencode/CHANGELOG.md` (+0, -12)
- `packages/opencode/src/effect/app-runtime.ts` (+2, -0)
- `packages/opencode/src/effect/instance-registry.ts` (+10, -4)
- `packages/opencode/src/kilocode/agent-manager/service.ts` (+90, -28)
- `packages/opencode/src/kilocode/agent-requirements.ts` (+0, -261)
- `packages/opencode/src/kilocode/cli/agent-requirements.ts` (+0, -116)
- `packages/opencode/src/kilocode/interactive-terminal/index.ts` (+49, -23)
- `packages/opencode/src/kilocode/notebook/service.ts` (+85, -30)
- `packages/opencode/src/kilocode/project-id.ts` (+11, -11)
- `packages/opencode/src/kilocode/provider-options.ts` (+0, -8)
- `packages/opencode/src/kilocode/provider/provider.ts` (+0, -2)
- `packages/opencode/src/kilocode/server/httpapi/groups/kilocode.ts` (+0, -17)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilocode.ts` (+0, -7)
- `packages/opencode/src/kilocode/swe-pruner.ts` (+0, -264)
- `packages/opencode/src/kilocode/worktree/pty-cleanup.ts` (+15, -0)
- `packages/opencode/src/project/instance-store.ts` (+5, -3)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/pty.ts` (+22, -7)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/session.ts` (+1, -4)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+2, -0)
- `packages/opencode/src/server/server.ts` (+6, -2)
- `packages/opencode/src/session/prompt.ts` (+3, -13)
- `packages/opencode/src/session/session.ts` (+1, -3)
- `packages/opencode/src/session/tools.ts` (+3, -12)
- `packages/opencode/src/worktree/index.ts` (+4, -0)
- `packages/opencode/test/config/config.test.ts` (+18, -0)
- `packages/opencode/test/kilocode/agent-manager-service.test.ts` (+59, -0)
- `packages/opencode/test/kilocode/agent-manager-tool.test.ts` (+76, -1)
- `packages/opencode/test/kilocode/agent-requirements-cli.test.ts` (+0, -176)
- `packages/opencode/test/kilocode/agent-requirements.test.ts` (+0, -307)
- `packages/opencode/test/kilocode/interactive-terminal.test.ts` (+97, -11)
- `packages/opencode/test/kilocode/notebook-service.test.ts` (+48, -0)
- `packages/opencode/test/kilocode/project-id.test.ts` (+36, -12)
- `packages/opencode/test/kilocode/server/httpapi-exercise-scenarios.ts` (+0, -13)
- `packages/opencode/test/kilocode/session-export/e2e.test.ts` (+0, -111)
- `packages/opencode/test/kilocode/session-export/eligibility.test.ts` (+2, -1)
- `packages/opencode/test/kilocode/session-export/sequence.test.ts` (+0, -43)
- `packages/opencode/test/kilocode/session-export/worker.test.ts` (+0, -62)
- `packages/opencode/test/kilocode/session-resume-integration.test.ts` (+0, -1)
- `packages/opencode/test/kilocode/swe-pruner.test.ts` (+0, -312)
- `packages/opencode/test/kilocode/todowrite-description.test.ts` (+10, -0)
- `packages/opencode/test/kilocode/todowrite-e2e.test.ts` (+79, -0)
- `packages/opencode/test/kilocode/tool-schema-provider-compat.test.ts` (+62, -0)
- `packages/opencode/test/server/httpapi-listen.test.ts` (+4, -1)
- `packages/opencode/test/server/httpapi-pty.test.ts` (+13, -6)
- `packages/opencode/test/session/prompt.test.ts` (+0, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+0, -38)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+2, -60)
- `packages/sdk/openapi.json` (+2, -169)
- `packages/server/src/routes.ts` (+2, -0)
- `packages/tui/src/component/prompt/index.tsx` (+0, -24)
- `packages/ui/src/i18n/ar.ts` (+0, -1)
- `packages/ui/src/i18n/br.ts` (+0, -1)
- `packages/ui/src/i18n/bs.ts` (+0, -1)
- `packages/ui/src/i18n/da.ts` (+0, -1)
- `packages/ui/src/i18n/de.ts` (+0, -1)
- `packages/ui/src/i18n/en.ts` (+0, -1)
- `packages/ui/src/i18n/es.ts` (+0, -1)
- `packages/ui/src/i18n/fr.ts` (+0, -1)
- `packages/ui/src/i18n/it.ts` (+0, -1)
- `packages/ui/src/i18n/ja.ts` (+0, -1)
- `packages/ui/src/i18n/ko.ts` (+0, -1)
- `packages/ui/src/i18n/nl.ts` (+0, -1)
- `packages/ui/src/i18n/no.ts` (+0, -1)
- `packages/ui/src/i18n/pl.ts` (+0, -1)
- `packages/ui/src/i18n/ru.ts` (+0, -1)
- `packages/ui/src/i18n/th.ts` (+0, -1)
- `packages/ui/src/i18n/tr.ts` (+0, -1)
- `packages/ui/src/i18n/uk.ts` (+0, -1)
- `packages/ui/src/i18n/zh.ts` (+0, -1)
- `packages/ui/src/i18n/zht.ts` (+0, -1)
- `plans/agent-manager-pr-comments-ux.md` (+418, -0)
- `script/architecture-allowlist.json` (+0, -4)

### Key Diffs

#### packages/core/src/kilocode/pty/registry.ts
```diff
diff --git a/packages/core/src/kilocode/pty/registry.ts b/packages/core/src/kilocode/pty/registry.ts
new file mode 100644
index 000000000..08ea77e52
--- /dev/null
+++ b/packages/core/src/kilocode/pty/registry.ts
@@ -0,0 +1,264 @@
+import type { Disp, Proc } from "#pty"
+import path from "node:path"
+import { Log } from "../../util/log"
+import type { Location } from "../../location"
+import type { Info } from "../../pty"
+import type { PtyID } from "../../pty/schema"
+import { KiloPtyTermination } from "./termination"
+
+const log = Log.create({ service: "pty.registry" })
+
+export type Subscriber = {
+  readonly onData: (chunk: string) => void
+  readonly onEnd: (event: { exitCode?: number }) => void
+  active: boolean
+  detached: boolean
+  pending: string[]
+  end?: { exitCode?: number }
+}
+
+export type Active = {
+  info: Info
+  location: Location.Ref
+  process: Proc
+  buffer: string
+  bufferCursor: number
+  cursor: number
+  subscribers: Map<object, Subscriber>
+  listeners: Disp[]
+  stopping: boolean
+  terminated: boolean
+  closing?: Promise<void>
+}
+
+export const sessions = new Map<PtyID, Active>()
+const exited = new Map<string, PtyID[]>()
+const pending = new Map<number, Location.Ref>()
+const blocked = new Map<string, Location.Ref>()
+const removing = new Set<PtyID>()
+const waiters = new Set<() => void>()
+const directoryTasks = new Map<string, Promise<void>>()
+let next = 0
+let closing = false
+let shutdownTask: Promise<void> | undefined
+let owners = 0
```

#### packages/core/src/kilocode/pty/termination.ts
```diff
diff --git a/packages/core/src/kilocode/pty/termination.ts b/packages/core/src/kilocode/pty/termination.ts
index bb1fd30be..92c0c8b9b 100644
--- a/packages/core/src/kilocode/pty/termination.ts
+++ b/packages/core/src/kilocode/pty/termination.ts
@@ -67,10 +67,7 @@ function descendants(root: number, rows: Array<{ pid: number; parent: number }>)
 }
 
 async function family(root: number, input: Runtime) {
-  const rows = await input.tree().catch((err) => {
-    log.debug("failed to inspect PTY process tree", { err, pid: root })
-    return []
-  })
+  const rows = await input.tree()
   return [...descendants(root, rows), root]
 }
 
@@ -90,7 +87,7 @@ function signal(proc: Process, pids: number[], value: "SIGTERM" | "SIGKILL", inp
 }
 
 async function tree(file: string = "ps", args: string[] = ["-axo", "pid=,ppid="]) {
-  return await new Promise<Array<{ pid: number; parent: number }>>((resolve) => {
+  return await new Promise<Array<{ pid: number; parent: number }>>((resolve, reject) => {
     try {
       const child = spawn(file, args, {
         stdio: ["ignore", "pipe", "ignore"],
@@ -100,9 +97,9 @@ async function tree(file: string = "ps", args: string[] = ["-axo", "pid=,ppid="]
       })
       const chunks: Buffer[] = []
       child.stdout?.on("data", (chunk: Buffer) => chunks.push(chunk))
-      child.once("error", () => resolve([]))
+      child.once("error", reject)
       child.once("close", (code) => {
-        if (code !== 0) return resolve([])
+        if (code !== 0) return reject(new Error(`process tree command exited with ${code}`))
         const rows = Buffer.concat(chunks)
           .toString("utf8")
           .trim()
@@ -113,17 +110,13 @@ async function tree(file: string = "ps", args: string[] = ["-axo", "pid=,ppid="]
           .map(([pid, parent]) => ({ pid: pid!, parent: parent! }))
         resolve(rows)
       })
-    } catch {
-      resolve([])
+    } catch (error) {
+      reject(error)
     }
   })
 }
 
-async function taskkill(
```

#### packages/core/src/location-services.ts
```diff
diff --git a/packages/core/src/location-services.ts b/packages/core/src/location-services.ts
index 7da67673c..09b3b69b1 100644
--- a/packages/core/src/location-services.ts
+++ b/packages/core/src/location-services.ts
@@ -1,4 +1,4 @@
-import { Effect, Layer, LayerMap } from "effect"
+import { Duration, Effect, Layer, LayerMap } from "effect" // kilocode_change
 import { AgentV2 } from "./agent"
 import { AISDK } from "./aisdk"
 import { Catalog } from "./catalog"
@@ -83,6 +83,7 @@ export type LocationError = LayerNode.Error<typeof locationServices>
 
 export function buildLocationServiceMap(
   replacements: LayerNode.Replacements = [],
+  options: { readonly idleTimeToLive?: Duration.Input } = {}, // kilocode_change
 ): Layer.Layer<LocationServiceMap.Service> {
   return Layer.effect(
     LocationServiceMap.Service,
@@ -106,7 +107,7 @@ export function buildLocationServiceMap(
           Layer.provide(LayerNode.compile(location.hoisted)),
         )
       },
-      { idleTimeToLive: "60 minutes" },
+      { idleTimeToLive: options.idleTimeToLive ?? "60 minutes" }, // kilocode_change
     ),
   )
 }
```

#### packages/core/src/pty.ts
```diff
diff --git a/packages/core/src/pty.ts b/packages/core/src/pty.ts
index 97f41bcd5..25741eacf 100644
--- a/packages/core/src/pty.ts
+++ b/packages/core/src/pty.ts
@@ -1,7 +1,6 @@
 export * as Pty from "./pty"
 
-import { makeLocationNode } from "./effect/app-node"
-import type { Disp, Proc } from "#pty"
+import { makeGlobalNode, makeLocationNode } from "./effect/app-node" // kilocode_change
 import { Context, Effect, Layer, Schema, Types } from "effect"
 import { Pty } from "@opencode-ai/schema/pty"
 import { Config } from "./config"
@@ -12,7 +11,8 @@ import { SessionSchema } from "./session/schema" // kilocode_change
 import { Shell } from "./shell"
 import { lazy } from "./util/lazy"
 import { KiloPtySelfCommand } from "./kilocode/pty-self-command" // kilocode_change
-import { KiloPtyTermination } from "./kilocode/pty/termination" // kilocode_change
+import * as KiloPtyRegistry from "./kilocode/pty/registry" // kilocode_change
+import type { Active, Subscriber } from "./kilocode/pty/registry" // kilocode_change
 
 const BUFFER_LIMIT = 1024 * 1024 * 2
 // Exited sessions stay observable (status, exit code, retained output) until removed explicitly.
@@ -20,26 +20,6 @@ const BUFFER_LIMIT = 1024 * 1024 * 2
 const EXITED_LIMIT = 25
 const pty = lazy(() => import("#pty"))
 
-type Subscriber = {
-  readonly onData: (chunk: string) => void
-  readonly onEnd: (event: { exitCode?: number }) => void
-  active: boolean
-  detached: boolean
-  pending: string[]
-  end?: { exitCode?: number }
-}
-
-type Active = {
-  info: Info
-  process: Proc
-  buffer: string
-  bufferCursor: number
-  cursor: number
-  subscribers: Map<object, Subscriber>
-  listeners: Disp[]
-  stopping: boolean // kilocode_change
-}
-
 // kilocode_change - the Kilo `sessionID` field now lives on the canonical shared schema (see
 // packages/schema/src/pty.ts) so the generated SDK carries it; reuse that schema verbatim here.
 export const Info = Pty.Info
```

#### packages/core/src/v1/config/agent.ts
```diff
diff --git a/packages/core/src/v1/config/agent.ts b/packages/core/src/v1/config/agent.ts
index ea49adb8b..6ac30d2f6 100644
--- a/packages/core/src/v1/config/agent.ts
+++ b/packages/core/src/v1/config/agent.ts
@@ -9,62 +9,6 @@ const Color = Schema.Union([
   Schema.Literals(["primary", "secondary", "accent", "success", "warning", "error", "info"]),
 ])
 
-// kilocode_change start - agent skill/MCP/VS Code extension requirements schema
-const RequirementID = Schema.String.check(
-  Schema.isMinLength(1),
-  Schema.isMaxLength(128),
-  Schema.isPattern(/^[A-Za-z0-9][A-Za-z0-9._-]*$/),
-)
-const RequirementName = Schema.String.check(Schema.isMinLength(1), Schema.isMaxLength(128), Schema.isPattern(/\S/))
-
-export const VSCodeExtension = Schema.Struct({
-  name: RequirementName,
-  id: RequirementID,
-})
-export type VSCodeExtension = Schema.Schema.Type<typeof VSCodeExtension>
-
-const RequirementGroup = Schema.mutable(Schema.Array(RequirementName)).check(
-  Schema.isMinLength(1),
-  Schema.isMaxLength(20),
-)
-const VSCodeExtensions = Schema.mutable(Schema.Array(VSCodeExtension)).check(
-  Schema.isMinLength(1),
-  Schema.isMaxLength(20),
-)
-
-export const Requirements = Schema.Struct({
-  skills: Schema.optional(RequirementGroup),
-  mcps: Schema.optional(RequirementGroup),
-  vscode_extensions: Schema.optional(VSCodeExtensions),
-}).check(
-  Schema.makeFilter((input) => {
-    const issues: Schema.FilterIssue[] = []
-    if (!input.skills && !input.mcps && !input.vscode_extensions) {
-      issues.push({ path: [], issue: "At least one requirement group is required" })
-    }
-
-    for (const group of ["skills", "mcps"] as const) {
-      const seen = new Set<string>()
-      for (const [index, value] of (input[group] ?? []).entries()) {
-        if (seen.has(value)) issues.push({ path: [group, index], issue: `Duplicate ${group} requirement` })
-        seen.add(value)
-      }
-    }
-
```


*... and more files (showing first 5)*

## opencode Changes (da4730e..b155b15)

### Commits

- b155b15 - sync release versions for v1.18.19 (opencode, 2026-08-20)
- d06bf48 - sync (Frank, 2026-08-20)
- ccccd75 - Merge branch 'dev' of github.com:anomalyco/opencode into dev (Frank, 2026-08-20)
- 03d65f3 - sync (Frank, 2026-08-20)
- f4a8968 - fix(tui): remove encrypted label from thought header (#43588) (Aiden Cline, 2026-08-20)
- f715478 - doc muse regions (Frank, 2026-08-20)
- e0e9bd7 - fix(tui): show encrypted reasoning status (#43578) (opencode-agent[bot], 2026-08-20)
- 5ccb1e8 - fix(stats): normalize routed model ids (#43582) (opencode-agent[bot], 2026-08-20)
- be469f3 - sync (Frank, 2026-08-20)
- fc80874 - chore: generate (opencode-agent[bot], 2026-08-20)
- 3d26b12 - zen: muse spark contributor (Frank, 2026-08-19)
- 1b77242 - country check for muse spark in free (Frank, 2026-08-19)
- 4c5960d - feat(stats): include free tier usage (Adam, 2026-08-19)
- e2505d4 - Revert "update go models" (Frank, 2026-08-19)
- a466a35 - Revert "chore: generate" (Frank, 2026-08-19)
- 6386e67 - chore: generate (opencode-agent[bot], 2026-08-19)
- 16af134 - update go models (Frank, 2026-08-19)
- d545d8f - feat(go): promote Hy3 usage (#43429) (Jack, 2026-08-19)

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
- `packages/core/package.json` (+1, -1)
- `packages/stats/core/package.json` (+1, -1)
- `packages/stats/core/src/domain/geo.ts` (+2, -1)
- `packages/stats/core/src/domain/home.ts` (+18, -15)
- `packages/stats/core/src/domain/inference.test.ts` (+9, -1)
- `packages/stats/core/src/domain/inference.ts` (+18, -4)
- `packages/stats/core/src/domain/model-normalization.ts` (+4, -2)
- `packages/stats/core/src/domain/model.ts` (+2, -1)
- `packages/stats/core/src/domain/provider.ts` (+2, -1)
- `packages/stats/core/src/domain/stat.ts` (+7, -1)
- `packages/stats/core/src/honeycomb-backfill.ts` (+1, -2)

#### Other Changes
- `bun.lock` (+28, -28)
- `packages/app/package.json` (+1, -1)
- `packages/cli/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/i18n/ar.ts` (+3, -0)
- `packages/console/app/src/i18n/br.ts` (+3, -0)
- `packages/console/app/src/i18n/da.ts` (+3, -0)
- `packages/console/app/src/i18n/de.ts` (+3, -0)
- `packages/console/app/src/i18n/en.ts` (+2, -0)
- `packages/console/app/src/i18n/es.ts` (+3, -0)
- `packages/console/app/src/i18n/fr.ts` (+3, -0)
- `packages/console/app/src/i18n/it.ts` (+3, -0)
- `packages/console/app/src/i18n/ja.ts` (+3, -0)
- `packages/console/app/src/i18n/ko.ts` (+3, -0)
- `packages/console/app/src/i18n/no.ts` (+3, -0)
- `packages/console/app/src/i18n/pl.ts` (+3, -0)
- `packages/console/app/src/i18n/ru.ts` (+3, -0)
- `packages/console/app/src/i18n/th.ts` (+3, -0)
- `packages/console/app/src/i18n/tr.ts` (+3, -0)
- `packages/console/app/src/i18n/uk.ts` (+3, -0)
- `packages/console/app/src/i18n/zh.ts` (+3, -0)
- `packages/console/app/src/i18n/zht.ts` (+3, -0)
- `packages/console/app/src/lib/request-country.ts` (+1, -1)
- `packages/console/app/src/routes/go/index.css` (+26, -0)
- `packages/console/app/src/routes/go/index.tsx` (+31, -4)
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
- `packages/opencode/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/app/src/i18n.ts` (+13, -13)
- `packages/stats/app/src/i18n/ar.ts` (+17, -18)
- `packages/stats/app/src/i18n/br.ts` (+17, -17)
- `packages/stats/app/src/i18n/da.ts` (+17, -18)
- `packages/stats/app/src/i18n/de.ts` (+17, -17)
- `packages/stats/app/src/i18n/es.ts` (+17, -17)
- `packages/stats/app/src/i18n/fr.ts` (+17, -17)
- `packages/stats/app/src/i18n/it.ts` (+17, -17)
- `packages/stats/app/src/i18n/ja.ts` (+17, -17)
- `packages/stats/app/src/i18n/ko.ts` (+17, -18)
- `packages/stats/app/src/i18n/no.ts` (+17, -17)
- `packages/stats/app/src/i18n/pl.ts` (+17, -17)
- `packages/stats/app/src/i18n/ru.ts` (+17, -17)
- `packages/stats/app/src/i18n/th.ts` (+17, -17)
- `packages/stats/app/src/i18n/tr.ts` (+17, -17)
- `packages/stats/app/src/i18n/uk.ts` (+17, -17)
- `packages/stats/app/src/i18n/zh.ts` (+17, -17)
- `packages/stats/app/src/i18n/zht.ts` (+17, -17)
- `packages/stats/app/src/routes/[lab]/[model].tsx` (+1, -1)
- `packages/stats/app/src/routes/[lab]/index.tsx` (+1, -1)
- `packages/stats/server/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/tui/src/routes/session/index.tsx` (+13, -20)
- `packages/ui/package.json` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/ar/go.mdx` (+2, -2)
- `packages/web/src/content/docs/ar/zen.mdx` (+67, -71)
- `packages/web/src/content/docs/bs/go.mdx` (+2, -2)
- `packages/web/src/content/docs/bs/zen.mdx` (+67, -71)
- `packages/web/src/content/docs/da/go.mdx` (+2, -2)
- `packages/web/src/content/docs/da/zen.mdx` (+67, -71)
- `packages/web/src/content/docs/de/go.mdx` (+2, -2)
- `packages/web/src/content/docs/de/zen.mdx` (+67, -71)
- `packages/web/src/content/docs/es/go.mdx` (+2, -2)
- `packages/web/src/content/docs/es/zen.mdx` (+67, -71)
- `packages/web/src/content/docs/fr/go.mdx` (+2, -2)
- `packages/web/src/content/docs/fr/zen.mdx` (+67, -71)
- `packages/web/src/content/docs/go.mdx` (+2, -2)
- `packages/web/src/content/docs/it/go.mdx` (+2, -2)
- `packages/web/src/content/docs/it/zen.mdx` (+67, -71)
- `packages/web/src/content/docs/ja/go.mdx` (+2, -2)
- `packages/web/src/content/docs/ja/zen.mdx` (+67, -71)
- `packages/web/src/content/docs/ko/go.mdx` (+2, -2)
- `packages/web/src/content/docs/ko/zen.mdx` (+67, -71)
- `packages/web/src/content/docs/nb/go.mdx` (+2, -2)
- `packages/web/src/content/docs/nb/zen.mdx` (+67, -71)
- `packages/web/src/content/docs/pl/go.mdx` (+2, -2)
- `packages/web/src/content/docs/pl/zen.mdx` (+67, -71)
- `packages/web/src/content/docs/pt-br/go.mdx` (+2, -2)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+67, -71)
- `packages/web/src/content/docs/ru/go.mdx` (+2, -2)
- `packages/web/src/content/docs/ru/zen.mdx` (+67, -71)
- `packages/web/src/content/docs/th/go.mdx` (+2, -2)
- `packages/web/src/content/docs/th/zen.mdx` (+67, -71)
- `packages/web/src/content/docs/tr/go.mdx` (+2, -2)
- `packages/web/src/content/docs/tr/zen.mdx` (+67, -71)
- `packages/web/src/content/docs/zen.mdx` (+67, -71)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+2, -2)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+67, -71)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+2, -2)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+67, -71)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index a0a1676..dc867b4 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.18.18",
+  "version": "1.18.19",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 031fd95..cdcdfe0 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.18.18",
+  "version": "1.18.19",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/stats/core/package.json
```diff
diff --git a/packages/stats/core/package.json b/packages/stats/core/package.json
index 80b9511..f816838 100644
--- a/packages/stats/core/package.json
+++ b/packages/stats/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/stats-core",
-  "version": "1.18.18",
+  "version": "1.18.19",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/stats/core/src/domain/geo.ts
```diff
diff --git a/packages/stats/core/src/domain/geo.ts b/packages/stats/core/src/domain/geo.ts
index b75e08a..a61e341 100644
--- a/packages/stats/core/src/domain/geo.ts
+++ b/packages/stats/core/src/domain/geo.ts
@@ -7,6 +7,7 @@ import { RETIRED_STAT_MODELS, RETIRED_STAT_PROVIDERS } from "./model-normalizati
 import {
   chunks,
   collapseRows,
+  DATA_SITE_TIERS,
   inserted,
   isMissingUniqueUsersColumn,
   omitUniqueUsers,
@@ -93,7 +94,7 @@ export class GeoStatRepo extends Context.Service<GeoStatRepo, GeoStatRepo.Servic
                   eq(geoStat.grain, "day"),
                   eq(geoStat.client, "all"),
                   eq(geoStat.source, "all"),
-                  inArray(geoStat.tier, ["Go", "go"]),
+                  inArray(geoStat.tier, DATA_SITE_TIERS),
                   scope,
                 ),
               )
```

#### packages/stats/core/src/domain/home.ts
```diff
diff --git a/packages/stats/core/src/domain/home.ts b/packages/stats/core/src/domain/home.ts
index c1ac4dc..8a54143 100644
--- a/packages/stats/core/src/domain/home.ts
+++ b/packages/stats/core/src/domain/home.ts
@@ -5,6 +5,7 @@ import { DatabaseError } from "../database"
 import type { GeoStatMetric } from "./geo"
 import { ModelStatRepo, type ModelStatMetric } from "./model"
 import type { ProviderStatMetric } from "./provider"
+import { DATA_SITE_TIERS, normalizeTier } from "./stat"
 
 export type UsageProduct = "All Users" | "Zen" | "Go" | "Enterprise"
 export type TokenProduct = "Zen" | "Go" | "Enterprise"
@@ -129,7 +130,9 @@ const TOKEN_SCALE = 1_000_000
 const DOLLARS_PER_MICROCENT = 1 / 100_000_000
 const METRIC_MODEL_LIMIT = 10
 const TOP_MODEL_SEGMENT_LIMIT = 9
+// Preserve the response shape while the public site presents Go and Free as one cohort.
 const SITE_PRODUCT = "Go"
+const SITE_TIER_PLACEHOLDERS = DATA_SITE_TIERS.map(() => "?").join(", ")
 const LEADERBOARD_CHANGE_MIN_MULTIPLE = 10
 const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"] as const
 
@@ -212,10 +215,13 @@ export function getStatsLabData(provider: string): Effect.Effect<StatsLabData |
 
 async function listModelDaily(): Promise<ModelStatMetric[]> {
   return (
-    await queryRows(`select period_key, updated_at, tier, provider, model, sessions, unique_users, input_tokens,
+    await queryRows(
+      `select period_key, updated_at, tier, provider, model, sessions, unique_users, input_tokens,
     output_tokens, reasoning_tokens, cache_read_tokens, total_tokens, input_cost_microcents, output_cost_microcents,
     total_cost_microcents from model_stat where grain = 'day' and client = 'all' and source = 'all'
-    and tier in ('Go', 'go') order by period_key`)
+    and tier in (${SITE_TIER_PLACEHOLDERS}) order by period_key`,
+      DATA_SITE_TIERS,
+    )
   ).map((row) => ({
     periodKey: stringValue(row.period_key),
     updatedAt: dateValue(row.updated_at),
@@ -237,8 +243,12 @@ async function listModelDaily(): Promise<ModelStatMetric[]> {
 
 async function listProviderDaily(): Promise<ProviderStatMetric[]> {
   return (
-    await queryRows(`select period_key, updated_at, tier, provider, total_tokens from provider_stat
-    where grain = 'day' and client = 'all' and source = 'all' and tier in ('Go', 'go') order by period_key`)
+    await queryRows(
+      `select period_key, updated_at, tier, provider, total_tokens from provider_stat
+    where grain = 'day' and client = 'all' and source = 'all'
+    and tier in (${SITE_TIER_PLACEHOLDERS}) order by period_key`,
+      DATA_SITE_TIERS,
+    )
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/agent.ts
- `src/core/` - review core changes from packages/core/src/kilocode/pty/registry.ts
- `src/core/` - review core changes from packages/core/src/kilocode/pty/termination.ts
- `src/core/` - review core changes from packages/core/src/location-services.ts
- `src/core/` - review core changes from packages/core/src/pty.ts
- `src/core/` - review core changes from packages/core/src/v1/config/agent.ts
- `src/core/` - review core changes from packages/core/src/v1/config/config.ts
- `src/core/` - review core changes from packages/core/test/kilocode/pty-durability.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/pty-termination.test.ts
- `src/tool/agent-manager.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager.ts changes
- `src/tool/background-process.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/background-process.txt changes
- `src/tool/memory-runtime.ts` - update based on kilocode packages/opencode/test/kilocode/tool/memory-runtime.ts changes
- `src/tool/notify-user.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/notify-user.test.ts changes
- `src/tool/send-file.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/send-file.test.ts changes
- `src/tool/todowrite.txt.ts` - update based on kilocode packages/opencode/src/tool/todowrite.txt changes
