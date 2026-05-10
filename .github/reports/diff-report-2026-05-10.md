# Upstream Changes Report
Generated: 2026-05-10 08:09:06

## Summary
- kilocode: 1 commits, 23 files changed
- opencode: 67 commits, 296 files changed

## kilocode Changes (045fa8913..9d37a1aea)

### Commits

- 9d37a1aea - release: v7.2.49 (kilo-maintainer[bot], 2026-05-09)

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

#### Other Changes
- `.changeset/apply-patch-update-encoding.md` (+0, -5)
- `.changeset/read-stream-utf8.md` (+0, -5)
- `bun.lock` (+14, -14)
- `package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-vscode/CHANGELOG.md` (+2, -0)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+8, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `script/upstream/package.json` (+1, -1)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index a008e1085..3fc50a9ce 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.2.48",
+  "version": "7.2.49",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```


## opencode Changes (b2baddc..903d818)

### Commits

- 903d818 - Zen: add Ring 2.6 1T (Frank, 2026-05-10)
- 472f9e6 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-10)
- c04fa9e - sync: revert (Frank, 2026-05-10)
- 3a78fb1 - chore: generate (opencode-agent[bot], 2026-05-10)
- 85ce6a5 - feat: better image handling (auto resize & max size constraints) (#26401) (Aiden Cline, 2026-05-10)
- 5217e6c - chore: generate (opencode-agent[bot], 2026-05-10)
- 3a7f617 - go: add tencent icon (Frank, 2026-05-10)
- d915041 - chore: generate (opencode-agent[bot], 2026-05-10)
- bcbc1db - Go add hy3 preview (#26533) (Jack, 2026-05-10)
- ce3235e - sync (Frank, 2026-05-10)
- a9a2a59 - chore: generate (opencode-agent[bot], 2026-05-10)
- 3753601 - Format TUI paths relative to session directory (#26648) (Dax, 2026-05-10)
- fb4bab8 - Remove redundant ID Zod overrides (#26633) (Kit Langton, 2026-05-09)
- b3526f6 - chore: generate (opencode-agent[bot], 2026-05-10)
- f220f02 - Source workspace path pattern (#26632) (Kit Langton, 2026-05-09)
- 235a86f - chore: generate (opencode-agent[bot], 2026-05-10)
- 67b9c9c - Source HTTP API ID path patterns (#26623) (Kit Langton, 2026-05-09)
- 2f11c9f - sync release versions for v1.14.46 (opencode, 2026-05-10)
- e1c1193 - chore: generate (opencode-agent[bot], 2026-05-10)
- 29250a0 - fix(session): loosen remaining stored numeric schemas to tolerate legacy data (#26622) (Kit Langton, 2026-05-09)
- c6e6bdf - fix(session): tolerate negative token counts in stored parts (#26620) (Kit Langton, 2026-05-09)
- d80e119 - chore: generate (opencode-agent[bot], 2026-05-10)
- 10ea590 - feat(skill): built-in opencode-meta skill (#26617) (Kit Langton, 2026-05-09)
- 79d6b10 - fix(mcp): tolerate output schema ref failures (#26614) (Kit Langton, 2026-05-09)
- 6e78f36 - Narrow HTTP API numeric query overrides (#26618) (Kit Langton, 2026-05-09)
- 16866e1 - Share HTTP API boolean query schema (#26615) (Kit Langton, 2026-05-09)
- 6d130e5 - chore: generate (opencode-agent[bot], 2026-05-10)
- e30d817 - Fix OpenAPI workspace query drift (#26609) (Kit Langton, 2026-05-09)
- 7a79f3a - sync release versions for v1.14.45 (opencode, 2026-05-10)
- b8ca71d - fix(task): subagent inherits parent agent's deny rules (Plan Mode security bypass) (#26597) (Kit Langton, 2026-05-09)
- 6849f96 - refactor(provider): share model status schema (#26595) (Kit Langton, 2026-05-09)
- 00c3248 - fix(config): allow active provider model status (#26592) (Kit Langton, 2026-05-09)
- 818b56d - chore: generate (opencode-agent[bot], 2026-05-09)
- 29b5b24 - fix(tui): aggregate bootstrap request failures (Kit Langton, 2026-05-09)
- 1136317 - fix(sdk): wrap thrown error bodies in Error (Kit Langton, 2026-05-09)
- ba9e4b6 - fix(tool/read): match permission patterns against worktree-relative path (Kit Langton, 2026-05-09)
- bd1029b - test(server): cover HttpApi context inheritance (Kit Langton, 2026-05-09)
- 43b51f0 - fix(httpapi): align runtime query schemas with workspace routing params (#26581) (Kit Langton, 2026-05-09)
- c61ab51 - chore: generate (opencode-agent[bot], 2026-05-09)
- d373c56 - fix(session): accept legacy summary diffs (#26579) (Kit Langton, 2026-05-09)
- 5fa5d87 - chore: generate (opencode-agent[bot], 2026-05-09)
- 805af01 - test(session): regression test for #26574 + mirror loosening on Vcs.FileDiff (#26578) (Kit Langton, 2026-05-09)
- 480aa8b - chore: generate (opencode-agent[bot], 2026-05-09)
- d62442b - fix(sessions): allow optional patch field in diff for migrated sessions (#26574) (OpeOginni, 2026-05-09)
- 8602937 - test(session): cover workspace-routed messages (#26576) (Kit Langton, 2026-05-09)
- 77da433 - fix(session): accept routing params in message list (#26569) (Kit Langton, 2026-05-09)
- ad79f3e - chore: generate (opencode-agent[bot], 2026-05-09)
- 6c2dfd2 - fix(tui): guard messages.data in session.sync against undefined (#26566) (Kit Langton, 2026-05-09)
- 9a8b54f - Plugin command API shim  (#26564) (Sebastian, 2026-05-09)
- dcdbdb2 - Move schema utilities into core (#26565) (Dax, 2026-05-09)
- 5e49029 - fix(provider): isolate plugin model mutations (#26561) (Kit Langton, 2026-05-09)
- 19abada - sync release versions for v1.14.44 (opencode, 2026-05-09)
- 6fea017 - fix(server): defer validation error body change (Kit Langton, 2026-05-09)
- ebe9dcf - fix(server): return validation error bodies (Kit Langton, 2026-05-09)
- 57efec4 - fix(storage): default workspace time migration (#26556) (Kit Langton, 2026-05-09)
- e221448 - sync release versions for v1.14.43 (opencode, 2026-05-09)
- 27fa297 - fix(server): keep provider lists JSON-safe (#26550) (Kit Langton, 2026-05-09)
- b1cd25d - ignore: fix typerrs on dev (#26544) (Aiden Cline, 2026-05-09)
- 780bbb0 - sync release versions for v1.14.42 (opencode, 2026-05-09)
- 817cb07 - fix(acp): include tool image attachments in updates (#25128) (Steffen Deusch, 2026-05-09)
- 347526e - chore: generate (opencode-agent[bot], 2026-05-09)
- 092bc67 - fix(sidebar): fix logic and missleading message #26469 (#26470) (Polo123456789, 2026-05-09)
- b24a4e8 - chore(server): clean up post-Hono-deletion scar tissue (#26542) (Kit Langton, 2026-05-09)
- 3afa622 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-09)
- d01cb7f - chore: generate (opencode-agent[bot], 2026-05-09)
- 28b0359 - research: delete Hono backend (do not merge) (#25667) (Kit Langton, 2026-05-09)
- 32684e7 - test(server): expect null body from HTTP API authorize() with no redirect (#26515) (Kit Langton, 2026-05-09)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/read.ts` (+2, -2)
- `packages/opencode/src/tool/registry.ts` (+1, -1)
- `packages/opencode/src/tool/schema.ts` (+3, -3)
- `packages/opencode/src/tool/shell/prompt.ts` (+1, -1)
- `packages/opencode/src/tool/task.ts` (+11, -26)
- `packages/opencode/test/tool/apply_patch.test.ts` (+1, -1)
- `packages/opencode/test/tool/edit.test.ts` (+1, -1)
- `packages/opencode/test/tool/external-directory.test.ts` (+1, -1)
- `packages/opencode/test/tool/glob.test.ts` (+1, -1)
- `packages/opencode/test/tool/grep.test.ts` (+1, -1)
- `packages/opencode/test/tool/lsp.test.ts` (+1, -1)
- `packages/opencode/test/tool/parameters.test.ts` (+1, -1)
- `packages/opencode/test/tool/question.test.ts` (+1, -1)
- `packages/opencode/test/tool/read.test.ts` (+15, -2)
- `packages/opencode/test/tool/repo_clone.test.ts` (+1, -1)
- `packages/opencode/test/tool/repo_overview.test.ts` (+1, -1)
- `packages/opencode/test/tool/shell.test.ts` (+1, -1)
- `packages/opencode/test/tool/skill.test.ts` (+1, -1)
- `packages/opencode/test/tool/webfetch.test.ts` (+1, -1)
- `packages/opencode/test/tool/write.test.ts` (+1, -1)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+2, -2)
- `packages/opencode/src/agent/subagent-permissions.ts` (+33, -0)
- `packages/opencode/test/agent/plan-mode-subagent-bypass.test.ts` (+141, -0)

