# Update Plan for Alexi

Generated: 2026-10-06
Based on upstream commits analyzed:
- kilocode: a93088bfe..4433f275f (96 commits)
- opencode: 907b3bc..3f393d7 (11 commits)

## Summary
- Total changes planned: 6
- Critical: 0 | High: 3 | Medium: 2 | Low: 1

## Analysis Scope
Most upstream changes relate to VS Code webview, i18n, visual regression tests, MCP OAuth UI, and settings UI panels. These are **not applicable** to Alexi (which is an SAP AI Core-focused CLI/service, not a VS Code extension). The following changes **are relevant** and worth porting.

## Changes

### 1. Fix xlsx tool: preserve spreadsheet times and round float errors
**File**: `src/tool/xlsx.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream kilocode fixes two real bugs in the xlsx reader:
1. Spreadsheet times (e.g., `14:05`) parse as `14:04:59.999` due to floating-point error—need rounding.
2. Month-only / time-only / datetime cells were incorrectly flattened to date-only ISO strings. Users on SAP side who import spreadsheets with timestamps lose precision today.

**Current code**:
```typescript
const book = read(bytes, { type: "array", cellDates: true })
// ...
function cell(value: CellObject | undefined) {
  // ...
  if (value.v === undefined || value.v === null) return ""
  if (value.t === "e") return `[Error: ${value.w ?? String(value.v)}]`
  if (value.t === "d") return value.v instanceof Date ? value.v.toISOString().slice(0, 10) : String(value.v)
  if (value.l?.Target) return `${value.w ?? String(value.v)} (${value.l.Target})`
  return value.w ?? String(value.v)
}
```

**New code**:
```typescript
const book = read(bytes, { type: "array", cellDates: true, cellNF: true })
// ...
function cell(value: CellObject | undefined) {
  // ...
  if (value.v === undefined || value.v === null) return ""
  if (value.t === "e") return `[Error: ${value.w ?? String(value.v)}]`
  if (value.t === "d") {
    if (!(value.v instanceof Date)) return String(value.v)
    // Round away SheetJS's floating-point error: 14:05 parses as 14:04:59.999.
    const iso = new Date(Math.round(value.v.getTime() / 1000) * 1000).toISOString()
    // A time of day or a duration is stored as a day in 1899 or 1900. Its format is an elapsed [h], [m]
    // or [s] one, or shows an hour or a second and no day or year outside quoted text, escaped
    // characters and [...] sections, so read it as the cell shows it. An m alone is a month (mmm).
    const code = String(value.z ?? "")
    const format = code.replace(/"[^"]*"|\\.|\[[^\]]*\]/g, "")
    const timeOnly = /\[(h+|m+|s+)\]/i.test(code) || (!/[dy]/i.test(format) && /[hs]/i.test(format))
    if (value.z != null && timeOnly) return value.w ?? iso.slice(11, 19)
    if (iso.endsWith("T00:00:00.000Z")) return iso.slice(0, 10)
    return iso.slice(0, 19).replace("T", " ")
  }
  if (value.l?.Target) return `${value.w ?? String(value.v)} (${value.l.Target})`
  return value.w ?? String(value.v)
}
```

**Verification steps**:
- Add tests mirroring `packages/opencode/test/kilocode/read-xlsx.test.ts`:
  - Time-only cell (`14:05`) → `"14:05:00"`.
  - Datetime cell → `"YYYY-MM-DD HH:MM:SS"`.
  - Date-only cell → `"YYYY-MM-DD"` (unchanged behavior).
  - Elapsed `[h]:mm` format → read as shown.

---

### 2. Add `memory_model` config option
**File**: `src/core/config.ts` (or wherever Alexi's config schema lives — mirror `packages/core/src/v1/config/config.ts`)
**Priority**: high
**Type**: feature
**Reason**: Upstream adds a dedicated model for automatic memory saves, independent of the session model. This is useful for SAP users who may want a cheaper/faster model for background memory operations than their primary agent model. Must gracefully fall back to the session model when the configured memory model is unavailable (important for SAP AI Core where model availability varies by subaccount).

**Current code** (approximate — adapt to Alexi's schema):
```typescript
export const Info = Schema.Struct({
  // ...
  subagent_model: Schema.optional(/*...*/),
  default_agent: Schema.optional(Schema.NullOr(Schema.String)).annotate({
    description: "Default agent to use when none is specified...",
  }),
  // ...
})
```

**New code**:
```typescript
export const Info = Schema.Struct({
  // ...
  subagent_model: Schema.optional(/*...*/),
  memory_model: Schema.optional(Schema.NullOr(Schema.String)).annotate({
    description:
      "Model for automatic project memory saves in the format of provider/model. If unset or unavailable, memory uses the session model.",
  }),
  default_agent: Schema.optional(Schema.NullOr(Schema.String)).annotate({
    description: "Default agent to use when none is specified...",
  }),
  // ...
})
```

**Additional work required**:
- In `src/core/memory/turn.ts` (or equivalent) — resolve `memory_model` from config; if null/invalid/unavailable, fall back to the session model. Reference commits `86fe6ef9f` and `fffcf0e2a`.
- SAP AI Core adaptation: when resolving the model string `provider/model`, ensure it routes through Alexi's SAP deployment resolver, not a hard-coded models.dev lookup.

```typescript
// src/core/memory/turn.ts (sketch)
async function resolveMemoryModel(cfg: Config, sessionModel: ModelRef): Promise<ModelRef> {
  const configured = cfg.memory_model
  if (!configured) return sessionModel
  try {
    const parsed = parseModelRef(configured) // "provider/model"
    if (await isModelAvailable(parsed)) return parsed
  } catch {
    // malformed — fall through
  }
  log.warn(`memory_model "${configured}" unavailable; falling back to session model`)
  return sessionModel
}
```

---

### 3. Finalize reasoning before stream retries
**File**: `src/session/processor.ts` (or Alexi's equivalent stream retry handler)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream commit `54eacd5ff` (kilocode) fixes a bug where retrying a stream after a transient failure leaves "thinking"/reasoning tokens in an unfinalized state, producing corrupted output. SAP AI Core streaming is likewise subject to transient failures, so Alexi almost certainly has the same latent bug. Reference `packages/opencode/test/kilocode/session-processor-incomplete-response-retry.test.ts` for the exact test pattern to adopt.

**Change pattern** (adapt to Alexi's processor):
```typescript
// Before retrying a stream:
async function retryStream(ctx: StreamContext) {
  // NEW: finalize any in-flight reasoning block before resetting state
  if (ctx.reasoningBuffer && !ctx.reasoningFinalized) {
    await emitReasoningPart(ctx, { done: true })
    ctx.reasoningFinalized = true
    ctx.reasoningBuffer = ""
  }
  // existing retry logic...
}
```

**Verification steps**:
- Port the test from `packages/opencode/test/kilocode/session-processor-incomplete-response-retry.test.ts`.
- Simulate a stream failure mid-reasoning and assert that: (a) the retried stream produces a clean reasoning block, (b) no partial reasoning tokens leak into the final message.

---

### 4. MCP OAuth consolidation + auth-failure classification
**File**: `src/mcp/index.ts`, new `src/mcp/auth-failure.ts`
**Priority**: medium
**Type**: feature + bugfix
**Reason**: Upstream commits `c9632e495` ("consolidate MCP OAuth in core") and `21ed2b9e` (auth-failure classification) move OAuth logic out of UI layers and into the core, with a reusable `AuthFailure` type. Even without Alexi's VS Code UI, Alexi likely runs MCP servers and needs to classify 401/403 responses as auth failures (vs transport errors) to surface actionable messages to the CLI user.

**New file**: `src/mcp/auth-failure.ts`
```typescript
// Mirror packages/opencode/src/kilocode/mcp/auth-failure.ts
export type McpAuthFailure = {
  kind: "oauth-required" | "token-expired" | "forbidden" | "unknown-auth"
  serverId: string
  message: string
  cause?: unknown
}

