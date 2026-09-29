# Update Plan for Alexi

Generated: 2026-09-29
Based on upstream commits analyzed:
- kilocode: 318a913a2..2dfe6fc87 (45 commits)
- opencode: f416138..7945de2 (11 commits, primarily console/web UI - not applicable to Alexi)

## Summary
- Total changes planned: 11
- Critical: 1 | High: 5 | Medium: 4 | Low: 1

The primary theme of this upstream batch is **goal-timing-tools synergy** (kwf/goal-timing-tools-synergy-99ac) and **scheduled session status** (kwf/cli-scheduled-session-state-1f5e). These make session goals cooperate correctly with `schedule_wakeup`, `cron_create`, `monitor`, and `start` so goal turns suspend instead of spinning when waiting on time-based events. There is also a critical **context-overflow recovery** fix, and a **cache-breakpoint gating** fix for OpenAI-compatible custom providers.

## Changes

### 1. Add `scheduled` session status type
**File**: `src/schema/session-status-event.ts` (or wherever `SessionStatus` is defined)
**Priority**: high
**Type**: feature
**Reason**: Upstream added a new `scheduled` session status derived at the status endpoint. It represents a session doing nothing now (like `idle`) but waiting on a scheduled wakeup/cron. Board tool and orchestration need to recognize it.

**New code** (add to status union):
```typescript
// Extend the SessionStatus discriminated union
export type SessionStatus =
  | { type: "idle"; /* ... */ }
  | { type: "running"; /* ... */ }
  | { type: "waiting"; /* ... */ }
  // kilocode_change start: scheduled status
  | { type: "scheduled"; wakeAt: number /* epoch ms */ }
  // kilocode_change end
```

Also update the OpenAPI/SDK generated types if Alexi mirrors those:
```typescript
// src/sdk/types.gen.ts (or equivalent)
export type SessionStatusType = "idle" | "running" | "waiting" | "scheduled"
```

---

### 2. Add `isRunningStatus` helper and use in orchestration
**File**: `src/core/session-status.ts` (new) and `src/core/orchestration-domain.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream mapped non-running statuses (including new `scheduled`) to `idle` in the overview aggregation to avoid misclassifying suspended goal sessions as active.

**New file** `src/core/session-status.ts`:
```typescript
// kilocode_change: extracted for goal-timing scheduled-state handling
import type { SessionStatus } from "../schema/session-status-event"

const RUNNING_STATUSES: ReadonlySet<SessionStatus["type"]> = new Set([
  "running",
  "waiting",
  // Explicitly not: "idle", "scheduled"
])

export function isRunningStatus(type: SessionStatus["type"]): boolean {
  return RUNNING_STATUSES.has(type)
}
```

**Current code** in `orchestration-domain.ts` (or equivalent aggregation loop):
```typescript
for (const [id, value] of Object.entries(status.data ?? {}) as Array<[string, SessionStatus]>) {
  statuses.set(id, value.type)
}
```

**New code**:
```typescript
import { isRunningStatus } from "./session-status"

for (const [id, value] of Object.entries(status.data ?? {}) as Array<[string, SessionStatus]>) {
  // kilocode_change: coerce non-running (idle/scheduled) to idle for overview
  statuses.set(id, isRunningStatus(value.type) ? value.type : "idle")
}
```

---

### 3. Update `board.ts` to skip `scheduled` sessions like `idle`
**File**: `src/tool/board.ts`
**Priority**: high
**Type**: bugfix
**Reason**: The board snapshot must not treat scheduled sessions as active work; they are logically dormant until their wakeup fires.

**Current code**:
```typescript
for (const [id, value] of yield* status.list()) {
  if (value.type === "idle") continue
  sessions.set(id, { state: value.type, updated: sessions.get(id)?.updated })
}
```

**New code**:
```typescript
for (const [id, value] of yield* status.list()) {
  // kilocode_change start: `scheduled` is derived at the status endpoint,
  // never stored, but describes a session doing nothing now like `idle`.
  if (value.type === "idle" || value.type === "scheduled") continue
  // kilocode_change end
  sessions.set(id, { state: value.type, updated: sessions.get(id)?.updated })
}
```

---

### 4. Extend `background-process` tool docs with Goals guidance
**File**: `src/tool/background-process.txt.ts`
**Priority**: high
**Type**: feature
**Reason**: New goal-timing-tools synergy: inside a session goal, `sleep` in a bash tool spins the goal loop; `schedule_wakeup`/`cron_create` must be used instead. `monitor` and non-terminal `start` suspend the goal.

**Change** (edit the description string):
```typescript
// Before this sentence:
// "Do not start `sleep`, timers, cooldowns, delays, or polling loops with this tool.
//  To wait a fixed time before your next action, run the wait as a normal blocking
//  shell command and set its `timeout` higher than the wait."

// Replace with:
`Do not start \`sleep\`, timers, cooldowns, delays, or polling loops with this tool. \
Outside a session goal, wait a fixed time with a blocking shell command and raise its \
\`timeout\`. In a session goal, a time-based wait must use \`schedule_wakeup\` or \
\`cron_create\` so the goal suspends; a blocking shell sleep is progress and the goal \
loop will spin.`

