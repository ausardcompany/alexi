# Upstream Changes Report
Generated: 2026-09-18 10:42:04

## Summary
- kilocode: 166 commits, 412 files changed
- opencode: 4 commits, 61 files changed

## kilocode Changes (8db973de9..c33d81690)

### Commits

- c33d81690 - Merge pull request #14171 from Kilo-Org/docs/fix-agent-doc-discovery-404s (Emilie Lima Schario, 2026-09-18)
- c5bb63938 - Merge branch 'main' into docs/fix-agent-doc-discovery-404s (Emilie Lima Schario, 2026-09-18)
- af0a16bd2 - Merge pull request #14251 from Kilo-Org/agent-manager-modal-mentions (Marius, 2026-09-18)
- 3f3947e4a - refactor(vscode): call RegExp.escape without a receiver (marius-kilocode, 2026-09-18)
- 483ac7086 - refactor(vscode): simplify mention text segmentation (marius-kilocode, 2026-09-18)
- 6d23ba263 - Merge pull request #14277 from Kilo-Org/fix/permission-approval-recovery (Marius, 2026-09-18)
- 4c7d69f78 - refactor(vscode): centralize regex escaping on RegExp.escape (marius-kilocode, 2026-09-18)
- 9ec68b281 - Merge pull request #14274 from Kilo-Org/disable-kilo-folder-creation (Marius, 2026-09-18)
- f6d761e65 - fix(vscode): reconcile aborted permission rule saves (marius-kilocode, 2026-09-18)
- 262d9c89f - Merge remote-tracking branch 'origin/main' into agent-manager-modal-mentions (marius-kilocode, 2026-09-18)
- e0e73218a - Merge pull request #14249 from Kilo-Org/agent-manager-modal-commands (Marius, 2026-09-18)
- 8cb6b91ad - fix(vscode): read git exclude path without unsupported rev-parse flag (marius-kilocode, 2026-09-18)
- 4410c7035 - fix(agent-manager): guard goal Enter submit against IME composition (marius-kilocode, 2026-09-18)
- 0e2f1a5c0 - feat(agent-manager): highlight mentions in the new worktree prompt (marius-kilocode, 2026-09-18)
- fa897b854 - refactor(vscode): simplify stalled permission recovery (marius-kilocode, 2026-09-18)
- 4b8661d83 - fix(agent-manager): submit goal composition with Enter in the new worktree dialog (marius-kilocode, 2026-09-18)
- d16284696 - fix(vscode): keep Agent Manager .kilo out of git in subdirectory workspaces (marius-kilocode, 2026-09-18)
- a3e508f7a - release: v7.7.4 (kilo-maintainer[bot], 2026-09-18)
- d8eaefdf1 - fix(vscode): recover stalled permission approvals (marius-kilocode, 2026-09-18)
- a728fbf8f - feat(cli): log remote session start and end (#14214) (Igor Šćekić, 2026-09-18)
- 864831efa - feat(cli): link GitLab merge requests and Bitbucket pull requests (#14195) (Igor Šćekić, 2026-09-18)
- 7072cfa2c - Merge pull request #14266 from Kilo-Org/jetbrains/release/v7.1.7-rc.2 (Kirill Kalishev, 2026-09-17)
- f5d739c8a - docs(jetbrains): edit changelog for v7.1.7-rc.2 (Kirill Kalishev, 2026-09-17)
- a0a7bf902 - release(jetbrains): v7.1.7-rc.2 (kilo-maintainer[bot], 2026-09-17)
- f4acda10d - Merge pull request #14252 from Kilo-Org/nimble-walrus (Kirill Kalishev, 2026-09-17)
- 0181a58ef - Merge pull request #14255 from Kilo-Org/plucky-otter (Kirill Kalishev, 2026-09-17)
- 303a4fc75 - fix(ci): allow CodeQL Kotlin analysis to finish (kirillk, 2026-09-17)
- a0f726f6e - fix(jetbrains): address marketplace review feedback (kirillk, 2026-09-17)
- dc8e6512d - chore(jetbrains): localize marketplace settings (kirillk, 2026-09-17)
- 566784445 - fix(agent-manager): fold an in-flight walk's paths into the replacement pass when the orphan set grows (kirillk, 2026-09-17)
- 02e698209 - refactor(agent-manager): consolidate orphan cleanup code into dedicated modules (kirillk, 2026-09-17)
- b45bd2b49 - fix(jetbrains): move marketplace links into settings toolbars (kirillk, 2026-09-17)
- 9696b63ea - Merge remote-tracking branch 'origin/main' into nimble-walrus (kirillk, 2026-09-17)
- e695f6355 - chore: retrigger CI (previous push did not fire pull_request/synchronize) (kirillk, 2026-09-17)
- e2de34eb4 - feat(jetbrains): add marketplace shortcuts and clean up session menus (kirillk, 2026-09-17)
- 7ae5cce46 - Merge pull request #14253 from Kilo-Org/gentle-iceberg (Kirill Kalishev, 2026-09-17)
- 53ab56aad - fix(agent-manager): stop a resurrected size from sticking after a folder leaves and rejoins the list (kirillk, 2026-09-17)
- 4515f66a1 - fix(agent-manager): keep leftover folder sizes across a reconcile (kirillk, 2026-09-17)
- 0a5ebf338 - Merge branch 'main' into gentle-iceberg (Kirill Kalishev, 2026-09-17)
- eed37cbcd - fix(agent-manager): stop the leftover folders banner from calculating forever (kirillk, 2026-09-17)
- 780a1c644 - refactor(jetbrains): call page() directly from tests instead of reflection (kirillk, 2026-09-17)
- de7dc52c7 - Merge pull request #14015 from Kilo-Org/fix/more-opencode-headers (Anil Kulkarni, 2026-09-17)
- 7d766e2df - test(jetbrains): cover the board dialog's real lifetime wiring (kirillk, 2026-09-17)
- 311cc6ddd - feat(jetbrains): add settings page shortcuts to the tool window menu (kirillk, 2026-09-17)
- f34a18bf0 - Merge branch 'main' into fix/more-opencode-headers (Anil Kulkarni, 2026-09-17)
- 6562943ee - fix(jetbrains): bound the non-modal swarm board to its session (kirillk, 2026-09-17)
- ac471a49e - Merge remote-tracking branch 'origin/plucky-otter' into plucky-otter (kirillk, 2026-09-17)
- 3da9ff056 - fix(agent-manager): cancel leftover folder sizing on delete and when the set changes (kirillk, 2026-09-17)
- a7470d688 - Merge pull request #14262 from Kilo-Org/investigate-max-variant-not-applied (Marius, 2026-09-17)
- eee5a4864 - feat(jetbrains): make the swarm board non-modal and align its message body (kirillk, 2026-09-17)
- 01aabe961 - fix(jetbrains): drop unreachable filter-revision guard (kirillk, 2026-09-17)
- e4fd9f162 - Merge pull request #14261 from Kilo-Org/chore/dedupe-webview-helpers (Marius, 2026-09-17)
- 7467f7a8a - fix(agent-manager): inherit reasoning variant when a task names the invoking model (marius-kilocode, 2026-09-17)
- 98a5c49f6 - Merge branch 'main' into plucky-otter (Kirill Kalishev, 2026-09-17)
- 12a9a929a - Merge pull request #14259 from Kilo-Org/chore/dedupe-pr-checks-tables (Marius, 2026-09-17)
- 62cdbe45f - Merge pull request #14260 from Kilo-Org/chore/dedupe-diff-helpers (Marius, 2026-09-17)
- 3bd31ac87 - fix(jetbrains): make marketplace list tests headless-safe (kirillk, 2026-09-17)
- 5599e8f83 - Merge pull request #14258 from Kilo-Org/chore/dedupe-opencode-helpers (Marius, 2026-09-17)
- c94db0f47 - Merge pull request #14257 from Kilo-Org/chore/dedupe-spotlight-helpers (Marius, 2026-09-17)
- a5736110f - test(jetbrains): assert the rendered board body, not its source (kirillk, 2026-09-17)
- 21c220a87 - test(vscode): mirror notice contract in diff surface stub (marius-kilocode, 2026-09-17)
- 97e4c394e - refactor(vscode): dedupe webview helpers (marius-kilocode, 2026-09-17)
- ed4ead2d1 - refactor(vscode): keep fileSize in batch module to avoid import cycle (marius-kilocode, 2026-09-17)
- 4a4ed8ab2 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-17)
- 99cf6255e - refactor(agent-manager): reuse the goal composer header in the new worktree dialog (marius-kilocode, 2026-09-17)
- 93658c382 - fix(agent-manager): report leftover folder size honestly when the size walk falls short (kirillk, 2026-09-17)
- 503b86020 - Merge pull request #14248 from Kilo-Org/chore/dedupe-pr-actions-3 (Marius, 2026-09-17)
- d5bee8e8b - refactor(jetbrains): drop unused swarm helpers (kirillk, 2026-09-17)
- e958e11e9 - refactor(vscode): dedupe diff source helpers (marius-kilocode, 2026-09-17)
- 7a0b15185 - Merge pull request #14245 from Kilo-Org/chore/remove-dead-markdown-modules (Marius, 2026-09-17)
- 9a1ef5c0d - Merge pull request #14246 from Kilo-Org/chore/remove-unused-permission-title-keys (Marius, 2026-09-17)
- e3292a8fa - refactor(agent-manager): dedupe pr checks tables (marius-kilocode, 2026-09-17)
- e8e229ddc - fix(jetbrains): address marketplace review findings (kirillk, 2026-09-17)
- 3f9231799 - chore(opencode): drop resolved effect-runner duplication exception (marius-kilocode, 2026-09-17)
- 979472652 - docs(agent-manager): note the two-step goal flow in the changeset (marius-kilocode, 2026-09-17)
- bbf589868 - feat(agent-manager): compose goal objectives in the new worktree dialog (marius-kilocode, 2026-09-17)
- fa6d784d1 - fix(jetbrains): address Kilo Swarm board review feedback (kirillk, 2026-09-17)
- 8ac3a810a - refactor(opencode): dedupe board and effect helpers (marius-kilocode, 2026-09-17)
- a1d4d665c - Merge pull request #14247 from Kilo-Org/chore/remove-webview-dead-leftovers (Marius, 2026-09-17)
- 5b3f89ee7 - refactor: dedupe spotlight error helpers (marius-kilocode, 2026-09-17)
- b434feb61 - fix(agent-manager): share worktree recency with the new worktree dialog list (marius-kilocode, 2026-09-17)
- 49aef1744 - fix(agent-manager): align new worktree mentions with chat reference rules (marius-kilocode, 2026-09-17)
- a8136094d - fix(agent-manager): native checkboxes and collapsible help for leftover worktree dialog (kirillk, 2026-09-17)
- 2d7b53e7d - fix(agent-manager): sync prompt if mention insert skips input event (marius-kilocode, 2026-09-17)
- 4b60c7a86 - refactor(jetbrains): decode marketplace install/remove results via a wire DTO (kirillk, 2026-09-17)
- de6397cb8 - feat(jetbrains): add Kilo Swarm board support (kirillk, 2026-09-17)
- 1f4180d59 - fix(agent-manager): insert mention tokens without clearing native undo (marius-kilocode, 2026-09-17)
- b534dcf47 - fix(agent-manager): type projectId on the command message mirrors (marius-kilocode, 2026-09-17)
- cb0c76cfa - fix(agent-manager): forward projectId for command initial prompts (marius-kilocode, 2026-09-17)
- 9bdd549bd - fix(agent-manager): reset past-chat picker on prompt input (marius-kilocode, 2026-09-17)
- 25ac47733 - feat(jetbrains): add marketplace settings page (kirillk, 2026-09-17)
- b3ef15319 - feat(agent-manager): add @model, @past-chats and @worktrees mentions to New Worktree prompt (marius-kilocode, 2026-09-17)
- d73b5145d - feat(agent-manager): run worktree-independent slash commands from new worktree prompt (marius-kilocode, 2026-09-17)
- 225583c65 - refactor(agent-manager): dedupe pr action helpers (marius-kilocode, 2026-09-17)
- b6801ec08 - chore(vscode): remove unused locals and imports (marius-kilocode, 2026-09-17)
- df11857dd - chore(vscode): remove unused permission title strings (marius-kilocode, 2026-09-17)
- 8dddfabf0 - Merge pull request #14244 from Kilo-Org/chore/remove-dead-agent-manager-members (Marius, 2026-09-17)
- a8a66888a - Merge commit '762778318aeced637db0bfee7981a115d9cb51be' into chore/remove-dead-markdown-modules (marius-kilocode, 2026-09-17)
- 762778318 - Merge pull request #14242 from Kilo-Org/chore/remove-dead-plan-opens (Marius, 2026-09-17)
- 3eab5afb4 - Merge pull request #14243 from Kilo-Org/chore/remove-dead-mermaid-chevron-css (Marius, 2026-09-17)
- b4582fa32 - chore(ui): remove unused incremental markdown and fast-path modules (marius-kilocode, 2026-09-17)
- d43d3ce6e - Merge pull request #14222 from Kilo-Org/fix/sandbox-git-readonly-classifier (Marius, 2026-09-17)
- d89c3fdc0 - chore(agent-manager): remove dead member methods (marius-kilocode, 2026-09-17)
- a5f585812 - Merge pull request #14241 from Kilo-Org/chore/remove-unused-visual-regression-spec (Marius, 2026-09-17)
- 16244ea11 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-17)
- a06a36d7d - docs(cli): explain git short-flag cluster expansion (marius-kilocode, 2026-09-17)
- 57e603175 - test(vscode): cover read branches through createPlanOpener (marius-kilocode, 2026-09-17)
- 6a65bf7eb - Merge pull request #14226 from Kilo-Org/fix/sandbox-escalation-prompt-copy (Marius, 2026-09-17)
- b0caca4ba - chore(ui): remove dead mermaid chevron styles (marius-kilocode, 2026-09-17)
- 91aea98d2 - refactor(cli): simplify git short-flag cluster expansion (marius-kilocode, 2026-09-17)
- 3075130d8 - chore(vscode): remove unused planOpens helper (marius-kilocode, 2026-09-17)
- 406d85511 - chore(vscode): remove unused visual regression spec (marius-kilocode, 2026-09-17)
- 84e6d805e - Merge pull request #14237 from Kilo-Org/profile-session-switch-performance-regression-vsco (Marius, 2026-09-17)
- cad2a69a5 - Merge pull request #14223 from Kilo-Org/fix/plan-guard-readonly-gh (Marius, 2026-09-17)
- 3016563c9 - Merge pull request #14231 from Kilo-Org/brindle-scorpio (Marius, 2026-09-17)
- 74869c883 - fix(cli): recover shared board reads from invalid cursors (#14236) (hdcode.dev, 2026-09-17)
- 4ff396edf - chore: restore diff-panel baseline to main (marius-kilocode, 2026-09-17)
- 0c439cc60 - Revert "test(vscode): quarantine flaky diff width-change scroll check in CI" (marius-kilocode, 2026-09-17)
- a9c06fa50 - Revert "test(vscode): skip flaky diff-panel-with-diffs visual baseline" (marius-kilocode, 2026-09-17)
- 2439f503e - fix(tui): explain sandbox escalation prompts accurately (marius-kilocode, 2026-09-17)
- 6338884ee - Merge pull request #14233 from Kilo-Org/add-mermaid-zoom-and-fullscreen-tools (Marius, 2026-09-17)
- 200859fac - test(vscode): quarantine flaky diff width-change scroll check in CI (marius-kilocode, 2026-09-17)
- c9bb3925c - Merge pull request #14230 from Kilo-Org/efficacious-gymnast (Marius, 2026-09-17)
- 5ee078acc - fix(ui): keep focus trap inside the Mermaid zoom viewer (marius-kilocode, 2026-09-17)
- 6095af2cb - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-17)
- 31bfc440c - refactor(cli): move deferred title orchestration into Kilo code (marius-kilocode, 2026-09-17)
- 367a9cdb5 - fix(cli): expand git short-flag clusters with numeric values (marius-kilocode, 2026-09-17)
- 9d2a46fbc - perf(vscode): cut session switch and send latency in chat transcript (marius-kilocode, 2026-09-17)
- 98b0f6c0f - Merge origin/main into fix/plan-guard-readonly-gh (marius-kilocode, 2026-09-17)
- 12e04e072 - Merge origin/main into fix/sandbox-escalation-prompt-copy (marius-kilocode, 2026-09-17)
- 5c5909c71 - Merge commit '8db973de9bfb4997524e7a1b66867edb53ba01ef' into fix/sandbox-git-readonly-classifier (marius-kilocode, 2026-09-17)
- 4b21e0d3d - Merge commit '8db973de9bfb4997524e7a1b66867edb53ba01ef' into efficacious-gymnast (marius-kilocode, 2026-09-17)
- 935d04af0 - Merge commit '8db973de9bfb4997524e7a1b66867edb53ba01ef' into brindle-scorpio (marius-kilocode, 2026-09-17)
- bebc69c88 - Merge commit '8db973de9bfb4997524e7a1b66867edb53ba01ef' into add-mermaid-zoom-and-fullscreen-tools (marius-kilocode, 2026-09-17)
- 206987083 - fix(ci): bound Zig download to avoid sandbox helper job timeout (marius-kilocode, 2026-09-17)
- 9c29f34ca - fix(ui): address Mermaid zoom viewer review feedback (marius-kilocode, 2026-09-17)
- 6522acae2 - Merge remote-tracking branch 'origin/efficacious-gymnast' into efficacious-gymnast (marius-kilocode, 2026-09-17)
- 267bc9407 - refactor: reuse the request config in Code Mode and test MCP suppression (marius-kilocode, 2026-09-17)
- 4ab5fe935 - fix(cli): tighten session title gate from review (marius-kilocode, 2026-09-17)
- d03213977 - chore(i18n): annotate Mermaid zoom keys in German dictionary (marius-kilocode, 2026-09-17)
- b07646fc0 - feat(vscode): add fullscreen zoom viewer for Mermaid diagrams (marius-kilocode, 2026-09-17)
- 6c1007328 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-17)
- 32aaae25d - fix(cli): harden read-only git classification against masked mutations (marius-kilocode, 2026-09-17)
- 7e0ce5ec6 - feat(cli): defer session title generation (marius-kilocode, 2026-09-17)
- e0dcb0e4e - fix: check network restriction before loading Code Mode (marius-kilocode, 2026-09-17)
- 62e2328b9 - fix: keep kilocode_change markers on Code Mode config hooks (marius-kilocode, 2026-09-17)
- 710762152 - test(vscode): skip flaky diff-panel-with-diffs visual baseline (marius-kilocode, 2026-09-17)
- 773990aa4 - fix(vscode): refine sandbox escalation translations (marius-kilocode, 2026-09-17)
- 6b5e8a04e - feat: add Programmatic Tool Calling experimental setting (marius-kilocode, 2026-09-17)
- 97b786a01 - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-09-17)
- 700345267 - fix(cli): address read-only gh review suggestions (marius-kilocode, 2026-09-17)
- 27ceab798 - fix(vscode): translate sandbox escalation copy into all locales (marius-kilocode, 2026-09-17)
- 15b6b3287 - test(cli): expect Explore to allow read-only gh commands (marius-kilocode, 2026-09-17)
- ecedeea49 - fix(cli): keep gh auth status behind the permission guard (marius-kilocode, 2026-09-17)
- 2da7e2bb7 - fix(cli): check git write flags before read flags in sandbox classifier (marius-kilocode, 2026-09-17)
- 9f45df567 - fix: explain sandbox escalation prompts accurately (marius-kilocode, 2026-09-17)
- 13e05d066 - fix(cli): allow read-only gh commands in the plan guard (marius-kilocode, 2026-09-17)
- f90dc846f - fix(cli): stop escalating read-only git commands in the sandbox (marius-kilocode, 2026-09-17)
- 8bc3e84d2 - fix(agent-manager): make leftover worktree cleanup look native (kirillk, 2026-09-16)
- 4881829c3 - feat: resolve leftover worktree folders from a review dialog (kirillk, 2026-09-16)
- 08c405e50 - fix(docs): use app-relative Link hrefs on 404 page (Emilie Schario, 2026-09-15)
- 8b9c72f5b - fix(docs): add redirects for legacy paths and root llms.txt to fix agent doc discovery (Emilie Schario, 2026-09-15)
- 28379447d - Merge branch 'main' into fix/more-opencode-headers (Anil Kulkarni, 2026-09-14)
- 65511f3b0 - Merge branch 'main' into fix/more-opencode-headers (Anil Kulkarni, 2026-09-11)
- d0f9e8e3e - Merge branch 'main' into fix/more-opencode-headers (Anil Kulkarni, 2026-09-11)
- 12b44cb7c - Pass x-opencode-session for memory, roll-call, and expand-prompt calls (Anil Kulkarni, 2026-09-10)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BoardToolView.kt` (+226, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/TaskToolView.kt` (+1, -15)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt` (+20, -1)
- `packages/opencode/src/kilocode/tool/agent-manager.ts` (+10, -15)
- `packages/opencode/src/kilocode/tool/board.ts` (+6, -13)
- `packages/opencode/src/kilocode/tool/code-mode.ts` (+15, -0)
- `packages/opencode/src/kilocode/tool/host.ts` (+14, -0)
- `packages/opencode/src/kilocode/tool/notebook-host.ts` (+3, -14)
- `packages/opencode/src/kilocode/tool/registry.ts` (+1, -4)
- `packages/opencode/src/tool/registry.ts` (+25, -11)
- `packages/opencode/test/kilocode/tool/shell-unparsed.test.ts` (+6, -0)
- `packages/opencode/test/tool/registry.test.ts` (+55, -0)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/kilocode/agent/index.ts` (+19, -4)
- `packages/opencode/test/agent/plan-mode-subagent-bypass.test.ts` (+5, -2)

