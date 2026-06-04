# Architecture Review -- 2026-06-04 12:00 UTC (follow-up, scheduled, master)

## Summary

This is the second architecture run on 2026-06-04. The earlier run
(`docs/adr/REVIEW-2026-06-04.md`, commit `2baf6c6`) introduced ADR 001 and
documented eight findings (F1..F8). Between that run and this one, no
`src/` files and no architecture docs were touched -- the only commits
have been four CI/workflow fixes for the agent factory itself
(`b37ec9a`, `4227a79`, `cd17a14`, `b74b1a8`). All structural findings
from the earlier run are still open. This run re-verifies them, expands
**F3** with one previously-missed instance in
`src/core/streamingOrchestrator.ts`, and adds one new low-severity
finding **F9** about a test-only layering ping. **No new ADR is created**
because no new structural change has happened since ADR 001 landed --
adding ADR-noise without a decision would dilute the audit trail.

## Findings

### F1..F8 -- still open, unchanged

The previous review's findings remain accurate as of `HEAD`:

- F1 `block`: 17 backfill ADRs (002..) still missing. ADR 001's
  follow-up list is the tracking ledger.
- F2 `block`: `src/cli/commands/models.ts:6` still imports
  `@sap-ai-sdk/ai-api` directly and calls `DeploymentApi.deploymentQuery`
  at line 87.
- F3 `warn`: `src/core/agenticChat.ts:19` still imports
  `CompletionResult, TokenUsage` from `../providers/sapOrchestration.js`
  rather than from `../providers/index.js`. (Expanded below -- F3b.)
- F4 `warn`: `src/tool/tools/{read,write,edit,multiedit,grep}.ts` still
  import `attachAgentsMdReminders[ForPaths]` from
  `../../agent/agentsMdReminders.js`. `src/tool/tools/task.ts:7` still
  imports `getAgentRegistry, type Agent` from `../../agent/index.js`.
  Reverse type-only edge `src/agent/agentsMdReminders.ts:11` -> `src/tool/`
  is also unchanged.
- F5 `warn`: `src/permission/PermissionView.kt` and
  `PermissionViewTest.kt` still present.
- F6 `info`: `src/core/migration/20260511173437_session-metadata.sql`
  still orphaned (no `better-sqlite3` / `sqlite3` dependency in
  `package.json`).
- F7 `info`: `.github/prompts/role-architecture.md` module map still
  lists ~10 modules vs. 32 actual top-level dirs. `docs/ARCHITECTURE.md`
  is now the canonical view (updated in `2baf6c6`).
- F8 `info`: ESM `.js` import discipline confirmed clean. Re-running
  the audit `grep -rEn "from ['\"]\.\.?/[^'\"]+['\"]" src/ --include="*.ts"
  --include="*.tsx" | grep -vE "\.js['\"]|\.json['\"]|\.css['\"]"` returns
  18 hits, all of them inside JS template literals in
  `src/context/__tests__/ranking.test.ts` (test fixtures simulating
  source files), not real imports.

### F3b -- `warn` -- Second concrete-provider import in core (NEW; expands F3)

`src/core/streamingOrchestrator.ts:16`:

```ts
import { buildSessionHeaders } from '../providers/sessionHeaders.js';
```

`buildSessionHeaders` is **not** re-exported from
`src/providers/index.ts`, so callers in `src/core/` cannot reach it
through the provider interface today. The earlier review only flagged
the `agenticChat.ts` import. The fix is symmetric: re-export
`buildSessionHeaders` (and any related session-header helpers) from
`providers/index.ts`, then update `streamingOrchestrator.ts:16` and
`agenticChat.ts:19` together.

This finding does not require a new ADR -- it is covered by ADR 001
follow-up #5 ("Either move `src/cli/commands/models.ts`'s direct
`@sap-ai-sdk/ai-api` call into `src/providers/`, or formally carve out a
'diagnostics' exception for the `models` command") and the same
provider-surface principle applies. Combine the F2 and F3/F3b fixes into
a single small PR scoped `refactor(providers)` or `refactor(core)`.

### F9 -- `info` -- Test-only layering ping: `src/plugin/__tests__/` -> `src/agent/`

`src/plugin/__tests__/ruleCommand.test.ts:47`:

```ts
import { buildAssembledSystemPrompt } from '../../agent/system.js';
```

Per ADR 001 layering rules, `src/plugin/` may not import from
`src/agent/`. This is a test file integrating across both surfaces, so
a strict reading would flag it, but tests get more slack throughout the
repo (e.g. F3 also has test-file violations). Two acceptable resolutions:

1. Treat colocated `__tests__/` directories as out-of-band for layering
   purposes -- and add that exception to ADR 001 (one-line note).
2. Or move this test to `tests/integration/` since it spans two modules.

Either is fine; the `info` severity reflects that no production code is
affected.

## Recommendations (delta vs. previous run)

1. **Combine F2 + F3 + F3b into one provider-surface PR.** All three are
   variations of "import the provider interface, not concrete files."
   Suggested shape:

   - In `src/providers/index.ts`, re-export
     `type CompletionResult, type TokenUsage` from `./sapOrchestration.js`
     (type-only, zero runtime cost) and the `buildSessionHeaders`
     function from `./sessionHeaders.js`.
   - Add a `listDeployments()` helper to `src/providers/index.ts` that
     wraps `DeploymentApi.deploymentQuery(...)`.
   - Update three callers: `src/cli/commands/models.ts:6+87`,
     `src/core/agenticChat.ts:19`, `src/core/streamingOrchestrator.ts:16`.
   - Commit scope: `refactor(providers)`. No public API change.

2. **F9 -- codify test-file slack in ADR 001.** Add one bullet under the
   Decision section: "Tests under `__tests__/` and `tests/` may import
   across layers for integration coverage; production code may not."
   This avoids future churn from re-flagging the same kind of import.

3. **Defer the bulk backfill (F1) until at least one of F2/F3 is fixed.**
   Resolving the provider leaks first means ADR 002 (the backfill ADR)
   can document the cleaned-up state instead of the leaks.

## ADR needed?

**No.** This run records no new structural decision. The previous run's
ADR 001 already covers the rules these findings violate, and ADR 001's
own follow-up list (002..005) already enumerates the future ADRs needed.
Creating ADRs without a decision attached would dilute the audit trail.

The next ADR worth filing is the backfill (ADR 002), but it should land
together with -- or after -- the F2/F3/F3b refactor described in
Recommendation 1, so that the backfill describes the post-refactor
layout rather than memorialising provider leaks as "accepted baseline".
