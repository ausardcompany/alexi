# Upstream Changes Report
Generated: 2026-10-16 10:51:37

## Summary
- kilocode: 78 commits, 151 files changed
- opencode: 66 commits, 524 files changed

## kilocode Changes (e3ef95471..3a3271de2)

### Commits

- 3a3271de2 - Merge pull request #15152 from Kilo-Org/docs/community-triage-refresh (Bruno Agatão, 2026-10-16)
- 97b32422f - docs: refresh community triage doc (Bruno Agatao, 2026-10-16)
- f7dcf7eca - Merge pull request #15148 from Kilo-Org/feat/community-priority-labels (Bruno Agatão, 2026-10-16)
- 6073c893e - refactor: derive priority label rule from one list (Bruno Agatao, 2026-10-16)
- 7b80bbeec - Merge pull request #15150 from Kilo-Org/fix/community-triage-desktop-area (Bruno Agatão, 2026-10-16)
- 750b890e8 - fix: label Kilo Desktop titles as area:desktop and make Slack posting optional (Bruno Agatao, 2026-10-16)
- e7c089a2a - feat: add priority labels to community triage (Bruno Agatao, 2026-10-16)
- 57b62285c - Merge pull request #13722 from maphew/fix/tui-dialog-filter-home-end (Andrea Giammarchi, 2026-10-16)
- fa41c528e - Merge branch 'main' into fix/tui-dialog-filter-home-end (Andrea Giammarchi, 2026-10-16)
- 75e12d2d8 - Merge pull request #13260 from waewoo/fix/openai-compatible-null-tool-content-current (Andrea Giammarchi, 2026-10-16)
- 65651ccf9 - Merge pull request #15119 from Kilo-Org/improve-base-branch-selection-ui-2 (Marius, 2026-10-16)
- 0203df94f - chore: update kilo-vscode visual regression baselines (kilo-maintainer[bot], 2026-10-16)
- 53f12afae - Merge pull request #15123 from Kilo-Org/feat/community-triage-quick-wins (Bruno Agatão, 2026-10-16)
- e5e37f0ff - fix(agent-manager): keep the New Worktree prompt gutter and CSS prefix rule (marius-kilocode, 2026-10-16)
- de114a5c1 - fix(agent-manager): make Create Worktree hover visible in all themes (marius-kilocode, 2026-10-16)
- 09eb6450b - fix(agent-manager): keep New Worktree dialog vertically centered (marius-kilocode, 2026-10-16)
- 67c97dda4 - feat(agent-manager): polish New Worktree dialog layout and spacing (marius-kilocode, 2026-10-16)
- 5a2d1fb83 - fix(agent-manager): bound New Worktree branch cache to recent projects (marius-kilocode, 2026-10-16)
- 8211c1641 - feat(agent-manager): replace advanced options with inline branch name field (marius-kilocode, 2026-10-16)
- 0c8502897 - Merge pull request #15115 from MihaelaStoica/docs/kilo-desktop-0.1.12 (Emilie Lima Schario, 2026-10-15)
- c6efc4db8 - Merge main into feat/community-triage-quick-wins (Bruno Agatao, 2026-10-15)
- 598fe5f88 - Merge pull request #15126 from Kilo-Org/fix/community-triage-slack-failure (Bruno Agatão, 2026-10-15)
- e78eb83cb - fix: skip webhook fallback when only a Slack thread reply fails (Bruno Agatao, 2026-10-15)
- 0317435a1 - Merge pull request #15130 from Kilo-Org/jetbrains/release/v7.1.10 (Kirill Kalishev, 2026-10-15)
- 2379bb7c9 - docs(jetbrains): edit changelog for v7.1.10 (Kirill Kalishev, 2026-10-15)
- b9929b156 - release(jetbrains): v7.1.10 (kilo-maintainer[bot], 2026-10-15)
- 807d2e263 - Merge pull request #15107 from Kilo-Org/chore/jetbrains-cli-pin-v7.8.12 (Kirill Kalishev, 2026-10-15)
- b5aec036c - fix: keep the sweep green when the Slack bot post fails (Bruno Agatao, 2026-10-15)
- d1a025c13 - Merge pull request #15118 from Kilo-Org/fix/anaconda-yellow-hover (Emilie Lima Schario, 2026-10-15)
- ff0209303 - fix: repair docs quick-win rule and test (Bruno Agatao, 2026-10-15)
- cca659b5a - fix: exclude agent definitions and changesets from docs quick wins (Bruno Agatao, 2026-10-15)
- 50b47a9e1 - feat: label first-time contributors and quick wins in community triage (Bruno Agatao, 2026-10-15)
- 6d4790c13 - fix(vscode): preserve diff mascot hover token (Josh Lambert, 2026-10-15)
- cbdb0459c - feat(agent-manager): pick base branch next to project in New Worktree dialog (marius-kilocode, 2026-10-15)
- 33e670164 - fix: match Anaconda brand yellow hover color (Josh Lambert, 2026-10-15)
- bb6bb187a - Merge pull request #15113 from Kilo-Org/vscode/brand-yellow-ffdd00 (Emilie Lima Schario, 2026-10-15)
- 8fccbbd38 - Merge pull request #14866 from Kilo-Org/clever-canyon (Kirill Kalishev, 2026-10-15)
- b244dba9a - Merge pull request #14942 from Kilo-Org/electric-zephyr (Kirill Kalishev, 2026-10-15)
- b83f0239b - Merge pull request #15112 from Kilo-Org/fix/jetbrains-brand-yellow (Emilie Lima Schario, 2026-10-15)
- 3b7527cfe - Merge pull request #15114 from Kilo-Org/cli/brand-yellow (Emilie Lima Schario, 2026-10-15)
- 31ed2ea8d - fix(vscode): keep brand yellow on brand marks only (Emilie Schario, 2026-10-15)
- 37a93f792 - Merge pull request #15089 from Kilo-Org/docs/siwc-usage-data (Emilie Lima Schario, 2026-10-15)
- f2e5195fd - fix(vscode): match docs yellow split for light themes (Emilie Schario, 2026-10-15)
- 1dbe1b665 - fix(vscode): keep brand yellow readable on light themes (Emilie Schario, 2026-10-15)
- 9f48d40fa - fix(vscode): use brand yellow for extension highlights (Emilie Schario, 2026-10-15)
- 7fe8d82a0 - docs: keep ChatGPT limit notes under costs (Emilie Schario, 2026-10-15)
- dc44728cf - fix(cli): lowercase hex colors and make logo mode-aware (kiloconnect[bot], 2026-10-15)
- 4cb923bf0 - fix(cli): make Kilo logo color mode-aware (kiloconnect[bot], 2026-10-15)
- c6f1b088d - fix(cli): make Kilo logo color mode-aware (kiloconnect[bot], 2026-10-15)
- ba0410fbd - fix(vscode): update brand yellow to #FFDD00 (Emilie Schario, 2026-10-15)
- f1927fb3e - fix(cli): use brand yellow for the CLI theme (Emilie Schario, 2026-10-15)
- 3cb768590 - fix(jetbrains): use primary brand yellow for logos (Emilie Schario, 2026-10-15)
- 204c6e823 - Merge pull request #14756 from thomasbrugman/docs/mistral-autocomplete-keys (Bruno Agatão, 2026-10-15)
- 50ee54db5 - chore(jetbrains): bump CLI pin to v7.8.12 (kilo-maintainer[bot], 2026-10-15)
- 2f5bf72b1 - docs: show Sign in with ChatGPT in usage data (Emilie Schario, 2026-10-14)
- bfef8bcec - fix(vscode): render provider failure reasons reactively (kirillk, 2026-10-14)
- 039f73144 - docs(cli): spell out dropped custom-delegator edit rules (kirillk, 2026-10-14)
- 0c8849c18 - fix(cli): preserve custom subagent edit permissions (kirillk, 2026-10-14)
- 1d3361cd3 - docs(kilo-docs): update Kilo Desktop docs for 0.1.12 (Mihaela Stoica, 2026-10-14)
- ebd71d01f - fix(tui): gate only conflicting home/end keys, keep custom bindings active (matt wilkie, 2026-10-13)
- 3d722e54b - fix(tui): gate only home/end keys in dialog filter (maphew, 2026-10-13)
- 952d2d1b7 - chore: add changeset for dialog filter Home/End fix (maphew, 2026-10-13)
- f0cf863fa - test(tui): wait for list moves to settle in filter key test (maphew, 2026-10-13)
- e0c2e656d - fix(tui): gate dialog list jumps on filter content and focus (maphew, 2026-10-13)
- 205df6e69 - fix(tui): keep home/end text movement in dialog filter inputs (maphew, 2026-10-13)
- 656564b26 - docs(mistral): use Studio keys in provider setup guide (Thomas Brugman, 2026-10-13)
- 4fe352777 - docs(mistral): remove obsolete Codestral BYOK provider entry (Thomas Brugman, 2026-10-13)
- 77c64200e - Merge branch 'main' into docs/mistral-autocomplete-keys (Thomas Brugman, 2026-10-11)
- 36c080198 - test(cli): expect failures in the remote list_models response (kirillk, 2026-10-10)
- 8d5c126dc - fix(cli): make OpenAI-compatible tool content normalization opt-in (default, 2026-10-09)
- e2c83aefb - test(cli): use a real RGBA instance in the provider dialog test (kirillk, 2026-10-08)
- b7672ae50 - fix: report why a provider failed to load instead of hiding it (kirillk, 2026-10-08)
- e703b5637 - fix(agent-manager): reject internal agents and always list valid ones (kirillk, 2026-10-07)
- 4fcf08b5e - fix(agent-manager): publish the agent name trimmed (kirillk, 2026-10-06)
- f01b273c1 - feat(agent-manager): run a named agent for tool-started sessions (kirillk, 2026-10-06)
- 124482f4e - docs: align Mistral autocomplete cross-references (Thomas Brugman, 2026-10-02)
- 8e65c2a7d - Merge branch 'main' into docs/mistral-autocomplete-keys (Thomas Brugman, 2026-10-02)
- cd219d03d - docs: update Mistral autocomplete API key setup (Thomas Brugman, 2026-10-02)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/agent-manager.ts` (+42, -1)
- `packages/opencode/src/kilocode/tool/agent-manager.txt` (+3, -3)
- `packages/opencode/src/kilocode/tool/task.ts` (+15, -8)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
(no changes)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
(no changes)

#### Other Changes
- `.changeset/agent-manager-agent-validation.md` (+5, -0)
- `.changeset/agent-manager-custom-agent-field.md` (+5, -0)
- `.changeset/anaconda-yellow-hover.md` (+5, -0)
- `.changeset/cli-brand-yellow.md` (+5, -0)
- `.changeset/custom-delegator-edit-permissions.md` (+5, -0)
- `.changeset/dialog-filter-home-end.md` (+5, -0)
- `.changeset/jetbrains-brand-yellow.md` (+5, -0)
- `.changeset/openai-compatible-tool-content.md` (+5, -0)
- `.changeset/provider-failure-reason.md` (+6, -0)
- `.changeset/vscode-brand-yellow.md` (+5, -0)
- `.changeset/worktree-base-branch-header.md` (+5, -0)
- `.github/workflows/community-sweep.yml` (+16, -5)
- `docs/community-triage.md` (+65, -17)
- `packages/kilo-console/src/routes/config/state/ui.ts` (+2, -2)
- `packages/kilo-docs/lib/nav/ai-providers.ts` (+1, -1)
- `packages/kilo-docs/pages/ai-providers/mistral.md` (+7, -12)
- `packages/kilo-docs/pages/ai-providers/openai-chatgpt-plus-pro.md` (+11, -3)
- `packages/kilo-docs/pages/ai-providers/openai-compatible.md` (+1, -0)
- `packages/kilo-docs/pages/code-with-ai/features/autocomplete/index.md` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/features/autocomplete/mistral-setup.md` (+39, -53)
- `packages/kilo-docs/pages/collaborate/teams/analytics.md` (+2, -0)
- `packages/kilo-docs/pages/customize/context/codebase-indexing.md` (+2, -2)
- `packages/kilo-docs/pages/desktop/features/browser.md` (+2, -2)
- `packages/kilo-docs/pages/desktop/features/environments.md` (+11, -1)
- `packages/kilo-docs/pages/desktop/features/files.md` (+1, -1)
- `packages/kilo-docs/pages/desktop/features/git.md` (+4, -2)
- `packages/kilo-docs/pages/desktop/features/notebooks.md` (+10, -0)
- `packages/kilo-docs/pages/desktop/installation.md` (+2, -2)
- `packages/kilo-docs/pages/desktop/quickstart.md` (+8, -4)
- `packages/kilo-docs/pages/desktop/settings/ai.md` (+10, -0)
- `packages/kilo-docs/pages/desktop/settings/general.md` (+15, -6)
- `packages/kilo-docs/pages/desktop/troubleshooting.md` (+5, -0)
- `packages/kilo-docs/pages/getting-started/byok.md` (+0, -1)
- `packages/kilo-docs/pages/getting-started/cost-controls-and-usage-safeguards.md` (+2, -0)
- `packages/kilo-docs/pages/getting-started/faq/credits-and-billing.md` (+2, -2)
- `packages/kilo-docs/pages/getting-started/setup-authentication.md` (+2, -2)
- `packages/kilo-docs/pages/getting-started/using-kilo-for-free.md` (+7, -7)
- `packages/kilo-docs/public/globals.css` (+1, -1)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/agentmanager/new-worktree-project-dropdown-chromium-linux.png` (+2, -2)
- `packages/kilo-jetbrains/CHANGELOG.md` (+49, -0)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/kilo-content.svg` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/kilo-content_dark.svg` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/kilo-profile.svg` (+1, -1)
- `packages/kilo-jetbrains/frontend/src/main/resources/icons/kilo-profile_dark.svg` (+1, -1)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-jetbrains/src/main/resources/META-INF/pluginIcon.svg` (+1, -1)
- `packages/kilo-vscode/assets/icons/kilo-dark.svg` (+1, -1)
- `packages/kilo-vscode/assets/icons/kilo-light.svg` (+1, -1)
- `packages/kilo-vscode/assets/icons/kilo-yellow.lottie` (+-, --)
- `packages/kilo-vscode/src/KiloProvider.ts` (+1, -0)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+7, -6)
- `packages/kilo-vscode/src/agent-manager/branch-name.ts` (+3, -13)
- `packages/kilo-vscode/src/agent-manager/session-create.ts` (+23, -0)
- `packages/kilo-vscode/src/agent-manager/tool-start.ts` (+16, -5)
- `packages/kilo-vscode/src/shared/branch-slug.ts` (+14, -0)
- `packages/kilo-vscode/src/shared/provider-model.ts` (+32, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-arch.test.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-new-worktree-project.test.ts` (+2, -2)
- `packages/kilo-vscode/tests/unit/agent-manager-tool-start.test.ts` (+95, -0)
- `packages/kilo-vscode/tests/unit/model-selector-lifecycle.test.ts` (+2, -1)
- `packages/kilo-vscode/tests/unit/new-worktree-branch.test.ts` (+1, -3)
- `packages/kilo-vscode/tests/unit/new-worktree-dialog-sandbox.test.ts` (+20, -0)
- `packages/kilo-vscode/tests/unit/provider-failure.test.ts` (+60, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/NewWorktreeDialog.tsx` (+172, -232)
- `packages/kilo-vscode/webview-ui/agent-manager/ProjectBranchDialog.tsx` (+2, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/WorktreeOrigin.tsx` (+210, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+379, -106)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ar.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/br.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/bs.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/da.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/de.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/en.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/es.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fa.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/fr.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/it.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ja.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ko.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/nl.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/no.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/pl.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/ru.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/th.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/tr.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/uk.ts` (+5, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zh.ts` (+4, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/i18n/zht.ts` (+4, -1)
- `packages/kilo-vscode/webview-ui/diff-viewer/BaseBranchPicker.tsx` (+2, -2)
- `packages/kilo-vscode/webview-ui/diff-viewer/DiffEndMarker.tsx` (+4, -4)
- `packages/kilo-vscode/webview-ui/src/components/settings/ProviderSelectDialog.tsx` (+43, -21)
- `packages/kilo-vscode/webview-ui/src/components/settings/ProvidersTab.tsx` (+55, -21)
- `packages/kilo-vscode/webview-ui/src/components/settings/provider-catalog.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/components/shared/BranchSelect.tsx` (+27, -5)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelSelector.tsx` (+12, -4)
- `packages/kilo-vscode/webview-ui/src/context/provider.tsx` (+7, -1)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fa.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+9, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/stories/agent-manager.stories.tsx` (+27, -42)
- `packages/kilo-vscode/webview-ui/src/styles/brand.css` (+6, -0)
- `packages/kilo-vscode/webview-ui/src/styles/chat.css` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+3, -1)
- `packages/opencode/src/kilo-sessions/remote-model-catalog.ts` (+1, -0)
- `packages/opencode/src/kilocode/agent-manager/event.ts` (+3, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/component/dialog-provider.tsx` (+27, -8)
- `packages/opencode/src/kilocode/provider/cloud-auth.ts` (+30, -0)
- `packages/opencode/src/provider/provider.ts` (+10, -0)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/provider.ts` (+32, -0)
- `packages/opencode/test/cli/run/runtime.boot.test.ts` (+4, -0)
- `packages/opencode/test/kilocode/agent-manager-tool.test.ts` (+180, -2)
- `packages/opencode/test/kilocode/cli/tui/component/dialog-provider.test.ts` (+70, -0)
- `packages/opencode/test/kilocode/provider/openai-compatible-content.test.ts` (+130, -0)
- `packages/opencode/test/kilocode/server/provider-auth-failure.test.ts` (+59, -8)
- `packages/opencode/test/kilocode/session-prompt-permission-refresh.test.ts` (+95, -0)
- `packages/opencode/test/kilocode/sessions/remote-model-catalog.test.ts` (+1, -0)
- `packages/opencode/test/kilocode/sessions/remote-sender.test.ts` (+1, -0)
- `packages/opencode/test/kilocode/task-edit-permissions.test.ts` (+201, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+7, -0)
- `packages/sdk/openapi.json` (+89, -5)
- `packages/tui/src/component/dialog-provider.tsx` (+2, -1)
- `packages/tui/src/component/kilo-logo.tsx` (+6, -7)
- `packages/tui/src/context/sync.tsx` (+1, -0)
- `packages/tui/src/theme/assets/kilo.json` (+6, -6)
- `packages/tui/src/ui/dialog-select.tsx` (+49, -24)
- `packages/tui/test/dialog-filter-home-end.test.tsx` (+149, -0)
- `script/kilocode/community-triage.test.ts` (+134, -0)
- `script/kilocode/community-triage.ts` (+138, -10)

### Key Diffs

#### packages/opencode/src/kilocode/tool/agent-manager.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/agent-manager.ts b/packages/opencode/src/kilocode/tool/agent-manager.ts
index 3cfc97c05..4522dd229 100644
--- a/packages/opencode/src/kilocode/tool/agent-manager.ts
+++ b/packages/opencode/src/kilocode/tool/agent-manager.ts
@@ -1,3 +1,4 @@
+import { Agent } from "@/agent/agent"
 import { Bus } from "@/bus"
 import { InstanceState } from "@/effect/instance-state"
 import { AgentManagerEvent, type AgentManagerTask } from "@/kilocode/agent-manager/event"
@@ -24,6 +25,10 @@ const Task = Schema.Struct({
   branchName: Schema.optional(Schema.NullOr(Schema.String)).annotate({
     description: "Git branch name seed for worktree mode",
   }),
+  agent: Schema.optional(Schema.NullOr(Schema.String)).annotate({
+    description:
+      "Optional agent name to run the new session as (e.g. a custom agent configured with mode 'all'). Must be a selectable primary agent: not a mode: 'subagent' agent and not an internal/hidden one. Omit to use the workspace default agent; prefer the name the user asked for. A rejected name lists the selectable agents.",
+  }),
   model: Schema.optional(Schema.NullOr(Schema.String)).annotate({
     description:
       "Optional model override from agent_manager_models (e.g. 'Claude Opus 4.1'). Omit unless the user requests a different model. Agent Manager otherwise inherits the current turn's model. A qualified provider/model ID is also accepted to force a specific provider.",
@@ -225,6 +230,7 @@ function select(
     ...(task.prompt != null ? { prompt: task.prompt } : {}),
     ...(task.name != null ? { name: task.name } : {}),
     ...(task.branchName != null ? { branchName: task.branchName } : {}),
+    ...(task.agent?.trim() ? { agent: task.agent.trim() } : {}),
   }
   if (!task.model?.trim() && !task.variant?.trim()) {
     return { task: task.prompt?.trim() && source ? { ...base, ...source } : base }
@@ -249,7 +255,7 @@ export const AgentManagerTool = Tool.define<
     sessionID?: string
     questionID?: string
   },
-  AgentManager.Service | Bus.Service | Provider.Service,
+  AgentManager.Service | Bus.Service | Provider.Service | Agent.Service,
   "agent_manager"
 >(
   "agent_manager",
@@ -257,6 +263,7 @@ export const AgentManagerTool = Tool.define<
     const bus = yield* Bus.Service
     const host = yield* AgentManager.Service
     const provider = yield* Provider.Service
+    const agents = yield* Agent.Service
     const wire = ToolJsonSchema.fromSchema(WireParams)
     const section = wire.properties?.sectionID
     if (section && typeof section === "object" && wire.properties) {
@@ -421,6 +428,40 @@ export const AgentManagerTool = Tool.define<
                 ...(msg.model.variant ? { variant: msg.model.variant } : {}),
               }
             : undefined
+          const agentNames = params.tasks.flatMap((task) => (task.agent?.trim() ? [task.agent.trim()] : []))
```

#### packages/opencode/src/kilocode/tool/agent-manager.txt
```diff
diff --git a/packages/opencode/src/kilocode/tool/agent-manager.txt b/packages/opencode/src/kilocode/tool/agent-manager.txt
index 38d53d65f..ee3c4a06d 100644
--- a/packages/opencode/src/kilocode/tool/agent-manager.txt
+++ b/packages/opencode/src/kilocode/tool/agent-manager.txt
@@ -16,10 +16,10 @@ Modes:
 - `worktree`: creates a new Agent Manager git worktree for each task, like the New Worktree dialog.
 - `local`: creates sessions in the caller's directory, or an existing managed worktree selected by `worktreeID` from `action: "list"`.
 
-Each task may provide a prompt, a short display name, a branch name, a `model`, an optional `provider`, and a model-specific reasoning `variant`. By default, omit `model`, `provider`, and `variant`: prompted tasks inherit the exact model and reasoning variant used by the current turn. Only specify `model` when the user explicitly asks to use or compare a different model, and only specify `variant` when the user explicitly asks for a different reasoning variant. A variant can be specified without a model to override the inherited model's variant. Specify `provider` with `model` to force a model-name match to one provider ID. Never choose a different model merely because work is being fanned out. Specify an override `model` by name (e.g. "Claude Opus 4.1"); the name is matched leniently (case-insensitive, punctuation/spacing-insensitive, order-independent), so an approximate name like "opus 4.1" works and you do not need the exact name. Agent Manager picks the provider for you, preferring the provider used by the current turn and falling back to the Kilo Gateway. A qualified `provider/model` ID is also accepted to force a specific provider. If the name is ambiguous and matches several different models, the tool returns the candidates so you can choose. A model or variant selection requires an initial prompt so the session can persist that selection. Keep display names short because Agent Manager cards are narrow. Explicit branch names must be valid Git branch names and are preserved, including slashes; worktree directories use separate safe names. Collision and version suffixes may be appended. Use `agent_manager_models` to search available models and variants on demand instead of guessing or loading the full model catalog. Prepared sessions without an initial prompt use the normal defaults. The agent and base branch settings always use the normal defaults.
+Each task may provide a prompt, a short display name, a branch name, a `model`, an optional `provider`, a model-specific reasoning `variant`, and an `agent`. By default, omit `model`, `provider`, and `variant`: prompted tasks inherit the exact model and reasoning variant used by the current turn. Only specify `model` when the user explicitly asks to use or compare a different model, and only specify `variant` when the user explicitly asks for a different reasoning variant. A variant can be specified without a model to override the inherited model's variant. Specify `provider` with `model` to force a model-name match to one provider ID. Never choose a different model merely because work is being fanned out. Specify an override `model` by name (e.g. "Claude Opus 4.1"); the name is matched leniently (case-insensitive, punctuation/spacing-insensitive, order-independent), so an approximate name like "opus 4.1" works and you do not need the exact name. Agent Manager picks the provider for you, preferring the provider used by the current turn and falling back to the Kilo Gateway. A qualified `provider/model` ID is also accepted to force a specific provider. If the name is ambiguous and matches several different models, the tool returns the candidates so you can choose. A model or variant selection requires an initial prompt so the session can persist that selection. Keep display names short because Agent Manager cards are narrow. Explicit branch names must be valid Git branch names and are preserved, including slashes; worktree directories use separate safe names. Collision and version suffixes may be appended. Use `agent_manager_models` to search available models and variants on demand instead of guessing or loading the full model catalog. Prepared sessions without an initial prompt still use any specified `agent`; only the base branch always uses the normal default.
+
+By default, each spawned session uses the workspace default agent. Specify `agent` by name when the user wants a particular agent — including a custom agent with its own edit/bash/MCP permission rules — to run the work, instead of the workspace default. Use the name the user asked for; do not guess one. The named agent must be selectable as a primary agent (configured with `mode: "all"` or `mode: "primary"`, not `mode: "subagent"`, and not internal/hidden); any other name fails the request without starting a session and the error lists the selectable agents, so recover by reading that list rather than retrying blindly. Do not use this for ordinary subagent research: use the `task` tool for internal subagents, and reserve `agent_manager`'s `agent` field for cases where the user wants a visible, named-agent Agent Manager session in the extension. The `task` tool's "Available agent types" list is not valid here — it enumerates subagents, which this field rejects.
 
 By default, multiple tasks are started as independent Agent Manager sessions. Set `versions` to true only when all tasks are alternate versions of the same work that should be compared together. Versioned worktrees are grouped in Agent Manager and branch names may receive version suffixes.
 
 If available, use `kilo_local_recall` only if you need context from a completed Agent Manager session.
-
-Do not use this for ordinary subagent research. Use the `task` tool for internal subagents, and use this only when the user wants visible Agent Manager sessions in the extension.
```

#### packages/opencode/src/kilocode/tool/task.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/task.ts b/packages/opencode/src/kilocode/tool/task.ts
index dc22d32e7..493aba21b 100644
--- a/packages/opencode/src/kilocode/tool/task.ts
+++ b/packages/opencode/src/kilocode/tool/task.ts
@@ -96,9 +96,13 @@ export namespace KiloTask {
    * overriding the selected subagent's own allowlist with parent ask/allow rules.
    *
    * OpenCode removed parent-agent inheritance entirely in anomalyco/opencode#31696.
-   * Kilo intentionally differs: parent edit/notebook/MCP denials remain hard ceilings
-   * for Plan Mode and MCP restrictions, while parent ask/allow rules must not replace
-   * the selected subagent's policy. Preserve this distinction during upstream merges.
+   * Kilo intentionally differs: native-agent edit denials and parent notebook/MCP denials
+   * remain hard ceilings for Plan Mode and MCP restrictions. A custom delegator's edit
+   * policy governs only that agent: it is not projected onto the subagents it starts, so
+   * even path-scoped denies such as `edit: { "secrets/**": "deny" }` stop there and no
+   * longer confine delegated writes. Session edit denials still constrain every descendant,
+   * so use a session-level edit restriction to confine a delegated workflow.
+   * Parent ask/allow rules must not replace the selected subagent's policy.
    *
    * Broad bash denies are deliberately NOT inherited from the calling agent. A read-only/delegating
    * agent (plan, ask, orchestrator) carries a `readOnlyBash` allowlist whose deny rules
@@ -119,18 +123,21 @@ export namespace KiloTask {
     session: Pick<Session.Info, "permission">
     mcp: Config.Info["mcp"]
   }): Permission.Ruleset {
-    const rules = Permission.merge(input.caller.permission ?? [], input.session.permission ?? [])
+    const session = input.session.permission ?? []
+    const rules = Permission.merge(input.caller.permission ?? [], session)
+    const edit = input.caller.native === false ? session : rules
     const prefixes = Object.keys(input.mcp ?? {}).map((k) => k.replace(/[^a-zA-Z0-9_-]/g, "_") + "_")
     const isMcp = (p: string) => prefixes.some((prefix) => p.startsWith(prefix))
     // `guarded` covers the tools a read-only mode may never regain from config; keeping
     // it here too stops a Plan-launched subagent from reaching them under a catch-all.
     // `bash` is intentionally excluded — see the doc comment above (#11523).
     const mutation = new Set(["edit", ...guarded.filter((p) => p !== "bash")])
-    const inherited = rules.filter(
-      (r: Permission.Rule) => r.action === "deny" && (mutation.has(r.permission) || isMcp(r.permission)),
-    )
+    const inherited = [
+      ...rules.filter((rule) => rule.permission !== "edit"),
+      ...edit.filter((rule) => rule.permission === "edit"),
+    ].filter((r: Permission.Rule) => r.action === "deny" && (mutation.has(r.permission) || isMcp(r.permission)))
     for (const permission of mutation) {
-      if (Permission.evaluate(permission, "*", rules).action !== "deny") continue
+      if (Permission.evaluate(permission, "*", permission === "edit" ? edit : rules).action !== "deny") continue
       inherited.push({ permission, pattern: "*", action: "deny" })
     }
     const scoped = rules.filter((rule) => rule.permission !== "*")
```


## opencode Changes (4397ee4..00e7472)

### Commits

- 00e7472 - feat(tui): new dialog designs behind new designs experiment (#55810) (Aarav Sareen, 2026-10-16)
- 50d4280 - refactor(tui): build DialogSelect on DialogLayout (#55799) (Aarav Sareen, 2026-10-16)
- c5e513e - feat(tui): add opencode2 theme and text.faint token (#55798) (Aarav Sareen, 2026-10-16)
- 09ef07e - feat(tui): add new designs experiment (#55818) (Aarav Sareen, 2026-10-16)
- 7b99646 - docs(go): remove retired Go models (#55761) (Jack, 2026-10-16)
- 37e3912 - docs(console): add GLM-5.3-Flash Free (#55975) (Jack, 2026-10-16)
- f0c122f - fix(update): cache rollout fallback reads (#55205) (Aiden Cline, 2026-10-16)
- e3d10de - docs(console): add LL Alpha Free (#55969) (opencode-agent[bot], 2026-10-15)
- 538f8b1 - fix(core): respell variants when config changes a catalog model's package (#55962) (Aiden Cline, 2026-10-16)
- f09eee5 - fix(core): treat unreadable config file references as empty (#55959) (Aiden Cline, 2026-10-16)
- 4cce6ae - fix(core): prioritize preferred free OpenCode models when signed out (#55972) (Aiden Cline, 2026-10-16)
- ccc6a3f - fix(core): escape env config values that break parsing (#55915) (Aiden Cline, 2026-10-16)
- 32b41ba - test(cli): simplify service env test (#55952) (Aiden Cline, 2026-10-16)
- e3d5a3b - fix(core): hide newer Bedrock bare IDs that require inference profiles (#54486) (Lucas Kim, 2026-10-16)
- 723a2f6 - fix(cli): load saved environment when starting managed services (#50907) (JasonH, 2026-10-16)
- b0a8e25 - fix(ai): honor Anthropic cache format on Bedrock Converse (#55942) (Aiden Cline, 2026-10-15)
- eeec76b - fix(tui): transparent background for embedded terminal panel (#55396) (Jensen, 2026-10-15)
- e25b7ab - fix(session-ui): slide the tool group count when it changes (#55617) (Luke Parker, 2026-10-16)
- 706a688 - fix(core): omit compaction replay context from sanitized exports (#55592) (xin zhuang, 2026-10-15)
- 20d172e - docs: document external_directory allow default (#55885) (Aiden Cline, 2026-10-15)
- 7049e5a - chore(core): refresh bundled models.dev snapshot (opencode-agent[bot], 2026-10-16)
- d7d44a7 - fix(app): fade long file names at the edge of the file tree (#55889) (Luke Parker, 2026-10-15)
- 867a77a - fix(app): keep the review pane steady when the side terminal toggles (#55879) (Luke Parker, 2026-10-15)
- 2e7ac8c - fix(tui): roll the compact form over to M at the rounding boundary (#55871) (argszero, 2026-10-15)
- 13263f3 - chore(release): publish the desktop app from beta (#55878) (Luke Parker, 2026-10-16)
- b3aa790 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-10-15)
- d0f3204 - fix(util): hide plugin Git console windows on Windows (#55475) (Filip, 2026-10-16)
- 17229d2 - chore(ci): speed up and stabilize the test workflow (#55866) (Filip, 2026-10-16)
- 7a4a032 - fix(core): seed configured limits before model transforms (#55778) (Dante, 2026-10-15)
- e89206d - fix(tui): say why /editor did nothing when no editor is set (#55872) (berce, 2026-10-15)
- 8db638c - fix(core): default to big-pickle when only free OpenCode models are available (#55852) (opencode-agent[bot], 2026-10-15)
- fc2fc59 - docs(go): launch Step 5 Preview in Go (#55749) (Jack, 2026-10-15)
- a448d5b - fix(core): accept numeric MCP timeouts (#55851) (Aiden Cline, 2026-10-15)
- 3485a7b - fix(tui): stop repeated review from reopening the last diff file (#55845) (DS, 2026-10-15)
- 412b2b1 - fix(core): load and spell reasoning for every native provider package (#55789) (Aiden Cline, 2026-10-15)
- fe87944 - fix(app): dropzone blur adjustment to avoid idle backdrop cost (#55418) (Daniel Nunns, 2026-10-16)
- 78fa607 - ci: refresh models.dev snapshot every 12 hours (#55841) (opencode-agent[bot], 2026-10-15)
- f40dc43 - sync release versions for v2.0.30 [skip ci] (opencode, 2026-10-15)
- d0732ea - docs: document MCP CIMD client registration (#55796) (Aiden Cline, 2026-10-15)
- 775d1d0 - fix(core): honor OPENCODE_DISABLE_CLAUDE_CODE (#55774) (opencode-agent[bot], 2026-10-15)
- f0b8913 - fix(infra): hand share domain over from teams worker (#55784) (Victor Navarro, 2026-10-15)
- a20a614 - chore(core): refresh bundled models.dev snapshot (opencode-agent[bot], 2026-10-15)
- 9e68770 - chore: retire session sharing backend (#55716) (Victor Navarro, 2026-10-15)
- 6488d3d - ci: restore daily models.dev snapshot refresh on dev (#55783) (opencode-agent[bot], 2026-10-15)
- 22dea24 - fix(tui): mount each dialog once so /fork shows its pending view (#55751) (James Long, 2026-10-15)
- a58d1dd - fix(tui): keep fork pending view at the list inset (#55746) (James Long, 2026-10-15)
- 18d1dd4 - fix(tui): show remaining dialog hints label-first (#55745) (James Long, 2026-10-15)
- 838d41a - refactor(tui): build prompt and integration views on DialogLayout (#55742) (James Long, 2026-10-15)
- 1ca34ae - fix(ai): use protocol-specific inference endpoints (#55680) (Victor Navarro, 2026-10-15)
- 61bfcbd - refactor(tui): build prompt-style dialogs on DialogPrompt (#55518) (James Long, 2026-10-15)
- 6d570f1 - refactor(tui): replace dialog inset flag with a cell count (#55582) (James Long, 2026-10-15)
- 6c706f2 - chore(tui): format dialog files with prettier (#55531) (James Long, 2026-10-15)
- 1d07373 - refactor(tui): move remaining dialogs onto DialogLayout (#55523) (James Long, 2026-10-15)
- 09a075d - feat(tui): open the diff side panel by default (#55780) (James Long, 2026-10-15)
- 86755e1 - fix(core): initialize MCP session for TinyFish web search (#54730) (terry-an-investor, 2026-10-15)
- 68510d9 - refactor(tui): inline select row gutter and derive detail width (#55740) (James Long, 2026-10-15)
- 611bc36 - refactor(tui): add shared dialog layout with one vertical rhythm (#55519) (James Long, 2026-10-15)
- 0478ba6 - feat(tui): responsive diff viewer layouts (#55574) (James Long, 2026-10-15)
- 06e3837 - refactor(tui): split DialogSelect row rendering into components (#55517) (James Long, 2026-10-15)
- 41cb349 - fix(console): link Zen and Go docs to V2 console pages (#55773) (Victor Navarro, 2026-10-15)
- 78359c6 - refactor(tui): add shared DialogFooter with label-first actions (#55513) (James Long, 2026-10-15)
- 3c61484 - refactor(tui): use one side padding for all dialogs (#55505) (James Long, 2026-10-15)
- af6ec83 - refactor(tui): add shared DialogHeader (#55501) (James Long, 2026-10-15)
- 4f31eb9 - refactor(tui): add dialog inset constants (#55498) (James Long, 2026-10-15)
- 654b79b - docs(console): add Nemotron 3.5 Super VL Free (#55747) (opencode-agent[bot], 2026-10-15)
- 81200db - fix(desktop): open PowerShell in the project directory on Windows (#55710) (Filip, 2026-10-15)

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
- `packages/core/script/test.ts` (+2, -1)
- `packages/core/src/aisdk-native.ts` (+16, -21)
- `packages/core/src/config.ts` (+2, -0)
- `packages/core/src/config/discovery.ts` (+9, -6)
- `packages/core/src/config/normalize.ts` (+23, -4)
- `packages/core/src/config/plugin/provider.ts` (+15, -1)
- `packages/core/src/config/variable.ts` (+23, -22)
- `packages/core/src/model.ts` (+19, -1)
- `packages/core/src/models-dev/snapshot.txt` (+1, -1)
- `packages/core/src/plugin/models-dev.ts` (+7, -1)
- `packages/core/src/plugin/websearch/tinyfish.ts` (+72, -8)
- `packages/core/src/provider.ts` (+36, -5)
- `packages/core/src/session/transfer.ts` (+4, -1)
- `packages/core/src/v1/config/migrate.ts` (+7, -2)
- `packages/core/src/variant.ts` (+51, -7)
- `packages/core/test/aisdk-native.test.ts` (+30, -0)
- `packages/core/test/browser-idle.test.ts` (+22, -2)
- `packages/core/test/catalog.test.ts` (+50, -0)
- `packages/core/test/config/config.test.ts` (+73, -5)
- `packages/core/test/config/normalization.test.ts` (+29, -0)
- `packages/core/test/config/provider.test.ts` (+75, -1)
- `packages/core/test/config/reload.test.ts` (+3, -1)
- `packages/core/test/filesystem/watcher.test.ts` (+2, -6)
- `packages/core/test/fixture/git.ts` (+18, -8)
- `packages/core/test/integration.test.ts` (+10, -4)
- `packages/core/test/location-layer.test.ts` (+5, -33)
- `packages/core/test/plugin/supervisor-reload.test.ts` (+1, -1)
- `packages/core/test/plugin/websearch-fixture.ts` (+10, -1)
- `packages/core/test/plugin/websearch.test.ts` (+14, -4)
- `packages/core/test/process/process.test.ts` (+29, -21)
- `packages/core/test/project.test.ts` (+2, -5)
- `packages/core/test/provider.test.ts` (+14, -22)
- `packages/core/test/repository-cache.test.ts` (+1, -1)
- `packages/core/test/session-activation.test.ts` (+1, -1)
- `packages/core/test/session-create.test.ts` (+3, -8)
- `packages/core/test/session-move.test.ts` (+1, -5)
- `packages/core/test/session-shell.test.ts` (+1, -1)
- `packages/core/test/variant.test.ts` (+48, -0)
- `packages/core/test/vcs.test.ts` (+3, -10)
- `packages/enterprise/src/core/share-document.ts` (+0, -361)
- `packages/enterprise/src/core/share.ts` (+0, -233)
- `packages/enterprise/src/core/storage.ts` (+0, -129)
- `packages/enterprise/test/core/share-document.test.ts` (+0, -179)
- `packages/enterprise/test/core/share.test.ts` (+0, -340)
- `packages/enterprise/test/core/storage.test.ts` (+0, -64)
- `packages/stats/core/package.json` (+1, -1)
- `packages/stats/core/src/domain/inference.test.ts` (+1, -0)

#### Other Changes
- `.github/actions/setup-bun/action.yml` (+5, -10)
- `.github/workflows/models-snapshot.yml` (+62, -0)
- `.github/workflows/nix-hashes.yml` (+1, -1)
- `.github/workflows/publish.yml` (+6, -4)
- `.github/workflows/test.yml` (+105, -44)
- `.opencode/skills/app-e2e-tests/SKILL.md` (+138, -0)
- `.opencode/skills/component-tests/SKILL.md` (+117, -0)
- `.opencode/skills/tui-tests/SKILL.md` (+82, -0)
- `.opencode/skills/unit-tests/SKILL.md` (+140, -0)
- `AGENTS.md` (+1, -0)
- `CHANGELOG.md` (+57, -0)
- `bun.lock` (+34, -159)
- `infra/enterprise.ts` (+0, -18)
- `infra/secret.ts` (+0, -3)
- `infra/share.ts` (+20, -0)
- `nix/hashes.json` (+3, -3)
- `package.json` (+3, -2)
- `packages/ai/package.json` (+1, -1)
- `packages/ai/src/protocols/bedrock-converse.ts` (+1, -1)
- `packages/ai/src/protocols/utils/bedrock-cache.ts` (+7, -4)
- `packages/ai/src/providers/opencode.ts` (+1, -1)
- `packages/ai/test/fixtures/recordings/opencode-evaluation/evaluates-choice-score-and-boolean-questions.json` (+1, -1)
- `packages/ai/test/provider/bedrock-converse-cache.test.ts` (+50, -1)
- `packages/app/README.md` (+11, -12)
- `packages/app/component-tests/composer.spec.ts` (+59, -0)
- `packages/app/e2e/regression/command-palette.spec.ts` (+9, -0)
- `packages/app/e2e/regression/review.spec.ts` (+6, -0)
- `packages/app/e2e/regression/session-summary.spec.ts` (+5, -0)
- `packages/app/e2e/regression/side-panels.spec.ts` (+52, -10)
- `packages/app/e2e/regression/subagent-child-navigation.spec.ts` (+5, -1)
- `packages/app/e2e/regression/tabs.spec.ts` (+6, -2)
- `packages/app/e2e/regression/timeline-cache.spec.ts` (+35, -11)
- `packages/app/e2e/regression/whats-new.spec.ts` (+15, -4)
- `packages/app/e2e/utils/serve.ts` (+65, -0)
- `packages/app/package.json` (+1, -1)
- `packages/app/playwright.config.ts` (+20, -3)
- `packages/app/src/composer/dropzone.tsx` (+1, -1)
- `packages/app/src/index.css` (+14, -0)
- `packages/app/src/runtime/extension/side-region.tsx` (+1, -6)
- `packages/app/src/session/screen-layout.ts` (+2, -13)
- `packages/app/src/session/screen.tsx` (+9, -7)
- `packages/app/src/session/timeline/observe-element-offset.test.ts` (+86, -66)
- `packages/app/src/session/timeline/observe-element-offset.ts` (+6, -2)
- `packages/app/test-browser/playwright-config.test.ts` (+1, -1)
- `packages/cli/package.json` (+1, -1)
- `packages/cli/src/commands/handlers/mcp/auth.ts` (+5, -3)
- `packages/cli/src/server-process.ts` (+7, -0)
- `packages/cli/test/service.test.ts` (+56, -0)
- `packages/client/package.json` (+1, -1)
- `packages/client/src/promise/generated/types.ts` (+0, -1)
- `packages/client/test/effect.test.ts` (+4, -1)
- `packages/client/test/fixture/service-fixture.ts` (+22, -3)
- `packages/client/test/import-boundaries.test.ts` (+0, -1)
- `packages/client/test/promise-service.test.ts` (+48, -37)
- `packages/client/test/promise.test.ts` (+6, -6)
- `packages/client/test/service-reconnect.test.ts` (+5, -5)
- `packages/client/test/service.test.ts` (+47, -36)
- `packages/codemode/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/component/go-models.ts` (+6, -9)
- `packages/console/app/src/i18n/ar.ts` (+2, -8)
- `packages/console/app/src/i18n/br.ts` (+2, -10)
- `packages/console/app/src/i18n/da.ts` (+2, -8)
- `packages/console/app/src/i18n/de.ts` (+2, -10)
- `packages/console/app/src/i18n/en.ts` (+2, -8)
- `packages/console/app/src/i18n/es.ts` (+2, -9)
- `packages/console/app/src/i18n/fr.ts` (+2, -10)
- `packages/console/app/src/i18n/it.ts` (+2, -9)
- `packages/console/app/src/i18n/ja.ts` (+2, -8)
- `packages/console/app/src/i18n/ko.ts` (+2, -8)
- `packages/console/app/src/i18n/no.ts` (+2, -8)
- `packages/console/app/src/i18n/pl.ts` (+2, -10)
- `packages/console/app/src/i18n/ru.ts` (+2, -9)
- `packages/console/app/src/i18n/th.ts` (+2, -8)
- `packages/console/app/src/i18n/tr.ts` (+2, -10)
- `packages/console/app/src/i18n/uk.ts` (+2, -10)
- `packages/console/app/src/i18n/zh.ts` (+2, -8)
- `packages/console/app/src/i18n/zht.ts` (+2, -8)
- `packages/console/app/src/lib/language.ts` (+0, -28)
- `packages/console/app/src/routes/download/index.tsx` (+2, -2)
- `packages/console/app/src/routes/go/index.tsx` (+7, -10)
- `packages/console/app/src/routes/index.tsx` (+1, -3)
- `packages/console/app/src/routes/temp.tsx` (+1, -1)
- `packages/console/app/src/routes/zen/index.tsx` (+5, -5)
- `packages/console/function/package.json` (+1, -1)
- `packages/desktop/README.md` (+7, -0)
- `packages/desktop/package.json` (+1, -1)
- `packages/desktop/src/main/files/index.ts` (+21, -1)
- `packages/enterprise/.gitignore` (+0, -26)
- `packages/enterprise/README.md` (+0, -32)
- `packages/enterprise/package.json` (+0, -51)
- `packages/enterprise/public/apple-touch-icon-v3.png` (+0, -1)
- `packages/enterprise/public/apple-touch-icon.png` (+0, -1)
- `packages/enterprise/public/favicon-96x96-v3.png` (+0, -1)
- `packages/enterprise/public/favicon-96x96.png` (+0, -1)
- `packages/enterprise/public/favicon-v3.ico` (+0, -1)
- `packages/enterprise/public/favicon-v3.svg` (+0, -1)
- `packages/enterprise/public/favicon.ico` (+0, -1)
- `packages/enterprise/public/favicon.svg` (+0, -1)
- `packages/enterprise/public/site.webmanifest` (+0, -1)
- `packages/enterprise/public/social-share-zen.png` (+0, -1)
- `packages/enterprise/public/social-share.png` (+0, -1)
- `packages/enterprise/public/web-app-manifest-192x192.png` (+0, -1)
- `packages/enterprise/public/web-app-manifest-512x512.png` (+0, -1)
- `packages/enterprise/script/scrap.ts` (+0, -15)
- `packages/enterprise/src/app.css` (+0, -3)
- `packages/enterprise/src/app.tsx` (+0, -114)
- `packages/enterprise/src/custom-elements.d.ts` (+0, -1)
- `packages/enterprise/src/entry-client.tsx` (+0, -4)
- `packages/enterprise/src/entry-server.tsx` (+0, -38)
- `packages/enterprise/src/global.d.ts` (+0, -5)
- `packages/enterprise/src/routes/[...404].tsx` (+0, -25)
- `packages/enterprise/src/routes/api/[...path].ts` (+0, -171)
- `packages/enterprise/src/routes/index.tsx` (+0, -3)
- `packages/enterprise/src/routes/share.tsx` (+0, -5)
- `packages/enterprise/src/routes/share/[shareID].tsx` (+0, -361)
- `packages/enterprise/sst-env.d.ts` (+0, -10)
- `packages/enterprise/test-debug.ts` (+0, -40)
- `packages/enterprise/tsconfig.json` (+0, -22)
- `packages/enterprise/vite.config.ts` (+0, -37)
- `packages/function/package.json` (+1, -1)
- `packages/function/src/share.ts` (+171, -0)
- `packages/gui-extensions/package.json` (+1, -1)
- `packages/gui-extensions/src/file/artifact-view.tsx` (+13, -0)
- `packages/gui-extensions/src/file/list.tsx` (+1, -1)
- `packages/gui-extensions/src/file/tree-v2.tsx` (+1, -1)
- `packages/gui-extensions/src/terminal/panel.tsx` (+1, -1)
- `packages/gui-extensions/src/updater/main.ts` (+1, -1)
- `packages/gui-extensions/src/updater/migration.test.ts` (+0, -25)
- `packages/gui-extensions/src/updater/migration.ts` (+0, -22)
- `packages/gui-extensions/src/updater/platform.ts` (+1, -27)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/http-recorder/test/websocket.test.ts` (+13, -11)
- `packages/httpapi-codegen/package.json` (+1, -1)
- `packages/latex/package.json` (+1, -1)
- `packages/merman/package.json` (+1, -1)
- `packages/merman/src/layout-audit.test.ts` (+24, -13)
- `packages/merman/src/state/routing.ts` (+2, -1)
- `packages/plugin-browser/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/plugins/figma/package.json` (+1, -1)
- `packages/protocol/package.json` (+1, -1)
- `packages/schema/package.json` (+1, -1)
- `packages/schema/src/tui-event.ts` (+0, -1)
- `packages/sdk/package.json` (+1, -1)
- `packages/sdk/test/promise.test.ts` (+2, -2)
- `packages/sdk/test/transport.test.ts` (+6, -1)
- `packages/server/package.json` (+1, -1)
- `packages/server/src/handlers/websearch.ts` (+3, -1)
- `packages/server/src/options.ts` (+1, -0)
- `packages/server/src/routes.ts` (+1, -0)
- `packages/session-ui/component-tests/tool-group.spec.ts` (+114, -0)
- `packages/session-ui/package.json` (+1, -1)
- `packages/session-ui/src/tools/tool-group.stories.tsx` (+42, -1)
- `packages/session-ui/src/tools/tool-renderer.tsx` (+9, -4)
- `packages/simulation/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/server/package.json` (+1, -1)
- `packages/storybook/.storybook/main.ts` (+34, -5)
- `packages/storybook/.storybook/preview.tsx` (+3, -1)
- `packages/storybook/playwright/README.md` (+1, -1)
- `packages/storybook/playwright/config.ts` (+4, -1)
- `packages/storybook/playwright/story.ts` (+8, -8)
- `packages/theme/package.json` (+1, -1)
- `packages/theme/src/tui/expand.ts` (+1, -0)
- `packages/theme/src/tui/schema.ts` (+2, -0)
- `packages/theme/src/tui/types.ts` (+1, -0)
- `packages/tui/package.json` (+1, -1)
- `packages/tui/src/component/command-palette.tsx` (+9, -1)
- `packages/tui/src/component/dialog-agent.tsx` (+2, -0)
- `packages/tui/src/component/dialog-config.tsx` (+5, -2)
- `packages/tui/src/component/dialog-debug.tsx` (+34, -36)
- `packages/tui/src/component/dialog-error-details.tsx` (+54, -58)
- `packages/tui/src/component/dialog-experiments.tsx` (+8, -6)
- `packages/tui/src/component/dialog-highlights.tsx` (+50, -51)
- `packages/tui/src/component/dialog-image-preview.tsx` (+37, -23)
- `packages/tui/src/component/dialog-integration.tsx` (+203, -176)
- `packages/tui/src/component/dialog-mcp.tsx` (+3, -5)
- `packages/tui/src/component/dialog-model.tsx` (+12, -2)
- `packages/tui/src/component/dialog-open.tsx` (+3, -3)
- `packages/tui/src/component/dialog-pair.tsx` (+3, -11)
- `packages/tui/src/component/dialog-session-list.tsx` (+10, -5)
- `packages/tui/src/component/dialog-shell-output.tsx` (+51, -39)
- `packages/tui/src/component/dialog-skill.tsx` (+5, -5)
- `packages/tui/src/component/dialog-status.tsx` (+3, -13)
- `packages/tui/src/component/dialog-theme-list.tsx` (+2, -0)
- `packages/tui/src/component/dialog-update.tsx` (+83, -73)
- `packages/tui/src/component/dialog-variant.tsx` (+3, -0)
- `packages/tui/src/component/dialog-workspace-file-changes.tsx` (+103, -64)
- `packages/tui/src/component/dialog-workspaces.tsx` (+6, -5)
- `packages/tui/src/component/dialog-worktree-name.tsx` (+17, -76)
- `packages/tui/src/component/prompt/index.tsx` (+2, -0)
- `packages/tui/src/component/terminal-pane.tsx` (+1, -0)
- `packages/tui/src/config/index.tsx` (+12, -3)
- `packages/tui/src/config/keybind.ts` (+3, -2)
- `packages/tui/src/config/v1/keybind.ts` (+2, -2)
- `packages/tui/src/context/local.tsx` (+4, -1)
- `packages/tui/src/context/panel.tsx` (+2, -1)
- `packages/tui/src/context/theme.tsx` (+13, -5)
- `packages/tui/src/editor.ts` (+1, -1)
- `packages/tui/src/feature-plugins/prompt/btw.tsx` (+62, -45)
- `packages/tui/src/feature-plugins/system/diff-viewer.tsx` (+90, -52)
- `packages/tui/src/feature-plugins/system/plugins.tsx` (+6, -11)
- `packages/tui/src/routes/session/dialog-execute.tsx` (+106, -87)
- `packages/tui/src/routes/session/dialog-fork.tsx` (+3, -3)
- `packages/tui/src/routes/session/dialog-message.tsx` (+3, -0)
- `packages/tui/src/routes/session/dialog-timeline.tsx` (+9, -1)
- `packages/tui/src/routes/session/index.tsx` (+6, -15)
- `packages/tui/src/theme/assets/v2/opencode2.json` (+391, -0)
- `packages/tui/src/theme/index.ts` (+10, -0)
- `packages/tui/src/ui/dialog-alert.tsx` (+24, -31)
- `packages/tui/src/ui/dialog-confirm.tsx` (+74, -63)
- `packages/tui/src/ui/dialog-export-options.tsx` (+191, -179)
- `packages/tui/src/ui/dialog-export-result.tsx` (+47, -24)
- `packages/tui/src/ui/dialog-help.tsx` (+20, -26)
- `packages/tui/src/ui/dialog-prompt.tsx` (+65, -27)
- `packages/tui/src/ui/dialog-select.tsx` (+244, -244)
- `packages/tui/src/ui/dialog.tsx` (+271, -39)
- `packages/tui/src/ui/layout.ts` (+3, -0)
- `packages/tui/src/util/locale.ts` (+2, -1)
- `packages/tui/test/app-lifecycle.test.tsx` (+19, -10)
- `packages/tui/test/cli/tui/dialog-mcp.test.tsx` (+3, -2)
- `packages/tui/test/cli/tui/dialog-select.test.tsx` (+3, -2)
- `packages/tui/test/cli/tui/diff-viewer.test.tsx` (+70, -12)
- `packages/tui/test/cli/tui/prompt-move.test.tsx` (+3, -3)
- `packages/tui/test/command-selection.test.tsx` (+7, -1)
- `packages/tui/test/component/dialog-error-details.test.tsx` (+3, -3)
- `packages/tui/test/component/dialog-highlights.test.tsx` (+2, -2)
- `packages/tui/test/context/theme.test.tsx` (+67, -0)
- `packages/tui/test/editor.test.ts` (+17, -0)
- `packages/tui/test/fixture/app.ts` (+12, -1)
- `packages/tui/test/fixture/frame.ts` (+25, -0)
- `packages/tui/test/panel.test.ts` (+3, -2)
- `packages/tui/test/plugin-select.test.tsx` (+9, -5)
- `packages/tui/test/session-fork-pending.test.tsx` (+60, -0)
- `packages/tui/test/session-group-navigation.test.tsx` (+14, -13)
- `packages/tui/test/session-home.test.tsx` (+3, -2)
- `packages/tui/test/session-panel.test.tsx` (+99, -18)
- `packages/tui/test/theme.test.ts` (+5, -0)
- `packages/tui/test/theme/v2/resolve.test.ts` (+9, -0)
- `packages/tui/test/util/locale.test.ts` (+6, -0)
- `packages/ui/package.json` (+1, -1)
- `packages/ui/src/components/animated-number.css` (+17, -4)
- `packages/ui/src/components/animated-number.tsx` (+55, -26)
- `packages/ui/src/context/dialog.tsx` (+7, -2)
- `packages/ui/src/navigation/tabs/tabs.css` (+0, -1)
- `packages/ui/src/styles/file-tree.css` (+65, -31)
- `packages/ui/src/styles/tailwind/index.css` (+0, -1)
- `packages/util/package.json` (+1, -1)
- `packages/util/src/npm.ts` (+9, -1)
- `packages/util/src/retry.test.ts` (+4, -2)
- `packages/util/test/global.test.ts` (+7, -1)
- `packages/util/tsconfig.build.json` (+2, -1)
- `packages/web/astro.config.mjs` (+0, -1)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/ar/cli.mdx` (+1, -6)
- `packages/web/src/content/docs/ar/commands.mdx` (+2, -2)
- `packages/web/src/content/docs/ar/config.mdx` (+0, -21)
- `packages/web/src/content/docs/ar/enterprise.mdx` (+0, -21)
- `packages/web/src/content/docs/ar/github.mdx` (+0, -2)
- `packages/web/src/content/docs/ar/index.mdx` (+0, -18)
- `packages/web/src/content/docs/ar/keybinds.mdx` (+0, -2)
- `packages/web/src/content/docs/ar/providers.mdx` (+2, -3)
- `packages/web/src/content/docs/ar/server.mdx` (+0, -2)
- `packages/web/src/content/docs/ar/share.mdx` (+0, -127)
- `packages/web/src/content/docs/ar/tui.mdx` (+0, -22)
- `packages/web/src/content/docs/bs/cli.mdx` (+1, -6)
- `packages/web/src/content/docs/bs/commands.mdx` (+2, -2)
- `packages/web/src/content/docs/bs/config.mdx` (+0, -21)
- `packages/web/src/content/docs/bs/enterprise.mdx` (+0, -21)
- `packages/web/src/content/docs/bs/github.mdx` (+0, -2)
- `packages/web/src/content/docs/bs/index.mdx` (+0, -16)
- `packages/web/src/content/docs/bs/keybinds.mdx` (+0, -2)
- `packages/web/src/content/docs/bs/providers.mdx` (+2, -3)
- `packages/web/src/content/docs/bs/server.mdx` (+0, -2)
- `packages/web/src/content/docs/bs/share.mdx` (+0, -127)
- `packages/web/src/content/docs/bs/tui.mdx` (+0, -22)
- `packages/web/src/content/docs/cli.mdx` (+1, -6)
- `packages/web/src/content/docs/commands.mdx` (+2, -2)
- `packages/web/src/content/docs/config.mdx` (+0, -23)
- `packages/web/src/content/docs/da/cli.mdx` (+1, -6)
- `packages/web/src/content/docs/da/commands.mdx` (+2, -2)
- `packages/web/src/content/docs/da/config.mdx` (+0, -21)
- `packages/web/src/content/docs/da/enterprise.mdx` (+0, -21)
- `packages/web/src/content/docs/da/github.mdx` (+0, -2)
- `packages/web/src/content/docs/da/index.mdx` (+0, -19)
- `packages/web/src/content/docs/da/keybinds.mdx` (+0, -2)
- `packages/web/src/content/docs/da/providers.mdx` (+2, -3)
- `packages/web/src/content/docs/da/server.mdx` (+0, -2)
- `packages/web/src/content/docs/da/share.mdx` (+0, -128)
- `packages/web/src/content/docs/da/tui.mdx` (+0, -22)
- `packages/web/src/content/docs/de/cli.mdx` (+1, -6)
- `packages/web/src/content/docs/de/commands.mdx` (+2, -2)
- `packages/web/src/content/docs/de/config.mdx` (+0, -21)
- `packages/web/src/content/docs/de/enterprise.mdx` (+0, -21)
- `packages/web/src/content/docs/de/github.mdx` (+0, -2)
- `packages/web/src/content/docs/de/index.mdx` (+0, -18)
- `packages/web/src/content/docs/de/keybinds.mdx` (+0, -2)
- `packages/web/src/content/docs/de/providers.mdx` (+2, -3)
- `packages/web/src/content/docs/de/server.mdx` (+0, -2)
- `packages/web/src/content/docs/de/share.mdx` (+0, -130)
- `packages/web/src/content/docs/de/tui.mdx` (+0, -22)
- `packages/web/src/content/docs/enterprise.mdx` (+0, -21)
- `packages/web/src/content/docs/es/cli.mdx` (+1, -6)
- `packages/web/src/content/docs/es/commands.mdx` (+2, -2)
- `packages/web/src/content/docs/es/config.mdx` (+0, -21)
- `packages/web/src/content/docs/es/enterprise.mdx` (+0, -21)
- `packages/web/src/content/docs/es/github.mdx` (+0, -2)
- `packages/web/src/content/docs/es/index.mdx` (+0, -19)
- `packages/web/src/content/docs/es/keybinds.mdx` (+0, -2)
- `packages/web/src/content/docs/es/providers.mdx` (+2, -3)
- `packages/web/src/content/docs/es/server.mdx` (+0, -2)
- `packages/web/src/content/docs/es/share.mdx` (+0, -128)
- `packages/web/src/content/docs/es/tui.mdx` (+0, -22)
- `packages/web/src/content/docs/fr/cli.mdx` (+1, -6)
- `packages/web/src/content/docs/fr/commands.mdx` (+2, -2)
- `packages/web/src/content/docs/fr/config.mdx` (+0, -21)
- `packages/web/src/content/docs/fr/enterprise.mdx` (+0, -21)
- `packages/web/src/content/docs/fr/github.mdx` (+0, -2)
- `packages/web/src/content/docs/fr/index.mdx` (+0, -18)
- `packages/web/src/content/docs/fr/keybinds.mdx` (+0, -2)
- `packages/web/src/content/docs/fr/providers.mdx` (+2, -3)
- `packages/web/src/content/docs/fr/server.mdx` (+0, -2)
- `packages/web/src/content/docs/fr/share.mdx` (+0, -128)
- `packages/web/src/content/docs/fr/tui.mdx` (+0, -22)
- `packages/web/src/content/docs/github.mdx` (+0, -2)
- `packages/web/src/content/docs/index.mdx` (+0, -19)
- `packages/web/src/content/docs/it/cli.mdx` (+1, -6)
- `packages/web/src/content/docs/it/commands.mdx` (+2, -2)
- `packages/web/src/content/docs/it/config.mdx` (+0, -21)
- `packages/web/src/content/docs/it/enterprise.mdx` (+0, -21)
- `packages/web/src/content/docs/it/github.mdx` (+0, -2)
- `packages/web/src/content/docs/it/index.mdx` (+0, -18)
- `packages/web/src/content/docs/it/keybinds.mdx` (+0, -2)
- `packages/web/src/content/docs/it/providers.mdx` (+2, -3)
- `packages/web/src/content/docs/it/server.mdx` (+0, -2)
- `packages/web/src/content/docs/it/share.mdx` (+0, -127)
- `packages/web/src/content/docs/it/tui.mdx` (+0, -22)
- `packages/web/src/content/docs/ja/cli.mdx` (+1, -6)
- `packages/web/src/content/docs/ja/commands.mdx` (+2, -2)
- `packages/web/src/content/docs/ja/config.mdx` (+0, -21)
- `packages/web/src/content/docs/ja/enterprise.mdx` (+0, -21)
- `packages/web/src/content/docs/ja/github.mdx` (+0, -2)
- `packages/web/src/content/docs/ja/index.mdx` (+0, -18)
- `packages/web/src/content/docs/ja/keybinds.mdx` (+0, -2)
- `packages/web/src/content/docs/ja/providers.mdx` (+2, -3)
- `packages/web/src/content/docs/ja/server.mdx` (+0, -2)
- `packages/web/src/content/docs/ja/share.mdx` (+0, -128)
- `packages/web/src/content/docs/ja/tui.mdx` (+0, -22)
- `packages/web/src/content/docs/keybinds.mdx` (+0, -2)
- `packages/web/src/content/docs/ko/cli.mdx` (+1, -6)
- `packages/web/src/content/docs/ko/commands.mdx` (+2, -2)
- `packages/web/src/content/docs/ko/config.mdx` (+0, -21)
- `packages/web/src/content/docs/ko/enterprise.mdx` (+0, -21)
- `packages/web/src/content/docs/ko/github.mdx` (+0, -2)
- `packages/web/src/content/docs/ko/index.mdx` (+0, -18)
- `packages/web/src/content/docs/ko/keybinds.mdx` (+0, -2)
- `packages/web/src/content/docs/ko/providers.mdx` (+1, -3)
- `packages/web/src/content/docs/ko/server.mdx` (+0, -2)
- `packages/web/src/content/docs/ko/share.mdx` (+0, -128)
- `packages/web/src/content/docs/ko/tui.mdx` (+0, -22)
- `packages/web/src/content/docs/nb/cli.mdx` (+1, -6)
- `packages/web/src/content/docs/nb/commands.mdx` (+2, -2)
- `packages/web/src/content/docs/nb/config.mdx` (+0, -21)
- `packages/web/src/content/docs/nb/enterprise.mdx` (+0, -21)
- `packages/web/src/content/docs/nb/github.mdx` (+0, -2)
- `packages/web/src/content/docs/nb/index.mdx` (+0, -19)
- `packages/web/src/content/docs/nb/keybinds.mdx` (+0, -2)
- `packages/web/src/content/docs/nb/providers.mdx` (+2, -3)
- `packages/web/src/content/docs/nb/server.mdx` (+0, -2)
- `packages/web/src/content/docs/nb/share.mdx` (+0, -128)
- `packages/web/src/content/docs/nb/tui.mdx` (+0, -22)
- `packages/web/src/content/docs/pl/cli.mdx` (+1, -6)
- `packages/web/src/content/docs/pl/commands.mdx` (+2, -2)
- `packages/web/src/content/docs/pl/config.mdx` (+0, -21)
- `packages/web/src/content/docs/pl/enterprise.mdx` (+0, -21)
- `packages/web/src/content/docs/pl/github.mdx` (+0, -2)
- `packages/web/src/content/docs/pl/index.mdx` (+0, -18)
- `packages/web/src/content/docs/pl/keybinds.mdx` (+0, -2)
- `packages/web/src/content/docs/pl/providers.mdx` (+2, -3)
- `packages/web/src/content/docs/pl/server.mdx` (+0, -2)
- `packages/web/src/content/docs/pl/share.mdx` (+0, -128)
- `packages/web/src/content/docs/pl/tui.mdx` (+0, -22)
- `packages/web/src/content/docs/providers.mdx` (+2, -3)
- `packages/web/src/content/docs/pt-br/cli.mdx` (+1, -6)
- `packages/web/src/content/docs/pt-br/commands.mdx` (+2, -2)
- `packages/web/src/content/docs/pt-br/config.mdx` (+0, -21)
- `packages/web/src/content/docs/pt-br/enterprise.mdx` (+0, -21)
- `packages/web/src/content/docs/pt-br/github.mdx` (+0, -2)
- `packages/web/src/content/docs/pt-br/index.mdx` (+0, -18)
- `packages/web/src/content/docs/pt-br/keybinds.mdx` (+0, -2)
- `packages/web/src/content/docs/pt-br/providers.mdx` (+2, -3)
- `packages/web/src/content/docs/pt-br/server.mdx` (+0, -2)
- `packages/web/src/content/docs/pt-br/share.mdx` (+0, -127)
- `packages/web/src/content/docs/pt-br/tui.mdx` (+0, -22)
- `packages/web/src/content/docs/ru/cli.mdx` (+1, -6)
- `packages/web/src/content/docs/ru/commands.mdx` (+2, -2)
- `packages/web/src/content/docs/ru/config.mdx` (+0, -21)
- `packages/web/src/content/docs/ru/enterprise.mdx` (+0, -21)
- `packages/web/src/content/docs/ru/github.mdx` (+0, -2)
- `packages/web/src/content/docs/ru/index.mdx` (+0, -19)
- `packages/web/src/content/docs/ru/keybinds.mdx` (+0, -2)
- `packages/web/src/content/docs/ru/providers.mdx` (+2, -3)
- `packages/web/src/content/docs/ru/server.mdx` (+0, -2)
- `packages/web/src/content/docs/ru/share.mdx` (+0, -128)
- `packages/web/src/content/docs/ru/tui.mdx` (+0, -22)
- `packages/web/src/content/docs/server.mdx` (+0, -2)
- `packages/web/src/content/docs/share.mdx` (+0, -128)
- `packages/web/src/content/docs/th/cli.mdx` (+1, -6)
- `packages/web/src/content/docs/th/commands.mdx` (+2, -2)
- `packages/web/src/content/docs/th/config.mdx` (+0, -21)
- `packages/web/src/content/docs/th/enterprise.mdx` (+0, -21)
- `packages/web/src/content/docs/th/github.mdx` (+0, -2)
- `packages/web/src/content/docs/th/index.mdx` (+0, -19)
- `packages/web/src/content/docs/th/keybinds.mdx` (+0, -2)
- `packages/web/src/content/docs/th/providers.mdx` (+2, -3)
- `packages/web/src/content/docs/th/server.mdx` (+0, -2)
- `packages/web/src/content/docs/th/share.mdx` (+0, -128)
- `packages/web/src/content/docs/th/tui.mdx` (+0, -22)
- `packages/web/src/content/docs/tr/cli.mdx` (+1, -6)
- `packages/web/src/content/docs/tr/commands.mdx` (+2, -2)
- `packages/web/src/content/docs/tr/config.mdx` (+0, -21)
- `packages/web/src/content/docs/tr/enterprise.mdx` (+0, -21)
- `packages/web/src/content/docs/tr/github.mdx` (+0, -2)
- `packages/web/src/content/docs/tr/index.mdx` (+0, -18)
- `packages/web/src/content/docs/tr/keybinds.mdx` (+0, -2)
- `packages/web/src/content/docs/tr/providers.mdx` (+2, -3)
- `packages/web/src/content/docs/tr/server.mdx` (+0, -2)
- `packages/web/src/content/docs/tr/share.mdx` (+0, -127)
- `packages/web/src/content/docs/tr/tui.mdx` (+0, -22)
- `packages/web/src/content/docs/tui.mdx` (+0, -20)
- `packages/web/src/content/docs/zh-cn/cli.mdx` (+1, -6)
- `packages/web/src/content/docs/zh-cn/commands.mdx` (+2, -2)
- `packages/web/src/content/docs/zh-cn/config.mdx` (+0, -21)
- `packages/web/src/content/docs/zh-cn/enterprise.mdx` (+0, -21)
- `packages/web/src/content/docs/zh-cn/github.mdx` (+0, -2)
- `packages/web/src/content/docs/zh-cn/index.mdx` (+0, -18)
- `packages/web/src/content/docs/zh-cn/keybinds.mdx` (+0, -2)
- `packages/web/src/content/docs/zh-cn/providers.mdx` (+2, -3)
- `packages/web/src/content/docs/zh-cn/server.mdx` (+0, -2)
- `packages/web/src/content/docs/zh-cn/share.mdx` (+0, -127)
- `packages/web/src/content/docs/zh-cn/tui.mdx` (+0, -22)
- `packages/web/src/content/docs/zh-tw/cli.mdx` (+1, -6)
- `packages/web/src/content/docs/zh-tw/commands.mdx` (+2, -2)
- `packages/web/src/content/docs/zh-tw/config.mdx` (+0, -21)
- `packages/web/src/content/docs/zh-tw/enterprise.mdx` (+0, -21)
- `packages/web/src/content/docs/zh-tw/github.mdx` (+0, -2)
- `packages/web/src/content/docs/zh-tw/index.mdx` (+0, -18)
- `packages/web/src/content/docs/zh-tw/keybinds.mdx` (+0, -2)
- `packages/web/src/content/docs/zh-tw/providers.mdx` (+2, -3)
- `packages/web/src/content/docs/zh-tw/server.mdx` (+0, -2)
- `packages/web/src/content/docs/zh-tw/share.mdx` (+0, -127)
- `packages/web/src/content/docs/zh-tw/tui.mdx` (+0, -22)
- `patches/@corvu%2Fdrawer@0.2.4.patch` (+50, -0)
- `script/publish.ts` (+7, -0)
- `sdks/vscode/package.json` (+1, -1)
- `services/update/package.json` (+1, -1)
- `services/update/src/index.ts` (+69, -18)
- `services/update/test/index.test.ts` (+23, -0)
- `services/www/src/docs/content/cli/acp.mdx` (+5, -0)
- `services/www/src/docs/content/cli/keybinds.mdx` (+0, -2)
- `services/www/src/docs/content/cli/theme.mdx` (+1, -1)
- `services/www/src/docs/content/config.mdx` (+56, -15)
- `services/www/src/docs/content/console/go.mdx` (+41, -66)
- `services/www/src/docs/content/console/models.mdx` (+102, -94)
- `services/www/src/docs/content/instructions.mdx` (+3, -3)
- `services/www/src/docs/content/mcp-servers.mdx` (+115, -10)
- `services/www/src/docs/content/migrate-v1.mdx` (+5, -14)
- `services/www/src/docs/content/permissions.mdx` (+24, -9)
- `services/www/src/docs/content/providers.mdx` (+1, -0)
- `services/www/src/docs/content/sharing.mdx` (+0, -5)
- `services/www/src/docs/content/tools.mdx` (+13, -8)
- `services/www/src/docs/lib/navigation.ts` (+0, -1)
- `sst-env.d.ts` (+1, -16)
- `sst.config.ts` (+1, -1)
- `turbo.json` (+65, -15)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index c249782..54b5224 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "2.0.29",
+  "version": "2.0.30",
   "name": "@opencode/core",
   "type": "module",
   "license": "MIT",
```

#### packages/core/script/test.ts
```diff
diff --git a/packages/core/script/test.ts b/packages/core/script/test.ts
index cc6f1f6..104be38 100644
--- a/packages/core/script/test.ts
+++ b/packages/core/script/test.ts
@@ -35,7 +35,8 @@ const environment = {
 }
 
 const child = Bun.spawn({
-  cmd: [process.execPath, "test", "--only-failures", ...process.argv.slice(2)],
+  // The 30s default timeout matches cli and tui; npm.test's Git package installs ran past Bun's 5s default on Windows.
+  cmd: [process.execPath, "test", "--only-failures", "--timeout=30000", ...process.argv.slice(2)],
   env: environment,
   stdin: "inherit",
   stdout: "inherit",
```

#### packages/core/src/aisdk-native.ts
```diff
diff --git a/packages/core/src/aisdk-native.ts b/packages/core/src/aisdk-native.ts
index c75d720..9bbbbd6 100644
--- a/packages/core/src/aisdk-native.ts
+++ b/packages/core/src/aisdk-native.ts
@@ -32,15 +32,12 @@ export function rewrite<ID extends string>(
   const replacement = resolve(input.specifier, { ...input, settings }) ?? plain
   const translated = options(replacement, input.modelID, settings)
   if (target.package !== undefined || replacement !== input.specifier) target.package = replacement
-  target.settings =
-    target.settings === undefined
-      ? undefined
-      : {
-          ...translated.settings,
-          ...(!NATIVE.has(input.specifier) && replacement === "@opencode/ai/providers/openai-compatible"
-            ? { provider: input.canonical ?? input.providerID }
-            : {}),
-        }
+  // Without `provider`, the native compatible package reports every AI SDK-mapped host as `openai-compatible`.
+  const identity =
+    replacement === "@opencode/ai/providers/openai-compatible" && !Provider.builtinPackages.has(input.specifier)
+      ? { provider: input.canonical ?? input.providerID }
+      : {}
+  target.settings = target.settings === undefined ? undefined : { ...translated.settings, ...identity }
   target.headers = Provider.mergeHeaders(translated.headers, target.headers)
   target.body = Provider.mergeOverlay(translated.body, target.body)
   target.variants = target.variants?.map((variant) => {
@@ -122,15 +119,6 @@ const HOSTS: Readonly<Record<string, Readonly<Record<string, string>>>> = {
   "zhipuai-coding-plan": protocols("zai-coding-plan"),
 }
 
-const NATIVE = new Set([
-  ...Object.values(PACKAGES),
-  ...Object.values(HOSTS).flatMap((host) => Object.values(host)),
-  "@opencode/ai/providers/azure/chat",
-  "@opencode/ai/providers/amazon-bedrock/mantle",
-  "@opencode/ai/providers/amazon-bedrock/mantle/chat",
-  "@opencode/ai/providers/amazon-bedrock/mantle/responses",
-])
-
 export function native(npm: string, context: Context & { readonly settings?: Provider.Settings }): string | undefined {
   const host = HOSTS[context.providerID]?.[npm]
   if (host) return host
@@ -142,8 +130,10 @@ export function native(npm: string, context: Context & { readonly settings?: Pro
 const azureChat = (context: Context & { readonly settings?: Provider.Settings }) =>
   context.shape === "completions" || context.settings?.useCompletionUrls === true
 
+// Mantle serves Claude only through Anthropic Messages and GPT-OSS only through Chat.
 const mantle = (modelID: string | undefined) => {
   if (modelID === undefined) return "@opencode/ai/providers/amazon-bedrock/mantle"
+  if (modelID.includes("anthropic.")) return "@opencode/ai/providers/amazon-bedrock/mantle/messages"
```

#### packages/core/src/config.ts
```diff
diff --git a/packages/core/src/config.ts b/packages/core/src/config.ts
index 7945384..943d251 100644
--- a/packages/core/src/config.ts
+++ b/packages/core/src/config.ts
@@ -50,6 +50,8 @@ export const Options = Schema.Struct({
   // wellknown, file, and content entries still load.
   global: Schema.optional(Schema.Boolean),
   system: Schema.optional(Schema.Union([Schema.Boolean, Schema.String])),
+  // false skips ~/.claude and project .claude dirs.
+  claude: Schema.optional(Schema.Boolean),
   file: Schema.optional(Schema.String),
   content: Schema.optional(Schema.String),
 })
```

#### packages/core/src/config/discovery.ts
```diff
diff --git a/packages/core/src/config/discovery.ts b/packages/core/src/config/discovery.ts
index 0e197fe..799afeb 100644
--- a/packages/core/src/config/discovery.ts
+++ b/packages/core/src/config/discovery.ts
@@ -126,12 +126,15 @@ export const discover = Effect.fn("ConfigDiscovery.discover")(function* (options
       visible.filter((item) => path.basename(item) === ".opencode").toReversed(),
       (directory) => fs.isDir(directory).pipe(Effect.map((present) => ({ path: directory, present }))),
     ),
-    claude: [
-      ...new Set([
-        ...(globalEnabled ? [globalClaudeDirectory] : []),
-        ...visible.filter((item) => path.basename(item) === ".claude").toReversed(),
-      ]),
-    ],
+    claude:
+      options?.claude === false
+        ? []
+        : [
+            ...new Set([
+              ...(globalEnabled ? [globalClaudeDirectory] : []),
+              ...visible.filter((item) => path.basename(item) === ".claude").toReversed(),
+            ]),
+          ],
     agents: [
       ...new Set([
         ...(globalEnabled ? [globalAgentsDirectory] : []),
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/tool/agent-manager.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager.ts changes
- `src/tool/agent-manager.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager.txt changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/kilocode/tool/task.ts changes
