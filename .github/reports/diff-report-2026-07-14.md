# Upstream Changes Report
Generated: 2026-07-14 08:05:46

## Summary
- kilocode: 161 commits, 1481 files changed
- opencode: 54 commits, 131 files changed

## kilocode Changes (3cb82a090..a4e1dd72c)

### Commits

- a4e1dd72c - Merge pull request #12128 from rakshith1928/fix/indexing-model-validation (Marius, 2026-07-14)
- 7639a09c7 - Merge pull request #11424 from Kilo-Org/dust-ranunculus (Marius, 2026-07-14)
- de1bf56cb - Merge pull request #12197 from Kilo-Org/docs/fix-telegram-link-checker (Marius, 2026-07-14)
- 326b3dd3f - Merge pull request #11783 from Kilo-Org/bittersweet-height (Marius, 2026-07-14)
- a5e189c49 - Merge pull request #11536 from Kilo-Org/kaput-breath (Marius, 2026-07-14)
- 4fb04c5d3 - Merge pull request #11687 from Kilo-Org/waiting-mayonnaise (Marius, 2026-07-14)
- d6d529147 - chore(agent-manager): resolve main merge conflicts (marius-kilocode, 2026-07-14)
- 4b960094a - Merge pull request #12065 from Kilo-Org/supersede/timeline-part-highlight-12062 (Marius, 2026-07-14)
- cb654e52c - Merge pull request #12097 from Kilo-Org/fix/windows-file-handles (Marius, 2026-07-14)
- 1083bb82b - feat: report active CLI and VS Code app and session presence (#12159) (Evgeny Shurakov, 2026-07-14)
- 847834fed - Merge branch 'main' into kaput-breath (Marius Wichtner, 2026-07-14)
- 0f7c46c15 - fix(docs): exclude t.me links from lychee link checker (marius-kilocode, 2026-07-14)
- 534075e0a - Merge remote-tracking branch 'origin/main' into dust-ranunculus (marius-kilocode, 2026-07-14)
- edfcbd3fe - Merge remote-tracking branch 'origin/main' into dust-ranunculus (marius-kilocode, 2026-07-14)
- 9173d98d4 - Merge remote-tracking branch 'origin/main' into dust-ranunculus (marius-kilocode, 2026-07-14)
- e2b609eb5 - Merge pull request #12175 from Kilo-Org/investigate-worktree-variant-inheritance (Marius, 2026-07-14)
- 00e164612 - Merge pull request #12180 from Kilo-Org/fringe-passionfruit (Kirill Kalishev, 2026-07-13)
- 142225f0f - test(jetbrains): avoid environment-specific font assertion (kirillk, 2026-07-13)
- 4e8c0fb13 - Merge pull request #12187 from shssoichiro/fix/retry-remote-embedder (Marius, 2026-07-13)
- c9f2442ff - Merge branch 'main' into fringe-passionfruit (Kirill Kalishev, 2026-07-13)
- b62105a64 - fix(jetbrains): refine prompt action spacing (kirillk, 2026-07-13)
- 18e798e81 - fix(jetbrains): align prompt button icons with IDE theme (kirillk, 2026-07-13)
- 227c65d10 - fix(indexing): retry remote embedder validation on fail (Josh Holmer, 2026-07-13)
- de06c407f - feat(jetbrains): show elapsed time in progress footer (kirillk, 2026-07-13)
- 6881b19d4 - fix(jetbrains): align progress footer with transcript inset (kirillk, 2026-07-13)
- 15a3132aa - fix(jetbrains): show auto-hiding vertical scrollbar when prompt overflows cap (kirillk, 2026-07-13)
- 98897df44 - Merge remote-tracking branch 'upstream/main' into fix/indexing-model-validation (Rakshith N, 2026-07-13)
- 0689562dc - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-07-13)
- c18389f00 - Merge remote-tracking branch 'origin/main' into supersede/timeline-part-highlight-12062 (marius-kilocode, 2026-07-13)
- 79cb96ffe - Merge remote-tracking branch 'origin/investigate-worktree-variant-inheritance' into investigate-worktree-variant-inheritance (marius-kilocode, 2026-07-13)
- bff6e51f2 - fix(cli): support current model ID types (marius-kilocode, 2026-07-13)
- ba32eb12f - Merge remote-tracking branch 'origin/main' into bittersweet-height (marius-kilocode, 2026-07-13)
- 751679b7a - Merge branch 'main' into fix/windows-file-handles (Marius, 2026-07-13)
- 64b487407 - Merge branch 'main' into investigate-worktree-variant-inheritance (Marius, 2026-07-13)
- bac1fadeb - Merge pull request #12156 from Kilo-Org/investigate-hy3-compaction-freeze (Marius, 2026-07-13)
- 13589a726 - Merge main into fix/windows-file-handles (marius-kilocode, 2026-07-13)
- 539f4a71d - Merge pull request #12177 from Kilo-Org/fix-tab-close-inactive-focus (Marius, 2026-07-13)
- 9b730788a - Merge remote-tracking branch 'origin/main' into waiting-mayonnaise (marius-kilocode, 2026-07-13)
- 08cbafb97 - test(cli): isolate handoff variant regression (marius-kilocode, 2026-07-13)
- dfd44d874 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-07-13)
- 52cf1a3a0 - Merge remote-tracking branch 'origin/main' into investigate-hy3-compaction-freeze (marius-kilocode, 2026-07-13)
- 414848ad8 - fix(vscode): preserve focus when middle-clicking tab (marius-kilocode, 2026-07-13)
- 8784a0d08 - test(jetbrains): reduce unit test runtime (#12171) (Marius, 2026-07-13)
- 0062801e8 - chore(cli): annotate historical fork lookup (marius-kilocode, 2026-07-13)
- ef6b152ff - OpenCode v1.16.2 (#12088) (Johnny Eric Amancio, 2026-07-13)
- 7eaa25170 - fix(cli): preserve historical fork variants (marius-kilocode, 2026-07-13)
- 5c98a0d1d - fix(jetbrains): improve rollback scrolling and custom answer font (kirillk, 2026-07-13)
- afda97945 - release: v7.4.7 (kilo-maintainer[bot], 2026-07-13)
- e372cb3d5 - fix(vscode): preserve focus after closing inactive tab (marius-kilocode, 2026-07-13)
- c99db83f8 - Merge pull request #12176 from Kilo-Org/fix-tab-close-auto-focus-prompt (Marius, 2026-07-13)
- b74015280 - fix(vscode): focus prompt after closing sidebar tab (marius-kilocode, 2026-07-13)
- 0a388de3f - chore(cli): annotate fork variant changes (marius-kilocode, 2026-07-13)
- bd08c1341 - fix(cli): preserve forked session variants (marius-kilocode, 2026-07-13)
- 2535b742a - release: v7.4.6 (kilo-maintainer[bot], 2026-07-13)
- c83b4291b - style(agent-manager): prettier-format worktree-create extraction (marius-kilocode, 2026-07-13)
- 032f3bb55 - fix(cli): block project markdown secret exfiltration (#12168) (Marius, 2026-07-13)
- 18baf1b06 - refactor(agent-manager): extract worktree creation out of provider (marius-kilocode, 2026-07-13)
- 3698df1bc - fix(cli): skip Kilo model catalog resolution when indexing is disabled (Rakshith N, 2026-07-13)
- 663902234 - Merge pull request #12149 from umi008/fix/gemma-thinking-level (Christiaan Arnoldus, 2026-07-13)
- a476f4473 - Merge pull request #11955 from jstar0/fix/gemini-schema-required (Christiaan Arnoldus, 2026-07-13)
- fc52751b0 - Merge pull request #12167 from Kilo-Org/scandalous-watcher (Marius, 2026-07-13)
- 4618f1b09 - fix(cli): preserve sanitized tool schema inputs (#12166) (Marius, 2026-07-13)
- 90a49c856 - Merge pull request #10466 from Kilo-Org/decorous-lever (Marius, 2026-07-13)
- dcbb107ee - fix(cli): use public npm registry for curl fallback, fix tests and changeset (marius-kilocode, 2026-07-13)
- 988a92eae - fix(cli): resolve curl upgrade version from npm dist-tag instead of GitHub releases/latest (marius-kilocode, 2026-07-13)
- ebfa5287e - Merge pull request #12164 from Kilo-Org/fix-kilo-serve-busy-loop-linux (Marius, 2026-07-13)
- be15cf4b5 - fix(cli): sanitize unsupported regex lookarounds (#12153) (Marius, 2026-07-13)
- 1d6ab4710 - Merge pull request #12162 from Kilo-Org/fix-gemini-auth-key-change (Marius, 2026-07-13)
- 463c70693 - Merge branch 'main' into bittersweet-height (marius-kilocode, 2026-07-13)
- f0621df7e - fix(cli): classify empty compaction responses (marius-kilocode, 2026-07-13)
- 65a0f6646 - docs(kilo-docs): exclude Google AI Studio API keys page from link checker (#12163) (Marius, 2026-07-13)
- 039b73dfa - fix(cli): avoid independent worktree indexing scans (marius-kilocode, 2026-07-13)
- 0948abe7b - Merge remote-tracking branch 'origin/main' into dust-ranunculus (marius-kilocode, 2026-07-13)
- d74a04d01 - Merge pull request #12092 from Kilo-Org/fix-gpt-reasoning-display (Marius, 2026-07-13)
- c643d5924 - Merge remote-tracking branch 'origin/main' into supersede/timeline-part-highlight-12062 (marius-kilocode, 2026-07-13)
- ed7f13711 - Merge remote-tracking branch 'origin/main' into decorous-lever (marius-kilocode, 2026-07-13)
- 3d6cbd8f5 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-07-13)
- 1ed710a99 - fix(ui): preserve reasoning after incomplete comments (marius-kilocode, 2026-07-13)
- 70324ba51 - Merge branch 'main' into waiting-mayonnaise (Marius, 2026-07-13)
- 3ee91448e - fix(cli): explain Gemini API key rejections (marius-kilocode, 2026-07-13)
- d69d50280 - feat(vscode): complete local session tab workflow (marius-kilocode, 2026-07-13)
- f3abace24 - Merge pull request #11837 from mjnaderi/fix-kilo-gateway-login-rate-limit-message (Marius, 2026-07-13)
- 92c4b3bfb - Merge pull request #12151 from Kilo-Org/fix-flaky-test (Marius, 2026-07-13)
- 857c496f7 - chore(script): reconcile team list with active maintainers (#12154) (Marius, 2026-07-13)
- 6cfa52bb7 - Merge pull request #12155 from Kilo-Org/feat/vscode-chat-search-supersede (Marius, 2026-07-13)
- 54a27c3fc - chore(script): drop kilo-engineering from team list (marius-kilocode, 2026-07-13)
- 6f11e3576 - fix(cli): preserve chunk compaction errors (marius-kilocode, 2026-07-13)
- 167c304a4 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-07-13)
- d6720d2af - Merge pull request #12028 from sylwester-liljegren/feat/vscode-file-picker-mention (Marius, 2026-07-13)
- 064be73fe - fix(vscode): strip markdown links from non-JSON MCP/generic tool output (Sylwester Liljegren, 2026-07-13)
- fb44bb8dc - fix(vscode): don't strip markdown link syntax from tool/bash text; revert history-search cap (Sylwester Liljegren, 2026-07-13)
- e841aca8f - fix(vscode): don't strip markdown link syntax from user message text (Sylwester Liljegren, 2026-07-13)
- b0d19df9b - fix(vscode): strip markdown link/image URLs before counting search matches (Sylwester Liljegren, 2026-07-13)
- f96771d30 - fix(vscode): address chat search review findings from testing round (Sylwester Liljegren, 2026-07-13)
- 3d28bfc50 - fix(vscode): style No results as neutral text, not an error (Sylwester Liljegren, 2026-07-13)
- db9da24a3 - feat(vscode): show No results text in chat search when nothing matches (Sylwester Liljegren, 2026-07-13)
- d402df2cf - fix(vscode): jump to first match automatically while typing/toggling (Sylwester Liljegren, 2026-07-13)
- f4f23e1e3 - fix(vscode): match search text to error-row rendering for all variants (Sylwester Liljegren, 2026-07-13)
- 628ce6da9 - fix(vscode): address CI failure and review feedback on chat search (Sylwester Liljegren, 2026-07-13)
- 7a7c28c27 - feat(vscode): add in-chat search for the current session (Sylwester Liljegren, 2026-07-13)
- f6149e8b1 - fix(agent-manager): accept Windows workspace path casing (#12152) (Marius, 2026-07-13)
- d17041f7a - chore(script): reconcile team list with active maintainers (marius-kilocode, 2026-07-13)
- 77f798399 - fix(cli): resolve latest CLI release when GitHub latest points to non-CLI tag (#12148) (Ulises Millán, 2026-07-13)
- 76f6002ab - fix(vscode): use unknown bridge for migration message casts (marius-kilocode, 2026-07-13)
- 6d61b45dd - refactor(vscode): extract legacy-migration message cases out of webview switch (marius-kilocode, 2026-07-13)
- 411125ea3 - Merge branch 'main' into feat/vscode-file-picker-mention (Marius, 2026-07-13)
- bf2b33b87 - fix(cli): use filePath in Gemini prompt (Thomas Brugman, 2026-07-13)
- 135c2c4e9 - test(sandbox): stabilize fragmented ClientHello coverage (marius-kilocode, 2026-07-13)
- 05dadaaae - fix(cli): skip thinkingLevel for Gemma models on Google provider (umi008, 2026-07-12)
- c550475d6 - Merge branch 'main' into fix/indexing-model-validation (rakshith1928, 2026-07-12)
- bb4a71d9d - fix(cli): skip indexing model validation when disabled (Rakshith N, 2026-07-12)
- ad2cc712d - chore(cli): add changeset for invalid indexing model error (Rakshith N, 2026-07-11)
- f1a0012cf - test(cli): cover valid explicit indexing model passthrough (Rakshith N, 2026-07-11)
- 8b94c3612 - test(cli): assert invalid indexing model surfaces an error status (Rakshith N, 2026-07-11)
- 2a68c3b0b - fix(cli): surface indexing model misconfiguration as an error status (Rakshith N, 2026-07-11)
- 17d0d9bdf - fix(cli): validate indexing model configuration for kilo provider (Rakshith N, 2026-07-11)
- 9887e43fc - test: annotate Gemini schema regressions (King Star, 2026-07-11)
- 22d6edbe5 - fix(cli): release file handles after reads (marius-kilocode, 2026-07-10)
- 38d8ea815 - test(cli): expose Windows atomic replacement failure (marius-kilocode, 2026-07-10)
- 4cf073728 - test(cli): reproduce retained Windows file handles (marius-kilocode, 2026-07-10)
- 758558090 - Merge remote-tracking branch 'origin/main' into decorous-lever (marius-kilocode, 2026-07-10)
- 94b553b91 - fix: restore GPT-5.6 reasoning summaries (marius-kilocode, 2026-07-10)
- c8dec4187 - fix(vscode): preserve timeline highlight while streaming (marius-kilocode, 2026-07-09)
- 961b65b8b - test(vscode): cover shared transcript predicates (marius-kilocode, 2026-07-09)
- 3eb47faaf - fix(vscode): align timeline highlights with transcript (marius-kilocode, 2026-07-09)
- 2040f6c89 - feat(vscode): highlight the transcript part behind a hovered timeline bar (Sylwester Liljegren, 2026-07-09)
- 80d2109bf - fix(vscode): normalize path traversal before workspace-containment check (Sylwester Liljegren, 2026-07-08)
- a41b81c0a - fix(vscode): don't auto-attach out-of-workspace files picked via the file picker (Sylwester Liljegren, 2026-07-08)
- c382cc38f - fix(vscode): focus textarea before execCommand in insertFilePickerResult (Sylwester Liljegren, 2026-07-08)
- 4b7fcee2f - fix(vscode): address file-picker mention review feedback (Sylwester Liljegren, 2026-07-08)
- 1dfed4858 - Merge remote-tracking branch 'upstream/main' into feat/vscode-file-picker-mention (Sylwester Liljegren, 2026-07-08)
- b2831c20d - feat(vscode): add file picker to @ mention dropdown (Sylwester Liljegren, 2026-07-08)
- 3c0c25c75 - Merge branch 'main' into fix/gemini-schema-required (Christiaan Arnoldus, 2026-07-07)
- cac82a36c - docs: add Gemini MCP schema changeset (King Star, 2026-07-06)
- b07dff53a - fix: sanitize empty Gemini object requirements (King Star, 2026-07-06)
- 654e10e25 - fix(cli): show Kilo Gateway login rate limit message (Mohammad Javad Naderi, 2026-06-30)
- 71e94bb4e - fix(agent-manager): track pending worktree sessions (Marius Wichtner, 2026-06-29)
- 5f9d21e5f - Merge branch 'main' into bittersweet-height (Marius, 2026-06-29)
- 0a221c48a - fix(agent-manager): preserve selected root sessions (Marius Wichtner, 2026-06-29)
- 64607b9d3 - fix(agent-manager): avoid focusing sparse sessions (Marius Wichtner, 2026-06-29)
- 5735e0f65 - chore(vscode): format agent manager files (marius-kilocode, 2026-06-29)
- 5a79cf969 - fix(agent-manager): hide sparse session tabs (Marius Wichtner, 2026-06-29)
- 26f0a7635 - Merge remote-tracking branch 'origin/main' into bittersweet-height (marius-kilocode, 2026-06-29)
- d133e0f9d - fix(agent-manager): keep sandbox grants valid during setup (marius-kilocode, 2026-06-29)
- 8364c1b1f - Merge remote-tracking branch 'origin/main' into dust-ranunculus (marius-kilocode, 2026-06-29)
- 6422345ee - Merge branch 'main' into waiting-mayonnaise (Marius Wichtner, 2026-06-29)
- 76b21524c - Merge branch 'main' into kaput-breath (Marius Wichtner, 2026-06-29)
- cf8cc4242 - fix(agent-manager): guard sandbox inheritance source (marius-kilocode, 2026-06-29)
- 6a3e5f390 - fix(agent-manager): inherit sandbox for tool-started sessions (marius-kilocode, 2026-06-29)
- e7b3598ec - fix(agent-manager): discard stale prompt enhancements (marius-kilocode, 2026-06-25)
- 20d84aea6 - fix(agent-manager): isolate worktree prompt enhancement (marius-kilocode, 2026-06-25)
- c8047e65f - feat(agent-manager): add prompt enhancer to worktree dialog (marius-kilocode, 2026-06-25)
- 908f3bd21 - fix(agent-manager): resolve subagent ancestry before filtering (marius-kilocode, 2026-06-22)
- be7418f94 - fix(agent-manager): keep subagents out of tabs (marius-kilocode, 2026-06-22)
- c9a772c00 - Merge remote-tracking branch 'origin/main' into dust-ranunculus (marius-kilocode, 2026-06-19)
- 6cfcc0743 - fix(agent-manager): release adopted draft state (marius-kilocode, 2026-06-19)
- 3a4438e74 - fix(agent-manager): stop sessions when closing tabs (marius-kilocode, 2026-06-18)
- 0c743e171 - refactor(agent-manager): simplify local tab updates (marius-kilocode, 2026-05-21)
- 2ef897a0b - fix(vscode): address local tab review feedback (marius-kilocode, 2026-05-21)
- e4a03db37 - test(vscode): exempt sidebar tab context in Agent Manager (marius-kilocode, 2026-05-21)
- 4051eec17 - feat(vscode): add local session tabs (marius-kilocode, 2026-05-20)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/core/src/tool/AGENTS.md` (+139, -0)
- `packages/core/src/tool/application-tools.ts` (+51, -0)
- `packages/core/src/tool/apply-patch.ts` (+176, -0)
- `packages/core/src/tool/bash.ts` (+206, -0)
- `packages/core/src/tool/builtins.ts` (+43, -0)
- `packages/core/src/tool/edit.ts` (+177, -0)
- `packages/core/src/tool/glob.ts` (+90, -0)
- `packages/core/src/tool/grep.ts` (+106, -0)
- `packages/core/src/tool/native.ts` (+73, -0)
- `packages/core/src/tool/question.ts` (+76, -0)
- `packages/core/src/tool/read.ts` (+100, -0)
- `packages/core/src/tool/registry.ts` (+198, -0)
- `packages/core/src/tool/skill.ts` (+108, -0)
- `packages/core/src/tool/todowrite.ts` (+50, -0)
- `packages/core/src/tool/webfetch.ts` (+224, -0)
- `packages/core/src/tool/websearch.ts` (+258, -0)
- `packages/core/src/tool/write.ts` (+78, -0)
- `packages/opencode/src/kilocode/tool/agent-manager-models.ts` (+2, -2)
- `packages/opencode/src/kilocode/tool/agent-manager.ts` (+9, -0)
- `packages/opencode/src/kilocode/tool/background-process.ts` (+2, -2)
- `packages/opencode/src/kilocode/tool/encoded-io.ts` (+4, -4)
- `packages/opencode/src/kilocode/tool/generate-image.ts` (+2, -2)
- `packages/opencode/src/kilocode/tool/interactive-terminal.ts` (+2, -2)
- `packages/opencode/src/{tool/repo_overview.ts => kilocode/tool/repo-overview.ts}` (+6, -6)
- `packages/opencode/src/{tool/repo_overview.txt => kilocode/tool/repo-overview.txt}` (+0, -0)
- `packages/opencode/src/kilocode/tool/task.ts` (+7, -6)
- `packages/opencode/src/tool/apply_patch.ts` (+10, -10)
- `packages/opencode/src/tool/edit.ts` (+50, -27)
- `packages/opencode/src/tool/external-directory.ts` (+4, -4)
- `packages/opencode/src/tool/glob.ts` (+3, -3)
- `packages/opencode/src/tool/grep.ts` (+5, -7)
- `packages/opencode/src/tool/lsp.ts` (+2, -2)
- `packages/opencode/src/tool/read.ts` (+58, -10)
- `packages/opencode/src/tool/recall.ts` (+11, -9)
- `packages/opencode/src/tool/registry.ts` (+37, -25)
- `packages/opencode/src/tool/shell.ts` (+17, -8)
- `packages/opencode/src/tool/skill.ts` (+1, -1)
- `packages/opencode/src/tool/task.ts` (+138, -84)
- `packages/opencode/src/tool/task.txt` (+6, -5)
- `packages/opencode/src/tool/tool.ts` (+5, -3)
- `packages/opencode/src/tool/truncate.ts` (+3, -3)
- `packages/opencode/src/tool/warpgrep.ts` (+9, -8)
- `packages/opencode/src/tool/webfetch.ts` (+1, -1)
- `packages/opencode/src/tool/write.ts` (+9, -9)
- `packages/opencode/test/kilocode/tool/memory-recall.test.ts` (+1, -0)
- `packages/opencode/test/{tool/repo_overview.test.ts => kilocode/tool/repo-overview.test.ts}` (+13, -13)
- `packages/opencode/test/{ => kilocode}/tool/repo_clone.test.ts` (+13, -13)
- `packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap` (+7, -14)
- `packages/opencode/test/tool/apply_patch.test.ts` (+4, -4)
- `packages/opencode/test/tool/edit.test.ts` (+67, -22)
- `packages/opencode/test/tool/external-directory.test.ts` (+23, -25)
- `packages/opencode/test/tool/glob.test.ts` (+9, -8)
- `packages/opencode/test/tool/grep.test.ts` (+12, -10)
- `packages/opencode/test/tool/lsp.test.ts` (+84, -89)
- `packages/opencode/test/tool/parameters.test.ts` (+16, -2)
- `packages/opencode/test/tool/question.test.ts` (+8, -5)
- `packages/opencode/test/tool/read.test.ts` (+40, -16)
- `packages/opencode/test/tool/recall.test.ts` (+3, -3)
- `packages/opencode/test/tool/registry.test.ts` (+18, -13)
- `packages/opencode/test/tool/shell.test.ts` (+48, -40)
- `packages/opencode/test/tool/skill.test.ts` (+86, -87)
- `packages/opencode/test/tool/task.test.ts` (+251, -13)
- `packages/opencode/test/tool/truncation.test.ts` (+9, -8)
- `packages/opencode/test/tool/websearch.test.ts` (+7, -6)
- `packages/opencode/test/tool/write.test.ts` (+4, -4)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+20, -11)
- `packages/opencode/src/agent/subagent-permissions.ts` (+3, -2)
- `packages/opencode/test/agent/agent.test.ts` (+13, -11)
- `packages/opencode/test/agent/plan-mode-subagent-bypass.test.ts` (+4, -3)
- `packages/opencode/test/agent/plugin-agent-regression.test.ts` (+6, -6)

#### Permission System (**/permission/)
- `packages/core/src/permission/saved.ts` (+87, -0)
- `packages/core/src/permission/schema.ts` (+16, -0)
- `packages/core/src/permission/sql.ts` (+20, -0)
- `packages/opencode/src/kilocode/permission/allow-everything.ts` (+2, -5)
- `packages/opencode/src/kilocode/permission/drain.ts` (+10, -13)
- `packages/opencode/src/kilocode/permission/headless.ts` (+22, -18)
- `packages/opencode/src/permission/evaluate.ts` (+1, -1)
- `packages/opencode/src/permission/index.ts` (+103, -148)
- `packages/opencode/src/permission/schema.ts` (+0, -13)
- `packages/opencode/test/kilocode/permission/env-read.test.ts` (+15, -9)
- `packages/opencode/test/kilocode/permission/external-directory-allow.test.ts` (+17, -11)
- `packages/opencode/test/kilocode/permission/next.always-rules.test.ts` (+78, -72)
- `packages/opencode/test/kilocode/permission/next.reply-routing.test.ts` (+19, -12)
- `packages/opencode/test/permission/next.test.ts` (+73, -59)

#### Event Bus (**/bus/, **/event/)
- `packages/core/src/event/sql.ts` (+25, -0)
- `packages/opencode/src/bus/index.ts` (+4, -0)
- `packages/opencode/test/bus/bus-effect.test.ts` (+0, -288)
- `packages/opencode/test/bus/bus-integration.test.ts` (+0, -88)
- `packages/opencode/test/bus/bus.test.ts` (+0, -240)

#### Core (**/core/)
- `packages/core/migration/20260511173437_session-metadata/migration.sql` (+1, -0)
- `packages/core/migration/20260511173437_session-metadata/snapshot.json` (+1560, -0)
- `packages/core/migration/20260601010001_normalize_storage_paths/migration.sql` (+7, -0)
- `packages/core/migration/20260601010001_normalize_storage_paths/snapshot.json` (+1560, -0)
- `packages/core/migration/20260601202201_amazing_prowler/migration.sql` (+1, -0)
- `packages/core/migration/20260601202201_amazing_prowler/snapshot.json` (+1498, -0)
- `packages/core/migration/20260602002951_lowly_union_jack/migration.sql` (+11, -0)
- `packages/core/migration/20260602002951_lowly_union_jack/snapshot.json` (+1602, -0)
- `packages/core/migration/20260602182828_add_project_directories/migration.sql` (+8, -0)
- `packages/core/migration/20260602182828_add_project_directories/snapshot.json` (+1664, -0)
- `packages/core/migration/20260603001617_session_message_projection_indexes/migration.sql` (+5, -0)
- `packages/core/migration/20260603001617_session_message_projection_indexes/snapshot.json` (+1636, -0)
- `packages/core/migration/20260603040000_session_message_projection_order/migration.sql` (+6, -0)
- `packages/core/migration/20260603040000_session_message_projection_order/snapshot.json` (+1638, -0)
- `packages/core/migration/20260603141458_session_input_inbox/migration.sql` (+12, -0)
- `packages/core/migration/20260603141458_session_input_inbox/snapshot.json` (+1759, -0)
- `packages/core/migration/20260603160727_jittery_ezekiel_stane/migration.sql` (+4, -0)
- `packages/core/migration/20260603160727_jittery_ezekiel_stane/snapshot.json` (+1869, -0)
- `packages/core/migration/20260604172448_event_sourced_session_input/migration.sql` (+28, -0)
- `packages/core/migration/20260604172448_event_sourced_session_input/snapshot.json` (+1898, -0)
- `packages/core/migration/20260605003541_add_session_context_snapshot/migration.sql` (+9, -0)
- `packages/core/migration/20260605003541_add_session_context_snapshot/snapshot.json` (+1980, -0)
- `packages/core/migration/20260605042240_add_context_epoch_agent/migration.sql` (+1, -0)
- `packages/core/migration/20260605042240_add_context_epoch_agent/snapshot.json` (+2083, -0)
- `packages/core/package.json` (+52, -7)
- `packages/core/script/migration.ts` (+132, -0)
- `packages/core/src/account.ts` (+75, -305)
- `packages/core/src/agent.ts` (+47, -9)
- `packages/core/src/aisdk.ts` (+20, -11)
- `packages/core/src/auth.ts` (+352, -0)
- `packages/core/src/background-job.ts` (+364, -0)
- `packages/core/src/catalog.ts` (+41, -31)
- `packages/core/src/command.ts` (+68, -0)
- `packages/core/src/config.ts` (+64, -53)
- `packages/core/src/config/agent.ts` (+3, -3)
- `packages/core/src/config/command.ts` (+12, -0)
- `packages/core/src/config/markdown.ts` (+36, -0)
- `packages/core/src/config/plugin/agent.ts` (+101, -23)
- `packages/core/src/config/plugin/command.ts` (+84, -0)
- `packages/core/src/config/plugin/provider.ts` (+10, -21)
- `packages/core/src/config/plugin/skill.ts` (+48, -0)
- `packages/core/src/config/provider.ts` (+21, -12)
- `packages/core/src/config/reference.ts` (+31, -0)
- `packages/core/src/control-plane/move-session.ts` (+128, -0)
- `packages/core/src/database/database.ts` (+67, -0)
- `packages/core/src/database/migration.gen.ts` (+38, -0)
- `packages/core/src/database/migration.ts` (+59, -0)
- `packages/core/src/database/migration/20260127222353_familiar_lady_ursula.ts` (+107, -0)
- `packages/core/src/database/migration/20260211171708_add_project_commands.ts` (+11, -0)
- `packages/core/src/database/migration/20260213144116_wakeful_the_professor.ts` (+23, -0)
- `packages/core/src/database/migration/20260225215848_workspace.ts` (+19, -0)
- `packages/core/src/database/migration/20260227213759_add_session_workspace_id.ts` (+12, -0)
- `packages/core/src/database/migration/20260228203230_blue_harpoon.ts` (+30, -0)
- `packages/core/src/database/migration/20260303231226_add_workspace_fields.ts` (+15, -0)
- `packages/core/src/database/migration/20260309230000_move_org_to_state.ts` (+15, -0)
- `packages/core/src/database/migration/20260312043431_session_message_cursor.ts` (+16, -0)
- `packages/core/src/database/migration/20260323234822_events.ts` (+26, -0)
- `packages/core/src/database/migration/20260410174513_workspace-name.ts` (+29, -0)
- `packages/core/src/database/migration/20260413175956_chief_energizer.ts` (+24, -0)
- `packages/core/src/database/migration/20260423070820_add_icon_url_override.ts` (+14, -0)
- `packages/core/src/database/migration/20260427172553_slow_nightmare.ts` (+30, -0)
- `packages/core/src/database/migration/20260428004200_add_session_path.ts` (+11, -0)
- `packages/core/src/database/migration/20260501142318_next_venus.ts` (+12, -0)
- `packages/core/src/database/migration/20260504145000_add_sync_owner.ts` (+11, -0)
- `packages/core/src/database/migration/20260507164347_add_workspace_time.ts` (+11, -0)
- `packages/core/src/database/migration/20260510033149_session_usage.ts` (+56, -0)
- `packages/core/src/database/migration/20260511000411_data_migration_state.ts` (+16, -0)
- `packages/core/src/database/migration/20260511173437_session-metadata.ts` (+16, -0)
- `packages/core/src/database/migration/20260601010001_normalize_storage_paths.ts` (+22, -0)
- `packages/core/src/database/migration/20260601202201_amazing_prowler.ts` (+11, -0)
- `packages/core/src/database/migration/20260602002951_lowly_union_jack.ts` (+24, -0)
- `packages/core/src/database/migration/20260602182828_add_project_directories.ts` (+20, -0)
- `packages/core/src/database/migration/20260603001617_session_message_projection_indexes.ts` (+19, -0)
- `packages/core/src/database/migration/20260603040000_session_message_projection_order.ts` (+19, -0)
- `packages/core/src/database/migration/20260603141458_session_input_inbox.ts` (+25, -0)
- `packages/core/src/database/migration/20260603160727_jittery_ezekiel_stane.ts` (+20, -0)
- `packages/core/src/database/migration/20260604172448_event_sourced_session_input.ts` (+47, -0)
- `packages/core/src/database/migration/20260605003541_add_session_context_snapshot.ts` (+21, -0)
- `packages/core/src/database/migration/20260605042240_add_context_epoch_agent.ts` (+11, -0)
- `packages/core/src/database/path.ts` (+91, -0)
- `packages/core/src/database/sqlite.bun.ts` (+183, -0)
- `packages/core/src/database/sqlite.node.ts` (+178, -0)
- `packages/core/src/database/sqlite.ts` (+8, -0)
- `packages/core/src/effect/keyed-mutex.ts` (+45, -0)
- `packages/core/src/event.ts` (+598, -75)
- `packages/core/src/file-mutation.ts` (+212, -0)
- `packages/core/src/filesystem.ts` (+553, -231)
- `packages/core/src/filesystem/watcher.ts` (+142, -0)
- `packages/core/src/flag/flag.ts` (+5, -2)
- `packages/core/src/fs-util.ts` (+250, -0)
- `packages/core/src/git.ts` (+330, -12)
- `packages/core/src/id/id.ts` (+80, -0)
- `packages/core/src/instruction-context.ts` (+92, -0)
- `packages/core/src/location-layer.ts` (+112, -7)
- `packages/core/src/location-mutation.ts` (+311, -0)
- `packages/core/src/location-search.ts` (+198, -0)
- `packages/core/src/location.ts` (+16, -10)
- `packages/core/src/markdown.d.ts` (+4, -0)
- `packages/core/src/model.ts` (+22, -14)
- `packages/core/src/models-dev.ts` (+23, -5)
- `packages/core/src/npm.ts` (+3, -3)
- `packages/core/src/patch.ts` (+197, -0)
- `packages/core/src/permission.ts` (+309, -25)
- `packages/core/src/plugin.ts` (+39, -20)
- `packages/core/src/plugin/account.ts` (+12, -8)
- `packages/core/src/plugin/agent.ts` (+34, -38)
- `packages/core/src/plugin/boot.ts` (+37, -12)
- `packages/core/src/plugin/command.ts` (+29, -0)
- `packages/core/src/plugin/command/initialize.txt` (+66, -0)
- `packages/core/src/plugin/command/review.txt` (+100, -0)
- `packages/core/src/plugin/models-dev.ts` (+12, -10)
- `packages/core/src/plugin/provider.ts` (+69, -1)
- `packages/core/src/plugin/provider/amazon-bedrock.ts` (+31, -8)
- `packages/core/src/plugin/provider/anthropic.ts` (+3, -3)
- `packages/core/src/plugin/provider/azure.ts` (+10, -10)
- `packages/core/src/plugin/provider/cerebras.ts` (+3, -3)
- `packages/core/src/plugin/provider/cloudflare-workers-ai.ts` (+8, -8)
- `packages/core/src/plugin/provider/github-copilot.ts` (+4, -4)
- `packages/core/src/plugin/provider/gitlab.ts` (+6, -8)
- `packages/core/src/plugin/provider/google-vertex.ts` (+19, -19)
- `packages/core/src/plugin/provider/index.ts` (+0, -67)
- `packages/core/src/plugin/provider/kilo.ts` (+4, -4)
- `packages/core/src/plugin/provider/llmgateway.ts` (+6, -6)
- `packages/core/src/plugin/provider/nvidia.ts` (+6, -6)
- `packages/core/src/plugin/provider/openai.ts` (+3, -3)
- `packages/core/src/plugin/provider/opencode.ts` (+2, -2)
- `packages/core/src/plugin/provider/openrouter.ts` (+4, -4)
- `packages/core/src/plugin/provider/sap-ai-core.ts` (+1, -1)
- `packages/core/src/plugin/provider/snowflake-cortex.ts` (+86, -0)
- `packages/core/src/plugin/provider/vercel.ts` (+4, -4)
- `packages/core/src/plugin/provider/xai.ts` (+1, -1)
- `packages/core/src/plugin/provider/zenmux.ts` (+5, -5)
- `packages/core/src/plugin/skill.ts` (+34, -0)
- `packages/core/src/plugin/skill/customize-opencode.md` (+376, -0)
- `packages/core/src/policy.ts` (+3, -1)
- `packages/core/src/process.ts` (+3, -3)
- `packages/core/src/project-reference.ts` (+241, -0)
- `packages/core/src/project.ts` (+34, -5)
- `packages/core/src/project/copy-strategies.ts` (+47, -0)
- `packages/core/src/project/copy.ts` (+273, -0)
- `packages/core/src/project/sql.ts` (+34, -0)
- `packages/core/src/provider.ts` (+18, -52)
- `packages/core/src/pty.ts` (+321, -0)
- `packages/core/src/pty/driver.ts` (+2, -0)
- `packages/core/src/public/agent.ts` (+6, -0)
- `packages/core/src/public/index.ts` (+9, -0)
- `packages/core/src/public/location.ts` (+6, -0)
- `packages/core/src/public/model.ts` (+9, -0)
- `packages/core/src/public/opencode.ts` (+76, -0)
- `packages/core/src/public/session.ts` (+91, -0)
- `packages/core/src/public/tool.ts` (+17, -0)
- `packages/core/src/question.ts` (+198, -0)
- `packages/core/src/repository-cache.ts` (+291, -0)
- `packages/core/src/repository.ts` (+208, -0)
- `packages/core/src/ripgrep.ts` (+192, -0)
- `packages/core/src/schema.ts` (+19, -4)
- `packages/core/src/session-message-updater.ts` (+0, -417)
- `packages/core/src/session.ts` (+421, -10)
- `packages/core/src/session/context-epoch.ts` (+343, -0)
- `packages/core/src/session/error.ts` (+20, -0)
- `packages/core/src/{session-event.ts => session/event.ts}` (+156, -67)
- `packages/core/src/session/execution.ts` (+18, -0)
- `packages/core/src/session/execution/local.ts` (+35, -0)
- `packages/core/src/session/history.ts` (+92, -0)
- `packages/core/src/session/info.ts` (+47, -0)
- `packages/core/src/session/input.ts` (+354, -0)
- `packages/core/src/session/message-id.ts` (+13, -0)
- `packages/core/src/session/message-updater.ts` (+430, -0)
- `packages/core/src/{session-message.ts => session/message.ts}` (+33, -12)
- `packages/core/src/session/projector.ts` (+465, -0)
- `packages/core/src/{session-prompt.ts => session/prompt.ts}` (+12, -1)
- `packages/core/src/session/run-coordinator.ts` (+183, -0)
- `packages/core/src/session/runner/index.ts` (+37, -0)
- `packages/core/src/session/runner/llm.ts` (+320, -0)
- `packages/core/src/session/runner/model.ts` (+141, -0)
- `packages/core/src/session/runner/publish-llm-event.ts` (+402, -0)
- `packages/core/src/session/runner/to-llm-message.ts` (+141, -0)
- `packages/core/src/session/schema.ts` (+49, -0)
- `packages/core/src/session/sql.ts` (+178, -0)
- `packages/core/src/session/store.ts` (+60, -0)
- `packages/core/src/session/todo.ts` (+91, -0)
- `packages/core/src/skill.ts` (+161, -0)
- `packages/core/src/skill/discovery.ts` (+174, -0)
- `packages/core/src/skill/guidance.ts` (+76, -0)
- `packages/core/src/snapshot.ts` (+9, -0)
- `packages/core/src/state.ts` (+44, -12)
- `packages/core/src/system-context/builtins.ts` (+47, -0)
- `packages/core/src/system-context/index.ts` (+316, -0)
- `packages/core/src/system-context/registry.ts` (+46, -0)
- `packages/core/src/tool-output-store.ts` (+362, -0)
- `packages/core/src/tool-output.ts` (+7, -14)
- `packages/core/src/util/effect-flock.ts` (+4, -4)
- `packages/core/src/util/hash.ts` (+4, -0)
- `packages/core/src/v1/config/agent.ts` (+167, -0)
- `packages/core/src/v1/config/command.ts` (+13, -0)
- `packages/core/src/v1/config/config.ts` (+336, -0)
- `packages/core/src/v1/config/migrate.ts` (+261, -0)
- `packages/core/src/v1/config/plugin.ts` (+9, -0)
- `packages/core/src/v1/config/provider-options.ts` (+211, -0)
- `packages/core/src/v1/config/reference.ts` (+24, -0)
- `packages/core/src/v1/permission.ts` (+96, -0)
- `packages/core/src/v1/session.ts` (+649, -0)
- `packages/core/src/workspace.ts` (+18, -0)
- `packages/core/test/account.test.ts` (+40, -43)
- `packages/core/test/agent.test.ts` (+31, -1)
- `packages/core/test/application-tools.test.ts` (+184, -0)
- `packages/core/test/background-job.test.ts` (+103, -0)
- `packages/core/test/catalog.test.ts` (+68, -37)
- `packages/core/test/command.test.ts` (+56, -0)
- `packages/core/test/config/agent.test.ts` (+131, -39)
- `packages/core/test/config/command.test.ts` (+81, -0)
- `packages/core/test/config/config.test.ts` (+269, -48)
- `packages/core/test/config/provider-options.test.ts` (+211, -0)
- `packages/core/test/config/provider.test.ts` (+20, -21)
- `packages/core/test/config/skill.test.ts` (+77, -0)
- `packages/core/test/database-migration.test.ts` (+513, -0)
- `packages/core/test/effect/keyed-mutex.test.ts` (+73, -0)
- `packages/core/test/event.test.ts` (+1023, -17)
- `packages/core/test/file-mutation.test.ts` (+357, -0)
- `packages/core/test/filesystem/filesystem.test.ts` (+54, -34)
- `packages/core/test/filesystem/ignore.test.ts` (+10, -0)
- `packages/core/test/filesystem/watcher.test.ts` (+273, -0)
- `packages/core/test/fixture/effect-flock-worker.ts` (+2, -2)
- `packages/core/test/fixture/git.ts` (+49, -0)
- `packages/core/test/fixture/tmpdir.ts` (+14, -2)
- `packages/core/test/fixtures/recordings/session-runner/openai-chat-streams-text.json` (+27, -0)
- `packages/core/test/git.test.ts` (+106, -0)
- `packages/core/test/instruction-context.test.ts` (+297, -0)
- `packages/core/test/kilocode/account-auth-v2-migration.test.ts` (+7, -7)
- `packages/core/test/kilocode/filesystem-containment.test.ts` (+3, -3)
- `packages/core/test/kilocode/provider-isolation.test.ts` (+8, -8)
- `packages/core/test/location-filesystem.test.ts` (+427, -0)
- `packages/core/test/location-layer.test.ts` (+122, -0)
- `packages/core/test/location-mutation.test.ts` (+234, -0)
- `packages/core/test/location-search.test.ts` (+285, -0)
- `packages/core/test/location.test.ts` (+5, -2)
- `packages/core/test/models.test.ts` (+32, -5)
- `packages/core/test/move-session.test.ts` (+249, -0)
- `packages/core/test/npm.test.ts` (+2, -2)
- `packages/core/test/patch.test.ts` (+68, -0)
- `packages/core/test/permission.test.ts` (+291, -0)
- `packages/core/test/plugin.test.ts` (+90, -0)
- `packages/core/test/plugin/command.test.ts` (+47, -0)
- `packages/core/test/plugin/provider-alibaba.test.ts` (+3, -3)
- `packages/core/test/plugin/provider-amazon-bedrock.test.ts` (+94, -9)
- `packages/core/test/plugin/provider-anthropic.test.ts` (+7, -7)
- `packages/core/test/plugin/provider-azure-cognitive-services.test.ts` (+11, -11)
- `packages/core/test/plugin/provider-azure.test.ts` (+28, -35)
- `packages/core/test/plugin/provider-cerebras.test.ts` (+4, -4)
- `packages/core/test/plugin/provider-cloudflare-workers-ai.test.ts` (+22, -25)
- `packages/core/test/plugin/provider-cohere.test.ts` (+1, -1)
- `packages/core/test/plugin/provider-deepinfra.test.ts` (+5, -2)
- `packages/core/test/plugin/provider-dynamic.test.ts` (+9, -7)
- `packages/core/test/plugin/provider-github-copilot.test.ts` (+4, -4)
- `packages/core/test/plugin/provider-gitlab.test.ts` (+24, -28)
- `packages/core/test/plugin/provider-google-vertex-anthropic.test.ts` (+8, -8)
- `packages/core/test/plugin/provider-google-vertex.test.ts` (+24, -24)
- `packages/core/test/plugin/provider-google.test.ts` (+8, -9)
- `packages/core/test/plugin/provider-groq.test.ts` (+9, -10)
- `packages/core/test/plugin/provider-helper.ts` (+27, -24)
- `packages/core/test/plugin/provider-kilo.test.ts` (+31, -39)
- `packages/core/test/plugin/provider-llmgateway.test.ts` (+9, -9)
- `packages/core/test/plugin/provider-mistral.test.ts` (+3, -3)
- `packages/core/test/plugin/provider-nvidia.test.ts` (+17, -18)
- `packages/core/test/plugin/provider-openai.test.ts` (+5, -3)
- `packages/core/test/plugin/provider-opencode.test.ts` (+13, -17)
- `packages/core/test/plugin/provider-openrouter.test.ts` (+8, -8)
- `packages/core/test/plugin/provider-perplexity.test.ts` (+1, -1)
- `packages/core/test/plugin/provider-snowflake-cortex.test.ts` (+193, -0)
- `packages/core/test/plugin/provider-togetherai.test.ts` (+1, -1)
- `packages/core/test/plugin/provider-vercel.test.ts` (+10, -10)
- `packages/core/test/plugin/provider-xai.test.ts` (+7, -6)
- `packages/core/test/plugin/provider-zenmux.test.ts` (+17, -19)
- `packages/core/test/plugin/skill.test.ts` (+32, -0)
- `packages/core/test/policy.test.ts` (+1, -1)
- `packages/core/test/process/process.test.ts` (+59, -1)
- `packages/core/test/project-copy.test.ts` (+285, -0)
- `packages/core/test/project-reference.test.ts` (+299, -0)
- `packages/core/test/project.test.ts` (+81, -21)
- `packages/core/test/pty/pty-output-isolation.test.ts` (+110, -0)
- `packages/core/test/pty/pty-session.test.ts` (+91, -0)
- `packages/core/test/public-opencode.test.ts` (+38, -0)
- `packages/core/test/question.test.ts` (+115, -0)
- `packages/core/test/repository-cache.test.ts` (+125, -0)
- `packages/core/test/repository.test.ts` (+65, -0)
- `packages/core/test/session-create.test.ts` (+350, -0)
- `packages/core/test/session-projector.test.ts` (+593, -0)
- `packages/core/test/session-prompt.test.ts` (+551, -0)
- `packages/core/test/session-run-coordinator.test.ts` (+384, -0)
- `packages/core/test/session-runner-message.test.ts` (+383, -0)
- `packages/core/test/session-runner-model.test.ts` (+213, -0)
- `packages/core/test/session-runner-recorded.test.ts` (+168, -0)
- `packages/core/test/session-runner-tool-registry.test.ts` (+211, -0)
- `packages/core/test/session-runner.test.ts` (+3137, -0)
- `packages/core/test/session-todo.test.ts` (+95, -0)
- `packages/core/test/session-tool-progress.test.ts` (+161, -0)
- `packages/core/test/skill-discovery.test.ts` (+104, -0)
- `packages/core/test/skill.test.ts` (+129, -0)
- `packages/core/test/skill/guidance.test.ts` (+154, -0)
- `packages/core/test/system-context/builtins.test.ts` (+127, -0)
- `packages/core/test/system-context/index.test.ts` (+307, -0)
- `packages/core/test/system-context/registry.test.ts` (+113, -0)
- `packages/core/test/tool-apply-patch.test.ts` (+368, -0)
- `packages/core/test/tool-bash.test.ts` (+406, -0)
- `packages/core/test/tool-edit.test.ts` (+458, -0)
- `packages/core/test/tool-glob.test.ts` (+231, -0)
- `packages/core/test/tool-grep.test.ts` (+286, -0)
- `packages/core/test/tool-output-store.test.ts` (+265, -0)
- `packages/core/test/tool-question.test.ts` (+119, -0)
- `packages/core/test/tool-read.test.ts` (+402, -0)
- `packages/core/test/tool-skill.test.ts` (+182, -0)
- `packages/core/test/tool-todowrite.test.ts` (+106, -0)
- `packages/core/test/tool-webfetch.test.ts` (+295, -0)
- `packages/core/test/tool-websearch.test.ts` (+331, -0)
- `packages/core/test/tool-write.test.ts` (+328, -0)
- `packages/core/test/util/effect-flock.test.ts` (+2, -2)
- `packages/kilo-indexing/src/indexing/orchestrator.ts` (+1, -2)
- `packages/kilo-indexing/test/kilocode/indexing/orchestrator.test.ts` (+0, -29)

#### Other Changes
- `.changeset/agent-manager-inherit-model.md` (+0, -5)
- `.changeset/clean-windows-file-handles.md` (+5, -0)
- `.changeset/clear-model-usage.md` (+0, -5)
- `.changeset/faster-vscode-settings-save.md` (+0, -6)
- `.changeset/fix-bedrock-sso.md` (+0, -5)
- `.changeset/fork-session-variant.md` (+5, -0)
- `.changeset/hide-gpt-5-5-pro.md` (+0, -6)
- `.changeset/indexing-invalid-model-error.md` (+5, -0)
- `.changeset/inherit-agent-manager-sandbox.md` (+7, -0)
- `.changeset/jetbrains-dialog-focus-prompt.md` (+0, -5)
- `.changeset/jetbrains-orphan-cli-shutdown.md` (+0, -5)
- `.changeset/jetbrains-platform-stop-icon.md` (+5, -0)
- `.changeset/jetbrains-progress-elapsed-time.md` (+5, -0)
- `.changeset/jetbrains-prompt-action-separator.md` (+5, -0)
- `.changeset/jetbrains-prompt-right-padding.md` (+5, -0)
- `.changeset/jetbrains-prompt-theme.md` (+0, -5)
- `.changeset/jetbrains-prompt-toolbar-focus.md` (+0, -5)
- `.changeset/jetbrains-revert-loading.md` (+0, -5)
- `.changeset/jetbrains-revert-redo.md` (+0, -6)
- `.changeset/jetbrains-rollback-redo-font.md` (+5, -0)
- `.changeset/jetbrains-rollback-snapshot-notice.md` (+0, -5)
- `.changeset/jetbrains-send-scroll-color.md` (+5, -0)
- `.changeset/jetbrains-toolbar-tooltips.md` (+0, -5)
- `.changeset/jetbrains-user-prompt-gap.md` (+0, -5)
- `.changeset/load-initial-diff-previews.md` (+0, -5)
- `.changeset/neat-mammals-fry.md` (+5, -0)
- `.changeset/preserve-compaction-errors.md` (+5, -0)
- `.changeset/quiet-agent-tabs.md` (+5, -0)
- `.changeset/quiet-permissions-speak.md` (+0, -5)
- `.changeset/remove-gpt-task-prompt.md` (+0, -5)
- `.changeset/report-cli-vscode-presence.md` (+6, -0)
- `.changeset/sandbox-controls-setting.md` (+0, -5)
- `.changeset/sandbox-network-destinations.md` (+0, -7)
- `.changeset/serve-parent-watchdog.md` (+0, -6)
- `.changeset/sidebar-tab-close-focus.md` (+5, -0)
- `.changeset/stop-agent-manager-sessions.md` (+6, -0)
- `.changeset/timeline-bar-highlight.md` (+5, -0)
- `.changeset/worktree-dialog-prompt-enhancer.md` (+5, -0)
- `.gitattributes` (+4, -0)
- `.github/workflows/nix-hashes.yml` (+15, -5)
- `.github/workflows/test-jetbrains.yml` (+15, -4)
- `.gitignore` (+2, -0)
- `.opencode-version` (+1, -1)
- `.opencode/command/translate.md` (+1, -1)
- `.opencode/opencode.jsonc` (+3, -0)
- `CONTEXT.md` (+98, -0)
- `bun.lock` (+1078, -221)
- `bunfig.toml` (+1, -1)
- `install` (+8, -4)
- `nix/hashes.json` (+4, -4)
- `package.json` (+26, -14)
- `packages/{opencode => core}/drizzle.config.ts` (+1, -1)
- `packages/{opencode => core}/migration/20260127222353_familiar_lady_ursula/migration.sql` (+0, -0)
- `packages/{opencode => core}/migration/20260127222353_familiar_lady_ursula/snapshot.json` (+0, -0)
- `packages/{opencode => core}/migration/20260211171708_add_project_commands/migration.sql` (+0, -0)
- `packages/{opencode => core}/migration/20260211171708_add_project_commands/snapshot.json` (+0, -0)
- `packages/{opencode => core}/migration/20260213144116_wakeful_the_professor/migration.sql` (+0, -0)
- `packages/{opencode => core}/migration/20260213144116_wakeful_the_professor/snapshot.json` (+0, -0)
- `packages/{opencode => core}/migration/20260225215848_workspace/migration.sql` (+0, -0)
- `packages/{opencode => core}/migration/20260225215848_workspace/snapshot.json` (+0, -0)
- `packages/{opencode => core}/migration/20260227213759_add_session_workspace_id/migration.sql` (+0, -0)
- `packages/{opencode => core}/migration/20260227213759_add_session_workspace_id/snapshot.json` (+0, -0)
- `packages/{opencode => core}/migration/20260228203230_blue_harpoon/migration.sql` (+0, -0)
- `packages/{opencode => core}/migration/20260228203230_blue_harpoon/snapshot.json` (+0, -0)
- `packages/{opencode => core}/migration/20260303231226_add_workspace_fields/migration.sql` (+0, -0)
- `packages/{opencode => core}/migration/20260303231226_add_workspace_fields/snapshot.json` (+0, -0)
- `packages/{opencode => core}/migration/20260309230000_move_org_to_state/migration.sql` (+0, -0)
- `packages/{opencode => core}/migration/20260309230000_move_org_to_state/snapshot.json` (+0, -0)
- `packages/{opencode => core}/migration/20260312043431_session_message_cursor/migration.sql` (+0, -0)
- `packages/{opencode => core}/migration/20260312043431_session_message_cursor/snapshot.json` (+0, -0)
- `packages/{opencode => core}/migration/20260323234822_events/migration.sql` (+0, -0)
- `packages/{opencode => core}/migration/20260323234822_events/snapshot.json` (+0, -0)
- `packages/{opencode => core}/migration/20260410174513_workspace-name/migration.sql` (+0, -0)
- `packages/{opencode => core}/migration/20260410174513_workspace-name/snapshot.json` (+0, -0)
- `packages/{opencode => core}/migration/20260413175956_chief_energizer/migration.sql` (+0, -0)
- `packages/{opencode => core}/migration/20260413175956_chief_energizer/snapshot.json` (+0, -0)
- `packages/{opencode => core}/migration/20260423070820_add_icon_url_override/migration.sql` (+0, -0)
- `packages/{opencode => core}/migration/20260423070820_add_icon_url_override/snapshot.json` (+0, -0)
- `packages/{opencode => core}/migration/20260427172553_slow_nightmare/migration.sql` (+0, -0)
- `packages/{opencode => core}/migration/20260427172553_slow_nightmare/snapshot.json` (+0, -0)
- `packages/{opencode => core}/migration/20260428004200_add_session_path/migration.sql` (+0, -0)
- `packages/{opencode => core}/migration/20260428004200_add_session_path/snapshot.json` (+0, -0)
- `packages/{opencode => core}/migration/20260501142318_next_venus/migration.sql` (+0, -0)
- `packages/{opencode => core}/migration/20260501142318_next_venus/snapshot.json` (+0, -0)
- `packages/{opencode => core}/migration/20260504145000_add_sync_owner/migration.sql` (+0, -0)
- `packages/{opencode => core}/migration/20260504145000_add_sync_owner/snapshot.json` (+0, -0)
- `packages/{opencode => core}/migration/20260507164347_add_workspace_time/migration.sql` (+0, -0)
- `packages/{opencode => core}/migration/20260507164347_add_workspace_time/snapshot.json` (+0, -0)
- `packages/{opencode => core}/migration/20260510033149_session_usage/migration.sql` (+0, -0)
- `packages/{opencode => core}/migration/20260510033149_session_usage/snapshot.json` (+0, -0)
- `packages/{opencode => core}/migration/20260511000411_data_migration_state/migration.sql` (+0, -0)
- `packages/{opencode => core}/migration/20260511000411_data_migration_state/snapshot.json` (+0, -0)
- `packages/{opencode => core}/script/fix-node-pty.ts` (+0, -0)
- `packages/{opencode/src/account/account.sql.ts => core/src/account/sql.ts}` (+9, -9)
- `packages/{opencode => core}/src/control-plane/workspace.sql.ts` (+5, -5)
- `packages/{opencode => core}/src/data-migration.sql.ts` (+0, -0)
- `packages/{opencode/src/storage => core/src/database}/schema.sql.ts` (+0, -0)
- `packages/{opencode/src/file => core/src/filesystem}/ignore.ts` (+6, -20)
- `packages/{opencode/src/file => core/src/filesystem}/protected.ts` (+4, -10)
- `packages/{opencode/src/file => core/src/filesystem}/ripgrep.ts` (+13, -12)
- `packages/{opencode => core}/src/pty/input.ts` (+0, -0)
- `packages/{opencode => core}/src/pty/pty.bun.ts` (+0, -0)
- `packages/{opencode => core}/src/pty/pty.node.ts` (+0, -0)
- `packages/{opencode => core}/src/pty/pty.ts` (+0, -0)
- `packages/{opencode => core}/src/pty/schema.ts` (+2, -3)
- `packages/{opencode => core}/src/pty/ticket.ts` (+4, -14)
- `packages/{opencode/src/share/share.sql.ts => core/src/share/sql.ts}` (+2, -2)
- `packages/{opencode => core}/src/util/which.ts` (+1, -1)
- `packages/{opencode/src => core/src/v1}/config/attachment.ts` (+2, -2)
- `packages/{opencode/src => core/src/v1}/config/console-state.ts` (+3, -1)
- `packages/{opencode/src => core/src/v1}/config/error.ts` (+13, -2)
- `packages/{opencode/src => core/src/v1}/config/formatter.ts` (+1, -1)
- `packages/{opencode/src => core/src/v1}/config/layout.ts` (+2, -2)
- `packages/{opencode/src => core/src/v1}/config/lsp.ts` (+46, -9)
- `packages/{opencode/src => core/src/v1}/config/mcp.ts` (+3, -3)
- `packages/{opencode/src => core/src/v1}/config/permission.ts` (+2, -10)
- `packages/{opencode/src => core/src/v1}/config/provider.ts` (+5, -4)
- `packages/{opencode/src => core/src/v1}/config/server.ts` (+3, -3)
- `packages/{opencode/src => core/src/v1}/config/skills.ts` (+2, -3)
- `packages/{opencode/test/file => core/test/filesystem}/ripgrep.test.ts` (+12, -1)
- `packages/{opencode => core}/test/pty/info-schema.test.ts` (+1, -7)
- `packages/{opencode/test/server/httpapi-pty-websocket.test.ts => core/test/pty/input.test.ts}` (+2, -2)
- `packages/{opencode => core}/test/pty/ticket.test.ts` (+7, -5)
- `packages/{opencode => core}/test/util/which.test.ts` (+2, -2)
- `packages/effect-drizzle-sqlite/package.json` (+2, -2)
- `packages/effect-drizzle-sqlite/src/effect-sqlite/session.ts` (+33, -29)
- `packages/effect-drizzle-sqlite/test/sqlite.test.ts` (+33, -0)
- `packages/effect-sqlite-node/package.json` (+22, -0)
- `packages/effect-sqlite-node/src/index.ts` (+168, -0)
- `packages/effect-sqlite-node/tsconfig.json` (+16, -0)
- `packages/extensions/zed/LICENSE` (+0, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+2, -2)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-console/src/client.test.ts` (+36, -11)
- `packages/kilo-console/src/client.ts` (+7, -2)
- `packages/kilo-console/src/routes/projects/ProjectConsoleRoute.tsx` (+41, -8)
- `packages/kilo-console/src/routes/projects/project-console-presence-sender.test.ts` (+90, -0)
- `packages/kilo-console/src/routes/projects/project-console-presence-sender.ts` (+34, -0)
- `packages/kilo-console/src/routes/projects/project-console-presence.test.ts` (+69, -0)
- `packages/kilo-docs/lychee.toml` (+6, -2)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/ai-providers/gemini.md` (+8, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli-reference.md` (+1, -23)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-with-todos-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/timeline-highlighted-tool-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/title-only-reasoning-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/todo-write-with-permission-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/history-sessionlist/sources-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/history-sessionlist/with-items-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/source-links.md` (+10, -8)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-indexing/src/indexing/constants/index.ts` (+1, -1)
- `packages/kilo-indexing/src/indexing/manager.ts` (+21, -3)
- `packages/kilo-jetbrains/CHANGELOG.md` (+22, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloConnectionServiceTest.kt` (+0, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+48, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/history/HistoryController.kt` (+3, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/scroll/SessionScroll.kt` (+61, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/ProgressPanel.kt` (+58, -9)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/PromptPanel.kt` (+30, -25)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/style/SessionEditorStyle.kt` (+32, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/question/QuestionView.kt` (+65, -20)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/send.svg` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/send_dark.svg` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/HistorySessionActionsTest.kt` (+13, -16)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionScrollTest.kt` (+43, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionSidePanelManagerTest.kt` (+15, -18)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/history/HistoryControllerTest.kt` (+39, -24)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/ProgressPanelTest.kt` (+129, -11)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/PromptPanelTest.kt` (+45, -4)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/QuestionViewTest.kt` (+77, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/UserProfileConfigurableTest.kt` (+10, -13)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/AgentsSettingsUiTest.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/McpSettingsUiTest.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/models/ModelsSettingsUiTest.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/providers/ProvidersSettingsUiTest.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/TestCoroutines.kt` (+1, -1)
- `packages/kilo-jetbrains/script/test-ci.ts` (+2, -2)
- `packages/kilo-memory/package.json` (+1, -1)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-sandbox/test/proxy.test.ts` (+38, -9)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/message-part.css` (+13, -1)
- `packages/kilo-ui/src/components/message-part.tsx` (+29, -16)
- `packages/kilo-ui/src/components/reasoning-heading.test.ts` (+32, -0)
- `packages/kilo-ui/src/components/reasoning-heading.ts` (+11, -2)
- `packages/kilo-vscode/CHANGELOG.md` (+47, -0)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+198, -79)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+84, -154)
- `packages/kilo-vscode/src/agent-manager/SessionTerminalManager.ts` (+15, -0)
- `packages/kilo-vscode/src/agent-manager/am-visible-presence.test.ts` (+132, -0)
- `packages/kilo-vscode/src/agent-manager/am-visible-presence.ts` (+51, -0)
- `packages/kilo-vscode/src/agent-manager/host.ts` (+3, -0)
- `packages/kilo-vscode/src/agent-manager/prune-subagents.ts` (+20, -0)
- `packages/kilo-vscode/src/agent-manager/tool-start.ts` (+29, -8)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+7, -0)
- `packages/kilo-vscode/src/agent-manager/vscode-host.ts` (+4, -0)
- `packages/kilo-vscode/src/agent-manager/worktree-create.ts` (+132, -0)
- `packages/kilo-vscode/src/kilo-provider-utils.ts` (+10, -13)
- `packages/kilo-vscode/src/kilo-provider/early-message.ts` (+9, -0)
- `packages/kilo-vscode/src/kilo-provider/file-picker.ts` (+20, -0)
- `packages/kilo-vscode/src/kilo-provider/followup-session.ts` (+7, -1)
- `packages/kilo-vscode/src/kilo-provider/fork-session.ts` (+2, -2)
- `packages/kilo-vscode/src/kilo-provider/options.ts` (+2, -0)
- `packages/kilo-vscode/src/services/cli-backend/connection-service.test.ts` (+78, -11)
- `packages/kilo-vscode/src/services/cli-backend/connection-service.ts` (+89, -42)
- `packages/kilo-vscode/src/services/cli-backend/connection-utils.ts` (+2, -2)
- `packages/kilo-vscode/src/services/cli-backend/sdk-sse-adapter.ts` (+26, -2)
- `packages/kilo-vscode/tests/diff-scroll-preservation.spec.ts` (+26, -17)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/setup/vscode-mock.ts` (+2, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+44, -8)
- `packages/kilo-vscode/tests/unit/agent-manager-close-session.test.ts` (+28, -5)
- `packages/kilo-vscode/tests/unit/agent-manager-remote-sessions.test.ts` (+28, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-tool-start.test.ts` (+76, -2)
- `packages/kilo-vscode/tests/unit/connection-utils.test.ts` (+1, -3)
- `packages/kilo-vscode/tests/unit/draft-store.test.ts` (+72, -0)
- `packages/kilo-vscode/tests/unit/file-mention-utils.test.ts` (+67, -9)
- `packages/kilo-vscode/tests/unit/followup-session.test.ts` (+7, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-followup.test.ts` (+13, -2)
- `packages/kilo-vscode/tests/unit/kilo-provider-load-messages.test.ts` (+135, -5)
- `packages/kilo-vscode/tests/unit/kilo-provider-utils.test.ts` (+6, -4)
- `packages/kilo-vscode/tests/unit/kilo-ui-contract.test.ts` (+5, -3)
- `packages/kilo-vscode/tests/unit/local-tabs.test.ts` (+280, -0)
- `packages/kilo-vscode/tests/unit/navigate.test.ts` (+14, -199)
- `packages/kilo-vscode/tests/unit/presence-registration-contract.test.ts` (+180, -0)
- `packages/kilo-vscode/tests/unit/prompt-input-connection-guard.test.ts` (+7, -5)
- `packages/kilo-vscode/tests/unit/prompt-send-contract.test.ts` (+64, -39)
- `packages/kilo-vscode/tests/unit/revert-checkpoints.test.ts` (+1, -1)
- `packages/kilo-vscode/tests/unit/sdk-sse-adapter.test.ts` (+40, -1)
- `packages/kilo-vscode/tests/unit/session-terminal-manager.test.ts` (+12, -0)
- `packages/kilo-vscode/tests/unit/sidebar-fork-session.test.ts` (+46, -0)
- `packages/kilo-vscode/tests/unit/sidebar-tab-dnd.test.ts` (+39, -0)
- `packages/kilo-vscode/tests/unit/tab-navigation.test.ts` (+43, -0)
- `packages/kilo-vscode/tests/unit/tab-order.test.ts` (+10, -0)
- `packages/kilo-vscode/tests/unit/task-timeline-tooltip.test.ts` (+20, -1)
- `packages/kilo-vscode/tests/unit/timeline-highlight-events.test.ts` (+58, -0)
- `packages/kilo-vscode/tests/unit/transcript-parts.test.ts` (+69, -0)
- `packages/kilo-vscode/tests/unit/use-file-mention.test.ts` (+273, -4)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+136, -104)
- `packages/kilo-vscode/webview-ui/agent-manager/DiffPanel.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/NewWorktreeDialog.tsx` (+89, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+13, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/navigate.ts` (+10, -87)
- `packages/kilo-vscode/webview-ui/agent-manager/remote-sessions.ts` (+18, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/sortable-tab.tsx` (+76, -143)
- `packages/kilo-vscode/webview-ui/agent-manager/tab-order.ts` (+1, -14)
- `packages/kilo-vscode/webview-ui/agent-manager/tab-rendering.tsx` (+13, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/tab-scroll.ts` (+1, -83)
- `packages/kilo-vscode/webview-ui/agent-manager/tab-widths.ts` (+1, -21)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/SortableTerminalTab.tsx` (+34, -37)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/render.tsx` (+8, -0)
- `packages/kilo-vscode/webview-ui/diff-viewer/FullScreenDiffView.tsx` (+4, -3)
- `packages/kilo-vscode/webview-ui/diff-viewer/VirtualDiffList.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/App.tsx` (+25, -14)
- `packages/kilo-vscode/webview-ui/src/components/chat/AssistantMessage.tsx` (+22, -26)
- `packages/kilo-vscode/webview-ui/src/components/chat/ChatView.tsx` (+63, -51)
- `packages/kilo-vscode/webview-ui/src/components/chat/KiloNotifications.tsx` (+5, -4)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+473, -8)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+155, -104)
- `packages/kilo-vscode/webview-ui/src/components/chat/SessionTab.tsx` (+75, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/SessionTabMenu.tsx` (+43, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/SessionTabStrip.tsx` (+165, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/TabDnd.tsx` (+43, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskHeader.tsx` (+23, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskTimeline.tsx` (+54, -9)
- `packages/kilo-vscode/webview-ui/src/components/chat/TranscriptRow.tsx` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/TranscriptSearch.tsx` (+167, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/transcript-search-highlight.ts` (+133, -0)
- `packages/kilo-vscode/webview-ui/src/components/history/HistoryView.tsx` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelSelector.tsx` (+7, -1)
- `packages/kilo-vscode/webview-ui/src/context/local-tabs.tsx` (+250, -0)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+44, -19)
- `packages/kilo-vscode/webview-ui/src/context/transcript-search.tsx` (+91, -0)
- `packages/kilo-vscode/webview-ui/src/hooks/file-mention-utils.ts` (+65, -3)
- `packages/kilo-vscode/webview-ui/src/hooks/useFileMention.ts` (+67, -1)
- `packages/kilo-vscode/webview-ui/src/hooks/useGitChangesContext.ts` (+10, -5)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+8, -5)
- `packages/kilo-vscode/webview-ui/src/stories/composite.stories.tsx` (+41, -1)
- `packages/kilo-vscode/webview-ui/src/styles/chat-layout.css` (+77, -0)
- `packages/kilo-vscode/webview-ui/src/styles/chat.css` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/styles/high-contrast.css` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/styles/prompt-dropdowns.css` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/styles/session-tabs.css` (+254, -0)
- `packages/kilo-vscode/webview-ui/src/styles/task-header.css` (+114, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+21, -1)
- `packages/kilo-vscode/webview-ui/src/utils/draft-store.ts` (+79, -10)
- `packages/kilo-vscode/webview-ui/src/utils/local-tabs.ts` (+207, -0)
- `packages/kilo-vscode/webview-ui/src/utils/tab-navigation.ts` (+78, -0)
- `packages/kilo-vscode/webview-ui/src/utils/tab-order.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/src/utils/tab-scroll.ts` (+81, -0)
- `packages/kilo-vscode/webview-ui/src/utils/tab-widths.ts` (+21, -0)
- `packages/kilo-vscode/webview-ui/src/utils/timeline/highlight.ts` (+31, -0)
- `packages/kilo-vscode/webview-ui/src/utils/transcript-parts.ts` (+19, -0)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/AGENTS.md` (+36, -19)
- `packages/llm/example/tutorial.ts` (+28, -19)
- `packages/llm/package.json` (+1, -1)
- `packages/llm/src/index.ts` (+5, -8)
- `packages/llm/src/llm.ts` (+3, -8)
- `packages/llm/src/protocols/anthropic-messages.ts` (+67, -1)
- `packages/llm/src/protocols/bedrock-converse.ts` (+44, -11)
- `packages/llm/src/protocols/gemini.ts` (+52, -4)
- `packages/llm/src/protocols/openai-chat.ts` (+27, -6)
- `packages/llm/src/protocols/openai-responses.ts` (+37, -4)
- `packages/llm/src/protocols/shared.ts` (+75, -2)
- `packages/llm/src/protocols/utils/lifecycle.ts` (+8, -2)
- `packages/llm/src/protocols/utils/openai-options.ts` (+13, -2)
- `packages/llm/src/providers/openai-options.ts` (+1, -1)
- `packages/llm/src/route/client.ts` (+12, -32)
- `packages/llm/src/schema/events.ts` (+8, -2)
- `packages/llm/src/schema/ids.ts` (+1, -1)
- `packages/llm/src/schema/messages.ts` (+135, -0)
- `packages/llm/src/tool-runtime.ts` (+50, -312)
- `packages/llm/src/tool.ts` (+62, -11)
- `packages/llm/test/kilocode/openai-reasoning-summary.test.ts` (+23, -0)
- `packages/llm/test/lib/tool-runtime.ts` (+143, -5)
- `packages/llm/test/llm.test.ts` (+20, -1)
- `packages/llm/test/provider/anthropic-messages.test.ts` (+134, -0)
- `packages/llm/test/provider/bedrock-converse.test.ts` (+56, -0)
- `packages/llm/test/provider/gemini.test.ts` (+82, -0)
- `packages/llm/test/provider/openai-chat.test.ts` (+45, -4)
- `packages/llm/test/provider/openai-responses.test.ts` (+114, -0)
- `packages/llm/test/recorded-scenarios.ts` (+59, -11)
- `packages/llm/test/tool-runtime.test.ts` (+219, -81)
- `packages/llm/test/tool.types.ts` (+18, -8)
- `packages/opencode/BUN_SHELL_MIGRATION_PLAN.md` (+3, -3)
- `packages/opencode/CHANGELOG.md` (+59, -0)
- `packages/opencode/package.json` (+23, -16)
- `packages/opencode/parsers-config.ts` (+10, -0)
- `packages/opencode/script/build-node.ts` (+0, -32)
- `packages/opencode/script/build.ts` (+2, -31)
- `packages/opencode/script/check-migrations.ts` (+0, -16)
- `packages/opencode/script/kilocode/test-profile.ts` (+3, -2)
- `packages/opencode/script/schema.ts` (+2, -1)
- `packages/opencode/specs/effect/facades.md` (+4, -4)
- `packages/opencode/specs/effect/guide.md` (+2, -2)
- `packages/opencode/specs/effect/loose-ends.md` (+1, -1)
- `packages/opencode/specs/effect/migration.md` (+1, -1)
- `packages/opencode/specs/effect/todo.md` (+3, -3)
- `packages/opencode/specs/effect/tools.md` (+3, -3)
- `packages/opencode/src/account/account.ts` (+1, -1)
- `packages/opencode/src/account/repo.ts` (+61, -60)
- `packages/opencode/src/acp/content.ts` (+3, -3)
- `packages/opencode/src/acp/directory.ts` (+8, -7)
- `packages/opencode/src/acp/event.ts` (+25, -0)
- `packages/opencode/src/acp/service.ts` (+32, -28)
- `packages/opencode/src/acp/session.ts` (+4, -3)
- `packages/opencode/src/acp/tool.ts` (+35, -8)
- `packages/opencode/src/acp/usage.ts` (+14, -13)
- `packages/opencode/src/auth/index.ts` (+3, -3)
- `packages/opencode/src/background/job.ts` (+25, -189)
- `packages/opencode/src/cli/cmd/acp.ts` (+2, -2)
- `packages/opencode/src/cli/cmd/agent.ts` (+4, -3)
- `packages/opencode/src/cli/cmd/db.ts` (+26, -84)
- `packages/opencode/src/cli/cmd/debug/agent.handler.ts` (+193, -0)
- `packages/opencode/src/cli/cmd/debug/agent.ts` (+7, -186)
- `packages/opencode/src/cli/cmd/debug/config.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/debug/file.ts` (+14, -17)
- `packages/opencode/src/cli/cmd/debug/index.ts` (+2, -2)
- `packages/opencode/src/cli/cmd/debug/ripgrep.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/debug/scrap.ts` (+4, -2)
- `packages/opencode/src/cli/cmd/export.ts` (+5, -4)
- `packages/opencode/src/cli/cmd/generate.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/github.handler.ts` (+1604, -0)
- `packages/opencode/src/cli/cmd/github.shared.ts` (+30, -0)
- `packages/opencode/src/cli/cmd/github.ts` (+18, -1631)
- `packages/opencode/src/cli/cmd/import.ts` (+40, -42)
- `packages/opencode/src/cli/cmd/mcp.ts` (+19, -13)
- `packages/opencode/src/cli/cmd/models.ts` (+5, -5)
- `packages/opencode/src/cli/cmd/prompt-display.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/providers.ts` (+19, -0)
- `packages/opencode/src/cli/cmd/run.ts` (+12, -13)
- `packages/opencode/src/cli/cmd/run/event.ts` (+11, -9)
- `packages/opencode/src/cli/cmd/run/footer.command.tsx` (+125, -4)
- `packages/opencode/src/cli/cmd/run/footer.permission.tsx` (+3, -6)
- `packages/opencode/src/cli/cmd/run/footer.prompt.tsx` (+212, -229)
- `packages/opencode/src/cli/cmd/run/footer.question.tsx` (+1, -4)
- `packages/opencode/src/cli/cmd/run/footer.ts` (+256, -59)
- `packages/opencode/src/cli/cmd/run/footer.view.tsx` (+234, -60)
- `packages/opencode/src/cli/cmd/run/keymap.shared.ts` (+0, -154)
- `packages/opencode/src/cli/cmd/run/prompt.shared.ts` (+3, -184)
- `packages/opencode/src/cli/cmd/run/runtime.boot.ts` (+27, -39)
- `packages/opencode/src/cli/cmd/run/runtime.lifecycle.ts` (+64, -8)
- `packages/opencode/src/cli/cmd/run/runtime.queue.ts` (+82, -30)
- `packages/opencode/src/cli/cmd/run/runtime.ts` (+94, -16)
- `packages/opencode/src/cli/cmd/run/scrollback.surface.ts` (+45, -0)
- `packages/opencode/src/cli/cmd/run/session-data.ts` (+5, -0)
- `packages/opencode/src/cli/cmd/run/session-replay.ts` (+114, -1)
- `packages/opencode/src/cli/cmd/run/stream.transport.ts` (+221, -15)
- `packages/opencode/src/cli/cmd/run/subagent-data.ts` (+2, -0)
- `packages/opencode/src/cli/cmd/run/theme.ts` (+5, -1)
- `packages/opencode/src/cli/cmd/run/types.ts` (+33, -16)
- `packages/opencode/src/cli/cmd/run/variant.shared.ts` (+5, -5)
- `packages/opencode/src/cli/cmd/serve.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/session.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/stats.ts` (+7, -6)
- `packages/opencode/src/cli/cmd/tui/app.tsx` (+20, -5)
- `packages/opencode/src/cli/cmd/tui/attach.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/component/dialog-move-session.tsx` (+129, -0)
- `packages/opencode/src/cli/cmd/tui/component/dialog-provider.tsx` (+2, -1)
- `packages/opencode/src/cli/cmd/tui/component/dialog-workspace-file-changes.tsx` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/component/prompt/autocomplete.tsx` (+27, -98)
- `packages/opencode/src/cli/cmd/tui/component/prompt/index.tsx` (+74, -185)
- `packages/opencode/src/cli/cmd/tui/component/prompt/move.tsx` (+158, -0)
- `packages/opencode/src/cli/cmd/tui/component/prompt/part.ts` (+8, -0)
- `packages/opencode/src/cli/cmd/tui/component/prompt/workspace.tsx` (+137, -0)
- `packages/opencode/src/cli/cmd/tui/config/keybind.ts` (+9, -0)
- `packages/opencode/src/cli/cmd/tui/config/tui-schema.ts` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/config/tui.ts` (+3, -3)
- `packages/opencode/src/cli/cmd/tui/context/event.ts` (+22, -5)
- `packages/opencode/src/cli/cmd/tui/context/path-format.tsx` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/context/sync-v2.tsx` (+292, -134)
- `packages/opencode/src/cli/cmd/tui/context/sync.tsx` (+107, -30)
- `packages/opencode/src/cli/cmd/tui/context/theme.tsx` (+112, -24)
- `packages/opencode/src/cli/cmd/tui/event.ts` (+17, -17)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/home/footer.tsx` (+6, -1)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/session/dialog.tsx` (+40, -19)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/session/preview-pane.tsx` (+16, -110)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/session/util.tsx` (+0, -16)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/sidebar/files.tsx` (+8, -1)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/sidebar/footer.tsx` (+7, -5)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/system/diff-viewer.tsx` (+103, -7)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/system/session-v2.tsx` (+6, -1)
- `packages/opencode/src/cli/cmd/tui/keymap.tsx` (+24, -14)
- `packages/opencode/src/cli/cmd/tui/plugin/runtime.ts` (+3, -2)
- `packages/opencode/src/cli/cmd/tui/routes/home.tsx` (+3, -2)
- `packages/opencode/src/cli/cmd/tui/routes/home/session-destination.tsx` (+26, -0)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+111, -28)
- `packages/opencode/src/cli/cmd/tui/routes/session/permission.tsx` (+14, -4)
- `packages/opencode/src/cli/cmd/tui/routes/session/question.tsx` (+4, -4)
- `packages/opencode/src/cli/cmd/tui/thread.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/ui/dialog-select.tsx` (+24, -3)
- `packages/opencode/src/cli/cmd/tui/ui/toast.tsx` (+3, -3)
- `packages/opencode/src/cli/cmd/tui/util/clipboard.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/util/editor.ts` (+6, -1)
- `packages/opencode/src/cli/cmd/web.ts` (+1, -1)
- `packages/opencode/src/cli/effect-cmd.ts` (+5, -3)
- `packages/opencode/src/cli/network.ts` (+4, -2)
- `packages/opencode/src/command/index.ts` (+6, -6)
- `packages/opencode/src/config/agent.ts` (+31, -138)
- `packages/opencode/src/config/command.ts` (+20, -23)
- `packages/opencode/src/config/config.ts` (+85, -330)
- `packages/opencode/src/config/markdown.ts` (+9, -14)
- `packages/opencode/src/config/model-id.ts` (+0, -5)
- `packages/opencode/src/config/parse.ts` (+1, -1)
- `packages/opencode/src/config/paths.ts` (+3, -3)
- `packages/opencode/src/config/plugin.ts` (+9, -14)
- `packages/opencode/src/config/reference.ts` (+3, -24)
- `packages/opencode/src/config/variable.ts` (+1, -1)
- `packages/opencode/src/control-plane/adapters/index.ts` (+7, -7)
- `packages/opencode/src/control-plane/schema.ts` (+0, -14)
- `packages/opencode/src/control-plane/types.ts` (+5, -5)
- `packages/opencode/src/control-plane/workspace-context.ts` (+4, -4)
- `packages/opencode/src/control-plane/workspace.ts` (+188, -188)
- `packages/opencode/src/data-migration.ts` (+0, -161)
- `packages/opencode/src/effect/app-runtime.ts` (+15, -19)
- `packages/opencode/src/effect/bootstrap-runtime.ts` (+0, -6)
- `packages/opencode/src/effect/bridge.ts` (+2, -2)
- `packages/opencode/src/effect/instance-ref.ts` (+2, -2)
- `packages/opencode/src/effect/runtime-flags.ts` (+3, -2)
- `packages/opencode/src/event-v2-bridge.ts` (+57, -76)
- `packages/opencode/src/file/index.ts` (+0, -662)
- `packages/opencode/src/file/watcher.ts` (+0, -168)
- `packages/opencode/src/format/formatter.ts` (+1, -1)
- `packages/opencode/src/ide/index.ts` (+6, -6)
- `packages/opencode/src/image/image.ts` (+3, -2)
- `packages/opencode/src/index.ts` (+0, -43)
- `packages/opencode/src/installation/index.ts` (+30, -15)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+70, -57)
- `packages/opencode/src/kilo-sessions/remote-model-catalog.ts` (+5, -4)
- `packages/opencode/src/kilo-sessions/remote-protocol.ts` (+0, -2)
- `packages/opencode/src/kilo-sessions/remote-sender.ts` (+9, -8)
- `packages/opencode/src/kilo-sessions/remote-ws.ts` (+1, -1)
- `packages/opencode/src/kilocode/agent-manager/event.ts` (+5, -3)
- `packages/opencode/src/kilocode/agent-requirements.ts` (+5, -49)
- `packages/opencode/src/{agent/prompt => kilocode/agent}/scout.txt` (+0, -0)
- `packages/opencode/src/kilocode/anaconda-desktop/discovery.ts` (+5, -5)
- `packages/opencode/src/kilocode/anaconda-desktop/domain.ts` (+3, -3)
- `packages/opencode/src/kilocode/anaconda-desktop/platform.ts` (+3, -3)
- `packages/opencode/src/kilocode/background-process/index.ts` (+3, -3)
- `packages/opencode/src/kilocode/branch-name.ts` (+4, -3)
- `packages/opencode/src/kilocode/claw/client.ts` (+3, -2)
- `packages/opencode/src/kilocode/cli/cmd/tui/app.tsx` (+55, -20)
- `packages/opencode/src/kilocode/cli/setup.ts` (+5, -0)
- `packages/opencode/src/kilocode/config-injector.ts` (+1, -1)
- `packages/opencode/src/kilocode/config-validation.ts` (+14, -8)
- `packages/opencode/src/kilocode/config/config.ts` (+19, -9)
- `packages/opencode/src/kilocode/config/default-plugins.ts` (+2, -1)
- `packages/opencode/src/kilocode/config/global-stamp.ts` (+2, -2)
- `packages/opencode/src/kilocode/config/markdown.ts` (+33, -29)
- `packages/opencode/src/kilocode/config/overlay.ts` (+2, -2)
- `packages/opencode/src/kilocode/config/report.ts` (+17, -0)
- `packages/opencode/src/kilocode/{claw/event-service-client.ts => event-service/client.ts}` (+38, -35)
- `packages/opencode/src/kilocode/ignore-migrator.ts` (+1, -1)
- `packages/opencode/src/kilocode/indexing.ts` (+41, -19)
- `packages/opencode/src/kilocode/installation/index.ts` (+0, -1)
- `packages/opencode/src/kilocode/interactive-terminal/index.ts` (+2, -2)
- `packages/opencode/src/kilocode/mcp-migrator.ts` (+1, -1)
- `packages/opencode/src/kilocode/memory/ports.ts` (+4, -3)
- `packages/opencode/src/kilocode/modes-migrator.ts` (+10, -10)
- `packages/opencode/src/kilocode/plan-followup.ts` (+12, -7)
- `packages/opencode/src/kilocode/presence/context.ts` (+34, -0)
- `packages/opencode/src/kilocode/presence/policy.ts` (+151, -0)
- `packages/opencode/src/kilocode/presence/service.ts` (+224, -0)
- `packages/opencode/src/kilocode/primary-worktree.ts` (+5, -5)
- `packages/opencode/src/kilocode/provider/error.ts` (+13, -0)
- `packages/opencode/src/kilocode/provider/model-filter.ts` (+2, -3)
- `packages/opencode/src/kilocode/provider/provider.ts` (+2, -1)
- `packages/opencode/src/kilocode/provider/reasoning-summary.ts` (+10, -0)
- `packages/opencode/src/kilocode/review/worktree-diff.ts` (+2, -2)
- `packages/opencode/src/kilocode/sandbox/inheritance.ts` (+40, -0)
- `packages/opencode/src/kilocode/sandbox/policy.ts` (+6, -2)
- `packages/opencode/src/kilocode/sandbox/state.ts` (+48, -40)
- `packages/opencode/src/kilocode/server/httpapi/groups/branch-name.ts` (+4, -3)
- `packages/opencode/src/kilocode/server/httpapi/groups/config-console.ts` (+2, -2)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilo-gateway.ts` (+8, -5)
- `packages/opencode/src/kilocode/server/httpapi/server.ts` (+2, -0)
- `packages/opencode/src/kilocode/server/provider-auth-lifecycle.ts` (+8, -0)
- `packages/opencode/src/kilocode/session-import/service.ts` (+103, -98)
- `packages/opencode/src/kilocode/session-portability/cumulative-diff.ts` (+25, -0)
- `packages/opencode/src/kilocode/session/compaction-chunks.ts` (+53, -9)
- `packages/opencode/src/kilocode/session/compaction.ts` (+3, -2)
- `packages/opencode/src/kilocode/session/event.ts` (+24, -0)
- `packages/opencode/src/kilocode/session/fork-command.ts` (+15, -0)
- `packages/opencode/src/kilocode/session/fork.ts` (+5, -41)
- `packages/opencode/src/kilocode/session/index.ts` (+121, -134)
- `packages/opencode/src/kilocode/session/instruction.ts` (+6, -2)
- `packages/opencode/src/kilocode/session/model-usage.ts` (+84, -87)
- `packages/opencode/src/kilocode/session/prompt.ts` (+26, -3)
- `packages/opencode/src/kilocode/session/recall-search.ts` (+75, -76)
- `packages/opencode/src/kilocode/session/routed-model.ts` (+6, -6)
- `packages/opencode/src/kilocode/session/tool-schema.ts` (+148, -0)
- `packages/opencode/src/kilocode/snapshot/materialize.ts` (+2, -2)
- `packages/opencode/src/kilocode/snapshot/seed.ts` (+2, -2)
- `packages/opencode/src/kilocode/snapshot/track.ts` (+19, -8)
- `packages/opencode/src/{ => kilocode}/storage/json-migration.ts` (+109, -31)
- `packages/opencode/src/kilocode/text-stream.ts` (+39, -11)
- `packages/opencode/src/kilocode/ts-client.ts` (+7, -1)
- `packages/opencode/src/kilocode/tui/config.ts` (+2, -0)
- `packages/opencode/src/kilocode/workflows-migrator.ts` (+34, -12)
- `packages/opencode/src/lsp/client.ts` (+8, -29)
- `packages/opencode/src/lsp/lsp.ts` (+18, -8)
- `packages/opencode/src/lsp/server.ts` (+1, -1)
- `packages/opencode/src/mcp/auth.ts` (+3, -6)
- `packages/opencode/src/mcp/index.ts` (+33, -32)
- `packages/opencode/src/node.ts` (+1, -2)
- `packages/opencode/src/patch/index.ts` (+4, -4)
- `packages/opencode/src/plugin/github-copilot/copilot.ts` (+29, -6)
- `packages/opencode/src/plugin/github-copilot/models.ts` (+95, -45)
- `packages/opencode/src/plugin/index.ts` (+16, -18)
- `packages/opencode/src/plugin/loader.ts` (+3, -2)
- `packages/opencode/src/plugin/openai/codex.ts` (+4, -2)
- `packages/opencode/src/plugin/openai/ws-pool.ts` (+23, -5)
- `packages/opencode/src/plugin/openai/ws.ts` (+49, -2)
- `packages/opencode/src/project/bootstrap.ts` (+2, -10)
- `packages/opencode/src/project/instance-context.ts` (+3, -3)
- `packages/opencode/src/project/instance-store.ts` (+14, -3)
- `packages/opencode/src/project/project.sql.ts` (+0, -17)
- `packages/opencode/src/project/project.ts` (+193, -188)
- `packages/opencode/src/project/schema.ts` (+0, -13)
- `packages/opencode/src/project/vcs.ts` (+26, -25)
- `packages/opencode/src/provider/auth.ts` (+20, -12)
- `packages/opencode/src/provider/error.ts` (+6, -3)
- `packages/opencode/src/provider/provider.ts` (+218, -121)
- `packages/opencode/src/provider/schema.ts` (+0, -31)
- `packages/opencode/src/provider/transform.ts` (+92, -121)
- `packages/opencode/src/pty-preparation.ts` (+46, -0)
- `packages/opencode/src/pty/index.ts` (+0, -398)
- `packages/opencode/src/question/index.ts` (+14, -14)
- `packages/opencode/src/reference/reference.ts` (+7, -7)
- `packages/opencode/src/reference/repository-cache.ts` (+5, -5)
- `packages/opencode/src/server/event.ts` (+12, -6)
- `packages/opencode/src/server/projectors.ts` (+1, -26)
- `packages/opencode/src/server/routes/instance/httpapi/api.ts` (+13, -9)
- `packages/opencode/src/server/routes/instance/httpapi/groups/config.ts` (+4, -3)
- `packages/opencode/src/server/routes/instance/httpapi/groups/control-plane.ts` (+35, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/control.ts` (+3, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/experimental.ts` (+20, -3)
- `packages/opencode/src/server/routes/instance/httpapi/groups/file.ts` (+47, -5)
- `packages/opencode/src/server/routes/instance/httpapi/groups/global.ts` (+33, -6)
- `packages/opencode/src/server/routes/instance/httpapi/groups/mcp.ts` (+2, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/permission.ts` (+5, -5)
- `packages/opencode/src/server/routes/instance/httpapi/groups/project-copy.ts` (+86, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/project.ts` (+13, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/provider.ts` (+5, -4)
- `packages/opencode/src/server/routes/instance/httpapi/groups/pty.ts` (+3, -3)
- `packages/opencode/src/server/routes/instance/httpapi/groups/session.ts` (+29, -18)
- `packages/opencode/src/server/routes/instance/httpapi/groups/sync.ts` (+3, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/tui.ts` (+7, -7)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2.ts` (+0, -18)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/session.ts` (+0, -127)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/config.ts` (+4, -3)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/control-plane.ts` (+35, -0)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/control.ts` (+15, -4)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/event.ts` (+33, -14)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/experimental.ts` (+38, -18)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/file.ts` (+54, -14)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/global.ts` (+3, -3)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/permission.ts` (+5, -5)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/project-copy.ts` (+152, -0)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/project.ts` (+13, -3)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/provider.ts` (+13, -6)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/pty.ts` (+83, -42)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/session.ts` (+11, -9)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/sync.ts` (+29, -31)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/tui.ts` (+15, -14)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2.ts` (+0, -12)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2/session.ts` (+0, -246)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/authorization.ts` (+1, -32)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/fence.ts` (+13, -8)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/workspace-routing.ts` (+14, -14)
- `packages/opencode/src/server/routes/instance/httpapi/public.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+43, -19)
- `packages/opencode/src/server/shared/fence.ts` (+12, -12)
- `packages/opencode/src/server/shared/ui.ts` (+4, -4)
- `packages/opencode/src/server/shared/workspace-routing.ts` (+3, -1)
- `packages/opencode/src/session/compaction.ts` (+46, -40)
- `packages/opencode/src/session/instruction.ts` (+62, -30)
- `packages/opencode/src/session/llm.ts` (+29, -16)
- `packages/opencode/src/session/llm/ai-sdk.ts` (+43, -9)
- `packages/opencode/src/session/llm/native-runtime.ts` (+62, -18)
- `packages/opencode/src/session/llm/request.ts` (+15, -6)
- `packages/opencode/src/session/message-v2.ts` (+130, -607)
- `packages/opencode/src/session/message.ts` (+5, -3)
- `packages/opencode/src/session/overflow.ts` (+5, -3)
- `packages/opencode/src/session/processor.ts` (+278, -82)
- `packages/opencode/src/session/projectors-next.ts` (+0, -223)
- `packages/opencode/src/session/projectors.ts` (+0, -200)
- `packages/opencode/src/session/prompt.ts` (+201, -207)
- `packages/opencode/src/session/prompt/gemini.txt` (+1, -1)
- `packages/opencode/src/session/prompt/reference.ts` (+3, -4)
- `packages/opencode/src/session/reminders.ts` (+6, -4)
- `packages/opencode/src/session/retry.ts` (+5, -4)
- `packages/opencode/src/session/revert.ts` (+12, -21)
- `packages/opencode/src/session/run-state.ts` (+16, -16)
- `packages/opencode/src/session/schema.ts` (+2, -2)
- `packages/opencode/src/session/session.sql.ts` (+0, -138)
- `packages/opencode/src/session/session.ts` (+315, -218)
- `packages/opencode/src/session/status.ts` (+16, -16)
- `packages/opencode/src/session/summary.ts` (+41, -29)
- `packages/opencode/src/session/todo.ts` (+40, -34)
- `packages/opencode/src/session/tools.ts` (+9, -6)
- `packages/opencode/src/share/session.ts` (+2, -5)
- `packages/opencode/src/share/share-next.ts` (+54, -57)
- `packages/opencode/src/shell/shell.ts` (+1, -1)
- `packages/opencode/src/skill/discovery.ts` (+80, -81)
- `packages/opencode/src/skill/index.ts` (+92, -32)
- `packages/opencode/src/snapshot/index.ts` (+5, -7)
- `packages/opencode/src/storage/schema.ts` (+5, -5)
- `packages/opencode/src/storage/storage.ts` (+12, -16)
- `packages/opencode/src/sync/event.sql.ts` (+0, -17)
- `packages/opencode/src/sync/index.ts` (+9, -8)
- `packages/opencode/src/util/bom.ts` (+3, -7)
- `packages/opencode/src/util/filesystem.ts` (+4, -8)
- `packages/opencode/src/v2/provider-parity-checklist.md` (+0, -95)
- `packages/opencode/src/v2/session.ts` (+0, -372)
- `packages/opencode/src/worktree/index.ts` (+38, -22)
- `packages/opencode/test/account/repo.test.ts` (+8, -7)
- `packages/opencode/test/account/service.test.ts` (+8, -7)
- `packages/opencode/test/acp/directory.test.ts` (+9, -8)
- `packages/opencode/test/acp/event.test.ts` (+57, -3)
- `packages/opencode/test/acp/permission.test.ts` (+36, -0)
- `packages/opencode/test/acp/service-session.test.ts` (+77, -38)
- `packages/opencode/test/acp/session.test.ts` (+4, -3)
- `packages/opencode/test/acp/tool.test.ts` (+45, -4)
- `packages/opencode/test/acp/usage.test.ts` (+11, -10)
- `packages/opencode/test/auth/auth.test.ts` (+58, -67)
- `packages/opencode/test/background/job.test.ts` (+116, -0)
- `packages/opencode/test/cli/cmd/tui/aggregate-failures.test.ts` (+2, -2)
- `packages/opencode/test/cli/cmd/tui/prompt-part.test.ts` (+31, -1)
- `packages/opencode/test/cli/cmd/tui/sync-fixture.tsx` (+1, -0)
- `packages/opencode/test/cli/cmd/tui/sync-live-hydration.test.tsx` (+299, -0)
- `packages/opencode/test/cli/effect-cmd-instance-als.test.ts` (+2, -2)
- `packages/opencode/test/cli/github-action.test.ts` (+6, -5)
- `packages/opencode/test/cli/help/__snapshots__/help-snapshots.test.ts.snap` (+2, -3)
- `packages/opencode/test/cli/run/footer.view.test.tsx` (+435, -31)
- `packages/opencode/test/cli/run/prompt.shared.test.ts` (+0, -55)
- `packages/opencode/test/cli/run/runtime.boot.test.ts` (+33, -25)
- `packages/opencode/test/cli/run/runtime.queue.test.ts` (+89, -0)
- `packages/opencode/test/cli/run/scrollback.surface.test.ts` (+79, -2)
- `packages/opencode/test/cli/run/session-replay.test.ts` (+298, -1)
- `packages/opencode/test/cli/run/stream.test.ts` (+1, -0)
- `packages/opencode/test/cli/run/stream.transport.test.ts` (+494, -21)
- `packages/opencode/test/cli/run/theme.test.ts` (+37, -0)
- `packages/opencode/test/cli/run/variant.shared.test.ts` (+8, -8)
- `packages/opencode/test/cli/tui/__snapshots__/inline-tool-wrap-snapshot.test.tsx.snap` (+18, -0)
- `packages/opencode/test/cli/tui/diff-viewer.test.tsx` (+133, -14)
- `packages/opencode/test/cli/tui/inline-tool-wrap-snapshot.test.tsx` (+68, -1)
- `packages/opencode/test/cli/tui/sync-v2.test.tsx` (+568, -0)
- `packages/opencode/test/cli/tui/theme-store.test.ts` (+26, -1)
- `packages/opencode/test/cli/tui/use-event.test.tsx` (+7, -3)
- `packages/opencode/test/config/config.test.ts` (+69, -66)
- `packages/opencode/test/config/lsp.test.ts` (+3, -3)
- `packages/opencode/test/config/markdown.test.ts` (+5, -5)
- `packages/opencode/test/config/tui.test.ts` (+39, -39)
- `packages/opencode/test/control-plane/adapters.test.ts` (+4, -4)
- `packages/opencode/test/control-plane/workspace.test.ts` (+182, -157)
- `packages/opencode/test/effect/run-service.test.ts` (+2, -2)
- `packages/opencode/test/effect/runtime-flags.test.ts` (+1, -26)
- `packages/opencode/test/fake/provider.ts` (+4, -3)
- `packages/opencode/test/file/fsmonitor.test.ts` (+0, -73)
- `packages/opencode/test/file/ignore.test.ts` (+0, -10)
- `packages/opencode/test/file/index.test.ts` (+0, -872)
- `packages/opencode/test/file/path-traversal.test.ts` (+0, -185)
- `packages/opencode/test/file/watcher.test.ts` (+0, -352)
- `packages/opencode/test/filesystem/filesystem.test.ts` (+32, -32)
- `packages/opencode/test/fixture/config.ts` (+1, -1)
- `packages/opencode/test/fixture/db.ts` (+8, -6)
- `packages/opencode/test/fixture/fixture.ts` (+60, -31)
- `packages/opencode/test/fixture/flag.ts` (+2, -2)
- `packages/opencode/test/fixture/workspace.ts` (+6, -4)
- `packages/opencode/test/format/format.test.ts` (+173, -217)
- `packages/opencode/test/installation/installation.test.ts` (+35, -10)
- `packages/opencode/test/kilocode/agent-manager-tool.test.ts` (+4, -3)
- `packages/opencode/test/kilocode/agent-permission-overrides.test.ts` (+7, -2)
- `packages/opencode/test/kilocode/agent-requirements.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/anaconda-desktop/discovery.test.ts` (+3, -3)
- `packages/opencode/test/kilocode/bash-permission-metadata.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/branch-name.test.ts` (+4, -3)
- `packages/opencode/test/kilocode/cleanup.ts` (+4, -5)
- `packages/opencode/test/kilocode/cli-shutdown.test.ts` (+6, -0)
- `packages/opencode/test/kilocode/codex-auth-refresh.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/command-timeout.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/compaction-payload-recovery.test.ts` (+32, -29)
- `packages/opencode/test/kilocode/config-gitignore.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/config-resilience.test.ts` (+91, -0)
- `packages/opencode/test/kilocode/config/config.test.ts` (+3, -3)
- `packages/opencode/test/kilocode/config/indexing-default-plugin.test.ts` (+4, -3)
- `packages/opencode/test/kilocode/config/markdown.test.ts` (+59, -0)
- `packages/opencode/test/kilocode/config/variable.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/contains-path.test.ts` (+50, -0)
- `packages/opencode/test/kilocode/core-watcher.test.ts` (+1, -0)
- `packages/opencode/test/kilocode/cost-propagation.test.ts` (+8, -4)
- `packages/opencode/test/kilocode/edit-permission-filediff.test.ts` (+4, -2)
- `packages/opencode/test/kilocode/event-service/client.test.ts` (+345, -0)
- `packages/opencode/test/kilocode/external-directory-boundary.test.ts` (+5, -5)
- `packages/opencode/test/kilocode/indexing-startup.test.ts` (+139, -6)
- `packages/opencode/test/kilocode/indexing-worker.test.ts` (+61, -0)
- `packages/opencode/test/kilocode/installation/upgrade.test.ts` (+4, -4)
- `packages/opencode/test/kilocode/instruction.test.ts` (+10, -4)
- `packages/opencode/test/kilocode/interactive-terminal.test.ts` (+3, -3)
- `packages/opencode/test/kilocode/kilo-loader-auth.test.ts` (+7, -7)
- `packages/opencode/test/kilocode/kilo-sessions.test.ts` (+94, -12)
- `packages/opencode/test/kilocode/legacy-sse-event.test.ts` (+137, -0)
- `packages/opencode/test/kilocode/memory/memory-integration.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/memory/memory-ports.test.ts` (+5, -4)
- `packages/opencode/test/kilocode/nvidia-headers.test.ts` (+3, -4)
- `packages/opencode/test/kilocode/patch.test.ts` (+6, -3)
- `packages/opencode/test/kilocode/plan-exit-detection.test.ts` (+10, -8)
- `packages/opencode/test/kilocode/plan-file.test.ts` (+5, -4)
- `packages/opencode/test/kilocode/plan-followup.test.ts` (+52, -36)
- `packages/opencode/test/kilocode/presence/policy.test.ts` (+211, -0)
- `packages/opencode/test/kilocode/presence/service-presence.test.ts` (+267, -0)
- `packages/opencode/test/kilocode/presence/service.test.ts` (+89, -0)
- `packages/opencode/test/kilocode/project-config-update.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/provider-auth-error-message.test.ts` (+83, -0)
- `packages/opencode/test/kilocode/provider-model-refresh.test.ts` (+4, -4)
- `packages/opencode/test/kilocode/provider/error.test.ts` (+71, -3)
- `packages/opencode/test/kilocode/provider/gpt-5.6-summary.test.ts` (+51, -0)
- `packages/opencode/test/kilocode/provider/model-filter.test.ts` (+6, -5)
- `packages/opencode/test/kilocode/question-cancel.test.ts` (+14, -8)
- `packages/opencode/test/kilocode/read-directory.test.ts` (+5, -4)
- `packages/opencode/test/kilocode/read-docx.test.ts` (+5, -4)
- `packages/opencode/test/kilocode/read-notebook.test.ts` (+5, -4)
- `packages/opencode/test/kilocode/read-xlsx.test.ts` (+5, -4)
- `packages/opencode/test/kilocode/recall-search.test.ts` (+264, -251)
- `packages/opencode/test/kilocode/sandbox/config-network.test.ts` (+4, -2)
- `packages/opencode/test/kilocode/sandbox/macos-confinement.test.ts` (+5, -3)
- `packages/opencode/test/kilocode/sandbox/policy.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/sandbox/session-tools.test.ts` (+8, -4)
- `packages/opencode/test/kilocode/sandbox/session.test.ts` (+44, -6)
- `packages/opencode/test/kilocode/sandbox/shell-network.test.ts` (+6, -3)
- `packages/opencode/test/kilocode/sandbox/state.test.ts` (+8, -3)
- `packages/opencode/test/kilocode/server/httpapi-exercise-scenarios.ts` (+73, -17)
- `packages/opencode/test/kilocode/server/httpapi-global-sse.test.ts` (+4, -1)
- `packages/opencode/test/kilocode/server/httpapi-public.test.ts` (+13, -0)
- `packages/opencode/test/kilocode/server/kilo-gateway-statuses.test.ts` (+2, -0)
- `packages/opencode/test/kilocode/server/listener-runtime.test.ts` (+54, -18)
- `packages/opencode/test/kilocode/server/permission-allow-everything.test.ts` (+14, -9)
- `packages/opencode/test/kilocode/session-compaction-cap.test.ts` (+12, -11)
- `packages/opencode/test/kilocode/session-compaction-chunks.test.ts` (+134, -14)
- `packages/opencode/test/kilocode/session-compaction-safety.test.ts` (+7, -6)
- `packages/opencode/test/kilocode/session-export/capture.test.ts` (+3, -2)
- `packages/opencode/test/kilocode/session-fork-remap.test.ts` (+81, -28)
- `packages/opencode/test/kilocode/session-import-service.test.ts` (+65, -80)
- `packages/opencode/test/kilocode/session-list.test.ts` (+63, -76)
- `packages/opencode/test/kilocode/session-model-usage.test.ts` (+24, -24)
- `packages/opencode/test/kilocode/session-overflow.test.ts` (+13, -0)
- `packages/opencode/test/kilocode/session-processor-empty-tool-calls.test.ts` (+96, -72)
- `packages/opencode/test/kilocode/session-processor-network-offline.test.ts` (+9, -6)
- `packages/opencode/test/kilocode/session-processor-retry-limit.test.ts` (+10, -7)
- `packages/opencode/test/kilocode/session-prompt-compaction-safety.test.ts` (+10, -7)
- `packages/opencode/test/kilocode/session-prompt-permission-refresh.test.ts` (+8, -6)
- `packages/opencode/test/kilocode/session-prompt-queue.test.ts` (+28, -7)
- `packages/opencode/test/kilocode/session-routed-model.test.ts` (+7, -6)
- `packages/opencode/test/kilocode/session-title-generation.test.ts` (+4, -3)
- `packages/opencode/test/kilocode/session/instruction-substitution.test.ts` (+180, -24)
- `packages/opencode/test/kilocode/session/platform-attribution.test.ts` (+8, -12)
- `packages/opencode/test/kilocode/session/revert.test.ts` (+5, -4)
- `packages/opencode/test/kilocode/session/tool-schema.test.ts` (+119, -0)
- `packages/opencode/test/kilocode/sessions/remote-protocol.test.ts` (+10, -0)
- `packages/opencode/test/kilocode/sessions/remote-sender.test.ts` (+17, -16)
- `packages/opencode/test/kilocode/snapshot-freeze-repro.test.ts` (+14, -5)
- `packages/opencode/test/kilocode/snapshot-revert-move.test.ts` (+6, -6)
- `packages/opencode/test/kilocode/snapshot-seed.test.ts` (+5, -5)
- `packages/opencode/test/kilocode/stats-subagent-cost.test.ts` (+7, -5)
- `packages/opencode/test/{ => kilocode}/storage/json-migration.test.ts` (+141, -44)
- `packages/opencode/test/kilocode/swe-pruner.test.ts` (+4, -3)
- `packages/opencode/test/kilocode/sync-event-encoding.test.ts` (+69, -47)
- `packages/opencode/test/kilocode/system-prompt.test.ts` (+2, -0)
- `packages/opencode/test/kilocode/task-nesting.test.ts` (+6, -3)
- `packages/opencode/test/kilocode/test-profile.test.ts` (+5, -3)
- `packages/opencode/test/kilocode/tool-encoding.test.ts` (+45, -19)
- `packages/opencode/test/kilocode/tool-registry-apply-patch.test.ts` (+4, -3)
- `packages/opencode/test/kilocode/tool-registry-indexing.test.ts` (+4, -3)
- `packages/opencode/test/kilocode/tool-task-model.test.ts` (+12, -9)
- `packages/opencode/test/kilocode/tui-session-presence-contract.test.ts` (+78, -0)
- `packages/opencode/test/kilocode/workflows-migrator.test.ts` (+56, -7)
- `packages/opencode/test/kilocode/worktree-family-submodule.test.ts` (+4, -2)
- `packages/opencode/test/kilocode/worktree-project-skills.test.ts` (+6, -4)
- `packages/opencode/test/lib/cli-process.ts` (+3, -3)
- `packages/opencode/test/lib/effect.ts` (+27, -17)
- `packages/opencode/test/lsp/index.test.ts` (+103, -107)
- `packages/opencode/test/lsp/lifecycle.test.ts` (+79, -103)
- `packages/opencode/test/mcp/auth.test.ts` (+7, -7)
- `packages/opencode/test/mcp/oauth-auto-connect.test.ts` (+4, -4)
- `packages/opencode/test/mcp/oauth-browser.test.ts` (+10, -8)
- `packages/opencode/test/patch/patch.test.ts` (+2, -2)
- `packages/opencode/test/permission-task.test.ts` (+3, -2)
- `packages/opencode/test/plugin/auth-override.test.ts` (+9, -8)
- `packages/opencode/test/plugin/github-copilot-models.test.ts` (+73, -2)
- `packages/opencode/test/plugin/loader-shared.test.ts` (+12, -12)
- `packages/opencode/test/plugin/openai-ws.test.ts` (+167, -1)
- `packages/opencode/test/plugin/trigger.test.ts` (+34, -33)
- `packages/opencode/test/plugin/workspace-adapter.test.ts` (+76, -76)
- `packages/opencode/test/preload.ts` (+5, -0)
- `packages/opencode/test/project/instance-bootstrap.test.ts` (+1, -1)
- `packages/opencode/test/project/migrate-global.test.ts` (+41, -30)
- `packages/opencode/test/project/project-directory.test.ts` (+169, -0)
- `packages/opencode/test/project/project.test.ts` (+230, -226)
- `packages/opencode/test/project/vcs.test.ts` (+24, -15)
- `packages/opencode/test/project/worktree-remove.test.ts` (+108, -108)
- `packages/opencode/test/project/worktree.test.ts` (+3, -10)
- `packages/opencode/test/provider/amazon-bedrock.test.ts` (+98, -21)
- `packages/opencode/test/provider/cf-ai-gateway-e2e.test.ts` (+4, -3)
- `packages/opencode/test/provider/digitalocean.test.ts` (+3, -2)
- `packages/opencode/test/provider/gitlab-duo.test.ts` (+27, -27)
- `packages/opencode/test/provider/header-timeout.test.ts` (+8, -7)
- `packages/opencode/test/provider/model-status.test.ts` (+2, -2)
- `packages/opencode/test/provider/provider.test.ts` (+136, -124)
- `packages/opencode/test/provider/transform.test.ts` (+294, -215)
- `packages/opencode/test/pty/pty-output-isolation.test.ts` (+0, -162)
- `packages/opencode/test/pty/pty-session.test.ts` (+0, -148)
- `packages/opencode/test/pty/pty-shell.test.ts` (+42, -15)
- `packages/opencode/test/question/question.test.ts` (+22, -12)
- `packages/opencode/test/reference/reference.test.ts` (+12, -12)
- `packages/opencode/test/server/global-session-list.test.ts` (+11, -7)
- `packages/opencode/test/server/httpapi-config.test.ts` (+1, -1)
- `packages/opencode/test/server/httpapi-control-plane.test.ts` (+63, -0)
- `packages/opencode/test/server/httpapi-error-middleware.test.ts` (+2, -2)
- `packages/opencode/test/server/httpapi-event-diagnostics.test.ts` (+0, -279)
- `packages/opencode/test/server/httpapi-event.test.ts` (+70, -37)
- `packages/opencode/test/server/httpapi-exercise/backend.ts` (+14, -5)
- `packages/opencode/test/server/httpapi-exercise/environment.ts` (+1, -0)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+166, -12)
- `packages/opencode/test/server/httpapi-exercise/runner.ts` (+21, -13)
- `packages/opencode/test/server/httpapi-exercise/runtime.ts` (+3, -0)
- `packages/opencode/test/server/httpapi-exercise/types.ts` (+10, -3)
- `packages/opencode/test/server/httpapi-experimental.test.ts` (+45, -38)
- `packages/opencode/test/server/httpapi-file.test.ts` (+1, -1)
- `packages/opencode/test/server/httpapi-global.test.ts` (+7, -4)
- `packages/opencode/test/server/httpapi-instance-context.test.ts` (+6, -6)
- `packages/opencode/test/server/httpapi-instance-route-auth.test.ts` (+1, -1)
- `packages/opencode/test/server/httpapi-instance.test.ts` (+8, -8)
- `packages/opencode/test/server/httpapi-layer.ts` (+33, -0)
- `packages/opencode/test/server/httpapi-mcp.test.ts` (+4, -9)
- `packages/opencode/test/server/httpapi-provider.test.ts` (+41, -68)
- `packages/opencode/test/server/httpapi-pty.test.ts` (+19, -2)
- `packages/opencode/test/server/httpapi-public-openapi.test.ts` (+76, -4)
- `packages/opencode/test/server/httpapi-query-schema-drift.test.ts` (+2, -7)
- `packages/opencode/test/server/httpapi-schema-error-body.test.ts` (+46, -51)
- `packages/opencode/test/server/httpapi-sdk.test.ts` (+113, -87)
- `packages/opencode/test/server/httpapi-session.test.ts` (+226, -126)
- `packages/opencode/test/server/httpapi-sync.test.ts` (+40, -51)
- `packages/opencode/test/server/httpapi-ui.test.ts` (+8, -8)
- `packages/opencode/test/server/httpapi-v2-location.test.ts` (+85, -0)
- `packages/opencode/test/server/httpapi-workspace-routing.test.ts` (+17, -9)
- `packages/opencode/test/server/httpapi-workspace.test.ts` (+61, -44)
- `packages/opencode/test/server/negative-tokens-regression.test.ts` (+24, -22)
- `packages/opencode/test/server/project-copy.test.ts` (+89, -0)
- `packages/opencode/test/server/project-init-git.test.ts` (+8, -11)
- `packages/opencode/test/server/session-actions.test.ts` (+55, -64)
- `packages/opencode/test/server/session-diff-missing-patch.test.ts` (+44, -20)
- `packages/opencode/test/server/session-list.test.ts` (+63, -20)
- `packages/opencode/test/server/session-messages.test.ts` (+21, -17)
- `packages/opencode/test/server/session-select.test.ts` (+19, -43)
- `packages/opencode/test/server/workspace-routing.test.ts` (+5, -0)
- `packages/opencode/test/server/worktree-endpoint-repro.test.ts` (+4, -8)
- `packages/opencode/test/session/compaction.test.ts` (+80, -33)
- `packages/opencode/test/session/instruction.test.ts` (+11, -8)
- `packages/opencode/test/session/llm-native-recorded.test.ts` (+35, -39)
- `packages/opencode/test/session/llm-native.test.ts` (+80, -18)
- `packages/opencode/test/session/llm.test.ts` (+116, -48)
- `packages/opencode/test/session/message-v2.test.ts` (+100, -95)
- `packages/opencode/test/session/messages-pagination.test.ts` (+53, -52)
- `packages/opencode/test/session/processor-effect.test.ts` (+230, -50)
- `packages/opencode/test/session/prompt.test.ts` (+191, -159)
- `packages/opencode/test/session/retry.test.ts` (+59, -61)
- `packages/opencode/test/session/revert-compact.test.ts` (+22, -19)
- `packages/opencode/test/session/schema-decoding.test.ts` (+4, -4)
- `packages/opencode/test/session/session-schema.test.ts` (+3, -3)
- `packages/opencode/test/session/session.test.ts` (+151, -33)
- `packages/opencode/test/session/shell-v2.test.ts` (+9, -5)
- `packages/opencode/test/session/snapshot-tool-race.test.ts` (+17, -11)
- `packages/opencode/test/session/structured-output-integration.test.ts` (+2, -1)
- `packages/opencode/test/session/structured-output.test.ts` (+9, -8)
- `packages/opencode/test/share/share-next.test.ts` (+40, -31)
- `packages/opencode/test/shell/shell.test.ts` (+1, -1)
- `packages/opencode/test/skill/discovery.test.ts` (+5, -5)
- `packages/opencode/test/skill/skill.test.ts` (+8, -8)
- `packages/opencode/test/snapshot/snapshot.test.ts` (+14, -8)
- `packages/opencode/test/storage/storage.test.ts` (+13, -13)
- `packages/opencode/test/storage/workspace-time-migration.test.ts` (+13, -6)
- `packages/opencode/test/sync/index.test.ts` (+0, -390)
- `packages/opencode/test/v2/session-message-updater.test.ts` (+205, -161)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+4, -4)
- `packages/plugin/src/index.ts` (+1, -0)
- `packages/script/package.json` (+1, -1)
- `packages/script/src/index.ts` (+8, -12)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/client.ts` (+9, -2)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+2873, -2110)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+8389, -6653)
- `packages/sdk/openapi.json` (+17153, -12781)
- `packages/server/package.json` (+24, -0)
- `packages/server/src/api.ts` (+39, -0)
- `packages/server/src/auth.ts` (+63, -0)
- `packages/server/src/errors.ts` (+86, -0)
- `packages/server/src/groups/v2/agent.ts` (+24, -0)
- `packages/server/src/groups/v2/command.ts` (+30, -0)
- `packages/server/src/groups/v2/event.ts` (+36, -0)
- `packages/server/src/groups/v2/fs.ts` (+57, -0)
- `packages/server/src/groups/v2/health.ts` (+17, -0)
- `packages/{opencode/src/server/routes/instance/httpapi => server/src}/groups/v2/location.ts` (+36, -3)
- `packages/{opencode/src/server/routes/instance/httpapi => server/src}/groups/v2/message.ts` (+4, -6)
- `packages/{opencode/src/server/routes/instance/httpapi => server/src}/groups/v2/model.ts` (+2, -1)
- `packages/server/src/groups/v2/permission.ts` (+95, -0)
- `packages/{opencode/src/server/routes/instance/httpapi => server/src}/groups/v2/provider.ts` (+3, -2)
- `packages/server/src/groups/v2/question.ts` (+60, -0)
- `packages/server/src/groups/v2/session.ts` (+172, -0)
- `packages/server/src/groups/v2/skill.ts` (+30, -0)
- `packages/server/src/handlers.ts` (+57, -0)
- `packages/server/src/handlers/v2/agent.ts` (+15, -0)
- `packages/server/src/handlers/v2/command.ts` (+9, -0)
- `packages/server/src/handlers/v2/event.ts` (+70, -0)
- `packages/server/src/handlers/v2/fs.ts` (+13, -0)
- `packages/server/src/handlers/v2/health.ts` (+7, -0)
- `packages/{opencode/src/server/routes/instance/httpapi => server/src}/handlers/v2/message.ts` (+7, -11)
- `packages/{opencode/src/server/routes/instance/httpapi => server/src}/handlers/v2/model.ts` (+4, -3)
- `packages/server/src/handlers/v2/permission.ts` (+106, -0)
- `packages/{opencode/src/server/routes/instance/httpapi => server/src}/handlers/v2/provider.ts` (+6, -4)
- `packages/server/src/handlers/v2/question.ts` (+97, -0)
- `packages/server/src/handlers/v2/session.ts` (+177, -0)
- `packages/server/src/handlers/v2/skill.ts` (+8, -0)
- `packages/server/src/middleware/authorization.ts` (+60, -0)
- `packages/server/src/middleware/schema-error.ts` (+23, -0)
- `packages/server/src/routes.ts` (+37, -0)
- `packages/server/tsconfig.json` (+9, -0)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+15, -6)
- `packages/ui/script/build-oc2-v2-overrides.ts` (+32, -0)
- `packages/ui/src/components/apply-patch-file.test.ts` (+1, -0)
- `packages/ui/src/components/list.css` (+1, -1)
- `packages/ui/src/components/session-diff.test.ts` (+24, -2)
- `packages/ui/src/components/session-diff.ts` (+57, -2)
- `packages/ui/src/components/session-review.tsx` (+20, -20)
- `packages/ui/src/context/helper.tsx` (+6, -5)
- `packages/ui/src/theme/context.tsx` (+8, -2)
- `packages/ui/src/theme/desktop-theme.schema.json` (+7, -0)
- `packages/ui/src/theme/index.ts` (+3, -0)
- `packages/ui/src/theme/loader.ts` (+14, -5)
- `packages/ui/src/theme/themes/matrix.json` (+22, -0)
- `packages/ui/src/theme/themes/oc-2.json` (+376, -0)
- `packages/ui/src/theme/types.ts` (+5, -0)
- `packages/ui/src/theme/v2/avatar.ts` (+48, -0)
- `packages/ui/src/theme/v2/default-primitives.ts` (+113, -0)
- `packages/ui/src/theme/v2/foreground.ts` (+20, -0)
- `packages/ui/src/theme/v2/mapping.ts` (+148, -0)
- `packages/ui/src/theme/v2/resolve.ts` (+153, -0)
- `packages/ui/src/v2/components/accordion-v2.css` (+0, -2)
- `packages/ui/src/v2/components/avatar-v2.css` (+0, -1)
- `packages/ui/src/v2/components/badge-v2.css` (+4, -5)
- `packages/ui/src/v2/components/basic-tool-v2.css` (+0, -1)
- `packages/ui/src/v2/components/button-v2.css` (+23, -1)
- `packages/ui/src/v2/components/button-v2.stories.tsx` (+6, -3)
- `packages/ui/src/v2/components/button-v2.tsx` (+2, -2)
- `packages/ui/src/v2/components/checkbox-v2.css` (+0, -3)
- `packages/ui/src/v2/components/dialog-v2.css` (+9, -10)
- `packages/ui/src/v2/components/dialog-v2.stories.tsx` (+1, -1)
- `packages/ui/src/v2/components/dialog-v2.tsx` (+18, -2)
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
- `packages/ui/src/v2/components/select-v2.css` (+104, -15)
- `packages/ui/src/v2/components/select-v2.stories.tsx` (+3, -2)
- `packages/ui/src/v2/components/select-v2.tsx` (+16, -4)
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
- `packages/ui/src/v2/styles/theme.css` (+61, -0)
- `patches/@ai-sdk%2Fgoogle@3.0.73.patch` (+69, -0)
- `patches/@ai-sdk%2Fxai@3.0.82.patch` (+0, -99)
- `patches/@ai-sdk%2Fxai@3.0.92.patch` (+76, -0)
- `patches/gcp-metadata@8.1.2.patch` (+0, -14)
- `patches/pacote@21.5.1.patch` (+18, -0)
- `patches/virtua@0.49.1.patch` (+93, -0)
- `script/changelog-github.cjs` (+8, -12)
- `script/check-opencode-annotations.ts` (+3, -1)
- `script/check-opencode-promise-facades.ts` (+12, -3)
- `script/publish.ts` (+2, -0)
- `script/raw-changelog.ts` (+1, -3)
- `script/sync-zed.ts` (+0, -130)
- `script/upstream/package.json` (+1, -1)
- `specs/storage/remove-opencode-db.md` (+239, -0)
- `specs/v2/catalog-config-plugin-lifecycle.md` (+2, -0)
- `specs/v2/config.md` (+2, -2)
- `specs/v2/provider-model.md` (+43, -13)
- `specs/v2/schema-changelog.md` (+793, -0)
- `specs/v2/session.md` (+184, -0)
- `specs/v2/todo.md` (+95, -4)

### Key Diffs

#### packages/core/migration/20260511173437_session-metadata/migration.sql
```diff
diff --git a/packages/core/migration/20260511173437_session-metadata/migration.sql b/packages/core/migration/20260511173437_session-metadata/migration.sql
new file mode 100644
index 000000000..1f8fcaf64
--- /dev/null
+++ b/packages/core/migration/20260511173437_session-metadata/migration.sql
@@ -0,0 +1 @@
+ALTER TABLE `session` ADD `metadata` text;
```

#### packages/core/migration/20260511173437_session-metadata/snapshot.json
```diff
diff --git a/packages/core/migration/20260511173437_session-metadata/snapshot.json b/packages/core/migration/20260511173437_session-metadata/snapshot.json
new file mode 100644
index 000000000..8c979997c
--- /dev/null
+++ b/packages/core/migration/20260511173437_session-metadata/snapshot.json
@@ -0,0 +1,1560 @@
+{
+  "version": "7",
+  "dialect": "sqlite",
+  "id": "bf93c73b-5a48-4d63-9909-3c36a79b9788",
+  "prevIds": ["be5eae31-b7f8-4292-8827-c36a524abd1b", "fdfcccee-fb3a-481f-b801-b9835fa30d5d"],
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

#### packages/core/migration/20260601010001_normalize_storage_paths/migration.sql
```diff
diff --git a/packages/core/migration/20260601010001_normalize_storage_paths/migration.sql b/packages/core/migration/20260601010001_normalize_storage_paths/migration.sql
new file mode 100644
index 000000000..7eede8fa2
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
index 000000000..0f0faf7ee
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
index 000000000..92405490f
--- /dev/null
+++ b/packages/core/migration/20260601202201_amazing_prowler/migration.sql
@@ -0,0 +1 @@
+DROP TABLE `permission`;
\ No newline at end of file
```


*... and more files (showing first 5)*

## opencode Changes (34e5809..cb8be9b)

### Commits

- cb8be9b - chore: generate (opencode-agent[bot], 2026-07-14)
- 1504665 - feat(app): update tabs intro content (#36701) (David Hill, 2026-07-14)
- 7255ce9 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-14)
- 2b9cf5d - chore: generate (opencode-agent[bot], 2026-07-14)
- a625d35 - fix(app): preserve composer caret after requests (#36503) (Luke Parker, 2026-07-14)
- 449c649 - fix(app): 78x faster Home cold loading (#36214) (Luke Parker, 2026-07-14)
- 35c88c3 - fix(app): preserve timeline bottom anchoring (#36160) (Luke Parker, 2026-07-14)
- b5e0902 - fix(app): clarify status indicator severity (#36031) (Luke Parker, 2026-07-14)
- 9a51765 - fix(ui): preserve code spans adjacent to tildes (#35835) (Luke Parker, 2026-07-14)
- bb31c9b - sync release versions for v1.17.20 (opencode, 2026-07-13)
- 5117679 - fix(opencode): remove obsolete Luna Responses Lite workaround (#36750) (Aiden Cline, 2026-07-13)
- 0d5798c - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-13)
- 808677a - chore: bump gitlab-ai-provider to 6.11.1 (#36722) (Vladimir Glafirov, 2026-07-13)
- fe41e9d - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-13)
- 0768c46 - chore: generate (opencode-agent[bot], 2026-07-13)
- 1586a26 - fix(data): selects (Adam, 2026-07-13)
- f026c14 - fix(data): select component ux (Adam, 2026-07-13)
- b7fdb59 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-13)
- 049ee1c - chore(provider): bump Azure AI SDK for GPT-5.6 (#36704) (Aiden Cline, 2026-07-13)
- e71fbb6 - sync release versions for v1.17.19 (opencode, 2026-07-13)
- c9976d6 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-13)
- 2773440 - chore: generate (opencode-agent[bot], 2026-07-13)
- e434ce0 - fix(provider): support OpenAI pro reasoning mode (#36694) (Aiden Cline, 2026-07-13)
- c2f93ae - chore: generate (opencode-agent[bot], 2026-07-13)
- 92cc8f5 - fix(stats): correct breadcrumb behavior (Adam, 2026-07-13)
- 49d997a - fix(xai): default store to false for Responses (#36629) (Mark, 2026-07-13)
- 67aa9ce - fix(opencode): support Luna Responses Lite over OAuth (#36685) (Aiden Cline, 2026-07-13)
- 7ec3d67 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-13)
- 5401eba - chore: bump gitlab-ai-provider to 6.11.0 (#36668) (Vladimir Glafirov, 2026-07-13)
- 99668cf - fix(provider): tweak reasoning option driven max budget variants (#36626) (Aiden Cline, 2026-07-13)
- b3a012c - fix(cli): switch org after console logout (#36276) (opencode-agent[bot], 2026-07-13)
- 51b9c72 - fix(app): remove interface transition changes accidentally merged into dev (#36653) (usrnk1, 2026-07-13)
- b4e49d5 - feat(app): redesign attachment cards (#35945) (Aarav Sareen, 2026-07-13)
- 2b29854 - chore: generate (opencode-agent[bot], 2026-07-13)
- 8ce5038 - Merge branch 'dev' of https://github.com/anomalyco/opencode into interface-toggle (usrnk1, 2026-07-13)
- 446510a - tui: surface a dismissible new-interface notice and tighten settings copy for clarity (usrnk1, 2026-07-13)
- 49028b6 - chore: generate (opencode-agent[bot], 2026-07-13)
- d595c7e - feat(app): review panel updates (#36240) (Aarav Sareen, 2026-07-13)
- 17cd4a8 - feat(app): align edit project modal with v2 style (#36213) (Aarav Sareen, 2026-07-13)
- 9bbf791 - chore: generate (opencode-agent[bot], 2026-07-13)
- 97f502e - feat(app): middle click to open new tab (#36215) (Aarav Sareen, 2026-07-13)
- ac5e249 - feat(app): add interface transition setting (usrnk1, 2026-07-13)
- 140e796 - feat(ui): add accent badge variant (usrnk1, 2026-07-13)
- dd02cea - feat(desktop): fix clipped labels and branch tooltip (#35724) (usrnk1, 2026-07-13)
- a8062ea - fix(provider): derive variants from reasoning metadata (#36624) (Aiden Cline, 2026-07-13)
- f476847 - fix(opencode): filter unsupported GPT-5.6 OAuth alias (#36621) (Aiden Cline, 2026-07-13)
- 8168f0f - fix(provider): route gateway variants by api id (#36614) (Aiden Cline, 2026-07-13)
- 8036440 - ci: remove starptech from core triage assignees (#36618) (opencode-agent[bot], 2026-07-12)
- cf75036 - chore: generate (opencode-agent[bot], 2026-07-12)
- 6f8e1dd - fix(provider): derive variants from reasoning options (#36543) (Aiden Cline, 2026-07-12)
- 4dcfd91 - chore: generate (opencode-agent[bot], 2026-07-12)
- d7c0db8 - fix(openai): use codex context limits for gpt-5.6 (#36248) (Nabs, 2026-07-12)
- 184da0e - test(opencode): refresh stale model references (#36546) (Aiden Cline, 2026-07-12)
- a244d82 - test(opencode): refresh models.dev fixture (#36541) (Aiden Cline, 2026-07-12)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `.opencode/tool/github-triage.ts` (+1, -1)
- `packages/opencode/test/tool/fixtures/models-api.json` (+122173, -66780)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/console/core/package.json` (+1, -1)
- `packages/core/package.json` (+4, -4)
- `packages/core/src/models-dev.ts` (+16, -0)
- `packages/stats/core/package.json` (+1, -1)

#### Other Changes
- `bun.lock` (+83, -49)
- `nix/hashes.json` (+4, -4)
- `package.json` (+4, -5)
- `packages/app/e2e/regression/file-browser-sidebar-tab-switch.spec.ts` (+150, -0)
- `packages/app/e2e/regression/review-open-file.spec.ts` (+9, -1)
- `packages/app/e2e/regression/review-tab-switch.spec.ts` (+2, -2)
- `packages/app/e2e/regression/review-terminal-stacked.spec.ts` (+1, -1)
- `packages/app/e2e/regression/session-request-docks.spec.ts` (+62, -0)
- `packages/app/e2e/regression/session-timeline-projection.spec.ts` (+4, -1)
- `packages/app/e2e/utils/mock-server.ts` (+29, -0)
- `packages/app/package.json` (+1, -1)
- `packages/app/src/assets/help/home.png` (+-, --)
- `packages/app/src/assets/help/introducing-tabs.mp4` (+-, --)
- `packages/app/src/assets/help/tabs.png` (+-, --)
- `packages/app/src/components/dialog-edit-project-v2.tsx` (+156, -0)
- `packages/app/src/components/dialog-edit-project.tsx` (+38, -135)
- `packages/app/src/components/edit-project.ts` (+119, -0)
- `packages/app/src/components/file-tree-v2-model.test.ts` (+36, -8)
- `packages/app/src/components/file-tree-v2-model.ts` (+30, -0)
- `packages/app/src/components/file-tree-v2.tsx` (+60, -29)
- `packages/app/src/components/help-button.tsx` (+28, -10)
- `packages/app/src/components/prompt-input.tsx` (+20, -3)
- `packages/app/src/components/prompt-input/context-items.tsx` (+13, -3)
- `packages/app/src/components/prompt-input/image-attachments.css` (+43, -0)
- `packages/app/src/components/prompt-input/image-attachments.tsx` (+128, -21)
- `packages/app/src/components/prompt-workspace-selector.tsx` (+12, -4)
- `packages/app/src/components/session/index.ts` (+1, -0)
- `packages/app/src/components/session/open-in-app-v2.tsx` (+98, -0)
- `packages/app/src/components/session/open-in-app.tsx` (+229, -0)
- `packages/app/src/components/session/session-sortable-tab-v2.tsx` (+66, -0)
- `packages/app/src/components/status-popover-indicator.test.ts` (+36, -0)
- `packages/app/src/components/status-popover-indicator.ts` (+19, -0)
- `packages/app/src/components/status-popover.tsx` (+25, -43)
- `packages/app/src/context/global-sync/child-store.test.ts` (+52, -0)
- `packages/app/src/context/global-sync/child-store.ts` (+31, -6)
- `packages/app/src/context/global-sync/event-reducer.test.ts` (+16, -0)
- `packages/app/src/context/global-sync/event-reducer.ts` (+7, -8)
- `packages/app/src/context/global-sync/home-session-index.test.ts` (+144, -0)
- `packages/app/src/context/global-sync/home-session-index.ts` (+174, -0)
- `packages/app/src/context/layout.tsx` (+12, -4)
- `packages/app/src/context/platform.tsx` (+3, -0)
- `packages/app/src/context/prompt-state.ts` (+1, -1)
- `packages/app/src/context/prompt.tsx` (+1, -0)
- `packages/app/src/context/server-sync.tsx` (+13, -1)
- `packages/app/src/i18n/en.ts` (+1, -1)
- `packages/app/src/pages/home-session-open.test.ts` (+24, -5)
- `packages/app/src/pages/home-session-open.ts` (+3, -0)
- `packages/app/src/pages/home.tsx` (+79, -27)
- `packages/app/src/pages/session.tsx` (+40, -3)
- `packages/app/src/pages/session/file-tabs.tsx` (+329, -1)
- `packages/app/src/pages/session/session-side-panel.tsx` (+409, -157)
- `packages/app/src/pages/session/timeline/message-timeline.tsx` (+6, -0)
- `packages/app/src/pages/session/timeline/projection.ts` (+2, -0)
- `packages/app/src/pages/session/timeline/rows.ts` (+4, -2)
- `packages/app/src/pages/session/v2/review-panel-v2.tsx` (+3, -5)
- `packages/app/src/pages/session/v2/session-file-browser-tab.tsx` (+74, -89)
- `packages/app/test-browser/solid-virtual.test.ts` (+43, -16)
- `packages/cli/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/mail/package.json` (+1, -1)
- `packages/console/support/package.json` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/desktop/src/main/ipc.ts` (+10, -0)
- `packages/desktop/src/preload/index.ts` (+1, -0)
- `packages/desktop/src/preload/types.ts` (+1, -0)
- `packages/desktop/src/renderer/index.tsx` (+3, -0)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/enterprise/package.json` (+1, -1)
- `packages/function/package.json` (+1, -1)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/package.json` (+4, -4)
- `packages/opencode/src/account/account.ts` (+13, -1)
- `packages/opencode/src/plugin/openai/codex.ts` (+10, -1)
- `packages/opencode/src/provider/provider.ts` (+21, -11)
- `packages/opencode/src/provider/transform.ts` (+189, -6)
- `packages/opencode/test/account/service.test.ts` (+47, -0)
- `packages/opencode/test/plugin/codex.test.ts` (+43, -0)
- `packages/opencode/test/provider/provider.test.ts` (+145, -33)
- `packages/opencode/test/provider/transform.test.ts` (+336, -0)
- `packages/opencode/test/session/llm.test.ts` (+2, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/session-ui/src/components/message-file.test.ts` (+11, -1)
- `packages/session-ui/src/components/message-file.ts` (+21, -0)
- `packages/session-ui/src/components/message-part.css` (+24, -2)
- `packages/session-ui/src/components/message-part.tsx` (+62, -21)
- `packages/session-ui/src/v2/components/attachment-card-v2.css` (+58, -0)
- `packages/session-ui/src/v2/components/attachment-card-v2.tsx` (+26, -0)
- `packages/session-ui/src/v2/components/comment-card-v2.tsx` (+27, -0)
- `packages/session-ui/src/v2/components/line-comment-annotations-v2.tsx` (+8, -0)
- `packages/session-ui/src/v2/components/session-review-v2.css` (+6, -1)
- `packages/session-ui/src/v2/components/session-review-v2.tsx` (+2, -3)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+2, -1)
- `packages/stats/app/src/routes/[lab]/[model].tsx` (+27, -41)
- `packages/stats/app/src/routes/[lab]/index.tsx` (+15, -22)
- `packages/stats/app/src/routes/breadcrumb-select.tsx` (+71, -0)
- `packages/stats/app/src/routes/compare/index.tsx` (+1, -1)
- `packages/stats/app/src/routes/index.css` (+117, -109)
- `packages/stats/server/package.json` (+1, -1)
- `packages/storybook/.storybook/mocks/app/context/prompt.ts` (+4, -0)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/components/tabs.css` (+101, -0)
- `packages/ui/src/context/marked-code-span.test.ts` (+13, -0)
- `packages/ui/src/context/marked-code-span.ts` (+17, -0)
- `packages/ui/src/context/marked.tsx` (+2, -0)
- `packages/ui/src/v2/components/file-tree-v2.css` (+18, -1)
- `packages/ui/src/v2/components/icon.tsx` (+8, -0)
- `packages/ui/src/v2/components/line-comment-v2.css` (+53, -0)
- `packages/ui/src/v2/components/line-comment-v2.tsx` (+151, -2)
- `packages/ui/src/v2/components/project-avatar-v2.tsx` (+2, -3)
- `packages/ui/src/v2/components/split-button-v2.css` (+99, -0)
- `packages/ui/src/v2/components/split-button-v2.tsx` (+48, -0)
- `packages/web/package.json` (+1, -1)
- `patches/@tanstack%2Fsolid-virtual@3.13.28.patch` (+0, -45)
- `patches/@tanstack%2Fvirtual-core@3.17.0.patch` (+0, -105)
- `patches/@tanstack%2Fvirtual-core@3.17.3.patch` (+108, -0)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### .opencode/tool/github-triage.ts
```diff
diff --git a/.opencode/tool/github-triage.ts b/.opencode/tool/github-triage.ts
index f25ca48..e861e1e 100644
--- a/.opencode/tool/github-triage.ts
+++ b/.opencode/tool/github-triage.ts
@@ -4,7 +4,7 @@ import { tool } from "@opencode-ai/plugin"
 const TEAM = {
   tui: ["kommander", "simonklee"],
   desktop_web: ["Hona", "Brendonovich"],
-  core: ["jlongster", "rekram1-node", "nexxeln", "kitlangton", "starptech"],
+  core: ["jlongster", "rekram1-node", "nexxeln", "kitlangton"],
   inference: ["fwang", "MrMushrooooom", "starptech"],
   windows: ["Hona"],
 } as const
```

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index ffc7a75..9820650 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.17.18",
+  "version": "1.17.20",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index faac818..cbc26ff 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.17.18",
+  "version": "1.17.20",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
@@ -64,7 +64,7 @@
     "@ai-sdk/alibaba": "1.0.17",
     "@ai-sdk/amazon-bedrock": "4.0.112",
     "@ai-sdk/anthropic": "3.0.82",
-    "@ai-sdk/azure": "3.0.49",
+    "@ai-sdk/azure": "3.0.88",
     "@ai-sdk/cerebras": "2.0.41",
     "@ai-sdk/cohere": "3.0.27",
     "@ai-sdk/deepinfra": "2.0.41",
@@ -73,7 +73,7 @@
     "@ai-sdk/google-vertex": "4.0.128",
     "@ai-sdk/groq": "3.0.31",
     "@ai-sdk/mistral": "3.0.27",
-    "@ai-sdk/openai": "3.0.53",
+    "@ai-sdk/openai": "3.0.84",
     "@ai-sdk/openai-compatible": "2.0.41",
     "@ai-sdk/perplexity": "3.0.26",
     "@ai-sdk/provider": "3.0.8",
@@ -108,7 +108,7 @@
     "drizzle-orm": "catalog:",
     "effect": "catalog:",
     "fuzzysort": "3.1.0",
-    "gitlab-ai-provider": "6.10.0",
+    "gitlab-ai-provider": "6.11.1",
     "glob": "13.0.5",
     "google-auth-library": "10.5.0",
     "gray-matter": "4.0.3",
```

#### packages/core/src/models-dev.ts
```diff
diff --git a/packages/core/src/models-dev.ts b/packages/core/src/models-dev.ts
index c2325cb..602133d 100644
--- a/packages/core/src/models-dev.ts
+++ b/packages/core/src/models-dev.ts
@@ -44,6 +44,21 @@ const Cost = Schema.Struct({
   ),
 })
 
+const ReasoningOption = Schema.Union([
+  Schema.Struct({
+    type: Schema.Literal("effort"),
+    values: Schema.Array(Schema.NullOr(Schema.String)),
+  }),
+  Schema.Struct({
+    type: Schema.Literal("toggle"),
+  }),
+  Schema.Struct({
+    type: Schema.Literal("budget_tokens"),
+    min: Schema.optional(Schema.Finite),
+    max: Schema.optional(Schema.Finite),
+  }),
+])
+
 export const Model = Schema.Struct({
   id: Schema.String,
   name: Schema.String,
@@ -53,6 +68,7 @@ export const Model = Schema.Struct({
   reasoning: Schema.Boolean,
   temperature: Schema.Boolean,
   tool_call: Schema.Boolean,
+  reasoning_options: Schema.optional(Schema.Array(ReasoningOption)),
   interleaved: Schema.optional(
     Schema.Union([
       Schema.Literal(true),
```

#### packages/opencode/test/tool/fixtures/models-api.json
```diff
diff --git a/packages/opencode/test/tool/fixtures/models-api.json b/packages/opencode/test/tool/fixtures/models-api.json
index 6302a95..8ead8c2 100644
--- a/packages/opencode/test/tool/fixtures/models-api.json
+++ b/packages/opencode/test/tool/fixtures/models-api.json
@@ -1,709 +1,976 @@
 {
-  "302ai": {
-    "id": "302ai",
-    "env": ["302AI_API_KEY"],
+  "requesty": {
+    "id": "requesty",
+    "env": ["REQUESTY_API_KEY"],
     "npm": "@ai-sdk/openai-compatible",
-    "api": "https://api.302.ai/v1",
-    "name": "302.AI",
-    "doc": "https://doc.302.ai",
+    "api": "https://router.requesty.ai/v1",
+    "name": "Requesty",
+    "doc": "https://requesty.ai/solution/llm-routing/models",
     "models": {
-      "qwen3-235b-a22b": {
-        "id": "qwen3-235b-a22b",
-        "name": "Qwen3-235B-A22B",
-        "family": "qwen",
-        "attachment": false,
-        "reasoning": false,
-        "tool_call": true,
-        "temperature": true,
-        "knowledge": "2025-04",
-        "release_date": "2025-04-29",
-        "last_updated": "2025-04-29",
-        "modalities": {
-          "input": ["text"],
-          "output": ["text"]
-        },
-        "open_weights": false,
-        "limit": {
-          "context": 128000,
-          "output": 16384
-        },
-        "cost": {
-          "input": 0.29,
-          "output": 2.86
-        }
-      },
-      "grok-4.1": {
-        "id": "grok-4.1",
-        "name": "grok-4.1",
+      "xai/grok-4": {
+        "id": "xai/grok-4",
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/agent.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/subagent-permissions.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/test/agent/agent.test.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/test/agent/plan-mode-subagent-bypass.test.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/test/agent/plugin-agent-regression.test.ts
- `src/core/` - review core changes from packages/core/migration/20260511173437_session-metadata/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260511173437_session-metadata/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260601010001_normalize_storage_paths/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260601010001_normalize_storage_paths/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260601202201_amazing_prowler/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260601202201_amazing_prowler/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260602002951_lowly_union_jack/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260602002951_lowly_union_jack/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260602182828_add_project_directories/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260602182828_add_project_directories/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260603001617_session_message_projection_indexes/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260603001617_session_message_projection_indexes/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260603040000_session_message_projection_order/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260603040000_session_message_projection_order/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260603141458_session_input_inbox/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260603141458_session_input_inbox/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260603160727_jittery_ezekiel_stane/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260603160727_jittery_ezekiel_stane/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260604172448_event_sourced_session_input/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260604172448_event_sourced_session_input/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260605003541_add_session_context_snapshot/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260605003541_add_session_context_snapshot/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260605042240_add_context_epoch_agent/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260605042240_add_context_epoch_agent/snapshot.json
- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/script/migration.ts
- `src/core/` - review core changes from packages/core/src/account.ts
- `src/core/` - review core changes from packages/core/src/agent.ts
- `src/core/` - review core changes from packages/core/src/aisdk.ts
- `src/core/` - review core changes from packages/core/src/auth.ts
- `src/core/` - review core changes from packages/core/src/background-job.ts
- `src/core/` - review core changes from packages/core/src/catalog.ts
- `src/core/` - review core changes from packages/core/src/command.ts
- `src/core/` - review core changes from packages/core/src/config.ts
- `src/core/` - review core changes from packages/core/src/config/agent.ts
- `src/core/` - review core changes from packages/core/src/config/command.ts
- `src/core/` - review core changes from packages/core/src/config/markdown.ts
- `src/core/` - review core changes from packages/core/src/config/plugin/agent.ts
- `src/core/` - review core changes from packages/core/src/config/plugin/command.ts
- `src/core/` - review core changes from packages/core/src/config/plugin/provider.ts
- `src/core/` - review core changes from packages/core/src/config/plugin/skill.ts
- `src/core/` - review core changes from packages/core/src/config/provider.ts
- `src/core/` - review core changes from packages/core/src/config/reference.ts
- `src/core/` - review core changes from packages/core/src/control-plane/move-session.ts
- `src/core/` - review core changes from packages/core/src/database/database.ts
- `src/core/` - review core changes from packages/core/src/database/migration.gen.ts
- `src/core/` - review core changes from packages/core/src/database/migration.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260127222353_familiar_lady_ursula.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260211171708_add_project_commands.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260213144116_wakeful_the_professor.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260225215848_workspace.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260227213759_add_session_workspace_id.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260228203230_blue_harpoon.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260303231226_add_workspace_fields.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260309230000_move_org_to_state.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260312043431_session_message_cursor.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260323234822_events.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260410174513_workspace-name.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260413175956_chief_energizer.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260423070820_add_icon_url_override.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260427172553_slow_nightmare.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260428004200_add_session_path.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260501142318_next_venus.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260504145000_add_sync_owner.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260507164347_add_workspace_time.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260510033149_session_usage.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260511000411_data_migration_state.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260511173437_session-metadata.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260601010001_normalize_storage_paths.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260601202201_amazing_prowler.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260602002951_lowly_union_jack.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260602182828_add_project_directories.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260603001617_session_message_projection_indexes.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260603040000_session_message_projection_order.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260603141458_session_input_inbox.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260603160727_jittery_ezekiel_stane.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260604172448_event_sourced_session_input.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260605003541_add_session_context_snapshot.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260605042240_add_context_epoch_agent.ts
- `src/core/` - review core changes from packages/core/src/database/path.ts
- `src/core/` - review core changes from packages/core/src/database/sqlite.bun.ts
- `src/core/` - review core changes from packages/core/src/database/sqlite.node.ts
- `src/core/` - review core changes from packages/core/src/database/sqlite.ts
- `src/core/` - review core changes from packages/core/src/effect/keyed-mutex.ts
- `src/core/` - review core changes from packages/core/src/event.ts
- `src/core/` - review core changes from packages/core/src/file-mutation.ts
- `src/core/` - review core changes from packages/core/src/filesystem.ts
- `src/core/` - review core changes from packages/core/src/filesystem/watcher.ts
- `src/core/` - review core changes from packages/core/src/flag/flag.ts
- `src/core/` - review core changes from packages/core/src/fs-util.ts
- `src/core/` - review core changes from packages/core/src/git.ts
- `src/core/` - review core changes from packages/core/src/id/id.ts
- `src/core/` - review core changes from packages/core/src/instruction-context.ts
- `src/core/` - review core changes from packages/core/src/location-layer.ts
- `src/core/` - review core changes from packages/core/src/location-mutation.ts
- `src/core/` - review core changes from packages/core/src/location-search.ts
- `src/core/` - review core changes from packages/core/src/location.ts
- `src/core/` - review core changes from packages/core/src/markdown.d.ts
- `src/core/` - review core changes from packages/core/src/model.ts
- `src/core/` - review core changes from packages/core/src/models-dev.ts
- `src/core/` - review core changes from packages/core/src/npm.ts
- `src/core/` - review core changes from packages/core/src/patch.ts
- `src/core/` - review core changes from packages/core/src/permission.ts
- `src/core/` - review core changes from packages/core/src/plugin.ts
- `src/core/` - review core changes from packages/core/src/plugin/account.ts
- `src/core/` - review core changes from packages/core/src/plugin/agent.ts
- `src/core/` - review core changes from packages/core/src/plugin/boot.ts
- `src/core/` - review core changes from packages/core/src/plugin/command.ts
- `src/core/` - review core changes from packages/core/src/plugin/command/initialize.txt
- `src/core/` - review core changes from packages/core/src/plugin/command/review.txt
- `src/core/` - review core changes from packages/core/src/plugin/models-dev.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/amazon-bedrock.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/anthropic.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/azure.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/cerebras.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/cloudflare-workers-ai.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/github-copilot.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/gitlab.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/google-vertex.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/index.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/kilo.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/llmgateway.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/nvidia.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/openai.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/opencode.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/openrouter.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/sap-ai-core.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/snowflake-cortex.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/vercel.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/xai.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/zenmux.ts
- `src/core/` - review core changes from packages/core/src/plugin/skill.ts
- `src/core/` - review core changes from packages/core/src/plugin/skill/customize-opencode.md
- `src/core/` - review core changes from packages/core/src/policy.ts
- `src/core/` - review core changes from packages/core/src/process.ts
- `src/core/` - review core changes from packages/core/src/project-reference.ts
- `src/core/` - review core changes from packages/core/src/project.ts
- `src/core/` - review core changes from packages/core/src/project/copy-strategies.ts
- `src/core/` - review core changes from packages/core/src/project/copy.ts
- `src/core/` - review core changes from packages/core/src/project/sql.ts
- `src/core/` - review core changes from packages/core/src/provider.ts
- `src/core/` - review core changes from packages/core/src/pty.ts
- `src/core/` - review core changes from packages/core/src/pty/driver.ts
- `src/core/` - review core changes from packages/core/src/public/agent.ts
- `src/core/` - review core changes from packages/core/src/public/index.ts
- `src/core/` - review core changes from packages/core/src/public/location.ts
- `src/core/` - review core changes from packages/core/src/public/model.ts
- `src/core/` - review core changes from packages/core/src/public/opencode.ts
- `src/core/` - review core changes from packages/core/src/public/session.ts
- `src/core/` - review core changes from packages/core/src/public/tool.ts
- `src/core/` - review core changes from packages/core/src/question.ts
- `src/core/` - review core changes from packages/core/src/repository-cache.ts
- `src/core/` - review core changes from packages/core/src/repository.ts
- `src/core/` - review core changes from packages/core/src/ripgrep.ts
- `src/core/` - review core changes from packages/core/src/schema.ts
- `src/core/` - review core changes from packages/core/src/session-message-updater.ts
- `src/core/` - review core changes from packages/core/src/session.ts
- `src/core/` - review core changes from packages/core/src/session/context-epoch.ts
- `src/core/` - review core changes from packages/core/src/session/error.ts
- `src/core/` - review core changes from packages/core/src/session/execution.ts
- `src/core/` - review core changes from packages/core/src/session/execution/local.ts
- `src/core/` - review core changes from packages/core/src/session/history.ts
- `src/core/` - review core changes from packages/core/src/session/info.ts
- `src/core/` - review core changes from packages/core/src/session/input.ts
- `src/core/` - review core changes from packages/core/src/session/message-id.ts
- `src/core/` - review core changes from packages/core/src/session/message-updater.ts
- `src/core/` - review core changes from packages/core/src/session/projector.ts
- `src/core/` - review core changes from packages/core/src/session/run-coordinator.ts
- `src/core/` - review core changes from packages/core/src/session/runner/index.ts
- `src/core/` - review core changes from packages/core/src/session/runner/llm.ts
- `src/core/` - review core changes from packages/core/src/session/runner/model.ts
- `src/core/` - review core changes from packages/core/src/session/runner/publish-llm-event.ts
- `src/core/` - review core changes from packages/core/src/session/runner/to-llm-message.ts
- `src/core/` - review core changes from packages/core/src/session/schema.ts
- `src/core/` - review core changes from packages/core/src/session/sql.ts
- `src/core/` - review core changes from packages/core/src/session/store.ts
- `src/core/` - review core changes from packages/core/src/session/todo.ts
- `src/core/` - review core changes from packages/core/src/skill.ts
- `src/core/` - review core changes from packages/core/src/skill/discovery.ts
- `src/core/` - review core changes from packages/core/src/skill/guidance.ts
- `src/core/` - review core changes from packages/core/src/snapshot.ts
- `src/core/` - review core changes from packages/core/src/state.ts
- `src/core/` - review core changes from packages/core/src/system-context/builtins.ts
- `src/core/` - review core changes from packages/core/src/system-context/index.ts
- `src/core/` - review core changes from packages/core/src/system-context/registry.ts
- `src/core/` - review core changes from packages/core/src/tool-output-store.ts
- `src/core/` - review core changes from packages/core/src/tool-output.ts
- `src/core/` - review core changes from packages/core/src/util/effect-flock.ts
- `src/core/` - review core changes from packages/core/src/util/hash.ts
- `src/core/` - review core changes from packages/core/src/v1/config/agent.ts
- `src/core/` - review core changes from packages/core/src/v1/config/command.ts
- `src/core/` - review core changes from packages/core/src/v1/config/config.ts
- `src/core/` - review core changes from packages/core/src/v1/config/migrate.ts
- `src/core/` - review core changes from packages/core/src/v1/config/plugin.ts
- `src/core/` - review core changes from packages/core/src/v1/config/provider-options.ts
- `src/core/` - review core changes from packages/core/src/v1/config/reference.ts
- `src/core/` - review core changes from packages/core/src/v1/permission.ts
- `src/core/` - review core changes from packages/core/src/v1/session.ts
- `src/core/` - review core changes from packages/core/src/workspace.ts
- `src/core/` - review core changes from packages/core/src/{session-event.ts => session/event.ts}
- `src/core/` - review core changes from packages/core/src/{session-message.ts => session/message.ts}
- `src/core/` - review core changes from packages/core/src/{session-prompt.ts => session/prompt.ts}
- `src/core/` - review core changes from packages/core/test/account.test.ts
- `src/core/` - review core changes from packages/core/test/agent.test.ts
- `src/core/` - review core changes from packages/core/test/application-tools.test.ts
- `src/core/` - review core changes from packages/core/test/background-job.test.ts
- `src/core/` - review core changes from packages/core/test/catalog.test.ts
- `src/core/` - review core changes from packages/core/test/command.test.ts
- `src/core/` - review core changes from packages/core/test/config/agent.test.ts
- `src/core/` - review core changes from packages/core/test/config/command.test.ts
- `src/core/` - review core changes from packages/core/test/config/config.test.ts
- `src/core/` - review core changes from packages/core/test/config/provider-options.test.ts
- `src/core/` - review core changes from packages/core/test/config/provider.test.ts
- `src/core/` - review core changes from packages/core/test/config/skill.test.ts
- `src/core/` - review core changes from packages/core/test/database-migration.test.ts
- `src/core/` - review core changes from packages/core/test/effect/keyed-mutex.test.ts
- `src/core/` - review core changes from packages/core/test/event.test.ts
- `src/core/` - review core changes from packages/core/test/file-mutation.test.ts
- `src/core/` - review core changes from packages/core/test/filesystem/filesystem.test.ts
- `src/core/` - review core changes from packages/core/test/filesystem/ignore.test.ts
- `src/core/` - review core changes from packages/core/test/filesystem/watcher.test.ts
- `src/core/` - review core changes from packages/core/test/fixture/effect-flock-worker.ts
- `src/core/` - review core changes from packages/core/test/fixture/git.ts
- `src/core/` - review core changes from packages/core/test/fixture/tmpdir.ts
- `src/core/` - review core changes from packages/core/test/fixtures/recordings/session-runner/openai-chat-streams-text.json
- `src/core/` - review core changes from packages/core/test/git.test.ts
- `src/core/` - review core changes from packages/core/test/instruction-context.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/account-auth-v2-migration.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/filesystem-containment.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/provider-isolation.test.ts
- `src/core/` - review core changes from packages/core/test/location-filesystem.test.ts
- `src/core/` - review core changes from packages/core/test/location-layer.test.ts
- `src/core/` - review core changes from packages/core/test/location-mutation.test.ts
- `src/core/` - review core changes from packages/core/test/location-search.test.ts
- `src/core/` - review core changes from packages/core/test/location.test.ts
- `src/core/` - review core changes from packages/core/test/models.test.ts
- `src/core/` - review core changes from packages/core/test/move-session.test.ts
- `src/core/` - review core changes from packages/core/test/npm.test.ts
- `src/core/` - review core changes from packages/core/test/patch.test.ts
- `src/core/` - review core changes from packages/core/test/permission.test.ts
- `src/core/` - review core changes from packages/core/test/plugin.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/command.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-alibaba.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-amazon-bedrock.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-anthropic.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-azure-cognitive-services.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-azure.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-cerebras.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-cloudflare-workers-ai.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-cohere.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-deepinfra.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-dynamic.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-github-copilot.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-gitlab.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-google-vertex-anthropic.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-google-vertex.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-google.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-groq.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-helper.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-kilo.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-llmgateway.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-mistral.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-nvidia.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-openai.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-opencode.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-openrouter.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-perplexity.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-snowflake-cortex.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-togetherai.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-vercel.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-xai.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-zenmux.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/skill.test.ts
- `src/core/` - review core changes from packages/core/test/policy.test.ts
- `src/core/` - review core changes from packages/core/test/process/process.test.ts
- `src/core/` - review core changes from packages/core/test/project-copy.test.ts
- `src/core/` - review core changes from packages/core/test/project-reference.test.ts
- `src/core/` - review core changes from packages/core/test/project.test.ts
- `src/core/` - review core changes from packages/core/test/pty/pty-output-isolation.test.ts
- `src/core/` - review core changes from packages/core/test/pty/pty-session.test.ts
- `src/core/` - review core changes from packages/core/test/public-opencode.test.ts
- `src/core/` - review core changes from packages/core/test/question.test.ts
- `src/core/` - review core changes from packages/core/test/repository-cache.test.ts
- `src/core/` - review core changes from packages/core/test/repository.test.ts
- `src/core/` - review core changes from packages/core/test/session-create.test.ts
- `src/core/` - review core changes from packages/core/test/session-projector.test.ts
- `src/core/` - review core changes from packages/core/test/session-prompt.test.ts
- `src/core/` - review core changes from packages/core/test/session-run-coordinator.test.ts
- `src/core/` - review core changes from packages/core/test/session-runner-message.test.ts
- `src/core/` - review core changes from packages/core/test/session-runner-model.test.ts
- `src/core/` - review core changes from packages/core/test/session-runner-recorded.test.ts
- `src/core/` - review core changes from packages/core/test/session-runner-tool-registry.test.ts
- `src/core/` - review core changes from packages/core/test/session-runner.test.ts
- `src/core/` - review core changes from packages/core/test/session-todo.test.ts
- `src/core/` - review core changes from packages/core/test/session-tool-progress.test.ts
- `src/core/` - review core changes from packages/core/test/skill-discovery.test.ts
- `src/core/` - review core changes from packages/core/test/skill.test.ts
- `src/core/` - review core changes from packages/core/test/skill/guidance.test.ts
- `src/core/` - review core changes from packages/core/test/system-context/builtins.test.ts
- `src/core/` - review core changes from packages/core/test/system-context/index.test.ts
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
- `src/core/` - review core changes from packages/core/test/util/effect-flock.test.ts
- `src/core/` - review core changes from packages/kilo-indexing/src/indexing/orchestrator.ts
- `src/core/` - review core changes from packages/kilo-indexing/test/kilocode/indexing/orchestrator.test.ts
- `src/permission/` - review permission changes from packages/core/src/permission/saved.ts
- `src/permission/` - review permission changes from packages/core/src/permission/schema.ts
- `src/permission/` - review permission changes from packages/core/src/permission/sql.ts
- `src/permission/` - review permission changes from packages/opencode/src/kilocode/permission/allow-everything.ts
- `src/permission/` - review permission changes from packages/opencode/src/kilocode/permission/drain.ts
- `src/permission/` - review permission changes from packages/opencode/src/kilocode/permission/headless.ts
- `src/permission/` - review permission changes from packages/opencode/src/permission/evaluate.ts
- `src/permission/` - review permission changes from packages/opencode/src/permission/index.ts
- `src/permission/` - review permission changes from packages/opencode/src/permission/schema.ts
- `src/permission/` - review permission changes from packages/opencode/test/kilocode/permission/env-read.test.ts
- `src/permission/` - review permission changes from packages/opencode/test/kilocode/permission/external-directory-allow.test.ts
- `src/permission/` - review permission changes from packages/opencode/test/kilocode/permission/next.always-rules.test.ts
- `src/permission/` - review permission changes from packages/opencode/test/kilocode/permission/next.reply-routing.test.ts
- `src/permission/` - review permission changes from packages/opencode/test/permission/next.test.ts
- `src/tool/AGENTS.md.ts` - update based on kilocode packages/core/src/tool/AGENTS.md changes
- `src/tool/agent-manager-models.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager-models.ts changes
- `src/tool/agent-manager.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager.ts changes
- `src/tool/application-tools.ts` - update based on kilocode packages/core/src/tool/application-tools.ts changes
- `src/tool/apply-patch.ts` - update based on kilocode packages/core/src/tool/apply-patch.ts changes
- `src/tool/apply_patch.test.ts` - update based on kilocode packages/opencode/test/tool/apply_patch.test.ts changes
- `src/tool/apply_patch.ts` - update based on kilocode packages/opencode/src/tool/apply_patch.ts changes
- `src/tool/background-process.ts` - update based on kilocode packages/opencode/src/kilocode/tool/background-process.ts changes
- `src/tool/bash.ts` - update based on kilocode packages/core/src/tool/bash.ts changes
- `src/tool/builtins.ts` - update based on kilocode packages/core/src/tool/builtins.ts changes
- `src/tool/edit.test.ts` - update based on kilocode packages/opencode/test/tool/edit.test.ts changes
- `src/tool/edit.ts` - update based on kilocode packages/core/src/tool/edit.ts changes
- `src/tool/edit.ts` - update based on kilocode packages/opencode/src/tool/edit.ts changes
- `src/tool/encoded-io.ts` - update based on kilocode packages/opencode/src/kilocode/tool/encoded-io.ts changes
- `src/tool/external-directory.test.ts` - update based on kilocode packages/opencode/test/tool/external-directory.test.ts changes
- `src/tool/external-directory.ts` - update based on kilocode packages/opencode/src/tool/external-directory.ts changes
- `src/tool/generate-image.ts` - update based on kilocode packages/opencode/src/kilocode/tool/generate-image.ts changes
- `src/tool/github-triage.ts` - update based on opencode .opencode/tool/github-triage.ts changes
- `src/tool/glob.test.ts` - update based on kilocode packages/opencode/test/tool/glob.test.ts changes
- `src/tool/glob.ts` - update based on kilocode packages/core/src/tool/glob.ts changes
- `src/tool/glob.ts` - update based on kilocode packages/opencode/src/tool/glob.ts changes
- `src/tool/grep.test.ts` - update based on kilocode packages/opencode/test/tool/grep.test.ts changes
- `src/tool/grep.ts` - update based on kilocode packages/core/src/tool/grep.ts changes
- `src/tool/grep.ts` - update based on kilocode packages/opencode/src/tool/grep.ts changes
- `src/tool/interactive-terminal.ts` - update based on kilocode packages/opencode/src/kilocode/tool/interactive-terminal.ts changes
- `src/tool/lsp.test.ts` - update based on kilocode packages/opencode/test/tool/lsp.test.ts changes
- `src/tool/lsp.ts` - update based on kilocode packages/opencode/src/tool/lsp.ts changes
- `src/tool/memory-recall.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/memory-recall.test.ts changes
- `src/tool/models-api.json.ts` - update based on opencode packages/opencode/test/tool/fixtures/models-api.json changes
- `src/tool/native.ts` - update based on kilocode packages/core/src/tool/native.ts changes
- `src/tool/parameters.test.ts.snap.ts` - update based on kilocode packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap changes
- `src/tool/parameters.test.ts` - update based on kilocode packages/opencode/test/tool/parameters.test.ts changes
- `src/tool/question.test.ts` - update based on kilocode packages/opencode/test/tool/question.test.ts changes
- `src/tool/question.ts` - update based on kilocode packages/core/src/tool/question.ts changes
- `src/tool/read.test.ts` - update based on kilocode packages/opencode/test/tool/read.test.ts changes
- `src/tool/read.ts` - update based on kilocode packages/core/src/tool/read.ts changes
- `src/tool/read.ts` - update based on kilocode packages/opencode/src/tool/read.ts changes
- `src/tool/recall.test.ts` - update based on kilocode packages/opencode/test/tool/recall.test.ts changes
- `src/tool/recall.ts` - update based on kilocode packages/opencode/src/tool/recall.ts changes
- `src/tool/registry.test.ts` - update based on kilocode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/core/src/tool/registry.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
- `src/tool/repo-overview.test.ts}.ts` - update based on kilocode packages/opencode/test/{tool/repo_overview.test.ts => kilocode/tool/repo-overview.test.ts} changes
- `src/tool/repo-overview.ts}.ts` - update based on kilocode packages/opencode/src/{tool/repo_overview.ts => kilocode/tool/repo-overview.ts} changes
- `src/tool/repo-overview.txt}.ts` - update based on kilocode packages/opencode/src/{tool/repo_overview.txt => kilocode/tool/repo-overview.txt} changes
- `src/tool/repo_clone.test.ts` - update based on kilocode packages/opencode/test/{ => kilocode}/tool/repo_clone.test.ts changes
- `src/tool/shell.test.ts` - update based on kilocode packages/opencode/test/tool/shell.test.ts changes
- `src/tool/shell.ts` - update based on kilocode packages/opencode/src/tool/shell.ts changes
- `src/tool/skill.test.ts` - update based on kilocode packages/opencode/test/tool/skill.test.ts changes
- `src/tool/skill.ts` - update based on kilocode packages/core/src/tool/skill.ts changes
- `src/tool/skill.ts` - update based on kilocode packages/opencode/src/tool/skill.ts changes
- `src/tool/task.test.ts` - update based on kilocode packages/opencode/test/tool/task.test.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/kilocode/tool/task.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/tool/task.ts changes
- `src/tool/task.txt.ts` - update based on kilocode packages/opencode/src/tool/task.txt changes
- `src/tool/todowrite.ts` - update based on kilocode packages/core/src/tool/todowrite.ts changes
- `src/tool/tool.ts` - update based on kilocode packages/opencode/src/tool/tool.ts changes
- `src/tool/truncate.ts` - update based on kilocode packages/opencode/src/tool/truncate.ts changes
- `src/tool/truncation.test.ts` - update based on kilocode packages/opencode/test/tool/truncation.test.ts changes
- `src/tool/warpgrep.ts` - update based on kilocode packages/opencode/src/tool/warpgrep.ts changes
- `src/tool/webfetch.ts` - update based on kilocode packages/core/src/tool/webfetch.ts changes
- `src/tool/webfetch.ts` - update based on kilocode packages/opencode/src/tool/webfetch.ts changes
- `src/tool/websearch.test.ts` - update based on kilocode packages/opencode/test/tool/websearch.test.ts changes
- `src/tool/websearch.ts` - update based on kilocode packages/core/src/tool/websearch.ts changes
- `src/tool/write.test.ts` - update based on kilocode packages/opencode/test/tool/write.test.ts changes
- `src/tool/write.ts` - update based on kilocode packages/core/src/tool/write.ts changes
- `src/tool/write.ts` - update based on kilocode packages/opencode/src/tool/write.ts changes
