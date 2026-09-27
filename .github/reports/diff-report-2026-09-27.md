# Upstream Changes Report
Generated: 2026-09-27 11:32:45

## Summary
- kilocode: 6 commits, 1 files changed
- opencode: 3 commits, 58 files changed

## kilocode Changes (c26779478..7d977bce9)

### Commits

- 7d977bce9 - Merge pull request #14526 from Kilo-Org/docs/auto-sync/gateway (Joshua Lambert, 2026-09-26)
- 5003a7dd5 - Apply suggestion from @lambertjosh (Joshua Lambert, 2026-09-26)
- 9052be104 - Merge remote-tracking branch 'origin/main' into HEAD (github-actions[bot], 2026-09-26)
- 5fdde29a2 - docs: sync gateway with merged PRs (2026-09-25) (github-actions[bot], 2026-09-25)
- 5c2b46e5c - Merge remote-tracking branch 'origin/main' into HEAD (github-actions[bot], 2026-09-25)
- c3dd7453b - docs: sync gateway with merged PRs (2026-09-24) (github-actions[bot], 2026-09-24)

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
- `packages/kilo-docs/pages/gateway/api-reference.md` (+25, -0)

### Key Diffs

(no key diffs to show)

## opencode Changes (696f41b..b471c2b)

### Commits

- b471c2b - fix(opencode): catch completed MCP browser launcher failures (#51538) (opencode-agent[bot], 2026-09-26)
- a42f393 - docs(web): link kimaki to product website (#49735) (Tommy D. Rossi, 2026-09-26)
- b65de4d - docs(go): add LongCat 2.5 Preview Free to V1 pages (#51488) (Jack, 2026-09-26)

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
- `packages/console/app/src/component/go-models.ts` (+9, -0)
- `packages/console/app/src/routes/go/index.tsx` (+1, -0)
- `packages/opencode/src/mcp/browser.ts` (+5, -2)
- `packages/opencode/test/mcp/browser.test.ts` (+36, -0)
- `packages/web/src/content/docs/ar/ecosystem.mdx` (+1, -1)
- `packages/web/src/content/docs/ar/go.mdx` (+7, -0)
- `packages/web/src/content/docs/ar/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/bs/ecosystem.mdx` (+1, -1)
- `packages/web/src/content/docs/bs/go.mdx` (+7, -0)
- `packages/web/src/content/docs/bs/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/da/ecosystem.mdx` (+1, -1)
- `packages/web/src/content/docs/da/go.mdx` (+7, -0)
- `packages/web/src/content/docs/da/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/de/ecosystem.mdx` (+1, -1)
- `packages/web/src/content/docs/de/go.mdx` (+7, -0)
- `packages/web/src/content/docs/de/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/ecosystem.mdx` (+1, -1)
- `packages/web/src/content/docs/es/ecosystem.mdx` (+1, -1)
- `packages/web/src/content/docs/es/go.mdx` (+7, -0)
- `packages/web/src/content/docs/es/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/fr/ecosystem.mdx` (+1, -1)
- `packages/web/src/content/docs/fr/go.mdx` (+7, -0)
- `packages/web/src/content/docs/fr/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/go.mdx` (+7, -0)
- `packages/web/src/content/docs/it/ecosystem.mdx` (+1, -1)
- `packages/web/src/content/docs/it/go.mdx` (+7, -0)
- `packages/web/src/content/docs/it/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/ja/ecosystem.mdx` (+1, -1)
- `packages/web/src/content/docs/ja/go.mdx` (+7, -0)
- `packages/web/src/content/docs/ja/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/ko/ecosystem.mdx` (+1, -1)
- `packages/web/src/content/docs/ko/go.mdx` (+7, -0)
- `packages/web/src/content/docs/ko/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/nb/ecosystem.mdx` (+1, -1)
- `packages/web/src/content/docs/nb/go.mdx` (+7, -0)
- `packages/web/src/content/docs/nb/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/pl/ecosystem.mdx` (+1, -1)
- `packages/web/src/content/docs/pl/go.mdx` (+7, -0)
- `packages/web/src/content/docs/pl/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/pt-br/ecosystem.mdx` (+1, -1)
- `packages/web/src/content/docs/pt-br/go.mdx` (+7, -0)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/ru/ecosystem.mdx` (+1, -1)
- `packages/web/src/content/docs/ru/go.mdx` (+7, -0)
- `packages/web/src/content/docs/ru/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/th/ecosystem.mdx` (+1, -1)
- `packages/web/src/content/docs/th/go.mdx` (+7, -0)
- `packages/web/src/content/docs/th/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/tr/ecosystem.mdx` (+1, -1)
- `packages/web/src/content/docs/tr/go.mdx` (+7, -0)
- `packages/web/src/content/docs/tr/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/zh-cn/ecosystem.mdx` (+1, -1)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+7, -0)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+3, -0)
- `packages/web/src/content/docs/zh-tw/ecosystem.mdx` (+1, -1)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+7, -0)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+3, -0)

### Key Diffs

(no key diffs to show)

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- No specific recommendations - review changes manually