// And append a new Goals section after "Monitor:" block:
`
Goals:
- In a session goal, \`monitor\` blocks the goal turn until the process stops, so the goal does not spin while the process runs; the process exit resumes the goal.
- A non-terminal \`start\` suspends the goal until the process exits, and the exit resumes the goal.
- Do not explore the repository, search for a deploy, or poll with bash when the goal is to wait for a deploy, build, or CI job; schedule that wait. Do not report blocked because no deploy is visible.
`
```

---

### 5. Extend `cancel-wakeup` tool docs with Goals guidance
**File**: `src/tool/cancel-wakeup.txt.ts`
**Priority**: medium
**Type**: feature
**Reason**: Clarifies that cancelling a wakeup a goal awaits resumes that goal turn.

**New code** (add after "Cancelling an id that is already gone is safe..."):
```typescript
`In a session goal, a wakeup the goal waits for suspends the goal until it fires; \
cancelling it resumes the goal with a goal turn, or settles it with a reason the user can read.`
```

---

### 6. Extend `cron-create` tool docs with Goals section
**File**: `src/tool/cron-create.txt.ts`
**Priority**: high
**Type**: feature
**Reason**: Instructs the model to schedule waits immediately inside a session goal rather than polling. Also documents the 7-day horizon clamping behavior.

**New code** (insert after schedule options, before "Limits and behavior"):
```typescript
`
Goals:
- In a session goal, creating a task suspends the goal until it fires, including every later fire of a recurring task: the goal shows as waiting and resumes itself each time. Do not report a time-based wait as blocked when a cron task can carry the goal forward. When the session goal is to wait for a deploy, build, CI job, or other time-based event, schedule that wait immediately. Do not explore the repository, search for a deploy, or poll with bash first. Do not report blocked because no deploy is visible.
- A one-shot \`when\` or \`delay\` wait longer than the 7-day horizon is clamped to it, and the reported next fire time shows the clamped value. A recurring \`cron\` schedule whose next fire falls past the task's 7-day expiry is rejected instead, not clamped.
`
```

Also mirror analogous small doc updates in `src/tool/cron-delete.txt.ts`, `src/tool/cron-list.txt.ts`, and `src/tool/schedule-wakeup.txt.ts` if those exist in Alexi (goal-awareness sentences).

---

### 7. Implement scheduled-status derivation and clamp logic in cron/wakeup runners
**File**: `src/tool/cron.ts`, `src/tool/schedule-wakeup.ts` (if present), `src/core/scheduled.ts` (new)
**Priority**: high
**Type**: feature
**Reason**: Upstream added `packages/opencode/src/kilocode/session/scheduled.ts` (+80) which derives the `scheduled` status from active wakeups and reports the next wake time. Session status endpoint returns `scheduled` when idle-but-with-a-pending-wakeup, plus `wakeAt`.

**New file** `src/core/scheduled.ts`:
```typescript
// kilocode_change: derive `scheduled` status for CLI/board display
import type { SessionStatus } from "../schema/session-status-event"

export interface ScheduledInfo {
  sessionId: string
  wakeAt: number // epoch ms
}

/**
 * If the session is idle but has a pending wakeup, upgrade to `scheduled`
 * with the earliest wake time.
 */
export function deriveScheduledStatus(
  base: SessionStatus,
  pending: ScheduledInfo[],
): SessionStatus {
  if (base.type !== "idle") return base
  if (pending.length === 0) return base
  const wakeAt = Math.min(...pending.map((p) => p.wakeAt))
  return { type: "scheduled", wakeAt }
}
```

Then call it at the session-status HTTP handler and CLI session listing.

**Cron clamp logic** (in `src/tool/cron.ts` or scheduler):
```typescript
const HORIZON_MS = 7 * 24 * 60 * 60 * 1000
const now = Date.now()
const expiresAt = now + HORIZON_MS

if (spec.kind === "when" || spec.kind === "delay") {
  // Clamp one-shots
  if (fireAt > expiresAt) fireAt = expiresAt
} else if (spec.kind === "cron") {
  // Reject if the *next* fire falls past expiry
  const next = computeNextFire(spec.expr, now)
  if (next > expiresAt) {
    return yield* Effect.fail(new CronError({
      reason: "next-fire-past-expiry",
      message: "A recurring cron whose next fire is beyond the 7-day horizon is rejected. Pick a schedule that fires within seven days.",
    }))
  }
}
```

---

### 8. **CRITICAL** — Recover from provider context-limit errors by compacting
**File**: `src/session/llm.ts` (or Alexi's equivalent LLM request loop), `src/providers/error.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Upstream PR #14635 (`packages/opencode/src/session/llm/request.ts` +9, `packages/llm/src/provider-error.ts` +4) — when a provider returns a context-length error, the session must trigger compaction and retry rather than fail the turn. Directly affects SAP AI Core users hitting model context caps.

**Add to** `src/providers/error.ts`:
```typescript
// kilocode_change: classify context-overflow errors so the session can compact &
{"prompt_tokens":15374,"completion_tokens":4096,"total_tokens":19470,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 6bc131ab-d21a-4eba-ac86-2a2a8df18b30]
[Messages: 2, Tokens: 19470]