#### Permission System (**/permission/)
- `packages/opencode/test/kilocode/permission/gh-readonly.test.ts` (+72, -0)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/kilocode/spotlight.ts` (+2, -2)
- `packages/core/src/v1/config/config.ts` (+4, -0)

#### Other Changes
- `.changeset/disable-kilo-folder-creation.md` (+5, -0)
- `.changeset/fix-stale-reload-status.md` (+0, -6)
- `.changeset/new-worktree-mentions.md` (+5, -0)
- `.changeset/permission-response-recovery.md` (+6, -0)
- `.changeset/remote-speech-to-text.md` (+0, -5)
- `.changeset/worktree-prompt-commands.md` (+5, -0)
- `.github/workflows/codeql-kotlin.yml` (+3, -0)
- `artifacts/glm52-rise-video/package.json` (+1, -1)
- `bun.lock` (+32, -32)
- `package.json` (+1, -1)
- `packages/client/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/httpapi-codegen/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-docs/AGENTS.md` (+1, -1)
- `packages/kilo-docs/next.config.js` (+11, -0)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/404.tsx` (+8, -0)
- `packages/kilo-docs/pages/code-with-ai/agents/chat-interface.md` (+1, -1)
- `packages/kilo-docs/pages/getting-started/settings/index.md` (+2, -2)
- `packages/kilo-docs/pages/getting-started/settings/sandboxing.md` (+20, -0)
- `packages/kilo-docs/previous-docs-redirects.js` (+24, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/full-screen-diff-with-changes-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/readable-chat-420-chromium-linux.png` (+2, -2)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/welcome-with-switcher-and-notification-chromium-linux.png` (+2, -2)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/AGENTS.md` (+16, -0)
- `packages/kilo-jetbrains/CHANGELOG.md` (+27, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendSessionManager.kt` (+80, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/cli/KiloCliDataParser.kt` (+44, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/marketplace/KiloBackendMarketplaceManager.kt` (+289, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloMarketplaceRpcApiImpl.kt` (+27, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloMarketplaceRpcApiProvider.kt` (+15, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloSessionRpcApiImpl.kt` (+9, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorktreeRpcApiImpl.kt` (+252, -8)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/worktree/WorktreeTrash.kt` (+12, -3)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/worktree/orphans/OrphanSize.kt` (+88, -0)
- `packages/kilo-jetbrains/backend/src/main/resources/kilo.jetbrains.backend.xml` (+1, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendAppServiceTest.kt` (+19, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendSessionManagerBoardTest.kt` (+171, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/KiloCliDataParserTest.kt` (+117, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloMarketplaceRpcApiImplTest.kt` (+361, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/KiloWorktreeRpcApiImplTest.kt` (+225, -1)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/testing/MockCliServer.kt` (+38, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/worktree/WorktreeTrashTest.kt` (+23, -0)
- `packages/kilo-jetbrains/frontend/build.gradle.kts` (+4, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/OpenMarketplaceSettingsAction.kt` (+13, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/OpenSettingsAction.kt` (+5, -28)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/OpenSettingsPageAction.kt` (+50, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/OpenUserProfileSettingsAction.kt` (+13, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/actions/ShowSessionBoardAction.kt` (+24, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/AgentManagerPanel.kt` (+9, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/orphans/OrphanBanner.kt` (+214, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/orphans/OrphanDialog.kt` (+351, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/KiloWorktreeService.kt` (+29, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeController.kt` (+12, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/agentManager/worktree/WorktreeDiagnosticsAction.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloMarketplaceService.kt` (+62, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloSessionService.kt` (+9, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionActions.kt` (+9, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/SessionUi.kt` (+122, -2)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/board/BoardAvatars.kt` (+69, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/board/SessionBoardDialog.kt` (+341, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/model/SessionModel.kt` (+10, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/ui/header/SessionHeaderPanel.kt` (+16, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/ViewFactory.kt` (+4, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/board/BoardToolParser.kt` (+100, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/KiloSettingsConfigurable.kt` (+9, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/AgentBehaviorConfigurable.kt` (+4, -35)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/AgentBehaviorSettingsState.kt` (+25, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/AgentBehaviorSettingsUi.kt` (+140, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/AgentsConfigurable.kt` (+5, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/McpConfigurable.kt` (+9, -6)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/SkillsConfigurable.kt` (+6, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/agents/WorkflowsConfigurable.kt` (+2, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/{agents/AgentBehaviorConfigurableBase.kt => base/DirectoryReadyConfigurable.kt}` (+5, -7)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/SettingsListPanel.kt` (+29, -5)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/marketplace/MarketplaceConfigurable.kt` (+18, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/marketplace/MarketplaceInstallDialog.kt` (+339, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/marketplace/MarketplaceLink.kt` (+36, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/marketplace/MarketplaceSettingsUi.kt` (+430, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/UiStyle.kt` (+127, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/ui/list/ActiveListView.kt` (+1, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/kilo.jetbrains.frontend.xml` (+27, -3)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+94, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ar.properties` (+100, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_bs.properties` (+100, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_da.properties` (+100, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_de.properties` (+100, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_es.properties` (+100, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_fr.properties` (+100, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ja.properties` (+100, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ko.properties` (+100, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_nl.properties` (+100, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_no.properties` (+100, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pl.properties` (+100, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_pt_BR.properties` (+100, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_ru.properties` (+100, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_th.properties` (+100, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_tr.properties` (+100, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_uk.properties` (+100, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_CN.properties` (+100, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle_zh_TW.properties` (+100, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/KiloRecoveryActionsTest.kt` (+65, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/actions/SessionContextMenuActionsTest.kt` (+40, -2)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/orphans/OrphanBannerTest.kt` (+259, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/agentManager/orphans/OrphanDialogTest.kt` (+224, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/SessionBoardActionsTest.kt` (+198, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/board/BoardAvatarsTest.kt` (+47, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/board/BoardDialogSizeTest.kt` (+53, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/board/SessionBoardDialogTest.kt` (+364, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/model/SessionModelTest.kt` (+23, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/ui/header/SessionHeaderPanelTest.kt` (+23, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/BoardToolViewTest.kt` (+158, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/session/views/board/BoardToolParserTest.kt` (+180, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/KiloSettingsConfigurableTest.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/AgentBehaviorConfigurableTest.kt` (+6, -24)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/AgentBehaviorSettingsStateTest.kt` (+50, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/AgentBehaviorSettingsUiTest.kt` (+145, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/AgentsSettingsUiTest.kt` (+10, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/McpSettingsUiTest.kt` (+12, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/SettingsToolbarTestUtil.kt` (+34, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/agents/SkillsSettingsUiTest.kt` (+11, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/base/SettingsListViewTest.kt` (+8, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/marketplace/MarketplaceInstallDialogTest.kt` (+383, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/marketplace/MarketplaceSettingsUiTest.kt` (+716, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeAppRpcApi.kt` (+1, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeMarketplaceRpcApi.kt` (+48, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeSessionRpcApi.kt` (+26, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeWorktreeRpcApi.kt` (+34, -1)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloMarketplaceRpcApi.kt` (+29, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloSessionRpcApi.kt` (+17, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloWorktreeRpcApi.kt` (+26, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/BoardDto.kt` (+32, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/KiloAppStateDto.kt` (+4, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/MarketplaceDto.kt` (+57, -0)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/WorktreeDto.kt` (+2, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/orphans/OrphanDto.kt` (+31, -0)
- `packages/kilo-memory/package.json` (+1, -1)
- `packages/kilo-memory/src/effect/capture.ts` (+2, -0)
- `packages/kilo-memory/src/effect/ports.ts` (+1, -0)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/checkbox.css` (+27, -7)
- `packages/kilo-vscode/AGENTS.md` (+1, -1)
- `packages/kilo-vscode/CHANGELOG.md` (+26, -0)
- `packages/kilo-vscode/docs/chat-ui-features/mermaid-diagram-features.md` (+2, -1)
- `packages/kilo-vscode/package.json` (+2, -2)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+18, -27)
- `packages/kilo-vscode/src/agent-manager/GitOps.ts` (+0, -6)
- `packages/kilo-vscode/src/agent-manager/SetupScriptService.ts` (+0, -5)
- `packages/kilo-vscode/src/agent-manager/WorktreeManager.ts` (+64, -16)
- `packages/kilo-vscode/src/agent-manager/WorktreeStateManager.ts` (+0, -5)
- `packages/kilo-vscode/src/agent-manager/host.ts` (+12, -2)
- `packages/kilo-vscode/src/agent-manager/local-diff-batch.ts` (+6, -0)
- `packages/kilo-vscode/src/agent-manager/multi-version.ts` (+8, -1)
- `packages/kilo-vscode/src/agent-manager/orphans/size.ts` (+79, -0)
- `packages/kilo-vscode/src/agent-manager/orphans/sizing.ts` (+174, -0)
- `packages/kilo-vscode/src/agent-manager/pr/PRActions.ts` (+1, -3)
- `packages/kilo-vscode/src/agent-manager/pr/am-pr-utils.ts` (+4, -6)
- `packages/kilo-vscode/src/agent-manager/pr/merge-actions.ts` (+5, -24)
- `packages/kilo-vscode/src/agent-manager/pr/review-actions.ts` (+1, -1)
- `packages/kilo-vscode/src/agent-manager/project/context.ts` (+16, -0)
- `packages/kilo-vscode/src/agent-manager/project/init.ts` (+2, -0)
- `packages/kilo-vscode/src/agent-manager/project/wiring.ts` (+6, -1)
- `packages/kilo-vscode/src/agent-manager/provider-lifecycle.ts` (+24, -0)
- `packages/kilo-vscode/src/agent-manager/provider-multi-version.ts` (+15, -1)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+15, -0)
- `packages/kilo-vscode/src/agent-manager/vscode-host.ts` (+22, -1)
- `packages/kilo-vscode/src/agent-manager/worktree-health.ts` (+3, -1)
- `packages/kilo-vscode/src/agent-manager/worktree-reconcile.ts` (+10, -0)
- `packages/kilo-vscode/src/agent-manager/worktree-recovery.ts` (+104, -21)
- `packages/kilo-vscode/src/commands/toggle-auto-approve.ts` (+1, -1)
- `packages/kilo-vscode/src/diff/sources/git-status.ts` (+11, -13)
- `packages/kilo-vscode/src/diff/sources/staged.ts` (+1, -5)
- `packages/kilo-vscode/src/diff/sources/unstaged.ts` (+1, -5)
- `packages/kilo-vscode/src/kilo-provider/early-message.ts` (+1, -1)
- `packages/kilo-vscode/src/kilo-provider/git-changes-request.ts` (+9, -1)
- `packages/kilo-vscode/src/kilo-provider/handlers/permission-handler.ts` (+21, -43)
- `packages/kilo-vscode/src/shared/pr-comment-actions.ts` (+3, -1)
- `packages/kilo-vscode/src/util/spotlight.ts` (+1, -10)
- `packages/kilo-vscode/tests/fixtures/orphan-help-toggle.tsx` (+33, -0)
- `packages/kilo-vscode/tests/fixtures/transcript-row-handoff.tsx` (+139, -0)
- `packages/kilo-vscode/tests/markdown-incremental-dom.spec.ts` (+0, -208)
- `packages/kilo-vscode/tests/markdown-mermaid.spec.ts` (+22, -0)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+113, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-initial-message.test.ts` (+143, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-new-worktree-command.test.ts` (+89, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-worktree-reference.test.ts` (+26, -1)
- `packages/kilo-vscode/tests/unit/auto-approve.test.ts` (+1, -1)
- `packages/kilo-vscode/tests/unit/browser-automation-chrome-setting.test.ts` (+0, -1)
- `packages/kilo-vscode/tests/unit/diff-preview-request.test.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/escape-regexp.test.ts` (+17, -0)
- `packages/kilo-vscode/tests/unit/file-mention-utils.test.ts` (+44, -0)
- `packages/kilo-vscode/tests/unit/git-ops.test.ts` (+0, -14)
- `packages/kilo-vscode/tests/unit/multi-version.test.ts` (+41, -0)
- `packages/kilo-vscode/tests/unit/open-plan.test.ts` (+19, -34)
- `packages/kilo-vscode/tests/unit/orphan-dialog-logic.test.ts` (+137, -0)
- `packages/kilo-vscode/tests/unit/orphan-help-toggle.test.ts` (+5, -0)
- `packages/kilo-vscode/tests/unit/orphan-size.test.ts` (+94, -0)
- `packages/kilo-vscode/tests/unit/orphan-sizing.test.ts` (+381, -0)
- `packages/kilo-vscode/tests/unit/permission-interceptor.test.ts` (+55, -0)
- `packages/kilo-vscode/tests/unit/permission-recovery.test.ts` (+32, -0)
- `packages/kilo-vscode/tests/unit/sandbox-bootstrap.test.ts` (+1, -1)
- `packages/kilo-vscode/tests/unit/transcript-row-handoff.test.ts` (+8, -0)
- `packages/kilo-vscode/tests/unit/use-file-mention.test.ts` (+53, -0)
- `packages/kilo-vscode/tests/unit/use-slash-command.test.ts` (+7, -2)
- `packages/kilo-vscode/tests/unit/worktree-health.test.ts` (+19, -0)
- `packages/kilo-vscode/tests/unit/worktree-manager.test.ts` (+66, -19)
- `packages/kilo-vscode/tests/unit/worktree-mention.test.ts` (+236, -0)
- `packages/kilo-vscode/tests/unit/worktree-recovery.test.ts` (+140, -4)
- `packages/kilo-vscode/tests/unit/worktree-state-manager.test.ts` (+0, -11)
- `packages/kilo-vscode/tests/visual-regression.spec.mts` (+0, -148)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+5, -7)
- `packages/kilo-vscode/webview-ui/agent-manager/NewWorktreeDialog.tsx` (+227, -8)
- `packages/kilo-vscode/webview-ui/agent-manager/OrphanNotice.tsx` (+0, -80)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectSidebarBody.tsx` (+17, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/SidebarBody.tsx` (+17, -5)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+188, -25)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+27, -7)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+27, -7)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+27, -7)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+27, -7)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+27, -7)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+27, -7)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+27, -7)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fa.ts` (+27, -7)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fr.ts` (+27, -7)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/it.ts` (+27, -7)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ja.ts` (+27, -7)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ko.ts` (+27, -7)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/nl.ts` (+27, -7)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/no.ts` (+27, -7)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/pl.ts` (+27, -7)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ru.ts` (+27, -7)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/th.ts` (+27, -7)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/tr.ts` (+27, -8)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/uk.ts` (+27, -7)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zh.ts` (+27, -6)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zht.ts` (+27, -6)
- `packages/kilo-vscode/webview-ui/agent-manager/initial-message.ts` (+68, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/new-worktree-command.ts` (+89, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/orphans/OrphanDialog.tsx` (+220, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/orphans/OrphanNotice.tsx` (+56, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/orphans/dialog-logic.ts` (+68, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/PRChecks.tsx` (+3, -57)
- `packages/kilo-vscode/webview-ui/agent-manager/pr/diff-comment-forms.tsx` (+2, -6)
- `packages/kilo-vscode/webview-ui/agent-manager/worktree-mention.ts` (+418, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/worktree-references.ts` (+23, -0)
- `packages/kilo-vscode/webview-ui/diff-viewer/DiffViewerApp.tsx` (+2, -9)
- `packages/kilo-vscode/webview-ui/diff-viewer/comments-github.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+31, -24)
- `packages/kilo-vscode/webview-ui/src/components/chat/PermissionDock.tsx` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+21, -13)
- `packages/kilo-vscode/webview-ui/src/components/chat/prompt-rail.ts` (+1, -4)
- `packages/kilo-vscode/webview-ui/src/components/chat/transcript-row-handoff.ts` (+40, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/transcript-search-text.ts` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/components/settings/ExperimentalTab.tsx` (+13, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/ProvidersTab.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/components/shared/SandboxButton.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/context/session-types.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+8, -4)
- `packages/kilo-vscode/webview-ui/src/hooks/file-mention-utils.ts` (+30, -0)
- `packages/kilo-vscode/webview-ui/src/hooks/useFileMention.ts` (+10, -3)
- `packages/kilo-vscode/webview-ui/src/hooks/useSlashCommand.ts` (+5, -2)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+9, -17)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+9, -17)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+9, -17)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+9, -17)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+9, -17)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+9, -17)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+9, -17)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+9, -17)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+9, -17)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+9, -17)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+9, -17)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+9, -17)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+9, -17)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+9, -17)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+9, -17)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+9, -17)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+9, -17)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+9, -18)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+9, -17)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+8, -17)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+8, -17)
- `packages/kilo-vscode/webview-ui/src/types/messages/config.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+7, -1)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/utils/escape-regexp.ts` (+10, -0)
- `packages/kilo-vscode/webview-ui/src/utils/open-plan.ts` (+0, -4)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+26, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/acp/permission.ts` (+1, -1)
- `packages/opencode/src/cli/cmd/remote.ts` (+13, -2)
- `packages/opencode/src/cli/cmd/run/permission.shared.ts` (+9, -4)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+111, -14)
- `packages/opencode/src/kilo-sessions/pr-link.ts` (+206, -34)
- `packages/opencode/src/kilo-sessions/remote-sender.ts` (+32, -5)
- `packages/opencode/src/kilo-sessions/remote-session-log.ts` (+69, -0)
- `packages/opencode/src/kilocode/board/context.ts` (+1, -6)
- `packages/opencode/src/kilocode/board/enabled.ts` (+4, -0)
- `packages/opencode/src/kilocode/board/store.ts` (+17, -3)
- `packages/opencode/src/kilocode/cli/cmd/roll-call.ts` (+5, -2)
- `packages/opencode/src/kilocode/enhance-prompt.ts` (+5, -0)
- `packages/opencode/src/kilocode/memory/ports.ts` (+5, -1)
- `packages/opencode/src/kilocode/provider/opencode-session-headers.ts` (+16, -0)
- `packages/opencode/src/kilocode/sandbox/git.ts` (+183, -21)
- `packages/opencode/src/kilocode/session/title.ts` (+196, -0)
- `packages/opencode/src/session/prompt.ts` (+9, -27)
- `packages/opencode/src/session/tools.ts` (+3, -7)
- `packages/opencode/test/cli/run/permission.shared.test.ts` (+7, -2)
- `packages/opencode/test/kilocode/agent-manager-tool.test.ts` (+10, -0)
- `packages/opencode/test/kilocode/ask-agent-permissions.test.ts` (+3, -3)
- `packages/opencode/test/kilocode/board-context.test.ts` (+12, -8)
- `packages/opencode/test/kilocode/board-live.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/board-tools.test.ts` (+73, -2)
- `packages/opencode/test/kilocode/board/store.test.ts` (+8, -2)
- `packages/opencode/test/kilocode/kilo-sessions.test.ts` (+441, -36)
- `packages/opencode/test/kilocode/memory/memory-ports.test.ts` (+42, -4)
- `packages/opencode/test/kilocode/provider/opencode-session-headers.test.ts` (+24, -0)
- `packages/opencode/test/kilocode/sandbox/git.test.ts` (+111, -25)
- `packages/opencode/test/kilocode/sandbox/session-tools.test.ts` (+39, -0)
- `packages/opencode/test/kilocode/session-prompt-permission-refresh.test.ts` (+7, -1)
- `packages/opencode/test/kilocode/session/title.test.ts` (+115, -0)
- `packages/opencode/test/kilocode/sessions/ensure-title-mark.test.ts` (+89, -34)
- `packages/opencode/test/kilocode/sessions/pr-link.test.ts` (+427, -1)
- `packages/opencode/test/kilocode/sessions/remote-session-log.test.ts` (+335, -0)
- `packages/opencode/test/kilocode/snapshot-prepare.test.ts` (+12, -4)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/protocol/package.json` (+1, -1)
- `packages/schema/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk-next/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+3, -2)
- `packages/sdk/js/src/kilocode/permission.ts` (+71, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+1, -0)
- `packages/sdk/js/test/kilocode/permission.test.ts` (+154, -0)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/storybook/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/tui/src/routes/session/permission.tsx` (+12, -2)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/components/markdown.tsx` (+13, -1)
- `packages/ui/src/i18n/ar.ts` (+4, -0)
- `packages/ui/src/i18n/br.ts` (+4, -0)
- `packages/ui/src/i18n/bs.ts` (+4, -0)
- `packages/ui/src/i18n/da.ts` (+4, -0)
- `packages/ui/src/i18n/de.ts` (+4, -0)
- `packages/ui/src/i18n/en.ts` (+4, -0)
- `packages/ui/src/i18n/es.ts` (+4, -0)
- `packages/ui/src/i18n/fr.ts` (+4, -0)
- `packages/ui/src/i18n/it.ts` (+4, -0)
- `packages/ui/src/i18n/ja.ts` (+4, -0)
- `packages/ui/src/i18n/ko.ts` (+4, -0)
- `packages/ui/src/i18n/nl.ts` (+4, -0)
- `packages/ui/src/i18n/no.ts` (+4, -0)
- `packages/ui/src/i18n/pl.ts` (+4, -0)
- `packages/ui/src/i18n/ru.ts` (+4, -0)
- `packages/ui/src/i18n/th.ts` (+4, -0)
- `packages/ui/src/i18n/tr.ts` (+4, -0)
- `packages/ui/src/i18n/uk.ts` (+4, -0)
- `packages/ui/src/i18n/zh.ts` (+4, -0)
- `packages/ui/src/i18n/zht.ts` (+4, -0)
- `packages/ui/src/kilocode/markdown-bidi.test.ts` (+2, -1)
- `packages/ui/src/kilocode/markdown-fast-path.ts` (+0, -29)
- `packages/ui/src/kilocode/markdown-incremental-dom.ts` (+0, -128)
- `packages/ui/src/kilocode/markdown-mermaid.css` (+0, -72)
- `packages/ui/src/kilocode/{ => mermaid}/markdown-mermaid-actions.tsx` (+29, -3)
- `packages/ui/src/kilocode/{ => mermaid}/markdown-mermaid-data-url.test.ts` (+0, -0)
- `packages/ui/src/kilocode/{ => mermaid}/markdown-mermaid-data-url.ts` (+0, -0)
- `packages/ui/src/kilocode/mermaid/markdown-mermaid-zoom-state.test.ts` (+34, -0)
- `packages/ui/src/kilocode/mermaid/markdown-mermaid-zoom-state.ts` (+19, -0)
- `packages/ui/src/kilocode/mermaid/markdown-mermaid-zoom.tsx` (+243, -0)
- `packages/ui/src/kilocode/mermaid/markdown-mermaid.css` (+178, -0)
- `packages/ui/src/kilocode/{ => mermaid}/markdown-mermaid.stories.tsx` (+1, -1)
- `packages/ui/src/kilocode/{ => mermaid}/markdown-mermaid.ts` (+20, -1)
- `packages/ui/src/styles/index.css` (+1, -1)
- `script/check-opencode-promise-facades.ts` (+5, -2)
- `script/kilocode-duplication-allowlist.json` (+0, -12)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 70de232b1..85e59d136 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.7.3",
+  "version": "7.7.4",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/kilocode/spotlight.ts
```diff
diff --git a/packages/core/src/kilocode/spotlight.ts b/packages/core/src/kilocode/spotlight.ts
index ce6e49436..c15b59c62 100644
--- a/packages/core/src/kilocode/spotlight.ts
+++ b/packages/core/src/kilocode/spotlight.ts
@@ -3,12 +3,12 @@ import path from "path"
 
 const marker = ".metadata_never_index"
 
-function exists(err: unknown): boolean {
+export function exists(err: unknown): boolean {
   if (typeof err !== "object" || err === null) return false
   return "code" in err && err.code === "EEXIST"
 }
 
-function message(err: unknown): string {
+export function message(err: unknown): string {
   if (err instanceof Error) return err.message
   return String(err)
 }
```

#### packages/core/src/v1/config/config.ts
```diff
diff --git a/packages/core/src/v1/config/config.ts b/packages/core/src/v1/config/config.ts
index da2061b0d..8a2c01934 100644
--- a/packages/core/src/v1/config/config.ts
+++ b/packages/core/src/v1/config/config.ts
@@ -314,6 +314,10 @@ export const Info = Schema.Struct({
       task_model_selection: Schema.optional(Schema.Boolean).annotate({
         description: "Allow task subagents to select a model, provider, and reasoning effort",
       }),
+      code_mode: Schema.optional(Schema.Boolean).annotate({
+        description:
+          "Route MCP tool calls through a confined JavaScript runtime with on-demand tool discovery instead of exposing every MCP tool directly",
+      }),
       speech_to_text_model: Schema.optional(Schema.String).annotate({
         description: "Speech-to-text transcription model ID to use for voice input",
       }),
```

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BoardToolView.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BoardToolView.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BoardToolView.kt
new file mode 100644
index 000000000..d8d54a702
--- /dev/null
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BoardToolView.kt
@@ -0,0 +1,226 @@
+package ai.kilocode.client.session.views.tool
+
+import ai.kilocode.client.session.model.Content
+import ai.kilocode.client.session.model.Tool
+import ai.kilocode.client.session.ui.popup.HeaderPopupRequest
+import ai.kilocode.client.session.ui.selection.SessionSelection
+import ai.kilocode.client.session.ui.style.SessionEditorStyle
+import ai.kilocode.client.session.ui.style.SessionUiStyle
+import ai.kilocode.client.session.views.TrackPanel
+import ai.kilocode.client.session.views.base.AbstractSessionPartView
+import ai.kilocode.client.session.views.board.BoardResult
+import ai.kilocode.client.session.views.board.BoardToolParser
+import ai.kilocode.client.session.views.board.boardMarkdown
+import ai.kilocode.client.ui.UiStyle
+import ai.kilocode.client.ui.md.MdView
+import ai.kilocode.client.ui.md.MdViewFactory
+import com.intellij.openapi.util.Disposer
+import com.intellij.ui.components.JBLabel
+import com.intellij.ui.components.JBScrollPane
+import com.intellij.util.concurrency.annotations.RequiresEdt
+import com.intellij.util.ui.JBUI
+import java.awt.BorderLayout
+import java.awt.Dimension
+import javax.swing.JPanel
+import javax.swing.ScrollPaneConstants
+
+/**
+ * Renders `board_post` / `board_read` shared-agent-board tool calls as a route/message card
+ * instead of the generic [ToolView]'s raw JSON body. Falls back to [ToolView] while the tool is
+ * pending/running, and whenever the output cannot be parsed by [BoardToolParser].
+ */
+class BoardToolView(
+    tool: Tool,
+    private val selection: SessionSelection? = null,
+    private val parts: ToolParts = toolParts(tool),
+    private val footer: ToolApprovalFooter = ToolApprovalFooter(),
+    private val bodyHolder: BoardBody = BoardBody(),
+) : AbstractSessionPartView(parts.header, { bodyHolder.pane(selection, parts.glyph) }, { footer }), ApprovalReasonTarget {
+
+    companion object {
+        fun canRender(content: Tool): Boolean =
+            (content.name == "board_post" || content.name == "board_read") && BoardToolParser.parse(content) != null
+    }
+
```

#### packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/TaskToolView.kt
```diff
diff --git a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/TaskToolView.kt b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/TaskToolView.kt
index c0453cfd8..2f86568b8 100644
--- a/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/TaskToolView.kt
+++ b/packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/TaskToolView.kt
@@ -369,7 +369,7 @@ private class TaskBody(glyph: JBLabel) {
         override fun updateUI() {
             super.updateUI()
             background = SessionUiStyle.Colors.codeBlockBackground()
-            border = taskBodyBorder(glyph)
+            border = toolBodyBorder(glyph)
         }
     }.apply {
         add(rows, BorderLayout.CENTER)
@@ -418,20 +418,6 @@ private fun rowTitleColor(tool: Tool) = if (tool.state == ToolExecState.ERROR) {
     SessionUiStyle.Text.Secondary.foreground()
 }
 
-private fun taskBodyBorder(glyph: JBLabel) = run {
-    val width = maxOf(
-        glyph.preferredSize.width,
-        glyph.icon?.iconWidth ?: 0,
-        JBUI.scale(SessionUiStyle.View.Layout.HORIZONTAL_PADDING),
-    )
-    JBUI.Borders.empty(
-        UiStyle.Gap.sm(),
-        width + JBUI.scale(SessionUiStyle.View.Layout.GAP) + UiStyle.Gap.md(),
-        UiStyle.Gap.sm(),
-        UiStyle.Gap.md(),
-    )
-}
-
 private fun agentTitle(tool: Tool): String {
     val type = tool.input["subagent_type"]?.takeIf { it.isNotBlank() } ?: tool.name
     return KiloBundle.message("session.part.tool.agent", type.replaceFirstChar { it.titlecase() })
```


*... and more files (showing first 5)*

## opencode Changes (5a83358..3dd1b30)

### Commits

- 3dd1b30 - docs: restore GPT-5.6 Sol pricing (#49724) (Jack, 2026-09-18)
- e80db11 - chore: generate (opencode-agent[bot], 2026-09-18)
- a7f2373 - chore(go): retire Union Alpha (#49718) (Jack, 2026-09-18)
- b02acc1 - chore(stats): update GitHub star fallback (#49654) (opencode-agent[bot], 2026-09-17)

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
- `packages/console/app/src/component/go-models.ts` (+0, -9)
- `packages/console/app/src/component/limits-graph.css` (+0, -5)
- `packages/console/app/src/component/limits-graph.tsx` (+17, -55)
- `packages/console/app/src/config.ts` (+2, -2)
- `packages/console/app/src/i18n/ar.ts` (+1, -2)
- `packages/console/app/src/i18n/br.ts` (+1, -2)
- `packages/console/app/src/i18n/da.ts` (+1, -2)
- `packages/console/app/src/i18n/de.ts` (+1, -2)
- `packages/console/app/src/i18n/en.ts` (+1, -2)
- `packages/console/app/src/i18n/es.ts` (+1, -2)
- `packages/console/app/src/i18n/fr.ts` (+1, -2)
- `packages/console/app/src/i18n/it.ts` (+1, -2)
- `packages/console/app/src/i18n/ja.ts` (+1, -2)
- `packages/console/app/src/i18n/ko.ts` (+1, -2)
- `packages/console/app/src/i18n/no.ts` (+1, -2)
- `packages/console/app/src/i18n/pl.ts` (+1, -2)
- `packages/console/app/src/i18n/ru.ts` (+1, -2)
- `packages/console/app/src/i18n/th.ts` (+1, -2)
- `packages/console/app/src/i18n/tr.ts` (+1, -2)
- `packages/console/app/src/i18n/uk.ts` (+1, -2)
- `packages/console/app/src/i18n/zh.ts` (+1, -2)
- `packages/console/app/src/i18n/zht.ts` (+1, -2)
- `packages/console/app/src/routes/go/index.tsx` (+1, -2)
- `packages/console/app/src/routes/workspace/[id]/go/lite-section.tsx` (+1, -2)
- `packages/stats/app/src/routes/stats-shell.tsx` (+1, -1)
- `packages/web/src/content/docs/ar/go.mdx` (+0, -5)
- `packages/web/src/content/docs/ar/zen.mdx` (+2, -7)
- `packages/web/src/content/docs/bs/go.mdx` (+0, -5)
- `packages/web/src/content/docs/bs/zen.mdx` (+2, -7)
- `packages/web/src/content/docs/da/go.mdx` (+0, -5)
- `packages/web/src/content/docs/da/zen.mdx` (+2, -7)
- `packages/web/src/content/docs/de/go.mdx` (+0, -5)
- `packages/web/src/content/docs/de/zen.mdx` (+2, -7)
- `packages/web/src/content/docs/es/go.mdx` (+0, -5)
- `packages/web/src/content/docs/es/zen.mdx` (+2, -7)
- `packages/web/src/content/docs/fr/go.mdx` (+0, -5)
- `packages/web/src/content/docs/fr/zen.mdx` (+2, -7)
- `packages/web/src/content/docs/go.mdx` (+0, -5)
- `packages/web/src/content/docs/it/go.mdx` (+38, -43)
- `packages/web/src/content/docs/it/zen.mdx` (+2, -7)
- `packages/web/src/content/docs/ja/go.mdx` (+0, -5)
- `packages/web/src/content/docs/ja/zen.mdx` (+2, -7)
- `packages/web/src/content/docs/ko/go.mdx` (+0, -5)
- `packages/web/src/content/docs/ko/zen.mdx` (+2, -7)
- `packages/web/src/content/docs/nb/go.mdx` (+0, -5)
- `packages/web/src/content/docs/nb/zen.mdx` (+2, -7)
- `packages/web/src/content/docs/pl/go.mdx` (+38, -43)
- `packages/web/src/content/docs/pl/zen.mdx` (+2, -7)
- `packages/web/src/content/docs/pt-br/go.mdx` (+0, -5)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+2, -7)
- `packages/web/src/content/docs/ru/go.mdx` (+38, -43)
- `packages/web/src/content/docs/ru/zen.mdx` (+2, -7)
- `packages/web/src/content/docs/th/go.mdx` (+0, -5)
- `packages/web/src/content/docs/th/zen.mdx` (+2, -7)
- `packages/web/src/content/docs/tr/go.mdx` (+0, -5)
- `packages/web/src/content/docs/tr/zen.mdx` (+2, -7)
- `packages/web/src/content/docs/zen.mdx` (+2, -7)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+0, -5)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+2, -7)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+0, -5)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+2, -7)

### Key Diffs

(no key diffs to show)

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/kilocode/agent/index.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/test/agent/plan-mode-subagent-bypass.test.ts
- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/src/kilocode/spotlight.ts
- `src/core/` - review core changes from packages/core/src/v1/config/config.ts
- `src/permission/` - review permission changes from packages/opencode/test/kilocode/permission/gh-readonly.test.ts
- `src/tool/BoardToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/BoardToolView.kt changes
- `src/tool/TaskToolView.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/TaskToolView.kt changes
- `src/tool/ToolSupport.kt.ts` - update based on kilocode packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/session/views/tool/ToolSupport.kt changes
- `src/tool/agent-manager.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager.ts changes
- `src/tool/board.ts` - update based on kilocode packages/opencode/src/kilocode/tool/board.ts changes
- `src/tool/code-mode.ts` - update based on kilocode packages/opencode/src/kilocode/tool/code-mode.ts changes
- `src/tool/host.ts` - update based on kilocode packages/opencode/src/kilocode/tool/host.ts changes
- `src/tool/notebook-host.ts` - update based on kilocode packages/opencode/src/kilocode/tool/notebook-host.ts changes
- `src/tool/registry.test.ts` - update based on kilocode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/kilocode/tool/registry.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
- `src/tool/shell-unparsed.test.ts` - update based on kilocode packages/opencode/test/kilocode/tool/shell-unparsed.test.ts changes
