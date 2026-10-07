```markdown
# Update Plan for Alexi

Generated: 2026-10-07
Based on upstream commits analyzed:
- kilocode: 4433f275f..5e9f816fc (126 commits, v7.8.3 → v7.8.8)
- opencode: 3f393d7..ecc4916 (8 commits, v1.18.34 → v1.18.35)

## Summary
- Total changes planned: 8
- Critical: 1 | High: 3 | Medium: 3 | Low: 1

Alexi's shared surface with upstream is small — primarily the board tool, the `link-pr` test import style, and the message-diagnostics/overlay/MCP OAuth features relevant to kilocode's opencode fork. The vast majority of upstream changes (VSCode webview UI, agent-manager sidebar, docs, workflows, visual regression baselines) do not apply to Alexi.

## Changes

### 1. Harden message diagnostics against malformed envelopes
**File**: `src/core/message-diagnostics.ts` (new, or integrate into existing `src/core/` diagnostics)
**Priority**: critical
**Type**: security / bugfix
**Reason**: Kilocode upstream (`packages/opencode/src/kilocode/session/message-diagnostics.ts`, +182 lines) adds a diagnostics helper that:
- Guards against pathological `zod` issue shapes
- Prevents prompt-text leaks in diagnostics output (commits `a8fbcc356`, `d99cdbbe2`, `3b5a4de22`, `6c894a552`, `1f093ffed`)
- Logs structural diagnostics on `ModelMessage[]` schema failure without surfacing user content

If Alexi logs session/model messages for debugging or telemetry (SAP AI Core observability), raw prompt bodies may leak into logs. This is a privacy/security concern for SAP tenants.

**New code** (adapt the upstream pattern):
```typescript
// src/core/message-diagnostics.ts
import { Schema } from "effect"

type ZodLikeIssue = {
  path?: ReadonlyArray<unknown>
  code?: unknown
  message?: unknown
}

const MAX_PATH_SEGMENTS = 32
const MAX_ISSUES = 50

/**
 * Produce a structural, prompt-free summary of a schema validation failure.
 * Never includes raw message text, tool arguments, or user content.
 */
export function summarizeSchemaFailure(error: unknown): {
  issues: ReadonlyArray<{ path: string; code: string; messageKind: string }>
  truncated: boolean
} {
  const rawIssues = extractIssues(error).slice(0, MAX_ISSUES)
  const truncated = extractIssues(error).length > MAX_ISSUES
  return {
    issues: rawIssues.map((issue) => ({
      path: safePath(issue.path),
      code: safeString(issue.code, "unknown_code"),
      // Only record *kind* of message, not its content, to avoid prompt leak
      messageKind: typeof issue.message === "string" ? "string" : typeof issue.message,
    })),
    truncated,
  }
}

function extractIssues(error: unknown): ZodLikeIssue[] {
  if (!error || typeof error !== "object") return []
  const anyErr = error as { issues?: unknown; errors?: unknown }
  const candidate = Array.isArray(anyErr.issues)
    ? anyErr.issues
    : Array.isArray(anyErr.errors)
      ? anyErr.errors
      : []
  return candidate.filter((i): i is ZodLikeIssue => !!i && typeof i === "object")
}

function safePath(path: unknown): string {
  if (!Array.isArray(path)) return "<root>"
  return path
    .slice(0, MAX_PATH_SEGMENTS)
    .map((seg) => (typeof seg === "string" || typeof seg === "number" ? String(seg) : "?"))
    .join(".")
}

function safeString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.length < 128 ? value : fallback
}

/**
 * Structural summary of a message envelope that excludes any text content.
 */
export function summarizeMessageEnvelope(message: unknown): Record<string, unknown> {
  if (!message || typeof message !== "object") return { shape: typeof message }
  const m = message as Record<string, unknown>
  const parts = Array.isArray(m.parts) ? m.parts : []
  return {
    role: typeof m.role === "string" ? m.role : "<missing>",
    partCount: parts.length,
    partKinds: parts.slice(0, 20).map((p) => (p && typeof p === "object" ? (p as any).type ?? "?" : typeof p)),
    hasId: typeof m.id === "string",
  }
}
```

Wire this into any existing LLM dispatch error paths (likely `src/core/llm.ts` or similar) in place of `JSON.stringify(message)` on failure branches.

---

### 2. Update board tool description — forbid self-posting, surface self identity
**File**: `src/tool/board.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream commit `759a6ef99` ("fix(board): expose self identity on the roster and make self-post failures actionable") updates the `BoardPostTool` and `to` field schema to:
- Clarify that each participant's own row is flagged `self: true`
- Explicitly reject posts to self with an actionable error
- Remove the "not yourself" clause from the long description (now enforced at runtime)

This prevents agents from no-op messaging themselves and makes multi-agent board interactions deterministic.

**Current code** (`src/tool/board.ts`, `Post` schema and `BoardPostTool.description`):
```typescript
const Post = Schema.Struct({
  to: Schema.String.annotate({
    description:
      "A known participant ID from Task or board_read. main is the board root, not necessarily your parent. ALL is for team-wide updates.",
  }),
  // ...
})

// in BoardPostTool.description:
"...including parents, children, and background siblings, not yourself. Inform the coordinator..."
```

