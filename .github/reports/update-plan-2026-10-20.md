# Update Plan for Alexi

Generated: 2026-10-20
Based on upstream commits analyzed:
- **kilocode**: 2a1903f29..5cc65d121 (30 commits, v7.8.14 → v7.8.15)
- **opencode**: 214fb7f..d814879 (65 commits, v2.0.32 → v2.1.0)

## Summary
- Total changes planned: 12
- Critical: 2 | High: 5 | Medium: 3 | Low: 2

Key themes:
1. **Permission allowlist semantics fix** — critical correctness fix for subagent edit permissions
2. **browser_open permission scoping** — always-allow rules per origin
3. **task tool refresh** — new `refresh` API instead of `merge`
4. **Todo tool restoration** — experimental flag-gated todo tool
5. **Bus event legacy decoding** — payload shape upgrades for stored events
6. **Config policy debug logging** — denied provider logging improvements

---

## Changes

### 1. Add PermissionAllowlist helper namespace
**File**: `src/permission/allowlist.ts` (NEW)
**Priority**: critical
**Type**: bugfix
**Reason**: Upstream kilocode introduced this helper to distinguish between a true blanket deny (`"*": deny`) and an allowlist baseline (`"*": deny` followed by path allows). Without this, subagents launched from plan/orchestrator agents lose edit/write capabilities entirely because the baseline is collapsed into a wildcard deny. This is a correctness bug that affects any delegated workflow.

**New code**:
```typescript
import { Wildcard } from "@opencode-ai/core/util/wildcard"
import type { Ruleset } from "@/permission/rule"

// A scoped policy can be written either as an explicit catch-all deny or as an
// allowlist baseline: `"*": deny` followed by path allows. `Permission.evaluate`
// only ever sees the catch-all for a literal "*" pattern, so code that needs to
// tell a real blanket deny apart from an allowlist baseline has to inspect the
// rules that follow it.
export namespace PermissionAllowlist {
  /** Last rule that applies `permission`'s catch-all pattern, if any. */
  export function catchAll(permission: string, rules: Ruleset) {
    return rules.findLast(
      (rule) => Wildcard.match(permission, rule.permission) && rule.pattern === "*",
    )
  }

  /** True when a catch-all deny is only the baseline for later path exceptions. */
  export function exceptions(permission: string, rules: Ruleset) {
    const rule = catchAll(permission, rules)
    if (rule?.action !== "deny") return false
    const index = rules.lastIndexOf(rule)
    return rules
      .slice(index + 1)
      .some(
        (next) =>
          Wildcard.match(permission, next.permission) &&
          next.pattern !== "*" &&
          next.action !== "deny",
      )
  }
}
```

---

### 2. Fix subagent edit permission inheritance in task tool
**File**: `src/tool/task.ts` (or `src/kilocode/tool/task.ts` if following kilocode layout)
**Priority**: critical
**Type**: bugfix
**Reason**: Companion fix to PermissionAllowlist. The previous logic treated an allowlist baseline as a blanket edit deny, breaking delegated subagents launched from read-only/plan modes. Also fix the `readonly` detection: only a true global `*/*` deny should strip edit from subagents.

**Current code** (equivalent section):
```typescript
const mutation = new Set(["edit", ...guarded.filter((p) => p !== "bash")])
const inherited = [
  ...rules.filter((rule) => rule.permission !== "edit"),
  ...edit.filter((rule) => rule.permission === "edit"),
].filter(
  (r: Permission.Rule) =>
    r.action === "deny" && (mutation.has(r.permission) || isMcp(r.permission)),
)
```

**New code**:
```typescript
import { PermissionAllowlist } from "@/permission/allowlist"

// ... existing imports and setup ...

const mutation = mutations() // existing helper returning Set of mutating permission names
const prefixes = Object.keys(input.mcp ?? {}).map(
  (k) => k.replace(/[^a-zA-Z0-9_-]/g, "_") + "_",
)
const isMcp = (p: string) => prefixes.some((prefix) => p.startsWith(prefix))

// Only `*`-permission rules can match the literal input "*", so this is true exactly
// for the modes whose guard sets `"*": "deny"` and for a global deny-all config.
const readonly = Permission.evaluate("*", "*", rules).action === "deny"

const inherited = [
  ...rules.filter((rule) => rule.permission !== "edit"),
  ...edit.filter((rule) => rule.permission === "edit" && rule.action === "deny"),
].filter(
  (r: Permission.Rule) =>
    r.action === "deny" &&
    (isMcp(r.permission) ||
      (r.permission === "edit"
        ? readonly || r.pattern !== "*" || !PermissionAllowlist.exceptions("edit", edit)
        : mutation.has(r.permission))),
)
```

Also update the doc comment to document the new semantics (see upstream diff).

---

### 3. Rename `KiloTask.merge` → `KiloTask.refresh` for child permission handling
**File**: `src/tool/task.ts` (parent task tool)
**Priority**: high
**Type**: refactor
**Reason**: Upstream renamed the merge entry point to `refresh` for clarity. The behavior may also differ (semantic refresh vs. merge). Keep API aligned.

**Current code**:
```typescript
const permission = KiloTask.merge(session.permission ?? [], childPermission)
```

**New code**:
```typescript
const permission = KiloTask.refresh(session.permission ?? [], childPermission)
```

