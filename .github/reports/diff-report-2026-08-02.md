# Upstream Changes Report
Generated: 2026-08-02 08:24:41

## Summary
- kilocode: 7 commits, 6 files changed
- opencode: 7 commits, 87 files changed

## kilocode Changes (0aabd47b5..c55440908)

### Commits

- c55440908 - fix(cli): preserve configured subagent routing (#12652) (Hardik Sharma, 2026-08-01)
- f08b78c7a - Merge pull request #12766 from Kilo-Org/jetbrains/release/v7.0.12 (Kirill Kalishev, 2026-08-01)
- 12a29f5f3 - docs(jetbrains): edit changelog for v7.0.12 (Kirill Kalishev, 2026-08-01)
- 3b6562466 - release(jetbrains): v7.0.12 (kilo-maintainer[bot], 2026-08-01)
- 190d9325c - Merge pull request #12765 from Kilo-Org/jetbrains/release/v7.0.12-rc.4 (Kirill Kalishev, 2026-08-01)
- 14efc8292 - docs(jetbrains): edit changelog for v7.0.12-rc.4 (Kirill Kalishev, 2026-08-01)
- 87fcc06a6 - release(jetbrains): v7.0.12-rc.4 (kilo-maintainer[bot], 2026-08-01)

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
- `.changeset/fair-subagents-route.md` (+5, -0)
- `packages/kilo-jetbrains/CHANGELOG.md` (+38, -0)
- `packages/kilo-jetbrains/gradle.properties` (+1, -1)
- `packages/opencode/src/config/config.ts` (+6, -2)
- `packages/opencode/src/kilocode/config/config.ts` (+29, -0)
- `packages/opencode/test/kilocode/agent-routing.test.ts` (+113, -0)

### Key Diffs

(no key diffs to show)

## opencode Changes (19231fc..1882c33)

### Commits

- 1882c33 - fix gemini reasoning tokens not counted (Frank, 2026-08-02)
- 01624c8 - chore: generate (opencode-agent[bot], 2026-08-02)
- 0891ecd - docs(go): update DeepSeek privacy policy (#40120) (Jack, 2026-08-02)
- 32f278b - Merge branch 'dev' of github.com:anomalyco/opencode into dev (Frank, 2026-08-01)
- bb6bec9 - zen: update doc (Frank, 2026-08-01)
- 0eac096 - sync release versions for v1.18.11 (opencode, 2026-08-01)
- f67e80c - fix(app): prevent stale prompt control reads (#39842) (OpeOginni, 2026-08-01)

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
- `packages/console/core/package.json` (+1, -1)
- `packages/core/package.json` (+1, -1)
- `packages/stats/core/package.json` (+1, -1)

#### Other Changes
- `bun.lock` (+28, -28)
- `packages/app/package.json` (+1, -1)
- `packages/cli/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/i18n/ar.ts` (+1, -0)
- `packages/console/app/src/i18n/br.ts` (+2, -0)
- `packages/console/app/src/i18n/da.ts` (+2, -0)
- `packages/console/app/src/i18n/de.ts` (+2, -0)
- `packages/console/app/src/i18n/en.ts` (+2, -0)
- `packages/console/app/src/i18n/es.ts` (+2, -0)
- `packages/console/app/src/i18n/fr.ts` (+2, -0)
- `packages/console/app/src/i18n/it.ts` (+2, -0)
- `packages/console/app/src/i18n/ja.ts` (+1, -0)
- `packages/console/app/src/i18n/ko.ts` (+1, -0)
- `packages/console/app/src/i18n/no.ts` (+2, -0)
- `packages/console/app/src/i18n/pl.ts` (+1, -0)
- `packages/console/app/src/i18n/ru.ts` (+2, -0)
- `packages/console/app/src/i18n/th.ts` (+1, -0)
- `packages/console/app/src/i18n/tr.ts` (+2, -0)
- `packages/console/app/src/i18n/uk.ts` (+1, -0)
- `packages/console/app/src/i18n/zh.ts` (+1, -0)
- `packages/console/app/src/i18n/zht.ts` (+1, -0)
- `packages/console/app/src/routes/go/index.tsx` (+4, -1)
- `packages/console/app/src/routes/zen/util/provider/google.ts` (+1, -1)
- `packages/console/function/package.json` (+1, -1)
- `packages/console/mail/package.json` (+1, -1)
- `packages/console/support/package.json` (+1, -1)
- `packages/desktop/package.json` (+1, -1)
- `packages/effect-drizzle-sqlite/package.json` (+1, -1)
- `packages/effect-sqlite-node/package.json` (+1, -1)
- `packages/enterprise/package.json` (+1, -1)
- `packages/function/package.json` (+1, -1)
- `packages/http-recorder/package.json` (+1, -1)
- `packages/llm/package.json` (+1, -1)
- `packages/opencode/package.json` (+1, -1)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/session-ui/src/v2/components/prompt-input/index.tsx` (+7, -7)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/server/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/ar/go.mdx` (+2, -1)
- `packages/web/src/content/docs/ar/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/bs/go.mdx` (+2, -1)
- `packages/web/src/content/docs/bs/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/da/go.mdx` (+2, -1)
- `packages/web/src/content/docs/da/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/de/go.mdx` (+20, -19)
- `packages/web/src/content/docs/de/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/es/go.mdx` (+2, -1)
- `packages/web/src/content/docs/es/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/fr/go.mdx` (+2, -1)
- `packages/web/src/content/docs/fr/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/go.mdx` (+2, -1)
- `packages/web/src/content/docs/it/go.mdx` (+2, -1)
- `packages/web/src/content/docs/it/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/ja/go.mdx` (+2, -1)
- `packages/web/src/content/docs/ja/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/ko/go.mdx` (+2, -1)
- `packages/web/src/content/docs/ko/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/nb/go.mdx` (+2, -1)
- `packages/web/src/content/docs/nb/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/pl/go.mdx` (+2, -1)
- `packages/web/src/content/docs/pl/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/pt-br/go.mdx` (+2, -1)
- `packages/web/src/content/docs/pt-br/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/ru/go.mdx` (+2, -1)
- `packages/web/src/content/docs/ru/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/th/go.mdx` (+2, -1)
- `packages/web/src/content/docs/th/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/tr/go.mdx` (+2, -1)
- `packages/web/src/content/docs/tr/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+2, -1)
- `packages/web/src/content/docs/zh-cn/zen.mdx` (+2, -2)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+2, -1)
- `packages/web/src/content/docs/zh-tw/zen.mdx` (+2, -2)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 63ba0a5..ea543f4 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.18.10",
+  "version": "1.18.11",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index a8a5041..babaec7 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.18.10",
+  "version": "1.18.11",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/stats/core/package.json
```diff
diff --git a/packages/stats/core/package.json b/packages/stats/core/package.json
index c139702..e02d8e1 100644
--- a/packages/stats/core/package.json
+++ b/packages/stats/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/stats-core",
-  "version": "1.18.10",
+  "version": "1.18.11",
   "private": true,
   "type": "module",
   "license": "MIT",
```


## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- No specific recommendations - review changes manually
