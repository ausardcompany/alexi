# Upstream Changes Report
Generated: 2026-08-21 06:47:03

## Summary
- kilocode: 93 commits, 438 files changed
- opencode: 12 commits, 70 files changed

## kilocode Changes (9a6e081e4..fe760ab02)

### Commits

- fe760ab02 - Merge pull request #13288 from Kilo-Org/fix/remove-accidental-tui-json-artifact (Marius, 2026-08-20)
- 2e23a7842 - chore(cli): remove accidental tui.json artifact from PR #13271 (kiloconnect[bot], 2026-08-20)
- 15104039c - Merge pull request #13169 from MVS-source/docs/add-edenai-provider (Christiaan Arnoldus, 2026-08-20)
- 694bed070 - Merge branch 'main' into docs/add-edenai-provider (Christiaan Arnoldus, 2026-08-20)
- ab9c321de - Merge pull request #13240 from Kilo-Org/plan-jetbrains-workflows-parity (Kirill Kalishev, 2026-08-20)
- bc100431d - Merge pull request #13242 from Kilo-Org/plan-jetbrains-show-diff-on-permission-request (Kirill Kalishev, 2026-08-20)
- 36a59bfbc - Merge pull request #13217 from Kilo-Org/investigate-podman-container-crash (Kirill Kalishev, 2026-08-20)
- 294e8fe6b - Merge pull request #13271 from romulorosa/feat/mcp-apps-experimental (Marius, 2026-08-20)
- 1eecc0f09 - Merge remote-tracking branch 'origin/main' into investigate-podman-container-crash (kirillk, 2026-08-20)
- 3452fa123 - Merge branch 'main' into feat/mcp-apps-experimental (Rômulo Rosa Furtado, 2026-08-20)
- 55fb0f201 - feat(jetbrains): surface unsupported workspace in session banner (kirillk, 2026-08-20)
- 44a0973f5 - fix(jetbrains): retain permission diff card across re-renders (kirillk, 2026-08-20)
- 94c01f285 - feat(jetbrains): show approval reason footer on tool cards (kirillk, 2026-08-20)
- 0af294e66 - Merge pull request #13248 from Kilo-Org/docs/update-kilo-directory-references (arrrkady, 2026-08-20)
- 26c40f21e - Merge pull request #13276 from Kilo-Org/puzzling-crowberry (Marius, 2026-08-20)
- b29f01168 - test(cli): add httpapi exerciser scenarios for MCP Apps endpoints (rrosa, 2026-08-20)
- ada5acfcf - Merge pull request #13239 from Kilo-Org/pushy-single (Kirill Kalishev, 2026-08-20)
- 067b6af4b - fix(jetbrains): bound stack preferred and maximum sizes (kirillk, 2026-08-20)
- fa6d5479c - Merge branch 'main' into feat/mcp-apps-experimental (Rômulo Rosa Furtado, 2026-08-20)
- b7069922d - refactor(cli): move MCP Apps logic into Kilo-owned module (rrosa, 2026-08-20)
- 7ff184bbf - chore(cli): remove unrelated docs and bun.lock changes from MCP Apps PR (rrosa, 2026-08-20)
- f9f9e8282 - fix(jetbrains): stabilize stack preferred sizing (kirillk, 2026-08-20)
- 1d1774e3d - Merge branch 'main' into docs/update-kilo-directory-references (arrrkady, 2026-08-20)
- eb8b6523c - docs: clarify legacy .kilocode/agents dir in prose (arkadiykondrashov, 2026-08-20)
- 6924ddd9b - style(vscode): format background agent changes (marius-kilocode, 2026-08-20)
- 575bf9b02 - Merge remote-tracking branch 'origin/main' into puzzling-crowberry (marius-kilocode, 2026-08-20)
- 67cd629f3 - release: v7.4.23 (kilo-maintainer[bot], 2026-08-20)
- 6f87e9c22 - Merge pull request #13245 from Kilo-Org/implement-markdown-file-viewer-sidebar (Marius, 2026-08-20)
- 0d5d33448 - fix(tui): order live transcript by message created time so wrapped ids stay visible (#13247) (Johnny Eric Amancio, 2026-08-20)
- 386af9a63 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-08-20)
- ba1c3c60e - fix(vscode): avoid duplicate document review sends (marius-kilocode, 2026-08-20)
- 2f972fc68 - Merge pull request #13273 from Kilo-Org/investigate-session-scroll-regression (Marius, 2026-08-20)
- 0309d6ed8 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-08-20)
- 9f0fd9b21 - Merge branch 'main' into puzzling-crowberry (marius-kilocode, 2026-08-20)
- 031648c2e - feat(vscode): show background agents (marius-kilocode, 2026-08-20)
- dc362322f - fix(vscode): keep session scroll pinned during layout corrections (marius-kilocode, 2026-08-20)
- eda1e9c80 - fix(vscode): register documents webview with knip (marius-kilocode, 2026-08-20)
- 3be279fec - feat(vscode): reuse document viewer for sidebar files (marius-kilocode, 2026-08-20)
- 9acdfa5bd - Merge pull request #13270 from Kilo-Org/fix-loading-spinner-layout (Marius, 2026-08-20)
- e4f4bc974 - fix(vscode): restore session tab contrast (marius-kilocode, 2026-08-20)
- c02134ab4 - fix(cli): annotate MCP Apps changes, tighten callTool error handling (rrosa, 2026-08-20)
- 36c57c12c - feat(cli): add experimental MCP Apps support with resource/tool HTTP endpoints (rrosa, 2026-08-20)
- c43b8a05b - Merge pull request #13265 from Kilo-Org/fix-opencode-core-module-resolution (Marius, 2026-08-20)
- 8e26de0f1 - fix(vscode): preserve review comment session fallback (marius-kilocode, 2026-08-20)
- 10b670186 - fix(vscode): stabilize working indicator transitions (marius-kilocode, 2026-08-20)
- 7f55826cf - Merge pull request #13264 from Kilo-Org/fix-pr-view-infinite-time (Marius, 2026-08-20)
- 0ed0c65d0 - Merge pull request #13263 from Kilo-Org/investigate-chat-diff-count-mismatch (Marius, 2026-08-20)
- 8461a2f77 - fix(vscode): bootstrap dependencies in worktrees (marius-kilocode, 2026-08-20)
- 10b73a4ca - fix(agent-manager): guard invalid PR check durations (marius-kilocode, 2026-08-20)
- b9895a51b - Merge remote-tracking branch 'origin/main' into implement-markdown-file-viewer-sidebar (marius-kilocode, 2026-08-20)
- 8cac24a24 - chore: remove implementation plan (marius-kilocode, 2026-08-20)
- 55333d4a1 - fix(vscode): restore prompt focus after document review (marius-kilocode, 2026-08-20)
- 0109397be - Merge pull request #13261 from Kilo-Org/fix-worktree-sidebar-agent-switching (Marius, 2026-08-20)
- 9af7b5e0a - Merge pull request #13262 from Kilo-Org/investigate-worktree-base-branch-regression (Marius, 2026-08-20)
- 902626065 - fix(vscode): preserve document review keyboard flow (marius-kilocode, 2026-08-20)
- 27ba156ce - fix(vscode): use current remote default for diffs (marius-kilocode, 2026-08-20)
- a2de3fc0e - Merge remote-tracking branch 'origin/main' into implement-markdown-file-viewer-sidebar (marius-kilocode, 2026-08-20)
- 5300ce51f - fix(agent-manager): preserve new worktree base branch (marius-kilocode, 2026-08-20)
- 0f6031642 - fix(vscode): support send-all shortcut in documents (marius-kilocode, 2026-08-20)
- ab08cbaa0 - fix(agent-manager): scope subagent inspector by session (marius-kilocode, 2026-08-20)
- 9fbb7a1aa - fix(vscode): open review comment files directly (marius-kilocode, 2026-08-20)
- 559f39fb1 - Merge pull request #13243 from Kilo-Org/refactor-watcher-service (Marius, 2026-08-20)
- b4e43687b - refactor(jetbrains): share one changes card and file-changes body (kirillk, 2026-08-19)
- de09f585f - perf(jetbrains): keep diagnostic log stream open across records (kirillk, 2026-08-19)
- 0ed2be557 - refactor(jetbrains): unify auto-approve rules with the changes card (kirillk, 2026-08-19)
- 3b8b18ff3 - feat(jetbrains): add Logging section with log reveal and backend log download (kirillk, 2026-08-19)
- 5f2631934 - refactor(jetbrains): move log settings into Advanced configurable (kirillk, 2026-08-19)
- a3604c849 - fix(jetbrains): align permission changes card with standard changes (kirillk, 2026-08-19)
- ce9a83fba - feat(jetbrains): add Tools -> Kilo logs configuration dialog (kirillk, 2026-08-19)
- 056db4661 - test(vscode): cover document worktree isolation (marius-kilocode, 2026-08-19)
- c2f5852d9 - Update packages/kilo-docs/pages/index.tsx (arrrkady, 2026-08-19)
- 2bcd47e9e - Update packages/kilo-docs/pages/getting-started/migrating.md (arrrkady, 2026-08-19)
- d22041535 - fix(vscode): address document inspector review findings (marius-kilocode, 2026-08-19)
- 9001e89b5 - docs: update directory references to .kilo/ as current (arkadiykondrashov, 2026-08-19)
- 5aa2cb8a1 - fix(vscode): reduce Agent Manager app lint size (marius-kilocode, 2026-08-19)
- 08c81b42c - chore: refresh architecture ratchet baseline (marius-kilocode, 2026-08-19)
- 65a025b8d - fix(vscode): keep document inspector lint compliant (marius-kilocode, 2026-08-19)
- b8984e468 - refactor(cli): scope watcher state per instance (marius-kilocode, 2026-08-19)
- 190b4a4dc - feat(vscode): add Agent Manager document inspector (marius-kilocode, 2026-08-19)
- 72ab1390d - fix(vscode): stop background agent sessions (marius-kilocode, 2026-08-19)
- 4db58009d - fix(jetbrains): address workflows settings review (kirillk, 2026-08-19)
- d9b7f7c6b - feat(jetbrains): show diffs in permission prompts (kirillk, 2026-08-19)
- 9701b518b - Merge main into puzzling-crowberry (marius-kilocode, 2026-08-19)
- ba658fc8d - chore: checkpoint before merging main (marius-kilocode, 2026-08-19)
- 6bd3e4b2c - feat(jetbrains): add workflows settings page (kirillk, 2026-08-19)
- 1c83d9287 - fix(jetbrains): delete legacy diagnostic logs (kirillk, 2026-08-18)
- f292625b6 - fix(jetbrains): use stable diagnostic log path (kirillk, 2026-08-18)
- a4ab4325c - refactor(jetbrains): defer unsupported workspace UI (kirillk, 2026-08-18)
- 285644387 - Merge remote-tracking branch 'origin/main' into investigate-podman-container-crash (kirillk, 2026-08-18)
- 254acc92a - fix(jetbrains): don't surface workspace fetch failures as IDE errors (kirillk, 2026-08-18)
- 30d758105 - docs: drop the exact-cost claim from the Eden AI frontmatter (MVS-source, 2026-08-17)
- 46dbca376 - docs: correct the Eden AI cost tracking claim (MVS-source, 2026-08-17)
- 7a9d66c15 - docs: add Eden AI provider page (MVS-source, 2026-08-17)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt` (+13, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt` (+13, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/PatchBody.kt` (+40, -9)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt` (+12, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/TaskToolView.kt` (+13, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolApprovalFooter.kt` (+51, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolApprovalText.kt` (+52, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolView.kt` (+13, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/tool/ToolApprovalTextTest.kt` (+51, -0)
- `packages/opencode/test/tool/code-mode-integration.test.ts` (+1, -1)
- `packages/opencode/test/tool/code-mode.test.ts` (+2, -0)
- `packages/opencode/test/tool/registry.test.ts` (+8, -3)
- `packages/opencode/test/tool/task.test.ts` (+5, -2)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionDiffView.kt` (+84, -26)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt` (+187, -145)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/permission/PermissionViewTest.kt` (+200, -7)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)

#### Other Changes
- `.changeset/active-list-equal-rows.md` (+0, -5)
- `.changeset/agent-manager-nullable-tool-fields.md` (+0, -5)
- `.changeset/agent-manager-project-skeleton-loading.md` (+0, -5)
- `.changeset/agent-manager-terminal-context.md` (+0, -5)
- `.changeset/ask-mode-permission-boundary.md` (+0, -5)
- `.changeset/ask-to-code-agent-switch.md` (+0, -6)
- `.changeset/blocking-shell-waits.md` (+0, -5)
- `.changeset/borderless-jetbrains-session.md` (+0, -5)
- `.changeset/calm-diff-scroll.md` (+0, -5)
- `.changeset/calm-sqlite-recovery.md` (+0, -5)
- `.changeset/center-jetbrains-session-width.md` (+0, -5)
- `.changeset/clean-agent-removal.md` (+0, -5)
- `.changeset/compact-model-trigger-label.md` (+0, -5)
- `.changeset/durable-agent-manager-terminals.md` (+0, -6)
- `.changeset/dynamic-speech-to-text-models.md` (+0, -5)
- `.changeset/enable-background-subagents.md` (+6, -0)
- `.changeset/fallback-state-directory.md` (+0, -5)
- `.changeset/fix-duplicate-skill-catalog.md` (+0, -5)
- `.changeset/fix-import-jwt-share-url.md` (+0, -6)
- `.changeset/fix-pr-branch-refspec.md` (+0, -5)
- `.changeset/fix-streaming-scroll-follow.md` (+0, -5)
- `.changeset/fix-text-streaming.md` (+0, -5)
- `.changeset/fix-tool-output-actions.md` (+0, -5)
- `.changeset/fresh-file-mentions.md` (+0, -5)
- `.changeset/fresh-worktree-prompt.md` (+0, -5)
- `.changeset/fresh-worktrees-move.md` (+0, -5)
- `.changeset/gh-status-banners.md` (+0, -5)
- `.changeset/gpt-56-oauth-context.md` (+0, -5)
- `.changeset/hover-agent-manager-actions.md` (+0, -5)
- `.changeset/incremental-todo-guidance.md` (+0, -5)
- `.changeset/islands-button-borders.md` (+0, -5)
- `.changeset/jetbrains-advanced-logging.md` (+5, -0)
- `.changeset/jetbrains-agent-manager-beta.md` (+0, -5)
- `.changeset/jetbrains-expandable-hover-popups.md` (+0, -5)
- `.changeset/jetbrains-history-hover-rename.md` (+0, -5)
- `.changeset/jetbrains-log-pattern.md` (+5, -0)
- `.changeset/jetbrains-permission-diff.md` (+5, -0)
- `.changeset/jetbrains-pr-worktree-tooltips.md` (+0, -5)
- `.changeset/jetbrains-profile-400-ready.md` (+0, -5)
- `.changeset/jetbrains-session-colors.md` (+0, -5)
- `.changeset/jetbrains-session-errors.md` (+0, -5)
- `.changeset/jetbrains-session-secondary-text.md` (+0, -5)
- `.changeset/jetbrains-tool-approval-footer.md` (+5, -0)
- `.changeset/jetbrains-workflows-settings.md` (+5, -0)
- `.changeset/jetbrains-worktree-activity-badge.md` (+0, -5)
- `.changeset/jetbrains-worktree-adopt-session-name.md` (+0, -5)
- `.changeset/jetbrains-worktree-change-badges.md` (+0, -5)
- `.changeset/jetbrains-worktree-delete-reappear.md` (+0, -5)
- `.changeset/jetbrains-worktree-delete-selection.md` (+0, -5)
- `.changeset/jetbrains-worktree-list-stability.md` (+0, -5)
- `.changeset/jetbrains-worktree-open-focus.md` (+0, -5)
- `.changeset/jetbrains-worktree-open-in-new-window.md` (+0, -5)
- `.changeset/jetbrains-worktree-order.md` (+0, -5)
- `.changeset/jetbrains-worktree-session-deleting.md` (+0, -5)
- `.changeset/jetbrains-worktree-session-list.md` (+0, -5)
- `.changeset/jetbrains-worktree-terminal.md` (+0, -5)
- `.changeset/mcp-tool-display-setting.md` (+0, -5)
- `.changeset/memory-show-preserve-text.md` (+0, -5)
- `.changeset/memory-sse-json.md` (+0, -5)
- `.changeset/optimize-agent-manager-tab-latency.md` (+0, -5)
- `.changeset/optimize-large-session-loading.md` (+0, -5)
- `.changeset/optimize-top-bar-performance.md` (+0, -5)
- `.changeset/permission-prompt-scroll.md` (+0, -5)
- `.changeset/persist-snapshot-disable.md` (+0, -5)
- `.changeset/pierre-pr-comment-diff.md` (+0, -5)
- `.changeset/plan-to-code-model-switch.md` (+0, -5)
- `.changeset/polite-history-rows.md` (+0, -5)
- `.changeset/pr-comments-github-style.md` (+0, -5)
- `.changeset/prompt-bubble-outline.md` (+0, -5)
- `.changeset/prompt-focus-scroll-polish.md` (+0, -5)
- `.changeset/quiet-branches-search.md` (+0, -5)
- `.changeset/quiet-jetbrains-workspace-errors.md` (+5, -0)
- `.changeset/quiet-variants-cache.md` (+0, -5)
- `.changeset/quiet-worktrees-filter.md` (+0, -5)
- `.changeset/refine-jetbrains-session-spacing.md` (+0, -5)
- `.changeset/remove-agent-manager-project-trust.md` (+0, -5)
- `.changeset/remove-agent-requirements.md` (+0, -6)
- `.changeset/remove-alibaba-mistral-gateway-providers.md` (+0, -5)
- `.changeset/remove-pr-sidebar-scroll-button.md` (+0, -5)
- `.changeset/remove-task-aware-output-pruning.md` (+0, -7)
- `.changeset/rename-jetbrains-worktrees.md` (+0, -5)
- `.changeset/rendered-document-inspector.md` (+5, -0)
- `.changeset/restore-agent-manager-diff-stats.md` (+0, -5)
- `.changeset/restore-kilo-upgrade-version-lookup.md` (+0, -5)
- `.changeset/sandbox-git-escalation.md` (+0, -5)
- `.changeset/scoped-interactive-terminal-state.md` (+0, -5)
- `.changeset/scroll-resize-dialog-fixes.md` (+0, -5)
- `.changeset/selected-agent-over-stale-session.md` (+0, -5)
- `.changeset/session-background-contrast.md` (+0, -5)
- `.changeset/session-card-content-surfaces.md` (+0, -5)
- `.changeset/session-pr-link.md` (+0, -5)
- `.changeset/session-status-copy-overlay.md` (+0, -5)
- `.changeset/show-empty-jetbrains-sessions.md` (+0, -5)
- `.changeset/show-model-provider-hints.md` (+0, -5)
- `.changeset/show-queued-prompts.md` (+0, -5)
- `.changeset/show-token-throughput-by-default.md` (+0, -5)
- `.changeset/slash-command-preserve-text.md` (+0, -5)
- `.changeset/smooth-session-backdrop.md` (+0, -5)
- `.changeset/steady-session-dock.md` (+0, -5)
- `.changeset/subagent-inspector-tabs.md` (+0, -5)
- `.changeset/terminal-shortcut-focus.md` (+0, -5)
- `.changeset/trim-inferred-variants.md` (+0, -5)
- `.changeset/tui-gateway-model-picker.md` (+0, -5)
- `.changeset/worktree-editor-selection.md` (+0, -5)
- `.changeset/worktree-history-default.md` (+0, -5)
- `.changeset/worktree-session-history-rows.md` (+0, -5)
- `.gitignore` (+5, -0)
- `.kilo/plans/1786990849107-jetbrains-devcontainer-unsupported-notice.md` (+103, -0)
- `.kilo/plans/1787073472111-jetbrains-devcontainer-outcome-card.md` (+177, -0)
- `.kilo/plans/1787183917922-jetbrains-unsupported-workspace-banner.md` (+149, -0)
- `artifacts/glm52-rise-video/package.json` (+1, -1)
- `bun.lock` (+33, -33)
- `package.json` (+1, -1)
- `packages/client/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/httpapi-codegen/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-docs/lib/nav/ai-providers.ts` (+1, -0)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/ai-providers/edenai.md` (+158, -0)
- `packages/kilo-docs/pages/ai-providers/index.md` (+1, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/cloud-agent.md` (+6, -6)
- `packages/kilo-docs/pages/collaborate/enterprise/migration.md` (+4, -4)
- `packages/kilo-docs/pages/collaborate/teams/analytics.md` (+2, -2)
- `packages/kilo-docs/pages/customize/agents-md.md` (+1, -1)
- `packages/kilo-docs/pages/customize/custom-modes.md` (+4, -2)
- `packages/kilo-docs/pages/getting-started/migrating.md` (+37, -37)
- `packages/kilo-docs/pages/index.tsx` (+1, -1)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/message-list-layout-correction-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/labs-tool-call-lab/search-previews-chromium-linux.png` (+2, -2)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/.run/Run IDE (Backend).run.xml` (+4, -3)
- `packages/kilo-jetbrains/.run/Run IDE (Frontend).run.xml` (+1, -1)
- `packages/kilo-jetbrains/.run/{runIdeSplitMode.run.xml => Run IDE (Split Mode).run.xml}` (+5, -4)
- `packages/kilo-jetbrains/CHANGELOG.md` (+97, -0)
- `packages/kilo-jetbrains/README.md` (+5, -4)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendAppService.kt` (+1, -1)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloCliDataParser.kt` (+22, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloAppRpcApiImpl.kt` (+17, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorkspaceRpcApiImpl.kt` (+4, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/workspace/KiloBackendWorkspace.kt` (+129, -82)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/workspace/KiloWorkspaceState.kt` (+1, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/workspace/RemoteDirectory.kt` (+23, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendAppServiceTest.kt` (+2, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/KiloCliDataParserTest.kt` (+39, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloAppRpcApiImplLogConfigTest.kt` (+27, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloWorkspaceRpcApiImplTest.kt` (+16, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/workspace/KiloBackendWorkspaceTest.kt` (+55, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/workspace/RemoteDirectoryTest.kt` (+31, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloAgentBehaviorService.kt` (+13, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloAppService.kt` (+24, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/plugin/KiloPluginSettings.kt` (+11, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+16, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionController.kt` (+20, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/Message.kt` (+11, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/SessionModel.kt` (+13, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/settings/ApprovalReasonVisibilityListener.kt` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/ChangesCardView.kt` (+166, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/ConnectionPanel.kt` (+8, -6)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/ModifiedFilesView.kt` (+31, -146)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanel.kt` (+11, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/style/SessionUiStyle.kt` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/MessageView.kt` (+11, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/SessionViewIcons.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/base/AbstractSessionPartView.kt` (+27, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/question/QuestionResultView.kt` (+20, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/todo/TodoWriteView.kt` (+17, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/AdvancedConfigurable.kt` (+49, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/AdvancedLogActions.kt` (+85, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/AdvancedSettingsUi.kt` (+117, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/KiloLogSettingsService.kt` (+61, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/KiloSettingsConfigurable.kt` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/AgentBehaviorConfigurable.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/WorkflowsConfigurable.kt` (+316, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/autoapprove/AutoApproveContent.kt` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/DiffBadge.kt` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/DiffBars.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/DiffStatBadge.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/layout/Stack.kt` (+47, -60)
- `packages/kilo-jetbrains/frontend/src/main/resources/kilo.jetbrains.frontend.xml` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+55, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ar.properties` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_bs.properties` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_da.properties` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_de.properties` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_es.properties` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_fr.properties` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ja.properties` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ko.properties` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_nl.properties` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_no.properties` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pl.properties` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pt_BR.properties` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ru.properties` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_th.properties` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_tr.properties` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_uk.properties` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_CN.properties` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_TW.properties` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/app/KiloAgentBehaviorServiceTest.kt` (+30, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionUiLayoutTest.kt` (+25, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/ConnectionDelayTest.kt` (+55, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/ConnectionPanelTest.kt` (+28, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/ModifiedFilesViewTest.kt` (+11, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ToolViewTest.kt` (+22, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/AdvancedConfigurableTest.kt` (+137, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/KiloLogSettingsServiceTest.kt` (+72, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/KiloSettingsConfigurableTest.kt` (+5, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/AgentBehaviorConfigurableTest.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/WorkflowsSettingsUiTest.kt` (+465, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeAgentBehaviorRpcApi.kt` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeAppRpcApi.kt` (+15, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/log/ChatLogSummary.kt` (+6, -17)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/log/KiloLog.kt` (+106, -19)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/log/LogConfig.kt` (+85, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloAppRpcApi.kt` (+8, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/ChatDto.kt` (+12, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/KiloWorkspaceStateDto.kt` (+1, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/LogConfigDto.kt` (+10, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/LogFileDto.kt` (+10, -0)
- `packages/kilo-jetbrains/shared/src/test/kotlin/ai/kilocode/log/KiloLogTest.kt` (+51, -0)
- `packages/kilo-jetbrains/shared/src/test/kotlin/ai/kilocode/log/LogConfigTest.kt` (+68, -0)
- `packages/kilo-memory/package.json` (+1, -1)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/message-part.css` (+2, -0)
- `packages/kilo-ui/src/components/message-part.tsx` (+18, -3)
- `packages/kilo-ui/src/hooks/create-auto-scroll.test.tsx` (+161, -3)
- `packages/kilo-ui/src/hooks/create-auto-scroll.tsx` (+3, -10)
- `packages/kilo-ui/src/hooks/scroll-user-activity.ts` (+25, -2)
- `packages/kilo-vscode/CHANGELOG.md` (+101, -1)
- `packages/kilo-vscode/docs/features/background-agent-visibility.md` (+92, -0)
- `packages/kilo-vscode/esbuild.js` (+1, -0)
- `packages/kilo-vscode/knip.json` (+1, -0)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/script/launch.ts` (+21, -0)
- `packages/kilo-vscode/src/DocumentViewerProvider.ts` (+151, -0)
- `packages/kilo-vscode/src/KiloProvider.ts` (+90, -2)
- `packages/kilo-vscode/src/SubAgentViewerProvider.ts` (+4, -2)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+4, -22)
- `packages/kilo-vscode/src/agent-manager/GitOps.ts` (+28, -6)
- `packages/kilo-vscode/src/agent-manager/WorktreeManager.ts` (+13, -3)
- `packages/kilo-vscode/src/agent-manager/pr/am-pr-utils.ts` (+4, -1)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+22, -0)
- `packages/kilo-vscode/src/agent-manager/worktree-diff-controller.ts` (+45, -0)
- `packages/kilo-vscode/src/diff/DiffViewerProvider.ts` (+15, -1)
- `packages/kilo-vscode/src/diff/types.ts` (+4, -0)
- `packages/kilo-vscode/src/documents/document-reader.ts` (+49, -0)
- `packages/kilo-vscode/src/extension.ts` (+23, -3)
- `packages/kilo-vscode/src/kilo-provider/early-message.ts` (+34, -1)
- `packages/kilo-vscode/src/kilo-provider/editor-actions.ts` (+9, -1)
- `packages/kilo-vscode/tests/chat-auto-scroll.spec.ts` (+66, -0)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/session-dock-stability.spec.ts` (+94, -4)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+7, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-documents.test.ts` (+72, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-i18n.test.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/am-pr-utils.test.ts` (+9, -0)
- `packages/kilo-vscode/tests/unit/background-agents.test.ts` (+274, -0)
- `packages/kilo-vscode/tests/unit/document-reader.test.ts` (+33, -0)
- `packages/kilo-vscode/tests/unit/early-message.test.ts` (+35, -0)
- `packages/kilo-vscode/tests/unit/git-ops.test.ts` (+39, -4)
- `packages/kilo-vscode/tests/unit/git-stats-poller.test.ts` (+10, -4)
- `packages/kilo-vscode/tests/unit/local-diff.test.ts` (+34, -0)
- `packages/kilo-vscode/tests/unit/new-worktree-dialog-sandbox.test.ts` (+8, -0)
- `packages/kilo-vscode/tests/unit/subagent-tabs.test.ts` (+65, -1)
- `packages/kilo-vscode/tests/unit/worktree-manager.test.ts` (+23, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+36, -30)
- `packages/kilo-vscode/webview-ui/agent-manager/ClosableTab.tsx` (+12, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/DiffPanel.tsx` (+15, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/NewWorktreeDialog.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/TabBar.tsx` (+30, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+128, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/documents/DocumentPanelHost.tsx` (+30, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fa.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fr.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/it.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ja.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ko.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/nl.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/no.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/pl.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ru.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/th.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/tr.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/uk.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zh.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zht.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/side-panel-layout.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/subagent-tabs.ts` (+138, -26)
- `packages/kilo-vscode/webview-ui/diff-viewer/DiffViewerApp.tsx` (+10, -0)
- `packages/kilo-vscode/webview-ui/diff-viewer/FullScreenDiffView.tsx` (+14, -0)
- `packages/kilo-vscode/webview-ui/diff-viewer/MarkdownAnnotationLayer.tsx` (+6, -2)
- `packages/kilo-vscode/webview-ui/diff-viewer/MarkdownDiffView.tsx` (+2, -2)
- `packages/kilo-vscode/webview-ui/documents/DocumentPanel.tsx` (+364, -0)
- `packages/kilo-vscode/webview-ui/documents/index.tsx` (+82, -0)
- `packages/kilo-vscode/webview-ui/documents/state.ts` (+214, -0)
- `packages/kilo-vscode/webview-ui/src/App.tsx` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/AssistantMessage.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/BackgroundAgents.tsx` (+287, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+3, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/ReviewComments.tsx` (+15, -15)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskHeader.tsx` (+23, -9)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskToolExpanded.tsx` (+8, -10)
- `packages/kilo-vscode/webview-ui/src/components/chat/background-agents.ts` (+125, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/open-subagent.ts` (+36, -0)
- `packages/kilo-vscode/webview-ui/src/components/shared/StatusText.tsx` (+107, -0)
- `packages/kilo-vscode/webview-ui/src/components/shared/WorkingIndicator.tsx` (+25, -14)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/src/stories/chat.stories.tsx` (+71, -1)
- `packages/kilo-vscode/webview-ui/src/styles/chat-layout.css` (+111, -3)
- `packages/kilo-vscode/webview-ui/src/styles/plan-exit.css` (+27, -0)
- `packages/kilo-vscode/webview-ui/src/styles/session-tabs.css` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/styles/task-header.css` (+111, -1)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+74, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+58, -0)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+56, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/effect/runtime-flags.ts` (+6, -1)
- `packages/opencode/src/kilocode/mcp/apps.ts` (+80, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/kilocode.ts` (+41, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilocode.ts` (+36, -1)
- `packages/opencode/src/kilocode/session/prompt.ts` (+1, -0)
- `packages/opencode/src/kilocode/watcher.ts` (+39, -26)
- `packages/opencode/src/mcp/index.ts` (+5, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/mcp.ts` (+31, -0)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/mcp.ts` (+10, -0)
- `packages/opencode/src/session/tools.ts` (+8, -0)
- `packages/opencode/test/effect/runtime-flags.test.ts` (+13, -1)
- `packages/opencode/test/kilocode/instance-vcs-watcher.test.ts` (+101, -38)
- `packages/opencode/test/kilocode/server/httpapi-exercise-scenarios.ts` (+39, -0)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+6, -2)
- `packages/opencode/test/server/httpapi-mcp-oauth.test.ts` (+3, -1)
- `packages/opencode/test/server/session-actions.test.ts` (+58, -4)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/protocol/package.json` (+1, -1)
- `packages/schema/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk-next/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+83, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+76, -24)
- `packages/sdk/openapi.json` (+213, -104)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/storybook/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/tui/src/context/sync.tsx` (+17, -8)
- `packages/tui/src/kilocode/message-order.ts` (+22, -0)
- `packages/tui/test/fixture/tui-sdk.ts` (+1, -1)
- `packages/tui/test/kilocode/message-order-sync.test.tsx` (+138, -0)
- `packages/tui/test/kilocode/message-order.test.ts` (+34, -0)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/components/markdown.css` (+19, -0)
- `packages/ui/src/i18n/ar.ts` (+1, -0)
- `packages/ui/src/i18n/az.ts` (+1, -0)
- `packages/ui/src/i18n/br.ts` (+1, -0)
- `packages/ui/src/i18n/bs.ts` (+1, -0)
- `packages/ui/src/i18n/da.ts` (+1, -0)
- `packages/ui/src/i18n/de.ts` (+1, -0)
- `packages/ui/src/i18n/en.ts` (+1, -0)
- `packages/ui/src/i18n/es.ts` (+1, -0)
- `packages/ui/src/i18n/fi.ts` (+1, -0)
- `packages/ui/src/i18n/fr.ts` (+1, -0)
- `packages/ui/src/i18n/hi.ts` (+1, -0)
- `packages/ui/src/i18n/id.ts` (+1, -0)
- `packages/ui/src/i18n/it.ts` (+1, -0)
- `packages/ui/src/i18n/ja.ts` (+1, -0)
- `packages/ui/src/i18n/ko.ts` (+1, -0)
- `packages/ui/src/i18n/nl.ts` (+1, -0)
- `packages/ui/src/i18n/no.ts` (+1, -0)
- `packages/ui/src/i18n/pa.ts` (+1, -0)
- `packages/ui/src/i18n/pl.ts` (+1, -0)
- `packages/ui/src/i18n/ru.ts` (+1, -0)
- `packages/ui/src/i18n/sv.ts` (+1, -0)
- `packages/ui/src/i18n/th.ts` (+1, -0)
- `packages/ui/src/i18n/tr.ts` (+1, -0)
- `packages/ui/src/i18n/uk.ts` (+1, -0)
- `packages/ui/src/i18n/ur.ts` (+1, -0)
- `packages/ui/src/i18n/vi.ts` (+1, -0)
- `packages/ui/src/i18n/zh.ts` (+1, -0)
- `packages/ui/src/i18n/zht.ts` (+1, -0)
- `script/architecture-allowlist.json` (+1, -2)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index fbc64130a..03ed5fec4 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.4.22",
+  "version": "7.4.23",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionDiffView.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionDiffView.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionDiffView.kt
index 026228d3c..199039b55 100644
--- a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionDiffView.kt
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionDiffView.kt
@@ -1,44 +1,102 @@
 package ai.kilocode.client.session.views.permission
 
+import ai.kilocode.client.plugin.KiloBundle
+import ai.kilocode.client.session.SessionDiffOpener
+import ai.kilocode.client.session.SessionFileOpener
 import ai.kilocode.client.session.model.PermissionFileDiff
-import ai.kilocode.client.session.ui.style.SessionEditorStyle
-import ai.kilocode.client.session.ui.style.SessionEditorStyleTarget
+import ai.kilocode.client.session.ui.ChangesCardView
+import ai.kilocode.client.session.ui.selection.SessionSelection
+import ai.kilocode.client.session.views.tool.PatchBody
 import ai.kilocode.client.ui.DiffStatBadge
-import ai.kilocode.client.ui.layout.Stack
-import com.intellij.util.ui.JBUI
-import com.intellij.util.ui.components.BorderLayoutPanel
+import ai.kilocode.rpc.dto.DiffFileDto
+import com.intellij.util.concurrency.annotations.RequiresEdt
 
 /**
- * Renders a single [PermissionFileDiff] inside a permission card as a compact diff-stat badge.
- * Patch content and file path are intentionally not displayed here; the permission target row
- * already shows the path.
+ * Renders proposed file changes inside a permission card with the same expandable body, popup
+ * preview, and full diff-editor affordance used for modified files.
  */
-class PermissionDiffView(
-    private val diff: PermissionFileDiff,
-) : BorderLayoutPanel(), SessionEditorStyleTarget {
+internal class PermissionDiffView private constructor(
+    openFile: SessionFileOpener,
+    selection: SessionSelection?,
+    parts: ChangesCardView.Header,
+    body: PatchBody,
+) : ChangesCardView(openFile, selection, parts, body, linkFiles = false) {
+    override val contentId = CONTENT_ID
 
-    private val badge = DiffStatBadge(diff.additions, diff.deletions)
+    private var requestId: String? = null
 
-    init {
-        isOpaque = false
+    constructor(
+        diffs: List<PermissionFileDiff>,
+        openFile: SessionFileOpener,
+        selection: SessionSelection?,
```

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
index d0c50775e..2eaf44cf3 100644
--- a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
@@ -2,6 +2,9 @@ package ai.kilocode.client.session.views.permission
 
 import ai.kilocode.client.plugin.KiloBundle
 import ai.kilocode.client.plugin.KiloPluginSettings
+import ai.kilocode.client.session.SessionDiffOpener
+import ai.kilocode.client.session.SessionFileOpener
+import ai.kilocode.client.session.model.Content
 import ai.kilocode.client.session.model.Permission
 import ai.kilocode.client.session.model.PermissionFileDiff
 import ai.kilocode.client.session.model.PermissionRuleCandidate
@@ -13,6 +16,9 @@ import ai.kilocode.client.session.ui.selection.SessionSelection
 import ai.kilocode.client.session.ui.style.SessionEditorStyle
 import ai.kilocode.client.session.ui.style.SessionUiStyle
 import ai.kilocode.client.session.views.SessionViewIcons
+import ai.kilocode.client.session.views.base.AbstractSessionPartView
+import ai.kilocode.client.session.views.base.PartHeader
+import ai.kilocode.client.session.views.base.PartView
 import ai.kilocode.client.ui.UiStyle
 import ai.kilocode.client.ui.iconButton
 import ai.kilocode.client.ui.editor.BashCommandHighlighter
@@ -36,6 +42,7 @@ import com.intellij.openapi.editor.ex.EditorEx
 import com.intellij.openapi.fileTypes.PlainTextFileType
 import com.intellij.openapi.project.ProjectManager
 import com.intellij.openapi.util.Disposer
+import com.intellij.openapi.util.IconLoader
 import com.intellij.ui.EditorTextField
 import com.intellij.ui.components.JBLabel
 import com.intellij.ui.components.JBScrollPane
@@ -53,6 +60,7 @@ import java.awt.Rectangle
 import java.awt.RenderingHints
 import java.awt.event.MouseAdapter
 import java.awt.event.MouseEvent
+import javax.swing.Icon
 import javax.swing.JButton
 import javax.swing.JComponent
 import javax.swing.JPanel
@@ -67,6 +75,7 @@ import javax.swing.ScrollPaneConstants
  */
 class PermissionView(
     private val reply: (String, PermissionReplyDto, PermissionAlwaysRulesDto?) -> Unit,
+    private val openFile: SessionFileOpener = { _, _ -> },
     private val selection: SessionSelection? = null,
     focus: (() -> Unit)? = null,
 ) : DialogView(selection, focus), SessionView, Disposable {
@@ -75,11 +84,14 @@ class PermissionView(
     private var requestId: String? = null
```

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt
index 7a1d858c5..aefe07658 100644
--- a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt
@@ -20,7 +20,8 @@ abstract class BaseSearchToolView(
     private val selection: SessionSelection? = null,
     private val parts: ToolParts,
     private val repo: String? = null,
-) : AbstractSessionPartView(parts.header, { parts.scroll(tool) }) {
+    private val footer: ToolApprovalFooter = ToolApprovalFooter(),
+) : AbstractSessionPartView(parts.header, { parts.scroll(tool) }, { footer }), ApprovalReasonTarget {
 
     override val contentId: String = tool.id
 
@@ -52,7 +53,7 @@ abstract class BaseSearchToolView(
     override fun getPreferredSize(): Dimension {
         val size = super.getPreferredSize()
         if (!bodyVisible()) return size
-        val height = row.preferredSize.height + expandedGap() + bodyMaxHeight()
+        val height = row.preferredSize.height + expandedGap() + bodyMaxHeight() + footerHeight()
         return Dimension(size.width, minOf(size.height, height))
     }
 
@@ -62,6 +63,7 @@ abstract class BaseSearchToolView(
         item = content
         var changed = sync()
         changed = syncBody() || changed
+        changed = syncApprovalReason(approvalReasonsVisible()) || changed
         if (changed) refresh()
     }
 
@@ -124,9 +126,17 @@ abstract class BaseSearchToolView(
         parts.targets.forEach { changed = setFont(it, style.regularFont) || changed }
         changed = setFont(parts.state, style.smallEditorFont) || changed
         changed = applyBodyStyle() || changed
+        changed = footer.applyStyle(style) || changed
         if (changed) refresh()
     }
 
+    @RequiresEdt
+    override fun syncApprovalReason(visible: Boolean): Boolean {
+        val changed = footer.update(item, visible)
+        if (changed) refresh()
+        return changed
+    }
+
     private fun sync(): Boolean {
         val expand = canExpand(item)
         var changed = false
@@ -145,6 +155,7 @@ abstract class BaseSearchToolView(
```

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt
index 6ef6e3186..46ef4dba2 100644
--- a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt
@@ -46,7 +46,8 @@ class EditToolView(
     private val selection: SessionSelection? = null,
     private val parts: ToolParts = toolParts(tool, openFile),
     private var body: EditBody = editBody(tool, selection, openFile),
-) : AbstractSessionPartView(parts.header, { body.mount(tool) }), UiDataProvider, SessionCopyTarget {
+    private val footer: ToolApprovalFooter = ToolApprovalFooter(),
+) : AbstractSessionPartView(parts.header, { body.mount(tool) }, { footer }), UiDataProvider, SessionCopyTarget, ApprovalReasonTarget {
 
     override val contentId: String = tool.id
 
@@ -126,7 +127,7 @@ class EditToolView(
     override fun getPreferredSize(): Dimension {
         val size = super.getPreferredSize()
         if (!bodyVisible()) return size
-        val height = row.preferredSize.height + expandedGap() + (body.panel()?.preferredSize?.height ?: 0)
+        val height = row.preferredSize.height + expandedGap() + (body.panel()?.preferredSize?.height ?: 0) + footerHeight()
         return Dimension(size.width, minOf(size.height, height))
     }
 
@@ -138,6 +139,7 @@ class EditToolView(
         changed = swapBody() || changed
         changed = sync() || changed
         changed = syncBody() || changed
+        changed = syncApprovalReason(approvalReasonsVisible()) || changed
         if (changed) refresh()
     }
 
@@ -207,9 +209,17 @@ class EditToolView(
         changed = setFont(parts.link, style.transcriptFont) || changed
         changed = setFont(parts.state, style.smallEditorFont) || changed
         changed = body.applyStyle(style) || changed
+        changed = footer.applyStyle(style) || changed
         if (changed) refresh()
     }
 
+    @RequiresEdt
+    override fun syncApprovalReason(visible: Boolean): Boolean {
+        val changed = footer.update(item, visible)
+        if (changed) refresh()
+        return changed
+    }
+
     private fun expandable(): Boolean =
         editDiff(item).isNotBlank() || output(item).isNotBlank() || !item.error.isNullOrBlank()
 
@@ -232,6 +242,7 @@ class EditToolView(
```


*... and more files (showing first 5)*

## opencode Changes (b155b15..e11dbd0)

### Commits

- e11dbd0 - chore: generate (opencode-agent[bot], 2026-08-21)
- 7b11ef5 - docs(go): add Ox Alpha Free (#43798) (Jack, 2026-08-21)
- 2859603 - chore: generate (opencode-agent[bot], 2026-08-21)
- c313504 - fix(opencode): surface resumable subagent errors (#43657) (opencode-agent[bot], 2026-08-20)
- e49772a - fix(opencode): preserve Cerebras completion limit (#43736) (opencode-agent[bot], 2026-08-20)
- 08faeb3 - fix(opencode): answer subagent permissions in run (#43675) (opencode-agent[bot], 2026-08-20)
- 5e75e5e - Merge branch 'dev' of github.com:anomalyco/opencode into dev (Frank, 2026-08-20)
- 5cc5b62 - update muse country list (Frank, 2026-08-20)
- 11e8110 - fix(docs): align Ox Alpha free model ID (#43695) (Jack, 2026-08-21)
- 82dee24 - docs(zen): add Ox Alpha free model (#43690) (Jack, 2026-08-21)
- ad192a5 - fix(stats): clarify market share providers (#43647) (Adam, 2026-08-20)
- 71d08e9 - fix(opencode): retry xAI capacity stream errors (#43640) (opencode-agent[bot], 2026-08-20)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/task.ts` (+7, -0)
- `packages/opencode/test/tool/task.test.ts` (+56, -4)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/stats/core/src/domain/home.ts` (+20, -59)
- `packages/stats/core/src/domain/inference.test.ts` (+4, -0)
- `packages/stats/core/src/domain/model-normalization.ts` (+1, -0)

#### Other Changes
- `packages/console/app/src/i18n/ar.ts` (+1, -1)
- `packages/console/app/src/i18n/br.ts` (+1, -1)
- `packages/console/app/src/i18n/da.ts` (+1, -1)
- `packages/console/app/src/i18n/de.ts` (+1, -1)
- `packages/console/app/src/i18n/en.ts` (+1, -1)
- `packages/console/app/src/i18n/es.ts` (+1, -1)
- `packages/console/app/src/i18n/fr.ts` (+1, -1)
- `packages/console/app/src/i18n/it.ts` (+1, -1)
- `packages/console/app/src/i18n/ja.ts` (+1, -1)
- `packages/console/app/src/i18n/ko.ts` (+1, -1)
- `packages/console/app/src/i18n/no.ts` (+1, -1)
- `packages/console/app/src/i18n/pl.ts` (+1, -1)
- `packages/console/app/src/i18n/ru.ts` (+1, -1)
- `packages/console/app/src/i18n/th.ts` (+1, -1)
- `packages/console/app/src/i18n/tr.ts` (+1, -1)
- `packages/console/app/src/i18n/uk.ts` (+1, -1)
- `packages/console/app/src/i18n/zh.ts` (+1, -1)
- `packages/console/app/src/i18n/zht.ts` (+1, -1)
- `packages/console/app/src/lib/request-country.ts` (+0, -40)
- `packages/opencode/src/cli/cmd/run.ts` (+6, -1)
- `packages/opencode/src/plugin/cerebras.ts` (+11, -0)
- `packages/opencode/src/plugin/index.ts` (+2, -0)
- `packages/opencode/src/provider/error.ts` (+7, -0)
- `packages/opencode/src/session/retry.ts` (+1, -0)
- `packages/opencode/test/cli/run/run-process.test.ts` (+44, -0)
- `packages/opencode/test/plugin/cerebras.test.ts` (+47, -0)
- `packages/opencode/test/provider/error.test.ts` (+24, -0)
- `packages/opencode/test/session/retry.test.ts` (+3, -0)
- `packages/stats/app/src/routes/index.css` (+1, -0)
- `packages/web/src/content/docs/ar/go.mdx` (+7, -0)
- `packages/web/src/content/docs/ar/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/bs/go.mdx` (+7, -0)
- `packages/web/src/content/docs/bs/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/da/go.mdx` (+7, -0)
- `packages/web/src/content/docs/da/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/de/go.mdx` (+7, -0)
- `packages/web/src/content/docs/de/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/es/go.mdx` (+7, -0)
- `packages/web/src/content/docs/es/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/fr/go.mdx` (+7, -0)
- `packages/web/src/content/docs/fr/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/go.mdx` (+7, -0)
- `packages/web/src/content/docs/it/go.mdx` (+7, -0)
- `packages/web/src/content/docs/it/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/ja/go.mdx` (+7, -0)
- `packages/web/src/content/docs/ja/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/ko/go.mdx` (+7, -0)
- `packages/web/src/content/docs/ko/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/nb/go.mdx` (+7, -0)
- `packages/web/src/content/docs/nb/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/pl/go.mdx` (+7, -0)
- `packages/web/src/content/docs/pl/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/pt-br/go.mdx` (+7, -0)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/ru/go.mdx` (+7, -0)
- `packages/web/src/content/docs/ru/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/th/go.mdx` (+7, -0)
- `packages/web/src/content/docs/th/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/tr/go.mdx` (+7, -0)
- `packages/web/src/content/docs/tr/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+7, -0)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+7, -0)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+3, -0)

### Key Diffs

#### packages/opencode/src/tool/task.ts
```diff
diff --git a/packages/opencode/src/tool/task.ts b/packages/opencode/src/tool/task.ts
index 1384e5d..de5d396 100644
--- a/packages/opencode/src/tool/task.ts
+++ b/packages/opencode/src/tool/task.ts
@@ -210,6 +210,13 @@ export const TaskTool = Tool.define(
           agent: next.name,
           parts,
         })
+        if (result.info.role === "assistant" && result.info.error) {
+          const message =
+            "message" in result.info.error.data && typeof result.info.error.data.message === "string"
+              ? result.info.error.data.message
+              : result.info.error.name
+          return yield* Effect.fail(new Error(`Subagent failed (task_id: ${nextSession.id}): ${message}`))
+        }
         return result.parts.findLast((item) => item.type === "text")?.text ?? ""
       })
 
```

#### packages/opencode/test/tool/task.test.ts
```diff
diff --git a/packages/opencode/test/tool/task.test.ts b/packages/opencode/test/tool/task.test.ts
index 2bcf05a..967dd04 100644
--- a/packages/opencode/test/tool/task.test.ts
+++ b/packages/opencode/test/tool/task.test.ts
@@ -3,7 +3,7 @@ import { SessionV1 } from "@opencode-ai/core/v1/session"
 import { Database } from "@opencode-ai/core/database/database"
 import { LayerNode } from "@opencode-ai/core/effect/layer-node"
 import { SessionProjector } from "@opencode-ai/core/session/projector"
-import { Deferred, Effect, Exit, Fiber, Layer } from "effect"
+import { Cause, Deferred, Effect, Exit, Fiber, Layer } from "effect"
 import { Agent } from "../../src/agent/agent"
 import { BackgroundJob } from "@/background/job"
 import { EventV2Bridge } from "@/event-v2-bridge"
@@ -96,19 +96,27 @@ const seed = Effect.fn("TaskToolTest.seed")(function* (title = "Pinned") {
   return { chat, assistant }
 })
 
-function stubOps(opts?: { onPrompt?: (input: SessionPrompt.PromptInput) => void; text?: string }): TaskPromptOps {
+function stubOps(opts?: {
+  onPrompt?: (input: SessionPrompt.PromptInput) => void
+  text?: string
+  error?: NonNullable<SessionV1.Assistant["error"]>
+}): TaskPromptOps {
   return {
     cancel: () => Effect.void,
     resolvePromptParts: (template) => Effect.succeed([{ type: "text" as const, text: template }]),
     prompt: (input) =>
       Effect.sync(() => {
         opts?.onPrompt?.(input)
-        return reply(input, opts?.text ?? "done")
+        return reply(input, opts?.text ?? "done", opts?.error)
       }),
   }
 }
 
-function reply(input: SessionPrompt.PromptInput, text: string): SessionV1.WithParts {
+function reply(
+  input: SessionPrompt.PromptInput,
+  text: string,
+  error?: NonNullable<SessionV1.Assistant["error"]>,
+): SessionV1.WithParts {
   const id = MessageID.ascending()
   return {
     info: {
@@ -125,6 +133,7 @@ function reply(input: SessionPrompt.PromptInput, text: string): SessionV1.WithPa
       providerID: input.model?.providerID ?? ref.providerID,
       time: { created: Date.now() },
       finish: "stop",
+      error,
     },
```

#### packages/stats/core/src/domain/home.ts
```diff
diff --git a/packages/stats/core/src/domain/home.ts b/packages/stats/core/src/domain/home.ts
index 8a54143..e0fd2be 100644
--- a/packages/stats/core/src/domain/home.ts
+++ b/packages/stats/core/src/domain/home.ts
@@ -4,7 +4,7 @@ import { Resource } from "sst/resource"
 import { DatabaseError } from "../database"
 import type { GeoStatMetric } from "./geo"
 import { ModelStatRepo, type ModelStatMetric } from "./model"
-import type { ProviderStatMetric } from "./provider"
+import { statProvider } from "./model-normalization"
 import { DATA_SITE_TIERS, normalizeTier } from "./stat"
 
 export type UsageProduct = "All Users" | "Zen" | "Go" | "Enterprise"
@@ -140,10 +140,6 @@ type StatMetricRow = Omit<ModelStatMetric, "updatedAt"> & {
   periodStart: number
   updatedAt: number
 }
-type ProviderMetricRow = Omit<ProviderStatMetric, "updatedAt"> & {
-  periodStart: number
-  updatedAt: number
-}
 type GeoMetricRow = Omit<GeoStatMetric, "updatedAt"> & {
   periodStart: number
   updatedAt: number
@@ -171,12 +167,8 @@ type RawRow = Record<string, unknown>
 export function getStatsHomeData(): Effect.Effect<StatsHomeData, StatsDataError> {
   return Effect.tryPromise({
     try: async () => {
-      const [modelRows, providerRows, geoRows] = await Promise.all([
-        listModelDaily(),
-        listProviderDaily(),
-        listGeoDaily(),
-      ])
-      return buildStatsHomeData(modelRows, providerRows, geoRows)
+      const [modelRows, geoRows] = await Promise.all([listModelDaily(), listGeoDaily()])
+      return buildStatsHomeData(modelRows, geoRows)
     },
     catch: (cause) => new StatsDataError(cause),
   })
@@ -241,23 +233,6 @@ async function listModelDaily(): Promise<ModelStatMetric[]> {
   }))
 }
 
-async function listProviderDaily(): Promise<ProviderStatMetric[]> {
-  return (
-    await queryRows(
-      `select period_key, updated_at, tier, provider, total_tokens from provider_stat
-    where grain = 'day' and client = 'all' and source = 'all'
-    and tier in (${SITE_TIER_PLACEHOLDERS}) order by period_key`,
-      DATA_SITE_TIERS,
```

#### packages/stats/core/src/domain/inference.test.ts
```diff
diff --git a/packages/stats/core/src/domain/inference.test.ts b/packages/stats/core/src/domain/inference.test.ts
index b4a7f39..0f8248a 100644
--- a/packages/stats/core/src/domain/inference.test.ts
+++ b/packages/stats/core/src/domain/inference.test.ts
@@ -24,6 +24,7 @@ describe("inference stat normalization", () => {
     expect(modelAuthor("kimi-k2.6")).toBe("moonshot")
     expect(modelAuthor("mimo-v2-omni")).toBe("xiaomi")
     expect(modelAuthor("minimax-m2.7")).toBe("minimax")
+    expect(modelAuthor("muse-spark-1.2-contributor")).toBe("meta")
     expect(modelAuthor("nemotron-3-super-free")).toBe("nvidia")
     expect(modelAuthor("qwen3.7-max")).toBe("qwen")
     expect(modelAuthor("alpha-gpt-next")).toBeUndefined()
@@ -67,6 +68,9 @@ describe("inference stat normalization", () => {
       { provider: "openai" },
     ])
     expect(toProviderAggregate(aggregate("big-pickle", "opencode"))).toMatchObject([{ provider: "unknown" }])
+    expect(toProviderAggregate(aggregate("muse-spark-1.2-contributor", "unknown"))).toMatchObject([
+      { provider: "meta" },
+    ])
   })
 
   test("geo aggregates never keep opencode or big-pickle dimensions", () => {
```

#### packages/stats/core/src/domain/model-normalization.ts
```diff
diff --git a/packages/stats/core/src/domain/model-normalization.ts b/packages/stats/core/src/domain/model-normalization.ts
index 973184f..4b6f474 100644
--- a/packages/stats/core/src/domain/model-normalization.ts
+++ b/packages/stats/core/src/domain/model-normalization.ts
@@ -9,6 +9,7 @@ export const MODEL_AUTHOR_RULES = [
   { match: "kimi", author: "moonshot" },
   { match: "mimo", author: "xiaomi" },
   { match: "minimax", author: "minimax" },
+  { match: "muse-spark", author: "meta" },
   { match: "nemotron", author: "nvidia" },
   { match: "qwen", author: "qwen" },
 ] as const
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/package.json
- `src/permission/` - review permission changes from packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionDiffView.kt
- `src/permission/` - review permission changes from packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
- `src/permission/` - review permission changes from packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/permission/PermissionViewTest.kt
- `src/tool/BaseSearchToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt changes
- `src/tool/EditToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt changes
- `src/tool/PatchBody.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/PatchBody.kt changes
- `src/tool/ShellToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt changes
- `src/tool/TaskToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/TaskToolView.kt changes
- `src/tool/ToolApprovalFooter.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolApprovalFooter.kt changes
- `src/tool/ToolApprovalText.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolApprovalText.kt changes
- `src/tool/ToolApprovalTextTest.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/tool/ToolApprovalTextTest.kt changes
- `src/tool/ToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolView.kt changes
- `src/tool/code-mode-integration.test.ts` - update based on kilocode packages/opencode/test/tool/code-mode-integration.test.ts changes
- `src/tool/code-mode.test.ts` - update based on kilocode packages/opencode/test/tool/code-mode.test.ts changes
- `src/tool/registry.test.ts` - update based on kilocode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/task.test.ts` - update based on kilocode packages/opencode/test/tool/task.test.ts changes
- `src/tool/task.test.ts` - update based on opencode packages/opencode/test/tool/task.test.ts changes
- `src/tool/task.ts` - update based on opencode packages/opencode/src/tool/task.ts changes
