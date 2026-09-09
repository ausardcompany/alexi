```markdown
# Update Plan for Alexi

Generated: 2026-09-09
Based on upstream commits analyzed:
- kilocode: a7a7690ca..492a2ffa2 (119 commits)
- opencode: d6855b6..830d5eb (4 commits)

## Summary
- Total changes planned: 12
- Critical: 2 | High: 5 | Medium: 3 | Low: 2

## Key Themes from Upstream
1. **Interactive Terminal Tool REMOVED** (kilocode) — nonfunctional; removed from registry and codebase
2. **Amazon Bedrock DeepSeek fix** (opencode) — preserve ARN/prefixed model IDs
3. **New Astra system prompt** (opencode) — port for GPT models
4. **Session Goals feature** (kilocode) — new persistent session goals subsystem
5. **Board reset migration** (kilocode) — new `cleared_seq` column on `kilo_board`
6. **Caffeination refactor** (kilocode) — moved from vscode inhibitor to core module
7. **Snapshot hang fix** (kilocode) — prevent progress-session hangs
8. **Prompt queue improvements** (kilocode) — attachment admission handling

## Changes

### 1. Remove Interactive Terminal Tool
**File**: `src/tool/interactive-terminal.ts`, `src/tool/interactive-terminal.txt`
**Priority**: high
**Type**: refactor
**Reason**: Upstream (`b5cf42615 fix(cli): remove nonfunctional interactive terminal tool`) removes this tool entirely. The upstream diff shows `packages/opencode/src/kilocode/tool/interactive-terminal.ts` deleted (-94 lines), along with the HTTP API groups, handlers, and 469-line implementation module. It's nonfunctional and adds complexity.

**Action**:
- Delete `src/tool/interactive-terminal.ts` (if it exists)
- Delete `src/tool/interactive-terminal.txt`
- Delete any `src/kilocode/interactive-terminal/` directory
- Delete `src/tui/interactive-terminal.tsx` if present
- Delete related HTTP handlers under `src/server/httpapi/`

**Registry update** (`src/tool/registry.ts`):
```typescript
// BEFORE
import { InteractiveTerminalTool } from "./interactive-terminal"
// ...
const TOOLS = [
  ShellTool,
  InteractiveTerminalTool, // <-- remove
  TaskTool,
  // ...
]

