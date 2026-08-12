# Upstream Changes Report
Generated: 2026-08-12 07:25:02

## Summary
- kilocode: 218 commits, 450 files changed
- opencode: 9 commits, 24 files changed

## kilocode Changes (a5aaef74a..64e5dd036)

### Commits

- 64e5dd036 - Merge pull request #12930 from Kilo-Org/docs/auto-sync-2026-08-06 (Emilie Lima Schario, 2026-08-11)
- 7ff50c69a - Apply suggestions from code review (Emilie Lima Schario, 2026-08-11)
- 81f52496b - Merge pull request #12835 from Kilo-Org/docs/auto-sync (Emilie Lima Schario, 2026-08-11)
- 3bccda532 - Apply suggestion from @emilieschario (Emilie Lima Schario, 2026-08-11)
- 7f0ce6a8c - Merge branch 'main' into docs/auto-sync (Emilie Lima Schario, 2026-08-11)
- 236e74446 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-08-11)
- 5f9666e51 - Merge pull request #13059 from Kilo-Org/chore/jetbrains-cli-pin-v7.4.21 (Kirill Kalishev, 2026-08-11)
- 2c2b0a2ff - fix(core): serialize concurrent database migrations (#13067) (Johnny Eric Amancio, 2026-08-11)
- e222ba903 - Merge pull request #12917 from Kilo-Org/johnnyeric/kilo-opencode-v1.18.13 (Johnny Eric Amancio, 2026-08-11)
- 47d0d6d7e - Merge remote-tracking branch 'origin/johnnyeric/kilo-opencode-v1.18.0' into johnnyeric/kilo-opencode-v1.18.13 (Johnny Eric Amancio, 2026-08-11)
- 19a2a3c4d - fix(config): invalidate active instance config cache on global config invalidation (Johnny Eric Amancio, 2026-08-11)
- 249d20647 - test(tui): fix diff-viewer-file-tree test regex for Windows cross-platform compatibility (Johnny Eric Amancio, 2026-08-11)
- 5119e565e - Merge remote-tracking branch 'origin/johnnyeric/kilo-opencode-v1.18.0' into johnnyeric/kilo-opencode-v1.18.13 (Johnny Eric Amancio, 2026-08-11)
- fbb52c89d - Merge remote-tracking branch 'origin/main' into johnnyeric/kilo-opencode-v1.18.0 (Johnny Eric Amancio, 2026-08-11)
- 7457c1ce1 - chore(jetbrains): bump CLI pin to v7.4.21 (kilo-maintainer[bot], 2026-08-11)
- 82d1552a4 - Merge remote-tracking branch 'origin/johnnyeric/kilo-opencode-v1.18.0' into johnnyeric/kilo-opencode-v1.18.13 (Johnny Eric Amancio, 2026-08-10)
- b682dfdd1 - Merge remote-tracking branch 'origin/main' into johnnyeric/kilo-opencode-v1.18.0 (Johnny Eric Amancio, 2026-08-10)
- aca225fcf - Merge remote-tracking branch 'origin/johnnyeric/kilo-opencode-v1.18.0' into johnnyeric/kilo-opencode-v1.18.13 (Johnny Eric Amancio, 2026-08-10)
- 129759f66 - Merge remote-tracking branch 'origin/main' into johnnyeric/kilo-opencode-v1.18.0 (Johnny Eric Amancio, 2026-08-10)
- becf9372f - fix: address merge review findings and CI timeouts (Johnny Eric Amancio, 2026-08-10)
- ec71adcfb - Merge remote-tracking branch 'origin/johnnyeric/kilo-opencode-v1.18.0' into johnnyeric/kilo-opencode-v1.18.13 (Johnny Eric Amancio, 2026-08-10)
- b48465771 - fix(core): address review findings and CI stabilization for upstream merge (Johnny Eric Amancio, 2026-08-10)
- deafa7256 - test(cli): give queued-prompt stream integration test headroom for Windows CI (Johnny Eric Amancio, 2026-08-10)
- 031ea2feb - fix(provider): preserve base model variants alongside custom provider fallback (Johnny Eric Amancio, 2026-08-10)
- 548d7887d - Merge remote-tracking branch 'origin/main' into johnnyeric/kilo-opencode-v1.18.0 (Johnny Eric Amancio, 2026-08-10)
- 9bab72e5a - Merge remote-tracking branch 'origin/johnnyeric/kilo-opencode-v1.18.0' into johnnyeric/kilo-opencode-v1.18.13 (Johnny Eric Amancio, 2026-08-07)
- 6d331a726 - fix(core): address round 3 review findings for upstream merge (Johnny Eric Amancio, 2026-08-07)
- 506574389 - Merge remote-tracking branch 'origin/main' into johnnyeric/kilo-opencode-v1.18.0 (Johnny Eric Amancio, 2026-08-07)
- b6505b164 - Merge remote-tracking branch 'origin/johnnyeric/kilo-opencode-v1.18.0' into johnnyeric/kilo-opencode-v1.18.13 (Johnny Eric Amancio, 2026-08-07)
- 8d4caec30 - Merge remote-tracking branch 'origin/main' into johnnyeric/kilo-opencode-v1.18.0 (Johnny Eric Amancio, 2026-08-07)
- 7f1b40258 - chore(upstream): preserve kilo web command removal (Johnny Eric Amancio, 2026-08-07)
- 82c1da89e - fix(vscode): restore Agent Manager architecture limits (Johnny Eric Amancio, 2026-08-06)
- 7318f3761 - Merge remote-tracking branch 'origin/main' into johnnyeric/kilo-opencode-v1.18.0 (Johnny Eric Amancio, 2026-08-06)
- 0a96c10cb - Merge remote-tracking branch 'origin/johnnyeric/kilo-opencode-v1.18.0' into johnnyeric/kilo-opencode-v1.18.13 (Johnny Eric Amancio, 2026-08-06)
- e958d4486 - fix: stabilize Windows repository cache validation (Johnny Eric Amancio, 2026-08-06)
- 3a572d6c1 - fix(vscode): extract side panel resize scheduler (Johnny Eric Amancio, 2026-08-06)
- 712346975 - fix(core): canonicalize repository cache file remotes (Johnny Eric Amancio, 2026-08-06)
- 343491e35 - fix(core): canonicalize repository cache worktrees (Johnny Eric Amancio, 2026-08-06)
- 33c45bd78 - fix(core): compare repository cache paths safely on Windows (Johnny Eric Amancio, 2026-08-06)
- 80124bc48 - Merge remote-tracking branch 'origin/main' into johnnyeric/kilo-opencode-v1.18.0 (Johnny Eric Amancio, 2026-08-06)
- 6308af7cb - chore(sdk): regenerate artifacts after main sync (Johnny Eric Amancio, 2026-08-06)
- b6cfc6333 - test(core): follow branch-scoped reference cache paths (Johnny Eric Amancio, 2026-08-06)
- d99467fa0 - resolve merge conflicts (Johnny Eric Amancio, 2026-08-06)
- 4174457a0 - Merge remote-tracking branch 'origin/main' into johnnyeric/kilo-opencode-v1.18.0 (Johnny Eric Amancio, 2026-08-06)
- 3003a302b - fix: address pull request review comments (Johnny Eric Amancio, 2026-08-06)
- 0c01d6b99 - docs: sync with merged PRs (2026-08-06) (github-actions[bot], 2026-08-06)
- af6d1ded6 - fix: address second-round merge review findings (Johnny Eric Amancio, 2026-08-06)
- cce22e608 - merge: upstream v1.18.13 (Johnny Eric Amancio, 2026-08-06)
- cbbbd7217 - fix: address upstream merge review findings (Johnny Eric Amancio, 2026-08-06)
- b160f9051 - merge: record upstream v1.18.13 (Johnny Eric Amancio, 2026-08-06)
- 0fff61fa6 - refactor: kilo compat for v1.18.13 (Johnny Eric Amancio, 2026-08-06)
- a19cec67f - fix(upstream): support in-place worktree merges (Johnny Eric Amancio, 2026-08-05)
- 25f4b58d9 - fix: address post-merge validation findings (Johnny Eric Amancio, 2026-08-05)
- 88083fb5c - resolve merge conflicts (Johnny Eric Amancio, 2026-08-05)
- 284747527 - merge: record upstream v1.18.0 (Johnny Eric Amancio, 2026-08-05)
- 76783409b - refactor: kilo compat for v1.18.0 (Johnny Eric Amancio, 2026-08-05)
- 6e25130cd - docs: sync with merged PRs (2026-08-05) (github-actions[bot], 2026-08-05)
- 42307055b - Merge remote-tracking branch 'origin/main' into docs/auto-sync (github-actions[bot], 2026-08-05)
- a10535081 - release: v1.18.13 (opencode, 2026-08-04)
- dc67b7a3b - docs: add Poolside provider setup (#39187) (Amy Duquette, 2026-08-04)
- de1bd36a4 - fix(app): correct RTL layout interactions (#40410) (Luke Parker, 2026-08-04)
- 6c97a46da - fix(stats): hide zero-usage countries (#40400) (opencode-agent[bot], 2026-08-04)
- c387fe190 - feat(app): add debug layout direction toggle (#40393) (Luke Parker, 2026-08-04)
- 8721a2710 - fix(app): complete shared RTL primitives (#40388) (opencode-agent[bot], 2026-08-04)
- c75e3b5ba - fix(app): supply fallback session titles (#40385) (Brendan Allan, 2026-08-04)
- edc8d1d91 - chore: generate (opencode-agent[bot], 2026-08-04)
- e85735028 - feat(i18n): localize hardcoded application copy (#40377) (opencode-agent[bot], 2026-08-04)
- 6c3299103 - feat(app): add minimal RTL support (#40372) (opencode-agent[bot], 2026-08-04)
- 60e23fee1 - chore: generate (opencode-agent[bot], 2026-08-04)
- 0c380f31a - feat(app): support locale plural rules (#40370) (opencode-agent[bot], 2026-08-04)
- 26aefa68f - chore: update nix node_modules hashes (opencode-agent[bot], 2026-08-04)
- 638788f8d - fix(app): move markdown parsing to worker (#40356) (Luke Parker, 2026-08-04)
- b005a15a4 - chore: generate (opencode-agent[bot], 2026-08-04)
- 0efa33cf3 - feat(desktop): expand and audit locale translations (#40362) (opencode-agent[bot], 2026-08-04)
- 7e94ddafe - fix(github): include pull request identity in context (#40363) (opencode-agent[bot], 2026-08-03)
- 7fe993879 - sync release versions for v1.18.12 (opencode, 2026-08-04)
- def14d96e - Revert "fix slow queries" (Frank, 2026-08-03)
- b0b114923 - test(opencode): cover Azure completion reasoning (#40340) (opencode-agent[bot], 2026-08-04)
- 7becbbf71 - feat(app): refine diff viewer (#40285) (Aarav Sareen, 2026-08-03)
- 87481f2bb - fix: gpt-5.5+ in combination with azure fails with reasoningEffort (#40265) (Frederik, 2026-08-03)
- c34b12771 - docs: sync with merged PRs (2026-08-03) (github-actions[bot], 2026-08-03)
- 9535a8f92 - fix(ui): update OpenRouter logo (#40313) (opencode-agent[bot], 2026-08-04)
- e917c12c8 - docs: remove obsolete vouch system section (#40266) (YB, 2026-08-03)
- 89130db6b - chore: update nix node_modules hashes (opencode-agent[bot], 2026-08-03)
- 9465a6c97 - Merge branch 'dev' of github.com:anomalyco/opencode into dev (Frank, 2026-08-03)
- 53fd02970 - fix slow queries (Frank, 2026-08-03)
- 6ff0adef2 - perf(app): fix composer lag via buffered blob draft storage (#40207) (Luke Parker, 2026-08-03)
- 3307f99f1 - fix(ci): reuse imported macOS keychain (#40221) (opencode-agent[bot], 2026-08-03)
- 8de7a3c73 - fix slow queries (Frank, 2026-08-03)
- 28d063740 - chore: generate (opencode-agent[bot], 2026-08-03)
- ef7f71286 - fix slow queries (Frank, 2026-08-03)
- 3016830e2 - fix(app): search every known project in the open project dialog (#40202) (Joshua, 2026-08-03)
- e9e747245 - docs(go): add Qwen3.8 Max (#40228) (Jack, 2026-08-03)
- 9f9fbf815 - fix(app): clear stale timeline errors (#39465) (Brendan Allan, 2026-08-03)
- c88facb2c - chore: generate (opencode-agent[bot], 2026-08-03)
- d4b85f8d8 - fix(app): skip legacy config reads for v2 (#40211) (twinkle, 2026-08-03)
- 1882c3382 - fix gemini reasoning tokens not counted (Frank, 2026-08-02)
- 01624c8c8 - chore: generate (opencode-agent[bot], 2026-08-02)
- 0891ecd8e - docs(go): update DeepSeek privacy policy (#40120) (Jack, 2026-08-02)
- 32f278b48 - Merge branch 'dev' of github.com:anomalyco/opencode into dev (Frank, 2026-08-01)
- bb6bec907 - zen: update doc (Frank, 2026-08-01)
- 0eac0964a - sync release versions for v1.18.11 (opencode, 2026-08-01)
- f67e80c27 - fix(app): prevent stale prompt control reads (#39842) (OpeOginni, 2026-08-01)
- 19231fce4 - chore: generate (opencode-agent[bot], 2026-07-31)
- d0a7ca6d1 - go: document data policy per model (Frank, 2026-07-31)
- d80e86be9 - go: document data policy per model (Frank, 2026-07-31)
- e4bd9757a - chore: generate (opencode-agent[bot], 2026-07-31)
- 4087cf1a9 - fix(go): restore limits graph axis (#39870) (Jack, 2026-07-31)
- 14f0bf64a - chore: generate (opencode-agent[bot], 2026-07-31)
- 2df47ee39 - deepseek v4 flash (Frank, 2026-07-31)
- ad8261644 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-31)
- d4ad650f7 - chore: generate (opencode-agent[bot], 2026-07-31)
- 2039c90c0 - fix(desktop): open external links in system browser (#39820) (Luke Parker, 2026-07-31)
- da59457ca - feat(go): add GPT 5.6 Luna content (#39812) (Jack, 2026-07-31)
- db4dbaa28 - fix(app): prevent stale session tab reads (#39767) (OpeOginni, 2026-07-31)
- d3f30df18 - fix(app): open legacy picker at home (#39804) (opencode-agent[bot], 2026-07-31)
- 7ea343cab - fix(app): prevent file tree tab clipping (#39770) (OpeOginni, 2026-07-31)
- e024e2ef9 - fix(app): align debug gutter text (#39782) (Luke Parker, 2026-07-31)
- ceb4890ca - docs: add Modal provider setup (#39710) (Deven Navani, 2026-07-30)
- 3f239b383 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-30)
- c1ee3c6e3 - fix(opencode): stop MCP SSE error reconnect loops (#39697) (Aiden Cline, 2026-07-30)
- a1ab489e6 - fix(provider): widen interleaved reasoning fields (#39556) (opencode-agent[bot], 2026-07-30)
- 8c38d260e - sync release versions for v1.18.10 (opencode, 2026-07-30)
- a4f25a94b - fix: use OpenCode model catalog URL (#39672) (opencode-agent[bot], 2026-07-30)
- ff0382e97 - chore: generate (opencode-agent[bot], 2026-07-30)
- ac5380614 - fix(app): repair malformed persisted tabs (#39645) (OpeOginni, 2026-07-30)
- c08350b83 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-30)
- c5cf41663 - feat(app): fix composer attachment fades (#38547) (Aarav Sareen, 2026-07-30)
- 3dbce3dad - feat(app): adds fades to file tree (#38549) (Aarav Sareen, 2026-07-30)
- a277557a5 - chore: generate (opencode-agent[bot], 2026-07-30)
- 005bf088c - feat(app): fix file tree button bg (#38629) (Aarav Sareen, 2026-07-30)
- eca5e68a5 - feat(app): disallow duplicate attachments (#39464) (Aarav Sareen, 2026-07-30)
- 5b11635d9 - feat(app): always show new session button (#39520) (Aarav Sareen, 2026-07-30)
- a9eda2e99 - feat(app): migrate to solid-sonner (#39519) (Aarav Sareen, 2026-07-30)
- 73009f0b0 - feat(app): update arrow buttons in review tab top bar (#39469) (Aarav Sareen, 2026-07-30)
- f72049021 - fix(console): add public fetch compatibility flag (Frank, 2026-07-30)
- 341c64cc9 - feat: discover Modal models (#39066) (Deven Navani, 2026-07-29)
- 1e17856ba - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-29)
- a6f7fe739 - docs(ecosystem): add opencode-tavily plugin (#38709) (Lakshya Agarwal, 2026-07-29)
- 32696c425 - release: v1.18.0 (opencode, 2026-07-14)
- 4a181c357 - desktop v2 migration finalising (#36912) (Brendan Allan, 2026-07-15)
- bfddf0578 - fix(app): use v2 base background for file views (#36836) (opencode-agent[bot], 2026-07-14)
- cdee625a1 - fix: preserve team login casing (#35981) (opencode-agent[bot], 2026-07-14)
- 5f7091ab4 - fix(app): wait for connected project picker anchor (#36879) (Luke Parker, 2026-07-15)
- e7e7a9764 - fix(app): retain permission state per server (#36873) (Luke Parker, 2026-07-14)
- f58b8cb67 - fix(app): avoid project picker positioning crash (#36864) (Luke Parker, 2026-07-15)
- 775f687ca - chore: generate (opencode-agent[bot], 2026-07-14)
- 265a93927 - feat(desktop): add layout transition switch (#36667) (usrnk1, 2026-07-14)
- 3a938bb6d - feat(app): update new session page logo (#36700) (Aarav Sareen, 2026-07-14)
- 6f9a4e70d - chore: generate (opencode-agent[bot], 2026-07-14)
- dedb4133d - feat(desktop): improve file comments in session timeline (#36845) (usrnk1, 2026-07-14)
- 21f8184c5 - fix(app): suppress review sidebar hydration motion (#36847) (Luke Parker, 2026-07-14)
- 59fe35097 - fix(app): terminal tab rename focus (#36695) (Aarav Sareen, 2026-07-14)
- 5bdfcaac3 - fix(app): settings/help button misalignment in projects sidebar (#36662) (Aarav Sareen, 2026-07-14)
- 323d68717 - feat(app): align custom agent selector with v2 (#36832) (Aarav Sareen, 2026-07-14)
- cdca203be - fix(app): enable remote session auto-accept (#36777) (Luke Parker, 2026-07-14)
- 77a31d2b6 - chore: generate (opencode-agent[bot], 2026-07-14)
- a1ed99278 - fix(app): prevent terminal mount from stealing focus (#36576) (Luke Parker, 2026-07-14)
- 729bd438e - fix(app): preload more timeline messages (#36172) (Luke Parker, 2026-07-14)
- 7304bb275 - fix(app): resync timeline after route reconnect (#36643) (Luke Parker, 2026-07-14)
- 456521f68 - fix(data): align comparison suggestions (Adam, 2026-07-14)
- ee69079bb - fix(data): proxy comparison sitemap (Adam, 2026-07-14)
- de14bb2e0 - fix(data): improve comparison metadata (Adam, 2026-07-14)
- 0539d56fc - fix(data): polish comparison details (Adam, 2026-07-14)
- 729adde02 - fix(data): show all comparison models (Adam, 2026-07-14)
- b7111d5c6 - chore: generate (opencode-agent[bot], 2026-07-14)
- 1669713fb - fix(data): restore breadcrumb styling (Adam, 2026-07-14)
- cb8be9ba1 - chore: generate (opencode-agent[bot], 2026-07-14)
- 15046658b - feat(app): update tabs intro content (#36701) (David Hill, 2026-07-14)
- 7255ce9a5 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-14)
- 2b9cf5d38 - chore: generate (opencode-agent[bot], 2026-07-14)
- a625d35f7 - fix(app): preserve composer caret after requests (#36503) (Luke Parker, 2026-07-14)
- 449c64928 - fix(app): 78x faster Home cold loading (#36214) (Luke Parker, 2026-07-14)
- 35c88c3fc - fix(app): preserve timeline bottom anchoring (#36160) (Luke Parker, 2026-07-14)
- b5e09024d - fix(app): clarify status indicator severity (#36031) (Luke Parker, 2026-07-14)
- 9a51765bd - fix(ui): preserve code spans adjacent to tildes (#35835) (Luke Parker, 2026-07-14)
- bb31c9b92 - sync release versions for v1.17.20 (opencode, 2026-07-13)
- 511767914 - fix(opencode): remove obsolete Luna Responses Lite workaround (#36750) (Aiden Cline, 2026-07-13)
- 0d5798c0b - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-13)
- 808677a61 - chore: bump gitlab-ai-provider to 6.11.1 (#36722) (Vladimir Glafirov, 2026-07-13)
- fe41e9d48 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-13)
- 0768c4655 - chore: generate (opencode-agent[bot], 2026-07-13)
- 1586a2659 - fix(data): selects (Adam, 2026-07-13)
- f026c1422 - fix(data): select component ux (Adam, 2026-07-13)
- b7fdb595d - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-13)
- 049ee1ce5 - chore(provider): bump Azure AI SDK for GPT-5.6 (#36704) (Aiden Cline, 2026-07-13)
- e71fbb6d4 - sync release versions for v1.17.19 (opencode, 2026-07-13)
- c9976d69c - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-13)
- 27734409e - chore: generate (opencode-agent[bot], 2026-07-13)
- e434ce01d - fix(provider): support OpenAI pro reasoning mode (#36694) (Aiden Cline, 2026-07-13)
- c2f93ae2a - chore: generate (opencode-agent[bot], 2026-07-13)
- 92cc8f553 - fix(stats): correct breadcrumb behavior (Adam, 2026-07-13)
- 49d997aec - fix(xai): default store to false for Responses (#36629) (Mark, 2026-07-13)
- 67aa9cee2 - fix(opencode): support Luna Responses Lite over OAuth (#36685) (Aiden Cline, 2026-07-13)
- 7ec3d6782 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-13)
- 5401ebaed - chore: bump gitlab-ai-provider to 6.11.0 (#36668) (Vladimir Glafirov, 2026-07-13)
- 99668cfdc - fix(provider): tweak reasoning option driven max budget variants (#36626) (Aiden Cline, 2026-07-13)
- b3a012cbd - fix(cli): switch org after console logout (#36276) (opencode-agent[bot], 2026-07-13)
- 51b9c726c - fix(app): remove interface transition changes accidentally merged into dev (#36653) (usrnk1, 2026-07-13)
- b4e49d5b3 - feat(app): redesign attachment cards (#35945) (Aarav Sareen, 2026-07-13)
- 2b2985458 - chore: generate (opencode-agent[bot], 2026-07-13)
- 8ce5038bd - Merge branch 'dev' of https://github.com/anomalyco/opencode into interface-toggle (usrnk1, 2026-07-13)
- 446510a6a - tui: surface a dismissible new-interface notice and tighten settings copy for clarity (usrnk1, 2026-07-13)
- 49028b624 - chore: generate (opencode-agent[bot], 2026-07-13)
- d595c7e26 - feat(app): review panel updates (#36240) (Aarav Sareen, 2026-07-13)
- 17cd4a8c3 - feat(app): align edit project modal with v2 style (#36213) (Aarav Sareen, 2026-07-13)
- 9bbf7918d - chore: generate (opencode-agent[bot], 2026-07-13)
- 97f502e79 - feat(app): middle click to open new tab (#36215) (Aarav Sareen, 2026-07-13)
- ac5e24908 - feat(app): add interface transition setting (usrnk1, 2026-07-13)
- 140e796b2 - feat(ui): add accent badge variant (usrnk1, 2026-07-13)
- dd02cea9e - feat(desktop): fix clipped labels and branch tooltip (#35724) (usrnk1, 2026-07-13)
- a8062ea31 - fix(provider): derive variants from reasoning metadata (#36624) (Aiden Cline, 2026-07-13)
- f47684787 - fix(opencode): filter unsupported GPT-5.6 OAuth alias (#36621) (Aiden Cline, 2026-07-13)
- 8168f0f0f - fix(provider): route gateway variants by api id (#36614) (Aiden Cline, 2026-07-13)
- 803644069 - ci: remove starptech from core triage assignees (#36618) (opencode-agent[bot], 2026-07-12)
- cf7503687 - chore: generate (opencode-agent[bot], 2026-07-12)
- 6f8e1dda1 - fix(provider): derive variants from reasoning options (#36543) (Aiden Cline, 2026-07-12)
- 4dcfd9182 - chore: generate (opencode-agent[bot], 2026-07-12)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/core/src/tool/bash.ts` (+9, -5)
- `packages/opencode/src/kilocode/tool/task.ts` (+2, -7)
- `packages/opencode/src/tool/code-mode.ts` (+324, -0)
- `packages/opencode/src/tool/grep.ts` (+4, -1)
- `packages/opencode/src/tool/registry.ts` (+43, -2)
- `packages/opencode/src/tool/task.ts` (+23, -3)
- `packages/opencode/test/kilocode/tool/grep-signal-controls.test.ts` (+3, -3)
- `packages/opencode/test/tool/code-mode-integration.test.ts` (+349, -0)
- `packages/opencode/test/tool/code-mode.test.ts` (+789, -0)
- `packages/opencode/test/tool/fixtures/models-api.json` (+122186, -66878)
- `packages/opencode/test/tool/grep.test.ts` (+2, -0)
- `packages/opencode/test/tool/registry.test.ts` (+118, -2)
- `packages/opencode/test/tool/task.test.ts` (+80, -0)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
- `packages/opencode/src/permission/index.ts` (+5, -0)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+2, -2)
- `packages/core/src/config/plugin/agent.ts` (+41, -4)
- `packages/core/src/database/migration.ts` (+12, -7)
- `packages/core/src/effect/layer-node.ts` (+1, -1)
- `packages/core/src/filesystem/watcher.ts` (+1, -1)
- `packages/core/src/fs-util.ts` (+14, -3)
- `packages/core/src/instruction-context.ts` (+13, -11)
- `packages/core/src/location-services.ts` (+4, -0)
- `packages/core/src/models-dev.ts` (+11, -8)
- `packages/core/src/permission.ts` (+10, -9)
- `packages/core/src/plugin/provider/github-copilot.ts` (+19, -15)
- `packages/core/src/plugin/skill/customize-opencode.md` (+4, -3)
- `packages/core/src/project/copy.ts` (+1, -1)
- `packages/core/src/pty/pty.node.ts` (+4, -1)
- `packages/core/src/reference.ts` (+1, -5)
- `packages/core/src/repository-cache.ts` (+45, -42)
- `packages/core/src/repository.ts` (+8, -2)
- `packages/core/src/session/compaction.ts` (+14, -19)
- `packages/core/src/session/runner/llm.ts` (+9, -4)
- `packages/core/src/v1/config/config.ts` (+7, -1)
- `packages/core/src/v1/config/provider.ts` (+8, -2)
- `packages/core/test/config/agent.test.ts` (+76, -1)
- `packages/core/test/filesystem/watcher.test.ts` (+6, -7)
- `packages/core/test/kilocode/database-migration-compat.test.ts` (+70, -0)
- `packages/core/test/kilocode/reference-materialization.test.ts` (+3, -1)
- `packages/core/test/models.test.ts` (+8, -2)
- `packages/core/test/permission.test.ts` (+21, -3)
- `packages/core/test/plugin/provider-github-copilot.test.ts` (+36, -0)
- `packages/core/test/provider-mistral.test.ts` (+282, -0)
- `packages/core/test/provider-xai-responses.test.ts` (+32, -0)
- `packages/core/test/reference.test.ts` (+1, -1)
- `packages/core/test/repository-cache.test.ts` (+61, -2)
- `packages/core/test/repository.test.ts` (+6, -0)
- `packages/core/test/session-compaction.test.ts` (+9, -0)
- `packages/core/test/session-runner.test.ts` (+157, -15)
- `packages/core/test/tool-apply-patch.test.ts` (+1, -1)
- `packages/core/test/tool-bash.test.ts` (+1, -1)
- `packages/core/test/tool-edit.test.ts` (+1, -1)
- `packages/core/test/tool-question.test.ts` (+1, -1)
- `packages/core/test/tool-read.test.ts` (+1, -1)
- `packages/core/test/tool-skill.test.ts` (+1, -1)
- `packages/core/test/tool-todowrite.test.ts` (+1, -1)
- `packages/core/test/tool-write.test.ts` (+1, -1)

#### Other Changes
- `.changeset/opencode-v1-17-13-to-v1-18-0.md` (+30, -0)
- `.changeset/opencode-v1-18-1-to-v1-18-13.md` (+6, -0)
- `.changeset/steady-migration-journal.md` (+5, -0)
- `.github/actions/setup-bun/action.yml` (+7, -7)
- `.github/workflows/test.yml` (+14, -2)
- `.opencode-version` (+1, -1)
- `.opencode/command/translate.md` (+1, -1)
- `artifacts/glm52-rise-video/.gitignore` (+3, -0)
- `artifacts/glm52-rise-video/bun.lock` (+483, -0)
- `artifacts/glm52-rise-video/out/flash-share.mp4` (+3, -0)
- `artifacts/glm52-rise-video/out/glm-52-broke-out.mp4` (+3, -0)
- `artifacts/glm52-rise-video/out/june-totals.png` (+-, --)
- `artifacts/glm52-rise-video/out/minimax-climb.mp4` (+3, -0)
- `artifacts/glm52-rise-video/out/novel-1984.mp4` (+3, -0)
- `artifacts/glm52-rise-video/out/nz-sheep.mp4` (+3, -0)
- `artifacts/glm52-rise-video/package.json` (+25, -0)
- `artifacts/glm52-rise-video/public/book.jpg` (+-, --)
- `artifacts/glm52-rise-video/public/sheep.jpg` (+-, --)
- `artifacts/glm52-rise-video/src/data.ts` (+156, -0)
- `artifacts/glm52-rise-video/src/flash.tsx` (+185, -0)
- `artifacts/glm52-rise-video/src/index.tsx` (+36, -0)
- `artifacts/glm52-rise-video/src/june.tsx` (+144, -0)
- `artifacts/glm52-rise-video/src/minimax.tsx` (+201, -0)
- `artifacts/glm52-rise-video/src/novel.tsx` (+135, -0)
- `artifacts/glm52-rise-video/src/sheep.tsx` (+139, -0)
- `artifacts/glm52-rise-video/src/video.tsx` (+254, -0)
- `artifacts/glm52-rise-video/sst-env.d.ts` (+10, -0)
- `bun.lock` (+624, -901)
- `nix/hashes.json` (+4, -4)
- `package.json` (+15, -13)
- `packages/client/package.json` (+3, -2)
- `packages/client/src/index.ts` (+10, -0)
- `packages/codemode/AGENTS.md` (+23, -0)
- `packages/codemode/README.md` (+369, -0)
- `packages/codemode/codemode.md` (+176, -0)
- `packages/codemode/package.json` (+28, -0)
- `packages/codemode/src/codemode.ts` (+159, -0)
- `packages/codemode/src/index.ts` (+4, -0)
- `packages/codemode/src/interpreter/model.ts` (+201, -0)
- `packages/codemode/src/interpreter/runtime.ts` (+3465, -0)
- `packages/codemode/src/openapi/TODO.md` (+19, -0)
- `packages/codemode/src/openapi/index.ts` (+130, -0)
- `packages/codemode/src/openapi/runtime.ts` (+326, -0)
- `packages/codemode/src/openapi/spec.ts` (+511, -0)
- `packages/codemode/src/openapi/types.ts` (+112, -0)
- `packages/codemode/src/stdlib/collections.ts` (+51, -0)
- `packages/codemode/src/stdlib/console.ts` (+4, -0)
- `packages/codemode/src/stdlib/date.ts` (+94, -0)
- `packages/codemode/src/stdlib/json.ts` (+42, -0)
- `packages/codemode/src/stdlib/math.ts` (+65, -0)
- `packages/codemode/src/stdlib/number.ts` (+66, -0)
- `packages/codemode/src/stdlib/object.ts` (+77, -0)
- `packages/codemode/src/stdlib/promise.ts` (+6, -0)
- `packages/codemode/src/stdlib/regexp.ts` (+74, -0)
- `packages/codemode/src/stdlib/string.ts` (+52, -0)
- `packages/codemode/src/stdlib/url.ts` (+90, -0)
- `packages/codemode/src/stdlib/value.ts` (+86, -0)
- `packages/codemode/src/tool-error.ts` (+11, -0)
- `packages/codemode/src/tool-runtime.ts` (+806, -0)
- `packages/codemode/src/tool-schema.ts` (+301, -0)
- `packages/codemode/src/tool.ts` (+96, -0)
- `packages/codemode/src/values.ts` (+49, -0)
- `packages/codemode/sst-env.d.ts` (+10, -0)
- `packages/codemode/test/codemode.test.ts` (+1163, -0)
- `packages/codemode/test/enumeration.test.ts` (+159, -0)
- `packages/codemode/test/fixtures/openapi-happy-path.json` (+230, -0)
- `packages/codemode/test/fixtures/opencode-v2-openapi.json` (+23730, -0)
- `packages/codemode/test/openapi.test.ts` (+964, -0)
- `packages/codemode/test/parity.test.ts` (+425, -0)
- `packages/codemode/test/promise.test.ts` (+456, -0)
- `packages/codemode/test/signature.test.ts` (+449, -0)
- `packages/codemode/test/stdlib.test.ts` (+715, -0)
- `packages/codemode/tsconfig.json` (+9, -0)
- `packages/httpapi-codegen/package.json` (+2, -2)
- `packages/kilo-docs/lib/nav/collaborate.ts` (+1, -0)
- `packages/kilo-docs/pages/automate/agent-manager.md` (+13, -0)
- `packages/kilo-docs/pages/code-with-ai/agents/chat-interface.md` (+1, -0)
- `packages/kilo-docs/pages/code-with-ai/features/speech-to-text.md` (+2, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli.md` (+35, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/cloud-agent.md` (+1, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/mobile.md` (+6, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/vscode/index.md` (+1, -0)
- `packages/kilo-docs/pages/collaborate/enterprise/groups.md` (+56, -0)
- `packages/kilo-docs/pages/collaborate/enterprise/model-access-controls.md` (+1, -0)
- `packages/kilo-docs/pages/collaborate/teams/billing.md` (+12, -0)
- `packages/kilo-docs/pages/contributing/architecture/cloud-security.md` (+1, -1)
- `packages/kilo-docs/pages/customize/workflows.md` (+7, -0)
- `packages/kilo-docs/pages/gateway/authentication.md` (+1, -1)
- `packages/kilo-docs/pages/gateway/index.md` (+1, -1)
- `packages/kilo-docs/pages/gateway/models-and-providers.md` (+3, -2)
- `packages/kilo-docs/pages/getting-started/byok.md` (+1, -1)
- `packages/kilo-docs/pages/getting-started/setup-authentication.md` (+1, -1)
- `packages/kilo-docs/pages/kiloclaw/overview.md` (+1, -0)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+8, -6)
- `packages/kilo-vscode/src/agent-manager/GitOps.ts` (+22, -0)
- `packages/kilo-vscode/src/agent-manager/focus-panel.ts` (+5, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-focus-panel.test.ts` (+52, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-terminal-layout.test.ts` (+23, -4)
- `packages/kilo-vscode/tests/unit/language-utils.test.ts` (+9, -1)
- `packages/kilo-vscode/tests/unit/session-model-selector.test.ts` (+50, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+11, -40)
- `packages/kilo-vscode/webview-ui/agent-manager/focus.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/project/default-base.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/side-panel-layout.ts` (+27, -0)
- `packages/kilo-vscode/webview-ui/src/context/language.tsx` (+5, -3)
- `packages/kilo-vscode/webview-ui/src/context/session-model-selector.ts` (+36, -0)
- `packages/kilo-vscode/webview-ui/src/context/session-utils.ts` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+14, -34)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+6, -2)
- `packages/kilo-vscode/webview-ui/src/stories/history.stories.tsx` (+8, -4)
- `packages/llm/script/recording-cost-report.ts` (+1, -1)
- `packages/llm/src/provider-error.ts` (+19, -1)
- `packages/llm/src/providers/github-copilot.ts` (+6, -3)
- `packages/llm/test/exports.test.ts` (+14, -0)
- `packages/llm/test/provider-error.test.ts` (+32, -0)
- `packages/opencode/package.json` (+7, -7)
- `packages/opencode/script/build.ts` (+6, -8)
- `packages/opencode/script/kilocode/test-cli.ts` (+7, -8)
- `packages/opencode/src/account/account.ts` (+13, -1)
- `packages/opencode/src/cli/cmd/github.handler.ts` (+6, -0)
- `packages/opencode/src/cli/cmd/import.ts` (+14, -8)
- `packages/opencode/src/cli/cmd/run/footer.command.tsx` (+18, -1)
- `packages/opencode/src/cli/cmd/run/footer.subagent.tsx` (+3, -1)
- `packages/opencode/src/cli/cmd/run/footer.view.tsx` (+3, -1)
- `packages/opencode/src/config/config.ts` (+5, -6)
- `packages/opencode/src/effect/runtime-flags.ts` (+1, -0)
- `packages/opencode/src/kilocode/kilo-commands.tsx` (+23, -9)
- `packages/opencode/src/kilocode/plugins/session-v2-debug.tsx` (+2, -1)
- `packages/opencode/src/kilocode/plugins/sidebar-footer.tsx` (+3, -1)
- `packages/opencode/src/mcp/browser.ts` (+37, -0)
- `packages/opencode/src/mcp/index.ts` (+19, -26)
- `packages/opencode/src/plugin/github-copilot/models.ts` (+14, -2)
- `packages/opencode/src/plugin/index.ts` (+2, -0)
- `packages/opencode/src/plugin/modal/modal.ts` (+25, -0)
- `packages/opencode/src/plugin/modal/models.ts` (+140, -0)
- `packages/opencode/src/plugin/openai/codex.ts` (+10, -1)
- `packages/opencode/src/provider/models.ts` (+4, -2)
- `packages/opencode/src/provider/provider.ts` (+111, -75)
- `packages/opencode/src/provider/transform.ts` (+173, -96)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/experimental.ts` (+21, -19)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/session.ts` (+3, -1)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+5, -2)
- `packages/opencode/src/session/processor.ts` (+2, -1)
- `packages/opencode/src/session/prompt.ts` (+33, -18)
- `packages/opencode/src/session/prompt/meta.txt` (+65, -0)
- `packages/opencode/src/session/session.ts` (+1, -0)
- `packages/opencode/src/session/system.ts` (+2, -1)
- `packages/opencode/src/session/tools.ts` (+110, -103)
- `packages/opencode/test/account/service.test.ts` (+48, -1)
- `packages/opencode/test/cli/import.test.ts` (+36, -0)
- `packages/opencode/test/cli/run/footer.view.test.tsx` (+46, -1)
- `packages/opencode/test/cli/tui/thread.test.ts` (+9, -0)
- `packages/opencode/test/config/config.test.ts` (+25, -0)
- `packages/opencode/test/fixture/mcp-lifecycle-stdio.ts` (+26, -0)
- `packages/opencode/test/kilocode/issue-8656-stall.test.ts` (+4, -3)
- `packages/opencode/test/kilocode/provider/grok-reasoning-variants.test.ts` (+34, -0)
- `packages/opencode/test/kilocode/provider/kimi-adaptive-effort.test.ts` (+45, -0)
- `packages/opencode/test/kilocode/server/config-overlay.test.ts` (+33, -3)
- `packages/opencode/test/kilocode/session-prompt-queue.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/session/meta-prompt.test.ts` (+13, -0)
- `packages/opencode/test/kilocode/task-nesting.test.ts` (+38, -0)
- `packages/opencode/test/mcp/catalog.test.ts` (+61, -1)
- `packages/opencode/test/mcp/headers.test.ts` (+69, -94)
- `packages/opencode/test/mcp/lifecycle.test.ts` (+546, -1298)
- `packages/opencode/test/mcp/oauth-auto-connect.test.ts` (+242, -309)
- `packages/opencode/test/mcp/oauth-browser.test.ts` (+192, -216)
- `packages/opencode/test/mcp/transport.test.ts` (+38, -0)
- `packages/opencode/test/plugin/codex.test.ts` (+43, -0)
- `packages/opencode/test/plugin/github-copilot-models.test.ts` (+92, -0)
- `packages/opencode/test/plugin/modal-models.test.ts` (+208, -0)
- `packages/opencode/test/provider/header-timeout.test.ts` (+1, -1)
- `packages/opencode/test/provider/provider.test.ts` (+186, -33)
- `packages/opencode/test/provider/transform.test.ts` (+940, -84)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+9, -21)
- `packages/opencode/test/server/httpapi-reference.test.ts` (+1, -1)
- `packages/opencode/test/server/httpapi-session.test.ts` (+73, -0)
- `packages/opencode/test/session/compaction.test.ts` (+2, -2)
- `packages/opencode/test/session/llm.test.ts` (+187, -1)
- `packages/opencode/test/session/message-v2.test.ts` (+1, -0)
- `packages/opencode/test/session/system.test.ts` (+8, -1)
- `packages/plugin/package.json` (+3, -3)
- `packages/protocol/src/groups/pty.ts` (+1, -0)
- `packages/sdk-next/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+8, -3)
- `packages/sdk/openapi.json` (+31, -6)
- `packages/session-ui/AGENTS.md` (+7, -0)
- `packages/session-ui/package.json` (+9, -3)
- `packages/session-ui/src/components/basic-tool.css` (+79, -0)
- `packages/session-ui/src/components/basic-tool.tsx` (+17, -13)
- `packages/session-ui/src/components/file-media.tsx` (+44, -20)
- `packages/session-ui/src/components/file.tsx` (+41, -6)
- `packages/session-ui/src/components/line-comment-annotations.tsx` (+148, -95)
- `packages/session-ui/src/components/markdown-cache.tsx` (+15, -24)
- `packages/session-ui/src/components/markdown-preload.test.ts` (+0, -18)
- `packages/session-ui/src/components/markdown-projection.ts` (+11, -0)
- `packages/session-ui/src/components/markdown-stream.test.ts` (+38, -1)
- `packages/session-ui/src/components/markdown-stream.ts` (+20, -8)
- `packages/session-ui/src/components/markdown-worker-protocol.test.ts` (+7, -1)
- `packages/session-ui/src/components/markdown-worker-protocol.ts` (+9, -3)
- `packages/session-ui/src/components/markdown-worker.ts` (+116, -18)
- `packages/session-ui/src/components/markdown.css` (+32, -10)
- `packages/session-ui/src/components/markdown.tsx` (+54, -15)
- `packages/session-ui/src/components/{markdown-shiki.worker.ts => markdown.worker.ts}` (+57, -8)
- `packages/session-ui/src/components/message-file.test.ts` (+22, -14)
- `packages/session-ui/src/components/message-file.ts` (+22, -2)
- `packages/session-ui/src/components/message-part.css` (+95, -11)
- `packages/session-ui/src/components/message-part.tsx` (+325, -156)
- `packages/session-ui/src/components/session-diff.ts` (+2, -1)
- `packages/session-ui/src/components/session-review.css` (+2, -0)
- `packages/session-ui/src/components/session-review.tsx` (+3, -2)
- `packages/session-ui/src/components/session-turn.css` (+2, -0)
- `packages/session-ui/src/components/session-turn.tsx` (+3, -3)
- `packages/session-ui/src/components/timeline-playground.stories.tsx` (+46, -1)
- `packages/session-ui/src/components/tool-count-label.tsx` (+9, -6)
- `packages/session-ui/src/components/tool-count-summary.stories.tsx` (+8, -11)
- `packages/session-ui/src/components/tool-count-summary.tsx` (+3, -8)
- `packages/session-ui/src/components/tool-error-card.tsx` (+8, -1)
- `packages/session-ui/src/context/data.tsx` (+6, -1)
- `packages/session-ui/src/pierre/comment-hover.ts` (+13, -4)
- `packages/session-ui/src/pierre/index.ts` (+65, -29)
- `packages/session-ui/src/pierre/worker.ts` (+3, -0)
- `packages/session-ui/src/v2/components/attachment-card-v2.css` (+70, -0)
- `packages/session-ui/src/v2/components/attachment-card-v2.tsx` (+33, -0)
- `packages/session-ui/src/v2/components/comment-card-v2.tsx` (+64, -0)
- `packages/session-ui/src/v2/components/line-comment-annotations-v2.tsx` (+227, -0)
- `packages/session-ui/src/v2/components/prompt-input/attachments.css` (+44, -0)
- `packages/session-ui/src/v2/components/prompt-input/attachments.ts` (+281, -0)
- `packages/session-ui/src/v2/components/prompt-input/index.tsx` (+726, -0)
- `packages/session-ui/src/v2/components/prompt-input/interaction.ts` (+484, -0)
- `packages/session-ui/src/v2/components/prompt-input/machine.test.ts` (+164, -0)
- `packages/session-ui/src/v2/components/prompt-input/machine.ts` (+261, -0)
- `packages/session-ui/src/v2/components/prompt-input/prompt-input.stories.tsx` (+221, -0)
- `packages/session-ui/src/v2/components/prompt-input/store.test.ts` (+183, -0)
- `packages/session-ui/src/v2/components/prompt-input/store.ts` (+205, -0)
- `packages/session-ui/src/v2/components/prompt-input/types.ts` (+106, -0)
- `packages/session-ui/src/v2/components/session-file-panel-v2.tsx` (+43, -0)
- `packages/session-ui/src/v2/components/session-review-empty-changes-v2.tsx` (+17, -0)
- `packages/session-ui/src/v2/components/session-review-empty-no-git-v2.tsx` (+28, -0)
- `packages/session-ui/src/v2/components/session-review-file-preview-v2-virtualize.test.ts` (+13, -0)
- `packages/session-ui/src/v2/components/session-review-file-preview-v2-virtualize.ts` (+5, -0)
- `packages/session-ui/src/v2/components/session-review-file-preview-v2.tsx` (+290, -0)
- `packages/session-ui/src/v2/components/session-review-v2.css` (+527, -0)
- `packages/session-ui/src/v2/components/session-review-v2.tsx` (+347, -0)
- `packages/storybook/.storybook/main.ts` (+2, -0)
- `packages/storybook/.storybook/mocks/app/components/dialog-select-model.tsx` (+4, -5)
- `packages/storybook/.storybook/mocks/app/context/command.ts` (+3, -0)
- `packages/storybook/.storybook/mocks/app/context/language.ts` (+76, -1)
- `packages/storybook/.storybook/mocks/app/context/platform.ts` (+1, -4)
- `packages/storybook/.storybook/mocks/app/context/prompt.ts` (+4, -0)
- `packages/storybook/.storybook/mocks/app/context/server-sdk.ts` (+47, -0)
- `packages/storybook/.storybook/mocks/app/context/server-sync.ts` (+33, -0)
- `packages/storybook/.storybook/mocks/app/context/sync.ts` (+2, -0)
- `packages/storybook/.storybook/mocks/app/hooks/use-providers.ts` (+35, -2)
- `packages/storybook/package.json` (+2, -1)
- `packages/tui/package.json` (+2, -2)
- `packages/tui/src/app.tsx` (+14, -0)
- `packages/tui/src/component/dialog-debug.tsx` (+90, -0)
- `packages/tui/src/component/error-component.tsx` (+1, -20)
- `packages/tui/src/component/prompt/index.tsx` (+5, -1)
- `packages/tui/src/component/register-spinner.ts` (+139, -0)
- `packages/tui/src/component/spinner.tsx` (+3, -1)
- `packages/tui/src/config/keybind.ts` (+2, -0)
- `packages/tui/src/feature-plugins/home/tips-view.tsx` (+18, -18)
- `packages/tui/src/routes/session/index.tsx` (+65, -1)
- `packages/tui/src/ui/dialog-prompt.tsx` (+1, -1)
- `packages/tui/src/ui/dialog.tsx` (+3, -0)
- `packages/tui/src/ui/spinner.ts` (+4, -1)
- `packages/tui/src/util/system.ts` (+20, -0)
- `packages/tui/test/cli/tui/diff-viewer-file-tree.test.tsx` (+33, -30)
- `packages/tui/test/kilocode/spinner-runtime.test.ts` (+11, -0)
- `packages/ui/AGENTS.md` (+7, -0)
- `packages/ui/package.json` (+2, -1)
- `packages/ui/src/assets/icons/provider/openrouter.svg` (+1, -6)
- `packages/ui/src/components/collapsible.css` (+6, -0)
- `packages/ui/src/components/diff-changes.css` (+2, -0)
- `packages/ui/src/components/dock-surface.css` (+14, -0)
- `packages/ui/src/components/dropdown-menu.css` (+2, -2)
- `packages/ui/src/components/icon.css` (+5, -0)
- `packages/ui/src/components/icon.stories.tsx` (+1, -0)
- `packages/ui/src/components/icon.tsx` (+14, -2)
- `packages/ui/src/components/provider-icons/sprite.svg` (+2, -27)
- `packages/ui/src/components/resize-handle.css` (+14, -2)
- `packages/ui/src/components/resize-handle.tsx` (+26, -6)
- `packages/ui/src/components/scroll-view.css` (+2, -1)
- `packages/ui/src/components/scroll-view.test.ts` (+37, -1)
- `packages/ui/src/components/scroll-view.tsx` (+164, -26)
- `packages/ui/src/components/select.css` (+5, -3)
- `packages/ui/src/components/switch.css` (+4, -0)
- `packages/ui/src/components/tabs.css` (+268, -14)
- `packages/ui/src/components/tabs.tsx` (+1, -0)
- `packages/ui/src/components/text-field.css` (+2, -2)
- `packages/ui/src/components/toast.css` (+1, -1)
- `packages/ui/src/context/i18n.test.ts` (+24, -0)
- `packages/ui/src/context/i18n.tsx` (+38, -2)
- `packages/ui/src/context/marked-code-span.test.ts` (+14, -0)
- `packages/ui/src/context/marked-code-span.ts` (+18, -0)
- `packages/ui/src/context/marked-parser.test.ts` (+19, -0)
- `packages/ui/src/context/marked-parser.tsx` (+68, -0)
- `packages/ui/src/context/marked-regression.test.ts` (+12, -0)
- `packages/ui/src/context/marked-theme-register.tsx` (+10, -0)
- `packages/ui/src/context/marked-theme.tsx` (+372, -0)
- `packages/ui/src/context/marked.tsx` (+54, -8)
- `packages/ui/src/i18n/ar.ts` (+106, -46)
- `packages/ui/src/i18n/az.ts` (+197, -0)
- `packages/ui/src/i18n/br.ts` (+56, -11)
- `packages/ui/src/i18n/bs.ts` (+91, -45)
- `packages/ui/src/i18n/da.ts` (+58, -16)
- `packages/ui/src/i18n/de.ts` (+99, -58)
- `packages/ui/src/i18n/en.ts` (+46, -2)
- `packages/ui/src/i18n/es.ts` (+86, -38)
- `packages/ui/src/i18n/fi.ts` (+197, -0)
- `packages/ui/src/i18n/fr.ts` (+94, -44)
- `packages/ui/src/i18n/hi.ts` (+199, -0)
- `packages/ui/src/i18n/id.ts` (+219, -0)
- `packages/ui/src/i18n/it.ts` (+118, -91)
- `packages/ui/src/i18n/ja.ts` (+77, -33)
- `packages/ui/src/i18n/ko.ts` (+85, -40)
- `packages/ui/src/i18n/nl.ts` (+120, -101)
- `packages/ui/src/i18n/no.ts` (+92, -47)
- `packages/ui/src/i18n/pa.ts` (+198, -0)
- `packages/ui/src/i18n/pl.ts` (+97, -44)
- `packages/ui/src/i18n/ru.ts` (+95, -43)
- `packages/ui/src/i18n/sv.ts` (+197, -0)
- `packages/ui/src/i18n/th.ts` (+87, -44)
- `packages/ui/src/i18n/tr.ts` (+89, -47)
- `packages/ui/src/i18n/uk.ts` (+102, -61)
- `packages/ui/src/i18n/ur.ts` (+198, -0)
- `packages/ui/src/i18n/vi.ts` (+197, -0)
- `packages/ui/src/i18n/zh.ts` (+93, -52)
- `packages/ui/src/i18n/zht.ts` (+87, -46)
- `packages/ui/src/styles/theme.css` (+22, -0)
- `packages/ui/src/theme/context.tsx` (+10, -7)
- `packages/ui/src/theme/themes/oc-2.json` (+4, -2)
- `packages/ui/src/theme/v2/mapping.ts` (+30, -0)
- `packages/ui/src/v2/components/badge-v2.css` (+6, -0)
- `packages/ui/src/v2/components/badge-v2.stories.tsx` (+6, -1)
- `packages/ui/src/v2/components/badge-v2.tsx` (+5, -2)
- `packages/ui/src/v2/components/button-v2.css` (+24, -1)
- `packages/ui/src/v2/components/button-v2.stories.tsx` (+4, -3)
- `packages/ui/src/v2/components/button-v2.tsx` (+1, -1)
- `packages/ui/src/v2/components/dialog-v2.css` (+2, -2)
- `packages/ui/src/v2/components/dialog-v2.tsx` (+7, -4)
- `packages/ui/src/v2/components/diff-changes-v2.css` (+2, -0)
- `packages/ui/src/v2/components/divider-v2.css` (+2, -2)
- `packages/ui/src/v2/components/file-tree-v2.css` (+141, -0)
- `packages/ui/src/v2/components/icon-button-v2.css` (+8, -4)
- `packages/ui/src/v2/components/icon.tsx` (+36, -0)
- `packages/ui/src/v2/components/inline-input-v2.css` (+7, -0)
- `packages/ui/src/v2/components/inline-input-v2.tsx` (+19, -2)
- `packages/ui/src/v2/components/line-comment-v2.css` (+54, -0)
- `packages/ui/src/v2/components/line-comment-v2.tsx` (+157, -6)
- `packages/ui/src/v2/components/progress-circle-v2.css` (+1, -1)
- `packages/ui/src/v2/components/project-avatar-v2.css` (+7, -0)
- `packages/ui/src/v2/components/project-avatar-v2.stories.tsx` (+9, -1)
- `packages/ui/src/v2/components/project-avatar-v2.tsx` (+6, -4)
- `packages/ui/src/v2/components/select-v2.css` (+17, -5)
- `packages/ui/src/v2/components/select-v2.tsx` (+1, -0)
- `packages/ui/src/v2/components/split-button-v2.css` (+99, -0)
- `packages/ui/src/v2/components/split-button-v2.tsx` (+48, -0)
- `packages/ui/src/v2/components/switch-v2.css` (+10, -2)
- `packages/ui/src/v2/components/tabs-v2.css` (+5, -6)
- `packages/ui/src/v2/components/tabs-v2.tsx` (+4, -2)
- `packages/ui/src/v2/components/text-input-v2.css` (+38, -2)
- `packages/ui/src/v2/components/text-input-v2.tsx` (+37, -5)
- `packages/ui/src/v2/components/toast-v2.css` (+132, -122)
- `packages/ui/src/v2/components/toast-v2.stories.tsx` (+4, -4)
- `packages/ui/src/v2/components/toast-v2.tsx` (+209, -72)
- `packages/ui/src/v2/components/tooltip-v2.css` (+5, -0)
- `packages/ui/src/v2/components/wordmark-v2.tsx` (+48, -69)
- `packages/ui/src/v2/styles/theme.css` (+46, -0)
- `packages/ui/vite.config.ts` (+1, -1)
- `patches/@ai-sdk%2Fmistral@3.0.51.patch` (+709, -0)
- `patches/@modelcontextprotocol%2Fsdk@1.29.0.patch` (+69, -1)
- `patches/@tanstack%2Fsolid-virtual@3.13.28.patch` (+0, -45)
- `patches/@tanstack%2Fvirtual-core@3.17.0.patch` (+0, -105)
- `patches/@tanstack%2Fvirtual-core@3.17.3.patch` (+108, -0)
- `patches/solid-js@1.9.10.patch` (+0, -58)
- `patches/solid-js@1.9.12.patch` (+158, -0)
- `script/check-model-tool-network.ts` (+2, -1)
- `script/check-test-ci.ts` (+42, -0)
- `script/upstream/README.md` (+5, -1)
- `script/upstream/index.ts` (+1, -0)
- `script/upstream/merge.ts` (+39, -13)
- `script/upstream/transforms/remove-kilo-web.test.ts` (+45, -0)
- `script/upstream/transforms/remove-kilo-web.ts` (+38, -0)
- `script/upstream/transforms/skip-files.test.ts` (+15, -0)
- `script/upstream/transforms/transform-i18n.test.ts` (+26, -0)
- `script/upstream/transforms/transform-i18n.ts` (+4, -2)
- `script/upstream/transforms/transform-package-json.test.ts` (+31, -4)
- `script/upstream/transforms/transform-package-json.ts` (+25, -4)
- `script/upstream/utils/config.ts` (+8, -0)
- `script/upstream/utils/upstream.ts` (+5, -3)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index fb6f43057..085a70bef 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -94,7 +94,7 @@
     "@ai-sdk/google": "3.0.73",
     "@ai-sdk/google-vertex": "4.0.128",
     "@ai-sdk/groq": "3.0.31",
-    "@ai-sdk/mistral": "3.0.27",
+    "@ai-sdk/mistral": "3.0.51",
     "@ai-sdk/openai": "3.0.88",
     "@ai-sdk/openai-compatible": "2.0.48",
     "@ai-sdk/perplexity": "3.0.26",
@@ -106,7 +106,7 @@
     "@aws-sdk/credential-providers": "3.1057.0",
     "@openrouter/ai-sdk-provider": "2.9.0",
     "ai-gateway-provider": "3.1.2",
-    "gitlab-ai-provider": "6.9.3",
+    "gitlab-ai-provider": "6.12.1",
     "google-auth-library": "10.5.0",
     "immer": "11.1.4",
     "venice-ai-sdk-provider": "2.1.1",
```

#### packages/core/src/config/plugin/agent.ts
```diff
diff --git a/packages/core/src/config/plugin/agent.ts b/packages/core/src/config/plugin/agent.ts
index 48efe7580..0635aa629 100644
--- a/packages/core/src/config/plugin/agent.ts
+++ b/packages/core/src/config/plugin/agent.ts
@@ -11,6 +11,11 @@ import { FSUtil } from "../../fs-util"
 import { ModelV2 } from "../../model"
 import { ConfigAgentV1 } from "../../v1/config/agent"
 import { ConfigMigrateV1 } from "../../v1/config/migrate"
+import { Global } from "../../global"
+import { PermissionV2 } from "../../permission"
+import type { LocationMutation } from "../../location-mutation"
+import type { ReadTool } from "../../tool/read"
+import type { EditTool } from "../../tool/edit"
 
 const legacySources = [
   { pattern: "{agent,agents}/**/*.md", primary: false },
@@ -19,6 +24,11 @@ const legacySources = [
 const decodeAgent = Schema.decodeUnknownOption(ConfigAgent.Info)
 const decodeLegacyAgent = Schema.decodeUnknownOption(ConfigAgentV1.Info)
 const decodeConfig = Schema.decodeUnknownOption(Config.Info)
+type PathAction =
+  | LocationMutation.ExternalDirectoryAuthorization["action"]
+  | typeof ReadTool.name
+  | typeof EditTool.name
+const pathActions = ["external_directory", "read", "edit"] as const satisfies readonly PathAction[]
 const agentKeys = new Set([
   "model",
   "variant",
@@ -38,6 +48,7 @@ export const Plugin = define({
   effect: Effect.fn(function* (ctx) {
     const config = yield* Config.Service
     const fs = yield* FSUtil.Service
+    const global = yield* Global.Service
     yield* ctx.agent.transform(
       Effect.fn(function* (draft) {
         const documents = yield* Effect.forEach(yield* config.entries(), (entry) => {
@@ -56,11 +67,14 @@ export const Plugin = define({
             )
           })
         }).pipe(Effect.map((documents) => documents.flat()))
-        const global = documents.flatMap((document) => document.info.permissions ?? [])
+        const permissions = expandPermissions(
+          documents.flatMap((document) => document.info.permissions ?? []),
+          global.home,
+        )
         const configuredDefault = Config.latest(documents, "default_agent")
         if (configuredDefault !== undefined) draft.default(AgentV2.ID.make(configuredDefault))
         for (const current of draft.list()) {
-          draft.update(current.id, (agent) => agent.permissions.push(...global))
+          draft.update(current.id, (agent) => agent.permissions.push(...permissions))
```

#### packages/core/src/database/migration.ts
```diff
diff --git a/packages/core/src/database/migration.ts b/packages/core/src/database/migration.ts
index 90dee8acb..388a37e7a 100644
--- a/packages/core/src/database/migration.ts
+++ b/packages/core/src/database/migration.ts
@@ -68,14 +68,19 @@ export function applyOnly(db: Database, input: Migration[]) {
 
     for (const migration of input) {
       if (completed.has(migration.id)) continue
-      yield* db.transaction((tx) =>
-        Effect.gen(function* () {
-          yield* migration.up(tx)
-          yield* tx.run(
-            sql`INSERT INTO ${sql.identifier("migration")} (id, time_completed) VALUES (${migration.id}, ${Date.now()})`,
-          )
-        }),
+      // kilocode_change start - another kilo process may have recorded this migration since the snapshot above; take the write lock and re-check before replaying, or the journal insert dies on the primary key
+      yield* db.transaction(
+        (tx) =>
+          Effect.gen(function* () {
+            if (yield* tx.get(sql`SELECT id FROM ${sql.identifier("migration")} WHERE id = ${migration.id}`)) return
+            yield* migration.up(tx)
+            yield* tx.run(
+              sql`INSERT INTO ${sql.identifier("migration")} (id, time_completed) VALUES (${migration.id}, ${Date.now()})`,
+            )
+          }),
+        { behavior: "immediate" },
       )
+      // kilocode_change end
     }
   })
 }
```

#### packages/core/src/effect/layer-node.ts
```diff
diff --git a/packages/core/src/effect/layer-node.ts b/packages/core/src/effect/layer-node.ts
index 54d783a3b..ef9798211 100644
--- a/packages/core/src/effect/layer-node.ts
+++ b/packages/core/src/effect/layer-node.ts
@@ -230,7 +230,7 @@ export function hoist<A, E, T extends Tag, const Items extends Replacements = re
         if (existing && existing !== node) {
           throw new Error(`Tag ${tag} has conflicting implementations for ${node.name}`)
         }
-        hoisted.set(node.name, node)
+        hoisted.set(node.name, rewriteReplacementDependencies(node, replacementMap))
         return group([])
       }
       if (node.kind === "unbound") {
```

#### packages/core/src/filesystem/watcher.ts
```diff
diff --git a/packages/core/src/filesystem/watcher.ts b/packages/core/src/filesystem/watcher.ts
index 1f7e0ed58..9e4ec0291 100644
--- a/packages/core/src/filesystem/watcher.ts
+++ b/packages/core/src/filesystem/watcher.ts
@@ -106,7 +106,7 @@ const layer = Layer.effect(
     const config = (yield* (yield* Config.Service).entries())
       .filter((entry): entry is Config.Document => entry.type === "document")
       .flatMap((item) => item.info.watcher?.ignore ?? [])
-    if (yield* Flag.KILO_EXPERIMENTAL_FILEWATCHER) {
+    if (location.vcs && (yield* Flag.KILO_EXPERIMENTAL_FILEWATCHER)) {
       yield* Effect.forkScoped(
         subscribe(location.directory, [...Ignore.PATTERNS, ...config, ...protecteds(location.directory)]),
       )
```


*... and more files (showing first 5)*

## opencode Changes (d041eee..1f94d8a)

### Commits

- 1f94d8a - docs(zen): remove expired free models (#41943) (Jack, 2026-08-12)
- c789868 - fix(opencode): cap session retries with jitter (#41939) (Aiden Cline, 2026-08-11)
- d470434 - refactor(console): simplify go usage response (vimtor, 2026-08-11)
- 561afb4 - fix(opencode): detect Copilot PDF input support (#41522) (Steven Ao, 2026-08-11)
- 2b8a596 - feat(console): add go usage endpoint (#16513) (Arif Rahman (Bolt), 2026-08-11)
- 36b2053 - docs(zen): add Hy3 Free (#41814) (Jack, 2026-08-12)
- 6afef2f - fix(console): update blocked account message (#41819) (opencode-agent[bot], 2026-08-11)
- 0d927ba - chore: generate (opencode-agent[bot], 2026-08-11)
- 9fdd482 - docs(zen): add Nemotron 3.5 Lightning (#41750) (Jack, 2026-08-11)

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
- `packages/console/app/src/i18n/en.ts` (+2, -1)
- `packages/console/app/src/routes/zen/go/v1/usage.ts` (+158, -0)
- `packages/opencode/src/plugin/github-copilot/models.ts` (+4, -1)
- `packages/opencode/src/session/retry.ts` (+11, -3)
- `packages/opencode/test/plugin/github-copilot-models.test.ts` (+68, -0)
- `packages/opencode/test/session/retry.test.ts` (+35, -4)
- `packages/web/src/content/docs/ar/zen.mdx` (+69, -69)
- `packages/web/src/content/docs/bs/zen.mdx` (+69, -69)
- `packages/web/src/content/docs/da/zen.mdx` (+69, -69)
- `packages/web/src/content/docs/de/zen.mdx` (+69, -69)
- `packages/web/src/content/docs/es/zen.mdx` (+69, -69)
- `packages/web/src/content/docs/fr/zen.mdx` (+69, -69)
- `packages/web/src/content/docs/it/zen.mdx` (+69, -69)
- `packages/web/src/content/docs/ja/zen.mdx` (+69, -69)
- `packages/web/src/content/docs/ko/zen.mdx` (+69, -69)
- `packages/web/src/content/docs/nb/zen.mdx` (+69, -69)
- `packages/web/src/content/docs/pl/zen.mdx` (+69, -69)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+69, -69)
- `packages/web/src/content/docs/ru/zen.mdx` (+69, -69)
- `packages/web/src/content/docs/th/zen.mdx` (+69, -69)
- `packages/web/src/content/docs/tr/zen.mdx` (+69, -69)
- `packages/web/src/content/docs/zen.mdx` (+69, -69)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+69, -69)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+69, -69)

### Key Diffs

(no key diffs to show)

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/src/config/plugin/agent.ts
- `src/core/` - review core changes from packages/core/src/database/migration.ts
- `src/core/` - review core changes from packages/core/src/effect/layer-node.ts
- `src/core/` - review core changes from packages/core/src/filesystem/watcher.ts
- `src/core/` - review core changes from packages/core/src/fs-util.ts
- `src/core/` - review core changes from packages/core/src/instruction-context.ts
- `src/core/` - review core changes from packages/core/src/location-services.ts
- `src/core/` - review core changes from packages/core/src/models-dev.ts
- `src/core/` - review core changes from packages/core/src/permission.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/github-copilot.ts
- `src/core/` - review core changes from packages/core/src/plugin/skill/customize-opencode.md
- `src/core/` - review core changes from packages/core/src/project/copy.ts
- `src/core/` - review core changes from packages/core/src/pty/pty.node.ts
- `src/core/` - review core changes from packages/core/src/reference.ts
- `src/core/` - review core changes from packages/core/src/repository-cache.ts
- `src/core/` - review core changes from packages/core/src/repository.ts
- `src/core/` - review core changes from packages/core/src/session/compaction.ts
- `src/core/` - review core changes from packages/core/src/session/runner/llm.ts
- `src/core/` - review core changes from packages/core/src/v1/config/config.ts
- `src/core/` - review core changes from packages/core/src/v1/config/provider.ts
- `src/core/` - review core changes from packages/core/test/config/agent.test.ts
- `src/core/` - review core changes from packages/core/test/filesystem/watcher.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/database-migration-compat.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/reference-materialization.test.ts
- `src/core/` - review core changes from packages/core/test/models.test.ts
- `src/core/` - review core changes from packages/core/test/permission.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-github-copilot.test.ts
- `src/core/` - review core changes from packages/core/test/provider-mistral.test.ts
- `src/core/` - review core changes from packages/core/test/provider-xai-responses.test.ts
- `src/core/` - review core changes from packages/core/test/reference.test.ts
- `src/core/` - review core changes from packages/core/test/repository-cache.test.ts
- `src/core/` - review core changes from packages/core/test/repository.test.ts
- `src/core/` - review core changes from packages/core/test/session-compaction.test.ts
- `src/core/` - review core changes from packages/core/test/session-runner.test.ts
- `src/core/` - review core changes from packages/core/test/tool-apply-patch.test.ts
- `src/core/` - review core changes from packages/core/test/tool-bash.test.ts
- `src/core/` - review core changes from packages/core/test/tool-edit.test.ts
- `src/core/` - review core changes from packages/core/test/tool-question.test.ts
- `src/core/` - review core changes from packages/core/test/tool-read.test.ts
- `src/core/` - review core changes from packages/core/test/tool-skill.test.ts
- `src/core/` - review core changes from packages/core/test/tool-todowrite.test.ts
- `src/core/` - review core changes from packages/core/test/tool-write.test.ts
- `src/permission/` - review permission changes from packages/opencode/src/permission/index.ts
- `src/tool/bash.ts` - update based on kilocode packages/core/src/tool/bash.ts changes
- `src/tool/code-mode-integration.test.ts` - update based on kilocode packages/opencode/test/tool/code-mode-integration.test.ts changes
- `src/tool/code-mode.test.ts` - update based on kilocode packages/opencode/test/tool/code-mode.test.ts changes
- `src/tool/code-mode.ts` - update based on kilocode packages/opencode/src/tool/code-mode.ts changes
- `src/tool/grep-signal-controls.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/grep-signal-controls.test.ts changes
- `src/tool/grep.test.ts` - update based on kilocode packages/opencode/test/tool/grep.test.ts changes
- `src/tool/grep.ts` - update based on kilocode packages/opencode/src/tool/grep.ts changes
- `src/tool/models-api.json.ts` - update based on kilocode packages/opencode/test/tool/fixtures/models-api.json changes
- `src/tool/registry.test.ts` - update based on kilocode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
- `src/tool/task.test.ts` - update based on kilocode packages/opencode/test/tool/task.test.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/kilocode/tool/task.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/tool/task.ts changes
