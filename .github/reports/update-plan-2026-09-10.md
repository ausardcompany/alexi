# Update Plan for Alexi

Generated: 2026-09-10
Based on upstream commits: kilocode a7a7690ca..70f1f5394 (255 commits), opencode d6855b6..b3f1a96 (13 commits)

## Summary
- Total changes planned: 14
- Critical: 2 | High: 5 | Medium: 4 | Low: 3

## Analysis Notes

The kilocode upstream introduced massive UX/UI features (Agent Manager PR workflows, Kilo Swarm board view, session goals, native OS notifications, Claude migration) that are **not applicable** to Alexi (a SAP AI Core-focused backend fork without VSCode UI).

The **relevant** upstream changes for Alexi are:
1. **Core bug fixes** (move-session performance, permission prompt races, snapshot hangs)
2. **Bedrock provider fix** (ARN handling, DeepSeek routing) — from opencode
3. **Tool registry cleanup** (interactive-terminal removal)
4. **Database migration** (`kilocode_board_reset`)
5. **Board store refactoring** (clearing/reset semantics)
6. **Session prompt improvements** (adaptive thinking summarization)
7. **Snapshot disable path**

---

## Changes

### 1. Add ARN passthrough in Amazon Bedrock plugin
**File**: `src/providers/amazon-bedrock.ts` (or wherever bedrock provider lives)
**Priority**: critical
**Type**: bugfix
**Reason**: The current `resolveModelID` double-prefixes ARN-based model IDs and incorrectly cross-region-prefixes `deepseek.v3.2` (only `deepseek.r1` should be prefixed). This is a real functional bug affecting Bedrock users, and Alexi may pass ARNs via SAP AI Core routing.

**Current code**:
```typescript
function resolveModelID(modelID: string, region: string | undefined) {
  const crossRegionPrefixes = ["global.", "us.", "eu.", "jp.", "apac.", "au."]
  if (crossRegionPrefixes.some((prefix) => modelID.startsWith(prefix))) return modelID

  const resolvedRegion = region ?? "us-east-1"
  const regionPrefix = resolvedRegion.split("-")[0]
  if (regionPrefix === "us") {
    const requiresPrefix = ["nova-micro", "nova-lite", "nova-pro", "nova-premier", "nova-2", "claude", "deepseek"].some(
      (item) => modelID.includes(item),
    )
    if (requiresPrefix && !resolvedRegion.startsWith("us-gov")) return `${regionPrefix}.${modelID}`
    return modelID
  }
  // ...
}
```

**New code**:
```typescript
function resolveModelID(modelID: string, region: string | undefined) {
  // Never rewrite explicit ARNs
  if (modelID.startsWith("arn:")) return modelID

  const crossRegionPrefixes = ["global.", "us.", "eu.", "jp.", "apac.", "au."]
  if (crossRegionPrefixes.some((prefix) => modelID.startsWith(prefix))) return modelID

  const resolvedRegion = region ?? "us-east-1"
  const regionPrefix = resolvedRegion.split("-")[0]
  if (regionPrefix === "us") {
    // Narrow DeepSeek match: only r1 needs the us. prefix, not v3.x
    const requiresPrefix = [
      "nova-micro",
      "nova-lite",
      "nova-pro",
      "nova-premier",
      "nova-2",
      "claude",
      "deepseek.r1",
    ].some((item) => modelID.includes(item))
    if (requiresPrefix && !resolvedRegion.startsWith("us-gov")) return `${regionPrefix}.${modelID}`
    return modelID
  }
  // ...
}
```

Also add corresponding test cases in `test/providers/amazon-bedrock.test.ts`:
```typescript
{ region: "us-east-1", modelID: "us.deepseek.r1-v1:0", expected: "us.deepseek.r1-v1:0" },
{ region: "us-east-1", modelID: "deepseek.v3.2", expected: "deepseek.v3.2" },
{
  region: "us-east-1",
  modelID: "arn:aws:bedrock:us-east-1::foundation-model/deepseek.v3.2",
  expected: "arn:aws:bedrock:us-east-1::foundation-model/deepseek.v3.2",
},
```

---

### 2. Fix move-session performance regression (skip source resolve when no changes moved)
**File**: `src/core/control-plane/move-session.ts`
**Priority**: critical
**Type**: bugfix (performance)
**Reason**: Resolving the source project spawns Git subprocesses. When moving sessions without changes (e.g., worktree deletion cleanup), this is wasted work and can hang. Alexi shares this control-plane code and would exhibit the same slowdown.

**Current code**:
```typescript
const source = yield* project.resolve(current.location.directory)
const destination = yield* project.resolve(directory)
if (current.projectID !== destination.id) {
  return yield* new DestinationProjectMismatchError({ expected: current.projectID, actual: destination.id })
}

const moveChanges = input.moveChanges && source.directory !== destination.directory
```

**New code**:
```typescript
const destination = yield* project.resolve(directory)
if (current.projectID !== destination.id) {
  return yield* new DestinationProjectMismatchError({ expected: current.projectID, actual: destination.id })
}

// Skip source resolve (spawns Git subprocesses) when no changes are moved,
// e.g. worktree deletion. The source is only needed to compute moveChanges/discovery.
const source = input.moveChanges ? yield* project.resolve(current.location.directory) : undefined
const moveChanges = source ? source.directory !== destination.directory : false
```

