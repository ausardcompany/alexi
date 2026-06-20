# Upstream Changes Report
Generated: 2026-06-16 11:12:14

## Summary
- kilocode: 150 commits, 365 files changed
- opencode: 2 commits, 1 files changed

## kilocode Changes (2ddf6f635..ca8515ade)

### Commits

- ca8515ade - Merge pull request #11289 from Kilo-Org/mark/disable-issue-triage (Mark IJbema, 2026-06-16)
- 33e26a1e7 - Merge pull request #11297 from Kilo-Org/lime-supermarket (Marius, 2026-06-16)
- 45d1b63b8 - fix(vscode): comply with Agent Manager CSS prefix guard (marius-kilocode, 2026-06-16)
- 06da36359 - fix(vscode): remove diff viewer corner artifacts (marius-kilocode, 2026-06-16)
- f09ae3103 - Merge pull request #11239 from Kilo-Org/feature/custom-provider-reasoning-options (Christiaan Arnoldus, 2026-06-16)
- cae7cd9d0 - Merge pull request #11291 from Kilo-Org/mark/fix-atomic-chat-plugin-loading (Mark IJbema, 2026-06-16)
- 07097d802 - Merge branch 'main' into mark/disable-issue-triage (Mark IJbema, 2026-06-16)
- eb62097e6 - Merge pull request #11236 from kapelame/feat/minimax-m3-thinking-toggle (Christiaan Arnoldus, 2026-06-16)
- 829466d99 - Merge pull request #11292 from Kilo-Org/mark/stabilize-jetbrains-session-timeout-tests (Mark IJbema, 2026-06-16)
- dd441e78e - fix(cli): keep bundled plugin initialization silent (markijbema, 2026-06-16)
- 6e019c438 - Merge pull request #11290 from Kilo-Org/docs/mistral-ai-byok-label (Christiaan Arnoldus, 2026-06-16)
- 36998d26b - test(jetbrains): make session timeout tests deterministic (markijbema, 2026-06-16)
- 3416b9222 - Merge pull request #10824 from Kilo-Org/docs/session-renaming (Marius, 2026-06-16)
- e1c5a55a5 - Merge pull request #11242 from Kilo-Org/confirm-11208-indexing-api-key (Marius, 2026-06-16)
- 22d0c1e81 - docs(kilo-docs): clarify snapshots without Git (#11233) (Marius, 2026-06-16)
- 5561d90bd - Merge pull request #11113 from Kilo-Org/fix/local-prompt-elapsed (Marius, 2026-06-16)
- 5fc77819a - Merge pull request #11241 from Kilo-Org/stone-mind (Marius, 2026-06-16)
- ca237c425 - Merge pull request #11257 from Kilo-Org/mark/opencode-changeset-script (Mark IJbema, 2026-06-16)
- 01359fc52 - ci: disable upstream issue maintenance workflows (Mark Bema, 2026-06-16)
- 4436139fa - fix(cli): load Atomic Chat as bundled plugin (markijbema, 2026-06-16)
- f6fe95d52 - ci: restore disabled triage workflow from upstream (Mark Bema, 2026-06-16)
- d8b033d09 - docs(kilo-docs): clarify Mistral AI BYOK label (chrarnoldus, 2026-06-16)
- a49bcb7ed - ci: disable automatic issue triage (Mark Bema, 2026-06-16)
- af7228e84 - fix binary name (Mark IJbema, 2026-06-16)
- 05b59ba0f - fix: validate upstream changeset range start (Mark IJbema, 2026-06-16)
- b4f9904f1 - fix: require named opencode changeset versions (Mark IJbema, 2026-06-16)
- 01c25930f - fix: harden upstream changeset generation (Mark IJbema, 2026-06-16)
- a67d57b97 - fix: strip all options except --from/--to (Mark IJbema, 2026-06-16)
- cdb30bf14 - fix: always overwrite generated changesets (Mark IJbema, 2026-06-16)
- edd3fad1d - fix: flatten upstream changeset notes (Mark IJbema, 2026-06-16)
- caae74d51 - Merge pull request #11279 from Kilo-Org/catrielmuller/kilo-console-persist (Catriel Müller, 2026-06-16)
- e17cab995 - fix: kilo markers (Catriel Müller, 2026-06-16)
- 17ed51d9b - Merge pull request #11278 from Kilo-Org/towering-talk (Kirill Kalishev, 2026-06-15)
- 339513190 - fix: fix tests (Catriel Müller, 2026-06-16)
- fbdcc75d3 - refactor: fix kilo markers (Catriel Müller, 2026-06-15)
- 3ba0de1fc - refactor: regenerate sdk (Catriel Müller, 2026-06-15)
- 0c0b95fac - fix: fix tests (Catriel Müller, 2026-06-15)
- 04d25fdf6 - fix(cli): prevent unsafe console worktree actions (Catriel Müller, 2026-06-15)
- e91eef2b3 - fix: session list on tui (Catriel Müller, 2026-06-15)
- 8c1cdf53a - fix: kilo console sidebar size (Catriel Müller, 2026-06-15)
- 2f69c132b - refactor: hot reload kilo console configs (Catriel Müller, 2026-06-15)
- f82828a02 - Merge pull request #11270 from Kilo-Org/warp-shell (Catriel Müller, 2026-06-15)
- 76b493032 - test(jetbrains): stabilize side panel timeout tests (kirillk, 2026-06-15)
- 371d0f039 - fix: fix jb test (Catriel Müller, 2026-06-15)
- dfd34405d - fix(jetbrains): suppress intentional stderr cleanup warning (kirillk, 2026-06-15)
- 0675b201b - refactor: fix markers (Catriel Müller, 2026-06-15)
- 62e42c1ef - fix(jetbrains): clean up restartless unload (kirillk, 2026-06-15)
- 8b5261d2f - fix: test (Catriel Müller, 2026-06-15)
- 79e4af75f - test(cli): stabilize Windows session tests (Catriel Müller, 2026-06-15)
- d13e4ff79 - Merge pull request #11275 from Kilo-Org/lean-sidecar (Kirill Kalishev, 2026-06-15)
- aa6cd198f - test(jetbrains): cover prompt enhance telemetry (kirillk, 2026-06-15)
- 0aae6277a - fix(jetbrains): hide prompt soft wrap glyphs (kirillk, 2026-06-15)
- ccd9890c4 - Merge pull request #11271 from Kilo-Org/jetbrains/release/v7.0.1-rc.9 (Kirill Kalishev, 2026-06-15)
- 3c319a59a - fix(jetbrains): cap prompt input growth (kirillk, 2026-06-15)
- 5f99f9be0 - docs(jetbrains): edit changelog for v7.0.1-rc.9 (Kirill Kalishev, 2026-06-15)
- b107604a7 - release(jetbrains): v7.0.1-rc.9 (kilo-maintainer[bot], 2026-06-15)
- 8baf3e313 - fix(ci): skip watch-opencode-releases on forks (#11269) (V Keerthi Vikram, 2026-06-15)
- c5d39d090 - fix(cli): rebrand opencode leftovers (Catriel Müller, 2026-06-15)
- cb9b29c3b - Merge pull request #11095 from Kilo-Org/truthful-allspice (Kirill Kalishev, 2026-06-15)
- c7c95885a - Merge pull request #11264 from Kilo-Org/wind-wind (Catriel Müller, 2026-06-15)
- 0b8c7228c - Merge remote-tracking branch 'origin/main' into truthful-allspice (kirillk, 2026-06-15)
- 046b03a19 - fix(cli): prefix generated plan filenames with timestamp (#11245) (Johnny Eric Amancio, 2026-06-15)
- 425ced429 - fix: omit SDK from upstream changesets (Mark IJbema, 2026-06-15)
- 681b8090f - fix(jetbrains): consolidate shell terminal parsing (kirillk, 2026-06-15)
- f42789d0e - chore: add bundled opencode changeset (Mark IJbema, 2026-06-15)
- 312c3ab01 - chore(cli): annotate Kilo upgrade switch (Catriel Müller, 2026-06-15)
- f78e54c81 - fix(cli): use Kilo packages for upgrades (Catriel Müller, 2026-06-15)
- b498488c4 - fix: bundle upstream release changesets (Mark IJbema, 2026-06-15)
- de0c3eb15 - Merge pull request #11171 from Kilo-Org/fix/tui-news-read-state (Catriel Müller, 2026-06-15)
- f5440b7c7 - fix: filter upstream changeset notes (Mark IJbema, 2026-06-15)
- 24083eb82 - Merge branch 'main' into feat/minimax-m3-thinking-toggle (Christiaan Arnoldus, 2026-06-15)
- 533323f6c - Merge pull request #11077 from Kilo-Org/balanced-backpack (Kirill Kalishev, 2026-06-15)
- 83c7b0825 - Merge branch 'main' into feature/custom-provider-reasoning-options (Christiaan Arnoldus, 2026-06-15)
- 105d3be8a - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-06-15)
- 7ef41f5a9 - chore: move opencode changesets into upstream scripts (Mark IJbema, 2026-06-15)
- 38459184f - feat(cli): align native plan with architect (#11170) (Johnny Eric Amancio, 2026-06-15)
- 884c54f4f - Merge pull request #11098 from Kilo-Org/feat/vscode-attention-notifications (Marius, 2026-06-15)
- d880a536b - fix: annotate opencode changeset script (Mark IJbema, 2026-06-15)
- d3c0c03f3 - feat: add opencode changeset generator (Mark IJbema, 2026-06-15)
- 04ad8d760 - feat(vscode): add global sound selection (marius-kilocode, 2026-06-15)
- 535da3316 - Merge branch 'main' into feature/custom-provider-reasoning-options (Christiaan Arnoldus, 2026-06-15)
- c9ffc0b7d - Merge pull request #11249 from Kilo-Org/indecisive-uranium (Marius, 2026-06-15)
- 2c30dc75c - fix: format provider rate limit errors (marius-kilocode, 2026-06-15)
- a4b967662 - refactor(vscode): align sounds with opencode attention (marius-kilocode, 2026-06-15)
- d22d77300 - style(vscode): format custom provider settings (chrarnoldus, 2026-06-15)
- c4bcdc504 - Merge branch 'main' into feat/minimax-m3-thinking-toggle (kape, 2026-06-15)
- 8f6a72289 - refactor(vscode): extract provider form initialization (chrarnoldus, 2026-06-15)
- 239369a8e - refactor(vscode): simplify custom provider dialog (chrarnoldus, 2026-06-15)
- a10caf919 - fix(vscode): complete custom provider translations (chrarnoldus, 2026-06-15)
- a65f780fd - feat(vscode): configure provider output effort (chrarnoldus, 2026-06-15)
- f97b6bc1b - Merge remote-tracking branch 'origin/main' into feature/custom-provider-reasoning-options (chrarnoldus, 2026-06-15)
- 5e3d3dd25 - Merge branch 'main' into feat/minimax-m3-thinking-toggle (Christiaan Arnoldus, 2026-06-15)
- 44f144c8f - Apply suggestions from code review (Christiaan Arnoldus, 2026-06-15)
- 87a7e80f6 - fix: harden keyless indexing handling (marius-kilocode, 2026-06-15)
- 9211000aa - fix: support unauthenticated indexing endpoints (marius-kilocode, 2026-06-15)
- 048aebf1b - feat(agent-manager): track feature button usage (marius-kilocode, 2026-06-15)
- 3ffb1ad64 - fix(vscode): avoid variant tuple inference (chrarnoldus, 2026-06-15)
- ef3ad342f - feat(vscode): select custom provider API (chrarnoldus, 2026-06-15)
- a5b87fafa - feat(vscode): support custom reasoning options (chrarnoldus, 2026-06-15)
- 1511d13b3 - chore: add changeset for MiniMax M-series reasoning toggle (kapelame, 2026-06-15)
- c6ead9137 - feat(provider): add MiniMax M-series reasoning toggle (kapelame, 2026-06-15)
- a2185f233 - fix(jetbrains): align session transcript padding (kirillk, 2026-06-14)
- 1f44036e6 - fix(jetbrains): address prompt attachment review (kirillk, 2026-06-14)
- 9d0036943 - refactor(jetbrains): share CLI tool tag parsing (kirillk, 2026-06-14)
- 90ceadd70 - fix(jetbrains): retain streamed terminal blocks (kirillk, 2026-06-14)
- 389ad42a7 - fix(jetbrains): address attachment review feedback (kirillk, 2026-06-14)
- 9eddaf171 - fix(jetbrains): highlight shell tool commands (kirillk, 2026-06-14)
- 89e44f92a - Merge remote-tracking branch 'origin/main' into truthful-allspice (kirillk, 2026-06-14)
- 97041973c - fix(jetbrains): address attachment review fixes (kirillk, 2026-06-14)
- 7df78e8cf - fix(jetbrains): resolve prompt panel merge fallout (kirillk, 2026-06-13)
- e9517784f - Merge remote-tracking branch 'origin/balanced-backpack' into balanced-backpack (kirillk, 2026-06-13)
- 19842bc1a - Merge remote-tracking branch 'origin/main' into balanced-backpack (kirillk, 2026-06-13)
- 38a40836d - fix(jetbrains): open attachments through frontend vfs (kirillk, 2026-06-13)
- 683c32b74 - Merge remote-tracking branch 'origin/balanced-backpack' into balanced-backpack (kirillk, 2026-06-13)
- 551b9e20b - Merge remote-tracking branch 'origin/main' into balanced-backpack (kirillk, 2026-06-13)
- 4aa2d429f - fix(jetbrains): polish shell output layout (kirillk, 2026-06-12)
- 98a14c332 - fix(jetbrains): open attachments as physical kilo files (kirillk, 2026-06-12)
- f651e0819 - fix(jetbrains): align code block gap with session views (kirillk, 2026-06-12)
- c4aac528e - fix(jetbrains): balance markdown code padding (kirillk, 2026-06-12)
- bde3d6c14 - fix(jetbrains): restore markdown code block defaults (kirillk, 2026-06-12)
- 04ebc7413 - fix(cli): persist read TUI news (Catriel Müller, 2026-06-12)
- 370ddce5a - fix(jetbrains): refine tool header spacing (kirillk, 2026-06-12)
- a73ee5329 - feat(jetbrains): render shell output as markdown (kirillk, 2026-06-12)
- 5ebd5fea9 - refactor(vscode): focus notifications on sounds (marius-kilocode, 2026-06-12)
- 709a53cda - fix(jetbrains): keep kilo vfs editor state backend-owned (kirillk, 2026-06-11)
- 505805016 - fix(jetbrains): polish session markdown styling (kirillk, 2026-06-11)
- abacee309 - fix(jetbrains): adjust session inner padding (kirillk, 2026-06-11)
- c47cb365c - fix(jetbrains): simplify prompt input chrome (kirillk, 2026-06-11)
- e06aa64d8 - fix(jetbrains): polish session header spacing (kirillk, 2026-06-11)
- 517777da6 - Merge remote-tracking branch 'origin/main' into balanced-backpack (kirillk, 2026-06-11)
- a4b58411b - Merge remote-tracking branch 'origin/main' into truthful-allspice (kirillk, 2026-06-11)
- 5935fce9d - fix(vscode): count pending submission time (marius-kilocode, 2026-06-11)
- d80c99b4e - fix(vscode): make notifications explicit opt-ins (marius-kilocode, 2026-06-11)
- 916206774 - fix(vscode): suppress focused session sounds (marius-kilocode, 2026-06-11)
- b0ec91cef - feat(vscode): add attention notifications (marius-kilocode, 2026-06-11)
- bb31723e7 - fix(jetbrains): polish session header controls (kirillk, 2026-06-10)
- 7749efdbf - fix(jetbrains): order editor disposal fallback (kirillk, 2026-06-10)
- 3dc1ac5f5 - fix(jetbrains): stabilize Kilo VFS keys (kirillk, 2026-06-10)
- 71484fb6c - Merge remote-tracking branch 'origin/main' into balanced-backpack (kirillk, 2026-06-10)
- 2f9c6ecdd - feat(jetbrains): open embedded attachments in editor tabs (kirillk, 2026-06-10)
- 22310e1db - Merge branch 'glaze-fireplace' into balanced-backpack (kirillk, 2026-06-09)
- 9f8f698e3 - fix(jetbrains): refine prompt attachment rendering (kirillk, 2026-06-09)
- 52dfa5453 - fix(jetbrains): sanitize read payloads in parser (kirillk, 2026-06-09)
- 49339a258 - feat(jetbrains): support pasting prompt attachments (kirillk, 2026-06-09)
- b85ce6df6 - fix(jetbrains): refine drop overlay icon spacing (kirillk, 2026-06-09)
- 793cf934b - feat(jetbrains): add session file drop overlay (kirillk, 2026-06-08)
- 7481b6f8c - feat(jetbrains): refine attachment preview cards (kirillk, 2026-06-08)
- a8b127e0c - feat(jetbrains): support prompt file attachments (kirillk, 2026-06-08)
- df39c2cc1 - feat(jetbrains): add editor tab VFS infrastructure (kirillk, 2026-06-08)
- 6abcc0d07 - docs(kilo-docs): document inline session renaming (marius-kilocode, 2026-06-02)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt` (+304, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt` (+6, -13)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/tool/KiloCliParserTest.kt` (+27, -0)
- `packages/opencode/src/tool/shell.ts` (+2, -1)
- `packages/opencode/src/tool/warpgrep.ts` (+2, -1)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/kilocode/agent/index.ts` (+1, -0)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
(no changes)

#### Other Changes
- `.changeset/allow-keyless-indexing.md` (+7, -0)
- `.changeset/calm-models-reason.md` (+5, -0)
- `.changeset/clear-rate-limit-errors.md` (+6, -0)
- `.changeset/close-read-tui-news.md` (+5, -0)
- `.changeset/fix-diff-viewer-corners.md` (+5, -0)
- `.changeset/fix-kilo-npm-upgrade.md` (+5, -0)
- `.changeset/fix-session-scope-toggle.md` (+5, -0)
- `.changeset/highlight-jetbrains-shell-commands.md` (+5, -0)
- `.changeset/improve-jetbrains-markdown.md` (+5, -0)
- `.changeset/jetbrains-hide-read-payloads.md` (+5, -0)
- `.changeset/jetbrains-horizontal-attachments.md` (+5, -0)
- `.changeset/jetbrains-paste-attachments.md` (+5, -0)
- `.changeset/jetbrains-prompt-attachment-preview.md` (+5, -0)
- `.changeset/jetbrains-prompt-attachments.md` (+5, -0)
- `.changeset/jetbrains-prompt-input-height.md` (+5, -0)
- `.changeset/jetbrains-restartless-unload.md` (+5, -0)
- `.changeset/jetbrains-session-drop-overlay.md` (+5, -0)
- `.changeset/jetbrains-session-icons.md` (+5, -0)
- `.changeset/jetbrains-vfs-frontend-handoff.md` (+5, -0)
- `.changeset/kilo-branding-leftovers.md` (+5, -0)
- `.changeset/list-agent-manager-worktrees.md` (+5, -0)
- `.changeset/load-bundled-atomic-chat.md` (+5, -0)
- `.changeset/minimax-m3-reasoning-toggle.md` (+6, -0)
- `.changeset/native-plan-architect-parity.md` (+5, -0)
- `.changeset/notify-background-sessions.md` (+5, -0)
- `.changeset/opencode-v1-14-51-to-v1-15-4.md` (+33, -0)
- `.changeset/plan-timestamp-prefix.md` (+5, -0)
- `.changeset/preserve-console-review-expansion.md` (+5, -0)
- `.changeset/preserve-console-terminals.md` (+5, -0)
- `.changeset/render-jetbrains-attachment-cards.md` (+5, -0)
- `.changeset/render-jetbrains-shell-markdown.md` (+5, -0)
- `.changeset/silent-comet-attachments.md` (+5, -0)
- `.github/workflows/close-stale-prs.yml` (+0, -236)
- `.github/workflows/{close-issues.yml => disabled/close-issues.yml.disabled}` (+1, -2)
- `.github/workflows/{duplicate-issues.yml => disabled/duplicate-issues.yml.disabled}` (+11, -19)
- `.github/workflows/{triage.yml => disabled/triage.yml.disabled}` (+5, -7)
- `.github/workflows/watch-opencode-releases.yml` (+1, -1)
- `.kilo/plans/jetbrains-mdview-editor-theme-colors.md` (+67, -0)
- `.kilo/plans/jetbrains-mdview-vscode-styling.md` (+69, -0)
- `.kilo/plans/jetbrains-session-ui-icons-header.md` (+63, -0)
- `bun.lock` (+1, -0)
- `flake.nix` (+5, -2)
- `nix/hashes.json` (+4, -4)
- `packages/kilo-console/src/client.ts` (+3, -2)
- `packages/kilo-console/src/routes/projects/ProjectConsoleRoute.tsx` (+36, -19)
- `packages/kilo-docs/pages/automate/agent-manager.md` (+7, -1)
- `packages/kilo-docs/pages/code-with-ai/agents/chat-interface.md` (+6, -0)
- `packages/kilo-docs/pages/code-with-ai/features/checkpoints.md` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli-reference.md` (+1, -1)
- `packages/kilo-docs/pages/customize/context/codebase-indexing.md` (+2, -2)
- `packages/kilo-docs/pages/getting-started/using-kilo-for-free.md` (+1, -1)
- `packages/kilo-docs/source-links.md` (+12, -14)
- `packages/kilo-indexing/src/indexing/config-manager.ts` (+5, -7)
- `packages/kilo-indexing/src/indexing/embedders/openai-compatible.ts` (+25, -21)
- `packages/kilo-indexing/src/indexing/interfaces/config.ts` (+1, -1)
- `packages/kilo-indexing/src/indexing/service-factory.ts` (+1, -2)
- `packages/kilo-indexing/test/kilocode/indexing/config-manager.test.ts` (+41, -0)
- `packages/kilo-indexing/test/kilocode/indexing/embedders/openai-compatible.test.ts` (+67, -4)
- `packages/kilo-indexing/test/kilocode/indexing/manager.test.ts` (+70, -0)
- `packages/kilo-indexing/test/kilocode/indexing/service-factory.test.ts` (+10, -0)
- `packages/kilo-jetbrains/CHANGELOG.md` (+11, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendAppService.kt` (+13, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendChatManager.kt` (+31, -9)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloBackendCliManager.kt` (+40, -11)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloCliDataParser.kt` (+135, -3)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/plugin/KiloBackendDynamicPluginListener.kt` (+21, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloSessionRpcApiImpl.kt` (+4, -0)
- `packages/kilo-jetbrains/backend/src/main/resources/kilo.jetbrains.backend.xml` (+5, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendAppServiceTest.kt` (+22, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/ChatDtoSerializationTest.kt` (+27, -2)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/ChatLogSummaryTest.kt` (+20, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/KiloCliDataParserTest.kt` (+240, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/FakeCliServer.kt` (+6, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/KiloToolWindowFactory.kt` (+12, -6)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloSessionService.kt` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloWorkspaceService.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/plugin/KiloFrontendDynamicPluginListener.kt` (+51, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+110, -10)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/controller/SessionController.kt` (+21, -12)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/Message.kt` (+7, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/PromptAttachment.kt` (+101, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/SessionModel.kt` (+21, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionDropOverlay.kt` (+91, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/SessionMessageListPanel.kt` (+8, -6)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/attachment/AttachmentCard.kt` (+299, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/attachment/AttachmentEditorKind.kt` (+316, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/attachment/AttachmentOpeners.kt` (+49, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/RotatedIcon.kt` (+0, -27)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/SessionHeaderPanel.kt` (+60, -22)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/model/ModelPicker.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/PromptAttachmentPasteProvider.kt` (+42, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/PromptAttachmentStrip.kt` (+89, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/PromptPanel.kt` (+249, -47)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/style/SessionUiStyle.kt` (+30, -6)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/AttachmentView.kt` (+79, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/MessageView.kt` (+40, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/PlanExitView.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/PromptAttachmentView.kt` (+133, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/ReasoningView.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/SessionViewIcons.kt` (+4, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/TextView.kt` (+2, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/TurnView.kt` (+3, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/ViewFactory.kt` (+9, -13)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/base/AbstractSessionPartView.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/question/QuestionResultView.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/todo/TodoWriteView.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/FilledBadgeIcon.kt` (+3, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/LayeredOverlayPanel.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/MdCommon.kt` (+70, -19)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/MdViewFactory.kt` (+28, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/MdViewHtmlPane.kt` (+0, -344)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/MdViewHybrid.kt` (+4, -940)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/hybrid/MdLanguage.kt` (+78, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/hybrid/MdShellHighlight.kt` (+79, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/hybrid/MdTerminal.kt` (+101, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/hybrid/MdViewHybrid.kt` (+1068, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/vfs/KiloEditorKind.kt` (+13, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/vfs/KiloEditorKindRegistry.kt` (+26, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/vfs/KiloFileEditor.kt` (+28, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/vfs/KiloFileEditorBase.kt` (+34, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/vfs/KiloFileEditorProvider.kt` (+46, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/vfs/KiloPath.kt` (+16, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/vfs/KiloVfsManager.kt` (+40, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/vfs/KiloVirtualFile.kt` (+58, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/vfs/KiloVirtualFileKind.kt` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/vfs/KiloVirtualFileKindRegistry.kt` (+23, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/vfs/KiloVirtualFileSystem.kt` (+89, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/remove-hover.svg` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/remove-hover_dark.svg` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/remove.svg` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/remove_dark.svg` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/kilo.jetbrains.frontend.xml` (+8, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+21, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionScrollTest.kt` (+25, -7)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionSidePanelManagerTest.kt` (+21, -7)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionUiLayoutTest.kt` (+61, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/controller/PromptEnhancerTest.kt` (+12, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/model/SessionModelTest.kt` (+61, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/PromptPanelTest.kt` (+483, -22)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionRootPanelTest.kt` (+74, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionSelectionCopyTest.kt` (+11, -4)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/SessionUiUpdateTest.kt` (+269, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/attachment/AttachmentEditorKindTest.kt` (+262, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/header/SessionHeaderPanelTest.kt` (+46, -9)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/PlanExitViewTest.kt` (+28, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/QuestionResultViewTest.kt` (+31, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ReasoningViewTest.kt` (+21, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/SearchToolViewTest.kt` (+10, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ShellToolViewTest.kt` (+389, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ToolBodyStressTest.kt` (+22, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/ToolViewTest.kt` (+15, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/TurnViewTest.kt` (+13, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/base/AbstractSessionPartViewTest.kt` (+19, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/todo/TodoWriteViewTest.kt` (+18, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeSessionRpcApi.kt` (+26, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/md/MdTerminalTest.kt` (+26, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/md/MdViewFactoryTest.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/md/MdViewHybridTest.kt` (+282, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/md/MdViewLoggingTest.kt` (+9, -5)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/ui/md/MdViewTest.kt` (+81, -0)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/cli/KiloCliParser.kt` (+18, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/log/ChatLogSummary.kt` (+10, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloSessionRpcApi.kt` (+4, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/ChatDto.kt` (+7, -1)
- `packages/kilo-vscode/.vscodeignore` (+3, -0)
- `packages/kilo-vscode/audio-wav/alert-01.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/alert-02.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/alert-03.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/alert-04.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/alert-05.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/alert-06.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/alert-07.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/alert-08.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/alert-09.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/alert-10.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/bip-bop-01.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/bip-bop-02.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/bip-bop-03.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/bip-bop-04.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/bip-bop-05.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/bip-bop-06.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/bip-bop-07.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/bip-bop-08.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/bip-bop-09.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/bip-bop-10.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/nope-01.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/nope-02.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/nope-03.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/nope-04.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/nope-05.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/nope-06.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/nope-07.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/nope-08.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/nope-09.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/nope-10.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/nope-11.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/nope-12.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/staplebops-01.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/staplebops-02.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/staplebops-03.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/staplebops-04.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/staplebops-05.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/staplebops-06.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/staplebops-07.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/yup-01.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/yup-02.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/yup-03.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/yup-04.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/yup-05.wav` (+-, --)
- `packages/kilo-vscode/audio-wav/yup-06.wav` (+-, --)
- `packages/kilo-vscode/package.json` (+52, -34)
- `packages/kilo-vscode/src/KiloProvider.ts` (+8, -11)
- `packages/kilo-vscode/src/extension.ts` (+3, -0)
- `packages/kilo-vscode/src/provider-actions.ts` (+2, -2)
- `packages/kilo-vscode/src/services/attention/index.ts` (+1, -0)
- `packages/kilo-vscode/src/services/attention/service.ts` (+121, -0)
- `packages/kilo-vscode/src/services/attention/sound.ts` (+163, -0)
- `packages/kilo-vscode/src/services/telemetry/types.ts` (+1, -0)
- `packages/kilo-vscode/src/shared/custom-provider.ts` (+29, -15)
- `packages/kilo-vscode/src/shared/provider-model.ts` (+7, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-telemetry.test.ts` (+69, -0)
- `packages/kilo-vscode/tests/unit/attention.test.ts` (+128, -0)
- `packages/kilo-vscode/tests/unit/custom-provider-dialog-validate.test.ts` (+38, -2)
- `packages/kilo-vscode/tests/unit/custom-provider.test.ts` (+65, -6)
- `packages/kilo-vscode/tests/unit/errorUtils.test.ts` (+20, -0)
- `packages/kilo-vscode/tests/unit/working-indicator.test.ts` (+20, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+58, -25)
- `packages/kilo-vscode/webview-ui/agent-manager/DiffPanel.tsx` (+7, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/NewWorktreeDialog.tsx` (+48, -8)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+8, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/telemetry.ts` (+46, -0)
- `packages/kilo-vscode/webview-ui/diff-viewer/FullScreenDiffView.tsx` (+7, -1)
- `packages/kilo-vscode/webview-ui/src/components/settings/CustomProviderDialog.tsx` (+119, -61)
- `packages/kilo-vscode/webview-ui/src/components/settings/CustomProviderModelCard.tsx` (+80, -4)
- `packages/kilo-vscode/webview-ui/src/components/settings/CustomProviderValidation.ts` (+6, -3)
- `packages/kilo-vscode/webview-ui/src/components/settings/IndexingTab.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/components/settings/NotificationsTab.tsx` (+67, -128)
- `packages/kilo-vscode/webview-ui/src/components/settings/ProvidersTab.tsx` (+3, -3)
- `packages/kilo-vscode/webview-ui/src/components/shared/WorkingIndicator.tsx` (+2, -1)
- `packages/kilo-vscode/webview-ui/src/components/shared/working-indicator-utils.ts` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+19, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+20, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+20, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+20, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+20, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+20, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+20, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+20, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+20, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+20, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+20, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+20, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+20, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+20, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+20, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+20, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+20, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+20, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+19, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+19, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+2, -6)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/utils/errorUtils.ts` (+47, -34)
- `packages/opencode/AGENTS.md` (+1, -1)
- `packages/opencode/script/run-workspace-server` (+2, -2)
- `packages/opencode/specs/tui-plugins.md` (+8, -8)
- `packages/opencode/src/auth/index.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/providers.ts` (+3, -9)
- `packages/opencode/src/cli/cmd/tui/attention.ts` (+3, -3)
- `packages/opencode/src/cli/cmd/tui/component/dialog-provider.tsx` (+1, -6)
- `packages/opencode/src/cli/cmd/tui/component/dialog-retry-action.tsx` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/component/dialog-session-list.tsx` (+10, -19)
- `packages/opencode/src/cli/cmd/tui/config/tui-migrate.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/config/tui.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/home/tips-view.tsx` (+7, -7)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/sidebar/footer.tsx` (+6, -6)
- `packages/opencode/src/cli/cmd/tui/routes/session/sidebar.tsx` (+3, -5)
- `packages/opencode/src/cli/cmd/tui/thread.ts` (+8, -3)
- `packages/opencode/src/cli/cmd/tui/ui/dialog-select.tsx` (+28, -7)
- `packages/opencode/src/cli/cmd/uninstall.ts` (+3, -2)
- `packages/opencode/src/cli/cmd/upgrade.ts` (+2, -2)
- `packages/opencode/src/cli/upgrade.ts` (+2, -2)
- `packages/opencode/src/command/template/initialize.txt` (+3, -3)
- `packages/opencode/src/config/config.ts` (+2, -2)
- `packages/opencode/src/control-plane/dev/README.md` (+3, -3)
- `packages/opencode/src/effect/bridge.ts` (+2, -1)
- `packages/opencode/src/installation/index.ts` (+53, -28)
- `packages/opencode/src/kilocode/atomic-chat-feature.ts` (+11, -25)
- `packages/opencode/src/kilocode/cli/cmd/tui/context/tui-config.tsx` (+1, -1)
- `packages/opencode/src/kilocode/components/dialog-indexing.tsx` (+1, -1)
- `packages/opencode/src/kilocode/components/dialog-kilo-notifications.tsx` (+5, -0)
- `packages/opencode/src/kilocode/components/kilo-news.tsx` (+10, -10)
- `packages/opencode/src/kilocode/components/news.ts` (+19, -0)
- `packages/opencode/src/kilocode/config/default-plugins.ts` (+7, -4)
- `packages/opencode/src/kilocode/installation/index.ts` (+26, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/config-console.ts` (+3, -2)
- `packages/opencode/src/kilocode/session/compaction-chunks.ts` (+1, -6)
- `packages/opencode/src/kilocode/session/index.ts` (+19, -1)
- `packages/opencode/src/kilocode/session/native-plan-prompt.txt` (+47, -0)
- `packages/opencode/src/kilocode/session/prompt.ts` (+5, -18)
- `packages/opencode/src/plugin/digitalocean.ts` (+6, -4)
- `packages/opencode/src/plugin/index.ts` (+2, -0)
- `packages/opencode/src/provider/error.ts` (+12, -0)
- `packages/opencode/src/provider/transform.ts` (+10, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/config.ts` (+2, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/experimental.ts` (+10, -5)
- `packages/opencode/src/server/routes/instance/httpapi/groups/global.ts` (+5, -5)
- `packages/opencode/src/server/routes/instance/httpapi/groups/instance.ts` (+5, -6)
- `packages/opencode/src/server/routes/instance/httpapi/groups/project.ts` (+2, -2)
- `packages/opencode/src/server/routes/instance/httpapi/groups/pty.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/session.ts` (+3, -3)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/experimental.ts` (+18, -4)
- `packages/opencode/src/session/compaction.ts` (+4, -2)
- `packages/opencode/src/session/prompt.ts` (+14, -94)
- `packages/opencode/src/session/session.ts` (+1, -0)
- `packages/opencode/src/skill/index.ts` (+0, -18)
- `packages/opencode/src/skill/prompt/customize-opencode.md` (+0, -377)
- `packages/opencode/src/snapshot/index.ts` (+5, -3)
- `packages/opencode/src/storage/db.ts` (+5, -2)
- `packages/opencode/test/cli/cmd/tui/attention.test.ts` (+8, -7)
- `packages/opencode/test/config/config.test.ts` (+7, -1)
- `packages/opencode/test/config/tui.test.ts` (+1, -1)
- `packages/opencode/test/fixture/tui-plugin.ts` (+1, -1)
- `packages/opencode/test/fixture/tui-runtime.ts` (+1, -1)
- `packages/opencode/test/installation/installation.test.ts` (+6, -6)
- `packages/opencode/test/kilocode/agent-permission-overrides.test.ts` (+1, -0)
- `packages/opencode/test/kilocode/builtin-skills.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/cli/cmd/tui/context/tui-config.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/cli/tui/thread.test.ts` (+16, -0)
- `packages/opencode/test/kilocode/config/atomic-chat-default-plugin.test.ts` (+84, -9)
- `packages/opencode/test/kilocode/installation/upgrade.test.ts` (+221, -0)
- `packages/opencode/test/kilocode/news.test.ts` (+32, -0)
- `packages/opencode/test/kilocode/plan-exit-detection.test.ts` (+65, -10)
- `packages/opencode/test/kilocode/provider/error.test.ts` (+45, -0)
- `packages/opencode/test/kilocode/server/config-overlay.test.ts` (+31, -0)
- `packages/opencode/test/kilocode/server/worktree-list.test.ts` (+68, -0)
- `packages/opencode/test/kilocode/storage/db.test.ts` (+26, -0)
- `packages/opencode/test/provider/transform.test.ts` (+28, -6)
- `packages/opencode/test/server/experimental-session-list.test.ts` (+108, -0)
- `packages/opencode/test/server/httpapi-config.test.ts` (+2, -1)
- `packages/opencode/test/server/httpapi-event.test.ts` (+1, -2)
- `packages/opencode/test/server/httpapi-experimental.test.ts` (+1, -1)
- `packages/opencode/test/server/httpapi-sdk.test.ts` (+19, -7)
- `packages/opencode/test/session/compaction.test.ts` (+30, -7)
- `packages/opencode/test/session/prompt.test.ts` (+2, -2)
- `packages/opencode/test/share/share-next.test.ts` (+34, -6)
- `packages/opencode/test/storage/db.test.ts` (+1, -1)
- `packages/plugin-atomic-chat/src/plugin/index.ts` (+0, -2)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+3, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+8, -2)
- `packages/sdk/openapi.json` (+407, -385)
- `packages/ui/src/components/markdown.tsx` (+2, -1)
- `packages/ui/src/components/provider-icons/sprite.svg` (+5, -7)
- `packages/ui/src/components/provider-icons/types.ts` (+1, -1)
- `script/check-workflows.ts` (+0, -4)
- `script/upstream/README.md` (+11, -0)
- `script/upstream/opencode-changesets.test.ts` (+168, -0)
- `script/upstream/opencode-changesets.ts` (+276, -0)

### Key Diffs

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt
new file mode 100644
index 000000000..7200420d4
--- /dev/null
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt
@@ -0,0 +1,304 @@
+package ai.kilocode.client.session.views.tool
+
+import ai.kilocode.client.plugin.KiloBundle
+import ai.kilocode.client.session.model.Content
+import ai.kilocode.client.session.model.Tool
+import ai.kilocode.client.session.ui.selection.SessionSelection
+import ai.kilocode.client.session.ui.style.SessionEditorStyle
+import ai.kilocode.client.session.ui.style.SessionUiStyle
+import ai.kilocode.client.session.views.base.SecondarySessionPartView
+import ai.kilocode.client.ui.UiStyle
+import ai.kilocode.client.ui.md.MdCodeBlockBorder
+import ai.kilocode.client.ui.md.MdCodeBlockFactory
+import ai.kilocode.client.ui.md.MdCodeBlockOptions
+import ai.kilocode.client.ui.md.MdViewFactory
+import ai.kilocode.client.ui.md.hybrid.MdTerminal
+import com.intellij.openapi.Disposable
+import com.intellij.openapi.util.Disposer
+import com.intellij.ui.EditorTextField
+import com.intellij.ui.components.JBHtmlPane
+import com.intellij.ui.components.JBScrollPane
+import com.intellij.util.concurrency.annotations.RequiresEdt
+import com.intellij.util.ui.JBUI
+import java.awt.Dimension
+import javax.swing.JPanel
+import javax.swing.ScrollPaneConstants
+
+class ShellToolView(
+    tool: Tool,
+    selection: SessionSelection? = null,
+    private val parts: ToolParts = toolParts(tool),
+    private val holder: ShellHolder = ShellHolder(tool, selection),
+) : SecondarySessionPartView(parts.header, { holder.body().panel }) {
+
+    override val contentId: String = tool.id
+
+    private var item = tool
+    private var style = SessionEditorStyle.current()
+
+    init {
+        holder.parent = this
+        bindHeader(parts.glyph, parts.title, parts.sub, parts.state, parts.center, parts.controls, parts.slot)
+        applyStyle(style)
+        sync()
+    }
```

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt
index 81744bfb9..0dd50b893 100644
--- a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt
@@ -14,6 +14,7 @@ import ai.kilocode.client.ui.layout.HAlign
 import ai.kilocode.client.ui.layout.Stack
 import ai.kilocode.client.ui.layout.VAlign
 import ai.kilocode.client.ui.layout.align
+import ai.kilocode.cli.KiloCliParser
 import ai.kilocode.log.KiloLog
 import com.intellij.openapi.Disposable
 import com.intellij.openapi.editor.EditorFactory
@@ -209,10 +210,10 @@ class ToolBody private constructor(
             val disposable = Disposer.newDisposable("Tool body")
             val body = runCatching {
                 val field = ToolField(preview(tool), SessionEditorStyle.current()).also { ed ->
-                    ed.setDisposedWith(disposable)
                     Disposer.register(disposable) {
                         ed.getEditor(false)?.let(EditorFactory.getInstance()::releaseEditor)
                     }
+                    ed.setDisposedWith(disposable)
                 }
                 ToolBody(null, field, pane(field, true), disposable)
             }.getOrElse { err ->
@@ -328,7 +329,7 @@ internal fun toolParts(
         add(link, LINK_CARD)
     }
     val state = JBLabel().apply { foreground = UiStyle.Colors.weak() }
-    val center = JPanel(BorderLayout(JBUI.scale(SessionUiStyle.View.Layout.GAP), 0)).apply { isOpaque = false }
+    val center = JPanel(BorderLayout(UiStyle.Gap.md(), 0)).apply { isOpaque = false }
     val controls = Stack.horizontal()
     val header = JPanel(BorderLayout(JBUI.scale(SessionUiStyle.View.Layout.GAP), 0)).apply {
         isOpaque = false
@@ -364,7 +365,7 @@ internal fun searchParts(count: Int): ToolParts {
     val state = JBLabel().apply { foreground = UiStyle.Colors.weak() }
     val stack = Stack.fitHorizontal(UiStyle.Gap.md()).apply { targets.forEach { next(it) } }
     val target = stack.align(HAlign.TRACK, VAlign.CENTER)
-    val center = JPanel(BorderLayout(JBUI.scale(SessionUiStyle.View.Layout.GAP), 0)).apply {
+    val center = JPanel(BorderLayout(UiStyle.Gap.md(), 0)).apply {
         isOpaque = false
         minimumSize = JBUI.size(0, minimumSize.height)
         add(title, BorderLayout.WEST)
@@ -539,19 +540,11 @@ internal data class Target(
 internal fun target(tool: Tool): Target? {
     val out = output(tool)
     if (out.isBlank()) return null
-    val path = tag(out, "path") ?: return null
-    val type = tag(out, "type") ?: return null
+    val path = KiloCliParser.tag(out, "path") ?: return null
+    val type = KiloCliParser.tag(out, "type") ?: return null
```

#### packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/tool/KiloCliParserTest.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/tool/KiloCliParserTest.kt b/packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/tool/KiloCliParserTest.kt
new file mode 100644
index 000000000..43df4520a
--- /dev/null
+++ b/packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/tool/KiloCliParserTest.kt
@@ -0,0 +1,27 @@
+package ai.kilocode.client.session.views.tool
+
+import ai.kilocode.cli.KiloCliParser
+import kotlin.test.Test
+import kotlin.test.assertEquals
+import kotlin.test.assertNull
+
+class KiloCliParserTest {
+    @Test
+    fun `tag extracts trimmed tool xml value`() {
+        val text = """
+            <path>
+              /tmp/example.txt
+            </path>
+            <type>file</type>
+        """.trimIndent()
+
+        assertEquals("/tmp/example.txt", KiloCliParser.tag(text, "path"))
+        assertEquals("file", KiloCliParser.tag(text, "type"))
+    }
+
+    @Test
+    fun `tag returns null for blank or missing value`() {
+        assertNull(KiloCliParser.tag("<path>   </path>", "path"))
+        assertNull(KiloCliParser.tag("<type>file</type>", "path"))
+    }
+}
```

#### packages/opencode/src/kilocode/agent/index.ts
```diff
diff --git a/packages/opencode/src/kilocode/agent/index.ts b/packages/opencode/src/kilocode/agent/index.ts
index 6dd914f4b..a178c45f3 100644
--- a/packages/opencode/src/kilocode/agent/index.ts
+++ b/packages/opencode/src/kilocode/agent/index.ts
@@ -169,6 +169,7 @@ function planEditRules(worktree: string) {
   return {
     "*": "deny" as const,
     [path.join(".kilo", "plans", "*.md")]: "allow" as const,
+    [path.join("plans", "*.md")]: "allow" as const,
     [path.join(".plans", "*.md")]: "allow" as const,
     [path.join(".opencode", "plans", "*.md")]: "allow" as const,
     [path.relative(worktree, path.join(Global.Path.data, path.join("plans", "*.md")))]: "allow" as const,
```

#### packages/opencode/src/tool/shell.ts
```diff
diff --git a/packages/opencode/src/tool/shell.ts b/packages/opencode/src/tool/shell.ts
index efa2adc29..55d9a7bc1 100644
--- a/packages/opencode/src/tool/shell.ts
+++ b/packages/opencode/src/tool/shell.ts
@@ -312,7 +312,8 @@ const ask = Effect.fn("ShellTool.ask")(function* (
 
 function cmd(shell: string, command: string, cwd: string, env: NodeJS.ProcessEnv) {
   if (process.platform === "win32" && Shell.ps(shell)) {
-    return ChildProcess.make(shell, Shell.args(shell, command, cwd), { // kilocode_change - encoded PowerShell args
+    return ChildProcess.make(shell, Shell.args(shell, command, cwd), {
+      // kilocode_change - encoded PowerShell args
       cwd,
       env,
       stdin: "ignore",
```


*... and more files (showing first 5)*

## opencode Changes (5d0f866..3a2ff11)

### Commits

- 3a2ff11 - Revert "fix(mcp): type tool error content" (adamelmore, 2026-06-16)
- a98d573 - fix(mcp): enable progress timeout resets (#32477) (RAMA, 2026-06-16)

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
- `packages/opencode/src/mcp/catalog.ts` (+9, -17)

### Key Diffs

(no key diffs to show)

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/kilocode/agent/index.ts
- `src/tool/KiloCliParserTest.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/tool/KiloCliParserTest.kt changes
- `src/tool/ShellToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ShellToolView.kt changes
- `src/tool/ToolSupport.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt changes
- `src/tool/shell.ts` - update based on kilocode packages/opencode/src/tool/shell.ts changes
- `src/tool/warpgrep.ts` - update based on kilocode packages/opencode/src/tool/warpgrep.ts changes
