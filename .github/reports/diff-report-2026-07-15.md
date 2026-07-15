# Upstream Changes Report
Generated: 2026-07-15 08:11:16

## Summary
- kilocode: 91 commits, 204 files changed
- opencode: 39 commits, 175 files changed

## kilocode Changes (a4e1dd72c..323227940)

### Commits

- 323227940 - Merge pull request #12219 from Kilo-Org/jetbrains/release/v7.0.6 (Kirill Kalishev, 2026-07-14)
- 8a0a84f65 - docs(jetbrains): edit changelog for v7.0.6 (Kirill Kalishev, 2026-07-14)
- 4ce5ca050 - release(jetbrains): v7.0.6 (kilo-maintainer[bot], 2026-07-14)
- 1c197703b - Merge pull request #12215 from Kilo-Org/spiced-pecorino (Kirill Kalishev, 2026-07-14)
- 76f99006d - fix(jetbrains): stop double-scaling session heights under IDE zoom (kirillk, 2026-07-14)
- c49560af0 - fix(cli): keep session database compatible with released clients (#12207) (Marius, 2026-07-14)
- d318763da - Merge pull request #12214 from Kilo-Org/smart-carp (Kirill Kalishev, 2026-07-14)
- 08e9b34f2 - fix(jetbrains): remove zoomed transcript empty space (kirillk, 2026-07-14)
- a59c8d31c - fix(jetbrains): keep zoomed prompt composer compact (kirillk, 2026-07-14)
- 9f9509dde - fix(jetbrains): scale session UI with IDE zoom (kirillk, 2026-07-14)
- 737993e21 - fix(jetbrains): honor IDE certificate and proxy settings for outbound HTTPS (kirillk, 2026-07-14)
- 38d760896 - fix(agent-manager): preserve local HEAD when moving session to worktree (#12212) (Marius, 2026-07-14)
- 8badfac54 - Merge pull request #12211 from Kilo-Org/supersede/cache-token-arrow-12170 (Marius, 2026-07-14)
- 79587eef3 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-07-14)
- b47878636 - fix(vscode): correct cache token indicator (Mohammad Javad Naderi, 2026-07-14)
- 72f73eec0 - Merge pull request #12174 from Kilo-Org/feat-agent-manager-orchestration-api (Marius, 2026-07-14)
- c13578d28 - Merge pull request #12183 from AmariahAK/main (Marius, 2026-07-14)
- a088d8e94 - Merge branch 'main' into main (Johnny Eric Amancio, 2026-07-14)
- d3e929b6c - Merge pull request #12206 from Kilo-Org/jetbrains/release/v7.0.5 (Kirill Kalishev, 2026-07-14)
- 0f8be2aaf - docs(jetbrains): edit changelog for v7.0.5 (Kirill Kalishev, 2026-07-14)
- 49198a792 - release(jetbrains): v7.0.5 (kilo-maintainer[bot], 2026-07-14)
- 4ee737185 - Merge pull request #12188 from Kilo-Org/luxuriant-single (Kirill Kalishev, 2026-07-14)
- 675d97099 - feat(cli): bump session ingest version to v2 (#12117) (Florian Hines, 2026-07-14)
- 74c8de8ae - fix(jetbrains): validate raw v5 session ids (kirillk, 2026-07-14)
- baecb450c - Merge branch 'main' into main (PilgrimStack, 2026-07-14)
- 47d395726 - fix(vscode): update use-file-mention tests for "Browse files..." order (DeepSeek V4 Pro agent, 2026-07-14)
- d5c01fe82 - fix(jetbrains): reduce migration materialization memory (kirillk, 2026-07-14)
- bb1faec0e - Merge pull request #12203 from Kilo-Org/fix-model-cache-race (Marius, 2026-07-14)
- 59f78f9e8 - Merge pull request #12205 from Kilo-Org/re-disable-pull-10924 (Joshua Lambert, 2026-07-14)
- dd92a4fdf - Merge branch 'Kilo-Org:main' into main (PilgrimStack, 2026-07-14)
- 6ab2575ea - Merge branch 'main' into re-disable-pull-10924 (Joshua Lambert, 2026-07-14)
- e670a7738 - Merge pull request #11868 from Tamsi/docs/agent-behaviour-setting-descriptions (Joshua Lambert, 2026-07-14)
- 34b17de7f - Merge remote-tracking branch 'origin/main' into re-disable-pull-10924 (Josh Lambert, 2026-07-14)
- 204519025 - fix(cli): temporarily disable session export (Josh Lambert, 2026-07-14)
- d33d26f20 - Merge remote-tracking branch 'origin/main' into docs/agent-behaviour-setting-descriptions (Josh Lambert, 2026-07-14)
- 99ba835ed - fix(jetbrains): track migration wizard visibility (kirillk, 2026-07-14)
- 0ced872ed - Fix remote CLI session control from mobile (#12189) (Igor Šćekić, 2026-07-14)
- 750b622f4 - fix(cli): isolate model cache refresh from caller cancellation (marius-kilocode, 2026-07-14)
- bff30d4df - Merge pull request #11922 from LEN5010/fix/question-option-contrast (Marius, 2026-07-14)
- 39bb9ad48 - Merge remote-tracking branch 'origin/main' into pr-11922 (marius-kilocode, 2026-07-14)
- 08832b876 - Merge branch 'main' into pr-11922 (marius-kilocode, 2026-07-14)
- eb6f5c56a - Merge pull request #12158 from Kilo-Org/fix-read-permission-deny-bypass (Marius, 2026-07-14)
- f652aa49a - chore(cli): resolve latest main merge conflict (marius-kilocode, 2026-07-14)
- ba6e5b9df - fix(cli): allow trusting global skill directories (#12160) (Marius, 2026-07-14)
- 3df234c9a - test(cli): allow Windows process tree budget (marius-kilocode, 2026-07-14)
- 1950d503c - test(cli): relax cancellation race timeout (marius-kilocode, 2026-07-14)
- 7e20e4eb1 - Merge pull request #12201 from Kilo-Org/session/agent_180c8fe9-118d-4933-9d07-179e1dd84116 (Christiaan Arnoldus, 2026-07-14)
- 66dad15fc - fix(cli): resolve merge and release read streams (marius-kilocode, 2026-07-14)
- 4b6b7ac1f - Merge remote-tracking branch 'origin/main' into feat-agent-manager-orchestration-api (marius-kilocode, 2026-07-14)
- 51848c42c - fix(vscode): remember initial prompts in history (chrarnoldus, 2026-07-14)
- f68b0055b - chore(cli): resolve main merge conflicts (marius-kilocode, 2026-07-14)
- 965c5d6a4 - merge: sync main after permission review fixes (marius-kilocode, 2026-07-14)
- 217bc9794 - fix(cli): close file permission review gaps (marius-kilocode, 2026-07-14)
- b961f58ac - test(agent-manager): stabilize orchestration coverage (marius-kilocode, 2026-07-14)
- e604ddafc - Merge remote-tracking branch 'origin/main' into feat-agent-manager-orchestration-api (marius-kilocode, 2026-07-14)
- 99bee146a - fix(jetbrains): address v5 migration review follow-ups (kirillk, 2026-07-14)
- 455c3e3c5 - chore: update kilo-vscode visual regression baselines (Josh Lambert, 2026-07-13)
- 300ab6566 - Merge branch 'main' into docs/agent-behaviour-setting-descriptions (Joshua Lambert, 2026-07-14)
- 1449a6fb4 - Merge branch 'main' into luxuriant-single (Kirill Kalishev, 2026-07-13)
- eb39fffdb - fix(jetbrains): shorten v5 migration rerun label (kirillk, 2026-07-13)
- b0d8471cd - fix(jetbrains): address migration review feedback (kirillk, 2026-07-13)
- 349f9723f - fix(jetbrains): migrate legacy todo checklist items (kirillk, 2026-07-13)
- e9743c305 - Revert "docs(jetbrains): add dev snapshot build guidance" (kirillk, 2026-07-13)
- 8a859e49b - fix(jetbrains): harden legacy v5 migration import and reporting (kirillk, 2026-07-13)
- 084dd5cea - docs(jetbrains): add dev snapshot build guidance (kirillk, 2026-07-13)
- 048a0ee52 - fix(jetbrains): migrate legacy tools as assistant parts (kirillk, 2026-07-13)
- 17b0b22d4 - fix(jetbrains): import legacy v5 migration data (kirillk, 2026-07-13)
- 751cac5e7 - fix(vscode): move "Browse files..." to end of @-mention dropdown (DeepSeek V4 Pro agent, 2026-07-13)
- 733768229 - chore(sdk): regenerate after main merge (marius-kilocode, 2026-07-13)
- 4c69d5b40 - Merge remote-tracking branch 'origin/main' into feat-agent-manager-orchestration-api (marius-kilocode, 2026-07-13)
- 13b2f95d6 - merge: sync main into read permission fix (marius-kilocode, 2026-07-13)
- c1f114e88 - fix(agent-manager): require prompt approval (marius-kilocode, 2026-07-13)
- 1a4972c56 - docs(vscode): clarify max steps behavior (Josh Lambert, 2026-07-13)
- ece91489f - fix(agent-manager): keep provider under line cap (marius-kilocode, 2026-07-13)
- 29d0821e1 - Merge branch 'main' into docs/agent-behaviour-setting-descriptions (Joshua Lambert, 2026-07-13)
- 998db63e0 - Merge branch 'main' into feat-agent-manager-orchestration-api (Marius, 2026-07-13)
- 3ba4c3354 - feat(agent-manager): add native orchestration API (marius-kilocode, 2026-07-13)
- a46f94ba0 - docs(vscode): translate agent setting descriptions (Josh Lambert, 2026-07-13)
- 87b7d8194 - fix(cli): bind file permissions to opened objects (marius-kilocode, 2026-07-13)
- c5ec9759f - fix(cli): normalize configured reference paths on Windows (marius-kilocode, 2026-07-13)
- 030e9a85c - chore(cli): annotate canonical attachment read (marius-kilocode, 2026-07-13)
- 3b1e07cc0 - fix(cli): enforce read permissions for file mentions (marius-kilocode, 2026-07-13)
- 188c59cb2 - Merge branch 'main' into fix/question-option-contrast (LEN, 2026-07-07)
- 1094e9129 - Merge branch 'main' into fix/question-option-contrast (LEN, 2026-07-06)
- 504443034 - Merge branch 'main' into fix/question-option-contrast (LEN, 2026-07-04)
- ef039cdfe - Merge branch 'main' into fix/question-option-contrast (LEN, 2026-07-04)
- 56ea5c547 - Merge branch 'main' into fix/question-option-contrast (LEN, 2026-07-04)
- a1f101a0f - Merge branch 'main' into fix/question-option-contrast (LEN, 2026-07-04)
- 0312d24a3 - Merge branch 'main' into fix/question-option-contrast (LEN, 2026-07-03)
- 07dab7bf1 - fix(vscode): improve question option contrast (LEN5010, 2026-07-03)
- 5b97ba1c0 - docs(vscode): improve agent behaviour setting descriptions (#7668) (Tamsi, 2026-07-01)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/TaskToolView.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt` (+15, -12)
- `packages/opencode/src/kilocode/tool/agent-manager.ts` (+95, -5)
- `packages/opencode/src/kilocode/tool/agent-manager.txt` (+4, -2)
- `packages/opencode/src/kilocode/tool/notebook.ts` (+2, -2)
- `packages/opencode/src/kilocode/tool/read-docx.ts` (+2, -2)
- `packages/opencode/src/kilocode/tool/read-extract.ts` (+12, -4)
- `packages/opencode/src/kilocode/tool/read-object.ts` (+143, -0)
- `packages/opencode/src/kilocode/tool/registry.ts` (+13, -2)
- `packages/opencode/src/kilocode/tool/xlsx.ts` (+7, -4)
- `packages/opencode/src/tool/read.ts` (+159, -219)
- `packages/opencode/src/tool/registry.ts` (+4, -1)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
- `packages/opencode/src/kilocode/permission/agent-manager.ts` (+13, -0)
- `packages/opencode/src/kilocode/permission/config-paths.ts` (+58, -3)
- `packages/opencode/src/kilocode/permission/drain.ts` (+6, -2)
- `packages/opencode/src/permission/index.ts` (+38, -17)
- `packages/opencode/test/kilocode/permission/agent-manager-prompt.test.ts` (+28, -0)
- `packages/opencode/test/kilocode/permission/config-paths.test.ts` (+139, -0)
- `packages/opencode/test/kilocode/permission/external-directory-allow.test.ts` (+205, -1)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `.changeset/orchestrate-agent-manager-sessions.md` (+7, -0)
- `packages/core/migration/20260603040000_session_message_projection_order/migration.sql` (+2, -1)
- `packages/core/migration/20260603040000_session_message_projection_order/snapshot.json` (+1, -1)
- `packages/core/migration/20260603141458_session_input_inbox/snapshot.json` (+1, -1)
- `packages/core/migration/20260603160727_jittery_ezekiel_stane/snapshot.json` (+1, -1)
- `packages/core/migration/20260604172448_event_sourced_session_input/snapshot.json` (+1, -1)
- `packages/core/migration/20260605003541_add_session_context_snapshot/snapshot.json` (+1, -1)
- `packages/core/migration/20260605042240_add_context_epoch_agent/snapshot.json` (+2, -2)
- `packages/core/migration/20260714141136_session-message-legacy-writer-compat/migration.sql` (+19, -0)
- `packages/core/migration/20260714141136_session-message-legacy-writer-compat/snapshot.json` (+2083, -0)
- `packages/core/src/database/migration.gen.ts` (+1, -0)
- `packages/core/src/database/migration/20260603040000_session_message_projection_order.ts` (+1, -1)
- `packages/core/src/database/migration/20260714141136_session-message-legacy-writer-compat.ts` (+30, -0)
- `packages/core/src/session.ts` (+13, -8)
- `packages/core/src/session/history.ts` (+12, -3)
- `packages/core/src/session/projector.ts` (+19, -4)
- `packages/core/src/session/sql.ts` (+1, -1)
- `packages/core/src/session/store.ts` (+2, -2)
- `packages/core/test/kilocode/database-migration-compat.test.ts` (+128, -0)
- `packages/kilo-vscode/src/agent-manager/orchestration-bridge.ts` (+343, -0)
- `packages/kilo-vscode/src/agent-manager/orchestration-domain.ts` (+364, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-orchestration-bridge.test.ts` (+213, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-orchestration-domain.test.ts` (+247, -0)

#### Other Changes
- `.changeset/agent-behaviour-setting-descriptions.md` (+5, -0)
- `.changeset/calm-skill-permissions.md` (+5, -0)
- `.changeset/file-picker-default-selection.md` (+5, -0)
- `.changeset/fix-cache-token-arrow.md` (+5, -0)
- `.changeset/fix-question-option-contrast.md` (+5, -0)
- `.changeset/isolate-model-cache-refresh.md` (+5, -0)
- `.changeset/jetbrains-ide-zoom.md` (+5, -0)
- `.changeset/jetbrains-legacy-todos.md` (+5, -0)
- `.changeset/jetbrains-legacy-tool-turns.md` (+5, -0)
- `.changeset/jetbrains-legacy-v5-migration.md` (+5, -0)
- `.changeset/jetbrains-migration-later-and-language.md` (+5, -0)
- `.changeset/jetbrains-platform-http.md` (+5, -0)
- `.changeset/preserve-moved-worktree-head.md` (+5, -0)
- `.changeset/quiet-session-export-again.md` (+5, -0)
- `.changeset/remember-initial-prompts.md` (+5, -0)
- `.changeset/secure-file-mentions.md` (+6, -0)
- `.changeset/share-session-database-safely.md` (+5, -0)
- `packages/kilo-docs/pages/automate/agent-manager.md` (+1, -1)
- `packages/kilo-docs/pages/getting-started/settings/auto-approving-actions.md` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-usage-collapsed-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/agent-behaviour-edit-custom-mode-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/mode-edit-export-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/mode-edit-permissions-chromium-linux.png` (+2, -2)
- `packages/kilo-jetbrains/CHANGELOG.md` (+24, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendAppService.kt` (+60, -13)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloBackendHttpClients.kt` (+77, -6)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloCliDownloader.kt` (+1, -5)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/migration/InMemoryLegacyMigrationStore.kt` (+25, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/migration/KiloBackendLegacyMigrationStoreService.kt` (+247, -7)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/migration/LegacyMigrationConverters.kt` (+0, -27)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/migration/LegacyMigrationEngine.kt` (+6, -11)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/migration/LegacyV5Importer.kt` (+168, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/migration/LegacyV5Sources.kt` (+75, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/migration/session/LegacySessionIds.kt` (+6, -6)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/migration/session/LegacySessionParser.kt` (+27, -1)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/migration/session/LegacySessionParts.kt` (+170, -87)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/provider/KiloBackendProviderSettingsManager.kt` (+4, -11)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloMigrationRpcApiImpl.kt` (+24, -8)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/MigrationGateTest.kt` (+39, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/KiloBackendHttpClientsTest.kt` (+52, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/migration/KiloBackendLegacyMigrationStoreServiceTest.kt` (+105, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/migration/LegacyMigrationMaterializeTest.kt` (+117, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/migration/LegacyMigrationOrchestrationTest.kt` (+10, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/migration/LegacyMigrationSessionTest.kt` (+199, -11)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/migration/LegacyMigrationSourceTest.kt` (+73, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/migration/LegacyV5ImporterTest.kt` (+233, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/ForceMigrationAction.kt` (+37, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/migration/KiloMigrationService.kt` (+101, -14)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/migration/ui/MigrationOverlayPanel.kt` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/migration/ui/MigrationWizardPanel.kt` (+6, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/ConnectionPanel.kt` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionLayout.kt` (+14, -12)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanel.kt` (+7, -7)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/PromptPanel.kt` (+21, -7)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/style/SessionEditorStyle.kt` (+6, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/style/SessionUiStyle.kt` (+8, -8)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/CompactionView.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/MessageView.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/TextView.kt` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/TurnView.kt` (+1, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/question/QuestionView.kt` (+4, -3)
- `packages/kilo-jetbrains/frontend/src/main/resources/kilo.jetbrains.frontend.xml` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+6, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ar.properties` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_bs.properties` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_da.properties` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_de.properties` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_es.properties` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_fr.properties` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ja.properties` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ko.properties` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_nl.properties` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_no.properties` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pl.properties` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pt_BR.properties` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ru.properties` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_th.properties` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_tr.properties` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_uk.properties` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_CN.properties` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_TW.properties` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/migration/FakeMigrationUiController.kt` (+5, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/migration/KiloMigrationServiceTest.kt` (+103, -7)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/PromptPanelTest.kt` (+49, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionEditorStyleTest.kt` (+28, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionLayoutTest.kt` (+49, -18)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/TextViewTest.kt` (+11, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ToolViewTest.kt` (+26, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeMigrationRpcApi.kt` (+18, -0)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloMigrationRpcApi.kt` (+7, -1)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+15, -10)
- `packages/kilo-vscode/src/agent-manager/GitStatsPoller.ts` (+15, -2)
- `packages/kilo-vscode/src/agent-manager/WorktreeManager.ts` (+6, -1)
- `packages/kilo-vscode/src/agent-manager/continue-in-worktree.ts` (+4, -3)
- `packages/kilo-vscode/src/agent-manager/pr-status-bridge.ts` (+8, -0)
- `packages/kilo-vscode/src/agent-manager/worktree-create.ts` (+2, -0)
- `packages/kilo-vscode/tests/unit/continue-in-worktree.test.ts` (+42, -0)
- `packages/kilo-vscode/tests/unit/file-mention-utils.test.ts` (+8, -8)
- `packages/kilo-vscode/tests/unit/prompt-send-contract.test.ts` (+14, -0)
- `packages/kilo-vscode/tests/unit/use-file-mention.test.ts` (+3, -3)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskUsage.tsx` (+5, -5)
- `packages/kilo-vscode/webview-ui/src/hooks/file-mention-utils.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/src/styles/question-dock.css` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/routes/session/permission.tsx` (+7, -3)
- `packages/opencode/src/config/config.ts` (+30, -20)
- `packages/opencode/src/effect/app-runtime.ts` (+2, -0)
- `packages/opencode/src/kilo-sessions/ingest-queue.ts` (+2, -2)
- `packages/opencode/src/kilo-sessions/remote-sender.ts` (+46, -11)
- `packages/opencode/src/kilocode/agent-manager/protocol.ts` (+152, -0)
- `packages/opencode/src/kilocode/agent-manager/service.ts` (+151, -0)
- `packages/opencode/src/kilocode/bootstrap.ts` (+1, -0)
- `packages/opencode/src/kilocode/effect/cause.ts` (+5, -0)
- `packages/opencode/src/kilocode/reference/contains.ts` (+36, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/kilocode.ts` (+47, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilocode.ts` (+39, -1)
- `packages/opencode/src/kilocode/session-export/session-export.ts` (+2, -0)
- `packages/opencode/src/kilocode/session/prompt.ts` (+41, -8)
- `packages/opencode/src/kilocode/text-stream.ts` (+11, -15)
- `packages/opencode/src/provider/model-cache.ts` (+63, -14)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/session.ts` (+5, -6)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+2, -0)
- `packages/opencode/src/session/llm.ts` (+3, -2)
- `packages/opencode/src/session/prompt.ts` (+182, -57)
- `packages/opencode/test/kilocode/agent-manager-service.test.ts` (+123, -0)
- `packages/opencode/test/kilocode/agent-manager-tool.test.ts` (+118, -2)
- `packages/opencode/test/kilocode/background-process.test.ts` (+5, -2)
- `packages/opencode/test/kilocode/config/config.test.ts` (+39, -0)
- `packages/opencode/test/kilocode/effect-cause.test.ts` (+13, -0)
- `packages/opencode/test/kilocode/model-cache-effect.test.ts` (+124, -5)
- `packages/opencode/test/kilocode/read-directory.test.ts` (+3, -3)
- `packages/opencode/test/kilocode/session-prompt-permission-refresh.test.ts` (+820, -3)
- `packages/opencode/test/kilocode/sessions/ingest-queue.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/sessions/remote-sender.test.ts` (+121, -0)
- `packages/opencode/test/kilocode/tool-encoding.test.ts` (+6, -78)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+17, -0)
- `packages/opencode/test/session/prompt.test.ts` (+3, -9)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+136, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+230, -0)
- `packages/sdk/openapi.json` (+654, -1)

### Key Diffs

#### .changeset/orchestrate-agent-manager-sessions.md
```diff
diff --git a/.changeset/orchestrate-agent-manager-sessions.md b/.changeset/orchestrate-agent-manager-sessions.md
new file mode 100644
index 000000000..90a7658e1
--- /dev/null
+++ b/.changeset/orchestrate-agent-manager-sessions.md
@@ -0,0 +1,7 @@
+---
+"@kilocode/cli": patch
+"@kilocode/sdk": patch
+"kilo-code": patch
+---
+
+Inspect managed Agent Manager sessions and send a targeted prompt to an idle existing session from the native Agent Manager tool. Require a separate explicit approval before prompting another managed session.
```

#### packages/core/migration/20260603040000_session_message_projection_order/migration.sql
```diff
diff --git a/packages/core/migration/20260603040000_session_message_projection_order/migration.sql b/packages/core/migration/20260603040000_session_message_projection_order/migration.sql
index dbec67f27..e603be927 100644
--- a/packages/core/migration/20260603040000_session_message_projection_order/migration.sql
+++ b/packages/core/migration/20260603040000_session_message_projection_order/migration.sql
@@ -1,5 +1,6 @@
 DELETE FROM `session_message`;--> statement-breakpoint
-ALTER TABLE `session_message` ADD `seq` integer NOT NULL;--> statement-breakpoint
+-- kilocode_change
+ALTER TABLE `session_message` ADD `seq` integer;--> statement-breakpoint
 DROP INDEX IF EXISTS `session_message_session_time_created_id_idx`;--> statement-breakpoint
 DROP INDEX IF EXISTS `session_message_session_type_time_created_id_idx`;--> statement-breakpoint
 CREATE INDEX `session_message_session_seq_idx` ON `session_message` (`session_id`,`seq`);--> statement-breakpoint
```

#### packages/core/migration/20260603040000_session_message_projection_order/snapshot.json
```diff
diff --git a/packages/core/migration/20260603040000_session_message_projection_order/snapshot.json b/packages/core/migration/20260603040000_session_message_projection_order/snapshot.json
index 35aac3f7b..490f1a718 100644
--- a/packages/core/migration/20260603040000_session_message_projection_order/snapshot.json
+++ b/packages/core/migration/20260603040000_session_message_projection_order/snapshot.json
@@ -756,7 +756,7 @@
     },
     {
       "type": "integer",
-      "notNull": true,
+      "notNull": false,
       "autoincrement": false,
       "default": null,
       "generated": null,
```

#### packages/core/migration/20260603141458_session_input_inbox/snapshot.json
```diff
diff --git a/packages/core/migration/20260603141458_session_input_inbox/snapshot.json b/packages/core/migration/20260603141458_session_input_inbox/snapshot.json
index 7e51b1dfc..9839a2082 100644
--- a/packages/core/migration/20260603141458_session_input_inbox/snapshot.json
+++ b/packages/core/migration/20260603141458_session_input_inbox/snapshot.json
@@ -830,7 +830,7 @@
     },
     {
       "type": "integer",
-      "notNull": true,
+      "notNull": false,
       "autoincrement": false,
       "default": null,
       "generated": null,
```

#### packages/core/migration/20260603160727_jittery_ezekiel_stane/snapshot.json
```diff
diff --git a/packages/core/migration/20260603160727_jittery_ezekiel_stane/snapshot.json b/packages/core/migration/20260603160727_jittery_ezekiel_stane/snapshot.json
index a2ec834e7..80c5ff8fe 100644
--- a/packages/core/migration/20260603160727_jittery_ezekiel_stane/snapshot.json
+++ b/packages/core/migration/20260603160727_jittery_ezekiel_stane/snapshot.json
@@ -874,7 +874,7 @@
     },
     {
       "type": "integer",
-      "notNull": true,
+      "notNull": false,
       "autoincrement": false,
       "default": null,
       "generated": null,
```


*... and more files (showing first 5)*

## opencode Changes (cb8be9b..05c3e40)

### Commits

- 05c3e40 - fix(app): tolerate null session archive times (#36999) (Brendan Allan, 2026-07-15)
- b6478dc - fix(opencode): default Meta reasoning to xhigh (#36976) (opencode-agent[bot], 2026-07-14)
- 571e7b8 - fix(app): hide drawer close button on Windows (#36952) (Luke Parker, 2026-07-15)
- 888dd26 - sync release versions for v1.18.1 (opencode, 2026-07-14)
- 279c8bd - fix(console): compress desktop promo video (#36945) (opencode-agent[bot], 2026-07-14)
- 865e4d5 - chore: generate (opencode-agent[bot], 2026-07-14)
- 64950cd - feat(console): promote desktop tabs launch (#35972) (David Hill, 2026-07-14)
- 3615793 - fix(app): preserve themed diff backgrounds (#36931) (Luke Parker, 2026-07-15)
- c0dea33 - fix(app): space model provider sections (#36935) (opencode-agent[bot], 2026-07-15)
- 9b49daf - fix(app): update tabs drawer copy (#36937) (Luke Parker, 2026-07-15)
- d6f1b08 - sync release versions for v1.18.0 (opencode, 2026-07-14)
- 75cf4cc - chore: generate (opencode-agent[bot], 2026-07-14)
- 4a181c3 - desktop v2 migration finalising (#36912) (Brendan Allan, 2026-07-15)
- bfddf05 - fix(app): use v2 base background for file views (#36836) (opencode-agent[bot], 2026-07-14)
- cdee625 - fix: preserve team login casing (#35981) (opencode-agent[bot], 2026-07-14)
- 5f7091a - fix(app): wait for connected project picker anchor (#36879) (Luke Parker, 2026-07-15)
- e7e7a97 - fix(app): retain permission state per server (#36873) (Luke Parker, 2026-07-14)
- f58b8cb - fix(app): avoid project picker positioning crash (#36864) (Luke Parker, 2026-07-15)
- 775f687 - chore: generate (opencode-agent[bot], 2026-07-14)
- 265a939 - feat(desktop): add layout transition switch (#36667) (usrnk1, 2026-07-14)
- 3a938bb - feat(app): update new session page logo (#36700) (Aarav Sareen, 2026-07-14)
- 6f9a4e7 - chore: generate (opencode-agent[bot], 2026-07-14)
- dedb413 - feat(desktop): improve file comments in session timeline (#36845) (usrnk1, 2026-07-14)
- 21f8184 - fix(app): suppress review sidebar hydration motion (#36847) (Luke Parker, 2026-07-14)
- 59fe350 - fix(app): terminal tab rename focus (#36695) (Aarav Sareen, 2026-07-14)
- 5bdfcaa - fix(app): settings/help button misalignment in projects sidebar (#36662) (Aarav Sareen, 2026-07-14)
- 323d687 - feat(app): align custom agent selector with v2 (#36832) (Aarav Sareen, 2026-07-14)
- cdca203 - fix(app): enable remote session auto-accept (#36777) (Luke Parker, 2026-07-14)
- 77a31d2 - chore: generate (opencode-agent[bot], 2026-07-14)
- a1ed992 - fix(app): prevent terminal mount from stealing focus (#36576) (Luke Parker, 2026-07-14)
- 729bd43 - fix(app): preload more timeline messages (#36172) (Luke Parker, 2026-07-14)
- 7304bb2 - fix(app): resync timeline after route reconnect (#36643) (Luke Parker, 2026-07-14)
- 456521f - fix(data): align comparison suggestions (Adam, 2026-07-14)
- ee69079 - fix(data): proxy comparison sitemap (Adam, 2026-07-14)
- de14bb2 - fix(data): improve comparison metadata (Adam, 2026-07-14)
- 0539d56 - fix(data): polish comparison details (Adam, 2026-07-14)
- 729adde - fix(data): show all comparison models (Adam, 2026-07-14)
- b7111d5 - chore: generate (opencode-agent[bot], 2026-07-14)
- 1669713 - fix(data): restore breadcrumb styling (Adam, 2026-07-14)

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
- `packages/stats/core/package.json` (+1, -1)

#### Other Changes
- `.github/TEAM_MEMBERS` (+1, -1)
- `bun.lock` (+28, -28)
- `packages/app/e2e/performance/timeline-stability/fixture.ts` (+3, -0)
- `packages/app/e2e/regression/legacy-new-session.spec.ts` (+1, -0)
- `packages/app/e2e/regression/remote-session-settings.spec.ts` (+270, -0)
- `packages/app/e2e/regression/session-timeline-history-root.spec.ts` (+60, -38)
- `packages/app/e2e/regression/terminal-composer-focus.spec.ts` (+122, -2)
- `packages/app/e2e/reproduction/timeline-suspense/index.html` (+34, -0)
- `packages/app/e2e/reproduction/timeline-suspense/main.tsx` (+315, -0)
- `packages/app/e2e/reproduction/timeline-suspense/playwright.config.ts` (+34, -0)
- `packages/app/e2e/reproduction/timeline-suspense/timeline-suspense.repro.ts` (+179, -0)
- `packages/app/e2e/reproduction/timeline-suspense/vite.config.ts` (+7, -0)
- `packages/app/e2e/tsconfig.json` (+3, -0)
- `packages/app/e2e/utils/sse-transport.ts` (+1, -1)
- `packages/app/package.json` (+1, -1)
- `packages/app/src/app.tsx` (+17, -27)
- `packages/app/src/components/help-button.tsx` (+18, -19)
- `packages/app/src/components/prompt-input.tsx` (+27, -15)
- `packages/app/src/components/prompt-input/submit.test.ts` (+46, -7)
- `packages/app/src/components/prompt-input/submit.ts` (+2, -1)
- `packages/app/src/components/prompt-project-selector.tsx` (+31, -3)
- `packages/app/src/components/session/session-new-design-view.tsx` (+1, -1)
- `packages/app/src/components/session/session-sortable-terminal-tab-v2.tsx` (+3, -0)
- `packages/app/src/components/settings-general.tsx` (+53, -18)
- `packages/app/src/components/settings-v2/general.tsx` (+34, -18)
- `packages/app/src/components/settings-v2/interface-transition.stories.tsx` (+76, -0)
- `packages/app/src/components/settings-v2/interface-transition.tsx` (+54, -0)
- `packages/app/src/components/settings-v2/settings-v2.css` (+7, -2)
- `packages/app/src/components/terminal.tsx` (+27, -2)
- `packages/app/src/context/global-sync/home-session-index.test.ts` (+10, -0)
- `packages/app/src/context/global-sync/home-session-index.ts` (+2, -2)
- `packages/app/src/context/permission-auto-respond.test.ts` (+24, -1)
- `packages/app/src/context/permission-auto-respond.ts` (+13, -4)
- `packages/app/src/context/permission.tsx` (+390, -200)
- `packages/app/src/context/server-session.test.ts` (+2, -2)
- `packages/app/src/context/server-session.ts` (+1, -1)
- `packages/app/src/context/settings.test.ts` (+72, -0)
- `packages/app/src/context/settings.tsx` (+177, -4)
- `packages/app/src/context/tabs.tsx` (+3, -2)
- `packages/app/src/context/terminal.tsx` (+68, -5)
- `packages/app/src/i18n/ar.ts` (+7, -3)
- `packages/app/src/i18n/br.ts` (+7, -3)
- `packages/app/src/i18n/bs.ts` (+7, -3)
- `packages/app/src/i18n/da.ts` (+7, -3)
- `packages/app/src/i18n/de.ts` (+7, -3)
- `packages/app/src/i18n/en.ts` (+12, -7)
- `packages/app/src/i18n/es.ts` (+7, -3)
- `packages/app/src/i18n/fr.ts` (+7, -3)
- `packages/app/src/i18n/ja.ts` (+7, -3)
- `packages/app/src/i18n/ko.ts` (+7, -2)
- `packages/app/src/i18n/no.ts` (+7, -3)
- `packages/app/src/i18n/pl.ts` (+7, -3)
- `packages/app/src/i18n/ru.ts` (+7, -3)
- `packages/app/src/i18n/th.ts` (+7, -3)
- `packages/app/src/i18n/tr.ts` (+7, -3)
- `packages/app/src/i18n/uk.ts` (+7, -3)
- `packages/app/src/i18n/zh.ts` (+6, -2)
- `packages/app/src/i18n/zht.ts` (+6, -2)
- `packages/app/src/index.ts` (+1, -0)
- `packages/app/src/pages/home.tsx` (+3, -3)
- `packages/app/src/pages/layout-new.tsx` (+0, -2)
- `packages/app/src/pages/layout/project-avatar-state.ts` (+2, -1)
- `packages/app/src/pages/new-session.tsx` (+2, -1)
- `packages/app/src/pages/session.tsx` (+29, -19)
- `packages/app/src/pages/session/file-tabs.tsx` (+1, -1)
- `packages/app/src/pages/session/terminal-panel-v2.tsx` (+19, -33)
- `packages/app/src/pages/session/terminal-panel.tsx` (+4, -1)
- `packages/app/src/pages/session/timeline/message-timeline.tsx` (+2, -0)
- `packages/app/src/pages/session/timeline/observe-element-offset.test.ts` (+199, -0)
- `packages/app/src/pages/session/timeline/observe-element-offset.ts` (+73, -0)
- `packages/app/src/pages/session/use-session-commands.tsx` (+11, -2)
- `packages/app/src/pages/session/v2/review-panel-v2-state.ts` (+2, -1)
- `packages/app/src/pages/session/v2/review-panel-v2.tsx` (+1, -0)
- `packages/app/src/pages/session/v2/session-file-browser-tab.tsx` (+2, -0)
- `packages/app/test-browser/review-panel-v2-state.test.ts` (+65, -0)
- `packages/cli/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/app.tsx` (+2, -0)
- `packages/console/app/src/asset/lander/desktop-tabs-landscape.mp4` (+-, --)
- `packages/console/app/src/component/desktop-promo.css` (+103, -0)
- `packages/console/app/src/component/desktop-promo.tsx` (+48, -0)
- `packages/console/app/src/i18n/ar.ts` (+8, -4)
- `packages/console/app/src/i18n/br.ts` (+8, -4)
- `packages/console/app/src/i18n/da.ts` (+8, -4)
- `packages/console/app/src/i18n/de.ts` (+8, -4)
- `packages/console/app/src/i18n/en.ts` (+9, -4)
- `packages/console/app/src/i18n/es.ts` (+8, -4)
- `packages/console/app/src/i18n/fr.ts` (+8, -4)
- `packages/console/app/src/i18n/it.ts` (+8, -4)
- `packages/console/app/src/i18n/ja.ts` (+8, -4)
- `packages/console/app/src/i18n/ko.ts` (+8, -4)
- `packages/console/app/src/i18n/no.ts` (+8, -4)
- `packages/console/app/src/i18n/pl.ts` (+8, -4)
- `packages/console/app/src/i18n/ru.ts` (+8, -4)
- `packages/console/app/src/i18n/th.ts` (+8, -4)
- `packages/console/app/src/i18n/tr.ts` (+8, -4)
- `packages/console/app/src/i18n/uk.ts` (+8, -4)
- `packages/console/app/src/i18n/zh.ts` (+8, -4)
- `packages/console/app/src/i18n/zht.ts` (+8, -4)
- `packages/console/app/src/lib/stats-proxy.ts` (+4, -2)
- `packages/console/app/src/routes/download/index.css` (+20, -44)
- `packages/console/app/src/routes/download/index.tsx` (+6, -4)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/mail/package.json` (+1, -1)
- `packages/console/support/package.json` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/desktop/src/main/index.ts` (+8, -1)
- `packages/desktop/src/main/install-state.test.ts` (+19, -0)
- `packages/desktop/src/main/install-state.ts` (+8, -0)
- `packages/desktop/src/main/ipc.ts` (+2, -0)
- `packages/desktop/src/main/onboarding.ts` (+19, -2)
- `packages/desktop/src/main/store-keys.ts` (+1, -0)
- `packages/desktop/src/main/windows.ts` (+5, -1)
- `packages/desktop/src/preload/index.ts` (+1, -0)
- `packages/desktop/src/preload/types.ts` (+1, -0)
- `packages/desktop/src/renderer/onboarding.tsx` (+9, -35)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/enterprise/package.json` (+1, -1)
- `packages/function/package.json` (+1, -1)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/provider/transform.ts` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/session-ui/src/components/message-part.css` (+53, -4)
- `packages/session-ui/src/components/message-part.tsx` (+134, -98)
- `packages/session-ui/src/pierre/index.ts` (+5, -1)
- `packages/session-ui/src/v2/components/attachment-card-v2.css` (+12, -0)
- `packages/session-ui/src/v2/components/attachment-card-v2.tsx` (+8, -1)
- `packages/session-ui/src/v2/components/comment-card-v2.tsx` (+49, -12)
- `packages/session-ui/src/v2/components/session-review-v2.css` (+2, -1)
- `packages/session-ui/src/v2/components/session-review-v2.tsx` (+2, -0)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/app/src/app.tsx` (+2, -7)
- `packages/stats/app/src/component/model-compare-detail.tsx` (+5, -10)
- `packages/stats/app/src/routes/[lab]/[model].tsx` (+1, -0)
- `packages/stats/app/src/routes/[lab]/index.tsx` (+1, -0)
- `packages/stats/app/src/routes/compare/index.tsx` (+4, -3)
- `packages/stats/app/src/routes/index.css` (+10, -8)
- `packages/stats/server/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/i18n/ar.ts` (+1, -0)
- `packages/ui/src/i18n/br.ts` (+1, -0)
- `packages/ui/src/i18n/bs.ts` (+1, -0)
- `packages/ui/src/i18n/da.ts` (+1, -0)
- `packages/ui/src/i18n/de.ts` (+1, -0)
- `packages/ui/src/i18n/en.ts` (+1, -0)
- `packages/ui/src/i18n/es.ts` (+1, -0)
- `packages/ui/src/i18n/fr.ts` (+1, -0)
- `packages/ui/src/i18n/ja.ts` (+1, -0)
- `packages/ui/src/i18n/ko.ts` (+1, -0)
- `packages/ui/src/i18n/no.ts` (+1, -0)
- `packages/ui/src/i18n/pl.ts` (+1, -0)
- `packages/ui/src/i18n/ru.ts` (+1, -0)
- `packages/ui/src/i18n/th.ts` (+1, -0)
- `packages/ui/src/i18n/tr.ts` (+1, -0)
- `packages/ui/src/i18n/uk.ts` (+1, -0)
- `packages/ui/src/i18n/zh.ts` (+1, -0)
- `packages/ui/src/i18n/zht.ts` (+1, -0)
- `packages/ui/src/v2/components/badge-v2.css` (+6, -0)
- `packages/ui/src/v2/components/badge-v2.stories.tsx` (+6, -1)
- `packages/ui/src/v2/components/badge-v2.tsx` (+5, -2)
- `packages/ui/src/v2/components/wordmark-v2.tsx` (+48, -69)
- `packages/web/package.json` (+1, -1)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 9820650..6cb447d 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.17.20",
+  "version": "1.18.1",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index cbc26ff..5de186c 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.17.20",
+  "version": "1.18.1",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/stats/core/package.json
```diff
diff --git a/packages/stats/core/package.json b/packages/stats/core/package.json
index a907acb..425a9e1 100644
--- a/packages/stats/core/package.json
+++ b/packages/stats/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/stats-core",
-  "version": "1.17.20",
+  "version": "1.18.1",
   "private": true,
   "type": "module",
   "license": "MIT",
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from .changeset/orchestrate-agent-manager-sessions.md
- `src/core/` - review core changes from packages/core/migration/20260603040000_session_message_projection_order/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260603040000_session_message_projection_order/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260603141458_session_input_inbox/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260603160727_jittery_ezekiel_stane/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260604172448_event_sourced_session_input/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260605003541_add_session_context_snapshot/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260605042240_add_context_epoch_agent/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260714141136_session-message-legacy-writer-compat/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260714141136_session-message-legacy-writer-compat/snapshot.json
- `src/core/` - review core changes from packages/core/src/database/migration.gen.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260603040000_session_message_projection_order.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260714141136_session-message-legacy-writer-compat.ts
- `src/core/` - review core changes from packages/core/src/session.ts
- `src/core/` - review core changes from packages/core/src/session/history.ts
- `src/core/` - review core changes from packages/core/src/session/projector.ts
- `src/core/` - review core changes from packages/core/src/session/sql.ts
- `src/core/` - review core changes from packages/core/src/session/store.ts
- `src/core/` - review core changes from packages/core/test/kilocode/database-migration-compat.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/agent-manager/orchestration-bridge.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/agent-manager/orchestration-domain.ts
- `src/core/` - review core changes from packages/kilo-vscode/tests/unit/agent-manager-orchestration-bridge.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/tests/unit/agent-manager-orchestration-domain.test.ts
- `src/permission/` - review permission changes from packages/opencode/src/kilocode/permission/agent-manager.ts
- `src/permission/` - review permission changes from packages/opencode/src/kilocode/permission/config-paths.ts
- `src/permission/` - review permission changes from packages/opencode/src/kilocode/permission/drain.ts
- `src/permission/` - review permission changes from packages/opencode/src/permission/index.ts
- `src/permission/` - review permission changes from packages/opencode/test/kilocode/permission/agent-manager-prompt.test.ts
- `src/permission/` - review permission changes from packages/opencode/test/kilocode/permission/config-paths.test.ts
- `src/permission/` - review permission changes from packages/opencode/test/kilocode/permission/external-directory-allow.test.ts
- `src/tool/TaskToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/TaskToolView.kt changes
- `src/tool/ToolSupport.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt changes
- `src/tool/agent-manager.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager.ts changes
- `src/tool/agent-manager.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager.txt changes
- `src/tool/notebook.ts` - update based on kilocode packages/opencode/src/kilocode/tool/notebook.ts changes
- `src/tool/read-docx.ts` - update based on kilocode packages/opencode/src/kilocode/tool/read-docx.ts changes
- `src/tool/read-extract.ts` - update based on kilocode packages/opencode/src/kilocode/tool/read-extract.ts changes
- `src/tool/read-object.ts` - update based on kilocode packages/opencode/src/kilocode/tool/read-object.ts changes
- `src/tool/read.ts` - update based on kilocode packages/opencode/src/tool/read.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/kilocode/tool/registry.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
- `src/tool/xlsx.ts` - update based on kilocode packages/opencode/src/kilocode/tool/xlsx.ts changes
