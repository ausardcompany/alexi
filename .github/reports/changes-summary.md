# Alexi — Upstream Sync Changes Summary

Generated: 2026-09-25
Plan basis: `50e520adf..6c9ac9542` (kilocode v7.8.0, 159 commits) + `0f54984..34aa427` (opencode, 3 commits)

## Files modified

- `src/core/database/migration.ts` — added legacy Drizzle import guard helpers
- `src/providers/transform.ts` — hardened Bedrock reasoning replay filter + added Anthropic thinking-block re-bind helpers
- `src/tool/tools/apply-patch.ts` — added `normalizeMovePath` helper + optional `movePath` result field
- `src/session/network.ts` — new file: network disconnect classifier + `network.disconnected` bus event
- `src/session/__tests__/network.test.ts` — new file: coverage for the classifier + bus publish
- `src/tool/tools/__tests__/apply-patch.move-path.test.ts` — new file: empty-string guard test

## Summary of each change

### 1. Legacy Drizzle migration import (critical) — `src/core/database/migration.ts`

Ported upstream opencode `b72b50006` intent. Alexi's `migration.ts` is
adapter-agnostic and does NOT itself query `__drizzle_migrations`, but
downstream adapters that need to import a legacy Drizzle journal now
have shared helpers so they don't have to re-invent the guard:

- `legacyDrizzleHasNameColumn(columns)` — probe result of
  `pragma_table_info('__drizzle_migrations')` for the `name` column.
- `legacyMigrationIdPrefix(createdAtMs)` — compute the
  `YYYYMMDDhhmmss` prefix Alexi migrations use, so a legacy
  `created_at`-only row can be reconciled against the current
  migration list. Mirrors upstream `strftime('%Y%m%d%H%M%S',
  created_at / 1000, 'unixepoch')`.

The exported helpers are documented so future adapters branch on
column presence exactly like upstream does, avoiding the
`no such column: name` crash on old DBs.

### 2. Workspace-name migration guard (critical) — SKIPPED

Alexi has no equivalent `20260410174513_workspace-name` migration in
its migration set (`src/core/database/migrations/*` contains only the
kilocode board + model-usage index migrations). No file exists to
guard. If we ever add a workspace-name migration we should follow the
same `PRAGMA table_info` probe pattern as upstream.

### 3. `apply_patch`: omit empty move-path (high) — `src/tool/tools/apply-patch.ts`

