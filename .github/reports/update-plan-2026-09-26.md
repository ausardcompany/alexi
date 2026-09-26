# Update Plan for Alexi

Generated: 2026-09-26
Based on upstream commits analyzed:
- **kilocode**: `50e520adf..c26779478` (201 commits)
- **opencode**: `0f54984..696f41b` (7 commits)

## Summary
- Total changes planned: 12
- Critical: 2 | High: 4 | Medium: 4 | Low: 2

Focus areas: database migration resilience (critical for SAP AI Core deployments with legacy DBs), safe URL opening (security), session retention/cleanup improvements, network disconnect surfacing in TUI, MCP OAuth prompt handling, and tool view label rendering fixes.

---

## Changes

### 1. Harden legacy Drizzle migration import (CRITICAL bugfix)
**File**: `src/core/database/migration.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Upstream `kilocode` commit fixes a crash when `__drizzle_migrations` table exists without a `name` column (older Drizzle schemas). Without this, Alexi installations that upgraded from earlier SAP AI Core deployments will fail to boot with an obscure SQL error. This must be ported before any subsequent migration changes.

**Current code**:
```typescript
if (
  yield* db.get(sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = ${"__drizzle_migrations"}`)
) {
  yield* db.run(sql`
    INSERT OR IGNORE INTO ${sql.identifier("migration")} (id, time_completed)
    SELECT name, ${Date.now()}
    FROM ${sql.identifier("__drizzle_migrations")}
    WHERE name IS NOT NULL
  `)
}
```

**New code**:
```typescript
if (
  yield* db.get(sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = ${"__drizzle_migrations"}`)
) {
  const named = (yield* db.all<{ name: string }>(
    sql`SELECT name FROM pragma_table_info('__drizzle_migrations')`,
  )).some((column) => column.name === "name")

  if (named) {
    yield* db.run(sql`
      INSERT OR IGNORE INTO ${sql.identifier("migration")} (id, time_completed)
      SELECT name, ${Date.now()}
      FROM ${sql.identifier("__drizzle_migrations")}
      WHERE name IS NOT NULL
    `)
  } else {
    const entries = yield* db.all<{ created_at: number; prefix: string | null }>(sql`
      SELECT created_at, strftime('%Y%m%d%H%M%S', created_at / 1000, 'unixepoch') AS prefix
      FROM ${sql.identifier("__drizzle_migrations")}
      WHERE created_at IS NOT NULL
    `)

    for (const entry of entries) {
      const migration = input.find((item) => item.id.startsWith(`${entry.prefix}_`))
      if (!migration) {
        return yield* Effect.die(
          new Error(`Legacy migration timestamp ${entry.created_at} does not match any known migration`),
        )
      }
      yield* db.run(sql`
        INSERT OR IGNORE INTO ${sql.identifier("migration")} (id, time_completed)
        VALUES (${migration.id}, ${Date.now()})
      `)
    }
  }

  completed = new Set(
    (yield* db.all<{ id: string }>(sql`SELECT id FROM ${sql.identifier("migration")}`)).map((row) => row.id),
  )
}
```

---

### 2. Defensive workspace-name migration (CRITICAL bugfix)
**File**: `src/core/database/migration/20260410174513_workspace-name.ts` (create/update if migration exists in Alexi)
**Priority**: critical
**Type**: bugfix
**Reason**: Companion fix to #1 — migration references `name` column that may not exist on older DBs, causing hard failure. Defaults missing name column to empty string.

**New code**:
```typescript
import { Effect } from "effect"

export default {
  id: "20260410174513_workspace-name",
  up(tx) {
    return Effect.gen(function* () {
      const columns = yield* tx.all<{ name: string }>(`PRAGMA table_info(\`workspace\`)`)
      const name = columns.some((column) => column.name === "name") ? "`name`" : "''"

      yield* tx.run(`PRAGMA foreign_keys=OFF;`)
      yield* tx.run(`
        CREATE TABLE \`__new_workspace\` (
          \`id\` text PRIMARY KEY NOT NULL,
          \`type\` text NOT NULL,
          \`branch\` text,
          \`name\` text NOT NULL DEFAULT '',
          \`directory\` text,
          \`extra\` text,
          \`project_id\` text NOT NULL,
          FOREIGN KEY (\`project_id\`) REFERENCES \`project\`(\`id\`) ON UPDATE no action ON DELETE cascade
        );
      `)
      yield* tx.run(
        `INSERT INTO \`__new_workspace\`(\`id\`, \`type\`, \`branch\`, \`name\`, \`directory\`, \`extra\`, \`project_id\`) ` +
        `SELECT \`id\`, \`type\`, \`branch\`, ${name}, \`directory\`, \`extra\`, \`project_id\` FROM \`workspace\`;`,
      )
      yield* tx.run(`DROP TABLE \`workspace\`;`)
      yield* tx.run(`ALTER TABLE \`__new_workspace\` RENAME TO \`workspace\`;`)
      yield* tx.run(`PRAGMA foreign_keys=ON;`)
    })
  },
}
```

---

### 3. Safe URL opener utility (HIGH security)
**File**: `src/core/open.ts` (new)
**Priority**: high
**Type**: security
**Reason**: Upstream `opencode` commit 29f07e0 centralizes URL opening. Guards against arbitrary scheme injection (`file://`, `javascript:`, `ms-msdt:`, UNC paths) which is a real vulnerability for SAP AI Core integrations that surface links from LLM output.

