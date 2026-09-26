# Update Plan for Alexi

Generated: 2026-09-25
Based on upstream commits analyzed:
- kilocode: 50e520adf..6c9ac9542 (159 commits) — v7.8.0 release
- opencode: 0f54984..34aa427 (3 commits)

## Summary
- Total changes planned: 12
- Critical: 2 | High: 4 | Medium: 4 | Low: 2

Only a small subset of the upstream 414 changed files map to Alexi's surface area. The bulk of upstream commits are:
- JetBrains plugin UI (not applicable to Alexi)
- VSCode extension + webview i18n (not applicable)
- Docs/marketing/stats web pages (not applicable)
- CI/dependabot/signing workflow (partially applicable — see §11)

The changes below focus on: database migrations (critical data-loss risk), tool system (`apply_patch`), provider transforms, session retention/cleanup, network disconnect surfacing, config v2 compatibility, and Azure plugin hardening.

## Changes

### 1. Fix legacy Drizzle migration import (missing `name` column)
**File**: `src/core/database/migration.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Upstream commit `b72b50006` fixes a crash where installations that ran the legacy Drizzle migrator (which stored `created_at` but no `name` column) failed to bootstrap the new `migration` table. Without this, Alexi users upgrading from an older SQLite journal will hit `no such column: name` on startup and lose migration history idempotency.

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
}
```

---

### 2. Harden workspace-name migration against missing column
**File**: `src/core/database/migration/20260410174513_workspace-name.ts` (create if not present, or the equivalent Alexi migration that adds `workspace.name`)
**Priority**: critical
**Type**: bugfix
**Reason**: Upstream commit `b72b50006` guards the `INSERT INTO __new_workspace` SELECT against DBs where `workspace.name` never existed, preventing a hard failure during migration on older DBs. Alexi has an equivalent workspace-name migration and needs the same guard.