Alexi's apply-patch tool doesn't currently emit a `move_path` at all,
but the upstream kilocode fix (`f7da00f35` / PR #45329) is a
defensive normalization at the type/serialization boundary. Added:

- `ApplyPatchResult.movePath?: string` (optional, only present when
  the patch renames the file to a non-empty destination).
- `normalizeMovePath(value)` — treats `undefined` and `''`
  identically, returns `undefined` in both cases. Any non-empty string
  passes through verbatim.

Added `apply-patch.move-path.test.ts` with the four regression cases
(undefined, empty-string, non-empty path, whitespace-only pass-through).

### 4. Filter unreplayable Bedrock reasoning (high) — `src/providers/transform.ts`

Extended the existing `hasBedrockReasoningSignature` predicate used by
`filterUnreplayableBedrockReasoning` to match opencode `517ee736b`:

- Parts flagged `metadata.redacted === true` are unreplayable (Bedrock
  returns opaque signatures for redacted thinking; those cannot be
  replayed even when a signature string IS present).
- Parts that carry a signature but an empty `text` payload are also
  unreplayable — the replay body is empty and Bedrock rejects it.

Behaviour unchanged for non-Bedrock providers (still gated on
`providerID.includes('bedrock' | 'aicore')`).

### 5. Anthropic thinking-block binding tolerance (high) — `src/providers/transform.ts`

New exports:

- `bindThinkingToToolCall(msg)` — when an assistant message has a
  `thinking`/`reasoning` part AND a `tool-call`/`tool_use` part, and
  the tool call is missing `metadata.thinkingSignature`, copy the
  thinking part's `signature` onto the tool-call metadata.
  Non-mutating; returns the input by reference when no rebind is
  needed.
- `bindThinkingToToolCallsAll(messages)` — batch application across a
  message list; returns the input reference unchanged when no message
  required a rebind, so downstream cache invalidation short-circuits.

Ports upstream kilocode `3f39a329c`. Note: Alexi does NOT depend on
`@ai-sdk/anthropic` (it talks to SAP AI Core deployments directly),
so the upstream `@ai-sdk/anthropic@3.0.111` bump + patch is a no-op
for us. The transform-level tolerance covers the same failure mode.

### 6. Surface network disconnects (high) — `src/session/network.ts` (new)

Ported upstream opencode/kilocode `d6bb0ef05` (PR #13523). New module
containing:

- `NetworkDisconnectPayload` (Zod schema) with `reason`, `provider?`,
  `retriable`, and optional raw message.
- `NetworkDisconnectEvent` — the `network.disconnected` bus event
  (uses Alexi's existing `defineEvent` from `src/bus/index.ts`; the
  plan wrote `Bus.event(...)` which is the opencode Effect-TS API,
  translated to Alexi's synchronous bus).
- `classifyNetworkError(err)` — maps unknown → `{ reason, retriable }`
  or `null`. AbortError → non-retriable abort; ETIMEDOUT/timeout →
  timeout; ECONNRESET/socket hang up/ECONNREFUSED/EPIPE → socket;
  ENOTFOUND/EAI_AGAIN → dns; `fetch failed` → unknown, retriable.
- `reportNetworkDisconnect(err, provider?)` — pure sink that publishes
  the bus event when the error is classified as a network disconnect;
  returns the classification (or `null`) so callers can drive their
  own retry decision.

Test coverage in `src/session/__tests__/network.test.ts` exercises
every classifier branch plus the publish/no-publish behaviour of
`reportNetworkDisconnect`.

## Items 7–12 (medium / low)

The update plan document was truncated after item 6 mid-sentence
(`if (!classified)`) with no bodies for items 7 through 12. The plan
summary described the intended scope as:

  - Session retention / cleanup
  - Config v2 compatibility
  - Azure plugin hardening
  - Two additional low-priority items (undisclosed)

Because item bodies were not provided, these were NOT executed —
implementing them without the concrete file / code specification would
risk drifting from upstream intent. Recommend re-running the planning
step to regenerate the plan with complete bodies for items 7–12
before another execution pass.

## Issues encountered

1. **Plan/codebase shape mismatch (item 1).** The plan's code fragment
   assumed an Effect-TS + effect-sql database layer (`Effect.gen`,
   `db.get`, `sql\`...\``). Alexi's `migration.ts` is intentionally
   adapter-agnostic and does not import Effect. Adapted the plan's
   *intent* (guard legacy Drizzle imports against a missing `name`
   column) into shared helper functions rather than rewriting the
   runner against an API that doesn't exist in Alexi.

2. **Migration doesn't exist (item 2).** No
   `20260410174513_workspace-name.ts` in Alexi. Documented as skipped;
   no synthetic migration was created (that would be a schema change,
   not a fix port).

3. **`move_path` isn't emitted by Alexi's apply-patch (item 3).**
   Alexi's tool renders a plain unified diff; there is no rename path
   through the result. Added `normalizeMovePath` + optional `movePath`
   result field so a future rename feature inherits the guard for
   free, and added the regression test the plan required.

4. **Bus API translation (item 6).** The plan used `Bus.event(...)`
   (opencode Effect-TS namespace). Translated to Alexi's synchronous
   `defineEvent(name, schema)` from `src/bus/index.ts`. Event name
   preserved (`network.disconnected`).

5. **Plan truncation (items 7–12).** See "Items 7–12" section above.

## SAP AI Core compatibility

- All provider transforms remain gated on providerID / model detection
  (Bedrock filter still requires `providerID.includes('bedrock' |
  'aicore')`; Anthropic rebind is a no-op unless both a reasoning part
  and a tool-call part are present).
- No changes to SAP-specific auth flows, service-key handling, or
  deployment routing.
- No new runtime dependencies added; `network.ts` uses `zod` (already
  in dependencies) and the existing `defineEvent` bus.
- No breaking changes to any exported API — every change is additive
  (new helpers, new optional result field, extended filter predicate).
