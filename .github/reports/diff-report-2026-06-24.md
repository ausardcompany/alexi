# Upstream Changes Report
Generated: 2026-06-24 09:31:40

## Summary
- kilocode: 117 commits, 233 files changed
- opencode: 60 commits, 279 files changed

## kilocode Changes (9fc6f1e8b..3063fde72)

### Commits

- 3063fde72 - Merge pull request #11591 from Kilo-Org/fix-sandbox-toctou-hardening (Marius, 2026-06-24)
- 04c7c8588 - test(sandbox): handle Windows file modes (Marius, 2026-06-24)
- e69828e93 - test(sandbox): resolve worker path on Windows (Marius, 2026-06-24)
- 80d018615 - chore: merge main into sandbox hardening (Marius, 2026-06-24)
- c1f3eb727 - Merge pull request #11556 from Kilo-Org/feature/show-routed-step-models (Marian Alexandru Alecu, 2026-06-24)
- 2e77e36e4 - Merge pull request #11617 from Kilo-Org/jetbrains/release/v7.0.1-rc.13 (Kirill Kalishev, 2026-06-23)
- 75bfc4657 - docs(jetbrains): edit changelog for v7.0.1-rc.13 (Kirill Kalishev, 2026-06-23)
- 432752638 - release(jetbrains): v7.0.1-rc.13 (kilo-maintainer[bot], 2026-06-24)
- 1741fcdde - test(jetbrains): stabilize mention navigator wait (alex-alecu, 2026-06-23)
- edd9b0585 - Revert "feat(tui): show usage by routed model" (Josh Lambert, 2026-06-23)
- c319334d9 - test(cli): stabilize header timeout coverage (alex-alecu, 2026-06-23)
- 1c99f3f7f - feat(tui): show usage by routed model (Josh Lambert, 2026-06-23)
- d9a0d78f9 - fix(ci): annotate websocket fallback change (alex-alecu, 2026-06-23)
- b79a03718 - fix(ci): stabilize failing checks (alex-alecu, 2026-06-23)
- e188f2fa6 - test(core): harden flock crash recovery timing (Alex Alecu, 2026-06-23)
- 7664ee95c - Merge remote-tracking branch 'origin/main' into feature/show-routed-step-models (Alex Alecu, 2026-06-23)
- 0a0e7e2b7 - fix(tui): lazy routed badge theme (Alex Alecu, 2026-06-23)
- b554850fb - Merge pull request #11603 from Kilo-Org/feat-macos-network-sandbox (Marius, 2026-06-23)
- c3e34e66e - fix(tui): stop stale routed footer (Alex Alecu, 2026-06-23)
- d017c18bc - fix(sandbox): guard MCP network classification (Marius, 2026-06-23)
- 8aedf6fa5 - fix(ui): annotate sandbox switch extension (Marius, 2026-06-23)
- d2dd90543 - fix: annotate shared sandbox test hooks (Marius, 2026-06-23)
- 513f26c2b - test(sandbox): cover production network classification (Marius, 2026-06-23)
- 9ce0e1cc8 - fix(sandbox): share opaque network classifications (Marius, 2026-06-23)
- f24ad16d3 - fix(tui): show routed model in message footer (Alex Alecu, 2026-06-23)
- f596a033d - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-23)
- 61c7f971b - refactor(cli): isolate sandbox mutation support (Marius, 2026-06-23)
- 9d30c1b9e - fix(vscode): stabilize sandbox settings coverage (Marius, 2026-06-23)
- 9fbc456b7 - feat(sandbox): enforce macOS network isolation (marius-kilocode, 2026-06-23)
- 7a91f7e56 - fix(cli): preserve colon model ids (Alex Alecu, 2026-06-23)
- d394ad502 - fix(tui): guard compact routed labels (Alex Alecu, 2026-06-23)
- 10b06b96d - chore(cli): annotate sidecar packaging (Marius, 2026-06-23)
- 6b322883b - fix(cli): reduce sandbox mutation overhead (Marius, 2026-06-23)
- 84790ae92 - fix(cli): compact routed model labels (Alex Alecu, 2026-06-23)
- 614be7693 - Merge pull request #11327 from Kilo-Org/basalt-dirt (Kirill Kalishev, 2026-06-23)
- 16fa18a38 - Merge branch 'main' into basalt-dirt (Kirill Kalishev, 2026-06-23)
- 9378a0183 - Merge pull request #11592 from Kilo-Org/mark/chat-autocomplete-fim-fallback (Mark IJbema, 2026-06-23)
- d54e6b33d - fix(jetbrains): resolve typed mentions on send (kirillk, 2026-06-23)
- 1444db069 - Merge pull request #11588 from Kilo-Org/enormous-yak (Marius, 2026-06-23)
- 45acfe1de - fix(jetbrains): submit typed file mentions (kirillk, 2026-06-23)
- e4e8d4313 - fix(cli): preserve sandbox worker failures (marius-kilocode, 2026-06-23)
- 06fac869e - fix(cli): contain sandbox worker pipe errors (marius-kilocode, 2026-06-23)
- e232ca93d - fix(cli): drain sandbox worker responses (marius-kilocode, 2026-06-23)
- dcd2ae3ad - fix(vscode): use fim fallback for chat autocomplete (Mark IJbema, 2026-06-23)
- 76a9d9b97 - fix(cli): close sandbox filesystem TOCTOU race (marius-kilocode, 2026-06-23)
- 18f501563 - fix(sdk): narrow openapi diff (Alex Alecu, 2026-06-23)
- 14a389fea - fix(vscode): preserve code index across updates (marius-kilocode, 2026-06-23)
- 78cfcaca0 - Merge branch 'main' into basalt-dirt (Kirill Kalishev, 2026-06-23)
- 767c65db4 - chore: revert opencode review changes (kirillk, 2026-06-23)
- 0f1c66ed9 - fix: address remaining PR review findings (kirillk, 2026-06-23)
- 588335ef1 - fix(cli): isolate sandboxed worktree writes (#11584) (Marius, 2026-06-23)
- 1acf97347 - Merge pull request #11574 from Kilo-Org/glass-neighborhood (Marius, 2026-06-23)
- 7a156bb20 - fix(ci): normalize test paths on Windows (marius-kilocode, 2026-06-23)
- 31095168d - test(ci): focus macOS PR coverage (marius-kilocode, 2026-06-23)
- 8a55ffa28 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-06-23)
- 918e6bf78 - Merge pull request #11548 from Kilo-Org/honored-sing (Marius, 2026-06-23)
- 5dc511b4e - fix(vscode): silence auto-approved permissions (#11573) (Marius, 2026-06-23)
- f85c8ab40 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-23)
- ea9d25192 - chore(vscode): format sandbox toggle test (marius-kilocode, 2026-06-23)
- 0df55e967 - test(ci): keep HttpApi exerciser on Linux (marius-kilocode, 2026-06-23)
- 53baaed11 - Merge remote-tracking branch 'origin/main' into honored-sing (marius-kilocode, 2026-06-23)
- d60d6e040 - fix(vscode): isolate sandbox toggle save (marius-kilocode, 2026-06-23)
- 55203c3a2 - fix(core): create the default `.kilo/plans` directory automatically when Plan mode starts (#11505) (Josh Holmer, 2026-06-23)
- 7709defb1 - Merge pull request #11567 from Kilo-Org/glass-neighborhood (Marius, 2026-06-23)
- a2b3ae1c6 - refactor(vscode): gate sandbox controls for developers (marius-kilocode, 2026-06-23)
- 741468ff9 - test(cli): allow slower ACP responses in CI (marius-kilocode, 2026-06-23)
- 6287d20ed - revert(vscode): restore experimental sandbox controls (marius-kilocode, 2026-06-23)
- 784b5b883 - chore(ci): annotate macOS exerciser condition (marius-kilocode, 2026-06-23)
- fd6a65697 - test(ci): run unit suite on macOS (marius-kilocode, 2026-06-23)
- 330e44eae - refactor(vscode): hide experimental sandbox controls (marius-kilocode, 2026-06-23)
- e9ed19a9d - fix(jetbrains): serialize lazy session creation (kirillk, 2026-06-22)
- c1d1d5795 - chore: reset opencode changes to main (kirillk, 2026-06-22)
- 71dc01262 - fix(cli): keep node pty type shim (kirillk, 2026-06-22)
- 1b88973c3 - chore: remove out-of-scope opencode changes (kirillk, 2026-06-22)
- 30c363388 - fix(jetbrains): address prompt review findings (kirillk, 2026-06-22)
- da6c87dfe - Revert "fix(opencode): support MiniMax M3 thinking toggle (#31426)" (kirillk, 2026-06-22)
- ba9787bda - Revert "fix(cli): support GLM 5.2 thinking variants" (kirillk, 2026-06-22)
- 45d3fbaed - fix(jetbrains): attach source metadata to git changes (kirillk, 2026-06-22)
- a47617f48 - refactor(sandbox): simplify capability implementation (marius-kilocode, 2026-06-22)
- ce8e4eeb2 - Merge branch 'main' into basalt-dirt (Kirill Kalishev, 2026-06-22)
- d636f1874 - fix: show routed models only for auto selections (Alex Alecu, 2026-06-23)
- 564708629 - fix(jetbrains): update prompt placeholder hint (kirillk, 2026-06-22)
- 9b0c45ca3 - feat(cli): show routed step models (Alex Alecu, 2026-06-22)
- cfb7006e8 - fix(jetbrains): send git changes as data file (kirillk, 2026-06-22)
- a37d3bf1f - fix(cli): preserve encoding after formatting (marius-kilocode, 2026-06-22)
- 6a8961e03 - fix(sandbox): keep permissions outside confinement policy (marius-kilocode, 2026-06-22)
- c55e804c1 - refactor(sandbox): centralize agent capability enforcement (marius-kilocode, 2026-06-22)
- f0ea4b66f - fix(jetbrains): require mention token boundaries (kirillk, 2026-06-22)
- 57ef62991 - fix(cli): declare lydell node pty types (kirillk, 2026-06-22)
- 8e46ad3f7 - Merge remote-tracking branch 'origin/main' into basalt-dirt (kirillk, 2026-06-22)
- 1c3cc5759 - feat(i18n): add sandbox translations for all languages (marius-kilocode, 2026-06-22)
- 30339ad82 - test(jetbrains): stabilize workspace agent filtering test (kirillk, 2026-06-22)
- cc6fe0fe3 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-22)
- b3050cbff - feat(cli): add macOS file-level sandbox for agent tools (marius-kilocode, 2026-06-22)
- efc655034 - fix(jetbrains): avoid relinking prompt mentions (kirillk, 2026-06-21)
- c2fb2ab0c - Merge remote-tracking branch 'origin/main' into basalt-dirt (kirillk, 2026-06-21)
- 3dc31d9fd - fix(jetbrains): make prompt mentions clickable (kirillk, 2026-06-21)
- 7a1180770 - feat(jetbrains): navigate and explain @file mentions in the prompt (kirillk, 2026-06-21)
- 4d4cfbfcd - fix(jetbrains): clean up workspace path followups (kirillk, 2026-06-19)
- c452ce866 - fix(jetbrains): harden prompt completion followups (kirillk, 2026-06-19)
- b525761f2 - refactor(jetbrains): reduce unstable IntelliJ API surface in prompt completion (kirillk, 2026-06-19)
- 98e141a3e - chore(jetbrains): revert backend run config change (kirillk, 2026-06-19)
- 48f2a5f7c - fix(jetbrains): restore prompt focus after history (kirillk, 2026-06-19)
- a32619109 - fix(jetbrains): support slash command aliases (kirillk, 2026-06-19)
- dd8b43ef6 - fix(jetbrains): enable prompt undo redo (kirillk, 2026-06-18)
- 9699ed198 - refactor(jetbrains): centralize prompt action metadata (kirillk, 2026-06-18)
- c746eea1e - fix(jetbrains): stabilize prompt mention completion (kirillk, 2026-06-18)
- 84173644d - fix(jetbrains): handle prompt completion shortcut (kirillk, 2026-06-17)
- e5d23fbb6 - fix(jetbrains): improve mention completion icons (kirillk, 2026-06-17)
- e0f8c1978 - fix(jetbrains): show root entries for blank mentions (kirillk, 2026-06-17)
- ac8852c77 - Merge remote-tracking branch 'origin/main' into basalt-dirt (kirillk, 2026-06-17)
- 1a812ea5a - fix(jetbrains): tighten prompt completion routing (kirillk, 2026-06-16)
- c23c3e300 - fix(jetbrains): hide file mention payloads (kirillk, 2026-06-16)
- 54ff8c0df - chore(jetbrains): enable info logging for backend run config (kirillk, 2026-06-16)
- 0c2a7c1c5 - fix(jetbrains): stabilize mention completion (kirillk, 2026-06-16)
- 7fd80d0af - fix(jetbrains): smooth prompt completion lookup (kirillk, 2026-06-16)
- 3150da998 - feat(jetbrains): add prompt slash and mention completion (kirillk, 2026-06-16)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/background-process.ts` (+5, -0)
- `packages/opencode/src/kilocode/tool/encoded-io.ts` (+37, -10)
- `packages/opencode/src/tool/apply_patch.ts` (+6, -6)
- `packages/opencode/src/tool/edit.ts` (+6, -6)
- `packages/opencode/src/tool/registry.ts` (+17, -5)
- `packages/opencode/src/tool/write.ts` (+3, -3)
- `packages/opencode/test/tool/registry.test.ts` (+49, -1)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -0)
- `packages/core/src/cross-spawn-spawner.ts` (+20, -12)
- `packages/core/src/filesystem.ts` (+4, -35)
- `packages/core/test/util/effect-flock.test.ts` (+2, -2)
- `packages/kilo-indexing/src/indexing/orchestrator.ts` (+6, -0)
- `packages/kilo-indexing/test/kilocode/indexing/orchestrator.test.ts` (+33, -2)

#### Other Changes
- `.changeset/chat-fim-fallback.md` (+6, -0)
- `.changeset/create-plan-dir.md` (+5, -0)
- `.changeset/jetbrains-clickable-prompt-mentions.md` (+5, -0)
- `.changeset/jetbrains-empty-mention-completion.md` (+5, -0)
- `.changeset/jetbrains-file-mention-parity.md` (+5, -0)
- `.changeset/jetbrains-git-changes-data-url.md` (+5, -0)
- `.changeset/jetbrains-mention-icons-priority.md` (+5, -0)
- `.changeset/jetbrains-prompt-completion.md` (+5, -0)
- `.changeset/jetbrains-prompt-hint.md` (+5, -0)
- `.changeset/jetbrains-prompt-mentions-undo.md` (+5, -0)
- `.changeset/jetbrains-send-typed-mentions.md` (+5, -0)
- `.changeset/jetbrains-session-focus-restore.md` (+5, -0)
- `.changeset/jetbrains-slash-aliases.md` (+5, -0)
- `.changeset/jetbrains-stable-mention-completion.md` (+5, -0)
- `.changeset/macos-network-sandbox.md` (+6, -0)
- `.changeset/persist-index-updates.md` (+5, -0)
- `.changeset/quiet-auto-approved-permissions.md` (+5, -0)
- `.changeset/sandbox-agent-writes.md` (+6, -0)
- `.changeset/secure-sandbox-mutations.md` (+5, -0)
- `.changeset/secure-worktree-sandboxes.md` (+5, -0)
- `.changeset/show-routed-step-models.md` (+6, -0)
- `.github/workflows/check-opencode-annotations.yml` (+3, -0)
- `.github/workflows/test.yml` (+4, -1)
- `bun.lock` (+17, -0)
- `nix/hashes.json` (+4, -4)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/prompt-input/with-thinking-420-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/sandboxing-panel-chromium-linux.png` (+3, -0)
- `packages/kilo-gateway/src/autocomplete.ts` (+18, -7)
- `packages/kilo-gateway/test/autocomplete.test.ts` (+12, -0)
- `packages/kilo-jetbrains/CHANGELOG.md` (+17, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendChatManager.kt` (+8, -1)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloBackendCliManager.kt` (+4, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloCliDataParser.kt` (+59, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloSessionRpcApiImpl.kt` (+6, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorkspaceRpcApiImpl.kt` (+174, -11)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendChatManagerTest.kt` (+18, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendSessionManagerTest.kt` (+4, -1)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/KiloCliDataParserTest.kt` (+137, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/WorkspacePathScopingTest.kt` (+150, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/MockCliServer.kt` (+12, -3)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/workspace/KiloBackendWorkspaceTest.kt` (+7, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloSessionService.kt` (+6, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloWorkspaceService.kt` (+22, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionSidePanelManager.kt` (+11, -7)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+81, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionController.kt` (+81, -29)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/Message.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/SessionModel.kt` (+25, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/ReasoningPicker.kt` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/editor/SessionEditorTextField.kt` (+78, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/mode/ModePicker.kt` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/model/ModelPicker.kt` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/KiloPromptCompletionProvider.kt` (+306, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/MentionAction.kt` (+33, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/MentionNavigator.kt` (+103, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/PromptEditorTextField.kt` (+3, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/PromptMentionParts.kt` (+89, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/PromptPanel.kt` (+176, -56)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/SlashAction.kt` (+36, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/MessageView.kt` (+24, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/PromptMention.kt` (+71, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/PromptView.kt` (+56, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/TextView.kt` (+7, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/ViewFactory.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+20, -4)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ar.properties` (+5, -5)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_bs.properties` (+4, -4)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_da.properties` (+4, -4)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_de.properties` (+4, -4)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_es.properties` (+4, -4)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_fr.properties` (+4, -4)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ja.properties` (+4, -4)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ko.properties` (+8, -8)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_nl.properties` (+4, -4)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_no.properties` (+4, -4)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pl.properties` (+4, -4)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pt_BR.properties` (+4, -4)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ru.properties` (+4, -4)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_th.properties` (+4, -4)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_tr.properties` (+5, -5)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_uk.properties` (+5, -5)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_CN.properties` (+4, -4)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_TW.properties` (+6, -6)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/app/KiloWorkspaceServiceTest.kt` (+19, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionSidePanelManagerTest.kt` (+36, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/CommandLifecycleTest.kt` (+69, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/SessionCreationTest.kt` (+28, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/model/SessionModelTest.kt` (+127, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/PromptPanelTest.kt` (+378, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionUiUpdateTest.kt` (+102, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/prompt/KiloPromptCompletionProviderTest.kt` (+390, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/prompt/MentionNavigatorTest.kt` (+121, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/prompt/PromptMentionPartsTest.kt` (+161, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/TextViewTest.kt` (+167, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeSessionRpcApi.kt` (+9, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeWorkspaceRpcApi.kt` (+18, -1)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-jetbrains/script/build.ts` (+12, -6)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloSessionRpcApi.kt` (+3, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloWorkspaceRpcApi.kt` (+7, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/ChatDto.kt` (+21, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/WorkspaceFileDto.kt` (+7, -0)
- `packages/kilo-sandbox/package.json` (+30, -0)
- `packages/kilo-sandbox/src/backend.ts` (+112, -0)
- `packages/kilo-sandbox/src/context.ts` (+71, -0)
- `packages/kilo-sandbox/src/filesystem.ts` (+247, -0)
- `packages/kilo-sandbox/src/index.ts` (+7, -0)
- `packages/kilo-sandbox/src/kilo-sandbox-mutation-worker.ts` (+140, -0)
- `packages/kilo-sandbox/src/mutation-protocol.ts` (+124, -0)
- `packages/kilo-sandbox/src/mutation.ts` (+233, -0)
- `packages/kilo-sandbox/src/network.ts` (+89, -0)
- `packages/kilo-sandbox/src/path.ts` (+92, -0)
- `packages/kilo-sandbox/src/profile.ts` (+29, -0)
- `packages/kilo-sandbox/src/seatbelt-base.ts` (+112, -0)
- `packages/kilo-sandbox/src/seatbelt-network.ts` (+12, -0)
- `packages/kilo-sandbox/src/seatbelt.ts` (+81, -0)
- `packages/kilo-sandbox/test/backend.test.ts` (+153, -0)
- `packages/kilo-sandbox/test/context.test.ts` (+92, -0)
- `packages/kilo-sandbox/test/filesystem.test.ts` (+346, -0)
- `packages/kilo-sandbox/test/kilo-sandbox-mutation-worker.test.ts` (+85, -0)
- `packages/kilo-sandbox/test/network.test.ts` (+117, -0)
- `packages/kilo-sandbox/test/seatbelt-network.test.ts` (+257, -0)
- `packages/kilo-sandbox/tsconfig.json` (+11, -0)
- `packages/kilo-vscode/script/local-bin.ts` (+31, -12)
- `packages/kilo-vscode/src/commands/toggle-auto-approve.ts` (+25, -16)
- `packages/kilo-vscode/src/extension.ts` (+7, -4)
- `packages/kilo-vscode/src/features.ts` (+3, -0)
- `packages/kilo-vscode/src/services/attention/service.ts` (+28, -8)
- `packages/kilo-vscode/src/services/autocomplete/chat-autocomplete/ChatTextAreaAutocomplete.ts` (+8, -2)
- `packages/kilo-vscode/src/services/cli-backend/cli-resources.ts` (+17, -0)
- `packages/kilo-vscode/tests/settings-accessibility.spec.ts` (+19, -0)
- `packages/kilo-vscode/tests/unit/attention.test.ts` (+32, -2)
- `packages/kilo-vscode/tests/unit/auto-approve.test.ts` (+40, -26)
- `packages/kilo-vscode/tests/unit/chat-autocomplete-utils.test.ts` (+12, -0)
- `packages/kilo-vscode/tests/unit/prompt-input-connection-guard.test.ts` (+19, -3)
- `packages/kilo-vscode/tests/unit/sandboxing-settings.test.ts` (+14, -0)
- `packages/kilo-vscode/tests/unit/server-manager-utils.test.ts` (+21, -0)
- `packages/kilo-vscode/tests/unit/timeline-colors.test.ts` (+38, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+28, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskTimeline.tsx` (+6, -6)
- `packages/kilo-vscode/webview-ui/src/components/settings/ExperimentalTab.tsx` (+18, -2)
- `packages/kilo-vscode/webview-ui/src/components/settings/SandboxingTab.tsx` (+43, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/Settings.tsx` (+22, -2)
- `packages/kilo-vscode/webview-ui/src/components/settings/SettingsRow.tsx` (+4, -1)
- `packages/kilo-vscode/webview-ui/src/components/settings/sandboxing.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/context/config.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+6, -1)
- `packages/kilo-vscode/webview-ui/src/stories/settings.stories.tsx` (+14, -0)
- `packages/kilo-vscode/webview-ui/src/styles/prompt-input.css` (+3, -3)
- `packages/kilo-vscode/webview-ui/src/types/messages/config.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/parts.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/utils/timeline/colors.ts` (+7, -3)
- `packages/opencode/package.json` (+1, -0)
- `packages/opencode/script/build-node.ts` (+2, -1)
- `packages/opencode/script/build.ts` (+6, -0)
- `packages/opencode/script/kilocode/kilo-sandbox-worker.ts` (+69, -0)
- `packages/opencode/script/kilocode/test-profile.ts` (+101, -0)
- `packages/opencode/script/postinstall.mjs` (+2, -0)
- `packages/opencode/script/publish.ts` (+5, -4)
- `packages/opencode/script/test-runner.ts` (+43, -4)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+86, -20)
- `packages/opencode/src/config/config.ts` (+10, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/routes/session/routed-model-meta.tsx` (+95, -0)
- `packages/opencode/src/kilocode/sandbox/network-tools.ts` (+13, -0)
- `packages/opencode/src/kilocode/sandbox/network.ts` (+37, -0)
- `packages/opencode/src/kilocode/sandbox/policy.ts` (+100, -0)
- `packages/opencode/src/kilocode/session/prompt.ts` (+1, -1)
- `packages/opencode/src/kilocode/session/routed-model.ts` (+56, -0)
- `packages/opencode/src/mcp/index.ts` (+6, -1)
- `packages/opencode/src/plugin/openai/ws-pool.ts` (+9, -0)
- `packages/opencode/src/session/llm/ai-sdk.ts` (+2, -1)
- `packages/opencode/src/session/message-v2.ts` (+8, -0)
- `packages/opencode/src/session/processor.ts` (+9, -0)
- `packages/opencode/src/session/session.ts` (+12, -9)
- `packages/opencode/src/session/tools.ts` (+20, -10)
- `packages/opencode/test/cli/acp/acp-test-client.ts` (+1, -1)
- `packages/opencode/test/cli/acp/lifecycle.test.ts` (+1, -1)
- `packages/opencode/test/{ => kilocode}/cli/install-artifact.test.ts` (+4, -3)
- `packages/opencode/test/kilocode/plan-exit-detection.test.ts` (+37, -0)
- `packages/opencode/test/kilocode/sandbox/config-network.test.ts` (+78, -0)
- `packages/opencode/test/kilocode/sandbox/http-tools.test.ts` (+132, -0)
- `packages/opencode/test/kilocode/sandbox/macos-confinement.test.ts` (+462, -0)
- `packages/opencode/test/kilocode/sandbox/network.test.ts` (+141, -0)
- `packages/opencode/test/kilocode/sandbox/policy.test.ts` (+221, -0)
- `packages/opencode/test/kilocode/sandbox/session-tools.test.ts` (+351, -0)
- `packages/opencode/test/kilocode/sandbox/shell-network.test.ts` (+103, -0)
- `packages/opencode/test/kilocode/session-processor-empty-tool-calls.test.ts` (+81, -3)
- `packages/opencode/test/kilocode/session-routed-model.test.ts` (+198, -0)
- `packages/opencode/test/kilocode/test-profile.test.ts` (+40, -0)
- `packages/opencode/test/kilocode/tool-encoding.test.ts` (+29, -0)
- `packages/opencode/test/mcp/lifecycle.test.ts` (+68, -0)
- `packages/opencode/test/provider/header-timeout.test.ts` (+5, -2)
- `packages/opencode/test/server/httpapi-experimental.test.ts` (+3, -1)
- `packages/opencode/test/session/llm.test.ts` (+6, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+6, -0)
- `packages/sdk/openapi.json` (+21, -0)
- `packages/ui/src/components/icon.tsx` (+1, -0)
- `packages/ui/src/components/switch.tsx` (+5, -2)
- `script/check-model-tool-network.ts` (+150, -0)
- `turbo.json` (+1, -0)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 61894b76c..8a56507dd 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -27,6 +27,7 @@
   },
   "dependencies": {
     "@kilocode/kilo-gateway": "workspace:*",
+    "@kilocode/sandbox": "workspace:*",
     "@effect/opentelemetry": "catalog:",
     "@effect/platform-node": "catalog:",
     "@npmcli/arborist": "9.4.0",
```

#### packages/core/src/cross-spawn-spawner.ts
```diff
diff --git a/packages/core/src/cross-spawn-spawner.ts b/packages/core/src/cross-spawn-spawner.ts
index ad8d4126d..5c769569e 100644
--- a/packages/core/src/cross-spawn-spawner.ts
+++ b/packages/core/src/cross-spawn-spawner.ts
@@ -1,6 +1,7 @@
 import type * as Arr from "effect/Array"
 import { NodeFileSystem, NodeSink, NodeStream } from "@effect/platform-node"
 import * as NodePath from "@effect/platform-node/NodePath"
+import { prepareCommand as prepareSandbox } from "@kilocode/sandbox" // kilocode_change
 import * as Deferred from "effect/Deferred"
 import * as Effect from "effect/Effect"
 import * as Exit from "effect/Exit"
@@ -362,24 +363,29 @@ export const make = Effect.gen(function* () {
     function* (command) {
       switch (command._tag) {
         case "StandardCommand": {
-          const sin = stdin(command.options)
-          const sout = stdio(command.options, "stdout")
-          const serr = stdio(command.options, "stderr")
-          const extra = fds(command.options)
           const dir = yield* cwd(command.options)
+          // kilocode_change start - prepare agent-scoped commands through the selected sandbox backend
+          const target = yield* prepareSandbox(command, dir, env(command.options))
+          const sin = stdin(target.options)
+          const sout = stdio(target.options, "stdout")
+          const serr = stdio(target.options, "stderr")
+          const extra = fds(target.options)
+          // kilocode_change end
 
           const [proc, signal] = yield* Effect.acquireRelease(
-            spawn(command, {
+            // kilocode_change start - spawn the prepared command and options
+            spawn(target, {
               cwd: dir,
-              env: env(command.options),
+              env: env(target.options),
               stdio: stdios(sin, sout, serr, extra),
-              detached: command.options.detached ?? process.platform !== "win32",
-              shell: command.options.shell,
+              detached: target.options.detached ?? process.platform !== "win32",
+              shell: target.options.shell,
+              // kilocode_change end
               windowsHide: process.platform === "win32",
             }),
             Effect.fnUntraced(function* ([proc, signal]) {
               const done = yield* Deferred.isDone(signal)
-              const kill = timeout(proc, command, command.options)
+              const kill = timeout(proc, command, target.options) // kilocode_change
               if (done) {
                 const [code] = yield* Deferred.await(signal)
```

#### packages/core/src/filesystem.ts
```diff
diff --git a/packages/core/src/filesystem.ts b/packages/core/src/filesystem.ts
index a5e035a14..758e60e78 100644
--- a/packages/core/src/filesystem.ts
+++ b/packages/core/src/filesystem.ts
@@ -1,4 +1,5 @@
 import { NodeFileSystem } from "@effect/platform-node"
+import { decorateFileSystem, ensureDirectory } from "@kilocode/sandbox" // kilocode_change
 import { dirname, isAbsolute, join, relative, resolve as pathResolve, sep } from "path" // kilocode_change - harden containment checks
 import { realpathSync } from "fs"
 import * as NFS from "fs/promises"
@@ -8,28 +9,6 @@ import type { PlatformError } from "effect/PlatformError"
 import { Glob } from "./util/glob"
 import { serviceUse } from "./effect/service-use"
 
-// kilocode_change start - Windows-resilient mkdir -p.
-// fs.mkdir(dir, { recursive: true }) should be idempotent, but on Windows
-// with NTFS reparse points (OneDrive), directory junctions, or WSL-served
-// paths, libuv can still throw EEXIST. This wrapper catches that specific
-// error so callers get the promised directory-exists semantics.
-//
-//   https://github.com/Kilo-Org/kilocode/issues/9618
-//   https://github.com/Kilo-Org/kilocode/issues/9755
-function isEexist(err: unknown): boolean {
-  return typeof err === "object" && err !== null && "code" in err && (err as NodeJS.ErrnoException).code === "EEXIST"
-}
-
-async function mkdirSafe(dir: string): Promise<void> {
-  try {
-    await NFS.mkdir(dir, { recursive: true })
-  } catch (err: unknown) {
-    if (isEexist(err)) return
-    throw err
-  }
-}
-// kilocode_change end
-
 export namespace AppFileSystem {
   export class FileSystemError extends Schema.TaggedErrorClass<FileSystemError>()("FileSystemError", {
     method: Schema.String,
@@ -67,7 +46,7 @@ export namespace AppFileSystem {
   export const layer = Layer.effect(
     Service,
     Effect.gen(function* () {
-      const fs = yield* FileSystem.FileSystem
+      const fs = decorateFileSystem(yield* FileSystem.FileSystem) // kilocode_change
 
       const existsSafe = Effect.fn("FileSystem.existsSafe")(function* (path: string) {
         return yield* fs.exists(path).pipe(Effect.orElseSucceed(() => false))
@@ -116,12 +95,7 @@ export namespace AppFileSystem {
       })
```

#### packages/core/test/util/effect-flock.test.ts
```diff
diff --git a/packages/core/test/util/effect-flock.test.ts b/packages/core/test/util/effect-flock.test.ts
index 3473ae5b4..98ea317d1 100644
--- a/packages/core/test/util/effect-flock.test.ts
+++ b/packages/core/test/util/effect-flock.test.ts
@@ -368,7 +368,7 @@ describe("util.effect-flock", () => {
         const proc = spawnWorker({ key: "eflock:crash", dir, ready, holdMs: 120_000 })
 
         try {
-          await waitForFile(ready, 5_000)
+          await waitForFile(ready, 20_000) // kilocode_change - hosted macOS can start this worker slowly after stress tests
           await stopWorker(proc) // kilocode_change - stopWorker now awaits close before returning
 
           // Backdate lock files so they're past STALE_MS (60s)
@@ -387,6 +387,6 @@ describe("util.effect-flock", () => {
           await fs.rm(tmp, { recursive: true, force: true })
         }
       }),
-    30_000,
+    60_000, // kilocode_change - match the wider worker readiness window
   )
 })
```

#### packages/kilo-indexing/src/indexing/orchestrator.ts
```diff
diff --git a/packages/kilo-indexing/src/indexing/orchestrator.ts b/packages/kilo-indexing/src/indexing/orchestrator.ts
index e842dee17..8e2d08ef8 100644
--- a/packages/kilo-indexing/src/indexing/orchestrator.ts
+++ b/packages/kilo-indexing/src/indexing/orchestrator.ts
@@ -277,6 +277,8 @@ export class CodeIndexOrchestrator {
 
   private async _runScan(mode: IndexingTelemetryMode, trigger: IndexingTelemetryTrigger): Promise<void> {
     if (this._cancelRequested) {
+      if (mode === "incremental") await this.vectorStore.markIndexingComplete()
+      this.stateManager.setSystemState("Standby", "Indexing cancelled.")
       log.info("scan skipped: cancellation was requested", { workspacePath: this.workspacePath, mode })
       return
     }
@@ -319,6 +321,10 @@ export class CodeIndexOrchestrator {
     })
 
     if (this._cancelRequested || this.scanner.isCancelled) {
+      if (mode === "incremental" && result.stats.processed === 0 && batchErrors.length === 0) {
+        await this.vectorStore.markIndexingComplete()
+        log.info("preserved unchanged index after cancelled scan", { workspacePath: this.workspacePath })
+      }
       this._isProcessing = false
       if (this.stateManager.state !== "Error") {
         this.stateManager.setSystemState("Standby", "Indexing cancelled.")
```


*... and more files (showing first 5)*

## opencode Changes (fc95a84..cacb7d0)

### Commits

- cacb7d0 - refactor(app): rename cached context accessors (#33627) (Brendan Allan, 2026-06-24)
- 2312a15 - fix(app): share synced session data (#33624) (Brendan Allan, 2026-06-24)
- d465cd4 - chore: generate (opencode-agent[bot], 2026-06-24)
- a4551a9 - fix(app): make session navigation stable and fast (#33569) (Luke Parker, 2026-06-24)
- abcfeb3 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-24)
- 8cc79f7 - deps: update OpenTUI to 0.4.2 (#33610) (Simon Klee, 2026-06-24)
- 67e8b85 - chore: generate (opencode-agent[bot], 2026-06-24)
- 8aff7b8 - feat(app): update all components to use v2 tokens (#33598) (Aarav Sareen, 2026-06-24)
- 6c12c32 - fix(mcp): prevent resource key collisions (#33596) (Aiden Cline, 2026-06-24)
- fbfd725 - chore: generate (opencode-agent[bot], 2026-06-24)
- 246d40d - fix(skill): emit base directory as filesystem path, not file:// URL (#33580) (Chris Yuan, 2026-06-24)
- 947e001 - fix(mcp): restore legacy tool names (#33593) (Aiden Cline, 2026-06-23)
- 800d41d - refactor(app): simplify layout hierarchy (#33588) (Brendan Allan, 2026-06-24)
- 5647ed8 - fix(opencode): restore v1 account config (#33590) (opencode-agent[bot], 2026-06-24)
- af31e97 - fix(mcp): bind oauth callback to IPv4 loopback (#30022) (Yufeng He, 2026-06-23)
- 5303ab0 - fix(app): route new sessions through tabs (#33582) (Brendan Allan, 2026-06-24)
- 51eb87b - fix(app): clear viewed session notifications (#33574) (Brendan Allan, 2026-06-24)
- 556337d - chore: generate (opencode-agent[bot], 2026-06-24)
- c416ede - fix(tui): sort model picker by release date (#33558) (Aiden Cline, 2026-06-23)
- 784eea3 - feat(cli): add API request command (Dax Raad, 2026-06-23)
- a4b9351 - fix(app): create scoped drafts from home (#33578) (Brendan Allan, 2026-06-24)
- 5789558 - refactor(core): remove schema forwarding facades (#33577) (Kit Langton, 2026-06-24)
- 6298db7 - fix(app): throttle directory tree loading (#33576) (Brendan Allan, 2026-06-24)
- 5202bf1 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-24)
- 516cfe4 - refactor(schema): extract shared public schemas (#33571) (Kit Langton, 2026-06-23)
- 60aba62 - fix(app): use fixed titlebar tab widths (#33572) (Brendan Allan, 2026-06-24)
- e8610d8 - refactor(core): drop filesystem entry mime (Dax Raad, 2026-06-23)
- 5307699 - fix(tui): normalize autocomplete attachments (Dax Raad, 2026-06-23)
- f8c9bfd - fix(app): mount shortcuts per titlebar tab (#33567) (Brendan Allan, 2026-06-24)
- fed4f4d - feat(app): keep prompt state in tabs (#33566) (Brendan Allan, 2026-06-24)
- 1490752 - chore: generate (opencode-agent[bot], 2026-06-24)
- 4898263 - feat(core): map providers to integrations (#33562) (Dax, 2026-06-24)
- c556bdd - feat(core): add opencode integration (#33560) (Dax, 2026-06-24)
- cfddb24 - chore: generate (opencode-agent[bot], 2026-06-23)
- cf80b5c - feat(core): add opencode integration (#33555) (Dax, 2026-06-23)
- c17b955 - fix(core): preserve structured error messages (#33530) (Aiden Cline, 2026-06-23)
- 10f6bb7 - chore: generate (opencode-agent[bot], 2026-06-23)
- b8cfd69 - feat(tui): redesign crash screen (#33549) (Aiden Cline, 2026-06-23)
- d2305d4 - chore: generate (opencode-agent[bot], 2026-06-23)
- c6cc13e - feat(mcp): add resource template listing (#33546) (Shoubhit Dash, 2026-06-24)
- dcf7b4e - fix(opencode): handle snapshot paths from subdirectories (#33506) (Kit Langton, 2026-06-23)
- 5152150 - fix(opencode): make ACP resource text sourcing cross-platform (#33534) (Aiden Cline, 2026-06-23)
- 2ba18b8 - fix(app): use correct server sdk for titlebar session lookup (#33536) (Brendan Allan, 2026-06-24)
- e04c5e7 - fix(app): prompt persistence and draft sessions (#33528) (Brendan Allan, 2026-06-24)
- a131811 - feat(mcp): use mcp__server__tool naming convention (#33533) (Aiden Cline, 2026-06-23)
- 976e5d4 - ci: route support questions (#33527) (opencode-agent[bot], 2026-06-23)
- 8e2d422 - fix(acp): preserve resource text source (#33524) (Shoubhit Dash, 2026-06-23)
- a382528 - test(core): avoid models cache recovery race (#33525) (Aiden Cline, 2026-06-23)
- e0c0411 - fix: Skip bun version check for nix version (#33166) (ReStranger, 2026-06-23)
- e439456 - chore: generate (opencode-agent[bot], 2026-06-23)
- e3edbba - test(opencode): stabilize prompt concurrency tests (#33522) (Aiden Cline, 2026-06-23)
- 3cdd431 - fix(tui): make move session command bindable (#33508) (Simon Klee, 2026-06-23)
- ef4500d - fix(data): ignore table changes (Adam, 2026-06-23)
- f416f52 - Reapply "feat(stats): add user ids to inference metrics" (Adam, 2026-06-23)
- e0ff4fd - Revert "feat(stats): add user ids to inference metrics" (Adam, 2026-06-23)
- 428ae6d - feat(stats): add user ids to inference metrics (Adam, 2026-06-23)
- d568fed - fix(app): tighten mobile utility UI (#32799) (Brendan Allan, 2026-06-23)
- 58a8d9f - chore: generate (opencode-agent[bot], 2026-06-23)
- d248483 - feat(app): new session progress indicator (#32662) (Aarav Sareen, 2026-06-23)
- a21e747 - fix(app): improve iOS PWA shell (#32798) (Brendan Allan, 2026-06-23)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/core/src/tool/glob.ts` (+5, -6)
- `packages/core/src/tool/grep.ts` (+13, -14)
- `packages/core/src/tool/read-filesystem.ts` (+1, -2)
- `packages/core/src/tool/skill.ts` (+1, -2)
- `packages/opencode/src/tool/skill.ts` (+1, -2)
- `packages/opencode/test/tool/skill.test.ts` (+1, -2)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
- `packages/{core/src/permission/schema.ts => schema/src/permission.ts}` (+2, -2)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -0)
- `packages/core/src/agent.ts` (+6, -35)
- `packages/core/src/catalog.ts` (+3, -3)
- `packages/core/src/command.ts` (+5, -11)
- `packages/core/src/config.ts` (+2, -2)
- `packages/core/src/config/agent.ts` (+2, -2)
- `packages/core/src/config/plugin/reference.ts` (+2, -2)
- `packages/core/src/config/plugin/skill.ts` (+7, -4)
- `packages/core/src/credential.ts` (+13, -28)
- `packages/core/src/credential/sql.ts` (+1, -2)
- `packages/core/src/event.ts` (+1, -2)
- `packages/core/src/filesystem.ts` (+3, -4)
- `packages/core/src/filesystem/schema.ts` (+0, -23)
- `packages/core/src/filesystem/search.ts` (+20, -30)
- `packages/core/src/fs-util.ts` (+6, -1)
- `packages/core/src/id/id.ts` (+2, -35)
- `packages/core/src/integration.ts` (+79, -83)
- `packages/core/src/integration/connection.ts` (+7, -17)
- `packages/core/src/integration/schema.ts` (+0, -9)
- `packages/core/src/location.ts` (+2, -4)
- `packages/core/src/model-request.ts` (+5, -27)
- `packages/core/src/model.ts` (+14, -103)
- `packages/core/src/permission.ts` (+11, -14)
- `packages/core/src/plugin/host.ts` (+61, -0)
- `packages/core/src/plugin/internal.ts` (+5, -0)
- `packages/core/src/plugin/promise.ts` (+4, -0)
- `packages/core/src/plugin/provider/openai-auth.ts` (+0, -257)
- `packages/core/src/plugin/provider/openai.ts` (+255, -7)
- `packages/core/src/plugin/provider/opencode.ts` (+304, -22)
- `packages/core/src/plugin/skill.ts` (+2, -2)
- `packages/core/src/process.ts` (+8, -1)
- `packages/core/src/project/schema.ts` (+3, -7)
- `packages/core/src/provider.ts` (+11, -59)
- `packages/core/src/reference.ts` (+7, -15)
- `packages/core/src/ripgrep.ts` (+8, -15)
- `packages/core/src/schema.ts` (+18, -58)
- `packages/core/src/session.ts` (+2, -6)
- `packages/core/src/session/error.ts` (+5, -1)
- `packages/core/src/session/event.ts` (+8, -13)
- `packages/core/src/session/input.ts` (+4, -16)
- `packages/core/src/session/message-id.ts` (+1, -12)
- `packages/core/src/session/message-updater.ts` (+15, -15)
- `packages/core/src/session/message.ts` (+1, -192)
- `packages/core/src/session/prompt.ts` (+1, -46)
- `packages/core/src/session/runner/model.ts` (+40, -28)
- `packages/core/src/session/schema.ts` (+4, -44)
- `packages/core/src/skill.ts` (+21, -50)
- `packages/core/src/system-context/index.ts` (+5, -1)
- `packages/core/src/tool-output-store.ts` (+6, -1)
- `packages/core/src/util/identifier.ts` (+1, -48)
- `packages/core/src/v2-schema.ts` (+2, -9)
- `packages/core/src/workspace.ts` (+2, -14)
- `packages/core/test/catalog.test.ts` (+31, -2)
- `packages/core/test/command.test.ts` (+2, -2)
- `packages/core/test/config/command.test.ts` (+3, -3)
- `packages/core/test/config/skill.test.ts` (+6, -6)
- `packages/core/test/credential.test.ts` (+2, -2)
- `packages/core/test/event.test.ts` (+2, -16)
- `packages/core/test/integration.test.ts` (+7, -7)
- `packages/core/test/location-layer.test.ts` (+22, -8)
- `packages/core/test/models.test.ts` (+2, -5)
- `packages/core/test/plugin/fixture.ts` (+2, -0)
- `packages/core/test/plugin/host.ts` (+78, -10)
- `packages/core/test/plugin/provider-alibaba.test.ts` (+4, -4)
- `packages/core/test/plugin/provider-amazon-bedrock.test.ts` (+22, -22)
- `packages/core/test/plugin/provider-anthropic.test.ts` (+3, -3)
- `packages/core/test/plugin/provider-azure-cognitive-services.test.ts` (+8, -8)
- `packages/core/test/plugin/provider-azure.test.ts` (+12, -12)
- `packages/core/test/plugin/provider-cerebras.test.ts` (+3, -3)
- `packages/core/test/plugin/provider-cloudflare-ai-gateway.test.ts` (+11, -11)
- `packages/core/test/plugin/provider-cloudflare-workers-ai.test.ts` (+6, -6)
- `packages/core/test/plugin/provider-cohere.test.ts` (+4, -4)
- `packages/core/test/plugin/provider-deepinfra.test.ts` (+6, -6)
- `packages/core/test/plugin/provider-dynamic.test.ts` (+8, -8)
- `packages/core/test/plugin/provider-gateway.test.ts` (+4, -4)
- `packages/core/test/plugin/provider-github-copilot.test.ts` (+13, -13)
- `packages/core/test/plugin/provider-gitlab.test.ts` (+8, -8)
- `packages/core/test/plugin/provider-google-vertex-anthropic.test.ts` (+8, -8)
- `packages/core/test/plugin/provider-google-vertex.test.ts` (+4, -4)
- `packages/core/test/plugin/provider-google.test.ts` (+3, -3)
- `packages/core/test/plugin/provider-groq.test.ts` (+5, -5)
- `packages/core/test/plugin/provider-mistral.test.ts` (+5, -5)
- `packages/core/test/plugin/provider-openai-compatible.test.ts` (+5, -5)
- `packages/core/test/plugin/provider-openai.test.ts` (+6, -6)
- `packages/core/test/plugin/provider-opencode.test.ts` (+137, -14)
- `packages/core/test/plugin/provider-openrouter.test.ts` (+2, -2)
- `packages/core/test/plugin/provider-perplexity.test.ts` (+5, -5)
- `packages/core/test/plugin/provider-sap-ai-core.test.ts` (+1, -1)
- `packages/core/test/plugin/provider-snowflake-cortex.test.ts` (+6, -6)
- `packages/core/test/plugin/provider-togetherai.test.ts` (+5, -5)
- `packages/core/test/plugin/provider-venice.test.ts` (+5, -5)
- `packages/core/test/plugin/provider-vercel.test.ts` (+1, -1)
- `packages/core/test/plugin/provider-xai.test.ts` (+5, -5)
- `packages/core/test/process/process.test.ts` (+1, -0)
- `packages/core/test/reference-guidance.test.ts` (+2, -2)
- `packages/core/test/reference.test.ts` (+3, -3)
- `packages/core/test/session-create.test.ts` (+2, -17)
- `packages/core/test/session-projector.test.ts` (+10, -10)
- `packages/core/test/session-prompt.test.ts` (+28, -23)
- `packages/core/test/session-runner-message.test.ts` (+35, -35)
- `packages/core/test/session-runner-model.test.ts` (+18, -27)
- `packages/core/test/session-runner-recorded.test.ts` (+1, -1)
- `packages/core/test/session-runner-tool-registry.test.ts` (+1, -0)
- `packages/core/test/session-runner.test.ts` (+120, -127)
- `packages/core/test/shared-schema.test.ts` (+185, -0)
- `packages/core/test/skill.test.ts` (+1, -1)
- `packages/core/test/skill/guidance.test.ts` (+8, -8)
- `packages/core/test/tool-skill.test.ts` (+2, -5)
- `packages/stats/core/src/domain/inference.ts` (+2, -1)
- `packages/stats/core/src/honeycomb-backfill.ts` (+5, -1)

#### Other Changes
- `.github/ISSUE_TEMPLATE/config.yml` (+1, -1)
- `.github/ISSUE_TEMPLATE/question.yml` (+0, -10)
- `bun.lock` (+33, -20)
- `infra/stats.ts` (+2, -1)
- `nix/hashes.json` (+4, -4)
- `nix/opencode.nix` (+7, -0)
- `package.json` (+3, -3)
- `packages/app/e2e/performance/README.md` (+2, -0)
- `packages/app/e2e/performance/timeline/first-navigation-benchmark.spec.ts` (+87, -0)
- `packages/app/e2e/performance/timeline/first-navigation-metrics.ts` (+32, -0)
- `packages/app/e2e/performance/timeline/first-navigation-probe.ts` (+86, -0)
- `packages/app/e2e/performance/timeline/home-tab-navigation-benchmark.spec.ts` (+114, -0)
- `packages/app/e2e/performance/timeline/navigation-milestones.ts` (+128, -0)
- `packages/app/e2e/performance/timeline/session-tab-flash.spec.ts` (+18, -0)
- `packages/app/e2e/performance/timeline/session-timeline-stress.fixture.ts` (+38, -4)
- `packages/app/e2e/performance/timeline/timeline-test-helpers.ts` (+26, -12)
- `packages/app/e2e/performance/unit/first-navigation-metrics.test.ts` (+32, -0)
- `packages/app/e2e/performance/unit/navigation-milestones.test.ts` (+34, -0)
- `packages/app/e2e/performance/unit/timeline-test-helpers.test.ts` (+10, -0)
- `packages/app/e2e/regression/review-line-comment.spec.ts` (+1, -1)
- `packages/app/e2e/smoke/session-timeline.spec.ts` (+12, -2)
- `packages/app/e2e/utils/mock-server.ts` (+11, -4)
- `packages/app/index.html` (+7, -4)
- `packages/app/public/oc-theme-preload.js` (+2, -1)
- `packages/app/src/app.tsx` (+171, -175)
- `packages/app/src/components/debug-bar.tsx` (+1, -1)
- `packages/app/src/components/dialog-edit-project.tsx` (+1, -1)
- `packages/app/src/components/dialog-select-directory-v2.tsx` (+16, -9)
- `packages/app/src/components/dialog-select-directory.tsx` (+1, -1)
- `packages/app/src/components/directory-picker-domain.test.ts` (+36, -0)
- `packages/app/src/components/directory-picker-domain.ts` (+73, -0)
- `packages/app/src/components/help-button.tsx` (+1, -1)
- `packages/app/src/components/prompt-input.tsx` (+1, -1)
- `packages/app/src/components/prompt-input/submit.test.ts` (+1, -1)
- `packages/app/src/components/settings-server-picker.tsx` (+1, -1)
- `packages/app/src/components/settings-v2/settings-v2.css` (+9, -0)
- `packages/app/src/components/titlebar.tsx` (+132, -70)
- `packages/app/src/context/directory-sync.ts` (+1, -1)
- `packages/app/src/context/global.tsx` (+4, -1)
- `packages/app/src/context/notification.tsx` (+6, -7)
- `packages/app/src/context/prompt.tsx` (+43, -5)
- `packages/app/src/context/sdk.tsx` (+2, -2)
- `packages/app/src/context/server-sdk.tsx` (+3, -3)
- `packages/app/src/context/server-sync.tsx` (+2, -2)
- `packages/app/src/context/sync.tsx` (+1, -1)
- `packages/app/src/context/tab-memory.ts` (+33, -0)
- `packages/app/src/context/tabs.test.ts` (+24, -0)
- `packages/app/src/context/tabs.tsx` (+21, -3)
- `packages/app/src/pages/directory-layout.tsx` (+7, -1)
- `packages/app/src/pages/home.tsx` (+79, -41)
- `packages/app/src/pages/layout-new.tsx` (+10, -3)
- `packages/app/src/pages/layout.tsx` (+5, -5)
- `packages/app/src/pages/layout/session-tab-avatar.tsx` (+33, -0)
- `packages/app/src/pages/session.tsx` (+27, -4)
- `packages/app/src/pages/session/composer/session-composer-region.tsx` (+43, -10)
- `packages/app/src/pages/session/timeline/model.test.ts` (+3, -15)
- `packages/app/src/pages/session/timeline/model.ts` (+6, -22)
- `packages/app/src/utils/session-placement.test.ts` (+38, -0)
- `packages/app/src/utils/session-placement.ts` (+41, -0)
- `packages/app/test-browser/prompt-persistence.test.ts` (+71, -0)
- `packages/cli/src/commands/commands.ts` (+16, -0)
- `packages/cli/src/commands/handlers/api.test.ts` (+35, -0)
- `packages/cli/src/commands/handlers/api.ts` (+85, -0)
- `packages/cli/src/index.ts` (+1, -0)
- `packages/console/app/src/routes/zen/util/handler.ts` (+1, -0)
- `packages/console/function/src/log-processor.ts` (+1, -0)
- `packages/llm/package.json` (+1, -0)
- `packages/llm/src/schema/ids.ts` (+3, -3)
- `packages/llm/src/schema/messages.ts` (+2, -17)
- `packages/opencode/src/acp/content.ts` (+21, -2)
- `packages/opencode/src/mcp/catalog.ts` (+11, -1)
- `packages/opencode/src/mcp/index.ts` (+15, -0)
- `packages/opencode/src/mcp/oauth-callback.ts` (+3, -1)
- `packages/opencode/src/provider/provider.ts` (+17, -0)
- `packages/opencode/src/server/routes/instance/httpapi/api.ts` (+13, -1)
- `packages/opencode/src/session/prompt.ts` (+5, -5)
- `packages/opencode/src/session/tools.ts` (+99, -8)
- `packages/opencode/src/snapshot/index.ts` (+19, -10)
- `packages/opencode/test/acp/content.test.ts` (+38, -4)
- `packages/opencode/test/mcp/lifecycle.test.ts` (+28, -0)
- `packages/opencode/test/mcp/oauth-callback.test.ts` (+42, -0)
- `packages/opencode/test/provider/provider.test.ts` (+2, -0)
- `packages/opencode/test/server/httpapi-public-openapi.test.ts` (+14, -0)
- `packages/opencode/test/server/httpapi-session.test.ts` (+1, -2)
- `packages/opencode/test/session/prompt.test.ts` (+186, -202)
- `packages/opencode/test/session/snapshot-tool-race.test.ts` (+1, -0)
- `packages/opencode/test/snapshot/snapshot.test.ts` (+93, -0)
- `packages/plugin/package.json` (+5, -3)
- `packages/plugin/src/v2/effect/integration.ts` (+37, -8)
- `packages/plugin/src/v2/effect/plugin.ts` (+3, -3)
- `packages/plugin/src/v2/effect/skill.ts` (+3, -8)
- `packages/plugin/src/v2/promise/index.ts` (+2, -7)
- `packages/plugin/src/v2/promise/integration.ts` (+11, -5)
- `packages/plugin/src/v2/promise/skill.ts` (+2, -2)
- `packages/schema/package.json` (+22, -0)
- `packages/schema/src/agent.ts` (+37, -0)
- `packages/schema/src/command.ts` (+14, -0)
- `packages/schema/src/connection.ts` (+22, -0)
- `packages/schema/src/credential.ts` (+34, -0)
- `packages/schema/src/filesystem.ts` (+26, -0)
- `packages/schema/src/identifier.ts` (+30, -0)
- `packages/schema/src/index.ts` (+21, -0)
- `packages/schema/src/integration.ts` (+79, -0)
- `packages/schema/src/llm.ts` (+23, -0)
- `packages/schema/src/location.ts` (+14, -0)
- `packages/schema/src/model-request.ts` (+31, -0)
- `packages/schema/src/model.ts` (+104, -0)
- `packages/schema/src/project.ts` (+10, -0)
- `packages/schema/src/prompt.ts` (+56, -0)
- `packages/schema/src/provider.ts` (+69, -0)
- `packages/schema/src/reference.ts` (+24, -0)
- `packages/schema/src/schema.ts` (+30, -0)
- `packages/schema/src/session-delivery.ts` (+6, -0)
- `packages/schema/src/session-id.ts` (+17, -0)
- `packages/schema/src/session-input.ts` (+22, -0)
- `packages/schema/src/session-message-id.ts` (+11, -0)
- `packages/schema/src/session-message.ts` (+204, -0)
- `packages/schema/src/session.ts` (+46, -0)
- `packages/schema/src/skill.ts` (+54, -0)
- `packages/schema/src/workspace.ts` (+21, -0)
- `packages/schema/tsconfig.json` (+8, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+85, -2)
- `packages/sdk/openapi.json` (+249, -15)
- `packages/tui/src/component/dialog-model.tsx` (+5, -1)
- `packages/tui/src/component/dialog-provider.tsx` (+3, -3)
- `packages/tui/src/component/error-component.tsx` (+231, -51)
- `packages/tui/src/component/prompt/autocomplete.tsx` (+2, -6)
- `packages/tui/src/config/keybind.ts` (+2, -0)
- `packages/tui/src/routes/session/index.tsx` (+5, -17)
- `packages/tui/src/ui/dialog-prompt.tsx` (+1, -1)
- `packages/tui/test/cli/cmd/tui/model-options.test.ts` (+7, -5)
- `packages/tui/test/config.test.tsx` (+6, -0)
- `packages/ui/src/assets/favicon/site.webmanifest` (+5, -2)
- `packages/ui/src/components/markdown-cache.tsx` (+78, -0)
- `packages/ui/src/components/markdown-preload.test.ts` (+18, -0)
- `packages/ui/src/components/markdown.tsx` (+7, -53)
- `packages/ui/src/theme/context.tsx` (+2, -1)
- `packages/ui/src/v2/components/accordion-v2.css` (+4, -4)
- `packages/ui/src/v2/components/basic-tool-v2.css` (+7, -7)
- `packages/ui/src/v2/components/checkbox-v2.css` (+19, -13)
- `packages/ui/src/v2/components/dialog-v2.css` (+1, -0)
- `packages/ui/src/v2/components/dialog-v2.tsx` (+1, -1)
- `packages/ui/src/v2/components/diff-changes-v2.css` (+2, -2)
- `packages/ui/src/v2/components/field-v2.css` (+5, -5)
- `packages/ui/src/v2/components/inline-input-v2.css` (+20, -19)
- `packages/ui/src/v2/components/line-comment-v2.css` (+16, -15)
- `packages/ui/src/v2/components/project-avatar-v2.css` (+0, -23)
- `packages/ui/src/v2/components/project-avatar-v2.stories.tsx` (+0, -17)
- `packages/ui/src/v2/components/project-avatar-v2.tsx` (+1, -15)
- `packages/ui/src/v2/components/radio-v2.css` (+22, -17)
- `packages/ui/src/v2/components/segmented-control-v2.css` (+7, -7)
- `packages/ui/src/v2/components/session-progress-indicator-v2.css` (+875, -0)
- `packages/ui/src/v2/components/session-progress-indicator-v2.stories.tsx` (+66, -0)
- `packages/ui/src/v2/components/session-progress-indicator-v2.tsx` (+32, -0)
- `packages/ui/src/v2/components/text-shimmer-v2.css` (+2, -2)
- `packages/ui/src/v2/components/textarea-v2.css` (+12, -11)
- `packages/ui/src/v2/components/tool-error-card-v2.css` (+8, -8)
- `packages/ui/src/v2/components/tool-error-card-v2.tsx` (+2, -2)
- `packages/ui/src/v2/components/tooltip-v2.css` (+3, -3)
- `packages/web/src/content/docs/keybinds.mdx` (+1, -0)
- `specs/v2/schema-changelog.md` (+0, -20)
- `sst-env.d.ts` (+52, -8)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 2aec5ec..633da4b 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -91,6 +91,7 @@
     "@opencode-ai/effect-drizzle-sqlite": "workspace:*",
     "@opencode-ai/effect-sqlite-node": "workspace:*",
     "@opencode-ai/llm": "workspace:*",
+    "@opencode-ai/schema": "workspace:*",
     "@opencode-ai/plugin": "workspace:*",
     "@opentelemetry/api": "1.9.0",
     "@opentelemetry/context-async-hooks": "2.6.1",
```

#### packages/core/src/agent.ts
```diff
diff --git a/packages/core/src/agent.ts b/packages/core/src/agent.ts
index f27b5c3..91f4116 100644
--- a/packages/core/src/agent.ts
+++ b/packages/core/src/agent.ts
@@ -1,46 +1,17 @@
 export * as AgentV2 from "./agent"
 
-import { Array, Context, Effect, Layer, Schema, Scope, Types } from "effect"
-import { ModelV2 } from "./model"
-import { PermissionSchema } from "./permission/schema"
-import { ProviderV2 } from "./provider"
-import { PositiveInt } from "./schema"
+import { Array, Context, Effect, Layer, Types } from "effect"
+import { Agent } from "@opencode-ai/schema/agent"
 import { State } from "./state"
 
-export const ID = Schema.String.pipe(Schema.brand("AgentV2.ID"))
+export const ID = Agent.ID
 export type ID = typeof ID.Type
 export const defaultID = ID.make("build")
 
-export const Color = Schema.Union([
-  Schema.String.check(Schema.isPattern(/^#[0-9a-fA-F]{6}$/)),
-  Schema.Literals(["primary", "secondary", "accent", "success", "warning", "error", "info"]),
-])
+export const Color = Agent.Color
 
-export class Info extends Schema.Class<Info>("AgentV2.Info")({
-  id: ID,
-  model: ModelV2.Ref.pipe(Schema.optional),
-  request: ProviderV2.Request,
-  system: Schema.String.pipe(Schema.optional),
-  description: Schema.String.pipe(Schema.optional),
-  mode: Schema.Literals(["subagent", "primary", "all"]),
-  hidden: Schema.Boolean,
-  color: Color.pipe(Schema.optional),
-  steps: PositiveInt.pipe(Schema.optional),
-  permissions: PermissionSchema.Ruleset,
-}) {
-  static empty(id: ID) {
-    return new Info({
-      id,
-      request: {
-        headers: {},
-        body: {},
-      },
-      mode: "all",
-      hidden: false,
-      permissions: [],
-    })
```

#### packages/core/src/catalog.ts
```diff
diff --git a/packages/core/src/catalog.ts b/packages/core/src/catalog.ts
index ade2d64..0b27429 100644
--- a/packages/core/src/catalog.ts
+++ b/packages/core/src/catalog.ts
@@ -73,7 +73,7 @@ export const layer = Layer.effect(
       if (provider.disabled) return false
       if (typeof provider.request.body.apiKey === "string") return true
       if (integration?.connections.length) return true
-      return !integration
+      return provider.integrationID === undefined && !integration
     }
 
     const projectModel = (model: ModelV2.Info, provider: ProviderV2.Info) => {
@@ -89,7 +89,7 @@ export const layer = Layer.effect(
         ...ModelRequest.merge({ ...provider.request, generation: {}, options: {} }, model.request),
         variant: model.request.variant,
       }
-      return new ModelV2.Info({
+      return ModelV2.Info.make({
         ...model,
         api,
         request,
@@ -184,7 +184,7 @@ export const layer = Layer.effect(
         available: Effect.fn("CatalogV2.provider.available")(function* () {
           const active = new Map((yield* integrations.list()).map((integration) => [integration.id, integration]))
           return (yield* result.provider.all()).filter((provider) =>
-            available(provider, active.get(Integration.ID.make(provider.id))),
+            available(provider, active.get(provider.integrationID ?? Integration.ID.make(provider.id))),
           )
         }),
       },
```

#### packages/core/src/command.ts
```diff
diff --git a/packages/core/src/command.ts b/packages/core/src/command.ts
index 947ad31..c65693e 100644
--- a/packages/core/src/command.ts
+++ b/packages/core/src/command.ts
@@ -1,17 +1,11 @@
 export * as CommandV2 from "./command"
 
-import { Context, Effect, Layer, Schema, Types } from "effect"
-import { ModelV2 } from "./model"
+import { Context, Effect, Layer, Types } from "effect"
+import { Command } from "@opencode-ai/schema/command"
 import { State } from "./state"
 
-export class Info extends Schema.Class<Info>("CommandV2.Info")({
-  name: Schema.String,
-  template: Schema.String,
-  description: Schema.String.pipe(Schema.optional),
-  agent: Schema.String.pipe(Schema.optional),
-  model: ModelV2.Ref.pipe(Schema.optional),
-  subtask: Schema.Boolean.pipe(Schema.optional),
-}) {}
+export const Info = Command.Info
+export type Info = Command.Info
 
 export type Data = {
   commands: Map<string, Types.DeepMutable<Info>>
@@ -40,7 +34,7 @@ export const layer = Layer.effect(
         list: () => Array.from(draft.commands.values()) as Info[],
         get: (name) => draft.commands.get(name),
         update: (name, update) => {
-          const current = draft.commands.get(name) ?? (new Info({ name, template: "" }) as Types.DeepMutable<Info>)
+          const current = draft.commands.get(name) ?? ({ name, template: "" } as Types.DeepMutable<Info>)
           if (!draft.commands.has(name)) draft.commands.set(name, current)
           update(current)
           current.name = name
```

#### packages/core/src/config.ts
```diff
diff --git a/packages/core/src/config.ts b/packages/core/src/config.ts
index 26cd372..1f97194 100644
--- a/packages/core/src/config.ts
+++ b/packages/core/src/config.ts
@@ -3,10 +3,10 @@ export * as Config from "./config"
 import path from "path"
 import { type ParseError, parse } from "jsonc-parser"
 import { Context, Effect, Layer, Option, Schema } from "effect"
+import { Permission } from "@opencode-ai/schema/permission"
 import { FSUtil } from "./fs-util"
 import { Global } from "./global"
 import { Location } from "./location"
-import { PermissionSchema } from "./permission/schema"
 import { Policy } from "./policy"
 import { AbsolutePath } from "./schema"
 import { ConfigAgent } from "./config/agent"
@@ -56,7 +56,7 @@ export class Info extends Schema.Class<Info>("Config.Info")({
   username: Schema.String.pipe(Schema.optional).annotate({
     description: "Username displayed in conversations and used for telemetry identity",
   }),
-  permissions: PermissionSchema.Ruleset.pipe(Schema.optional).annotate({
+  permissions: Permission.Ruleset.pipe(Schema.optional).annotate({
     description: "Ordered tool permission rules applied to agent tool use",
   }),
   agents: Schema.Record(Schema.String, ConfigAgent.Info).pipe(Schema.optional).annotate({
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/src/cross-spawn-spawner.ts
- `src/core/` - review core changes from packages/core/src/filesystem.ts
- `src/core/` - review core changes from packages/core/test/util/effect-flock.test.ts
- `src/core/` - review core changes from packages/kilo-indexing/src/indexing/orchestrator.ts
- `src/core/` - review core changes from packages/kilo-indexing/test/kilocode/indexing/orchestrator.test.ts
- `src/tool/apply_patch.ts` - update based on kilocode packages/opencode/src/tool/apply_patch.ts changes
- `src/tool/background-process.ts` - update based on kilocode packages/opencode/src/kilocode/tool/background-process.ts changes
- `src/tool/edit.ts` - update based on kilocode packages/opencode/src/tool/edit.ts changes
- `src/tool/encoded-io.ts` - update based on kilocode packages/opencode/src/kilocode/tool/encoded-io.ts changes
- `src/tool/glob.ts` - update based on opencode packages/core/src/tool/glob.ts changes
- `src/tool/grep.ts` - update based on opencode packages/core/src/tool/grep.ts changes
- `src/tool/read-filesystem.ts` - update based on opencode packages/core/src/tool/read-filesystem.ts changes
- `src/tool/registry.test.ts` - update based on kilocode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
- `src/tool/skill.test.ts` - update based on opencode packages/opencode/test/tool/skill.test.ts changes
- `src/tool/skill.ts` - update based on opencode packages/core/src/tool/skill.ts changes
- `src/tool/skill.ts` - update based on opencode packages/opencode/src/tool/skill.ts changes
- `src/tool/write.ts` - update based on kilocode packages/opencode/src/tool/write.ts changes
