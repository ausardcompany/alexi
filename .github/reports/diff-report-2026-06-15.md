# Upstream Changes Report
Generated: 2026-06-15 12:16:04

## Summary
- kilocode: 125 commits, 395 files changed
- opencode: 25 commits, 179 files changed

## kilocode Changes (fcb8802aa..2ddf6f635)

### Commits

- 2ddf6f635 - Merge pull request #11158 from Kilo-Org/hide-training-models (Christiaan Arnoldus, 2026-06-15)
- 583bef064 - Merge pull request #11246 from Kilo-Org/sprout-principal (Marius, 2026-06-15)
- 3f1c8fae3 - fix: include prerelease notes in stable releases (marius-kilocode, 2026-06-15)
- 33b13f810 - Merge branch 'main' into hide-training-models (Christiaan Arnoldus, 2026-06-15)
- 5fab7b38d - release: v7.3.46 (kilo-maintainer[bot], 2026-06-15)
- 3ccd205a9 - Merge pull request #11206 from IamCoder18/fix/triage-model-path (Christiaan Arnoldus, 2026-06-15)
- f121d70a0 - Merge remote-tracking branch 'origin/main' into hide-training-models Co-authored-by: kiloconnect[bot] <240665456+kiloconnect[bot]@users.noreply.github.com> (chrarnoldus, 2026-06-15)
- fb2db2e01 - fix(vscode): allow removing provider reasoning (#11238) (Marius, 2026-06-15)
- 998fa212a - style(vscode): format prompt-training translations (chrarnoldus, 2026-06-15)
- 02f1d1298 - Merge branch 'main' into hide-training-models (chrarnoldus, 2026-06-15)
- 7f886c75e - Merge pull request #11240 from Kilo-Org/confirm-11227-skill-removal (Marius, 2026-06-15)
- 08e5fbe5e - Merge pull request #11234 from Kilo-Org/chore/regenerate-v2-sdk-types (Christiaan Arnoldus, 2026-06-15)
- f820e57ba - fix: prevent recursive skill removal (marius-kilocode, 2026-06-15)
- 7126d8737 - Merge branch 'main' into chore/regenerate-v2-sdk-types (Christiaan Arnoldus, 2026-06-15)
- 14a801879 - Merge pull request #11231 from Kilo-Org/cleanup/vscode-unused-code-2 (Marius, 2026-06-15)
- 69ab31817 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-06-15)
- f326be4b6 - fix(vscode): clarify doom loop permissions (#11232) (Imanol Maiztegui, 2026-06-15)
- 214985428 - chore(sdk): regenerate v2 client types (chrarnoldus, 2026-06-15)
- 33937dc7b - chore(sdk): prepare v2 client regeneration (chrarnoldus, 2026-06-15)
- 64d7b1a5d - Merge pull request #11090 from Kilo-Org/marius-kilocode/kilo-opencode-v1.15.4 (Marius, 2026-06-15)
- 488b886ac - Merge pull request #11183 from Kilo-Org/fix/vscode-redo-session-state (Marius, 2026-06-15)
- 38333f62f - refactor(vscode): remove unused extension code (marius-kilocode, 2026-06-15)
- 8eea56eb0 - docs(ui): simplify hide prompt training description in i18n (chrarnoldus, 2026-06-15)
- ccdcc3634 - Merge pull request #11121 from truffle-dev/fix/custom-provider-fetch-uses-stored-key-10139 (Christiaan Arnoldus, 2026-06-15)
- a61f3e66d - Merge remote-tracking branch 'origin/main' into review/upstream-11090 (marius-kilocode, 2026-06-15)
- 1648e6983 - Merge branch 'main' into hide-training-models (Christiaan Arnoldus, 2026-06-15)
- 0846f9e24 - chore(agent): fix triage model provider path for gpt-5-nano (Aarav Sharma, 2026-06-13)
- b9d0d838c - style(vscode): format session event guard (marius-kilocode, 2026-06-12)
- 1fd0960cb - fix(vscode): restore session state on first redo (marius-kilocode, 2026-06-12)
- 850a3e546 - Merge remote-tracking branch 'origin/main' into review/upstream-11090 (marius-kilocode, 2026-06-12)
- 688092899 - fix: preserve latest main state after merge (marius-kilocode, 2026-06-12)
- 390b0c3eb - Merge remote-tracking branch 'origin/main' into review/upstream-11090 (marius-kilocode, 2026-06-12)
- 06e87cf65 - fix: resolve OpenCode v1.15.4 merge regressions (marius-kilocode, 2026-06-12)
- 6a1377aba - Merge origin/main into OpenCode v1.15.4 (marius-kilocode, 2026-06-12)
- 6b3b26567 - Merge branch 'main' into fix/custom-provider-fetch-uses-stored-key-10139 (Christiaan Arnoldus, 2026-06-12)
- 76518dd24 - Merge origin/main into OpenCode v1.15.4 (marius-kilocode, 2026-06-12)
- 941accc2f - Merge origin/main into OpenCode v1.15.4 (marius-kilocode, 2026-06-12)
- 4dc1fd9d8 - fix: share prompt-training model filtering (chrarnoldus, 2026-06-12)
- 27624ce2c - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-12)
- 9b9481849 - refactor(vscode): isolate gateway model filtering (chrarnoldus, 2026-06-12)
- 8ff837117 - feat(vscode): hide prompt-training gateway models (chrarnoldus, 2026-06-12)
- 15ddb4122 - fix(vscode): use stored API key for model fetches when editing a custom provider (truffle, 2026-06-11)
- 6ae28b550 - Merge branch 'main' into review/upstream-11090 (marius-kilocode, 2026-06-11)
- b5a67e5e0 - Merge remote-tracking branch 'origin/main' into marius-kilocode/kilo-opencode-v1.15.4 (marius-kilocode, 2026-06-10)
- 72a11b02a - resolve merge conflicts (marius-kilocode, 2026-06-10)
- 10f48c24c - merge: record upstream v1.15.4 (marius-kilocode, 2026-06-10)
- 00554bd24 - refactor: kilo compat for v1.15.4 (marius-kilocode, 2026-06-10)
- 2b92c5677 - release: v1.15.4 (opencode, 2026-05-17)
- 468eb6887 - zen: update monitoring query (Frank, 2026-05-17)
- 23b594de6 - fix: preserve bus instance context (#28051) (Dax, 2026-05-17)
- 5060577ee - sync (Frank, 2026-05-17)
- d3ebb1f7c - ignore: cleanup readme (#28049) (Aiden Cline, 2026-05-17)
- e4cc4e168 - fix(lsp): preserve instance ref for update events (#28016) (Shoubhit Dash, 2026-05-17)
- 53e89f9d5 - chore: generate (opencode-agent[bot], 2026-05-17)
- de247b7aa - sync (Frank, 2026-05-17)
- 0b8050d45 - sync (Frank, 2026-05-17)
- be6a89a3b - docs: update README.es.md (#27739) (Gustavo Viana, 2026-05-16)
- c0a8b509c - style(tui): distinguish markdown h1 headings (#27814) (Kit Langton, 2026-05-16)
- f80651fa9 - sync release versions for v1.15.3 (opencode, 2026-05-16)
- 68af95390 - fix: hide task background instructions by default (#27872) (Shoubhit Dash, 2026-05-16)
- 321db7a81 - chore: generate (opencode-agent[bot], 2026-05-16)
- 6d2219e00 - fix(cli): preserve instance context in async commands (Dax Raad, 2026-05-16)
- dd432e3cd - chore: generate (opencode-agent[bot], 2026-05-16)
- 77db212a0 - fix read stream byte cap (Dax Raad, 2026-05-16)
- f56263791 - sync release versions for v1.15.2 (opencode, 2026-05-16)
- 88363f1ed - fixed issue in opencode run (Dax Raad, 2026-05-16)
- c5db39f62 - Remove Ring 2.6 1T from Zen docs (#27849) (Jack, 2026-05-16)
- b5aed287c - chore: reduce alerts noise (vimtor, 2026-05-16)
- 53849bd86 - fix(sync): publish events on injected project bus (#27825) (Dax, 2026-05-16)
- e33912bfe - sync release versions for v1.15.1 (opencode, 2026-05-16)
- 548648a3d - core: reduce prompts for shell, todowrite, and task tools (#26821) (Aiden Cline, 2026-05-16)
- 4643e1317 - feat(nix): add opencode-electron derivation (#16163) (Caleb Norton, 2026-05-15)
- 042e6a5c8 - tui: newly pinned sessions now append to the end of the list instead of jumping to the top (Dax Raad, 2026-05-15)
- e36d6a0cb - core: clarify postinstall error message when binary is missing (Dax Raad, 2026-05-15)
- cc9c0b15c - Revert "add dialog prompt submit keybind (#27807)" (#27815) (Sebastian, 2026-05-16)
- f3b0d3d7a - fix(tui): dedupe consecutive prompt history entries (#27816) (Kit Langton, 2026-05-16)
- 764c6bc51 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-16)
- d441e931f - add dialog prompt submit keybind (#27807) (Sebastian, 2026-05-16)
- ad79ad9ea - upgrade opentui to 0.2.11 (#27808) (Sebastian, 2026-05-16)
- d6b23fd8f - chore: generate (opencode-agent[bot], 2026-05-16)
- 5911bd532 - fix(tui): show config error details on startup (#27803) (Kit Langton, 2026-05-15)
- 2385123f0 - Fix thinking toggle defaults (Dax Raad, 2026-05-15)
- 09549661e - Fix npm CLI binary installation (#27801) (Dax, 2026-05-15)
- da495fd2e - chore: generate (opencode-agent[bot], 2026-05-15)
- 85cd44791 - chore: reduce alerts noise (vimtor, 2026-05-16)
- 0f31fd631 - Fix multiline mentions (#27649) (Sebastian, 2026-05-15)
- aa07e2194 - handle undefined tips (#27635) (Sebastian, 2026-05-15)
- f060874b2 - feat(tui): add minimal thinking mode with click-to-expand (#27623) (Shoubhit Dash, 2026-05-16)
- f21c582db - chore: reduce alerting noise (vimtor, 2026-05-15)
- 65f96a585 - refactor(instance): retire WithInstance adapter (#27782) (Shoubhit Dash, 2026-05-16)
- 48122b31c - fix(tool): bridge custom tool zod metadata (#27770) (Aiden Cline, 2026-05-15)
- 0df2f5b45 - chore: generate (opencode-agent[bot], 2026-05-15)
- 499e8e4b7 - test(instance): add effect-native fixture helpers (#27781) (Shoubhit Dash, 2026-05-16)
- f33b4455a - feat(tui): enable pinned session switching (#27780) (Shoubhit Dash, 2026-05-16)
- a24abd2b1 - refactor(lsp): require explicit instance context (#27767) (Shoubhit Dash, 2026-05-16)
- d44bef210 - chore: generate (opencode-agent[bot], 2026-05-15)
- f99339e52 - fix(tui): keep session switching pinned-only (#27775) (Shoubhit Dash, 2026-05-16)
- 2b0e72ab7 - refactor(workspace): centralize adapter invocation (#27768) (Shoubhit Dash, 2026-05-15)
- 2fdee50b3 - refactor(acp): extract runtime reentry (#27769) (Shoubhit Dash, 2026-05-15)
- 48293c527 - chore: generate (opencode-agent[bot], 2026-05-15)
- 0c9cfe923 - refactor(instance): remove legacy runtime fallback (#27757) (Shoubhit Dash, 2026-05-15)
- 9975c1ed1 - chore: generate (opencode-agent[bot], 2026-05-15)
- ef7d80127 - fix(tool): preserve custom tool arg descriptions (#27750) (Aiden Cline, 2026-05-15)
- eb630075c - chore: generate (opencode-agent[bot], 2026-05-15)
- a2392ca60 - refactor(worktree): provide runtime reentry refs (#27754) (Shoubhit Dash, 2026-05-15)
- f9371eb66 - chore: generate (opencode-agent[bot], 2026-05-15)
- fa9a2cb24 - refactor(instance): remove remaining bind call sites (#27731) (Shoubhit Dash, 2026-05-15)
- 2d90f325f - ci: catch provider errors across all opencode tiers (#27495) (Victor Navarro, 2026-05-15)
- c2ffd7cf1 - fix: markdown table rendering (#27747) (Aiden Cline, 2026-05-15)
- 104f5d5a1 - chore: exclude provider from triggers (vimtor, 2026-05-15)
- 1c7c03332 - test(workspace): avoid legacy instance reads (#27727) (Shoubhit Dash, 2026-05-15)
- 984eefa6f - chore: generate (opencode-agent[bot], 2026-05-15)
- bf64f8cbb - refactor(cli): dispose bootstrap instance explicitly (#27721) (Shoubhit Dash, 2026-05-15)
- 727a83aa7 - chore: generate (opencode-agent[bot], 2026-05-15)
- e65383810 - refactor(tool): read repo overview directory from instance state (#27717) (Shoubhit Dash, 2026-05-15)
- 12b666e2c - refactor(project): import instance context directly (#27714) (Shoubhit Dash, 2026-05-15)
- eb5ef1c07 - refactor(flags): remove unused flag exports (#27709) (Shoubhit Dash, 2026-05-15)
- 356f68418 - refactor(flags): migrate skip migrations flag (#27705) (Shoubhit Dash, 2026-05-15)
- 7b370406a - refactor(flags): migrate lsp download flag (#27699) (Shoubhit Dash, 2026-05-15)
- 202cc863b - refactor(flags): migrate claude code prompt flag (#27690) (Shoubhit Dash, 2026-05-15)
- 22cb0395e - refactor(flags): migrate external skills flag (#27685) (Shoubhit Dash, 2026-05-15)
- 2d6bedecd - refactor(flags): migrate output token max to runtime flags (#27680) (Shoubhit Dash, 2026-05-15)
- 2080390ca - chore: generate (opencode-agent[bot], 2026-05-15)
- 1ac3f0946 - fix(watcher): resolve symlinked .git path before subscribing (#27016) (Kagura, 2026-05-15)
- ca8f578f2 - ci: skip previously cleaned PRs (#27670) (Aiden Cline, 2026-05-15)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/semantic-search.ts` (+1, -1)
- `packages/opencode/src/kilocode/tool/task.ts` (+4, -1)
- `packages/opencode/src/tool/recall.ts` (+1, -1)
- `packages/opencode/src/tool/registry.ts` (+33, -2)
- `packages/opencode/src/tool/repo_overview.ts` (+4, -2)
- `packages/opencode/src/tool/shell.ts` (+5, -5)
- `packages/opencode/src/tool/shell/shell.txt` (+9, -65)
- `packages/opencode/src/tool/task.ts` (+15, -4)
- `packages/opencode/src/tool/task.txt` (+6, -46)
- `packages/opencode/src/tool/todowrite.txt` (+44, -167)
- `packages/opencode/src/tool/warpgrep.ts` (+2, -2)
- `packages/opencode/test/tool/external-directory.test.ts` (+1, -1)
- `packages/opencode/test/tool/lsp.test.ts` (+0, -1)
- `packages/opencode/test/tool/read.test.ts` (+33, -2)
- `packages/opencode/test/tool/recall.test.ts` (+10, -12)
- `packages/opencode/test/tool/registry.test.ts` (+95, -1)
- `packages/opencode/test/tool/repo_overview.test.ts` (+15, -0)
- `packages/opencode/test/tool/skill.test.ts` (+0, -1)
- `packages/opencode/test/tool/write.test.ts` (+0, -1)

#### Agent System (packages/*/src/agent/)
- `.opencode/agent/triage.md` (+1, -1)
- `packages/opencode/src/kilocode/agent/index.ts` (+14, -20)

#### Permission System (**/permission/)
- `packages/opencode/src/kilocode/permission/drain.ts` (+3, -2)
- `packages/opencode/src/permission/index.ts` (+1, -8)
- `packages/opencode/test/kilocode/permission/external-directory-allow.test.ts` (+5, -5)
- `packages/opencode/test/kilocode/permission/next.reply-http.test.ts` (+3, -3)

#### Event Bus (**/bus/, **/event/)
- `packages/opencode/src/bus/bus-event.ts` (+23, -10)
- `packages/opencode/src/bus/index.ts` (+33, -4)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/catalog.ts` (+17, -8)
- `packages/core/src/event.ts` (+157, -0)
- `packages/core/src/flag/flag.ts` (+1, -1)
- `packages/core/src/instance-layer.ts` (+0, -12)
- `packages/core/src/instance.ts` (+0, -10)
- `packages/core/src/location-layer.ts` (+12, -0)
- `packages/core/src/location.ts` (+11, -0)
- `packages/core/src/session.ts` (+13, -0)
- `packages/core/test/catalog.test.ts` (+36, -4)
- `packages/core/test/event.test.ts` (+132, -0)
- `packages/core/test/plugin/provider-opencode.test.ts` (+3, -3)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/constants/AutocompleteLanguageInfo.ts` (+10, -1)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/context/ranking/index.test.ts` (+0, -125)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/context/ranking/index.ts` (+3, -127)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/context/static-context/StaticContextService.ts` (+0, -25)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/BracketMatchingService.test.ts` (+79, -286)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/BracketMatchingService.ts` (+13, -47)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/streamTransforms/lineStream.test.ts` (+0, -179)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/streamTransforms/lineStream.ts` (+0, -219)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/snippets/getAllSnippets.test.ts` (+73, -412)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/snippets/getAllSnippets.ts` (+33, -161)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/templating/AutocompleteTemplate.ts` (+3, -15)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/templating/__tests__/formatOpenedFilesContext.test.ts` (+2, -7)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/templating/filtering.ts` (+0, -8)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/types.ts` (+2, -20)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/diff/util.test.ts` (+0, -85)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/diff/util.ts` (+0, -42)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/index.d.ts` (+0, -1)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/util/messageContent.ts` (+0, -23)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/util/parameters.ts` (+0, -1)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/util/ranges.ts` (+0, -31)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/util/treeSitter.test.ts` (+0, -36)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/util/treeSitter.ts` (+0, -85)
- `packages/kilo-vscode/src/services/autocomplete/continuedev/core/vscode-test-harness/src/autocomplete/lsp.ts` (+1, -294)

#### Other Changes
- `.changeset/bright-subagents-reason.md` (+0, -6)
- `.changeset/fast-regular-snapshots.md` (+0, -5)
- `.changeset/hide-prompt-training-models.md` (+6, -0)
- `.changeset/route-worktree-questions.md` (+0, -5)
- `.changeset/secure-external-downloads.md` (+0, -5)
- `.opencode-version` (+1, -1)
- `bun.lock` (+55, -35)
- `nix/hashes.json` (+4, -4)
- `package.json` (+4, -4)
- `packages/{opencode/src/v2 => core/src}/session-event.ts` (+70, -75)
- `packages/{opencode/src/v2 => core/src}/session-message-updater.ts` (+0, -0)
- `packages/{opencode/src/v2 => core/src}/session-message.ts` (+12, -12)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-docs/markdoc/partials/cli-commands-table.md` (+2, -0)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli-reference.md` (+51, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/models-accessible-labels-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/models-autocomplete-open-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/settings-panel-chromium-linux.png` (+2, -2)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-vscode/CHANGELOG.md` (+16, -0)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+46, -15)
- `packages/kilo-vscode/src/kiloclaw/KiloClawProvider.ts` (+2, -2)
- `packages/kilo-vscode/src/kiloclaw/kilo-chat-client.ts` (+0, -4)
- `packages/kilo-vscode/src/kiloclaw/token-manager.ts` (+0, -5)
- `packages/kilo-vscode/src/provider-actions.ts` (+33, -1)
- `packages/kilo-vscode/src/services/autocomplete/AutocompleteServiceManager.ts` (+0, -31)
- `packages/kilo-vscode/src/services/autocomplete/__tests__/AutocompleteServiceManager.spec.ts` (+0, -20)
- `packages/kilo-vscode/src/services/autocomplete/classic-auto-complete/AutocompleteInlineCompletionProvider.ts` (+0, -4)
- `packages/kilo-vscode/src/services/autocomplete/classic-auto-complete/ErrorBackoff.ts` (+0, -7)
- `packages/kilo-vscode/src/services/autocomplete/classic-auto-complete/__tests__/AutocompleteContextProvider.test.ts` (+3, -23)
- `packages/kilo-vscode/src/services/autocomplete/classic-auto-complete/getProcessedSnippets.ts` (+0, -2)
- `packages/kilo-vscode/src/services/autocomplete/context/VisibleCodeTracker.ts` (+1, -12)
- `packages/kilo-vscode/src/services/autocomplete/next-edit/NextEditSuggestionManager.ts` (+0, -4)
- `packages/kilo-vscode/src/services/autocomplete/shims/FileIgnoreController.ts` (+0, -28)
- `packages/kilo-vscode/src/services/browser-automation/browser-automation-service.ts` (+2, -41)
- `packages/kilo-vscode/src/services/marketplace/api.ts` (+0, -4)
- `packages/kilo-vscode/src/session-status.ts` (+0, -12)
- `packages/kilo-vscode/src/shared/custom-provider.ts` (+25, -9)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/unit/autocomplete-error-backoff.test.ts` (+0, -8)
- `packages/kilo-vscode/tests/unit/custom-provider.test.ts` (+7, -4)
- `packages/kilo-vscode/tests/unit/file-ignore-controller.test.ts` (+0, -9)
- `packages/kilo-vscode/tests/unit/kilo-provider-indexing-refresh.test.ts` (+15, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-utils.test.ts` (+6, -0)
- `packages/kilo-vscode/tests/unit/permission-description.test.ts` (+24, -1)
- `packages/kilo-vscode/tests/unit/provider-actions-save.test.ts` (+77, -10)
- `packages/kilo-vscode/tests/unit/revert-checkpoints.test.ts` (+35, -0)
- `packages/kilo-vscode/tests/unit/session-status.test.ts` (+1, -21)
- `packages/kilo-vscode/webview-ui/src/components/chat/PermissionDock.tsx` (+2, -6)
- `packages/kilo-vscode/webview-ui/src/components/chat/permission-dock-utils.ts` (+21, -3)
- `packages/kilo-vscode/webview-ui/src/components/settings/AgentBehaviourTab.tsx` (+4, -2)
- `packages/kilo-vscode/webview-ui/src/components/settings/CustomProviderDialog.tsx` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/ModelsTab.tsx` (+14, -1)
- `packages/kilo-vscode/webview-ui/src/components/settings/settings-io.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/config.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+7, -0)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+14, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/script/build.ts` (+2, -1)
- `packages/opencode/script/postinstall.mjs` (+113, -86)
- `packages/opencode/script/publish.ts` (+3, -1)
- `packages/opencode/specs/effect/errors.md` (+84, -0)
- `packages/opencode/specs/effect/facades.md` (+0, -3)
- `packages/opencode/specs/effect/guide.md` (+3, -7)
- `packages/opencode/specs/effect/instance-context.md` (+9, -305)
- `packages/opencode/specs/effect/loose-ends.md` (+0, -4)
- `packages/opencode/specs/effect/todo.md` (+10, -73)
- `packages/opencode/src/acp/agent.ts` (+5, -7)
- `packages/opencode/src/acp/runtime.ts` (+22, -0)
- `packages/opencode/src/cli/bootstrap.ts` (+7, -13)
- `packages/opencode/src/cli/cmd/agent.ts` (+3, -1)
- `packages/opencode/src/cli/cmd/debug/agent.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/debug/v2.ts` (+3, -3)
- `packages/opencode/src/cli/cmd/github.ts` (+36, -31)
- `packages/opencode/src/cli/cmd/prompt-display.ts` (+14, -5)
- `packages/opencode/src/cli/cmd/remote.ts` (+2, -2)
- `packages/opencode/src/cli/cmd/run.ts` (+6, -2)
- `packages/opencode/src/cli/cmd/tui/app.tsx` (+10, -41)
- `packages/opencode/src/cli/cmd/tui/component/dialog-session-list.tsx` (+31, -45)
- `packages/opencode/src/cli/cmd/tui/component/prompt/history.tsx` (+9, -0)
- `packages/opencode/src/cli/cmd/tui/config/keybind.ts` (+0, -6)
- `packages/opencode/src/cli/cmd/tui/context/aggregate-failures.ts` (+18, -1)
- `packages/opencode/src/cli/cmd/tui/context/local.tsx` (+4, -102)
- `packages/opencode/src/cli/cmd/tui/context/theme.tsx` (+1, -0)
- `packages/opencode/src/cli/cmd/tui/context/thinking.ts` (+66, -0)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/home/tips-view.tsx` (+18, -30)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/system/session-v2.tsx` (+60, -21)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+80, -25)
- `packages/opencode/src/cli/cmd/tui/ui/dialog-select.tsx` (+9, -3)
- `packages/opencode/src/cli/cmd/tui/worker.ts` (+2, -7)
- `packages/opencode/src/cli/effect-cmd.ts` (+3, -7)
- `packages/opencode/src/cli/error.ts` (+15, -16)
- `packages/opencode/src/cli/upgrade.ts` (+24, -4)
- `packages/opencode/src/command/index.ts` (+1, -1)
- `packages/opencode/src/config/agent.ts` (+21, -13)
- `packages/opencode/src/config/command.ts` (+11, -7)
- `packages/opencode/src/config/config.ts` (+4, -2)
- `packages/opencode/src/config/mcp.ts` (+3, -2)
- `packages/opencode/src/config/provider.ts` (+1, -1)
- `packages/opencode/src/control-plane/adapters/worktree.ts` (+52, -23)
- `packages/opencode/src/control-plane/types.ts` (+16, -5)
- `packages/opencode/src/control-plane/workspace-adapter-runtime.ts` (+51, -0)
- `packages/opencode/src/control-plane/workspace.ts` (+40, -57)
- `packages/opencode/src/effect/app-runtime.ts` (+15, -2)
- `packages/opencode/src/effect/bridge.ts` (+46, -30)
- `packages/opencode/src/effect/instance-ref.ts` (+1, -1)
- `packages/opencode/src/effect/instance-state.ts` (+5, -16)
- `packages/opencode/src/effect/run-service.ts` (+10, -7)
- `packages/opencode/src/effect/runtime-flags.ts` (+8, -0)
- `packages/opencode/src/event-v2-bridge.ts` (+99, -0)
- `packages/opencode/src/file/watcher.ts` (+16, -8)
- `packages/opencode/src/format/formatter.ts` (+1, -1)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+10, -10)
- `packages/opencode/src/kilo-sessions/remote-sender.ts` (+3, -3)
- `packages/opencode/src/kilocode/background-process/index.ts` (+7, -5)
- `packages/opencode/src/kilocode/bootstrap.ts` (+1, -1)
- `packages/opencode/src/kilocode/cli/cmd/roll-call.ts` (+10, -3)
- `packages/opencode/src/kilocode/config-validation.ts` (+1, -1)
- `packages/opencode/src/kilocode/config/config.ts` (+3, -2)
- `packages/opencode/src/kilocode/event-wire.ts` (+43, -0)
- `packages/opencode/src/kilocode/indexing-worker-client.ts` (+1, -6)
- `packages/opencode/src/kilocode/indexing.ts` (+7, -4)
- `packages/opencode/src/kilocode/instance.ts` (+58, -0)
- `packages/opencode/src/kilocode/plan-followup.ts` (+11, -9)
- `packages/opencode/src/kilocode/project-id.ts` (+1, -1)
- `packages/opencode/src/kilocode/provider/model-filter.ts` (+19, -0)
- `packages/opencode/src/kilocode/review/review.ts` (+1, -1)
- `packages/opencode/src/kilocode/server/httpapi/groups/kilocode.ts` (+1, -1)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilo-gateway.ts` (+5, -2)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilocode.ts` (+25, -3)
- `packages/opencode/src/kilocode/session/compaction-chunks.ts` (+28, -12)
- `packages/opencode/src/kilocode/session/prompt.ts` (+6, -6)
- `packages/opencode/src/kilocode/skill-remove.ts` (+37, -0)
- `packages/opencode/src/kilocode/snapshot/track.ts` (+1, -1)
- `packages/opencode/src/kilocode/suggestion/index.ts` (+5, -4)
- `packages/opencode/src/kilocode/system-prompt.ts` (+1, -1)
- `packages/opencode/src/kilocode/ts-client.ts` (+2, -2)
- `packages/opencode/src/lsp/client.ts` (+26, -7)
- `packages/opencode/src/lsp/lsp.ts` (+3, -2)
- `packages/opencode/src/lsp/server.ts` (+51, -51)
- `packages/opencode/src/project/instance-store.ts` (+12, -5)
- `packages/opencode/src/project/instance.ts` (+0, -36)
- `packages/opencode/src/project/with-instance.ts` (+0, -12)
- `packages/opencode/src/provider/models.ts` (+59, -61)
- `packages/opencode/src/provider/transform.ts` (+3, -4)
- `packages/opencode/src/server/init-projectors.ts` (+3, -0)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/{instance.ts => location.ts}` (+18, -18)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/message.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/model.ts` (+4, -4)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/provider.ts` (+6, -6)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/session.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/config.ts` (+9, -2)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/provider.ts` (+9, -3)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2.ts` (+2, -2)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/v2/message.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/lifecycle.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/error.ts` (+8, -0)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/instance-context.ts` (+5, -4)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/workspace-routing.ts` (+2, -4)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+4, -1)
- `packages/opencode/src/server/server.ts` (+2, -3)
- `packages/opencode/src/session/compaction.ts` (+27, -39)
- `packages/opencode/src/session/instruction.ts` (+13, -7)
- `packages/opencode/src/session/llm.ts` (+3, -3)
- `packages/opencode/src/session/network.ts` (+16, -8)
- `packages/opencode/src/session/overflow.ts` (+10, -4)
- `packages/opencode/src/session/processor.ts` (+28, -36)
- `packages/opencode/src/session/projectors-next.ts` (+29, -28)
- `packages/opencode/src/session/prompt.ts` (+23, -32)
- `packages/opencode/src/session/prompt/default.txt` (+0, -10)
- `packages/opencode/src/session/schema.ts` (+2, -7)
- `packages/opencode/src/session/session.sql.ts` (+1, -1)
- `packages/opencode/src/session/session.ts` (+11, -10)
- `packages/opencode/src/skill/index.ts` (+5, -16)
- `packages/opencode/src/snapshot/index.ts` (+2, -1)
- `packages/opencode/src/storage/db.ts` (+8, -8)
- `packages/opencode/src/sync/index.ts` (+119, -34)
- `packages/opencode/src/v2/event.ts` (+0, -43)
- `packages/opencode/src/v2/session.ts` (+8, -8)
- `packages/opencode/test/AGENTS.md` (+1, -1)
- `packages/opencode/test/EFFECT_TEST_MIGRATION.md` (+1, -1)
- `packages/opencode/test/cli/cmd/tui/aggregate-failures.test.ts` (+40, -2)
- `packages/opencode/test/cli/cmd/tui/prompt-history.test.ts` (+44, -0)
- `packages/opencode/test/cli/cmd/tui/sync-undefined-messages.test.tsx` (+5, -4)
- `packages/opencode/test/cli/cmd/tui/sync.test.tsx` (+2, -3)
- `packages/opencode/test/cli/effect-cmd-instance-als.test.ts` (+43, -34)
- `packages/opencode/test/cli/error.test.ts` (+1, -1)
- `packages/opencode/test/cli/install-artifact.test.ts` (+11, -2)
- `packages/opencode/test/cli/run/prompt.shared.test.ts` (+6, -0)
- `packages/opencode/test/cli/run/stream.transport.test.ts` (+1, -3)
- `packages/opencode/test/config/config.test.ts` (+236, -205)
- `packages/opencode/test/control-plane/workspace.test.ts` (+121, -95)
- `packages/opencode/test/effect/instance-state.test.ts` (+22, -24)
- `packages/opencode/test/effect/runtime-flags.test.ts` (+121, -0)
- `packages/opencode/test/file/watcher.test.ts` (+57, -1)
- `packages/opencode/test/fixture/fixture.ts` (+32, -17)
- `packages/opencode/test/kilocode/agent-permission-overrides.test.ts` (+4, -4)
- `packages/opencode/test/kilocode/bash-permission-metadata.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/builtin-skills.test.ts` (+13, -0)
- `packages/opencode/test/kilocode/cli/error.test.ts` (+15, -6)
- `packages/opencode/test/kilocode/cli/roll-call.test.ts` (+12, -1)
- `packages/opencode/test/kilocode/command-timeout.test.ts` (+2, -6)
- `packages/opencode/test/kilocode/compaction-payload-recovery.test.ts` (+11, -3)
- `packages/opencode/test/kilocode/config-gitignore.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/config-resilience.test.ts` (+10, -10)
- `packages/opencode/test/kilocode/config-validation.test.ts` (+11, -11)
- `packages/opencode/test/kilocode/config/config.test.ts` (+60, -5)
- `packages/opencode/test/kilocode/config/console-ui.test.ts` (+3, -1)
- `packages/opencode/test/kilocode/config/hide-prompt-training-models.test.ts` (+22, -0)
- `packages/opencode/test/kilocode/config/indexing-default-plugin.test.ts` (+14, -14)
- `packages/opencode/test/kilocode/cost-propagation.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/edit-permission-filediff.test.ts` (+6, -6)
- `packages/opencode/test/kilocode/external-directory-boundary.test.ts` (+4, -4)
- `packages/opencode/test/kilocode/help.test.ts` (+6, -6)
- `packages/opencode/test/kilocode/indexing-startup.test.ts` (+25, -15)
- `packages/opencode/test/kilocode/indexing-worktree.test.ts` (+3, -3)
- `packages/opencode/test/kilocode/instruction.test.ts` (+12, -1)
- `packages/opencode/test/kilocode/lsp-typescript-lightweight.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/plan-exit-detection.test.ts` (+3, -3)
- `packages/opencode/test/kilocode/plan-file.test.ts` (+4, -4)
- `packages/opencode/test/kilocode/plan-followup.test.ts` (+7, -7)
- `packages/opencode/test/kilocode/project-config-update.test.ts` (+5, -5)
- `packages/opencode/test/kilocode/project-id.test.ts` (+23, -23)
- `packages/opencode/test/kilocode/provider/model-filter.test.ts` (+72, -0)
- `packages/opencode/test/kilocode/pty-self-command.test.ts` (+6, -6)
- `packages/opencode/test/kilocode/semantic-search.test.ts` (+5, -5)
- `packages/opencode/test/kilocode/server/httpapi-exercise-scenarios.ts` (+24, -3)
- `packages/opencode/test/kilocode/server/permission-allow-everything.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/server/prompt-training-model-filter.test.ts` (+105, -0)
- `packages/opencode/test/kilocode/session-compaction-cap.test.ts` (+18, -1)
- `packages/opencode/test/kilocode/session-compaction-chunks.test.ts` (+32, -15)
- `packages/opencode/test/kilocode/session-fork-remap.test.ts` (+7, -7)
- `packages/opencode/test/kilocode/session-list.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/session-overflow.test.ts` (+16, -0)
- `packages/opencode/test/kilocode/session-processor-empty-tool-calls.test.ts` (+12, -1)
- `packages/opencode/test/kilocode/session-processor-network-offline.test.ts` (+12, -1)
- `packages/opencode/test/kilocode/session-processor-retry-limit.test.ts` (+12, -1)
- `packages/opencode/test/kilocode/session-prompt-compaction-safety.test.ts` (+16, -1)
- `packages/opencode/test/kilocode/session-prompt-permission-refresh.test.ts` (+16, -1)
- `packages/opencode/test/kilocode/session-prompt-queue.test.ts` (+6, -6)
- `packages/opencode/test/kilocode/session/instruction-substitution.test.ts` (+12, -1)
- `packages/opencode/test/kilocode/session/platform-attribution.test.ts` (+4, -4)
- `packages/opencode/test/kilocode/session/session.test.ts` (+4, -4)
- `packages/opencode/test/kilocode/skill-remove.test.ts` (+46, -0)
- `packages/opencode/test/kilocode/snapshot-cache.test.ts` (+4, -4)
- `packages/opencode/test/kilocode/snapshot-freeze-repro.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/snapshot-seed.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/suggestion/auto-dismiss.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/suggestion/suggestion.test.ts` (+12, -12)
- `packages/opencode/test/kilocode/sync-event-encoding.test.ts` (+110, -0)
- `packages/opencode/test/kilocode/tool-encoding.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/tool-registry-indexing.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/tool-task-model.test.ts` (+1, -1)
- `packages/opencode/test/lsp/client.test.ts` (+37, -27)
- `packages/opencode/test/lsp/index.test.ts` (+66, -6)
- `packages/opencode/test/plugin/workspace-adapter.test.ts` (+3, -2)
- `packages/opencode/test/project/instance-bootstrap.test.ts` (+24, -1)
- `packages/opencode/test/project/instance.test.ts` (+34, -27)
- `packages/opencode/test/project/worktree.test.ts` (+5, -2)
- `packages/opencode/test/provider/amazon-bedrock.test.ts` (+74, -55)
- `packages/opencode/test/provider/gitlab-duo.test.ts` (+14, -16)
- `packages/opencode/test/provider/provider.test.ts` (+332, -313)
- `packages/opencode/test/question/question.test.ts` (+7, -4)
- `packages/opencode/test/server/experimental-session-list.test.ts` (+26, -19)
- `packages/opencode/test/server/httpapi-error-middleware.test.ts` (+22, -0)
- `packages/opencode/test/server/httpapi-event.test.ts` (+121, -3)
- `packages/opencode/test/server/httpapi-exercise/runtime.ts` (+0, -3)
- `packages/opencode/test/server/httpapi-file.test.ts` (+0, -1)
- `packages/opencode/test/server/httpapi-instance-context.test.ts` (+0, -1)
- `packages/opencode/test/server/httpapi-pty.test.ts` (+0, -1)
- `packages/opencode/test/server/httpapi-raw-route-auth.test.ts` (+0, -1)
- `packages/opencode/test/server/httpapi-session.test.ts` (+1, -1)
- `packages/opencode/test/server/httpapi-ui.test.ts` (+21, -18)
- `packages/opencode/test/server/httpapi-workspace.test.ts` (+6, -3)
- `packages/opencode/test/session/compaction.test.ts` (+40, -0)
- `packages/opencode/test/session/instruction.test.ts` (+23, -3)
- `packages/opencode/test/session/llm.test.ts` (+155, -132)
- `packages/opencode/test/session/network.test.ts` (+8, -9)
- `packages/opencode/test/session/processor-effect.test.ts` (+57, -0)
- `packages/opencode/test/session/prompt.test.ts` (+2, -0)
- `packages/opencode/test/session/shell-v2.test.ts` (+3, -3)
- `packages/opencode/test/session/snapshot-tool-race.test.ts` (+2, -0)
- `packages/opencode/test/skill/skill.test.ts` (+52, -4)
- `packages/opencode/test/storage/db.test.ts` (+9, -0)
- `packages/opencode/test/sync/index.test.ts` (+6, -2)
- `packages/opencode/test/v2/session-message-updater.test.ts` (+3, -3)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+4, -4)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+7, -7)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+739, -179)
- `packages/sdk/openapi.json` (+2721, -830)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/components/markdown.tsx` (+2, -1)
- `script/check-opencode-promise-facades.ts` (+4, -3)
- `script/kilocode/release-notes.test.ts` (+57, -0)
- `script/kilocode/release-notes.ts` (+73, -0)
- `script/publish.ts` (+8, -35)
- `script/upstream/package.json` (+1, -1)
- `script/upstream/utils/config.ts` (+3, -0)

### Key Diffs

#### .opencode/agent/triage.md
```diff
diff --git a/.opencode/agent/triage.md b/.opencode/agent/triage.md
index 69ab7ac86..5215fb7c2 100644
--- a/.opencode/agent/triage.md
+++ b/.opencode/agent/triage.md
@@ -1,7 +1,7 @@
 ---
 mode: primary
 hidden: true
-model: openai/gpt-5-nano
+model: kilo/openai/gpt-5-nano # kilocode_change
 color: "#44BA81"
 tools:
   "*": false
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 2d0b4fb7a..9b2c68a6f 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.3.45",
+  "version": "7.3.46",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/catalog.ts
```diff
diff --git a/packages/core/src/catalog.ts b/packages/core/src/catalog.ts
index 70cdba785..d27f17bfb 100644
--- a/packages/core/src/catalog.ts
+++ b/packages/core/src/catalog.ts
@@ -5,7 +5,8 @@ import { produce, type Draft } from "immer"
 import { ModelV2 } from "./model"
 import { PluginV2 } from "./plugin"
 import { ProviderV2 } from "./provider"
-import { Instance } from "./instance"
+import { Location } from "./location"
+import { EventV2 } from "./event"
 
 type ProviderRecord = {
   provider: ProviderV2.Info
@@ -24,6 +25,15 @@ export class ModelNotFoundError extends Schema.TaggedErrorClass<ModelNotFoundErr
   modelID: ModelV2.ID,
 }) {}
 
+export const Event = {
+  ModelUpdated: EventV2.define({
+    type: "catalog.model.updated",
+    schema: {
+      model: ModelV2.Info,
+    },
+  }),
+}
+
 export interface Interface {
   readonly provider: {
     readonly get: (providerID: ProviderV2.ID) => Effect.Effect<ProviderV2.Info, ProviderNotFoundError>
@@ -57,10 +67,11 @@ export class Service extends Context.Service<Service, Interface>()("@opencode/v2
 export const layer = Layer.effect(
   Service,
   Effect.gen(function* () {
-    yield* Instance.Service
+    yield* Location.Service
     let records = HashMap.empty<ProviderV2.ID, ProviderRecord>()
     let defaultModel: { providerID: ProviderV2.ID; modelID: ModelV2.ID } | undefined
     const plugin = yield* PluginV2.Service
+    const events = yield* EventV2.Service
 
     const resolve = (model: ModelV2.Info) => {
       const provider = Option.getOrThrow(HashMap.get(records, model.providerID)).provider
@@ -157,14 +168,12 @@ export const layer = Layer.effect(
           )
           const updated = yield* plugin.trigger("model.update", {}, { model, cancel: false })
           if (updated.cancel) return
+          const next = new ModelV2.Info({ ...updated.model, id: modelID, providerID })
           records = HashMap.set(records, providerID, {
             provider: record.provider,
```

#### packages/core/src/event.ts
```diff
diff --git a/packages/core/src/event.ts b/packages/core/src/event.ts
new file mode 100644
index 000000000..e01dc5b0d
--- /dev/null
+++ b/packages/core/src/event.ts
@@ -0,0 +1,157 @@
+import { Context, Effect, Layer, Option, PubSub, Schema, Stream } from "effect"
+import { Location } from "./location"
+import { withStatics } from "./schema"
+import { Identifier } from "./util/identifier"
+
+export const ID = Schema.String.pipe(
+  Schema.brand("Event.ID"),
+  withStatics((schema) => ({ create: () => schema.make("evt_" + Identifier.ascending()) })),
+)
+export type ID = typeof ID.Type
+
+export type Definition<Type extends string = string, DataSchema extends Schema.Top = Schema.Top> = {
+  readonly type: Type
+  readonly version?: number
+  readonly aggregate?: string
+  readonly data: DataSchema
+}
+
+export type Data<D extends Definition> = Schema.Schema.Type<D["data"]>
+
+export type Payload<D extends Definition = Definition> = {
+  readonly id: ID
+  readonly type: D["type"]
+  readonly data: Data<D>
+  readonly version?: number
+  readonly location?: Location.Ref
+  readonly metadata?: Record<string, unknown>
+}
+
+export type Sync = (event: Payload) => Effect.Effect<void>
+
+export const registry = new Map<string, Definition>()
+
+export function define<const Type extends string, Fields extends Schema.Struct.Fields>(input: {
+  readonly type: Type
+  readonly version?: number
+  readonly aggregate?: string
+  readonly schema: Fields
+}): Schema.Schema<Payload<Definition<Type, Schema.Struct<Fields>>>> & Definition<Type, Schema.Struct<Fields>> {
+  const Data = Schema.Struct(input.schema)
+  const Payload = Schema.Struct({
+    id: ID,
+    metadata: Schema.optional(Schema.Record(Schema.String, Schema.Unknown)),
+    type: Schema.Literal(input.type),
```

#### packages/core/src/flag/flag.ts
```diff
diff --git a/packages/core/src/flag/flag.ts b/packages/core/src/flag/flag.ts
index ab0647c8a..0ed6eb477 100644
--- a/packages/core/src/flag/flag.ts
+++ b/packages/core/src/flag/flag.ts
@@ -53,7 +53,7 @@ export const Flag = {
   KILO_DISABLE_CLAUDE_CODE_PROMPT: KILO_DISABLE_CLAUDE_CODE || truthy("KILO_DISABLE_CLAUDE_CODE_PROMPT"),
   KILO_DISABLE_CLAUDE_CODE_SKILLS,
   KILO_DISABLE_EXTERNAL_SKILLS: truthy("KILO_DISABLE_EXTERNAL_SKILLS"),
-  KILO_EXPERIMENTAL_CUSTOMIZE_SKILL: unstableDefault("KILO_EXPERIMENTAL_CUSTOMIZE_SKILL"),
+  KILO_EXPERIMENTAL_CUSTOMIZE_SKILL: unstableDefault("KILO_EXPERIMENTAL_CUSTOMIZE_SKILL"), // kilocode_change
   KILO_FAKE_VCS: process.env["KILO_FAKE_VCS"],
   KILO_SERVER_PASSWORD: process.env["KILO_SERVER_PASSWORD"],
   KILO_SERVER_USERNAME: process.env["KILO_SERVER_USERNAME"],
```


*... and more files (showing first 5)*

## opencode Changes (7efade2..5d0f866)

### Commits

- 5d0f866 - fix(mcp): stop idle OAuth callback server (#32245) (Aiden Cline, 2026-06-14)
- 98d66e9 - chore: generate (opencode-agent[bot], 2026-06-15)
- 0dbfb6b - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-15)
- 9258e8c - fix(mcp): type tool error content (Adam, 2026-06-14)
- 9fdfa23 - fix(stats): align homepage model ranks (Adam, 2026-06-14)
- dfb616f - fix(mcp): handle tool result errors (#32244) (Aiden Cline, 2026-06-14)
- 1338d7b - fix(stats): rank model pages by week (Adam, 2026-06-14)
- a774c62 - chore(opencode): consolidate escape logic (#32360) (Aiden Cline, 2026-06-14)
- a9a4b2f - fix(stats): scope data charts to go (Adam, 2026-06-14)
- e4ccb50 - fix(mcp): escape OAuth callback errors (#32242) (Aiden Cline, 2026-06-14)
- 85e278b - sync release versions for v1.17.7 (opencode, 2026-06-14)
- 87c33b3 - fix(plugin): reuse active server for client requests (Dax Raad, 2026-06-14)
- 3f81402 - chore: generate (opencode-agent[bot], 2026-06-14)
- d37ddc5 - feat(app): add prompt input story (#32308) (Brendan Allan, 2026-06-14)
- 3e523d5 - fix(tui): match @ mention items by name, not description or uri (#32309) (Shoubhit Dash, 2026-06-14)
- e4d4b07 - test(acp): make shell workdir location assertion windows-safe (#32306) (Shoubhit Dash, 2026-06-14)
- 5146142 - fix(acp): show shell command in ACP tool calls (#32304) (Shoubhit Dash, 2026-06-14)
- 3ab19bf - chore: generate (opencode-agent[bot], 2026-06-14)
- 0cf3ee4 - refactor(core): derive catalog availability from integrations (#32272) (Dax, 2026-06-14)
- 4810df0 - chore: generate (opencode-agent[bot], 2026-06-14)
- 010b456 - feat(app): scope sdk/sync hooks per-route so /new-session targets its draft server (#32290) (Brendan Allan, 2026-06-14)
- c81cd32 - chore: generate (opencode-agent[bot], 2026-06-14)
- 7ad68f8 - fix(server): apply plugin pty environment (#32296) (Shoubhit Dash, 2026-06-14)
- 8cc2276 - chore: generate (opencode-agent[bot], 2026-06-14)
- f2cf607 - refactor(core): canonicalize pty service (#32182) (Shoubhit Dash, 2026-06-14)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/shell.ts` (+1, -1)
- `packages/opencode/test/tool/shell.test.ts` (+1, -1)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/console/core/package.json` (+1, -1)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/catalog.ts` (+38, -50)
- `packages/core/src/config/plugin/provider.ts` (+25, -2)
- `packages/core/src/credential.ts` (+6, -0)
- `packages/core/src/integration.ts` (+73, -25)
- `packages/core/src/integration/connection.ts` (+6, -4)
- `packages/core/src/location.ts` (+2, -2)
- `packages/core/src/plugin/boot.ts` (+0, -2)
- `packages/core/src/plugin/env.ts` (+0, -22)
- `packages/core/src/plugin/models-dev.ts` (+2, -8)
- `packages/core/src/plugin/provider/llmgateway.ts` (+4, -1)
- `packages/core/src/plugin/provider/openai-auth.ts` (+4, -4)
- `packages/core/src/plugin/provider/opencode.ts` (+4, -4)
- `packages/core/src/provider.ts` (+1, -19)
- `packages/core/src/pty.ts` (+141, -104)
- `packages/core/src/pty/input.ts` (+0, -24)
- `packages/core/src/pty/protocol.ts` (+37, -0)
- `packages/core/src/session/runner/model.ts` (+38, -19)
- `packages/core/test/catalog.test.ts` (+57, -20)
- `packages/core/test/config/provider.test.ts` (+116, -103)
- `packages/core/test/integration.test.ts` (+31, -21)
- `packages/core/test/plugin/models-dev.test.ts` (+6, -4)
- `packages/core/test/plugin/provider-helper.ts` (+1, -0)
- `packages/core/test/plugin/provider-llmgateway.test.ts` (+18, -11)
- `packages/core/test/plugin/provider-openai.test.ts` (+4, -4)
- `packages/core/test/plugin/provider-opencode.test.ts` (+22, -36)
- `packages/core/test/pty/info-schema.test.ts` (+5, -0)
- `packages/core/test/pty/input.test.ts` (+0, -19)
- `packages/core/test/pty/protocol.test.ts` (+27, -0)
- `packages/core/test/pty/pty-output-isolation.test.ts` (+0, -110)
- `packages/core/test/pty/pty-session.test.ts` (+158, -10)
- `packages/core/test/session-runner-model.test.ts` (+32, -3)
- `packages/stats/core/package.json` (+1, -1)
- `packages/stats/core/src/domain/geo.ts` (+9, -1)
- `packages/stats/core/src/domain/home.ts` (+52, -31)
- `packages/stats/core/src/domain/model.ts` (+8, -1)
- `packages/stats/core/src/domain/provider.ts` (+8, -1)

#### Other Changes
- `CONTEXT.md` (+5, -0)
- `bun.lock` (+26, -26)
- `nix/hashes.json` (+4, -4)
- `packages/app/package.json` (+1, -1)
- `packages/app/src/app.tsx` (+91, -48)
- `packages/app/src/components/dialog-connect-provider.tsx` (+14, -14)
- `packages/app/src/components/dialog-custom-provider.tsx` (+5, -5)
- `packages/app/src/components/dialog-fork.tsx` (+7, -7)
- `packages/app/src/components/dialog-select-file.tsx` (+5, -5)
- `packages/app/src/components/dialog-select-mcp.tsx` (+2, -2)
- `packages/app/src/components/prompt-input.stories.tsx` (+117, -0)
- `packages/app/src/components/prompt-input.tsx` (+181, -152)
- `packages/app/src/components/prompt-input/attachments.ts` (+3, -2)
- `packages/app/src/components/prompt-input/context-items.tsx` (+1, -1)
- `packages/app/src/components/prompt-input/submit.test.ts` (+25, -13)
- `packages/app/src/components/prompt-input/submit.ts` (+36, -33)
- `packages/app/src/components/session-context-usage.tsx` (+1, -1)
- `packages/app/src/components/session/session-context-tab.tsx` (+4, -4)
- `packages/app/src/components/session/session-header.tsx` (+1, -1)
- `packages/app/src/components/session/session-new-view.tsx` (+6, -6)
- `packages/app/src/components/settings-general.tsx` (+5, -5)
- `packages/app/src/components/settings-providers.tsx` (+11, -9)
- `packages/app/src/components/settings-server-picker.tsx` (+1, -1)
- `packages/app/src/components/settings-v2/general.tsx` (+5, -5)
- `packages/app/src/components/settings-v2/providers.tsx` (+11, -9)
- `packages/app/src/components/status-popover-body.tsx` (+4, -4)
- `packages/app/src/components/status-popover.tsx` (+4, -4)
- `packages/app/src/components/terminal.tsx` (+3, -3)
- `packages/app/src/components/titlebar.tsx` (+2, -2)
- `packages/app/src/context/comments.tsx` (+1, -1)
- `packages/app/src/context/directory-sync.ts` (+2, -2)
- `packages/app/src/context/file.tsx` (+16, -11)
- `packages/app/src/context/layout.tsx` (+12, -12)
- `packages/app/src/context/local.tsx` (+11, -10)
- `packages/app/src/context/mcp.ts` (+1, -1)
- `packages/app/src/context/notification.tsx` (+5, -5)
- `packages/app/src/context/permission.tsx` (+16, -14)
- `packages/app/src/context/prompt.tsx` (+33, -15)
- `packages/app/src/context/sdk.tsx` (+10, -4)
- `packages/app/src/context/server-sdk.tsx` (+21, -11)
- `packages/app/src/context/server-sync.tsx` (+18, -15)
- `packages/app/src/context/sync.tsx` (+4, -1)
- `packages/app/src/context/terminal.tsx` (+5, -5)
- `packages/app/src/hooks/use-providers.ts` (+2, -2)
- `packages/app/src/pages/directory-layout.tsx` (+6, -3)
- `packages/app/src/pages/home.tsx` (+8, -8)
- `packages/app/src/pages/layout.tsx` (+65, -63)
- `packages/app/src/pages/layout/project-avatar-state.ts` (+2, -2)
- `packages/app/src/pages/layout/sidebar-items.tsx` (+2, -2)
- `packages/app/src/pages/layout/sidebar-project.tsx` (+4, -4)
- `packages/app/src/pages/layout/sidebar-workspace.tsx` (+8, -8)
- `packages/app/src/pages/new-session.tsx` (+2, -2)
- `packages/app/src/pages/session.tsx` (+71, -64)
- `packages/app/src/pages/session/composer/session-composer-region.tsx` (+74, -2)
- `packages/app/src/pages/session/composer/session-composer-state.ts` (+9, -9)
- `packages/app/src/pages/session/composer/session-question-dock.tsx` (+3, -3)
- `packages/app/src/pages/session/message-timeline.tsx` (+30, -30)
- `packages/app/src/pages/session/review-tab.tsx` (+2, -2)
- `packages/app/src/pages/session/usage-exceeded-dialogs.tsx` (+1, -1)
- `packages/app/src/pages/session/use-session-commands.tsx` (+23, -21)
- `packages/cli/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/mail/package.json` (+1, -1)
- `packages/console/support/package.json` (+1, -1)
- `packages/{opencode/src/shell => core/src}/shell.ts` (+31, -20)
- `packages/{opencode/test/shell => core/test}/shell.test.ts` (+12, -3)
- `packages/desktop/package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/enterprise/package.json` (+1, -1)
- `packages/function/package.json` (+1, -1)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/acp/event.ts` (+13, -7)
- `packages/opencode/src/acp/tool.ts` (+65, -19)
- `packages/opencode/src/mcp/catalog.ts` (+17, -0)
- `packages/opencode/src/mcp/oauth-callback.ts` (+18, -6)
- `packages/opencode/src/plugin/index.ts` (+3, -2)
- `packages/opencode/src/plugin/openai/codex.ts` (+10, -9)
- `packages/opencode/src/plugin/pty-environment.ts` (+24, -0)
- `packages/opencode/src/plugin/xai.ts` (+1, -19)
- `packages/opencode/src/pty-preparation.ts` (+0, -30)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/pty.ts` (+84, -74)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+3, -1)
- `packages/opencode/src/server/server.ts` (+15, -7)
- `packages/opencode/src/session/prompt.ts` (+1, -1)
- `packages/opencode/src/util/html.ts` (+8, -0)
- `packages/opencode/test/acp/event.test.ts` (+9, -2)
- `packages/opencode/test/acp/tool.test.ts` (+8, -1)
- `packages/opencode/test/mcp/oauth-callback.test.ts` (+38, -0)
- `packages/opencode/test/plugin/codex.test.ts` (+9, -0)
- `packages/opencode/test/plugin/xai.test.ts` (+0, -14)
- `packages/opencode/test/pty/pty-shell.test.ts` (+0, -102)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+38, -0)
- `packages/opencode/test/server/httpapi-listen.test.ts` (+53, -0)
- `packages/opencode/test/server/httpapi-pty.test.ts` (+27, -0)
- `packages/opencode/test/server/httpapi-v2-pty.test.ts` (+250, -0)
- `packages/opencode/test/session/prompt.test.ts` (+1, -1)
- `packages/opencode/test/util/html.test.ts` (+15, -0)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+291, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+436, -224)
- `packages/sdk/openapi.json` (+2366, -2185)
- `packages/server/package.json` (+1, -1)
- `packages/server/src/api.ts` (+2, -0)
- `packages/{opencode/src/server => server/src}/cors.ts` (+0, -0)
- `packages/server/src/errors.ts` (+15, -0)
- `packages/server/src/groups/credential.ts` (+22, -14)
- `packages/server/src/groups/pty.ts` (+144, -0)
- `packages/server/src/handlers.ts` (+4, -0)
- `packages/server/src/handlers/credential.ts` (+3, -3)
- `packages/server/src/handlers/integration.ts` (+2, -2)
- `packages/server/src/handlers/pty.ts` (+219, -0)
- `packages/server/src/middleware/authorization.ts` (+4, -0)
- `packages/server/src/pty-environment.ts` (+16, -0)
- `packages/server/src/routes.ts` (+2, -0)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/app/src/routes/[lab]/[model].tsx` (+11, -7)
- `packages/stats/app/src/routes/index.tsx` (+2, -4)
- `packages/stats/server/package.json` (+1, -1)
- `packages/storybook/.storybook/main.ts` (+1, -1)
- `packages/storybook/.storybook/mocks/app/context/permission.ts` (+3, -0)
- `packages/storybook/.storybook/mocks/app/context/prompt.ts` (+36, -28)
- `packages/storybook/.storybook/mocks/app/context/sdk.ts` (+10, -8)
- `packages/storybook/.storybook/mocks/app/context/sync.ts` (+17, -14)
- `packages/storybook/.storybook/mocks/solid-router.tsx` (+4, -0)
- `packages/storybook/.storybook/preview.tsx` (+1, -0)
- `packages/tui/package.json` (+1, -1)
- `packages/tui/src/component/prompt/autocomplete.tsx` (+4, -2)
- `packages/tui/src/context/data.tsx` (+11, -1)
- `packages/tui/test/cli/tui/data.test.tsx` (+49, -3)
- `packages/ui/package.json` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `patches/@modelcontextprotocol%2Fsdk@1.29.0.patch` (+26, -0)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index e574cb7..c0639dc 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.17.6",
+  "version": "1.17.7",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index ef73201..bafccf4 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.17.6",
+  "version": "1.17.7",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/catalog.ts
```diff
diff --git a/packages/core/src/catalog.ts b/packages/core/src/catalog.ts
index 0799f8f..4156db5 100644
--- a/packages/core/src/catalog.ts
+++ b/packages/core/src/catalog.ts
@@ -10,8 +10,7 @@ import { Location } from "./location"
 import { EventV2 } from "./event"
 import { Policy } from "./policy"
 import { State } from "./state"
-import { Credential } from "./credential"
-import { IntegrationSchema } from "./integration/schema"
+import { Integration } from "./integration"
 
 export type ProviderRecord = {
   provider: ProviderV2.Info
@@ -35,12 +34,7 @@ export class ModelNotFoundError extends Schema.TaggedErrorClass<ModelNotFoundErr
 export const PolicyActions = Schema.Literals(["provider.use"])
 
 export const Event = {
-  ModelUpdated: EventV2.define({
-    type: "catalog.model.updated",
-    schema: {
-      model: ModelV2.Info,
-    },
-  }),
+  Updated: EventV2.define({ type: "catalog.updated", schema: {} }),
 }
 
 type Data = {
@@ -96,26 +90,17 @@ export const layer = Layer.effect(
     const plugin = yield* PluginV2.Service
     const events = yield* EventV2.Service
     const policy = yield* Policy.Service
-    const credentials = yield* Credential.Service
+    const integrations = yield* Integration.Service
     const scope = yield* Scope.Scope
 
-    const project = (provider: ProviderV2.Info, active: Map<IntegrationSchema.ID, Credential.Stored>) => {
-      const credential = active.get(IntegrationSchema.ID.make(provider.id))
-      if (!credential) return provider
-      const body = { ...provider.request.body }
-      if (credential.value.type === "key") {
-        body.apiKey = credential.value.key
-        Object.assign(body, credential.value.metadata ?? {})
-      }
-      if (credential.value.type === "oauth") body.apiKey = credential.value.access
-      return new ProviderV2.Info({
-        ...provider,
-        enabled: { via: "credential", credentialID: credential.id },
-        request: { ...provider.request, body },
-      })
```

#### packages/core/src/config/plugin/provider.ts
```diff
diff --git a/packages/core/src/config/plugin/provider.ts b/packages/core/src/config/plugin/provider.ts
index 0d31b32..47a3712 100644
--- a/packages/core/src/config/plugin/provider.ts
+++ b/packages/core/src/config/plugin/provider.ts
@@ -3,6 +3,7 @@ export * as ConfigProviderPlugin from "./provider"
 import { Effect } from "effect"
 import { Catalog } from "../../catalog"
 import { Config } from "../../config"
+import { Integration } from "../../integration"
 import { ModelV2 } from "../../model"
 import { ModelRequest } from "../../model-request"
 import { PluginV2 } from "../../plugin"
@@ -13,9 +14,33 @@ export const Plugin = PluginV2.define({
   effect: Effect.gen(function* () {
     const catalog = yield* Catalog.Service
     const config = yield* Config.Service
+    const integrations = yield* Integration.Service
     const transform = yield* catalog.transform()
+    const integrationTransform = yield* integrations.transform()
     const entries = yield* config.entries()
     const files = entries.filter((entry): entry is Config.Document => entry.type === "document")
+    const configuredIntegrations = new Set(
+      files.flatMap((file) =>
+        Object.entries(file.info.providers ?? {}).flatMap(([id, provider]) => (provider.env === undefined ? [] : [id])),
+      ),
+    )
+    yield* integrationTransform((integrations) => {
+      for (const file of files) {
+        for (const [id, item] of Object.entries(file.info.providers ?? {})) {
+          const integrationID = Integration.ID.make(id)
+          if (!configuredIntegrations.has(id) && !integrations.get(integrationID)) continue
+          integrations.update(integrationID, (integration) => {
+            integration.name = item.name ?? integration.name
+          })
+          if (item.env !== undefined) {
+            integrations.method.update({
+              integrationID,
+              method: { type: "env", names: [...item.env] },
+            })
+          }
+        }
+      }
+    })
 
     yield* transform((catalog) => {
       const configuredDefault = Config.latest(entries, "model")
@@ -28,8 +53,6 @@ export const Plugin = PluginV2.define({
           const providerID = ProviderV2.ID.make(id)
           catalog.provider.update(providerID, (provider) => {
             if (item.name !== undefined) provider.name = item.name
```

#### packages/core/src/credential.ts
```diff
diff --git a/packages/core/src/credential.ts b/packages/core/src/credential.ts
index 77bece2..937ec4a 100644
--- a/packages/core/src/credential.ts
+++ b/packages/core/src/credential.ts
@@ -46,6 +46,8 @@ export interface Interface {
   readonly all: () => Effect.Effect<Stored[]>
   /** Returns stored credentials belonging to one integration. */
   readonly list: (integrationID: IntegrationSchema.ID) => Effect.Effect<Stored[]>
+  /** Returns one stored credential by ID. */
+  readonly get: (id: ID) => Effect.Effect<Stored | undefined>
   /** Replaces any credential for an integration and returns the new record. */
   readonly create: (input: {
     readonly integrationID: IntegrationSchema.ID
@@ -99,6 +101,10 @@ export const layer = Layer.effect(
           return credential ? [credential] : []
         })
       }),
+      get: Effect.fn("Credential.get")(function* (id) {
+        const row = yield* db.select().from(CredentialTable).where(eq(CredentialTable.id, id)).get().pipe(Effect.orDie)
+        return row ? stored(row) : undefined
+      }),
       create: Effect.fn("Credential.create")(function* (input) {
         const credential = new Stored({
           id: ID.create(),
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from .opencode/agent/triage.md
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/kilocode/agent/index.ts
- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/src/catalog.ts
- `src/core/` - review core changes from packages/core/src/event.ts
- `src/core/` - review core changes from packages/core/src/flag/flag.ts
- `src/core/` - review core changes from packages/core/src/instance-layer.ts
- `src/core/` - review core changes from packages/core/src/instance.ts
- `src/core/` - review core changes from packages/core/src/location-layer.ts
- `src/core/` - review core changes from packages/core/src/location.ts
- `src/core/` - review core changes from packages/core/src/session.ts
- `src/core/` - review core changes from packages/core/test/catalog.test.ts
- `src/core/` - review core changes from packages/core/test/event.test.ts
- `src/core/` - review core changes from packages/core/test/plugin/provider-opencode.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/constants/AutocompleteLanguageInfo.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/context/ranking/index.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/context/ranking/index.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/context/static-context/StaticContextService.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/BracketMatchingService.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/BracketMatchingService.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/streamTransforms/lineStream.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/filtering/streamTransforms/lineStream.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/snippets/getAllSnippets.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/snippets/getAllSnippets.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/templating/AutocompleteTemplate.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/templating/__tests__/formatOpenedFilesContext.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/templating/filtering.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/autocomplete/types.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/diff/util.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/diff/util.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/index.d.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/util/messageContent.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/util/parameters.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/util/ranges.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/util/treeSitter.test.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/util/treeSitter.ts
- `src/core/` - review core changes from packages/kilo-vscode/src/services/autocomplete/continuedev/core/vscode-test-harness/src/autocomplete/lsp.ts
- `src/permission/` - review permission changes from packages/opencode/src/kilocode/permission/drain.ts
- `src/permission/` - review permission changes from packages/opencode/src/permission/index.ts
- `src/permission/` - review permission changes from packages/opencode/test/kilocode/permission/external-directory-allow.test.ts
- `src/permission/` - review permission changes from packages/opencode/test/kilocode/permission/next.reply-http.test.ts
- `src/tool/external-directory.test.ts` - update based on kilocode packages/opencode/test/tool/external-directory.test.ts changes
- `src/tool/lsp.test.ts` - update based on kilocode packages/opencode/test/tool/lsp.test.ts changes
- `src/tool/read.test.ts` - update based on kilocode packages/opencode/test/tool/read.test.ts changes
- `src/tool/recall.test.ts` - update based on kilocode packages/opencode/test/tool/recall.test.ts changes
- `src/tool/recall.ts` - update based on kilocode packages/opencode/src/tool/recall.ts changes
- `src/tool/registry.test.ts` - update based on kilocode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
- `src/tool/repo_overview.test.ts` - update based on kilocode packages/opencode/test/tool/repo_overview.test.ts changes
- `src/tool/repo_overview.ts` - update based on kilocode packages/opencode/src/tool/repo_overview.ts changes
- `src/tool/semantic-search.ts` - update based on kilocode packages/opencode/src/kilocode/tool/semantic-search.ts changes
- `src/tool/shell.test.ts` - update based on opencode packages/opencode/test/tool/shell.test.ts changes
- `src/tool/shell.ts` - update based on kilocode packages/opencode/src/tool/shell.ts changes
- `src/tool/shell.ts` - update based on opencode packages/opencode/src/tool/shell.ts changes
- `src/tool/shell.txt.ts` - update based on kilocode packages/opencode/src/tool/shell/shell.txt changes
- `src/tool/skill.test.ts` - update based on kilocode packages/opencode/test/tool/skill.test.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/kilocode/tool/task.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/tool/task.ts changes
- `src/tool/task.txt.ts` - update based on kilocode packages/opencode/src/tool/task.txt changes
- `src/tool/todowrite.txt.ts` - update based on kilocode packages/opencode/src/tool/todowrite.txt changes
- `src/tool/warpgrep.ts` - update based on kilocode packages/opencode/src/tool/warpgrep.ts changes
- `src/tool/write.test.ts` - update based on kilocode packages/opencode/test/tool/write.test.ts changes
