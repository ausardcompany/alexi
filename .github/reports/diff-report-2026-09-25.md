# Upstream Changes Report
Generated: 2026-09-25 11:19:40

## Summary
- kilocode: 159 commits, 414 files changed
- opencode: 3 commits, 26 files changed

## kilocode Changes (50e520adf..6c9ac9542)

### Commits

- 6c9ac9542 - release: v7.8.0 (kilo-maintainer[bot], 2026-09-25)
- c3c1de12e - Merge pull request #14506 from Kilo-Org/feat/dependabot-security-automation (Bruno Agatão, 2026-09-25)
- f6affd984 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-09-25)
- da1b98376 - Merge pull request #13804 from Kilo-Org/browser-public-https-13618 (Marius, 2026-09-25)
- b7c710d72 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-09-25)
- 4451a84a4 - Merge commit 'd195947a76a7838247fa8b75d95cdda81fbd7ba7' into browser-public-https-13618 (marius-kilocode, 2026-09-25)
- d195947a7 - Merge pull request #14557 from Kilo-Org/research-worktree-session-binding-strategy (Marius, 2026-09-25)
- 87f6807e1 - Merge pull request #14449 from Kilo-Org/marius-kilocode/kilo-opencode-v1.18.26 (Marius, 2026-09-25)
- cbf5dfa30 - fix(agent-manager): open 0.0.0.0 dev server URLs on localhost (marius-kilocode, 2026-09-25)
- 5a01aa66c - test(vscode): wait for rendered rows before diff resize checks (marius-kilocode, 2026-09-25)
- 711fe42e2 - Merge pull request #14556 from Kilo-Org/innovative-jaxartosaurus (Marius, 2026-09-25)
- 94f4f3df2 - fix(agent-manager): address review feedback on project recovery (marius-kilocode, 2026-09-25)
- 4ef8aeb55 - fix(agent-manager): recover the Integrated Browser and add history navigation (marius-kilocode, 2026-09-25)
- a28b93b19 - chore: merge main and reconcile Bun lockfile (marius-kilocode, 2026-09-25)
- 430e6cf1f - feat(vscode): add Close Task and Close All Tasks commands (#13808) (sylwester-liljegren, 2026-09-25)
- 9a6abc0fb - fix(agent-manager): survive inaccessible historical project paths (marius-kilocode, 2026-09-25)
- 277103f4d - feat: reclaim database space after session cleanup and add a stop button (#14540) (V Keerthi Vikram, 2026-09-25)
- 66d36d41d - fix(vscode): keep chat tabs for older History sessions open (#14536) (hdcode.dev, 2026-09-25)
- d6bb0ef05 - fix(cli): surface network disconnects in the TUI instead of hanging silently (#13523) (rakshith1928, 2026-09-25)
- b6eece6e6 - fix(vscode): run editor actions when the sidebar shows History (#14491) (hdcode.dev, 2026-09-25)
- 8f80a09c2 - fix(agent-manager): evict stale worktree pool slots and cold-create (marius-kilocode, 2026-09-25)
- 249cd7259 - fix(cli): keep sub-agents of a chat in use during session cleanup (#14502) (hdcode.dev, 2026-09-25)
- b1ea859d2 - fix(cli): align settings validation with config compatibility (marius-kilocode, 2026-09-25)
- 8b02b7a1e - docs: sync cloud-web with merged PRs (2026-09-24) (#14527) (github-actions[bot], 2026-09-24)
- 0b671da46 - Merge pull request #14545 from Kilo-Org/jetbrains/release/v7.1.8-rc.1 (Kirill Kalishev, 2026-09-24)
- 62a35274b - docs(jetbrains): edit changelog for v7.1.8-rc.1 (Kirill Kalishev, 2026-09-24)
- c31ab563f - release(jetbrains): v7.1.8-rc.1 (kilo-maintainer[bot], 2026-09-24)
- 14e754653 - release: v7.7.12 (kilo-maintainer[bot], 2026-09-24)
- 8e842f1c9 - Merge pull request #14543 from Kilo-Org/feat/ev-code-signing (Zeke Fralish, 2026-09-24)
- b2fed39df - fix(ci): restore signed-artifact wiring for downstream publish jobs (Zeke Fralish, 2026-09-24)
- 3921c6144 - Merge remote-tracking branch 'origin/main' into feat/ev-code-signing (Zeke Fralish, 2026-09-24)
- ef02ab3fb - fix(ci): force tar to treat RUNNER_TEMP as a local path on Windows (Zeke Fralish, 2026-09-24)
- cb4dafad7 - Merge pull request #14520 from Kilo-Org/perf/jetbrains-transcript-tab-switch (Kirill Kalishev, 2026-09-24)
- b3f96ead7 - refactor(security): tighten dependabot-auto-merge.yml (Bruno Agatao, 2026-09-24)
- c5aea7892 - Merge pull request #14515 from Kilo-Org/fix/jetbrains-vfs-unload-crash (Kirill Kalishev, 2026-09-24)
- fce934e1e - Merge pull request #14541 from Kilo-Org/revert-14462-feat/ev-code-signing (Zeke Fralish, 2026-09-24)
- b44493506 - Merge branch 'main' into feat/dependabot-security-automation (Bruno Agatão, 2026-09-24)
- 58ded5620 - fix(security): address Kilo Code Review findings (Bruno Agatao, 2026-09-24)
- 5ec05a3fb - Revert "feat(ci): sign Windows CLI binaries with Azure Key Vault EV certificate" (Zeke Fralish, 2026-09-24)
- e66903e6b - docs(security): add README for the new automation workflows (Bruno Agatao, 2026-09-24)
- d620c9ab8 - fix(security): satisfy CI and drop shared-code ecosystem blocks (Bruno Agatao, 2026-09-24)
- 59b0a8126 - test(jetbrains): wait for worktree rows to settle in AgentManagerPanelTest (marius-kilocode, 2026-09-24)
- f08c95480 - Merge commit '50e520adf60ee5af8509336db471702415422c90' into browser-public-https-13618 (marius-kilocode, 2026-09-24)
- 891d7b893 - fix(vscode): allow optional OAuth prompts in provider connect (marius-kilocode, 2026-09-24)
- b90c350c9 - fix(vscode): deduplicate OAuth prompt rendering and format host handler (marius-kilocode, 2026-09-24)
- f677743b9 - fix: resolve Azure Entra endpoint prompts and nested MCP headers (marius-kilocode, 2026-09-24)
- 8481a19d3 - fix(jetbrains): restore ActiveListView's animation delegate on re-attach (kirillk, 2026-09-23)
- 8e83b74e4 - fix(jetbrains): address PR review suggestions in tab-switch perf change (kirillk, 2026-09-23)
- ceb83ea1a - perf(jetbrains): speed up transcript tab switching and list painting (kirillk, 2026-09-23)
- dfa67d022 - fix(jetbrains): avoid crash when vfs kind service is unresolvable during plugin unload (kirillk, 2026-09-23)
- 5f702c357 - Merge remote-tracking branch 'origin/feat/dependabot-security-automation' into feat/dependabot-security-automation (Bruno Agatao, 2026-09-23)
- a08e5dee3 - fix(security): restrict auto-merge to kilo-owned paths (Bruno Agatao, 2026-09-23)
- c18438c52 - Merge branch 'main' into feat/dependabot-security-automation (Bruno Agatão, 2026-09-23)
- b28fa89ec - feat(security): automate dependency remediation and Slack visibility (Bruno Agatao, 2026-09-23)
- 7f22634ab - test(cli): read the persistent descendant leader pid from a file (marius-kilocode, 2026-09-23)
- 08abb6142 - Merge commit '5a7127856554cf4a8e49c2c10193c3edbac40e34' into marius-kilocode/kilo-opencode-v1.18.26 (marius-kilocode, 2026-09-23)
- 305588ece - fix(cli): let a bodyless upgrade request reach the latest fallback (marius-kilocode, 2026-09-23)
- f1a02dcfd - test(tui): widen the diff file tree settle window (marius-kilocode, 2026-09-23)
- 566ee9275 - fix(cli): restore Kilo compat dropped by the upstream merge (marius-kilocode, 2026-09-22)
- bde120356 - Merge remote-tracking branch 'origin/marius-kilocode/kilo-opencode-v1.18.26' into marius-kilocode/kilo-opencode-v1.18.26 (marius-kilocode, 2026-09-22)
- 4932462b0 - test(cli): make wakeup cron re-arm test deterministic under load (marius-kilocode, 2026-09-22)
- 74140de2f - Merge remote-tracking branch 'origin/main' into marius-kilocode/kilo-opencode-v1.18.26 (marius-kilocode, 2026-09-22)
- c12edf568 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-22)
- 1d5b9fd3b - Merge remote-tracking branch 'origin/marius-kilocode/kilo-opencode-v1.18.26' into marius-kilocode/kilo-opencode-v1.18.26 (marius-kilocode, 2026-09-22)
- 3d3dfc933 - fix: probe the lowering per key for the excess-key exemption (marius-kilocode, 2026-09-22)
- 1e1f415a9 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-22)
- 564f78b04 - fix: derive the excess-key exemption from the V2 lowering (marius-kilocode, 2026-09-22)
- 57f8fe618 - fix: narrow the excess-key exemption to the keys the lowering aliases (marius-kilocode, 2026-09-22)
- 4f8279357 - fix: exclude V2 keys from excess-key warnings and de-flake poller tests (marius-kilocode, 2026-09-22)
- e3329a86c - fix: address merge review findings (marius-kilocode, 2026-09-22)
- 79224d1c4 - fix: adapt patched dependency guard and restore httpapi shards flag (marius-kilocode, 2026-09-22)
- 77720d4fe - fix: restore dropped Kilo scripts and exclude Azure OAuth scopes (marius-kilocode, 2026-09-22)
- af6410249 - Merge OpenCode v1.18.21 through v1.18.26 (marius-kilocode, 2026-09-22)
- 77c53e4e5 - merge: record upstream v1.18.26 (marius-kilocode, 2026-09-22)
- 8995256c8 - refactor: kilo compat for v1.18.26 (marius-kilocode, 2026-09-22)
- 7539a5545 - Merge commit '152ab49a48a178a9e732e10447f62d2e466edbb3' into browser-public-https-13618 (marius-kilocode, 2026-09-22)
- 3885f6a43 - Merge commit 'd5191797fea2c93d88bc1647b34513acab18a132' into browser-public-https-13618 (marius-kilocode, 2026-09-21)
- d3682b60a - Merge commit '4cfb2f87df3ebefe8bed94e9537e229fb3708e46' into browser-public-https-13618 (marius-kilocode, 2026-09-18)
- 55b54ad70 - Merge branch 'main' into browser-public-https-13618 (marius-kilocode, 2026-09-08)
- 3fab1b1e5 - Merge remote-tracking branch 'origin/browser-public-https-13618' into browser-public-https-13618 (marius-kilocode, 2026-09-08)
- 697583c95 - test: run browser checks in Node and synchronize PR status assertions (marius-kilocode, 2026-09-08)
- df41127ee - Merge branch 'main' into browser-public-https-13618 (Marius, 2026-09-08)
- a03f2f694 - fix(browser): stabilize CI network checks (marius-kilocode, 2026-09-08)
- 454040e8e - Merge remote-tracking branch 'origin/main' into browser-public-https-13618 (marius-kilocode, 2026-09-07)
- 9f739b045 - feat: stream Agent Manager browser previews with public HTTPS (marius-kilocode, 2026-09-04)
- 774cc7c19 - release: v1.18.26 (opencode, 2026-09-01)
- 8100c68b5 - fix(app): bump happy-dom to fix GC-dependent MutationObserver flake (#46675) (Aiden Cline, 2026-09-01)
- 86387e90b - test(opencode): fix session tools test typecheck and runtime (#46677) (Aiden Cline, 2026-09-01)
- c10d6767c - chore: update nix node_modules hashes (opencode-agent[bot], 2026-09-01)
- 765ae641d - fix(core): Fix for incorrect time.start reset in tool call logging (#32574) (#32596) (Roscoe A. Bartlett, 2026-09-01)
- c066339d8 - test(opencode): guard patched dependency versions (#46673) (Aiden Cline, 2026-09-01)
- 154219521 - fix(opencode): allow none reasoning effort in Bedrock SDK (#46671) (Aiden Cline, 2026-09-01)
- af1f9e626 - remove azure discovery stuff (#46666) (Filip, 2026-09-01)
- 2961956c7 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-09-01)
- 3f39a329c - feat(opencode): tolerate Anthropic thinking block binding (#46653) (Aiden Cline, 2026-09-01)
- dc8753f82 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-09-01)
- 4502ee568 - fix(core): bump @ai-sdk/amazon-bedrock to 4.0.166 for reasoning and replay fixes (#45520) (KevinZhou, 2026-09-01)
- 55c54d14b - chore: use native runtime conditions in development (#46644) (Aiden Cline, 2026-09-01)
- 2da5a4b03 - refactor(tui): use OpenTUI Dynamic in session view (#46649) (Aiden Cline, 2026-09-01)
- 216ba8f05 - fix(opencode): stop Azure model discovery from logging to stdout (#46646) (Aiden Cline, 2026-09-01)
- df6aecdbc - chore: generate (opencode-agent[bot], 2026-09-01)
- 1ce281b7a - fix(stats): prevent comparison legend collapse (Adam, 2026-09-01)
- 5341a5e44 - feat(console): add workspace migration timestamp (#46627) (Victor Navarro, 2026-09-01)
- ebece6efd - docs(web): update Qwen3.7 Max Go usage (#46555) (Jack, 2026-09-01)
- 1ead9e3d7 - fix(web): number Go usage requirements (Dax Raad, 2026-08-31)
- be3b703a7 - fix(web): restore documentation list markers (Dax Raad, 2026-08-31)
- f7da00f35 - fix(opencode): omit empty apply patch move path (#45329) (Kyle Altendorf, 2026-08-31)
- 5c5c709fe - fix(tui): pin diff highlights query (#46519) (opencode-agent[bot], 2026-08-31)
- 2386fcec7 - chore: generate (opencode-agent[bot], 2026-09-01)
- ba790579e - docs on proper usage of OpenCode Go (Dax Raad, 2026-08-31)
- 04284921a - chore: generate (opencode-agent[bot], 2026-08-31)
- b639de07a - fix(stats): merge deepseek flash variants (#46446) (Adam, 2026-08-31)
- 26ff3ed3d - fix(tui): keep home shortcuts right-aligned (#36906) (opencode-agent[bot], 2026-08-31)
- 9f69463f1 - fix(app): backport session rename and tab menu fixes to v1 (#46116) (opencode-agent[bot], 2026-08-31)
- 10765ff2a - fix: remove Hy3 Free docs and correct Go chart rendering (#46221) (Jack, 2026-08-30)
- be53e17e1 - docs(go): end Hy3 usage promotion (#46213) (Jack, 2026-08-30)
- dc4449df0 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-08-29)
- 62a2f0e61 - feat(console): animate Go usage allowances and bonuses (#46055) (Kit Langton, 2026-08-29)
- df35e842f - docs(zen): add Ling 3.0 Flash Fin Free (#45923) (Jack, 2026-08-28)
- 1be9fd55a - docs(go): add Hy4 preview (#45904) (Jack, 2026-08-28)
- 755ebdb94 - sync release versions for v1.18.25 (opencode, 2026-08-28)
- c2e39bb55 - test(opencode): use native config path in permission assertion (#45849) (opencode-agent[bot], 2026-08-28)
- 733562e92 - fix(opencode): remove Bun dependency from Azure authentication (#45845) (opencode-agent[bot], 2026-08-28)
- 8a7cc0c0f - docs(go): add Qwen3.8 Flash (#45836) (Jack, 2026-08-28)
- 19db518e0 - sync release versions for v1.18.24 (opencode, 2026-08-28)
- 15537a41d - fix(opencode): compare config snapshots as JSON (#45784) (opencode-agent[bot], 2026-08-27)
- 790fb5b86 - feat(opencode): support Azure CLI authentication (#45079) (opencode-agent[bot], 2026-08-28)
- 517ee736b - fix(provider): filter unreplayable Bedrock reasoning before caching (#45769) (opencode-agent[bot], 2026-08-28)
- c77100a40 - chore: generate (opencode-agent[bot], 2026-08-27)
- 03afae5b9 - feat(opencode): load supported v2 config in v1 (#45421) (James Long, 2026-08-27)
- 05ea5073b - fix(console): improve Go comparison chart on mobile (#45044) (opencode-agent[bot], 2026-08-27)
- 5f5ea53af - chore: generate (opencode-agent[bot], 2026-08-27)
- 1120d0704 - fix(stats): map ox alpha to glm 5.3 flash (#45542) (Adam, 2026-08-27)
- 6568a8245 - fix(console): merge duplicate Go usage rows (#45503) (opencode-agent[bot], 2026-08-27)
- c2eacd72a - fix(console): secure server action redirects (#45374) (Adam, 2026-08-26)
- c5ef753d2 - fix(stats): align retention columns (Adam, 2026-08-26)
- 530535c6e - fix(stats): reduce retention query scan (Adam, 2026-08-26)
- 023620b57 - chore: add sst unlock workflow (Adam, 2026-08-26)
- 902e67eba - feat(stats): add weekly retention (Adam, 2026-08-26)
- 830aaf205 - docs(go): add GLM-5.3-Flash (#45269) (Jack, 2026-08-26)
- a0f36c9df - feat(stats): add retention metrics (Adam, 2026-08-26)
- 1216c5509 - chore: generate (opencode-agent[bot], 2026-08-26)
- ec2538893 - docs: remove Ox Alpha Free (#45221) (Jack, 2026-08-26)
- c7134cbb0 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-08-26)
- ba4d0ea8b - fix(console): validate auth redirects (#45027) (Adam, 2026-08-26)
- 1cc53890d - chore: update nix node_modules hashes (opencode-agent[bot], 2026-08-26)
- ae2ea3c72 - fix map inaccuracy (Frank, 2026-08-26)
- 3f31551fa - fix map inaccuracy (Frank, 2026-08-26)
- 13c27598d - Merge branch 'dev' of github.com:anomalyco/opencode into dev (Frank, 2026-08-26)
- 2564a4f17 - remove map (Frank, 2026-08-26)
- fd9bd448a - docs: mention Exa and Parallel as web search backends (#38395) (Ravitez Dondeti, 2026-08-25)
- b72b50006 - fix(core): recover legacy database migration history (#45061) (opencode-agent[bot], 2026-08-25)
- ac1c048e6 - docs(go): add Grok 4.6 (#45042) (Jack, 2026-08-26)
- 8615731d4 - fix(console): rate limit checkout session creation (#45007) (Dax, 2026-08-25)
- a7444bf94 - fix(ui): restore focus in stacked dialogs (#44928) (OpeOginni, 2026-08-25)
- d0ceaef6a - docs(console): prohibit abusive multi-account use (Dax Raad, 2026-08-24)
- 3ef72fe8f - fix(provider): route non-native Cloudflare AI Gateway providers via the REST API (#44828) (Charlie Gleason, 2026-08-24)
- 51070b6f5 - docs: clarify prompt data handling (#44854) (opencode-agent[bot], 2026-08-24)
- 18b4cb681 - docs(github): correct action token configuration (#44793) (Filip, 2026-08-25)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ReadToolView.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/TaskToolView.kt` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolApprovalFooter.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt` (+36, -51)
- `packages/opencode/src/kilocode/tool/browser-open.ts` (+22, -17)
- `packages/opencode/src/kilocode/tool/browser-open.txt` (+13, -9)
- `packages/opencode/src/tool/apply_patch.ts` (+1, -1)
- `packages/opencode/test/tool/apply_patch.test.ts` (+21, -1)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+2, -2)
- `packages/core/src/database/migration.ts` (+33, -6)
- `packages/core/src/database/migration/20260410174513_workspace-name.ts` (+4, -1)
- `packages/core/test/database-migration.test.ts` (+63, -0)

#### Other Changes
- `.changeset/agent-manager-browser-preserve.md` (+0, -5)
- `.changeset/agent-manager-recovery-reconnect.md` (+0, -5)
- `.changeset/fix-local-project-switch.md` (+0, -5)
- `.changeset/mcp-client-metadata.md` (+0, -5)
- `.changeset/mcp-companion-skills.md` (+0, -7)
- `.changeset/route-plan-followup-questions.md` (+0, -5)
- `.changeset/session-tab-title-rename.md` (+0, -5)
- `.changeset/smooth-tool-motion.md` (+0, -5)
- `.changeset/task-model-selection-default.md` (+0, -6)
- `.changeset/transcript-virtual-clip.md` (+0, -5)
- `.changeset/worktree-pool-no-dir-when-disabled.md` (+0, -5)
- `.github/dependabot.yml` (+68, -0)
- `.github/workflows/README.md` (+22, -0)
- `.github/workflows/dependabot-auto-merge.yml` (+58, -0)
- `.github/workflows/publish.yml` (+3, -1)
- `.github/workflows/security-findings-notify.yml` (+134, -0)
- `.github/workflows/stale-bot-pr-notify.yml` (+73, -0)
- `.opencode-version` (+1, -1)
- `artifacts/glm52-rise-video/package.json` (+1, -1)
- `bun.lock` (+45, -53)
- `nix/hashes.json` (+4, -4)
- `package.json` (+6, -2)
- `packages/client/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/httpapi-codegen/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/features/checkpoints.md` (+3, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli-reference.md` (+0, -4)
- `packages/kilo-docs/pages/collaborate/enterprise/sso.md` (+7, -0)
- `packages/kilo-docs/source-links.md` (+2, -0)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/AGENTS.md` (+3, -0)
- `packages/kilo-jetbrains/CHANGELOG.md` (+21, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendSessionManagerBackgroundJobsTest.kt` (+29, -13)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/FileLinkText.kt` (+0, -14)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/attachment/AttachmentCard.kt` (+4, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/TextView.kt` (+6, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/base/AbstractSessionPartView.kt` (+11, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/todo/TodoListPanel.kt` (+15, -19)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/PlainLabel.kt` (+95, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/layout/Align.kt` (+8, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/layout/LayoutPass.kt` (+68, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/layout/Stack.kt` (+4, -8)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListModel.kt` (+29, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListRenderer.kt` (+9, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListView.kt` (+37, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/vfs/KiloVirtualFile.kt` (+5, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/AgentManagerPanelTest.kt` (+12, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/ModifiedFilesViewTest.kt` (+6, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionUiUpdateTest.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/EditToolViewTest.kt` (+6, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/PromptAttachmentViewTest.kt` (+4, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ReadToolViewTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ShellToolViewTest.kt` (+3, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/TextViewTest.kt` (+14, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ToolViewTest.kt` (+23, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/base/AbstractSessionPartViewTest.kt` (+31, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/todo/TodoWriteViewTest.kt` (+26, -4)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/PlainLabelTest.kt` (+158, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/layout/LayoutPassTest.kt` (+85, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/list/ActiveListPaintCostTest.kt` (+152, -0)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-memory/package.json` (+1, -1)
- `packages/kilo-sandbox/package.json` (+3, -2)
- `packages/kilo-sandbox/src/destination.ts` (+4, -0)
- `packages/kilo-sandbox/test/destination.test.ts` (+7, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-vscode/CHANGELOG.md` (+57, -0)
- `packages/kilo-vscode/package.json` (+12, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+46, -1)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+2, -2)
- `packages/kilo-vscode/src/agent-manager/browser-lifecycle.ts` (+40, -17)
- `packages/kilo-vscode/src/agent-manager/browser-message.ts` (+75, -29)
- `packages/kilo-vscode/src/agent-manager/host.ts` (+4, -1)
- `packages/kilo-vscode/src/agent-manager/project/state-gate.ts` (+2, -0)
- `packages/kilo-vscode/src/agent-manager/provider-lifecycle.ts` (+7, -4)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+22, -0)
- `packages/kilo-vscode/src/agent-manager/vscode-host.ts` (+27, -3)
- `packages/kilo-vscode/src/agent-manager/worktree-create.ts` (+1, -0)
- `packages/kilo-vscode/src/agent-manager/worktree-pool.ts` (+23, -5)
- `packages/kilo-vscode/src/commands/close-task-target.ts` (+57, -0)
- `packages/kilo-vscode/src/extension.ts` (+30, -0)
- `packages/kilo-vscode/src/kilo-provider/options.ts` (+8, -0)
- `packages/kilo-vscode/src/provider-actions.ts` (+2, -1)
- `packages/kilo-vscode/src/services/browser-automation/browser-broker.ts` (+453, -155)
- `packages/kilo-vscode/src/services/browser-automation/browser-network.ts` (+437, -0)
- `packages/kilo-vscode/src/services/browser-automation/browser-policy.ts` (+33, -0)
- `packages/kilo-vscode/src/services/browser-automation/browser-proxy.ts` (+562, -0)
- `packages/kilo-vscode/src/services/browser-automation/browser-stream.ts` (+650, -0)
- `packages/kilo-vscode/src/services/browser-automation/index.ts` (+1, -1)
- `packages/kilo-vscode/src/services/task-cleanup/retention.ts` (+11, -1)
- `packages/kilo-vscode/src/shared/browser-stream.ts` (+52, -0)
- `packages/kilo-vscode/tests/diff-scroll-preservation.spec.ts` (+26, -4)
- `packages/kilo-vscode/tests/fixtures/browser-network-tls.ts` (+16, -0)
- `packages/kilo-vscode/tests/fixtures/browser-network.ts` (+1113, -0)
- `packages/kilo-vscode/tests/fixtures/browser-panel-render.tsx` (+75, -18)
- `packages/kilo-vscode/tests/fixtures/browser-proxy.ts` (+799, -0)
- `packages/kilo-vscode/tests/fixtures/node.ts` (+28, -0)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+7, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-close-session.test.ts` (+5, -2)
- `packages/kilo-vscode/tests/unit/agent-manager-tab-bar.test.ts` (+5, -4)
- `packages/kilo-vscode/tests/unit/agent-manager-task-close.test.ts` (+79, -0)
- `packages/kilo-vscode/tests/unit/browser-broker.test.ts` (+830, -121)
- `packages/kilo-vscode/tests/unit/browser-controller.test.ts` (+48, -0)
- `packages/kilo-vscode/tests/unit/browser-message.test.ts` (+295, -15)
- `packages/kilo-vscode/tests/unit/browser-network.test.ts` (+29, -0)
- `packages/kilo-vscode/tests/unit/browser-policy.test.ts` (+63, -0)
- `packages/kilo-vscode/tests/unit/browser-proxy.test.ts` (+11, -0)
- `packages/kilo-vscode/tests/unit/browser-stream-input.test.ts` (+237, -0)
- `packages/kilo-vscode/tests/unit/browser-stream.test.ts` (+993, -0)
- `packages/kilo-vscode/tests/unit/chat-input-route.test.ts` (+67, -0)
- `packages/kilo-vscode/tests/unit/cleanup-poll.test.ts` (+41, -0)
- `packages/kilo-vscode/tests/unit/cleanup-stop.test.ts` (+44, -0)
- `packages/kilo-vscode/tests/unit/close-task-target.test.ts` (+69, -0)
- `packages/kilo-vscode/tests/unit/extension-arch.test.ts` (+35, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-provider-refresh.test.ts` (+74, -3)
- `packages/kilo-vscode/tests/unit/local-tabs.test.ts` (+31, -0)
- `packages/kilo-vscode/tests/unit/provider-action.test.ts` (+20, -0)
- `packages/kilo-vscode/tests/unit/provider-actions-oauth.test.ts` (+57, -0)
- `packages/kilo-vscode/tests/unit/session-paging.test.ts` (+54, -1)
- `packages/kilo-vscode/tests/unit/worktree-create.test.ts` (+3, -1)
- `packages/kilo-vscode/tests/unit/worktree-pool.test.ts` (+79, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+7, -8)
- `packages/kilo-vscode/webview-ui/agent-manager/BrowserPanel.tsx` (+39, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+14, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+14, -4)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+14, -4)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+15, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+15, -4)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+14, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+14, -4)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fa.ts` (+14, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fr.ts` (+15, -4)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/it.ts` (+15, -4)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ja.ts` (+14, -4)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ko.ts` (+14, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/nl.ts` (+14, -4)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/no.ts` (+14, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/pl.ts` (+15, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ru.ts` (+15, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/th.ts` (+14, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/tr.ts` (+14, -4)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/uk.ts` (+15, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zh.ts` (+12, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zht.ts` (+12, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/task-close.ts` (+45, -0)
- `packages/kilo-vscode/webview-ui/browser/BrowserPanel.tsx` (+87, -21)
- `packages/kilo-vscode/webview-ui/browser/StreamViewport.tsx` (+556, -0)
- `packages/kilo-vscode/webview-ui/browser/browser.css` (+6, -10)
- `packages/kilo-vscode/webview-ui/browser/controller.ts` (+16, -3)
- `packages/kilo-vscode/webview-ui/browser/stream-input.ts` (+200, -0)
- `packages/kilo-vscode/webview-ui/browser/stream.css` (+42, -0)
- `packages/kilo-vscode/webview-ui/browser/types.ts` (+25, -0)
- `packages/kilo-vscode/webview-ui/src/App.tsx` (+29, -6)
- `packages/kilo-vscode/webview-ui/src/components/settings/CheckpointsTab.tsx` (+32, -17)
- `packages/kilo-vscode/webview-ui/src/components/settings/ProviderConnectDialog.tsx` (+169, -65)
- `packages/kilo-vscode/webview-ui/src/components/settings/cleanup.ts` (+11, -1)
- `packages/kilo-vscode/webview-ui/src/context/local-tabs.tsx` (+20, -6)
- `packages/kilo-vscode/webview-ui/src/context/session-paging.ts` (+30, -5)
- `packages/kilo-vscode/webview-ui/src/context/session-types.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+4, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+4, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+14, -1)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+19, -0)
- `packages/kilo-vscode/webview-ui/src/utils/chat-input-route.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/utils/local-tabs.ts` (+21, -0)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+49, -0)
- `packages/opencode/package.json` (+4, -4)
- `packages/opencode/src/account/account.ts` (+9, -1)
- `packages/opencode/src/auth/index.ts` (+1, -0)
- `packages/opencode/src/cli/cmd/github.handler.ts` (+12, -5)
- `packages/opencode/src/config/config.ts` (+37, -19)
- `packages/opencode/src/config/v2-compat.ts` (+449, -0)
- `packages/opencode/src/kilocode/config/mcp-headers.ts` (+29, -8)
- `packages/opencode/src/kilocode/config/overlay.ts` (+2, -1)
- `packages/opencode/src/kilocode/config/writer.ts` (+12, -7)
- `packages/opencode/src/kilocode/project/sandbox.ts` (+13, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/kilocode.ts` (+20, -2)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilocode.ts` (+5, -0)
- `packages/opencode/src/kilocode/session/processor.ts` (+115, -1)
- `packages/opencode/src/kilocode/session/retention.ts` (+125, -14)
- `packages/opencode/src/kilocode/session/transcript.ts` (+24, -6)
- `packages/opencode/src/plugin/azure.ts` (+107, -4)
- `packages/opencode/src/project/project.ts` (+4, -1)
- `packages/opencode/src/provider/provider.ts` (+32, -6)
- `packages/opencode/src/provider/transform.ts` (+41, -7)
- `packages/opencode/src/server/routes/instance/httpapi/groups/global.ts` (+11, -2)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/global.ts` (+19, -44)
- `packages/opencode/src/session/llm/request.ts` (+1, -1)
- `packages/opencode/src/session/network.ts` (+39, -1)
- `packages/opencode/src/session/processor.ts` (+35, -4)
- `packages/opencode/test/account/service.test.ts` (+28, -7)
- `packages/opencode/test/config/config.test.ts` (+191, -1)
- `packages/opencode/test/config/fixtures/v2-compat/README.md` (+55, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/agents-commands-precedence-input.jsonc` (+17, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/agents-commands-precedence-output.json` (+29, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/agents-input.jsonc` (+15, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/agents-output.json` (+24, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/commands-input.jsonc` (+12, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/commands-output.json` (+17, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/ignored-fields-input.jsonc` (+8, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/ignored-fields-output.json` (+5, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/lsp-input.jsonc` (+8, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/lsp-output.json` (+14, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/mcp-enablement-input.jsonc` (+15, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/mcp-enablement-output.json` (+45, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/mcp-merge-input.jsonc` (+11, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/mcp-merge-output.json` (+18, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/mcp-oauth-input.jsonc` (+19, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/mcp-oauth-output.json` (+25, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/mcp-partial-timeout-input.jsonc` (+3, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/mcp-partial-timeout-output.json` (+3, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/mcp-reserved-enabled-input.jsonc` (+7, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/mcp-reserved-enabled-output.json` (+10, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/mcp-reserved-input.jsonc` (+6, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/mcp-reserved-output.json` (+12, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/mcp-timeouts-input.jsonc` (+15, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/mcp-timeouts-output.json` (+29, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/model-object-input.jsonc` (+4, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/model-object-output.json` (+4, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/model-string-input.jsonc` (+4, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/model-string-output.json` (+6, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/model-variant-input.jsonc` (+3, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/model-variant-output.json` (+3, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/settings-input.jsonc` (+12, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/settings-output.json` (+28, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/settings-precedence-input.jsonc` (+15, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/settings-precedence-output.json` (+18, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/skills-input.jsonc` (+3, -0)
- `packages/opencode/test/config/fixtures/v2-compat/read/skills-output.json` (+6, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-global/clear-shell-input.jsonc` (+7, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-global/clear-shell-normalized.json` (+5, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-global/clear-shell-output.jsonc` (+5, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-global/clear-shell-patch.json` (+3, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-global/preserve-v2-json-input.json` (+18, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-global/preserve-v2-json-normalized.json` (+11, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-global/preserve-v2-json-output.json` (+20, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-global/preserve-v2-json-patch.json` (+3, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-global/preserve-v2-jsonc-input.jsonc` (+19, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-global/preserve-v2-jsonc-normalized.json` (+11, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-global/preserve-v2-jsonc-output.jsonc` (+19, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-global/preserve-v2-jsonc-patch.json` (+3, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-global/v1-overrides-input.json` (+16, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-global/v1-overrides-normalized.json` (+19, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-global/v1-overrides-output.json` (+30, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-global/v1-overrides-patch.json` (+6, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-project/preserve-v2-input.json` (+18, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-project/preserve-v2-normalized.json` (+11, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-project/preserve-v2-output.json` (+20, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-project/preserve-v2-patch.json` (+3, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-project/v1-overrides-input.json` (+16, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-project/v1-overrides-normalized.json` (+17, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-project/v1-overrides-output.json` (+28, -0)
- `packages/opencode/test/config/fixtures/v2-compat/update-project/v1-overrides-patch.json` (+6, -0)
- `packages/opencode/test/config/snapshot.ts` (+8, -0)
- `packages/opencode/test/config/v2-compat.test.ts` (+403, -0)
- `packages/opencode/test/kilocode/background-process.test.ts` (+7, -2)
- `packages/opencode/test/kilocode/config/config.test.ts` (+89, -0)
- `packages/opencode/test/kilocode/config/mcp-headers.test.ts` (+54, -0)
- `packages/opencode/test/kilocode/plugin/azure-endpoint.test.ts` (+98, -0)
- `packages/opencode/test/kilocode/project-sandbox.test.ts` (+66, -0)
- `packages/opencode/test/kilocode/provider/text-verbosity.test.ts` (+52, -0)
- `packages/opencode/test/kilocode/sandbox/http-tools.test.ts` (+108, -2)
- `packages/opencode/test/kilocode/server/config-overlay.test.ts` (+51, -0)
- `packages/opencode/test/kilocode/server/httpapi-exercise-scenarios.ts` (+11, -0)
- `packages/opencode/test/kilocode/session/offline-guard.test.ts` (+203, -0)
- `packages/opencode/test/kilocode/session/retention-reclaim.test.ts` (+57, -0)
- `packages/opencode/test/kilocode/session/retention.test.ts` (+257, -5)
- `packages/opencode/test/kilocode/wakeup/wakeup-cron.test.ts` (+6, -1)
- `packages/opencode/test/patched-dependencies.test.ts` (+35, -0)
- `packages/opencode/test/plugin/azure.test.ts` (+308, -0)
- `packages/opencode/test/provider/cf-ai-gateway-e2e.test.ts` (+13, -1)
- `packages/opencode/test/provider/provider.test.ts` (+26, -0)
- `packages/opencode/test/provider/transform.test.ts` (+370, -1)
- `packages/opencode/test/server/httpapi-global.test.ts` (+40, -5)
- `packages/opencode/test/session/llm.test.ts` (+69, -0)
- `packages/opencode/test/session/prompt.test.ts` (+37, -0)
- `packages/opencode/test/session/tools.test.ts` (+219, -0)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/plugin/src/index.ts` (+2, -0)
- `packages/protocol/package.json` (+1, -1)
- `packages/schema/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk-next/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+36, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+37, -2)
- `packages/sdk/openapi.json` (+119, -2)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/storybook/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/tui/src/component/prompt/index.tsx` (+10, -2)
- `packages/tui/src/parsers-config.ts` (+1, -1)
- `packages/tui/src/routes/session/index.tsx` (+1, -2)
- `packages/tui/test/cli/tui/diff-viewer-file-tree.test.tsx` (+4, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/context/dialog.tsx` (+2, -2)
- `packages/ui/src/i18n/am.ts` (+1, -1)
- `packages/ui/src/i18n/ar.ts` (+1, -1)
- `packages/ui/src/i18n/az.ts` (+1, -1)
- `packages/ui/src/i18n/bg.ts` (+1, -1)
- `packages/ui/src/i18n/bn.ts` (+1, -1)
- `packages/ui/src/i18n/br.ts` (+1, -1)
- `packages/ui/src/i18n/bs.ts` (+1, -1)
- `packages/ui/src/i18n/ca.ts` (+1, -1)
- `packages/ui/src/i18n/cs.ts` (+1, -1)
- `packages/ui/src/i18n/da.ts` (+1, -1)
- `packages/ui/src/i18n/de.ts` (+1, -1)
- `packages/ui/src/i18n/dv.ts` (+1, -1)
- `packages/ui/src/i18n/dz.ts` (+1, -1)
- `packages/ui/src/i18n/el.ts` (+1, -1)
- `packages/ui/src/i18n/en.ts` (+1, -1)
- `packages/ui/src/i18n/es.ts` (+1, -1)
- `packages/ui/src/i18n/et.ts` (+1, -1)
- `packages/ui/src/i18n/fa.ts` (+1, -1)
- `packages/ui/src/i18n/fi.ts` (+1, -1)
- `packages/ui/src/i18n/fo.ts` (+1, -1)
- `packages/ui/src/i18n/fr.ts` (+1, -1)
- `packages/ui/src/i18n/hi.ts` (+1, -1)
- `packages/ui/src/i18n/hr.ts` (+1, -1)
- `packages/ui/src/i18n/hu.ts` (+1, -1)
- `packages/ui/src/i18n/hy.ts` (+1, -1)
- `packages/ui/src/i18n/id.ts` (+1, -1)
- `packages/ui/src/i18n/is.ts` (+1, -1)
- `packages/ui/src/i18n/it.ts` (+1, -1)
- `packages/ui/src/i18n/ja.ts` (+1, -1)
- `packages/ui/src/i18n/ka.ts` (+1, -1)
- `packages/ui/src/i18n/km.ts` (+1, -1)
- `packages/ui/src/i18n/ko.ts` (+1, -1)
- `packages/ui/src/i18n/lo.ts` (+1, -1)
- `packages/ui/src/i18n/lt.ts` (+1, -1)
- `packages/ui/src/i18n/lv.ts` (+1, -1)
- `packages/ui/src/i18n/mk.ts` (+1, -1)
- `packages/ui/src/i18n/mn.ts` (+1, -1)
- `packages/ui/src/i18n/ms.ts` (+1, -1)
- `packages/ui/src/i18n/my.ts` (+1, -1)
- `packages/ui/src/i18n/ne.ts` (+1, -1)
- `packages/ui/src/i18n/nl.ts` (+1, -1)
- `packages/ui/src/i18n/no.ts` (+1, -1)
- `packages/ui/src/i18n/pa.ts` (+1, -1)
- `packages/ui/src/i18n/pl.ts` (+1, -1)
- `packages/ui/src/i18n/ro.ts` (+1, -1)
- `packages/ui/src/i18n/ru.ts` (+1, -1)
- `packages/ui/src/i18n/si.ts` (+1, -1)
- `packages/ui/src/i18n/sk.ts` (+1, -1)
- `packages/ui/src/i18n/sl.ts` (+1, -1)
- `packages/ui/src/i18n/sq.ts` (+1, -1)
- `packages/ui/src/i18n/sr.ts` (+1, -1)
- `packages/ui/src/i18n/sv.ts` (+1, -1)
- `packages/ui/src/i18n/tg.ts` (+1, -1)
- `packages/ui/src/i18n/th.ts` (+1, -1)
- `packages/ui/src/i18n/tk.ts` (+1, -1)
- `packages/ui/src/i18n/tr.ts` (+1, -1)
- `packages/ui/src/i18n/uk.ts` (+1, -1)
- `packages/ui/src/i18n/ur.ts` (+1, -1)
- `packages/ui/src/i18n/uz.ts` (+1, -1)
- `packages/ui/src/i18n/vi.ts` (+1, -1)
- `packages/ui/src/i18n/zh.ts` (+1, -1)
- `packages/ui/src/i18n/zht.ts` (+1, -1)
- `patches/@ai-sdk%2Famazon-bedrock@4.0.166.patch` (+164, -0)
- `patches/@ai-sdk%2Fanthropic@3.0.111.patch` (+528, -0)
- `script/check-workflows.ts` (+3, -0)
- `script/extract-source-links.ts` (+2, -0)
- `script/upstream/package.json` (+1, -1)
- `turbo.json` (+3, -0)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index e57911d34..eeebe74d0 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.7.9",
+  "version": "7.8.0",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
@@ -85,7 +85,7 @@
     "zod": "catalog:",
     "@ai-sdk/alibaba": "1.0.17",
     "@ai-sdk/amazon-bedrock": "4.0.166",
-    "@ai-sdk/anthropic": "3.0.82",
+    "@ai-sdk/anthropic": "3.0.111",
     "@ai-sdk/azure": "3.0.93",
     "@ai-sdk/cerebras": "2.0.54",
     "@ai-sdk/cohere": "3.0.27",
```

#### packages/core/src/database/migration.ts
```diff
diff --git a/packages/core/src/database/migration.ts b/packages/core/src/database/migration.ts
index 388a37e7a..5b6705747 100644
--- a/packages/core/src/database/migration.ts
+++ b/packages/core/src/database/migration.ts
@@ -54,12 +54,39 @@ export function applyOnly(db: Database, input: Migration[]) {
       if (
         yield* db.get(sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = ${"__drizzle_migrations"}`)
       ) {
-        yield* db.run(sql`
-          INSERT OR IGNORE INTO ${sql.identifier("migration")} (id, time_completed)
-          SELECT name, ${Date.now()}
-          FROM ${sql.identifier("__drizzle_migrations")}
-          WHERE name IS NOT NULL
-        `)
+        const named = (yield* db.all<{ name: string }>(
+          sql`SELECT name FROM pragma_table_info('__drizzle_migrations')`,
+        )).some((column) => column.name === "name")
+
+        if (named) {
+          yield* db.run(sql`
+            INSERT OR IGNORE INTO ${sql.identifier("migration")} (id, time_completed)
+            SELECT name, ${Date.now()}
+            FROM ${sql.identifier("__drizzle_migrations")}
+            WHERE name IS NOT NULL
+          `)
+        }
+
+        if (!named) {
+          const entries = yield* db.all<{ created_at: number; prefix: string | null }>(sql`
+            SELECT created_at, strftime('%Y%m%d%H%M%S', created_at / 1000, 'unixepoch') AS prefix
+            FROM ${sql.identifier("__drizzle_migrations")}
+            WHERE created_at IS NOT NULL
+          `)
+
+          for (const entry of entries) {
+            const migration = input.find((item) => item.id.startsWith(`${entry.prefix}_`))
+            if (!migration) {
+              return yield* Effect.die(
+                new Error(`Legacy migration timestamp ${entry.created_at} does not match any known migration`),
+              )
+            }
+            yield* db.run(sql`
+              INSERT OR IGNORE INTO ${sql.identifier("migration")} (id, time_completed)
+              VALUES (${migration.id}, ${Date.now()})
+            `)
+          }
+        }
         completed = new Set(
           (yield* db.all<{ id: string }>(sql`SELECT id FROM ${sql.identifier("migration")}`)).map((row) => row.id),
         )
```

#### packages/core/src/database/migration/20260410174513_workspace-name.ts
```diff
diff --git a/packages/core/src/database/migration/20260410174513_workspace-name.ts b/packages/core/src/database/migration/20260410174513_workspace-name.ts
index 18483e1cf..8a8557ec7 100644
--- a/packages/core/src/database/migration/20260410174513_workspace-name.ts
+++ b/packages/core/src/database/migration/20260410174513_workspace-name.ts
@@ -5,6 +5,9 @@ export default {
   id: "20260410174513_workspace-name",
   up(tx) {
     return Effect.gen(function* () {
+      const columns = yield* tx.all<{ name: string }>(`PRAGMA table_info(\`workspace\`)`)
+      const name = columns.some((column) => column.name === "name") ? "`name`" : "''"
+
       yield* tx.run(`PRAGMA foreign_keys=OFF;`)
       yield* tx.run(`
         CREATE TABLE \`__new_workspace\` (
@@ -19,7 +22,7 @@ export default {
         );
       `)
       yield* tx.run(
-        `INSERT INTO \`__new_workspace\`(\`id\`, \`type\`, \`branch\`, \`name\`, \`directory\`, \`extra\`, \`project_id\`) SELECT \`id\`, \`type\`, \`branch\`, \`name\`, \`directory\`, \`extra\`, \`project_id\` FROM \`workspace\`;`,
+        `INSERT INTO \`__new_workspace\`(\`id\`, \`type\`, \`branch\`, \`name\`, \`directory\`, \`extra\`, \`project_id\`) SELECT \`id\`, \`type\`, \`branch\`, ${name}, \`directory\`, \`extra\`, \`project_id\` FROM \`workspace\`;`,
       )
       yield* tx.run(`DROP TABLE \`workspace\`;`)
       yield* tx.run(`ALTER TABLE \`__new_workspace\` RENAME TO \`workspace\`;`)
```

#### packages/core/test/database-migration.test.ts
```diff
diff --git a/packages/core/test/database-migration.test.ts b/packages/core/test/database-migration.test.ts
index b381cc741..464ce2695 100644
--- a/packages/core/test/database-migration.test.ts
+++ b/packages/core/test/database-migration.test.ts
@@ -8,6 +8,7 @@ import { Effect, Layer } from "effect"
 import { eq, inArray, sql } from "drizzle-orm"
 import { DatabaseMigration } from "@opencode-ai/core/database/migration"
 import { migrations } from "@opencode-ai/core/database/migration.gen"
+import workspaceNameMigration from "@opencode-ai/core/database/migration/20260410174513_workspace-name"
 import sessionUsageMigration from "@opencode-ai/core/database/migration/20260510033149_session_usage"
 import normalizeStoragePathsMigration from "@opencode-ai/core/database/migration/20260601010001_normalize_storage_paths"
 import sessionMessageProjectionOrderMigration from "@opencode-ai/core/database/migration/20260603040000_session_message_projection_order"
@@ -38,6 +39,68 @@ const run = <A, E>(effect: Effect.Effect<A, E, SqlClientService>) =>
 const makeDb = EffectDrizzleSqlite.makeWithDefaults()
 
 describe("DatabaseMigration", () => {
+  test("defaults missing workspace names while preserving legacy workspace data", async () => {
+    await run(
+      Effect.gen(function* () {
+        const db = yield* makeDb
+        yield* db.run(sql`
+          CREATE TABLE workspace (
+            id text PRIMARY KEY,
+            type text NOT NULL,
+            branch text,
+            directory text,
+            extra text,
+            project_id text NOT NULL
+          )
+        `)
+        yield* db.run(sql`
+          INSERT INTO workspace (id, type, branch, directory, extra, project_id)
+          VALUES ('wrk_legacy', 'remote', 'main', '/repo', '{}', 'proj_legacy')
+        `)
+
+        yield* DatabaseMigration.applyOnly(db, [workspaceNameMigration])
+
+        expect(yield* db.get(sql`SELECT id, name, branch, directory, extra FROM workspace`)).toEqual({
+          id: "wrk_legacy",
+          name: "",
+          branch: "main",
+          directory: "/repo",
+          extra: "{}",
+        })
+      }),
+    )
+  })
+
+  test("imports unnamed legacy Drizzle journal entries by their actual migration timestamps", async () => {
+    await run(
```

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt
index aefe07658..2a8f94772 100644
--- a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt
@@ -165,7 +165,7 @@ abstract class BaseSearchToolView(
         parts.targets.forEachIndexed { index, label ->
             val text = values.getOrNull(index) ?: ""
             changed = setVisible(label, text.isNotBlank()) || changed
-            changed = setTargetText(label, text) || changed
+            changed = setText(label, text) || changed
             changed = setForeground(label, SessionUiStyle.Colors.foreground()) || changed
         }
         return changed
```


*... and more files (showing first 5)*

## opencode Changes (0f54984..34aa427)

### Commits

- 34aa427 - docs(zen): document Qwen3.8 Max (#51321) (Jack, 2026-09-25)
- 16c56fe - fix(ci): use GPT-6 Luna for issue automation (#51261) (opencode-agent[bot], 2026-09-24)
- 6df0d5d - fix(stats): use capability fallbacks in comparison radar (#51161) (Adam, 2026-09-24)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
(no changes)

#### Agent System (packages/*/src/agent/)
- `.opencode/agent/triage.md` (+1, -1)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
(no changes)

#### Other Changes
- `.github/actions/setup-bun/action.yml` (+11, -15)
- `.github/workflows/duplicate-issues.yml` (+2, -2)
- `.github/workflows/triage.yml` (+1, -1)
- `packages/stats/app/src/routes/compare-radar.tsx` (+47, -12)
- `packages/stats/app/src/routes/index.css` (+5, -6)
- `packages/stats/app/src/routes/model-catalog.ts` (+27, -6)
- `packages/stats/app/test/compare-radar.test.ts` (+74, -0)
- `packages/web/src/content/docs/ar/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/bs/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/da/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/de/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/es/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/fr/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/it/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/ja/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/ko/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/nb/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/pl/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/ru/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/th/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/tr/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+2, -0)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+2, -0)

### Key Diffs

#### .opencode/agent/triage.md
```diff
diff --git a/.opencode/agent/triage.md b/.opencode/agent/triage.md
index 11c4c81..638f4d5 100644
--- a/.opencode/agent/triage.md
+++ b/.opencode/agent/triage.md
@@ -1,7 +1,7 @@
 ---
 mode: primary
 hidden: true
-model: opencode/gpt-5.4-mini
+model: opencode/gpt-6-luna
 color: "#44BA81"
 tools:
   "*": false
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate patterns from opencode .opencode/agent/triage.md
- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/src/database/migration.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260410174513_workspace-name.ts
- `src/core/` - review core changes from packages/core/test/database-migration.test.ts
- `src/tool/BaseSearchToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BaseSearchToolView.kt changes
- `src/tool/EditToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/EditToolView.kt changes
- `src/tool/ReadToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ReadToolView.kt changes
- `src/tool/ShellToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt changes
- `src/tool/TaskToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/TaskToolView.kt changes
- `src/tool/ToolApprovalFooter.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolApprovalFooter.kt changes
- `src/tool/ToolSupport.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt changes
- `src/tool/apply_patch.test.ts` - update based on kilocode packages/opencode/test/tool/apply_patch.test.ts changes
- `src/tool/apply_patch.ts` - update based on kilocode packages/opencode/src/tool/apply_patch.ts changes
- `src/tool/browser-open.ts` - update based on kilocode packages/opencode/src/kilocode/tool/browser-open.ts changes
- `src/tool/browser-open.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/browser-open.txt changes
