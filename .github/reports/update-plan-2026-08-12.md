# Update Plan for Alexi

Generated: 2026-08-12
Based on upstream commits analyzed:
- kilocode: a5aaef74a..64e5dd036 (218 commits)
- opencode: d041eee..1f94d8a (9 commits)

## Summary
- Total changes planned: 14
- Critical: 3 | High: 6 | Medium: 4 | Low: 1

Key themes from upstream:
1. **Critical DB stability**: concurrent migration serialization fix
2. **Session retry hardening**: capped retries with jitter (opencode security-ish fix)
3. **Provider transform**: significant reasoning/variant handling changes (Grok, Kimi, xAI, GPT-5, Copilot)
4. **Permission expansion** in agent config plugin (external directory, read, edit)
5. **Filesystem watcher guard** for non-VCS locations
6. **MCP lifecycle refactor** (browser split, transport improvements)
7. **Repository cache Windows path canonicalization**
8. **Session compaction & LLM runner fixes**

---

## Changes

### 1. Serialize concurrent database migrations
**File**: `src/core/database/migration.ts` (or equivalent Alexi DB migration runner)
**Priority**: critical
**Type**: bugfix
**Reason**: Upstream fix `2c2b0a2ff` (fix(core): serialize concurrent database migrations #13067). When multiple processes race, the migration journal INSERT dies on primary key. Take an IMMEDIATE write lock and re-check inside the transaction before replaying. Alexi likely has the same race in multi-process (e.g., SAP AI Core worker + CLI) scenarios.

**Current code**:
```typescript
for (const migration of input) {
  if (completed.has(migration.id)) continue
  yield* db.transaction((tx) =>
    Effect.gen(function* () {
      yield* migration.up(tx)
      yield* tx.run(
        sql`INSERT INTO ${sql.identifier("migration")} (id, time_completed) VALUES (${migration.id}, ${Date.now()})`,
      )
    }),
  )
}
```

**New code**:
```typescript
for (const migration of input) {
  if (completed.has(migration.id)) continue
  // Another process may have recorded this migration since the snapshot above;
  // take the write lock and re-check inside the tx, otherwise the journal
  // insert dies on the primary key.
  yield* db.transaction(
    (tx) =>
      Effect.gen(function* () {
        if (
          yield* tx.get(
            sql`SELECT id FROM ${sql.identifier("migration")} WHERE id = ${migration.id}`,
          )
        )
          return
        yield* migration.up(tx)
        yield* tx.run(
          sql`INSERT INTO ${sql.identifier("migration")} (id, time_completed) VALUES (${migration.id}, ${Date.now()})`,
        )
      }),
    { behavior: "immediate" },
  )
}
```

**Test**: Add `test/core/database/migration-concurrent.test.ts` that spawns two concurrent `applyOnly` calls against the same DB file and asserts no PK collision.

---

### 2. Cap session retries with jitter
**File**: `src/session/retry.ts` (or `src/core/session/retry.ts`)
**Priority**: critical
**Type**: security / bugfix
**Reason**: Upstream opencode commit `c789868` prevents runaway retry loops that can exhaust rate limits and burn tokens. Especially important for SAP AI Core (deployment-based quotas). Add a max attempt cap with exponential backoff + jitter.

**New code** (replace existing retry logic):
```typescript
const DEFAULT_MAX_ATTEMPTS = 8
const DEFAULT_BASE_MS = 500
const DEFAULT_MAX_MS = 30_000

export interface RetryOptions {
  maxAttempts?: number
  baseMs?: number
  maxMs?: number
  jitter?: boolean
}

export function computeDelay(attempt: number, opts: RetryOptions = {}): number {
  const base = opts.baseMs ?? DEFAULT_BASE_MS
  const cap = opts.maxMs ?? DEFAULT_MAX_MS
  const exp = Math.min(cap, base * 2 ** attempt)
  if (opts.jitter === false) return exp
  // full jitter
  return Math.floor(Math.random() * exp)
}

export async function withRetry<T>(
  fn: (attempt: number) => Promise<T>,
  shouldRetry: (err: unknown) => boolean,
  opts: RetryOptions = {},
): Promise<T> {
  const max = opts.maxAttempts ?? DEFAULT_MAX_ATTEMPTS
  let lastErr: unknown
  for (let attempt = 0; attempt < max; attempt++) {
    try {
      return await fn(attempt)
    } catch (err) {
      lastErr = err
      if (!shouldRetry(err) || attempt === max - 1) throw err
      await new Promise((r) => setTimeout(r, computeDelay(attempt, opts)))
    }
  }
  throw lastErr
}
```

**Test additions** in `test/session/retry.test.ts`:
- Assert stops after `maxAttempts`
- Assert delays are bounded by `maxMs`
- Assert jitter produces values in `[0, exp)`

---

### 3. Guard filesystem watcher for non-VCS locations
**File**: `src/core/filesystem/watcher.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream added `location.vcs &&` guard — prevents watcher initialization on locations without VCS metadata, which causes crashes or excessive polling. Important for SAP AI Core sandboxed workspaces that may not be git repos.

**Current code**:
```typescript
if (yield* Flag.KILO_EXPERIMENTAL_FILEWATCHER) {
  yield* Effect.forkScoped(
    subscribe(location.directory, [...Ignore.PATTERNS, ...config, ...protecteds(location.directory)]),
  )
}
```

**New code**:
```typescript
if (location.vcs && (yield* Flag.KILO_EXPERIMENTAL_FILEWATCHER)) {
  yield* Effect.forkScoped(
    subscribe(location.directory, [...Ignore.PATTERNS, ...config, ...protecteds(location.directory)]),
  )
}
```

---

### 4. Expand agent permissions (external directory / read / edit)
**File**: `src/core/config/plugin/agent.ts` (or `src/agent/config-plugin.ts`)
**Priority**: high
**Type**: feature
**Reason**: Upstream introduces `expandPermissions` to normalize permission entries against `global.home`, and adds path actions `external_directory | read | edit`. Alexi's permission model must recognize these to stay compatible with agent config files from users.

**New additions**:
```typescript
import { Global } from "../../global"
import { PermissionV2 } from "../../permission"
import type { LocationMutation } from "../../location-mutation"
import type { ReadTool } from "../../tool/read"
import type { EditTool } from "../../tool/edit"

type PathAction =
  | LocationMutation.ExternalDirectoryAuthorization["action"]
  | typeof ReadTool.name
  | typeof EditTool.name

const pathActions = ["external_directory", "read", "edit"] as const satisfies readonly PathAction[]

function expandPermissions(
  entries: ReadonlyArray<PermissionV2.Entry>,
  home: string,
): ReadonlyArray<PermissionV2.Entry> {
  return entries.map((entry) => {
    if (!pathActions.includes(entry.action as PathAction)) return entry
    // Normalize `~` and relative paths against $HOME
    return { ...entry, path: normalizePermissionPath(entry.path, home) }
  })
}
```

**In the plugin effect**:
```typescript
const global = yield* Global.Service
// ...
const permissions = expandPermissions(
  documents.flatMap((document) => document.info.permissions ?? []),
  global.home,
)
for (const current of draft.list()) {
  draft.update(current.id, (agent) => agent.permissions.push(...permissions))
}
```

---

### 5. Preserve base model variants with custom provider fallback
**File**: `src/providers/provider.ts` and `src/providers/transform.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream commit `031ea2feb` — "preserve base model variants alongside custom provider fallback". Without this, reasoning variants (Grok reasoning, Kimi adaptive effort, GPT-5.6 reasoning modes) get dropped when a custom provider overrides them. Directly relevant for SAP AI Core custom deployments that wrap base models.

**Change pattern** in `provider.ts` (merging providers):
```typescript
// Before: custom provider replaced base models entirely
providers[id] = customProvider

// After: merge, preserving base variants not overridden
providers[id] = {
  ...customProvider,
  models: {
    ...baseProvider?.models, // preserve base variants (e.g., -reasoning-high)
    ...customProvider.models, // custom overrides
  },
}
```

**Change pattern** in `transform.ts` — derive variants from reasoning metadata:
```typescript
export function deriveReasoningVariants(model: ModelInfo): ModelInfo[] {
  const variants: ModelInfo[] = [model]
  if (model.reasoning?.efforts) {
    for (const effort of model.reasoning.efforts) {
      variants.push({
        ...model,
        id: `${model.id}-${effort}`,
        variant: effort,
        reasoning: { ...model.reasoning, defaultEffort: effort },
      })
    }
  }
  return variants
}
```

Add tests mirroring `test/kilocode/provider/grok-reasoning-variants.test.ts` and `kimi-adaptive-effort.test.ts`.

---

### 6. Invalidate active instance config cache on global config change
**File**: `src/core/config/config.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream commit `19a2a3c4d`. When global config changes (e.g., SAP AI Core credentials refresh), per-instance cached config becomes stale, leading to auth failures.

**Change**:
```typescript
// In global config watcher / invalidator:
export const invalidateGlobal = Effect.fn(function* () {
  yield* globalConfigRef.set(Option.none())
  // Also invalidate active instance config cache
  yield* instanceConfigCache.clear()
})
```

Add `test/config/global-invalidation.test.ts` — mutate global, assert instance re-reads.

---

### 7. Canonicalize repository cache paths on Windows
**File**: `src/core/repository-cache.ts` and `src/core/repository.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream commits `33c45bd78`, `343491e35`, `712346975`, `e958d4486`. Case-insensitive Windows filesystems + drive letter variants + trailing slashes cause cache misses. Alexi likely has same issue for enterprise Windows users.

**New helper**:
```typescript
import path from "node:path"

export function canonicalizeRepoPath(p: string): string {
  const resolved = path.resolve(p)
  // On Windows, normalize drive letter case & separators
  if (process.platform === "win32") {
    const drive = resolved.charAt(0).toUpperCase()
    return drive + resolved.slice(1).replace(/\\/g, "/")
{"prompt_tokens":31590,"completion_tokens":4096,"total_tokens":35686,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 2720655d-eaa3-4ceb-acea-03ee0365481e]
[Messages: 2, Tokens: 35686]
