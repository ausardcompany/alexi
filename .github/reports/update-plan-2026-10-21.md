# Update Plan for Alexi

Generated: 2026-10-21
Based on upstream commits analyzed:
- `94bc566` - fix(core): keep unsupported MCP media out of tool attachments
- `aadd4d8` - feat(core): add OPENCODE_DISABLE_FREE_MODELS to hide free models
- `80b8762` - fix(core): forward retryAfterMs across provider session errors
- `a9fa57b` - feat(core): typed free-limit error with reset time
- `d2812d1` - fix(core): tighten session title prompt
- `5c52626` - fix(core): generate titles at the lowest model variant
- `15adc3d` - fix(core): send only changed entries in instruction updates
- `c3b613c` - fix(core): resolve relative directories during V1 migration
- `d898c04` - feat(core): add experimental.location_idle_timeout
- `89d996c` - fix(core): keep locations with running sessions or background jobs
- `e9ac459` - fix(core): build provider variants after package normalization
- `3b593dd` - fix(codemode): run each job to completion
- `3fdb13b` - fix(stats): retry failed syncs instead of waiting an hour

## Summary
- Total changes planned: 10
- Critical: 1 | High: 4 | Medium: 4 | Low: 1

## Changes

### 1. Filter unsupported MCP media from tool attachments
**File**: `src/tool/mcp.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Upstream fix (`94bc566`) prevents sending unsupported media types to models, which can crash the model request or lead to provider rejection errors. Important for SAP AI Core which has stricter media payload validation.

**Current code** (likely around media/content handling in MCP tool call result):
```typescript
// results from an MCP tool call are returned as part of the content array
const output = result.content.map((item) => {
  if (item.type === "text") return { type: "text", text: item.text }
  if (item.type === "image") return { type: "image", data: item.data, mimeType: item.mimeType }
  if (item.type === "resource") return { type: "resource", resource: item.resource }
  return item
})
```

**New code**:
```typescript
// Supported MIME types for attaching to tool outputs
const SUPPORTED_IMAGE_MIME = new Set(["image/png", "image/jpeg", "image/gif", "image/webp"])

const output: Array<ToolOutputPart> = []
const unsupported: string[] = []

for (const item of result.content) {
  if (item.type === "text") {
    output.push({ type: "text", text: item.text })
    continue
  }
  if (item.type === "image") {
    if (SUPPORTED_IMAGE_MIME.has(item.mimeType)) {
      output.push({ type: "image", data: item.data, mimeType: item.mimeType })
    } else {
      unsupported.push(`image/${item.mimeType}`)
    }
    continue
  }
  if (item.type === "resource") {
    // Only attach resources that are text or supported images
    if (item.resource.mimeType?.startsWith("text/")) {
      output.push({ type: "text", text: item.resource.text ?? "" })
    } else if (item.resource.mimeType && SUPPORTED_IMAGE_MIME.has(item.resource.mimeType)) {
      output.push({ type: "image", data: item.resource.blob, mimeType: item.resource.mimeType })
    } else {
      unsupported.push(item.resource.mimeType ?? "unknown")
    }
    continue
  }
  unsupported.push(item.type)
}

if (unsupported.length > 0) {
  output.push({
    type: "text",
    text: `[Omitted ${unsupported.length} unsupported attachment(s): ${unsupported.join(", ")}]`,
  })
}
```

### 2. Typed free-limit / rate-limit error with retry/reset time
**File**: `src/core/errors.ts` (or wherever `SessionError` is defined)
**Priority**: high
**Type**: feature
**Reason**: Upstream commits `a9fa57b` and `80b8762` introduce a typed error carrying `retryAfterMs` / reset time. For SAP AI Core we commonly hit quota (429) and need to surface rate-limit metadata to the UI / caller for retry UX.

**New code** (add to session error schema):
```typescript
export const SessionRateLimitError = Schema.TaggedStruct("SessionRateLimitError", {
  message: Schema.String,
  retryAfterMs: Schema.optional(Schema.Number),
  resetAt: Schema.optional(Schema.DateFromString),
  provider: Schema.optional(Schema.String),
})
export type SessionRateLimitError = Schema.Schema.Type<typeof SessionRateLimitError>

// In the SessionError union, add this variant alongside existing errors.
export const SessionError = Schema.Union(
  // ...existing variants...
  SessionRateLimitError,
)
```

**Translator helper** in `src/providers/sap-ai-core.ts`:
```typescript
function toSessionError(err: unknown): SessionError {
  if (isProviderError(err) && err.status === 429) {
    const headerRetry = err.headers?.["retry-after"]
    const retryAfterMs = headerRetry ? Number(headerRetry) * 1000 : undefined
    return {
      _tag: "SessionRateLimitError",
      message: err.message,
      retryAfterMs,
      provider: "sap-ai-core",
    }
  }
  // ...existing mapping
}
```

### 3. Hide free models via env flag (SAP equivalent: hide non-licensed models)
**File**: `src/providers/registry.ts` or `src/model.ts`
**Priority**: medium
**Type**: feature
**Reason**: Upstream `aadd4d8` adds `OPENCODE_DISABLE_FREE_MODELS`. For Alexi, mirror this with `ALEXI_DISABLE_FREE_MODELS` and (optionally) a flag to hide non-SAP-licensed models for enterprise deployments.

**New code**:
```typescript
const disableFreeModels =
  process.env.ALEXI_DISABLE_FREE_MODELS === "1" ||
  process.env.ALEXI_DISABLE_FREE_MODELS === "true"

