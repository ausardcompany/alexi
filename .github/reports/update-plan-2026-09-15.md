# Update Plan for Alexi

Generated: 2026-09-15
Based on upstream commits: kilocode 2ad448820..9597be3a1 (117 commits), opencode 228e909..e03db9b (7 commits)

## Summary
- Total changes planned: 14
- Critical: 2 | High: 5 | Medium: 5 | Low: 2

## Changes

### 1. Add Scheduled Wakeup Tool
**File**: `src/tool/schedule-wakeup.ts` (new)
**Priority**: high
**Type**: feature
**Reason**: Upstream added scheduled wakeup capability (kilocode commit b7070e507) allowing agents to schedule future resume events. This is a substantial new tool with 99 lines of implementation + 217 lines of tests. Enables long-running/deferred task orchestration valuable for SAP long-running workflows.

**New code**:
```typescript
// src/tool/schedule-wakeup.ts
import { Tool } from "./tool"
import { z } from "zod"
import { WakeupSchema } from "../kilocode/wakeup/schema"
import { Wakeup } from "../kilocode/wakeup"
import DESCRIPTION from "./schedule-wakeup.txt"

export const ScheduleWakeupTool = Tool.define("schedule_wakeup", {
  description: DESCRIPTION,
  parameters: z.object({
    when: z.string().describe("ISO 8601 timestamp or relative duration (e.g., '5m', '1h')"),
    reason: z.string().describe("Why the wakeup is scheduled"),
    payload: z.record(z.unknown()).optional(),
  }),
  async execute(params, ctx) {
    const scheduled = await Wakeup.schedule({
      sessionID: ctx.sessionID,
      when: params.when,
      reason: params.reason,
      payload: params.payload,
    })
    return {
      title: `Scheduled wakeup at ${scheduled.at}`,
      metadata: { wakeupID: scheduled.id, at: scheduled.at },
      output: `Wakeup ${scheduled.id} scheduled for ${scheduled.at}: ${params.reason}`,
    }
  },
})
```

Also create `src/tool/schedule-wakeup.txt` with tool description content (16 lines from upstream).

### 2. Add Cancel Wakeup Tool
**File**: `src/tool/cancel-wakeup.ts` (new)
**Priority**: high
**Type**: feature
**Reason**: Companion tool to schedule-wakeup that allows agents to cancel pending wakeups (kilocode commit b7070e507).

**New code**:
```typescript
// src/tool/cancel-wakeup.ts
import { Tool } from "./tool"
import { z } from "zod"
import { Wakeup } from "../kilocode/wakeup"
import DESCRIPTION from "./cancel-wakeup.txt"

export const CancelWakeupTool = Tool.define("cancel_wakeup", {
  description: DESCRIPTION,
  parameters: z.object({
    wakeupID: z.string().describe("ID of the wakeup to cancel"),
  }),
  async execute(params, ctx) {
    const result = await Wakeup.cancel({
      sessionID: ctx.sessionID,
      wakeupID: params.wakeupID,
    })
    if (!result.cancelled) {
      return {
        title: `Wakeup ${params.wakeupID} not found`,
        metadata: { cancelled: false },
        output: `No pending wakeup with id ${params.wakeupID}`,
      }
    }
    return {
      title: `Cancelled wakeup ${params.wakeupID}`,
      metadata: { cancelled: true },
      output: `Wakeup ${params.wakeupID} cancelled`,
    }
  },
})
```

Also create `src/tool/cancel-wakeup.txt` (12 lines).

### 3. Add Wakeup Support Module
**File**: `src/kilocode/wakeup/` (new directory)
**Priority**: high
**Type**: feature
**Reason**: The wakeup tools require an underlying scheduling engine (upstream added `wakeup/index.ts`, `wakeup/resume.ts`, `wakeup/schema.ts` totaling ~427 lines). Needed for tools #1 and #2 to function.

**New files**:
```typescript
// src/kilocode/wakeup/schema.ts
import { z } from "zod"

export namespace WakeupSchema {
  export const Entry = z.object({
    id: z.string(),
    sessionID: z.string(),
    at: z.string(), // ISO 8601
    reason: z.string(),
    payload: z.record(z.unknown()).optional(),
    status: z.enum(["pending", "fired", "cancelled"]),
    createdAt: z.string(),
  })
  export type Entry = z.infer<typeof Entry>
}
```

```typescript
// src/kilocode/wakeup/index.ts
import { WakeupSchema } from "./schema"
import { App } from "../../app/app"
import { Log } from "../../util/log"

export namespace Wakeup {
  const log = Log.create({ service: "wakeup" })

  export async function schedule(opts: {
    sessionID: string
    when: string
    reason: string
    payload?: Record<string, unknown>
  }): Promise<WakeupSchema.Entry> {
    const at = normalizeWhen(opts.when)
    // Persist via App state store
    // ...
    log.info("scheduled", { sessionID: opts.sessionID, at })
    return entry
  }

  export async function cancel(opts: { sessionID: string; wakeupID: string }) {
    // ...
    return { cancelled: boolean }
  }

  export async function fireDue() { /* timer loop */ }

  function normalizeWhen(when: string): string {
    // handle relative "5m" / "1h" and ISO strings
  }
}
```

