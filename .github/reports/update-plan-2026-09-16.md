```markdown
# Update Plan for Alexi

Generated: 2026-09-16
Based on upstream commits: 9597be3a1..c23548f4f (kilocode, 164 commits)

## Summary
- Total changes planned: 12
- Critical: 1 | High: 4 | Medium: 5 | Low: 2

## Overview of Upstream Changes

The upstream kilocode changes are dominated by VS Code / JetBrains UI work (paste collapse, prompt undo, transcript flicker fixes, animated logo, worktree health, etc.) that are **not applicable** to Alexi's headless CLI/server architecture. The changes relevant to Alexi are:

1. **Codex provider usage adapter** (new) — adds ChatGPT/Codex quota tracking as a new provider usage adapter with retryable-error semantics
2. **Provider usage architecture** — introduces exported `Adapter` / `AdapterContext` interfaces, adds `providers` list to context, adds `valid()` gate for adapters, and adds `retryable=false` handling to stale-cache logic
3. **Wakeup event schema** — adds a new event manifest entry for wakeup lifecycle
4. **Wakeup instance tagging** — cancel-wakeup events tagged with session instance to avoid cross-session cancellation
5. **Malformed tool-call loop bound** — CLI caps repeated malformed tool failures per turn (prevents infinite loops)
6. **Skills leading-slash paths + grouping** — `src/skill/` path resolution accepts leading-`/` paths
7. **Session processor invalid-arguments handling** — new hardening in processor for malformed tool arguments
8. **Marketplace API migration** — kilocode moves marketplace discovery/install into CLI; opencode already had client-side code (Alexi likely lacks this)
9. **Browser tool text tweaks** — "Agent Manager browser" → "Integrated Browser" wording
10. **HTTP API authorization tweak** — small middleware change
11. **Session lifecycle** — wakeup cancel moved into KiloSession.delete

---

## Changes

### 1. Bound malformed tool-call loops per turn
**File**: `src/session/processor.ts` (or wherever Alexi runs the tool-call loop)
**Priority**: critical
**Type**: bugfix (denial-of-service / cost mitigation)
**Reason**: Upstream commit `1df699326` (`fix(cli): stop looping on repeated malformed tool calls`) and `106b1793c` (`bound stuck turns across malformed tool call variants`) and `8426ace5f` (`cap malformed tool failures per turn`) fix a real production issue where a provider that emits invalid tool JSON causes the session to loop indefinitely, burning tokens and blocking the user. This is worth back-porting even without the surrounding kilo-specific changes.

**New code** (add per-turn counter):
```typescript
// src/session/processor.ts
const MAX_MALFORMED_TOOL_CALLS_PER_TURN = 3

interface TurnState {
  malformedToolCallCount: number
  // ... existing state
}

function onMalformedToolCall(state: TurnState, reason: string): "retry" | "abort" {
  state.malformedToolCallCount += 1
  if (state.malformedToolCallCount >= MAX_MALFORMED_TOOL_CALLS_PER_TURN) {
    Log.warn("aborting turn after repeated malformed tool calls", {
      count: state.malformedToolCallCount,
      lastReason: reason,
    })
    return "abort"
  }
  return "retry"
}

// In the tool-call handler:
if (!parseResult.success) {
  const decision = onMalformedToolCall(turnState, parseResult.error)
  if (decision === "abort") {
    yield {
      type: "error",
      error: `Aborted turn: ${MAX_MALFORMED_TOOL_CALLS_PER_TURN} consecutive malformed tool calls`,
    }
    break
  }
  // otherwise fall through to append the tool-error message and retry
}
```

**Test**: port `packages/opencode/test/kilocode/session-processor-invalid-arguments.test.ts` (342 LOC) to `test/session/processor-invalid-arguments.test.ts`, adapting mocks to Alexi's session harness.

---

### 2. Add Codex (ChatGPT) provider usage adapter — *if Alexi surfaces provider usage*
**File**: `src/providers/usage/codex.ts` (new) — **conditional**
**Priority**: medium (skip if Alexi does not expose a provider-usage feature)
**Type**: feature
**Reason**: Upstream commits `9e61d6866`, `832693958`, `51430defa`, `5b604f08e` add ChatGPT Codex quota display. Only relevant if Alexi mirrors kilocode's provider-usage dashboard. **SAP AI Core is the primary provider for Alexi, so this is likely not needed**; document as optional.

**New code** (skeleton only if adopted):
```typescript
// src/providers/usage/codex.ts
import { Effect } from "effect"
import type { Adapter, AdapterContext } from "./index"

const URL = "https://chatgpt.com/backend-api/wham/usage"
const TIMEOUT = 5_000
const MAX_BODY = 64 * 1024

const PLAN_LABELS: Record<string, string> = {
  plus: "ChatGPT Plus",
  pro: "ChatGPT Pro",
  business: "ChatGPT Enterprise",
  // ... (see upstream packages/core/src/kilocode/provider-usage/codex.ts for full list)
}

