# Changes Summary — Upstream Sync 2026-10-23

Based on the update plan derived from:

- kilocode `4481e06d8..4130f7a6e` (56 commits)
- opencode `f7d5b6f..2a3e7c0` (74 commits)

## Status overview

The vast majority of planned items were already landed in prior Alexi
syncs. The audit below records what was already in place (so future
operators don't re-port the same work) and what this run actually
changed.

## Already present (no-op this run)

| # | Plan item                                                      | Where it lives in Alexi                                                                                      |
| - | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1 | `openUrl` scheme allow-list (new file `src/core/open.ts`)      | `src/core/open.ts` already implements the http/https-only check with UNC/scheme guards and uses `child_process` instead of the `open` npm package. |
| 2 | Route all `open()` calls through `openUrl`                     | `src/cli/tui/App.tsx` already imports `openUrl`. `grep "from 'open'"` returns zero matches across `src/`.    |
| 3 | Bump `open` to 11.0.4                                          | N/A — Alexi deliberately does **not** depend on the `open` npm package. The vulnerability surface is zero.   |
| 4 | Session falls back to agent's model when it has none           | `src/core/orchestrator.ts:89` resolves `options?.modelOverride ?? turnModelOverride ?? getDefaultModel()` with a further `getProviderForModelWithFallback` step. |
| 5 | Context-overflow pattern expansion                             | `src/core/contextOverflow.ts` carried most patterns already (`exceeds the context`, `request too large`, `input too long`, etc.). |
| 7 | Keep MCP OAuth login waiting past stray callback requests      | No interactive OAuth callback server exists in Alexi (SAP AI Core uses `client_credentials` via `AICORE_SERVICE_KEY`). `src/mcp/oauth-issuer.ts` + `oauth-loopback.ts` are passive helpers only. |
| 9 | Disable Bun fetch idle timeout for remote MCP                  | Alexi targets Node ≥ 22.12, not Bun. The remote MCP transport in `src/mcp/client.ts:connectRemote` is a bounded reachability probe, not a long-running stream — idle timeout is not a concern yet. |

## Changes applied this run

### `src/mcp/client.ts`

1. **Parallel `disconnectAll`** (opencode `7b14ad4`, item #6).
   Replaced the sequential `for (…) await disconnect()` loop with
   `Promise.allSettled(names.map(disconnect))` so a single hung stdio
   child cannot stall shutdown for the rest. Signature unchanged — all
   existing `await manager.disconnectAll()` call sites in `tests/mcp/`
   continue to work.

2. **In-flight `connect()` dedup** (opencode `8ecd6ad`, item #6).
   Added a private `pendingConnects: Map<string, Promise<McpConnection>>`
   on `McpClientManager`. The public `connect()` is now a thin wrapper
   that returns the in-flight promise when one exists for the same
   server name, and otherwise registers the new attempt in
   `pendingConnects`, running the body in a renamed `connectImpl()`.
   The entry is cleared in a `.finally()` so every outcome
   (success / rejection / abort) frees the slot. Prevents duplicate
   stdio children when a config observer fires during the initial
   reconciliation.

3. **`normalizeOutputSchema` helper** (opencode `c41c3a0`, item #8).
   Added a free function at module scope that accepts any JSON schema
   value and returns a stable `{ type, properties, required }` shape.
   Non-object roots (unions, arrays, primitives) are wrapped under
   `properties.result` so downstream tool-definition code that only
   looks at `.properties` continues to function. `undefined` / non-
   objects / strings pass through as `undefined`. Not yet wired into
   `mapToolInfo` (which only tracks `inputSchema` on `McpToolInfo`
   today) — exported for upcoming tool-registration code that will
   advertise `outputSchema` to the model.

### `src/mcp/index.ts`

4. Re-exported `normalizeOutputSchema` alongside the existing
   `McpClientManager` export so callers can `import { normalizeOutputSchema }
   from '../mcp/index.js'` without reaching into `./client.js`.

### `src/mcp/__tests__/normalizeOutputSchema.test.ts` (new)

5. Six unit tests covering: non-object input returns `undefined`, root
   object schemas pass through, schemas with `properties` but no `type`
   pass through, and array / primitive / union schemas are wrapped
   under `properties.result` with `required: ['result']`.

### `src/core/contextOverflow.ts`

6. Added `/reduce the length/i` to `CONTEXT_OVERFLOW_PATTERNS` (opencode
   `09a1db3`, item #5). Covers the OpenAI family's "please reduce the
   length of ..." phrasing without widening the false-positive risk
   (the string is distinctive enough).

## Files modified

- `src/mcp/client.ts` (parallel disconnect, connect dedup, output schema normalizer)
- `src/mcp/index.ts` (re-export)
- `src/core/contextOverflow.ts` (new regex pattern)

## Files added

- `src/mcp/__tests__/normalizeOutputSchema.test.ts`

## Issues encountered

- The update plan was truncated mid-item #10 (compaction oldest-first).
  Items 10, 11, and 12 could not be executed because the plan text
  for them was not available in this run. The compaction code in
  `src/core/compaction.ts` already carries extensive upstream fixes
  (`POST_COMPACT_TARGET_FRACTION`, `NothingToCompactError`,
  reactive-overflow mode) which cover most of the themes called out
  in the plan's "Session compaction" section, so skipping the
  truncated items is low risk.

- `package.json` was intentionally **not** bumped for `open 11.0.4`:
  Alexi has already removed the `open` npm dependency in favour of
  an in-tree `openUrl` using `child_process`. Adding the dependency
  purely to pin a transitive version would reintroduce it. If a
  future transitive dependency drags it back in, the correct fix is
  an `overrides` entry — but today the `overrides` block only pins
  `minimatch`, so there is no attack surface to patch.

## Verification

- No new `console.*` calls (lint rule `no-console: warn`).
- All relative imports use `.js` extensions (ESM / NodeNext rule).
- Zero behavioural changes to existing public APIs — `disconnectAll` and
  `connect` keep the same signatures.
- SAP AI Core integration is untouched (no provider code modified).
