# Upstream Changes Report
Generated: 2026-06-30 09:37:23

## Summary
- kilocode: 133 commits, 398 files changed
- opencode: 58 commits, 302 files changed

## kilocode Changes (3037ef6af..c856bb33e)

### Commits

- c856bb33e - Merge pull request #11823 from Kilo-Org/mark/prefer-one-changeset (Mark IJbema, 2026-06-30)
- 22c669927 - Merge pull request #11822 from Kilo-Org/pepper-wedge (Marius, 2026-06-30)
- 0dee47276 - docs: prefer one concise changeset per PR (Mark IJbema, 2026-06-30)
- 8cc33def9 - feat(agent-manager): send inline review draft comments directly from diff (marius-kilocode, 2026-06-30)
- 16dabc951 - Merge pull request #11821 from Kilo-Org/fix/cli-sandbox-smoke-test (Marius, 2026-06-30)
- f9eb4be7a - Merge pull request #11782 from Kilo-Org/mark/autocomplete-i18n-locales (Mark IJbema, 2026-06-30)
- a55c8f80f - fix(ci): stabilize Linux sandbox CLI release smoke test (marius-kilocode, 2026-06-30)
- 4a8f32416 - Merge pull request #11621 from maoxin1234/feat/subagent-resumable-error-output (Marius, 2026-06-30)
- 58a6883ae - Merge pull request #11394 from Kilo-Org/shy-tellurium (Catriel Müller, 2026-06-29)
- ce01f72ce - Merge branch 'main' into shy-tellurium (Catriel Müller, 2026-06-29)
- 3f38c3f8f - refactor: fix kilo markers (Catriel Müller, 2026-06-29)
- 9d9a5d06d - refactor: add interactive terminal (Catriel Müller, 2026-06-29)
- 0133cf882 - Merge branch 'main' into feat/subagent-resumable-error-output (Marius, 2026-06-29)
- a3030136e - feat(jetbrains): show profile balance details (#11805) (Johnny Eric Amancio, 2026-06-29)
- 16b8574ee - Merge branch 'main' into feat/subagent-resumable-error-output (Marius, 2026-06-29)
- 4e7f0e775 - fix(vscode): use models sparkle icon for auto model instead of branch (#11788) (Johnny Eric Amancio, 2026-06-29)
- 86f6c58dd - fix(cli): keep background subagent resume hint (marius-kilocode, 2026-06-29)
- df7022146 - refactor: Update branch (Catriel Müller, 2026-06-29)
- d997abd5e - Merge remote-tracking branch 'origin/main' into shy-tellurium (Catriel Müller, 2026-06-29)
- eb5474a09 - Merge pull request #11456 from Kilo-Org/rainbow-bagel (Catriel Müller, 2026-06-29)
- 12eaca450 - Merge pull request #11804 from Kilo-Org/checker-concrete (Marius, 2026-06-29)
- 69e5cac6d - chore(ci): compact bun junit test output (marius-kilocode, 2026-06-29)
- 98dddd36e - Merge pull request #11225 from Kilo-Org/docs/remove-legacy-ide-docs (Mark IJbema, 2026-06-29)
- e7255fc3f - fix: background process tests (Catriel Müller, 2026-06-29)
- 64af7fff4 - Merge pull request #11802 from Kilo-Org/purple-alloy (Marius, 2026-06-29)
- ff0d7c021 - Merge pull request #11777 from Kilo-Org/kindly-need (Marius, 2026-06-29)
- afb810471 - Merge pull request #11733 from Kilo-Org/lackadaisical-motor (Marius, 2026-06-29)
- 5e3472437 - fix(jetbrains): recover startup reconnects while connecting (marius-kilocode, 2026-06-29)
- 53bc08bff - Merge pull request #11601 from Kilo-Org/fix/curl-upgrade-install-url (Marius, 2026-06-29)
- 0d62dc9e1 - Merge branch 'main' into docs/remove-legacy-ide-docs (Mark IJbema, 2026-06-29)
- bb9680bc2 - chore(ci): reduce test log noise (marius-kilocode, 2026-06-29)
- 971a41843 - fix(jetbrains): ignore stale canceled startup failures (marius-kilocode, 2026-06-29)
- 30e037b89 - Merge branch 'main' into fix/curl-upgrade-install-url (Marius, 2026-06-29)
- 3a3b91766 - Merge pull request #11746 from Kilo-Org/feat/vscode-routed-model-usage (Marian Alexandru Alecu, 2026-06-29)
- e6a555f8e - Merge pull request #11799 from Kilo-Org/pollen-seer (Marius, 2026-06-29)
- 4b5668685 - refactor: fix test (Catriel Müller, 2026-06-29)
- 90dce3ca2 - test(jetbrains): harden app service startup waits (marius-kilocode, 2026-06-29)
- 9105ae66c - fix(vscode): reduce webview message handler complexity (Alex Alecu, 2026-06-29)
- 8955eded7 - Merge branch 'main' into rainbow-bagel (Catriel Müller, 2026-06-29)
- c174cecff - Merge branch 'main' into feat/vscode-routed-model-usage (Marian Alexandru Alecu, 2026-06-29)
- 2a7784886 - fix(cli): restore executable bit on opencode build scripts (marius-kilocode, 2026-06-29)
- db05b707a - Merge pull request #11798 from Kilo-Org/funny-tarp (Catriel Müller, 2026-06-29)
- 07b35e020 - Merge branch 'main' into rainbow-bagel (Catriel Müller, 2026-06-29)
- f26b70609 - Merge pull request #11792 from Kilo-Org/marred-postage (Marius, 2026-06-29)
- 94f4c23e0 - Merge pull request #11796 from Kilo-Org/heartbreaking-thing (Marius, 2026-06-29)
- 53f5d9b9b - Merge branch 'main' into feat/vscode-routed-model-usage (Marian Alexandru Alecu, 2026-06-29)
- cd09407f8 - fix(jetbrains): cancel event stream timeout on dispose (marius-kilocode, 2026-06-29)
- 1d798a106 - fix(kiloclaw): restore slash command access (Catriel Müller, 2026-06-29)
- d0958cf41 - test(vscode): update mention highlight contract (marius-kilocode, 2026-06-29)
- 8cfb535b5 - Merge branch 'main' into mark/autocomplete-i18n-locales (Mark IJbema, 2026-06-29)
- 8c37da02d - fix(jetbrains): recover stalled startup event streams (marius-kilocode, 2026-06-29)
- 06279c92b - Merge pull request #11530 from Kilo-Org/royal-spark (Marius, 2026-06-29)
- 71cd438ed - test(agent-manager): update sandbox dialog guard (marius-kilocode, 2026-06-29)
- fdeca17c3 - Merge branch 'main' into fix/curl-upgrade-install-url (Marius, 2026-06-29)
- 30bdd8b66 - Merge remote-tracking branch 'origin/main' into rainbow-bagel (Catriel Müller, 2026-06-29)
- 7d64eb74f - feat(cli): show credits and Kilo Pass in sidebar footer (#11729) (Johnny Eric Amancio, 2026-06-29)
- db4fa053d - Merge pull request #11786 from Kilo-Org/vagabond-melody (Marius, 2026-06-29)
- ece2f91ae - Merge remote-tracking branch 'origin/main' into docs/remove-legacy-ide-docs (markijbema, 2026-06-29)
- cbd22a39c - Merge pull request #11773 from Kilo-Org/refactor/agent-typed-metadata-fields (Christiaan Arnoldus, 2026-06-29)
- 6aa85b0d8 - Merge branch 'main' into royal-spark (Marius, 2026-06-29)
- cc418c851 - Merge branch 'main' into fix/curl-upgrade-install-url (Marius, 2026-06-29)
- d1cce5b3b - Merge branch 'main' into vagabond-melody (Marius, 2026-06-29)
- d9a512519 - fix(vscode): track new usage sessions (Alex Alecu, 2026-06-29)
- 401e0fd8c - fix(agent-manager): persist sandbox default in worktree dialog (marius-kilocode, 2026-06-29)
- bf8800a9f - refactor(vscode): simplify autocomplete i18n locale lookup (Mark IJbema, 2026-06-29)
- 727ded7c0 - Merge pull request #11646 from Kilo-Org/legend-bonnet (Marius, 2026-06-29)
- ddc7674a4 - Update packages/opencode/src/kilocode/tool/agent-manager-models.ts (Marius, 2026-06-29)
- 91092ce86 - Merge branch 'main' into refactor/agent-typed-metadata-fields (Christiaan Arnoldus, 2026-06-29)
- 799576485 - Merge branch 'main' into kindly-need (Marius, 2026-06-29)
- b5d0fee36 - fix(vscode): localize autocomplete dictionaries (Mark IJbema, 2026-06-29)
- 92325cfb5 - Merge branch 'main' into fix/curl-upgrade-install-url (Marius, 2026-06-29)
- afd588c3f - Merge branch 'main' into royal-spark (Marius, 2026-06-29)
- 05ce1b5a9 - Merge pull request #11638 from Kilo-Org/cottony-fan (Marius, 2026-06-29)
- a08fa5f7f - fix(vscode): calculate hit rate (Alex Alecu, 2026-06-29)
- 09f94cdac - fix(vscode): refresh usage totals (Alex Alecu, 2026-06-29)
- ed3c02611 - Merge branch 'main' into legend-bonnet (Marius, 2026-06-29)
- a53fbc1c9 - Merge branch 'main' into royal-spark (Marius, 2026-06-29)
- d91a38f9b - Merge pull request #11790 from Kilo-Org/jdp/gastown-docs-update (Jean du Plessis, 2026-06-29)
- 2ce9c8c98 - Merge branch 'main' into fix/curl-upgrade-install-url (Marius, 2026-06-29)
- 7eff0cafd - Merge branch 'main' into legend-bonnet (Marius, 2026-06-29)
- bee118a86 - Merge branch 'main' into royal-spark (Marius, 2026-06-29)
- 7edb9c5bd - Merge branch 'main' into vagabond-melody (Marius, 2026-06-29)
- 3f16269ab - chore: merge origin/main (Alex Alecu, 2026-06-29)
- de2874025 - style(vscode): rename usage hit rate (Alex Alecu, 2026-06-29)
- f1ed88392 - fix(vscode): refresh task usage (Alex Alecu, 2026-06-29)
- 190c31b42 - fix(vscode): limit usage tracking (Alex Alecu, 2026-06-29)
- f837dc980 - fix(vscode): use new language setting for autocomplete i18n (Mark IJbema, 2026-06-29)
- e99312a61 - docs(kilo-docs): update DoltHub Wasteland auth docs (Jean du Plessis, 2026-06-29)
- 693b7429b - fix(vscode): refresh autocomplete i18n on render (Mark IJbema, 2026-06-29)
- c97f967ee - fix(vscode): respect language setting in autocomplete i18n (Mark IJbema, 2026-06-29)
- 4d94328cc - fix(vscode): sync autocomplete locale errors (Mark IJbema, 2026-06-29)
- 3b9ba6f63 - Merge remote-tracking branch 'origin/main' into vagabond-melody (marius-kilocode, 2026-06-29)
- c4a5030bd - fix(cli): drop duplicate nextBillingAt nullability now handled on main (marius-kilocode, 2026-06-29)
- 15ff3e467 - Merge remote-tracking branch 'origin/main' into mark/autocomplete-i18n-locales (Mark IJbema, 2026-06-29)
- e8ced08a5 - Merge branch 'main' into refactor/agent-typed-metadata-fields (Christiaan Arnoldus, 2026-06-29)
- 123a9395d - feat(agent-manager): model and reasoning variant selection for tool-started sessions (marius-kilocode, 2026-06-29)
- 3ee52e725 - fix(vscode): clarify autocomplete auth and credit errors (Mark IJbema, 2026-06-29)
- 4adb522aa - refactor(vscode): use extension host i18n for autocomplete (Mark IJbema, 2026-06-29)
- 1b359bf91 - Merge branch 'main' into refactor/agent-typed-metadata-fields (Christiaan Arnoldus, 2026-06-29)
- b425f9b1a - feat(vscode): add extension host i18n aggregator (Mark IJbema, 2026-06-29)
- b7f66114a - refactor(vscode): move autocomplete dictionaries under extension i18n (Mark IJbema, 2026-06-29)
- 20bd30aae - Merge branch 'main' into kindly-need (Marius, 2026-06-29)
- 254fceaf1 - fix: allow translated readmes in forbidden string check (Mark IJbema, 2026-06-29)
- 5104eaec1 - feat(vscode): localize autocomplete strings (Mark IJbema, 2026-06-29)
- 3219a06c8 - fix(ui): handle repeated mention highlights (marius-kilocode, 2026-06-29)
- ff427e5fb - fix(ui): correct mention highlight ranges (marius-kilocode, 2026-06-29)
- 50435a44b - Merge branch 'main' into refactor/agent-typed-metadata-fields (Christiaan Arnoldus, 2026-06-29)
- bf671bcf1 - chore: drop changeset (internal refactor, no user-visible change) (chrarnoldus, 2026-06-29)
- 06cad2b6a - Merge remote-tracking branch 'origin/main' into refactor/agent-typed-metadata-fields Co-authored-by: kiloconnect[bot] <240665456+kiloconnect[bot]@users.noreply.github.com> (chrarnoldus, 2026-06-29)
- 808295fb8 - refactor(cli): carry agent displayName/source as typed fields instead of provider options (chrarnoldus, 2026-06-29)
- 980af9881 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-28)
- cbc69a707 - Merge remote-tracking branch 'origin/main' into feat/vscode-routed-model-usage (Josh Lambert, 2026-06-28)
- 55983f147 - fix(vscode): polish usage breakdown styling (Josh Lambert, 2026-06-28)
- b56e07e5b - docs(kilo-docs): update legacy cleanup for latest main (Josh Lambert, 2026-06-26)
- dd3aa1429 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-06-27)
- 5080c78e6 - feat(vscode): show usage by routed model (Josh Lambert, 2026-06-26)
- be82a8eaa - fix(agent-manager): collapse sessions by default (marius-kilocode, 2026-06-26)
- 3e375ffb6 - Merge branch 'main' into legend-bonnet (Marius, 2026-06-24)
- 61bbc34eb - fix(cli): release disconnected event streams (marius-kilocode, 2026-06-24)
- ef9b1dcec - fix(cli): stop loading .opencode config directories (marius-kilocode, 2026-06-24)
- 117a0d623 - fix(cli): prefer .kilo config directory (marius-kilocode, 2026-06-24)
- b443d3879 - Merge branch 'main' into fix/curl-upgrade-install-url (Marius, 2026-06-24)
- 0274b726c - fix(cli): dedupe subagent resume hint and await parent injection in test (maoxin1234, 2026-06-24)
- 2ac38d727 - test(cli): fix kilocode_change annotations on shared upstream test file (maoxin1234, 2026-06-24)
- 8ac629ccc - feat(cli): surface resumable task_id when a subagent stops on error (maoxin1234, 2026-06-24)
- 2404009bc - fix(cli): point curl upgrade at the install script (Marius, 2026-06-23)
- f15c8e532 - docs: clarify experimental flag settings (marius-kilocode, 2026-06-22)
- 9c29926e9 - refactor: try to fix win32 (Catriel Müller, 2026-06-19)
- d77eb8238 - refactor: fix windows process (Catriel Müller, 2026-06-19)
- afa963375 - feat(cli): add background process lifetimes (Catriel Müller, 2026-06-18)
- 4e3a4da63 - test: use provideTestInstance helper in agent permission overrides (Catriel Müller, 2026-06-18)
- bbf3c5b43 - feat: interactive terminal tool (Catriel Müller, 2026-06-18)
- e6d06beca - docs(kilo-docs): remove legacy IDE documentation (Josh Lambert, 2026-06-14)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/agent-manager-models.ts` (+99, -0)
- `packages/opencode/src/kilocode/tool/agent-manager-models.txt` (+5, -0)
- `packages/opencode/src/kilocode/tool/agent-manager.ts` (+159, -9)
- `packages/opencode/src/kilocode/tool/agent-manager.txt` (+1, -1)
- `packages/opencode/src/kilocode/tool/background-process.ts` (+35, -11)
- `packages/opencode/src/kilocode/tool/background-process.txt` (+10, -4)
- `packages/opencode/src/kilocode/tool/interactive-terminal.ts` (+94, -0)
- `packages/opencode/src/kilocode/tool/interactive-terminal.txt` (+25, -0)
- `packages/opencode/src/kilocode/tool/model-search.ts` (+30, -0)
- `packages/opencode/src/kilocode/tool/registry.ts` (+22, -5)
- `packages/opencode/src/kilocode/tool/task-background-process.ts` (+9, -0)
- `packages/opencode/src/kilocode/tool/task.ts` (+1, -0)
- `packages/opencode/src/tool/registry.ts` (+1, -0)
- `packages/opencode/src/tool/shell.ts` (+111, -97)
- `packages/opencode/src/tool/task.ts` (+27, -4)
- `packages/opencode/test/tool/registry.test.ts` (+13, -13)
- `packages/opencode/test/tool/skill.test.ts` (+1, -1)
- `packages/opencode/test/tool/task.test.ts` (+70, -1)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+8, -1)
- `packages/opencode/src/kilocode/agent/index.ts` (+16, -3)
- `packages/opencode/test/agent/agent.test.ts` (+4, -1)

#### Permission System (**/permission/)
- `packages/opencode/src/kilocode/permission/config-paths.ts` (+2, -2)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/agents/orchestrator-mode.md` (+0, -9)

#### Other Changes
- `.changeset/README.md` (+1, -1)
- `.changeset/agent-manager-sandbox-default.md` (+5, -0)
- `.changeset/agent-manager-tool-models.md` (+7, -0)
- `.changeset/background-process-lifetimes.md` (+5, -0)
- `.changeset/bright-terminals-help.md` (+5, -0)
- `.changeset/cli-sidebar-balance.md` (+5, -0)
- `.changeset/collapse-agent-sessions.md` (+5, -0)
- `.changeset/fix-curl-upgrade-url.md` (+5, -0)
- `.changeset/fix-kiloclaw-slash.md` (+7, -0)
- `.changeset/fix-slash-mention-highlight.md` (+5, -0)
- `.changeset/jetbrains-profile-balance.md` (+5, -0)
- `.changeset/jetbrains-restart-loading.md` (+5, -0)
- `.changeset/jetbrains-sse-reconnect-timeout.md` (+5, -0)
- `.changeset/model-selector-auto-icon.md` (+5, -0)
- `.changeset/prefer-kilo-config.md` (+5, -0)
- `.changeset/release-disconnected-streams.md` (+5, -0)
- `.changeset/send-inline-review-comments.md` (+5, -0)
- `.changeset/subagent-resumable-error.md` (+5, -0)
- `.changeset/vscode-model-usage.md` (+7, -0)
- `.gitattributes` (+7, -0)
- `.github/workflows/publish.yml` (+6, -2)
- `AGENTS.md` (+2, -2)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/kilo-docs/__tests__/content-integrity.test.ts` (+127, -0)
- `packages/kilo-docs/__tests__/previous-docs-redirects.spec.ts` (+118, -111)
- `packages/kilo-docs/__tests__/sitemap.test.ts` (+23, -2)
- `packages/kilo-docs/components/PageVersionSwitcher.tsx` (+2, -7)
- `packages/kilo-docs/components/SideNav.tsx` (+1, -7)
- `packages/kilo-docs/docs/getting-started/devcontainer-persistence.md` (+0, -107)
- `packages/kilo-docs/docs/getting-started/switching-from-cline.md` (+0, -315)
- `packages/kilo-docs/lib/nav/ai-providers.ts` (+0, -8)
- `packages/kilo-docs/lib/nav/automate.ts` (+2, -7)
- `packages/kilo-docs/lib/nav/code-with-ai.ts` (+0, -1)
- `packages/kilo-docs/lib/nav/customize.ts` (+0, -5)
- `packages/kilo-docs/lib/nav/getting-started.ts` (+0, -7)
- `packages/kilo-docs/lib/nav/tools.ts` (+2, -42)
- `packages/kilo-docs/lib/types.ts` (+2, -2)
- `packages/kilo-docs/mappingplan.md` (+0, -187)
- `packages/kilo-docs/markdoc/partials/install-jetbrains.md` (+2, -35)
- `packages/kilo-docs/markdoc/partials/install-vscode.md` (+0, -23)
- `packages/kilo-docs/pages/ai-providers/alibaba.md` (+0, -5)
- `packages/kilo-docs/pages/ai-providers/anthropic.md` (+0, -9)
- `packages/kilo-docs/pages/ai-providers/bedrock.md` (+0, -17)
- `packages/kilo-docs/pages/ai-providers/cerebras.md` (+0, -8)
- `packages/kilo-docs/pages/ai-providers/chutes-ai.md` (+0, -8)
- `packages/kilo-docs/pages/ai-providers/claude-code.md` (+0, -107)
- `packages/kilo-docs/pages/ai-providers/deepseek.md` (+0, -8)
- `packages/kilo-docs/pages/ai-providers/fireworks.md` (+0, -8)
- `packages/kilo-docs/pages/ai-providers/gemini.md` (+0, -8)
- `packages/kilo-docs/pages/ai-providers/glama.md` (+0, -59)
- `packages/kilo-docs/pages/ai-providers/groq.md` (+0, -8)
- `packages/kilo-docs/pages/ai-providers/human-relay.md` (+0, -35)
- `packages/kilo-docs/pages/ai-providers/inception.md` (+0, -8)
- `packages/kilo-docs/pages/ai-providers/index.md` (+0, -5)
- `packages/kilo-docs/pages/ai-providers/lmstudio.md` (+0, -9)
- `packages/kilo-docs/pages/ai-providers/minimax.md` (+0, -8)
- `packages/kilo-docs/pages/ai-providers/mistral.md` (+0, -8)
- `packages/kilo-docs/pages/ai-providers/moonshot.md` (+0, -8)
- `packages/kilo-docs/pages/ai-providers/ollama.md` (+0, -9)
- `packages/kilo-docs/pages/ai-providers/openai-chatgpt-plus-pro.md` (+0, -10)
- `packages/kilo-docs/pages/ai-providers/openai-compatible.md` (+0, -23)
- `packages/kilo-docs/pages/ai-providers/openai.md` (+0, -8)
- `packages/kilo-docs/pages/ai-providers/openrouter.md` (+0, -46)
- `packages/kilo-docs/pages/ai-providers/ovhcloud.md` (+0, -8)
- `packages/kilo-docs/pages/ai-providers/requesty.md` (+0, -8)
- `packages/kilo-docs/pages/ai-providers/sap-ai-core.md` (+0, -17)
- `packages/kilo-docs/pages/ai-providers/synthetic.md` (+30, -4)
- `packages/kilo-docs/pages/ai-providers/unbound.md` (+0, -8)
- `packages/kilo-docs/pages/ai-providers/v0.md` (+0, -14)
- `packages/kilo-docs/pages/ai-providers/venice.md` (+0, -5)
- `packages/kilo-docs/pages/ai-providers/vercel-ai-gateway.md` (+0, -8)
- `packages/kilo-docs/pages/ai-providers/vertex.md` (+0, -14)
- `packages/kilo-docs/pages/ai-providers/virtual-quota-fallback.md` (+0, -77)
- `packages/kilo-docs/pages/ai-providers/vscode-lm.md` (+0, -47)
- `packages/kilo-docs/pages/ai-providers/xai.md` (+0, -18)
- `packages/kilo-docs/pages/ai-providers/zenmux.md` (+0, -9)
- `packages/kilo-docs/pages/automate/agent-manager.md` (+3, -1)
- `packages/kilo-docs/pages/automate/code-reviews/overview.md` (+0, -7)
- `packages/kilo-docs/pages/automate/extending/auto-launch.md` (+0, -156)
- `packages/kilo-docs/pages/automate/extending/plugins.md` (+3, -3)
- `packages/kilo-docs/pages/automate/extending/shell-integration.md` (+0, -342)
- `packages/kilo-docs/pages/automate/how-tools-work.md` (+0, -94)
- `packages/kilo-docs/pages/automate/index.md` (+0, -1)
- `packages/kilo-docs/pages/automate/integrations.md` (+11, -3)
- `packages/kilo-docs/pages/automate/mcp/using-in-kilo-code.md` (+0, -167)
- `packages/kilo-docs/pages/automate/tools/access-mcp-resource.md` (+0, -135)
- `packages/kilo-docs/pages/automate/tools/apply-diff.md` (+0, -103)
- `packages/kilo-docs/pages/automate/tools/ask-followup-question.md` (+0, -179)
- `packages/kilo-docs/pages/automate/tools/attempt-completion.md` (+0, -183)
- `packages/kilo-docs/pages/automate/tools/browser-action.md` (+0, -164)
- `packages/kilo-docs/pages/automate/tools/delete-file.md` (+0, -60)
- `packages/kilo-docs/pages/automate/tools/execute-command.md` (+0, -163)
- `packages/kilo-docs/pages/automate/tools/index.md` (+4, -82)
- `packages/kilo-docs/pages/automate/tools/list-code-definition-names.md` (+0, -125)
- `packages/kilo-docs/pages/automate/tools/list-files.md` (+0, -142)
- `packages/kilo-docs/pages/automate/tools/new-task.md` (+0, -112)
- `packages/kilo-docs/pages/automate/tools/read-file.md` (+0, -198)
- `packages/kilo-docs/pages/automate/tools/search-files.md` (+0, -136)
- `packages/kilo-docs/pages/automate/tools/switch-mode.md` (+0, -160)
- `packages/kilo-docs/pages/automate/tools/update-todo-list.md` (+0, -170)
- `packages/kilo-docs/pages/automate/tools/use-mcp-tool.md` (+0, -198)
- `packages/kilo-docs/pages/automate/tools/write-to-file.md` (+0, -177)
- `packages/kilo-docs/pages/code-with-ai/agents/chat-interface.md` (+0, -50)
- `packages/kilo-docs/pages/code-with-ai/agents/context-mentions.md` (+0, -115)
- `packages/kilo-docs/pages/code-with-ai/agents/model-selection.md` (+0, -18)
- `packages/kilo-docs/pages/code-with-ai/agents/using-agents.md` (+0, -103)
- `packages/kilo-docs/pages/code-with-ai/features/autocomplete/index.md` (+0, -101)
- `packages/kilo-docs/pages/code-with-ai/features/autocomplete/mistral-setup.md` (+0, -81)
- `packages/kilo-docs/pages/code-with-ai/features/browser-use.md` (+0, -139)
- `packages/kilo-docs/pages/code-with-ai/features/checkpoints.md` (+0, -178)
- `packages/kilo-docs/pages/code-with-ai/features/code-actions.md` (+0, -92)
- `packages/kilo-docs/pages/code-with-ai/features/fast-edits.md` (+0, -40)
- `packages/kilo-docs/pages/code-with-ai/features/git-commit-generation.md` (+0, -37)
- `packages/kilo-docs/pages/code-with-ai/features/task-todo-list.md` (+4, -4)
- `packages/kilo-docs/pages/code-with-ai/gastown/wasteland/admin.md` (+3, -3)
- `packages/kilo-docs/pages/code-with-ai/gastown/wasteland/concepts.md` (+2, -2)
- `packages/kilo-docs/pages/code-with-ai/gastown/wasteland/quick-start.md` (+5, -6)
- `packages/kilo-docs/pages/code-with-ai/gastown/wasteland/settings.md` (+45, -25)
- `packages/kilo-docs/pages/code-with-ai/gastown/wasteland/workflow.md` (+2, -2)
- `packages/kilo-docs/pages/code-with-ai/index.md` (+0, -1)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli.md` (+2, -6)
- `packages/kilo-docs/pages/code-with-ai/platforms/kilo-connect.md` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/platforms/vscode/index.md` (+1, -27)
- `packages/kilo-docs/pages/contributing/architecture/cli-runtime.md` (+1, -1)
- `packages/kilo-docs/pages/customize/agents-md.md` (+0, -24)
- `packages/kilo-docs/pages/customize/context/codebase-indexing.md` (+0, -38)
- `packages/kilo-docs/pages/customize/context/context-condensing.md` (+0, -68)
- `packages/kilo-docs/pages/customize/context/kilocodeignore.md` (+0, -47)
- `packages/kilo-docs/pages/customize/context/large-projects.md` (+0, -54)
- `packages/kilo-docs/pages/customize/custom-instructions.md` (+0, -44)
- `packages/kilo-docs/pages/customize/custom-modes.md` (+20, -586)
- `packages/kilo-docs/pages/customize/custom-rules.md` (+0, -124)
- `packages/kilo-docs/pages/customize/custom-subagents.md` (+1, -1)
- `packages/kilo-docs/pages/customize/index.md` (+0, -1)
- `packages/kilo-docs/pages/customize/skills.md` (+0, -131)
- `packages/kilo-docs/pages/customize/workflows.md` (+0, -59)
- `packages/kilo-docs/pages/getting-started/faq/index.md` (+0, -4)
- `packages/kilo-docs/pages/getting-started/faq/known-issues.md` (+0, -157)
- `packages/kilo-docs/pages/getting-started/installing.md` (+0, -14)
- `packages/kilo-docs/pages/getting-started/quickstart.md` (+0, -62)
- `packages/kilo-docs/pages/getting-started/settings/auto-approving-actions.md` (+1, -337)
- `packages/kilo-docs/pages/getting-started/settings/auto-cleanup.md` (+0, -279)
- `packages/kilo-docs/pages/getting-started/settings/index.md` (+1, -107)
- `packages/kilo-docs/pages/getting-started/settings/system-notifications.md` (+0, -254)
- `packages/kilo-docs/pages/getting-started/setup-authentication.md` (+0, -20)
- `packages/kilo-docs/pages/getting-started/troubleshooting/troubleshooting-extension.md` (+0, -26)
- `packages/kilo-docs/previous-docs-redirects.js` (+287, -41)
- `packages/kilo-docs/public/img/gastown/wasteland/dolthub-credentials-dialog.png` (+-, --)
- `packages/kilo-docs/public/img/gastown/wasteland/gt-wasteland-connect-dialog.png` (+-, --)
- `packages/kilo-docs/public/img/integrations/dolthub/authorize.png` (+-, --)
- `packages/kilo-docs/public/img/integrations/dolthub/connect.png` (+-, --)
- `packages/kilo-docs/public/img/integrations/dolthub/connected.png` (+-, --)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-usage-collapsed-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-usage-expanded-200-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/chat/task-usage-expanded-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/source-links.md` (+2, -2)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-gateway/src/index.ts` (+1, -0)
- `packages/kilo-gateway/src/server/handlers.ts` (+17, -1)
- `packages/kilo-jetbrains/AGENTS.md` (+8, -0)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendAppService.kt` (+2, -1)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendConnectionService.kt` (+20, -1)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/rpc/KiloAppRpcApiImpl.kt` (+9, -0)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendAppServiceTest.kt` (+99, -112)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/app/KiloBackendChatManagerTest.kt` (+3, -1)
- `packages/kilo-jetbrains/backend/src/test/kotlin/ai/kilocode/backend/cli/ApiModelSerializationTest.kt` (+24, -0)
- `packages/kilo-jetbrains/build-tasks/src/main/kotlin/normalization/OpenApiSpecNormalizer.kt` (+2, -2)
- `packages/kilo-jetbrains/build-tasks/src/test/kotlin/normalization/OpenApiSpecNormalizerTest.kt` (+17, -4)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/profile/BalanceFormat.kt` (+17, -1)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/profile/LoggedInProfileUi.kt` (+165, -8)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/profile/ProfileUi.kt` (+10, -0)
- `packages/kilo-jetbrains/frontend/src/main/kotlin/ai/kilocode/client/settings/profile/UserProfileConfigurable.kt` (+2, -2)
- `packages/kilo-jetbrains/frontend/src/main/resources/messages/KiloBundle.properties` (+6, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/settings/UserProfileConfigurableTest.kt` (+256, -0)
- `packages/kilo-jetbrains/frontend/src/test/kotlin/ai/kilocode/client/testing/FakeWorkspaceRpcApi.kt` (+3, -3)
- `packages/kilo-jetbrains/script/test-ci.ts` (+3, -2)
- `packages/kilo-jetbrains/shared/src/main/kotlin/ai/kilocode/rpc/dto/KiloAppStateDto.kt` (+9, -0)
- `packages/kilo-sandbox/package.json` (+1, -1)
- `packages/kilo-ui/playwright.config.ts` (+1, -1)
- `packages/kilo-ui/src/components/message-highlight.test.ts` (+83, -0)
- `packages/kilo-ui/src/components/message-highlight.ts` (+103, -0)
- `packages/kilo-ui/src/components/message-part.tsx` (+2, -48)
- `packages/kilo-vscode/package.json` (+1, -1)
- `packages/kilo-vscode/playwright.config.ts` (+1, -1)
- `packages/kilo-vscode/src/KiloProvider.ts` (+89, -13)
- `packages/kilo-vscode/src/agent-manager/WorktreeStateManager.ts` (+3, -4)
- `packages/kilo-vscode/src/agent-manager/tool-start.ts` (+26, -6)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+1, -0)
- `packages/kilo-vscode/src/services/autocomplete/AutocompleteCodeActionProvider.ts` (+1, -1)
- `packages/kilo-vscode/src/services/autocomplete/AutocompleteServiceManager.ts` (+9, -1)
- `packages/kilo-vscode/src/services/autocomplete/AutocompleteStatusBar.ts` (+1, -1)
- `packages/kilo-vscode/src/services/autocomplete/shims/i18n.ts` (+0, -17)
- `packages/kilo-vscode/src/services/autocomplete/statusbar-utils.ts` (+1, -1)
- `packages/kilo-vscode/src/services/i18n/ar.ts` (+7, -0)
- `packages/kilo-vscode/src/services/i18n/autocomplete/ar.ts` (+47, -0)
- `packages/kilo-vscode/src/services/i18n/autocomplete/br.ts` (+46, -0)
- `packages/kilo-vscode/src/services/i18n/autocomplete/bs.ts` (+46, -0)
- `packages/kilo-vscode/src/services/i18n/autocomplete/da.ts` (+47, -0)
- `packages/kilo-vscode/src/services/i18n/autocomplete/de.ts` (+48, -0)
- `packages/kilo-vscode/src/services/{autocomplete/i18n => i18n/autocomplete}/en.ts` (+0, -0)
- `packages/kilo-vscode/src/services/i18n/autocomplete/es.ts` (+47, -0)
- `packages/kilo-vscode/src/services/i18n/autocomplete/fr.ts` (+48, -0)
- `packages/kilo-vscode/src/services/i18n/autocomplete/it.ts` (+47, -0)
- `packages/kilo-vscode/src/services/i18n/autocomplete/ja.ts` (+47, -0)
- `packages/kilo-vscode/src/services/i18n/autocomplete/ko.ts` (+46, -0)
- `packages/kilo-vscode/src/services/i18n/autocomplete/nl.ts` (+47, -0)
- `packages/kilo-vscode/src/services/i18n/autocomplete/no.ts` (+47, -0)
- `packages/kilo-vscode/src/services/i18n/autocomplete/pl.ts` (+46, -0)
- `packages/kilo-vscode/src/services/i18n/autocomplete/ru.ts` (+47, -0)
- `packages/kilo-vscode/src/services/i18n/autocomplete/th.ts` (+47, -0)
- `packages/kilo-vscode/src/services/i18n/autocomplete/tr.ts` (+48, -0)
- `packages/kilo-vscode/src/services/i18n/autocomplete/uk.ts` (+47, -0)
- `packages/kilo-vscode/src/services/i18n/autocomplete/zh.ts` (+46, -0)
- `packages/kilo-vscode/src/services/i18n/autocomplete/zht.ts` (+46, -0)
- `packages/kilo-vscode/src/services/i18n/br.ts` (+7, -0)
- `packages/kilo-vscode/src/services/i18n/bs.ts` (+7, -0)
- `packages/kilo-vscode/src/services/i18n/da.ts` (+7, -0)
- `packages/kilo-vscode/src/services/i18n/de.ts` (+7, -0)
- `packages/kilo-vscode/src/services/i18n/en.ts` (+7, -0)
- `packages/kilo-vscode/src/services/i18n/es.ts` (+7, -0)
- `packages/kilo-vscode/src/services/i18n/fr.ts` (+7, -0)
- `packages/kilo-vscode/src/services/i18n/index.ts` (+87, -0)
- `packages/kilo-vscode/src/services/i18n/it.ts` (+7, -0)
- `packages/kilo-vscode/src/services/i18n/ja.ts` (+7, -0)
- `packages/kilo-vscode/src/services/i18n/ko.ts` (+7, -0)
- `packages/kilo-vscode/src/services/i18n/nl.ts` (+7, -0)
- `packages/kilo-vscode/src/services/i18n/no.ts` (+7, -0)
- `packages/kilo-vscode/src/services/i18n/pl.ts` (+7, -0)
- `packages/kilo-vscode/src/services/i18n/ru.ts` (+7, -0)
- `packages/kilo-vscode/src/services/i18n/th.ts` (+7, -0)
- `packages/kilo-vscode/src/services/i18n/tr.ts` (+7, -0)
- `packages/kilo-vscode/src/services/i18n/uk.ts` (+7, -0)
- `packages/kilo-vscode/src/services/i18n/zh.ts` (+7, -0)
- `packages/kilo-vscode/src/services/i18n/zht.ts` (+7, -0)
- `packages/kilo-vscode/tests/setup/vscode-mock.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/agent-manager-tool-start.test.ts` (+67, -5)
- `packages/kilo-vscode/tests/unit/i18n-keys.test.ts` (+63, -10)
- `packages/kilo-vscode/tests/unit/i18n-shim.test.ts` (+53, -2)
- `packages/kilo-vscode/tests/unit/kilo-ui-contract.test.ts` (+8, -5)
- `packages/kilo-vscode/tests/unit/model-usage.test.ts` (+66, -0)
- `packages/kilo-vscode/tests/unit/new-worktree-dialog-sandbox.test.ts` (+26, -0)
- `packages/kilo-vscode/tests/unit/sandbox-bootstrap.test.ts` (+8, -3)
- `packages/kilo-vscode/tests/unit/worktree-state-manager.test.ts` (+18, -3)
- `packages/kilo-vscode/webview-ui/agent-manager/AgentManagerApp.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/DiffPanel.tsx` (+15, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/NewWorktreeDialog.tsx` (+56, -12)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+7, -2)
- `packages/kilo-vscode/webview-ui/diff-viewer/FullScreenDiffView.tsx` (+15, -0)
- `packages/kilo-vscode/webview-ui/diff-viewer/review-annotations.ts` (+45, -10)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskHeader.tsx` (+7, -32)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskUsage.tsx` (+121, -0)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelPreview.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelSelector.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/context/model-usage.ts` (+72, -0)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+93, -0)
- `packages/kilo-vscode/webview-ui/src/hooks/useSlashCommand.ts` (+8, -0)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/stories/chat.stories.tsx` (+81, -0)
- `packages/kilo-vscode/webview-ui/src/styles/task-header.css` (+84, -2)
- `packages/kilo-vscode/webview-ui/src/types/messages/extension-messages.ts` (+15, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/sessions.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/webview-messages.ts` (+13, -0)
- `packages/opencode/script/build-node.ts` (+0, -0)
- `packages/opencode/script/build.ts` (+0, -0)
- `packages/opencode/script/publish.ts` (+0, -0)
- `packages/opencode/script/test-runner.ts` (+28, -1)
- `packages/opencode/specs/tui-plugins.md` (+5, -8)
- `packages/opencode/src/cli/cmd/mcp.ts` (+17, -16)
- `packages/opencode/src/cli/cmd/run.ts` (+7, -0)
- `packages/opencode/src/cli/cmd/run/footer.ts` (+14, -1)
- `packages/opencode/src/cli/cmd/run/footer.view.tsx` (+21, -0)
- `packages/opencode/src/cli/cmd/run/runtime.lifecycle.ts` (+9, -1)
- `packages/opencode/src/cli/cmd/run/runtime.ts` (+17, -0)
- `packages/opencode/src/cli/cmd/run/session-data.ts` (+59, -1)
- `packages/opencode/src/cli/cmd/run/stream.transport.ts` (+12, -0)
- `packages/opencode/src/cli/cmd/run/tool.ts` (+42, -0)
- `packages/opencode/src/cli/cmd/run/types.ts` (+2, -0)
- `packages/opencode/src/cli/cmd/tui/config/tui.ts` (+8, -8)
- `packages/opencode/src/cli/cmd/tui/context/project.tsx` (+2, -0)
- `packages/opencode/src/cli/cmd/tui/context/sync.tsx` (+120, -19)
- `packages/opencode/src/cli/cmd/tui/context/theme.tsx` (+1, -1)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/home/tips-view.tsx` (+8, -6)
- `packages/opencode/src/cli/cmd/tui/plugin/api.tsx` (+5, -1)
- `packages/opencode/src/cli/cmd/tui/plugin/runtime.ts` (+6, -3)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+62, -6)
- `packages/opencode/src/cli/cmd/tui/routes/session/terminal.tsx` (+203, -0)
- `packages/opencode/src/config/agent.ts` (+10, -0)
- `packages/opencode/src/config/config.ts` (+2, -2)
- `packages/opencode/src/config/paths.ts` (+2, -2)
- `packages/opencode/src/effect/run-service.ts` (+7, -0)
- `packages/opencode/src/file/ripgrep.ts` (+1, -1)
- `packages/opencode/src/index.ts` (+2, -0)
- `packages/opencode/src/kilocode/agent-manager/event.ts` (+9, -0)
- `packages/opencode/src/kilocode/background-process/index.ts` (+703, -46)
- `packages/opencode/src/kilocode/background-process/runner.ts` (+218, -0)
- `packages/opencode/src/kilocode/background-process/windows-job.ts` (+88, -0)
- `packages/opencode/src/kilocode/balance-refresh.ts` (+12, -0)
- `packages/opencode/src/kilocode/cli/cmd/run/interactive-terminal.tsx` (+144, -0)
- `packages/opencode/src/kilocode/cli/cmd/run/types.ts` (+1, -0)
- `packages/opencode/src/kilocode/cli/cmd/tui/component/dialog-process-list.tsx` (+5, -1)
- `packages/opencode/src/kilocode/cli/cmd/tui/vt/vt-screen.ts` (+542, -0)
- `packages/opencode/src/kilocode/cli/setup.ts` (+7, -0)
- `packages/opencode/src/kilocode/cli/shutdown.ts` (+14, -0)
- `packages/opencode/src/kilocode/config/config.ts` (+3, -6)
- `packages/opencode/src/kilocode/config/overlay.ts` (+3, -8)
- `packages/opencode/src/kilocode/config/sources.ts` (+1, -1)
- `packages/opencode/src/kilocode/docs/migration.md` (+4, -13)
- `packages/opencode/src/kilocode/docs/rules-migration.md` (+1, -1)
- `packages/opencode/src/kilocode/installation/index.ts` (+1, -1)
- `packages/opencode/src/kilocode/interactive-terminal/index.ts` (+446, -0)
- `packages/opencode/src/kilocode/interactive-terminal/output.ts` (+13, -0)
- `packages/opencode/src/kilocode/kilo-commands.tsx` (+13, -1)
- `packages/opencode/src/kilocode/modes-migrator.ts` (+3, -1)
- `packages/opencode/src/kilocode/plugins/sidebar-background-processes.tsx` (+11, -1)
- `packages/opencode/src/kilocode/plugins/sidebar-footer.tsx` (+179, -1)
- `packages/opencode/src/kilocode/server/httpapi/groups/interactive-terminal.ts` (+103, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/interactive-terminal.ts` (+62, -0)
- `packages/opencode/src/kilocode/server/httpapi/handlers/kilo-gateway.ts` (+2, -1)
- `packages/opencode/src/kilocode/server/httpapi/server.ts` (+2, -0)
- `packages/opencode/src/kilocode/server/sse.ts` (+51, -0)
- `packages/opencode/src/kilocode/session/model-usage.ts` (+23, -1)
- `packages/opencode/src/kilocode/skills/kilo-config.md` (+11, -12)
- `packages/opencode/src/kilocode/tui/config.ts` (+1, -1)
- `packages/opencode/src/plugin/install.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/api.ts` (+2, -0)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/global.ts` (+11, -2)
- `packages/opencode/src/session/session.ts` (+2, -0)
- `packages/opencode/test/cli/auto-mode.test.ts` (+17, -6)
- `packages/opencode/test/cli/run/footer.view.test.tsx` (+3, -0)
- `packages/opencode/test/cli/tui/plugin-loader.test.ts` (+4, -4)
- `packages/opencode/test/config/config.test.ts` (+1, -1)
- `packages/opencode/test/config/tui.test.ts` (+4, -4)
- `packages/opencode/test/fixture/tui-sdk.ts` (+1, -1)
- `packages/opencode/test/kilocode/agent-config-metadata.test.ts` (+27, -0)
- `packages/opencode/test/kilocode/agent-manager-models-tool.test.ts` (+145, -0)
- `packages/opencode/test/kilocode/agent-manager-tool.test.ts` (+223, -4)
- `packages/opencode/test/kilocode/background-process-shutdown.test.ts` (+166, -0)
- `packages/opencode/test/kilocode/background-process-tool.test.ts` (+4, -0)
- `packages/opencode/test/kilocode/background-process.test.ts` (+386, -3)
- `packages/opencode/test/kilocode/cli/cmd/run/interactive-terminal.test.ts` (+98, -0)
- `packages/opencode/test/kilocode/cli/cmd/tui/model-usage.test.ts` (+1, -0)
- `packages/opencode/test/kilocode/config/config.test.ts` (+95, -0)
- `packages/opencode/test/kilocode/installation/upgrade.test.ts` (+1, -1)
- `packages/opencode/test/kilocode/interactive-terminal.test.ts` (+323, -0)
- `packages/opencode/test/kilocode/modes-migrator.test.ts` (+24, -0)
- `packages/opencode/test/kilocode/plugin-dependencies.ts` (+1, -1)
- `packages/opencode/test/kilocode/server/config-overlay.test.ts` (+53, -0)
- `packages/opencode/test/kilocode/server/config-sources.test.ts` (+10, -4)
- `packages/opencode/test/kilocode/server/httpapi-exercise-scenarios.ts` (+34, -5)
- `packages/opencode/test/kilocode/server/httpapi-global-sse.test.ts` (+68, -0)
- `packages/opencode/test/kilocode/server/httpapi-public.test.ts` (+2, -0)
- `packages/opencode/test/kilocode/server/kilo-gateway-statuses.test.ts` (+26, -0)
- `packages/opencode/test/kilocode/server/tui-config.test.ts` (+19, -0)
- `packages/opencode/test/kilocode/session-model-usage.test.ts` (+1, -0)
- `packages/opencode/test/kilocode/sidebar-footer.test.ts` (+55, -0)
- `packages/opencode/test/kilocode/task-nesting.test.ts` (+79, -2)
- `packages/opencode/test/kilocode/tool-registry-indexing-import-failure.test.ts` (+1, -0)
- `packages/opencode/test/kilocode/tool-registry-indexing.test.ts` (+47, -2)
- `packages/opencode/test/kilocode/tool-registry-semantic-import-failure.test.ts` (+1, -0)
- `packages/opencode/test/kilocode/tui-sync-event.test.ts` (+193, -1)
- `packages/opencode/test/kilocode/vt-screen.test.ts` (+170, -0)
- `packages/opencode/test/plugin/auth-override.test.ts` (+1, -1)
- `packages/opencode/test/plugin/install-concurrency.test.ts` (+7, -5)
- `packages/opencode/test/plugin/install.test.ts` (+46, -30)
- `packages/opencode/test/provider/provider.test.ts` (+2, -2)
- `packages/opencode/test/server/httpapi-provider.test.ts` (+4, -4)
- `packages/opencode/test/server/httpapi-sdk.test.ts` (+1, -1)
- `packages/opencode/test/skill/skill.test.ts` (+26, -10)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+206, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+220, -0)
- `packages/sdk/openapi.json` (+593, -4)
- `packages/ui/package.json` (+1, -1)
- `script/check-forbidden-strings.ts` (+1, -0)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 8a56507dd..b5c0f814c 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -7,7 +7,7 @@
   "private": true,
   "scripts": {
     "test": "bun test",
-    "test:ci": "mkdir -p .artifacts/unit && bun test --timeout 30000 --reporter=junit --reporter-outfile=.artifacts/unit/junit.xml",
+    "test:ci": "mkdir -p .artifacts/unit && bun test --timeout 30000 --dots --reporter=junit --reporter-outfile=.artifacts/unit/junit.xml",
     "typecheck": "tsgo --noEmit"
   },
   "bin": {
```

