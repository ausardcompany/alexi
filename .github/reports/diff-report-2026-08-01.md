# Upstream Changes Report
Generated: 2026-08-01 08:21:31

## Summary
- kilocode: 128 commits, 264 files changed
- opencode: 5 commits, 38 files changed

## kilocode Changes (7cbe92e39..0aabd47b5)

### Commits

- 0aabd47b5 - Merge pull request #12746 from Kilo-Org/spectacled-week (Kirill Kalishev, 2026-07-31)
- b2f17a20c - test(jetbrains): pin reflow gate to Busy with a non-streaming state (kirillk, 2026-07-31)
- f1947697e - fix(jetbrains): gate reflow settle window on Busy, not isBusy() (kirillk, 2026-07-31)
- 6820530e9 - fix(jetbrains): avoid per-row cache invalidation on bulk diff tree toggle (kirillk, 2026-07-31)
- 45ed8f20e - fix(jetbrains): settle transcript reflow by session state, test budget (kirillk, 2026-07-31)
- 87b00a9b1 - fix(jetbrains): invalidate diff tree layout cache on folder toggle (kirillk, 2026-07-31)
- 820d5d5f0 - fix(jetbrains): bound transcript reflow passes during streaming (kirillk, 2026-07-31)
- e0fa585e3 - fix(jetbrains): hide expanded diff folder badges (kirillk, 2026-07-31)
- 632e4ca8c - fix(jetbrains): reflow transcript at real width on session open (kirillk, 2026-07-31)
- f00da9a75 - release: v7.4.18 (kilo-maintainer[bot], 2026-07-31)
- 7e0468fab - Merge remote-tracking branch 'origin/main' into spectacled-week (kirillk, 2026-07-31)
- 1a506a712 - fix(jetbrains): sync prompt button after attachments change (kirillk, 2026-07-31)
- c1f6a7537 - fix(jetbrains): reflow transcripts after session load (kirillk, 2026-07-31)
- c70fc73e5 - Merge pull request #12173 from seven7763/docs/daoxe-provider-guide (Joshua Lambert, 2026-07-31)
- 18657ca3a - fix: rewrite opening paragraph to lead with DaoXE differentiators (hei, 2026-08-01)
- 572c87b27 - fix(jetbrains): allow horizontal diff tree scrolling (kirillk, 2026-07-31)
- 2569f3ecd - fix(jetbrains): cap large inline diff previews (kirillk, 2026-07-31)
- ace509dc6 - feat(opencode): remote create_session fields, org metadata, rename/title sync, cancel proof (#12704) (Igor Šćekić, 2026-07-31)
- 329c6db48 - fix(jetbrains): compact diff tree directories (kirillk, 2026-07-31)
- 3404676c1 - Merge pull request #12672 from Kilo-Org/trusting-speech (Kirill Kalishev, 2026-07-31)
- 5d2d46be3 - Merge branch 'main' into trusting-speech (Kirill Kalishev, 2026-07-31)
- 7530f15fe - Merge branch 'main' into docs/daoxe-provider-guide (Joshua Lambert, 2026-07-31)
- 3bf4743c9 - Update packages/kilo-docs/pages/ai-providers/daoxe.md (Joshua Lambert, 2026-07-31)
- 64f037305 - fix(jetbrains): improve diff editor rendering (kirillk, 2026-07-31)
- ed8d53733 - Merge pull request #12711 from Kilo-Org/add-icon-jetbrains-skill (Kirill Kalishev, 2026-07-31)
- acb8a0430 - Merge branch 'main' into add-icon-jetbrains-skill (Kirill Kalishev, 2026-07-31)
- deb08fe2e - Merge pull request #12742 from Kilo-Org/jetbrains/release/v7.0.12-rc.3 (Kirill Kalishev, 2026-07-31)
- dc902dfee - release(jetbrains): v7.0.12-rc.3 (kilo-maintainer[bot], 2026-07-31)
- 2c8fe026b - docs: teach stroke-scaling and round-cap clipping in icon skill (kirillk, 2026-07-31)
- 20c6064e6 - Merge pull request #12612 from Kilo-Org/lovely-wallflower (Kirill Kalishev, 2026-07-31)
- 3a923f36b - fix(cli): suppress AI SDK system message warning in TUI (#12739) (Marius, 2026-07-31)
- 38b7d576b - Merge pull request #12738 from Kilo-Org/mountainous-shroud (Marius, 2026-07-31)
- 84b8b9676 - fix(vscode): make cache hit rate write-aware (marius-kilocode, 2026-07-31)
- e20f5ec51 - fix(jetbrains): keep skill-shell card queued when enabling auto-approve (kirillk, 2026-07-31)
- d95002c58 - Merge pull request #12724 from Kilo-Org/feat/execute-cmds-in-skill-context-jetbrains (bagatao@anaconda.com, 2026-07-31)
- 51d7ddb95 - Merge pull request #12606 from Kilo-Org/feat/execute-cmds-in-skill-context-vscode (bagatao@anaconda.com, 2026-07-31)
- 36fbfbc5c - fix(jetbrains): keep permission queue deterministic and authoritative (kirillk, 2026-07-31)
- 3af9c5097 - Merge pull request #12227 from shssoichiro/fix/issue-10271 (Marius, 2026-07-31)
- 2a0e5177b - Merge pull request #12701 from Kilo-Org/research-kilo-console-documentation-deprecation (Joshua Lambert, 2026-07-31)
- 96ce700d6 - fix(indexing): improvements to semantic_search tool description (Josh Holmer, 2026-07-31)
- 1a340371f - fix(cli): handle missing nested config unsets (#12727) (Marius, 2026-07-31)
- a1ad65e52 - fix(cli): stabilize Windows CI tests and rebalance slow shards (#12723) (Marius, 2026-07-31)
- 77b9adf7d - i18n(vscode): use literal curly quotes instead of \u escapes (Bruno Agatao, 2026-07-31)
- e804131f2 - i18n(jetbrains): fix mismatched closing quotes in skill-shell title (Bruno Agatao, 2026-07-31)
- 5577903a6 - fix(jetbrains): escape the skill name in the skill-shell permission header (Bruno Agatao, 2026-07-31)
- 86e55070a - i18n(jetbrains): translate skill-shell permission card title (Bruno Agatao, 2026-07-31)
- ff149d4d7 - feat(jetbrains): show skill-shell command batch in permission card (Bruno Agatao, 2026-07-31)
- 5678c09cf - fix(agent-manager): keep detail pane for unassigned sessions (#12722) (Marius, 2026-07-31)
- 57a9a6012 - fix(vscode): restore Agent Manager terminals (#12720) (Marius, 2026-07-31)
- 56e07859c - fix(jetbrains): handle compacted summaries and queued permission ghosts (kirillk, 2026-07-30)
- 79ac066d2 - fix(jetbrains): bound branch-diff patch fetching and preserve promoted permissions (kirillk, 2026-07-30)
- 7d65efa53 - Merge remote-tracking branch 'origin/main' into lovely-wallflower (kirillk, 2026-07-30)
- 5bd6fc06f - docs: use real icon filenames and fix HiDPI/placement wording (kirillk, 2026-07-30)
- a0e6273cf - fix(jetbrains): render full-context diffs instead of green raw patch (kirillk, 2026-07-30)
- 568b21cd1 - fix(jetbrains): drop dead IdeActions import, assert real diff toolbar (kirillk, 2026-07-30)
- 049e27000 - docs: note SVG icons are resolution-independent (no @2x) (kirillk, 2026-07-30)
- 5b0a95887 - docs: drop upstream-only icon guidance from icon-jetbrains skill (kirillk, 2026-07-30)
- e3a245471 - fix(jetbrains): address session diff review feedback (kirillk, 2026-07-30)
- 55ea1c276 - docs: require kebab-case icon names and drop upstream-only wiring from AGENTS (kirillk, 2026-07-30)
- a103f4abf - fix(jetbrains): restore diff tree toolbar actions (kirillk, 2026-07-30)
- 17bda33c5 - fix(jetbrains): tighten session header title gap (kirillk, 2026-07-30)
- 8a15b0029 - fix(jetbrains): center branch changes badge content (kirillk, 2026-07-30)
- a1c7108fe - docs(jetbrains): require camelCase icon filenames per #12713 (kiloconnect[bot], 2026-07-30)
- 8a8747186 - fix: revert icon naming to camelCase and clarify views/ placement (kiloconnect[bot], 2026-07-30)
- 1e8afc8d6 - docs(jetbrains): clarify icons/views/ subfolder in generation workflow step 6 (kiloconnect[bot], 2026-07-30)
- 38fe87d57 - fix(docs): revert icon filename rule to camelCase, reference PR #12713 (kiloconnect[bot], 2026-07-30)
- b1bc59fd8 - feat(jetbrains): show branch changes in session header (kirillk, 2026-07-30)
- aa79e0f43 - fix(docs): use kebab-case filename rule and acknowledge views/ subfolder (kiloconnect[bot], 2026-07-30)
- ffce3e4d4 - docs(jetbrains): fix truncated SVG path data in icon examples (kiloconnect[bot], 2026-07-30)
- e5479c092 - docs: move icon skill note into its own section (kiloconnect[bot], 2026-07-30)
- 05488c9c9 - docs: clarify icon-jetbrains paths are flat in-repo, expui/ is upstream-only (kiloconnect[bot], 2026-07-30)
- 5ff8712ee - docs(jetbrains): defer icon sizing to icon-jetbrains skill as source of truth (kiloconnect[bot], 2026-07-30)
- 8e91c315d - docs: make icon-jetbrains skill the single source of truth for SVG authoring (kiloconnect[bot], 2026-07-30)
- fa8d5d1ea - docs: remove icon copyright requirement (kirillk, 2026-07-30)
- 59387f851 - docs: clarify JetBrains icon skill guidance (kirillk, 2026-07-30)
- 05b520e68 - fix(jetbrains): show diff actions on hover (kirillk, 2026-07-30)
- 93f82360c - Merge branch 'main' into trusting-speech (Kirill Kalishev, 2026-07-30)
- ce8781cae - docs: add JetBrains icon skill (kirillk, 2026-07-30)
- 1b78d347d - fix(jetbrains): open edit diffs from transcript (kirillk, 2026-07-30)
- 2842ed67f - fix(vscode): expand isolated launch app path (kirillk, 2026-07-30)
- c68a84b89 - fix(jetbrains): align file change headers (kirillk, 2026-07-30)
- 04c8e646f - fix(jetbrains): standardize diff header spacing (kirillk, 2026-07-30)
- e3c720253 - Merge remote-tracking branch 'origin/main' into research-kilo-console-documentation-deprecation (Josh Lambert, 2026-07-30)
- ab9a80b1a - fix(jetbrains): align session part headers (kirillk, 2026-07-30)
- f2ab2adad - docs(cli): regenerate Console reference (Josh Lambert, 2026-07-30)
- 17b49c807 - Apply suggestions from code review (Joshua Lambert, 2026-07-30)
- a7250624a - Apply suggestion from @lambertjosh (Joshua Lambert, 2026-07-30)
- 2a9a81c10 - Merge remote-tracking branch 'origin/main' into feat/execute-cmds-in-skill-context-vscode (Bruno Agatao, 2026-07-30)
- 69cde59ac - docs(cli): describe the second external_directory prompt in inject.ts (Bruno Agatao, 2026-07-30)
- 6bfb59c50 - fix(jetbrains): improve inline diff controls (kirillk, 2026-07-30)
- 018d3dc26 - test(cli): cover the external_directory ask for out-of-project skill commands (Bruno Agatao, 2026-07-30)
- 7de446f08 - fix(cli): warn when launching deprecated Console (Josh Lambert, 2026-07-30)
- 7163f2ee2 - Apply suggestions from code review (Joshua Lambert, 2026-07-30)
- f1e85e21e - fix(vscode): parse isolated launch workspace args (kirillk, 2026-07-30)
- 89caab9e0 - docs(cli): deprecate Kilo Console (Josh Lambert, 2026-07-30)
- 1c0b74ab0 - docs(vscode): document isolated extension launches (kirillk, 2026-07-30)
- 8e9464ef0 - Merge remote-tracking branch 'origin/main' into feat/execute-cmds-in-skill-context-vscode (Bruno Agatao, 2026-07-30)
- f0f29d0e0 - feat(jetbrains): enhance branch diff tree view (kirillk, 2026-07-29)
- f4e2b5add - fix(jetbrains): show stale diff refresh banner (kirillk, 2026-07-29)
- 74ec8f5fa - fix(vscode): use positional workspace for isolated scripts (kirillk, 2026-07-29)
- c2e600e97 - feat(vscode): expose isolated extension scripts at root (kirillk, 2026-07-29)
- c8548b8b7 - feat(vscode): add isolated extension scripts (kirillk, 2026-07-29)
- b9770dfab - fix(jetbrains): improve diff navigation reload (kirillk, 2026-07-29)
- 54f5b73eb - feat(vscode): prompt for isolated launch workspace (kirillk, 2026-07-29)
- e6bdd4b2b - fix(vscode): launch fully isolated dev instance (kirillk, 2026-07-29)
- 3a9c5ae7f - fix(vscode): use profiles for isolated extension debugging (kirillk, 2026-07-29)
- 72591f7f5 - fix(jetbrains): polish branch diff tree (kirillk, 2026-07-29)
- 50eec4362 - fix(vscode): avoid shell quoting in clean task (kirillk, 2026-07-29)
- 17e380ae1 - fix(vscode): pass isolated state path to clean task (kirillk, 2026-07-29)
- d29b8541c - chore(vscode): explain missing isolated state path (kirillk, 2026-07-29)
- 59bb9e41c - chore(vscode): add isolated extension launch configs (kirillk, 2026-07-29)
- b64fc3516 - i18n(vscode): translate skill-shell permission prompt title (Bruno Agatao, 2026-07-29)
- ea161e093 - fix(vscode): align skill-shell permission prompt with CLI backend (Bruno Agatao, 2026-07-29)
- 98b54232c - fix(jetbrains): align changes tree badges (kirillk, 2026-07-29)
- 97dd0450f - Merge branch 'feat/execute-cmds-in-skill-context' into feat/execute-cmds-in-skill-context-vscode (Bruno Agatao, 2026-07-29)
- 64036252c - feat(jetbrains): add branch diff editor (kirillk, 2026-07-28)
- 3e1a55c3e - fix: resolve post-merge typecheck errors (kirillk, 2026-07-28)
- b80149565 - Merge remote-tracking branch 'origin/main' into lovely-wallflower (kirillk, 2026-07-28)
- 6d74bcf68 - fix(jetbrains): queue multiple pending permissions (kirillk, 2026-07-28)
- c1343fbc8 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-07-28)
- 286b67265 - feat(vscode): show skill shell command batch in permission prompt (Bruno Agatao, 2026-07-28)
- 3a400993b - fix(jetbrains): correct transcript scroll follow (kirillk, 2026-07-27)
- 5f94226bb - fix(jetbrains): style modified files header (kirillk, 2026-07-27)
- ed877f5b3 - feat(jetbrains): show modified files per turn (kirillk, 2026-07-27)
- 8650ffaed - docs(daoxe): fix CLI auth command to kilo auth login --provider daoxe (seven7763, 2026-07-15)
- 1ee780fa1 - docs(daoxe): address review — rationale, auth.json, /connect primary (seven7763, 2026-07-15)
- 3f17f21e5 - docs(kilo-docs): clarify credential storage (seven7763, 2026-07-13)
- 5fabe0b39 - docs(kilo-docs): add DaoXE provider guide (seven7763, 2026-07-13)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/DiffOverflow.kt` (+76, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt` (+126, -17)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/PatchBody.kt` (+61, -18)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ReadToolView.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/TaskToolView.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolMarkdownBody.kt` (+22, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt` (+54, -47)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolView.kt` (+1, -1)
- `packages/opencode/src/kilocode/tool/semantic-search.txt` (+5, -6)
- `packages/opencode/test/kilocode/tool/notify-user.test.ts` (+11, -0)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt` (+45, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/permission/PermissionViewTest.kt` (+133, -0)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)

#### Other Changes
- `.changeset/agent-manager-diff-base-override.md` (+0, -5)
- `.changeset/agent-manager-diff-scope-selector.md` (+0, -5)
- `.changeset/agent-manager-multi-project.md` (+0, -5)
- `.changeset/agent-manager-session-scope-selection.md` (+0, -5)
- `.changeset/agent-manager-terminal-shortcut-focus.md` (+0, -5)
- `.changeset/agent-manager-terminal-shortcut-platform.md` (+0, -5)
- `.changeset/calm-cursors-fit.md` (+0, -5)
- `.changeset/calm-run-terminals.md` (+0, -5)
- `.changeset/cli-startup-lazy-loading.md` (+0, -6)
- `.changeset/config-unset-propagation.md` (+0, -5)
- `.changeset/enable-websearch-config.md` (+0, -6)
- `.changeset/fresh-rc-upgrades.md` (+0, -5)
- `.changeset/friendly-memories-rest.md` (+0, -5)
- `.changeset/fuzzy-otters-signal.md` (+0, -5)
- `.changeset/fuzzy-pandas-listen.md` (+0, -5)
- `.changeset/headless-run-honest-exit.md` (+0, -13)
- `.changeset/jetbrains-attachment-button-sync.md` (+5, -0)
- `.changeset/jetbrains-diff-view-fixes.md` (+5, -0)
- `.changeset/jetbrains-session-load-crop.md` (+5, -0)
- `.changeset/long-session-prompt-navigation.md` (+0, -5)
- `.changeset/past-chats-worktree-family.md` (+0, -5)
- `.changeset/persian-language.md` (+0, -5)
- `.changeset/quiet-terminals-switch.md` (+0, -5)
- `.changeset/responses-stream-error-details.md` (+0, -5)
- `.changeset/ripgrep-error-detail.md` (+0, -5)
- `.changeset/side-terminal-tab-parity.md` (+0, -5)
- `.changeset/skill-shell-execution.md` (+0, -5)
- `.changeset/smart-pandas-remain.md` (+0, -5)
- `.changeset/tidy-mice-report.md` (+0, -5)
- `.kilo/skills/icon-jetbrains/SKILL.md` (+137, -0)
- `.kilo/skills/icon-jetbrains/examples.md` (+176, -0)
- `.kilo/skills/icon-jetbrains/palette.md` (+118, -0)
- `.vscode/launch.json` (+14, -0)
- `.vscode/tasks.json` (+23, -0)
- `AGENTS.md` (+1, -1)
- `CONTRIBUTING.md` (+11, -2)
- `bun.lock` (+26, -26)
- `package.json` (+3, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-docs/lib/nav/ai-providers.ts` (+1, -0)
- `packages/kilo-docs/markdoc/partials/cli-commands-table.md` (+1, -1)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/ai-providers/daoxe.md` (+90, -0)
- `packages/kilo-docs/pages/ai-providers/index.md` (+1, -0)
- `packages/kilo-docs/pages/automate/extending/plugins.md` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli-reference.md` (+2, -2)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli.md` (+9, -5)
- `packages/kilo-docs/pages/contributing/architecture/cli-runtime.md` (+6, -0)
- `packages/kilo-docs/pages/contributing/architecture/index.md` (+6, -2)
- `packages/kilo-docs/pages/contributing/architecture/jetbrains-plugin.md` (+4, -0)
- `packages/kilo-docs/pages/contributing/development-environment.md` (+14, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-skill-shell-chromium-linux.png` (+3, -0)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/AGENTS.md` (+8, -14)
- `packages/kilo-jetbrains/CHANGELOG.md` (+103, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloCliDataParser.kt` (+28, -10)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloSessionRpcApiImpl.kt` (+14, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorkspaceRpcApiImpl.kt` (+189, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/ChatDtoSerializationTest.kt` (+31, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/KiloCliDataParserTest.kt` (+57, -3)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/BranchDiffTest.kt` (+115, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloSessionService.kt` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloWorkspaceService.kt` (+20, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/diff/DiffBlocks.kt` (+45, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/diff/DiffFileStatus.kt` (+16, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/diff/DiffLineNumbers.kt` (+93, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/diff/DiffPatchReconstruct.kt` (+71, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/diff/KiloDiffEditorContent.kt` (+690, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/diff/KiloDiffEditorKind.kt` (+207, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/diff/KiloInlineDiffStore.kt` (+33, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionFileLinks.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+92, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionController.kt` (+137, -42)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/Permission.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/scroll/SessionScroll.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/ModifiedFilesView.kt` (+208, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionLayout.kt` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanel.kt` (+138, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/BranchChangesBadge.kt` (+138, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/SessionHeaderPanel.kt` (+73, -8)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/popup/HeaderPopup.kt` (+18, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/PromptPanel.kt` (+6, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/selection/SessionCopyTarget.kt` (+14, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/style/SessionEditorStyle.kt` (+10, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/style/SessionUiStyle.kt` (+30, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/MessageView.kt` (+14, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/ReasoningView.kt` (+11, -15)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/SessionViewIcons.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/TurnView.kt` (+42, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/ViewFactory.kt` (+19, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/base/AbstractSessionPartView.kt` (+12, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/base/PartHeader.kt` (+69, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/base/PrimarySessionPartView.kt` (+3, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/base/SecondarySessionPartView.kt` (+3, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/todo/TodoWriteView.kt` (+12, -19)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/DiffBars.kt` (+77, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/DiffStatBadge.kt` (+40, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/LayeredOverlayPanel.kt` (+2, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/hybrid/MdViewHybrid.kt` (+5, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/vfs/KiloFileEditorProvider.kt` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/open-diff.svg` (+6, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/views/open-diff_dark.svg` (+6, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+26, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ar.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_bs.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_da.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_de.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_es.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_fr.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ja.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ko.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_nl.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_no.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pl.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pt_BR.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ru.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_th.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_tr.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_uk.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_CN.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_TW.properties` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/diff/DiffLineNumbersTest.kt` (+127, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/diff/DiffPatchReconstructTest.kt` (+187, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/diff/KiloDiffEditorContentTest.kt` (+572, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/diff/KiloInlineDiffStoreTest.kt` (+72, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionScrollTest.kt` (+83, -4)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionUiLayoutTest.kt` (+28, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionUiTestBase.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/HistoryLoadingTest.kt` (+6, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/PermissionQueueTest.kt` (+291, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/ModifiedFilesViewTest.kt` (+191, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/PromptPanelTest.kt` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionEditorStyleTest.kt` (+20, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionLayoutTest.kt` (+19, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanelTest.kt` (+194, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionRootPanelTest.kt` (+16, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/header/SessionHeaderPanelTest.kt` (+109, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/popup/HeaderPopupBodyTest.kt` (+49, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/EditToolViewTest.kt` (+134, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/SearchToolViewTest.kt` (+7, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ToolViewTest.kt` (+5, -6)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/TurnViewTest.kt` (+75, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/base/PartHeaderTest.kt` (+108, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/todo/TodoWriteViewTest.kt` (+4, -5)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeSessionRpcApi.kt` (+10, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeWorkspaceRpcApi.kt` (+17, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/DiffStatBadgeTest.kt` (+44, -0)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloSessionRpcApi.kt` (+4, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloWorkspaceRpcApi.kt` (+12, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/ChatDto.kt` (+9, -0)
- `packages/kilo-memory/package.json` (+1, -1)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-vscode/AGENTS.md` (+9, -7)
- `packages/kilo-vscode/CHANGELOG.md` (+49, -0)
- `packages/kilo-vscode/package.json` (+4, -2)
- `packages/kilo-vscode/script/launch.ts` (+50, -13)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+1, -0)
- `packages/kilo-vscode/src/agent-manager/terminal-routing.ts` (+8, -0)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+3, -0)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-ambient-setup.test.ts` (+30, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-terminal-font.test.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-terminal-routing.test.ts` (+7, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-terminal-state.test.ts` (+98, -0)
- `packages/kilo-vscode/tests/unit/model-usage.test.ts` (+3, -0)
- `packages/kilo-vscode/tests/unit/permission-dock-utils.test.ts` (+20, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+6, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/selection-actions.ts` (+5, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/ambient.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/state.ts` (+15, -9)
- `packages/kilo-vscode/webview-ui/src/components/chat/PermissionDock.tsx` (+60, -29)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskUsage.tsx` (+2, -8)
- `packages/kilo-vscode/webview-ui/src/components/chat/permission-dock-utils.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/src/context/model-usage.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/stories/composite.stories.tsx` (+40, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/permissions.ts` (+3, -0)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+44, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+198, -10)
- `packages/opencode/src/kilo-sessions/remote-sender.ts` (+100, -22)
- `packages/opencode/src/kilo-sessions/rename-adoptions.ts` (+66, -0)
- `packages/opencode/src/kilocode/cli/cmd/console.ts` (+3, -2)
- `packages/opencode/src/kilocode/config/writer.ts` (+5, -0)
- `packages/opencode/src/kilocode/session/prompt.ts` (+23, -0)
- `packages/opencode/src/kilocode/skills/inject.ts` (+13, -10)
- `packages/opencode/src/kilocode/skills/kilo-config.md` (+1, -1)
- `packages/opencode/src/session/llm.ts` (+1, -0)
- `packages/opencode/src/session/prompt.ts` (+18, -3)
- `packages/opencode/src/util/filesystem.ts` (+29, -6)
- `packages/opencode/test/kilocode/server/config-overlay.test.ts` (+35, -1)
- `packages/opencode/test/kilocode/server/httpapi-kilo-edit.test.ts` (+10, -1)
- `packages/opencode/test/kilocode/server/httpapi-memory.test.ts` (+10, -1)
- `packages/opencode/test/kilocode/session-prompt-queue.test.ts` (+18, -3)
- `packages/opencode/test/kilocode/sessions/ensure-title-mark.test.ts` (+471, -0)
- `packages/opencode/test/kilocode/sessions/kilo-sessions-title.test.ts` (+939, -0)
- `packages/opencode/test/kilocode/sessions/remote-sender.test.ts` (+422, -0)
- `packages/opencode/test/kilocode/sessions/rename-adoptions.test.ts` (+74, -0)
- `packages/opencode/test/kilocode/skills/inject.test.ts` (+26, -0)
- `packages/opencode/test/kilocode/tool-registry-indexing.test.ts` (+1, -0)
- `packages/opencode/test/server/httpapi-cors.test.ts` (+10, -1)
- `packages/opencode/test/server/httpapi-exercise/backend.ts` (+7, -1)
- `packages/opencode/test/server/httpapi-instance-route-auth.test.ts` (+5, -0)
- `packages/opencode/test/server/httpapi-session.test.ts` (+1, -1)
- `packages/opencode/test/server/httpapi-ui.test.ts` (+6, -0)
- `packages/opencode/test/session/prompt.test.ts` (+238, -0)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+2, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+78, -77)
- `packages/server/package.json` (+1, -1)
- `packages/storybook/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 35301f1ac..e07c580a5 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.4.17",
+  "version": "7.4.18",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
index 0ae649ef5..91f299579 100644
--- a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
@@ -116,15 +116,32 @@ class PermissionView(
         val prev = requestId
         requestId = permission.id
 
-        card.setHeader(KiloBundle.message("session.permission.title"))
+        val skillShell = permission.meta.raw["skillShell"] == "true"
+        val skill = permission.meta.raw["skill"]
+        card.setHeader(
+            if (skillShell && !skill.isNullOrBlank())
+                // skill is the untrusted SKILL.md frontmatter name; escape it the same way as
+                // the command list so it can't reorder/repaint the header.
+                KiloBundle.message("session.permission.skillShell.title", escapeControl(skill))
+            else KiloBundle.message("session.permission.title"),
+        )
         syncDescription(description(permission))
 
         val tool = permission.name
-        val target = if (tool == "bash") permission.meta.command else resolveTarget(permission)
+        // A skill-shell bash batch shows the verbatim command list (control-char-escaped so the
+        // displayed command can't repaint the line). Its external_directory sibling still shows
+        // directories via resolveTarget; only the header carries the skill attribution.
+        val target = when {
+            skillShell && tool == "bash" -> permission.meta.skillCommands.joinToString("\n") { escapeControl(it) }
+            tool == "bash" -> permission.meta.command
+            else -> resolveTarget(permission)
+        }
         syncCode(tool, target)
         syncDiffs(permission.meta.fileDiffs)
         responding = permission.state == PermissionRequestState.RESPONDING || permission.state == PermissionRequestState.RESOLVED
-        rules.update(permission.meta.ruleDecisions, reset = prev != permission.id)
+        // Skill-shell approvals are never persisted, so no auto-approve rule toggles even if a
+        // future backend change starts sending candidates for this batch.
+        rules.update(if (skillShell) emptyList() else permission.meta.ruleDecisions, reset = prev != permission.id)
         syncState(permission)
         syncPrimaryText()
 
@@ -265,6 +282,31 @@ class PermissionView(
         view.component.border = JBUI.Borders.empty()
     }
 
+    // Escape control chars (CR/LF/ESC/etc.) and bidi/format characters so a skill command can't
+    // repaint the prompt or use Trojan-Source reordering to make the displayed text differ from
+    // what executes; newlines become a visible marker. Mirrors displayCommand in the CLI
+    // (packages/opencode/src/kilocode/skills/display.ts); keep the ranges in sync.
+    private fun escapeControl(command: String): String = buildString {
+        for (ch in command) {
```

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt
index 24d36cff6..e4dcb2d91 100644
--- a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt
@@ -34,7 +34,7 @@ abstract class BaseSearchToolView(
     protected abstract fun viewName(): String
 
     init {
-        bindHeader(parts.glyph, parts.title, parts.sub, parts.state, parts.center, parts.controls, parts.slot)
+        bindHeader(parts.glyph, parts.title, parts.sub, parts.state, parts.left, parts.right, parts.slot)
         parts.targets.forEach { bindHeader(it) }
         applyStyle(style)
         sync()
@@ -104,7 +104,7 @@ abstract class BaseSearchToolView(
     @RequiresEdt
     internal fun headerComponent() = parts.header
     @RequiresEdt
-    internal fun centerComponent() = parts.center
+    internal fun centerComponent() = parts.fill
     @RequiresEdt
     internal fun targetComponents() = parts.targets
 
```

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/DiffOverflow.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/DiffOverflow.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/DiffOverflow.kt
new file mode 100644
index 000000000..273b36d59
--- /dev/null
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/DiffOverflow.kt
@@ -0,0 +1,76 @@
+package ai.kilocode.client.session.views.tool
+
+import ai.kilocode.client.plugin.KiloBundle
+import ai.kilocode.client.session.model.Tool
+import ai.kilocode.client.session.ui.style.SessionEditorStyle
+import ai.kilocode.client.ui.UiStyle
+import ai.kilocode.client.ui.layout.Stack
+import com.intellij.openapi.Disposable
+import com.intellij.ui.EditorTextField
+import com.intellij.ui.HyperlinkLabel
+import com.intellij.ui.components.JBLabel
+import com.intellij.util.concurrency.annotations.RequiresEdt
+import com.intellij.util.ui.JBUI
+import java.awt.Component
+import javax.swing.JComponent
+
+/**
+ * Placeholder shown in place of an embedded diff editor when a diff exceeds
+ * [ai.kilocode.client.session.ui.style.SessionUiStyle.View.Tool.DIFF_MAX_LINES]. Building an editor
+ * for such a diff walks every line on the EDT (gutter reinit) and freezes the UI, so the popup and
+ * inline body defer to the platform diff tab, which streams file diffs on background threads.
+ */
+@RequiresEdt
+internal fun diffOverflowPanel(open: () -> Unit): JComponent {
+    val message = JBLabel(KiloBundle.message("diff.overflow.message")).apply {
+        foreground = UiStyle.Colors.weak()
+    }
+    val link = HyperlinkLabel(KiloBundle.message("diff.overflow.open")).apply {
+        addHyperlinkListener { open() }
+    }
+    val body = Stack.vertical(gap = UiStyle.Gap.sm())
+        .next(message)
+        .next(link)
+    return JBUI.Panels.simplePanel(body).apply {
+        isOpaque = false
+        border = JBUI.Borders.empty(UiStyle.Gap.pad())
+    }
+}
+
+/**
+ * [EditBody] that renders the large-diff placeholder for a single-file edit whose diff is too large
+ * to preview inline or in a hover popup. Multi-file diffs are capped inside [PatchBody] directly, so
+ * this only covers the single-file edit/write case that [PatchBody] cannot render.
+ */
```

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt
index 865e2d42f..77fb71276 100644
--- a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt
@@ -1,21 +1,30 @@
 package ai.kilocode.client.session.views.tool
 
+import ai.kilocode.client.diff.DiffLineNumbers
 import ai.kilocode.client.plugin.KiloBundle
+import ai.kilocode.client.session.SessionDiffOpener
 import ai.kilocode.client.session.SessionFileOpener
 import ai.kilocode.client.session.model.Content
 import ai.kilocode.client.session.model.Tool
 import ai.kilocode.client.session.model.ToolKind
 import ai.kilocode.client.session.ui.popup.HeaderPopupBody
 import ai.kilocode.client.session.ui.popup.HeaderPopupRequest
+import ai.kilocode.client.session.ui.selection.SessionCopyTarget
 import ai.kilocode.client.session.ui.selection.SessionSelection
+import ai.kilocode.client.session.ui.selection.hoverPlaceholder
 import ai.kilocode.client.session.ui.style.SessionEditorStyle
 import ai.kilocode.client.session.ui.style.SessionUiStyle
+import ai.kilocode.client.session.views.SessionViewIcons
+import ai.kilocode.client.session.views.base.PartHeader
 import ai.kilocode.client.session.views.base.SecondarySessionPartView
 import ai.kilocode.client.telemetry.Telemetry
 import ai.kilocode.client.ui.DiffStatBadge
+import ai.kilocode.client.ui.ToolbarButtonAction
 import ai.kilocode.client.ui.UiStyle
 import ai.kilocode.client.ui.md.MdCodeBlockBorder
 import ai.kilocode.client.ui.md.MdCodeBlockOptions
+import ai.kilocode.client.ui.toolbarButton
+import ai.kilocode.rpc.dto.DiffFileDto
 import com.intellij.openapi.actionSystem.DataSink
 import com.intellij.openapi.actionSystem.UiDataProvider
 import com.intellij.openapi.util.Disposer
@@ -23,8 +32,8 @@ import com.intellij.ui.EditorTextField
 import com.intellij.ui.components.JBLabel
 import com.intellij.util.concurrency.annotations.RequiresEdt
 import com.intellij.util.ui.JBFont
-import com.intellij.util.ui.JBUI
 import java.awt.Dimension
+import javax.swing.JComponent
 import javax.swing.ScrollPaneConstants
 
 /**
@@ -38,34 +47,74 @@ class EditToolView(
     private val selection: SessionSelection? = null,
     private val parts: ToolParts = toolParts(tool, openFile),
     private var body: EditBody = editBody(tool, selection, openFile),
-) : SecondarySessionPartView(parts.header, { body.mount(tool) }), UiDataProvider {
```


*... and more files (showing first 5)*

## opencode Changes (14f0bf6..19231fc)

### Commits

- 19231fc - chore: generate (opencode-agent[bot], 2026-07-31)
- d0a7ca6 - go: document data policy per model (Frank, 2026-07-31)
- d80e86b - go: document data policy per model (Frank, 2026-07-31)
- e4bd975 - chore: generate (opencode-agent[bot], 2026-07-31)
- 4087cf1 - fix(go): restore limits graph axis (#39870) (Jack, 2026-07-31)

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
- `packages/console/app/src/i18n/ar.ts` (+17, -7)
- `packages/console/app/src/i18n/br.ts` (+17, -7)
- `packages/console/app/src/i18n/da.ts` (+18, -7)
- `packages/console/app/src/i18n/de.ts` (+17, -7)
- `packages/console/app/src/i18n/en.ts` (+18, -7)
- `packages/console/app/src/i18n/es.ts` (+17, -7)
- `packages/console/app/src/i18n/fr.ts` (+18, -7)
- `packages/console/app/src/i18n/it.ts` (+17, -7)
- `packages/console/app/src/i18n/ja.ts` (+16, -7)
- `packages/console/app/src/i18n/ko.ts` (+16, -7)
- `packages/console/app/src/i18n/no.ts` (+18, -7)
- `packages/console/app/src/i18n/pl.ts` (+18, -7)
- `packages/console/app/src/i18n/ru.ts` (+18, -7)
- `packages/console/app/src/i18n/th.ts` (+18, -7)
- `packages/console/app/src/i18n/tr.ts` (+18, -7)
- `packages/console/app/src/i18n/uk.ts` (+18, -7)
- `packages/console/app/src/i18n/zh.ts` (+16, -8)
- `packages/console/app/src/i18n/zht.ts` (+16, -8)
- `packages/console/app/src/routes/go/index.css` (+72, -0)
- `packages/console/app/src/routes/go/index.tsx` (+95, -24)
- `packages/web/src/content/docs/ar/go.mdx` (+22, -1)
- `packages/web/src/content/docs/bs/go.mdx` (+22, -1)
- `packages/web/src/content/docs/da/go.mdx` (+22, -1)
- `packages/web/src/content/docs/de/go.mdx` (+22, -1)
- `packages/web/src/content/docs/es/go.mdx` (+22, -1)
- `packages/web/src/content/docs/fr/go.mdx` (+22, -1)
- `packages/web/src/content/docs/go.mdx` (+22, -1)
- `packages/web/src/content/docs/it/go.mdx` (+22, -1)
- `packages/web/src/content/docs/ja/go.mdx` (+22, -1)
- `packages/web/src/content/docs/ko/go.mdx` (+22, -1)
- `packages/web/src/content/docs/nb/go.mdx` (+22, -1)
- `packages/web/src/content/docs/pl/go.mdx` (+22, -1)
- `packages/web/src/content/docs/pt-br/go.mdx` (+22, -1)
- `packages/web/src/content/docs/ru/go.mdx` (+22, -1)
- `packages/web/src/content/docs/th/go.mdx` (+22, -1)
- `packages/web/src/content/docs/tr/go.mdx` (+22, -1)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+22, -1)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+22, -1)

### Key Diffs

(no key diffs to show)

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/package.json
- `src/permission/` - review permission changes from packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/permission/PermissionView.kt
- `src/permission/` - review permission changes from packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/permission/PermissionViewTest.kt
- `src/tool/BaseSearchToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt changes
- `src/tool/DiffOverflow.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/DiffOverflow.kt changes
- `src/tool/EditToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt changes
- `src/tool/PatchBody.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/PatchBody.kt changes
- `src/tool/ReadToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ReadToolView.kt changes
- `src/tool/ShellToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt changes
- `src/tool/TaskToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/TaskToolView.kt changes
- `src/tool/ToolMarkdownBody.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolMarkdownBody.kt changes
- `src/tool/ToolSupport.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt changes
- `src/tool/ToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolView.kt changes
- `src/tool/notify-user.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/notify-user.test.ts changes
- `src/tool/semantic-search.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/semantic-search.txt changes