Add test coverage mirroring `packages/core/test/move-session.test.ts` (+59 lines) verifying that `project.resolve` is NOT called on the source when `moveChanges: false`.

---

### 3. Add `kilocode_board_reset` database migration
**File**: `src/core/database/migration/20260903104806_kilocode_board_reset.ts` (new)
**File**: `src/core/database/migration.gen.ts` (register)
**Priority**: high
**Type**: feature (schema)
**Reason**: Adds a `cleared_seq` column and reset semantics for the shared agent board. Alexi's board store depends on this migration if the board feature is retained.

**New file**:
```typescript
// src/core/database/migration/20260903104806_kilocode_board_reset.ts
import type { DatabaseMigration } from "../types"

const migration: DatabaseMigration.Migration = {
  id: "20260903104806_kilocode_board_reset",
  up: async (db) => {
    // Match upstream migration adding cleared_seq to kilo_board tables
    await db.run(`ALTER TABLE kilo_board ADD COLUMN cleared_seq INTEGER NOT NULL DEFAULT 0`)
  },
  down: async () => {
    /* forward-only */
  },
}

export default migration
```

**Register in `src/core/database/migration.gen.ts`**:
```typescript
import("./migration/20260828074139_kilocode_board"),
import("./migration/20260903104806_kilocode_board_reset"), // kilocode_change
import("./migration/20260907102000_kilocode_model_usage_index"),
```

Also update schema JSON `schema.gen.ts` to include the `cleared_seq` column definition.

---

### 4. Update board name matcher regex
**File**: `src/core/script/kilocode/migration.ts` (or equivalent)
**Priority**: high
**Type**: bugfix
**Reason**: The new migration adds `kilocode_board_reset` tables that must be matched by the board-detection helper. The previous string check misses reset variants.

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

### 5. Extend board store with clear/reset semantics
**File**: `src/kilocode/board/store.ts` (if present in Alexi)
**Priority**: high
**Type**: feature
**Reason**: Upstream `packages/opencode/src/kilocode/board/store.ts` gained +178/-69 lines implementing board reset, cleared_seq tracking, and post-clear routing. Required if Alexi supports the swarm/board tool.

**Key additions** (adapt to Alexi's style):
```typescript
// Track cleared sequence per board so subsequent posts skip stale entries
export interface BoardClearedState {
  clearedSeq: number
}

export async function resetBoard(sessionID: string): Promise<void> {
  // Increment cleared_seq atomically; subscribers filter posts older than clearedSeq
  await sql`
    UPDATE kilo_board
    SET cleared_seq = seq
    WHERE session_id = ${sessionID}
  `
}

// When reading, filter posts with seq > cleared_seq
export async function listPosts(sessionID: string) {
  return sql`
    SELECT * FROM kilo_board_post
    WHERE session_id = ${sessionID}
      AND seq > (SELECT cleared_seq FROM kilo_board WHERE session_id = ${sessionID})
    ORDER BY seq ASC
  `
}
```

Port matching tests from `packages/opencode/test/kilocode/board/store.test.ts` (+174 lines) and `packages/core/test/kilocode/board/migration.test.ts` (+39 lines).

---

### 6. Warn when `board_post` targets a stopped subagent
**File**: `src/tool/board.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Prevents silent message loss when broadcasting to terminated subagents. Aligns with upstream `packages/opencode/src/kilocode/tool/board.ts` (+23/-12).

**New logic** (inside the board tool handler):
```typescript
async function execute(params: BoardPostParams, ctx: ToolContext) {
  const { recipient } = params

  if (recipient && recipient !== "broadcast") {
    const target = await ctx.subagents.get(recipient)
    if (!target || target.status === "stopped" || target.status === "exited") {
      ctx.logger.warn(
        `board_post: target subagent "${recipient}" is not running; message may not be delivered`,
      )
      // Continue so history is preserved, but surface a warning to the model
      return {
        output: `Warning: recipient "${recipient}" is not currently running. The post was recorded but will not be delivered.`,
      }
    }
  }
  // ...existing post logic
}
```

---

### 7. Remove interactive-terminal tool
**Files**:
- `src/tool/interactive-terminal.ts` (delete)
- `src/tool/interactive-terminal.txt` (delete)
- `src/tool/registry.ts` (unregister)
- `src/kilocode/interactive-terminal/` (delete if present)
- `src/kilocode/server/httpapi/groups/interactive-terminal.ts` (delete)
- `src/kilocode/server/httpapi/handlers/interactive-terminal.ts` (delete)

**Priority**: medium
**Type**: refactor
**Reason**: Upstream removed the "nonfunctional interactive terminal tool" (commit `b5cf42615`). Keeping it in Alexi
{"prompt_tokens":49408,"completion_tokens":4096,"total_tokens":53504,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: d39e7b6a-5a65-4bd1-8476-eb8c295c28f6]
[Messages: 2, Tokens: 53504]
