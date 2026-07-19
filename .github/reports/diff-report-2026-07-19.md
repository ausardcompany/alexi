# Upstream Changes Report
Generated: 2026-07-19 08:20:11

## Summary
- kilocode: 0 commits, 0 files changed
- opencode: 12 commits, 72 files changed

## kilocode Changes (938919ab7..938919ab7)

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

## opencode Changes (fab2133..f557328)

### Commits

- f557328 - chore: generate (opencode-agent[bot], 2026-07-19)
- 4817228 - docs(go): update Kimi K3 request estimates (#37725) (opencode-agent[bot], 2026-07-19)
- 5a5117b - Merge branch 'dev' of github.com:anomalyco/opencode into dev (Frank, 2026-07-19)
- 6a28842 - go: support openai route (Frank, 2026-07-19)
- 573ac85 - feat(desktop): align new session project picker (#37461) (usrnk1, 2026-07-19)
- 1221bbb - Merge branch 'dev' of github.com:anomalyco/opencode into dev (Frank, 2026-07-19)
- 6bea0f4 - zen: grok 4.5 adjusted price (Frank, 2026-07-19)
- cc34084 - feat(desktop): prevent overlapping composer borders (#37490) (usrnk1, 2026-07-19)
- b8142c7 - chore: update nix node_modules hashes (opencode-agent[bot], 2026-07-18)
- ba3f966 - build: bump opentui to 0.4.5 (#37616) (Simon Klee, 2026-07-18)
- b95fe7b - fix(nix): restore desktop integration (#37197) (Jérôme Benoit, 2026-07-18)
- 9da9ed9 - fix(nix): relax Bun version check for desktop build (#36767) (Jérôme Benoit, 2026-07-18)

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
- `bun.lock` (+17, -17)
- `nix/desktop.nix` (+66, -33)
- `nix/hashes.json` (+4, -4)
- `package.json` (+3, -3)
- `packages/app/src/components/prompt-input-v2.tsx` (+2, -0)
- `packages/app/src/components/prompt-input.tsx` (+1, -1)
- `packages/app/src/components/prompt-workspace-selector.tsx` (+30, -18)
- `packages/app/src/i18n/ar.ts` (+1, -0)
- `packages/app/src/i18n/br.ts` (+1, -0)
- `packages/app/src/i18n/bs.ts` (+1, -0)
- `packages/app/src/i18n/da.ts` (+1, -0)
- `packages/app/src/i18n/de.ts` (+1, -0)
- `packages/app/src/i18n/en.ts` (+1, -0)
- `packages/app/src/i18n/es.ts` (+1, -0)
- `packages/app/src/i18n/fr.ts` (+1, -0)
- `packages/app/src/i18n/ja.ts` (+1, -0)
- `packages/app/src/i18n/ko.ts` (+1, -0)
- `packages/app/src/i18n/no.ts` (+1, -0)
- `packages/app/src/i18n/pl.ts` (+1, -0)
- `packages/app/src/i18n/ru.ts` (+1, -0)
- `packages/app/src/i18n/th.ts` (+1, -0)
- `packages/app/src/i18n/tr.ts` (+1, -0)
- `packages/app/src/i18n/uk.ts` (+1, -0)
- `packages/app/src/i18n/zh.ts` (+1, -0)
- `packages/app/src/i18n/zht.ts` (+1, -0)
- `packages/app/src/pages/new-session.tsx` (+8, -14)
- `packages/app/src/pages/session.tsx` (+1, -0)
- `packages/app/src/pages/session/composer/session-revert-dock.stories.tsx` (+9, -3)
- `packages/app/src/pages/session/composer/session-todo-dock.tsx` (+26, -5)
- `packages/cli/script/build.ts` (+1, -10)
- `packages/console/app/src/routes/go/index.tsx` (+2, -2)
- `packages/console/app/src/routes/zen/go/v1/responses.ts` (+14, -0)
- `packages/opencode/script/build.ts` (+13, -10)
- `packages/plugin/package.json` (+3, -3)
- `packages/session-ui/src/v2/components/prompt-input/index.tsx` (+7, -2)
- `packages/ui/src/components/dock-surface.css` (+14, -0)
- `packages/web/src/content/docs/ar/go.mdx` (+6, -5)
- `packages/web/src/content/docs/ar/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/bs/go.mdx` (+6, -5)
- `packages/web/src/content/docs/bs/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/da/go.mdx` (+6, -5)
- `packages/web/src/content/docs/da/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/de/go.mdx` (+6, -5)
- `packages/web/src/content/docs/de/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/es/go.mdx` (+6, -5)
- `packages/web/src/content/docs/es/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/fr/go.mdx` (+6, -5)
- `packages/web/src/content/docs/fr/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/go.mdx` (+6, -5)
- `packages/web/src/content/docs/it/go.mdx` (+6, -5)
- `packages/web/src/content/docs/it/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/ja/go.mdx` (+6, -5)
- `packages/web/src/content/docs/ja/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/ko/go.mdx` (+6, -5)
- `packages/web/src/content/docs/ko/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/nb/go.mdx` (+6, -5)
- `packages/web/src/content/docs/nb/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/pl/go.mdx` (+6, -5)
- `packages/web/src/content/docs/pl/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/pt-br/go.mdx` (+6, -5)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/ru/go.mdx` (+6, -5)
- `packages/web/src/content/docs/ru/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/th/go.mdx` (+6, -5)
- `packages/web/src/content/docs/th/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/tr/go.mdx` (+6, -5)
- `packages/web/src/content/docs/tr/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+6, -5)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+6, -5)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+2, -2)

### Key Diffs

(no key diffs to show)

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- No specific recommendations - review changes manually
