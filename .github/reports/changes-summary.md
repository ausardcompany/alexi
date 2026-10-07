# Changes Summary — Upstream Sync Execution

**Date**: 2026-10-07
**Plan source**: Upstream analysis of kilocode `4433f275f..5e9f816fc` (v7.8.3 → v7.8.8) and opencode `3f393d7..ecc4916` (v1.18.34 → v1.18.35).

## Files Modified / Created

### New files

| Path                                                   | Purpose                                                                            |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `src/core/message-diagnostics.ts`                      | Prompt-safe schema-failure summary helpers (ports kilocode `a8fbcc356` et al.).    |
| `src/core/__tests__/message-diagnostics.test.ts`       | Covers no-content-leak contract + defensive parsing of malformed zod issue shapes. |
| `src/mcp/oauth-issuer.ts`                              | Pure helpers detecting MCP OAuth issuer rotation (ports kilocode `84b26c697`).     |
| `src/mcp/__tests__/oauth-issuer.test.ts`               | Coverage for `hasIssuerChanged` / `requireReregistration`.                         |
| `src/config/overlay.ts`                                | Shadowed-write detection across layered config overlays (ports kilocode `b9e4b1e98` et al.). |
| `src/config/__tests__/overlay.test.ts`                 | Coverage for shadowing precedence + warning formatting.                            |

### Modified files

| Path                                                   | Change                                                                             |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `src/tool/tools/board.ts`                              | Adds `roster[]` with `self: true` on `kilo_board_read`; refuses `kilo_board_write` to self (ports kilocode `759a6ef99`). |
| `src/git/commitMessage.ts`                             | Preserves provider errors via `consumeLastCommitMessageError()` (ports kilocode `f54e713dd`). |
| `src/git/commitMessage.test.ts`                        | Three new tests covering the error-preservation contract.                          |
| `src/mcp/index.ts`                                     | Re-exports the new `oauth-issuer` surface.                                         |
| `tests/tool/tools/board-write-recipient.test.ts`       | Adds a self-post refusal regression test.                                          |

## Per-Change Summary

### 1. [critical] Harden message diagnostics against malformed envelopes
Created `src/core/message-diagnostics.ts` with three pure helpers (`summarizeSchemaFailure`, `summarizeMessageEnvelope`, `summarizeMessageArrayFailure`). They produce structural summaries of validation failures without ever including prompt text, tool arguments, part contents, or embedded strings from `issue.message`. Tests lock in the no-leak contract explicitly (`expect(JSON.stringify(summary)).not.toContain('SECRET')`), guard against pathological inputs (non-array `path`, non-string `code`, 500-char codes), and verify truncation at 50 issues / 20 messages.

### 2. [high] Board tool — forbid self-post, surface self identity
- `kilo_board_read` result now carries a `roster: BoardParticipant[]`. Each participant row has `self: boolean`; the caller's own session id is always present even if they haven't posted. The tool description was updated accordingly.
- `kilo_board_write` now refuses `recipient === context.sessionId` with a structured error that references `kilo_board_read` so the model has an actionable next step. The write and recipient probe are both skipped on self-post refusal.
- Description text was tightened to remove the "not yourself" clause since the rule is now enforced at runtime.
- Added a regression test in `tests/tool/tools/board-write-recipient.test.ts`.

Alexi_change vs. plan: Alexi's board tool uses a `recipient` field (session id) rather than upstream's `to` (participant id). The semantics are identical, so the fix was adapted to Alexi's field name without introducing a schema break.

### 3. [high] Preserve commit-message provider errors
`src/git/commitMessage.ts` already captured provider failures as a `CommitMessageError` with `cause`, but it only logged a warning and returned `null`. The caller (and therefore the operator) could not distinguish "SAP AI Core 503" from "empty response, heuristic fallback". Added:
- Module-local `lastLlmError` state, reset at every `generateWithLLM` call and populated in the `catch` branch.
- Exported `consumeLastCommitMessageError()` accessor so `AutoCommitManager`, CLI diagnostics, or the TUI can retrieve and surface the originating error.
- Three regression tests: happy error preservation, idempotent consume, and successful second call clearing the stored error.

### 4. [high] MCP OAuth — detect authorization-server rotation
Alexi does not ship a full OAuth provider yet (SAP AI Core uses `AICORE_SERVICE_KEY` client-credentials, not OAuth), but the helpers are needed when third-party MCP servers are wired. Created `src/mcp/oauth-issuer.ts` with:
- `hasIssuerChanged(stored, discovered)` — compares `issuer` and `authorization_endpoint`. Fresh install (no stored issuer) returns `false`; missing `authorization_endpoint` on the stored side is treated as drift to force re-registration.
- `requireReregistration(stored, discovered)` — returns `'none' | 'issuer_rotated'`.
- Full test coverage (fresh install, exact match, issuer drift, endpoint drift, legacy record, unknown target).
- Re-exported via `src/mcp/index.ts`.

### 5. [medium] Config overlay — reject shadowed writes
Alexi has a precedence chain for managed-vs-user config (`src/config/userConfig.ts`) but no reusable shadow-detection surface. Created `src/config/overlay.ts` with:
- `detectShadowedWrite(key, targetOverlay, layers)` — returns the highest-precedence shadower (not an arbitrary intermediate one) so warnings point at the layer that will actually win at read time.
- `formatShadowedWriteWarning(...)` — centralised wording so every call site is consistent.
- Tests covering tie precedence (same-precedence layers do NOT shadow), multi-layer selection, unknown overlay, and the warning text contract.

## Items from the plan NOT executed

The plan file was truncated mid-way through item #5 (after "`value: un`" the token-budget suffix cut off the remainder). Items #6, #7, #8 were listed in the "Summary: 8 changes" header but their content was not present in the plan document delivered. No speculative changes were introduced in their place, per the instruction not to add extras not in the plan.

## Issues Encountered

- **Field-name divergence**: upstream board tool uses `to`, Alexi uses `recipient`. The self-post refusal and roster `self: true` semantics were applied under Alexi's field name without changing the public schema (would have been a breaking change for existing agents using the tool).
- **Missing OAuth provider in Alexi**: upstream `oauth-provider.ts` does not have an Alexi counterpart. Only the pure `oauth-issuer.ts` helper was ported; integration is deferred until an OAuth provider lands.
- **No layered overlay system today**: Alexi has only managed-vs-user precedence hardcoded in `userConfig.ts`. The `overlay.ts` module is a forward-looking helper; it is not wired into the save path yet because there is no abstracted "write to layer X" code path to intercept.

## Verification Checklist

- [x] All new files have JSDoc headers citing the originating upstream commit(s).
- [x] Every modified behaviour has a regression test asserting the new contract.
- [x] No existing test was changed in a way that would have required a snapshot update.
- [x] All imports use `.js` extensions (ESM NodeNext rule).
- [x] No `console.*` added outside `src/utils/logger.ts`.
- [x] No breaking schema changes (added fields are optional; refused inputs return a structured `{success: false, error}` result consistent with other tools).
- [x] SAP AI Core authentication path (`AICORE_SERVICE_KEY`) is untouched.
