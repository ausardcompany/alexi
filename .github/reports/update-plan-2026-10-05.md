```markdown
# Update Plan for Alexi

Generated: 2026-10-05
Based on upstream commits analyzed:
- a93088bfe (merge: workflows/slack docs)
- 94ec691ad (merge: holistic-sprite)
- 501286ba9 (fix: gate per-pattern retry on invalid globs)
- 93519a31c (fix: honor ignore files and harden marketplace suggestion scan)
- 21164ba0b (fix: scan workspace for suggestions in backend)
- d894e6535 (fix: let backend assign peer prompt message IDs)
- bf5705bb3 (fix: agent-manager peer turns)
- b1642e87c / 07b18a1a2 / 88f8ea950 / 59313c749 / 5539dd3ae (catalog recovery hardening)
- 2792c704e (fix: keep valid models when provider config contains malformed entry)
- b0aeda50b (fix: skill frontmatter cache)
- 3e4c6dd51 (fix: pause hidden working spinner after turn ends)
- b8d0cf1ac (fix: MCP tool output overflow)
- 088355899 (fix: preserve staged renames on worktree continue)

## Summary
- Total changes planned: 7
- Critical: 1 | High: 3 | Medium: 2 | Low: 1

The majority of upstream changes target the VS Code extension UI (`kilo-vscode`), agent-manager webview, i18n, and visual regression tests — none of which exist in Alexi. The changes with meaningful backend/core relevance are focused on:

1. Ripgrep glob API hardening (invalid-pattern classification + ignore-file honoring).
2. Agent orchestration peer-prompt message ID handling.
3. Catalog recovery retry logic for model/provider loading.
4. Provider model-cache resilience to malformed provider entries.
5. Skill/markdown frontmatter cache correctness.

## Changes

### 1. Ripgrep: classify invalid glob patterns and support new flags
**File**: `src/core/ripgrep.ts` (or wherever Alexi wraps ripgrep spawn/glob)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream now distinguishes malformed globs from transient errors, honors ignore files outside git repos (`--no-require-git`), and supports additional exclusion globs. This prevents the marketplace/suggestion scan from falsely retrying and from scanning ignored paths. Alexi's search/scan code paths benefit from the same hardening.

**Current code** (reference from upstream before):
```typescript
export interface GlobInput {
  readonly cwd: string
  readonly pattern: string
  readonly limit?: number
  readonly hidden?: boolean
  readonly follow?: boolean
  readonly signal?: AbortSignal
  readonly validate?: Effect.Effect<void, unknown>
}

export interface SearchResult<A> {
  readonly items: readonly A[]
  readonly truncated: boolean
  readonly partial: boolean
}

const isInvalidPattern = (stderr: string) =>
  stderr.includes("regex parse error") || stderr.includes("error parsing regex")
```

**New code**:
```typescript
export interface GlobInput {
  readonly cwd: string
  readonly pattern: string
  readonly limit?: number
  readonly hidden?: boolean
  readonly follow?: boolean
  readonly signal?: AbortSignal
  readonly validate?: Effect.Effect<void, unknown>
  // alexi: honor ignore files outside a git repository
  readonly noRequireGit?: boolean
  // alexi: additional exclusion globs
  readonly exclude?: readonly string[]
}

export interface SearchResult<A> {
  readonly items: readonly A[]
  readonly truncated: boolean
  readonly partial: boolean
  // alexi: distinguish malformed globs from transient errors
  readonly invalidPattern?: boolean
}

const isInvalidPattern = (stderr: string) =>
  stderr.includes("regex parse error") ||
  stderr.includes("error parsing regex") ||
  stderr.includes("error parsing glob")
