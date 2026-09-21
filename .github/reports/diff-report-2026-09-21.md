# Upstream Changes Report
Generated: 2026-09-21 12:11:20

## Summary
- kilocode: 73 commits, 206 files changed
- opencode: 10 commits, 31 files changed

## kilocode Changes (010f511d7..f47c29dfe)

### Commits

- f47c29dfe - feat(vscode): persist diff viewer unified/split style (#14322) (BambinoSK, 2026-09-21)
- f0c95a89c - Merge pull request #14352 from Kilo-Org/fix-session-preview-raf-playback (Marius, 2026-09-21)
- 68bb94c65 - Merge pull request #14349 from Kilo-Org/research-keyboard-navigation-diff-viewer (Marius, 2026-09-21)
- 6d0b301d6 - Merge pull request #14303 from Kilo-Org/update-readme-documentation (Marius, 2026-09-21)
- 7c1719bf4 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-09-21)
- b7739e02d - Merge pull request #14351 from jezdez/fix/bedrock-redacted-content (Marius, 2026-09-21)
- b82c85137 - Merge pull request #13979 from mardausdennis/feat/agent-manager-pin-tabs (Marius, 2026-09-21)
- 409bfa510 - Merge remote-tracking branch 'origin/main' into feat/agent-manager-pin-tabs (marius-kilocode, 2026-09-21)
- e07da9e53 - docs: document display presets, work styles, and session preview (marius-kilocode, 2026-09-21)
- 31875c5e9 - Merge branch 'main' into feat/agent-manager-pin-tabs (marius-kilocode, 2026-09-21)
- 9c8aeaa5c - refactor(agent-manager): keep diff focus wiring under the line cap (marius-kilocode, 2026-09-21)
- f965e5756 - fix(vscode): keep preview playback paused while hidden (marius-kilocode, 2026-09-21)
- dd6e4f451 - refactor(vscode): drive the session preview with paint frames (marius-kilocode, 2026-09-21)
- d5191797f - Merge pull request #14216 from grandmaster451/fix/mcp-probe-content-type (Marius, 2026-09-21)
- 397bbbdfb - fix(agent-manager): gate paste reveal and widen diff delete guard (marius-kilocode, 2026-09-21)
- ce94bda03 - Merge pull request #14348 from Kilo-Org/fix-multi-project-progress-pinner-leak (Marius, 2026-09-21)
- add847659 - Merge pull request #14335 from sylwester-liljegren/feat/semantic-search-scope-reporting (Marius, 2026-09-21)
- fcf5649d5 - Merge pull request #14346 from Kilo-Org/prototype-ui-settings-preview (Marius, 2026-09-21)
- a7d159633 - fix(cli): support Bedrock encrypted reasoning (Jannis Leidel, 2026-09-21)
- fe6eb3c70 - Merge pull request #14324 from hdcodedev/fix/markdown-loose-list-comment-lines (Marius, 2026-09-21)
- de2613e57 - Merge pull request #14345 from Kilo-Org/fix-yaml-frontmatter-parsing-error (Marius, 2026-09-21)
- aa2fb512e - Merge pull request #14344 from Kilo-Org/implement-paged-session-management (Marius, 2026-09-21)
- 1030bdbe5 - feat(agent-manager): support keyboard-only diff review (marius-kilocode, 2026-09-21)
- 24898d57b - fix(vscode): stop background-project session spinners from leaking (marius-kilocode, 2026-09-21)
- 87d9db655 - test(vscode): add display session preview story (marius-kilocode, 2026-09-21)
- c3f2962e8 - refactor(vscode): share display default fallbacks in settings (marius-kilocode, 2026-09-21)
- f98d1f81d - Merge remote-tracking branch 'origin/main' into implement-paged-session-management (marius-kilocode, 2026-09-21)
- 0d1fc1c6f - Merge branch 'prototype-ui-settings-preview' of github.com-kilocode:Kilo-Org/kilocode into prototype-ui-settings-preview (marius-kilocode, 2026-09-21)
- 6969a8506 - Merge commit '677635aae0ebfbe70b965029d58e8aba443a586a' into prototype-ui-settings-preview (marius-kilocode, 2026-09-21)
- 78d901607 - fix(cli): scope dollar-prefixed placeholders to markdown text (marius-kilocode, 2026-09-21)
- 677635aae - Merge pull request #14343 from Kilo-Org/fix/session-cleanup-translations (Marius, 2026-09-21)
- d27ef64a8 - Merge remote-tracking branch 'origin/main' into prototype-ui-settings-preview (marius-kilocode, 2026-09-21)
- 2c4df4ecc - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-21)
- 55b2fc558 - fix(vscode): keep tabs on appended pages and surface deferred load errors (marius-kilocode, 2026-09-21)
- 3394d9022 - fix(cli): scope dollar-prefixed placeholders to untrusted config (marius-kilocode, 2026-09-21)
- 65702ab0d - feat(vscode): preview display settings with a live sample session (marius-kilocode, 2026-09-21)
- 02353b0c9 - fix(cli): preserve dollar-prefixed placeholders in project markdown (marius-kilocode, 2026-09-21)
- 6b6c9c974 - fix(vscode): harden session paging failures and load-more state (marius-kilocode, 2026-09-21)
- e850fc6b0 - fix(vscode): repair session paging stories and load dispatch (marius-kilocode, 2026-09-21)
- fe1d2bbe3 - style(i18n): format session cleanup translations (marius-kilocode, 2026-09-21)
- 83d276a87 - feat(vscode): load older sessions on demand in history (marius-kilocode, 2026-09-21)
- 9d81d4a22 - chore(vscode): add cleanup translation changeset (marius-kilocode, 2026-09-21)
- 41ee4c6eb - fix(i18n): translate session cleanup progress messages (marius-kilocode, 2026-09-21)
- 867e87d02 - Merge pull request #14301 from Kilo-Org/automate-project-creation (Marius, 2026-09-21)
- 6867e1353 - refactor(agent-manager): use a registry presence check when attaching (marius-kilocode, 2026-09-21)
- 2fc7e342f - docs(agent-manager): document the clone URL validator contract (marius-kilocode, 2026-09-21)
- 3b6746c05 - feat(vscode): reintroduce automatic session cleanup (#14054) (V Keerthi Vikram, 2026-09-21)
- a3d17d144 - Merge pull request #14333 from hdcodedev/fix/paste-chip-deletion (Marius, 2026-09-21)
- 623a61e3e - fix(agent-manager): keep expansion updates after init failure (marius-kilocode, 2026-09-21)
- 8b7b8a5eb - fix(cli): correct what Grep and Glob can reach outside the indexed root (Sylwester Liljegren, 2026-09-20)
- be871f386 - feat(cli): report what semantic_search actually searched (Sylwester Liljegren, 2026-09-20)
- 74717eeb0 - fix(vscode): keep the right backing when a paste chip is deleted (hdcode.dev, 2026-09-20)
- 704efcdc2 - fix: add new test (hdcode.dev, 2026-09-20)
- 238aff2ce - fix(vscode): anchor markdown review comments to the right list item (hdcode.dev, 2026-09-20)
- 1c78a8874 - Merge branch 'main' into automate-project-creation (marius-kilocode, 2026-09-19)
- 4e3168cf6 - test(agent-manager): set fixture commit identity explicitly (marius-kilocode, 2026-09-18)
- 79b8dace2 - fix(agent-manager): separate onboarding validation and pool lifecycle (marius-kilocode, 2026-09-18)
- 2c89b6287 - docs: feature Grok 4.6 and drop redundant Opus 5 in README (marius-kilocode, 2026-09-18)
- fc98cc430 - docs: feature Fable 5.1 and DeepSeek V4.1 Flash in README (marius-kilocode, 2026-09-18)
- ab5c3c972 - docs: update README model examples to latest (marius-kilocode, 2026-09-18)
- 9f18ad703 - docs: correct README agent list and --auto description (marius-kilocode, 2026-09-18)
- 52c75646b - fix(agent-manager): tighten bootstrap Git and path guards (marius-kilocode, 2026-09-18)
- 65678927d - test(agent-manager): give project message tests a Git identity (marius-kilocode, 2026-09-18)
- 2af638235 - fix(agent-manager): use a reserved example host in the clone placeholder (marius-kilocode, 2026-09-18)
- 367de7455 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-18)
- c480e8c98 - refactor(agent-manager): share the project parent field (marius-kilocode, 2026-09-18)
- f03ebe3cf - feat(agent-manager): create and clone projects from the sidebar (marius-kilocode, 2026-09-18)
- f4bff7ed6 - fix(cli): match the event stream content type case-insensitively (grandmaster451, 2026-09-17)
- 5c366fa50 - fix(cli): stop repeating the MCP GET stream probe on a non-SSE response (grandmaster451, 2026-09-17)
- 37169daa4 - feat(agent-manager): show the pin marker beside the tab title (mardausdennis, 2026-09-10)
- a6e62c0a9 - feat(agent-manager): put the pin toggle where a pinned tab's close button sits (mardausdennis, 2026-09-10)
- 9d51e6ac0 - fix(agent-manager): keep pinned grouping out of the stored tab order (mardausdennis, 2026-09-10)
- fbdbe1108 - feat(agent-manager): pin session tabs (mardausdennis, 2026-09-09)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/semantic-search-output.ts` (+55, -0)
- `packages/opencode/src/kilocode/tool/semantic-search.ts` (+21, -7)
- `packages/opencode/src/kilocode/tool/semantic-search.txt` (+5, -3)
- `packages/opencode/test/kilocode/tool/semantic-search-output.test.ts` (+70, -0)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/v1/config/config.ts` (+15, -0)

