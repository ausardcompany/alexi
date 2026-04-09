# Upstream Changes Report
Generated: 2026-04-09 07:24:58

## Summary
- kilocode: 195 commits, 173 files changed
- opencode: 19 commits, 95 files changed

## kilocode Changes (1a5be52c7..1dc3c329c)

### Commits

- 1dc3c329c - Merge pull request #8617 from Kilo-Org/catrielmuller/8264 (Catriel Müller, 2026-04-08)
- 7b7a5e5b5 - fix: fix knip (Catriel Müller, 2026-04-08)
- f36bba771 - Merge pull request #8625 from Kilo-Org/docs/remote-connections (Emilie Lima Schario, 2026-04-08)
- d55f255e0 - docs: add Remote Connections section to Cloud Agent and CLI docs (kiloconnect[bot], 2026-04-08)
- 5dafaa53a - fix: fix permission diff on agent manager (Catriel Müller, 2026-04-08)
- aa16f5938 - refactor: fix comments (Catriel Müller, 2026-04-08)
- f3fcdc5d4 - refactor: add diff vitual to test (Catriel Müller, 2026-04-08)
- e563c08ee - fix: resolve TS errors for optional before/after in PermissionDiff (Catriel Müller, 2026-04-08)
- 90970a215 - feat: diff on edit/create files permission (Catriel Müller, 2026-04-08)
- fa2f0e52f - Merge pull request #8614 from Kilo-Org/docs/kiloclaw-slack-pairing-no-slash-command (Alex Gold, 2026-04-08)
- 42a15469a - Merge branch 'main' into docs/kiloclaw-slack-pairing-no-slash-command (Alex Gold, 2026-04-08)
- 452b258d2 - Merge pull request #8191 from Kilo-Org/feat/local-recall-tool (Marian Alexandru Alecu, 2026-04-08)
- b3a270b9e - Merge pull request #7764 from Kilo-Org/feat/allow-everything (Marian Alexandru Alecu, 2026-04-08)
- c91ff5f9c - docs(kilo-docs): simplify KiloClaw Slack pairing instructions (kiloconnect[bot], 2026-04-08)
- e18e94ecd - Merge pull request #8528 from Kilo-Org/caring-columnist (Kirill Kalishev, 2026-04-08)
- 31e198136 - release: v7.2.1 (kilo-maintainer[bot], 2026-04-08)
- 253788e9e - Merge branch 'main' into caring-columnist (Kirill Kalishev, 2026-04-08)
- 6b81526c1 - fix(cli): resolve org ID from OAuth auth accountId with comment (kirillk, 2026-04-08)
- 0043be3db - Merge branch 'main' into feat/allow-everything (Marian Alexandru Alecu, 2026-04-08)
- 8365abc78 - Merge branch 'main' into feat/local-recall-tool (Marian Alexandru Alecu, 2026-04-08)
- 3272fbebd - Merge pull request #8606 from Kilo-Org/fix/add-kilocode-change-marker-prompt-flexshrink (Mark IJbema, 2026-04-08)
- 21531ce6c - fix(cli): add missing kilocode_change annotations (Alex Alecu, 2026-04-08)
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
- 3822fc813 - Merge branch 'main' into docs/updated-models-mentioned (Thomas Boom, 2026-04-06)
- 0c3c233b9 - fix: include sibling worktree sessions when project ids drift (Alex Alecu, 2026-04-03)
- 663baf976 - fix(cli): remove worktree labels from session picker (Alex Alecu, 2026-04-03)
- 5ddd2167f - fix: scope recall sessions to project worktrees (Alex Alecu, 2026-04-03)
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
- dfeb7bf72 - Update bonus credits and AI model versions in README (Thomas Boom, 2026-03-24)
- 7e41e2cbc - remove references to 'kilo web' in documentation (Justin Chong, 2026-03-14)
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
- `packages/opencode/src/tool/write.ts` (+5, -1)
- `packages/opencode/test/tool/recall.test.ts` (+148, -0)
- `packages/opencode/test/tool/skill.test.ts` (+32, -0)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+1, -0)

