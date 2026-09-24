# Changes Summary — 2026-09-24 Upstream Sync

Applied the update plan derived from upstream commits:
- kilocode: `95b45e54e..50e520adf` (92 commits)
- opencode: `18ef3cc..0f54984` (9 commits)

## Files modified

| File | Change type | Priority |
| --- | --- | --- |
| `src/cli/commands/debug/redact.ts` | **NEW** | critical (security) |
| `src/cli/commands/debug/config.ts` | **NEW** | critical (security) |
| `src/config/userConfig.ts` | refactor (flag removal) | high |
| `src/tool/tools/agent-manager-models.ts` | refactor (drop gating) | high |
| `src/tool/tools/task.ts` | refactor (drop gating) | high |
| `src/cli/session/prompt.tsx` | doc-comment cleanup | high (follow-on) |
| `src/mcp/client-metadata.ts` | **NEW** | medium |
| `src/mcp/index.ts` | export new CIMD module | medium |
| `src/bus/plan-followup.ts` | **NEW** | medium |

## Changes made

### 1. Critical / Security — Credential redaction in `alexi debug config`

Ports opencode PR #50956 (`82d4c89 fix(opencode): redact credentials in debug config`).

- Added `src/cli/commands/debug/redact.ts` — exports `redact(value)` and
  `isSecretKey(key)`. Walks arbitrary values and replaces any property
  whose KEY matches one of the secret patterns (`api_key`, `secret`,
  `token`, `password`, `credential`, `authorization`, `client_secret`,
  `clientsecret`, `serviceurl`) with `'[REDACTED]'`. SAP AI Core
  `AICORE_SERVICE_KEY` nested fields (`clientsecret`, `url`, etc.) are
  masked so the entire service key never leaks.
- Added `src/cli/commands/debug/config.ts` — new `alexi debug config`
  subcommand. Emits a JSON snapshot of `loadFullConfig()` plus a
  filtered `process.env` slice (only `AICORE_*`, `SAP_PROXY_*`,
  `ALEXI_*` keys) with `redact()` applied.
- Command is registered via `registerDebugConfigCommand(program)`. It
  attaches to an existing `debug` group if one is present, otherwise
  creates it. **Not wired into `src/cli/program.ts` yet** — the plan
  did not include that step, and adding it now would silently add a
  new CLI surface without tests. Left as a follow-up.

### 2. High — Remove `task_model_selection` experimental flag

Upstream removed the flag and made per-task model selection the default.

- `src/config/userConfig.ts`:
  - `getConfigTaskModelSelection()` now unconditionally returns `true`.
  - `setConfigTaskModelSelection()` is a documented no-op (kept as a
    shim so downstream code that still imports it keeps compiling).
- `src/tool/tools/agent-manager-models.ts`: rewritten to drop the
  `getConfigTaskModelSelection()` gate; always returns the model
  catalog. Description text updated to remove the flag reference and
  include the "use this tool before choosing model/provider/variant"
  guidance from upstream.
- `src/tool/tools/task.ts`:
  - Dropped `getConfigTaskModelSelection` import (kept `isBoardEnabled`).
  - `TaskParamsSchema` field docs no longer mention the flag.
  - Execute path no longer branches on the flag. `provider requires
    model` guard is retained (matches agent-manager semantics).
  - `model` return-field JSDoc updated.
- `src/cli/session/prompt.tsx`: doc comment on `model` option no
  longer references the removed flag.

### 3. Medium — MCP Client ID Metadata Documents (CIMD)

Ports the new `client-metadata.ts` module + OAuth-provider wiring from
opencode's 2026-09 sync.

- `src/mcp/client-metadata.ts` (new):
  - `ClientMetadataDocumentSchema` — Zod schema (Alexi uses zod, not
    `effect/Schema`).
  - `fetchClientMetadata(url, signal?)` — fetches and validates a CIMD
    document. Throws on non-2xx, malformed JSON, or schema mismatch.
  - `isClientMetadataUrl(clientId)` — helper for the OAuth flow to
    decide whether to resolve the client_id as a URL.
- `src/mcp/index.ts`: re-exports the new symbols.

**No `oauth-provider.ts` in Alexi's `src/mcp/`** — Alexi's MCP layer
does not currently implement OAuth (SAP AI Core uses service-key auth).
The module is exported so it can be wired in when/if third-party MCP
OAuth support lands. This matches the "SAP note" in the plan.

### 4. Medium — Directory-scoped plan follow-up events

Ports opencode `5e05988b1 fix(cli): route plan follow-up events by directory`.

- `src/bus/plan-followup.ts` (new):
  - `PlanFollowupSchema` — zod schema including the required
    `directory` field.
  - `PlanFollowupEvent` — typed bus event registered via
    `defineEvent('plan.followup', ...)`.
  - `matchesDirectory(event, currentDirectory)` — subscriber-side
    filter helper. Absence of `directory` on the event is treated as a
    wildcard for forward-compat.

There is no existing publisher of `plan.followup` in Alexi's tree
(plan-mode subagents in Alexi do not yet emit follow-up events to a
bus). This module documents the shape so future publisher + subscriber
code cannot regress the directory-scoping contract.

## Changes NOT applied (with rationale)

- **Wiring `debug config` into `program.ts`**: the plan created the
  command files but did not include the registration step. Wiring it
  now would add a public CLI surface without tests. Left for a
  follow-up commit that also adds a test.
- **`oauth-provider.ts` edits**: no such file exists in `src/mcp/`;
  Alexi does not implement MCP OAuth. Only the CIMD helper module was
  added, as the SAP note in the plan explicitly says.
- **`session/processor.ts` edits**: no such file exists — Alexi's
  equivalent is spread across `src/session/*` and does not yet publish
  a `plan.followup` event. The new `src/bus/plan-followup.ts` module
  captures the directory-routing contract so the future publisher can
  adopt it.
- **Plan item #7 (LOW)**: the plan text was truncated after the
  credentials-redaction section and item #7 was not fully specified in
  the visible text. Nothing was assumed for it.

## Issues encountered

- Documentation still references the removed
  `experimental.task_model_selection` flag in `docs/ARCHITECTURE.md`,
  `docs/CONFIGURATION.md`, `docs/API.md`, `docs/CONTRIBUTING.md`,
  `docs/TESTING.md`, and `CHANGELOG.md`. Runtime code is now
  consistent, but a documentation pass should follow to reflect the
  new "always on" behaviour.
- No existing tests exercised the removed flag paths, so no test files
  needed to change. New code paths (`redact.ts`, `client-metadata.ts`,
  `plan-followup.ts`, the shim in `userConfig.ts`) currently have no
  unit tests — CI's 40% line-coverage gate may need additional tests
  in a follow-up commit if the new lines depress the total below 40%.

## SAP AI Core compatibility

- Credential redaction is strictly additive and defaults to safe —
  every SAP AI Core credential field name matches at least one pattern
  (`clientsecret`, `token`, `authorization`, `credential`).
- The `task_model_selection` change is a relaxation only: callers who
  previously omitted `model` / `provider` / `reasoning_effort` see
  identical behaviour (subagent inherits parent's SAP AI Core routing).
  Callers who set these fields no longer need to flip a config flag.
- CIMD is opt-in — SAP AI Core auth is unaffected (service-key based).
- The plan-followup event module is inert until a publisher exists;
  no runtime behaviour changed.
