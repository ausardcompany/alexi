# Upstream Changes Report
Generated: 2026-03-22 06:54:38

## Summary
- kilocode: 102 commits, 203 files changed
- opencode: 0 commits, 0 files changed

## kilocode Changes (4bef41a2..81edeee6)

### Commits

- 81edeee6 - Merge branch 'Kilo-Org:main' into main (Aleksei Sabetski, 2026-03-21)
- 6d4d7328 - Merge pull request #7379 from Kilo-Org/catrielmuller/refresh-vscode-panels-on-update (Catriel Müller, 2026-03-20)
- 52426b47 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-03-20)
- 05d606ad - fix(vscode): restore webview panels on extension restart/update (Catriel Müller, 2026-03-20)
- 82f47b51 - fix(nix): remove stale TEAM_MEMBERS reference from node_modules fileset (#7378) (Marius, 2026-03-20)
- ef16ae7f - release: v7.1.0 (kilo-maintainer[bot], 2026-03-20)
- bcac6ac7 - fix(kilo-ui): fix reasoning display regression — ordering, collapse, and animation (#7376) (Marius, 2026-03-20)
- 17ddf84d - Merge pull request #7283 from Kilo-Org/kirillk/model-picker (Kirill Kalishev, 2026-03-20)
- dd86b02b - Merge branch 'main' into kirillk/model-picker (Kirill Kalishev, 2026-03-20)
- a9e8d197 - feat(i18n): add dialog.model.select translation key for model picker select button (kirillk, 2026-03-20)
- 93e45fb6 - fix(vscode): improve question dock visual design (#7375) (Marius, 2026-03-20)
- 3af7b465 - docs(kilo-docs): add VS Code rollback install guidance (#7372) (Thomas Brugman, 2026-03-20)
- 296f5271 - feat(vscode): add agent cycling keyboard shortcuts (Ctrl+./Ctrl+Shift+.) (#7374) (Marius, 2026-03-20)
- 64442519 - Improved subagent permissions handling (#7348) (Imanol Maiztegui, 2026-03-20)
- 4999d5f8 - style(vscode): fix prettier formatting in PopupSelector (kirillk, 2026-03-20)
- 43af9a2c - Merge branch 'main' into kirillk/model-picker (Kirill Kalishev, 2026-03-20)
- f15897f3 - Update packages/kilo-vscode/webview-ui/src/components/shared/ModelSelector.tsx (Kirill Kalishev, 2026-03-20)
- 9fbfef15 - fix(vscode): remove empty state text from model preview panel (kirillk, 2026-03-20)
- 0299d8d9 - fix(vscode): account for picker chrome in splitter max height calculation (kirillk, 2026-03-20)
- 8194c30c - feat(vscode): add keyboard focus outline to model and mode pickers (kirillk, 2026-03-20)
- a87055a1 - feat(vscode): increase expanded model picker width to 450px (kirillk, 2026-03-20)
- a34fc214 - perf(agent-manager): debounce resize handlers and state persistence (#7369) (Marius, 2026-03-20)
- da83c177 - fix(vscode): prevent model picker height flash on reopen after window resize (kirillk, 2026-03-20)
- c9a3e6fa - feat(vscode): constrain model picker height to available space above trigger (kirillk, 2026-03-20)
- bb12ca21 - perf(vscode): fix model picker keyboard nav triggering redundant mouseenter updates (marius-kilocode, 2026-03-20)
- 595064f6 - Merge pull request #7370 from Kilo-Org/docs/kiloclaw-troubleshooting-config-files (Alex Gold, 2026-03-20)
- ce9e3ad7 - Update packages/kilo-docs/pages/kiloclaw/troubleshooting.md (Alex Gold, 2026-03-20)
- 6a5ddd66 - Update packages/kilo-docs/pages/kiloclaw/troubleshooting.md (Alex Gold, 2026-03-20)
- ca471716 - docs(kilo-docs): add config file access tip to KiloClaw troubleshooting (kiloconnect[bot], 2026-03-20)
- 68c9b418 - Merge pull request #7361 from Kilo-Org/docs/update-auto-model-tiers-architecture (Joshua Lambert, 2026-03-20)
- bd492fb0 - Apply suggestions from code review (Joshua Lambert, 2026-03-20)
- 482389fd - Merge branch 'main' into kirillk/model-picker (kirillk, 2026-03-20)
- 9af41a06 - Merge pull request #7368 from Kilo-Org/catrielmuller/editor-tool-title (Catriel Müller, 2026-03-20)
- 0fcc9257 - fix(ui): truncate long file names and paths in tool triggers with front-ellipsis (Catriel Müller, 2026-03-20)
- da41fe69 - fix(ui): defer popover dismiss listeners to prevent premature close in modals (#7367) (Marius, 2026-03-20)
- 8769079a - refactor(vscode): extract handler modules from KiloProvider god class (#7362) (Marius, 2026-03-20)
- 1ee95316 - fix(kilo-ui): remove unstyled user-message-inner wrapper causing button overlay (#7364) (Marius, 2026-03-20)
- 1a74242b - feat(vscode): add keyboard shortcuts to permission prompt (#7363) (Marius, 2026-03-20)
- 069cdd20 - fix(vscode): fix typecheck error in AgentManagerProvider.getSessionDirectories (#7366) (Marius, 2026-03-20)
- 7f348474 - Merge branch 'main' into kirillk/model-picker (Kirill Kalishev, 2026-03-20)
- 6056b67c - feat(vscode): add toggle auto-approve shortcut (Ctrl+Alt+A) (#7347) (Marius, 2026-03-20)
- 567d25ed - refactor(agent-manager): isolate vscode API behind Host interface (#7360) (Marius, 2026-03-20)
- 7f95dc34 - docs(kilo-docs): update auto model tiers architecture to match implementation (Josh Lambert, 2026-03-20)
- 64d5163e - Merge pull request #7359 from Kilo-Org/catrielmuller/migrate-x-headers (Catriel Müller, 2026-03-20)
- d7b9f519 - refactor: replace x-opencode-* headers with x-kilo-* across codebase and upstream scripts (Catriel Müller, 2026-03-20)
- 50e8d22f - OpenCode v1.2.24 (Catriel Müller, 2026-03-20)
- 0adcc0f9 - Update .github/workflows/storybook.yml (Catriel Müller, 2026-03-20)
- acf3dd51 - feat(vscode): add `bun run extension` to build and launch dev VS Code (#7351) (Marius, 2026-03-20)
- 871bbec9 - chore: update visual regression baselines (github-actions[bot], 2026-03-20)
- 6e4c57f3 - fix: Adjust missing merge conflicts not caught before (Johnny Amancio, 2026-03-20)
- a4982019 - resolve merge conflicts (Johnny Amancio, 2026-03-20)
- f3a327d2 - refactor: kilo compat for v1.2.24 (Johnny Amancio, 2026-03-20)
- 9a3d8019 - Merge pull request #7328 from Kilo-Org/catrielmuller/model-dont-exist-error (Catriel Müller, 2026-03-20)
- 4c8358da - feat(vscode): add generate terminal command shortcut and SCM input menu entry (#7346) (Marius, 2026-03-20)
- a083a5b4 - feat(vscode): add autocomplete keyboard shortcuts (Escape cancel, Ctrl+L generate) (#7344) (Marius, 2026-03-20)
- 1f6eb2bd - fix(vscode): display error and validate model before sending when configured model is unavailable (Catriel Müller, 2026-03-20)
- 01e45e38 - feat(vscode): display a confirmation toast when installing marketplace elements (#7336) (Imanol Maiztegui, 2026-03-20)
- 42bb938c - feat(vscode): multi-provider selection with connect/disconnect/OAuth flows (#7295) (Marius, 2026-03-20)
- eaeb8dc6 - perf(agent-manager): make worktree deletion instant (#7230) (Marius, 2026-03-20)
- 633ab4c9 - fix(vscode): show reasoning in reasoning component during streaming (#7231) (Marius, 2026-03-20)
- 59351e4b - fix(vscode): show disabled revert button while agent is busy (#7309) (Marius, 2026-03-20)
- dcdf0e97 - fix(vscode): add upper bounds check in mode switcher keyboard navigation (#7335) (marius-kiloclaw, 2026-03-20)
- 7a3c9759 - style(vscode): fix prettier formatting in PopupSelector (kirillk, 2026-03-19)
- c015e21f - Merge branch 'main' into kirillk/model-picker (Kirill Kalishev, 2026-03-19)
- a43ef452 - feat(vscode): add ModeSwitcher to PopupSelector, support content-sized popups (kirillk, 2026-03-19)
- 6c06c9a2 - refactor(vscode): extract PopupSelector and consolidate sizing into explicit props (kirillk, 2026-03-19)
- f3e26da0 - refactor(vscode): consolidate model picker size constants into ModelSelector (kirillk, 2026-03-19)
- 9deaa0e2 - fix(vscode): reduce model picker edge padding to 8px on both sides (kirillk, 2026-03-19)
- 8501f0d4 - fix(vscode): add right-side padding and fix squeeze padding for model picker (kirillk, 2026-03-19)
- 56ccb856 - feat(vscode): fit model picker to panel width with dynamic sizing (kirillk, 2026-03-19)
- 2102af2b - fix(vscode): increase default preview height to 320px, group label panel style (kirillk, 2026-03-19)
- 17ecdd2b - Merge branch 'main' into kirillk/model-picker (Kirill Kalishev, 2026-03-19)
- d4fd9694 - Merge branch 'main' into kirillk/model-picker (Kirill Kalishev, 2026-03-19)
- d6ec6345 - Merge branch 'main' into kirillk/model-picker (Kirill Kalishev, 2026-03-18)
- dd4973fb - fix(vscode): reduce FREE badge size and padding in model picker list (kirillk, 2026-03-18)
- b2c29028 - feat(vscode): model picker — expanded mode, preview, pre-active state, splitter, keyboard nav (kirillk, 2026-03-18)
- df527b3e - feat(vscode): show model properties in picker preview panel on hover (kirillk, 2026-03-18)
- 86690a31 - feat(vscode): extend ProviderModel with input capabilities and options (kirillk, 2026-03-18)
- ff8aa0b4 - feat(vscode): add model picker preview panel with animated expand/collapse (kirillk, 2026-03-18)
- 5571adcd - feat(vscode): add expand/collapse toggle to model picker popup (kirillk, 2026-03-18)
- c6262f9d - release: v1.2.24 (opencode, 2026-03-09)
- b749fa90 - fix(app): scroll jitter/loop (Adam, 2026-03-09)
- 8a51cbd2 - core: prevent accidental edits to migration files by restricting agent access (Dax Raad, 2026-03-09)
- 399b8f07 - fix(app): session title turn spinner (#16764) (David Hill, 2026-03-09)
- 3742e42f - fix(app): dismiss toast notifications when questions or permissions a… (#16758) (Filip, 2026-03-09)
- 0388ec68 - fix(storybook): add ci build workflow (#16760) (Karan Handa, 2026-03-09)
- 366b8a80 - feat(tui): add initial support for workspaces into the tui (#16230) (James Long, 2026-03-09)
- ef9bc4ec - feat(gitlab): send context-1m-2025-08-07 beta header to enable 1M context window (#16153) (Armin Pašalić, 2026-03-09)
- 5838b589 - add copilot gpt-5.4 xhigh support (#16294) (Jack, 2026-03-09)
- 2712244a - release: v1.2.23 (opencode, 2026-03-09)
- 6388cbaf - fix(app): remove oc-1 theme (Adam, 2026-03-09)
- 5cc61e1b - tui: fix sidebar workspace container sizing by adding box-border class to prevent content overflow issues (David Hill, 2026-03-09)
- 0243be86 - fix(app): don't animate review panel in/out (Adam, 2026-03-09)
- 9154cd64 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-03-09)
- c71d1bde - revert(app): "STUPID SEXY TIMELINE (#16420)" (#16745) (Adam, 2026-03-09)
- f27ef595 - fix(app): sanitize workspace store filenames on Windows (#16703) (Luke Parker, 2026-03-09)
- 34328828 - fix(app): fix issue with scroll jumping when pressing escape in comment text area (#15374) (Yihui Khuu, 2026-03-09)
- 18fb19da - fix(opencode): pass missing auth headers in `run --attach` (#16097) (Eric Clemmons, 2026-03-09)
- 849e1ac5 - docs(i18n): sync locale docs from english changes (opencode-agent[bot], 2026-03-09)
- 656a8d8f - docs: add session_child_first keybinding to documentation (#16631) (Ariane Emory, 2026-03-08)
- b976f339 - feat(app): generate color palettes (#16232) (Adam, 2026-03-08)
- 7d7837e5 - disable fallback to free nano for small model (Dax Raad, 2026-03-08)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
(no changes)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
- `packages/opencode/src/kilocode/permission/drain.ts` (+51, -0)
- `packages/opencode/src/permission/next.ts` (+7, -1)
- `packages/opencode/test/{ => kilocode}/permission/next.always-rules.test.ts` (+295, -4)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
(no changes)

#### Other Changes
- `.github/workflows/storybook.yml` (+39, -0)
- `.opencode/opencode.jsonc` (+5, -0)
- `AGENTS.md` (+1, -0)
- `CONTRIBUTING.md` (+10, -0)
- `bun.lock` (+16, -16)
- `nix/hashes.json` (+4, -4)
- `nix/node_modules.nix` (+0, -1)
- `package.json` (+3, -2)
- `packages/app/package.json` (+1, -1)
- `packages/app/src/pages/layout.tsx` (+11, -0)
- `packages/app/src/pages/session.tsx` (+44, -34)
- `packages/app/src/pages/session/message-timeline.tsx` (+93, -44)
- `packages/app/src/pages/session/scroll-spy.test.ts` (+0, -127)
- `packages/app/src/pages/session/scroll-spy.ts` (+0, -275)
- `packages/app/src/pages/session/use-session-hash-scroll.ts` (+50, -36)
- `packages/desktop-electron/package.json` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/contributing/architecture/auto-model-tiers.md` (+95, -80)
- `packages/kilo-docs/pages/getting-started/installing.md` (+9, -0)
- `packages/kilo-docs/pages/kiloclaw/troubleshooting.md` (+5, -1)
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
- `packages/kilo-i18n/src/ja.ts` (+4, -0)
- `packages/kilo-i18n/src/ko.ts` (+4, -0)
- `packages/kilo-i18n/src/no.ts` (+4, -0)
- `packages/kilo-i18n/src/pl.ts` (+4, -0)
- `packages/kilo-i18n/src/ru.ts` (+4, -0)
- `packages/kilo-i18n/src/th.ts` (+4, -0)
- `packages/kilo-i18n/src/tr.ts` (+4, -0)
- `packages/kilo-i18n/src/zh.ts` (+4, -0)
- `packages/kilo-i18n/src/zht.ts` (+4, -0)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/basic-tool.css` (+57, -0)
- `packages/kilo-ui/src/components/message-part.css` (+101, -1)
- `packages/kilo-ui/src/components/message-part.tsx` (+182, -110)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-messagepart/full-conversation-turn-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-messagepart/user-message-story-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-messagepart/with-reasoning-expanded-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-spinner/colored-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-spinner/default-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-spinner/large-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-spinner/small-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/AGENTS.md` (+3, -0)
- `packages/kilo-vscode/eslint.config.mjs` (+6, -0)
- `packages/kilo-vscode/package.json` (+79, -15)
- `packages/kilo-vscode/script/launch.ts` (+338, -0)
- `packages/kilo-vscode/src/DiffViewerProvider.ts` (+17, -6)
- `packages/kilo-vscode/src/KiloProvider.ts` (+280, -702)
- `packages/kilo-vscode/src/SettingsEditorProvider.ts` (+33, -6)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+86, -127)
- `packages/kilo-vscode/src/agent-manager/GitStatsPoller.ts` (+10, -1)
- `packages/kilo-vscode/src/agent-manager/WorktreeManager.ts` (+73, -30)
- `packages/kilo-vscode/src/agent-manager/__tests__/AgentManagerProvider.spec.ts` (+31, -32)
- `packages/kilo-vscode/src/agent-manager/delete-worktree.ts` (+20, -0)
- `packages/kilo-vscode/src/agent-manager/format-keybinding.ts` (+2, -0)
- `packages/kilo-vscode/src/agent-manager/host.ts` (+109, -0)
- `packages/kilo-vscode/src/agent-manager/vscode-host.ts` (+160, -0)
- `packages/kilo-vscode/src/commands/toggle-auto-approve.ts` (+87, -0)
- `packages/kilo-vscode/src/extension.ts` (+100, -5)
- `packages/kilo-vscode/src/kilo-provider-utils.ts` (+29, -1)
- `packages/kilo-vscode/src/kilo-provider/handlers/auth.ts` (+143, -0)
- `packages/kilo-vscode/src/kilo-provider/handlers/cloud-session.ts` (+222, -0)
- `packages/kilo-vscode/src/kilo-provider/handlers/migration.ts` (+155, -0)
- `packages/kilo-vscode/src/kilo-provider/handlers/permission-handler.ts` (+99, -0)
- `packages/kilo-vscode/src/kilo-provider/handlers/question.ts` (+51, -0)
- `packages/kilo-vscode/src/kilo-provider/slim-metadata.ts` (+57, -0)
- `packages/kilo-vscode/src/provider-actions.ts` (+301, -0)
- `packages/kilo-vscode/src/review-utils.ts` (+1, -1)
- `packages/kilo-vscode/src/services/autocomplete/classic-auto-complete/AutocompleteInlineCompletionProvider.ts` (+8, -3)
- `packages/kilo-vscode/src/services/autocomplete/index.ts` (+6, -0)
- `packages/kilo-vscode/src/services/cli-backend/connection-utils.ts` (+1, -0)
- `packages/kilo-vscode/src/shared/custom-provider.ts` (+114, -0)
- `packages/kilo-vscode/src/shared/provider-model.ts` (+36, -0)
- `packages/kilo-vscode/tests/permission-dock-dropdown.spec.ts` (+2, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+25, -9)
- `packages/kilo-vscode/tests/unit/custom-provider.test.ts` (+83, -0)
- `packages/kilo-vscode/tests/unit/model-selection.test.ts` (+106, -0)
- `packages/kilo-vscode/tests/unit/model-selector-utils.test.ts` (+63, -19)
- `packages/kilo-vscode/tests/unit/provider-action.test.ts` (+143, -0)
- `packages/kilo-vscode/tests/unit/provider-utils.test.ts` (+24, -1)
- `packages/kilo-vscode/tests/unit/provider-visibility.test.ts` (+23, -0)
- `packages/kilo-vscode/tests/unit/worktree-manager.test.ts` (+128, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.mts` (+5, -1)
- `packages/kilo-vscode/tests/visual-regression.spec.ts` (+5, -1)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/chat/question-dock-many-options-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/chat/question-dock-multi-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/chat/question-dock-single-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/composite-webview/question-above-chatbox-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/settings/providers-configure-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/settings/settings-panel-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+62, -15)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fr.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ja.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ko.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/no.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/pl.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ru.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/th.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zh.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zht.ts` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/App.tsx` (+17, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/PermissionDock.tsx` (+154, -112)
- `packages/kilo-vscode/webview-ui/src/components/chat/VscodeSessionTurn.tsx` (+18, -3)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/InstallModal.tsx` (+22, -1)
- `packages/kilo-vscode/webview-ui/src/components/profile/DeviceAuthCard.tsx` (+94, -4)
- `packages/kilo-vscode/webview-ui/src/components/settings/CustomProviderDialog.tsx` (+458, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/ModelsTab.tsx` (+90, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/ProviderConnectDialog.tsx` (+406, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/ProviderSelectDialog.tsx` (+134, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/ProvidersTab.tsx` (+264, -167)
- `packages/kilo-vscode/webview-ui/src/components/settings/Settings.tsx` (+9, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/provider-catalog.ts` (+51, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/provider-visibility.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModeSwitcher.tsx` (+34, -24)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelPreview.tsx` (+111, -0)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelSelector.tsx` (+226, -65)
- `packages/kilo-vscode/webview-ui/src/components/shared/PopupSelector.tsx` (+123, -0)
- `packages/kilo-vscode/webview-ui/src/components/shared/model-selector-utils.ts` (+24, -7)
- `packages/kilo-vscode/webview-ui/src/context/model-selection.ts` (+43, -0)
- `packages/kilo-vscode/webview-ui/src/context/provider-utils.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/src/context/provider.tsx` (+18, -4)
- `packages/kilo-vscode/webview-ui/src/context/server.tsx` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+76, -32)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+53, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+53, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+54, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+53, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+54, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+54, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+53, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+55, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+53, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+53, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+53, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+54, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+54, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+53, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+53, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+53, -0)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/styles/chat.css` (+324, -36)
- `packages/kilo-vscode/webview-ui/src/types/messages.ts` (+112, -1)
- `packages/kilo-vscode/webview-ui/src/utils/provider-action.ts` (+91, -0)
- `packages/opencode/package.json` (+7, -7)
- `packages/opencode/src/cli/cmd/tui/app.tsx` (+17, -0)
- `packages/opencode/src/cli/cmd/tui/component/dialog-workspace-list.tsx` (+326, -0)
- `packages/opencode/src/cli/cmd/tui/component/workspace/dialog-session-list.tsx` (+151, -0)
- `packages/opencode/src/cli/cmd/tui/context/sdk.tsx` (+55, -31)
- `packages/opencode/src/cli/cmd/tui/context/sync.tsx` (+16, -0)
- `packages/opencode/src/cli/cmd/tui/routes/session/header.tsx` (+41, -4)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+6, -0)
- `packages/opencode/src/cli/cmd/tui/thread.ts` (+3, -0)
- `packages/opencode/src/cli/cmd/tui/worker.ts` (+7, -3)
- `packages/opencode/src/control-plane/adaptors/worktree.ts` (+1, -1)
- `packages/opencode/src/control-plane/workspace-server/server.ts` (+2, -2)
- `packages/opencode/src/flag/flag.ts` (+1, -0)
- `packages/opencode/src/provider/provider.ts` (+1, -0)
- `packages/opencode/src/provider/transform.ts` (+3, -1)
- `packages/opencode/src/server/server.ts` (+2, -2)
- `packages/opencode/src/session/llm.ts` (+3, -3)
- `packages/opencode/test/control-plane/workspace-server-sse.test.ts` (+2, -2)
- `packages/opencode/test/provider/gitlab-duo.test.ts` (+24, -0)
- `packages/opencode/test/provider/transform.test.ts` (+29, -0)
- `packages/opencode/test/server/project-init-git.test.ts` (+4, -4)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/client.ts` (+1, -1)
- `packages/sdk/js/src/v2/client.ts` (+9, -2)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/components/message-part.css` (+12, -6)
- `packages/ui/src/components/popover.tsx` (+12, -2)
- `packages/ui/src/components/scroll-view.test.ts` (+19, -0)
- `packages/ui/src/components/scroll-view.tsx` (+29, -7)
- `packages/ui/src/components/spinner.tsx` (+1, -0)
- `packages/ui/src/styles/animations.css` (+2, -2)
- `packages/util/package.json` (+1, -1)
- `script/upstream/codemods/transform-strings.ts` (+3, -0)
- `script/upstream/package.json` (+1, -1)
- `script/upstream/transforms/transform-take-theirs.ts` (+3, -3)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/opencode/src/kilocode/permission/drain.ts
```diff
diff --git a/packages/opencode/src/kilocode/permission/drain.ts b/packages/opencode/src/kilocode/permission/drain.ts
new file mode 100644
index 00000000..608932a4
--- /dev/null
+++ b/packages/opencode/src/kilocode/permission/drain.ts
@@ -0,0 +1,51 @@
+import { Bus } from "@/bus"
+import { Wildcard } from "@/util/wildcard"
+import type { PermissionNext } from "@/permission/next"
+
+/**
+ * Auto-resolve pending permissions now fully covered by approved or denied rules.
+ * When the user approves/denies a rule on subagent A, sibling subagent B's
+ * pending permission for the same pattern resolves or rejects automatically.
+ */
+export async function drainCovered(
+  pending: Record<
+    string,
+    {
+      info: PermissionNext.Request
+      ruleset: PermissionNext.Ruleset
+      resolve: () => void
+      reject: (e: any) => void
+    }
+  >,
+  approved: PermissionNext.Ruleset,
+  evaluate: typeof PermissionNext.evaluate,
+  events: typeof PermissionNext.Event,
+  DeniedError: typeof PermissionNext.DeniedError,
+  exclude?: string,
+) {
+  for (const [id, entry] of Object.entries(pending)) {
+    if (id === exclude) continue
+    const actions = entry.info.patterns.map((pattern) =>
+      evaluate(entry.info.permission, pattern, entry.ruleset, approved),
+    )
+    const denied = actions.some((r) => r.action === "deny")
+    const allowed = !denied && actions.every((r) => r.action === "allow")
+    if (!denied && !allowed) continue
+    delete pending[id]
+    if (denied) {
+      Bus.publish(events.Replied, {
+        sessionID: entry.info.sessionID,
+        requestID: entry.info.id,
+        reply: "reject",
+      })
+      entry.reject(new DeniedError(approved.filter((r) => Wildcard.match(entry.info.permission, r.permission))))
+    } else {
+      Bus.publish(events.Replied, {
+        sessionID: entry.info.sessionID,
```

#### packages/opencode/src/permission/next.ts
```diff
diff --git a/packages/opencode/src/permission/next.ts b/packages/opencode/src/permission/next.ts
index e267a966..5534572d 100644
--- a/packages/opencode/src/permission/next.ts
+++ b/packages/opencode/src/permission/next.ts
@@ -8,6 +8,7 @@ import { PermissionTable } from "@/session/session.sql"
 import { fn } from "@/util/fn"
 import { Log } from "@/util/log"
 import { Wildcard } from "@/util/wildcard"
+import { drainCovered } from "@/kilocode/permission/drain" // kilocode_change
 import os from "os"
 import z from "zod"
 
@@ -168,6 +169,7 @@ export namespace PermissionNext {
       string,
       {
         info: Request
+        ruleset: Ruleset // kilocode_change
         resolve: () => void
         reject: (e: any) => void
       }
@@ -200,6 +202,7 @@ export namespace PermissionNext {
             }
             s.pending[id] = {
               info,
+              ruleset, // kilocode_change
               resolve,
               reject,
             }
@@ -212,6 +215,7 @@ export namespace PermissionNext {
   )
 
   // kilocode_change start
+
   export const saveAlwaysRules = fn(
     z.object({
       requestID: Identifier.schema("permission"),
@@ -240,6 +244,8 @@ export namespace PermissionNext {
       if (newRules.length > 0) {
         await Config.updateGlobal({ permission: toConfig(newRules) }, { dispose: false })
       }
+
+      await drainCovered(s.pending, s.approved, evaluate, Event, DeniedError, input.requestID) // kilocode_change
     },
   )
   // kilocode_change end
@@ -297,7 +303,7 @@ export namespace PermissionNext {
         for (const [id, pending] of Object.entries(s.pending)) {
           if (pending.info.sessionID !== sessionID) continue
           const ok = pending.info.patterns.every(
-            (pattern) => evaluate(pending.info.permission, pattern, s.approved).action === "allow",
```

#### packages/opencode/test/{ => kilocode}/permission/next.always-rules.test.ts
```diff
```


## opencode Changes (2a20822..2a20822)

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

- `src/permission/` - review permission changes from packages/opencode/src/kilocode/permission/drain.ts
- `src/permission/` - review permission changes from packages/opencode/src/permission/next.ts
- `src/permission/` - review permission changes from packages/opencode/test/{ => kilocode}/permission/next.always-rules.test.ts