```typescript
// src/kilocode/wakeup/resume.ts
// Resume-session logic when a wakeup fires
export namespace WakeupResume {
  export async function resume(entry: WakeupSchema.Entry) { /* ... */ }
}
```

### 4. Register New Tools in Registry
**File**: `src/tool/registry.ts`
**Priority**: high
**Type**: feature
**Reason**: New wakeup tools must be wired into the tool registry (kilocode commit b7070e507 modified registry.ts +21 lines and +2 lines in the main registry).

**Current code**:
```typescript
// existing tool registrations
const TOOLS = [
  BashTool,
  RecallTool,
  // ...
]
```

**New code**:
```typescript
import { ScheduleWakeupTool } from "./schedule-wakeup"
import { CancelWakeupTool } from "./cancel-wakeup"

const TOOLS = [
  BashTool,
  RecallTool,
  // ...
  ScheduleWakeupTool,   // kilocode_change
  CancelWakeupTool,     // kilocode_change
]
```

### 5. Speed Up Local Recall Search + Role Index Fallback
**File**: `src/tool/recall.ts`
**Priority**: critical
**Type**: bugfix / performance
**Reason**: Upstream commit 02e92bcc6 significantly rewrote recall-search (packages/opencode/src/kilocode/session/recall-search.ts +198/-48) to speed up local recall searches and improve match ranking. Commit 306b4ed6c adds fallback recovery for prepare-time index errors. This is important for performance and reliability.

**Current code**:
```typescript
// src/tool/recall.ts - existing single-role query
const results = await queryParts(sessionID, needle)
```

**New code**:
```typescript
import { RecallMessageIndex } from "../core/session/recall-message-index"

async function ensureRoleIndex(db) {
  try {
    await db.run(RecallMessageIndex.createSql)
  } catch (err) {
    log.warn("recall role index fallback", { err })
  }
}

async function recall(sessionID: string, needle: string) {
  await ensureRoleIndex(db)
  try {
    // Fast path with joined role index
    return await queryPartsWithRole(sessionID, needle)
  } catch (err) {
    log.warn("recall fallback to slow role lookup", { err })
    return await queryPartsSlow(sessionID, needle)
  }
}
```

Also update `src/tool/recall.txt` prompt (+3/-1 lines).

### 6. Add Recall Message Role Index to Schema
**File**: `src/core/session/recall-message-index.ts` (new)
**Priority**: critical
**Type**: performance
**Reason**: New covering index (kilocode commit 02e92bcc6) that allows recall search to resolve message roles without reading full message rows. Direct port from upstream `packages/core/src/kilocode/session/recall-message-index.ts`.

**New code**:
```typescript
import { sql } from "drizzle-orm"
import { index, type AnySQLiteColumn } from "drizzle-orm/sqlite-core"

// Covering index so recall search can resolve message roles without reading message rows.
export namespace RecallMessageIndex {
  export const name = "recall_message_role_idx"

  export const createSql = `CREATE INDEX IF NOT EXISTS \`${name}\` ON \`message\` (\`id\`,json_extract("data", '$.role'),coalesce(json_extract("data", '$.parentID'), ''));`

  export function make(table: { id: AnySQLiteColumn; data: AnySQLiteColumn }) {
    return index(name).on(
      table.id,
      sql`json_extract(${table.data}, '$.role')`,
      sql`coalesce(json_extract(${table.data}, '$.parentID'), '')`,
    )
  }
}
```

**File**: `src/core/database/schema.gen.ts`
**New code** (append inside index creation block):
```typescript
// kilocode_change start
yield* tx.run(
  `CREATE INDEX \`recall_message_role_idx\` ON \`message\` (\`id\`,json_extract("data", '$.role'),coalesce(json_extract("data", '$.parentID'), ''));`,
)
// kilocode_change end
```

### 7. Migration Preservation for Recall Indexes
**File**: `src/core/script/kilocode/migration.ts` (if present)
**Priority**: high
**Type**: bugfix
**Reason**: Migration script must recognize the new `recall_message_role_idx` index name so it's marked as a kilocode change and preserved across upstream syncs (kilocode commit 02e92bcc6).

**Current code**:
```typescript
return (name !== undefined && board(name)) || /kilo_board(?:_message)?|part_session_step_finish_idx/.test(source)
```

**New code**:
```typescript
return (name !== undefined && board(name)) ||
  /kilo_board(?:_message)?|part_session_step_finish_idx|recall_(?:part_search|message_role)_idx/.test(source)
```

### 8. Promote Kilo Swarm / Shared Agent Board to Top-Level Config
**File**: `src/kilocode/config/config.ts`
**Priority**: high
**Type**: feature / breaking-change-mitigation
**Reason**: Upstream commit 1c33649f9 promoted the shared agent board out of `experimental.shared_agent_board` to a top-level setting; commit 6cfb025f9 warns when the retired experimental key is present; commit c63f77c2e adds `shared_agent_board` to known config keys; commit 50fc57db0 enables it by default. Alexi must both accept the new location and warn/migrate old configs.

**Current code**:
```typescript
export const ConfigSchema = z.object({
  experimental: z.object({
    shared_agent_board:
{"prompt_tokens":27296,"completion_tokens":4096,"total_tokens":31392,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: b4f9bccb-1815-4391-b33a-0a946907d790]
[Messages: 2, Tokens: 31392]
