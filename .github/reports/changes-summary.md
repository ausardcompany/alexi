# Alexi Update Plan — Execution Report

Generated: 2026-09-11
Source plan: kilocode a7a7690ca..4304a8691 (290 commits) + opencode d6855b6..193de13 (16 commits)

## Files Modified

### Created

- `src/core/database/migrations/20260903104806_kilocode_board_reset.ts`
  New migration adding `cleared_seq INTEGER NOT NULL DEFAULT 0` to `kilo_board`
  (kilocode PR #13782). Exports `BOARD_RESET_SCHEMA_STATEMENTS` so `BoardStore`
  can apply the DDL eagerly.
- `src/kilocode/board/enabled.ts`
  New `isBoardEnabled(experimentalConfigFlag)` predicate that unifies the
  env flag `KILOCODE_EXPERIMENTAL_SWARM_BOARD` with Alexi's persisted
  `experimental.sharedAgentBoard` config (kilocode PR #14013).
- `src/core/kilocode/pty/latch.ts`
  New `createPtyLatch<T>()` utility that buffers `emit`s until a
  listener attaches, then flushes in FIFO order (kilocode `203f19f5d`).
  Dependency-free, safe for reuse in any short-lived event source.
- `src/providers/bedrock-model-id.ts`
  New `resolveBedrockModelID(modelID, region)` helper. Passes `arn:` IDs
  through verbatim and only prefixes `deepseek.r1` / `deepseek-r1`
  (not `deepseek.v3.2+`) in `us-*` regions (opencode `ac1758c`).

### Modified

- `src/core/database/migration.ts`
  Added exported `isBoardMigration(name)` classifier using the wider
  regex `/(?:^|_)kilocode_board(?:_reset)?$/` so the reset migration is
  recognised alongside the parent board migration.
- `src/core/database/migration.gen.ts`
  Registered the new `20260903104806_kilocode_board_reset` migration in
  chronological order (before the 2026-09-07 index migration).
- `src/core/database/boardStore.ts`
  - Import `BOARD_RESET_SCHEMA_STATEMENTS` and apply eagerly on DB open,
    swallowing "duplicate column name" errors from the second open onwards.
  - `read()` now fetches the board's `cleared_seq` watermark and filters
    out messages whose `created_at` predates it.
  - New `reset(boardId)` method sets `cleared_seq = Date.now()` so
    future reads exclude everything currently on the board.
- `src/tool/tools/board.ts`
  `kilo_board_write` gained an optional `recipient` parameter. When set,
  the tool checks whether that recipient session has any recent
  activity on the board; if not, it still writes the message but sets
  `deliveryStatus: 'no-recipient'` and returns a `hint` warning
  (kilocode `7febec58f`).
- `src/flag/flag.ts`
  Registered `KILOCODE_EXPERIMENTAL_SWARM_BOARD` on the shared `Flag`
  namespace using the existing `unstableDefault()` channel resolver so
  dev/beta/local ship with the board on by default.

## Changes Summary (in plan order)

| # | Priority | Title | Status | Notes |
|---|----------|-------|--------|-------|
| 1 | high | Remove Interactive Terminal Tool | N/A | Alexi has never shipped `InteractiveTerminalTool`; nothing to remove. |
| 2 | critical | Board migration regex | ✅ Done | Added `isBoardMigration()` helper (Alexi has no equivalent classifier function to modify, so this ships as a new export). |
| 3 | high | Board `cleared_seq` reset migration | ✅ Done | New migration file + `migration.gen.ts` registration. |
| 4 | high | Board Store reset / cleared_seq filtering | ✅ Done | `read()` filter + new `reset()` method. Alexi uses `created_at` ISO timestamps rather than a numeric `seq`, so `cleared_seq` holds Unix ms and filtering happens via `Date.parse` — semantically equivalent to upstream's `seq > cleared_seq`. |
| 5 | medium | `board_post` stopped-subagent warning | ✅ Done | Added `recipient` param + `deliveryStatus` + `hint`. Alexi has no session-status tracker, so the "stopped" heuristic is "recipient has no recent activity on the board". |
| 6 | medium | Board enabled flag + env gate | ✅ Done | New `isBoardEnabled()` helper + `KILOCODE_EXPERIMENTAL_SWARM_BOARD` on the shared `Flag` namespace. |
| 7 | high | PTY latch | ✅ Done | Standalone `createPtyLatch<T>()` under `src/core/kilocode/pty/latch.ts`. Alexi does not ship a native PTY driver today, so no `pty.bun.ts` was touched; the latch is available for future wiring. |
| 8 | medium | Move-session optimisation | N/A | Alexi has no `control-plane/move-session.ts` command. |
| 9 | high | Bedrock ARN + DeepSeek prefix | ✅ Ported as util | Alexi has no direct Bedrock provider — implemented as `src/providers/bedrock-model-id.ts` for use by any future direct Bedrock integration or SAP AI Core deployment-mapping code. |
| 10-14 | — | (Truncated in the input plan) | Not visible | The plan text passed in was cut off mid-Change 9 (Bedrock, at "`nova-pro`, `") and items 10–14 were not present in the received input. |

## Issues Encountered

1. **Plan truncation.** The task prompt was cut off mid-Change 9 and items
   10–14 (Medium × 3, Low × 2) were not visible. I applied every change
   that was present in the received text; the summary above marks the
   truncated tail so a follow-up run can pick it up.
2. **Missing upstream targets in Alexi.** Several plan items reference
   files that do not exist in this repo (`src/tool/interactive-terminal.ts`,
   `src/core/control-plane/move-session.ts`, `src/providers/amazon-bedrock.ts`,
   `src/core/pty/pty.bun.ts`). For each of those I either:
   - marked the item N/A when there is genuinely nothing to remove /
     optimise (Changes 1, 8), or
   - implemented the fix as a standalone helper that any future direct
     integration can consume (Changes 7, 9). This keeps the codebase
     linear with upstream logic without inventing a fake port target.
3. **Schema shape mismatch (Change 4).** Upstream's board uses a numeric
   `seq` column; Alexi's board is keyed by `created_at` ISO timestamps.
   I preserved the upstream column name (`cleared_seq`) but store Unix
   milliseconds and compare via `Date.parse` at read time. A future
   sync that also adopts the numeric `seq` column can replace the
   comparison without another migration.
4. **No session-status tracker (Change 5).** Alexi's `SessionManager`
   does not currently expose a `status: 'running' | 'stopped'` field
   for subagents. Rather than plumb one through as part of this port,
   the tool falls back to a bounded lookback over recent board
   activity — pessimistic (may warn when the peer is fine but silent),
   never optimistic. Wiring in a real status source can replace
   `recipientLooksStopped()` without touching the tool schema.

## SAP AI Core Compatibility

- No changes to `src/providers/sapOrchestration.ts` or the auth /
  connectivity surface. The new Bedrock model-id helper is not wired
  into any hot path — it is a standalone export.
- Board changes are gated behind `experimental.sharedAgentBoard` (existing)
  and `KILOCODE_EXPERIMENTAL_SWARM_BOARD` (new env flag). Stable channel
  users see no behavioural change unless they opt in.
- The PTY latch is a pure utility; nothing imports it yet.
- The new migration is idempotent on the eager path
  (`BoardStore.ensureSchema`) — duplicate-column errors on second open
  are swallowed, so multiple parallel Alexi processes cannot brick each
  other on schema apply.