export const codexAdapter: Adapter = {
  cachePrefixes: ["codex:"],
  valid: () => /* feature-flag or provider-present check */ true,
  run: (ctx: AdapterContext) => Effect.gen(function* () {
    // discover candidate → load → decode → normalize
    // return { items: [snapshot] }
  }),
}
```

**Note**: Alexi's provider layer targets SAP AI Core; unless there is a clear user story for showing Codex quotas, defer this.

---

### 3. Update provider-usage adapter contract (if provider usage exists)
**File**: `src/providers/usage/index.ts`
**Priority**: medium (skip if no provider-usage subsystem)
**Type**: refactor
**Reason**: Upstream exports `Adapter` and `AdapterContext`, adds `providers` list to context, adds `valid()` gate, and adds `retryable=false` short-circuit in `stale()`. If Alexi has this subsystem, mirror these to keep future syncs easy.

**Current code**:
```typescript
interface AdapterContext {
  candidates: readonly Candidate[]
  failedCandidates: readonly Candidate["providerID"][]
  // ...
}

interface Adapter {
  cachePrefixes: readonly string[]
  run(ctx: AdapterContext): Promise<AdapterResult>
}

function stale(next, previous) {
  if (next.fetchState !== "unavailable" && next.fetchState !== "error") return next
  if (!previous || ...) return next
  return { ...previous, fetchState: "stale" }
}
```

**New code**:
```typescript
export interface AdapterContext {
  providers: readonly ProviderV2.Info[]  // NEW
  candidates: readonly Candidate[]
  failedCandidates: readonly Candidate["providerID"][]
  // ...
}

export interface Adapter {
  cachePrefixes: readonly string[]
  cloudScoped?: boolean
  valid?: () => boolean  // NEW: adapter may opt out based on runtime state
  run(ctx: AdapterContext): Promise<AdapterResult>
}

function stale(next, previous) {
  if (next.fetchState !== "unavailable" && next.fetchState !== "error") return next
  if (next.error?.retryable === false) return next  // NEW: don't mask a permanent failure
  if (!previous || ...) return next
  return { ...previous, fetchState: "stale" }
}
```

---

### 4. Tag wakeup-cancel events with session instance
**File**: `src/wakeup/index.ts` (or equivalent), `src/tool/cancel-wakeup.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream `16831a04e` (`fix: tag wakeup cancel events with the session instance`) and `a0bd23321` (`refactor(cli): move session-delete wakeup cancel into KiloSession`) fix a race where deleting one session cancels wakeups belonging to a different session instance sharing the same session ID (e.g., after a restart).

**Current code** (assumed):
```typescript
// src/tool/cancel-wakeup.ts
Bus.publish("wakeup.cancel", { sessionID })
```

**New code**:
```typescript
// src/wakeup/index.ts — extend event payload
export const WakeupCancelEvent = z.object({
  sessionID: z.string(),
  instanceID: z.string().optional(),  // NEW
  reason: z.enum(["manual", "session-delete", "tool"]).optional(),
})

// src/tool/cancel-wakeup.ts
const instanceID = Session.current()?.instanceID
Bus.publish("wakeup.cancel", { sessionID, instanceID, reason: "tool" })

// wakeup handler
Bus.subscribe("wakeup.cancel", (evt) => {
  const pending = getScheduledWakeup(evt.sessionID)
  if (!pending) return
  // NEW: if instance IDs disagree, ignore — the wakeup belongs to a different session instance
  if (evt.instanceID && pending.instanceID && evt.instanceID !== pending.instanceID) {
    Log.debug("ignoring wakeup cancel for stale instance", { evt, pending })
    return
  }
  cancel(pending)
})
```

**Test update**: extend `test/tool/cancel-wakeup.test.ts` (+6/-1 upstream) with instance mismatch case.

---

### 5. Move session-delete wakeup cancellation into session lifecycle
**File**: `src/session/session.ts`
**Priority**: high
**Type**: refactor / bugfix
**Reason**: Upstream `a0bd23321` moves wakeup cancellation from the CLI cmd layer into `KiloSession` so any deletion path (CLI, HTTP API, etc.) cleans up wakeups. Prevents orphaned scheduled wakeups after session deletion via HTTP.

**New code**:
```typescript
// src/session/session.ts
export async function deleteSession(sessionID: string, opts?: { instanceID?: string }) {
  // NEW: cancel any pending wakeup before tearing down state
  try {
    await Wakeup.cancel({ sessionID, instanceID: opts?.instanceID, reason: "session-delete" })
  } catch (err) {
    Log.warn("wakeup cancel during session delete failed", { sessionID, err })
    // continue: deletion must not be blocked by wakeup cleanup
  }

  await existingSessionDeleteLogic(sessionID)
}
```

Remove any duplicate `Wakeup.cancel` call from CLI/HTTP delete endpoints.

---

### 6. Add wakeup event to event manifest schema
**File**: `src/schema/event-manifest.ts`, `src/schema/wakeup-event.ts` (new)
**Priority**: medium
**Type**: feature
**Reason**: Upstream `packages/schema/src/kilocode/wakeup-event.ts` (+20) and `event-manifest.ts` (+2) register wakeup lifecycle events for downstream consumers (webview, telemetry). If Alexi emits events over its bus/HTTP API, register these for parity.

**New
{"prompt_tokens":30510,"completion_tokens":4096,"total_tokens":34606,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: f6000b84-1a69-445a-ac84-fe2c149fa400]
[Messages: 2, Tokens: 34606]
