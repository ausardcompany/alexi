# Execution Task: Apply Update Plan to Alexi

You are an expert software developer. Your task is to execute the update plan below precisely.

## Update Plan to Execute

# Update Plan for Alexi

Generated: 2026-10-22
Based on upstream commits analyzed:
- **kilocode**: 4481e06d8 (PR link ingest), 2f452d7a5 (session host registry), 2e1793154 (MCP prompt content preservation), f18d9006c (session host contracts)
- **opencode**: c87f6b7 (compaction keepID validation), 3260ec7 (legacy apply_patch → edit), 0c8e7a9 (preserve Permission.Error), 6a5f15a (ignore unsupported agent colors), 6709f56 (compaction output limit), ab249a9 (cache breakpoints), 870ab9d (baseURL override), 93bf002 (shared isRecord/stringify), 9c8e9e4 (remove NamedError/iife), 248bfbe (codemode fetch display args), e441daf (Windows service port), c93aaae (fs.watch graceful fallback)

## Summary
- Total changes planned: 14
- Critical: 2 | High: 5 | Medium: 5 | Low: 2

## Changes

### 1. Preserve Permission.Error in FileAccess Interface
**File**: `src/permission/file-access.ts` (or `src/permission/index.ts`)
**Priority**: critical
**Type**: bugfix
**Reason**: Upstream fix (opencode 0c8e7a9) — the permission error type was being lost at the FileAccess boundary, causing permission errors to surface as generic errors. Critical for correct permission enforcement, especially important in SAP AI Core where permission tracking is auditable.

**Current code** (likely pattern):
```typescript
export const checkAccess = (path: string): Effect.Effect<void, Error> =>
  Permission.check(path).pipe(
    Effect.mapError((e) => new Error(e.message))
  )
```

**New code**:
```typescript
export const checkAccess = (path: string): Effect.Effect<void, Permission.Error> =>
  Permission.check(path) // propagate Permission.Error unchanged
```

Ensure the `FileAccess.Interface` error channel is typed as `Permission.Error` (or union including it) rather than being flattened.

---

### 2. Validate Compaction keepID with SessionMessage.ID schema
**File**: `src/core/session/compaction.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Upstream fix (opencode c87f6b7) — `keepID` was not being validated against the message ID schema, which could produce silent corruption during compaction. Important because Alexi's SAP AI Core sessions must preserve message history consistency.

**Current code**:
```typescript
export const compact = (opts: { keepID?: string; ... }) => {
  const keep = opts.keepID
  // ...
}
```

**New code**:
```typescript
import { SessionMessage } from "../session/message.js"

export const compact = (opts: { keepID?: string; ... }) => {
  const keep = opts.keepID
    ? SessionMessage.ID.make(opts.keepID) // validate via schema
    : undefined
  // ...
}
```

---

### 3. Give compaction summaries the same output limit as normal turns
**File**: `src/core/session/compaction.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream fix (opencode 6709f56) — compaction was truncating summaries too aggressively, losing context. Especially impactful for long-running SAP AI Core sessions where compaction is more frequent due to token limits.

**New code** (locate the max-output option when building the compaction generation request):
```typescript
const generation = yield* Generation.create({
  model,
  messages: compactionMessages,
  // BEFORE: maxOutputTokens: COMPACTION_MAX_TOKENS,
  // AFTER: use the same cap as a normal turn
  maxOutputTokens: model.limit?.output ?? DEFAULT_MAX_OUTPUT,
})
```

---

### 4. Map legacy `apply_patch` permissions to `edit`
**File**: `src/permission/migrate.ts` (create if missing) or `src/permission/saved.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream fix (opencode 3260ec7) — legacy saved permissions use the removed `apply_patch` tool name; without migration, saved permissions are orphaned and prompt users repeatedly. Alexi inherits saved-permission storage so needs the same migration.

**New code**:
```typescript
// src/permission/saved.ts (loader)
const LEGACY_TOOL_MAP: Record<string, string> = {
  apply_patch: "edit",
}

function migrateToolName(name: string): string {
  return LEGACY_TOOL_MAP[name] ?? name
}

// in load():
const saved = rows.map((row) => ({
  ...row,
  tool: migrateToolName(row.tool),
}))
```

Add a unit test asserting legacy `apply_patch` rows load as `edit`.

---

### 5. Let configured provider baseURL override catalog model endpoints
**File**: `src/providers/sap-ai-core.ts` / `src/providers/index.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream fix (opencode 870ab9d) — when a user configures a `baseURL` override for a provider, the catalog's model-specific endpoint was still winning. Highly relevant for Alexi: SAP AI Core deployments **always** need a custom base URL per tenant, so this prevents the catalog from stomping tenant endpoints.

**Current code**:
```typescript
function resolveEndpoint(model: Model, provider: Provider) {
  return model.endpoint ?? provider.baseURL ?? DEFAULT
}
```

