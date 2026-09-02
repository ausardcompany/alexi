# Update Plan for Alexi

Generated: 2026-09-02
Based on upstream commits analyzed:
- kilocode: b6a2979e5..dfbf8df62 (58 commits)
- opencode: ebece6e..69c172e (21 commits)

## Summary
- Total changes planned: 12
- Critical: 2 | High: 5 | Medium: 3 | Low: 2

## Changes

### 1. Add `publishAll` batch method to Event Bus interface
**File**: `src/bus/event.ts` (or equivalent, e.g., `src/core/event.ts`)
**Priority**: high
**Type**: feature
**Reason**: Upstream introduces a batched event publish API that commits all events in a single transaction before notifying subscribers. This is required by the new headless session drain code and improves performance for large session forks. Multiple upstream changes now depend on `publishAll` (e.g. `session-runner-tool-events.test.ts` explicitly mocks it).

**Current code** (interface definition):
```typescript
export interface Interface {
  readonly publish: <D extends Definition>(
    definition: D,
    data: Data<D>,
    options?: PublishOptions,
  ) => Effect.Effect<Payload<D>>
  readonly subscribe: <D extends Definition>(definition: D) => Stream.Stream<Payload<D>>
  readonly all: () => Stream.Stream<Payload>
  readonly durable: (input: { readonly aggregateID: string; readonly after?: number }) => Stream.Stream<Payload>
  // ...
}
```

**New code**:
```typescript
export interface Interface {
  readonly publish: <D extends Definition>(
    definition: D,
    data: Data<D>,
    options?: PublishOptions,
  ) => Effect.Effect<Payload<D>>
  // Alexi_change start - batched publish (from kilocode upstream)
  readonly publishAll: (
    entries: readonly { readonly definition: Definition; readonly data: Data<Definition> }[],
    options?: PublishOptions,
  ) => Effect.Effect<void>
  // Alexi_change end
  readonly subscribe: <D extends Definition>(definition: D) => Stream.Stream<Payload<D>>
  readonly all: () => Stream.Stream<Payload>
  readonly durable: (input: { readonly aggregateID: string; readonly after?: number }) => Stream.Stream<Payload>
  // ...
}
```

Then wire it in `layerWith`:
```typescript
return Service.of({
  publish,
  publishAll: EventBatch.make({ db, projectors, durable: pubsub.durable, notify }),
  subscribe,
  all: streamAll,
  durable,
  // ...
})
```

---

### 2. Create event batch module
**File**: `src/bus/event-batch.ts` (new file)
**Priority**: high
**Type**: feature
**Reason**: Implements the batched publish primitive used by `publishAll`. Chunks entries, writes them in one DB transaction, maintains per-aggregate sequences, then notifies subscribers after commit. Directly ported from `packages/core/src/kilocode/event-batch.ts`.

