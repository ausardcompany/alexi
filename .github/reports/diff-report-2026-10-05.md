# Upstream Changes Report
Generated: 2026-10-05 13:49:03

## Summary
- kilocode: 54 commits, 219 files changed
- opencode: 0 commits, 0 files changed

## kilocode Changes (76bcfd40b..a93088bfe)

### Commits

- a93088bfe - Merge pull request #14804 from Kilo-Org/docs/workflows-slack-posts (Bruno Agatão, 2026-10-05)
- 94ec691ad - Merge pull request #14803 from Kilo-Org/holistic-sprite (Marius, 2026-10-05)
- 06c09ef79 - Merge pull request #14802 from Kilo-Org/add-model-variant-subagent-view (Marius, 2026-10-05)
- fb0814069 - Merge pull request #14797 from Kilo-Org/enable-multi-agent-project-manager (Marius, 2026-10-05)
- 501286ba9 - fix(marketplace): gate per-pattern retry on invalid globs (marius-kilocode, 2026-10-05)
- 992258c16 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-10-05)
- 39736a33d - fix(vscode): keep sidebar search story mounted once (marius-kilocode, 2026-10-05)
- 93519a31c - fix(marketplace): honor ignore files and harden the suggestion scan (marius-kilocode, 2026-10-05)
- 784817ad3 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-10-05)
- 0904f2a0d - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-10-05)
- 7ad671625 - test(vscode): add story for subagent session header (marius-kilocode, 2026-10-05)
- 7066d3923 - Merge commit '831805118a8c896cc8f55449bea9435e51e6e507' into holistic-sprite (marius-kilocode, 2026-10-05)
- 831805118 - Merge pull request #14800 from Kilo-Org/mahogany-bobolink (Marius, 2026-10-05)
- 9de3e02a8 - chore(agent-manager): merge main and resolve project wiring conflicts (marius-kilocode, 2026-10-05)
- 5dbe17803 - docs(security): document what the workflows post to Slack (Bruno Agatao, 2026-10-05)
- 21164ba0b - fix(marketplace): scan workspace for suggestions in the backend (marius-kilocode, 2026-10-05)
- f54835475 - Merge pull request #14723 from Kilo-Org/issue-14662 (Andrea Giammarchi, 2026-10-05)
- f1961da4f - docs: update Bun minimum to 1.4.2 in VS Code build docs (marius-kilocode, 2026-10-05)
- b45cbdf5c - fix: complete Bun 1.4.2 upgrade prerequisites (marius-kilocode, 2026-10-05)
- 64a919281 - feat(vscode): show subagent model and variant in session header (marius-kilocode, 2026-10-05)
- 9e0a77ef0 - chore: pin Bun runtime and types to 1.4.2 (marius-kilocode, 2026-10-05)
- 5539dd3ae - fix: harden Kilo catalog recovery retry loops (webreflection, 2026-10-05)
- ed3979ccb - fix(agent-manager): address default multi-project regressions (marius-kilocode, 2026-10-05)
- cb9d14c0c - Merge pull request #14751 from Kilo-Org/add-organization-icons-to-projects (Marius, 2026-10-05)
- 9b31d373b - fix(vscode): unify scope agent resolution and recover Kilo catalog failures (webreflection, 2026-10-05)
- 088355899 - fix(agent-manager): preserve staged renames when continuing in a worktree (#14775) (Lennard, 2026-10-05)
- 2792c704e - fix(cli): keep valid models when provider config contains a malformed entry (#14794) (Qingsong Li, 2026-10-05)
- fde29f4ae - Merge #14688 (arccat-114/fix/kilo-catalog-recovery) into issue-14662 (webreflection, 2026-10-05)
- 0ef46abc8 - Merge pull request #14798 from Kilo-Org/supersede/14795-mcp-tool-overflow (Marius, 2026-10-05)
- 293cbd69a - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-10-05)
- 7045b215b - Merge pull request #14791 from mardausdennis/fix/idle-dock-spinner (Marius, 2026-10-05)
- 88134d2d0 - fix(agent-manager): prune removed project branch cache and cover tab migration (marius-kilocode, 2026-10-05)
- bf5705bb3 - Merge pull request #14736 from Kilo-Org/fix/agent-manager-peer-turns (Marius, 2026-10-05)
- 6c860acaa - Merge pull request #14787 from ykakade/fix/skill-frontmatter-cache (Marius, 2026-10-05)
- 1f41ed65c - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-10-05)
- b8d0cf1ac - fix(ui): scroll wide MCP tool input and output instead of clipping (Sylwester Liljegren, 2026-10-04)
- 3e4c6dd51 - fix(vscode): pause the hidden working spinner after a turn ends (mardausdennis, 2026-10-04)
- b0aeda50b - fix(cli): stop gray-matter cache from dropping project skills (Yash2017, 2026-10-04)
- 88f8ea950 - fix(cli): honor catalog retry headers and verify recovery notifications (YiMing Zhang, 2026-10-03)
- 59313c749 - fix(cli): sustain catalog recovery and report fetch failures (YiMing Zhang, 2026-10-03)
- ae341e2a6 - Merge remote-tracking branch 'upstream/main' into fix/kilo-catalog-recovery (YiMing Zhang, 2026-10-03)
- ecb450b9b - feat(agent-manager): enable multiple projects by default (marius-kilocode, 2026-10-02)
- fcf2f6516 - fix(agent-manager): guard avatar reads and cache failed downloads (marius-kilocode, 2026-10-02)
- ecb3b6a10 - fix(agent-manager): use font-size token and scan the new avatar component (marius-kilocode, 2026-10-02)
- 1853455f8 - fix(agent-manager): harden project avatar loading (marius-kilocode, 2026-10-02)
- 95b09ee8a - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-10-02)
- 829f6214f - feat(agent-manager): show project organization avatars (marius-kilocode, 2026-10-02)
- d894e6535 - fix(agent-manager): let backend assign peer prompt message IDs (Bruno Agatao, 2026-10-02)
- 257814ff6 - refactor(vscode): remove dead model selection code (webreflection, 2026-10-01)
- f6caba9f7 - fix(vscode): restore model selection validation contract (webreflection, 2026-10-01)
- 958f1c4ff - fix(vscode): improve default models on session bootstrap (webreflection, 2026-10-01)
- 966a490b3 - Merge remote-tracking branch 'upstream/main' into fix/kilo-catalog-recovery (YiMing Zhang, 2026-09-30)
- b1642e87c - fix(cli): rearm and bound catalog recovery retries (YiMing Zhang, 2026-09-30)
- 07b18a1a2 - fix(cli): recover models after transient catalog failures (YiMing Zhang, 2026-09-30)

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
- `packages/core/src/ripgrep.ts` (+16, -2)
- `packages/kilo-vscode/src/agent-manager/orchestration-bridge.ts` (+0, -1)
- `packages/kilo-vscode/src/agent-manager/orchestration-domain.ts` (+0, -2)
- `packages/kilo-vscode/tests/unit/agent-manager-orchestration-bridge.test.ts` (+0, -4)
- `packages/kilo-vscode/tests/unit/agent-manager-orchestration-domain.test.ts` (+30, -28)

