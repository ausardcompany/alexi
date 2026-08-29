# Upstream Changes Report
Generated: 2026-08-29 12:25:48

## Summary
- kilocode: 26 commits, 81 files changed
- opencode: 2 commits, 8 files changed

## kilocode Changes (e126cc3ca..5e02825c8)

### Commits

- 5e02825c8 - Merge pull request #13278 from Kilo-Org/investigate-jetbrains-agent-manager-run-feature (Kirill Kalishev, 2026-08-28)
- 5f86ac2f3 - fix(jetbrains): isolate worktree removal tests from live RPC (kirillk, 2026-08-28)
- ce412e1e3 - Merge branch 'main' into investigate-jetbrains-agent-manager-run-feature (Kirill Kalishev, 2026-08-28)
- c65cb694e - fix(jetbrains): clarify worktree build and run controls (kirillk, 2026-08-28)
- 806b0168e - Merge pull request #13552 from Kilo-Org/fluffy-lynx (Kirill Kalishev, 2026-08-28)
- d2fd73b10 - fix(jetbrains): preserve session sharing state on reload (kirillk, 2026-08-28)
- 2241cdd11 - chore(jetbrains): merge main into session menu branch (kirillk, 2026-08-28)
- 1043e5733 - fix(jetbrains): open session prompt menu above the more button (kirillk, 2026-08-28)
- 8b711803b - feat(jetbrains): add prompt session actions menu (kirillk, 2026-08-28)
- ba3613d98 - feat(jetbrains): add a session right-click menu with sharing (kirillk, 2026-08-28)
- b09f78c9d - Merge remote-tracking branch 'origin/main' into investigate-jetbrains-agent-manager-run-feature (kirillk, 2026-08-28)
- a63ba4c01 - Merge remote-tracking branch 'origin/main' into investigate-jetbrains-agent-manager-run-feature (kirillk, 2026-08-27)
- b967e00b4 - Merge remote-tracking branch 'origin/main' into investigate-jetbrains-agent-manager-run-feature (kirillk, 2026-08-26)
- 441fc8076 - fix(jetbrains): fake KiloRunService in AgentManagerPanelTest (kirillk, 2026-08-25)
- 2cf15cb69 - Merge remote-tracking branch 'origin/main' into investigate-jetbrains-agent-manager-run-feature (kirillk, 2026-08-25)
- 1747e05a3 - fix(jetbrains): close worktree run release race and project identity check (kirillk, 2026-08-25)
- 432f66e3f - chore: merge main into worktree run branch (kirillk, 2026-08-25)
- ab7fca9b8 - fix(jetbrains): localize worktree run actions (kirillk, 2026-08-24)
- e43dd7f23 - fix(jetbrains): harden worktree run lifecycle and share the state stream (kirillk, 2026-08-23)
- 9162a87b9 - fix(jetbrains): address worktree run review feedback (kirillk, 2026-08-23)
- 034251422 - Merge remote-tracking branch 'origin/main' into investigate-jetbrains-agent-manager-run-feature (kirillk, 2026-08-23)
- 11ba989ef - feat(jetbrains): build and rebuild actions in worktree run popup (kirillk, 2026-08-21)
- dd900b7fb - docs: add jetbrains split-mode root plan (kirillk, 2026-08-21)
- 715e07fed - fix(jetbrains): harden worktree run controls (kirillk, 2026-08-21)
- 0af7cd642 - fix(jetbrains): rebase nested run config paths onto worktree (kirillk, 2026-08-20)
- db412273e - feat(jetbrains): run configs from worktree editor (kirillk, 2026-08-20)

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
- `.changeset/jetbrains-session-context-menu.md` (+5, -0)
- `.changeset/jetbrains-split-mode-run-configs.md` (+5, -0)
- `.changeset/jetbrains-worktree-header-run-dropdown.md` (+5, -0)
- `.changeset/jetbrains-worktree-run-configs.md` (+5, -0)
- `packages/kilo-jetbrains/AGENTS.md` (+6, -0)
- `packages/kilo-jetbrains/backend/build.gradle.kts` (+7, -1)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendSessionManager.kt` (+45, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloCliDataParser.kt` (+2, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloRunRpcApiImpl.kt` (+81, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloRunRpcApiProvider.kt` (+15, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloSessionRpcApiImpl.kt` (+6, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/run/WorktreeRunAdapter.kt` (+190, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/run/WorktreeRunManager.kt` (+386, -0)
- `packages/kilo-jetbrains/backend/src/main/resources/kilo.jetbrains.backend.xml` (+1, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendSessionManagerTest.kt` (+110, -2)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/KiloCliDataParserTest.kt` (+32, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloRunRpcApiImplTest.kt` (+23, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/run/WorktreeRunAdapterTest.kt` (+115, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/run/WorktreeRunManagerTest.kt` (+538, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/MockCliServer.kt` (+10, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/KiloNotifications.kt` (+14, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/CompareToBaseAction.kt` (+30, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/SessionAutoApproveAction.kt` (+31, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/SessionPrActions.kt` (+119, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/GhStatusCoordinator.kt` (+23, -8)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/KiloRunService.kt` (+120, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeController.kt` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreePrHeaderView.kt` (+10, -6)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeRunControl.kt` (+142, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeRunPopup.kt` (+87, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeRunStatusService.kt` (+77, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeSessionEditorPanel.kt` (+19, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeStatusService.kt` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloSessionService.kt` (+16, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloWorkspaceService.kt` (+15, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/ProjectRoot.kt` (+43, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionActions.kt` (+47, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+84, -15)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionController.kt` (+34, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/PromptPanel.kt` (+31, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/kilo.jetbrains.frontend.xml` (+57, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+36, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ar.properties` (+14, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_bs.properties` (+14, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_da.properties` (+14, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_de.properties` (+14, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_es.properties` (+14, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_fr.properties` (+14, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ja.properties` (+14, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ko.properties` (+14, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_nl.properties` (+14, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_no.properties` (+14, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pl.properties` (+14, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pt_BR.properties` (+14, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ru.properties` (+14, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_th.properties` (+14, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_tr.properties` (+14, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_uk.properties` (+14, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_CN.properties` (+14, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_TW.properties` (+14, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/SessionContextMenuActionsTest.kt` (+418, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/AgentManagerPanelTest.kt` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/WorktreeControllerTest.kt` (+39, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/GhBannerTest.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/GhStatusCoordinatorTest.kt` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/KiloRunServiceTest.kt` (+67, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreePrHeaderViewTest.kt` (+14, -5)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeRunControlTest.kt` (+101, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeRunPopupTest.kt` (+154, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeStatusServiceTest.kt` (+3, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/app/ProjectRootTest.kt` (+57, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionShareTest.kt` (+130, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/PromptPanelTest.kt` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeProjectRoot.kt` (+27, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeRunRpcApi.kt` (+84, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeSessionRpcApi.kt` (+23, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeWorkspaceRpcApi.kt` (+3, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloRunRpcApi.kt` (+60, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloSessionRpcApi.kt` (+11, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/RunConfigDto.kt` (+40, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/SessionDto.kt` (+7, -0)

### Key Diffs

(no key diffs to show)

## opencode Changes (df35e84..dc4449d)

### Commits

- dc4449d - chore: update nix node_modules hashes (opencode-agent[bot], 2026-08-29)
- 62a2f0e - feat(console): animate Go usage allowances and bonuses (#46055) (Kit Langton, 2026-08-29)

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
- `bun.lock` (+5, -0)
- `nix/hashes.json` (+4, -4)
- `packages/console/app/package.json` (+1, -0)
- `packages/console/app/src/component/limits-graph.tsx` (+267, -0)
- `packages/console/app/src/component/rolling-number.tsx` (+58, -0)
- `packages/console/app/src/i18n/en.ts` (+1, -1)
- `packages/console/app/src/routes/go/index.css` (+194, -16)
- `packages/console/app/src/routes/go/index.tsx` (+2, -198)

### Key Diffs

(no key diffs to show)

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- No specific recommendations - review changes manually
