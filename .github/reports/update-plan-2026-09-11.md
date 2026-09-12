# Update Plan for Alexi

Generated: 2026-09-11
Based on upstream commits: kilocode a7a7690ca..4304a8691 (290 commits), opencode d6855b6..193de13 (16 commits)

## Summary
- Total changes planned: 14
- Critical: 2 | High: 5 | Medium: 5 | Low: 2

## Changes

### 1. Remove Interactive Terminal Tool (Deprecated)
**File**: `src/tool/interactive-terminal.ts` (delete), `src/tool/registry.ts` (update)
**Priority**: high
**Type**: refactor
**Reason**: Upstream removed the nonfunctional interactive-terminal tool (`fix(cli): remove nonfunctional interactive terminal tool` - b5cf42615). It was removed from the tool registry, HTTP API, TUI routes, and tests. Alexi should follow suit to reduce surface area and prevent shipping a broken tool.

**Files to delete**:
- `src/tool/interactive-terminal.ts`
- `src/tool/interactive-terminal.txt`
- Any related HTTP handlers/routes in `src/cli/` or `src/server/`

**Current code** (in `src/tool/registry.ts`):
```typescript
import { InteractiveTerminalTool } from "./interactive-terminal"
// ...
tools.push(InteractiveTerminalTool)
```

**New code**:
```typescript
// Interactive terminal tool removed - upstream deprecated (nonfunctional)
// See kilocode commit b5cf42615
```

---

### 2. Fix Board Migration Regex Pattern
**File**: `src/core/database/migration.ts` (or equivalent kilocode board migration helper)
**Priority**: critical
**Type**: bugfix
**Reason**: The `board()` name detector was updated to a regex-based match to include the new `kilocode_board_reset` migration. Without this, the reset migration will not be recognized as a board migration and may be misclassified.

**Current code**:
```typescript
function board(name: string) {
  return name === "kilocode_board" || name.endsWith("_kilocode_board")
}
```

**New code**:
```typescript
function board(name: string) {
  return /(?:^|_)kilocode_board(?:_reset)?$/.test(name)
}
```

---

