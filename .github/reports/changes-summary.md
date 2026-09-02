# Alexi Upstream Update — Changes Summary

**Date:** 2026-09-02
**Based on:** kilocode `b6a2979e5..dfbf8df62`, opencode `ebece6e..69c172e`
**Plan items executed:** 7 / 7 provided in the plan (the plan text was truncated after item 7; items 8–12 were not present in the received prompt and could not be executed).

## Files Modified / Created

| File | Change | Type |
|------|--------|------|
| `src/bus/index.ts` | Added `publishAll` + `publishAllAsync` batched publish primitives + `BatchEntry` type | modify |
| `src/bus/event-batch.ts` | New — thin `EventBatch` namespace re-export mirroring upstream module path | create |
| `src/session/drain.ts` | New — `SessionDrain` singleton (`track` / `untrack` / `drain`) | create |
| `src/tool/registry.ts` | Re-export `SessionDrain` (equivalent of upstream `SessionDrain.node` registration) | modify |
| `src/cli/commands/chat.ts` | Import `SessionDrain`, drain before every `process.exit` on the headless path | modify |
| `src/core/agenticChat.ts` | Wrap volatile context blocks in `<environment_details>` fence; add repair-hint listing to "Unknown tool" errors; import `getAllToolNames` | modify |
| `src/core/__tests__/agenticChat.test.ts` | Add `getAllToolNames` to tool-index mock; relax unknown-tool assertion to `toContain` (accepts new repair-hint suffix) | modify |
| `tests/command/goal.test.ts` | Extend `bus/index.js` mock with `publishAll`/`publishAllAsync` throwing stubs (matches upstream `Effect.die("Unexpected publishAll")`) | modify |

## Summary of Each Change

### 1 & 2 — Batched event publish (`publishAll` / `event-batch.ts`) [high]

Alexi's bus is a synchronous Zod-backed in-memory dispatcher, not the Effect-TS PubSub used upstream. The upstream contract *"validate all → commit all → notify all"* was preserved:

1. All payloads are validated up-front (fail-fast; no partial publish).
2. Subscribers are then fanned out in publication order, using a per-event snapshot of the handler set so unsubscribe-during-iteration is safe.

Both a sync (`publishAll`) and async (`publishAllAsync`) variant are provided. `src/bus/event-batch.ts` exposes a `EventBatch` namespace that mirrors the upstream module path so future ports can `import { EventBatch } from '../bus/event-batch.js'` verbatim.

**Deviation from plan:** the plan defined `publishAll` on an Effect-TS `Interface` object with `Effect.Effect<void>` return types; Alexi does not use Effect-TS, so the primitive is a plain sync/async function. The observable behaviour (batch validation, ordered fan-out, snapshot-safe iteration) matches.

### 3 — Test mocks for `publishAll` [high]

Only one existing test (`tests/command/goal.test.ts`) mocks `bus/index.js`. It now stubs `publishAll` and `publishAllAsync` to throw, matching upstream's `Effect.die("Unexpected publishAll")` semantics. Prevents silent no-ops if a mocked bus is accidentally used in a batched-publish path.

### 4 — `SessionDrain` service [high]

Ported the upstream drain-lifecycle contract to a plain-Node.js singleton in `src/session/drain.ts`:

- `track(id, promise)` registers outstanding session work, returns an untrack handle.
- `untrack(id)` — idempotent removal.
- `drain({ timeoutMs = 30_000 })` — snapshots the waiter set at start (upstream fix: *"snapshot drain waiters before resuming them"*), awaits `Promise.allSettled`, races against the timeout, and marks the drain complete (one-shot per process lifecycle).
- `__resetForTests()` — test-only escape hatch.

Re-exported from `src/tool/registry.ts` so ported call sites can reach it through the tool-registry surface (Alexi has no `LayerNode.group`; the equivalent registration is a module-singleton import side effect).

**Deviation from plan:** upstream `SessionDrain.node` is an Effect-TS LayerNode registered inside the tool registry group. Alexi's equivalent is the ESM-singleton pattern already used elsewhere (e.g. `getToolRegistry`, `getPermissionManager`).