#### packages/kilo-docs/pages/code-with-ai/agents/orchestrator-mode.md
```diff
diff --git a/packages/kilo-docs/pages/code-with-ai/agents/orchestrator-mode.md b/packages/kilo-docs/pages/code-with-ai/agents/orchestrator-mode.md
index 8fb065bce..1f1bead1d 100644
--- a/packages/kilo-docs/pages/code-with-ai/agents/orchestrator-mode.md
+++ b/packages/kilo-docs/pages/code-with-ai/agents/orchestrator-mode.md
@@ -29,12 +29,3 @@ Now, **subagent support is built into agents that have full tool access** (Code,
 4. When done, the subagent returns a summary to the parent agent, which continues its work.
 
 Agents can launch multiple subagent sessions concurrently for parallel work.
-
-{% callout type="info" title="VSCode (Legacy)" collapsed=true %}
-In the legacy extension, orchestrator mode uses two dedicated tools:
-
-1. [`new_task`](/docs/automate/tools/new-task) — Creates a subtask with context passed via the `message` parameter and a mode specified via `mode` (e.g., `code`, `architect`, `debug`).
-2. [`attempt_completion`](/docs/automate/tools/attempt-completion) — Signals subtask completion and passes a summary back to the parent via the `result` parameter.
-
-{% youtube url="https://www.youtube.com/watch?v=20MmJNeOODo" caption="Orchestrator Mode in the legacy extension" /%}
-{% /callout %}
```

