# Upstream Changes Report
Generated: 2026-09-10 10:47:31

## Summary
- kilocode: 255 commits, 653 files changed
- opencode: 13 commits, 86 files changed

## kilocode Changes (a7a7690ca..70f1f5394)

### Commits

- 70f1f5394 - Merge pull request #13993 from Kilo-Org/friendly-jaborosa (Christiaan Arnoldus, 2026-09-10)
- 115bc0962 - Merge pull request #13995 from Kilo-Org/claude-redundant-experimental-label (Andrea Giammarchi, 2026-09-10)
- 6c3197d9b - Merge pull request #14000 from Kilo-Org/profile-worktree-deletion-time (Marius, 2026-09-10)
- ec38075b7 - Merge pull request #13998 from Kilo-Org/docs-agent-manager-pr (Marius, 2026-09-10)
- ee5f9ee09 - Merge pull request #13997 from Kilo-Org/docs-notifications-caffeinate (Marius, 2026-09-10)
- 73feb9b82 - Merge remote-tracking branch 'origin/main' into friendly-jaborosa (Christiaan Arnoldus, 2026-09-10)
- d6c2189f0 - docs(agent-manager): correct PR panel navigation and suggestion scope (marius-kilocode, 2026-09-10)
- 8219b3456 - Merge branch 'main' into claude-redundant-experimental-label (Andrea Giammarchi, 2026-09-10)
- 0e0a7cf8d - Merge pull request #13999 from Kilo-Org/docs-session-goals (Marius, 2026-09-10)
- 89f48bdaf - Merge pull request #13996 from Kilo-Org/docs-swarm-terminal (Marius, 2026-09-10)
- f0a9fc2a7 - docs(kilo-docs): scope goal suppression to completion alerts (marius-kilocode, 2026-09-10)
- 7e0bc2175 - perf(core): skip source project resolve when sessions move without changes (marius-kilocode, 2026-09-10)
- 9e60f64be - docs: document session goals (marius-kilocode, 2026-09-10)
- 60a673c59 - docs(agent-manager): document PR review, merge, and push-fix workflow (marius-kilocode, 2026-09-10)
- 3bbae4eea - docs(kilo-docs): document task notifications and Keep Awake (marius-kilocode, 2026-09-10)
- d5b5c875e - docs(kilo-docs): document Kilo Swarm board view and terminal removal (marius-kilocode, 2026-09-10)
- 685afc6f6 - fix(vscode): remove redundant Experimental Claude Migration detail (webreflection, 2026-09-10)
- 74a35d9b6 - Merge pull request #13977 from Kilo-Org/prompt-agent-manager (Andrea Giammarchi, 2026-09-10)
- 9a0cb9d2e - release: v7.6.0 (kilo-maintainer[bot], 2026-09-10)
- b41b3d2ff - fix(vscode): only feature recommended auto models (Christiaan Arnoldus, 2026-09-10)
- 24cc02de1 - fix(vscode): scope terminal permissions by session (webreflection, 2026-09-10)
- 5fc644523 - Merge branch 'main' into prompt-agent-manager (Andrea Giammarchi, 2026-09-10)
- e7e9a0328 - Merge pull request #13991 from Kilo-Org/fix-agent-manager-colon-button-styling (Marius, 2026-09-10)
- 282c19a9c - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-10)
- 8cb88e146 - fix(agent-manager): align section header chevrons (marius-kilocode, 2026-09-10)
- 3f102483d - Merge branch 'main' into prompt-agent-manager (Andrea Giammarchi, 2026-09-10)
- 448c8214b - fix(ui): keep expanded icon buttons unhighlighted (marius-kilocode, 2026-09-10)
- 364ebcac2 - Merge pull request #13990 from Kilo-Org/research-kilo-swarm-agent-lifecycle-management (Marius, 2026-09-10)
- 7febec58f - fix(cli): warn when board_post targets a stopped subagent (marius-kilocode, 2026-09-10)
- 5e7eedc99 - Merge pull request #13987 from Kilo-Org/fix-wroktree-session-animation-regression (Marius, 2026-09-10)
- 09e90f4c5 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-10)
- 5026f6d45 - fix(vscode): settle encrypted reasoning and stop tool reveal replay (marius-kilocode, 2026-09-10)
- 5326d1692 - fix(vscode): preserve permission claims during pruning (webreflection, 2026-09-09)
- ae1a8c366 - fix(vscode): avoid unsafe permission queue access (webreflection, 2026-09-09)
- e09250ae2 - Merge branch 'main' into prompt-agent-manager (Andrea Giammarchi, 2026-09-09)
- d12a1392b - fix(vscode): prevent permission prompt races (webreflection, 2026-09-09)
- a74c4e9bf - Merge pull request #13974 from Kilo-Org/fix-reasoning-ui-layout-flicker (Marius, 2026-09-09)
- 8654c578e - Merge pull request #13976 from Kilo-Org/center-button-content-and-hover-animation (Marius, 2026-09-09)
- 759bd846a - Merge pull request #13975 from Kilo-Org/glistening-borogovia (Marius, 2026-09-09)
- 4ea0daeeb - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-09)
- 614ae38fc - Merge pull request #13970 from Kilo-Org/fix-plan-persistence-on-worktree-switch (Marius, 2026-09-09)
- e85805f30 - fix(vscode): show PR push toggle state (marius-kilocode, 2026-09-09)
- df4bc068a - fix(vscode): refine auto-merge split button (marius-kilocode, 2026-09-09)
- d3dfa365c - fix(vscode): stabilize streaming reasoning layout (marius-kilocode, 2026-09-09)
- 19f83f01b - fix(vscode): simplify plan opener cleanup (marius-kilocode, 2026-09-09)
- 02dc04de9 - Merge pull request #13973 from Kilo-Org/resize-create-worktree-button (Marius, 2026-09-09)
- b34fdd832 - Merge pull request #13971 from Kilo-Org/revert-speech-to-text-loading-cursor (Marius, 2026-09-09)
- e67ea3c95 - fix(vscode): resize Agent Manager worktree button (marius-kilocode, 2026-09-09)
- 6d21b591b - fix(vscode): restore speech button cursor (marius-kilocode, 2026-09-09)
- fa986a115 - fix(vscode): preserve plan opens across worktree switches (marius-kilocode, 2026-09-09)
- 5031ba848 - Merge pull request #13953 from Kilo-Org/add-approval-conflict-actions (Marius, 2026-09-09)
- 7205d6475 - Merge remote-tracking branch 'origin/add-approval-conflict-actions' into add-approval-conflict-actions (marius-kilocode, 2026-09-09)
- c8e595cf5 - fix(vscode): keep PR poller within complexity limit (marius-kilocode, 2026-09-09)
- f8557b63f - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-09)
- eb77364a0 - fix(vscode): retain approval locale keys after merge (marius-kilocode, 2026-09-09)
- 96d9b5aaa - Merge pull request #13929 from Kilo-Org/claude-migration (Andrea Giammarchi, 2026-09-09)
- ff9083e89 - Merge origin/main into add-approval-conflict-actions (marius-kilocode, 2026-09-09)
- 8b75edc98 - Merge pull request #13967 from Kilo-Org/animate-subagent-tool-call (Marius, 2026-09-09)
- fd4475e70 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-09)
- e9dc151fd - docs(agent-manager): clarify pending route optimization (marius-kilocode, 2026-09-09)
- 06bd113a0 - Merge origin/main into animate-subagent-tool-call (marius-kilocode, 2026-09-09)
- 39ec36b47 - Merge pull request #13965 from Kilo-Org/make-thinking-indicator-clickable-scroll-down (Marius, 2026-09-09)
- 93d90c626 - fix(cli): clarify migration skip guidance (webreflection, 2026-09-09)
- 076ccbf49 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-09)
- 68c1c4e9b - fix(cli): retain Claude migration safety guards (webreflection, 2026-09-09)
- 92cffbba5 - chore(vscode): sync main into working indicator PR (marius-kilocode, 2026-09-09)
- 22b1dc3b6 - Merge pull request #13966 from Kilo-Org/open-pr-sidebar-on-agent-manager-click (Marius, 2026-09-09)
- 05684c1b7 - fix(vscode): settle PR status after remote mutations (marius-kilocode, 2026-09-09)
- 2b7519d5c - Merge pull request #13964 from Kilo-Org/subagent-avatar-click (Marius, 2026-09-09)
- f57b6925f - test(vscode): centralize scroll button locator (marius-kilocode, 2026-09-09)
- 0aad88ec3 - feat(agent-manager): animate pending board routes (marius-kilocode, 2026-09-09)
- fc080131c - Merge pull request #13950 from Kilo-Org/refine-pr-view-ui (Marius, 2026-09-09)
- 1ebcf5628 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-09)
- 8992b3c25 - fix(agent-manager): open PRs in sidebar (marius-kilocode, 2026-09-09)
- 7df22bbe7 - Merge branch 'main' into claude-migration (Andrea Giammarchi, 2026-09-09)
- 4f430d216 - fix(vscode): translate PR merge locale strings (marius-kilocode, 2026-09-09)
- 90c9c4037 - fix(vscode): open task avatars (marius-kilocode, 2026-09-09)
- 0de6adba6 - test(vscode): scope all auto-scroll selectors (marius-kilocode, 2026-09-09)
- 6c0f53477 - fix(cli): improve Claude migration feedback (webreflection, 2026-09-09)
- 80dd80799 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-09)
- d4c17d2fe - test(vscode): scope auto-scroll button selector (marius-kilocode, 2026-09-09)
- 1b7a2ac75 - fix(vscode): show disable auto-merge progress (marius-kilocode, 2026-09-09)
- 09752c700 - Merge commit '5aa7d260a690f04ba065629a1f672396673139e7' into refine-pr-view-ui (marius-kilocode, 2026-09-09)
- a126080dd - fix(vscode): soften board avatar hover glow (marius-kilocode, 2026-09-09)
- 89f646ecf - feat(vscode): show merge action progress (marius-kilocode, 2026-09-09)
- 5aa7d260a - Merge pull request #13952 from Kilo-Org/add-reviewer-avatar-to-pr-sidebar (Marius, 2026-09-09)
- 6bbe6ac37 - feat(vscode): make working indicator scroll chat (marius-kilocode, 2026-09-09)
- 481036f6d - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-09)
- 91821ac24 - fix(vscode): polish board avatar navigation (marius-kilocode, 2026-09-09)
- cbb0d5376 - merge: sync latest main into reviewer sidebar (marius-kilocode, 2026-09-09)
- 7099c0949 - Merge pull request #13958 from Kilo-Org/improve-pr-sidebar-conversation-context (Marius, 2026-09-09)
- b057881e4 - fix(vscode): explain blocked PR merge state like GitHub (marius-kilocode, 2026-09-09)
- 9bbd430cf - fix(vscode): resolve board avatar tab scope (marius-kilocode, 2026-09-09)
- 4e887cb47 - Merge pull request #13962 from Kilo-Org/fix-reasoning-collapse-flicker (Marius, 2026-09-09)
- bb805b2a2 - Merge remote-tracking branch 'origin/main' into refine-pr-view-ui (marius-kilocode, 2026-09-09)
- fb55540d8 - fix(vscode): use white chevron in primary split button (marius-kilocode, 2026-09-09)
- 200dd8658 - merge: sync main into reviewer sidebar (marius-kilocode, 2026-09-09)
- 13259a9a3 - fix(vscode): format PR timeline story (marius-kilocode, 2026-09-09)
- 629188300 - Merge pull request #13957 from Kilo-Org/add-missing-tool-to-subagent-avatar-logic (Marius, 2026-09-09)
- 46507cfc9 - Merge pull request #13960 from Kilo-Org/profile-edit-performance (Marius, 2026-09-09)
- e34811818 - fix(vscode): keep board header avatars decorative (marius-kilocode, 2026-09-09)
- 81f183afa - Merge pull request #13959 from Kilo-Org/fix-gommcents-ui-cutoff (Marius, 2026-09-09)
- 5c2df1064 - fix(vscode): polish PR merge split button (marius-kilocode, 2026-09-09)
- 93b9fad98 - fix(vscode): resolve CI type and arch checks (marius-kilocode, 2026-09-09)
- 890de4b39 - fix(vscode): harden PR timeline review state (marius-kilocode, 2026-09-09)
- 79c9b3e82 - Merge remote-tracking branch 'origin/main' into improve-pr-sidebar-conversation-context (marius-kilocode, 2026-09-09)
- fbc1a79e9 - fix(vscode): open subagents from board avatars (marius-kilocode, 2026-09-09)
- 3a7f86d8e - Merge remote-tracking branch 'origin/add-missing-tool-to-subagent-avatar-logic' into add-missing-tool-to-subagent-avatar-logic (marius-kilocode, 2026-09-09)
- e3e4a7d23 - Merge remote-tracking branch 'origin/improve-pr-sidebar-conversation-context' into improve-pr-sidebar-conversation-context (marius-kilocode, 2026-09-09)
- 8051158bc - fix(cli): preserve diagnostic freshness (marius-kilocode, 2026-09-09)
- 1a3e05217 - fix(vscode): keep agent manager provider within size cap (marius-kilocode, 2026-09-09)
- 8e2abd431 - fix(vscode): share PR status types (marius-kilocode, 2026-09-09)
- c94a572c5 - fix(agent-manager): keep provider within line cap (marius-kilocode, 2026-09-09)
- b9433fcf3 - fix(vscode): smooth reasoning block transitions (marius-kilocode, 2026-09-09)
- 2d8c4f051 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-09)
- 8c4d37cac - fix(vscode): preserve empty broadcast fallback (marius-kilocode, 2026-09-09)
- 24c31557e - fix(vscode): address PR merge review feedback (marius-kilocode, 2026-09-09)
- 492a2ffa2 - feat(vscode): sync Agent Manager PR fixes with remote (#13951) (Marius, 2026-09-09)
- a7c111866 - fix(vscode): show avatars for broadcast recipients (marius-kilocode, 2026-09-09)
- 29a16ffd0 - docs: add PR comment preview changeset (marius-kilocode, 2026-09-09)
- 445660b42 - fix(cli): keep diagnostics edits responsive (marius-kilocode, 2026-09-09)
- 53537bf44 - fix(vscode): hide expanded PR comment previews (marius-kilocode, 2026-09-09)
- fec32f555 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-09)
- 718c2b36a - Merge pull request #13948 from Kilo-Org/implement-issue-13915 (Marius, 2026-09-09)
- 4c2a6eb69 - feat(vscode): show PR conversation timeline (marius-kilocode, 2026-09-09)
- 6f558cf84 - fix(vscode): show board participants in message headers (marius-kilocode, 2026-09-09)
- d12a1b460 - fix(cli): allow MCP migration into existing config (webreflection, 2026-09-09)
- 3c04a86c5 - feat(vscode): add PR merge readiness controls (marius-kilocode, 2026-09-09)
- faace61a8 - fix(agent-manager): refresh reviewer avatars reliably (marius-kilocode, 2026-09-09)
- 4c0b19b72 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-09)
- 31dded674 - Merge branch 'main' into claude-migration (Andrea Giammarchi, 2026-09-09)
- aeb0d0cdd - fix(vscode): respect reduced motion in PR badge (marius-kilocode, 2026-09-09)
- 84fbc544a - Merge CI visual regression baselines (marius-kilocode, 2026-09-09)
- 6b1b382fd - style(vscode): format permission toggle test (marius-kilocode, 2026-09-09)
- 19d6dbca6 - feat(agent-manager): show reviewer avatars in PR sidebar (marius-kilocode, 2026-09-09)
- a65894264 - fix(remote): derive session repository metadata from the session directory (#13949) (Igor Šćekić, 2026-09-09)
- f7a2127d6 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-09)
- a0d0b7041 - fix(vscode): retain main multi-project settings (webreflection, 2026-09-09)
- 02a01b812 - test(vscode): update permission toggle selectors (marius-kilocode, 2026-09-09)
- 5727ed09e - fix(vscode): preserve latest experimental settings (webreflection, 2026-09-09)
- c0bb3f44c - fix(opencode): reject dynamic Claude MCP values (webreflection, 2026-09-09)
- 9dae82992 - feat(vscode): experimental CLAUDE code migration (webreflection, 2026-09-09)
- f797b27ac - fix(vscode): align PR panel layout and header icon (marius-kilocode, 2026-09-09)
- b39606d1f - fix(vscode): preserve icon button aria state (marius-kilocode, 2026-09-09)
- 63cc39a8e - Merge remote-tracking branch 'origin/main' into implement-issue-13915 (marius-kilocode, 2026-09-09)
- a5667d23f - fix(vscode): unify icon button controls (marius-kilocode, 2026-09-09)
- 4e4d87d12 - Merge pull request #13945 from Kilo-Org/fix-snapshot-initialization-hang (Marius, 2026-09-09)
- 0739ea399 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-09-09)
- 000e0ca89 - Merge remote-tracking branch 'origin/main' into fix-snapshot-initialization-hang (marius-kilocode, 2026-09-09)
- 298f9a273 - Merge pull request #13947 from Kilo-Org/fix-flaky-jetbrains-tests (Marius, 2026-09-09)
- 8f0e05463 - Merge pull request #13927 from Kilo-Org/dust-dianella (Marius, 2026-09-09)
- e3620878a - Merge pull request #13942 from Kilo-Org/fix-goal-send-bad-request (Marius, 2026-09-09)
- 03fa3084c - Merge pull request #13926 from Kilo-Org/investigate-empty-project-bar-agent-manager (Marius, 2026-09-09)
- a4776aed0 - test(jetbrains): fix flaky worktree fork dedupe test (marius-kilocode, 2026-09-09)
- 2342b1f57 - Merge remote-tracking branch 'origin/main' into investigate-empty-project-bar-agent-manager (marius-kilocode, 2026-09-09)
- 861fc33f0 - Merge pull request #13925 from Kilo-Org/optimize-fix-production-build (Marius, 2026-09-09)
- f82911314 - Merge remote-tracking branch 'origin/main' into dust-dianella (marius-kilocode, 2026-09-09)
- a0da7221e - Merge pull request #13946 from Kilo-Org/remove-token-cost-wording (Marius, 2026-09-09)
- a386f96a2 - Merge pull request #13940 from Kilo-Org/add-theme-colored-agent-avatars (Marius, 2026-09-09)
- c6416e20a - Merge pull request #13944 from Kilo-Org/fix-cli-link-clickability (Marius, 2026-09-09)
- aa57a4960 - Merge pull request #13941 from Kilo-Org/document-agent-manager-orchestration (Marius, 2026-09-09)
- 708196890 - Merge pull request #13943 from Kilo-Org/revert-feature-flag-implementation (Marius, 2026-09-09)
- 241193c5c - fix(goal): preserve active goal cancellation (marius-kilocode, 2026-09-09)
- 14821478d - Merge remote-tracking branch 'origin/add-theme-colored-agent-avatars' into add-theme-colored-agent-avatars (marius-kilocode, 2026-09-09)
- 6d2c2b826 - test(cli): classify snapshot runtime integration (marius-kilocode, 2026-09-09)
- 6e38e1d92 - fix(vscode): update subagent activity fixture (marius-kilocode, 2026-09-09)
- 501d08daa - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-09)
- 3ceeeb1c6 - fix(goal): remove credit wording (marius-kilocode, 2026-09-09)
- 3fd7be426 - fix(vscode): update avatar CI expectations (marius-kilocode, 2026-09-09)
- 408338f5c - test(goal): avoid fiber exit assumption (marius-kilocode, 2026-09-09)
- 9db971865 - fix(cli): prevent snapshot progress session hangs (marius-kilocode, 2026-09-09)
- 1423442f2 - feat(cli): make terminal links clickable (marius-kilocode, 2026-09-09)
- ada216a90 - revert(agent-manager): enable multiple projects by default (marius-kilocode, 2026-09-09)
- decc0e536 - fix(goal): allow goals to replace running responses (marius-kilocode, 2026-09-09)
- 021c977fd - docs(agent-manager): document orchestration workflows (marius-kilocode, 2026-09-09)
- 4bb09b125 - feat(vscode): round subagent avatars with sibling colors and live shimmer (marius-kilocode, 2026-09-08)
- b8fe0095d - tmp (marius-kilocode, 2026-09-08)
- 08f696e4b - Merge pull request #13771 from sylwester-liljegren/feat/vscode-notifications (Marius, 2026-09-08)
- a365ba695 - Merge pull request #13930 from Kilo-Org/jetbrains/release/v7.1.6 (Kirill Kalishev, 2026-09-08)
- 8bbbcf0e3 - docs(jetbrains): edit changelog for v7.1.6 (Kirill Kalishev, 2026-09-08)
- 9224095da - release(jetbrains): v7.1.6 (kilo-maintainer[bot], 2026-09-08)
- 34875ae07 - Merge pull request #13928 from Kilo-Org/fix-terminal-tab-close-resize (Marius, 2026-09-08)
- 4ff8f1930 - Merge remote-tracking branch 'origin/feat/vscode-notifications' into feat/vscode-notifications (Sylwester Liljegren, 2026-09-08)
- c2e4e728c - fix(vscode): fix CI failures from the notification changes (Sylwester Liljegren, 2026-09-08)
- ed3cdc6a1 - feat(cli): add caffeinate command (marius-kilocode, 2026-09-08)
- 3e057279b - fix(vscode): release terminal tab widths after close (marius-kilocode, 2026-09-08)
- 702ed79c7 - Merge branch 'main' into feat/vscode-notifications (Marius, 2026-09-08)
- 0af5b307e - fix(kilo-console): isolate shared dialog styles (marius-kilocode, 2026-09-08)
- c60221a6b - fix(agent-manager): preserve restricted overlay behavior (marius-kilocode, 2026-09-08)
- 46034d417 - fix(kilo-console): preserve route providers during lazy loads (marius-kilocode, 2026-09-08)
- 31a4eab15 - Merge remote-tracking branch 'origin/main' into investigate-empty-project-bar-agent-manager (marius-kilocode, 2026-09-08)
- b5a7d6243 - Merge pull request #13924 from Kilo-Org/fix-pr-sidebar-margin-display (Marius, 2026-09-08)
- 9911ae0d1 - Merge pull request #13923 from Kilo-Org/jetbrains/release/v7.1.6-rc.3 (Kirill Kalishev, 2026-09-08)
- 818d31d0a - fix(agent-manager): explain restricted workspaces (marius-kilocode, 2026-09-08)
- a4be3ccca - docs(jetbrains): edit changelog for v7.1.6-rc.3 (Kirill Kalishev, 2026-09-08)
- cdbb92655 - fix(kilo-console): reduce startup bundle size (marius-kilocode, 2026-09-08)
- 6e136a8dc - docs(jetbrains): edit changelog for v7.1.6-rc.3 (Kirill Kalishev, 2026-09-08)
- eea393684 - fix(vscode): add PR sidebar review margins (marius-kilocode, 2026-09-08)
- 3c4148d83 - release(jetbrains): v7.1.6-rc.3 (kilo-maintainer[bot], 2026-09-08)
- b856113c5 - Merge upstream/main into feat/vscode-notifications (Sylwester Liljegren, 2026-09-08)
- 1dde56d61 - Merge pull request #13921 from Kilo-Org/shocking-farmer (Marius, 2026-09-08)
- 74a9e2aa0 - Merge pull request #13886 from Kilo-Org/fix-jetbrains-config-warning-scope (Kirill Kalishev, 2026-09-08)
- cc3f87c7d - Merge pull request #13887 from Kilo-Org/tidy-tundra (Kirill Kalishev, 2026-09-08)
- 13caf02bb - Merge pull request #13888 from Kilo-Org/clever-tundra (Kirill Kalishev, 2026-09-08)
- 36d6d7dab - fix(release): include CLI notes in GitHub releases (marius-kilocode, 2026-09-08)
- fa4a8401f - feat(agent-manager): enable multiple projects by default (#13918) (Marius, 2026-09-08)
- 19604b890 - Merge pull request #13679 from Kilo-Org/add-goal-session-reruns (Marius, 2026-09-08)
- 4fc96d68e - fix(goal): preserve attachment admission interrupts (marius-kilocode, 2026-09-08)
- c5df354dd - Merge pull request #13920 from Kilo-Org/fix/agent-manager-worktree-failure-notification (Marius, 2026-09-08)
- 70ba5985a - fix(agent-manager): allow committed bases from orphan branches (marius-kilocode, 2026-09-08)
- 05c763f12 - fix(agent-manager): explain empty repository worktree failures (marius-kilocode, 2026-09-08)
- 5bfe44c80 - fix(goal): resolve main conflicts and stabilize layout test (marius-kilocode, 2026-09-08)
- 6fc3a9623 - Merge pull request #13793 from Kilo-Org/remove-unwanted-feature (Marius, 2026-09-08)
- e97d11dd4 - fix(goal): preserve running goals and pending drafts (marius-kilocode, 2026-09-08)
- 8a2403b9f - chore: merge main into goal branch (marius-kilocode, 2026-09-08)
- e9be65bc6 - Merge branch 'main' into remove-unwanted-feature (Marius, 2026-09-08)
- 3451814b8 - Merge pull request #13917 from Kilo-Org/fix-release-test-failures (Marius, 2026-09-08)
- 77b657c6a - Merge pull request #13782 from Kilo-Org/add-session-board-view-and-reset (Marius, 2026-09-08)
- 8bce7a75a - Merge pull request #13916 from Kilo-Org/reorganize-agent-manager-toolbar (Marius, 2026-09-08)
- 99630f25d - fix(ci): preserve container publishing and retry Bun installation (marius-kilocode, 2026-09-08)
- 1ff33e8a4 - fix(ci): stop unused container workflow from blocking releases (marius-kilocode, 2026-09-08)
- cb744c74f - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-08)
- 1ec62684f - feat(agent-manager): regroup toolbar actions (marius-kilocode, 2026-09-08)
- 9fe193cdb - chore: merge latest main into goal branch (marius-kilocode, 2026-09-08)
- 6199c0126 - feat(goal): add persistent session goals (marius-kilocode, 2026-09-08)
- e89dd9e86 - Merge origin/main into remove-unwanted-feature (marius-kilocode, 2026-09-08)
- f83275f4d - fix(vscode): clean up board reader observer (marius-kilocode, 2026-09-08)
- 65b9c3590 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-08)
- ffbffa591 - fix: harden board paths and CI coverage (marius-kilocode, 2026-09-08)
- 4d2d8001e - feat(vscode): add shared agent board reader and reset (marius-kilocode, 2026-09-08)
- 981dde6e8 - Merge origin/main into remove-unwanted-feature (marius-kilocode, 2026-09-08)
- d5a919f11 - Merge origin/main into remove-unwanted-feature (marius-kilocode, 2026-09-08)
- b43ac8833 - Merge branch 'main' into fix-jetbrains-config-warning-scope (Kirill Kalishev, 2026-09-07)
- 2029d4ce9 - fix(jetbrains): address worktree deletion review findings (kirillk, 2026-09-07)
- 6aa8d391a - fix(jetbrains): bound the workspace config-warnings fetch (kirillk, 2026-09-07)
- f9dbc697a - Merge upstream/main into feat/vscode-notifications (Sylwester Liljegren, 2026-09-07)
- 8d7ef91e7 - fix(jetbrains): stop auto-expanding worktree session list on new/forked sessions (kirillk, 2026-09-07)
- 05c1bb0a0 - fix(jetbrains): make Agent Manager worktree deletion non-blocking and fault tolerant (kirillk, 2026-09-07)
- 102761b01 - fix(jetbrains): scope config warnings to the workspace directory (kirillk, 2026-09-07)
- cf59107f1 - chore: merge main into goal session branch (marius-kilocode, 2026-09-07)
- 4cb80539a - fix(vscode): address review feedback on OS notifications (Sylwester Liljegren, 2026-09-06)
- dd72b1dd7 - Merge upstream/main into feat/vscode-notifications (Sylwester Liljegren, 2026-09-06)
- 0c4cb4620 - feat(vscode): deliver native OS notifications on all platforms (Sylwester Liljegren, 2026-09-06)
- b5cf42615 - fix(cli): remove nonfunctional interactive terminal tool (marius-kilocode, 2026-09-04)
- 43e6a6e89 - refactor(vscode): dedupe agent manager memory commands (Sylwester Liljegren, 2026-09-04)
- 5970da2a6 - Merge commit 'dc8caf95a6efae1bf028e968b3a0e063b12e3493' into add-goal-session-reruns (marius-kilocode, 2026-09-04)
- db13759be - chore: annotate goal admission error handling (marius-kilocode, 2026-09-04)
- 2298ea087 - chore: merge main and fix goal CI checks (marius-kilocode, 2026-09-04)
- 4051293c2 - fix(vscode): gate OS notifications by platform and recheck channel (Sylwester Liljegren, 2026-09-04)
- 716c378df - fix(goal): harden continuation and session controls (marius-kilocode, 2026-09-04)
- 1bf83fa8e - feat(vscode): translate notification settings strings (Sylwester Liljegren, 2026-09-04)
- 3c28e7a9a - feat(vscode): add task attention notifications (Sylwester Liljegren, 2026-09-03)
- a6f67ce22 - chore: merge main into goal branch (marius-kilocode, 2026-09-02)
- c42a0b154 - refactor: simplify goal controls above the prompt (marius-kilocode, 2026-09-01)
- e27ff0a6d - feat: add continuous session goals (marius-kilocode, 2026-09-01)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/board.ts` (+23, -12)
- `packages/opencode/src/kilocode/tool/interactive-terminal.ts` (+0, -94)
- `packages/opencode/src/kilocode/tool/interactive-terminal.txt` (+0, -25)
- `packages/opencode/src/kilocode/tool/registry.ts` (+13, -14)
- `packages/opencode/src/kilocode/tool/task.ts` (+0, -1)
- `packages/opencode/src/tool/registry.ts` (+1, -1)
- `packages/opencode/src/tool/shell.ts` (+1, -1)
- `packages/opencode/src/tool/task.ts` (+0, -1)
- `packages/opencode/test/kilocode/tool/notify-user.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/tool/send-file.test.ts` (+3, -3)
- `packages/opencode/test/tool/task.test.ts` (+0, -1)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+1, -5)
- `packages/opencode/src/kilocode/agent/index.ts` (+0, -2)
- `packages/opencode/test/agent/agent.test.ts` (+0, -3)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)
- `packages/core/schema.json` (+12, -2)
- `packages/core/script/kilocode/migration.ts` (+1, -1)
- `packages/core/src/control-plane/move-session.ts` (+5, -2)
- `packages/core/src/database/migration.gen.ts` (+1, -0)
- `packages/core/src/database/migration/20260903104806_kilocode_board_reset.ts` (+13, -0)
- `packages/core/src/database/schema.gen.ts` (+1, -0)
- `packages/core/src/flag/flag.ts` (+2, -0)
- `packages/core/src/kilocode/board/sql.ts` (+1, -0)
- `packages/core/src/kilocode/caffeination.ts` (+217, -0)
- `packages/core/src/pty/driver.ts` (+1, -1)
- `packages/core/test/kilocode/board/migration.test.ts` (+39, -0)
- `packages/core/test/move-session.test.ts` (+59, -0)
- `packages/core/test/npm.test.ts` (+4, -2)

#### Other Changes
- `.changeset/claude-migration-label.md` (+5, -0)
- `.changeset/filter-auto-models.md` (+5, -0)
- `.changeset/inline-pr-replies.md` (+0, -7)
- `.changeset/neutral-deleted-line-numbers.md` (+0, -6)
- `.changeset/permission-prompt-race.md` (+5, -0)
- `.changeset/quick-worktrees-relocate.md` (+5, -0)
- `artifacts/glm52-rise-video/package.json` (+1, -1)
- `bun.lock` (+47, -50)
- `nix/hashes.json` (+4, -4)
- `package.json` (+4, -4)
- `packages/client/package.json` (+1, -1)
- `packages/client/test/contract-identity.test.ts` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/containers/bun-node/Dockerfile` (+13, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/httpapi-codegen/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -2)
- `packages/kilo-console/public/logo.lottie` (+-, --)
- `packages/kilo-console/src/App.tsx` (+5, -2)
- `packages/kilo-console/src/components/LoadingLogo.tsx` (+2, -31)
- `packages/kilo-console/src/index.tsx` (+8, -4)
- `packages/kilo-console/src/layouts/ConfigLayout.tsx` (+4, -0)
- `packages/kilo-console/src/routes/config/AgentsRoute.tsx` (+2, -0)
- `packages/kilo-console/src/routes/config/CliNotificationsRoute.tsx` (+1, -0)
- `packages/kilo-console/src/routes/config/CliUiRoute.tsx` (+1, -0)
- `packages/kilo-console/src/routes/config/ConsoleUiRoute.tsx` (+1, -0)
- `packages/kilo-console/src/routes/config/FormattersRoute.tsx` (+1, -0)
- `packages/kilo-console/src/routes/config/IndexingRoute.tsx` (+2, -0)
- `packages/kilo-console/src/routes/config/KeybindsRoute.tsx` (+1, -0)
- `packages/kilo-console/src/routes/config/McpRoute.tsx` (+1, -0)
- `packages/kilo-console/src/routes/config/ModelsRoute.tsx` (+2, -0)
- `packages/kilo-console/src/routes/config/OverviewRoute.tsx` (+1, -0)
- `packages/kilo-console/src/routes/config/PermissionsRoute.tsx` (+1, -0)
- `packages/kilo-console/src/routes/config/ServersRoute.tsx` (+1, -0)
- `packages/kilo-console/src/routes/config/SourcesRoute.tsx` (+1, -0)
- `packages/kilo-console/src/routes/config/ToolsRoute.tsx` (+1, -0)
- `packages/kilo-console/src/routes/config/sections.tsx` (+23, -16)
- `packages/kilo-console/src/routes/profile/LoginRoute.tsx` (+1, -0)
- `packages/kilo-console/src/routes/profile/ProfileRoute.tsx` (+7, -1)
- `packages/kilo-console/src/routes/projects/ProjectConsoleRoute.tsx` (+49, -29)
- `packages/kilo-console/src/routes/projects/ProjectsRoute.tsx` (+1, -0)
- `packages/kilo-console/src/styles.css` (+0, -17)
- `packages/kilo-console/src/styles/dialogs.css` (+85, -0)
- `packages/kilo-console/src/styles/empty.css` (+1, -0)
- `packages/kilo-console/src/styles/project-console.css` (+8, -0)
- `packages/kilo-console/src/styles/providers.css` (+0, -86)
- `packages/kilo-console/vite.config.ts` (+4, -0)
- `packages/kilo-docs/lib/nav/code-with-ai.ts` (+4, -0)
- `packages/kilo-docs/lib/nav/getting-started.ts` (+2, -0)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/automate/agent-manager-workflows.md` (+16, -2)
- `packages/kilo-docs/pages/automate/agent-manager.md` (+197, -26)
- `packages/kilo-docs/pages/automate/extending/shell-integration.md` (+4, -0)
- `packages/kilo-docs/pages/automate/tools/index.md` (+49, -1)
- `packages/kilo-docs/pages/code-with-ai/agents/goals.md` (+106, -0)
- `packages/kilo-docs/pages/code-with-ai/agents/using-agents.md` (+2, -0)
- `packages/kilo-docs/pages/code-with-ai/index.md` (+1, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli.md` (+13, -1)
- `packages/kilo-docs/pages/customize/custom-subagents.md` (+5, -3)
- `packages/kilo-docs/pages/getting-started/settings/index.md` (+2, -0)
- `packages/kilo-docs/pages/getting-started/settings/keep-awake.md` (+51, -0)
- `packages/kilo-docs/pages/getting-started/settings/notifications.md` (+76, -0)
- `packages/kilo-docs/pages/getting-started/settings/sandboxing.md` (+1, -1)
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
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/diff-panel-scroll-up-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/diff-panel-with-diffs-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/diff-panel-with-pr-threads-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/full-screen-diff-with-pr-threads-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/inline-diff-bulk-action-collapse-all-button-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/inline-diff-bulk-action-expand-all-button-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/multi-project-sidebar-200-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/multi-project-sidebar-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/pr-panel-comments-200-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/pr-panel-comments-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/pr-panel-conversation-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/pr-panel-overview-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/pr-panel-reviewers-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/pr-panel-summary-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/readable-chat-1280-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/readable-chat-420-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/sidebar-search-open-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/tab-bar-full-context-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/tab-bar-multiple-tabs-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/tab-bar-single-tab-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/tab-bar-with-review-tab-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/board-closed-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/board-empty-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/board-open-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-readable-1280-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-readable-420-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/chat-view-with-messages-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/message-list-layout-correction-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-many-prompts-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-sidebar-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-wide-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/sidebar-top-bar-default-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-background-agents-1280-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-background-agents-200-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-background-agents-420-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-single-background-agent-420-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-with-todos-all-done-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-header-with-todos-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/agent-message-pending-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/agent-messages-200-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/agent-messages-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/bash-with-permission-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/diff-summary-collapsed-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/glob-with-permission-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-apply-patch-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-edit-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-external-dir-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-heredoc-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-skill-shell-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-subagent-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-todo-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-websearch-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/permission-dock-write-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/question-above-chatbox-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/composite-webview/streaming-reasoning-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/history-sessionlist/worktree-sources-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/iconbutton/states-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/labs-tool-call-lab/search-previews-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/agent-behaviour-agents-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/agent-behaviour-edit-custom-mode-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/agent-behaviour-skills-overflow-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/mcp-edit-view-local-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/mcp-edit-view-local-with-env-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/mcp-edit-view-remote-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/mode-edit-export-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/mode-edit-permissions-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/source-links.md` (+1, -0)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/CHANGELOG.md` (+35, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloAppState.kt` (+0, -1)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendAppService.kt` (+5, -60)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloBackendCliManager.kt` (+19, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/diff/GitComparison.kt` (+19, -3)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloAppRpcApiImpl.kt` (+0, -9)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorkspaceDtoMapper.kt` (+8, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorkspaceRpcApiImpl.kt` (+1, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorktreeRpcApiImpl.kt` (+396, -154)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/PrResolver.kt` (+8, -1)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/workspace/KiloBackendWorkspace.kt` (+48, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/workspace/KiloWorkspaceState.kt` (+2, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/worktree/WorktreeTrash.kt` (+250, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendAppServiceTest.kt` (+4, -107)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/KiloBackendCliManagerEnvTest.kt` (+47, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloWorkspaceDtoMapperTest.kt` (+22, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloWorktreeRpcApiImplTest.kt` (+95, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloWorktreeRpcApiImplTrashTest.kt` (+193, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/workspace/KiloBackendWorkspaceTest.kt` (+83, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/worktree/WorktreeTrashTest.kt` (+192, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/GhStatusCoordinator.kt` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeController.kt` (+9, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorManager.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorPanel.kt` (+5, -20)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionListController.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeStatusService.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionController.kt` (+6, -6)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorManagerTest.kt` (+4, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorPanelTest.kt` (+24, -15)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/AppWatchingTest.kt` (+5, -5)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/ConnectionDelayTest.kt` (+2, -4)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/SessionControllerTestBase.kt` (+3, -0)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/KiloAppStateDto.kt` (+0, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/KiloWorkspaceStateDto.kt` (+1, -0)
- `packages/kilo-memory/package.json` (+1, -1)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+4, -1)
- `packages/kilo-ui/src/components/agent-avatar-identity.test.ts` (+61, -0)
- `packages/kilo-ui/src/components/agent-avatar-identity.ts` (+77, -0)
- `packages/kilo-ui/src/components/agent-avatar.css` (+104, -0)
- `packages/kilo-ui/src/components/agent-avatar.tsx` (+61, -0)
- `packages/kilo-ui/src/components/basic-tool.css` (+22, -106)
- `packages/kilo-ui/src/components/board-message.css` (+168, -0)
- `packages/kilo-ui/src/components/board-message.tsx` (+181, -0)
- `packages/kilo-ui/src/components/board-route.test.ts` (+55, -0)
- `packages/kilo-ui/src/components/board-route.ts` (+33, -0)
- `packages/kilo-ui/src/components/icon-button.css` (+113, -11)
- `packages/kilo-ui/src/components/icon-button.tsx` (+44, -3)
- `packages/kilo-ui/src/components/icon.css` (+17, -0)
- `packages/kilo-ui/src/components/icon.tsx` (+49, -8)
- `packages/kilo-ui/src/components/message-part.css` (+31, -96)
- `packages/kilo-ui/src/components/message-part.tsx` (+204, -151)
- `packages/kilo-ui/src/components/prompt-input.css` (+0, -5)
- `packages/kilo-ui/src/components/reasoning-heading.test.ts` (+33, -2)
- `packages/kilo-ui/src/components/reasoning-heading.ts` (+30, -1)
- `packages/kilo-ui/src/components/tool-utils.ts` (+69, -0)
- `packages/kilo-ui/src/context/board-navigation.tsx` (+13, -0)
- `packages/kilo-ui/src/stories/dropdown-menu.stories.tsx` (+4, -4)
- `packages/kilo-ui/src/stories/icon-button.stories.tsx` (+54, -12)
- `packages/kilo-ui/src/stories/message-part.stories.tsx` (+83, -0)
- `packages/kilo-ui/src/stories/tooltip.stories.tsx` (+4, -4)
- `packages/kilo-ui/src/styles/index.css` (+3, -0)
- `packages/kilo-ui/src/styles/tailwind/index.css` (+1, -0)
- `packages/kilo-vscode/CHANGELOG.md` (+97, -0)
- `packages/kilo-vscode/docs/features/task-completion-notification.md` (+0, -12)
- `packages/kilo-vscode/docs/opencode-migration-plan.md` (+0, -1)
- `packages/kilo-vscode/package.json` (+22, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+102, -30)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+7, -9)
- `packages/kilo-vscode/src/agent-manager/GitOps.ts` (+67, -0)
- `packages/kilo-vscode/src/agent-manager/PRStatusPoller.ts` (+209, -74)
- `packages/kilo-vscode/src/agent-manager/WorktreeManager.ts` (+16, -7)
- `packages/kilo-vscode/src/agent-manager/base-update.ts` (+16, -4)
- `packages/kilo-vscode/src/agent-manager/home-workspace.ts` (+12, -0)
- `packages/kilo-vscode/src/agent-manager/host.ts` (+4, -0)
- `packages/kilo-vscode/src/agent-manager/pr-status-bridge.ts` (+24, -5)
- `packages/kilo-vscode/src/agent-manager/pr/am-pr-types.ts` (+42, -1)
- `packages/kilo-vscode/src/agent-manager/pr/am-pr-utils.ts` (+90, -44)
- `packages/kilo-vscode/src/agent-manager/pr/merge-actions.ts` (+209, -0)
- `packages/kilo-vscode/src/agent-manager/pr/mutate-comment.ts` (+6, -1)
- `packages/kilo-vscode/src/agent-manager/pr/review-context.ts` (+8, -4)
- `packages/kilo-vscode/src/agent-manager/pr/timeline.ts` (+168, -0)
- `packages/kilo-vscode/src/agent-manager/project/pollers.ts` (+14, -0)
- `packages/kilo-vscode/src/agent-manager/provider-multi-version.ts` (+11, -3)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+19, -32)
- `packages/kilo-vscode/src/agent-manager/vscode-host.ts` (+14, -0)
- `packages/kilo-vscode/src/agent-manager/worktree-create.ts` (+19, -3)
- `packages/kilo-vscode/src/extension.ts` (+35, -1)
- `packages/kilo-vscode/src/kilo-provider-utils.ts` (+24, -1)
- `packages/kilo-vscode/src/kilo-provider/command-completion.ts` (+5, -1)
- `packages/kilo-vscode/src/kilo-provider/config-snapshot.ts` (+1, -0)
- `packages/kilo-vscode/src/kilo-provider/early-message.ts` (+7, -0)
- `packages/kilo-vscode/src/kilo-provider/handlers/cloud-session.ts` (+9, -1)
- `packages/kilo-vscode/src/kilo-provider/handlers/permission-handler.ts` (+95, -45)
- `packages/kilo-vscode/src/kilo-provider/push-fixes-settings.ts` (+23, -0)
- `packages/kilo-vscode/src/kilo-provider/session-board.ts` (+99, -0)
- `packages/kilo-vscode/src/services/attention/index.ts` (+1, -0)
- `packages/kilo-vscode/src/services/attention/notice.ts` (+15, -0)
- `packages/kilo-vscode/src/services/attention/os.ts` (+169, -0)
- `packages/kilo-vscode/src/services/attention/service.ts` (+132, -15)
- `packages/kilo-vscode/src/services/caffeination/inhibitor.ts` (+2, -212)
- `packages/kilo-vscode/src/services/cli-backend/connection-service.test.ts` (+23, -0)
- `packages/kilo-vscode/src/services/cli-backend/connection-service.ts` (+125, -2)
- `packages/kilo-vscode/src/services/cli-backend/server-manager.ts` (+9, -0)
- `packages/kilo-vscode/src/services/i18n/ar.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/attention/ar.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/br.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/bs.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/da.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/de.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/en.ts` (+16, -0)
- `packages/kilo-vscode/src/services/i18n/attention/es.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/fa.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/fr.ts` (+14, -0)
- `packages/kilo-vscode/src/services/i18n/attention/it.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/ja.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/ko.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/nl.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/no.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/pl.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/ru.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/th.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/tr.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/uk.ts` (+13, -0)
- `packages/kilo-vscode/src/services/i18n/attention/zh.ts` (+12, -0)
- `packages/kilo-vscode/src/services/i18n/attention/zht.ts` (+12, -0)
- `packages/kilo-vscode/src/services/i18n/br.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/bs.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/da.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/de.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/en.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/es.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/fa.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/fr.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/it.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/ja.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/ko.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/nl.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/no.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/pl.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/ru.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/th.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/tr.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/uk.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/zh.ts` (+2, -0)
- `packages/kilo-vscode/src/services/i18n/zht.ts` (+2, -0)
- `packages/kilo-vscode/src/shared/pr-comment-actions.ts` (+19, -0)
- `packages/kilo-vscode/src/shared/review-comments.ts` (+11, -0)
- `packages/kilo-vscode/tests/accessibility.spec.ts` (+46, -13)
- `packages/kilo-vscode/tests/chat-auto-scroll.spec.ts` (+17, -16)
- `packages/kilo-vscode/tests/diff-scroll-preservation.spec.ts` (+2, -2)
- `packages/kilo-vscode/tests/fixtures/board-tool-render.tsx` (+80, -4)
- `packages/kilo-vscode/tests/fixtures/caffeination-button.tsx` (+3, -3)
- `packages/kilo-vscode/tests/fixtures/pr-comments-render.tsx` (+72, -29)
- `packages/kilo-vscode/tests/fixtures/pr-conversation-render.tsx` (+96, -0)
- `packages/kilo-vscode/tests/fixtures/session-provider-activity.tsx` (+400, -8)
- `packages/kilo-vscode/tests/model-selector-accessibility.spec.ts` (+11, -0)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/permission-dock-dropdown.spec.ts` (+7, -8)
- `packages/kilo-vscode/tests/session-dock-stability.spec.ts` (+127, -0)
- `packages/kilo-vscode/tests/swarm-board.spec.ts` (+327, -0)
- `packages/kilo-vscode/tests/unit/abort-state.test.ts` (+24, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-settings.test.ts` (+51, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-terminal-layout.test.ts` (+10, -0)
- `packages/kilo-vscode/tests/unit/am-pr-status-bridge.test.ts` (+66, -4)
- `packages/kilo-vscode/tests/unit/am-pr-utils.test.ts` (+154, -50)
- `packages/kilo-vscode/tests/unit/attention-os.test.ts` (+172, -0)
- `packages/kilo-vscode/tests/unit/attention.test.ts` (+287, -7)
- `packages/kilo-vscode/tests/unit/base-update.test.ts` (+11, -1)
- `packages/kilo-vscode/tests/unit/cloud-session-handler.test.ts` (+35, -0)
- `packages/kilo-vscode/tests/unit/command-completion.test.ts` (+21, -2)
- `packages/kilo-vscode/tests/unit/connection-service-question.test.ts` (+43, -0)
- `packages/kilo-vscode/tests/unit/early-message.test.ts` (+29, -0)
- `packages/kilo-vscode/tests/unit/git-import.test.ts` (+6, -0)
- `packages/kilo-vscode/tests/unit/git-ops.test.ts` (+46, -1)
- `packages/kilo-vscode/tests/unit/goal-composer.test.ts` (+108, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-followup.test.ts` (+2, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-indexing-refresh.test.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-notifications.test.ts` (+67, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-open-session.test.ts` (+31, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-route-integration.test.ts` (+118, -1)
- `packages/kilo-vscode/tests/unit/kilo-provider-utils.test.ts` (+36, -1)
- `packages/kilo-vscode/tests/unit/kilo-ui-contract.test.ts` (+46, -0)
- `packages/kilo-vscode/tests/unit/open-plan.test.ts` (+39, -1)
- `packages/kilo-vscode/tests/unit/permission-recovery.test.ts` (+59, -0)
- `packages/kilo-vscode/tests/unit/pr-check-feedback.test.ts` (+11, -1)
- `packages/kilo-vscode/tests/unit/pr-conversation-render.test.ts` (+8, -0)
- `packages/kilo-vscode/tests/unit/pr-review-actions.test.ts` (+157, -1)
- `packages/kilo-vscode/tests/unit/pr-review-request.test.ts` (+45, -0)
- `packages/kilo-vscode/tests/unit/prompt-input-connection-guard.test.ts` (+2, -1)
- `packages/kilo-vscode/tests/unit/prompt-send-contract.test.ts` (+21, -9)
- `packages/kilo-vscode/tests/unit/provider-multi-version.test.ts` (+41, -0)
- `packages/kilo-vscode/tests/unit/push-fixes-settings.test.ts` (+87, -0)
- `packages/kilo-vscode/tests/unit/review-comments-pr.test.ts` (+19, -0)
- `packages/kilo-vscode/tests/unit/server-manager-utils.test.ts` (+8, -0)
- `packages/kilo-vscode/tests/unit/session-board.test.ts` (+136, -0)
- `packages/kilo-vscode/tests/unit/session-dock.test.ts` (+59, -1)
- `packages/kilo-vscode/tests/unit/session-scroll-bottom.test.ts` (+142, -0)
- `packages/kilo-vscode/tests/unit/use-slash-command.test.ts` (+27, -0)
- `packages/kilo-vscode/tests/unit/worktree-create.test.ts` (+57, -0)
- `packages/kilo-vscode/tests/unit/worktree-manager.test.ts` (+20, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+37, -21)
- `packages/kilo-vscode/webview-ui/agent-manager/CaffeinationButton.css` (+0, -8)
- `packages/kilo-vscode/webview-ui/agent-manager/CaffeinationButton.tsx` (+2, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/NewWorktreeDialog.tsx` (+5, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectActions.tsx` (+5, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectList.tsx` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectSidebarBody.tsx` (+2, -4)
- `packages/kilo-vscode/webview-ui/agent-manager/SidebarBody.tsx` (+4, -9)
- `packages/kilo-vscode/webview-ui/agent-manager/SidebarSearchMenu.tsx` (+2, -10)
- `packages/kilo-vscode/webview-ui/agent-manager/SidebarSectionHeader.tsx` (+7, -9)
- `packages/kilo-vscode/webview-ui/agent-manager/SubagentPanel.tsx` (+18, -9)
- `packages/kilo-vscode/webview-ui/agent-manager/TabBar.tsx` (+125, -121)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+150, -144)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+47, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+47, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+47, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+47, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+47, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+47, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+47, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fa.ts` (+47, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fr.ts` (+47, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/it.ts` (+48, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ja.ts` (+47, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ko.ts` (+47, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/nl.ts` (+47, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/no.ts` (+47, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/pl.ts` (+47, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ru.ts` (+47, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/th.ts` (+46, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/tr.ts` (+47, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/uk.ts` (+47, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zh.ts` (+46, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zht.ts` (+46, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRChecks.tsx` (+10, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRCommentCard.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRConversation.tsx` (+215, -31)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRDescription.tsx` (+22, -15)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRFiles.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRMerge.tsx` (+318, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PROverview.tsx` (+0, -14)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRPanel.tsx` (+42, -4)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRPanelHost.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRReviewers.tsx` (+10, -4)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRSummary.tsx` (+58, -7)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRTimelineRow.tsx` (+45, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/SectionHeading.tsx` (+5, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/pr-actions.ts` (+15, -6)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/pr-check-feedback.ts` (+4, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/pr-comment-state.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/pr-conflict-state.ts` (+33, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/pr-panel.css` (+345, -28)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/pr-review-request.ts` (+12, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/pr-types.ts` (+87, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/tab-rendering.tsx` (+8, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/SideTerminalPanel.tsx` (+4, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/TerminalDestinationButton.tsx` (+10, -4)
- `packages/kilo-vscode/webview-ui/kiloclaw/components/ConversationList.tsx` (+17, -18)
- `packages/kilo-vscode/webview-ui/kiloclaw/components/MessageArea.tsx` (+12, -11)
- `packages/kilo-vscode/webview-ui/kiloclaw/components/MessageBubble.tsx` (+52, -73)
- `packages/kilo-vscode/webview-ui/kiloclaw/kiloclaw.css` (+0, -54)
- `packages/kilo-vscode/webview-ui/src/App.tsx` (+29, -11)
- `packages/kilo-vscode/webview-ui/src/components/chat/AssistantMessage.tsx` (+30, -3)
- `packages/kilo-vscode/webview-ui/src/components/chat/BackgroundAgents.tsx` (+8, -28)
- `packages/kilo-vscode/webview-ui/src/components/chat/BrowserReferences.tsx` (+6, -5)
- `packages/kilo-vscode/webview-ui/src/components/chat/ChatView.tsx` (+110, -76)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+32, -6)
- `packages/kilo-vscode/webview-ui/src/components/chat/PermissionCommand.tsx` (+6, -5)
- `packages/kilo-vscode/webview-ui/src/components/chat/PermissionDock.tsx` (+24, -30)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+271, -95)
- `packages/kilo-vscode/webview-ui/src/components/chat/SessionDock.tsx` (+20, -18)
- `packages/kilo-vscode/webview-ui/src/components/chat/SidebarTopBar.tsx` (+14, -22)
- `packages/kilo-vscode/webview-ui/src/components/chat/SwarmBoard.tsx` (+361, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskHeader.tsx` (+8, -4)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskToolExpanded.tsx` (+24, -5)
- `packages/kilo-vscode/webview-ui/src/components/chat/TranscriptRow.tsx` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/VscodeUserMessage.tsx` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/background-agents.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/goal/GoalHeader.tsx` (+17, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/goal/useGoalComposer.ts` (+68, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/goal/useGoalDock.tsx` (+171, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/task-tool-state.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/AgentBehaviourTab.tsx` (+15, -2)
- `packages/kilo-vscode/webview-ui/src/components/settings/ExperimentalTab.tsx` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/NotificationsTab.tsx` (+119, -35)
- `packages/kilo-vscode/webview-ui/src/components/shared/ActivityIcon.tsx` (+1, -10)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModeSwitcher.tsx` (+18, -5)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelSelector.tsx` (+23, -8)
- `packages/kilo-vscode/webview-ui/src/components/shared/SandboxButton.tsx` (+4, -5)
- `packages/kilo-vscode/webview-ui/src/components/shared/ThinkingSelector.tsx` (+15, -5)
- `packages/kilo-vscode/webview-ui/src/components/shared/WorkingIndicator.tsx` (+25, -18)
- `packages/kilo-vscode/webview-ui/src/components/speech-to-text/SpeechToTextButton.tsx` (+5, -23)
- `packages/kilo-vscode/webview-ui/src/context/abort-state.ts` (+8, -4)
- `packages/kilo-vscode/webview-ui/src/context/config.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/context/local-tabs.tsx` (+5, -5)
- `packages/kilo-vscode/webview-ui/src/context/session-types.ts` (+5, -3)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+107, -47)
- `packages/kilo-vscode/webview-ui/src/hooks/useImageAttachments.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/hooks/useSlashCommand.ts` (+3, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+34, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+33, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+33, -0)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/stories/agent-manager.stories.tsx` (+251, -48)
- `packages/kilo-vscode/webview-ui/src/stories/chat.stories.tsx` (+144, -3)
- `packages/kilo-vscode/webview-ui/src/stories/composite.stories.tsx` (+87, -1)
- `packages/kilo-vscode/webview-ui/src/stories/icon-button.stories.tsx` (+65, -0)
- `packages/kilo-vscode/webview-ui/src/stories/shared.stories.tsx` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/styles/chat-layout.css` (+33, -8)
- `packages/kilo-vscode/webview-ui/src/styles/chat.css` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/styles/goal.css` (+128, -0)
- `packages/kilo-vscode/webview-ui/src/styles/notifications.css` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/styles/permission-dock.css` (+2, -52)
- `packages/kilo-vscode/webview-ui/src/styles/prompt-input.css` (+32, -94)
- `packages/kilo-vscode/webview-ui/src/styles/search-menu.css` (+0, -4)
- `packages/kilo-vscode/webview-ui/src/styles/session-actions.css` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/styles/session-tabs.css` (+0, -13)
- `packages/kilo-vscode/webview-ui/src/styles/task-header.css` (+40, -19)
- `packages/kilo-vscode/webview-ui/src/styles/tool-overrides.css` (+32, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/agent-manager.ts` (+12, -34)
- `packages/kilo-vscode/webview-ui/src/types/messages/board.ts` (+29, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+28, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/index.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/sessions.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/src/utils/open-plan.ts` (+47, -2)
- `packages/kilo-vscode/webview-ui/src/utils/review-comment-markdown.ts` (+1, -0)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+49, -0)
- `packages/opencode/package.json` (+19, -19)
- `packages/opencode/script/kilocode/test-durations.json` (+0, -2)
- `packages/opencode/script/kilocode/test-profile.ts` (+0, -1)
- `packages/opencode/src/cli/cmd/run.ts` (+15, -8)
- `packages/opencode/src/cli/cmd/run/footer.ts` (+1, -14)
- `packages/opencode/src/cli/cmd/run/footer.view.tsx` (+0, -21)
- `packages/opencode/src/cli/cmd/run/runtime.lifecycle.ts` (+1, -9)
- `packages/opencode/src/cli/cmd/run/runtime.ts` (+0, -8)
- `packages/opencode/src/cli/cmd/run/session-data.ts` (+1, -59)
- `packages/opencode/src/cli/cmd/run/stream.transport.ts` (+0, -12)
- `packages/opencode/src/cli/cmd/run/tool.ts` (+0, -42)
- `packages/opencode/src/cli/cmd/run/types.ts` (+0, -2)
- `packages/opencode/src/command/index.ts` (+10, -0)
- `packages/opencode/src/config/config.ts` (+15, -0)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+75, -16)
- `packages/opencode/src/kilo-sessions/remote-sender.ts` (+1, -2)
- `packages/opencode/src/kilocode/board/store.ts` (+178, -69)
- `packages/opencode/src/kilocode/cli/cmd/run-terminal.ts` (+0, -54)
- `packages/opencode/src/kilocode/cli/cmd/run.ts` (+32, -0)
- `packages/opencode/src/kilocode/cli/cmd/run/interactive-terminal.tsx` (+0, -144)
- `packages/opencode/src/kilocode/cli/cmd/run/types.ts` (+0, -1)
- `packages/opencode/src/kilocode/cli/cmd/tui/app.tsx` (+4, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/caffeination.tsx` (+152, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/component/goal.tsx` (+109, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/goal-sync.ts` (+85, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/vt/vt-screen.ts` (+0, -14)
- `packages/opencode/src/kilocode/config/claude-migration.ts` (+963, -0)
- `packages/opencode/src/kilocode/interactive-terminal/index.ts` (+0, -469)
- `packages/opencode/src/kilocode/interactive-terminal/output.ts` (+0, -13)
- `packages/opencode/src/kilocode/sandbox/activation.ts` (+1, -11)
- `packages/opencode/src/kilocode/sandbox/network-tools.ts` (+0, -1)
- `packages/opencode/src/kilocode/server/httpapi/groups/interactive-terminal.ts` (+0, -103)
- `packages/opencode/src/kilocode/server/httpapi/groups/kilocode.ts` (+44, -1)
- `packages/opencode/src/kilocode/server/httpapi/handlers/interactive-terminal.ts` (+0, -62)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilo-gateway.ts` (+4, -2)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilocode.ts` (+48, -1)
- `packages/opencode/src/kilocode/server/httpapi/handlers/sandbox.ts` (+0, -2)
- `packages/opencode/src/kilocode/server/httpapi/public.ts` (+10, -3)
- `packages/opencode/src/kilocode/server/httpapi/server.ts` (+0, -2)
- `packages/opencode/src/kilocode/session/goal/instructions.ts` (+8, -0)
- `packages/opencode/src/kilocode/session/goal/policy.ts` (+58, -0)
- `packages/opencode/src/kilocode/session/goal/runner.ts` (+486, -0)
- `packages/opencode/src/kilocode/session/goal/state.ts` (+67, -0)
- `packages/opencode/src/kilocode/session/goal/tool.ts` (+41, -0)
- `packages/opencode/src/kilocode/session/part-lifecycle.ts` (+1, -1)
- `packages/opencode/src/kilocode/session/prompt-queue.ts` (+5, -0)
- `packages/opencode/src/kilocode/skills/inject.ts` (+6, -0)
- `packages/opencode/src/kilocode/snapshot/track.ts` (+6, -4)
- `packages/opencode/src/kilocode/ts-check.ts` (+126, -19)
- `packages/opencode/src/kilocode/ts-client.ts` (+82, -20)
- `packages/opencode/src/lsp/lsp.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/api.ts` (+0, -2)
- `packages/opencode/src/server/shared/workspace-routing.ts` (+1, -1)
- `packages/opencode/src/session/instruction.ts` (+8, -3)
- `packages/opencode/src/session/message-v2.ts` (+2, -0)
- `packages/opencode/src/session/prompt.ts` (+84, -34)
- `packages/opencode/src/session/session.ts` (+6, -3)
- `packages/opencode/src/session/tools.ts` (+2, -0)
- `packages/opencode/src/skill/index.ts` (+9, -3)
- `packages/opencode/src/snapshot/index.ts` (+4, -0)
- `packages/opencode/test/cli/auto-mode.test.ts` (+1, -12)
- `packages/opencode/test/cli/run/footer.view.test.tsx` (+0, -6)
- `packages/opencode/test/cli/run/run-process.test.ts` (+0, -1)
- `packages/opencode/test/kilocode/agent-permission-overrides.test.ts` (+2, -4)
- `packages/opencode/test/kilocode/board-tools.test.ts` (+67, -7)
- `packages/opencode/test/kilocode/board/store.test.ts` (+174, -0)
- `packages/opencode/test/kilocode/chmod-injection-contract.test.ts` (+38, -0)
- `packages/opencode/test/kilocode/cli/cmd/run-goal.test.ts` (+108, -0)
- `packages/opencode/test/kilocode/cli/cmd/run-terminal.test.ts` (+0, -72)
- `packages/opencode/test/kilocode/cli/cmd/run/interactive-terminal.test.ts` (+0, -98)
- `packages/opencode/test/kilocode/cli/cmd/tui/goal.test.tsx` (+163, -0)
- `packages/opencode/test/kilocode/cli/cmd/tui/prompt/interrupt.test.tsx` (+223, -0)
- `packages/opencode/test/kilocode/config/claude-handoff.test.ts` (+135, -0)
- `packages/opencode/test/kilocode/config/claude-migration.test.ts` (+389, -0)
- `packages/opencode/test/kilocode/interactive-terminal.test.ts` (+0, -410)
- `packages/opencode/test/kilocode/kilo-sessions.test.ts` (+139, -2)
- `packages/opencode/test/kilocode/lsp-typescript-lightweight.test.ts` (+225, -3)
- `packages/opencode/test/kilocode/message-v2-transient.test.ts` (+84, -0)
- `packages/opencode/test/kilocode/run-drain.test.ts` (+73, -0)
- `packages/opencode/test/kilocode/sandbox/network.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/server/board.test.ts` (+161, -0)
- `packages/opencode/test/kilocode/server/httpapi-exercise-scenarios.ts` (+130, -32)
- `packages/opencode/test/kilocode/server/httpapi-public.test.ts` (+31, -1)
- `packages/opencode/test/kilocode/session/goal.test.ts` (+1884, -0)
- `packages/opencode/test/kilocode/sessions/remote-sender.test.ts` (+1, -6)
- `packages/opencode/test/kilocode/snapshot-disabled.test.ts` (+37, -0)
- `packages/opencode/test/kilocode/snapshot-track-timeout.test.ts` (+76, -1)
- `packages/opencode/test/kilocode/task-nesting.test.ts` (+0, -7)
- `packages/opencode/test/kilocode/test-profile.test.ts` (+0, -1)
- `packages/opencode/test/kilocode/tool-registry-indexing.test.ts` (+32, -34)
- `packages/opencode/test/kilocode/ts-check.test.ts` (+149, -0)
- `packages/opencode/test/kilocode/tui/goal-sync.test.ts` (+166, -0)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/protocol/package.json` (+1, -1)
- `packages/schema/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk-next/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+87, -211)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+120, -261)
- `packages/sdk/openapi.json` (+367, -742)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/storybook/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/tui/src/component/prompt/index.tsx` (+10, -4)
- `packages/tui/src/context/sync.tsx` (+3, -65)
- `packages/tui/src/kilocode/link-interactions.ts` (+153, -0)
- `packages/tui/src/routes/session/index.tsx` (+8, -61)
- `packages/tui/src/routes/session/terminal.tsx` (+0, -206)
- `packages/tui/test/cli/tui/__snapshots__/inline-tool-wrap-snapshot.test.tsx.snap` (+8, -8)
- `packages/tui/test/cli/tui/inline-tool-wrap-snapshot.test.tsx` (+0, -1)
- `packages/tui/test/fixture/tui-sdk.ts` (+1, -2)
- `packages/tui/test/kilocode/interactive-terminal.test.tsx` (+0, -117)
- `packages/tui/test/kilocode/link-interactions.test.ts` (+186, -0)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/components/basic-tool.tsx` (+2, -1)
- `plans/agent-manager-pr-merge-readiness.md` (+36, -0)
- `script/architecture-allowlist.json` (+2, -1)
- `script/check-opencode-promise-facades.ts` (+15, -3)
- `script/kilocode/release-notes.test.ts` (+37, -1)
- `script/kilocode/release-notes.ts` (+27, -2)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 33ee44eef..a7146d7e8 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.5.16",
+  "version": "7.6.0",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/schema.json
```diff
diff --git a/packages/core/schema.json b/packages/core/schema.json
index d6abbcb97..4443db4f5 100644
--- a/packages/core/schema.json
+++ b/packages/core/schema.json
@@ -1,9 +1,9 @@
 {
   "version": "7",
   "dialect": "sqlite",
-  "id": "fcf518b9-c8bc-4ee5-8e68-2608bffcef43",
+  "id": "38a74186-5907-4662-9e14-e059300a8b4e",
   "prevIds": [
-    "08cfecbf-f95d-404b-a76a-2afc564baa8b"
+    "fcf518b9-c8bc-4ee5-8e68-2608bffcef43"
   ],
   "ddl": [
     {
@@ -700,6 +700,16 @@
       "entityType": "columns",
       "table": "kilo_board"
     },
+    {
+      "type": "integer",
+      "notNull": true,
+      "autoincrement": false,
+      "default": "0",
+      "generated": null,
+      "name": "cleared_seq",
+      "entityType": "columns",
+      "table": "kilo_board"
+    },
     {
       "type": "integer",
       "notNull": true,
```

#### packages/core/script/kilocode/migration.ts
```diff
diff --git a/packages/core/script/kilocode/migration.ts b/packages/core/script/kilocode/migration.ts
index c4ad0ee4a..40750df1d 100644
--- a/packages/core/script/kilocode/migration.ts
+++ b/packages/core/script/kilocode/migration.ts
@@ -1,5 +1,5 @@
 function board(name: string) {
-  return name === "kilocode_board" || name.endsWith("_kilocode_board")
+  return /(?:^|_)kilocode_board(?:_reset)?$/.test(name)
 }
 
 export function file(name: string, value: string) {
```

#### packages/core/src/control-plane/move-session.ts
```diff
diff --git a/packages/core/src/control-plane/move-session.ts b/packages/core/src/control-plane/move-session.ts
index e227f88df..aa1ff077a 100644
--- a/packages/core/src/control-plane/move-session.ts
+++ b/packages/core/src/control-plane/move-session.ts
@@ -80,13 +80,16 @@ const layer = Layer.effect(
       const directory = AbsolutePath.make(input.destination.directory)
       if (current.location.directory === directory) return
 
-      const source = yield* project.resolve(current.location.directory)
       const destination = yield* project.resolve(directory)
       if (current.projectID !== destination.id) {
         return yield* new DestinationProjectMismatchError({ expected: current.projectID, actual: destination.id })
       }
 
-      const moveChanges = input.moveChanges && source.directory !== destination.directory
+      // kilocode_change start - resolving the source project spawns Git subprocesses, so skip it when no
+      // changes are moved (for example when a worktree is deleted). The source is only read by moveChanges.
+      const source = input.moveChanges ? yield* project.resolve(current.location.directory) : undefined
+      const moveChanges = source ? source.directory !== destination.directory : false
+      // kilocode_change end
       const sourceRepository = moveChanges ? yield* git.repo.discover(current.location.directory) : undefined
       if (moveChanges && !sourceRepository)
         return yield* new CaptureChangesError({ message: "Source is not a Git repository" })
```

#### packages/core/src/database/migration.gen.ts
```diff
diff --git a/packages/core/src/database/migration.gen.ts b/packages/core/src/database/migration.gen.ts
index c6429a33a..1b40d57d9 100644
--- a/packages/core/src/database/migration.gen.ts
+++ b/packages/core/src/database/migration.gen.ts
@@ -42,6 +42,7 @@ export const migrations = (
     import("./migration/20260622202450_simplify_session_input"),
     import("./migration/20260714141136_session-message-legacy-writer-compat"),
     import("./migration/20260828074139_kilocode_board"), // kilocode_change
+    import("./migration/20260903104806_kilocode_board_reset"), // kilocode_change
     import("./migration/20260907102000_kilocode_model_usage_index"), // kilocode_change
   ])
 ).map((module) => module.default) satisfies DatabaseMigration.Migration[]
```


*... and more files (showing first 5)*

## opencode Changes (d6855b6..b3f1a96)

### Commits

- b3f1a96 - fix(console): unblock Go subscriptions in dev (#48309) (Victor Navarro, 2026-09-10)
- 859106e - docs(go): remove Omen Alpha listings (#48280) (Jack, 2026-09-10)
- 486e846 - chore: generate (opencode-agent[bot], 2026-09-10)
- 28a62b7 - feat(go): add DeepSeek V4.1 Flash (#48270) (Jack, 2026-09-10)
- a9a6fad - fix(opencode): request summarized adaptive thinking (#48269) (Aiden Cline, 2026-09-09)
- b6914b3 - chore: generate (opencode-agent[bot], 2026-09-09)
- 72635a3 - feat(console): clarify Go model usage (#48192) (Jack, 2026-09-09)
- 9f8db11 - feat(console): route migrated Go inference (#48123) (Victor Navarro, 2026-09-09)
- f69bece - docs(go): update GLM-5.3-Flash allowance (#48130) (Jack, 2026-09-09)
- 830d5eb - sync release versions for v1.18.30 (opencode, 2026-09-09)
- 5cd8e68 - feat(opencode): port Astra system prompt from v2 (#48057) (Aiden Cline, 2026-09-08)
- dff8fbc - chore: generate (opencode-agent[bot], 2026-09-08)
- ac1758c - fix: preserve Bedrock DeepSeek model ids (#34441) (Emrick, 2026-09-08)

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
- `packages/core/package.json` (+1, -1)
- `packages/core/src/plugin/provider/amazon-bedrock.ts` (+11, -3)
- `packages/core/test/plugin/provider-amazon-bedrock.test.ts` (+7, -0)
- `packages/stats/core/package.json` (+1, -1)

#### Other Changes
- `bun.lock` (+28, -28)
- `infra/console.ts` (+3, -2)
- `packages/app/package.json` (+1, -1)
- `packages/cli/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/component/go-models.ts` (+53, -0)
- `packages/console/app/src/component/limits-graph.css` (+300, -0)
- `packages/console/app/src/component/limits-graph.tsx` (+131, -233)
- `packages/console/app/src/i18n/ar.ts` (+10, -1)
- `packages/console/app/src/i18n/br.ts` (+10, -1)
- `packages/console/app/src/i18n/da.ts` (+11, -2)
- `packages/console/app/src/i18n/de.ts` (+10, -1)
- `packages/console/app/src/i18n/en.ts` (+10, -1)
- `packages/console/app/src/i18n/es.ts` (+10, -1)
- `packages/console/app/src/i18n/fr.ts` (+11, -2)
- `packages/console/app/src/i18n/it.ts` (+10, -1)
- `packages/console/app/src/i18n/ja.ts` (+10, -1)
- `packages/console/app/src/i18n/ko.ts` (+10, -1)
- `packages/console/app/src/i18n/no.ts` (+10, -1)
- `packages/console/app/src/i18n/pl.ts` (+10, -1)
- `packages/console/app/src/i18n/ru.ts` (+10, -1)
- `packages/console/app/src/i18n/th.ts` (+10, -1)
- `packages/console/app/src/i18n/tr.ts` (+10, -1)
- `packages/console/app/src/i18n/uk.ts` (+10, -1)
- `packages/console/app/src/i18n/zh.ts` (+10, -1)
- `packages/console/app/src/i18n/zht.ts` (+10, -1)
- `packages/console/app/src/lib/inference-proxy.ts` (+30, -5)
- `packages/console/app/src/lib/language.ts` (+28, -0)
- `packages/console/app/src/routes/go/index.css` (+0, -4)
- `packages/console/app/src/routes/go/index.tsx` (+5, -3)
- `packages/console/app/src/routes/workspace/[id]/go/lite-section.tsx` (+2, -1)
- `packages/console/app/src/routes/zen/go/v1/models.ts` (+4, -1)
- `packages/console/app/src/routes/zen/go/v1/usage.ts` (+3, -0)
- `packages/console/app/src/routes/zen/util/handler.ts` (+8, -8)
- `packages/console/app/src/routes/zen/v1/models.ts` (+2, -30)
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
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/plugin/github-copilot/models.ts` (+1, -1)
- `packages/opencode/src/provider/provider.ts` (+5, -1)
- `packages/opencode/src/session/prompt/gpt-astra.txt` (+46, -0)
- `packages/opencode/src/session/system.ts` (+2, -0)
- `packages/opencode/test/provider/amazon-bedrock.test.ts` (+43, -0)
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
- `packages/web/src/content/docs/ar/go.mdx` (+69, -66)
- `packages/web/src/content/docs/bs/go.mdx` (+65, -62)
- `packages/web/src/content/docs/da/go.mdx` (+69, -66)
- `packages/web/src/content/docs/de/go.mdx` (+69, -66)
- `packages/web/src/content/docs/es/go.mdx` (+65, -62)
- `packages/web/src/content/docs/fr/go.mdx` (+69, -66)
- `packages/web/src/content/docs/go.mdx` (+66, -61)
- `packages/web/src/content/docs/it/go.mdx` (+69, -66)
- `packages/web/src/content/docs/ja/go.mdx` (+69, -66)
- `packages/web/src/content/docs/ko/go.mdx` (+68, -65)
- `packages/web/src/content/docs/nb/go.mdx` (+65, -62)
- `packages/web/src/content/docs/pl/go.mdx` (+68, -65)
- `packages/web/src/content/docs/pt-br/go.mdx` (+69, -66)
- `packages/web/src/content/docs/ru/go.mdx` (+69, -66)
- `packages/web/src/content/docs/th/go.mdx` (+68, -65)
- `packages/web/src/content/docs/tr/go.mdx` (+69, -66)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+68, -65)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+70, -67)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 23aade0..19aade6 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.18.29",
+  "version": "1.18.30",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index daa4c4e..cc782f5 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.18.29",
+  "version": "1.18.30",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/plugin/provider/amazon-bedrock.ts
```diff
diff --git a/packages/core/src/plugin/provider/amazon-bedrock.ts b/packages/core/src/plugin/provider/amazon-bedrock.ts
index 0995cf1..7b83079 100644
--- a/packages/core/src/plugin/provider/amazon-bedrock.ts
+++ b/packages/core/src/plugin/provider/amazon-bedrock.ts
@@ -13,15 +13,23 @@ type MantleSDK = {
 // specific model/region combinations. Keep the mapping narrow and avoid
 // double-prefixing model IDs that models.dev already marks as global/us/eu/etc.
 function resolveModelID(modelID: string, region: string | undefined) {
+  if (modelID.startsWith("arn:")) return modelID
+
   const crossRegionPrefixes = ["global.", "us.", "eu.", "jp.", "apac.", "au."]
   if (crossRegionPrefixes.some((prefix) => modelID.startsWith(prefix))) return modelID
 
   const resolvedRegion = region ?? "us-east-1"
   const regionPrefix = resolvedRegion.split("-")[0]
   if (regionPrefix === "us") {
-    const requiresPrefix = ["nova-micro", "nova-lite", "nova-pro", "nova-premier", "nova-2", "claude", "deepseek"].some(
-      (item) => modelID.includes(item),
-    )
+    const requiresPrefix = [
+      "nova-micro",
+      "nova-lite",
+      "nova-pro",
+      "nova-premier",
+      "nova-2",
+      "claude",
+      "deepseek.r1",
+    ].some((item) => modelID.includes(item))
     if (requiresPrefix && !resolvedRegion.startsWith("us-gov")) return `${regionPrefix}.${modelID}`
     return modelID
   }
```

#### packages/core/test/plugin/provider-amazon-bedrock.test.ts
```diff
diff --git a/packages/core/test/plugin/provider-amazon-bedrock.test.ts b/packages/core/test/plugin/provider-amazon-bedrock.test.ts
index 5d24879..9ddcd12 100644
--- a/packages/core/test/plugin/provider-amazon-bedrock.test.ts
+++ b/packages/core/test/plugin/provider-amazon-bedrock.test.ts
@@ -528,6 +528,13 @@ describe("AmazonBedrockPlugin", () => {
         { region: "us-east-1", modelID: "amazon.nova-2-lite-v1:0", expected: "us.amazon.nova-2-lite-v1:0" },
         { region: "us-east-1", modelID: "anthropic.claude-sonnet-4-5", expected: "us.anthropic.claude-sonnet-4-5" },
         { region: "us-east-1", modelID: "deepseek.r1-v1:0", expected: "us.deepseek.r1-v1:0" },
+        { region: "us-east-1", modelID: "us.deepseek.r1-v1:0", expected: "us.deepseek.r1-v1:0" },
+        { region: "us-east-1", modelID: "deepseek.v3.2", expected: "deepseek.v3.2" },
+        {
+          region: "us-east-1",
+          modelID: "arn:aws:bedrock:us-east-1::foundation-model/deepseek.v3.2",
+          expected: "arn:aws:bedrock:us-east-1::foundation-model/deepseek.v3.2",
+        },
         { region: "us-gov-west-1", modelID: "anthropic.claude-sonnet-4-5", expected: "anthropic.claude-sonnet-4-5" },
         { region: "us-east-1", modelID: "cohere.command-r-plus-v1:0", expected: "cohere.command-r-plus-v1:0" },
         { region: "eu-west-1", modelID: "anthropic.claude-sonnet-4-5", expected: "eu.anthropic.claude-sonnet-4-5" },
```

#### packages/stats/core/package.json
```diff
diff --git a/packages/stats/core/package.json b/packages/stats/core/package.json
index 3da366c..d6ffa5f 100644
--- a/packages/stats/core/package.json
+++ b/packages/stats/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/stats-core",
-  "version": "1.18.29",
+  "version": "1.18.30",
   "private": true,
   "type": "module",
   "license": "MIT",
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/agent.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/kilocode/agent/index.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/test/agent/agent.test.ts
- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/schema.json
- `src/core/` - review core changes from packages/core/script/kilocode/migration.ts
- `src/core/` - review core changes from packages/core/src/control-plane/move-session.ts
- `src/core/` - review core changes from packages/core/src/database/migration.gen.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260903104806_kilocode_board_reset.ts
- `src/core/` - review core changes from packages/core/src/database/schema.gen.ts
- `src/core/` - review core changes from packages/core/src/flag/flag.ts
- `src/core/` - review core changes from packages/core/src/kilocode/board/sql.ts
- `src/core/` - review core changes from packages/core/src/kilocode/caffeination.ts
- `src/core/` - review core changes from packages/core/src/pty/driver.ts
- `src/core/` - review core changes from packages/core/test/kilocode/board/migration.test.ts
- `src/core/` - review core changes from packages/core/test/move-session.test.ts
- `src/core/` - review core changes from packages/core/test/npm.test.ts
- `src/tool/board.ts` - update based on kilocode packages/opencode/src/kilocode/tool/board.ts changes
- `src/tool/interactive-terminal.ts` - update based on kilocode packages/opencode/src/kilocode/tool/interactive-terminal.ts changes
- `src/tool/interactive-terminal.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/interactive-terminal.txt changes
- `src/tool/notify-user.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/notify-user.test.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/kilocode/tool/registry.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
- `src/tool/send-file.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/send-file.test.ts changes
- `src/tool/shell.ts` - update based on kilocode packages/opencode/src/tool/shell.ts changes
- `src/tool/task.test.ts` - update based on kilocode packages/opencode/test/tool/task.test.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/kilocode/tool/task.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/tool/task.ts changes