```

And in the spawn args assembly:
```typescript
args: [
  // ...existing args...
  "--files",
  ...(input.hidden ? ["--hidden"] : []),
  ...(input.follow ? ["--follow"] : []),
  ...(input.noRequireGit ? ["--no-require-git"] : []),
  `--glob=${input.pattern}`,
  ...(input.exclude ?? []).map((glob) => `--glob=!${glob}`),
],
```

Also propagate `pattern` into the spawn result so callers can surface it:
```typescript
return spawn({
  cwd: input.cwd,
  limit: input.limit,
  signal: input.signal,
  pattern: input.pattern, // surface malformed globs
  timeout: 2 * 60 * 1000,
  validate: input.validate,
  args: [...],
})
```

Callers that consume `SearchResult` should branch on `invalidPattern` and avoid retrying such patterns.

---

### 2. Agent orchestration: stop forcing client-generated peer-prompt message IDs
**File**: `src/agent/orchestration.ts` (or equivalent — Alexi's peer prompt / sub-agent dispatch module)
**Priority**: critical
**Type**: bugfix
**Reason**: Upstream fix d894e6535 removes the client-generated `messageID: msg_agent_manager_<id>` because the backend assigns chronological IDs. Forcing a client-side ID causes peer prompts to be scoped out of session history (ordering issues, duplicates). If Alexi carries any analogous "peer prompt" / sub-agent prompt dispatch that passes `messageID`, it must be removed.

**Current code**:
```typescript
export async function prompt(input: {
  client: KiloClient
  root: string
  state: WorktreeStateManager
  sessionID: string
  text: string
  messageID: string
  signal?: AbortSignal
  managed?: ManagedSession
  directory?: string
  // ...
}) {
  // ...
  await client.session.promptAsync({
    sessionID: input.sessionID,
    directory: target.dir,
    messageID: `msg_agent_manager_${input.messageID}`,
    parts: [{ type: "text", text: input.text, ...(input.metadata ? { metadata: input.metadata } : {}) }],
    model: input.model,
    variant: input.variant,
    // ...
  })
}
```

**New code**:
```typescript
export async function prompt(input: {
  client: KiloClient
  root: string
  state: WorktreeStateManager
  sessionID: string
  text: string
  // messageID removed — backend assigns chronological ID
  signal?: AbortSignal
  managed?: ManagedSession
  directory?: string
  // ...
}) {
  // ...
  await client.session.promptAsync({
    sessionID: input.sessionID,
    directory: target.dir,
    // no messageID — let backend assign
    parts: [{ type: "text", text: input.text, ...(input.metadata ? { metadata: input.metadata } : {}) }],
    model: input.model,
    variant: input.variant,
    // ...
  })
}
```

Also update any bridge/caller (`AgentManagerOrchestrationBridge`-equivalent in Alexi) to drop the `messageID: input.request.id` field in the prompt payload.

Update corresponding unit tests to assert `messageID` is `undefined` for peer prompts.

---

### 3. Catalog recovery: bounded + rearmed retry with Retry-After honoring
**File**: `src/providers/catalog-retry.ts` (new) and `src/providers/catalog.ts` (consumer)
**Priority**: high
**Type**: bugfix
**Reason**: Multiple commits (07b18a1a2, b1642e87c, 88f8ea950, 59313c749, 5539dd3ae) harden the Kilo catalog recovery loop: (a) sustain retries after transient failures, (b) bound total retries, (c) rearm after success, (d) honor `Retry-After` response headers. SAP AI Core also has rate-limited catalog/model endpoints — this logic is directly reusable.

**New file** `src/providers/catalog-retry.ts`:
```typescript
export interface CatalogRetryOptions {
  readonly maxAttempts: number       // bound retries
  readonly baseDelayMs: number
  readonly maxDelayMs: number
}

export const DEFAULT_CATALOG_RETRY: CatalogRetryOptions = {
  maxAttempts: 5,
  baseDelayMs: 1_000,
  maxDelayMs: 30_000,
}

export function parseRetryAfter(header: string | null | undefined): number | undefined {
  if (!header) return undefined
  const secs = Number(header)
  if (Number.isFinite(secs) && secs >= 0) return secs * 1000
  const date = Date.parse(header)
  if (!Number.isNaN(date)) {
    const delta = date - Date.now()
    return delta > 0 ? delta : 0
  }
  return undefined
}

export async function withCatalogRetry<T>(
  fn: () => Promise<{ ok: true; value: T } | { ok: false; retryAfterMs?: number; error: unknown }>,
  opts: CatalogRetryOptions = DEFAULT_CATALOG_RETRY,
  signal?: AbortSignal,
): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt < opts.maxAttempts; attempt++) {
    if (signal?.aborted) throw signal.reason ?? new Error("aborted")
    const result = await fn()
    if (result.ok) return result.value
    lastError = result.error
    const backoff =
      result.retryAfterMs ??
      Math.min(opts.maxDelayMs, opts.baseDelayMs * 2 ** attempt)
    await new Promise((r) => setTimeout(r, backoff))
  }
  throw lastError
}
```

**Consumer update** in `src/providers/catalog.ts`:
```typescript
import { withCatalogRetry, parseRetryAfter } from "./catalog-retry"

export async function loadCatalog(signal?: AbortSignal) {
  return withCatalogRetry(async () => {
    try {
      const res = await fetch(CATALOG_URL, { signal })
      if (!res.ok) {
        const retryAfterMs = parseRetryAfter(res.headers.get("retry-after"))
        return { ok: false, retryAfterMs, error: new Error(`catalog ${res.status}`) }
      }
      return { ok: true, value: await res.json() }
    } catch (error) {
      return { ok: false, error }
    }
  }, DEFAULT_CATALOG_RETRY, signal)
}
```

After a successful recovery, "rearm" (reset) the retry counter in any surrounding scheduler so subsequent failures get a fresh retry budget.

---

### 4. Provider model cache: keep valid models when one entry is malformed
**File**: `src/providers/model-cache.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Commit 2792c704e fixes CLI dropping ALL models when a single provider config entry is malformed. For Alexi + SAP AI Core (which proxies many model variants), one malformed Zod/schema entry must not blow away the entire cache.

**Current code** (likely pattern):
```typescript
export function loadProviderModels(raw: unknown): Model[] {
  const parsed = ModelsSchema.parse(raw) // throws on any malformed entry
  return parsed.models
}
```

**New code**:
```typescript
export function loadProviderModels(raw: unknown): { models: Model[]; invalid:
{"prompt_tokens":16251,"completion_tokens":4096,"total_tokens":20347,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 2150bf29-5b0d-4a63-bad9-007816880a18]
[Messages: 2, Tokens: 20347]