#### packages/opencode/src/agent/agent.ts
```diff
diff --git a/packages/opencode/src/agent/agent.ts b/packages/opencode/src/agent/agent.ts
index d7b1dd7e3..2f14fcada 100644
--- a/packages/opencode/src/agent/agent.ts
+++ b/packages/opencode/src/agent/agent.ts
@@ -35,6 +35,7 @@ export type RequirementBlockedError = InstanceType<typeof AgentRequirements.Bloc
 export const Info = Schema.Struct({
   name: Schema.String,
   displayName: Schema.optional(Schema.String), // kilocode_change - human-readable name for org modes
+  source: Schema.optional(Schema.String), // kilocode_change - origin marker (organization | global | project)
   description: Schema.optional(Schema.String),
   deprecated: Schema.optional(Schema.Boolean), // kilocode_change
   mode: Schema.Literals(["subagent", "primary", "all"]),
@@ -129,6 +130,7 @@ export const layer = Layer.effect(
           },
           suggest: "deny", // kilocode_change
           question: "deny",
+          interactive_terminal: "deny", // kilocode_change - human-driven tools are primary-agent only
           plan_enter: "deny",
           plan_exit: "deny",
           repo_clone: "deny",
@@ -158,6 +160,7 @@ export const layer = Layer.effect(
               defaults,
               Permission.fromConfig({
                 question: "allow",
+                interactive_terminal: "allow", // kilocode_change
                 suggest: "allow", // kilocode_change
                 plan_enter: "allow",
               }),
@@ -334,7 +337,11 @@ export const layer = Layer.effect(
           item.hidden = value.hidden ?? item.hidden
           item.name = value.name ?? item.name
           item.steps = value.steps ?? item.steps
-          item.requirements = value.requirements ?? item.requirements // kilocode_change
+          // kilocode_change start - carry metadata as typed fields, never as provider options
+          item.displayName = value.displayName ?? item.displayName
+          item.source = value.source ?? item.source
+          item.requirements = value.requirements ?? item.requirements
+          // kilocode_change end
           item.options = mergeDeep(item.options, value.options ?? {})
           item.permission = Permission.merge(item.permission, Permission.fromConfig(value.permission ?? {}))
           KiloAgent.processConfigItem(item) // kilocode_change - populate displayName from options
```

