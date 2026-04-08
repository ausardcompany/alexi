# Upstream Changes Report
Generated: 2026-04-08 07:22:37

## Summary
- kilocode: 60 commits, 117 files changed
- opencode: 26 commits, 221 files changed

## kilocode Changes (d10d25a4..1a5be52c)

### Commits

- 1a5be52c - Merge pull request #8531 from Kilo-Org/fix/opencode-annotation-ci-path (Kirill Kalishev, 2026-04-07)
- 2bca86c6 - Merge pull request #8435 from Kilo-Org/catrielmuller/fix-8333 (Catriel Müller, 2026-04-07)
- 1496fa2d - Merge branch 'main' into fix/opencode-annotation-ci-path (Kirill Kalishev, 2026-04-07)
- 2371b747 - revert: restore bun run script/ invocation (consistent with source-check-links) (kirillk, 2026-04-07)
- 2828b7e0 - feat(cli): add annotation check script and AGENTS.md docs (kirillk, 2026-04-07)
- f08ad1ef - feat(agent-manager): show branch name as subtitle in worktree sidebar items (#8529) (Marius, 2026-04-07)
- f0b34e41 - fix(cli): use bun ./script path to fix module resolution in CI (kirillk, 2026-04-07)
- 760f2460 - release: v7.2.0 (kilo-maintainer[bot], 2026-04-07)
- 81af73f1 - feat(agent-manager): add GitHub PR status badge to worktree sidebar (#8524) (Marius, 2026-04-07)
- aa34a47c - fix(vscode): retry transient fetch failures in session.command and promptAsync (#8525) (Marius, 2026-04-07)
- ee8c26f8 - fix: remove local storage from ignored folder (#8431) (Imanol Maiztegui, 2026-04-07)
- afe950dc - perf(snapshot): add mutex lock, incremental add, and batched revert (Johnny Amancio, 2026-04-07)
- 5650850a - release: v7.1.23 (kilo-maintainer[bot], 2026-04-07)
- d0ca6ee0 - Merge pull request #8479 from shssoichiro/issue-8478 (Kirill Kalishev, 2026-04-07)
- bb9eb496 - Merge pull request #8456 from Kilo-Org/docs/fix-custom-models-page (Joshua Lambert, 2026-04-07)
- fbe78920 - Merge pull request #8457 from Kilo-Org/docs/whats-new-faq-model-cost-and-custom-params (Joshua Lambert, 2026-04-07)
- 8b07b554 - fix(vscode): scope cycleAgentMode keybinding to Kilo Code panels (#8508) (kilo-code-bot[bot], 2026-04-07)
- a38f7c79 - Merge pull request #8506 from Kilo-Org/feat/vscode-pre-release-publishing (Mark IJbema, 2026-04-07)
- 7c52089e - Merge branch 'main' into docs/whats-new-faq-model-cost-and-custom-params (Mark IJbema, 2026-04-07)
- 466a225f - Merge pull request #8496 from Kilo-Org/fix/local-review-git (Marian Alexandru Alecu, 2026-04-07)
- 50ba2757 - feat(vscode): reimplement task timeline graph header (#8480) (Marius, 2026-04-07)
- af923b82 - Merge pull request #8484 from Kilo-Org/feature/glm-kimi-qwen-reasoning-support (Christiaan Arnoldus, 2026-04-07)
- 9f0735e3 - fix(cli): guard against prompt injection in commits (Alex Alecu, 2026-04-07)
- 41964a6d - fix(cli): add scope context and better git commands to review prompt (Alex Alecu, 2026-04-07)
- c89946cb - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-04-07)
- 9d20b30a - Merge pull request #8477 from Kilo-Org/docs/mistral-autocomplete-vscode-tabs (Mark IJbema, 2026-04-07)
- 3ef72c6a - Merge pull request #8469 from Kilo-Org/security/pr6-vite-electron-dev (Jean du Plessis, 2026-04-07)
- de8d2b10 - fix: update vite and electron for dev tooling security (Jean du Plessis, 2026-04-07)
- def64b89 - fix(mcp): inject --rm flag for Docker MCP containers to prevent accumulation (Johnny Amancio, 2026-04-07)
- 313618d6 - docs(kilo-docs): remove Vercel AI Gateway from autocomplete flow and drop unnecessary sentence (kiloconnect[bot], 2026-04-07)
- 4af54375 - Modify id check to comment out specific conditions (Christiaan Arnoldus, 2026-04-07)
- 66421421 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-04-07)
- 8fd58732 - feat(provider): add glm/kimi/qwen reasoning support (issue #8201) (kiloconnect[bot], 2026-04-07)
- 66bdbdee - Merge pull request #8468 from Kilo-Org/security/pr5-diff-dompurify-yaml-solidjs (Jean du Plessis, 2026-04-07)
- 3bbbd88a - Merge pull request #8211 from Kilo-Org/session/agent_d7303e03-63aa-4590-8220-035bf9a529aa (Mark IJbema, 2026-04-07)
- 8793b8e6 - fix: add diff override to eliminate transitive diff@8.0.2 from @opentui/core (Jean du Plessis, 2026-04-07)
- a8ae58df - fix(core): make follow-up execution aware of the saved plan file (Josh Holmer, 2026-04-07)
- da8289a6 - docs(kilo-docs): use same Mistral screenshots in VS Code tab as legacy (kiloconnect[bot], 2026-04-07)
- 35b409c7 - fix: resolve remaining dompurify and seroval vulnerabilities (Jean du Plessis, 2026-04-07)
- 29c02eef - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-04-07)
- 59be76c4 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-04-07)
- 1a5c73c0 - fix: update diff, dompurify, yaml, and solid-js for security patches (Jean du Plessis, 2026-04-07)
- 2bad6d2d - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-04-07)
- 46520f03 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-04-07)
- a6c3d808 - fix(agent-manager): suppress interactive prompts during background git fetch (#8190) (Marius, 2026-04-07)
- ba2ecff4 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-04-07)
- 054c0b54 - docs(kilo-docs): update Mistral autocomplete guide with VS Code/Legacy tabs (kiloconnect[bot], 2026-04-07)
- b3481946 - chore: regenerate source-links.md with new docs URL (kiloconnect[bot], 2026-04-07)
- 028fd2f7 - feat(i18n): add migration.whatsNew.docsLink translations across locales (kiloconnect[bot], 2026-04-07)
- d4454933 - feat(ui): add docs link to migration whats-new and adjust layout (kiloconnect[bot], 2026-04-07)
- 168e1b9f - fix(cli): update minimatch, @modelcontextprotocol/sdk, and @aws-sdk (#8466) (Jean du Plessis, 2026-04-07)
- ae05148d - fix: add safe overrides for transitive dependency vulnerabilities (#8467) (Jean du Plessis, 2026-04-07)
- ea549f1e - fix(cli): update hono to fix auth bypass and server vulnerabilities (#8465) (Jean du Plessis, 2026-04-07)
- 9cf235a5 - fix(cli): update simple-git to fix critical RCE (#8464) (Jean du Plessis, 2026-04-07)
- cca8eebd - Merge pull request #8472 from Kilo-Org/docs/whats-new-profiles-faq (Mark IJbema, 2026-04-07)
- fff8adee - docs(kilo-docs): add FAQ entry about custom profiles in whats-new page (kiloconnect[bot], 2026-04-07)
- ccc403a8 - docs(kilo-docs): add model cost and custom model FAQ entries to whats-new page (Josh Lambert, 2026-04-07)
- 763b15f5 - docs(kilo-docs): fix custom models page headings and tab order (Josh Lambert, 2026-04-07)
- 613606b0 - feat(vscode): add exponential backoff retry with cancel button for rate limiting (Catriel Müller, 2026-04-06)
- 6e93f58a - feat(vscode): add pre-release publishing support to marketplace workflow (kiloconnect[bot], 2026-04-02)

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
- `.github/workflows/check-opencode-annotations.yml` (+32, -0)
- `.github/workflows/publish.yml` (+8, -1)
- `AGENTS.md` (+1, -0)
- `bun.lock` (+324, -626)
- `nix/hashes.json` (+4, -4)
- `package.json` (+18, -8)
- `packages/app/package.json` (+1, -1)
- `packages/desktop-electron/package.json` (+2, -2)
- `packages/desktop/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/agents/custom-models.md` (+25, -25)
- `packages/kilo-docs/pages/code-with-ai/features/autocomplete/mistral-setup.md` (+77, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/vscode/whats-new.md` (+15, -2)
- `packages/kilo-docs/pages/getting-started/faq/credits-and-billing.md` (+2, -2)
- `packages/kilo-docs/pages/getting-started/using-kilo-for-free.md` (+3, -3)
- `packages/kilo-docs/source-links.md` (+3, -1)
- `packages/kilo-gateway/package.json` (+2, -2)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+2, -2)
- `packages/kilo-vscode/package.json` (+14, -7)
- `packages/kilo-vscode/script/build.ts` (+6, -3)
- `packages/kilo-vscode/script/publish.ts` (+9, -5)
- `packages/kilo-vscode/src/KiloProvider.ts` (+154, -42)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+19, -1)
- `packages/kilo-vscode/src/agent-manager/GitOps.ts` (+24, -37)
- `packages/kilo-vscode/src/agent-manager/GitStatsPoller.ts` (+2, -3)
- `packages/kilo-vscode/src/agent-manager/PRStatusPoller.ts` (+486, -0)
- `packages/kilo-vscode/src/agent-manager/WorktreeManager.ts` (+4, -3)
- `packages/kilo-vscode/src/agent-manager/WorktreeStateManager.ts` (+16, -0)
- `packages/kilo-vscode/src/agent-manager/host.ts` (+9, -0)
- `packages/kilo-vscode/src/agent-manager/pr-status-bridge.ts` (+110, -0)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+72, -0)
- `packages/kilo-vscode/src/agent-manager/vscode-host.ts` (+10, -2)
- `packages/kilo-vscode/src/extension.ts` (+6, -2)
- `packages/kilo-vscode/src/services/cli-backend/retry.ts` (+34, -0)
- `packages/kilo-vscode/src/util/retry.ts` (+70, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+1, -1)
- `packages/kilo-vscode/tests/unit/git-ops.test.ts` (+3, -86)
- `packages/kilo-vscode/tests/unit/git-stats-poller.test.ts` (+2, -19)
- `packages/kilo-vscode/tests/unit/retry.test.ts` (+81, -0)
- `packages/kilo-vscode/tests/unit/timeline-colors.test.ts` (+108, -0)
- `packages/kilo-vscode/tests/unit/timeline-sizes.test.ts` (+92, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/agentmanager/worktree-item-active-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/agentmanager/worktree-item-default-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/agentmanager/worktree-item-grouped-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/agentmanager/worktree-item-pending-delete-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/agentmanager/worktree-item-stale-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/agentmanager/worktree-item-with-stats-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/chat/chat-view-with-messages-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/chat/welcome-with-switcher-and-notification-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/composite-webview/question-above-chatbox-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/marketplace/installed-mode-card-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/marketplace/modes-tab-with-installed-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/marketplace/modes-tab-with-items-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/marketplace/single-mode-card-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/prompt-input/default-200-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/prompt-input/default-420-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/prompt-input/with-model-override-200-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/prompt-input/with-model-override-420-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/prompt-input/with-thinking-200-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/prompt-input/with-thinking-420-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+77, -29)
- `packages/kilo-vscode/webview-ui/agent-manager/WorktreeItem.tsx` (+210, -112)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+193, -43)
- `packages/kilo-vscode/webview-ui/src/components/chat/ContextProgress.tsx` (+81, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskHeader.tsx` (+94, -2)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskTimeline.tsx` (+167, -0)
- `packages/kilo-vscode/webview-ui/src/components/migration/MigrationWizard.tsx` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/components/migration/migration.css` (+4, -1)
- `packages/kilo-vscode/webview-ui/src/components/shared/WorkingIndicator.tsx` (+24, -1)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/styles/chat.css` (+186, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages.ts` (+91, -0)
- `packages/kilo-vscode/webview-ui/src/utils/timeline/colors.ts` (+91, -0)
- `packages/kilo-vscode/webview-ui/src/utils/timeline/sizes.ts` (+62, -0)
- `packages/opencode/package.json` (+5, -5)
- `packages/opencode/src/file/ignore.ts` (+0, -2)
- `packages/opencode/src/kilocode/plan-followup.ts` (+15, -11)
- `packages/opencode/src/kilocode/review/review.ts` (+35, -2)
- `packages/opencode/src/mcp/index.ts` (+12, -2)
- `packages/opencode/src/provider/transform.ts` (+10, -2)
- `packages/opencode/src/server/routes/pty.ts` (+1, -0)
- `packages/opencode/src/snapshot/index.ts` (+185, -37)
- `packages/opencode/test/kilocode/mcp-docker-rm.test.ts` (+31, -0)
- `packages/opencode/test/kilocode/plan-followup.test.ts` (+24, -4)
- `packages/opencode/test/snapshot/snapshot.test.ts` (+411, -0)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+2, -2)
- `packages/util/package.json` (+1, -1)
- `script/check-opencode-annotations.ts` (+168, -0)
- `script/release` (+2, -1)
- `script/upstream/package.json` (+1, -1)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

(no key diffs to show)

## opencode Changes (3c96bf8..ae614d9)

### Commits

- ae614d9 - fix(tui): simplify console org display (#21339) (Kit Langton, 2026-04-07)
- 65cde7f - chore: update nix node_modules hashes (opencode-agent[bot], 2026-04-08)
- 98325dc - release: v1.4.0 (opencode, 2026-04-08)
- 0788a53 - chore: generate (opencode-agent[bot], 2026-04-07)
- b7fab49 - refactor(snapshot): store unified patches in file diffs (#21244) (Dax, 2026-04-07)
- 4633184 - core: refactor tool system to remove agent context from initialization (#21052) (Dax, 2026-04-07)
- 7afb517 - go: glm5.1 (Frank, 2026-04-07)
- c589724 - zen: glm5.1 doc (Frank, 2026-04-07)
- 9385714 - zen: glm5.1 doc (Frank, 2026-04-07)
- c90fc6a - feat(opencode): add OTLP observability support (#21387) (Dax, 2026-04-07)
- bc1840b - fix(opencode): clear webfetch timeouts on failed fetches (#21378) (Aiden Cline, 2026-04-07)
- 095aeba - test: disable GPG signing in test fixtures (#20386) (Kyle Altendorf, 2026-04-07)
- e945436 - feat(tui): allow variant_list keybind for the "Switch model variant" command (#21185) (Ariane Emory, 2026-04-07)
- 6bfa82d - chore: generate (opencode-agent[bot], 2026-04-07)
- d83fe4b - fix(opencode): improve console login transport errors (#21350) (Kit Langton, 2026-04-07)
- 81bdffc - fix: ensure the alibaba provider errors are retried (#21355) (Aiden Cline, 2026-04-07)
- 2549a38 - fix(tui): use sentence case for theme mode command palette items (#21192) (Ariane Emory, 2026-04-07)
- 5d48e7b - refactor(core): support multiple event streams in worker and remove workspaces from plugin api (#21348) (James Long, 2026-04-07)
- ec8b981 - feat(app): better subagent experience (#20708) (Adam, 2026-04-07)
- 65318a8 - chore: update web stats (Adam, 2026-04-07)
- 6a5aae9 - chore: generate (opencode-agent[bot], 2026-04-07)
- 1f94c48 - fix(opencode): keep user message variants scoped to model (#21332) (Dax, 2026-04-07)
- 01c5eb6 - go: support coupon (Frank, 2026-04-07)
- 41612b3 - Move auto-accept permissions to settings (#21308) (Shoubhit Dash, 2026-04-07)
- c2d2ca3 - style(app): redesign jump-to-bottom button per figma spec (#21313) (Shoubhit Dash, 2026-04-07)
- 3a1ec27 - feat(app): show full names on composer attachment chips (#21306) (Shoubhit Dash, 2026-04-07)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/apply_patch.ts` (+1, -3)
- `packages/opencode/src/tool/bash.ts` (+17, -15)
- `packages/opencode/src/tool/batch.ts` (+0, -183)
- `packages/opencode/src/tool/batch.txt` (+0, -24)
- `packages/opencode/src/tool/edit.ts` (+1, -2)
- `packages/opencode/src/tool/question.ts` (+1, -1)
- `packages/opencode/src/tool/registry.ts` (+104, -111)
- `packages/opencode/src/tool/skill.ts` (+29, -14)
- `packages/opencode/src/tool/task.ts` (+33, -30)
- `packages/opencode/src/tool/task.txt` (+0, -3)
- `packages/opencode/src/tool/todo.ts` (+1, -1)
- `packages/opencode/src/tool/tool.ts` (+26, -11)
- `packages/opencode/src/tool/webfetch.ts` (+12, -8)
- `packages/opencode/src/tool/websearch.ts` (+20, -20)
- `packages/opencode/test/tool/apply_patch.test.ts` (+6, -8)
- `packages/opencode/test/tool/registry.test.ts` (+31, -0)
- `packages/opencode/test/tool/skill.test.ts` (+13, -10)
- `packages/opencode/test/tool/task.test.ts` (+10, -9)
- `packages/opencode/test/tool/tool-define.test.ts` (+0, -52)
- `packages/opencode/test/tool/webfetch.test.ts` (+52, -0)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/console/core/package.json` (+1, -1)
- `packages/console/core/src/billing.ts` (+1, -1)
- `packages/console/core/src/lite.ts` (+6, -1)
- `packages/console/core/sst-env.d.ts` (+5, -0)
- `packages/enterprise/src/core/share.ts` (+2, -2)

#### Other Changes
- `bun.lock` (+20, -16)
- `infra/console.ts` (+8, -0)
- `nix/hashes.json` (+4, -4)
- `package.json` (+1, -0)
- `packages/app/e2e/actions.ts` (+1, -0)
- `packages/app/e2e/prompt/prompt-shell.spec.ts` (+9, -6)
- `packages/app/e2e/session/session-child-navigation.spec.ts` (+23, -6)
- `packages/app/e2e/session/session-composer-dock.spec.ts` (+10, -11)
- `packages/app/package.json` (+1, -1)
- `packages/app/src/components/prompt-input.tsx` (+1, -38)
- `packages/app/src/components/prompt-input/image-attachments.tsx` (+30, -27)
- `packages/app/src/components/prompt-input/submit.test.ts` (+2, -3)
- `packages/app/src/components/prompt-input/submit.ts` (+1, -2)
- `packages/app/src/components/settings-general.tsx` (+39, -0)
- `packages/app/src/context/global-sync/event-reducer.ts` (+2, -2)
- `packages/app/src/context/global-sync/session-cache.test.ts` (+3, -3)
- `packages/app/src/context/global-sync/session-cache.ts` (+2, -2)
- `packages/app/src/context/global-sync/types.ts` (+2, -2)
- `packages/app/src/context/local.tsx` (+3, -3)
- `packages/app/src/context/sync.tsx` (+1, -2)
- `packages/app/src/i18n/en.ts` (+2, -0)
- `packages/app/src/index.css` (+40, -0)
- `packages/app/src/pages/layout.tsx` (+0, -17)
- `packages/app/src/pages/layout/helpers.test.ts` (+14, -0)
- `packages/app/src/pages/layout/helpers.ts` (+10, -11)
- `packages/app/src/pages/layout/sidebar-items.tsx` (+92, -204)
- `packages/app/src/pages/layout/sidebar-project.tsx` (+5, -22)
- `packages/app/src/pages/layout/sidebar-workspace.tsx` (+2, -24)
- `packages/app/src/pages/session.tsx` (+44, -52)
- `packages/app/src/pages/session/composer/session-composer-region.tsx` (+49, -12)
- `packages/app/src/pages/session/message-timeline.tsx` (+265, -166)
- `packages/app/src/pages/session/review-tab.tsx` (+4, -2)
- `packages/app/src/pages/session/session-model-helpers.test.ts` (+5, -4)
- `packages/app/src/pages/session/session-side-panel.tsx` (+2, -2)
- `packages/app/src/utils/agent.ts` (+22, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/config.ts` (+5, -5)
- `packages/console/app/src/i18n/ar.ts` (+5, -5)
- `packages/console/app/src/i18n/br.ts` (+5, -5)
- `packages/console/app/src/i18n/da.ts` (+5, -5)
- `packages/console/app/src/i18n/de.ts` (+5, -5)
- `packages/console/app/src/i18n/en.ts` (+5, -5)
- `packages/console/app/src/i18n/es.ts` (+5, -5)
- `packages/console/app/src/i18n/fr.ts` (+5, -5)
- `packages/console/app/src/i18n/it.ts` (+5, -5)
- `packages/console/app/src/i18n/ja.ts` (+5, -5)
- `packages/console/app/src/i18n/ko.ts` (+5, -5)
- `packages/console/app/src/i18n/no.ts` (+5, -5)
- `packages/console/app/src/i18n/pl.ts` (+5, -5)
- `packages/console/app/src/i18n/ru.ts` (+5, -5)
- `packages/console/app/src/i18n/th.ts` (+5, -5)
- `packages/console/app/src/i18n/tr.ts` (+5, -5)
- `packages/console/app/src/i18n/zh.ts` (+5, -5)
- `packages/console/app/src/i18n/zht.ts` (+5, -5)
- `packages/console/app/src/routes/go/index.tsx` (+4, -4)
- `packages/console/app/src/routes/stripe/webhook.ts` (+8, -25)
- `packages/console/app/src/routes/workspace/[id]/go/lite-section.tsx` (+1, -0)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/function/sst-env.d.ts` (+5, -0)
- `packages/console/mail/package.json` (+1, -1)
- `packages/console/resource/sst-env.d.ts` (+5, -0)
- `packages/desktop-electron/package.json` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/enterprise/package.json` (+1, -1)
- `packages/enterprise/src/routes/share/[shareID].tsx` (+2, -2)
- `packages/enterprise/sst-env.d.ts` (+5, -0)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/function/package.json` (+1, -1)
- `packages/function/sst-env.d.ts` (+5, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/specs/{v2.md => v2/keymappings.md}` (+1, -5)
- `packages/opencode/specs/v2/message-shape.md` (+136, -0)
- `packages/opencode/src/account/index.ts` (+35, -10)
- `packages/opencode/src/account/repo.ts` (+5, -2)
- `packages/opencode/src/account/schema.ts` (+29, -1)
- `packages/opencode/src/account/url.ts` (+8, -0)
- `packages/opencode/src/cli/cmd/debug/agent.ts` (+4, -1)
- `packages/opencode/src/cli/cmd/tui/app.tsx` (+3, -5)
- `packages/opencode/src/cli/cmd/tui/component/dialog-model.tsx` (+3, -10)
- `packages/opencode/src/cli/cmd/tui/component/dialog-provider.tsx` (+2, -6)
- `packages/opencode/src/cli/cmd/tui/component/prompt/index.tsx` (+9, -26)
- `packages/opencode/src/cli/cmd/tui/context/sdk.tsx` (+3, -16)
- `packages/opencode/src/cli/cmd/tui/plugin/api.tsx` (+2, -35)
- `packages/opencode/src/cli/cmd/tui/plugin/runtime.ts` (+0, -2)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+1, -7)
- `packages/opencode/src/cli/cmd/tui/thread.ts` (+12, -3)
- `packages/opencode/src/cli/cmd/tui/util/provider-origin.ts` (+0, -13)
- `packages/opencode/src/cli/cmd/tui/worker.ts` (+34, -14)
- `packages/opencode/src/cli/error.ts` (+4, -0)
- `packages/opencode/src/config/config.ts` (+1, -0)
- `packages/opencode/src/effect/oltp.ts` (+34, -0)
- `packages/opencode/src/effect/run-service.ts` (+2, -1)
- `packages/opencode/src/flag/flag.ts` (+3, -0)
- `packages/opencode/src/project/vcs.ts` (+19, -5)
- `packages/opencode/src/server/instance.ts` (+1, -1)
- `packages/opencode/src/server/routes/experimental.ts` (+6, -1)
- `packages/opencode/src/session/compaction.ts` (+1, -2)
- `packages/opencode/src/session/llm.ts` (+3, -1)
- `packages/opencode/src/session/message-v2.ts` (+1, -1)
- `packages/opencode/src/session/prompt.ts` (+18, -16)
- `packages/opencode/src/session/retry.ts` (+13, -0)
- `packages/opencode/src/share/share-next.ts` (+1, -1)
- `packages/opencode/src/skill/index.ts` (+15, -9)
- `packages/opencode/src/snapshot/index.ts` (+6, -9)
- `packages/opencode/test/account/repo.test.ts` (+26, -0)
- `packages/opencode/test/account/service.test.ts` (+65, -2)
- `packages/opencode/test/cli/error.test.ts` (+18, -0)
- `packages/opencode/test/file/index.test.ts` (+7, -7)
- `packages/opencode/test/fixture/fixture.ts` (+2, -0)
- `packages/opencode/test/fixture/tui-plugin.ts` (+0, -9)
- `packages/opencode/test/project/migrate-global.test.ts` (+1, -0)
- `packages/opencode/test/session/llm.test.ts` (+2, -4)
- `packages/opencode/test/session/prompt.test.ts` (+8, -4)
- `packages/opencode/test/session/retry.test.ts` (+19, -0)
- `packages/opencode/test/share/share-next.test.ts` (+7, -8)
- `packages/opencode/test/snapshot/snapshot.test.ts` (+15, -22)
- `packages/plugin/package.json` (+1, -1)
- `packages/plugin/src/tui.ts` (+0, -2)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/client.ts` (+2, -1)
- `packages/sdk/js/src/v2/data.ts` (+32, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+18, -11)
- `packages/sdk/js/src/v2/index.ts` (+3, -0)
- `packages/sdk/openapi.json` (+35, -16)
- `packages/slack/package.json` (+1, -1)
- `packages/ui/package.json` (+2, -1)
- `packages/ui/src/components/basic-tool.css` (+92, -0)
- `packages/ui/src/components/basic-tool.tsx` (+86, -56)
- `packages/ui/src/components/collapsible.css` (+5, -0)
- `packages/ui/src/components/file-media.tsx` (+2, -0)
- `packages/ui/src/components/file-ssr.tsx` (+26, -11)
- `packages/ui/src/components/file.tsx` (+38, -6)
- `packages/ui/src/components/message-part.tsx` (+120, -30)
- `packages/ui/src/components/session-diff.test.ts` (+37, -0)
- `packages/ui/src/components/session-diff.ts` (+83, -0)
- `packages/ui/src/components/session-review.tsx` (+15, -21)
- `packages/ui/src/components/session-turn.tsx` (+11, -9)
- `packages/ui/src/context/data.tsx` (+6, -2)
- `packages/util/package.json` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/ar/go.mdx` (+9, -7)
- `packages/web/src/content/docs/ar/keybinds.mdx` (+1, -0)
- `packages/web/src/content/docs/ar/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/bs/go.mdx` (+9, -7)
- `packages/web/src/content/docs/bs/keybinds.mdx` (+1, -0)
- `packages/web/src/content/docs/bs/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/da/go.mdx` (+9, -7)
- `packages/web/src/content/docs/da/keybinds.mdx` (+1, -0)
- `packages/web/src/content/docs/da/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/de/go.mdx` (+9, -7)
- `packages/web/src/content/docs/de/keybinds.mdx` (+1, -0)
- `packages/web/src/content/docs/de/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/es/go.mdx` (+9, -7)
- `packages/web/src/content/docs/es/keybinds.mdx` (+1, -0)
- `packages/web/src/content/docs/es/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/fr/go.mdx` (+9, -7)
- `packages/web/src/content/docs/fr/keybinds.mdx` (+1, -0)
- `packages/web/src/content/docs/fr/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/go.mdx` (+9, -7)
- `packages/web/src/content/docs/it/go.mdx` (+9, -7)
- `packages/web/src/content/docs/it/keybinds.mdx` (+1, -0)
- `packages/web/src/content/docs/it/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/ja/go.mdx` (+9, -7)
- `packages/web/src/content/docs/ja/keybinds.mdx` (+1, -0)
- `packages/web/src/content/docs/ja/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/keybinds.mdx` (+1, -0)
- `packages/web/src/content/docs/ko/go.mdx` (+9, -7)
- `packages/web/src/content/docs/ko/keybinds.mdx` (+1, -0)
- `packages/web/src/content/docs/ko/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/nb/go.mdx` (+9, -7)
- `packages/web/src/content/docs/nb/keybinds.mdx` (+1, -0)
- `packages/web/src/content/docs/nb/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/pl/go.mdx` (+9, -7)
- `packages/web/src/content/docs/pl/keybinds.mdx` (+1, -0)
- `packages/web/src/content/docs/pl/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/pt-br/go.mdx` (+9, -7)
- `packages/web/src/content/docs/pt-br/keybinds.mdx` (+1, -0)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/ru/go.mdx` (+9, -7)
- `packages/web/src/content/docs/ru/keybinds.mdx` (+1, -0)
- `packages/web/src/content/docs/ru/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/th/go.mdx` (+9, -7)
- `packages/web/src/content/docs/th/keybinds.mdx` (+1, -0)
- `packages/web/src/content/docs/th/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/tr/go.mdx` (+9, -7)
- `packages/web/src/content/docs/tr/keybinds.mdx` (+1, -0)
- `packages/web/src/content/docs/tr/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+9, -7)
- `packages/web/src/content/docs/zh-cn/keybinds.mdx` (+1, -0)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+9, -7)
- `packages/web/src/content/docs/zh-tw/keybinds.mdx` (+1, -0)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+2, -0)
- `sdks/vscode/package.json` (+1, -1)
- `sst-env.d.ts` (+5, -0)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index ae5185e..27bbe65 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.3.17",
+  "version": "1.4.0",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/console/core/src/billing.ts
```diff
diff --git a/packages/console/core/src/billing.ts b/packages/console/core/src/billing.ts
index 66b9806..9de413e 100644
--- a/packages/console/core/src/billing.ts
+++ b/packages/console/core/src/billing.ts
@@ -254,7 +254,7 @@ export namespace Billing {
       const createSession = () =>
         Billing.stripe().checkout.sessions.create({
           mode: "subscription",
-          discounts: [{ coupon: LiteData.firstMonth50Coupon() }],
+          discounts: [{ coupon: LiteData.firstMonthCoupon(email!) }],
           ...(billing.customerID
             ? {
                 customer: billing.customerID,
```

#### packages/console/core/src/lite.ts
```diff
diff --git a/packages/console/core/src/lite.ts b/packages/console/core/src/lite.ts
index 2c4a09f..3343192 100644
--- a/packages/console/core/src/lite.ts
+++ b/packages/console/core/src/lite.ts
@@ -11,6 +11,11 @@ export namespace LiteData {
   export const productID = fn(z.void(), () => Resource.ZEN_LITE_PRICE.product)
   export const priceID = fn(z.void(), () => Resource.ZEN_LITE_PRICE.price)
   export const priceInr = fn(z.void(), () => Resource.ZEN_LITE_PRICE.priceInr)
-  export const firstMonth50Coupon = fn(z.void(), () => Resource.ZEN_LITE_PRICE.firstMonth50Coupon)
+  export const firstMonthCoupon = fn(z.string(), (email) => {
+    const invitees = Resource.ZEN_LITE_COUPON_FIRST_MONTH_100_INVITEES.value.split(",")
+    return invitees.includes(email)
+      ? Resource.ZEN_LITE_PRICE.firstMonth100Coupon
+      : Resource.ZEN_LITE_PRICE.firstMonth50Coupon
+  })
   export const planName = fn(z.void(), () => "lite")
 }
```

#### packages/console/core/sst-env.d.ts
```diff
diff --git a/packages/console/core/sst-env.d.ts b/packages/console/core/sst-env.d.ts
index 6b84263..b77ee3c 100644
--- a/packages/console/core/sst-env.d.ts
+++ b/packages/console/core/sst-env.d.ts
@@ -142,7 +142,12 @@ declare module "sst" {
       "type": "sst.sst.Secret"
       "value": string
     }
+    "ZEN_LITE_COUPON_FIRST_MONTH_100_INVITEES": {
+      "type": "sst.sst.Secret"
+      "value": string
+    }
     "ZEN_LITE_PRICE": {
+      "firstMonth100Coupon": string
       "firstMonth50Coupon": string
       "price": string
       "priceInr": number
```

#### packages/enterprise/src/core/share.ts
```diff
diff --git a/packages/enterprise/src/core/share.ts b/packages/enterprise/src/core/share.ts
index c6291b7..18fcd7a 100644
--- a/packages/enterprise/src/core/share.ts
+++ b/packages/enterprise/src/core/share.ts
@@ -1,4 +1,4 @@
-import { FileDiff, Message, Model, Part, Session } from "@opencode-ai/sdk/v2"
+import { Message, Model, Part, Session, SnapshotFileDiff } from "@opencode-ai/sdk/v2"
 import { fn } from "@opencode-ai/util/fn"
 import { iife } from "@opencode-ai/util/iife"
 import z from "zod"
@@ -27,7 +27,7 @@ export namespace Share {
     }),
     z.object({
       type: z.literal("session_diff"),
-      data: z.custom<FileDiff[]>(),
+      data: z.custom<SnapshotFileDiff[]>(),
     }),
     z.object({
       type: z.literal("model"),
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/tool/apply_patch.test.ts` - update based on opencode packages/opencode/test/tool/apply_patch.test.ts changes
- `src/tool/apply_patch.ts` - update based on opencode packages/opencode/src/tool/apply_patch.ts changes
- `src/tool/bash.ts` - update based on opencode packages/opencode/src/tool/bash.ts changes
- `src/tool/batch.ts` - update based on opencode packages/opencode/src/tool/batch.ts changes
- `src/tool/batch.txt.ts` - update based on opencode packages/opencode/src/tool/batch.txt changes
- `src/tool/edit.ts` - update based on opencode packages/opencode/src/tool/edit.ts changes
- `src/tool/question.ts` - update based on opencode packages/opencode/src/tool/question.ts changes
- `src/tool/registry.test.ts` - update based on opencode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on opencode packages/opencode/src/tool/registry.ts changes
- `src/tool/skill.test.ts` - update based on opencode packages/opencode/test/tool/skill.test.ts changes
- `src/tool/skill.ts` - update based on opencode packages/opencode/src/tool/skill.ts changes
- `src/tool/task.test.ts` - update based on opencode packages/opencode/test/tool/task.test.ts changes
- `src/tool/task.ts` - update based on opencode packages/opencode/src/tool/task.ts changes
- `src/tool/task.txt.ts` - update based on opencode packages/opencode/src/tool/task.txt changes
- `src/tool/todo.ts` - update based on opencode packages/opencode/src/tool/todo.ts changes
- `src/tool/tool-define.test.ts` - update based on opencode packages/opencode/test/tool/tool-define.test.ts changes
- `src/tool/tool.ts` - update based on opencode packages/opencode/src/tool/tool.ts changes
- `src/tool/webfetch.test.ts` - update based on opencode packages/opencode/test/tool/webfetch.test.ts changes
- `src/tool/webfetch.ts` - update based on opencode packages/opencode/src/tool/webfetch.ts changes
- `src/tool/websearch.ts` - update based on opencode packages/opencode/src/tool/websearch.ts changes
