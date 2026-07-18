# Upstream Changes Report
Generated: 2026-07-18 07:50:53

## Summary
- kilocode: 131 commits, 1129 files changed
- opencode: 23 commits, 131 files changed

## kilocode Changes (957ddf11b..938919ab7)

### Commits

- 938919ab7 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-07-17)
- 2742b573f - Merge pull request #12204 from Kilo-Org/johnnyeric/kilo-opencode-v1.17.4 (Johnny Eric Amancio, 2026-07-17)
- 6737edf1e - Merge pull request #12295 from Kilo-Org/chore/jetbrains-cli-pin-v7.4.11 (Kirill Kalishev, 2026-07-17)
- 3e0d20c03 - Merge remote-tracking branch 'origin/main' into johnnyeric/kilo-opencode-v1.17.4 (Johnny Amancio, 2026-07-17)
- a4aceaa2b - test(cli): stabilize compaction interruption tests on loaded CI runners (#12311) (Marius, 2026-07-17)
- 0846e067b - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-07-17)
- 2be0b2f7e - Merge pull request #12306 from Kilo-Org/custom-file-extensions-for-indexing (Marius, 2026-07-17)
- 00d00749a - chore(vscode): format indexing translation (marius-kilocode, 2026-07-17)
- ca19c858a - fix(vscode): translate indexing extension settings (marius-kilocode, 2026-07-17)
- 8861ec1f1 - Merge remote-tracking branch 'origin/main' into johnnyeric/kilo-opencode-v1.17.4 (Johnny Amancio, 2026-07-17)
- c081f582a - feat(indexing): support custom file extensions (marius-kilocode, 2026-07-17)
- 2c070e6e6 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-07-17)
- e7e31bdd5 - Merge pull request #12303 from Kilo-Org/fix/cli-sidebar-usage (Jean du Plessis, 2026-07-17)
- 8426d8608 - Merge pull request #12279 from Kilo-Org/change-agent-manager-plus-default (Marius, 2026-07-17)
- 81632df83 - Merge pull request #12213 from Kilo-Org/research-review-unresumable-session (Marius, 2026-07-17)
- f2eb57a26 - Merge pull request #12271 from Kilo-Org/agent-manager-stop-session (Marius, 2026-07-17)
- 36037284d - fix(vscode): acknowledge static review commands (marius-kilocode, 2026-07-17)
- 55fe1608f - fix(cli): finish deprecated review commands (marius-kilocode, 2026-07-17)
- d854c1077 - fix(vscode): respect terminal display for background processes (#12301) (Marius, 2026-07-17)
- 256c965f1 - test(cli): exercise production usage rows (Jean du Plessis, 2026-07-17)
- 7c07a4746 - fix(cli): improve sidebar usage display (Jean du Plessis, 2026-07-17)
- 37527222c - fix(agent-manager): restore worktree shortcut routing (marius-kilocode, 2026-07-17)
- 6ce16e7ca - fix(agent-manager): open worktree dialog by default (marius-kilocode, 2026-07-17)
- 62cf08c81 - Merge branch 'main' into agent-manager-stop-session (Marius, 2026-07-17)
- c05ccf0a8 - chore(jetbrains): bump CLI pin to v7.4.11 (kilo-maintainer[bot], 2026-07-16)
- 77fcd3299 - chore: reconcile remote PR ancestry (Johnny Amancio, 2026-07-16)
- 1ac30237d - Merge remote-tracking branch 'origin/main' into johnnyeric/kilo-opencode-v1.17.4 (Johnny Amancio, 2026-07-16)
- 1872dbc25 - fix(opencode): address fourth-pass upstream review (Johnny Amancio, 2026-07-16)
- d4fc1f011 - chore(ci): clarify Kilo test workflow markers (Johnny Amancio, 2026-07-16)
- 983af1738 - Merge remote-tracking branch 'origin/main' into johnnyeric/kilo-opencode-v1.17.4 (Johnny Amancio, 2026-07-16)
- 03a14d1b9 - chore(ci): clarify Kilo test workflow markers (Johnny Amancio, 2026-07-16)
- 1db40dcf1 - fix(agent-manager): harden stop session action (marius-kilocode, 2026-07-16)
- 627be20ed - Merge remote-tracking branch 'origin/main' into johnnyeric/kilo-opencode-v1.17.4 (Johnny Amancio, 2026-07-16)
- a87ddecf8 - Merge remote-tracking branch 'origin/main' into johnnyeric/kilo-opencode-v1.17.4 (Johnny Amancio, 2026-07-16)
- e6d04275d - fix: address third-pass upstream merge review (Johnny Amancio, 2026-07-16)
- c012826f3 - test(agent-manager): cover session close notification (marius-kilocode, 2026-07-16)
- 38013f70f - feat(agent-manager): stop managed sessions from tool (marius-kilocode, 2026-07-16)
- 790affb98 - fix: address v1.17.4 compatibility review (Johnny Amancio, 2026-07-15)
- 2d92d8dae - chore: merge latest Kilo main (Johnny Amancio, 2026-07-15)
- e2d66144c - fix: address upstream merge bot and CI findings (Johnny Amancio, 2026-07-15)
- bfcb91164 - fix: address upstream merge review findings (Johnny Amancio, 2026-07-15)
- d093f813a - chore: merge latest Kilo main (Johnny Amancio, 2026-07-14)
- 4e2d04a17 - fix(opencode): complete v1.17.4 compatibility (Johnny Amancio, 2026-07-14)
- 68b59571a - resolve merge conflicts (Johnny Amancio, 2026-07-14)
- fe8e18730 - merge: record upstream v1.17.4 (Johnny Amancio, 2026-07-13)
- 2855ebbe4 - refactor: kilo compat for v1.17.4 (Johnny Amancio, 2026-07-13)
- 5d2f88866 - chore(opencode): record v1.16.2 compatibility ancestry (Johnny Amancio, 2026-07-13)
- 277002895 - refactor: kilo compat for v1.16.2 (Johnny Amancio, 2026-07-07)
- abda3515f - release: v1.17.4 (opencode, 2026-06-12)
- 03a2504d3 - fix(tui): shorten move session description (#31967) (David Hill, 2026-06-11)
- bace18ccd - zen: make payment method off_session (Frank, 2026-06-11)
- cd2e6f06e - chore: generate (opencode-agent[bot], 2026-06-11)
- 7e7ad3773 - feat(opencode): support cwd on local MCP servers (#30676) (Grant Martin, 2026-06-11)
- ca8db315a - fix(tui): show prompt submission errors (#31949) (Aiden Cline, 2026-06-11)
- 9eb07ab55 - chore: generate (opencode-agent[bot], 2026-06-11)
- e07e42063 - fix(stats): align deep route metadata with /data (#31930) (Adam, 2026-06-11)
- 84f94e614 - chore: generate (opencode-agent[bot], 2026-06-11)
- a150424c1 - fix(tui): show terminal tool failure labels (#31934) (Aiden Cline, 2026-06-11)
- 2e71292f2 - fix(gemini): prevent gemini incompatibility with some tools (#31877) (Linus Schlumberger, 2026-06-11)
- e2527db3c - fix(opencode): surface content-filter finish reason as visible error (#31745) (Kevin Dawkins, 2026-06-11)
- a1dee8b27 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-11)
- 04e5ca9d1 - chore: bump gitlab-ai-provider to 6.9.3 and opencode-gitlab-auth to 2.1.0 (#31913) (Vladimir Glafirov, 2026-06-11)
- 6dd4d1473 - chore: generate (opencode-agent[bot], 2026-06-11)
- 31c5454ee - refactor(server): serve raw filesystem content (#31911) (Dax, 2026-06-11)
- 31b233e9d - chore: generate (opencode-agent[bot], 2026-06-11)
- 567d6ed1a - fix(tui): restore legacy sync consumers (#31908) (Dax, 2026-06-11)
- 2bde20c2b - test(opencode): simplify snapshot race layer wiring (#31827) (James Long, 2026-06-11)
- 92c70c9c3 - fix(tui): preserve exit epilogue during scoped shutdown (#31805) (tobwen, 2026-06-11)
- 318dbe93b - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-11)
- 8bd249d8c - upgrade opentui-spinner (#31561) (Sebastian, 2026-06-11)
- 710e40870 - chore: generate (opencode-agent[bot], 2026-06-11)
- dac0dd530 - feat(core): add connector authentication (#31837) (Dax, 2026-06-11)
- bf05e8a12 - fix(mcp): preserve headers during auth and debug (#31802) (Aiden Cline, 2026-06-10)
- 51b10b128 - chore: generate (opencode-agent[bot], 2026-06-11)
- 47a45601f - refactor(tui): replace v2 sync with data context (#31826) (Dax, 2026-06-10)
- 69623c2b7 - chore: generate (opencode-agent[bot], 2026-06-11)
- 38536cf73 - test(opencode): simplify processor layer wiring (#31823) (James Long, 2026-06-10)
- 8bf067599 - feat(server): add v2 session API endpoints (#31822) (Dax, 2026-06-11)
- ff967e582 - chore: generate (opencode-agent[bot], 2026-06-11)
- 20bf18ffb - test(opencode): simplify share layer wiring (#31811) (James Long, 2026-06-10)
- 51891d56e - fix(snapshot): reuse source git objects to avoid re-hashing huge repos (#31798) (Dmitriy Kovalenko, 2026-06-11)
- cc2264646 - docs: add branch naming guidance (Dax Raad, 2026-06-10)
- eb70b6137 - test(opencode): simplify test registry layer wiring (#31761) (James Long, 2026-06-10)
- 6e2bcafd3 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-10)
- 07b983e82 - feat(mcp): support server log notifications (#31752) (Aiden Cline, 2026-06-10)
- c51a1588c - tui: fix session list search filtering (#31748) (Simon Klee, 2026-06-10)
- f43b0d3af - fix(mcp): apply timeouts to catalog requests (#31618) (Aiden Cline, 2026-06-10)
- 722f4dd41 - chore: pin gitlab-ai-provider to 6.9.0 (#31741) (Vladimir Glafirov, 2026-06-10)
- bb82aab5c - update opencode.jsonc (Dax Raad, 2026-06-10)
- 936363e7a - sync release versions for v1.17.3 (opencode, 2026-06-10)
- 8688ed7e3 - feat(web): data link (Adam, 2026-06-10)
- 5b5420316 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-10)
- bed780fac - chore: bump gitlab-ai-provider to 6.9.1 (#31728) (Vladimir Glafirov, 2026-06-10)
- 14ec7ed5b - fix fff disabling logic (Dax Raad, 2026-06-10)
- 2c6527320 - sync release versions for v1.17.2 (opencode, 2026-06-10)
- 2e0f88d0e - fix(desktop): restore linux launcher identity (#31709) (Filip, 2026-06-10)
- e1073e5d1 - chore: generate (opencode-agent[bot], 2026-06-10)
- 649618c50 - fix(app): restore device attachment picker (#31707) (mridul, 2026-06-10)
- 02608a4e9 - fix: recover from expired enterprise auth on remote config load (#31661) (Ayush Thakur, 2026-06-10)
- 3ad6923c6 - fix(opencode): let subagents use their own permissions (#31696) (Aiden Cline, 2026-06-10)
- e4300e9b7 - fix(core): disable fff by default on windows (Dax Raad, 2026-06-10)
- 538cfaff0 - feat(core): enable fff by default (Dax Raad, 2026-06-10)
- 1dad38d1b - fix(core): do not gate fff on initial scan (Dax Raad, 2026-06-10)
- c9e2a38bf - ci: change model from gpt-5.4-nano to gpt-5.4-mini (#31695) (Aiden Cline, 2026-06-10)
- 5863e1254 - put fff behind flag (Dax Raad, 2026-06-10)
- 4c9abff44 - sync release versions for v1.17.1 (opencode, 2026-06-10)
- 2cf68f32b - chore: generate (opencode-agent[bot], 2026-06-10)
- 90fb32be3 - fix(core): accept deprecated reference config key (#31659) (Luke Parker, 2026-06-10)
- 97e713e8a - zen: deepseek v4 pro (Frank, 2026-06-10)
- 826419127 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-10)
- e0449c0b9 - fix(desktop): restore macOS auto-updates (#31621) (Luke Parker, 2026-06-10)
- 5e342f711 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-10)
- 174ab5834 - fix(mcp): apply timeouts to prompts and resources (#31612) (Aiden Cline, 2026-06-09)
- 954d61879 - fix(opencode): support Anthropic fallback responses (#31611) (Aiden Cline, 2026-06-09)
- 91073360c - fix(mcp): make client creation failure-safe (#31595) (Aiden Cline, 2026-06-09)
- 8a2cfc00c - feat(core): add project reference guidance (#31601) (Dax, 2026-06-10)
- 0fc33e2a0 - feat(app): /new-session route for new design (#31457) (Brendan Allan, 2026-06-10)
- 6c6ed68b5 - sync release versions for v1.17.0 (opencode, 2026-06-10)
- e9106efbd - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-10)
- e9e261270 - chore: Update fff to 0.9.4 (#31583) (Dmitriy Kovalenko, 2026-06-09)
- 4ae468ff0 - chore: generate (opencode-agent[bot], 2026-06-10)
- 785918262 - fix(core): expose partial filesystem scan results (Dax Raad, 2026-06-09)
- be8fee5c2 - chore: generate (opencode-agent[bot], 2026-06-10)
- 4597c687f - fix(core): prefer shorter paths for tied search scores (Dax Raad, 2026-06-09)
- c4aa04904 - fix(tui): let gutter replace current marker (#31586) (Dax, 2026-06-09)
- 1d46b5c33 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-10)
- 6ae6f0fe8 - chore: generate (opencode-agent[bot], 2026-06-10)
- a0409e64d - refactor(core): unify filesystem search service (#31566) (Dax, 2026-06-09)
- ce4e658e3 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-09)
- 215fb39fc - chore: generate (opencode-agent[bot], 2026-06-09)
- 1cc94bb23 - fix(desktop): update Electron stack and panel layout (#31571) (Luke Parker, 2026-06-09)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/core/src/tool/AGENTS.md` (+36, -116)
- `packages/core/src/tool/application-tools.ts` (+19, -12)
- `packages/core/src/tool/apply-patch.ts` (+130, -129)
- `packages/core/src/tool/bash.ts` (+97, -97)
- `packages/core/src/tool/builtins.ts` (+5, -4)
- `packages/core/src/tool/edit.ts` (+112, -88)
- `packages/core/src/tool/glob.ts` (+123, -66)
- `packages/core/src/tool/grep.ts` (+145, -74)
- `packages/core/src/tool/native.ts` (+0, -73)
- `packages/core/src/tool/question.ts` (+43, -33)
- `packages/core/src/tool/read-filesystem.ts` (+331, -0)
- `packages/core/src/tool/read.ts` (+86, -81)
- `packages/core/src/tool/registry.ts` (+105, -164)
- `packages/core/src/tool/skill.ts` (+48, -51)
- `packages/core/src/tool/todowrite.ts` (+36, -32)
- `packages/core/src/tool/tool.ts` (+144, -0)
- `packages/core/src/tool/tools.ts` (+13, -0)
- `packages/core/src/tool/webfetch.ts` (+70, -77)
- `packages/core/src/tool/websearch.ts` (+66, -78)
- `packages/core/src/tool/write.ts` (+53, -36)
- `packages/opencode/src/kilocode/tool/agent-manager.ts` (+40, -12)
- `packages/opencode/src/kilocode/tool/agent-manager.txt` (+1, -1)
- `packages/opencode/src/kilocode/tool/task.ts` (+8, -3)
- `packages/opencode/src/tool/external-directory.ts` (+5, -5)
- `packages/opencode/src/tool/glob.ts` (+15, -37)
- `packages/opencode/src/tool/glob.txt` (+1, -1)
- `packages/opencode/src/tool/grep.ts` (+27, -62)
- `packages/opencode/src/tool/grep.txt` (+1, -1)
- `packages/opencode/src/tool/read.ts` (+17, -9)
- `packages/opencode/src/tool/registry.ts` (+62, -67)
- `packages/opencode/src/tool/repo_clone.ts` (+5, -4)
- `packages/opencode/src/tool/shell.ts` (+2, -5)
- `packages/opencode/src/tool/skill.ts` (+11, -12)
- `packages/opencode/src/tool/task.ts` (+50, -61)
- `packages/opencode/src/tool/truncate.ts` (+4, -6)
- `packages/opencode/src/tool/warpgrep.ts` (+1, -1)
- `packages/opencode/test/kilocode/tool/repo_clone.test.ts` (+16, -9)
- `packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap` (+1, -1)
- `packages/opencode/test/tool/glob.test.ts` (+4, -106)
- `packages/opencode/test/tool/grep.test.ts` (+41, -61)
- `packages/opencode/test/tool/read.test.ts` (+2, -49)
- `packages/opencode/test/tool/registry.test.ts` (+16, -67)
- `packages/opencode/test/tool/skill.test.ts` (+5, -1)
- `packages/opencode/test/tool/task.test.ts` (+4, -3)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+79, -31)
- `packages/opencode/src/agent/subagent-permissions.ts` (+4, -12)
- `packages/opencode/src/kilocode/agent/index.ts` (+6, -0)
- `packages/opencode/test/agent/agent.test.ts` (+53, -2)
- `packages/opencode/test/agent/plan-mode-subagent-bypass.test.ts` (+33, -68)
- `packages/opencode/test/agent/plugin-agent-regression.test.ts` (+4, -0)

#### Permission System (**/permission/)
- `packages/opencode/src/kilocode/permission/agent-manager.ts` (+3, -3)
- `packages/opencode/src/permission/index.ts` (+7, -7)
- `packages/opencode/test/kilocode/permission/agent-manager-prompt.test.ts` (+7, -3)

#### Event Bus (**/bus/, **/event/)
- `packages/opencode/src/bus/index.ts` (+21, -14)

#### Core (**/core/)
- `packages/core/migration/20260605042240_add_context_epoch_agent/snapshot.json` (+45, -138)
- `packages/core/migration/20260611035744_credential/migration.sql` (+12, -0)
- `packages/core/migration/20260611035744_credential/snapshot.json` (+2095, -0)
- `packages/core/migration/20260714141136_session-message-legacy-writer-compat/snapshot.json` (+109, -2)
- `packages/core/package.json` (+11, -4)
- `packages/core/src/agent.ts` (+2, -5)
- `packages/core/src/auth.ts` (+0, -352)
- `packages/core/src/catalog.ts` (+53, -27)
- `packages/core/src/command.ts` (+2, -0)
- `packages/core/src/config.ts` (+15, -6)
- `packages/core/src/config/compaction.ts` (+0, -1)
- `packages/core/src/config/mcp.ts` (+3, -0)
- `packages/core/src/config/plugin/agent.ts` (+1, -2)
- `packages/core/src/config/plugin/provider.ts` (+23, -7)
- `packages/core/src/config/plugin/reference.ts` (+72, -0)
- `packages/core/src/config/reference.ts` (+4, -30)
- `packages/core/src/connector.ts` (+538, -0)
- `packages/core/src/connector/schema.ts` (+9, -0)
- `packages/core/src/control-plane/move-session.ts` (+2, -0)
- `packages/core/src/credential.ts` (+620, -0)
- `packages/core/src/credential/sql.ts` (+23, -0)
- `packages/core/src/cross-spawn-spawner.ts` (+20, -0)
- `packages/core/src/database/database.ts` (+3, -0)
- `packages/core/src/database/migration.gen.ts` (+1, -0)
- `packages/core/src/database/migration/20260611035744_credential.ts` (+25, -0)
- `packages/core/src/effect/layer-node-platform.ts` (+12, -0)
- `packages/core/src/effect/layer-node.ts` (+102, -0)
- `packages/core/src/effect/logger.ts` (+0, -73)
- `packages/core/src/effect/observability.ts` (+0, -107)
- `packages/core/src/effect/runtime.ts` (+1, -1)
- `packages/core/src/event.ts` (+8, -4)
- `packages/core/src/file-mutation.ts` (+64, -72)
- `packages/core/src/filesystem.ts` (+91, -507)
- `packages/core/src/filesystem/fff.bun.ts` (+140, -0)
- `packages/core/src/filesystem/fff.node.ts` (+138, -0)
- `packages/core/src/filesystem/ripgrep.ts` (+0, -487)
- `packages/core/src/filesystem/schema.ts` (+23, -0)
- `packages/core/src/filesystem/search.ts` (+297, -0)
- `packages/core/src/filesystem/watcher.ts` (+10, -10)
- `packages/core/src/flag/flag.ts` (+61, -24)
- `packages/core/src/fs-util.ts` (+3, -0)
- `packages/core/src/git.ts` (+17, -4)
- `packages/core/src/global.ts` (+2, -0)
- `packages/core/src/image.ts` (+92, -0)
- `packages/core/src/image/photon.ts` (+110, -0)
- `packages/core/src/instruction-context.ts` (+1, -1)
- `packages/core/src/kilocode/credential-migration.ts` (+48, -0)
- `packages/core/src/kilocode/fff.ts` (+9, -0)
- `packages/core/src/kilocode/image-size.ts` (+73, -0)
- `packages/core/src/kilocode/search-target.ts` (+39, -0)
- `packages/core/src/kilocode/session-message.ts` (+51, -0)
- `packages/core/src/kilocode/spawn-validation.ts` (+15, -0)
- `packages/core/src/location-layer.ts` (+32, -20)
- `packages/core/src/location-mutation.ts` (+34, -190)
- `packages/core/src/location-search.ts` (+0, -198)
- `packages/core/src/location.ts` (+3, -4)
- `packages/core/src/model-request.ts` (+124, -0)
- `packages/core/src/model.ts` (+5, -2)
- `packages/core/src/models-dev.ts` (+5, -4)
- `packages/core/src/npm.ts` (+3, -0)
- `packages/core/src/observability.ts` (+21, -0)
- `packages/core/src/observability/logging.ts` (+71, -0)
- `packages/core/src/observability/otlp.ts` (+79, -0)
- `packages/core/src/observability/shared.ts` (+1, -0)
- `packages/core/src/plugin.ts` (+0, -8)
- `packages/core/src/plugin/account.ts` (+0, -52)
- `packages/core/src/plugin/agent.ts` (+1, -1)
- `packages/core/src/plugin/boot.ts` (+16, -6)
- `packages/core/src/plugin/models-dev.ts` (+31, -7)
- `packages/core/src/plugin/provider/cloudflare-ai-gateway.ts` (+1, -1)
- `packages/core/src/plugin/provider/cloudflare-workers-ai.ts` (+8, -2)
- `packages/core/src/plugin/provider/google-vertex.ts` (+4, -1)
- `packages/core/src/plugin/provider/openai-auth.ts` (+258, -0)
- `packages/core/src/plugin/provider/openai.ts` (+7, -0)
- `packages/core/src/plugin/provider/opencode.ts` (+1, -1)
- `packages/core/src/plugin/skill/customize-opencode.md` (+50, -2)
- `packages/core/src/process.ts` (+2, -0)
- `packages/core/src/project-reference.ts` (+0, -241)
- `packages/core/src/project.ts` (+12, -6)
- `packages/core/src/project/copy-strategies.ts` (+4, -4)
- `packages/core/src/project/copy.ts` (+8, -2)
- `packages/core/src/provider.ts` (+3, -2)
- `packages/core/src/pty.ts` (+4, -7)
- `packages/core/src/pty/ticket.ts` (+2, -0)
- `packages/core/src/public/opencode.ts` (+65, -12)
- `packages/core/src/public/session.ts` (+29, -1)
- `packages/core/src/public/tool.ts` (+6, -6)
- `packages/core/src/reference.ts` (+148, -0)
- `packages/core/src/reference/guidance.ts` (+69, -0)
- `packages/core/src/ripgrep.ts` (+151, -29)
- `packages/core/src/ripgrep/binary.ts` (+131, -0)
- `packages/core/src/session.ts` (+42, -27)
- `packages/core/src/session/compaction.ts` (+247, -0)
- `packages/core/src/session/event.ts` (+53, -26)
- `packages/core/src/session/execution.ts` (+7, -2)
- `packages/core/src/session/execution/local.ts` (+16, -16)
- `packages/core/src/session/history.ts` (+19, -6)
- `packages/core/src/session/input.ts` (+0, -1)
- `packages/core/src/session/logging.ts` (+8, -0)
- `packages/core/src/session/message-updater.ts` (+8, -48)
- `packages/core/src/session/message.ts` (+9, -10)
- `packages/core/src/session/projector.ts` (+22, -32)
- `packages/core/src/session/prompt.ts` (+1, -15)
- `packages/core/src/session/run-coordinator.ts` (+172, -71)
- `packages/core/src/session/runner/index.ts` (+2, -0)
- `packages/core/src/session/runner/llm.ts` (+134, -50)
- `packages/core/src/session/runner/model.ts` (+15, -9)
- `packages/core/src/session/runner/publish-llm-event.ts` (+27, -18)
- `packages/core/src/session/runner/to-llm-message.ts` (+13, -5)
- `packages/core/src/session/store.ts` (+4, -1)
- `packages/core/src/skill/discovery.ts` (+4, -11)
- `packages/core/src/state.ts` (+36, -19)
- `packages/core/src/system-context/builtins.ts` (+1, -1)
- `packages/core/src/system-context/registry.ts` (+12, -12)
- `packages/core/src/tool-output-store.ts` (+77, -240)
- `packages/core/src/tool-output.ts` (+0, -11)
- `packages/core/src/util/effect-flock.ts` (+2, -0)
- `packages/core/src/util/token.ts` (+5, -0)
- `packages/core/src/v1/config/config.ts` (+6, -3)
- `packages/core/src/v1/config/error.ts` (+5, -0)
- `packages/core/src/v1/config/mcp.ts` (+3, -0)
- `packages/core/src/v1/config/migrate.ts` (+23, -7)
- `packages/core/src/v1/config/provider.ts` (+1, -1)
- `packages/core/src/v1/config/reference.ts` (+0, -24)
- `packages/core/src/v1/session.ts` (+4, -0)
- `packages/core/test/account.test.ts` (+0, -284)
- `packages/core/test/agent.test.ts` (+1, -1)
- `packages/core/test/application-tools.test.ts` (+155, -48)
- `packages/core/test/catalog.test.ts` (+117, -1)
- `packages/core/test/config/config.test.ts` (+171, -23)
- `packages/core/test/config/provider.test.ts` (+119, -1)
- `packages/core/test/connector.test.ts` (+681, -0)
- `packages/core/test/credential.test.ts` (+390, -0)
- `packages/core/test/effect/observability.test.ts` (+64, -1)
- `packages/core/test/file-mutation.test.ts` (+74, -68)
- `packages/core/test/filesystem/ripgrep.test.ts` (+0, -231)
- `packages/core/test/filesystem/search.test.ts` (+44, -0)
- `packages/core/test/git.test.ts` (+1, -1)
- `packages/core/test/kilocode/account-auth-v2-migration.test.ts` (+21, -15)
- `packages/core/test/kilocode/database-migration-compat.test.ts` (+66, -9)
- `packages/core/test/kilocode/event-storage-compat.test.ts` (+114, -0)
- `packages/core/test/kilocode/fff.test.ts` (+27, -0)
- `packages/core/test/kilocode/grep-tool.test.ts` (+177, -0)
- `packages/core/test/kilocode/image-size.test.ts` (+38, -0)
- `packages/core/test/kilocode/log.test.ts` (+60, -0)
- `packages/core/test/kilocode/read-filesystem.test.ts` (+65, -0)
- `packages/core/test/kilocode/reference-materialization.test.ts` (+95, -0)
- `packages/core/test/kilocode/search-target.test.ts` (+56, -0)
- `packages/core/test/kilocode/spawn-validation.test.ts` (+15, -0)
- `packages/core/test/lib/tool.ts` (+20, -0)
- `packages/core/test/location-filesystem.test.ts` (+44, -375)
- `packages/core/test/location-layer.test.ts` (+30, -12)
- `packages/core/test/location-mutation.test.ts` (+34, -88)
- `packages/core/test/location-search.test.ts` (+0, -285)
- `packages/core/test/model-request.test.ts` (+44, -0)
- `packages/core/test/permission.test.ts` (+15, -0)
- `packages/core/test/plugin.test.ts` (+1, -1)
- `packages/core/test/plugin/fixtures/models-dev.json` (+14, -0)
- `packages/core/test/plugin/models-dev.test.ts` (+65, -0)
- `packages/core/test/plugin/provider-azure.test.ts` (+15, -18)
- `packages/core/test/plugin/provider-cloudflare-workers-ai.test.ts` (+21, -23)
- `packages/core/test/plugin/provider-gitlab.test.ts` (+19, -31)
- `packages/core/test/plugin/provider-google-vertex.test.ts` (+21, -0)
- `packages/core/test/plugin/provider-helper.ts` (+9, -0)
- `packages/core/test/plugin/provider-kilo.test.ts` (+3, -2)
- `packages/core/test/plugin/provider-openai.test.ts` (+33, -6)
- `packages/core/test/plugin/provider-opencode.test.ts` (+4, -1)
- `packages/core/test/project-copy.test.ts` (+37, -2)
- `packages/core/test/project-reference.test.ts` (+0, -299)
- `packages/core/test/project.test.ts` (+11, -9)
- `packages/core/test/public-opencode.test.ts` (+143, -4)
- `packages/core/test/public-tool.test.ts` (+13, -0)
- `packages/core/test/reference-guidance.test.ts` (+77, -0)
- `packages/core/test/reference.test.ts` (+128, -0)
- `packages/core/test/ripgrep.test.ts` (+64, -0)
- `packages/core/test/session-compaction.test.ts` (+18, -0)
- `packages/core/test/session-create.test.ts` (+53, -6)
- `packages/core/test/session-logging.test.ts` (+30, -0)
- `packages/core/test/session-projector.test.ts` (+128, -5)
- `packages/core/test/session-prompt.test.ts` (+52, -3)
- `packages/core/test/session-run-coordinator.test.ts` (+627, -0)
- `packages/core/test/session-runner-message.test.ts` (+27, -14)
- `packages/core/test/session-runner-model.test.ts` (+96, -10)
- `packages/core/test/session-runner-recorded.test.ts` (+28, -6)
- `packages/core/test/session-runner-tool-events.test.ts` (+127, -0)
- `packages/core/test/session-runner-tool-registry.test.ts` (+388, -154)
- `packages/core/test/session-runner.test.ts` (+510, -73)
- `packages/core/test/session-tool-progress.test.ts` (+1, -2)
- `packages/core/test/state.test.ts` (+34, -0)
- `packages/core/test/system-context/registry.test.ts` (+19, -19)
- `packages/core/test/tool-apply-patch.test.ts` (+60, -26)
- `packages/core/test/tool-bash.test.ts` (+58, -47)
- `packages/core/test/tool-edit.test.ts` (+37, -77)
- `packages/core/test/tool-glob.test.ts` (+0, -231)
- `packages/core/test/tool-grep.test.ts` (+0, -286)
- `packages/core/test/tool-output-store.test.ts` (+142, -162)
- `packages/core/test/tool-question.test.ts` (+50, -14)
- `packages/core/test/tool-read.test.ts` (+480, -258)
- `packages/core/test/tool-skill.test.ts` (+21, -41)
- `packages/core/test/tool-todowrite.test.ts` (+10, -6)
- `packages/core/test/tool-webfetch.test.ts` (+32, -68)
- `packages/core/test/tool-websearch.test.ts` (+17, -62)
- `packages/core/test/tool-write.test.ts` (+31, -66)
- `packages/kilo-vscode/src/agent-manager/orchestration-bridge.ts` (+22, -10)
- `packages/kilo-vscode/tests/unit/agent-manager-orchestration-bridge.test.ts` (+84, -1)

#### Other Changes
- `.changeset/agent-manager-stop-session.md` (+6, -0)
- `.changeset/align-cli-usage.md` (+5, -0)
- `.changeset/background-process-display.md` (+5, -0)
- `.changeset/default-worktree-dialog.md` (+5, -0)
- `.changeset/finish-deprecated-review-command.md` (+5, -0)
- `.changeset/indexing-file-extensions.md` (+7, -0)
- `.github/CODEOWNERS` (+2, -4)
- `.github/workflows/test.yml` (+41, -16)
- `.opencode-version` (+1, -1)
- `.opencode/opencode.jsonc` (+5, -2)
- `CONTEXT.md` (+26, -0)
- `bun.lock` (+105, -28)
- `bunfig.toml` (+1, -1)
- `nix/hashes.json` (+4, -4)
- `package.json` (+7, -6)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+2, -1)
- `packages/http-recorder/LICENSE` (+21, -0)
- `packages/http-recorder/README.md` (+157, -155)
- `packages/http-recorder/package.json` (+41, -7)
- `packages/http-recorder/script/build.ts` (+20, -0)
- `packages/http-recorder/script/pack.ts` (+35, -0)
- `packages/http-recorder/script/verify-package.ts` (+75, -0)
- `packages/http-recorder/src/cassette.ts` (+57, -40)
- `packages/http-recorder/src/effect.ts` (+20, -137)
- `packages/http-recorder/src/index.ts` (+16, -23)
- `packages/http-recorder/src/internal-effect.ts` (+189, -0)
- `packages/http-recorder/src/internal.ts` (+15, -0)
- `packages/http-recorder/src/matching.ts` (+4, -4)
- `packages/http-recorder/src/recorder.ts` (+26, -12)
- `packages/http-recorder/src/redaction.ts` (+6, -4)
- `packages/http-recorder/src/redactor.ts` (+62, -3)
- `packages/http-recorder/src/schema.ts` (+30, -11)
- `packages/http-recorder/src/socket.ts` (+326, -0)
- `packages/http-recorder/src/types.ts` (+108, -0)
- `packages/http-recorder/src/websocket.ts` (+131, -79)
- `packages/http-recorder/test/record-replay.test.ts` (+668, -133)
- `packages/http-recorder/tsconfig.json` (+9, -2)
- `packages/kilo-console/package.json` (+2, -0)
- `packages/kilo-console/src/routes/config/IndexingRoute.tsx` (+35, -1)
- `packages/kilo-console/src/routes/config/state/indexing.test.ts` (+10, -1)
- `packages/kilo-console/src/routes/config/state/indexing.ts` (+7, -0)
- `packages/kilo-docs/package.json` (+1, -0)
- `packages/kilo-docs/pages/automate/agent-manager-workflows.md` (+7, -6)
- `packages/kilo-docs/pages/automate/agent-manager.md` (+7, -5)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli-reference.md` (+13, -30)
- `packages/kilo-docs/pages/customize/context/codebase-indexing.md` (+14, -0)
- `packages/kilo-docs/source-links.md` (+1, -9)
- `packages/kilo-indexing/package.json` (+3, -1)
- `packages/kilo-indexing/src/config.ts` (+15, -0)
- `packages/kilo-indexing/src/file-extensions.ts` (+24, -0)
- `packages/kilo-indexing/src/indexing/config-manager.ts` (+8, -0)
- `packages/kilo-indexing/src/indexing/interfaces/config.ts` (+2, -0)
- `packages/kilo-indexing/src/indexing/processors/file-watcher.ts` (+26, -3)
- `packages/kilo-indexing/src/indexing/processors/parser.ts` (+6, -1)
- `packages/kilo-indexing/src/indexing/processors/scanner.ts` (+11, -2)
- `packages/kilo-indexing/src/indexing/search-service.ts` (+16, -3)
- `packages/kilo-indexing/src/indexing/service-factory.ts` (+7, -3)
- `packages/kilo-indexing/src/indexing/shared/is-binary.ts` (+14, -0)
- `packages/kilo-indexing/src/indexing/shared/supported-extensions.ts` (+5, -0)
- `packages/kilo-indexing/src/indexing/vector-store/qdrant-client.ts` (+2, -2)
- `packages/kilo-indexing/test/kilocode/indexing/config-manager.test.ts` (+33, -1)
- `packages/kilo-indexing/test/kilocode/indexing/detect.test.ts` (+2, -1)
- `packages/kilo-indexing/test/kilocode/indexing/processors/file-watcher.test.ts` (+41, -0)
- `packages/kilo-indexing/test/kilocode/indexing/processors/parser.test.ts` (+15, -0)
- `packages/kilo-indexing/test/kilocode/indexing/processors/scanner.test.ts` (+57, -0)
- `packages/kilo-indexing/test/kilocode/indexing/search-service.test.ts` (+19, -1)
- `packages/kilo-indexing/test/kilocode/indexing/service-factory.test.ts` (+1, -1)
- `packages/kilo-indexing/test/kilocode/indexing/vector-store/lancedb-vector-store.test.ts` (+3, -3)
- `packages/kilo-indexing/test/kilocode/indexing/vector-store/qdrant-client.test.ts` (+3, -3)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+2, -1)
- `packages/kilo-vscode/package.json` (+16, -7)
- `packages/kilo-vscode/src/KiloProvider.ts` (+4, -0)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+5, -0)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+6, -0)
- `packages/kilo-vscode/src/extension.ts` (+3, -0)
- `packages/kilo-vscode/src/kilo-provider/command-completion.ts` (+3, -0)
- `packages/kilo-vscode/src/kilo-provider/handlers/cloud-session.ts` (+4, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+83, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-close-session.test.ts` (+6, -2)
- `packages/kilo-vscode/tests/unit/command-completion.test.ts` (+11, -0)
- `packages/kilo-vscode/tests/unit/indexing-tab-state.test.ts` (+9, -0)
- `packages/kilo-vscode/tests/unit/prompt-send-contract.test.ts` (+27, -0)
- `packages/kilo-vscode/tests/unit/tool-default-open.test.ts` (+24, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+10, -23)
- `packages/kilo-vscode/webview-ui/agent-manager/UnassignedSessionsSection.tsx` (+3, -8)
- `packages/kilo-vscode/webview-ui/agent-manager/WorktreeSectionActions.tsx` (+15, -19)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fr.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/it.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ja.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ko.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/nl.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/no.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/pl.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ru.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/th.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/tr.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/uk.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zh.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zht.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/shortcuts.ts` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/components/chat/AssistantMessage.tsx` (+2, -9)
- `packages/kilo-vscode/webview-ui/src/components/chat/tool-default-open.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/IndexingTab.tsx` (+47, -1)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/config.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+12, -0)
- `packages/llm/AGENTS.md` (+1, -1)
- `packages/llm/package.json` (+4, -2)
- `packages/llm/src/index.ts` (+1, -0)
- `packages/llm/src/protocols/anthropic-messages.ts` (+30, -18)
- `packages/llm/src/protocols/bedrock-converse.ts` (+17, -2)
- `packages/llm/src/protocols/gemini.ts` (+28, -6)
- `packages/llm/src/protocols/openai-chat.ts` (+72, -10)
- `packages/llm/src/protocols/openai-responses.ts` (+31, -14)
- `packages/llm/src/protocols/shared.ts` (+47, -15)
- `packages/llm/src/protocols/utils/bedrock-media.ts` (+22, -12)
- `packages/llm/src/protocols/utils/openai-options.ts` (+9, -0)
- `packages/llm/src/provider-error.ts` (+32, -0)
- `packages/llm/src/providers/openai-options.ts` (+4, -2)
- `packages/llm/src/route/executor.ts` (+13, -2)
- `packages/llm/src/schema/errors.ts` (+4, -0)
- `packages/llm/src/schema/events.ts` (+2, -0)
- `packages/llm/src/schema/messages.ts` (+74, -108)
- `packages/llm/src/tool.ts` (+18, -6)
- `packages/llm/test/executor.test.ts` (+40, -0)
- `packages/llm/test/provider/anthropic-messages-cache.recorded.test.ts` (+1, -2)
- `packages/llm/test/provider/anthropic-messages.recorded.test.ts` (+1, -2)
- `packages/llm/test/provider/anthropic-messages.test.ts` (+26, -3)
- `packages/llm/test/provider/bedrock-converse.test.ts` (+22, -5)
- `packages/llm/test/provider/gemini.test.ts` (+105, -0)
- `packages/llm/test/provider/golden.recorded.test.ts` (+10, -6)
- `packages/llm/test/provider/openai-chat.test.ts` (+217, -4)
- `packages/llm/test/provider/openai-responses.test.ts` (+32, -5)
- `packages/llm/test/recorded-golden.ts` (+1, -1)
- `packages/llm/test/recorded-scenarios.ts` (+1, -1)
- `packages/llm/test/recorded-test.ts` (+29, -9)
- `packages/llm/test/recorded-websocket.ts` (+5, -5)
- `packages/llm/test/tool-runtime.test.ts` (+89, -43)
- `packages/opencode/BUN_SHELL_MIGRATION_PLAN.md` (+0, -136)
- `packages/opencode/package.json` (+9, -6)
- `packages/opencode/parsers-config.ts` (+1, -386)
- `packages/opencode/script/bench-search.ts` (+94, -0)
- `packages/opencode/script/build.ts` (+3, -1)
- `packages/opencode/script/kilocode/test-profile.ts` (+1, -1)
- `packages/opencode/script/schema.ts` (+2, -2)
- `packages/opencode/script/trace-imports.ts` (+1, -1)
- `packages/opencode/src/account/account.ts` (+4, -0)
- `packages/opencode/src/account/repo.ts` (+3, -0)
- `packages/opencode/src/acp/event.ts` (+4, -12)
- `packages/opencode/src/acp/permission.ts` (+3, -24)
- `packages/opencode/src/acp/service.ts` (+5, -19)
- `packages/opencode/src/acp/tool.ts` (+8, -4)
- `packages/opencode/src/acp/usage.ts` (+11, -18)
- `packages/opencode/src/auth/index.ts` (+3, -0)
- `packages/opencode/src/background/job.ts` (+3, -0)
- `packages/opencode/src/cli/cmd/acp.ts` (+1, -4)
- `packages/opencode/src/cli/cmd/attach.ts` (+130, -0)
- `packages/opencode/src/cli/cmd/debug/file.ts` (+12, -26)
- `packages/opencode/src/cli/cmd/debug/lsp.ts` (+2, -3)
- `packages/opencode/src/cli/cmd/debug/ripgrep.ts` (+20, -40)
- `packages/opencode/src/cli/cmd/debug/scrap.ts` (+0, -3)
- `packages/opencode/src/cli/cmd/debug/v2.ts` (+6, -3)
- `packages/opencode/src/cli/cmd/mcp.ts` (+73, -3)
- `packages/opencode/src/cli/cmd/prompt-display.ts` (+1, -48)
- `packages/opencode/src/cli/cmd/providers.ts` (+39, -15)
- `packages/opencode/src/cli/cmd/run.ts` (+11, -2)
- `packages/opencode/src/cli/cmd/run/demo.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/run/entry.body.ts` (+11, -0)
- `packages/opencode/src/cli/cmd/run/footer.command.tsx` (+298, -112)
- `packages/opencode/src/cli/cmd/run/footer.menu.tsx` (+84, -37)
- `packages/opencode/src/cli/cmd/run/footer.permission.tsx` (+9, -2)
- `packages/opencode/src/cli/cmd/run/footer.prompt.tsx` (+173, -73)
- `packages/opencode/src/cli/cmd/run/footer.question.tsx` (+2, -1)
- `packages/opencode/src/cli/cmd/run/footer.subagent.tsx` (+9, -1)
- `packages/opencode/src/cli/cmd/run/footer.ts` (+110, -73)
- `packages/opencode/src/cli/cmd/run/footer.view.tsx` (+486, -436)
- `packages/opencode/src/cli/cmd/run/footer.width.ts` (+27, -0)
- `packages/opencode/src/cli/cmd/run/otel.ts` (+0, -117)
- `packages/opencode/src/cli/cmd/run/prompt.editor.ts` (+157, -0)
- `packages/opencode/src/cli/cmd/run/prompt.shared.ts` (+7, -1)
- `packages/opencode/src/cli/cmd/run/runtime.boot.ts` (+3, -11)
- `packages/opencode/src/cli/cmd/run/runtime.lifecycle.ts` (+239, -202)
- `packages/opencode/src/cli/cmd/run/runtime.queue.ts` (+12, -10)
- `packages/opencode/src/cli/cmd/run/runtime.ts` (+592, -657)
- `packages/opencode/src/cli/cmd/run/scrollback.surface.ts` (+15, -13)
- `packages/opencode/src/cli/cmd/run/scrollback.writer.tsx` (+19, -1)
- `packages/opencode/src/cli/cmd/run/session-replay.ts` (+78, -5)
- `packages/opencode/src/cli/cmd/run/splash.ts` (+23, -49)
- `packages/opencode/src/cli/cmd/run/stream.transport.ts` (+6, -9)
- `packages/opencode/src/cli/cmd/run/subagent-data.ts` (+77, -45)
- `packages/opencode/src/cli/cmd/run/theme.ts` (+138, -51)
- `packages/opencode/src/cli/cmd/run/turn-summary.ts` (+47, -0)
- `packages/opencode/src/cli/cmd/run/types.ts` (+10, -2)
- `packages/opencode/src/cli/cmd/{tui/thread.ts => tui.ts}` (+46, -58)
- `packages/opencode/src/cli/cmd/tui/attach.ts` (+0, -136)
- `packages/opencode/src/cli/cmd/tui/component/dialog-move-session.tsx` (+0, -129)
- `packages/opencode/src/cli/cmd/tui/component/prompt/frecency.tsx` (+0, -90)
- `packages/opencode/src/cli/cmd/tui/component/prompt/part.ts` (+0, -31)
- `packages/opencode/src/cli/cmd/tui/component/prompt/stash.tsx` (+0, -101)
- `packages/opencode/src/cli/cmd/tui/component/use-connected.tsx` (+0, -12)
- `packages/opencode/src/cli/cmd/tui/config/tui-schema.ts` (+0, -95)
- `packages/opencode/src/cli/cmd/tui/context/aggregate-failures.ts` (+0, -51)
- `packages/opencode/src/cli/cmd/tui/context/exit.tsx` (+0, -42)
- `packages/opencode/src/cli/cmd/tui/context/tui-config.tsx` (+0, -6)
- `packages/opencode/src/cli/cmd/tui/layer.ts` (+0, -6)
- `packages/opencode/src/cli/cmd/tui/plugin/internal.ts` (+0, -74)
- `packages/opencode/src/cli/cmd/tui/plugin/slots.tsx` (+0, -74)
- `packages/opencode/src/cli/cmd/tui/routes/session/suggest.tsx` (+0, -2)
- `packages/opencode/src/cli/cmd/tui/util/clipboard.ts` (+0, -181)
- `packages/opencode/src/cli/cmd/tui/util/editor.ts` (+0, -43)
- `packages/opencode/src/cli/error.ts` (+12, -0)
- `packages/opencode/src/cli/heap.ts` (+1, -15)
- `packages/opencode/src/cli/tui/layer.ts` (+7, -0)
- `packages/opencode/src/cli/{cmd => }/tui/validate-session.ts` (+0, -0)
- `packages/opencode/src/cli/{cmd => }/tui/worker.ts` (+4, -29)
- `packages/opencode/src/command/index.ts` (+3, -0)
- `packages/opencode/src/config/agent.ts` (+1, -0)
- `packages/opencode/src/config/command.ts` (+0, -1)
- `packages/opencode/src/config/config.ts` (+49, -31)
- `packages/opencode/src/config/managed.ts` (+2, -10)
- `packages/opencode/src/config/reference.ts` (+0, -48)
- `packages/opencode/src/{cli/cmd/tui/config/cwd.ts => config/tui-cwd.ts}` (+0, -0)
- `packages/opencode/src/config/tui-host-attention.ts` (+21, -0)
- `packages/opencode/src/{cli/cmd/tui => }/config/tui-migrate.ts` (+10, -32)
- `packages/opencode/src/{cli/cmd/tui => }/config/tui.ts` (+64, -91)
- `packages/opencode/src/control-plane/workspace.ts` (+44, -130)
- `packages/opencode/src/effect/app-runtime.ts` (+30, -22)
- `packages/opencode/src/effect/bootstrap-runtime.ts` (+1, -1)
- `packages/opencode/src/effect/instance-state.ts` (+1, -4)
- `packages/opencode/src/effect/run-service.ts` (+1, -1)
- `packages/opencode/src/effect/runtime-flags.ts` (+5, -1)
- `packages/opencode/src/env/index.ts` (+3, -0)
- `packages/opencode/src/event-v2-bridge.ts` (+3, -0)
- `packages/opencode/src/format/index.ts` (+16, -23)
- `packages/opencode/src/git/index.ts` (+3, -0)
- `packages/opencode/src/image/image.ts` (+7, -11)
- `packages/opencode/src/index.ts` (+16, -72)
- `packages/opencode/src/installation/index.ts` (+5, -4)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+8, -4)
- `packages/opencode/src/kilocode/agent-manager/protocol.ts` (+14, -2)
- `packages/opencode/src/kilocode/agent-manager/service.ts` (+1, -1)
- `packages/opencode/src/kilocode/auth/remove.ts` (+16, -0)
- `packages/opencode/src/kilocode/background-process/runner.ts` (+2, -1)
- `packages/opencode/src/kilocode/bootstrap.ts` (+11, -0)
- `packages/opencode/src/kilocode/claw/autocomplete.tsx` (+1, -1)
- `packages/opencode/src/kilocode/claw/chat.tsx` (+1, -1)
- `packages/opencode/src/kilocode/cli/cmd/tui/app.tsx` (+2, -1)
- `packages/opencode/src/kilocode/cli/cmd/tui/component/dialog-memory.tsx` (+8, -8)
- `packages/opencode/src/kilocode/cli/cmd/tui/component/dialog-process-list.tsx` (+1, -1)
- `packages/opencode/src/kilocode/cli/cmd/tui/component/memory-prompt.tsx` (+2, -2)
- `packages/opencode/src/kilocode/cli/cmd/tui/context/tui-config-hot-reload.ts` (+3, -3)
- `packages/opencode/src/kilocode/cli/cmd/tui/context/tui-config.tsx` (+7, -10)
- `packages/opencode/src/kilocode/cli/cmd/tui/permissions.tsx` (+1, -1)
- `packages/opencode/src/kilocode/cli/cmd/tui/relative-time.ts` (+11, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/remote-exit-bridge.ts` (+5, -2)
- `packages/opencode/src/kilocode/cli/cmd/tui/routes/session/memory.tsx` (+4, -4)
- `packages/opencode/src/kilocode/cli/cmd/tui/thread.ts` (+4, -4)
- `packages/opencode/src/kilocode/cli/setup.ts` (+2, -0)
- `packages/opencode/src/kilocode/commands.ts` (+2, -2)
- `packages/opencode/src/kilocode/components/dialog-indexing.tsx` (+34, -1)
- `packages/opencode/src/kilocode/components/dialog-kilo-auto-method.tsx` (+2, -2)
- `packages/opencode/src/kilocode/components/kilo-error-display.tsx` (+1, -1)
- `packages/opencode/src/kilocode/config/overlay.ts` (+1, -0)
- `packages/opencode/src/kilocode/log.ts` (+19, -0)
- `packages/opencode/src/kilocode/plan-followup.ts` (+1, -1)
- `packages/opencode/src/kilocode/plugins/internal.ts` (+49, -0)
- `packages/opencode/src/kilocode/plugins/memory-palette.tsx` (+1, -1)
- `packages/opencode/src/kilocode/plugins/memory-status.tsx` (+1, -1)
- `packages/opencode/src/kilocode/plugins/model-usage.ts` (+0, -3)
- `packages/opencode/src/kilocode/plugins/permissions.ts` (+1, -1)
- `packages/opencode/src/{cli/cmd/tui/feature-plugins/session => kilocode/plugins/session-switcher}/dialog.tsx` (+2, -2)
- `packages/opencode/src/{cli/cmd/tui/feature-plugins/session => kilocode/plugins/session-switcher}/index.tsx` (+1, -1)
- `packages/opencode/src/{cli/cmd/tui/feature-plugins/session => kilocode/plugins/session-switcher}/preview-pane.tsx` (+2, -5)
- `packages/opencode/src/{cli/cmd/tui/feature-plugins/session => kilocode/plugins/session-switcher}/util.tsx` (+1, -2)
- `packages/opencode/src/{cli/cmd/tui/feature-plugins/system/session-v2.tsx => kilocode/plugins/session-v2-debug.tsx}` (+13, -14)
- `packages/opencode/src/kilocode/plugins/sidebar-indexing.tsx` (+1, -1)
- `packages/opencode/src/kilocode/plugins/sidebar-usage-row.tsx` (+39, -0)
- `packages/opencode/src/kilocode/plugins/sidebar-usage.tsx` (+57, -56)
- `packages/opencode/src/{cli/cmd/tui/context => kilocode/plugins}/sync-v2.tsx` (+4, -5)
- `packages/opencode/src/kilocode/reference.ts` (+191, -0)
- `packages/opencode/src/kilocode/reference/contains.ts` (+4, -13)
- `packages/opencode/src/kilocode/server/reference-reconciler.ts` (+49, -0)
- `packages/opencode/src/kilocode/suggestion/tui/bar.tsx` (+2, -2)
- `packages/opencode/src/kilocode/suggestion/tui/prompt.tsx` (+6, -6)
- `packages/opencode/src/kilocode/suggestion/tui/render.tsx` (+1, -1)
- `packages/opencode/src/kilocode/tui/config.ts` (+4, -5)
- `packages/opencode/src/kilocode/tui/diff.ts` (+8, -5)
- `packages/opencode/src/kilocode/tui/keybinds.ts` (+1, -1)
- `packages/opencode/src/lsp/client.ts` (+1, -37)
- `packages/opencode/src/lsp/lsp.ts` (+11, -17)
- `packages/opencode/src/lsp/server.ts` (+71, -149)
- `packages/opencode/src/mcp/auth.ts` (+3, -0)
- `packages/opencode/src/mcp/catalog.ts` (+138, -0)
- `packages/opencode/src/mcp/index.ts` (+173, -233)
- `packages/opencode/src/mcp/oauth-callback.ts` (+2, -9)
- `packages/opencode/src/mcp/oauth-provider.ts` (+0, -11)
- `packages/opencode/src/node.ts` (+0, -1)
- `packages/opencode/src/patch/index.ts` (+4, -7)
- `packages/opencode/src/plugin/digitalocean.ts` (+3, -13)
- `packages/opencode/src/plugin/github-copilot/copilot.ts` (+0, -4)
- `packages/opencode/src/plugin/index.ts` (+21, -28)
- `packages/opencode/src/plugin/openai/codex.ts` (+4, -9)
- `packages/opencode/src/plugin/openai/ws-pool.ts` (+2, -18)
- `packages/opencode/src/plugin/tui/internal.ts` (+18, -0)
- `packages/opencode/src/{cli/cmd/tui/plugin => plugin/tui}/runtime.ts` (+72, -73)
- `packages/opencode/src/plugin/xai.ts` (+2, -10)
- `packages/opencode/src/project/bootstrap.ts` (+14, -5)
- `packages/opencode/src/project/instance-store.ts` (+8, -6)
- `packages/opencode/src/project/project.ts` (+14, -5)
- `packages/opencode/src/project/vcs.ts` (+3, -7)
- `packages/opencode/src/provider/auth.ts` (+3, -0)
- `packages/opencode/src/provider/error.ts` (+2, -34)
- `packages/opencode/src/provider/model-cache.ts` (+5, -0)
- `packages/opencode/src/provider/models.ts` (+3, -0)
- `packages/opencode/src/provider/provider.ts` (+35, -66)
- `packages/opencode/src/provider/transform.ts` (+93, -23)
- `packages/opencode/src/question/index.ts` (+8, -8)
- `packages/opencode/src/reference/reference.ts` (+0, -239)
- `packages/opencode/src/reference/repository-cache.ts` (+0, -320)
- `packages/opencode/src/server/global-lifecycle.ts` (+1, -10)
- `packages/opencode/src/server/mdns.ts` (+3, -16)
- `packages/opencode/src/server/routes/instance/httpapi/api.ts` (+2, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/file.ts` (+15, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/project-copy.ts` (+5, -3)
- `packages/opencode/src/server/routes/instance/httpapi/groups/tui.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/control-plane.ts` (+2, -0)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/control.ts` (+17, -8)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/event.ts` (+2, -5)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/file.ts` (+78, -31)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/global.ts` (+36, -37)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/project-copy.ts` (+8, -3)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/pty.ts` (+9, -4)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/session.ts` (+1, -3)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/sync.ts` (+3, -9)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/tui.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/lifecycle.ts` (+1, -4)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/authorization.ts` (+4, -1)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/error.ts` (+19, -12)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/schema-error.ts` (+14, -15)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+36, -19)
- `packages/opencode/src/server/server.ts` (+3, -4)
- `packages/opencode/src/server/shared/fence.ts` (+2, -10)
- `packages/opencode/src/{cli/cmd/tui/event.ts => server/tui-event.ts}` (+0, -0)
- `packages/opencode/src/session/compaction.ts` (+43, -63)
- `packages/opencode/src/session/instruction.ts` (+4, -0)
- `packages/opencode/src/session/llm.ts` (+63, -49)
- `packages/opencode/src/session/llm/request.ts` (+1, -0)
- `packages/opencode/src/session/message-v2.ts` (+1, -2)
- `packages/opencode/src/session/processor.ts` (+39, -18)
- `packages/opencode/src/session/prompt.ts` (+136, -130)
- `packages/opencode/src/session/prompt/reference.ts` (+0, -72)
- `packages/opencode/src/session/revert.ts` (+11, -4)
- `packages/opencode/src/session/run-state.ts` (+3, -0)
- `packages/opencode/src/session/session.ts` (+9, -6)
- `packages/opencode/src/session/status.ts` (+3, -0)
- `packages/opencode/src/session/summary.ts` (+9, -0)
- `packages/opencode/src/session/system.ts` (+50, -2)
- `packages/opencode/src/session/todo.ts` (+3, -0)
- `packages/opencode/src/session/tools.ts` (+0, -4)
- `packages/opencode/src/share/session.ts` (+3, -0)
- `packages/opencode/src/share/share-next.ts` (+23, -17)
- `packages/opencode/src/skill/discovery.ts` (+14, -20)
- `packages/opencode/src/skill/index.ts` (+19, -11)
- `packages/opencode/src/snapshot/index.ts` (+51, -42)
- `packages/opencode/src/storage/storage.ts` (+12, -12)
- `packages/opencode/src/temporary.ts` (+5, -7)
- `packages/opencode/src/util/error.ts` (+1, -88)
- `packages/opencode/src/util/locale.ts` (+2, -86)
- `packages/opencode/src/util/process.ts` (+2, -1)
- `packages/opencode/src/util/record.ts` (+1, -3)
- `packages/opencode/src/util/token.ts` (+1, -7)
- `packages/opencode/src/worktree/index.ts` (+18, -9)
- `packages/opencode/test/acp/event.test.ts` (+32, -0)
- `packages/opencode/test/cli/cmd/tui/aggregate-failures.test.ts` (+0, -93)
- `packages/opencode/test/cli/cmd/tui/attention.test.ts` (+2, -2)
- `packages/opencode/test/cli/cmd/tui/prompt-history.test.ts` (+0, -44)
- `packages/opencode/test/cli/cmd/tui/prompt-part.test.ts` (+0, -77)
- `packages/opencode/test/cli/help/__snapshots__/help-snapshots.test.ts.snap` (+83, -40)
- `packages/opencode/test/cli/help/help-snapshots.test.ts` (+5, -0)
- `packages/opencode/test/cli/mcp-add.test.ts` (+98, -0)
- `packages/opencode/test/cli/run/footer.view.test.tsx` (+441, -35)
- `packages/opencode/test/cli/run/footer.width.test.ts` (+35, -0)
- `packages/opencode/test/cli/run/prompt.editor.test.ts` (+101, -0)
- `packages/opencode/test/cli/run/prompt.shared.test.ts` (+0, -32)
- `packages/opencode/test/cli/run/runtime.boot.test.ts` (+2, -1)
- `packages/opencode/test/cli/run/runtime.queue.test.ts` (+16, -0)
- `packages/opencode/test/cli/run/runtime.test.ts` (+238, -0)
- `packages/opencode/test/cli/run/scrollback.surface.test.ts` (+17, -0)
- `packages/opencode/test/cli/run/session-replay.test.ts` (+248, -12)
- `packages/opencode/test/cli/run/stream.transport.test.ts` (+2, -2)
- `packages/opencode/test/cli/run/subagent-data.test.ts` (+98, -7)
- `packages/opencode/test/cli/run/theme.test.ts` (+25, -0)
- `packages/opencode/test/cli/tui/app-lifecycle.test.ts` (+0, -261)
- `packages/opencode/test/cli/tui/attach.test.ts` (+11, -0)
- `packages/opencode/test/cli/tui/editor-context-zed.test.ts` (+1, -6)
- `packages/opencode/test/cli/tui/editor-context.test.tsx` (+13, -4)
- `packages/opencode/test/cli/tui/markdown.test.ts` (+1, -1)
- `packages/opencode/test/cli/tui/plugin-add.test.ts` (+2, -2)
- `packages/opencode/test/cli/tui/plugin-install.test.ts` (+2, -2)
- `packages/opencode/test/cli/tui/plugin-lifecycle.test.ts` (+1, -1)
- `packages/opencode/test/cli/tui/plugin-loader-entrypoint.test.ts` (+2, -2)
- `packages/opencode/test/cli/tui/plugin-loader-pure.test.ts` (+2, -2)
- `packages/opencode/test/cli/tui/plugin-loader.test.ts` (+3, -3)
- `packages/opencode/test/cli/tui/plugin-toggle.test.ts` (+2, -2)
- `packages/opencode/test/cli/tui/thread.test.ts` (+9, -1)
- `packages/opencode/test/config/config.test.ts` (+52, -2)
- `packages/opencode/test/config/tui.test.ts` (+14, -6)
- `packages/opencode/test/control-plane/workspace.test.ts` (+2, -3)
- `packages/opencode/test/effect/app-graph-types.test.ts` (+108, -0)
- `packages/opencode/test/effect/app-graph.test.ts` (+204, -0)
- `packages/opencode/test/effect/app-runtime-logger.test.ts` (+6, -12)
- `packages/opencode/test/fixture/fixture.ts` (+2, -3)
- `packages/opencode/test/fixture/tui-environment.tsx` (+32, -0)
- `packages/opencode/test/fixture/tui-plugin.ts` (+1, -1)
- `packages/opencode/test/fixture/tui-runtime.ts` (+26, -25)
- `packages/opencode/test/fixture/tui-sdk.ts` (+1, -1)
- `packages/opencode/test/kilocode/agent-manager-tool.test.ts` (+46, -0)
- `packages/opencode/test/kilocode/auth-remove.test.ts` (+47, -0)
- `packages/opencode/test/kilocode/background-process.test.ts` (+41, -33)
- `packages/opencode/test/kilocode/cli-shutdown.test.ts` (+1, -0)
- `packages/opencode/test/kilocode/cli/cmd/serve.test.ts` (+11, -1)
- `packages/opencode/test/kilocode/cli/cmd/tui/context/tui-config.test.ts` (+3, -2)
- `packages/opencode/test/kilocode/cli/cmd/tui/memory-status.test.tsx` (+25, -22)
- `packages/opencode/test/kilocode/cli/cmd/tui/model-usage.test.ts` (+9, -0)
- `packages/opencode/test/kilocode/cli/cmd/tui/sidebar-usage-layout.test.tsx` (+33, -0)
- `packages/opencode/test/kilocode/cli/direct-mode-branding.test.ts` (+16, -0)
- `packages/opencode/test/kilocode/cli/error.test.ts` (+13, -0)
- `packages/opencode/test/kilocode/cli/tui/remote-exit-bridge.test.ts` (+6, -10)
- `packages/opencode/test/kilocode/cli/tui/thread.test.ts` (+4, -5)
- `packages/opencode/test/kilocode/compaction-payload-recovery.test.ts` (+0, -3)
- `packages/opencode/test/kilocode/indexing-dialog-state.test.ts` (+9, -0)
- `packages/opencode/test/kilocode/instruction.test.ts` (+1, -15)
- `packages/opencode/test/kilocode/local-model.test.ts` (+25, -2)
- `packages/opencode/test/kilocode/oauth-branding.test.ts` (+10, -0)
- `packages/opencode/test/kilocode/plan-followup.test.ts` (+19, -13)
- `packages/opencode/test/kilocode/reference.test.ts` (+138, -0)
- `packages/opencode/test/kilocode/server/config-overlay.test.ts` (+6, -0)
- `packages/opencode/test/kilocode/session-compaction-cap.test.ts` (+2, -5)
- `packages/opencode/test/kilocode/session-compaction-chunks.test.ts` (+4, -4)
- `packages/opencode/test/kilocode/session-processor-empty-tool-calls.test.ts` (+2, -13)
- `packages/opencode/test/kilocode/session-processor-incomplete-response-retry.test.ts` (+2, -6)
- `packages/opencode/test/kilocode/session-processor-network-offline.test.ts` (+1, -10)
- `packages/opencode/test/kilocode/session-processor-retry-limit.test.ts` (+1, -10)
- `packages/opencode/test/kilocode/session-prompt-compaction-safety.test.ts` (+2, -6)
- `packages/opencode/test/kilocode/session-prompt-permission-refresh.test.ts` (+3, -6)
- `packages/opencode/test/kilocode/sessions/remote-sender.test.ts` (+6, -5)
- `packages/opencode/test/kilocode/slot-prop-reactivity.test.ts` (+11, -8)
- `packages/opencode/test/kilocode/tui-diff.test.ts` (+7, -0)
- `packages/opencode/test/kilocode/tui-plugin-registry.test.ts` (+40, -0)
- `packages/opencode/test/kilocode/tui-sync-event.test.ts` (+3, -3)
- `packages/opencode/test/kilocode/tui-terminal-title-reactivity.test.ts` (+3, -3)
- `packages/opencode/test/kilocode/tui/signal.test.ts` (+1, -1)
- `packages/opencode/test/{cli => kilocode}/tui/sync-v2.test.tsx` (+4, -4)
- `packages/opencode/test/lib/cli-process.ts` (+4, -3)
- `packages/opencode/test/lib/effect.ts` (+2, -5)
- `packages/opencode/test/lib/llm-server.ts` (+8, -0)
- `packages/opencode/test/lsp/client.test.ts` (+1, -6)
- `packages/opencode/test/lsp/jdtls-root.test.ts` (+459, -0)
- `packages/opencode/test/mcp/lifecycle.test.ts` (+302, -8)
- `packages/opencode/test/mcp/oauth-auto-connect.test.ts` (+38, -0)
- `packages/opencode/test/mcp/oauth-browser.test.ts` (+13, -4)
- `packages/opencode/test/plugin/workspace-adapter.test.ts` (+4, -1)
- `packages/opencode/test/preload.ts` (+20, -11)
- `packages/opencode/test/project/migrate-global.test.ts` (+0, -3)
- `packages/opencode/test/project/project.test.ts` (+0, -3)
- `packages/opencode/test/provider/amazon-bedrock.test.ts` (+14, -8)
- `packages/opencode/test/provider/transform.test.ts` (+249, -13)
- `packages/opencode/test/reference/reference.test.ts` (+0, -310)
- `packages/opencode/test/server/global-session-list.test.ts` (+0, -3)
- `packages/opencode/test/server/httpapi-authorization.test.ts` (+6, -6)
- `packages/opencode/test/server/httpapi-compression.test.ts` (+0, -3)
- `packages/opencode/test/server/httpapi-config.test.ts` (+0, -3)
- `packages/opencode/test/server/httpapi-cors-vary.test.ts` (+0, -3)
- `packages/opencode/test/server/httpapi-error-middleware.test.ts` (+11, -6)
- `packages/opencode/test/server/httpapi-event.test.ts` (+1, -4)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+97, -15)
- `packages/opencode/test/server/httpapi-experimental.test.ts` (+0, -3)
- `packages/opencode/test/server/httpapi-file.test.ts` (+0, -3)
- `packages/opencode/test/server/httpapi-instance-context.test.ts` (+2, -1)
- `packages/opencode/test/server/httpapi-instance-route-auth.test.ts` (+0, -3)
- `packages/opencode/test/server/httpapi-listen.test.ts` (+0, -3)
- `packages/opencode/test/server/httpapi-mcp.test.ts` (+0, -3)
- `packages/opencode/test/server/httpapi-mdns.test.ts` (+0, -3)
- `packages/opencode/test/server/httpapi-promptasync-context.test.ts` (+2, -1)
- `packages/opencode/test/server/httpapi-provider.test.ts` (+0, -3)
- `packages/opencode/test/server/httpapi-pty.test.ts` (+0, -3)
- `packages/opencode/test/server/httpapi-public-openapi.test.ts` (+37, -17)
- `packages/opencode/test/server/httpapi-query-schema-drift.test.ts` (+2, -2)
- `packages/opencode/test/server/httpapi-reference.test.ts` (+140, -0)
- `packages/opencode/test/server/httpapi-sdk.test.ts` (+26, -5)
- `packages/opencode/test/server/httpapi-session.test.ts` (+75, -8)
- `packages/opencode/test/server/httpapi-sync.test.ts` (+1, -7)
- `packages/opencode/test/server/httpapi-ui.test.ts` (+0, -3)
- `packages/opencode/test/server/httpapi-v2-location.test.ts` (+12, -3)
- `packages/opencode/test/server/httpapi-workspace-routing.test.ts` (+2, -1)
- `packages/opencode/test/server/httpapi-workspace.test.ts` (+2, -4)
- `packages/opencode/test/server/project-copy.test.ts` (+25, -5)
- `packages/opencode/test/server/project-init-git.test.ts` (+0, -3)
- `packages/opencode/test/server/sdk-error-shape.test.ts` (+0, -3)
- `packages/opencode/test/server/sdk-v1-smoke.test.ts` (+0, -3)
- `packages/opencode/test/server/session-actions.test.ts` (+0, -3)
- `packages/opencode/test/server/session-diff-missing-patch.test.ts` (+0, -3)
- `packages/opencode/test/server/session-list.test.ts` (+29, -6)
- `packages/opencode/test/server/session-messages.test.ts` (+0, -3)
- `packages/opencode/test/server/session-select.test.ts` (+0, -3)
- `packages/opencode/test/session/compaction.test.ts` (+23, -10)
- `packages/opencode/test/session/llm-native-recorded.test.ts` (+24, -27)
- `packages/opencode/test/session/messages-pagination.test.ts` (+0, -3)
- `packages/opencode/test/session/processor-effect.test.ts` (+32, -57)
- `packages/opencode/test/session/prompt.test.ts` (+172, -24)
- `packages/opencode/test/session/revert-compact.test.ts` (+0, -3)
- `packages/opencode/test/session/session.test.ts` (+0, -3)
- `packages/opencode/test/session/snapshot-tool-race.test.ts` (+21, -118)
- `packages/opencode/test/session/structured-output-integration.test.ts` (+4, -4)
- `packages/opencode/test/session/system.test.ts` (+4, -0)
- `packages/opencode/test/share/share-next.test.ts` (+76, -94)
- `packages/opencode/test/util/error.test.ts` (+0, -48)
- `packages/opencode/test/util/log.test.ts` (+0, -77)
- `packages/opencode/test/v2/session-message-updater.test.ts` (+16, -8)
- `packages/opencode/tsconfig.json` (+1, -1)
- `packages/plugin-atomic-chat/package.json` (+1, -0)
- `packages/plugin/package.json` (+3, -3)
- `packages/sdk/js/src/v2/client.ts` (+1, -5)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+542, -51)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+1136, -473)
- `packages/sdk/openapi.json` (+4236, -1554)
- `packages/server/package.json` (+2, -1)
- `packages/server/src/api.ts` (+22, -17)
- `packages/server/src/groups/{v2 => }/agent.ts` (+6, -8)
- `packages/server/src/groups/{v2 => }/command.ts` (+8, -10)
- `packages/server/src/groups/connector.ts` (+133, -0)
- `packages/server/src/groups/{v2 => }/event.ts` (+7, -9)
- `packages/server/src/groups/fs.ts` (+74, -0)
- `packages/server/src/groups/health.ts` (+14, -0)
- `packages/server/src/groups/location.ts` (+106, -0)
- `packages/server/src/groups/{v2 => }/message.ts` (+20, -19)
- `packages/server/src/groups/{v2 => }/model.ts` (+9, -11)
- `packages/server/src/groups/{v2 => }/permission.ts` (+42, -51)
- `packages/server/src/groups/{v2 => }/provider.ts` (+12, -15)
- `packages/server/src/groups/question.ts` (+75, -0)
- `packages/server/src/groups/reference.ts` (+28, -0)
- `packages/server/src/groups/{v2 => }/session.ts` (+88, -43)
- `packages/server/src/groups/{v2 => }/skill.ts` (+8, -10)
- `packages/server/src/groups/v2/fs.ts` (+0, -57)
- `packages/server/src/groups/v2/health.ts` (+0, -17)
- `packages/server/src/groups/v2/location.ts` (+0, -95)
- `packages/server/src/groups/v2/question.ts` (+0, -60)
- `packages/server/src/handlers.ts` (+39, -50)
- `packages/server/src/handlers/{v2 => }/agent.ts` (+4, -4)
- `packages/server/src/handlers/command.ts` (+9, -0)
- `packages/server/src/handlers/connector.ts` (+103, -0)
- `packages/server/src/handlers/{v2 => }/event.ts` (+3, -3)
- `packages/server/src/handlers/fs.ts` (+40, -0)
- `packages/server/src/handlers/health.ts` (+7, -0)
- `packages/server/src/handlers/location.ts` (+18, -0)
- `packages/server/src/handlers/{v2 => }/message.ts` (+5, -5)
- `packages/server/src/handlers/{v2 => }/model.ts` (+5, -5)
- `packages/server/src/handlers/permission.ts` (+61, -0)
- `packages/server/src/handlers/{v2 => }/provider.ts` (+6, -6)
- `packages/server/src/handlers/question.ts` (+62, -0)
- `packages/server/src/handlers/reference.ts` (+11, -0)
- `packages/server/src/handlers/{v2 => }/session.ts` (+50, -14)
- `packages/server/src/handlers/skill.ts` (+8, -0)
- `packages/server/src/handlers/v2/command.ts` (+0, -9)
- `packages/server/src/handlers/v2/fs.ts` (+0, -13)
- `packages/server/src/handlers/v2/health.ts` (+0, -7)
- `packages/server/src/handlers/v2/permission.ts` (+0, -106)
- `packages/server/src/handlers/v2/question.ts` (+0, -97)
- `packages/server/src/handlers/v2/skill.ts` (+0, -8)
- `packages/server/src/kilocode/reference-reconciler.ts` (+15, -0)
- `packages/server/src/middleware/authorization.ts` (+7, -10)
- `packages/server/src/middleware/schema-error.ts` (+4, -4)
- `packages/server/src/middleware/session-location.ts` (+69, -0)
- `packages/server/src/routes.ts` (+8, -10)
- `packages/storybook/.storybook/mocks/app/context/command.ts` (+4, -0)
- `packages/tui/bunfig.toml` (+4, -0)
- `packages/tui/package.json` (+73, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/app.tsx` (+311, -327)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/attention.ts` (+10, -12)
- `packages/tui/src/audio.d.ts` (+9, -0)
- `packages/{opencode/src/cli/cmd/tui/util => tui/src}/audio.ts` (+5, -10)
- `packages/tui/src/clipboard.ts` (+124, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/bg-pulse-render.ts` (+1, -1)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/bg-pulse.tsx` (+1, -1)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/command-palette.tsx` (+3, -3)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-agent.tsx` (+3, -3)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-console-org.tsx` (+5, -5)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-mcp.tsx` (+4, -4)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-model.tsx` (+19, -11)
- `packages/tui/src/component/dialog-move-session.tsx` (+238, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-provider.tsx` (+13, -7)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-retry-action.tsx` (+3, -3)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-session-delete-failed.tsx` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-session-list.tsx` (+16, -28)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-session-rename.tsx` (+3, -3)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-skill.tsx` (+3, -3)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-stash.tsx` (+3, -3)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-status.tsx` (+2, -2)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-tag.tsx` (+4, -4)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-theme-list.tsx` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-variant.tsx` (+3, -3)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-workspace-create.tsx` (+11, -16)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-workspace-file-changes.tsx` (+16, -10)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-workspace-list.tsx` (+7, -7)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-workspace-unavailable.tsx` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/error-component.tsx` (+13, -15)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/kilo-logo.tsx` (+2, -2)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/logo.tsx` (+2, -2)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/plugin-route-missing.tsx` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/prompt/autocomplete.tsx` (+70, -106)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/prompt/cwd.ts` (+0, -0)
- `packages/tui/src/component/prompt/frecency.tsx` (+1, -0)
- `packages/tui/src/component/prompt/history.tsx` (+1, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/prompt/index.tsx` (+99, -114)
- `packages/tui/src/component/prompt/local-attachment.ts` (+48, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/prompt/move.tsx` (+53, -18)
- `packages/tui/src/component/prompt/stash.tsx` (+1, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/prompt/workspace.tsx` (+6, -6)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/spinner.tsx` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/startup-loading.tsx` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/todo-item.tsx` (+0, -0)
- `packages/tui/src/component/use-connected.tsx` (+22, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/workspace-label.tsx` (+1, -1)
- `packages/tui/src/config/index.tsx` (+132, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/config/keybind.ts` (+5, -5)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/context/args.tsx` (+0, -0)
- `packages/tui/src/context/clipboard.tsx` (+18, -0)
- `packages/tui/src/context/data.tsx` (+619, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/context/directory.ts` (+5, -3)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/context/editor.ts` (+33, -94)
- `packages/tui/src/context/epilogue.tsx` (+6, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/context/event.ts` (+4, -4)
- `packages/tui/src/context/exit.tsx` (+8, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/context/helper.tsx` (+1, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/context/kv.tsx` (+12, -22)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/context/local.tsx` (+79, -47)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/context/path-format.tsx` (+11, -10)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/context/project.tsx` (+9, -4)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/context/prompt.tsx` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/context/route.tsx` (+15, -7)
- `packages/tui/src/context/runtime.tsx` (+62, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/context/sdk.tsx` (+14, -5)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/context/sync.tsx` (+295, -284)
- `packages/tui/src/context/theme.tsx` (+350, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/context/thinking.ts` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context => tui/src}/editor-zed.ts` (+5, -6)
- `packages/tui/src/editor.ts` (+101, -0)
- `packages/tui/src/feature-plugins/builtins.ts` (+36, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/home/footer.tsx` (+9, -8)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/home/tips-view.tsx` (+10, -6)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/home/tips.tsx` (+2, -2)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/sidebar/context.tsx` (+2, -2)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/sidebar/files.tsx` (+3, -3)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/sidebar/footer.tsx` (+7, -5)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/sidebar/lsp.tsx` (+2, -2)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/sidebar/mcp.tsx` (+2, -2)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/sidebar/todo.tsx` (+2, -2)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/system/diff-viewer-file-tree-utils.ts` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/system/diff-viewer-file-tree.tsx` (+2, -2)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/system/diff-viewer-ui.tsx` (+1, -1)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/system/diff-viewer.tsx` (+13, -10)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/system/notifications.ts` (+2, -2)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/system/plugins.tsx` (+5, -5)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/system/which-key.tsx` (+2, -2)
- `packages/tui/src/index.tsx` (+1, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/keymap.tsx` (+29, -22)
- `packages/tui/src/kilocode/hydration.ts` (+72, -0)
- `packages/tui/src/logo.ts` (+11, -0)
- `packages/tui/src/parsers-config.ts` (+386, -0)
- `packages/{opencode/src/cli/cmd/tui/plugin/api.tsx => tui/src/plugin/adapters.tsx}` (+20, -56)
- `packages/tui/src/plugin/api.ts` (+52, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/plugin/command-shim.ts` (+0, -0)
- `packages/tui/src/plugin/runtime.tsx` (+81, -0)
- `packages/tui/src/plugin/slots.tsx` (+75, -0)
- `packages/tui/src/prompt/display.ts` (+48, -0)
- `packages/tui/src/prompt/frecency.tsx` (+80, -0)
- `packages/{opencode/src/cli/cmd/tui/component => tui/src}/prompt/history.tsx` (+28, -34)
- `packages/tui/src/prompt/part.ts` (+29, -0)
- `packages/tui/src/prompt/stash.tsx` (+89, -0)
- `packages/{opencode/src/cli/cmd/tui/component => tui/src}/prompt/traits.ts` (+1, -7)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/routes/home.tsx` (+13, -12)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/routes/home/session-destination.tsx` (+18, -3)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/routes/session/dialog-fork-from-timeline.tsx` (+7, -7)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/routes/session/dialog-message.tsx` (+9, -8)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/routes/session/dialog-subagent.tsx` (+2, -2)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/routes/session/dialog-timeline.tsx` (+3, -3)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/routes/session/footer.tsx` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/routes/session/index.tsx` (+423, -386)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/routes/session/network.tsx` (+2, -2)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/routes/session/permission.tsx` (+8, -17)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/routes/session/question.tsx` (+2, -2)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/routes/session/sidebar.tsx` (+10, -9)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/routes/session/subagent-footer.tsx` (+5, -5)
- `packages/tui/src/routes/session/suggest.tsx` (+2, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/routes/session/terminal.tsx` (+1, -1)
- `packages/tui/src/runtime.tsx` (+9, -0)
- `packages/{opencode/src/cli/cmd/tui/win32.ts => tui/src/terminal-win32.ts}` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/aura.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/ayu.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/carbonfox.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/catppuccin-frappe.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/catppuccin-macchiato.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/catppuccin.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/cobalt2.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/colorblind.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/cursor.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/dracula.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/everforest.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/flexoki.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/github.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/gruvbox.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/kanagawa.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/kilo-v1.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/kilo.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/lucent-orng.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/material.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/matrix.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/mercury.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/monokai.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/nightowl.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/nord.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/one-dark.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/opencode.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/orng.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/osaka-jade.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/palenight.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/rosepine.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/solarized.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/synthwave84.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/tokyonight.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/vercel.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/vesper.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/zenburn.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme.tsx => tui/src/theme/index.ts}` (+117, -383)
- `packages/{opencode/src/cli/cmd/tui/component/border.tsx => tui/src/ui/border.ts}` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/ui/dialog-alert.tsx` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/ui/dialog-confirm.tsx` (+1, -1)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/ui/dialog-export-options.tsx` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/ui/dialog-help.tsx` (+1, -1)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/ui/dialog-prompt.tsx` (+1, -1)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/ui/dialog-select.tsx` (+170, -63)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/ui/dialog.tsx` (+16, -4)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/ui/link.tsx` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/ui/spinner.ts` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/ui/toast.tsx` (+10, -10)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/util/collapse-tool-output.ts` (+0, -0)
- `packages/tui/src/util/error.ts` (+182, -0)
- `packages/tui/src/util/filetype.ts` (+130, -0)
- `packages/{opencode => tui}/src/util/format.ts` (+0, -0)
- `packages/tui/src/util/layout.ts` (+25, -0)
- `packages/tui/src/util/locale.ts` (+86, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/util/markdown.ts` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/util/model.ts` (+5, -0)
- `packages/tui/src/util/path.ts` (+12, -0)
- `packages/tui/src/util/persistence.ts` (+33, -0)
- `packages/tui/src/util/presentation.ts` (+9, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/util/provider-origin.ts` (+0, -0)
- `packages/tui/src/util/record.ts` (+3, -0)
- `packages/tui/src/util/renderer.ts` (+7, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/util/revert-diff.ts` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/util/scroll.ts` (+6, -4)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/util/selection.ts` (+11, -5)
- `packages/tui/src/util/session.ts` (+3, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/util/signal.ts` (+0, -2)
- `packages/tui/src/util/tool-display.ts` (+13, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/util/transcript.ts` (+1, -1)
- `packages/tui/sst-env.d.ts` (+10, -0)
- `packages/tui/test/app-lifecycle.test.tsx` (+127, -0)
- `packages/{opencode => tui}/test/cli/cmd/tui/dialog-workspace-create.test.ts` (+1, -1)
- `packages/{opencode => tui}/test/cli/cmd/tui/model-options.test.ts` (+1, -1)
- `packages/{opencode => tui}/test/cli/cmd/tui/notifications.test.ts` (+1, -1)
- `packages/{opencode => tui}/test/cli/cmd/tui/provider-options.test.ts` (+13, -1)
- `packages/{opencode => tui}/test/cli/cmd/tui/sync-fixture.tsx` (+20, -15)
- `packages/{opencode => tui}/test/cli/cmd/tui/sync-live-hydration.test.tsx` (+5, -21)
- `packages/{opencode => tui}/test/cli/cmd/tui/sync-undefined-messages.test.tsx` (+9, -20)
- `packages/{opencode => tui}/test/cli/cmd/tui/sync.test.tsx` (+8, -13)
- `packages/{opencode => tui}/test/cli/tui/__snapshots__/inline-tool-wrap-snapshot.test.tsx.snap` (+0, -0)
- `packages/tui/test/cli/tui/data.test.tsx` (+1042, -0)
- `packages/{opencode => tui}/test/cli/tui/dialog-prompt.test.tsx` (+34, -33)
- `packages/{opencode => tui}/test/cli/tui/diff-viewer-file-tree.test.tsx` (+13, -10)
- `packages/{opencode => tui}/test/cli/tui/diff-viewer.test.tsx` (+19, -24)
- `packages/{opencode => tui}/test/cli/tui/inline-tool-wrap-snapshot.test.tsx` (+127, -4)
- `packages/{opencode => tui}/test/cli/tui/prompt-submit-race.test.ts` (+1, -1)
- `packages/{opencode => tui}/test/cli/tui/thinking.test.ts` (+1, -1)
- `packages/{opencode => tui}/test/cli/tui/use-event.test.tsx` (+19, -16)
- `packages/tui/test/clipboard.test.ts` (+19, -0)
- `packages/tui/test/config.test.tsx` (+121, -0)
- `packages/tui/test/context/local.test.ts` (+22, -0)
- `packages/tui/test/editor.test.ts` (+32, -0)
- `packages/{opencode/test/cli/tui => tui/test/feature-plugins}/diff-viewer-file-tree-utils.test.ts` (+1, -1)
- `packages/tui/test/fixture/fixture.ts` (+13, -0)
- `packages/tui/test/fixture/tui-environment.tsx` (+32, -0)
- `packages/tui/test/fixture/tui-plugin.ts` (+36, -0)
- `packages/tui/test/fixture/tui-runtime.ts` (+12, -0)
- `packages/tui/test/fixture/tui-sdk.ts` (+91, -0)
- `packages/tui/test/index.test.tsx` (+6, -0)
- `packages/{opencode/test/cli/tui => tui/test}/keymap.test.tsx` (+18, -13)
- `packages/tui/test/plugin/runtime.test.ts` (+50, -0)
- `packages/{opencode/test/cli/tui/slot-replace.test.tsx => tui/test/plugin/slots.test.tsx}` (+6, -18)
- `packages/tui/test/prompt/display.test.ts` (+33, -0)
- `packages/tui/test/prompt/history.test.ts` (+39, -0)
- `packages/tui/test/prompt/jsonl.test.ts` (+24, -0)
- `packages/tui/test/prompt/local-attachment.test.ts` (+43, -0)
- `packages/tui/test/prompt/part.test.ts` (+53, -0)
- `packages/tui/test/prompt/persistence.test.ts` (+23, -0)
- `packages/{opencode/test/cli/cmd/tui/prompt-traits.test.ts => tui/test/prompt/traits.test.ts}` (+3, -7)
- `packages/tui/test/runtime.test.tsx` (+37, -0)
- `packages/{opencode/test/cli/tui/theme-store.test.ts => tui/test/theme.test.ts}` (+18, -16)
- `packages/tui/test/use-connected.test.ts` (+21, -0)
- `packages/tui/test/util/error.test.ts` (+65, -0)
- `packages/tui/test/util/filetype.test.ts` (+16, -0)
- `packages/{opencode => tui}/test/util/format.test.ts` (+0, -0)
- `packages/tui/test/util/model.test.ts` (+9, -0)
- `packages/tui/test/util/presentation.test.ts` (+8, -0)
- `packages/tui/test/util/renderer.test.ts` (+30, -0)
- `packages/{opencode/test/cli/tui => tui/test/util}/revert-diff.test.ts` (+1, -1)
- `packages/tui/test/util/session.test.ts` (+10, -0)
- `packages/tui/test/util/tool-display.test.ts` (+40, -0)
- `packages/{opencode/test/cli/tui => tui/test/util}/transcript.test.ts` (+1, -6)
- `packages/tui/tsconfig.json` (+17, -0)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/script/colors.txt` (+1, -0)
- `packages/ui/src/components/line-comment.tsx` (+1, -0)
- `packages/ui/src/context/dialog.tsx` (+63, -30)
- `packages/ui/src/hooks/use-filtered-list.tsx` (+9, -4)
- `packages/ui/src/styles/tailwind/colors.css` (+1, -0)
- `packages/ui/src/theme/themes/oc-2.json` (+2, -0)
- `packages/ui/src/theme/v2/mapping.ts` (+2, -0)
- `packages/ui/src/v2/components/menu-v2.css` (+7, -0)
- `packages/ui/src/v2/components/project-avatar-v2.css` (+44, -23)
- `packages/ui/src/v2/components/project-avatar-v2.stories.tsx` (+12, -2)
- `packages/ui/src/v2/components/project-avatar-v2.tsx` (+15, -8)
- `packages/ui/src/v2/styles/theme.css` (+3, -0)
- `patches/@ff-labs%2Ffff-bun@0.9.4.patch` (+31, -0)
- `patches/{@npmcli%2Fagent@4.0.0.patch => @npmcli%2Fagent@4.0.2.patch}` (+0, -0)
- `script/check-opencode-promise-facades.ts` (+2, -1)
- `specs/tui-package.md` (+641, -0)
- `specs/v2/schema-changelog.md` (+18, -9)
- `specs/v2/session.md` (+22, -2)
- `specs/v2/todo.md` (+2, -2)
- `specs/v2/tools.md` (+186, -0)

### Key Diffs

#### packages/core/migration/20260605042240_add_context_epoch_agent/snapshot.json
```diff
diff --git a/packages/core/migration/20260605042240_add_context_epoch_agent/snapshot.json b/packages/core/migration/20260605042240_add_context_epoch_agent/snapshot.json
index 5fe721e55..0c8fb75d7 100644
--- a/packages/core/migration/20260605042240_add_context_epoch_agent/snapshot.json
+++ b/packages/core/migration/20260605042240_add_context_epoch_agent/snapshot.json
@@ -2,9 +2,7 @@
   "version": "7",
   "dialect": "sqlite",
   "id": "d1bfa125-b81e-4c61-9b6e-e74abf6e488f",
-  "prevIds": [
-    "40f7b9b8-83b4-4ea0-a59f-76a489679d88"
-  ],
+  "prevIds": ["40f7b9b8-83b4-4ea0-a59f-76a489679d88"],
   "ddl": [
     {
       "name": "workspace",
@@ -1409,13 +1407,9 @@
       "table": "session_share"
     },
     {
-      "columns": [
-        "project_id"
-      ],
+      "columns": ["project_id"],
       "tableTo": "project",
-      "columnsTo": [
-        "id"
-      ],
+      "columnsTo": ["id"],
       "onUpdate": "NO ACTION",
       "onDelete": "CASCADE",
       "nameExplicit": false,
@@ -1424,13 +1418,9 @@
       "table": "workspace"
     },
     {
-      "columns": [
-        "active_account_id"
-      ],
+      "columns": ["active_account_id"],
       "tableTo": "account",
-      "columnsTo": [
-        "id"
-      ],
+      "columnsTo": ["id"],
       "onUpdate": "NO ACTION",
       "onDelete": "SET NULL",
       "nameExplicit": false,
@@ -1439,13 +1429,9 @@
       "table": "account_state"
     },
```

#### packages/core/migration/20260611035744_credential/migration.sql
```diff
diff --git a/packages/core/migration/20260611035744_credential/migration.sql b/packages/core/migration/20260611035744_credential/migration.sql
new file mode 100644
index 000000000..c950306e4
--- /dev/null
+++ b/packages/core/migration/20260611035744_credential/migration.sql
@@ -0,0 +1,12 @@
+CREATE TABLE `credential` (
+	`id` text PRIMARY KEY,
+	`connector_id` text NOT NULL,
+	`method_id` text NOT NULL,
+	`label` text NOT NULL,
+	`value` text NOT NULL,
+	`active` integer DEFAULT false NOT NULL,
+	`time_created` integer NOT NULL,
+	`time_updated` integer NOT NULL
+);
+--> statement-breakpoint
+CREATE UNIQUE INDEX `credential_connector_active_idx` ON `credential` (`connector_id`) WHERE "credential"."active" = 1;
```

#### packages/core/migration/20260611035744_credential/snapshot.json
```diff
diff --git a/packages/core/migration/20260611035744_credential/snapshot.json b/packages/core/migration/20260611035744_credential/snapshot.json
new file mode 100644
index 000000000..cfc393030
--- /dev/null
+++ b/packages/core/migration/20260611035744_credential/snapshot.json
@@ -0,0 +1,2095 @@
+{
+  "version": "7",
+  "dialect": "sqlite",
+  "id": "f25f9126-c7dc-4882-9ff4-af27e11d2da1",
+  "prevIds": ["d1bfa125-b81e-4c61-9b6e-e74abf6e488f"],
+  "ddl": [
+    {
+      "name": "workspace",
+      "entityType": "tables"
+    },
+    {
+      "name": "data_migration",
+      "entityType": "tables"
+    },
+    {
+      "name": "account_state",
+      "entityType": "tables"
+    },
+    {
+      "name": "account",
+      "entityType": "tables"
+    },
+    {
+      "name": "control_account",
+      "entityType": "tables"
+    },
+    {
+      "name": "credential",
+      "entityType": "tables"
+    },
+    {
+      "name": "event_sequence",
+      "entityType": "tables"
+    },
+    {
+      "name": "event",
+      "entityType": "tables"
+    },
+    {
+      "name": "permission",
+      "entityType": "tables"
+    },
+    {
+      "name": "project_directory",
```

#### packages/core/migration/20260714141136_session-message-legacy-writer-compat/snapshot.json
```diff
diff --git a/packages/core/migration/20260714141136_session-message-legacy-writer-compat/snapshot.json b/packages/core/migration/20260714141136_session-message-legacy-writer-compat/snapshot.json
index 6e404909a..ca05d7d59 100644
--- a/packages/core/migration/20260714141136_session-message-legacy-writer-compat/snapshot.json
+++ b/packages/core/migration/20260714141136_session-message-legacy-writer-compat/snapshot.json
@@ -3,7 +3,7 @@
   "dialect": "sqlite",
   "id": "6c030252-8b68-4107-b18a-f64f99b76895",
   "prevIds": [
-    "d1bfa125-b81e-4c61-9b6e-e74abf6e488f"
+    "f25f9126-c7dc-4882-9ff4-af27e11d2da1"
   ],
   "ddl": [
     {
@@ -26,6 +26,10 @@
       "name": "control_account",
       "entityType": "tables"
     },
+    {
+      "name": "credential",
+      "entityType": "tables"
+    },
     {
       "name": "event_sequence",
       "entityType": "tables"
@@ -368,6 +372,86 @@
       "entityType": "columns",
       "table": "control_account"
     },
+    {
+      "type": "text",
+      "notNull": false,
+      "autoincrement": false,
+      "default": null,
+      "generated": null,
+      "name": "id",
+      "entityType": "columns",
+      "table": "credential"
+    },
+    {
+      "type": "text",
+      "notNull": true,
+      "autoincrement": false,
+      "default": null,
+      "generated": null,
+      "name": "connector_id",
+      "entityType": "columns",
+      "table": "credential"
+    },
+    {
+      "type": "text",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index af410efcd..bcf809158 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -9,7 +9,7 @@
     "db": "bun drizzle-kit",
     "migration": "bun run script/migration.ts",
     "fix-node-pty": "bun run script/fix-node-pty.ts",
-    "test": "bun test",
+    "test": "bun test --only-failures",
     "test:ci": "mkdir -p .artifacts/unit && bun test --timeout 30000 --reporter=junit --reporter-outfile=.artifacts/unit/junit.xml",
     "typecheck": "tsgo --noEmit"
   },
@@ -32,6 +32,11 @@
       "bun": "./src/pty/pty.bun.ts",
       "node": "./src/pty/pty.node.ts",
       "default": "./src/pty/pty.bun.ts"
+    },
+    "#fff": {
+      "bun": "./src/filesystem/fff.bun.ts",
+      "node": "./src/filesystem/fff.node.ts",
+      "default": "./src/filesystem/fff.bun.ts"
     }
   },
   "devDependencies": {
@@ -79,7 +84,7 @@
     "zod": "catalog:",
     "@ai-sdk/alibaba": "1.0.17",
     "@ai-sdk/amazon-bedrock": "4.0.112",
-    "@ai-sdk/anthropic": "3.0.71",
+    "@ai-sdk/anthropic": "3.0.82",
     "@ai-sdk/azure": "3.0.49",
     "@ai-sdk/cerebras": "2.0.54",
     "@ai-sdk/cohere": "3.0.27",
@@ -100,7 +105,7 @@
     "@aws-sdk/credential-providers": "3.1057.0",
     "@openrouter/ai-sdk-provider": "2.9.0",
     "ai-gateway-provider": "3.1.2",
-    "gitlab-ai-provider": "6.8.0",
+    "gitlab-ai-provider": "6.9.3",
     "google-auth-library": "10.5.0",
     "immer": "11.1.4",
     "venice-ai-sdk-provider": "2.0.2",
@@ -118,7 +123,9 @@
     "htmlparser2": "8.0.2",
     "ignore": "7.0.5",
     "turndown": "7.2.0",
-    "which": "6.0.1"
+    "which": "6.0.1",
+    "@ff-labs/fff-bun": "0.9.4",
```


*... and more files (showing first 5)*

## opencode Changes (3238daa..fab2133)

### Commits

- fab2133 - chore: configure trust center domain (#36910) (opencode-agent[bot], 2026-07-18)
- 901c9e7 - fix(app): disable unavailable file navigation (#37595) (opencode-agent[bot], 2026-07-18)
- 3476e6b - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-18)
- 86e04d4 - revert(tui): downgrade opentui to 0.4.3 (#37582) (opencode-agent[bot], 2026-07-17)
- 45cd8d7 - update zen models (Frank, 2026-07-17)
- a46374e - go: kimi k3 promotion (Frank, 2026-07-17)
- 41405c9 - chore: generate (opencode-agent[bot], 2026-07-17)
- 49d2dd8 - fix(provider): honor reasoning option semantics (#37519) (Aiden Cline, 2026-07-17)
- 0df2f62 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-17)
- 38989c5 - chore(tui): upgrade opentui to 0.4.5 (#37522) (Sebastian, 2026-07-17)
- 69a8066 - fix(stats): polish comparison chart (Adam, 2026-07-17)
- 518b0bf - chore: generate (opencode-agent[bot], 2026-07-17)
- be08207 - docs(go): update DeepSeek and MiMo pricing (#37509) (Jack, 2026-07-17)
- efb6cc2 - fix(session-ui): preserve prompt editing behavior (#37483) (Brendan Allan, 2026-07-17)
- 4bffbb6 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-17)
- ba6cf38 - feat(desktop): add focus debug toggle (#37465) (Brendan Allan, 2026-07-17)
- 86978e7 - feat(ui): updates to design system (#37471) (Aarav Sareen, 2026-07-17)
- 82a3270 - chore: generate (opencode-agent[bot], 2026-07-17)
- c0a258b - feat(session-ui): rewrite v2 prompt input (#37102) (Brendan Allan, 2026-07-17)
- ed926be - feat(app): review panel reactivity improvements (#37089) (Aarav Sareen, 2026-07-17)
- b527f60 - feat(app): update review panel tooltip to v2 (#37095) (Aarav Sareen, 2026-07-17)
- aca52ba - chore: generate (opencode-agent[bot], 2026-07-17)
- f7d5a1c - feat(desktop): align provider onboarding dialogs (#36733) (usrnk1, 2026-07-17)

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
- `bun.lock` (+1, -0)
- `infra/stage.ts` (+19, -0)
- `nix/hashes.json` (+4, -4)
- `packages/app/e2e/regression/prompt-thinking-level.spec.ts` (+3, -6)
- `packages/app/e2e/smoke/session-timeline.spec.ts` (+1, -1)
- `packages/app/src/app.tsx` (+11, -1)
- `packages/app/src/components/debug-bar.tsx` (+53, -1)
- `packages/app/src/components/dialog-connect-provider.stories.tsx` (+73, -0)
- `packages/app/src/components/dialog-connect-provider.tsx` (+425, -30)
- `packages/app/src/components/dialog-custom-provider.tsx` (+2, -2)
- `packages/app/src/components/dialog-select-model-unpaid-v2.stories.tsx` (+55, -0)
- `packages/app/src/components/dialog-select-model-unpaid-v2.tsx` (+96, -94)
- `packages/app/src/components/prompt-input-v2.tsx` (+585, -0)
- `packages/app/src/components/prompt-input.stories.tsx` (+9, -3)
- `packages/app/src/components/prompt-input.tsx` (+300, -889)
- `packages/app/src/components/prompt-input/attachments.ts` (+1, -1)
- `packages/app/src/components/prompt-input/contracts.ts` (+57, -0)
- `packages/app/src/components/prompt-input/history-store.ts` (+47, -0)
- `packages/app/src/components/prompt-input/placeholder.ts` (+5, -0)
- `packages/app/src/components/prompt-input/submit.test.ts` (+8, -1)
- `packages/app/src/components/prompt-input/transient-state.ts` (+0, -3)
- `packages/app/src/components/prompt-project-selector.tsx` (+5, -3)
- `packages/app/src/components/session/session-sortable-tab-v2.tsx` (+13, -5)
- `packages/app/src/context/platform.tsx` (+3, -0)
- `packages/app/src/context/prompt-state.ts` (+2, -1)
- `packages/app/src/context/prompt.tsx` (+18, -6)
- `packages/app/src/i18n/en.ts` (+2, -0)
- `packages/app/src/pages/new-session.tsx` (+79, -84)
- `packages/app/src/pages/session.tsx` (+117, -78)
- `packages/app/src/pages/session/composer/session-composer-controls.ts` (+1, -4)
- `packages/app/src/pages/session/composer/todo-panel-motion.stories.tsx` (+0, -1)
- `packages/app/src/pages/session/session-side-panel.tsx` (+22, -9)
- `packages/app/test-browser/prompt-transient-state.test.ts` (+0, -2)
- `packages/console/app/src/i18n/ar.ts` (+1, -1)
- `packages/console/app/src/i18n/br.ts` (+1, -1)
- `packages/console/app/src/i18n/da.ts` (+1, -1)
- `packages/console/app/src/i18n/de.ts` (+1, -1)
- `packages/console/app/src/i18n/en.ts` (+5, -1)
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
- `packages/console/app/src/routes/enterprise/index.tsx` (+6, -0)
- `packages/console/app/src/routes/go/index.css` (+31, -27)
- `packages/console/app/src/routes/go/index.tsx` (+9, -42)
- `packages/desktop/src/main/debug.ts` (+95, -0)
- `packages/desktop/src/main/ipc.ts` (+4, -0)
- `packages/desktop/src/preload/index.ts` (+1, -0)
- `packages/desktop/src/preload/types.ts` (+1, -0)
- `packages/desktop/src/renderer/index.tsx` (+2, -0)
- `packages/opencode/src/provider/transform.ts` (+2, -2)
- `packages/opencode/test/provider/provider.test.ts` (+10, -1)
- `packages/opencode/test/provider/transform.test.ts` (+20, -12)
- `packages/session-ui/package.json` (+5, -1)
- `packages/session-ui/src/v2/components/prompt-input/attachments.ts` (+266, -0)
- `packages/session-ui/src/v2/components/prompt-input/index.tsx` (+690, -0)
- `packages/session-ui/src/v2/components/prompt-input/interaction.ts` (+480, -0)
- `packages/session-ui/src/v2/components/prompt-input/machine.test.ts` (+137, -0)
- `packages/session-ui/src/v2/components/prompt-input/machine.ts` (+256, -0)
- `packages/session-ui/src/v2/components/prompt-input/prompt-input.stories.tsx` (+221, -0)
- `packages/session-ui/src/v2/components/prompt-input/store.test.ts` (+94, -0)
- `packages/session-ui/src/v2/components/prompt-input/store.ts` (+116, -0)
- `packages/session-ui/src/v2/components/prompt-input/types.ts` (+106, -0)
- `packages/session-ui/src/v2/components/session-review-file-preview-v2.tsx` (+3, -1)
- `packages/session-ui/src/v2/components/session-review-v2.css` (+30, -2)
- `packages/session-ui/src/v2/components/session-review-v2.tsx` (+10, -9)
- `packages/stats/app/src/routes/compare-radar.tsx` (+2, -33)
- `packages/stats/app/src/routes/index.css` (+13, -22)
- `packages/storybook/.storybook/main.ts` (+2, -0)
- `packages/storybook/.storybook/mocks/app/context/command.ts` (+3, -0)
- `packages/storybook/.storybook/mocks/app/context/language.ts` (+65, -1)
- `packages/storybook/.storybook/mocks/app/context/server-sdk.ts` (+47, -0)
- `packages/storybook/.storybook/mocks/app/context/server-sync.ts` (+33, -0)
- `packages/storybook/.storybook/mocks/app/context/sync.ts` (+2, -0)
- `packages/storybook/.storybook/mocks/app/hooks/use-providers.ts` (+24, -2)
- `packages/storybook/package.json` (+1, -0)
- `packages/ui/src/components/resize-handle.tsx` (+21, -5)
- `packages/ui/src/components/tabs.css` (+61, -1)
- `packages/ui/src/v2/components/button-v2.css` (+23, -0)
- `packages/ui/src/v2/components/button-v2.stories.tsx` (+4, -3)
- `packages/ui/src/v2/components/button-v2.tsx` (+1, -1)
- `packages/ui/src/v2/components/dialog-v2.tsx` (+1, -1)
- `packages/ui/src/v2/components/divider-v2.css` (+2, -2)
- `packages/ui/src/v2/components/inline-input-v2.css` (+7, -0)
- `packages/ui/src/v2/components/inline-input-v2.tsx` (+16, -1)
- `packages/ui/src/v2/components/text-input-v2.css` (+1, -0)
- `packages/web/src/content/docs/ar/go.mdx` (+2, -2)
- `packages/web/src/content/docs/ar/zen.mdx` (+5, -5)
- `packages/web/src/content/docs/bs/go.mdx` (+20, -20)
- `packages/web/src/content/docs/bs/zen.mdx` (+5, -5)
- `packages/web/src/content/docs/da/go.mdx` (+20, -20)
- `packages/web/src/content/docs/da/zen.mdx` (+5, -5)
- `packages/web/src/content/docs/de/go.mdx` (+20, -20)
- `packages/web/src/content/docs/de/zen.mdx` (+5, -5)
- `packages/web/src/content/docs/es/go.mdx` (+2, -2)
- `packages/web/src/content/docs/es/zen.mdx` (+5, -5)
- `packages/web/src/content/docs/fr/go.mdx` (+20, -20)
- `packages/web/src/content/docs/fr/zen.mdx` (+5, -5)
- `packages/web/src/content/docs/go.mdx` (+20, -20)
- `packages/web/src/content/docs/it/go.mdx` (+20, -20)
- `packages/web/src/content/docs/it/zen.mdx` (+5, -5)
- `packages/web/src/content/docs/ja/go.mdx` (+20, -20)
- `packages/web/src/content/docs/ja/zen.mdx` (+5, -5)
- `packages/web/src/content/docs/ko/go.mdx` (+20, -20)
- `packages/web/src/content/docs/ko/zen.mdx` (+5, -5)
- `packages/web/src/content/docs/nb/go.mdx` (+20, -20)
- `packages/web/src/content/docs/nb/zen.mdx` (+5, -5)
- `packages/web/src/content/docs/pl/go.mdx` (+2, -2)
- `packages/web/src/content/docs/pl/zen.mdx` (+5, -5)
- `packages/web/src/content/docs/pt-br/go.mdx` (+2, -2)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+5, -5)
- `packages/web/src/content/docs/ru/go.mdx` (+20, -20)
- `packages/web/src/content/docs/ru/zen.mdx` (+5, -5)
- `packages/web/src/content/docs/th/go.mdx` (+20, -20)
- `packages/web/src/content/docs/th/zen.mdx` (+5, -5)
- `packages/web/src/content/docs/tr/go.mdx` (+20, -20)
- `packages/web/src/content/docs/tr/zen.mdx` (+5, -5)
- `packages/web/src/content/docs/zen.mdx` (+5, -5)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+20, -20)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+5, -5)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+20, -20)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+5, -5)

### Key Diffs

(no key diffs to show)

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/agent.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/subagent-permissions.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/kilocode/agent/index.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/test/agent/agent.test.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/test/agent/plan-mode-subagent-bypass.test.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/test/agent/plugin-agent-regression.test.ts
- `src/core/` - review core changes from packages/core/migration/20260605042240_add_context_epoch_agent/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260611035744_credential/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260611035744_credential/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260714141136_session-message-legacy-writer-compat/snapshot.json
- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/src/agent.ts
- `src/core/` - review core changes from packages/core/src/auth.ts
- `src/core/` - review core changes from packages/core/src/catalog.ts
- `src/core/` - review core changes from packages/core/src/command.ts
- `src/core/` - review core changes from packages/core/src/config.ts
- `src/core/` - review core changes from packages/core/src/config/compaction.ts
- `src/core/` - review core changes from packages/core/src/config/mcp.ts
- `src/core/` - review core changes from packages/core/src/config/plugin/agent.ts
- `src/core/` - review core changes from packages/core/src/config/plugin/provider.ts
- `src/core/` - review core changes from packages/core/src/config/plugin/reference.ts
- `src/core/` - review core changes from packages/core/src/config/reference.ts
- `src/core/` - review core changes from packages/core/src/connector.ts
- `src/core/` - review core changes from packages/core/src/connector/schema.ts
- `src/core/` - review core changes from packages/core/src/control-plane/move-session.ts
- `src/core/` - review core changes from packages/core/src/credential.ts
- `src/core/` - review core changes from packages/core/src/credential/sql.ts
- `src/core/` - review core changes from packages/core/src/cross-spawn-spawner.ts
- `src/core/` - review core changes from packages/core/src/database/database.ts
- `src/core/` - review core changes from packages/core/src/database/migration.gen.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260611035744_credential.ts
- `src/core/` - review core changes from packages/core/src/effect/layer-node-platform.ts
- `src/core/` - review core changes from packages/core/src/effect/layer-node.ts
- `src/core/` - review core changes from packages/core/src/effect/logger.ts
- `src/core/` - review core changes from packages/core/src/effect/observability.ts
- `src/core/` - review core changes from packages/core/src/effect/runtime.ts
- `src/core/` - review core changes from packages/core/src/event.ts
- `src/core/` - review core changes from packages/core/src/file-mutation.ts
- `src/core/` - review core changes from packages/core/src/filesystem.ts
- `src/core/` - review core changes from packages/core/src/filesystem/fff.bun.ts
- `src/core/` - review core changes from packages/core/src/filesystem/fff.node.ts
- `src/core/` - review core changes from packages/core/src/filesystem/ripgrep.ts
- `src/core/` - review core changes from packages/core/src/filesystem/schema.ts
- `src/core/` - review core changes from packages/core/src/filesystem/search.ts
- `src/core/` - review core changes from packages/core/src/filesystem/watcher.ts
- `src/core/` - review core changes from packages/core/src/flag/flag.ts
- `src/core/` - review core changes from packages/core/src/fs-util.ts
- `src/core/` - review core changes from packages/core/src/git.ts
- `src/core/` - review core changes from packages/core/src/global.ts
- `src/core/` - review core changes from packages/core/src/image.ts
- `src/core/` - review core changes from packages/core/src/image/photon.ts
- `src/core/` - review core changes from packages/core/src/instruction-context.ts
- `src/core/` - review core changes from packages/core/src/kilocode/credential-migration.ts
- `src/core/` - review core changes from packages/core/src/kilocode/fff.ts
- `src/core/` - review core changes from packages/core/src/kilocode/image-size.ts
- `src/core/` - review core changes from packages/core/src/kilocode/search-target.ts
- `src/core/` - review core changes from packages/core/src/kilocode/session-message.ts
- `src/core/` - review core changes from packages/core/src/kilocode/spawn-validation.ts
- `src/core/` - review core changes from packages/core/src/location-layer.ts
- `src/core/` - review core changes from packages/core/src/location-mutation.ts
- `src/core/` - review core changes from packages/core/src/location-search.ts
- `src/core/` - review core changes from packages/core/src/location.ts
- `src/core/` - review core changes from packages/core/src/model-request.ts
- `src/core/` - review core changes from packages/core/src/model.ts
- `src/core/` - review core changes from packages/core/src/models-dev.ts
- `src/core/` - review core changes from packages/core/src/npm.ts
- `src/core/` - review core changes from packages/core/src/observability.ts
- `src/core/` - review core changes from packages/core/src/observability/logging.ts
- `src/core/` - review core changes from packages/core/src/observability/otlp.ts
- `src/core/` - review core changes from packages/core/src/observability/shared.ts
- `src/core/` - review core changes from packages/core/src/plugin.ts
- `src/core/` - review core changes from packages/core/src/plugin/account.ts
- `src/core/` - review core changes from packages/core/src/plugin/agent.ts
- `src/core/` - review core changes from packages/core/src/plugin/boot.ts
- `src/core/` - review core changes from packages/core/src/plugin/models-dev.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/cloudflare-ai-gateway.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/cloudflare-workers-ai.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/google-vertex.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/openai-auth.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/openai.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/opencode.ts
- `src/core/` - review core changes from packages/core/src/plugin/skill/customize-opencode.md
- `src/core/` - review core changes from packages/core/src/process.ts
- `src/core/` - review core changes from packages/core/src/project-reference.ts
- `src/core/` - review core changes from packages/core/src/project.ts
- `src/core/` - review core changes from packages/core/src/project/copy-strategies.ts
- `src/core/` - review core changes from packages/core/src/project/copy.ts
- `src/core/` - review core changes from packages/core/src/provider.ts
- `src/core/` - review core changes from packages/core/src/pty.ts
- `src/core/` - review core changes from packages/core/src/pty/ticket.ts
- `src/core/` - review core changes from packages/core/src/public/opencode.ts
- `src/core/` - review core changes from packages/core/src/public/session.ts
- `src/core/` - review core changes from packages/core/src/public/tool.ts
- `src/core/` - review core changes from packages/core/src/reference.ts
- `src/core/` - review core changes from packages/core/src/reference/guidance.ts
- `src/core/` - review core changes from packages/core/src/ripgrep.ts
- `src/core/` - review core changes from packages/core/src/ripgrep/binary.ts
- `src/core/` - review core changes from packages/core/src/session.ts
- `src/core/` - review core changes from packages/core/src/session/compaction.ts
- `src/core/` - review core changes from packages/core/src/session/event.ts
- `src/core/` - review core changes from packages/core/src/session/execution.ts
- `src/core/` - review core changes from packages/core/src/session/execution/local.ts
- `src/core/` - review core changes from packages/core/src/session/history.ts
- `src/core/` - review core changes from packages/core/src/session/input.ts
- `src/core/` - review core changes from packages/core/src/session/logging.ts
- `src/core/` - review core changes from packages/core/src/session/message-updater.ts
- `src/core/` - review core changes from packages/core/src/session/message.ts
- `src/core/` - review core changes from packages/core/src/session/projector.ts
- `src/core/` - review core changes from packages/core/src/session/prompt.ts
- `src/core/` - review core changes from packages/core/src/session/run-coordinator.ts
- `src/core/` - review core changes from packages/core/src/session/runner/index.ts
- `src/core/` - review core changes from packages/core/src/session/runner/llm.ts
- `src/core/` - review core changes from packages/core/src/session/runner/model.ts
- `src/core/` - review core changes from packages/core/src/session/runner/publish-llm-event.ts
- `src/core/` - review core changes from packages/core/src/session/runner/to-llm-message.ts
- `src/core/` - review core changes from packages/core/src/session/store.ts
- `src/core/` - review core changes from packages/core/src/skill/discovery.ts
- `src/core/` - review core changes from packages/core/src/state.ts
- `src/core/` - review core changes from packages/core/src/system-context/builtins.ts
- `src/core/` - review core changes from packages/core/src/system-context/registry.ts
- `src/core/` - review core changes from packages/core/src/tool-output-store.ts
- `src/core/` - review core changes from packages/core/src/tool-output.ts
- `src/core/` - review core changes from packages/core/src/util/effect-flock.ts
- `src/core/` - review core changes from packages/core/src/util/token.ts
- `src/core/` - review core changes from packages/core/src/v1/config/config.ts
- `src/core/` - review core changes from packages/core/src/v1/config/error.ts
- `src/core/` - review core changes from packages/core/src/v1/config/mcp.ts
- `src/core/` - review core changes from packages/core/src/v1/config/migrate.ts
- `src/core/` - review core changes from packages/core/src/v1/config/provider.ts
- `src/core/` - review core changes from packages/core/src/v1/config/reference.ts
- `src/core/` - review core changes from packages/core/src/v1/session.ts
- `src/core/` - review core changes from packages/core/test/account.test.ts
- `src/core/` - review core changes from packages/core/test/agent.test.ts
- `src/core/` - review core changes from packages/core/test/application-tools.test.ts
- `src/core/` - review core changes from packages/core/test/catalog.test.ts
- `src/core/` - review core changes from packages/core/test/config/config.test.ts
- `src/core/` - review core changes from packages/core/test/config/provider.test.ts
- `src/core/` - review core changes from packages/core/test/connector.test.ts
- `src/core/` - review core changes from packages/core/test/credential.test.ts
- `src/core/` - review core changes from packages/core/test/effect/observability.test.ts
- `src/core/` - review core changes from packages/core/test/file-mutation.test.ts
- `src/core/` - review core changes from packages/core/test/filesystem/ripgrep.test.ts
- `src/core/` - review core changes from packages/core/test/filesystem/search.test.ts
- `src/core/` - review core changes from packages/core/test/git.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/account-auth-v2-migration.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/database-migration-compat.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/event-storage-compat.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/fff.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/grep-tool.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/image-size.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/log.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/read-filesystem.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/reference-materialization.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/search-target.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/spawn-validation.test.ts
- `src/core/` - review core changes from packages/core/test/lib/tool.ts
- `src/core/` - review core changes from packages/core/test/location-filesystem.test.ts
- `src/core/` - review core changes from packages/core/test/location-layer.test.ts
- `src/core/` - review core changes from packages/core/test/location-mutation.test.ts
- `src/core/` - review core changes from packages/core/test/location-search.test.ts
- `src/core/` - review core changes from packages/core/test/model-request.test.ts
- `src/core/` - review core changes from packages/core/test/permission.test.ts
- `src/core/` - review core changes from packages/core/test/plugin.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/fixtures/models-dev.json
- `src/core/` - review core changes from packages/core/test/plugin/models-dev.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-azure.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-cloudflare-workers-ai.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-gitlab.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-google-vertex.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-helper.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-kilo.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-openai.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-opencode.test.ts
- `src/core/` - review core changes from packages/core/test/project-copy.test.ts
- `src/core/` - review core changes from packages/core/test/project-reference.test.ts
- `src/core/` - review core changes from packages/core/test/project.test.ts
- `src/core/` - review core changes from packages/core/test/public-opencode.test.ts
- `src/core/` - review core changes from packages/core/test/public-tool.test.ts
- `src/core/` - review core changes from packages/core/test/reference-guidance.test.ts
- `src/core/` - review core changes from packages/core/test/reference.test.ts
- `src/core/` - review core changes from packages/core/test/ripgrep.test.ts
- `src/core/` - review core changes from packages/core/test/session-compaction.test.ts
- `src/core/` - review core changes from packages/core/test/session-create.test.ts
- `src/core/` - review core changes from packages/core/test/session-logging.test.ts
- `src/core/` - review core changes from packages/core/test/session-projector.test.ts
- `src/core/` - review core changes from packages/core/test/session-prompt.test.ts
- `src/core/` - review core changes from packages/core/test/session-run-coordinator.test.ts
- `src/core/` - review core changes from packages/core/test/session-runner-message.test.ts
- `src/core/` - review core changes from packages/core/test/session-runner-model.test.ts
- `src/core/` - review core changes from packages/core/test/session-runner-recorded.test.ts
- `src/core/` - review core changes from packages/core/test/session-runner-tool-events.test.ts
- `src/core/` - review core changes from packages/core/test/session-runner-tool-registry.test.ts
- `src/core/` - review core changes from packages/core/test/session-runner.test.ts
- `src/core/` - review core changes from packages/core/test/session-tool-progress.test.ts
- `src/core/` - review core changes from packages/core/test/state.test.ts
- `src/core/` - review core changes from packages/core/test/system-context/registry.test.ts
- `src/core/` - review core changes from packages/core/test/tool-apply-patch.test.ts
- `src/core/` - review core changes from packages/core/test/tool-bash.test.ts
- `src/core/` - review core changes from packages/core/test/tool-edit.test.ts
- `src/core/` - review core changes from packages/core/test/tool-glob.test.ts
- `src/core/` - review core changes from packages/core/test/tool-grep.test.ts
- `src/core/` - review core changes from packages/core/test/tool-output-store.test.ts
- `src/core/` - review core changes from packages/core/test/tool-question.test.ts
- `src/core/` - review core changes from packages/core/test/tool-read.test.ts
- `src/core/` - review core changes from packages/core/test/tool-skill.test.ts
- `src/core/` - review core changes from packages/core/test/tool-todowrite.test.ts
- `src/core/` - review core changes from packages/core/test/tool-webfetch.test.ts
- `src/core/` - review core changes from packages/core/test/tool-websearch.test.ts
- `src/core/` - review core changes from packages/core/test/tool-write.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/agent-manager/orchestration-bridge.ts
- `src/core/` - review core changes from packages/kilo-vscode/tests/unit/agent-manager-orchestration-bridge.test.ts
- `src/permission/` - review permission changes from packages/opencode/src/kilocode/permission/agent-manager.ts
- `src/permission/` - review permission changes from packages/opencode/src/permission/index.ts
- `src/permission/` - review permission changes from packages/opencode/test/kilocode/permission/agent-manager-prompt.test.ts
- `src/tool/AGENTS.md.ts` - update based on kilocode packages/core/src/tool/AGENTS.md changes
- `src/tool/agent-manager.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager.ts changes
- `src/tool/agent-manager.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager.txt changes
- `src/tool/application-tools.ts` - update based on kilocode packages/core/src/tool/application-tools.ts changes
- `src/tool/apply-patch.ts` - update based on kilocode packages/core/src/tool/apply-patch.ts changes
- `src/tool/bash.ts` - update based on kilocode packages/core/src/tool/bash.ts changes
- `src/tool/builtins.ts` - update based on kilocode packages/core/src/tool/builtins.ts changes
- `src/tool/edit.ts` - update based on kilocode packages/core/src/tool/edit.ts changes
- `src/tool/external-directory.ts` - update based on kilocode packages/opencode/src/tool/external-directory.ts changes
- `src/tool/glob.test.ts` - update based on kilocode packages/opencode/test/tool/glob.test.ts changes
- `src/tool/glob.ts` - update based on kilocode packages/core/src/tool/glob.ts changes
- `src/tool/glob.ts` - update based on kilocode packages/opencode/src/tool/glob.ts changes
- `src/tool/glob.txt.ts` - update based on kilocode packages/opencode/src/tool/glob.txt changes
- `src/tool/grep.test.ts` - update based on kilocode packages/opencode/test/tool/grep.test.ts changes
- `src/tool/grep.ts` - update based on kilocode packages/core/src/tool/grep.ts changes
- `src/tool/grep.ts` - update based on kilocode packages/opencode/src/tool/grep.ts changes
- `src/tool/grep.txt.ts` - update based on kilocode packages/opencode/src/tool/grep.txt changes
- `src/tool/native.ts` - update based on kilocode packages/core/src/tool/native.ts changes
- `src/tool/parameters.test.ts.snap.ts` - update based on kilocode packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap changes
- `src/tool/question.ts` - update based on kilocode packages/core/src/tool/question.ts changes
- `src/tool/read-filesystem.ts` - update based on kilocode packages/core/src/tool/read-filesystem.ts changes
- `src/tool/read.test.ts` - update based on kilocode packages/opencode/test/tool/read.test.ts changes
- `src/tool/read.ts` - update based on kilocode packages/core/src/tool/read.ts changes
- `src/tool/read.ts` - update based on kilocode packages/opencode/src/tool/read.ts changes
- `src/tool/registry.test.ts` - update based on kilocode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/core/src/tool/registry.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
- `src/tool/repo_clone.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/repo_clone.test.ts changes
- `src/tool/repo_clone.ts` - update based on kilocode packages/opencode/src/tool/repo_clone.ts changes
- `src/tool/shell.ts` - update based on kilocode packages/opencode/src/tool/shell.ts changes
- `src/tool/skill.test.ts` - update based on kilocode packages/opencode/test/tool/skill.test.ts changes
- `src/tool/skill.ts` - update based on kilocode packages/core/src/tool/skill.ts changes
- `src/tool/skill.ts` - update based on kilocode packages/opencode/src/tool/skill.ts changes
- `src/tool/task.test.ts` - update based on kilocode packages/opencode/test/tool/task.test.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/kilocode/tool/task.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/tool/task.ts changes
- `src/tool/todowrite.ts` - update based on kilocode packages/core/src/tool/todowrite.ts changes
- `src/tool/tool.ts` - update based on kilocode packages/core/src/tool/tool.ts changes
- `src/tool/tools.ts` - update based on kilocode packages/core/src/tool/tools.ts changes
- `src/tool/truncate.ts` - update based on kilocode packages/opencode/src/tool/truncate.ts changes
- `src/tool/warpgrep.ts` - update based on kilocode packages/opencode/src/tool/warpgrep.ts changes
- `src/tool/webfetch.ts` - update based on kilocode packages/core/src/tool/webfetch.ts changes
- `src/tool/websearch.ts` - update based on kilocode packages/core/src/tool/websearch.ts changes
- `src/tool/write.ts` - update based on kilocode packages/core/src/tool/write.ts changes