#### packages/opencode/src/kilocode/agent/index.ts
```diff
diff --git a/packages/opencode/src/kilocode/agent/index.ts b/packages/opencode/src/kilocode/agent/index.ts
index 158593135..30a575061 100644
--- a/packages/opencode/src/kilocode/agent/index.ts
+++ b/packages/opencode/src/kilocode/agent/index.ts
@@ -264,15 +264,27 @@ export function preprocessConfig<T>(agentConfig: Record<string, T>): Record<stri
   return result
 }
 
-// Set displayName and deprecated from options after config item is processed.
+// Lift Kilo-internal metadata onto typed agent fields and remove it from `options`.
+// Older org modes and marketplace agents stored `displayName`/`source` inside the
+// `options` record, which is otherwise forwarded verbatim to the provider as request
+// parameters. Promoting then deleting them keeps `options` provider-clean at the source
+// (the request boundary still strips as a safety net).
 export function processConfigItem(item: {
   options: Record<string, unknown>
   displayName?: string
+  source?: string
   deprecated?: boolean
 }) {
-  if (item.options?.displayName && typeof item.options.displayName === "string") {
+  if (!item.displayName && typeof item.options?.displayName === "string") {
     item.displayName = item.options.displayName
   }
+  if (!item.source && typeof item.options?.source === "string") {
+    item.source = item.options.source
+  }
+  if (item.options) {
+    delete item.options.displayName
+    delete item.options.source
+  }
 }
 
 const locked = new Set(["compaction", "title", "summary"])
@@ -319,6 +331,7 @@ export function patchAgents(
     {
       name: string
       displayName?: string
+      source?: string
       description?: string
       deprecated?: boolean
       mode: "subagent" | "primary" | "all"
@@ -495,7 +508,7 @@ export async function remove(input: { name: string; agent?: AgentInfo; dirs: str
   if (!input.agent) throw new RemoveError({ name: input.name, message: "agent not found" })
   if (input.agent.native) throw new RemoveError({ name: input.name, message: "cannot remove native agent" })
   // Prevent removal of organization-managed agents
-  if (input.agent.options?.source === "organization")
+  if (input.agent.source === "organization" || input.agent.options?.source === "organization")
     throw new RemoveError({
       name: input.name,
```

