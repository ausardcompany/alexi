# Upstream Changes Report
Generated: 2026-04-13 08:06:12

## Summary
- kilocode: 144 commits, 534 files changed
- opencode: 18 commits, 22 files changed

## kilocode Changes (7ea50aac1..bd494f669)

### Commits

- bd494f669 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-04-12)
- e985060e7 - Merge pull request #8812 from Kilo-Org/catrielmuller/kilo-opencode-v1.3.9 (Catriel Müller, 2026-04-12)
- b88a201de - fix: types (Catriel Müller, 2026-04-12)
- 65c888d9a - refactor: bump version (Catriel Müller, 2026-04-12)
- 18385577e - refactor: update bun locl (Catriel Müller, 2026-04-12)
- 17c834bb5 - refactor: fix app typecheck (Catriel Müller, 2026-04-12)
- fd5992d31 - resolve merge conflicts (Catriel Müller, 2026-04-12)
- 84c9bf8b1 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-04-12)
- 8aadf4ce0 - refactor: kilo compat for v1.3.9 (Catriel Müller, 2026-04-12)
- 1fbb9d286 - Merge pull request #8810 from Kilo-Org/catrielmuller/kilo-opencode-v1.3.7 (Catriel Müller, 2026-04-12)
- 97d26a3fa - refactor: add python to local env (Catriel Müller, 2026-04-12)
- 8d15310dc - resolve merge conflicts (Catriel Müller, 2026-04-12)
- 6715026c3 - refactor: kilo compat for v1.3.7 (Catriel Müller, 2026-04-12)
- 20a305a4a - Merge pull request #8808 from Kilo-Org/imanolmaiztegui/kilo-opencode-v1.3.6 (Imanol Maiztegui, 2026-04-12)
- 73005b825 - style(kilo-vscode): fix indentation and formatting in parts-util and PopupSelector (Imanol Maiztegui, 2026-04-12)
- 24087a6f9 - refactor(tui): extract kilo-specific logic into dedicated app module (Imanol Maiztegui, 2026-04-12)
- 0512f116e - refactor(opencode): migrate session types to KiloSession namespace and fix merge artifacts (Imanol Maiztegui, 2026-04-12)
- bed9ff618 - resolve merge conflicts (Imanol Maiztegui, 2026-04-12)
- 4f4e4fc9d - refactor: kilo compat for v1.3.6 (Imanol Maiztegui, 2026-04-12)
- 6cf72ef05 - OpenCode v1.3.5 (#8806) (Johnny Eric Amancio, 2026-04-12)
- 608afd3e7 - fix(opencode): always use kilo.db regardless of channel (Johnny Amancio, 2026-04-12)
- a9fc3b721 - fix(scripts): skip models-snapshot.js along with models-snapshot.ts in source-links extractor (Johnny Amancio, 2026-04-12)
- 90e86a5e3 - OpenCode v1.3.4 (#8798) (Catriel Müller, 2026-04-12)
- 057848deb - release: v1.3.9 (opencode, 2026-03-30)
- 1de06452d - fix(plugin): properly resolve entrypoints without leading dot (#20140) (Luke Parker, 2026-03-31)
- 58f60629a - wip: zen (Frank, 2026-03-30)
- 39a47c9b8 - wip: zen (Frank, 2026-03-30)
- ea88044f2 - chore: generate (opencode-agent[bot], 2026-03-30)
- e6f6f7aff - refactor: replace Filesystem util with AppFileSystem service (#20127) (Kit Langton, 2026-03-30)
- 48e97b47a - release: v1.3.8 (opencode, 2026-03-30)
- fe120e3cb - chore: update nix node_modules hashes (opencode-agent[bot], 2026-03-30)
- f2dd77466 - zen: qwen3.6 plus (Frank, 2026-03-30)
- e7ff0f17c - zen: qwen3.6 plus (Frank, 2026-03-30)
- 2ed756c72 - fix(session): restore busy route handling and add regression coverage (#20125) (Kit Langton, 2026-03-30)
- 054f4be18 - zen: add safety identifier (Frank, 2026-03-30)
- e3e1e9af5 - fix(Opencode): Bump ai-sdk/xai to 3.0.75 to fix tool calls (#20123) (Jaaneek, 2026-03-30)
- c8389cf96 - chore: generate (opencode-agent[bot], 2026-03-30)
- c5442d418 - refactor(session): effectify SessionPrompt service (#19483) (Kit Langton, 2026-03-30)
- fa95a61c4 - Refactor into plugin loader and do not enforce (#20112) (Sebastian, 2026-03-30)
- 9f3c2bd86 - fix: agent value passed to chat.params and chat.headers hooks was not a string (#19996) (Aiden Cline, 2026-03-30)
- c2f78224a - chore(app): cleanup (#20062) (Adam, 2026-03-30)
- 14f9e21d5 - pluggable home footer (#20057) (Sebastian, 2026-03-30)
- 8e4bab518 - update plugin themes when plugin was updated (#20052) (Sebastian, 2026-03-30)
- 3c32013eb - fix: preserve image attachments when selecting slash commands (#19771) (Jack, 2026-03-30)
- 47d2ab120 - release: v1.3.7 (opencode, 2026-03-30)
- 186af2723 - make variant modal less annoying (#19998) (Luke Parker, 2026-03-30)
- 6926fe1c7 - fix: stabilize release changelog generation (#19987) (Luke Parker, 2026-03-30)
- ee018d5c8 - docs: rename patch tool to apply_patch and clarify apply_patch behavior (#19979) (Chris Yang, 2026-03-29)
- 0465579d6 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-03-30)
- 196a03caf - fix: discourage _noop tool call during LiteLLM compaction (#18539) (Knut Zuidema, 2026-03-29)
- b23437008 - feat(windows): add first-class pwsh/powershell support (#16069) (Luke Parker, 2026-03-30)
- 5d2dc8888 - theme colors for dialog textarea placeholders (#19939) (Sebastian, 2026-03-29)
- 0b1018f6d - plugins installs should preserve jsonc comments (#19938) (Sebastian, 2026-03-29)
- afb6abff7 - fix: ensure OPENCODE_DISABLE_CLAUDE_CODE_PROMPT is respected for project lvl CLAUDE.md (#19924) (Aiden Cline, 2026-03-29)
- e7f94f9b9 - release: v1.3.6 (opencode, 2026-03-29)
- 72c77d0e7 - fix(session): fix token usage double-counting w/ anthropic & bedrock due to AI SDK v6 upgrade (#19758) (ualtinok, 2026-03-29)
- 5c15755a1 - docs: add question tool to available permissions list (#19922) (Ariane Emory, 2026-03-29)
- 3a4bfeb5b - wip: zen (Frank, 2026-03-29)
- 1037c72d9 - wip: zen (Frank, 2026-03-29)
- ba00e9a99 - Fix variant dialog filtering (#19917) (Kit Langton, 2026-03-29)
- 963dad75e - ci: fix (Frank, 2026-03-29)
- 7e9b721e9 - wip: zen (Frank, 2026-03-29)
- a5b1dc081 - test: add regression coverage for sync plugin hooks (#19589) (Luke Parker, 2026-03-29)
- 0bc2f99f2 - release: v1.3.5 (opencode, 2026-03-29)
- 55895d066 - core: fix plugin hooks to properly handle async operations ensuring plugins can execute async code without errors (#19586) (Aiden Cline, 2026-03-29)
- 72cb9dfa3 - tweak: adjust gpt prompt to be more minimal, fix file reference annoyances (#19585) (Aiden Cline, 2026-03-28)
- f0a9075fd - release: v1.3.4 (opencode, 2026-03-29)
- fee1e25ab - ci: cancel stale nix-hashes runs (#19571) (Luke Parker, 2026-03-29)
- a94ac5aa2 - zen: ZDR policy (Frank, 2026-03-28)
- 62ac45a9c - wip: zen (Frank, 2026-03-28)
- f7c2ef876 - wip: zen (Frank, 2026-03-28)
- 6639f9273 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-03-29)
- 36aeb3215 - ignore: kill todo (#19566) (Aiden Cline, 2026-03-29)
- ff37d7c2d - fix: nix embedded web-ui support (#19561) (Caleb Norton, 2026-03-28)
- 4f96eb239 - fix: respect semver build identifiers for nix (#11915) (Caleb Norton, 2026-03-28)
- 38af99dcb - prompt slot (#19563) (Sebastian, 2026-03-29)
- 772059acb - chore: update nix node_modules hashes (opencode-agent[bot], 2026-03-28)
- 1f290fc1b - fix: update opencode-gitlab-auth to 2.0.1 (#19552) (Vladimir Glafirov, 2026-03-28)
- 77d4f9949 - use theme color for prompt placeholder (#19535) (Sebastian, 2026-03-28)
- aa2d753e7 - feat: dialog variant menu and subagent improvements (#19537) (Dax, 2026-03-28)
- 860531c27 - refactor(session): effectify session processor (#19485) (Kit Langton, 2026-03-28)
- 2b86b36c8 - feat: open dialog for model variant selection instead of cycling (#19534) (Dax, 2026-03-28)
- 8ac2fbbd1 - kv theme before default fallback (#19523) (Sebastian, 2026-03-28)
- 26382c621 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-03-28)
- 0981b8eb7 - chore: generate (opencode-agent[bot], 2026-03-28)
- aa9ed001d - refactor(file): use AppFileSystem instead of raw Filesystem (#19458) (Kit Langton, 2026-03-28)
- 608607256 - upgrade opentui to 0.1.91 (#19440) (Sebastian, 2026-03-28)
- 6c14ea1d2 - tweak(session): add top spacing and remove obsolete docs prompt (Dax Raad, 2026-03-28)
- c3a9ec4a9 - fix: restore subagent footer and fix style guide violations (#19491) (Dax, 2026-03-28)
- 41b0d03f6 - feat: add model variant selection dialog (#19488) (Dax, 2026-03-28)
- 81eb6e670 - refactor(prompt): remove variant cycle display from footer (#19489) (Dax, 2026-03-28)
- 8446719b1 - refactor(session): move context into prompt footer (#19486) (Dax, 2026-03-28)
- 15a8c22a2 - tweak: adjust bash tool description to increase cache hit rates between projects (#19487) (Aiden Cline, 2026-03-27)
- 48326e8d9 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-03-28)
- 43bc5551e - update effect to 4.0.0-beta.42 (#19484) (Kit Langton, 2026-03-27)
- f73611696 - fix(app): more startup efficiency (#19454) (Adam, 2026-03-28)
- 82fc49352 - feat(ci): use Azure Artifact Signing for Windows releases (#15201) (Luke Parker, 2026-03-28)
- 2145d97f1 - refactor(session): effectify SessionCompaction service (#19459) (Kit Langton, 2026-03-28)
- f3997d808 - Single target plugin entrypoints (#19467) (Sebastian, 2026-03-27)
- 02b19bc3d - chore: generate (opencode-agent[bot], 2026-03-27)
- 5cd54ec34 - refactor(format): use ChildProcessSpawner instead of Process.spawn (#19457) (Kit Langton, 2026-03-27)
- c8909908f - chore: update nix node_modules hashes (opencode-agent[bot], 2026-03-27)
- 4b9660b21 - refactor(core): move more responsibility to workspace routing (#19455) (James Long, 2026-03-27)
- e5f0e813b - refactor(session): effectify Session service (#19449) (Kit Langton, 2026-03-27)
- c33d9996f - feat: AI SDK v6 support (#18433) (Aiden Cline, 2026-03-27)
- 7a7643c86 - no theme override in dev (#19456) (Sebastian, 2026-03-27)
- 6f5b70e68 - tweak: add additional overflow error patterns (#19446) (Aiden Cline, 2026-03-27)
- ff13524a5 - fix flaky plugin tests (no mock.module for bun) (#19445) (Sebastian, 2026-03-27)
- e973bbf54 - fix(app): default file tree to closed with minimum width (#19426) (Kit Langton, 2026-03-27)
- d36b38e4a - fix(desktop-electron): match dev dock icon inset on macOS (#19429) (Kit Langton, 2026-03-27)
- bdd7829c6 - fix(app): resize layout viewport when mobile keyboard appears (#15841) (Burak Yigit Kaya, 2026-03-27)
- a93374c48 - fix(ui): make streamed markdown feel more continuous (#19404) (Shoubhit Dash, 2026-03-27)
- af2ccc94e - chore(app): more spacing controls (Adam, 2026-03-27)
- a76be695c - refactor(core): split out instance and route through workspaces (#19335) (James Long, 2026-03-27)
- e528ed5d8 - effectify Plugin service internals (#19365) (Kit Langton, 2026-03-27)
- bb8d2cdd1 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-03-27)
- decb5e68e - effectify Skill service internals (#19364) (Kit Langton, 2026-03-27)
- 21023337f - chore: generate (opencode-agent[bot], 2026-03-27)
- 6274b0677 - tui plugins (#19347) (Sebastian, 2026-03-27)
- d8ad8338f - chore: generate (opencode-agent[bot], 2026-03-27)
- 7b4491814 - refactor(tool-registry): yield Config/Plugin services, use Effect.forEach (#19363) (Kit Langton, 2026-03-27)
- d2bfa92e7 - fix(app): persist queued followups across project switches (#19421) (Shoubhit Dash, 2026-03-27)
- 3fb60d05e - chore: update nix node_modules hashes (opencode-agent[bot], 2026-03-27)
- d34149968 - fix(ui): keep partial markdown readable while responses stream (#19403) (Shoubhit Dash, 2026-03-27)
- 771525270 - fix(opencode): ignore generated models snapshot files (#19362) (Kit Langton, 2026-03-27)
- e96eead32 - refactor(vcs): replace async git() with ChildProcessSpawner (#19361) (Kit Langton, 2026-03-27)
- b242a8d8e - chore: generate (opencode-agent[bot], 2026-03-27)
- 9c6f1edfd - refactor(effect): yield services instead of promise facades (#19325) (Kit Langton, 2026-03-26)
- ef7d1f7ef - fix: web ui bundle build on windows (#19337) (Luke Parker, 2026-03-26)
- b7a06e193 - fix(ui): reduce markdown jank while responses stream (#19304) (Shoubhit Dash, 2026-03-26)
- 311ba4179 - fix(app): remove fork session button (Adam, 2026-03-26)
- ad3b35067 - fix(app): default shell tool to collapsed (Adam, 2026-03-26)
- 590523dcd - chore: generate (opencode-agent[bot], 2026-03-26)
- b8fb75a94 - fix(app): don't bundle fonts (#19329) (Adam, 2026-03-26)
- 98a31e30c - chore: update nix node_modules hashes (opencode-agent[bot], 2026-03-26)
- c333e914e - chore: generate (opencode-agent[bot], 2026-03-26)
- c7760b433 - fix(app): more startup perf (#19288) (Adam, 2026-03-26)
- 2e6ac8ff4 - fix(mcp): close transport on failed/timed-out connections (#19200) (Kit Langton, 2026-03-26)
- 1ebc92fd3 - refactor(config): use cachedInvalidateWithTTL, bump effect to beta.37 (#19322) (Kit Langton, 2026-03-26)
- 9f94bdb49 - chore: generate (opencode-agent[bot], 2026-03-26)
- 28f5176ff - effectify Config service (#19139) (Kit Langton, 2026-03-26)
- 38450443b - feat(core): remove workspace server, WorkspaceContext, start work towards better routing (#19316) (James Long, 2026-03-26)
- da1d37274 - feat: add gpt prompt so non codex gpt models have their own system prompt modeled after codex cli (#19220) (Aiden Cline, 2026-03-26)
- 17e8f577d - chore: generate (opencode-agent[bot], 2026-03-26)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/provider/sdk/copilot/responses/tool/code-interpreter.ts` (+2, -3)
- `packages/opencode/src/provider/sdk/copilot/responses/tool/file-search.ts` (+2, -3)
- `packages/opencode/src/provider/sdk/copilot/responses/tool/image-generation.ts` (+2, -3)
- `packages/opencode/src/provider/sdk/copilot/responses/tool/local-shell.ts` (+2, -3)
- `packages/opencode/src/provider/sdk/copilot/responses/tool/web-search-preview.ts` (+2, -3)
- `packages/opencode/src/provider/sdk/copilot/responses/tool/web-search.ts` (+2, -3)
- `packages/opencode/src/tool/bash.ts` (+420, -205)
- `packages/opencode/src/tool/bash.txt` (+3, -1)
- `packages/opencode/src/tool/batch.ts` (+2, -1)
- `packages/opencode/src/tool/external-directory.ts` (+10, -5)
- `packages/opencode/src/tool/read.ts` (+3, -0)
- `packages/opencode/src/tool/registry.ts` (+64, -62)
- `packages/opencode/src/tool/task.ts` (+3, -16)
- `packages/opencode/src/tool/tool.ts` (+17, -15)
- `packages/opencode/test/tool/bash.test.ts` (+714, -132)
- `packages/opencode/test/tool/external-directory.test.ts` (+72, -2)
- `packages/opencode/test/tool/read.test.ts` (+39, -2)
- `packages/opencode/test/tool/skill.test.ts` (+3, -85)

#### Agent System (packages/*/src/agent/)
- `.opencode/agent/docs.md` (+0, -34)
- `packages/opencode/src/agent/agent.ts` (+16, -7)
- `packages/opencode/test/agent/agent.test.ts` (+6, -6)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
(no changes)

#### Other Changes
- `.github/workflows/nix-hashes.yml` (+4, -0)
- `.gitignore` (+1, -0)
- `.opencode/command/changelog.md` (+40, -17)
- `.opencode/plugins/smoke-theme.json` (+223, -0)
- `.opencode/plugins/tui-smoke.tsx` (+891, -0)
- `.opencode/themes/.gitignore` (+1, -0)
- `.opencode/tui.json` (+18, -0)
- `bun.lock` (+138, -161)
- `flake.nix` (+1, -0)
- `nix/hashes.json` (+4, -4)
- `nix/kilo.nix` (+4, -0)
- `nix/node_modules.nix` (+2, -1)
- `package.json` (+7, -6)
- `packages/app/e2e/actions.ts` (+4, -1)
- `packages/app/e2e/selectors.ts` (+2, -1)
- `packages/app/e2e/session/session-composer-dock.spec.ts` (+14, -7)
- `packages/app/e2e/session/session-model-persistence.spec.ts` (+119, -73)
- `packages/app/e2e/settings/settings.spec.ts` (+242, -53)
- `packages/app/index.html` (+1, -1)
- `packages/app/src/app.tsx` (+14, -11)
- `packages/app/src/components/dialog-connect-provider.tsx` (+15, -4)
- `packages/app/src/components/dialog-select-mcp.tsx` (+45, -1)
- `packages/app/src/components/dialog-select-model-unpaid.tsx` (+14, -6)
- `packages/app/src/components/dialog-select-model.tsx` (+20, -15)
- `packages/app/src/components/prompt-input.tsx` (+8, -4)
- `packages/app/src/components/session-context-usage.tsx` (+3, -1)
- `packages/app/src/components/session/session-context-tab.tsx` (+3, -1)
- `packages/app/src/components/settings-general.tsx` (+52, -46)
- `packages/app/src/components/status-popover-body.tsx` (+445, -0)
- `packages/app/src/components/status-popover.tsx` (+21, -389)
- `packages/app/src/context/global-sdk.tsx` (+82, -60)
- `packages/app/src/context/global-sync.tsx` (+27, -2)
- `packages/app/src/context/global-sync/bootstrap.ts` (+137, -58)
- `packages/app/src/context/global-sync/child-store.ts` (+3, -0)
- `packages/app/src/context/global-sync/types.ts` (+3, -0)
- `packages/app/src/context/layout.tsx` (+31, -16)
- `packages/app/src/context/local.tsx` (+20, -2)
- `packages/app/src/context/server.tsx` (+9, -1)
- `packages/app/src/context/settings.tsx` (+55, -40)
- `packages/app/src/entry.tsx` (+1, -1)
- `packages/app/src/hooks/use-providers.ts` (+1, -1)
- `packages/app/src/i18n/ar.ts` (+5, -17)
- `packages/app/src/i18n/br.ts` (+4, -15)
- `packages/app/src/i18n/bs.ts` (+4, -15)
- `packages/app/src/i18n/da.ts` (+4, -15)
- `packages/app/src/i18n/de.ts` (+4, -15)
- `packages/app/src/i18n/en.ts` (+4, -15)
- `packages/app/src/i18n/es.ts` (+4, -15)
- `packages/app/src/i18n/fr.ts` (+4, -15)
- `packages/app/src/i18n/ja.ts` (+4, -15)
- `packages/app/src/i18n/ko.ts` (+4, -15)
- `packages/app/src/i18n/no.ts` (+4, -15)
- `packages/app/src/i18n/pl.ts` (+4, -15)
- `packages/app/src/i18n/ru.ts` (+4, -15)
- `packages/app/src/i18n/th.ts` (+4, -15)
- `packages/app/src/i18n/tr.ts` (+4, -16)
- `packages/app/src/i18n/zh.ts` (+4, -16)
- `packages/app/src/i18n/zht.ts` (+4, -15)
- `packages/app/src/pages/directory-layout.tsx` (+7, -0)
- `packages/app/src/pages/session.tsx` (+69, -138)
- `packages/app/src/pages/session/composer/session-composer-region.tsx` (+1, -7)
- `packages/app/src/pages/session/composer/session-question-dock.tsx` (+100, -115)
- `packages/app/src/pages/session/file-tabs.tsx` (+142, -131)
- `packages/app/src/pages/session/message-timeline.tsx` (+4, -1)
- `packages/app/src/pages/session/session-side-panel.tsx` (+5, -4)
- `packages/app/src/pages/session/use-session-commands.tsx` (+440, -356)
- `packages/app/src/testing/model-selection.ts` (+32, -3)
- `packages/desktop-electron/electron-builder.config.ts` (+24, -1)
- `packages/desktop-electron/electron.vite.config.ts` (+2, -2)
- `packages/desktop-electron/icons/README.md` (+3, -0)
- `packages/desktop-electron/icons/beta/dock.png` (+-, --)
- `packages/desktop-electron/icons/dev/dock.png` (+-, --)
- `packages/desktop-electron/icons/prod/dock.png` (+-, --)
- `packages/desktop-electron/scripts/finalize-latest-yml.ts` (+2, -2)
- `packages/desktop-electron/scripts/predev.ts` (+1, -1)
- `packages/desktop-electron/scripts/prepare.ts` (+2, -1)
- `packages/desktop-electron/scripts/utils.ts` (+4, -1)
- `packages/desktop-electron/src/main/cli.ts` (+5, -5)
- `packages/desktop-electron/src/main/constants.ts` (+1, -1)
- `packages/desktop-electron/src/main/env.d.ts` (+1, -1)
- `packages/desktop-electron/src/main/index.ts` (+2, -2)
- `packages/desktop-electron/src/main/windows.ts` (+3, -2)
- `packages/desktop-electron/src/renderer/index.tsx` (+8, -8)
- `packages/desktop-electron/src/renderer/updater.ts` (+1, -1)
- `packages/desktop/scripts/finalize-latest-json.ts` (+4, -4)
- `packages/desktop/scripts/prepare.ts` (+2, -1)
- `packages/desktop/scripts/utils.ts` (+3, -0)
- `packages/desktop/src-tauri/tauri.beta.conf.json` (+4, -0)
- `packages/desktop/src-tauri/tauri.conf.json` (+4, -0)
- `packages/desktop/src-tauri/tauri.prod.conf.json` (+4, -0)
- `packages/desktop/src/i18n/de.ts` (+1, -2)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/kilo-docs/markdoc/partials/cli-commands-table.md` (+1, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli-reference.md` (+35, -21)
- `packages/kilo-docs/source-links.md` (+3, -370)
- `packages/kilo-gateway/package.json` (+4, -4)
- `packages/kilo-gateway/src/index.ts` (+1, -1)
- `packages/kilo-gateway/src/provider-debug.ts` (+1, -1)
- `packages/kilo-gateway/src/provider.ts` (+4, -1)
- `packages/kilo-gateway/src/types.ts` (+4, -4)
- `packages/kilo-ui/src/stories/font.stories.tsx` (+1, -18)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-accordion/default-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-accordion/multiple-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-appicon/all-icons-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-avatar/default-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-basictool/all-variants-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-basictool/default-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-basictool/generic-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-basictool/with-args-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-card/all-variants-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-card/error-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-card/info-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-card/normal-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-card/success-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-card/warning-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-checkbox/all-variants-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-checkbox/checked-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-checkbox/disabled-checked-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-checkbox/disabled-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-checkbox/indeterminate-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-checkbox/unchecked-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-checkbox/with-description-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-collapsible/all-variants-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-collapsible/collapsed-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-collapsible/ghost-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-collapsible/normal-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-contextmenu/default-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-contextmenu/with-groups-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-diffchanges/all-variants-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-diffchanges/default-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-dropdownmenu/with-groups-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-fileicon/all-variants-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-hovercard/default-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-icon/all-icons-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-icon/default-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-icon/large-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-icon/medium-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-icon/small-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-iconbutton/ghost-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-iconbutton/large-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-iconbutton/primary-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-iconbutton/secondary-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-iconbutton/small-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-inlineinput/controlled-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-inlineinput/default-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-inlineinput/disabled-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-inlineinput/with-width-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-keybind/combination-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-list/default-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-list/with-search-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-markdown/short-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-messagenav/all-variants-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-messagenav/normal-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-messagepart/assistant-message-story-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-messagepart/full-conversation-turn-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-messagepart/tool-hint-errors-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-messagepart/user-message-story-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-messagepart/with-bash-tool-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-messagepart/with-context-group-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-messagepart/with-reasoning-collapsed-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-messagepart/with-reasoning-expanded-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-progress/all-variants-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-providericon/all-icons-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-radiogroup/all-variants-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-radiogroup/medium-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-radiogroup/small-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-radiogroup/with-custom-labels-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-sessionturn/default-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-sessionturn/with-steps-expanded-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-switch/all-variants-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-switch/disabled-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-switch/disabled-on-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-switch/off-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-switch/on-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-switch/with-description-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-tabs/all-variants-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-tabs/alt-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-tabs/normal-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-tag/all-variants-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-tag/large-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-tag/normal-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-textfield/ghost-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-textfield/with-description-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-textfield/with-error-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-tooltip/force-open-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-tooltip/placement-chromium-linux.png` (+2, -2)
- `packages/opencode/.gitignore` (+2, -1)
- `packages/opencode/bunfig.toml` (+1, -1)
- `packages/opencode/package.json` (+38, -36)
- `packages/opencode/script/build.ts` (+25, -18)
- `packages/opencode/script/upgrade-opentui.ts` (+64, -0)
- `packages/opencode/specs/effect-migration.md` (+122, -19)
- `packages/opencode/specs/tui-plugins.md` (+397, -0)
- `packages/opencode/src/acp/README.md` (+1, -1)
- `packages/opencode/src/auth/index.ts` (+13, -19)
- `packages/opencode/src/bun/index.ts` (+6, -5)
- `packages/opencode/src/bun/registry.ts` (+6, -0)
- `packages/opencode/src/cli/cmd/db.ts` (+3, -2)
- `packages/opencode/src/cli/cmd/plug.ts` (+231, -0)
- `packages/opencode/src/cli/cmd/run.ts` (+6, -12)
- `packages/opencode/src/cli/cmd/tui/app.tsx` (+213, -268)
- `packages/opencode/src/cli/cmd/tui/component/dialog-command.tsx` (+30, -6)
- `packages/opencode/src/cli/cmd/tui/component/dialog-model.tsx` (+18, -4)
- `packages/opencode/src/cli/cmd/tui/component/dialog-status.tsx` (+2, -1)
- `packages/opencode/src/cli/cmd/tui/component/dialog-variant.tsx` (+39, -0)
- `packages/opencode/src/cli/cmd/tui/component/dialog-workspace-list.tsx` (+13, -20)
- `packages/opencode/src/cli/cmd/tui/component/error-component.tsx` (+91, -0)
- `packages/opencode/src/cli/cmd/tui/component/plugin-route-missing.tsx` (+14, -0)
- `packages/opencode/src/cli/cmd/tui/component/prompt/index.tsx` (+61, -21)
- `packages/opencode/src/cli/cmd/tui/component/startup-loading.tsx` (+63, -0)
- `packages/opencode/src/cli/cmd/tui/context/exit.tsx` (+2, -1)
- `packages/opencode/src/cli/cmd/tui/context/keybind.tsx` (+12, -9)
- `packages/opencode/src/cli/cmd/tui/context/local.tsx` (+8, -2)
- `packages/opencode/src/cli/cmd/tui/context/plugin-keybinds.ts` (+41, -0)
- `packages/opencode/src/cli/cmd/tui/context/route.tsx` (+7, -2)
- `packages/opencode/src/cli/cmd/tui/context/sdk.tsx` (+3, -0)
- `packages/opencode/src/cli/cmd/tui/context/theme.tsx` (+153, -116)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/home/footer.tsx` (+93, -0)
- `packages/opencode/src/cli/cmd/tui/{component/tips.tsx => feature-plugins/home/tips-view.tsx}` (+2, -1)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/home/tips.tsx` (+50, -0)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/sidebar/context.tsx` (+63, -0)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/sidebar/files.tsx` (+62, -0)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/sidebar/footer.tsx` (+93, -0)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/sidebar/lsp.tsx` (+66, -0)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/sidebar/mcp.tsx` (+96, -0)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/sidebar/todo.tsx` (+48, -0)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/system/plugins.tsx` (+270, -0)
- `packages/opencode/src/cli/cmd/tui/plugin/api.tsx` (+424, -0)
- `packages/opencode/src/cli/cmd/tui/plugin/index.ts` (+3, -0)
- `packages/opencode/src/cli/cmd/tui/plugin/internal.ts` (+37, -0)
- `packages/opencode/src/cli/cmd/tui/plugin/runtime.ts` (+985, -0)
- `packages/opencode/src/cli/cmd/tui/plugin/slots.tsx` (+61, -0)
- `packages/opencode/src/cli/cmd/tui/routes/home.tsx` (+24, -133)
- `packages/opencode/src/cli/cmd/tui/routes/session/header.tsx` (+0, -172)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+8, -36)
- `packages/opencode/src/cli/cmd/tui/routes/session/question.tsx` (+1, -0)
- `packages/opencode/src/cli/cmd/tui/routes/session/sidebar.tsx` (+25, -285)
- `packages/opencode/src/cli/cmd/tui/routes/session/subagent-footer.tsx` (+131, -0)
- `packages/opencode/src/cli/cmd/tui/thread.ts` (+4, -3)
- `packages/opencode/src/cli/cmd/tui/ui/dialog-export-options.tsx` (+1, -0)
- `packages/opencode/src/cli/cmd/tui/ui/dialog-prompt.tsx` (+34, -8)
- `packages/opencode/src/cli/cmd/tui/ui/dialog-select.tsx` (+1, -0)
- `packages/opencode/src/cli/cmd/tui/ui/dialog.tsx` (+14, -4)
- `packages/opencode/src/cli/cmd/tui/worker.ts` (+31, -40)
- `packages/opencode/src/cli/cmd/workspace-serve.ts` (+0, -16)
- `packages/opencode/src/cli/error.ts` (+2, -13)
- `packages/opencode/src/cli/network.ts` (+1, -1)
- `packages/opencode/src/cli/upgrade.ts` (+1, -1)
- `packages/opencode/src/command/index.ts` (+19, -9)
- `packages/opencode/src/config/config.ts` (+665, -752)
- `packages/opencode/src/config/migrate-tui-config.ts` (+1, -1)
- `packages/opencode/src/config/tui-schema.ts` (+2, -0)
- `packages/opencode/src/config/tui.ts` (+131, -27)
- `packages/opencode/src/control-plane/adaptors/worktree.ts` (+2, -9)
- `packages/opencode/src/control-plane/workspace-context.ts` (+0, -24)
- `packages/opencode/src/control-plane/workspace-router-middleware.ts` (+0, -50)
- `packages/opencode/src/control-plane/workspace-server/routes.ts` (+0, -33)
- `packages/opencode/src/control-plane/workspace-server/server.ts` (+0, -65)
- `packages/opencode/src/effect/cross-spawn-spawner.ts` (+5, -2)
- `packages/opencode/src/effect/instance-state.ts` (+2, -2)
- `packages/opencode/src/effect/run-service.ts` (+2, -0)
- `packages/opencode/src/effect/runner.ts` (+216, -0)
- `packages/opencode/src/file/index.ts` (+80, -87)
- `packages/opencode/src/file/time.ts` (+16, -16)
- `packages/opencode/src/file/watcher.ts` (+6, -2)
- `packages/opencode/src/filesystem/index.ts` (+31, -2)
- `packages/opencode/src/flag/flag.ts` (+25, -0)
- `packages/opencode/src/format/index.ts` (+46, -30)
- `packages/opencode/src/global/index.ts` (+1, -1)
- `packages/opencode/src/index.ts` (+17, -11)
- `packages/opencode/src/installation/index.ts` (+3, -6)
- `packages/opencode/src/kilo-sessions/ingest-queue.ts` (+2, -2)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+2, -1)
- `packages/opencode/src/kilocode/cli/cmd/tui/app.tsx` (+177, -0)
- `packages/opencode/src/kilocode/commands.ts` (+2, -0)
- `packages/opencode/src/kilocode/config/config.ts` (+344, -0)
- `packages/opencode/src/kilocode/mcp-migrator.ts` (+5, -2)
- `packages/opencode/src/kilocode/plan-followup.ts` (+1, -1)
- `packages/opencode/src/kilocode/plugins/home-footer.tsx` (+148, -0)
- `packages/opencode/src/kilocode/plugins/home-news.tsx` (+44, -0)
- `packages/opencode/src/kilocode/plugins/home-onboarding.tsx` (+40, -0)
- `packages/opencode/src/kilocode/plugins/sidebar-footer.tsx` (+95, -0)
- `packages/opencode/src/kilocode/server/instance.ts` (+57, -0)
- `packages/opencode/src/kilocode/server/router.ts` (+6, -0)
- `packages/opencode/src/kilocode/server/server.ts` (+26, -0)
- `packages/opencode/src/kilocode/session/index.ts` (+276, -0)
- `packages/opencode/src/kilocode/session/processor.ts` (+125, -0)
- `packages/opencode/src/kilocode/session/prompt.ts` (+143, -0)
- `packages/opencode/src/kilocode/snapshot.ts` (+0, -62)
- `packages/opencode/src/kilocode/snapshot/index.ts` (+152, -0)
- `packages/opencode/src/lsp/index.ts` (+409, -362)
- `packages/opencode/src/mcp/index.ts` (+266, -277)
- `packages/opencode/src/plugin/index.ts` (+188, -89)
- `packages/opencode/src/plugin/install.ts` (+384, -0)
- `packages/opencode/src/plugin/loader.ts` (+135, -0)
- `packages/opencode/src/plugin/meta.ts` (+188, -0)
- `packages/opencode/src/plugin/shared.ts` (+277, -0)
- `packages/opencode/src/project/instance.ts` (+5, -4)
- `packages/opencode/src/project/project.ts` (+9, -10)
- `packages/opencode/src/project/vcs.ts` (+26, -13)
- `packages/opencode/src/provider/auth.ts` (+4, -4)
- `packages/opencode/src/provider/error.ts` (+3, -0)
- `packages/opencode/src/provider/models-snapshot.js` (+66203, -1)
- `packages/opencode/src/provider/models-snapshot.ts` (+66215, -0)
- `packages/opencode/src/provider/provider.ts` (+57, -18)
- `packages/opencode/src/provider/sdk/copilot/chat/convert-to-openai-compatible-chat-messages.ts` (+10, -4)
- `packages/opencode/src/provider/sdk/copilot/chat/map-openai-compatible-finish-reason.ts` (+5, -3)
- `packages/opencode/src/provider/sdk/copilot/chat/openai-compatible-chat-language-model.ts` (+74, -39)
- `packages/opencode/src/provider/sdk/copilot/chat/openai-compatible-metadata-extractor.ts` (+3, -3)
- `packages/opencode/src/provider/sdk/copilot/chat/openai-compatible-prepare-tools.ts` (+7, -11)
- `packages/opencode/src/provider/sdk/copilot/copilot-provider.ts` (+5, -5)
- `packages/opencode/src/provider/sdk/copilot/responses/convert-to-openai-responses-input.ts` (+39, -7)
- `packages/opencode/src/provider/sdk/copilot/responses/map-openai-responses-finish-reason.ts` (+3, -3)
- `packages/opencode/src/provider/sdk/copilot/responses/openai-responses-api-types.ts` (+7, -0)
- `packages/opencode/src/provider/sdk/copilot/responses/openai-responses-language-model.ts` (+112, -75)
- `packages/opencode/src/provider/sdk/copilot/responses/openai-responses-prepare-tools.ts` (+7, -11)
- `packages/opencode/src/provider/transform.ts` (+59, -26)
- `packages/opencode/src/pty/index.ts` (+2, -2)
- `packages/opencode/src/server/instance.ts` (+264, -0)
- `packages/opencode/src/server/middleware.ts` (+33, -0)
- `packages/opencode/src/server/router.ts` (+99, -0)
- `packages/opencode/src/server/routes/event.ts` (+3, -4)
- `packages/opencode/src/server/routes/global.ts` (+3, -2)
- `packages/opencode/src/server/routes/session.ts` (+2, -2)
- `packages/opencode/src/server/server.ts` (+204, -518)
- `packages/opencode/src/session/compaction.ts` (+328, -245)
- `packages/opencode/src/session/index.ts` (+521, -595)
- `packages/opencode/src/session/instruction.ts` (+1, -1)
- `packages/opencode/src/session/llm.ts` (+74, -29)
- `packages/opencode/src/session/message-v2.ts` (+39, -6)
- `packages/opencode/src/session/overflow.ts` (+22, -0)
- `packages/opencode/src/session/processor.ts` (+521, -515)
- `packages/opencode/src/session/prompt.ts` (+1617, -1823)
- `packages/opencode/src/session/prompt/gpt.txt` (+107, -0)
- `packages/opencode/src/session/retry.ts` (+66, -36)
- `packages/opencode/src/session/revert.ts` (+2, -5)
- `packages/opencode/src/session/summary.ts` (+2, -3)
- `packages/opencode/src/session/system.ts` (+7, -1)
- `packages/opencode/src/shell/shell.ts` (+56, -19)
- `packages/opencode/src/skill/index.ts` (+92, -52)
- `packages/opencode/src/snapshot/index.ts` (+366, -504)
- `packages/opencode/src/storage/db.ts` (+7, -6)
- `packages/opencode/src/util/error.ts` (+77, -0)
- `packages/opencode/src/util/filesystem.ts` (+21, -4)
- `packages/opencode/src/util/flock.ts` (+333, -0)
- `packages/opencode/src/util/{proxied.ts => network.ts}` (+6, -0)
- `packages/opencode/src/util/process.ts` (+2, -1)
- `packages/opencode/src/util/record.ts` (+3, -0)
- `packages/opencode/src/worktree/index.ts` (+24, -17)
- `packages/opencode/test/cli/tui/keybind-plugin.test.ts` (+90, -0)
- `packages/opencode/test/cli/tui/plugin-add.test.ts` (+61, -0)
- `packages/opencode/test/cli/tui/plugin-install.test.ts` (+96, -0)
- `packages/opencode/test/cli/tui/plugin-lifecycle.test.ts` (+225, -0)
- `packages/opencode/test/cli/tui/plugin-loader-entrypoint.test.ts` (+486, -0)
- `packages/opencode/test/cli/tui/plugin-loader-pure.test.ts` (+72, -0)
- `packages/opencode/test/cli/tui/plugin-loader.test.ts` (+752, -0)
- `packages/opencode/test/cli/tui/plugin-toggle.test.ts` (+159, -0)
- `packages/opencode/test/cli/tui/theme-store.test.ts` (+51, -0)
- `packages/opencode/test/cli/tui/thread.test.ts` (+41, -70)
- `packages/opencode/test/config/config.test.ts` (+393, -243)
- `packages/opencode/test/config/tui.test.ts` (+187, -24)
- `packages/opencode/test/control-plane/session-proxy-middleware.test.ts` (+0, -159)
- `packages/opencode/test/control-plane/workspace-server-sse.test.ts` (+0, -70)
- `packages/opencode/test/control-plane/workspace-sync.test.ts` (+0, -99)
- `packages/opencode/test/effect/cross-spawn-spawner.test.ts` (+4, -4)
- `packages/opencode/test/effect/runner.test.ts` (+523, -0)
- `packages/opencode/test/file/watcher.test.ts` (+2, -0)
- `packages/opencode/test/fixture/flock-worker.ts` (+72, -0)
- `packages/opencode/test/fixture/plug-worker.ts` (+93, -0)
- `packages/opencode/test/fixture/plugin-meta-worker.ts` (+26, -0)
- `packages/opencode/test/fixture/tui-plugin.ts` (+335, -0)
- `packages/opencode/test/fixture/tui-runtime.ts` (+27, -0)
- `packages/opencode/test/format/format.test.ts` (+3, -6)
- `packages/opencode/test/kilocode/config-resilience.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/help.test.ts` (+14, -0)
- `packages/opencode/test/kilocode/session-processor-empty-tool-calls.test.ts` (+219, -192)
- `packages/opencode/test/kilocode/session-processor-network-offline.test.ts` (+179, -127)
- `packages/opencode/test/kilocode/session-processor-retry-limit.test.ts` (+201, -166)
- `packages/opencode/test/lsp/lifecycle.test.ts` (+147, -0)
- `packages/opencode/test/mcp/lifecycle.test.ts` (+95, -5)
- `packages/opencode/test/plugin/auth-override.test.ts` (+14, -12)
- `packages/opencode/test/plugin/install-concurrency.test.ts` (+134, -0)
- `packages/opencode/test/plugin/install.test.ts` (+504, -0)
- `packages/opencode/test/plugin/loader-shared.test.ts` (+836, -0)
- `packages/opencode/test/plugin/meta.test.ts` (+137, -0)
- `packages/opencode/test/plugin/trigger.test.ts` (+111, -0)
- `packages/opencode/test/preload.ts` (+6, -6)
- `packages/opencode/test/project/project.test.ts` (+4, -4)
- `packages/opencode/test/provider/copilot/copilot-chat-model.test.ts` (+14, -14)
- `packages/opencode/test/provider/gitlab-duo.test.ts` (+394, -390)
- `packages/opencode/test/provider/transform.test.ts` (+6, -7)
- `packages/opencode/test/pty/pty-shell.test.ts` (+59, -0)
- `packages/opencode/test/server/session-actions.test.ts` (+83, -0)
- `packages/opencode/test/server/session-list.test.ts` (+19, -11)
- `packages/opencode/test/server/session-messages.test.ts` (+15, -8)
- `packages/opencode/test/server/session-select.test.ts` (+12, -6)
- `packages/opencode/test/session/compaction.test.ts` (+788, -9)
- `packages/opencode/test/session/llm.test.ts` (+343, -4)
- `packages/opencode/test/session/message-v2.test.ts` (+26, -26)
- `packages/opencode/test/session/network.test.ts` (+9, -8)
- `packages/opencode/test/session/processor-effect.test.ts` (+872, -0)
- `packages/opencode/test/session/prompt-concurrency.test.ts` (+247, -0)
- `packages/opencode/test/session/prompt-effect.test.ts` (+1205, -0)
- `packages/opencode/test/session/prompt.test.ts` (+231, -1)
- `packages/opencode/test/session/retry.test.ts` (+48, -20)
- `packages/opencode/test/session/structured-output.test.ts` (+11, -6)
- `packages/opencode/test/session/system.test.ts` (+3, -3)
- `packages/opencode/test/shell/shell.test.ts` (+73, -0)
- `packages/opencode/test/util/error.test.ts` (+38, -0)
- `packages/opencode/test/util/filesystem.test.ts` (+9, -0)
- `packages/opencode/test/util/flock.test.ts` (+383, -0)
- `packages/opencode/test/util/process.test.ts` (+5, -5)
- `packages/plugin/package.json` (+16, -2)
- `packages/plugin/src/index.ts` (+19, -4)
- `packages/plugin/src/tui.ts` (+441, -0)
- `packages/script/src/index.ts` (+1, -1)
- `packages/sdk/js/src/client.ts` (+25, -0)
- `packages/sdk/js/src/v2/client.ts` (+45, -3)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+1020, -1020)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+1233, -1225)
- `packages/sdk/openapi.json` (+4895, -4384)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/assets/fonts/BlexMonoNerdFontMono-Bold.woff2` (+-, --)
- `packages/ui/src/assets/fonts/BlexMonoNerdFontMono-Medium.woff2` (+-, --)
- `packages/ui/src/assets/fonts/BlexMonoNerdFontMono-Regular.woff2` (+-, --)
- `packages/ui/src/assets/fonts/CaskaydiaCoveNerdFontMono-Bold.woff2` (+-, --)
- `packages/ui/src/assets/fonts/CaskaydiaCoveNerdFontMono-Regular.woff2` (+-, --)
- `packages/ui/src/assets/fonts/FiraCodeNerdFontMono-Bold.woff2` (+-, --)
- `packages/ui/src/assets/fonts/FiraCodeNerdFontMono-Regular.woff2` (+-, --)
- `packages/ui/src/assets/fonts/GeistMonoNerdFontMono-Bold.woff2` (+-, --)
- `packages/ui/src/assets/fonts/GeistMonoNerdFontMono-Medium.woff2` (+-, --)
- `packages/ui/src/assets/fonts/GeistMonoNerdFontMono-Regular.woff2` (+-, --)
- `packages/ui/src/assets/fonts/HackNerdFontMono-Bold.woff2` (+-, --)
- `packages/ui/src/assets/fonts/HackNerdFontMono-Regular.woff2` (+-, --)
- `packages/ui/src/assets/fonts/InconsolataNerdFontMono-Bold.woff2` (+-, --)
- `packages/ui/src/assets/fonts/InconsolataNerdFontMono-Regular.woff2` (+-, --)
- `packages/ui/src/assets/fonts/IntoneMonoNerdFontMono-Bold.woff2` (+-, --)
- `packages/ui/src/assets/fonts/IntoneMonoNerdFontMono-Regular.woff2` (+-, --)
- `packages/ui/src/assets/fonts/JetBrainsMonoNerdFontMono-Bold.woff2` (+-, --)
- `packages/ui/src/assets/fonts/JetBrainsMonoNerdFontMono-Regular.woff2` (+-, --)
- `packages/ui/src/assets/fonts/MesloLGSNerdFontMono-Bold.woff2` (+-, --)
- `packages/ui/src/assets/fonts/MesloLGSNerdFontMono-Regular.woff2` (+-, --)
- `packages/ui/src/assets/fonts/RobotoMonoNerdFontMono-Bold.woff2` (+-, --)
- `packages/ui/src/assets/fonts/RobotoMonoNerdFontMono-Regular.woff2` (+-, --)
- `packages/ui/src/assets/fonts/SauceCodeProNerdFontMono-Bold.woff2` (+-, --)
- `packages/ui/src/assets/fonts/SauceCodeProNerdFontMono-Regular.woff2` (+-, --)
- `packages/ui/src/assets/fonts/UbuntuMonoNerdFontMono-Bold.woff2` (+-, --)
- `packages/ui/src/assets/fonts/UbuntuMonoNerdFontMono-Regular.woff2` (+-, --)
- `packages/ui/src/assets/fonts/cascadia-code-nerd-font-bold.woff2` (+0, -1)
- `packages/ui/src/assets/fonts/cascadia-code-nerd-font.woff2` (+0, -1)
- `packages/ui/src/assets/fonts/fira-code-nerd-font-bold.woff2` (+0, -1)
- `packages/ui/src/assets/fonts/fira-code-nerd-font.woff2` (+0, -1)
- `packages/ui/src/assets/fonts/geist-italic-medium.otf` (+-, --)
- `packages/ui/src/assets/fonts/geist-italic-regular.otf` (+-, --)
- `packages/ui/src/assets/fonts/geist-italic.ttf` (+-, --)
- `packages/ui/src/assets/fonts/geist-italic.woff2` (+-, --)
- `packages/ui/src/assets/fonts/geist-medium.otf` (+-, --)
- `packages/ui/src/assets/fonts/geist-mono-bold.woff2` (+0, -1)
- `packages/ui/src/assets/fonts/geist-mono-italic.ttf` (+-, --)
- `packages/ui/src/assets/fonts/geist-mono-italic.woff2` (+-, --)
- `packages/ui/src/assets/fonts/geist-mono-medium.woff2` (+0, -1)
- `packages/ui/src/assets/fonts/geist-mono.ttf` (+-, --)
- `packages/ui/src/assets/fonts/geist-mono.woff2` (+0, -1)
- `packages/ui/src/assets/fonts/geist-regular.otf` (+-, --)
- `packages/ui/src/assets/fonts/geist.ttf` (+-, --)
- `packages/ui/src/assets/fonts/geist.woff2` (+-, --)
- `packages/ui/src/assets/fonts/hack-nerd-font-bold.woff2` (+0, -1)
- `packages/ui/src/assets/fonts/hack-nerd-font.woff2` (+0, -1)
- `packages/ui/src/assets/fonts/ibm-plex-mono-bold.woff2` (+0, -1)
- `packages/ui/src/assets/fonts/ibm-plex-mono-medium.woff2` (+0, -1)
- `packages/ui/src/assets/fonts/ibm-plex-mono.otf` (+-, --)
- `packages/ui/src/assets/fonts/ibm-plex-mono.woff2` (+0, -1)
- `packages/ui/src/assets/fonts/inconsolata-nerd-font-bold.woff2` (+0, -1)
- `packages/ui/src/assets/fonts/inconsolata-nerd-font.woff2` (+0, -1)
- `packages/ui/src/assets/fonts/intel-one-mono-nerd-font-bold.woff2` (+0, -1)
- `packages/ui/src/assets/fonts/intel-one-mono-nerd-font.woff2` (+0, -1)
- `packages/ui/src/assets/fonts/inter-italic.otf` (+-, --)
- `packages/ui/src/assets/fonts/inter-italic.woff2` (+-, --)
- `packages/ui/src/assets/fonts/inter.otf` (+-, --)
- `packages/ui/src/assets/fonts/inter.woff2` (+-, --)
- `packages/ui/src/assets/fonts/iosevka-nerd-font-bold.woff2` (+-, --)
- `packages/ui/src/assets/fonts/iosevka-nerd-font.woff2` (+-, --)
- `packages/ui/src/assets/fonts/jetbrains-mono-nerd-font-bold.woff2` (+0, -1)
- `packages/ui/src/assets/fonts/jetbrains-mono-nerd-font.woff2` (+0, -1)
- `packages/ui/src/assets/fonts/meslo-lgs-nerd-font-bold.woff2` (+0, -1)
- `packages/ui/src/assets/fonts/meslo-lgs-nerd-font.woff2` (+0, -1)
- `packages/ui/src/assets/fonts/roboto-mono-nerd-font-bold.woff2` (+0, -1)
- `packages/ui/src/assets/fonts/roboto-mono-nerd-font.woff2` (+0, -1)
- `packages/ui/src/assets/fonts/source-code-pro-nerd-font-bold.woff2` (+0, -1)
- `packages/ui/src/assets/fonts/source-code-pro-nerd-font.woff2` (+0, -1)
- `packages/ui/src/assets/fonts/ubuntu-mono-nerd-font-bold.woff2` (+0, -1)
- `packages/ui/src/assets/fonts/ubuntu-mono-nerd-font.woff2` (+0, -1)
- `packages/ui/src/components/collapsible.css` (+2, -1)
- `packages/ui/src/components/font.stories.tsx` (+5, -5)
- `packages/ui/src/components/font.tsx` (+1, -143)
- `packages/ui/src/components/markdown-stream.test.ts` (+32, -0)
- `packages/ui/src/components/markdown-stream.ts` (+49, -0)
- `packages/ui/src/components/markdown.tsx` (+55, -53)
- `packages/ui/src/components/message-part.css` (+8, -5)
- `packages/ui/src/components/message-part.tsx` (+76, -50)
- `packages/ui/src/components/timeline-playground.stories.tsx` (+46, -2)
- `packages/ui/src/font-loader.ts` (+0, -133)
- `packages/ui/src/styles/theme.css` (+5, -4)
- `patches/@ai-sdk%2Fanthropic@3.0.64.patch` (+119, -0)
- `patches/@ai-sdk%2Fprovider-utils@4.0.21.patch` (+61, -0)
- `patches/@ai-sdk%2Fxai@2.0.51.patch` (+0, -108)
- `patches/@openrouter%2Fai-sdk-provider@1.5.4.patch` (+0, -128)
- `script/changelog.ts` (+161, -47)
- `script/extract-source-links.ts` (+1, -1)
- `script/sign-windows.ps1` (+70, -0)
- `script/upstream/transforms/package-names.ts` (+19, -1)
- `script/version.ts` (+2, -1)
- `turbo.json` (+2, -1)

### Key Diffs

#### .opencode/agent/docs.md
```diff
diff --git a/.opencode/agent/docs.md b/.opencode/agent/docs.md
deleted file mode 100644
index 21cfc6a16..000000000
--- a/.opencode/agent/docs.md
+++ /dev/null
@@ -1,34 +0,0 @@
----
-description: ALWAYS use this when writing docs
-color: "#38A3EE"
----
-
-You are an expert technical documentation writer
-
-You are not verbose
-
-Use a relaxed and friendly tone
-
-The title of the page should be a word or a 2-3 word phrase
-
-The description should be one short line, should not start with "The", should
-avoid repeating the title of the page, should be 5-10 words long
-
-Chunks of text should not be more than 2 sentences long
-
-Each section is separated by a divider of 3 dashes
-
-The section titles are short with only the first letter of the word capitalized
-
-The section titles are in the imperative mood
-
-The section titles should not repeat the term used in the page title, for
-example, if the page title is "Models", avoid using a section title like "Add
-new models". This might be unavoidable in some cases, but try to avoid it.
-
-Check out the /packages/web/src/content/docs/docs/index.mdx as an example.
-
-For JS or TS code snippets remove trailing semicolons and any trailing commas
-that might not be needed.
-
-If you are making a commit prefix the commit message with `docs:`
```

#### packages/opencode/src/agent/agent.ts
```diff
diff --git a/packages/opencode/src/agent/agent.ts b/packages/opencode/src/agent/agent.ts
index 300f0ab0d..4fda999a2 100644
--- a/packages/opencode/src/agent/agent.ts
+++ b/packages/opencode/src/agent/agent.ts
@@ -75,13 +75,14 @@ export namespace Agent {
   export const layer = Layer.effect(
     Service,
     Effect.gen(function* () {
-      const config = () => Effect.promise(() => Config.get())
+      const config = yield* Config.Service
       const auth = yield* Auth.Service
+      const skill = yield* Skill.Service
 
       const state = yield* InstanceState.make<State>(
         Effect.fn("Agent.state")(function* (ctx) {
-          const cfg = yield* config()
-          const skillDirs = yield* Effect.promise(() => Skill.dirs())
+          const cfg = yield* config.get()
+          const skillDirs = yield* skill.dirs()
           const whitelistedDirs = [Truncate.GLOB, ...skillDirs.map((dir) => path.join(dir, "*"))]
 
           const baseDefaults = Permission.fromConfig({
@@ -298,7 +299,7 @@ export namespace Agent {
           })
 
           const list = Effect.fnUntraced(function* () {
-            const cfg = yield* config()
+            const cfg = yield* config.get()
             return pipe(
               agents,
               values(),
@@ -310,7 +311,7 @@ export namespace Agent {
           })
 
           const defaultAgent = Effect.fnUntraced(function* () {
-            const c = yield* config()
+            const c = yield* config.get()
             if (c.default_agent) {
               const effective = KiloAgent.resolveKey(c.default_agent) // kilocode_change - treat "build" as "code"
               const agent = agents[effective] // kilocode_change
@@ -319,6 +320,10 @@ export namespace Agent {
               if (agent.hidden === true) throw new Error(`default agent "${c.default_agent}" is hidden`)
               return agent.name
             }
+            // kilocode_change start - prefer "code" as default agent (key order changes after rename from "build")
+            const code = agents.code
+            if (code && code.mode !== "subagent" && code.hidden !== true) return code.name
+            // kilocode_change end
             const visible = Object.values(agents).find((a) => a.mode !== "subagent" && a.hidden !== true)
             if (!visible) throw new Error("no primary visible agent found")
```

#### packages/opencode/src/provider/sdk/copilot/responses/tool/code-interpreter.ts
```diff
diff --git a/packages/opencode/src/provider/sdk/copilot/responses/tool/code-interpreter.ts b/packages/opencode/src/provider/sdk/copilot/responses/tool/code-interpreter.ts
index 2bb4bce77..909694ec7 100644
--- a/packages/opencode/src/provider/sdk/copilot/responses/tool/code-interpreter.ts
+++ b/packages/opencode/src/provider/sdk/copilot/responses/tool/code-interpreter.ts
@@ -1,4 +1,4 @@
-import { createProviderDefinedToolFactoryWithOutputSchema } from "@ai-sdk/provider-utils"
+import { createProviderToolFactoryWithOutputSchema } from "@ai-sdk/provider-utils"
 import { z } from "zod/v4"
 
 export const codeInterpreterInputSchema = z.object({
@@ -37,7 +37,7 @@ type CodeInterpreterArgs = {
   container?: string | { fileIds?: string[] }
 }
 
-export const codeInterpreterToolFactory = createProviderDefinedToolFactoryWithOutputSchema<
+export const codeInterpreterToolFactory = createProviderToolFactoryWithOutputSchema<
   {
     /**
      * The code to run, or null if not available.
@@ -76,7 +76,6 @@ export const codeInterpreterToolFactory = createProviderDefinedToolFactoryWithOu
   CodeInterpreterArgs
 >({
   id: "openai.code_interpreter",
-  name: "code_interpreter",
   inputSchema: codeInterpreterInputSchema,
   outputSchema: codeInterpreterOutputSchema,
 })
```

#### packages/opencode/src/provider/sdk/copilot/responses/tool/file-search.ts
```diff
diff --git a/packages/opencode/src/provider/sdk/copilot/responses/tool/file-search.ts b/packages/opencode/src/provider/sdk/copilot/responses/tool/file-search.ts
index 1fccddaf6..12a490e19 100644
--- a/packages/opencode/src/provider/sdk/copilot/responses/tool/file-search.ts
+++ b/packages/opencode/src/provider/sdk/copilot/responses/tool/file-search.ts
@@ -1,4 +1,4 @@
-import { createProviderDefinedToolFactoryWithOutputSchema } from "@ai-sdk/provider-utils"
+import { createProviderToolFactoryWithOutputSchema } from "@ai-sdk/provider-utils"
 import type {
   OpenAIResponsesFileSearchToolComparisonFilter,
   OpenAIResponsesFileSearchToolCompoundFilter,
@@ -43,7 +43,7 @@ export const fileSearchOutputSchema = z.object({
     .nullable(),
 })
 
-export const fileSearch = createProviderDefinedToolFactoryWithOutputSchema<
+export const fileSearch = createProviderToolFactoryWithOutputSchema<
   {},
   {
     /**
@@ -122,7 +122,6 @@ export const fileSearch = createProviderDefinedToolFactoryWithOutputSchema<
   }
 >({
   id: "openai.file_search",
-  name: "file_search",
   inputSchema: z.object({}),
   outputSchema: fileSearchOutputSchema,
 })
```

#### packages/opencode/src/provider/sdk/copilot/responses/tool/image-generation.ts
```diff
diff --git a/packages/opencode/src/provider/sdk/copilot/responses/tool/image-generation.ts b/packages/opencode/src/provider/sdk/copilot/responses/tool/image-generation.ts
index 7367a4802..b67bb76f9 100644
--- a/packages/opencode/src/provider/sdk/copilot/responses/tool/image-generation.ts
+++ b/packages/opencode/src/provider/sdk/copilot/responses/tool/image-generation.ts
@@ -1,4 +1,4 @@
-import { createProviderDefinedToolFactoryWithOutputSchema } from "@ai-sdk/provider-utils"
+import { createProviderToolFactoryWithOutputSchema } from "@ai-sdk/provider-utils"
 import { z } from "zod/v4"
 
 export const imageGenerationArgsSchema = z
@@ -92,7 +92,7 @@ type ImageGenerationArgs = {
   size?: "auto" | "1024x1024" | "1024x1536" | "1536x1024"
 }
 
-const imageGenerationToolFactory = createProviderDefinedToolFactoryWithOutputSchema<
+const imageGenerationToolFactory = createProviderToolFactoryWithOutputSchema<
   {},
   {
     /**
@@ -103,7 +103,6 @@ const imageGenerationToolFactory = createProviderDefinedToolFactoryWithOutputSch
   ImageGenerationArgs
 >({
   id: "openai.image_generation",
-  name: "image_generation",
   inputSchema: z.object({}),
   outputSchema: imageGenerationOutputSchema,
 })
```


*... and more files (showing first 5)*

## opencode Changes (74b14a2..cb1a500)

### Commits

- cb1a500 - fix(electron): wait until ready before showing the main window (#22262) (Brendan Allan, 2026-04-13)
- 65e3348 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-04-13)
- a6b9f0d - app: align workspace load more button (#22251) (Brendan Allan, 2026-04-13)
- 34f5bdb - app: fix scroll to bottom light mode style (#22250) (Brendan Allan, 2026-04-13)
- 0b4fe14 - fix: forgot to put alibaba case in last commit (#22249) (Aiden Cline, 2026-04-13)
- 7230cd2 - feat: add alibaba pkg and cache support (#22248) (Aiden Cline, 2026-04-13)
- a915fe7 - tweak: adjust session getUsage function to use more up to date LanguageModelUsage instead of LanguageModelV2Usage (#22224) (Aiden Cline, 2026-04-12)
- 26d3558 - sdk: throw error if response has text/html content type (#21289) (Brendan Allan, 2026-04-13)
- ae17b41 - fix(cli): auth login now asks for api key in handlePluginAuth (#21641) (Goni Zahavy, 2026-04-12)
- 8ffadde - chore: rm git ignored files (#22200) (Aiden Cline, 2026-04-12)
- 3c0ad70 - ci: enable beta branch releases with auto-update support (Dax Raad, 2026-04-12)
- 264418c - fix(snapshot): complete gitignore respect for previously tracked files (#22172) (Dax, 2026-04-12)
- fa2c69f - fix(opencode): remove spurious scripts and randomField from package.json (#22160) (shafdev, 2026-04-12)
- 113304a - fix(snapshot): respect gitignore for previously tracked files (#22171) (Dax, 2026-04-12)
- 8c4d49c - ci: enable signed Windows builds on beta branch (Dax Raad, 2026-04-12)
- 2aa6110 - ignore: exploration (Dax Raad, 2026-04-12)
- 8b9b9ad - fix: ensure images read by agent dont count against quota (#22168) (Aiden Cline, 2026-04-12)
- 3729fd5 - chore(github): vouch simonklee (#22127) (Simon Klee, 2026-04-12)

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
- `.github/VOUCHED.td` (+1, -0)
- `.github/workflows/publish.yml` (+3, -5)
- `bun.lock` (+5, -0)
- `nix/hashes.json` (+4, -4)
- `packages/app/src/pages/layout/sidebar-workspace.tsx` (+1, -1)
- `packages/app/src/pages/session/message-timeline.tsx` (+2, -2)
- `packages/desktop-electron/src/main/windows.ts` (+5, -1)
- `packages/opencode/package.json` (+1, -7)
- `packages/opencode/src/cli/cmd/providers.ts` (+7, -1)
- `packages/opencode/src/plugin/github-copilot/copilot.ts` (+19, -3)
- `packages/opencode/src/provider/models-snapshot.d.ts` (+0, -2)
- `packages/opencode/src/provider/models-snapshot.js` (+0, -66216)
- `packages/opencode/src/provider/provider.ts` (+2, -0)
- `packages/opencode/src/provider/transform.ts` (+5, -1)
- `packages/opencode/src/session/index.ts` (+9, -7)
- `packages/opencode/src/session/message-v2.ts` (+3, -1)
- `packages/opencode/src/snapshot/index.ts` (+87, -7)
- `packages/opencode/src/v2/message.ts` (+73, -26)
- `packages/opencode/src/v2/session.ts` (+71, -0)
- `packages/opencode/test/session/compaction.test.ts` (+90, -6)
- `packages/opencode/test/snapshot/snapshot.test.ts` (+112, -0)
- `packages/sdk/js/src/v2/client.ts` (+8, -2)

### Key Diffs

(no key diffs to show)

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from .opencode/agent/docs.md
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/agent.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/test/agent/agent.test.ts
- `src/tool/bash.test.ts` - update based on kilocode packages/opencode/test/tool/bash.test.ts changes
- `src/tool/bash.ts` - update based on kilocode packages/opencode/src/tool/bash.ts changes
- `src/tool/bash.txt.ts` - update based on kilocode packages/opencode/src/tool/bash.txt changes
- `src/tool/batch.ts` - update based on kilocode packages/opencode/src/tool/batch.ts changes
- `src/tool/code-interpreter.ts` - update based on kilocode packages/opencode/src/provider/sdk/copilot/responses/tool/code-interpreter.ts changes
- `src/tool/external-directory.test.ts` - update based on kilocode packages/opencode/test/tool/external-directory.test.ts changes
- `src/tool/external-directory.ts` - update based on kilocode packages/opencode/src/tool/external-directory.ts changes
- `src/tool/file-search.ts` - update based on kilocode packages/opencode/src/provider/sdk/copilot/responses/tool/file-search.ts changes
- `src/tool/image-generation.ts` - update based on kilocode packages/opencode/src/provider/sdk/copilot/responses/tool/image-generation.ts changes
- `src/tool/local-shell.ts` - update based on kilocode packages/opencode/src/provider/sdk/copilot/responses/tool/local-shell.ts changes
- `src/tool/read.test.ts` - update based on kilocode packages/opencode/test/tool/read.test.ts changes
- `src/tool/read.ts` - update based on kilocode packages/opencode/src/tool/read.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
- `src/tool/skill.test.ts` - update based on kilocode packages/opencode/test/tool/skill.test.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/tool/task.ts changes
- `src/tool/tool.ts` - update based on kilocode packages/opencode/src/tool/tool.ts changes
- `src/tool/web-search-preview.ts` - update based on kilocode packages/opencode/src/provider/sdk/copilot/responses/tool/web-search-preview.ts changes
- `src/tool/web-search.ts` - update based on kilocode packages/opencode/src/provider/sdk/copilot/responses/tool/web-search.ts changes
