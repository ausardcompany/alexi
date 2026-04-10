# Upstream Changes Report
Generated: 2026-04-10 07:43:54

## Summary
- kilocode: 358 commits, 434 files changed
- opencode: 52 commits, 140 files changed

## kilocode Changes (1a5be52c7..f1a347102)

### Commits

- f1a347102 - fix(agent-manager): preserve section ordering state (#8680) (Marius, 2026-04-10)
- 9457f4f77 - Merge pull request #8682 from Kilo-Org/docs/auto-balanced-qwen36 (Christiaan Arnoldus, 2026-04-10)
- 6fa7d3dd0 - fix: wrong doc config instruction for custom providers baseURL (#8627) (Ricardo Fiorani, 2026-04-10)
- e4582f1ab - Merge pull request #8546 from Kilo-Org/docs/mcp-ask-permissions (Joshua Lambert, 2026-04-10)
- f6251ac7f - Merge branch 'main' into docs/auto-balanced-qwen36 (Joshua Lambert, 2026-04-10)
- c03945790 - Apply suggestion from @lambertjosh (Joshua Lambert, 2026-04-10)
- afad45f8c - Apply suggestion from @lambertjosh (Joshua Lambert, 2026-04-10)
- e80bd61cc - docs(kilo-docs): fix broken auto-model anchors in auto-model-tiers.md (Josh Lambert, 2026-04-10)
- f20061ebc - Apply suggestion from @lambertjosh (Joshua Lambert, 2026-04-10)
- d94135958 - docs(kilo-docs): mention extension shows resolved model and cost on expand (Josh Lambert, 2026-04-10)
- 31f441372 - docs(kilo-docs): move gateway link under how it works, convert tier sections to bullets (Josh Lambert, 2026-04-10)
- d6fef9f68 - docs(kilo-docs): add tier goal descriptions, explain free tier, remove redundancy (Josh Lambert, 2026-04-10)
- 1f90d2eab - docs(kilo-docs): replace inline mode-to-model tables with links to gateway docs (Josh Lambert, 2026-04-10)
- 648793328 - docs(kilo-docs): fix stale references to multi-model balanced routing (Josh Lambert, 2026-04-10)
- 7ae4c4ee0 - Merge branch 'main' into docs/mcp-ask-permissions (Joshua Lambert, 2026-04-10)
- 22a4c2335 - docs: revert using-in-kilo-code.md changes, fix cross-link anchors (Josh Lambert, 2026-04-10)
- 90c6bf99f - docs: make using-in-kilo-code the source of truth for MCP tool permissions, cross-link from other pages (Josh Lambert, 2026-04-10)
- 738e949fd - docs(kilo-docs): fix rule precedence (last match wins), use realistic GitHub MCP examples, restore VSCode tab (Josh Lambert, 2026-04-10)
- a1eaae2b0 - docs(kilo-docs): consolidate MCP tool permissions into auto-approving-actions page (Josh Lambert, 2026-04-10)
- 10bb4d11e - release: v7.2.3 (kilo-maintainer[bot], 2026-04-10)
- 57a2ae366 - Merge pull request #8700 from Kilo-Org/catrielmuller/pre-release-implementation (Catriel Müller, 2026-04-10)
- a014fa379 - Revert "docs(cli): document how to disable built-in providers" (Josh Lambert, 2026-04-09)
- 6ba53081b - docs(cli): document how to disable built-in providers (Josh Lambert, 2026-04-09)
- 3ab06812c - fix: use release sync for prereleases (Catriel Müller, 2026-04-09)
- aa97827f1 - fix: use main in publish sync (Catriel Müller, 2026-04-09)
- ce6b3ce56 - fix: align pre-release version publishing (Catriel Müller, 2026-04-09)
- afb20fcf0 - Update packages/kilo-docs/pages/code-with-ai/agents/auto-model.md (Joshua Lambert, 2026-04-09)
- 235f81c2d - docs(kilo-docs): switch Auto Balanced docs to GPT 5.3 Codex (Josh Lambert, 2026-04-09)
- 1959a39be - Merge pull request #8693 from Kilo-Org/catrielmuller/fix-vscode-complexity (Catriel Müller, 2026-04-09)
- 8c2dfe199 - fix(vscode): disable eslint complexity and max-lines rules temporarily (Catriel Müller, 2026-04-09)
- d98cd85c7 - Merge pull request #8690 from Kilo-Org/catrielmuller/fix-vscode-build-09022026 (Catriel Müller, 2026-04-09)
- 1c701d080 - fix(vscode): update RemoteStatusService to use correct SDK API signature (Catriel Müller, 2026-04-09)
- 4f1fa1995 - Merge pull request #8683 from Kilo-Org/glitter-neighbor (Kirill Kalishev, 2026-04-09)
- 029eb638f - fix: Remove per-gitdir mutex lock from snapshot operation (Johnny Amancio, 2026-04-09)
- 150763998 - Merge pull request #8681 from Kilo-Org/fix/child-session-id-normalization (Kirill Kalishev, 2026-04-09)
- 0f923e900 - Merge branch 'main' into fix/child-session-id-normalization (Kirill Kalishev, 2026-04-09)
- 258fbc4e1 - fix(cli): case-insensitive match for resolve merge conflict subject (kirillk, 2026-04-09)
- c02addb54 - fix(cli): also detect Resolve merge conflict commits as upstream merges (kirillk, 2026-04-09)
- 014f15cc0 - fix(agent-manager): show helpful error when repo has no commits (#8648) (Marius, 2026-04-09)
- def14eb2e - fix(agent-manager): preserve sections missing from worktreeOrder during move and reorder (#8595) (Marius, 2026-04-09)
- 4d6ae2454 - fix(agent-manager): persist non-worktree sessions to agent-manager.json (#7928) (Marius, 2026-04-09)
- da6dcfbf5 - fix(agent-manager): worktree setup overlay stuck when using custom base branch (#7542) (Marius, 2026-04-09)
- b42fdc323 - fix(cli): skip opencode annotation check on upstream merge PRs (kirillk, 2026-04-09)
- e11bb7cb7 - fix(cli): skip opencode annotation check on upstream merge PRs (kirillk, 2026-04-09)
- de65bd8a7 - Merge pull request #8599 from Kilo-Org/feat/cli-npm-prerelease (Catriel Müller, 2026-04-09)
- 76e7b5f9c - Merge branch 'main' into fix/child-session-id-normalization (Kirill Kalishev, 2026-04-09)
- f3ce67fa2 - docs(kilo-docs): update Auto Balanced docs to reflect Qwen 3.6 Plus (Josh Lambert, 2026-04-09)
- de79452f5 - Merge pull request #7578 from Kilo-Org/kilocode-cli-resume-after-sleep (Marian Alexandru Alecu, 2026-04-09)
- 1802bb3e3 - chore(vscode): document task metadata cast (kiloconnect[bot], 2026-04-09)
- 934066cb3 - test(vscode): cover task child session IDs (kiloconnect[bot], 2026-04-09)
- 86513816a - feat(agent-manager): add shared semaphore to cap concurrent git/gh processes (#8660) (Marius, 2026-04-09)
- 4be9c522e - fix(ui): pass tool part metadata to renderers (kiloconnect[bot], 2026-04-09)
- 61a7e834f - fix(vscode): adopt task children from state metadata (kiloconnect[bot], 2026-04-09)
- 6642e8c6d - fix(agent-manager): recover pending permissions after worktree session registration (#8659) (kilo-code-bot[bot], 2026-04-09)
- da85ca69e - Merge pull request #8209 from Kilo-Org/eshurakov/puddle-beret (Evgeny Shurakov, 2026-04-09)
- 7024f179d - Merge pull request #8676 from Kilo-Org/fix/agent-manager-renderwt-args (Mark IJbema, 2026-04-09)
- a2436ce1e - fix(agent-manager): fix renderWt call with stale 4-arg signature (kiloconnect[bot], 2026-04-09)
- 2e69c4c31 - Merge pull request #8672 from Kilo-Org/fix/bedrock-empty-text-filtering-markers (Mark IJbema, 2026-04-09)
- 6545522f6 - Merge branch 'main' into fix/bedrock-empty-text-filtering-markers (Mark IJbema, 2026-04-09)
- 348c5c9ac - Merge pull request #6757 from 0xCybin/fix/bedrock-empty-text-filtering (Mark IJbema, 2026-04-09)
- ebcda1b50 - fix(agent-manager): fix version group splitting when sections exist (#8667) (Marius, 2026-04-09)
- 46f450a84 - fix(cli): expand kilocode_change markers to cover all changed lines (kiloconnect[bot], 2026-04-09)
- b27e628c6 - Merge pull request #8644 from Kilo-Org/fix/unconditional-task-deny-subagents (Mark IJbema, 2026-04-09)
- 1f2046c59 - wip (kiloconnect[bot], 2026-04-09)
- 060822724 - refactor(cli): add kilocode_change markers and extract bedrock tests (kiloconnect[bot], 2026-04-09)
- 7b3756f27 - fix(agent-manager): fix sidebar navigation and shortcuts with sections (#8647) (Marius, 2026-04-09)
- a00b88090 - Merge pull request #8615 from Kilo-Org/deadpan-agenda (Kirill Kalishev, 2026-04-09)
- 17380f130 - feat(agent-manager): add per-file revert buttons to diff views (#7455) (Marius, 2026-04-09)
- 5ef8a7029 - fix(vscode): translate remote status bar tooltips (Evgeny Shurakov, 2026-04-09)
- f1948fb3d - fix(vscode): dispose visibility and view state listeners in KiloProvider (Evgeny Shurakov, 2026-04-09)
- 28f44fe5e - Merge pull request #8549 from Kilo-Org/docs/remove-free-and-budget-models-page (Emilie Lima Schario, 2026-04-09)
- 98156b8eb - docs(kilo-docs): refresh using-kilo-for-free page with Auto Model Free details (Josh Lambert, 2026-04-09)
- 53ca09388 - docs(kilo-docs): remove stale free-and-budget-models page (Josh Lambert, 2026-04-09)
- f6753c375 - Merge pull request #8669 from Kilo-Org/fix/windows-plugin-marker-position (Mark IJbema, 2026-04-09)
- 90105096e - Merge branch 'main' into fix/windows-plugin-marker-position (Mark IJbema, 2026-04-09)
- 4cc6f75a1 - Merge pull request #6915 from grandmaster451/fix/windows-plugin-display (Mark IJbema, 2026-04-09)
- ca2177d93 - fix(cli): move kilocode_change marker to cover all changed lines (kiloconnect[bot], 2026-04-09)
- 537db0844 - fix: exempt kilo-* dirs from annotation check, add markers to session route (Evgeny Shurakov, 2026-04-09)
- b88377b94 - Merge branch 'main' into fix/bedrock-empty-text-filtering (Mark IJbema, 2026-04-09)
- cd3e47f3e - Merge branch 'main' into fix/windows-plugin-display (Mark IJbema, 2026-04-09)
- 403bcc0ec - refactor(vscode): extract remote status and focus helpers in KiloProvider (Evgeny Shurakov, 2026-04-09)
- f118011ab - feat(vscode): enforce cyclomatic complexity lint rule (#8662) (Marius, 2026-04-09)
- 2861dd7ff - Merge pull request #8661 from Kilo-Org/sulfuric-airedale (Mark IJbema, 2026-04-09)
- 3501f282e - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-04-09)
- f45e8fd23 - test(vscode): add visual regression stories for SectionHeader component (marius-kilocode, 2026-04-09)
- 684319891 - feat(vscode): remote session tracking with focused/open distinction (Evgeny Shurakov, 2026-04-09)
- b64d2babe - feat(agent-manager): show checkmark on approved PR badges (#8657) (Marius, 2026-04-09)
- 424244c66 - fix(cli): add kilocode_change markers and reject primary agents in task tool (kiloconnect[bot], 2026-04-09)
- d65ee14cf - Merge pull request #8654 from Kilo-Org/session/agent_54a63e1a-9980-4a7d-b2d4-13233973f500 (Mark IJbema, 2026-04-09)
- 80f8271ec - feat(agent-manager): periodic full sync of PR status for all worktrees (#8655) (Marius, 2026-04-09)
- 18e1a004e - docs(vscode): document supported image types and Shift+drag requirement (#8629) (Joshua Lambert, 2026-04-09)
- 0f1198820 - chore(vscode): enforce autocomplete dead code checks (kiloconnect[bot], 2026-04-09)
- b43234147 - refactor(vscode): remove unused continuedev support utilities (kiloconnect[bot], 2026-04-09)
- b0d77fe9d - refactor(vscode): remove dormant autocomplete provider pipeline (kiloconnect[bot], 2026-04-09)
- 845978c17 - refactor(vscode): remove unused chat autocomplete handlers (kiloconnect[bot], 2026-04-09)
- 5f566869d - chore(vscode): remove unused autocomplete docs and locales (kiloconnect[bot], 2026-04-09)
- 9a2fbae94 - fix(ui): prevent collapsible toggle on tools with hideDetails (#8650) (Marius, 2026-04-09)
- bf75b3e83 - Merge pull request #7041 from shantoislamdev/fix-docs-theme-toggle-icons-15391880175080747059 (Mark IJbema, 2026-04-09)
- 10e8a4ad4 - feat(vscode): render question tool inline in conversation (#8649) (Marius, 2026-04-09)
- 7594a0258 - fix(ui): reasoning blocks respect scroll position and expanded state (#8642) (Marius, 2026-04-09)
- fc25106c2 - fix(vscode): reduce question dock font size and height (#8643) (Marius, 2026-04-09)
- dd5ff3ee9 - Merge branch 'main' into kilocode-cli-resume-after-sleep (Marian Alexandru Alecu, 2026-04-09)
- 56a062011 - fix(cli): unconditionally deny task tool for all subagent sessions (kiloconnect[bot], 2026-04-09)
- ca82fef02 - Merge pull request #8622 from Kilo-Org/session/agent_fd113925-e251-4aeb-9994-36efd3ebf0bd (Mark IJbema, 2026-04-09)
- 960ba0d98 - Merge pull request #8320 from Kilo-Org/session/agent_a1012ae8-de00-4e83-bbb2-0b203e7ed84d (Mark IJbema, 2026-04-09)
- 9c27d7a01 - test(cli): move to kilocode test dir (Alex Alecu, 2026-04-09)
- e1ca9e921 - refactor(cli): return id from ask() (Alex Alecu, 2026-04-09)
- 2c4c214b3 - fix(cli): background mcp reconnect (Alex Alecu, 2026-04-09)
- 128c6e9e2 - style(cli): remove duplicate marker (Alex Alecu, 2026-04-09)
- 7ddc269cf - chore(cli): remove plan file (Alex Alecu, 2026-04-09)
- da3ce5623 - chore(cli): add kilocode_change annotations (Alex Alecu, 2026-04-09)
- 1dc3c329c - Merge pull request #8617 from Kilo-Org/catrielmuller/8264 (Catriel Müller, 2026-04-08)
- 7b7a5e5b5 - fix: fix knip (Catriel Müller, 2026-04-08)
- f36bba771 - Merge pull request #8625 from Kilo-Org/docs/remote-connections (Emilie Lima Schario, 2026-04-08)
- d55f255e0 - docs: add Remote Connections section to Cloud Agent and CLI docs (kiloconnect[bot], 2026-04-08)
- 5dafaa53a - fix: fix permission diff on agent manager (Catriel Müller, 2026-04-08)
- 3cd8a6dc0 - fix(cli): prevent JDTLS from creating Eclipse metadata files in project root (kiloconnect[bot], 2026-04-08)
- aa16f5938 - refactor: fix comments (Catriel Müller, 2026-04-08)
- f3fcdc5d4 - refactor: add diff vitual to test (Catriel Müller, 2026-04-08)
- e563c08ee - fix: resolve TS errors for optional before/after in PermissionDiff (Catriel Müller, 2026-04-08)
- 90970a215 - feat: diff on edit/create files permission (Catriel Müller, 2026-04-08)
- fa2f0e52f - Merge pull request #8614 from Kilo-Org/docs/kiloclaw-slack-pairing-no-slash-command (Alex Gold, 2026-04-08)
- 6a59ecaaf - Merge branch 'main' into deadpan-agenda (Kirill Kalishev, 2026-04-08)
- e7bee626a - fix(vscode): sync mode picker from assistant messages too (kirillk, 2026-04-08)
- 42a15469a - Merge branch 'main' into docs/kiloclaw-slack-pairing-no-slash-command (Alex Gold, 2026-04-08)
- 452b258d2 - Merge pull request #8191 from Kilo-Org/feat/local-recall-tool (Marian Alexandru Alecu, 2026-04-08)
- b3a270b9e - Merge pull request #7764 from Kilo-Org/feat/allow-everything (Marian Alexandru Alecu, 2026-04-08)
- c91ff5f9c - docs(kilo-docs): simplify KiloClaw Slack pairing instructions (kiloconnect[bot], 2026-04-08)
- e18e94ecd - Merge pull request #8528 from Kilo-Org/caring-columnist (Kirill Kalishev, 2026-04-08)
- 31e198136 - release: v7.2.1 (kilo-maintainer[bot], 2026-04-08)
- 253788e9e - Merge branch 'main' into caring-columnist (Kirill Kalishev, 2026-04-08)
- 6b81526c1 - fix(cli): resolve org ID from OAuth auth accountId with comment (kirillk, 2026-04-08)
- dc94dc39f - fix(cli): scope timeout to connection phase (Alex Alecu, 2026-04-08)
- 25143d863 - fix(cli): gate resume on restored state (Alex Alecu, 2026-04-08)
- 0043be3db - Merge branch 'main' into feat/allow-everything (Marian Alexandru Alecu, 2026-04-08)
- 8365abc78 - Merge branch 'main' into feat/local-recall-tool (Marian Alexandru Alecu, 2026-04-08)
- 3272fbebd - Merge pull request #8606 from Kilo-Org/fix/add-kilocode-change-marker-prompt-flexshrink (Mark IJbema, 2026-04-08)
- 21531ce6c - fix(cli): add missing kilocode_change annotations (Alex Alecu, 2026-04-08)
- 387b16e2e - Merge remote-tracking branch 'origin/main' into kilocode-cli-resume-after-sleep (Alex Alecu, 2026-04-08)
- 0545a38b8 - fix(cli): add kilocode_change marker to prompt flexShrink prop (kiloconnect[bot], 2026-04-08)
- 3948bb3f8 - fix(cli): skip config-protected prompts in drain loop (Alex Alecu, 2026-04-08)
- 6bb47302d - Merge remote-tracking branch 'origin/main' into feat/local-recall-tool (Alex Alecu, 2026-04-08)
- f0e086313 - Merge branch 'feat/allow-everything' of https://github.com/Kilo-Org/kilocode into feat/allow-everything (Alex Alecu, 2026-04-08)
- ee5bb2fa5 - fix(cli): exit on git failure in annotation checker (Alex Alecu, 2026-04-08)
- c9ed1097d - fix(cli): skip permission prompt for same-project recall reads (Alex Alecu, 2026-04-08)
- 758a6582f - refactor(cli): move allow-everything route to kilocode directory (Alex Alecu, 2026-04-08)
- 28dcea923 - Merge branch 'main' into caring-columnist (Kirill Kalishev, 2026-04-08)
- 9306a6060 - Merge pull request #6458 from aravhawk/session/agent_58776529-50a0-40ff-9d78-3f2f7e4d28b6 (Mark IJbema, 2026-04-08)
- 936c2a157 - Merge pull request #8601 from Kilo-Org/brass-yuzu (Kirill Kalishev, 2026-04-08)
- 941147373 - Merge pull request #6664 from justincqz/docs/remove-web-command (Mark IJbema, 2026-04-08)
- b92a1929c - Merge branch 'main' into docs/remove-web-command (Mark IJbema, 2026-04-08)
- 54e57d341 - Merge branch 'main' into session/agent_58776529-50a0-40ff-9d78-3f2f7e4d28b6 (Mark IJbema, 2026-04-08)
- 039cf837f - fix(cli): add word boundary to MARKER_PREFIX regex (kirillk, 2026-04-08)
- 07e97005e - fix(cli): annotation check supports JSX comment syntax in TSX files (kirillk, 2026-04-08)
- 5ea872e4a - fix: handle pre_release flag with explicit version override (kiloconnect[bot], 2026-04-08)
- 501fb340f - chore: trigger CI re-run (kiloconnect[bot], 2026-04-08)
- 3ea1e8f40 - feat(cli): publish CLI as npm prerelease when pre_release flag is set (kiloconnect[bot], 2026-04-08)
- bf2ae93d6 - fix(cli): support JSX comment syntax in kilocode_change annotation check (kirillk, 2026-04-08)
- ee332b4ec - Merge pull request #8505 from Kilo-Org/feat/agent-permissions-display (Mark IJbema, 2026-04-08)
- 68858cc50 - docs: update for task timeline graph and Agent Manager PR badges (#8532) (Scuttle Bot, 2026-04-08)
- f81a17236 - fix(agent-manager): prune orphaned sessions to prevent unbounded state file growth (#8597) (Marius, 2026-04-08)
- 06c98f8ec - chore(cli): wrap formatSessionJSON in kilocode_change block (Alex Alecu, 2026-04-08)
- 9d73e4ca1 - fix: preserve write tool alongside apply_patch for gpt-5 models (Jackson Kasi, 2026-04-08)
- 42448f98c - chore(cli): add missing kilocode_change annotations (Alex Alecu, 2026-04-08)
- afc858af6 - fix(cli): resolve worktree folder name for session list labels (Alex Alecu, 2026-04-08)
- b89513fd8 - feat(cli): show worktree labels in session list with ctrl+a filter (Alex Alecu, 2026-04-08)
- 5597e1cfc - Merge branch 'main' into feat/allow-everything (Marian Alexandru Alecu, 2026-04-08)
- 5ccceb5a9 - Merge branch 'main' into caring-columnist (Kirill Kalishev, 2026-04-08)
- ca3b8eb49 - Merge pull request #8590 from Kilo-Org/fix/enforce-opencode-separation (Marian Alexandru Alecu, 2026-04-08)
- 8f354dbc9 - fix: Update agents.md to enfore even more OpenCode separation (Alex Alecu, 2026-04-08)
- 7dc439901 - feat(vscode): add copy-to-clipboard button for permission ruleset JSON (Mark IJbema, 2026-04-08)
- c294c6af5 - fix(agent-manager): key PR cache by branch and reduce TTL to 10s (#8588) (Marius, 2026-04-08)
- cb7058c2d - chore(vscode): bump KiloProvider.ts max-lines to 3300 (Mark IJbema, 2026-04-08)
- e29befcf7 - fix(agent-manager): restore subtitle, pr, and onOpenPR props in section renderWt (#8583) (Marius, 2026-04-08)
- aa2d74779 - Merge pull request #8142 from Kilo-Org/mark/reimplement-mcp-removal (Mark IJbema, 2026-04-08)
- c292de9d3 - perf(agent-manager): reduce GitHub API usage in PR status polling (#8582) (Marius, 2026-04-08)
- 242c16717 - Merge pull request #8504 from Kilo-Org/feat/help-all-command (Marian Alexandru Alecu, 2026-04-08)
- 6cc197c44 - Merge branch 'main' into mark/reimplement-mcp-removal (Mark IJbema, 2026-04-08)
- a11ab3a93 - Merge pull request #8539 from Kilo-Org/eshurakov/telemetry-remote-connection-v2 (Evgeny Shurakov, 2026-04-08)
- 5de991a80 - feat(ui): add copy button for assistant messages in kilo-ui (#8578) (Marius, 2026-04-08)
- 69754b851 - fix(vscode): add allAgents to story mocks to fix storybook render errors (Mark IJbema, 2026-04-08)
- 359410fad - refactor(vscode): address code review feedback for agent permissions display (Mark IJbema, 2026-04-08)
- cc257fdd3 - fix(vscode): preserve hidden flag in allAgents and filter internal modes (kiloconnect[bot], 2026-04-08)
- 97ce20916 - fix(vscode): address review feedback — default agent picker and i18n (kiloconnect[bot], 2026-04-08)
- bd0295b5e - feat(vscode): add calculated permissions display to agent details (kiloconnect[bot], 2026-04-08)
- 0697217d1 - fix(cli): strengthen sync test and add missing ConfigCLICommand (Alex Alecu, 2026-04-08)
- c7bebd225 - feat(agent-manager): add user-defined sections for organizing worktrees (#8225) (Marius, 2026-04-08)
- 850826a2b - fix(cli): align /local-review diff with agent manager diff viewer (#8574) (Marius, 2026-04-08)
- 60c91b511 - fix(vscode): dispose git processes on panel close to prevent orphans on Windows (#8572) (Marius, 2026-04-08)
- fb5d85e2e - fix(cli): make 'kilo help' show same output as 'kilo -h' (Alex Alecu, 2026-04-08)
- 13c46741b - Merge pull request #8567 from Kilo-Org/feat/vscode-model-search-fuzzy (Mark IJbema, 2026-04-08)
- be5dc8581 - Merge branch 'main' into feat/vscode-model-search-fuzzy (Mark IJbema, 2026-04-08)
- d771f29a6 - refactor(vscode): extract search matching into testable utility (Mark IJbema, 2026-04-08)
- 4b1e81b11 - fix(vscode): use word-boundary matching instead of fuzzy match in model selector (Mark IJbema, 2026-04-08)
- 832730088 - Merge remote-tracking branch 'origin/main' into feat/help-all-command (Alex Alecu, 2026-04-08)
- f383210b8 - Merge pull request #8473 from Kilo-Org/fix/cli-config-resilience (Marian Alexandru Alecu, 2026-04-08)
- a0a1ffa74 - Merge branch 'main' into feat/help-all-command (Alex Alecu, 2026-04-08)
- 7ecc07639 - fix(cli): restore native --help for subcommands (Alex Alecu, 2026-04-08)
- 9dd44993e - fix(vscode): trim whitespace-only search queries in model selector (Mark IJbema, 2026-04-08)
- 83e8bbef8 - Merge remote-tracking branch 'origin/main' into fix/cli-config-resilience (Alex Alecu, 2026-04-08)
- e3bade831 - Merge pull request #8474 from Kilo-Org/docs/kilo-config-legacy-paths (Marian Alexandru Alecu, 2026-04-08)
- 49cabd99c - feat(agent-manager): add expand/collapse all button to inline diff panel (#8562) (Marius, 2026-04-08)
- 0a2c10956 - style(cli): add kilocode markers on mode block (Alex Alecu, 2026-04-08)
- cef00b9df - style(cli): add kilocode markers on agent block (Alex Alecu, 2026-04-08)
- b5c756ef7 - style(cli): add kilocode markers on command block (Alex Alecu, 2026-04-08)
- e0e116e9c - docs(cli): add workflows section (Alex Alecu, 2026-04-08)
- bb8b807df - docs(cli): add KILO_CONFIG_DIR to command paths (Alex Alecu, 2026-04-08)
- b87149869 - style(cli): add kilocode markers in toast (Alex Alecu, 2026-04-08)
- cf1a12099 - test(cli): add sync check for commands.ts vs index.ts (Alex Alecu, 2026-04-08)
- d815b2118 - feat(vscode): add fuzzy search to model selector (kiloconnect[bot], 2026-04-08)
- 89e61c6e6 - fix(cli): disable built-in help command to allow kilo help --all to work (Alex Alecu, 2026-04-08)
- 1922952c5 - Merge pull request #7552 from thomasboom/docs/updated-models-mentioned (Mark IJbema, 2026-04-08)
- 634cec88b - fix(vscode): show stop button during rate limit retry state (#8552) (Marius, 2026-04-08)
- c9e818850 - Merge pull request #8561 from Kilo-Org/recover/pr-7981 (Mark IJbema, 2026-04-08)
- f3dee356a - fix(vscode): add missing uk translation for tryModelGeneric (kiloconnect[bot], 2026-04-08)
- ae11d9dec - Merge pull request #8560 from Kilo-Org/recover/pr-7720 (Mark IJbema, 2026-04-08)
- de9d4f586 - Merge branch 'main' into docs/updated-models-mentioned (Thomas Boom, 2026-04-08)
- 17b2355a2 - fix(vscode): fall back to generic "Try Model" for long model names (kiloconnect[bot], 2026-04-08)
- 9e13f71a7 - fix(i18n): clarify built-in mode banner to avoid read-only confusion (kiloconnect[bot], 2026-04-08)
- 063c3c6e1 - Merge pull request #8553 from Kilo-Org/feat/rules-open-file-icon (Mark IJbema, 2026-04-08)
- 32c442497 - fix(vscode): use pencil-line icon for edit action in Rules tab (kiloconnect[bot], 2026-04-08)
- 60bfeaf63 - feat(agent-manager): sync worktree branch from git worktree list (#8534) (Marius, 2026-04-08)
- 6106b1275 - feat(vscode): add open-in-editor icon to instruction files in Rules tab (kiloconnect[bot], 2026-04-08)
- 6b3dd8ce2 - docs(kilo-docs): document ask and deny permission levels for MCP tools (Josh Lambert, 2026-04-08)
- e5349dc7e - Revert "fix: pin framer-motion to 12.34.5 to match motion-dom@12.34.3" (kirillk, 2026-04-07)
- b2d695cbe - Merge branch 'main' into caring-columnist (Kirill Kalishev, 2026-04-07)
- 1595eba59 - feat(cli): track remote connection opened event in PostHog (Evgeny Shurakov, 2026-04-07)
- 971f4042d - fix: pin framer-motion to 12.34.5 to match motion-dom@12.34.3 (kirillk, 2026-04-07)
- c112ce63d - Merge branch 'main' into caring-columnist (Kirill Kalishev, 2026-04-07)
- c86e36e07 - perf(vscode): replace webview polling with extensionDataReady signal (kirillk, 2026-04-07)
- c31cc4dbd - perf(cli): parallelize Kilo + Apertis model fetches in ModelsDev.get() (kirillk, 2026-04-07)
- 37c63e0f8 - fix(cli): drop explicit CommandModule type from commands array to fix typecheck (Mark IJbema, 2026-04-07)
- 6690370fa - fix(cli): add completion command to commands array for help --all and cli-reference (Mark IJbema, 2026-04-07)
- a03a572d2 - Merge remote-tracking branch 'origin/main' into feat/help-all-command (Mark IJbema, 2026-04-07)
- a84a65d70 - Merge branch 'main' into mark/reimplement-mcp-removal (Mark IJbema, 2026-04-07)
- 7901bb624 - fix: minimize index.ts diff, remove spurious changes (kiloconnect[bot], 2026-04-07)
- 2ca954225 - fix(cli): guard session import in config error handlers (Alex Alecu, 2026-04-07)
- 5d184aba9 - style(cli): fix kilocode_change markers (Alex Alecu, 2026-04-07)
- 0de8282c0 - style(vscode): remove kilocode_change markers (Alex Alecu, 2026-04-07)
- f0a30751b - fix(cli): let managed config errors propagate (Alex Alecu, 2026-04-07)
- 5accaead1 - fix(cli): include detail in validation error (Alex Alecu, 2026-04-07)
- 44df3a0dc - refactor: move commands barrel to kilocode/, restore index.ts upstream-style chain (kiloconnect[bot], 2026-04-07)
- 770887e96 - fix(cli): improve config warning UX across CLI, TUI, and VS Code (Alex Alecu, 2026-04-07)
- 8fff17c46 - chore: remove specs files (kiloconnect[bot], 2026-04-07)
- ba7480d52 - docs: explain why commands.ts barrel exists (kiloconnect[bot], 2026-04-07)
- dd53394db - chore: mark auto-generated CLI reference docs as linguist-generated (kiloconnect[bot], 2026-04-07)
- f9820cebd - fix: add RemoteCommand to barrel, recursive subcommands, include $0 commands in help --all (kiloconnect[bot], 2026-04-07)
- f0118047e - feat(cli): add config warnings endpoint and surface errors to TUI/extension (Alex Alecu, 2026-04-07)
- fe74b6bea - chore: merge origin/main into feat/help-all-command, resolve conflict in index.ts (kiloconnect[bot], 2026-04-07)
- 48e533b15 - Merge branch 'main' into docs/updated-models-mentioned (Thomas Boom, 2026-04-07)
- 27057648d - docs(cli): add CONTEXT.md to instructions list (Alex Alecu, 2026-04-07)
- 5a9520d3f - docs(cli): add KILO_CONFIG_DIR to command lookup (Alex Alecu, 2026-04-07)
- eb1494f12 - docs(cli): widen KILO_DISABLE_PROJECT_CONFIG desc (Alex Alecu, 2026-04-07)
- b86265102 - docs(cli): list all managed config files (Alex Alecu, 2026-04-07)
- 2302f7f67 - docs(cli): fix instructions auto-discovery list (Alex Alecu, 2026-04-07)
- 6a91d2a6a - docs(cli): add missing opencode.jsonc to global paths (Alex Alecu, 2026-04-07)
- cafccaf68 - fix(cli): add named-command lookup guidance to kilo-config skill (Alex Alecu, 2026-04-07)
- 6a7c296d3 - fix(cli): widen kilo-config skill to cover path location questions (Alex Alecu, 2026-04-07)
- f2dea0a67 - docs(cli): add legacy paths to kilo-config skill (Alex Alecu, 2026-04-07)
- 6a4df6669 - fix(cli): correct misleading config hint (Alex Alecu, 2026-04-07)
- c4ebdb8a9 - fix(cli): check session ownership on requestID (Alex Alecu, 2026-04-07)
- 99da10cba - fix(cli): read allow-everything state from config instead of local KV store (Alex Alecu, 2026-04-07)
- a8a2e3b87 - fix(cli): surface schema validation errors to user (Alex Alecu, 2026-04-07)
- 6c98dd062 - fix(cli): remove unscoped session.error publish (Alex Alecu, 2026-04-07)
- 436536497 - Merge remote-tracking branch 'origin/main' into feat/allow-everything (Alex Alecu, 2026-04-07)
- e3a5b6905 - fix(cli): skip invalid agent/command configs instead of crashing (Alex Alecu, 2026-04-07)
- 9cafa6f8b - test(cli): add regression tests for config resilience (Alex Alecu, 2026-04-07)
- 4e24bc63c - fix(cli): keep the auto-approve toggle in sync (Alex Alecu, 2026-04-06)
- 4de08a102 - fix(cli): disable allow-all in the requested scope (Alex Alecu, 2026-04-06)
- 6d27af682 - fix(cli): scope allow-all approvals to the active session (Alex Alecu, 2026-04-06)
- edc4060f8 - fix(cli): keep auto-approve in the command palette (Alex Alecu, 2026-04-06)
- 1efd4edef - Merge branch 'main' into feat/local-recall-tool (Marian Alexandru Alecu, 2026-04-06)
- 6ad2e7a39 - fix(cli): add 2-minute default request timeout for provider requests (Alex Alecu, 2026-04-06)
- 125ca4b13 - fix(cli): show offline prompt for provider connection failures (Alex Alecu, 2026-04-06)
- 3822fc813 - Merge branch 'main' into docs/updated-models-mentioned (Thomas Boom, 2026-04-06)
- a7ea80f1b - fix(cli): strengthen Ask mode prompt with supersedes language (kiloconnect[bot], 2026-04-04)
- 2b900fe1a - fix(sdk): restore gen/client and gen/core from main, hand-edit types and sdk (Alex Alecu, 2026-04-04)
- 8fbe4295a - fix(sdk): minimize openapi.json diff by preserving base formatting (Alex Alecu, 2026-04-04)
- d5c7a38d5 - Merge branch 'kilocode-cli-resume-after-sleep' of https://github.com/Kilo-Org/kilocode into kilocode-cli-resume-after-sleep (Alex Alecu, 2026-04-04)
- 0b423a35e - feat(cli): detect network restoration and notify user to resume (Alex Alecu, 2026-04-04)
- 0d2a81d8b - Merge branch 'main' into kilocode-cli-resume-after-sleep (Marian Alexandru Alecu, 2026-04-04)
- 8e30cc12a - fix(cli): catch abort during offline network wait in processor (Alex Alecu, 2026-04-04)
- 0c3c233b9 - fix: include sibling worktree sessions when project ids drift (Alex Alecu, 2026-04-03)
- 663baf976 - fix(cli): remove worktree labels from session picker (Alex Alecu, 2026-04-03)
- c56532575 - fix(cli): skip asked after abort (Alex Alecu, 2026-04-03)
- b0ea7da02 - fix(cli): reset retry on busy (Alex Alecu, 2026-04-03)
- 5ddd2167f - fix: scope recall sessions to project worktrees (Alex Alecu, 2026-04-03)
- b5eaea2da - Merge remote-tracking branch 'origin/main' into kilocode-cli-resume-after-sleep (Alex Alecu, 2026-04-03)
- e9fbf6b72 - fix(cli): require recall permission prompts (Alex Alecu, 2026-04-03)
- dd571e4b8 - fix(cli): read full recall (Alex Alecu, 2026-04-03)
- 29ec6e401 - fix(cli): block cross project open (Alex Alecu, 2026-04-03)
- 75231b325 - fix(cli): gate recall search (Alex Alecu, 2026-04-03)
- 8bb6d0f9e - Merge branch 'main' into feat/local-recall-tool (Marian Alexandru Alecu, 2026-04-03)
- afa1ab028 - fix(vscode): remove MCPs from legacy config files on deletion (Mark IJbema, 2026-04-02)
- 5a93d1db2 - refactor(vscode): extract shared marketplace removal helpers (Mark IJbema, 2026-04-02)
- 935e29c37 - fix(vscode): always remove from both scopes in handleRemoveMode/Mcp (Mark IJbema, 2026-04-02)
- 6ca068233 - fix(vscode): use invalidateAfterMarketplaceChange in handleRemoveMode (Mark IJbema, 2026-04-02)
- 4d5f04303 - feat(vscode): reimplement MCP removal in agent behaviour settings (Mark IJbema, 2026-04-02)
- 4db6cfc22 - feat(vscode): disable MCP removal in agent behaviour settings (kiloconnect[bot], 2026-04-02)
- 7d3f29953 - fix(cli): show repo roots in global session list (Alex Alecu, 2026-04-02)
- 117479cce - fix(cli): always register local recall tool (Alex Alecu, 2026-04-02)
- 2e1ff4a48 - fix(cli): address review findings for recall tool (Alex Alecu, 2026-04-02)
- 93ce148f3 - feat(cli): add kilo_local_recall tool and cross-project session search (Alex Alecu, 2026-04-02)
- 0cf7135a6 - fix(cli): push wildcard to approved for session-scoped allow-all (Alex Alecu, 2026-03-27)
- 0bdcbfa1b - Merge remote-tracking branch 'origin/main' into feat/allow-everything (Alex Alecu, 2026-03-27)
- 6ee80e1d9 - chore(sdk): regenerate SDK for allow-everything endpoint (Alex Alecu, 2026-03-27)
- 54ecd4ade - feat(cli): add allow everything toggle to command palette (Alex Alecu, 2026-03-27)
- 338a7b961 - feat(cli): add 'Allow everything' stage to TUI permission prompt (Alex Alecu, 2026-03-27)
- 47d008c5d - feat(cli): add POST /allow-everything server route (Alex Alecu, 2026-03-27)
- aaab05a6b - feat(cli): add allowEverything function and pending accessor to PermissionNext (Alex Alecu, 2026-03-27)
- ef0a45ce4 - fix(cli): publish rejected event on abort (Alex Alecu, 2026-03-26)
- f7be6789e - fix(cli): reset retry counter on success (Alex Alecu, 2026-03-26)
- 3120a941c - fix(cli): mark failed mcp on reconnect error (Alex Alecu, 2026-03-26)
- 184ae09b7 - fix(cli): validate model.json with Zod schema in plan-followup (Alex Alecu, 2026-03-26)
- 2c3415379 - fix(cli): handle promise rejections in TUI network reply/reject (Alex Alecu, 2026-03-26)
- a54777be7 - fix(cli): clean up network store entries when evicting session (Alex Alecu, 2026-03-26)
- f5373f398 - fix(cli): use Promise.allSettled in reconnectRemote (Alex Alecu, 2026-03-26)
- 86f19e9cb - fix(ui): reset lastScrollTop when scroll element changes (Alex Alecu, 2026-03-26)
- 2fcb24d8c - fix(cli): log MCP reconnect errors and remove shouldPrompt wrapper (Alex Alecu, 2026-03-26)
- be8a5c853 - fix(cli): add retry limit and backoff for network prompts in kilo run (Alex Alecu, 2026-03-26)
- 33a63b216 - fix(cli): re-throw non-RejectedError and remove else block in processor (Alex Alecu, 2026-03-26)
- 4fc67f11e - fix(cli): remove dead ECONNRESET case and deduplicate error mapping (Alex Alecu, 2026-03-26)
- d96c33806 - style(vscode): fix prettier formatting in PopupSelector (Alex Alecu, 2026-03-26)
- 9d996fc64 - Merge branch 'main' into kilocode-cli-resume-after-sleep (Marian Alexandru Alecu, 2026-03-26)
- f0d569953 - Merge branch 'main' into kilocode-cli-resume-after-sleep (Marian Alexandru Alecu, 2026-03-26)
- 6be272681 - fix(cli): move /remote before workspace middleware (Alex Alecu, 2026-03-26)
- c383133c1 - fix(cli): add backoff before headless resume (Alex Alecu, 2026-03-26)
- afcc32552 - fix(cli): break loop on reject (Alex Alecu, 2026-03-26)
- 106095b31 - fix(cli): prompt on all network errors (Alex Alecu, 2026-03-26)
- c80794faa - chore: remove plan file from PR (Alex Alecu, 2026-03-26)
- ecc7612dd - Merge branch 'main' into kilocode-cli-resume-after-sleep (Marian Alexandru Alecu, 2026-03-26)
- 04373d730 - feat(cli): pause and resume sessions on network errors (Alex Alecu, 2026-03-25)
- 22b91155c - Merge branch 'main' into fix-docs-theme-toggle-icons-15391880175080747059 (Joshua Lambert, 2026-03-25)
- dfeb7bf72 - Update bonus credits and AI model versions in README (Thomas Boom, 2026-03-24)
- 7e41e2cbc - remove references to 'kilo web' in documentation (Justin Chong, 2026-03-14)
- fd8325814 - Merge pull request #1 from shantoislamdev/feat-update-moon-icon-4285903464193194226 (Shanto Islam, 2026-03-14)
- cee892d63 - chore: Update MoonIcon to match standard crescent outline (shantoislamdev, 2026-03-14)
- f2d1c13ea - refactor(docs): replace emoji theme toggle icons with consistent SVG icons (shantoislamdev, 2026-03-14)
- eb1b85c1a - Merge branch 'main' into fix/windows-plugin-display (Jilaz, 2026-03-11)
- b9a6473e6 - fix: resolve Windows plugin display name showing path instead of name (Jilaz, 2026-03-11)
- d0c1bd267 - fix: handle bedrock claude custom inference profile ARNs (0xCybin, 2026-03-07)
- 98c2335cf - fix: apply empty-text content filtering to Bedrock Claude models (0xCybin, 2026-03-07)
- 4d85e52d2 - Merge branch 'Kilo-Org:main' into session/agent_58776529-50a0-40ff-9d78-3f2f7e4d28b6 (Arav Jain, 2026-03-01)
- 7a72a65e1 - chore: regenerate CLI docs to include kilo db command (matt wilkie, 2026-02-28)
- 1e8de6262 - fix: remove empty openapi.json artifact, add DbCommand to test fixture (matt wilkie, 2026-02-28)
- 5a29c2399 - fix: address bot review concerns (matt wilkie, 2026-02-28)
- 3a81e1315 - Merge branch 'main' into feat/help-all-command (matt wilkie, 2026-02-28)
- 594cc26fc - fix: remove invalid ResolveMessage import and fix cli-reference link path (matt wilkie, 2026-02-27)
- c6c8e4057 - Merge upstream/main into feat/help-all-command; add DbCommand and WorkspaceServeCommand (matt wilkie, 2026-02-27)
- 6b0c5170f - Merge branch 'Kilo-Org:main' into session/agent_58776529-50a0-40ff-9d78-3f2f7e4d28b6 (Arav Jain, 2026-02-27)
- 2df8789be - fix: add flexShrink={0} to prompt border box to prevent shrinking (kiloconnect[bot], 2026-02-27)
- 0460b450d - Merge remote-tracking branch 'origin/main' into feat/help-all-command (matt wilkie, 2026-02-26)
- 246ced859 - fix: address review — skip undescribed commands, rename ambiguous var, remove marker (maphew, 2026-02-22)
- 81b1904ba - fix: address review — await rejects, gate options.all, sanitize cwd, add AttachStub (maphew, 2026-02-21)
- 469f89388 - feat: auto-generate CLI reference docs from help.ts (maphew, 2026-02-21)
- faecb4a71 - fix: address review — log catch block, document yargs version dependency (maphew, 2026-02-21)
- 71669e6da - the plan for implementing help --all cmd (maphew, 2026-02-21)
- 8b367c5b8 - feat: add kilo help --all command for full CLI reference in markdown or text (maphew, 2026-02-21)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/edit.ts` (+30, -13)
- `packages/opencode/src/tool/recall.ts` (+150, -0)
- `packages/opencode/src/tool/recall.txt` (+12, -0)
- `packages/opencode/src/tool/registry.ts` (+4, -2)
- `packages/opencode/src/tool/task.ts` (+8, -12)
- `packages/opencode/src/tool/warpgrep.ts` (+3, -8)
- `packages/opencode/src/tool/write.ts` (+5, -1)
- `packages/opencode/test/tool/recall.test.ts` (+148, -0)
- `packages/opencode/test/tool/skill.test.ts` (+32, -0)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+1, -0)
- `packages/opencode/src/agent/prompt/ask.txt` (+3, -0)

#### Permission System (**/permission/)
- `packages/opencode/src/kilocode/permission/routes.ts` (+78, -0)
- `packages/opencode/src/permission/next.ts` (+62, -1)
- `packages/opencode/test/permission/next.test.ts` (+55, -0)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/CompletionProvider.ts` (+0, -272)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/MinimalConfig.ts` (+0, -126)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/classification/shouldCompleteMultiline.ts` (+0, -37)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/context/root-path-context/__fixtures__/files/typescript/arrowFunctions.ts` (+0, -29)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/context/root-path-context/__fixtures__/files/typescript/classMethods.ts` (+0, -35)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/context/root-path-context/__fixtures__/files/typescript/classes.ts` (+0, -9)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/context/root-path-context/__fixtures__/files/typescript/functions.ts` (+0, -33)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/context/root-path-context/__fixtures__/files/typescript/generators.ts` (+0, -33)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/context/root-path-context/__test-cases__/python.ts` (+0, -95)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/streamTransforms/StreamTransformPipeline.ts` (+0, -82)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/streamTransforms/charStream.test.ts` (+0, -192)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/streamTransforms/charStream.ts` (+0, -96)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/streamTransforms/lineStream.ts` (+1, -52)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/test/NEGATIVE_TEST_CASES/QWEN_JSON.txt` (+0, -60)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/test/NEGATIVE_TEST_CASES/QWEN_TYPESCRIPT.txt` (+0, -128)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/test/NEGATIVE_TEST_CASES/STARCODER_JSON.txt` (+0, -20)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/test/NEGATIVE_TEST_CASES/STARCODER_PYTHON.TXT` (+0, -29)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/test/NEGATIVE_TEST_CASES/STARCODER_RUBY.TXT` (+0, -41)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/test/NEGATIVE_TEST_CASES/STARCODER_RUST.TXT` (+0, -73)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/test/filter.test.ts` (+0, -37)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/test/testCases.ts` (+0, -2175)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/test/util.ts` (+0, -81)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/generation/CompletionStreamer.ts` (+0, -79)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/generation/GeneratorReuseManager.test.ts` (+0, -208)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/generation/GeneratorReuseManager.ts` (+0, -70)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/generation/ListenableGenerator.test.ts` (+0, -148)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/generation/ListenableGenerator.ts` (+0, -84)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/generation/utils.test.ts` (+0, -126)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/generation/utils.ts` (+0, -25)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/prefiltering/index.ts` (+0, -57)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/templating/__tests__/renderPrompt.test.ts` (+0, -262)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/templating/formatting.ts` (+0, -90)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/templating/getStopTokens.ts` (+0, -28)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/templating/index.ts` (+0, -205)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/util/AutocompleteDebouncer.ts` (+0, -32)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/util/AutocompleteLoggingService.ts` (+0, -93)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/util/AutocompleteLruCacheInMem.test.ts` (+0, -247)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/util/AutocompleteLruCacheInMem.ts` (+0, -77)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/util/completionTestUtils.test.ts` (+0, -63)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/util/completionTestUtils.ts` (+0, -94)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/util/processSingleLineCompletion.test.ts` (+0, -96)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/util/processSingleLineCompletion.ts` (+0, -80)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/util/types.ts` (+2, -23)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/diff/myers.test.ts` (+0, -634)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/diff/myers.ts` (+0, -204)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/diff/streamDiff.test.ts` (+0, -317)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/diff/streamDiff.ts` (+0, -76)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/diff/util.ts` (+1, -94)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/fetch/stream.ts` (+0, -138)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/llm/constants.ts` (+0, -10)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/llm/countTokens.ts` (+11, -222)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/llm/index.ts` (+0, -664)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/llm/llms/Mock.ts` (+0, -66)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/llm/messages.ts` (+0, -31)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/llm/model-info/index.ts` (+0, -22)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/llm/model-info/providers/openai.ts` (+0, -139)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/llm/model-info/types.ts` (+0, -58)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/llm/openaiTypeConverters.ts` (+0, -108)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/llm/templates/edit.ts` (+0, -253)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/llm/templates/edit/gpt.ts` (+0, -72)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/test/FakeConfigHandler.ts` (+0, -87)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/test/FakeIDE.ts` (+0, -150)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/test/fixtures.ts` (+0, -4)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/test/testDir.ts` (+1, -31)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/test/vitest.global-setup.ts` (+0, -11)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/test/vitest.setup.ts` (+0, -11)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/util/CodeRenderer.ts` (+0, -34)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/util/TokensBatchingService.ts` (+0, -82)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/util/index.ts` (+0, -51)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/util/logger.ts` (+0, -35)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/util/merge.ts` (+0, -58)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/util/parameters.ts` (+1, -3)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/util/paths.ts` (+0, -34)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/util/uri.ts` (+0, -24)

#### Other Changes
- `.gitattributes` (+4, -0)
- `.github/workflows/publish.yml` (+3, -1)
- `AGENTS.md` (+18, -0)
- `CONTRIBUTING.md` (+0, -2)
- `README.md` (+2, -2)
- `bun.lock` (+17, -17)
- `package.json` (+1, -1)
- `packages/app/package.json` (+1, -1)
- `packages/desktop-electron/package.json` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/kilo-docs/components/ThemeToggle.tsx` (+69, -10)
- `packages/kilo-docs/lib/nav/code-with-ai.ts` (+5, -5)
- `packages/kilo-docs/mappingplan.md` (+0, -1)
- `packages/kilo-docs/markdoc/partials/cli-commands-table.md` (+25, -0)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/ai-providers/lmstudio.md` (+4, -2)
- `packages/kilo-docs/pages/automate/agent-manager.md` (+11, -0)
- `packages/kilo-docs/pages/automate/mcp/overview.md` (+2, -0)
- `packages/kilo-docs/pages/automate/mcp/using-in-cli.md` (+6, -0)
- `packages/kilo-docs/pages/code-with-ai/agents/auto-model.md` (+13, -56)
- `packages/kilo-docs/pages/code-with-ai/agents/free-and-budget-models.md` (+0, -290)
- `packages/kilo-docs/pages/code-with-ai/index.md` (+0, -1)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli-reference.md` (+816, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli.md` (+47, -26)
- `packages/kilo-docs/pages/code-with-ai/platforms/cloud-agent.md` (+27, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/vscode/whats-new.md` (+7, -1)
- `packages/kilo-docs/pages/contributing/architecture/auto-model-tiers.md` (+9, -9)
- `packages/kilo-docs/pages/gateway/models-and-providers.md` (+4, -4)
- `packages/kilo-docs/pages/getting-started/settings/auto-approving-actions.md` (+12, -0)
- `packages/kilo-docs/pages/getting-started/using-kilo-for-free.md` (+39, -54)
- `packages/kilo-docs/pages/kiloclaw/chat-platforms/slack.md` (+1, -4)
- `packages/kilo-docs/previous-docs-redirects.js` (+7, -1)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-telemetry/src/events.ts` (+3, -0)
- `packages/kilo-telemetry/src/telemetry.ts` (+5, -0)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/diff.tsx` (+19, -0)
- `packages/kilo-ui/src/components/message-part.css` (+12, -0)
- `packages/kilo-ui/src/components/message-part.tsx` (+78, -9)
- `packages/kilo-ui/src/hooks/create-auto-scroll.tsx` (+1, -0)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-messagepart/with-reasoning-expanded-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/docs/features/file-attachments.md` (+13, -0)
- `packages/kilo-vscode/esbuild.js` (+12, -1)
- `packages/kilo-vscode/eslint.config.mjs` (+66, -3)
- `packages/kilo-vscode/knip.json` (+1, -1)
- `packages/kilo-vscode/package.json` (+12, -1)
- `packages/kilo-vscode/src/DiffViewerProvider.ts` (+1, -0)
- `packages/kilo-vscode/src/DiffVirtualProvider.ts` (+107, -0)
- `packages/kilo-vscode/src/KiloProvider.ts` (+265, -80)
- `packages/kilo-vscode/src/SettingsEditorProvider.ts` (+13, -0)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+133, -20)
- `packages/kilo-vscode/src/agent-manager/GitOps.ts` (+119, -31)
- `packages/kilo-vscode/src/agent-manager/GitStatsPoller.ts` (+19, -6)
- `packages/kilo-vscode/src/agent-manager/PRStatusPoller.ts` (+93, -11)
- `packages/kilo-vscode/src/agent-manager/WorktreeManager.ts` (+9, -0)
- `packages/kilo-vscode/src/agent-manager/WorktreeStateManager.ts` (+224, -13)
- `packages/kilo-vscode/src/agent-manager/git-import.ts` (+2, -1)
- `packages/kilo-vscode/src/agent-manager/host.ts` (+2, -0)
- `packages/kilo-vscode/src/agent-manager/pr-status-bridge.ts` (+4, -0)
- `packages/kilo-vscode/src/agent-manager/section-handler.ts` (+21, -0)
- `packages/kilo-vscode/src/agent-manager/semaphore.ts` (+41, -0)
- `packages/kilo-vscode/src/agent-manager/task-runner.ts` (+10, -1)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+86, -1)
- `packages/kilo-vscode/src/agent-manager/vscode-host.ts` (+11, -0)
- `packages/kilo-vscode/src/extension.ts` (+43, -2)
- `packages/kilo-vscode/src/kilo-provider/slim-metadata.ts` (+17, -1)
- `packages/kilo-vscode/src/kilo-provider/task-session.ts` (+17, -0)
- `packages/kilo-vscode/src/services/RemoteStatusService.ts` (+130, -0)
- `packages/kilo-vscode/src/services/autocomplete/chat-autocomplete/ChatTextAreaAutocomplete.ts` (+11, -2)
- `packages/kilo-vscode/src/services/autocomplete/chat-autocomplete/handleChatCompletionAccepted.ts` (+0, -29)
- `packages/kilo-vscode/src/services/autocomplete/chat-autocomplete/handleChatCompletionRequest.ts` (+0, -43)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/API_REFERENCE.md` (+0, -807)
- `packages/kilo-vscode/src/services/autocomplete/docs/TRANSPLANT-PLAN.md` (+0, -761)
- `packages/kilo-vscode/src/services/autocomplete/docs/investigation-external-imports.md` (+0, -409)
- `packages/kilo-vscode/src/services/autocomplete/docs/investigation-internal-architecture.md` (+0, -456)
- `packages/kilo-vscode/src/services/autocomplete/docs/investigation-vscode-integration.md` (+0, -412)
- `packages/kilo-vscode/src/services/autocomplete/i18n/ar.ts` (+0, -49)
- `packages/kilo-vscode/src/services/autocomplete/i18n/ca.ts` (+0, -49)
- `packages/kilo-vscode/src/services/autocomplete/i18n/cs.ts` (+0, -49)
- `packages/kilo-vscode/src/services/autocomplete/i18n/de.ts` (+0, -50)
- `packages/kilo-vscode/src/services/autocomplete/i18n/es.ts` (+0, -49)
- `packages/kilo-vscode/src/services/autocomplete/i18n/fr.ts` (+0, -49)
- `packages/kilo-vscode/src/services/autocomplete/i18n/hi.ts` (+0, -50)
- `packages/kilo-vscode/src/services/autocomplete/i18n/id.ts` (+0, -50)
- `packages/kilo-vscode/src/services/autocomplete/i18n/it.ts` (+0, -49)
- `packages/kilo-vscode/src/services/autocomplete/i18n/ja.ts` (+0, -49)
- `packages/kilo-vscode/src/services/autocomplete/i18n/ko.ts` (+0, -48)
- `packages/kilo-vscode/src/services/autocomplete/i18n/nl.ts` (+0, -50)
- `packages/kilo-vscode/src/services/autocomplete/i18n/package-nls-ar.ts` (+0, -13)
- `packages/kilo-vscode/src/services/autocomplete/i18n/package-nls-ca.ts` (+0, -13)
- `packages/kilo-vscode/src/services/autocomplete/i18n/package-nls-cs.ts` (+0, -13)
- `packages/kilo-vscode/src/services/autocomplete/i18n/package-nls-de.ts` (+0, -13)
- `packages/kilo-vscode/src/services/autocomplete/i18n/package-nls-en.ts` (+0, -14)
- `packages/kilo-vscode/src/services/autocomplete/i18n/package-nls-es.ts` (+0, -13)
- `packages/kilo-vscode/src/services/autocomplete/i18n/package-nls-fr.ts` (+0, -13)
- `packages/kilo-vscode/src/services/autocomplete/i18n/package-nls-hi.ts` (+0, -13)
- `packages/kilo-vscode/src/services/autocomplete/i18n/package-nls-id.ts` (+0, -13)
- `packages/kilo-vscode/src/services/autocomplete/i18n/package-nls-it.ts` (+0, -13)
- `packages/kilo-vscode/src/services/autocomplete/i18n/package-nls-ja.ts` (+0, -13)
- `packages/kilo-vscode/src/services/autocomplete/i18n/package-nls-ko.ts` (+0, -13)
- `packages/kilo-vscode/src/services/autocomplete/i18n/package-nls-nl.ts` (+0, -13)
- `packages/kilo-vscode/src/services/autocomplete/i18n/package-nls-pl.ts` (+0, -13)
- `packages/kilo-vscode/src/services/autocomplete/i18n/package-nls-pt-BR.ts` (+0, -13)
- `packages/kilo-vscode/src/services/autocomplete/i18n/package-nls-ru.ts` (+0, -13)
- `packages/kilo-vscode/src/services/autocomplete/i18n/package-nls-sk.ts` (+0, -13)
- `packages/kilo-vscode/src/services/autocomplete/i18n/package-nls-th.ts` (+0, -13)
- `packages/kilo-vscode/src/services/autocomplete/i18n/package-nls-tr.ts` (+0, -13)
- `packages/kilo-vscode/src/services/autocomplete/i18n/package-nls-uk.ts` (+0, -13)
- `packages/kilo-vscode/src/services/autocomplete/i18n/package-nls-vi.ts` (+0, -13)
- `packages/kilo-vscode/src/services/autocomplete/i18n/package-nls-zh-CN.ts` (+0, -13)
- `packages/kilo-vscode/src/services/autocomplete/i18n/package-nls-zh-TW.ts` (+0, -13)
- `packages/kilo-vscode/src/services/autocomplete/i18n/pl.ts` (+0, -49)
- `packages/kilo-vscode/src/services/autocomplete/i18n/pt-BR.ts` (+0, -48)
- `packages/kilo-vscode/src/services/autocomplete/i18n/ru.ts` (+0, -50)
- `packages/kilo-vscode/src/services/autocomplete/i18n/sk.ts` (+0, -49)
- `packages/kilo-vscode/src/services/autocomplete/i18n/th.ts` (+0, -49)
- `packages/kilo-vscode/src/services/autocomplete/i18n/tr.ts` (+0, -50)
- `packages/kilo-vscode/src/services/autocomplete/i18n/uk.ts` (+0, -49)
- `packages/kilo-vscode/src/services/autocomplete/i18n/vi.ts` (+0, -50)
- `packages/kilo-vscode/src/services/autocomplete/i18n/zh-CN.ts` (+0, -47)
- `packages/kilo-vscode/src/services/autocomplete/i18n/zh-TW.ts` (+0, -47)
- `packages/kilo-vscode/src/services/autocomplete/types.ts` (+5, -67)
- `packages/kilo-vscode/src/services/cli-backend/connection-service.ts` (+86, -0)
- `packages/kilo-vscode/src/services/cli-backend/i18n/ar.ts` (+2, -0)
- `packages/kilo-vscode/src/services/cli-backend/i18n/br.ts` (+2, -0)
- `packages/kilo-vscode/src/services/cli-backend/i18n/bs.ts` (+2, -0)
- `packages/kilo-vscode/src/services/cli-backend/i18n/da.ts` (+2, -0)
- `packages/kilo-vscode/src/services/cli-backend/i18n/de.ts` (+2, -0)
- `packages/kilo-vscode/src/services/cli-backend/i18n/en.ts` (+2, -0)
- `packages/kilo-vscode/src/services/cli-backend/i18n/es.ts` (+2, -0)
- `packages/kilo-vscode/src/services/cli-backend/i18n/fr.ts` (+2, -0)
- `packages/kilo-vscode/src/services/cli-backend/i18n/ja.ts` (+2, -0)
- `packages/kilo-vscode/src/services/cli-backend/i18n/ko.ts` (+2, -0)
- `packages/kilo-vscode/src/services/cli-backend/i18n/nl.ts` (+2, -0)
- `packages/kilo-vscode/src/services/cli-backend/i18n/no.ts` (+2, -0)
- `packages/kilo-vscode/src/services/cli-backend/i18n/pl.ts` (+2, -0)
- `packages/kilo-vscode/src/services/cli-backend/i18n/ru.ts` (+2, -0)
- `packages/kilo-vscode/src/services/cli-backend/i18n/th.ts` (+2, -0)
- `packages/kilo-vscode/src/services/cli-backend/i18n/tr.ts` (+2, -0)
- `packages/kilo-vscode/src/services/cli-backend/i18n/uk.ts` (+2, -0)
- `packages/kilo-vscode/src/services/cli-backend/i18n/zh.ts` (+2, -0)
- `packages/kilo-vscode/src/services/cli-backend/i18n/zht.ts` (+2, -0)
- `packages/kilo-vscode/tests/setup/vscode-mock.ts` (+13, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+6, -2)
- `packages/kilo-vscode/tests/unit/git-ops.test.ts` (+117, -2)
- `packages/kilo-vscode/tests/unit/git-stats-poller.test.ts` (+62, -7)
- `packages/kilo-vscode/tests/unit/navigate.test.ts` (+103, -1)
- `packages/kilo-vscode/tests/unit/remote-status-service.test.ts` (+301, -0)
- `packages/kilo-vscode/tests/unit/search-match.test.ts` (+200, -0)
- `packages/kilo-vscode/tests/unit/section-helpers.test.ts` (+247, -0)
- `packages/kilo-vscode/tests/unit/semaphore.test.ts` (+102, -0)
- `packages/kilo-vscode/tests/unit/session-agent.test.ts` (+23, -5)
- `packages/kilo-vscode/tests/unit/session-utils.test.ts` (+43, -0)
- `packages/kilo-vscode/tests/unit/task-session.test.ts` (+27, -0)
- `packages/kilo-vscode/tests/unit/worktree-state-manager.test.ts` (+45, -17)
- `packages/kilo-vscode/tests/unit/worktree-state-sections.test.ts` (+324, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts` (+1, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/agentmanager-sections/all-colors-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/agentmanager-sections/collapsed-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/agentmanager-sections/default-color-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/agentmanager-sections/dense-sidebar-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/agentmanager-sections/empty-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/agentmanager-sections/expanded-with-items-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/agentmanager-sections/first-and-last-section-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/agentmanager-sections/long-section-name-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/agentmanager-sections/multiple-sections-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/agentmanager-sections/with-active-worktree-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/agentmanager-sections/with-busy-worktree-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/agentmanager-sections/with-pr-badges-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/agentmanager-sections/with-stale-worktree-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/agentmanager-sections/with-versions-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/agentmanager/pr-badge-approved-checks-failing-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/agentmanager/pr-badge-approved-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/agentmanager/pr-badge-changes-requested-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/agentmanager/pr-badge-checks-failing-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/agentmanager/pr-badge-closed-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/agentmanager/pr-badge-draft-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/agentmanager/pr-badge-merged-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/agentmanager/pr-badge-no-review-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/agentmanager/pr-badge-pending-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/chat/question-dock-many-options-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/chat/question-dock-multi-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/chat/question-dock-single-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/composite-webview/question-above-chatbox-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+173, -142)
- `packages/kilo-vscode/webview-ui/agent-manager/DiffPanel.tsx` (+45, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/FileTree.tsx` (+74, -36)
- `packages/kilo-vscode/webview-ui/agent-manager/FullScreenDiffView.tsx` (+20, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/SectionHeader.tsx` (+152, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/WorktreeItem.tsx` (+49, -6)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager-review.css` (+38, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+162, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/constrain-drag-x.ts` (+21, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fr.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ja.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ko.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/nl.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/no.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/pl.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ru.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/th.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/tr.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/uk.ts` (+16, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zh.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zht.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/navigate.ts` (+48, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/open-sessions.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/revert-file.ts` (+56, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/section-colors.ts` (+22, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/section-dnd.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/section-helpers.ts` (+125, -0)
- `packages/kilo-vscode/webview-ui/diff-virtual/DiffVirtualApp.tsx` (+125, -0)
- `packages/kilo-vscode/webview-ui/diff-virtual/index.tsx` (+10, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/AssistantMessage.tsx` (+34, -14)
- `packages/kilo-vscode/webview-ui/src/components/chat/ChatView.tsx` (+11, -13)
- `packages/kilo-vscode/webview-ui/src/components/chat/KiloNotifications.tsx` (+8, -2)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/PermissionDiff.tsx` (+75, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/PermissionDock.tsx` (+10, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/QuestionDock.tsx` (+9, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskToolExpanded.tsx` (+8, -1)
- `packages/kilo-vscode/webview-ui/src/components/settings/AgentBehaviourTab.tsx` (+39, -8)
- `packages/kilo-vscode/webview-ui/src/components/settings/ExperimentalTab.tsx` (+48, -1)
- `packages/kilo-vscode/webview-ui/src/components/settings/ModeEditView.tsx` (+213, -3)
- `packages/kilo-vscode/webview-ui/src/components/settings/settings-io.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelSelector.tsx` (+5, -2)
- `packages/kilo-vscode/webview-ui/src/context/config.tsx` (+21, -16)
- `packages/kilo-vscode/webview-ui/src/context/provider.tsx` (+21, -16)
- `packages/kilo-vscode/webview-ui/src/context/session-agent.ts` (+1, -3)
- `packages/kilo-vscode/webview-ui/src/context/session-utils.ts` (+14, -2)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+56, -46)
- `packages/kilo-vscode/webview-ui/src/hooks/useSlashCommand.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+19, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+19, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+19, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+19, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+19, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+21, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+19, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+19, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+19, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+19, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+21, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+19, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+19, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+19, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+19, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+21, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+21, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+18, -0)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/stories/agent-manager.stories.tsx` (+147, -1)
- `packages/kilo-vscode/webview-ui/src/stories/section-header.stories.tsx` (+638, -0)
- `packages/kilo-vscode/webview-ui/src/stories/settings.stories.tsx` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/styles/chat.css` (+177, -22)
- `packages/kilo-vscode/webview-ui/src/types/messages.ts` (+159, -1)
- `packages/kilo-vscode/webview-ui/src/utils/search-match.ts` (+59, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/cli/cmd/config.ts` (+40, -0)
- `packages/opencode/src/cli/cmd/run.ts` (+32, -0)
- `packages/opencode/src/cli/cmd/session.ts` (+90, -16)
- `packages/opencode/src/cli/cmd/tui/app.tsx` (+32, -1)
- `packages/opencode/src/cli/cmd/tui/component/dialog-session-list.tsx` (+57, -13)
- `packages/opencode/src/cli/cmd/tui/component/dialog-session-rename.tsx` (+11, -5)
- `packages/opencode/src/cli/cmd/tui/component/dialog-status.tsx` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/component/prompt/index.tsx` (+2, -0)
- `packages/opencode/src/cli/cmd/tui/context/sync.tsx` (+99, -1)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+29, -2)
- `packages/opencode/src/cli/cmd/tui/routes/session/network.tsx` (+66, -0)
- `packages/opencode/src/cli/cmd/tui/routes/session/permission.tsx` (+8, -0)
- `packages/opencode/src/cli/cmd/tui/ui/toast.tsx` (+14, -3)
- `packages/opencode/src/config/config.ts` (+215, -53)
- `packages/opencode/src/index.ts` (+7, -0)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+47, -8)
- `packages/opencode/src/kilo-sessions/remote-protocol.ts` (+2, -0)
- `packages/opencode/src/kilo-sessions/remote-sender.ts` (+31, -13)
- `packages/opencode/src/kilo-sessions/remote-ws.ts` (+8, -3)
- `packages/opencode/src/kilocode/commands.ts` (+59, -0)
- `packages/opencode/src/kilocode/generate-cli-docs.ts` (+28, -0)
- `packages/opencode/src/kilocode/help-command.ts` (+45, -0)
- `packages/opencode/src/kilocode/help.ts` (+237, -0)
- `packages/opencode/src/kilocode/plan-followup.ts` (+10, -7)
- `packages/opencode/src/kilocode/review/review.ts` (+34, -4)
- `packages/opencode/src/kilocode/skills/builtin.ts` (+1, -1)
- `packages/opencode/src/kilocode/skills/kilo-config.md` (+95, -11)
- `packages/opencode/src/kilocode/worktree-family.ts` (+35, -0)
- `packages/opencode/src/lsp/server.ts` (+1, -0)
- `packages/opencode/src/mcp/index.ts` (+35, -0)
- `packages/opencode/src/provider/models.ts` (+29, -8)
- `packages/opencode/src/provider/provider.ts` (+32, -12)
- `packages/opencode/src/provider/transform.ts` (+8, -3)
- `packages/opencode/src/server/routes/config.ts` (+23, -0)
- `packages/opencode/src/server/routes/experimental.ts` (+27, -1)
- `packages/opencode/src/server/routes/network.ts` (+93, -0)
- `packages/opencode/src/server/routes/session.ts` (+14, -5)
- `packages/opencode/src/server/server.ts` (+5, -1)
- `packages/opencode/src/session/index.ts` (+53, -5)
- `packages/opencode/src/session/message-v2.ts` (+3, -2)
- `packages/opencode/src/session/network.ts` (+274, -0)
- `packages/opencode/src/session/processor.ts` (+80, -14)
- `packages/opencode/src/session/status.ts` (+7, -0)
- `packages/opencode/src/snapshot/index.ts` (+15, -9)
- `packages/opencode/test/kilo-sessions/remote-ws.test.ts` (+10, -10)
- `packages/opencode/test/kilocode/bedrock-claude-empty-content.test.ts` (+138, -0)
- `packages/opencode/test/kilocode/config-resilience.test.ts` (+234, -0)
- `packages/opencode/test/kilocode/help.test.ts` (+177, -0)
- `packages/opencode/test/kilocode/run-network.test.ts` (+224, -0)
- `packages/opencode/test/kilocode/session-processor-network-offline.test.ts` (+152, -0)
- `packages/opencode/test/server/experimental-session-list.test.ts` (+92, -0)
- `packages/opencode/test/server/global-session-list.test.ts` (+61, -4)
- `packages/opencode/test/server/permission-allow-everything.test.ts` (+78, -0)
- `packages/opencode/test/session/network.test.ts` (+136, -0)
- `packages/opencode/test/session/retry.test.ts` (+17, -0)
- `packages/opencode/test/snapshot/snapshot.test.ts` (+1, -76)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+4, -1)
- `packages/script/src/index.ts` (+68, -12)
- `packages/script/tests/check-opencode-annotations.test.ts` (+596, -0)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+234, -98)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+349, -144)
- `packages/sdk/openapi.json` (+1170, -662)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/components/basic-tool.tsx` (+1, -0)
- `packages/ui/src/components/icon.tsx` (+1, -0)
- `packages/util/package.json` (+1, -1)
- `script/check-opencode-annotations.ts` (+48, -11)
- `script/generate-cli-docs.ts` (+5, -0)
- `script/generate.ts` (+2, -0)
- `script/publish.ts` (+12, -9)
- `script/upstream/package.json` (+1, -1)
- `script/version.ts` (+4, -2)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/CompletionProvider.ts
```diff
diff --git a/packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/CompletionProvider.ts b/packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/CompletionProvider.ts
deleted file mode 100644
index 8871fc5e0..000000000
--- a/packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/CompletionProvider.ts
+++ /dev/null
@@ -1,272 +0,0 @@
-import { MinimalConfigProvider } from "./MinimalConfig.js"
-import { IDE, ILLM } from "../index.js"
-import { DEFAULT_AUTOCOMPLETE_OPTS } from "../util/parameters.js"
-import { shouldCompleteMultiline } from "./classification/shouldCompleteMultiline.js"
-import { ContextRetrievalService } from "./context/ContextRetrievalService.js"
-import { isSecurityConcern } from "../indexing/ignore.js"
-import { BracketMatchingService } from "./filtering/BracketMatchingService.js"
-import { CompletionStreamer } from "./generation/CompletionStreamer.js"
-import { postprocessCompletion } from "./postprocessing/index.js"
-import { shouldPrefilter } from "./prefiltering/index.js"
-import { getAllSnippetsWithoutRace } from "./snippets/index.js"
-import { renderPromptWithTokenLimit } from "./templating/index.js"
-import { GetLspDefinitionsFunction } from "./types.js"
-import { AutocompleteDebouncer } from "./util/AutocompleteDebouncer.js"
-import { AutocompleteLoggingService } from "./util/AutocompleteLoggingService.js"
-import { AutocompleteLruCacheInMem } from "./util/AutocompleteLruCacheInMem.js"
-import { HelperVars } from "./util/HelperVars.js"
-import { AutocompleteInput, AutocompleteOutcome } from "./util/types.js"
-
-// Errors that can be expected on occasion even during normal functioning should not be shown.
-// Not worth disrupting the user to tell them that a single autocomplete request didn't go through
-const ERRORS_TO_IGNORE = [
-  // From Ollama
-  "unexpected server status",
-  "operation was aborted",
-]
-
-export class CompletionProvider {
-  private autocompleteCache = AutocompleteLruCacheInMem.get()
-  public errorsShown: Set<string> = new Set()
-  private bracketMatchingService = new BracketMatchingService()
-  private debouncer = new AutocompleteDebouncer()
-  private completionStreamer: CompletionStreamer
-  private loggingService = new AutocompleteLoggingService()
-  private contextRetrievalService: ContextRetrievalService
-
-  constructor(
-    private readonly configHandler: MinimalConfigProvider,
-    private readonly ide: IDE,
-    private readonly _injectedGetLlm: () => Promise<ILLM | undefined>,
-    private readonly _onError: (e: unknown) => void,
-    private readonly getDefinitionsFromLsp: GetLspDefinitionsFunction,
-  ) {
-    this.completionStreamer = new CompletionStreamer(this.onError.bind(this))
```

#### packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/MinimalConfig.ts
```diff
diff --git a/packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/MinimalConfig.ts b/packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/MinimalConfig.ts
deleted file mode 100644
index c834949ff..000000000
--- a/packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/MinimalConfig.ts
+++ /dev/null
@@ -1,126 +0,0 @@
-/**
- * Minimal configuration for autocomplete features.
- * This replaces the complex ConfigHandler system with simple hardcoded defaults.
- *
- * Analysis of ConfigHandler usage:
- * - CompletionProvider needs: config.tabAutocompleteOptions, config.experimental.enableStaticContextualization, currentProfile.profileType
- *
- * The profileType is only used for logging/telemetry, so we can set it to undefined for a minimal extraction.
- */
-
-import { ILLM, TabAutocompleteOptions } from "../index.js"
-import { DEFAULT_AUTOCOMPLETE_OPTS } from "../util/parameters.js"
-
-interface MinimalConfig {
-  tabAutocompleteOptions?: TabAutocompleteOptions
-  experimental?: {
-    enableStaticContextualization?: boolean
-  }
-  // Minimal model selection support for NextEdit context fetching
-  modelsByRole?: {
-    autocomplete?: ILLM[]
-  }
-  selectedModelByRole?: {
-    autocomplete?: ILLM
-    edit?: ILLM
-    chat?: ILLM
-    rerank?: ILLM
-  }
-  rules?: unknown[]
-}
-
-interface MinimalProfile {
-  profileDescription: {
-    profileType?: "control-plane" | "local" | "platform"
-  }
-}
-
-/**
- * Default configuration with hardcoded values suitable for autocomplete/NextEdit.
- * Uses the same defaults from DEFAULT_AUTOCOMPLETE_OPTS.
- */
-const DEFAULT_MINIMAL_CONFIG: MinimalConfig = {
-  tabAutocompleteOptions: {
-    ...DEFAULT_AUTOCOMPLETE_OPTS,
```

#### packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/classification/shouldCompleteMultiline.ts
```diff
diff --git a/packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/classification/shouldCompleteMultiline.ts b/packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/classification/shouldCompleteMultiline.ts
deleted file mode 100644
index e24b70084..000000000
--- a/packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/classification/shouldCompleteMultiline.ts
+++ /dev/null
@@ -1,37 +0,0 @@
-import { AutocompleteLanguageInfo } from "../constants/AutocompleteLanguageInfo"
-import { HelperVars } from "../util/HelperVars"
-
-function shouldCompleteMultilineBasedOnLanguage(language: AutocompleteLanguageInfo, prefix: string, suffix: string) {
-  return language.useMultiline?.({ prefix, suffix }) ?? true
-}
-
-export function shouldCompleteMultiline(helper: HelperVars) {
-  switch (helper.options.multilineCompletions) {
-    case "always":
-      return true
-    case "never":
-      return false
-    default:
-      break
-  }
-
-  // Always single-line if an intellisense option is selected
-  if (helper.input.selectedCompletionInfo) {
-    return true
-  }
-
-  // // Don't complete multi-line if you are mid-line
-  // if (isMidlineCompletion(helper.fullPrefix, helper.fullSuffix)) {
-  //   return false;
-  // }
-
-  // Don't complete multi-line for single-line comments
-  if (
-    helper.lang.singleLineComment &&
-    helper.fullPrefix.split("\n").slice(-1)[0]?.trimStart().startsWith(helper.lang.singleLineComment)
-  ) {
-    return false
-  }
-
-  return shouldCompleteMultilineBasedOnLanguage(helper.lang, helper.prunedPrefix, helper.prunedSuffix)
-}
```

#### packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/context/root-path-context/__fixtures__/files/typescript/arrowFunctions.ts
```diff
diff --git a/packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/context/root-path-context/__fixtures__/files/typescript/arrowFunctions.ts b/packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/context/root-path-context/__fixtures__/files/typescript/arrowFunctions.ts
deleted file mode 100644
index cb853ef39..000000000
--- a/packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/context/root-path-context/__fixtures__/files/typescript/arrowFunctions.ts
+++ /dev/null
@@ -1,29 +0,0 @@
-// @ts-nocheck
-
-const getAddress = (person: Person): Address => {
-  // TODO
-}
-
-const logPerson = (person: Person) => {
-  // TODO
-}
-
-const getHardcodedAddress = (): Address => {
-  // TODO
-}
-
-const getAddresses = (people: Person[]): Address[] => {
-  // TODO
-}
-
-const logPersonWithAddres = (person: Person<Address>): Person<Address> => {
-  // TODO
-}
-
-const logPersonOrAddress = (person: Person | Address): Person | Address => {
-  // TODO
-}
-
-const logPersonAndAddress = (person: Person, address: Address) => {
-  // TODO
-}
```

#### packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/context/root-path-context/__fixtures__/files/typescript/classMethods.ts
```diff
diff --git a/packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/context/root-path-context/__fixtures__/files/typescript/classMethods.ts b/packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/context/root-path-context/__fixtures__/files/typescript/classMethods.ts
deleted file mode 100644
index 08f7506a7..000000000
--- a/packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/context/root-path-context/__fixtures__/files/typescript/classMethods.ts
+++ /dev/null
@@ -1,35 +0,0 @@
-// @ts-nocheck
-
-class Group {
-  getPersonAddress(person: Person): Address {
-    // TODO
-  }
-
-  getHardcodedAddress(): Address {
-    // TODO
-  }
-
-  addPerson(person: Person) {
-    // TODO
-  }
-
-  addPeople(people: Person[]) {
-    // TODO
-  }
-
-  getAddresses(people: Person[]): Address[] {
-    // TODO
-  }
-
-  logPersonWithAddress(person: Person<Address>): Person<Address> {
-    // TODO
-  }
-
-  logPersonOrAddress(person: Person | Address): Person | Address {
-    // TODO
-  }
-
-  logPersonAndAddress(person: Person, address: Address) {
-    // TODO
-  }
-}
```


*... and more files (showing first 5)*

## opencode Changes (ae614d9..ce19c05)

### Commits

- ce19c05 - fix: ts lsp (#21827) (Aiden Cline, 2026-04-10)
- 91786d2 - refactor(effect): use Git service in file and storage (#21803) (Kit Langton, 2026-04-09)
- eca11ca - refactor(effect): use SessionRevert service in prompt (#21796) (Kit Langton, 2026-04-09)
- 17bd166 - refactor(effect): move tool descriptions into registry (#21795) (Kit Langton, 2026-04-09)
- 16c60c9 - refactor(session): extract sharing orchestration (#21759) (Kit Langton, 2026-04-09)
- 0970b10 - Merge remote-tracking branch 'origin/dev' into dev (Dax Raad, 2026-04-09)
- 04074d3 - core: enable prod channel to use shared production database (Dax Raad, 2026-04-09)
- b16ee08 - ci use node 24 in test workflow fixing random ECONNRESET (#21782) (Luke Parker, 2026-04-10)
- 98874a0 - fix windows e2e backend not stopping on sigterm waiting 10s for no reason (#21781) (Luke Parker, 2026-04-10)
- 877be7e - release: v1.4.3 (opencode, 2026-04-10)
- eac50f9 - ci: prevent beta branch builds from triggering production release steps (Dax Raad, 2026-04-09)
- 1a902b2 - ci: skip winget publish on beta and ensure finalize always runs (Dax Raad, 2026-04-09)
- bbe4a04 - chore: generate (opencode-agent[bot], 2026-04-09)
- b2f621b - refactor(session): inline init route orchestration (#21754) (Kit Langton, 2026-04-09)
- 7202b3a - fix: ensure that openai oauth works for agent create cmd, use temporary hack (#21749) (Aiden Cline, 2026-04-09)
- 35b44df - chore: generate (opencode-agent[bot], 2026-04-09)
- 10441ef - refactor(effect): extract session run state service (#21744) (Kit Langton, 2026-04-09)
- 3199383 - fix: finalize interrupted bash via tool result path (#21724) (Kit Langton, 2026-04-09)
- 9f54115 - refactor: remove unused runtime facade exports (#21731) (Kit Langton, 2026-04-09)
- 2ecc6ae - fix(effect): suspend agent default layer construction (#21732) (Kit Langton, 2026-04-09)
- 02b32e1 - Revert "opencode: lazy-load top-level CLI commands" (#21726) (Simon Klee, 2026-04-09)
- 34b9792 - delete unused withALS method (#21723) (Kit Langton, 2026-04-09)
- 537160d - opencode: lazy-load top-level CLI commands (Simon Klee, 2026-04-09)
- b060066 - feat: add support for fast modes for claude and gpt models (that support it) (#21706) (Aiden Cline, 2026-04-09)
- 581a769 - fix(tui): restore hidden session scrollbar default (#20947) (Kit Langton, 2026-04-09)
- f73e4d5 - chore: generate (opencode-agent[bot], 2026-04-09)
- a7743e6 - feat(mcp): add OAuth redirect URI configuration for MCP servers (#21385) (Aleksandr Lossenko, 2026-04-09)
- 5d3dba6 - release: v1.4.2 (opencode, 2026-04-09)
- bd53b65 - refactor: fix tool call state handling and clean up imports (#21709) (Dax, 2026-04-09)
- 46da801 - refactor(effect): drop shell abort signals from runner (#21599) (Kit Langton, 2026-04-09)
- 58a9991 - fix: preserve text part timing in session processor (#21691) (Kit Langton, 2026-04-09)
- c29392d - fix: preserve interrupted bash output in tool results (#21598) (Kit Langton, 2026-04-09)
- 46f243f - app: remove min loading duration (#21655) (Brendan Allan, 2026-04-09)
- 847fc9d - release: v1.4.1 (opencode, 2026-04-09)
- 489f579 - feat: add opencode go upsell modal when limits are hit (#21583) (Aiden Cline, 2026-04-09)
- 3fc3974 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-04-09)
- ca57248 - chore: generate (opencode-agent[bot], 2026-04-09)
- ee23043 - Remove CLI from electron app (#17803) (Brendan Allan, 2026-04-09)
- 9c1c061 - fix(lsp): remove CMakeLists.txt and Makefile from clangd root markers (#21466) (Cho HyeonJong, 2026-04-08)
- d82b163 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-04-09)
- cd8e8a9 - feat(llm): integrate GitLab DWS tool approval with permission system (#19955) (Vladimir Glafirov, 2026-04-08)
- 8bdcc22 - refactor(effect): inline session processor interrupt cleanup (#21593) (Kit Langton, 2026-04-08)
- 2bdd279 - fix: propagate abort signal to inline read tool (#21584) (Kit Langton, 2026-04-08)
- 51535d8 - fix(app): skip url password setting for same-origin server and web app (#19923) (OpeOginni, 2026-04-09)
- 38f8714 - refactor(effect): build task tool from agent services (#21017) (Kit Langton, 2026-04-08)
- 4961d72 - tweak: separate ModelsDev.Model and Config model schemas (#21561) (Aiden Cline, 2026-04-08)
- 00cb883 - fix: dont show invalid variants for BP (#21555) (Aiden Cline, 2026-04-08)
- 689b1a4 - fix(app): diff list normalization (Adam, 2026-04-08)
- d98be39 - fix(app): patch tool diff rendering (Adam, 2026-04-08)
- 039c601 - fix: ensure that /providers list and shell endpoints are correctly typed in sdk and openapi schema (#21543) (Aiden Cline, 2026-04-08)
- cd87d4f - test: update webfetch test (#21398) (Aiden Cline, 2026-04-08)
- 988c989 - ui: fix sticky session diffs header (#21486) (Brendan Allan, 2026-04-08)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/read.ts` (+1, -3)
- `packages/opencode/src/tool/registry.ts` (+116, -54)
- `packages/opencode/src/tool/skill.ts` (+0, -21)
- `packages/opencode/src/tool/task.ts` (+145, -137)
- `packages/opencode/src/tool/tool.ts` (+18, -8)
- `packages/opencode/test/tool/skill.test.ts` (+15, -6)
- `packages/opencode/test/tool/task.test.ts` (+412, -36)
- `packages/opencode/test/tool/webfetch.test.ts` (+15, -72)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+21, -14)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/console/core/package.json` (+1, -1)

#### Other Changes
- `.github/workflows/publish.yml` (+6, -3)
- `.github/workflows/test.yml` (+13, -0)
- `bun.lock` (+47, -29)
- `nix/hashes.json` (+4, -4)
- `package.json` (+2, -1)
- `packages/app/e2e/backend.ts` (+7, -3)
- `packages/app/package.json` (+1, -1)
- `packages/app/src/app.tsx` (+0, -1)
- `packages/app/src/components/terminal.tsx` (+7, -2)
- `packages/app/src/context/global-sync/event-reducer.ts` (+3, -2)
- `packages/app/src/context/sync.tsx` (+3, -2)
- `packages/app/src/pages/session.tsx` (+7, -10)
- `packages/app/src/utils/diffs.test.ts` (+74, -0)
- `packages/app/src/utils/diffs.ts` (+49, -0)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/mail/package.json` (+1, -1)
- `packages/desktop-electron/electron-builder.config.ts` (+0, -5)
- `packages/desktop-electron/electron.vite.config.ts` (+31, -0)
- `packages/desktop-electron/package.json` (+23, -12)
- `packages/desktop-electron/scripts/prebuild.ts` (+9, -0)
- `packages/desktop-electron/scripts/predev.ts` (+1, -13)
- `packages/desktop-electron/scripts/prepare.ts` (+1, -17)
- `packages/desktop-electron/src/main/cli.ts` (+0, -283)
- `packages/desktop-electron/src/main/env.d.ts` (+22, -0)
- `packages/desktop-electron/src/main/index.ts` (+10, -22)
- `packages/desktop-electron/src/main/ipc.ts` (+0, -2)
- `packages/desktop-electron/src/main/menu.ts` (+0, -5)
- `packages/desktop-electron/src/main/server.ts` (+30, -16)
- `packages/desktop-electron/src/main/shell-env.ts` (+13, -13)
- `packages/desktop/package.json` (+1, -1)
- `packages/desktop/scripts/finalize-latest-json.ts` (+5, -2)
- `packages/enterprise/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/function/package.json` (+1, -1)
- `packages/opencode/package.json` (+3, -3)
- `packages/opencode/script/build-node.ts` (+7, -16)
- `packages/opencode/script/build.ts` (+2, -15)
- `packages/opencode/script/generate.ts` (+23, -0)
- `packages/opencode/src/account/index.ts` (+0, -17)
- `packages/opencode/src/cli/cmd/db.ts` (+2, -1)
- `packages/opencode/src/cli/cmd/github.ts` (+2, -1)
- `packages/opencode/src/cli/cmd/mcp.ts` (+1, -0)
- `packages/opencode/src/cli/cmd/run.ts` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/component/dialog-go-upsell.tsx` (+99, -0)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+24, -1)
- `packages/opencode/src/cli/cmd/tui/worker.ts` (+1, -1)
- `packages/opencode/src/config/config.ts` (+79, -19)
- `packages/opencode/src/effect/cross-spawn-spawner.ts` (+0, -1)
- `packages/opencode/src/effect/instance-state.ts` (+0, -6)
- `packages/opencode/src/effect/runner.ts` (+6, -14)
- `packages/opencode/src/file/index.ts` (+90, -107)
- `packages/opencode/src/file/time.ts` (+1, -1)
- `packages/opencode/src/file/watcher.ts` (+5, -6)
- `packages/opencode/src/git/index.ts` (+0, -32)
- `packages/opencode/src/index.ts` (+2, -1)
- `packages/opencode/src/lsp/index.ts` (+1, -1)
- `packages/opencode/src/lsp/server.ts` (+2, -12)
- `packages/opencode/src/mcp/index.ts` (+8, -6)
- `packages/opencode/src/mcp/oauth-callback.ts` (+26, -10)
- `packages/opencode/src/mcp/oauth-provider.ts` (+23, -0)
- `packages/opencode/src/node.ts` (+5, -0)
- `packages/opencode/src/plugin/codex.ts` (+2, -2)
- `packages/opencode/src/plugin/index.ts` (+1, -1)
- `packages/opencode/src/project/project.ts` (+1, -1)
- `packages/opencode/src/project/vcs.ts` (+30, -32)
- `packages/opencode/src/provider/models-snapshot.d.ts` (+2, -0)
- `packages/opencode/src/provider/models-snapshot.js` (+61474, -0)
- `packages/opencode/src/provider/models.ts` (+40, -20)
- `packages/opencode/src/provider/provider.ts` (+45, -21)
- `packages/opencode/src/provider/transform.ts` (+2, -1)
- `packages/opencode/src/pty/index.ts` (+0, -4)
- `packages/opencode/src/server/instance.ts` (+8, -5)
- `packages/opencode/src/server/proxy.ts` (+11, -8)
- `packages/opencode/src/server/router.ts` (+1, -1)
- `packages/opencode/src/server/routes/provider.ts` (+1, -1)
- `packages/opencode/src/server/routes/session.ts` (+35, -21)
- `packages/opencode/src/server/server.ts` (+6, -3)
- `packages/opencode/src/session/compaction.ts` (+24, -39)
- `packages/opencode/src/session/index.ts` (+34, -84)
- `packages/opencode/src/session/llm.ts` (+61, -1)
- `packages/opencode/src/session/message-v2.ts` (+34, -11)
- `packages/opencode/src/session/processor.ts` (+170, -83)
- `packages/opencode/src/session/prompt.ts` (+185, -234)
- `packages/opencode/src/session/retry.ts` (+5, -2)
- `packages/opencode/src/session/revert.ts` (+13, -12)
- `packages/opencode/src/session/run-state.ts` (+114, -0)
- `packages/opencode/src/session/status.ts` (+1, -1)
- `packages/opencode/src/session/summary.ts` (+6, -8)
- `packages/opencode/src/session/todo.ts` (+0, -4)
- `packages/opencode/src/share/session.ts` (+67, -0)
- `packages/opencode/src/share/share-next.ts` (+5, -1)
- `packages/opencode/src/shell/shell.ts` (+3, -3)
- `packages/opencode/src/storage/db.ts` (+1, -1)
- `packages/opencode/src/storage/json-migration.ts` (+10, -10)
- `packages/opencode/src/storage/storage.ts` (+12, -9)
- `packages/opencode/src/worktree/index.ts` (+4, -2)
- `packages/opencode/test/effect/runner.test.ts` (+14, -42)
- `packages/opencode/test/file/watcher.test.ts` (+2, -0)
- `packages/opencode/test/lsp/index.test.ts` (+0, -78)
- `packages/opencode/test/mcp/oauth-callback.test.ts` (+34, -0)
- `packages/opencode/test/provider/provider.test.ts` (+68, -0)
- `packages/opencode/test/server/project-init-git.test.ts` (+2, -2)
- `packages/opencode/test/server/session-actions.test.ts` (+4, -3)
- `packages/opencode/test/server/session-messages.test.ts` (+4, -4)
- `packages/opencode/test/server/session-select.test.ts` (+3, -3)
- `packages/opencode/test/session/compaction.test.ts` (+2, -12)
- `packages/opencode/test/session/message-v2.test.ts` (+75, -0)
- `packages/opencode/test/session/processor-effect.test.ts` (+89, -7)
- `packages/opencode/test/session/prompt-effect.test.ts` (+288, -43)
- `packages/opencode/test/session/snapshot-tool-race.test.ts` (+7, -0)
- `packages/opencode/test/storage/json-migration.test.ts` (+30, -47)
- `packages/opencode/test/storage/storage.test.ts` (+2, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+217, -271)
- `packages/sdk/js/src/v2/index.ts` (+0, -1)
- `packages/sdk/openapi.json` (+458, -646)
- `packages/slack/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/components/apply-patch-file.test.ts` (+43, -0)
- `packages/ui/src/components/apply-patch-file.ts` (+78, -0)
- `packages/ui/src/components/message-part.tsx` (+4, -25)
- `packages/ui/src/components/session-review.tsx` (+23, -1)
- `packages/ui/src/components/session-turn.css` (+7, -1)
- `packages/ui/src/components/session-turn.tsx` (+1, -1)
- `packages/util/package.json` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `sdks/vscode/package.json` (+1, -1)
- `specs/v2/session.md` (+17, -0)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 27bbe65..e60da9d 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.4.0",
+  "version": "1.4.3",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/opencode/src/agent/agent.ts
```diff
diff --git a/packages/opencode/src/agent/agent.ts b/packages/opencode/src/agent/agent.ts
index 0c6fe6e..2a8bed0 100644
--- a/packages/opencode/src/agent/agent.ts
+++ b/packages/opencode/src/agent/agent.ts
@@ -341,6 +341,10 @@ export namespace Agent {
           )
           const existing = yield* InstanceState.useEffect(state, (s) => s.list())
 
+          // TODO: clean this up so provider specific logic doesnt bleed over
+          const authInfo = yield* auth.get(model.providerID).pipe(Effect.orDie)
+          const isOpenaiOauth = model.providerID === "openai" && authInfo?.type === "oauth"
+
           const params = {
             experimental_telemetry: {
               isEnabled: cfg.experimental?.openTelemetry,
@@ -350,12 +354,14 @@ export namespace Agent {
             },
             temperature: 0.3,
             messages: [
-              ...system.map(
-                (item): ModelMessage => ({
-                  role: "system",
-                  content: item,
-                }),
-              ),
+              ...(isOpenaiOauth
+                ? []
+                : system.map(
+                    (item): ModelMessage => ({
+                      role: "system",
+                      content: item,
+                    }),
+                  )),
               {
                 role: "user",
                 content: `Create an agent configuration based on this request: \"${input.description}\".\n\nIMPORTANT: The following identifiers already exist and must NOT be used: ${existing.map((i) => i.name).join(", ")}\n  Return ONLY the JSON object, no other text, do not wrap in backticks`,
@@ -369,13 +375,12 @@ export namespace Agent {
             }),
           } satisfies Parameters<typeof generateObject>[0]
 
-          // TODO: clean this up so provider specific logic doesnt bleed over
-          const authInfo = yield* auth.get(model.providerID).pipe(Effect.orDie)
-          if (model.providerID === "openai" && authInfo?.type === "oauth") {
+          if (isOpenaiOauth) {
             return yield* Effect.promise(async () => {
               const result = streamObject({
                 ...params,
                 providerOptions: ProviderTransform.providerOptions(resolved, {
+                  instructions: system.join("\n"),
                   store: false,
```

#### packages/opencode/src/tool/read.ts
```diff
diff --git a/packages/opencode/src/tool/read.ts b/packages/opencode/src/tool/read.ts
index 0b44c7a..f963b41 100644
--- a/packages/opencode/src/tool/read.ts
+++ b/packages/opencode/src/tool/read.ts
@@ -67,9 +67,7 @@ export const ReadTool = Tool.defineEffect(
           if (item.type === "directory") return item.name + "/"
           if (item.type !== "symlink") return item.name
 
-          const target = yield* fs
-            .stat(path.join(filepath, item.name))
-            .pipe(Effect.catch(() => Effect.succeed(undefined)))
+          const target = yield* fs.stat(path.join(filepath, item.name)).pipe(Effect.catch(() => Effect.void))
           if (target?.type === "Directory") return item.name + "/"
           return item.name
         }),
```

#### packages/opencode/src/tool/registry.ts
```diff
diff --git a/packages/opencode/src/tool/registry.ts b/packages/opencode/src/tool/registry.ts
index 7291105..9c0771b 100644
--- a/packages/opencode/src/tool/registry.ts
+++ b/packages/opencode/src/tool/registry.ts
@@ -5,12 +5,12 @@ import { EditTool } from "./edit"
 import { GlobTool } from "./glob"
 import { GrepTool } from "./grep"
 import { ReadTool } from "./read"
-import { TaskDescription, TaskTool } from "./task"
+import { TaskTool } from "./task"
 import { TodoWriteTool } from "./todo"
 import { WebFetchTool } from "./webfetch"
 import { WriteTool } from "./write"
 import { InvalidTool } from "./invalid"
-import { SkillDescription, SkillTool } from "./skill"
+import { SkillTool } from "./skill"
 import { Tool } from "./tool"
 import { Config } from "../config/config"
 import { type ToolContext as PluginToolContext, type ToolDefinition } from "@opencode-ai/plugin"
@@ -38,24 +38,31 @@ import { FileTime } from "../file/time"
 import { Instruction } from "../session/instruction"
 import { AppFileSystem } from "../filesystem"
 import { Agent } from "../agent/agent"
+import { Skill } from "../skill"
+import { Permission } from "@/permission"
 
 export namespace ToolRegistry {
   const log = Log.create({ service: "tool.registry" })
 
+  type TaskDef = Tool.InferDef<typeof TaskTool>
+  type ReadDef = Tool.InferDef<typeof ReadTool>
+
   type State = {
     custom: Tool.Def[]
     builtin: Tool.Def[]
+    task: TaskDef
+    read: ReadDef
   }
 
   export interface Interface {
     readonly ids: () => Effect.Effect<string[]>
     readonly all: () => Effect.Effect<Tool.Def[]>
+    readonly named: () => Effect.Effect<{ task: TaskDef; read: ReadDef }>
     readonly tools: (model: {
       providerID: ProviderID
       modelID: ModelID
       agent: Agent.Info
     }) => Effect.Effect<Tool.Def[]>
-    readonly fromID: (id: string) => Effect.Effect<Tool.Def>
   }
```

#### packages/opencode/src/tool/skill.ts
```diff
diff --git a/packages/opencode/src/tool/skill.ts b/packages/opencode/src/tool/skill.ts
index 276f393..e0777d0 100644
--- a/packages/opencode/src/tool/skill.ts
+++ b/packages/opencode/src/tool/skill.ts
@@ -1,4 +1,3 @@
-import { Effect } from "effect"
 import path from "path"
 import { pathToFileURL } from "url"
 import z from "zod"
@@ -98,23 +97,3 @@ export const SkillTool = Tool.define("skill", async () => {
     },
   }
 })
-
-export const SkillDescription: Tool.DynamicDescription = (agent) =>
-  Effect.gen(function* () {
-    const list = yield* Effect.promise(() => Skill.available(agent))
-    if (list.length === 0) return "No skills are currently available."
-    return [
-      "Load a specialized skill that provides domain-specific instructions and workflows.",
-      "",
-      "When you recognize that a task matches one of the available skills listed below, use this tool to load the full skill instructions.",
-      "",
-      "The skill will inject detailed instructions, workflows, and access to bundled resources (scripts, references, templates) into the conversation context.",
-      "",
-      'Tool output includes a `<skill_content name="...">` block with the loaded content.',
-      "",
-      "The following skills provide specialized sets of instructions for particular tasks",
-      "Invoke this tool to load a skill when a task matches one of the available skills listed below:",
-      "",
-      Skill.fmt(list, { verbose: false }),
-    ].join("\n")
-  })
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/agent.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/prompt/ask.txt
- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/src/agent/agent.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/CompletionProvider.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/MinimalConfig.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/classification/shouldCompleteMultiline.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/context/root-path-context/__fixtures__/files/typescript/arrowFunctions.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/context/root-path-context/__fixtures__/files/typescript/classMethods.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/context/root-path-context/__fixtures__/files/typescript/classes.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/context/root-path-context/__fixtures__/files/typescript/functions.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/context/root-path-context/__fixtures__/files/typescript/generators.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/context/root-path-context/__test-cases__/python.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/streamTransforms/StreamTransformPipeline.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/streamTransforms/charStream.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/streamTransforms/charStream.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/streamTransforms/lineStream.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/test/NEGATIVE_TEST_CASES/QWEN_JSON.txt
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/test/NEGATIVE_TEST_CASES/QWEN_TYPESCRIPT.txt
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/test/NEGATIVE_TEST_CASES/STARCODER_JSON.txt
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/test/NEGATIVE_TEST_CASES/STARCODER_PYTHON.TXT
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/test/NEGATIVE_TEST_CASES/STARCODER_RUBY.TXT
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/test/NEGATIVE_TEST_CASES/STARCODER_RUST.TXT
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/test/filter.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/test/testCases.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/test/util.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/generation/CompletionStreamer.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/generation/GeneratorReuseManager.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/generation/GeneratorReuseManager.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/generation/ListenableGenerator.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/generation/ListenableGenerator.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/generation/utils.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/generation/utils.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/prefiltering/index.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/templating/__tests__/renderPrompt.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/templating/formatting.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/templating/getStopTokens.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/templating/index.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/util/AutocompleteDebouncer.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/util/AutocompleteLoggingService.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/util/AutocompleteLruCacheInMem.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/util/AutocompleteLruCacheInMem.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/util/completionTestUtils.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/util/completionTestUtils.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/util/processSingleLineCompletion.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/util/processSingleLineCompletion.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/util/types.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/diff/myers.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/diff/myers.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/diff/streamDiff.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/diff/streamDiff.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/diff/util.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/fetch/stream.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/llm/constants.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/llm/countTokens.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/llm/index.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/llm/llms/Mock.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/llm/messages.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/llm/model-info/index.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/llm/model-info/providers/openai.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/llm/model-info/types.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/llm/openaiTypeConverters.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/llm/templates/edit.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/llm/templates/edit/gpt.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/test/FakeConfigHandler.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/test/FakeIDE.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/test/fixtures.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/test/testDir.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/test/vitest.global-setup.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/test/vitest.setup.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/util/CodeRenderer.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/util/TokensBatchingService.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/util/index.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/util/logger.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/util/merge.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/util/parameters.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/util/paths.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/util/uri.ts
- `src/permission/` - review permission changes from packages/opencode/src/kilocode/permission/routes.ts
- `src/permission/` - review permission changes from packages/opencode/src/permission/next.ts
- `src/permission/` - review permission changes from packages/opencode/test/permission/next.test.ts
- `src/tool/edit.ts` - update based on kilocode packages/opencode/src/tool/edit.ts changes
- `src/tool/read.ts` - update based on opencode packages/opencode/src/tool/read.ts changes
- `src/tool/recall.test.ts` - update based on kilocode packages/opencode/test/tool/recall.test.ts changes
- `src/tool/recall.ts` - update based on kilocode packages/opencode/src/tool/recall.ts changes
- `src/tool/recall.txt.ts` - update based on kilocode packages/opencode/src/tool/recall.txt changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
- `src/tool/registry.ts` - update based on opencode packages/opencode/src/tool/registry.ts changes
- `src/tool/skill.test.ts` - update based on kilocode packages/opencode/test/tool/skill.test.ts changes
- `src/tool/skill.test.ts` - update based on opencode packages/opencode/test/tool/skill.test.ts changes
- `src/tool/skill.ts` - update based on opencode packages/opencode/src/tool/skill.ts changes
- `src/tool/task.test.ts` - update based on opencode packages/opencode/test/tool/task.test.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/tool/task.ts changes
- `src/tool/task.ts` - update based on opencode packages/opencode/src/tool/task.ts changes
- `src/tool/tool.ts` - update based on opencode packages/opencode/src/tool/tool.ts changes
- `src/tool/warpgrep.ts` - update based on kilocode packages/opencode/src/tool/warpgrep.ts changes
- `src/tool/webfetch.test.ts` - update based on opencode packages/opencode/test/tool/webfetch.test.ts changes
- `src/tool/write.ts` - update based on kilocode packages/opencode/src/tool/write.ts changes