// AFTER
const TOOLS = [
  ShellTool,
  TaskTool,
  // ...
]
```

Also remove any imports/tests referencing `interactive-terminal`.

---

### 2. Fix Amazon Bedrock DeepSeek Model ID Handling
**File**: `src/providers/amazon-bedrock.ts` (or equivalent SAP AI Core provider wrapper if Bedrock is proxied)
**Priority**: critical
**Type**: bugfix
**Reason**: opencode commit `ac1758c fix: preserve Bedrock DeepSeek model ids (#34441)` fixes double-prefixing of already-prefixed DeepSeek IDs and ARN-based model IDs. Without this fix, valid model IDs like `us.deepseek.r1-v1:0` or full ARNs get corrupted.

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
  // Preserve full ARN model IDs
  if (modelID.startsWith("arn:")) return modelID

  const crossRegionPrefixes = ["global.", "us.", "eu.", "jp.", "apac.", "au."]
  if (crossRegionPrefixes.some((prefix) => modelID.startsWith(prefix))) return modelID

  const resolvedRegion = region ?? "us-east-1"
  const regionPrefix = resolvedRegion.split("-")[0]
  if (regionPrefix === "us") {
    // Narrow to deepseek.r1 specifically; deepseek.v3.2 does NOT need prefixing
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

**Note**: If Alexi routes Bedrock traffic through SAP AI Core, verify SAP's model naming convention still passes through unchanged. Only apply this fix in the direct-Bedrock code path.

---

### 3. Add Astra System Prompt for GPT Models
**File**: `src/session/prompt/gpt-astra.txt` (new), `src/session/system.ts`
**Priority**: medium
**Type**: feature
**Reason**: opencode commit `5cd8e68 feat(opencode): port Astra system prompt from v2` adds a specialized prompt for GPT/Astra models (46 lines).

**New file** `src/session/prompt/gpt-astra.txt`: copy from `packages/opencode/src/session/prompt/gpt-astra.txt`

**Update** `src/session/system.ts`:
```typescript
// Add to system prompt selector
import PROMPT_GPT_ASTRA from "./prompt/gpt-astra.txt"

// In the model → prompt matcher, register:
if (modelID.includes("astra") || matchesAstraFamily(modelID)) {
  return PROMPT_GPT_ASTRA
}
```

Verify selection logic against upstream `system.ts` +2 line diff.

---

### 4. Add Board Reset Migration (`cleared_seq` Column)
**File**: `src/core/database/migration/20260903104806_kilocode_board_reset.ts` (new), `src/core/database/migration.gen.ts`, `src/core/database/schema.gen.ts`
**Priority**: high
**Type**: feature
**Reason**: Enables the new "reset board" feature. Adds `cleared_seq` column so board messages emitted before a reset are filtered out.

**New migration file**:
```typescript
import { Effect } from "effect"
import type { DatabaseMigration } from "../migration"

export default {
  id: "20260903104806_kilocode_board_reset",
  up(tx) {
    return Effect.gen(function* () {
      yield* tx.run(`ALTER TABLE \`kilo_board\` ADD \`cleared_seq\` integer DEFAULT 0 NOT NULL;`)
    })
  },
} satisfies DatabaseMigration.Migration
```

**Update** `src/core/database/migration.gen.ts`:
```typescript
export const migrations = (
  await Promise.all([
    // ...existing imports...
    import("./migration/20260828074139_kilocode_board"),
    import("./migration/20260903104806_kilocode_board_reset"), // <-- add
    import("./migration/20260907102000_kilocode_model_usage_index"),
  ])
).map((module) => module.default) satisfies DatabaseMigration.Migration[]
```

**Update** `src/core/database/schema.gen.ts` — add `cleared_seq` column to `kilo_board` CREATE TABLE definition:
```typescript
`objective_message_id` text,
`next_seq` integer DEFAULT 1 NOT NULL,
`cleared_seq` integer DEFAULT 0 NOT NULL,   // <-- add
`message_count` integer DEFAULT 0 NOT NULL,
```

**Update** `src/core/script/kilocode/migration.ts` — update regex to include the reset migration:
```typescript
function board(name: string) {
  return /(?:^|_)kilocode_board(?:_reset)?$/.test(name)
}
```

**Update** `src/core/schema.json` — bump `id`, add `prevIds` entry, add column entry (mirror upstream diff).

---

### 5. Add Board Store Reset Support
**File**: `src/kilocode/board/store.ts`
**Priority**: high
**Type**: feature
**Reason**: Upstream diff shows +170/-68 in `store.ts`, adding reset semantics and filtering by `cleared_seq`.

**Action**: Port full changes from `packages/opencode/src/kilocode/board/store.ts`. Key additions:
- New `reset(sessionID)` function that bumps `cleared_seq` to current `next_seq`
- Read queries filtered by `seq > cleared_seq`
- New event emission for board resets

Also port `packages/opencode/src/kilocode/server/httpapi/handlers/kilocode.ts` (+48) and `groups/kilocode.ts` (+44) additions for the reset endpoint.

---

### 6. Add Session Goals Subsystem
**File**: `src/kilocode/session/goal/*` (new directory)
**Priority**: medium
**Type**: feature
**Reason**: New "persistent session goals" feature (`6199c0126 feat(goal): add persistent session goals`). Substantial new subsystem.

**New files to create/port from upstream**:
- `src/kilocode/session/goal/runner.ts` (+486 lines)
- `src/kilocode/session/goal/state.ts` (+67)
- `src/kilocode/session/goal/policy.ts` (+58)
- `src/kilocode/session/goal/tool.ts` (+41)
- `src/kilocode/session/goal/instructions.ts` (+8)

**Update** `src/kilocode/session/prompt-queue.ts` (+5 lines):
```typescript
// Add hook to check active goal on enqueue
if (goalState.hasActiveGoal(sessionID)) {
  // integration point per upstream
}
```

**Update** `src/session/prompt.ts` (+84/-34) — significant refactoring for goal admission and running-response replacement:
- Preserve attachment admission interrupts
- Allow goals to replace running responses
- Preserve cancellation semantics

**Note**: This is a large feature. Consider deferring to a follow-up PR if not required for parity.

---

### 7. Fix Snapshot Progress Session Hangs
**File**: `src/kilocode/snapshot/track.ts`, `src/snapshot/index.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Commit `9db971865 fix(cli): prevent snapshot progress session hangs` — snapshots could hang initialization indefinitely.

**Port changes** from upstream diffs:
- `packages/opencode/src/kilocode/snapshot/track.ts` (+6/-4): add timeout/skip-disabled logic
- `packages/opencode/src/snapshot/index.ts` (+4): guard for
{"prompt_tokens":35824,"completion_tokens":4096,"total_tokens":39920,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: fd459cd7-ea4d-48b0-afee-fb28fc95b841]
[Messages: 2, Tokens: 39920]
