# Upstream Changes Report
Generated: 2026-10-01 12:35:33

## Summary
- kilocode: 102 commits, 252 files changed
- opencode: 7 commits, 41 files changed

## kilocode Changes (c98f8740c..fdebb0e10)

### Commits

- fdebb0e10 - release: v7.8.2 (kilo-maintainer[bot], 2026-10-01)
- 40127d260 - Merge pull request #14630 from Kilo-Org/feat/custom-provider-fetch-models (Bruno Agatão, 2026-10-01)
- b4dd1dbf9 - Merge pull request #14634 from Kilo-Org/feat/documents-copy-content (Bruno Agatão, 2026-10-01)
- a7b70f8b5 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-10-01)
- 64109694d - Merge pull request #14708 from Kilo-Org/suggest-tool-rendering (Marius, 2026-10-01)
- 81636932e - fix(vscode): keep background agent avatar pulse smooth (#14711) (Marius, 2026-10-01)
- 2d6d0a03c - feat: suggest files from every folder in a multi-root workspace (sylwester-liljegren, 2026-10-01)
- 7de049a24 - fix(vscode): keep background agent avatar pulse smooth (marius-kilocode, 2026-10-01)
- dfb23a4e6 - Merge pull request #14709 from Kilo-Org/fix/goal-fork-controls-windows-interrupt (Marius, 2026-10-01)
- 6b65537d8 - Merge pull request #14676 from Kilo-Org/fix-output-limit-mismatch (Marius, 2026-10-01)
- e9b36a6ca - Merge pull request #14686 from Kilo-Org/investigate-python-snippet-rendering-delay (Marius, 2026-10-01)
- c3f1e509e - fix(cli): use Claude family for output token limits (marius-kilocode, 2026-10-01)
- e07c47698 - Merge pull request #14707 from Kilo-Org/kilo/add-to-context-last-focused-chat (Marius, 2026-10-01)
- c8aaebf47 - fix(tui): render suggest tool actions (Jean du Plessis, 2026-10-01)
- 1988e54fd - fix(cli): keep storage usable after an interrupted first access (marius-kilocode, 2026-10-01)
- 6779f059b - Merge commit 'e0c27aa71f23f3b94916a9327eb22cd06bc28f0c' into fix-output-limit-mismatch (marius-kilocode, 2026-10-01)
- f40ebddb7 - fix(vscode): attach Add to Context to the last focused chat (marius-kilocode, 2026-10-01)
- e0c27aa71 - Merge pull request #14699 from Kilo-Org/docs/chatgpt-app-limits-quota (Emilie Lima Schario, 2026-09-30)
- 4fa44a3f8 - docs: link OpenAI help articles from per-app quota callout (kiloconnect[bot], 2026-09-30)
- 907d71273 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-09-30)
- 8ae447325 - docs: note OpenAI per-app usage quota on ChatGPT subscription page (kiloconnect[bot], 2026-09-30)
- ccb6673bf - Merge pull request #14691 from Kilo-Org/chore/kilo-docs-vitest-js-yaml (Bruno Agatão, 2026-09-30)
- d959b67d3 - Merge branch 'main' into chore/kilo-docs-vitest-js-yaml (Bruno Agatão, 2026-09-30)
- 490246ec9 - Merge pull request #14663 from Kilo-Org/plucky-keyboard (Kirill Kalishev, 2026-09-30)
- d7b67dd44 - Merge branch 'main' into chore/kilo-docs-vitest-js-yaml (Bruno Agatão, 2026-09-30)
- e211707e3 - Merge pull request #14696 from Kilo-Org/fix/sbom-test-okhttp-version (Bruno Agatão, 2026-09-30)
- b828228af - test(sbom): read okhttp version from the JetBrains catalog (Bruno Agatao, 2026-09-30)
- ed10571e3 - chore(jetbrains): bump the jetbrains-minor-patch group in /packages/kilo-jetbrains with 12 updates (#14558) (dependabot[bot], 2026-09-30)
- 245cce690 - fix(kilo-docs): sync bun.lock with vitest and js-yaml bumps (Bruno Agatao, 2026-09-30)
- bbcfe60e3 - Merge pull request #14648 from Kilo-Org/electric-acorn (Kirill Kalishev, 2026-09-30)
- 6cec9571a - Merge pull request #14666 from Kilo-Org/polished-harvest (Kirill Kalishev, 2026-09-30)
- 8212e73bc - Merge pull request #14670 from Kilo-Org/fearless-quokka (Kirill Kalishev, 2026-09-30)
- 941635d07 - Merge pull request #14599 from Kilo-Org/docs/auto-sync/cloud-mobile (Anil Kulkarni, 2026-09-30)
- c967f89f4 - Merge branch 'main' into docs/auto-sync/cloud-mobile (Anil Kulkarni, 2026-09-30)
- ddef3c053 - Merge pull request #14559 from Kilo-Org/dependabot/gradle/packages/kilo-jetbrains/okhttp-5.5.0 (Bruno Agatão, 2026-09-30)
- 4656671c9 - Merge pull request #14671 from Kilo-Org/docs/auto-sync/gateway (Joshua Lambert, 2026-09-30)
- 92a822ae1 - Merge branch 'main' into docs/auto-sync/gateway (Joshua Lambert, 2026-09-30)
- 5cbc80f73 - Apply suggestion from @lambertjosh (Joshua Lambert, 2026-09-30)
- 687669359 - Merge branch 'main' into dependabot/gradle/packages/kilo-jetbrains/okhttp-5.5.0 (Bruno Agatao, 2026-09-30)
- f0aa349b0 - Merge pull request #14692 from Kilo-Org/docs/nebius-provider (Rietie, 2026-09-30)
- f8caa139b - docs: address review feedback on Nebius provider page (Rietie, 2026-09-30)
- 25700564f - Merge pull request #14560 from Kilo-Org/dependabot/gradle/packages/kilo-jetbrains/org.junit.vintage-junit-vintage-engine-6.1.3 (Bruno Agatão, 2026-09-30)
- 68ca67d55 - docs: add screenshots and enterprise note to Nebius provider page (Rietie, 2026-09-30)
- a168ce241 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-09-30)
- d0cb8179b - Merge pull request #14690 from Kilo-Org/chore-manual-security-updates (Bruno Agatão, 2026-09-30)
- e889d564c - Merge branch 'main' into dependabot/gradle/packages/kilo-jetbrains/org.junit.vintage-junit-vintage-engine-6.1.3 (Bruno Agatão, 2026-09-30)
- 0686aed6f - fix(kilo-docs): bump vitest and js-yaml for security alerts (Bruno Agatao, 2026-09-30)
- d6cd2b595 - docs: add Nebius Token Factory provider page (kiloconnect[bot], 2026-09-30)
- 39b3737e6 - chore(cli): bump secretlint core and preset to 13.0.5 (Bruno Agatao, 2026-09-30)
- fbde5b882 - Merge pull request #14682 from Kilo-Org/feat/subagent-stop-status (Marius, 2026-09-30)
- 0d5431f90 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-30)
- dcbd9177e - Merge branch 'main' into dependabot/gradle/packages/kilo-jetbrains/okhttp-5.5.0 (Bruno Agatão, 2026-09-30)
- 81faa5f8b - fix(vscode): restore the goal label reserve and drop the unused dismiss key (marius-kilocode, 2026-09-30)
- 5b942540e - Merge pull request #14684 from Kilo-Org/feat/marketplace-suggestion-view-details (Marius, 2026-09-30)
- 878de0d75 - Merge commit '8d304fc62c12fca701d9f9a5eead04c6cb0f2468' into feat/subagent-stop-status (marius-kilocode, 2026-09-30)
- 99476546a - fix(vscode): restart copy confirmation timer only after a successful write (Bruno Agatao, 2026-09-30)
- 17abdb9e0 - refactor(vscode): simplify document copy state and harden select-all (Bruno Agatao, 2026-09-30)
- 2e8a54828 - fix(vscode): use canonical document path for copy actions (Bruno Agatao, 2026-09-30)
- 78a6e90a8 - feat(vscode): move background agent controls into the dock stack panel (marius-kilocode, 2026-09-30)
- 46e7cb251 - fix(vscode): harden marketplace focus state (marius-kilocode, 2026-09-30)
- 8d304fc62 - Merge pull request #14660 from Kilo-Org/fix/jetbrains-gradle-registering-deprecation (Bruno Agatão, 2026-09-30)
- 6a903cfbc - Merge pull request #14661 from Kilo-Org/feat/stale-bot-pr-detect-ci-failure (Bruno Agatão, 2026-09-30)
- 2d09a5cde - fix(vscode): open suggested item in Marketplace panel (marius-kilocode, 2026-09-30)
- d3966e549 - fix(ui): highlight settled code blocks when worker highlighting fails (marius-kilocode, 2026-09-30)
- 59da023ec - fix(vscode): address marketplace suggestion review feedback (marius-kilocode, 2026-09-30)
- 8bdec8cb3 - feat(vscode): add View details action to marketplace suggestion notifications (kiloconnect[bot], 2026-09-30)
- e40e0e83e - Merge commit 'c98f8740c13a7fdbacc6313d47fcaa4482457064' into fix-output-limit-mismatch (marius-kilocode, 2026-09-30)
- ff7e165b6 - fix(vscode): open background agents in a menu at the stack and sync avatar pulses (marius-kilocode, 2026-09-30)
- 2427d027f - fix(vscode): share background job status between stack and stop tooltip (marius-kilocode, 2026-09-30)
- 979e02c57 - feat(vscode): stop single sub-agents and show background agent status (marius-kilocode, 2026-09-30)
- 9f5cbf7b7 - test(cli): update Claude fixture for full output limit (marius-kilocode, 2026-09-30)
- f05a4fdc3 - fix(cli): request full output limit for Claude (marius-kilocode, 2026-09-30)
- 2898cf955 - Merge remote-tracking branch 'origin/main' into HEAD (github-actions[bot], 2026-09-30)
- 6e58db8e1 - docs: sync gateway with merged PRs (2026-09-30) (github-actions[bot], 2026-09-30)
- 2dbc7b127 - test(jetbrains): cover dialog shortcut routing (kirillk, 2026-09-29)
- ce91d059e - feat(jetbrains): warn before core lifecycle actions (kirillk, 2026-09-29)
- 93dd50aca - fix(jetbrains): submit chat dialogs with command enter (kirillk, 2026-09-29)
- cc88eba46 - fix(jetbrains): separate core reload action (kirillk, 2026-09-29)
- 205e34a5c - feat(jetbrains): reload core settings (kirillk, 2026-09-29)
- 013124833 - test(jetbrains): assert hidden question reveal scroll (kirillk, 2026-09-29)
- 5f2747efb - fix(jetbrains): surface hidden session questions (kirillk, 2026-09-29)
- b86bf6468 - fix(security): address Kilo Code Review findings on CI-failure detection (Bruno Agatao, 2026-09-29)
- eca121d2f - feat(security): detect bot PRs stuck on a failing required check (Bruno Agatao, 2026-09-29)
- 38b82c256 - fix(jetbrains): migrate off deprecated Kotlin DSL task registering delegate (brunoagatao, 2026-09-29)
- b7d7e9437 - Merge branch 'feat/documents-copy-content' of github.com:Kilo-Org/kilocode into feat/documents-copy-content (Bruno Agatao, 2026-09-29)
- 2047fdcdb - fix(vscode): scope Cmd/Ctrl+A to document content in Documents panel (Bruno Agatao, 2026-09-29)
- d4d5d796c - Merge branch 'main' into feat/documents-copy-content (Bruno Agatão, 2026-09-29)
- bfbfd9f56 - Merge remote-tracking branch 'origin/main' into feat/documents-copy-content (Bruno Agatao, 2026-09-29)
- 9efa2165a - fix(vscode): invalidate in-flight model fetch on connection change (Bruno Agatao, 2026-09-29)
- 7ee84c831 - fix(vscode): rework Documents copy per review, matching the issue scope (Bruno Agatao, 2026-09-29)
- 8da2d62e6 - Merge remote-tracking branch 'origin/main' into HEAD (github-actions[bot], 2026-09-29)
- a4231c79e - fix(jetbrains): avoid badge repaint allocations (kirillk, 2026-09-28)
- 8e1eebc59 - feat(jetbrains): combine MCP and skill badges (kirillk, 2026-09-28)
- 661fcbcb0 - fix(vscode): widen markdown fence to avoid collisions with content (Bruno Agatao, 2026-09-28)
- 56aabb0ea - fix(vscode): translate Fetch models button label in all locales (Bruno Agatao, 2026-09-28)
- 459d88a8d - fix(vscode): address document copy review feedback (Bruno Agatao, 2026-09-28)
- 9fd35369d - refactor(vscode): consolidate document copy handlers (Bruno Agatao, 2026-09-28)
- 34ec93897 - feat(vscode): add copy content button to Documents viewer (Bruno Agatao, 2026-09-28)
- de285a6b5 - feat(vscode): add manual Fetch Models button to Custom Provider dialog (Bruno Agatao, 2026-09-28)
- 2c730caf5 - docs: sync cloud-mobile with merged PRs (2026-09-26) (github-actions[bot], 2026-09-26)
- 7549ce4e3 - chore(jetbrains): bump org.junit.vintage:junit-vintage-engine (dependabot[bot], 2026-09-25)
- 998d37c9a - chore(jetbrains): bump okhttp in /packages/kilo-jetbrains (dependabot[bot], 2026-09-25)

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