**New code** (skeleton – adapt to Alexi's module paths):
```typescript
import { Effect, Option, PubSub, Schema } from "effect"
import { eq } from "drizzle-orm"
import { Event, type Payload } from "@alexi/schema/event"
import type { Database } from "../database/database"
import { InvalidDurableEventError, type Interface, type Subscriber } from "./event"
import { EventSequenceTable, EventTable } from "./event/sql"
import { Location } from "../location"
import * as EventStorage from "./event-storage"

export function make(input: {
  readonly db: Database.Interface["db"]
  readonly projectors: ReadonlyMap<string, readonly Subscriber[]>
  readonly durable: ReadonlyMap<string, ReadonlySet<PubSub.PubSub<void>>>
  readonly notify: (event: Payload, isolate: boolean) => Effect.Effect<void>
}): Interface["publishAll"] {
  return (entries, options) =>
    Effect.gen(function* () {
      if (entries.length === 0) return
      const context = Option.getOrUndefined(yield* Effect.serviceOption(Location.Service))
      const location =
        options?.location ??
        (context ? { directory: context.directory, workspaceID: context.workspaceID } : undefined)
      const sequences = new Map<string, number>()
      const pending = new Array<Payload>()
      const rows = new Array<typeof EventTable.$inferInsert>()

      yield* input.db.transaction(() =>
        Effect.gen(function* () {
          for (const entry of entries) {
            const event: Payload = {
              id: options?.id ?? Event.ID.create(),
              ...(options?.metadata ? { metadata: options.metadata } : {}),
              type: entry.definition.type,
              ...(location ? { location } : {}),
              data: entry.data,
            }
            const durable = entry.definition.durable
            if (!durable) {
              if (options?.commit)
                throw new InvalidDurableEventError({ /* ... */ })
              pending.push(event)
              continue
            }
            // ... aggregate sequence + rows.push()
          }
          // Insert rows in chunks (matches upstream chunked insert semantics)
        }),
      )

      // Post-commit: notify + publish to pubsubs
      for (const event of pending) yield* input.notify(event, false)
    })
}
```

Reference the full upstream file at `packages/core/src/kilocode/event-batch.ts` for the sequence/chunk logic (batch size, aggregate handling).

---

### 3. Update event bus test mocks to include `publishAll`
**File**: `src/**/tests/*.test.ts` (any test that mocks the event bus)
**Priority**: high
**Type**: bugfix
**Reason**: Adding `publishAll` to the interface will break all mocks that don't implement it. Upstream added `Effect.die("Unexpected publishAll")` as a default in `session-runner-tool-events.test.ts`.

**Current code**:
```typescript
const capture = () => {
  return {
    publish: (...) => Effect.gen(function*() { /* ... */ }),
    subscribe: () => Stream.empty,
    all: () => Stream.empty,
    durable: () => Stream.empty,
    // ...
  }
}
```

**New code**:
```typescript
const capture = () => {
  return {
    publish: (...) => Effect.gen(function*() { /* ... */ }),
    publishAll: () => Effect.die("Unexpected publishAll"), // Alexi_change
    subscribe: () => Stream.empty,
    all: () => Stream.empty,
    durable: () => Stream.empty,
    // ...
  }
}
```

---

### 4. Add SessionDrain service and register in tool registry node
**File**: `src/tool/registry.ts` and new `src/session/drain.ts`
**Priority**: high
**Type**: feature
**Reason**: Upstream fixes a critical bug where headless (`run` command) execution could exit before background work drained, losing state. The `SessionDrain` service snapshots waiters and drains pending session work before exit. Multiple upstream commits (`fix(cli): drain background work before headless exit`, `harden drain lifecycle`, `resolve main conflicts in headless drain`) address this.

**Current code** (`src/tool/registry.ts`):
```typescript
export const node = LayerNode.suspend(() =>
  LayerNode.group([
    // ...
    Skill.node,
    Session.node,
    BackgroundJob.node,
    Provider.node,
    LSP.node,
    Instruction.node,
    // ...
  ])
)
```

**New code**:
```typescript
import { SessionDrain } from "../session/drain" // Alexi_change

export const node = LayerNode.suspend(() =>
  LayerNode.group([
    // ...
    Skill.node,
    Session.node,
    BackgroundJob.node,
    SessionDrain.node, // Alexi_change
    Provider.node,
    LSP.node,
    Instruction.node,
    // ...
  ])
)
```

Create `src/session/drain.ts` porting from `packages/opencode/src/kilocode/session/drain.ts` (157 LOC). Key API surface:
```typescript
export namespace SessionDrain {
  export class Service extends Effect.Service<Service>()("SessionDrain", { ... }) {}
  export const node = LayerNode.make(...)

  // Public API used by run.ts:
  export const track = (id: string) => Effect.Effect<void>
  export const untrack = (id: string) => Effect.Effect<void>
  export const drain = (options?: { timeoutMs?: number }) => Effect.Effect<void>
}
```

Ensure the drain snapshots the waiter set at start (upstream commit `snapshot drain waiters before resuming them`) to avoid mutation-during-iteration bugs.

---

### 5. Drain background work before headless CLI exit
**File**: `src/cli/cmd/run.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Without draining, the `run` command may exit while sessions still emit tool events, causing lost output and corrupted event streams. Upstream refactors run.ts significantly (+60/-62) around drain semantics.

**New code** (wrap main logic):
```typescript
import { SessionDrain } from "@/session/drain"

// Around the top-level Effect.gen in the run command:
export const RunCommand = defineCommand({
  handler: () =>
    Effect.gen(function* () {
      const drain = yield* SessionDrain.Service
      try {
        // ... existing run logic ...
      } finally {
        yield* drain.drain({ timeoutMs: 30_000 }) // Alexi_change
      }
    }),
})
```

---

### 6. Separate environment details from user prompt text
**File**: `src/session/prompt.ts` (or wherever prompts are constructed for the model)
**Reference**: kilocode commit `3fc9cb41f - fix(cli): separate environment details from user prompt text`
**Priority**: high
**Type**: bugfix
**Reason**: Currently environment context (cwd, files, git state) may be concatenated inside the user message, polluting user-visible context and causing token bloat in provider prompts. Upstream moved environment details into a distinct segment with a separator. This also matters for SAP AI Core where token efficiency and clean prompt structure matter.

**Current code** (typical shape):
```typescript
const userContent = `${environmentDetails}\n\n${userText}`
return { role: "user", content: userContent }
```

**New code**:
```typescript
// Alexi_change: keep env details as a distinct block with a clear separator
const SEPARATOR = "\n\n---\n\n"
const userContent = userText
const envBlock = environmentDetails
  ? `<environment_details>\n${environmentDetails}\n</environment_details>${SEPARATOR}`
  : ""
return {
  role: "user",
  content: `${envBlock}${userContent}`,
}
```

Also add a reminders separator test analogous to `test/kilocode/reminders-separator.test.ts`.

---

### 7. Surface real tool name when tool-call repair fails
**File**: `src/tool/registry.ts` or wherever `invalid_tool_use` repair errors are emitted
**Reference**: kilocode commit `f1330aceb`
**Priority**: medium
**Type**: bugfix
**Reason**: When tool-call repair fails, the error currently references a synthetic/repair name, making it hard to debug. Users need to see the actual tool name the model attempted.

**Current code** (illustrative):
```typescript
throw new ToolRepairError({ tool: "repair", cause })
```

**New
{"prompt_tokens":20202,"completion_tokens":4096,"total_tokens":24298,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 6a978041-b80d-4a99-8c36-00e488898c1c]
[Messages: 2, Tokens: 24298]