**New code**:
```typescript
function resolveEndpoint(model: Model, provider: Provider) {
  // Explicit provider baseURL (user config) overrides catalog model endpoint
  return provider.baseURL ?? model.endpoint ?? DEFAULT
}
```

Add a test ensuring an SAP AI Core base URL overrides any catalog `endpoint` on the model definition.

---

### 6. Skip non-cacheable content parts when placing cache breakpoints
**File**: `src/providers/cache-policy.ts` (or wherever cache breakpoint logic lives)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream fix (opencode ab249a9) — cache breakpoints were being placed on non-cacheable content parts (e.g., images, ephemeral tool results), invalidating the cache. Affects token economy on all providers; important for SAP AI Core cost tracking.

**New code**:
```typescript
function placeBreakpoint(parts: ContentPart[]) {
  // Only place on cacheable parts (text, tool-result with text payload)
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i]
    if (p.type === "text" || (p.type === "tool-result" && hasTextOutput(p))) {
      p.providerOptions = { ...p.providerOptions, cacheControl: { type: "ephemeral" } }
      return
    }
  }
}
```

---

### 7. Ignore unsupported agent colors (don't throw on config decode)
**File**: `src/agent/config.ts` or `src/agent/schema.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream fix (opencode 6a5f15a) — invalid color values in agent frontmatter crashed agent loading entirely. Agents should load with `color: undefined` instead.

**Current code**:
```typescript
export const AgentConfig = Schema.Struct({
  color: Schema.optional(ColorSchema),
  // ...
})
```

**New code**:
```typescript
export const AgentConfig = Schema.Struct({
  color: Schema.optional(
    Schema.transform(
      Schema.Unknown,
      Schema.UndefinedOr(ColorSchema),
      {
        decode: (v) => (isValidColor(v) ? v : undefined),
        encode: (v) => v,
      }
    )
  ),
  // ...
})
```

---

### 8. Add session host registry + Kilo Cloud adapter (session hosting abstraction)
**Files**:
- `src/session-hosting/types.ts` (new)
- `src/session-hosting/registry.ts` (new)
- `src/session-hosting/index.ts` (new)

**Priority**: medium
**Type**: feature
**Reason**: Upstream feature (kilocode 2f452d7a5, f18d9006c) — introduces a pluggable session host registry. For Alexi, this creates a clean seam to register SAP AI Core as a session host alongside any local/cloud hosts. Enables future SAP-hosted session restore/sync.

**New code** (`src/session-hosting/types.ts`):
```typescript
export interface SessionHost {
  readonly id: string
  readonly displayName: string
  readonly supports: (sessionID: string) => boolean
  readonly restore: (sessionID: string) => Promise<SessionSnapshot | undefined>
  readonly list?: () => Promise<SessionSummary[]>
}

export interface SessionSnapshot { /* ... */ }
export interface SessionSummary { id: string; title: string; updatedAt: number }
```

**New code** (`src/session-hosting/registry.ts`):
```typescript
const hosts = new Map<string, SessionHost>()

export const register = (host: SessionHost) => {
  hosts.set(host.id, host)
}
export const get = (id: string) => hosts.get(id)
export const list = () => Array.from(hosts.values())
export const resolveForSession = (sessionID: string): SessionHost | undefined =>
  list().find((h) => h.supports(sessionID))
```

Register an SAP AI Core host adapter in `src/providers/sap-ai-core.ts` on module init.

---

### 9. Preserve MCP prompt content (no shell expansion on prompt strings)
**File**: `src/core/session/prompt.ts` or `src/tool/mcp.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Upstream fix (kilocode 2e1793154) — MCP prompt content was being passed through shell expansion, mangling `$VAR` and backticks. Fix preserves the raw content.

**Current code**:
```typescript
const expanded = shellExpand(mcpPrompt.content)
```

**New code**:
```typescript
// MCP prompts are user content, not shell commands; do not expand.
const content = mcpPrompt.content
```

Add a regression test: an MCP prompt containing `$HOME` must remain literal `$HOME`.

---

### 10. Introduce shared `isRecord` and `stringify` helpers; drop redundant decoding
**File**: `src/util/record.ts` (new), apply across callsites
**Priority**: medium
**Type**: refactor
**Reason**: Upstream refactor (opencode 93bf002, 7012c9d, 6dfc681) — consolidates `isRecord` type guard + `stringify` helper and removes redundant re-decoding of already-branded data. Reduces duplicated runtime validation in hot paths (session inbox, projector, prompt).

**New code** (`src/util/record.ts`):
```typescript
export const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v)

export const stringify = (v: unknown): string => {
  if (typeof v === "string") return v
  try { return JSON.stringify(v) } catch { return String(v) }
}
```

Then audit `src/core/session/{inbox,projector,prompt}.ts` and `src/providers/*.ts` for inline `typeof x === "object" && x !== null` checks and replace with `isRecord`. Rem
{"prompt_tokens":15088,"completion_tokens":4096,"total_tokens":19184,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 3034f6b1-0c6a-4d59-a5e8-d52c6cd91c27]
[Messages: 2, Tokens: 19184]

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