#### Other Changes
- `.changeset/agent-manager-projects-default.md` (+7, -0)
- `.changeset/bun-runtime-1-4-2.md` (+5, -0)
- `.changeset/clean-provider-models.md` (+5, -0)
- `.changeset/fix-am-peer-turns.md` (+5, -0)
- `.changeset/idle-dock-spinner.md` (+5, -0)
- `.changeset/kilo-catalog-recovery.md` (+6, -0)
- `.changeset/marketplace-scan-cpu.md` (+6, -0)
- `.changeset/mcp-tool-output-overflow.md` (+5, -0)
- `.changeset/per-agent-model-precedence.md` (+6, -0)
- `.changeset/preserve-staged-worktree-renames.md` (+5, -0)
- `.changeset/project-organization-avatars.md` (+5, -0)
- `.changeset/skill-frontmatter-cache.md` (+5, -0)
- `.changeset/subagent-header-model.md` (+5, -0)
- `.github/workflows/README.md` (+11, -0)
- `CONTRIBUTING.md` (+2, -2)
- `bun.lock` (+3, -3)
- `bunfig.toml` (+1, -1)
- `nix/bun.nix` (+4, -4)
- `nix/hashes.json` (+4, -4)
- `package.json` (+2, -2)
- `packages/containers/bun-node/Dockerfile` (+1, -1)
- `packages/kilo-docs/pages/automate/agent-manager-projects.md` (+2, -10)
- `packages/kilo-docs/pages/code-with-ai/agents/model-selection.md` (+2, -2)
- `packages/kilo-docs/pages/contributing/development-environment.md` (+1, -1)
- `packages/kilo-docs/pages/customize/custom-modes.md` (+1, -1)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/projects-avatars-200-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/projects-avatars-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-subagent-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/labs-tool-call-lab/search-previews-chromium-linux.png` (+2, -2)
- `packages/kilo-gateway/src/api/models.ts` (+6, -2)
- `packages/kilo-gateway/test/api/models.test.ts` (+26, -0)
- `packages/kilo-ui/src/components/basic-tool.css` (+18, -0)
- `packages/kilo-vscode/AGENTS.md` (+2, -2)
- `packages/kilo-vscode/docs/mercury-next-edit-testing.html` (+1, -1)
- `packages/kilo-vscode/package.json` (+0, -6)
- `packages/kilo-vscode/src/KiloProvider.ts` (+46, -28)
- `packages/kilo-vscode/src/MarketplacePanelProvider.ts` (+1, -8)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+14, -15)
- `packages/kilo-vscode/src/agent-manager/base-update.ts` (+0, -2)
- `packages/kilo-vscode/src/agent-manager/git-transfer.ts` (+2, -16)
- `packages/kilo-vscode/src/agent-manager/host.ts` (+2, -4)
- `packages/kilo-vscode/src/agent-manager/project/avatar.ts` (+120, -0)
- `packages/kilo-vscode/src/agent-manager/project/context.ts` (+0, -2)
- `packages/kilo-vscode/src/agent-manager/project/contexts.ts` (+9, -37)
- `packages/kilo-vscode/src/agent-manager/project/messages.ts` (+16, -27)
- `packages/kilo-vscode/src/agent-manager/project/onboarding.ts` (+2, -4)
- `packages/kilo-vscode/src/agent-manager/project/wiring.ts` (+5, -12)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+10, -11)
- `packages/kilo-vscode/src/agent-manager/vscode-host.ts` (+3, -18)
- `packages/kilo-vscode/src/extension.ts` (+1, -0)
- `packages/kilo-vscode/src/kilo-provider-utils.ts` (+9, -1)
- `packages/kilo-vscode/src/kilo-provider/catalog-retry.ts` (+51, -0)
- `packages/kilo-vscode/src/kilo-provider/config-snapshot.ts` (+0, -1)
- `packages/kilo-vscode/src/kilo-provider/early-message.ts` (+0, -2)
- `packages/kilo-vscode/src/kilo-provider/model-state.ts` (+0, -137)
- `packages/kilo-vscode/src/provider-actions.ts` (+11, -0)
- `packages/kilo-vscode/src/services/marketplace/actions.ts` (+1, -2)
- `packages/kilo-vscode/src/services/marketplace/index.ts` (+2, -25)
- `packages/kilo-vscode/src/services/marketplace/notifier.ts` (+30, -10)
- `packages/kilo-vscode/src/services/marketplace/relevance.ts` (+18, -41)
- `packages/kilo-vscode/tests/fixtures/session-preference-loader.ts` (+0, -169)
- `packages/kilo-vscode/tests/fixtures/session-provider-activity.tsx` (+160, -153)
- `packages/kilo-vscode/tests/fixtures/worktree-finish.tsx` (+86, -15)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+3, -8)
- `packages/kilo-vscode/tests/unit/agent-manager-selection-actions.test.ts` (+23, -5)
- `packages/kilo-vscode/tests/unit/agent-manager-settings.test.ts` (+6, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-shortcuts.test.ts` (+20, -0)
- `packages/kilo-vscode/tests/unit/agent-project-clone.test.ts` (+3, -10)
- `packages/kilo-vscode/tests/unit/agent-project-contexts.test.ts` (+22, -44)
- `packages/kilo-vscode/tests/unit/agent-project-events.test.ts` (+83, -0)
- `packages/kilo-vscode/tests/unit/agent-project-messages.test.ts` (+30, -13)
- `packages/kilo-vscode/tests/unit/agent-project-pollers.test.ts` (+1, -2)
- `packages/kilo-vscode/tests/unit/agent-project-registry.test.ts` (+33, -1)
- `packages/kilo-vscode/tests/unit/agent-project-run-status.test.ts` (+12, -4)
- `packages/kilo-vscode/tests/unit/agent-project-selection.test.ts` (+0, -3)
- `packages/kilo-vscode/tests/unit/catalog-retry.test.ts` (+75, -0)
- `packages/kilo-vscode/tests/unit/git-transfer.test.ts` (+101, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-catalog.test.ts` (+101, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-indexing-refresh.test.ts` (+0, -1)
- `packages/kilo-vscode/tests/unit/kilo-provider-route-integration.test.ts` (+74, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-utils.test.ts` (+15, -0)
- `packages/kilo-vscode/tests/unit/marketplace-actions.test.ts` (+1, -2)
- `packages/kilo-vscode/tests/unit/marketplace-relevance.test.ts` (+11, -45)
- `packages/kilo-vscode/tests/unit/model-selection.test.ts` (+73, -171)
- `packages/kilo-vscode/tests/unit/model-state.test.ts` (+0, -343)
- `packages/kilo-vscode/tests/unit/model-usage.test.ts` (+26, -1)
- `packages/kilo-vscode/tests/unit/navigate.test.ts` (+25, -42)
- `packages/kilo-vscode/tests/unit/new-worktree-dialog-sandbox.test.ts` (+72, -134)
- `packages/kilo-vscode/tests/unit/project-avatar.test.ts` (+49, -0)
- `packages/kilo-vscode/tests/unit/project-sessions-live.test.ts` (+3, -6)
- `packages/kilo-vscode/tests/unit/project-state-handlers.test.ts` (+39, -12)
- `packages/kilo-vscode/tests/unit/prompt-send-contract.test.ts` (+14, -10)
- `packages/kilo-vscode/tests/unit/session-agent.test.ts` (+36, -0)
- `packages/kilo-vscode/tests/unit/session-model-selector.test.ts` (+8, -8)
- `packages/kilo-vscode/tests/unit/session-model-store.test.ts` (+95, -264)
- `packages/kilo-vscode/tests/unit/session-preference-loader.test.ts` (+0, -20)
- `packages/kilo-vscode/tests/unit/session-preferences.test.ts` (+66, -12)
- `packages/kilo-vscode/tests/unit/session-variant-store.test.ts` (+3, -3)
- `packages/kilo-vscode/tests/unit/session-variants.test.ts` (+34, -14)
- `packages/kilo-vscode/tests/unit/sidebar-search.test.ts` (+0, -179)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+99, -346)
- `packages/kilo-vscode/webview-ui/agent-manager/NewWorktreeDialog.tsx` (+2, -4)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectAvatar.tsx` (+18, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectList.tsx` (+41, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectSidebarBody.tsx` (+16, -58)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectsSection.tsx` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/SidebarBody.tsx` (+0, -520)
- `packages/kilo-vscode/webview-ui/agent-manager/SidebarSectionHeader.tsx` (+25, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/WorktreeSectionActions.tsx` (+0, -76)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+86, -107)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+0, -11)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+0, -11)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+0, -11)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+0, -11)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+0, -11)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+0, -11)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+0, -11)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fa.ts` (+0, -11)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fr.ts` (+0, -11)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/it.ts` (+0, -11)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ja.ts` (+0, -11)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ko.ts` (+0, -11)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/nl.ts` (+0, -11)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/no.ts` (+0, -11)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/pl.ts` (+0, -11)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ru.ts` (+0, -11)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/th.ts` (+0, -11)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/tr.ts` (+0, -11)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/uk.ts` (+0, -11)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zh.ts` (+0, -10)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zht.ts` (+0, -10)
- `packages/kilo-vscode/webview-ui/agent-manager/new-worktree-models.ts` (+24, -36)
- `packages/kilo-vscode/webview-ui/agent-manager/project-nav.ts` (+10, -38)
- `packages/kilo-vscode/webview-ui/agent-manager/project/live.ts` (+0, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/project/local-tabs.ts` (+21, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/project/registry.ts` (+9, -11)
- `packages/kilo-vscode/webview-ui/agent-manager/project/selection.ts` (+1, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/project/sessions-live.ts` (+2, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/project/state-handlers.ts` (+5, -13)
- `packages/kilo-vscode/webview-ui/agent-manager/selection-actions.ts` (+2, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/sidebar-search.ts` (+2, -173)
- `packages/kilo-vscode/webview-ui/agent-manager/worktree-delete.ts` (+93, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskHeader.tsx` (+41, -1)
- `packages/kilo-vscode/webview-ui/src/components/settings/ExperimentalTab.tsx` (+0, -13)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelSelector.tsx` (+4, -2)
- `packages/kilo-vscode/webview-ui/src/context/model-selection.ts` (+1, -8)
- `packages/kilo-vscode/webview-ui/src/context/model-usage.ts` (+13, -1)
- `packages/kilo-vscode/webview-ui/src/context/provider.tsx` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/context/session-agent.ts` (+18, -0)
- `packages/kilo-vscode/webview-ui/src/context/session-model-preferences.ts` (+15, -39)
- `packages/kilo-vscode/webview-ui/src/context/session-model-selector.ts` (+16, -19)
- `packages/kilo-vscode/webview-ui/src/context/session-model-store.ts` (+24, -53)
- `packages/kilo-vscode/webview-ui/src/context/session-preference-loader.ts` (+0, -55)
- `packages/kilo-vscode/webview-ui/src/context/session-preferences.ts` (+40, -14)
- `packages/kilo-vscode/webview-ui/src/context/session-recovery.ts` (+52, -0)
- `packages/kilo-vscode/webview-ui/src/context/session-types.ts` (+1, -4)
- `packages/kilo-vscode/webview-ui/src/context/session-variant-store.ts` (+2, -4)
- `packages/kilo-vscode/webview-ui/src/context/session-variants.ts` (+17, -39)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+150, -155)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+1, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+1, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+1, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+1, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+1, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+1, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+1, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+1, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+1, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+1, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+1, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+1, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+1, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+1, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+1, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+1, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+1, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+1, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+1, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+1, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+1, -3)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+1, -3)
- `packages/kilo-vscode/webview-ui/src/stories/agent-manager.stories.tsx` (+61, -3)
- `packages/kilo-vscode/webview-ui/src/stories/chat.stories.tsx` (+60, -0)
- `packages/kilo-vscode/webview-ui/src/styles/chat-layout.css` (+3, -2)
- `packages/kilo-vscode/webview-ui/src/styles/task-header.css` (+34, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+3, -10)
- `packages/kilo-vscode/webview-ui/src/types/messages/sessions.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+1, -15)
- `packages/opencode/src/bun-compat.d.ts` (+12, -0)
- `packages/opencode/src/cli/error.ts` (+2, -1)
- `packages/opencode/src/config/config.ts` (+4, -1)
- `packages/opencode/src/config/markdown.ts` (+5, -2)
- `packages/opencode/src/kilocode/background-process/index.ts` (+8, -1)
- `packages/opencode/src/kilocode/config/provider-models.ts` (+40, -0)
- `packages/opencode/src/kilocode/marketplace/relevance.ts` (+103, -0)
- `packages/opencode/src/kilocode/marketplace/schema.ts` (+2, -0)
- `packages/opencode/src/kilocode/plan-followup.ts` (+0, -1)
- `packages/opencode/src/kilocode/provider/catalog-recovery.ts` (+23, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilocode.ts` (+12, -0)
- `packages/opencode/src/provider/model-cache.ts` (+71, -12)
- `packages/opencode/src/provider/models.ts` (+4, -2)
- `packages/opencode/src/provider/provider.ts` (+9, -3)
- `packages/opencode/src/session/prompt.ts` (+2, -1)
- `packages/opencode/test/kilocode/catalog-recovery.test.ts` (+213, -0)
- `packages/opencode/test/kilocode/config-resilience.test.ts` (+39, -0)
- `packages/opencode/test/kilocode/config/markdown.test.ts` (+20, -0)
- `packages/opencode/test/kilocode/config/provider-models.test.ts` (+53, -0)
- `packages/opencode/test/kilocode/marketplace-relevance.test.ts` (+146, -0)
- `packages/opencode/test/kilocode/plan-followup.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/worktree-project-skills.test.ts` (+52, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+1, -0)
- `packages/sdk/openapi.json` (+6, -0)
- `patches/@ff-labs%2Ffff-bun@0.9.4.patch` (+106, -0)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/src/ripgrep.ts
```diff
diff --git a/packages/core/src/ripgrep.ts b/packages/core/src/ripgrep.ts
index 5702b043d..20d35479f 100644
--- a/packages/core/src/ripgrep.ts
+++ b/packages/core/src/ripgrep.ts
@@ -69,6 +69,8 @@ export interface GlobInput {
   readonly follow?: boolean
   readonly signal?: AbortSignal
   readonly validate?: Effect.Effect<void, unknown> // kilocode_change - bind approved searches at spawn
+  readonly noRequireGit?: boolean // kilocode_change - honor ignore files outside a git repository
+  readonly exclude?: readonly string[] // kilocode_change - additional exclusion globs
 }
 
 export interface GrepInput extends KiloGrep.Options {
@@ -93,6 +95,7 @@ export interface SearchResult<A> {
   readonly items: readonly A[]
   readonly truncated: boolean
   readonly partial: boolean
+  readonly invalidPattern?: boolean // kilocode_change - distinguish malformed globs from transient errors
 }
 // kilocode_change end
 
@@ -100,8 +103,12 @@ export class Service extends Context.Service<Service, Interface>()("@opencode/v2
 
 const failure = (message: string, cause?: unknown) => new Error({ message, cause })
 
+// kilocode_change start - also classify invalid globs for the marketplace scan
 const isInvalidPattern = (stderr: string) =>
-  stderr.includes("regex parse error") || stderr.includes("error parsing regex")
+  stderr.includes("regex parse error") ||
+  stderr.includes("error parsing regex") ||
+  stderr.includes("error parsing glob")
+// kilocode_change end
 
 const layer = Layer.effect(
   Service,
@@ -206,6 +213,7 @@ const layer = Layer.effect(
           cwd: input.cwd,
           limit: input.limit,
           signal: input.signal,
+          pattern: input.pattern, // kilocode_change - surface malformed globs instead of a bare partial result
           timeout: 2 * 60 * 1000, // kilocode_change
           validate: input.validate, // kilocode_change - preserve spawn-bound target validation
           args: [
@@ -213,7 +221,9 @@ const layer = Layer.effect(
             "--files",
             ...(input.hidden ? ["--hidden"] : []),
             ...(input.follow ? ["--follow"] : []),
+            ...(input.noRequireGit ? ["--no-require-git"] : []), // kilocode_change
             `--glob=${input.pattern}`,
+            ...(input.exclude ?? []).map((glob) => `--glob=!${glob}`), // kilocode_change
```

#### packages/kilo-vscode/src/agent-manager/orchestration-bridge.ts
```diff
diff --git a/packages/kilo-vscode/src/agent-manager/orchestration-bridge.ts b/packages/kilo-vscode/src/agent-manager/orchestration-bridge.ts
index c4a7858af..2b19a0f17 100644
--- a/packages/kilo-vscode/src/agent-manager/orchestration-bridge.ts
+++ b/packages/kilo-vscode/src/agent-manager/orchestration-bridge.ts
@@ -425,7 +425,6 @@ export class AgentManagerOrchestrationBridge {
         attribute(reply ? peerReply(input.request, reply) : peerPrompt(input.request, input.origin), source),
         MAX_PROMPT,
       ),
-      messageID: input.request.id,
       signal: input.active.controller.signal,
       ...(reply ? { directory: reply.directory } : {}),
       ...(reply ? {} : { managed: this.options.resolve?.(input.request.targetSessionID, input.origin.directory) }),
```

#### packages/kilo-vscode/src/agent-manager/orchestration-domain.ts
```diff
diff --git a/packages/kilo-vscode/src/agent-manager/orchestration-domain.ts b/packages/kilo-vscode/src/agent-manager/orchestration-domain.ts
index 8dcb7dd53..d0699a206 100644
--- a/packages/kilo-vscode/src/agent-manager/orchestration-domain.ts
+++ b/packages/kilo-vscode/src/agent-manager/orchestration-domain.ts
@@ -396,7 +396,6 @@ export async function prompt(input: {
   state: WorktreeStateManager
   sessionID: string
   text: string
-  messageID: string
   signal?: AbortSignal
   managed?: ManagedSession
   directory?: string
@@ -415,7 +414,6 @@ export async function prompt(input: {
     {
       sessionID: input.sessionID,
       directory: target.dir,
-      messageID: `msg_agent_manager_${input.messageID}`,
       parts: [{ type: "text", text: input.text, ...(input.metadata ? { metadata: input.metadata } : {}) }],
       model: input.model,
       variant: input.variant,
```

#### packages/kilo-vscode/tests/unit/agent-manager-orchestration-bridge.test.ts
```diff
diff --git a/packages/kilo-vscode/tests/unit/agent-manager-orchestration-bridge.test.ts b/packages/kilo-vscode/tests/unit/agent-manager-orchestration-bridge.test.ts
index cbf721adf..c053613ea 100644
--- a/packages/kilo-vscode/tests/unit/agent-manager-orchestration-bridge.test.ts
+++ b/packages/kilo-vscode/tests/unit/agent-manager-orchestration-bridge.test.ts
@@ -179,7 +179,6 @@ describe("AgentManagerOrchestrationBridge", () => {
       expect.objectContaining({
         sessionID: "ses_target",
         directory: dir,
-        messageID: "msg_agent_manager_amr_prompt",
         parts: [
           {
             type: "text",
@@ -236,7 +235,6 @@ describe("AgentManagerOrchestrationBridge", () => {
       {
         sessionID: "ses_caller",
         directory: root,
-        messageID: "msg_agent_manager_amr_reply",
         parts: [{ type: "text", text: expect.stringContaining("[Agent Manager peer reply]") }],
         snapshotInitialization: "wait",
       },
@@ -474,7 +472,6 @@ describe("AgentManagerOrchestrationBridge", () => {
     const contexts = new ProjectContexts({
       workspaceRoot: () => root,
       registry: { list: () => [], get: () => undefined },
-      enabled: () => false,
       deps: { log: () => undefined, state: () => state },
     })
     const ctx = contexts.active()!
@@ -596,7 +593,6 @@ describe("AgentManagerOrchestrationBridge", () => {
     const contexts = new ProjectContexts({
       workspaceRoot: () => root,
       registry: { list: () => [], get: () => undefined },
-      enabled: () => false,
       deps: { log: () => undefined, state: () => restored },
     })
     const ctx = contexts.active()!
```

#### packages/kilo-vscode/tests/unit/agent-manager-orchestration-domain.test.ts
```diff
diff --git a/packages/kilo-vscode/tests/unit/agent-manager-orchestration-domain.test.ts b/packages/kilo-vscode/tests/unit/agent-manager-orchestration-domain.test.ts
index 2f9f80146..12000112f 100644
--- a/packages/kilo-vscode/tests/unit/agent-manager-orchestration-domain.test.ts
+++ b/packages/kilo-vscode/tests/unit/agent-manager-orchestration-domain.test.ts
@@ -197,14 +197,13 @@ describe("Agent Manager orchestration domain", () => {
       },
     } as unknown as KiloClient
 
-    await prompt({ client, root, state, sessionID: "ses_target", text: "Continue", messageID: "amr_prompt" })
+    await prompt({ client, root, state, sessionID: "ses_target", text: "Continue" })
 
     expect(get).toHaveBeenCalledWith({ sessionID: "ses_target", directory: worktree })
     expect(promptAsync).toHaveBeenCalledWith(
       {
         sessionID: "ses_target",
         directory: worktree,
-        messageID: "msg_agent_manager_amr_prompt",
         parts: [{ type: "text", text: "Continue" }],
         snapshotInitialization: "wait",
       },
@@ -212,6 +211,26 @@ describe("Agent Manager orchestration domain", () => {
     )
   })
 
+  it("lets the backend assign a chronological message ID so peer prompts are never scoped out (#14643)", async () => {
+    const promptAsync = mock(async (_input: { messageID?: string }) => ({ data: undefined }))
+    const client = {
+      session: {
+        get: mock(async () => ({
+          data: { id: "ses_caller", directory: fs.realpathSync(root), title: "Caller" } as Session,
+        })),
+        promptAsync,
+      },
+      permission: { list: mock(async () => ({ data: [] })) },
+      question: { list: mock(async () => ({ data: noQuestions })) },
+    } as unknown as KiloClient
+
+    await prompt({ client, root, state, sessionID: "ses_caller", directory: root, text: "Peer" })
+
+    const sent = promptAsync.mock.calls.at(0)?.at(0)
+    expect(sent).toBeDefined()
+    expect(sent?.messageID).toBeUndefined()
+  })
+
   it("delivers a reply to a verified original session outside Agent Manager state", async () => {
     const get = mock(async () => ({
       data: { id: "ses_caller", directory: fs.realpathSync(root), title: "Caller" } as Session,
@@ -230,7 +249,6 @@ describe("Agent Manager orchestration domain", () => {
       sessionID: "ses_caller",
       directory: root,
```


## opencode Changes (907b3bc..907b3bc)

### Commits

(no commits)

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
(no changes)

### Key Diffs

(no key diffs to show)

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/src/ripgrep.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/agent-manager/orchestration-bridge.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/agent-manager/orchestration-domain.ts
- `src/core/` - review core changes from packages/kilo-vscode/tests/unit/agent-manager-orchestration-bridge.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/tests/unit/agent-manager-orchestration-domain.test.ts
