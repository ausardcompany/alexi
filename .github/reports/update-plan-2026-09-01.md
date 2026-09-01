# Update Plan for Alexi

Generated: 2026-09-01
Based on upstream commits analyzed:
- kilocode: ab143253a..b6a2979e5 (171 commits)
- opencode: 9f69463..ebece6e (10 commits)

## Summary
- Total changes planned: 12
- Critical: 1 | High: 5 | Medium: 4 | Low: 2

## Changes

### 1. Fix apply_patch permission metadata JSON-encoding
**File**: `src/tool/apply_patch.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Upstream commit `f7da00f` fixes a bug where `movePath: undefined` was included in permission metadata, breaking JSON schema encoding (permission requests fail to serialize when `movePath` is undefined). This is a bug that affects downstream permission flows.

**Current code**:
```typescript
const changes = patchResult.changes.map((change) => ({
  path: change.path,
  operation: change.operation,
  patch: change.diff,
  additions: change.additions,
  deletions: change.deletions,
  movePath: change.movePath,
}))
```

**New code**:
```typescript
const changes = patchResult.changes.map((change) => ({
  path: change.path,
  operation: change.operation,
  patch: change.diff,
  additions: change.additions,
  deletions: change.deletions,
  ...(change.movePath ? { movePath: change.movePath } : {}),
}))
```

---

### 2. Add JSON-encodability test for apply_patch permission metadata
**File**: `src/tool/apply_patch.test.ts`
**Priority**: high
**Type**: bugfix (test)
**Reason**: Regression test to ensure permission requests emitted by `apply_patch` remain JSON-encodable (guards against future re-introduction of undefined fields).

**New code** (append to existing test suite):
```typescript
import { PermissionV1 } from "@opencode-ai/core/v1/permission"
import { Schema } from "effect"

it.instance(
  "produces JSON-encodable permission metadata",
  () =>
    Effect.gen(function* () {
      const { ctx, calls } = makeCtx()
      yield* execute(
        { patchText: "*** Begin Patch\n*** Add File: new.txt\n+created\n*** End Patch" },
        ctx,
      )

      expect(() => {
        const request = Schema.encodeUnknownSync(PermissionV1.Request)({
          id: PermissionV1.ID.ascending(),
          sessionID: baseCtx.sessionID,
          ...calls[0],
        })
        Schema.encodeUnknownSync(Schema.Json)(request)
      }).not.toThrow()
    }),
  { git: true },
)
```

---

### 3. Refactor session-message normalize/encode to share transform helper
**File**: `src/core/session-message.ts` (if exists in Alexi; otherwise `src/core/kilocode/session-message.ts`)
**Priority**: high
**Type**: refactor + bugfix
**Reason**: Upstream `packages/core/src/kilocode/session-message.ts` deduplicates the mirrored transform between `normalize` and `encode`. Previously the two functions each walked the assistant tool content independently with divergent code paths; the new version ensures both paths remain symmetric. The refactor is small but semantically important: it ensures both encoders/decoders traverse identical structures (running/completed/error tool states) which prevents data-shape drift.

**Current code**:
```typescript
export function normalize(value: unknown): unknown {
  if (!record(value)) return value
  if (value.type === "compaction" && typeof value.kilo_summary === "string") {
    return { ...value, summary: value.kilo_summary }
  }
  if (value.type !== "assistant" || !Array.isArray(value.content)) return value
  return {
    ...value,
    content: value.content.map((item) => {
      // ... duplicated logic using decode()
    }),
  }
}

export function encode(value: unknown): unknown {
  if (!record(value)) return value
  if (value.type === "compaction" && typeof value.summary === "string") {
    return { ...value, type: "compaction", summary: undefined, kilo_summary: value.summary }
  }
  if (value.type !== "assistant" || !Array.isArray(value.content)) return value
  return {
    ...value,
    content: value.content.map((item) => {
      // ... duplicated logic using encoder
    }),
  }
}
```

**New code**:
```typescript
function transform(
  value: Record<string, unknown>,
  convert: (value: unknown) => unknown,
): Record<string, unknown> {
  if (value.type !== "assistant" || !Array.isArray(value.content)) return value
  return {
    ...value,
    content: value.content.map((item) => {
      if (!record(item) || item.type !== "tool" || !record(item.state)) return item
      const status = item.state.status
      if (status !== "running" && status !== "completed" && status !== "error") return item
      if (!Array.isArray(item.state.content)) return item
      return {
        ...item,
        state: {
          ...item.state,
          content: item.state.content.map((entry) => convert(entry)),
        },
      }
    }),
  }
}

export function normalize(value: unknown): unknown {
  if (!record(value)) return value
  if (value.type === "compaction" && typeof value.kilo_summary === "string") {
    return { ...value, summary: value.kilo_summary }
  }
  return transform(value, decode)
}

