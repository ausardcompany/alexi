# Execution Task: Apply Update Plan to Alexi

You are an expert software developer. Your task is to execute the update plan below precisely.

## Update Plan to Execute

# Update Plan for Alexi

Generated: 2026-10-26
Based on upstream commits analyzed:
- **kilocode**: `0bc1c373a`, `ccf958a1d`, `2c8317d9a`, `9d28e36c7` (v7.8.18)
- **opencode**: `ed74ec8`, `9435378` (credential refresh), `33726e8` (compaction buffer), `f523f77` (background_compaction rename), `44fc9d2` (drop session_pending), `d1cf7dd`/`91b5a7c` (hook request fixes), `c54677b`/`421e44e` (media types), `9007700` (prompt cache TTL), `74556a2` (Bedrock Converse), `490456d` (provider options), `350dc1a` (gitlab-ai-provider bump), `f7a9f1b` (branch list fix)

## Summary
- Total changes planned: 14
- Critical: 2 | High: 5 | Medium: 5 | Low: 2

---

## Changes

### 1. Fix early auto-compaction loop (kilocode)
**File**: `src/core/session/compaction.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Upstream kilocode fix (`ccf958a1d`) — compaction currently fires before reaching the configured threshold and can loop. The fix compacts at the configured threshold and halts repeated compaction attempts. This is a user-facing stability bug.

**Current code** (approximate):
```typescript
export function shouldCompact(usage: Usage, threshold: number): boolean {
  // fires too early; no loop guard
  return usage.ratio >= threshold * 0.9
}
```

**New code**:
```typescript
export function shouldCompact(
  usage: Usage,
  threshold: number,
  lastCompactionAtTokens?: number,
): boolean {
  // Only compact once the configured threshold is actually reached.
  if (usage.ratio < threshold) return false
  // Prevent compaction loops: if we already compacted and the token count
  // hasn't meaningfully decreased, don't try again.
  if (lastCompactionAtTokens !== undefined && usage.tokens >= lastCompactionAtTokens) {
    return false
  }
  return true
}
```

Also update `src/core/session/prompt.ts` to pass `lastCompactionAtTokens` from session state and persist it after each compaction run.

---

### 2. Ignore compaction buffer that leaves no model room
**File**: `src/core/session/compaction.ts`
**Priority**: high
**Type**: bugfix
**Reason**: opencode commit `33726e8` — if `compaction.buffer` is larger than remaining context, we currently emit a zero/negative budget. Ignore the buffer when it would starve the model.

**New code**:
```typescript
function effectiveCompactionBudget(contextWindow: number, buffer: number, used: number): number {
  const remaining = contextWindow - used
  // If the configured buffer would leave the model no room, ignore it.
  if (buffer >= remaining) return remaining
  return remaining - buffer
}
```

---

### 3. Rename `precompute_compaction` → `background_compaction`
**File**: `src/core/config/schema.ts` and `src/core/session/compaction.ts`
**Priority**: medium
**Type**: refactor
**Reason**: opencode commit `f523f77` renames the config field for clarity. Keep the old name as a deprecated alias to preserve config compatibility.

**New code**:
```typescript
export const CompactionConfig = z.object({
  threshold: z.number().min(0).max(1).default(0.85),
  buffer: z.number().int().nonnegative().default(0),
  background_compaction: z.boolean().optional(),
  /** @deprecated use background_compaction */
  precompute_compaction: z.boolean().optional(),
}).transform((cfg) => ({
  ...cfg,
  background_compaction: cfg.background_compaction ?? cfg.precompute_compaction ?? false,
}))
```

---

### 4. Coordinate credential refreshes across processes
**File**: `src/providers/credential.ts` (or `src/core/credential.ts`)
**Priority**: high
**Type**: bugfix
**Reason**: opencode commit `9435378` — concurrent processes refreshing the same credential cause thrashing and token invalidation. Add a file-based lock around credential refresh. Important for SAP AI Core OAuth token refresh flows.

**New code**:
```typescript
import { lock } from "proper-lockfile"
import path from "node:path"