#### Other Changes
- `.changeset/agent-manager-pin-tabs.md` (+5, -0)
- `.changeset/auto-cleanup-reintroduce.md` (+5, -0)
- `.changeset/bright-project-setup.md` (+7, -0)
- `.changeset/diff-keyboard-focus.md` (+5, -0)
- `.changeset/fix-background-project-spinner.md` (+5, -0)
- `.changeset/fix-paste-chip-deletion.md` (+5, -0)
- `.changeset/fuzzy-pandas-reason.md` (+5, -0)
- `.changeset/markdown-loose-list-comment-lines.md` (+5, -0)
- `.changeset/mcp-probe-content-type.md` (+5, -0)
- `.changeset/paged-session-history.md` (+5, -0)
- `.changeset/persist-diff-style.md` (+5, -0)
- `.changeset/preserve-dollar-placeholders.md` (+5, -0)
- `.changeset/quiet-session-preview.md` (+7, -0)
- `.changeset/semantic-search-scope-reporting.md` (+5, -0)
- `.changeset/session-cleanup-translations.md` (+5, -0)
- `README.md` (+2, -3)
- `bun.lock` (+9, -7)
- `nix/hashes.json` (+4, -4)
- `packages/kilo-docs/pages/code-with-ai/features/checkpoints.md` (+31, -0)
- `packages/kilo-docs/pages/getting-started/settings/index.md` (+29, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/work-style-onboarding-200-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/work-style-onboarding-default-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/source-links.md` (+1, -1)
- `packages/kilo-ui/src/components/icon.tsx` (+8, -0)
- `packages/kilo-vscode/package.json` (+5, -0)
- `packages/kilo-vscode/src/DiffVirtualProvider.ts` (+8, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+104, -22)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+5, -5)
- `packages/kilo-vscode/src/agent-manager/GitOps.ts` (+1, -1)
- `packages/kilo-vscode/src/agent-manager/WorktreeManager.ts` (+2, -3)
- `packages/kilo-vscode/src/agent-manager/WorktreeStateManager.ts` (+37, -0)
- `packages/kilo-vscode/src/agent-manager/git-errors.ts` (+3, -0)
- `packages/kilo-vscode/src/agent-manager/home-workspace.ts` (+3, -2)
- `packages/kilo-vscode/src/agent-manager/host.ts` (+14, -1)
- `packages/kilo-vscode/src/agent-manager/project/clone.ts` (+59, -0)
- `packages/kilo-vscode/src/agent-manager/project/context.ts` (+19, -0)
- `packages/kilo-vscode/src/agent-manager/project/init.ts` (+7, -6)
- `packages/kilo-vscode/src/agent-manager/project/messages.ts` (+119, -42)
- `packages/kilo-vscode/src/agent-manager/project/onboarding.ts` (+140, -0)
- `packages/kilo-vscode/src/agent-manager/project/prepare.ts` (+245, -0)
- `packages/kilo-vscode/src/agent-manager/project/registry.ts` (+4, -0)
- `packages/kilo-vscode/src/agent-manager/project/state-gate.ts` (+1, -0)
- `packages/kilo-vscode/src/agent-manager/project/validation.ts` (+13, -0)
- `packages/kilo-vscode/src/agent-manager/project/wiring.ts` (+6, -2)
- `packages/kilo-vscode/src/agent-manager/tab-layout.ts` (+21, -0)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+45, -0)
- `packages/kilo-vscode/src/agent-manager/vscode-host.ts` (+127, -4)
- `packages/kilo-vscode/src/diff/DiffViewerProvider.ts` (+6, -2)
- `packages/kilo-vscode/src/extension.ts` (+6, -0)
- `packages/kilo-vscode/src/kilo-provider-utils.ts` (+118, -32)
- `packages/kilo-vscode/src/kilo-provider/session-page.ts` (+60, -0)
- `packages/kilo-vscode/src/kilo-provider/work-style.ts` (+1, -1)
- `packages/kilo-vscode/src/review-settings.ts` (+18, -0)
- `packages/kilo-vscode/src/services/task-cleanup/failure.ts` (+11, -0)
- `packages/kilo-vscode/src/services/task-cleanup/retention.ts` (+141, -0)
- `packages/kilo-vscode/src/session-status.ts` (+1, -1)
- `packages/kilo-vscode/src/shared/work-style-presets.ts` (+30, -5)
- `packages/kilo-vscode/tests/fixtures/session-provider-activity.tsx` (+2, -0)
- `packages/kilo-vscode/tests/paste-collapse.spec.ts` (+142, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+15, -5)
- `packages/kilo-vscode/tests/unit/agent-manager-provider-lifecycle.test.ts` (+2, -0)
- `packages/kilo-vscode/tests/unit/agent-project-clone.test.ts` (+317, -0)
- `packages/kilo-vscode/tests/unit/agent-project-init.test.ts` (+80, -0)
- `packages/kilo-vscode/tests/unit/agent-project-messages.test.ts` (+263, -17)
- `packages/kilo-vscode/tests/unit/agent-project-onboarding-contract.test.ts` (+51, -0)
- `packages/kilo-vscode/tests/unit/agent-project-prepare.test.ts` (+400, -0)
- `packages/kilo-vscode/tests/unit/agent-project-selection.test.ts` (+9, -0)
- `packages/kilo-vscode/tests/unit/cleanup-poll.test.ts` (+154, -0)
- `packages/kilo-vscode/tests/unit/close-others.test.ts` (+13, -1)
- `packages/kilo-vscode/tests/unit/diff-keyboard-focus.test.ts` (+496, -0)
- `packages/kilo-vscode/tests/unit/diff-style-persistence.test.ts` (+57, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-followup.test.ts` (+66, -20)
- `packages/kilo-vscode/tests/unit/kilo-provider-load-messages.test.ts` (+71, -1)
- `packages/kilo-vscode/tests/unit/kilo-provider-session-refresh.test.ts` (+100, -10)
- `packages/kilo-vscode/tests/unit/prompt-input-utils.test.ts` (+94, -0)
- `packages/kilo-vscode/tests/unit/review-comments.test.ts` (+78, -0)
- `packages/kilo-vscode/tests/unit/review-scroll.test.ts` (+128, -0)
- `packages/kilo-vscode/tests/unit/session-page.test.ts` (+62, -0)
- `packages/kilo-vscode/tests/unit/session-paging.test.ts` (+53, -0)
- `packages/kilo-vscode/tests/unit/session-preview-playback.test.ts` (+176, -0)
- `packages/kilo-vscode/tests/unit/tab-drag.test.ts` (+151, -0)
- `packages/kilo-vscode/tests/unit/tab-order.test.ts` (+49, -0)
- `packages/kilo-vscode/tests/unit/work-style-apply.test.ts` (+48, -5)
- `packages/kilo-vscode/tests/unit/work-style-presets.test.ts` (+49, -5)
- `packages/kilo-vscode/tests/unit/worktree-state-manager.test.ts` (+64, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+30, -29)
- `packages/kilo-vscode/webview-ui/agent-manager/CloneProjectDialog.tsx` (+88, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/DiffPanel.tsx` (+70, -56)
- `packages/kilo-vscode/webview-ui/agent-manager/NewProjectDialog.tsx` (+74, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectList.tsx` (+12, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectParentField.tsx` (+34, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectsFooter.tsx` (+34, -17)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectsSection.tsx` (+3, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+134, -10)
- `packages/kilo-vscode/webview-ui/agent-manager/close-others.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/diff-focus.ts` (+18, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/diff-panel-focus.ts` (+177, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/focus.ts` (+7, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+18, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fa.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fr.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/it.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ja.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ko.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/nl.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/no.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/pl.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ru.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/th.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/tr.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/uk.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zh.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zht.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/project-utils.ts` (+9, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/project/store.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/sortable-tab.tsx` (+6, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/tab-drag.ts` (+40, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/tab-order.ts` (+28, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/tab-persistence.ts` (+48, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/tab-rendering.tsx` (+4, -0)
- `packages/kilo-vscode/webview-ui/diff-viewer/DiffViewerApp.tsx` (+13, -2)
- `packages/kilo-vscode/webview-ui/diff-viewer/FullScreenDiffView.tsx` (+71, -66)
- `packages/kilo-vscode/webview-ui/diff-viewer/markdown-comment-ranges.ts` (+10, -1)
- `packages/kilo-vscode/webview-ui/diff-viewer/review-controller.ts` (+2, -5)
- `packages/kilo-vscode/webview-ui/diff-viewer/review-scroll.ts` (+40, -0)
- `packages/kilo-vscode/webview-ui/diff-virtual/DiffVirtualApp.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+27, -6)
- `packages/kilo-vscode/webview-ui/src/components/chat/SessionTab.tsx` (+40, -22)
- `packages/kilo-vscode/webview-ui/src/components/chat/SessionTabMenu.tsx` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/TabDnd.tsx` (+3, -10)
- `packages/kilo-vscode/webview-ui/src/components/chat/prompt-input-utils.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/components/history/SessionList.tsx` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/CheckpointsTab.tsx` (+152, -2)
- `packages/kilo-vscode/webview-ui/src/components/settings/DisplayTab.tsx` (+66, -10)
- `packages/kilo-vscode/webview-ui/src/components/settings/SessionPreview.tsx` (+235, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/cleanup.ts` (+62, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/session-preview-playback.ts` (+56, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/settings-io.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/context/local-tabs.tsx` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/context/session-paging.ts` (+59, -0)
- `packages/kilo-vscode/webview-ui/src/context/session-types.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+17, -23)
- `packages/kilo-vscode/webview-ui/src/hooks/usePasteCollapse.ts` (+25, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+37, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+40, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+39, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+40, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+41, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+39, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+43, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+38, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+41, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+43, -5)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+39, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+37, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+41, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+39, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+40, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+39, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+37, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+42, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+41, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+35, -5)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+35, -5)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/stories/history.stories.tsx` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/stories/settings.stories.tsx` (+18, -0)
- `packages/kilo-vscode/webview-ui/src/styles/history.css` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/styles/settings.css` (+84, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/config.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+43, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+56, -0)
- `packages/kilo-vscode/webview-ui/src/utils/focus.ts` (+59, -0)
- `packages/kilo-vscode/webview-ui/src/utils/prompt-mention-drop.ts` (+17, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/config/agent.ts` (+1, -0)
- `packages/opencode/src/config/variable.ts` (+14, -5)
- `packages/opencode/src/kilocode/config/markdown.ts` (+1, -0)
- `packages/opencode/src/kilocode/mcp/sse-probe.ts` (+25, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/kilocode.ts` (+56, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilocode.ts` (+26, -0)
- `packages/opencode/src/kilocode/session/retention.ts` (+377, -0)
- `packages/opencode/src/mcp/index.ts` (+2, -0)
- `packages/opencode/src/session/status.ts` (+11, -0)
- `packages/opencode/test/kilocode/config/markdown.test.ts` (+51, -0)
- `packages/opencode/test/kilocode/mcp-sse-probe.test.ts` (+124, -0)
- `packages/opencode/test/kilocode/semantic-search.test.ts` (+28, -3)
- `packages/opencode/test/kilocode/server/httpapi-exercise-scenarios.ts` (+42, -0)
- `packages/opencode/test/kilocode/session/retention-bench.test.ts` (+91, -0)
- `packages/opencode/test/kilocode/session/retention.test.ts` (+559, -0)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+86, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+107, -0)
- `packages/sdk/openapi.json` (+587, -0)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 0ef1067b2..097e0cd59 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -84,7 +84,7 @@
     "xdg-basedir": "5.1.0",
     "zod": "catalog:",
     "@ai-sdk/alibaba": "1.0.17",
-    "@ai-sdk/amazon-bedrock": "4.0.112",
+    "@ai-sdk/amazon-bedrock": "4.0.166",
     "@ai-sdk/anthropic": "3.0.82",
     "@ai-sdk/azure": "3.0.93",
     "@ai-sdk/cerebras": "2.0.54",
```

#### packages/core/src/v1/config/config.ts
```diff
diff --git a/packages/core/src/v1/config/config.ts b/packages/core/src/v1/config/config.ts
index 8a2c01934..86fad2ced 100644
--- a/packages/core/src/v1/config/config.ts
+++ b/packages/core/src/v1/config/config.ts
@@ -81,6 +81,21 @@ export const Info = Schema.Struct({
     description:
       "Enable or disable snapshot tracking. When false, filesystem snapshots are not recorded and undoing or reverting will not undo/redo file changes. Defaults to true.",
   }),
+  // kilocode_change start - machine-wide session retention policy, owned by the backend
+  retention: Schema.optional(
+    Schema.Struct({
+      enabled: Schema.optional(Schema.Boolean).annotate({
+        description:
+          "Enable automatic deletion of old sessions across all projects and every Kilo client on this machine. Defaults to false; deletion is permanent.",
+      }),
+      maxAgeDays: Schema.optional(Schema.Number).annotate({
+        description: "Days a session is kept before retention deletes it. Defaults to 30, minimum 1.",
+      }),
+    }),
+  ).annotate({
+    description: "Machine-wide session retention. Evaluated by the backend; clients only trigger runs.",
+  }),
+  // kilocode_change end
   plugin: Schema.optional(Schema.mutable(Schema.Array(ConfigPluginV1.Spec))),
   share: Schema.optional(Schema.Literals(["manual", "auto", "disabled"])).annotate({
     description:
```

#### packages/opencode/src/kilocode/tool/semantic-search-output.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/semantic-search-output.ts b/packages/opencode/src/kilocode/tool/semantic-search-output.ts
new file mode 100644
index 000000000..ca34e92a7
--- /dev/null
+++ b/packages/opencode/src/kilocode/tool/semantic-search-output.ts
@@ -0,0 +1,55 @@
+import type { IndexingStatus } from "@kilocode/kilo-indexing/status"
+
+/**
+ * Output text for `semantic_search`.
+ *
+ * Split from the tool so it can be exercised without booting the indexing
+ * worker: the wording is the whole point of the behavior, not an incidental
+ * detail of it.
+ */
+
+export function normalizePath(value: string): string {
+  return value.replaceAll("\\", "/")
+}
+
+/** Human-readable description of what was actually searched. */
+export function scope(root: string, prefix?: string): string {
+  return prefix ? `${root}/${normalizePath(prefix)}` : root
+}
+
+/**
+ * Explain an empty result set in terms of index state.
+ *
+ * `KiloIndexing.search` returns `[]` when the index is disabled, unbuilt, or
+ * broken, which is indistinguishable from a genuine miss. Left unexplained, a
+ * model reads "no results" as "this code does not exist" and acts on it.
+ */
+export function reason(status?: IndexingStatus): string {
+  if (!status) return "The index could not be queried, so this is not evidence that no matching code exists."
+  const detail = status.message.trim()
+  const suffix = detail ? ` ${detail}` : ""
+  if (status.state === "Disabled") {
+    return `Codebase indexing is disabled for this project, so nothing was searched.${suffix}`
+  }
+  if (status.state === "Error") return `Codebase indexing failed, so nothing was searched.${suffix}`
+  if (status.state === "In Progress") {
+    return `The index is still building (${status.percent}%, ${status.processedFiles}/${status.totalFiles} files), so results are incomplete.`
+  }
+  if (status.state === "Standby") return `The index is not active, so results are incomplete.${suffix}`
+  return "The index is up to date, so no semantically similar code exists in this scope."
+}
+
+/**
+ * Full output for a search that matched nothing.
+ *
```

#### packages/opencode/src/kilocode/tool/semantic-search.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/semantic-search.ts b/packages/opencode/src/kilocode/tool/semantic-search.ts
index 9bbbc85a3..dfa632b73 100644
--- a/packages/opencode/src/kilocode/tool/semantic-search.ts
+++ b/packages/opencode/src/kilocode/tool/semantic-search.ts
@@ -3,6 +3,7 @@ import path from "path"
 import * as Tool from "@/tool/tool"
 import { KiloIndexing } from "@/kilocode/indexing"
 import { Instance } from "@/kilocode/instance"
+import { empty, normalizePath, scope } from "./semantic-search-output"
 
 import DESCRIPTION from "./semantic-search.txt"
 
@@ -12,7 +13,7 @@ const Parameters = Schema.Struct({
   }),
   path: Schema.optional(Schema.String).annotate({
     description:
-      "Limit search to specific subdirectory (relative to the current workspace directory). Leave empty for entire workspace.",
+      "Limit search to a subdirectory, relative to the indexed root. Leave empty to search the whole indexed root.",
   }),
 })
 
@@ -26,6 +27,10 @@ type SearchResult = {
 
 type Meta = {
   results: SearchResult[]
+  /** Absolute root the index covers, so a caller can tell what was actually searched. */
+  root: string
+  /** Index state at query time; only resolved when nothing matched. */
+  state?: KiloIndexing.Status["state"]
 }
 
 export const SemanticSearchTool = Tool.define(
@@ -53,6 +58,7 @@ export const SemanticSearchTool = Tool.define(
         })
 
         const prefix = normalizeSearchPath(params.path)
+        const root = normalizePath(Instance.directory)
         const matches = yield* Effect.promise(() => KiloIndexing.search(params.query, prefix))
 
         const results = matches.flatMap<SearchResult>((item) => {
@@ -79,17 +85,28 @@ export const SemanticSearchTool = Tool.define(
         })
 
         if (results.length === 0) {
+          // An empty result set is ambiguous: the index may be disabled, still
+          // building, or broken. Report which, so the caller does not read this
+          // as proof that no matching code exists.
+          const status = yield* Effect.promise(() =>
+            KiloIndexing.current().then(
+              (value) => value,
```

#### packages/opencode/src/kilocode/tool/semantic-search.txt
```diff
diff --git a/packages/opencode/src/kilocode/tool/semantic-search.txt b/packages/opencode/src/kilocode/tool/semantic-search.txt
index 63b8ef158..0cf5eda38 100644
--- a/packages/opencode/src/kilocode/tool/semantic-search.txt
+++ b/packages/opencode/src/kilocode/tool/semantic-search.txt
@@ -11,7 +11,7 @@ follow up with Grep and Read. Prefer Grep directly when exact terms are already
 - Search for an exact symbol or regex pattern — use `Grep`
 - Find files by filename or extension — use `Glob`
 - Read the contents of a known file — use `Read`
-- Explore files outside the current workspace - use `Grep`, `Glob`, and `Read`
+- Explore files outside the indexed root — use `Read`, `Grep` or `Glob` with an absolute path. They search the indexed root by default and need `external_directory` approval to go beyond it, but they can get there; this tool cannot.
 
 ## Examples
 
@@ -23,5 +23,7 @@ follow up with Grep and Read. Prefer Grep directly when exact terms are already
 ## Constraints
 
 - Write the query in English.
-- Searches the entire current workspace by default. Limit semantic search to one subdirectory with `path`.
-- Cannot search outside the current workspace. Use other tools if this functionality is needed.
+- Searches one indexed root: the project directory of the current session. Limit the search to a subdirectory of that root with `path`.
+- In a multi-root editor workspace, only that one root is indexed. Files in other workspace folders are not searchable here even though they may appear as `@` mentions.
+- Cannot search outside the indexed root. Reach those files with `Read`, `Grep` or `Glob` on an absolute path instead.
+- Empty results are not proof that no matching code exists. The output states whether the index was complete, still building, disabled, or failed; read it before concluding anything.
```


*... and more files (showing first 5)*

## opencode Changes (ebb7b76..70a2469)

### Commits

- 70a2469 - fix(console): authenticate inference proxy (Frank, 2026-09-21)
- cf494c2 - fix(console): forward client IP to inference (Frank, 2026-09-21)
- c101347 - fix(opencode): hoist Bedrock tool images except Claude, Nova, and Llama 4 (#50272) (Aiden Cline, 2026-09-20)
- 0e3dfd1 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-09-21)
- 8bf288e - fix(opencode): bump togetherai so streams report usage (#50264) (Aiden Cline, 2026-09-20)
- 17b7678 - docs(web): extend DeepSeek promotion (#50255) (Jack, 2026-09-21)
- d870e22 - fix(stats): retry transient query failures (#50205) (Adam, 2026-09-20)
- 45ad8dc - fix(stats): paginate sync aggregates (#50198) (Adam, 2026-09-20)
- 8b2de73 - chore: generate (opencode-agent[bot], 2026-09-20)
- ac88182 - ci: sync v2 catalog once a day (#50194) (Aiden Cline, 2026-09-20)

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
- `packages/stats/core/src/domain/inference.test.ts` (+1, -1)
- `packages/stats/core/src/domain/inference.ts` (+3, -4)
- `packages/stats/core/src/r2-sql.test.ts` (+94, -1)
- `packages/stats/core/src/r2-sql.ts` (+110, -71)
- `packages/stats/core/src/stat-sync.ts` (+1, -1)

#### Other Changes
- `.github/workflows/models-snapshot.yml` (+1, -1)
- `bun.lock` (+7, -41)
- `infra/console.ts` (+1, -0)
- `nix/hashes.json` (+4, -4)
- `packages/console/app/src/lib/inference-proxy.ts` (+2, -1)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/session/message-v2.ts` (+5, -1)
- `packages/web/src/content/docs/ar/go.mdx` (+3, -3)
- `packages/web/src/content/docs/bs/go.mdx` (+3, -3)
- `packages/web/src/content/docs/da/go.mdx` (+3, -3)
- `packages/web/src/content/docs/de/go.mdx` (+3, -3)
- `packages/web/src/content/docs/es/go.mdx` (+3, -3)
- `packages/web/src/content/docs/fr/go.mdx` (+3, -3)
- `packages/web/src/content/docs/go.mdx` (+3, -3)
- `packages/web/src/content/docs/it/go.mdx` (+3, -3)
- `packages/web/src/content/docs/ja/go.mdx` (+3, -3)
- `packages/web/src/content/docs/ko/go.mdx` (+3, -3)
- `packages/web/src/content/docs/nb/go.mdx` (+3, -3)
- `packages/web/src/content/docs/pl/go.mdx` (+3, -3)
- `packages/web/src/content/docs/pt-br/go.mdx` (+3, -3)
- `packages/web/src/content/docs/ru/go.mdx` (+3, -3)
- `packages/web/src/content/docs/th/go.mdx` (+3, -3)
- `packages/web/src/content/docs/tr/go.mdx` (+3, -3)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+3, -3)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+3, -3)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 2b465e5..72e834c 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -78,7 +78,7 @@
     "@ai-sdk/perplexity": "3.0.26",
     "@ai-sdk/provider": "3.0.16",
     "@ai-sdk/provider-utils": "4.0.51",
-    "@ai-sdk/togetherai": "2.0.41",
+    "@ai-sdk/togetherai": "2.0.68",
     "@ai-sdk/vercel": "2.0.39",
     "@ai-sdk/xai": "3.0.102",
     "@aws-sdk/credential-providers": "3.1057.0",
```

#### packages/stats/core/src/domain/inference.test.ts
```diff
diff --git a/packages/stats/core/src/domain/inference.test.ts b/packages/stats/core/src/domain/inference.test.ts
index 8f7f437..7563f18 100644
--- a/packages/stats/core/src/domain/inference.test.ts
+++ b/packages/stats/core/src/domain/inference.test.ts
@@ -221,7 +221,7 @@ describe("inference stat normalization", () => {
     expect(queries[0]).toContain("OR lower(raw_model) IN ('gpt-5-nano', 'grok-code', 'big-pickle')")
     expect(queries[0]).toContain("OR lower(raw_model) LIKE '%-free'")
     expect(queries[0]).toContain("THEN 'Free'")
-    expect(queries[0]).toContain("LIMIT 10000")
+    expect(queries[0]).not.toContain("LIMIT")
     expect(queries[0]).toContain("approx_distinct(session) AS sessions")
     expect(queries[1]).toContain("'geo_model' ELSE 'geo'")
     expect(queries[1]).toContain("0 AS sessions")
```

#### packages/stats/core/src/domain/inference.ts
```diff
diff --git a/packages/stats/core/src/domain/inference.ts b/packages/stats/core/src/domain/inference.ts
index 9635166..fb45188 100644
--- a/packages/stats/core/src/domain/inference.ts
+++ b/packages/stats/core/src/domain/inference.ts
@@ -36,9 +36,9 @@ const WEEK_MS = 7 * DAY_MS
 // from both sources.
 const LIVE_SOURCE_START = "2026-08-11T10:57:48.186Z"
 
-// R2 SQL limits result sets to 10,000 rows and does not support OFFSET. Two
-// queries per day/week keep each result bounded and avoid combining the costly
-// distinct user/session aggregates with the high-cardinality geo dimensions.
+// R2 SQL results are cursor-paginated after aggregation. Separate usage and geo
+// queries per day/week avoid combining costly distinct user/session aggregates
+// with the high-cardinality geo dimensions.
 export function buildStatsQueries(periodStart: Date, periodEnd: Date, input?: StatsQuerySource) {
   const source = input ?? {
     namespace: Resource.R2Sql.namespace,
@@ -327,7 +327,6 @@ FROM filtered
 GROUP BY GROUPING SETS (
   ${groupingSets}
 )
-LIMIT 10000
 `
 }
 
```

#### packages/stats/core/src/r2-sql.test.ts
```diff
diff --git a/packages/stats/core/src/r2-sql.test.ts b/packages/stats/core/src/r2-sql.test.ts
index b02f429..1077a14 100644
--- a/packages/stats/core/src/r2-sql.test.ts
+++ b/packages/stats/core/src/r2-sql.test.ts
@@ -1,5 +1,7 @@
+import { Database } from "bun:sqlite"
+import { Effect } from "effect"
 import { expect, test } from "bun:test"
-import { R2SqlQueryError } from "./r2-sql"
+import { queryR2SqlPages, R2SqlQueryError, type R2SqlData } from "./r2-sql"
 
 test("includes the transport failure in the message used by sync logging", () => {
   const cause = new DOMException("The operation timed out.", "TimeoutError")
@@ -16,3 +18,94 @@ test("preserves an R2 response error and request details", () => {
   expect(error.status).toBe(400)
   expect(error.requestId).toBe("test-request")
 })
+
+// Execute the generated pagination SQL against real aggregate rows, including
+// groups that share country/model prefixes across a page boundary.
+for (const count of [0, 9999, 10000, 10001, 20005]) {
+  test(`reads all ${count} aggregate rows without losing or repeating groups`, async () => {
+    using db = new Database(":memory:")
+    db.run("CREATE TABLE aggregates (dimension TEXT, model TEXT, country TEXT, requests TEXT)")
+    db.transaction(() => {
+      const insert = db.prepare("INSERT INTO aggregates VALUES (?, ?, ?, ?)")
+      Array.from({ length: count }, (_, index) => {
+        insert.run(
+          index < 2 ? "geo" : "geo_model",
+          index < 2 ? null : `model'${Math.floor(index / 3)}`,
+          `country${index % 3}`,
+          String(index + 1),
+        )
+      })
+    })()
+    const pages: number[] = []
+    const rows = await Effect.runPromise(
+      queryR2SqlPages("SELECT * FROM aggregates", ["dimension", "model", "country"], (query) =>
+        Effect.sync(() => {
+          const rows = db.query(query).all() as R2SqlData[]
+          pages.push(rows.length)
+          return rows
+        }),
+      ),
+    )
+    expect(rows).toHaveLength(count)
+    expect(new Set(rows.map((row) => row.requests)).size).toBe(count)
+    expect(rows.reduce((sum, row) => sum + Number(row.requests), 0)).toBe((count * (count + 1)) / 2)
+    expect(pages).toHaveLength(Math.floor(count / 10000) + 1)
+    expect(pages.at(-1)).toBe(count % 10000)
```

#### packages/stats/core/src/r2-sql.ts
```diff
diff --git a/packages/stats/core/src/r2-sql.ts b/packages/stats/core/src/r2-sql.ts
index 1941d43..a3509c2 100644
--- a/packages/stats/core/src/r2-sql.ts
+++ b/packages/stats/core/src/r2-sql.ts
@@ -1,4 +1,4 @@
-import { Context, Effect, Layer, Schema } from "effect"
+import { Context, Effect, Layer, Schedule, Schema } from "effect"
 import { Resource } from "sst/resource"
 
 const R2_SQL_MAX_ROWS = 10_000
@@ -16,6 +16,7 @@ const R2SqlResponse = Schema.Struct({
   ),
   errors: Schema.Array(Schema.Unknown),
 })
+const R2SqlApiError = Schema.Struct({ code: Schema.Number, message: Schema.String })
 const decodeResponse = Schema.decodeUnknownEffect(Schema.fromJsonString(R2SqlResponse))
 
 export type R2SqlData = Record<string, string>
@@ -24,20 +25,22 @@ export class R2SqlQueryError extends Error {
   readonly _tag = "R2SqlQueryError"
   readonly requestId?: string
   readonly status?: number
+  readonly code?: number
 
-  constructor(input: { message: string; requestId?: string; status?: number; cause?: unknown }) {
+  constructor(input: { message: string; requestId?: string; status?: number; code?: number; cause?: unknown }) {
     super(input.cause instanceof Error ? `${input.message}: ${input.cause.toString()}` : input.message, {
       cause: input.cause,
     })
     this.name = "R2SqlQueryError"
     this.requestId = input.requestId
     this.status = input.status
+    this.code = input.code
   }
 }
 
 export declare namespace R2Sql {
   export interface Service {
-    readonly query: (query: string) => Effect.Effect<R2SqlData[], R2SqlQueryError>
+    readonly query: (query: string, columns?: readonly string[]) => Effect.Effect<R2SqlData[], R2SqlQueryError>
   }
 }
 
@@ -45,75 +48,111 @@ export class R2Sql extends Context.Service<R2Sql, R2Sql.Service>()("@opencode/st
   static readonly layer: Layer.Layer<R2Sql> = Layer.succeed(
     R2Sql,
     R2Sql.of({
-      query: Effect.fn("R2Sql.query")(function* (query: string) {
-        const startedAt = Date.now()
-        const response = yield* Effect.tryPromise({
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/src/v1/config/config.ts
- `src/tool/semantic-search-output.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/semantic-search-output.test.ts changes
- `src/tool/semantic-search-output.ts` - update based on kilocode packages/opencode/src/kilocode/tool/semantic-search-output.ts changes
- `src/tool/semantic-search.ts` - update based on kilocode packages/opencode/src/kilocode/tool/semantic-search.ts changes
- `src/tool/semantic-search.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/semantic-search.txt changes
