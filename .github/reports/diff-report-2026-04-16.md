# Upstream Changes Report
Generated: 2026-04-16 07:48:59

## Summary
- kilocode: 387 commits, 498 files changed
- opencode: 0 commits, 0 files changed

## kilocode Changes (ba7b123f0..36c5d9e59)

### Commits

- 36c5d9e59 - Merge pull request #9000 from Kilo-Org/docs/update-mcp-using-in-kilo-code-page (Joshua Lambert, 2026-04-16)
- ebad9c052 - docs(kilo-docs): reorganize MCP examples (Josh Lambert, 2026-04-15)
- ece48dcf2 - fix(kilo-docs): document MCP permission rules (Josh Lambert, 2026-04-15)
- 0650d6bd3 - Merge pull request #9008 from Kilo-Org/island-sunshine (Kirill Kalishev, 2026-04-15)
- 2b71409a3 - docs(jetbrains): replace Color enum with Theme in UI DSL binding example (kirillk, 2026-04-15)
- ac7f50d9c - docs(jetbrains): expand Kotlin UI DSL v2 reference with comprehensive showcase-based guide (kirillk, 2026-04-15)
- 3f68303a0 - release: v7.2.10 (kilo-maintainer[bot], 2026-04-15)
- 8cf01acd8 - Merge pull request #9003 from Kilo-Org/fix/restore-model-prompt-system-prompt (Christiaan Arnoldus, 2026-04-15)
- 114f9a2db - release: v7.2.9 (kilo-maintainer[bot], 2026-04-15)
- a7478fc3f - test(cli): add tests for model.prompt-based system prompt selection (kiloconnect[bot], 2026-04-15)
- 2c25720ec - fix(cli): restore model.prompt-based system prompt selection (kiloconnect[bot], 2026-04-15)
- 41ffb3a3a - release: v7.2.8 (kilo-maintainer[bot], 2026-04-15)
- 013973e5d - Merge pull request #8907 from Kilo-Org/feat/smoke-test-standalone (Catriel Müller, 2026-04-15)
- 599d201eb - Merge branch 'main' into feat/smoke-test-standalone (Catriel Müller, 2026-04-15)
- acfa0e96b - chore: add run script (#8985) (Marius, 2026-04-15)
- be550c3bb - docs(kilo-docs): remove outdated video and reorder MCP tabs (Josh Lambert, 2026-04-15)
- eb78b0896 - Merge pull request #8886 from Kilo-Org/pie-parmesan (Kirill Kalishev, 2026-04-15)
- a00afd552 - Merge branch 'main' into pie-parmesan (Kirill Kalishev, 2026-04-15)
- a476e19a8 - release: v7.2.7 (kilo-maintainer[bot], 2026-04-15)
- d4ab3331c - revert: remove suggest tool feature (#8994) (Marius, 2026-04-15)
- ae8e7b6e1 - test(cli): skip flaky "prompt submitted during active run" test (#8992) (Marius, 2026-04-15)
- a28254926 - Merge branch 'main' into pie-parmesan (Kirill Kalishev, 2026-04-15)
- 2f9467ee3 - fix(cli): mock getGitContext in commit-message tests to fix Linux CI flake (#8989) (Marius, 2026-04-15)
- 32c05387f - Merge pull request #8988 from Kilo-Org/fix/suggest-dismiss-on-new-message (Mark IJbema, 2026-04-15)
- e03082447 - Merge branch 'main' into fix/suggest-dismiss-on-new-message (Marian Alexandru Alecu, 2026-04-15)
- 3b96485dc - fix(cli): dismiss suggestions on new message to prevent stuck session (Alex Alecu, 2026-04-15)
- ccf1ad245 - chore(sdk): regenerate api client (#8980) (Marius, 2026-04-15)
- c584eec1d - fix(cli): remap child session references on fork to prevent subagent state leaks (#8956) (Marius, 2026-04-15)
- 581bbbb31 - feat(cli,vscode): add custom commit message prompt setting (#8974) (Marius, 2026-04-15)
- d9a221dc6 - Merge branch 'main' into pie-parmesan (Kirill Kalishev, 2026-04-15)
- 2e5429201 - feat(jetbrains): add detekt for cyclomatic complexity and file size limits (kiloconnect[bot], 2026-04-15)
- e8fd49570 - Merge pull request #8972 from Kilo-Org/kilocode-auto-approve-permissions (Marian Alexandru Alecu, 2026-04-15)
- 6b7707716 - Merge pull request #8971 from Kilo-Org/kilocode-worktree-session-list (Marian Alexandru Alecu, 2026-04-15)
- d3c6415df - docs(kilo-docs): document drag-and-drop file mentions in context docs (#8981) (Marius, 2026-04-15)
- 5f7954c43 - Merge pull request #6404 from Kilo-Org/feat/suggest-code-review (Marian Alexandru Alecu, 2026-04-15)
- 6c7b02619 - chore: remove plan file (Alex Alecu, 2026-04-15)
- 723344530 - refactor(cli): move test to kilocode dir (Alex Alecu, 2026-04-15)
- 506233922 - docs(cli): clarify stripNulls jsdoc (Alex Alecu, 2026-04-15)
- 3fd8357af - fix(cli): propagate suggestion accept failure to remote clients (Alex Alecu, 2026-04-15)
- ef435ebba - fix(cli): restrict suggest tool to code-review-only (Alex Alecu, 2026-04-15)
- 061e1d30a - fix(vscode): remove kilocode_change marker from WorkingIndicator (Alex Alecu, 2026-04-15)
- e93789482 - fix(cli): fix type errors from accept return type (Alex Alecu, 2026-04-15)
- 8e0b9f9b5 - fix(vscode): move suggestion fetch into flushPendingPrompts (Alex Alecu, 2026-04-15)
- c61846b61 - fix(cli): return 404 when suggestion accept no-ops (Alex Alecu, 2026-04-15)
- 61c010556 - fix(cli): reject promise on invalid action index (Alex Alecu, 2026-04-15)
- 1b5832ce3 - fix(cli): limit concurrent git processes for untracked files (Alex Alecu, 2026-04-15)
- 3d74441b7 - fix(cli): delete only nested sentinel to preserve other wildcard rules (Alex Alecu, 2026-04-15)
- 152e0755a - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-04-15)
- cec729667 - fix(vscode): hide WorkingIndicator when suggestion is pending (Alex Alecu, 2026-04-15)
- 02b511e8e - fix(vscode): make SuggestBar full-width and unblock prompt input (Alex Alecu, 2026-04-15)
- 624be2310 - fix(cli): fix disable auto-approve leaving stale config and UI (Alex Alecu, 2026-04-15)
- 9dd1f631b - revert: restore patch fields for diff compatibility (#8970) (Marius, 2026-04-15)
- 74288ef0c - fix(cli): worktree session list ignoring SDK-injected directory filter (Alex Alecu, 2026-04-15)
- bd4d85229 - perf(vscode): exclude patch from diff hash to reduce memory overhead (#8967) (Marius, 2026-04-15)
- 08b466310 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-04-15)
- f1e5b7cad - feat(vscode): render SuggestBar inline in conversation flow (Alex Alecu, 2026-04-15)
- 84a628442 - docs(kilo-docs): document run script feature in Agent Manager (#8962) (Marius, 2026-04-15)
- 9544846fc - fix(agent-manager): route plan follow-up sessions to worktree instead of LOCAL (#8966) (Marius, 2026-04-15)
- a705f4dfe - feat(agent-manager): support drag-and-drop of diff file headers into chat as @mentions (#8961) (Marius, 2026-04-15)
- 33c8cd53f - fix(agent-manager): preserve scroll position when agent edits files in diff viewer (#8965) (Marius, 2026-04-15)
- 8093dbd59 - Merge pull request #8507 from Kilo-Org/session/agent_9864f1dc-ca7c-4243-877b-14d089b66f92 (Christiaan Arnoldus, 2026-04-15)
- 1ec4a0db0 - fix(vscode): prune messageSessionIdsByMessageId entries on session delete (#8964) (Marius, 2026-04-15)
- cada8a95b - Fix typecheck (Christiaan Arnoldus, 2026-04-15)
- ee66ba198 - Merge branch 'main' into session/agent_9864f1dc-ca7c-4243-877b-14d089b66f92 (Christiaan Arnoldus, 2026-04-15)
- e01716a2d - Pick variants from the model (Christiaan Arnoldus, 2026-04-15)
- 9df0dbea2 - Merge branch 'main' into feat/suggest-code-review (Marian Alexandru Alecu, 2026-04-15)
- fb6beddff - fix(agent-manager): preserve worktree sessions when backend listing fails (#8902) (Marius, 2026-04-15)
- ee12fb528 - fix(cli): skip output truncation for suggest tool to fix test failures (Alex Alecu, 2026-04-15)
- 0679fdfcd - perf(agent-manager): skip git stats polling for worktrees in collapsed sections (#8903) (Marius, 2026-04-15)
- b9ecdb16a - fix(ui): use LTR isolate instead of LTR embedding for directory paths in diff headers (#8959) (Marius, 2026-04-15)
- 87eeb068b - fix(vscode): filter non-blocking questions in blocked() check (Alex Alecu, 2026-04-15)
- 543660bc8 - fix(cli): parallelize git diff for untracked files in review (Alex Alecu, 2026-04-15)
- 22806d496 - fix(cli): avoid worktree diff patch generation (#8953) (Marius, 2026-04-15)
- aa9af01fe - fix(agent-manager): fix tab header tooltip-trigger breaking height chain (#8955) (Marius, 2026-04-15)
- 7939a021c - fix(cli): re-apply dead-stream detection to SSE endpoints to prevent memory leak on Windows (#8952) (Marius, 2026-04-15)
- bab81482a - Merge branch 'main' into feat/suggest-code-review (Marian Alexandru Alecu, 2026-04-15)
- 5182ea6a4 - Merge pull request #8919 from Kilo-Org/fix/internal-skills (Marian Alexandru Alecu, 2026-04-15)
- 9a0f30ecb - chore(cli): untrack models-snapshot files (#8947) (Marius, 2026-04-15)
- 0d5c4711b - fix(vscode): use suggestion sessionID for directory lookup (Alex Alecu, 2026-04-15)
- c22eee3ab - Merge branch 'main' into feat/suggest-code-review (Marian Alexandru Alecu, 2026-04-15)
- b0a658ed1 - Merge pull request #8671 from Kilo-Org/fix/skill-read-config-protection (Marian Alexandru Alecu, 2026-04-15)
- 414693227 - Merge remote-tracking branch 'origin/main' into feat/suggest-code-review (Alex Alecu, 2026-04-15)
- b7e1491ee - test(cli): move config dir test to kilocode/ (Alex Alecu, 2026-04-15)
- 7d932c347 - Merge branch 'main' into session/agent_9864f1dc-ca7c-4243-877b-14d089b66f92 (Christiaan Arnoldus, 2026-04-15)
- b882d352e - Merge branch 'main' into fix/internal-skills (Marian Alexandru Alecu, 2026-04-15)
- 75bf2109b - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-04-14)
- a6c712c51 - OpenCode v1.4.3 (Catriel Müller, 2026-04-14)
- 995d4a075 - fix: update links (Catriel Müller, 2026-04-14)
- 6b04c0fb9 - fix: fix prettier version (Catriel Müller, 2026-04-14)
- c32e7a860 - fix: fix core tests (Catriel Müller, 2026-04-14)
- 87ca28001 - fix: typechecks (Catriel Müller, 2026-04-14)
- 51983b1e9 - refactor: regenerate sdk (Catriel Müller, 2026-04-14)
- c79ecad63 - refactor: bun lock update (Catriel Müller, 2026-04-14)
- 1c67e0fe7 - resolve merge conflicts (Catriel Müller, 2026-04-14)
- edb7dbbf5 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-04-14)
- c9e0060e2 - refactor: kilo compat for v1.4.3 (Catriel Müller, 2026-04-14)
- f3bc6e04f - Merge pull request #8923 from Kilo-Org/imanolmaiztegui/kilo-opencode-v1.4.0 (Catriel Müller, 2026-04-14)
- 7ff38788c - fix(cli): add kilocode_change annotations to shared skill tests (Alex Alecu, 2026-04-14)
- 26e23c3ce - Merge pull request #8357 from shssoichiro/tui-usage-info (Marian Alexandru Alecu, 2026-04-14)
- 9fe8b969e - fix: windows http memory (Catriel Müller, 2026-04-14)
- 5b98391dd - Merge branch 'main' into tui-usage-info (Marian Alexandru Alecu, 2026-04-14)
- 5f39b745c - Merge branch 'main' into pie-parmesan (Kirill Kalishev, 2026-04-14)
- d2427eb19 - Merge pull request #6183 from Ashwinhegde19/fix/windows-mouse-tracking-exit (Marian Alexandru Alecu, 2026-04-14)
- ba3309b21 - fix(opencode): merge variant into model object in plan-followup test seed (Imanol Maiztegui, 2026-04-14)
- 9ad515c18 - fix(jetbrains): replace synchronized(errors) with CopyOnWriteArrayList (kirillk, 2026-04-14)
- be5272acc - chore: update visual regression baselines (github-actions[bot], 2026-04-14)
- 7df2904b6 - fix: vscode read tool align title (Catriel Müller, 2026-04-14)
- 52d97250f - Merge branch 'main' into pie-parmesan (Kirill Kalishev, 2026-04-14)
- 316a6473b - fix(cli): add kilocode_change markers (Alex Alecu, 2026-04-14)
- 6b2ed4546 - style(vscode): normalize indentation and formatting in legacy utils and UI (Imanol Maiztegui, 2026-04-14)
- 7ccf624a8 - feat(vscode): resolve diff content from patch field in UI components (Imanol Maiztegui, 2026-04-14)
- ee883b55e - Merge pull request #8449 from Kilo-Org/docs/exec-approvals-allow-everything (Alex Gold, 2026-04-14)
- a5c422e82 - fix(vscode): hide remove button for built-in skills (Alex Alecu, 2026-04-14)
- 1cf1e6f14 - chore: update visual regression baselines (github-actions[bot], 2026-04-14)
- 017ca5738 - fix(jetbrains): address review feedback from #8886 and #8849 (kirillk, 2026-04-14)
- c1aca9a0c - fix(cli): log error in catch block (Alex Alecu, 2026-04-14)
- 7cf2b36ba - fix(cli): resolve merge conflicts with main (Alex Alecu, 2026-04-14)
- 4e115bf88 - Merge branch 'main' into imanolmaiztegui/kilo-opencode-v1.4.0 (Imanol Maiztegui, 2026-04-14)
- 520bb096a - Merge branch 'main' into docs/exec-approvals-allow-everything (Alex Gold, 2026-04-14)
- 34005d2f9 - Merge pull request #8917 from Kilo-Org/mark/fix-modified-files-spacing (Mark IJbema, 2026-04-14)
- 37c1ff2d6 - fix(vscode): align diff bars to text baseline in diff summary header (Mark IJbema, 2026-04-14)
- 0f196e7af - fix(cli): restore built-in skill registration lost in upstream merge (Alex Alecu, 2026-04-14)
- 4b66a9cca - fix(vscode): make diff summary title inline with flexbox so bars render on same line (Mark IJbema, 2026-04-14)
- 749337f75 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-04-14)
- e3455b344 - Merge branch 'main' into session/agent_9864f1dc-ca7c-4243-877b-14d089b66f92 (Christiaan Arnoldus, 2026-04-14)
- f995fe092 - fix(vscode): add missing space between 'Modified' and file count in diff summary (Mark IJbema, 2026-04-14)
- 965038bda - Merge branch 'main' into tui-usage-info (Josh Holmer, 2026-04-14)
- 0208a8880 - feat: migrate diff schema to use patch field and consolidate model variant (Imanol Maiztegui, 2026-04-14)
- 4c038b17d - release: v7.2.6 (kilo-maintainer[bot], 2026-04-14)
- 08be022cc - Merge branch 'main' into tui-usage-info (Josh Holmer, 2026-04-14)
- d3a7a857f - fix(cli): whitelist global config dirs in external_directory permissions (Alex Alecu, 2026-04-14)
- fb48b5eae - feat(sdk): add before and after fields to WorktreeDiffItem schema (Imanol Maiztegui, 2026-04-14)
- c36e91f27 - Merge pull request #8782 from Kilo-Org/fix/cli-error-boundary-no-renderer (Marian Alexandru Alecu, 2026-04-14)
- 54be78db5 - Merge pull request #8749 from Kilo-Org/docs/workspace-bot-account-recommendation (Alex Gold, 2026-04-14)
- b45811d7a - Merge origin/main and adapt token usage to plugin architecture (Alex Alecu, 2026-04-14)
- a828e1a1e - fix(cli): restore onBeforeExit in ErrorComponent (Alex Alecu, 2026-04-14)
- e0489f2f4 - Apply suggestion from @alexkgold (Alex Gold, 2026-04-14)
- cc2a03b2a - refactor: align codebase with v1.4.0 upstream and update SDK schema (Imanol Maiztegui, 2026-04-14)
- 20c8f3e5b - docs(kilo-docs): recommend dedicated Google account and remove suggested-configuration page (Alex Gold, 2026-04-14)
- f2cb0d705 - fix(cli): add kilocode_change markers and regenerate source-links (Alex Alecu, 2026-04-14)
- ddb2bba02 - fix(tui): show progress indicators while subagent is initializing (#8807) (Thomas Brugman, 2026-04-14)
- 9f4f0ba89 - resolve merge conflicts (Imanol Maiztegui, 2026-04-14)
- a15e44809 - fix: add remaining kilocode_change markers (Alex Alecu, 2026-04-14)
- 9bfe7dc20 - fix: restore suggest tool registration, add kilocode_change markers, fix lint (Alex Alecu, 2026-04-14)
- 407f60137 - Merge remote-tracking branch 'origin/main' into fix/cli-error-boundary-no-renderer (Alex Alecu, 2026-04-14)
- 6290c11d3 - feat(agent-manager): jump to changed line when clicking line number in diff (#8866) (Thomas Brugman, 2026-04-14)
- 77dae2fcc - Merge branch 'main' into fix/skill-read-config-protection (Marian Alexandru Alecu, 2026-04-14)
- 54fe07715 - Merge remote-tracking branch 'origin/main' into fix/skill-read-config-protection (Alex Alecu, 2026-04-14)
- b45967633 - Merge branch 'main' into pie-parmesan (Kirill Kalishev, 2026-04-14)
- 68c02792a - reformatting rolled back (kirillk, 2026-04-14)
- d2593ac70 - Merge pull request #8849 from Kilo-Org/lime-dormouse (Kirill Kalishev, 2026-04-14)
- 4711890f9 - fix(cli): pass blocking field through Question.ask (Alex Alecu, 2026-04-14)
- bc5be5b3a - Merge branch 'main' into lime-dormouse (Kirill Kalishev, 2026-04-14)
- 596bc9f83 - Merge remote-tracking branch 'origin/main' into feat/suggest-code-review (Alex Alecu, 2026-04-14)
- 242fe1a7c - Merge pull request #8895 from Kilo-Org/remove-fix-duplicate-reasoning (Christiaan Arnoldus, 2026-04-14)
- 4888fe204 - fix(vscode): strip Electron env vars in dev launch script (#8906) (Marius, 2026-04-14)
- 71b6dc903 - Merge pull request #8908 from Kilo-Org/feat/gateway-models-feature-header (Christiaan Arnoldus, 2026-04-14)
- 75207ad11 - Merge branch 'main' into remove-fix-duplicate-reasoning (Christiaan Arnoldus, 2026-04-14)
- 2547c7326 - chore: resolve merge conflict in provider.ts (kiloconnect[bot], 2026-04-14)
- e16a8da34 - ci: add standalone smoke-test workflow (interim step) (Josh Lambert, 2026-04-14)
- fcbc344c3 - chore(kilo-docs): refresh source-links.md after removing fixDuplicateReasoning (kiloconnect[bot], 2026-04-14)
- 4d2f55343 - feat(gateway): include feature header in models list request (kiloconnect[bot], 2026-04-14)
- 4a69a3e0d - fix(cli): invalidate provider state after auth changes (#8898) (Marius, 2026-04-14)
- 824a39491 - docs: clarify changeset descriptions should be concise and user-directed (#8901) (Marius, 2026-04-14)
- e67ed3f17 - perf: reduce git process load via adaptive polling and caching (#8703) (Aarav, 2026-04-14)
- 11704bc3b - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-04-14)
- 52674fffe - fix(vscode): prevent prompt autofocus stealing focus (#8872) (Marius, 2026-04-14)
- 4fc1e0263 - refactor: kilo compat for v1.4.0 (Imanol Maiztegui, 2026-04-14)
- a1bd03d77 - Merge pull request #8893 from Kilo-Org/imanolmaiztegui/kilo-opencode-v1.3.17 (Imanol Maiztegui, 2026-04-14)
- 9fa90ee63 - feat(vscode): support @terminal context mention in chat and agent manager (#8894) (Marius, 2026-04-14)
- b3af98343 - Merge pull request #8889 from Kilo-Org/session/agent_a5acac3d-bd3b-4da4-98db-0ef22a1f9fe9 (Mark IJbema, 2026-04-14)
- 49657f514 - chore: revert unrelated cosmetic changes (Alex Alecu, 2026-04-14)
- 32e9c2934 - fix(cli): remove fixDuplicateReasoning workaround now that @openrouter/ai-sdk-provider is updated (kiloconnect[bot], 2026-04-14)
- 76093d53a - test(session): rename agent references from "build" to "code" in prompt-effect tests (Imanol Maiztegui, 2026-04-14)
- f0eebe9b4 - docs(kilo-docs): update source link path for dialog-provider component (Imanol Maiztegui, 2026-04-14)
- 208d73e4b - fix(cli): resolve type errors after merge with main (Alex Alecu, 2026-04-14)
- cd79db8a8 - refactor: update sdk imports and fix type signatures for v1.3.17 compat (Imanol Maiztegui, 2026-04-14)
- 170889e95 - resolve merge conflicts (Imanol Maiztegui, 2026-04-14)
- 4e8e607fc - chore: remove plan files from branch (Alex Alecu, 2026-04-14)
- 54b5d124a - Merge remote-tracking branch 'origin/main' into feat/suggest-code-review (Alex Alecu, 2026-04-14)
- 1b0ccd52f - fix(vscode): keep worktree sessions across project id changes (#8875) (Marius, 2026-04-14)
- 5816eeac4 - chore(deps): update @openrouter/ai-sdk-provider to 2.5.1 in kilo-gateway and opencode (kiloconnect[bot], 2026-04-14)
- fc282171a - refactor(cli): decouple suggest from question tool (Alex Alecu, 2026-04-14)
- 0a965979a - fix(cli): dismiss suggestion by callID not session (Alex Alecu, 2026-04-14)
- 12b9519a2 - fix(cli): preserve slash-command arguments in suggest (Alex Alecu, 2026-04-14)
- 54ddd1fb0 - fix(vscode): include suggestions in blocked and dock checks (Alex Alecu, 2026-04-14)
- 73b6d9a6c - refactor: kilo compat for v1.3.17 (Imanol Maiztegui, 2026-04-14)
- 07b4a4541 - Merge remote-tracking branch 'origin/main' into feat/suggest-code-review (Alex Alecu, 2026-04-14)
- 703060605 - feat(jetbrains): refactor welcome UI with icon status rows and centered layout (kirillk, 2026-04-13)
- 6e50b5492 - fix(jetbrains): fix tool window rendering, workspace state flow, and provider deserialization (kirillk, 2026-04-13)
- cc373d9ed - moving things (kirillk, 2026-04-13)
- f3bf57d84 - fix(jetbrains): resolve race conditions in initialization and add missing env vars (kirillk, 2026-04-13)
- 43cdbe9de - feat(jetbrains): extract KiloWelcomeUi with app + workspace status (kirillk, 2026-04-13)
- 6499ab5c2 - refactor(jetbrains): introduce workspace package, rename Project -> Workspace (kirillk, 2026-04-13)
- c4c9f94ae - feat(jetbrains): add session management with app service lifecycle (kirillk, 2026-04-13)
- 702459f01 - refactor(jetbrains): remove init{} from services, add project service tests (kirillk, 2026-04-13)
- c178fedaf - feat(jetbrains): add project data loading from CLI server (kirillk, 2026-04-13)
- fa767a8e4 - Merge branch 'main' into lime-dormouse (Kirill Kalishev, 2026-04-13)
- 486ba676c - Merge branch 'main' into lime-dormouse (Kirill Kalishev, 2026-04-13)
- 7115a4b5e - moving things (kirillk, 2026-04-13)
- 23745d255 - chore(jetbrains): bump kotlinx-serialization to 1.8.1 (latest for Kotlin 2.1.x) (kirillk, 2026-04-13)
- 8b880ed2d - fix(jetbrains): forward health flag from server, restrict profile fallback to 401 (kirillk, 2026-04-13)
- c807564bd - Merge branch 'main' into lime-dormouse (Kirill Kalishev, 2026-04-13)
- 7530e33b3 - refactor(jetbrains): strip KiloBackendProjectService to project-only shell (kirillk, 2026-04-13)
- ac8787144 - feat(jetbrains): add IntelliJ-independent backend test suite (kirillk, 2026-04-13)
- 2e6571357 - Merge branch 'main' into session/agent_9864f1dc-ca7c-4243-877b-14d089b66f92 (Christiaan Arnoldus, 2026-04-13)
- af02ff672 - fix(vscode): export Translator type from CustomProviderModelCard (kiloconnect[bot], 2026-04-13)
- 07ab3b4fc - chore: merge main into PR branch, resolve provider.ts conflict (kiloconnect[bot], 2026-04-13)
- 1bdf30ef0 - fix(vscode): fix i18n translations, extract model card components, fix UI alignment (kiloconnect[bot], 2026-04-13)
- 12c8244b3 - Merge branch 'main' into session/agent_9864f1dc-ca7c-4243-877b-14d089b66f92 (Christiaan Arnoldus, 2026-04-13)
- 6496c74fa - refactor(jetbrains): clean up section divider comments and simplify build-tasks plugin (kirillk, 2026-04-12)
- f7f6a270f - refactor(jetbrains): move buildSrc to build-tasks composite build (kirillk, 2026-04-12)
- 0a4aa192a - feat(jetbrains): switch generated HTTP client from Moshi to kotlinx.serialization (kirillk, 2026-04-12)
- c2d6a0a08 - fix(jetbrains): move findBun into PrepareLocalCliTask to avoid non-static inner class error (kirillk, 2026-04-12)
- 8a617ee8d - fix(jetbrains): resolve bun path for Gradle daemon, fix Config.model deserialization (kirillk, 2026-04-12)
- 600f4df93 - feat(jetbrains): add KiloAppState with loading phase, retry, and error details (kirillk, 2026-04-12)
- a729eaba1 - fix(jetbrains): centralize lifecycle mutex and fix reconnection issues (kirillk, 2026-04-12)
- dafe3b551 - refactor(jetbrains): make frontend KiloAppService app-level (kirillk, 2026-04-12)
- 6a0ba29db - refactor(jetbrains): rename KiloProjectRpcApi to KiloAppRpcApi, remove ProjectId (kirillk, 2026-04-12)
- 4aa3ad766 - refactor(jetbrains): reorganize frontend and RPC packages (kirillk, 2026-04-12)
- 49367eb35 - refactor(jetbrains): rename backend classes to KiloBackend* prefix and move to backend package (kirillk, 2026-04-12)
- 4b41cbf0d - feat(jetbrains): add KiloAppService as single app-level orchestrator (kirillk, 2026-04-12)
- 14c279fcb - tui: show token usage breakdown in sidebar for transparency (Josh Holmer, 2026-04-11)
- 6a7a0ee47 - fix(cli): guard ErrorComponent against missing renderer context (kiloconnect[bot], 2026-04-11)
- aaf87a228 - fix: auto-generate JetBrains CLI resources for runIde (kirillk, 2026-04-10)
- 10abb3e69 - fix(vscode): naming, comment, and type annotation cleanup in custom provider reasoning UI (kiloconnect[bot], 2026-04-10)
- d71fcb846 - Improve variant UI issues (Christiaan Arnoldus, 2026-04-10)
- 8a1f96e44 - Merge branch 'main' into session/agent_9864f1dc-ca7c-4243-877b-14d089b66f92 (Christiaan Arnoldus, 2026-04-10)
- 877be7e8e - release: v1.4.3 (opencode, 2026-04-10)
- eac50f915 - ci: prevent beta branch builds from triggering production release steps (Dax Raad, 2026-04-09)
- 1a902b291 - ci: skip winget publish on beta and ensure finalize always runs (Dax Raad, 2026-04-09)
- bbe4a04f9 - chore: generate (opencode-agent[bot], 2026-04-09)
- b2f621b89 - refactor(session): inline init route orchestration (#21754) (Kit Langton, 2026-04-09)
- 7202b3a32 - fix: ensure that openai oauth works for agent create cmd, use temporary hack (#21749) (Aiden Cline, 2026-04-09)
- 35b44df94 - chore: generate (opencode-agent[bot], 2026-04-09)
- 10441efad - refactor(effect): extract session run state service (#21744) (Kit Langton, 2026-04-09)
- 3199383ee - fix: finalize interrupted bash via tool result path (#21724) (Kit Langton, 2026-04-09)
- 9f54115c5 - refactor: remove unused runtime facade exports (#21731) (Kit Langton, 2026-04-09)
- 2ecc6ae65 - fix(effect): suspend agent default layer construction (#21732) (Kit Langton, 2026-04-09)
- 02b32e1ba - Revert "opencode: lazy-load top-level CLI commands" (#21726) (Simon Klee, 2026-04-09)
- 34b979265 - delete unused withALS method (#21723) (Kit Langton, 2026-04-09)
- 537160dbc - opencode: lazy-load top-level CLI commands (Simon Klee, 2026-04-09)
- eb7f6ff01 - Merge branch 'main' into docs/exec-approvals-allow-everything (Alex Gold, 2026-04-09)
- b0600664a - feat: add support for fast modes for claude and gpt models (that support it) (#21706) (Aiden Cline, 2026-04-09)
- 581a7692f - fix(tui): restore hidden session scrollbar default (#20947) (Kit Langton, 2026-04-09)
- f73e4d5d3 - chore: generate (opencode-agent[bot], 2026-04-09)
- a7743e646 - feat(mcp): add OAuth redirect URI configuration for MCP servers (#21385) (Aleksandr Lossenko, 2026-04-09)
- 5d3dba666 - release: v1.4.2 (opencode, 2026-04-09)
- bd53b651a - refactor: fix tool call state handling and clean up imports (#21709) (Dax, 2026-04-09)
- dbb892ede - fix(cli): add kilocode_change annotation markers (Alex Alecu, 2026-04-09)
- dbf6783b2 - fix(cli): allow reading global config without prompts, fix absolute glob patterns (Alex Alecu, 2026-04-09)
- 46da801f3 - refactor(effect): drop shell abort signals from runner (#21599) (Kit Langton, 2026-04-09)
- 542899780 - fix(cli): block bash deletion of global config files, validate config after edits (Alex Alecu, 2026-04-09)
- 58a99916b - fix: preserve text part timing in session processor (#21691) (Kit Langton, 2026-04-09)
- c29392d08 - fix: preserve interrupted bash output in tool results (#21598) (Kit Langton, 2026-04-09)
- 4e4aa8ae5 - fix(vscode): reduce ESLint complexity by extracting suggestion handlers (Alex Alecu, 2026-04-09)
- 0e685ac69 - fix(cli): stop config protection from blocking skill file reads (Alex Alecu, 2026-04-09)
- 70fec1826 - Merge remote-tracking branch 'origin/main' into feat/suggest-code-review (Alex Alecu, 2026-04-09)
- db787a61d - fix(vscode): wire suggestions into drain, recovery, and clear paths (Alex Alecu, 2026-04-09)
- 46f243fea - app: remove min loading duration (#21655) (Brendan Allan, 2026-04-09)
- 847fc9d26 - release: v1.4.1 (opencode, 2026-04-09)
- 6996e0e47 - refactor(cli): move suggestion flow into kilocode modules (Alex Alecu, 2026-04-09)
- 489f57974 - feat: add opencode go upsell modal when limits are hit (#21583) (Aiden Cline, 2026-04-09)
- 3fc3974cb - chore: update nix node_modules hashes (opencode-agent[bot], 2026-04-09)
- ca5724824 - chore: generate (opencode-agent[bot], 2026-04-09)
- ee23043d6 - Remove CLI from electron app (#17803) (Brendan Allan, 2026-04-09)
- 9c1c061b8 - fix(lsp): remove CMakeLists.txt and Makefile from clangd root markers (#21466) (Cho HyeonJong, 2026-04-08)
- d82b163e5 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-04-09)
- cd8e8a992 - feat(llm): integrate GitLab DWS tool approval with permission system (#19955) (Vladimir Glafirov, 2026-04-08)
- 8bdcc2254 - refactor(effect): inline session processor interrupt cleanup (#21593) (Kit Langton, 2026-04-08)
- 2bdd27946 - fix: propagate abort signal to inline read tool (#21584) (Kit Langton, 2026-04-08)
- 51535d8ef - fix(app): skip url password setting for same-origin server and web app (#19923) (OpeOginni, 2026-04-09)
- 38f8714c0 - refactor(effect): build task tool from agent services (#21017) (Kit Langton, 2026-04-08)
- dc9c08f74 - fix(vscode): label custom provider reasoning variant fields (kiloconnect[bot], 2026-04-08)
- 07b29188d - Merge branch 'main' into session/agent_9864f1dc-ca7c-4243-877b-14d089b66f92 (Christiaan Arnoldus, 2026-04-09)
- 4961d72c0 - tweak: separate ModelsDev.Model and Config model schemas (#21561) (Aiden Cline, 2026-04-08)
- 00cb8839a - fix: dont show invalid variants for BP (#21555) (Aiden Cline, 2026-04-08)
- 689b1a4b3 - fix(app): diff list normalization (Adam, 2026-04-08)
- d98be3934 - fix(app): patch tool diff rendering (Adam, 2026-04-08)
- 039c60170 - fix: ensure that /providers list and shell endpoints are correctly typed in sdk and openapi schema (#21543) (Aiden Cline, 2026-04-08)
- cd87d4f9d - test: update webfetch test (#21398) (Aiden Cline, 2026-04-08)
- d219bf9d0 - Merge remote-tracking branch 'origin/main' into feat/suggest-code-review (Alex Alecu, 2026-04-08)
- 141008515 - fmt (Christiaan Arnoldus, 2026-04-08)
- 91dc831ff - Syntax tweaks (Christiaan Arnoldus, 2026-04-08)
- aa40e61d7 - Merge branch 'main' into session/agent_9864f1dc-ca7c-4243-877b-14d089b66f92 (Christiaan Arnoldus, 2026-04-08)
- 988c9894f - ui: fix sticky session diffs header (#21486) (Brendan Allan, 2026-04-08)
- ae614d919 - fix(tui): simplify console org display (#21339) (Kit Langton, 2026-04-07)
- 65cde7f49 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-04-08)
- 98325dcdc - release: v1.4.0 (opencode, 2026-04-08)
- 0788a535e - chore: generate (opencode-agent[bot], 2026-04-07)
- b7fab49b6 - refactor(snapshot): store unified patches in file diffs (#21244) (Dax, 2026-04-07)
- 463318486 - core: refactor tool system to remove agent context from initialization (#21052) (Dax, 2026-04-07)
- 7afb517a1 - go: glm5.1 (Frank, 2026-04-07)
- c58972472 - zen: glm5.1 doc (Frank, 2026-04-07)
- 938571437 - zen: glm5.1 doc (Frank, 2026-04-07)
- c90fc6a48 - feat(opencode): add OTLP observability support (#21387) (Dax, 2026-04-07)
- bc1840b19 - fix(opencode): clear webfetch timeouts on failed fetches (#21378) (Aiden Cline, 2026-04-07)
- 095aeba0a - test: disable GPG signing in test fixtures (#20386) (Kyle Altendorf, 2026-04-07)
- e945436b6 - feat(tui): allow variant_list keybind for the "Switch model variant" command (#21185) (Ariane Emory, 2026-04-07)
- 6bfa82de6 - chore: generate (opencode-agent[bot], 2026-04-07)
- d83fe4b54 - fix(opencode): improve console login transport errors (#21350) (Kit Langton, 2026-04-07)
- 3cf6d4f1f - fix(cli): restore early return for custom openai-compatible model variants (kiloconnect[bot], 2026-04-07)
- 4e06943b5 - fix(vscode): skip hidden variant validation/serialization; merge custom+auto variants (kiloconnect[bot], 2026-04-07)
- 81bdffc81 - fix: ensure the alibaba provider errors are retried (#21355) (Aiden Cline, 2026-04-07)
- f945ae26d - fix(vscode): fix reasoning toggle, add labels, add translations, gate variants on reasoning (kiloconnect[bot], 2026-04-07)
- 2549a38a7 - fix(tui): use sentence case for theme mode command palette items (#21192) (Ariane Emory, 2026-04-07)
- 5d48e7bd4 - refactor(core): support multiple event streams in worker and remove workspaces from plugin api (#21348) (James Long, 2026-04-07)
- 0d7934641 - feat(vscode): add variant configuration for custom provider models (kiloconnect[bot], 2026-04-07)
- ec8b9810b - feat(app): better subagent experience (#20708) (Adam, 2026-04-07)
- 65318a80f - chore: update web stats (Adam, 2026-04-07)
- 4b568ecf9 - feat(vscode): add reasoning flag toggle for custom provider models (kiloconnect[bot], 2026-04-07)
- 6a5aae9a8 - chore: generate (opencode-agent[bot], 2026-04-07)
- 1f94c48bd - fix(opencode): keep user message variants scoped to model (#21332) (Dax, 2026-04-07)
- 01c5eb679 - go: support coupon (Frank, 2026-04-07)
- 243c88e4d - Merge branch 'main' into docs/exec-approvals-allow-everything (Alex Gold, 2026-04-07)
- 8e5697bd5 - Remove todo (Alex Gold, 2026-04-07)
- a83aa1817 - Add image to PR (Alex Gold, 2026-04-07)
- b376032a8 - Add files via upload (Alex Gold, 2026-04-07)
- 41612b3db - Move auto-accept permissions to settings (#21308) (Shoubhit Dash, 2026-04-07)
- c2d2ca352 - style(app): redesign jump-to-bottom button per figma spec (#21313) (Shoubhit Dash, 2026-04-07)
- 3a1ec27fe - feat(app): show full names on composer attachment chips (#21306) (Shoubhit Dash, 2026-04-07)
- 3c96bf846 - feat(opencode): Add PDF attachment Drag and Drop (#16926) (gitpush-gitpaid, 2026-04-07)
- 3ea641340 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-04-07)
- 885df8eb5 - feat: add --dangerously-skip-permissions flag to opencode run (#21266) (Aiden Cline, 2026-04-06)
- f4975ef32 - go: add mimo (Frank, 2026-04-07)
- 37883a9f3 - refactor(core): add full http proxy and change workspace adaptor interface (#21239) (James Long, 2026-04-06)
- e01b807b5 - docs(kilo-docs): add Allow Everything setting info to exec approvals page (kiloconnect[bot], 2026-04-07)
- 3c31d0466 - chore: bump anthropic ai sdk pkg, delete patch (#21247) (Aiden Cline, 2026-04-06)
- e64548fb4 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-04-07)
- 31f6f43cf - chore: remove ai-sdk/provider-utils patch and update pkg (#21245) (Aiden Cline, 2026-04-06)
- 090ad8290 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-04-06)
- d1258ac19 - fix: bump openrouter ai sdk pkg to fix openrouter issues (#21242) (Aiden Cline, 2026-04-06)
- 48c1b6b33 - tweak: move the max token exclusions to plugins  @rekram1-node (#21225) (Aiden Cline, 2026-04-06)
- 40e4cd27a - tweak: adjust chat.params hook to allow altering of the maxOutputTokens (#21220) (Aiden Cline, 2026-04-06)
- 5a6d10cd5 - tweak: ensure copilot anthropic models have same reasoning effort model as copilot cli, also fix qwen incorrectly having variants (#21212) (Aiden Cline, 2026-04-06)
- 527b51477 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-04-06)
- 535343bf5 - refactor(server): replace Bun serve with Hono node adapters (#18335) (Dax, 2026-04-06)
- 4394e4261 - upgrade opentui to 0.1.97 (#21137) (Sebastian, 2026-04-06)
- 2e4c43c1c - refactor: replace Bun.serve with Node http.createServer in OAuth handlers (#18327) (Dax, 2026-04-06)
- 965c75152 - docs: update Cloudflare provider setup to reflect /connect prompt flow (#20589) (MC, 2026-04-06)
- 24bdd3c9f - chore: generate (opencode-agent[bot], 2026-04-06)
- 01f031919 - fix(lsp): MEMORY LEAK: ensure typescript server uses native project config (#19953) (Derek Barrera, 2026-04-06)
- 1c5850eb7 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-04-06)
- 98eb5577b - Merge remote-tracking branch 'origin/main' into feat/suggest-code-review (Alex Alecu, 2026-04-06)
- 07f367af1 - core: improve suggestion action prompt resolution to prevent deadlocks (Alex Alecu, 2026-04-06)
- 517e6c9aa - release: v1.3.17 (opencode, 2026-04-06)
- a4a9ea4ab - fix(tui): revert kitty keyboard events workaround on windows (#20180) (Luke Parker, 2026-04-06)
- eaa272ef7 - fix: show clear error when Cloudflare provider env vars are missing (#20399) (MC, 2026-04-06)
- 70b636a36 - zen: normalize ipv6 (Frank, 2026-04-06)
- a8fd0159b - zen: remove header check (Frank, 2026-04-05)
- 342436dfc - release: v1.3.16 (opencode, 2026-04-06)
- 77a462c93 - fix(tui): default Ctrl+Z to undo on Windows (#21138) (Luke Parker, 2026-04-06)
- 9965d385d - fix: pass both 'openai' and 'azure' providerOptions keys for @ai-sdk/azure (#20272) (Corné Steenhuis, 2026-04-06)
- f0f1e51c5 - fix(core): implement proper configOptions for acp (#21134) (George Harker, 2026-04-05)
- 4712c18a5 - feat(tui): make the mouse disablable (#6824, #7926) (#13748) (Gautier DI FOLCO, 2026-04-05)
- 9e156ea16 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-04-06)
- 68f4aa220 - fix(plugin): parse package specifiers with npm-package-arg and sanitize win32 cache paths (#21135) (Luke Parker, 2026-04-06)
- 3a0e00dd7 - tweak: add newline between <content> and first line of read tool output to prevent confusion (#21070) (Aiden Cline, 2026-04-05)
- 66b4e5e02 - doc: udpate doc (Frank, 2026-04-05)
- 8b8d4fa06 - test: add regression test for double counting bug (#21053) (Aiden Cline, 2026-04-04)
- 6253ef0c2 - chore: generate (opencode-agent[bot], 2026-04-04)
- c6ebc7ff7 - fix(tui): only show org switch affordances when useful (#21054) (Kit Langton, 2026-04-04)
- 985663620 - chore: generate (opencode-agent[bot], 2026-04-04)
- c796b9a19 - refactor(effect): move read tool onto defineEffect (#21016) (Kit Langton, 2026-04-04)
- 6ea108a03 - feat(tui): show console-managed providers (#20956) (Kit Langton, 2026-04-04)
- 280eb16e7 - fix: ensure reasoning tokens arent double counted when calculating usage (#21047) (Aiden Cline, 2026-04-04)
- 930e94a3e - release: v1.3.15 (opencode, 2026-04-04)
- 629e866ff - fix(npm): Arborist reify fails on compiled binary — Bun pre-resolves node-gyp path at build time (#21040) (Dax, 2026-04-04)
- c08fa5675 - refactor: remove redundant Kimi skill section (#20393) (Yuxin Dong, 2026-04-04)
- 46eae0f08 - feat: replace mechanical review-followup with dedicated suggest tool (Alex Alecu, 2026-04-04)
- b8b43f5cc - fix(cli): remove planning-context gate from review suggestion trigger (Alex Alecu, 2026-03-31)
- 5cd6c664a - Merge branch 'main' into feat/suggest-code-review (Marian Alexandru Alecu, 2026-03-31)
- 0ed86dacc - Merge branch 'main' into feat/suggest-code-review (Marian Alexandru Alecu, 2026-03-30)
- 9819f7d6d - fix(vscode): remove unused types and exclude bin/ from kilocode_change check (Alex Alecu, 2026-03-30)
- c8e79cd7c - Merge branch 'main' into feat/suggest-code-review (Marian Alexandru Alecu, 2026-03-30)
- df716c0d0 - fix(cli): disable path quoting for untracked diff (Alex Alecu, 2026-03-30)
- fe159fc7d - fix(cli): set KILO_CLIENT env in review test (Alex Alecu, 2026-03-30)
- c08ac125f - fix(cli): include untracked files in review diff (Alex Alecu, 2026-03-30)
- b3eb37870 - Merge remote-tracking branch 'origin/main' into feat/suggest-code-review (Alex Alecu, 2026-03-30)
- 6abedafb4 - Make review followup blocking in CLI with skip option, require planning context (Alex Alecu, 2026-03-09)
- 36dec7edc - Merge branch 'feat/suggest-code-review' of https://github.com/Kilo-Org/kilocode into feat/suggest-code-review (Alex Alecu, 2026-03-09)
- 97d0c65a7 - Merge branch 'main' into feat/suggest-code-review (Marian Alexandru Alecu, 2026-03-09)
- 93980b36e - Merge branch 'main' into feat/suggest-code-review (Marian Alexandru Alecu, 2026-03-06)
- be554c3ac - Merge branch 'main' into feat/suggest-code-review (Marian Alexandru Alecu, 2026-03-03)
- 2621d32fd - feat: Make review suggestion non-blocking (Alex Alecu, 2026-02-27)
- aaa41418d - feat: Suggest code review after implementation (Alex Alecu, 2026-02-26)
- 553a9b5f0 - fix: disable mouse tracking on Windows terminal exit (ashwinhegde19, 2026-02-23)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/registry.ts` (+46, -0)
- `packages/opencode/src/kilocode/tool/task.ts` (+38, -0)
- `packages/opencode/src/tool/apply_patch.ts` (+6, -3)
- `packages/opencode/src/tool/bash.ts` (+17, -15)
- `packages/opencode/src/tool/batch.ts` (+0, -183)
- `packages/opencode/src/tool/batch.txt` (+0, -24)
- `packages/opencode/src/tool/edit.ts` (+22, -11)
- `packages/opencode/src/tool/external-directory.ts` (+12, -3)
- `packages/opencode/src/tool/glob.ts` (+21, -2)
- `packages/opencode/src/tool/question.ts` (+1, -1)
- `packages/opencode/src/tool/read.ts` (+222, -188)
- `packages/opencode/src/tool/registry.ts` (+198, -179)
- `packages/opencode/src/tool/skill.ts` (+29, -14)
- `packages/opencode/src/tool/task.ts` (+158, -144)
- `packages/opencode/src/tool/task.txt` (+0, -3)
- `packages/opencode/src/tool/todo.ts` (+1, -1)
- `packages/opencode/src/tool/tool.ts` (+43, -18)
- `packages/opencode/src/tool/webfetch.ts` (+12, -8)
- `packages/opencode/src/tool/websearch.ts` (+20, -20)
- `packages/opencode/src/tool/write.ts` (+2, -0)
- `packages/opencode/test/tool/apply_patch.test.ts` (+6, -8)
- `packages/opencode/test/tool/glob.test.ts` (+47, -0)
- `packages/opencode/test/tool/read.test.ts` (+392, -470)
- `packages/opencode/test/tool/registry.test.ts` (+31, -0)
- `packages/opencode/test/tool/skill.test.ts` (+13, -10)
- `packages/opencode/test/tool/task.test.ts` (+408, -35)
- `packages/opencode/test/tool/tool-define.test.ts` (+0, -52)
- `packages/opencode/test/tool/webfetch.test.ts` (+15, -20)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+32, -17)

#### Permission System (**/permission/)
- `packages/opencode/src/kilocode/permission/config-paths.ts` (+6, -3)
- `packages/opencode/src/kilocode/permission/routes.ts` (+4, -0)
- `packages/opencode/test/kilocode/permission/config-paths.test.ts` (+175, -0)

#### Event Bus (**/bus/, **/event/)
- `packages/opencode/src/bus/global.ts` (+1, -0)

#### Core (**/core/)
(no changes)

#### Other Changes
- `.changeset/fix-provider-auth-invalidation.md` (+6, -0)
- `.changeset/gateway-models-feature-header.md` (+5, -0)
- `.changeset/git-stats-polling.md` (+5, -0)
- `.changeset/terminal-context-mention.md` (+5, -0)
- `.github/workflows/smoke-test.yml` (+120, -0)
- `.idea/gradle.xml` (+12, -0)
- `.kilo/run-script` (+1, -0)
- `AGENTS.md` (+6, -0)
- `bun.lock` (+178, -79)
- `nix/hashes.json` (+4, -4)
- `package.json` (+12, -12)
- `packages/app/e2e/actions.ts` (+1, -0)
- `packages/app/e2e/prompt/prompt-shell.spec.ts` (+9, -6)
- `packages/app/e2e/session/session-child-navigation.spec.ts` (+23, -6)
- `packages/app/e2e/session/session-composer-dock.spec.ts` (+10, -11)
- `packages/app/package.json` (+1, -1)
- `packages/app/script/e2e-local.ts` (+8, -9)
- `packages/app/src/app.tsx` (+0, -1)
- `packages/app/src/components/prompt-input.tsx` (+1, -38)
- `packages/app/src/components/prompt-input/image-attachments.tsx` (+30, -27)
- `packages/app/src/components/prompt-input/submit.test.ts` (+2, -3)
- `packages/app/src/components/prompt-input/submit.ts` (+1, -2)
- `packages/app/src/components/settings-general.tsx` (+39, -0)
- `packages/app/src/components/terminal.tsx` (+7, -2)
- `packages/app/src/context/global-sync/event-reducer.ts` (+5, -4)
- `packages/app/src/context/global-sync/session-cache.test.ts` (+3, -3)
- `packages/app/src/context/global-sync/session-cache.ts` (+2, -2)
- `packages/app/src/context/global-sync/types.ts` (+2, -2)
- `packages/app/src/context/local.tsx` (+3, -3)
- `packages/app/src/context/sync.tsx` (+4, -4)
- `packages/app/src/i18n/en.ts` (+2, -0)
- `packages/app/src/index.css` (+40, -0)
- `packages/app/src/pages/layout.tsx` (+0, -17)
- `packages/app/src/pages/layout/helpers.test.ts` (+14, -0)
- `packages/app/src/pages/layout/helpers.ts` (+10, -11)
- `packages/app/src/pages/layout/sidebar-items.tsx` (+92, -204)
- `packages/app/src/pages/layout/sidebar-project.tsx` (+5, -22)
- `packages/app/src/pages/layout/sidebar-workspace.tsx` (+2, -24)
- `packages/app/src/pages/session.tsx` (+51, -62)
- `packages/app/src/pages/session/composer/session-composer-region.tsx` (+49, -12)
- `packages/app/src/pages/session/message-timeline.tsx` (+265, -166)
- `packages/app/src/pages/session/review-tab.tsx` (+4, -2)
- `packages/app/src/pages/session/session-model-helpers.test.ts` (+5, -4)
- `packages/app/src/pages/session/session-side-panel.tsx` (+2, -2)
- `packages/app/src/utils/agent.ts` (+22, -1)
- `packages/app/src/utils/diffs.test.ts` (+74, -0)
- `packages/app/src/utils/diffs.ts` (+49, -0)
- `packages/desktop-electron/electron-builder.config.ts` (+0, -5)
- `packages/desktop-electron/electron.vite.config.ts` (+31, -0)
- `packages/desktop-electron/package.json` (+28, -9)
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
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/automate/agent-manager.md` (+52, -9)
- `packages/kilo-docs/pages/automate/mcp/using-in-kilo-code.md` (+219, -146)
- `packages/kilo-docs/pages/code-with-ai/agents/chat-interface.md` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/agents/context-mentions.md` (+23, -1)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli-reference.md` (+20, -19)
- `packages/kilo-docs/pages/contributing/architecture/index.md` (+6, -6)
- `packages/kilo-docs/pages/kiloclaw/control-ui/exec-approvals.md` (+10, -0)
- `packages/kilo-docs/pages/kiloclaw/development-tools/google.md` (+4, -2)
- `packages/kilo-docs/pages/kiloclaw/end-to-end.md` (+6, -0)
- `packages/kilo-docs/pages/kiloclaw/suggested-configuration.md` (+0, -171)
- `packages/kilo-docs/previous-docs-redirects.js` (+10, -0)
- `packages/kilo-docs/public/img/kiloclaw/allow-everything-settings.png` (+-, --)
- `packages/kilo-docs/source-links.md` (+7, -4)
- `packages/kilo-gateway/package.json` (+2, -2)
- `packages/kilo-gateway/src/api/models.ts` (+2, -1)
- `packages/kilo-gateway/src/server/routes.ts` (+2, -0)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-jetbrains/AGENTS.md` (+413, -13)
- `packages/kilo-jetbrains/README.md` (+5, -3)
- `packages/kilo-jetbrains/backend/build.gradle.kts` (+44, -76)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/CliServer.kt` (+20, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloAppState.kt` (+51, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendAppService.kt` (+458, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendCliManager.kt` (+331, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/{server/KiloConnectionService.kt => backend/app/KiloBackendConnectionService.kt}` (+88, -69)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendSessionManager.kt` (+188, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloAppRpcApiImpl.kt` (+82, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloAppRpcApiProvider.kt` (+15, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloProjectRpcApiImpl.kt` (+156, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/{ => backend}/rpc/KiloProjectRpcApiProvider.kt` (+2, -1)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloSessionRpcApiImpl.kt` (+55, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloSessionRpcApiProvider.kt` (+15, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/{server/KiloHttpClients.kt => backend/util/KiloBackendHttpClients.kt}` (+2, -2)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/util/KiloLog.kt` (+20, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/workspace/KiloBackendProjectService.kt` (+27, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/workspace/KiloBackendWorkspace.kt` (+299, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/workspace/KiloBackendWorkspaceManager.kt` (+73, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/workspace/KiloWorkspaceState.kt` (+86, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/rpc/KiloProjectRpcApiImpl.kt` (+0, -42)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/server/KiloProjectService.kt` (+0, -80)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/server/ServerManager.kt` (+0, -298)
- `packages/kilo-jetbrains/backend/src/main/resources/kilo.jetbrains.backend.xml` (+3, -1)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/ApiModelSerializationTest.kt` (+164, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/KiloAppStateTest.kt` (+97, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/KiloBackendAppServiceTest.kt` (+329, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/KiloBackendHttpClientsTest.kt` (+101, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/KiloBackendSessionManagerTest.kt` (+337, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/KiloBackendWorkspaceTest.kt` (+506, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/KiloConnectionServiceTest.kt` (+221, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/ProjectModelSerializationTest.kt` (+250, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/SessionModelSerializationTest.kt` (+165, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/FakeCliServer.kt` (+33, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/MockCliServer.kt` (+246, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/TestLog.kt` (+27, -0)
- `packages/kilo-jetbrains/build-tasks/build.gradle.kts` (+16, -0)
- `packages/kilo-jetbrains/build-tasks/settings.gradle.kts` (+1, -0)
- `packages/kilo-jetbrains/build-tasks/src/main/kotlin/BuildTasksPlugin.kt` (+13, -0)
- `packages/kilo-jetbrains/build-tasks/src/main/kotlin/CheckCliTask.kt` (+53, -0)
- `packages/kilo-jetbrains/build-tasks/src/main/kotlin/FixGeneratedApiTask.kt` (+202, -0)
- `packages/kilo-jetbrains/build-tasks/src/main/kotlin/PrepareLocalCliTask.kt` (+74, -0)
- `packages/kilo-jetbrains/build.gradle.kts` (+18, -0)
- `packages/kilo-jetbrains/detekt.yml` (+30, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/KiloToolWindowFactory.kt` (+0, -65)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/actions/ReinstallKiloAction.kt` (+0, -18)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/actions/RestartKiloAction.kt` (+0, -18)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/{KiloApiService.kt => client/KiloAppService.kt}` (+38, -50)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/KiloProjectService.kt` (+57, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/KiloSessionService.kt` (+115, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/KiloToolWindowFactory.kt` (+44, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/KiloWelcomeUi.kt` (+338, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/{ => client}/actions/KiloSettingsAction.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/ReinstallKiloAction.kt` (+18, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/RestartKiloAction.kt` (+18, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/{ => client}/actions/StatusInfoAction.kt` (+10, -9)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/{ => client/plugin}/KiloBundle.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/kilo.jetbrains.frontend.xml` (+5, -5)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+6, -0)
- `packages/kilo-jetbrains/gradle/libs.versions.toml` (+7, -5)
- `packages/kilo-jetbrains/script/build.ts` (+7, -3)
- `packages/kilo-jetbrains/settings.gradle.kts` (+1, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloAppRpcApi.kt` (+39, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloProjectRpcApi.kt` (+9, -21)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloSessionRpcApi.kt` (+48, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/AgentDto.kt` (+22, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/CommandDto.kt` (+11, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/ConnectionStateDto.kt` (+0, -17)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/KiloAppStateDto.kt` (+41, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/KiloWorkspaceStateDto.kt` (+30, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/ProviderDto.kt` (+30, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/SessionDto.kt` (+41, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/SkillDto.kt` (+10, -0)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+2, -1)
- `packages/kilo-ui/src/components/basic-tool.css` (+1, -0)
- `packages/kilo-ui/src/components/diff.tsx` (+10, -0)
- `packages/kilo-ui/src/components/message-part.tsx` (+3, -3)
- `packages/kilo-ui/src/components/session-diff.ts` (+1, -0)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-basictool/no-children-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-messagepart/assistant-message-story-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-messagepart/full-conversation-turn-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-messagepart/with-context-group-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/package.json` (+2, -2)
- `packages/kilo-vscode/script/launch.ts` (+9, -2)
- `packages/kilo-vscode/src/DiffViewerProvider.ts` (+0, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+55, -12)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+48, -0)
- `packages/kilo-vscode/src/agent-manager/GitOps.ts` (+63, -6)
- `packages/kilo-vscode/src/agent-manager/GitStatsPoller.ts` (+30, -15)
- `packages/kilo-vscode/src/agent-manager/WorktreeStateManager.ts` (+9, -0)
- `packages/kilo-vscode/src/agent-manager/host.ts` (+4, -0)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+21, -4)
- `packages/kilo-vscode/src/agent-manager/vscode-host.ts` (+1, -0)
- `packages/kilo-vscode/src/kilo-provider-utils.ts` (+16, -5)
- `packages/kilo-vscode/src/kilo-provider/followup-session.ts` (+1, -4)
- `packages/kilo-vscode/src/kilo-provider/handlers/cloud-session.ts` (+10, -3)
- `packages/kilo-vscode/src/kilo-provider/message-files.ts` (+13, -0)
- `packages/kilo-vscode/src/legacy-migration/sessions/lib/parts/parts-util.ts` (+11, -11)
- `packages/kilo-vscode/src/review-utils.ts` (+3, -3)
- `packages/kilo-vscode/src/services/cli-backend/connection-service.ts` (+11, -0)
- `packages/kilo-vscode/src/services/code-actions/register-terminal-actions.ts` (+4, -49)
- `packages/kilo-vscode/src/services/terminal/context.ts` (+39, -0)
- `packages/kilo-vscode/src/services/terminal/truncate.ts` (+39, -0)
- `packages/kilo-vscode/src/shared/custom-provider.ts` (+20, -2)
- `packages/kilo-vscode/tests/unit/agent-manager-diff-state.test.ts` (+12, -5)
- `packages/kilo-vscode/tests/unit/file-mention-utils.test.ts` (+23, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-followup.test.ts` (+33, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-session-refresh.test.ts` (+144, -0)
- `packages/kilo-vscode/tests/unit/message-files.test.ts` (+26, -0)
- `packages/kilo-vscode/tests/unit/terminal-architecture.test.ts` (+41, -0)
- `packages/kilo-vscode/tests/unit/terminal-context-utils.test.ts` (+26, -0)
- `packages/kilo-vscode/tests/unit/terminal-truncate.test.ts` (+24, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/agentmanager/tab-bar-multiple-tabs-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/agentmanager/tab-bar-single-tab-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/agentmanager/tab-bar-with-review-tab-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/composite-webview/diff-summary-collapsed-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+24, -24)
- `packages/kilo-vscode/webview-ui/agent-manager/DiffPanel.tsx` (+16, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/FullScreenDiffView.tsx` (+16, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+11, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/diff-state.ts` (+35, -4)
- `packages/kilo-vscode/webview-ui/diff-virtual/DiffVirtualApp.tsx` (+19, -6)
- `packages/kilo-vscode/webview-ui/src/components/chat/ChatView.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+8, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/PermissionDiff.tsx` (+16, -4)
- `packages/kilo-vscode/webview-ui/src/components/chat/PermissionDock.tsx` (+6, -2)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+41, -14)
- `packages/kilo-vscode/webview-ui/src/components/chat/QuestionDock.tsx` (+9, -2)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskToolExpanded.tsx` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/VscodeSessionTurn.tsx` (+12, -11)
- `packages/kilo-vscode/webview-ui/src/components/settings/AgentBehaviourTab.tsx` (+4, -2)
- `packages/kilo-vscode/webview-ui/src/components/settings/CommitMessageTab.tsx` (+60, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/CustomProviderDialog.tsx` (+107, -54)
- `packages/kilo-vscode/webview-ui/src/components/settings/CustomProviderModelCard.tsx` (+290, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/Settings.tsx` (+9, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/settings-io.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/components/shared/PopupSelector.tsx` (+2, -4)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+7, -2)
- `packages/kilo-vscode/webview-ui/src/hooks/file-mention-utils.ts` (+22, -0)
- `packages/kilo-vscode/webview-ui/src/hooks/terminal-context-utils.ts` (+42, -0)
- `packages/kilo-vscode/webview-ui/src/hooks/useFileMention.ts` (+24, -20)
- `packages/kilo-vscode/webview-ui/src/hooks/useImageAttachments.ts` (+4, -3)
- `packages/kilo-vscode/webview-ui/src/hooks/useTerminalContext.ts` (+81, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+34, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+34, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+34, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+34, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/stories/agent-manager.stories.tsx` (+129, -1)
- `packages/kilo-vscode/webview-ui/src/stories/composite.stories.tsx` (+71, -0)
- `packages/kilo-vscode/webview-ui/src/styles/chat-layout.css` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages.ts` (+41, -0)
- `packages/kilo-vscode/webview-ui/src/utils/path-mentions.ts` (+19, -5)
- `packages/opencode/package.json` (+18, -7)
- `packages/opencode/script/build-node.ts` (+8, -2)
- `packages/opencode/script/build.ts` (+3, -15)
- `packages/opencode/script/fix-node-pty.ts` (+28, -0)
- `packages/opencode/script/generate.ts` (+23, -0)
- `packages/opencode/specs/effect-migration.md` (+17, -1)
- `packages/opencode/specs/{v2.md => v2/keymappings.md}` (+1, -5)
- `packages/opencode/specs/v2/message-shape.md` (+136, -0)
- `packages/opencode/src/account/index.ts` (+68, -21)
- `packages/opencode/src/account/repo.ts` (+5, -2)
- `packages/opencode/src/account/schema.ts` (+29, -1)
- `packages/opencode/src/account/url.ts` (+8, -0)
- `packages/opencode/src/acp/agent.ts` (+84, -0)
- `packages/opencode/src/auth/index.ts` (+1, -0)
- `packages/opencode/src/cli/cmd/acp.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/db.ts` (+2, -1)
- `packages/opencode/src/cli/cmd/debug/agent.ts` (+4, -1)
- `packages/opencode/src/cli/cmd/mcp.ts` (+1, -0)
- `packages/opencode/src/cli/cmd/run.ts` (+24, -22)
- `packages/opencode/src/cli/cmd/serve.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/app.tsx` (+152, -9)
- `packages/opencode/src/cli/cmd/tui/component/dialog-console-org.tsx` (+103, -0)
- `packages/opencode/src/cli/cmd/tui/component/dialog-go-upsell.tsx` (+99, -0)
- `packages/opencode/src/cli/cmd/tui/component/dialog-model.tsx` (+5, -1)
- `packages/opencode/src/cli/cmd/tui/component/dialog-provider.tsx` (+108, -111)
- `packages/opencode/src/cli/cmd/tui/component/prompt/index.tsx` (+46, -36)
- `packages/opencode/src/cli/cmd/tui/context/exit.tsx` (+2, -0)
- `packages/opencode/src/cli/cmd/tui/context/sdk.tsx` (+3, -16)
- `packages/opencode/src/cli/cmd/tui/context/sync.tsx` (+17, -9)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/home/tips-view.tsx` (+4, -2)
- `packages/opencode/src/cli/cmd/tui/plugin/api.tsx` (+2, -35)
- `packages/opencode/src/cli/cmd/tui/plugin/internal.ts` (+2, -0)
- `packages/opencode/src/cli/cmd/tui/plugin/runtime.ts` (+0, -2)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+48, -13)
- `packages/opencode/src/cli/cmd/tui/routes/session/question.tsx` (+2, -0)
- `packages/opencode/src/cli/cmd/tui/routes/session/usage.ts` (+26, -0)
- `packages/opencode/src/cli/cmd/tui/thread.ts` (+12, -3)
- `packages/opencode/src/cli/cmd/tui/ui/dialog-select.tsx` (+11, -3)
- `packages/opencode/src/cli/cmd/tui/util/provider-origin.ts` (+7, -0)
- `packages/opencode/src/cli/cmd/tui/util/terminal.ts` (+24, -0)
- `packages/opencode/src/cli/cmd/tui/worker.ts` (+35, -15)
- `packages/opencode/src/cli/cmd/web.ts` (+1, -1)
- `packages/opencode/src/cli/error.ts` (+4, -0)
- `packages/opencode/src/config/config.ts` (+122, -34)
- `packages/opencode/src/config/console-state.ts` (+15, -0)
- `packages/opencode/src/config/tui-schema.ts` (+1, -0)
- `packages/opencode/src/config/tui.ts` (+9, -1)
- `packages/opencode/src/control-plane/adaptors/worktree.ts` (+6, -2)
- `packages/opencode/src/control-plane/types.ts` (+13, -2)
- `packages/opencode/src/control-plane/workspace.ts` (+16, -2)
- `packages/opencode/src/effect/cross-spawn-spawner.ts` (+0, -1)
- `packages/opencode/src/effect/instance-state.ts` (+0, -6)
- `packages/opencode/src/effect/oltp.ts` (+34, -0)
- `packages/opencode/src/effect/run-service.ts` (+2, -1)
- `packages/opencode/src/effect/runner.ts` (+6, -14)
- `packages/opencode/src/file/time.ts` (+1, -1)
- `packages/opencode/src/filesystem/index.ts` (+12, -2)
- `packages/opencode/src/flag/flag.ts` (+4, -0)
- `packages/opencode/src/git/index.ts` (+0, -32)
- `packages/opencode/src/index.ts` (+2, -1)
- `packages/opencode/src/kilo-sessions/ingest-queue.ts` (+1, -1)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+2, -1)
- `packages/opencode/src/kilocode/cli/cmd/tui/component/dialog-provider.tsx` (+93, -0)
- `packages/opencode/src/{ => kilocode}/commit-message/generate.ts` (+1, -1)
- `packages/opencode/src/{ => kilocode}/commit-message/git-context.ts` (+0, -0)
- `packages/opencode/src/{ => kilocode}/commit-message/index.ts` (+0, -0)
- `packages/opencode/src/{ => kilocode}/commit-message/types.ts` (+2, -0)
- `packages/opencode/src/kilocode/config-validation.ts` (+158, -0)
- `packages/opencode/src/kilocode/config/config.ts` (+18, -2)
- `packages/opencode/src/kilocode/plan-followup.ts` (+3, -14)
- `packages/opencode/src/kilocode/plugins/sidebar-usage.tsx` (+57, -0)
- `packages/opencode/src/kilocode/provider/provider.ts` (+7, -0)
- `packages/opencode/src/kilocode/review/worktree-diff.ts` (+5, -0)
- `packages/opencode/src/kilocode/server/instance.ts` (+1, -1)
- `packages/opencode/src/{ => kilocode}/server/routes/commit-message.ts` (+6, -3)
- `packages/opencode/src/kilocode/server/server.ts` (+4, -2)
- `packages/opencode/src/kilocode/session/fork.ts` (+66, -0)
- `packages/opencode/src/kilocode/session/index.ts` (+27, -1)
- `packages/opencode/src/kilocode/session/prompt.ts` (+21, -0)
- `packages/opencode/src/lsp/index.ts` (+1, -1)
- `packages/opencode/src/lsp/server.ts` (+12, -2)
- `packages/opencode/src/mcp/index.ts` (+8, -6)
- `packages/opencode/src/mcp/oauth-callback.ts` (+100, -83)
- `packages/opencode/src/mcp/oauth-provider.ts` (+23, -0)
- `packages/opencode/src/node.ts` (+5, -0)
- `packages/opencode/src/npm/index.ts` (+9, -1)
- `packages/opencode/src/plugin/cloudflare.ts` (+67, -0)
- `packages/opencode/src/plugin/codex.ts` (+69, -57)
- `packages/opencode/src/plugin/github-copilot/copilot.ts` (+8, -0)
- `packages/opencode/src/plugin/index.ts` (+6, -2)
- `packages/opencode/src/plugin/shared.ts` (+22, -6)
- `packages/opencode/src/project/project.ts` (+1, -1)
- `packages/opencode/src/project/vcs.ts` (+49, -37)
- `packages/opencode/src/provider/auth.ts` (+2, -0)
- `packages/opencode/src/provider/models-snapshot.d.ts` (+0, -2)
- `packages/opencode/src/provider/models-snapshot.js` (+0, -3)
- `packages/opencode/src/provider/models.ts` (+40, -20)
- `packages/opencode/src/provider/provider.ts` (+85, -30)
- `packages/opencode/src/provider/transform.ts` (+15, -51)
- `packages/opencode/src/pty/index.ts` (+13, -21)
- `packages/opencode/src/pty/pty.bun.ts` (+26, -0)
- `packages/opencode/src/pty/pty.node.ts` (+27, -0)
- `packages/opencode/src/pty/pty.ts` (+25, -0)
- `packages/opencode/src/server/instance.ts` (+43, -12)
- `packages/opencode/src/server/proxy.ts` (+137, -0)
- `packages/opencode/src/server/router.ts` (+68, -62)
- `packages/opencode/src/server/routes/event.ts` (+14, -1)
- `packages/opencode/src/server/routes/experimental.ts` (+110, -2)
- `packages/opencode/src/server/routes/global.ts` (+14, -1)
- `packages/opencode/src/server/routes/provider.ts` (+1, -1)
- `packages/opencode/src/server/routes/pty.ts` (+6, -7)
- `packages/opencode/src/server/routes/session.ts` (+29, -16)
- `packages/opencode/src/server/server.ts` (+97, -51)
- `packages/opencode/src/session/compaction.ts` (+16, -30)
- `packages/opencode/src/session/index.ts` (+42, -58)
- `packages/opencode/src/session/llm.ts` (+66, -9)
- `packages/opencode/src/session/message-v2.ts` (+40, -20)
- `packages/opencode/src/session/processor.ts` (+169, -76)
- `packages/opencode/src/session/prompt.ts` (+192, -241)
- `packages/opencode/src/session/prompt/kimi.txt` (+0, -19)
- `packages/opencode/src/session/retry.ts` (+17, -0)
- `packages/opencode/src/session/revert.ts` (+7, -3)
- `packages/opencode/src/session/run-state.ts` (+120, -0)
- `packages/opencode/src/session/status.ts` (+1, -1)
- `packages/opencode/src/session/summary.ts` (+2, -5)
- `packages/opencode/src/session/system.ts` (+17, -0)
- `packages/opencode/src/session/todo.ts` (+6, -4)
- `packages/opencode/src/share/share-next.ts` (+1, -1)
- `packages/opencode/src/shell/shell.ts` (+3, -3)
- `packages/opencode/src/skill/index.ts` (+25, -9)
- `packages/opencode/src/snapshot/index.ts` (+6, -9)
- `packages/opencode/src/storage/json-migration.ts` (+10, -10)
- `packages/opencode/test/account/repo.test.ts` (+26, -0)
- `packages/opencode/test/account/service.test.ts` (+65, -2)
- `packages/opencode/test/cli/error.test.ts` (+18, -0)
- `packages/opencode/test/cli/tui/theme-store.test.ts` (+3, -2)
- `packages/opencode/test/cli/tui/usage.test.ts` (+61, -0)
- `packages/opencode/test/config/config.test.ts` (+16, -0)
- `packages/opencode/test/config/tui.test.ts` (+48, -0)
- `packages/opencode/test/effect/runner.test.ts` (+14, -42)
- `packages/opencode/test/file/index.test.ts` (+7, -7)
- `packages/opencode/test/fixture/fixture.ts` (+2, -0)
- `packages/opencode/test/fixture/tui-plugin.ts` (+0, -9)
- `packages/opencode/test/kilocode/agent-global-config-dirs.test.ts` (+25, -0)
- `packages/opencode/test/kilocode/builtin-skills.test.ts` (+75, -0)
- `packages/opencode/test/kilocode/commit-message-windows.test.ts` (+1, -1)
- `packages/opencode/{src/commit-message/__tests__ => test/kilocode/commit-message}/generate.test.ts` (+46, -37)
- `packages/opencode/{src/commit-message/__tests__ => test/kilocode/commit-message}/git-context.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/config-validation.test.ts` (+184, -0)
- `packages/opencode/test/kilocode/plan-followup.test.ts` (+6, -12)
- `packages/opencode/test/{ => kilocode}/server/permission-allow-everything.test.ts` (+54, -7)
- `packages/opencode/test/kilocode/session-fork-remap.test.ts` (+251, -0)
- `packages/opencode/test/kilocode/session-list.test.ts` (+46, -0)
- `packages/opencode/test/kilocode/session-processor-empty-tool-calls.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/system-prompt.test.ts` (+70, -0)
- `packages/opencode/test/lsp/index.test.ts` (+78, -0)
- `packages/opencode/test/mcp/oauth-callback.test.ts` (+34, -0)
- `packages/opencode/test/memory/abort-leak.test.ts` (+9, -4)
- `packages/opencode/test/npm.test.ts` (+18, -0)
- `packages/opencode/test/plugin/shared.test.ts` (+88, -0)
- `packages/opencode/test/project/migrate-global.test.ts` (+1, -0)
- `packages/opencode/test/provider/provider.test.ts` (+68, -0)
- `packages/opencode/test/server/experimental-session-list.test.ts` (+66, -2)
- `packages/opencode/test/server/project-init-git.test.ts` (+2, -2)
- `packages/opencode/test/server/session-actions.test.ts` (+4, -3)
- `packages/opencode/test/server/session-messages.test.ts` (+4, -4)
- `packages/opencode/test/server/session-select.test.ts` (+3, -3)
- `packages/opencode/test/session/compaction.test.ts` (+31, -13)
- `packages/opencode/test/session/llm.test.ts` (+9, -14)
- `packages/opencode/test/session/message-v2.test.ts` (+75, -0)
- `packages/opencode/test/session/processor-effect.test.ts` (+89, -7)
- `packages/opencode/test/session/prompt-effect.test.ts` (+320, -69)
- `packages/opencode/test/session/prompt.test.ts` (+8, -4)
- `packages/opencode/test/session/retry.test.ts` (+19, -0)
- `packages/opencode/test/session/snapshot-tool-race.test.ts` (+3, -0)
- `packages/opencode/test/share/share-next.test.ts` (+7, -8)
- `packages/opencode/test/skill/skill.test.ts` (+9, -9)
- `packages/opencode/test/snapshot/snapshot.test.ts` (+15, -22)
- `packages/opencode/test/storage/json-migration.test.ts` (+30, -47)
- `packages/plugin/package.json` (+5, -5)
- `packages/plugin/src/index.ts` (+7, -1)
- `packages/plugin/src/tui.ts` (+0, -2)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/client.ts` (+2, -1)
- `packages/sdk/js/src/v2/data.ts` (+32, -0)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+130, -21)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+294, -261)
- `packages/sdk/js/src/v2/index.ts` (+2, -0)
- `packages/sdk/openapi.json` (+748, -734)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+2, -1)
- `packages/ui/src/components/apply-patch-file.test.ts` (+43, -0)
- `packages/ui/src/components/apply-patch-file.ts` (+78, -0)
- `packages/ui/src/components/basic-tool.css` (+92, -0)
- `packages/ui/src/components/basic-tool.tsx` (+91, -61)
- `packages/ui/src/components/collapsible.css` (+5, -0)
- `packages/ui/src/components/file-media.tsx` (+2, -0)
- `packages/ui/src/components/file-ssr.tsx` (+26, -11)
- `packages/ui/src/components/file.tsx` (+38, -6)
- `packages/ui/src/components/message-part.tsx` (+129, -62)
- `packages/ui/src/components/provider-icons/sprite.svg` (+0, -58)
- `packages/ui/src/components/provider-icons/types.ts` (+0, -6)
- `packages/ui/src/components/session-diff.test.ts` (+37, -0)
- `packages/ui/src/components/session-diff.ts` (+83, -0)
- `packages/ui/src/components/session-review.tsx` (+38, -22)
- `packages/ui/src/components/session-turn.css` (+7, -1)
- `packages/ui/src/components/session-turn.tsx` (+13, -11)
- `packages/ui/src/context/data.tsx` (+6, -2)
- `packages/ui/src/pierre/index.ts` (+1, -1)
- `packages/util/package.json` (+1, -1)
- `patches/@ai-sdk%2Fanthropic@3.0.64.patch` (+0, -119)
- `patches/@ai-sdk%2Fprovider-utils@4.0.21.patch` (+0, -61)
- `script/upstream/package.json` (+1, -1)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/opencode/src/agent/agent.ts
```diff
diff --git a/packages/opencode/src/agent/agent.ts b/packages/opencode/src/agent/agent.ts
index 48b87aa95..d967031ed 100644
--- a/packages/opencode/src/agent/agent.ts
+++ b/packages/opencode/src/agent/agent.ts
@@ -15,8 +15,9 @@ import PROMPT_SUMMARY from "./prompt/summary.txt"
 import PROMPT_TITLE from "./prompt/title.txt"
 import { Permission } from "@/permission"
 import { mergeDeep, pipe, sortBy, values } from "remeda"
-import { Global } from "@/global"
-import path from "path"
+import { Global } from "@/global" // kilocode_change
+import { KilocodePaths } from "@/kilocode/paths" // kilocode_change
+import path from "path" // kilocode_change
 import { Plugin } from "@/plugin"
 import { Skill } from "../skill"
 import { Effect, ServiceMap, Layer } from "effect"
@@ -84,7 +85,14 @@ export namespace Agent {
         Effect.fn("Agent.state")(function* (ctx) {
           const cfg = yield* config.get()
           const skillDirs = yield* skill.dirs()
-          const whitelistedDirs = [Truncate.GLOB, ...skillDirs.map((dir) => path.join(dir, "*"))]
+          // kilocode_change start - include global config dirs so agents can read them without prompting
+          const whitelistedDirs = [
+            Truncate.GLOB,
+            ...skillDirs.map((dir) => path.join(dir, "*")),
+            path.join(Global.Path.config, "*"),
+            ...KilocodePaths.globalDirs().map((dir) => path.join(dir, "*")),
+          ]
+          // kilocode_change end
 
           const baseDefaults = Permission.fromConfig({
             // kilocode_change: renamed from defaults
@@ -363,18 +371,24 @@ export namespace Agent {
           )
           const existing = yield* InstanceState.useEffect(state, (s) => s.list())
 
+          // TODO: clean this up so provider specific logic doesnt bleed over
+          const authInfo = yield* auth.get(model.providerID).pipe(Effect.orDie)
+          const isOpenaiOauth = model.providerID === "openai" && authInfo?.type === "oauth"
+
           const params = {
             // kilocode_change start - enable telemetry with custom PostHog tracer
             experimental_telemetry: KiloAgent.telemetryOptions(cfg),
             // kilocode_change end
             temperature: 0.3,
             messages: [
-              ...system.map(
-                (item): ModelMessage => ({
-                  role: "system",
-                  content: item,
```

#### packages/opencode/src/bus/global.ts
```diff
diff --git a/packages/opencode/src/bus/global.ts b/packages/opencode/src/bus/global.ts
index 43386dd6b..dc23020d2 100644
--- a/packages/opencode/src/bus/global.ts
+++ b/packages/opencode/src/bus/global.ts
@@ -8,3 +8,4 @@ export const GlobalBus = new EventEmitter<{
     },
   ]
 }>()
+GlobalBus.setMaxListeners(50) // kilocode_change — surface warning if SSE listeners accumulate
```

#### packages/opencode/src/kilocode/permission/config-paths.ts
```diff
diff --git a/packages/opencode/src/kilocode/permission/config-paths.ts b/packages/opencode/src/kilocode/permission/config-paths.ts
index facd70987..885d93419 100644
--- a/packages/opencode/src/kilocode/permission/config-paths.ts
+++ b/packages/opencode/src/kilocode/permission/config-paths.ts
@@ -80,18 +80,21 @@ export namespace ConfigProtection {
 
   /**
    * Determine if a permission request targets config files.
-   * Checks `edit` and `external_directory` permissions — read access is not restricted.
+   * Gates `edit` permissions and bash-originated `external_directory` requests.
+   * File-tool reads are not restricted.
    */
   export function isRequest(request: {
     permission: string
     patterns: string[]
     metadata?: Record<string, any>
   }): boolean {
-    // external_directory patterns are absolute globs like "/Users/alex/.config/kilo/*"
     if (request.permission === "external_directory") {
+      // File tools include metadata.filepath. They may read global config
+      // without prompting, but edits are still protected separately via `edit`.
+      if (request.metadata?.filepath) return false
       for (const pattern of request.patterns) {
         const dir = pattern.replace(/\/\*$/, "")
-        if (isAbsolute(dir)) return true
+        if (path.isAbsolute(dir) && isAbsolute(dir)) return true
       }
       return false
     }
```

#### packages/opencode/src/kilocode/permission/routes.ts
```diff
diff --git a/packages/opencode/src/kilocode/permission/routes.ts b/packages/opencode/src/kilocode/permission/routes.ts
index ae68d4a38..dc732f949 100644
--- a/packages/opencode/src/kilocode/permission/routes.ts
+++ b/packages/opencode/src/kilocode/permission/routes.ts
@@ -1,10 +1,12 @@
 import { Hono } from "hono"
 import { describeRoute, resolver, validator } from "hono-openapi"
 import z from "zod"
+import { Bus } from "@/bus"
 import { Config } from "@/config/config"
 import { Permission } from "@/permission"
 import { Session } from "@/session"
 import { SessionID } from "@/session/schema" // kilocode_change
+import { Event } from "../../server/event"
 import { errors } from "../../server/error"
 import { lazy } from "../../util/lazy"
 
@@ -54,6 +56,7 @@ export const PermissionKilocodeRoutes = lazy(() =>
 
         await Config.updateGlobal({ permission: { "*": { "*": null } } }, { dispose: false })
         await Permission.allowEverything({ enable: false })
+        await Bus.publish(Event.ConfigUpdated, {})
         return c.json(true)
       }
 
@@ -65,6 +68,7 @@ export const PermissionKilocodeRoutes = lazy(() =>
         })
       } else {
         await Config.updateGlobal({ permission: Permission.toConfig(rules) }, { dispose: false })
+        await Bus.publish(Event.ConfigUpdated, {})
       }
 
       await Permission.allowEverything({
```

#### packages/opencode/src/kilocode/tool/registry.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/registry.ts b/packages/opencode/src/kilocode/tool/registry.ts
new file mode 100644
index 000000000..f868f5812
--- /dev/null
+++ b/packages/opencode/src/kilocode/tool/registry.ts
@@ -0,0 +1,46 @@
+// kilocode_change - new file
+import { CodebaseSearchTool } from "../../tool/warpgrep"
+import { RecallTool } from "../../tool/recall"
+import { Tool } from "../../tool/tool"
+import { Flag } from "@/flag/flag"
+import { ProviderID } from "../../provider/schema"
+import { Env } from "../../env"
+import { Effect } from "effect"
+
+export namespace KiloToolRegistry {
+  /** Build Kilo-specific tools (CodebaseSearch, Recall) as Tool.Def */
+  export function build() {
+    return Effect.all({
+      codebase: Tool.init(CodebaseSearchTool),
+      recall: Tool.init(RecallTool),
+    })
+  }
+
+  /** Override question-tool client gating (adds "vscode" to allowed clients) */
+  export function question(): boolean {
+    return ["app", "cli", "desktop", "vscode"].includes(Flag.KILO_CLIENT) || Flag.KILO_ENABLE_QUESTION_TOOL
+  }
+
+  /** Plan tool is always registered in Kilo (gated by agent permission instead) */
+  export function plan(): boolean {
+    return true
+  }
+
+  /** Kilo-specific tools to append to the builtin list */
+  export function extra(
+    tools: { codebase: Tool.Def; recall: Tool.Def },
+    cfg: { experimental?: { codebase_search?: boolean } },
+  ): Tool.Def[] {
+    return [...(cfg.experimental?.codebase_search === true ? [tools.codebase] : []), tools.recall]
+  }
+
+  /** Check whether exa-based tools (codesearch/websearch) are enabled for a provider */
+  export function exa(providerID: ProviderID): boolean {
+    return providerID === ProviderID.kilo || Flag.KILO_ENABLE_EXA
+  }
+
+  /** Check for E2E LLM URL (uses KILO_E2E_LLM_URL env var) */
+  export function e2e(): boolean {
+    return !!Env.get("KILO_E2E_LLM_URL")
```


*... and more files (showing first 5)*

## opencode Changes (7cbe162..7341718)

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

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/agent.ts
- `src/permission/` - review permission changes from packages/opencode/src/kilocode/permission/config-paths.ts
- `src/permission/` - review permission changes from packages/opencode/src/kilocode/permission/routes.ts
- `src/permission/` - review permission changes from packages/opencode/test/kilocode/permission/config-paths.test.ts
- `src/tool/apply_patch.test.ts` - update based on kilocode packages/opencode/test/tool/apply_patch.test.ts changes
- `src/tool/apply_patch.ts` - update based on kilocode packages/opencode/src/tool/apply_patch.ts changes
- `src/tool/bash.ts` - update based on kilocode packages/opencode/src/tool/bash.ts changes
- `src/tool/batch.ts` - update based on kilocode packages/opencode/src/tool/batch.ts changes
- `src/tool/batch.txt.ts` - update based on kilocode packages/opencode/src/tool/batch.txt changes
- `src/tool/edit.ts` - update based on kilocode packages/opencode/src/tool/edit.ts changes
- `src/tool/external-directory.ts` - update based on kilocode packages/opencode/src/tool/external-directory.ts changes
- `src/tool/glob.test.ts` - update based on kilocode packages/opencode/test/tool/glob.test.ts changes
- `src/tool/glob.ts` - update based on kilocode packages/opencode/src/tool/glob.ts changes
- `src/tool/question.ts` - update based on kilocode packages/opencode/src/tool/question.ts changes
- `src/tool/read.test.ts` - update based on kilocode packages/opencode/test/tool/read.test.ts changes
- `src/tool/read.ts` - update based on kilocode packages/opencode/src/tool/read.ts changes
- `src/tool/registry.test.ts` - update based on kilocode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/kilocode/tool/registry.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
- `src/tool/skill.test.ts` - update based on kilocode packages/opencode/test/tool/skill.test.ts changes
- `src/tool/skill.ts` - update based on kilocode packages/opencode/src/tool/skill.ts changes
- `src/tool/task.test.ts` - update based on kilocode packages/opencode/test/tool/task.test.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/kilocode/tool/task.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/tool/task.ts changes
- `src/tool/task.txt.ts` - update based on kilocode packages/opencode/src/tool/task.txt changes
- `src/tool/todo.ts` - update based on kilocode packages/opencode/src/tool/todo.ts changes
- `src/tool/tool-define.test.ts` - update based on kilocode packages/opencode/test/tool/tool-define.test.ts changes
- `src/tool/tool.ts` - update based on kilocode packages/opencode/src/tool/tool.ts changes
- `src/tool/webfetch.test.ts` - update based on kilocode packages/opencode/test/tool/webfetch.test.ts changes
- `src/tool/webfetch.ts` - update based on kilocode packages/opencode/src/tool/webfetch.ts changes
- `src/tool/websearch.ts` - update based on kilocode packages/opencode/src/tool/websearch.ts changes
- `src/tool/write.ts` - update based on kilocode packages/opencode/src/tool/write.ts changes
