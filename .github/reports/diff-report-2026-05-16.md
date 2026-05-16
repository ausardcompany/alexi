# Upstream Changes Report
Generated: 2026-05-16 08:06:25

## Summary
- kilocode: 139 commits, 250 files changed
- opencode: 0 commits, 0 files changed

## kilocode Changes (c60006514..f44d75d9d)

### Commits

- f44d75d9d - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-05-15)
- 9095d6ecb - Merge pull request #10293 from Kilo-Org/security-mermaid-11-15-0 (Marius, 2026-05-15)
- 7e06c68e8 - Merge pull request #10290 from shssoichiro/semantic-search-use (Marius, 2026-05-15)
- 2b424b1f0 - fix: unblock patched mermaid installs (marius-kilocode, 2026-05-15)
- 05cf9b98c - fix: allow vetted mermaid security release (marius-kilocode, 2026-05-15)
- af115afe2 - fix: update mermaid to patched release (marius-kilocode, 2026-05-15)
- dc5dd8a29 - Merge pull request #10291 from Kilo-Org/catrielmuller/fix-tts-linux-pipewire (Catriel Müller, 2026-05-15)
- 59af47d97 - Merge pull request #10162 from Kilo-Org/glaze-nickel (Kirill Kalishev, 2026-05-15)
- 98e314fde - Merge pull request #10269 from Kilo-Org/flourish-donkey (Kirill Kalishev, 2026-05-15)
- 62d2740fb - style(vscode): format speech capture pipeline (Catriel Müller, 2026-05-15)
- 0d7bd4fb3 - test: update assertions (Josh Holmer, 2026-05-15)
- ff1c50050 - fix(vscode): handle pipewire recorder failures (Catriel Müller, 2026-05-15)
- 5fe4dbcaf - test(agent-manager): avoid tsx import in annotation test (Catriel Müller, 2026-05-15)
- 1789f3670 - fix(vscode): support pipewire speech input (Catriel Müller, 2026-05-15)
- deddacf06 - fix: only include semantic search tool hint when enabled (Josh Holmer, 2026-05-15)
- 3ec9be9ab - Merge pull request #10287 from Kilo-Org/eight-timbale (Marius, 2026-05-15)
- 863ca97ab - fix(indexing): clarifications and improvements to semantic search tool description (Josh Holmer, 2026-05-15)
- 1acecd703 - test(agent-manager): cover markdown annotation mutations (marius-kilocode, 2026-05-15)
- 233da8276 - fix(agent-manager): stabilize markdown review capture (marius-kilocode, 2026-05-15)
- d5f93bddf - Merge pull request #10286 from Kilo-Org/shine-lake (Marius, 2026-05-15)
- 35f7aa3e6 - Merge pull request #10285 from Kilo-Org/sun-culotte (Marius, 2026-05-15)
- 5fa471dc1 - Merge pull request #10280 from Kilo-Org/uncovered-telephone (Marius, 2026-05-15)
- 6fcc3b6a1 - feat(vscode): export session transcripts as markdown (marius-kilocode, 2026-05-15)
- d23e16205 - chore(cli): track codebase search usage (marius-kilocode, 2026-05-15)
- a793e5954 - Merge pull request #10219 from Kilo-Org/fix/agent-manager-attribution (Marius, 2026-05-15)
- c868ccb27 - Merge pull request #10132 from Kilo-Org/sugared-sense (Marius, 2026-05-15)
- cebe4c0ca - fix(vscode): isolate speech unit toast import (marius-kilocode, 2026-05-15)
- 76bd73e7a - Merge remote-tracking branch 'origin/main' into fix/agent-manager-attribution (marius-kilocode, 2026-05-15)
- 64bbc1171 - Merge remote-tracking branch 'origin/main' into sugared-sense (marius-kilocode, 2026-05-15)
- aeeea7cd5 - Merge branch 'main' into fix/agent-manager-attribution (marius-kilocode, 2026-05-15)
- 304e33f2e - Merge pull request #10274 from Kilo-Org/safe-apparel (Marius, 2026-05-15)
- 630bf8f86 - Merge pull request #10277 from Kilo-Org/almond-yoke (Marius, 2026-05-15)
- 81f91775e - Merge pull request #10278 from Kilo-Org/whimsical-adasaurus (Marius, 2026-05-15)
- 75fb7903f - Merge branch 'main' into sugared-sense (Marius, 2026-05-15)
- 27b591f03 - Merge branch 'main' into almond-yoke (Marius, 2026-05-15)
- 849d0e356 - Merge branch 'main' into safe-apparel (Marius, 2026-05-15)
- 631a3ad90 - Merge branch 'main' into whimsical-adasaurus (Marius, 2026-05-15)
- d1404579f - release: v7.3.0 (kilo-maintainer[bot], 2026-05-15)
- 48545bb1c - Merge pull request #10279 from Kilo-Org/tulip-cabin (Marius, 2026-05-15)
- b4e41980c - fix(agent-manager): satisfy CSS prefix guard (marius-kilocode, 2026-05-15)
- 8de6c2ea8 - release: v7.2.54 (kilo-maintainer[bot], 2026-05-15)
- 3ac16c5be - fix(agent-manager): prevent prompt selector clipping (marius-kilocode, 2026-05-15)
- a3769d83d - fix(cli): keep prompt enhancement in rewrite mode (marius-kilocode, 2026-05-15)
- 6f24f78e5 - ci: retry Windows Node setup in tests (marius-kilocode, 2026-05-15)
- b3393c739 - Merge pull request #10275 from Kilo-Org/bolder-petroleum (Marius, 2026-05-15)
- d6341d3e6 - Merge remote-tracking branch 'origin/main' into whimsical-adasaurus (marius-kilocode, 2026-05-15)
- 12acd6f8b - fix(agent-manager): preserve active session while routing worktrees (marius-kilocode, 2026-05-15)
- a26659b62 - fix(agent-manager): harden inline review speech renderer (marius-kilocode, 2026-05-15)
- 3031de630 - fix(agent-manager): continue sessions in worktrees (marius-kilocode, 2026-05-15)
- 4b816f621 - fix(vscode): send recorded prompts from send button (marius-kilocode, 2026-05-15)
- 62bd02891 - test(agent-manager): include speech annotation source (marius-kilocode, 2026-05-15)
- f5dc95b99 - fix(vscode): preserve spoken transcription wording (marius-kilocode, 2026-05-15)
- 14a25b037 - feat(agent-manager): add voice input to inline review comments (marius-kilocode, 2026-05-15)
- bcb21806f - docs(jetbrains): add RELEASING.md with RC release instructions and link from READMEs (kirillk, 2026-05-14)
- a4218d893 - Merge pull request #9801 from Kilo-Org/morning-tibia (Kirill Kalishev, 2026-05-14)
- 3f4237331 - Merge pull request #10222 from Kilo-Org/kiwi-acorn (Kirill Kalishev, 2026-05-14)
- 7bc46c54d - Merge pull request #10263 from Kilo-Org/axiomatic-gouda (Catriel Müller, 2026-05-14)
- 410bae8c2 - ci: add publish-jetbrains.yml to workflow allowlist (kirillk, 2026-05-14)
- 9a8225cbb - ci(jetbrains): require v-prefixed publish tags (kirillk, 2026-05-14)
- 5e4682338 - revert: remove out-of-scope fix in KiloBackendSessionManager (kirillk, 2026-05-14)
- c4716769e - Merge branch 'main' into morning-tibia (kirillk, 2026-05-14)
- 43d9dd23e - fix: comment (Catriel Müller, 2026-05-14)
- fe969a18e - fix(vscode): update speech capture tooltip (#10266) (Marius, 2026-05-14)
- 0f1626420 - fix: tests (Catriel Müller, 2026-05-14)
- 47f65f76e - Merge pull request #10265 from Kilo-Org/fix/vscode-snapshot-cli-rebuild (Marius, 2026-05-14)
- 78db58e59 - Merge pull request #10264 from Kilo-Org/mark/copy-tooltip-top (Mark IJbema, 2026-05-14)
- 900ba85b8 - fix(vscode): rebuild CLI for snapshot installs (marius-kilocode, 2026-05-14)
- 1d80231da - refactor: address the comments (Catriel Müller, 2026-05-14)
- 262c2d670 - fix(ui): place copy tooltip above button to avoid overlapping thumbs (kiloconnect[bot], 2026-05-14)
- c1a797c1f - fix(cli): chunk oversized compactions (Catriel Müller, 2026-05-14)
- cb83e473c - Merge pull request #10258 from Kilo-Org/cedar-titanosaurus (Marius, 2026-05-14)
- 576babe9f - fix(vscode): lock speech capture during startup (marius-kilocode, 2026-05-14)
- 03239c071 - refactor(vscode): simplify speech input wiring (marius-kilocode, 2026-05-14)
- 3885ff817 - fix(vscode): address speech input review issues (marius-kilocode, 2026-05-14)
- 78ffce39d - fix(vscode): expand ffmpeg fallback paths (marius-kilocode, 2026-05-14)
- c2220dc3d - Merge pull request #10256 from Kilo-Org/silky-naranja (Marius, 2026-05-14)
- 39635122a - chore: address speech input review feedback (marius-kilocode, 2026-05-14)
- 1e397c305 - chore: address speech input review (marius-kilocode, 2026-05-14)
- 1daaa0a8d - fix(agent-manager): remove redundant terminal comments cast (marius-kilocode, 2026-05-14)
- 5c9fc5b40 - chore: remove speech input plan (marius-kilocode, 2026-05-14)
- 5b841e97f - Merge remote-tracking branch 'origin/main' into cedar-titanosaurus (marius-kilocode, 2026-05-14)
- 09cb91681 - chore: keep bun lock unchanged (marius-kilocode, 2026-05-14)
- 0f76700e7 - chore: restore bun lockfile (marius-kilocode, 2026-05-14)
- 1af79731a - feat(vscode): add speech-to-text prompt input (marius-kilocode, 2026-05-14)
- da9292fbc - fix(agent-manager): support diff sidebar with terminals (marius-kilocode, 2026-05-14)
- 752022556 - Merge pull request #10243 from Kilo-Org/holistic-diadem (Marius, 2026-05-14)
- 47c22a28e - fix(ui): preserve chat tool collapse state (marius-kilocode, 2026-05-14)
- ddf3ea691 - Merge pull request #10240 from Kilo-Org/harmless-perfume (Marius, 2026-05-14)
- 09f0156bf - fix(vscode): keep worktree model search open (marius-kilocode, 2026-05-14)
- 1fbe69603 - Merge pull request #10228 from Kilo-Org/supersede-shell-command-highlighting (Marius, 2026-05-14)
- a19c91f83 - Merge pull request #10214 from Kilo-Org/docs/update-mobile-apps (arrrkady, 2026-05-14)
- 0baee717e - Merge pull request #10227 from Kilo-Org/island-medusaceratops (Marius, 2026-05-14)
- 710b9c513 - Merge pull request #10230 from Kilo-Org/pear-rudbeckia (Marius, 2026-05-14)
- f14c03165 - Merge pull request #10235 from Kilo-Org/mark/upstream-merge-no-minimizer-skill (Mark IJbema, 2026-05-14)
- 52b4350bc - docs(agent): forbid kilocode-merge-minimizer skill in upstream-merge agent (kiloconnect[bot], 2026-05-14)
- a41be4c84 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-05-14)
- af5c05de7 - fix(vscode): use inert instead of aria-hidden on collapsed sidebar (marius-kilocode, 2026-05-14)
- 9f6997ef3 - fix(cli): preserve child task attribution (marius-kilocode, 2026-05-14)
- 1abd32ecc - fix(ui): cancel stale shell highlighting (marius-kilocode, 2026-05-14)
- 26f5393be - feat(vscode): collapsible Agent Manager sidebar with persistent state (marius-kilocode, 2026-05-14)
- dea616934 - fix(ui): harden shell highlighting rendering (marius-kilocode, 2026-05-14)
- e1e2454b4 - fix(agent-manager): hide subagent sessions from list (marius-kilocode, 2026-05-14)
- b65c4b28c - Revert "Merge remote-tracking branch 'origin/morning-tibia' into kiwi-acorn" (kirillk, 2026-05-13)
- 72bd8f837 - Merge remote-tracking branch 'origin/morning-tibia' into kiwi-acorn (kirillk, 2026-05-13)
- 911e7ce73 - feat(ui): add shell command syntax highlighting with Shiki and section labels (Sylwester Liljegren, 2026-05-14)
- b40622354 - refactor(jetbrains): extract svg icon colorizer (kirillk, 2026-05-13)
- 96d23223a - fix(jetbrains): use svg patcher for scroll icon (kirillk, 2026-05-13)
- 2d365fe70 - fix(jetbrains): reduce marketplace verifier warnings (kirillk, 2026-05-13)
- fff4277c4 - chore(i18n): remove plan ready comments (kirillk, 2026-05-13)
- 064bb1b6a - chore: remove plan files (kirillk, 2026-05-13)
- 62e98e8b3 - style(vscode): format assistant message (kirillk, 2026-05-13)
- fb420a1af - fix(vscode): use inert plan link href (kirillk, 2026-05-13)
- 0db819580 - chore: add plan files (kirillk, 2026-05-13)
- 233dc4b1d - Merge remote-tracking branch 'origin/glaze-nickel' into glaze-nickel (kirillk, 2026-05-13)
- efc411eeb - fix(i18n): add plan ready translations (kirillk, 2026-05-13)
- 8de3db437 - Merge branch 'main' into glaze-nickel (Kirill Kalishev, 2026-05-13)
- e858b06c8 - Merge remote-tracking branch 'origin/glaze-nickel' into glaze-nickel (kirillk, 2026-05-13)
- e5f7f6d8e - fix(vscode): simplify plan ready label (kirillk, 2026-05-13)
- 997f522d1 - fix(cli): keep session bootstrap compatible (marius-kilocode, 2026-05-13)
- 187c7a631 - fix(cli): guard session bootstrap parent recursion (marius-kilocode, 2026-05-13)
- 827e75acc - refactor(cli): keep attribution lookups in memory (marius-kilocode, 2026-05-13)
- ce64a962b - fix(vscode): attribute Agent Manager sessions by root context (marius-kilocode, 2026-05-13)
- a0262c19a - Merge remote-tracking branch 'origin/main' into glaze-nickel (kirillk, 2026-05-13)
- e369798a3 - docs(kilo-docs): tune mobile screenshot gallery sizing (kiloconnect[bot], 2026-05-13)
- c3acddd30 - docs(kilo-docs): add image gallery tag (kiloconnect[bot], 2026-05-13)
- 2a9144e8e - docs(kilo-docs): compress mobile app screenshots (kiloconnect[bot], 2026-05-13)
- d4e995117 - docs(kilo-docs): update mobile apps documentation (kiloconnect[bot], 2026-05-13)
- cb3ffada7 - Merge branch 'main' into glaze-nickel (Kirill Kalishev, 2026-05-12)
- 25df75d17 - fix(vscode): render plan exit as file link (kirillk, 2026-05-11)
- 1f3df3557 - fix(vscode): address restore review feedback (marius-kilocode, 2026-05-11)
- b91457673 - fix(vscode): restore only previously open Kilo views (marius-kilocode, 2026-05-11)
- 744fb1df5 - Merge branch 'main' into morning-tibia (Kirill Kalishev, 2026-05-08)
- f27afbd6e - Merge remote-tracking branch 'origin/morning-tibia' into morning-tibia (kirillk, 2026-05-06)
- 138a02f31 - Merge branch 'unleashed-romano' into morning-tibia (kirillk, 2026-05-06)
- c104a3b47 - fix(jetbrains): map session times as doubles (kirillk, 2026-05-06)
- 06a066d13 - Merge branch 'main' into morning-tibia (Kirill Kalishev, 2026-05-06)
- 9b9741aca - Merge branch 'main' into morning-tibia (Kirill Kalishev, 2026-05-06)
- 8b34a34d1 - ci(jetbrains): annotate publish workflow (kirillk, 2026-05-03)
- b12c7cf10 - ci(jetbrains): publish marketplace rc builds (kirillk, 2026-05-03)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/registry.ts` (+11, -0)
- `packages/opencode/src/kilocode/tool/semantic-search.txt` (+28, -13)
- `packages/opencode/src/tool/grep.txt` (+0, -1)
- `packages/opencode/src/tool/registry.ts` (+25, -22)
- `packages/opencode/src/tool/warpgrep.ts` (+2, -0)

#### Agent System (packages/*/src/agent/)
- `.kilo/agent/upstream-merge.md` (+6, -0)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)

#### Other Changes
- `.changeset/agent-manager-prompt-picker.md` (+5, -0)
- `.changeset/agent-manager-state-exclude.md` (+0, -5)
- `.changeset/bright-checkpoints-graph.md` (+0, -5)
- `.changeset/bright-searches-count.md` (+5, -0)
- `.changeset/codex-chatgpt-reauth.md` (+0, -6)
- `.changeset/continue-worktree-sessions.md` (+5, -0)
- `.changeset/fix-tui-diff-hunk-headers.md` (+0, -6)
- `.changeset/inline-review-speech.md` (+5, -0)
- `.changeset/local-worktree-revert-diff.md` (+0, -5)
- `.changeset/manual-compact-limit.md` (+0, -7)
- `.changeset/markdown-review-voice.md` (+5, -0)
- `.changeset/mermaid-security-fixes.md` (+6, -0)
- `.changeset/placeholder-vscode-token.md` (+0, -5)
- `.changeset/reset-reverted-todos.md` (+0, -5)
- `.changeset/shiny-sessions-export.md` (+5, -0)
- `.changeset/silent-mermaid-labels.md` (+0, -6)
- `.changeset/smart-views-restore.md` (+5, -0)
- `.changeset/swift-voices-send.md` (+5, -0)
- `.changeset/tame-responses-items.md` (+0, -6)
- `.changeset/vscode-mode-model-sync.md` (+0, -5)
- `.github/workflows/publish-jetbrains.yml` (+167, -0)
- `.github/workflows/test.yml` (+11, -1)
- `README.md` (+3, -1)
- `bun.lock` (+22, -54)
- `bunfig.toml` (+1, -0)
- `nix/hashes.json` (+4, -4)
- `package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/kilo-docs/components/Image.tsx` (+3, -2)
- `packages/kilo-docs/components/ImageGallery.tsx` (+52, -0)
- `packages/kilo-docs/components/index.js` (+1, -0)
- `packages/kilo-docs/markdoc/tags/image-gallery.markdoc.ts` (+16, -0)
- `packages/kilo-docs/markdoc/tags/index.ts` (+1, -0)
- `packages/kilo-docs/package.json` (+2, -2)
- `packages/kilo-docs/pages/code-with-ai/agents/chat-interface.md` (+6, -0)
- `packages/kilo-docs/pages/code-with-ai/platforms/mobile.md` (+32, -8)
- `packages/kilo-docs/pages/code-with-ai/platforms/vscode/index.md` (+1, -0)
- `packages/kilo-docs/public/img/mobile-apps/home.webp` (+-, --)
- `packages/kilo-docs/public/img/mobile-apps/kiloclaw-chat.webp` (+-, --)
- `packages/kilo-docs/public/img/mobile-apps/new-session.webp` (+-, --)
- `packages/kilo-docs/public/img/mobile-apps/session-chat.webp` (+-, --)
- `packages/kilo-docs/public/img/mobile-apps/session-filters.webp` (+-, --)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/message-list-tool-to-queued-user-spacing-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/components-shell/shell-execution-chromium-linux.png` (+2, -2)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-gateway/src/api/constants.ts` (+1, -0)
- `packages/kilo-gateway/src/headers.ts` (+2, -0)
- `packages/kilo-gateway/src/index.ts` (+1, -0)
- `packages/kilo-gateway/src/provider-debug.ts` (+2, -6)
- `packages/kilo-gateway/src/provider.ts` (+9, -6)
- `packages/kilo-gateway/src/server/routes.ts` (+81, -8)
- `packages/kilo-gateway/test/provider.test.ts` (+23, -0)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-i18n/src/ar.ts` (+4, -0)
- `packages/kilo-i18n/src/br.ts` (+4, -0)
- `packages/kilo-i18n/src/bs.ts` (+4, -0)
- `packages/kilo-i18n/src/da.ts` (+5, -1)
- `packages/kilo-i18n/src/de.ts` (+4, -0)
- `packages/kilo-i18n/src/en.ts` (+4, -0)
- `packages/kilo-i18n/src/es.ts` (+4, -0)
- `packages/kilo-i18n/src/fr.ts` (+5, -1)
- `packages/kilo-i18n/src/ja.ts` (+5, -1)
- `packages/kilo-i18n/src/ko.ts` (+5, -1)
- `packages/kilo-i18n/src/nl.ts` (+5, -1)
- `packages/kilo-i18n/src/no.ts` (+5, -1)
- `packages/kilo-i18n/src/pl.ts` (+4, -0)
- `packages/kilo-i18n/src/ru.ts` (+5, -1)
- `packages/kilo-i18n/src/th.ts` (+4, -0)
- `packages/kilo-i18n/src/tr.ts` (+5, -1)
- `packages/kilo-i18n/src/uk.ts` (+5, -1)
- `packages/kilo-i18n/src/zh.ts` (+4, -0)
- `packages/kilo-i18n/src/zht.ts` (+4, -0)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/README.md` (+6, -0)
- `packages/kilo-jetbrains/RELEASE_TODO.md` (+44, -0)
- `packages/kilo-jetbrains/RELEASING.md` (+62, -0)
- `packages/kilo-jetbrains/build.gradle.kts` (+57, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/history/HistoryPanel.kt` (+10, -12)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/scroll/ScrollButtonIcon.kt` (+17, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/{ => scroll}/SessionScroll.kt` (+3, -44)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/PickerRow.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/model/ModelPicker.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/model/ModelPickerRenderer.kt` (+6, -8)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/PromptPanel.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/SvgIconColorizer.kt` (+46, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/HistorySessionActionsTest.kt` (+14, -13)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/NewSessionActionTest.kt` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/SendPromptActionTest.kt` (+4, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/StopSessionActionTest.kt` (+4, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionUiTestBase.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/model/ModelPickerTest.kt` (+2, -2)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/basic-tool.tsx` (+27, -1)
- `packages/kilo-ui/src/components/message-part.css` (+60, -2)
- `packages/kilo-ui/src/components/message-part.tsx` (+117, -37)
- `packages/kilo-ui/src/components/shell-rolling-results.tsx` (+31, -5)
- `packages/kilo-ui/src/components/tool-open-state.ts` (+33, -0)
- `packages/kilo-ui/src/util/escape-html.ts` (+3, -0)
- `packages/kilo-vscode/CHANGELOG.md` (+53, -0)
- `packages/kilo-vscode/package.json` (+10, -1)
- `packages/kilo-vscode/script/build.ts` (+4, -0)
- `packages/kilo-vscode/script/dev-snapshot.ts` (+1, -1)
- `packages/kilo-vscode/script/ffmpeg-helper.ts` (+49, -0)
- `packages/kilo-vscode/script/local-bin.ts` (+3, -0)
- `packages/kilo-vscode/src/KiloProvider.ts` (+120, -28)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+53, -2)
- `packages/kilo-vscode/src/agent-manager/WorktreeStateManager.ts` (+19, -0)
- `packages/kilo-vscode/src/agent-manager/__tests__/AgentManagerProvider.spec.ts` (+26, -0)
- `packages/kilo-vscode/src/agent-manager/host.ts` (+1, -0)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+10, -0)
- `packages/kilo-vscode/src/agent-manager/vscode-host.ts` (+6, -0)
- `packages/kilo-vscode/src/extension.ts` (+30, -1)
- `packages/kilo-vscode/src/kilo-provider-utils.ts` (+5, -1)
- `packages/kilo-vscode/src/kilo-provider/early-message.ts` (+26, -0)
- `packages/kilo-vscode/src/kilo-provider/export-transcript.ts` (+58, -0)
- `packages/kilo-vscode/src/kilo-provider/options.ts` (+3, -0)
- `packages/kilo-vscode/src/services/input-tools.ts` (+49, -0)
- `packages/kilo-vscode/src/speech-to-text/capture.ts` (+345, -0)
- `packages/kilo-vscode/src/speech-to-text/config.ts` (+13, -0)
- `packages/kilo-vscode/src/speech-to-text/handler.ts` (+129, -0)
- `packages/kilo-vscode/src/speech-to-text/models.ts` (+51, -0)
- `packages/kilo-vscode/src/speech-to-text/settings.ts` (+19, -0)
- `packages/kilo-vscode/src/speech-to-text/transcribe.ts` (+111, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+2, -0)
- `packages/kilo-vscode/tests/unit/export-transcript.test.ts` (+58, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-worktree-context.test.ts` (+11, -0)
- `packages/kilo-vscode/tests/unit/kilo-ui-contract.test.ts` (+54, -0)
- `packages/kilo-vscode/tests/unit/markdown-annotation-layer.test.ts` (+20, -0)
- `packages/kilo-vscode/tests/unit/navigate.test.ts` (+100, -0)
- `packages/kilo-vscode/tests/unit/plan-exit.test.ts` (+105, -0)
- `packages/kilo-vscode/tests/unit/prompt-input-utils.test.ts` (+24, -0)
- `packages/kilo-vscode/tests/unit/review-comments.test.ts` (+52, -0)
- `packages/kilo-vscode/tests/unit/speech-to-text-capture.test.ts` (+39, -0)
- `packages/kilo-vscode/tests/unit/speech-to-text-models-sync.test.ts` (+19, -0)
- `packages/kilo-vscode/tests/unit/tool-open-state.test.ts` (+34, -0)
- `packages/kilo-vscode/tests/unit/use-speech-to-text.test.ts` (+89, -0)
- `packages/kilo-vscode/tests/unit/worktree-state-manager.test.ts` (+34, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+135, -142)
- `packages/kilo-vscode/webview-ui/agent-manager/DiffPanel.tsx` (+42, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/FullScreenDiffView.tsx` (+42, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/MarkdownAnnotationLayer.tsx` (+8, -4)
- `packages/kilo-vscode/webview-ui/agent-manager/NewWorktreeDialog.tsx` (+37, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/SidebarToggleButton.tsx` (+29, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+77, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fr.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ja.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ko.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/nl.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/no.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/pl.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ru.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/th.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/tr.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/uk.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zh.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zht.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/markdown-annotation-mutation.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/navigate.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/review-annotation-speech.tsx` (+138, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/review-annotations.ts` (+34, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/shortcuts.ts` (+67, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/sidebar-collapse.ts` (+38, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/terminal/TerminalTab.tsx` (+9, -0)
- `packages/kilo-vscode/webview-ui/src/App.tsx` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/AssistantMessage.tsx` (+86, -16)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+100, -17)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskToolExpanded.tsx` (+9, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/prompt-input-utils.ts` (+17, -0)
- `packages/kilo-vscode/webview-ui/src/components/history/SessionList.tsx` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/ExperimentalTab.tsx` (+46, -1)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelSelector.tsx` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/components/speech-to-text/SpeechToTextButton.tsx` (+72, -0)
- `packages/kilo-vscode/webview-ui/src/components/speech-to-text/availability.ts` (+23, -0)
- `packages/kilo-vscode/webview-ui/src/components/speech-to-text/model-selector.ts` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/components/speech-to-text/useSpeechToText.ts` (+180, -0)
- `packages/kilo-vscode/webview-ui/src/context/config.tsx` (+23, -10)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+14, -0)
- `packages/kilo-vscode/webview-ui/src/hooks/useSlashCommand.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+24, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+25, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+25, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+24, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+25, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+24, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+25, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+25, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+24, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+24, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+24, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+24, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+25, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+25, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+25, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+24, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+25, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+22, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+22, -0)
- `packages/kilo-vscode/webview-ui/src/styles/chat.css` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/styles/plan-exit.css` (+39, -0)
- `packages/kilo-vscode/webview-ui/src/styles/prompt-input.css` (+48, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+45, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+48, -0)
- `packages/kilo-vscode/webview-ui/src/utils/plan-path.ts` (+43, -0)
- `packages/opencode/CHANGELOG.md` (+29, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+1, -1)
- `packages/opencode/src/kilocode/enhance-prompt.ts` (+11, -5)
- `packages/opencode/src/kilocode/session/compaction-chunks.ts` (+354, -0)
- `packages/opencode/src/kilocode/session/index.ts` (+46, -0)
- `packages/opencode/src/kilocode/session/llm.ts` (+53, -0)
- `packages/opencode/src/session/compaction.ts` (+57, -16)
- `packages/opencode/src/session/llm.ts` (+22, -1)
- `packages/opencode/src/session/prompt.ts` (+1, -0)
- `packages/opencode/src/session/session.ts` (+6, -5)
- `packages/opencode/test/kilocode/enhance-prompt.test.ts` (+12, -1)
- `packages/opencode/test/kilocode/semantic-search.test.ts` (+2, -3)
- `packages/opencode/test/kilocode/session-compaction-chunks.test.ts` (+582, -0)
- `packages/opencode/test/kilocode/session/platform-attribution.test.ts` (+118, -0)
- `packages/opencode/test/kilocode/session/session.test.ts` (+105, -0)
- `packages/opencode/test/kilocode/tool-registry-indexing.test.ts` (+57, -1)
- `packages/opencode/test/session/session.test.ts` (+0, -185)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+61, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+40, -0)
- `packages/sdk/openapi.json` (+94, -0)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+2, -2)
- `packages/ui/src/components/basic-tool.tsx` (+2, -0)
- `packages/ui/src/context/data.tsx` (+4, -0)
- `script/check-workflows.ts` (+1, -0)
- `script/upstream/package.json` (+1, -1)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### .kilo/agent/upstream-merge.md
```diff
diff --git a/.kilo/agent/upstream-merge.md b/.kilo/agent/upstream-merge.md
index d8aff1fd6..e81c9cea3 100644
--- a/.kilo/agent/upstream-merge.md
+++ b/.kilo/agent/upstream-merge.md
@@ -44,6 +44,12 @@ permission:
 
 Resolve the manual part of an upstream merge.
 
+**Do not load the `kilocode-merge-minimizer` skill.** That skill is for
+authoring new Kilo changes against shared upstream files; during an upstream
+merge it gives the wrong guidance (it nudges toward extracting Kilo logic out
+of conflict regions, which is exactly the opposite of what merge resolution
+needs). Follow the rules in this agent file instead.
+
 The user will provide the upstream version (for example `v1.1.50` or `1.1.50`)
 in their first message. If they don't, infer it from the current branch name,
 from `upstream-merge-report-<version>.md`, or from the newest relevant report
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 32ffc2df5..9f1fd76ff 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.2.52",
+  "version": "7.3.0",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/opencode/src/kilocode/tool/registry.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/registry.ts b/packages/opencode/src/kilocode/tool/registry.ts
index 8db1561d4..503214db5 100644
--- a/packages/opencode/src/kilocode/tool/registry.ts
+++ b/packages/opencode/src/kilocode/tool/registry.ts
@@ -13,6 +13,9 @@ const log = Log.create({ service: "kilocode-tool-registry" })
 type Deps = { agent: Agent.Interface; truncate: Truncate.Interface }
 
 export namespace KiloToolRegistry {
+  const hint =
+    "- When you are doing an open-ended search where you do not know the exact symbol name, use the `semantic_search` tool first to narrow down the search scope, then follow up with `Grep` and/or `Read`"
+
   /** Resolve Kilo-specific tool Infos outside any InstanceState, so their Truncate/Agent deps are
    * satisfied at the outer registry scope instead of leaking into InstanceState's Effect. */
   export function infos() {
@@ -84,4 +87,12 @@ export namespace KiloToolRegistry {
       ...(Flag.KILO_CLIENT === "vscode" && cfg.experimental?.agent_manager_tool === true ? [tools.manager] : []),
     ]
   }
+
+  export function describe(tools: Tool.Def[], extra: { semantic?: Tool.Def }): Tool.Def[] {
+    if (!extra.semantic) return tools
+    return tools.map((tool) => {
+      if (tool.id !== "glob" && tool.id !== "grep") return tool
+      return { ...tool, description: `${tool.description}\n${hint}` }
+    })
+  }
 }
```

#### packages/opencode/src/kilocode/tool/semantic-search.txt
```diff
diff --git a/packages/opencode/src/kilocode/tool/semantic-search.txt b/packages/opencode/src/kilocode/tool/semantic-search.txt
index f4cd41664..b5245c16e 100644
--- a/packages/opencode/src/kilocode/tool/semantic-search.txt
+++ b/packages/opencode/src/kilocode/tool/semantic-search.txt
@@ -1,13 +1,28 @@
-- Find code snippets most relevant to the search query using semantic search.
-- Returns matching content with file paths, line ranges, and relevance scores.
-- Searches based on meaning rather than exact text matches.
-- By default searches entire workspace, with capability to filter by path.
-
-Usage Notes:
-- Use this tool any time you start exploring a new area of the codebase. This tool will help discover all areas of the codebase related to the query, even if they do not match an exact symbol name.
-- Queries MUST be in English (translate if needed).
-- Prefer the Grep tool if you know the exact symbol name to search for and do not need semantic context.
-
-Example Queries:
-- "User login and password hashing"
-- "database connection pooling"
+Find code snippets by semantic meaning and return ranked matches with file paths and line ranges.
+
+## When to use
+
+- Explore an unfamiliar code area before you know exact identifiers
+- Find related implementations of a concept or behavior across the workspace
+- Search by intent such as authentication, caching, or session resume logic
+- Narrow a large codebase before following up with `Read` or `Grep`
+- Limit semantic search to one subdirectory with `path`
+
+## When NOT to use
+
+- Search for an exact symbol or regex pattern — use `Grep`
+- Find files by filename or extension — use `Glob`
+- Read the contents of a known file — use `Read`
+- Explore files outside the current workspace - use `Grep`, `Glob`, and `Read`
+
+## Examples
+
+- "User login and password hashing" → search for auth-related code by meaning
+- "Database connection pooling" → find conceptually similar implementations
+- "Session resume flow" → retrieve snippets involved in restoring session state
+- "Tool approval UI" with `path: "packages/opencode/src"` → combine a natural-language query with `path`
+
+## Constraints
+
+- Write the query in English.
+- Use `path` only for subdirectories inside the current workspace.
```

#### packages/opencode/src/tool/grep.txt
```diff
diff --git a/packages/opencode/src/tool/grep.txt b/packages/opencode/src/tool/grep.txt
index e9d53d057..7cc933291 100644
--- a/packages/opencode/src/tool/grep.txt
+++ b/packages/opencode/src/tool/grep.txt
@@ -5,5 +5,4 @@
 - Returns file paths and line numbers with at least one match sorted by modification time
 - Use this tool when you need to find files containing specific patterns
 - If you need to identify/count the number of matches within files, use the Bash tool with `rg` (ripgrep) directly. Do NOT use `grep`.
-- When you are doing an open-ended search where you do not know the exact symbol name, use the SemanticSearch tool instead
 - When you are doing a deep search that may require multiple tool invocations, use the Task tool instead
```


*... and more files (showing first 5)*

## opencode Changes (27ac53a..b5aed28)

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

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from .kilo/agent/upstream-merge.md
- `src/core/` - review core changes from packages/core/package.json
- `src/tool/grep.txt.ts` - update based on kilocode packages/opencode/src/tool/grep.txt changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/kilocode/tool/registry.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
- `src/tool/semantic-search.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/semantic-search.txt changes
- `src/tool/warpgrep.ts` - update based on kilocode packages/opencode/src/tool/warpgrep.ts changes
