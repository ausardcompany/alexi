```markdown
# Update Plan for Alexi

Generated: 2026-09-03
Based on upstream commits: kilocode dfbf8df62..cf954237c (83 commits), opencode 69c172e..f12e14c (14 commits)

## Summary
- Total changes planned: 14
- Critical: 2 | High: 5 | Medium: 5 | Low: 2

## Changes

### 1. Add Task-Scoped Shared Agent Board Feature
**File**: `src/tool/board.ts` (NEW)
**Priority**: high
**Type**: feature
**Reason**: Upstream introduces a task-scoped shared board system (`packages/opencode/src/kilocode/tool/board.ts` +214 lines, `board/store.ts` +716 lines) that allows agents in the same swarm to share status and coordination messages. This is a core swarm coordination feature that enables multi-agent workflows.

**New code**:
```typescript
// src/tool/board.ts
import { z } from "zod"
import { Tool } from "./tool"
import { BoardStore } from "../core/board/store"
import { BoardContext } from "../core/board/context"

export const BoardReadTool = Tool.define("kilo_board_read", {
  description: "Read messages from the shared agent board for the current task",
  parameters: z.object({
    since: z.string().datetime().optional().describe("Read messages since this ISO timestamp"),
    limit: z.number().int().positive().max(100).default(50),
  }),
  async execute(params, ctx) {
    const boardId = await BoardContext.resolve(ctx.sessionID)
    if (!boardId) {
      return { output: "No shared board for this task.", metadata: {} }
    }
    const messages = await BoardStore.read(boardId, {
      since: params.since,
      limit: params.limit,
    })
    // Mark as read to avoid stale notices
    await BoardStore.acknowledgeReads(boardId, ctx.sessionID, messages.map((m) => m.id))
    return {
      output: messages.map((m) => `[${m.author}] ${m.content}`).join("\n"),
      metadata: { count: messages.length, boardId },
    }
  },
})

export const BoardWriteTool = Tool.define("kilo_board_write", {
  description: "Post a message to the shared agent board for coordination with peer agents",
  parameters: z.object({
    content: z.string().min(1).max(4000),
  }),
  async execute(params, ctx) {
    const boardId = await BoardContext.resolve(ctx.sessionID)
    if (!boardId) {
      throw new Error("No shared board available for this session")
    }
    const message = await BoardStore.write(boardId, {
      sessionID: ctx.sessionID,
      author: ctx.agentName ?? "agent",
      content: params.content,
    })
    return { output: `Posted to board.`, metadata: { messageId: message.id } }
  },
})
```

### 2. Add Board Store (SQLite-backed persistence)
**File**: `src/core/board/store.ts` (NEW)
**Priority**: high
**Type**: feature
**Reason**: Backend store for shared agent boards (upstream `packages/opencode/src/kilocode/board/store.ts` +716 lines). Uses SQLite via the migration `20260828074139_kilocode_board.ts`. Must align with Alexi's existing DB access layer.

**New code**:
```typescript
// src/core/board/store.ts
import { Database } from "../db"

export namespace BoardStore {
  export interface Message {
    id: string
    boardId: string
    sessionID: string
    author: string
    content: string
    createdAt: string
  }

  export async function ensure(boardId: string, taskId: string): Promise<void> {
    await Database.run(
      `INSERT INTO kilo_board (id, task_id, created_at)
       VALUES (?, ?, ?)
       ON CONFLICT(id) DO NOTHING`,
      [boardId, taskId, new Date().toISOString()],
    )
  }

