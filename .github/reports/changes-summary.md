# Update Plan Execution Summary

Date: 2026-08-22
Executed against plan derived from upstream kilocode (fe760ab02..ff74e2ea3) and opencode (e11dbd0..e00890c).

## Files modified

| File | Type | Change |
| --- | --- | --- |
| `src/tool/tools/task.ts` | modify | Added `SubagentPart`, `SubagentResult`, `surfaceSubagentResult()` for opencode #43821 fix |
| `src/tool/tools/task.test.ts` | create | Vitest coverage for the new subagent result surfacer (5 cases) |
| `src/core/session/retry.ts` | modify | Added `RETRYABLE_NETWORK_PATTERNS` and `isNetworkRetryable()` default classifier |
| `tests/session/retry.test.ts` | modify | Added tests for `isNetworkRetryable` (parameterised over 8 network patterns + unknown finish reason + negative cases) |
| `src/core/agenticChat.ts` | modify | Emit a warning progress event when `finishReason === 'unknown'` (opencode #43892 intent) |
| `src/providers/protocols/shared.ts` | create | Ports kilocode PRs #13255 / #13301 — `coalesceUserMessages()` helper for Anthropic / Bedrock Converse / Gemini strict-alternation providers |
| `src/providers/protocols/shared.test.ts` | create | Vitest coverage for the coalescing helper (6 cases: pass-through, string+string, array+string, triple merge, immutability, non-user roles) |

## Change-by-change summary

### 1. (critical) Surface subagent tool errors — `src/tool/tools/task.ts`
The Alexi task tool is currently a placeholder that returns synthesized text; it doesn't yet issue real subagent LLM turns. Rather than force a mid-refactor rewrite of the placeholder path, the upstream fix was landed as a standalone, tree-shakeable helper — `surfaceSubagentResult(result, taskId)` — with the exact precedence contract from opencode #43821 (info.error → errored tool part → last text). Once the full session/subagent integration lands, callers only need to route the SDK's `SessionMessageInfo` + `parts` through this helper to inherit the fix. The helper is fully tested in the accompanying `task.test.ts`.

**Implementation note**: Used an inline reverse loop instead of `Array.prototype.findLast` because Alexi's `tsconfig.json` targets `ES2022`, and `findLast` lives in the `ES2023` lib. Node 22 has the method at runtime, but the type-checker would flag it.

### 2. (high) Test coverage for subagent surfacing — `src/tool/tools/task.test.ts`
Five cases: errored tool part throws, no errors returns last text, `MessageOutputLengthError` gets the special human-readable message, empty parts returns `''`, and `info.error` takes precedence over inner tool errors (matches upstream precedence).

### 3. (high) PTY termination hardening — **SKIPPED**
The plan flagged this as "if PTY module exists in Alexi; otherwise skip". `src/core/pty/**` does not exist in this repo (checked via `glob`), so no work was done here. If a PTY module is added in the future, the guarded `direct(proc)` escalation pattern from the plan should be applied.

### 4. (high) `textVerbosity` guard — **NOT APPLICABLE**
Grepped `src/**/*.ts` for `textVerbosity`: no occurrences. Alexi does not currently inject a `textVerbosity` provider option, so there's nothing to guard. When the feature is added (likely on top of `src/providers/sapOrchestration.ts` or a future openai-compatible adapter), the capability-check pattern from the plan should be used verbatim.

### 5. (high) Retry unknown/raw network finish errors — `src/core/session/retry.ts`
Added `RETRYABLE_NETWORK_PATTERNS` (readonly regex array covering the full opencode `e0b9e68` + `40282c1` set: `ECONNRESET`, `ETIMEDOUT`, `ENOTFOUND`, `EAI_AGAIN`, `socket hang up`, `network error`, `fetch failed`, `terminated`, `premature close`) and a new `isNetworkRetryable(err)` default classifier. Also recognises `finishReason === 'unknown'` per the upstream broadening. Existing `withRetry` signature and behaviour are unchanged — this is a purely additive helper callers can compose with rate-limit / auth predicates from `error-backoff.ts`.

### 6. (medium) Continue on unknown finish response — `src/core/agenticChat.ts`
Alexi's chat runner doesn't use a `switch (finishReason)` block that would `throw` on unknown reasons; instead it flows into the tool-call detection block regardless. To port the upstream intent (opencode #43892: unknown finish is transient, not fatal), a warning progress event is now emitted when `result.finishReason === 'unknown'`, immediately after the existing `'length'` warning. This gives operators a diagnostic signal for flaky proxies without altering control flow.

### 7. (medium) Coalesce consecutive user messages — `src/providers/protocols/shared.ts`
Created the new `src/providers/protocols/` directory and dropped in `shared.ts` with `coalesceUserMessages<T>(messages)`. Structural `CoalesceableMessage` interface keeps the helper importable without an `ai` SDK dependency; string content is lifted to `[{ type: 'text', text }]` before concatenation so the result is uniform. Because Alexi currently routes chat through `sapOrchestration.ts` (which handles its own message shaping), no existing adapter needed rewiring — but the helper is now available for plugin-authored providers and any future Anthropic/Bedrock/Gemini adapter. Full test coverage in `shared.test.ts`.

### 8. (low) OAuth device-code URL resolution — **NOT APPLICABLE**
Alexi does not ship the opencode OAuth device-code plugin (`src/providers/opencode-plugin.ts` does not exist). Skipped per the plan's "only if Alexi ships …" qualifier.

## SAP AI Core compatibility

None of the changes touch the SAP orchestration adapter (`src/providers/sapOrchestration.ts`), the SAP-specific auth/proxy layers, or the existing rate-limit / retry-after handling in `error-backoff.ts`. Additions are:
- One new pure-function helper in the task tool module (unused until subagent integration lands).
- One new pure-function helper + regex constant in `session/retry.ts` (opt-in — no default wiring changed).
- One new warning event in `agenticChat.ts` (progress observers only; no error thrown, no message shape changed).
- One brand-new module (`providers/protocols/shared.ts`) — no imports anywhere else yet.

No existing behaviour changes on the SAP AI Core code path.

## Issues encountered

- **`Array.prototype.findLast` typing**: initial implementation of the subagent surfacer used `findLast`, but Alexi's `tsconfig.json` targets `ES2022` which does not include the ES2023 lib. Rewrote as an inline reverse-scan loop. Semantics preserved.
- **Change #4 (`textVerbosity`) and #6 (`switch (finishReason)`)** had no corresponding sites in Alexi. Landed the intent where possible (a warning-emit for unknown finish) and explicitly documented the skip for `textVerbosity`.
- **Changes #3 (PTY) and #8 (opencode-plugin)** were flagged as conditional in the plan itself and correctly skipped.

## Verification checklist

Before push, run locally in this order per `AGENTS.md`:
```
npm run lint
npm run typecheck
npm run format:check
npm run test:coverage
npm run build
```

New tests added:
- `src/tool/tools/task.test.ts` (5 cases)
- `src/providers/protocols/shared.test.ts` (6 cases)
- `tests/session/retry.test.ts` (+11 cases in a new `describe('isNetworkRetryable')` block)