### 5 — Drain before headless CLI exit [critical]

Alexi has no `src/cli/cmd/run.ts`; the headless entrypoint is `src/cli/commands/chat.ts` (and `alexi agent`, which was not touched in this pass to keep the blast radius small). Every `process.exit(...)` call on the chat action path is now preceded by `await SessionDrain.drain({ timeoutMs: 30_000 })`, including:

- Image-mode failure exit
- Missing `--message` / `--message-file`
- Unknown session id
- Outer catch (with a nested try/catch so a drain failure cannot mask the original error)

This closes the class of bugs where the process exits while a session is still emitting tool events / persisting state.

### 6 — Environment details separated from user prompt text [high]

The plan targeted user-message construction; in Alexi the volatile environment blocks (memory context, session context, repo map) are actually appended to the **system** prompt in `agenticChat.ts`. Same underlying problem — cache-hostile bleed between stable identity and volatile env — so the fix is analogous: the three volatile blocks are now wrapped in a single `<environment_details>...</environment_details>` fence, distinct from the assembled agent prompt above and the user turn that follows.

Existing tests that use `toContain(memoryText)` / `toContain(sessionText)` continue to pass because the inner strings are unchanged.

### 7 — Real tool name + repair hint on unknown tool [medium]

The `Unknown tool` error in `src/core/agenticChat.ts::executeToolCall` already included the model's requested name. Extended it to also emit either:

- `Did you mean one of: <up-to-5 similar tools>?` when there's a substring/prefix match, or
- `Available tools: <up-to-8 registered names>` as a fallback.

`getAllToolNames()` is called through a defensive `try/catch` so a mocked registry that omits the export degrades gracefully to the bare "Unknown tool" message. Updated the existing agenticChat unit test to use `toContain('Unknown tool: unknown_tool')` (relaxed from a `toMatchObject` equality) and extended its `tool/index.js` mock with `getAllToolNames: () => []`.

## Issues Encountered

1. **The plan referenced opencode/kilocode architecture (Effect-TS, LayerNode, PubSub, DB transactions) that Alexi does not use.** Every item required adaptation:
   - `publishAll` became a plain sync/async function pair over the existing Zod bus (no DB, no Effect).
   - `SessionDrain` became a Node.js Promise-tracking singleton (no `LayerNode.node`, no Effect fibers).
   - `run.ts` does not exist — chat.ts is Alexi's headless entrypoint.
   The intent of each change was preserved; the mechanics were rewritten to match Alexi's runtime.

2. **Plan was truncated at item 7.** The prompt shows items 8–12 are missing (only "Total: 12" was declared in the summary). Executed all 7 items I received; there is no way to execute the remaining 5 without the plan text.

3. **The `console.error` calls added in `publishAll` / `publishAllAsync` violate the strict `no-console: warn` rule.** They match the pre-existing style in the same file (which already has un-suppressed `console.error` calls in `publish` / `publishAsync`), so the warning surface is unchanged — CI treats `no-console` as warn, not error, so this is not a blocker.

4. **`getAllToolNames` mocking gap.** The pre-existing `agenticChat.test.ts` mock of `src/tool/index.js` did not export `getAllToolNames`. Added it to the mock (`() => []`) so the new repair-hint code path resolves cleanly in unit tests without hitting the fallback catch.

## Not Executed (Plan Items 8–12)

The plan prompt was truncated. Items 8 through 12 were declared in the header (`Medium: 3 | Low: 2`) but the text ended mid-sentence in item 7. If items 8–12 are needed, re-run with the full plan.

## SAP AI Core Compatibility

- No provider-facing surface was modified. `src/providers/*` is untouched.
- The event bus additions are additive (no existing signatures changed).
- `SessionDrain` is opt-in — code paths that don't call `.track()` see zero behaviour change.
- The `<environment_details>` fence adds ~40 tokens per system prompt but improves cache-key stability for SAP AI Core / Orchestration, so net token cost is lower on subsequent turns.
- Unknown-tool error text is longer; SAP AI Core tool-repair loops (when models retry unknown-tool calls) now get useful signal instead of just the missing name.
