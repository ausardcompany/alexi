# Upstream Changes Report
Generated: 2026-07-02 08:57:27

## Summary
- kilocode: 103 commits, 231 files changed
- opencode: 37 commits, 173 files changed

## kilocode Changes (78cdc9c89..2992e3e44)

### Commits

- 2992e3e44 - Merge pull request #11701 from Kilo-Org/fix/cli-apply-patch-model-family (Christiaan Arnoldus, 2026-07-02)
- 6a507daf4 - Merge pull request #11572 from ysheikh2/fix/aws-credential-provider-symbol-collision (Mark IJbema, 2026-07-02)
- b0d47f3d5 - Merge branch 'main' into fix/aws-credential-provider-symbol-collision (Mark IJbema, 2026-07-02)
- 06ccf1d25 - Merge pull request #11789 from Kilo-Org/mark/fix-random-test-failures (Mark IJbema, 2026-07-02)
- 078f4dba0 - Merge remote-tracking branch 'origin/main' into mark/fix-random-test-failures (markijbema, 2026-07-02)
- 66ab5eacc - Merge pull request #11723 from Kilo-Org/mark/filter-jetbrains-pre-push (Mark IJbema, 2026-07-02)
- 5f4c96bad - Merge pull request #11869 from Kilo-Org/slimy-principal (Kirill Kalishev, 2026-07-01)
- 5dd37c198 - Merge pull request #11522 from Kilo-Org/fix/vscode-subagent-output (Iván Uruchurtu, 2026-07-01)
- a3f1bd1db - docs(jetbrains): explain purged run IDE logs (kirillk, 2026-07-01)
- 1285e54be - chore(jetbrains): migrate to stable intellij gradle plugin (kirillk, 2026-07-01)
- 712de0e60 - Merge pull request #11084 from maphew/main (Marian Alexandru Alecu, 2026-07-01)
- ef013ba7b - Merge pull request #11850 from Kilo-Org/nervous-marionberry (Kirill Kalishev, 2026-07-01)
- 2a75b6cbe - fix(jetbrains): remove test-only recovery accessor (kirillk, 2026-07-01)
- 8b7b69b55 - Merge branch 'main' into main (Marian Alexandru Alecu, 2026-07-01)
- d5f9e53e7 - fix(jetbrains): address recovery review feedback (kirillk, 2026-07-01)
- 10eda62b0 - Merge pull request #11827 from Kilo-Org/mark/deflake-prompt-cancel-race (Catriel Müller, 2026-07-01)
- 39d852db0 - Merge pull request #11808 from Kilo-Org/keen-protocol (Kirill Kalishev, 2026-07-01)
- 9632ac3ad - Merge branch 'main' into fix/cli-apply-patch-model-family (Christiaan Arnoldus, 2026-07-01)
- 82e58b264 - fix(cli): defer plan finalize wording to Plan File reminder (kirillk, 2026-07-01)
- 2781d4508 - fix(cli): restore deprecated review aliases (Alex Alecu, 2026-07-01)
- 24ac4a2d0 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-07-01)
- 8ce0734d2 - Merge branch 'main' into fix/cli-apply-patch-model-family (Christiaan Arnoldus, 2026-07-01)
- b48570e93 - feat(memory): add @kilocode/kilo-memory effect runtime layer (#11845) (Johnny Eric Amancio, 2026-07-01)
- 107410091 - chore(ci): drop unused is_fork workflow output (markijbema, 2026-07-01)
- 6fa2a8466 - chore(ci): mark visual-regression workflow as kilo-only (markijbema, 2026-07-01)
- aa6e84dfc - test(cli): move model family httpapi coverage (chrarnoldus, 2026-07-01)
- 833c18d38 - fix(cli): expose family-aware experimental tools (chrarnoldus, 2026-07-01)
- 61bc5d688 - fix(cli): select apply_patch from model family (chrarnoldus, 2026-07-01)
- 98f873a42 - docs: clarify MCP config fallback (#11661) (Vishal Kumar Singh, 2026-07-01)
- 434e41079 - Merge pull request #11843 from Kilo-Org/fix/agent-manager-session-switch-offline (Marius, 2026-07-01)
- 19a44b23a - Merge branch 'main' into fix/agent-manager-session-switch-offline (Marius, 2026-07-01)
- 9638de532 - feat(vscode): show balance in account controls (#11803) (Johnny Eric Amancio, 2026-07-01)
- 341f51f00 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-07-01)
- 566e06953 - fix(memory): add core project memory package (#11355) (Johnny Eric Amancio, 2026-07-01)
- f0cbf8c2f - feat(core): add soft max-cost nudge state (#11831) (Johnny Eric Amancio, 2026-07-01)
- bf5c86601 - fix(session): trim whitespace from tool names in experimental_repairToolCall (#10886) (Daniel Gutknecht, 2026-07-01)
- 02c1177d6 - chore(jetbrains): address config action review (kirillk, 2026-06-30)
- d4db9c9be - fix(jetbrains): refresh config action paths (kirillk, 2026-06-30)
- 057dc97fb - fix(jetbrains): show CLI recovery popup from retry (kirillk, 2026-06-30)
- 4454800d5 - fix(jetbrains): float connection status above prompt (kirillk, 2026-06-30)
- 7c7694222 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-30)
- 1a0d27928 - Merge remote-tracking branch 'origin/main' into fix/vscode-subagent-output (Iván Uruchurtu, 2026-06-30)
- 11c6b7961 - fix(ci): include setup action filter (Alex Alecu, 2026-06-30)
- 4786b34dc - fix(agent-manager): replay focus load for cached sessions on reconnect (marius-kilocode, 2026-06-30)
- 76d0b2103 - fix(agent-manager): keep chat in sync with session selection while offline (marius-kilocode, 2026-06-30)
- ac93273e5 - fix(ci): harden visual regression installs (Alex Alecu, 2026-06-30)
- eb40da5c5 - Merge branch 'main' into main (Marian Alexandru Alecu, 2026-06-30)
- b6d02fd11 - Merge branch 'main' into main (Marian Alexandru Alecu, 2026-06-30)
- 96f9de4b8 - fix(cli): flush persistent process logs before readiness (Mark IJbema, 2026-06-30)
- 55f19320f - Merge remote-tracking branch 'origin/main' into mark/deflake-prompt-cancel-race (Mark IJbema, 2026-06-30)
- 06e346b89 - test(cli): annotate prompt flake fixture (Mark IJbema, 2026-06-30)
- 7183f5b7a - test(cli): deflake prompt cancellation race (Mark IJbema, 2026-06-30)
- 98ca191fc - test(cli): update review command expectations (Alex Alecu, 2026-06-30)
- cdd0137f2 - refactor(cli): focus soul on personality (Alex Alecu, 2026-06-30)
- 496f743b8 - Merge branch 'main' into main (Marian Alexandru Alecu, 2026-06-30)
- 341526fb8 - test(jetbrains): settle workspace loads before teardown (Mark IJbema, 2026-06-30)
- fe3a763c9 - feat(review): skip subagents on small diffs (Alex Alecu, 2026-06-30)
- 67d90bee8 - fix(jetbrains): join app load cancellation before restart (Mark IJbema, 2026-06-30)
- 7ddfc192f - fix(review): validate base refs (Alex Alecu, 2026-06-30)
- c2636fba5 - fix(review): reject merge commits (Alex Alecu, 2026-06-30)
- a0137413f - fix(review): narrow dead code (Alex Alecu, 2026-06-30)
- 8ea962848 - fix(review): keep legacy aliases (Alex Alecu, 2026-06-30)
- 00e3234c5 - Merge branch 'main' into mark/fix-random-test-failures (Mark IJbema, 2026-06-30)
- febdc269a - fix(cli): preserve plan approval for unsupported clients (kirillk, 2026-06-29)
- ce09eb39b - fix(cli): make plan follow-up refinement deterministic (kirillk, 2026-06-29)
- 1796189da - chore(ci): remove failure inventory from pr (Mark IJbema, 2026-06-29)
- 48f57835a - fix(ci): cover visual workflow markers (Mark IJbema, 2026-06-29)
- c31198616 - fix(ci): avoid visual baseline pushes without bot token (Mark IJbema, 2026-06-29)
- 41c6b5e4e - Merge remote-tracking branch 'origin/main' into mark/fix-random-test-failures (Mark IJbema, 2026-06-29)
- ab2631511 - fix(ci): annotate visual token fallback (Mark IJbema, 2026-06-29)
- 6c4256c30 - fix(ci): fall back to github token for visual checkout (Mark IJbema, 2026-06-29)
- c979c8b32 - test(jetbrains): wait for mock CLI accept loop (Mark IJbema, 2026-06-29)
- 75a0e591c - test(jetbrains): await mention resolution state (Mark IJbema, 2026-06-29)
- 9dff34c7e - chore(ci): document recent failed test runs (Mark IJbema, 2026-06-29)
- b5525fdbb - Merge branch 'main' into main (Marian Alexandru Alecu, 2026-06-26)
- be4f8eb46 - fix: skip JetBrains hook for unrelated changes (markijbema, 2026-06-26)
- 468190fc8 - test(cli): refresh llm fixtures (Alex Alecu, 2026-06-25)
- 98189963e - Merge branch 'main' into main (Marian Alexandru Alecu, 2026-06-25)
- 4371c446a - Merge branch 'main' into fix/aws-credential-provider-symbol-collision (Yasser Sheikh, 2026-06-25)
- ef3c23c6b - fix(review): prefer commit refs (Alex Alecu, 2026-06-25)
- 830199bd0 - Merge branch 'main' into main (Marian Alexandru Alecu, 2026-06-25)
- 3e7e03d87 - Merge remote-tracking branch 'origin/main' into maphew/main (Alex Alecu, 2026-06-25)
- 04c87809f - fix(cli): make /review the only review command (Alex Alecu, 2026-06-25)
- d65146b25 - Update .changeset/fix-aws-credential-symbol-collision.md (Yasser Sheikh, 2026-06-23)
- 8eb274872 - Merge branch 'main' into fix/aws-credential-provider-symbol-collision (Yasser Sheikh, 2026-06-23)
- cf34fae20 - fix(vscode): clean up comment in esbuild config (Yasser Sheikh, 2026-06-23)
- aa19c9839 - chore: add changeset for AWS credential provider fix (Yasser Sheikh, 2026-06-23)
- 6a5bf6e6d - fix(vscode): disable identifier minification to prevent AWS SDK Symbol collision (Yasser Sheikh, 2026-06-23)
- 375ab8958 - fix(vscode): remove nested MCP code surface (Iván Uruchurtu, 2026-06-22)
- 9f0c03539 - fix(vscode): unify MCP output surface (Iván Uruchurtu, 2026-06-22)
- 72df634fb - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-21)
- 58cb8f541 - fix(vscode): align subagent output padding (Iván Uruchurtu, 2026-06-21)
- db24fe97a - fix(vscode): preserve subagent scroll on completion (Iván Uruchurtu, 2026-06-21)
- 9f1f7411b - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-21)
- f42441b31 - fix(vscode): complete tool call matrix (Iván Uruchurtu, 2026-06-21)
- 5978bf733 - fix(cli): preserve legacy review command aliases (maphew, 2026-06-18)
- dfaca497c - feat(opencode): unify local review commands under `/review` (maphew, 2026-06-18)
- 413424342 - Merge branch 'main' into main (matt wilkie, 2026-06-17)
- 6165acb29 - Merge branch 'main' into main (matt wilkie, 2026-06-15)
- 66e9bbf49 - Merge branch 'main' into main (matt wilkie, 2026-06-12)
- 396845f85 - fix(cli): handle argument-based /review invocations in deprecated command (kiloconnect[bot], 2026-06-11)
- 69e5c58eb - fix(cli): resolve review bot code issues and add changeset (matt wilkie, 2026-06-10)
- 46c04f049 - fix(cli): redirect deprecated /review to /local-review-uncommitted (matt wilkie, 2026-06-10)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/registry.ts` (+11, -0)
- `packages/opencode/src/tool/registry.ts` (+9, -6)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/src/kilocode/cost/max-cost-nudge.ts` (+151, -0)
- `packages/core/test/kilocode/cost/max-cost-nudge.test.ts` (+280, -0)

#### Other Changes
- `.changeset/fix-agent-manager-session-switch-offline.md` (+5, -0)
- `.changeset/fix-aws-credential-symbol-collision.md` (+5, -0)
- `.changeset/fix-review-command-issues.md` (+5, -0)
- `.changeset/fix-subagent-output.md` (+5, -0)
- `.changeset/jetbrains-config-paths.md` (+5, -0)
- `.changeset/kilo-memory-core.md` (+7, -0)
- `.changeset/plan-followup-refine.md` (+6, -0)
- `.changeset/use-gpt-family-patching.md` (+5, -0)
- `.changeset/warm-balance-chip.md` (+5, -0)
- `.github/workflows/visual-regression.yml` (+50, -65)
- `.husky/pre-push` (+31, -1)
- `CONTRIBUTING.md` (+3, -1)
- `bun.lock` (+16, -0)
- `nix/hashes.json` (+4, -4)
- `packages/kilo-docs/pages/automate/agent-manager-workflows.md` (+5, -3)
- `packages/kilo-docs/pages/automate/code-reviews/overview.md` (+12, -6)
- `packages/kilo-docs/pages/automate/mcp/using-in-kilo-code.md` (+2, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli.md` (+6, -4)
- `packages/kilo-docs/pages/code-with-ai/platforms/vscode/whats-new.md` (+1, -1)
- `packages/kilo-docs/pages/contributing/architecture/jetbrains-plugin.md` (+4, -4)
- `packages/kilo-docs/pages/contributing/development-environment.md` (+1, -1)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/labs-tool-call-lab/search-previews-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/profile/logged-in-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/profile/logged-in-personal-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/source-links.md` (+3, -0)
- `packages/kilo-i18n/src/ar.ts` (+2, -0)
- `packages/kilo-i18n/src/br.ts` (+2, -0)
- `packages/kilo-i18n/src/bs.ts` (+2, -0)
- `packages/kilo-i18n/src/da.ts` (+2, -0)
- `packages/kilo-i18n/src/de.ts` (+2, -0)
- `packages/kilo-i18n/src/en.ts` (+2, -0)
- `packages/kilo-i18n/src/es.ts` (+2, -0)
- `packages/kilo-i18n/src/fr.ts` (+2, -0)
- `packages/kilo-i18n/src/it.ts` (+2, -0)
- `packages/kilo-i18n/src/ja.ts` (+2, -0)
- `packages/kilo-i18n/src/ko.ts` (+2, -0)
- `packages/kilo-i18n/src/nl.ts` (+2, -0)
- `packages/kilo-i18n/src/no.ts` (+2, -0)
- `packages/kilo-i18n/src/pl.ts` (+2, -0)
- `packages/kilo-i18n/src/ru.ts` (+2, -0)
- `packages/kilo-i18n/src/th.ts` (+2, -0)
- `packages/kilo-i18n/src/tr.ts` (+2, -0)
- `packages/kilo-i18n/src/uk.ts` (+2, -0)
- `packages/kilo-i18n/src/zh.ts` (+2, -0)
- `packages/kilo-i18n/src/zht.ts` (+2, -0)
- `packages/kilo-jetbrains/.run/Run IDE (Backend).run.xml` (+1, -1)
- `packages/kilo-jetbrains/.run/Run IDE (Frontend).run.xml` (+1, -1)
- `packages/kilo-jetbrains/.run/runIdeSplitMode.run.xml` (+25, -3)
- `packages/kilo-jetbrains/AGENTS.md` (+6, -6)
- `packages/kilo-jetbrains/README.md` (+13, -10)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendAppService.kt` (+22, -2)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloCliConfigPath.kt` (+8, -10)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/KiloCliConfigPathTest.kt` (+80, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/MockCliServer.kt` (+6, -2)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/workspace/KiloBackendWorkspaceTest.kt` (+11, -0)
- `packages/kilo-jetbrains/build.gradle.kts` (+18, -13)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/ActionEventWorkspace.kt` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/KiloActionPlaces.kt` (+9, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/KiloSettingsAction.kt` (+19, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/OpenConfigActions.kt` (+16, -9)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/ReinstallKiloAction.kt` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/RestartKiloAction.kt` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloWorkspaceService.kt` (+36, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+15, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/ConnectionPanel.kt` (+55, -9)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/PromptPanel.kt` (+1, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/style/SessionUiStyle.kt` (+5, -15)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ar.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_bs.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_da.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_de.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_es.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_fr.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ja.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ko.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_nl.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_no.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pl.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pt_BR.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ru.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_th.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_tr.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_uk.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_CN.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_TW.properties` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/KiloRecoveryActionsTest.kt` (+154, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionUiLayoutTest.kt` (+27, -12)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/ConnectionPanelTest.kt` (+17, -29)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/prompt/MentionNavigatorTest.kt` (+5, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeWorkspaceRpcApi.kt` (+4, -0)
- `packages/kilo-jetbrains/gradle/libs.versions.toml` (+1, -1)
- `packages/kilo-jetbrains/settings.gradle.kts` (+0, -12)
- `packages/kilo-memory/package.json` (+61, -0)
- `packages/kilo-memory/src/capture/capture.ts` (+7, -0)
- `packages/kilo-memory/src/capture/diff.ts` (+29, -0)
- `packages/kilo-memory/src/capture/digest-text.ts` (+51, -0)
- `packages/kilo-memory/src/capture/digest.ts` (+15, -0)
- `packages/kilo-memory/src/capture/ops.ts` (+342, -0)
- `packages/kilo-memory/src/capture/outcome.ts` (+222, -0)
- `packages/kilo-memory/src/capture/parse.ts` (+147, -0)
- `packages/kilo-memory/src/capture/plan.ts` (+59, -0)
- `packages/kilo-memory/src/capture/redact.ts` (+90, -0)
- `packages/kilo-memory/src/capture/reject.ts` (+44, -0)
- `packages/kilo-memory/src/commands.ts` (+134, -0)
- `packages/kilo-memory/src/effect/capture.ts` (+509, -0)
- `packages/kilo-memory/src/effect/config.ts` (+13, -0)
- `packages/kilo-memory/src/effect/errors.ts` (+168, -0)
- `packages/kilo-memory/src/effect/events.ts` (+123, -0)
- `packages/kilo-memory/src/effect/index.ts` (+340, -0)
- `packages/kilo-memory/src/effect/instance.ts` (+16, -0)
- `packages/kilo-memory/src/effect/log.ts` (+15, -0)
- `packages/kilo-memory/src/effect/paths.ts` (+32, -0)
- `packages/kilo-memory/src/effect/ports.ts` (+48, -0)
- `packages/kilo-memory/src/effect/service.ts` (+256, -0)
- `packages/kilo-memory/src/effect/timers.ts` (+55, -0)
- `packages/kilo-memory/src/effect/turn.ts` (+103, -0)
- `packages/kilo-memory/src/index.ts` (+11, -0)
- `packages/kilo-memory/src/memory-notice.ts` (+36, -0)
- `packages/kilo-memory/src/memory.ts` (+359, -0)
- `packages/kilo-memory/src/prompts/session-digest.txt` (+33, -0)
- `packages/kilo-memory/src/prompts/txt.d.ts` (+4, -0)
- `packages/kilo-memory/src/prompts/typed-consolidation.txt` (+95, -0)
- `packages/kilo-memory/src/recall/budget.ts` (+108, -0)
- `packages/kilo-memory/src/recall/index-format.ts` (+96, -0)
- `packages/kilo-memory/src/recall/indexer.ts` (+195, -0)
- `packages/kilo-memory/src/recall/recall.ts` (+263, -0)
- `packages/kilo-memory/src/recall/shared.ts` (+111, -0)
- `packages/kilo-memory/src/recall/token.ts` (+7, -0)
- `packages/kilo-memory/src/recall/topics.ts` (+50, -0)
- `packages/kilo-memory/src/schema.ts` (+212, -0)
- `packages/kilo-memory/src/slug.ts` (+25, -0)
- `packages/kilo-memory/src/storage/audit.ts` (+130, -0)
- `packages/kilo-memory/src/storage/fs.ts` (+246, -0)
- `packages/kilo-memory/src/storage/markdown.ts` (+74, -0)
- `packages/kilo-memory/src/storage/paths.ts` (+133, -0)
- `packages/kilo-memory/src/storage/sessions.ts` (+177, -0)
- `packages/kilo-memory/src/storage/sources.ts` (+69, -0)
- `packages/kilo-memory/src/storage/state.ts` (+234, -0)
- `packages/kilo-memory/src/storage/store.ts` (+44, -0)
- `packages/kilo-memory/src/text.ts` (+20, -0)
- `packages/kilo-memory/test/capture.test.ts` (+506, -0)
- `packages/kilo-memory/test/command-cases.json` (+119, -0)
- `packages/kilo-memory/test/commands.test.ts` (+54, -0)
- `packages/kilo-memory/test/core.test.ts` (+1141, -0)
- `packages/kilo-memory/test/effect-capture.test.ts` (+205, -0)
- `packages/kilo-memory/test/markdown.test.ts` (+106, -0)
- `packages/kilo-memory/test/memory.test.ts` (+139, -0)
- `packages/kilo-memory/test/recall-fixtures.test.ts` (+170, -0)
- `packages/kilo-memory/test/text.test.ts` (+20, -0)
- `packages/kilo-memory/tsconfig.json` (+15, -0)
- `packages/kilo-telemetry/src/telemetry.ts` (+5, -2)
- `packages/kilo-vscode/esbuild.js` (+7, -1)
- `packages/kilo-vscode/tests/unit/kilo-provider-utils.test.ts` (+3, -3)
- `packages/kilo-vscode/tests/unit/plan-followup-locale-keys.test.ts` (+2, -0)
- `packages/kilo-vscode/tests/unit/session-select-connection.test.ts` (+72, -0)
- `packages/kilo-vscode/tests/unit/suggestion-recovery.test.ts` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskHeader.tsx` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskToolExpanded.tsx` (+21, -3)
- `packages/kilo-vscode/webview-ui/src/components/profile/ProfileView.tsx` (+149, -32)
- `packages/kilo-vscode/webview-ui/src/components/shared/AccountSwitcher.tsx` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/components/shared/BalanceChip.tsx` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+43, -8)
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
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/stories/chat.stories.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/stories/profile.stories.tsx` (+8, -1)
- `packages/kilo-vscode/webview-ui/src/stories/tool-call-lab.stories.tsx` (+888, -131)
- `packages/kilo-vscode/webview-ui/src/styles/tool-overrides.css` (+32, -0)
- `packages/kilo-vscode/webview-ui/src/styles/welcome.css` (+18, -3)
- `packages/kilo-vscode/webview-ui/src/types/messages/profile.ts` (+8, -0)
- `packages/opencode/src/command/index.ts` (+8, -23)
- `packages/opencode/src/kilocode/background-process/runner.ts` (+12, -12)
- `packages/opencode/src/kilocode/cli/cmd/command-display.ts` (+3, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/feature-plugins/home/tips.ts` (+1, -1)
- `packages/opencode/src/kilocode/components/tips.tsx` (+1, -1)
- `packages/opencode/src/kilocode/plan-followup.ts` (+20, -0)
- `packages/opencode/src/kilocode/review/command.ts` (+33, -19)
- `packages/opencode/src/kilocode/review/local-review-uncommitted.txt` (+0, -238)
- `packages/opencode/src/kilocode/review/review.ts` (+1, -1)
- `packages/opencode/src/kilocode/review/{local-review.txt => review.txt}` (+90, -42)
- `packages/opencode/src/kilocode/session/native-plan-prompt.txt` (+4, -9)
- `packages/opencode/src/kilocode/session/processor.ts` (+4, -3)
- `packages/opencode/src/kilocode/session/prompt.ts` (+8, -2)
- `packages/opencode/src/kilocode/soul.txt` (+1, -14)
- `packages/opencode/src/kilocode/suggestion/tool.txt` (+4, -4)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/experimental.ts` (+9, -1)
- `packages/opencode/src/session/llm.ts` (+1, -1)
- `packages/opencode/src/session/prompt.ts` (+64, -0)
- `packages/opencode/src/session/tools.ts` (+1, -0)
- `packages/opencode/test/fixtures/recordings/kilocode/session/native-anthropic-tool-loop.json` (+2, -2)
- `packages/opencode/test/fixtures/recordings/kilocode/session/native-openai-oauth-tool-loop.json` (+2, -2)
- `packages/opencode/test/fixtures/recordings/kilocode/session/native-zen-tool-loop.json` (+2, -2)
- `packages/opencode/test/kilocode/cli/cmd/tui/attention.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/local-review-command.test.ts` (+0, -180)
- `packages/opencode/test/kilocode/plan-exit-detection.test.ts` (+63, -0)
- `packages/opencode/test/kilocode/plan-followup.test.ts` (+55, -6)
- `packages/opencode/test/kilocode/review-command.test.ts` (+173, -0)
- `packages/opencode/test/kilocode/server/httpapi-experimental.test.ts` (+75, -0)
- `packages/opencode/test/kilocode/session-processor-review-telemetry.test.ts` (+5, -5)
- `packages/opencode/test/kilocode/session-prompt-queue.test.ts` (+4, -4)
- `packages/opencode/test/kilocode/sessions/remote-sender.test.ts` (+4, -4)
- `packages/opencode/test/kilocode/suggestion/auto-dismiss.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/suggestion/suggestion.test.ts` (+25, -25)
- `packages/opencode/test/kilocode/suggestion/tool.test.ts` (+28, -28)
- `packages/opencode/test/kilocode/tool-registry-apply-patch.test.ts` (+59, -0)
- `packages/opencode/test/session/llm.test.ts` (+96, -0)
- `packages/opencode/test/session/prompt.test.ts` (+71, -20)
- `script/upstream/VERIFICATION_TEST.md` (+2, -2)

### Key Diffs

#### packages/core/src/kilocode/cost/max-cost-nudge.ts
```diff
diff --git a/packages/core/src/kilocode/cost/max-cost-nudge.ts b/packages/core/src/kilocode/cost/max-cost-nudge.ts
new file mode 100644
index 000000000..b276689b4
--- /dev/null
+++ b/packages/core/src/kilocode/cost/max-cost-nudge.ts
@@ -0,0 +1,151 @@
+/**
+ * Soft per-session max-cost nudge.
+ *
+ * Alert (not hard-stop) the moment a session's cumulative cost crosses a
+ * whole-dollar threshold. The alert is non-blocking: the session keeps running
+ * while it is shown. Continue dismisses it (won't nag again for that limit);
+ * Stop is the surface's cue to abort.
+ *
+ * Cost signal: `SessionTable.cost` is written via direct SQL during message-part
+ * projection, so `session.updated` does NOT fire on cost change. The reliable
+ * signal is the per-assistant-message `cost`, summed here into a session total.
+ */
+
+export type MaxCostChoice = "continue" | "stop"
+
+// Minimal shape of a message needed to aggregate session cost.
+export interface MaxCostMessage {
+  id: string
+  sessionID: string
+  role?: string
+  cost?: number
+}
+
+export class MaxCostNudge {
+  readonly #msgs = new Map<string, { sid: string; cost: number }>()
+  readonly #totals = new Map<string, number>()
+  readonly #floors = new Map<string, number>()
+  readonly #alerted = new Map<string, Set<number>>() // sid -> limit values shown this run
+  readonly #acked = new Map<string, Set<number>>() // sid -> limit values continued past
+
+  #limit: number | undefined
+
+  // `> 0` rounds up to whole dollars; everything else disables (undefined).
+  static normalizeLimit(value: number | undefined | null): number | undefined {
+    if (value == null || !Number.isFinite(value) || value <= 0) return undefined
+    return Math.ceil(value)
+  }
+
+  // Format a cost as `$X.XX`, with 4 decimals below $1.
+  static formatCost(value: number): string {
+    return `$${value.toFixed(value < 1 ? 4 : 2)}`
+  }
+
+  setLimit(value: number | undefined | null): void {
```

#### packages/core/test/kilocode/cost/max-cost-nudge.test.ts
```diff
diff --git a/packages/core/test/kilocode/cost/max-cost-nudge.test.ts b/packages/core/test/kilocode/cost/max-cost-nudge.test.ts
new file mode 100644
index 000000000..adcded41c
--- /dev/null
+++ b/packages/core/test/kilocode/cost/max-cost-nudge.test.ts
@@ -0,0 +1,280 @@
+import { describe, expect, test } from "bun:test"
+import { MaxCostNudge } from "../../../src/kilocode/cost/max-cost-nudge"
+
+const sid = "ses_1"
+
+function assistant(id: string, cost: number, sessionID = sid) {
+  return { id, sessionID, role: "assistant", cost }
+}
+
+describe("MaxCostNudge.normalizeLimit", () => {
+  test("disables unset and non-positive values", () => {
+    expect(MaxCostNudge.normalizeLimit(undefined)).toBeUndefined()
+    expect(MaxCostNudge.normalizeLimit(null)).toBeUndefined()
+    expect(MaxCostNudge.normalizeLimit(0)).toBeUndefined()
+    expect(MaxCostNudge.normalizeLimit(-1)).toBeUndefined()
+    expect(MaxCostNudge.normalizeLimit(Number.NaN)).toBeUndefined()
+  })
+
+  test("rounds positive values up to whole dollars", () => {
+    expect(MaxCostNudge.normalizeLimit(5)).toBe(5)
+    expect(MaxCostNudge.normalizeLimit(4.2)).toBe(5)
+    expect(MaxCostNudge.normalizeLimit(0.01)).toBe(1)
+  })
+})
+
+describe("MaxCostNudge.formatCost", () => {
+  test("uses extra precision below one dollar", () => {
+    expect(MaxCostNudge.formatCost(0.5)).toBe("$0.5000")
+    expect(MaxCostNudge.formatCost(0.0001)).toBe("$0.0001")
+    expect(MaxCostNudge.formatCost(1.5)).toBe("$1.50")
+    expect(MaxCostNudge.formatCost(12)).toBe("$12.00")
+  })
+})
+
+describe("MaxCostNudge cost aggregation", () => {
+  test("sums assistant costs for the requested session", () => {
+    const nudge = new MaxCostNudge()
+    const total = nudge.resetMessageCosts(sid, [
+      assistant("a1", 1),
+      { id: "u1", sessionID: sid, role: "user" },
+      assistant("a2", 2.5),
+      assistant("a3", 9, "ses_2"),
+    ])
+
```

#### packages/opencode/src/kilocode/tool/registry.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/registry.ts b/packages/opencode/src/kilocode/tool/registry.ts
index 4927d03b1..ed71348bc 100644
--- a/packages/opencode/src/kilocode/tool/registry.ts
+++ b/packages/opencode/src/kilocode/tool/registry.ts
@@ -33,6 +33,17 @@ export namespace KiloToolRegistry {
     return config.indexing?.enabled ?? global?.indexing?.enabled
   }
 
+  export function usePatch(input: { modelID: string; family?: string }) {
+    if (process.env["KILO_E2E_LLM_URL"]) return true
+
+    const id = input.modelID.toLowerCase()
+    const family = input.family?.toLowerCase()
+    if (id.includes("gpt-4") || family?.startsWith("gpt-4")) return false
+    if (id.includes("oss") || family?.includes("oss") || family === "gpt-image") return false
+    if (id.includes("gpt-")) return true
+    return family?.startsWith("gpt") ?? false
+  }
+
   /** Resolve Kilo-specific tool Infos outside any InstanceState, so their Truncate/Agent deps are
    * satisfied at the outer registry scope instead of leaking into InstanceState's Effect. */
   export function infos(notebook?: Notebook.Interface) {
```

#### packages/opencode/src/tool/registry.ts
```diff
diff --git a/packages/opencode/src/tool/registry.ts b/packages/opencode/src/tool/registry.ts
index daa644b36..26c5fbaf3 100644
--- a/packages/opencode/src/tool/registry.ts
+++ b/packages/opencode/src/tool/registry.ts
@@ -86,7 +86,14 @@ export interface Interface {
   readonly ids: () => Effect.Effect<string[]>
   readonly all: () => Effect.Effect<Tool.Def[]>
   readonly named: () => Effect.Effect<{ task: TaskDef; read: ReadDef }>
-  readonly tools: (model: { providerID: ProviderID; modelID: ModelID; agent: Agent.Info }) => Effect.Effect<Tool.Def[]>
+  // kilocode_change start
+  readonly tools: (model: {
+    providerID: ProviderID
+    modelID: ModelID
+    family?: string
+    agent: Agent.Info
+  }) => Effect.Effect<Tool.Def[]>
+  // kilocode_change end
 }
 
 export class Service extends Context.Service<Service, Interface>()("@opencode/ToolRegistry") {}
@@ -361,11 +368,7 @@ export const layer: Layer.Layer<
           return webSearchEnabled(input.providerID, { exa: flags.enableExa, parallel: flags.enableParallel })
         }
 
-        const usePatch =
-          // kilocode_change start
-          !!process.env["KILO_E2E_LLM_URL"] ||
-          (input.modelID.includes("gpt-") && !input.modelID.includes("oss") && !input.modelID.includes("gpt-4"))
-        // kilocode_change end
+        const usePatch = KiloToolRegistry.usePatch(input) // kilocode_change
         if (tool.id === ApplyPatchTool.id) return usePatch
         if (tool.id === EditTool.id) return !usePatch // kilocode_change
 
```


## opencode Changes (f014686..f52424e)

### Commits

- f52424e - fix(ui): resolve toast icon inside the toast component (#34874) (Luke Parker, 2026-07-02)
- 4a42cae - fix(app): keep terminal mounted when switching session tabs in a workspace (#34852) (Luke Parker, 2026-07-02)
- 7d26186 - feat(app): v2 review panel overhaul (#31882) (Aarav Sareen, 2026-07-02)
- fbb95a6 - fix(app): seed session status before warming session info (#34864) (Luke Parker, 2026-07-02)
- 4023359 - fix(app): clear original prompt after retarget (#34863) (Brendan Allan, 2026-07-02)
- 403164a - chore: generate (opencode-agent[bot], 2026-07-02)
- 1fb2ecc - fix(app): scope session tab indicators to the tab's server (#34861) (Luke Parker, 2026-07-02)
- 27c9b13 - test(opencode): cover Windows session list directory spellings (#34857) (Luke Parker, 2026-07-02)
- 5fecf7a - fix(app): only allow \(...\) syntax for inline latex (#34850) (Brendan Allan, 2026-07-02)
- a0d64b1 - fix(opencode): filter session list by resolved instance directory (#34842) (Luke Parker, 2026-07-02)
- d6b8971 - chore: generate (opencode-agent[bot], 2026-07-02)
- 39dfbb5 - fix(app): resolve target session lineage outside router transition (#34838) (Luke Parker, 2026-07-02)
- a39db9c - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-02)
- 6ca60d9 - fix(opencode): update Cerebras SDK reasoning replay (#34826) (opencode-agent[bot], 2026-07-01)
- b393499 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-02)
- 4de7e90 - fix(ui): raise v2 tooltip layer (#34455) (opencode-agent[bot], 2026-07-02)
- 917eca4 - feat(desktop): refine session tab preview popover (#34792) (usrnk1, 2026-07-02)
- 3cf7180 - fix(app): stabilize session timeline layout continuity (#34533) (Luke Parker, 2026-07-02)
- f266e82 - fix(desktop): keep window tabs across app close (#34807) (Luke Parker, 2026-07-01)
- 3df5556 - zen: new inference (Frank, 2026-07-01)
- fc29f99 - fix(stats): include locale header in vary (#34789) (Adam, 2026-07-01)
- beb586a - fix(stats): refine lab page tooltips (Adam, 2026-07-01)
- 5668d36 - chore: generate (opencode-agent[bot], 2026-07-01)
- 3706b33 - feat(stats): use catalog descriptions (Adam, 2026-07-01)
- 85e8ac3 - feat(data): another redesigned lab section (Adam, 2026-07-01)
- 91ca75c - feat(stats): redesign lab usage (Adam, 2026-07-01)
- 262ef4f - feat(stats): add lab overview (Adam, 2026-07-01)
- 74e5644 - feat(stats): redesign lab hero (Adam, 2026-07-01)
- 7de5aa0 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-01)
- 9495e3e - chore: bump gitlab-ai-provider to 6.10.0 (#34756) (Vladimir Glafirov, 2026-07-01)
- 1e73b76 - sync release versions for v1.17.13 (opencode, 2026-07-01)
- 6697cf3 - feat(app): minor fixes (#34748) (Aarav Sareen, 2026-07-01)
- 87aa62d - chore: generate (opencode-agent[bot], 2026-07-01)
- 3136b1b - feat(desktop): improve markdown heading spacing in session timeline (#34738) (usrnk1, 2026-07-01)
- 246dea3 - feat(app): more v2 ui alignment (#34465) (Aarav Sareen, 2026-07-01)
- 4b1c7f2 - chore: generate (opencode-agent[bot], 2026-07-01)
- 9410eda - feat(app): composer improvements (#34720) (Aarav Sareen, 2026-07-01)

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
- `packages/core/package.json` (+2, -2)
- `packages/stats/core/package.json` (+1, -1)

#### Other Changes
- `bun.lock` (+48, -31)
- `nix/hashes.json` (+4, -4)
- `packages/app/e2e/performance/timeline-stability/README.md` (+61, -0)
- `packages/app/e2e/performance/timeline-stability/adverse.spec.ts` (+250, -0)
- `packages/app/e2e/performance/timeline-stability/context-matrix.spec.ts` (+192, -0)
- `packages/app/e2e/performance/timeline-stability/environment-matrix.spec.ts` (+113, -0)
- `packages/app/e2e/performance/timeline-stability/file-matrix.spec.ts` (+121, -0)
- `packages/app/e2e/performance/timeline-stability/file-mutation.spec.ts` (+113, -0)
- `packages/app/e2e/performance/timeline-stability/fixture.test.ts` (+68, -0)
- `packages/app/e2e/performance/timeline-stability/fixture.ts` (+561, -0)
- `packages/app/e2e/performance/timeline-stability/interaction.spec.ts` (+242, -0)
- `packages/app/e2e/performance/timeline-stability/lifecycle.spec.ts` (+157, -0)
- `packages/app/e2e/performance/timeline-stability/oracle-browser.spec.ts` (+75, -0)
- `packages/app/e2e/performance/timeline-stability/playwright.config.ts` (+17, -0)
- `packages/app/e2e/performance/timeline-stability/scroll-interaction.spec.ts` (+319, -0)
- `packages/app/e2e/performance/timeline-stability/shell-matrix.spec.ts` (+255, -0)
- `packages/app/e2e/performance/timeline-stability/tool-mutation.spec.ts` (+106, -0)
- `packages/app/e2e/performance/timeline-stability/tools.spec.ts` (+198, -0)
- `packages/app/e2e/performance/timeline-stability/transition-matrix.spec.ts` (+272, -0)
- `packages/app/e2e/performance/timeline/session-tab-switch-benchmark.spec.ts` (+68, -3)
- `packages/app/e2e/performance/timeline/session-tab-switch-metrics.ts` (+10, -0)
- `packages/app/e2e/performance/timeline/session-tab-switch-probe.ts` (+35, -1)
- `packages/app/e2e/performance/timeline/session-timeline-benchmark.fixture.ts` (+31, -14)
- `packages/app/e2e/performance/timeline/session-timeline-benchmark.spec.ts` (+271, -50)
- `packages/app/e2e/performance/timeline/timeline-test-helpers.ts` (+55, -1)
- `packages/app/e2e/performance/unit/visual-stability.test.ts` (+392, -0)
- `packages/app/e2e/regression/prompt-thinking-level.spec.ts` (+1, -1)
- `packages/app/e2e/regression/remote-tab-busy.spec.ts` (+109, -0)
- `packages/app/e2e/regression/review-image-flash.spec.ts` (+202, -0)
- `packages/app/e2e/regression/session-timeline-accessibility.spec.ts` (+22, -0)
- `packages/app/e2e/regression/session-timeline-context-resize.spec.ts` (+116, -9)
- `packages/app/e2e/regression/session-timeline-context-state.spec.ts` (+31, -0)
- `packages/app/e2e/regression/session-timeline-file-projection.spec.ts` (+52, -0)
- `packages/app/e2e/regression/session-timeline-file-state.spec.ts` (+94, -0)
- `packages/app/e2e/regression/session-timeline-lifecycle-state.spec.ts` (+94, -0)
- `packages/app/e2e/regression/session-timeline-locale-projection.spec.ts` (+25, -0)
- `packages/app/e2e/regression/session-timeline-projection.spec.ts` (+284, -0)
- `packages/app/e2e/regression/session-timeline-reasoning-projection.spec.ts` (+93, -0)
- `packages/app/e2e/regression/session-timeline-reducer-projection.spec.ts` (+43, -0)
- `packages/app/e2e/regression/session-timeline-tool-projection.spec.ts` (+99, -0)
- `packages/app/e2e/regression/session-timeline-tool-state.spec.ts` (+77, -0)
- `packages/app/e2e/regression/session-timeline-transport.spec.ts` (+116, -0)
- `packages/app/e2e/regression/subagent-child-navigation.spec.ts` (+200, -0)
- `packages/app/e2e/regression/terminal-tab-switch.spec.ts` (+145, -0)
- `packages/app/e2e/tsconfig.json` (+8, -1)
- `packages/app/e2e/utils/mock-server.ts` (+9, -1)
- `packages/app/e2e/utils/sse-transport.ts` (+284, -0)
- `packages/app/e2e/utils/visual-stability.ts` (+54, -0)
- `packages/app/e2e/utils/visual-stability/analyzer.ts` (+209, -0)
- `packages/app/e2e/utils/visual-stability/capture.ts` (+51, -0)
- `packages/app/e2e/utils/visual-stability/index.ts` (+8, -0)
- `packages/app/e2e/utils/visual-stability/invariant.ts` (+112, -0)
- `packages/app/e2e/utils/visual-stability/model.ts` (+47, -0)
- `packages/app/e2e/utils/visual-stability/probe.ts` (+226, -0)
- `packages/app/e2e/utils/visual-stability/regions.ts` (+18, -0)
- `packages/app/e2e/utils/visual-stability/reporter.ts` (+63, -0)
- `packages/app/e2e/utils/visual-stability/scenario.ts` (+20, -0)
- `packages/app/package.json` (+4, -1)
- `packages/app/src/app.tsx` (+4, -1)
- `packages/app/src/components/dialog-manage-models.tsx` (+162, -1)
- `packages/app/src/components/dialog-select-model.tsx` (+286, -1)
- `packages/app/src/components/file-tree-v2.tsx` (+421, -0)
- `packages/app/src/components/file-tree.tsx` (+5, -5)
- `packages/app/src/components/prompt-input.tsx` (+100, -43)
- `packages/app/src/components/prompt-input/submission-state.ts` (+2, -0)
- `packages/app/src/components/session-context-usage.tsx` (+28, -37)
- `packages/app/src/components/titlebar-tab-nav.tsx` (+1, -8)
- `packages/app/src/components/titlebar-tab-popover.css` (+18, -24)
- `packages/app/src/components/titlebar-tab-popover.tsx` (+11, -18)
- `packages/app/src/components/titlebar-tab-strip.tsx` (+0, -4)
- `packages/app/src/components/titlebar.tsx` (+0, -1)
- `packages/app/src/context/comments.tsx` (+9, -1)
- `packages/app/src/context/file/tree-store.ts` (+5, -1)
- `packages/app/src/context/global-sync/bootstrap.test.ts` (+99, -34)
- `packages/app/src/context/global-sync/bootstrap.ts` (+22, -18)
- `packages/app/src/context/server-session.ts` (+2, -1)
- `packages/app/src/index.css` (+57, -1)
- `packages/app/src/pages/home.tsx` (+3, -12)
- `packages/app/src/pages/layout/project-avatar-state.ts` (+21, -9)
- `packages/app/src/pages/layout/session-tab-avatar.tsx` (+7, -4)
- `packages/app/src/pages/session.tsx` (+140, -39)
- `packages/app/src/pages/session/session-lineage.ts` (+69, -0)
- `packages/app/src/pages/session/timeline/message-timeline.tsx` (+39, -21)
- `packages/app/src/pages/session/timeline/projection.test.ts` (+96, -0)
- `packages/app/src/pages/session/timeline/projection.ts` (+3, -12)
- `packages/app/src/pages/session/timeline/row-reconciliation.ts` (+56, -0)
- `packages/app/src/pages/session/timeline/rows.ts` (+3, -78)
- `packages/app/src/pages/session/timeline/timeline-row.ts` (+80, -0)
- `packages/app/src/pages/session/v2/review-diff-kinds.test.ts` (+23, -0)
- `packages/app/src/pages/session/v2/review-diff-kinds.ts` (+42, -0)
- `packages/app/src/pages/session/v2/review-panel-v2-state.ts` (+40, -0)
- `packages/app/src/pages/session/v2/review-panel-v2.tsx` (+234, -0)
- `packages/app/src/pages/session/v2/session-file-list-v2.tsx` (+109, -0)
- `packages/app/src/utils/server-errors.ts` (+14, -0)
- `packages/app/src/utils/session-route.test.ts` (+1, -14)
- `packages/app/src/utils/session-route.ts` (+0, -9)
- `packages/app/test-browser/prompt-submission-state.test.ts` (+17, -0)
- `packages/app/test-browser/session-lineage.test.ts` (+231, -0)
- `packages/app/test-browser/toast-owner.test.ts` (+26, -0)
- `packages/cli/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/lib/stats-proxy.ts` (+2, -2)
- `packages/console/app/src/routes/zen/util/handler.ts` (+1, -1)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/mail/package.json` (+1, -1)
- `packages/console/support/package.json` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/desktop/src/main/index.ts` (+2, -0)
- `packages/desktop/src/main/store.ts` (+7, -0)
- `packages/desktop/src/main/updater.ts` (+18, -1)
- `packages/desktop/src/main/window-registry.test.ts` (+91, -0)
- `packages/desktop/src/main/window-registry.ts` (+47, -0)
- `packages/desktop/src/main/windows.ts` (+27, -40)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/enterprise/package.json` (+1, -1)
- `packages/function/package.json` (+1, -1)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/package.json` (+3, -3)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/experimental.ts` (+2, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/session.ts` (+3, -1)
- `packages/opencode/test/server/httpapi-session.test.ts` (+73, -0)
- `packages/opencode/test/session/llm.test.ts` (+74, -0)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/session-ui/src/components/basic-tool.tsx` (+14, -11)
- `packages/session-ui/src/components/file-media.tsx` (+44, -20)
- `packages/session-ui/src/components/file.tsx` (+8, -1)
- `packages/session-ui/src/components/line-comment-annotations.tsx` (+148, -95)
- `packages/session-ui/src/components/markdown.css` (+17, -72)
- `packages/session-ui/src/components/markdown.tsx` (+95, -49)
- `packages/session-ui/src/components/message-part.css` (+0, -13)
- `packages/session-ui/src/components/message-part.tsx` (+56, -18)
- `packages/session-ui/src/components/timeline-playground.stories.tsx` (+5, -1)
- `packages/session-ui/src/pierre/comment-hover.ts` (+13, -4)
- `packages/session-ui/src/v2/components/line-comment-annotations-v2.tsx` (+212, -0)
- `packages/session-ui/src/v2/components/session-review-empty-changes-v2.tsx` (+17, -0)
- `packages/session-ui/src/v2/components/session-review-empty-no-git-v2.tsx` (+28, -0)
- `packages/session-ui/src/v2/components/session-review-file-preview-v2.tsx` (+282, -0)
- `packages/session-ui/src/v2/components/session-review-v2.css` (+432, -0)
- `packages/session-ui/src/v2/components/session-review-v2.tsx` (+322, -0)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/app/src/context/language.tsx` (+11, -2)
- `packages/stats/app/src/i18n.ts` (+2, -2)
- `packages/stats/app/src/routes/[lab]/index.tsx` (+653, -179)
- `packages/stats/app/src/routes/index.css` (+1377, -135)
- `packages/stats/app/src/routes/model-catalog.ts` (+73, -5)
- `packages/stats/app/src/routes/stats-cache.ts` (+3, -1)
- `packages/stats/server/package.json` (+1, -1)
- `packages/storybook/.storybook/mocks/app/components/dialog-select-model.tsx` (+2, -0)
- `packages/storybook/.storybook/preview.tsx` (+12, -0)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/components/collapsible.css` (+6, -0)
- `packages/ui/src/components/scroll-view.test.ts` (+22, -1)
- `packages/ui/src/components/scroll-view.tsx` (+67, -7)
- `packages/ui/src/context/marked.tsx` (+55, -9)
- `packages/ui/src/i18n/en.ts` (+18, -0)
- `packages/ui/src/v2/components/file-tree-v2.css` (+120, -0)
- `packages/ui/src/v2/components/icon.tsx` (+32, -0)
- `packages/ui/src/v2/components/text-input-v2.css` (+33, -0)
- `packages/ui/src/v2/components/text-input-v2.tsx` (+31, -5)
- `packages/ui/src/v2/components/toast-v2.tsx` (+39, -37)
- `packages/ui/src/v2/components/tooltip-v2.css` (+5, -0)
- `packages/web/package.json` (+1, -1)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 239f78d..fcf9ce9 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.17.12",
+  "version": "1.17.13",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 61e73ad..8de83c0 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.17.12",
+  "version": "1.17.13",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
@@ -108,7 +108,7 @@
     "drizzle-orm": "catalog:",
     "effect": "catalog:",
     "fuzzysort": "3.1.0",
-    "gitlab-ai-provider": "6.9.3",
+    "gitlab-ai-provider": "6.10.0",
     "glob": "13.0.5",
     "google-auth-library": "10.5.0",
     "gray-matter": "4.0.3",
```

#### packages/stats/core/package.json
```diff
diff --git a/packages/stats/core/package.json b/packages/stats/core/package.json
index cdffcae..de620c7 100644
--- a/packages/stats/core/package.json
+++ b/packages/stats/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/stats-core",
-  "version": "1.17.12",
+  "version": "1.17.13",
   "private": true,
   "type": "module",
   "license": "MIT",
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/src/kilocode/cost/max-cost-nudge.ts
- `src/core/` - review core changes from packages/core/test/kilocode/cost/max-cost-nudge.test.ts
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/kilocode/tool/registry.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