#### Other Changes
- `.changeset/agent-manager-latest-selection.md` (+0, -5)
- `.changeset/browser-preview-resize.md` (+0, -5)
- `.changeset/calm-hogs-sample.md` (+0, -5)
- `.changeset/calm-strips-toggle.md` (+0, -5)
- `.changeset/cli-scheduled-session-status.md` (+0, -5)
- `.changeset/context-overflow-recovery.md` (+0, -5)
- `.changeset/custom-provider-cache-breakpoint.md` (+0, -5)
- `.changeset/documents-open-in-editor.md` (+0, -5)
- `.changeset/gateway-optimistic-tool-support.md` (+0, -5)
- `.changeset/history-keeps-pasted-content.md` (+0, -5)
- `.changeset/jetbrains-commands-settings-info.md` (+0, -5)
- `.changeset/jetbrains-overlapping-run-stops.md` (+0, -5)
- `.changeset/jetbrains-revert-not-a-git-repo-notice.md` (+0, -5)
- `.changeset/jetbrains-session-model-selection.md` (+0, -5)
- `.changeset/jetbrains-swarm-markdown-messages.md` (+0, -5)
- `.changeset/openai-compatible-embedding-dimensions.md` (+0, -5)
- `.changeset/quiet-identity-delivery.md` (+0, -5)
- `.changeset/revert-failure-reporting.md` (+0, -6)
- `.changeset/stable-goal-turns.md` (+0, -6)
- `.changeset/tidy-dingos-apply.md` (+0, -5)
- `.changeset/vscode-drop-link-pr-tool.md` (+0, -5)
- `.github/workflows/stale-bot-pr-notify.yml` (+58, -21)
- `artifacts/glm52-rise-video/package.json` (+1, -1)
- `bun.lock` (+101, -50)
- `nix/hashes.json` (+4, -4)
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
- `packages/kilo-docs/package.json` (+3, -3)
- `packages/kilo-docs/pages/ai-providers/index.md` (+1, -0)
- `packages/kilo-docs/pages/ai-providers/nebius.md` (+127, -0)
- `packages/kilo-docs/pages/ai-providers/openai-chatgpt-plus-pro.md` (+11, -2)
- `packages/kilo-docs/pages/ai-providers/openai-compatible.md` (+2, -0)
- `packages/kilo-docs/pages/code-with-ai/agents/custom-models.md` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/platforms/mobile.md` (+1, -1)
- `packages/kilo-docs/pages/getting-started/byok.md` (+1, -0)
- `packages/kilo-docs/pnpm-lock.yaml` (+71, -100)
- `packages/kilo-docs/public/img/nebius/cli-connect.png` (+-, --)
- `packages/kilo-docs/public/img/nebius/cloud-byok.png` (+-, --)
- `packages/kilo-docs/public/img/nebius/gateway-allowlist.png` (+-, --)
- `packages/kilo-docs/public/img/nebius/vscode-api-key.jpg` (+-, --)
- `packages/kilo-docs/public/img/nebius/vscode-find-provider.png` (+-, --)
- `packages/kilo-docs/public/img/nebius/vscode-model-picker.jpg` (+-, --)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/background-agent-panel-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-background-agents-1280-chromium-linux.png` (+0, -3)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-background-agents-200-chromium-linux.png` (+0, -3)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-background-agents-420-chromium-linux.png` (+0, -3)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-single-background-agent-420-chromium-linux.png` (+0, -3)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/CHANGELOG.md` (+26, -0)
- `packages/kilo-jetbrains/backend/build.gradle.kts` (+9, -9)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorkspaceRpcApiImpl.kt` (+12, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloWorkspaceRpcApiImplTest.kt` (+19, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/MockCliServer.kt` (+6, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/ReinstallKiloAction.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/ReloadCoreSettingsAction.kt` (+48, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/RestartKiloAction.kt` (+14, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/SubmitDialogAction.kt` (+34, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/NewWorktreeDialog.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloWorkspaceService.kt` (+18, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+31, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanel.kt` (+17, -8)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/SlashAction.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/base/DialogDataKeys.kt` (+12, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/base/DialogView.kt` (+20, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/question/QuestionView.kt` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/marketplace/MarketplaceSettingsUi.kt` (+17, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/FilledBadgeIcon.kt` (+62, -10)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListModel.kt` (+9, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListRenderer.kt` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListView.kt` (+3, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/kilo.jetbrains.frontend.xml` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ar.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_bs.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_da.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_de.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_es.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_fr.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ja.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ko.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_nl.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_no.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pl.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pt_BR.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ru.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_th.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_tr.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_uk.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_CN.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_TW.properties` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/KiloRecoveryActionsTest.kt` (+75, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/SessionContextMenuActionsTest.kt` (+16, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/SubmitDialogActionTest.kt` (+92, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/app/KiloWorkspaceServiceTest.kt` (+20, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/plugin/KiloBundleLocaleTest.kt` (+21, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionScrollTest.kt` (+43, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanelTest.kt` (+48, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/QuestionViewTest.kt` (+80, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/base/DialogViewTest.kt` (+57, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/marketplace/MarketplaceSettingsUiTest.kt` (+19, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeWorkspaceRpcApi.kt` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/FilledBadgeIconTest.kt` (+33, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/list/ActiveListBadgeCellTest.kt` (+16, -0)
- `packages/kilo-jetbrains/gradle/libs.versions.toml` (+7, -7)
- `packages/kilo-jetbrains/gradle/wrapper/gradle-wrapper.jar` (+-, --)
- `packages/kilo-jetbrains/gradle/wrapper/gradle-wrapper.properties` (+1, -1)
- `packages/kilo-jetbrains/gradlew` (+3, -3)
- `packages/kilo-jetbrains/gradlew.bat` (+12, -23)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloWorkspaceRpcApi.kt` (+3, -0)
- `packages/kilo-memory/package.json` (+1, -1)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/agent-avatar.css` (+6, -5)
- `packages/kilo-ui/src/components/agent-avatar.tsx` (+12, -0)
- `packages/kilo-vscode/CHANGELOG.md` (+44, -0)
- `packages/kilo-vscode/package.json` (+2, -1)
- `packages/kilo-vscode/src/DocumentViewerProvider.ts` (+10, -0)
- `packages/kilo-vscode/src/KiloProvider.ts` (+72, -13)
- `packages/kilo-vscode/src/MarketplacePanelProvider.ts` (+20, -0)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+8, -0)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+7, -0)
- `packages/kilo-vscode/src/extension.ts` (+33, -9)
- `packages/kilo-vscode/src/kilo-provider/file-search-items.ts` (+28, -4)
- `packages/kilo-vscode/src/kilo-provider/file-search-results.ts` (+44, -17)
- `packages/kilo-vscode/src/kilo-provider/file-search.ts` (+329, -20)
- `packages/kilo-vscode/src/services/code-actions/register-code-actions.ts` (+2, -1)
- `packages/kilo-vscode/src/services/marketplace/notifier.ts` (+13, -5)
- `packages/kilo-vscode/src/services/marketplace/notify.ts` (+8, -4)
- `packages/kilo-vscode/tests/accessibility.spec.ts` (+0, -188)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/prompt-background-agents.spec.ts` (+23, -27)
- `packages/kilo-vscode/tests/setup/vscode-mock.ts` (+8, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-documents.test.ts` (+71, -0)
- `packages/kilo-vscode/tests/unit/background-agents.test.ts` (+76, -24)
- `packages/kilo-vscode/tests/unit/file-mention-utils.test.ts` (+38, -0)
- `packages/kilo-vscode/tests/unit/file-search-items.test.ts` (+26, -0)
- `packages/kilo-vscode/tests/unit/file-search.test.ts` (+729, -1)
- `packages/kilo-vscode/tests/unit/markdown-worker-recovery.fixture.tsx` (+114, -0)
- `packages/kilo-vscode/tests/unit/markdown-worker-recovery.test.ts` (+57, -0)
- `packages/kilo-vscode/tests/unit/register-code-actions.test.ts` (+70, -3)
- `packages/kilo-vscode/tests/unit/session-dock.test.ts` (+2, -2)
- `packages/kilo-vscode/tests/unit/use-file-mention.test.ts` (+10, -4)
- `packages/kilo-vscode/webview-ui/agent-manager/ClosableTab.tsx` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/documents/DocumentPanelHost.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fa.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fr.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/it.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ja.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ko.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/nl.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/no.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/pl.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ru.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/th.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/tr.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/uk.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zh.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zht.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/documents/DocumentPanel.tsx` (+91, -10)
- `packages/kilo-vscode/webview-ui/documents/index.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/documents/state.ts` (+11, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/AgentStack.tsx` (+447, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/BackgroundAgents.tsx` (+0, -401)
- `packages/kilo-vscode/webview-ui/src/components/chat/ChatView.tsx` (+10, -3)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+11, -2)
- `packages/kilo-vscode/webview-ui/src/components/chat/SessionDock.tsx` (+181, -7)
- `packages/kilo-vscode/webview-ui/src/components/chat/SessionTabMenu.tsx` (+10, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskHeader.tsx` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskToolExpanded.tsx` (+21, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/background-agents.ts` (+66, -14)
- `packages/kilo-vscode/webview-ui/src/components/chat/background-jobs.ts` (+90, -0)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/MarketplaceListView.tsx` (+26, -1)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/MarketplaceView.tsx` (+14, -1)
- `packages/kilo-vscode/webview-ui/src/components/settings/CustomProviderDialog.tsx` (+21, -2)
- `packages/kilo-vscode/webview-ui/src/components/shared/StatusText.tsx` (+18, -2)
- `packages/kilo-vscode/webview-ui/src/hooks/file-mention-utils.ts` (+14, -6)
- `packages/kilo-vscode/webview-ui/src/hooks/useFileMention.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+5, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+5, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+5, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+5, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+5, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+5, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+5, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+5, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+5, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+5, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+5, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+5, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+5, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+5, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+5, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+5, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+5, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+5, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+5, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+5, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+5, -2)
- `packages/kilo-vscode/webview-ui/src/stories/chat.stories.tsx` (+15, -28)
- `packages/kilo-vscode/webview-ui/src/styles/chat-layout.css` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/styles/prompt-dropdowns.css` (+15, -0)
- `packages/kilo-vscode/webview-ui/src/styles/session-actions.css` (+400, -0)
- `packages/kilo-vscode/webview-ui/src/styles/task-header.css` (+1, -225)
- `packages/kilo-vscode/webview-ui/src/styles/tool-overrides.css` (+10, -4)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+24, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+14, -0)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+31, -0)
- `packages/opencode/package.json` (+3, -3)
- `packages/opencode/src/kilocode/session/llm.ts` (+38, -0)
- `packages/opencode/src/session/llm/request.ts` (+3, -1)
- `packages/opencode/src/storage/storage.ts` (+10, -2)
- `packages/opencode/test/fixtures/recordings/kilocode/session/native-anthropic-tool-loop.json` (+2, -2)
- `packages/opencode/test/kilocode/session-llm-request.test.ts` (+126, -0)
- `packages/opencode/test/kilocode/storage/storage-init.test.ts` (+29, -0)
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
- `packages/tui/src/routes/session/index.tsx` (+12, -0)
- `packages/tui/test/cli/tui/inline-tool-wrap-snapshot.test.tsx` (+1, -0)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/components/markdown.tsx` (+8, -1)
- `script/kilocode/sbom-products.test.ts` (+14, -2)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 17ab8af73..1ff1fa262 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.8.1",
+  "version": "7.8.2",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```


## opencode Changes (2fa3363..0112a92)

### Commits

- 0112a92 - chore(triage): add vimtor to inference issue owners (#52425) (vprdev, 2026-10-01)
- 62ac31e - chore(triage): update inference issue owners (#52424) (vprdev, 2026-10-01)
- 28e13d9 - fix(ci): extend issue and PR compliance grace to 72 hours (#52415) (opencode-agent[bot], 2026-09-30)
- 82ea3a3 - sync release versions for v1.18.34 (opencode, 2026-09-30)
- e9f8a21 - fix(opencode): add namespaced session identity headers (#52370) (Aiden Cline, 2026-09-30)
- 9b4882d - fix(opencode): ad-hoc re-sign darwin binaries after local compile (#52183) (Ryan, 2026-09-30)
- 97a86b7 - fix(tui): use path.sep for plugin name extraction in /status dialog (#52328) (Metal Heart, 2026-09-30)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `.opencode/tool/github-triage.ts` (+1, -1)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/console/core/package.json` (+1, -1)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/session/runner/llm.ts` (+2, -0)
- `packages/core/test/session-runner.test.ts` (+10, -1)
- `packages/stats/core/package.json` (+1, -1)

#### Other Changes
- `.github/workflows/compliance-close.yml` (+7, -7)
- `.github/workflows/duplicate-issues.yml` (+2, -2)
- `.github/workflows/pr-standards.yml` (+1, -1)
- `CONTRIBUTING.md` (+1, -1)
- `bun.lock` (+28, -28)
- `packages/app/package.json` (+1, -1)
- `packages/cli/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
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
- `packages/opencode/script/build.ts` (+6, -0)
- `packages/opencode/src/session/llm/request.ts` (+2, -0)
- `packages/opencode/test/session/llm.test.ts` (+80, -63)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/server/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/tui/src/component/dialog-status.tsx` (+4, -3)
- `packages/ui/package.json` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### .opencode/tool/github-triage.ts
```diff
diff --git a/.opencode/tool/github-triage.ts b/.opencode/tool/github-triage.ts
index d610a81..fb42dc0 100644
--- a/.opencode/tool/github-triage.ts
+++ b/.opencode/tool/github-triage.ts
@@ -5,7 +5,7 @@ const TEAM = {
   tui: ["kommander", "simonklee"],
   desktop_web: ["Hona", "Brendonovich"],
   core: ["jlongster", "rekram1-node", "neriousy", "nexxeln", "kitlangton"],
-  inference: ["fwang", "MrMushrooooom", "starptech"],
+  inference: ["fwang", "vaprdev", "vimtor"],
   windows: ["Hona"],
 } as const
 
```

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 4486987..6875a26 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.18.33",
+  "version": "1.18.34",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 5488a1d..6c00d3a 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.18.33",
+  "version": "1.18.34",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/session/runner/llm.ts
```diff
diff --git a/packages/core/src/session/runner/llm.ts b/packages/core/src/session/runner/llm.ts
index 874086a..b509f3c 100644
--- a/packages/core/src/session/runner/llm.ts
+++ b/packages/core/src/session/runner/llm.ts
@@ -206,6 +206,8 @@ const layer = Layer.effect(
         model,
         http: {
           headers: {
+            "x-opencode-session-id": session.id,
+            ...(session.parentID ? { "x-opencode-parent-session-id": session.parentID } : {}),
             "x-session-affinity": session.id,
             "X-Session-Id": session.id,
             ...(session.parentID ? { "x-parent-session-id": session.parentID } : {}),
```

#### packages/core/test/session-runner.test.ts
```diff
diff --git a/packages/core/test/session-runner.test.ts b/packages/core/test/session-runner.test.ts
index cc58b43..d2a34bf 100644
--- a/packages/core/test/session-runner.test.ts
+++ b/packages/core/test/session-runner.test.ts
@@ -1103,10 +1103,12 @@ describe("SessionRunnerLLM", () => {
       expect(requests).toHaveLength(2)
       expect(requests.map((request) => request.http?.headers)).toEqual([
         {
+          "x-opencode-session-id": sessionID,
           "x-session-affinity": sessionID,
           "X-Session-Id": sessionID,
         },
         {
+          "x-opencode-session-id": sessionID,
           "x-session-affinity": sessionID,
           "X-Session-Id": sessionID,
         },
@@ -2528,6 +2530,7 @@ describe("SessionRunnerLLM", () => {
       yield* session.resume(sessionID)
 
       expect(requests[0]?.http?.headers).toEqual({
+        "x-opencode-session-id": sessionID,
         "x-session-affinity": sessionID,
         "X-Session-Id": sessionID,
       })
@@ -2551,7 +2554,13 @@ describe("SessionRunnerLLM", () => {
       requests.length = 0
       yield* session.resume(sessionID)
 
-      expect(requests[0]?.http?.headers?.["x-parent-session-id"]).toBe(parentID)
+      expect(requests[0]?.http?.headers).toEqual({
+        "x-opencode-session-id": sessionID,
+        "x-opencode-parent-session-id": parentID,
+        "x-session-affinity": sessionID,
+        "X-Session-Id": sessionID,
+        "x-parent-session-id": parentID,
+      })
     }),
   )
 
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/package.json
- `src/tool/github-triage.ts` - update based on opencode .opencode/tool/github-triage.ts changes
