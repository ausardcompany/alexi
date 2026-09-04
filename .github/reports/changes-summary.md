# Changes Summary — Upstream Sync (2026-09-04)

Applied 6-change update plan derived from upstream commits:
- kilocode: cf954237c..74b3141bb (86 commits — 3 in scope)
- opencode: f12e14c..3f31139 (14 commits — 3 in scope)

## Files Modified

| File | Type | Change |
| --- | --- | --- |
| `src/agent/index.ts` | modified | Added `native` flag to `AgentSchema`, marked built-in `plan` agent as `native: true`, added `hardenPlan()` helper, refined explore agent description, added `native` to `INTERNAL_OPTION_KEYS` |
| `src/agent/subagent-denial.test.ts` | created | Regression test: subagent permission denial returns `{success:false}` and does NOT throw/tear down the subagent |
| `src/core/orchestration.ts` | created | New `checkPromptBlocker` / `assertPromptDispatchable` gate with `questions: 'dismiss'` semantics (opencode #13774) |
| `src/providers/sessionHeaders.ts` | modified | Added `X-Interaction-Id` correlation header (opencode #47215) |
| `src/providers/__tests__/sessionHeaders.test.ts` | created | Regression tests for SAP-compatibility of provider request headers (mirrors kilocode #13752 intent) + `X-Interaction-Id` |
| `tests/providers/sessionHeaders.test.ts` | modified | Updated existing exact-match tests to include the new `X-Interaction-Id` header |

## Change-by-change Summary

### 1. `hardenPlan` restricted to native plan agent (HIGH, bugfix)

**Upstream**: kilocode #13581, #13590.

**What broke upstream**: The previous logic applied plan-mode edit ceilings to *any* agent whose registry key was `plan` OR `architect`. Because permissions use last-match-wins semantics, this made custom `architect` agents' edit `allow` rules unreachable — the guard always appended a stricter rule after them with no opt-out.

**Alexi adaptation**: Alexi's agent model is `tools` + `disabledTools` (not `Permission.Ruleset`), and it doesn't currently ship a `hardenPlan` call. I added:
- `native?: boolean` field on `AgentSchema` (with JSDoc explaining semantics).
- `native: true` on the built-in `plan` agent registration in `builtInAgents`.
- `native` in `INTERNAL_OPTION_KEYS` so the flag never leaks into `provider.complete()` options.
- `hardenPlan<T extends { native?: boolean }>(key, item, apply)` helper that short-circuits unless `key === 'plan' && item.native === true`, then invokes the caller-supplied `apply(item)` callback to merge plan-mode restrictions.

This gives future integrators (permission-ruleset callers) the correct gate without breaking anything Alexi ships today.

### 2. Explore agent description clarifies bash allowlist (MEDIUM, feature)

**Upstream**: kilocode #13759.

**What changed**: The `explore` built-in agent's `description` now includes the sentence upstream added — spelling out that bash is limited to a read-only allowlist, and that the router/orchestrator should pick a different subagent when required scripts/tests/binary-analysis commands fall outside that allowlist. Pure prompt-engineering change; no code paths altered.

### 3. `questions: 'dismiss'` prompt gate (HIGH, bugfix)

**Upstream**: opencode #13774.

**What broke upstream**: If a user reissued a slash command / new prompt while a prior clarification question was still open, the orchestrator blocked indefinitely on the stale question.

**Alexi adaptation**: Alexi's blocker layer already lives in `src/permission/agent-manager.ts` (opencode `7baefdddf` / `98559c9d6` ports) and distinguishes `permission` vs `question` blockers. I added a new `src/core/orchestration.ts` with:
- `OrchestrationError('unavailable_session' | 'host_error', message)` structured error.
- `checkPromptBlocker({ sessionID, questions? })` — consults `getBlocker`, returns `undefined` when dispatchable, or a reason string otherwise. `questions: 'dismiss'` skips `question` blockers only; `permission` blockers are ALWAYS honoured; unknown-kind blockers fail closed.
- `assertPromptDispatchable(opts)` — convenience wrapper that throws.

No caller is wired to it yet (Alexi's orchestrator does not currently pass through a blocker gate); this establishes the API surface so the migration can happen incrementally without a churn commit.

### 4. Subagent survives permission denial (HIGH, bugfix)

**Upstream**: opencode #13744 (commit `4b85267ae`).

**What broke upstream**: Denying a permission prompt inside a subagent tore down the subagent instead of just failing the one tool call.

**Alexi status**: Already correct. `src/tool/index.ts` (lines 483–491) returns `{ success: false, error: buildUserRejectedToolReason(...) }` on denial — it never throws. The subagent's agent loop can observe the failure in the tool result and continue.

**What I added**: A regression test at `src/agent/subagent-denial.test.ts` that pins this contract with two scenarios:
- A denied `write` returns `success: false` with a descriptive error and does not throw.
- After a denied `write`, a subsequent permitted read-only tool still runs successfully (simulating the subagent agent loop choosing a different action).

The test uses the real `PermissionManager` (via `setPermissionManager(new PermissionManager(denyAllRules))`), not a mock — so a future refactor that accidentally raises a fatal exception from the denial path will fail this test.

### 5. Provider request-header preservation (HIGH, bugfix)

**Upstream**: kilocode #13752.

**Alexi status**: The SAP orchestration provider already threads `options?.headers` through the request adapter correctly (`src/providers/sapOrchestration.ts` lines 1403–1409 and 1497). No regression to fix.

**What I added**: A regression test at `src/providers/__tests__/sessionHeaders.test.ts` that locks the header-forwarding contract at the layer Alexi controls:
- `mergeSessionHeaders` preserves `Authorization` + `X-SAP-Resource-Group` + `X-SAP-Deployment-Id` + `Content-Type` verbatim.
- Session-tracing headers (`x-session-affinity`, `x-parent-session-id`, `x-alexi-agent-id`, `x-alexi-parent-agent-id`) are added alongside without overwriting.
- Pre-existing session headers on the base object survive when no `SessionContext` is supplied.
- `buildSessionHeaders` does not emit `undefined` values for optional fields.

### 6. `X-Interaction-Id` correlation header (LOW, feature)

**Upstream**: opencode #47215 (Copilot-provider addition; useful pattern for any provider).

**What I added**: `src/providers/sessionHeaders.ts` now emits `X-Interaction-Id: <sessionID>` alongside `x-session-affinity` on every call that has a session id. Same value, different semantic:
- `x-session-affinity` — routing hint for load-balanced deployments.
- `X-Interaction-Id` — trace-correlation key for distributed logging.

Purely additive; servers that don't understand the header ignore it. Existing tests at `tests/providers/sessionHeaders.test.ts` used exact-match `toEqual`, so I updated all affected assertions to include the new key.

## Issues Encountered

- **Missing upstream analogues.** The plan referenced `src/core/orchestration.ts` and `src/providers/opencode.ts` — neither exists in Alexi. I created `src/core/orchestration.ts` fresh with the `questions: 'dismiss'` semantics wired to Alexi's existing `permission/agent-manager.ts` blocker store, and I skipped the OpenCode-provider work in favour of a SAP-focused regression test (Alexi does not ship an OpenCode provider).
- **`Permission.Ruleset` model absent.** Alexi represents agent permissions as `tools` + `disabledTools` allowlists, not upstream's ruleset object. `hardenPlan` was therefore implemented as a generic gate (`<T extends { native?: boolean }>`) that invokes a caller-supplied `apply` callback, rather than mutating a specific ruleset field. This keeps the fix's intent (only native plan agents get the ceiling) portable to whichever permission surface a future caller uses.
- **Existing `tests/providers/sessionHeaders.test.ts` used `toEqual`.** Adding `X-Interaction-Id` broke exact-match assertions. Updated all seven affected cases to include the new key with the same session-id value.
- **`ToolContext` shape.** The initial `subagent-denial.test.ts` used `permissions: []` which is not a `ToolContext` field. Corrected to `{ workdir, subagentDepth }`.
- **Change #4 already correct in Alexi.** The tool executor at `src/tool/index.ts` already returns `{ success: false, error }` on denial, so the "denial tears down subagent" upstream bug does not exist in Alexi. Added a regression test to pin the contract rather than change the code path.

## SAP AI Core Compatibility

All changes are non-breaking for SAP AI Core:
- No provider request path was altered (only additive headers).
- No changes to `sapOrchestration.ts` or the auth/deployment resolution.
- `X-Interaction-Id` is ignored by SAP AI Core if not consumed; if consumed (via SAP's own telemetry surface), it improves traceability without side effects.
- Agent-metadata changes (`native` flag) are stripped by `stripInternalOptions` before any provider dispatch.
