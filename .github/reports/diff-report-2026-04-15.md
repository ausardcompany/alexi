# Upstream Changes Report
Generated: 2026-04-15 07:49:01

## Summary
- kilocode: 227 commits, 425 files changed
- opencode: 66 commits, 296 files changed

## kilocode Changes (ba7b123f0..b0a658ed1)

### Commits

- b0a658ed1 - Merge pull request #8671 from Kilo-Org/fix/skill-read-config-protection (Marian Alexandru Alecu, 2026-04-15)
- b7e1491ee - test(cli): move config dir test to kilocode/ (Alex Alecu, 2026-04-15)
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
- 26e23c3ce - Merge pull request #8357 from shssoichiro/tui-usage-info (Marian Alexandru Alecu, 2026-04-14)
- 9fe8b969e - fix: windows http memory (Catriel Müller, 2026-04-14)
- 5b98391dd - Merge branch 'main' into tui-usage-info (Marian Alexandru Alecu, 2026-04-14)
- d2427eb19 - Merge pull request #6183 from Ashwinhegde19/fix/windows-mouse-tracking-exit (Marian Alexandru Alecu, 2026-04-14)
- ba3309b21 - fix(opencode): merge variant into model object in plan-followup test seed (Imanol Maiztegui, 2026-04-14)
- be5272acc - chore: update visual regression baselines (github-actions[bot], 2026-04-14)
- 7df2904b6 - fix: vscode read tool align title (Catriel Müller, 2026-04-14)
- 316a6473b - fix(cli): add kilocode_change markers (Alex Alecu, 2026-04-14)
- 6b2ed4546 - style(vscode): normalize indentation and formatting in legacy utils and UI (Imanol Maiztegui, 2026-04-14)
- 7ccf624a8 - feat(vscode): resolve diff content from patch field in UI components (Imanol Maiztegui, 2026-04-14)
- ee883b55e - Merge pull request #8449 from Kilo-Org/docs/exec-approvals-allow-everything (Alex Gold, 2026-04-14)
- 1cf1e6f14 - chore: update visual regression baselines (github-actions[bot], 2026-04-14)
- c1aca9a0c - fix(cli): log error in catch block (Alex Alecu, 2026-04-14)
- 7cf2b36ba - fix(cli): resolve merge conflicts with main (Alex Alecu, 2026-04-14)
- 4e115bf88 - Merge branch 'main' into imanolmaiztegui/kilo-opencode-v1.4.0 (Imanol Maiztegui, 2026-04-14)
- 520bb096a - Merge branch 'main' into docs/exec-approvals-allow-everything (Alex Gold, 2026-04-14)
- 34005d2f9 - Merge pull request #8917 from Kilo-Org/mark/fix-modified-files-spacing (Mark IJbema, 2026-04-14)
- 37c1ff2d6 - fix(vscode): align diff bars to text baseline in diff summary header (Mark IJbema, 2026-04-14)
- 4b66a9cca - fix(vscode): make diff summary title inline with flexbox so bars render on same line (Mark IJbema, 2026-04-14)
- 749337f75 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-04-14)
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
- 407f60137 - Merge remote-tracking branch 'origin/main' into fix/cli-error-boundary-no-renderer (Alex Alecu, 2026-04-14)
- 6290c11d3 - feat(agent-manager): jump to changed line when clicking line number in diff (#8866) (Thomas Brugman, 2026-04-14)
- 77dae2fcc - Merge branch 'main' into fix/skill-read-config-protection (Marian Alexandru Alecu, 2026-04-14)
- 54fe07715 - Merge remote-tracking branch 'origin/main' into fix/skill-read-config-protection (Alex Alecu, 2026-04-14)
- d2593ac70 - Merge pull request #8849 from Kilo-Org/lime-dormouse (Kirill Kalishev, 2026-04-14)
- bc5be5b3a - Merge branch 'main' into lime-dormouse (Kirill Kalishev, 2026-04-14)
- 242fe1a7c - Merge pull request #8895 from Kilo-Org/remove-fix-duplicate-reasoning (Christiaan Arnoldus, 2026-04-14)
- 4888fe204 - fix(vscode): strip Electron env vars in dev launch script (#8906) (Marius, 2026-04-14)
- 71b6dc903 - Merge pull request #8908 from Kilo-Org/feat/gateway-models-feature-header (Christiaan Arnoldus, 2026-04-14)
- 75207ad11 - Merge branch 'main' into remove-fix-duplicate-reasoning (Christiaan Arnoldus, 2026-04-14)
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
- 32e9c2934 - fix(cli): remove fixDuplicateReasoning workaround now that @openrouter/ai-sdk-provider is updated (kiloconnect[bot], 2026-04-14)
- 76093d53a - test(session): rename agent references from "build" to "code" in prompt-effect tests (Imanol Maiztegui, 2026-04-14)
- f0eebe9b4 - docs(kilo-docs): update source link path for dialog-provider component (Imanol Maiztegui, 2026-04-14)
- cd79db8a8 - refactor: update sdk imports and fix type signatures for v1.3.17 compat (Imanol Maiztegui, 2026-04-14)
- 170889e95 - resolve merge conflicts (Imanol Maiztegui, 2026-04-14)
- 1b0ccd52f - fix(vscode): keep worktree sessions across project id changes (#8875) (Marius, 2026-04-14)
- 5816eeac4 - chore(deps): update @openrouter/ai-sdk-provider to 2.5.1 in kilo-gateway and opencode (kiloconnect[bot], 2026-04-14)
- 73b6d9a6c - refactor: kilo compat for v1.3.17 (Imanol Maiztegui, 2026-04-14)
- fa767a8e4 - Merge branch 'main' into lime-dormouse (Kirill Kalishev, 2026-04-13)
- 486ba676c - Merge branch 'main' into lime-dormouse (Kirill Kalishev, 2026-04-13)
- 7115a4b5e - moving things (kirillk, 2026-04-13)
- 23745d255 - chore(jetbrains): bump kotlinx-serialization to 1.8.1 (latest for Kotlin 2.1.x) (kirillk, 2026-04-13)
- 8b880ed2d - fix(jetbrains): forward health flag from server, restrict profile fallback to 401 (kirillk, 2026-04-13)
- c807564bd - Merge branch 'main' into lime-dormouse (Kirill Kalishev, 2026-04-13)
- 7530e33b3 - refactor(jetbrains): strip KiloBackendProjectService to project-only shell (kirillk, 2026-04-13)
- ac8787144 - feat(jetbrains): add IntelliJ-independent backend test suite (kirillk, 2026-04-13)
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
- 0e685ac69 - fix(cli): stop config protection from blocking skill file reads (Alex Alecu, 2026-04-09)
- 46f243fea - app: remove min loading duration (#21655) (Brendan Allan, 2026-04-09)
- 847fc9d26 - release: v1.4.1 (opencode, 2026-04-09)
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
- 4961d72c0 - tweak: separate ModelsDev.Model and Config model schemas (#21561) (Aiden Cline, 2026-04-08)
- 00cb8839a - fix: dont show invalid variants for BP (#21555) (Aiden Cline, 2026-04-08)
- 689b1a4b3 - fix(app): diff list normalization (Adam, 2026-04-08)
- d98be3934 - fix(app): patch tool diff rendering (Adam, 2026-04-08)
- 039c60170 - fix: ensure that /providers list and shell endpoints are correctly typed in sdk and openapi schema (#21543) (Aiden Cline, 2026-04-08)
- cd87d4f9d - test: update webfetch test (#21398) (Aiden Cline, 2026-04-08)
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
- 81bdffc81 - fix: ensure the alibaba provider errors are retried (#21355) (Aiden Cline, 2026-04-07)
- 2549a38a7 - fix(tui): use sentence case for theme mode command palette items (#21192) (Ariane Emory, 2026-04-07)
- 5d48e7bd4 - refactor(core): support multiple event streams in worker and remove workspaces from plugin api (#21348) (James Long, 2026-04-07)
- ec8b9810b - feat(app): better subagent experience (#20708) (Adam, 2026-04-07)
- 65318a80f - chore: update web stats (Adam, 2026-04-07)
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
- `packages/opencode/test/kilocode/permission/config-paths.test.ts` (+175, -0)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
(no changes)

#### Other Changes
- `.changeset/fix-provider-auth-invalidation.md` (+6, -0)
- `.changeset/gateway-models-feature-header.md` (+5, -0)
- `.changeset/git-stats-polling.md` (+5, -0)
- `.changeset/terminal-context-mention.md` (+5, -0)
- `.idea/gradle.xml` (+12, -0)
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
- `packages/kilo-docs/pages/automate/agent-manager.md` (+9, -9)
- `packages/kilo-docs/pages/code-with-ai/agents/chat-interface.md` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/agents/context-mentions.md` (+8, -1)
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
- `packages/kilo-jetbrains/README.md` (+5, -3)
- `packages/kilo-jetbrains/backend/build.gradle.kts` (+44, -76)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/{server/KiloHttpClients.kt => backend/KiloBackendHttpClients.kt}` (+2, -2)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/KiloBackendProjectService.kt` (+22, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/CliServer.kt` (+20, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloAppState.kt` (+51, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendAppService.kt` (+393, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendCliManager.kt` (+283, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/{server/KiloConnectionService.kt => backend/app/KiloBackendConnectionService.kt}` (+83, -69)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloAppRpcApiImpl.kt` (+74, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloAppRpcApiProvider.kt` (+15, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/util/KiloLog.kt` (+20, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/rpc/KiloProjectRpcApiImpl.kt` (+0, -42)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/rpc/KiloProjectRpcApiProvider.kt` (+0, -14)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/server/KiloProjectService.kt` (+0, -80)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/server/ServerManager.kt` (+0, -298)
- `packages/kilo-jetbrains/backend/src/main/resources/kilo.jetbrains.backend.xml` (+1, -1)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/ApiModelSerializationTest.kt` (+164, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/KiloAppStateTest.kt` (+97, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/KiloBackendAppServiceTest.kt` (+249, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/KiloBackendHttpClientsTest.kt` (+100, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/KiloConnectionServiceTest.kt` (+176, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/FakeCliServer.kt` (+33, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/MockCliServer.kt` (+192, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/TestLog.kt` (+27, -0)
- `packages/kilo-jetbrains/build-tasks/build.gradle.kts` (+16, -0)
- `packages/kilo-jetbrains/build-tasks/settings.gradle.kts` (+1, -0)
- `packages/kilo-jetbrains/build-tasks/src/main/kotlin/BuildTasksPlugin.kt` (+13, -0)
- `packages/kilo-jetbrains/build-tasks/src/main/kotlin/CheckCliTask.kt` (+53, -0)
- `packages/kilo-jetbrains/build-tasks/src/main/kotlin/FixGeneratedApiTask.kt` (+158, -0)
- `packages/kilo-jetbrains/build-tasks/src/main/kotlin/PrepareLocalCliTask.kt` (+74, -0)
- `packages/kilo-jetbrains/build.gradle.kts` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/KiloToolWindowFactory.kt` (+0, -65)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/actions/ReinstallKiloAction.kt` (+0, -18)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/actions/RestartKiloAction.kt` (+0, -18)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/{KiloApiService.kt => client/KiloAppService.kt}` (+30, -43)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/KiloToolWindowFactory.kt` (+160, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/{ => client}/actions/KiloSettingsAction.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/ReinstallKiloAction.kt` (+18, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/RestartKiloAction.kt` (+18, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/{ => client}/actions/StatusInfoAction.kt` (+10, -9)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/{ => client/plugin}/KiloBundle.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/kilo.jetbrains.frontend.xml` (+5, -5)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+2, -0)
- `packages/kilo-jetbrains/gradle/libs.versions.toml` (+5, -5)
- `packages/kilo-jetbrains/script/build.ts` (+7, -3)
- `packages/kilo-jetbrains/settings.gradle.kts` (+1, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloAppRpcApi.kt` (+39, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloProjectRpcApi.kt` (+0, -42)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/ConnectionStateDto.kt` (+0, -17)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/KiloAppStateDto.kt` (+41, -0)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+2, -1)
- `packages/kilo-ui/src/components/basic-tool.css` (+1, -0)
- `packages/kilo-ui/src/components/session-diff.ts` (+1, -0)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-basictool/no-children-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-messagepart/assistant-message-story-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-messagepart/full-conversation-turn-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-messagepart/with-context-group-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/package.json` (+2, -2)
- `packages/kilo-vscode/script/launch.ts` (+9, -2)
- `packages/kilo-vscode/src/DiffViewerProvider.ts` (+0, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+47, -12)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+10, -0)
- `packages/kilo-vscode/src/agent-manager/GitOps.ts` (+63, -6)
- `packages/kilo-vscode/src/agent-manager/GitStatsPoller.ts` (+24, -11)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+21, -4)
- `packages/kilo-vscode/src/kilo-provider-utils.ts` (+4, -5)
- `packages/kilo-vscode/src/kilo-provider/handlers/cloud-session.ts` (+10, -3)
- `packages/kilo-vscode/src/kilo-provider/message-files.ts` (+13, -0)
- `packages/kilo-vscode/src/legacy-migration/sessions/lib/parts/parts-util.ts` (+11, -11)
- `packages/kilo-vscode/src/review-utils.ts` (+3, -3)
- `packages/kilo-vscode/src/services/code-actions/register-terminal-actions.ts` (+4, -49)
- `packages/kilo-vscode/src/services/terminal/context.ts` (+39, -0)
- `packages/kilo-vscode/src/services/terminal/truncate.ts` (+39, -0)
- `packages/kilo-vscode/tests/unit/file-mention-utils.test.ts` (+23, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-session-refresh.test.ts` (+64, -0)
- `packages/kilo-vscode/tests/unit/message-files.test.ts` (+26, -0)
- `packages/kilo-vscode/tests/unit/terminal-architecture.test.ts` (+41, -0)
- `packages/kilo-vscode/tests/unit/terminal-context-utils.test.ts` (+26, -0)
- `packages/kilo-vscode/tests/unit/terminal-truncate.test.ts` (+24, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/composite-webview/diff-summary-collapsed-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+7, -6)
- `packages/kilo-vscode/webview-ui/agent-manager/DiffPanel.tsx` (+5, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/FullScreenDiffView.tsx` (+5, -1)
- `packages/kilo-vscode/webview-ui/diff-virtual/DiffVirtualApp.tsx` (+18, -5)
- `packages/kilo-vscode/webview-ui/src/components/chat/ChatView.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+8, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/PermissionDiff.tsx` (+15, -3)
- `packages/kilo-vscode/webview-ui/src/components/chat/PermissionDock.tsx` (+6, -2)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+41, -14)
- `packages/kilo-vscode/webview-ui/src/components/chat/QuestionDock.tsx` (+9, -2)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskToolExpanded.tsx` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/VscodeSessionTurn.tsx` (+11, -10)
- `packages/kilo-vscode/webview-ui/src/components/shared/PopupSelector.tsx` (+2, -4)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/hooks/file-mention-utils.ts` (+22, -0)
- `packages/kilo-vscode/webview-ui/src/hooks/terminal-context-utils.ts` (+42, -0)
- `packages/kilo-vscode/webview-ui/src/hooks/useFileMention.ts` (+24, -20)
- `packages/kilo-vscode/webview-ui/src/hooks/useTerminalContext.ts` (+81, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/stories/composite.stories.tsx` (+71, -0)
- `packages/kilo-vscode/webview-ui/src/styles/chat-layout.css` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages.ts` (+35, -0)
- `packages/opencode/package.json` (+27, -16)
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
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+43, -12)
- `packages/opencode/src/cli/cmd/tui/routes/session/usage.ts` (+26, -0)
- `packages/opencode/src/cli/cmd/tui/thread.ts` (+12, -3)
- `packages/opencode/src/cli/cmd/tui/ui/dialog-select.tsx` (+11, -3)
- `packages/opencode/src/cli/cmd/tui/util/provider-origin.ts` (+7, -0)
- `packages/opencode/src/cli/cmd/tui/util/terminal.ts` (+24, -0)
- `packages/opencode/src/cli/cmd/tui/worker.ts` (+35, -15)
- `packages/opencode/src/cli/cmd/web.ts` (+1, -1)
- `packages/opencode/src/cli/error.ts` (+4, -0)
- `packages/opencode/src/config/config.ts` (+121, -34)
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
- `packages/opencode/src/kilocode/config-validation.ts` (+158, -0)
- `packages/opencode/src/kilocode/plan-followup.ts` (+3, -14)
- `packages/opencode/src/kilocode/plugins/sidebar-usage.tsx` (+57, -0)
- `packages/opencode/src/kilocode/review/worktree-diff.ts` (+5, -0)
- `packages/opencode/src/kilocode/server/server.ts` (+4, -2)
- `packages/opencode/src/kilocode/session/index.ts` (+10, -1)
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
- `packages/opencode/src/provider/models-snapshot.js` (+61472, -1)
- `packages/opencode/src/provider/models.ts` (+40, -20)
- `packages/opencode/src/provider/provider.ts` (+84, -29)
- `packages/opencode/src/provider/transform.ts` (+10, -50)
- `packages/opencode/src/pty/index.ts` (+13, -21)
- `packages/opencode/src/pty/pty.bun.ts` (+26, -0)
- `packages/opencode/src/pty/pty.node.ts` (+27, -0)
- `packages/opencode/src/pty/pty.ts` (+25, -0)
- `packages/opencode/src/server/instance.ts` (+43, -12)
- `packages/opencode/src/server/proxy.ts` (+137, -0)
- `packages/opencode/src/server/router.ts` (+68, -62)
- `packages/opencode/src/server/routes/experimental.ts` (+109, -1)
- `packages/opencode/src/server/routes/provider.ts` (+1, -1)
- `packages/opencode/src/server/routes/pty.ts` (+6, -7)
- `packages/opencode/src/server/routes/session.ts` (+29, -16)
- `packages/opencode/src/server/server.ts` (+97, -51)
- `packages/opencode/src/session/compaction.ts` (+16, -30)
- `packages/opencode/src/session/index.ts` (+40, -54)
- `packages/opencode/src/session/llm.ts` (+66, -9)
- `packages/opencode/src/session/message-v2.ts` (+40, -20)
- `packages/opencode/src/session/processor.ts` (+167, -76)
- `packages/opencode/src/session/prompt.ts` (+192, -241)
- `packages/opencode/src/session/prompt/kimi.txt` (+0, -19)
- `packages/opencode/src/session/retry.ts` (+17, -0)
- `packages/opencode/src/session/revert.ts` (+7, -3)
- `packages/opencode/src/session/run-state.ts` (+120, -0)
- `packages/opencode/src/session/status.ts` (+1, -1)
- `packages/opencode/src/session/summary.ts` (+2, -5)
- `packages/opencode/src/session/todo.ts` (+6, -4)
- `packages/opencode/src/share/share-next.ts` (+1, -1)
- `packages/opencode/src/shell/shell.ts` (+3, -3)
- `packages/opencode/src/skill/index.ts` (+15, -9)
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
- `packages/opencode/test/kilocode/config-validation.test.ts` (+184, -0)
- `packages/opencode/test/kilocode/plan-followup.test.ts` (+6, -12)
- `packages/opencode/test/kilocode/session-list.test.ts` (+46, -0)
- `packages/opencode/test/kilocode/session-processor-empty-tool-calls.test.ts` (+1, -1)
- `packages/opencode/test/lsp/index.test.ts` (+78, -0)
- `packages/opencode/test/mcp/oauth-callback.test.ts` (+34, -0)
- `packages/opencode/test/memory/abort-leak.test.ts` (+6, -3)
- `packages/opencode/test/npm.test.ts` (+18, -0)
- `packages/opencode/test/plugin/shared.test.ts` (+88, -0)
- `packages/opencode/test/project/migrate-global.test.ts` (+1, -0)
- `packages/opencode/test/provider/provider.test.ts` (+68, -0)
- `packages/opencode/test/server/experimental-session-list.test.ts` (+2, -2)
- `packages/opencode/test/server/permission-allow-everything.test.ts` (+1, -1)
- `packages/opencode/test/server/project-init-git.test.ts` (+2, -2)
- `packages/opencode/test/server/session-actions.test.ts` (+4, -3)
- `packages/opencode/test/server/session-messages.test.ts` (+4, -4)
- `packages/opencode/test/server/session-select.test.ts` (+3, -3)
- `packages/opencode/test/session/compaction.test.ts` (+31, -13)
- `packages/opencode/test/session/llm.test.ts` (+9, -14)
- `packages/opencode/test/session/message-v2.test.ts` (+75, -0)
- `packages/opencode/test/session/processor-effect.test.ts` (+89, -7)
- `packages/opencode/test/session/prompt-effect.test.ts` (+308, -66)
- `packages/opencode/test/session/prompt.test.ts` (+8, -4)
- `packages/opencode/test/session/retry.test.ts` (+19, -0)
- `packages/opencode/test/session/snapshot-tool-race.test.ts` (+3, -0)
- `packages/opencode/test/share/share-next.test.ts` (+7, -8)
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
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+285, -261)
- `packages/sdk/js/src/v2/index.ts` (+2, -0)
- `packages/sdk/openapi.json` (+738, -734)
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
- `packages/ui/src/components/message-part.tsx` (+127, -60)
- `packages/ui/src/components/provider-icons/sprite.svg` (+0, -58)
- `packages/ui/src/components/provider-icons/types.ts` (+0, -6)
- `packages/ui/src/components/session-diff.test.ts` (+37, -0)
- `packages/ui/src/components/session-diff.ts` (+83, -0)
- `packages/ui/src/components/session-review.tsx` (+37, -21)
- `packages/ui/src/components/session-turn.css` (+7, -1)
- `packages/ui/src/components/session-turn.tsx` (+12, -10)
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

#### packages/opencode/src/kilocode/tool/task.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/task.ts b/packages/opencode/src/kilocode/tool/task.ts
new file mode 100644
index 000000000..0f811818d
--- /dev/null
+++ b/packages/opencode/src/kilocode/tool/task.ts
@@ -0,0 +1,38 @@
+// kilocode_change - new file
+import { Permission } from "@/permission"
+import type { Session } from "../../session"
+import type { Agent } from "../../agent/agent"
+import type { Config } from "../../config/config"
+
+export namespace KiloTask {
+  /** Reject primary agents used as subagents */
+  export function validate(info: Agent.Info, name: string) {
+    if (info.mode === "primary") throw new Error(`Agent "${name}" is a primary agent and cannot be used as a subagent`)
+  }
+
+  /**
+   * Build inherited permission rules from the calling agent.
+   * Merges the static agent definition with the session's accumulated permissions
+   * so restrictions survive multi-hop chains (plan → general → explore).
+   *
+   * The caller must resolve `caller` (Agent.Info) and `session` (Session.Info)
+   * before calling — this function is pure/synchronous.
+   */
+  export function inherited(input: {
+    caller: Agent.Info
+    session: Session.Info
+    mcp: Config.Info["mcp"]
+  }): Permission.Ruleset {
+    const rules = Permission.merge(input.caller.permission ?? [], input.session.permission ?? [])
+    const prefixes = Object.keys(input.mcp ?? {}).map((k) => k.replace(/[^a-zA-Z0-9_-]/g, "_") + "_")
+    const isMcp = (p: string) => prefixes.some((prefix) => p.startsWith(prefix))
+    return rules.filter(
+      (r: Permission.Rule) => r.permission === "edit" || r.permission === "bash" || isMcp(r.permission),
+    )
+  }
+
+  /** Extra permission rules appended to subagent sessions */
+  export function permissions(rules: Permission.Ruleset): Permission.Ruleset {
+    return [{ permission: "task", pattern: "*", action: "deny" }, ...rules]
+  }
+}
```

#### packages/opencode/src/tool/apply_patch.ts
```diff
diff --git a/packages/opencode/src/tool/apply_patch.ts b/packages/opencode/src/tool/apply_patch.ts
index 31fd33da2..5d844d4cd 100644
--- a/packages/opencode/src/tool/apply_patch.ts
+++ b/packages/opencode/src/tool/apply_patch.ts
@@ -14,6 +14,7 @@ import { Filesystem } from "../util/filesystem"
 import DESCRIPTION from "./apply_patch.txt"
 import { File } from "../file"
 import { filterDiagnostics } from "./diagnostics" // kilocode_change
+import { ConfigValidation } from "../kilocode/config-validation" // kilocode_change
 import { Format } from "../format"
 
 const PatchParams = z.object({
@@ -165,9 +166,7 @@ export const ApplyPatchTool = Tool.define("apply_patch", {
       filePath: change.filePath,
       relativePath: path.relative(Instance.worktree, change.movePath ?? change.filePath).replaceAll("\\", "/"),
       type: change.type,
-      diff: change.diff,
-      before: change.oldContent,
-      after: change.newContent,
+      patch: change.diff,
       additions: change.additions,
       deletions: change.deletions,
       movePath: change.movePath,
@@ -273,6 +272,10 @@ export const ApplyPatchTool = Tool.define("apply_patch", {
     const changedPaths = fileChanges
       .filter((c) => c.type !== "delete")
       .map((c) => Filesystem.normalizePath(c.movePath ?? c.filePath))
+    for (const changed of fileChanges) {
+      if (changed.type === "delete") continue
+      output += await ConfigValidation.check(changed.movePath ?? changed.filePath)
+    }
     // kilocode_change end
 
     return {
```


*... and more files (showing first 5)*

## opencode Changes (7cbe162..c98f616)

### Commits

- c98f616 - ui: update accordion styles and session review component (#22582) (Brendan Allan, 2026-04-15)
- 5069cd9 - fix(ui): disable accordion items for binary files and improve disabled state styling (#22577) (Brendan Allan, 2026-04-15)
- 7659321 - release: v1.4.6 (opencode, 2026-04-15)
- a992d8b - fix(snapshot): avoid ENAMETOOLONG and improve staging perf via stdin pathspecs (#22560) (Luke Parker, 2026-04-15)
- ccaa12e - sync (Frank, 2026-04-15)
- 5687d61 - chore: generate (opencode-agent[bot], 2026-04-15)
- 8f1ac2d - Go: list model providers (Frank, 2026-04-15)
- 1bea2a9 - Go: qwen 3.5 & 3.6 plus (Frank, 2026-04-15)
- 6a7ca45 - doc: qwen3.5 & 3.6 (Frank, 2026-04-15)
- 8d89c34 - fix: prevent tooltip reopen on trigger click (#22571) (Brendan Allan, 2026-04-15)
- c48a4cc - docs: use latest release for downloads instead of pinned version (Dax Raad, 2026-04-15)
- df9eafa - Update VOUCHED list (github-actions[bot], 2026-04-15)
- e24d104 - fix: update prompt input submit handler (#22566) (Brendan Allan, 2026-04-15)
- be3be32 - fix(observability): handle OTEL headers with '=' in value (#22564) (Dax, 2026-04-15)
- 66de7be - fix: add left padding to session title input (#22556) (Brendan Allan, 2026-04-15)
- d06bc3c - chore: update nix node_modules hashes (opencode-agent[bot], 2026-04-15)
- dfc7283 - release: v1.4.5 (opencode, 2026-04-15)
- 4246368 - fix(bootstrap): await plugin initialization (Brendan Allan, 2026-04-15)
- 548d9ac - core: parallelise bootstrap (#22514) (Brendan Allan, 2026-04-15)
- a60fd89 - ci: ok one more time (Dax Raad, 2026-04-14)
- d25a7fb - chore: bump ai sdk pkgs (#22539) (Aiden Cline, 2026-04-14)
- da0f81d - ci: remove Tauri desktop builds from release workflow to simplify distribution (Dax Raad, 2026-04-14)
- 627159a - delete all e2e tests (#22501) (Dax Raad, 2026-04-14)
- f44aa02 - fix(desktop): chdir to homedir on macOS to fix ripgrep issues (#22537) (Brendan Allan, 2026-04-15)
- 1ca9804 - fix(desktop): start tauri shell commands from home directory (#22535) (Brendan Allan, 2026-04-15)
- ddad871 - core: pin downloads to v1.4.3 to ensure users get a tested, stable build instead of potentially unstable latest releases (Dax Raad, 2026-04-14)
- d215188 - chore: generate (opencode-agent[bot], 2026-04-15)
- f73ff78 - fix(opencode): export AI SDK telemetry spans (#22526) (Kit Langton, 2026-04-14)
- 68a9a47 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-04-15)
- fb92bd4 - chore: generate (opencode-agent[bot], 2026-04-15)
- 02f8a24 - Update test.yml (LukeParkerDev, 2026-04-14)
- 467e568 - feat(server): extract question handler factory (Shoubhit Dash, 2026-04-14)
- fba752a - feat(server): extract question httpapi contract (Shoubhit Dash, 2026-04-14)
- 87b2a9d - chore: generate (opencode-agent[bot], 2026-04-15)
- 8df7ccc - zen: rate limiter (Frank, 2026-04-14)
- 2c36bf9 - fix(app): avoid bootstrap error popups during global sync init (#22426) (Brendan Allan, 2026-04-15)
- bddf830 - release: v1.4.4 (opencode, 2026-04-15)
- 50c1d0a - chore: update nix node_modules hashes (opencode-agent[bot], 2026-04-14)
- 60b8041 - zen: support alibaba cache write (Frank, 2026-04-14)
- 3b2a2c4 - sync zen (Frank, 2026-04-14)
- 6706358 - feat(core): bootstrap packages/server and document extraction plan (#22492) (Shoubhit Dash, 2026-04-15)
- f640975 - fix: restore instance context in prompt runs (#22498) (Shoubhit Dash, 2026-04-15)
- f9d99f0 - fix(session): keep GitHub Copilot compaction requests valid (#22371) (Luke Parker, 2026-04-15)
- bbd5faf - chore(nix): remove external ripgrep (#22482) (Caleb Norton, 2026-04-14)
- aeb7d99 - fix(effect): preserve logger context in prompt runs (#22496) (Kit Langton, 2026-04-14)
- 3695057 - feat: add --sanitize flag to opencode export to strip PII or confidential info (#22489) (Aiden Cline, 2026-04-14)
- 4ed3afe - chore: generate (opencode-agent[bot], 2026-04-14)
- 3cf7c75 - fix(question): restore flat reply sdk shape (#22487) (Kit Langton, 2026-04-14)
- 85674f4 - chore: generate (opencode-agent[bot], 2026-04-14)
- f2525a6 - add experimental question HttpApi slice (#22357) (Kit Langton, 2026-04-14)
- 8c42d39 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-04-14)
- 7f9bf91 - upgrade opentui to 0.1.99 (#22283) (Sebastian, 2026-04-14)
- 6ce5c01 - ignore: v2 experiments (Dax Raad, 2026-04-14)
- a53fae1 - Fix diff line number contrast for built-in themes (#22464) (Sebastian, 2026-04-14)
- 4626458 - fix(mcp): persist immediate oauth connections (#22376) (Kit Langton, 2026-04-14)
- 9a5178e - fix(cli): handlePluginAuth asks for api key only if authorize method exists (#22475) (Goni Zahavy, 2026-04-14)
- 6838461 - refactor(session): remove async facade exports (#22471) (Kit Langton, 2026-04-14)
- 4f967d5 - improve bash timeout retry hint (#22390) (Kit Langton, 2026-04-14)
- ff60859 - fix(project): reuse runtime in instance boot (#22470) (Kit Langton, 2026-04-14)
- 020c47a - refactor(project): remove async facade exports (#22387) (Kit Langton, 2026-04-14)
- 64171db - chore: generate (opencode-agent[bot], 2026-04-14)
- ad26579 - refactor(share): remove session share async facade exports (#22386) (Kit Langton, 2026-04-14)
- b1312a3 - core: prevent duplicate user messages in ACP clients (#22468) (Aiden Cline, 2026-04-14)
- a8f9f6b - fix(acp): stop emitting user_message_chunk during session/prompt turn (#21851) (RAIT-09, 2026-04-14)
- d312c67 - fix: rm effect logger from processor.ts, use old logger for now instead (#22460) (Aiden Cline, 2026-04-14)
- 5b60e51 - fix(opencode): resolve ripgrep worker path in builds (#22436) (Shoubhit Dash, 2026-04-14)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/bash.ts` (+5, -1)
- `packages/opencode/src/tool/question.ts` (+2, -2)
- `packages/opencode/src/tool/registry.ts` (+1, -7)
- `packages/opencode/src/tool/truncate.ts` (+3, -1)
- `packages/opencode/test/tool/bash.test.ts` (+1, -0)
- `packages/opencode/test/tool/task.test.ts` (+1, -1)
- `packages/opencode/test/tool/truncation.test.ts` (+2, -2)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+6, -0)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/console/core/migrations/20260414235536_lame_wild_child/migration.sql` (+6, -0)
- `packages/console/core/migrations/20260414235536_lame_wild_child/snapshot.json` (+2515, -0)
- `packages/console/core/migrations/20260415002256_perpetual_karen_page/migration.sql` (+1, -0)
- `packages/console/core/migrations/20260415002256_perpetual_karen_page/snapshot.json` (+2515, -0)
- `packages/console/core/migrations/20260415002534_far_smasher/migration.sql` (+1, -0)
- `packages/console/core/migrations/20260415002534_far_smasher/snapshot.json` (+2515, -0)
- `packages/console/core/package.json` (+1, -1)
- `packages/console/core/src/model.ts` (+65, -6)
- `packages/console/core/src/schema/ip.sql.ts` (+10, -0)

#### Other Changes
- `.github/VOUCHED.td` (+1, -0)
- `.github/workflows/test.yml` (+1, -1)
- `.opencode/.gitignore` (+2, -1)
- `.opencode/skills/effect/SKILL.md` (+21, -0)
- `.opencode/themes/mytheme.json` (+2, -2)
- `bun.lock` (+478, -410)
- `nix/hashes.json` (+4, -4)
- `nix/opencode.nix` (+18, -19)
- `package.json` (+4, -3)
- `packages/app/README.md` (+2, -3)
- `packages/app/e2e/AGENTS.md` (+0, -225)
- `packages/app/e2e/actions.ts` (+0, -949)
- `packages/app/e2e/app/home.spec.ts` (+0, -24)
- `packages/app/e2e/app/navigation.spec.ts` (+0, -10)
- `packages/app/e2e/app/palette.spec.ts` (+0, -20)
- `packages/app/e2e/app/server-default.spec.ts` (+0, -58)
- `packages/app/e2e/app/session.spec.ts` (+0, -16)
- `packages/app/e2e/app/titlebar-history.spec.ts` (+0, -120)
- `packages/app/e2e/backend.ts` (+0, -141)
- `packages/app/e2e/commands/input-focus.spec.ts` (+0, -15)
- `packages/app/e2e/commands/panels.spec.ts` (+0, -33)
- `packages/app/e2e/commands/tab-close.spec.ts` (+0, -32)
- `packages/app/e2e/files/file-open.spec.ts` (+0, -31)
- `packages/app/e2e/files/file-tree.spec.ts` (+0, -56)
- `packages/app/e2e/files/file-viewer.spec.ts` (+0, -156)
- `packages/app/e2e/fixtures.ts` (+0, -604)
- `packages/app/e2e/models/model-picker.spec.ts` (+0, -48)
- `packages/app/e2e/models/models-visibility.spec.ts` (+0, -61)
- `packages/app/e2e/projects/project-edit.spec.ts` (+0, -49)
- `packages/app/e2e/projects/projects-close.spec.ts` (+0, -49)
- `packages/app/e2e/projects/projects-switch.spec.ts` (+0, -94)
- `packages/app/e2e/projects/workspace-new-session.spec.ts` (+0, -78)
- `packages/app/e2e/projects/workspaces.spec.ts` (+0, -368)
- `packages/app/e2e/prompt/context.spec.ts` (+0, -95)
- `packages/app/e2e/prompt/mock.ts` (+0, -15)
- `packages/app/e2e/prompt/prompt-async.spec.ts` (+0, -54)
- `packages/app/e2e/prompt/prompt-drop-file-uri.spec.ts` (+0, -22)
- `packages/app/e2e/prompt/prompt-drop-file.spec.ts` (+0, -30)
- `packages/app/e2e/prompt/prompt-footer-focus.spec.ts` (+0, -88)
- `packages/app/e2e/prompt/prompt-history.spec.ts` (+0, -146)
- `packages/app/e2e/prompt/prompt-mention.spec.ts` (+0, -26)
- `packages/app/e2e/prompt/prompt-multiline.spec.ts` (+0, -24)
- `packages/app/e2e/prompt/prompt-shell.spec.ts` (+0, -74)
- `packages/app/e2e/prompt/prompt-slash-open.spec.ts` (+0, -22)
- `packages/app/e2e/prompt/prompt-slash-share.spec.ts` (+0, -66)
- `packages/app/e2e/prompt/prompt-slash-terminal.spec.ts` (+0, -18)
- `packages/app/e2e/prompt/prompt.spec.ts` (+0, -28)
- `packages/app/e2e/selectors.ts` (+0, -65)
- `packages/app/e2e/session/session-child-navigation.spec.ts` (+0, -64)
- `packages/app/e2e/session/session-composer-dock.spec.ts` (+0, -655)
- `packages/app/e2e/session/session-model-persistence.spec.ts` (+0, -362)
- `packages/app/e2e/session/session-review.spec.ts` (+0, -440)
- `packages/app/e2e/session/session-undo-redo.spec.ts` (+0, -233)
- `packages/app/e2e/session/session.spec.ts` (+0, -182)
- `packages/app/e2e/settings/settings-keybinds.spec.ts` (+0, -389)
- `packages/app/e2e/settings/settings-models.spec.ts` (+0, -122)
- `packages/app/e2e/settings/settings-providers.spec.ts` (+0, -136)
- `packages/app/e2e/settings/settings.spec.ts` (+0, -718)
- `packages/app/e2e/sidebar/sidebar-popover-actions.spec.ts` (+0, -109)
- `packages/app/e2e/sidebar/sidebar-session-links.spec.ts` (+0, -30)
- `packages/app/e2e/sidebar/sidebar.spec.ts` (+0, -40)
- `packages/app/e2e/status/status-popover.spec.ts` (+0, -94)
- `packages/app/e2e/terminal/terminal-init.spec.ts` (+0, -28)
- `packages/app/e2e/terminal/terminal-reconnect.spec.ts` (+0, -45)
- `packages/app/e2e/terminal/terminal-tabs.spec.ts` (+0, -165)
- `packages/app/e2e/terminal/terminal.spec.ts` (+0, -18)
- `packages/app/e2e/thinking-level.spec.ts` (+0, -25)
- `packages/app/e2e/todo.spec.ts` (+11, -0)
- `packages/app/e2e/tsconfig.json` (+1, -1)
- `packages/app/e2e/utils.ts` (+0, -63)
- `packages/app/package.json` (+3, -3)
- `packages/app/script/e2e-local.ts` (+0, -180)
- `packages/app/src/components/prompt-input.tsx` (+0, -17)
- `packages/app/src/components/prompt-input/submit.ts` (+13, -10)
- `packages/app/src/components/terminal.tsx` (+0, -16)
- `packages/app/src/context/global-sync/bootstrap.ts` (+14, -13)
- `packages/app/src/context/local.tsx` (+1, -49)
- `packages/app/src/pages/error.tsx` (+1, -9)
- `packages/app/src/pages/session/composer/session-composer-state.ts` (+2, -53)
- `packages/app/src/pages/session/composer/session-todo-dock.tsx` (+1, -21)
- `packages/app/src/pages/session/message-timeline.tsx` (+1, -1)
- `packages/app/src/pages/session/terminal-panel.tsx` (+0, -6)
- `packages/app/src/testing/model-selection.ts` (+0, -109)
- `packages/app/src/testing/prompt.ts` (+0, -83)
- `packages/app/src/testing/session-composer.ts` (+0, -84)
- `packages/app/src/testing/terminal.ts` (+0, -119)
- `packages/app/test/e2e/mock.test.ts` (+0, -66)
- `packages/app/test/e2e/no-real-llm.test.ts` (+0, -27)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/i18n/ar.ts` (+6, -6)
- `packages/console/app/src/i18n/br.ts` (+6, -6)
- `packages/console/app/src/i18n/da.ts` (+6, -6)
- `packages/console/app/src/i18n/de.ts` (+6, -6)
- `packages/console/app/src/i18n/en.ts` (+6, -6)
- `packages/console/app/src/i18n/es.ts` (+6, -6)
- `packages/console/app/src/i18n/fr.ts` (+6, -6)
- `packages/console/app/src/i18n/it.ts` (+6, -6)
- `packages/console/app/src/i18n/ja.ts` (+6, -6)
- `packages/console/app/src/i18n/ko.ts` (+6, -6)
- `packages/console/app/src/i18n/no.ts` (+6, -6)
- `packages/console/app/src/i18n/pl.ts` (+6, -6)
- `packages/console/app/src/i18n/ru.ts` (+6, -6)
- `packages/console/app/src/i18n/th.ts` (+6, -6)
- `packages/console/app/src/i18n/tr.ts` (+6, -6)
- `packages/console/app/src/i18n/zh.ts` (+6, -6)
- `packages/console/app/src/i18n/zht.ts` (+6, -6)
- `packages/console/app/src/routes/go/index.css` (+24, -0)
- `packages/console/app/src/routes/go/index.tsx` (+49, -10)
- `packages/console/app/src/routes/workspace/[id]/go/lite-section.tsx` (+2, -0)
- `packages/console/app/src/routes/zen/util/error.ts` (+1, -0)
- `packages/console/app/src/routes/zen/util/handler.ts` (+19, -16)
- `packages/console/app/src/routes/zen/util/{rateLimiter.ts => ipRateLimiter.ts}` (+1, -8)
- `packages/console/app/src/routes/zen/util/keyRateLimiter.ts` (+39, -0)
- `packages/console/app/src/routes/zen/util/provider/openai-compatible.ts` (+5, -2)
- `packages/console/app/test/rateLimiter.test.ts` (+1, -1)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/mail/package.json` (+1, -1)
- `packages/desktop-electron/package.json` (+1, -1)
- `packages/desktop-electron/src/main/index.ts` (+5, -0)
- `packages/desktop/package.json` (+1, -1)
- `packages/desktop/src-tauri/src/cli.rs` (+1, -0)
- `packages/enterprise/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/function/package.json` (+1, -1)
- `packages/opencode/package.json` (+14, -8)
- `packages/opencode/script/build.ts` (+9, -1)
- `packages/opencode/script/seed-e2e.ts` (+0, -69)
- `packages/opencode/specs/effect/http-api.md` (+263, -6)
- `packages/opencode/specs/effect/server-package.md` (+666, -0)
- `packages/opencode/src/acp/agent.ts` (+5, -12)
- `packages/opencode/src/cli/cmd/debug/agent.ts` (+43, -39)
- `packages/opencode/src/cli/cmd/export.ts` (+228, -11)
- `packages/opencode/src/cli/cmd/github.ts` (+90, -95)
- `packages/opencode/src/cli/cmd/providers.ts` (+6, -6)
- `packages/opencode/src/cli/cmd/session.ts` (+3, -2)
- `packages/opencode/src/cli/cmd/stats.ts` (+4, -1)
- `packages/opencode/src/cli/cmd/tui/context/theme.tsx` (+6, -4)
- `packages/opencode/src/cli/cmd/tui/context/theme/aura.json` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/context/theme/ayu.json` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/context/theme/carbonfox.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/catppuccin-frappe.json` (+1, -4)
- `packages/opencode/src/cli/cmd/tui/context/theme/catppuccin-macchiato.json` (+1, -4)
- `packages/opencode/src/cli/cmd/tui/context/theme/catppuccin.json` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/context/theme/cobalt2.json` (+1, -4)
- `packages/opencode/src/cli/cmd/tui/context/theme/cursor.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/dracula.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/everforest.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/flexoki.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/github.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/gruvbox.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/kanagawa.json` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/context/theme/lucent-orng.json` (+1, -4)
- `packages/opencode/src/cli/cmd/tui/context/theme/material.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/matrix.json` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/context/theme/monokai.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/nightowl.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/nord.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/one-dark.json` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/context/theme/opencode.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/orng.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/osaka-jade.json` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/context/theme/palenight.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/rosepine.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/solarized.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/synthwave84.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/tokyonight.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/vercel.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/vesper.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme/zenburn.json` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+1, -1)
- `packages/opencode/src/effect/app-runtime.ts` (+26, -5)
- `packages/opencode/src/effect/bootstrap-runtime.ts` (+1, -1)
- `packages/opencode/src/effect/observability.ts` (+68, -0)
- `packages/opencode/src/effect/oltp.ts` (+0, -41)
- `packages/opencode/src/effect/run-service.ts` (+1, -1)
- `packages/opencode/src/file/ripgrep.ts` (+6, -1)
- `packages/opencode/src/id/id.ts` (+7, -7)
- `packages/opencode/src/mcp/index.ts` (+50, -14)
- `packages/opencode/src/project/bootstrap.ts` (+11, -7)
- `packages/opencode/src/project/instance.ts` (+9, -5)
- `packages/opencode/src/project/project.ts` (+1, -35)
- `packages/opencode/src/provider/provider.ts` (+0, -15)
- `packages/opencode/src/question/index.ts` (+98, -70)
- `packages/opencode/src/server/instance/experimental.ts` (+6, -2)
- `packages/opencode/src/server/instance/httpapi/index.ts` (+7, -0)
- `packages/opencode/src/server/instance/httpapi/question.ts` (+44, -0)
- `packages/opencode/src/server/instance/middleware.ts` (+1, -1)
- `packages/opencode/src/server/instance/project.ts` (+4, -5)
- `packages/opencode/src/server/instance/question.ts` (+8, -2)
- `packages/opencode/src/server/instance/session.ts` (+82, -56)
- `packages/opencode/src/server/instance/tui.ts` (+2, -1)
- `packages/opencode/src/session/index.ts` (+24, -65)
- `packages/opencode/src/session/llm.ts` (+13, -1)
- `packages/opencode/src/session/processor.ts` (+6, -6)
- `packages/opencode/src/session/prompt.ts` (+19, -40)
- `packages/opencode/src/share/session.ts` (+2, -10)
- `packages/opencode/src/snapshot/index.ts` (+100, -93)
- `packages/opencode/src/v2/session-common.ts` (+1, -0)
- `packages/opencode/src/v2/session-entry.ts` (+199, -109)
- `packages/opencode/src/v2/session-event.ts` (+443, -0)
- `packages/opencode/test/acp/event-subscription.test.ts` (+40, -0)
- `packages/opencode/test/effect/app-runtime-logger.test.ts` (+61, -0)
- `packages/opencode/test/mcp/oauth-auto-connect.test.ts` (+58, -0)
- `packages/opencode/test/project/migrate-global.test.ts` (+18, -8)
- `packages/opencode/test/project/project.test.ts` (+83, -69)
- `packages/opencode/test/question/question.test.ts` (+2, -2)
- `packages/opencode/test/server/global-session-list.test.ts` (+29, -13)
- `packages/opencode/test/server/question-httpapi.test.ts` (+78, -0)
- `packages/opencode/test/server/session-actions.test.ts` (+20, -8)
- `packages/opencode/test/server/session-list.test.ts` (+29, -17)
- `packages/opencode/test/server/session-messages.test.ts` (+32, -11)
- `packages/opencode/test/server/session-select.test.ts` (+19, -3)
- `packages/opencode/test/session/compaction.test.ts` (+91, -70)
- `packages/opencode/test/session/messages-pagination.test.ts` (+112, -91)
- `packages/opencode/test/session/prompt-effect.test.ts` (+76, -40)
- `packages/opencode/test/session/prompt.test.ts` (+283, -215)
- `packages/opencode/test/session/session-entry.test.ts` (+624, -0)
- `packages/opencode/test/session/session.test.ts` (+46, -30)
- `packages/opencode/test/session/structured-output-integration.test.ts` (+191, -160)
- `packages/plugin/package.json` (+5, -5)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+19, -13)
- `packages/sdk/openapi.json` (+47, -45)
- `packages/server/package.json` (+29, -0)
- `packages/server/src/api/index.ts` (+2, -0)
- `packages/server/src/api/question.ts` (+37, -0)
- `packages/server/src/definition/api.ts` (+12, -0)
- `packages/server/src/definition/index.ts` (+2, -0)
- `packages/server/src/definition/question.ts` (+94, -0)
- `packages/server/src/index.ts` (+6, -0)
- `packages/server/src/openapi.ts` (+5, -0)
- `packages/server/src/types.ts` (+5, -0)
- `packages/server/sst-env.d.ts` (+10, -0)
- `packages/server/tsconfig.json` (+15, -0)
- `packages/slack/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/components/accordion.css` (+2, -2)
- `packages/ui/src/components/session-review.tsx` (+11, -6)
- `packages/ui/src/components/tooltip.tsx` (+12, -0)
- `packages/ui/src/styles/base.css` (+1, -1)
- `packages/util/package.json` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/ar/go.mdx` (+11, -5)
- `packages/web/src/content/docs/ar/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/bs/go.mdx` (+11, -5)
- `packages/web/src/content/docs/bs/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/da/go.mdx` (+11, -5)
- `packages/web/src/content/docs/da/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/de/go.mdx` (+11, -5)
- `packages/web/src/content/docs/de/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/es/go.mdx` (+11, -5)
- `packages/web/src/content/docs/es/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/fr/go.mdx` (+11, -5)
- `packages/web/src/content/docs/fr/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/go.mdx` (+18, -6)
- `packages/web/src/content/docs/it/go.mdx` (+11, -5)
- `packages/web/src/content/docs/it/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/ja/go.mdx` (+11, -5)
- `packages/web/src/content/docs/ja/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/ko/go.mdx` (+11, -5)
- `packages/web/src/content/docs/ko/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/nb/go.mdx` (+11, -5)
- `packages/web/src/content/docs/nb/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/pl/go.mdx` (+11, -5)
- `packages/web/src/content/docs/pl/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/pt-br/go.mdx` (+11, -5)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/ru/go.mdx` (+11, -5)
- `packages/web/src/content/docs/ru/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/th/go.mdx` (+11, -5)
- `packages/web/src/content/docs/th/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/tr/go.mdx` (+11, -5)
- `packages/web/src/content/docs/tr/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/zen.mdx` (+4, -5)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+11, -5)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+4, -4)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+11, -5)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+4, -4)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/migrations/20260414235536_lame_wild_child/migration.sql
```diff
diff --git a/packages/console/core/migrations/20260414235536_lame_wild_child/migration.sql b/packages/console/core/migrations/20260414235536_lame_wild_child/migration.sql
new file mode 100644
index 0000000..439bf0c
--- /dev/null
+++ b/packages/console/core/migrations/20260414235536_lame_wild_child/migration.sql
@@ -0,0 +1,6 @@
+CREATE TABLE `key_rate_limit` (
+	`key` varchar(255) NOT NULL,
+	`interval` varchar(12) NOT NULL,
+	`count` int NOT NULL,
+	CONSTRAINT PRIMARY KEY(`key`,`interval`)
+);
```

#### packages/console/core/migrations/20260414235536_lame_wild_child/snapshot.json
```diff
diff --git a/packages/console/core/migrations/20260414235536_lame_wild_child/snapshot.json b/packages/console/core/migrations/20260414235536_lame_wild_child/snapshot.json
new file mode 100644
index 0000000..5419042
--- /dev/null
+++ b/packages/console/core/migrations/20260414235536_lame_wild_child/snapshot.json
@@ -0,0 +1,2515 @@
+{
+  "version": "6",
+  "dialect": "mysql",
+  "id": "09166f7c-37b3-456a-93a9-76a3a29a7b5e",
+  "prevIds": ["5e506dec-61e7-4726-81d1-afa4ffbc61ed"],
+  "ddl": [
+    {
+      "name": "account",
+      "entityType": "tables"
+    },
+    {
+      "name": "auth",
+      "entityType": "tables"
+    },
+    {
+      "name": "benchmark",
+      "entityType": "tables"
+    },
+    {
+      "name": "billing",
+      "entityType": "tables"
+    },
+    {
+      "name": "lite",
+      "entityType": "tables"
+    },
+    {
+      "name": "payment",
+      "entityType": "tables"
+    },
+    {
+      "name": "subscription",
+      "entityType": "tables"
+    },
+    {
+      "name": "usage",
+      "entityType": "tables"
+    },
+    {
+      "name": "ip_rate_limit",
+      "entityType": "tables"
+    },
+    {
+      "name": "ip",
```

#### packages/console/core/migrations/20260415002256_perpetual_karen_page/migration.sql
```diff
diff --git a/packages/console/core/migrations/20260415002256_perpetual_karen_page/migration.sql b/packages/console/core/migrations/20260415002256_perpetual_karen_page/migration.sql
new file mode 100644
index 0000000..287b59f
--- /dev/null
+++ b/packages/console/core/migrations/20260415002256_perpetual_karen_page/migration.sql
@@ -0,0 +1 @@
+ALTER TABLE `key_rate_limit` MODIFY COLUMN `interval` varchar(20) NOT NULL;
\ No newline at end of file
```

#### packages/console/core/migrations/20260415002256_perpetual_karen_page/snapshot.json
```diff
diff --git a/packages/console/core/migrations/20260415002256_perpetual_karen_page/snapshot.json b/packages/console/core/migrations/20260415002256_perpetual_karen_page/snapshot.json
new file mode 100644
index 0000000..a450e9e
--- /dev/null
+++ b/packages/console/core/migrations/20260415002256_perpetual_karen_page/snapshot.json
@@ -0,0 +1,2515 @@
+{
+  "version": "6",
+  "dialect": "mysql",
+  "id": "d0c6d0a1-f50c-4f6a-b6a8-13aebb2b86fd",
+  "prevIds": ["09166f7c-37b3-456a-93a9-76a3a29a7b5e"],
+  "ddl": [
+    {
+      "name": "account",
+      "entityType": "tables"
+    },
+    {
+      "name": "auth",
+      "entityType": "tables"
+    },
+    {
+      "name": "benchmark",
+      "entityType": "tables"
+    },
+    {
+      "name": "billing",
+      "entityType": "tables"
+    },
+    {
+      "name": "lite",
+      "entityType": "tables"
+    },
+    {
+      "name": "payment",
+      "entityType": "tables"
+    },
+    {
+      "name": "subscription",
+      "entityType": "tables"
+    },
+    {
+      "name": "usage",
+      "entityType": "tables"
+    },
+    {
+      "name": "ip_rate_limit",
+      "entityType": "tables"
+    },
+    {
+      "name": "ip",
```

#### packages/console/core/migrations/20260415002534_far_smasher/migration.sql
```diff
diff --git a/packages/console/core/migrations/20260415002534_far_smasher/migration.sql b/packages/console/core/migrations/20260415002534_far_smasher/migration.sql
new file mode 100644
index 0000000..e3474ce
--- /dev/null
+++ b/packages/console/core/migrations/20260415002534_far_smasher/migration.sql
@@ -0,0 +1 @@
+ALTER TABLE `key_rate_limit` MODIFY COLUMN `interval` varchar(40) NOT NULL;
\ No newline at end of file
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/agent.ts
- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/src/agent/agent.ts
- `src/permission/` - review permission changes from packages/opencode/src/kilocode/permission/config-paths.ts
- `src/permission/` - review permission changes from packages/opencode/test/kilocode/permission/config-paths.test.ts
- `src/tool/apply_patch.test.ts` - update based on kilocode packages/opencode/test/tool/apply_patch.test.ts changes
- `src/tool/apply_patch.ts` - update based on kilocode packages/opencode/src/tool/apply_patch.ts changes
- `src/tool/bash.test.ts` - update based on opencode packages/opencode/test/tool/bash.test.ts changes
- `src/tool/bash.ts` - update based on kilocode packages/opencode/src/tool/bash.ts changes
- `src/tool/bash.ts` - update based on opencode packages/opencode/src/tool/bash.ts changes
- `src/tool/batch.ts` - update based on kilocode packages/opencode/src/tool/batch.ts changes
- `src/tool/batch.txt.ts` - update based on kilocode packages/opencode/src/tool/batch.txt changes
- `src/tool/edit.ts` - update based on kilocode packages/opencode/src/tool/edit.ts changes
- `src/tool/external-directory.ts` - update based on kilocode packages/opencode/src/tool/external-directory.ts changes
- `src/tool/glob.test.ts` - update based on kilocode packages/opencode/test/tool/glob.test.ts changes
- `src/tool/glob.ts` - update based on kilocode packages/opencode/src/tool/glob.ts changes
- `src/tool/question.ts` - update based on kilocode packages/opencode/src/tool/question.ts changes
- `src/tool/question.ts` - update based on opencode packages/opencode/src/tool/question.ts changes
- `src/tool/read.test.ts` - update based on kilocode packages/opencode/test/tool/read.test.ts changes
- `src/tool/read.ts` - update based on kilocode packages/opencode/src/tool/read.ts changes
- `src/tool/registry.test.ts` - update based on kilocode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/kilocode/tool/registry.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
- `src/tool/registry.ts` - update based on opencode packages/opencode/src/tool/registry.ts changes
- `src/tool/skill.test.ts` - update based on kilocode packages/opencode/test/tool/skill.test.ts changes
- `src/tool/skill.ts` - update based on kilocode packages/opencode/src/tool/skill.ts changes
- `src/tool/task.test.ts` - update based on kilocode packages/opencode/test/tool/task.test.ts changes
- `src/tool/task.test.ts` - update based on opencode packages/opencode/test/tool/task.test.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/kilocode/tool/task.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/tool/task.ts changes
- `src/tool/task.txt.ts` - update based on kilocode packages/opencode/src/tool/task.txt changes
- `src/tool/todo.ts` - update based on kilocode packages/opencode/src/tool/todo.ts changes
- `src/tool/tool-define.test.ts` - update based on kilocode packages/opencode/test/tool/tool-define.test.ts changes
- `src/tool/tool.ts` - update based on kilocode packages/opencode/src/tool/tool.ts changes
- `src/tool/truncate.ts` - update based on opencode packages/opencode/src/tool/truncate.ts changes
- `src/tool/truncation.test.ts` - update based on opencode packages/opencode/test/tool/truncation.test.ts changes
- `src/tool/webfetch.test.ts` - update based on kilocode packages/opencode/test/tool/webfetch.test.ts changes
- `src/tool/webfetch.ts` - update based on kilocode packages/opencode/src/tool/webfetch.ts changes
- `src/tool/websearch.ts` - update based on kilocode packages/opencode/src/tool/websearch.ts changes
- `src/tool/write.ts` - update based on kilocode packages/opencode/src/tool/write.ts changes