**Current code**:
```typescript
export default {
  id: "20260410174513_workspace-name",
  up(tx) {
    return Effect.gen(function* () {
      yield* tx.run(`PRAGMA foreign_keys=OFF;`)
      yield* tx.run(`CREATE TABLE \`__new_workspace\` ( ... );`)
      yield* tx.run(
        `INSERT INTO \`__new_workspace\`(\`id\`, \`type\`, \`branch\`, \`name\`, \`directory\`, \`extra\`, \`project_id\`) SELECT \`id\`, \`type\`, \`branch\`, \`name\`, \`directory\`, \`extra\`, \`project_id\` FROM \`workspace\`;`,
      )
      // ...
    })
  },
}
```

**New code**:
```typescript
export default {
  id: "20260410174513_workspace-name",
  up(tx) {
    return Effect.gen(function* () {
      const columns = yield* tx.all<{ name: string }>(`PRAGMA table_info(\`workspace\`)`)
      const name = columns.some((column) => column.name === "name") ? "`name`" : "''"

      yield* tx.run(`PRAGMA foreign_keys=OFF;`)
      yield* tx.run(`CREATE TABLE \`__new_workspace\` ( ... );`)
      yield* tx.run(
        `INSERT INTO \`__new_workspace\`(\`id\`, \`type\`, \`branch\`, \`name\`, \`directory\`, \`extra\`, \`project_id\`) SELECT \`id\`, \`type\`, \`branch\`, ${name}, \`directory\`, \`extra\`, \`project_id\` FROM \`workspace\`;`,
      )
      // ...
    })
  },
}
```

---

### 3. `apply_patch`: omit empty move-path
**File**: `src/tool/apply_patch.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream commit `f7da00f35` (PR #45329) — an empty `move` path was serialized and caused patch application to fail when a file was not being renamed. Alexi's `apply_patch` tool inherits this bug.

**Current code** (locate the update-file rendering section):
```typescript
if (change.move_path !== undefined) {
  lines.push(`Move to: ${change.move_path}`)
}
```

**New code**:
```typescript
if (change.move_path !== undefined && change.move_path !== "") {
  lines.push(`Move to: ${change.move_path}`)
}
```

Add a corresponding test in `src/tool/apply_patch.test.ts` verifying the empty-string case is treated as absent.

---

### 4. Provider transform: filter unreplayable Bedrock reasoning
**File**: `src/providers/transform.ts` (or `src/providers/bedrock/transform.ts` if provider-specific)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream commit `517ee736b` filters out reasoning blocks that cannot be replayed (e.g. redacted/opaque signatures) before caching. Without it, cached prompts fail on replay with a 400. This impacts SAP AI Core Bedrock proxy flows too.

**New code** (approximately +41 lines to the transform pipeline):
```typescript
// In the message-part filtering pass, before caching:
function isReplayableReasoningBlock(part: MessagePart): boolean {
  if (part.type !== "reasoning") return true
  // Bedrock returns opaque signatures for redacted thinking; those cannot be replayed.
  if (part.metadata?.redacted) return false
  if (part.signature && !part.text) return false
  return true
}

function filterUnreplayableReasoning(parts: MessagePart[]): MessagePart[] {
  return parts.filter(isReplayableReasoningBlock)
}

// Apply in the transform path just before serializing to cache:
messages = messages.map((m) => ({
  ...m,
  parts: filterUnreplayableReasoning(m.parts),
}))
```

Also review upstream `packages/opencode/src/provider/transform.ts` (+41 lines) and mirror the exact filter conditions.

---

### 5. Support Anthropic thinking-block binding tolerance
**File**: `src/providers/anthropic/transform.ts` (or equivalent)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream commit `3f39a329c` — tolerate Anthropic returning thinking blocks bound to tool calls with slightly different indexing. Also bumps `@ai-sdk/anthropic` to `3.0.111` (patched in `patches/@ai-sdk%2Fanthropic@3.0.111.patch`). Alexi should update the SDK peer and mirror the patch or apply the transform-level tolerance.

**Action**:
1. Bump `@ai-sdk/anthropic` to `3.0.111` in `package.json`.
2. Copy `patches/@ai-sdk%2Fanthropic@3.0.111.patch` into Alexi's patches directory if using pnpm/bun patches.
3. In the provider transform, defensively re-associate thinking parts by scanning the assistant message rather than trusting the block index:

```typescript
function bindThinkingToToolCall(msg: AssistantMessage): AssistantMessage {
  const thinking = msg.parts.find((p) => p.type === "reasoning")
  const toolCall = msg.parts.find((p) => p.type === "tool-call")
  if (thinking && toolCall && !toolCall.metadata?.thinkingSignature) {
    toolCall.metadata = {
      ...toolCall.metadata,
      thinkingSignature: thinking.signature,
    }
  }
  return msg
}
```

---

### 6. Surface network disconnects instead of hanging
**File**: `src/session/network.ts` (create if missing) and `src/cli/tui.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream commit `d6bb0ef05` (PR #13523) — CLI/TUI silently hangs when the network drops mid-stream. Users on flaky SAP corporate VPNs will hit this. Upstream added +39 lines emitting a discrete `NetworkDisconnected` event.

**New code** (`src/session/network.ts`):
```typescript
export namespace Network {
  export const DisconnectEvent = Bus.event("network.disconnected", z.object({
    reason: z.enum(["timeout", "abort", "socket", "dns", "unknown"]),
    provider: z.string().optional(),
    retriable: z.boolean(),
  }))

  export function classifyError(err: unknown): { reason: string; retriable: boolean } | null {
    if (!(err instanceof Error)) return null
    const msg = err.message.toLowerCase()
    if (msg.includes("etimedout") || msg.includes("timeout")) return { reason: "timeout", retriable: true }
    if (msg.includes("econnreset") || msg.includes("socket hang up")) return { reason: "socket", retriable: true }
    if (msg.includes("enotfound") || msg.includes("eai_again")) return { reason: "dns", retriable: true }
    if (err.name === "AbortError") return { reason: "abort", retriable: false }
    return null
  }

  export function report(err: unknown, provider?: string) {
    const classified = classifyError(err)
    if (!classified)
{"prompt_tokens":30445,"completion_tokens":4096,"total_tokens":34541,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: a33f1fa8-44c7-46a8-8ac6-5d492b610bf2]
[Messages: 2, Tokens: 34541]
