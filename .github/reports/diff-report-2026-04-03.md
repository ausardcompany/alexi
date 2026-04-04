# Upstream Changes Report
Generated: 2026-04-03 07:11:48

## Summary
- kilocode: 134 commits, 168 files changed
- opencode: 42 commits, 186 files changed

## kilocode Changes (c27c81a2b..3b794539f)

### Commits

- 3b794539f - Merge pull request #8071 from Kilo-Org/docs/add-setup-videos (Alex Gold, 2026-04-02)
- 7cabefbda - Merge branch 'main' into docs/add-setup-videos (Alex Gold, 2026-04-02)
- bd7f7f3c4 - fix(kilo-docs): add VideoEmbed component and video markdoc tag (Ligia Zanchet, 2026-04-02)
- 2fdbf7852 - Merge pull request #8192 from Kilo-Org/session/agent_36776282-3105-49c1-b897-0043b007f043 (Christiaan Arnoldus, 2026-04-02)
- 73c4efe52 - Merge pull request #8218 from Kilo-Org/catrielmuller/kiloclaw-chat-orgs (Catriel Müller, 2026-04-02)
- eeebdb92b - refactor: remove markers (Catriel Müller, 2026-04-02)
- 452e46d71 - Merge pull request #8214 from Kilo-Org/kirillk/jetbrains-1 (Kirill Kalishev, 2026-04-02)
- 26922a9b0 - feat: nix support for jetbrains plugin build (Catriel Müller, 2026-04-02)
- e4d9f007d - docs(jetbrains): add built plugin location to README (kirillk, 2026-04-02)
- 53e907660 - Merge pull request #8167 from Kilo-Org/docs/code-reviews-local-tabs (Mark IJbema, 2026-04-02)
- b91653bf9 - release: v7.1.20 (kilo-maintainer[bot], 2026-04-02)
- 61ed39924 - refactor(gateway): rename orgId to organizationId for consistency (Catriel Müller, 2026-04-02)
- 09a1faf21 - feat(cli): add org support for /kiloclaw command (Catriel Müller, 2026-04-02)
- e3e6c96f2 - fix(vscode): update migration wizard blog announcement URL (#8217) (kilo-code-bot[bot], 2026-04-02)
- 9b6c2bfcd - Merge branch 'main' into kirillk/jetbrains-1 (Kirill Kalishev, 2026-04-02)
- 599f05288 - fix(jetbrains): validate actual CLI executables exist, not just directories (kirillk, 2026-04-02)
- 64cec90f8 - fix(jetbrains): use gradlew.bat on Windows for Gradle invocation (kirillk, 2026-04-02)
- c06d8e0fa - feat(jetbrains): add CLI binary bundling and build pipeline (kirillk, 2026-04-02)
- f72b3fa3e - fix(kilo-docs): exclude consistently timing-out URLs from link checker (kiloconnect[bot], 2026-04-02)
- 56f73d877 - docs: update local code reviews section to three-tab layout (kiloconnect[bot], 2026-04-02)
- 00b422b83 - Merge pull request #8197 from Kilo-Org/docs/emilie-suggestions-whats-new (Christiaan Arnoldus, 2026-04-02)
- e45ddb41b - release: v7.1.19 (kilo-maintainer[bot], 2026-04-02)
- a4276efee - docs: address markijbema's review comments on whats-new page (kiloconnect[bot], 2026-04-02)
- 624ae8013 - Apply suggestion from @markijbema (Mark IJbema, 2026-04-02)
- d579a676f - Apply suggestion from @markijbema (Mark IJbema, 2026-04-02)
- ebab0fb5e - Apply suggestion from @markijbema (Mark IJbema, 2026-04-02)
- 5524f8b7c - Merge pull request #8162 from Kilo-Org/fix/readme-image-dimensions (Mark IJbema, 2026-04-02)
- 44cb9be9a - docs: apply Emilie's review suggestions to whats-new page (kiloconnect[bot], 2026-04-02)
- 1d52a407e - Merge pull request #8185 from Kilo-Org/docs/whats-new (Mark IJbema, 2026-04-02)
- e22174310 - Update packages/kilo-docs/pages/code-with-ai/platforms/vscode/whats-new.md (Mark IJbema, 2026-04-02)
- 45ca2885d - Update packages/kilo-docs/components/TopNav.tsx (Mark IJbema, 2026-04-02)
- 4cd3d1531 - chore(jetbrains): remove id and version from plugin.xml (patched on build) (kirillk, 2026-04-02)
- 319cfe3ea - Merge pull request #8159 from Kilo-Org/fix/i18n-missing-translations (Mark IJbema, 2026-04-02)
- 16471c6fa - chore(jetbrains): target IntelliJ IDEA Community edition (kirillk, 2026-04-02)
- d558c84e8 - Merge pull request #8193 from Kilo-Org/docs/cli-organization-usage (Alex Gold, 2026-04-02)
- e12f41a1d - Apply suggestion from @kilo-code-bot[bot] (Alex Gold, 2026-04-02)
- d3bb4f928 - Revise CLI organization selection instructions (Alex Gold, 2026-04-02)
- 3a68ad68b - docs(kilo-docs): expand CLI organization usage documentation (kiloconnect[bot], 2026-04-02)
- 569d452a9 - feat(gateway): include version in User-Agent header (kiloconnect[bot], 2026-04-02)
- 0650924fb - fix(i18n): fix prettier formatting for long strings in uk.ts (kilo-code-bot[bot], 2026-04-02)
- 365bc0c1e - fix(i18n): fix prettier formatting for long strings in tr.ts (kilo-code-bot[bot], 2026-04-02)
- 9c7585c2d - fix(i18n): fix prettier formatting for long strings in nl.ts (kilo-code-bot[bot], 2026-04-02)
- 5e7df97ab - docs(kilo-docs): document new snapshot system and revert workflow (#8180) (Marius, 2026-04-02)
- d5b1fa8a9 - docs(kilo-docs): replace video callouts with embedded YouTube players (Ligia Zanchet, 2026-04-02)
- fcd9fde71 - fix(i18n): restore missing language.tr key in nl.ts (kilo-code-bot[bot], 2026-04-02)
- 88be21a97 - docs: update code review FAQ to reference /local-review commands (Mark IJbema, 2026-04-02)
- 1ba284042 - feat(vscode): add model favorites with duplicated top section and stable key-based selection (#8115) (Marius, 2026-04-02)
- c1943eb3e - Merge branch 'main' into fix/i18n-missing-translations (Mark IJbema, 2026-04-02)
- 6419df92c - Prevent Migration Wizard re-trigger on every launch (#8183) (Imanol Maiztegui, 2026-04-02)
- 210019ca0 - Merge pull request #8166 from Kilo-Org/docs/sync-tabs-across-page (Mark IJbema, 2026-04-02)
- 7fa4d55c8 - docs: add orchestrator mode deprecation FAQ item (Mark IJbema, 2026-04-02)
- 95ec89313 - docs: update FAQ items to match new extension terminology and features (Mark IJbema, 2026-04-02)
- b87f16a87 - docs: link to new VS Code GA blog post instead of CLI post (Mark IJbema, 2026-04-02)
- beb81dc8a - docs: make What's New a subpage of VS Code Extension (Mark IJbema, 2026-04-02)
- b0bb4d663 - Merge pull request #8157 from Kilo-Org/docs/clarify-cli-at-mention-context-behavior (Mark IJbema, 2026-04-02)
- 0e48bf12b - docs(kilo-docs): clarify agent manager terminal ↔ panel switching workflow (#8178) (Marius, 2026-04-02)
- a8e2ef680 - docs: fix broken MCP overview link in What's New page (Mark IJbema, 2026-04-02)
- 224d07665 - feat(vscode): add telemetry info section to About Kilo Code settings (#8175) (Marius, 2026-04-02)
- 9a55db1b6 - revert(i18n): keep skill, Skills, Workflows, Tools untranslated (kilo-code-bot[bot], 2026-04-02)
- 242bdf0e4 - revert(i18n): keep skill, Skills, Workflows, Tools untranslated (kilo-code-bot[bot], 2026-04-02)
- 0898d6c13 - revert(i18n): keep skill, Skills, Workflows, Tools untranslated (kilo-code-bot[bot], 2026-04-02)
- e53b063a2 - revert(i18n): keep skill, Skills, Workflows, Tools untranslated (kilo-code-bot[bot], 2026-04-02)
- 3ee09f9b3 - revert(i18n): keep skill, Skills, Workflows, Tools untranslated (kilo-code-bot[bot], 2026-04-02)
- d77b73785 - revert(i18n): keep skill, Skills, Workflows, Tools untranslated (kilo-code-bot[bot], 2026-04-02)
- 648c7a5dc - revert(i18n): keep skill, Skills, Workflows, Tools untranslated (kilo-code-bot[bot], 2026-04-02)
- 93cbe51c6 - revert(i18n): keep skill, Skills, Workflows, Tools untranslated (kilo-code-bot[bot], 2026-04-02)
- f5c4b284c - revert(i18n): keep skill, Skills, Workflows, Tools untranslated (kilo-code-bot[bot], 2026-04-02)
- 998379942 - revert(i18n): keep skill, Skills, Workflows, Tools untranslated (kilo-code-bot[bot], 2026-04-02)
- 1b4af73de - revert(i18n): keep skill, Skills, Workflows, Tools untranslated (kilo-code-bot[bot], 2026-04-02)
- d25ee9d03 - revert(i18n): keep skill, Skills, Workflows, Tools untranslated (kilo-code-bot[bot], 2026-04-02)
- 2970604d7 - revert(i18n): keep skill, Skills, Workflows, Tools untranslated (kilo-code-bot[bot], 2026-04-02)
- d65b48aad - revert(i18n): keep skill, Skills, Workflows, Tools untranslated (kilo-code-bot[bot], 2026-04-02)
- a29db4205 - docs(kilo-docs): clarify @ mention attaches file contents and document line-range syntax (kiloconnect[bot], 2026-04-02)
- 754bf787a - docs(kilo-docs): add custom model configuration documentation (#8176) (Marius, 2026-04-02)
- 452d64224 - docs: celebratory tone for banner and What's New page (Mark IJbema, 2026-04-02)
- 68aeedeed - docs: add New Version FAQ and update announcement banner (Mark IJbema, 2026-04-02)
- a1a29f2a5 - fix(agent-manager): route clipboard write through extension host (#8161) (Marius, 2026-04-02)
- 01be54fef - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-04-02)
- 581f90f9a - Merge pull request #7800 from Kilo-Org/catrielmuller/kiloclaw-client (Catriel Müller, 2026-04-02)
- f7b795a72 - fix(legacy-migration): convert MCP server timeout from seconds to milliseconds (#8169) (Imanol Maiztegui, 2026-04-02)
- 28e1733ae - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-04-02)
- f7b6c996d - fix: bound hung state disposal during provider auth refresh (#8090) (Marius, 2026-04-02)
- 25092ddaa - fix(agent-manager): log errors and trigger git refresh in worktree migration (#8139) (Marius, 2026-04-02)
- 5187cb0fd - fix(cli): guard against null theme in TUI resolveTheme and Proxy (#8112) (Marius, 2026-04-02)
- 0fbccbfec - fix(agent-manager): persist image attachments in new agent dialog cache (#8107) (Marius, 2026-04-02)
- 58863fbd4 - fix(vscode): isolate prompt drafts across pending sessions (#8104) (Marius, 2026-04-02)
- 7618a9e01 - fix(vscode): preserve custom provider keys on edit (#8089) (Marius, 2026-04-02)
- 2e3b9a243 - fix: RevertBanner UI shows no changes after successful file revert (#8121) (Aarav, 2026-04-02)
- 3b2db43a4 - release: v7.1.18 (kilo-maintainer[bot], 2026-04-02)
- ab89b4826 - docs: sync tab selection across all tab groups on the page (kiloconnect[bot], 2026-04-02)
- b50a8cecb - docs: add width/height to README images to improve marketplace render performance (kiloconnect[bot], 2026-04-02)
- 3a86e1518 - fix(cli): prevent unbounded log file growth with size-based rotation (#8136) (Marius, 2026-04-02)
- cd8caf7b5 - fix(i18n): translate missing uk strings (kilo-code-bot[bot], 2026-04-02)
- ffed5e398 - fix(i18n): translate missing th strings (kilo-code-bot[bot], 2026-04-02)
- cd4476740 - fix(i18n): translate missing ru strings (kilo-code-bot[bot], 2026-04-02)
- 706a64f0e - fix(i18n): translate missing zht strings (kilo-code-bot[bot], 2026-04-02)
- 678bb4aef - fix(i18n): translate missing zh strings (kilo-code-bot[bot], 2026-04-02)
- 963361a7b - fix(i18n): translate missing tr strings (kilo-code-bot[bot], 2026-04-02)
- ed03e4997 - fix(i18n): translate missing pl strings (kilo-code-bot[bot], 2026-04-02)
- d27910a44 - fix(i18n): translate missing no strings (kilo-code-bot[bot], 2026-04-02)
- 70eea757c - fix(i18n): translate missing nl strings (kilo-code-bot[bot], 2026-04-02)
- f1e97ce74 - fix(i18n): translate missing ko strings (kilo-code-bot[bot], 2026-04-02)
- e13accc87 - fix(i18n): translate missing ja strings (kilo-code-bot[bot], 2026-04-02)
- 870f311e7 - fix(i18n): translate missing fr strings (kilo-code-bot[bot], 2026-04-02)
- 5fe697c64 - fix(i18n): translate missing es strings (kilo-code-bot[bot], 2026-04-02)
- 2c8b31c67 - docs(kilo-docs): clarify @ mention injects full file content in CLI TUI (kiloconnect[bot], 2026-04-02)
- cbcd336ef - fix(i18n): translate missing de strings (kilo-code-bot[bot], 2026-04-02)
- bf8dc83a7 - fix(i18n): translate missing da strings (kilo-code-bot[bot], 2026-04-02)
- e851bdf65 - fix(i18n): translate missing bs strings (kilo-code-bot[bot], 2026-04-02)
- 334858430 - fix(i18n): translate missing br strings (kilo-code-bot[bot], 2026-04-02)
- ccb6fd328 - fix(i18n): translate missing ar strings (kilo-code-bot[bot], 2026-04-02)
- e09040fe4 - fix(cli,vscode): import disabled MCPs with enabled: false instead of skipping them (#8098) (kilo-code-bot[bot], 2026-04-02)
- c9c6781a4 - Merge pull request #8145 from Kilo-Org/fix/nl-missing-language-tr (Mark IJbema, 2026-04-02)
- 89309fcbd - fix(i18n): run prettier on tr.ts and uk.ts (kiloconnect[bot], 2026-04-02)
- d262a20f2 - fix(i18n): add missing language.tr key to nl locale (kiloconnect[bot], 2026-04-02)
- 394b068b3 - fix(ui): Add left margin to notification page to match right margin (#8093) (kilo-code-bot[bot], 2026-04-02)
- c888a6cbe - Merge pull request #8141 from Kilo-Org/mark/less-logging (Mark IJbema, 2026-04-02)
- 2a9447c15 - perf(server): skip logging for /log and /telemetry/capture via early return (Mark IJbema, 2026-04-02)
- 879906377 - Merge pull request #8084 from wiliyam/fix/register-tr-nl-uk-locales-7271 (Mark IJbema, 2026-04-02)
- 04de4ad6f - chore(jetbrains): ignore .ai/ (JetBrains Junie AI agent config) (kirillk, 2026-04-01)
- 3f17bf2b2 - feat(jetbrains): add JetBrains plugin wireframe with split mode architecture (kirillk, 2026-04-01)
- 428604b61 - fix: remove duplicate profile.switchingAccount English fallback from nl.ts (wiliyam, 2026-04-01)
- b2cd56fa3 - fix: add missing agentBehaviour and profile keys to tr/nl/uk locales (wiliyam, 2026-04-01)
- ad9ad9d73 - refactor: update source links (Catriel Müller, 2026-04-01)
- 32f670e1c - Merge branch 'main' into catrielmuller/kiloclaw-client (Catriel Müller, 2026-04-01)
- f1075fc6a - refactor: address issues (Catriel Müller, 2026-04-01)
- a1abbc2b4 - refactor: fix unmount (Catriel Müller, 2026-04-01)
- 964cc7400 - refactor: improve SDK claw types (Catriel Müller, 2026-04-01)
- a747d9634 - fix: register tr, nl, uk locales in i18n test coverage (#7271) (wiliyam, 2026-04-01)
- 1ce84856f - docs(kilo-docs): add setup videos to Slack/Telegram/Google (Ligia Zanchet, 2026-04-01)
- 99f4e1310 - refactor: update source links (Catriel Müller, 2026-03-27)
- 3de9f9805 - refactor: improve comments (Catriel Müller, 2026-03-27)
- 8db506544 - refactor: improve comments (Catriel Müller, 2026-03-27)
- 8737bdfb1 - feat: KiloClaw Chat on TUI (Catriel Müller, 2026-03-27)

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
- `.gitignore` (+4, -1)
- `.idea/gradle.xml` (+20, -0)
- `.run/Run JetBrains Plugin.run.xml` (+27, -0)
- `README.md` (+6, -6)
- `bun.lock` (+31, -16)
- `flake.nix` (+44, -18)
- `nix/hashes.json` (+4, -4)
- `package.json` (+1, -1)
- `packages/app/package.json` (+1, -1)
- `packages/desktop-electron/package.json` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/kilo-docs/components/Tabs.tsx` (+17, -2)
- `packages/kilo-docs/components/TopNav.tsx` (+3, -2)
- `packages/kilo-docs/components/VideoEmbed.tsx` (+92, -0)
- `packages/kilo-docs/components/index.js` (+1, -0)
- `packages/kilo-docs/lib/nav/code-with-ai.ts` (+10, -1)
- `packages/kilo-docs/lychee.toml` (+3, -0)
- `packages/kilo-docs/markdoc/tags/index.ts` (+2, -0)
- `packages/kilo-docs/markdoc/tags/video.markdoc.ts` (+21, -0)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/ai-providers/lmstudio.md` (+38, -0)
- `packages/kilo-docs/pages/ai-providers/ollama.md` (+26, -0)
- `packages/kilo-docs/pages/ai-providers/openai-compatible.md` (+18, -2)
- `packages/kilo-docs/pages/automate/agent-manager.md` (+23, -16)
- `packages/kilo-docs/pages/automate/code-reviews/overview.md` (+18, -5)
- `packages/kilo-docs/pages/code-with-ai/agents/context-mentions.md` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/agents/custom-models.md` (+317, -0)
- `packages/kilo-docs/pages/code-with-ai/agents/model-selection.md` (+2, -0)
- `packages/kilo-docs/pages/code-with-ai/features/checkpoints.md` (+97, -11)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli.md` (+20, -6)
- `packages/kilo-docs/pages/code-with-ai/platforms/{vscode.md => vscode/index.md}` (+0, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/vscode/whats-new.md` (+58, -0)
- `packages/kilo-docs/pages/kiloclaw/chat-platforms/slack.md` (+2, -0)
- `packages/kilo-docs/pages/kiloclaw/chat-platforms/telegram.md` (+2, -0)
- `packages/kilo-docs/pages/kiloclaw/development-tools/google.md` (+2, -0)
- `packages/kilo-docs/public/img/checkpoints/revert-to-here-button.png` (+-, --)
- `packages/kilo-docs/public/img/custom-models/custom-provider-button.png` (+-, --)
- `packages/kilo-docs/public/img/custom-models/custom-provider-details.png` (+-, --)
- `packages/kilo-docs/source-links.md` (+7, -2)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-gateway/src/api/constants.ts` (+2, -2)
- `packages/kilo-gateway/src/api/models.ts` (+2, -2)
- `packages/kilo-gateway/src/api/modes.ts` (+2, -2)
- `packages/kilo-gateway/src/headers.ts` (+15, -4)
- `packages/kilo-gateway/src/index.ts` (+2, -2)
- `packages/kilo-gateway/src/provider-debug.ts` (+2, -2)
- `packages/kilo-gateway/src/provider.ts` (+2, -2)
- `packages/kilo-gateway/src/server/routes.ts` (+121, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-jetbrains/.gitignore` (+5, -0)
- `packages/kilo-jetbrains/README.md` (+71, -0)
- `packages/kilo-jetbrains/backend/build.gradle.kts` (+68, -0)
- `packages/kilo-jetbrains/backend/src/main/resources/kilo.jetbrains.backend.xml` (+6, -0)
- `packages/kilo-jetbrains/build.gradle.kts` (+60, -0)
- `packages/kilo-jetbrains/frontend/build.gradle.kts` (+17, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/kilo.jetbrains.frontend.xml` (+6, -0)
- `packages/kilo-jetbrains/gradle.properties` (+4, -0)
- `packages/kilo-jetbrains/gradle/libs.versions.toml` (+12, -0)
- `packages/kilo-jetbrains/gradle/wrapper/gradle-wrapper.jar` (+-, --)
- `packages/kilo-jetbrains/gradle/wrapper/gradle-wrapper.properties` (+5, -0)
- `packages/kilo-jetbrains/gradlew` (+234, -0)
- `packages/kilo-jetbrains/gradlew.bat` (+89, -0)
- `packages/kilo-jetbrains/package.json` (+8, -0)
- `packages/kilo-jetbrains/script/build.ts` (+130, -0)
- `packages/kilo-jetbrains/settings.gradle.kts` (+13, -0)
- `packages/kilo-jetbrains/shared/build.gradle.kts` (+13, -0)
- `packages/kilo-jetbrains/shared/src/main/resources/kilo.jetbrains.shared.xml` (+2, -0)
- `packages/kilo-jetbrains/src/main/resources/META-INF/plugin.xml` (+17, -0)
- `packages/kilo-jetbrains/src/main/resources/META-INF/pluginIcon.svg` (+4, -0)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-vscode/README.md` (+6, -6)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+51, -4)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+16, -1)
- `packages/kilo-vscode/src/agent-manager/WorktreeStateManager.ts` (+5, -3)
- `packages/kilo-vscode/src/agent-manager/constants.ts` (+42, -14)
- `packages/kilo-vscode/src/agent-manager/host.ts` (+6, -0)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+35, -0)
- `packages/kilo-vscode/src/agent-manager/vscode-host.ts` (+10, -0)
- `packages/kilo-vscode/src/kilo-provider-utils.ts` (+1, -1)
- `packages/kilo-vscode/src/kilo-provider/handlers/cloud-session.ts` (+1, -0)
- `packages/kilo-vscode/src/legacy-migration/legacy-types.ts` (+1, -0)
- `packages/kilo-vscode/src/legacy-migration/migration-service.ts` (+17, -5)
- `packages/kilo-vscode/src/provider-actions.ts` (+28, -5)
- `packages/kilo-vscode/src/services/cli-backend/connection-service.ts` (+22, -0)
- `packages/kilo-vscode/src/shared/custom-provider.ts` (+16, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+1, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-i18n-split.test.ts` (+12, -0)
- `packages/kilo-vscode/tests/unit/custom-provider.test.ts` (+31, -0)
- `packages/kilo-vscode/tests/unit/i18n-keys.test.ts` (+27, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-followup.test.ts` (+4, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-session-refresh.test.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/prompt-drafts.test.ts` (+32, -0)
- `packages/kilo-vscode/tests/unit/provider-actions-save.test.ts` (+125, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/chat/welcome-with-switcher-and-notification-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+5, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/NewWorktreeDialog.tsx` (+15, -2)
- `packages/kilo-vscode/webview-ui/src/App.tsx` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/ChatView.tsx` (+3, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+72, -29)
- `packages/kilo-vscode/webview-ui/src/components/migration/MigrationWizard.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/components/settings/AboutKiloCodeTab.tsx` (+23, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/CustomProviderDialog.tsx` (+18, -6)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelPreview.tsx` (+28, -2)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelSelector.tsx` (+321, -104)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+74, -19)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+18, -10)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+17, -9)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+17, -9)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+21, -13)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+20, -12)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+16, -8)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+19, -11)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+20, -12)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+17, -9)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+44, -9)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+18, -10)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+17, -9)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+20, -12)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+19, -11)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+36, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+37, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+21, -13)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+26, -18)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/styles/chat.css` (+48, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages.ts` (+37, -0)
- `packages/kilo-vscode/webview-ui/src/utils/prompt-drafts.ts` (+15, -0)
- `packages/opencode/package.json` (+3, -1)
- `packages/opencode/src/cli/cmd/pr.ts` (+2, -1)
- `packages/opencode/src/cli/cmd/run.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/app.tsx` (+12, -0)
- `packages/opencode/src/cli/cmd/tui/context/route.tsx` (+21, -2)
- `packages/opencode/src/cli/cmd/tui/context/theme.tsx` (+26, -3)
- `packages/opencode/src/kilocode/claw/chat.tsx` (+216, -0)
- `packages/opencode/src/kilocode/claw/client.ts` (+161, -0)
- `packages/opencode/src/kilocode/claw/hooks.ts` (+169, -0)
- `packages/opencode/src/kilocode/claw/sidebar.tsx` (+150, -0)
- `packages/opencode/src/kilocode/claw/types.ts` (+35, -0)
- `packages/opencode/src/kilocode/claw/view.tsx` (+86, -0)
- `packages/opencode/src/kilocode/components/dialog-claw-setup.tsx` (+68, -0)
- `packages/opencode/src/kilocode/components/dialog-claw-upgrade.tsx` (+56, -0)
- `packages/opencode/src/kilocode/kilo-commands.tsx` (+44, -0)
- `packages/opencode/src/kilocode/mcp-migrator.ts` (+2, -8)
- `packages/opencode/src/project/state.ts` (+17, -5)
- `packages/opencode/src/server/server.ts` (+9, -1)
- `packages/opencode/src/session/index.ts` (+13, -1)
- `packages/opencode/src/session/revert.ts` (+15, -2)
- `packages/opencode/src/session/session.sql.ts` (+5, -1)
- `packages/opencode/src/util/log.ts` (+19, -9)
- `packages/opencode/test/kilocode/mcp-migrator.test.ts` (+32, -14)
- `packages/opencode/test/project/state.test.ts` (+84, -0)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+69, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+69, -2)
- `packages/sdk/openapi.json` (+258, -2)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/components/icon.tsx` (+2, -0)
- `packages/util/package.json` (+1, -1)
- `script/upstream/package.json` (+1, -1)
- `sdks/vscode/package.json` (+1, -1)
- `turbo.json` (+4, -0)

### Key Diffs

(no key diffs to show)

## opencode Changes (0f48899..500dcfc)

### Commits

- 500dcfc - chore: update nix node_modules hashes (opencode-agent[bot], 2026-04-03)
- 7b8dc80 - fix(sdk): handle Windows opencode spawn and shutdown (#20772) (Luke Parker, 2026-04-03)
- e89527c - feat: Send x-session-affinity and x-parent-session-id headers (#20744) (Kevin Flansburg, 2026-04-02)
- aa2239d - add automatic heap snapshots for high-memory cli processes (#20788) (Dax, 2026-04-03)
- 8daeacc - chore: generate (opencode-agent[bot], 2026-04-03)
- 81d3ac3 - fix: prevent Tool.define() wrapper accumulation on object-defined tools (#16952) (Juan Pablo Carranza Hurtado, 2026-04-02)
- eb6f1da - fix: call models.dev once instead of twice on start (#20765) (Luke Parker, 2026-04-03)
- 8e9e79d - refactor(share): effectify share next (#20596) (Kit Langton, 2026-04-03)
- 38014fe - fix: rm dynamic part from bash tool description again to restore cache hits across projects (#20771) (Aiden Cline, 2026-04-03)
- 8942fc2 - refactor(effect): prune unused facades (#20748) (Kit Langton, 2026-04-02)
- 7f45943 - fix(opencode): honor model limit.input overrides (#16306) (ykswang, 2026-04-03)
- 6e1400f - dialog aware prompt cursor (#20753) (Sebastian, 2026-04-02)
- bf26c08 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-04-02)
- 29f7dc0 - Adds TUI prompt traits, refs, and plugin slots (#20741) (Sebastian, 2026-04-02)
- 5e1b513 - refactor(todo): effectify session todo (#20595) (Kit Langton, 2026-04-02)
- f549fde - test(app): emit junit artifacts for playwright (#20732) (Kit Langton, 2026-04-02)
- 6dfb304 - refactor(app): unexport internal e2e helpers (#20730) (Kit Langton, 2026-04-02)
- b5b5f7e - test(opencode): remove temporary e2e url repro (#20729) (Kit Langton, 2026-04-02)
- ae7b49b - docs(effect): refresh migration status (#20665) (Kit Langton, 2026-04-02)
- f151c66 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-04-02)
- c3ef69c - test(app): add a golden path for mocked e2e prompts (#20593) (Kit Langton, 2026-04-02)
- 3638911 - chore: generate (opencode-agent[bot], 2026-04-02)
- 1989704 - feat(acp): Add messageID and emit user_message_chunk on prompt/command (#18625) (Noam Bressler, 2026-04-02)
- f0a9ebf - chore: generate (opencode-agent[bot], 2026-04-02)
- 7e32f80 - feat: add macOS managed preferences support for enterprise MDM deployments (#19178) (Lenny Vaknine, 2026-04-02)
- 966d9cf - electron: add basic context menu for inspect element (#20723) (Brendan Allan, 2026-04-02)
- 92e820f - go: add mimo (Frank, 2026-04-02)
- c4b3971 - app: unify auto scroll ref handling (#20716) (Brendan Allan, 2026-04-02)
- 3faabda - refactor(format): update formatter interface to return command from enabled() (#20703) (Dax, 2026-04-02)
- 93a1393 - Add MiMo-V2 models to Go UI and docs (#20709) (Jack, 2026-04-02)
- 10ca1ac - tweak: add abort signal timeout to the github copilot model fetch to prevent infinite blocking (#20705) (Aiden Cline, 2026-04-02)
- c3dfd08 - fix(format): use biome format instead of check to prevent import removal (#20545) (Burak Yigit Kaya, 2026-04-02)
- 510a1e8 - ignore: fix typecheck in dev (#20702) (Aiden Cline, 2026-04-02)
- 159ede2 - chore: generate (opencode-agent[bot], 2026-04-02)
- 291a857 - feat: add optional messageID to ShellInput (#20657) (Noam Bressler, 2026-04-02)
- 57a5236 - chore: generate (opencode-agent[bot], 2026-04-02)
- 23c8656 - refactor: split up models.dev and config model definitions to prevent coupling (#20605) (Aiden Cline, 2026-04-02)
- ec3ae17 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-04-02)
- 69d047a - cleanup event listeners with solid-primitives/event-listener (#20619) (Brendan Allan, 2026-04-02)
- 327f625 - use solid-primitives/resize-observer across web code (#20613) (Brendan Allan, 2026-04-02)
- d540d36 - refactor: simplify solid reactivity across app and web (#20497) (Shoubhit Dash, 2026-04-02)
- db93891 - zen: friendly trial ended message (Frank, 2026-04-02)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/bash.txt` (+1, -1)
- `packages/opencode/src/tool/registry.ts` (+3, -5)
- `packages/opencode/src/tool/todo.ts` (+1, -1)
- `packages/opencode/src/tool/tool.ts` (+1, -1)
- `packages/opencode/test/tool/tool-define.test.ts` (+111, -0)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
- `packages/opencode/src/permission/index.ts` (+8, -5)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/console/core/src/model.ts` (+1, -0)

#### Other Changes
- `.github/workflows/test.yml` (+8, -1)
- `.opencode/plugins/tui-smoke.tsx` (+53, -7)
- `bun.lock` (+82, -34)
- `nix/hashes.json` (+4, -4)
- `package.json` (+2, -0)
- `packages/app/e2e/AGENTS.md` (+7, -8)
- `packages/app/e2e/actions.ts` (+67, -175)
- `packages/app/e2e/backend.ts` (+2, -1)
- `packages/app/e2e/fixtures.ts` (+424, -125)
- `packages/app/e2e/projects/project-edit.spec.ts` (+43, -37)
- `packages/app/e2e/projects/projects-close.spec.ts` (+34, -39)
- `packages/app/e2e/projects/projects-switch.spec.ts` (+57, -82)
- `packages/app/e2e/projects/workspace-new-session.spec.ts` (+16, -35)
- `packages/app/e2e/projects/workspaces.spec.ts` (+250, -257)
- `packages/app/e2e/prompt/mock.ts` (+0, -41)
- `packages/app/e2e/prompt/prompt-async.spec.ts` (+8, -35)
- `packages/app/e2e/prompt/prompt-history.spec.ts` (+38, -67)
- `packages/app/e2e/prompt/prompt-shell.spec.ts` (+24, -25)
- `packages/app/e2e/prompt/prompt-slash-share.spec.ts` (+33, -34)
- `packages/app/e2e/prompt/prompt.spec.ts` (+8, -38)
- `packages/app/e2e/selectors.ts` (+2, -13)
- `packages/app/e2e/session/session-child-navigation.spec.ts` (+25, -26)
- `packages/app/e2e/session/session-composer-dock.spec.ts` (+324, -346)
- `packages/app/e2e/session/session-model-persistence.spec.ts` (+66, -112)
- `packages/app/e2e/session/session-review.spec.ts` (+168, -163)
- `packages/app/e2e/session/session-undo-redo.spec.ts` (+141, -144)
- `packages/app/e2e/session/session.spec.ts` (+122, -126)
- `packages/app/e2e/settings/settings.spec.ts` (+13, -3)
- `packages/app/e2e/sidebar/sidebar-popover-actions.spec.ts` (+38, -47)
- `packages/app/e2e/terminal/terminal-reconnect.spec.ts` (+22, -23)
- `packages/app/e2e/terminal/terminal-tabs.spec.ts` (+122, -125)
- `packages/app/package.json` (+2, -1)
- `packages/app/playwright.config.ts` (+6, -1)
- `packages/app/src/components/debug-bar.tsx` (+2, -2)
- `packages/app/src/components/prompt-input/attachments.ts` (+5, -10)
- `packages/app/src/components/prompt-input/submit.ts` (+3, -0)
- `packages/app/src/components/server/server-row.tsx` (+3, -6)
- `packages/app/src/components/settings-keybinds.tsx` (+2, -2)
- `packages/app/src/context/command.tsx` (+2, -5)
- `packages/app/src/context/global-sdk.tsx` (+10, -14)
- `packages/app/src/context/layout.tsx` (+3, -4)
- `packages/app/src/pages/layout.tsx` (+7, -14)
- `packages/app/src/pages/session.tsx` (+4, -5)
- `packages/app/src/pages/session/composer/session-composer-region.tsx` (+3, -6)
- `packages/app/src/pages/session/composer/session-composer-state.ts` (+2, -2)
- `packages/app/src/pages/session/composer/session-question-dock.tsx` (+5, -6)
- `packages/app/src/pages/session/composer/session-todo-dock.tsx` (+2, -3)
- `packages/app/src/pages/session/file-tabs.tsx` (+16, -24)
- `packages/app/src/pages/session/helpers.ts` (+4, -8)
- `packages/app/src/pages/session/review-tab.tsx` (+7, -13)
- `packages/app/src/pages/session/terminal-panel.tsx` (+3, -6)
- `packages/app/src/testing/prompt.ts` (+27, -0)
- `packages/app/src/testing/terminal.ts` (+1, -0)
- `packages/console/app/src/component/icon.tsx` (+8, -0)
- `packages/console/app/src/i18n/ar.ts` (+8, -5)
- `packages/console/app/src/i18n/br.ts` (+8, -5)
- `packages/console/app/src/i18n/da.ts` (+7, -5)
- `packages/console/app/src/i18n/de.ts` (+7, -5)
- `packages/console/app/src/i18n/en.ts` (+7, -5)
- `packages/console/app/src/i18n/es.ts` (+8, -5)
- `packages/console/app/src/i18n/fr.ts` (+7, -5)
- `packages/console/app/src/i18n/it.ts` (+8, -5)
- `packages/console/app/src/i18n/ja.ts` (+7, -5)
- `packages/console/app/src/i18n/ko.ts` (+7, -5)
- `packages/console/app/src/i18n/no.ts` (+8, -5)
- `packages/console/app/src/i18n/pl.ts` (+8, -5)
- `packages/console/app/src/i18n/ru.ts` (+8, -5)
- `packages/console/app/src/i18n/th.ts` (+7, -5)
- `packages/console/app/src/i18n/tr.ts` (+7, -5)
- `packages/console/app/src/i18n/zh.ts` (+7, -5)
- `packages/console/app/src/i18n/zht.ts` (+7, -5)
- `packages/console/app/src/routes/go/index.css` (+1, -1)
- `packages/console/app/src/routes/go/index.tsx` (+7, -2)
- `packages/console/app/src/routes/zen/util/handler.ts` (+8, -0)
- `packages/desktop-electron/package.json` (+1, -0)
- `packages/desktop-electron/src/main/index.ts` (+3, -0)
- `packages/opencode/package.json` (+5, -5)
- `packages/opencode/specs/effect-migration.md` (+18, -15)
- `packages/opencode/specs/tui-plugins.md` (+13, -6)
- `packages/opencode/src/account/index.ts` (+0, -5)
- `packages/opencode/src/acp/agent.ts` (+21, -1)
- `packages/opencode/src/cli/cmd/models.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/providers.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/component/prompt/index.tsx` (+51, -23)
- `packages/opencode/src/cli/cmd/tui/plugin/api.tsx` (+11, -1)
- `packages/opencode/src/cli/cmd/tui/plugin/runtime.ts` (+5, -1)
- `packages/opencode/src/cli/cmd/tui/plugin/slots.tsx` (+13, -14)
- `packages/opencode/src/cli/cmd/tui/routes/home.tsx` (+27, -27)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+38, -27)
- `packages/opencode/src/cli/cmd/tui/routes/session/permission.tsx` (+4, -1)
- `packages/opencode/src/cli/cmd/tui/routes/session/question.tsx` (+1, -0)
- `packages/opencode/src/cli/cmd/tui/ui/dialog-export-options.tsx` (+4, -1)
- `packages/opencode/src/cli/cmd/tui/ui/dialog-prompt.tsx` (+10, -1)
- `packages/opencode/src/cli/cmd/tui/ui/dialog-select.tsx` (+1, -0)
- `packages/opencode/src/cli/cmd/tui/worker.ts` (+3, -0)
- `packages/opencode/src/cli/heap.ts` (+59, -0)
- `packages/opencode/src/command/index.ts` (+18, -18)
- `packages/opencode/src/config/config.ts` (+57, -0)
- `packages/opencode/src/flag/flag.ts` (+1, -0)
- `packages/opencode/src/format/formatter.ts` (+78, -60)
- `packages/opencode/src/format/index.ts` (+24, -21)
- `packages/opencode/src/index.ts` (+3, -0)
- `packages/opencode/src/installation/index.ts` (+0, -4)
- `packages/opencode/src/mcp/auth.ts` (+0, -8)
- `packages/opencode/src/mcp/index.ts` (+0, -5)
- `packages/opencode/src/plugin/github-copilot/models.ts` (+1, -0)
- `packages/opencode/src/plugin/index.ts` (+6, -6)
- `packages/opencode/src/provider/models-snapshot.ts` (+60410, -0)
- `packages/opencode/src/provider/models.ts` (+43, -13)
- `packages/opencode/src/provider/provider.ts` (+18, -0)
- `packages/opencode/src/pty/index.ts` (+89, -85)
- `packages/opencode/src/question/index.ts` (+7, -4)
- `packages/opencode/src/session/instruction.ts` (+0, -8)
- `packages/opencode/src/session/llm.ts` (+3, -0)
- `packages/opencode/src/session/processor.ts` (+1, -1)
- `packages/opencode/src/session/prompt.ts` (+4, -2)
- `packages/opencode/src/session/summary.ts` (+0, -4)
- `packages/opencode/src/session/todo.ts` (+63, -25)
- `packages/opencode/src/share/share-next.ts` (+299, -217)
- `packages/opencode/src/snapshot/index.ts` (+0, -4)
- `packages/opencode/src/util/process.ts` (+4, -0)
- `packages/opencode/test/acp/agent-interface.test.ts` (+1, -1)
- `packages/opencode/test/config/config.test.ts` (+81, -0)
- `packages/opencode/test/effect/cross-spawn-spawner.test.ts` (+11, -1)
- `packages/opencode/test/fixture/tui-plugin.ts` (+2, -0)
- `packages/opencode/test/format/format.test.ts` (+2, -8)
- `packages/opencode/test/lib/llm-server.ts` (+36, -13)
- `packages/opencode/test/session/compaction.test.ts` (+1, -1)
- `packages/opencode/test/session/processor-effect.test.ts` (+1, -1)
- `packages/opencode/test/session/prompt-effect.test.ts` (+1, -1)
- `packages/opencode/test/session/snapshot-tool-race.test.ts` (+1, -1)
- `packages/opencode/test/share/share-next.test.ts` (+327, -70)
- `packages/plugin/package.json` (+4, -4)
- `packages/plugin/src/tui.ts` (+72, -5)
- `packages/sdk/js/package.json` (+6, -3)
- `packages/sdk/js/src/process.ts` (+31, -0)
- `packages/sdk/js/src/server.ts` (+25, -14)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+2, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+1, -0)
- `packages/sdk/js/src/v2/server.ts` (+25, -14)
- `packages/sdk/openapi.json` (+4, -0)
- `packages/ui/package.json` (+1, -0)
- `packages/ui/src/components/file.tsx` (+5, -11)
- `packages/ui/src/components/line-comment-annotations.tsx` (+0, -5)
- `packages/ui/src/components/line-comment.tsx` (+6, -13)
- `packages/ui/src/components/list.tsx` (+3, -3)
- `packages/ui/src/components/message-part.tsx` (+23, -8)
- `packages/ui/src/components/popover.tsx` (+5, -19)
- `packages/ui/src/components/scroll-view.tsx` (+3, -14)
- `packages/ui/src/components/session-turn.tsx` (+1, -4)
- `packages/ui/src/components/text-strikethrough.stories.tsx` (+3, -8)
- `packages/ui/src/components/text-strikethrough.tsx` (+3, -9)
- `packages/ui/src/context/dialog.tsx` (+2, -2)
- `packages/ui/src/hooks/create-auto-scroll.tsx` (+12, -27)
- `packages/ui/src/pierre/file-find.ts` (+14, -15)
- `packages/ui/src/theme/context.tsx` (+5, -8)
- `packages/web/package.json` (+1, -0)
- `packages/web/src/components/Share.tsx` (+3, -11)
- `packages/web/src/components/share/common.tsx` (+10, -12)
- `packages/web/src/components/share/content-diff.tsx` (+28, -19)
- `packages/web/src/content/docs/ar/go.mdx` (+50, -58)
- `packages/web/src/content/docs/bs/go.mdx` (+11, -5)
- `packages/web/src/content/docs/config.mdx` (+103, -1)
- `packages/web/src/content/docs/da/go.mdx` (+11, -5)
- `packages/web/src/content/docs/de/go.mdx` (+11, -5)
- `packages/web/src/content/docs/es/go.mdx` (+11, -5)
- `packages/web/src/content/docs/fr/go.mdx` (+11, -5)
- `packages/web/src/content/docs/go.mdx` (+11, -5)
- `packages/web/src/content/docs/it/go.mdx` (+11, -5)
- `packages/web/src/content/docs/ja/go.mdx` (+11, -5)
- `packages/web/src/content/docs/ko/go.mdx` (+50, -44)
- `packages/web/src/content/docs/nb/go.mdx` (+11, -5)
- `packages/web/src/content/docs/pl/go.mdx` (+11, -5)
- `packages/web/src/content/docs/pt-br/go.mdx` (+11, -5)
- `packages/web/src/content/docs/ru/go.mdx` (+11, -5)
- `packages/web/src/content/docs/th/go.mdx` (+11, -5)
- `packages/web/src/content/docs/tr/go.mdx` (+11, -5)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+11, -5)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+12, -6)

### Key Diffs

#### packages/console/core/src/model.ts
```diff
diff --git a/packages/console/core/src/model.ts b/packages/console/core/src/model.ts
index 191fdf1..3b24394 100644
--- a/packages/console/core/src/model.ts
+++ b/packages/console/core/src/model.ts
@@ -27,6 +27,7 @@ export namespace ZenData {
     byokProvider: z.enum(["openai", "anthropic", "google"]).optional(),
     stickyProvider: z.enum(["strict", "prefer"]).optional(),
     trialProviders: z.array(z.string()).optional(),
+    trialEnded: z.boolean().optional(),
     fallbackProvider: z.string().optional(),
     rateLimit: z.number().optional(),
     providers: z.array(
```

#### packages/opencode/src/permission/index.ts
```diff
diff --git a/packages/opencode/src/permission/index.ts b/packages/opencode/src/permission/index.ts
index 1a7bd2c..b2cc0f9 100644
--- a/packages/opencode/src/permission/index.ts
+++ b/packages/opencode/src/permission/index.ts
@@ -140,6 +140,7 @@ export namespace Permission {
   export const layer = Layer.effect(
     Service,
     Effect.gen(function* () {
+      const bus = yield* Bus.Service
       const state = yield* InstanceState.make<State>(
         Effect.fn("Permission.state")(function* (ctx) {
           const row = Database.use((db) =>
@@ -191,7 +192,7 @@ export namespace Permission {
 
         const deferred = yield* Deferred.make<void, RejectedError | CorrectedError>()
         pending.set(id, { info, deferred })
-        void Bus.publish(Event.Asked, info)
+        yield* bus.publish(Event.Asked, info)
         return yield* Effect.ensuring(
           Deferred.await(deferred),
           Effect.sync(() => {
@@ -206,7 +207,7 @@ export namespace Permission {
         if (!existing) return
 
         pending.delete(input.requestID)
-        void Bus.publish(Event.Replied, {
+        yield* bus.publish(Event.Replied, {
           sessionID: existing.info.sessionID,
           requestID: existing.info.id,
           reply: input.reply,
@@ -221,7 +222,7 @@ export namespace Permission {
           for (const [id, item] of pending.entries()) {
             if (item.info.sessionID !== existing.info.sessionID) continue
             pending.delete(id)
-            void Bus.publish(Event.Replied, {
+            yield* bus.publish(Event.Replied, {
               sessionID: item.info.sessionID,
               requestID: item.info.id,
               reply: "reject",
@@ -249,7 +250,7 @@ export namespace Permission {
           )
           if (!ok) continue
           pending.delete(id)
-          void Bus.publish(Event.Replied, {
+          yield* bus.publish(Event.Replied, {
             sessionID: item.info.sessionID,
             requestID: item.info.id,
             reply: "always",
@@ -306,7 +307,9 @@ export namespace Permission {
     return result
```

#### packages/opencode/src/tool/bash.txt
```diff
diff --git a/packages/opencode/src/tool/bash.txt b/packages/opencode/src/tool/bash.txt
index 8d53c90..668cea3 100644
--- a/packages/opencode/src/tool/bash.txt
+++ b/packages/opencode/src/tool/bash.txt
@@ -2,7 +2,7 @@ Executes a given bash command in a persistent shell session with optional timeou
 
 Be aware: OS: ${os}, Shell: ${shell}
 
-All commands run in ${directory} by default. Use the `workdir` parameter if you need to run a command in a different directory. AVOID using `cd <directory> && <command>` patterns - use `workdir` instead.
+All commands run in the current working directory by default. Use the `workdir` parameter if you need to run a command in a different directory. AVOID using `cd <directory> && <command>` patterns - use `workdir` instead.
 
 IMPORTANT: This tool is for terminal operations like git, npm, docker, etc. DO NOT use it for file operations (reading, writing, editing, searching, finding files) - use the specialized tools for this instead.
 
```

#### packages/opencode/src/tool/registry.ts
```diff
diff --git a/packages/opencode/src/tool/registry.ts b/packages/opencode/src/tool/registry.ts
index 133a501..1bb2707 100644
--- a/packages/opencode/src/tool/registry.ts
+++ b/packages/opencode/src/tool/registry.ts
@@ -32,6 +32,7 @@ import { pathToFileURL } from "url"
 import { Effect, Layer, ServiceMap } from "effect"
 import { InstanceState } from "@/effect/instance-state"
 import { makeRuntime } from "@/effect/run-service"
+import { Env } from "../env"
 
 export namespace ToolRegistry {
   const log = Log.create({ service: "tool.registry" })
@@ -166,7 +167,8 @@ export namespace ToolRegistry {
           }
 
           const usePatch =
-            model.modelID.includes("gpt-") && !model.modelID.includes("oss") && !model.modelID.includes("gpt-4")
+            !!Env.get("OPENCODE_E2E_LLM_URL") ||
+            (model.modelID.includes("gpt-") && !model.modelID.includes("oss") && !model.modelID.includes("gpt-4"))
           if (tool.id === "apply_patch") return usePatch
           if (tool.id === "edit" || tool.id === "write") return !usePatch
 
@@ -204,10 +206,6 @@ export namespace ToolRegistry {
 
   const { runPromise } = makeRuntime(Service, defaultLayer)
 
-  export async function register(tool: Tool.Info) {
-    return runPromise((svc) => svc.register(tool))
-  }
-
   export async function ids() {
     return runPromise((svc) => svc.ids())
   }
```

#### packages/opencode/src/tool/todo.ts
```diff
diff --git a/packages/opencode/src/tool/todo.ts b/packages/opencode/src/tool/todo.ts
index 53b687b..a5e56cb 100644
--- a/packages/opencode/src/tool/todo.ts
+++ b/packages/opencode/src/tool/todo.ts
@@ -16,7 +16,7 @@ export const TodoWriteTool = Tool.define("todowrite", {
       metadata: {},
     })
 
-    Todo.update({
+    await Todo.update({
       sessionID: ctx.sessionID,
       todos: params.todos,
     })
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/tool/bash.txt.ts` - update based on opencode packages/opencode/src/tool/bash.txt changes
- `src/tool/registry.ts` - update based on opencode packages/opencode/src/tool/registry.ts changes
- `src/tool/todo.ts` - update based on opencode packages/opencode/src/tool/todo.ts changes
- `src/tool/tool-define.test.ts` - update based on opencode packages/opencode/test/tool/tool-define.test.ts changes
- `src/tool/tool.ts` - update based on opencode packages/opencode/src/tool/tool.ts changes
