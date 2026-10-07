# Upstream Changes Report
Generated: 2026-10-07 12:47:35

## Summary
- kilocode: 126 commits, 355 files changed
- opencode: 8 commits, 55 files changed

## kilocode Changes (4433f275f..5e9f816fc)

### Commits

- 5e9f816fc - Merge pull request #14871 from mardausdennis/fix/windows-check-scripts (Marius, 2026-10-07)
- e04b99dde - Merge pull request #14859 from Kilo-Org/kilo/cloud-session-sort-polish (Bruno Agatão, 2026-10-07)
- 33e52f196 - Merge pull request #14872 from mardausdennis/fix/pre-push-worktree-gitdir (Marius, 2026-10-07)
- 20fb04720 - Merge pull request #13593 from maphew/fix/13185-model-message-diagnostics (Andrea Giammarchi, 2026-10-07)
- dd23b03e3 - Merge branch 'main' into fix/13185-model-message-diagnostics (Andrea Giammarchi, 2026-10-07)
- 5ee9257b8 - Merge pull request #14537 from Kilo-Org/kilo/config-overlay-shadowed-error (Bruno Agatão, 2026-10-07)
- 2f09fbda1 - Merge branch 'main' into kilo/config-overlay-shadowed-error (Bruno Agatão, 2026-10-07)
- e2887f08e - release: v7.8.8 (kilo-maintainer[bot], 2026-10-07)
- a956920f9 - Merge pull request #14845 from Kilo-Org/chore/security-workflow-improvements (Bruno Agatão, 2026-10-07)
- 3d48d99b1 - Merge pull request #14885 from Kilo-Org/enable-integrated-agent-manager-links (Marius, 2026-10-07)
- 405cea915 - Merge pull request #14891 from Kilo-Org/allow-worktree-pinning-agent-manager (Marius, 2026-10-07)
- 5f53a5730 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-10-07)
- 9d0ac627e - fix(agent-manager): keep the pin on no-op section moves (marius-kilocode, 2026-10-07)
- 72d79ab12 - Merge pull request #14888 from Kilo-Org/reduce-sessions-top-bar-height (Marius, 2026-10-07)
- c48bfc122 - chore(agent-manager): format pin worktree changes (marius-kilocode, 2026-10-07)
- fa6990d97 - Merge pull request #14889 from Kilo-Org/chore/deps-mcp-sharp (Andrea Giammarchi, 2026-10-07)
- c6ce6afdc - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-10-07)
- 994a172fe - fix(vscode): keep scroll-to-bottom button clear of prompt rail (marius-kilocode, 2026-10-07)
- b1e7f34a4 - Merge pull request #14890 from Kilo-Org/reduce-agent-manager-section-header-height (Marius, 2026-10-07)
- 0169ede29 - fix(vscode): preserve browser launch hint in tab open failures (marius-kilocode, 2026-10-07)
- 656e8510d - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-10-07)
- aab7f87e9 - fix(vscode): honor workspace trust and surface browser open failures (marius-kilocode, 2026-10-07)
- ce9a04b0f - feat(agent-manager): pin worktrees in the sidebar (marius-kilocode, 2026-10-07)
- 84b26c697 - fix(cli): let configured MCP OAuth clients re-authorize at a new authorization server (webreflection, 2026-10-07)
- 345305962 - fix(agent-manager): reduce section header height (marius-kilocode, 2026-10-07)
- 5c3f6652c - Merge branch 'main' into fix/13185-model-message-diagnostics (Andrea Giammarchi, 2026-10-07)
- 7f6437435 - chore(deps): cumulative updates due Dependabot warnings (webreflection, 2026-10-07)
- 2f67bd061 - Merge pull request #14887 from Kilo-Org/add-session-switching-keyboard-shortcuts (Marius, 2026-10-07)
- de48c4056 - chore: include kilo-ui in session header changeset (marius-kilocode, 2026-10-07)
- cfb815a5f - Merge pull request #14880 from maphew/fix/board-self-identification (Marius, 2026-10-07)
- d24f76d74 - fix(vscode): fall back externally when in-app browser open throws (marius-kilocode, 2026-10-07)
- 0eccfbd5e - Merge pull request #14886 from Kilo-Org/add-active-session-requirement-to-agent-manager-br (Marius, 2026-10-07)
- e61466e8c - Merge pull request #14884 from Kilo-Org/chestnut-starburst (Marius, 2026-10-07)
- 35da0f181 - fix(vscode): reduce session header height (marius-kilocode, 2026-10-07)
- b0eab83e8 - fix(vscode): route chat links to the Integrated Browser tab (marius-kilocode, 2026-10-07)
- 248e9ae46 - feat(vscode): switch session tabs with keyboard shortcuts (marius-kilocode, 2026-10-07)
- e77df9cbb - style(vscode): wrap the browser scale expression for prettier (marius-kilocode, 2026-10-07)
- 18ead3aa4 - chore: annotate shared data context for upstream merge (marius-kilocode, 2026-10-07)
- de2aa96c5 - fix(vscode): clamp browser viewport to the stream limit (marius-kilocode, 2026-10-07)
- 8781c165c - fix(vscode): explain the Integrated Browser needs an active session (marius-kilocode, 2026-10-07)
- 0abb25432 - feat(vscode): open chat web links in the integrated browser (marius-kilocode, 2026-10-07)
- 483de0f48 - Merge pull request #14854 from Kilo-Org/fix-wsl-playwright-chromium-configuration (Marius, 2026-10-07)
- d6b3b214d - fix(vscode): keep browser preview visible across navigation and resize (marius-kilocode, 2026-10-07)
- 6aed4c8f1 - Merge branch 'main' into fix-wsl-playwright-chromium-configuration (Marius, 2026-10-07)
- 759a6ef99 - fix(board): expose self identity on the roster and make self-post failures actionable (matt wilkie, 2026-10-06)
- 113caf191 - Merge pull request #14873 from Kilo-Org/chore/jetbrains-cli-pin-v7.8.7 (Kirill Kalishev, 2026-10-06)
- 7dfae0c7c - chore(jetbrains): bump CLI pin to v7.8.7 (kilo-maintainer[bot], 2026-10-07)
- 4a77c13af - release: v7.8.7 (kilo-maintainer[bot], 2026-10-07)
- 8b71909aa - fix: clear git environment in pre-push so turbo works from linked worktrees (mardausdennis, 2026-10-06)
- 5f37d7473 - fix(script): normalize glob paths so the promise facade check runs on Windows (mardausdennis, 2026-10-06)
- b3b682428 - Merge pull request #14868 from Kilo-Org/fix/release-asset-upload-retry (Kirill Kalishev, 2026-10-06)
- 965deafb7 - test(cli): restore managed config dir env after shadow test (Bruno Agatao, 2026-10-06)
- 16d0408da - fix(cli): upload release assets one at a time with retries (kirillk, 2026-10-06)
- a93170232 - Merge pull request #14860 from Kilo-Org/fearless-walrus (Kirill Kalishev, 2026-10-06)
- af616f974 - chore(cli): make validate-cli-smoke dispatch-only (kirillk, 2026-10-06)
- 6eed952b1 - fix(cli): test the worker handshake against a real worker and report timeouts (kirillk, 2026-10-06)
- 506fa0876 - fix(cli): drop dead conflicting helper and check managed files for new targets (Bruno Agatao, 2026-10-06)
- f96c16941 - fix(cli): annotate the Rpc.arm call in the shared worker entry (kirillk, 2026-10-06)
- 7420e7370 - Merge pull request #14852 from Kilo-Org/fix-browser-scrolling-and-selection (Marius, 2026-10-06)
- 43d88ef6b - fix(cli): address review feedback on the worker rpc handshake (kirillk, 2026-10-06)
- 3794074e3 - refactor(vscode): keep wheel batching independent of pointer movement (marius-kilocode, 2026-10-06)
- 114a87cc0 - chore(cli): make validate-cli-smoke dispatch-only (kirillk, 2026-10-06)
- 185727f20 - fix(vscode): compare cloud message ids by byte order (Bruno Agatao, 2026-10-06)
- b1395f98d - fix(cli): reject shadowed config overlay writes before saving (Bruno Agatao, 2026-10-06)
- 671508dc9 - Merge remote-tracking branch 'origin/main' into kilo/config-overlay-shadowed-error (Bruno Agatao, 2026-10-06)
- dd038205b - fix(cli): gate TUI worker requests on an explicit ready handshake (kirillk, 2026-10-06)
- 161cd48b8 - Merge pull request #14855 from Kilo-Org/quickest-risk (Marius, 2026-10-06)
- 1e241b661 - test(cli): report unanswered worker rpc before the smoke watchdog fires (kirillk, 2026-10-06)
- 2d209e6d3 - fix(cli): stop the TUI worker RPC from hanging on a dropped request (kirillk, 2026-10-06)
- eb88cf179 - Merge pull request #14853 from Kilo-Org/align-keyboard-shortcuts (Marius, 2026-10-06)
- bbf87ad2c - Merge pull request #14821 from Kilo-Org/kilo/fix-cloud-session-message-order (Bruno Agatão, 2026-10-06)
- 6381dc1a4 - refactor(vscode): generalize missing-browser error detection (marius-kilocode, 2026-10-06)
- 3fd7e2f89 - test(cli): narrow the PTY smoke stall to the TUI worker RPC (kirillk, 2026-10-06)
- ef101470d - fix(vscode): scope browser hover refresh to the scroll settle window (marius-kilocode, 2026-10-06)
- b0ac34c50 - fix(cli): surface CLI logs when the release PTY smoke stalls (kirillk, 2026-10-06)
- ad37e0b67 - fix(vscode): prefix pin hint class for shared stylesheet (marius-kilocode, 2026-10-06)
- 82fddfdd6 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-10-06)
- 221781aa2 - Merge commit 'acb93b134ec3095e3ed72a4e9c345ed97f2fc702' into fix-wsl-playwright-chromium-configuration (marius-kilocode, 2026-10-06)
- 2049b821f - feat(vscode): pin session tabs with shift-click (marius-kilocode, 2026-10-06)
- acb93b134 - Merge pull request #14848 from Kilo-Org/chore/katex-0.19 (Andrea Giammarchi, 2026-10-06)
- 2c859919d - fix(vscode): use installed Chromium in WSL when Chrome is missing (marius-kilocode, 2026-10-06)
- b0820ac2c - fix(agent-manager): match shortcut hint keycaps to prompt input (marius-kilocode, 2026-10-06)
- 7ab506117 - fix(vscode): allow scrolling while selecting integrated browser elements (marius-kilocode, 2026-10-06)
- 64a443336 - Merge branch 'main' into fix/13185-model-message-diagnostics (matt wilkie, 2026-10-06)
- 643cfc39a - chore(deps): update KaTeX due Dependabot warnings (webreflection, 2026-10-06)
- 99dbfa55c - Merge pull request #14805 from abdulhusainahk/fix/14790-commit-message-provider-errors (Marius, 2026-10-06)
- 65fbcc62a - chore(ci): read secret scanning alerts with an optional SECURITY_SCAN_TOKEN (Bruno Agatao, 2026-10-06)
- 9d0f7a1dd - Merge pull request #14763 from AlpenMo/docs/kilo-desktop (Emilie Lima Schario, 2026-10-06)
- ec4c6f1dc - Merge branch 'main' into docs/kilo-desktop (Joshua Lambert, 2026-10-06)
- 37051253d - Apply suggestion from @emilieschario (Emilie Lima Schario, 2026-10-06)
- ba48e8408 - Merge pull request #14728 from Kilo-Org/docs/auto-sync/cloud-mobile (Igor Šćekić, 2026-10-06)
- 39705ab94 - Merge pull request #14841 from Kilo-Org/fix/browser-broker-owner-scope (Marius, 2026-10-06)
- d915704a1 - chore(ci): group duplicate bot PRs, cover more alert sources, report stale alerts (Bruno Agatao, 2026-10-06)
- f51e78fda - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-10-06)
- 1d8609d23 - Merge branch 'docs/kilo-desktop' of github.com:AlpenMo/kilocode into docs/kilo-desktop (Maureen Murphy, 2026-10-06)
- ab0fa8427 - Mihaela's PR edits (Maureen Murphy, 2026-10-06)
- 8048b034b - Merge pull request #14834 from Kilo-Org/chore/deps-cumulative (Andrea Giammarchi, 2026-10-06)
- 496d13448 - fix(vscode): drop browser owner claims when the queue drains (marius-kilocode, 2026-10-06)
- 3aee24143 - fix(vscode): close in-flight browser opens per owner and route by ownership (marius-kilocode, 2026-10-06)
- a30be4378 - fix(agent-manager): refuse base fetch with an inherited GIT_SSH_COMMAND (webreflection, 2026-10-06)
- 4e0131e41 - chore(deps): cumulative updates due Dependabot warnings (webreflection, 2026-10-06)
- 11769d2a6 - Merge branch 'main' into fix/13185-model-message-diagnostics (Andrea Giammarchi, 2026-10-06)
- 6cfafe571 - Merge remote-tracking branch 'origin/main' into HEAD (github-actions[bot], 2026-10-06)
- f54e713dd - fix(cli): preserve commit-message provider errors (Abdul Kanchwala, 2026-10-06)
- e80e1a61b - fix(vscode): preserve message ordering for cloud sessions in history view (kiloconnect[bot], 2026-10-06)
- cb15045c5 - Merge remote-tracking branch 'origin/main' into pr-14763 (Iván Uruchurtu, 2026-10-05)
- 6b3e9fdda - fix(kilo-docs): render svgIcon as a CSS mask instead of fetched inline markup (Iván Uruchurtu, 2026-10-05)
- de66df83d - Merge branch 'main' into docs/kilo-desktop (Joshua Lambert, 2026-10-05)
- a8fbcc356 - fix(cli): prevent prompt text leak in diagnostics (matt wilkie, 2026-10-05)
- 7027dd179 - Merge branch 'main' into fix/13185-model-message-diagnostics (matt wilkie, 2026-10-05)
- 48f9c5d98 - Merge pull request #1 from owenprice-anaconda/docs/kilo-desktop-pm-edits (Maureen Murphy, 2026-10-05)
- ee7627d87 - Merge branch 'main' into fix/13185-model-message-diagnostics (matt wilkie, 2026-10-04)
- 129f0b4ec - docs(kilo-docs): PM review edits for Kilo Desktop docs (owenprice-anaconda, 2026-10-03)
- 42dafd2bd - Merge remote-tracking branch 'origin/main' into HEAD (github-actions[bot], 2026-10-03)
- c0033d4f5 - chore: remove internal planning doc from docs branch (Maureen Murphy, 2026-10-02)
- a52d719a8 - Completed Kilo Desktop documentation (Maureen Murphy, 2026-10-02)
- 4a41c9e0a - Initial commit for the Kilo Desktop docs (Maureen Murphy, 2026-10-02)
- 5a928f671 - docs: sync cloud-mobile with merged PRs (2026-10-02) (github-actions[bot], 2026-10-02)
- d99cdbbe2 - fix(cli): harden message diagnostics against malformed envelopes (matt wilkie, 2026-09-28)
- d07c1ae25 - Merge branch 'main' into fix/13185-model-message-diagnostics (matt wilkie, 2026-09-28)
- 1b8b82f1c - Merge branch 'main' into fix/13185-model-message-diagnostics (Andrea Giammarchi, 2026-09-28)
- 51b803df7 - ci: trigger rebuild for test flakiness (matt wilkie, 2026-09-27)
- 3b5a4de22 - fix(cli): guard diagnostics against malformed message parts (maphew, 2026-09-27)
- 6c894a552 - fix(cli): harden diagnostics against pathological zod issue shapes (maphew, 2026-09-27)
- 1f093ffed - fix(cli): log structural diagnostics on ModelMessage[] schema failure (maphew, 2026-09-27)
- b9e4b1e98 - fix(cli): surface shadowed and failed config overlay writes (kiloconnect[bot], 2026-09-24)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/board.ts` (+2, -2)
- `packages/opencode/test/kilocode/tool/link-pr.test.ts` (+1, -1)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)

#### Other Changes
- `.changeset/agent-manager-pool-home.md` (+0, -5)
- `.changeset/agent-manager-projects-default.md` (+0, -7)
- `.changeset/agent-manager-setup-per-worktree.md` (+0, -5)
- `.changeset/agent-manager-shortcut-hints.md` (+0, -5)
- `.changeset/browser-editor-tab.md` (+0, -5)
- `.changeset/browser-pointer-latency.md` (+0, -5)
- `.changeset/bun-runtime-1-4-2.md` (+0, -5)
- `.changeset/clean-provider-models.md` (+0, -5)
- `.changeset/cli-mcp-external-oauth.md` (+0, -5)
- `.changeset/config-overlay-shadowed-error.md` (+5, -0)
- `.changeset/dompurify-3-4-16.md` (+0, -5)
- `.changeset/fix-agent-manager-project-sessions.md` (+0, -5)
- `.changeset/fix-am-peer-turns.md` (+0, -5)
- `.changeset/fix-grep-target-path.md` (+0, -5)
- `.changeset/idle-dock-spinner.md` (+0, -5)
- `.changeset/kilo-catalog-recovery.md` (+0, -6)
- `.changeset/kilocode-message-diagnostics.md` (+5, -0)
- `.changeset/marketplace-scan-cpu.md` (+0, -6)
- `.changeset/mcp-tool-output-overflow.md` (+0, -5)
- `.changeset/memory-model-setting.md` (+0, -6)
- `.changeset/mention-path-tooltip.md` (+0, -5)
- `.changeset/per-agent-model-precedence.md` (+0, -6)
- `.changeset/per-conversation-prompt-history.md` (+0, -5)
- `.changeset/preserve-staged-worktree-renames.md` (+0, -5)
- `.changeset/project-organization-avatars.md` (+0, -5)
- `.changeset/prompt-hint-keycaps.md` (+0, -5)
- `.changeset/quick-otters-switch.md` (+0, -5)
- `.changeset/retry-thinking-indicator.md` (+0, -5)
- `.changeset/sandbox-linux-allowed-hosts-writes.md` (+0, -5)
- `.changeset/semantic-search-vscode-consent.md` (+0, -6)
- `.changeset/session-dock-todos.md` (+0, -5)
- `.changeset/settings-search.md` (+0, -5)
- `.changeset/skill-frontmatter-cache.md` (+0, -5)
- `.changeset/spreadsheet-date-times.md` (+0, -5)
- `.changeset/subagent-header-model.md` (+0, -5)
- `.changeset/swift-settings-startup.md` (+0, -6)
- `.changeset/tui-subagent-esc-interrupt.md` (+0, -5)
- `.changeset/tui-subagent-steering.md` (+0, -5)
- `.changeset/vscode-mcp-oauth-sign-in.md` (+0, -5)
- `.github/workflows/README.md` (+23, -8)
- `.github/workflows/publish.yml` (+13, -1)
- `.github/workflows/security-findings-notify.yml` (+82, -26)
- `.github/workflows/stale-alerts-report.yml` (+62, -0)
- `.github/workflows/stale-bot-pr-notify.yml` (+19, -13)
- `.github/workflows/validate-cli-smoke.yml` (+114, -0)
- `.husky/pre-push` (+6, -0)
- `artifacts/glm52-rise-video/package.json` (+1, -1)
- `bun.lock` (+74, -85)
- `nix/hashes.json` (+4, -4)
- `package.json` (+3, -2)
- `packages/client/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/httpapi-codegen/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-docs/components/SideNav.tsx` (+2, -0)
- `packages/kilo-docs/components/SvgIcon.tsx` (+31, -0)
- `packages/kilo-docs/components/TopNav.tsx` (+20, -0)
- `packages/kilo-docs/components/index.js` (+1, -0)
- `packages/kilo-docs/lib/nav/desktop.ts` (+37, -0)
- `packages/kilo-docs/lib/nav/index.ts` (+2, -0)
- `packages/kilo-docs/markdoc/tags/index.ts` (+1, -0)
- `packages/kilo-docs/markdoc/tags/svg-icon.markdoc.ts` (+22, -0)
- `packages/kilo-docs/next.config.js` (+5, -0)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/api/llms.txt.ts` (+1, -0)
- `packages/kilo-docs/pages/automate/agent-manager.md` (+11, -1)
- `packages/kilo-docs/pages/code-with-ai/agents/chat-interface.md` (+11, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/mobile.md` (+8, -0)
- `packages/kilo-docs/pages/desktop/features.md` (+16, -0)
- `packages/kilo-docs/pages/desktop/features/browser.md` (+26, -0)
- `packages/kilo-docs/pages/desktop/features/environments.md` (+84, -0)
- `packages/kilo-docs/pages/desktop/features/files.md` (+41, -0)
- `packages/kilo-docs/pages/desktop/features/git.md` (+55, -0)
- `packages/kilo-docs/pages/desktop/features/local-inference.md` (+21, -0)
- `packages/kilo-docs/pages/desktop/features/notebooks.md` (+40, -0)
- `packages/kilo-docs/pages/desktop/features/terminal.md` (+23, -0)
- `packages/kilo-docs/pages/desktop/installation.md` (+31, -0)
- `packages/kilo-docs/pages/desktop/overview.md` (+34, -0)
- `packages/kilo-docs/pages/desktop/quickstart.md` (+111, -0)
- `packages/kilo-docs/pages/desktop/settings/ai.md` (+87, -0)
- `packages/kilo-docs/pages/desktop/settings/general.md` (+51, -0)
- `packages/kilo-docs/pages/desktop/troubleshooting.md` (+36, -0)
- `packages/kilo-docs/pages/desktop/what-you-can-ask.md` (+21, -0)
- `packages/kilo-docs/pnpm-lock.yaml` (+139, -136)
- `packages/kilo-docs/pnpm-workspace.yaml` (+4, -0)
- `packages/kilo-docs/public/img/desktop/bot.svg` (+1, -0)
- `packages/kilo-docs/public/img/desktop/cable.svg` (+1, -0)
- `packages/kilo-docs/public/img/desktop/chevrons-right.svg` (+1, -0)
- `packages/kilo-docs/public/img/desktop/code.svg` (+1, -0)
- `packages/kilo-docs/public/img/desktop/ellipsis.svg` (+1, -0)
- `packages/kilo-docs/public/img/desktop/external-link.svg` (+1, -0)
- `packages/kilo-docs/public/img/desktop/eye-off.svg` (+1, -0)
- `packages/kilo-docs/public/img/desktop/eye.svg` (+1, -0)
- `packages/kilo-docs/public/img/desktop/gallery-horizontal.svg` (+1, -0)
- `packages/kilo-docs/public/img/desktop/list-chevrons-down-up.svg` (+1, -0)
- `packages/kilo-docs/public/img/desktop/list-filter.svg` (+1, -0)
- `packages/kilo-docs/public/img/desktop/maximize-2.svg` (+1, -0)
- `packages/kilo-docs/public/img/desktop/notebooks-toolbar-controls.png` (+-, --)
- `packages/kilo-docs/public/img/desktop/notebooks-with-chat.png` (+-, --)
- `packages/kilo-docs/public/img/desktop/panel-right-close.svg` (+1, -0)
- `packages/kilo-docs/public/img/desktop/panels-top-left.svg` (+1, -0)
- `packages/kilo-docs/public/img/desktop/play.svg` (+1, -0)
- `packages/kilo-docs/public/img/desktop/plus.svg` (+1, -0)
- `packages/kilo-docs/public/img/desktop/quickstart-add-tab-group-button.png` (+-, --)
- `packages/kilo-docs/public/img/desktop/quickstart-home-screen.png` (+-, --)
- `packages/kilo-docs/public/img/desktop/quickstart-panels.png` (+-, --)
- `packages/kilo-docs/public/img/desktop/rotate-ccw.svg` (+1, -0)
- `packages/kilo-docs/public/img/desktop/server.svg` (+1, -0)
- `packages/kilo-docs/public/img/desktop/settings.svg` (+1, -0)
- `packages/kilo-docs/public/img/desktop/square.svg` (+1, -0)
- `packages/kilo-docs/public/img/desktop/text-initial.svg` (+1, -0)
- `packages/kilo-docs/public/img/desktop/trash.svg` (+1, -0)
- `packages/kilo-docs/public/img/desktop/x.svg` (+1, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager-sections/all-colors-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager-sections/collapsed-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager-sections/default-color-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager-sections/dense-sidebar-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager-sections/empty-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager-sections/expanded-with-items-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager-sections/first-and-last-section-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager-sections/long-section-name-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager-sections/multiple-sections-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager-sections/with-active-worktree-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager-sections/with-busy-worktree-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager-sections/with-pr-badges-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager-sections/with-stale-worktree-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager-sections/with-versions-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/multi-project-sidebar-scrolled-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/readable-chat-1280-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/board-closed-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/board-empty-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/board-open-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-agent-manager-completed-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-readable-1280-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-readable-420-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-with-messages-chromium-linux.png` (+1, -1)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/message-list-layout-correction-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-sidebar-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-busy-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-skeleton-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-subagent-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/bash-with-permission-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/glob-with-permission-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-apply-patch-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-bash-many-rules-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-edit-chromium-linux.png` (+1, -1)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-external-dir-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-heredoc-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-skill-shell-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-subagent-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-todo-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-websearch-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-write-chromium-linux.png` (+1, -1)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/question-above-chatbox-chromium-linux.png` (+1, -1)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/todo-write-with-permission-chromium-linux.png` (+2, -2)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-memory/package.json` (+1, -1)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/markdown.css` (+12, -0)
- `packages/kilo-ui/src/components/task-header.css` (+1, -1)
- `packages/kilo-vscode/CHANGELOG.md` (+108, -0)
- `packages/kilo-vscode/package.json` (+20, -6)
- `packages/kilo-vscode/script/publish.ts` (+2, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+12, -1)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+1, -2)
- `packages/kilo-vscode/src/agent-manager/GitOps.ts` (+2, -1)
- `packages/kilo-vscode/src/agent-manager/WorktreeManager.ts` (+15, -6)
- `packages/kilo-vscode/src/agent-manager/WorktreeStateManager.ts` (+22, -2)
- `packages/kilo-vscode/src/agent-manager/am-visible-presence.ts` (+0, -5)
- `packages/kilo-vscode/src/agent-manager/project/state-gate.ts` (+1, -0)
- `packages/kilo-vscode/src/agent-manager/section-handler.ts` (+3, -1)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+8, -0)
- `packages/kilo-vscode/src/browser-links.ts` (+49, -0)
- `packages/kilo-vscode/src/browser-tab/BrowserTabProvider.ts` (+48, -1)
- `packages/kilo-vscode/src/extension.ts` (+19, -4)
- `packages/kilo-vscode/src/indexing-consent.ts` (+1, -1)
- `packages/kilo-vscode/src/kilo-provider-utils.ts` (+4, -1)
- `packages/kilo-vscode/src/kilo-provider/chat-settings.ts` (+11, -1)
- `packages/kilo-vscode/src/kilo-provider/editor-actions.ts` (+14, -0)
- `packages/kilo-vscode/src/kilo-provider/handlers/cloud-session.ts` (+5, -1)
- `packages/kilo-vscode/src/services/browser-automation/browser-broker.ts` (+53, -20)
- `packages/kilo-vscode/src/services/browser-automation/browser-control.ts` (+1, -1)
- `packages/kilo-vscode/src/services/browser-automation/browser-network.ts` (+3, -0)
- `packages/kilo-vscode/src/services/browser-automation/browser-stream.ts` (+38, -22)
- `packages/kilo-vscode/src/services/browser-automation/chrome-setting.ts` (+13, -0)
- `packages/kilo-vscode/src/services/cli-backend/types.ts` (+1, -0)
- `packages/kilo-vscode/src/shared/browser-stream.ts` (+19, -0)
- `packages/kilo-vscode/tests/fixtures/browser-panel-render.tsx` (+30, -0)
- `packages/kilo-vscode/tests/fixtures/session-tab-pin.tsx` (+94, -0)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/unit/agent-project-init.test.ts` (+1, -1)
- `packages/kilo-vscode/tests/unit/browser-automation-chrome-setting.test.ts` (+14, -0)
- `packages/kilo-vscode/tests/unit/browser-broker.test.ts` (+164, -0)
- `packages/kilo-vscode/tests/unit/browser-controller.test.ts` (+194, -1)
- `packages/kilo-vscode/tests/unit/browser-links.test.ts` (+86, -0)
- `packages/kilo-vscode/tests/unit/browser-stream-input.test.ts` (+18, -0)
- `packages/kilo-vscode/tests/unit/browser-stream.test.ts` (+15, -2)
- `packages/kilo-vscode/tests/unit/chat-settings-message.test.ts` (+42, -0)
- `packages/kilo-vscode/tests/unit/cloud-session-handler.test.ts` (+41, -0)
- `packages/kilo-vscode/tests/unit/continue-in-worktree.test.ts` (+1, -1)
- `packages/kilo-vscode/tests/unit/format-keybinding.test.ts` (+9, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-utils.test.ts` (+24, -0)
- `packages/kilo-vscode/tests/unit/local-tabs.test.ts` (+22, -0)
- `packages/kilo-vscode/tests/unit/navigate.test.ts` (+18, -0)
- `packages/kilo-vscode/tests/unit/section-helpers.test.ts` (+19, -0)
- `packages/kilo-vscode/tests/unit/session-tab-pin.test.ts` (+45, -0)
- `packages/kilo-vscode/tests/unit/shortcut-hint.test.ts` (+9, -0)
- `packages/kilo-vscode/tests/unit/worktree-manager.test.ts` (+59, -1)
- `packages/kilo-vscode/tests/unit/worktree-pool-sweep.test.ts` (+1, -1)
- `packages/kilo-vscode/tests/unit/worktree-pool.test.ts` (+1, -1)
- `packages/kilo-vscode/tests/unit/worktree-state-sections.test.ts` (+43, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+2, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectSidebarBody.tsx` (+45, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/ShortcutHints.tsx` (+3, -11)
- `packages/kilo-vscode/webview-ui/agent-manager/WorktreeItem.tsx` (+97, -4)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+64, -29)
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
- `packages/kilo-vscode/webview-ui/agent-manager/navigate.ts` (+7, -6)
- `packages/kilo-vscode/webview-ui/agent-manager/project-nav.ts` (+7, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/section-helpers.ts` (+12, -6)
- `packages/kilo-vscode/webview-ui/agent-manager/sortable-tab.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/browser/BrowserPanel.tsx` (+20, -6)
- `packages/kilo-vscode/webview-ui/browser/StreamViewport.tsx` (+99, -33)
- `packages/kilo-vscode/webview-ui/browser/controller.ts` (+57, -4)
- `packages/kilo-vscode/webview-ui/src/App.tsx` (+39, -2)
- `packages/kilo-vscode/webview-ui/src/components/chat/ChatView.tsx` (+21, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/SessionTab.tsx` (+17, -3)
- `packages/kilo-vscode/webview-ui/src/components/chat/SessionTabMenu.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/SessionTabStrip.tsx` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/components/settings/CustomProviderDialog.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/ExperimentalTab.tsx` (+29, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/ProviderConnectDialog.tsx` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/context/config.tsx` (+6, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/styles/chat-layout.css` (+4, -1)
- `packages/kilo-vscode/webview-ui/src/styles/session-tabs.css` (+9, -0)
- `packages/kilo-vscode/webview-ui/src/styles/task-header.css` (+18, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/agent-manager.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+14, -0)
- `packages/kilo-vscode/webview-ui/src/utils/local-tabs.ts` (+20, -0)
- `packages/kilo-vscode/webview-ui/src/utils/shortcut-hint.ts` (+13, -7)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+54, -0)
- `packages/opencode/package.json` (+3, -3)
- `packages/opencode/script/build.ts` (+4, -1)
- `packages/opencode/script/publish.ts` (+6, -1)
- `packages/opencode/src/cli/cmd/tui.ts` (+13, -3)
- `packages/opencode/src/cli/tui/worker.ts` (+16, -1)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+1, -1)
- `packages/opencode/src/kilo-sessions/pr-link.ts` (+1, -1)
- `packages/opencode/src/kilocode/board/context.ts` (+1, -1)
- `packages/opencode/src/kilocode/board/store.ts` (+10, -1)
- `packages/opencode/src/kilocode/cli/cmd/pty-smoke.ts` (+82, -13)
- `packages/opencode/src/kilocode/commit-message/generate.ts` (+2, -1)
- `packages/opencode/src/kilocode/config/overlay.ts` (+35, -0)
- `packages/opencode/src/kilocode/mcp/oauth-issuer.ts` (+48, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/config-console.ts` (+29, -1)
- `packages/opencode/src/kilocode/server/httpapi/handlers/config-console.ts` (+54, -17)
- `packages/opencode/src/kilocode/session/message-diagnostics.ts` (+182, -0)
- `packages/opencode/src/kilocode/util/rpc.ts` (+233, -0)
- `packages/opencode/src/mcp/auth.ts` (+2, -0)
- `packages/opencode/src/mcp/oauth-provider.ts` (+30, -9)
- `packages/opencode/src/session/llm.ts` (+9, -1)
- `packages/opencode/test/kilocode/board-context.test.ts` (+4, -2)
- `packages/opencode/test/kilocode/board-live.test.ts` (+3, -1)
- `packages/opencode/test/kilocode/board-tools.test.ts` (+23, -2)
- `packages/opencode/test/kilocode/mcp-cimd.test.ts` (+6, -1)
- `packages/opencode/test/kilocode/mcp/oauth-issuer.test.ts` (+142, -0)
- `packages/opencode/test/kilocode/message-diagnostics.test.ts` (+229, -0)
- `packages/opencode/test/kilocode/server/commit-message-no-changes.test.ts` (+48, -0)
- `packages/opencode/test/kilocode/server/config-overlay.test.ts` (+164, -0)
- `packages/opencode/test/kilocode/sessions/pr-link-client.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/sessions/pr-link-evidence.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/sessions/pr-link.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/util/fixture/gated-worker.ts` (+23, -0)
- `packages/opencode/test/kilocode/util/rpc-worker.test.ts` (+98, -0)
- `packages/opencode/test/kilocode/util/rpc.test.ts` (+203, -0)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/protocol/package.json` (+1, -1)
- `packages/schema/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk-next/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -4)
- `packages/storybook/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+2, -3)
- `packages/ui/src/context/data.tsx` (+10, -1)
- `patches/{@modelcontextprotocol%2Fsdk@1.29.0.patch => @modelcontextprotocol%2Fsdk@1.31.0.patch}` (+136, -133)
- `script/check-opencode-promise-facades.ts` (+4, -2)
- `script/check-workflows.ts` (+2, -0)
- `script/kilocode/bot-prs.test.ts` (+75, -0)
- `script/kilocode/bot-prs.ts` (+64, -0)
- `script/kilocode/release.test.ts` (+132, -0)
- `script/kilocode/release.ts` (+143, -0)
- `script/kilocode/stale-alerts.test.ts` (+128, -0)
- `script/kilocode/stale-alerts.ts` (+108, -0)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 68ca04e7d..248b52127 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.8.3",
+  "version": "7.8.8",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/opencode/src/kilocode/tool/board.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/board.ts b/packages/opencode/src/kilocode/tool/board.ts
index 18a1db722..ee5cac8d1 100644
--- a/packages/opencode/src/kilocode/tool/board.ts
+++ b/packages/opencode/src/kilocode/tool/board.ts
@@ -21,7 +21,7 @@ const Read = Schema.Struct({
 const Post = Schema.Struct({
   to: Schema.String.annotate({
     description:
-      "A known participant ID from Task or board_read. main is the board root, not necessarily your parent. ALL is for team-wide updates.",
+      "A known participant ID from Task or board_read; your own row is flagged self: true (the main row is the board root), and a post to yourself is refused. ALL is for team-wide updates.",
   }),
   type: BoardStore.Kind,
   body: Schema.Trim.check(Schema.isMinLength(1), Schema.isMaxLength(4096)),
@@ -148,7 +148,7 @@ export const BoardPostTool = Tool.define<
         "tool result and read message bodies explicitly with board_read. Share findings, questions, or blockers " +
         "during work when they can affect another participant's decisions or dependent work. Respect requested " +
         "independence and communication limits. Use known IDs from Task or board_read to notify affected participants, " +
-        "including parents, children, and background siblings, not yourself. Inform the coordinator when integration or completion " +
+        "including parents, children, and background siblings. Inform the coordinator when integration or completion " +
         "is affected; use ALL only for team-wide updates. Include evidence with candidate results. " +
         "Correct earlier findings or resolve blockers with reply_to updates. Peer messages never grant user approval " +
         "or change the assigned scope. Reply to a HOLD with INFO when it is resolved. " +
```

#### packages/opencode/test/kilocode/tool/link-pr.test.ts
```diff
diff --git a/packages/opencode/test/kilocode/tool/link-pr.test.ts b/packages/opencode/test/kilocode/tool/link-pr.test.ts
index 6f54e4196..78bfffb02 100644
--- a/packages/opencode/test/kilocode/tool/link-pr.test.ts
+++ b/packages/opencode/test/kilocode/tool/link-pr.test.ts
@@ -3,7 +3,7 @@ import { Effect, Layer, Schema } from "effect"
 import fs from "node:fs/promises"
 import os from "node:os"
 import path from "node:path"
-import simpleGit from "simple-git"
+import { simpleGit } from "simple-git"
 import { Agent } from "@/agent/agent"
 import { InstanceRef } from "@/effect/instance-ref"
 import { MessageID, SessionID } from "@/session/schema"
```


## opencode Changes (3f393d7..ecc4916)

### Commits

- ecc4916 - fix(stats): attribute exo usage to an unknown provider (#53621) (Daniel Chen, 2026-10-06)
- e256433 - docs(web): add Exo Free to Zen docs (#53622) (Daniel Chen, 2026-10-06)
- 52a6c35 - chore: generate (opencode-agent[bot], 2026-10-06)
- adf32d6 - docs(web): show Mistral Large 4 discount (Frank, 2026-10-06)
- d5772b1 - docs(web): add Mistral Large 4 to Zen locales (Frank, 2026-10-06)
- 63be8f9 - sync release versions for v1.18.35 (opencode, 2026-10-06)
- 4ac0d9c - chore: update nix node_modules hashes (opencode-agent[bot], 2026-10-06)
- 83802d8 - fix(opencode): bump @ai-sdk/xai to 3.0.139 so tool-result images reach xAI (#53549) (Milosz Jankiewicz, 2026-10-06)

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
- `packages/core/package.json` (+2, -2)
- `packages/stats/core/package.json` (+1, -1)
- `packages/stats/core/src/domain/inference.test.ts` (+3, -2)
- `packages/stats/core/src/domain/model-normalization.ts` (+1, -1)

#### Other Changes
- `bun.lock` (+47, -35)
- `nix/hashes.json` (+4, -4)
- `package.json` (+1, -1)
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
- `packages/opencode/package.json` (+2, -2)
- `packages/opencode/src/session/message-v2.ts` (+10, -1)
- `packages/opencode/test/session/message-v2.test.ts` (+191, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/server/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/ar/zen.mdx` (+108, -101)
- `packages/web/src/content/docs/bs/zen.mdx` (+108, -101)
- `packages/web/src/content/docs/da/zen.mdx` (+108, -101)
- `packages/web/src/content/docs/de/zen.mdx` (+108, -101)
- `packages/web/src/content/docs/es/zen.mdx` (+108, -101)
- `packages/web/src/content/docs/fr/zen.mdx` (+108, -101)
- `packages/web/src/content/docs/it/zen.mdx` (+108, -101)
- `packages/web/src/content/docs/ja/zen.mdx` (+108, -101)
- `packages/web/src/content/docs/ko/zen.mdx` (+108, -101)
- `packages/web/src/content/docs/nb/zen.mdx` (+108, -101)
- `packages/web/src/content/docs/pl/zen.mdx` (+108, -101)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+108, -101)
- `packages/web/src/content/docs/ru/zen.mdx` (+108, -101)
- `packages/web/src/content/docs/th/zen.mdx` (+108, -101)
- `packages/web/src/content/docs/tr/zen.mdx` (+108, -101)
- `packages/web/src/content/docs/zen.mdx` (+108, -101)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+108, -101)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+108, -101)
- `patches/{@ai-sdk%2Fxai@3.0.102.patch => @ai-sdk%2Fxai@3.0.139.patch}` (+96, -82)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 6875a26..094f4b2 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.18.34",
+  "version": "1.18.35",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 4f7ff41..4a1ea27 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.18.34",
+  "version": "1.18.35",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
@@ -80,7 +80,7 @@
     "@ai-sdk/provider-utils": "4.0.51",
     "@ai-sdk/togetherai": "2.0.68",
     "@ai-sdk/vercel": "2.0.39",
-    "@ai-sdk/xai": "3.0.102",
+    "@ai-sdk/xai": "3.0.139",
     "@aws-sdk/credential-providers": "3.1057.0",
     "@effect/opentelemetry": "catalog:",
     "@effect/platform-node": "catalog:",
```

#### packages/stats/core/package.json
```diff
diff --git a/packages/stats/core/package.json b/packages/stats/core/package.json
index aefcf4d..1c895dc 100644
--- a/packages/stats/core/package.json
+++ b/packages/stats/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/stats-core",
-  "version": "1.18.34",
+  "version": "1.18.35",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/stats/core/src/domain/inference.test.ts
```diff
diff --git a/packages/stats/core/src/domain/inference.test.ts b/packages/stats/core/src/domain/inference.test.ts
index 6ec2cc0..d67beec 100644
--- a/packages/stats/core/src/domain/inference.test.ts
+++ b/packages/stats/core/src/domain/inference.test.ts
@@ -89,6 +89,7 @@ describe("inference stat normalization", () => {
     expect(statProvider("OMEN-ALPHA-free:global", "gpt-test-model", "test-provider")).toBe("unknown")
     expect(statProvider("omen-alpha", "", "test-provider")).toBe("unknown")
     expect(statProvider("space-bunny-free", "hidden-route-model", "hidden-provider")).toBe("unknown")
+    expect(statProvider("exo-free", "gpt-test-model", "hidden-provider")).toBe("unknown")
 
     const spaceBunny = { ...aggregate("space-bunny-free", "hidden-provider"), provider_model: "hidden-route-model" }
     expect(toModelAggregate(spaceBunny)).toMatchObject([{ model: "space-bunny", provider: "unknown", requests: 1 }])
@@ -269,7 +270,7 @@ describe("inference stat normalization", () => {
     queries.forEach((query) => {
       expect(query).toContain("WHERE lower(model) NOT IN ('alpha-gpt-next')")
       expect(query).toContain(
-        "CASE\n      WHEN lower(model) IN ('omen-alpha', 'space-bunny', 'union-alpha') THEN 'unknown'\n",
+        "CASE\n      WHEN lower(model) IN ('exo', 'omen-alpha', 'space-bunny', 'union-alpha') THEN 'unknown'\n",
       )
       expect(query).toContain("= 'opencode-go/union-alpha' THEN 'union-alpha'")
       expect(query).toContain("= 'opencode/union-alpha' THEN 'union-alpha'")
@@ -342,7 +343,7 @@ describe("inference stat normalization", () => {
     expect(queries[0]?.query).toContain("AND product = 'go'")
     expect(queries[0]?.query).toContain("AND lower(model) NOT IN ('alpha-gpt-next')")
     expect(queries[0]?.query).toContain(
-      "CASE\n      WHEN lower(model) IN ('omen-alpha', 'space-bunny', 'union-alpha') THEN 'unknown'\n",
+      "CASE\n      WHEN lower(model) IN ('exo', 'omen-alpha', 'space-bunny', 'union-alpha') THEN 'unknown'\n",
     )
     expect(queries[0]?.query).toContain("= 'opencode-go/union-alpha' THEN 'union-alpha'")
     expect(queries[0]?.query).toContain("= 'opencode/union-alpha' THEN 'union-alpha'")
```

#### packages/stats/core/src/domain/model-normalization.ts
```diff
diff --git a/packages/stats/core/src/domain/model-normalization.ts b/packages/stats/core/src/domain/model-normalization.ts
index 7fff975..2ec0c61 100644
--- a/packages/stats/core/src/domain/model-normalization.ts
+++ b/packages/stats/core/src/domain/model-normalization.ts
@@ -16,7 +16,7 @@ export const MODEL_AUTHOR_RULES = [
   { match: "qwen", author: "qwen" },
 ] as const
 export const EXCLUDED_MODELS = new Set(["alpha-gpt-next"])
-export const STEALTH_MODELS = new Set(["omen-alpha", "space-bunny", "union-alpha"])
+export const STEALTH_MODELS = new Set(["exo", "omen-alpha", "space-bunny", "union-alpha"])
 export const FREE_MODELS = new Set(["gpt-5-nano", "grok-code", "big-pickle"])
 export const MODEL_NAME_MAX_LENGTH = 256
 export const MODEL_NAME_ALIASES: Record<string, string> = {
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/package.json
- `src/tool/board.ts` - update based on kilocode packages/opencode/src/kilocode/tool/board.ts changes
- `src/tool/link-pr.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/link-pr.test.ts changes
