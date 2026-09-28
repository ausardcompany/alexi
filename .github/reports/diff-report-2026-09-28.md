# Upstream Changes Report
Generated: 2026-09-28 13:06:39

## Summary
- kilocode: 6 commits, 8 files changed
- opencode: 15 commits, 106 files changed

## kilocode Changes (7d977bce9..318a913a2)

### Commits

- 318a913a2 - Merge pull request #14592 from Kilo-Org/fix/gateway-optimistic-tool-support (Christiaan Arnoldus, 2026-09-28)
- 52729b6d8 - Merge pull request #14574 from Kilo-Org/fix/dependabot-auto-merge-title-regex (Bruno Agatão, 2026-09-28)
- c4506f7ef - fix(gateway): assume models with empty supported parameters support tools (Kilo Code Cloud, 2026-09-25)
- ee3e34961 - chore(security): relax auto-merge check to hourly (Bruno Agatao, 2026-09-25)
- 9ad55594e - docs(security): explain how Dependabot and the workflows interact (Bruno Agatao, 2026-09-25)
- ffa7968ff - fix(security): make auto-merge title match case-insensitive (Bruno Agatao, 2026-09-25)

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
- `.changeset/gateway-optimistic-tool-support.md` (+5, -0)
- `.github/workflows/README.md` (+23, -1)
- `.github/workflows/dependabot-auto-merge.yml` (+2, -2)
- `packages/kilo-gateway/src/api/models.ts` (+14, -6)
- `packages/kilo-gateway/src/index.ts` (+1, -0)
- `packages/kilo-gateway/test/api/models.test.ts` (+21, -0)
- `packages/opencode/src/kilocode/cloud/catalog.ts` (+2, -5)
- `packages/opencode/test/kilocode/cloud/defaults.test.ts` (+7, -2)

### Key Diffs

(no key diffs to show)

## opencode Changes (b471c2b..f416138)

### Commits

