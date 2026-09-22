# Update Plan for Alexi

Generated: 2026-09-22
Based on upstream commits analyzed:
- kilocode: f47c29dfe..28680d812 (301 commits)
- opencode: 70a2469..fe3f3a4 (6 commits)

## Summary
- Total changes planned: 14
- Critical: 2 | High: 5 | Medium: 5 | Low: 2

## Changes

### 1. Fix Cloudflare AI Gateway token leakage to third-party providers
**File**: `src/providers/cloudflare-ai-gateway.ts` (or `src/core/plugin/provider/cloudflare-ai-gateway.ts`)
**Priority**: critical
**Type**: security
**Reason**: The Cloudflare API token was being sent to non-Workers-AI upstream providers via the Unified API, leaking BYOK credentials. Only Workers AI (`workers-ai/*` and `@cf/*`) should receive the Cloudflare token; third-party providers must use the gateway's stored keys.

**Current code**:
```typescript
const unified = createUnified({ apiKey: config.apiKey })
evt.sdk = {
  languageModel(modelID: string) {
    return gateway(unified(modelID))
  },
}
```

**New code**:
```typescript
evt.sdk = {
  languageModel(modelID: string) {
    // Workers AI is the only first-party provider whose upstream is Cloudflare itself, so it is
    // the only one that should receive the Cloudflare token as its upstream Authorization header.
    // The Unified API addresses Workers AI both with the explicit "workers-ai/" prefix and as
    // bare "@cf/..." ids. Third-party providers must not receive the token; they rely on the
    // gateway's stored/BYOK keys instead.
    const isWorkersAi = modelID.startsWith("workers-ai/") || modelID.startsWith("@cf/")
    const unified = createUnified(isWorkersAi ? { apiKey: config.apiKey } : {})
    return gateway(unified(modelID))
  },
}
```

---

### 2. Scope provider auth loading to enabled_providers allowlist
**File**: `src/providers/provider.ts` or `src/cli/provider-auth.ts`
**Priority**: critical
**Type**: security
**Reason**: Upstream fix `9340d34f5` — providers excluded via `enabled_providers` should be filtered *before* running auth loaders. This prevents unnecessary credential loading and surfacing auth errors for disabled providers (important for SAP AI Core deployments where only specific providers are approved).

**New code** (add to provider initialization):
```typescript
// Filter providers by the enabled_providers allowlist before invoking auth loaders.
function filterEnabledProviders(
  providers: Record<string, ProviderConfig>,
  enabled?: string[],
): Record<string, ProviderConfig> {
  if (!enabled || enabled.length === 0) return providers
  const allow = new Set(enabled)
  return Object.fromEntries(
    Object.entries(providers).filter(([id]) => allow.has(id)),
  )
}

// Use before loading auth:
const active = filterEnabledProviders(cfg.provider ?? {}, cfg.enabled_providers)
for (const [id, prov] of Object.entries(active)) {
  await loadAuth(id, prov)
}
```

---

### 3. Fix ripgrep unicode/surrogate pair corruption in previews
**File**: `src/core/ripgrep.ts` (or `src/tool/grep.ts`)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream commit `6c035e1fd` — truncating a text match at 2000 chars can split a UTF-16 surrogate pair, producing invalid strings that break downstream JSON serialization and rendering.

**Current code**:
```typescript
text: match.lines.text.length > 2_000 ? match.lines.text.slice(0, 2_000) + "..." : match.lines.text,
```

**New code**:
```typescript
text:
  match.lines.text.length > 2_000
    ? match.lines.text.slice(0, 2_000).replace(/[\uD800-\uDBFF]$/, "") + "..."
    : match.lines.text,
```

---

### 4. Update compaction system prompt to be more structured
**File**: `src/agent/prompts/compaction.ts` (or `src/agent/index.ts`)
**Priority**: high
**Type**: feature
**Reason**: Upstream `dab263721` and follow-ups — smaller models like DSv4 Flash produced poor summaries; the new prompt emphasizes structured output and prevents the model from responding to the conversation being summarized. Improves compaction quality across all models routed via SAP AI Core.

**Current code**:
```typescript
const PROMPT_COMPACTION = `You are an anchored context summarization assistant for coding sessions.

Summarize only the conversation history you are given. The newest turns may be kept verbatim outside your summary, so focus on the older context that still matters for continuing the work.

If the prompt includes a <previous-summary> block, treat it as the current anchored summary. Update it with the new history by preserving still-true details, removing stale details, and merging in new facts.

Always follow the exact output structure requested by the user prompt. Keep every section, preserve exact file paths and identifiers when known, and prefer terse bullets over paragraphs.

Do not answer the conversation itself. Do not mention that you are summarizing, compacting, or merging context. Respond in the same language as the conversation.`
```

**New code**:
```typescript
const PROMPT_COMPACTION = `You are a context summarization agent. You are given a conversation between a user and an agent. Your goal is to produce a structured summary matching the format specified so another coding agent can continue the work.