export function filterModels(models: Model[]): Model[] {
  if (!disableFreeModels) return models
  return models.filter((m) => !m.free && !m.id.startsWith("free/"))
}
```

### 4. Generate session titles with lowest-cost model variant & tightened prompt
**File**: `src/core/session/title.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream `5c52626` + `d2812d1` improve title quality and reduce token cost by picking the smallest variant and tightening the prompt. Important for SAP AI Core where every call is billed/throttled.

**Current code**:
```typescript
export async function generateTitle(messages: Message[], model: Model) {
  const prompt = `Summarize the following conversation in a short title:\n${JSON.stringify(messages)}`
  return model.generate({ prompt, maxTokens: 50 })
}
```

**New code**:
```typescript
const TITLE_PROMPT = `Generate a concise 3-7 word title summarizing the user's request.
Rules:
- No quotes, no trailing punctuation, no markdown.
- Prefer imperative or noun phrases.
- Do NOT include words like "chat", "conversation", "session".`

function selectTitleVariant(model: Model): Model {
  // Prefer the cheapest/smallest variant if the provider exposes variants.
  if (!model.variants?.length) return model
  const sorted = [...model.variants].sort(
    (a, b) => (a.cost?.input ?? Infinity) - (b.cost?.input ?? Infinity),
  )
  return sorted[0] ?? model
}

export async function generateTitle(messages: Message[], model: Model) {
  const chosen = selectTitleVariant(model)
  const userText = extractFirstUserText(messages)
  return chosen.generate({
    system: TITLE_PROMPT,
    prompt: userText,
    maxTokens: 32,
    temperature: 0.2,
  })
}
```

### 5. Instruction updates: send only changed entries
**File**: `src/core/instructions.ts` (or wherever MCP/skill/reference instructions are composed)
**Priority**: medium
**Type**: refactor / bugfix
**Reason**: Upstream `15adc3d` sends only diffs across MCP, skill, and reference instruction updates. Reduces payload size and avoids spurious re-injections.

**New code**:
```typescript
type InstructionEntry = { id: string; content: string }

export function diffInstructions(
  previous: InstructionEntry[],
  current: InstructionEntry[],
): { added: InstructionEntry[]; removed: string[]; updated: InstructionEntry[] } {
  const prevMap = new Map(previous.map((e) => [e.id, e.content]))
  const currMap = new Map(current.map((e) => [e.id, e.content]))

  const added: InstructionEntry[] = []
  const updated: InstructionEntry[] = []
  const removed: string[] = []

  for (const [id, content] of currMap) {
    if (!prevMap.has(id)) added.push({ id, content })
    else if (prevMap.get(id) !== content) updated.push({ id, content })
  }
  for (const id of prevMap.keys()) {
    if (!currMap.has(id)) removed.push(id)
  }
  return { added, removed, updated }
}
```

Call sites that previously re-sent the entire instruction set should instead compute the diff and only send `added`/`updated`/`removed`.

### 6. Experimental: `location_idle_timeout` config
**File**: `src/schema/config.ts` and `src/core/location-activity.ts`
**Priority**: medium
**Type**: feature
**Reason**: Upstream `d898c04` + `89d996c` add an idle-timeout for locations, and keep locations alive while sessions / jobs are still running. Useful for long-running SAP AI Core sessions that occasionally stall mid-stream.

**Schema change**:
```typescript
export const ConfigExperimental = Schema.Struct({
  // ...existing fields...
  location_idle_timeout: Schema.optional(Schema.Number), // milliseconds
})
```

**Location sweeper**:
```typescript
export function shouldReleaseLocation(
  loc: Location,
  now: number,
  idleTimeoutMs: number,
  runningSessions: Set<string>,
  backgroundJobs: Set<string>,
): boolean {
  // Keep locations with any active work regardless of idle time.
  if (runningSessions.has(loc.id)) return false
  if ([...backgroundJobs].some((jobId) => jobId.startsWith(loc.id))) return false
  return now - loc.lastActiveAt > idleTimeoutMs
}
```

### 7. V1 migration: resolve relative session directories against project worktree
**File**: `src/database/v1-migration.ts` (or wherever Alexi stores/migrates persisted sessions)
**Priority**: medium
**Type**: bugfix
**Reason**: Upstream `c3b613c` fixes legacy ACP sessions whose `cwd` was stored relative to an unknown process. If Alexi has any legacy session format, apply the same fallback: substitute the project worktree when the stored directory is not absolute.

**New helper**:
```typescript
export function storedAbsolutePath(input: string): string | undefined {
  const result = storagePath(input)
  if (nodePath.posix.isAbsolute(result) || isWindowsStoragePath(result)) return result
  return undefined
}
```

**Migration logic**
{"prompt_tokens":12791,"completion_tokens":4096,"total_tokens":16887,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 8d525815-3efa-4224-9b7f-2587f0834ed4]
[Messages: 2, Tokens: 16887]
