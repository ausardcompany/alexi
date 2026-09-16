# Upstream Changes Report
Generated: 2026-09-16 10:58:01

## Summary
- kilocode: 164 commits, 435 files changed
- opencode: 0 commits, 0 files changed

## kilocode Changes (9597be3a1..c23548f4f)

### Commits

- c23548f4f - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-09-16)
- 08ee0760c - Merge pull request #14205 from Kilo-Org/increase-vscode-paste-summary-limit (Marius, 2026-09-16)
- 5e82daaba - Merge pull request #14206 from Kilo-Org/optimize-worktree-deletion-speed (Marius, 2026-09-16)
- f616aefe1 - Merge pull request #14204 from Kilo-Org/implement-dotlottie-animations-kilo-logo (Marius, 2026-09-16)
- 804001a50 - fix(vscode): gate the animated logo crossfade on player readiness (marius-kilocode, 2026-09-16)
- c6419e727 - Merge pull request #14203 from Kilo-Org/fix-answer-flicker (Marius, 2026-09-16)
- 634d1a777 - fix(agent-manager): make worktree deletion near-instant and reliable (marius-kilocode, 2026-09-16)
- 42dddd0ae - fix(jetbrains): match VS Code paste collapse thresholds (marius-kilocode, 2026-09-16)
- d202c80ea - feat(vscode): animate the Kilo logo on hover (marius-kilocode, 2026-09-16)
- e1c9ee3eb - fix: address review on the flicker changes (marius-kilocode, 2026-09-16)
- 7c23966c0 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-16)
- 96b2b16ae - fix: reduce chat transcript flicker while a turn streams (marius-kilocode, 2026-09-16)
- b3adda215 - Merge pull request #14199 from Kilo-Org/sync-inline-diff-viewer-features (Marius, 2026-09-16)
- 11780f5b2 - Merge pull request #14049 from Kilo-Org/investigate-browser-automation-tool-exposure (Marius, 2026-09-16)
- e8876033c - Merge pull request #14202 from Kilo-Org/fix-getting-started-broken-link (Marius, 2026-09-16)
- f09621fb3 - Merge pull request #14200 from Kilo-Org/bolder-order (Marius, 2026-09-16)
- fc08e31b9 - Merge pull request #14179 from Kilo-Org/optimize-extension-performance (Marius, 2026-09-16)
- f6ca661df - Merge pull request #14201 from Kilo-Org/handsomely-hamburger (Marius, 2026-09-16)
- e67440c60 - Merge remote-tracking branch 'origin/main' into bolder-order (marius-kilocode, 2026-09-16)
- b655ec420 - chore(vscode): format prompt undo spec (marius-kilocode, 2026-09-16)
- 6693c6625 - test(vscode): cover undoKey in prompt input utils unit tests (marius-kilocode, 2026-09-16)
- 25afa868f - test(vscode): align prompt undo specs with local undo handling (marius-kilocode, 2026-09-16)
- 03b99d330 - fix(ui): share diff size limits and cover eager rendering (marius-kilocode, 2026-09-16)
- 410e9fe86 - docs(kilo-docs): fix dead agentic engineering link (marius-kilocode, 2026-09-16)
- 78a4d932a - fix(vscode): restore undo and redo in the chat input (marius-kilocode, 2026-09-16)
- 5bf040ea6 - fix: load leading-slash skill paths and group skills in the slash menu (marius-kilocode, 2026-09-16)
- 98918cd69 - fix(ui): match inline chat diffs to the diff viewer (marius-kilocode, 2026-09-16)
- 50330a430 - Merge pull request #14170 from Kilo-Org/feat/vscode-paste-collapse (Marius, 2026-09-16)
- 9be66de35 - fix(vscode): preserve diff row heights across width changes (marius-kilocode, 2026-09-16)
- 9dab2370f - Merge pull request #13519 from Kilo-Org/feat-codex-usage-core-review-ready (Joshua Lambert, 2026-09-16)
- 8962b7e5c - Merge pull request #14193 from Kilo-Org/jetbrains/release/v7.1.7-rc.1 (Kirill Kalishev, 2026-09-15)
- ff06f3de6 - docs(jetbrains): edit changelog for v7.1.7-rc.1 (Kirill Kalishev, 2026-09-15)
- 3abc209cd - docs(jetbrains): edit changelog for v7.1.7-rc.1 (Kirill Kalishev, 2026-09-15)
- 5a0e63abd - Merge pull request #14071 from Kilo-Org/docs/organization-agent-terminology (Emilie Lima Schario, 2026-09-15)
- b64f9a829 - Merge pull request #14068 from Kilo-Org/docs/agent-workflow-terminology (Emilie Lima Schario, 2026-09-15)
- 329a66a8d - Merge pull request #14070 from Kilo-Org/docs/custom-agent-benefits (Emilie Lima Schario, 2026-09-15)
- 5b604f08e - refactor(core): encapsulate Codex usage lifecycle (Josh Lambert, 2026-09-15)
- c27fdede8 - Merge pull request #14067 from Kilo-Org/docs/agent-terminology (Emilie Lima Schario, 2026-09-15)
- 6b54adf30 - release(jetbrains): v7.1.7-rc.1 (kilo-maintainer[bot], 2026-09-15)
- b0702f77e - Merge pull request #14184 from Kilo-Org/chore/jetbrains-cli-pin-v7.7.2 (Kirill Kalishev, 2026-09-15)
- 83a8b486c - chore(jetbrains): bump CLI pin to v7.7.2 (Kirill Kalishev, 2026-09-15)
- 742c32d9a - Merge pull request #14137 from Kilo-Org/golden-sparrow (Kirill Kalishev, 2026-09-15)
- 3b1861209 - fix(jetbrains): anchor the github host to the authority (kirillk, 2026-09-15)
- b6c9e9941 - fix(jetbrains): detect the ref conflict git only summarizes (kirillk, 2026-09-15)
- 68ef839b4 - fix(jetbrains): address PR review on PR import guards (kirillk, 2026-09-15)
- dc5101468 - Merge pull request #14066 from Kilo-Org/docs/remove-kiloclaw (Emilie Lima Schario, 2026-09-15)
- 664be7d75 - fix(jetbrains): reorder worktree row context menu (kirillk, 2026-09-15)
- dead6df70 - fix(jetbrains): explain PR import failures and recover from stale refs (kirillk, 2026-09-15)
- b9a81abf2 - fix(vscode): migrate only user-level Chrome preferences (marius-kilocode, 2026-09-15)
- 7a7bc0332 - fix(vscode): migrate the Integrated Browser Chrome preference once (marius-kilocode, 2026-09-15)
- 647d679bb - fix(vscode): keep the Integrated Browser Chrome toggle in sync (marius-kilocode, 2026-09-15)
- f096c124a - Merge pull request #14185 from Kilo-Org/fix-windows-worktree-containment-check (Marius, 2026-09-15)
- 5246dc209 - fix(vscode): also require ctime to match before trusting a cached key (marius-kilocode, 2026-09-15)
- 44a6145a2 - fix(vscode): prune stale index entries and distrust recent mtimes (marius-kilocode, 2026-09-15)
- 2789f85a3 - Merge pull request #14142 from mondalaci/fix/14139-restore-prompt-focus (Marius, 2026-09-15)
- ed777ccc5 - fix(vscode): correct paste range rebasing and draft clear (marius-kilocode, 2026-09-15)
- 23d811823 - fix(vscode): address browser automation review findings (marius-kilocode, 2026-09-15)
- 9e0bfa801 - fix(vscode): harden and bound the shared Solid transform cache (marius-kilocode, 2026-09-15)
- 1598581a1 - Merge pull request #14183 from Kilo-Org/fix-comment-bug (Marius, 2026-09-15)
- 99d4aeaff - fix(vscode): fold macOS case in document preview containment (marius-kilocode, 2026-09-15)
- 463cfae32 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-09-15)
- dcc067292 - Merge origin/main into fix/14139-restore-prompt-focus (marius-kilocode, 2026-09-15)
- b51f2e388 - fix(vscode): match Windows path casing in document previews (marius-kilocode, 2026-09-15)
- 82b65bd4d - fix(agent-manager): reload the snapshot only for expired review failures (marius-kilocode, 2026-09-15)
- 3a98691ca - fix(agent-manager): reload the PR diff when a review snapshot expires (marius-kilocode, 2026-09-15)
- ae338dd4b - release: v7.7.2 (kilo-maintainer[bot], 2026-09-15)
- 6624db6e5 - fix(vscode): stop routing a PR error that belongs to another project (kirillk, 2026-09-15)
- 1459d814d - fix(agent-manager): make a parked worktree recoverable and bound the poll prune (kirillk, 2026-09-15)
- 929d1e047 - Merge pull request #12714 from Kilo-Org/migrate-marketplace-to-cli (Kirill Kalishev, 2026-09-15)
- 9e6bdf20a - refactor(vscode): move host failure toasts out of AgentManagerApp (kirillk, 2026-09-15)
- 659487484 - Merge remote-tracking branch 'origin/main' into golden-sparrow (kirillk, 2026-09-15)
- deb8dba52 - docs: auto-sync cloud-mobile with merged PRs (through 2026-09-14) (#14132) (github-actions[bot], 2026-09-15)
- 3a1380c1e - fix(vscode): translate browser automation settings into all locales (marius-kilocode, 2026-09-15)
- a93bac0f3 - chore(vscode): address paste collapse review suggestions (marius-kilocode, 2026-09-15)
- 53d49e969 - fix(vscode): finish draft store merge resolution (marius-kilocode, 2026-09-15)
- 810065239 - fix(agent-manager): close the gaps the cross-cutting review found (kirillk, 2026-09-15)
- df9dc1e9b - fix(vscode): make the solid cache sweep resilient and complete (marius-kilocode, 2026-09-15)
- b94d43bc3 - fix(vscode): harden the shared Solid transform cache (marius-kilocode, 2026-09-15)
- b9fc90638 - Merge pull request #14164 from Kilo-Org/fix-vscode-text-selection-interruption (Marius, 2026-09-15)
- bdee7aa24 - chore(vscode): speed up extension launch builds (marius-kilocode, 2026-09-15)
- 6351b3b8f - Merge origin/main into feat/vscode-paste-collapse (marius-kilocode, 2026-09-15)
- 2de1ac281 - Merge remote-tracking branch 'origin/main' into investigate-browser-automation-tool-exposure (marius-kilocode, 2026-09-15)
- 2c3062810 - Merge origin/main into fix-vscode-text-selection-interruption (marius-kilocode, 2026-09-15)
- 24de8170f - fix(vscode): expand large pastes without execCommand (marius-kilocode, 2026-09-15)
- 033360598 - Merge pull request #14166 from Kilo-Org/fix-subagent-reasoning-ui-flicker (Marius, 2026-09-15)
- e79d9c364 - Merge pull request #14168 from Kilo-Org/ui-context-pill-visual-polish (Marius, 2026-09-15)
- aabe2191c - fix(jetbrains): do not latch the gh field downgrade on a deleted worktree (kirillk, 2026-09-15)
- 34a54f40a - feat(vscode): raise paste collapse thresholds for the wider composer (marius-kilocode, 2026-09-15)
- 9d6026600 - fix(vscode): address paste collapse review findings (marius-kilocode, 2026-09-15)
- d06e27636 - fix(vscode): address browser review feedback (marius-kilocode, 2026-09-15)
- 8cb8cfbb1 - Merge pull request #14155 from Kilo-Org/fascinated-baryonyx (Marius, 2026-09-15)
- 81f5afe05 - Merge pull request #14163 from Kilo-Org/lucky-gate (Marius, 2026-09-15)
- 212205a45 - Merge pull request #14169 from Kilo-Org/fix/wakeup-cancel-instance-tagging (Marius, 2026-09-15)
- ce6d77813 - test(vscode): assert the status glide shape instead of one exact frame (marius-kilocode, 2026-09-15)
- 10df8b50f - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-15)
- e5367183c - test(vscode): assert the structured input helper body (marius-kilocode, 2026-09-15)
- c6e0a379d - fix(vscode): keep review and browser sections adjacent (marius-kilocode, 2026-09-15)
- 75748c040 - fix(vscode): keep native prompt undo intact with paste collapse (marius-kilocode, 2026-09-15)
- bede6afca - fix(vscode): reset and guard code contexts in prompt paths (marius-kilocode, 2026-09-15)
- ae61cd1f1 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-15)
- ed92a2316 - fix(vscode): gate Playwright readiness for all prompts and open Integrated Browser before a session (marius-kilocode, 2026-09-15)
- 5b05fd3d8 - fix(vscode): keep feedback metadata ahead of code context (marius-kilocode, 2026-09-15)
- cfdd83029 - Merge pull request #13889 from Kilo-Org/jetbrains-paste-collapse (Kirill Kalishev, 2026-09-15)
- 5ceef03ee - fix(vscode): keep the task card open-state decision out of the component (marius-kilocode, 2026-09-15)
- 36771e619 - feat(vscode): collapse large pastes in the prompt input (marius-kilocode, 2026-09-15)
- 8d861de3b - refactor(vscode): share the prompt show-more toggle (marius-kilocode, 2026-09-15)
- a0bd23321 - refactor(cli): move session-delete wakeup cancel into KiloSession (marius-kilocode, 2026-09-15)
- b98ed5cf8 - fix(vscode): keep the stored task card state consistent on remount (marius-kilocode, 2026-09-15)
- 9ae73fcf2 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-15)
- 7fa6daba5 - refactor(vscode): share one row renderer between virtualizer and tail (marius-kilocode, 2026-09-15)
- e4f66afa7 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-15)
- 16831a04e - fix: tag wakeup cancel events with the session instance (marius-kilocode, 2026-09-15)
- a16e5e994 - feat(vscode): show add-as-context selections as context cards (marius-kilocode, 2026-09-15)
- b4df88d0f - fix: stop transcript jumps while subagent cards stream (marius-kilocode, 2026-09-15)
- d1567e665 - Merge pull request #14165 from Kilo-Org/prevent-sleep-during-schedule-wakeup (Marius, 2026-09-15)
- db4dce412 - fix(tui): treat a failed wakeup refresh as an error (marius-kilocode, 2026-09-15)
- fabfb3698 - fix(ui): restore the upstream project guard (marius-kilocode, 2026-09-15)
- 8ae53cdb3 - docs: retrigger Vercel docs-staging preview (Emilie Schario, 2026-09-15)
- e2922dfd3 - fix(ui): annotate the shared project guard for the annotation checker (marius-kilocode, 2026-09-15)
- ae0afbfd5 - fix: keep Keep Awake active while a wakeup is scheduled (marius-kilocode, 2026-09-15)
- a3269880b - fix: harden transcript selection handling from review feedback (marius-kilocode, 2026-09-15)
- bf5bb64a2 - refactor(vscode): render transcript rows through one shared row view (marius-kilocode, 2026-09-15)
- 136f41185 - fix: keep chat transcript text selections while the agent streams (marius-kilocode, 2026-09-15)
- eff45afaf - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-15)
- 8426ace5f - fix(cli): cap malformed tool failures per turn (marius-kilocode, 2026-09-15)
- bd4d3abfa - Merge remote-tracking branch 'origin/main' into fascinated-baryonyx (marius-kilocode, 2026-09-15)
- 106b1793c - fix(cli): bound stuck turns across malformed tool call variants (marius-kilocode, 2026-09-15)
- 1df699326 - fix(cli): stop looping on repeated malformed tool calls (marius-kilocode, 2026-09-15)
- da2f278dd - Merge remote-tracking branch 'origin/main' into fascinated-baryonyx (marius-kilocode, 2026-09-15)
- 5a73a4543 - perf(vscode): scope the turn timing lookup to the current turn (marius-kilocode, 2026-09-15)
- 66259445e - fix(vscode): address chat timestamp review feedback (marius-kilocode, 2026-09-15)
- 90561b150 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-15)
- f894108d4 - feat(vscode): show chat message timestamps on hover (marius-kilocode, 2026-09-15)
- 23bc3858f - fix(agent-manager): report unavailable on a thrown stats/dirty RPC (kirillk, 2026-09-14)
- 68879beb3 - fix(vscode): restore chat prompt focus after window reactivation (László Monda, 2026-09-15)
- 407560120 - fix(agent-manager): sort worktreeDirs for deterministic orphan order (kirillk, 2026-09-14)
- 100914908 - fix(agent-manager): address review findings on worktree health reporting (kirillk, 2026-09-14)
- 91040bcff - fix(agent-manager): report worktree problems accurately and recover from them (kirillk, 2026-09-14)
- 23ecd42c8 - feat: move marketplace discovery and install into the CLI API (kirillk, 2026-09-14)
- 4ebf44d05 - Merge branch 'main' into jetbrains-paste-collapse (Kirill Kalishev, 2026-09-14)
- 3ae1451db - docs(kilo-docs): clarify organization-managed agent terminology (Emilie Schario, 2026-09-12)
- 1c58ce91f - docs(kilo-docs): describe custom agent benefits (Emilie Schario, 2026-09-12)
- 41865ba13 - docs: drop unused lychee archive exclude (Emilie Schario, 2026-09-12)
- 4bb86f415 - docs(kilo-docs): use agent terminology in customization overview (Emilie Schario, 2026-09-12)
- c21bb1f5b - Remove consolidated file since it's in confluence (Emilie Lima Schario, 2026-09-12)
- e84db4f6c - docs: exclude archived KiloClaw pages from link checker (Emilie Schario, 2026-09-12)
- 8b2cf0c10 - docs(kilo-docs): use agent terminology in introductory guidance (Emilie Schario, 2026-09-12)
- d01b70182 - docs: remove KiloClaw from the public docs site (Emilie Schario, 2026-09-12)
- 51430defa - refactor(core): isolate Codex usage credential discovery (Josh Lambert, 2026-09-11)
- 791a4bc67 - fix(vscode): wait for backend before loading provider usage (Josh Lambert, 2026-09-11)
- 832693958 - fix(core): correct Codex quota normalization and plan labels (Josh Lambert, 2026-09-11)
- 9e61d6866 - feat: show Codex usage in provider usage center (Josh Lambert, 2026-09-11)
- a564d582d - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-11)
- 37cd71d60 - chore: merge main into browser restoration branch (marius-kilocode, 2026-09-11)
- 523f8f761 - fix(vscode): address browser restoration regressions (marius-kilocode, 2026-09-11)
- c6936a745 - fix(vscode): restore Playwright MCP browser tools (marius-kilocode, 2026-09-11)
- 79ebd2819 - fix(jetbrains): repaint the transcript after a fold changes height (kirillk, 2026-09-07)
- e68a2798f - fix(jetbrains): fold each paste independently and share the fold UX (kirillk, 2026-09-07)
- 0ff553307 - feat(jetbrains): collapse long sent messages in the transcript (kirillk, 2026-09-07)
- 914a4ee84 - fix(jetbrains): hide the prompt fold gutter when the paste is deleted (kirillk, 2026-09-07)
- 9448c8469 - feat(jetbrains): fold pasted blocks back from the prompt gutter (kirillk, 2026-09-07)
- d58780991 - fix(jetbrains): resize on paste expand and untrack expanded pastes (kirillk, 2026-09-07)
- 39e129b12 - fix(jetbrains): wrap test document mutation in a write action (kirillk, 2026-09-07)
- a30a1962d - feat(jetbrains): collapse large prompt pastes and cap transcript height (kirillk, 2026-09-07)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/browser-open.ts` (+2, -2)
- `packages/opencode/src/kilocode/tool/browser-open.txt` (+1, -1)
- `packages/opencode/test/kilocode/tool/cancel-wakeup.test.ts` (+6, -1)
- `packages/opencode/test/kilocode/tool/schedule-wakeup.test.ts` (+6, -1)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/kilocode/provider-usage.ts` (+22, -12)
- `packages/core/src/kilocode/provider-usage/codex.ts` (+360, -0)
- `packages/core/test/kilocode-provider-usage-codex.test.ts` (+711, -0)

