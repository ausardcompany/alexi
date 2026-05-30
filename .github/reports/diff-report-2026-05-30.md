# Upstream Changes Report
Generated: 2026-05-30 08:29:04

## Summary
- kilocode: 101 commits, 219 files changed
- opencode: 42 commits, 225 files changed

## kilocode Changes (cf9b7ea42..ad908e283)

### Commits

- ad908e283 - Merge pull request #10750 from Kilo-Org/backfill-changelog-7.3.16-7.3.18 (Joshua Lambert, 2026-05-29)
- 065ece788 - Merge pull request #10749 from Kilo-Org/handsomely-wool (Joshua Lambert, 2026-05-29)
- 7dbc71072 - chore: backfill changelogs for v7.3.16 through v7.3.18 (Josh Lambert, 2026-05-29)
- 6c6e10c1f - fix: stop publishing without changelog updates (Josh Lambert, 2026-05-29)
- bad462990 - Merge pull request #10747 from Kilo-Org/slime-grip (Kirill Kalishev, 2026-05-29)
- c23be8a17 - docs(kilo-docs): address tab TOC review (kirillk, 2026-05-29)
- 91bbeca69 - docs(kilo-docs): improve JetBrains install anchors (kirillk, 2026-05-29)
- dc46dca88 - Merge pull request #10745 from Kilo-Org/gilded-flower (Kirill Kalishev, 2026-05-29)
- 96bbac6a7 - docs(jetbrains): rename early access anchor (kirillk, 2026-05-29)
- 2f7996c60 - docs(jetbrains): link v7 early access guide (kirillk, 2026-05-29)
- f366bb524 - Merge pull request #10706 from Kilo-Org/jetbrains/release/v7.0.1-rc.4 (Kirill Kalishev, 2026-05-29)
- 69f8307da - fix(jetbrains): emit log warnings before updating state values (#10743) (Imanol Maiztegui, 2026-05-29)
- 9721cf9f4 - release: v7.3.18 (kilo-maintainer[bot], 2026-05-29)
- e0e150109 - Merge branch 'main' into jetbrains/release/v7.0.1-rc.4 (Kirill Kalishev, 2026-05-29)
- cb5686dd3 - Merge pull request #10730 from Kilo-Org/swamp-ornament (Marius, 2026-05-29)
- 7bbac24c6 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-05-29)
- 57bc6eea5 - fix(cli): route share links through Kilo session API (#10736) (Imanol Maiztegui, 2026-05-29)
- fb6e241b9 - fix(jetbrains): use gradle release metadata (kirillk, 2026-05-29)
- f069c7300 - Merge branch 'main' into swamp-ornament (Marius, 2026-05-29)
- 979cb7e2a - Merge pull request #10740 from Kilo-Org/feature-read-xlsx-extraction (Marius, 2026-05-29)
- dfe396108 - fix(jetbrains): preserve plugin package version (kirillk, 2026-05-29)
- 16d7caa23 - feat(config): add kilo-jetbrains package to upstream merge config (#10742) (Imanol Maiztegui, 2026-05-29)
- 4dd7b20d3 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-05-29)
- 4ee8b4b63 - release(jetbrains): restore unreleased changelog marker (kirillk, 2026-05-29)
- 431baf09e - Merge pull request #10594 from Ipsumlorem/codex/fix-windows-speech-input (Marius, 2026-05-29)
- 277d09d63 - Merge remote-tracking branch 'origin/main' into feature-read-xlsx-extraction (marius-kilocode, 2026-05-29)
- ebe04b991 - Merge pull request #10734 from Kilo-Org/readme-hero-refresh (Rietie, 2026-05-29)
- 1bdc24ceb - Merge pull request #10737 from Kilo-Org/feature-read-docx-extraction (Marius, 2026-05-29)
- f04947b84 - Merge pull request #10691 from Kilo-Org/fix/keywords-remove-dashes (Rietie, 2026-05-29)
- aec4c4f0f - Merge pull request #10727 from Kilo-Org/effect-question-facade-10720 (Marius, 2026-05-29)
- f7830cb7e - fix(cli): bound XLSX read input size (marius-kilocode, 2026-05-29)
- c1d315c98 - refactor(cli): narrow DOCX read routing and surface warnings (marius-kilocode, 2026-05-29)
- 7907754a7 - Merge branch 'main' into jetbrains/release/v7.0.1-rc.4 (Kirill Kalishev, 2026-05-29)
- 2c7eeaa0b - Merge pull request #10739 from Kilo-Org/fix/read-notebook-guard (Marius, 2026-05-29)
- 3a8949a6b - Merge branch 'main' into jetbrains/release/v7.0.1-rc.4 (Kirill Kalishev, 2026-05-29)
- 752807394 - Merge origin/main into effect-question-facade-10720 (marius-kilocode, 2026-05-29)
- 3f6de75f3 - release: v7.3.17 (kilo-maintainer[bot], 2026-05-29)
- 2081af2b3 - feat(cli): support XLSX text extraction in read tool (marius-kilocode, 2026-05-29)
- 6ab07aad6 - fix(vscode): preserve DirectShow microphone display names (marius-kilocode, 2026-05-29)
- 1ed120a15 - Merge remote-tracking branch 'origin/main' into feature-read-docx-extraction (marius-kilocode, 2026-05-29)
- 8465e7707 - refactor(cli): make notebook read routing explicit (marius-kilocode, 2026-05-29)
- ac4536a11 - Merge pull request #10733 from Kilo-Org/feature-read-ipynb-content (Marius, 2026-05-29)
- f5742940c - feat(cli): support DOCX text extraction in read tool (marius-kilocode, 2026-05-29)
- e4c9b4363 - refactor(session): replace promise facade helpers with Effect service calls (#10731) (Imanol Maiztegui, 2026-05-29)
- f743b545b - fix(vscode): restrict diff worker CSP source (marius-kilocode, 2026-05-29)
- cec9f6fc0 - fix(cli): describe notebooks without readable cells (marius-kilocode, 2026-05-29)
- 470e59fd5 - fix(cli): tolerate malformed notebook cells (marius-kilocode, 2026-05-29)
- 65ae6be7c - docs(vscode): refresh marketplace README hero (Job Rietbergen, 2026-05-29)
- 43cd552da - docs: update README IDE link (Job Rietbergen, 2026-05-29)
- 127c2c87c - docs: refresh README hero (Job Rietbergen, 2026-05-29)
- 4967c2286 - feat(cli): read Jupyter notebooks as cell content (marius-kilocode, 2026-05-29)
- fb9bf6423 - Merge branch 'main' into jetbrains/release/v7.0.1-rc.4 (Kirill Kalishev, 2026-05-29)
- 6c6e511e4 - initial release change notes (Kirill Kalishev, 2026-05-29)
- 830de5839 - fix(vscode): register diff worker for knip (marius-kilocode, 2026-05-29)
- ec3d7a3f6 - Merge pull request #10721 from Kilo-Org/valley-hawk (Marius, 2026-05-29)
- 588baec90 - Merge remote-tracking branch 'origin/main' into swamp-ornament (marius-kilocode, 2026-05-29)
- dbb7215cf - docs(vscode): record diff rendering performance invariants (marius-kilocode, 2026-05-29)
- 9df433cc2 - fix(vscode): render review diffs from hunk patches (marius-kilocode, 2026-05-29)
- 0280cfca9 - chore: update nix node_modules hashes (kilo-maintainer[bot], 2026-05-29)
- c4b2bb02d - Merge remote-tracking branch 'origin/main' into valley-hawk (marius-kilocode, 2026-05-29)
- bc2e7942f - Merge pull request #10680 from Kilo-Org/test-vscode-a11y-coverage-10673 (Marius, 2026-05-29)
- 1fd2b9c94 - Merge pull request #10686 from Kilo-Org/fix-a11y-history-10672 (Marius, 2026-05-29)
- 9945eb6fb - Merge pull request #10688 from Kilo-Org/fix-vscode-a11y-model-picker (Marius, 2026-05-29)
- d836e84d5 - Merge origin/main into effect-question-facade-10720 (marius-kilocode, 2026-05-29)
- 1cc2c5b86 - Merge pull request #10726 from Kilo-Org/effect-session-prompt-facade-10723 (Marius, 2026-05-29)
- 6731c1dd5 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-05-29)
- e9bbd4dea - fix(vscode): translate history accessibility labels in Italian (marius-kilocode, 2026-05-29)
- fb5b5ebf1 - Merge remote-tracking branch 'origin/main' into fix-a11y-history-10672 (marius-kilocode, 2026-05-29)
- 4d1439eb0 - Merge pull request #10703 from barzhomi/fix/lancedb-metadata-type-corruption (Marius, 2026-05-29)
- bc1176242 - Merge pull request #10674 from Kilo-Org/session/agent_889409bf-00dd-4caf-a3a0-4b1f84fe03ba (Marius, 2026-05-29)
- a5781d1f1 - Merge branch 'main' into session/agent_889409bf-00dd-4caf-a3a0-4b1f84fe03ba (marius-kilocode, 2026-05-29)
- 41729dcb5 - fix(vscode): localize BYOK gateway footer link (marius-kilocode, 2026-05-29)
- 51ce1b82b - fix(vscode): offload diff highlighting to a worker and render review diffs eagerly (marius-kilocode, 2026-05-29)
- 5980ac027 - test(cli): annotate Question migration coverage (marius-kilocode, 2026-05-29)
- daef31e98 - refactor(cli): remove SessionPrompt promise facade (marius-kilocode, 2026-05-29)
- e4095af8d - refactor(cli): remove Question compatibility facade (marius-kilocode, 2026-05-29)
- 3268badb6 - docs: clarify per-directory AGENTS.md loading behavior (#10707) (Aarav, 2026-05-29)
- 49062e799 - Merge pull request #10609 from Kilo-Org/neat-cyclamen (Marius, 2026-05-29)
- c18cd6fa4 - Merge pull request #10668 from Kilo-Org/melodious-forest (Marius, 2026-05-29)
- 335dd925f - Merge pull request #10669 from Kilo-Org/peppered-behavior (Marius, 2026-05-29)
- f46a74a38 - Merge remote-tracking branch 'origin/main' into valley-hawk (marius-kilocode, 2026-05-29)
- 2efa216ee - fix(agent-manager): keep slow snapshot initialization non-blocking (marius-kilocode, 2026-05-29)
- d62163ba9 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-05-29)
- 96d2d3add - fix(vscode): preserve model preview interactions (marius-kilocode, 2026-05-29)
- e74814064 - fix(vscode): restore focus after canceling history deletion (marius-kilocode, 2026-05-29)
- b28d5905d - Update CHANGELOG.md (Kirill Kalishev, 2026-05-28)
- c54a5b370 - release(jetbrains): v7.0.1-rc.4 (kilo-maintainer[bot], 2026-05-29)
- eeff6d9df - fix(indexing): address review — remove redundant String() casts, add changeset (Bazhen Rzheutskii, 2026-05-29)
- 13cbb3597 - fix(indexing): prevent LanceDB metadata type coercion causing full re-index on restart (Bazhen Rzheutskii, 2026-05-29)
- 5d7820219 - fix(vscode): replace dashes with spaces in marketplace keywords (kiloconnect[bot], 2026-05-28)
- 38fcaa65e - fix(vscode): make model selection accessible to screen readers (marius-kilocode, 2026-05-28)
- d3c5f2886 - fix(vscode): make session history accessible to screen readers (marius-kilocode, 2026-05-28)
- ffad65db8 - fix(vscode): address accessibility coverage feedback (marius-kilocode, 2026-05-28)
- 63f39f6ae - test(vscode): enforce scoped webview accessibility coverage (marius-kilocode, 2026-05-28)
- aaef29b28 - Merge branch 'main' into session/agent_889409bf-00dd-4caf-a3a0-4b1f84fe03ba (Darko Gjorgjievski, 2026-05-28)
- cc5755d94 - feat(vscode): add BYOK Gateway link in provider connect dialog footer (kiloconnect[bot], 2026-05-28)
- 965383369 - test(cli): wait for disabled indexing startup status (marius-kilocode, 2026-05-28)
- 0107a0163 - feat(cli): guide Agent Manager recall usage (marius-kilocode, 2026-05-28)
- ef2390d7a - feat: remove semantic indexing experimental gate (marius-kilocode, 2026-05-28)
- 4e6f366a7 - fix(vscode): add context handoff for forked sessions (marius-kilocode, 2026-05-27)
- 56d2ac40d - fix(vscode): detect Windows speech input devices (Roland, 2026-05-27)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/kilocode/tool/agent-manager.txt` (+2, -0)
- `packages/opencode/src/kilocode/tool/notebook.ts` (+48, -0)
- `packages/opencode/src/kilocode/tool/read-docx.ts` (+17, -0)
- `packages/opencode/src/kilocode/tool/read-extract.ts` (+15, -0)
- `packages/opencode/src/kilocode/tool/xlsx.ts` (+78, -0)
- `packages/opencode/src/tool/read.ts` (+6, -1)
- `packages/opencode/src/tool/recall.ts` (+13, -6)
- `packages/opencode/test/tool/recall.test.ts` (+9, -8)

#### Agent System (packages/*/src/agent/)
(no changes)

#### Permission System (**/permission/)
- `packages/opencode/src/kilocode/permission/allow-everything.ts` (+13, -16)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
- `packages/core/package.json` (+1, -1)

#### Other Changes
- `.changeset/italian-language-support.md` (+0, -8)
- `.changeset/jetbrains-smooth-scroll-button.md` (+0, -5)
- `.changeset/jetbrains-static-svg-icons.md` (+0, -5)
- `.changeset/vscode-italian-language.md` (+0, -5)
- `.github/workflows/publish-jetbrains.yml` (+10, -6)
- `.github/workflows/visual-regression.yml` (+2, -1)
- `README.md` (+25, -2)
- `bun.lock` (+55, -30)
- `nix/hashes.json` (+4, -4)
- `package.json` (+3, -2)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/kilo-docs/components/TableOfContents.tsx` (+51, -8)
- `packages/kilo-docs/components/Tabs.tsx` (+35, -4)
- `packages/kilo-docs/markdoc/partials/install-jetbrains.md` (+6, -3)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/_app.tsx` (+19, -4)
- `packages/kilo-docs/pages/customize/agents-md.md` (+9, -5)
- `packages/kilo-docs/pages/customize/context/codebase-indexing.md` (+7, -39)
- `packages/kilo-docs/pages/customize/custom-instructions.md` (+2, -2)
- `packages/kilo-docs/pages/getting-started/installing.md` (+43, -43)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/history-sessionlist/sources-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/settings/models-accessible-labels-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/shared/model-selector-accessible-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/public/img/screenshot-tests/kilo-vscode/visual-regression/shared/model-selector-selected-favorite-chromium-linux.png` (+3, -0)
- `packages/kilo-docs/source-links.md` (+2, -0)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-i18n/src/ar.ts` (+3, -0)
- `packages/kilo-i18n/src/br.ts` (+3, -0)
- `packages/kilo-i18n/src/bs.ts` (+3, -0)
- `packages/kilo-i18n/src/da.ts` (+3, -0)
- `packages/kilo-i18n/src/de.ts` (+3, -0)
- `packages/kilo-i18n/src/en.ts` (+3, -0)
- `packages/kilo-i18n/src/es.ts` (+3, -0)
- `packages/kilo-i18n/src/fr.ts` (+3, -0)
- `packages/kilo-i18n/src/it.ts` (+4, -2)
- `packages/kilo-i18n/src/ja.ts` (+3, -0)
- `packages/kilo-i18n/src/ko.ts` (+3, -0)
- `packages/kilo-i18n/src/nl.ts` (+3, -0)
- `packages/kilo-i18n/src/no.ts` (+3, -0)
- `packages/kilo-i18n/src/pl.ts` (+3, -0)
- `packages/kilo-i18n/src/ru.ts` (+3, -0)
- `packages/kilo-i18n/src/th.ts` (+3, -0)
- `packages/kilo-i18n/src/tr.ts` (+3, -0)
- `packages/kilo-i18n/src/uk.ts` (+3, -0)
- `packages/kilo-i18n/src/zh.ts` (+3, -0)
- `packages/kilo-i18n/src/zht.ts` (+3, -0)
- `packages/kilo-indexing/package.json` (+1, -1)
- `packages/kilo-indexing/src/indexing/vector-store/lancedb-vector-store.ts` (+9, -7)
- `packages/kilo-jetbrains/CHANGELOG.md` (+7, -2)
- `packages/kilo-jetbrains/README.md` (+2, -0)
- `packages/kilo-jetbrains/RELEASING.md` (+4, -4)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/app/KiloBackendAppService.kt` (+2, -2)
- `packages/kilo-jetbrains/backend/src/main/kotlin/ai/kilocode/backend/workspace/KiloBackendWorkspace.kt` (+1, -1)
- `packages/kilo-jetbrains/build.gradle.kts` (+5, -4)
- `packages/kilo-jetbrains/gradle.properties` (+1, -0)
- `packages/kilo-jetbrains/package.json` (+1, -1)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/diff-ssr.tsx` (+10, -4)
- `packages/kilo-ui/src/components/diff.tsx` (+39, -5)
- `packages/kilo-ui/src/pierre/index.ts` (+8, -0)
- `packages/kilo-vscode/.storybook/main.ts` (+1, -1)
- `packages/kilo-vscode/.storybook/preview.tsx` (+1, -0)
- `packages/kilo-vscode/AGENTS.md` (+7, -0)
- `packages/kilo-vscode/CHANGELOG.md` (+42, -0)
- `packages/kilo-vscode/README.md` (+24, -12)
- `packages/kilo-vscode/esbuild.js` (+57, -33)
- `packages/kilo-vscode/knip.json` (+1, -0)
- `packages/kilo-vscode/package.json` (+9, -6)
- `packages/kilo-vscode/script/launch.ts` (+10, -4)
- `packages/kilo-vscode/src/DiffVirtualProvider.ts` (+1, -0)
- `packages/kilo-vscode/src/KiloProvider.ts` (+3, -0)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+1, -0)
- `packages/kilo-vscode/src/agent-manager/constants.ts` (+3, -0)
- `packages/kilo-vscode/src/agent-manager/continue-in-worktree.ts` (+4, -0)
- `packages/kilo-vscode/src/agent-manager/fork-handoff.ts` (+41, -0)
- `packages/kilo-vscode/src/agent-manager/fork-session.ts` (+8, -2)
- `packages/kilo-vscode/src/agent-manager/tool-start.ts` (+2, -1)
- `packages/kilo-vscode/src/agent-manager/vscode-host.ts` (+3, -1)
- `packages/kilo-vscode/src/diff/DiffViewerProvider.ts` (+1, -0)
- `packages/kilo-vscode/src/diff/sources/session.ts` (+1, -0)
- `packages/kilo-vscode/src/diff/sources/staged.ts` (+6, -0)
- `packages/kilo-vscode/src/diff/sources/unstaged.ts` (+5, -0)
- `packages/kilo-vscode/src/diff/sources/worktree.ts` (+4, -3)
- `packages/kilo-vscode/src/diff/types.ts` (+2, -0)
- `packages/kilo-vscode/src/features.ts` (+1, -2)
- `packages/kilo-vscode/src/kilo-provider/fork-session.ts` (+1, -0)
- `packages/kilo-vscode/src/kilo-provider/options.ts` (+1, -0)
- `packages/kilo-vscode/src/kiloclaw/KiloClawProvider.ts` (+1, -0)
- `packages/kilo-vscode/src/speech-to-text/capture.ts` (+23, -1)
- `packages/kilo-vscode/src/utils.ts` (+2, -1)
- `packages/kilo-vscode/src/webview-html-utils.ts` (+2, -0)
- `packages/kilo-vscode/tests/accessibility.spec.ts` (+64, -0)
- `packages/kilo-vscode/tests/history-accessibility.spec.ts` (+102, -0)
- `packages/kilo-vscode/tests/model-selector-accessibility.spec.ts` (+151, -0)
- `packages/kilo-vscode/tests/package.json` (+1, -1)
- `packages/kilo-vscode/tests/unit/agent-manager-diff-state.test.ts` (+59, -3)
- `packages/kilo-vscode/tests/unit/agent-manager-tool-start.test.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/continue-in-worktree.test.ts` (+14, -3)
- `packages/kilo-vscode/tests/unit/diff-session-source.test.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/fork-handoff.test.ts` (+42, -0)
- `packages/kilo-vscode/tests/unit/fork-session.test.ts` (+87, -0)
- `packages/kilo-vscode/tests/unit/indexing-utils.test.ts` (+11, -29)
- `packages/kilo-vscode/tests/unit/speech-to-text-capture.test.ts` (+21, -0)
- `packages/kilo-vscode/tests/unit/webview-html.test.ts` (+6, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/DiffPanel.tsx` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/FullScreenDiffView.tsx` (+4, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/diff-open-policy.ts` (+21, -0)
- `packages/kilo-vscode/webview-ui/agent-manager/diff-state.ts` (+14, -2)
- `packages/kilo-vscode/webview-ui/pierre-worker.ts` (+67, -0)
- `packages/kilo-vscode/webview-ui/src/components/history/CloudSessionList.tsx` (+16, -0)
- `packages/kilo-vscode/webview-ui/src/components/history/HistoryView.tsx` (+58, -10)
- `packages/kilo-vscode/webview-ui/src/components/history/SessionList.tsx` (+90, -58)
- `packages/kilo-vscode/webview-ui/src/components/settings/ExperimentalTab.tsx` (+0, -13)
- `packages/kilo-vscode/webview-ui/src/components/settings/ModeEditView.tsx` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/ModelsTab.tsx` (+10, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/ProviderConnectDialog.tsx` (+15, -1)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelSelector.tsx` (+324, -235)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+2, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+2, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+2, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+2, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+2, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+2, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+2, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+2, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/it.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+2, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+2, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/nl.ts` (+2, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+2, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+2, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+2, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+2, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/tr.ts` (+2, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/uk.ts` (+2, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+2, -3)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+2, -3)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/stories/history.stories.tsx` (+22, -1)
- `packages/kilo-vscode/webview-ui/src/stories/settings.stories.tsx` (+11, -9)
- `packages/kilo-vscode/webview-ui/src/stories/shared.stories.tsx` (+60, -1)
- `packages/kilo-vscode/webview-ui/src/styles/dialogs.css` (+17, -0)
- `packages/kilo-vscode/webview-ui/src/styles/history.css` (+28, -5)
- `packages/kilo-vscode/webview-ui/src/styles/model-selector.css` (+27, -8)
- `packages/kilo-vscode/webview-ui/src/types/messages/agent-manager.ts` (+2, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages/config.ts` (+0, -1)
- `packages/opencode/CHANGELOG.md` (+26, -0)
- `packages/opencode/package.json` (+3, -1)
- `packages/opencode/src/config/config.ts` (+1, -4)
- `packages/opencode/src/kilo-sessions/kilo-sessions.ts` (+37, -19)
- `packages/opencode/src/kilo-sessions/remote-sender.ts` (+39, -6)
- `packages/opencode/src/kilocode/config/config.ts` (+8, -0)
- `packages/opencode/src/kilocode/indexing-feature.ts` (+1, -2)
- `packages/opencode/src/kilocode/indexing.ts` (+0, -9)
- `packages/opencode/src/kilocode/plan-followup.ts` (+46, -29)
- `packages/opencode/src/kilocode/session/fork.ts` (+39, -36)
- `packages/opencode/src/kilocode/session/index.ts` (+21, -12)
- `packages/opencode/src/kilocode/snapshot/track.ts` (+22, -1)
- `packages/opencode/src/question/index.ts` (+8, -14)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/question.ts` (+12, -6)
- `packages/opencode/src/server/routes/instance/question.ts` (+23, -5)
- `packages/opencode/src/session/processor.ts` (+11, -4)
- `packages/opencode/src/session/prompt.ts` (+23, -13)
- `packages/opencode/src/session/session.ts` (+2, -67)
- `packages/opencode/src/share/session.ts` (+3, -5)
- `packages/opencode/src/snapshot/index.ts` (+8, -4)
- `packages/opencode/test/kilocode/config/config.test.ts` (+16, -3)
- `packages/opencode/test/kilocode/indexing-feature.test.ts` (+2, -6)
- `packages/opencode/test/kilocode/indexing-startup.test.ts` (+6, -25)
- `packages/opencode/test/kilocode/indexing-worktree.test.ts` (+0, -3)
- `packages/opencode/test/kilocode/kilo-sessions.test.ts` (+5, -1)
- `packages/opencode/test/kilocode/plan-exit-detection.test.ts` (+55, -42)
- `packages/opencode/test/kilocode/plan-followup.test.ts` (+40, -20)
- `packages/opencode/test/kilocode/prompt-dismiss-contract.test.ts` (+2, -2)
- `packages/opencode/test/kilocode/question-dismiss-all.test.ts` (+95, -150)
- `packages/opencode/test/kilocode/read-docx.test.ts` (+199, -0)
- `packages/opencode/test/kilocode/read-notebook.test.ts` (+196, -0)
- `packages/opencode/test/kilocode/read-xlsx.test.ts` (+240, -0)
- `packages/opencode/test/kilocode/server/permission-allow-everything.test.ts` (+9, -8)
- `packages/opencode/test/kilocode/session-compaction-cap.test.ts` (+1, -0)
- `packages/opencode/test/kilocode/session-fork-remap.test.ts` (+38, -24)
- `packages/opencode/test/kilocode/session-list.test.ts` (+7, -3)
- `packages/opencode/test/kilocode/session-prompt-compaction-safety.test.ts` (+1, -0)
- `packages/opencode/test/kilocode/session-prompt-queue.test.ts` (+187, -273)
- `packages/opencode/test/kilocode/session-share.test.ts` (+63, -0)
- `packages/opencode/test/kilocode/sessions/remote-sender.test.ts` (+137, -39)
- `packages/opencode/test/kilocode/snapshot-freeze-repro.test.ts` (+6, -3)
- `packages/opencode/test/kilocode/snapshot-track-timeout.test.ts` (+23, -0)
- `packages/opencode/test/question/question.test.ts` (+44, -22)
- `packages/opencode/test/server/experimental-session-list.test.ts` (+11, -8)
- `packages/opencode/test/session/prompt.test.ts` (+46, -0)
- `packages/opencode/test/session/snapshot-tool-race.test.ts` (+1, -0)
- `packages/plugin/package.json` (+1, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+6, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+3, -1)
- `packages/sdk/openapi.json` (+12, -3)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `patches/mammoth@1.12.0.patch` (+33, -0)
- `script/check-opencode-promise-facades.ts` (+3, -5)
- `script/jetbrains-release-pr.ts` (+11, -8)
- `script/jetbrains-release-validate.ts` (+10, -2)
- `script/publish.ts` (+1, -4)
- `script/upstream/package.json` (+1, -1)
- `script/upstream/utils/config.ts` (+1, -0)

### Key Diffs

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 926ff2bd8..3875f8a16 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "7.3.16",
+  "version": "7.3.18",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/opencode/src/kilocode/permission/allow-everything.ts
```diff
diff --git a/packages/opencode/src/kilocode/permission/allow-everything.ts b/packages/opencode/src/kilocode/permission/allow-everything.ts
index 81f4efbda..940d077b9 100644
--- a/packages/opencode/src/kilocode/permission/allow-everything.ts
+++ b/packages/opencode/src/kilocode/permission/allow-everything.ts
@@ -13,6 +13,7 @@ export namespace AllowEverythingPermission {
   export function effect(input: Input) {
     return Effect.gen(function* () {
       const svc = yield* Permission.Service
+      const sessions = yield* Session.Service
       const cfg = yield* Config.Service
       const bus = yield* Bus.Service
       const rules: Permission.Ruleset = [{ permission: "*", pattern: "*", action: "allow" }]
@@ -20,15 +21,13 @@ export namespace AllowEverythingPermission {
       if (!input.enable) {
         if (input.sessionID) {
           const id = SessionID.make(input.sessionID)
-          const session = yield* Effect.promise(() => Session.get(id))
-          yield* Effect.promise(() =>
-            Session.setPermission({
-              sessionID: id,
-              permission: (session.permission ?? []).filter(
-                (rule) => !(rule.permission === "*" && rule.pattern === "*" && rule.action === "allow"),
-              ),
-            }),
-          )
+          const session = yield* sessions.get(id).pipe(Effect.orDie)
+          yield* sessions.setPermission({
+            sessionID: id,
+            permission: (session.permission ?? []).filter(
+              (rule) => !(rule.permission === "*" && rule.pattern === "*" && rule.action === "allow"),
+            ),
+          })
           yield* svc.allowEverything({ enable: false, sessionID: id })
           return true
         }
@@ -41,13 +40,11 @@ export namespace AllowEverythingPermission {
 
       if (input.sessionID) {
         const id = SessionID.make(input.sessionID)
-        const session = yield* Effect.promise(() => Session.get(id))
-        yield* Effect.promise(() =>
-          Session.setPermission({
-            sessionID: id,
-            permission: [...(session.permission ?? []), ...rules],
-          }),
-        )
+        const session = yield* sessions.get(id).pipe(Effect.orDie)
+        yield* sessions.setPermission({
+          sessionID: id,
+          permission: [...(session.permission ?? []), ...rules],
```

#### packages/opencode/src/kilocode/tool/agent-manager.txt
```diff
diff --git a/packages/opencode/src/kilocode/tool/agent-manager.txt b/packages/opencode/src/kilocode/tool/agent-manager.txt
index d1a85145a..3c3c59bb4 100644
--- a/packages/opencode/src/kilocode/tool/agent-manager.txt
+++ b/packages/opencode/src/kilocode/tool/agent-manager.txt
@@ -10,4 +10,6 @@ Each task may provide a prompt, a short display name, and a branch name. Keep di
 
 By default, multiple tasks are started as independent Agent Manager sessions. Set `versions` to true only when all tasks are alternate versions of the same work that should be compared together. Versioned worktrees are grouped in Agent Manager and branch names may receive version suffixes.
 
+If available, use `kilo_local_recall` only if you need context from a completed Agent Manager session.
+
 Do not use this for ordinary subagent research. Use the `task` tool for internal subagents, and use this only when the user wants visible Agent Manager sessions in the extension.
```

#### packages/opencode/src/kilocode/tool/notebook.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/notebook.ts b/packages/opencode/src/kilocode/tool/notebook.ts
new file mode 100644
index 000000000..e2e1f72c7
--- /dev/null
+++ b/packages/opencode/src/kilocode/tool/notebook.ts
@@ -0,0 +1,48 @@
+import * as path from "path"
+import { Readable } from "stream"
+import * as Encoding from "../encoding"
+
+type ObjectValue = Record<string, unknown>
+
+const object = (value: unknown): value is ObjectValue => typeof value === "object" && value !== null && !Array.isArray(value)
+
+const parse = (text: string): unknown => {
+  try {
+    return JSON.parse(text)
+  } catch {
+    return undefined
+  }
+}
+
+const source = (value: unknown): string | undefined => {
+  if (typeof value === "string") return value
+  if (!Array.isArray(value) || !value.every((line) => typeof line === "string")) return undefined
+  return value.join("")
+}
+
+const render = (kind: "markdown" | "code", text: string) => {
+  const body = text.endsWith("\n") ? text : `${text}\n`
+  return `<${kind}_cell>\n${body}</${kind}_cell>`
+}
+
+export function isFile(filepath: string) {
+  return path.extname(filepath).toLowerCase() === ".ipynb"
+}
+
+export async function open(filepath: string): Promise<Readable> {
+  const raw = (await Encoding.read(filepath)).text
+  const data = parse(raw)
+  if (!object(data) || !Array.isArray(data.cells)) return Readable.from([raw])
+
+  const cells: string[] = []
+  for (const cell of data.cells) {
+    if (!object(cell)) continue
+    if (cell.cell_type !== "markdown" && cell.cell_type !== "code") continue
+
+    const text = source(cell.source)
+    if (text === undefined) continue
+    cells.push(render(cell.cell_type, text))
```

#### packages/opencode/src/kilocode/tool/read-docx.ts
```diff
diff --git a/packages/opencode/src/kilocode/tool/read-docx.ts b/packages/opencode/src/kilocode/tool/read-docx.ts
new file mode 100644
index 000000000..47f3af3da
--- /dev/null
+++ b/packages/opencode/src/kilocode/tool/read-docx.ts
@@ -0,0 +1,17 @@
+import mammoth from "mammoth"
+import * as path from "path"
+import { Readable } from "stream"
+
+export function accepts(filepath: string) {
+  return path.extname(filepath).toLowerCase() === ".docx"
+}
+
+export async function open(filepath: string) {
+  const result = await mammoth.extractRawText({ path: filepath }).catch((err: unknown) => {
+    const message = err instanceof Error ? err.message : String(err)
+    throw new Error(`Failed to extract text from DOCX file: ${filepath}\n${message}`, { cause: err })
+  })
+  const warnings = result.messages.filter((item) => item.type === "warning").map((item) => item.message)
+  const note = warnings.length > 0 ? `\n\n(DOCX extraction warnings: ${warnings.join("; ")})` : ""
+  return Readable.from([result.value + note])
+}
```


*... and more files (showing first 5)*

## opencode Changes (710ed7c..04c4611)

### Commits

- 04c4611 - chore: generate (opencode-agent[bot], 2026-05-30)
- 51a9b0b - zen: log ip prefix (Frank, 2026-05-30)
- bcc345f - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-30)
- 0d2508f - chore: generate (opencode-agent[bot], 2026-05-30)
- f6062bd - feat(core): add default agent plugin (Dax Raad, 2026-05-30)
- 181e58f - feat(cli): add effect cli scaffold (Dax Raad, 2026-05-30)
- 1ceb5db - chore: update nix node_modules hashes (opencode-agent[bot], 2026-05-30)
- e4d3b81 - chore: generate (opencode-agent[bot], 2026-05-30)
- 9583e08 - feat(core): add location-scoped config loading (#29625) (Dax, 2026-05-30)
- 5fb85a6 - fix(tui): align wrapped inline tool rows (#28664) (Kit Langton, 2026-05-29)
- b2a0635 - chore: generate (opencode-agent[bot], 2026-05-29)
- 9d5f3c1 - fix(workspaces): surface real error messages on failed workspace operations (#29167) (James Murdza, 2026-05-29)
- 7342e94 - fix(stats): scroll dense mobile charts (Adam, 2026-05-29)
- 8fe6cd9 - chore: generate (opencode-agent[bot], 2026-05-29)
- 4cc166a - feat(acp): promote next implementation (#29929) (Shoubhit Dash, 2026-05-30)
- 0733c08 - ignore: bug report template (Aiden Cline, 2026-05-29)
- 73c7bef - chore: generate (opencode-agent[bot], 2026-05-29)
- 9854c5d - fix(stats): stabilize stacked chart bands (Adam, 2026-05-29)
- 494b55a - chore: generate (opencode-agent[bot], 2026-05-29)
- aa22cf8 - fix(stats): reorder market share section (Adam, 2026-05-29)
- c977cb7 - Combine top models and leaderboard sections (Adam, 2026-05-29)
- a4bc76d - chore: remove improve codebase architecture skill (#29926) (James Long, 2026-05-29)
- 39cd148 - chore: generate (opencode-agent[bot], 2026-05-29)
- 6b0e549 - fix(stats): tighten 2m chart gaps (Adam, 2026-05-29)
- a87b27a - chore: generate (opencode-agent[bot], 2026-05-29)
- ce4e0e8 - fix(stats): rotate dense chart labels (Adam, 2026-05-29)
- b956e9a - fix(opencode): support vertex opus adaptive reasoning (#29911) (Aiden Cline, 2026-05-29)
- 16cae9a - fix(stats): stack largest segments at bottom (Adam, 2026-05-29)
- 0a60dbd - fix(stats): stabilize newsletter form reset (Adam, 2026-05-29)
- bccebb8 - fix(stats): refine newsletter modal (Adam, 2026-05-29)
- 76dbe10 - feat(stats): match theme icons to figma (#29893) (Adam, 2026-05-29)
- 46836be - fix(stats): add social unfurl metadata (#29892) (Adam, 2026-05-29)
- e84988b - fix(stats): ignore partial may 27 athena data (#29891) (Adam, 2026-05-29)
- 3f6cb63 - fix: referral edge case (vimtor, 2026-05-29)
- e9966b6 - feat(stats): improve mobile leaderboard layout (Adam, 2026-05-29)
- dc28b82 - Add live GitHub star count to stats page (Adam, 2026-05-29)
- fb6275e - fix(stats): improve mobile charts (Adam, 2026-05-29)
- 6102fb2 - docs: update Go availability and Zen pricing (#29890) (Jack, 2026-05-29)
- 7da2620 - fix(tui): pin dialog select footer to bottom (#29878) (Shoubhit Dash, 2026-05-29)
- 5764f19 - core: credit users for missed referral rewards (vimtor, 2026-05-29)
- 4119818 - chore: generate (opencode-agent[bot], 2026-05-29)
- 8f8b161 - feat(tui): add session switcher plugin (#29861) (Shoubhit Dash, 2026-05-29)

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
- `packages/console/core/package.json` (+1, -0)
- `packages/console/core/script/referral-backfill.ts` (+153, -0)
- `packages/console/core/src/referral.ts` (+23, -16)
- `packages/core/package.json` (+1, -0)
- `packages/core/src/agent.ts` (+76, -116)
- `packages/core/src/catalog.ts` (+95, -132)
- `packages/core/src/config.ts` (+203, -0)
- `packages/core/src/config/agent.ts` (+25, -0)
- `packages/core/src/config/attachments.ts` (+15, -0)
- `packages/core/src/config/compaction.ts` (+16, -0)
- `packages/core/src/config/experimental.ts` (+18, -0)
- `packages/core/src/config/formatter.ts` (+12, -0)
- `packages/core/src/config/lsp.ts` (+18, -0)
- `packages/core/src/config/mcp.ts` (+36, -0)
- `packages/core/src/config/plugin.ts` (+13, -0)
- `packages/core/src/config/plugin/agent.ts` (+65, -0)
- `packages/core/src/config/plugin/provider.ts` (+95, -0)
- `packages/core/src/config/provider.ts` (+62, -0)
- `packages/core/src/config/reference.ts` (+17, -0)
- `packages/core/src/config/tool-output.ts` (+9, -0)
- `packages/core/src/config/watcher.ts` (+7, -0)
- `packages/core/src/event.ts` (+1, -1)
- `packages/core/src/flag/flag.ts` (+1, -0)
- `packages/core/src/location-layer.ts` (+10, -5)
- `packages/core/src/location.ts` (+32, -3)
- `packages/core/src/model.ts` (+1, -1)
- `packages/core/src/plugin.ts` (+15, -31)
- `packages/core/src/plugin/account.ts` (+1, -1)
- `packages/core/src/plugin/agent.ts` (+220, -0)
- `packages/core/src/plugin/boot.ts` (+24, -4)
- `packages/core/src/plugin/env.ts` (+1, -1)
- `packages/core/src/plugin/models-dev.ts` (+2, -2)
- `packages/core/src/plugin/provider/amazon-bedrock.ts` (+1, -1)
- `packages/core/src/plugin/provider/anthropic.ts` (+1, -1)
- `packages/core/src/plugin/provider/azure.ts` (+2, -2)
- `packages/core/src/plugin/provider/cerebras.ts` (+1, -1)
- `packages/core/src/plugin/provider/cloudflare-workers-ai.ts` (+1, -1)
- `packages/core/src/plugin/provider/github-copilot.ts` (+1, -1)
- `packages/core/src/plugin/provider/google-vertex.ts` (+2, -2)
- `packages/core/src/plugin/provider/kilo.ts` (+1, -1)
- `packages/core/src/plugin/provider/llmgateway.ts` (+1, -1)
- `packages/core/src/plugin/provider/nvidia.ts` (+1, -1)
- `packages/core/src/plugin/provider/openai.ts` (+1, -1)
- `packages/core/src/plugin/provider/opencode.ts` (+1, -1)
- `packages/core/src/plugin/provider/openrouter.ts` (+1, -1)
- `packages/core/src/plugin/provider/vercel.ts` (+1, -1)
- `packages/core/src/plugin/provider/zenmux.ts` (+1, -1)
- `packages/core/src/policy.ts` (+44, -0)
- `packages/core/src/project.ts` (+1, -2)
- `packages/core/src/state.ts` (+63, -0)
- `packages/core/test/account.test.ts` (+9, -6)
- `packages/core/test/agent.test.ts` (+101, -0)
- `packages/core/test/catalog.test.ts` (+75, -18)
- `packages/core/test/config/agent.test.ts` (+186, -0)
- `packages/core/test/config/config.test.ts` (+460, -0)
- `packages/core/test/config/provider.test.ts` (+131, -0)
- `packages/core/test/event.test.ts` (+4, -2)
- `packages/core/test/fixture/location.ts` (+12, -0)
- `packages/core/test/location.test.ts` (+38, -0)
- `packages/core/test/model.test.ts` (+23, -0)
- `packages/core/test/plugin/provider-amazon-bedrock.test.ts` (+2, -2)
- `packages/core/test/plugin/provider-anthropic.test.ts` (+4, -4)
- `packages/core/test/plugin/provider-azure-cognitive-services.test.ts` (+4, -4)
- `packages/core/test/plugin/provider-azure.test.ts` (+17, -11)
- `packages/core/test/plugin/provider-cerebras.test.ts` (+4, -4)
- `packages/core/test/plugin/provider-cloudflare-workers-ai.test.ts` (+15, -9)
- `packages/core/test/plugin/provider-github-copilot.test.ts` (+4, -4)
- `packages/core/test/plugin/provider-gitlab.test.ts` (+15, -10)
- `packages/core/test/plugin/provider-google-vertex-anthropic.test.ts` (+4, -4)
- `packages/core/test/plugin/provider-google-vertex.test.ts` (+10, -10)
- `packages/core/test/plugin/provider-helper.ts` (+9, -3)
- `packages/core/test/plugin/provider-kilo.test.ts` (+6, -6)
- `packages/core/test/plugin/provider-llmgateway.test.ts` (+4, -4)
- `packages/core/test/plugin/provider-nvidia.test.ts` (+6, -6)
- `packages/core/test/plugin/provider-openai.test.ts` (+4, -4)
- `packages/core/test/plugin/provider-opencode.test.ts` (+28, -20)
- `packages/core/test/plugin/provider-openrouter.test.ts` (+6, -6)
- `packages/core/test/plugin/provider-vercel.test.ts` (+6, -6)
- `packages/core/test/plugin/provider-zenmux.test.ts` (+8, -8)
- `packages/core/test/policy.test.ts` (+83, -0)
- `packages/core/test/project.test.ts` (+1, -1)
- `packages/stats/core/src/domain/home.ts` (+4, -9)
- `packages/stats/core/src/stat-sync.ts` (+3, -1)

#### Other Changes
- `.github/ISSUE_TEMPLATE/bug-report.yml` (+1, -1)
- `.opencode/skills/improve-codebase-architecture/DEEPENING.md` (+0, -37)
- `.opencode/skills/improve-codebase-architecture/INTERFACE-DESIGN.md` (+0, -44)
- `.opencode/skills/improve-codebase-architecture/LANGUAGE.md` (+0, -53)
- `.opencode/skills/improve-codebase-architecture/SKILL.md` (+0, -71)
- `bun.lock` (+22, -3)
- `nix/hashes.json` (+4, -4)
- `packages/cli/package.json` (+24, -0)
- `packages/cli/src/index.ts` (+12, -0)
- `packages/cli/tsconfig.json` (+7, -0)
- `packages/console/app/src/i18n/ar.ts` (+4, -4)
- `packages/console/app/src/i18n/br.ts` (+4, -4)
- `packages/console/app/src/i18n/da.ts` (+4, -4)
- `packages/console/app/src/i18n/de.ts` (+4, -4)
- `packages/console/app/src/i18n/en.ts` (+4, -4)
- `packages/console/app/src/i18n/es.ts` (+4, -4)
- `packages/console/app/src/i18n/fr.ts` (+4, -4)
- `packages/console/app/src/i18n/it.ts` (+4, -4)
- `packages/console/app/src/i18n/ja.ts` (+4, -4)
- `packages/console/app/src/i18n/ko.ts` (+4, -4)
- `packages/console/app/src/i18n/no.ts` (+4, -4)
- `packages/console/app/src/i18n/pl.ts` (+4, -4)
- `packages/console/app/src/i18n/ru.ts` (+4, -4)
- `packages/console/app/src/i18n/th.ts` (+4, -4)
- `packages/console/app/src/i18n/tr.ts` (+4, -4)
- `packages/console/app/src/i18n/uk.ts` (+4, -4)
- `packages/console/app/src/i18n/zh.ts` (+4, -4)
- `packages/console/app/src/i18n/zht.ts` (+4, -4)
- `packages/console/app/src/routes/go/index.tsx` (+0, -2)
- `packages/console/app/src/routes/workspace/[id]/go/lite-section.tsx` (+0, -1)
- `packages/console/function/src/log-processor.ts` (+30, -7)
- `packages/opencode/src/acp-next/agent.ts` (+0, -95)
- `packages/opencode/src/acp-next/session.ts` (+0, -232)
- `packages/opencode/src/acp/README.md` (+0, -174)
- `packages/opencode/src/acp/agent.ts` (+38, -1909)
- `packages/opencode/src/{acp-next => acp}/config-option.ts` (+0, -0)
- `packages/opencode/src/{acp-next => acp}/content.ts` (+0, -0)
- `packages/opencode/src/{acp-next => acp}/directory.ts` (+10, -10)
- `packages/opencode/src/{acp-next => acp}/error.ts` (+20, -23)
- `packages/opencode/src/{acp-next => acp}/event.ts` (+8, -8)
- `packages/opencode/src/{acp-next => acp}/permission.ts` (+4, -4)
- `packages/opencode/src/{acp-next => acp}/profile.ts` (+1, -1)
- `packages/opencode/src/acp/runtime.ts` (+0, -22)
- `packages/opencode/src/{acp-next => acp}/service.ts` (+100, -104)
- `packages/opencode/src/acp/session.ts` (+217, -109)
- `packages/opencode/src/{acp-next => acp}/tool.ts` (+0, -0)
- `packages/opencode/src/acp/types.ts` (+0, -24)
- `packages/opencode/src/{acp-next => acp}/usage.ts` (+7, -7)
- `packages/opencode/src/cli/cmd/acp.ts` (+6, -11)
- `packages/opencode/src/cli/cmd/debug/v2.ts` (+2, -1)
- `packages/opencode/src/cli/cmd/tui/component/dialog-session-list.tsx` (+13, -4)
- `packages/opencode/src/cli/cmd/tui/component/dialog-workspace-create.tsx` (+24, -13)
- `packages/opencode/src/cli/cmd/tui/component/prompt/index.tsx` (+17, -5)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/session/dialog.tsx` (+335, -0)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/session/index.tsx` (+32, -0)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/session/preview-pane.tsx` (+382, -0)
- `packages/opencode/src/cli/cmd/tui/feature-plugins/session/util.tsx` (+70, -0)
- `packages/opencode/src/cli/cmd/tui/plugin/internal.ts` (+3, -0)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+109, -33)
- `packages/opencode/src/cli/cmd/tui/ui/dialog-select.tsx` (+102, -96)
- `packages/opencode/src/config/config.ts` (+4, -0)
- `packages/opencode/src/effect/runtime-flags.ts` (+0, -1)
- `packages/opencode/src/provider/transform.ts` (+1, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/v2/location.ts` (+4, -1)
- `packages/opencode/src/server/routes/instance/httpapi/groups/workspace.ts` (+11, -1)
- `packages/opencode/src/server/routes/instance/httpapi/handlers/workspace.ts` (+19, -4)
- `packages/opencode/src/v2/session.ts` (+1, -1)
- `packages/opencode/test/acp/agent-interface.test.ts` (+0, -52)
- `packages/opencode/test/{acp-next => acp}/config-option.test.ts` (+2, -2)
- `packages/opencode/test/{acp-next => acp}/content.test.ts` (+3, -3)
- `packages/opencode/test/{acp-next => acp}/directory.test.ts` (+2, -2)
- `packages/opencode/test/{acp-next => acp}/error.test.ts` (+17, -21)
- `packages/opencode/test/acp/event-subscription.test.ts` (+0, -977)
- `packages/opencode/test/{acp-next => acp}/event.test.ts` (+13, -13)
- `packages/opencode/test/{acp-next => acp}/permission.test.ts` (+8, -8)
- `packages/opencode/test/{acp-next => acp}/service-session.test.ts` (+23, -23)
- `packages/opencode/test/{acp-next => acp}/session.test.ts` (+33, -33)
- `packages/opencode/test/{acp-next => acp}/tool.test.ts` (+2, -2)
- `packages/opencode/test/{acp-next => acp}/usage.test.ts` (+2, -2)
- `packages/opencode/test/cli/acp/acp-compatibility-baseline.test.ts` (+0, -298)
- `packages/opencode/test/cli/acp/acp-process.test.ts` (+0, -70)
- `packages/opencode/test/cli/{acp-next => acp}/config-options.test.ts` (+7, -7)
- `packages/opencode/test/cli/{acp-next => acp}/helpers.ts` (+5, -12)
- `packages/opencode/test/cli/{acp-next => acp}/initialize-auth.test.ts` (+5, -5)
- `packages/opencode/test/cli/{acp-next => acp}/lifecycle.test.ts` (+9, -9)
- `packages/opencode/test/cli/{acp-next => acp}/prompt-content.test.ts` (+4, -4)
- `packages/opencode/test/cli/{acp-next => acp}/skills.test.ts` (+3, -3)
- `packages/opencode/test/cli/tui/__snapshots__/inline-tool-wrap-snapshot.test.tsx.snap` (+54, -0)
- `packages/opencode/test/cli/tui/inline-tool-wrap-snapshot.test.tsx` (+119, -0)
- `packages/opencode/test/provider/header-timeout.test.ts` (+65, -61)
- `packages/opencode/test/provider/transform.test.ts` (+24, -0)
- `packages/opencode/test/session/llm-native-recorded.test.ts` (+2, -0)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+35, -9)
- `packages/sdk/openapi.json` (+89, -8)
- `packages/stats/AGENTS.md` (+1, -0)
- `packages/stats/app/src/app.tsx` (+2, -2)
- `packages/stats/app/src/asset/unfurl-rankings.png` (+-, --)
- `packages/stats/app/src/entry-server.tsx` (+12, -0)
- `packages/stats/app/src/routes/index.css` (+605, -65)
- `packages/stats/app/src/routes/index.tsx` (+465, -138)
- `packages/web/astro.config.mjs` (+1, -0)
- `packages/web/src/content/docs/ar/go.mdx` (+1, -5)
- `packages/web/src/content/docs/ar/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/bs/go.mdx` (+1, -5)
- `packages/web/src/content/docs/bs/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/config.mdx` (+23, -0)
- `packages/web/src/content/docs/da/go.mdx` (+1, -5)
- `packages/web/src/content/docs/da/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/de/go.mdx` (+1, -5)
- `packages/web/src/content/docs/de/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/es/go.mdx` (+1, -5)
- `packages/web/src/content/docs/es/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/fr/go.mdx` (+1, -5)
- `packages/web/src/content/docs/fr/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/go.mdx` (+1, -5)
- `packages/web/src/content/docs/it/go.mdx` (+1, -5)
- `packages/web/src/content/docs/it/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/ja/go.mdx` (+1, -5)
- `packages/web/src/content/docs/ja/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/ko/go.mdx` (+1, -5)
- `packages/web/src/content/docs/ko/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/nb/go.mdx` (+1, -5)
- `packages/web/src/content/docs/nb/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/pl/go.mdx` (+1, -5)
- `packages/web/src/content/docs/pl/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/policies.mdx` (+137, -0)
- `packages/web/src/content/docs/pt-br/go.mdx` (+1, -5)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/ru/go.mdx` (+1, -5)
- `packages/web/src/content/docs/ru/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/th/go.mdx` (+1, -5)
- `packages/web/src/content/docs/th/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/tr/go.mdx` (+1, -5)
- `packages/web/src/content/docs/tr/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+1, -5)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+1, -1)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+1, -5)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+1, -1)
- `specs/v2/catalog-config-plugin-lifecycle.md` (+322, -0)
- `specs/v2/config.md` (+395, -0)
- `specs/v2/provider-policy.md` (+291, -0)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 38a70e6..4d5290f 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -37,6 +37,7 @@
     "update-limits": "script/update-limits.ts",
     "promote-limits-to-dev": "script/promote-limits.ts dev",
     "promote-limits-to-prod": "script/promote-limits.ts production",
+    "referral-backfill": "script/referral-backfill.ts",
     "typecheck": "tsgo --noEmit"
   },
   "devDependencies": {
```

#### packages/console/core/script/referral-backfill.ts
```diff
diff --git a/packages/console/core/script/referral-backfill.ts b/packages/console/core/script/referral-backfill.ts
new file mode 100644
index 0000000..c3062ad
--- /dev/null
+++ b/packages/console/core/script/referral-backfill.ts
@@ -0,0 +1,153 @@
+import { and, Database, eq, inArray, isNull } from "../src/drizzle/index.js"
+import { Identifier } from "../src/identifier.js"
+import { Referral } from "../src/referral.js"
+import { LiteTable } from "../src/schema/billing.sql.js"
+import { ReferralRewardTable, ReferralTable } from "../src/schema/referral.sql.js"
+import { UserTable } from "../src/schema/user.sql.js"
+import { WorkspaceTable } from "../src/schema/workspace.sql.js"
+
+const backfills = [
+  {
+    inviterWorkspaceID: "wrk_00000000000000000000000000",
+    inviteeWorkspaceID: "wrk_00000000000000000000000000",
+    inviteeAccountID: "acc_00000000000000000000000000",
+  },
+]
+
+console.log(`Backfilling ${backfills.length} referrals`)
+
+for (const [index, backfill] of backfills.entries()) {
+  console.log(`[${index + 1}/${backfills.length}] ${backfill.inviterWorkspaceID} -> ${backfill.inviteeWorkspaceID}`)
+  console.log(`  invitee account: ${backfill.inviteeAccountID}`)
+
+  const result = await Database.transaction(async (tx) => {
+    if (backfill.inviterWorkspaceID === backfill.inviteeWorkspaceID) throw new Error("Self-referral workspace mismatch")
+
+    const inviterWorkspace = await tx
+      .select({ id: WorkspaceTable.id })
+      .from(WorkspaceTable)
+      .where(and(eq(WorkspaceTable.id, backfill.inviterWorkspaceID), isNull(WorkspaceTable.timeDeleted)))
+      .then((rows) => rows[0])
+    if (!inviterWorkspace) throw new Error(`Inviter workspace not found: ${backfill.inviterWorkspaceID}`)
+
+    const inviteeWorkspace = await tx
+      .select({ id: WorkspaceTable.id })
+      .from(WorkspaceTable)
+      .where(and(eq(WorkspaceTable.id, backfill.inviteeWorkspaceID), isNull(WorkspaceTable.timeDeleted)))
+      .then((rows) => rows[0])
+    if (!inviteeWorkspace) throw new Error(`Invitee workspace not found: ${backfill.inviteeWorkspaceID}`)
+
+    const inviteeUser = await tx
+      .select({ id: UserTable.id })
+      .from(UserTable)
+      .where(
+        and(
```

#### packages/console/core/src/referral.ts
```diff
diff --git a/packages/console/core/src/referral.ts b/packages/console/core/src/referral.ts
index 5686dd6..96277ca 100644
--- a/packages/console/core/src/referral.ts
+++ b/packages/console/core/src/referral.ts
@@ -377,23 +377,30 @@ export namespace Referral {
         .then((rows) => rows[0])
       if (!referral) return
 
-      const result = await tx
-        .insert(ReferralRewardTable)
-        .ignore()
-        .values([
-          {
-            workspaceID: referral.workspaceID,
-            referralID: referral.id,
-            amount: REWARD_AMOUNT,
-          },
-          {
-            workspaceID: input.workspaceID,
-            referralID: referral.id,
-            amount: REWARD_AMOUNT,
-          },
-        ])
+      await tx.insert(ReferralRewardTable).ignore().values({
+        workspaceID: referral.workspaceID,
+        referralID: referral.id,
+        amount: REWARD_AMOUNT,
+      })
+
+      const existingInviteeReward = await tx
+        .select({ workspaceID: ReferralRewardTable.workspaceID })
+        .from(ReferralRewardTable)
+        .where(
+          and(
+            eq(ReferralRewardTable.referralID, referral.id),
+            sql`${ReferralRewardTable.workspaceID} <> ${referral.workspaceID}`,
+            isNull(ReferralRewardTable.timeDeleted),
+          ),
+        )
+        .then((rows) => rows[0])
+      if (existingInviteeReward) return
 
-      if (result.rowsAffected === 0) return
+      await tx.insert(ReferralRewardTable).ignore().values({
+        workspaceID: input.workspaceID,
+        referralID: referral.id,
+        amount: REWARD_AMOUNT,
+      })
     })
   }
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index 20eb507..c5d599f 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -63,6 +63,7 @@
     "glob": "13.0.5",
     "google-auth-library": "10.5.0",
     "immer": "11.1.4",
+    "jsonc-parser": "3.3.1",
     "mime-types": "3.0.2",
     "minimatch": "10.2.5",
     "npm-package-arg": "13.0.2",
```

#### packages/core/src/agent.ts
```diff
diff --git a/packages/core/src/agent.ts b/packages/core/src/agent.ts
index 7f4456c..ec7dfa2 100644
--- a/packages/core/src/agent.ts
+++ b/packages/core/src/agent.ts
@@ -1,147 +1,107 @@
 export * as AgentV2 from "./agent"
 
-import { Context, Effect, HashMap, Layer, Option, Order, pipe, Schema, Array } from "effect"
-import { produce, type Draft } from "immer"
+import { Array, Context, Effect, Layer, Schema, Scope } from "effect"
+import { castDraft, enableMapSet, type Draft } from "immer"
 import { ModelV2 } from "./model"
 import { PermissionV2 } from "./permission"
-import { PluginV2 } from "./plugin"
 import { ProviderV2 } from "./provider"
+import { PositiveInt } from "./schema"
+import { State } from "./state"
 
 export const ID = Schema.String.pipe(Schema.brand("AgentV2.ID"))
 export type ID = typeof ID.Type
 
-export const Mode = Schema.Literals(["subagent", "primary", "all"]).annotate({ identifier: "AgentV2.Mode" })
-export type Mode = typeof Mode.Type
+export const Color = Schema.Union([
+  Schema.String.check(Schema.isPattern(/^#[0-9a-fA-F]{6}$/)),
+  Schema.Literals(["primary", "secondary", "accent", "success", "warning", "error", "info"]),
+])
 
-export const Info = Schema.Struct({
-  name: ID,
-  description: Schema.optional(Schema.String),
-  mode: Mode,
-  hidden: Schema.Boolean.pipe(Schema.optional),
-  color: Schema.String.pipe(Schema.optional),
-  permission: PermissionV2.Ruleset,
+export class Info extends Schema.Class<Info>("AgentV2.Info")({
+  id: ID,
   model: ModelV2.Ref.pipe(Schema.optional),
+  options: ProviderV2.Options,
   system: Schema.String.pipe(Schema.optional),
-  options: ProviderV2.Options.pipe(Schema.optional),
-  steps: Schema.Int.pipe(Schema.optional),
-}).annotate({ identifier: "AgentV2.Info" })
-export type Info = typeof Info.Type
-
-export class NotFoundError extends Schema.TaggedErrorClass<NotFoundError>()("AgentV2.NotFound", {
-  agent: ID,
-}) {}
+  description: Schema.String.pipe(Schema.optional),
+  mode: Schema.Literals(["subagent", "primary", "all"]),
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- `src/core/` - review core changes from packages/core/package.json
- `src/permission/` - review permission changes from packages/opencode/src/kilocode/permission/allow-everything.ts
- `src/tool/agent-manager.txt.ts` - update based on kilocode packages/opencode/src/kilocode/tool/agent-manager.txt changes
- `src/tool/notebook.ts` - update based on kilocode packages/opencode/src/kilocode/tool/notebook.ts changes
- `src/tool/read-docx.ts` - update based on kilocode packages/opencode/src/kilocode/tool/read-docx.ts changes
- `src/tool/read-extract.ts` - update based on kilocode packages/opencode/src/kilocode/tool/read-extract.ts changes
- `src/tool/read.ts` - update based on kilocode packages/opencode/src/tool/read.ts changes
- `src/tool/recall.test.ts` - update based on kilocode packages/opencode/test/tool/recall.test.ts changes
- `src/tool/recall.ts` - update based on kilocode packages/opencode/src/tool/recall.ts changes
- `src/tool/xlsx.ts` - update based on kilocode packages/opencode/src/kilocode/tool/xlsx.ts changes
