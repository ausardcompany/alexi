# Upstream Changes Report
Generated: 2026-08-25 06:48:06

## Summary
- kilocode: 129 commits, 339 files changed
- opencode: 23 commits, 172 files changed

## kilocode Changes (ff74e2ea3..193a0b5e7)

### Commits

- 193a0b5e7 - Merge pull request #13050 from Kilo-Org/docs/sub-organizations (Rietie, 2026-08-24)
- 01af7904f - Merge pull request #13397 from Kilo-Org/jetbrains/release/v7.1.0-rc.3 (Kirill Kalishev, 2026-08-24)
- 31288a2b6 - docs(jetbrains): edit changelog for v7.1.0-rc.3 (Kirill Kalishev, 2026-08-24)
- 201289989 - release(jetbrains): v7.1.0-rc.3 (kilo-maintainer[bot], 2026-08-24)
- 9d6aad3af - Merge pull request #13315 from Kilo-Org/wandering-lantern (Kirill Kalishev, 2026-08-24)
- 10d0a2119 - refactor(jetbrains): rename worktree metadata file to jetbrains.json (kirillk, 2026-08-24)
- e9f56d48a - fix(jetbrains): keep header popups beside chat (kirillk, 2026-08-24)
- d24cedd17 - fix(jetbrains): align chat PR badge (kirillk, 2026-08-24)
- d4f869d97 - fix(jetbrains): scope worktree session history (kirillk, 2026-08-24)
- 2860d1a46 - fix(jetbrains): tighten chat dock row height (kirillk, 2026-08-24)
- edf60412f - fix(jetbrains): align chat dock row spacing (kirillk, 2026-08-24)
- 98928aeed - fix(jetbrains): enable worktree moves from local changes (kirillk, 2026-08-24)
- 6cb9da011 - Merge pull request #13389 from Kilo-Org/docs-session-file-context (Marius, 2026-08-24)
- 6246e0429 - merge: resolve documentation conflicts (marius-kilocode, 2026-08-24)
- 081f4cfe4 - Merge pull request #13384 from Kilo-Org/docs-agent-manager-documents (Marius, 2026-08-24)
- ee5fcfc03 - Merge pull request #13383 from Kilo-Org/docs-worktree-session-history (Marius, 2026-08-24)
- 53041b0b5 - Merge pull request #13392 from Kilo-Org/docs-agent-manager-pr-review (Marius, 2026-08-24)
- dbd2a721e - Merge pull request #13382 from Kilo-Org/docs-agent-manager-answer (Marius, 2026-08-24)
- 2a96f12af - Merge pull request #13390 from Kilo-Org/docs-agent-manager-projects (Marius, 2026-08-24)
- 0e6b62c4f - Merge pull request #13387 from Kilo-Org/docs-agent-manager-project-settings (Marius, 2026-08-24)
- 60d771fe2 - Merge pull request #13388 from Kilo-Org/docs-subagent-inspector-tabs (Marius, 2026-08-24)
- 99cdebdf4 - Merge pull request #13386 from Kilo-Org/docs-agent-manager-base-branch (Marius, 2026-08-24)
- 0db7d1cfc - Merge pull request #13381 from Kilo-Org/docs-send-all-review-context (Marius, 2026-08-24)
- 8ae39b5a6 - Merge pull request #13380 from Kilo-Org/docs-agent-manager-edit-previews (Marius, 2026-08-24)
- 82ea835e6 - fix(agent-manager): correct document inspector docs (marius-kilocode, 2026-08-24)
- 9c3ae8be3 - docs(agent-manager): document PR review panel (marius-kilocode, 2026-08-24)
- 32053a0e8 - docs(agent-manager): add multi-project guide (marius-kilocode, 2026-08-24)
- 2a98f0d3b - docs: document session-scoped file context (marius-kilocode, 2026-08-24)
- e91751b4e - docs(vscode): document subagent inspector tabs (marius-kilocode, 2026-08-24)
- 1724a7647 - docs(agent-manager): document project-scoped settings (marius-kilocode, 2026-08-24)
- 178b644ed - docs(agent-manager): clarify worktree base branch selection (marius-kilocode, 2026-08-24)
- 3382c6c18 - docs(agent-manager): document document inspector (marius-kilocode, 2026-08-24)
- fc5a33486 - docs: document worktree session history (marius-kilocode, 2026-08-24)
- 527922617 - docs(agent-manager): clarify pending question blockers (marius-kilocode, 2026-08-24)
- 76a179b42 - docs(agent-manager): document edit previews (marius-kilocode, 2026-08-24)
- c0e7c08bf - docs(agent-manager): document send-all review context (marius-kilocode, 2026-08-24)
- cda67ce80 - Merge branch 'main' into docs/sub-organizations (Rietie, 2026-08-24)
- 21ae999e3 - Merge pull request #13372 from Kilo-Org/implement-issue-13332 (Marius, 2026-08-24)
- eacdff9bd - Merge pull request #13363 from Kilo-Org/set-agent-manager-panel-default (Marius, 2026-08-24)
- 7390b5b1b - Merge pull request #13369 from Kilo-Org/migrate-settings-to-vscode-multiproject-support (Marius, 2026-08-24)
- d94f2bf1c - fix(jetbrains): address worktree move and list review findings (kirillk, 2026-08-24)
- 1d790b416 - Merge pull request #13366 from Kilo-Org/improve-context-button-consistency (Marius, 2026-08-24)
- 2b20dcbcb - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-08-24)
- 98559c9d6 - fix(agent-manager): fail closed on blocker lookup errors (marius-kilocode, 2026-08-24)
- c7889b1cd - fix(vscode): apply review cleanup suggestions (marius-kilocode, 2026-08-24)
- ce4075064 - Merge pull request #13373 from Kilo-Org/investigate-issue-13328 (Marius, 2026-08-24)
- aadded4a3 - fix(pty): tolerate vanished process entries (marius-kilocode, 2026-08-24)
- 224245748 - Merge pull request #13365 from Kilo-Org/support-configurable-powershell-shell (Marius, 2026-08-24)
- 6f6f2e413 - fix(vscode): scope AM settings guard to AM messages and keep panel project untouched (marius-kilocode, 2026-08-24)
- 7ab7511d4 - Merge pull request #13358 from Kilo-Org/improve-review-comments-ui (Marius, 2026-08-24)
- 05cbbdd84 - fix(pty): harden cross-platform smoke checks (marius-kilocode, 2026-08-24)
- ce5a71e5f - fix(jetbrains): show worktree progress in agent rows (kirillk, 2026-08-24)
- 06f6add40 - fix(vscode): resolve main merge and keep provider within size cap (marius-kilocode, 2026-08-24)
- 05f09fa07 - Merge pull request #13371 from Kilo-Org/research-windows-extension-performance-regression (Marius, 2026-08-24)
- 58eea7381 - fix(cli): retry reasoning-only incomplete responses (marius-kilocode, 2026-08-24)
- 182408b97 - Merge pull request #13370 from Kilo-Org/fix-undo-prompt-attachment-restoration (Marius, 2026-08-24)
- 7baefdddf - feat(agent-manager): answer pending questions (marius-kilocode, 2026-08-24)
- 8c1122f3a - fix(cli): avoid Windows PTY termination verification (marius-kilocode, 2026-08-24)
- 220d65118 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-08-24)
- e8697fb56 - test(agent-manager): cover full toolbar context (marius-kilocode, 2026-08-24)
- 062d11f99 - fix(vscode): restore images when undoing prompts (marius-kilocode, 2026-08-24)
- 3a2375752 - Merge remote-tracking branch 'origin/main' into migrate-settings-to-vscode-multiproject-support (marius-kilocode, 2026-08-24)
- 06d20fb1e - fix: repair shell selection syntax after marker edit (marius-kilocode, 2026-08-24)
- 6b8652657 - feat(vscode): add project-scoped Agent Manager settings tab (marius-kilocode, 2026-08-24)
- b712c2f7c - chore(sdk): regenerate v2 client for MCP resource and tool endpoints (marius-kilocode, 2026-08-24)
- 7669119ce - fix: annotate pwsh probe line for kilocode_change checker (marius-kilocode, 2026-08-24)
- d808e309e - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-08-24)
- acc1c217b - fix(agent-manager): unify toolbar control heights and spacing (marius-kilocode, 2026-08-24)
- 98ea338c8 - fix: prefer powershell 7 over legacy 5.1 on windows (marius-kilocode, 2026-08-24)
- 90437c0ef - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-08-24)
- fcdcb45da - merge main into improve-review-comments-ui (marius-kilocode, 2026-08-24)
- 81d364923 - test(core): expect powershell 7 selection over legacy 5.1 on windows (marius-kilocode, 2026-08-24)
- e1198adeb - Merge pull request #13362 from Kilo-Org/fix-wait-background-agents (Marius, 2026-08-24)
- 8d0750f56 - fix(test): handle platform PTY cleanup (marius-kilocode, 2026-08-24)
- 35de2d1ec - fix(test): stabilize cross-platform PTY checks (marius-kilocode, 2026-08-24)
- 8e11b29b6 - test(vscode): use local review comment fixtures (marius-kilocode, 2026-08-24)
- 56cf3934c - fix(ci): annotate all PTY smoke commands (marius-kilocode, 2026-08-24)
- b2fa8d285 - Merge pull request #13354 from Kilo-Org/fix/document-open-file-optional-chain (Marius, 2026-08-24)
- 575a4ad81 - chore(ci): simplify PTY smoke annotations (marius-kilocode, 2026-08-24)
- c68400fa7 - Merge pull request #13361 from Kilo-Org/docs/eol-products (arrrkady, 2026-08-24)
- 92ca332ff - chore(vscode): consolidate review changeset (marius-kilocode, 2026-08-24)
- a35585ad9 - test(cli): validate PTY across release targets (marius-kilocode, 2026-08-24)
- 9f7b4e498 - fix(cli): clarify background task orchestration (marius-kilocode, 2026-08-24)
- b74c27972 - refactor(vscode): narrow review comment change (marius-kilocode, 2026-08-24)
- da4a91b36 - fix(opencode): preserve Cerebras completion limit (#13289) (Ryan Loney, 2026-08-24)
- 824b0837d - fix(vscode): remove unsupported review replies (marius-kilocode, 2026-08-24)
- 4f5542593 - docs(kilo-docs): remove KiloClaw references from other product pages (Rietie, 2026-08-24)
- 693624c30 - fix(vscode): open source files in native editor (marius-kilocode, 2026-08-24)
- 2d01fd839 - docs(kilo-docs): mark KiloClaw end of life and drop promotional links (Rietie, 2026-08-24)
- c0cc71489 - fix: avoid unnecessary project plugin dependencies (#13300) (Matt Van Horn, 2026-08-24)
- 8bff56de6 - feat(vscode): improve review comment previews (marius-kilocode, 2026-08-24)
- cea5386c8 - Merge pull request #13356 from Kilo-Org/luminous-roof (Marius, 2026-08-24)
- 3e2adcf37 - fix(ui): expand answered questions in chat (marius-kilocode, 2026-08-24)
- 2a9dcbe89 - feat(agent-manager): add PR link copy button (#13353) (Marius, 2026-08-24)
- a191569ba - refactor(vscode): simplify openFile null check with optional chaining (kiloconnect[bot], 2026-08-24)
- e2186def6 - Merge pull request #13316 from Kilo-Org/fix-spinner-input-margin-regression (Marius, 2026-08-24)
- 54f785ee8 - Merge pull request #13350 from Kilo-Org/optimize-document-viewer-performance (Marius, 2026-08-24)
- e8cd46582 - Merge pull request #13349 from Kilo-Org/investigate-luna-output-cap (Marius, 2026-08-24)
- 7327404ec - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-08-24)
- b7e5fefdf - fix(vscode): preserve document viewer fallbacks (marius-kilocode, 2026-08-24)
- 3615dff27 - fix(vscode): keep both dock states flush with the prompt (marius-kilocode, 2026-08-24)
- 18504df46 - fix(vscode): open source files in native editor (marius-kilocode, 2026-08-24)
- 17611729e - fix(cli): preserve output budget for encrypted reasoning (marius-kilocode, 2026-08-24)
- 32573a0a1 - fix(jetbrains): show chat worktree actions only while the session is idle (kirillk, 2026-08-23)
- 76faa3004 - feat(jetbrains): add chat branch/PR dock with worktree actions (kirillk, 2026-08-23)
- 31b7297dd - fix(jetbrains): mute worktree metadata styling (kirillk, 2026-08-21)
- 64c14abc7 - fix(jetbrains): use regular title weight in active lists (kirillk, 2026-08-21)
- 0879741e9 - fix(jetbrains): move PR number after the worktree title (kirillk, 2026-08-21)
- 34a7eb34a - fix(jetbrains): align session and worktree icons (kirillk, 2026-08-21)
- ccc6b5203 - refactor(jetbrains): slide workflow selection after delete (kirillk, 2026-08-21)
- 4458ae6e5 - Merge remote-tracking branch 'origin/main' into wandering-lantern (kirillk, 2026-08-21)
- e8e4602ae - test(jetbrains): load real icons in the worktree icon size test (kirillk, 2026-08-21)
- 11781f500 - fix(vscode): preserve prompt gutter for idle dock (marius-kilocode, 2026-08-21)
- f60e8dc84 - refactor(jetbrains): route every list refresh through one selection policy (kirillk, 2026-08-21)
- 092214b11 - fix(jetbrains): paint the whole row body into the drag image (kirillk, 2026-08-21)
- 637662991 - fix(jetbrains): size the drag gap to the row body (kirillk, 2026-08-21)
- 07d2189d3 - fix(jetbrains): keep list selection stable across refreshes (kirillk, 2026-08-21)
- 9694ff660 - fix(vscode): remove working indicator prompt gap (marius-kilocode, 2026-08-21)
- 59d1ec8a2 - feat(jetbrains): reorder worktrees with drag and drop (kirillk, 2026-08-21)
- 0161c3a4b - fix(jetbrains): refine agent manager badges (kirillk, 2026-08-20)
- 082b38b23 - fix(jetbrains): stop session error card EDT freeze (kirillk, 2026-08-20)
- ac98f5c77 - fix(jetbrains): refine agent manager activity icons (kirillk, 2026-08-20)
- d5ddc8a34 - feat(jetbrains): animate running session icon in agent manager tree (kirillk, 2026-08-20)
- 89b20c694 - feat(jetbrains): unify activity status colors and add error state (kirillk, 2026-08-19)
- 3e152b75f - feat(jetbrains): update agent manager worktree list (kirillk, 2026-08-19)
- f73f9474e - fix(jetbrains): pad empty session recents (kirillk, 2026-08-19)
- 2aee16b2e - fix(jetbrains): show tool window content as tabs (kirillk, 2026-08-19)
- 383a596f6 - docs(kilo-docs): optimize sub-organization screenshots (John Fawcett, 2026-08-10)
- d1b0cde9c - docs(kilo-docs): document sub-organizations (John Fawcett, 2026-08-10)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/agent-manager.ts` (+56, -4)
- `packages/opencode/src/kilocode/tool/agent-manager.txt` (+7, -1)
- `packages/opencode/src/tool/task.ts` (+1, -2)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
- `packages/opencode/src/kilocode/permission/agent-manager.ts` (+3, -3)
- `packages/opencode/test/kilocode/permission/agent-manager-prompt.test.ts` (+5, -1)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/src/kilocode/powershell.ts` (+19, -1)
- `packages/core/src/kilocode/pty/smoke.ts` (+72, -0)
- `packages/core/src/kilocode/pty/termination.ts` (+27, -1)
- `packages/core/src/shell.ts` (+2, -1)
- `packages/core/test/kilocode/powershell.test.ts` (+120, -0)
- `packages/core/test/kilocode/pty-platform.test.ts` (+96, -0)
- `packages/core/test/kilocode/pty-termination.test.ts` (+19, -1)
- `packages/kilo-vscode/src/agent-manager/orchestration-bridge.ts` (+43, -6)
- `packages/kilo-vscode/src/agent-manager/orchestration-domain.ts` (+116, -9)
- `packages/kilo-vscode/tests/unit/agent-manager-orchestration-bridge.test.ts` (+59, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-orchestration-domain.test.ts` (+240, -2)

#### Other Changes
- `.changeset/agent-manager-answer-action.md` (+5, -0)
- `.changeset/agent-manager-settings-tab.md` (+5, -0)
- `.changeset/agent-manager-toolbar-consistency.md` (+5, -0)
- `.changeset/answered-questions-expanded.md` (+5, -0)
- `.changeset/clear-background-task-waiting.md` (+5, -0)
- `.changeset/copy-pr-link.md` (+5, -0)
- `.changeset/fix-windows-pty-termination.md` (+5, -0)
- `.changeset/fix-working-indicator-prompt-gap.md` (+5, -0)
- `.changeset/jetbrains-agent-manager-activity-icons.md` (+5, -0)
- `.changeset/jetbrains-chat-dock-move-and-worktree-dialog.md` (+5, -0)
- `.changeset/jetbrains-chat-popup-orientation.md` (+5, -0)
- `.changeset/jetbrains-chat-pr-badge-alignment.md` (+5, -0)
- `.changeset/jetbrains-dock-idle-actions.md` (+5, -0)
- `.changeset/jetbrains-empty-recents-padding.md` (+5, -0)
- `.changeset/jetbrains-list-description-spinner-color.md` (+5, -0)
- `.changeset/jetbrains-list-refresh-selection.md` (+5, -0)
- `.changeset/jetbrains-list-selection-sync.md` (+5, -0)
- `.changeset/jetbrains-session-error-card-freeze.md` (+5, -0)
- `.changeset/jetbrains-session-spinner.md` (+5, -0)
- `.changeset/jetbrains-tool-window-tabs.md` (+5, -0)
- `.changeset/jetbrains-worktree-drag-reorder.md` (+5, -0)
- `.changeset/jetbrains-worktree-row-icons.md` (+5, -0)
- `.changeset/jetbrains-worktree-session-history.md` (+5, -0)
- `.changeset/keep-reasoning-output-budget.md` (+5, -0)
- `.changeset/prefer-powershell-7-on-windows.md` (+6, -0)
- `.changeset/quiet-badges.md` (+5, -0)
- `.changeset/quiet-project-plugin-dependencies.md` (+5, -0)
- `.changeset/rendered-document-inspector.md` (+1, -1)
- `.changeset/restore-undo-attachments.md` (+5, -0)
- `.changeset/retry-reasoning-only-responses.md` (+5, -0)
- `.changeset/review-comment-previews.md` (+5, -0)
- `.changeset/wet-lemons-walk.md` (+5, -0)
- `.changeset/worktree-move-reliability.md` (+5, -0)
- `.changeset/worktree-progress-agent-row.md` (+5, -0)
- `.github/workflows/publish.yml` (+7, -0)
- `.github/workflows/test.yml` (+16, -4)
- `packages/kilo-docs/lib/nav/automate.ts` (+1, -0)
- `packages/kilo-docs/lib/nav/collaborate.ts` (+4, -0)
- `packages/kilo-docs/markdoc/partials/kiloclaw-eol.md` (+3, -0)
- `packages/kilo-docs/pages/ai-providers/openai-chatgpt-plus-pro.md` (+4, -4)
- `packages/kilo-docs/pages/ai-providers/xai.md` (+1, -1)
- `packages/kilo-docs/pages/automate/agent-manager-projects.md` (+36, -0)
- `packages/kilo-docs/pages/automate/agent-manager-workflows.md` (+2, -2)
- `packages/kilo-docs/pages/automate/agent-manager.md` (+82, -3)
- `packages/kilo-docs/pages/code-with-ai/agents/context-mentions.md` (+4, -0)
- `packages/kilo-docs/pages/code-with-ai/agents/session-history.md` (+3, -1)
- `packages/kilo-docs/pages/code-with-ai/platforms/cloud-agent.md` (+2, -5)
- `packages/kilo-docs/pages/code-with-ai/platforms/mobile.md` (+3, -7)
- `packages/kilo-docs/pages/collaborate/enterprise/sub-organizations.md` (+105, -0)
- `packages/kilo-docs/pages/collaborate/index.md` (+1, -0)
- `packages/kilo-docs/pages/contributing/architecture/index.md` (+0, -1)
- `packages/kilo-docs/pages/customize/custom-subagents.md` (+8, -0)
- `packages/kilo-docs/pages/index.tsx` (+6, -65)
- `packages/kilo-docs/pages/kiloclaw/chat-platforms/discord.md` (+2, -0)
- `packages/kilo-docs/pages/kiloclaw/chat-platforms/index.md` (+2, -0)
- `packages/kilo-docs/pages/kiloclaw/chat-platforms/slack.md` (+2, -0)
- `packages/kilo-docs/pages/kiloclaw/chat-platforms/telegram.md` (+2, -0)
- `packages/kilo-docs/pages/kiloclaw/control-ui/changing-models.md` (+2, -0)
- `packages/kilo-docs/pages/kiloclaw/control-ui/exec-approvals.md` (+2, -0)
- `packages/kilo-docs/pages/kiloclaw/control-ui/overview.md` (+2, -0)
- `packages/kilo-docs/pages/kiloclaw/control-ui/version-pinning.md` (+2, -0)
- `packages/kilo-docs/pages/kiloclaw/dashboard.md` (+2, -0)
- `packages/kilo-docs/pages/kiloclaw/development-tools/composio.md` (+2, -0)
- `packages/kilo-docs/pages/kiloclaw/development-tools/github.md` (+2, -0)
- `packages/kilo-docs/pages/kiloclaw/development-tools/google.md` (+2, -0)
- `packages/kilo-docs/pages/kiloclaw/development-tools/index.md` (+2, -0)
- `packages/kilo-docs/pages/kiloclaw/development-tools/linear.md` (+2, -0)
- `packages/kilo-docs/pages/kiloclaw/end-to-end.md` (+2, -0)
- `packages/kilo-docs/pages/kiloclaw/faq/general.md` (+2, -0)
- `packages/kilo-docs/pages/kiloclaw/faq/pricing.md` (+2, -0)
- `packages/kilo-docs/pages/kiloclaw/overview.md` (+2, -0)
- `packages/kilo-docs/pages/kiloclaw/pre-installed-software.md` (+2, -0)
- `packages/kilo-docs/pages/kiloclaw/tools/1password.md` (+2, -0)
- `packages/kilo-docs/pages/kiloclaw/tools/agentcard.md` (+2, -0)
- `packages/kilo-docs/pages/kiloclaw/tools/brave-search.md` (+2, -0)
- `packages/kilo-docs/pages/kiloclaw/tools/index.md` (+2, -0)
- `packages/kilo-docs/pages/kiloclaw/tools/other-tools.md` (+2, -0)
- `packages/kilo-docs/pages/kiloclaw/triggers/index.md` (+2, -0)
- `packages/kilo-docs/pages/kiloclaw/triggers/scheduled.md` (+2, -0)
- `packages/kilo-docs/pages/kiloclaw/triggers/webhooks.md` (+2, -0)
- `packages/kilo-docs/pages/kiloclaw/troubleshooting/architecture.md` (+2, -0)
- `packages/kilo-docs/pages/kiloclaw/troubleshooting/common-questions.md` (+2, -0)
- `packages/kilo-docs/pages/kiloclaw/troubleshooting/faq.md` (+2, -0)
- `packages/kilo-docs/pages/kiloclaw/troubleshooting/gateway-process.md` (+2, -0)
- `packages/kilo-docs/public/img/enterprise/create-sub-organization.webp` (+-, --)
- `packages/kilo-docs/public/img/enterprise/sub-organizations-credits.webp` (+-, --)
- `packages/kilo-docs/public/img/enterprise/sub-organizations-models.webp` (+-, --)
- `packages/kilo-docs/public/img/enterprise/sub-organizations-overview.webp` (+-, --)
- `packages/kilo-docs/public/img/enterprise/sub-organizations-people.webp` (+-, --)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/multi-project-sidebar-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/pr-panel-comments-200-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/tab-bar-full-context-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/tab-bar-multiple-tabs-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/tab-bar-single-tab-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-agent-manager-completed-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/message-list-layout-correction-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-many-prompts-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-sidebar-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-wide-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/user-message-many-review-comments-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/user-message-review-comments-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/welcome-with-switcher-and-notification-chromium-linux.png` (+2, -2)
- `packages/kilo-jetbrains/CHANGELOG.md` (+20, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendActivityManager.kt` (+6, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendSessionManager.kt` (+77, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloCliDataParser.kt` (+25, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloSessionRpcApiImpl.kt` (+4, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorktreeRpcApiImpl.kt` (+116, -1)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/WorktreeTransfer.kt` (+180, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendActivityManagerTest.kt` (+40, -1)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendSessionManagerTest.kt` (+146, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/KiloCliDataParserTest.kt` (+86, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloWorktreeRpcApiImplTest.kt` (+176, -8)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/MockCliServer.kt` (+9, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/KiloToolWindowFactory.kt` (+29, -14)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/ChatMoveToWorktreeAction.kt` (+48, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/ChatNewWorktreeAction.kt` (+31, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/AgentAttention.kt` (+16, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/AgentManagerPanel.kt` (+80, -61)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/KiloWorktreeService.kt` (+25, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/NewWorktreeDialog.kt` (+25, -8)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/PendingWorktreeSession.kt` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeActivity.kt` (+4, -7)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeController.kt` (+107, -6)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeIcons.kt` (+35, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreePrHeaderView.kt` (+10, -133)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorKind.kt` (+12, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorManager.kt` (+7, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorPanel.kt` (+9, -11)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionListController.kt` (+28, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeStatsView.kt` (+2, -35)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloSessionService.kt` (+9, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ActivityIcon.kt` (+64, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionActivityKind.kt` (+8, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionManager.kt` (+13, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionSidePanelManager.kt` (+18, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+94, -25)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SpinnerIcon.kt` (+96, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionController.kt` (+13, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/history/HistoryPanel.kt` (+3, -32)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/history/HistoryRows.kt` (+5, -9)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/scroll/SessionScroll.kt` (+16, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/subagent/SubagentSessionEditorHost.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/ProgressPanel.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/RevertProgress.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/attachment/AttachmentEditorKind.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/empty/RecentsList.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/BranchDock.kt` (+196, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/ChatDockKeys.kt` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/PrHeaderView.kt` (+198, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/SessionHeaderPanel.kt` (+1, -64)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/popup/HeaderPopup.kt` (+25, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/popup/HeaderPopupController.kt` (+51, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/popup/HeaderPopupGeometry.kt` (+70, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/PromptPanel.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/SessionOutcomeView.kt` (+3, -26)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/McpConfigurable.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/SkillsConfigurable.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/WorkflowsConfigurable.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsInlineListPanel.kt` (+2, -8)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsListPanel.kt` (+0, -6)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/context/ContextSettingsUi.kt` (+6, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/providers/ProvidersSettingsUi.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/rules/RulesSettingsUi.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/AttentionDotIcon.kt` (+27, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/PrBadges.kt` (+45, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/UiStyle.kt` (+76, -25)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveList.kt` (+7, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListModel.kt` (+9, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListRenderer.kt` (+87, -7)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListReorder.kt` (+87, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListView.kt` (+281, -46)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/picker/PickerPopup.kt` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/worktree-local.svg` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/worktree-local_dark.svg` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/worktreeBranch.svg` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/worktreeBranch_dark.svg` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/worktreeLock.svg` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/worktreeLock_dark.svg` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/kilo.jetbrains.frontend.xml` (+10, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+17, -4)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/KiloToolWindowFactoryTest.kt` (+5, -14)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/AgentAttentionTest.kt` (+27, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/AgentManagerPanelTest.kt` (+322, -5)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/WorktreeControllerTest.kt` (+181, -18)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/WorktreeIconsTest.kt` (+93, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/WorktreeSessionEditorKindTest.kt` (+13, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/NewWorktreeDialogTest.kt` (+16, -18)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeActivityTest.kt` (+15, -8)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreePrHeaderViewTest.kt` (+5, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorPanelTest.kt` (+16, -4)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionListControllerTest.kt` (+63, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionScrollTest.kt` (+158, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionUiLayoutTest.kt` (+164, -15)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionUiTestBase.kt` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/SessionControllerTestBase.kt` (+16, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/ViewSwitchingTest.kt` (+51, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/history/HistoryControllerTest.kt` (+3, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/subagent/SubagentSessionEditorHostTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/ProgressPanelTest.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/PromptPanelTest.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/RevertProgressTest.kt` (+18, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/header/BranchDockTest.kt` (+331, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/header/PrHeaderViewTest.kt` (+143, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/header/SessionHeaderPanelTest.kt` (+2, -67)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/popup/HeaderPopupBodyTest.kt` (+30, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/popup/HeaderPopupGeometryTest.kt` (+139, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/SessionOutcomeViewTest.kt` (+110, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/McpSettingsUiTest.kt` (+25, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/SkillsSettingsUiTest.kt` (+11, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/WorkflowsSettingsUiTest.kt` (+11, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/base/SettingsListViewTest.kt` (+36, -14)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/rules/RulesSettingsUiTest.kt` (+13, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeSessionRpcApi.kt` (+9, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeWorktreeRpcApi.kt` (+30, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/UiStyleTest.kt` (+20, -6)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/list/ActiveListReorderTest.kt` (+319, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/list/ActiveListSelectionTest.kt` (+247, -0)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloSessionRpcApi.kt` (+8, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloWorktreeRpcApi.kt` (+24, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/SessionDto.kt` (+22, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/WorktreeDto.kt` (+25, -0)
- `packages/kilo-ui/src/components/message-part.css` (+27, -0)
- `packages/kilo-ui/src/components/message-part.tsx` (+1, -1)
- `packages/kilo-ui/src/stories/message-part.stories.tsx` (+4, -4)
- `packages/kilo-vscode/script/launch.ts` (+2, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+92, -1)
- `packages/kilo-vscode/src/SettingsEditorProvider.ts` (+25, -10)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+4, -4)
- `packages/kilo-vscode/src/agent-manager/SetupScriptRunner.ts` (+2, -1)
- `packages/kilo-vscode/src/agent-manager/__tests__/AgentManagerProvider.spec.ts` (+1, -0)
- `packages/kilo-vscode/src/agent-manager/host.ts` (+3, -0)
- `packages/kilo-vscode/src/agent-manager/project/messages.ts` (+6, -0)
- `packages/kilo-vscode/src/agent-manager/project/settings.ts` (+168, -0)
- `packages/kilo-vscode/src/agent-manager/project/wiring.ts` (+14, -3)
- `packages/kilo-vscode/src/agent-manager/run/service.ts` (+2, -1)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+7, -0)
- `packages/kilo-vscode/src/agent-manager/vscode-host.ts` (+4, -0)
- `packages/kilo-vscode/src/extension.ts` (+5, -3)
- `packages/kilo-vscode/src/kilo-provider/options.ts` (+5, -0)
- `packages/kilo-vscode/src/util/powershell.ts` (+33, -0)
- `packages/kilo-vscode/src/utils.ts` (+2, -1)
- `packages/kilo-vscode/tests/prompt-spacing.spec.ts` (+5, -1)
- `packages/kilo-vscode/tests/session-dock-stability.spec.ts` (+37, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+0, -30)
- `packages/kilo-vscode/tests/unit/agent-manager-documents.test.ts` (+48, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-settings.test.ts` (+50, -0)
- `packages/kilo-vscode/tests/unit/powershell.test.ts` (+38, -0)
- `packages/kilo-vscode/tests/unit/run-script-service.test.ts` (+2, -1)
- `packages/kilo-vscode/tests/unit/session-utils.test.ts` (+50, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+4, -24)
- `packages/kilo-vscode/webview-ui/agent-manager/DefaultBaseBranchDialog.tsx` (+0, -110)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectActions.tsx` (+8, -24)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectBranchDialog.tsx` (+52, -27)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectList.tsx` (+0, -11)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectSidebarBody.tsx` (+3, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/SidebarBody.tsx` (+3, -4)
- `packages/kilo-vscode/webview-ui/agent-manager/TabBar.tsx` (+4, -13)
- `packages/kilo-vscode/webview-ui/agent-manager/WorktreeSectionActions.tsx` (+8, -24)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+25, -23)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+12, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+13, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+12, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+12, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+14, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+12, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+13, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fa.ts` (+13, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fr.ts` (+14, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/it.ts` (+14, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ja.ts` (+12, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ko.ts` (+12, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/nl.ts` (+13, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/no.ts` (+12, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/pl.ts` (+12, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ru.ts` (+13, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/th.ts` (+12, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/tr.ts` (+13, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/uk.ts` (+13, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zh.ts` (+12, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zht.ts` (+12, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/CopyButton.tsx` (+3, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRPanel.tsx` (+6, -0)
- `packages/kilo-vscode/webview-ui/diff-viewer/MarkdownAnnotationLayer.tsx` (+4, -4)
- `packages/kilo-vscode/webview-ui/documents/state.ts` (+12, -5)
- `packages/kilo-vscode/webview-ui/src/App.tsx` (+9, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/ReviewComments.tsx` (+122, -105)
- `packages/kilo-vscode/webview-ui/src/components/settings/Settings.tsx` (+193, -1)
- `packages/kilo-vscode/webview-ui/src/context/session-utils.ts` (+34, -0)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+12, -26)
- `packages/kilo-vscode/webview-ui/src/stories/agent-manager.stories.tsx` (+65, -0)
- `packages/kilo-vscode/webview-ui/src/stories/chat.stories.tsx` (+50, -24)
- `packages/kilo-vscode/webview-ui/src/styles/high-contrast.css` (+3, -3)
- `packages/kilo-vscode/webview-ui/src/styles/prompt-input.css` (+169, -105)
- `packages/kilo-vscode/webview-ui/src/styles/session-actions.css` (+7, -2)
- `packages/kilo-vscode/webview-ui/src/styles/settings.css` (+10, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+45, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+36, -0)
- `packages/opencode/src/config/config.ts` (+17, -33)
- `packages/opencode/src/kilocode/agent-manager/protocol.ts` (+23, -2)
- `packages/opencode/src/kilocode/background-process/index.ts` (+3, -1)
- `packages/opencode/src/kilocode/background-process/runner.ts` (+3, -1)
- `packages/opencode/src/kilocode/cli/cmd/pty-smoke.ts` (+11, -0)
- `packages/opencode/src/kilocode/cli/setup.ts` (+2, -0)
- `packages/opencode/src/kilocode/config/plugin-deps.ts` (+30, -0)
- `packages/opencode/src/kilocode/session/llm.ts` (+5, -4)
- `packages/opencode/src/kilocode/session/overflow.ts` (+9, -0)
- `packages/opencode/src/kilocode/session/processor.ts` (+7, -1)
- `packages/opencode/src/kilocode/shell/shell.ts` (+1, -1)
- `packages/opencode/src/provider/transform.ts` (+13, -0)
- `packages/opencode/src/session/llm.ts` (+14, -2)
- `packages/opencode/test/kilocode/agent-manager-tool.test.ts` (+91, -2)
- `packages/opencode/test/kilocode/config/config.test.ts` (+184, -7)
- `packages/opencode/test/kilocode/session-overflow.test.ts` (+47, -0)
- `packages/opencode/test/kilocode/session-processor-incomplete-response-retry.test.ts` (+73, -16)
- `packages/opencode/test/provider/transform.test.ts` (+42, -0)
- `packages/opencode/test/server/httpapi-pty.test.ts` (+67, -41)
- `packages/opencode/test/server/httpapi-v2-pty.test.ts` (+91, -39)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+86, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+104, -0)
- `packages/sdk/openapi.json` (+288, -0)

### Key Diffs

#### packages/core/src/kilocode/powershell.ts
```diff
diff --git a/packages/core/src/kilocode/powershell.ts b/packages/core/src/kilocode/powershell.ts
index 866f215e0..13a0e17ab 100644
--- a/packages/core/src/kilocode/powershell.ts
+++ b/packages/core/src/kilocode/powershell.ts
@@ -1,7 +1,25 @@
+import { statSync } from "fs"
+import path from "path"
+import { which } from "../util/which"
+
 export function args(command: string) {
   return ["-NoLogo", "-NoProfile", "-NonInteractive", "-Command", script(command)]
 }
 
+export const locations = (env: NodeJS.ProcessEnv = process.env) =>
+  [
+    env["ProgramFiles"] && path.join(env["ProgramFiles"], "PowerShell", "7"),
+    env["ProgramFiles(x86)"] && path.join(env["ProgramFiles(x86)"], "PowerShell", "7"),
+    env["LOCALAPPDATA"] && path.join(env["LOCALAPPDATA"], "Microsoft", "WindowsApps"),
+  ]
+    .filter((item): item is string => Boolean(item))
+    .map((root) => path.join(root, "pwsh.exe"))
+
+export const probe = (env: NodeJS.ProcessEnv = process.env) =>
+  locations(env).filter((file) => statSync(file, { throwIfNoEntry: false })?.isFile())
+
+export const pwsh = (env: NodeJS.ProcessEnv = process.env) => which("pwsh", env) ?? probe(env)[0]
+
 const setup = `[Console]::InputEncoding = [System.Text.UTF8Encoding]::new($false);
 [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false);
 $OutputEncoding = [Console]::OutputEncoding;
@@ -123,4 +141,4 @@ function block(command: string, start: number, open: string, close: string) {
   }
 }
 
-export const PowerShell = { args }
+export const PowerShell = { args, locations, probe, pwsh }
```

#### packages/core/src/kilocode/pty/smoke.ts
```diff
diff --git a/packages/core/src/kilocode/pty/smoke.ts b/packages/core/src/kilocode/pty/smoke.ts
new file mode 100644
index 000000000..fa5a4e01b
--- /dev/null
+++ b/packages/core/src/kilocode/pty/smoke.ts
@@ -0,0 +1,72 @@
+import { Shell } from "../../shell"
+import { KiloPtyTermination } from "./termination"
+import { spawn } from "#pty"
+
+const TIMEOUT = 15_000
+
+export async function smoke() {
+  const proc = spawn(Shell.preferred(), [], {
+    name: "xterm-256color",
+    cwd: process.cwd(),
+    env: { ...process.env, TERM: "xterm-256color", KILO_TERMINAL: "1" } as Record<string, string>,
+    cols: 80,
+    rows: 24,
+  })
+  const state = { output: "", exited: false }
+  const output = Promise.withResolvers<void>()
+  const exited = Promise.withResolvers<number>()
+  const data = proc.onData((chunk) => {
+    state.output += chunk
+    const lines = state.output.replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, "").split(/\r?\n/)
+    if (lines.some((line) => line.trim() === "KILO_PTY_READY")) output.resolve()
+  })
+  const exit = proc.onExit((event) => {
+    state.exited = true
+    exited.resolve(event.exitCode)
+  })
+  const timeout = AbortSignal.timeout(TIMEOUT)
+
+  try {
+    proc.resize(100, 40)
+    proc.write("echo KILO_PTY_READY\r")
+    await Promise.race([
+      output.promise,
+      new Promise<never>((_, reject) =>
+        timeout.addEventListener(
+          "abort",
+          () => reject(new Error(`PTY produced no output within ${TIMEOUT}ms: ${JSON.stringify(state.output)}`)),
+          { once: true },
+        ),
+      ),
+    ])
+    proc.write("exit 7\r")
+    const code = await Promise.race([
+      exited.promise,
```

#### packages/core/src/kilocode/pty/termination.ts
```diff
diff --git a/packages/core/src/kilocode/pty/termination.ts b/packages/core/src/kilocode/pty/termination.ts
index 33b29936d..70f7b6756 100644
--- a/packages/core/src/kilocode/pty/termination.ts
+++ b/packages/core/src/kilocode/pty/termination.ts
@@ -1,4 +1,5 @@
 import { spawn } from "child_process"
+import { readdir, readFile } from "node:fs/promises"
 import { setTimeout as sleep } from "node:timers/promises"
 import type { Proc } from "../../pty/pty"
 import { Log } from "../../util/log"
@@ -87,6 +88,15 @@ function signal(proc: Process, pids: number[], value: "SIGTERM" | "SIGKILL", inp
 }
 
 async function tree(file: string = "ps", args: string[] = ["-axo", "pid=,ppid="]) {
+  if (process.platform === "linux") {
+    try {
+      const rows = await procTree()
+      if (rows.length > 0) return rows
+    } catch (err) {
+      log.debug("failed to read Linux process tree", { err })
+    }
+  }
+
   return await new Promise<Array<{ pid: number; parent: number }>>((resolve, reject) => {
     try {
       const child = spawn(file, args, {
@@ -116,6 +126,22 @@ async function tree(file: string = "ps", args: string[] = ["-axo", "pid=,ppid="]
   })
 }
 
+async function procTree() {
+  const entries = await readdir("/proc", { withFileTypes: true })
+  const rows = await Promise.all(
+    entries
+      .filter((entry) => entry.isDirectory() && /^\d+$/.test(entry.name))
+      .map(async (entry) => {
+        const stat = await readFile(`/proc/${entry.name}/stat`, "utf8").catch(() => undefined)
+        if (!stat) return
+        const match = stat.match(/^\d+ \(.*\) [A-Z] (\d+)/)
+        if (!match) return
+        return { pid: Number(entry.name), parent: Number(match[1]) }
+      }),
+  )
+  return rows.filter((row): row is { pid: number; parent: number } => row !== undefined)
+}
+
 async function taskkill(file: string, args: string[], opts: { stdio: "ignore"; windowsHide: true; timeout: number }) {
   return await new Promise<boolean>((resolve) => {
     try {
@@ -153,7 +179,7 @@ export async function terminate(proc: Process, input: Runtime = runtime): Promis
```

#### packages/core/src/shell.ts
```diff
diff --git a/packages/core/src/shell.ts b/packages/core/src/shell.ts
index f92906aeb..821e69082 100644
--- a/packages/core/src/shell.ts
+++ b/packages/core/src/shell.ts
@@ -99,7 +99,8 @@ function resolve(file: string) {
 function win() {
   return Array.from(
     new Set(
-      [which("pwsh"), which("powershell"), gitbash(), process.env.COMSPEC || "cmd.exe"]
+      // kilocode_change - probe known PowerShell 7 install locations so legacy 5.1 is not picked when pwsh is off PATH
+      [PowerShell.pwsh(), which("powershell"), gitbash(), process.env.COMSPEC || "cmd.exe"] // kilocode_change
         .filter((item): item is string => Boolean(item))
         .map(full),
     ),
```

#### packages/core/test/kilocode/powershell.test.ts
```diff
diff --git a/packages/core/test/kilocode/powershell.test.ts b/packages/core/test/kilocode/powershell.test.ts
new file mode 100644
index 000000000..edca08ae5
--- /dev/null
+++ b/packages/core/test/kilocode/powershell.test.ts
@@ -0,0 +1,120 @@
+import { describe, expect, test } from "bun:test"
+import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "fs"
+import { tmpdir } from "os"
+import path from "path"
+import { Shell } from "@opencode-ai/core/shell"
+import { PowerShell } from "@opencode-ai/core/kilocode/powershell"
+import { which } from "@opencode-ai/core/util/which"
+
+const LEGACY = "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe"
+
+const knownLocations = () => {
+  const roots = [
+    process.env.ProgramFiles && path.join(process.env.ProgramFiles, "PowerShell", "7"),
+    process.env["ProgramFiles(x86)"] && path.join(process.env["ProgramFiles(x86)"], "PowerShell", "7"),
+    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, "Microsoft", "WindowsApps"),
+  ].filter((item): item is string => Boolean(item))
+  return roots.map((root) => path.join(root, "pwsh.exe")).filter((file) => existsSync(file))
+}
+
+const pwshInstalled = () => Boolean(which("pwsh")) || knownLocations().length > 0
+
+// Remove every PATH directory that can resolve pwsh or powershell so detection
+// cannot fall back to PATH lookup and must find installs on its own.
+const withoutPowershellDirs = () =>
+  (process.env.PATH ?? "")
+    .split(path.delimiter)
+    .filter(Boolean)
+    .filter((dir) => !/powershell/i.test(dir) && !existsSync(path.join(dir, "pwsh.exe")))
+    .join(path.delimiter)
+
+function withEnv(env: { PATH?: string; SHELL?: string }, fn: () => void) {
+  const prevPath = process.env.PATH
+  const prevShell = process.env.SHELL
+  if (env.PATH === undefined) delete process.env.PATH
+  else process.env.PATH = env.PATH
+  if (env.SHELL === undefined) delete process.env.SHELL
+  else process.env.SHELL = env.SHELL
+  Shell.preferred.reset()
+  Shell.acceptable.reset()
+  try {
+    fn()
+  } finally {
+    if (prevPath === undefined) delete process.env.PATH
+    else process.env.PATH = prevPath
```


*... and more files (showing first 5)*

## opencode Changes (4161695..2f36ffe)

### Commits

- 2f36ffe - sync release versions for v1.18.23 (opencode, 2026-08-25)
- 31c409a - update inference headers (Frank, 2026-08-25)
- d0ceaef - docs(console): prohibit abusive multi-account use (Dax Raad, 2026-08-24)
- 3ef72fe - fix(provider): route non-native Cloudflare AI Gateway providers via the REST API (#44828) (Charlie Gleason, 2026-08-24)
- 51070b6 - docs: clarify prompt data handling (#44854) (opencode-agent[bot], 2026-08-24)
- 18b4cb6 - docs(github): correct action token configuration (#44793) (Filip, 2026-08-25)
- 0561bac - add client header replacement (Frank, 2026-08-24)
- f4019ca - fix(github): support immutable OIDC subjects (#44776) (Filip, 2026-08-24)
- f8b4dd7 - fix(provider): send Anthropic's dashed native slug through the AI Gateway (#44281) (Charlie Gleason, 2026-08-24)
- 611cc73 - fix(opencode): send parent session header (#44752) (opencode-agent[bot], 2026-08-24)
- 7cde832 - update model parser (Frank, 2026-08-24)
- be15db5 - Revert "delay removing first month discount" (Frank, 2026-08-24)
- 55f9841 - sync release versions for v1.18.22 (opencode, 2026-08-24)
- 2a6be0a - chore: generate (opencode-agent[bot], 2026-08-24)
- 2a36236 - fix(opencode): normalize upgrade endpoint (#44686) (Dax, 2026-08-24)
- 105b398 - docs(acp): update Zed custom agent config (#44658) (opencode-agent[bot], 2026-08-24)
- 9fa27bd - chore: generate (opencode-agent[bot], 2026-08-24)
- 6bb7722 - docs(go): add LongCat-2.0 (#44636) (Jack, 2026-08-24)
- 0352100 - docs(go): clarify DeepSeek weekend pricing (#44637) (Jack, 2026-08-24)
- 754bb7e - delay removing first month discount (Frank, 2026-08-24)
- 4371298 - fix(console): discontinue first-month Go discount (#44633) (Frank, 2026-08-24)
- 3f2e0e8 - chore: generate (opencode-agent[bot], 2026-08-24)
- 4dbeedd - discontinue first month discount (Frank, 2026-08-24)

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
- `packages/console/core/src/billing.ts` (+0, -1)
- `packages/core/package.json` (+1, -1)
- `packages/stats/core/package.json` (+1, -1)

#### Other Changes
- `bun.lock` (+28, -28)
- `packages/app/package.json` (+1, -1)
- `packages/cli/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/i18n/ar.ts` (+11, -14)
- `packages/console/app/src/i18n/br.ts` (+11, -13)
- `packages/console/app/src/i18n/da.ts` (+11, -14)
- `packages/console/app/src/i18n/de.ts` (+11, -14)
- `packages/console/app/src/i18n/en.ts` (+11, -13)
- `packages/console/app/src/i18n/es.ts` (+11, -12)
- `packages/console/app/src/i18n/fr.ts` (+11, -13)
- `packages/console/app/src/i18n/it.ts` (+11, -12)
- `packages/console/app/src/i18n/ja.ts` (+11, -12)
- `packages/console/app/src/i18n/ko.ts` (+11, -13)
- `packages/console/app/src/i18n/no.ts` (+11, -14)
- `packages/console/app/src/i18n/pl.ts` (+11, -13)
- `packages/console/app/src/i18n/ru.ts` (+11, -13)
- `packages/console/app/src/i18n/th.ts` (+11, -12)
- `packages/console/app/src/i18n/tr.ts` (+11, -14)
- `packages/console/app/src/i18n/uk.ts` (+11, -14)
- `packages/console/app/src/i18n/zh.ts` (+11, -12)
- `packages/console/app/src/i18n/zht.ts` (+11, -12)
- `packages/console/app/src/routes/go/index.tsx` (+3, -7)
- `packages/console/app/src/routes/legal/privacy-policy/index.tsx` (+2, -3)
- `packages/console/app/src/routes/legal/terms-of-service/index.tsx` (+6, -1)
- `packages/console/app/src/routes/workspace/[id]/go/lite-section.tsx` (+1, -0)
- `packages/console/app/src/routes/zen/util/handler.ts` (+7, -4)
- `packages/console/app/src/routes/zen/util/requestBody.ts` (+63, -17)
- `packages/console/app/test/requestBody.test.ts` (+15, -0)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/mail/package.json` (+1, -1)
- `packages/console/support/package.json` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/enterprise/package.json` (+1, -1)
- `packages/function/package.json` (+4, -1)
- `packages/function/src/api.ts` (+26, -26)
- `packages/function/src/github.ts` (+14, -0)
- `packages/function/test/github.test.ts` (+39, -0)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/cli/cmd/github.handler.ts` (+12, -5)
- `packages/opencode/src/provider/provider.ts` (+23, -3)
- `packages/opencode/src/server/routes/instance/httpapi/groups/global.ts` (+7, -4)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/global.ts` (+13, -43)
- `packages/opencode/src/session/llm/request.ts` (+1, -1)
- `packages/opencode/src/session/retry.ts` (+1, -1)
- `packages/opencode/test/provider/cf-ai-gateway-e2e.test.ts` (+13, -1)
- `packages/opencode/test/server/httpapi-global.test.ts` (+29, -5)
- `packages/opencode/test/session/llm.test.ts` (+69, -0)
- `packages/opencode/test/session/retry.test.ts` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+1, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+1, -1)
- `packages/sdk/openapi.json` (+2, -1)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/server/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/i18n/am.ts` (+1, -1)
- `packages/ui/src/i18n/ar.ts` (+1, -1)
- `packages/ui/src/i18n/az.ts` (+1, -1)
- `packages/ui/src/i18n/bg.ts` (+1, -1)
- `packages/ui/src/i18n/bn.ts` (+1, -1)
- `packages/ui/src/i18n/br.ts` (+1, -1)
- `packages/ui/src/i18n/bs.ts` (+1, -1)
- `packages/ui/src/i18n/ca.ts` (+1, -1)
- `packages/ui/src/i18n/cs.ts` (+1, -1)
- `packages/ui/src/i18n/da.ts` (+1, -1)
- `packages/ui/src/i18n/de.ts` (+1, -1)
- `packages/ui/src/i18n/dv.ts` (+1, -1)
- `packages/ui/src/i18n/dz.ts` (+1, -1)
- `packages/ui/src/i18n/el.ts` (+1, -1)
- `packages/ui/src/i18n/en.ts` (+1, -1)
- `packages/ui/src/i18n/es.ts` (+1, -1)
- `packages/ui/src/i18n/et.ts` (+1, -1)
- `packages/ui/src/i18n/fa.ts` (+1, -1)
- `packages/ui/src/i18n/fi.ts` (+1, -1)
- `packages/ui/src/i18n/fo.ts` (+1, -1)
- `packages/ui/src/i18n/fr.ts` (+1, -1)
- `packages/ui/src/i18n/hi.ts` (+1, -1)
- `packages/ui/src/i18n/hr.ts` (+1, -1)
- `packages/ui/src/i18n/hu.ts` (+1, -1)
- `packages/ui/src/i18n/hy.ts` (+1, -1)
- `packages/ui/src/i18n/id.ts` (+1, -1)
- `packages/ui/src/i18n/is.ts` (+1, -1)
- `packages/ui/src/i18n/it.ts` (+1, -1)
- `packages/ui/src/i18n/ja.ts` (+1, -1)
- `packages/ui/src/i18n/ka.ts` (+1, -1)
- `packages/ui/src/i18n/km.ts` (+1, -1)
- `packages/ui/src/i18n/ko.ts` (+1, -1)
- `packages/ui/src/i18n/lo.ts` (+1, -1)
- `packages/ui/src/i18n/lt.ts` (+1, -1)
- `packages/ui/src/i18n/lv.ts` (+1, -1)
- `packages/ui/src/i18n/mk.ts` (+1, -1)
- `packages/ui/src/i18n/mn.ts` (+1, -1)
- `packages/ui/src/i18n/ms.ts` (+1, -1)
- `packages/ui/src/i18n/my.ts` (+1, -1)
- `packages/ui/src/i18n/ne.ts` (+1, -1)
- `packages/ui/src/i18n/nl.ts` (+1, -1)
- `packages/ui/src/i18n/no.ts` (+1, -1)
- `packages/ui/src/i18n/pa.ts` (+1, -1)
- `packages/ui/src/i18n/pl.ts` (+1, -1)
- `packages/ui/src/i18n/ro.ts` (+1, -1)
- `packages/ui/src/i18n/ru.ts` (+1, -1)
- `packages/ui/src/i18n/si.ts` (+1, -1)
- `packages/ui/src/i18n/sk.ts` (+1, -1)
- `packages/ui/src/i18n/sl.ts` (+1, -1)
- `packages/ui/src/i18n/sq.ts` (+1, -1)
- `packages/ui/src/i18n/sr.ts` (+1, -1)
- `packages/ui/src/i18n/sv.ts` (+1, -1)
- `packages/ui/src/i18n/tg.ts` (+1, -1)
- `packages/ui/src/i18n/th.ts` (+1, -1)
- `packages/ui/src/i18n/tk.ts` (+1, -1)
- `packages/ui/src/i18n/tr.ts` (+1, -1)
- `packages/ui/src/i18n/uk.ts` (+1, -1)
- `packages/ui/src/i18n/ur.ts` (+1, -1)
- `packages/ui/src/i18n/uz.ts` (+1, -1)
- `packages/ui/src/i18n/vi.ts` (+1, -1)
- `packages/ui/src/i18n/zh.ts` (+1, -1)
- `packages/ui/src/i18n/zht.ts` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/acp.mdx` (+4, -1)
- `packages/web/src/content/docs/ar/acp.mdx` (+4, -1)
- `packages/web/src/content/docs/ar/go.mdx` (+9, -3)
- `packages/web/src/content/docs/bs/acp.mdx` (+4, -1)
- `packages/web/src/content/docs/bs/go.mdx` (+9, -3)
- `packages/web/src/content/docs/da/acp.mdx` (+4, -1)
- `packages/web/src/content/docs/da/go.mdx` (+9, -3)
- `packages/web/src/content/docs/de/acp.mdx` (+4, -1)
- `packages/web/src/content/docs/de/go.mdx` (+9, -3)
- `packages/web/src/content/docs/es/acp.mdx` (+4, -1)
- `packages/web/src/content/docs/es/go.mdx` (+9, -3)
- `packages/web/src/content/docs/fr/acp.mdx` (+4, -1)
- `packages/web/src/content/docs/fr/go.mdx` (+9, -3)
- `packages/web/src/content/docs/github.mdx` (+21, -11)
- `packages/web/src/content/docs/go.mdx` (+9, -3)
- `packages/web/src/content/docs/it/acp.mdx` (+4, -1)
- `packages/web/src/content/docs/it/go.mdx` (+9, -3)
- `packages/web/src/content/docs/ja/acp.mdx` (+4, -1)
- `packages/web/src/content/docs/ja/go.mdx` (+9, -3)
- `packages/web/src/content/docs/ko/acp.mdx` (+4, -1)
- `packages/web/src/content/docs/ko/go.mdx` (+9, -3)
- `packages/web/src/content/docs/nb/acp.mdx` (+4, -1)
- `packages/web/src/content/docs/nb/go.mdx` (+9, -3)
- `packages/web/src/content/docs/pl/acp.mdx` (+4, -1)
- `packages/web/src/content/docs/pl/go.mdx` (+9, -3)
- `packages/web/src/content/docs/pt-br/acp.mdx` (+4, -1)
- `packages/web/src/content/docs/pt-br/go.mdx` (+9, -3)
- `packages/web/src/content/docs/ru/acp.mdx` (+4, -1)
- `packages/web/src/content/docs/ru/go.mdx` (+9, -3)
- `packages/web/src/content/docs/th/acp.mdx` (+4, -1)
- `packages/web/src/content/docs/th/go.mdx` (+9, -3)
- `packages/web/src/content/docs/tr/acp.mdx` (+4, -1)
- `packages/web/src/content/docs/tr/go.mdx` (+9, -3)
- `packages/web/src/content/docs/zh-cn/acp.mdx` (+4, -1)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+9, -3)
- `packages/web/src/content/docs/zh-tw/acp.mdx` (+4, -1)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+9, -3)
- `sdks/vscode/package.json` (+1, -1)
- `turbo.json` (+3, -0)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 61ae28b..78b0a05 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.18.21",
+  "version": "1.18.23",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/console/core/src/billing.ts
```diff
diff --git a/packages/console/core/src/billing.ts b/packages/console/core/src/billing.ts
index 879cd8c..adeabd9 100644
--- a/packages/console/core/src/billing.ts
+++ b/packages/console/core/src/billing.ts
@@ -328,7 +328,6 @@ export namespace Billing {
           return LiteData.threeMonths100Coupon
         if (coupons.some((coupon) => coupon.type === "GOFREEMONTH" && !coupon.timeRedeemed))
           return LiteData.firstMonth100Coupon
-        if (!coupons.some((coupon) => coupon.type === "GO1MONTH50")) return LiteData.firstMonth50Coupon
         return undefined
       })()
       const createSession = () =>
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 019f4b5..ba3653d 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.18.21",
+  "version": "1.18.23",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/stats/core/package.json
```diff
diff --git a/packages/stats/core/package.json b/packages/stats/core/package.json
index c88fccd..f4ab6c5 100644
--- a/packages/stats/core/package.json
+++ b/packages/stats/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/stats-core",
-  "version": "1.18.21",
+  "version": "1.18.23",
   "private": true,
   "type": "module",
   "license": "MIT",
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/src/kilocode/powershell.ts
- `src/core/` - review core changes from packages/core/src/kilocode/pty/smoke.ts
- `src/core/` - review core changes from packages/core/src/kilocode/pty/termination.ts
- `src/core/` - review core changes from packages/core/src/shell.ts
- `src/core/` - review core changes from packages/core/test/kilocode/powershell.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/pty-platform.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/pty-termination.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/agent-manager/orchestration-bridge.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/agent-manager/orchestration-domain.ts
- `src/core/` - review core changes from packages/kilo-vscode/tests/unit/agent-manager-orchestration-bridge.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/tests/unit/agent-manager-orchestration-domain.test.ts
- `src/permission/` - review permission changes from packages/opencode/src/kilocode/permission/agent-manager.ts
- `src/permission/` - review permission changes from packages/opencode/test/kilocode/permission/agent-manager-prompt.test.ts
- `src/tool/agent-manager.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager.ts changes
- `src/tool/agent-manager.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager.txt changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/tool/task.ts changes
