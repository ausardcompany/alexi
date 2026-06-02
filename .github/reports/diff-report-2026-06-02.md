# Upstream Changes Report
Generated: 2026-06-02 10:25:10

## Summary
- kilocode: 209 commits, 869 files changed
- opencode: 39 commits, 213 files changed

## kilocode Changes (1eeab10b2..7433b0d75)

### Commits

- 7433b0d75 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-06-02)
- f6357d844 - fix(vscode): sort permission exceptions (#10808) (Imanol Maiztegui, 2026-06-02)
- 00337a3c5 - Merge pull request #10790 from Kilo-Org/trial/kilo-opencode-v1.14.42 (Marius, 2026-06-02)
- 63090067a - Merge pull request #10809 from Kilo-Org/clever-slash (Marius, 2026-06-02)
- 6a071d138 - Merge remote-tracking branch 'origin/main' into trial/kilo-opencode-v1.14.42 (marius-kilocode, 2026-06-02)
- a0f800d37 - docs(cli): link Agent Manager guides from config skill (marius-kilocode, 2026-06-02)
- 7a420b818 - Merge pull request #9653 from truffle-dev/fix/cli-run-leading-dash-positional (Catriel Müller, 2026-06-02)
- ea6a88820 - fix(cli): omit empty TUI keybind patches (marius-kilocode, 2026-06-02)
- ece920c1c - Merge remote-tracking branch 'origin/main' into trial/kilo-opencode-v1.14.42 (marius-kilocode, 2026-06-02)
- 1fedf7f20 - release: v7.3.21 (kilo-maintainer[bot], 2026-06-02)
- b8ca6f736 - Merge branch 'main' of github.com:Kilo-Org/kilocode into fix/cli-run-leading-dash-positional (Catriel Müller, 2026-06-01)
- 859af5033 - refactor: move new changes to kilo folders (Catriel Müller, 2026-06-01)
- 507981377 - Merge pull request #10298 from Githubguy132010/seen-turnip (Catriel Müller, 2026-06-01)
- 4ad3aa26c - Merge branch 'main' into seen-turnip (Catriel Müller, 2026-06-01)
- 83892191a - Merge pull request #10191 from IamCoder18/fix/dialog-alert-newlines (Catriel Müller, 2026-06-01)
- 35f30ad34 - Merge pull request #10306 from IamCoder18/fix/export-dialog-checkbox-toggle (Catriel Müller, 2026-06-01)
- bca27d61c - Merge pull request #10310 from IamCoder18/feat/subagent-running-status (Catriel Müller, 2026-06-01)
- 9f909a17d - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-06-01)
- fafeb4ff7 - release: v7.3.20 (kilo-maintainer[bot], 2026-06-01)
- 390588912 - Merge pull request #10796 from Kilo-Org/catrielmuller/limit-background-process-port-scans (Catriel Müller, 2026-06-01)
- 942b1eb30 - Merge pull request #10753 from Kilo-Org/savory-act (Catriel Müller, 2026-06-01)
- 7b70e8f43 - fix(cli): clean background process port env (Catriel Müller, 2026-06-01)
- 096a394aa - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-06-01)
- 791515ea0 - fix(cli): limit background process port scans (Catriel Müller, 2026-06-01)
- f79f181bd - Merge pull request #10754 from Kilo-Org/sharp-balance (Catriel Müller, 2026-06-01)
- 9c618d224 - fix: fix tests (Catriel Müller, 2026-06-01)
- ffee5815e - refactor: fix promises validations (Catriel Müller, 2026-06-01)
- 525737c4f - refactor: fix typecheck and mistral link (Catriel Müller, 2026-06-01)
- 9b07af0d2 - Merge branch 'main' into sharp-balance (Catriel Müller, 2026-06-01)
- 16a174dcd - refactor: fix typecheck (Catriel Müller, 2026-06-01)
- 79ac67b3c - refactor: merge main (Catriel Müller, 2026-06-01)
- 9d2171f11 - fix(core): compare canonical spawned cwd paths (marius-kilocode, 2026-06-01)
- 0c1cff22e - Merge pull request #9499 from truffle-dev/fix/tui-submodule-session-worktree-family (Catriel Müller, 2026-06-01)
- 16f0a2034 - fix(core): normalize spawned cwd assertion on Windows (marius-kilocode, 2026-06-01)
- 24943b1fd - Merge branch 'main' into sharp-balance (Catriel Müller, 2026-06-01)
- d374ae97b - fix(core): await flock worker cleanup on Windows (marius-kilocode, 2026-06-01)
- 7de2613da - fix: subpath navigation (Catriel Müller, 2026-06-01)
- 491e97ca0 - Merge pull request #10748 from Kilo-Org/visual-gruyere (Kirill Kalishev, 2026-06-01)
- b5213921c - fix: preserve Kilo identity after upstream merge (marius-kilocode, 2026-06-01)
- a770114b0 - Merge pull request #10789 from Kilo-Org/fix/cli-queued-plan-context (Catriel Müller, 2026-06-01)
- b2701a51a - Merge pull request #10793 from Kilo-Org/tranquil-lemur (Marius, 2026-06-01)
- ae2a0fea3 - fix(kilo-docs): use stable external links (marius-kilocode, 2026-06-01)
- 6016248c4 - Revert "fix(kilo-docs): ignore unstable external link checks" (marius-kilocode, 2026-06-01)
- ad7377c6b - fix(kilo-docs): ignore unstable external link checks (marius-kilocode, 2026-06-01)
- 4faf255e8 - Merge pull request #10792 from Kilo-Org/bejewled-grain (Marius, 2026-06-01)
- 78bfc700e - fix: harden upstream v1.14.42 integration (marius-kilocode, 2026-06-01)
- 2a264819f - fix(cli): annotate nullable agent variant schema (marius-kilocode, 2026-06-01)
- cb1fdb3b1 - fix(cli): allow clearing agent variant overrides (marius-kilocode, 2026-06-01)
- bb7988b50 - Merge pull request #10774 from Kilo-Org/jetbrains-disable-root-instrumentation (Kirill Kalishev, 2026-06-01)
- 0f271a39d - resolve merge conflicts (marius-kilocode, 2026-06-01)
- 316a6627d - fix(cli): preserve context for queued plan prompts (Catriel Müller, 2026-06-01)
- 5eaae5fdd - Merge branch 'main' into savory-act (Joshua Lambert, 2026-06-01)
- 41606931f - merge: record upstream v1.14.42 (marius-kilocode, 2026-06-01)
- 7cc608064 - refactor: kilo compat for v1.14.42 (marius-kilocode, 2026-06-01)
- 980e27cfa - Merge branch 'jetbrains-disable-root-instrumentation' into visual-gruyere (kirillk, 2026-05-31)
- 34c9f6ec0 - fix(jetbrains): print CI Gradle stack traces (kirillk, 2026-05-31)
- cb066d2f3 - fix(jetbrains): log telemetry backpressure (kirillk, 2026-05-31)
- c545c32a1 - fix(jetbrains): harden telemetry threading (kirillk, 2026-05-31)
- 943d801a0 - Merge branch 'main' into jetbrains-disable-root-instrumentation (Kirill Kalishev, 2026-05-31)
- affc5f80c - fix(jetbrains): skip root instrumentation in CI (kirillk, 2026-05-31)
- 099b85ae4 - fix(jetbrains): avoid duplicate session open telemetry (kirillk, 2026-05-31)
- f087379f8 - fix(jetbrains): remove sandbox telemetry prefix (kirillk, 2026-05-31)
- f755792ba - fix(jetbrains): keep telemetry payload on logger (kirillk, 2026-05-31)
- 2e2f3d924 - fix(jetbrains): keep sandbox telemetry local (kirillk, 2026-05-31)
- 0d9ea23ec - fix(jetbrains): align logging environment payload (kirillk, 2026-05-31)
- 16eae9ccb - Merge branch 'main' into seen-turnip (Thomas Brugman, 2026-05-31)
- 8aa109fff - fix(jetbrains): address telemetry review feedback (kirillk, 2026-05-30)
- 986460385 - fix(jetbrains): skip root instrumentation in CI (kirillk, 2026-05-30)
- 0c519f97f - Merge branch 'main' into visual-gruyere (Kirill Kalishev, 2026-05-30)
- cf85e0d51 - feat: embedded kilo console (Catriel Müller, 2026-05-29)
- e140e40f0 - fix(vscode): declare Pierre worker dependency for builds (Josh Lambert, 2026-05-29)
- 623c9275f - refactor: optional daemon mode (Catriel Müller, 2026-05-29)
- 1c675ab24 - refactor: update bun lock (Catriel Müller, 2026-05-29)
- c0eda12da - feat: lsp & formatters pages (Catriel Müller, 2026-05-29)
- 8b2357a07 - Merge branch 'main' into visual-gruyere (Kirill Kalishev, 2026-05-29)
- 846e6f656 - fix(jetbrains): remove direct startup telemetry (kirillk, 2026-05-29)
- 528878c6b - refactor: refactor settings (Catriel Müller, 2026-05-29)
- f0200f922 - feat(jetbrains): expand plugin telemetry coverage (kirillk, 2026-05-29)
- 0aaff8956 - docs(jetbrains): update agent guidance (kirillk, 2026-05-29)
- d97348757 - fix(jetbrains): enable rc file logging (kirillk, 2026-05-29)
- bfe3ae9e3 - feat(jetbrains): report cli connection failures (kirillk, 2026-05-29)
- 6d76e3a3d - fix(jetbrains): remove telemetry event prefix (kirillk, 2026-05-29)
- e762c48ec - feat(jetbrains): add telemetry reporting (kirillk, 2026-05-29)
- 0ef8e5e0a - refactor: hot reload tui configs (Catriel Müller, 2026-05-29)
- f061af639 - fix(cli): use auth service for profile command (Thomas Brugman, 2026-05-29)
- 04b54c0d9 - Merge branch 'main' into seen-turnip (Thomas Brugman, 2026-05-29)
- 520ee03d8 - refactor: scope and project settings links (Catriel Müller, 2026-05-29)
- 2972acf0f - refactor: simplify upstream mod (Catriel Müller, 2026-05-29)
- 7e4c297ab - refactor: hot reload permissions (Catriel Müller, 2026-05-28)
- 3c96a7c8d - refactor: fix merge main (Catriel Müller, 2026-05-28)
- 9efb241f4 - refactor: merge main (Catriel Müller, 2026-05-28)
- 7fa61ad93 - wip: permissions (Catriel Müller, 2026-05-28)
- 694f5dd7b - refactor: rework agents list page (Catriel Müller, 2026-05-28)
- 7b655966b - refactor: tools rework (Catriel Müller, 2026-05-28)
- d55a45064 - refactor: remove omni server indicator (Catriel Müller, 2026-05-28)
- 9f3eeffcc - fix: Omni Search Z-Index (Catriel Müller, 2026-05-27)
- 49d36f483 - feat: Omni Search (Catriel Müller, 2026-05-27)
- fb4f5cc32 - refactor: improve models config and explore pages (Catriel Müller, 2026-05-27)
- e4e1c253e - refactor: improve default models screen (Catriel Müller, 2026-05-27)
- f626ed141 - refactor: fix terminal switch buffer (Catriel Müller, 2026-05-27)
- 1ca465944 - refactor: project sidebar (Catriel Müller, 2026-05-27)
- 7fc3bc09d - feat: session to terminal sync // new cli kilo theme (Catriel Müller, 2026-05-27)
- 01ac26564 - feat: initial implementation of the terminal manager and new design (Catriel Müller, 2026-05-27)
- 10de9ebfe - refactor: agent builder (Catriel Müller, 2026-05-26)
- ce80806bf - refactor: project filter / active projects on sidebar (Catriel Müller, 2026-05-26)
- 3648e2e13 - wip: kilo console (Catriel Müller, 2026-05-20)
- aca8aeb2b - fix(cli): toggle export dialog checkboxes on mouse click (Aarav Sharma, 2026-05-19)
- 2321ce7a5 - Merge branch 'main' into seen-turnip (Thomas Brugman, 2026-05-16)
- b590f8c25 - chore: add changeset for dialog alert newlines (Aarav Sharma, 2026-05-16)
- 0231a1f3c - fix(cli): rename balance command to profile (kiloconnect[bot], 2026-05-16)
- c265fa4c4 - chore: add changeset for subagent footer spinner (Aarav Sharma, 2026-05-16)
- 8ba95b1f2 - feat(cli): show running spinner in subagent footer (Aarav Sharma, 2026-05-15)
- 58f9754a3 - fix(cli): handle balance command errors (Thomas Brugman, 2026-05-15)
- 643810c5c - chore: add kilocode_change annotations to run-handler fix (truffle, 2026-05-15)
- 90ba44217 - fix(cli): preserve --raw atoms verbatim in run handler (#9622) (truffle, 2026-05-15)
- ac7e46d67 - feat(cli): add balance command (Thomas Brugman, 2026-05-15)
- d9d460c1a - fix: add kilocode_change markers to dialog-alert.tsx for multi-line message support (Aarav Sharma, 2026-05-12)
- a7c12dca3 - fix(tui): handle newlines in DialogAlert messages (Aarav Sharma, 2026-05-12)
- 23c6b69ab - release: v1.14.42 (opencode, 2026-05-09)
- 092bc674a - fix(sidebar): fix logic and missleading message #26469 (#26470) (Polo123456789, 2026-05-09)
- b24a4e897 - chore(server): clean up post-Hono-deletion scar tissue (#26542) (Kit Langton, 2026-05-09)
- 3afa622ea - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-09)
- d01cb7f01 - chore: generate (opencode-agent[bot], 2026-05-09)
- 28b03595b - research: delete Hono backend (do not merge) (#25667) (Kit Langton, 2026-05-09)
- 32684e70e - test(server): expect null body from HTTP API authorize() with no redirect (#26515) (Kit Langton, 2026-05-09)
- a1e487b04 - test(cli): switch to disposeAllInstances fixture helper after Instance API migration (truffle, 2026-05-09)
- 99b3169b6 - Merge remote-tracking branch 'upstream/main' into fix/tui-submodule-session-worktree-family (truffle, 2026-05-09)
- 4c8a4064f - test(cli): align Log import with @opencode-ai/core path after util refactor (truffle, 2026-05-09)
- b2baddcd3 - chore: generate (opencode-agent[bot], 2026-05-09)
- dbd48d423 - fix(server): match Hono wire format for authorize undefined and share errors (#26474) (Kit Langton, 2026-05-09)
- e7cc8259b - test(server): drop flaky account error-mapping test (#26475) (Kit Langton, 2026-05-09)
- a9ccb0804 - chore: generate (opencode-agent[bot], 2026-05-09)
- ebe6087e8 - fix(server): return structured validation errors (#26457) (Kit Langton, 2026-05-09)
- dc978cb88 - fix(server): validate permission and question ids (#26456) (Kit Langton, 2026-05-09)
- 8cbc43fbb - fix(server): include auth challenge on typed 401 (#26455) (Kit Langton, 2026-05-09)
- 82359c4b1 - chore: generate (opencode-agent[bot], 2026-05-09)
- 7f3e51453 - test(server): use Layer.mock for partial Account service stub (#26472) (Kit Langton, 2026-05-09)
- cbdb2d982 - test(server): expand workspace routing fixed-id coverage (#26458) (Kit Langton, 2026-05-09)
- 96bde05f6 - docs(server): explain why HTTP API PTY handler has no early-frame buffer (#26464) (Kit Langton, 2026-05-08)
- dcb8ed8eb - test(server): cover workspace sync fence protocol (#26441) (Kit Langton, 2026-05-08)
- aab82cc1a - test(project): rescue non-Hono InstanceBootstrap boundary tests (#26453) (Kit Langton, 2026-05-08)
- cd1d1e81a - test(server): run httpapi exercise effect mode in test:httpapi (#26452) (Kit Langton, 2026-05-08)
- cff441909 - chore: generate (opencode-agent[bot], 2026-05-09)
- 3615d5aab - fix(server): map Account failures to typed 500 instead of defect (#26448) (Kit Langton, 2026-05-08)
- 11d9e82ea - chore: generate (opencode-agent[bot], 2026-05-09)
- eadda11ec - refactor(server): use JSON response for OpenAPI doc route (#26447) (Kit Langton, 2026-05-08)
- f73a56c22 - fix(server): log instance disposal failures from HTTP API lifecycle (#26446) (Kit Langton, 2026-05-08)
- c0acf5c43 - chore: generate (opencode-agent[bot], 2026-05-09)
- 4d585464f - fix(server): include Origin in CORS preflight Vary header (#26445) (Kit Langton, 2026-05-08)
- f0cb17a81 - fix(tui): sort session picker by full updated timestamp (#24725) (Jose Vargas, 2026-05-08)
- 357a74714 - fix(test): set OPENCODE_EXPERIMENTAL_WORKSPACES in fence header test (#26466) (Kit Langton, 2026-05-08)
- ffea6c797 - feat(server): add HTTP API response compression (#26440) (Kit Langton, 2026-05-08)
- 8e9550d90 - fix(server): emit fixed workspace fence headers (#26443) (Kit Langton, 2026-05-08)
- 9b7b6cb30 - feat(core): be smarter about generating a worktree name (#26368) (James Long, 2026-05-08)
- cc68afb2d - test(server): lock fixed workspace routing context (#26454) (Kit Langton, 2026-05-08)
- 11c33d52a - test(server): cover REST API project skills (#26451) (Kit Langton, 2026-05-09)
- 2a487ea99 - chore: generate (opencode-agent[bot], 2026-05-09)
- 9c05d4e2f - fix(server): serve HttpApi OpenAPI document (#26438) (Kit Langton, 2026-05-08)
- 0745162ea - test(server): harden HttpApi exercise coverage (#26425) (Kit Langton, 2026-05-08)
- 21d055be1 - fix(workspace): claim detached sessions to source project (#26413) (Kit Langton, 2026-05-08)
- d19f7bc77 - fix(web): normalize shell output carriage returns (#26426) (Luke Parker, 2026-05-09)
- 8694da930 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-08)
- a0fc27e42 - flatten to keybind compatible config (#26421) (Sebastian, 2026-05-09)
- 35deef617 - chore: generate (opencode-agent[bot], 2026-05-08)
- 36f8b7e47 - chore: reduce alerts false positives (vimtor, 2026-05-08)
- f4337dff3 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-08)
- ba8c92063 - chore: generate (opencode-agent[bot], 2026-05-08)
- 5bb7b2344 - Add native LLM core foundation (#24712) (Kit Langton, 2026-05-08)
- dc7d665e9 - chore: generate (opencode-agent[bot], 2026-05-08)
- 40d5ea1cf - feat(core): add scout agent for repo research (#24149) (Shoubhit Dash, 2026-05-08)
- 6e47ae769 - fix(cli): forward signals from npm shim (#26259) (Chris Huber, 2026-05-08)
- 9ca4be62b - chore: generate (opencode-agent[bot], 2026-05-08)
- fed221e0b - fix(skill): allow missing descriptions (#26391) (Dax, 2026-05-08)
- 75308ea47 - test(server): add HttpApi auth exercise mode (#26386) (Kit Langton, 2026-05-08)
- daa3116f4 - refactor(server): split HttpApi exercise harness (#26385) (Kit Langton, 2026-05-08)
- 9e7f7bf8e - chore: generate (opencode-agent[bot], 2026-05-08)
- 4d43d584f - cli/run: switch to global event stream (#26383) (Simon Klee, 2026-05-08)
- 3052a79b3 - refactor(server): clarify HttpApi route auth layers (#26372) (Kit Langton, 2026-05-08)
- 13b3117ca - fix(server): require auth for effect root routes (#26361) (Rajvardhan Patil, 2026-05-08)
- 83bb21648 - fix: ensure tools are always in same order (#26370) (Aiden Cline, 2026-05-08)
- fc46cef5f - chore: generate (opencode-agent[bot], 2026-05-08)
- 799996db7 - fix: adjust tui retry dialog logic to be more provider specific and error case specific (#26366) (Aiden Cline, 2026-05-08)
- df75bfe07 - chore: generate (opencode-agent[bot], 2026-05-08)
- c818c9dcb - feat(core): allow external workspace creation (#26212) (James Long, 2026-05-08)
- c36ab3f93 - fix(provider): align Gemini thinking controls (#26279) (Kit Langton, 2026-05-08)
- e3c983c21 - chore: reduce provider alerts query frequency (vimtor, 2026-05-08)
- a196569f5 - chore: generate (opencode-agent[bot], 2026-05-08)
- 19da27e1c - internal which-key plugin, inactive by default (#26337) (Sebastian, 2026-05-08)
- 4a737493a - Revert "zen: update tpm rate limit algo" (Frank, 2026-05-08)
- ec301f6a2 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-08)
- ac7a885ae - chore: generate (opencode-agent[bot], 2026-05-08)
- 7f2b5ee8c - feat(opencode): add interactive split-footer mode to run (#23557) (Simon Klee, 2026-05-08)
- 15784aa03 - chore: reduce alerts threshold (vimtor, 2026-05-08)
- edbc02855 - chore: generate (opencode-agent[bot], 2026-05-08)
- a43d3e0e1 - feat(websearch): add parallel provider rollout (#26227) (Shoubhit Dash, 2026-05-08)
- ae25278ed - test(session): update go retry fixture (#26312) (Shoubhit Dash, 2026-05-08)
- 6869186fc - zen: update tpm rate limit algo (Frank, 2026-05-08)
- f8c6742e5 - zen: lift default rate limit (Frank, 2026-05-08)
- 014dbd34c - chore: generate (opencode-agent[bot], 2026-05-08)
- 21ae91b4f - refactor(desktop): convert main process to Effect-TS (#26148) (Brendan Allan, 2026-05-08)
- bb3f14119 - tui: update go upsell copy (Frank, 2026-05-08)
- 6f165e23d - perf(ui): defer tool status width measurement (#26282) (Luke Parker, 2026-05-08)
- cef0c8ac8 - chore: generate (opencode-agent[bot], 2026-05-08)
- dd8bb44d1 - refactor(desktop): use electron-log in shell-env and simplify env merging (#26284) (Brendan Allan, 2026-05-08)
- 30868f52e - go: update rate limit error copy (Frank, 2026-05-08)
- 9c8823512 - chore: generate (opencode-agent[bot], 2026-05-08)
- a8a07da8d - Merge branch 'main' into fix/tui-submodule-session-worktree-family (Marian Alexandru Alecu, 2026-05-06)
- 6637a8898 - Merge branch 'main' into fix/tui-submodule-session-worktree-family (Marian Alexandru Alecu, 2026-05-06)
- c1c3af8bf - fix(cli): include working tree in WorktreeFamily.list for submodules (truffle, 2026-04-25)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/notebook.ts` (+2, -1)
- `packages/opencode/src/tool/codesearch.ts` (+63, -0)
- `packages/opencode/src/tool/codesearch.txt` (+12, -0)
- `packages/opencode/src/tool/{mcp-exa.ts => mcp-websearch.ts}` (+34, -6)
- `packages/opencode/src/tool/registry.ts` (+21, -4)
- `packages/opencode/src/tool/repo_clone.ts` (+209, -0)
- `packages/opencode/src/tool/repo_clone.txt` (+5, -0)
- `packages/opencode/src/tool/repo_overview.ts` (+277, -0)
- `packages/opencode/src/tool/repo_overview.txt` (+4, -0)
- `packages/opencode/src/tool/websearch.ts` (+87, -16)
- `packages/opencode/src/tool/websearch.txt` (+3, -3)
- `packages/opencode/test/tool/registry.test.ts` (+29, -2)
- `packages/opencode/test/tool/repo_clone.test.ts` (+226, -0)
- `packages/opencode/test/tool/repo_overview.test.ts` (+150, -0)
- `packages/opencode/test/tool/websearch.test.ts` (+92, -0)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+127, -8)
- `packages/opencode/src/agent/prompt/scout.txt` (+36, -0)
- `packages/opencode/src/kilocode/agent/builder.ts` (+109, -0)
- `packages/opencode/src/kilocode/agent/index.ts` (+10, -0)
- `packages/opencode/test/agent/agent.test.ts` (+113, -18)

#### Permission System (**/permission/)
- `packages/opencode/src/kilocode/permission/routes.ts` (+0, -45)
- `packages/opencode/src/permission/schema.ts` (+1, -1)
- `packages/opencode/test/kilocode/permission/next.reply-http.test.ts` (+3, -30)

#### Event Bus (**/bus/, **/event/)
- `packages/opencode/src/bus/bus-event.ts` (+0, -19)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/flag/flag.ts` (+2, -13)
- `packages/core/src/global.ts` (+4, -0)
- `packages/core/test/effect/cross-spawn-spawner.test.ts` (+7, -1)
- `packages/core/test/global.test.ts` (+1, -1)
- `packages/core/test/util/effect-flock.test.ts` (+18, -12)
- `packages/core/test/util/flock.test.ts` (+19, -14)

#### Other Changes
- `.changeset/calm-background-process-scans.md` (+0, -6)
- `.changeset/calm-kilos-reconnect.md` (+0, -5)
- `.changeset/opus-4-8-adaptive-thinking.md` (+0, -5)
- `.changeset/steady-review-scroll.md` (+0, -5)
- `.github/workflows/test.yml` (+5, -0)
- `.gitignore` (+1, -0)
- `.gitleaksignore` (+5, -0)
- `.opencode-version` (+1, -1)
- `.opencode/opencode.jsonc` (+1, -0)
- `.opencode/plugins/tui-smoke.tsx` (+372, -290)
- `.opencode/tui.json` (+2, -16)
- `bun.lock` (+135, -34)
- `nix/hashes.json` (+4, -4)
- `package.json` (+6, -5)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+26, -0)
- `packages/http-recorder/src/cassette.ts` (+108, -0)
- `packages/http-recorder/src/diff.ts` (+95, -0)
- `packages/http-recorder/src/effect.ts` (+211, -0)
- `packages/http-recorder/src/index.ts` (+10, -0)
- `packages/http-recorder/src/matching.ts` (+36, -0)
- `packages/http-recorder/src/redaction.ts` (+116, -0)
- `packages/http-recorder/src/schema.ts` (+67, -0)
- `packages/http-recorder/src/storage.ts` (+34, -0)
- `packages/http-recorder/src/websocket.ts` (+204, -0)
- `packages/http-recorder/test/fixtures/recordings/record-replay/multi-step.json` (+41, -0)
- `packages/http-recorder/test/fixtures/recordings/record-replay/retry.json` (+41, -0)
- `packages/http-recorder/test/record-replay.test.ts` (+320, -0)
- `packages/http-recorder/tsconfig.json` (+16, -0)
- `packages/kilo-console/index.html` (+12, -0)
- `packages/kilo-console/package.json` (+30, -0)
- `packages/kilo-console/src/App.tsx` (+17, -0)
- `packages/kilo-console/src/client.test.ts` (+38, -0)
- `packages/kilo-console/src/client.ts` (+703, -0)
- `packages/kilo-console/src/components/ConfirmDialog.tsx` (+42, -0)
- `packages/kilo-console/src/components/CustomSelect.tsx` (+65, -0)
- `packages/kilo-console/src/components/SearchField.tsx` (+45, -0)
- `packages/kilo-console/src/components/app-header/AppHeader.tsx` (+26, -0)
- `packages/kilo-console/src/components/app-header/OmniSearch.tsx` (+340, -0)
- `packages/kilo-console/src/components/app-sidebar/AppSidebar.tsx` (+426, -0)
- `packages/kilo-console/src/context/ConfigProvider.tsx` (+158, -0)
- `packages/kilo-console/src/context/config.tsx` (+29, -0)
- `packages/kilo-console/src/index.tsx` (+40, -0)
- `packages/kilo-console/src/layouts/ConfigLayout.tsx` (+54, -0)
- `packages/kilo-console/src/layouts/ConsoleLayout.tsx` (+21, -0)
- `packages/kilo-console/src/routes/config/AgentsRoute.tsx` (+786, -0)
- `packages/kilo-console/src/routes/config/CliNotificationsRoute.tsx` (+91, -0)
- `packages/kilo-console/src/routes/config/CliUiRoute.tsx` (+197, -0)
- `packages/kilo-console/src/routes/config/ConfigPage.tsx` (+43, -0)
- `packages/kilo-console/src/routes/config/ConfigRoute.tsx` (+9, -0)
- `packages/kilo-console/src/routes/config/ConfigSidebar.tsx` (+78, -0)
- `packages/kilo-console/src/routes/config/FormattersRoute.tsx` (+381, -0)
- `packages/kilo-console/src/routes/config/KeybindsRoute.tsx` (+160, -0)
- `packages/kilo-console/src/routes/config/McpRoute.tsx` (+477, -0)
- `packages/kilo-console/src/routes/config/ModelsRoute.tsx` (+449, -0)
- `packages/kilo-console/src/routes/config/OverviewRoute.tsx` (+132, -0)
- `packages/kilo-console/src/routes/config/PermissionsRoute.tsx` (+277, -0)
- `packages/kilo-console/src/routes/config/ProvidersRoute.tsx` (+436, -0)
- `packages/kilo-console/src/routes/config/ServersRoute.tsx` (+128, -0)
- `packages/kilo-console/src/routes/config/SourcesRoute.tsx` (+50, -0)
- `packages/kilo-console/src/routes/config/ToolsRoute.tsx` (+102, -0)
- `packages/kilo-console/src/routes/config/sections.tsx` (+144, -0)
- `packages/kilo-console/src/routes/config/state/agents.ts` (+573, -0)
- `packages/kilo-console/src/routes/config/state/formatters.ts` (+494, -0)
- `packages/kilo-console/src/routes/config/state/keybinds.ts` (+194, -0)
- `packages/kilo-console/src/routes/config/state/mcp.ts` (+669, -0)
- `packages/kilo-console/src/routes/config/state/models.ts` (+248, -0)
- `packages/kilo-console/src/routes/config/state/permissions.ts` (+286, -0)
- `packages/kilo-console/src/routes/config/state/providers.ts` (+432, -0)
- `packages/kilo-console/src/routes/config/state/ui.ts` (+254, -0)
- `packages/kilo-console/src/routes/profile/ProfileRoute.tsx` (+9, -0)
- `packages/kilo-console/src/routes/projects/ProjectConsoleRoute.tsx` (+785, -0)
- `packages/kilo-console/src/routes/projects/ProjectsRoute.tsx` (+202, -0)
- `packages/kilo-console/src/routes/projects/terminal/GhosttyTerminal.tsx` (+364, -0)
- `packages/kilo-console/src/shared/navigation.test.ts` (+19, -0)
- `packages/kilo-console/src/shared/navigation.ts` (+28, -0)
- `packages/kilo-console/src/shared/terminal-status.ts` (+164, -0)
- `packages/kilo-console/src/shared/utils.ts` (+223, -0)
- `packages/kilo-console/src/styles.css` (+17, -0)
- `packages/kilo-console/src/styles/agents-tools.css` (+394, -0)
- `packages/kilo-console/src/styles/base.css` (+149, -0)
- `packages/kilo-console/src/styles/cli-ui.css` (+203, -0)
- `packages/kilo-console/src/styles/config.css` (+281, -0)
- `packages/kilo-console/src/styles/formatters.css` (+90, -0)
- `packages/kilo-console/src/styles/keybinds.css` (+165, -0)
- `packages/kilo-console/src/styles/mcp.css` (+242, -0)
- `packages/kilo-console/src/styles/models.css` (+485, -0)
- `packages/kilo-console/src/styles/overview.css` (+158, -0)
- `packages/kilo-console/src/styles/permissions.css` (+135, -0)
- `packages/kilo-console/src/styles/project-console.css` (+596, -0)
- `packages/kilo-console/src/styles/projects.css` (+170, -0)
- `packages/kilo-console/src/styles/providers.css` (+457, -0)
- `packages/kilo-console/src/styles/resolved.css` (+133, -0)
- `packages/kilo-console/src/styles/responsive.css` (+189, -0)
- `packages/kilo-console/src/styles/servers.css` (+75, -0)
- `packages/kilo-console/src/styles/sources.css` (+36, -0)
- `packages/kilo-console/src/vite-env.d.ts` (+3, -0)
- `packages/kilo-console/tsconfig.json` (+19, -0)
- `packages/kilo-console/vite.config.ts` (+21, -0)
- `packages/kilo-docs/lychee.toml` (+1, -0)
- `packages/kilo-docs/markdoc/partials/cli-commands-table.md` (+3, -0)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/_app.tsx` (+1, -5)
- `packages/kilo-docs/pages/ai-providers/mistral.md` (+1, -1)
- `packages/kilo-docs/pages/ai-providers/openrouter.md` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli-reference.md` (+100, -2)
- `packages/kilo-docs/pages/code-with-ai/platforms/mobile.md` (+2, -2)
- `packages/kilo-docs/pages/contributing/architecture/index.md` (+2, -3)
- `packages/kilo-docs/source-links.md` (+7, -6)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-gateway/src/edit-prompt.ts` (+12, -2)
- `packages/kilo-gateway/src/server/edit.ts` (+10, -2)
- `packages/kilo-gateway/src/tui/types.ts` (+1, -1)
- `packages/kilo-gateway/src/types/tui.d.ts` (+2, -2)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/AGENTS.md` (+3, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendAppService.kt` (+56, -1)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloBackendCliManager.kt` (+11, -5)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/dev/KiloDevMode.kt` (+7, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloAppRpcApiImpl.kt` (+6, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/telemetry/KiloBackendTelemetry.kt` (+74, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/workspace/KiloWorkspaceState.kt` (+1, -1)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/KiloBackendCliManagerEnvTest.kt` (+12, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/telemetry/KiloBackendTelemetryTest.kt` (+76, -0)
- `packages/kilo-jetbrains/build.gradle.kts` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/KiloToolWindowFactory.kt` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/DeleteSessionAction.kt` (+5, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/HistoryAction.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/KiloSettingsAction.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/NewSessionAction.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/ReinstallKiloAction.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/RenameSessionAction.kt` (+15, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/RestartKiloAction.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/ShowProfileAction.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/migration/KiloMigrationService.kt` (+35, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionSidePanelManager.kt` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+8, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionController.kt` (+112, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/history/HistoryController.kt` (+42, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/profile/ProfileUi.kt` (+16, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/telemetry/KiloTelemetryService.kt` (+74, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/PromptLifecycleTest.kt` (+9, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/SessionControllerTestBase.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/TurnLifecycleTest.kt` (+6, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/history/HistoryControllerTest.kt` (+34, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/ConnectionPanelTest.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeAppRpcApi.kt` (+7, -0)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-jetbrains/script/test-ci.ts` (+2, -2)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/KiloPlugin.kt` (+17, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/log/KiloLog.kt` (+28, -6)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloAppRpcApi.kt` (+4, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/SkillDto.kt` (+1, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/TelemetryDto.kt` (+9, -0)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/error-details.tsx` (+3, -1)
- `packages/kilo-ui/src/components/message-part.tsx` (+1, -6)
- `packages/kilo-ui/src/styles/vscode-bridge.css` (+12, -3)
- `packages/kilo-vscode/CHANGELOG.md` (+16, -0)
- `packages/kilo-vscode/package.json` (+2, -1)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/components/settings/permission-utils.ts` (+1, -0)
- `packages/kilo-web-ui/package.json` (+148, -0)
- `packages/kilo-web-ui/src/components/accordion.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/alert-dialog.tsx` (+10, -0)
- `packages/kilo-web-ui/src/components/alert.tsx` (+43, -0)
- `packages/kilo-web-ui/src/components/animated-number.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/app-icon.tsx` (+16, -0)
- `packages/kilo-web-ui/src/components/avatar.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/badge.tsx` (+30, -0)
- `packages/kilo-web-ui/src/components/basic-tool.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/button-group.tsx` (+28, -0)
- `packages/kilo-web-ui/src/components/button.tsx` (+50, -0)
- `packages/kilo-web-ui/src/components/card.tsx` (+113, -0)
- `packages/kilo-web-ui/src/components/chart.tsx` (+41, -0)
- `packages/kilo-web-ui/src/components/checkbox.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/code.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/collapsible.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/combobox.tsx` (+69, -0)
- `packages/kilo-web-ui/src/components/config-row.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/console.tsx` (+200, -0)
- `packages/kilo-web-ui/src/components/context-menu.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/dialog.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/diff-changes.tsx` (+5, -0)
- `packages/kilo-web-ui/src/components/diff-ssr.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/diff.tsx` (+5, -0)
- `packages/kilo-web-ui/src/components/dock-prompt.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/dock-surface.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/dropdown-menu.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/empty.tsx` (+51, -0)
- `packages/kilo-web-ui/src/components/error-details.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/favicon.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/field.tsx` (+106, -0)
- `packages/kilo-web-ui/src/components/file-icon.tsx` (+16, -0)
- `packages/kilo-web-ui/src/components/file.tsx` (+5, -0)
- `packages/kilo-web-ui/src/components/font.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/hover-card.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/icon-button.tsx` (+55, -0)
- `packages/kilo-web-ui/src/components/icon.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/image-preview.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/inline-input.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/input-group.tsx` (+31, -0)
- `packages/kilo-web-ui/src/components/input.tsx` (+13, -0)
- `packages/kilo-web-ui/src/components/item.tsx` (+55, -0)
- `packages/kilo-web-ui/src/components/kbd.tsx` (+19, -0)
- `packages/kilo-web-ui/src/components/keybind.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/label.tsx` (+15, -0)
- `packages/kilo-web-ui/src/components/line-comment-annotations.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/line-comment.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/list.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/logo.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/markdown.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/message-nav.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/message-part.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/motion-spring.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/native-select.tsx` (+28, -0)
- `packages/kilo-web-ui/src/components/page-header.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/popover.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/progress-circle.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/progress.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/provider-icon.tsx` (+37, -0)
- `packages/kilo-web-ui/src/components/radio-group.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/resize-handle.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/scroll-view.tsx` (+15, -0)
- `packages/kilo-web-ui/src/components/select.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/separator.tsx` (+14, -0)
- `packages/kilo-web-ui/src/components/session-diff.ts` (+1, -0)
- `packages/kilo-web-ui/src/components/session-review.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/session-turn.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/sheet.tsx` (+45, -0)
- `packages/kilo-web-ui/src/components/skeleton.tsx` (+13, -0)
- `packages/kilo-web-ui/src/components/slider.tsx` (+21, -0)
- `packages/kilo-web-ui/src/components/sonner.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/source-badge.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/spinner.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/status-tag.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/sticky-accordion-header.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/switch.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/table.tsx` (+26, -0)
- `packages/kilo-web-ui/src/components/tabs.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/tag.tsx` (+30, -0)
- `packages/kilo-web-ui/src/components/text-field.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/text-reveal.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/text-shimmer.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/text-strikethrough.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/textarea.tsx` (+13, -0)
- `packages/kilo-web-ui/src/components/toast.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/toggle-group.tsx` (+42, -0)
- `packages/kilo-web-ui/src/components/toggle.tsx` (+23, -0)
- `packages/kilo-web-ui/src/components/tooltip.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/typewriter.tsx` (+1, -0)
- `packages/kilo-web-ui/src/components/utils.ts` (+16, -0)
- `packages/kilo-web-ui/src/context/code.tsx` (+1, -0)
- `packages/kilo-web-ui/src/context/data.tsx` (+1, -0)
- `packages/kilo-web-ui/src/context/dialog.tsx` (+1, -0)
- `packages/kilo-web-ui/src/context/diff.tsx` (+1, -0)
- `packages/kilo-web-ui/src/context/file.tsx` (+1, -0)
- `packages/kilo-web-ui/src/context/helper.tsx` (+1, -0)
- `packages/kilo-web-ui/src/context/i18n.tsx` (+1, -0)
- `packages/kilo-web-ui/src/context/index.ts` (+1, -0)
- `packages/kilo-web-ui/src/context/marked.tsx` (+1, -0)
- `packages/kilo-web-ui/src/context/worker-pool.tsx` (+1, -0)
- `packages/kilo-web-ui/src/hooks/index.ts` (+1, -0)
- `packages/kilo-web-ui/src/i18n/ar.ts` (+1, -0)
- `packages/kilo-web-ui/src/i18n/br.ts` (+1, -0)
- `packages/kilo-web-ui/src/i18n/bs.ts` (+1, -0)
- `packages/kilo-web-ui/src/i18n/da.ts` (+1, -0)
- `packages/kilo-web-ui/src/i18n/de.ts` (+1, -0)
- `packages/kilo-web-ui/src/i18n/en.ts` (+1, -0)
- `packages/kilo-web-ui/src/i18n/es.ts` (+1, -0)
- `packages/kilo-web-ui/src/i18n/fr.ts` (+1, -0)
- `packages/kilo-web-ui/src/i18n/ja.ts` (+1, -0)
- `packages/kilo-web-ui/src/i18n/ko.ts` (+1, -0)
- `packages/kilo-web-ui/src/i18n/nl.ts` (+1, -0)
- `packages/kilo-web-ui/src/i18n/no.ts` (+1, -0)
- `packages/kilo-web-ui/src/i18n/pl.ts` (+1, -0)
- `packages/kilo-web-ui/src/i18n/ru.ts` (+1, -0)
- `packages/kilo-web-ui/src/i18n/th.ts` (+1, -0)
- `packages/kilo-web-ui/src/i18n/tr.ts` (+1, -0)
- `packages/kilo-web-ui/src/i18n/uk.ts` (+1, -0)
- `packages/kilo-web-ui/src/i18n/zh.ts` (+1, -0)
- `packages/kilo-web-ui/src/i18n/zht.ts` (+1, -0)
- `packages/kilo-web-ui/src/icons/app.ts` (+1, -0)
- `packages/kilo-web-ui/src/icons/file-type.ts` (+1, -0)
- `packages/kilo-web-ui/src/icons/provider.ts` (+1, -0)
- `packages/kilo-web-ui/src/index.ts` (+3, -0)
- `packages/kilo-web-ui/src/lucide.ts` (+1, -0)
- `packages/kilo-web-ui/src/pierre/index.ts` (+1, -0)
- `packages/kilo-web-ui/src/pierre/selection-bridge.ts` (+1, -0)
- `packages/kilo-web-ui/src/pierre/worker.ts` (+1, -0)
- `packages/kilo-web-ui/src/styles/button.css` (+125, -0)
- `packages/kilo-web-ui/src/styles/card.css` (+51, -0)
- `packages/kilo-web-ui/src/styles/console-shell.css` (+637, -0)
- `packages/kilo-web-ui/src/styles/console.css` (+192, -0)
- `packages/kilo-web-ui/src/styles/form.css` (+100, -0)
- `packages/kilo-web-ui/src/styles/index.css` (+12, -0)
- `packages/kilo-web-ui/src/styles/keyboard.css` (+22, -0)
- `packages/kilo-web-ui/src/styles/misc.css` (+35, -0)
- `packages/kilo-web-ui/src/styles/responsive.css` (+96, -0)
- `packages/kilo-web-ui/src/styles/sheet.css` (+26, -0)
- `packages/kilo-web-ui/src/styles/tag.css` (+53, -0)
- `packages/kilo-web-ui/src/styles/tailwind/index.css` (+1, -0)
- `packages/kilo-web-ui/src/styles/theme.css` (+140, -0)
- `packages/kilo-web-ui/src/theme/color.ts` (+1, -0)
- `packages/kilo-web-ui/src/theme/context.tsx` (+1, -0)
- `packages/kilo-web-ui/src/theme/default-themes.ts` (+1, -0)
- `packages/kilo-web-ui/src/theme/index.ts` (+1, -0)
- `packages/kilo-web-ui/src/theme/loader.ts` (+1, -0)
- `packages/kilo-web-ui/src/theme/resolve.ts` (+1, -0)
- `packages/kilo-web-ui/src/theme/types.ts` (+1, -0)
- `packages/kilo-web-ui/src/vite-env.d.ts` (+14, -0)
- `packages/kilo-web-ui/tsconfig.json` (+18, -0)
- `packages/llm/AGENTS.md` (+294, -0)
- `packages/llm/example/tutorial.ts` (+242, -0)
- `packages/llm/package.json` (+51, -0)
- `packages/llm/script/recording-cost-report.ts` (+250, -0)
- `packages/llm/script/setup-recording-env.ts` (+542, -0)
- `packages/llm/src/index.ts` (+35, -0)
- `packages/llm/src/llm.ts` (+219, -0)
- `packages/llm/src/protocols/anthropic-messages.ts` (+592, -0)
- `packages/llm/src/protocols/bedrock-converse.ts` (+531, -0)
- `packages/llm/src/protocols/bedrock-event-stream.ts` (+87, -0)
- `packages/llm/src/protocols/gemini.ts` (+397, -0)
- `packages/llm/src/protocols/index.ts` (+6, -0)
- `packages/llm/src/protocols/openai-chat.ts` (+404, -0)
- `packages/llm/src/protocols/openai-compatible-chat.ts` (+28, -0)
- `packages/llm/src/protocols/openai-responses.ts` (+575, -0)
- `packages/llm/src/protocols/shared.ts` (+203, -0)
- `packages/llm/src/protocols/utils/bedrock-auth.ts` (+103, -0)
- `packages/llm/src/protocols/utils/bedrock-cache.ts` (+20, -0)
- `packages/llm/src/protocols/utils/bedrock-media.ts` (+80, -0)
- `packages/llm/src/protocols/utils/gemini-tool-schema.ts` (+101, -0)
- `packages/llm/src/protocols/utils/openai-options.ts` (+55, -0)
- `packages/llm/src/protocols/utils/tool-stream.ts` (+196, -0)
- `packages/llm/src/provider.ts` (+31, -0)
- `packages/llm/src/providers/amazon-bedrock.ts` (+48, -0)
- `packages/llm/src/providers/anthropic.ts` (+18, -0)
- `packages/llm/src/providers/azure.ts` (+83, -0)
- `packages/llm/src/providers/cloudflare.ts` (+139, -0)
- `packages/llm/src/providers/github-copilot.ts` (+48, -0)
- `packages/llm/src/providers/google.ts` (+18, -0)
- `packages/llm/src/providers/index.ts` (+10, -0)
- `packages/llm/src/providers/openai-compatible-profile.ts` (+20, -0)
- `packages/llm/src/providers/openai-compatible.ts` (+61, -0)
- `packages/llm/src/providers/openai-options.ts` (+70, -0)
- `packages/llm/src/providers/openai.ts` (+53, -0)
- `packages/llm/src/providers/openrouter.ts` (+88, -0)
- `packages/llm/src/providers/xai.ts` (+52, -0)
- `packages/llm/src/route/auth-options.ts` (+57, -0)
- `packages/llm/src/route/auth.ts` (+197, -0)
- `packages/llm/src/route/client.ts` (+526, -0)
- `packages/llm/src/route/endpoint.ts` (+39, -0)
- `packages/llm/src/route/executor.ts` (+374, -0)
- `packages/llm/src/route/framing.ts` (+27, -0)
- `packages/llm/src/route/index.ts` (+26, -0)
- `packages/llm/src/route/protocol.ts` (+84, -0)
- `packages/llm/src/route/transport/http.ts` (+122, -0)
- `packages/llm/src/route/transport/index.ts` (+22, -0)
- `packages/llm/src/route/transport/websocket.ts` (+282, -0)
- `packages/llm/src/schema/errors.ts` (+202, -0)
- `packages/llm/src/schema/events.ts` (+237, -0)
- `packages/llm/src/schema/ids.ts` (+34, -0)
- `packages/llm/src/schema/index.ts` (+5, -0)
- `packages/llm/src/schema/messages.ts` (+234, -0)
- `packages/llm/src/schema/options.ts` (+202, -0)
- `packages/llm/src/tool-runtime.ts` (+240, -0)
- `packages/llm/src/tool.ts` (+185, -0)
- `packages/llm/test/adapter.test.ts` (+175, -0)
- `packages/llm/test/auth-options.types.ts` (+100, -0)
- `packages/llm/test/auth.test.ts` (+101, -0)
- `packages/llm/test/endpoint.test.ts` (+54, -0)
- `packages/llm/test/executor.test.ts` (+416, -0)
- `packages/llm/test/exports.test.ts` (+56, -0)
- `packages/llm/test/fixtures/recordings/anthropic-messages/accepts-malformed-assistant-tool-order-with-default-patch.json` (+29, -0)
- `packages/llm/test/fixtures/recordings/anthropic-messages/claude-opus-4-7-drives-a-tool-loop.json` (+56, -0)
- `packages/llm/test/fixtures/recordings/anthropic-messages/rejects-malformed-assistant-tool-order-without-patch.json` (+29, -0)
- `packages/llm/test/fixtures/recordings/anthropic-messages/streams-text.json` (+29, -0)
- `packages/llm/test/fixtures/recordings/anthropic-messages/streams-tool-call.json` (+29, -0)
- `packages/llm/test/fixtures/recordings/bedrock-converse/drives-a-tool-loop.json` (+55, -0)
- `packages/llm/test/fixtures/recordings/bedrock-converse/streams-a-tool-call.json` (+29, -0)
- `packages/llm/test/fixtures/recordings/bedrock-converse/streams-text.json` (+29, -0)
- `packages/llm/test/fixtures/recordings/cloudflare-ai-gateway/cloudflare-ai-gateway-workers-ai-gpt-oss-20b-tools-tool-call.json` (+32, -0)
- `packages/llm/test/fixtures/recordings/cloudflare-ai-gateway/cloudflare-ai-gateway-workers-ai-llama-3-1-8b-text.json` (+32, -0)
- `packages/llm/test/fixtures/recordings/cloudflare-workers-ai/cloudflare-workers-ai-gpt-oss-20b-tools-tool-call.json` (+32, -0)
- `packages/llm/test/fixtures/recordings/cloudflare-workers-ai/cloudflare-workers-ai-llama-3-1-8b-text.json` (+32, -0)
- `packages/llm/test/fixtures/recordings/gemini/streams-text.json` (+28, -0)
- `packages/llm/test/fixtures/recordings/gemini/streams-tool-call.json` (+28, -0)
- `packages/llm/test/fixtures/recordings/openai-chat/continues-after-tool-result.json` (+28, -0)
- `packages/llm/test/fixtures/recordings/openai-chat/drives-a-tool-loop-end-to-end.json` (+46, -0)
- `packages/llm/test/fixtures/recordings/openai-chat/streams-text.json` (+28, -0)
- `packages/llm/test/fixtures/recordings/openai-chat/streams-tool-call.json` (+28, -0)
- `packages/llm/test/fixtures/recordings/openai-compatible-chat/deepseek-streams-text.json` (+28, -0)
- `packages/llm/test/fixtures/recordings/openai-compatible-chat/groq-llama-3-3-70b-drives-a-tool-loop.json` (+53, -0)
- `packages/llm/test/fixtures/recordings/openai-compatible-chat/groq-streams-text.json` (+28, -0)
- `packages/llm/test/fixtures/recordings/openai-compatible-chat/groq-streams-tool-call.json` (+28, -0)
- `packages/llm/test/fixtures/recordings/openai-compatible-chat/openrouter-claude-opus-4-7-drives-a-tool-loop.json` (+54, -0)
- `packages/llm/test/fixtures/recordings/openai-compatible-chat/openrouter-gpt-4o-mini-drives-a-tool-loop.json` (+53, -0)
- `packages/llm/test/fixtures/recordings/openai-compatible-chat/openrouter-gpt-5-5-drives-a-tool-loop.json` (+54, -0)
- `packages/llm/test/fixtures/recordings/openai-compatible-chat/openrouter-streams-text.json` (+28, -0)
- `packages/llm/test/fixtures/recordings/openai-compatible-chat/openrouter-streams-tool-call.json` (+28, -0)
- `packages/llm/test/fixtures/recordings/openai-compatible-chat/togetherai-streams-text.json` (+28, -0)
- `packages/llm/test/fixtures/recordings/openai-compatible-chat/togetherai-streams-tool-call.json` (+28, -0)
- `packages/llm/test/fixtures/recordings/openai-responses/gpt-5-5-drives-a-tool-loop.json` (+54, -0)
- `packages/llm/test/fixtures/recordings/openai-responses/gpt-5-5-streams-text.json` (+28, -0)
- `packages/llm/test/fixtures/recordings/openai-responses/gpt-5-5-streams-tool-call.json` (+28, -0)
- `packages/llm/test/generate-object.test.ts` (+185, -0)
- `packages/llm/test/lib/effect.ts` (+50, -0)
- `packages/llm/test/lib/http.ts` (+96, -0)
- `packages/llm/test/lib/openai-chunks.ts` (+27, -0)
- `packages/llm/test/lib/sse.ts` (+17, -0)
- `packages/llm/test/lib/tool-runtime.ts` (+9, -0)
- `packages/llm/test/llm.test.ts` (+135, -0)
- `packages/llm/test/provider.types.ts` (+39, -0)
- `packages/llm/test/provider/anthropic-messages.recorded.test.ts` (+46, -0)
- `packages/llm/test/provider/anthropic-messages.test.ts` (+377, -0)
- `packages/llm/test/provider/bedrock-converse.test.ts` (+533, -0)
- `packages/llm/test/provider/cloudflare.test.ts` (+230, -0)
- `packages/llm/test/provider/gemini.test.ts` (+360, -0)
- `packages/llm/test/provider/golden.recorded.test.ts` (+215, -0)
- `packages/llm/test/provider/openai-chat.test.ts` (+358, -0)
- `packages/llm/test/provider/openai-compatible-chat.test.ts` (+237, -0)
- `packages/llm/test/provider/openai-responses.test.ts` (+553, -0)
- `packages/llm/test/provider/openrouter.test.ts` (+56, -0)
- `packages/llm/test/recorded-golden.ts` (+103, -0)
- `packages/llm/test/recorded-runner.ts` (+100, -0)
- `packages/llm/test/recorded-scenarios.ts` (+265, -0)
- `packages/llm/test/recorded-test.ts` (+76, -0)
- `packages/llm/test/recorded-utils.ts` (+56, -0)
- `packages/llm/test/recorded-websocket.ts` (+27, -0)
- `packages/llm/test/schema.test.ts` (+50, -0)
- `packages/llm/test/tool-runtime.test.ts` (+454, -0)
- `packages/llm/test/tool-stream.test.ts` (+88, -0)
- `packages/llm/test/tool.types.ts` (+29, -0)
- `packages/llm/tsconfig.json` (+16, -0)
- `packages/opencode/CHANGELOG.md` (+28, -0)
- `packages/opencode/bin/kilo` (+63, -27)
- `packages/opencode/migration/20260504145000_add_sync_owner/snapshot.json` (+38, -18)
- `packages/opencode/migration/20260507164347_add_workspace_time/migration.sql` (+1, -0)
- `packages/opencode/migration/20260507164347_add_workspace_time/snapshot.json` (+1459, -0)
- `packages/opencode/package.json` (+3, -7)
- `packages/opencode/script/build.ts` (+28, -0)
- `packages/opencode/script/httpapi-exercise.ts` (+1, -2014)
- `packages/opencode/script/schema.ts` (+1, -1)
- `packages/opencode/scripts/diff-sdk-types.sh` (+0, -52)
- `packages/opencode/specs/effect/http-api.md` (+0, -401)
- `packages/opencode/specs/effect/server-package.md` (+3, -5)
- `packages/opencode/specs/tui-plugins.md` (+45, -31)
- `packages/opencode/specs/v2/keymappings.md` (+0, -10)
- `packages/opencode/src/acp/agent.ts` (+6, -0)
- `packages/opencode/src/cli/cmd/generate.ts` (+7, -19)
- `packages/opencode/src/cli/cmd/github.ts` (+2, -12)
- `packages/opencode/src/cli/cmd/run.ts` (+525, -343)
- `packages/opencode/src/cli/cmd/run/demo.ts` (+1274, -0)
- `packages/opencode/src/cli/cmd/run/entry.body.ts` (+194, -0)
- `packages/opencode/src/cli/cmd/run/footer.command.tsx` (+641, -0)
- `packages/opencode/src/cli/cmd/run/footer.menu.tsx` (+306, -0)
- `packages/opencode/src/cli/cmd/run/footer.permission.tsx` (+478, -0)
- `packages/opencode/src/cli/cmd/run/footer.prompt.tsx` (+1108, -0)
- `packages/opencode/src/cli/cmd/run/footer.question.tsx` (+582, -0)
- `packages/opencode/src/cli/cmd/run/footer.subagent.tsx` (+191, -0)
- `packages/opencode/src/cli/cmd/run/footer.ts` (+893, -0)
- `packages/opencode/src/cli/cmd/run/footer.view.tsx` (+719, -0)
- `packages/opencode/src/cli/cmd/run/keymap.shared.ts` (+154, -0)
- `packages/opencode/src/cli/cmd/run/otel.ts` (+117, -0)
- `packages/opencode/src/cli/cmd/run/permission.shared.ts` (+256, -0)
- `packages/opencode/src/cli/cmd/run/prompt.shared.ts` (+326, -0)
- `packages/opencode/src/cli/cmd/run/question.shared.ts` (+340, -0)
- `packages/opencode/src/cli/cmd/run/runtime.boot.ts` (+222, -0)
- `packages/opencode/src/cli/cmd/run/runtime.lifecycle.ts` (+313, -0)
- `packages/opencode/src/cli/cmd/run/runtime.queue.ts` (+293, -0)
- `packages/opencode/src/cli/cmd/run/runtime.shared.ts` (+17, -0)
- `packages/opencode/src/cli/cmd/run/runtime.stdin.ts` (+37, -0)
- `packages/opencode/src/cli/cmd/run/runtime.ts` (+791, -0)
- `packages/opencode/src/cli/cmd/run/scrollback.shared.ts` (+92, -0)
- `packages/opencode/src/cli/cmd/run/scrollback.surface.ts` (+390, -0)
- `packages/opencode/src/cli/cmd/run/scrollback.writer.tsx` (+335, -0)
- `packages/opencode/src/cli/cmd/run/session-data.ts` (+967, -0)
- `packages/opencode/src/cli/cmd/run/session.shared.ts` (+196, -0)
- `packages/opencode/src/cli/cmd/run/splash.ts` (+310, -0)
- `packages/opencode/src/cli/cmd/run/stream.transport.ts` (+1064, -0)
- `packages/opencode/src/cli/cmd/run/stream.ts` (+175, -0)
- `packages/opencode/src/cli/cmd/run/subagent-data.ts` (+825, -0)
- `packages/opencode/src/cli/cmd/run/theme.ts` (+599, -0)
- `packages/opencode/src/cli/cmd/run/tool.ts` (+1460, -0)
- `packages/opencode/src/cli/cmd/run/trace.ts` (+94, -0)
- `packages/opencode/src/cli/cmd/run/types.ts` (+317, -0)
- `packages/opencode/src/cli/cmd/run/variant.shared.ts` (+215, -0)
- `packages/opencode/src/cli/cmd/tui/app.tsx` (+459, -448)
- `packages/opencode/src/cli/cmd/tui/attach.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/component/bg-pulse-render.ts` (+436, -0)
- `packages/opencode/src/cli/cmd/tui/component/bg-pulse.tsx` (+82, -113)
- `packages/opencode/src/cli/cmd/tui/component/dialog-command.tsx` (+0, -172)
- `packages/opencode/src/cli/cmd/tui/component/dialog-go-upsell.tsx` (+0, -159)
- `packages/opencode/src/cli/cmd/tui/component/dialog-mcp.tsx` (+3, -4)
- `packages/opencode/src/cli/cmd/tui/component/dialog-model.tsx` (+3, -5)
- `packages/opencode/src/cli/cmd/tui/component/dialog-provider.tsx` (+17, -9)
- `packages/opencode/src/cli/cmd/tui/component/dialog-retry-action.tsx` (+160, -0)
- `packages/opencode/src/cli/cmd/tui/component/dialog-session-delete-failed.tsx` (+10, -14)
- `packages/opencode/src/cli/cmd/tui/component/dialog-session-list.tsx` (+33, -15)
- `packages/opencode/src/cli/cmd/tui/component/dialog-stash.tsx` (+5, -5)
- `packages/opencode/src/cli/cmd/tui/component/dialog-workspace-create.tsx` (+8, -13)
- `packages/opencode/src/cli/cmd/tui/component/dialog-workspace-unavailable.tsx` (+8, -20)
- `packages/opencode/src/cli/cmd/tui/component/prompt/autocomplete.tsx` (+82, -79)
- `packages/opencode/src/cli/cmd/tui/component/prompt/index.tsx` (+424, -287)
- `packages/opencode/src/cli/cmd/tui/component/prompt/traits.ts` (+8, -1)
- `packages/opencode/src/cli/cmd/tui/component/spinner.tsx` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/component/textarea-keybindings.ts` (+0, -73)
- `packages/opencode/src/cli/cmd/tui/config/keybind.ts` (+394, -0)
- `packages/opencode/src/cli/cmd/tui/config/tui-schema.ts` (+18, -10)
- `packages/opencode/src/cli/cmd/tui/config/tui.ts` (+55, -26)
- `packages/opencode/src/cli/cmd/tui/context/command-palette.tsx` (+163, -0)
- `packages/opencode/src/cli/cmd/tui/context/keybind.tsx` (+0, -105)
- `packages/opencode/src/cli/cmd/tui/context/plugin-keybinds.ts` (+0, -41)
- `packages/opencode/src/cli/cmd/tui/context/theme.tsx` (+5, -3)
- `packages/opencode/src/cli/cmd/tui/context/theme/kilo-v1.json` (+245, -0)
- `packages/opencode/src/cli/cmd/tui/context/theme/kilo.json` (+107, -102)
- `packages/opencode/src/cli/cmd/tui/context/tui-config.tsx` (+5, -8)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/home/footer.tsx` (+3, -2)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/home/tips.tsx` (+22, -18)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/sidebar/context.tsx` (+3, -2)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/sidebar/files.tsx` (+3, -2)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/sidebar/footer.tsx` (+3, -2)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/sidebar/lsp.tsx` (+5, -6)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/sidebar/mcp.tsx` (+3, -2)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/sidebar/todo.tsx` (+3, -2)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/system/plugins.tsx` (+34, -35)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/system/session-v2.tsx` (+43, -26)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/system/which-key.tsx` (+608, -0)
- `packages/opencode/src/cli/cmd/tui/keymap.tsx` (+142, -0)
- `packages/opencode/src/cli/cmd/tui/plugin/api.tsx` (+10, -27)
- `packages/opencode/src/cli/cmd/tui/plugin/internal.ts` (+4, -1)
- `packages/opencode/src/cli/cmd/tui/plugin/runtime.ts` (+66, -21)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+168, -112)
- `packages/opencode/src/cli/cmd/tui/routes/session/network.tsx` (+11, -15)
- `packages/opencode/src/cli/cmd/tui/routes/session/permission.tsx` (+116, -61)
- `packages/opencode/src/cli/cmd/tui/routes/session/question.tsx` (+144, -125)
- `packages/opencode/src/cli/cmd/tui/routes/session/subagent-footer.tsx` (+34, -10)
- `packages/opencode/src/cli/cmd/tui/thread.ts` (+22, -6)
- `packages/opencode/src/cli/cmd/tui/ui/dialog-alert.tsx` (+21, -11)
- `packages/opencode/src/cli/cmd/tui/ui/dialog-confirm.tsx` (+32, -15)
- `packages/opencode/src/cli/cmd/tui/ui/dialog-export-options.tsx` (+67, -39)
- `packages/opencode/src/cli/cmd/tui/ui/dialog-help.tsx` (+9, -11)
- `packages/opencode/src/cli/cmd/tui/ui/dialog-prompt.tsx` (+0, -16)
- `packages/opencode/src/cli/cmd/tui/ui/dialog-select.tsx` (+142, -40)
- `packages/opencode/src/cli/cmd/tui/ui/dialog.tsx` (+39, -20)
- `packages/opencode/src/cli/cmd/tui/ui/link.tsx` (+6, -0)
- `packages/opencode/src/cli/cmd/tui/util/scroll.ts` (+3, -1)
- `packages/opencode/src/cli/cmd/tui/util/selection.ts` (+41, -1)
- `packages/opencode/src/command/template/review.txt` (+1, -1)
- `packages/opencode/src/config/agent.ts` (+3, -1)
- `packages/opencode/src/config/config.ts` (+54, -5)
- `packages/opencode/src/config/keybinds.ts` (+0, -132)
- `packages/opencode/src/config/mcp.ts` (+10, -3)
- `packages/opencode/src/config/permission.ts` (+3, -0)
- `packages/opencode/src/config/reference.ts` (+27, -0)
- `packages/opencode/src/control-plane/adapters/index.ts` (+8, -12)
- `packages/opencode/src/control-plane/adapters/worktree.ts` (+19, -4)
- `packages/opencode/src/control-plane/types.ts` (+10, -7)
- `packages/opencode/src/control-plane/workspace.sql.ts` (+4, -1)
- `packages/opencode/src/control-plane/workspace.ts` (+91, -14)
- `packages/opencode/src/index.ts` (+6, -0)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+7, -7)
- `packages/opencode/src/kilocode/background-process/index.ts` (+40, -31)
- `packages/opencode/src/kilocode/background-process/ports.ts` (+15, -4)
- `packages/opencode/src/kilocode/claw/autocomplete.tsx` (+30, -50)
- `packages/opencode/src/kilocode/claw/chat.tsx` (+1, -8)
- `packages/opencode/src/kilocode/claw/dialog-conversation-list.tsx` (+8, -10)
- `packages/opencode/src/kilocode/claw/view.tsx` (+31, -34)
- `packages/opencode/src/kilocode/cli/cmd/console.ts` (+54, -0)
- `packages/opencode/src/kilocode/cli/cmd/daemon.ts` (+118, -0)
- `packages/opencode/src/kilocode/cli/cmd/profile.ts` (+102, -0)
- `packages/opencode/src/kilocode/cli/cmd/run-message.ts` (+11, -0)
- `packages/opencode/src/kilocode/cli/cmd/run.ts` (+19, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/app.tsx` (+60, -33)
- `packages/opencode/src/kilocode/cli/cmd/tui/component/dialog-process-list.tsx` (+42, -53)
- `packages/opencode/src/kilocode/cli/cmd/tui/context/tui-config-hot-reload.ts` (+49, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/context/tui-config.tsx` (+51, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/thread.ts` (+86, -0)
- `packages/opencode/src/kilocode/commands.ts` (+6, -0)
- `packages/opencode/src/kilocode/commit-message/generate.ts` (+4, -1)
- `packages/opencode/src/kilocode/config/config.ts` (+2, -2)
- `packages/opencode/src/kilocode/config/global-stamp.ts` (+23, -0)
- `packages/opencode/src/kilocode/config/model-state.ts` (+97, -0)
- `packages/opencode/src/kilocode/config/overlay.ts` (+294, -0)
- `packages/opencode/src/kilocode/config/sources.ts` (+315, -0)
- `packages/opencode/src/kilocode/console/assets.ts` (+136, -0)
- `packages/opencode/src/kilocode/daemon/client.ts` (+38, -0)
- `packages/opencode/src/kilocode/daemon/daemon.ts` (+355, -0)
- `packages/opencode/src/kilocode/kilo-commands.tsx` (+191, -183)
- `packages/opencode/src/kilocode/plugins/home-news.tsx` (+19, -12)
- `packages/opencode/src/kilocode/plugins/sidebar-background-processes.tsx` (+1, -3)
- `packages/opencode/src/kilocode/pty/self-command.ts` (+57, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/agent-builder.ts` (+82, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/config-console.ts` (+253, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/kilo-gateway.ts` (+1, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/agent-builder.ts` (+43, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/config-console.ts` (+192, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilo-gateway.ts` (+7, -4)
- `packages/opencode/src/kilocode/server/httpapi/instance.ts` (+0, -57)
- `packages/opencode/src/kilocode/server/httpapi/public.ts` (+51, -11)
- `packages/opencode/src/kilocode/server/httpapi/server.ts` (+4, -0)
- `packages/opencode/src/kilocode/server/instance.ts` (+0, -72)
- `packages/opencode/src/kilocode/server/provider-auth-lifecycle.ts` (+9, -0)
- `packages/opencode/src/kilocode/server/router.ts` (+0, -6)
- `packages/opencode/src/kilocode/server/routes/background-process.ts` (+0, -130)
- `packages/opencode/src/kilocode/server/routes/commit-message.ts` (+0, -49)
- `packages/opencode/src/kilocode/server/routes/config-rules.ts` (+46, -0)
- `packages/opencode/src/kilocode/server/routes/indexing.ts` (+0, -11)
- `packages/opencode/src/kilocode/server/server.ts` (+0, -15)
- `packages/opencode/src/kilocode/session-import/routes.ts` (+0, -94)
- `packages/opencode/src/kilocode/session/index.ts` (+1, -1)
- `packages/opencode/src/kilocode/session/processor.ts` (+2, -1)
- `packages/opencode/src/kilocode/session/prompt.ts` (+20, -0)
- `packages/opencode/src/kilocode/skills/kilo-config.md` (+2, -0)
- `packages/opencode/src/kilocode/suggestion/routes.ts` (+0, -100)
- `packages/opencode/src/kilocode/suggestion/tui/prompt.tsx` (+44, -44)
- `packages/opencode/src/kilocode/tui/config.ts` (+142, -0)
- `packages/opencode/src/kilocode/tui/keybinds.ts` (+71, -0)
- `packages/opencode/src/kilocode/worktree-family.ts` (+7, -1)
- `packages/opencode/src/plugin/xai.ts` (+4, -1)
- `packages/opencode/src/provider/transform.ts` (+133, -45)
- `packages/opencode/src/pty/index.ts` (+14, -3)
- `packages/opencode/src/question/index.ts` (+4, -1)
- `packages/opencode/src/question/schema.ts` (+1, -1)
- `packages/opencode/src/server/adapter.bun.ts` (+0, -44)
- `packages/opencode/src/server/adapter.node.ts` (+0, -75)
- `packages/opencode/src/server/adapter.ts` (+0, -26)
- `packages/opencode/src/server/backend.ts` (+0, -32)
- `packages/opencode/src/server/error.ts` (+0, -39)
- `packages/opencode/src/server/fence.ts` (+0, -20)
- `packages/opencode/src/server/httpapi-server.node.ts` (+2, -1)
- `packages/opencode/src/server/middleware.ts` (+0, -92)
- `packages/opencode/src/server/proxy.ts` (+0, -153)
- `packages/opencode/src/server/routes/control/index.ts` (+0, -163)
- `packages/opencode/src/server/routes/control/workspace.ts` (+0, -211)
- `packages/opencode/src/server/routes/global.ts` (+0, -301)
- `packages/opencode/src/server/routes/instance/AGENTS.md` (+0, -8)
- `packages/opencode/src/server/routes/instance/config.ts` (+0, -157)
- `packages/opencode/src/server/routes/instance/enhance-prompt.ts` (+0, -40)
- `packages/opencode/src/server/routes/instance/event.ts` (+0, -103)
- `packages/opencode/src/server/routes/instance/experimental.ts` (+0, -564)
- `packages/opencode/src/server/routes/instance/file.ts` (+0, -190)
- `packages/opencode/src/server/routes/instance/httpapi/api.ts` (+10, -3)
- `packages/opencode/src/server/routes/instance/httpapi/event.ts` (+30, -23)
- `packages/opencode/src/server/routes/instance/httpapi/groups/experimental.ts` (+2, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/permission.ts` (+3, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/session.ts` (+2, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/tui.ts` (+1, -4)
- `packages/opencode/src/server/routes/instance/httpapi/groups/workspace.ts` (+10, -0)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/config.ts` (+20, -2)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/control.ts` (+3, -0)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/experimental.ts` (+8, -2)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/permission.ts` (+4, -3)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/provider.ts` (+4, -2)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/pty.ts` (+6, -0)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/session.ts` (+9, -2)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/workspace.ts` (+6, -1)
- `packages/opencode/src/server/routes/instance/httpapi/lifecycle.ts` (+6, -1)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/authorization.ts` (+7, -2)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/compression.ts` (+64, -0)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/cors-vary.ts` (+29, -0)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/error.ts` (+26, -0)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/fence.ts` (+20, -0)
- `packages/opencode/src/server/routes/instance/httpapi/public.ts` (+3, -2)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+42, -9)
- `packages/opencode/src/server/routes/instance/index.ts` (+0, -513)
- `packages/opencode/src/server/routes/instance/kilocode.ts` (+0, -99)
- `packages/opencode/src/server/routes/instance/mcp.ts` (+0, -277)
- `packages/opencode/src/server/routes/instance/middleware.ts` (+0, -32)
- `packages/opencode/src/server/routes/instance/network.ts` (+0, -94)
- `packages/opencode/src/server/routes/instance/permission.ts` (+0, -135)
- `packages/opencode/src/server/routes/instance/project.ts` (+0, -122)
- `packages/opencode/src/server/routes/instance/provider.ts` (+0, -174)
- `packages/opencode/src/server/routes/instance/pty.ts` (+0, -340)
- `packages/opencode/src/server/routes/instance/question.ts` (+0, -129)
- `packages/opencode/src/server/routes/instance/remote.ts` (+0, -84)
- `packages/opencode/src/server/routes/instance/session.ts` (+0, -1153)
- `packages/opencode/src/server/routes/instance/suggestion.ts` (+0, -2)
- `packages/opencode/src/server/routes/instance/sync.ts` (+0, -199)
- `packages/opencode/src/server/routes/instance/telemetry.ts` (+0, -74)
- `packages/opencode/src/server/routes/instance/trace.ts` (+0, -59)
- `packages/opencode/src/server/routes/instance/tui.ts` (+0, -387)
- `packages/opencode/src/server/routes/ui.ts` (+0, -31)
- `packages/opencode/src/server/server.ts` (+23, -205)
- `packages/opencode/src/server/shared/tui-control.ts` (+5, -5)
- `packages/opencode/src/server/shared/ui.ts` (+12, -0)
- `packages/opencode/src/server/workspace.ts` (+0, -93)
- `packages/opencode/src/session/llm.ts` (+6, -5)
- `packages/opencode/src/session/message-v2.ts` (+21, -32)
- `packages/opencode/src/session/processor.ts` (+2, -0)
- `packages/opencode/src/session/projectors.ts` (+5, -0)
- `packages/opencode/src/session/prompt.ts` (+356, -353)
- `packages/opencode/src/session/retry.ts` (+45, -28)
- `packages/opencode/src/session/status.ts` (+10, -0)
- `packages/opencode/src/skill/index.ts` (+7, -6)
- `packages/opencode/src/sync/index.ts` (+0, -22)
- `packages/opencode/src/util/keybind.ts` (+0, -103)
- `packages/opencode/src/util/repository.ts` (+143, -0)
- `packages/opencode/src/worktree/index.ts` (+41, -15)
- `packages/opencode/test/AGENTS.md` (+15, -0)
- `packages/opencode/test/acp/agent-interface.test.ts` (+2, -1)
- `packages/opencode/test/cli/cmd/tui/dialog-workspace-create.test.ts` (+7, -42)
- `packages/opencode/test/cli/github-remote.test.ts` (+10, -0)
- `packages/opencode/test/cli/run/entry.body.test.ts` (+473, -0)
- `packages/opencode/test/cli/run/footer.menu.test.ts` (+43, -0)
- `packages/opencode/test/cli/run/footer.view.test.tsx` (+290, -0)
- `packages/opencode/test/cli/run/permission.shared.test.ts` (+144, -0)
- `packages/opencode/test/cli/run/prompt.shared.test.ts` (+132, -0)
- `packages/opencode/test/cli/run/question.shared.test.ts` (+115, -0)
- `packages/opencode/test/cli/run/runtime.boot.test.ts` (+291, -0)
- `packages/opencode/test/cli/run/runtime.queue.test.ts` (+318, -0)
- `packages/opencode/test/cli/run/runtime.stdin.test.ts` (+71, -0)
- `packages/opencode/test/cli/run/scrollback.surface.test.ts` (+888, -0)
- `packages/opencode/test/cli/run/session-data.test.ts` (+411, -0)
- `packages/opencode/test/cli/run/session.shared.test.ts` (+247, -0)
- `packages/opencode/test/cli/run/stream.test.ts` (+55, -0)
- `packages/opencode/test/cli/run/stream.transport.test.ts` (+1419, -0)
- `packages/opencode/test/cli/run/subagent-data.test.ts` (+456, -0)
- `packages/opencode/test/cli/run/theme.test.ts` (+115, -0)
- `packages/opencode/test/cli/run/variant.shared.test.ts` (+217, -0)
- `packages/opencode/test/cli/tui/keybind-plugin.test.ts` (+0, -90)
- `packages/opencode/test/cli/tui/plugin-add.test.ts` (+5, -6)
- `packages/opencode/test/cli/tui/plugin-install.test.ts` (+3, -3)
- `packages/opencode/test/cli/tui/plugin-loader-entrypoint.test.ts` (+17, -16)
- `packages/opencode/test/cli/tui/plugin-loader-pure.test.ts` (+3, -2)
- `packages/opencode/test/cli/tui/plugin-loader.test.ts` (+273, -36)
- `packages/opencode/test/cli/tui/plugin-toggle.test.ts` (+47, -4)
- `packages/opencode/test/config/tui.test.ts` (+147, -10)
- `packages/opencode/test/control-plane/workspace.test.ts` (+232, -68)
- `packages/opencode/test/fixture/flag.ts` (+20, -0)
- `packages/opencode/test/fixture/tui-plugin.ts` (+36, -27)
- `packages/opencode/test/fixture/tui-runtime.ts` (+25, -2)
- `packages/opencode/test/keybind.test.ts` (+0, -421)
- `packages/opencode/test/kilocode/background-process.test.ts` (+44, -0)
- `packages/opencode/test/kilocode/bin-tree-sitter-env.test.ts` (+37, -12)
- `packages/opencode/test/kilocode/cli/cmd/run-message.test.ts` (+36, -0)
- `packages/opencode/test/kilocode/cli/cmd/tui/context/tui-config.test.ts` (+64, -0)
- `packages/opencode/test/kilocode/cli/profile.test.ts` (+91, -0)
- `packages/opencode/test/kilocode/cli/tui/thread.test.ts` (+15, -0)
- `packages/opencode/test/kilocode/commit-message/generate.test.ts` (+8, -9)
- `packages/opencode/test/kilocode/config/config.test.ts` (+81, -0)
- `packages/opencode/test/kilocode/console-ui.test.ts` (+49, -0)
- `packages/opencode/test/kilocode/daemon.test.ts` (+156, -0)
- `packages/opencode/test/kilocode/global-config-refresh.test.ts` (+77, -52)
- `packages/opencode/test/kilocode/help.test.ts` (+4, -2)
- `packages/opencode/test/kilocode/kilo-errors.test.ts` (+2, -4)
- `packages/opencode/test/kilocode/local-review-command.test.ts` (+5, -1)
- `packages/opencode/test/kilocode/plan-exit-detection.test.ts` (+7, -3)
- `packages/opencode/test/kilocode/run-auto.test.ts` (+3, -1)
- `packages/opencode/test/kilocode/run-network.test.ts` (+6, -1)
- `packages/opencode/test/kilocode/server/agent-builder.test.ts` (+188, -0)
- `packages/opencode/test/kilocode/server/config-model-state.test.ts` (+79, -0)
- `packages/opencode/test/kilocode/server/config-overlay.test.ts` (+279, -0)
- `packages/opencode/test/kilocode/server/config-rules.test.ts` (+72, -0)
- `packages/opencode/test/kilocode/server/config-sources.test.ts` (+153, -0)
- `packages/opencode/test/kilocode/server/httpapi-bridge.test.ts` (+0, -175)
- `packages/opencode/test/kilocode/server/httpapi-exercise-scenarios.ts` (+380, -0)
- `packages/opencode/test/kilocode/server/httpapi-public.test.ts` (+36, -0)
- `packages/opencode/test/kilocode/server/provider-auth-lifecycle.test.ts` (+29, -0)
- `packages/opencode/test/kilocode/server/tui-config.test.ts` (+110, -0)
- `packages/opencode/test/kilocode/session-list.test.ts` (+3, -1)
- `packages/opencode/test/kilocode/session-prompt-permission-refresh.test.ts` (+256, -0)
- `packages/opencode/test/kilocode/session-prompt-queue.test.ts` (+74, -1)
- `packages/opencode/test/kilocode/sessions/remote-sender.test.ts` (+7, -7)
- `packages/opencode/test/kilocode/worktree-family-submodule.test.ts` (+39, -0)
- `packages/opencode/test/plugin/xai.test.ts` (+133, -48)
- `packages/opencode/test/project/{instance-bootstrap-regression.test.ts => instance-bootstrap.test.ts}` (+10, -18)
- `packages/opencode/test/project/worktree.test.ts` (+29, -0)
- `packages/opencode/test/provider/transform.test.ts` (+292, -158)
- `packages/opencode/test/server/httpapi-authorization.test.ts` (+2, -0)
- `packages/opencode/test/server/httpapi-bridge.test.ts` (+0, -443)
- `packages/opencode/test/server/httpapi-compression.test.ts` (+154, -0)
- `packages/opencode/test/server/httpapi-config.test.ts` (+0, -5)
- `packages/opencode/test/server/httpapi-cors-vary.test.ts` (+66, -0)
- `packages/opencode/test/server/httpapi-cors.test.ts` (+15, -9)
- `packages/opencode/test/server/httpapi-event.test.ts` (+7, -16)
- `packages/opencode/test/server/httpapi-exercise/assertions.ts` (+64, -0)
- `packages/opencode/test/server/httpapi-exercise/backend.ts` (+144, -0)
- `packages/opencode/test/server/httpapi-exercise/dsl.ts` (+210, -0)
- `packages/opencode/test/server/httpapi-exercise/environment.ts` (+41, -0)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+1291, -0)
- `packages/opencode/test/server/httpapi-exercise/report.ts` (+66, -0)
- `packages/opencode/test/server/httpapi-exercise/routing.ts` (+96, -0)
- `packages/opencode/test/server/httpapi-exercise/runner.ts` (+259, -0)
- `packages/opencode/test/server/httpapi-exercise/runtime.ts` (+49, -0)
- `packages/opencode/test/server/httpapi-exercise/types.ts` (+122, -0)
- `packages/opencode/test/server/httpapi-experimental.test.ts` (+1, -8)
- `packages/opencode/test/server/httpapi-file.test.ts` (+1, -2)
- `packages/opencode/test/server/httpapi-instance-context.test.ts` (+90, -0)
- `packages/opencode/test/server/httpapi-instance.legacy.test.ts` (+0, -125)
- `packages/opencode/test/server/httpapi-instance.test.ts` (+114, -8)
- `packages/opencode/test/server/httpapi-json-parity.test.ts` (+0, -265)
- `packages/opencode/test/server/httpapi-listen.test.ts` (+16, -38)
- `packages/opencode/test/server/httpapi-mcp.test.ts` (+5, -13)
- `packages/opencode/test/server/httpapi-parity.test.ts` (+0, -127)
- `packages/opencode/test/server/httpapi-provider.test.ts` (+16, -30)
- `packages/opencode/test/server/httpapi-pty.test.ts` (+2, -20)
- `packages/opencode/test/server/httpapi-raw-route-auth.test.ts` (+0, -5)
- `packages/opencode/test/server/httpapi-sdk.test.ts` (+114, -72)
- `packages/opencode/test/server/httpapi-session.test.ts` (+21, -48)
- `packages/opencode/test/server/httpapi-sync.test.ts` (+27, -16)
- `packages/opencode/test/server/httpapi-tui.test.ts` (+0, -129)
- `packages/opencode/test/server/httpapi-ui.test.ts` (+261, -0)
- `packages/opencode/test/server/httpapi-workspace-routing.test.ts` (+60, -1)
- `packages/opencode/test/server/httpapi-workspace.test.ts` (+55, -30)
- `packages/opencode/test/server/trace-attributes.test.ts` (+0, -76)
- `packages/opencode/test/server/worktree-endpoint-repro.test.ts` (+0, -3)
- `packages/opencode/test/session/message-v2.test.ts` (+159, -3)
- `packages/opencode/test/session/prompt.test.ts` (+2, -2)
- `packages/opencode/test/session/retry.test.ts` (+40, -18)
- `packages/opencode/test/session/schema-decoding.test.ts` (+15, -2)
- `packages/opencode/test/session/snapshot-tool-race.test.ts` (+2, -2)
- `packages/opencode/test/session/system.test.ts` (+6, -0)
- `packages/opencode/test/skill/skill.test.ts` (+43, -1)
- `packages/plugin/package.json` (+9, -4)
- `packages/plugin/src/tui.ts` (+49, -44)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/script/build.ts` (+1, -8)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+625, -5)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+633, -53)
- `packages/sdk/openapi.json` (+3914, -2034)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/components/message-part.tsx` (+24, -7)
- `packages/ui/src/components/tool-error-card.tsx` (+3, -1)
- `packages/ui/src/components/tool-status-title.tsx` (+61, -63)
- `script/check-forbidden-strings.ts` (+3, -0)
- `script/check-opencode-promise-facades.ts` (+5, -0)
- `script/jetbrains-release-pr.ts` (+12, -8)
- `script/jetbrains-release-validate.ts` (+10, -3)
- `{packages/opencode/script => script}/upgrade-opentui.ts` (+25, -6)
- `script/upstream/package.json` (+1, -1)
- `script/upstream/transforms/preserve-versions.test.ts` (+37, -0)
- `script/upstream/transforms/preserve-versions.ts` (+39, -12)
- `turbo.json` (+4, -0)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 3875f8a16..a2d41c0b4 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.3.18",
+  "version": "7.3.21",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/flag/flag.ts
```diff
diff --git a/packages/core/src/flag/flag.ts b/packages/core/src/flag/flag.ts
index 6cbc94e43..262d8919c 100644
--- a/packages/core/src/flag/flag.ts
+++ b/packages/core/src/flag/flag.ts
@@ -1,5 +1,4 @@
 import { Config } from "effect"
-import { InstallationChannel } from "../installation/version"
 
 function truthy(key: string) {
   const value = process.env[key]?.toLowerCase()
@@ -11,10 +10,6 @@ function falsy(key: string) {
   return value === "false" || value === "0"
 }
 
-// Channels that default to the new effect-httpapi server backend. The legacy
-// hono backend remains the default for stable (`prod`/`latest`) installs.
-const HTTPAPI_DEFAULT_ON_CHANNELS = new Set(["dev", "beta", "local"])
-
 function number(key: string) {
   const value = process.env[key]
   if (!value) return undefined
@@ -73,7 +68,9 @@ export const Flag = {
   KILO_EXPERIMENTAL_LSP_TY: truthy("KILO_EXPERIMENTAL_LSP_TY"),
   KILO_EXPERIMENTAL_LSP_TOOL: KILO_EXPERIMENTAL || truthy("KILO_EXPERIMENTAL_LSP_TOOL"),
   KILO_EXPERIMENTAL_PLAN_MODE: KILO_EXPERIMENTAL || truthy("KILO_EXPERIMENTAL_PLAN_MODE"),
+  KILO_EXPERIMENTAL_SCOUT: KILO_EXPERIMENTAL || truthy("KILO_EXPERIMENTAL_SCOUT"),
   KILO_EXPERIMENTAL_MARKDOWN: !falsy("KILO_EXPERIMENTAL_MARKDOWN"),
+  KILO_ENABLE_PARALLEL: truthy("KILO_ENABLE_PARALLEL") || truthy("KILO_EXPERIMENTAL_PARALLEL"),
   KILO_MODELS_URL: process.env["KILO_MODELS_URL"],
   KILO_MODELS_PATH: process.env["KILO_MODELS_PATH"],
   KILO_DISABLE_EMBEDDED_WEB_UI: truthy("KILO_DISABLE_EMBEDDED_WEB_UI"),
@@ -83,14 +80,6 @@ export const Flag = {
   KILO_STRICT_CONFIG_DEPS: truthy("KILO_STRICT_CONFIG_DEPS"),
 
   KILO_WORKSPACE_ID: process.env["KILO_WORKSPACE_ID"],
-  // Defaults to true on dev/beta/local channels so internal users exercise the
-  // new effect-httpapi server backend. Stable (`prod`/`latest`) installs stay
-  // on the legacy hono backend until the rollout is complete. An explicit env
-  // var ("true"/"1" or "false"/"0") always wins, providing an opt-in for
-  // stable users and an escape hatch for dev/beta users.
-  KILO_EXPERIMENTAL_HTTPAPI:
-    truthy("KILO_EXPERIMENTAL_HTTPAPI") ||
-    (!falsy("KILO_EXPERIMENTAL_HTTPAPI") && HTTPAPI_DEFAULT_ON_CHANNELS.has(InstallationChannel)),
   KILO_EXPERIMENTAL_WORKSPACES: KILO_EXPERIMENTAL || truthy("KILO_EXPERIMENTAL_WORKSPACES"),
   KILO_EXPERIMENTAL_EVENT_SYSTEM: KILO_EXPERIMENTAL || truthy("KILO_EXPERIMENTAL_EVENT_SYSTEM"),
 
```

#### packages/core/src/global.ts
```diff
diff --git a/packages/core/src/global.ts b/packages/core/src/global.ts
index 223322300..9c923f826 100644
--- a/packages/core/src/global.ts
+++ b/packages/core/src/global.ts
@@ -32,6 +32,7 @@ const paths = {
   data,
   bin: path.join(cache, "bin"),
   log: path.join(data, "log"),
+  repos: path.join(data, "repos"),
   cache,
   config,
   state,
@@ -49,6 +50,7 @@ await Promise.all([
   ensureRealDir(Path.tmp), // kilocode_change
   ensureRealDir(Path.log), // kilocode_change
   ensureRealDir(Path.bin), // kilocode_change
+  ensureRealDir(Path.repos), // kilocode_change
 ])
 
 // kilocode_change start - keep generated Kilo data out of macOS Spotlight
@@ -66,6 +68,7 @@ export interface Interface {
   readonly tmp: string
   readonly bin: string
   readonly log: string
+  readonly repos: string
 }
 
 export function make(input: Partial<Interface> = {}): Interface {
@@ -78,6 +81,7 @@ export function make(input: Partial<Interface> = {}): Interface {
     tmp: Path.tmp,
     bin: Path.bin,
     log: Path.log,
+    repos: Path.repos,
     ...input,
   }
 }
```

#### packages/core/test/effect/cross-spawn-spawner.test.ts
```diff
diff --git a/packages/core/test/effect/cross-spawn-spawner.test.ts b/packages/core/test/effect/cross-spawn-spawner.test.ts
index 627db8ef3..e394d43bf 100644
--- a/packages/core/test/effect/cross-spawn-spawner.test.ts
+++ b/packages/core/test/effect/cross-spawn-spawner.test.ts
@@ -111,7 +111,13 @@ describe("cross-spawn spawner", () => {
             ChildProcess.make(process.execPath, ["-e", "process.stdout.write(process.cwd())"], { cwd: tmp.path }),
           ),
         )
-        expect(out).toBe(tmp.path)
+        const cwd = yield* Effect.promise(() => fs.realpath(tmp.path))
+        const actual = yield* Effect.promise(() => fs.realpath(out))
+        const normalize = (value: string) => {
+          const normalized = path.normalize(value)
+          return process.platform === "win32" ? normalized.toLowerCase() : normalized
+        }
+        expect(normalize(actual)).toBe(normalize(cwd))
       }),
     )
 
```

#### packages/core/test/global.test.ts
```diff
diff --git a/packages/core/test/global.test.ts b/packages/core/test/global.test.ts
index 4e13e8842..0d236a130 100644
--- a/packages/core/test/global.test.ts
+++ b/packages/core/test/global.test.ts
@@ -6,7 +6,7 @@ import { Global } from "@opencode-ai/core/global"
 
 describe("global paths", () => {
   test("tmp path is under the system temp directory", () => {
-    expect(Global.Path.tmp).toBe(path.join(os.tmpdir(), "opencode"))
+    expect(Global.Path.tmp).toBe(path.join(os.tmpdir(), "kilo")) // kilocode_change
     expect(Global.make().tmp).toBe(Global.Path.tmp)
   })
 
```


*... and more files (showing first 5)*

## opencode Changes (d85f8cd..d5a0ddb)

### Commits

- d5a0ddb - fix(app): tab title truncation and close button positioning (#30349) (Brendan Allan, 2026-06-02)
- 787f170 - feat(app): inset new layout session panels (#30342) (Brendan Allan, 2026-06-02)
- 8af7371 - sync (Frank, 2026-06-02)
- 90d8563 - infra: stats (Frank, 2026-06-02)
- 6a5ef7f - chore: generate (opencode-agent[bot], 2026-06-02)
- 5937e60 - feat(opencode): add filesystem read and list routes (Dax Raad, 2026-06-02)
- 0136f03 - chore: generate (opencode-agent[bot], 2026-06-02)
- 4df3c98 - feat(core): add dummy location filesystem layer (Dax Raad, 2026-06-02)
- 98b7230 - feat(core): add location filesystem contract (Dax Raad, 2026-06-02)
- 8d03f6c - refactor(core): simplify session pagination (Dax Raad, 2026-06-02)
- 1b85d55 - fix(opencode): preserve websocket api errors (#30321) (Aiden Cline, 2026-06-01)
- 497ff36 - chore: generate (opencode-agent[bot], 2026-06-02)
- c1c02f8 - feat(core): expose session location (Dax Raad, 2026-06-02)
- bbec00f - chore: generate (opencode-agent[bot], 2026-06-02)
- 4668db8 - fix(opencode): remove sunsetted gpt-5.2 and gpt-5.3-codex from allowed models for codex subscriptions (#30316) (Aiden Cline, 2026-06-01)
- ab69f41 - fix(app): avoid suspending on pending child path (#30314) (Luke Parker, 2026-06-02)
- 687c662 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-02)
- 61b5046 - fix: export v2 stylesheets and declare core node types (#30312) (Luke Parker, 2026-06-02)
- 4e70eab - fix(app): restore deferred MCP status updates (#30220) (Luke Parker, 2026-06-02)
- 1cae8f8 - fix(tui): preserve live parts during session hydration (#30300) (Kit Langton, 2026-06-01)
- 8dc2ffd - chore: generate (opencode-agent[bot], 2026-06-02)
- 9b815bc - feat(core): add location-based permission service (#30287) (Dax, 2026-06-02)
- acd620f - chore: generate (opencode-agent[bot], 2026-06-02)
- f0c7feb - fix(opencode): enforce storage path invariants (#29666) (Luke Parker, 2026-06-02)
- a821029 - chore: generate (opencode-agent[bot], 2026-06-01)
- 57d602d - fix(tui): keep retry attempt before message (#30275) (Kit Langton, 2026-06-01)
- 6072a68 - fix(tui): keep background marker with subagent label (#30271) (Kit Langton, 2026-06-01)
- ae92f31 - feat(core): update Copilot for token-based billing (#30181) (Aiden Cline, 2026-06-01)
- fa23fb5 - fix(tui): handle events across workspaces (#30281) (James Long, 2026-06-01)
- 5f2b4ea - fix(tui): clarify inline subagent rows (#30051) (Kit Langton, 2026-06-01)
- 32d5058 - chore: generate (opencode-agent[bot], 2026-06-01)
- 363d6d1 - feat(app): v2 desktop UI improvements (#29689) (Aarav Sareen, 2026-06-01)
- 2bf85b8 - fix(stats): align big-pickle provider resolution (#30274) (Adam, 2026-06-01)
- 1813256 - fix(stats): stabilize top models hover (Adam, 2026-06-01)
- d7ba8b1 - fix(stats): center top models dot grid (Adam, 2026-06-01)
- 44350bc - fix(stats): restore leaderboard spacing (Adam, 2026-06-01)
- 913c4ef - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-01)
- 10095bf - chore: generate (opencode-agent[bot], 2026-06-01)
- 6a3b2f3 - add run --replay mode (#30239) (Simon Klee, 2026-06-01)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/tool.ts` (+2, -1)
- `packages/opencode/test/tool/external-directory.test.ts` (+2, -1)
- `packages/opencode/test/tool/glob.test.ts` (+3, -2)
- `packages/opencode/test/tool/grep.test.ts` (+3, -2)
- `packages/opencode/test/tool/lsp.test.ts` (+3, -2)
- `packages/opencode/test/tool/read.test.ts` (+5, -4)
- `packages/opencode/test/tool/shell.test.ts` (+33, -32)
- `packages/opencode/test/tool/skill.test.ts` (+2, -1)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+2, -1)
- `packages/opencode/src/agent/subagent-permissions.ts` (+3, -2)
- `packages/opencode/test/agent/agent.test.ts` (+2, -1)
- `packages/opencode/test/agent/plan-mode-subagent-bypass.test.ts` (+4, -3)

#### Permission System (**/permission/)
- `packages/core/src/permission/legacy.ts` (+96, -0)
- `packages/core/src/permission/saved.ts` (+87, -0)
- `packages/core/src/permission/schema.ts` (+16, -0)
- `packages/core/src/permission/sql.ts` (+20, -0)
- `packages/opencode/src/permission/evaluate.ts` (+1, -1)
- `packages/opencode/src/permission/index.ts` (+55, -137)
- `packages/opencode/src/permission/schema.ts` (+0, -13)
- `packages/opencode/test/permission/next.test.ts` (+56, -50)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/migration/20260601010001_normalize_storage_paths/migration.sql` (+7, -0)
- `packages/core/migration/20260601010001_normalize_storage_paths/snapshot.json` (+1560, -0)
- `packages/core/migration/20260601202201_amazing_prowler/migration.sql` (+1, -0)
- `packages/core/migration/20260601202201_amazing_prowler/snapshot.json` (+1498, -0)
- `packages/core/migration/20260602002951_lowly_union_jack/migration.sql` (+11, -0)
- `packages/core/migration/20260602002951_lowly_union_jack/snapshot.json` (+1602, -0)
- `packages/core/package.json` (+1, -0)
- `packages/core/src/agent.ts` (+2, -2)
- `packages/core/src/database/migration.gen.ts` (+3, -0)
- `packages/core/src/database/migration/20260601010001_normalize_storage_paths.ts` (+22, -0)
- `packages/core/src/database/migration/20260601202201_amazing_prowler.ts` (+11, -0)
- `packages/core/src/database/migration/20260602002951_lowly_union_jack.ts` (+24, -0)
- `packages/core/src/database/path.ts` (+91, -0)
- `packages/core/src/location-filesystem.ts` (+179, -0)
- `packages/core/src/location-layer.ts` (+10, -0)
- `packages/core/src/permission.ts` (+286, -35)
- `packages/core/src/plugin/agent.ts` (+34, -36)
- `packages/core/src/project/sql.ts` (+3, -2)
- `packages/core/src/session.ts` (+34, -30)
- `packages/core/src/session/legacy.ts` (+2, -2)
- `packages/core/src/session/schema.ts` (+8, -16)
- `packages/core/src/session/sql.ts` (+5, -12)
- `packages/core/test/config/agent.test.ts` (+11, -11)
- `packages/core/test/config/config.test.ts` (+6, -6)
- `packages/core/test/database-migration.test.ts` (+169, -2)
- `packages/core/test/location-filesystem.test.ts` (+92, -0)
- `packages/core/test/permission.test.ts` (+174, -0)
- `packages/stats/core/src/domain/inference.test.ts` (+29, -4)
- `packages/stats/core/src/domain/inference.ts` (+22, -19)
- `packages/stats/core/src/domain/model-normalization.ts` (+21, -4)
- `packages/stats/core/src/honeycomb-backfill.ts` (+31, -12)

#### Other Changes
- `.gitattributes` (+2, -0)
- `bun.lock` (+16, -15)
- `infra/lake.ts` (+37, -0)
- `infra/stats.ts` (+3, -8)
- `nix/hashes.json` (+4, -4)
- `package.json` (+3, -3)
- `packages/app/src/components/dialog-connect-provider.tsx` (+1, -1)
- `packages/app/src/components/dialog-custom-provider.tsx` (+1, -1)
- `packages/app/src/components/dialog-fork.tsx` (+1, -1)
- `packages/app/src/components/dialog-select-server.tsx` (+1, -1)
- `packages/app/src/components/prompt-input/attachments.ts` (+1, -1)
- `packages/app/src/components/prompt-input/submit.ts` (+1, -1)
- `packages/app/src/components/session/session-header.tsx` (+4, -4)
- `packages/app/src/components/session/session-new-design-view.tsx` (+3, -2)
- `packages/app/src/components/settings-general.tsx` (+10, -2)
- `packages/app/src/components/settings-keybinds.tsx` (+174, -69)
- `packages/app/src/components/settings-providers.tsx` (+1, -1)
- `packages/app/src/components/settings-v2/dialog-settings-v2.tsx` (+80, -0)
- `packages/app/src/components/settings-v2/general.tsx` (+825, -0)
- `packages/app/src/components/settings-v2/index.tsx` (+1, -0)
- `packages/app/src/components/settings-v2/models.tsx` (+138, -0)
- `packages/app/src/components/settings-v2/parts/list.tsx` (+6, -0)
- `packages/app/src/components/settings-v2/parts/row.tsx` (+20, -0)
- `packages/app/src/components/settings-v2/providers.tsx` (+263, -0)
- `packages/app/src/components/settings-v2/settings-v2.css` (+515, -0)
- `packages/app/src/components/status-popover-body.tsx` (+1, -1)
- `packages/app/src/components/status-popover.tsx` (+2, -2)
- `packages/app/src/components/terminal.tsx` (+1, -1)
- `packages/app/src/components/titlebar.tsx` (+67, -47)
- `packages/app/src/components/windows-app-menu.tsx` (+2, -2)
- `packages/app/src/context/file.tsx` (+1, -1)
- `packages/app/src/context/global-sync/bootstrap.ts` (+1, -1)
- `packages/app/src/context/global-sync/child-store.test.ts` (+24, -16)
- `packages/app/src/context/global-sync/child-store.ts` (+8, -11)
- `packages/app/src/context/layout.tsx` (+13, -0)
- `packages/app/src/context/server-sync.tsx` (+1, -1)
- `packages/app/src/i18n/en.ts` (+2, -0)
- `packages/app/src/i18n/zh.ts` (+2, -0)
- `packages/app/src/pages/directory-layout.tsx` (+1, -1)
- `packages/app/src/pages/home.tsx` (+530, -285)
- `packages/app/src/pages/layout.tsx` (+10, -10)
- `packages/app/src/pages/layout/project-avatar-state.ts` (+24, -0)
- `packages/app/src/pages/session.tsx` (+18, -4)
- `packages/app/src/pages/session/composer/session-composer-region.tsx` (+4, -2)
- `packages/app/src/pages/session/composer/session-composer-state.ts` (+1, -1)
- `packages/app/src/pages/session/composer/session-question-dock.tsx` (+1, -1)
- `packages/app/src/pages/session/file-tabs.tsx` (+1, -1)
- `packages/app/src/pages/session/message-timeline.tsx` (+1, -1)
- `packages/app/src/pages/session/new-session-layout.ts` (+3, -0)
- `packages/app/src/pages/session/session-side-panel.tsx` (+9, -2)
- `packages/app/src/pages/session/use-session-commands.tsx` (+1, -1)
- `packages/app/src/utils/toast.tsx` (+34, -0)
- `packages/opencode/src/cli/cmd/debug/agent.ts` (+3, -2)
- `packages/opencode/src/cli/cmd/run.ts` (+3, -2)
- `packages/opencode/src/cli/cmd/run/footer.ts` (+32, -8)
- `packages/opencode/src/cli/cmd/run/runtime.lifecycle.ts` (+43, -1)
- `packages/opencode/src/cli/cmd/run/runtime.queue.ts` (+18, -5)
- `packages/opencode/src/cli/cmd/run/runtime.ts` (+77, -4)
- `packages/opencode/src/cli/cmd/run/session-data.ts` (+5, -0)
- `packages/opencode/src/cli/cmd/run/session-replay.ts` (+114, -1)
- `packages/opencode/src/cli/cmd/run/stream.transport.ts` (+219, -13)
- `packages/opencode/src/cli/cmd/run/types.ts` (+15, -0)
- `packages/opencode/src/cli/cmd/tui/app.tsx` (+8, -4)
- `packages/opencode/src/cli/cmd/tui/component/prompt/index.tsx` (+2, -1)
- `packages/opencode/src/cli/cmd/tui/context/event.ts` (+2, -3)
- `packages/opencode/src/cli/cmd/tui/context/sync.tsx` (+83, -22)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+48, -19)
- `packages/opencode/src/plugin/github-copilot/copilot.ts` (+29, -6)
- `packages/opencode/src/plugin/github-copilot/models.ts` (+95, -45)
- `packages/opencode/src/plugin/openai/codex.ts` (+1, -8)
- `packages/opencode/src/plugin/openai/ws-pool.ts` (+11, -4)
- `packages/opencode/src/plugin/openai/ws.ts` (+49, -2)
- `packages/opencode/src/project/project.ts` (+9, -41)
- `packages/opencode/src/provider/provider.ts` (+13, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/permission.ts` (+4, -4)
- `packages/opencode/src/server/routes/instance/httpapi/groups/session.ts` (+4, -4)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2.ts` (+6, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/fs.ts` (+54, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/location.ts` (+4, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/permission.ts` (+94, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/session.ts` (+66, -19)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/permission.ts` (+3, -3)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/session.ts` (+2, -2)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2.ts` (+16, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2/fs.ts` (+12, -0)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2/permission.ts` (+105, -0)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2/session.ts` (+33, -119)
- `packages/opencode/src/session/llm.ts` (+5, -3)
- `packages/opencode/src/session/llm/ai-sdk.ts` (+43, -9)
- `packages/opencode/src/session/llm/request.ts` (+2, -1)
- `packages/opencode/src/session/processor.ts` (+2, -1)
- `packages/opencode/src/session/prompt.ts` (+2, -1)
- `packages/opencode/src/session/session.ts` (+30, -21)
- `packages/opencode/src/storage/json-migration.ts` (+2, -30)
- `packages/opencode/src/storage/schema.ts` (+1, -1)
- `packages/opencode/test/cli/cmd/tui/sync-live-hydration.test.tsx` (+278, -0)
- `packages/opencode/test/cli/help/__snapshots__/help-snapshots.test.ts.snap` (+1, -1)
- `packages/opencode/test/cli/run/runtime.queue.test.ts` (+4, -1)
- `packages/opencode/test/cli/run/session-replay.test.ts` (+298, -1)
- `packages/opencode/test/cli/run/stream.transport.test.ts` (+463, -1)
- `packages/opencode/test/cli/tui/__snapshots__/inline-tool-wrap-snapshot.test.tsx.snap` (+18, -0)
- `packages/opencode/test/cli/tui/inline-tool-wrap-snapshot.test.tsx` (+68, -1)
- `packages/opencode/test/cli/tui/use-event.test.tsx` (+0, -13)
- `packages/opencode/test/control-plane/workspace.test.ts` (+2, -1)
- `packages/opencode/test/permission-task.test.ts` (+3, -2)
- `packages/opencode/test/plugin/github-copilot-models.test.ts` (+73, -2)
- `packages/opencode/test/plugin/openai-ws.test.ts` (+67, -0)
- `packages/opencode/test/project/migrate-global.test.ts` (+2, -1)
- `packages/opencode/test/project/project.test.ts` (+1, -19)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+34, -6)
- `packages/opencode/test/server/httpapi-instance.test.ts` (+2, -2)
- `packages/opencode/test/server/httpapi-query-schema-drift.test.ts` (+1, -6)
- `packages/opencode/test/server/httpapi-session.test.ts` (+20, -20)
- `packages/opencode/test/server/session-list.test.ts` (+35, -0)
- `packages/opencode/test/session/compaction.test.ts` (+14, -0)
- `packages/opencode/test/session/llm.test.ts` (+53, -1)
- `packages/opencode/test/storage/json-migration.test.ts` (+39, -15)
- `packages/plugin/package.json` (+3, -3)
- `packages/plugin/src/index.ts` (+1, -0)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+260, -8)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+413, -69)
- `packages/sdk/openapi.json` (+1123, -299)
- `packages/stats/app/src/routes/index.css` (+46, -76)
- `packages/stats/app/src/routes/index.tsx` (+84, -27)
- `packages/ui/package.json` (+4, -2)
- `packages/ui/src/components/select-v2.css` (+87, -0)
- `packages/ui/src/components/select-v2.stories.tsx` (+22, -0)
- `packages/ui/src/components/select-v2.tsx` (+171, -0)
- `packages/ui/src/v2/components/accordion-v2.css` (+0, -2)
- `packages/ui/src/v2/components/avatar-v2.css` (+0, -1)
- `packages/ui/src/v2/components/badge-v2.css` (+4, -5)
- `packages/ui/src/v2/components/basic-tool-v2.css` (+0, -1)
- `packages/ui/src/v2/components/button-v2.css` (+23, -1)
- `packages/ui/src/v2/components/button-v2.stories.tsx` (+6, -3)
- `packages/ui/src/v2/components/button-v2.tsx` (+2, -2)
- `packages/ui/src/v2/components/checkbox-v2.css` (+0, -3)
- `packages/ui/src/v2/components/dialog-v2.css` (+6, -8)
- `packages/ui/src/v2/components/diff-changes-v2.css` (+0, -1)
- `packages/ui/src/v2/components/field-v2.css` (+0, -2)
- `packages/ui/src/v2/components/icon.tsx` (+16, -8)
- `packages/ui/src/v2/components/inline-input-v2.css` (+0, -2)
- `packages/ui/src/v2/components/keybind-v2.css` (+17, -14)
- `packages/ui/src/v2/components/line-comment-v2.css` (+0, -2)
- `packages/ui/src/v2/components/menu-v2.css` (+6, -9)
- `packages/ui/src/v2/components/project-avatar-v2.css` (+128, -0)
- `packages/ui/src/v2/components/project-avatar-v2.stories.tsx` (+88, -0)
- `packages/ui/src/v2/components/project-avatar-v2.tsx` (+71, -0)
- `packages/ui/src/v2/components/radio-v2.css` (+0, -5)
- `packages/ui/src/v2/components/segmented-control-v2.css` (+0, -1)
- `packages/ui/src/v2/components/select-v2.css` (+0, -1)
- `packages/ui/src/v2/components/switch-v2.css` (+26, -22)
- `packages/ui/src/v2/components/tab-state-indicator.tsx` (+37, -0)
- `packages/ui/src/v2/components/tabs-v2.css` (+23, -24)
- `packages/ui/src/v2/components/text-input-v2.css` (+16, -16)
- `packages/ui/src/v2/components/text-input-v2.stories.tsx` (+1, -1)
- `packages/ui/src/v2/components/textarea-v2.css` (+0, -1)
- `packages/ui/src/v2/components/toast-v2.css` (+23, -9)
- `packages/ui/src/v2/components/toast-v2.tsx` (+2, -2)
- `packages/ui/src/v2/components/tool-error-card-v2.css` (+0, -1)
- `packages/ui/src/v2/components/tooltip-v2.css` (+0, -1)
- `packages/ui/src/v2/styles/theme.css` (+58, -0)
- `sst.config.ts` (+8, -1)

### Key Diffs

#### packages/core/migration/20260601010001_normalize_storage_paths/migration.sql
```diff
diff --git a/packages/core/migration/20260601010001_normalize_storage_paths/migration.sql b/packages/core/migration/20260601010001_normalize_storage_paths/migration.sql
new file mode 100644
index 0000000..7eede8f
--- /dev/null
+++ b/packages/core/migration/20260601010001_normalize_storage_paths/migration.sql
@@ -0,0 +1,7 @@
+UPDATE project SET worktree = REPLACE(worktree, char(92), '/') WHERE worktree GLOB '[A-Za-z]:' || char(92) || '*' OR worktree LIKE char(92) || char(92) || '%';
+--> statement-breakpoint
+UPDATE project SET sandboxes = REPLACE(sandboxes, char(92) || char(92), '/') WHERE instr(sandboxes, char(92)) > 0 AND (worktree GLOB '[A-Za-z]:*' OR worktree LIKE '//%');
+--> statement-breakpoint
+UPDATE session SET directory = REPLACE(directory, char(92), '/') WHERE directory GLOB '[A-Za-z]:' || char(92) || '*' OR directory LIKE char(92) || char(92) || '%';
+--> statement-breakpoint
+UPDATE session SET path = REPLACE(path, char(92), '/') WHERE path IS NOT NULL AND instr(path, char(92)) > 0 AND (directory GLOB '[A-Za-z]:*' OR directory LIKE '//%');
```

#### packages/core/migration/20260601010001_normalize_storage_paths/snapshot.json
```diff
diff --git a/packages/core/migration/20260601010001_normalize_storage_paths/snapshot.json b/packages/core/migration/20260601010001_normalize_storage_paths/snapshot.json
new file mode 100644
index 0000000..0f0faf7
--- /dev/null
+++ b/packages/core/migration/20260601010001_normalize_storage_paths/snapshot.json
@@ -0,0 +1,1560 @@
+{
+  "id": "7f4866d3-a95b-4141-bb59-28e31c521605",
+  "prevIds": ["bf93c73b-5a48-4d63-9909-3c36a79b9788"],
+  "version": "7",
+  "dialect": "sqlite",
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
+      "name": "event_sequence",
+      "entityType": "tables"
+    },
+    {
+      "name": "event",
+      "entityType": "tables"
+    },
+    {
+      "name": "project",
+      "entityType": "tables"
+    },
+    {
+      "name": "message",
+      "entityType": "tables"
+    },
+    {
+      "name": "part",
```

#### packages/core/migration/20260601202201_amazing_prowler/migration.sql
```diff
diff --git a/packages/core/migration/20260601202201_amazing_prowler/migration.sql b/packages/core/migration/20260601202201_amazing_prowler/migration.sql
new file mode 100644
index 0000000..9240549
--- /dev/null
+++ b/packages/core/migration/20260601202201_amazing_prowler/migration.sql
@@ -0,0 +1 @@
+DROP TABLE `permission`;
\ No newline at end of file
```

#### packages/core/migration/20260601202201_amazing_prowler/snapshot.json
```diff
diff --git a/packages/core/migration/20260601202201_amazing_prowler/snapshot.json b/packages/core/migration/20260601202201_amazing_prowler/snapshot.json
new file mode 100644
index 0000000..b506b50
--- /dev/null
+++ b/packages/core/migration/20260601202201_amazing_prowler/snapshot.json
@@ -0,0 +1,1498 @@
+{
+  "version": "7",
+  "dialect": "sqlite",
+  "id": "226375f1-a19f-4c7b-8aa2-ccc5513d3b0d",
+  "prevIds": ["bf93c73b-5a48-4d63-9909-3c36a79b9788"],
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
+      "name": "event_sequence",
+      "entityType": "tables"
+    },
+    {
+      "name": "event",
+      "entityType": "tables"
+    },
+    {
+      "name": "project",
+      "entityType": "tables"
+    },
+    {
+      "name": "message",
+      "entityType": "tables"
+    },
+    {
+      "name": "part",
```

#### packages/core/migration/20260602002951_lowly_union_jack/migration.sql
```diff
diff --git a/packages/core/migration/20260602002951_lowly_union_jack/migration.sql b/packages/core/migration/20260602002951_lowly_union_jack/migration.sql
new file mode 100644
index 0000000..aea7976
--- /dev/null
+++ b/packages/core/migration/20260602002951_lowly_union_jack/migration.sql
@@ -0,0 +1,11 @@
+CREATE TABLE `permission` (
+	`id` text PRIMARY KEY,
+	`project_id` text NOT NULL,
+	`action` text NOT NULL,
+	`resource` text NOT NULL,
+	`time_created` integer NOT NULL,
+	`time_updated` integer NOT NULL,
+	CONSTRAINT `fk_permission_project_id_project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON DELETE CASCADE
+);
+--> statement-breakpoint
+CREATE UNIQUE INDEX `permission_project_action_resource_idx` ON `permission` (`project_id`,`action`,`resource`);
\ No newline at end of file
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/agent.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/prompt/scout.txt
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/kilocode/agent/builder.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/kilocode/agent/index.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/test/agent/agent.test.ts
- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/src/agent/agent.ts
- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/src/agent/subagent-permissions.ts
- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/test/agent/agent.test.ts
- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/test/agent/plan-mode-subagent-bypass.test.ts
- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/src/flag/flag.ts
- `src/core/` - review core changes from packages/core/src/global.ts
- `src/core/` - review core changes from packages/core/test/effect/cross-spawn-spawner.test.ts
- `src/core/` - review core changes from packages/core/test/global.test.ts
- `src/core/` - review core changes from packages/core/test/util/effect-flock.test.ts
- `src/core/` - review core changes from packages/core/test/util/flock.test.ts
- `src/permission/` - review permission changes from packages/opencode/src/kilocode/permission/routes.ts
- `src/permission/` - review permission changes from packages/opencode/src/permission/schema.ts
- `src/permission/` - review permission changes from packages/opencode/test/kilocode/permission/next.reply-http.test.ts
- `src/tool/codesearch.ts` - update based on kilocode packages/opencode/src/tool/codesearch.ts changes
- `src/tool/codesearch.txt.ts` - update based on kilocode packages/opencode/src/tool/codesearch.txt changes
- `src/tool/external-directory.test.ts` - update based on opencode packages/opencode/test/tool/external-directory.test.ts changes
- `src/tool/glob.test.ts` - update based on opencode packages/opencode/test/tool/glob.test.ts changes
- `src/tool/grep.test.ts` - update based on opencode packages/opencode/test/tool/grep.test.ts changes
- `src/tool/lsp.test.ts` - update based on opencode packages/opencode/test/tool/lsp.test.ts changes
- `src/tool/notebook.ts` - update based on kilocode packages/opencode/src/kilocode/tool/notebook.ts changes
- `src/tool/read.test.ts` - update based on opencode packages/opencode/test/tool/read.test.ts changes
- `src/tool/registry.test.ts` - update based on kilocode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
- `src/tool/repo_clone.test.ts` - update based on kilocode packages/opencode/test/tool/repo_clone.test.ts changes
- `src/tool/repo_clone.ts` - update based on kilocode packages/opencode/src/tool/repo_clone.ts changes
- `src/tool/repo_clone.txt.ts` - update based on kilocode packages/opencode/src/tool/repo_clone.txt changes
- `src/tool/repo_overview.test.ts` - update based on kilocode packages/opencode/test/tool/repo_overview.test.ts changes
- `src/tool/repo_overview.ts` - update based on kilocode packages/opencode/src/tool/repo_overview.ts changes
- `src/tool/repo_overview.txt.ts` - update based on kilocode packages/opencode/src/tool/repo_overview.txt changes
- `src/tool/shell.test.ts` - update based on opencode packages/opencode/test/tool/shell.test.ts changes
- `src/tool/skill.test.ts` - update based on opencode packages/opencode/test/tool/skill.test.ts changes
- `src/tool/tool.ts` - update based on opencode packages/opencode/src/tool/tool.ts changes
- `src/tool/websearch.test.ts` - update based on kilocode packages/opencode/test/tool/websearch.test.ts changes
- `src/tool/websearch.ts` - update based on kilocode packages/opencode/src/tool/websearch.ts changes
- `src/tool/websearch.txt.ts` - update based on kilocode packages/opencode/src/tool/websearch.txt changes
- `src/tool/{mcp-exa.ts => mcp-websearch.ts}.ts` - update based on kilocode packages/opencode/src/tool/{mcp-exa.ts => mcp-websearch.ts} changes