- f416138 - fix(console): fit Go page to mobile screens (#51855) (vprdev, 2026-09-28)
- 083ed26 - docs(go): simplify usage limit explanation (Frank, 2026-09-28)
- acb6859 - fix(stats): attribute usage from catalog identity (#51833) (Adam, 2026-09-28)
- 9f9e73a - chore: generate (opencode-agent[bot], 2026-09-28)
- c1919a3 - Merge branch 'dev' of github.com:anomalyco/opencode into dev (Frank, 2026-09-28)
- 482a1cd - doc: go plus (Frank, 2026-09-28)
- 725e4ba - feat(go): show Go Plus plans and limits (#51822) (Jack, 2026-09-28)
- fed9d78 - Merge branch 'dev' of github.com:anomalyco/opencode into dev (Frank, 2026-09-28)
- ddbeaa1 - doc: go plus (Frank, 2026-09-28)
- 03e6717 - fix(stats): hide partial-day ranking changes (#51777) (Jack, 2026-09-28)
- d6963bd - fix(stats): localize weekly ranking option (#51776) (Jack, 2026-09-28)
- 661b7c5 - feat(stats): add daily model rankings (#51774) (Jack, 2026-09-28)
- 90e6520 - sync release versions for v1.18.33 (opencode, 2026-09-28)
- 1eacc1b - fix: use available model for release changelog (#51773) (opencode-agent[bot], 2026-09-27)
- 35fc7a7 - fix(opencode): apply provider timeouts to Cloudflare AI Gateway models (#51549) (Dan Lapid, 2026-09-27)

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
- `packages/stats/core/src/domain/catalog-identity.test.ts` (+50, -0)
- `packages/stats/core/src/domain/catalog-identity.ts` (+70, -0)
- `packages/stats/core/src/domain/geo.ts` (+48, -1)
- `packages/stats/core/src/domain/home.test.ts` (+75, -1)
- `packages/stats/core/src/domain/home.ts` (+43, -9)
- `packages/stats/core/src/domain/inference.test.ts` (+41, -0)
- `packages/stats/core/src/domain/inference.ts` (+55, -15)
- `packages/stats/core/src/domain/model-normalization.ts` (+1, -0)
- `packages/stats/core/src/domain/model.ts` (+50, -1)
- `packages/stats/core/src/stat-sync.ts` (+44, -5)

#### Other Changes
- `.opencode/command/changelog.md` (+1, -1)
- `.opencode/command/translate.md` (+1, -1)
- `bun.lock` (+28, -28)
- `packages/app/package.json` (+1, -1)
- `packages/cli/package.json` (+1, -1)
- `packages/codemode/package.json` (+1, -1)
- `packages/console/app/package.json` (+1, -1)
- `packages/console/app/src/component/go-models.ts` (+39, -4)
- `packages/console/app/src/component/go-plan-chart.css` (+339, -0)
- `packages/console/app/src/component/go-plan-chart.tsx` (+171, -0)
- `packages/console/app/src/i18n/ar.ts` (+13, -1)
- `packages/console/app/src/i18n/br.ts` (+13, -1)
- `packages/console/app/src/i18n/da.ts` (+13, -1)
- `packages/console/app/src/i18n/de.ts` (+13, -1)
- `packages/console/app/src/i18n/en.ts` (+13, -1)
- `packages/console/app/src/i18n/es.ts` (+13, -1)
- `packages/console/app/src/i18n/fr.ts` (+13, -1)
- `packages/console/app/src/i18n/it.ts` (+13, -1)
- `packages/console/app/src/i18n/ja.ts` (+13, -1)
- `packages/console/app/src/i18n/ko.ts` (+13, -1)
- `packages/console/app/src/i18n/no.ts` (+13, -1)
- `packages/console/app/src/i18n/pl.ts` (+13, -1)
- `packages/console/app/src/i18n/ru.ts` (+13, -1)
- `packages/console/app/src/i18n/th.ts` (+13, -1)
- `packages/console/app/src/i18n/tr.ts` (+13, -1)
- `packages/console/app/src/i18n/uk.ts` (+13, -1)
- `packages/console/app/src/i18n/zh.ts` (+13, -1)
- `packages/console/app/src/i18n/zht.ts` (+13, -1)
- `packages/console/app/src/routes/go/index.css` (+96, -0)
- `packages/console/app/src/routes/go/index.tsx` (+80, -45)
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
- `packages/opencode/src/provider/provider.ts` (+60, -38)
- `packages/opencode/test/provider/header-timeout.test.ts` (+106, -0)
- `packages/plugin/package.json` (+1, -1)
- `packages/sdk/js/package.json` (+1, -1)
- `packages/server/package.json` (+1, -1)
- `packages/session-ui/package.json` (+1, -1)
- `packages/slack/package.json` (+1, -1)
- `packages/stats/app/package.json` (+1, -1)
- `packages/stats/app/src/i18n.ts` (+1, -0)
- `packages/stats/app/src/i18n/ar.ts` (+1, -0)
- `packages/stats/app/src/i18n/br.ts` (+1, -0)
- `packages/stats/app/src/i18n/da.ts` (+1, -0)
- `packages/stats/app/src/i18n/de.ts` (+1, -0)
- `packages/stats/app/src/i18n/es.ts` (+1, -0)
- `packages/stats/app/src/i18n/fr.ts` (+1, -0)
- `packages/stats/app/src/i18n/it.ts` (+1, -0)
- `packages/stats/app/src/i18n/ja.ts` (+1, -0)
- `packages/stats/app/src/i18n/ko.ts` (+1, -0)
- `packages/stats/app/src/i18n/no.ts` (+1, -0)
- `packages/stats/app/src/i18n/pl.ts` (+1, -0)
- `packages/stats/app/src/i18n/ru.ts` (+1, -0)
- `packages/stats/app/src/i18n/th.ts` (+1, -0)
- `packages/stats/app/src/i18n/tr.ts` (+1, -0)
- `packages/stats/app/src/i18n/uk.ts` (+1, -0)
- `packages/stats/app/src/i18n/zh.ts` (+1, -0)
- `packages/stats/app/src/i18n/zht.ts` (+1, -0)
- `packages/stats/app/src/routes/index.css` (+19, -0)
- `packages/stats/app/src/routes/index.tsx` (+52, -19)
- `packages/stats/server/package.json` (+1, -1)
- `packages/tui/package.json` (+1, -1)
- `packages/ui/package.json` (+1, -1)
- `packages/web/package.json` (+1, -1)
- `packages/web/src/content/docs/ar/go.mdx` (+225, -150)
- `packages/web/src/content/docs/bs/go.mdx` (+201, -134)
- `packages/web/src/content/docs/da/go.mdx` (+220, -153)
- `packages/web/src/content/docs/de/go.mdx` (+226, -145)
- `packages/web/src/content/docs/es/go.mdx` (+200, -121)
- `packages/web/src/content/docs/fr/go.mdx` (+200, -121)
- `packages/web/src/content/docs/go.mdx` (+190, -112)
- `packages/web/src/content/docs/it/go.mdx` (+225, -146)
- `packages/web/src/content/docs/ja/go.mdx` (+230, -150)
- `packages/web/src/content/docs/ko/go.mdx` (+228, -148)
- `packages/web/src/content/docs/nb/go.mdx` (+246, -166)
- `packages/web/src/content/docs/pl/go.mdx` (+251, -163)
- `packages/web/src/content/docs/pt-br/go.mdx` (+249, -169)
- `packages/web/src/content/docs/ru/go.mdx` (+295, -214)
- `packages/web/src/content/docs/th/go.mdx` (+309, -212)
- `packages/web/src/content/docs/tr/go.mdx` (+290, -194)
- `packages/web/src/content/docs/zh-cn/go.mdx` (+248, -175)
- `packages/web/src/content/docs/zh-tw/go.mdx` (+247, -174)
- `packages/web/src/styles/custom.css` (+10, -0)
- `sdks/vscode/package.json` (+1, -1)

### Key Diffs

#### packages/console/core/package.json
```diff
diff --git a/packages/console/core/package.json b/packages/console/core/package.json
index 0c6b062..4486987 100644
--- a/packages/console/core/package.json
+++ b/packages/console/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/console-core",
-  "version": "1.18.32",
+  "version": "1.18.33",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/core/package.json
```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index fbcbfc3..5488a1d 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -1,6 +1,6 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
-  "version": "1.18.32",
+  "version": "1.18.33",
   "name": "@opencode-ai/core",
   "type": "module",
   "license": "MIT",
```

#### packages/stats/core/package.json
```diff
diff --git a/packages/stats/core/package.json b/packages/stats/core/package.json
index 01b4098..04d3e98 100644
--- a/packages/stats/core/package.json
+++ b/packages/stats/core/package.json
@@ -1,7 +1,7 @@
 {
   "$schema": "https://json.schemastore.org/package.json",
   "name": "@opencode-ai/stats-core",
-  "version": "1.18.32",
+  "version": "1.18.33",
   "private": true,
   "type": "module",
   "license": "MIT",
```

#### packages/stats/core/src/domain/catalog-identity.test.ts
```diff
diff --git a/packages/stats/core/src/domain/catalog-identity.test.ts b/packages/stats/core/src/domain/catalog-identity.test.ts
new file mode 100644
index 0000000..39508f1
--- /dev/null
+++ b/packages/stats/core/src/domain/catalog-identity.test.ts
@@ -0,0 +1,50 @@
+import { describe, expect, test } from "bun:test"
+import { catalogIdentity } from "./catalog-identity"
+
+describe("stats catalog identity", () => {
+  test("resolves OpenCode offerings to canonical labs", () => {
+    const identity = catalogIdentity({
+      models: { "meituan/longcat-2.5-preview": {} },
+      providers: {
+        opencode: { models: { "longcat-2.5-preview-free": { canonical_model_id: "meituan/longcat-2.5-preview" } } },
+        "opencode-go": {
+          models: { "longcat-2.5-preview-free": { canonical_model_id: "meituan/longcat-2.5-preview" } },
+        },
+      },
+    })
+
+    expect(identity.offerings.get("opencode/longcat-2.5-preview-free")).toBe("meituan")
+    expect(identity.offerings.get("opencode-go/longcat-2.5-preview-free")).toBe("meituan")
+    expect(identity.models.get("longcat-2.5-preview")).toBe("meituan")
+  })
+
+  test("does not guess a lab for a name shared by different canonical models", () => {
+    const identity = catalogIdentity({
+      models: { "lab-a/model": {}, "lab-b/model": {} },
+      providers: {
+        opencode: { models: { "model-free": { canonical_model_id: "lab-a/model" } } },
+        "opencode-go": { models: { model: { canonical_model_id: "lab-b/model" } } },
+      },
+    })
+
+    expect(identity.offerings.get("opencode/model-free")).toBe("lab-a")
+    expect(identity.offerings.get("opencode-go/model")).toBe("lab-b")
+    expect(identity.models.has("model")).toBe(false)
+  })
+
+  test("accepts provider IDs that are already canonical catalog IDs", () => {
+    const identity = catalogIdentity({
+      models: { "opencode/direct-model": {} },
+      providers: { opencode: { models: { "direct-model": {} } } },
+    })
+
+    expect(identity.offerings.get("opencode/direct-model")).toBe("opencode")
+    expect(identity.models.get("direct-model")).toBe("opencode")
+  })
+
```

#### packages/stats/core/src/domain/catalog-identity.ts
```diff
diff --git a/packages/stats/core/src/domain/catalog-identity.ts b/packages/stats/core/src/domain/catalog-identity.ts
new file mode 100644
index 0000000..2fb6c55
--- /dev/null
+++ b/packages/stats/core/src/domain/catalog-identity.ts
@@ -0,0 +1,70 @@
+import { statModel } from "./model-normalization"
+
+const CATALOG_URL = "https://models.opencode.ai/catalog.json"
+const STATS_PROVIDERS = ["opencode", "opencode-go"] as const
+const cache: { value?: CatalogIdentity; expiresAt?: number } = {}
+
+export type CatalogIdentity = {
+  offerings: ReadonlyMap<string, string>
+  models: ReadonlyMap<string, string>
+}
+
+export async function loadCatalogIdentity() {
+  if (cache.value && (cache.expiresAt ?? 0) > Date.now()) return { catalog: cache.value, stale: false }
+  return fetch(CATALOG_URL, { signal: AbortSignal.timeout(10_000) })
+    .then(async (response) => {
+      if (!response.ok) throw new Error(`Model catalog returned ${response.status}`)
+      return catalogIdentity(await response.json())
+    })
+    .then((value) => {
+      cache.value = value
+      cache.expiresAt = Date.now() + 5 * 60_000
+      return { catalog: value, stale: false }
+    })
+    .catch(() => ({ catalog: cache.value, stale: true }))
+}
+
+export function catalogIdentity(value: unknown): CatalogIdentity {
+  if (!record(value) || !record(value.models) || !record(value.providers)) throw new Error("Invalid model catalog")
+  const models = value.models
+  const providers = value.providers
+
+  const offerings = new Map<string, string>()
+  const candidates = new Map<string, Set<string>>()
+  STATS_PROVIDERS.forEach((providerID) => {
+    const provider = providers[providerID]
+    if (!record(provider) || !record(provider.models)) return
+    Object.entries(provider.models).forEach(([modelID, model]) => {
+      if (!record(model)) return
+      const canonicalID =
+        typeof model.canonical_model_id === "string"
+          ? model.canonical_model_id
+          : modelID in models
+            ? modelID
+            : `${providerID}/${modelID}` in models
```


*... and more files (showing first 5)*

## Recommendations

Based on the changes, the following files in Alexi should be reviewed:

- No specific recommendations - review changes manually