#### Other Changes
- `.changeset/agent-manager-add-project-footer.md` (+0, -5)
- `.changeset/animated-kilo-logo.md` (+5, -0)
- `.changeset/chat-input-undo-redo.md` (+5, -0)
- `.changeset/codex-usage-visibility.md` (+6, -0)
- `.changeset/document-preview-windows-case.md` (+5, -0)
- `.changeset/fast-worktree-deletion.md` (+6, -0)
- `.changeset/inline-diff-parity.md` (+5, -0)
- `.changeset/inspector-visible-stream.md` (+0, -5)
- `.changeset/jetbrains-paste-collapse-thresholds.md` (+5, -0)
- `.changeset/jetbrains-pr-import-errors.md` (+5, -0)
- `.changeset/jetbrains-worktree-row-menu-order.md` (+5, -0)
- `.changeset/pr-review-snapshot-reload.md` (+5, -0)
- `.changeset/restore-playwright-browser-tools.md` (+5, -0)
- `.changeset/restore-prompt-window-focus.md` (+5, -0)
- `.changeset/review-diff-row-height.md` (+5, -0)
- `.changeset/skills-paths-leading-slash-and-picker-groups.md` (+6, -0)
- `.changeset/speech-to-text-custom-source.md` (+0, -5)
- `.changeset/stable-session-header-height.md` (+0, -5)
- `.changeset/streaming-flicker.md` (+5, -0)
- `.changeset/swarm-agent-behaviour-setting.md` (+0, -6)
- `.changeset/vscode-paste-collapse.md` (+5, -0)
- `.changeset/working-status-swap-clip.md` (+0, -5)
- `.changeset/worktree-health-recovery.md` (+6, -0)
- `artifacts/glm52-rise-video/package.json` (+1, -1)
- `bun.lock` (+47, -43)
- `nix/hashes.json` (+4, -4)
- `package.json` (+1, -1)
- `packages/client/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/httpapi-codegen/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-docs/__tests__/content-integrity.test.ts` (+2, -0)
- `packages/kilo-docs/__tests__/sitemap.test.ts` (+2, -0)
- `packages/kilo-docs/components/SideNav.tsx` (+0, -2)
- `packages/kilo-docs/components/TopNav.tsx` (+0, -1)
- `packages/kilo-docs/lib/nav/index.ts` (+0, -2)
- `packages/kilo-docs/lib/nav/kiloclaw.ts` (+0, -70)
- `packages/kilo-docs/markdoc/partials/kiloclaw-eol.md` (+0, -3)
- `packages/kilo-docs/next.config.js` (+0, -5)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/ai-providers/openai-chatgpt-plus-pro.md` (+1, -1)
- `packages/kilo-docs/pages/automate/extending/shell-integration.md` (+1, -1)
- `packages/kilo-docs/pages/automate/tools/index.md` (+3, -1)
- `packages/kilo-docs/pages/code-with-ai/features/browser-use.md` (+4, -0)
- `packages/kilo-docs/pages/code-with-ai/features/code-actions.md` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/platforms/mobile.md` (+35, -9)
- `packages/kilo-docs/pages/collaborate/teams/getting-started.md` (+1, -1)
- `packages/kilo-docs/pages/contributing/architecture/cli-runtime.md` (+1, -1)
- `packages/kilo-docs/pages/contributing/architecture/vscode-extension.md` (+1, -1)
- `packages/kilo-docs/pages/customize/custom-modes.md` (+16, -16)
- `packages/kilo-docs/pages/customize/index.md` (+6, -6)
- `packages/kilo-docs/pages/customize/skills.md` (+8, -0)
- `packages/kilo-docs/pages/getting-started/index.md` (+2, -2)
- `packages/kilo-docs/pages/getting-started/settings/keep-awake.md` (+2, -2)
- `packages/kilo-docs/pages/kiloclaw/chat-platforms/discord.md` (+0, -148)
- `packages/kilo-docs/pages/kiloclaw/chat-platforms/index.md` (+0, -32)
- `packages/kilo-docs/pages/kiloclaw/chat-platforms/slack.md` (+0, -144)
- `packages/kilo-docs/pages/kiloclaw/chat-platforms/telegram.md` (+0, -87)
- `packages/kilo-docs/pages/kiloclaw/control-ui/changing-models.md` (+0, -24)
- `packages/kilo-docs/pages/kiloclaw/control-ui/exec-approvals.md` (+0, -76)
- `packages/kilo-docs/pages/kiloclaw/control-ui/overview.md` (+0, -34)
- `packages/kilo-docs/pages/kiloclaw/control-ui/version-pinning.md` (+0, -49)
- `packages/kilo-docs/pages/kiloclaw/dashboard.md` (+0, -204)
- `packages/kilo-docs/pages/kiloclaw/development-tools/composio.md` (+0, -68)
- `packages/kilo-docs/pages/kiloclaw/development-tools/github.md` (+0, -88)
- `packages/kilo-docs/pages/kiloclaw/development-tools/google.md` (+0, -94)
- `packages/kilo-docs/pages/kiloclaw/development-tools/index.md` (+0, -21)
- `packages/kilo-docs/pages/kiloclaw/development-tools/linear.md` (+0, -66)
- `packages/kilo-docs/pages/kiloclaw/end-to-end.md` (+0, -165)
- `packages/kilo-docs/pages/kiloclaw/faq/general.md` (+0, -71)
- `packages/kilo-docs/pages/kiloclaw/faq/pricing.md` (+0, -30)
- `packages/kilo-docs/pages/kiloclaw/overview.md` (+0, -115)
- `packages/kilo-docs/pages/kiloclaw/pre-installed-software.md` (+0, -114)
- `packages/kilo-docs/pages/kiloclaw/tools/1password.md` (+0, -39)
- `packages/kilo-docs/pages/kiloclaw/tools/agentcard.md` (+0, -46)
- `packages/kilo-docs/pages/kiloclaw/tools/brave-search.md` (+0, -30)
- `packages/kilo-docs/pages/kiloclaw/tools/index.md` (+0, -17)
- `packages/kilo-docs/pages/kiloclaw/tools/other-tools.md` (+0, -53)
- `packages/kilo-docs/pages/kiloclaw/triggers/index.md` (+0, -53)
- `packages/kilo-docs/pages/kiloclaw/triggers/scheduled.md` (+0, -129)
- `packages/kilo-docs/pages/kiloclaw/triggers/webhooks.md` (+0, -118)
- `packages/kilo-docs/pages/kiloclaw/troubleshooting/architecture.md` (+0, -16)
- `packages/kilo-docs/pages/kiloclaw/troubleshooting/common-questions.md` (+0, -50)
- `packages/kilo-docs/pages/kiloclaw/troubleshooting/faq.md` (+0, -29)
- `packages/kilo-docs/pages/kiloclaw/troubleshooting/gateway-process.md` (+0, -17)
- `packages/kilo-docs/previous-docs-redirects.js` (+50, -38)
- `packages/kilo-docs/public/img/kiloclaw/access-code-modal.png` (+-, --)
- `packages/kilo-docs/public/img/kiloclaw/access-code-modal2.png` (+-, --)
- `packages/kilo-docs/public/img/kiloclaw/allow-everything-settings.png` (+-, --)
- `packages/kilo-docs/public/img/kiloclaw/create-instance.png` (+-, --)
- `packages/kilo-docs/public/img/kiloclaw/dashboard.png` (+-, --)
- `packages/kilo-docs/public/img/kiloclaw/discord.png` (+-, --)
- `packages/kilo-docs/public/img/kiloclaw/instance-dashboard.png` (+-, --)
- `packages/kilo-docs/public/img/kiloclaw/openclaw-dashboard.png` (+-, --)
- `packages/kilo-docs/public/img/kiloclaw/profile-claw-nav.png` (+-, --)
- `packages/kilo-docs/public/img/kiloclaw/slack.png` (+-, --)
- `packages/kilo-docs/public/img/kiloclaw/telegram.png` (+-, --)
- `packages/kilo-docs/public/img/mobile-apps/kiloclaw-chat.webp` (+-, --)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/prompt-rail-sidebar-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/labs-tool-call-lab/search-previews-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/prompt-input/with-code-context-200-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/prompt-input/with-code-context-420-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/prompt-input/with-large-code-context-420-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/prompt-input/with-many-code-contexts-420-chromium-linux.png` (+3, -0)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/CHANGELOG.md` (+33, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/diff/GitComparison.kt` (+70, -3)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorktreeRpcApiImpl.kt` (+263, -43)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/PrResolver.kt` (+60, -17)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloWorktreeRpcApiImplTest.kt` (+310, -2)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/PrResolverTest.kt` (+92, -22)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/AgentManagerPanel.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/GhBanner.kt` (+6, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/GhStatusCoordinator.kt` (+10, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/KiloWorktreeService.kt` (+12, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/NewWorktreeDialog.kt` (+13, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeController.kt` (+14, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeDiagnostics.kt` (+87, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeDiagnosticsAction.kt` (+70, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeStatusService.kt` (+63, -6)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/PromptPanel.kt` (+33, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/PromptPasteCollapse.kt` (+20, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/prompt/PromptTextPasteProvider.kt` (+47, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/style/SessionUiStyle.kt` (+2, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/PromptView.kt` (+22, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/TextView.kt` (+3, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/AdvancedSettingsUi.kt` (+17, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/editor/EditorFolds.kt` (+162, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/MdViewFactory.kt` (+6, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/md/hybrid/MdViewHybrid.kt` (+60, -3)
- `packages/kilo-jetbrains/frontend/src/main/resources/kilo.jetbrains.frontend.xml` (+3, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+14, -4)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/HistorySessionActionsTest.kt` (+7, -7)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/KiloRecoveryActionsTest.kt` (+3, -3)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/WorktreeControllerTest.kt` (+26, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/GhBannerTest.kt` (+18, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/GhStatusCoordinatorTest.kt` (+57, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/NewWorktreeDialogTest.kt` (+24, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeDiagnosticsTest.kt` (+69, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeStatusServiceTest.kt` (+146, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/PromptPanelTest.kt` (+285, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/prompt/PromptPasteCollapseTest.kt` (+35, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/TextViewTest.kt` (+177, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeWorktreeRpcApi.kt` (+11, -1)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/PrUrl.kt` (+23, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/WorktreeDto.kt` (+57, -4)
- `packages/kilo-memory/package.json` (+1, -1)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/basic-tool.tsx` (+45, -3)
- `packages/kilo-ui/src/components/diff.tsx` (+6, -2)
- `packages/kilo-ui/src/components/file.tsx` (+19, -0)
- `packages/kilo-ui/src/components/message-part.css` (+32, -3)
- `packages/kilo-ui/src/components/message-part.tsx` (+43, -28)
- `packages/kilo-ui/src/hooks/create-auto-scroll.test.tsx` (+123, -0)
- `packages/kilo-ui/src/hooks/create-auto-scroll.tsx` (+24, -4)
- `packages/kilo-ui/src/hooks/scroll-user-activity.ts` (+29, -0)
- `packages/kilo-ui/src/pierre/index.ts` (+19, -0)
- `packages/kilo-ui/src/pierre/virtualize.test.ts` (+34, -0)
- `packages/kilo-ui/tests/inline-diff-parity.spec.ts` (+41, -0)
- `packages/kilo-vscode/CHANGELOG.md` (+30, -0)
- `packages/kilo-vscode/assets/icons/kilo-yellow.lottie` (+-, --)
- `packages/kilo-vscode/esbuild.js` (+206, -29)
- `packages/kilo-vscode/package.json` (+26, -4)
- `packages/kilo-vscode/src/KiloProvider.ts` (+55, -21)
- `packages/kilo-vscode/src/MarketplacePanelProvider.ts` (+2, -0)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+58, -57)
- `packages/kilo-vscode/src/agent-manager/GitStatsPoller.ts` (+58, -15)
- `packages/kilo-vscode/src/agent-manager/PRStatusPoller.ts` (+98, -18)
- `packages/kilo-vscode/src/agent-manager/WorktreeManager.ts` (+262, -39)
- `packages/kilo-vscode/src/agent-manager/WorktreeStateManager.ts` (+18, -29)
- `packages/kilo-vscode/src/agent-manager/command-budget.ts` (+51, -0)
- `packages/kilo-vscode/src/agent-manager/gh.ts` (+8, -0)
- `packages/kilo-vscode/src/agent-manager/git-import.ts` (+75, -4)
- `packages/kilo-vscode/src/agent-manager/host.ts` (+2, -0)
- `packages/kilo-vscode/src/agent-manager/log-format.ts` (+18, -0)
- `packages/kilo-vscode/src/agent-manager/pr-status-bridge.ts` (+4, -0)
- `packages/kilo-vscode/src/agent-manager/pr/am-pr-seed.ts` (+18, -0)
- `packages/kilo-vscode/src/agent-manager/project/context.ts` (+9, -0)
- `packages/kilo-vscode/src/agent-manager/project/init.ts` (+64, -1)
- `packages/kilo-vscode/src/agent-manager/project/paths.ts` (+13, -0)
- `packages/kilo-vscode/src/agent-manager/project/pollers.ts` (+13, -0)
- `packages/kilo-vscode/src/agent-manager/project/state-gate.ts` (+2, -0)
- `packages/kilo-vscode/src/agent-manager/provider-lifecycle.ts` (+68, -32)
- `packages/kilo-vscode/src/agent-manager/pty-cleanup.ts` (+28, -31)
- `packages/kilo-vscode/src/agent-manager/quarantine.ts` (+78, -0)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+23, -0)
- `packages/kilo-vscode/src/agent-manager/vscode-host.ts` (+1, -0)
- `packages/kilo-vscode/src/agent-manager/worktree-create.ts` (+5, -1)
- `packages/kilo-vscode/src/agent-manager/worktree-diagnostics.ts` (+110, -0)
- `packages/kilo-vscode/src/agent-manager/worktree-doctor.ts` (+64, -0)
- `packages/kilo-vscode/src/agent-manager/worktree-health.ts` (+124, -0)
- `packages/kilo-vscode/src/agent-manager/worktree-importer.ts` (+6, -1)
- `packages/kilo-vscode/src/agent-manager/worktree-reconcile.ts` (+200, -0)
- `packages/kilo-vscode/src/agent-manager/worktree-recovery.ts` (+98, -0)
- `packages/kilo-vscode/src/documents/document-reader.ts` (+22, -2)
- `packages/kilo-vscode/src/extension.ts` (+31, -4)
- `packages/kilo-vscode/src/kilo-provider/prompt-focus.ts` (+100, -0)
- `packages/kilo-vscode/src/kilo-provider/remove-config-item.ts` (+3, -9)
- `packages/kilo-vscode/src/services/browser-automation/browser-automation-service.ts` (+258, -0)
- `packages/kilo-vscode/src/services/browser-automation/browser-broker.ts` (+2, -2)
- `packages/kilo-vscode/src/services/browser-automation/chrome-setting.ts` (+32, -0)
- `packages/kilo-vscode/src/services/browser-automation/index.ts` (+1, -0)
- `packages/kilo-vscode/src/services/browser-automation/settings.ts` (+18, -0)
- `packages/kilo-vscode/src/services/caffeination/feed.ts` (+35, -14)
- `packages/kilo-vscode/src/services/caffeination/service.ts` (+18, -2)
- `packages/kilo-vscode/src/services/cli-backend/connection-service.ts` (+9, -1)
- `packages/kilo-vscode/src/services/code-actions/register-code-actions.ts` (+10, -7)
- `packages/kilo-vscode/src/services/marketplace/actions.ts` (+39, -42)
- `packages/kilo-vscode/src/services/marketplace/api.ts` (+0, -143)
- `packages/kilo-vscode/src/services/marketplace/detection.ts` (+0, -103)
- `packages/kilo-vscode/src/services/marketplace/index.ts` (+39, -40)
- `packages/kilo-vscode/src/services/marketplace/installer.ts` (+0, -449)
- `packages/kilo-vscode/src/services/marketplace/paths.ts` (+0, -31)
- `packages/kilo-vscode/src/services/marketplace/relevance.ts` (+14, -1)
- `packages/kilo-vscode/src/services/marketplace/types.ts` (+2, -10)
- `packages/kilo-vscode/src/services/telemetry/types.ts` (+1, -0)
- `packages/kilo-vscode/src/shared/code-context.ts` (+37, -0)
- `packages/kilo-vscode/tests/chat-auto-scroll.spec.ts` (+41, -0)
- `packages/kilo-vscode/tests/diff-scroll-preservation.spec.ts` (+65, -0)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/paste-collapse.spec.ts` (+55, -0)
- `packages/kilo-vscode/tests/prompt-undo.spec.ts` (+26, -5)
- `packages/kilo-vscode/tests/question-resolve-stability.spec.ts` (+56, -0)
- `packages/kilo-vscode/tests/session-dock-stability.spec.ts` (+12, -3)
- `packages/kilo-vscode/tests/setup/vscode-mock.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-provider-lifecycle.test.ts` (+36, -22)
- `packages/kilo-vscode/tests/unit/am-pr-seed.test.ts` (+58, -1)
- `packages/kilo-vscode/tests/unit/am-pr-status-bridge.test.ts` (+15, -7)
- `packages/kilo-vscode/tests/unit/browser-automation-chrome-setting.test.ts` (+68, -0)
- `packages/kilo-vscode/tests/unit/browser-automation-lifecycle.test.ts` (+300, -0)
- `packages/kilo-vscode/tests/unit/browser-automation-recovery.test.ts` (+31, -0)
- `packages/kilo-vscode/tests/unit/browser-broker.test.ts` (+19, -14)
- `packages/kilo-vscode/tests/unit/caffeination.test.ts` (+95, -9)
- `packages/kilo-vscode/tests/unit/code-context.test.ts` (+127, -0)
- `packages/kilo-vscode/tests/unit/document-reader.test.ts` (+36, -1)
- `packages/kilo-vscode/tests/unit/draft-store.test.ts` (+5, -1)
- `packages/kilo-vscode/tests/unit/failure-toast.test.ts` (+56, -0)
- `packages/kilo-vscode/tests/unit/frame-queue.test.ts` (+96, -0)
- `packages/kilo-vscode/tests/unit/git-import.test.ts` (+53, -0)
- `packages/kilo-vscode/tests/unit/git-stats-poller.test.ts` (+110, -1)
- `packages/kilo-vscode/tests/unit/kilo-provider-load-messages.test.ts` (+70, -1)
- `packages/kilo-vscode/tests/unit/kilo-provider-route-integration.test.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/kilo-ui-contract.test.ts` (+42, -3)
- `packages/kilo-vscode/tests/unit/marketplace-actions.test.ts` (+22, -36)
- `packages/kilo-vscode/tests/unit/marketplace-installer.test.ts` (+0, -289)
- `packages/kilo-vscode/tests/unit/marketplace-panel-arch.test.ts` (+5, -1)
- `packages/kilo-vscode/tests/unit/message-time.test.ts` (+42, -0)
- `packages/kilo-vscode/tests/unit/pr-diff-comment-state.test.ts` (+97, -0)
- `packages/kilo-vscode/tests/unit/prompt-focus.test.ts` (+195, -0)
- `packages/kilo-vscode/tests/unit/prompt-hold.test.ts` (+82, -0)
- `packages/kilo-vscode/tests/unit/prompt-input-connection-guard.test.ts` (+5, -4)
- `packages/kilo-vscode/tests/unit/prompt-input-utils.test.ts` (+284, -0)
- `packages/kilo-vscode/tests/unit/prompt-send-contract.test.ts` (+47, -1)
- `packages/kilo-vscode/tests/unit/provider-usage.test.ts` (+32, -2)
- `packages/kilo-vscode/tests/unit/pty-cleanup.test.ts` (+25, -100)
- `packages/kilo-vscode/tests/unit/quarantine.test.ts` (+231, -0)
- `packages/kilo-vscode/tests/unit/register-code-actions.test.ts` (+17, -12)
- `packages/kilo-vscode/tests/unit/remove-config-item.test.ts` (+6, -6)
- `packages/kilo-vscode/tests/unit/side-panel-state.test.ts` (+70, -0)
- `packages/kilo-vscode/tests/unit/task-tool-hydration.test.ts` (+31, -0)
- `packages/kilo-vscode/tests/unit/transcript-rows.test.ts` (+75, -15)
- `packages/kilo-vscode/tests/unit/use-paste-collapse.test.ts` (+129, -0)
- `packages/kilo-vscode/tests/unit/use-slash-command.test.ts` (+65, -0)
- `packages/kilo-vscode/tests/unit/worktree-diagnostics.test.ts` (+160, -0)
- `packages/kilo-vscode/tests/unit/worktree-health.test.ts` (+234, -0)
- `packages/kilo-vscode/tests/unit/worktree-manager.test.ts` (+206, -0)
- `packages/kilo-vscode/tests/unit/worktree-reconcile.test.ts` (+373, -0)
- `packages/kilo-vscode/tests/unit/worktree-recovery.test.ts` (+116, -0)
- `packages/kilo-vscode/tests/unit/worktree-state-manager.test.ts` (+19, -44)
- `packages/kilo-vscode/tests/visual-regression.spec.mts` (+4, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+9, -10)
- `packages/kilo-vscode/webview-ui/agent-manager/NewWorktreeDialog.tsx` (+8, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/OrphanNotice.tsx` (+80, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectSidebarBody.tsx` (+16, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/SidebarBody.tsx` (+23, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/WorktreeItem.tsx` (+122, -26)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+69, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/failure-toast.ts` (+42, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+31, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+32, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+32, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+30, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+32, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+32, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+32, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fa.ts` (+30, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fr.ts` (+32, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/it.ts` (+32, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ja.ts` (+32, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ko.ts` (+31, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/nl.ts` (+32, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/no.ts` (+30, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/pl.ts` (+31, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ru.ts` (+31, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/th.ts` (+30, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/tr.ts` (+33, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/uk.ts` (+31, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zh.ts` (+28, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zht.ts` (+28, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/diff-comment-state.ts` (+31, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/project/store.ts` (+14, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/side-panel-state.ts` (+9, -7)
- `packages/kilo-vscode/webview-ui/diff-viewer/diff-open-policy.ts` (+9, -3)
- `packages/kilo-vscode/webview-ui/src/components/brand/AnimatedKiloLogo.tsx` (+58, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/AssistantMessage.tsx` (+53, -12)
- `packages/kilo-vscode/webview-ui/src/components/chat/CodeContextChips.tsx` (+147, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+29, -38)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+294, -91)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptShowMore.tsx` (+22, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/ReviewComments.tsx` (+2, -7)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskToolExpanded.tsx` (+18, -11)
- `packages/kilo-vscode/webview-ui/src/components/chat/TranscriptRow.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/WelcomeEmptyState.tsx` (+29, -3)
- `packages/kilo-vscode/webview-ui/src/components/chat/prompt-input-utils.ts` (+193, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/task-tool-state.ts` (+14, -0)
- `packages/kilo-vscode/webview-ui/src/components/profile/ProviderUsageCards.tsx` (+4, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/BrowserTab.tsx` (+19, -1)
- `packages/kilo-vscode/webview-ui/src/components/settings/ExperimentalTab.tsx` (+18, -3)
- `packages/kilo-vscode/webview-ui/src/context/frame-queue.ts` (+76, -0)
- `packages/kilo-vscode/webview-ui/src/context/language.tsx` (+3, -1)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+7, -7)
- `packages/kilo-vscode/webview-ui/src/context/transcript-rows.ts` (+64, -10)
- `packages/kilo-vscode/webview-ui/src/hooks/usePasteCollapse.ts` (+288, -0)
- `packages/kilo-vscode/webview-ui/src/hooks/useSlashCommand.ts` (+26, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+9, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+9, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+9, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+9, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+9, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+11, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+9, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+9, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+9, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+9, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+9, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+9, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+9, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+9, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+9, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+9, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+9, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+9, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+9, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+9, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+9, -1)
- `packages/kilo-vscode/webview-ui/src/stories/chat.stories.tsx` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/stories/prompt-input.stories.tsx` (+68, -0)
- `packages/kilo-vscode/webview-ui/src/stories/tool-call-lab.stories.tsx` (+61, -0)
- `packages/kilo-vscode/webview-ui/src/styles/chat-layout.css` (+5, -2)
- `packages/kilo-vscode/webview-ui/src/styles/prompt-input.css` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/styles/welcome.css` (+46, -1)
- `packages/kilo-vscode/webview-ui/src/types/messages/agent-manager.ts` (+8, -1)
- `packages/kilo-vscode/webview-ui/src/types/messages/config.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+18, -1)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+18, -0)
- `packages/kilo-vscode/webview-ui/src/utils/draft-store.ts` (+25, -2)
- `packages/kilo-vscode/webview-ui/src/utils/focus.ts` (+49, -0)
- `packages/kilo-vscode/webview-ui/src/utils/message-time.ts` (+21, -0)
- `packages/kilo-vscode/webview-ui/src/utils/prompt-drafts.ts` (+30, -19)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+12, -0)
- `packages/opencode/package.json` (+2, -1)
- `packages/opencode/src/kilocode/cli/cmd/tui/caffeination.tsx` (+34, -2)
- `packages/opencode/src/kilocode/components/dialog-provider-usage.tsx` (+3, -0)
- `packages/opencode/src/kilocode/config/config.ts` (+5, -0)
- `packages/opencode/src/kilocode/marketplace/api.ts` (+159, -0)
- `packages/opencode/src/kilocode/marketplace/detection.ts` (+82, -0)
- `packages/opencode/src/kilocode/marketplace/installer.ts` (+333, -0)
- `packages/opencode/src/kilocode/marketplace/paths.ts` (+24, -0)
- `packages/opencode/src/kilocode/marketplace/schema.ts` (+196, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/kilocode.ts` (+78, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilocode.ts` (+140, -0)
- `packages/opencode/src/kilocode/session/index.ts` (+24, -0)
- `packages/opencode/src/kilocode/session/processor.ts` (+57, -2)
- `packages/opencode/src/kilocode/skill/paths.ts` (+25, -0)
- `packages/opencode/src/kilocode/wakeup/index.ts` (+46, -2)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/authorization.ts` (+5, -1)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+2, -0)
- `packages/opencode/src/session/processor.ts` (+10, -0)
- `packages/opencode/src/session/session.ts` (+2, -0)
- `packages/opencode/src/skill/index.ts` (+4, -2)
- `packages/opencode/test/event-manifest.test.ts` (+3, -1)
- `packages/opencode/test/kilocode/marketplace-api.test.ts` (+60, -0)
- `packages/opencode/test/kilocode/marketplace-installer.test.ts` (+66, -0)
- `packages/opencode/test/kilocode/server/httpapi-exercise-scenarios.ts` (+98, -0)
- `packages/opencode/test/kilocode/server/httpapi-marketplace.test.ts` (+225, -0)
- `packages/opencode/test/kilocode/server/httpapi-worktree-teardown.test.ts` (+119, -0)
- `packages/opencode/test/kilocode/session-processor-invalid-arguments.test.ts` (+342, -0)
- `packages/opencode/test/kilocode/skill/paths.test.ts` (+99, -0)
- `packages/opencode/test/kilocode/tool-registry-indexing.test.ts` (+2, -0)
- `packages/opencode/test/kilocode/wakeup/wakeup.test.ts` (+73, -4)
- `packages/opencode/test/server/httpapi-exercise/environment.ts` (+1, -0)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/protocol/package.json` (+1, -1)
- `packages/schema/package.json` (+1, -1)
- `packages/schema/src/event-manifest.ts` (+2, -0)
- `packages/schema/src/kilocode/wakeup-event.ts` (+20, -0)
- `packages/script/package.json` (+1, -1)
- `packages/sdk-next/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+214, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+373, -0)
- `packages/sdk/openapi.json` (+1801, -743)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/storybook/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/components/markdown-stream.test.ts` (+35, -0)
- `packages/ui/src/components/markdown-stream.ts` (+23, -0)
- `packages/ui/src/components/markdown.tsx` (+12, -5)
- `packages/ui/src/kilocode/markdown-code-tokens.ts` (+24, -0)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index ab8f0c9dd..a82cd99e0 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.7.1",
+  "version": "7.7.2",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/kilocode/provider-usage.ts
```diff
diff --git a/packages/core/src/kilocode/provider-usage.ts b/packages/core/src/kilocode/provider-usage.ts
index a27f4a3bd..562c28262 100644
--- a/packages/core/src/kilocode/provider-usage.ts
+++ b/packages/core/src/kilocode/provider-usage.ts
@@ -9,13 +9,15 @@ import { Integration } from "../integration"
 import { PluginV2 } from "../plugin"
 import { ProviderV2 } from "../provider"
 import * as Cloud from "./provider-usage/cloud"
+import * as Codex from "./provider-usage/codex"
 import { bindings, direct, type Candidate } from "./provider-usage/minimax/usage"
 
 const successTtl = 60_000
 const errorTtl = 10_000
 const readyPlugin = PluginV2.ID.make("config-provider")
 
-interface AdapterContext {
+export interface AdapterContext {
+  providers: readonly ProviderV2.Info[]
   candidates: readonly Candidate[]
   failedCandidates: readonly Candidate["providerID"][]
   cloud: (() => Promise<Cloud.CloudState>) | undefined
@@ -34,9 +36,10 @@ interface AdapterResult {
   items: ReadonlyArray<Contract.UsageSnapshot>
 }
 
-interface Adapter {
+export interface Adapter {
   cachePrefixes: readonly string[]
   cloudScoped?: boolean
+  valid?: () => boolean
   run(ctx: AdapterContext): Promise<AdapterResult>
 }
 
@@ -80,8 +83,6 @@ const minimax: Adapter = {
   },
 }
 
-const registry: readonly Adapter[] = [managed, minimax]
-
 export class ServiceError extends Schema.TaggedErrorClass<ServiceError>()("ProviderUsageServiceError", {
   message: Schema.String,
 }) {}
@@ -122,6 +123,7 @@ function scopeCloudCache(state: State, token: string | undefined) {
 
 function stale(next: Contract.UsageSnapshot, previous: Contract.UsageSnapshot | undefined) {
   if (next.fetchState !== "unavailable" && next.fetchState !== "error") return next
+  if (next.error?.retryable === false) return next
   if (!previous || (previous.fetchState !== "ready" && previous.fetchState !== "stale")) return next
   return {
     ...previous,
```

#### packages/core/src/kilocode/provider-usage/codex.ts
```diff
diff --git a/packages/core/src/kilocode/provider-usage/codex.ts b/packages/core/src/kilocode/provider-usage/codex.ts
new file mode 100644
index 000000000..31cbaf3fe
--- /dev/null
+++ b/packages/core/src/kilocode/provider-usage/codex.ts
@@ -0,0 +1,360 @@
+import type { ProviderUsage } from "@opencode-ai/schema/kilocode/provider-usage"
+import { Effect } from "effect"
+import { createHash } from "node:crypto"
+import { Integration } from "../../integration"
+import { ProviderV2 } from "../../provider"
+import type { Adapter, AdapterContext } from "../provider-usage"
+
+const url = "https://chatgpt.com/backend-api/wham/usage"
+const manage = "https://chatgpt.com/codex/settings/usage"
+const limit = 64 * 1024
+const timeout = 5_000
+const maximum = 8_640_000_000_000_000
+
+const plans: Record<string, string> = {
+  plus: "ChatGPT Plus",
+  pro: "ChatGPT Pro",
+  prolite: "ChatGPT Pro Lite",
+  business: "ChatGPT Enterprise",
+  self_serve_business_prolite: "ChatGPT Business Premium",
+  self_serve_business_usage_based: "ChatGPT Business",
+  ent26: "ChatGPT Enterprise",
+  enterprise_cbp_automation: "ChatGPT Enterprise (Automation)",
+  enterprise_cbp_usage_based: "ChatGPT Enterprise",
+  enterprise: "ChatGPT Enterprise",
+  edu: "ChatGPT Edu",
+  education: "ChatGPT Edu",
+  edu_plus: "ChatGPT Edu Plus",
+  edu_pro: "ChatGPT Edu Pro",
+  team: "ChatGPT Business",
+  free: "ChatGPT Free",
+  go: "ChatGPT Go",
+}
+
+interface Candidate {
+  label: string
+  access: string
+  account?: string
+}
+
+const discover = Effect.fn("ProviderUsage.Codex.discover")(function* (
+  provider: ProviderV2.Info | undefined,
+  integrations: Integration.Interface,
+) {
+  if (!provider || provider.disabled) return { status: "absent" as const }
```

#### packages/core/test/kilocode-provider-usage-codex.test.ts
```diff
diff --git a/packages/core/test/kilocode-provider-usage-codex.test.ts b/packages/core/test/kilocode-provider-usage-codex.test.ts
new file mode 100644
index 000000000..3ef35fbbc
--- /dev/null
+++ b/packages/core/test/kilocode-provider-usage-codex.test.ts
@@ -0,0 +1,711 @@
+import { describe, expect, test } from "bun:test"
+import { Deferred, Effect, Fiber, Layer } from "effect"
+import path from "node:path"
+import { Catalog } from "../src/catalog"
+import { Credential } from "../src/credential"
+import { Database } from "../src/database/database"
+import { AppNodeBuilder } from "../src/effect/app-node-builder"
+import { LayerNode } from "../src/effect/layer-node"
+import { Global } from "../src/global"
+import { Integration } from "../src/integration"
+import { ProviderUsage } from "../src/kilocode/provider-usage"
+import { decode, load, normalize } from "../src/kilocode/provider-usage/codex"
+import { Location } from "../src/location"
+import { PluginV2 } from "../src/plugin"
+import { ProviderV2 } from "../src/provider"
+import { AbsolutePath } from "../src/schema"
+import { location } from "./fixture/location"
+import { tmpdir } from "./fixture/tmpdir"
+import { testEffect } from "./lib/effect"
+
+const openai = Integration.ID.make("openai")
+const minimax = Integration.ID.make("minimax-coding-plan")
+const method = Integration.MethodID.make("chatgpt-browser")
+const it = testEffect(Layer.empty)
+
+type RequestHandler = (input: string | URL | Request, init?: RequestInit) => Promise<Response>
+
+type Fixture = {
+  usage: ProviderUsage.Interface
+  catalog: Catalog.Interface
+  integrations: Integration.Interface
+  credentials: Credential.Interface
+  requests: Array<{ url: string; init: RequestInit }>
+  refreshes: { count: number }
+}
+
+const window = (used: number, seconds = 18_000) => ({
+  used_percent: used,
+  limit_window_seconds: seconds,
+  reset_after_seconds: seconds,
+  reset_at: Math.floor(Date.now() / 1000) + seconds,
+})
+
+const payload = (overrides: Record<string, unknown> = {}) => ({
```

#### packages/opencode/src/kilocode/tool/browser-open.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/browser-open.ts b/packages/opencode/src/kilocode/tool/browser-open.ts
index ad5addfdb..bea8af60e 100644
--- a/packages/opencode/src/kilocode/tool/browser-open.ts
+++ b/packages/opencode/src/kilocode/tool/browser-open.ts
@@ -67,7 +67,7 @@ export const BrowserOpenTool = Tool.define<
           ) {
             return {
               title: "Browser unavailable",
-              output: "The Agent Manager browser is not available in this session.",
+              output: "The Integrated Browser is not available in this session.",
               metadata: { status: "error", errors: 0 } satisfies Meta,
             }
           }
@@ -134,7 +134,7 @@ export const BrowserOpenTool = Tool.define<
                 state.logs?.length
                   ? `Console diagnostics:\n${state.logs.map((line) => `- ${line}`).join("\n")}`
                   : undefined,
-                "The user can inspect this page in the Agent Manager Browser panel.",
+                "The user can inspect this page in the Integrated Browser panel in Agent Manager.",
               ]
                 .filter(Boolean)
                 .join("\n"),
```


*... and more files (showing first 5)*

## opencode Changes (e03db9b..e03db9b)

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

- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/src/kilocode/provider-usage.ts
- `src/core/` - review core changes from packages/core/src/kilocode/provider-usage/codex.ts
- `src/core/` - review core changes from packages/core/test/kilocode-provider-usage-codex.test.ts
- `src/tool/browser-open.ts` - update based on kilocode packages/opencode/src/kilocode/tool/browser-open.ts changes
- `src/tool/browser-open.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/browser-open.txt changes
- `src/tool/cancel-wakeup.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/cancel-wakeup.test.ts changes
- `src/tool/schedule-wakeup.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/schedule-wakeup.test.ts changes