### 3. Add Board `cleared_seq` Column + Reset Migration
**File**: `src/core/database/migration/20260903104806_kilocode_board_reset.ts` (new), `src/core/kilocode/board/sql.ts`
**Priority**: high
**Type**: feature
**Reason**: New shared agent board reset feature (kilocode PR #13782). Adds a `cleared_seq INTEGER NOT NULL DEFAULT 0` column to `kilo_board`, enabling participants to reset the board view without deleting rows.

**New migration** (create `src/core/database/migration/20260903104806_kilocode_board_reset.ts`):
```typescript
import type { DatabaseMigration } from "../types"

export default {
  name: "20260903104806_kilocode_board_reset",
  up: async (db) => {
    await db.exec(`
      ALTER TABLE kilo_board
      ADD COLUMN cleared_seq INTEGER NOT NULL DEFAULT 0
    `)
  },
} satisfies DatabaseMigration.Migration
```

**Register in `src/core/database/migration.gen.ts`**:
```typescript
import("./migration/20260903104806_kilocode_board_reset"),
```

---

### 4. Board Store: Support Reset / cleared_seq Filtering
**File**: `src/kilocode/board/store.ts`
**Priority**: high
**Type**: feature
**Reason**: `packages/opencode/src/kilocode/board/store.ts` grew by +178/-69 to support the shared board reader/reset. Board reads must filter by `cleared_seq` so cleared items don't reappear.

**New logic** (illustrative):
```typescript
// When reading board messages, exclude entries below cleared_seq
export const listMessages = (opts: { sessionID: string; since?: number }) =>
  Effect.gen(function* () {
    const db = yield* Database
    const clearedSeq = yield* getClearedSeq(opts.sessionID)
    return yield* db.query(sql`
      SELECT * FROM kilo_board
      WHERE session_id = ${opts.sessionID}
        AND seq > ${clearedSeq}
        AND seq > ${opts.since ?? 0}
      ORDER BY seq ASC
    `)
  })

export const resetBoard = (sessionID: string) =>
  Effect.gen(function* () {
    const db = yield* Database
    const maxSeq = yield* getMaxSeq(sessionID)
    yield* db.exec(sql`
      UPDATE kilo_board
      SET cleared_seq = ${maxSeq}
      WHERE session_id = ${sessionID}
    `)
  })
```

---

### 5. Board Tool: Add `board_post` Stopped-Subagent Warning
**File**: `src/tool/board.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: kilocode commit 7febec58f ("fix(cli): warn when board_post targets a stopped subagent") avoids silent failures when posting to a subagent that no longer exists.

**New code** (add to board tool execute):
```typescript
if (input.recipient) {
  const subagent = yield* Session.get(input.recipient).pipe(Effect.option)
  if (Option.isNone(subagent) || subagent.value.status === "stopped") {
    return {
      output: `Warning: recipient subagent "${input.recipient}" is stopped or does not exist. Message posted but will not be delivered.`,
      metadata: { deliveryStatus: "no-recipient" },
    }
  }
}
```

---

### 6. Add Board Enabled Flag / Experimental Env Gate
**File**: `src/kilocode/board/enabled.ts` (new), `src/core/flag/flag.ts`
**Priority**: medium
**Type**: feature
**Reason**: kilocode PR #14013 gated the shared agent board behind an experimental env flag. Alexi should mirror this to allow safe rollout in SAP environments.

**New file** `src/kilocode/board/enabled.ts`:
```typescript
import { Effect } from "effect"
import { Flag } from "../../core/flag/flag"

export const isBoardEnabled = Effect.gen(function* () {
  const flags = yield* Flag
  return flags.get("KILOCODE_EXPERIMENTAL_SWARM_BOARD") === "1"
    || process.env.KILOCODE_EXPERIMENTAL_SWARM_BOARD === "1"
})
```

---

### 7. PTY Latch (Buffer Early Output)
**File**: `src/core/kilocode/pty/latch.ts` (new), `src/core/pty/pty.bun.ts`
**Priority**: high
**Type**: bugfix
**Reason**: kilocode commit 203f19f5d "fix(cli): keep PTY output and exit emitted before listeners attach". Without this latch, output/exit emitted synchronously during PTY spawn is lost.

**New file** `src/core/kilocode/pty/latch.ts`:
```typescript
export interface PtyLatch<T> {
  emit: (value: T) => void
  attach: (listener: (value: T) => void) => () => void
}

export function createPtyLatch<T>(): PtyLatch<T> {
  const buffered: T[] = []
  let listener: ((value: T) => void) | undefined

  return {
    emit(value) {
      if (listener) listener(value)
      else buffered.push(value)
    },
    attach(l) {
      listener = l
      while (buffered.length > 0) l(buffered.shift()!)
      return () => { listener = undefined }
    },
  }
}
```

**Update** `src/core/pty/pty.bun.ts`:
```typescript
import { createPtyLatch } from "../kilocode/pty/latch"

// In spawn function:
const dataLatch = createPtyLatch<string>()
const exitLatch = createPtyLatch<number>()

pty.onData((chunk) => dataLatch.emit(chunk))
pty.onExit((code) => exitLatch.emit(code))

return {
  onData: (fn) => dataLatch.attach(fn),
  onExit: (fn) => exitLatch.attach(fn),
  // ...
}
```

---

### 8. Optimize Move-Session (Skip Source Project Resolve)
**File**: `src/core/control-plane/move-session.ts`
**Priority**: medium
**Type**: performance
**Reason**: kilocode commit 7e0bc2175 avoids spawning Git subprocesses when no changes are moved (e.g., worktree deletion).

**Current code**:
```typescript
const source = yield* project.resolve(current.location.directory)
const destination = yield* project.resolve(directory)
if (current.projectID !== destination.id) { /* ... */ }

const moveChanges = input.moveChanges && source.directory !== destination.directory
```

**New code**:
```typescript
const destination = yield* project.resolve(directory)
if (current.projectID !== destination.id) { /* ... */ }

// Skip source resolve unless we actually need to move changes
const source = input.moveChanges
  ? yield* project.resolve(current.location.directory)
  : undefined
const moveChanges = source ? source.directory !== destination.directory : false
```

---

### 9. Amazon Bedrock: ARN Passthrough & DeepSeek Prefix Fix
**File**: `src/providers/amazon-bedrock.ts` (or equivalent Bedrock plugin)
**Priority**: high
**Type**: bugfix
**Reason**: opencode commit ac1758c preserves Bedrock DeepSeek model IDs (only prefix `deepseek.r1`, not all deepseek variants like `v3.2`) and treats ARN model IDs as pre-resolved. Critical for SAP AI Core users who may use ARN-based model references.

**Current code**:
```typescript
function resolveModelID(modelID: string, region: string | undefined) {
  const crossRegionPrefixes = ["global.", "us.", "eu.", "jp.", "apac.", "au."]
  if (crossRegionPrefixes.some((p) => modelID.startsWith(p))) return modelID

  const resolvedRegion = region ?? "us-east-1"
  const regionPrefix = resolvedRegion.split("-")[0]
  if (regionPrefix === "us") {
    const requiresPrefix = ["nova-micro", "nova-lite", "nova-pro", "nova-premier", "nova-2", "claude", "deepseek"]
      .some((item) => modelID.includes(item))
    if (requiresPrefix && !resolvedRegion.startsWith("us-gov")) return `${regionPrefix}.${modelID}`
    return modelID
  }
  // ...
}
```

**New code**:
```typescript
function resolveModelID(modelID: string, region: string | undefined) {
  // ARN model IDs are pre-resolved - pass through
  if (modelID.startsWith("arn:")) return modelID

  const crossRegionPrefixes = ["global.", "us.", "eu.", "jp.", "apac.", "au."]
  if (crossRegionPrefixes.some((p) => modelID.startsWith(p))) return modelID

  const resolvedRegion = region ?? "us-east-1"
  const regionPrefix = resolvedRegion.split("-")[0]
  if (regionPrefix === "us") {
    // Only deepseek.r1 requires prefix; deepseek.v3.2+ do not
    const requiresPrefix = ["nova-micro", "nova-lite", "nova-pro", "
{"prompt_tokens":53083,"completion_tokens":4096,"total_tokens":57179,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: e9083eb9-6828-40cb-95a1-4db94b9edef5]
[Messages: 2, Tokens: 57179]
