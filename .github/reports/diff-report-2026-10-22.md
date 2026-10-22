# Upstream Changes Report
Generated: 2026-10-22 11:17:17

## Summary
- kilocode: 19 commits, 30 files changed
- opencode: 46 commits, 199 files changed

## kilocode Changes (5cc65d121..4481e06d8)

### Commits

- 4481e06d8 - fix(cli): ingest PR links without remote control (#15350) (Evgeny Shurakov, 2026-10-22)
- 9e4e3a43c - Merge pull request #14644 from Kilo-Org/docs/codex-instructions-limit (Joshua Lambert, 2026-10-21)
- 23d6ee8a3 - Merge branch 'main' into docs/codex-instructions-limit (Josh Lambert, 2026-10-21)
- 56aead645 - Merge pull request #15295 from Kilo-Org/cosmic-zephyr (Kirill Kalishev, 2026-10-21)
- 016491bf7 - fix(jetbrains): stop following the prompt after manual scroll (kirillk, 2026-10-21)
- 42530c80e - Merge pull request #15351 from Kilo-Org/mellow-badger (Kirill Kalishev, 2026-10-21)
- f18d9006c - fix(cli): tighten session host contracts (kirillk, 2026-10-21)
- 2f452d7a5 - feat(cli): add session host registry and kilo cloud adapter (kirillk, 2026-10-21)
- ccef5ec13 - Merge pull request #15346 from MihaelaStoica/docs/desktop-0.1.13 (Emilie Lima Schario, 2026-10-21)
- e23c41fb8 - Merge pull request #15293 from Kilo-Org/fix/mcp-prompt-shell-expansion (Joshua Lambert, 2026-10-21)
- 3c562c0ad - docs(kilo-docs): address review feedback on Desktop docs (Mihaela Stoica, 2026-10-21)
- a70cba8a6 - fix(jetbrains): address prompt navigator review feedback (kirillk, 2026-10-21)
- 857b8e198 - docs(kilo-docs): update Kilo Desktop docs for 0.1.13 (Mihaela Stoica, 2026-10-21)
- 0cc464f3e - fix(jetbrains): keep prompt navigator in sync with hovered stripe (kirillk, 2026-10-20)
- 2e1793154 - fix(cli): preserve MCP prompt content (Josh Lambert, 2026-10-20)
- b84ea31dc - Merge branch 'main' into docs/codex-instructions-limit (Joshua Lambert, 2026-09-28)
- 466550f0b - Apply suggestion from @lambertjosh (Joshua Lambert, 2026-09-28)
- ec4dde188 - docs(kilo-docs): simplify Codex limit guidance (Josh Lambert, 2026-09-28)
- 2d8c27a12 - docs(kilo-docs): note direct Codex instructions size limit (Josh Lambert, 2026-09-28)

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
- `.changeset/jetbrains-prompt-rail-hover.md` (+5, -0)
- `.changeset/mcp-prompt-shell-expansion.md` (+5, -0)
- `.changeset/restore-session-pr-ingest.md` (+5, -0)
- `.changeset/session-host-cloud-adapter.md` (+5, -0)
- `packages/kilo-docs/pages/ai-providers/openai-chatgpt-plus-pro.md` (+3, -0)
- `packages/kilo-docs/pages/ai-providers/openai.md` (+1, -0)
- `packages/kilo-docs/pages/desktop/features/environments.md` (+9, -3)
- `packages/kilo-docs/pages/desktop/features/files.md` (+4, -0)
- `packages/kilo-docs/pages/desktop/features/git.md` (+6, -4)
- `packages/kilo-docs/pages/desktop/quickstart.md` (+39, -14)
- `packages/kilo-docs/pages/desktop/settings/general.md` (+18, -6)
- `packages/kilo-docs/pages/desktop/troubleshooting.md` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/rail/PromptRail.kt` (+10, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/rail/PromptRailPopup.kt` (+78, -11)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveList.kt` (+9, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListView.kt` (+47, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/PromptRailLayoutTest.kt` (+42, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/rail/PromptRailPopupTest.kt` (+112, -0)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+26, -9)
- `packages/opencode/src/kilocode/cloud/contracts.ts` (+6, -2)
- `packages/opencode/src/kilocode/session-hosting/index.ts` (+35, -0)
- `packages/opencode/src/kilocode/session-hosting/kilo-cloud.ts` (+372, -0)
- `packages/opencode/src/kilocode/session-hosting/registry.ts` (+53, -0)
- `packages/opencode/src/kilocode/session-hosting/types.ts` (+202, -0)
- `packages/opencode/src/session/prompt.ts` (+1, -1)
- `packages/opencode/test/kilocode/kilo-sessions.test.ts` (+219, -32)
- `packages/opencode/test/kilocode/mcp-prompt-shell.test.ts` (+99, -0)
- `packages/opencode/test/kilocode/session-hosting/kilo-cloud.test.ts` (+429, -0)
- `packages/opencode/test/kilocode/session-hosting/registry.test.ts` (+122, -0)
- `packages/opencode/test/kilocode/session-hosting/service.test.ts` (+34, -0)

### Key Diffs

(no key diffs to show)

## opencode Changes (3a1f9a9..f7d5b6f)

### Commits

- f7d5b6f - fix(app): paste plain text when renaming session tabs (#58036) (opencode-agent[bot], 2026-10-22)
- 4d120d4 - fix(stats): include Go Plus usage (#58075) (Adam, 2026-10-22)
- c93aaae - fix(tui): degrade gracefully when fs.watch fails (#51536) (ANSH SINGH, 2026-10-21)
- 248bfbe - refactor(core): validate codemode fetch display args and drop unused catalog schema (#57959) (Aiden Cline, 2026-10-21)
- d26b612 - refactor(core): tighten publish-llm-event types and hoist NativeWindow decoders (#57958) (Aiden Cline, 2026-10-21)
- cfcf754 - refactor(core): drop redundant decoding and branding in config, agent, and skill (#57953) (Aiden Cline, 2026-10-21)
- cef9718 - refactor(core): drop redundant branding and re-validation across session modules (#57952) (Aiden Cline, 2026-10-21)
- eeb9124 - refactor(core): tighten worktree strategy and pty schemas and decode overlay once (#57950) (Aiden Cline, 2026-10-21)
- 1b1ad48 - refactor(core): drop dead checks and redundant branding in tool plugins and mcp (#57949) (Aiden Cline, 2026-10-21)
- 6a5f15a - fix(core): ignore unsupported agent colors (#57910) (Aiden Cline, 2026-10-21)
- 9496ff8 - refactor(core): replace unused runtime input schemas with types in filesystem and permission (#57961) (Aiden Cline, 2026-10-21)
- b6c0327 - refactor(core): drop redundant reconstructions in rpc and project (#57948) (Aiden Cline, 2026-10-21)
- c87f6b7 - fix(core): validate compaction keepID with SessionMessage.ID schema (#57945) (Aiden Cline, 2026-10-21)
- 7012c9d - refactor(core): avoid redundant payload decoding in session inbox and prompt (#57946) (Aiden Cline, 2026-10-21)
- 7456ad8 - chore(core): refresh bundled models.dev snapshot (opencode-agent[bot], 2026-10-22)
- f0200df - chore: update nix node_modules hashes (opencode-agent[bot], 2026-10-21)
- c2736fc - feat(app): highlight code with @pierre/highlights instead of Shiki (#57937) (Luke Parker, 2026-10-22)
- e441daf - fix(cli): move the Windows service port out of the WSL mirrored range (#57428) (Filip, 2026-10-21)
- 6709f56 - fix(core): give compaction summaries the same output limit as normal turns (#57564) (Aiden Cline, 2026-10-21)
- e98ab91 - refactor(core): drop redundant String casts on Model.Ref in to-llm-message (#57887) (Aiden Cline, 2026-10-21)
- 3260ec7 - fix(core): map legacy apply_patch permissions to edit (#57900) (Aiden Cline, 2026-10-21)
- 2e5a4de - refactor(core): tighten pty, plugin, question, and snapshot types and checks (#57889) (Aiden Cline, 2026-10-21)
- a7a508b - refactor(ai-sdk): decode JSON body record in one pass and tighten option types (#57891) (Aiden Cline, 2026-10-21)
- 6dfc681 - refactor(core): avoid redundant decode and re-branding in session inbox and projector (#57890) (Aiden Cline, 2026-10-21)
- 863ea41 - refactor(ai): type Bedrock event-stream frames without casts or runtime checks (#57609) (Aiden Cline, 2026-10-21)
- e37f1a0 - refactor(ai): use Schema Json codec in toolResultText and forward Bedrock stream statusCode (#57612) (Aiden Cline, 2026-10-21)
- bddf534 - refactor(core): remove redundant DeepMutable wrappers and casts in integration, agent, and plugin host (#57825) (Aiden Cline, 2026-10-21)
- 0c8e7a9 - fix(core): preserve Permission.Error in FileAccess.Interface (#57823) (Aiden Cline, 2026-10-21)
- d10692e - docs: describe agent creation without the removed CLI command (#57419) (ANIRUDDHA ADAK, 2026-10-21)
- 8a360e1 - docs(cli): document the opencode debug subcommands (#57861) (0, 2026-10-21)
- d75c6b9 - docs(www): fix GPT 6.1 Sol cached read price (#57865) (opencode-agent[bot], 2026-10-21)
- 3108505 - docs(console): add Flint 40B Free (#57862) (opencode-agent[bot], 2026-10-21)
- 2fde77c - feat(app): animate the Go upsell hero in the free-limit dialog (#57694) (Kit Langton, 2026-10-21)
- 9c8e9e4 - refactor(core): remove unused NamedError, ConfigErrorV1, and iife helpers (#57822) (Aiden Cline, 2026-10-21)
- 93bf002 - refactor(core): reuse shared isRecord and stringify helpers (#57826) (Aiden Cline, 2026-10-21)
- ab249a9 - fix(ai): skip non-cacheable content parts when placing cache breakpoints (#57610) (Aiden Cline, 2026-10-21)
- 002d7bd - fix(app): stop following the timeline end while dragging the scrollbar (#57831) (James Long, 2026-10-21)
- 870ab9d - fix(core): let configured provider baseURL override catalog model endpoints (#57810) (opencode-agent[bot], 2026-10-21)
- f9098c9 - fix(function): scope GitHub App installation token to the verified repository (#57827) (Dax, 2026-10-21)
- f7577a1 - feat(server): start hosted GPT-Live on the connected OpenCode Console (#57735) (Adam, 2026-10-21)
- 0c6be86 - chore(function): remove unauthenticated feishu bridge route (#57792) (opencode-agent[bot], 2026-10-21)
- b2f83b5 - ci: remove the /oc workflow from this repository (#57798) (James Long, 2026-10-21)
- c3712e0 - ci: remove the duplicate-issues workflow (#57793) (James Long, 2026-10-21)
- 9141363 - ci: scope pr-management down to the contributor label (#57795) (James Long, 2026-10-21)
- 578d422 - ci: remove the /review workflow (#57796) (James Long, 2026-10-21)
- 681156c - chore(core): refresh bundled models.dev snapshot (opencode-agent[bot], 2026-10-21)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/core/src/tool/mcp.ts` (+5, -6)
- `packages/core/src/tool/plugin/question.ts` (+1, -1)
- `packages/core/src/tool/plugin/read.ts` (+0, -6)
- `packages/core/src/tool/plugin/subagent.ts` (+1, -1)
- `packages/core/src/tool/runtime.ts` (+2, -4)

#### Agent System (packages/*/src/agent/)
- `.opencode/agent/duplicate-pr.md` (+0, -26)

#### Permission System (**/permission/)
- `packages/core/src/permission/saved.ts` (+14, -17)
- `packages/core/src/permission/sql.ts` (+1, -1)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/src/agent.ts` (+6, -9)
- `packages/core/src/aisdk.ts` (+15, -23)
- `packages/core/src/codemode/catalog.ts` (+7, -8)
- `packages/core/src/codemode/web.ts` (+4, -2)
- `packages/core/src/config/plugin/agent.ts` (+3, -7)
- `packages/core/src/config/plugin/command.ts` (+3, -7)
- `packages/core/src/config/plugin/provider.ts` (+8, -1)
- `packages/core/src/config/plugin/skill-file.ts` (+3, -4)
- `packages/core/src/database/v1-migration.bun.ts` (+2, -1)
- `packages/core/src/file-access.ts` (+2, -2)
- `packages/core/src/filesystem.ts` (+10, -13)
- `packages/core/src/filesystem/search.ts` (+6, -7)
- `packages/core/src/filesystem/watcher.ts` (+7, -10)
- `packages/core/src/formatter/builtins.ts` (+1, -4)
- `packages/core/src/integration.ts` (+12, -15)
- `packages/core/src/mcp/index.ts` (+5, -6)
- `packages/core/src/models-dev/snapshot.txt` (+1, -1)
- `packages/core/src/permission.ts` (+14, -27)
- `packages/core/src/persistent-pty/daemon.ts` (+5, -2)
- `packages/core/src/persistent-pty/index.ts` (+2, -2)
- `packages/core/src/plugin.ts` (+2, -2)
- `packages/core/src/plugin/host.ts` (+4, -4)
- `packages/core/src/plugin/internal.ts` (+3, -0)
- `packages/core/src/plugin/provider/cloudflare-workers-ai.ts` (+12, -13)
- `packages/core/src/plugin/provider/github-copilot.ts` (+13, -16)
- `packages/core/src/plugin/provider/opencode.ts` (+115, -18)
- `packages/core/src/project.ts` (+4, -5)
- `packages/core/src/provider.ts` (+15, -10)
- `packages/core/src/pty.ts` (+3, -3)
- `packages/core/src/rpc.ts` (+2, -2)
- `packages/core/src/session.ts` (+5, -9)
- `packages/core/src/session/compaction.ts` (+10, -3)
- `packages/core/src/session/history.ts` (+8, -9)
- `packages/core/src/session/inbox.ts` (+19, -10)
- `packages/core/src/session/info.ts` (+8, -12)
- `packages/core/src/session/message-updater.ts` (+3, -3)
- `packages/core/src/session/model-request.ts` (+4, -11)
- `packages/core/src/session/projector.ts` (+11, -18)
- `packages/core/src/session/prompt.ts` (+6, -8)
- `packages/core/src/session/revert.ts` (+3, -5)
- `packages/core/src/session/runner/publish-llm-event.ts` (+11, -18)
- `packages/core/src/session/runner/to-llm-message.ts` (+4, -4)
- `packages/core/src/session/session.ts` (+1, -1)
- `packages/core/src/session/sql.ts` (+2, -1)
- `packages/core/src/session/store.ts` (+1, -1)
- `packages/core/src/skill.ts` (+4, -3)
- `packages/core/src/snapshot.ts` (+5, -6)
- `packages/core/src/util/error.ts` (+0, -68)
- `packages/core/src/util/iife.ts` (+0, -3)
- `packages/core/src/v1/config/error.ts` (+0, -18)
- `packages/core/src/v1/config/migrate.ts` (+14, -17)
- `packages/core/src/v1/config/provider-options.ts` (+8, -7)
- `packages/core/src/v1/config/provider.ts` (+2, -11)
- `packages/core/src/voice.ts` (+72, -12)
- `packages/core/src/worktree.ts` (+2, -2)
- `packages/core/src/worktree/sql.ts` (+2, -1)
- `packages/core/test/aisdk.test.ts` (+3, -1)
- `packages/core/test/config/agent.test.ts` (+11, -2)
- `packages/core/test/config/config.test.ts` (+2, -0)
- `packages/core/test/config/provider.test.ts` (+32, -0)
- `packages/core/test/permission.test.ts` (+1, -1)
- `packages/core/test/persistent-pty-daemon.test.ts` (+1, -1)
- `packages/core/test/plugin/fixture.ts` (+2, -0)
- `packages/core/test/plugin/provider-opencode.test.ts` (+145, -0)
- `packages/core/test/session-compaction.test.ts` (+37, -0)
- `packages/core/test/session-create.test.ts` (+1, -1)
- `packages/core/test/session-projector.test.ts` (+1, -1)
- `packages/core/test/session-runner.test.ts` (+2, -2)
- `packages/core/test/tool-read.test.ts` (+0, -22)
- `packages/core/test/v1-migration.test.ts` (+4, -3)
- `packages/core/test/voice.test.ts` (+102, -10)
- `packages/core/test/worktree.test.ts` (+9, -3)
- `packages/stats/core/src/domain/inference.test.ts` (+6, -2)
- `packages/stats/core/src/domain/inference.ts` (+4, -2)
- `packages/stats/core/src/domain/model-normalization.ts` (+2, -0)

#### Other Changes
- `.github/workflows/duplicate-issues.yml` (+0, -221)
- `.github/workflows/opencode.yml` (+0, -34)
- `.github/workflows/pr-management.yml` (+2, -72)
- `.github/workflows/review.yml` (+0, -83)
- `bun.lock` (+22, -14)
- `bunfig.toml` (+1, -1)
- `infra/app.ts` (+1, -13)
- `nix/hashes.json` (+3, -3)
- `package.json` (+2, -2)
- `packages/ai/src/cache-policy.ts` (+11, -6)
- `packages/ai/src/generation.ts` (+1, -1)
- `packages/ai/src/image.ts` (+9, -2)
- `packages/ai/src/media-model.ts` (+9, -2)
- `packages/ai/src/protocols/bedrock-converse.ts` (+2, -1)
- `packages/ai/src/protocols/bedrock-event-stream.ts` (+13, -10)
- `packages/ai/src/schema/errors.ts` (+1, -1)
- `packages/ai/src/schema/messages.ts` (+5, -6)
- `packages/ai/src/speech.ts` (+9, -2)
- `packages/ai/src/transcription.ts` (+2, -2)
- `packages/ai/src/video.ts` (+9, -2)
- `packages/ai/test/cache-policy.test.ts` (+26, -1)
- `packages/ai/test/generation.test.ts` (+9, -0)
- `packages/ai/test/provider/bedrock-converse.test.ts` (+15, -3)
- `packages/ai/test/schema.test.ts` (+32, -0)
- `packages/app/e2e/performance/timeline/session-timeline-stream-probe.ts` (+33, -22)
- `packages/app/e2e/regression/session-header.spec.ts` (+2, -2)
- `packages/app/e2e/regression/tabs.spec.ts` (+1, -1)
- `packages/app/src/providers/connect/go-upsell-hero-art.test.ts` (+151, -0)
- `packages/app/src/providers/connect/go-upsell-hero-art.ts` (+679, -0)
- `packages/app/src/providers/connect/go-upsell-hero.tsx` (+17, -0)
- `packages/app/src/providers/connect/usage-exceeded.tsx` (+13, -2)
- `packages/app/src/session/timeline/virtualizer.tsx` (+8, -2)
- `packages/app/src/session/usage-exceeded-dialogs.tsx` (+2, -0)
- `packages/app/src/shell/commands/search-keydown.ts` (+1, -1)
- `packages/app/src/shell/titlebar/tab-nav.tsx` (+1, -1)
- `packages/app/src/shell/titlebar/tab-strip.tsx` (+1, -1)
- `packages/app/vite.js` (+1, -1)
- `packages/cli/src/services/service-config.ts` (+5, -4)
- `packages/cli/test/service.test.ts` (+7, -7)
- `packages/client/src/effect/api/api.ts` (+10, -0)
- `packages/client/src/effect/generated/client.ts` (+11, -0)
- `packages/client/src/promise/generated/client.ts` (+14, -0)
- `packages/client/src/promise/generated/types.ts` (+16, -2)
- `packages/client/test/promise.test.ts` (+1, -1)
- `packages/function/src/api.ts` (+1, -54)
- `packages/function/src/github.ts` (+2, -0)
- `packages/function/test/github.test.ts` (+13, -0)
- `packages/protocol/openapi.json` (+124, -2)
- `packages/protocol/src/groups/voice.ts` (+24, -3)
- `packages/schema/src/config/agent.ts` (+6, -2)
- `packages/schema/src/session-event.ts` (+1, -1)
- `packages/server/src/handlers/voice.ts` (+23, -10)
- `packages/server/test/voice.test.ts` (+42, -8)
- `packages/session-ui/component-tests/markdown.spec.ts` (+1, -1)
- `packages/session-ui/package.json` (+1, -2)
- `packages/session-ui/src/components/markdown.css` (+2, -2)
- `packages/session-ui/src/components/markdown.tsx` (+1, -1)
- `packages/session-ui/src/components/markdown.worker.ts` (+49, -45)
- `packages/session-ui/src/components/message-file.ts` (+74, -6)
- `packages/session-ui/src/pierre/index.ts` (+15, -2)
- `packages/session-ui/src/pierre/worker.ts` (+4, -20)
- `packages/storybook/.storybook/preview.tsx` (+14, -17)
- `packages/tui/src/config/index.tsx` (+2, -2)
- `packages/tui/src/context/storage.tsx` (+12, -21)
- `packages/tui/src/model-preference.ts` (+4, -5)
- `packages/tui/src/plugin/watch.ts` (+7, -3)
- `packages/tui/src/util/watch.ts` (+24, -0)
- `packages/ui/package.json` (+1, -2)
- `packages/ui/src/context/highlight-theme.tsx` (+66, -0)
- `packages/ui/src/context/marked-parser.test.ts` (+15, -4)
- `packages/ui/src/context/marked-parser.tsx` (+21, -3)
- `packages/ui/src/context/marked-theme-register.tsx` (+0, -10)
- `packages/ui/src/context/marked-theme.tsx` (+0, -372)
- `packages/ui/src/context/marked.tsx` (+0, -31)
- `packages/web/src/content/docs/agents.mdx` (+2, -12)
- `packages/web/src/content/docs/ar/agents.mdx` (+2, -12)
- `packages/web/src/content/docs/ar/cli.mdx` (+0, -32)
- `packages/web/src/content/docs/bs/agents.mdx` (+2, -12)
- `packages/web/src/content/docs/bs/cli.mdx` (+0, -32)
- `packages/web/src/content/docs/cli.mdx` (+36, -44)
- `packages/web/src/content/docs/da/agents.mdx` (+2, -12)
- `packages/web/src/content/docs/da/cli.mdx` (+0, -32)
- `packages/web/src/content/docs/de/agents.mdx` (+2, -12)
- `packages/web/src/content/docs/de/cli.mdx` (+0, -32)
- `packages/web/src/content/docs/es/agents.mdx` (+2, -12)
- `packages/web/src/content/docs/es/cli.mdx` (+0, -32)
- `packages/web/src/content/docs/fr/agents.mdx` (+2, -12)
- `packages/web/src/content/docs/fr/cli.mdx` (+0, -32)
- `packages/web/src/content/docs/it/agents.mdx` (+2, -12)
- `packages/web/src/content/docs/it/cli.mdx` (+0, -32)
- `packages/web/src/content/docs/ja/agents.mdx` (+2, -12)
- `packages/web/src/content/docs/ja/cli.mdx` (+0, -32)
- `packages/web/src/content/docs/ko/agents.mdx` (+2, -12)
- `packages/web/src/content/docs/ko/cli.mdx` (+0, -32)
- `packages/web/src/content/docs/nb/agents.mdx` (+2, -12)
- `packages/web/src/content/docs/nb/cli.mdx` (+0, -32)
- `packages/web/src/content/docs/pl/agents.mdx` (+2, -12)
- `packages/web/src/content/docs/pl/cli.mdx` (+0, -32)
- `packages/web/src/content/docs/pt-br/agents.mdx` (+2, -12)
- `packages/web/src/content/docs/pt-br/cli.mdx` (+0, -32)
- `packages/web/src/content/docs/ru/agents.mdx` (+2, -12)
- `packages/web/src/content/docs/ru/cli.mdx` (+0, -32)
- `packages/web/src/content/docs/th/agents.mdx` (+2, -12)
- `packages/web/src/content/docs/th/cli.mdx` (+0, -32)
- `packages/web/src/content/docs/tr/agents.mdx` (+2, -12)
- `packages/web/src/content/docs/tr/cli.mdx` (+0, -32)
- `packages/web/src/content/docs/zh-cn/agents.mdx` (+2, -12)
- `packages/web/src/content/docs/zh-cn/cli.mdx` (+0, -32)
- `packages/web/src/content/docs/zh-tw/agents.mdx` (+2, -12)
- `packages/web/src/content/docs/zh-tw/cli.mdx` (+0, -32)
- `script/duplicate-pr.ts` (+0, -81)
- `services/www/openapi.json` (+124, -2)
- `services/www/public/openapi.json` (+124, -2)
- `services/www/src/docs/content/cli/web.mdx` (+3, -2)
- `services/www/src/docs/content/console/models.mdx` (+6, -6)
- `sst-env.d.ts` (+0, -16)

### Key Diffs

#### .opencode/agent/duplicate-pr.md
```diff
diff --git a/.opencode/agent/duplicate-pr.md b/.opencode/agent/duplicate-pr.md
deleted file mode 100644
index c9c932e..0000000
--- a/.opencode/agent/duplicate-pr.md
+++ /dev/null
@@ -1,26 +0,0 @@
----
-mode: primary
-hidden: true
-model: opencode/claude-haiku-4-5
-color: "#E67E22"
-tools:
-  "*": false
-  "github-pr-search": true
----
-
-You are a duplicate PR detection agent. When a PR is opened, your job is to search for potentially duplicate or related open PRs.
-
-Use the github-pr-search tool to search for PRs that might be addressing the same issue or feature.
-
-IMPORTANT: The input will contain a line `CURRENT_PR_NUMBER: NNNN`. This is the current PR number, you should not mark that the current PR as a duplicate of itself.
-
-Search using keywords from the PR title and description. Try multiple searches with different relevant terms.
-
-If you find potential duplicates:
-
-- List them with their titles and URLs
-- Briefly explain why they might be related
-
-If no duplicates are found, say so clearly. BUT ONLY SAY "No duplicate PRs found" (don't say anything else if no dups)
-
-Keep your response concise and actionable.
```

#### packages/core/src/agent.ts
```diff
diff --git a/packages/core/src/agent.ts b/packages/core/src/agent.ts
index 14732fd..d574e75 100644
--- a/packages/core/src/agent.ts
+++ b/packages/core/src/agent.ts
@@ -30,8 +30,8 @@ type Data = {
 }
 
 export type Editor = {
-  list: () => readonly Info[]
-  get: (id: ID) => Info | undefined
+  list: () => readonly Types.DeepMutable<Info>[]
+  get: (id: ID) => Types.DeepMutable<Info> | undefined
   default: (id: ID | undefined) => void
   update: (id: ID, fn: (agent: Types.DeepMutable<Info>) => void) => void
   remove: (id: ID) => void
@@ -40,7 +40,7 @@ export type Editor = {
 export interface Interface extends State.Transformable<Editor> {
   readonly get: (id: ID) => Effect.Effect<Info | undefined>
   readonly resolve: (id?: ID | string) => Effect.Effect<Info | undefined>
-  readonly select: (id?: ID | string) => Effect.Effect<Selection>
+  readonly select: (id?: ID) => Effect.Effect<Selection>
   readonly list: () => Effect.Effect<Info[]>
 }
 
@@ -54,7 +54,7 @@ const layer = Layer.effect(
       name: "agent",
       initial: () => ({ agents: new Map() }),
       editor: (editor) => ({
-        list: () => Array.fromIterable(editor.agents.values()) as Info[],
+        list: () => Array.fromIterable(editor.agents.values()),
         get: (id) => editor.agents.get(id),
         default: (id) => {
           editor.default = id
@@ -77,7 +77,7 @@ const layer = Layer.effect(
       const data = state.get()
       const configured = data.default ? selectable(data.agents.get(data.default)) : undefined
       if (configured) return configured
-      const build = selectable(data.agents.get(ID.make("build")))
+      const build = selectable(data.agents.get(defaultID))
       if (build) return build
       for (const agent of data.agents.values()) {
         const fallback = selectable(agent)
@@ -96,10 +96,7 @@ const layer = Layer.effect(
         return selectedDefault()
       }),
       select: Effect.fn("Agent.select")(function* (id) {
-        if (id !== undefined) {
-          const selected = ID.make(id)
-          return { id: selected, info: state.get().agents.get(selected) }
-        }
```

#### packages/core/src/aisdk.ts
```diff
diff --git a/packages/core/src/aisdk.ts b/packages/core/src/aisdk.ts
index a392273..4904eed 100644
--- a/packages/core/src/aisdk.ts
+++ b/packages/core/src/aisdk.ts
@@ -32,6 +32,7 @@ import {
 } from "@opencode/ai"
 import { Auth, Endpoint, RequestExecutor, type AnyRoute, type HttpMiddleware } from "@opencode/ai/route"
 import { ProviderShared } from "@opencode/ai/protocols/shared"
+import { isRecord } from "@opencode/ai/utils/record"
 import { Cause, Context, Effect, Layer, Option, Schema, Scope, Stream } from "effect"
 import { makeParser } from "effect/encoding/Sse"
 import { HttpClientRequest, HttpClientResponse } from "effect/http"
@@ -39,25 +40,26 @@ import { AsyncLocalStorage } from "node:async_hooks"
 import type { ID, RuntimeInfo } from "./model.js"
 import { Provider } from "./provider.js"
 import { State } from "./state.js"
+import { stringify } from "./tool/runtime.js"
 
 type SDK = any
 type UserContent = Extract<LanguageModelV3Message, { role: "user" }>["content"]
 type AssistantContent = Extract<LanguageModelV3Message, { role: "assistant" }>["content"]
 type ToolResultContent = Extract<AssistantContent[number], { type: "tool-result" }>
 
-const decodeJson = Schema.decodeUnknownOption(Schema.fromJsonString(Schema.Unknown))
+const decodeJsonRecord = Schema.decodeUnknownOption(Schema.fromJsonString(Schema.Record(Schema.String, Schema.Json)))
 
 export interface SDKEvent {
   readonly model: RuntimeInfo
   readonly package: string
-  readonly options: Record<string, any>
+  readonly options: Record<string, unknown>
   sdk?: SDK
 }
 
 export interface LanguageEvent {
   readonly model: RuntimeInfo
   readonly sdk: SDK
-  readonly options: Record<string, any>
+  readonly options: Record<string, unknown>
   language?: LanguageModelV3
 }
 
@@ -120,7 +122,7 @@ function wrapSSE(res: Response, ms: number, ctl: AbortController) {
 
 function prepareOptions(model: RuntimeInfo, pkg: string) {
   const projected = mapBodyToProviderOptions(model, pkg)
-  const options: Record<string, any> = {
+  const options: Record<string, unknown> = {
     name: model.canonical ?? model.providerID,
     ...(model.settings ?? {}),
```

#### packages/core/src/codemode/catalog.ts
```diff
diff --git a/packages/core/src/codemode/catalog.ts b/packages/core/src/codemode/catalog.ts
index 3c8f2b9..07dfe59 100644
--- a/packages/core/src/codemode/catalog.ts
+++ b/packages/core/src/codemode/catalog.ts
@@ -2,14 +2,13 @@ export * as CodeModeCatalog from "./catalog.js"
 
 import { Schema } from "effect"
 
-export const Tool = Schema.Struct({
-  type: Schema.Literal("tool"),
-  name: Schema.String,
-  description: Schema.String,
-  signature: Schema.String,
-  pinned: Schema.optionalKey(Schema.Boolean),
-})
-export type Tool = typeof Tool.Type
+export type Tool = {
+  readonly type: "tool"
+  readonly name: string
+  readonly description: string
+  readonly signature: string
+  readonly pinned?: boolean
+}
 
 export type Namespace = {
   readonly type: "namespace"
```

#### packages/core/src/codemode/web.ts
```diff
diff --git a/packages/core/src/codemode/web.ts b/packages/core/src/codemode/web.ts
index 0a6b5b8..fb7dc4e 100644
--- a/packages/core/src/codemode/web.ts
+++ b/packages/core/src/codemode/web.ts
@@ -1,6 +1,7 @@
 export * as CodeModeWeb from "./web.js"
 
 import { Extension } from "@opencode/codemode"
+import { isRecord } from "@opencode/ai/utils/record"
 
 const TIMEOUT_MS = 30_000
 
@@ -43,6 +44,7 @@ export const extension = Extension.make({ name: "web", globals: { fetch } })
 
 /** What to show for a fetch call: its method and URL. */
 export const display = (args: ReadonlyArray<unknown>) => {
-  const [input, init] = args as [string | URL, Init | undefined]
-  return { method: init?.method?.toUpperCase() ?? "GET", url: String(input) }
+  const [input, init] = args
+  const method = isRecord(init) && typeof init.method === "string" ? init.method.toUpperCase() : "GET"
+  return { method, url: String(input) }
 }
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate patterns from opencode .opencode/agent/duplicate-pr.md
- `src/tool/mcp.ts` - update based on opencode packages/core/src/tool/mcp.ts changes
- `src/tool/question.ts` - update based on opencode packages/core/src/tool/plugin/question.ts changes
- `src/tool/read.ts` - update based on opencode packages/core/src/tool/plugin/read.ts changes
- `src/tool/runtime.ts` - update based on opencode packages/core/src/tool/runtime.ts changes
- `src/tool/subagent.ts` - update based on opencode packages/core/src/tool/plugin/subagent.ts changes
