# Upstream Changes Report
Generated: 2026-07-24 08:28:08

## Summary
- kilocode: 91 commits, 441 files changed
- opencode: 30 commits, 168 files changed

## kilocode Changes (3cab1bd2d..aa22680fe)

### Commits

- aa22680fe - refactor(cli): shared-process remote sessions with safe per-session exit (#12327) (Igor Šćekić, 2026-07-24)
- bdb9070a9 - fix(cli): bound time-to-first-content by request timeout, not the idle watchdog (#12481) (Igor Šćekić, 2026-07-23)
- d0e8a86bf - fix(vscode): ignore Enter when no list result is highlighted (#12486) (hdcode.dev, 2026-07-23)
- 0d830cbd3 - fix: avoid write-on-read mutation of config file (#11940) (rakshith1928, 2026-07-23)
- 182d18bb2 - fix(cli): harden plan edit permissions (#12458) (Johnny Eric Amancio, 2026-07-23)
- cbbf7d48e - Merge pull request #12488 from Kilo-Org/fix/show-vercel-response-id (Christiaan Arnoldus, 2026-07-23)
- bf2cf9375 - Merge pull request #12456 from Kilo-Org/correct-session-scoping (Marius, 2026-07-23)
- 7eaa47b62 - fix: address session mention review (marius-kilocode, 2026-07-23)
- d4250199f - chore(vscode): format request ID label (Christiaan Arnoldus, 2026-07-23)
- 804242b04 - fix(vscode): label Vercel ID as request ID (Christiaan Arnoldus, 2026-07-23)
- c25f041eb - fix: show Vercel ID for incomplete responses (Christiaan Arnoldus, 2026-07-23)
- b367105c8 - feat(vscode): support deleting queued chat messages (#12370) (hdcode.dev, 2026-07-23)
- fa452196b - Merge pull request #12484 from Kilo-Org/fix-aws-sso-credential-parsing-error (Marius, 2026-07-23)
- dcc0d64a3 - feat(opencode): show token throughput metrics (#12434) (Thomas Brugman, 2026-07-23)
- cee5ceee3 - Merge branch 'main' into fix-aws-sso-credential-parsing-error (Marius, 2026-07-23)
- 8eeaa546a - feat(vscode): add searchable session tab switcher (#12462) (hdcode.dev, 2026-07-23)
- 70396e5f9 - fix(dev): preserve AWS profile credential loading (marius-kilocode, 2026-07-23)
- 2d16c00dd - Merge pull request #12459 from Kilo-Org/fix/qwen-late-tool-events (Joshua Lambert, 2026-07-22)
- e72238a66 - feat(cli): accept mobile file attachments in remote sessions (#12394) (Igor Šćekić, 2026-07-22)
- f41da4e20 - Merge pull request #12455 from Kilo-Org/chore/jetbrains-cli-pin-v7.4.15 (Kirill Kalishev, 2026-07-22)
- e957130df - chore(cli): annotate upstream divergence (Josh Lambert, 2026-07-22)
- fe01f53e2 - Cloud Agent - Add kilo cloud command for running asynchronous cloud agent tasks (#11849) (Evgeny Shurakov, 2026-07-22)
- 4850dd1c6 - fix(cli): ignore late tool input events (Josh Lambert, 2026-07-22)
- 16988a558 - feat(cli): add notify_user push-notification tool (#12392) (Igor Šćekić, 2026-07-22)
- 9262f2b49 - fix(cli): recover remote session connection that silently dies and never reconnects (#12393) (Igor Šćekić, 2026-07-22)
- bcff5cb36 - feat(cli): emit session queue state for remote clients (#12297) (Igor Šćekić, 2026-07-22)
- 3d648d7fc - feat: reference past chats with @-mentions (marius-kilocode, 2026-07-22)
- 357289861 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-07-22)
- 54a9109b4 - Merge pull request #12404 from Kilo-Org/marius-kilocode/kilo-opencode-v1.17.5 (Marius, 2026-07-22)
- f210ac596 - chore(jetbrains): bump CLI pin to v7.4.15 (kilo-maintainer[bot], 2026-07-22)
- 13e425966 - release: v7.4.15 (kilo-maintainer[bot], 2026-07-22)
- fc5b22fb6 - Merge pull request #12454 from Kilo-Org/fix-reload-while-session-running (Marius, 2026-07-22)
- 2f389f9fb - fix(vscode): show clear warning when reload is blocked by a running session (Marius, 2026-07-22)
- 74ba761c8 - Merge remote-tracking branch 'origin/main' into marius-kilocode/kilo-opencode-v1.17.5 (marius-kilocode, 2026-07-22)
- 610f956b7 - fix: preserve multi-account auth and Snowflake OAuth (marius-kilocode, 2026-07-22)
- d054f394e - fix(tui): treat global events as default location for integration refresh (marius-kilocode, 2026-07-21)
- d9cf6ebaa - fix: disable per-instance file watchers in httpapi exerciser job (marius-kilocode, 2026-07-21)
- 0e19a61e4 - fix: apply patchedDependencies pruning on every package.json path (marius-kilocode, 2026-07-21)
- 0bcd1b2c8 - Merge remote-tracking branch 'origin/main' into marius-kilocode/kilo-opencode-v1.17.5 (marius-kilocode, 2026-07-21)
- 5da4736d0 - chore: retrigger ci (marius-kilocode, 2026-07-21)
- 0f79817e6 - fix: harden package.json transform against kilo script and policy loss (marius-kilocode, 2026-07-21)
- 8f6b48af6 - test: port oauth settlement guard regression tests to integration (marius-kilocode, 2026-07-21)
- 82dda99b9 - fix: restore kilo ci scripts and install policy (marius-kilocode, 2026-07-21)
- c3c704e67 - fix: serve v2 server routes in the production listener (marius-kilocode, 2026-07-21)
- 2ff1ad825 - fix: regenerate schema.gen with nullable session_message seq (marius-kilocode, 2026-07-21)
- 06d871409 - fix: restore oauth attempt settlement guards in integration (marius-kilocode, 2026-07-20)
- 92f8d0b0d - fix: complete instance boot deferreds on interruption (marius-kilocode, 2026-07-20)
- 48081725f - test: tolerate windows sqlite handle lag in json migration cleanup (marius-kilocode, 2026-07-20)
- 0644aee49 - fix: kilo compat for v1.17.5 test infrastructure (marius-kilocode, 2026-07-20)
- 95db2da8e - refactor: kilo compat for v1.17.5 (marius-kilocode, 2026-07-20)
- 359185293 - resolve merge conflicts (marius-kilocode, 2026-07-20)
- 12147d160 - merge: record upstream v1.17.5 (marius-kilocode, 2026-07-20)
- 4327386ff - refactor: kilo compat for v1.17.5 (marius-kilocode, 2026-07-20)
- 8d78715d6 - release: v1.17.5 (opencode, 2026-06-13)
- 414c037b2 - chore: generate (opencode-agent[bot], 2026-06-13)
- 632f94fa6 - fix(opencode): add authorization header to fetch requests in RunCommand (#29877) (OpeOginni, 2026-06-13)
- a6e3afe04 - chore: generate (opencode-agent[bot], 2026-06-13)
- 3f174531b - feat(opencode): add external browser OAuth for snowflake cortex provider (#31700) (santigc6, 2026-06-13)
- fcca731a9 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-13)
- c7dee9c60 - fix(opencode): recover expired MCP sessions (#32088) (Aiden Cline, 2026-06-13)
- 45e4606fa - feat(app): bring v2 visibility settings to web (#32174) (Luke Parker, 2026-06-13)
- 9ae4a5139 - fix(app): expand terminal resize gutter hitbox (#32169) (Luke Parker, 2026-06-13)
- d73348719 - chore: generate (opencode-agent[bot], 2026-06-13)
- 2630f457b - fix(app): fade overflowing titlebar tabs (#32082) (Luke Parker, 2026-06-13)
- dbbe67f06 - chore: generate (opencode-agent[bot], 2026-06-12)
- fff0ec294 - fix(tui): prevent duplicate renderable IDs (#32110) (Sebastian, 2026-06-13)
- cf2d1dd3e - fix(tui): restore subtask invocation spacing (#32109) (Aiden Cline, 2026-06-12)
- 27ca0f882 - docs: update North Mini Code privacy terms (#32096) (Stefan Avram, 2026-06-12)
- 73dbd8a31 - chore: generate (opencode-agent[bot], 2026-06-12)
- 443f103ee - go: kimi 2.7 code (Frank, 2026-06-12)
- 6c36b585c - chore: generate (opencode-agent[bot], 2026-06-12)
- c2e6b1807 - feat(core): refactor project copies for v2 (#31943) (James Long, 2026-06-12)
- 8d97c8d41 - chore: generate (opencode-agent[bot], 2026-06-12)
- f8b357b26 - fix(data): mobile breakpoint for nav (Adam, 2026-06-12)
- 621796d8c - feat(stats): add world map markers (Adam, 2026-06-12)
- ba2455ecc - feat(stats): use catalog pricing in efficiency and token costs (Adam, 2026-06-12)
- 44308dfd7 - fix(stats): tighten truncated label line height (Adam, 2026-06-12)
- b000256f5 - chore: generate (opencode-agent[bot], 2026-06-12)
- 30b2544fe - refactor(opencode): build server from layer nodes (#32086) (James Long, 2026-06-12)
- 1b096b414 - fix(opencode): clear closed MCP clients (#32084) (Aiden Cline, 2026-06-12)
- be227503a - fix(opencode): expose structured MCP output (#32074) (Aiden Cline, 2026-06-12)
- 4ddfa7c6f - fix(stats): reorder leaderboard cards (Adam, 2026-06-12)
- 2415434ad - feat(go): promote MiniMax M3 usage limits (#31986) (Jack, 2026-06-12)
- bf4c64765 - chore: generate (opencode-agent[bot], 2026-06-12)
- f35bb5184 - feat(app): update oc-2 colors (#31071) (Aarav Sareen, 2026-06-12)
- 2c5335d84 - chore: generate (opencode-agent[bot], 2026-06-12)
- 7793db3ac - fix(core): preserve credential schema compatibility (Dax Raad, 2026-06-12)
- 5f77482a2 - chore: generate (opencode-agent[bot], 2026-06-12)
- 30aec297d - refactor(core): simplify integration credentials (#31968) (Dax, 2026-06-12)
- a9c810cbb - fix(tui): double file content injection in commands using $ARGUMENTS (#31245) (Tony Worm, 2026-06-11)
- fe2e4e21d - sync release versions for v1.17.4 (opencode, 2026-06-12)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/notify-user.ts` (+61, -0)
- `packages/opencode/src/kilocode/tool/notify-user.txt` (+14, -0)
- `packages/opencode/src/kilocode/tool/registry.ts` (+16, -4)
- `packages/opencode/src/tool/recall.ts` (+2, -27)
- `packages/opencode/src/tool/registry.ts` (+34, -30)
- `packages/opencode/test/kilocode/tool/notify-user.test.ts` (+231, -0)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+1, -0)
- `packages/opencode/src/kilocode/agent/index.ts` (+30, -1)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/migration/20260127222353_familiar_lady_ursula/migration.sql` (+0, -90)
- `packages/core/migration/20260127222353_familiar_lady_ursula/snapshot.json` (+0, -796)
- `packages/core/migration/20260211171708_add_project_commands/migration.sql` (+0, -1)
- `packages/core/migration/20260211171708_add_project_commands/snapshot.json` (+0, -806)
- `packages/core/migration/20260213144116_wakeful_the_professor/migration.sql` (+0, -11)
- `packages/core/migration/20260213144116_wakeful_the_professor/snapshot.json` (+0, -897)
- `packages/core/migration/20260225215848_workspace/migration.sql` (+0, -7)
- `packages/core/migration/20260225215848_workspace/snapshot.json` (+0, -959)
- `packages/core/migration/20260227213759_add_session_workspace_id/migration.sql` (+0, -2)
- `packages/core/migration/20260227213759_add_session_workspace_id/snapshot.json` (+0, -983)
- `packages/core/migration/20260228203230_blue_harpoon/migration.sql` (+0, -17)
- `packages/core/migration/20260228203230_blue_harpoon/snapshot.json` (+0, -1102)
- `packages/core/migration/20260303231226_add_workspace_fields/migration.sql` (+0, -5)
- `packages/core/migration/20260303231226_add_workspace_fields/snapshot.json` (+0, -1013)
- `packages/core/migration/20260309230000_move_org_to_state/migration.sql` (+0, -3)
- `packages/core/migration/20260309230000_move_org_to_state/snapshot.json` (+0, -1156)
- `packages/core/migration/20260312043431_session_message_cursor/migration.sql` (+0, -4)
- `packages/core/migration/20260312043431_session_message_cursor/snapshot.json` (+0, -1168)
- `packages/core/migration/20260323234822_events/migration.sql` (+0, -13)
- `packages/core/migration/20260323234822_events/snapshot.json` (+0, -1271)
- `packages/core/migration/20260410174513_workspace-name/migration.sql` (+0, -16)
- `packages/core/migration/20260410174513_workspace-name/snapshot.json` (+0, -1271)
- `packages/core/migration/20260413175956_chief_energizer/migration.sql` (+0, -13)
- `packages/core/migration/20260413175956_chief_energizer/snapshot.json` (+0, -1399)
- `packages/core/migration/20260423070820_add_icon_url_override/migration.sql` (+0, -2)
- `packages/core/migration/20260423070820_add_icon_url_override/snapshot.json` (+0, -1409)
- `packages/core/migration/20260427172553_slow_nightmare/migration.sql` (+0, -17)
- `packages/core/migration/20260427172553_slow_nightmare/snapshot.json` (+0, -1409)
- `packages/core/migration/20260428004200_add_session_path/migration.sql` (+0, -1)
- `packages/core/migration/20260428004200_add_session_path/snapshot.json` (+0, -1419)
- `packages/core/migration/20260501142318_next_venus/migration.sql` (+0, -2)
- `packages/core/migration/20260501142318_next_venus/snapshot.json` (+0, -1439)
- `packages/core/migration/20260504145000_add_sync_owner/migration.sql` (+0, -1)
- `packages/core/migration/20260504145000_add_sync_owner/snapshot.json` (+0, -1449)
- `packages/core/migration/20260507164347_add_workspace_time/migration.sql` (+0, -1)
- `packages/core/migration/20260507164347_add_workspace_time/snapshot.json` (+0, -1459)
- `packages/core/migration/20260510033149_session_usage/migration.sql` (+0, -6)
- `packages/core/migration/20260510033149_session_usage/snapshot.json` (+0, -1519)
- `packages/core/migration/20260511000411_data_migration_state/migration.sql` (+0, -4)
- `packages/core/migration/20260511000411_data_migration_state/snapshot.json` (+0, -1490)
- `packages/core/migration/20260511173437_session-metadata/migration.sql` (+0, -1)
- `packages/core/migration/20260511173437_session-metadata/snapshot.json` (+0, -1560)
- `packages/core/migration/20260601010001_normalize_storage_paths/migration.sql` (+0, -7)
- `packages/core/migration/20260601010001_normalize_storage_paths/snapshot.json` (+0, -1560)
- `packages/core/migration/20260601202201_amazing_prowler/migration.sql` (+0, -1)
- `packages/core/migration/20260601202201_amazing_prowler/snapshot.json` (+0, -1498)
- `packages/core/migration/20260602002951_lowly_union_jack/migration.sql` (+0, -11)
- `packages/core/migration/20260602002951_lowly_union_jack/snapshot.json` (+0, -1602)
- `packages/core/migration/20260602182828_add_project_directories/migration.sql` (+0, -8)
- `packages/core/migration/20260602182828_add_project_directories/snapshot.json` (+0, -1664)
- `packages/core/migration/20260603001617_session_message_projection_indexes/migration.sql` (+0, -5)
- `packages/core/migration/20260603001617_session_message_projection_indexes/snapshot.json` (+0, -1636)
- `packages/core/migration/20260603040000_session_message_projection_order/migration.sql` (+0, -7)
- `packages/core/migration/20260603040000_session_message_projection_order/snapshot.json` (+0, -1638)
- `packages/core/migration/20260603141458_session_input_inbox/migration.sql` (+0, -12)
- `packages/core/migration/20260603141458_session_input_inbox/snapshot.json` (+0, -1759)
- `packages/core/migration/20260603160727_jittery_ezekiel_stane/migration.sql` (+0, -4)
- `packages/core/migration/20260603160727_jittery_ezekiel_stane/snapshot.json` (+0, -1869)
- `packages/core/migration/20260604172448_event_sourced_session_input/migration.sql` (+0, -28)
- `packages/core/migration/20260604172448_event_sourced_session_input/snapshot.json` (+0, -1898)
- `packages/core/migration/20260605003541_add_session_context_snapshot/migration.sql` (+0, -9)
- `packages/core/migration/20260605003541_add_session_context_snapshot/snapshot.json` (+0, -1980)
- `packages/core/migration/20260605042240_add_context_epoch_agent/migration.sql` (+0, -1)
- `packages/core/migration/20260605042240_add_context_epoch_agent/snapshot.json` (+0, -1990)
- `packages/core/migration/20260611035744_credential/migration.sql` (+0, -12)
- `packages/core/migration/20260714141136_session-message-legacy-writer-compat/migration.sql` (+0, -19)
- `packages/core/migration/20260714141136_session-message-legacy-writer-compat/snapshot.json` (+0, -2190)
- `packages/core/package.json` (+1, -1)
- `packages/core/{migration/20260611035744_credential/snapshot.json => schema.json}` (+31, -25)
- `packages/core/script/migration.ts` (+99, -49)
- `packages/core/src/catalog.ts` (+7, -5)
- `packages/core/src/connector.ts` (+0, -538)
- `packages/core/src/connector/schema.ts` (+0, -9)
- `packages/core/src/credential.ts` (+151, -328)
- `packages/core/src/credential/sql.ts` (+12, -20)
- `packages/core/src/database/database.ts` (+2, -1)
- `packages/core/src/database/migration.gen.ts` (+2, -0)
- `packages/core/src/database/migration.ts` (+24, -2)
- `packages/core/src/database/migration/20260611192811_lush_chimera.ts` (+25, -0)
- `packages/core/src/database/migration/20260612174303_project_dir_strategy.ts` (+29, -0)
- `packages/core/src/database/schema.gen.ts` (+261, -0)
- `packages/core/src/effect/layer-node.ts` (+22, -2)
- `packages/core/src/integration.ts` (+567, -0)
- `packages/core/src/integration/connection.ts` (+20, -0)
- `packages/core/src/integration/schema.ts` (+9, -0)
- `packages/core/src/kilocode/credential-migration.ts` (+1, -0)
- `packages/core/src/location-layer.ts` (+14, -2)
- `packages/core/src/plugin/boot.ts` (+5, -5)
- `packages/core/src/plugin/models-dev.ts` (+16, -13)
- `packages/core/src/plugin/provider/openai-auth.ts` (+17, -12)
- `packages/core/src/plugin/provider/openai.ts` (+3, -3)
- `packages/core/src/plugin/provider/snowflake-cortex.ts` (+6, -3)
- `packages/core/src/project.ts` (+21, -47)
- `packages/core/src/project/copy-strategies.ts` (+10, -19)
- `packages/core/src/project/copy.ts` (+152, -132)
- `packages/core/src/project/directories.ts` (+159, -0)
- `packages/core/src/project/schema.ts` (+20, -0)
- `packages/core/src/project/sql.ts` (+6, -5)
- `packages/core/src/ripgrep.ts` (+2, -0)
- `packages/core/src/ripgrep/binary.ts` (+4, -0)
- `packages/core/src/v1/config/provider.ts` (+1, -1)
- `packages/core/src/v1/session.ts` (+29, -0)
- `packages/core/test/catalog.test.ts` (+21, -18)
- `packages/core/test/connector.test.ts` (+0, -681)
- `packages/core/test/credential.test.ts` (+71, -185)
- `packages/core/test/database-migration.test.ts` (+38, -0)
- `packages/core/test/integration.test.ts` (+401, -0)
- `packages/core/test/kilocode/account-auth-v2-migration.test.ts` (+104, -8)
- `packages/core/test/kilocode/integration-settlement.test.ts` (+334, -0)
- `packages/core/test/location-layer.test.ts` (+3, -5)
- `packages/core/test/move-session.test.ts` (+4, -1)
- `packages/core/test/plugin/models-dev.test.ts` (+27, -11)
- `packages/core/test/plugin/provider-azure.test.ts` (+9, -9)
- `packages/core/test/plugin/provider-cloudflare-workers-ai.test.ts` (+9, -9)
- `packages/core/test/plugin/provider-gitlab.test.ts` (+11, -11)
- `packages/core/test/plugin/provider-helper.ts` (+14, -5)
- `packages/core/test/plugin/provider-openai.test.ts` (+15, -15)
- `packages/core/test/plugin/provider-snowflake-cortex.test.ts` (+42, -0)
- `packages/core/test/project-copy.test.ts` (+104, -29)
- `packages/core/test/project-directories.test.ts` (+63, -0)
- `packages/core/test/project.test.ts` (+5, -50)

#### Other Changes
- `.changeset/agent-notify-user-tool.md` (+5, -0)
- `.changeset/calm-lists-enter.md` (+5, -0)
- `.changeset/chunk-idle-timeout-default.md` (+0, -5)
- `.changeset/cli-live-reconnect.md` (+5, -0)
- `.changeset/config-schema-injection-jsonc.md` (+5, -0)
- `.changeset/first-content-watchdog.md` (+5, -0)
- `.changeset/grumpy-cougars-see.md` (+7, -0)
- `.changeset/harden-planning-agent-edits.md` (+5, -0)
- `.changeset/improve-xai-cache-hit-rate.md` (+0, -5)
- `.changeset/jetbrains-permission-dialog-ui.md` (+0, -5)
- `.changeset/jetbrains-permission-rules.md` (+0, -5)
- `.changeset/jetbrains-rules-settings.md` (+0, -5)
- `.changeset/jetbrains-skills-settings.md` (+0, -5)
- `.changeset/queue-changed-snapshot.md` (+5, -0)
- `.changeset/refine-memory-controls.md` (+0, -8)
- `.changeset/remote-instance-advertisement.md` (+5, -0)
- `.changeset/remote-session-file-attachments.md` (+5, -0)
- `.changeset/reset-diff-scroll.md` (+0, -5)
- `.changeset/run-cloud-agent.md` (+5, -0)
- `.changeset/sandbox-unreadable-directory-scan.md` (+0, -6)
- `.changeset/session-mentions.md` (+6, -0)
- `.changeset/session-tab-switcher.md` (+5, -0)
- `.changeset/show-vercel-response-id.md` (+6, -0)
- `.changeset/token-throughput-v2.md` (+6, -0)
- `.github/workflows/test.yml` (+2, -0)
- `.opencode-version` (+1, -1)
- `bun.lock` (+27, -26)
- `nix/hashes.json` (+4, -4)
- `package.json` (+5, -4)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+4, -2)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-docs/lychee.toml` (+1, -0)
- `packages/kilo-docs/markdoc/partials/cli-commands-table.md` (+1, -0)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli-reference.md` (+70, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/session-tabs/switcher-open-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/source-links.md` (+3, -0)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/CHANGELOG.md` (+14, -0)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-memory/package.json` (+1, -1)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/icon.tsx` (+4, -0)
- `packages/kilo-ui/src/components/message-part.css` (+11, -0)
- `packages/kilo-ui/src/components/message-part.tsx` (+48, -2)
- `packages/kilo-vscode/CHANGELOG.md` (+16, -0)
- `packages/kilo-vscode/package.json` (+6, -1)
- `packages/kilo-vscode/script/local-bin.ts` (+10, -8)
- `packages/kilo-vscode/src/KiloProvider.ts` (+84, -19)
- `packages/kilo-vscode/src/kilo-provider/message-files.ts` (+2, -1)
- `packages/kilo-vscode/src/kilo-provider/session-search.ts` (+51, -0)
- `packages/kilo-vscode/src/kilo-provider/throughput-settings.ts` (+19, -0)
- `packages/kilo-vscode/tests/accessibility.spec.ts` (+50, -0)
- `packages/kilo-vscode/tests/fixtures/session-tab-switcher.tsx` (+194, -0)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/unit/file-mention-utils.test.ts` (+116, -0)
- `packages/kilo-vscode/tests/unit/message-files.test.ts` (+18, -0)
- `packages/kilo-vscode/tests/unit/session-outcome.test.ts` (+22, -0)
- `packages/kilo-vscode/tests/unit/session-tab-switcher.test.ts` (+57, -0)
- `packages/kilo-vscode/tests/unit/session-utils.test.ts` (+266, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/SidebarSearchMenu.tsx` (+21, -15)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+0, -104)
- `packages/kilo-vscode/webview-ui/src/App.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/AssistantMessage.tsx` (+66, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+91, -51)
- `packages/kilo-vscode/webview-ui/src/components/chat/SessionMentionPicker.tsx` (+61, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/SessionTabStrip.tsx` (+26, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/SessionTabSwitcher.tsx` (+177, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/TranscriptRow.tsx` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/VscodeUserMessage.tsx` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/DisplayTab.tsx` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/components/shared/TurnOutcome.tsx` (+4, -1)
- `packages/kilo-vscode/webview-ui/src/context/config.tsx` (+10, -0)
- `packages/kilo-vscode/webview-ui/src/context/display.tsx` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/context/session-outcome.ts` (+10, -1)
- `packages/kilo-vscode/webview-ui/src/context/session-utils.ts` (+100, -0)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+21, -2)
- `packages/kilo-vscode/webview-ui/src/hooks/file-mention-utils.ts` (+90, -1)
- `packages/kilo-vscode/webview-ui/src/hooks/useFileMention.ts` (+113, -7)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+14, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+14, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+14, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+14, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+14, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+14, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+14, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+14, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+14, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+14, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+14, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+14, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+14, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+14, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+14, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+14, -0)
- `packages/kilo-vscode/webview-ui/src/stories/session-tabs.stories.tsx` (+60, -0)
- `packages/kilo-vscode/webview-ui/src/styles/chat-layout.css` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/styles/chat.css` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/styles/prompt-dropdowns.css` (+67, -0)
- `packages/kilo-vscode/webview-ui/src/styles/search-menu.css` (+92, -0)
- `packages/kilo-vscode/webview-ui/src/styles/session-tabs.css` (+69, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+21, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/parts.ts` (+28, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+19, -0)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+15, -0)
- `packages/opencode/package.json` (+3, -3)
- `packages/opencode/src/cli/cmd/providers.ts` (+0, -19)
- `packages/opencode/src/cli/cmd/remote.ts` (+32, -0)
- `packages/opencode/src/cli/cmd/run.ts` (+8, -2)
- `packages/opencode/src/cli/cmd/run/footer.command.tsx` (+2, -23)
- `packages/opencode/src/cli/cmd/run/footer.menu.tsx` (+0, -2)
- `packages/opencode/src/cli/cmd/run/footer.permission.tsx` (+1, -11)
- `packages/opencode/src/cli/cmd/run/footer.prompt.tsx` (+2, -3)
- `packages/opencode/src/cli/cmd/run/footer.question.tsx` (+2, -9)
- `packages/opencode/src/cli/cmd/run/footer.subagent.tsx` (+1, -7)
- `packages/opencode/src/cli/cmd/run/footer.view.tsx` (+9, -51)
- `packages/opencode/src/cli/cmd/run/scrollback.surface.ts` (+0, -6)
- `packages/opencode/src/cli/cmd/run/scrollback.writer.tsx` (+0, -1)
- `packages/opencode/src/cli/cmd/run/splash.ts` (+0, -4)
- `packages/opencode/src/config/config.ts` (+8, -2)
- `packages/opencode/src/effect/app-runtime.ts` (+11, -1)
- `packages/opencode/src/kilo-sessions/attached-state.ts` (+192, -6)
- `packages/opencode/src/kilo-sessions/ingest-queue.ts` (+8, -0)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+315, -39)
- `packages/opencode/src/kilo-sessions/remote-command.ts` (+20, -1)
- `packages/opencode/src/kilo-sessions/remote-protocol.ts` (+26, -0)
- `packages/opencode/src/kilo-sessions/remote-sender.ts` (+303, -37)
- `packages/opencode/src/kilo-sessions/remote-ws.ts` (+427, -95)
- `packages/opencode/src/kilocode/auth/remove.ts` (+3, -3)
- `packages/opencode/src/kilocode/bootstrap.ts` (+11, -11)
- `packages/opencode/src/kilocode/cli/cmd/cloud.ts` (+134, -0)
- `packages/opencode/src/kilocode/cli/setup.ts` (+2, -0)
- `packages/opencode/src/kilocode/cloud/auth.ts` (+66, -0)
- `packages/opencode/src/kilocode/cloud/catalog.ts` (+173, -0)
- `packages/opencode/src/kilocode/cloud/commands.ts` (+295, -0)
- `packages/opencode/src/kilocode/cloud/contracts.ts` (+194, -0)
- `packages/opencode/src/kilocode/cloud/defaults.ts` (+138, -0)
- `packages/opencode/src/kilocode/cloud/errors.ts` (+24, -0)
- `packages/opencode/src/kilocode/cloud/http.ts` (+67, -0)
- `packages/opencode/src/kilocode/cloud/message-id.ts` (+11, -0)
- `packages/opencode/src/kilocode/cloud/origin.ts` (+70, -0)
- `packages/opencode/src/kilocode/cloud/repository.ts` (+265, -0)
- `packages/opencode/src/kilocode/cloud/response-json.ts` (+45, -0)
- `packages/opencode/src/kilocode/cloud/stream-ticket.ts` (+96, -0)
- `packages/opencode/src/kilocode/cloud/trpc.ts` (+158, -0)
- `packages/opencode/src/kilocode/cloud/websocket-stream.ts` (+194, -0)
- `packages/opencode/src/kilocode/commands.ts` (+4, -2)
- `packages/opencode/src/kilocode/plugins/model-usage.ts` (+80, -1)
- `packages/opencode/src/kilocode/plugins/sidebar-usage.tsx` (+88, -1)
- `packages/opencode/src/kilocode/provider/provider.ts` (+168, -0)
- `packages/opencode/src/kilocode/remote-attachments.ts` (+392, -0)
- `packages/opencode/src/kilocode/session/event.ts` (+11, -1)
- `packages/opencode/src/kilocode/session/index.ts` (+24, -1)
- `packages/opencode/src/kilocode/session/llm.ts` (+132, -15)
- `packages/opencode/src/kilocode/session/metrics.ts` (+47, -0)
- `packages/opencode/src/kilocode/session/processor.ts` (+13, -6)
- `packages/opencode/src/kilocode/session/prompt-queue.ts` (+88, -4)
- `packages/opencode/src/kilocode/session/response-metadata.ts` (+17, -0)
- `packages/opencode/src/kilocode/session/transcript.ts` (+138, -0)
- `packages/opencode/src/mcp/catalog.ts` (+9, -3)
- `packages/opencode/src/mcp/index.ts` (+20, -2)
- `packages/opencode/src/plugin/index.ts` (+2, -0)
- `packages/opencode/src/plugin/snowflake-cortex.ts` (+529, -0)
- `packages/opencode/src/project/instance-store.ts` (+13, -5)
- `packages/opencode/src/project/project.ts` (+15, -25)
- `packages/opencode/src/provider/provider.ts` (+43, -59)
- `packages/opencode/src/server/routes/instance/httpapi/groups/project-copy.ts` (+13, -69)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/project-copy.ts` (+28, -102)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/session.ts` (+12, -1)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+94, -84)
- `packages/opencode/src/session/llm.ts` (+21, -4)
- `packages/opencode/src/session/llm/ai-sdk.ts` (+7, -1)
- `packages/opencode/src/session/processor.ts` (+29, -4)
- `packages/opencode/src/session/prompt.ts` (+16, -1)
- `packages/opencode/test/cli/run/footer.view.test.tsx` (+55, -15)
- `packages/opencode/test/config/config.test.ts` (+62, -0)
- `packages/opencode/test/fixture/mcp-session-recovery.ts` (+50, -0)
- `packages/opencode/test/kilocode/agent-permission-overrides.test.ts` (+204, -0)
- `packages/opencode/test/kilocode/auth-remove.test.ts` (+5, -8)
- `packages/opencode/test/kilocode/cli-shutdown.test.ts` (+2, -0)
- `packages/opencode/test/kilocode/cli/cmd/remote.test.ts` (+33, -0)
- `packages/opencode/test/kilocode/cloud/command.test.ts` (+540, -0)
- `packages/opencode/test/kilocode/cloud/defaults.test.ts` (+436, -0)
- `packages/opencode/test/kilocode/cloud/repository.test.ts` (+119, -0)
- `packages/opencode/test/kilocode/cloud/stream-ticket.test.ts` (+134, -0)
- `packages/opencode/test/kilocode/cloud/transport.test.ts` (+260, -0)
- `packages/opencode/test/kilocode/cloud/websocket-stream.test.ts` (+281, -0)
- `packages/opencode/test/kilocode/help.test.ts` (+26, -0)
- `packages/opencode/test/kilocode/kilo-sessions.test.ts` (+354, -1)
- `packages/opencode/test/kilocode/provider/provider.test.ts` (+168, -0)
- `packages/opencode/test/kilocode/remote-attachments.test.ts` (+581, -0)
- `packages/opencode/test/kilocode/session-compaction-cap.test.ts` (+4, -2)
- `packages/opencode/test/kilocode/session-metrics.test.ts` (+80, -0)
- `packages/opencode/test/kilocode/session-processor-incomplete-response-retry.test.ts` (+7, -5)
- `packages/opencode/test/kilocode/session-prompt-compaction-safety.test.ts` (+4, -2)
- `packages/opencode/test/kilocode/session-prompt-permission-refresh.test.ts` (+4, -2)
- `packages/opencode/test/kilocode/session-prompt-queue.test.ts` (+598, -40)
- `packages/opencode/test/kilocode/session-response-metadata.test.ts` (+39, -0)
- `packages/opencode/test/kilocode/session-stream-watchdog.test.ts` (+72, -0)
- `packages/opencode/test/kilocode/session/llm.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/session/session-stream-watchdog.test.ts` (+221, -4)
- `packages/opencode/test/kilocode/session/transcript.test.ts` (+200, -0)
- `packages/opencode/test/kilocode/sessions/attached-state.test.ts` (+269, -0)
- `packages/opencode/test/kilocode/sessions/ingest-queue.test.ts` (+68, -0)
- `packages/opencode/test/kilocode/sessions/remote-command.test.ts` (+17, -3)
- `packages/opencode/test/kilocode/sessions/remote-protocol.test.ts` (+195, -0)
- `packages/opencode/test/kilocode/sessions/remote-sender.test.ts` (+810, -150)
- `packages/opencode/test/kilocode/sessions/remote-ws.test.ts` (+1619, -35)
- `packages/opencode/test/kilocode/sessions/send-agent-notification.test.ts` (+483, -0)
- `packages/opencode/test/kilocode/snowflake-cortex-provider.test.ts` (+60, -0)
- `packages/opencode/test/kilocode/storage/json-migration.test.ts` (+18, -21)
- `packages/opencode/test/kilocode/tool-registry-indexing-import-failure.test.ts` (+1, -0)
- `packages/opencode/test/kilocode/tool-registry-indexing.test.ts` (+14, -1)
- `packages/opencode/test/kilocode/tool-registry-semantic-import-failure.test.ts` (+1, -0)
- `packages/opencode/test/kilocode/tui/usage.test.ts` (+118, -0)
- `packages/opencode/test/mcp/session-recovery.test.ts` (+27, -0)
- `packages/opencode/test/plugin/snowflake-cortex.test.ts` (+278, -0)
- `packages/opencode/test/project/project-directory.test.ts` (+42, -10)
- `packages/opencode/test/project/project.test.ts` (+3, -3)
- `packages/opencode/test/provider/header-timeout.test.ts` (+67, -1)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+44, -14)
- `packages/opencode/test/server/httpapi-public-openapi.test.ts` (+13, -11)
- `packages/opencode/test/server/httpapi-session.test.ts` (+60, -1)
- `packages/opencode/test/server/project-copy.test.ts` (+21, -9)
- `packages/opencode/test/session/processor-effect.test.ts` (+72, -0)
- `packages/opencode/test/session/prompt.test.ts` (+39, -79)
- `packages/opencode/test/storage/workspace-time-migration.test.ts` (+0, -50)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+292, -191)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+304, -240)
- `packages/sdk/openapi.json` (+653, -519)
- `packages/server/package.json` (+1, -1)
- `packages/server/src/api.ts` (+6, -2)
- `packages/server/src/groups/credential.ts` (+30, -0)
- `packages/server/src/groups/{connector.ts => integration.ts}` (+32, -34)
- `packages/server/src/groups/project-copy.ts` (+57, -0)
- `packages/server/src/handlers.ts` (+8, -2)
- `packages/server/src/handlers/credential.ts` (+22, -0)
- `packages/server/src/handlers/{connector.ts => integration.ts}` (+30, -29)
- `packages/server/src/handlers/project-copy.ts` (+68, -0)
- `packages/storybook/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/tui/src/component/dialog-move-session.tsx` (+124, -41)
- `packages/tui/src/component/prompt/autocomplete.tsx` (+25, -1)
- `packages/tui/src/component/prompt/move.tsx` (+15, -3)
- `packages/tui/src/context/data.tsx` (+18, -14)
- `packages/tui/src/context/project.tsx` (+1, -2)
- `packages/tui/src/feature-plugins/system/diff-viewer.tsx` (+0, -2)
- `packages/tui/src/kilocode/dialog-session-mention.tsx` (+49, -0)
- `packages/tui/src/kilocode/session-mentions.ts` (+84, -0)
- `packages/tui/src/routes/session/index.tsx` (+15, -6)
- `packages/tui/src/ui/dialog-select.tsx` (+13, -4)
- `packages/tui/test/cli/tui/__snapshots__/inline-tool-wrap-snapshot.test.tsx.snap` (+16, -0)
- `packages/tui/test/cli/tui/data.test.tsx` (+8, -8)
- `packages/tui/test/cli/tui/diff-viewer.test.tsx` (+11, -9)
- `packages/tui/test/cli/tui/inline-tool-wrap-snapshot.test.tsx` (+36, -0)
- `packages/tui/test/fixture/tui-sdk.ts` (+1, -1)
- `packages/tui/test/kilocode/data.test.ts` (+15, -0)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/script/colors.txt` (+14, -14)
- `packages/ui/src/components/list.tsx` (+4, -2)
- `packages/ui/src/components/popover.tsx` (+3, -0)
- `packages/ui/src/i18n/ar.ts` (+1, -0)
- `packages/ui/src/i18n/br.ts` (+1, -0)
- `packages/ui/src/i18n/bs.ts` (+1, -0)
- `packages/ui/src/i18n/da.ts` (+1, -0)
- `packages/ui/src/i18n/de.ts` (+1, -0)
- `packages/ui/src/i18n/en.ts` (+1, -0)
- `packages/ui/src/i18n/es.ts` (+1, -0)
- `packages/ui/src/i18n/fr.ts` (+1, -0)
- `packages/ui/src/i18n/it.ts` (+1, -0)
- `packages/ui/src/i18n/ja.ts` (+1, -0)
- `packages/ui/src/i18n/ko.ts` (+1, -0)
- `packages/ui/src/i18n/nl.ts` (+1, -0)
- `packages/ui/src/i18n/no.ts` (+1, -0)
- `packages/ui/src/i18n/pl.ts` (+1, -0)
- `packages/ui/src/i18n/ru.ts` (+1, -0)
- `packages/ui/src/i18n/th.ts` (+1, -0)
- `packages/ui/src/i18n/tr.ts` (+1, -0)
- `packages/ui/src/i18n/uk.ts` (+1, -0)
- `packages/ui/src/i18n/zh.ts` (+1, -0)
- `packages/ui/src/i18n/zht.ts` (+1, -0)
- `packages/ui/src/theme/color.ts` (+13, -0)
- `packages/ui/src/theme/themes/oc-2.json` (+40, -38)
- `packages/ui/src/theme/v2/default-primitives.ts` (+8, -7)
- `packages/ui/src/theme/v2/foreground.ts` (+41, -1)
- `packages/ui/src/theme/v2/mapping.ts` (+0, -12)
- `packages/ui/src/theme/v2/resolve.ts` (+1, -1)
- `packages/ui/src/v2/components/tabs-v2.css` (+4, -3)
- `packages/ui/src/v2/styles/colors.css` (+8, -7)
- `packages/ui/src/v2/styles/theme.css` (+40, -40)
- `patches/@modelcontextprotocol%2Fsdk@1.29.0.patch` (+401, -0)
- `script/check-opencode-promise-facades.ts` (+7, -0)
- `script/upstream/package.json` (+1, -1)
- `script/upstream/transforms/transform-package-json.test.ts` (+52, -0)
- `script/upstream/transforms/transform-package-json.ts` (+67, -1)

### Key Diffs

#### packages/core/migration/20260127222353_familiar_lady_ursula/migration.sql
```diff
diff --git a/packages/core/migration/20260127222353_familiar_lady_ursula/migration.sql b/packages/core/migration/20260127222353_familiar_lady_ursula/migration.sql
deleted file mode 100644
index 775c1a117..000000000
--- a/packages/core/migration/20260127222353_familiar_lady_ursula/migration.sql
+++ /dev/null
@@ -1,90 +0,0 @@
-CREATE TABLE `project` (
-	`id` text PRIMARY KEY,
-	`worktree` text NOT NULL,
-	`vcs` text,
-	`name` text,
-	`icon_url` text,
-	`icon_color` text,
-	`time_created` integer NOT NULL,
-	`time_updated` integer NOT NULL,
-	`time_initialized` integer,
-	`sandboxes` text NOT NULL
-);
---> statement-breakpoint
-CREATE TABLE `message` (
-	`id` text PRIMARY KEY,
-	`session_id` text NOT NULL,
-	`time_created` integer NOT NULL,
-	`time_updated` integer NOT NULL,
-	`data` text NOT NULL,
-	CONSTRAINT `fk_message_session_id_session_id_fk` FOREIGN KEY (`session_id`) REFERENCES `session`(`id`) ON DELETE CASCADE
-);
---> statement-breakpoint
-CREATE TABLE `part` (
-	`id` text PRIMARY KEY,
-	`message_id` text NOT NULL,
-	`session_id` text NOT NULL,
-	`time_created` integer NOT NULL,
-	`time_updated` integer NOT NULL,
-	`data` text NOT NULL,
-	CONSTRAINT `fk_part_message_id_message_id_fk` FOREIGN KEY (`message_id`) REFERENCES `message`(`id`) ON DELETE CASCADE
-);
---> statement-breakpoint
-CREATE TABLE `permission` (
-	`project_id` text PRIMARY KEY,
-	`time_created` integer NOT NULL,
-	`time_updated` integer NOT NULL,
-	`data` text NOT NULL,
-	CONSTRAINT `fk_permission_project_id_project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON DELETE CASCADE
-);
---> statement-breakpoint
-CREATE TABLE `session` (
-	`id` text PRIMARY KEY,
-	`project_id` text NOT NULL,
-	`parent_id` text,
```

#### packages/core/migration/20260127222353_familiar_lady_ursula/snapshot.json
```diff
diff --git a/packages/core/migration/20260127222353_familiar_lady_ursula/snapshot.json b/packages/core/migration/20260127222353_familiar_lady_ursula/snapshot.json
deleted file mode 100644
index ff76ee209..000000000
--- a/packages/core/migration/20260127222353_familiar_lady_ursula/snapshot.json
+++ /dev/null
@@ -1,796 +0,0 @@
-{
-  "version": "7",
-  "dialect": "sqlite",
-  "id": "068758ed-a97a-46f6-8a59-6c639ae7c20c",
-  "prevIds": ["00000000-0000-0000-0000-000000000000"],
-  "ddl": [
-    {
-      "name": "project",
-      "entityType": "tables"
-    },
-    {
-      "name": "message",
-      "entityType": "tables"
-    },
-    {
-      "name": "part",
-      "entityType": "tables"
-    },
-    {
-      "name": "permission",
-      "entityType": "tables"
-    },
-    {
-      "name": "session",
-      "entityType": "tables"
-    },
-    {
-      "name": "todo",
-      "entityType": "tables"
-    },
-    {
-      "name": "session_share",
-      "entityType": "tables"
-    },
-    {
-      "type": "text",
-      "notNull": false,
-      "autoincrement": false,
-      "default": null,
-      "generated": null,
-      "name": "id",
-      "entityType": "columns",
-      "table": "project"
-    },
```

#### packages/core/migration/20260211171708_add_project_commands/migration.sql
```diff
diff --git a/packages/core/migration/20260211171708_add_project_commands/migration.sql b/packages/core/migration/20260211171708_add_project_commands/migration.sql
deleted file mode 100644
index b63f147a0..000000000
--- a/packages/core/migration/20260211171708_add_project_commands/migration.sql
+++ /dev/null
@@ -1 +0,0 @@
-ALTER TABLE `project` ADD `commands` text;
\ No newline at end of file
```

#### packages/core/migration/20260211171708_add_project_commands/snapshot.json
```diff
diff --git a/packages/core/migration/20260211171708_add_project_commands/snapshot.json b/packages/core/migration/20260211171708_add_project_commands/snapshot.json
deleted file mode 100644
index 1182cc32d..000000000
--- a/packages/core/migration/20260211171708_add_project_commands/snapshot.json
+++ /dev/null
@@ -1,806 +0,0 @@
-{
-  "version": "7",
-  "dialect": "sqlite",
-  "id": "8bc2d11d-97fa-4ba8-8bfa-6c5956c49aeb",
-  "prevIds": ["068758ed-a97a-46f6-8a59-6c639ae7c20c"],
-  "ddl": [
-    {
-      "name": "project",
-      "entityType": "tables"
-    },
-    {
-      "name": "message",
-      "entityType": "tables"
-    },
-    {
-      "name": "part",
-      "entityType": "tables"
-    },
-    {
-      "name": "permission",
-      "entityType": "tables"
-    },
-    {
-      "name": "session",
-      "entityType": "tables"
-    },
-    {
-      "name": "todo",
-      "entityType": "tables"
-    },
-    {
-      "name": "session_share",
-      "entityType": "tables"
-    },
-    {
-      "type": "text",
-      "notNull": false,
-      "autoincrement": false,
-      "default": null,
-      "generated": null,
-      "name": "id",
-      "entityType": "columns",
-      "table": "project"
-    },
```

#### packages/core/migration/20260213144116_wakeful_the_professor/migration.sql
```diff
diff --git a/packages/core/migration/20260213144116_wakeful_the_professor/migration.sql b/packages/core/migration/20260213144116_wakeful_the_professor/migration.sql
deleted file mode 100644
index 3085fe280..000000000
--- a/packages/core/migration/20260213144116_wakeful_the_professor/migration.sql
+++ /dev/null
@@ -1,11 +0,0 @@
-CREATE TABLE `control_account` (
-	`email` text NOT NULL,
-	`url` text NOT NULL,
-	`access_token` text NOT NULL,
-	`refresh_token` text NOT NULL,
-	`token_expiry` integer,
-	`active` integer NOT NULL,
-	`time_created` integer NOT NULL,
-	`time_updated` integer NOT NULL,
-	CONSTRAINT `control_account_pk` PRIMARY KEY(`email`, `url`)
-);
```


*... and more files (showing first 5)*

## opencode Changes (0a601cf..ce7f54d)

### Commits

- ce7f54d - fix(app): make prompt input agent toggle reactive (#38653) (Brendan Allan, 2026-07-24)
- bce2992 - chore: generate (opencode-agent[bot], 2026-07-24)
- 3819848 - feat(app): support current review data (#38460) (Brendan Allan, 2026-07-24)
- 55f4a26 - fix(app): preserve paginated timeline order (#38641) (Brendan Allan, 2026-07-24)
- a48912c - fix(app): restore directory-scoped session status for v1 servers (#38637) (Brendan Allan, 2026-07-24)
- 2ea4bb7 - chore: generate (opencode-agent[bot], 2026-07-24)
- d07323e - feat(app): migrate discovery workflows (#38465) (Brendan Allan, 2026-07-24)
- 5ce89dc - chore: generate (opencode-agent[bot], 2026-07-24)
- 589ef16 - refactor(app): split home view controllers (#38607) (Brendan Allan, 2026-07-24)
- 386afb7 - chore: generate (opencode-agent[bot], 2026-07-24)
- 29af2e3 - feat(app): migrate session interactions (#38461) (Brendan Allan, 2026-07-24)
- 090a26a - chore: generate (opencode-agent[bot], 2026-07-24)
- ce9a875 - feat(app): render current session timeline (#38466) (Brendan Allan, 2026-07-24)
- db88c42 - fix(app): hydrate v1 session progress (#38606) (Brendan Allan, 2026-07-24)
- adba484 - chore: generate (opencode-agent[bot], 2026-07-24)
- 37c263e - feat(app): project current server state (#38459) (Brendan Allan, 2026-07-24)
- 204f48d - docs(zen): add Ling 3.0 Flash free model (#38503) (Jack, 2026-07-24)
- 743f641 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-23)
- 20589d6 - fix(provider): preserve Mistral reasoning history (#38453) (Aiden Cline, 2026-07-23)
- 62e4641 - chore: generate (opencode-agent[bot], 2026-07-23)
- e59ba24 - feat(app): support current event transport (#38464) (Brendan Allan, 2026-07-23)
- 347510a - chore: generate (opencode-agent[bot], 2026-07-23)
- d03e0c5 - feat(app): add dual-server compatibility (#38462) (Brendan Allan, 2026-07-23)
- 84c79c1 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-23)
- e45210c - chore(app): vendor v2 promise client (#38467) (Brendan Allan, 2026-07-23)
- 92cede0 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-23)
- fada1a5 - fix(provider): serialize Mistral prompt cache keys (#38448) (Aiden Cline, 2026-07-22)
- 542ba88 - fix(provider): select prompt cache keys by SDK (#38424) (Aiden Cline, 2026-07-22)
- 411eff7 - feat(go): add Hy3 to Go model lineup (#38349) (Jack, 2026-07-23)
- 50eee1f - fix(provider): correct MiniMax M3 thinking variants (#38330) (Aiden Cline, 2026-07-22)

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
- `packages/core/package.json` (+1, -1)
- `packages/core/test/provider-mistral.test.ts` (+282, -0)

#### Other Changes
- `bun.lock` (+20, -5)
- `nix/hashes.json` (+4, -4)
- `package.json` (+1, -0)
- `packages/app/e2e/performance/timeline-stability/fixture.ts` (+2, -0)
- `packages/app/e2e/performance/timeline/session-parent-hydration-benchmark.spec.ts` (+27, -6)
- `packages/app/e2e/regression/cross-server-tab-close.spec.ts` (+24, -6)
- `packages/app/e2e/regression/remote-tab-busy.spec.ts` (+29, -7)
- `packages/app/e2e/regression/review-open-file.spec.ts` (+1, -1)
- `packages/app/e2e/regression/review-state-persistence.spec.ts` (+1, -1)
- `packages/app/e2e/regression/review-terminal-stacked.spec.ts` (+4, -1)
- `packages/app/e2e/regression/session-list-path-loading.spec.ts` (+2, -2)
- `packages/app/e2e/regression/session-request-docks.spec.ts` (+8, -4)
- `packages/app/e2e/regression/session-timeline-transport.spec.ts` (+3, -3)
- `packages/app/e2e/regression/session-todo-dock-navigation.spec.ts` (+4, -0)
- `packages/app/e2e/regression/subagent-child-navigation.spec.ts` (+7, -4)
- `packages/app/e2e/regression/tab-navigate-mousedown.spec.ts` (+23, -4)
- `packages/app/e2e/utils/mock-server.ts` (+272, -12)
- `packages/app/e2e/utils/sse-transport.ts` (+37, -9)
- `packages/app/package.json` (+1, -0)
- `packages/app/src/app.tsx` (+2, -1)
- `packages/app/src/components/command-palette.ts` (+8, -6)
- `packages/app/src/components/dialog-command-palette-v2.tsx` (+1, -2)
- `packages/app/src/components/dialog-connect-provider.tsx` (+88, -109)
- `packages/app/src/components/dialog-fork.tsx` (+3, -7)
- `packages/app/src/components/dialog-select-directory-v2.tsx` (+24, -14)
- `packages/app/src/components/dialog-select-directory.tsx` (+1, -4)
- `packages/app/src/components/dialog-select-mcp.tsx` (+2, -2)
- `packages/app/src/components/directory-picker-domain.test.ts` (+27, -4)
- `packages/app/src/components/directory-picker-domain.ts` (+13, -10)
- `packages/app/src/components/edit-project.ts` (+5, -2)
- `packages/app/src/components/prompt-input-v2.tsx` (+7, -6)
- `packages/app/src/components/prompt-input.tsx` (+1, -1)
- `packages/app/src/components/prompt-input/submit.test.ts` (+121, -19)
- `packages/app/src/components/prompt-input/submit.ts` (+65, -33)
- `packages/app/src/components/server/server-row-menu.tsx` (+54, -17)
- `packages/app/src/components/status-popover-indicator.test.ts` (+1, -1)
- `packages/app/src/components/status-popover-indicator.ts` (+4, -3)
- `packages/app/src/components/titlebar-tab-nav.tsx` (+1, -2)
- `packages/app/src/components/titlebar.tsx` (+3, -2)
- `packages/app/src/context/directory-sync.ts` (+6, -5)
- `packages/app/src/context/file.tsx` (+11, -3)
- `packages/app/src/context/global-sync/bootstrap.test.ts` (+124, -69)
- `packages/app/src/context/global-sync/bootstrap.ts` (+209, -54)
- `packages/app/src/context/global-sync/child-store.ts` (+1, -0)
- `packages/app/src/context/global-sync/event-reducer.test.ts` (+7, -3)
- `packages/app/src/context/global-sync/event-reducer.ts` (+73, -7)
- `packages/app/src/context/global-sync/mcp.test.ts` (+20, -0)
- `packages/app/src/context/global-sync/mcp.ts` (+3, -2)
- `packages/app/src/context/global-sync/session-cache.test.ts` (+8, -11)
- `packages/app/src/context/global-sync/session-cache.ts` (+6, -10)
- `packages/app/src/context/global-sync/session-load.ts` (+22, -14)
- `packages/app/src/context/global-sync/types.ts` (+8, -19)
- `packages/app/src/context/global-sync/utils.test.ts` (+104, -23)
- `packages/app/src/context/global-sync/utils.ts` (+146, -26)
- `packages/app/src/context/layout.tsx` (+7, -1)
- `packages/app/src/context/permission.tsx` (+28, -15)
- `packages/app/src/context/server-sdk.test.ts` (+37, -1)
- `packages/app/src/context/server-sdk.tsx` (+143, -51)
- `packages/app/src/context/server-session-v2-reducer.test.ts` (+156, -0)
- `packages/app/src/context/server-session-v2-reducer.ts` (+502, -0)
- `packages/app/src/context/server-session.test.ts` (+162, -0)
- `packages/app/src/context/server-session.ts` (+267, -38)
- `packages/app/src/context/server-sync.test.ts` (+139, -30)
- `packages/app/src/context/server-sync.tsx` (+232, -39)
- `packages/app/src/pages/home-session-archive.test.ts` (+2, -2)
- `packages/app/src/pages/home-session-archive.ts` (+2, -12)
- `packages/app/src/pages/home.tsx` (+35, -1911)
- `packages/app/src/pages/home/home-controller.ts` (+108, -0)
- `packages/app/src/pages/home/home-projects-controller.tsx` (+128, -0)
- `packages/app/src/pages/home/home-projects-view.tsx` (+615, -0)
- `packages/app/src/pages/home/home-projects.tsx` (+40, -0)
- `packages/app/src/pages/home/home-scroll-controller.ts` (+145, -0)
- `packages/app/src/pages/home/home-session-search-controller.ts` (+114, -0)
- `packages/app/src/pages/home/home-sessions-controller.tsx` (+314, -0)
- `packages/app/src/pages/home/home-sessions-view.tsx` (+550, -0)
- `packages/app/src/pages/home/home-sessions.tsx` (+48, -0)
- `packages/app/src/pages/home/legacy-home.tsx` (+142, -0)
- `packages/app/src/pages/layout.tsx` (+30, -33)
- `packages/app/src/pages/layout/session-tab-avatar.tsx` (+20, -2)
- `packages/app/src/pages/session.tsx` (+21, -59)
- `packages/app/src/pages/session/composer/session-composer-controls.ts` (+2, -1)
- `packages/app/src/pages/session/composer/session-composer-state.ts` (+1, -1)
- `packages/app/src/pages/session/composer/session-question-dock.tsx` (+3, -2)
- `packages/app/src/pages/session/timeline/message-timeline.tsx` (+13, -5)
- `packages/app/src/pages/session/timeline/projection.ts` (+13, -43)
- `packages/app/src/pages/session/timeline/rows-current.test.ts` (+134, -0)
- `packages/app/src/pages/session/timeline/rows.ts` (+57, -0)
- `packages/app/src/pages/session/use-session-commands.tsx` (+10, -11)
- `packages/app/src/utils/server-compat.test.ts` (+149, -0)
- `packages/app/src/utils/server-compat.ts` (+504, -0)
- `packages/app/src/utils/server-health.test.ts` (+34, -4)
- `packages/app/src/utils/server-health.ts` (+23, -5)
- `packages/app/src/utils/server-protocol.test.ts` (+40, -0)
- `packages/app/src/utils/server-protocol.ts` (+35, -0)
- `packages/app/src/utils/server.ts` (+21, -0)
- `packages/app/src/utils/session-message.test.ts` (+198, -0)
- `packages/app/src/utils/session-message.ts` (+348, -0)
- `packages/app/src/utils/session.test.ts` (+94, -0)
- `packages/app/src/utils/session.ts` (+37, -0)
- `packages/app/test-browser/command-palette.test.ts` (+8, -6)
- `packages/app/vendor/opencode-ai-client-1.17.13.tgz` (+-, --)
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
- `packages/console/app/src/routes/go/index.tsx` (+2, -0)
- `packages/console/app/src/routes/workspace/[id]/go/lite-section.tsx` (+1, -0)
- `packages/desktop/src/main/server.ts` (+12, -11)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/provider/transform.ts` (+53, -26)
- `packages/opencode/test/provider/transform.test.ts` (+131, -0)
- `packages/opencode/test/session/llm.test.ts` (+111, -0)
- `packages/session-ui/package.json` (+1, -0)
- `packages/session-ui/src/components/message-part.tsx` (+7, -5)
- `packages/session-ui/src/components/tool-error-card.tsx` (+2, -0)
- `packages/web/src/content/docs/ar/go.mdx` (+5, -0)
- `packages/web/src/content/docs/ar/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/bs/go.mdx` (+5, -0)
- `packages/web/src/content/docs/bs/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/da/go.mdx` (+5, -0)
- `packages/web/src/content/docs/da/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/de/go.mdx` (+5, -0)
- `packages/web/src/content/docs/de/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/es/go.mdx` (+5, -0)
- `packages/web/src/content/docs/es/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/fr/go.mdx` (+5, -0)
- `packages/web/src/content/docs/fr/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/go.mdx` (+5, -0)
- `packages/web/src/content/docs/it/go.mdx` (+5, -0)
- `packages/web/src/content/docs/it/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/ja/go.mdx` (+5, -0)
- `packages/web/src/content/docs/ja/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/ko/go.mdx` (+5, -0)
- `packages/web/src/content/docs/ko/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/nb/go.mdx` (+5, -0)
- `packages/web/src/content/docs/nb/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/pl/go.mdx` (+5, -0)
- `packages/web/src/content/docs/pl/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/pt-br/go.mdx` (+5, -0)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/ru/go.mdx` (+5, -0)
- `packages/web/src/content/docs/ru/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/th/go.mdx` (+5, -0)
- `packages/web/src/content/docs/th/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/tr/go.mdx` (+5, -0)
- `packages/web/src/content/docs/tr/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+5, -0)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+4, -0)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+5, -0)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+4, -0)
- `patches/@ai-sdk%2Fmistral@3.0.51.patch` (+709, -0)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 17708d2..761bee1 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -72,7 +72,7 @@
     "@ai-sdk/google": "3.0.73",
     "@ai-sdk/google-vertex": "4.0.128",
     "@ai-sdk/groq": "3.0.31",
-    "@ai-sdk/mistral": "3.0.27",
+    "@ai-sdk/mistral": "3.0.51",
     "@ai-sdk/openai": "3.0.84",
     "@ai-sdk/openai-compatible": "2.0.41",
     "@ai-sdk/perplexity": "3.0.26",
```

#### packages/core/test/provider-mistral.test.ts
```diff
diff --git a/packages/core/test/provider-mistral.test.ts b/packages/core/test/provider-mistral.test.ts
new file mode 100644
index 0000000..6e31766
--- /dev/null
+++ b/packages/core/test/provider-mistral.test.ts
@@ -0,0 +1,282 @@
+import { createMistral } from "@ai-sdk/mistral"
+import { expect, test } from "bun:test"
+
+test("Mistral sends promptCacheKey as prompt_cache_key", async () => {
+  let body: Record<string, unknown> | undefined
+  const mockFetch = Object.assign(
+    async (_input: Parameters<typeof fetch>[0], init?: RequestInit) => {
+      body = JSON.parse(String(init?.body))
+      return Response.json({
+        id: "response-1",
+        created: 0,
+        model: "mistral-large-latest",
+        object: "chat.completion",
+        choices: [{ index: 0, message: { role: "assistant", content: "Hello" }, finish_reason: "stop" }],
+        usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
+      })
+    },
+    { preconnect: fetch.preconnect },
+  )
+  const model = createMistral({ apiKey: "test", fetch: mockFetch })("mistral-large-latest")
+
+  await model.doGenerate({
+    prompt: [{ role: "user", content: [{ type: "text", text: "Hello" }] }],
+    providerOptions: { mistral: { promptCacheKey: "session-123" } },
+  })
+
+  expect(body?.prompt_cache_key).toBe("session-123")
+})
+
+test("Mistral round-trips native reasoning in assistant history", async () => {
+  let body: { messages?: unknown[] } | undefined
+  const mockFetch = Object.assign(
+    async (_input: Parameters<typeof fetch>[0], init?: RequestInit) => {
+      body = JSON.parse(String(init?.body))
+      return Response.json({
+        id: "response-1",
+        created: 0,
+        model: "mistral-small-latest",
+        object: "chat.completion",
+        choices: [
+          {
+            index: 0,
+            message: {
+              role: "assistant",
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/agent.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/kilocode/agent/index.ts
- `src/core/` - review core changes from packages/core/migration/20260127222353_familiar_lady_ursula/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260127222353_familiar_lady_ursula/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260211171708_add_project_commands/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260211171708_add_project_commands/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260213144116_wakeful_the_professor/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260213144116_wakeful_the_professor/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260225215848_workspace/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260225215848_workspace/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260227213759_add_session_workspace_id/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260227213759_add_session_workspace_id/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260228203230_blue_harpoon/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260228203230_blue_harpoon/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260303231226_add_workspace_fields/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260303231226_add_workspace_fields/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260309230000_move_org_to_state/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260309230000_move_org_to_state/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260312043431_session_message_cursor/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260312043431_session_message_cursor/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260323234822_events/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260323234822_events/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260410174513_workspace-name/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260410174513_workspace-name/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260413175956_chief_energizer/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260413175956_chief_energizer/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260423070820_add_icon_url_override/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260423070820_add_icon_url_override/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260427172553_slow_nightmare/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260427172553_slow_nightmare/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260428004200_add_session_path/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260428004200_add_session_path/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260501142318_next_venus/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260501142318_next_venus/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260504145000_add_sync_owner/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260504145000_add_sync_owner/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260507164347_add_workspace_time/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260507164347_add_workspace_time/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260510033149_session_usage/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260510033149_session_usage/snapshot.json
- `src/core/` - review core changes from packages/core/migration/20260511000411_data_migration_state/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260511000411_data_migration_state/snapshot.json
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
- `src/core/` - review core changes from packages/core/migration/20260611035744_credential/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260714141136_session-message-legacy-writer-compat/migration.sql
- `src/core/` - review core changes from packages/core/migration/20260714141136_session-message-legacy-writer-compat/snapshot.json
- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/script/migration.ts
- `src/core/` - review core changes from packages/core/src/catalog.ts
- `src/core/` - review core changes from packages/core/src/connector.ts
- `src/core/` - review core changes from packages/core/src/connector/schema.ts
- `src/core/` - review core changes from packages/core/src/credential.ts
- `src/core/` - review core changes from packages/core/src/credential/sql.ts
- `src/core/` - review core changes from packages/core/src/database/database.ts
- `src/core/` - review core changes from packages/core/src/database/migration.gen.ts
- `src/core/` - review core changes from packages/core/src/database/migration.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260611192811_lush_chimera.ts
- `src/core/` - review core changes from packages/core/src/database/migration/20260612174303_project_dir_strategy.ts
- `src/core/` - review core changes from packages/core/src/database/schema.gen.ts
- `src/core/` - review core changes from packages/core/src/effect/layer-node.ts
- `src/core/` - review core changes from packages/core/src/integration.ts
- `src/core/` - review core changes from packages/core/src/integration/connection.ts
- `src/core/` - review core changes from packages/core/src/integration/schema.ts
- `src/core/` - review core changes from packages/core/src/kilocode/credential-migration.ts
- `src/core/` - review core changes from packages/core/src/location-layer.ts
- `src/core/` - review core changes from packages/core/src/plugin/boot.ts
- `src/core/` - review core changes from packages/core/src/plugin/models-dev.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/openai-auth.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/openai.ts
- `src/core/` - review core changes from packages/core/src/plugin/provider/snowflake-cortex.ts
- `src/core/` - review core changes from packages/core/src/project.ts
- `src/core/` - review core changes from packages/core/src/project/copy-strategies.ts
- `src/core/` - review core changes from packages/core/src/project/copy.ts
- `src/core/` - review core changes from packages/core/src/project/directories.ts
- `src/core/` - review core changes from packages/core/src/project/schema.ts
- `src/core/` - review core changes from packages/core/src/project/sql.ts
- `src/core/` - review core changes from packages/core/src/ripgrep.ts
- `src/core/` - review core changes from packages/core/src/ripgrep/binary.ts
- `src/core/` - review core changes from packages/core/src/v1/config/provider.ts
- `src/core/` - review core changes from packages/core/src/v1/session.ts
- `src/core/` - review core changes from packages/core/test/catalog.test.ts
- `src/core/` - review core changes from packages/core/test/connector.test.ts
- `src/core/` - review core changes from packages/core/test/credential.test.ts
- `src/core/` - review core changes from packages/core/test/database-migration.test.ts
- `src/core/` - review core changes from packages/core/test/integration.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/account-auth-v2-migration.test.ts
- `src/core/` - review core changes from packages/core/test/kilocode/integration-settlement.test.ts
- `src/core/` - review core changes from packages/core/test/location-layer.test.ts
- `src/core/` - review core changes from packages/core/test/move-session.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/models-dev.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-azure.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-cloudflare-workers-ai.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-gitlab.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-helper.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-openai.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-snowflake-cortex.test.ts
- `src/core/` - review core changes from packages/core/test/project-copy.test.ts
- `src/core/` - review core changes from packages/core/test/project-directories.test.ts
- `src/core/` - review core changes from packages/core/test/project.test.ts
- `src/core/` - review core changes from packages/core/{migration/20260611035744_credential/snapshot.json => schema.json}
- `src/tool/notify-user.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/notify-user.test.ts changes
- `src/tool/notify-user.ts` - update based on kilocode packages/opencode/src/kilocode/tool/notify-user.ts changes
- `src/tool/notify-user.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/notify-user.txt changes
- `src/tool/recall.ts` - update based on kilocode packages/opencode/src/tool/recall.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/kilocode/tool/registry.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