**New code**:
```typescript
import open from "open"

/**
 * Opens the given URL in the user's default browser.
 * Only http/https URLs are permitted to avoid arbitrary-scheme injection
 * (e.g., javascript:, file://, ms-msdt:/, UNC paths).
 */
export function openUrl(input: string): Promise<unknown> {
  const url = URL.canParse(input) ? new URL(input) : undefined
  if (!url || (url.protocol !== "http:" && url.protocol !== "https:")) {
    return Promise.reject(new Error(`Only http and https links can be opened in the browser: ${input}`))
  }
  return open(url.href)
}
```

**Test file** `src/core/open.test.ts`:
```typescript
import { describe, expect, test } from "bun:test"
import { openUrl } from "./open"

describe("openUrl", () => {
  test("rejects non-URL values", async () => {
    await expect(openUrl("not a url")).rejects.toThrow("Only http and https links")
    await expect(openUrl("")).rejects.toThrow("Only http and https links")
  })
  test("rejects dangerous schemes", async () => {
    await expect(openUrl("file:///etc/hosts")).rejects.toThrow()
    await expect(openUrl("javascript:alert(1)")).rejects.toThrow()
    await expect(openUrl("ms-msdt:/id PCWDiagnostic")).rejects.toThrow()
    await expect(openUrl("\\\\server\\share\\file.html")).rejects.toThrow()
  })
})
```

**Add dependency** to `package.json`:
```json
"open": "11.0.4"
```

---

### 4. Route all browser-open call sites through `openUrl` (HIGH security)
**File**: `src/cli/**` and `src/tool/browser-open.ts`
**Priority**: high
**Type**: security
**Reason**: Complements change #3. Replace any `open(...)` or `child_process.exec('xdg-open ...')` calls with `openUrl`.

**Search & replace pattern**:
```typescript
// Before
import open from "open"
await open(someUrl)

// After
import { openUrl } from "@/core/open"
await openUrl(someUrl)
```

Applies to (based on upstream patterns): `src/cli/cmd/account.ts`, `src/cli/cmd/web.ts`, `src/tool/browser-open.ts`, any OAuth flow launcher in `src/providers/`.

---

### 5. Fix tool view label text setter (HIGH bugfix)
**File**: `src/tool/BaseSearchToolView.ts` (and related tool views if ported)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream renamed `setTargetText` → `setText` in the label helper for consistency. If Alexi has ported these views, the incorrect method name causes silent no-op renders (target labels never update). Affects: `BaseSearchToolView`, `EditToolView`, `ReadToolView`, `ShellToolView`, `TaskToolView`, `ToolApprovalFooter`, `ToolSupport`.

**Current code**:
```typescript
parts.targets.forEach((label, index) => {
  const text = values[index] ?? ""
  changed = setVisible(label, text.length > 0) || changed
  changed = setTargetText(label, text) || changed
  changed = setForeground(label, SessionUiStyle.Colors.foreground()) || changed
})
```

**New code**:
```typescript
parts.targets.forEach((label, index) => {
  const text = values[index] ?? ""
  changed = setVisible(label, text.length > 0) || changed
  changed = setText(label, text) || changed
  changed = setForeground(label, SessionUiStyle.Colors.foreground()) || changed
})
```

---

### 6. Surface network disconnects in TUI/CLI instead of hanging (HIGH bugfix)
**File**: `src/session/network.ts` (or equivalent), `src/cli/session/handler.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream `d6bb0ef05` — silent hangs on network disconnect are a poor UX and hide SAP AI Core outages. Add explicit network-error detection and surface as a user-visible error rather than an unresolved promise.

**New code** in `src/session/network.ts`:
```typescript
export interface NetworkErrorInfo {
  kind: "offline" | "timeout" | "dns" | "reset" | "unknown"
  message: string
  retriable: boolean
}

const OFFLINE_CODES = new Set(["ENOTFOUND", "EAI_AGAIN", "ECONNREFUSED", "ECONNRESET", "ETIMEDOUT", "EHOSTUNREACH"])

export function classifyNetworkError(err: unknown): NetworkErrorInfo | undefined {
  if (!err || typeof err !== "object") return undefined
  const anyErr = err as { code?: string; message?: string; cause?: any }
  const code = anyErr.code ?? anyErr.cause?.code
  if (!code || !OFFLINE_CODES.has(code)) return undefined
  const kindMap: Record<string, NetworkErrorInfo["kind"]> = {
    ENOTFOUND: "dns", EAI_AGAIN: "dns",
    ETIMEDOUT: "timeout",
    ECONNREFUSED: "offline", ECONNRESET: "re
{"prompt_tokens":40629,"completion_tokens":4096,"total_tokens":44725,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 4f47090c-2256-4ad4-b62c-5fd4d8d0d417]
[Messages: 2, Tokens: 44725]
