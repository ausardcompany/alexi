# Upstream Changes Report
Generated: 2026-07-04 08:38:07

## Summary
- kilocode: 101 commits, 165 files changed
- opencode: 24 commits, 71 files changed

## kilocode Changes (4c07a1db5..1fc8f066f)

### Commits

- 1fc8f066f - Merge pull request #11506 from mvanhorn/fix/11480-tui-live-spent-cost (Catriel Müller, 2026-07-03)
- da84f24b6 - Merge pull request #11559 from IamCoder18/fix/console-profile-external-link-icons (Catriel Müller, 2026-07-03)
- 19e48a6ba - Merge pull request #11561 from IamCoder18/trusting-property (Catriel Müller, 2026-07-03)
- 545fea5a3 - Merge branch 'main' into trusting-property (Catriel Müller, 2026-07-03)
- 419ff008e - Merge pull request #11564 from IamCoder18/superficial-chimpanzee (Catriel Müller, 2026-07-03)
- 4ed43ab7c - release: v7.4.1 (kilo-maintainer[bot], 2026-07-03)
- 79f5ab59c - Merge branch 'main' into superficial-chimpanzee (Catriel Müller, 2026-07-03)
- e79b75126 - fix(vscode): include kilo-sandbox-mutation-worker.js in extension bundle (#11926) (Trim21, 2026-07-03)
- 771f8c880 - Merge pull request #11923 from Kilo-Org/fix/11903-subagent-permission-hang (Marius, 2026-07-03)
- b05cbcaca - fix(cli): reject subagent asks over the wire for daemon and attach runs (marius-kilocode, 2026-07-03)
- 2799ba638 - Merge pull request #11924 from Kilo-Org/fix-worktree-reasoning-selector (Marius, 2026-07-03)
- 1755f567f - fix(agent-manager): apply reasoning-variant and mode picks in worktree dialog (marius-kilocode, 2026-07-03)
- fda4e1756 - fix(cli): fail headless subagent permission asks instead of hanging (marius-kilocode, 2026-07-03)
- 06af46648 - Merge pull request #11918 from mjnaderi/feat/prompt-input-rtl-support (Marius, 2026-07-03)
- 51e45d7fb - Merge pull request #11887 from Kilo-Org/mark/harden-allow-everything-auth (Marius, 2026-07-03)
- 9f290824c - chore: remove stray unreferenced files (#11917) (Marius, 2026-07-03)
- c78d44a14 - release: v7.4.0 (kilo-maintainer[bot], 2026-07-03)
- fcc1b6433 - Merge branch 'main' into mark/harden-allow-everything-auth (Marius, 2026-07-03)
- 4e4e41f6c - feat(vscode): support bidirectional prompt input (Mohammad Javad Naderi, 2026-07-03)
- 4a5a6adf8 - refactor(cli): move TUI worker auth derivation into kilo mirror module (marius-kilocode, 2026-07-03)
- 0c1a7cee9 - fix(vscode): remove balance chip from session header (#11915) (Johnny Eric Amancio, 2026-07-03)
- c993b645b - Merge pull request #11898 from Kilo-Org/alluring-flyingfish (Marius, 2026-07-03)
- abe2f8e6e - Merge origin/main into alluring-flyingfish (marius-kilocode, 2026-07-03)
- c0b128f30 - Merge pull request #11913 from Kilo-Org/understood-meerkat (Marius, 2026-07-03)
- 5c4ce7251 - fix(vscode): share model picker expand state across webviews (#11910) (Johnny Eric Amancio, 2026-07-03)
- c36c293f3 - fix(cli): resolve plan_exit to the plan file actually saved (#11896) (Johnny Eric Amancio, 2026-07-03)
- 63255595c - Merge pull request #11912 from Kilo-Org/exuberant-archer (Marius, 2026-07-03)
- 70a002da4 - fix(test): make tool/shell.test.ts deterministic (fast commands lost output) (marius-kilocode, 2026-07-03)
- 1f80fdff4 - feat(cli): persist /sandbox toggle across new sessions (marius-kilocode, 2026-07-03)
- bd8a22be0 - Merge pull request #11906 from Kilo-Org/christiaan/claude-adaptive (Christiaan Arnoldus, 2026-07-03)
- df55ff2b2 - Update Requesty setup instructions for VSCode (#11888) (Michael Schaal, 2026-07-03)
- 558e5ba33 - Merge pull request #11908 from Kilo-Org/docs/fix-openrouter-provider-routing-link (Marius, 2026-07-03)
- 69ee5798e - docs: fix broken OpenRouter provider routing link (marius-kilocode, 2026-07-03)
- 0cd75205f - Merge pull request #11442 from IamCoder18/vscode/cleanup-drafts-on-session-delete (Marius, 2026-07-03)
- 1d3a9e032 - chore(cli): add adaptive reasoning changeset (chrarnoldus, 2026-07-03)
- 30acec765 - refactor(vscode): reduce diff noise vs main (marius-kilocode, 2026-07-03)
- 33206d72e - refactor(vscode): compact session delete cleanup to satisfy max-lines (marius-kilocode, 2026-07-03)
- d650fb507 - Merge origin/main into vscode/cleanup-drafts-on-session-delete (marius-kilocode, 2026-07-03)
- a8d9cff0e - Merge pull request #11891 from Kilo-Org/caramel-turner (Marius, 2026-07-03)
- 3795ae02f - fix(vscode): clear cloud preview state on import failure using raw session id (marius-kilocode, 2026-07-03)
- 73455d93f - Merge pull request #11741 from Kilo-Org/feat/agent-manager-branch-naming (Marius, 2026-07-03)
- a0a6a29e3 - fix(cli): skip summary messages for reported context cap (marius-kilocode, 2026-07-03)
- daca72c12 - Simplify (Christiaan Arnoldus, 2026-07-03)
- a909efe24 - test(cli): cover provider-reported context output cap (marius-kilocode, 2026-07-03)
- 9066bac14 - Merge remote-tracking branch 'origin/main' into caramel-turner (marius-kilocode, 2026-07-03)
- ca055f0bf - feat(cli): cap output from provider-reported context (marius-kilocode, 2026-07-03)
- b0f90c00e - Add Fable and Sonnet 5 as adaptive reasoning models (Christiaan Arnoldus, 2026-07-03)
- 803de4ddf - Merge branch 'main' into feat/agent-manager-branch-naming (Marius, 2026-07-03)
- 067fcf51f - fix(cli): keep sandbox disabled by default (marius-kilocode, 2026-07-02)
- dacafc36c - test(cli): update allow everything exerciser expectation (Mark IJbema, 2026-07-02)
- 9857c9861 - fix(cli): preserve output capacity for encoded image requests (marius-kilocode, 2026-07-02)
- 5a916f34e - test(cli): update daemon auth fixtures (Mark IJbema, 2026-07-02)
- fed1e5ef9 - fix(cli): annotate allow everything auth guard (Mark IJbema, 2026-07-02)
- 51dc18968 - fix(cli): require auth for allow everything endpoint (Mark IJbema, 2026-07-02)
- 8f251ade0 - style(vscode): fix Prettier formatting in KiloProvider.ts (Aarav Sharma, 2026-06-30)
- 14f6f2dfc - test(vscode): exercise clearIfOn helper instead of source-grep (Aarav Sharma, 2026-06-30)
- 80a8ee08a - fix(vscode): restore prompt-send contract shapes after cloud-prune refactor (Aarav Sharma, 2026-06-30)
- e4f98cacb - fix(vscode): move createCloudPrune inside SessionProvider (Aarav Sharma, 2026-06-30)
- 5eabe9397 - refactor(vscode): extract cloud-prune helpers and compact session.tsx (Aarav Sharma, 2026-06-30)
- 9d3b1508c - Merge remote-tracking branch 'upstream/main' into vscode/cleanup-drafts-on-session-delete (Aarav Sharma, 2026-06-30)
- 37bbbd02d - fix(vscode): order loading clear before cloudPreviewId clear on failure (Aarav Sharma, 2026-06-30)
- 57c09d2e9 - fix(vscode): guard loading clear on cloud import failure (Aarav Sharma, 2026-06-30)
- 733d11d22 - fix(vscode): guard cloudPreviewId clear on cloud import failure (Aarav Sharma, 2026-06-30)
- 12ee9ef7e - fix(vscode): guard currentSessionID clear on cloud import failure (Aarav Sharma, 2026-06-30)
- 0c9118334 - fix(vscode): guard draftSessionID clear on cloud import failure (Aarav Sharma, 2026-06-30)
- b9febc69a - fix(vscode): clear draftSessionID on cloudSessionImportFailed (Aarav Sharma, 2026-06-30)
- a63517e54 - fix(vscode): migrate draftSessionID and prune cloud parts on import (Aarav Sharma, 2026-06-30)
- 0601898e3 - fix(vscode): reset userClearedSession on cloud session select and import (Aarav Sharma, 2026-06-30)
- a61ecad9d - Merge branch 'main' into feat/agent-manager-branch-naming (Marius, 2026-06-29)
- e26a01a9f - Merge branch 'main' into feat/agent-manager-branch-naming (Marius, 2026-06-29)
- 898c39a0e - fix(agent-manager): harden branch name parsing (marius-kilocode, 2026-06-29)
- 6aa09117c - fix(agent-manager): preserve branch naming retries (marius-kilocode, 2026-06-29)
- 48df944a4 - fix(agent-manager): refine automatic branch naming (marius-kilocode, 2026-06-29)
- 390a9e9f7 - Merge branch 'main' into feat/agent-manager-branch-naming (Marius, 2026-06-29)
- 2ffbfa034 - fix(agent-manager): scope branch naming to sessions (marius-kilocode, 2026-06-29)
- 536f278f8 - Merge branch 'main' into feat/agent-manager-branch-naming (Marius, 2026-06-29)
- 0f43e2e08 - feat(agent-manager): generate task-focused branch names (Marius, 2026-06-26)
- 74f9bf6aa - Merge branch 'main' into vscode/cleanup-drafts-on-session-delete (Aarav, 2026-06-24)
- b36b740b7 - fix(vscode): clear userClearedSession when user starts a new draft from :new (Aarav Sharma, 2026-06-23)
- 409ea5fe9 - docs(changeset): note mid-send restore recovery in cleanup-drafts changeset (Aarav Sharma, 2026-06-23)
- 1974ddc2a - fix(vscode): early-return restoreFailed when user explicitly cleared session (Aarav Sharma, 2026-06-23)
- 68f70e256 - fix(vscode): suppress :new restoreFailed candidate after user-initiated clear (Aarav Sharma, 2026-06-23)
- 454d35c2a - fix(vscode): accept :new as restoreFailed candidate when user is back in empty state (Aarav Sharma, 2026-06-23)
- 9fc017c63 - fix(vscode): only restore failed draft into buckets the send was scoped to (Aarav Sharma, 2026-06-23)
- 2a3f0b02f - fix(vscode): restore failed draft into current bucket, not stale session (Aarav Sharma, 2026-06-23)
- 2db993445 - Merge branch 'main' into vscode/cleanup-drafts-on-session-delete (Aarav, 2026-06-23)
- fbe5f4cbf - fix(vscode): recover from external session deletes during send (Aarav Sharma, 2026-06-23)
- 666a15a2e - Merge branch 'main' into superficial-chimpanzee (Aarav, 2026-06-22)
- 6be4c0df8 - feat(kilo-console): align fonts with Kilo Cloud (Aarav Sharma, 2026-06-22)
- 9d9a2fe2c - Merge branch 'main' into fix/console-profile-external-link-icons (Aarav, 2026-06-22)
- b2db7a413 - fix(console): show real Kilo logo in navbar (Aarav Sharma, 2026-06-22)
- 2851bc5ef - fix(console): show external link icon on profile sidebar shortcuts (Aarav Sharma, 2026-06-22)
- 5135d2e24 - fix: TUI live spent shows real session cost instead of $0.00 (Matt Van Horn, 2026-06-20)
- faa47d0a8 - fix(vscode): drop sessionStatusMap and respondingPermissions on delete (Aarav Sharma, 2026-06-19)
- 8b7f1aba8 - merge: upstream main into vscode/cleanup-drafts-on-session-delete (Aarav Sharma, 2026-06-19)
- 67691a235 - fix(vscode): prune per-session state on every deletion path (Aarav Sharma, 2026-06-19)
- d4be9ec19 - fix(vscode): don't re-track deleted sessions and purge per-session model state (Aarav Sharma, 2026-06-19)
- 152cf66b6 - fix(vscode): forward external session deletions and decouple draft id clear (Aarav Sharma, 2026-06-19)
- f310d46c8 - Merge branch 'main' into vscode/cleanup-drafts-on-session-delete (Aarav, 2026-06-18)
- 494817da2 - fix(vscode): prevent draftKey effect from recreating deleted-session drafts (Aarav Sharma, 2026-06-18)
- 5df7aa4f9 - fix(vscode): clear unsent drafts on session deletion (Aarav Sharma, 2026-06-18)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/plan.ts` (+19, -1)
- `packages/opencode/src/tool/shell.ts` (+8, -2)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
- `packages/opencode/src/kilocode/permission/headless.ts` (+45, -0)
- `packages/opencode/src/permission/index.ts` (+7, -0)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)
- `packages/core/src/cross-spawn-spawner.ts` (+4, -2)
- `packages/core/src/kilocode/stdio-tap.ts` (+34, -0)

#### Other Changes
- `.changeset/console-navbar-kilo-logo.md` (+5, -0)
- `.changeset/console-profile-external-link-icons.md` (+5, -0)
- `.changeset/fix-agent-manager-session-switch-offline.md` (+0, -5)
- `.changeset/fix-aws-credential-symbol-collision.md` (+0, -5)
- `.changeset/fix-model-usage-full-scan.md` (+0, -5)
- `.changeset/fix-readonly-bash-exec-flag-escapes.md` (+0, -5)
- `.changeset/fix-review-command-issues.md` (+0, -5)
- `.changeset/fix-subagent-output.md` (+0, -5)
- `.changeset/jetbrains-checklist-styling.md` (+0, -5)
- `.changeset/jetbrains-config-paths.md` (+0, -5)
- `.changeset/jetbrains-inline-code-foreground.md` (+0, -5)
- `.changeset/jetbrains-model-picker-details.md` (+0, -5)
- `.changeset/jetbrains-popups.md` (+0, -5)
- `.changeset/jetbrains-session-file-links.md` (+0, -5)
- `.changeset/jetbrains-session-link-hover.md` (+0, -5)
- `.changeset/jetbrains-tool-header-clipping.md` (+0, -5)
- `.changeset/kilo-console-cloud-fonts.md` (+5, -0)
- `.changeset/kilo-memory-core.md` (+0, -7)
- `.changeset/persist-model-picker-state.md` (+0, -5)
- `.changeset/plan-followup-refine.md` (+0, -6)
- `.changeset/providers-tab-show-more.md` (+0, -5)
- `.changeset/retain-sandbox-on-fork.md` (+0, -6)
- `.changeset/show-ipv6-loopback-url.md` (+0, -5)
- `.changeset/smart-melons-float.md` (+0, -5)
- `.changeset/soft-maxcost-nudge-cli.md` (+0, -5)
- `.changeset/soft-maxcost-nudge.md` (+0, -5)
- `.changeset/staged-agent-settings.md` (+0, -6)
- `.changeset/strip-agent-internal-options.md` (+0, -5)
- `.changeset/tui-live-spent-cost.md` (+5, -0)
- `.changeset/use-gpt-family-patching.md` (+0, -5)
- `.changeset/warm-balance-chip.md` (+0, -5)
- `AgentManagerApp.tsx` (+0, -0)
- `bun.lock` (+23, -23)
- `package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-console/public/kilo-logo.svg` (+4, -0)
- `packages/kilo-console/src/components/app-header/AppHeader.tsx` (+4, -6)
- `packages/kilo-console/src/routes/profile/ProfileRoute.tsx` (+6, -2)
- `packages/kilo-console/src/styles/base.css` (+11, -1)
- `packages/kilo-console/src/styles/profile.css` (+5, -1)
- `packages/kilo-console/src/styles/resolved.css` (+1, -1)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/ai-providers/openrouter.md` (+2, -2)
- `packages/kilo-docs/pages/ai-providers/requesty.md` (+1, -1)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/CHANGELOG.md` (+30, -2)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-memory/package.json` (+1, -1)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-vscode/CHANGELOG.md` (+50, -0)
- `packages/kilo-vscode/package.json` (+13, -1)
- `packages/kilo-vscode/script/build.ts` (+6, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+91, -19)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+35, -2)
- `packages/kilo-vscode/src/agent-manager/WorktreeManager.ts` (+37, -0)
- `packages/kilo-vscode/src/agent-manager/WorktreeStateManager.ts` (+42, -3)
- `packages/kilo-vscode/src/agent-manager/__tests__/AgentManagerProvider.spec.ts` (+48, -5)
- `packages/kilo-vscode/src/agent-manager/branch-name.ts` (+10, -0)
- `packages/kilo-vscode/src/agent-manager/branch-naming.ts` (+112, -0)
- `packages/kilo-vscode/src/agent-manager/host.ts` (+3, -0)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+8, -0)
- `packages/kilo-vscode/src/agent-manager/vscode-host.ts` (+8, -0)
- `packages/kilo-vscode/src/agent-manager/worktree-importer.ts` (+4, -1)
- `packages/kilo-vscode/src/kilo-provider/session-stream-scheduler.ts` (+5, -0)
- `packages/kilo-vscode/src/services/cli-backend/connection-service.ts` (+35, -0)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/unit/branch-naming.test.ts` (+186, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-followup.test.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-load-messages.test.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-session-refresh.test.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/prompt-drafts.test.ts` (+99, -1)
- `packages/kilo-vscode/tests/unit/prompt-input-bidirectional.test.ts` (+17, -0)
- `packages/kilo-vscode/tests/unit/prompt-send-contract.test.ts` (+380, -0)
- `packages/kilo-vscode/tests/unit/session-stream-scheduler.test.ts` (+11, -0)
- `packages/kilo-vscode/tests/unit/use-file-mention.test.ts` (+86, -0)
- `packages/kilo-vscode/tests/unit/worktree-manager.test.ts` (+65, -1)
- `packages/kilo-vscode/tests/unit/worktree-state-manager.test.ts` (+61, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/NewWorktreeDialog.tsx` (+8, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+30, -11)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskHeader.tsx` (+0, -2)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModeSwitcher.tsx` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelSelector.tsx` (+8, -10)
- `packages/kilo-vscode/webview-ui/src/components/shared/ThinkingSelector.tsx` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/context/session-cloud-prune.ts` (+39, -0)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+115, -109)
- `packages/kilo-vscode/webview-ui/src/context/vscode.tsx` (+13, -8)
- `packages/kilo-vscode/webview-ui/src/hooks/useFileMention.ts` (+9, -2)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+7, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+11, -0)
- `packages/kilo-vscode/webview-ui/src/utils/draft-store.ts` (+21, -0)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/kilo-web-ui/src/assets/fonts/ATTRIBUTION.md` (+14, -0)
- `packages/kilo-web-ui/src/assets/fonts/Inter-Variable-Italic.woff2` (+-, --)
- `packages/kilo-web-ui/src/assets/fonts/Inter-Variable.woff2` (+-, --)
- `packages/kilo-web-ui/src/assets/fonts/JetBrainsMono-Variable.woff2` (+-, --)
- `packages/kilo-web-ui/src/assets/fonts/RobotoMono-Variable.woff2` (+-, --)
- `packages/kilo-web-ui/src/styles/console-shell.css` (+12, -0)
- `packages/kilo-web-ui/src/styles/theme.css` (+34, -2)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+42, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/cli/cmd/run.ts` (+32, -3)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/sidebar/context.tsx` (+9, -1)
- `packages/opencode/src/cli/cmd/tui/thread.ts` (+7, -0)
- `packages/opencode/src/kilocode/branch-name.ts` (+117, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/thread.ts` (+15, -0)
- `packages/opencode/src/kilocode/daemon/daemon.ts` (+3, -1)
- `packages/opencode/src/kilocode/plan-file.ts` (+62, -0)
- `packages/opencode/src/kilocode/plan-followup.ts` (+15, -4)
- `packages/opencode/src/kilocode/sandbox/policy.ts` (+30, -22)
- `packages/opencode/src/kilocode/sandbox/preference.ts` (+35, -0)
- `packages/opencode/src/kilocode/server/httpapi/groups/branch-name.ts` (+60, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/branch-name.ts` (+41, -0)
- `packages/opencode/src/kilocode/server/httpapi/public.ts` (+5, -0)
- `packages/opencode/src/kilocode/server/httpapi/server.ts` (+2, -0)
- `packages/opencode/src/kilocode/session/llm.ts` (+15, -3)
- `packages/opencode/src/plugin/github-copilot/models.ts` (+5, -2)
- `packages/opencode/src/provider/transform.ts` (+12, -5)
- `packages/opencode/src/server/routes/instance/httpapi/api.ts` (+2, -0)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/authorization.ts` (+14, -3)
- `packages/opencode/src/session/llm.ts` (+3, -1)
- `packages/opencode/src/session/prompt.ts` (+11, -0)
- `packages/opencode/src/util/filesystem.ts` (+7, -1)
- `packages/opencode/test/kilocode/branch-name.test.ts` (+82, -0)
- `packages/opencode/test/kilocode/cli/cmd/console.test.ts` (+5, -1)
- `packages/opencode/test/kilocode/daemon.test.ts` (+27, -0)
- `packages/opencode/test/kilocode/plan-file.test.ts` (+376, -1)
- `packages/opencode/test/kilocode/sandbox/config-network.test.ts` (+4, -3)
- `packages/opencode/test/kilocode/sandbox/policy.test.ts` (+13, -3)
- `packages/opencode/test/kilocode/sandbox/session.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/sandbox/shell-network.test.ts` (+4, -4)
- `packages/opencode/test/kilocode/sandbox/state.test.ts` (+66, -24)
- `packages/opencode/test/kilocode/server/httpapi-exercise-scenarios.ts` (+9, -1)
- `packages/opencode/test/kilocode/server/httpapi-public.test.ts` (+11, -0)
- `packages/opencode/test/kilocode/server/permission-allow-everything.test.ts` (+36, -3)
- `packages/opencode/test/kilocode/session-overflow.test.ts` (+59, -0)
- `packages/opencode/test/kilocode/session-prompt-permission-refresh.test.ts` (+123, -1)
- `packages/opencode/test/kilocode/task-nesting.test.ts` (+49, -47)
- `packages/opencode/test/kilocode/transform-opus-4.7.test.ts` (+100, -0)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+52, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+36, -0)
- `packages/sdk/openapi.json` (+104, -0)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `screenshot-uk.png` (+-, --)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index db3277ab7..7808dbc6e 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.3.63",
+  "version": "7.4.1",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/src/cross-spawn-spawner.ts
```diff
diff --git a/packages/core/src/cross-spawn-spawner.ts b/packages/core/src/cross-spawn-spawner.ts
index 5c769569e..6c29a89dd 100644
--- a/packages/core/src/cross-spawn-spawner.ts
+++ b/packages/core/src/cross-spawn-spawner.ts
@@ -2,6 +2,7 @@ import type * as Arr from "effect/Array"
 import { NodeFileSystem, NodeSink, NodeStream } from "@effect/platform-node"
 import * as NodePath from "@effect/platform-node/NodePath"
 import { prepareCommand as prepareSandbox } from "@kilocode/sandbox" // kilocode_change
+import { tap as tapStdio, tapped } from "./kilocode/stdio-tap" // kilocode_change - Bun drops buffered stdio on close
 import * as Deferred from "effect/Deferred"
 import * as Effect from "effect/Effect"
 import * as Exit from "effect/Exit"
@@ -246,13 +247,13 @@ export const make = Effect.gen(function* () {
   ) => {
     let stdout = proc.stdout
       ? NodeStream.fromReadable({
-          evaluate: () => proc.stdout!,
+          evaluate: () => tapped(proc, "stdout"), // kilocode_change - read the spawn-time tap
           onError: (cause) => toPlatformError("fromReadable(stdout)", toError(cause), command),
         })
       : Stream.empty
     let stderr = proc.stderr
       ? NodeStream.fromReadable({
-          evaluate: () => proc.stderr!,
+          evaluate: () => tapped(proc, "stderr"), // kilocode_change - read the spawn-time tap
           onError: (cause) => toPlatformError("fromReadable(stderr)", toError(cause), command),
         })
       : Stream.empty
@@ -267,6 +268,7 @@ export const make = Effect.gen(function* () {
     Effect.callback<readonly [NodeChildProcess.ChildProcess, ExitSignal], PlatformError.PlatformError>((resume) => {
       const signal = Deferred.makeUnsafe<readonly [code: number | null, signal: NodeJS.Signals | null]>()
       const proc = launch(command.command, command.args, opts)
+      tapStdio(proc) // kilocode_change - must run in the same tick as spawn
       let end = false
       let exit: readonly [code: number | null, signal: NodeJS.Signals | null] | undefined
       proc.on("error", (err) => {
```

#### packages/core/src/kilocode/stdio-tap.ts
```diff
diff --git a/packages/core/src/kilocode/stdio-tap.ts b/packages/core/src/kilocode/stdio-tap.ts
new file mode 100644
index 000000000..0bfe80119
--- /dev/null
+++ b/packages/core/src/kilocode/stdio-tap.ts
@@ -0,0 +1,34 @@
+import type * as NodeChildProcess from "node:child_process"
+import { PassThrough, type Readable } from "node:stream"
+
+// Bun's child_process drops buffered stdio data once the child emits "close", so
+// stream readers that attach lazily (a tick or more after spawn) lose the output of
+// fast-exiting processes entirely. To retain it, stdout/stderr are piped into
+// PassThroughs synchronously at spawn time, before yielding to the event loop.
+// PassThrough backpressure (default highWaterMark) keeps unconsumed output bounded.
+
+const map = new WeakMap<NodeChildProcess.ChildProcess, { stdout: PassThrough | null; stderr: PassThrough | null }>()
+
+const wrap = (src: Readable | null) => {
+  if (!src) return null
+  const out = new PassThrough()
+  // A destroy(err) before the lazy consumer attaches would otherwise emit an
+  // unhandled "error" event and crash the process (a hazard that also existed
+  // when readers attached lazily to the raw stdio streams). Consumers attached
+  // by then still get the error via their own listeners; in the rare pre-attach
+  // window the error is dropped instead of crashing the CLI.
+  out.on("error", () => {})
+  src.on("error", (err) => out.destroy(err instanceof Error ? err : new Error(String(err))))
+  src.pipe(out)
+  return out
+}
+
+/** Tap a freshly spawned process. Must be called in the same tick as spawn. */
+export function tap(proc: NodeChildProcess.ChildProcess) {
+  map.set(proc, { stdout: wrap(proc.stdout), stderr: wrap(proc.stderr) })
+}
+
+/** The tapped stream for a process, falling back to the raw stdio stream. */
+export function tapped(proc: NodeChildProcess.ChildProcess, fd: "stdout" | "stderr") {
+  return map.get(proc)?.[fd] ?? proc[fd]!
+}
```

#### packages/opencode/src/kilocode/permission/headless.ts
```diff
diff --git a/packages/opencode/src/kilocode/permission/headless.ts b/packages/opencode/src/kilocode/permission/headless.ts
new file mode 100644
index 000000000..baa931b77
--- /dev/null
+++ b/packages/opencode/src/kilocode/permission/headless.ts
@@ -0,0 +1,45 @@
+import { Database, eq } from "@/storage/db"
+import { SessionTable } from "@/session/session.sql"
+import type { SessionID } from "@/session/schema"
+
+/**
+ * Headless roots (#11903).
+ *
+ * Root sessions driven by a client that cannot answer subagent permission
+ * prompts (plain `kilo run`). Permission asks originating from their child
+ * sessions must fail with DeniedError instead of blocking forever on a reply
+ * that never comes. Interactive clients (TUI, extension) never mark sessions
+ * here, so their subagent prompts stay answerable.
+ */
+export namespace KiloHeadless {
+  const roots = new Set<string>()
+
+  export function mark(id: string) {
+    roots.add(id)
+  }
+
+  export function clear(id: string) {
+    roots.delete(id)
+  }
+
+  /** True when `id` is a subagent session whose root run has no attached human. */
+  export function denies(id: string): boolean {
+    if (roots.size === 0) return false
+    if (roots.has(id)) return false
+    for (let parent = lookup(id); parent; parent = lookup(parent)) {
+      if (roots.has(parent)) return true
+    }
+    return false
+  }
+
+  function lookup(id: string) {
+    const row = Database.use((db) =>
+      db
+        .select({ parent: SessionTable.parent_id })
+        .from(SessionTable)
+        .where(eq(SessionTable.id, id as SessionID))
+        .get(),
+    )
+    return row?.parent ?? undefined
+  }
```

#### packages/opencode/src/kilocode/tool/plan.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/plan.ts b/packages/opencode/src/kilocode/tool/plan.ts
index 090e7d8f5..2b6e9d595 100644
--- a/packages/opencode/src/kilocode/tool/plan.ts
+++ b/packages/opencode/src/kilocode/tool/plan.ts
@@ -28,7 +28,25 @@ export const PlanExitTool = Tool.define(
         Effect.gen(function* () {
           const instance = yield* InstanceState.context
           const info = yield* session.get(ctx.sessionID)
-          const file = PlanFile.resolve(params.path, instance) ?? Session.plan(info, instance)
+          // resolved may be undefined even for a legit path (e.g. the non-git
+          // global plans dir), so still fall through to locate()'s recovery.
+          const resolved = params.path ? PlanFile.resolve(params.path, instance) : undefined
+          const target = resolved ?? Session.plan(info, instance)
+          // fetch fresh messages so written() sees a write from this same turn
+          const messages = yield* session.messages({ sessionID: ctx.sessionID })
+          const file = yield* Effect.promise(() => PlanFile.locate(target, messages, info, instance, ctx.agent))
+          if (!file) {
+            const plan = PlanFile.display(target, instance)
+            const rejected = params.path && !resolved
+            const hint = rejected
+              ? `The path "${params.path}" you passed can't be used directly — it's outside the project, or it's a directory rather than a file. `
+              : ""
+            return yield* Effect.fail(
+              new Error(
+                `Plan file not found at ${plan}. ${hint}Write the plan file first, or call plan_exit with the exact path of the file you wrote.`,
+              ),
+            )
+          }
           const plan = PlanFile.display(file, instance)
           return {
             title: "Planning complete",
```


*... and more files (showing first 5)*

## opencode Changes (30936a9..7a8e7c8)

### Commits

- 7a8e7c8 - tui: preserve spinner registration (#35292) (Simon Klee, 2026-07-04)
- a226767 - fix(app): match new session panel corners (#35257) (Luke Parker, 2026-07-04)
- f63a451 - fix(desktop): stabilize esm shim injection (#35270) (Luke Parker, 2026-07-04)
- 8b6a2b1 - fix(app): delay initial tab preview (#35266) (opencode-agent[bot], 2026-07-03)
- 933dbfd - fix(app): restore unfocused composer typing (#35249) (Luke Parker, 2026-07-03)
- b44bc0a - cleanup: tweak compaction prompt (#35220) (opencode-agent[bot], 2026-07-03)
- 436cd39 - chore: generate (opencode-agent[bot], 2026-07-03)
- ed6dc87 - feat(opencode): gate execute tool behind code mode flag (#35185) (Aiden Cline, 2026-07-03)
- 96d53c6 - refactor(core): move path resolve into fs service (#35202) (James Long, 2026-07-03)
- 911fb70 - fix(tui): align execute child calls with task indentation (#35190) (Aiden Cline, 2026-07-03)
- 27e8e2e - refactor(opencode): fail the execute tool on program failure (#35180) (Aiden Cline, 2026-07-03)
- 39c6dd1 - feat(tui): render code-mode execute tool with child calls (#35113) (Aiden Cline, 2026-07-03)
- a09447b - chore: generate (opencode-agent[bot], 2026-07-03)
- 1681547 - chore: artifacts (Adam, 2026-07-03)
- 1f47bbf - fix(stats): link market share labs (Adam, 2026-07-03)
- 33ed95f - fix(core): rewrite replacements while hoisting layers (#35175) (James Long, 2026-07-03)
- 2152624 - chore: generate (opencode-agent[bot], 2026-07-03)
- 7d84cb0 - feat(stats): add model momentum section (Adam, 2026-07-03)
- eba0bd0 - chore: upgrade turbo (#35173) (James Long, 2026-07-03)
- 9aab24e - fix(opencode): provide Observability beneath all route service graphs (#35171) (Kit Langton, 2026-07-03)
- a4fed69 - feat(app): dropdown search fix (#34961) (Aarav Sareen, 2026-07-03)
- 41a3cfc - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-03)
- 72845e0 - chore: generate (opencode-agent[bot], 2026-07-03)
- abaab29 - feat(opencode): add code-mode MCP adapter (#35085) (Aiden Cline, 2026-07-03)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/core/src/tool/bash.ts` (+9, -5)
- `packages/opencode/src/tool/code-mode.ts` (+324, -0)
- `packages/opencode/src/tool/registry.ts` (+32, -2)
- `packages/opencode/test/tool/code-mode-integration.test.ts` (+329, -0)
- `packages/opencode/test/tool/code-mode.test.ts` (+714, -0)
- `packages/opencode/test/tool/registry.test.ts` (+79, -0)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
- `packages/opencode/src/permission/index.ts` (+5, -0)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/src/effect/layer-node.ts` (+1, -1)
- `packages/core/src/fs-util.ts` (+10, -0)
- `packages/core/src/instruction-context.ts` (+13, -11)
- `packages/core/src/location-services.ts` (+4, -0)
- `packages/core/src/project/copy.ts` (+1, -1)
- `packages/core/src/session/compaction.ts` (+13, -25)
- `packages/core/test/session-runner.test.ts` (+15, -15)

#### Other Changes
- `artifacts/glm52-rise-video/.gitignore` (+3, -0)
- `artifacts/glm52-rise-video/bun.lock` (+483, -0)
- `artifacts/glm52-rise-video/out/flash-share.mp4` (+-, --)
- `artifacts/glm52-rise-video/out/glm-52-broke-out.mp4` (+-, --)
- `artifacts/glm52-rise-video/out/june-totals.png` (+-, --)
- `artifacts/glm52-rise-video/out/minimax-climb.mp4` (+-, --)
- `artifacts/glm52-rise-video/out/novel-1984.mp4` (+-, --)
- `artifacts/glm52-rise-video/out/nz-sheep.mp4` (+-, --)
- `artifacts/glm52-rise-video/package.json` (+24, -0)
- `artifacts/glm52-rise-video/public/book.jpg` (+-, --)
- `artifacts/glm52-rise-video/public/sheep.jpg` (+-, --)
- `artifacts/glm52-rise-video/src/data.ts` (+156, -0)
- `artifacts/glm52-rise-video/src/flash.tsx` (+185, -0)
- `artifacts/glm52-rise-video/src/index.tsx` (+36, -0)
- `artifacts/glm52-rise-video/src/june.tsx` (+144, -0)
- `artifacts/glm52-rise-video/src/minimax.tsx` (+201, -0)
- `artifacts/glm52-rise-video/src/novel.tsx` (+135, -0)
- `artifacts/glm52-rise-video/src/sheep.tsx` (+139, -0)
- `artifacts/glm52-rise-video/src/video.tsx` (+254, -0)
- `bun.lock` (+15, -14)
- `nix/hashes.json` (+4, -4)
- `package.json` (+1, -1)
- `packages/app/e2e/regression/new-session-panel-corner.spec.ts` (+83, -0)
- `packages/app/e2e/regression/terminal-composer-focus.spec.ts` (+89, -0)
- `packages/app/e2e/tsconfig.json` (+1, -0)
- `packages/app/src/components/dialog-select-model.tsx` (+23, -1)
- `packages/app/src/components/prompt-project-selector.tsx` (+23, -11)
- `packages/app/src/components/titlebar-tab-popover.tsx` (+1, -1)
- `packages/app/src/pages/new-session.tsx` (+1, -1)
- `packages/app/src/pages/session.tsx` (+1, -14)
- `packages/app/src/pages/session/helpers.test.ts` (+0, -21)
- `packages/app/src/pages/session/helpers.ts` (+0, -7)
- `packages/app/src/utils/search-keydown.ts` (+116, -0)
- `packages/codemode/src/tool-runtime.ts` (+9, -6)
- `packages/codemode/test/codemode.test.ts` (+5, -5)
- `packages/codemode/test/signature.test.ts` (+40, -0)
- `packages/desktop/electron.vite.config.ts` (+11, -0)
- `packages/opencode/package.json` (+1, -0)
- `packages/opencode/src/cli/cmd/run/footer.subagent.tsx` (+3, -1)
- `packages/opencode/src/cli/cmd/run/footer.view.tsx` (+3, -1)
- `packages/opencode/src/effect/runtime-flags.ts` (+1, -0)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+5, -2)
- `packages/opencode/src/session/processor.ts` (+2, -0)
- `packages/opencode/src/session/prompt.ts` (+1, -0)
- `packages/opencode/src/session/tools.ts` (+5, -0)
- `packages/opencode/test/server/httpapi-exercise/index.ts` (+9, -21)
- `packages/opencode/test/session/compaction.test.ts` (+2, -2)
- `packages/stats/app/src/i18n.ts` (+1, -1)
- `packages/stats/app/src/routes/[lab]/[model].tsx` (+236, -185)
- `packages/stats/app/src/routes/index.css` (+458, -3)
- `packages/stats/app/src/routes/index.tsx` (+47, -21)
- `packages/tui/package.json` (+2, -1)
- `packages/tui/src/app.tsx` (+3, -0)
- `packages/tui/src/component/prompt/index.tsx` (+3, -1)
- `packages/tui/src/component/register-spinner.ts` (+6, -0)
- `packages/tui/src/component/spinner.tsx` (+3, -1)
- `packages/tui/src/routes/session/index.tsx` (+64, -0)

### Key Diffs

#### packages/core/src/effect/layer-node.ts
```diff
diff --git a/packages/core/src/effect/layer-node.ts b/packages/core/src/effect/layer-node.ts
index b58692a..9dbc3d5 100644
--- a/packages/core/src/effect/layer-node.ts
+++ b/packages/core/src/effect/layer-node.ts
@@ -230,7 +230,7 @@ export function hoist<A, E, T extends Tag, const Items extends Replacements = re
         if (existing && existing !== node) {
           throw new Error(`Tag ${tag} has conflicting implementations for ${node.name}`)
         }
-        hoisted.set(node.name, node)
+        hoisted.set(node.name, rewriteReplacementDependencies(node, replacementMap))
         return group([])
       }
       if (node.kind === "unbound") {
```

#### packages/core/src/fs-util.ts
```diff
diff --git a/packages/core/src/fs-util.ts b/packages/core/src/fs-util.ts
index ff71477..124ac6d 100644
--- a/packages/core/src/fs-util.ts
+++ b/packages/core/src/fs-util.ts
@@ -38,6 +38,7 @@ export namespace FSUtil {
     readonly ensureDir: (path: string) => Effect.Effect<void, Error>
     readonly writeWithDirs: (path: string, content: string | Uint8Array, mode?: number) => Effect.Effect<void, Error>
     readonly readDirectoryEntries: (path: string) => Effect.Effect<DirEntry[], Error>
+    readonly resolve: (path: string) => Effect.Effect<string>
     readonly findUp: (target: string, start: string, stop?: string) => Effect.Effect<string[], Error>
     readonly up: (options: { targets: string[]; start: string; stop?: string }) => Effect.Effect<string[], Error>
     readonly globUp: (pattern: string, start: string, stop?: string) => Effect.Effect<string[], Error>
@@ -89,6 +90,14 @@ export namespace FSUtil {
         })
       })
 
+      const resolve = Effect.fn("FileSystem.resolve")(function* (path: string) {
+        const resolved = pathResolve(windowsPath(path))
+        return yield* fs.realPath(resolved).pipe(
+          Effect.catchReason("PlatformError", "NotFound", () => Effect.succeed(resolved)),
+          Effect.orDie,
+        )
+      })
+
       const readJson = Effect.fn("FileSystem.readJson")(function* (path: string) {
         const text = yield* fs.readFileString(path)
         return yield* Effect.try({
@@ -187,6 +196,7 @@ export namespace FSUtil {
         isDir,
         isFile,
         readDirectoryEntries,
+        resolve,
         readJson,
         writeJson,
         ensureDir,
```

#### packages/core/src/instruction-context.ts
```diff
diff --git a/packages/core/src/instruction-context.ts b/packages/core/src/instruction-context.ts
index b0cc330..492fa42 100644
--- a/packages/core/src/instruction-context.ts
+++ b/packages/core/src/instruction-context.ts
@@ -38,22 +38,24 @@ const layer = Layer.effectDiscard(
       })
 
     const observe = Effect.fn("InstructionContext.observe")(function* () {
-      const start = FSUtil.resolve(location.directory)
-      const stop = FSUtil.resolve(location.project.directory)
+      const start = yield* fs.resolve(location.directory)
+      const stop = yield* fs.resolve(location.project.directory)
       const fromProject = relative(stop, start)
       const insideProject =
         fromProject === "" || (fromProject !== ".." && !fromProject.startsWith(`..${sep}`) && !isAbsolute(fromProject))
       const discovered = new Set(
-        (Flag.OPENCODE_DISABLE_PROJECT_CONFIG || !insideProject
-          ? []
-          : yield* fs.up({
-              targets: ["AGENTS.md"],
-              start,
-              stop,
-            })
-        ).map(FSUtil.resolve),
+        yield* Effect.forEach(
+          Flag.OPENCODE_DISABLE_PROJECT_CONFIG || !insideProject
+            ? []
+            : yield* fs.up({
+                targets: ["AGENTS.md"],
+                start,
+                stop,
+              }),
+          fs.resolve,
+        ),
       )
-      const paths = Array.dedupe([FSUtil.resolve(join(global.config, "AGENTS.md")), ...discovered])
+      const paths = Array.dedupe([yield* fs.resolve(join(global.config, "AGENTS.md")), ...discovered])
       const files = yield* Effect.forEach(
         paths,
         (path) =>
```

#### packages/core/src/location-services.ts
```diff
diff --git a/packages/core/src/location-services.ts b/packages/core/src/location-services.ts
index 7a4678a..7da6767 100644
--- a/packages/core/src/location-services.ts
+++ b/packages/core/src/location-services.ts
@@ -89,6 +89,10 @@ export function buildLocationServiceMap(
     LayerMap.make(
       (ref: Location.Ref) => {
         const allReplacements = replacements.concat([[Location.node, Location.boundNode(ref)]])
+        // Apply replacements during hoist, not afterward: replacements can
+        // introduce new tagged dependencies (Location.boundNode depends on
+        // Project), and the hoist walk is the only pass that can still slice
+        // those back out.
         const location = LayerNode.hoist(locationServices, Node.tags.values.global, allReplacements)
 
         return LayerNode.compile(location.node).pipe(
```

#### packages/core/src/project/copy.ts
```diff
diff --git a/packages/core/src/project/copy.ts b/packages/core/src/project/copy.ts
index 5b2f956..a1a5cc8 100644
--- a/packages/core/src/project/copy.ts
+++ b/packages/core/src/project/copy.ts
@@ -139,7 +139,7 @@ const layer = Layer.effect(
     })
 
     const canonical = Effect.fnUntraced(function* (input: AbsolutePath) {
-      const resolved = AbsolutePath.make(FSUtil.resolve(input))
+      const resolved = AbsolutePath.make(yield* fs.resolve(input))
       if (!(yield* fs.isDir(resolved))) return yield* new DirectoryUnavailableError({ directory: input })
       return resolved
     })
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/core/src/cross-spawn-spawner.ts
- `src/core/` - review core changes from packages/core/src/kilocode/stdio-tap.ts
- `src/permission/` - review permission changes from packages/opencode/src/kilocode/permission/headless.ts
- `src/permission/` - review permission changes from packages/opencode/src/permission/index.ts
- `src/tool/bash.ts` - update based on opencode packages/core/src/tool/bash.ts changes
- `src/tool/code-mode-integration.test.ts` - update based on opencode packages/opencode/test/tool/code-mode-integration.test.ts changes
- `src/tool/code-mode.test.ts` - update based on opencode packages/opencode/test/tool/code-mode.test.ts changes
- `src/tool/code-mode.ts` - update based on opencode packages/opencode/src/tool/code-mode.ts changes
- `src/tool/plan.ts` - update based on kilocode packages/opencode/src/kilocode/tool/plan.ts changes
- `src/tool/registry.test.ts` - update based on opencode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on opencode packages/opencode/src/tool/registry.ts changes
- `src/tool/shell.ts` - update based on kilocode packages/opencode/src/tool/shell.ts changes
