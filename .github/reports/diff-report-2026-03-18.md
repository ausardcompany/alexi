# Upstream Changes Report
Generated: 2026-03-18 07:03:29

## Summary
- kilocode: 267 commits, 464 files changed
- opencode: 0 commits, 0 files changed

## kilocode Changes (a3eecbbf..3b8e8541)

### Commits

- 3b8e8541 - Merge branch 'Kilo-Org:main' into main (Aleksei Sabetski, 2026-03-18)
- 535f51a5 - Merge pull request #6771 from Kilo-Org/jl-add-smoketest-to-release (Joshua Lambert, 2026-03-17)
- b9ddda1d - Merge pull request #7137 from Kilo-Org/kirillk/model-picker (Kirill Kalishev, 2026-03-17)
- c8698f6b - Merge pull request #7083 from Kilo-Org/feat/process-diagnostics-status-dialog (Marian Alexandru Alecu, 2026-03-17)
- d49e5d39 - Merge branch 'main' into kirillk/model-picker (Kirill Kalishev, 2026-03-17)
- 300c481e - Merge pull request #7192 from Kilo-Org/session/agent_7729b70c-3760-4ad1-bc23-de5aa42ad00c (Mark IJbema, 2026-03-17)
- 600e748e - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-03-17)
- 0adb514d - Remove allow always button (#7159) (Imanol Maiztegui, 2026-03-17)
- f2c77a6a - test(vscode): remove isFree fallback tests now handled by backend (kirillk, 2026-03-17)
- 37323e30 - Merge branch 'main' into kirillk/model-picker (Kirill Kalishev, 2026-03-17)
- 4e628a8c - feat(vscode): propagate isFree from cloud API through CLI to extension (kirillk, 2026-03-17)
- 7c6d2eb3 - test(vscode): add marketplace screenshot stories for MCP and Modes tabs (kiloconnect[bot], 2026-03-17)
- ac0a3ae9 - Merge pull request #7133 from Kilo-Org/mark/marketplace-full-implementation (Mark IJbema, 2026-03-17)
- 27895e07 - fix(vscode): preview pasted images in chat input (#7052) (Thomas Brugman, 2026-03-17)
- 59667f9a - fix(cli): use .cmd shim for local tsc on Windows (Alex Alecu, 2026-03-17)
- 86e8143b - Merge branch 'main' into kirillk/model-picker (Kirill Kalishev, 2026-03-17)
- d01a51dc - feat(vscode): expose undo/redo in the UI with per-message revert button (#7186) (Marius, 2026-03-17)
- 6d6e285b - fix(cli): reset global config lazy cache on /global/dispose so marketplace writes take effect (Mark IJbema, 2026-03-17)
- 2e34e5b3 - fix(cli): race pipe drains against timeout so tsc hangs are killed (Alex Alecu, 2026-03-17)
- f3472af5 - Merge pull request #7167 from Kilo-Org/session/agent_c2cc3a41-49e9-426c-af24-23a9fb2d1e4d (Mark IJbema, 2026-03-17)
- 61580b41 - fix(vscode): also dispose per-project instance after global config changes so agent list refreshes (Mark IJbema, 2026-03-17)
- 563e8d00 - fix(vscode): refresh agent list after marketplace install/remove so new modes appear immediately (Mark IJbema, 2026-03-17)
- b0a0a650 - fix(vscode): disable send button while question tool is pending (#7181) (Marius, 2026-03-17)
- 509c7d7f - fix(vscode): fix mode removal for marketplace-installed modes in both marketplace and agent behaviour views (Mark IJbema, 2026-03-17)
- 28330ea7 - Save permission rules to config (#7143) (Imanol Maiztegui, 2026-03-17)
- bea9eb6b - release: v7.0.49 (kilo-maintainer[bot], 2026-03-17)
- e5ebb8fd - Merge pull request #7185 from Kilo-Org/catrielmuller/fix-publish-vscode (Catriel Müller, 2026-03-17)
- 8f9852c0 - fix: vscode publish (Catriel Müller, 2026-03-17)
- 94b04f71 - fix(vscode): parse mode YAML content into proper agent config and remove invalid MCP fallback (Mark IJbema, 2026-03-17)
- 9a2661dd - refactor(vscode): import TelemetryEventName directly instead of duplicating constants (Mark IJbema, 2026-03-17)
- 35b31951 - fix(vscode): add Marketplace Tab Viewed event and use telemetry constants (Mark IJbema, 2026-03-17)
- eb6d36ce - fix(vscode): add hasParameters and installationMethodName to install telemetry (Mark IJbema, 2026-03-17)
- 5822e82a - fix(vscode): hide project scope option when no workspace is open (Mark IJbema, 2026-03-17)
- 3e644134 - fix(vscode): escape JSON-special characters in marketplace parameter substitution (Mark IJbema, 2026-03-17)
- 2dfcc8e8 - fix(vscode): clear params when switching MCP installation method (Mark IJbema, 2026-03-17)
- e37dfd32 - fix(vscode): align marketplace telemetry with legacy event names, properties, and timing (Mark IJbema, 2026-03-17)
- c115a9e3 - fix(vscode): show error banner when marketplace item removal fails (Mark IJbema, 2026-03-17)
- 6baa3da8 - fix(vscode): fix missing/wrong i18n keys and localize scope labels in marketplace (Mark IJbema, 2026-03-17)
- fe6760dc - Merge pull request #7170 from Kilo-Org/fix/autocomplete-reload-on-connect (Mark IJbema, 2026-03-17)
- f900cc27 - fix(vscode): remove redundant marketplace fetches on agentsLoaded/skillsLoaded (Mark IJbema, 2026-03-17)
- b6e47919 - fix(vscode): remove redundant type badges from marketplace cards (Mark IJbema, 2026-03-17)
- 792afe3b - fix(vscode): keep card title color neutral with underline on hover (Mark IJbema, 2026-03-17)
- e8575fbf - feat(vscode): increase marketplace card size and add expandable descriptions (Mark IJbema, 2026-03-17)
- 60c6cbab - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-03-17)
- 13341256 - fix(vscode): cap marketplace card width with responsive auto-fill grid (Mark IJbema, 2026-03-17)
- c038bcfb - fix(vscode): raise MCP tag threshold to 5 to reduce tag clutter (Mark IJbema, 2026-03-17)
- 02e7ddfd - fix(i18n): use generic search/empty keys for all marketplace tabs (Mark IJbema, 2026-03-17)
- 785b3788 - fix(vscode): only show MCP tags used by at least 2 items (Mark IJbema, 2026-03-17)
- 9861f9d8 - refactor(vscode): merge SkillsMarketplace into MarketplaceListView (Mark IJbema, 2026-03-17)
- 0c92a892 - feat(marketplace): add MCP servers and modes tabs (Mark IJbema, 2026-03-17)
- f91b3c55 - fix(i18n): translate remaining English keys (retry, unseen session) for all locales (Mark IJbema, 2026-03-17)
- d0b2bba8 - Merge branch 'main' into kirillk/model-picker (Kirill Kalishev, 2026-03-17)
- d744762d - fix(i18n): translate remaining English keys (modeModels, retry) for all locales (Mark IJbema, 2026-03-17)
- 01e931ca - feat(vscode): add keyboard navigation to QuestionDock (#7175) (Marius, 2026-03-17)
- 741a8153 - fix(vscode): gate isFree on kilo gateway provider with cost fallback (kirillk, 2026-03-17)
- d7aaee5e - fix(ui): unify tool card arrow direction and header consistency (#7177) (Marius, 2026-03-17)
- c15d156f - Merge branch 'main' into kirillk/model-picker (Kirill Kalishev, 2026-03-17)
- 201a62b5 - fix(vscode): stop pushing provider disposable into context.subscriptions on reconnect (Mark IJbema, 2026-03-17)
- b70ebd76 - fix(i18n): translate error.details.show to Norwegian (Mark IJbema, 2026-03-17)
- 8df8fc85 - fix(i18n): add prompt.placeholder.error translations for all 16 locales (Mark IJbema, 2026-03-17)
- f1d10f89 - Merge pull request #7172 from Kilo-Org/mark/fix-global-config-dispose-all (Mark IJbema, 2026-03-17)
- d50fbb21 - test(vscode): add architecture test for package.json command sync (#7173) (Marius, 2026-03-17)
- 1043d9dd - refactor(vscode): remove unused loaded/reload from AutocompleteModel (Mark IJbema, 2026-03-17)
- c1b5b23d - fix(vscode): guard Select onSelect handlers against no-op config updates (Mark IJbema, 2026-03-17)
- 47e92688 - OpenCode v1.2.20 (Catriel Müller, 2026-03-17)
- ea07e521 - fix: fix merge malformed json (Catriel Müller, 2026-03-17)
- a97515a9 - Merge branch 'main' into catrielmuller/kilo-opencode-v1.2.20 (Catriel Müller, 2026-03-17)
- 66736d0b - test(vscode): rewrite AutocompleteModel tests for current CLI-backend architecture (Mark IJbema, 2026-03-17)
- 8d949f32 - fix(vscode): revert stray test div and empty openapi.json from previous commit (Mark IJbema, 2026-03-17)
- 2dcbc7fb - refactor(vscode): remove dead hasKilocodeProfileWithNoBalance code and stale tests (Mark IJbema, 2026-03-17)
- 13ff40c5 - fix: don't dispose all instances on global config update (Mark IJbema, 2026-03-17)
- 54edf2f5 - Merge pull request #7142 from Kilo-Org/catrielmuller/kilo-opencode-v1.2.19 (Catriel Müller, 2026-03-17)
- f2d9599c - fix: fix build and publish scripts (Catriel Müller, 2026-03-17)
- 2bb0deca - Merge pull request #7171 from Kilo-Org/mark/fix-visual-regression-push-no-verify (Mark IJbema, 2026-03-17)
- ee3a6d61 - fix(vscode): address i18n test review feedback (kiloconnect[bot], 2026-03-17)
- eb662661 - feat: enable git rerere (Catriel Müller, 2026-03-17)
- c29dcdcc - refactor: clean kilo artifacts before compat commit (Catriel Müller, 2026-03-17)
- a01e8e5b - feat: merge opencode v1.2.19 (Catriel Müller, 2026-03-17)
- 63e99289 - fix: tauri db location (Catriel Müller, 2026-03-17)
- a0aef610 - feat: merge opencode v1.2.18 (Catriel Müller, 2026-03-17)
- 63b5b689 - fix: use --no-verify on visual regression baseline push to skip husky hooks (Mark IJbema, 2026-03-17)
- b74fe9ba - test(vscode): add locale completeness checks and fix missing translations (kiloconnect[bot], 2026-03-17)
- b2a59fe5 - fix(vscode): reload autocomplete when CLI backend connection state changes (kiloconnect[bot], 2026-03-17)
- 57b12e2e - Opencode v1.2.18 (Catriel Müller, 2026-03-17)
- 6515f7a5 - chore: update visual regression baselines (github-actions[bot], 2026-03-17)
- c0a3b2f3 - fix: fix sdk generation // vscode test (Catriel Müller, 2026-03-17)
- 00920f50 - fix: add missing lib (Catriel Müller, 2026-03-17)
- 5b796226 - refactor: consider kilocode change markers on merge (Catriel Müller, 2026-03-17)
- f7f02ab7 - refactor: remove console log (Catriel Müller, 2026-03-17)
- 208e5add - fix: tauri db location (Catriel Müller, 2026-03-17)
- c48a80bf - refactor: add kilo markers (Catriel Müller, 2026-03-17)
- 96de074e - fix: fix publish (Catriel Müller, 2026-03-17)
- 7dbe2553 - fix: fix build and publish scripts (Catriel Müller, 2026-03-17)
- b13b7013 - feat: merge opencode v1.2.18 (Catriel Müller, 2026-03-17)
- 9f52ba91 - feat(ui,vscode): make MCP tools expandable like regular tools (#7168) (Marius, 2026-03-17)
- 207fc8b0 - test(vscode): add CI check for missing translation keys (kiloconnect[bot], 2026-03-17)
- 18c282d3 - release: v7.0.48 (kilo-maintainer[bot], 2026-03-17)
- d0576703 - Merge pull request #7160 from Kilo-Org/mark/session-delete-button (Mark IJbema, 2026-03-17)
- ba6709f0 - fix(vscode): replace collapse icon with compress icon for context compaction button (#7163) (Marius, 2026-03-17)
- 64f1b176 - Merge pull request #6975 from Kilo-Org/mark/fix-sidebar-position-on-upgrade (Mark IJbema, 2026-03-17)
- b008844a - Merge branch 'main' into mark/fix-sidebar-position-on-upgrade (Mark IJbema, 2026-03-17)
- 2e2b3503 - Merge pull request #7136 from Kilo-Org/mark/marketplace-screenshot-tests (Mark IJbema, 2026-03-17)
- 57368044 - publish bus event after TsClient diagnostics (Alex Alecu, 2026-03-17)
- bf5b827f - add timeout to TsClient diagnostic wait (Alex Alecu, 2026-03-17)
- be570906 - kill stuck tsgo process after timeout (Alex Alecu, 2026-03-17)
- c766f23f - Merge pull request #7161 from Kilo-Org/fix/disable-external-proxy (Mark IJbema, 2026-03-17)
- cd26320f - feat: add WarpGrep AI-powered codebase search tool (#6685) (DhruvBhatia0, 2026-03-17)
- 12ef3336 - Merge branch 'main' into feat/process-diagnostics-status-dialog (Marian Alexandru Alecu, 2026-03-17)
- 644ecdcf - fix(vscode): optimistically remove session from list on delete (Mark IJbema, 2026-03-17)
- 33897a3e - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-03-17)
- e70052f3 - feat(vscode): add delete button to session list items (Mark IJbema, 2026-03-17)
- 5c4cf5c8 - feat(vscode): add delete session button to task header (Mark IJbema, 2026-03-17)
- c202ee34 - fix(cli): comment out proxy code instead of deleting it (kiloconnect[bot], 2026-03-17)
- 4115c1d7 - Visual regression tests for PermissionDock dropdown states (#7146) (Imanol Maiztegui, 2026-03-17)
- 99b07900 - test(marketplace): remove loading spinner story (Mark IJbema, 2026-03-17)
- 1efbd9b2 - Merge pull request #7145 from Kilo-Org/docs/fix-unbound-link-checker-failure (Jean du Plessis, 2026-03-17)
- 3dc6010d - fix(cli): disable external proxy to app.opencode.ai (kiloconnect[bot], 2026-03-17)
- 8120073a - Merge branch 'Kilo-Org:main' into main (Aleksei Sabetski, 2026-03-17)
- 82e8f3cc - refactor: recreate bun (Catriel Müller, 2026-03-16)
- 36210fa6 - resolve merge conflicts (Catriel Müller, 2026-03-16)
- 5784fd07 - feat: enable git rerere (Catriel Müller, 2026-03-16)
- 4bbacf69 - fix(kilo-docs): replace broken Unbound gateway link with working /connect URL (kiloconnect[bot], 2026-03-16)
- 6aaeeb57 - refactor: clean kilo artifacts before compat commit (Catriel Müller, 2026-03-16)
- e6b29e3e - feat: merge opencode v1.2.19 (Catriel Müller, 2026-03-16)
- 1cc99559 - Merge branch 'main' into kirillk/model-picker (Kirill Kalishev, 2026-03-16)
- ecb27fd5 - Merge pull request #7127 from Kilo-Org/change-default-model-to-balanced (Christiaan Arnoldus, 2026-03-16)
- c6f6d5ca - chore: update visual regression baselines (github-actions[bot], 2026-03-16)
- 223ee3d6 - fix: fix sdk generation // vscode test (Catriel Müller, 2026-03-16)
- 1a01bcf3 - Merge branch 'main' into kirillk/model-picker (Kirill Kalishev, 2026-03-16)
- db996183 - fix(vscode): update isFree tests to match new isFree/cost-based signature (kirillk, 2026-03-16)
- 97ddaa18 - feat(vscode): set selectedIndex to active model when model picker opens (kirillk, 2026-03-16)
- b1859811 - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-03-16)
- 0bf7ae1f - chore: remove storybook debug log (Mark IJbema, 2026-03-16)
- 0b6d9d4a - test(marketplace): add visual regression stories for skills tab (Mark IJbema, 2026-03-16)
- 49dd8ab6 - feat(vscode): scroll active model into center view when model picker opens (kirillk, 2026-03-16)
- 8077d65b - Merge pull request #7122 from Kilo-Org/mark/marketplace-skills-only (Mark IJbema, 2026-03-16)
- 6ddfab30 - feat(vscode): wire isFree attribute to free badge with cost fallback, use kilo-ui Tag (kirillk, 2026-03-16)
- 28ae1604 - feat(vscode): sort models within groups alphabetically to cluster same-prefix models together (kirillk, 2026-03-16)
- 7d08b57f - fix: add missing lib (Catriel Müller, 2026-03-16)
- f6dcb226 - refactor: consider kilocode change markers on merge (Catriel Müller, 2026-03-16)
- feb3cd92 - feat(vscode): filter model selector by model name only (kirillk, 2026-03-16)
- b6d88279 - feat(vscode): align model selector active state and group label styling with kilo-ui design system (kirillk, 2026-03-16)
- 9372d1b2 - refactor: remove console log (Catriel Müller, 2026-03-16)
- 60e749e7 - fix: tauri db location (Catriel Müller, 2026-03-16)
- fb9d9775 - refactor: add kilo markers (Catriel Müller, 2026-03-16)
- b9504c68 - fix: fix publish (Catriel Müller, 2026-03-16)
- 56a93fbc - fix: fix build and publish scripts (Catriel Müller, 2026-03-16)
- 47223a73 - feat(vscode): add Recommended group to model selector (kirillk, 2026-03-16)
- 656db495 - feat: merge opencode v1.2.18 (Catriel Müller, 2026-03-16)
- e1509cb1 - fix(marketplace): use correct kilo-ui CSS variables for modal background (Mark IJbema, 2026-03-16)
- 03d90ed5 - feat(gateway): change default model from kilo-auto/frontier to kilo-auto/balanced (kiloconnect[bot], 2026-03-16)
- ea4f5ebd - feat(i18n): add marketplace translations for all 16 languages (Mark IJbema, 2026-03-16)
- 2559229a - feat(marketplace): implement skills tab with MCP/modes placeholders (Mark IJbema, 2026-03-16)
- 5aa13051 - docs: add commit conventions section to AGENTS.md (#7125) (Marius, 2026-03-16)
- 7d7133c3 - Merge pull request #7121 from Kilo-Org/remove-new-label-and-feature-toggle (Mark IJbema, 2026-03-16)
- ab097286 - Remove (NEW) labels and feature toggle from VS Code extension (kiloconnect[bot], 2026-03-16)
- 3a76e569 - fix(vscode): add inert to collapsed question dock body for keyboard accessibility (#7118) (Marius, 2026-03-16)
- 753917e0 - Merge branch 'main' into mark/fix-sidebar-position-on-upgrade (Mark IJbema, 2026-03-16)
- 04843181 - Granular bash permission rules (#7091) (Imanol Maiztegui, 2026-03-16)
- 4c5bd136 - fix: use correct config.json schema URL (app.kilo.ai) (#7086) (John Brick, 2026-03-16)
- 80d69046 - Merge pull request #7111 from Kilo-Org/mark/fix-config-update-spam (Mark IJbema, 2026-03-16)
- 88a55980 - fix: guard temperature and prevent prompt injection in enhance-prompt (#7103) (Marius, 2026-03-16)
- d38b9e6c - feat(vscode): collapsible question dock with compact single-box layout (#7112) (Marius, 2026-03-16)
- 457ff179 - Merge pull request #7100 from Kilo-Org/mark/remove-available-modes (Mark IJbema, 2026-03-16)
- 10748172 - Guard config fetch/update against disconnected backend (Mark IJbema, 2026-03-16)
- a5618aba - fix: clear stale agent selection when removing a custom mode (Mark IJbema, 2026-03-16)
- f7d89837 - fix: format zh.ts and zht.ts with prettier (Mark IJbema, 2026-03-16)
- 1e5f9a6f - chore: update kilo-vscode visual regression baselines (github-actions[bot], 2026-03-16)
- 3c362320 - Merge pull request #7105 from Kilo-Org/cleanup/migration-plan-remaining-work (Mark IJbema, 2026-03-16)
- a4067417 - fix: delay optimistic removal until after dialog close animation (Mark IJbema, 2026-03-16)
- 57d20ce4 - remove editor-context-menus-and-code-actions.md (feature complete) (Mark IJbema, 2026-03-16)
- 9d8289a2 - restore kilocode-legacy anchor sections (Mark IJbema, 2026-03-16)
- 25b6aa36 - remove sessions-migration.md and update references (not migrating sessions) (Mark IJbema, 2026-03-16)
- b3edc7c5 - revert architect-mode-plan-files.md to original (Mark IJbema, 2026-03-16)
- b98d92c9 - docs: prune migration plan to remaining work only (kiloconnect[bot], 2026-03-16)
- c45bee36 - Merge branch 'main' into feat/process-diagnostics-status-dialog (Marian Alexandru Alecu, 2026-03-16)
- be29e83f - Merge pull request #7097 from Kilo-Org/fix/terminal-add-to-context (Mark IJbema, 2026-03-16)
- a80d4953 - fix: prevent dialog from reopening on first mode removal (Mark IJbema, 2026-03-16)
- b8e196d1 - fix: also remove mode from legacy .kilocodemodes files used by ModesMigrator (Mark IJbema, 2026-03-16)
- b90a2237 - fix: remove unrelated formatting changes from i18n files (Mark IJbema, 2026-03-16)
- 0b702ea1 - feat: add backend route to delete custom mode files from disk (Mark IJbema, 2026-03-16)
- bcf609a5 - fix: rename 'Available Modes' to 'Available Custom Modes' in all locales (Mark IJbema, 2026-03-16)
- 7494ce6b - feat: add ability to remove custom modes from Agent Behaviour settings (Mark IJbema, 2026-03-16)
- 91aa29ba - fix: use direct generateText for prompt enhancement instead of LLM.stream (#7101) (Marius, 2026-03-16)
- ee0f3bb6 - perf(ui): defer markdown syntax highlighting to prevent main thread blocking (#7102) (Marius, 2026-03-16)
- a108d8b3 - Merge pull request #7089 from Kilo-Org/LigiaZ-patch-1 (Ligia Zanchet, 2026-03-16)
- 2602c670 - fix: resolve workspace-local tsc from node_modules (Alex Alecu, 2026-03-16)
- 6c3a662b - fix: fallback to TsClient when tsgo LSP spawn fails in experimental mode (Alex Alecu, 2026-03-16)
- eed5f903 - fix: restore register-code-actions.ts to origin/main version (Mark IJbema, 2026-03-16)
- 72e32477 - fix: remove unrelated register-code-actions.ts changes and conflict markers (Mark IJbema, 2026-03-16)
- ebbbaa40 - fix: use args.selection and clipboard fallback for terminal actions (Mark IJbema, 2026-03-16)
- b5766361 - fix(vscode): implement terminal Add to Context using clipboard-based selection (kiloconnect[bot], 2026-03-16)
- 7e69e22a - Merge pull request #7071 from Kilo-Org/revert-6629-fix/remove-duplicate-reasoning-hack (Christiaan Arnoldus, 2026-03-16)
- 0ba73504 - fix: copy buttons overlaying text and misaligned in chat UI (#7098) (Marius, 2026-03-16)
- 8ba7232c - chore: update @typescript/native-preview to 7.0.0-dev.20260316.1 (Alex Alecu, 2026-03-16)
- 215770fa - feat: use persistent tsgo --lsp server when KILO_EXPERIMENTAL_LSP_TOOL is enabled (Alex Alecu, 2026-03-16)
- e3cbc1b3 - refactor: remove process tree status dialog feature (Alex Alecu, 2026-03-16)
- a8f167e0 - Merge branch 'main' into feat/process-diagnostics-status-dialog (Marian Alexandru Alecu, 2026-03-16)
- 2a5808f8 - Merge pull request #7070 from Kilo-Org/mark/add-skill-removal (Mark IJbema, 2026-03-16)
- 23c8e5c7 - Update webhook trigger for feat PRs (Ligia Zanchet, 2026-03-16)
- 7073d379 - Merge pull request #7094 from Kilo-Org/fix/add-to-context-appends-instead-of-replaces (Mark IJbema, 2026-03-16)
- 6321252c - Merge pull request #7028 from Kilo-Org/kirillk/dogfood (Kirill Kalishev, 2026-03-16)
- f575587b - fix(vscode): append to prompt instead of replacing on Add to Context (kiloconnect[bot], 2026-03-16)
- 0d72df35 - fix(vscode): return focus to textarea after selector popover closes (#7078) (Marius, 2026-03-16)
- 3b5118e2 - Merge branch 'main' into feat/process-diagnostics-status-dialog (Marian Alexandru Alecu, 2026-03-16)
- bce8c6e6 - fix: validate skill location against registry before deletion and re-sync webview on failure (Mark IJbema, 2026-03-16)
- 054589a2 - Merge pull request #7088 from Kilo-Org/mark/fix-local-bin-force (Mark IJbema, 2026-03-16)
- 269fd052 - Adjust for OpenRouter, some improvements (Christiaan Arnoldus, 2026-03-16)
- fa54205c - Merge pull request #7032 from Kilo-Org/docs/android-studio-known-issues (Ligia Zanchet, 2026-03-16)
- a17a5de9 - Add auto-docs workflow for merged feat PRs (Ligia Zanchet, 2026-03-16)
- 8b49ad78 - fix: local-bin --force now correctly removes dist directory (Mark IJbema, 2026-03-16)
- 90701f36 - Merge branch 'main' into feat/process-diagnostics-status-dialog (Marian Alexandru Alecu, 2026-03-16)
- 7078246d - perf: enable --incremental for warm tsgo runs (~200-400ms after first check) (Alex Alecu, 2026-03-16)
- 531ae443 - Merge pull request #7084 from Kilo-Org/mark/i18n-settings-command-interpolation (Mark IJbema, 2026-03-16)
- cfe4e8c4 - fix: switch skill removal to POST with JSON body instead of DELETE with query params (Mark IJbema, 2026-03-16)
- 9507b01c - fix: rely on optimistic removal instead of stale backend response (Mark IJbema, 2026-03-16)
- f998ee32 - fix: return updated skills list from DELETE endpoint to fix stale UI (Mark IJbema, 2026-03-16)
- 2d9e4473 - refactor: rename to KilocodeRoutes at /kilocode prefix (Mark IJbema, 2026-03-16)
- 07d16dff - refactor: move DELETE /skill to dedicated route file (Mark IJbema, 2026-03-16)
- 5618b810 - i18n: add skill removal translations for all 15 languages (Mark IJbema, 2026-03-16)
- ec544e82 - feat: add DELETE /skill endpoint and use CLI backend for skill removal (Mark IJbema, 2026-03-16)
- 3da18dee - refactor: move skills state to session context with refreshSkills/removeSkill (Mark IJbema, 2026-03-16)
- 2e4070d4 - feat: add ability to remove discovered skills from Agent Behaviour settings (Mark IJbema, 2026-03-16)
- cc12e8d9 - Merge pull request #7081 from Kilo-Org/mark/fix-settings-panel-reload (Mark IJbema, 2026-03-16)
- 0b42d8ae - feat: open autocomplete tab directly from status bar settings link (Mark IJbema, 2026-03-16)
- 91c3c668 - refactor: pass settings command URI as i18n interpolation variable instead of hardcoding in locale files (kiloconnect[bot], 2026-03-16)
- 95221c99 - feat(vscode): persist active settings tab across webview reloads (Mark IJbema, 2026-03-16)
- 775a87e8 - fix(vscode): restore settings view after webview reload (Mark IJbema, 2026-03-16)
- 488f7266 - feat(vscode): replace message queuing with promptAsync and queued UI indicator (#7029) (Marius, 2026-03-16)
- 20edbff4 - Merge pull request #7073 from Kilo-Org/fix/login-popup-persistence (Mark IJbema, 2026-03-16)
- ada05c75 - Merge pull request #7072 from Kilo-Org/ci/check-kilocode-change-markers (Mark IJbema, 2026-03-16)
- f1f94984 - fix: consistent icon button sizing in prompt input actions (#7076) (Marius, 2026-03-16)
- 1dd8a45e - Exclude node_modules and dist from kilocode_change check, allow backtick-quoted references (Mark IJbema, 2026-03-16)
- c69b2107 - fix(vscode): align filename next to directory path in diff headers (#7075) (Marius, 2026-03-16)
- 08675183 - fix: defer tsgo to waitForDiagnostics, skip warm-up calls (Alex Alecu, 2026-03-16)
- f9ea7684 - fix: resolve native tsgo binary directly, skip node.js wrapper (Alex Alecu, 2026-03-16)
- 971935f2 - Revert "fix: remove duplicate reasoning hack for kilo provider" (Christiaan Arnoldus, 2026-03-16)
- f5ac4ca5 - Move kilocode_change check to package.json script following knip pattern (kiloconnect[bot], 2026-03-16)
- 722c5852 - feat: replace typescript-language-server with lightweight tsgo client (Alex Alecu, 2026-03-16)
- f8ed8ee8 - feat: add lightweight LSPClient adapter backed by tsgo diagnostics (Alex Alecu, 2026-03-16)
- 2191d094 - feat: add tsgo/tsc diagnostic runner for lightweight TypeScript checking (Alex Alecu, 2026-03-16)
- 8875fc70 - Move kilocode_change check into existing test-vscode workflow instead of separate workflow (kiloconnect[bot], 2026-03-16)
- 3751bc34 - Add CI check to prevent kilocode_change markers in kilo packages (kiloconnect[bot], 2026-03-16)
- 7888b6f8 - fix: cap tsserver memory at 1.5 GB and disable automatic typing acquisition (Alex Alecu, 2026-03-16)
- 03afafbd - fix: use ucomm for reliable ps parsing and extract script names from args (Alex Alecu, 2026-03-16)
- bde1f0ca - feat: display process tree with memory usage in TUI status dialog (Alex Alecu, 2026-03-16)
- 5de611e3 - chore(sdk): regenerate SDK with ProcessInfo and ProcessStatus types (Alex Alecu, 2026-03-16)
- dff17ba3 - feat: add GET /process server route for process status (Alex Alecu, 2026-03-16)
- 346387e2 - feat: add process tree utility for memory diagnostics (Alex Alecu, 2026-03-16)
- a594cb89 - Merge pull request #7066 from Kilo-Org/mark/fix-mcp-command-display (Mark IJbema, 2026-03-16)
- fdf95032 - fix: handle array-format MCP command in settings display (Mark IJbema, 2026-03-16)
- 75e2ac93 - docs: add Android Studio known issues to JetBrains troubleshooting section (kiloconnect[bot], 2026-03-13)
- 38c3543f - chore(vscode): use green checkmark for install success message (kirillk, 2026-03-13)
- 2742355c - chore(vscode): add DevSnapshot Build and Install tasks (kirillk, 2026-03-13)
- 84ffca26 - chore(vscode): replace install-dev-extension with snapshot:install task (kirillk, 2026-03-13)
- 2488f261 - Update packages/kilo-vscode/script/dev-snapshot.ts (Kirill Kalishev, 2026-03-13)
- c98c93a7 - Merge branch 'main' into kirillk/dogfood (Kirill Kalishev, 2026-03-13)
- bd083e2d - fix(vscode): run full typecheck (extension + webview) in snapshot build (kirillk, 2026-03-13)
- d434c42e - fix(vscode): semver-safe sanitization of git user.name in snapshot version (kirillk, 2026-03-13)
- e47e6efd - chore(vscode): move snapshot scripts to bottom of package.json (kirillk, 2026-03-13)
- 79970cd9 - fix(vscode): include username in vsix filename, deduplicate path output (kirillk, 2026-03-13)
- 2144bedf - docs(vscode): update snapshot build docs with directory and version info (kirillk, 2026-03-13)
- b535131c - feat(vscode): add dev-snapshot build script with username in version (kirillk, 2026-03-13)
- 876959f8 - fix: remove redundant vscode.env.openExternal call during login flow (kiloconnect[bot], 2026-03-13)
- e608ec4a - fix(vscode): preserve sidebar position when upgrading from legacy extension (Mark IJbema, 2026-03-12)
- 5ca582ca - fix: robust smoke-test run identification and release targeting (josh, 2026-03-10)
- 58727212 - Draft of triggering smoketest after draft release and before public publish (Josh Lambert, 2026-03-09)

### Changed Files by Category

#### Tool System (packages/*/src/tool/)
- `packages/opencode/src/tool/bash.ts` (+4, -1)
- `packages/opencode/src/tool/registry.ts` (+2, -0)
- `packages/opencode/src/tool/warpgrep.ts` (+97, -0)
- `packages/opencode/src/tool/warpgrep.txt` (+10, -0)
- `packages/opencode/test/tool/bash.test.ts` (+4, -2)

#### Agent System (packages/*/src/agent/)
- `packages/opencode/src/agent/agent.ts` (+84, -1)

#### Permission System (**/permission/)
- `packages/opencode/src/permission/next.ts` (+72, -8)
- `packages/opencode/test/permission/next.always-rules.test.ts` (+331, -0)
- `packages/opencode/test/permission/next.pattern-rules.test.ts` (+0, -317)
- `packages/opencode/test/permission/next.toConfig.test.ts` (+88, -0)

#### Event Bus (**/bus/, **/event/)
(no changes)

#### Core (**/core/)
(no changes)

#### Other Changes
- `.github/workflows/auto-docs.yml` (+34, -0)
- `.github/workflows/publish.yml` (+75, -0)
- `.github/workflows/test-vscode.yml` (+4, -0)
- `.github/workflows/visual-regression.yml` (+38, -2)
- `.vscode/tasks.json` (+20, -2)
- `AGENTS.md` (+5, -0)
- `bun.lock` (+281, -238)
- `package.json` (+6, -4)
- `packages/app/e2e/actions.ts` (+5, -1)
- `packages/app/e2e/files/file-viewer.spec.ts` (+53, -0)
- `packages/app/package.json` (+2, -2)
- `packages/app/src/components/prompt-input/submit.ts` (+2, -1)
- `packages/app/src/components/session-context-usage.tsx` (+2, -2)
- `packages/app/src/components/session/session-context-tab.tsx` (+6, -6)
- `packages/app/src/components/session/session-new-view.tsx` (+10, -10)
- `packages/app/src/components/settings-providers.tsx` (+2, -11)
- `packages/app/src/context/global-sync.tsx` (+3, -8)
- `packages/app/src/context/global-sync/bootstrap.ts` (+4, -12)
- `packages/app/src/context/language.tsx` (+22, -0)
- `packages/app/src/context/local.tsx` (+20, -10)
- `packages/app/src/i18n/ar.ts` (+2, -1)
- `packages/app/src/i18n/fr.ts` (+4, -5)
- `packages/app/src/i18n/th.ts` (+2, -10)
- `packages/app/src/i18n/tr.ts` (+2, -1)
- `packages/app/src/i18n/zht.ts` (+2, -10)
- `packages/app/src/pages/layout.tsx` (+44, -39)
- `packages/app/src/pages/layout/deep-links.ts` (+24, -8)
- `packages/app/src/pages/layout/helpers.test.ts` (+31, -10)
- `packages/app/src/pages/layout/sidebar-items.tsx` (+20, -18)
- `packages/app/src/pages/session.tsx` (+40, -21)
- `packages/app/src/pages/session/composer/session-question-dock.tsx` (+22, -4)
- `packages/app/src/pages/session/file-tabs.tsx` (+0, -1)
- `packages/app/src/pages/session/helpers.test.ts` (+2, -1)
- `packages/app/src/pages/session/helpers.ts` (+8, -3)
- `packages/app/src/pages/session/message-id-from-hash.ts` (+6, -0)
- `packages/app/src/pages/session/message-timeline.tsx` (+5, -5)
- `packages/app/src/pages/session/session-side-panel.tsx` (+3, -1)
- `packages/app/src/pages/session/terminal-panel.tsx` (+8, -8)
- `packages/app/src/pages/session/use-session-hash-scroll.test.ts` (+1, -1)
- `packages/app/src/pages/session/use-session-hash-scroll.ts` (+18, -22)
- `packages/app/src/utils/notification-click.ts` (+3, -2)
- `packages/app/src/utils/server-errors.test.ts` (+76, -14)
- `packages/app/src/utils/server-errors.ts` (+53, -22)
- `packages/app/tsconfig.json` (+2, -2)
- `packages/desktop-electron/package.json` (+1, -1)
- `packages/desktop-electron/resources/entitlements.plist` (+0, -12)
- `packages/desktop-electron/src/main/index.ts` (+29, -15)
- `packages/desktop-electron/sst-env.d.ts` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/desktop/src-tauri/entitlements.plist` (+0, -12)
- `packages/desktop/src/i18n/de.ts` (+2, -1)
- `packages/extensions/zed/extension.toml` (+6, -6)
- `packages/kilo-docs/lib/nav/kiloclaw.ts` (+1, -3)
- `packages/kilo-docs/next.config.js` (+7, -3)
- `packages/kilo-docs/package.json` (+1, -1)
- `packages/kilo-docs/pages/ai-providers/unbound.md` (+1, -1)
- `packages/kilo-docs/pages/code-with-ai/platforms/cli.md` (+4, -4)
- `packages/kilo-docs/pages/customize/custom-subagents.md` (+1, -1)
- `packages/kilo-docs/pages/getting-started/faq/known-issues.md` (+21, -0)
- `packages/kilo-docs/pages/kiloclaw/development-tools/github.md` (+11, -11)
- `packages/kilo-gateway/package.json` (+1, -1)
- `packages/kilo-gateway/src/api/constants.ts` (+1, -1)
- `packages/kilo-gateway/src/api/models.ts` (+2, -0)
- `packages/kilo-i18n/package.json` (+1, -1)
- `packages/kilo-i18n/src/ar.ts` (+50, -0)
- `packages/kilo-i18n/src/br.ts` (+50, -0)
- `packages/kilo-i18n/src/bs.ts` (+50, -0)
- `packages/kilo-i18n/src/da.ts` (+50, -0)
- `packages/kilo-i18n/src/de.ts` (+50, -0)
- `packages/kilo-i18n/src/en.ts` (+49, -2)
- `packages/kilo-i18n/src/es.ts` (+50, -0)
- `packages/kilo-i18n/src/fr.ts` (+50, -0)
- `packages/kilo-i18n/src/ja.ts` (+49, -0)
- `packages/kilo-i18n/src/ko.ts` (+49, -0)
- `packages/kilo-i18n/src/no.ts` (+50, -0)
- `packages/kilo-i18n/src/pl.ts` (+50, -0)
- `packages/kilo-i18n/src/ru.ts` (+50, -0)
- `packages/kilo-i18n/src/th.ts` (+50, -0)
- `packages/kilo-i18n/src/tr.ts` (+50, -0)
- `packages/kilo-i18n/src/zh.ts` (+49, -0)
- `packages/kilo-i18n/src/zht.ts` (+49, -0)
- `packages/kilo-telemetry/package.json` (+1, -1)
- `packages/kilo-telemetry/tsconfig.json` (+1, -0)
- `packages/kilo-ui/package.json` (+1, -1)
- `packages/kilo-ui/src/components/basic-tool.css` (+27, -0)
- `packages/kilo-ui/src/components/collapsible.css` (+11, -0)
- `packages/kilo-ui/src/components/message-part.css` (+28, -16)
- `packages/kilo-ui/src/components/message-part.tsx` (+1, -1)
- `packages/kilo-ui/src/hooks/create-auto-scroll.tsx` (+0, -1)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-basictool/generic-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-messagepart/full-conversation-turn-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-messagepart/message-switch-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-messagepart/user-message-story-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-messagepart/with-reasoning-collapsed-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-messagepart/with-reasoning-expanded-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-sessionturn/default-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-sessionturn/with-steps-expanded-chromium-linux.png` (+2, -2)
- `packages/kilo-ui/tests/visual-regression.spec.ts-snapshots/components-sessionturn/working-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/AGENTS.md` (+1, -5)
- `packages/kilo-vscode/README.md` (+16, -0)
- `packages/kilo-vscode/docs/chat-ui-features/browser-session-controls.md` (+0, -5)
- `packages/kilo-vscode/docs/chat-ui-features/checkpoint-task-management.md` (+3, -14)
- `packages/kilo-vscode/docs/chat-ui-features/connection-state-ui.md` (+0, -39)
- `packages/kilo-vscode/docs/chat-ui-features/mermaid-diagram-features.md` (+7, -15)
- `packages/kilo-vscode/docs/chat-ui-features/message-editing-management.md` (+1, -2)
- `packages/kilo-vscode/docs/chat-ui-features/special-content-types.md` (+0, -8)
- `packages/kilo-vscode/docs/cli-side/ask-mode-no-edits.md` (+0, -24)
- `packages/kilo-vscode/docs/cli-side/init-secret-check.md` (+3, -14)
- `packages/kilo-vscode/docs/cli-side/plan-mode-over-prompting.md` (+5, -15)
- `packages/kilo-vscode/docs/error-handling/autocomplete-settings-link.md` (+4, -16)
- `packages/kilo-vscode/docs/error-handling/cli-startup-errors.md` (+6, -25)
- `packages/kilo-vscode/docs/error-handling/extension-refresh-on-update.md` (+3, -15)
- `packages/kilo-vscode/docs/error-handling/pre-release-switch-crash.md` (+6, -17)
- `packages/kilo-vscode/docs/error-handling/propagate-cli-errors-to-ui.md` (+5, -20)
- `packages/kilo-vscode/docs/features/anonymous-signin-prompts.md` (+0, -29)
- `packages/kilo-vscode/docs/features/custom-openai-provider-ui.md` (+7, -24)
- `packages/kilo-vscode/docs/features/expandable-mcp-tools.md` (+4, -16)
- `packages/kilo-vscode/docs/features/file-attachments.md` (+5, -15)
- `packages/kilo-vscode/docs/features/remember-last-model.md` (+4, -15)
- `packages/kilo-vscode/docs/features/session-preview-improvements.md` (+4, -17)
- `packages/kilo-vscode/docs/features/subagent-visibility.md` (+0, -25)
- `packages/kilo-vscode/docs/features/task-completion-notification.md` (+5, -20)
- `packages/kilo-vscode/docs/features/terminal-output-visibility.md` (+0, -29)
- `packages/kilo-vscode/docs/infrastructure/changelog-on-update.md` (+5, -16)
- `packages/kilo-vscode/docs/infrastructure/dedicated-output-channel.md` (+4, -31)
- `packages/kilo-vscode/docs/infrastructure/http-request-timeouts.md` (+3, -22)
- `packages/kilo-vscode/docs/infrastructure/openvsx-publish.md` (+4, -18)
- `packages/kilo-vscode/docs/infrastructure/sdk-over-http.md` (+0, -27)
- `packages/kilo-vscode/docs/infrastructure/session-turn.md` (+0, -26)
- `packages/kilo-vscode/docs/infrastructure/sse-auto-reconnect.md` (+0, -40)
- `packages/kilo-vscode/docs/infrastructure/vscode-error-notifications.md` (+3, -24)
- `packages/kilo-vscode/docs/migration/memorybank-migration.md` (+5, -20)
- `packages/kilo-vscode/docs/migration/sessions-migration.md` (+0, -25)
- `packages/kilo-vscode/docs/migration/settings-migration.md` (+6, -17)
- `packages/kilo-vscode/docs/migration/upgrade-onboarding.md` (+7, -20)
- `packages/kilo-vscode/docs/non-agent-features/authentication-organization-enterprise-enforcement.md` (+0, -7)
- `packages/kilo-vscode/docs/non-agent-features/auto-purge.md` (+0, -1)
- `packages/kilo-vscode/docs/non-agent-features/cloud-task-support.md` (+0, -9)
- `packages/kilo-vscode/docs/non-agent-features/code-reviews.md` (+0, -1)
- `packages/kilo-vscode/docs/non-agent-features/codebase-indexing-semantic-search.md` (+0, -1)
- `packages/kilo-vscode/docs/non-agent-features/contribution-tracking.md` (+0, -1)
- `packages/kilo-vscode/docs/non-agent-features/custom-command-system.md` (+0, -5)
- `packages/kilo-vscode/docs/non-agent-features/editor-context-menus-and-code-actions.md` (+0, -24)
- `packages/kilo-vscode/docs/non-agent-features/marketplace.md` (+1, -5)
- `packages/kilo-vscode/docs/non-agent-features/mcp-and-mcp-hub.md` (+1, -6)
- `packages/kilo-vscode/docs/non-agent-features/repository-initialization.md` (+0, -1)
- `packages/kilo-vscode/docs/non-agent-features/rules-and-workflows.md` (+1, -5)
- `packages/kilo-vscode/docs/non-agent-features/settings-sync-integration.md` (+0, -1)
- `packages/kilo-vscode/docs/non-agent-features/settings-ui.md` (+1, -4)
- `packages/kilo-vscode/docs/non-agent-features/skills-system.md` (+1, -5)
- `packages/kilo-vscode/docs/non-agent-features/speech-to-text.md` (+0, -1)
- `packages/kilo-vscode/docs/opencode-migration-plan.md` (+64, -97)
- `packages/kilo-vscode/docs/performance/markdown-syntax-highlighting.md` (+0, -34)
- `packages/kilo-vscode/docs/ui-polish/approval-box-full-path.md` (+4, -14)
- `packages/kilo-vscode/docs/ui-polish/chat-background-color.md` (+0, -20)
- `packages/kilo-vscode/docs/ui-polish/chat-input-cursor-misplacement.md` (+0, -22)
- `packages/kilo-vscode/docs/ui-polish/chat-input-narrow-sidebar-overflow.md` (+3, -14)
- `packages/kilo-vscode/docs/ui-polish/clickable-cursor-styles.md` (+0, -21)
- `packages/kilo-vscode/docs/ui-polish/context-compression-icon.md` (+0, -21)
- `packages/kilo-vscode/docs/ui-polish/copy-button-extra-fields.md` (+0, -21)
- `packages/kilo-vscode/docs/ui-polish/diff-jump-to-changed-lines.md` (+0, -22)
- `packages/kilo-vscode/docs/ui-polish/markdown-rendering-improvements.md` (+5, -16)
- `packages/kilo-vscode/docs/ui-polish/new-task-discoverability.md` (+0, -28)
- `packages/kilo-vscode/docs/ui-polish/profile-view-back-button.md` (+3, -15)
- `packages/kilo-vscode/docs/ui-polish/reasoning-block-styling.md` (+0, -24)
- `packages/kilo-vscode/package.json` (+20, -16)
- `packages/kilo-vscode/script/dev-snapshot.ts` (+69, -0)
- `packages/kilo-vscode/script/install-dev-extension.ts` (+0, -35)
- `packages/kilo-vscode/script/local-bin.ts` (+2, -3)
- `packages/kilo-vscode/src/KiloProvider.ts` (+314, -27)
- `packages/kilo-vscode/src/SettingsEditorProvider.ts` (+46, -9)
- `packages/kilo-vscode/src/agent-manager/AgentManagerProvider.ts` (+5, -1)
- `packages/kilo-vscode/src/agent-manager/types.ts` (+7, -0)
- `packages/kilo-vscode/src/constants.ts` (+1, -17)
- `packages/kilo-vscode/src/extension.ts` (+5, -5)
- `packages/kilo-vscode/src/image-preview.ts` (+83, -0)
- `packages/kilo-vscode/src/kilo-provider-utils.ts` (+16, -0)
- `packages/kilo-vscode/src/project-directory.ts` (+69, -0)
- `packages/kilo-vscode/src/services/autocomplete/AutocompleteModel.ts` (+0, -18)
- `packages/kilo-vscode/src/services/autocomplete/AutocompleteServiceManager.ts` (+16, -19)
- `packages/kilo-vscode/src/services/autocomplete/AutocompleteStatusBar.ts` (+5, -9)
- `packages/kilo-vscode/src/services/autocomplete/__tests__/AutocompleteModel.spec.ts` (+116, -679)
- `packages/kilo-vscode/src/services/autocomplete/__tests__/AutocompleteServiceManager.spec.ts` (+3, -6)
- `packages/kilo-vscode/src/services/autocomplete/chat-autocomplete/ChatTextAreaAutocomplete.ts` (+0, -11)
- `packages/kilo-vscode/src/services/autocomplete/chat-autocomplete/__tests__/ChatTextAreaAutocomplete.spec.ts` (+0, -1)
- `packages/kilo-vscode/src/services/autocomplete/i18n/ar.ts` (+1, -3)
- `packages/kilo-vscode/src/services/autocomplete/i18n/ca.ts` (+1, -3)
- `packages/kilo-vscode/src/services/autocomplete/i18n/cs.ts` (+1, -3)
- `packages/kilo-vscode/src/services/autocomplete/i18n/de.ts` (+1, -3)
- `packages/kilo-vscode/src/services/autocomplete/i18n/en.ts` (+1, -3)
- `packages/kilo-vscode/src/services/autocomplete/i18n/es.ts` (+1, -3)
- `packages/kilo-vscode/src/services/autocomplete/i18n/fr.ts` (+1, -3)
- `packages/kilo-vscode/src/services/autocomplete/i18n/hi.ts` (+1, -3)
- `packages/kilo-vscode/src/services/autocomplete/i18n/id.ts` (+1, -3)
- `packages/kilo-vscode/src/services/autocomplete/i18n/it.ts` (+1, -3)
- `packages/kilo-vscode/src/services/autocomplete/i18n/ja.ts` (+1, -3)
- `packages/kilo-vscode/src/services/autocomplete/i18n/ko.ts` (+1, -3)
- `packages/kilo-vscode/src/services/autocomplete/i18n/nl.ts` (+1, -3)
- `packages/kilo-vscode/src/services/autocomplete/i18n/pl.ts` (+1, -3)
- `packages/kilo-vscode/src/services/autocomplete/i18n/pt-BR.ts` (+1, -3)
- `packages/kilo-vscode/src/services/autocomplete/i18n/ru.ts` (+1, -3)
- `packages/kilo-vscode/src/services/autocomplete/i18n/sk.ts` (+1, -3)
- `packages/kilo-vscode/src/services/autocomplete/i18n/th.ts` (+1, -3)
- `packages/kilo-vscode/src/services/autocomplete/i18n/tr.ts` (+1, -3)
- `packages/kilo-vscode/src/services/autocomplete/i18n/uk.ts` (+1, -3)
- `packages/kilo-vscode/src/services/autocomplete/i18n/vi.ts` (+1, -3)
- `packages/kilo-vscode/src/services/autocomplete/i18n/zh-CN.ts` (+1, -3)
- `packages/kilo-vscode/src/services/autocomplete/i18n/zh-TW.ts` (+1, -3)
- `packages/kilo-vscode/src/services/autocomplete/types.ts` (+0, -1)
- `packages/kilo-vscode/src/services/code-actions/register-code-actions.ts` (+1, -2)
- `packages/kilo-vscode/src/services/code-actions/register-terminal-actions.ts` (+71, -19)
- `packages/kilo-vscode/src/services/marketplace/api.ts` (+146, -0)
- `packages/kilo-vscode/src/services/marketplace/detection.ts` (+82, -0)
- `packages/kilo-vscode/src/services/marketplace/index.ts` (+72, -0)
- `packages/kilo-vscode/src/services/marketplace/installer.ts` (+368, -0)
- `packages/kilo-vscode/src/services/marketplace/paths.ts` (+25, -0)
- `packages/kilo-vscode/src/services/marketplace/types.ts` (+84, -0)
- `packages/kilo-vscode/src/services/telemetry/types.ts` (+2, -0)
- `packages/kilo-vscode/tests/permission-dock-dropdown.spec.ts` (+278, -0)
- `packages/kilo-vscode/tests/permission-dock-dropdown.spec.ts-snapshots/permission-dock-dropdown/bash-expanded-pending-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/permission-dock-dropdown.spec.ts-snapshots/permission-dock-dropdown/bash-rule-approved-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/permission-dock-dropdown.spec.ts-snapshots/permission-dock-dropdown/bash-rule-denied-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/permission-dock-dropdown.spec.ts-snapshots/permission-dock-dropdown/bash-rules-mixed-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/permission-dock-dropdown.spec.ts-snapshots/permission-dock-dropdown/edit-expanded-pending-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/permission-dock-dropdown.spec.ts-snapshots/permission-dock-dropdown/external-dir-expanded-pending-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/permission-dock-dropdown.spec.ts-snapshots/permission-dock-dropdown/glob-expanded-pending-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/permission-dock-dropdown.spec.ts-snapshots/permission-dock-dropdown/glob-rule-approved-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/permission-dock-dropdown.spec.ts-snapshots/permission-dock-dropdown/many-rules-expanded-pending-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/permission-dock-dropdown.spec.ts-snapshots/permission-dock-dropdown/many-rules-mixed-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/permission-dock-dropdown.spec.ts-snapshots/permission-dock-dropdown/subagent-expanded-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/permission-dock-dropdown.spec.ts-snapshots/permission-dock-dropdown/websearch-expanded-pending-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/permission-dock-dropdown.spec.ts-snapshots/permission-dock-dropdown/write-expanded-pending-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/setup/vscode-mock.ts` (+8, -0)
- `packages/kilo-vscode/tests/unit/extension-arch.test.ts` (+86, -0)
- `packages/kilo-vscode/tests/unit/i18n-keys.test.ts` (+407, -0)
- `packages/kilo-vscode/tests/unit/i18n-shim.test.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/image-preview.test.ts` (+61, -0)
- `packages/kilo-vscode/tests/unit/kilo-provider-utils.test.ts` (+1, -0)
- `packages/kilo-vscode/tests/unit/kilo-ui-contract.test.ts` (+9, -3)
- `packages/kilo-vscode/tests/unit/model-selector-utils.test.ts` (+0, -15)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/agentmanager/diff-panel-with-diffs-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/chat/chat-view-idle-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/chat/chat-view-with-messages-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/chat/question-dock-many-options-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/chat/question-dock-multi-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/chat/question-dock-single-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/chat/task-header-with-todos-all-done-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/chat/task-header-with-todos-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/components-shell/shell-execution-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/composite-webview/bash-with-permission-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/composite-webview/glob-with-permission-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/composite-webview/mcp-tool-cards-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/composite-webview/mcp-tool-expanded-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/composite-webview/multiple-tool-calls-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/composite-webview/permission-dock-bash-many-rules-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/composite-webview/permission-dock-edit-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/composite-webview/permission-dock-external-dir-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/composite-webview/permission-dock-subagent-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/composite-webview/permission-dock-todo-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/composite-webview/permission-dock-websearch-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/composite-webview/permission-dock-write-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/composite-webview/question-above-chatbox-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/composite-webview/todo-write-completed-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/composite-webview/todo-write-with-permission-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/composite-webview/tool-cards-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/history-sessionlist/with-items-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/marketplace/installed-mcp-card-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/marketplace/installed-mode-card-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/marketplace/installed-skill-card-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/marketplace/mcp-tab-empty-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/marketplace/mcp-tab-with-installed-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/marketplace/mcp-tab-with-items-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/marketplace/modes-tab-empty-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/marketplace/modes-tab-with-installed-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/marketplace/modes-tab-with-items-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/marketplace/single-mcp-card-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/marketplace/single-mode-card-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/marketplace/single-skill-card-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/marketplace/skills-tab-empty-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/marketplace/skills-tab-with-installed-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/marketplace/skills-tab-with-items-chromium-linux.png` (+3, -0)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/prompt-input/default-200-chromium-linux.png` (+1, -1)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/prompt-input/default-420-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/prompt-input/with-model-override-200-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/prompt-input/with-model-override-420-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/prompt-input/with-thinking-200-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/prompt-input/with-thinking-420-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/tests/visual-regression.spec.ts-snapshots/settings/agent-behaviour-agents-chromium-linux.png` (+2, -2)
- `packages/kilo-vscode/webview-ui/agent-manager/NewWorktreeDialog.tsx` (+8, -1)
- `packages/kilo-vscode/webview-ui/agent-manager/agent-manager.css` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/App.tsx` (+7, -20)
- `packages/kilo-vscode/webview-ui/src/components/chat/ChatView.tsx` (+3, -3)
- `packages/kilo-vscode/webview-ui/src/components/chat/MessageList.tsx` (+35, -10)
- `packages/kilo-vscode/webview-ui/src/components/chat/PermissionDock.tsx` (+57, -64)
- `packages/kilo-vscode/webview-ui/src/components/chat/PromptInput.tsx` (+51, -11)
- `packages/kilo-vscode/webview-ui/src/components/chat/QuestionDock.tsx` (+232, -150)
- `packages/kilo-vscode/webview-ui/src/components/chat/RevertBanner.tsx` (+74, -0)
- `packages/kilo-vscode/webview-ui/src/components/chat/TaskHeader.tsx` (+1, -1)
- `packages/kilo-vscode/webview-ui/src/components/chat/VscodeSessionTurn.tsx` (+9, -1)
- `packages/kilo-vscode/webview-ui/src/components/history/SessionList.tsx` (+15, -0)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/InstallModal.tsx` (+206, -0)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/ItemCard.tsx` (+99, -0)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/MarketplaceListView.tsx` (+151, -0)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/MarketplaceView.tsx` (+204, -0)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/RemoveDialog.tsx` (+35, -0)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/index.ts` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/marketplace.css` (+286, -0)
- `packages/kilo-vscode/webview-ui/src/components/marketplace/utils.ts` (+20, -0)
- `packages/kilo-vscode/webview-ui/src/components/settings/AgentBehaviourTab.tsx` (+134, -33)
- `packages/kilo-vscode/webview-ui/src/components/settings/DisplayTab.tsx` (+6, -1)
- `packages/kilo-vscode/webview-ui/src/components/settings/ExperimentalTab.tsx` (+19, -1)
- `packages/kilo-vscode/webview-ui/src/components/settings/Settings.tsx` (+29, -2)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModeSwitcher.tsx` (+10, -1)
- `packages/kilo-vscode/webview-ui/src/components/shared/ModelSelector.tsx` (+34, -14)
- `packages/kilo-vscode/webview-ui/src/components/shared/ThinkingSelector.tsx` (+1, -0)
- `packages/kilo-vscode/webview-ui/src/components/shared/model-selector-utils.ts` (+2, -2)
- `packages/kilo-vscode/webview-ui/src/context/session-queue.ts` (+25, -0)
- `packages/kilo-vscode/webview-ui/src/context/session.tsx` (+233, -35)
- `packages/kilo-vscode/webview-ui/src/hooks/useImageAttachments.ts` (+3, -0)
- `packages/kilo-vscode/webview-ui/src/i18n/ar.ts` (+33, -6)
- `packages/kilo-vscode/webview-ui/src/i18n/br.ts` (+34, -6)
- `packages/kilo-vscode/webview-ui/src/i18n/bs.ts` (+31, -4)
- `packages/kilo-vscode/webview-ui/src/i18n/da.ts` (+33, -6)
- `packages/kilo-vscode/webview-ui/src/i18n/de.ts` (+35, -6)
- `packages/kilo-vscode/webview-ui/src/i18n/en.ts` (+27, -5)
- `packages/kilo-vscode/webview-ui/src/i18n/es.ts` (+34, -6)
- `packages/kilo-vscode/webview-ui/src/i18n/fr.ts` (+34, -6)
- `packages/kilo-vscode/webview-ui/src/i18n/ja.ts` (+33, -6)
- `packages/kilo-vscode/webview-ui/src/i18n/ko.ts` (+33, -6)
- `packages/kilo-vscode/webview-ui/src/i18n/no.ts` (+34, -6)
- `packages/kilo-vscode/webview-ui/src/i18n/pl.ts` (+33, -6)
- `packages/kilo-vscode/webview-ui/src/i18n/ru.ts` (+33, -6)
- `packages/kilo-vscode/webview-ui/src/i18n/th.ts` (+33, -6)
- `packages/kilo-vscode/webview-ui/src/i18n/zh.ts` (+30, -6)
- `packages/kilo-vscode/webview-ui/src/i18n/zht.ts` (+28, -4)
- `packages/kilo-vscode/webview-ui/src/stories/StoryProviders.tsx` (+5, -0)
- `packages/kilo-vscode/webview-ui/src/stories/chat.stories.tsx` (+32, -0)
- `packages/kilo-vscode/webview-ui/src/stories/composite.stories.tsx` (+251, -1)
- `packages/kilo-vscode/webview-ui/src/stories/marketplace.stories.tsx` (+544, -0)
- `packages/kilo-vscode/webview-ui/src/styles/chat.css` (+407, -70)
- `packages/kilo-vscode/webview-ui/src/types/marketplace.ts` (+62, -0)
- `packages/kilo-vscode/webview-ui/src/types/messages.ts` (+162, -5)
- `packages/kilo-vscode/webview-ui/src/utils/id.ts` (+60, -0)
- `packages/opencode/package.json` (+4, -1)
- `packages/opencode/script/build.ts` (+43, -35)
- `packages/opencode/script/publish.ts` (+7, -6)
- `packages/opencode/src/acp/agent.ts` (+2, -1)
- `packages/opencode/src/cli/cmd/auth.ts` (+84, -47)
- `packages/opencode/src/cli/cmd/debug/lsp.ts` (+2, -1)
- `packages/opencode/src/cli/cmd/generate.ts` (+10, -0)
- `packages/opencode/src/cli/cmd/github.ts` (+3, -2)
- `packages/opencode/src/cli/cmd/run.ts` (+2, -1)
- `packages/opencode/src/cli/cmd/session.ts` (+3, -2)
- `packages/opencode/src/cli/cmd/tui/routes/session/index.tsx` (+19, -2)
- `packages/opencode/src/cli/cmd/tui/routes/session/permission.tsx` (+2, -2)
- `packages/opencode/src/cli/cmd/tui/thread.ts` (+2, -1)
- `packages/opencode/src/cli/cmd/tui/util/clipboard.ts` (+5, -4)
- `packages/opencode/src/cli/cmd/tui/worker.ts` (+3, -2)
- `packages/opencode/src/cli/ui.ts` (+3, -3)
- `packages/opencode/src/config/config.ts` (+56, -22)
- `packages/opencode/src/config/migrate-tui-config.ts` (+3, -3)
- `packages/opencode/src/file/index.ts` (+21, -13)
- `packages/opencode/src/file/ripgrep.ts` (+2, -1)
- `packages/opencode/src/format/formatter.ts` (+22, -21)
- `packages/opencode/src/index.ts` (+5, -0)
- `packages/opencode/src/kilocode/bash-hierarchy.ts` (+29, -0)
- `packages/opencode/src/kilocode/enhance-prompt.ts` (+24, -38)
- `packages/opencode/src/kilocode/ts-check.ts` (+170, -0)
- `packages/opencode/src/kilocode/ts-client.ts` (+95, -0)
- `packages/opencode/src/lsp/index.ts` (+21, -0)
- `packages/opencode/src/lsp/server.ts` (+60, -60)
- `packages/opencode/src/mcp/oauth-callback.ts` (+7, -15)
- `packages/opencode/src/plugin/codex.ts` (+3, -1)
- `packages/opencode/src/plugin/copilot.ts` (+4, -3)
- `packages/opencode/src/project/project.ts` (+2, -1)
- `packages/opencode/src/provider/models.ts` (+1, -0)
- `packages/opencode/src/provider/provider.ts` (+7, -6)
- `packages/opencode/src/provider/transform.ts` (+45, -0)
- `packages/opencode/src/server/routes/global.ts` (+1, -0)
- `packages/opencode/src/server/routes/kilocode.ts` (+74, -0)
- `packages/opencode/src/server/routes/permission.ts` (+10, -10)
- `packages/opencode/src/server/server.ts` (+21, -15)
- `packages/opencode/src/shell/shell.ts` (+6, -4)
- `packages/opencode/src/skill/skill.ts` (+24, -0)
- `packages/opencode/src/snapshot/index.ts` (+5, -5)
- `packages/opencode/src/util/hash.ts` (+7, -0)
- `packages/opencode/src/util/which.ts` (+10, -0)
- `packages/opencode/src/worktree/index.ts` (+8, -1)
- `packages/opencode/test/file/fsmonitor.test.ts` (+62, -0)
- `packages/opencode/test/fixture/fixture.test.ts` (+26, -0)
- `packages/opencode/test/fixture/fixture.ts` (+29, -3)
- `packages/opencode/test/kilocode/bash-hierarchy.test.ts` (+64, -0)
- `packages/opencode/test/preload.ts` (+2, -1)
- `packages/opencode/test/project/worktree-remove.test.ts` (+31, -0)
- `packages/opencode/test/pty/pty-output-isolation.test.ts` (+4, -3)
- `packages/opencode/test/session/retry.test.ts` (+2, -1)
- `packages/opencode/test/util/which.test.ts` (+82, -0)
- `packages/plugin/package.json` (+7, -7)
- `packages/plugin/tsconfig.json` (+2, -1)
- `packages/script/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+4, -16)
- `packages/sdk/js/src/v2/gen/sdk.gen.ts` (+120, -31)
- `packages/sdk/js/src/v2/gen/types.gen.ts` (+81, -14)
- `packages/sdk/js/tsconfig.json` (+1, -0)
- `packages/sdk/openapi.json` (+174, -33)
- `packages/storybook/package.json` (+1, -1)
- `packages/ui/package.json` (+2, -1)
- `packages/ui/src/components/basic-tool.tsx` (+37, -2)
- `packages/ui/src/components/file-icon.css` (+1, -0)
- `packages/ui/src/components/file-icon.tsx` (+7, -10)
- `packages/ui/src/components/icon.tsx` (+1, -0)
- `packages/ui/src/components/markdown.tsx` (+64, -14)
- `packages/ui/src/components/message-nav.css` (+1, -1)
- `packages/ui/src/components/message-nav.tsx` (+15, -10)
- `packages/ui/src/components/message-part.css` (+40, -0)
- `packages/ui/src/components/message-part.tsx` (+148, -6)
- `packages/ui/src/components/session-review.tsx` (+0, -2)
- `packages/ui/src/components/session-turn.css` (+2, -12)
- `packages/ui/src/components/tabs.css` (+5, -5)
- `packages/ui/src/components/tooltip.tsx` (+1, -1)
- `packages/ui/src/context/marked.tsx` (+172, -2)
- `packages/ui/src/i18n/ar.ts` (+3, -1)
- `packages/ui/src/i18n/br.ts` (+3, -2)
- `packages/ui/src/i18n/bs.ts` (+3, -2)
- `packages/ui/src/i18n/da.ts` (+3, -2)
- `packages/ui/src/i18n/de.ts` (+3, -2)
- `packages/ui/src/i18n/en.ts` (+3, -1)
- `packages/ui/src/i18n/es.ts` (+3, -2)
- `packages/ui/src/i18n/fr.ts` (+3, -2)
- `packages/ui/src/i18n/ja.ts` (+3, -2)
- `packages/ui/src/i18n/ko.ts` (+3, -1)
- `packages/ui/src/i18n/no.ts` (+3, -2)
- `packages/ui/src/i18n/pl.ts` (+3, -2)
- `packages/ui/src/i18n/ru.ts` (+3, -2)
- `packages/ui/src/i18n/th.ts` (+3, -1)
- `packages/ui/src/i18n/tr.ts` (+3, -0)
- `packages/ui/src/i18n/zh.ts` (+3, -1)
- `packages/ui/src/i18n/zht.ts` (+3, -1)
- `packages/util/package.json` (+1, -1)
- `script/publish.ts` (+5, -0)
- `script/upstream/merge.ts` (+111, -5)
- `script/upstream/package.json` (+1, -1)
- `script/upstream/transforms/transform-extensions.ts` (+8, -1)
- `script/upstream/transforms/transform-i18n.ts` (+9, -0)
- `script/upstream/transforms/transform-package-json.ts` (+26, -4)
- `script/upstream/transforms/transform-scripts.ts` (+8, -1)
- `script/upstream/transforms/transform-take-theirs.ts` (+8, -1)
- `script/upstream/transforms/transform-tauri.ts` (+8, -1)
- `script/upstream/transforms/transform-web.ts` (+8, -1)
- `script/upstream/utils/config.ts` (+6, -1)
- `script/upstream/utils/git.ts` (+124, -0)
- `script/upstream/utils/report.ts` (+53, -2)
- `sdks/vscode/package.json` (+4, -2)
- `turbo.json` (+1, -1)

### Key Diffs

#### packages/opencode/src/agent/agent.ts
```diff
diff --git a/packages/opencode/src/agent/agent.ts b/packages/opencode/src/agent/agent.ts
index 509568b3..ceb52d37 100644
--- a/packages/opencode/src/agent/agent.ts
+++ b/packages/opencode/src/agent/agent.ts
@@ -16,7 +16,10 @@ import PROMPT_ASK from "./prompt/ask.txt"
 import PROMPT_ORCHESTRATOR from "./prompt/orchestrator.txt"
 import PROMPT_SUMMARY from "./prompt/summary.txt"
 import PROMPT_TITLE from "./prompt/title.txt"
+
 import { PermissionNext } from "@/permission/next"
+import { NamedError } from "@opencode-ai/util/error" // kilocode_change
+import { Glob } from "../util/glob" // kilocode_change
 import { mergeDeep, pipe, sortBy, values } from "remeda"
 import { Global } from "@/global"
 import path from "path"
@@ -158,6 +161,7 @@ export namespace Agent {
             webfetch: "allow",
             websearch: "allow",
             codesearch: "allow",
+            codebase_search: "allow", // kilocode_change
             external_directory: {
               [Truncate.GLOB]: "allow",
             },
@@ -190,6 +194,7 @@ export namespace Agent {
             webfetch: "allow",
             websearch: "allow",
             codesearch: "allow",
+            codebase_search: "allow", // kilocode_change
             external_directory: {
               [Truncate.GLOB]: "allow",
             },
@@ -227,6 +232,7 @@ export namespace Agent {
             webfetch: "allow",
             websearch: "allow",
             codesearch: "allow",
+            codebase_search: "allow", // kilocode_change
             read: "allow",
             external_directory: {
               "*": "ask",
@@ -236,7 +242,10 @@ export namespace Agent {
           user,
         ),
         description: `Fast agent specialized for exploring codebases. Use this when you need to quickly find files by patterns (eg. "src/components/**/*.tsx"), search code for keywords (eg. "API endpoints"), or answer questions about the codebase (eg. "how do API endpoints work?"). When calling this agent, specify the desired thoroughness level: "quick" for basic searches, "medium" for moderate exploration, or "very thorough" for comprehensive analysis across multiple locations and naming conventions.`,
-        prompt: PROMPT_EXPLORE,
+        // kilocode_change - only advertise codebase_search when the experimental flag is on
+        prompt: cfg.experimental?.codebase_search
+          ? `Prefer using the codebase_search tool for codebase searches — it performs intelligent multi-step code search and returns the most relevant code spans.\n\n${PROMPT_EXPLORE}`
+          : PROMPT_EXPLORE,
         options: {},
         mode: "subagent",
```

#### packages/opencode/src/permission/next.ts
```diff
diff --git a/packages/opencode/src/permission/next.ts b/packages/opencode/src/permission/next.ts
index 7f848474..bf96d6a3 100644
--- a/packages/opencode/src/permission/next.ts
+++ b/packages/opencode/src/permission/next.ts
@@ -65,6 +65,52 @@ export namespace PermissionNext {
     return rulesets.flat()
   }
 
+  // kilocode_change start — inverse of fromConfig: convert rules back to config format
+  /**
+   * Permissions typed as PermissionAction in the config schema (scalar-only).
+   * These must be serialized as "allow"/"deny"/"ask", not as { "*": "allow" }.
+   */
+  const SCALAR_ONLY_PERMISSIONS = new Set([
+    "todowrite",
+    "todoread",
+    "question",
+    "webfetch",
+    "websearch",
+    "codesearch",
+    "doom_loop",
+  ])
+
+  export function toConfig(rules: Ruleset): Config.Permission {
+    const result: Config.Permission = {}
+    for (const rule of rules) {
+      const existing = result[rule.permission]
+
+      // Scalar-only permissions (e.g. websearch, todowrite, doom_loop) only
+      // accept PermissionAction ("allow"/"deny"/"ask"), not object form.
+      // Use scalar format for "*"; skip non-wildcard patterns (they can't be
+      // represented in the config schema — they only work in-memory).
+      if (SCALAR_ONLY_PERMISSIONS.has(rule.permission)) {
+        if (rule.pattern === "*") result[rule.permission] = rule.action
+        continue
+      }
+
+      if (existing === undefined) {
+        // Use object format to avoid replacing existing granular rules
+        // when merged via updateGlobal (e.g. { read: "allow" } would wipe
+        // { read: { "*": "ask", "src/*": "allow" } })
+        result[rule.permission] = { [rule.pattern]: rule.action }
+        continue
+      }
+      if (typeof existing === "string") {
+        result[rule.permission] = { "*": existing, [rule.pattern]: rule.action }
+        continue
+      }
+      existing[rule.pattern] = rule.action
+    }
```

#### packages/opencode/src/tool/bash.ts
```diff
diff --git a/packages/opencode/src/tool/bash.ts b/packages/opencode/src/tool/bash.ts
index 0e55225b..9871d307 100644
--- a/packages/opencode/src/tool/bash.ts
+++ b/packages/opencode/src/tool/bash.ts
@@ -16,6 +16,7 @@ import { Flag } from "@/flag/flag.ts"
 import { Shell } from "@/shell/shell"
 
 import { BashArity } from "@/permission/arity"
+import { BashHierarchy } from "@/kilocode/bash-hierarchy" // kilocode_change
 import { Truncate } from "./truncation"
 import { Plugin } from "@/plugin"
 
@@ -90,6 +91,7 @@ export const BashTool = Tool.define("bash", async () => {
       if (!Instance.containsPath(cwd)) directories.add(cwd)
       const patterns = new Set<string>()
       const always = new Set<string>()
+      const rules = new Set<string>() // kilocode_change — hierarchy rules for permissions "npm", "npm install", "npm install lodash"
 
       for (const node of tree.rootNode.descendantsOfType("command")) {
         if (!node) continue
@@ -139,6 +141,7 @@ export const BashTool = Tool.define("bash", async () => {
         if (command.length && command[0] !== "cd") {
           patterns.add(commandText)
           always.add(BashArity.prefix(command).join(" ") + " *")
+          BashHierarchy.addAll(rules, command, commandText) // kilocode_change
         }
       }
 
@@ -161,7 +164,7 @@ export const BashTool = Tool.define("bash", async () => {
           permission: "bash",
           patterns: Array.from(patterns),
           always: Array.from(always),
-          metadata: { command: params.command }, // kilocode_change
+          metadata: { command: params.command, rules: Array.from(rules) }, // kilocode_change
         })
       }
 
```

#### packages/opencode/src/tool/registry.ts
```diff
diff --git a/packages/opencode/src/tool/registry.ts b/packages/opencode/src/tool/registry.ts
index f06dc978..3c05ef92 100644
--- a/packages/opencode/src/tool/registry.ts
+++ b/packages/opencode/src/tool/registry.ts
@@ -22,6 +22,7 @@ import z from "zod"
 import { Plugin } from "../plugin"
 import { WebSearchTool } from "./websearch"
 import { CodeSearchTool } from "./codesearch"
+import { CodebaseSearchTool } from "./warpgrep" // kilocode_change
 import { Flag } from "@/flag/flag"
 import { Log } from "@/util/log"
 import { LspTool } from "./lsp"
@@ -115,6 +116,7 @@ export namespace ToolRegistry {
       // TodoReadTool,
       WebSearchTool,
       CodeSearchTool,
+      ...(config.experimental?.codebase_search === true ? [CodebaseSearchTool] : []), // kilocode_change
       SkillTool,
       ApplyPatchTool,
       ...(Flag.KILO_EXPERIMENTAL_LSP_TOOL ? [LspTool] : []),
```

#### packages/opencode/src/tool/warpgrep.ts
```diff
diff --git a/packages/opencode/src/tool/warpgrep.ts b/packages/opencode/src/tool/warpgrep.ts
new file mode 100644
index 00000000..5e9bc43d
--- /dev/null
+++ b/packages/opencode/src/tool/warpgrep.ts
@@ -0,0 +1,97 @@
+import z from "zod"
+import { Tool } from "./tool"
+import { WarpGrepClient } from "@morphllm/morphsdk"
+import { Instance } from "../project/instance"
+import { Bus } from "../bus"
+import { TuiEvent } from "../cli/cmd/tui/event"
+import DESCRIPTION from "./warpgrep.txt"
+
+// FREE_PERIOD_TODO: Remove KILO_WARPGREP_PROXY_URL constant and the proxy
+// fallback below. After the free period ends, require MORPH_API_KEY and
+// return an error when it is missing.
+const KILO_WARPGREP_PROXY_URL = "https://api.kilo.ai/api/gateway"
+
+export const CodebaseSearchTool = Tool.define("codebase_search", {
+  description: DESCRIPTION,
+  parameters: z.object({
+    query: z
+      .string()
+      .describe(
+        "Search query describing what code you are looking for. Be specific and descriptive for best results.",
+      ),
+  }),
+  async execute(params, ctx) {
+    await ctx.ask({
+      permission: "codebase_search",
+      patterns: [params.query],
+      always: ["*"],
+      metadata: { query: params.query },
+    })
+
+    const apiKey = process.env["MORPH_API_KEY"]
+
+    // FREE_PERIOD_TODO: Remove proxy fallback — require apiKey, error if missing:
+    //   if (!apiKey) return { title: ..., output: "Set MORPH_API_KEY to use codebase search.", metadata: {} }
+    const client = new WarpGrepClient({
+      morphApiKey: apiKey ?? "kilo-free",
+      ...(apiKey ? {} : { morphApiUrl: KILO_WARPGREP_PROXY_URL }),
+      timeout: 60_000,
+    })
+
+    const result = await client.execute({
+      searchTerm: params.query,
+      repoRoot: Instance.directory,
+    })
```


*... and more files (showing first 5)*

## opencode Changes (2a20822..2a20822)

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

- `src/agent/index.ts` - incorporate new agent patterns from packages/opencode/src/agent/agent.ts
- `src/permission/` - review permission changes from packages/opencode/src/permission/next.ts
- `src/permission/` - review permission changes from packages/opencode/test/permission/next.always-rules.test.ts
- `src/permission/` - review permission changes from packages/opencode/test/permission/next.pattern-rules.test.ts
- `src/permission/` - review permission changes from packages/opencode/test/permission/next.toConfig.test.ts
- `src/tool/bash.test.ts` - update based on kilocode packages/opencode/test/tool/bash.test.ts changes
- `src/tool/bash.ts` - update based on kilocode packages/opencode/src/tool/bash.ts changes
- `src/tool/registry.ts` - update based on kilocode packages/opencode/src/tool/registry.ts changes
- `src/tool/warpgrep.ts` - update based on kilocode packages/opencode/src/tool/warpgrep.ts changes
- `src/tool/warpgrep.txt.ts` - update based on kilocode packages/opencode/src/tool/warpgrep.txt changes