export function encode(value: unknown): unknown {
  if (!record(value)) return value
  if (value.type === "compaction" && typeof value.summary === "string") {
    return {
      ...value,
      type: "compaction",
      summary: undefined,
      kilo_summary: value.summary,
    }
  }
  return transform(value, encoder)
}
```

---

### 4. Add round-trip test for assistant tool content normalization
**File**: `src/core/session-message.test.ts` (or equivalent test file)
**Priority**: medium
**Type**: bugfix (test)
**Reason**: Verifies that the refactored `normalize`/`encode` symmetrically handle running/completed/error tool states and legacy `media` → `file` conversion. Also guards against regressions on `pending` state (should be untouched).

**New code**:
```typescript
it.effect("round-trips assistant tool content across running and settled states", () =>
  Effect.sync(() => {
    const text = { type: "text", text: "Tool output" }
    const legacy = { type: "media", mediaType: "image/png", data: "AAAA", filename: "image.png" }
    const file = { type: "file", uri: "data:image/png;base64,AAAA", mime: "image/png", name: "image.png" }
    const stored = { type: "file", source: { type: "data", data: "AAAA" }, mime: "image/png", name: "image.png" }
    for (const status of ["running", "completed", "error"]) {
      const input = { type: "assistant", content: [{ type: "tool", state: { status, content: [text, legacy] } }] }
      const normalized = StoredMessage.normalize(input)
      expect(normalized).toMatchObject({ content: [{ state: { status, content: [text, file] } }] })
      const encoded = StoredMessage.encode(normalized)
      expect(encoded).toMatchObject({ content: [{ state: { status, content: [text, stored] } }] })
      expect(StoredMessage.normalize(encoded)).toEqual(normalized)
    }
  }),
)

it.effect("leaves non-assistant values and pending tool content unchanged", () =>
  Effect.sync(() => {
    for (const input of [null, 1, [], { type: "user", content: [] }, { type: "assistant", content: null }]) {
      expect(StoredMessage.normalize(input)).toBe(input)
      expect(StoredMessage.encode(input)).toBe(input)
    }
    const pending = {
      type: "assistant",
      content: [{ type: "tool", state: { status: "pending", content: [null] } }],
    }
    expect(StoredMessage.normalize(pending)).toEqual(pending)
    expect(StoredMessage.encode(pending)).toEqual(pending)
  }),
)
```

---

### 5. Refactor bash permission lists to share read-only entries
**File**: `src/agent/index.ts`
**Priority**: high
**Type**: refactor
**Reason**: Upstream commit `e096d3ab7` (`refactor(cli): share common bash permission entries`) deduplicates the ~20 read-only bash allow entries between `bash` and `readOnlyBash`. Reduces drift risk — if a new read-only command is added, both maps stay in sync automatically. Also aligns with Alexi's SAP AI Core patterns where a small allow-list is easier to audit.

**Current code**:
```typescript
export const bash: Record<string, "allow" | "ask" | "deny"> = {
  "*": "ask",
  "cat *": "allow",
  "head *": "allow",
  "tail *": "allow",
  // ... ~20 more read-only entries duplicated below
  "touch *": "allow",
  "mkdir *": "allow",
  // ...
}

export const readOnlyBash: Record<string, "allow" | "ask" | "deny"> = {
  "*": "deny",
  "cat *": "allow",
  "head *": "allow",
  // ... same ~20 entries duplicated
}
```

**New code**:
```typescript
const readable: Record<string, "allow"> = {
  "cat *": "allow",
  "head *": "allow",
  "tail *": "allow",
  "less *": "allow",
  "ls *": "allow",
  "tree *": "allow",
  "pwd *": "allow",
  "echo *": "allow",
  "wc *": "allow",
  "which *": "allow",
  "type *": "allow",
  "file *": "allow",
  "diff *": "allow",
  "du *": "allow",
  "df *": "allow",
  "date *": "allow",
  "uname *": "allow",
  "whoami *": "allow",
  "printenv *": "allow",
  "man *": "allow",
  "sort *": "allow",
  "uniq *": "allow",
  "cut *": "allow",
  "tr *": "allow",
  "jq *": "allow",
}

export const bash: Record<string, "allow" | "ask" | "deny"> = {
  "*": "ask",
  ...readable,
  "touch *": "allow",
  "mkdir *": "allow",
  "cp *": "allow",
  // ... rest of write commands
}

export const readOnlyBash: Record<string, "allow" | "ask" | "deny"> = {
  "*": "deny",
  ...readable,
}
```

---

### 6. Accept JSON-encoded tasks in agent-manager tool
**File**: `src/tool/agent-manager.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream commit `02df76976` (`fix(agent-manager): decode JSON-encoded task arrays`) — some models (Anthropic in particular) emit `tasks` as a JSON string rather than an array. Without this fix the Start operation errors out on valid model outputs. Direct compatibility fix for Alexi's SAP AI Core provider integrations.

**Current code**:
```typescript
export const Params = Schema.Union([StartParams, ListParams, PromptParams, StopParams, MoveParams, AnswerParams])
```

**New code**:
```typescript
export const Params = Schema.Union([
  Schema.Struct({
    ...StartParams.fields,
    tasks: Schema.Union([
      StartParams.fields.tasks,
      Schema.fromJsonString(StartParams.fields.tasks),
    ]),
  }),
  ListParams,
  PromptParams,
  StopParams,
  MoveParams,
  AnswerParams,
{"prompt_tokens":39738,"completion_tokens":4096,"total_tokens":43834,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 6c85c6b7-8ab8-41f1-82c7-841dc2211a67]
[Messages: 2, Tokens: 43834]