#### Permission System (**/permission/)
- `packages/opencode/src/kilocode/permission/routes.ts` (+78, -0)
- `packages/opencode/src/permission/next.ts` (+62, -1)
- `packages/opencode/test/permission/next.test.ts` (+55, -0)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
(no changes)

#### Other Changes
- `.gitattributes` (+4, -0)
- `AGENTS.md` (+18, -0)
- `CONTRIBUTING.md` (+0, -2)
- `README.md` (+2, -2)
- `bun.lock` (+16, -16)
- `package.json` (+1, -1)
- `packages/app/package.json` (+1, -1)
- `packages/desktop-electron/package.json` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/kilo-docs/lib/nav/code-with-ai.ts` (+5, -1)
- `packages/kilo-docs/markdoc/partials/cli-commands-table.md` (+25, -0)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/automate/agent-manager.md` (+11, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli-reference.md` (+816, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli.md` (+47, -26)
- `packages/kilo-docs/pages/code-with-ai/platforms/cloud-agent.md` (+27, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/vscode/whats-new.md` (+7, -1)
- `packages/kilo-docs/pages/kiloclaw/chat-platforms/slack.md` (+1, -4)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-telemetry/src/events.ts` (+3, -0)
- `packages/kilo-telemetry/src/telemetry.ts` (+5, -0)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/diff.tsx` (+19, -0)
- `packages/kilo-ui/src/components/message-part.css` (+12, -0)
- `packages/kilo-ui/src/components/message-part.tsx` (+34, -0)
- `packages/kilo-vscode/esbuild.js` (+12, -1)
- `packages/kilo-vscode/eslint.config.mjs` (+1, -1)
- `packages/kilo-vscode/knip.json` (+1, -0)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/src/DiffViewerProvider.ts` (+1, -0)
- `packages/kilo-vscode/src/DiffVirtualProvider.ts` (+107, -0)
- `packages/kilo-vscode/src/KiloProvider.ts` (+174, -60)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+20, -4)
- `packages/kilo-vscode/src/agent-manager/GitOps.ts` (+36, -6)
- `packages/kilo-vscode/src/agent-manager/GitStatsPoller.ts` (+4, -1)
- `packages/kilo-vscode/src/agent-manager/PRStatusPoller.ts` (+39, -4)
- `packages/kilo-vscode/src/agent-manager/WorktreeStateManager.ts` (+194, -7)
- `packages/kilo-vscode/src/agent-manager/section-handler.ts` (+21, -0)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+50, -1)
- `packages/kilo-vscode/src/agent-manager/vscode-host.ts` (+10, -0)
- `packages/kilo-vscode/src/extension.ts` (+11, -1)
- `packages/kilo-vscode/src/kilo-provider/slim-metadata.ts` (+17, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+2, -0)
- `packages/kilo-vscode/tests/unit/git-ops.test.ts` (+81, -0)
- `packages/kilo-vscode/tests/unit/git-stats-poller.test.ts` (+10, -7)
- `packages/kilo-vscode/tests/unit/search-match.test.ts` (+200, -0)
- `packages/kilo-vscode/tests/unit/section-helpers.test.ts` (+114, -0)
- `packages/kilo-vscode/tests/unit/worktree-state-manager.test.ts` (+36, -17)
- `packages/kilo-vscode/tests/unit/worktree-state-sections.test.ts` (+286, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+134, -104)
- `packages/kilo-vscode/webview-ui/agent-manager/DiffPanel.tsx` (+27, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/SectionHeader.tsx` (+152, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/WorktreeItem.tsx` (+48, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+162, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/constrain-drag-x.ts` (+21, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fr.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ja.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ko.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/nl.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/no.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/pl.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ru.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/th.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/tr.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/uk.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zh.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zht.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/section-colors.ts` (+22, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/section-dnd.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/section-helpers.ts` (+62, -0)
- `packages/kilo-vscode/webview-ui/diff-virtual/DiffVirtualApp.tsx` (+125, -0)
- `packages/kilo-vscode/webview-ui/diff-virtual/index.tsx` (+10, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/KiloNotifications.tsx` (+8, -2)
- `packages/kilo-vscode/webview-ui/src/components/chat/PermissionDiff.tsx` (+75, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/PermissionDock.tsx` (+10, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/components/settings/AgentBehaviourTab.tsx` (+39, -8)
- `packages/kilo-vscode/webview-ui/src/components/settings/ModeEditView.tsx` (+213, -3)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelSelector.tsx` (+5, -2)
- `packages/kilo-vscode/webview-ui/src/context/config.tsx` (+21, -16)
- `packages/kilo-vscode/webview-ui/src/context/provider.tsx` (+21, -16)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+40, -40)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+13, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+13, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+13, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+13, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+10, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/stories/settings.stories.tsx` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/styles/chat.css` (+95, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages.ts` (+96, -1)
- `packages/kilo-vscode/webview-ui/src/utils/search-match.ts` (+59, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/cli/cmd/config.ts` (+40, -0)
- `packages/opencode/src/cli/cmd/session.ts` (+90, -16)
- `packages/opencode/src/cli/cmd/tui/app.tsx` (+31, -0)
- `packages/opencode/src/cli/cmd/tui/component/dialog-session-list.tsx` (+57, -13)
- `packages/opencode/src/cli/cmd/tui/component/dialog-session-rename.tsx` (+11, -5)
- `packages/opencode/src/cli/cmd/tui/component/prompt/index.tsx` (+2, -0)
- `packages/opencode/src/cli/cmd/tui/context/sync.tsx` (+28, -0)
- `packages/opencode/src/cli/cmd/tui/routes/session/permission.tsx` (+8, -0)
- `packages/opencode/src/cli/cmd/tui/ui/toast.tsx` (+14, -3)
- `packages/opencode/src/config/config.ts` (+207, -50)
- `packages/opencode/src/index.ts` (+7, -0)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+2, -0)
- `packages/opencode/src/kilocode/commands.ts` (+59, -0)
- `packages/opencode/src/kilocode/generate-cli-docs.ts` (+28, -0)
- `packages/opencode/src/kilocode/help-command.ts` (+45, -0)
- `packages/opencode/src/kilocode/help.ts` (+237, -0)
- `packages/opencode/src/kilocode/review/review.ts` (+34, -4)
- `packages/opencode/src/kilocode/skills/builtin.ts` (+1, -1)
- `packages/opencode/src/kilocode/skills/kilo-config.md` (+74, -11)
- `packages/opencode/src/kilocode/worktree-family.ts` (+35, -0)
- `packages/opencode/src/provider/models.ts` (+29, -8)
- `packages/opencode/src/server/routes/config.ts` (+23, -0)
- `packages/opencode/src/server/routes/experimental.ts` (+27, -1)
- `packages/opencode/src/server/server.ts` (+2, -0)
- `packages/opencode/src/session/index.ts` (+53, -5)
- `packages/opencode/test/kilocode/config-resilience.test.ts` (+234, -0)
- `packages/opencode/test/kilocode/help.test.ts` (+177, -0)
- `packages/opencode/test/server/experimental-session-list.test.ts` (+92, -0)
- `packages/opencode/test/server/global-session-list.test.ts` (+61, -4)
- `packages/opencode/test/server/permission-allow-everything.test.ts` (+78, -0)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+4, -1)
- `packages/script/tests/check-opencode-annotations.test.ts` (+596, -0)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+82, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+69, -0)
- `packages/sdk/openapi.json` (+460, -1719)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/util/package.json` (+1, -1)
- `script/check-opencode-annotations.ts` (+30, -10)
- `script/generate-cli-docs.ts` (+5, -0)
- `script/generate.ts` (+2, -0)
- `script/upstream/package.json` (+1, -1)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/opencode/src/agent/agent.ts
```diff
diff --git a/packages/opencode/src/agent/agent.ts b/packages/opencode/src/agent/agent.ts
index b88d031e2..d53d12efd 100644
--- a/packages/opencode/src/agent/agent.ts
+++ b/packages/opencode/src/agent/agent.ts
@@ -187,6 +187,7 @@ export namespace Agent {
       "*": "allow",
       bash, // kilocode_change
       doom_loop: "ask",
+      recall: "ask", // kilocode_change
       external_directory: {
         "*": "ask",
         ...Object.fromEntries(whitelistedDirs.map((dir) => [dir, "allow"])),
```

#### packages/opencode/src/kilocode/permission/routes.ts
```diff
diff --git a/packages/opencode/src/kilocode/permission/routes.ts b/packages/opencode/src/kilocode/permission/routes.ts
new file mode 100644
index 000000000..3321c2f10
--- /dev/null
+++ b/packages/opencode/src/kilocode/permission/routes.ts
@@ -0,0 +1,78 @@
+import { Hono } from "hono"
+import { describeRoute, resolver, validator } from "hono-openapi"
+import z from "zod"
+import { Config } from "@/config/config"
+import { PermissionNext } from "@/permission/next"
+import { Session } from "@/session"
+import { errors } from "../../server/error"
+import { lazy } from "../../util/lazy"
+
+export const PermissionKilocodeRoutes = lazy(() =>
+  new Hono().post(
+    "/allow-everything",
+    describeRoute({
+      summary: "Allow everything",
+      description: "Enable or disable allowing all permissions without prompts.",
+      operationId: "permission.allowEverything",
+      responses: {
+        200: {
+          description: "Success",
+          content: {
+            "application/json": {
+              schema: resolver(z.boolean()),
+            },
+          },
+        },
+        ...errors(400, 404),
+      },
+    }),
+    validator(
+      "json",
+      z.object({
+        enable: z.boolean(),
+        requestID: z.string().optional(),
+        sessionID: z.string().optional(),
+      }),
+    ),
+    async (c) => {
+      const body = c.req.valid("json")
+      const rules: PermissionNext.Ruleset = [{ permission: "*", pattern: "*", action: "allow" }]
+
+      if (!body.enable) {
+        if (body.sessionID) {
+          const session = await Session.get(body.sessionID)
+          await Session.setPermission({
```

#### packages/opencode/src/permission/next.ts
```diff
diff --git a/packages/opencode/src/permission/next.ts b/packages/opencode/src/permission/next.ts
index b68fafd1f..34b2cbee7 100644
--- a/packages/opencode/src/permission/next.ts
+++ b/packages/opencode/src/permission/next.ts
@@ -179,6 +179,7 @@ export namespace PermissionNext {
     return {
       pending,
       approved: stored,
+      session: {} as Record<string, Ruleset>, // kilocode_change
     }
   })
 
@@ -189,11 +190,12 @@ export namespace PermissionNext {
     async (input) => {
       const s = await state()
       const { ruleset, ...request } = input
+      const local = s.session[request.sessionID] ?? [] // kilocode_change
       // kilocode_change start — force "ask" for config file edits
       const protected_ = ConfigProtection.isRequest(request)
       // kilocode_change end
       for (const pattern of request.patterns ?? []) {
-        const rule = evaluate(request.permission, pattern, ruleset, s.approved)
+        const rule = evaluate(request.permission, pattern, ruleset, s.approved, local) // kilocode_change
         log.info("evaluated", { permission: request.permission, pattern, action: rule })
         if (rule.action === "deny")
           throw new DeniedError(ruleset.filter((r) => Wildcard.match(request.permission, r.permission)))
@@ -355,6 +357,58 @@ export namespace PermissionNext {
     },
   )
 
+  // kilocode_change start
+  export const allowEverything = fn(
+    z.object({
+      enable: z.boolean(),
+      requestID: Identifier.schema("permission").optional(),
+      sessionID: Identifier.schema("session").optional(),
+    }),
+    async (input) => {
+      const s = await state()
+
+      if (!input.enable) {
+        if (input.sessionID) {
+          delete s.session[input.sessionID]
+          return
+        }
+        const idx = s.approved.findLastIndex((r) => r.permission === "*" && r.pattern === "*" && r.action === "allow")
+        if (idx >= 0) s.approved.splice(idx, 1)
+        return
+      }
+
```

#### packages/opencode/src/tool/edit.ts
```diff
diff --git a/packages/opencode/src/tool/edit.ts b/packages/opencode/src/tool/edit.ts
index 5b4468e3c..9abb5e5e0 100644
--- a/packages/opencode/src/tool/edit.ts
+++ b/packages/opencode/src/tool/edit.ts
@@ -20,6 +20,27 @@ import { assertExternalDirectory } from "./external-directory"
 import { filterDiagnostics } from "./diagnostics" // kilocode_change
 
 const MAX_DIAGNOSTICS_PER_FILE = 20
+const MAX_DIFF_CONTENT = 500_000 // kilocode_change
+
+// kilocode_change start
+export function buildFileDiff(file: string, before: string, after: string): Snapshot.FileDiff {
+  const tooLarge = before.length > MAX_DIFF_CONTENT || after.length > MAX_DIFF_CONTENT
+  const fd: Snapshot.FileDiff = {
+    file,
+    before: tooLarge ? "" : before,
+    after: tooLarge ? "" : after,
+    additions: 0,
+    deletions: 0,
+  }
+  if (!tooLarge) {
+    for (const change of diffLines(before, after)) {
+      if (change.added) fd.additions += change.count || 0
+      if (change.removed) fd.deletions += change.count || 0
+    }
+  }
+  return fd
+}
+// kilocode_change end
 
 function normalizeLineEndings(text: string): string {
   return text.replaceAll("\r\n", "\n")
@@ -57,11 +78,14 @@ export const EditTool = Tool.define("edit", {
     let diff = ""
     let contentOld = ""
     let contentNew = ""
+    let cachedFilediff: Snapshot.FileDiff | undefined // kilocode_change
     await FileTime.withLock(filePath, async () => {
       if (params.oldString === "") {
         const existed = await Filesystem.exists(filePath)
+        if (existed) contentOld = await Filesystem.readText(filePath) // kilocode_change
         contentNew = params.newString
         diff = trimDiff(createTwoFilesPatch(filePath, filePath, contentOld, contentNew))
+        cachedFilediff = buildFileDiff(filePath, contentOld, contentNew) // kilocode_change
         await ctx.ask({
           permission: "edit",
           patterns: [path.relative(Instance.worktree, filePath)],
@@ -69,6 +93,7 @@ export const EditTool = Tool.define("edit", {
           metadata: {
             filepath: filePath,
```

#### packages/opencode/src/tool/recall.ts
```diff
diff --git a/packages/opencode/src/tool/recall.ts b/packages/opencode/src/tool/recall.ts
new file mode 100644
index 000000000..52697a335
--- /dev/null
+++ b/packages/opencode/src/tool/recall.ts
@@ -0,0 +1,150 @@
+// kilocode_change - new file
+import z from "zod"
+import { Tool } from "./tool"
+import { Instance } from "../project/instance"
+import { Locale } from "../util/locale"
+import { Filesystem } from "../util/filesystem" // kilocode_change
+import { WorktreeFamily } from "../kilocode/worktree-family" // kilocode_change
+import DESCRIPTION from "./recall.txt"
+
+export const RecallTool = Tool.define("kilo_local_recall", {
+  description: DESCRIPTION,
+  parameters: z.object({
+    mode: z.enum(["search", "read"]).describe("'search' to find sessions by title, 'read' to get a session transcript"),
+    query: z.string().optional().describe("Search query to match against session titles (required for search mode)"),
+    sessionID: z.string().optional().describe("Session ID to read the transcript of (required for read mode)"),
+    limit: z.number().optional().describe("Maximum number of search results to return (default: 20, max: 50)"),
+  }),
+  async execute(params, ctx) {
+    if (params.mode === "search") {
+      return search(params, ctx)
+    }
+    return read(params, ctx)
+  },
+})
+
+async function search(params: { query?: string; limit?: number }, ctx: Tool.Context) {
+  if (!params.query) {
+    throw new Error("The 'query' parameter is required when mode is 'search'")
+  }
+
+  await ctx.ask({
+    permission: "recall",
+    patterns: ["search"],
+    always: ["search"],
+    metadata: {
+      mode: "search",
+      query: params.query,
+    },
+  })
+
+  const limit = Math.min(params.limit ?? 20, 50)
+  const dirs = await WorktreeFamily.list() // kilocode_change
+  const { Session } = await import("../session/index") // kilocode_change
+
```


*... and more files (showing first 5)*

## opencode Changes (ae614d9..847fc9d)

### Commits

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
- `packages/opencode/src/tool/registry.ts` (+62, -38)
- `packages/opencode/src/tool/task.ts` (+152, -129)
- `packages/opencode/src/tool/tool.ts` (+18, -8)
- `packages/opencode/test/tool/task.test.ts` (+398, -36)
- `packages/opencode/test/tool/webfetch.test.ts` (+15, -72)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/console/core/package.json` (+1, -1)

#### Other Changes
- `bun.lock` (+47, -29)
- `nix/hashes.json` (+4, -4)
- `package.json` (+2, -1)
- `packages/app/package.json` (+1, -1)
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
- `packages/enterprise/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/function/package.json` (+1, -1)
- `packages/opencode/package.json` (+3, -3)
- `packages/opencode/script/build-node.ts` (+5, -16)
- `packages/opencode/src/cli/cmd/db.ts` (+2, -1)
- `packages/opencode/src/cli/cmd/run.ts` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/component/dialog-go-upsell.tsx` (+99, -0)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+23, -0)
- `packages/opencode/src/cli/cmd/tui/worker.ts` (+1, -1)
- `packages/opencode/src/config/config.ts` (+75, -19)
- `packages/opencode/src/file/time.ts` (+1, -1)
- `packages/opencode/src/index.ts` (+2, -1)
- `packages/opencode/src/lsp/index.ts` (+1, -1)
- `packages/opencode/src/lsp/server.ts` (+1, -1)
- `packages/opencode/src/mcp/index.ts` (+1, -1)
- `packages/opencode/src/node.ts` (+5, -0)
- `packages/opencode/src/plugin/index.ts` (+1, -1)
- `packages/opencode/src/project/project.ts` (+1, -1)
- `packages/opencode/src/provider/models-snapshot.d.ts` (+2, -0)
- `packages/opencode/src/provider/models-snapshot.js` (+61474, -0)
- `packages/opencode/src/provider/models.ts` (+0, -3)
- `packages/opencode/src/provider/provider.ts` (+3, -2)
- `packages/opencode/src/provider/transform.ts` (+2, -1)
- `packages/opencode/src/server/instance.ts` (+8, -5)
- `packages/opencode/src/server/proxy.ts` (+11, -8)
- `packages/opencode/src/server/router.ts` (+1, -1)
- `packages/opencode/src/server/routes/provider.ts` (+1, -1)
- `packages/opencode/src/server/routes/session.ts` (+10, -12)
- `packages/opencode/src/server/server.ts` (+6, -3)
- `packages/opencode/src/session/compaction.ts` (+15, -17)
- `packages/opencode/src/session/llm.ts` (+56, -0)
- `packages/opencode/src/session/message-v2.ts` (+12, -5)
- `packages/opencode/src/session/processor.ts` (+14, -22)
- `packages/opencode/src/session/prompt.ts` (+141, -143)
- `packages/opencode/src/session/retry.ts` (+5, -2)
- `packages/opencode/src/shell/shell.ts` (+3, -3)
- `packages/opencode/src/storage/json-migration.ts` (+10, -10)
- `packages/opencode/test/server/project-init-git.test.ts` (+2, -2)
- `packages/opencode/test/server/session-actions.test.ts` (+2, -2)
- `packages/opencode/test/server/session-messages.test.ts` (+4, -4)
- `packages/opencode/test/server/session-select.test.ts` (+3, -3)
- `packages/opencode/test/session/compaction.test.ts` (+0, -1)
- `packages/opencode/test/session/processor-effect.test.ts` (+0, -6)
- `packages/opencode/test/session/prompt-effect.test.ts` (+125, -27)
- `packages/opencode/test/storage/json-migration.test.ts` (+30, -47)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+32, -90)
- `packages/sdk/openapi.json` (+79, -271)
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

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 27bbe65..5184c2f 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.4.0",
+  "version": "1.4.1",
   "private": true,
   "type": "module",
   "license": "MIT",
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
index 7291105..800c45c 100644
--- a/packages/opencode/src/tool/registry.ts
+++ b/packages/opencode/src/tool/registry.ts
@@ -42,20 +42,25 @@ import { Agent } from "../agent/agent"
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
 
   export class Service extends ServiceMap.Service<Service, Interface>()("@opencode/ToolRegistry") {}
@@ -67,6 +72,7 @@ export namespace ToolRegistry {
     | Plugin.Service
     | Question.Service
     | Todo.Service
+    | Agent.Service
     | LSP.Service
     | FileTime.Service
     | Instruction.Service
@@ -77,8 +83,10 @@ export namespace ToolRegistry {
       const config = yield* Config.Service
       const plugin = yield* Plugin.Service
 
-      const build = <T extends Tool.Info>(tool: T | Effect.Effect<T, never, any>) =>
-        Effect.isEffect(tool) ? tool.pipe(Effect.flatMap(Tool.init)) : Tool.init(tool)
+      const task = yield* TaskTool
+      const read = yield* ReadTool
+      const question = yield* QuestionTool
+      const todo = yield* TodoWriteTool
 
```

#### packages/opencode/src/tool/task.ts
```diff
diff --git a/packages/opencode/src/tool/task.ts b/packages/opencode/src/tool/task.ts
index 07e779f..73b55a2 100644
--- a/packages/opencode/src/tool/task.ts
+++ b/packages/opencode/src/tool/task.ts
@@ -6,96 +6,101 @@ import { SessionID, MessageID } from "../session/schema"
 import { MessageV2 } from "../session/message-v2"
 import { Agent } from "../agent/agent"
 import { SessionPrompt } from "../session/prompt"
-import { iife } from "@/util/iife"
-import { defer } from "@/util/defer"
 import { Config } from "../config/config"
 import { Permission } from "@/permission"
 import { Effect } from "effect"
 
-export const TaskTool = Tool.define("task", async () => {
-  const agents = await Agent.list().then((x) => x.filter((a) => a.mode !== "primary"))
-  const list = agents.toSorted((a, b) => a.name.localeCompare(b.name))
-  const agentList = list
-    .map((a) => `- ${a.name}: ${a.description ?? "This subagent should only be called manually by the user."}`)
-    .join("\n")
-  const description = [`Available agent types and the tools they have access to:`, agentList].join("\n")
-
-  return {
-    description,
-    parameters: z.object({
-      description: z.string().describe("A short (3-5 words) description of the task"),
-      prompt: z.string().describe("The task for the agent to perform"),
-      subagent_type: z.string().describe("The type of specialized agent to use for this task"),
-      task_id: z
-        .string()
-        .describe(
-          "This should only be set if you mean to resume a previous task (you can pass a prior task_id and the task will continue the same subagent session as before instead of creating a fresh one)",
-        )
-        .optional(),
-      command: z.string().describe("The command that triggered this task").optional(),
-    }),
-    async execute(params, ctx) {
-      const config = await Config.get()
+const id = "task"
+
+const parameters = z.object({
+  description: z.string().describe("A short (3-5 words) description of the task"),
+  prompt: z.string().describe("The task for the agent to perform"),
+  subagent_type: z.string().describe("The type of specialized agent to use for this task"),
+  task_id: z
+    .string()
+    .describe(
+      "This should only be set if you mean to resume a previous task (you can pass a prior task_id and the task will continue the same subagent session as before instead of creating a fresh one)",
+    )
+    .optional(),
```

#### packages/opencode/src/tool/tool.ts
```diff
diff --git a/packages/opencode/src/tool/tool.ts b/packages/opencode/src/tool/tool.ts
index 6d129f4..ae34734 100644
--- a/packages/opencode/src/tool/tool.ts
+++ b/packages/opencode/src/tool/tool.ts
@@ -60,6 +60,13 @@ export namespace Tool {
   export type InferMetadata<T> =
     T extends Info<any, infer M> ? M : T extends Effect.Effect<Info<any, infer M>, any, any> ? M : never
 
+  export type InferDef<T> =
+    T extends Info<infer P, infer M>
+      ? Def<P, M>
+      : T extends Effect.Effect<Info<infer P, infer M>, any, any>
+        ? Def<P, M>
+        : never
+
   function wrap<Parameters extends z.ZodType, Result extends Metadata>(
     id: string,
     init: (() => Promise<DefWithoutID<Parameters, Result>>) | DefWithoutID<Parameters, Result>,
@@ -98,24 +105,27 @@ export namespace Tool {
     }
   }
 
-  export function define<Parameters extends z.ZodType, Result extends Metadata>(
-    id: string,
+  export function define<Parameters extends z.ZodType, Result extends Metadata, ID extends string = string>(
+    id: ID,
     init: (() => Promise<DefWithoutID<Parameters, Result>>) | DefWithoutID<Parameters, Result>,
-  ): Info<Parameters, Result> {
+  ): Info<Parameters, Result> & { id: ID } {
     return {
       id,
       init: wrap(id, init),
     }
   }
 
-  export function defineEffect<Parameters extends z.ZodType, Result extends Metadata, R>(
-    id: string,
+  export function defineEffect<Parameters extends z.ZodType, Result extends Metadata, R, ID extends string = string>(
+    id: ID,
     init: Effect.Effect<(() => Promise<DefWithoutID<Parameters, Result>>) | DefWithoutID<Parameters, Result>, never, R>,
-  ): Effect.Effect<Info<Parameters, Result>, never, R> {
-    return Effect.map(init, (next) => ({ id, init: wrap(id, next) }))
+  ): Effect.Effect<Info<Parameters, Result>, never, R> & { id: ID } {
+    return Object.assign(
+      Effect.map(init, (next) => ({ id, init: wrap(id, next) })),
+      { id },
+    )
   }
 
-  export function init(info: Info): Effect.Effect<Def, never, any> {
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/agent.ts
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
- `src/tool/task.test.ts` - update based on opencode packages/opencode/test/tool/task.test.ts changes
- `src/tool/task.ts` - update based on opencode packages/opencode/src/tool/task.ts changes
- `src/tool/tool.ts` - update based on opencode packages/opencode/src/tool/tool.ts changes
- `src/tool/webfetch.test.ts` - update based on opencode packages/opencode/test/tool/webfetch.test.ts changes
- `src/tool/write.ts` - update based on kilocode packages/opencode/src/tool/write.ts changes