export function classifyAuthFailure(serverId: string, error: unknown): McpAuthFailure | null {
  const status = extractHttpStatus(error)
  if (status === 401) {
    const wwwAuth = extractHeader(error, "www-authenticate") ?? ""
    if (/oauth|bearer/i.test(wwwAuth)) {
      return { kind: "oauth-required", serverId, message: "Server requires OAuth sign-in", cause: error }
    }
    return { kind: "token-expired", serverId, message: "Auth token expired or invalid", cause: error }
  }
  if (status === 403) {
    return { kind: "forbidden", serverId, message: "Access forbidden", cause: error }
  }
  return null
}

function extractHttpStatus(e: unknown): number | undefined { /* ... */ }
function extractHeader(e: unknown, name: string): string | undefined { /* ... */ }
```

**Integration in** `src/mcp/index.ts`:
```typescript
// When an MCP tool call fails, classify and surface:
const failure = classifyAuthFailure(server.id, err)
if (failure) {
  bus.publish("mcp.auth-failed", failure)
  // For CLI: print actionable guidance (e.g. "run `alexi mcp login <server>`")
  throw new McpAuthError(failure)
}
```

**Verification steps**:
- Port tests from `packages/opencode/test/kilocode/mcp/auth-classification.test.ts` and `auth-failure.test.ts`.

---

### 5. Clear cached MCP status when a server is uninstalled / scoped purge
**File**: `src/mcp/registry.ts` (or wherever Alexi tracks MCP runtime status)
**Priority**: medium
**Type**: bugfix
**Reason**: Upstream commits `c58468b1c` and `d395d0314` fix stale MCP status entries persisting after uninstall, and ensure that purging only clears the scope that owned the entry (user vs project scope). Prevents misleading "signed in / connected" status for removed servers.

**Change pattern**:
```typescript
// src/mcp/registry.ts
export function uninstallServer(serverId: string, scope: McpScope) {
  // NEW: only purge status entries that belong to this scope
  mcpStatusCache.deleteWhere((entry) =>
    entry.serverId === serverId && entry.ownerScope === scope
  )
  // existing uninstall log
{"prompt_tokens":25203,"completion_tokens":4096,"total_tokens":29299,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: ddd2a4cf-83da-4201-90c6-e852f96c1803]
[Messages: 2, Tokens: 29299]