#### packages/opencode/src/kilocode/permission/config-paths.ts
```diff
diff --git a/packages/opencode/src/kilocode/permission/config-paths.ts b/packages/opencode/src/kilocode/permission/config-paths.ts
index 4946ec92a..c120bc433 100644
--- a/packages/opencode/src/kilocode/permission/config-paths.ts
+++ b/packages/opencode/src/kilocode/permission/config-paths.ts
@@ -5,9 +5,9 @@ import { KilocodePaths } from "@/kilocode/paths"
 export namespace ConfigProtection {
   /**
    * Config directory prefixes (relative paths, forward-slash normalized).
-   * Matches .kilo/, .kilocode/, .opencode/ at any depth within the project.
+   * Matches .kilo/ and legacy .kilocode/ at any depth within the project.
    */
-  const CONFIG_DIRS = [".kilo/", ".kilocode/", ".opencode/"]
+  const CONFIG_DIRS = [".kilo/", ".kilocode/"]
 
   /**
    * Subdirectories under CONFIG_DIRS that are NOT config files (e.g. plan files).
```


*... and more files (showing first 5)*

## opencode Changes (c363775..8289883)

### Commits

- 8289883 - chore: generate (opencode-agent[bot], 2026-06-30)
- 003c22b - fix(desktop): context menu button / tab intermittent issue (#34420) (usrnk1, 2026-06-30)
- 1982d98 - fix(session-ui): align code copy tooltip with v2 style (#34459) (opencode-agent[bot], 2026-06-30)
- 90f0576 - fix(session-ui): deselect review line on draft cancel (#34585) (opencode-agent[bot], 2026-06-30)
- e34822d - fix(desktop): preserve selected model during session promotion (#34466) (usrnk1, 2026-06-30)
- b19ae65 - sync (Frank, 2026-06-30)
- 6b074ed - fix(app): suppress middle-click tab auxclick (#34355) (opencode-agent[bot], 2026-06-30)
- e687eb9 - fix(app): register export logs globally (#34352) (opencode-agent[bot], 2026-06-30)
- 797cb53 - chore: generate (opencode-agent[bot], 2026-06-30)
- 0a5bed2 - feat(tui): add yolo permission mode (#33279) (Dax, 2026-06-30)
- ba41dad - ci: skip issue actions for team authors (#34556) (opencode-agent[bot], 2026-06-29)
- 451876b - refactor(opencode): remove core service layer exports (#34518) (James Long, 2026-06-29)
- 91561bb - refactor(opencode): remove app service layer exports (#34517) (James Long, 2026-06-29)
- 018ce34 - revert(core): skip fff in node runtime (#34549) (opencode-agent[bot], 2026-06-30)
- ce82b21 - chore: generate (opencode-agent[bot], 2026-06-30)
- 1f37c26 - refactor(opencode): use layer nodes in remaining harnesses (#34516) (James Long, 2026-06-29)
- cb3e28d - fix(app): collapse review pane by default (#34165) (opencode-agent[bot], 2026-06-30)
- 8f1e13f - fix(core): skip fff in node runtime (#34353) (opencode-agent[bot], 2026-06-30)
- 2fe68b5 - fix(ui): prevent tool status blank frame (#34547) (Luke Parker, 2026-06-30)
- 2ace237 - chore: generate (opencode-agent[bot], 2026-06-30)
- 5b62211 - refactor(opencode): build runtimes from layer nodes (#34515) (James Long, 2026-06-29)
- 60b6229 - zen: track region (Frank, 2026-06-29)
- 4caec80 - chore: generate (opencode-agent[bot], 2026-06-29)
- e9d4ca7 - zen: track region (Frank, 2026-06-29)
- d71454c - fix(core): expose models.dev modes as models (#34521) (Aiden Cline, 2026-06-29)
- 884c256 - fix(console): cancel upstream provider requests (#34467) (Dustin Deus, 2026-06-29)
- 7823538 - chore: generate (opencode-agent[bot], 2026-06-29)
- fd213e6 - fix(mcp): prefer content over structured output (#34505) (Aiden Cline, 2026-06-29)
- 3726052 - refactor(opencode): use layer nodes in server tests (#34503) (James Long, 2026-06-29)
- 7d33a6f - chore: generate (opencode-agent[bot], 2026-06-29)
- 7a035d7 - refactor(opencode): bind instance bootstrap node (#34502) (James Long, 2026-06-29)
- 9151af7 - chore: generate (opencode-agent[bot], 2026-06-29)
- 15bcbb1 - refactor(opencode): migrate session tests to layer nodes (#34494) (James Long, 2026-06-29)
- 4d32947 - chore: generate (opencode-agent[bot], 2026-06-29)
- aae0e89 - refactor(opencode): use layer nodes in plugin tests (#34495) (James Long, 2026-06-29)
- 93a7b4a - chore: generate (opencode-agent[bot], 2026-06-29)
- 0ebe74b - refactor(opencode): migrate llm tests to layer nodes (#34479) (James Long, 2026-06-29)
- b9dae85 - refactor(opencode): migrate compaction and workspace tests to layer nodes (#34478) (James Long, 2026-06-29)
- d8f9388 - chore: generate (opencode-agent[bot], 2026-06-29)
- be14739 - refactor(core): convert config tests to nodes (#34474) (James Long, 2026-06-29)
- 762588c - refactor(core): convert prompt tests to nodes (#34470) (James Long, 2026-06-29)
- d6e54e9 - chore: generate (opencode-agent[bot], 2026-06-29)
- d4fd528 - refactor(core): convert more opencode tests to nodes (#34464) (James Long, 2026-06-29)
- de18555 - chore: generate (opencode-agent[bot], 2026-06-29)
- bc5ce5e - refactor(core): convert opencode tests to nodes (#34453) (James Long, 2026-06-29)
- b10d617 - chore: generate (opencode-agent[bot], 2026-06-29)
- 18466b8 - feat(llm): add tool schema projections (#34454) (Shoubhit Dash, 2026-06-29)
- 71ec022 - chore: generate (opencode-agent[bot], 2026-06-29)
- f7eeb08 - fix(llm): narrow raw overlays (#34448) (Shoubhit Dash, 2026-06-29)
- 9205dfe - chore: generate (opencode-agent[bot], 2026-06-29)
- a377642 - refactor(core): finish test layer node conversion (#34385) (James Long, 2026-06-29)
- c0e43c0 - chore: generate (opencode-agent[bot], 2026-06-29)
- 08c5a2a - feat(llm): enforce request precedence (#34440) (Shoubhit Dash, 2026-06-29)
- 7077c70 - chore: generate (opencode-agent[bot], 2026-06-29)
- 1fd8bf5 - feat(llm): add model defaults and compatibility data (#34436) (Shoubhit Dash, 2026-06-29)
- 6d9539f - fix: exempt org issues from compliance close (#34431) (opencode-agent[bot], 2026-06-29)
- e5101d9 - test(llm): lock event reducer laws (#34423) (Shoubhit Dash, 2026-06-29)
- b0151e1 - test(llm): verify generate reducer law (#34418) (Shoubhit Dash, 2026-06-29)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/core/src/tool/apply-patch.ts` (+8, -0)
- `packages/core/src/tool/bash.ts` (+8, -0)
- `packages/core/src/tool/builtins.ts` (+13, -30)
- `packages/core/src/tool/edit.ts` (+8, -0)
- `packages/core/src/tool/glob.ts` (+8, -0)
- `packages/core/src/tool/grep.ts` (+8, -0)
- `packages/core/src/tool/question.ts` (+8, -0)
- `packages/core/src/tool/read.ts` (+8, -0)
- `packages/core/src/tool/skill.ts` (+8, -0)
- `packages/core/src/tool/todowrite.ts` (+8, -0)
- `packages/core/src/tool/webfetch.ts` (+9, -0)
- `packages/core/src/tool/websearch.ts` (+11, -0)
- `packages/core/src/tool/write.ts` (+8, -0)
- `packages/opencode/src/tool/registry.ts` (+3, -27)
- `packages/opencode/src/tool/truncate.ts` (+1, -3)
- `packages/opencode/test/tool/apply_patch.test.ts` (+3, -7)
- `packages/opencode/test/tool/edit.test.ts` (+3, -7)
- `packages/opencode/test/tool/external-directory.test.ts` (+2, -1)
- `packages/opencode/test/tool/glob.test.ts` (+3, -7)
- `packages/opencode/test/tool/grep.test.ts` (+3, -7)
- `packages/opencode/test/tool/lsp.test.ts` (+4, -1)
- `packages/opencode/test/tool/question.test.ts` (+3, -8)
- `packages/opencode/test/tool/read.test.ts` (+11, -8)
- `packages/opencode/test/tool/shell.test.ts` (+12, -7)
- `packages/opencode/test/tool/skill.test.ts` (+2, -3)
- `packages/opencode/test/tool/task.test.ts` (+21, -14)
- `packages/opencode/test/tool/tool-define.test.ts` (+3, -2)
- `packages/opencode/test/tool/truncation.test.ts` (+7, -9)
- `packages/opencode/test/tool/webfetch.test.ts` (+8, -2)
- `packages/opencode/test/tool/write.test.ts` (+11, -8)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+1, -10)
- `packages/opencode/test/agent/agent.test.ts` (+4, -9)
- `packages/opencode/test/agent/plan-mode-subagent-bypass.test.ts` (+2, -1)
- `packages/opencode/test/agent/plugin-agent-regression.test.ts` (+17, -30)

#### Permission System (**/permission/)
- `packages/opencode/src/permission/index.ts` (+1, -3)
- `packages/opencode/test/permission/next.test.ts` (+6, -8)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/console/core/migrations/20260626161712_oval_callisto/migration.sql` (+1, -0)
- `packages/console/core/migrations/20260626161712_oval_callisto/snapshot.json` (+3093, -0)
- `packages/console/core/src/schema/workspace.sql.ts` (+2, -1)
- `packages/console/core/src/workspace.ts` (+25, -3)
- `packages/core/src/control-plane/move-session.ts` (+7, -0)
- `packages/core/src/effect/layer-node.ts` (+44, -1)
- `packages/core/src/observability.ts` (+3, -0)
- `packages/core/src/plugin/models-dev.ts` (+101, -52)
- `packages/core/test/agent.test.ts` (+2, -1)
- `packages/core/test/background-job.test.ts` (+6, -3)
- `packages/core/test/command.test.ts` (+2, -1)
- `packages/core/test/config/config.test.ts` (+4, -7)
- `packages/core/test/database-migration.test.ts` (+3, -2)
- `packages/core/test/effect/layer-node/layer-node-types.test.ts` (+4, -4)
- `packages/core/test/effect/layer-node/layer-node.test.ts` (+15, -0)
- `packages/core/test/event.test.ts` (+8, -5)
- `packages/core/test/file-mutation.test.ts` (+10, -5)
- `packages/core/test/filesystem/watcher.test.ts` (+9, -13)
- `packages/core/test/fixture/effect-flock-worker.ts` (+3, -3)
- `packages/core/test/instruction-context.test.ts` (+87, -61)
- `packages/core/test/location-layer.test.ts` (+5, -20)
- `packages/core/test/location.test.ts` (+2, -1)
- `packages/core/test/models.test.ts` (+1, -1)
- `packages/core/test/move-session.test.ts` (+13, -36)
- `packages/core/test/npm.test.ts` (+3, -10)
- `packages/core/test/permission.test.ts` (+14, -19)
- `packages/core/test/plugin/command.test.ts` (+5, -6)
- `packages/core/test/plugin/fixture.ts` (+42, -27)
- `packages/core/test/plugin/models-dev.test.ts` (+99, -0)
- `packages/core/test/plugin/provider-dynamic.test.ts` (+2, -1)
- `packages/core/test/plugin/provider-opencode.test.ts` (+6, -1)
- `packages/core/test/policy.test.ts` (+6, -4)
- `packages/core/test/pty/pty-session.test.ts` (+12, -11)
- `packages/core/test/pty/ticket.test.ts` (+5, -2)
- `packages/core/test/reference-guidance.test.ts` (+31, -28)
- `packages/core/test/session-create.test.ts` (+13, -21)
- `packages/core/test/session-history.test.ts` (+8, -17)
- `packages/core/test/session-prompt.test.ts` (+5, -16)
- `packages/core/test/session-runner-recorded.test.ts` (+48, -47)
- `packages/core/test/session-runner-tool-registry.test.ts` (+9, -3)
- `packages/core/test/session-runner.test.ts` (+53, -57)
- `packages/core/test/skill/guidance.test.ts` (+4, -1)
- `packages/core/test/snapshot.test.ts` (+6, -17)
- `packages/core/test/system-context/registry.test.ts` (+2, -1)
- `packages/core/test/tool-apply-patch.test.ts` (+23, -12)
- `packages/core/test/tool-bash.test.ts` (+18, -13)
- `packages/core/test/tool-edit.test.ts` (+23, -12)
- `packages/core/test/tool-question.test.ts` (+7, -5)
- `packages/core/test/tool-read.test.ts` (+22, -29)
- `packages/core/test/tool-skill.test.ts` (+8, -11)
- `packages/core/test/tool-todowrite.test.ts` (+17, -7)
- `packages/core/test/tool-webfetch.test.ts` (+13, -10)
- `packages/core/test/tool-websearch.test.ts` (+14, -7)
- `packages/core/test/tool-write.test.ts` (+23, -11)

#### Other Changes
- `.github/workflows/compliance-close.yml` (+38, -0)
- `.github/workflows/duplicate-issues.yml` (+45, -1)
- `.github/workflows/triage.yml` (+19, -0)
- `packages/app/src/app.tsx` (+26, -1)
- `packages/app/src/components/session-context-usage.tsx` (+37, -13)
- `packages/app/src/components/titlebar-tab-nav.tsx` (+15, -2)
- `packages/app/src/context/layout.tsx` (+31, -13)
- `packages/app/src/context/local.tsx` (+8, -5)
- `packages/app/src/desktop-menu.test.ts` (+13, -0)
- `packages/app/src/pages/layout.tsx` (+0, -12)
- `packages/console/app/src/i18n/ar.ts` (+5, -0)
- `packages/console/app/src/i18n/br.ts` (+5, -0)
- `packages/console/app/src/i18n/da.ts` (+5, -0)
- `packages/console/app/src/i18n/de.ts` (+5, -0)
- `packages/console/app/src/i18n/en.ts` (+5, -0)
- `packages/console/app/src/i18n/es.ts` (+5, -0)
- `packages/console/app/src/i18n/fr.ts` (+5, -0)
- `packages/console/app/src/i18n/it.ts` (+5, -0)
- `packages/console/app/src/i18n/ja.ts` (+5, -0)
- `packages/console/app/src/i18n/ko.ts` (+5, -0)
- `packages/console/app/src/i18n/no.ts` (+5, -0)
- `packages/console/app/src/i18n/pl.ts` (+5, -0)
- `packages/console/app/src/i18n/ru.ts` (+5, -0)
- `packages/console/app/src/i18n/th.ts` (+5, -0)
- `packages/console/app/src/i18n/tr.ts` (+5, -0)
- `packages/console/app/src/i18n/uk.ts` (+5, -0)
- `packages/console/app/src/i18n/zh.ts` (+4, -0)
- `packages/console/app/src/i18n/zht.ts` (+4, -0)
- `packages/console/app/src/lib/request-country.ts` (+5, -0)
- `packages/console/app/src/routes/workspace/[id]/go/lite-section.module.css` (+34, -0)
- `packages/console/app/src/routes/workspace/[id]/go/lite-section.tsx` (+49, -0)
- `packages/console/app/src/routes/workspace/[id]/settings/settings-section.tsx` (+1, -0)
- `packages/console/app/src/routes/zen/util/error.ts` (+1, -0)
- `packages/console/app/src/routes/zen/util/handler.ts` (+115, -64)
- `packages/llm/src/protocols/anthropic-messages.ts` (+14, -4)
- `packages/llm/src/protocols/bedrock-converse.ts` (+12, -5)
- `packages/llm/src/protocols/gemini.ts` (+14, -3)
- `packages/llm/src/protocols/openai-chat.ts` (+11, -3)
- `packages/llm/src/protocols/openai-responses.ts` (+11, -3)
- `packages/llm/src/protocols/shared.ts` (+1, -34)
- `packages/llm/src/protocols/utils/gemini-tool-schema.ts` (+1, -3)
- `packages/llm/src/protocols/utils/tool-schema.ts` (+86, -0)
- `packages/llm/src/provider.ts` (+1, -2)
- `packages/llm/src/route/client.ts` (+13, -6)
- `packages/llm/src/route/transport/http.ts` (+47, -0)
- `packages/llm/src/schema/options.ts` (+56, -1)
- `packages/llm/test/adapter.test.ts` (+8, -2)
- `packages/llm/test/llm.test.ts` (+34, -2)
- `packages/llm/test/prepare.test.ts` (+178, -0)
- `packages/llm/test/provider/anthropic-messages.test.ts` (+4, -0)
- `packages/llm/test/provider/openai-responses.test.ts` (+5, -0)
- `packages/llm/test/response.test.ts` (+41, -3)
- `packages/llm/test/tool-schema-projection.test.ts` (+117, -0)
- `packages/opencode/src/account/account.ts` (+1, -3)
- `packages/opencode/src/account/repo.ts` (+1, -3)
- `packages/opencode/src/acp/directory.ts` (+10, -8)
- `packages/opencode/src/acp/service.ts` (+7, -5)
- `packages/opencode/src/acp/session.ts` (+3, -2)
- `packages/opencode/src/acp/usage.ts` (+13, -6)
- `packages/opencode/src/auth/index.ts` (+1, -3)
- `packages/opencode/src/background/job.ts` (+1, -3)
- `packages/opencode/src/cli/cmd/debug/scrap.ts` (+2, -1)
- `packages/opencode/src/cli/cmd/run.ts` (+12, -2)
- `packages/opencode/src/cli/cmd/tui.ts` (+7, -0)
- `packages/opencode/src/command/index.ts` (+1, -7)
- `packages/opencode/src/config/config.ts` (+1, -11)
- `packages/opencode/src/config/tui.ts` (+5, -3)
- `packages/opencode/src/control-plane/workspace.ts` (+11, -16)
- `packages/opencode/src/effect/app-runtime.ts` (+58, -53)
- `packages/opencode/src/effect/bootstrap-runtime.ts` (+4, -8)
- `packages/opencode/src/effect/runtime-flags.ts` (+1, -3)
- `packages/opencode/src/env/index.ts` (+1, -3)
- `packages/opencode/src/event-v2-bridge.ts` (+1, -3)
- `packages/opencode/src/format/index.ts` (+1, -7)
- `packages/opencode/src/git/index.ts` (+1, -3)
- `packages/opencode/src/image/image.ts` (+1, -3)
- `packages/opencode/src/installation/index.ts` (+5, -6)
- `packages/opencode/src/lsp/lsp.ts` (+1, -7)
- `packages/opencode/src/mcp/auth.ts` (+1, -3)
- `packages/opencode/src/mcp/catalog.ts` (+2, -1)
- `packages/opencode/src/mcp/index.ts` (+1, -11)
- `packages/opencode/src/plugin/index.ts` (+1, -7)
- `packages/opencode/src/plugin/tui/runtime.ts` (+2, -1)
- `packages/opencode/src/project/bootstrap.ts` (+3, -16)
- `packages/opencode/src/project/instance-layer.ts` (+0, -11)
- `packages/opencode/src/project/instance-store.ts` (+5, -5)
- `packages/opencode/src/project/project.ts` (+1, -12)
- `packages/opencode/src/project/vcs.ts` (+1, -3)
- `packages/opencode/src/provider/auth.ts` (+1, -5)
- `packages/opencode/src/provider/provider.ts` (+1, -13)
- `packages/opencode/src/question/index.ts` (+1, -3)
- `packages/opencode/src/server/routes/instance/httpapi/server.ts` (+2, -1)
- `packages/opencode/src/server/routes/instance/httpapi/websocket-tracker.ts` (+4, -1)
- `packages/opencode/src/server/server.ts` (+2, -1)
- `packages/opencode/src/session/compaction.ts` (+1, -14)
- `packages/opencode/src/session/instruction.ts` (+1, -9)
- `packages/opencode/src/session/llm.ts` (+2, -17)
- `packages/opencode/src/session/processor.ts` (+1, -18)
- `packages/opencode/src/session/prompt.ts` (+1, -35)
- `packages/opencode/src/session/revert.ts` (+1, -12)
- `packages/opencode/src/session/run-state.ts` (+1, -6)
- `packages/opencode/src/session/session.ts` (+1, -14)
- `packages/opencode/src/session/status.ts` (+1, -3)
- `packages/opencode/src/session/summary.ts` (+1, -10)
- `packages/opencode/src/session/system.ts` (+1, -7)
- `packages/opencode/src/session/todo.ts` (+1, -3)
- `packages/opencode/src/share/session.ts` (+1, -8)
- `packages/opencode/src/share/share-next.ts` (+1, -11)
- `packages/opencode/src/skill/discovery.ts` (+1, -7)
- `packages/opencode/src/skill/index.ts` (+1, -10)
- `packages/opencode/src/snapshot/index.ts` (+1, -7)
- `packages/opencode/src/storage/storage.ts` (+1, -3)
- `packages/opencode/src/worktree/index.ts` (+1, -14)
- `packages/opencode/test/account/repo.test.ts` (+4, -2)
- `packages/opencode/test/account/service.test.ts` (+6, -3)
- `packages/opencode/test/acp/directory.test.ts` (+6, -4)
- `packages/opencode/test/acp/event.test.ts` (+2, -1)
- `packages/opencode/test/acp/permission.test.ts` (+2, -1)
- `packages/opencode/test/acp/session.test.ts` (+2, -1)
- `packages/opencode/test/acp/usage.test.ts` (+20, -17)
- `packages/opencode/test/auth/auth.test.ts` (+3, -5)
- `packages/opencode/test/background/job.test.ts` (+2, -1)
- `packages/opencode/test/cli/effect-cmd-instance-als.test.ts` (+2, -1)
- `packages/opencode/test/cli/run/variant.shared.test.ts` (+3, -2)
- `packages/opencode/test/config/agent-color.test.ts` (+3, -3)
- `packages/opencode/test/config/config.test.ts` (+20, -34)
- `packages/opencode/test/config/tui.test.ts` (+9, -3)
- `packages/opencode/test/control-plane/workspace.test.ts` (+20, -22)
- `packages/opencode/test/effect/app-runtime-logger.test.ts` (+5, -3)
- `packages/opencode/test/effect/instance-state.test.ts` (+2, -1)
- `packages/opencode/test/effect/runtime-flags.test.ts` (+2, -1)
- `packages/opencode/test/filesystem/filesystem.test.ts` (+3, -4)
- `packages/opencode/test/fixture/fixture.ts` (+4, -1)
- `packages/opencode/test/fixture/workspace.ts` (+19, -15)
- `packages/opencode/test/format/format.test.ts` (+9, -2)
- `packages/opencode/test/image/image.test.ts` (+7, -9)
- `packages/opencode/test/installation/installation.test.ts` (+13, -2)
- `packages/opencode/test/lsp/index.test.ts` (+7, -8)
- `packages/opencode/test/lsp/lifecycle.test.ts` (+3, -3)
- `packages/opencode/test/mcp/auth.test.ts` (+8, -8)
- `packages/opencode/test/mcp/catalog.test.ts` (+47, -0)
- `packages/opencode/test/mcp/headers.test.ts` (+2, -1)
- `packages/opencode/test/mcp/lifecycle.test.ts` (+2, -1)
- `packages/opencode/test/mcp/oauth-auto-connect.test.ts` (+3, -9)
- `packages/opencode/test/mcp/oauth-browser.test.ts` (+3, -6)
- `packages/opencode/test/patch/patch.test.ts` (+2, -1)
- `packages/opencode/test/permission-task.test.ts` (+2, -1)
- `packages/opencode/test/plugin/auth-override.test.ts` (+26, -30)
- `packages/opencode/test/plugin/loader-shared.test.ts` (+11, -8)
- `packages/opencode/test/plugin/trigger.test.ts` (+12, -24)
- `packages/opencode/test/plugin/workspace-adapter.test.ts` (+12, -41)
- `packages/opencode/test/project/instance-bootstrap.test.ts` (+8, -3)
- `packages/opencode/test/project/instance.test.ts` (+5, -2)
- `packages/opencode/test/project/migrate-global.test.ts` (+3, -2)
- `packages/opencode/test/project/project-directory.test.ts` (+3, -2)
- `packages/opencode/test/project/project.test.ts` (+24, -31)
- `packages/opencode/test/project/vcs.test.ts` (+4, -5)
- `packages/opencode/test/project/worktree-remove.test.ts` (+5, -3)
- `packages/opencode/test/project/worktree.test.ts` (+7, -3)
- `packages/opencode/test/provider/amazon-bedrock.test.ts` (+3, -2)
- `packages/opencode/test/provider/digitalocean.test.ts` (+2, -1)
- `packages/opencode/test/provider/header-timeout.test.ts` (+3, -2)
- `packages/opencode/test/provider/provider.test.ts` (+22, -13)
- `packages/opencode/test/question/question.test.ts` (+4, -10)
- `packages/opencode/test/server/global-session-list.test.ts` (+5, -1)
- `packages/opencode/test/server/httpapi-experimental.test.ts` (+2, -1)
- `packages/opencode/test/server/httpapi-instance-context.test.ts` (+1, -12)
- `packages/opencode/test/server/httpapi-promptasync-context.test.ts` (+1, -12)
- `packages/opencode/test/server/httpapi-provider.test.ts` (+2, -1)
- `packages/opencode/test/server/httpapi-schema-error-body.test.ts` (+2, -1)
- `packages/opencode/test/server/httpapi-sdk.test.ts` (+10, -11)
- `packages/opencode/test/server/httpapi-session.test.ts` (+11, -20)
- `packages/opencode/test/server/httpapi-sync.test.ts` (+2, -1)
- `packages/opencode/test/server/httpapi-ui.test.ts` (+14, -11)
- `packages/opencode/test/server/httpapi-workspace-routing.test.ts` (+1, -4)
- `packages/opencode/test/server/httpapi-workspace.test.ts` (+6, -13)
- `packages/opencode/test/server/negative-tokens-regression.test.ts` (+2, -1)
- `packages/opencode/test/server/project-copy.test.ts` (+9, -3)
- `packages/opencode/test/server/project-init-git.test.ts` (+7, -3)
- `packages/opencode/test/server/session-actions.test.ts` (+2, -1)
- `packages/opencode/test/server/session-diff-missing-patch.test.ts` (+2, -1)
- `packages/opencode/test/server/session-list.test.ts` (+6, -16)
- `packages/opencode/test/server/session-messages.test.ts` (+2, -1)
- `packages/opencode/test/server/session-select.test.ts` (+2, -1)
- `packages/opencode/test/session/compaction.test.ts` (+53, -72)
- `packages/opencode/test/session/instruction.test.ts` (+23, -15)
- `packages/opencode/test/session/llm-native-recorded.test.ts` (+10, -30)
- `packages/opencode/test/session/llm.test.ts` (+24, -29)
- `packages/opencode/test/session/prompt.test.ts` (+73, -79)
- `packages/opencode/test/session/revert-compact.test.ts` (+8, -9)
- `packages/opencode/test/session/session.test.ts` (+20, -15)
- `packages/opencode/test/session/structured-output-integration.test.ts` (+4, -4)
- `packages/opencode/test/session/system.test.ts` (+9, -8)
- `packages/opencode/test/skill/discovery.test.ts` (+3, -2)
- `packages/opencode/test/skill/skill.test.ts` (+5, -18)
- `packages/opencode/test/snapshot/snapshot.test.ts` (+7, -3)
- `packages/opencode/test/storage/storage.test.ts` (+4, -3)
- `packages/session-ui/src/components/line-comment-annotations.tsx` (+4, -1)
- `packages/session-ui/src/components/markdown.css` (+23, -0)
- `packages/session-ui/src/components/tool-status-title.tsx` (+10, -13)
- `packages/tui/src/app.tsx` (+41, -28)
- `packages/tui/src/component/prompt/index.tsx` (+3, -0)
- `packages/tui/src/context/args.tsx` (+1, -0)
- `packages/tui/src/context/local.tsx` (+5, -3)
- `packages/tui/src/context/permission.tsx` (+26, -0)
- `packages/tui/src/context/sync.tsx` (+12, -1)
- `packages/tui/test/cli/cmd/tui/sync-fixture.tsx` (+10, -7)
- `packages/ui/src/components/progress-circle.css` (+6, -2)
- `packages/ui/src/components/progress-circle.tsx` (+8, -1)
- `packages/web/src/content/docs/cli.mdx` (+21, -20)
- `packages/web/src/content/docs/permissions.mdx` (+20, -0)
- `script/github/close-issues.ts` (+19, -0)

### Key Diffs

#### packages/console/core/migrations/20260626161712_oval_callisto/migration.sql
```diff
diff --git a/packages/console/core/migrations/20260626161712_oval_callisto/migration.sql b/packages/console/core/migrations/20260626161712_oval_callisto/migration.sql
new file mode 100644
index 0000000..ebef63c
--- /dev/null
+++ b/packages/console/core/migrations/20260626161712_oval_callisto/migration.sql
@@ -0,0 +1 @@
+ALTER TABLE `workspace` ADD `region` json;
\ No newline at end of file
```

#### packages/console/core/migrations/20260626161712_oval_callisto/snapshot.json
```diff
diff --git a/packages/console/core/migrations/20260626161712_oval_callisto/snapshot.json b/packages/console/core/migrations/20260626161712_oval_callisto/snapshot.json
new file mode 100644
index 0000000..ac6ab73
--- /dev/null
+++ b/packages/console/core/migrations/20260626161712_oval_callisto/snapshot.json
@@ -0,0 +1,3093 @@
+{
+  "version": "6",
+  "dialect": "mysql",
+  "id": "d78d7057-b247-4572-9150-2532149169db",
+  "prevIds": ["a946ea14-a35d-49cc-a10a-8c93c30a3cb1"],
+  "ddl": [
+    {
+      "name": "account",
+      "entityType": "tables"
+    },
+    {
+      "name": "auth",
+      "entityType": "tables"
+    },
+    {
+      "name": "benchmark",
+      "entityType": "tables"
+    },
+    {
+      "name": "billing",
+      "entityType": "tables"
+    },
+    {
+      "name": "coupon",
+      "entityType": "tables"
+    },
+    {
+      "name": "lite",
+      "entityType": "tables"
+    },
+    {
+      "name": "payment",
+      "entityType": "tables"
+    },
+    {
+      "name": "subscription",
+      "entityType": "tables"
+    },
+    {
+      "name": "usage",
+      "entityType": "tables"
+    },
+    {
+      "name": "ip_rate_limit",
```

#### packages/console/core/src/schema/workspace.sql.ts
```diff
diff --git a/packages/console/core/src/schema/workspace.sql.ts b/packages/console/core/src/schema/workspace.sql.ts
index 269b62a..ab729d5 100644
--- a/packages/console/core/src/schema/workspace.sql.ts
+++ b/packages/console/core/src/schema/workspace.sql.ts
@@ -1,4 +1,4 @@
-import { primaryKey, mysqlTable, uniqueIndex, varchar } from "drizzle-orm/mysql-core"
+import { json, primaryKey, mysqlTable, uniqueIndex, varchar } from "drizzle-orm/mysql-core"
 import { timestamps, ulid } from "../drizzle/types"
 
 export const WorkspaceTable = mysqlTable(
@@ -7,6 +7,7 @@ export const WorkspaceTable = mysqlTable(
     id: ulid("id").notNull().primaryKey(),
     slug: varchar("slug", { length: 255 }),
     name: varchar("name", { length: 255 }).notNull(),
+    region: json("region").$type<("us" | "eu" | "sg" | "cn")[]>(),
     ...timestamps,
   },
   (table) => [uniqueIndex("slug").on(table.slug)],
```

#### packages/console/core/src/workspace.ts
```diff
diff --git a/packages/console/core/src/workspace.ts b/packages/console/core/src/workspace.ts
index 8a65de2..e3c2e0d 100644
--- a/packages/console/core/src/workspace.ts
+++ b/packages/console/core/src/workspace.ts
@@ -11,6 +11,9 @@ import { Key } from "./key"
 import { and, eq, isNull, sql } from "drizzle-orm"
 
 export namespace Workspace {
+  export const Region = z.enum(["us", "eu", "sg", "cn"])
+  export type Region = z.infer<typeof Region>
+
   export const create = fn(
     z.object({
       name: z.string().min(1),
@@ -57,22 +60,41 @@ export namespace Workspace {
 
   export const update = fn(
     z.object({
-      name: z.string().min(1).max(255),
+      name: z.string().min(1).max(255).optional(),
+      region: z.array(Region).min(1).optional(),
     }),
-    async ({ name }) => {
+    async (input) => {
       Actor.assertAdmin()
       const workspaceID = Actor.workspace()
       return await Database.use((tx) =>
         tx
           .update(WorkspaceTable)
           .set({
-            name,
+            ...("name" in input ? { name: input.name } : {}),
+            ...("region" in input ? { region: input.region } : {}),
           })
           .where(eq(WorkspaceTable.id, workspaceID)),
       )
     },
   )
 
+  export const setDefaultRegion = fn(
+    z.object({
+      country: z.string().optional(),
+    }),
+    async (input) => {
+      const region: Workspace.Region[] =
+        input.country?.toUpperCase() === "CN" ? ["us", "eu", "sg", "cn"] : ["us", "eu", "sg"]
+      await Database.use((tx) =>
+        tx
+          .update(WorkspaceTable)
+          .set({ region })
```

#### packages/core/src/control-plane/move-session.ts
```diff
diff --git a/packages/core/src/control-plane/move-session.ts b/packages/core/src/control-plane/move-session.ts
index 21397ac..5beae18 100644
--- a/packages/core/src/control-plane/move-session.ts
+++ b/packages/core/src/control-plane/move-session.ts
@@ -1,6 +1,7 @@
 export * as MoveSession from "./move-session"
 
 import { Context, DateTime, Effect, Layer, Schema } from "effect"
+import { makeGlobalNode } from "../effect/app-node"
 import { EventV2 } from "../event"
 import { Git } from "../git"
 import { Location } from "../location"
@@ -146,3 +147,9 @@ export const defaultLayer = layer.pipe(
   Layer.provide(ProjectV2.defaultLayer),
   Layer.provide(SessionStore.defaultLayer),
 )
+
+export const node = makeGlobalNode({
+  service: Service,
+  layer,
+  deps: [Git.node, EventV2.node, ProjectV2.node, SessionStore.node],
+})
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/agent.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/kilocode/agent/index.ts
- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/test/agent/agent.test.ts
- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/src/agent/agent.ts
- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/test/agent/agent.test.ts
- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/test/agent/plan-mode-subagent-bypass.test.ts
- `src/agent/index.ts` - incorporate patterns from opencode packages/opencode/test/agent/plugin-agent-regression.test.ts
- `src/core/` - review core changes from packages/core/package.json
- `src/core/` - review core changes from packages/kilo-docs/pages/code-with-ai/agents/orchestrator-mode.md
- `src/permission/` - review permission changes from packages/opencode/src/kilocode/permission/config-paths.ts
- `src/tool/agent-manager-models.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager-models.ts changes
- `src/tool/agent-manager-models.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager-models.txt changes
- `src/tool/agent-manager.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager.ts changes
- `src/tool/agent-manager.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager.txt changes
- `src/tool/apply-patch.ts` - update based on opencode packages/core/src/tool/apply-patch.ts changes
- `src/tool/apply_patch.test.ts` - update based on opencode packages/opencode/test/tool/apply_patch.test.ts changes
- `src/tool/background-process.ts` - update based on kilocode packages/opencode/src/kilocode/tool/background-process.ts changes
- `src/tool/background-process.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/background-process.txt changes
- `src/tool/bash.ts` - update based on opencode packages/core/src/tool/bash.ts changes
- `src/tool/builtins.ts` - update based on opencode packages/core/src/tool/builtins.ts changes
- `src/tool/edit.test.ts` - update based on opencode packages/opencode/test/tool/edit.test.ts changes
- `src/tool/edit.ts` - update based on opencode packages/core/src/tool/edit.ts changes
- `src/tool/external-directory.test.ts` - update based on opencode packages/opencode/test/tool/external-directory.test.ts changes
- `src/tool/glob.test.ts` - update based on opencode packages/opencode/test/tool/glob.test.ts changes
- `src/tool/glob.ts` - update based on opencode packages/core/src/tool/glob.ts changes
- `src/tool/grep.test.ts` - update based on opencode packages/opencode/test/tool/grep.test.ts changes
- `src/tool/grep.ts` - update based on opencode packages/core/src/tool/grep.ts changes
- `src/tool/interactive-terminal.ts` - update based on kilocode packages/opencode/src/kilocode/tool/interactive-terminal.ts changes
- `src/tool/interactive-terminal.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/interactive-terminal.txt changes
- `src/tool/lsp.test.ts` - update based on opencode packages/opencode/test/tool/lsp.test.ts changes
- `src/tool/model-search.ts` - update based on kilocode packages/opencode/src/kilocode/tool/model-search.ts changes
- `src/tool/question.test.ts` - update based on opencode packages/opencode/test/tool/question.test.ts changes
- `src/tool/question.ts` - update based on opencode packages/core/src/tool/question.ts changes
- `src/tool/read.test.ts` - update based on opencode packages/opencode/test/tool/read.test.ts changes
- `src/tool/read.ts` - update based on opencode packages/core/src/tool/read.ts changes
- `src/tool/registry.test.ts` - update based on kilocode packages/opencode/test/tool/registry.test.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/kilocode/tool/registry.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
- `src/tool/registry.ts` - update based on opencode packages/opencode/src/tool/registry.ts changes
- `src/tool/shell.test.ts` - update based on opencode packages/opencode/test/tool/shell.test.ts changes
- `src/tool/shell.ts` - update based on kilocode packages/opencode/src/tool/shell.ts changes
- `src/tool/skill.test.ts` - update based on kilocode packages/opencode/test/tool/skill.test.ts changes
- `src/tool/skill.test.ts` - update based on opencode packages/opencode/test/tool/skill.test.ts changes
- `src/tool/skill.ts` - update based on opencode packages/core/src/tool/skill.ts changes
- `src/tool/task-background-process.ts` - update based on kilocode packages/opencode/src/kilocode/tool/task-background-process.ts changes
- `src/tool/task.test.ts` - update based on kilocode packages/opencode/test/tool/task.test.ts changes
- `src/tool/task.test.ts` - update based on opencode packages/opencode/test/tool/task.test.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/kilocode/tool/task.ts changes
- `src/tool/task.ts` - update based on kilocode packages/opencode/src/tool/task.ts changes
- `src/tool/todowrite.ts` - update based on opencode packages/core/src/tool/todowrite.ts changes
- `src/tool/tool-define.test.ts` - update based on opencode packages/opencode/test/tool/tool-define.test.ts changes
- `src/tool/truncate.ts` - update based on opencode packages/opencode/src/tool/truncate.ts changes
- `src/tool/truncation.test.ts` - update based on opencode packages/opencode/test/tool/truncation.test.ts changes
- `src/tool/webfetch.test.ts` - update based on opencode packages/opencode/test/tool/webfetch.test.ts changes
- `src/tool/webfetch.ts` - update based on opencode packages/core/src/tool/webfetch.ts changes
- `src/tool/websearch.ts` - update based on opencode packages/core/src/tool/websearch.ts changes
- `src/tool/write.test.ts` - update based on opencode packages/opencode/test/tool/write.test.ts changes
- `src/tool/write.ts` - update based on opencode packages/core/src/tool/write.ts changes