export async function refreshCredentialWithLock<T>(
  credentialPath: string,
  refresh: () => Promise<T>,
): Promise<T> {
  const lockPath = `${credentialPath}.lock`
  // Ensure lock directory exists
  await fs.mkdir(path.dirname(lockPath), { recursive: true })
  const release = await lock(credentialPath, {
    retries: { retries: 10, minTimeout: 50, maxTimeout: 500 },
    stale: 10_000,
    lockfilePath: lockPath,
  })
  try {
    // Re-read after acquiring lock in case another process just refreshed.
    const cached = await readCachedCredential(credentialPath)
    if (cached && !isExpired(cached)) return cached as T
    return await refresh()
  } finally {
    await release()
  }
}
```

> **SAP note**: wrap SAP AI Core XSUAA token acquisition with this helper so parallel CLI invocations share one token.

---

### 5. Bound fff watcher work on file bursts
**File**: `src/core/filesystem/watcher.ts` (or wherever file watching is implemented)
**Priority**: high
**Type**: bugfix
**Reason**: kilocode `2c8317d9a` bumps `@ff-labs/fff-bun` from 0.9.4 → 0.10.5 to bound CPU during file bursts. If Alexi uses fff or an equivalent watcher, update dependency and the drop-stale patch.

**package.json change**:
```json
{
  "dependencies": {
    "@ff-labs/fff-bun": "0.10.5"
  }
}
```

Also drop the now-obsolete patch file if present: `patches/@ff-labs%2Ffff-bun@0.9.4.patch`.

---

### 6. Drop unused `session_pending` table & pin history compaction bound
**File**: `src/core/database/schema.ts` + new migration
**Priority**: medium
**Type**: refactor
**Reason**: opencode `44fc9d2` — dead table removed; keeps DB clean. Only apply if Alexi mirrors upstream schema.

**New migration** `src/core/database/migration/YYYYMMDD_drop_session_pending.ts`:
```typescript
import { sql } from "drizzle-orm"
export async function up(db: Database) {
  await db.run(sql`DROP TABLE IF EXISTS session_pending`)
}
```

---

### 7. Send unchanged hooked requests without copying the body
**File**: `src/core/session/model-request.ts` (or request hook plumbing)
**Priority**: high
**Type**: bugfix
**Reason**: opencode `d1cf7dd` — hook-event copies large request bodies even when the hook doesn't modify them. Causes memory pressure and keeps the hook event alive. Also related: `91b5a7c` — running tools keep the hook event alive.

**New code**:
```typescript
async function dispatchHook(request: ModelRequest, hook: RequestHook) {
  const result = await hook({ request })
  // Only replace body if the hook returned a modified request.
  if (result?.request && result.request !== request && !deepEqual(result.request, request)) {
    return result.request
  }
  // Release reference so tool executions don't pin the original request.
  return request
}
```

Add explicit cleanup in request lifecycle:
```typescript
try {
  await runRequest(req)
} finally {
  // Avoid holding references in event listeners after the request completes.
  req.hookPayload = undefined
}
```

---

### 8. Map avif/heic/heif/mov extensions and distinguish HEIC/QuickTime/M4A from MP4
**File**: `src/core/mime.ts` (or equivalent)
**Priority**: medium
**Type**: bugfix
**Reason**: opencode `421e44e` and `c54677b` — misidentified media types cause attachment upload failures.

**New code**:
```typescript
const EXTENSION_MEDIA_TYPES: Record<string, string> = {
  ".avif": "image/avif",
  ".heic": "image/heic",
  ".heif": "image/heif",
  ".mov": "video/quicktime",
  ".m4a": "audio/mp4",
  // ... existing entries
}

function detectMediaFromMagic(bytes: Uint8Array): string | undefined {
  // ftyp box inspection
  if (bytes.length >= 12 && bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) {
    const brand = new TextDecoder().decode(bytes.slice(8, 12))
    if (brand.startsWith("heic") || brand.startsWith("heix") || brand === "mif1") return "image/heic"
    if (brand.startsWith("qt  ")) return "video/quicktime"
    if (brand.startsWith("M4A ")) return "audio/mp4"
    if (brand.startsWith("mp4") || brand.startsWith("isom") || brand.startsWith("iso2")) return "video/mp4"
  }
  return undefined
}
```

---

### 9. Configurable prompt cache TTL
**File**: `src/providers/anthropic.ts` and `src/core/config/schema.ts`
**Priority**: medium
**Type**: feature
**Reason**: opencode `9007700` — allow users to configure prompt cache TTL (5m vs 1h for Anthropic). Benefits long-running Alexi sessions.

**Config schema**:
```typescript
export const CachePolicy = z.object({
  ttl: z.enum(["5m", "1h"]).default("5m"),
}).optional()
```

**Provider wiring (Anthropic cache_control)**:
```typescript
function cacheControl(policy?: CachePolicy) {
  return { type: "ephemeral" as const, ttl: policy?.ttl ?? "5m" }
}
```

---

### 10. Typed Bedrock Converse options
**File**: `src/providers/bedrock.ts`
**Priority**: medium
**Type**: feature
**Reason**: opencode `74556a2` — typed options for reasoning effort, service tier, adaptive thinking, request metadata. Relevant if Alexi uses Bedrock alongside SAP AI Core.

**New code**:
```typescript
export interface BedrockConverseOptions {
  reasoningEffort?: "low" | "medium" | "high"
  serviceTier?: "standard" | "priority"
  adaptiveThinking?: boolean
  requestMetadata?: Record<string, string>
  responseJsonSchema?: object
}

function buildConverseRequest(model: string, messages: Message[], opts: BedrockConverseOptions = {}) {
  const additionalModelRequestFields: Record<string, unknown> = {}
  if (opts.reasoningEffort) additionalModelRequestFields.reasoning_effort = opts.reasoningEffort
  if (opts.adaptiveThinking) additionalModelRequestFields.thinking = { type: "enabled" }
  // ...
  return { modelId: model, messages, additionalModelRequestFields, ...(opts.requestMetadata ? { requestMetadata: opts.requestMetadata } : {}) }
}
```

---

### 11. Derive provider option keys from settings schema
**File**: `src/providers/options.ts`
**Priority**: low
{"prompt_tokens":63746,"completion_tokens":4096,"total_tokens":67842,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 6d2409a0-d387-47f7-acc8-b0d11c09bf4c]
[Messages: 2, Tokens: 67842]

## Execution Instructions

1. **Execute each change** in the plan above in order of priority (critical → high → medium → low)
2. **Make exact code changes** as specified in the plan
3. **Maintain SAP AI Core compatibility** - do not break existing integrations
4. **Follow existing code style** in this repository
5. **Create changes summary** at `.github/reports/changes-summary.md` with:
   - List of files modified
   - Summary of each change made
   - Any issues encountered

## Important

- Do NOT skip any items in the plan
- Do NOT add extra changes not in the plan
- Do NOT ask questions - just execute
- If a file doesn't exist, create it
- If code context is unclear, use your best judgment based on the plan

Execute the entire plan now.