  export async function write(
    boardId: string,
    input: { sessionID: string; author: string; content: string },
  ): Promise<Message> {
    const id = crypto.randomUUID()
    const createdAt = new Date().toISOString()
    await Database.run(
      `INSERT INTO kilo_board_message (id, board_id, session_id, author, content, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, boardId, input.sessionID, input.author, input.content, createdAt],
    )
    return { id, boardId, ...input, createdAt }
  }

  export async function read(
    boardId: string,
    opts: { since?: string; limit?: number } = {},
  ): Promise<Message[]> {
    const rows = await Database.all<Message>(
      `SELECT id, board_id AS boardId, session_id AS sessionID, author, content, created_at AS createdAt
       FROM kilo_board_message
       WHERE board_id = ?
         ${opts.since ? "AND created_at > ?" : ""}
       ORDER BY created_at ASC
       LIMIT ?`,
      opts.since ? [boardId, opts.since, opts.limit ?? 50] : [boardId, opts.limit ?? 50],
    )
    return rows
  }

  export async function acknowledgeReads(
    boardId: string,
    sessionID: string,
    messageIds: string[],
  ): Promise<void> {
    // kilocode fix: avoid stale shared-board notices after reads (commit 162e30d23)
    if (messageIds.length === 0) return
    await Database.run(
      `INSERT INTO kilo_board_read (board_id, session_id, message_id)
       VALUES ${messageIds.map(() => "(?, ?, ?)").join(",")}
       ON CONFLICT DO NOTHING`,
      messageIds.flatMap((id) => [boardId, sessionID, id]),
    )
  }
}
```

### 3. Add Board Database Migration
**File**: `src/core/db/migrations/20260828074139_kilocode_board.ts` (NEW)
**Priority**: critical
**Type**: feature
**Reason**: Required schema for the shared board feature. Without it, board tools will fail. Migration must be registered in migration.gen.ts.

**New code**:
```typescript
// src/core/db/migrations/20260828074139_kilocode_board.ts
import { Effect } from "effect"
import type { DatabaseMigration } from "../migration"

export default {
  id: "20260828074139_kilocode_board",
  up(tx) {
    return Effect.gen(function* () {
      yield* tx.execute(`
        CREATE TABLE kilo_board (
          id TEXT PRIMARY KEY,
          task_id TEXT NOT NULL,
          created_at TEXT NOT NULL
        )
      `)
      yield* tx.execute(`
        CREATE TABLE kilo_board_message (
          id TEXT PRIMARY KEY,
          board_id TEXT NOT NULL REFERENCES kilo_board(id) ON DELETE CASCADE,
          session_id TEXT NOT NULL,
          author TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at TEXT NOT NULL
        )
      `)
      yield* tx.execute(`CREATE INDEX idx_kilo_board_message_board ON kilo_board_message(board_id, created_at)`)
      yield* tx.execute(`
        CREATE TABLE kilo_board_read (
          board_id TEXT NOT NULL,
          session_id TEXT NOT NULL,
          message_id TEXT NOT NULL,
          PRIMARY KEY (board_id, session_id, message_id)
        )
      `)
    })
  },
} satisfies DatabaseMigration.Migration
```

### 4. Register Board Migration
**File**: `src/core/db/migration.gen.ts`
**Priority**: critical
**Type**: feature
**Reason**: Auto-generated migration index must include new board migration (mirrors upstream diff).

**Current code**:
```typescript
import("./migration/20260714141136_session-message-legacy-writer-compat"),
```

**New code**:
```typescript
import("./migration/20260714141136_session-message-legacy-writer-compat"),
import("./migration/20260828074139_kilocode_board"),
```

### 5. Register Board Tools in Tool Registry
**File**: `src/tool/registry.ts`
**Priority**: high
**Type**: feature
**Reason**: Upstream registry adds board tools (`packages/opencode/src/kilocode/tool/registry.ts` +36 lines). Board tools must be discoverable via the registry, gated by shared-board config flag.

**New code** (add to registry):
```typescript
import { BoardReadTool, BoardWriteTool } from "./board"
import { Config } from "../core/config"

// In registry initialization:
export async function buildToolRegistry(ctx: Registry.Context) {
  const tools = [...standardTools]
  const config = await Config.get()

  // kilocode: task-scoped shared agent board (experimental)
  if (config.experimental?.sharedAgentBoard) {
    tools.push(BoardReadTool, BoardWriteTool)
  }

  return tools
}
```

### 6. Add Shared-Board Config Flag
**File**: `src/core/config/config.ts`
**Priority**: high
**Type**: feature
**Reason**: Upstream added shared-agent-board experimental flag (`packages/core/src/v1/config/config.ts` +3 lines, plus test `config-shared-agent-board.test.ts`).

**Current code**:
```typescript
experimental: Schema.optional(Schema.Struct({
  // existing flags
})),
```

**New code**:
```typescript
experimental: Schema.optional(Schema.Struct({
  // existing flags
  sharedAgentBoard: Schema.optional(Schema.Boolean).annotate({
    description: "Enable task-scoped shared agent board for multi-agent coordination (experimental).",
  }),
})),
```

### 7. Expose Swarm Agent Identity in Task Tool
**File**: `src/tool/task.ts`
**Priority**: high
**Type**: feature
**Reason**: Upstream commit `beb84eb50` exposes swarm agent identity and execution state, and `2682dcb31` keeps shared-board content in explicit tool reads. Task tool should propagate agent identity to child sessions.

**Current code** (approximate):
```typescript
export const TaskTool = Tool.define("task", {
  parameters: z.object({
    description: z.string(),
    prompt: z.string(),
    subagent_type: z.string(),
  }),
  async execute(params, ctx) {
    const child = await Session.create({ parentID: ctx.sessionID })
    // ...
  },
})
```

**New code**:
```typescript
export const TaskTool = Tool.define("task", {
  parameters: z.object({
    description: z.string(),
    prompt: z.string(),
    subagent_type: z.string(),
  }),
  async execute(params, ctx) {
    const child = await Session.create({
      parentID: ctx.sessionID,
      // kilocode: expose swarm identity/execution state to child
      agentIdentity: {
        name: params.subagent_type,
        role: "swarm-member",
        parentTaskDescription: params.description,
      },
    })
    // Propagate shared board context if present
    const boardId = await BoardContext.resolve(ctx.sessionID)
    if (boardId) {
      await BoardContext.attach(child.id, boardId)
    }
    // ...
  },
})
```

### 8. Prune Old Tool Outputs in Single-Turn Subagents
**File**: `src/session/compaction.ts` (or equivalent)
**Priority**: high
**Type**: bugfix
**Reason**:
{"prompt_tokens":25288,"completion_tokens":4096,"total_tokens":29384,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 3ff3c12e-672b-4927-a4a6-be1ca0dad278]
[Messages: 2, Tokens: 29384]
