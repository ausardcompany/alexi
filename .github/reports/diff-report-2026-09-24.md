# Upstream Changes Report
Generated: 2026-09-24 11:14:41

## Summary
- kilocode: 92 commits, 239 files changed
- opencode: 9 commits, 72 files changed

## kilocode Changes (95b45e54e..50e520adf)

### Commits

- 50e520adf - Merge pull request #14535 from Kilo-Org/fix-agent-manager-sidebar-webview-empty-on-worktre (Marius, 2026-09-24)
- 47fd65606 - Merge pull request #14534 from Kilo-Org/investigate-worktree-switch-performance (Marius, 2026-09-24)
- b4d246bf4 - fix(agent-manager): drop the browser cache entry when the panel closes (marius-kilocode, 2026-09-24)
- 93881221a - Merge pull request #14533 from Kilo-Org/feature-flag-task-subagent-model-selection (Marius, 2026-09-24)
- 3499a48d9 - fix(agent-manager): keep the loaded browser page across context switches (marius-kilocode, 2026-09-24)
- 4bbed242e - fix(vscode): stop transcript re-render loop on session switch (marius-kilocode, 2026-09-24)
- 2647842cd - Merge pull request #14532 from Kilo-Org/fix-session-tab-title-renaming (Marius, 2026-09-24)
- 274c24b99 - Merge pull request #14531 from Kilo-Org/concrete-postbox (Marius, 2026-09-24)
- fbf99aa96 - Merge pull request #14529 from Kilo-Org/fix-session-update-on-project-switch (Marius, 2026-09-24)
- a3619b0c6 - fix(vscode): retry providers on reconnect after a failed fetch (marius-kilocode, 2026-09-24)
- 3380e167c - feat: make task subagent model selection the default (marius-kilocode, 2026-09-24)
- e20c7fd5f - refactor(agent-manager): share tab id constants with the project store (marius-kilocode, 2026-09-24)
- 7c9fbd61a - Merge pull request #14530 from Kilo-Org/skip-kilo-worktrees (Marius, 2026-09-24)
- bebf9b187 - fix(vscode): avoid duplicate provider fetch on initial connect (marius-kilocode, 2026-09-24)
- c06228d6a - feat(marketplace): install MCP servers with companion skills (#14510) (Marius, 2026-09-24)
- 4e8604227 - fix(agent-manager): keep session tab title in sync on rename (marius-kilocode, 2026-09-24)
- 89f0cbad7 - fix(vscode): recover Agent Manager requests and providers after reconnect (marius-kilocode, 2026-09-24)
- 9394c5233 - fix(agent-manager): avoid creating .kilo/worktrees when worktree pool is off (marius-kilocode, 2026-09-24)
- df604a171 - fix(agent-manager): preserve view state across project switches (marius-kilocode, 2026-09-24)
- ade703454 - Merge pull request #14490 from Kilo-Org/feat/tool-motion-live-input (Marius, 2026-09-24)
- 853556663 - fix(vscode): keep pending input for non-live tools and throttle large streams (marius-kilocode, 2026-09-24)
- 9e3f35076 - Merge pull request #14462 from Kilo-Org/feat/ev-code-signing (Zeke Fralish, 2026-09-23)
- 1e95515c3 - Merge branch 'main' into feat/ev-code-signing (Zeke Fralish, 2026-09-23)
- 1ae98a50c - Merge pull request #14219 from Kilo-Org/docs/auto-sync/cloud-web (Igor Šćekić, 2026-09-23)
- d760a556c - Merge pull request #14198 from Kilo-Org/docs/auto-sync/cloud-mobile (Igor Šćekić, 2026-09-23)
- 993d5d1e4 - docs(kilo-docs): add the spend alerts section the cloud-web sync links to (Igor Šćekić, 2026-09-23)
- a433052fd - docs(kilo-docs): add the spend alerts section the cloud-mobile sync links to (Igor Šćekić, 2026-09-23)
- 9b6a4f8ce - Merge branch 'main' into feat/ev-code-signing (Zeke Fralish, 2026-09-23)
- 1ad0e23e7 - Merge pull request #14509 from Kilo-Org/jetbrains/release/v7.1.7 (Kirill Kalishev, 2026-09-23)
- 39eb0b3b5 - docs(jetbrains): edit changelog for v7.1.7 (Kirill Kalishev, 2026-09-23)
- ecf0632c9 - Merge pull request #14508 from Kilo-Org/sphenoid-verdict (Marius, 2026-09-23)
- 35ff7906e - fix(cli): address CIMD callback and deployment review (marius-kilocode, 2026-09-23)
- da0ac716d - release(jetbrains): v7.1.7 (kilo-maintainer[bot], 2026-09-23)
- f5affad06 - Merge branch 'main' into feat/ev-code-signing (Zeke Fralish, 2026-09-23)
- fb71913f8 - fix(ci): preserve existing docs link remapping (marius-kilocode, 2026-09-23)
- d27c3924c - fix(ci): validate CIMD metadata before deployment (marius-kilocode, 2026-09-23)
- e09883c19 - feat(cli): support MCP client ID metadata documents (marius-kilocode, 2026-09-23)
- bed13587a - Merge pull request #14505 from Kilo-Org/jetbrains/release/v7.1.7-rc.5 (Kirill Kalishev, 2026-09-23)
- edcf5d45c - docs(jetbrains): edit changelog for v7.1.7-rc.5 (Kirill Kalishev, 2026-09-23)
- 832d7bf2b - release(jetbrains): v7.1.7-rc.5 (kilo-maintainer[bot], 2026-09-23)
- 67da64292 - Merge pull request #14496 from Kilo-Org/chore/jetbrains-cli-pin-v7.7.9 (Kirill Kalishev, 2026-09-23)
- 0fde63315 - Merge pull request #14480 from Kilo-Org/fix/plan-followup-event-routing (Kirill Kalishev, 2026-09-23)
- 11d7a81a3 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-09-23)
- 39591c130 - Merge pull request #14494 from Kilo-Org/fix/kilo-docs-nextjs-cve-2026-75604 (Bruno Agatão, 2026-09-23)
- 02f242c13 - Merge branch 'main' into fix/kilo-docs-nextjs-cve-2026-75604 (Bruno Agatão, 2026-09-23)
- 640786b36 - Merge pull request #14495 from Kilo-Org/update-kilo-marketplace-readme-plugin-support (Marius, 2026-09-23)
- af79b6744 - fix(kilo-docs): sync pnpm-lock.yaml next specifier to ^16.3.5 (kiloconnect[bot], 2026-09-23)
- e84c47540 - fix(kilo-docs): update next specifier to ^16.3.5 for GHSA-p293-qw3h-jr36 (kiloconnect[bot], 2026-09-23)
- 48e7dddf8 - chore(jetbrains): bump CLI pin to v7.7.9 (kilo-maintainer[bot], 2026-09-23)
- 335681fa8 - Merge branch 'main' into fix/kilo-docs-nextjs-cve-2026-75604 (Bruno Agatão, 2026-09-23)
- c70653f06 - fix(kilo-docs): revert next to ^16.3.3 specifier, resolve 16.3.5 to match bun.lock (kiloconnect[bot], 2026-09-23)
- d52877ea1 - release: v7.7.9 (kilo-maintainer[bot], 2026-09-23)
- 39c8c91f7 - fix(kilo-docs): update next specifier to ^16.3.5 (resolves to 16.3.6) (kiloconnect[bot], 2026-09-23)
- f1d0fdefd - docs: feature Kilo Marketplace plugins in README (marius-kilocode, 2026-09-23)
- e7241114a - Merge branch 'main' into fix/kilo-docs-nextjs-cve-2026-75604 (Bruno Agatão, 2026-09-23)
- 51961d951 - fix(vscode): count patch change lines and skip non-live fragments (marius-kilocode, 2026-09-23)
- fbf584ae3 - fix(kilo-docs): update next to 16.3.5 for GHSA-p293-qw3h-jr36 (Bruno Agatao, 2026-09-23)
- 4c21b0871 - feat(vscode): stream change counts for edit and patch tool rows (marius-kilocode, 2026-09-23)
- 4679e9610 - refactor(ui): deduplicate the tool open-diff action (marius-kilocode, 2026-09-23)
- bfc6b5e5e - fix(vscode): stop clipping streamed tool rows on each new line (marius-kilocode, 2026-09-23)
- 67115fc64 - fix(vscode): hide the empty body of an unchanged write (marius-kilocode, 2026-09-23)
- 31d70c2b5 - fix(vscode): remove unused write stream styles (marius-kilocode, 2026-09-23)
- 8be5f2e8d - fix(vscode): keep only the live line count for streaming writes (marius-kilocode, 2026-09-23)
- 17a62b88c - feat(vscode): stream tool input into pending tool rows (marius-kilocode, 2026-09-23)
- 3bdfd7994 - feat(vscode): tick off to-dos and ripple parallel completion beats (marius-kilocode, 2026-09-23)
- b3e27e82f - feat(vscode): shorten tool motion and drop the text mask wipe (marius-kilocode, 2026-09-23)
- bfa384dc3 - feat(vscode): animate tool calls with one live-only motion system (marius-kilocode, 2026-09-23)
- 4361fe180 - Merge remote-tracking branch 'origin/main' into HEAD (github-actions[bot], 2026-09-23)
- 75617502f - docs: sync cloud-mobile with merged PRs (2026-09-23) (github-actions[bot], 2026-09-23)
- 0dc1495b5 - Merge remote-tracking branch 'origin/main' into HEAD (github-actions[bot], 2026-09-23)
- 5e05988b1 - fix(cli): route plan follow-up events by directory (kirillk, 2026-09-22)
- 4576fd91f - Merge branch 'main' into feat/ev-code-signing (Zeke Fralish, 2026-09-22)
- f73f3acd8 - merge: resolve publish.yml conflict keeping EV signing pipeline (Zeke Fralish, 2026-09-22)
- 2e9c92fed - fix(ci): prefix tar glob with ./ for bsdtar compatibility (Zeke Fralish, 2026-09-22)
- 26c5de034 - docs: sync cloud-web with merged PRs (2026-09-22) (github-actions[bot], 2026-09-22)
- 5ad6f0f4f - Merge remote-tracking branch 'origin/main' into HEAD (github-actions[bot], 2026-09-22)
- c66a41e92 - docs: sync cloud-mobile with merged PRs (2026-09-22) (github-actions[bot], 2026-09-22)
- 1503ee151 - Merge remote-tracking branch 'origin/main' into HEAD (github-actions[bot], 2026-09-22)
- 2b1dcbb4b - docs: sync cloud-mobile with merged PRs (2026-09-21) (github-actions[bot], 2026-09-21)
- 95aebb69a - Merge remote-tracking branch 'origin/main' into HEAD (github-actions[bot], 2026-09-20)
- 1564bb7e0 - docs: sync cloud-mobile with merged PRs (2026-09-20) (github-actions[bot], 2026-09-20)
- 33c7267c9 - Merge remote-tracking branch 'origin/main' into HEAD (github-actions[bot], 2026-09-20)
- 52de5ef51 - docs: sync cloud-web with merged PRs (2026-09-19) (github-actions[bot], 2026-09-19)
- ccd85bef9 - Merge remote-tracking branch 'origin/main' into HEAD (github-actions[bot], 2026-09-19)
- b556f914a - docs: sync cloud-mobile with merged PRs (2026-09-19) (github-actions[bot], 2026-09-19)
- ab48c9e5e - Merge remote-tracking branch 'origin/main' into HEAD (github-actions[bot], 2026-09-19)
- 6f1756ae2 - Merge remote-tracking branch 'origin/main' into HEAD (github-actions[bot], 2026-09-18)
- 599df340b - docs: sync cloud-mobile with merged PRs (2026-09-18) (github-actions[bot], 2026-09-18)
- f85adf6f6 - Merge remote-tracking branch 'origin/main' into HEAD (github-actions[bot], 2026-09-18)
- fd2f8320c - docs: sync cloud-web with merged PRs (2026-09-17) (github-actions[bot], 2026-09-17)
- 83e516c6f - Merge remote-tracking branch 'origin/main' into HEAD (github-actions[bot], 2026-09-17)
- 048e75ede - docs: sync cloud-mobile with merged PRs (2026-09-16) (github-actions[bot], 2026-09-16)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/agent-manager-models.ts` (+28, -39)
- `packages/opencode/src/kilocode/tool/registry.ts` (+1, -4)
- `packages/opencode/src/kilocode/tool/task.ts` (+2, -8)
- `packages/opencode/src/tool/task.ts` (+17, -24)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/v1/config/config.ts` (+0, -3)
- `packages/kilo-vscode/src/agent-manager/orchestration-bridge.ts` (+9, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-orchestration-bridge.test.ts` (+37, -2)

#### Other Changes
- `.changeset/agent-goal-tool.md` (+0, -5)
- `.changeset/agent-manager-browser-preserve.md` (+5, -0)
- `.changeset/agent-manager-close-to-right.md` (+0, -5)
- `.changeset/agent-manager-recovery-reconnect.md` (+5, -0)
- `.changeset/background-monitor-and-session-cron.md` (+0, -5)
- `.changeset/bash-live-output-tail.md` (+0, -5)
- `.changeset/calm-agents-preview.md` (+0, -5)
- `.changeset/empty-compaction-keeps-session.md` (+0, -5)
- `.changeset/experimental-context-tools.md` (+0, -5)
- `.changeset/fix-background-project-activity.md` (+0, -5)
- `.changeset/fix-jetbrains-board-list.md` (+0, -5)
- `.changeset/fix-local-project-switch.md` (+5, -0)
- `.changeset/inspect-pending-mcp-arguments.md` (+0, -5)
- `.changeset/jetbrains-activity-prompt-state.md` (+0, -5)
- `.changeset/jetbrains-custom-provider-remove-models.md` (+0, -5)
- `.changeset/jetbrains-ground-selection-context.md` (+0, -5)
- `.changeset/jetbrains-locale-release-keys.md` (+0, -5)
- `.changeset/jetbrains-markdown-line-endings.md` (+0, -5)
- `.changeset/jetbrains-nested-worktree-delete-actions.md` (+0, -5)
- `.changeset/jetbrains-reconnect-question-recovery.md` (+0, -5)
- `.changeset/jetbrains-session-status-wrap.md` (+0, -5)
- `.changeset/jetbrains-swarm-board-wrap-copy.md` (+0, -5)
- `.changeset/jetbrains-worktree-session-model-defaults.md` (+0, -5)
- `.changeset/jetbrains-worktree-tab-catchup.md` (+0, -5)
- `.changeset/link-pr-and-remote-check.md` (+0, -5)
- `.changeset/marketplace-git-plugin-hardening.md` (+0, -5)
- `.changeset/marketplace-git-plugins.md` (+0, -6)
- `.changeset/marketplace-plugins.md` (+0, -6)
- `.changeset/mcp-client-metadata.md` (+5, -0)
- `.changeset/mcp-companion-skills.md` (+7, -0)
- `.changeset/mcp-oauth-flow-owns-its-state.md` (+0, -5)
- `.changeset/opencode-v1-18-19-to-v1-18-20.md` (+0, -6)
- `.changeset/provider-enabled-allowlist-auth.md` (+0, -5)
- `.changeset/revert-not-a-git-repo-notice.md` (+0, -6)
- `.changeset/route-plan-followup-questions.md` (+5, -0)
- `.changeset/session-cost-restart.md` (+0, -7)
- `.changeset/session-switch-blank-transcript.md` (+0, -5)
- `.changeset/session-tab-title-rename.md` (+5, -0)
- `.changeset/sidebar-tabs-pin-close-to-right.md` (+0, -5)
- `.changeset/smooth-tool-motion.md` (+5, -0)
- `.changeset/streaming-shell-output-highlight.md` (+0, -5)
- `.changeset/task-model-selection-default.md` (+6, -0)
- `.changeset/transcript-virtual-clip.md` (+5, -0)
- `.changeset/worktree-pool-no-dir-when-disabled.md` (+5, -0)
- `.github/workflows/docs-check-links.yml` (+5, -1)
- `.github/workflows/publish.yml` (+147, -10)
- `README.md` (+1, -1)
- `artifacts/glm52-rise-video/package.json` (+1, -1)
- `bun.lock` (+78, -72)
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
- `packages/kilo-docs/package.json` (+2, -2)
- `packages/kilo-docs/pages/code-with-ai/agents/context-mentions.md` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/agents/model-selection.md` (+2, -2)
- `packages/kilo-docs/pages/code-with-ai/platforms/mobile.md` (+96, -9)
- `packages/kilo-docs/pages/collaborate/sessions-sharing.md` (+10, -0)
- `packages/kilo-docs/pages/collaborate/teams/billing.md` (+7, -1)
- `packages/kilo-docs/pages/customize/marketplace.md` (+26, -0)
- `packages/kilo-docs/pages/getting-started/cost-controls-and-usage-safeguards.md` (+13, -0)
- `packages/kilo-docs/pages/getting-started/settings/index.md` (+1, -4)
- `packages/kilo-docs/pnpm-lock.yaml` (+281, -236)
- `packages/kilo-docs/public/oauth/kilo/client.json` (+9, -0)
- `packages/kilo-docs/source-links.md` (+2, -0)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-i18n/src/ar.ts` (+4, -0)
- `packages/kilo-i18n/src/br.ts` (+4, -0)
- `packages/kilo-i18n/src/bs.ts` (+4, -0)
- `packages/kilo-i18n/src/da.ts` (+4, -0)
- `packages/kilo-i18n/src/de.ts` (+4, -0)
- `packages/kilo-i18n/src/en.ts` (+4, -0)
- `packages/kilo-i18n/src/es.ts` (+4, -0)
- `packages/kilo-i18n/src/fr.ts` (+4, -0)
- `packages/kilo-i18n/src/it.ts` (+4, -0)
- `packages/kilo-i18n/src/ja.ts` (+4, -0)
- `packages/kilo-i18n/src/ko.ts` (+3, -0)
- `packages/kilo-i18n/src/nl.ts` (+4, -0)
- `packages/kilo-i18n/src/no.ts` (+4, -0)
- `packages/kilo-i18n/src/pl.ts` (+4, -0)
- `packages/kilo-i18n/src/ru.ts` (+4, -0)
- `packages/kilo-i18n/src/th.ts` (+4, -0)
- `packages/kilo-i18n/src/tr.ts` (+4, -0)
- `packages/kilo-i18n/src/uk.ts` (+4, -0)
- `packages/kilo-i18n/src/zh.ts` (+3, -0)
- `packages/kilo-i18n/src/zht.ts` (+3, -0)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/CHANGELOG.md` (+104, -0)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-memory/package.json` (+1, -1)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+2, -1)
- `packages/kilo-ui/src/components/basic-tool.css` (+2, -1)
- `packages/kilo-ui/src/components/message-part.tsx` (+142, -214)
- `packages/kilo-ui/src/components/reasoning-heading.test.ts` (+6, -0)
- `packages/kilo-ui/src/components/reasoning-heading.ts` (+3, -1)
- `packages/kilo-ui/src/components/tool-motion.css` (+225, -0)
- `packages/kilo-ui/src/components/tool-motion.test.ts` (+73, -0)
- `packages/kilo-ui/src/components/tool-motion.ts` (+195, -0)
- `packages/kilo-ui/src/styles/index.css` (+1, -0)
- `packages/kilo-vscode/CHANGELOG.md` (+39, -0)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+21, -1)
- `packages/kilo-vscode/src/agent-manager/WorktreeManager.ts` (+3, -0)
- `packages/kilo-vscode/src/agent-manager/worktree-pool.ts` (+5, -0)
- `packages/kilo-vscode/src/kilo-provider/partial-json.ts` (+141, -0)
- `packages/kilo-vscode/src/kilo-provider/tool-input-stream.ts` (+201, -0)
- `packages/kilo-vscode/src/services/cli-backend/connection-utils.ts` (+1, -0)
- `packages/kilo-vscode/src/services/marketplace/types.ts` (+1, -0)
- `packages/kilo-vscode/tests/fixtures/marketplace-install-modal.tsx` (+114, -18)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-diff-scope-state.test.ts` (+55, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-review-routing.test.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-selection-actions.test.ts` (+118, -3)
- `packages/kilo-vscode/tests/unit/agent-manager-tab-bar.test.ts` (+6, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-terminal-state.test.ts` (+95, -14)
- `packages/kilo-vscode/tests/unit/agent-manager-worktree-diffs.test.ts` (+35, -0)
- `packages/kilo-vscode/tests/unit/browser-panel-cache.test.ts` (+41, -0)
- `packages/kilo-vscode/tests/unit/i18n-keys.test.ts` (+8, -2)
- `packages/kilo-vscode/tests/unit/kilo-provider-provider-refresh.test.ts` (+149, -0)
- `packages/kilo-vscode/tests/unit/kilo-ui-contract.test.ts` (+1, -1)
- `packages/kilo-vscode/tests/unit/marketplace-actions.test.ts` (+74, -0)
- `packages/kilo-vscode/tests/unit/marketplace-install-modal.test.ts` (+5, -1)
- `packages/kilo-vscode/tests/unit/partial-json.test.ts` (+45, -0)
- `packages/kilo-vscode/tests/unit/project-review-state.test.ts` (+20, -0)
- `packages/kilo-vscode/tests/unit/project-store.test.ts` (+17, -0)
- `packages/kilo-vscode/tests/unit/session-preview-playback.test.ts` (+25, -10)
- `packages/kilo-vscode/tests/unit/task-model-selection.test.ts` (+0, -36)
- `packages/kilo-vscode/tests/unit/tool-input-stream.test.ts` (+126, -0)
- `packages/kilo-vscode/tests/unit/transcript-virtual-clip.test.ts` (+29, -0)
- `packages/kilo-vscode/tests/unit/worktree-pool.test.ts` (+20, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+78, -80)
- `packages/kilo-vscode/webview-ui/agent-manager/BrowserPanel.tsx` (+80, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/browser-panel-cache.ts` (+44, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/diff-review-scope.ts` (+3, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/diff-scope-state.ts` (+5, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/project/hydration.ts` (+63, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/project/store.ts` (+19, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/selection-actions.ts` (+16, -15)
- `packages/kilo-vscode/webview-ui/agent-manager/side-panel-state.ts` (+14, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/sortable-tab.tsx` (+3, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/tab-ids.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/tab-order.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/tab-rendering.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/state.ts` (+6, -4)
- `packages/kilo-vscode/webview-ui/browser/browser.css` (+23, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/AssistantMessage.tsx` (+104, -57)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+20, -0)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/InstallModal.tsx` (+15, -0)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/ItemCard.tsx` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/RemoveDialog.tsx` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/ExperimentalTab.tsx` (+0, -13)
- `packages/kilo-vscode/webview-ui/src/components/settings/SessionPreview.tsx` (+25, -12)
- `packages/kilo-vscode/webview-ui/src/components/settings/session-preview-playback.ts` (+32, -5)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+0, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+0, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+0, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+0, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+0, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+0, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+0, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+0, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+0, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+0, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+0, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+0, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+0, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+0, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+0, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+0, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+0, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+0, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+0, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/styles/chat-layout.css` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/styles/settings.css` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/types/messages/config.ts` (+0, -1)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+43, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/kilocode/marketplace/companions.ts` (+342, -0)
- `packages/opencode/src/kilocode/marketplace/detection.ts` (+25, -0)
- `packages/opencode/src/kilocode/marketplace/installer.ts` (+83, -73)
- `packages/opencode/src/kilocode/marketplace/paths.ts` (+25, -0)
- `packages/opencode/src/kilocode/marketplace/schema.ts` (+8, -0)
- `packages/opencode/src/kilocode/marketplace/skill-archive.ts` (+133, -0)
- `packages/opencode/src/kilocode/mcp/client-metadata.ts` (+1, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilocode.ts` (+5, -3)
- `packages/opencode/src/kilocode/session/prompt.ts` (+8, -6)
- `packages/opencode/src/kilocode/session/tool-input.ts` (+26, -0)
- `packages/opencode/src/kilocode/todo-view.ts` (+17, -4)
- `packages/opencode/src/mcp/oauth-provider.ts` (+10, -0)
- `packages/opencode/src/session/processor.ts` (+11, -2)
- `packages/opencode/test/kilocode/agent-manager-models-tool.test.ts` (+9, -13)
- `packages/opencode/test/kilocode/marketplace-companions.test.ts` (+495, -0)
- `packages/opencode/test/kilocode/mcp-cimd.test.ts` (+217, -0)
- `packages/opencode/test/kilocode/plan-exit-detection.test.ts` (+37, -23)
- `packages/opencode/test/kilocode/server/config-overlay.test.ts` (+8, -7)
- `packages/opencode/test/kilocode/server/httpapi-marketplace.test.ts` (+177, -8)
- `packages/opencode/test/kilocode/todo-view.test.ts` (+13, -1)
- `packages/opencode/test/kilocode/tool-registry-indexing.test.ts` (+5, -14)
- `packages/opencode/test/kilocode/tool-task-model.test.ts` (+146, -170)
- `packages/opencode/test/session/processor-effect.test.ts` (+15, -0)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/protocol/package.json` (+1, -1)
- `packages/schema/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk-next/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+7, -1)
- `packages/sdk/openapi.json` (+25, -3)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/storybook/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `script/kilocode-duplication-allowlist.json` (+0, -9)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 701b1a9e9..e57911d34 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.7.7",
+  "version": "7.7.9",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/v1/config/config.ts
```diff
diff --git a/packages/core/src/v1/config/config.ts b/packages/core/src/v1/config/config.ts
index b8a266b5a..cc34080b3 100644
--- a/packages/core/src/v1/config/config.ts
+++ b/packages/core/src/v1/config/config.ts
@@ -327,9 +327,6 @@ export const Info = Schema.Struct({
       native_notebook_tools: Schema.optional(Schema.Boolean).annotate({
         description: "Enable native tools for reading, editing, and executing VS Code notebooks",
       }),
-      task_model_selection: Schema.optional(Schema.Boolean).annotate({
-        description: "Allow task subagents to select a model, provider, and reasoning effort",
-      }),
       code_mode: Schema.optional(Schema.Boolean).annotate({
         description:
           "Route MCP tool calls through a confined JavaScript runtime with on-demand tool discovery instead of exposing every MCP tool directly",
```

#### packages/kilo-vscode/src/agent-manager/orchestration-bridge.ts
```diff
diff --git a/packages/kilo-vscode/src/agent-manager/orchestration-bridge.ts b/packages/kilo-vscode/src/agent-manager/orchestration-bridge.ts
index 549f74da3..c4a7858af 100644
--- a/packages/kilo-vscode/src/agent-manager/orchestration-bridge.ts
+++ b/packages/kilo-vscode/src/agent-manager/orchestration-bridge.ts
@@ -73,6 +73,7 @@ interface Connection {
   registerDirectoryProvider(provider: () => string[]): () => void
   getKnownDirectories(): string[]
   getClient(): KiloClient
+  getClientAsync(directory?: string): Promise<KiloClient>
 }
 
 interface Active {
@@ -575,7 +576,14 @@ export class AgentManagerOrchestrationBridge {
 
   private async recover(revision: number): Promise<void> {
     await this.options.ready()
-    const client = this.connection.getClient()
+    if (this.disposed || revision !== this.revision) return
+    // The backend can go down while state initializes. A plain getClient() would
+    // then fail recovery with no retry, because no new "connected" event comes.
+    // Connect on demand instead. This can restart a backend that exited.
+    const client = await this.connection.getClientAsync(this.connection.getKnownDirectories().at(0))
+    if (this.disposed || revision !== this.revision) return
+    if (this.backend !== client) this.reset()
+    this.backend = client
     await Promise.all(
       this.connection.getKnownDirectories().map(async (directory) => {
         const response = await client.kilocode.agentManager.list({ directory }).catch((error: unknown) => {
```

#### packages/kilo-vscode/tests/unit/agent-manager-orchestration-bridge.test.ts
```diff
diff --git a/packages/kilo-vscode/tests/unit/agent-manager-orchestration-bridge.test.ts b/packages/kilo-vscode/tests/unit/agent-manager-orchestration-bridge.test.ts
index f75cf5600..cbf721adf 100644
--- a/packages/kilo-vscode/tests/unit/agent-manager-orchestration-bridge.test.ts
+++ b/packages/kilo-vscode/tests/unit/agent-manager-orchestration-bridge.test.ts
@@ -47,7 +47,7 @@ describe("AgentManagerOrchestrationBridge", () => {
       event?: (event: SSEPayload, directory?: string) => void
       state?: (state: "connecting" | "connected" | "disconnected" | "error") => void
     } = {}
-    const status = { failList: "", failReply: false }
+    const status = { failList: "", failReply: false, failClient: false }
     const managed = new Set(["ses_caller", "ses_target"])
     const promptAsync = mock(async () => ({ data: undefined }))
     const close = mock(async () => undefined)
@@ -105,7 +105,14 @@ describe("AgentManagerOrchestrationBridge", () => {
         return () => providers.delete(provider)
       },
       getKnownDirectories: () => [...new Set([...providers].flatMap((provider) => provider()))],
-      getClient: () => client,
+      getClient: () => {
+        if (status.failClient) throw new Error("Not connected — call connect() first")
+        return client
+      },
+      getClientAsync: async () => {
+        status.failClient = false
+        return client
+      },
     }
     const bridge = new AgentManagerOrchestrationBridge(connection as never, {
       root: (dir) => (overrides?.root ? overrides.root(dir) : root),
@@ -783,6 +790,34 @@ describe("AgentManagerOrchestrationBridge", () => {
     test.bridge.dispose()
   })
 
+  it("recovers after the client goes away during state initialization", async () => {
+    let drop = true
+    const test = harness({
+      ready: async () => {
+        // The backend drops while Agent Manager state loads, the way an unstable
+        // startup connect does. Recovery must reconnect on demand instead of
+        // failing once and never retrying.
+        if (drop) {
+          drop = false
+          test.status.failClient = true
+        }
+        return state
+      },
+    })
+    test.lists.set(dir, [request])
+
+    test.handlers.state?.("connected")
```

#### packages/opencode/src/kilocode/tool/agent-manager-models.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/agent-manager-models.ts b/packages/opencode/src/kilocode/tool/agent-manager-models.ts
index 210092d7c..47cb97f72 100644
--- a/packages/opencode/src/kilocode/tool/agent-manager-models.ts
+++ b/packages/opencode/src/kilocode/tool/agent-manager-models.ts
@@ -4,7 +4,6 @@ import { Tool } from "@/tool/tool"
 import { Effect, Schema } from "effect"
 import { matchesQuery } from "./model-search"
 import DESCRIPTION from "./agent-manager-models.txt"
-import { Config } from "@/config/config"
 
 const Params = Schema.Struct({
   query: Schema.optional(Schema.String).annotate({
@@ -62,49 +61,39 @@ function view(entry: Entry) {
 export const AgentManagerModelsTool = Tool.define<
   typeof Params,
   { count: number; total: number },
-  Provider.Service | Config.Service,
+  Provider.Service,
   "agent_manager_models"
 >(
   "agent_manager_models",
   Effect.gen(function* () {
     const provider = yield* Provider.Service
-    const config = yield* Config.Service
-    return () =>
-      Effect.gen(function* () {
-        const cfg = yield* config.get()
-        const selection = cfg.experimental?.task_model_selection === true
-        return {
-          description: selection
-            ? `${DESCRIPTION}\n\nExperimental Task model selection is enabled. Also use this tool before choosing model, provider, or variant for the task subagent tool. You may choose these settings to suit the subagent task without creating an Agent Manager session.`
-            : DESCRIPTION,
-          parameters: Params,
-          execute: (params) =>
-            Effect.gen(function* () {
-              const providers = yield* provider.list()
-              const all = entries(providers)
-              const query = params.query?.trim()
-              const matches = query ? all.filter((entry) => matchesQuery([entry.name, ...entry.ids], query)) : all
-              const offset = params.offset ?? 0
-              const limit = Math.min(params.limit ?? MAX_LIMIT, MAX_LIMIT)
-              const models = matches.slice(offset, offset + limit).map(view)
-              const nextOffset = offset + models.length < matches.length ? offset + models.length : undefined
-              return {
-                title: query
-                  ? `${matches.length} model${matches.length === 1 ? "" : "s"} matching "${params.query?.trim()}"`
-                  : `${matches.length} available models`,
-                output: JSON.stringify({
-                  models,
-                  offset,
```


*... and more files (showing first 5)*

## opencode Changes (18ef3cc..0f54984)

### Commits

- 0f54984 - fix(stats): attribute Hy4 preview traffic to Tencent (#51050) (Jack, 2026-09-24)
- 0027387 - fix(go): include DeepSeek V4 Flash in chart (#51032) (Jack, 2026-09-24)
- 5fcfb06 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-09-24)
- 79e8eee - chore: bump gitlab-ai-provider to 6.18.0 (#50890) (Vladimir Glafirov, 2026-09-23)
- 82d4c89 - fix(opencode): redact credentials in debug config (#50956) (opencode-agent[bot], 2026-09-23)
- 1d6c3c0 - feat(go): add GPT 6 Luna to Go pages (#50947) (Jack, 2026-09-24)
- 610df0b - fix(gemini): switch thinking default logic (#50841) (Mark McDonald, 2026-09-23)
- 7cb044e - chore: generate (opencode-agent[bot], 2026-09-23)
- 1b4a6db - feat(go): add Space Bunny promotion (#50572) (Jack, 2026-09-23)

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
- `packages/stats/core/src/domain/geo.ts` (+5, -1)
- `packages/stats/core/src/domain/inference.test.ts` (+20, -2)
- `packages/stats/core/src/domain/model-normalization.ts` (+2, -1)
- `packages/stats/core/src/domain/model.ts` (+1, -0)

#### Other Changes
- `bun.lock` (+3, -9)
- `nix/hashes.json` (+4, -4)
- `packages/console/app/src/component/go-models.ts` (+12, -2)
- `packages/console/app/src/component/limits-graph.css` (+5, -0)
- `packages/console/app/src/component/limits-graph.tsx` (+21, -8)
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
- `packages/console/app/src/routes/go/index.tsx` (+4, -2)
- `packages/console/app/src/routes/workspace/[id]/go/lite-section.tsx` (+3, -1)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/cli/cmd/debug/config.ts` (+2, -2)
- `packages/opencode/src/cli/cmd/debug/redact.ts` (+20, -0)
- `packages/opencode/src/provider/transform.ts` (+21, -8)
- `packages/opencode/test/cli/debug-config.test.ts` (+62, -0)
- `packages/opencode/test/provider/transform.test.ts` (+110, -4)
- `packages/web/src/content/docs/ar/go.mdx` (+15, -1)
- `packages/web/src/content/docs/ar/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/bs/go.mdx` (+15, -1)
- `packages/web/src/content/docs/bs/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/da/go.mdx` (+15, -1)
- `packages/web/src/content/docs/da/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/de/go.mdx` (+15, -1)
- `packages/web/src/content/docs/de/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/es/go.mdx` (+15, -1)
- `packages/web/src/content/docs/es/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/fr/go.mdx` (+15, -1)
- `packages/web/src/content/docs/fr/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/go.mdx` (+15, -1)
- `packages/web/src/content/docs/it/go.mdx` (+57, -43)
- `packages/web/src/content/docs/it/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/ja/go.mdx` (+15, -1)
- `packages/web/src/content/docs/ja/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/ko/go.mdx` (+15, -1)
- `packages/web/src/content/docs/ko/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/nb/go.mdx` (+15, -1)
- `packages/web/src/content/docs/nb/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/pl/go.mdx` (+57, -43)
- `packages/web/src/content/docs/pl/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/pt-br/go.mdx` (+15, -1)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/ru/go.mdx` (+57, -43)
- `packages/web/src/content/docs/ru/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/th/go.mdx` (+15, -1)
- `packages/web/src/content/docs/th/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/tr/go.mdx` (+15, -1)
- `packages/web/src/content/docs/tr/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+15, -1)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+15, -1)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+3, -0)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index ced7b61..0a7e0ea 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -108,7 +108,7 @@
     "drizzle-orm": "catalog:",
     "effect": "catalog:",
     "fuzzysort": "3.1.0",
-    "gitlab-ai-provider": "6.16.0",
+    "gitlab-ai-provider": "6.18.0",
     "glob": "13.0.5",
     "google-auth-library": "10.5.0",
     "gray-matter": "4.0.3",
```

#### packages/stats/core/src/domain/geo.ts
```diff
diff --git a/packages/stats/core/src/domain/geo.ts b/packages/stats/core/src/domain/geo.ts
index a61e341..975e0b9 100644
--- a/packages/stats/core/src/domain/geo.ts
+++ b/packages/stats/core/src/domain/geo.ts
@@ -207,7 +207,11 @@ export class GeoStatRepo extends Context.Service<GeoStatRepo, GeoStatRepo.Servic
                   inArray(geoStat.dataset, scope.datasets),
                   inArray(geoStat.client, scope.clients),
                   inArray(geoStat.source, scope.sources),
-                  or(inArray(geoStat.provider, RETIRED_STAT_PROVIDERS), inArray(geoStat.model, RETIRED_STAT_MODELS)),
+                  or(
+                    inArray(geoStat.provider, RETIRED_STAT_PROVIDERS),
+                    inArray(geoStat.model, RETIRED_STAT_MODELS),
+                    and(eq(geoStat.provider, "unknown"), eq(geoStat.model, "hy4-preview")),
+                  ),
                 ),
               ),
           catch: (cause) => DatabaseError.make({ cause }),
```

#### packages/stats/core/src/domain/inference.test.ts
```diff
diff --git a/packages/stats/core/src/domain/inference.test.ts b/packages/stats/core/src/domain/inference.test.ts
index 7563f18..1e06f0e 100644
--- a/packages/stats/core/src/domain/inference.test.ts
+++ b/packages/stats/core/src/domain/inference.test.ts
@@ -57,6 +57,17 @@ describe("inference stat normalization", () => {
     expect(statProvider("unknown", "", "custom-provider")).toBe("custom-provider")
   })
 
+  test("attributes hy4 preview traffic to Tencent instead of the unknown provider", () => {
+    expect(modelAuthor("hy4-preview")).toBe("tencent")
+    expect(toModelAggregate(aggregate("hy4-preview", "opencode"))).toMatchObject([
+      { model: "hy4-preview", provider: "tencent" },
+    ])
+    expect(toProviderAggregate(aggregate("hy4-preview", "opencode"))).toMatchObject([{ provider: "tencent" }])
+    expect(toGeoAggregate({ ...aggregate("hy4-preview", "opencode"), country: "US" })).toMatchObject([
+      { model: "hy4-preview", provider: "tencent" },
+    ])
+  })
+
   test("maps oversized model ids to unknown before aggregation", () => {
     expect(statModel("x".repeat(256), "")).toBe("x".repeat(256))
     expect(statModel("x".repeat(257), "")).toBe("unknown")
@@ -75,6 +86,11 @@ describe("inference stat normalization", () => {
     expect(statProvider("omen-alpha", "gpt-test-model", "test-provider")).toBe("unknown")
     expect(statProvider("OMEN-ALPHA-free:global", "gpt-test-model", "test-provider")).toBe("unknown")
     expect(statProvider("omen-alpha", "", "test-provider")).toBe("unknown")
+    expect(statProvider("space-bunny-free", "hidden-route-model", "hidden-provider")).toBe("unknown")
+
+    const spaceBunny = { ...aggregate("space-bunny-free", "hidden-provider"), provider_model: "hidden-route-model" }
+    expect(toModelAggregate(spaceBunny)).toMatchObject([{ model: "space-bunny", provider: "unknown", requests: 1 }])
+    expect(toProviderAggregate(spaceBunny)).toMatchObject([{ provider: "unknown", requests: 1 }])
 
     const row = { ...aggregate("omen-alpha", "test-provider"), provider_model: "gpt-test-model" }
     expect(toModelAggregate(row)).toMatchObject([{ model: "omen-alpha", provider: "unknown", requests: 1 }])
@@ -198,7 +214,9 @@ describe("inference stat normalization", () => {
     expect(queries).toHaveLength(8)
     queries.forEach((query) => {
       expect(query).toContain("WHERE lower(model) NOT IN ('alpha-gpt-next')")
-      expect(query).toContain("CASE\n      WHEN lower(model) IN ('omen-alpha', 'union-alpha') THEN 'unknown'\n")
+      expect(query).toContain(
+        "CASE\n      WHEN lower(model) IN ('omen-alpha', 'space-bunny', 'union-alpha') THEN 'unknown'\n",
+      )
       expect(query).toContain("= 'opencode-go/union-alpha' THEN 'union-alpha'")
       expect(query).toContain("= 'opencode/union-alpha' THEN 'union-alpha'")
       expect(query).toContain("= 'deepseek-flash' THEN 'deepseek-v4.1-flash'")
@@ -270,7 +288,7 @@ describe("inference stat normalization", () => {
     expect(queries[0]?.query).toContain("AND product = 'go'")
     expect(queries[0]?.query).toContain("AND lower(model) NOT IN ('alpha-gpt-next')")
     expect(queries[0]?.query).toContain(
-      "CASE\n      WHEN lower(model) IN ('omen-alpha', 'union-alpha') THEN 'unknown'\n",
```

#### packages/stats/core/src/domain/model-normalization.ts
```diff
diff --git a/packages/stats/core/src/domain/model-normalization.ts b/packages/stats/core/src/domain/model-normalization.ts
index 081cffa..227eef1 100644
--- a/packages/stats/core/src/domain/model-normalization.ts
+++ b/packages/stats/core/src/domain/model-normalization.ts
@@ -6,6 +6,7 @@ export const MODEL_AUTHOR_RULES = [
   { match: "gpt", author: "openai" },
   { match: "grok", author: "xai" },
   { match: "hy3", author: "tencent" },
+  { match: "hy4", author: "tencent" },
   { match: "kimi", author: "moonshot" },
   { match: "mimo", author: "xiaomi" },
   { match: "minimax", author: "minimax" },
@@ -14,7 +15,7 @@ export const MODEL_AUTHOR_RULES = [
   { match: "qwen", author: "qwen" },
 ] as const
 export const EXCLUDED_MODELS = new Set(["alpha-gpt-next"])
-export const STEALTH_MODELS = new Set(["omen-alpha", "union-alpha"])
+export const STEALTH_MODELS = new Set(["omen-alpha", "space-bunny", "union-alpha"])
 export const FREE_MODELS = new Set(["gpt-5-nano", "grok-code", "big-pickle"])
 export const MODEL_NAME_MAX_LENGTH = 256
 export const MODEL_NAME_ALIASES: Record<string, string> = {
```

#### packages/stats/core/src/domain/model.ts
```diff
diff --git a/packages/stats/core/src/domain/model.ts b/packages/stats/core/src/domain/model.ts
index a19fdc7..ec16d65 100644
--- a/packages/stats/core/src/domain/model.ts
+++ b/packages/stats/core/src/domain/model.ts
@@ -195,6 +195,7 @@ export class ModelStatRepo extends Context.Service<ModelStatRepo, ModelStatRepo.
                   or(
                     inArray(modelStat.provider, RETIRED_STAT_PROVIDERS),
                     inArray(modelStat.model, RETIRED_STAT_MODELS),
+                    and(eq(modelStat.provider, "unknown"), eq(modelStat.model, "hy4-preview")),
                   ),
                 ),
               ),
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/src/v1/config/config.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/agent-manager/orchestration-bridge.ts
- `src/core/` - review core changes from packages/kilo-vscode/tests/unit/agent-manager-orchestration-bridge.test.ts
- `src/tool/agent-manager-models.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager-models.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/kilocode/tool/registry.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/kilocode/tool/task.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/tool/task.ts changes
