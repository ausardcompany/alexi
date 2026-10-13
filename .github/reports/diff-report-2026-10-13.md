# Upstream Changes Report
Generated: 2026-10-13 13:42:28

## Summary
- kilocode: 92 commits, 246 files changed
- opencode: 50 commits, 470 files changed

## kilocode Changes (3df806ae9..2a7edfedb)

### Commits

- 2a7edfedb - Merge pull request #15019 from Kilo-Org/feat/community-triage-slack-thread (Bruno Agatão, 2026-10-13)
- d21e1974a - Merge pull request #15024 from Kilo-Org/jetbrains/release/v7.1.10-rc.3 (Kirill Kalishev, 2026-10-13)
- d695d9861 - docs(jetbrains): edit changelog for v7.1.10-rc.3 (Kirill Kalishev, 2026-10-13)
- 89a5a0567 - release(jetbrains): v7.1.10-rc.3 (kilo-maintainer[bot], 2026-10-13)
- 27a9662b2 - Merge pull request #15012 from Kilo-Org/daring-anchor (Kirill Kalishev, 2026-10-13)
- 93940bad4 - fix: use webhook fallback unless both Slack token and channel are set (Bruno Agatao, 2026-10-13)
- ed58bb8ba - feat: thread community triage queue in Slack (Bruno Agatao, 2026-10-13)
- 3381603cd - Merge pull request #15006 from mixlayer/update-mixlayer-docs (Marius, 2026-10-13)
- 767b9580e - Merge pull request #14857 from mardausdennis/perf/windows-job-runner (Marius, 2026-10-13)
- 424e5d4d6 - Merge pull request #14988 from Kilo-Org/feat/glob-search-ignored (Andrea Giammarchi, 2026-10-13)
- bf714d4e1 - fix(jetbrains): keep RC builds on the production session database (kirillk, 2026-10-13)
- 7346371a3 - Merge pull request #15010 from Kilo-Org/jetbrains/release/v7.1.10-rc.2 (Kirill Kalishev, 2026-10-12)
- 2f89f4069 - docs(jetbrains): edit changelog for v7.1.10-rc.2 (Kirill Kalishev, 2026-10-12)
- 973229413 - release(jetbrains): v7.1.10-rc.2 (kilo-maintainer[bot], 2026-10-13)
- 7a42f3161 - Merge pull request #15009 from Kilo-Org/chore/jetbrains-cli-pin-v7.8.9 (Kirill Kalishev, 2026-10-12)
- a7eafa20d - chore(jetbrains): bump CLI pin to v7.8.9 (kilo-maintainer[bot], 2026-10-13)
- 207348551 - release: v7.8.9 (kilo-maintainer[bot], 2026-10-13)
- ca8ec18a1 - Merge pull request #14935 from Kilo-Org/rapid-orchid (Kirill Kalishev, 2026-10-12)
- 06c298565 - Merge remote-tracking branch 'origin/main' into rapid-orchid (kirillk, 2026-10-12)
- b12da628a - Merge pull request #14665 from Kilo-Org/humble-tundra (Kirill Kalishev, 2026-10-12)
- ae5d0dfe5 - fix(jetbrains): honor force when reapplying transcript display to tool cards (kirillk, 2026-10-12)
- b65aa7118 - test(jetbrains): tolerate scrollbar and font metrics in preview centering check (kirillk, 2026-10-12)
- cbc51f9e6 - docs(providers): refresh Mixlayer models and model-list note (Cathryn Lavery, 2026-10-12)
- 8cdb575ee - test(jetbrains): make transcript preview centering check font-independent (kirillk, 2026-10-12)
- f786acfd9 - test(jetbrains): assert the tooltip teardown, not the replace path (kirillk, 2026-10-12)
- 41b8bdfd1 - feat(jetbrains): localize transcript settings and add live preview (kirillk, 2026-10-12)
- 6135bb3e4 - fix(jetbrains): dismiss the timeline tooltip explicitly (kirillk, 2026-10-12)
- 7888fa491 - fix(jetbrains): size the prompt navigator to its rows and mark the prompt (kirillk, 2026-10-12)
- f03f41e3d - Merge commit 'c9a0e136eb628e2155330ea1a19ead7765681d73' into perf/windows-job-runner-stop (mardausdennis, 2026-10-12)
- c9a0e136e - test(cli): check the runner outcome independently of manager exit ordering (mardausdennis, 2026-10-12)
- d67bc01de - fix(jetbrains): mark the clicked timeline step in the gutter (kirillk, 2026-10-12)
- 2668d9331 - feat(cli): let glob search an opt-in allowlist of ignored paths (webreflection, 2026-10-12)
- 2f7b57fe2 - Merge pull request #15002 from Kilo-Org/breezy-falcon (Kirill Kalishev, 2026-10-12)
- 2aad321e4 - Merge pull request #14968 from Kilo-Org/clever-walrus (Kirill Kalishev, 2026-10-12)
- 39467bfb5 - Merge pull request #14940 from Kilo-Org/electric-willow (Kirill Kalishev, 2026-10-12)
- 7ff779a8a - Merge pull request #14970 from Kilo-Org/calm-fjord (Kirill Kalishev, 2026-10-12)
- fa03a40d1 - Merge pull request #14966 from Kilo-Org/gentle-sparrow (Kirill Kalishev, 2026-10-12)
- 2f57b6a87 - Merge pull request #14967 from Kilo-Org/spry-ferret (Kirill Kalishev, 2026-10-12)
- df814309e - feat(jetbrains): reuse the Core submenu in the prompt menu (kirillk, 2026-10-12)
- 6179b71dc - Merge remote-tracking branch 'origin/main' into rapid-orchid (kirillk, 2026-10-12)
- 05bc9e15f - Merge pull request #14946 from Kilo-Org/docs/auto-sync/cloud-mobile (Igor Šćekić, 2026-10-12)
- c9f255775 - merge: name surviving leaders and allow loaded native-job test waits (mardausdennis, 2026-10-12)
- fde423437 - fix(cli): name a surviving leader in the unconfirmed stop warning (mardausdennis, 2026-10-12)
- ff39411ca - Merge commit 'eea3369369' into perf/windows-job-runner-stop (mardausdennis, 2026-10-12)
- eea336936 - docs(cli): describe the observable failed stop request (mardausdennis, 2026-10-12)
- 5e1ddd785 - merge: retain responsive Windows confirmation and verified-survivor diagnostics (mardausdennis, 2026-10-12)
- da3de5dfa - docs(cli): describe Windows background-job improvements for end users (mardausdennis, 2026-10-12)
- 995a66ca2 - fix(cli): keep stop responsive during Windows exit confirmation (mardausdennis, 2026-10-12)
- 0220d0e02 - test(cli): await persistent cleanup interception in the stacked runner proof (mardausdennis, 2026-10-12)
- 9a55ea4f0 - feat(cli): opt-in includeIgnored param for glob tool behind experimental config (webreflection, 2026-10-12)
- f853bb022 - merge: bring the non-vacuous stop outcome test into Windows job tracking (mardausdennis, 2026-10-12)
- 607945000 - fix(cli): share persistent artifact cleanup across stop and process exit (mardausdennis, 2026-10-12)
- 63a9aac07 - test(cli): assert the runner exit without shadowing the Node process (mardausdennis, 2026-10-12)
- 4e4a3b5c8 - merge: include bounded post-exit confirmation from the stale-parent runner (mardausdennis, 2026-10-12)
- 181e74f93 - test(cli): prove concurrent persistent cleanup runs once (mardausdennis, 2026-10-12)
- e97fd7192 - fix(cli): confirm descendants after the leader exits within a bounded window (mardausdennis, 2026-10-12)
- 6dcbce38f - merge: retain verified stop retries from the final stale-parent fix (mardausdennis, 2026-10-12)
- 9687f79b3 - fix(cli): keep Windows stop requests until a trustworthy walk confirms exit (mardausdennis, 2026-10-12)
- 79488ac26 - merge: stack Windows job tracking on the birth-checked runner stop (mardausdennis, 2026-10-12)
- 249be232b - fix(cli): let rollback wait for the persistent runner stop window (mardausdennis, 2026-10-12)
- d5167e54c - fix(cli): stop Windows runner descendants without unchecked tree traversal (mardausdennis, 2026-10-12)
- 81c69a88e - fix(cli): wait for a terminating runner when stopping a persistent process on Windows (mardausdennis, 2026-10-12)
- f7533756c - test(jetbrains): cover surviving rows after a failed agent re-read (kirillk, 2026-10-11)
- adc200702 - fix(jetbrains): pin the agent model cell and keep rows after apply (kirillk, 2026-10-11)
- a021bc0af - fix(cli): wrap the pinned test client in a kilocode_change block (kirillk, 2026-10-10)
- e868b0bbf - fix(cli): annotate the pinned test client on the changed line (kirillk, 2026-10-10)
- f5d415da3 - fix(jetbrains): check the current model for an id-only override (kirillk, 2026-10-10)
- 296b9de6e - fix(jetbrains): stop overriding user permission config (kirillk, 2026-10-10)
- cf6497731 - Merge origin/main into rapid-orchid (kirillk, 2026-10-10)
- 3933e3f89 - fix(jetbrains): make the model reset forget the saved per-mode pick (kirillk, 2026-10-10)
- fa11d1ef9 - feat(jetbrains): outline the turn a timeline jump lands on (kirillk, 2026-10-10)
- 1991d3da3 - fix(jetbrains): restore session lists after a CLI reconnect (kirillk, 2026-10-10)
- 856b01616 - feat(jetbrains): show and edit agent models from the agents list (kirillk, 2026-10-10)
- bef8d9d28 - Merge remote-tracking branch 'origin/main' into HEAD (github-actions[bot], 2026-10-10)
- fdc47f7da - Merge remote-tracking branch 'origin/main' into humble-tundra (kirillk, 2026-10-09)
- a5ee12895 - fix(cli): read the leader's exit after each Windows process query (mardausdennis, 2026-10-09)
- cd39faa18 - fix(cli): read the leader's exit after each Windows process query (mardausdennis, 2026-10-09)
- f3c8acba9 - docs: sync cloud-mobile with merged PRs (2026-10-09) (github-actions[bot], 2026-10-09)
- cd907bcbf - fix(cli): keep Windows background runners on their job when a job call fails (mardausdennis, 2026-10-08)
- d82a02710 - fix(jetbrains): scope the MCP sign-in abandon marker to its attempt (kirillk, 2026-10-08)
- 745fdb72e - fix(jetbrains): clear MCP sign-in state when the server is removed (kirillk, 2026-10-08)
- a7d0b5055 - fix(jetbrains): jump to a step when its timeline bar is clicked (kirillk, 2026-10-08)
- d285bd8ba - fix(cli): only treat a Windows fallback command as done after a successful process walk (mardausdennis, 2026-10-06)
- b332eb641 - fix(cli): keep guarding Windows background processes when a stop cannot finish (mardausdennis, 2026-10-06)
- 37f81b109 - fix(cli): track Windows background processes with a job object instead of polling PowerShell (mardausdennis, 2026-10-06)
- 9ed39ef78 - fix(cli): stop Windows background runner from adopting unrelated processes (mardausdennis, 2026-10-06)
- 5e99e9c62 - fix(cli): stop Windows background runner from adopting unrelated processes (mardausdennis, 2026-10-04)
- 0ee738738 - fix(jetbrains): resync reasoning chevron on live display change (kirillk, 2026-09-30)
- 7e05afc2d - Merge remote-tracking branch 'origin/main' into humble-tundra (kirillk, 2026-09-30)
- 17f142cfa - feat(jetbrains): apply transcript display changes live (kirillk, 2026-09-30)
- f1da3d68d - refactor(jetbrains): unify reasoning expansion rule (kirillk, 2026-09-29)
- 644326e22 - feat(jetbrains): add transcript display settings (kirillk, 2026-09-29)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt` (+30, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt` (+30, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolView.kt` (+29, -2)
- `packages/opencode/src/kilocode/tool/glob-ignored.ts` (+98, -0)
- `packages/opencode/src/tool/glob.ts` (+6, -1)
- `packages/opencode/test/kilocode/tool/glob-ignored.test.ts` (+184, -0)
- `packages/opencode/test/tool/glob.test.ts` (+2, -0)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/kilocode/agent/index.ts` (+4, -0)
- `packages/opencode/test/agent/agent.test.ts` (+5, -0)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/ripgrep.ts` (+2, -0)
- `packages/core/src/v1/config/config.ts` (+4, -0)

#### Other Changes
- `.changeset/agent-manager-project-reorder.md` (+0, -5)
- `.changeset/agent-session-explicit-intent.md` (+0, -5)
- `.changeset/align-spinner-identicon-grid.md` (+0, -5)
- `.changeset/bedrock-tool-result-images.md` (+0, -5)
- `.changeset/board-in-session-dock.md` (+0, -5)
- `.changeset/browser-ide-theme.md` (+0, -5)
- `.changeset/browser-shift-click-external.md` (+0, -5)
- `.changeset/cloud-session-shell-tmp.md` (+0, -5)
- `.changeset/command-frontmatter-instance.md` (+0, -5)
- `.changeset/config-overlay-shadowed-error.md` (+0, -5)
- `.changeset/conn-reset-normal-retry.md` (+0, -5)
- `.changeset/custom-zai-thinking.md` (+0, -5)
- `.changeset/fix-compaction-terminal-errors.md` (+0, -5)
- `.changeset/fix-permission-unknown-route.md` (+0, -5)
- `.changeset/fix-vscode-drive-root-startup.md` (+0, -5)
- `.changeset/fix-windows-arm64-error.md` (+0, -5)
- `.changeset/glob-search-ignored.md` (+6, -0)
- `.changeset/goal-command-alias.md` (+0, -5)
- `.changeset/jetbrains-mcp-oauth-sign-in.md` (+0, -5)
- `.changeset/jetbrains-prompt-navigator.md` (+0, -5)
- `.changeset/jetbrains-shared-session-db.md` (+5, -0)
- `.changeset/jetbrains-timeline-navigation.md` (+0, -5)
- `.changeset/jetbrains-worktree-pr-badge-after-agent-stops.md` (+0, -5)
- `.changeset/kilocode-message-diagnostics.md` (+0, -5)
- `.changeset/mcp-interrupted-startup.md` (+0, -5)
- `.changeset/native-browser-feedback.md` (+0, -5)
- `.changeset/open-browser-external.md` (+0, -5)
- `.changeset/openai-compatible-dimension-fallback.md` (+0, -5)
- `.changeset/pr-panel-open-browser-icon.md` (+0, -5)
- `.changeset/reserved-command-name-clash.md` (+0, -5)
- `.changeset/scheduled-prompt-label.md` (+0, -5)
- `.changeset/segmented-prompt-selectors.md` (+0, -5)
- `.changeset/serve-shutdown-deadline.md` (+0, -5)
- `.changeset/single-load-payload-prune.md` (+0, -5)
- `.changeset/sticky-diff-header-leak.md` (+0, -5)
- `.changeset/subagent-open-tooltip.md` (+0, -5)
- `.changeset/svg-attachment-prompt-loss.md` (+0, -6)
- `.changeset/task-bare-model-name.md` (+0, -5)
- `.changeset/tui-permission-eviction.md` (+0, -4)
- `.changeset/windows-bgp-job-object.md` (+5, -0)
- `.changeset/windows-bgp-runner-stale-parent.md` (+5, -0)
- `.github/workflows/community-sweep.yml` (+8, -1)
- `.kilo/skills/jetbrains-arch/SKILL.md` (+1, -1)
- `artifacts/glm52-rise-video/package.json` (+1, -1)
- `bun.lock` (+33, -33)
- `docs/community-triage.md` (+4, -2)
- `package.json` (+1, -1)
- `packages/client/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/httpapi-codegen/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/ai-providers/mixlayer.md` (+9, -7)
- `packages/kilo-docs/pages/code-with-ai/platforms/mobile.md` (+1, -1)
- `packages/kilo-docs/pages/getting-started/settings/auto-approving-actions.md` (+2, -0)
- `packages/kilo-docs/pages/getting-started/settings/index.md` (+1, -0)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/CHANGELOG.md` (+81, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendModelStateManager.kt` (+8, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloBackendCliManager.kt` (+12, -5)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloAppRpcApiImpl.kt` (+5, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendModelStateManagerTest.kt` (+32, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/KiloBackendCliManagerEnvTest.kt` (+43, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorKind.kt` (+7, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionListController.kt` (+20, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloAgentBehaviorService.kt` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloAppService.kt` (+13, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloMcpAuthService.kt` (+101, -29)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/plugin/KiloPluginSettings.kt` (+86, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionSidePanelManager.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+59, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionController.kt` (+36, -6)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionControllerEvent.kt` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/history/HistoryController.kt` (+21, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/Message.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/SessionModel.kt` (+25, -7)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/scroll/SessionScroll.kt` (+103, -15)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/settings/TranscriptDisplay.kt` (+36, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/settings/TranscriptDisplayListener.kt` (+26, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionHighlightOverlay.kt` (+137, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanel.kt` (+16, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/empty/EmptySessionPanel.kt` (+22, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/empty/RecentsList.kt` (+4, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/SessionHeaderPanel.kt` (+13, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/TimelinePanel.kt` (+82, -17)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/model/ModelPicker.kt` (+11, -64)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/model/ModelPopup.kt` (+109, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/popup/HeaderPopupController.kt` (+9, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/PromptPanel.kt` (+5, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/rail/PromptRailController.kt` (+14, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/rail/PromptRailPopup.kt` (+7, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/style/SessionUiStyle.kt` (+12, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/MessageView.kt` (+22, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/ReasoningView.kt` (+59, -13)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/base/AbstractSessionPartView.kt` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/KiloSettingsConfigurable.kt` (+9, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/AgentEditDialog.kt` (+7, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/AgentsConfigurable.kt` (+94, -30)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/McpConfigurable.kt` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/autoapprove/AutoApproveContent.kt` (+0, -15)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/autoapprove/AutoApproveSettingsState.kt` (+5, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsListPanel.kt` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/marketplace/MarketplaceSettingsUi.kt` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/transcript/TranscriptConfigurable.kt` (+41, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/transcript/TranscriptPreview.kt` (+259, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/transcript/TranscriptSettingsUi.kt` (+179, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveList.kt` (+17, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListView.kt` (+49, -6)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/picker/PickerPopup.kt` (+20, -5)
- `packages/kilo-jetbrains/frontend/src/main/resources/kilo.jetbrains.frontend.xml` (+16, -6)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+24, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ar.properties` (+24, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_bs.properties` (+24, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_da.properties` (+24, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_de.properties` (+24, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_es.properties` (+24, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_fr.properties` (+24, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ja.properties` (+24, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ko.properties` (+24, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_nl.properties` (+24, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_no.properties` (+24, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pl.properties` (+24, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pt_BR.properties` (+24, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ru.properties` (+24, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_th.properties` (+24, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_tr.properties` (+24, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_uk.properties` (+24, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_CN.properties` (+24, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_TW.properties` (+24, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/SessionContextMenuActionsTest.kt` (+23, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionListControllerTest.kt` (+20, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/app/KiloMcpAuthServiceTest.kt` (+146, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/PromptRailLayoutTest.kt` (+34, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionHighlightOverlayTest.kt` (+348, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionScrollPartTest.kt` (+258, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionScrollTest.kt` (+13, -58)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/ConfigSelectionTest.kt` (+87, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/ViewSwitchingTest.kt` (+49, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/WorkspaceWatchingTest.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/history/HistoryControllerTest.kt` (+24, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/model/SessionModelTest.kt` (+35, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/EmptySessionPanelTest.kt` (+30, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/PromptPanelTest.kt` (+37, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/header/SessionHeaderPanelTest.kt` (+221, -36)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/model/ModelPopupTest.kt` (+91, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/popup/HeaderPopupControllerTest.kt` (+24, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/rail/PromptRailPopupTest.kt` (+45, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/EditToolViewTest.kt` (+71, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ReasoningViewStressTest.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ReasoningViewTest.kt` (+217, -87)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ShellToolViewTest.kt` (+90, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ToolViewTest.kt` (+69, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/base/AbstractSessionPartViewTest.kt` (+20, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/KiloSettingsConfigurableTest.kt` (+6, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/AgentsSettingsUiTest.kt` (+268, -14)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/McpSettingsUiTest.kt` (+33, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/autoapprove/AutoApproveSettingsStateTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/marketplace/MarketplaceSettingsUiTest.kt` (+49, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/transcript/TranscriptConfigurableTest.kt` (+266, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/transcript/TranscriptPreviewTest.kt` (+309, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeAgentBehaviorRpcApi.kt` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeAppRpcApi.kt` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/list/ActiveListAnchorTest.kt` (+13, -0)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloAppRpcApi.kt` (+8, -0)
- `packages/kilo-memory/package.json` (+1, -1)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-vscode/CHANGELOG.md` (+42, -0)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/components/settings/ContextTab.tsx` (+8, -82)
- `packages/kilo-vscode/webview-ui/src/components/settings/ExperimentalTab.tsx` (+14, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/PatternList.tsx` (+93, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/config.ts` (+1, -0)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+46, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/kilocode/background-process/index.ts` (+41, -9)
- `packages/opencode/src/kilocode/background-process/runner.ts` (+213, -34)
- `packages/opencode/src/kilocode/background-process/windows.ts` (+145, -0)
- `packages/opencode/test/kilocode/agent-client-defaults.test.ts` (+45, -0)
- `packages/opencode/test/kilocode/background-process-runner.test.ts` (+841, -0)
- `packages/opencode/test/kilocode/background-process-windows-handoff.test.ts` (+51, -0)
- `packages/opencode/test/kilocode/background-process-windows.test.ts` (+167, -0)
- `packages/opencode/test/kilocode/background-process.test.ts` (+398, -3)
- `packages/opencode/test/kilocode/fixtures/background-process-job.ts` (+144, -0)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/protocol/package.json` (+1, -1)
- `packages/schema/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk-next/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+20, -4)
- `packages/sdk/openapi.json` (+6, -0)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/storybook/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `script/kilocode/community-triage.test.ts` (+49, -0)
- `script/kilocode/community-triage.ts` (+80, -39)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 248b52127..84d3ae3b5 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.8.8",
+  "version": "7.8.9",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/ripgrep.ts
```diff
diff --git a/packages/core/src/ripgrep.ts b/packages/core/src/ripgrep.ts
index 20d35479f..a5c6ea67b 100644
--- a/packages/core/src/ripgrep.ts
+++ b/packages/core/src/ripgrep.ts
@@ -70,6 +70,7 @@ export interface GlobInput {
   readonly signal?: AbortSignal
   readonly validate?: Effect.Effect<void, unknown> // kilocode_change - bind approved searches at spawn
   readonly noRequireGit?: boolean // kilocode_change - honor ignore files outside a git repository
+  readonly include?: readonly string[] // kilocode_change - additional whitelist globs
   readonly exclude?: readonly string[] // kilocode_change - additional exclusion globs
 }
 
@@ -223,6 +224,7 @@ const layer = Layer.effect(
             ...(input.follow ? ["--follow"] : []),
             ...(input.noRequireGit ? ["--no-require-git"] : []), // kilocode_change
             `--glob=${input.pattern}`,
+            ...(input.include ?? []).map((glob) => `--glob=${glob}`), // kilocode_change
             ...(input.exclude ?? []).map((glob) => `--glob=!${glob}`), // kilocode_change
             "--glob=!**/.git/**",
             ".",
```

#### packages/core/src/v1/config/config.ts
```diff
diff --git a/packages/core/src/v1/config/config.ts b/packages/core/src/v1/config/config.ts
index c47baacbd..af9ae28a3 100644
--- a/packages/core/src/v1/config/config.ts
+++ b/packages/core/src/v1/config/config.ts
@@ -331,6 +331,10 @@ export const Info = Schema.Struct({
       native_notebook_tools: Schema.optional(Schema.Boolean).annotate({
         description: "Enable native tools for reading, editing, and executing VS Code notebooks",
       }),
+      glob_include_ignored: Schema.optional(Schema.mutable(Schema.Array(Schema.String))).annotate({
+        description:
+          "Folders or files, as gitignore-style patterns relative to the workspace root, that the glob tool should search even when they are ignored (for example by .gitignore) or hidden. Patterns without a slash match folders at any depth; list a file inside an ignored folder by its path (for example build/report.json). Ignored or hidden folders nested inside a listed folder stay skipped.",
+      }),
       code_mode: Schema.optional(Schema.Boolean).annotate({
         description:
           "Route MCP tool calls through a confined JavaScript runtime with on-demand tool discovery instead of exposing every MCP tool directly",
```

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt
index bfce0ea25..b76c493c6 100644
--- a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt
@@ -2,11 +2,15 @@ package ai.kilocode.client.session.views.tool
 
 import ai.kilocode.client.diff.DiffLineNumbers
 import ai.kilocode.client.plugin.KiloBundle
+import ai.kilocode.client.plugin.KiloPluginSettings
 import ai.kilocode.client.session.SessionDiffOpener
 import ai.kilocode.client.session.SessionFileOpener
 import ai.kilocode.client.session.model.Content
 import ai.kilocode.client.session.model.Tool
 import ai.kilocode.client.session.model.ToolKind
+import ai.kilocode.client.session.settings.BlockDisplay
+import ai.kilocode.client.session.settings.TranscriptDisplay
+import ai.kilocode.client.session.settings.TranscriptDisplayTarget
 import ai.kilocode.client.session.ui.popup.HeaderPopupBody
 import ai.kilocode.client.session.ui.popup.HeaderPopupRequest
 import ai.kilocode.client.session.ui.selection.SessionCopyTarget
@@ -45,7 +49,9 @@ class EditToolView(
     private val parts: ToolParts = toolParts(tool, openFile),
     private var body: EditBody = editBody(tool, selection, openFile),
     private val footer: ToolApprovalFooter = ToolApprovalFooter(),
-) : AbstractSessionPartView(parts.header, { body.mount(tool) }, { footer }), UiDataProvider, SessionCopyTarget, ApprovalReasonTarget {
+    private var display: BlockDisplay = KiloPluginSettings.getCodeEditDisplay(),
+) : AbstractSessionPartView(parts.header, { body.mount(tool) }, { footer }), UiDataProvider, SessionCopyTarget,
+    ApprovalReasonTarget, TranscriptDisplayTarget {
 
     override val contentId: String = tool.id
 
@@ -55,6 +61,7 @@ class EditToolView(
     private var opener: SessionDiffOpener = { _, _, _ -> }
     private var sessionId: String? = null
     private var canDiff = false
+
     private val badge = DiffStatBadge(0, 0)
     private val open = HeaderOpenAction(SessionViewIcons.openDiff, KiloBundle.message("session.part.tool.openDiff"), ::openDiffViewer)
     private val filesTag = PlainLabel().apply {
@@ -218,10 +225,17 @@ class EditToolView(
     private fun expandable(): Boolean =
         editDiff(item).isNotBlank() || output(item).isNotBlank() || !item.error.isNullOrBlank()
 
-    private fun sync(): Boolean {
+    private fun sync(force: Boolean = false): Boolean {
         val expand = expandable()
         var changed = false
         changed = syncExpandable(expand) || changed
+        if (force || !touched) {
+            changed = if (display == BlockDisplay.EXPANDED && expand) {
```

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt
index 110a6e1a0..3aee643e1 100644
--- a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt
@@ -1,7 +1,11 @@
 package ai.kilocode.client.session.views.tool
 
+import ai.kilocode.client.plugin.KiloPluginSettings
 import ai.kilocode.client.session.model.Content
 import ai.kilocode.client.session.model.Tool
+import ai.kilocode.client.session.settings.BlockDisplay
+import ai.kilocode.client.session.settings.TranscriptDisplay
+import ai.kilocode.client.session.settings.TranscriptDisplayTarget
 import ai.kilocode.client.session.ui.SessionContentPanel
 import ai.kilocode.client.session.ui.SessionSurfacePanel
 import ai.kilocode.client.session.ui.popup.HeaderPopupBody
@@ -37,7 +41,9 @@ class ShellToolView(
     private val parts: ToolParts = toolParts(tool),
     private val body: ShellBody = ShellBody(selection),
     private val footer: ToolApprovalFooter = ToolApprovalFooter(),
-) : AbstractSessionPartView(parts.header, { body.mount(tool) }, { footer }), UiDataProvider, ApprovalReasonTarget {
+    private var display: BlockDisplay = KiloPluginSettings.getTerminalCommandDisplay(),
+) : AbstractSessionPartView(parts.header, { body.mount(tool) }, { footer }), UiDataProvider, ApprovalReasonTarget,
+    TranscriptDisplayTarget {
 
     override val contentId: String = tool.id
 
@@ -170,10 +176,17 @@ class ShellToolView(
         return changed
     }
 
-    private fun sync(): Boolean {
+    private fun sync(force: Boolean = false): Boolean {
         val expand = canExpand(item)
         var changed = false
         changed = syncExpandable(expand) || changed
+        if (force || !touched) {
+            changed = if (display == BlockDisplay.EXPANDED && expand) {
+                expand() || changed
+            } else {
+                collapse() || changed
+            }
+        }
         changed = setVisible(parts.state, !expand) || changed
         changed = setIcon(parts.glyph, icon(item)) || changed
         changed = setForeground(parts.glyph, color(item)) || changed
@@ -187,6 +200,21 @@ class ShellToolView(
         return changed
     }
 
```


*... and more files (showing first 5)*

## opencode Changes (e41e7e90..1015cb67)

### Commits

- 1015cb67 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-10-13)
- 65f89077 - chore(tui): upgrade OpenTUI to 0.6.2 (#55083) (Simon Klee, 2026-10-13)
- c1615b1d - refactor(console): call inference through a service binding (#55103) (Victor Navarro, 2026-10-13)
- 4ffede49 - chore(console): remove unused translation strings (#55093) (Victor Navarro, 2026-10-13)
- be674e31 - fix(app): stop project store eviction loop on launch (#55078) (Luke Parker, 2026-10-13)
- 5b22e915 - feat(desktop): clarify variant-only timeline notices (#54880) (usrnk1, 2026-10-13)
- c5aabae2 - sync release versions for v2.0.28 [skip ci] (opencode, 2026-10-13)
- 044d8b7d - feat(ai): continue split Gemini responses (Gemini transport) (#55056) (Aiden Cline, 2026-10-13)
- c7bddc38 - fix(session-ui): drop stale todowrite tool label (#53966) (opencode-agent[bot], 2026-10-13)
- 5a4dd5b4 - feat(plugin): bundle complete Figma skills (#55061) (Aiden Cline, 2026-10-13)
- 7e858f47 - fix(ui): return dialog focus from the stack, not from each caller (#55038) (Luke Parker, 2026-10-13)
- 417f120e - refactor(app): derive unread state from server viewed watermarks (#54780) (opencode-agent[bot], 2026-10-13)
- bf8c48de - fix(app): include subagent sessions in desktop session cost (#55052) (opencode-agent[bot], 2026-10-13)
- de65b9f9 - fix(console): keep Go limits chart headers from overflowing in long locales (#55054) (vprdev, 2026-10-12)
- 836c0e5e - feat(plugin): add figma plugin (#55049) (Aiden Cline, 2026-10-13)
- 9693c312 - test(app): end the Working geometry fixture at an idle marker (#55045) (Luke Parker, 2026-10-13)
- 48364310 - fix(storybook): declare @tanstack/solid-query for the pairing mock (#55047) (Luke Parker, 2026-10-13)
- b8f925e5 - feat(app): per-project auto-accept permissions overriding a default (#54839) (opencode-agent[bot], 2026-10-13)
- e65080dd - refactor(app): drop per-message model and agent from mobile session timeline (#54775) (opencode-agent[bot], 2026-10-13)
- d8129ca1 - fix(ai): raise default chunk timeout to fifteen minutes (#55032) (Aiden Cline, 2026-10-13)
- b4f19bfe - docs(www): add Cat Jam Free to Console models (#55029) (opencode-agent[bot], 2026-10-12)
- d7826750 - feat(plugin): expose credential.activate to server plugins (#52797) (Tommy D. Rossi, 2026-10-12)
- 06425d2b - fix(app): show Working above undelivered steers (#55023) (Luke Parker, 2026-10-13)
- 460c626a - fix(core): disable Bun's fetch idle timeout for provider requests (#55007) (Aiden Cline, 2026-10-12)
- 738f77e4 - fix(app): load images and audio in the review panel (#55015) (Luke Parker, 2026-10-13)
- ba82b370 - fix(core): discover system configuration directory at lowest precedence (#54921) (Aiden Cline, 2026-10-12)
- b4a57f68 - fix(console): redirect old zen and go docs from docs proxy (Frank, 2026-10-12)
- d7cfdaa3 - docs: redirect zen docs to console models (Frank, 2026-10-12)
- 15b24ae1 - fix(console): renew DeepSeek ZDR date on Go landing page through October 2026 (#54987) (opencode-agent[bot], 2026-10-12)
- 69a71426 - feat(core): configure Anthropic cache breakpoints with compatibility.cacheFormat (#54945) (Aiden Cline, 2026-10-12)
- 6a12383d - fix(desktop): update emulated x64 installs to native ARM64 (#54983) (Luke Parker, 2026-10-13)
- bd23808a - fix(tui): report x64 emulation on Windows ARM64 (#54984) (Luke Parker, 2026-10-13)
- 3731aace - fix(ci): fail releases that bundle native code for the wrong CPU (#54982) (Luke Parker, 2026-10-13)
- 126b7b63 - fix(core): extract ripgrep on Windows without PowerShell (#54981) (Luke Parker, 2026-10-13)
- f7ac58f2 - fix(desktop): stage the bundled CLI per architecture (#54979) (Luke Parker, 2026-10-13)
- 67f5c219 - fix(update): return 503 instead of 1101 when D1 is overloaded (#54920) (opencode-agent[bot], 2026-10-12)
- df63a72d - feat(console): offer the Windows ARM64 desktop download (#54971) (Luke Parker, 2026-10-12)
- 2bf145b9 - feat(tui): show release highlights after updating (#54969) (Dax, 2026-10-12)
- 5673bfa4 - feat(core): add request body encoding setting (#54932) (Aiden Cline, 2026-10-12)
- d46588fe - feat(cli): publish and upgrade official WinGet packages (#54808) (Filip, 2026-10-13)
- 039eb85b - fix(cli): install the native binary on Windows ARM64 (#54955) (Luke Parker, 2026-10-13)
- a22754f7 - fix(core): support provider-level compatibility and migrate setCacheKey (#54911) (Aiden Cline, 2026-10-12)
- 14380732 - fix(plugin): return Promise tool throws as tool failures (#54913) (Aiden Cline, 2026-10-12)
- 80fb31eb - fix(vscode): launch the V2 CLI without --port (#49084) (uyencss, 2026-10-12)
- 22326d4b - feat(changelog): serve /changelog from a standalone worker (#54906) (Dax, 2026-10-12)
- c57c448d - feat(console): render CHANGELOG.md on /changelog (#54902) (Dax, 2026-10-12)
- 1c74b9f0 - fix(tui): restrict command autocomplete to prompt start (#54857) (OpeOginni, 2026-10-12)
- 7bac892c - fix(core): stop listing Azure resources at startup (#54870) (Filip, 2026-10-12)
- 5683367e - fix(core): send unknown v1 openai-compatible model options in the request body (#54694) (Aiden Cline, 2026-10-12)
- 5b7bad23 - docs: point READMEs at @opencode/cli npm package (#54855) (opencode-agent[bot], 2026-10-12)

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
- `packages/core/package.json` (+1, -1)
- `packages/core/src/config.ts` (+38, -5)
- `packages/core/src/config/discovery.ts` (+62, -4)
- `packages/core/src/config/plugin/provider.ts` (+2, -0)
- `packages/core/src/config/watch.ts` (+2, -0)
- `packages/core/src/effect/app-node-platform.ts` (+15, -1)
- `packages/core/src/model-resolver.ts` (+5, -2)
- `packages/core/src/model.ts` (+4, -0)
- `packages/core/src/plugin/host.ts` (+3, -0)
- `packages/core/src/plugin/provider/azure.ts` (+2, -75)
- `packages/core/src/plugin/provider/chatgpt.ts` (+5, -0)
- `packages/core/src/plugin/provider/databricks.ts` (+9, -0)
- `packages/core/src/plugin/provider/openai.ts` (+5, -0)
- `packages/core/src/plugin/provider/prompt-cache-key.ts` (+6, -8)
- `packages/core/src/plugin/provider/snowflake-cortex.ts` (+3, -0)
- `packages/core/src/plugin/skill.ts` (+4, -1)
- `packages/core/src/provider.ts` (+17, -3)
- `packages/core/src/ripgrep/binary.ts` (+16, -24)
- `packages/core/src/session/model-request.ts` (+9, -7)
- `packages/core/src/v1/config/migrate.ts` (+15, -8)
- `packages/core/src/v1/config/provider-options.ts` (+27, -0)
- `packages/core/test/config/config.test.ts` (+115, -1)
- `packages/core/test/config/normalization.test.ts` (+17, -0)
- `packages/core/test/config/provider-options.test.ts` (+21, -0)
- `packages/core/test/config/provider.test.ts` (+163, -0)
- `packages/core/test/config/watch.test.ts` (+12, -2)
- `packages/core/test/plugin.test.ts` (+36, -0)
- `packages/core/test/plugin/host.ts` (+3, -0)
- `packages/core/test/plugin/promise-tool.test.ts` (+84, -1)
- `packages/core/test/plugin/provider-azure.test.ts` (+14, -45)
- `packages/core/test/plugin/provider-openai.test.ts` (+2, -0)
- `packages/core/test/plugin/provider-snowflake-cortex.test.ts` (+2, -0)
- `packages/core/test/session-runner.test.ts` (+13, -0)
- `packages/stats/core/package.json` (+1, -1)

#### Other Changes
- `.github/workflows/deploy-changelog.yml` (+40, -0)
- `.github/workflows/publish.yml` (+3, -0)
- `.oxlintrc.json` (+1, -0)
- `.prettierignore` (+1, -0)
- `CHANGELOG.md` (+75, -0)
- `README.ar.md` (+2, -2)
- `README.bn.md` (+2, -2)
- `README.br.md` (+2, -2)
- `README.bs.md` (+2, -2)
- `README.da.md` (+2, -2)
- `README.de.md` (+2, -2)
- `README.es.md` (+2, -2)
- `README.fr.md` (+2, -2)
- `README.gr.md` (+2, -2)
- `README.it.md` (+2, -2)
- `README.ja.md` (+2, -2)
- `README.ko.md` (+2, -2)
- `README.md` (+2, -2)
- `README.no.md` (+2, -2)
- `README.pl.md` (+2, -2)
- `README.ru.md` (+2, -2)
- `README.th.md` (+2, -2)
- `README.tr.md` (+2, -2)
- `README.uk.md` (+2, -2)
- `README.vi.md` (+2, -2)
- `README.zh.md` (+2, -2)
- `README.zht.md` (+2, -2)
- `bun.lock` (+372, -813)
- `bunfig.toml` (+1, -1)
- `infra/console.ts` (+6, -1)
- `install` (+9, -1)
- `nix/hashes.json` (+3, -3)
- `package.json` (+5, -5)
- `packages/ai/package.json` (+1, -1)
- `packages/ai/src/cache-policy.ts` (+15, -11)
- `packages/ai/src/protocols/gemini.ts` (+161, -21)
- `packages/ai/src/protocols/mistral-chat.ts` (+3, -1)
- `packages/ai/src/protocols/open-responses-channel.ts` (+6, -1)
- `packages/ai/src/protocols/openai-chat.ts` (+8, -2)
- `packages/ai/src/protocols/shared.ts` (+40, -5)
- `packages/ai/src/protocols/utils/responses-compaction.ts` (+6, -1)
- `packages/ai/src/providers/google-vertex.ts` (+1, -2)
- `packages/ai/src/route/transport/http.ts` (+5, -3)
- `packages/ai/src/schema/options.ts` (+32, -5)
- `packages/ai/test/http-timeout.test.ts` (+2, -2)
- `packages/ai/test/provider/gemini.test.ts` (+317, -3)
- `packages/ai/test/provider/google-vertex.test.ts` (+44, -0)
- `packages/ai/test/provider/mistral-chat.test.ts` (+11, -1)
- `packages/ai/test/provider/openai-compatible-chat.test.ts` (+37, -0)
- `packages/ai/test/provider/openai-responses.test.ts` (+18, -0)
- `packages/ai/test/provider/openrouter.test.ts` (+21, -1)
- `packages/ai/test/request-encoding.test.ts` (+57, -0)
- `packages/app/e2e/regression/composer.spec.ts` (+29, -0)
- `packages/app/e2e/regression/multi-server.spec.ts` (+81, -6)
- `packages/app/e2e/regression/review.spec.ts` (+12, -2)
- `packages/app/e2e/regression/session-queue.spec.ts` (+13, -0)
- `packages/app/e2e/regression/terminal-input.spec.ts` (+17, -0)
- `packages/app/e2e/regression/timeline-geometry.spec.ts` (+20, -8)
- `packages/app/e2e/utils/mock-server.ts` (+8, -2)
- `packages/app/package.json` (+1, -1)
- `packages/app/src/composer/commands.tsx` (+2, -23)
- `packages/app/src/home/projects/controller.tsx` (+3, -5)
- `packages/app/src/home/projects/region.tsx` (+1, -1)
- `packages/app/src/home/projects/view.tsx` (+4, -4)
- `packages/app/src/home/sessions/controller.tsx` (+2, -0)
- `packages/app/src/runtime/i18n/en.ts` (+11, -0)
- `packages/app/src/runtime/persistence/consumers.test.ts` (+0, -22)
- `packages/app/src/runtime/server/global-sync/child-store.ts` (+3, -1)
- `packages/app/src/session/commands/use-session-commands.tsx` (+35, -11)
- `packages/app/src/session/requests/auto-approve.ts` (+29, -11)
- `packages/app/src/session/requests/model.ts` (+7, -3)
- `packages/app/src/session/route.tsx` (+13, -5)
- `packages/app/src/session/timeline/controller-projection.test.ts` (+17, -4)
- `packages/app/src/session/timeline/controller-projection.ts` (+9, -1)
- `packages/app/src/session/timeline/message-timeline.tsx` (+47, -36)
- `packages/app/src/settings/about/about.tsx` (+2, -13)
- `packages/app/src/settings/about/notices/dialog.tsx` (+3, -3)
- `packages/app/src/settings/general/general.tsx` (+3, -3)
- `packages/app/src/settings/model.test.ts` (+3, -3)
- `packages/app/src/settings/model.tsx` (+42, -3)
- `packages/app/src/settings/search-catalog.ts` (+8, -1)
- `packages/app/src/settings/workspaces/project-options.tsx` (+5, -10)
- `packages/app/src/settings/workspaces/project.tsx` (+52, -1)
- `packages/app/src/shell/layout/project-avatar-state.ts` (+8, -3)
- `packages/app/src/shell/notifications/notification-alert.test.ts` (+0, -103)
- `packages/app/src/shell/notifications/notification.tsx` (+165, -263)
- `packages/app/test-browser/child-store-eviction.test.ts` (+112, -0)
- `packages/app/test-browser/server-notification-state.test.ts` (+295, -0)
- `packages/cli/dev/tui.ts` (+0, -1)
- `packages/cli/package.json` (+1, -1)
- `packages/cli/script/build-node.ts` (+5, -0)
- `packages/cli/script/build.ts` (+5, -0)
- `packages/cli/script/postinstall.mjs` (+16, -3)
- `packages/cli/src/commands/handlers/default.ts` (+2, -1)
- `packages/cli/src/services/retained-image.ts` (+2, -1)
- `packages/cli/src/services/update-preflight.tsx` (+6, -4)
- `packages/cli/src/services/updater.ts` (+83, -8)
- `packages/cli/src/ui/timeline.tsx` (+4, -3)
- `packages/cli/src/version.ts` (+19, -1)
- `packages/cli/test/retained-image.test.ts` (+13, -0)
- `packages/cli/test/updater-install.test.ts` (+65, -0)
- `packages/cli/vite.node.config.ts` (+2, -0)
- `packages/client/package.json` (+1, -1)
- `packages/client/src/promise/api.ts` (+1, -0)
- `packages/client/src/promise/generated/types.ts` (+40, -19)
- `packages/client/src/solid/data.ts` (+4, -1)
- `packages/client/test/solid-data.test.ts` (+65, -0)
- `packages/codemode/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/component/go-plan-chart.css` (+3, -3)
- `packages/console/app/src/component/go-plan-chart.tsx` (+1, -1)
- `packages/console/app/src/i18n/ar.ts` (+3, -458)
- `packages/console/app/src/i18n/br.ts` (+3, -463)
- `packages/console/app/src/i18n/da.ts` (+3, -460)
- `packages/console/app/src/i18n/de.ts` (+3, -462)
- `packages/console/app/src/i18n/en.ts` (+3, -463)
- `packages/console/app/src/i18n/es.ts` (+3, -463)
- `packages/console/app/src/i18n/fr.ts` (+3, -467)
- `packages/console/app/src/i18n/it.ts` (+3, -462)
- `packages/console/app/src/i18n/ja.ts` (+3, -464)
- `packages/console/app/src/i18n/ko.ts` (+3, -461)
- `packages/console/app/src/i18n/no.ts` (+3, -460)
- `packages/console/app/src/i18n/pl.ts` (+3, -461)
- `packages/console/app/src/i18n/ru.ts` (+3, -465)
- `packages/console/app/src/i18n/th.ts` (+3, -460)
- `packages/console/app/src/i18n/tr.ts` (+3, -462)
- `packages/console/app/src/i18n/uk.ts` (+3, -423)
- `packages/console/app/src/i18n/zh.ts` (+3, -448)
- `packages/console/app/src/i18n/zht.ts` (+3, -448)
- `packages/console/app/src/lib/inference-proxy.ts` (+5, -3)
- `packages/console/app/src/routes/docs/[...path].ts` (+5, -0)
- `packages/console/app/src/routes/download/[channel]/[platform].ts` (+2, -0)
- `packages/console/app/src/routes/download/index.tsx` (+23, -0)
- `packages/console/app/src/routes/download/types.ts` (+1, -1)
- `packages/console/function/package.json` (+1, -1)
- `packages/desktop/electron-builder.config.ts` (+24, -4)
- `packages/desktop/package.json` (+1, -1)
- `packages/desktop/src/main/service/cli-stages.ts` (+2, -2)
- `packages/desktop/src/main/service/desktop-cli.ts` (+3, -1)
- `packages/enterprise/package.json` (+1, -1)
- `packages/function/package.json` (+1, -1)
- `packages/gui-extensions/package.json` (+1, -1)
- `packages/gui-extensions/src/context/indicator.tsx` (+4, -7)
- `packages/gui-extensions/src/context/tab.tsx` (+2, -3)
- `packages/gui-extensions/src/review/mobile.tsx` (+1, -12)
- `packages/gui-extensions/src/review/model.ts` (+19, -0)
- `packages/gui-extensions/src/review/panel.tsx` (+3, -11)
- `packages/gui-extensions/src/ssh/dialog.stories.tsx` (+1, -1)
- `packages/gui-extensions/src/updater/platform.ts` (+16, -2)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/httpapi-codegen/package.json` (+1, -1)
- `packages/latex/package.json` (+1, -1)
- `packages/latex/src/markdown.test.ts` (+15, -7)
- `packages/merman/package.json` (+1, -1)
- `packages/merman/src/test/markdown.test.ts` (+28, -38)
- `packages/plugin-browser/package.json` (+1, -1)
- `packages/plugin/package.json` (+3, -3)
- `packages/plugin/src/effect/plugin.ts` (+2, -1)
- `packages/plugin/src/promise/adapter.ts` (+16, -5)
- `packages/plugin/src/promise/plugin.ts` (+2, -1)
- `packages/plugins/README.md` (+9, -0)
- `packages/plugins/figma/README.md` (+66, -0)
- `packages/plugins/figma/index.ts` (+40, -0)
- `packages/plugins/figma/package.json` (+40, -0)
- `packages/plugins/figma/script/sync-skills.ts` (+61, -0)
- `packages/plugins/figma/skills-source.json` (+20, -0)
- `packages/plugins/figma/skills/NOTICE.md` (+14, -0)
- `packages/plugins/figma/skills/figma-code-connect/SKILL.md` (+528, -0)
- `packages/plugins/figma/skills/figma-code-connect/references/advanced-patterns.md` (+286, -0)
- `packages/plugins/figma/skills/figma-code-connect/references/api.md` (+1014, -0)
- `packages/plugins/figma/skills/figma-create-new-file/SKILL.md` (+42, -0)
- `packages/plugins/figma/skills/figma-design-to-code/SKILL.md` (+28, -0)
- `packages/plugins/figma/skills/figma-generate-design/SKILL.md` (+466, -0)
- `packages/plugins/figma/skills/figma-generate-design/references/componentization.md` (+24, -0)
- `packages/plugins/figma/skills/figma-generate-design/references/discover-product-font.md` (+58, -0)
- `packages/plugins/figma/skills/figma-generate-diagram/SKILL.md` (+112, -0)
- `packages/plugins/figma/skills/figma-generate-diagram/references/architecture.md` (+229, -0)
- `packages/plugins/figma/skills/figma-generate-diagram/references/erd.md` (+329, -0)
- `packages/plugins/figma/skills/figma-generate-diagram/references/flowchart.md` (+407, -0)
- `packages/plugins/figma/skills/figma-generate-diagram/references/gantt.md` (+260, -0)
- `packages/plugins/figma/skills/figma-generate-diagram/references/sequence.md` (+264, -0)
- `packages/plugins/figma/skills/figma-generate-diagram/references/state.md` (+327, -0)
- `packages/plugins/figma/skills/figma-generate-diagram/references/workflow.md` (+130, -0)
- `packages/plugins/figma/skills/figma-generate-library/SKILL.md` (+342, -0)
- `packages/plugins/figma/skills/figma-generate-library/references/code-connect-setup.md` (+266, -0)
- `packages/plugins/figma/skills/figma-generate-library/references/component-creation.md` (+920, -0)
- `packages/plugins/figma/skills/figma-generate-library/references/discovery-phase.md` (+543, -0)
- `packages/plugins/figma/skills/figma-generate-library/references/documentation-creation.md` (+824, -0)
- `packages/plugins/figma/skills/figma-generate-library/references/error-recovery.md` (+364, -0)
- `packages/plugins/figma/skills/figma-generate-library/references/naming-conventions.md` (+527, -0)
- `packages/plugins/figma/skills/figma-generate-library/references/token-creation.md` (+846, -0)
- `packages/plugins/figma/skills/figma-generate-library/scripts/bindVariablesToComponent.js` (+119, -0)
- `packages/plugins/figma/skills/figma-generate-library/scripts/cleanupOrphans.js` (+93, -0)
- `packages/plugins/figma/skills/figma-generate-library/scripts/createComponentWithVariants.js` (+141, -0)
- `packages/plugins/figma/skills/figma-generate-library/scripts/createDocumentationPage.js` (+131, -0)
- `packages/plugins/figma/skills/figma-generate-library/scripts/createSemanticTokens.js` (+101, -0)
- `packages/plugins/figma/skills/figma-generate-library/scripts/createVariableCollection.js` (+39, -0)
- `packages/plugins/figma/skills/figma-generate-library/scripts/inspectFileStructure.js` (+120, -0)
- `packages/plugins/figma/skills/figma-generate-library/scripts/validateCreation.js` (+83, -0)
- `packages/plugins/figma/skills/figma-generative-plugins/SKILL.md` (+53, -0)
- `packages/plugins/figma/skills/figma-generative-plugins/references/authoring.md` (+246, -0)
- `packages/plugins/figma/skills/figma-implement-motion/SKILL.md` (+146, -0)
- `packages/plugins/figma/skills/figma-implement-motion/references/examples-and-anti-examples.md` (+222, -0)
- `packages/plugins/figma/skills/figma-implement-motion/references/framework-recommendations.md` (+64, -0)
- `packages/plugins/figma/skills/figma-implement-motion/references/gotchas.md` (+94, -0)
- `packages/plugins/figma/skills/figma-implement-motion/references/motion-lint-rules.md` (+33, -0)
- `packages/plugins/figma/skills/figma-implement-motion/references/svg-and-path-motion.md` (+144, -0)
- `packages/plugins/figma/skills/figma-implement-motion/references/unsupported-and-fallbacks.md` (+97, -0)
- `packages/plugins/figma/skills/figma-shaders/SKILL.md` (+56, -0)
- `packages/plugins/figma/skills/figma-shaders/references/authoring.md` (+248, -0)
- `packages/plugins/figma/skills/figma-swiftui/SKILL.md` (+36, -0)
- `packages/plugins/figma/skills/figma-swiftui/references/code-to-design.md` (+167, -0)
- `packages/plugins/figma/skills/figma-swiftui/references/design-to-code.md` (+273, -0)
- `packages/plugins/figma/skills/figma-use-figjam/SKILL.md` (+64, -0)
- `packages/plugins/figma/skills/figma-use-figjam/references/batch-modify.md` (+288, -0)
- `packages/plugins/figma/skills/figma-use-figjam/references/create-code-block.md` (+92, -0)
- `packages/plugins/figma/skills/figma-use-figjam/references/create-connector.md` (+332, -0)
- `packages/plugins/figma/skills/figma-use-figjam/references/create-label.md` (+294, -0)
- `packages/plugins/figma/skills/figma-use-figjam/references/create-section.md` (+181, -0)
- `packages/plugins/figma/skills/figma-use-figjam/references/create-shape-with-text.md` (+366, -0)
- `packages/plugins/figma/skills/figma-use-figjam/references/create-sticky.md` (+295, -0)
- `packages/plugins/figma/skills/figma-use-figjam/references/create-table.md` (+345, -0)
- `packages/plugins/figma/skills/figma-use-figjam/references/create-text.md` (+470, -0)
- `packages/plugins/figma/skills/figma-use-figjam/references/edit-text.md` (+367, -0)
- `packages/plugins/figma/skills/figma-use-figjam/references/figjam-colors.md` (+187, -0)
- `packages/plugins/figma/skills/figma-use-figjam/references/plan-board-content.md` (+339, -0)
- `packages/plugins/figma/skills/figma-use-figjam/references/position-figjam-nodes.md` (+90, -0)
- `packages/plugins/figma/skills/figma-use-motion/SKILL.md` (+80, -0)
- `packages/plugins/figma/skills/figma-use-motion/references/motion-easing.md` (+169, -0)
- `packages/plugins/figma/skills/figma-use-motion/references/motion-patterns.md` (+587, -0)
- `packages/plugins/figma/skills/figma-use-slides/SKILL.md` (+214, -0)
- `packages/plugins/figma/skills/figma-use-slides/references/slide-content.md` (+139, -0)
- `packages/plugins/figma/skills/figma-use-slides/references/slide-design.md` (+121, -0)
- `packages/plugins/figma/skills/figma-use-slides/references/slide-gotchas.md` (+366, -0)
- `packages/plugins/figma/skills/figma-use-slides/references/slide-grid.md` (+86, -0)
- `packages/plugins/figma/skills/figma-use-slides/references/slide-lifecycle.md` (+62, -0)
- `packages/plugins/figma/skills/figma-use-slides/references/slide-properties.md` (+113, -0)
- `packages/plugins/figma/skills/figma-use/SKILL.md` (+380, -0)
- `packages/plugins/figma/skills/figma-use/references/api-reference.md` (+357, -0)
- `packages/plugins/figma/skills/figma-use/references/common-patterns.md` (+452, -0)
- `packages/plugins/figma/skills/figma-use/references/component-patterns.md` (+595, -0)
- `packages/plugins/figma/skills/figma-use/references/effect-style-patterns.md` (+125, -0)
- `packages/plugins/figma/skills/figma-use/references/gotchas.md` (+1013, -0)
- `packages/plugins/figma/skills/figma-use/references/plugin-api-patterns.md` (+580, -0)
- `packages/plugins/figma/skills/figma-use/references/plugin-api-standalone.d.ts` (+10191, -0)
- `packages/plugins/figma/skills/figma-use/references/plugin-api-standalone.index.md` (+446, -0)
- `packages/plugins/figma/skills/figma-use/references/text-style-patterns.md` (+197, -0)
- `packages/plugins/figma/skills/figma-use/references/validation-and-recovery.md` (+75, -0)
- `packages/plugins/figma/skills/figma-use/references/variable-patterns.md` (+394, -0)
- `packages/plugins/figma/skills/figma-use/references/working-with-design-systems/wwds-components--creating.md` (+17, -0)
- `packages/plugins/figma/skills/figma-use/references/working-with-design-systems/wwds-components--using.md` (+17, -0)
- `packages/plugins/figma/skills/figma-use/references/working-with-design-systems/wwds-components.md` (+50, -0)
- `packages/plugins/figma/skills/figma-use/references/working-with-design-systems/wwds-effect-styles.md` (+52, -0)
- `packages/plugins/figma/skills/figma-use/references/working-with-design-systems/wwds-text-styles.md` (+79, -0)
- `packages/plugins/figma/skills/figma-use/references/working-with-design-systems/wwds-variables--creating.md` (+13, -0)
- `packages/plugins/figma/skills/figma-use/references/working-with-design-systems/wwds-variables--using.md` (+13, -0)
- `packages/plugins/figma/skills/figma-use/references/working-with-design-systems/wwds-variables.md` (+64, -0)
- `packages/plugins/figma/skills/figma-use/references/working-with-design-systems/wwds.md` (+41, -0)
- `packages/plugins/figma/tsconfig.json` (+9, -0)
- `packages/protocol/openapi.json` (+40, -0)
- `packages/protocol/package.json` (+1, -1)
- `packages/schema/package.json` (+1, -1)
- `packages/schema/src/config/provider.ts` (+5, -0)
- `packages/schema/src/model-compatibility.ts` (+40, -0)
- `packages/schema/src/model.ts` (+4, -26)
- `packages/schema/src/provider.ts` (+8, -0)
- `packages/script/package.json` (+5, -1)
- `packages/script/src/highlights.ts` (+68, -0)
- `packages/script/test/highlights.test.ts` (+80, -0)
- `packages/sdk/package.json` (+1, -1)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/component-tests/session-message-projection.spec.ts` (+20, -1)
- `packages/session-ui/component-tests/session-timeline-mobile.spec.ts` (+6, -3)
- `packages/session-ui/package.json` (+1, -1)
- `packages/session-ui/src/message/message-content.tsx` (+12, -3)
- `packages/session-ui/src/timeline/projection.ts` (+8, -4)
- `packages/session-ui/src/timeline/rows-current.test.ts` (+48, -4)
- `packages/session-ui/src/timeline/session-timeline-row.tsx` (+13, -4)
- `packages/session-ui/src/timeline/timeline-row.stories.tsx` (+25, -11)
- `packages/session-ui/src/timeline/timeline-row.ts` (+9, -0)
- `packages/session-ui/src/tools/tool-renderer.tsx` (+294, -430)
- `packages/simulation/package.json` (+1, -1)
- `packages/simulation/src/frontend/renderer.ts` (+14, -3)
- `packages/simulation/src/frontend/simulation.ts` (+2, -1)
- `packages/simulation/test/recording.test.ts` (+19, -10)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/server/package.json` (+1, -1)
- `packages/storybook/package.json` (+2, -1)
- `packages/theme/package.json` (+1, -1)
- `packages/theme/src/tui/syntax.ts` (+5, -4)
- `packages/tui/package.json` (+2, -3)
- `packages/tui/src/app.tsx` (+59, -13)
- `packages/tui/src/component/dialog-config.tsx` (+9, -0)
- `packages/tui/src/component/dialog-highlights.tsx` (+89, -0)
- `packages/tui/src/component/fade-in-text.tsx` (+2, -2)
- `packages/tui/src/component/masked-text.ts` (+31, -28)
- `packages/tui/src/component/one-cell-spinner.tsx` (+1, -3)
- `packages/tui/src/component/patch-diff.tsx` (+2, -1)
- `packages/tui/src/component/prompt/autocomplete.tsx` (+19, -12)
- `packages/tui/src/component/prompt/index.tsx` (+22, -18)
- `packages/tui/src/component/register-spinner.ts` (+0, -6)
- `packages/tui/src/component/retry-provider.tsx` (+6, -8)
- `packages/tui/src/component/session-tabs.tsx` (+1, -3)
- `packages/tui/src/component/shimmer-text.tsx` (+1, -1)
- `packages/tui/src/component/spinner-renderable.ts` (+158, -0)
- `packages/tui/src/component/spinner.tsx` (+1, -3)
- `packages/tui/src/component/title-shimmer.tsx` (+82, -74)
- `packages/tui/src/config/index.tsx` (+3, -0)
- `packages/tui/src/context/runtime.tsx` (+7, -0)
- `packages/tui/src/context/theme.tsx` (+1, -1)
- `packages/tui/src/editor.ts` (+2, -5)
- `packages/tui/src/feature-plugins/system/diff-viewer-file-tree.tsx` (+3, -1)
- `packages/tui/src/feature-plugins/system/diff-viewer.tsx` (+4, -4)
- `packages/tui/src/feature-plugins/system/storybook/highlights.tsx` (+71, -0)
- `packages/tui/src/feature-plugins/system/storybook/index.tsx` (+2, -0)
- `packages/tui/src/mini/footer.form.tsx` (+5, -4)
- `packages/tui/src/mini/footer.permission.tsx` (+4, -3)
- `packages/tui/src/mini/footer.prompt.tsx` (+22, -28)
- `packages/tui/src/mini/footer.subagent.tsx` (+1, -3)
- `packages/tui/src/mini/footer.ts` (+5, -1)
- `packages/tui/src/mini/footer.view.tsx` (+4, -4)
- `packages/tui/src/mini/mono.ts` (+16, -15)
- `packages/tui/src/mini/prompt.editor.ts` (+7, -1)
- `packages/tui/src/mini/prompt.shared.ts` (+15, -10)
- `packages/tui/src/mini/runtime.lifecycle.ts` (+11, -7)
- `packages/tui/src/mini/scrollback.shared.ts` (+3, -7)
- `packages/tui/src/mini/scrollback.surface.ts` (+16, -4)
- `packages/tui/src/mini/scrollback.writer.tsx` (+27, -10)
- `packages/tui/src/mini/theme.ts` (+6, -1)
- `packages/tui/src/prompt/directory-completion.ts` (+4, -5)
- `packages/tui/src/prompt/display.ts` (+19, -39)
- `packages/tui/src/prompt/history.tsx` (+4, -4)
- `packages/tui/src/prompt/mention.ts` (+25, -17)
- `packages/tui/src/prompt/part.ts` (+15, -3)
- `packages/tui/src/routes/session/composer/subagents-tab.tsx` (+3, -1)
- `packages/tui/src/routes/session/group-view.tsx` (+4, -1)
- `packages/tui/src/routes/session/index.tsx` (+11, -5)
- `packages/tui/src/routes/session/message-parts.tsx` (+5, -2)
- `packages/tui/src/routes/session/thinking-syntax.ts` (+3, -2)
- `packages/tui/src/ui/spinner.ts` (+1, -1)
- `packages/tui/src/util/highlights.ts` (+51, -0)
- `packages/tui/src/util/renderer.ts` (+11, -3)
- `packages/tui/src/util/system.ts` (+4, -1)
- `packages/tui/test/app-lifecycle.test.tsx` (+42, -10)
- `packages/tui/test/cli/tui/diff-viewer.test.tsx` (+6, -2)
- `packages/tui/test/compact-admission.test.tsx` (+4, -2)
- `packages/tui/test/completion-notices.test.tsx` (+4, -2)
- `packages/tui/test/component/dialog-highlights.test.tsx` (+73, -0)
- `packages/tui/test/component/retry-provider.test.tsx` (+5, -3)
- `packages/tui/test/component/shimmer-text.test.tsx` (+37, -0)
- `packages/tui/test/component/spinner-renderable.test.tsx` (+132, -0)
- `packages/tui/test/copy-session-id.test.tsx` (+2, -1)
- `packages/tui/test/editor.test.ts` (+27, -7)
- `packages/tui/test/fixture/app.ts` (+11, -7)
- `packages/tui/test/highlights.test.ts` (+43, -0)
- `packages/tui/test/markdown-streaming.test.tsx` (+22, -10)
- `packages/tui/test/mini/footer.test.ts` (+2, -1)
- `packages/tui/test/mini/footer.view.test.tsx` (+56, -8)
- `packages/tui/test/mini/prompt.editor.test.ts` (+9, -7)
- `packages/tui/test/mini/prompt.shared.test.ts` (+27, -57)
- `packages/tui/test/mini/scrollback.surface.test.ts` (+57, -8)
- `packages/tui/test/mini/theme.test.ts` (+18, -0)
- `packages/tui/test/new-session-id.test.tsx` (+3, -1)
- `packages/tui/test/plugin-markdown.test.tsx` (+4, -4)
- `packages/tui/test/prompt-offset.test.tsx` (+58, -0)
- `packages/tui/test/prompt-paste.test.tsx` (+16, -0)
- `packages/tui/test/prompt/autocomplete.test.ts` (+11, -16)
- `packages/tui/test/prompt/display.test.ts` (+66, -37)
- `packages/tui/test/prompt/history.test.ts` (+12, -8)
- `packages/tui/test/prompt/mention.test.ts` (+22, -14)
- `packages/tui/test/prompt/part.test.ts` (+17, -28)
- `packages/tui/test/session-activity-anchor.test.tsx` (+2, -1)
- `packages/tui/test/session-backfill-disclosure.test.tsx` (+2, -1)
- `packages/tui/test/session-group-navigation.test.tsx` (+2, -1)
- `packages/tui/test/session-home.test.tsx` (+2, -1)
- `packages/tui/test/session-mount-budget.test.tsx` (+2, -1)
- `packages/tui/test/session-terminal-availability.test.tsx` (+2, -1)
- `packages/tui/test/session-wheel-focus.test.tsx` (+2, -1)
- `packages/tui/test/stats.view.test.tsx` (+2, -1)
- `packages/tui/test/theme/v2/resolve.test.ts` (+10, -5)
- `packages/tui/test/ui/link.test.tsx` (+3, -1)
- `packages/tui/test/util/renderer.test.ts` (+19, -13)
- `packages/tui/test/util/selection-keys.test.ts` (+0, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/context/dialog.tsx` (+67, -4)
- `packages/ui/src/i18n/en.ts` (+2, -0)
- `packages/ui/src/overlays/dialog/dialog.tsx` (+5, -3)
- `packages/util/package.json` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/config.mdx` (+1, -1)
- `packages/web/src/middleware.ts` (+0, -5)
- `script/native-arch.ts` (+102, -0)
- `script/publish-winget.ts` (+222, -0)
- `script/publish.ts` (+7, -0)
- `script/release.ts` (+9, -0)
- `script/upgrade-opentui.ts` (+1, -35)
- `sdks/vscode/package.json` (+1, -1)
- `sdks/vscode/src/extension.ts` (+2, -41)
- `services/README.md` (+6, -5)
- `services/changelog/.wrangler/state/v3/cache/default/blobs/4c23665bc4b3b7ce4af96b4ad9f8ce3edfd8ee348237e6748aa65dba2ebc8ab4000001a13171692e` (+117, -0)
- `services/changelog/.wrangler/state/v3/cache/miniflare-CacheObject/9f458c07675338a7426a7b81ac4fb1baf92d034efbcaaf4336379640ed744ded.sqlite` (+-, --)
- `services/changelog/.wrangler/state/v3/cache/miniflare-CacheObject/9f458c07675338a7426a7b81ac4fb1baf92d034efbcaaf4336379640ed744ded.sqlite-shm` (+-, --)
- `services/changelog/.wrangler/state/v3/cache/miniflare-CacheObject/9f458c07675338a7426a7b81ac4fb1baf92d034efbcaaf4336379640ed744ded.sqlite-wal` (+-, --)
- `services/changelog/.wrangler/state/v3/cache/miniflare-CacheObject/metadata.sqlite` (+-, --)
- `services/changelog/.wrangler/state/v3/cache/miniflare-CacheObject/metadata.sqlite-shm` (+-, --)
- `services/changelog/.wrangler/state/v3/cache/miniflare-CacheObject/metadata.sqlite-wal` (+-, --)
- `services/changelog/README.md` (+34, -0)
- `services/changelog/package.json` (+23, -0)
- `services/changelog/public/_headers` (+2, -0)
- `services/changelog/public/changelog/fonts/IBMPlexMono-Regular-Latin1.woff2` (+-, --)
- `services/changelog/public/changelog/fonts/IBMPlexSerif-Italic-Latin1.woff2` (+-, --)
- `services/changelog/public/changelog/fonts/IBMPlexSerif-Regular-Latin1.woff2` (+-, --)
- `services/changelog/public/changelog/fonts/IBMPlexSerif-SemiBold-Latin1.woff2` (+-, --)
- `services/changelog/public/changelog/fonts/LICENSE.txt` (+93, -0)
- `services/changelog/src/index.ts` (+88, -0)
- `services/changelog/src/markdown.ts` (+156, -0)
- `services/changelog/src/page.ts` (+109, -0)
- `services/changelog/src/style.ts` (+144, -0)
- `services/changelog/test/markdown.test.ts` (+117, -0)
- `services/changelog/test/worker.test.ts` (+130, -0)
- `services/changelog/tsconfig.json` (+13, -0)
- `services/changelog/wrangler.jsonc` (+25, -0)
- `services/update/package.json` (+1, -1)
- `services/update/src/index.ts` (+30, -24)
- `services/update/test/index.test.ts` (+19, -0)
- `services/www/openapi.json` (+40, -0)
- `services/www/public/openapi.json` (+40, -0)
- `services/www/src/docs/content/build/plugins/index.mdx` (+16, -0)
- `services/www/src/docs/content/cli/config.mdx` (+9, -0)
- `services/www/src/docs/content/cli/tui.mdx` (+2, -0)
- `services/www/src/docs/content/config.mdx` (+42, -5)
- `services/www/src/docs/content/console/models.mdx` (+4, -0)
- `services/www/src/docs/content/migrate-v1.mdx` (+14, -2)
- `services/www/src/docs/content/models.mdx` (+32, -0)
- `services/www/src/docs/content/policies.mdx` (+8, -6)
- `services/www/src/docs/content/providers.mdx` (+19, -0)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index f59afaa0..d03f0fcd 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "2.0.27",
+  "version": "2.0.28",
   "name": "@opencode/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/config.ts
```diff
diff --git a/packages/core/src/config.ts b/packages/core/src/config.ts
index 0f1ce308..2c6546fd 100644
--- a/packages/core/src/config.ts
+++ b/packages/core/src/config.ts
@@ -18,6 +18,8 @@ import { ConfigNormalize } from "./config/normalize.js"
 import { ConfigDiscovery } from "./config/discovery.js"
 import { ConfigWatch } from "./config/watch.js"
 import { WellKnown } from "./wellknown.js"
+import { AppProcess } from "@opencode/util/process"
+import { ChildProcess } from "effect/process"
 
 export function latest<K extends keyof Info>(entries: readonly Entry[], key: K): Info[K] | undefined {
   return entries.findLast((entry): entry is Document => entry.type === "document" && entry.info[key] !== undefined)
@@ -44,9 +46,10 @@ export interface Interface {
 
 export const Options = Schema.Struct({
   project: Schema.optional(Schema.Boolean),
-  // false skips the global config dir, ~/.claude, and ~/.agents; wellknown,
-  // file, and content entries still load.
+  // false skips the system and global config dirs, ~/.claude, and ~/.agents;
+  // wellknown, file, and content entries still load.
   global: Schema.optional(Schema.Boolean),
+  system: Schema.optional(Schema.Union([Schema.Boolean, Schema.String])),
   file: Schema.optional(Schema.String),
   content: Schema.optional(Schema.String),
 })
@@ -97,6 +100,7 @@ export const layer = (options?: Options) =>
       const credentials = yield* Credential.Service
       const globalService = yield* Global.Service
       const wellknown = yield* WellKnown.Service
+      const processes = yield* AppProcess.Service
       const reloadLock = Semaphore.makeUnsafe(1)
       const updateLock = Semaphore.makeUnsafe(1)
       const decodeOptions = { errors: "all", onExcessProperty: "ignore" } as const
@@ -182,6 +186,26 @@ export const layer = (options?: Options) =>
         return yield* Effect.forEach(entries, loadWellknownEntry).pipe(Effect.map((documents) => documents.flat()))
       })
 
+      const loadPreferences = Effect.fn("Config.loadPreferences")(function* (plist: AbsolutePath) {
+        const result = yield* processes
+          .run(ChildProcess.make("plutil", ["-convert", "json", "-o", "-", plist], { stdin: "ignore" }), {
+            timeout: "10 seconds",
+          })
+          .pipe(Effect.flatMap(AppProcess.requireSuccess), Effect.option)
+        if (Option.isNone(result)) {
+          yield* Effect.logWarning("failed to convert managed preferences", { source: plist })
+          return []
+        }
+        const text = yield* ConfigVariable.substitute({
+          type: "virtual",
```

#### packages/core/src/config/discovery.ts
```diff
diff --git a/packages/core/src/config/discovery.ts b/packages/core/src/config/discovery.ts
index 71c0c03d..0e197fe8 100644
--- a/packages/core/src/config/discovery.ts
+++ b/packages/core/src/config/discovery.ts
@@ -1,5 +1,6 @@
 export * as ConfigDiscovery from "./discovery.js"
 
+import os from "os"
 import path from "path"
 import { Effect } from "effect"
 import { FSUtil } from "@opencode/util/fs-util"
@@ -12,6 +13,9 @@ export const names = ["opencode.json", "opencode.jsonc"]
 
 /** Eligible sources in priority order, including paths that may appear later. */
 export interface Sources {
+  readonly system?: { readonly path: AbsolutePath; readonly present: boolean }
+  /** macOS MDM managed preferences plist (`ai.opencode.managed`), when one is deployed. */
+  readonly preferences?: AbsolutePath
   readonly global?: AbsolutePath
   readonly explicit?: AbsolutePath
   readonly direct: readonly AbsolutePath[]
@@ -20,18 +24,58 @@ export interface Sources {
   readonly agents: readonly AbsolutePath[]
 }
 
+/** Platform system configuration directory (`/Library/Application Support/opencode`, `/etc/opencode`, `%ProgramData%\opencode`). */
+export function systemDirectory(platform: NodeJS.Platform = process.platform, env: NodeJS.ProcessEnv = process.env) {
+  if (platform === "darwin") return AbsolutePath.make("/Library/Application Support/opencode")
+  if (platform === "win32") return AbsolutePath.make(path.join(env.ProgramData || "C:\\ProgramData", "opencode"))
+  return AbsolutePath.make("/etc/opencode")
+}
+
+/** macOS MDM managed preferences plists, most specific first; the first one present wins. */
+export function preferencePaths(user: string) {
+  return [
+    AbsolutePath.make(path.join("/Library/Managed Preferences", user, "ai.opencode.managed.plist")),
+    AbsolutePath.make("/Library/Managed Preferences/ai.opencode.managed.plist"),
+  ]
+}
+
+// Keys macOS and MDM profiles inject into managed preferences that are not OpenCode config.
+const preferenceMetadata = new Set([
+  "PayloadDisplayName",
+  "PayloadIdentifier",
+  "PayloadType",
+  "PayloadUUID",
+  "PayloadVersion",
+  "_manualProfile",
+])
+
```

#### packages/core/src/config/plugin/provider.ts
```diff
diff --git a/packages/core/src/config/plugin/provider.ts b/packages/core/src/config/plugin/provider.ts
index a3f6265b..748464ab 100644
--- a/packages/core/src/config/plugin/provider.ts
+++ b/packages/core/src/config/plugin/provider.ts
@@ -68,6 +68,8 @@ export const Plugin = define({
           if (item.canonical !== undefined) provider.canonical = item.canonical
           if (item.name !== undefined) provider.name = item.name
           if (item.package !== undefined) provider.package = item.package
+          if (item.compatibility !== undefined)
+            provider.compatibility = { ...provider.compatibility, ...item.compatibility }
           if (item.settings !== undefined) provider.settings = Provider.mergeOverlay(provider.settings, item.settings)
           if (item.headers !== undefined) provider.headers = Provider.mergeHeaders(provider.headers, item.headers)
           if (item.body !== undefined) provider.body = Provider.mergeOverlay(provider.body, item.body)
```

#### packages/core/src/config/watch.ts
```diff
diff --git a/packages/core/src/config/watch.ts b/packages/core/src/config/watch.ts
index c4a8859f..fad96cea 100644
--- a/packages/core/src/config/watch.ts
+++ b/packages/core/src/config/watch.ts
@@ -7,10 +7,12 @@ import type { ConfigDiscovery } from "./discovery.js"
 
 export function plan(sources: ConfigDiscovery.Sources) {
   const directories = [
+    ...(sources.system?.present ? [sources.system.path] : []),
     ...(sources.global ? [sources.global] : []),
     ...sources.project.filter((root) => root.present).map((root) => root.path),
   ]
   const files = [
+    ...(sources.system ? [sources.system.path] : []),
     ...sources.direct,
     ...sources.project.map((root) => root.path),
     ...sources.claude,
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/kilocode/agent/index.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/test/agent/agent.test.ts
- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/src/ripgrep.ts
- `src/core/` - review core changes from packages/core/src/v1/config/config.ts
- `src/tool/EditToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt changes
- `src/tool/ShellToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt changes
- `src/tool/ToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolView.kt changes
- `src/tool/glob-ignored.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/glob-ignored.test.ts changes
- `src/tool/glob-ignored.ts` - update based on kilocode packages/opencode/src/kilocode/tool/glob-ignored.ts changes
- `src/tool/glob.test.ts` - update based on kilocode packages/opencode/test/tool/glob.test.ts changes
- `src/tool/glob.ts` - update based on kilocode packages/opencode/src/tool/glob.ts changes
