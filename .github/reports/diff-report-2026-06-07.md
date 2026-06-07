# Upstream Changes Report
Generated: 2026-06-07 08:56:54

## Summary
- kilocode: 0 commits, 0 files changed
- opencode: 31 commits, 528 files changed

## kilocode Changes (1181567b2..1181567b2)

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

## opencode Changes (1399323..e82542b)

### Commits

- e82542b - fix(desktop): disable hidden agent cycling (#31207) (Luke Parker, 2026-06-07)
- 2006259 - fix(desktop): style home session scrollbar (#31202) (Luke Parker, 2026-06-07)
- 472b331 - chore: generate (opencode-agent[bot], 2026-06-07)
- 2181472 - feat(desktop): open attachments in active project (#31192) (Luke Parker, 2026-06-07)
- a29deb1 - fix(app): refresh directory MCP status (#31194) (Luke Parker, 2026-06-07)
- f240497 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-07)
- 21a644f - chore: generate (opencode-agent[bot], 2026-06-07)
- 106f8e9 - refactor(tui): extract standalone package (#31193) (Dax, 2026-06-07)
- 7a2c49e - chore: generate (opencode-agent[bot], 2026-06-07)
- 9b4d5b0 - feat(desktop): make updates persistent and responsive (#31191) (Luke Parker, 2026-06-07)
- f20655b - fix(tui): sort connect providers alphabetically (#30891) (Robert Douglass, 2026-06-07)
- 31c099b - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-07)
- 155e1f2 - chore: generate (opencode-agent[bot], 2026-06-07)
- fe0c4f8 - refactor(server): canonicalize service API (#31049) (Dax, 2026-06-07)
- 53ff1b5 - fix(core): preserve session failure causes (Kit Langton, 2026-06-06)
- 1025540 - test(core): cover managed output read permissions (#31166) (Kit Langton, 2026-06-07)
- eb9a683 - fix(core): harden unified tool runtime (#31171) (Kit Langton, 2026-06-06)
- 48c26fa - fix(test): release Windows search handles (#31172) (Kit Langton, 2026-06-07)
- 10d1e04 - fix(core): isolate image normalization (#31165) (Kit Langton, 2026-06-06)
- 12acb9a - docs(v2): update permission rule naming (#31167) (Kit Langton, 2026-06-06)
- 807c804 - fix(core): use static tool type imports (#31170) (Kit Langton, 2026-06-06)
- 660a00d - refactor(core): unify v2 tool architecture (#31168) (Kit Langton, 2026-06-06)
- effd27b - chore(http-recorder): disable release automation (#31160) (Kit Langton, 2026-06-06)
- 06d7840 - docs: fix MCP header interpolation example to {env:VAR} (#31078) (fancivez, 2026-06-06)
- 0875203 - test: fix tool test (#31163) (Aiden Cline, 2026-06-06)
- b9131aa - fix: background agent prompting, lets kill this sleep behavior oml (#31162) (Aiden Cline, 2026-06-06)
- 4519a1d - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-06)
- 77963d8 - chore: generate (opencode-agent[bot], 2026-06-06)
- 7d3d80f - feat(opencode): fff search tools (#27802) (Dmitriy Kovalenko, 2026-06-06)
- 4814ab3 - fix(core): enforce V2 tool permissions (#31061) (Kit Langton, 2026-06-06)
- 747b8da - fix(core): bound prompt cache session keys (#31062) (Kit Langton, 2026-06-06)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/core/src/tool/AGENTS.md` (+36, -116)
- `packages/core/src/tool/application-tools.ts` (+19, -12)
- `packages/core/src/tool/apply-patch.ts` (+126, -115)
- `packages/core/src/tool/bash.ts` (+96, -97)
- `packages/core/src/tool/builtins.ts` (+3, -3)
- `packages/core/src/tool/edit.ts` (+110, -86)
- `packages/core/src/tool/glob.ts` (+39, -42)
- `packages/core/src/tool/grep.ts` (+49, -46)
- `packages/core/src/tool/native.ts` (+0, -73)
- `packages/core/src/tool/question.ts` (+43, -33)
- `packages/core/src/tool/read.ts` (+55, -197)
- `packages/core/src/tool/registry.ts` (+96, -189)
- `packages/core/src/tool/skill.ts` (+48, -52)
- `packages/core/src/tool/todowrite.ts` (+36, -32)
- `packages/core/src/tool/tool.ts` (+145, -0)
- `packages/core/src/tool/tools.ts` (+13, -0)
- `packages/core/src/tool/webfetch.ts` (+70, -78)
- `packages/core/src/tool/websearch.ts` (+66, -79)
- `packages/core/src/tool/write.ts` (+51, -35)
- `packages/opencode/src/tool/glob.ts` (+15, -34)
- `packages/opencode/src/tool/glob.txt` (+1, -1)
- `packages/opencode/src/tool/grep.ts` (+19, -33)
- `packages/opencode/src/tool/grep.txt` (+1, -1)
- `packages/opencode/src/tool/read.ts` (+4, -1)
- `packages/opencode/src/tool/registry.ts` (+3, -3)
- `packages/opencode/src/tool/skill.ts` (+3, -3)
- `packages/opencode/src/tool/task.ts` (+4, -3)
- `packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap` (+1, -1)
- `packages/opencode/test/tool/glob.test.ts` (+5, -3)
- `packages/opencode/test/tool/grep.test.ts` (+2, -2)
- `packages/opencode/test/tool/read.test.ts` (+2, -0)
- `packages/opencode/test/tool/registry.test.ts` (+2, -2)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+6, -0)
- `packages/core/src/agent.ts` (+2, -5)
- `packages/core/src/catalog.ts` (+1, -1)
- `packages/core/src/command.ts` (+2, -0)
- `packages/core/src/control-plane/move-session.ts` (+2, -0)
- `packages/core/src/filesystem/fff.bun.ts` (+136, -0)
- `packages/core/src/filesystem/fff.node.ts` (+138, -0)
- `packages/core/src/filesystem/search.ts` (+553, -0)
- `packages/core/src/image.ts` (+72, -0)
- `packages/core/src/image/photon.ts` (+94, -0)
- `packages/core/src/instruction-context.ts` (+1, -1)
- `packages/core/src/location-layer.ts` (+15, -3)
- `packages/core/src/plugin/skill/customize-opencode.md` (+4, -2)
- `packages/core/src/public/opencode.ts` (+2, -2)
- `packages/core/src/public/tool.ts` (+6, -6)
- `packages/core/src/session.ts` (+8, -18)
- `packages/core/src/session/execution/local.ts` (+4, -5)
- `packages/core/src/session/logging.ts` (+8, -0)
- `packages/core/src/session/run-coordinator.ts` (+2, -5)
- `packages/core/src/session/runner/index.ts` (+2, -0)
- `packages/core/src/session/runner/llm.ts` (+23, -15)
- `packages/core/src/session/runner/publish-llm-event.ts` (+6, -0)
- `packages/core/src/session/store.ts` (+2, -0)
- `packages/core/src/state.ts` (+36, -19)
- `packages/core/src/system-context/builtins.ts` (+1, -1)
- `packages/core/src/system-context/registry.ts` (+12, -12)
- `packages/core/src/tool-output-store.ts` (+47, -72)
- `packages/core/src/util/log.ts` (+3, -0)
- `packages/core/test/agent.test.ts` (+1, -1)
- `packages/core/test/application-tools.test.ts` (+147, -45)
- `packages/core/test/config/config.test.ts` (+2, -0)
- `packages/core/test/filesystem/search.test.ts` (+153, -0)
- `packages/core/test/lib/tool.ts` (+20, -0)
- `packages/core/test/location-layer.test.ts` (+5, -4)
- `packages/core/test/permission.test.ts` (+15, -0)
- `packages/core/test/plugin.test.ts` (+1, -1)
- `packages/core/test/public-opencode.test.ts` (+3, -3)
- `packages/core/test/public-tool.test.ts` (+13, -0)
- `packages/core/test/session-logging.test.ts` (+30, -0)
- `packages/core/test/session-runner-tool-registry.test.ts` (+387, -171)
- `packages/core/test/session-runner.test.ts` (+92, -57)
- `packages/core/test/state.test.ts` (+34, -0)
- `packages/core/test/system-context/registry.test.ts` (+19, -19)
- `packages/core/test/tool-apply-patch.test.ts` (+33, -22)
- `packages/core/test/tool-bash.test.ts` (+28, -44)
- `packages/core/test/tool-edit.test.ts` (+27, -18)
- `packages/core/test/tool-glob.test.ts` (+12, -8)
- `packages/core/test/tool-grep.test.ts` (+17, -11)
- `packages/core/test/tool-output-store.test.ts` (+134, -45)
- `packages/core/test/tool-question.test.ts` (+50, -14)
- `packages/core/test/tool-read.test.ts` (+132, -36)
- `packages/core/test/tool-skill.test.ts` (+17, -37)
- `packages/core/test/tool-todowrite.test.ts` (+10, -6)
- `packages/core/test/tool-webfetch.test.ts` (+32, -67)
- `packages/core/test/tool-websearch.test.ts` (+17, -61)
- `packages/core/test/tool-write.test.ts` (+27, -13)

#### Other Changes
- `.changeset/brave-cassettes-record.md` (+0, -5)
- `.changeset/config.json` (+0, -11)
- `.github/workflows/http-recorder-release.yml` (+0, -53)
- `bun.lock` (+77, -178)
- `bunfig.toml` (+1, -1)
- `nix/hashes.json` (+4, -4)
- `package.json` (+0, -4)
- `packages/app/package.json` (+1, -0)
- `packages/app/src/app.tsx` (+0, -1)
- `packages/app/src/components/dialog-select-mcp.tsx` (+2, -22)
- `packages/app/src/components/directory-picker-policy.ts` (+7, -0)
- `packages/app/src/components/directory-picker.test.ts` (+21, -0)
- `packages/app/src/components/directory-picker.tsx` (+29, -0)
- `packages/app/src/components/prompt-input.tsx` (+22, -13)
- `packages/app/src/components/prompt-input/attachments.test.ts` (+65, -1)
- `packages/app/src/components/prompt-input/files.ts` (+32, -0)
- `packages/app/src/components/settings-general.tsx` (+4, -74)
- `packages/app/src/components/settings-v2/general.tsx` (+4, -74)
- `packages/app/src/components/status-popover-body.tsx` (+2, -36)
- `packages/app/src/components/updater-action.test.ts` (+26, -0)
- `packages/app/src/components/updater-action.ts` (+51, -0)
- `packages/app/src/context/directory-sync.ts` (+3, -0)
- `packages/app/src/context/global-sync/mcp.test.ts` (+34, -0)
- `packages/app/src/context/global-sync/mcp.ts` (+18, -0)
- `packages/app/src/context/mcp.ts` (+19, -0)
- `packages/app/src/context/platform.tsx` (+27, -20)
- `packages/app/src/context/server-sync.tsx` (+23, -0)
- `packages/app/src/context/settings.tsx` (+0, -12)
- `packages/app/src/i18n/en.ts` (+2, -0)
- `packages/app/src/index.ts` (+1, -0)
- `packages/app/src/pages/error.tsx` (+24, -26)
- `packages/app/src/pages/home.tsx` (+20, -30)
- `packages/app/src/pages/layout.tsx` (+14, -37)
- `packages/app/src/pages/layout/update.test.ts` (+0, -19)
- `packages/app/src/pages/layout/update.ts` (+0, -10)
- `packages/app/src/pages/session/use-session-commands.tsx` (+2, -0)
- `packages/app/src/updater.ts` (+17, -0)
- `packages/cli/bunfig.toml` (+1, -0)
- `packages/cli/package.json` (+5, -1)
- `packages/cli/script/build.ts` (+19, -1)
- `packages/cli/src/commands/handlers/default.ts` (+13, -0)
- `packages/cli/src/commands/handlers/serve.ts` (+2, -0)
- `packages/cli/src/framework/runtime.ts` (+10, -10)
- `packages/cli/src/index.ts` (+1, -0)
- `packages/cli/src/services/daemon.ts` (+22, -10)
- `packages/cli/src/tui.ts` (+36, -0)
- `packages/cli/tsconfig.json` (+2, -0)
- `packages/desktop/src/main/attachment-picker.test.ts` (+87, -0)
- `packages/desktop/src/main/attachment-picker.ts` (+56, -0)
- `packages/desktop/src/main/index.ts` (+16, -15)
- `packages/desktop/src/main/ipc.ts` (+52, -14)
- `packages/desktop/src/main/updater-controller.test.ts` (+111, -0)
- `packages/desktop/src/main/updater-controller.ts` (+97, -0)
- `packages/desktop/src/main/updater-subscriptions.test.ts` (+16, -0)
- `packages/desktop/src/main/updater-subscriptions.ts` (+20, -0)
- `packages/desktop/src/main/updater.ts` (+29, -93)
- `packages/desktop/src/preload/index.ts` (+31, -4)
- `packages/desktop/src/preload/types.ts` (+10, -10)
- `packages/desktop/src/renderer/index.tsx` (+20, -15)
- `packages/desktop/src/renderer/updater.ts` (+0, -12)
- `packages/http-recorder/script/publish.ts` (+0, -26)
- `packages/opencode/package.json` (+1, -2)
- `packages/opencode/parsers-config.ts` (+1, -386)
- `packages/opencode/script/bench-search.ts` (+115, -0)
- `packages/opencode/script/build.ts` (+1, -1)
- `packages/opencode/script/schema.ts` (+2, -2)
- `packages/opencode/script/trace-imports.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/{tui => }/attach.ts` (+40, -46)
- `packages/opencode/src/cli/cmd/debug/file.ts` (+2, -2)
- `packages/opencode/src/cli/cmd/debug/ripgrep.ts` (+5, -5)
- `packages/opencode/src/cli/cmd/prompt-display.ts` (+1, -48)
- `packages/opencode/src/cli/cmd/run/footer.prompt.tsx` (+1, -1)
- `packages/opencode/src/cli/cmd/run/footer.subagent.tsx` (+1, -1)
- `packages/opencode/src/cli/cmd/run/footer.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/run/footer.view.tsx` (+2, -2)
- `packages/opencode/src/cli/cmd/run/runtime.boot.ts` (+3, -11)
- `packages/opencode/src/cli/cmd/run/runtime.lifecycle.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/run/theme.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/run/types.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/{tui/thread.ts => tui.ts}` (+40, -40)
- `packages/opencode/src/cli/cmd/tui/component/prompt/frecency.tsx` (+0, -90)
- `packages/opencode/src/cli/cmd/tui/component/prompt/part.ts` (+0, -31)
- `packages/opencode/src/cli/cmd/tui/component/prompt/stash.tsx` (+0, -101)
- `packages/opencode/src/cli/cmd/tui/config/tui-schema.ts` (+0, -88)
- `packages/opencode/src/cli/cmd/tui/context/exit.tsx` (+0, -42)
- `packages/opencode/src/cli/cmd/tui/context/tui-config.tsx` (+0, -9)
- `packages/opencode/src/cli/cmd/tui/layer.ts` (+0, -6)
- `packages/opencode/src/cli/cmd/tui/plugin/internal.ts` (+0, -42)
- `packages/opencode/src/cli/cmd/tui/plugin/slots.tsx` (+0, -60)
- `packages/opencode/src/cli/cmd/tui/util/clipboard.ts` (+0, -181)
- `packages/opencode/src/cli/cmd/tui/util/editor.ts` (+0, -43)
- `packages/opencode/src/cli/logo.ts` (+1, -11)
- `packages/opencode/src/cli/tui/layer.ts` (+7, -0)
- `packages/opencode/src/cli/{cmd => }/tui/validate-session.ts` (+0, -0)
- `packages/opencode/src/cli/{cmd => }/tui/worker.ts` (+0, -0)
- `packages/opencode/src/{cli/cmd/tui/config/cwd.ts => config/tui-cwd.ts}` (+0, -0)
- `packages/opencode/src/config/tui-host-attention.ts` (+21, -0)
- `packages/opencode/src/{cli/cmd/tui => }/config/tui-migrate.ts` (+4, -4)
- `packages/opencode/src/{cli/cmd/tui => }/config/tui.ts` (+37, -53)
- `packages/opencode/src/effect/app-runtime.ts` (+2, -0)
- `packages/opencode/src/index.ts` (+2, -2)
- `packages/opencode/src/mcp/index.ts` (+1, -1)
- `packages/opencode/src/plugin/tui/internal.ts` (+12, -0)
- `packages/opencode/src/{cli/cmd/tui/plugin => plugin/tui}/runtime.ts` (+65, -22)
- `packages/opencode/src/project/bootstrap.ts` (+13, -0)
- `packages/opencode/src/server/routes/instance/httpapi/api.ts` (+4, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/reference.ts` (+60, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/tui.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/file.ts` (+11, -2)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/reference.ts` (+27, -0)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/tui.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/authorization.ts` (+4, -1)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+12, -8)
- `packages/opencode/src/{cli/cmd/tui/event.ts => server/tui-event.ts}` (+0, -0)
- `packages/opencode/src/session/session.ts` (+2, -0)
- `packages/opencode/src/temporary.ts` (+1, -1)
- `packages/opencode/src/util/error.ts` (+1, -88)
- `packages/opencode/src/util/locale.ts` (+2, -86)
- `packages/opencode/src/util/record.ts` (+1, -3)
- `packages/opencode/test/cli/cmd/tui/attention.test.ts` (+2, -2)
- `packages/opencode/test/cli/cmd/tui/prompt-history.test.ts` (+0, -44)
- `packages/opencode/test/cli/cmd/tui/prompt-part.test.ts` (+0, -77)
- `packages/opencode/test/cli/run/footer.view.test.tsx` (+1, -1)
- `packages/opencode/test/cli/run/prompt.shared.test.ts` (+0, -32)
- `packages/opencode/test/cli/run/runtime.boot.test.ts` (+2, -1)
- `packages/opencode/test/cli/tui/app-lifecycle.test.ts` (+0, -261)
- `packages/opencode/test/cli/tui/attach.test.ts` (+11, -0)
- `packages/opencode/test/cli/tui/editor-context-zed.test.ts` (+1, -6)
- `packages/opencode/test/cli/tui/editor-context.test.tsx` (+13, -4)
- `packages/opencode/test/cli/tui/plugin-add.test.ts` (+2, -2)
- `packages/opencode/test/cli/tui/plugin-install.test.ts` (+2, -2)
- `packages/opencode/test/cli/tui/plugin-lifecycle.test.ts` (+1, -1)
- `packages/opencode/test/cli/tui/plugin-loader-entrypoint.test.ts` (+2, -2)
- `packages/opencode/test/cli/tui/plugin-loader-pure.test.ts` (+2, -2)
- `packages/opencode/test/cli/tui/plugin-loader.test.ts` (+3, -3)
- `packages/opencode/test/cli/tui/plugin-toggle.test.ts` (+2, -2)
- `packages/opencode/test/cli/tui/thread.test.ts` (+9, -1)
- `packages/opencode/test/config/tui.test.ts` (+14, -6)
- `packages/opencode/test/fixture/tui-environment.tsx` (+32, -0)
- `packages/opencode/test/fixture/tui-plugin.ts` (+1, -1)
- `packages/opencode/test/fixture/tui-runtime.ts` (+17, -25)
- `packages/opencode/test/fixture/tui-sdk.ts` (+1, -1)
- `packages/opencode/test/preload.ts` (+5, -1)
- `packages/opencode/test/server/httpapi-authorization.test.ts` (+6, -6)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+13, -10)
- `packages/opencode/test/server/httpapi-public-openapi.test.ts` (+9, -9)
- `packages/opencode/test/server/httpapi-query-schema-drift.test.ts` (+2, -2)
- `packages/opencode/test/server/httpapi-reference.test.ts` (+56, -0)
- `packages/opencode/test/server/httpapi-sdk.test.ts` (+1, -1)
- `packages/opencode/test/server/httpapi-session.test.ts` (+4, -4)
- `packages/opencode/test/session/compaction.test.ts` (+2, -0)
- `packages/opencode/test/session/prompt.test.ts` (+4, -2)
- `packages/opencode/test/session/snapshot-tool-race.test.ts` (+2, -2)
- `packages/opencode/test/util/error.test.ts` (+0, -48)
- `packages/opencode/tsconfig.json` (+0, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+70, -31)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+109, -61)
- `packages/sdk/openapi.json` (+359, -194)
- `packages/server/src/api.ts` (+16, -17)
- `packages/server/src/groups/{v2 => }/agent.ts` (+6, -8)
- `packages/server/src/groups/{v2 => }/command.ts` (+8, -10)
- `packages/server/src/groups/{v2 => }/event.ts` (+7, -9)
- `packages/server/src/groups/{v2 => }/fs.ts` (+7, -9)
- `packages/server/src/groups/health.ts` (+14, -0)
- `packages/server/src/groups/{v2 => }/location.ts` (+9, -25)
- `packages/server/src/groups/{v2 => }/message.ts` (+20, -19)
- `packages/server/src/groups/{v2 => }/model.ts` (+9, -11)
- `packages/server/src/groups/{v2 => }/permission.ts` (+42, -51)
- `packages/server/src/groups/{v2 => }/provider.ts` (+12, -15)
- `packages/server/src/groups/question.ts` (+60, -0)
- `packages/server/src/groups/{v2 => }/session.ts` (+50, -43)
- `packages/server/src/groups/{v2 => }/skill.ts` (+8, -10)
- `packages/server/src/groups/v2/health.ts` (+0, -17)
- `packages/server/src/groups/v2/question.ts` (+0, -60)
- `packages/server/src/handlers.ts` (+32, -48)
- `packages/server/src/handlers/{v2 => }/agent.ts` (+4, -4)
- `packages/server/src/handlers/command.ts` (+9, -0)
- `packages/server/src/handlers/{v2 => }/event.ts` (+3, -3)
- `packages/server/src/handlers/fs.ts` (+13, -0)
- `packages/server/src/handlers/health.ts` (+7, -0)
- `packages/server/src/handlers/{v2 => }/message.ts` (+5, -5)
- `packages/server/src/handlers/{v2 => }/model.ts` (+5, -5)
- `packages/server/src/handlers/permission.ts` (+61, -0)
- `packages/server/src/handlers/{v2 => }/provider.ts` (+6, -6)
- `packages/server/src/handlers/question.ts` (+55, -0)
- `packages/server/src/handlers/{v2 => }/session.ts` (+14, -14)
- `packages/server/src/handlers/skill.ts` (+8, -0)
- `packages/server/src/handlers/v2/command.ts` (+0, -9)
- `packages/server/src/handlers/v2/fs.ts` (+0, -13)
- `packages/server/src/handlers/v2/health.ts` (+0, -7)
- `packages/server/src/handlers/v2/permission.ts` (+0, -106)
- `packages/server/src/handlers/v2/question.ts` (+0, -97)
- `packages/server/src/handlers/v2/skill.ts` (+0, -8)
- `packages/server/src/middleware/authorization.ts` (+7, -10)
- `packages/server/src/middleware/session-location.ts` (+66, -0)
- `packages/server/src/routes.ts` (+6, -10)
- `packages/storybook/.storybook/mocks/app/context/command.ts` (+4, -0)
- `packages/tui/bunfig.toml` (+4, -0)
- `packages/tui/package.json` (+73, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/app.tsx` (+270, -302)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/attention.ts` (+10, -12)
- `packages/tui/src/audio.d.ts` (+9, -0)
- `packages/{opencode/src/cli/cmd/tui/util => tui/src}/audio.ts` (+5, -10)
- `packages/tui/src/clipboard.ts` (+124, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/bg-pulse-render.ts` (+1, -1)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/bg-pulse.tsx` (+1, -1)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/command-palette.tsx` (+3, -3)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-agent.tsx` (+3, -3)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-console-org.tsx` (+5, -5)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-mcp.tsx` (+4, -4)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-model.tsx` (+4, -4)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-move-session.tsx` (+14, -16)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-provider.tsx` (+13, -7)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-retry-action.tsx` (+3, -3)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-session-delete-failed.tsx` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-session-list.tsx` (+7, -7)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-session-rename.tsx` (+3, -3)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-skill.tsx` (+3, -3)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-stash.tsx` (+3, -3)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-status.tsx` (+2, -2)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-tag.tsx` (+4, -4)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-theme-list.tsx` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-variant.tsx` (+3, -3)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-workspace-create.tsx` (+11, -16)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-workspace-file-changes.tsx` (+2, -2)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-workspace-list.tsx` (+7, -7)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/dialog-workspace-unavailable.tsx` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/error-component.tsx` (+10, -12)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/logo.tsx` (+2, -2)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/plugin-route-missing.tsx` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/prompt/autocomplete.tsx` (+59, -62)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/prompt/cwd.ts` (+0, -0)
- `packages/tui/src/component/prompt/frecency.tsx` (+1, -0)
- `packages/tui/src/component/prompt/history.tsx` (+1, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/prompt/index.tsx` (+68, -95)
- `packages/tui/src/component/prompt/local-attachment.ts` (+48, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/prompt/move.tsx` (+8, -7)
- `packages/tui/src/component/prompt/stash.tsx` (+1, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/prompt/workspace.tsx` (+6, -6)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/spinner.tsx` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/startup-loading.tsx` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/todo-item.tsx` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/use-connected.tsx` (+1, -1)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/component/workspace-label.tsx` (+1, -1)
- `packages/tui/src/config/index.tsx` (+129, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/config/keybind.ts` (+2, -4)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/context/aggregate-failures.ts` (+2, -2)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/context/args.tsx` (+0, -0)
- `packages/tui/src/context/clipboard.tsx` (+18, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/context/directory.ts` (+5, -3)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/context/editor.ts` (+33, -94)
- `packages/tui/src/context/epilogue.tsx` (+6, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/context/event.ts` (+0, -3)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/context/helper.tsx` (+1, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/context/kv.tsx` (+12, -22)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/context/local.tsx` (+71, -41)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/context/path-format.tsx` (+11, -10)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/context/project.tsx` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/context/prompt.tsx` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/context/route.tsx` (+15, -7)
- `packages/tui/src/context/runtime.tsx` (+62, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/context/sdk.tsx` (+14, -5)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/context/sync-v2.tsx` (+1, -1)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/context/sync.tsx` (+53, -30)
- `packages/tui/src/context/theme.tsx` (+332, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/context/thinking.ts` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context => tui/src}/editor-zed.ts` (+5, -6)
- `packages/tui/src/editor.ts` (+84, -0)
- `packages/tui/src/feature-plugins/builtins.ts` (+43, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/home/footer.tsx` (+7, -5)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/home/tips-view.tsx` (+6, -7)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/home/tips.tsx` (+2, -2)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/session/dialog.tsx` (+16, -16)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/session/index.tsx` (+2, -2)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/session/preview-pane.tsx` (+5, -5)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/session/util.tsx` (+1, -1)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/sidebar/context.tsx` (+2, -2)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/sidebar/files.tsx` (+3, -3)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/sidebar/footer.tsx` (+7, -5)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/sidebar/lsp.tsx` (+2, -2)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/sidebar/mcp.tsx` (+2, -2)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/sidebar/todo.tsx` (+2, -2)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/system/diff-viewer-file-tree-utils.ts` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/system/diff-viewer-file-tree.tsx` (+2, -2)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/system/diff-viewer-ui.tsx` (+1, -1)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/system/diff-viewer.tsx` (+13, -10)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/system/notifications.ts` (+2, -2)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/system/plugins.tsx` (+3, -3)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/system/session-v2.tsx` (+28, -15)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/feature-plugins/system/which-key.tsx` (+2, -2)
- `packages/tui/src/index.tsx` (+1, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/keymap.tsx` (+29, -22)
- `packages/tui/src/logo.ts` (+11, -0)
- `packages/tui/src/parsers-config.ts` (+386, -0)
- `packages/{opencode/src/cli/cmd/tui/plugin/api.tsx => tui/src/plugin/adapters.tsx}` (+20, -56)
- `packages/tui/src/plugin/api.ts` (+52, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/plugin/command-shim.ts` (+0, -0)
- `packages/tui/src/plugin/runtime.tsx` (+81, -0)
- `packages/tui/src/plugin/slots.tsx` (+65, -0)
- `packages/tui/src/prompt/display.ts` (+48, -0)
- `packages/tui/src/prompt/frecency.tsx` (+80, -0)
- `packages/{opencode/src/cli/cmd/tui/component => tui/src}/prompt/history.tsx` (+28, -34)
- `packages/tui/src/prompt/part.ts` (+29, -0)
- `packages/tui/src/prompt/stash.tsx` (+89, -0)
- `packages/{opencode/src/cli/cmd/tui/component => tui/src}/prompt/traits.ts` (+1, -7)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/routes/home.tsx` (+13, -12)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/routes/home/session-destination.tsx` (+3, -1)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/routes/session/dialog-fork-from-timeline.tsx` (+7, -7)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/routes/session/dialog-message.tsx` (+9, -8)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/routes/session/dialog-subagent.tsx` (+2, -2)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/routes/session/dialog-timeline.tsx` (+3, -3)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/routes/session/footer.tsx` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/routes/session/index.tsx` (+257, -185)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/routes/session/permission.tsx` (+8, -17)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/routes/session/question.tsx` (+2, -2)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/routes/session/sidebar.tsx` (+10, -9)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/routes/session/subagent-footer.tsx` (+5, -5)
- `packages/tui/src/runtime.tsx` (+9, -0)
- `packages/{opencode/src/cli/cmd/tui/win32.ts => tui/src/terminal-win32.ts}` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/aura.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/ayu.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/carbonfox.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/catppuccin-frappe.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/catppuccin-macchiato.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/catppuccin.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/cobalt2.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/cursor.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/dracula.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/everforest.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/flexoki.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/github.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/gruvbox.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/kanagawa.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/lucent-orng.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/material.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/matrix.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/mercury.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/monokai.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/nightowl.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/nord.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/one-dark.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/opencode.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/orng.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/osaka-jade.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/palenight.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/rosepine.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/solarized.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/synthwave84.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/tokyonight.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/vercel.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/vesper.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme => tui/src/theme/assets}/zenburn.json` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui/context/theme.tsx => tui/src/theme/index.ts}` (+114, -364)
- `packages/{opencode/src/cli/cmd/tui/component/border.tsx => tui/src/ui/border.ts}` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/ui/dialog-alert.tsx` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/ui/dialog-confirm.tsx` (+1, -1)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/ui/dialog-export-options.tsx` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/ui/dialog-help.tsx` (+1, -1)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/ui/dialog-prompt.tsx` (+1, -1)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/ui/dialog-select.tsx` (+4, -4)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/ui/dialog.tsx` (+16, -6)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/ui/link.tsx` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/ui/spinner.ts` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/ui/toast.tsx` (+10, -10)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/util/collapse-tool-output.ts` (+0, -0)
- `packages/tui/src/util/error.ts` (+182, -0)
- `packages/tui/src/util/filetype.ts` (+130, -0)
- `packages/{opencode => tui}/src/util/format.ts` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/util/layout.ts` (+0, -0)
- `packages/tui/src/util/locale.ts` (+86, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/util/model.ts` (+5, -0)
- `packages/tui/src/util/path.ts` (+12, -0)
- `packages/tui/src/util/persistence.ts` (+33, -0)
- `packages/tui/src/util/presentation.ts` (+38, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/util/provider-origin.ts` (+0, -0)
- `packages/tui/src/util/record.ts` (+3, -0)
- `packages/tui/src/util/renderer.ts` (+6, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/util/revert-diff.ts` (+0, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/util/scroll.ts` (+6, -4)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/util/selection.ts` (+11, -5)
- `packages/tui/src/util/session.ts` (+3, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/util/signal.ts` (+0, -0)
- `packages/tui/src/util/tool-display.ts` (+13, -0)
- `packages/{opencode/src/cli/cmd/tui => tui/src}/util/transcript.ts` (+1, -1)
- `packages/tui/test/app-lifecycle.test.tsx` (+59, -0)
- `packages/{opencode => tui}/test/cli/cmd/tui/dialog-workspace-create.test.ts` (+1, -1)
- `packages/{opencode => tui}/test/cli/cmd/tui/model-options.test.ts` (+1, -1)
- `packages/{opencode => tui}/test/cli/cmd/tui/notifications.test.ts` (+1, -1)
- `packages/{opencode => tui}/test/cli/cmd/tui/provider-options.test.ts` (+13, -1)
- `packages/{opencode => tui}/test/cli/cmd/tui/sync-fixture.tsx` (+11, -11)
- `packages/{opencode => tui}/test/cli/cmd/tui/sync-live-hydration.test.tsx` (+5, -21)
- `packages/{opencode => tui}/test/cli/cmd/tui/sync-undefined-messages.test.tsx` (+1, -5)
- `packages/{opencode => tui}/test/cli/cmd/tui/sync.test.tsx` (+3, -10)
- `packages/{opencode => tui}/test/cli/tui/__snapshots__/inline-tool-wrap-snapshot.test.tsx.snap` (+0, -0)
- `packages/{opencode => tui}/test/cli/tui/dialog-prompt.test.tsx` (+34, -33)
- `packages/{opencode => tui}/test/cli/tui/diff-viewer-file-tree.test.tsx` (+13, -10)
- `packages/{opencode => tui}/test/cli/tui/diff-viewer.test.tsx` (+19, -24)
- `packages/{opencode => tui}/test/cli/tui/inline-tool-wrap-snapshot.test.tsx` (+45, -1)
- `packages/{opencode => tui}/test/cli/tui/prompt-submit-race.test.ts` (+1, -1)
- `packages/{opencode => tui}/test/cli/tui/sync-v2.test.tsx` (+67, -52)
- `packages/{opencode => tui}/test/cli/tui/thinking.test.ts` (+1, -1)
- `packages/{opencode => tui}/test/cli/tui/use-event.test.tsx` (+19, -16)
- `packages/tui/test/clipboard.test.ts` (+19, -0)
- `packages/tui/test/config.test.tsx` (+121, -0)
- `packages/{opencode/test/cli/cmd/tui => tui/test/context}/aggregate-failures.test.ts` (+9, -7)
- `packages/tui/test/context/local.test.ts` (+22, -0)
- `packages/tui/test/editor.test.ts` (+23, -0)
- `packages/{opencode/test/cli/tui => tui/test/feature-plugins}/diff-viewer-file-tree-utils.test.ts` (+1, -1)
- `packages/tui/test/fixture/fixture.ts` (+13, -0)
- `packages/tui/test/fixture/tui-environment.tsx` (+32, -0)
- `packages/tui/test/fixture/tui-plugin.ts` (+36, -0)
- `packages/tui/test/fixture/tui-runtime.ts` (+12, -0)
- `packages/tui/test/fixture/tui-sdk.ts` (+69, -0)
- `packages/tui/test/index.test.tsx` (+6, -0)
- `packages/{opencode/test/cli/tui => tui/test}/keymap.test.tsx` (+18, -13)
- `packages/tui/test/plugin/runtime.test.ts` (+50, -0)
- `packages/{opencode/test/cli/tui/slot-replace.test.tsx => tui/test/plugin/slots.test.tsx}` (+6, -18)
- `packages/tui/test/prompt/display.test.ts` (+33, -0)
- `packages/tui/test/prompt/history.test.ts` (+39, -0)
- `packages/tui/test/prompt/jsonl.test.ts` (+24, -0)
- `packages/tui/test/prompt/local-attachment.test.ts` (+43, -0)
- `packages/tui/test/prompt/part.test.ts` (+53, -0)
- `packages/tui/test/prompt/persistence.test.ts` (+23, -0)
- `packages/{opencode/test/cli/cmd/tui/prompt-traits.test.ts => tui/test/prompt/traits.test.ts}` (+3, -7)
- `packages/tui/test/runtime.test.tsx` (+37, -0)
- `packages/{opencode/test/cli/tui/theme-store.test.ts => tui/test/theme.test.ts}` (+18, -13)
- `packages/tui/test/util/error.test.ts` (+49, -0)
- `packages/tui/test/util/filetype.test.ts` (+16, -0)
- `packages/{opencode => tui}/test/util/format.test.ts` (+0, -0)
- `packages/tui/test/util/model.test.ts` (+9, -0)
- `packages/tui/test/util/presentation.test.ts` (+8, -0)
- `packages/tui/test/util/renderer.test.ts` (+30, -0)
- `packages/{opencode/test/cli/tui => tui/test/util}/revert-diff.test.ts` (+1, -1)
- `packages/tui/test/util/session.test.ts` (+10, -0)
- `packages/tui/test/util/tool-display.test.ts` (+40, -0)
- `packages/{opencode/test/cli/tui => tui/test/util}/transcript.test.ts` (+1, -6)
- `packages/tui/tsconfig.json` (+10, -0)
- `specs/tui-package.md` (+641, -0)
- `specs/v2/config.md` (+11, -11)
- `specs/v2/tools.md` (+186, -0)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index b0d5f7b..e720d93 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -32,6 +32,11 @@
       "bun": "./src/pty/pty.bun.ts",
       "node": "./src/pty/pty.node.ts",
       "default": "./src/pty/pty.bun.ts"
+    },
+    "#fff": {
+      "bun": "./src/filesystem/fff.bun.ts",
+      "node": "./src/filesystem/fff.node.ts",
+      "default": "./src/filesystem/fff.bun.ts"
     }
   },
   "devDependencies": {
@@ -81,6 +86,7 @@
     "@effect/platform-node": "catalog:",
     "@effect/sql-sqlite-bun": "catalog:",
     "@lydell/node-pty": "catalog:",
+    "@ff-labs/fff-bun": "0.9.3",
     "@npmcli/arborist": "9.4.0",
     "@npmcli/config": "10.8.1",
     "@opencode-ai/effect-drizzle-sqlite": "workspace:*",
```

#### packages/core/src/agent.ts
```diff
diff --git a/packages/core/src/agent.ts b/packages/core/src/agent.ts
index 3e59872..fabf747 100644
--- a/packages/core/src/agent.ts
+++ b/packages/core/src/agent.ts
@@ -63,7 +63,7 @@ export type Editor = {
 
 export interface Interface {
   readonly transform: State.Interface<Data, Editor>["transform"]
-  readonly update: (update: State.Transform<Editor>) => Effect.Effect<void, never, Scope.Scope>
+  readonly update: State.Interface<Data, Editor>["update"]
   readonly get: (id: ID) => Effect.Effect<Info | undefined>
   readonly default: () => Effect.Effect<Info | undefined>
   readonly resolve: (id?: ID | string) => Effect.Effect<Info | undefined>
@@ -113,10 +113,7 @@ export const layer = Layer.effect(
 
     return Service.of({
       transform: state.transform,
-      update: Effect.fn("AgentV2.update")(function* (update) {
-        const transform = yield* state.transform()
-        yield* transform(update)
-      }),
+      update: state.update,
       get: Effect.fn("AgentV2.get")(function* (id) {
         return state.get().agents.get(id)
       }),
```

#### packages/core/src/catalog.ts
```diff
diff --git a/packages/core/src/catalog.ts b/packages/core/src/catalog.ts
index d1ac7ef..c44eec5 100644
--- a/packages/core/src/catalog.ts
+++ b/packages/core/src/catalog.ts
@@ -203,7 +203,7 @@ export const layer = Layer.effect(
           event.location?.directory === location.directory && event.location.workspaceID === location.workspaceID,
       ),
       Stream.runForEach((event) =>
-        state.update((catalog) => plugin.triggerFor(event.data.id, "catalog.transform", catalog, {}), "plugin.added"),
+        state.mutate((catalog) => plugin.triggerFor(event.data.id, "catalog.transform", catalog, {}), "plugin.added"),
       ),
       Effect.forkIn(scope, { startImmediately: true }),
     )
```

#### packages/core/src/command.ts
```diff
diff --git a/packages/core/src/command.ts b/packages/core/src/command.ts
index b9a5ae1..f6b8210 100644
--- a/packages/core/src/command.ts
+++ b/packages/core/src/command.ts
@@ -27,6 +27,7 @@ export type Editor = {
 
 export interface Interface {
   readonly transform: State.Interface<Data, Editor>["transform"]
+  readonly update: State.Interface<Data, Editor>["update"]
   readonly get: (name: string) => Effect.Effect<Info | undefined>
   readonly list: () => Effect.Effect<Info[]>
 }
@@ -54,6 +55,7 @@ export const layer = Layer.effect(
     })
 
     return Service.of({
+      update: state.update,
       transform: state.transform,
       get: Effect.fn("CommandV2.get")(function* (name) {
         return state.get().commands.get(name)
```

#### packages/core/src/control-plane/move-session.ts
```diff
diff --git a/packages/core/src/control-plane/move-session.ts b/packages/core/src/control-plane/move-session.ts
index 9825cbf..0239eec 100644
--- a/packages/core/src/control-plane/move-session.ts
+++ b/packages/core/src/control-plane/move-session.ts
@@ -6,6 +6,7 @@ import { Git } from "../git"
 import { Location } from "../location"
 import { ProjectV2 } from "../project"
 import { SessionV2 } from "../session"
+import { SessionExecution } from "../session/execution"
 import { SessionEvent } from "../session/event"
 import { SessionSchema } from "../session/schema"
 import { AbsolutePath, RelativePath } from "../schema"
@@ -124,5 +125,6 @@ export const defaultLayer = layer.pipe(
   Layer.provide(Git.defaultLayer),
   Layer.provide(EventV2.defaultLayer),
   Layer.provide(ProjectV2.defaultLayer),
+  Layer.provide(SessionExecution.noopLayer),
   Layer.provide(SessionV2.defaultLayer),
 )
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/tool/AGENTS.md.ts` - update based on opencode packages/core/src/tool/AGENTS.md changes
- `src/tool/application-tools.ts` - update based on opencode packages/core/src/tool/application-tools.ts changes
- `src/tool/apply-patch.ts` - update based on opencode packages/core/src/tool/apply-patch.ts changes
- `src/tool/bash.ts` - update based on opencode packages/core/src/tool/bash.ts changes
- `src/tool/builtins.ts` - update based on opencode packages/core/src/tool/builtins.ts changes
- `src/tool/edit.ts` - update based on opencode packages/core/src/tool/edit.ts changes
- `src/tool/glob.test.ts` - update based on opencode packages/opencode/test/tool/glob.test.ts changes
- `src/tool/glob.ts` - update based on opencode packages/core/src/tool/glob.ts changes
- `src/tool/glob.ts` - update based on opencode packages/opencode/src/tool/glob.ts changes
- `src/tool/glob.txt.ts` - update based on opencode packages/opencode/src/tool/glob.txt changes
- `src/tool/grep.test.ts` - update based on opencode packages/opencode/test/tool/grep.test.ts changes
- `src/tool/grep.ts` - update based on opencode packages/core/src/tool/grep.ts changes
- `src/tool/grep.ts` - update based on opencode packages/opencode/src/tool/grep.ts changes
- `src/tool/grep.txt.ts` - update based on opencode packages/opencode/src/tool/grep.txt changes
- `src/tool/native.ts` - update based on opencode packages/core/src/tool/native.ts changes
- `src/tool/parameters.test.ts.snap.ts` - update based on opencode packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap changes
- `src/tool/question.ts` - update based on opencode packages/core/src/tool/question.ts changes
- `src/tool/read.test.ts` - update based on opencode packages/opencode/test/tool/read.test.ts changes
- `src/tool/read.ts` - update based on opencode packages/core/src/tool/read.ts changes
- `src/tool/read.ts` - update based on opencode packages/opencode/src/tool/read.ts changes
- `src/tool/registry.test.ts` - update based on opencode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on opencode packages/core/src/tool/registry.ts changes
- `src/tool/registry.ts` - update based on opencode packages/opencode/src/tool/registry.ts changes
- `src/tool/skill.ts` - update based on opencode packages/core/src/tool/skill.ts changes
- `src/tool/skill.ts` - update based on opencode packages/opencode/src/tool/skill.ts changes
- `src/tool/task.ts` - update based on opencode packages/opencode/src/tool/task.ts changes
- `src/tool/todowrite.ts` - update based on opencode packages/core/src/tool/todowrite.ts changes
- `src/tool/tool.ts` - update based on opencode packages/core/src/tool/tool.ts changes
- `src/tool/tools.ts` - update based on opencode packages/core/src/tool/tools.ts changes
- `src/tool/webfetch.ts` - update based on opencode packages/core/src/tool/webfetch.ts changes
- `src/tool/websearch.ts` - update based on opencode packages/core/src/tool/websearch.ts changes
- `src/tool/write.ts` - update based on opencode packages/core/src/tool/write.ts changes