Always follow the exact output structure requested by the user prompt. Keep every section, preserve exact file paths and identifiers when known, and prefer terse bullets over paragraphs.

Do not continue the conversation. Do not respond to any questions in the conversation. Only output the structured summary in the exact format requested by the user prompt. Respond in the same language as the conversation.`
```

---

### 5. Fix Node.js npm package entrypoint resolution
**File**: `src/core/npm.ts` (if Alexi has npm/plugin loading)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream `ba341c6` — under Node runtime, `import.meta.resolve(name, dir)` requires `--experimental-import-meta-resolve` and `import()` of a directory throws `ERR_UNSUPPORTED_DIR_IMPORT`. Using `createRequire().resolve()` correctly picks the `require`/`default` export.

**Current code**:
```typescript
try {
  entrypoint = typeof Bun !== "undefined" ? import.meta.resolve(name, dir) : import.meta.resolve(dir)
} catch {
  entrypoint = undefined
}
```

**New code**:
```typescript
import { createRequire } from "module"
import { pathToFileURL } from "url"

try {
  // Node only honors the parent argument behind --experimental-import-meta-resolve, and
  // import() of the bare package directory fails with ERR_UNSUPPORTED_DIR_IMPORT. require
  // resolution picks the "require"/"default" export target, which import() loads fine.
  entrypoint =
    typeof Bun !== "undefined"
      ? import.meta.resolve(name, dir)
      : pathToFileURL(createRequire(path.join(dir, "package.json")).resolve(name)).href
} catch {
  entrypoint = undefined
}
```

---

### 6. Scope MCP permission input metadata to MCP asks only
**File**: `src/permission/index.ts` or `src/permission/handler.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream `17401e3bb` and `390b92cf9` — permission prompts for non-MCP tools were incorrectly receiving MCP argument metadata. Also, pending MCP tool arguments must be shown in the permission prompt so users can review before approval.

**New code** (in permission ask handler):
```typescript
interface PermissionAsk {
  type: "tool" | "mcp" | "shell" | "edit"
  // ...existing fields
  metadata?: {
    // Only include MCP-specific metadata for MCP asks
    mcp?: {
      server: string
      tool: string
      arguments: unknown  // pending args shown in prompt
    }
  }
}

function buildAsk(kind: string, input: any): PermissionAsk {
  const ask: PermissionAsk = { type: kind as any, /* ... */ }
  if (kind === "mcp") {
    ask.metadata = {
      mcp: {
        server: input.server,
        tool: input.tool,
        arguments: input.arguments, // surface pending args
      },
    }
  }
  return ask
}
```

---

### 7. Retry dropped permission replies
**File**: `src/permission/index.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream `675ed4b12` and `499a1ca5e` — permission replies could be dropped if the client disconnected/reconnected, leaving the agent stuck. Retry logic ensures the tool call resumes after transient failures.

**New code**:
```typescript
async function replyWithRetry(askId: string, response: PermissionResponse, maxAttempts = 3) {
  let lastError: unknown
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await bus.publish("permission.reply", { askId, response })
    } catch (err) {
      lastError = err
      // Exponential backoff with jitter
      await new Promise((r) => setTimeout(r, 100 * 2 ** attempt + Math.random() * 50))
    }
  }
  throw lastError
}
```

---

### 8. Expand retryable network/stream error patterns
**File**: `src/core/session/retry.ts` or `src/providers/retry.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Upstream commits `e0b9e68a6`, `40282c1d4`, `71d08e94d`, `61aefc075` — several transient errors (raw network variants, xAI capacity errors, generic terminated streams) were not being retried, causing session failures. Improves reliability for SAP AI Core streaming.

**New code** (expand retryable classifier):
```typescript
const RETRYABLE_PATTERNS = [
  /ECONNRESET/i,
  /ETIMEDOUT/i,
  /socket hang up/i,
  /premature close/i,
  /terminated/i,
  /network error/i,
  /fetch failed/i,
  /capacity/i,          // xAI capacity errors
  /rate.?limit/i,
  /overloaded/i,
  /service unavailable/i,
  /gateway timeout/i,
  /connection.*(closed|reset|aborted)/i,
]

export function isRetryableError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err)
  return RETRYABLE_PATTERNS.some((p) => p.test(msg))
}

// Cap retries with jitter
export function computeBackoff(attempt: number, maxMs = 30_000): number {
  const base = Math.min(1000 * 2 ** attempt, maxMs)
  return base + Math.random() * 500
}
```

---

### 9. Surface subagent tool errors instead of swallowing them
**File**: `src/tool/task.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Upstream `35fe5b721` and `c313504c8` — subagent (task tool) errors were being silently absorbed, making failures hard to diagnose. Errors should propagate to the parent agent's tool result.

**New code** (in `task
{"prompt_tokens":38955,"completion_tokens":4096,"total_tokens":43051,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 5c66681e-6c36-4f8e-8f3a-0148e1d0a5a6]
[Messages: 2, Tokens: 43051]
