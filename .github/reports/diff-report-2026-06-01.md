# Upstream Changes Report
Generated: 2026-06-01 11:36:28

## Summary
- kilocode: 17 commits, 28 files changed
- opencode: 45 commits, 526 files changed

## kilocode Changes (ad908e283..1eeab10b2)

### Commits

- 1eeab10b2 - Merge pull request #10786 from Kilo-Org/foul-oval (Marius, 2026-06-01)
- 33249d7ef - Merge pull request #10783 from Kilo-Org/gray-jet (Marius, 2026-06-01)
- d1c2fa399 - Merge pull request #10782 from Kilo-Org/dune-earwig (Marius, 2026-06-01)
- 7dd8aabad - fix(cli): skip background port scans in VS Code (marius-kilocode, 2026-06-01)
- e4b808e26 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-06-01)
- d3f8a653a - test(vscode): update connection service stubs (marius-kilocode, 2026-06-01)
- 50c45dfd1 - Merge pull request #10777 from Kilo-Org/sync-ai-sdk-openai-version (Christiaan Arnoldus, 2026-06-01)
- 7b4af411a - Merge pull request #10735 from Kilo-Org/cli/opus-4-8-adaptive-thinking (Christiaan Arnoldus, 2026-06-01)
- 695d1d0dd - refactor(vscode): clarify diff row cache names (marius-kilocode, 2026-06-01)
- c44cd7866 - fix(vscode): surface backend crash recovery (marius-kilocode, 2026-06-01)
- 1c06a1dbc - fix(vscode): preserve diff scroll during agent edits (marius-kilocode, 2026-06-01)
- 6e62d4010 - chore: sync @ai-sdk/openai version across packages (kiloconnect[bot], 2026-06-01)
- 188d22afc - fix(cli): match old opus-4.7 id-form checks for 4.8 (dot-only where 4.7 was) (kiloconnect[bot], 2026-05-31)
- 8b530ac76 - docs(cli): clarify opus 4.8 changeset as bedrock reasoning fix (kiloconnect[bot], 2026-05-29)
- 56b40c9a6 - chore: add temporary PR description file (kiloconnect[bot], 2026-05-29)
- a55c854f4 - fix(cli): annotate opus 4.8 changes and use array-form id checks (kiloconnect[bot], 2026-05-29)
- 593903fb5 - feat(cli): treat opus 4.8 as adaptive thinking model like 4.7 (kiloconnect[bot], 2026-05-29)

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
- `.changeset/calm-background-process-scans.md` (+6, -0)
- `.changeset/calm-kilos-reconnect.md` (+5, -0)
- `.changeset/opus-4-8-adaptive-thinking.md` (+5, -0)
- `.changeset/steady-review-scroll.md` (+5, -0)
- `bun.lock` (+1, -7)
- `nix/hashes.json` (+4, -4)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+14, -4)
- `packages/kilo-vscode/src/services/cli-backend/connection-service.ts` (+59, -19)
- `packages/kilo-vscode/src/services/cli-backend/server-manager.ts` (+6, -1)
- `packages/kilo-vscode/tests/diff-scroll-preservation.spec.ts` (+102, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-followup.test.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-load-messages.test.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-session-refresh.test.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/prompt-input-connection-guard.test.ts` (+20, -0)
- `packages/kilo-vscode/tests/unit/sdk-sse-adapter.test.ts` (+32, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.mts` (+1, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/DiffPanel.tsx` (+3, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/FullScreenDiffView.tsx` (+3, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/diff-state.ts` (+40, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/stories/agent-manager.stories.tsx` (+88, -1)
- `packages/opencode/src/kilocode/background-process/index.ts` (+4, -1)
- `packages/opencode/src/plugin/github-copilot/models.ts` (+5, -1)
- `packages/opencode/src/provider/transform.ts` (+12, -4)
- `packages/opencode/test/kilocode/background-process.test.ts` (+121, -0)
- `packages/opencode/test/kilocode/transform-opus-4.7.test.ts` (+45, -1)

### Key Diffs

(no key diffs to show)

## opencode Changes (04c4611..d85f8cd)

### Commits

- d85f8cd - fix(core): contain lsp warmup defects (#30226) (Shoubhit Dash, 2026-06-01)
- 68676f2 - chore: generate (opencode-agent[bot], 2026-06-01)
- 2d2f587 - fix(opencode): avoid nullable webfetch format schema (#30215) (Shoubhit Dash, 2026-06-01)
- bba7600 - fix(tui): prevent prompt corruption when pasting near wide characters (#29710) (Orca丶, 2026-06-01)
- 50b4ad8 - fix(acp): honor session/cancel by aborting the running turn (#30145) (smagnuso, 2026-06-01)
- fd2278e - chore: generate (opencode-agent[bot], 2026-06-01)
- 7ccb788 - opencode(run): add queued prompt management (#30103) (Simon Klee, 2026-06-01)
- f9ba23a - refactor(session): align namespace imports and inline trivial helpers (#30180) (Aiden Cline, 2026-06-01)
- b258a55 - fix(core): preserve session metadata migration identity (#30176) (Aiden Cline, 2026-06-01)
- 2725eed - fix(app): show project sessions before path sync resolves (#30167) (Michael Hart, 2026-06-01)
- a9c115c - refactor(opencode): simplify provider setup flow (#30173) (Aiden Cline, 2026-05-31)
- 917a36a - refactor(opencode): inline local provider helpers (#30169) (Aiden Cline, 2026-05-31)
- c573798 - go: minimax m3 (Frank, 2026-05-31)
- abaabdc - fix(tui): remount session view on session switch (#30129) (opencode-agent[bot], 2026-05-31)
- 8f2afba - zen: deepseek flash (Frank, 2026-05-31)
- 31f94f2 - refactor(worktree): move project out of repository (Dax Raad, 2026-05-31)
- 542b082 - chore: generate (opencode-agent[bot], 2026-05-31)
- 2f2fcc1 - fix(opencode): remove automatic full session diffs (#30127) (Dax, 2026-05-31)
- a69b70d - fix(core): allow skipping migration execution (Dax Raad, 2026-05-31)
- 02edad8 - test(tui): skip crashing keymap textarea renderer (Dax Raad, 2026-05-31)
- 5661af2 - feat(worktree): add managed workspace cloning (#30117) (Dax, 2026-05-31)
- 331bed2 - fix(core): stabilize migration registry generation (#30105) (Shoubhit Dash, 2026-05-31)
- f401f01 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-31)
- 6f07f10 - chore: generate (opencode-agent[bot], 2026-05-31)
- e8dd8f7 - tui(run): use keymap instead of raw key events (#30077) (Simon Klee, 2026-05-31)
- a291967 - chore: generate (opencode-agent[bot], 2026-05-31)
- a893ca8 - sync (Dax Raad, 2026-05-31)
- 25edeaf - fix(sdk): preserve generated event contracts (Dax Raad, 2026-05-31)
- 1afa9e3 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-31)
- 102c835 - chore: generate (opencode-agent[bot], 2026-05-31)
- 7f571d3 - refactor(core): move database schema ownership (#29068) (Dax, 2026-05-30)
- 6bcb9cb - chore: generate (opencode-agent[bot], 2026-05-31)
- 0269d6f - fix(core): isolate location layer instances (Dax Raad, 2026-05-30)
- aa86a20 - fix(core): provide agent service in location layer (Dax Raad, 2026-05-30)
- 74ce1a1 - sync release versions for v1.15.13 (opencode, 2026-05-30)
- 9c7788b - chore: generate (opencode-agent[bot], 2026-05-30)
- f4f508e - fix(opencode): support sap-ai-core anthropic opus 4.7+ adaptive reasoning (#29991) (Jérôme Benoit, 2026-05-30)
- 30f9780 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-30)
- 3070b0f - fix(opencode): default display summarized for gateway opus 4.7+ adaptive reasoning (#30027) (Aiden Cline, 2026-05-30)
- 52e288e - chore: generate (opencode-agent[bot], 2026-05-30)
- 9b915e7 - v2: default agents (Dax Raad, 2026-05-30)
- ddc30cd - feat(core): add session metadata support (#23068) (Shantur Rathore, 2026-05-30)
- ac8e686 - zen: batch balance calculation (Frank, 2026-05-30)
- 69b2784 - chore: generate (opencode-agent[bot], 2026-05-30)
- 6a2cd81 - core: credit referral invites on first Lite checkout (vimtor, 2026-05-30)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/apply_patch.ts` (+4, -4)
- `packages/opencode/src/tool/edit.ts` (+6, -6)
- `packages/opencode/src/tool/plan.ts` (+3, -2)
- `packages/opencode/src/tool/read.ts` (+2, -1)
- `packages/opencode/src/tool/registry.ts` (+15, -8)
- `packages/opencode/src/tool/task.ts` (+8, -2)
- `packages/opencode/src/tool/tool.ts` (+3, -2)
- `packages/opencode/src/tool/webfetch.ts` (+1, -1)
- `packages/opencode/src/tool/write.ts` (+4, -4)
- `packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap` (+7, -14)
- `packages/opencode/test/tool/apply_patch.test.ts` (+2, -2)
- `packages/opencode/test/tool/edit.test.ts` (+8, -5)
- `packages/opencode/test/tool/external-directory.test.ts` (+21, -24)
- `packages/opencode/test/tool/grep.test.ts` (+3, -2)
- `packages/opencode/test/tool/lsp.test.ts` (+78, -78)
- `packages/opencode/test/tool/parameters.test.ts` (+16, -2)
- `packages/opencode/test/tool/question.test.ts` (+8, -5)
- `packages/opencode/test/tool/read.test.ts` (+9, -3)
- `packages/opencode/test/tool/registry.test.ts` (+10, -8)
- `packages/opencode/test/tool/repo_clone.test.ts` (+141, -152)
- `packages/opencode/test/tool/repo_overview.test.ts` (+99, -108)
- `packages/opencode/test/tool/shell.test.ts` (+4, -1)
- `packages/opencode/test/tool/skill.test.ts` (+85, -87)
- `packages/opencode/test/tool/task.test.ts` (+11, -7)
- `packages/opencode/test/tool/websearch.test.ts` (+6, -5)
- `packages/opencode/test/tool/write.test.ts` (+2, -2)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+6, -5)
- `packages/opencode/test/agent/plugin-agent-regression.test.ts` (+2, -2)

#### Permission System (**/permission/)
- `packages/opencode/src/permission/index.ts` (+25, -21)
- `packages/opencode/test/permission/next.test.ts` (+20, -12)

#### Event Bus (**/bus/, **/event/)
- `packages/{opencode/src/sync/event.sql.ts => core/src/event/sql.ts}` (+2, -1)
- `packages/opencode/src/bus/bus-event.ts` (+0, -45)
- `packages/opencode/src/bus/index.ts` (+0, -217)
- `packages/opencode/test/bus/bus-effect.test.ts` (+0, -288)
- `packages/opencode/test/bus/bus-integration.test.ts` (+0, -88)
- `packages/opencode/test/bus/bus.test.ts` (+0, -240)

#### Core (**/core/)
- `packages/console/core/package.json` (+1, -1)
- `packages/console/core/src/referral.ts` (+7, -0)
- `packages/core/migration/20260511173437_session-metadata/migration.sql` (+1, -0)
- `packages/core/migration/20260511173437_session-metadata/snapshot.json` (+1560, -0)
- `packages/core/package.json` (+16, -3)
- `packages/core/script/migration.ts` (+122, -0)
- `packages/core/src/account.ts` (+75, -293)
- `packages/core/src/agent.ts` (+1, -1)
- `packages/core/src/aisdk.ts` (+2, -1)
- `packages/core/src/auth.ts` (+340, -0)
- `packages/core/src/catalog.ts` (+19, -4)
- `packages/core/src/config.ts` (+1, -1)
- `packages/core/src/database/database.ts` (+60, -0)
- `packages/core/src/database/migration.gen.ts` (+27, -0)
- `packages/core/src/database/migration.ts` (+58, -0)
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
- `packages/core/src/database/sqlite.bun.ts` (+182, -0)
- `packages/core/src/database/sqlite.node.ts` (+177, -0)
- `packages/core/src/database/sqlite.ts` (+8, -0)
- `packages/core/src/event.ts` (+255, -18)
- `packages/core/src/id/id.ts` (+80, -0)
- `packages/core/src/location-layer.ts` (+30, -8)
- `packages/core/src/location.ts` (+0, -2)
- `packages/core/src/model.ts` (+3, -3)
- `packages/core/src/permission.ts` (+14, -3)
- `packages/core/src/plugin.ts` (+12, -5)
- `packages/core/src/plugin/account.ts` (+8, -4)
- `packages/core/src/plugin/agent.ts` (+53, -62)
- `packages/core/src/plugin/boot.ts` (+12, -12)
- `packages/core/src/plugin/models-dev.ts` (+2, -2)
- `packages/core/src/plugin/provider.ts` (+67, -1)
- `packages/core/src/plugin/provider/index.ts` (+0, -67)
- `packages/core/src/policy.ts` (+3, -1)
- `packages/core/src/project.ts` (+1, -0)
- `packages/core/src/provider.ts` (+6, -3)
- `packages/core/src/schema.ts` (+12, -6)
- `packages/core/src/session-message-updater.ts` (+0, -417)
- `packages/core/src/session.ts` (+334, -10)
- `packages/core/src/{session-event.ts => session/event.ts}` (+13, -12)
- `packages/core/src/session/legacy.ts` (+625, -0)
- `packages/core/src/session/message-updater.ts` (+474, -0)
- `packages/core/src/{session-message.ts => session/message.ts}` (+8, -8)
- `packages/core/src/session/projector.ts` (+456, -0)
- `packages/core/src/{session-prompt.ts => session/prompt.ts}` (+0, -0)
- `packages/core/src/session/schema.ts` (+59, -0)
- `packages/core/src/snapshot.ts` (+9, -0)
- `packages/core/src/state.ts` (+12, -11)
- `packages/core/src/workspace.ts` (+18, -0)
- `packages/core/test/account.test.ts` (+37, -37)
- `packages/core/test/agent.test.ts` (+1, -1)
- `packages/core/test/catalog.test.ts` (+27, -6)
- `packages/core/test/config/agent.test.ts` (+1, -1)
- `packages/core/test/config/config.test.ts` (+1, -2)
- `packages/core/test/database-migration.test.ts` (+151, -0)
- `packages/core/test/event.test.ts` (+456, -14)
- `packages/core/test/location-layer.test.ts` (+72, -0)
- `packages/core/test/plugin/provider-azure.test.ts` (+7, -10)
- `packages/core/test/plugin/provider-cloudflare-workers-ai.test.ts` (+7, -10)
- `packages/core/test/plugin/provider-deepinfra.test.ts` (+4, -1)
- `packages/core/test/plugin/provider-dynamic.test.ts` (+4, -1)
- `packages/core/test/plugin/provider-gitlab.test.ts` (+17, -19)
- `packages/core/test/plugin/provider-google.test.ts` (+4, -1)
- `packages/core/test/plugin/provider-groq.test.ts` (+4, -1)
- `packages/core/test/plugin/provider-helper.ts` (+1, -4)
- `packages/core/test/plugin/provider-opencode.test.ts` (+2, -2)
- `packages/core/test/plugin/provider-xai.test.ts` (+3, -2)
- `packages/core/test/policy.test.ts` (+1, -1)
- `packages/core/test/project.test.ts` (+20, -20)
- `packages/stats/core/package.json` (+1, -1)

#### Other Changes
- `.opencode/opencode.jsonc` (+3, -0)
- `AGENTS.md` (+6, -0)
- `bun.lock` (+58, -39)
- `nix/hashes.json` (+4, -4)
- `package.json` (+3, -3)
- `packages/app/e2e/regression/session-list-path-loading.spec.ts` (+40, -0)
- `packages/app/package.json` (+1, -1)
- `packages/app/src/context/global-sync/child-store.test.ts` (+30, -1)
- `packages/app/src/context/global-sync/child-store.ts` (+2, -3)
- `packages/cli/package.json` (+3, -1)
- `packages/cli/src/debug/agents.ts` (+31, -0)
- `packages/cli/src/debug/index.ts` (+7, -0)
- `packages/cli/src/index.ts` (+7, -1)
- `packages/cli/sst-env.d.ts` (+10, -0)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/component/go-referral.tsx` (+2, -14)
- `packages/console/app/src/i18n/ar.ts` (+4, -4)
- `packages/console/app/src/i18n/br.ts` (+4, -4)
- `packages/console/app/src/i18n/da.ts` (+4, -4)
- `packages/console/app/src/i18n/de.ts` (+4, -4)
- `packages/console/app/src/i18n/en.ts` (+4, -4)
- `packages/console/app/src/i18n/es.ts` (+4, -4)
- `packages/console/app/src/i18n/fr.ts` (+4, -4)
- `packages/console/app/src/i18n/it.ts` (+4, -4)
- `packages/console/app/src/i18n/ja.ts` (+4, -4)
- `packages/console/app/src/i18n/ko.ts` (+4, -4)
- `packages/console/app/src/i18n/no.ts` (+4, -4)
- `packages/console/app/src/i18n/pl.ts` (+4, -4)
- `packages/console/app/src/i18n/ru.ts` (+4, -4)
- `packages/console/app/src/i18n/th.ts` (+4, -4)
- `packages/console/app/src/i18n/tr.ts` (+4, -4)
- `packages/console/app/src/i18n/uk.ts` (+4, -4)
- `packages/console/app/src/i18n/zh.ts` (+4, -4)
- `packages/console/app/src/i18n/zht.ts` (+4, -4)
- `packages/console/app/src/lib/referral-invite.ts` (+16, -0)
- `packages/console/app/src/routes/go/index.tsx` (+7, -5)
- `packages/console/app/src/routes/workspace/[id]/go/lite-section.tsx` (+10, -10)
- `packages/console/app/src/routes/zen/util/handler.ts` (+26, -8)
- `packages/console/app/src/routes/zen/util/usageBatcher.ts` (+31, -0)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/mail/package.json` (+1, -1)
- `packages/console/support/package.json` (+1, -1)
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
- `packages/{opencode/src/account/account.sql.ts => core/src/account/sql.ts}` (+9, -9)
- `packages/{opencode => core}/src/control-plane/workspace.sql.ts` (+5, -5)
- `packages/{opencode => core}/src/data-migration.sql.ts` (+0, -0)
- `packages/{opencode/src/storage => core/src/database}/schema.sql.ts` (+0, -0)
- `packages/{opencode/src/project/project.sql.ts => core/src/project/sql.ts}` (+3, -3)
- `packages/{opencode/src/session/session.sql.ts => core/src/session/sql.ts}` (+23, -22)
- `packages/{opencode/src/share/share.sql.ts => core/src/share/sql.ts}` (+2, -2)
- `packages/desktop/package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+22, -0)
- `packages/effect-sqlite-node/src/index.ts` (+168, -0)
- `packages/effect-sqlite-node/sst-env.d.ts` (+10, -0)
- `packages/effect-sqlite-node/tsconfig.json` (+15, -0)
- `packages/enterprise/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/function/package.json` (+1, -1)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/llm/src/protocols/openai-responses.ts` (+5, -2)
- `packages/opencode/AGENTS.md` (+2, -6)
- `packages/opencode/migration/20260511173437_session-metadata/migration.sql` (+1, -0)
- `packages/opencode/migration/20260511173437_session-metadata/snapshot.json` (+1500, -0)
- `packages/opencode/package.json` (+2, -4)
- `packages/opencode/script/build-node.ts` (+0, -32)
- `packages/opencode/script/build.ts` (+0, -31)
- `packages/opencode/script/check-migrations.ts` (+0, -16)
- `packages/opencode/src/account/account.ts` (+1, -1)
- `packages/opencode/src/account/repo.ts` (+61, -60)
- `packages/opencode/src/acp/content.ts` (+3, -3)
- `packages/opencode/src/acp/directory.ts` (+7, -7)
- `packages/opencode/src/acp/service.ts` (+30, -23)
- `packages/opencode/src/acp/session.ts` (+3, -3)
- `packages/opencode/src/acp/usage.ts` (+13, -13)
- `packages/opencode/src/cli/cmd/db.ts` (+26, -84)
- `packages/opencode/src/cli/cmd/debug/agent.ts` (+2, -1)
- `packages/opencode/src/cli/cmd/debug/scrap.ts` (+4, -1)
- `packages/opencode/src/cli/cmd/export.ts` (+5, -4)
- `packages/opencode/src/cli/cmd/github.ts` (+12, -7)
- `packages/opencode/src/cli/cmd/import.ts` (+38, -39)
- `packages/opencode/src/cli/cmd/mcp.ts` (+10, -5)
- `packages/opencode/src/cli/cmd/models.ts` (+5, -4)
- `packages/opencode/src/cli/cmd/prompt-display.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/run/footer.command.tsx` (+125, -4)
- `packages/opencode/src/cli/cmd/run/footer.permission.tsx` (+3, -6)
- `packages/opencode/src/cli/cmd/run/footer.prompt.tsx` (+212, -229)
- `packages/opencode/src/cli/cmd/run/footer.question.tsx` (+1, -4)
- `packages/opencode/src/cli/cmd/run/footer.ts` (+91, -45)
- `packages/opencode/src/cli/cmd/run/footer.view.tsx` (+165, -41)
- `packages/opencode/src/cli/cmd/run/keymap.shared.ts` (+0, -154)
- `packages/opencode/src/cli/cmd/run/prompt.shared.ts` (+3, -184)
- `packages/opencode/src/cli/cmd/run/runtime.boot.ts` (+27, -39)
- `packages/opencode/src/cli/cmd/run/runtime.lifecycle.ts` (+12, -6)
- `packages/opencode/src/cli/cmd/run/runtime.queue.ts` (+65, -26)
- `packages/opencode/src/cli/cmd/run/runtime.ts` (+5, -12)
- `packages/opencode/src/cli/cmd/run/stream.transport.ts` (+2, -2)
- `packages/opencode/src/cli/cmd/run/types.ts` (+16, -16)
- `packages/opencode/src/cli/cmd/stats.ts` (+7, -6)
- `packages/opencode/src/cli/cmd/tui/app.tsx` (+3, -1)
- `packages/opencode/src/cli/cmd/tui/component/prompt/index.tsx` (+14, -21)
- `packages/opencode/src/cli/cmd/tui/component/prompt/part.ts` (+8, -0)
- `packages/opencode/src/cli/cmd/tui/config/keybind.ts` (+2, -0)
- `packages/opencode/src/cli/cmd/tui/event.ts` (+17, -17)
- `packages/opencode/src/cli/cmd/tui/keymap.tsx` (+24, -14)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+3, -1)
- `packages/opencode/src/cli/cmd/tui/ui/toast.tsx` (+3, -3)
- `packages/opencode/src/command/index.ts` (+6, -6)
- `packages/opencode/src/control-plane/adapters/index.ts` (+7, -7)
- `packages/opencode/src/control-plane/schema.ts` (+0, -14)
- `packages/opencode/src/control-plane/types.ts` (+5, -5)
- `packages/opencode/src/control-plane/workspace-context.ts` (+4, -4)
- `packages/opencode/src/control-plane/workspace.ts` (+181, -183)
- `packages/opencode/src/data-migration.ts` (+0, -161)
- `packages/opencode/src/effect/app-runtime.ts` (+4, -8)
- `packages/opencode/src/effect/bootstrap-runtime.ts` (+0, -2)
- `packages/opencode/src/effect/bridge.ts` (+2, -2)
- `packages/opencode/src/effect/instance-ref.ts` (+2, -2)
- `packages/opencode/src/effect/runtime-flags.ts` (+0, -2)
- `packages/opencode/src/event-v2-bridge.ts` (+31, -67)
- `packages/opencode/src/file/index.ts` (+6, -6)
- `packages/opencode/src/file/watcher.ts` (+16, -11)
- `packages/opencode/src/ide/index.ts` (+6, -6)
- `packages/opencode/src/image/image.ts` (+3, -2)
- `packages/opencode/src/index.ts` (+5, -4)
- `packages/opencode/src/installation/index.ts` (+11, -11)
- `packages/opencode/src/lsp/client.ts` (+8, -29)
- `packages/opencode/src/lsp/lsp.ts` (+17, -7)
- `packages/opencode/src/mcp/index.ts` (+18, -18)
- `packages/opencode/src/node.ts` (+1, -1)
- `packages/opencode/src/plugin/index.ts` (+16, -18)
- `packages/opencode/src/project/bootstrap.ts` (+0, -2)
- `packages/opencode/src/project/instance-store.ts` (+11, -0)
- `packages/opencode/src/project/project.ts` (+170, -175)
- `packages/opencode/src/project/schema.ts` (+0, -13)
- `packages/opencode/src/project/vcs.ts` (+25, -24)
- `packages/opencode/src/provider/auth.ts` (+13, -11)
- `packages/opencode/src/provider/error.ts` (+3, -3)
- `packages/opencode/src/provider/provider.ts` (+91, -109)
- `packages/opencode/src/provider/schema.ts` (+0, -30)
- `packages/opencode/src/provider/transform.ts` (+15, -4)
- `packages/opencode/src/pty/index.ts` (+12, -12)
- `packages/opencode/src/pty/ticket.ts` (+2, -2)
- `packages/opencode/src/question/index.ts` (+12, -12)
- `packages/opencode/src/server/event.ts` (+9, -3)
- `packages/opencode/src/server/projectors.ts` (+1, -26)
- `packages/opencode/src/server/routes/instance/httpapi/api.ts` (+19, -7)
- `packages/opencode/src/server/routes/instance/httpapi/groups/control.ts` (+3, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/experimental.ts` (+4, -3)
- `packages/opencode/src/server/routes/instance/httpapi/groups/global.ts` (+30, -3)
- `packages/opencode/src/server/routes/instance/httpapi/groups/project.ts` (+2, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/provider.ts` (+5, -4)
- `packages/opencode/src/server/routes/instance/httpapi/groups/session.ts` (+15, -12)
- `packages/opencode/src/server/routes/instance/httpapi/groups/tui.ts` (+7, -7)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/message.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/session.ts` (+3, -3)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/control.ts` (+6, -3)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/event.ts` (+50, -14)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/experimental.ts` (+12, -13)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/global.ts` (+3, -3)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/project.ts` (+2, -2)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/provider.ts` (+5, -4)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/session.ts` (+13, -6)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/sync.ts` (+29, -32)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/tui.ts` (+15, -14)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2/message.ts` (+2, -2)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2/session.ts` (+16, -11)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/fence.ts` (+13, -8)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/workspace-routing.ts` (+14, -14)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+3, -5)
- `packages/opencode/src/server/shared/fence.ts` (+12, -12)
- `packages/opencode/src/session/compaction.ts` (+35, -34)
- `packages/opencode/src/session/instruction.ts` (+10, -11)
- `packages/opencode/src/session/llm.ts` (+19, -9)
- `packages/opencode/src/session/llm/request.ts` (+2, -1)
- `packages/opencode/src/session/message-v2.ts` (+103, -585)
- `packages/opencode/src/session/message.ts` (+4, -3)
- `packages/opencode/src/session/overflow.ts` (+2, -1)
- `packages/opencode/src/session/processor.ts` (+31, -30)
- `packages/opencode/src/session/projectors-next.ts` (+0, -204)
- `packages/opencode/src/session/projectors.ts` (+0, -199)
- `packages/opencode/src/session/prompt.ts` (+96, -94)
- `packages/opencode/src/session/prompt/reference.ts` (+2, -1)
- `packages/opencode/src/session/reminders.ts` (+3, -2)
- `packages/opencode/src/session/retry.ts` (+5, -4)
- `packages/opencode/src/session/revert.ts` (+12, -21)
- `packages/opencode/src/session/run-state.ts` (+15, -14)
- `packages/opencode/src/session/schema.ts` (+2, -2)
- `packages/opencode/src/session/session.ts` (+312, -170)
- `packages/opencode/src/session/status.ts` (+16, -16)
- `packages/opencode/src/session/summary.ts` (+26, -26)
- `packages/opencode/src/session/todo.ts` (+40, -34)
- `packages/opencode/src/session/tools.ts` (+8, -6)
- `packages/opencode/src/share/session.ts` (+2, -5)
- `packages/opencode/src/share/share-next.ts` (+48, -53)
- `packages/opencode/src/skill/index.ts` (+12, -8)
- `packages/opencode/src/storage/db.bun.ts` (+0, -8)
- `packages/opencode/src/storage/db.node.ts` (+0, -8)
- `packages/opencode/src/storage/db.ts` (+0, -200)
- `packages/opencode/src/storage/json-migration.ts` (+3, -3)
- `packages/opencode/src/storage/schema.ts` (+5, -5)
- `packages/opencode/src/sync/index.ts` (+0, -411)
- `packages/opencode/src/v2/provider-parity-checklist.md` (+0, -95)
- `packages/opencode/src/v2/session.ts` (+0, -372)
- `packages/opencode/src/worktree/index.ts` (+48, -23)
- `packages/opencode/test/account/repo.test.ts` (+8, -7)
- `packages/opencode/test/account/service.test.ts` (+8, -7)
- `packages/opencode/test/acp/directory.test.ts` (+8, -8)
- `packages/opencode/test/acp/service-session.test.ts` (+36, -38)
- `packages/opencode/test/acp/session.test.ts` (+3, -3)
- `packages/opencode/test/acp/usage.test.ts` (+10, -10)
- `packages/opencode/test/auth/auth.test.ts` (+58, -67)
- `packages/opencode/test/cli/cmd/tui/prompt-part.test.ts` (+31, -1)
- `packages/opencode/test/cli/github-action.test.ts` (+10, -5)
- `packages/opencode/test/cli/help/__snapshots__/help-snapshots.test.ts.snap` (+0, -1)
- `packages/opencode/test/cli/run/footer.view.test.tsx` (+400, -29)
- `packages/opencode/test/cli/run/prompt.shared.test.ts` (+0, -55)
- `packages/opencode/test/cli/run/runtime.boot.test.ts` (+33, -25)
- `packages/opencode/test/cli/run/runtime.queue.test.ts` (+86, -0)
- `packages/opencode/test/cli/run/stream.test.ts` (+1, -0)
- `packages/opencode/test/cli/run/stream.transport.test.ts` (+1, -0)
- `packages/opencode/test/config/config.test.ts` (+14, -11)
- `packages/opencode/test/control-plane/adapters.test.ts` (+4, -4)
- `packages/opencode/test/control-plane/workspace.test.ts` (+178, -154)
- `packages/opencode/test/effect/run-service.test.ts` (+2, -2)
- `packages/opencode/test/effect/runtime-flags.test.ts` (+0, -25)
- `packages/opencode/test/fake/provider.ts` (+3, -3)
- `packages/opencode/test/file/watcher.test.ts` (+2, -0)
- `packages/opencode/test/fixture/db.ts` (+2, -3)
- `packages/opencode/test/fixture/fixture.ts` (+19, -35)
- `packages/opencode/test/fixture/flag.ts` (+2, -2)
- `packages/opencode/test/fixture/workspace.ts` (+4, -2)
- `packages/opencode/test/format/format.test.ts` (+173, -217)
- `packages/opencode/test/lib/effect.ts` (+25, -18)
- `packages/opencode/test/lsp/index.test.ts` (+178, -176)
- `packages/opencode/test/lsp/lifecycle.test.ts` (+79, -103)
- `packages/opencode/test/mcp/oauth-auto-connect.test.ts` (+2, -2)
- `packages/opencode/test/mcp/oauth-browser.test.ts` (+8, -6)
- `packages/opencode/test/plugin/auth-override.test.ts` (+6, -5)
- `packages/opencode/test/plugin/loader-shared.test.ts` (+6, -4)
- `packages/opencode/test/plugin/trigger.test.ts` (+31, -31)
- `packages/opencode/test/plugin/workspace-adapter.test.ts` (+73, -73)
- `packages/opencode/test/preload.ts` (+5, -2)
- `packages/opencode/test/project/migrate-global.test.ts` (+39, -29)
- `packages/opencode/test/project/project.test.ts` (+240, -221)
- `packages/opencode/test/project/vcs.test.ts` (+19, -10)
- `packages/opencode/test/project/worktree-remove.test.ts` (+108, -108)
- `packages/opencode/test/project/worktree.test.ts` (+0, -7)
- `packages/opencode/test/provider/amazon-bedrock.test.ts` (+24, -21)
- `packages/opencode/test/provider/cf-ai-gateway-e2e.test.ts` (+3, -3)
- `packages/opencode/test/provider/digitalocean.test.ts` (+3, -2)
- `packages/opencode/test/provider/gitlab-duo.test.ts` (+1, -1)
- `packages/opencode/test/provider/header-timeout.test.ts` (+7, -7)
- `packages/opencode/test/provider/provider.test.ts` (+139, -122)
- `packages/opencode/test/provider/transform.test.ts` (+111, -124)
- `packages/opencode/test/pty/pty-output-isolation.test.ts` (+2, -2)
- `packages/opencode/test/pty/pty-session.test.ts` (+13, -21)
- `packages/opencode/test/pty/ticket.test.ts` (+5, -3)
- `packages/opencode/test/question/question.test.ts` (+22, -12)
- `packages/opencode/test/server/global-session-list.test.ts` (+11, -7)
- `packages/opencode/test/server/httpapi-event-diagnostics.test.ts` (+0, -279)
- `packages/opencode/test/server/httpapi-event.test.ts` (+22, -26)
- `packages/opencode/test/server/httpapi-exercise/backend.ts` (+1, -1)
- `packages/opencode/test/server/httpapi-exercise/runner.ts` (+13, -9)
- `packages/opencode/test/server/httpapi-exercise/runtime.ts` (+3, -0)
- `packages/opencode/test/server/httpapi-exercise/types.ts` (+3, -2)
- `packages/opencode/test/server/httpapi-experimental.test.ts` (+45, -38)
- `packages/opencode/test/server/httpapi-global.test.ts` (+3, -3)
- `packages/opencode/test/server/httpapi-instance-context.test.ts` (+5, -5)
- `packages/opencode/test/server/httpapi-instance.test.ts` (+6, -6)
- `packages/opencode/test/server/httpapi-layer.ts` (+33, -0)
- `packages/opencode/test/server/httpapi-provider.test.ts` (+36, -63)
- `packages/opencode/test/server/httpapi-schema-error-body.test.ts` (+45, -51)
- `packages/opencode/test/server/httpapi-sdk.test.ts` (+67, -79)
- `packages/opencode/test/server/httpapi-session.test.ts` (+113, -89)
- `packages/opencode/test/server/httpapi-sync.test.ts` (+33, -51)
- `packages/opencode/test/server/httpapi-workspace-routing.test.ts` (+17, -9)
- `packages/opencode/test/server/httpapi-workspace.test.ts` (+61, -44)
- `packages/opencode/test/server/negative-tokens-regression.test.ts` (+23, -22)
- `packages/opencode/test/server/project-init-git.test.ts` (+8, -9)
- `packages/opencode/test/server/session-actions.test.ts` (+63, -12)
- `packages/opencode/test/server/session-diff-missing-patch.test.ts` (+43, -20)
- `packages/opencode/test/server/session-list.test.ts` (+44, -20)
- `packages/opencode/test/server/session-messages.test.ts` (+20, -17)
- `packages/opencode/test/server/session-select.test.ts` (+19, -43)
- `packages/opencode/test/server/worktree-endpoint-repro.test.ts` (+4, -8)
- `packages/opencode/test/session/compaction.test.ts` (+62, -31)
- `packages/opencode/test/session/instruction.test.ts` (+8, -6)
- `packages/opencode/test/session/llm-native-recorded.test.ts` (+15, -13)
- `packages/opencode/test/session/llm-native.test.ts` (+16, -15)
- `packages/opencode/test/session/llm.test.ts` (+49, -41)
- `packages/opencode/test/session/message-v2.test.ts` (+99, -95)
- `packages/opencode/test/session/messages-pagination.test.ts` (+52, -52)
- `packages/opencode/test/session/processor-effect.test.ts` (+66, -48)
- `packages/opencode/test/session/prompt.test.ts` (+59, -52)
- `packages/opencode/test/session/retry.test.ts` (+62, -64)
- `packages/opencode/test/session/revert-compact.test.ts` (+21, -19)
- `packages/opencode/test/session/schema-decoding.test.ts` (+6, -4)
- `packages/opencode/test/session/session-schema.test.ts` (+3, -3)
- `packages/opencode/test/session/session.test.ts` (+70, -33)
- `packages/opencode/test/session/snapshot-tool-race.test.ts` (+12, -8)
- `packages/opencode/test/session/structured-output-integration.test.ts` (+2, -1)
- `packages/opencode/test/session/structured-output.test.ts` (+9, -8)
- `packages/opencode/test/share/share-next.test.ts` (+40, -31)
- `packages/opencode/test/skill/skill.test.ts` (+7, -5)
- `packages/opencode/test/snapshot/snapshot.test.ts` (+8, -2)
- `packages/opencode/test/storage/db.test.ts` (+0, -38)
- `packages/opencode/test/storage/json-migration.test.ts` (+15, -15)
- `packages/opencode/test/storage/workspace-time-migration.test.ts` (+11, -4)
- `packages/opencode/test/sync/index.test.ts` (+0, -390)
- `packages/opencode/test/v2/session-message-updater.test.ts` (+186, -159)
- `packages/plugin/package.json` (+4, -4)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+13, -5)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+2106, -1447)
- `packages/sdk/openapi.json` (+5960, -4083)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/server/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/ar/go.mdx` (+23, -1)
- `packages/web/src/content/docs/ar/zen.mdx` (+4, -1)
- `packages/web/src/content/docs/bs/go.mdx` (+22, -0)
- `packages/web/src/content/docs/bs/zen.mdx` (+4, -1)
- `packages/web/src/content/docs/da/go.mdx` (+22, -0)
- `packages/web/src/content/docs/da/zen.mdx` (+4, -1)
- `packages/web/src/content/docs/de/go.mdx` (+22, -0)
- `packages/web/src/content/docs/de/zen.mdx` (+4, -1)
- `packages/web/src/content/docs/es/go.mdx` (+22, -0)
- `packages/web/src/content/docs/es/zen.mdx` (+4, -1)
- `packages/web/src/content/docs/fr/go.mdx` (+23, -1)
- `packages/web/src/content/docs/fr/zen.mdx` (+4, -1)
- `packages/web/src/content/docs/go.mdx` (+23, -1)
- `packages/web/src/content/docs/it/go.mdx` (+22, -0)
- `packages/web/src/content/docs/it/zen.mdx` (+4, -1)
- `packages/web/src/content/docs/ja/go.mdx` (+22, -0)
- `packages/web/src/content/docs/ja/zen.mdx` (+4, -1)
- `packages/web/src/content/docs/ko/go.mdx` (+23, -1)
- `packages/web/src/content/docs/ko/zen.mdx` (+4, -1)
- `packages/web/src/content/docs/nb/go.mdx` (+22, -0)
- `packages/web/src/content/docs/nb/zen.mdx` (+4, -1)
- `packages/web/src/content/docs/pl/go.mdx` (+23, -1)
- `packages/web/src/content/docs/pl/zen.mdx` (+4, -1)
- `packages/web/src/content/docs/pt-br/go.mdx` (+23, -1)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+4, -1)
- `packages/web/src/content/docs/ru/go.mdx` (+23, -1)
- `packages/web/src/content/docs/ru/zen.mdx` (+4, -1)
- `packages/web/src/content/docs/th/go.mdx` (+23, -1)
- `packages/web/src/content/docs/th/zen.mdx` (+4, -1)
- `packages/web/src/content/docs/tr/go.mdx` (+23, -1)
- `packages/web/src/content/docs/tr/zen.mdx` (+4, -1)
- `packages/web/src/content/docs/zen.mdx` (+4, -1)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+22, -0)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+4, -1)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+23, -1)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+4, -1)
- `sdks/vscode/package.json` (+1, -1)
- `specs/storage/remove-opencode-db.md` (+239, -0)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 4d5290f..e9645f8 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.15.12",
+  "version": "1.15.13",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/console/core/src/referral.ts
```diff
diff --git a/packages/console/core/src/referral.ts b/packages/console/core/src/referral.ts
index 96277ca..9f781df 100644
--- a/packages/console/core/src/referral.ts
+++ b/packages/console/core/src/referral.ts
@@ -325,6 +325,13 @@ export namespace Referral {
         .then((rows) => rows.map((row) => row.workspaceID))
       if (workspaceIDs.length === 0) return
 
+      const activeLite = await tx
+        .select({ id: LiteTable.id })
+        .from(LiteTable)
+        .where(and(inArray(LiteTable.workspaceID, workspaceIDs), isNull(LiteTable.timeDeleted)))
+        .then((rows) => rows[0])
+      if (activeLite) return
+
       const litePayment = await tx
         .select({ id: PaymentTable.id })
         .from(PaymentTable)
```

#### packages/core/migration/20260511173437_session-metadata/migration.sql
```diff
diff --git a/packages/core/migration/20260511173437_session-metadata/migration.sql b/packages/core/migration/20260511173437_session-metadata/migration.sql
new file mode 100644
index 0000000..1f8fcaf
--- /dev/null
+++ b/packages/core/migration/20260511173437_session-metadata/migration.sql
@@ -0,0 +1 @@
+ALTER TABLE `session` ADD `metadata` text;
```

#### packages/core/migration/20260511173437_session-metadata/snapshot.json
```diff
diff --git a/packages/core/migration/20260511173437_session-metadata/snapshot.json b/packages/core/migration/20260511173437_session-metadata/snapshot.json
new file mode 100644
index 0000000..8c97999
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

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index c5d599f..1c3f2a3 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,11 +1,13 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.15.12",
+  "version": "1.15.13",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
   "private": true,
   "scripts": {
+    "db": "bun drizzle-kit",
+    "migration": "bun run script/migration.ts",
     "test": "bun test",
     "test:ci": "mkdir -p .artifacts/unit && bun test --timeout 30000 --reporter=junit --reporter-outfile=.artifacts/unit/junit.xml",
     "typecheck": "tsgo --noEmit"
@@ -16,14 +18,21 @@
   "exports": {
     "./*": "./src/*.ts"
   },
-  "imports": {},
+  "imports": {
+    "#sqlite": {
+      "bun": "./src/database/sqlite.bun.ts",
+      "node": "./src/database/sqlite.node.ts",
+      "default": "./src/database/sqlite.bun.ts"
+    }
+  },
   "devDependencies": {
     "@tsconfig/bun": "catalog:",
     "@types/bun": "catalog:",
     "@types/cross-spawn": "catalog:",
     "@types/npm-package-arg": "6.1.4",
     "@types/npmcli__arborist": "6.3.3",
-    "@types/semver": "catalog:"
+    "@types/semver": "catalog:",
+    "drizzle-kit": "catalog:"
   },
   "dependencies": {
     "@ai-sdk/alibaba": "1.0.17",
@@ -49,8 +58,11 @@
     "@aws-sdk/credential-providers": "3.993.0",
     "@effect/opentelemetry": "catalog:",
     "@effect/platform-node": "catalog:",
+    "@effect/sql-sqlite-bun": "catalog:",
     "@npmcli/arborist": "9.4.0",
     "@npmcli/config": "10.8.1",
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/src/agent/agent.ts
- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/test/agent/plugin-agent-regression.test.ts
- `src/tool/apply_patch.test.ts` - update based on opencode packages/opencode/test/tool/apply_patch.test.ts changes
- `src/tool/apply_patch.ts` - update based on opencode packages/opencode/src/tool/apply_patch.ts changes
- `src/tool/edit.test.ts` - update based on opencode packages/opencode/test/tool/edit.test.ts changes
- `src/tool/edit.ts` - update based on opencode packages/opencode/src/tool/edit.ts changes
- `src/tool/external-directory.test.ts` - update based on opencode packages/opencode/test/tool/external-directory.test.ts changes
- `src/tool/grep.test.ts` - update based on opencode packages/opencode/test/tool/grep.test.ts changes
- `src/tool/lsp.test.ts` - update based on opencode packages/opencode/test/tool/lsp.test.ts changes
- `src/tool/parameters.test.ts.snap.ts` - update based on opencode packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap changes
- `src/tool/parameters.test.ts` - update based on opencode packages/opencode/test/tool/parameters.test.ts changes
- `src/tool/plan.ts` - update based on opencode packages/opencode/src/tool/plan.ts changes
- `src/tool/question.test.ts` - update based on opencode packages/opencode/test/tool/question.test.ts changes
- `src/tool/read.test.ts` - update based on opencode packages/opencode/test/tool/read.test.ts changes
- `src/tool/read.ts` - update based on opencode packages/opencode/src/tool/read.ts changes
- `src/tool/registry.test.ts` - update based on opencode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on opencode packages/opencode/src/tool/registry.ts changes
- `src/tool/repo_clone.test.ts` - update based on opencode packages/opencode/test/tool/repo_clone.test.ts changes
- `src/tool/repo_overview.test.ts` - update based on opencode packages/opencode/test/tool/repo_overview.test.ts changes
- `src/tool/shell.test.ts` - update based on opencode packages/opencode/test/tool/shell.test.ts changes
- `src/tool/skill.test.ts` - update based on opencode packages/opencode/test/tool/skill.test.ts changes
- `src/tool/task.test.ts` - update based on opencode packages/opencode/test/tool/task.test.ts changes
- `src/tool/task.ts` - update based on opencode packages/opencode/src/tool/task.ts changes
- `src/tool/tool.ts` - update based on opencode packages/opencode/src/tool/tool.ts changes
- `src/tool/webfetch.ts` - update based on opencode packages/opencode/src/tool/webfetch.ts changes
- `src/tool/websearch.test.ts` - update based on opencode packages/opencode/test/tool/websearch.test.ts changes
- `src/tool/write.test.ts` - update based on opencode packages/opencode/test/tool/write.test.ts changes
- `src/tool/write.ts` - update based on opencode packages/opencode/src/tool/write.ts changes
