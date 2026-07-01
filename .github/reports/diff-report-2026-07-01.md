# Upstream Changes Report
Generated: 2026-07-01 09:48:29

## Summary
- kilocode: 22 commits, 137 files changed
- opencode: 49 commits, 253 files changed

## kilocode Changes (c856bb33e..78cdc9c89)

### Commits

- 78cdc9c89 - feat(vscode): persist model selector expand/collapse state (#11824) (Johnny Eric Amancio, 2026-06-30)
- 5c6cc984d - Merge pull request #11813 from Kilo-Org/luck-family (Kirill Kalishev, 2026-06-30)
- e2696c801 - Merge pull request #11496 from Kilo-Org/fix/cli-ipv6-local-url (Catriel Müller, 2026-06-30)
- eec075bc8 - fix(cli): retain sandbox state when forking or moving a session to a worktree (#11838) (Marius, 2026-06-30)
- 829bac7bd - Merge pull request #11743 from debanjawn/fix-custom-provider-ollama-duplicates (Christiaan Arnoldus, 2026-06-30)
- ac987f519 - Merge pull request #11767 from Kilo-Org/fix/strip-agent-internal-options (Christiaan Arnoldus, 2026-06-30)
- 55ebd4c4d - Merge branch 'main' into fix-custom-provider-ollama-duplicates (Christiaan Arnoldus, 2026-06-30)
- 069c8d196 - docs(kilo-docs): clarify VS Code extension local launch (#11663) (Vishal Kumar Singh, 2026-06-30)
- c92bdffae - Merge pull request #11791 from Kilo-Org/mark/harden-setup-bun-node-gyp (Mark IJbema, 2026-06-30)
- 82da283d1 - release: v7.3.63 (kilo-maintainer[bot], 2026-06-30)
- a824c4cba - fix(jetbrains): resolve workspace by project id (kirillk, 2026-06-29)
- 275af4990 - fix(cli): also strip reference/resolved Scout agent metadata from provider options (chrarnoldus, 2026-06-29)
- be7e978a6 - fix(cli): annotate modified options merge line; clarify changeset (chrarnoldus, 2026-06-29)
- e983cd4d9 - Merge remote-tracking branch 'origin/main' into fix/strip-agent-internal-options Co-authored-by: kiloconnect[bot] <240665456+kiloconnect[bot]@users.noreply.github.com> (chrarnoldus, 2026-06-29)
- 9b680c10f - Merge branch 'main' into fix/strip-agent-internal-options (Christiaan Arnoldus, 2026-06-29)
- d791d710c - fix(ci): scope node-gyp headers to install step (Mark IJbema, 2026-06-29)
- bf96052b2 - fix(ci): skip local node headers on windows (Mark IJbema, 2026-06-29)
- a42ed4743 - fix(ci): use local node headers for native deps (Mark IJbema, 2026-06-29)
- c94a09775 - fix(cli): strip internal agent metadata from provider request options (chrarnoldus, 2026-06-29)
- 869fc7317 - fix: dedupe selected discovered model batch (debanjawn, 2026-06-26)
- 691f9aba0 - fix: dedupe custom provider discovered models (debanjawn, 2026-06-26)
- bc0236bbf - fix(cli): show local URL for IPv6 wildcard binds (Catriel Müller, 2026-06-20)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
(no changes)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/kilocode/agent/options.ts` (+31, -0)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)

#### Other Changes
- `.changeset/add-anaconda-desktop-provider.md` (+0, -7)
- `.changeset/add-parakeet-speech.md` (+0, -5)
- `.changeset/agent-manager-pr-status-icon.md` (+0, -5)
- `.changeset/agent-manager-sandbox-default.md` (+0, -5)
- `.changeset/agent-manager-tool-models.md` (+0, -7)
- `.changeset/agent-manager-worktree-sandbox.md` (+0, -5)
- `.changeset/agent-requirements.md` (+0, -6)
- `.changeset/anaconda-desktop-translations.md` (+0, -5)
- `.changeset/animate-tool-card-reveals.md` (+0, -5)
- `.changeset/auto-model-picker-details.md` (+0, -5)
- `.changeset/background-process-lifetimes.md` (+0, -5)
- `.changeset/bound-snapshot-turns.md` (+0, -5)
- `.changeset/bright-notebooks-complete.md` (+0, -5)
- `.changeset/bright-terminals-help.md` (+0, -5)
- `.changeset/calm-powershell-alerts.md` (+0, -6)
- `.changeset/chat-fim-fallback.md` (+0, -6)
- `.changeset/clear-marketplace-installs.md` (+0, -5)
- `.changeset/cli-sidebar-balance.md` (+0, -5)
- `.changeset/collapse-agent-sessions.md` (+0, -5)
- `.changeset/create-plan-dir.md` (+0, -5)
- `.changeset/expose-sandbox-controls.md` (+0, -5)
- `.changeset/filter-relevant-marketplace.md` (+0, -5)
- `.changeset/fix-autocomplete-error-messages.md` (+0, -7)
- `.changeset/fix-curl-upgrade-url.md` (+0, -5)
- `.changeset/fix-kiloclaw-slash.md` (+0, -7)
- `.changeset/fix-slash-mention-highlight.md` (+0, -5)
- `.changeset/import-cloud-session-first.md` (+0, -5)
- `.changeset/isolate-linux-network.md` (+0, -6)
- `.changeset/jetbrains-clickable-prompt-mentions.md` (+0, -5)
- `.changeset/jetbrains-empty-mention-completion.md` (+0, -5)
- `.changeset/jetbrains-file-mention-parity.md` (+0, -5)
- `.changeset/jetbrains-git-changes-data-url.md` (+0, -5)
- `.changeset/jetbrains-mention-icons-priority.md` (+0, -5)
- `.changeset/jetbrains-profile-balance.md` (+0, -5)
- `.changeset/jetbrains-prompt-completion.md` (+0, -5)
- `.changeset/jetbrains-prompt-hint.md` (+0, -5)
- `.changeset/jetbrains-prompt-mentions-undo.md` (+0, -5)
- `.changeset/jetbrains-restart-loading.md` (+0, -5)
- `.changeset/jetbrains-send-typed-mentions.md` (+0, -5)
- `.changeset/jetbrains-session-error-logs.md` (+0, -5)
- `.changeset/jetbrains-session-focus-restore.md` (+0, -5)
- `.changeset/jetbrains-slash-aliases.md` (+0, -5)
- `.changeset/jetbrains-sse-reconnect-timeout.md` (+0, -5)
- `.changeset/jetbrains-stable-mention-completion.md` (+0, -5)
- `.changeset/keep-sandbox-toggle-drafts.md` (+0, -5)
- `.changeset/kilo-pass-profile-contract.md` (+0, -7)
- `.changeset/macos-network-sandbox.md` (+0, -6)
- `.changeset/marketplace-match-notification.md` (+0, -5)
- `.changeset/mix-marketplace-categories.md` (+0, -5)
- `.changeset/model-selector-auto-icon.md` (+0, -5)
- `.changeset/native-notebook-tools.md` (+0, -5)
- `.changeset/notebook-create-action.md` (+0, -5)
- `.changeset/notify-sandbox-state.md` (+0, -5)
- `.changeset/open-model-selector-faster.md` (+0, -5)
- `.changeset/persist-index-updates.md` (+0, -5)
- `.changeset/persist-model-picker-state.md` (+5, -0)
- `.changeset/prefer-kilo-config.md` (+0, -5)
- `.changeset/quiet-auto-approved-permissions.md` (+0, -5)
- `.changeset/release-disconnected-streams.md` (+0, -5)
- `.changeset/remember-sandbox-sessions.md` (+0, -7)
- `.changeset/reset-read-notifications.md` (+0, -5)
- `.changeset/retain-sandbox-on-fork.md` (+6, -0)
- `.changeset/sandbox-agent-writes.md` (+0, -6)
- `.changeset/secure-sandbox-config.md` (+0, -5)
- `.changeset/secure-sandbox-mutations.md` (+0, -5)
- `.changeset/secure-worktree-sandboxes.md` (+0, -5)
- `.changeset/send-inline-review-comments.md` (+0, -5)
- `.changeset/show-external-permission-paths.md` (+0, -5)
- `.changeset/show-ipv6-loopback-url.md` (+5, -0)
- `.changeset/show-routed-step-models.md` (+0, -7)
- `.changeset/show-sandbox-network.md` (+0, -5)
- `.changeset/slash-command-sorting.md` (+0, -4)
- `.changeset/smart-melons-float.md` (+5, -0)
- `.changeset/strip-agent-internal-options.md` (+5, -0)
- `.changeset/subagent-resumable-error.md` (+0, -5)
- `.changeset/tidy-indexing-button.md` (+0, -5)
- `.changeset/toggle-extension-sandbox.md` (+0, -5)
- `.changeset/toggle-tui-sandbox.md` (+0, -7)
- `.changeset/vscode-cli-version-marker-packaging.md` (+0, -5)
- `.changeset/vscode-model-usage.md` (+0, -7)
- `.github/actions/setup-bun/action.yml` (+34, -0)
- `bun.lock` (+22, -22)
- `package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/kilo-console/package.json` (+1, -1)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/contributing/development-environment.md` (+30, -0)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-jetbrains/CHANGELOG.md` (+39, -1)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloWorkspaceRpcApiImpl.kt` (+24, -8)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/rpc/WorkspacePathScopingTest.kt` (+34, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/KiloToolWindowFactory.kt` (+4, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/app/KiloWorkspaceService.kt` (+4, -3)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/base/BaseSettingsUi.kt` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeWorkspaceRpcApi.kt` (+2, -1)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/KiloWorkspaceRpcApi.kt` (+5, -4)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-vscode/CHANGELOG.md` (+106, -0)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/unit/custom-provider-dialog-validate.test.ts` (+12, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/CustomProviderDialog.tsx` (+42, -12)
- `packages/kilo-vscode/webview-ui/src/components/settings/CustomProviderValidation.ts` (+3, -2)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelSelector.tsx` (+5, -1)
- `packages/kilo-vscode/webview-ui/src/context/vscode.tsx` (+11, -0)
- `packages/kilo-web-ui/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/CHANGELOG.md` (+67, -0)
- `packages/opencode/package.json` (+1, -1)
- `packages/opencode/src/cli/cmd/serve.ts` (+2, -4)
- `packages/opencode/src/kilocode/sandbox/policy.ts` (+14, -6)
- `packages/opencode/src/kilocode/server/routes/fork-routing.ts` (+16, -0)
- `packages/opencode/src/server/routes/instance/httpapi/middleware/workspace-routing.ts` (+5, -1)
- `packages/opencode/src/session/llm/request.ts` (+6, -1)
- `packages/opencode/src/session/session.ts` (+6, -1)
- `packages/opencode/test/kilocode/agent-options-strip.test.ts` (+54, -0)
- `packages/opencode/test/kilocode/cli/cmd/serve.test.ts` (+60, -0)
- `packages/opencode/test/kilocode/sandbox/session.test.ts` (+32, -0)
- `packages/opencode/test/kilocode/server/fork-routing.test.ts` (+29, -0)
- `packages/plugin-atomic-chat/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+6, -1)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+48, -0)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `script/upstream/package.json` (+1, -1)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index b5c0f814c..db3277ab7 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.3.54",
+  "version": "7.3.63",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/opencode/src/kilocode/agent/options.ts
```diff
diff --git a/packages/opencode/src/kilocode/agent/options.ts b/packages/opencode/src/kilocode/agent/options.ts
new file mode 100644
index 000000000..e79e786f6
--- /dev/null
+++ b/packages/opencode/src/kilocode/agent/options.ts
@@ -0,0 +1,31 @@
+// kilocode_change - new file
+
+// Kilo stores internal/UI-only metadata on an agent's `options` record:
+//   - `id`:          mode identifier used to recognize built-in modes (see session/prompt.ts)
+//   - `displayName`: human-readable name for org/marketplace modes
+//   - `source`:      origin marker ("organization" | "global" | "project")
+//   - `reference`:   configured reference descriptor for Scout/reference agents (see agent/agent.ts)
+//   - `resolved`:    resolved reference data for Scout/reference agents
+//
+// These are NOT provider request parameters. The agent `options` record is
+// otherwise forwarded verbatim into providerOptions, so any of these keys that
+// survive into the request body get rejected by strict providers
+// (e.g. NVIDIA NIM: 400 "Unsupported parameter(s): displayName, id").
+//
+// We strip only this known denylist rather than allowlisting provider options,
+// so genuine provider options an agent sets continue to pass through untouched.
+export const INTERNAL_OPTION_KEYS = ["id", "displayName", "source", "reference", "resolved"] as const
+
+const internal: ReadonlySet<string> = new Set(INTERNAL_OPTION_KEYS)
+
+// Returns a shallow copy of `options` with Kilo-internal metadata keys removed.
+// Used at the provider-request boundary so agent metadata never leaks into the
+// request body. The original `options` object is left untouched.
+export function stripInternalOptions(options: Record<string, any>): Record<string, any> {
+  const result: Record<string, any> = {}
+  for (const key in options) {
+    if (internal.has(key)) continue
+    result[key] = options[key]
+  }
+  return result
+}
```


## opencode Changes (8289883..f014686)

### Commits

- f014686 - feat(desktop): session tab hover preview popover (#34678) (usrnk1, 2026-07-01)
- 8b68dc0 - chore: generate (opencode-agent[bot], 2026-07-01)
- 2f4d36d - fix(desktop): clean stale draft stores (#34651) (Brendan Allan, 2026-07-01)
- 6f2ff35 - chore: generate (opencode-agent[bot], 2026-07-01)
- cd00422 - fix(app): question UI fixes and UX improvements (#34116) (Julian Coy, 2026-07-01)
- 34ee942 - chore: generate (opencode-agent[bot], 2026-07-01)
- 4d91f0c - feat(app): v2 wsl ui (#34233) (Aarav Sareen, 2026-07-01)
- bf18cc9 - chore: generate (opencode-agent[bot], 2026-07-01)
- 5e1a1ed - fix(app): scope session page errors (#34254) (Brendan Allan, 2026-07-01)
- bd7f7ad - chore: generate (opencode-agent[bot], 2026-07-01)
- af72cec - feat(desktop): scope tabs to windows (#34669) (Brendan Allan, 2026-07-01)
- 55552c5 - fix(provider): force openai reasoning variants (#34702) (Aiden Cline, 2026-06-30)
- 2b611a5 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-01)
- 45a437c - fix(app): clamp virtualizer range to scroll bounds (#34588) (opencode-agent[bot], 2026-07-01)
- 439ec9b - chore: generate (opencode-agent[bot], 2026-07-01)
- ae3fefb - fix(session-ui): recognize more inline file paths (#34688) (opencode-agent[bot], 2026-07-01)
- f1407e4 - fix(core): stop replaying stale GitHub Copilot Responses item IDs (#34686) (Aiden Cline, 2026-06-30)
- c88ca97 - chore: generate (opencode-agent[bot], 2026-06-30)
- 928c37b - zen: kk2.7, mm3, sonnet5 (Frank, 2026-06-30)
- afff74e - sync release versions for v1.17.12 (opencode, 2026-06-30)
- 3a669d5 - fix(provider): enable sonnet 5 adaptive thinking (#34673) (Aiden Cline, 2026-06-30)
- 6789214 - fix(console): remove expired Go MiniMax promo (#34663) (Jack, 2026-07-01)
- 6636683 - refactor: remove remaining default layer aliases (#34660) (James Long, 2026-06-30)
- 3af9f64 - chore: generate (opencode-agent[bot], 2026-06-30)
- 5a23bdc - refactor(core): remove domain layer exports (#34625) (James Long, 2026-06-30)
- e787268 - chore: generate (opencode-agent[bot], 2026-06-30)
- 472d0f3 - refactor(core): remove infrastructure layer exports (#34624) (James Long, 2026-06-30)
- c8fde60 - fix(app): hide missing workspace branch (#34649) (Brendan Allan, 2026-07-01)
- a4b6047 - fix(core): drop legacy config filename (#34645) (opencode-agent[bot], 2026-06-30)
- 6387f95 - refactor(core): remove session layer exports (#34623) (James Long, 2026-06-30)
- 5691f36 - refactor(core): remove tool layer exports (#34622) (James Long, 2026-06-30)
- 74e7a37 - chore: generate (opencode-agent[bot], 2026-06-30)
- fced9c5 - feat(desktop): polish tooltips and session search (#34632) (usrnk1, 2026-06-30)
- 20445ca - fix(cli): hide auto approval aliases in help (#34641) (opencode-agent[bot], 2026-06-30)
- 6fc9405 - refactor(core): route aggregate layers through nodes (#34621) (James Long, 2026-06-30)
- c86066e - test(opencode): update help snapshots (#34639) (James Long, 2026-06-30)
- fa9ba29 - feat(desktop): make error view draggable (#34627) (usrnk1, 2026-06-30)
- 63e2488 - feat(desktop): polish inline session title editing (#34607) (usrnk1, 2026-06-30)
- eaf42c4 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-06-30)
- 8e10ab0 - chore: bump venice provider (#34629) (Aiden Cline, 2026-06-30)
- b329fcc - fix(docs): fix Russian translation for index.mdx (#34001) (runvip, 2026-06-30)
- bd83177 - chore: generate (opencode-agent[bot], 2026-06-30)
- 06cb0de - feat(app): autocomplete mcp resources (#34597) (Brendan Allan, 2026-06-30)
- 3ca89ac - fix(app): autocomplete configured references (#34308) (opencode-agent[bot], 2026-06-30)
- 3aa2860 - fix(app): restore prompt cursor on focus (#34175) (Brendan Allan, 2026-06-30)
- ad63cf1 - feat(app): hide separators around active tabs (#34591) (usrnk1, 2026-06-30)
- aa56750 - fix(desktop): persist last active url (#34595) (Brendan Allan, 2026-06-30)
- 4aaed42 - fix(app): preserve macos titlebar inset (#34594) (opencode-agent[bot], 2026-06-30)
- f69f677 - feat(desktop): add hover background to session title and single-click edit (#34589) (usrnk1, 2026-06-30)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/core/src/tool/application-tools.ts` (+1, -1)
- `packages/core/src/tool/apply-patch.ts` (+1, -1)
- `packages/core/src/tool/bash.ts` (+1, -1)
- `packages/core/src/tool/builtins.ts` (+0, -16)
- `packages/core/src/tool/edit.ts` (+1, -1)
- `packages/core/src/tool/glob.ts` (+1, -1)
- `packages/core/src/tool/grep.ts` (+1, -1)
- `packages/core/src/tool/question.ts` (+1, -1)
- `packages/core/src/tool/read-filesystem.ts` (+1, -1)
- `packages/core/src/tool/read.ts` (+1, -1)
- `packages/core/src/tool/registry.ts` (+1, -6)
- `packages/core/src/tool/skill.ts` (+1, -1)
- `packages/core/src/tool/todowrite.ts` (+1, -1)
- `packages/core/src/tool/webfetch.ts` (+1, -1)
- `packages/core/src/tool/websearch.ts` (+1, -1)
- `packages/core/src/tool/write.ts` (+1, -1)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
- `packages/core/src/permission/saved.ts` (+1, -3)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/console/core/package.json` (+1, -1)
- `packages/core/package.json` (+2, -2)
- `packages/core/src/agent.ts` (+1, -1)
- `packages/core/src/aisdk.ts` (+0, -2)
- `packages/core/src/background-job.ts` (+1, -3)
- `packages/core/src/catalog.ts` (+1, -1)
- `packages/core/src/command.ts` (+1, -1)
- `packages/core/src/config.ts` (+2, -2)
- `packages/core/src/control-plane/move-session.ts` (+1, -8)
- `packages/core/src/credential.ts` (+1, -3)
- `packages/core/src/cross-spawn-spawner.ts` (+1, -2)
- `packages/core/src/database/database.ts` (+1, -7)
- `packages/core/src/event.ts` (+1, -3)
- `packages/core/src/file-mutation.ts` (+1, -1)
- `packages/core/src/filesystem.ts` (+0, -4)
- `packages/core/src/filesystem/watcher.ts` (+1, -3)
- `packages/core/src/fs-util.ts` (+1, -2)
- `packages/core/src/git.ts` (+1, -2)
- `packages/core/src/github-copilot/responses/convert-to-openai-responses-input.ts` (+5, -5)
- `packages/core/src/github-copilot/responses/openai-responses-language-model.ts` (+20, -20)
- `packages/core/src/global.ts` (+1, -2)
- `packages/core/src/image.ts` (+1, -1)
- `packages/core/src/instruction-context.ts` (+1, -1)
- `packages/core/src/location-mutation.ts` (+1, -1)
- `packages/core/src/location.ts` (+1, -1)
- `packages/core/src/models-dev.ts` (+1, -6)
- `packages/core/src/npm.ts` (+3, -8)
- `packages/core/src/permission.ts` (+1, -1)
- `packages/core/src/plugin.ts` (+1, -2)
- `packages/core/src/plugin/internal.ts` (+0, -2)
- `packages/core/src/policy.ts` (+1, -1)
- `packages/core/src/process.ts` (+1, -2)
- `packages/core/src/project.ts` (+1, -6)
- `packages/core/src/project/copy.ts` (+1, -1)
- `packages/core/src/project/directories.ts` (+1, -2)
- `packages/core/src/pty.ts` (+1, -1)
- `packages/core/src/pty/ticket.ts` (+1, -2)
- `packages/core/src/question.ts` (+1, -1)
- `packages/core/src/reference.ts` (+1, -1)
- `packages/core/src/reference/guidance.ts` (+1, -1)
- `packages/core/src/repository-cache.ts` (+1, -8)
- `packages/core/src/ripgrep.ts` (+1, -2)
- `packages/core/src/ripgrep/binary.ts` (+1, -7)
- `packages/core/src/session.ts` (+1, -10)
- `packages/core/src/session/execution/local.ts` (+1, -3)
- `packages/core/src/session/projector.ts` (+1, -2)
- `packages/core/src/session/runner/llm.ts` (+1, -3)
- `packages/core/src/session/store.ts` (+1, -3)
- `packages/core/src/session/todo.ts` (+1, -3)
- `packages/core/src/skill.ts` (+1, -3)
- `packages/core/src/skill/discovery.ts` (+1, -7)
- `packages/core/src/skill/guidance.ts` (+1, -1)
- `packages/core/src/snapshot.ts` (+1, -1)
- `packages/core/src/system-context/builtins.ts` (+1, -7)
- `packages/core/src/system-context/registry.ts` (+1, -1)
- `packages/core/src/tool-output-store.ts` (+6, -6)
- `packages/core/src/util/effect-flock.ts` (+1, -2)
- `packages/core/test/config/config.test.ts` (+34, -17)
- `packages/core/test/config/plugin.test.ts` (+3, -3)
- `packages/core/test/github-copilot/openai-responses-language-model.test.ts` (+206, -0)
- `packages/stats/core/package.json` (+1, -1)

#### Other Changes
- `bun.lock` (+36, -32)
- `nix/hashes.json` (+4, -4)
- `packages/app/e2e/performance/timeline/timeline-test-helpers.ts` (+1, -1)
- `packages/app/e2e/regression/cross-server-tab-close.spec.ts` (+2, -2)
- `packages/app/e2e/regression/session-request-docks.spec.ts` (+23, -0)
- `packages/app/e2e/regression/session-todo-dock-navigation.spec.ts` (+1, -1)
- `packages/app/e2e/smoke/session-timeline.spec.ts` (+2, -2)
- `packages/app/package.json` (+1, -1)
- `packages/app/src/app.tsx` (+11, -110)
- `packages/app/src/components/dialog-select-model.tsx` (+0, -1)
- `packages/app/src/components/prompt-input.tsx` (+129, -18)
- `packages/app/src/components/prompt-input/build-request-parts.test.ts` (+35, -0)
- `packages/app/src/components/prompt-input/build-request-parts.ts` (+22, -12)
- `packages/app/src/components/prompt-input/context-items.tsx` (+1, -1)
- `packages/app/src/components/prompt-input/slash-popover.tsx` (+98, -0)
- `packages/app/src/components/prompt-workspace-selector.tsx` (+11, -5)
- `packages/app/src/components/session/session-header.tsx` (+1, -0)
- `packages/app/src/components/titlebar-tab-nav.css` (+5, -1)
- `packages/app/src/components/titlebar-tab-nav.tsx` (+113, -66)
- `packages/app/src/components/titlebar-tab-popover.css` (+133, -0)
- `packages/app/src/components/titlebar-tab-popover.tsx` (+99, -0)
- `packages/app/src/components/titlebar-tab-strip.tsx` (+6, -1)
- `packages/app/src/components/titlebar.tsx` (+5, -4)
- `packages/app/src/context/global-sync/bootstrap.test.ts` (+3, -0)
- `packages/app/src/context/global-sync/bootstrap.ts` (+11, -1)
- `packages/app/src/context/global-sync/child-store.test.ts` (+7, -1)
- `packages/app/src/context/global-sync/child-store.ts` (+8, -0)
- `packages/app/src/context/global-sync/event-reducer.ts` (+5, -0)
- `packages/app/src/context/global-sync/types.ts` (+6, -0)
- `packages/app/src/context/platform.tsx` (+3, -0)
- `packages/app/src/context/prompt.tsx` (+12, -1)
- `packages/app/src/context/server-sync.tsx` (+22, -1)
- `packages/app/src/context/tabs.tsx` (+2, -2)
- `packages/app/src/i18n/en.ts` (+24, -0)
- `packages/app/src/pages/error.tsx` (+4, -1)
- `packages/app/src/pages/home.tsx` (+3, -9)
- `packages/app/src/pages/session.tsx` (+315, -90)
- `packages/app/src/pages/session/composer/session-question-dock.tsx` (+203, -140)
- `packages/app/src/pages/session/timeline/message-timeline.tsx` (+15, -9)
- `packages/app/src/utils/persist.ts` (+23, -1)
- `packages/app/src/wsl/add-server-probes.ts` (+57, -0)
- `packages/app/src/wsl/dialog-add-server.tsx` (+387, -547)
- `packages/app/src/wsl/dialog-add-wsl-server.css` (+392, -0)
- `packages/app/src/wsl/settings-model.test.ts` (+183, -9)
- `packages/app/src/wsl/settings-model.ts` (+332, -10)
- `packages/app/src/wsl/settings.tsx` (+1, -13)
- `packages/app/src/wsl/types.ts` (+2, -4)
- `packages/cli/package.json` (+1, -1)
- `packages/cli/src/commands/handlers/serve.ts` (+3, -2)
- `packages/cli/src/index.ts` (+1, -1)
- `packages/cli/src/services/daemon.ts` (+0, -2)
- `packages/cli/src/tui.ts` (+2, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/i18n/ar.ts` (+0, -1)
- `packages/console/app/src/i18n/br.ts` (+0, -1)
- `packages/console/app/src/i18n/da.ts` (+0, -1)
- `packages/console/app/src/i18n/de.ts` (+0, -1)
- `packages/console/app/src/i18n/en.ts` (+0, -1)
- `packages/console/app/src/i18n/es.ts` (+0, -1)
- `packages/console/app/src/i18n/fr.ts` (+0, -1)
- `packages/console/app/src/i18n/it.ts` (+0, -1)
- `packages/console/app/src/i18n/ja.ts` (+0, -1)
- `packages/console/app/src/i18n/ko.ts` (+0, -1)
- `packages/console/app/src/i18n/no.ts` (+0, -1)
- `packages/console/app/src/i18n/pl.ts` (+0, -1)
- `packages/console/app/src/i18n/ru.ts` (+0, -1)
- `packages/console/app/src/i18n/th.ts` (+0, -1)
- `packages/console/app/src/i18n/tr.ts` (+0, -1)
- `packages/console/app/src/i18n/uk.ts` (+0, -1)
- `packages/console/app/src/i18n/zh.ts` (+0, -1)
- `packages/console/app/src/i18n/zht.ts` (+0, -1)
- `packages/console/app/src/routes/go/index.css` (+0, -35)
- `packages/console/app/src/routes/go/index.tsx` (+5, -23)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/mail/package.json` (+1, -1)
- `packages/console/support/package.json` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/desktop/src/main/index.ts` (+29, -10)
- `packages/desktop/src/main/ipc.ts` (+12, -2)
- `packages/desktop/src/main/store-cleanup.test.ts` (+93, -0)
- `packages/desktop/src/main/store-cleanup.ts` (+94, -0)
- `packages/desktop/src/main/store-keys.ts` (+1, -0)
- `packages/desktop/src/main/store.ts` (+5, -0)
- `packages/desktop/src/main/windows.ts` (+73, -3)
- `packages/desktop/src/main/wsl/ipc.ts` (+4, -8)
- `packages/desktop/src/main/wsl/policy.ts` (+7, -0)
- `packages/desktop/src/main/wsl/servers.test.ts` (+65, -1)
- `packages/desktop/src/main/wsl/servers.ts` (+33, -11)
- `packages/desktop/src/preload/index.ts` (+2, -2)
- `packages/desktop/src/preload/types.ts` (+1, -0)
- `packages/desktop/src/renderer/index.tsx` (+65, -12)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/enterprise/package.json` (+1, -1)
- `packages/function/package.json` (+1, -1)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/llm/example/tutorial.ts` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/llm/src/route/executor.ts` (+1, -1)
- `packages/opencode/package.json` (+2, -2)
- `packages/opencode/src/cli/cmd/run.ts` (+12, -2)
- `packages/opencode/src/cli/cmd/run/variant.shared.ts` (+3, -2)
- `packages/opencode/src/cli/cmd/tui.ts` (+11, -2)
- `packages/opencode/src/cli/tui/layer.ts` (+2, -1)
- `packages/opencode/src/control-plane/workspace.ts` (+3, -11)
- `packages/opencode/src/effect/app-node-builder-v1.ts` (+12, -0)
- `packages/opencode/src/effect/app-runtime.ts` (+3, -5)
- `packages/opencode/src/effect/config-service.ts` (+6, -6)
- `packages/opencode/src/effect/runtime-flags.ts` (+2, -2)
- `packages/opencode/src/provider/transform.ts` (+25, -7)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+16, -13)
- `packages/opencode/src/session/session.ts` (+0, -73)
- `packages/opencode/test/cli/help/__snapshots__/help-snapshots.test.ts.snap` (+26, -30)
- `packages/opencode/test/effect/config-service.test.ts` (+4, -4)
- `packages/opencode/test/effect/runtime-flags.test.ts` (+3, -3)
- `packages/opencode/test/fixture/fixture.ts` (+2, -1)
- `packages/opencode/test/installation/installation.test.ts` (+2, -3)
- `packages/opencode/test/lib/cli-process.ts` (+7, -1)
- `packages/opencode/test/provider/provider.test.ts` (+4, -3)
- `packages/opencode/test/provider/transform.test.ts` (+232, -1)
- `packages/opencode/test/server/httpapi-authorization.test.ts` (+3, -3)
- `packages/opencode/test/server/httpapi-control-plane.test.ts` (+1, -1)
- `packages/opencode/test/server/httpapi-global.test.ts` (+1, -1)
- `packages/opencode/test/server/httpapi-ui.test.ts` (+1, -1)
- `packages/opencode/test/session/llm-native.test.ts` (+6, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk-next/src/opencode.ts` (+3, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/server/package.json` (+1, -1)
- `packages/server/src/auth.ts` (+2, -2)
- `packages/server/src/routes.ts` (+3, -3)
- `packages/session-ui/package.json` (+1, -1)
- `packages/session-ui/src/components/markdown-inline-code-kind.test.ts` (+14, -0)
- `packages/session-ui/src/components/markdown-inline-code-kind.ts` (+1907, -8)
- `packages/session-ui/src/components/message-part.css` (+47, -2)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/server/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/tui/test/app-lifecycle.test.tsx` (+3, -2)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/components/tooltip.tsx` (+2, -0)
- `packages/ui/src/v2/components/button-v2.css` (+10, -1)
- `packages/ui/src/v2/components/button-v2.stories.tsx` (+6, -5)
- `packages/ui/src/v2/components/button-v2.tsx` (+1, -1)
- `packages/ui/src/v2/components/icon.tsx` (+8, -0)
- `packages/ui/src/v2/components/loader-v2.css` (+32, -0)
- `packages/ui/src/v2/components/loader-v2.stories.tsx` (+42, -0)
- `packages/ui/src/v2/components/loader-v2.tsx` (+31, -0)
- `packages/ui/src/v2/components/radio-v2.css` (+6, -6)
- `packages/ui/src/v2/components/tooltip-v2.css` (+7, -0)
- `packages/ui/src/v2/components/tooltip-v2.tsx` (+2, -1)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/ar/zen.mdx` (+29, -26)
- `packages/web/src/content/docs/bs/zen.mdx` (+16, -13)
- `packages/web/src/content/docs/da/zen.mdx` (+29, -26)
- `packages/web/src/content/docs/de/zen.mdx` (+29, -26)
- `packages/web/src/content/docs/es/zen.mdx` (+16, -13)
- `packages/web/src/content/docs/fr/zen.mdx` (+16, -13)
- `packages/web/src/content/docs/it/zen.mdx` (+16, -13)
- `packages/web/src/content/docs/ja/zen.mdx` (+29, -26)
- `packages/web/src/content/docs/ko/zen.mdx` (+29, -26)
- `packages/web/src/content/docs/nb/zen.mdx` (+29, -26)
- `packages/web/src/content/docs/pl/zen.mdx` (+29, -26)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+16, -13)
- `packages/web/src/content/docs/ru/index.mdx` (+3, -3)
- `packages/web/src/content/docs/ru/zen.mdx` (+29, -26)
- `packages/web/src/content/docs/th/zen.mdx` (+29, -26)
- `packages/web/src/content/docs/tr/zen.mdx` (+16, -13)
- `packages/web/src/content/docs/zen.mdx` (+29, -26)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+29, -26)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+29, -26)
- `patches/@tanstack%2Fvirtual-core@3.17.0.patch` (+51, -4)
- `sdks/vscode/package.json` (+1, -1)
- `specs/v2/config.md` (+2, -0)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index bc7c31c..239f78d 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.17.11",
+  "version": "1.17.12",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index edd9827..61e73ad 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.17.11",
+  "version": "1.17.12",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
@@ -121,7 +121,7 @@
     "npm-package-arg": "13.0.2",
     "semver": "^7.6.3",
     "turndown": "7.2.0",
-    "venice-ai-sdk-provider": "2.0.2",
+    "venice-ai-sdk-provider": "2.1.1",
     "which": "6.0.1",
     "xdg-basedir": "5.1.0",
     "zod": "catalog:"
```

#### packages/core/src/agent.ts
```diff
diff --git a/packages/core/src/agent.ts b/packages/core/src/agent.ts
index ebdecb5..da86cf8 100644
--- a/packages/core/src/agent.ts
+++ b/packages/core/src/agent.ts
@@ -42,7 +42,7 @@ export interface Interface extends State.Transformable<Draft> {
 
 export class Service extends Context.Service<Service, Interface>()("@opencode/v2/Agent") {}
 
-export const layer = Layer.effect(
+const layer = Layer.effect(
   Service,
   Effect.gen(function* () {
     const state = State.create<Data, Draft>({
```

#### packages/core/src/aisdk.ts
```diff
diff --git a/packages/core/src/aisdk.ts b/packages/core/src/aisdk.ts
index 485faaa..b604dac 100644
--- a/packages/core/src/aisdk.ts
+++ b/packages/core/src/aisdk.ts
@@ -233,5 +233,3 @@ export const locationLayer = Layer.effect(
 )
 
 export const node = makeLocationNode({ service: Service, layer: locationLayer, deps: [] })
-
-export const defaultLayer = locationLayer
```

#### packages/core/src/background-job.ts
```diff
diff --git a/packages/core/src/background-job.ts b/packages/core/src/background-job.ts
index 4287830..cdffd21 100644
--- a/packages/core/src/background-job.ts
+++ b/packages/core/src/background-job.ts
@@ -360,8 +360,6 @@ export const make = Effect.gen(function* () {
   return Service.of({ list, get, start, extend, wait, waitForPromotion, promote, cancel })
 })
 
-export const layer = Layer.effect(Service, make)
-
-export const defaultLayer = layer
+const layer = Layer.effect(Service, make)
 
 export const node = makeGlobalNode({ service: Service, layer, deps: [] })
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/kilocode/agent/options.ts
- `src/core/` - review core changes from packages/core/package.json
- `src/tool/application-tools.ts` - update based on opencode packages/core/src/tool/application-tools.ts changes
- `src/tool/apply-patch.ts` - update based on opencode packages/core/src/tool/apply-patch.ts changes
- `src/tool/bash.ts` - update based on opencode packages/core/src/tool/bash.ts changes
- `src/tool/builtins.ts` - update based on opencode packages/core/src/tool/builtins.ts changes
- `src/tool/edit.ts` - update based on opencode packages/core/src/tool/edit.ts changes
- `src/tool/glob.ts` - update based on opencode packages/core/src/tool/glob.ts changes
- `src/tool/grep.ts` - update based on opencode packages/core/src/tool/grep.ts changes
- `src/tool/question.ts` - update based on opencode packages/core/src/tool/question.ts changes
- `src/tool/read-filesystem.ts` - update based on opencode packages/core/src/tool/read-filesystem.ts changes
- `src/tool/read.ts` - update based on opencode packages/core/src/tool/read.ts changes
- `src/tool/registry.ts` - update based on opencode packages/core/src/tool/registry.ts changes
- `src/tool/skill.ts` - update based on opencode packages/core/src/tool/skill.ts changes
- `src/tool/todowrite.ts` - update based on opencode packages/core/src/tool/todowrite.ts changes
- `src/tool/webfetch.ts` - update based on opencode packages/core/src/tool/webfetch.ts changes
- `src/tool/websearch.ts` - update based on opencode packages/core/src/tool/websearch.ts changes
- `src/tool/write.ts` - update based on opencode packages/core/src/tool/write.ts changes