Export the new name from the kilocode task module. If needed, keep `merge` as a deprecated alias during transition:
```typescript
/** @deprecated use refresh */
export const merge = refresh
```

---

### 4. Update browser_open always-allow and metadata rules
**File**: `src/tool/browser-open.ts`
**Priority**: high
**Type**: feature
**Reason**: Allow users to persist "always allow this origin" for browser_open and ensure the permission dock surfaces the correct scope rules.

**Current code**:
```typescript
yield* ctx.ask({
  permission: "browser_open",
  patterns: [`navigate:${url.origin}`],
  always: [],
  metadata: { operation: "open", url: url.href },
})
```

**New code**:
```typescript
yield* ctx.ask({
  permission: "browser_open",
  patterns: [`navigate:${url.origin}`],
  always: [`navigate:${url.origin}`],
  metadata: {
    operation: "open",
    url: url.href,
    rules: [`navigate:${url.origin}`, "navigate:*"],
  },
})
```

---

### 5. Add bus event legacy payload decoding
**File**: `src/bus/index.ts` (or `src/bus.ts`)
**Priority**: high
**Type**: bugfix
**Reason**: Opencode v2.1 added `SessionLegacy.event()` upgrades to decode previously-stored events whose shape has since been renamed. Without this, upgraded Alexi deployments may fail to read older stored events.

**Current code**:
```typescript
const decodeSerializedEvent = (event: SerializedEvent): Event.Payload => {
  const definition = Durable.get(event.type)
  if (!definition?.durable) {
    throw new Error(`Unknown or non-durable event type: ${event.type}`)
  }
  return {
    id: Event.ID.make(event.id),
    created: event.created ?? 0,
    type: definition.type,
    durable: envelope(event.aggregateID, event.seq, definition.durable.version),
    data: Schema.decodeUnknownSync(definition.data)(event.data),
  }
}
```

**New code**:
```typescript
import { SessionLegacy } from "@opencode/schema/session-legacy"

// Every stored event decodes through here, so payloads written in older shapes
// are upgraded in one place.
const decodeStoredData = (definition: Event.DurableDefinition, data: unknown) =>
  Schema.decodeUnknownSync(definition.data)(SessionLegacy.event(definition.type, data))

const decodeSerializedEvent = (event: SerializedEvent): Event.Payload => {
  const definition = Durable.get(event.type)
  if (!definition?.durable) {
    throw new Error(`Unknown or non-durable event type: ${event.type}`)
  }
  return {
    id: Event.ID.make(event.id),
    created: event.created ?? 0,
    type: definition.type,
    durable: envelope(event.aggregateID, event.seq, definition.durable.version),
    data: decodeStoredData(definition, event.data),
  }
}
```

Also update the idempotency comparison for stored rows:
```typescript
// Rows written before a payload rename compare in their upgraded shape.
isDeepStrictEqual(SessionLegacy.event(definition.type, stored.data), encoded)
```

And the second decode site (commitDurableEvent) similarly.

---

### 6. Restore todowrite tool behind experimental flag
**File**: `src/tool/todo.ts` (NEW), `src/tool/todowrite.txt`, `src/config/experimental.ts`
**Priority**: medium
**Type**: feature
**Reason**: Opencode re-introduced the todowrite tool gated by `experimental.todo` config flag. This is useful for structured task tracking in long sessions.

**New file** `src/tool/todo.ts`: port from `packages/core/src/tool/plugin/todo.ts` (~83 lines). Key structure:
```typescript
import { Tool } from "@opencode-ai/core/tool"
import { Schema } from "effect"

// Define the todo list schema (array of {id, content, status, priority})
// Expose as a plugin tool conditional on experimental.todo
export const TodoWriteTool = Tool.define({
  name: "todowrite",
  description: readFileSync(path.join(__dirname, "todowrite.txt"), "utf8"),
  parameters: Schema.Struct({
    todos: Schema.Array(Schema.Struct({
      id: Schema.String,
      content: Schema.String,
      status: Schema.Literal("pending", "in_progress", "completed"),
      priority: Schema.Literal("high", "medium", "low"),
    })),
  }),
  execute: (input, ctx) => Effect.gen(function* () {
    // persist todos on session metadata and emit event
  }),
})
```

**New file** `src/tool/todowrite.txt`: port the 7-line prompt file verbatim from upstream.

**Config change** in `src/config/experimental.ts`:
```typescript
export const Info = Schema.Struct({
  // ...existing fields
  todo: Schema.optional(Schema.Boolean),
  // ...
})
```

**Normalize change** (`src/config/normalize.ts`):
```typescript
if (own(experimental, "todo")) {
  const value = decodeEncoded(
    ConfigExperimental.Info.fields.todo,
    experimental.todo,
    ["experimental", "todo"],
    diagnostics,
  )
  if (value !== undefined) result.todo = value
}
```

---

### 7. Add provider policy denial debug logging
**File**: `src/config/plugin/policy.ts`
**Priority**: medium
**Type**: feature
**Reason**: Prevents log spam when a deny-all prov
{"prompt_tokens":33418,"completion_tokens":4096,"total_tokens":37514,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: d2b7e7a6-9a3a-4716-81e6-e2c053d9672b]
[Messages: 2, Tokens: 37514]