#### Permission System (**/permission/)
- `packages/opencode/src/permission/index.ts` (+2, -2)
- `packages/opencode/src/permission/schema.ts` (+3, -3)

#### Event Bus (**/bus/, **/event/)
- `packages/opencode/src/bus/bus-event.ts` (+0, -19)

#### Core (**/core/)
- `packages/console/core/package.json` (+1, -1)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/flag/flag.ts` (+9, -11)

#### Other Changes
- `AGENTS.md` (+1, -0)
- `bun.lock` (+21, -27)
- `nix/hashes.json` (+4, -4)
- `package.json` (+1, -0)
- `packages/app/package.json` (+1, -1)
- `packages/app/src/pages/session/session-side-panel.tsx` (+9, -2)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/mail/package.json` (+1, -1)
- `packages/{opencode/src/util => core/src}/effect-zod.ts` (+0, -0)
- `packages/{opencode/src/util => core/src}/schema.ts` (+0, -0)
- `packages/desktop/package.json` (+1, -1)
- `packages/enterprise/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/function/package.json` (+1, -1)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/http-recorder/sst-env.d.ts` (+10, -0)
- `packages/llm/package.json` (+1, -1)
- `packages/llm/sst-env.d.ts` (+10, -0)
- `packages/opencode/migration/20260507164347_add_workspace_time/migration.sql` (+1, -1)
- `packages/opencode/package.json` (+4, -16)
- `packages/opencode/scripts/diff-sdk-types.sh` (+0, -52)
- `packages/opencode/specs/effect/http-api.md` (+0, -401)
- `packages/opencode/specs/effect/migration.md` (+2, -2)
- `packages/opencode/specs/effect/schema.md` (+3, -3)
- `packages/opencode/specs/openapi-translation-cleanup.md` (+204, -0)
- `packages/opencode/specs/v2/tui-command-shim.md` (+67, -0)
- `packages/opencode/src/acp/agent.ts` (+68, -62)
- `packages/opencode/src/audio.d.ts` (+5, -0)
- `packages/opencode/src/auth/index.ts` (+2, -2)
- `packages/opencode/src/cli/cmd/export.ts` (+3, -3)
- `packages/opencode/src/cli/cmd/generate.ts` (+4, -19)
- `packages/opencode/src/cli/cmd/tui/context/aggregate-failures.ts` (+34, -0)
- `packages/opencode/src/cli/cmd/tui/context/path-format.tsx` (+39, -0)
- `packages/opencode/src/cli/cmd/tui/context/sync.tsx` (+20, -10)
- `packages/opencode/src/cli/cmd/tui/event.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/sidebar/lsp.tsx` (+2, -4)
- `packages/opencode/src/cli/cmd/tui/plugin/api.tsx` (+6, -1)
- `packages/opencode/src/cli/cmd/tui/plugin/command-shim.ts` (+109, -0)
- `packages/opencode/src/cli/cmd/tui/plugin/runtime.ts` (+3, -0)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+205, -222)
- `packages/opencode/src/cli/cmd/tui/routes/session/permission.tsx` (+8, -25)
- `packages/opencode/src/command/index.ts` (+2, -2)
- `packages/opencode/src/config/agent.ts` (+2, -2)
- `packages/opencode/src/config/attachment.ts` (+30, -0)
- `packages/opencode/src/config/command.ts` (+2, -2)
- `packages/opencode/src/config/config.ts` (+10, -6)
- `packages/opencode/src/config/console-state.ts` (+2, -2)
- `packages/opencode/src/config/formatter.ts` (+2, -2)
- `packages/opencode/src/config/layout.ts` (+2, -2)
- `packages/opencode/src/config/lsp.ts` (+2, -2)
- `packages/opencode/src/config/mcp.ts` (+2, -2)
- `packages/opencode/src/config/model-id.ts` (+2, -2)
- `packages/opencode/src/config/parse.ts` (+1, -1)
- `packages/opencode/src/config/permission.ts` (+2, -2)
- `packages/opencode/src/config/plugin.ts` (+2, -2)
- `packages/opencode/src/config/provider.ts` (+4, -3)
- `packages/opencode/src/config/reference.ts` (+2, -2)
- `packages/opencode/src/config/server.ts` (+2, -2)
- `packages/opencode/src/config/skills.ts` (+2, -2)
- `packages/opencode/src/control-plane/schema.ts` (+3, -5)
- `packages/opencode/src/control-plane/types.ts` (+6, -9)
- `packages/opencode/src/control-plane/workspace.ts` (+3, -7)
- `packages/opencode/src/file/index.ts` (+2, -2)
- `packages/opencode/src/file/ripgrep.ts` (+2, -2)
- `packages/opencode/src/format/index.ts` (+2, -2)
- `packages/opencode/src/id/id.ts` (+0, -8)
- `packages/opencode/src/image/image.ts` (+180, -0)
- `packages/opencode/src/lsp/lsp.ts` (+2, -2)
- `packages/opencode/src/markdown.d.ts` (+4, -0)
- `packages/opencode/src/mcp/index.ts` (+45, -7)
- `packages/opencode/src/project/project.ts` (+2, -2)
- `packages/opencode/src/project/schema.ts` (+2, -2)
- `packages/opencode/src/project/vcs.ts` (+10, -7)
- `packages/opencode/src/provider/auth.ts` (+2, -2)
- `packages/opencode/src/provider/model-status.ts` (+9, -0)
- `packages/opencode/src/provider/models.ts` (+2, -1)
- `packages/opencode/src/provider/provider.ts` (+16, -5)
- `packages/opencode/src/provider/schema.ts` (+2, -2)
- `packages/opencode/src/pty/index.ts` (+2, -2)
- `packages/opencode/src/pty/schema.ts` (+3, -3)
- `packages/opencode/src/pty/ticket.ts` (+1, -1)
- `packages/opencode/src/question/index.ts` (+2, -2)
- `packages/opencode/src/question/schema.ts` (+3, -6)
- `packages/opencode/src/server/adapter.bun.ts` (+0, -44)
- `packages/opencode/src/server/adapter.node.ts` (+0, -75)
- `packages/opencode/src/server/adapter.ts` (+0, -26)
- `packages/opencode/src/server/backend.ts` (+0, -32)
- `packages/opencode/src/server/error.ts` (+0, -39)
- `packages/opencode/src/server/fence.ts` (+0, -20)
- `packages/opencode/src/server/httpapi-server.node.ts` (+2, -1)
- `packages/opencode/src/server/middleware.ts` (+0, -91)
- `packages/opencode/src/server/proxy.ts` (+0, -149)
- `packages/opencode/src/server/routes/control/index.ts` (+0, -160)
- `packages/opencode/src/server/routes/control/workspace.ts` (+0, -228)
- `packages/opencode/src/server/routes/global.ts` (+0, -286)
- `packages/opencode/src/server/routes/instance/AGENTS.md` (+0, -8)
- `packages/opencode/src/server/routes/instance/config.ts` (+0, -109)
- `packages/opencode/src/server/routes/instance/event.ts` (+0, -90)
- `packages/opencode/src/server/routes/instance/experimental.ts` (+0, -419)
- `packages/opencode/src/server/routes/instance/file.ts` (+0, -190)
- `packages/opencode/src/server/routes/instance/httpapi/api.ts` (+1, -2)
- `packages/opencode/src/server/routes/instance/httpapi/event.ts` (+2, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/config.ts` (+4, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/experimental.ts` (+19, -10)
- `packages/opencode/src/server/routes/instance/httpapi/groups/file.ts` (+10, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/instance.ts` (+17, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/mcp.ts` (+9, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/permission.ts` (+3, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/project.ts` (+5, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/provider.ts` (+5, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/pty.ts` (+17, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/query.ts` (+8, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/question.ts` (+4, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/session.ts` (+37, -10)
- `packages/opencode/src/server/routes/instance/httpapi/groups/sync.ts` (+6, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/tui.ts` (+15, -5)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/message.ts` (+20, -35)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/session.ts` (+30, -54)
- `packages/opencode/src/server/routes/instance/httpapi/groups/workspace.ts` (+8, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/config.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/experimental.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/provider.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/session.ts` (+25, -22)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2/message.ts` (+1, -0)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2/session.ts` (+27, -0)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/error.ts` (+0, -26)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/workspace-routing.ts` (+13, -1)
- `packages/opencode/src/server/routes/instance/httpapi/public.ts` (+18, -56)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+1, -3)
- `packages/opencode/src/server/routes/instance/index.ts` (+0, -502)
- `packages/opencode/src/server/routes/instance/mcp.ts` (+0, -277)
- `packages/opencode/src/server/routes/instance/middleware.ts` (+0, -32)
- `packages/opencode/src/server/routes/instance/permission.ts` (+0, -73)
- `packages/opencode/src/server/routes/instance/project.ts` (+0, -116)
- `packages/opencode/src/server/routes/instance/provider.ts` (+0, -158)
- `packages/opencode/src/server/routes/instance/pty.ts` (+0, -340)
- `packages/opencode/src/server/routes/instance/question.ts` (+0, -111)
- `packages/opencode/src/server/routes/instance/session.ts` (+0, -1124)
- `packages/opencode/src/server/routes/instance/sync.ts` (+0, -199)
- `packages/opencode/src/server/routes/instance/trace.ts` (+0, -59)
- `packages/opencode/src/server/routes/instance/tui.ts` (+0, -387)
- `packages/opencode/src/server/routes/ui.ts` (+0, -40)
- `packages/opencode/src/server/server.ts` (+23, -204)
- `packages/opencode/src/server/shared/tui-control.ts` (+5, -5)
- `packages/opencode/src/server/workspace.ts` (+0, -93)
- `packages/opencode/src/session/message-v2.ts` (+17, -29)
- `packages/opencode/src/session/message.ts` (+7, -7)
- `packages/opencode/src/session/processor.ts` (+33, -5)
- `packages/opencode/src/session/prompt.ts` (+34, -27)
- `packages/opencode/src/session/revert.ts` (+2, -2)
- `packages/opencode/src/session/schema.ts` (+5, -5)
- `packages/opencode/src/session/session.ts` (+6, -6)
- `packages/opencode/src/session/status.ts` (+2, -2)
- `packages/opencode/src/session/summary.ts` (+3, -2)
- `packages/opencode/src/session/todo.ts` (+2, -2)
- `packages/opencode/src/skill/index.ts` (+22, -2)
- `packages/opencode/src/skill/prompt/customize-opencode.md` (+354, -0)
- `packages/opencode/src/snapshot/index.ts` (+9, -6)
- `packages/opencode/src/storage/storage.ts` (+1, -1)
- `packages/opencode/src/sync/index.ts` (+1, -23)
- `packages/opencode/src/sync/schema.ts` (+3, -3)
- `packages/opencode/src/util/named-schema-error.ts` (+1, -1)
- `packages/opencode/src/v2/auth.ts` (+1, -1)
- `packages/opencode/src/v2/event.ts` (+1, -1)
- `packages/opencode/src/v2/model.ts` (+3, -2)
- `packages/opencode/src/v2/session-event.ts` (+8, -8)
- `packages/opencode/src/v2/session.ts` (+1, -1)
- `packages/opencode/src/worktree/index.ts` (+4, -14)
- `packages/opencode/test/acp/event-subscription.test.ts` (+179, -2)
- `packages/opencode/test/cli/cmd/tui/aggregate-failures.test.ts` (+55, -0)
- `packages/opencode/test/cli/cmd/tui/sync-fixture.tsx` (+120, -0)
- `packages/opencode/test/cli/cmd/tui/sync-undefined-messages.test.tsx` (+47, -0)
- `packages/opencode/test/cli/cmd/tui/sync.test.tsx` (+1, -120)
- `packages/opencode/test/cli/github-action.test.ts` (+12, -12)
- `packages/opencode/test/control-plane/workspace.test.ts` (+5, -4)
- `packages/opencode/test/image/image.test.ts` (+82, -0)
- `packages/opencode/test/mcp/lifecycle.test.ts` (+67, -1)
- `packages/opencode/test/preload.ts` (+5, -0)
- `packages/opencode/test/project/instance-bootstrap-regression.test.ts` (+0, -86)
- `packages/opencode/test/project/migrate-global.test.ts` (+7, -6)
- `packages/opencode/test/provider/model-status.test.ts` (+61, -0)
- `packages/opencode/test/server/httpapi-bridge.test.ts` (+0, -501)
- `packages/opencode/test/server/httpapi-compression.test.ts` (+0, -5)
- `packages/opencode/test/server/httpapi-config.test.ts` (+37, -5)
- `packages/opencode/test/server/httpapi-cors-vary.test.ts` (+7, -23)
- `packages/opencode/test/server/httpapi-cors.test.ts` (+15, -9)
- `packages/opencode/test/server/httpapi-event.test.ts` (+7, -16)
- `packages/opencode/test/server/httpapi-exercise/backend.ts` (+0, -10)
- `packages/opencode/test/server/httpapi-exercise/environment.ts` (+0, -1)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+120, -10)
- `packages/opencode/test/server/httpapi-exercise/report.ts` (+1, -2)
- `packages/opencode/test/server/httpapi-exercise/routing.ts` (+1, -2)
- `packages/opencode/test/server/httpapi-exercise/runner.ts` (+1, -63)
- `packages/opencode/test/server/httpapi-exercise/runtime.ts` (+0, -3)
- `packages/opencode/test/server/httpapi-exercise/types.ts` (+2, -2)
- `packages/opencode/test/server/httpapi-experimental.test.ts` (+0, -4)
- `packages/opencode/test/server/httpapi-instance.legacy.test.ts` (+0, -122)
- `packages/opencode/test/server/httpapi-instance.test.ts` (+5, -9)
- `packages/opencode/test/server/httpapi-json-parity.test.ts` (+0, -254)
- `packages/opencode/test/server/httpapi-listen.test.ts` (+16, -38)
- `packages/opencode/test/server/httpapi-mcp.test.ts` (+5, -13)
- `packages/opencode/test/server/httpapi-parity.test.ts` (+0, -127)
- `packages/opencode/test/server/httpapi-promptasync-context.test.ts` (+189, -0)
- `packages/opencode/test/server/httpapi-provider.test.ts` (+199, -29)
- `packages/opencode/test/server/httpapi-pty.test.ts` (+2, -20)
- `packages/opencode/test/server/httpapi-query-schema-drift.test.ts` (+317, -0)
- `packages/opencode/test/server/httpapi-raw-route-auth.test.ts` (+0, -5)
- `packages/opencode/test/server/httpapi-sdk.test.ts` (+62, -56)
- `packages/opencode/test/server/httpapi-session.test.ts` (+58, -48)
- `packages/opencode/test/server/httpapi-sync.test.ts` (+7, -16)
- `packages/opencode/test/server/httpapi-tui.test.ts` (+0, -129)
- `packages/opencode/test/server/httpapi-ui.test.ts` (+1, -16)
- `packages/opencode/test/server/httpapi-workspace.test.ts` (+1, -30)
- `packages/opencode/test/server/negative-tokens-regression.test.ts` (+97, -0)
- `packages/opencode/test/server/sdk-error-shape.test.ts` (+74, -0)
- `packages/opencode/test/server/session-diff-missing-patch.test.ts` (+81, -0)
- `packages/opencode/test/server/session-messages.test.ts` (+24, -1)
- `packages/opencode/test/server/trace-attributes.test.ts` (+0, -76)
- `packages/opencode/test/server/worktree-endpoint-repro.test.ts` (+0, -3)
- `packages/opencode/test/session/compaction.test.ts` (+5, -1)
- `packages/opencode/test/session/instruction.test.ts` (+8, -8)
- `packages/opencode/test/session/llm.test.ts` (+8, -8)
- `packages/opencode/test/session/message-v2.test.ts` (+2, -2)
- `packages/opencode/test/session/processor-effect.test.ts` (+2, -1)
- `packages/opencode/test/session/prompt.test.ts` (+7, -1)
- `packages/opencode/test/session/schema-decoding.test.ts` (+20, -0)
- `packages/opencode/test/session/snapshot-tool-race.test.ts` (+8, -2)
- `packages/opencode/test/storage/workspace-time-migration.test.ts` (+43, -0)
- `packages/opencode/test/util/effect-zod.test.ts` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/plugin/src/tui.ts` (+43, -0)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/script/build.ts` (+1, -8)
- `packages/sdk/js/src/client.ts` (+2, -0)
- `packages/sdk/js/src/error-interceptor.ts` (+51, -0)
- `packages/sdk/js/src/gen/types.gen.ts` (+2, -2)
- `packages/sdk/js/src/v2/client.ts` (+2, -19)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+20, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+32, -4)
- `packages/sdk/openapi.json` (+1410, -1147)
- `packages/slack/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/components/session-diff.ts` (+2, -1)
- `packages/ui/src/components/session-review.tsx` (+7, -2)
- `packages/ui/src/components/session-turn.tsx` (+9, -2)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/ar/zen.mdx` (+4, -8)
- `packages/web/src/content/docs/bs/zen.mdx` (+4, -8)
- `packages/web/src/content/docs/da/zen.mdx` (+4, -8)
- `packages/web/src/content/docs/de/zen.mdx` (+4, -8)
- `packages/web/src/content/docs/es/zen.mdx` (+4, -8)
- `packages/web/src/content/docs/fr/zen.mdx` (+4, -8)
- `packages/web/src/content/docs/it/zen.mdx` (+4, -8)
- `packages/web/src/content/docs/ja/zen.mdx` (+4, -8)
- `packages/web/src/content/docs/ko/zen.mdx` (+4, -8)
- `packages/web/src/content/docs/nb/zen.mdx` (+4, -8)
- `packages/web/src/content/docs/pl/zen.mdx` (+4, -8)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+4, -8)
- `packages/web/src/content/docs/ru/zen.mdx` (+4, -8)
- `packages/web/src/content/docs/th/zen.mdx` (+4, -8)
- `packages/web/src/content/docs/tr/zen.mdx` (+4, -8)
- `packages/web/src/content/docs/zen.mdx` (+4, -8)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+4, -8)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+4, -8)
- `patches/@silvia-odwyer%2Fphoton-node@0.3.4.patch` (+14, -0)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 4ca29eb..fa9d8fe 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.14.41",
+  "version": "1.14.46",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 995ab18..1567df4 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.14.41",
+  "version": "1.14.46",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/flag/flag.ts
```diff
diff --git a/packages/core/src/flag/flag.ts b/packages/core/src/flag/flag.ts
index 9aa4a56..3fe7655 100644
--- a/packages/core/src/flag/flag.ts
+++ b/packages/core/src/flag/flag.ts
@@ -11,9 +11,12 @@ function falsy(key: string) {
   return value === "false" || value === "0"
 }
 
-// Channels that default to the new effect-httpapi server backend. The legacy
-// hono backend remains the default for stable (`prod`/`latest`) installs.
-const HTTPAPI_DEFAULT_ON_CHANNELS = new Set(["dev", "beta", "local"])
+// Channels where new experiments default to ON (unstable / internal users).
+// Stable channels (`prod`, `latest`) stay opt-in.
+const UNSTABLE_CHANNELS = new Set(["dev", "beta", "local"])
+function unstableDefault(key: string) {
+  return truthy(key) || (!falsy(key) && UNSTABLE_CHANNELS.has(InstallationChannel))
+}
 
 function number(key: string) {
   const value = process.env[key]
@@ -53,6 +56,9 @@ export const Flag = {
   OPENCODE_DISABLE_CLAUDE_CODE_PROMPT: OPENCODE_DISABLE_CLAUDE_CODE || truthy("OPENCODE_DISABLE_CLAUDE_CODE_PROMPT"),
   OPENCODE_DISABLE_CLAUDE_CODE_SKILLS,
   OPENCODE_DISABLE_EXTERNAL_SKILLS: truthy("OPENCODE_DISABLE_EXTERNAL_SKILLS"),
+  // Default-on for dev/beta/local; opt-in for stable. Set
+  // OPENCODE_EXPERIMENTAL_CUSTOMIZE_SKILL=false to force off, =true to force on.
+  OPENCODE_EXPERIMENTAL_CUSTOMIZE_SKILL: unstableDefault("OPENCODE_EXPERIMENTAL_CUSTOMIZE_SKILL"),
   OPENCODE_FAKE_VCS: process.env["OPENCODE_FAKE_VCS"],
   OPENCODE_SERVER_PASSWORD: process.env["OPENCODE_SERVER_PASSWORD"],
   OPENCODE_SERVER_USERNAME: process.env["OPENCODE_SERVER_USERNAME"],
@@ -88,14 +94,6 @@ export const Flag = {
   OPENCODE_STRICT_CONFIG_DEPS: truthy("OPENCODE_STRICT_CONFIG_DEPS"),
 
   OPENCODE_WORKSPACE_ID: process.env["OPENCODE_WORKSPACE_ID"],
-  // Defaults to true on dev/beta/local channels so internal users exercise the
-  // new effect-httpapi server backend. Stable (`prod`/`latest`) installs stay
-  // on the legacy hono backend until the rollout is complete. An explicit env
-  // var ("true"/"1" or "false"/"0") always wins, providing an opt-in for
-  // stable users and an escape hatch for dev/beta users.
-  OPENCODE_EXPERIMENTAL_HTTPAPI:
-    truthy("OPENCODE_EXPERIMENTAL_HTTPAPI") ||
-    (!falsy("OPENCODE_EXPERIMENTAL_HTTPAPI") && HTTPAPI_DEFAULT_ON_CHANNELS.has(InstallationChannel)),
   OPENCODE_EXPERIMENTAL_WORKSPACES: OPENCODE_EXPERIMENTAL || truthy("OPENCODE_EXPERIMENTAL_WORKSPACES"),
   OPENCODE_EXPERIMENTAL_EVENT_SYSTEM: OPENCODE_EXPERIMENTAL || truthy("OPENCODE_EXPERIMENTAL_EVENT_SYSTEM"),
 
```

#### packages/opencode/src/agent/agent.ts
```diff
diff --git a/packages/opencode/src/agent/agent.ts b/packages/opencode/src/agent/agent.ts
index 8584682..a5876ac 100644
--- a/packages/opencode/src/agent/agent.ts
+++ b/packages/opencode/src/agent/agent.ts
@@ -24,8 +24,8 @@ import { Effect, Context, Layer, Schema } from "effect"
 import { InstanceState } from "@/effect/instance-state"
 import * as Option from "effect/Option"
 import * as OtelTracer from "@effect/opentelemetry/Tracer"
-import { zod } from "@/util/effect-zod"
-import { withStatics, type DeepMutable } from "@/util/schema"
+import { zod } from "@opencode-ai/core/effect-zod"
+import { withStatics, type DeepMutable } from "@opencode-ai/core/schema"
 
 type ReferenceEntry = NonNullable<Config.Info["reference"]>[string]
 type ResolvedReference = { kind: "git"; repository: string; branch?: string } | { kind: "local"; path: string }
```

#### packages/opencode/src/agent/subagent-permissions.ts
```diff
diff --git a/packages/opencode/src/agent/subagent-permissions.ts b/packages/opencode/src/agent/subagent-permissions.ts
new file mode 100644
index 0000000..1174ec3
--- /dev/null
+++ b/packages/opencode/src/agent/subagent-permissions.ts
@@ -0,0 +1,33 @@
+import type { Permission } from "../permission"
+import type { Agent } from "./agent"
+
+/**
+ * Build the `permission` ruleset for a subagent's session when it's spawned
+ * via the task tool. Combines:
+ *
+ * 1. The parent **agent's** deny rules — Plan Mode and other agent-level
+ *    restrictions live on the agent ruleset, not on the session, so a
+ *    subagent that only inherited the parent SESSION's permission would
+ *    silently bypass them. (#26514)
+ * 2. The parent **session's** deny rules and external_directory rules —
+ *    same forwarding the original code already did.
+ * 3. Default `todowrite` and `task` denies if the subagent's own ruleset
+ *    doesn't already permit them.
+ */
+export function deriveSubagentSessionPermission(input: {
+  parentSessionPermission: Permission.Ruleset
+  parentAgent: Agent.Info | undefined
+  subagent: Agent.Info
+}): Permission.Ruleset {
+  const canTask = input.subagent.permission.some((rule) => rule.permission === "task")
+  const canTodo = input.subagent.permission.some((rule) => rule.permission === "todowrite")
+  const parentAgentDenies = input.parentAgent?.permission.filter((rule) => rule.action === "deny") ?? []
+  return [
+    ...parentAgentDenies,
+    ...input.parentSessionPermission.filter(
+      (rule) => rule.permission === "external_directory" || rule.action === "deny",
+    ),
+    ...(canTodo ? [] : [{ permission: "todowrite" as const, pattern: "*" as const, action: "deny" as const }]),
+    ...(canTask ? [] : [{ permission: "task" as const, pattern: "*" as const, action: "deny" as const }]),
+  ]
+}
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/src/agent/agent.ts
- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/src/agent/subagent-permissions.ts
- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/test/agent/plan-mode-subagent-bypass.test.ts
- `src/core/` - review core changes from packages/core/package.json
- `src/tool/apply_patch.test.ts` - update based on opencode packages/opencode/test/tool/apply_patch.test.ts changes
- `src/tool/edit.test.ts` - update based on opencode packages/opencode/test/tool/edit.test.ts changes
- `src/tool/external-directory.test.ts` - update based on opencode packages/opencode/test/tool/external-directory.test.ts changes
- `src/tool/glob.test.ts` - update based on opencode packages/opencode/test/tool/glob.test.ts changes
- `src/tool/grep.test.ts` - update based on opencode packages/opencode/test/tool/grep.test.ts changes
- `src/tool/lsp.test.ts` - update based on opencode packages/opencode/test/tool/lsp.test.ts changes
- `src/tool/parameters.test.ts` - update based on opencode packages/opencode/test/tool/parameters.test.ts changes
- `src/tool/prompt.ts` - update based on opencode packages/opencode/src/tool/shell/prompt.ts changes
- `src/tool/question.test.ts` - update based on opencode packages/opencode/test/tool/question.test.ts changes
- `src/tool/read.test.ts` - update based on opencode packages/opencode/test/tool/read.test.ts changes
- `src/tool/read.ts` - update based on opencode packages/opencode/src/tool/read.ts changes
- `src/tool/registry.ts` - update based on opencode packages/opencode/src/tool/registry.ts changes
- `src/tool/repo_clone.test.ts` - update based on opencode packages/opencode/test/tool/repo_clone.test.ts changes
- `src/tool/repo_overview.test.ts` - update based on opencode packages/opencode/test/tool/repo_overview.test.ts changes
- `src/tool/schema.ts` - update based on opencode packages/opencode/src/tool/schema.ts changes
- `src/tool/shell.test.ts` - update based on opencode packages/opencode/test/tool/shell.test.ts changes
- `src/tool/skill.test.ts` - update based on opencode packages/opencode/test/tool/skill.test.ts changes
- `src/tool/task.ts` - update based on opencode packages/opencode/src/tool/task.ts changes
- `src/tool/webfetch.test.ts` - update based on opencode packages/opencode/test/tool/webfetch.test.ts changes
- `src/tool/write.test.ts` - update based on opencode packages/opencode/test/tool/write.test.ts changes