**New code**:
```typescript
const Post = Schema.Struct({
  to: Schema.String.annotate({
    description:
      "A known participant ID from Task or board_read; your own row is flagged self: true (the main row is the board root), and a post to yourself is refused. ALL is for team-wide updates.",
  }),
  // ...
})

// in BoardPostTool.description:
"...including parents, children, and background siblings. Inform the coordinator..."
```

Also add a runtime guard in the Post execute path:
```typescript
// in BoardPostTool.execute (or equivalent handler)
if (input.to === self.id) {
  return Effect.fail(
    new BoardPostError({
      kind: "self_post",
      message: `Refusing board post to self (${self.id}). Use board_read to review your own row (self: true) instead.`,
    }),
  )
}
```

And update `board/store.ts` roster emission to tag `self: true` on the acting participant row (mirrors `packages/opencode/src/kilocode/board/store.ts` +10 line change).

---

### 3. Preserve commit-message provider errors
**File**: `src/providers/commit-message.ts` or `src/tool/commit-message.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Commit `f54e713dd` ("fix(cli): preserve commit-message provider errors") stops upstream from swallowing provider errors when generating commit messages (relevant if Alexi exposes a similar git/commit integration against SAP AI Core).

**Current code** (if generator catches and returns a generic failure):
```typescript
try {
  const message = yield* generateCommitMessage(diff)
  return message
} catch {
  return yield* Effect.fail(new CommitMessageFailure({ reason: "unknown" }))
}
```

**New code**:
```typescript
return yield* generateCommitMessage(diff).pipe(
  Effect.mapError((cause) =>
    new CommitMessageFailure({
      // preserve the originating provider error so callers can surface it
      reason: cause instanceof Error ? cause.message : String(cause),
      cause,
    }),
  ),
)
```

Also add a regression test modeled on `test/kilocode/server/commit-message-no-changes.test.ts` (+48 lines) that asserts the provider error reaches the caller unaltered.

---

### 4. MCP OAuth: allow re-authorization at a new authorization server
**File**: `src/providers/mcp/oauth-provider.ts` (or wherever MCP OAuth lives in Alexi)
**Priority**: high
**Type**: bugfix / security
**Reason**: Commit `84b26c697` ("fix(cli): let configured MCP OAuth clients re-authorize at a new authorization server") plus the new `oauth-issuer.ts` (+48 lines) and tests (+142 lines). When an MCP server rotates its authorization server (AS) endpoint, the current client caches the old issuer and fails indefinitely. The fix detects an issuer change and triggers re-registration.

This is critical for SAP integrations where identity providers may rotate.

**New code** (new helper, mirroring upstream `oauth-issuer.ts`):
```typescript
// src/providers/mcp/oauth-issuer.ts
export function hasIssuerChanged(
  stored: { issuer?: string; authorization_endpoint?: string } | undefined,
  discovered: { issuer: string; authorization_endpoint: string },
): boolean {
  if (!stored?.issuer) return false
  return (
    stored.issuer !== discovered.issuer ||
    stored.authorization_endpoint !== discovered.authorization_endpoint
  )
}

export function requireReregistration(
  stored: StoredClient | undefined,
  discovered: DiscoveredMetadata,
): "none" | "issuer_rotated" {
  if (!stored) return "none"
  if (hasIssuerChanged(stored, discovered)) return "issuer_rotated"
  return "none"
}
```

**Integration** in the OAuth provider:
```typescript
// Before performing a token refresh, check issuer drift
const action = requireReregistration(storedClient, discoveredMetadata)
if (action === "issuer_rotated") {
  yield* clearStoredClient(serverId)
  yield* clearStoredTokens(serverId)
  // Fall through to a fresh dynamic client registration
}
```

---

### 5. Config overlay: reject shadowed writes
**File**: `src/core/config/overlay.ts` (or `src/cli/config/`)
**Priority**: medium
**Type**: bugfix
**Reason**: Commits `b9e4b1e98`, `b1395f98d`, `506fa0876`, `5ee9257b8` surface shadowed config overlay writes before saving — i.e., a write to a key that would be overridden by a higher-precedence overlay silently takes no effect. For SAP tenants layering `managed` configs over user configs, this prevents confusing silent drops.

Only apply if Alexi has a layered/overlay config system.

**New code**:
```typescript
// src/core/config/overlay.ts
export function detectShadowedWrite(
  key: string,
  targetOverlay: OverlayId,
  layers: ReadonlyArray<{ id: OverlayId; precedence: number; keys: ReadonlySet<string> }>,
): { shadowedBy: OverlayId } | null {
  const target = layers.find((l) => l.id === targetOverlay)
  if (!target) return null
  const shadower = layers.find((l) => l.precedence > target.precedence && l.keys.has(key))
  return shadower ? { shadowedBy: shadower.id } : null
}

export function writeOverlay(
  key: string,
  value: un
{"prompt_tokens":26948,"completion_tokens":4096,"total_tokens":31044,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 48b8ecfd-75ec-4fdf-ae94-0a0164eab93a]
[Messages: 2, Tokens: 31044]
