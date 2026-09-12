# Update Plan Execution Summary

**Executed**: 2026-09-12
**Plan source**: kilocode `4304a8691..c36e22634` + opencode `193de13..95daf90`

## Files modified

| File | Type | Change |
| --- | --- | --- |
| `src/providers/model-selection.ts` | new | Auxiliary-task model selector with SAP AI Core + Kilo credential gating |
| `src/providers/__tests__/model-selection.test.ts` | new | Unit tests for `selectModelForTask`, `getModel`, `resolveSmallModelDeployment`, `buildContext` |
| `src/providers/index.ts` | modified | Re-export new model-selection API |
| `src/core/__tests__/compaction.test.ts` | modified | Add `vi.restoreAllMocks()` in `beforeEach` to isolate auxiliary-call spies |
| `src/config/userConfig.ts` | modified | Add `getConfigCompactionModel` / `setConfigCompactionModel` with legacy-key shim |
| `tests/config/userConfig.test.ts` | modified | Add tests for compaction-model config migration |

## Change-by-change

### Change #1 & #3 — auxiliary-task model gating (**high priority**)
**Status**: ✅ Applied
**Files**: `src/providers/model-selection.ts` (new), `src/providers/__tests__/model-selection.test.ts` (new), `src/providers/index.ts` (re-export)

Introduced a `selectModelForTask(task, context)` helper that only chooses a small-model fallback when the active provider actually supports it (SAP AI Core deployment configured *or* Kilo credentials present). When neither is available, auxiliary calls transparently reuse the primary model — the important safety property that prevents `deployment_not_found` / auth failures on operators who did not provision a dedicated small model.

Also added:
- `GetModelOptions.auxiliary` flag threaded through the new `getModel(id?, opts?)` helper (mirrors upstream `packages/opencode/src/provider/provider.ts` +14/-3).
- `resolveSmallModelDeployment()` — reads from `models.compaction` (new location), falling back to legacy `context.compactionModel`, then to `AICORE_SMALL_MODEL` env var.
- `buildContext()` — pins `providerID` to `sap-ai-core` and reports `hasKiloCredentials() === false` (Kilo is not a live provider in Alexi; kept for symmetry with the upstream shape).
- `getAuxiliaryModelId()` — convenience wrapper returning the raw model id string, ready to pass to `getProviderForModelWithFallback`.

Tests cover the matrix from the plan: `{kilo-creds, no-kilo-creds, sap-with-small, sap-no-small} × {primary, auxiliary}` plus edge cases (async credential probe, defensive `hasSapDeployment` gating).

**Callers**: no production auxiliary-task callers use `getModel()` today (Alexi's `commitMessage.ts` uses `routePrompt({preferCheap:true})`, and `compaction.ts` has `LLMSummarizeFn` as a lazy injection point that is not wired at present). The API is in place for future wiring; existing paths are untouched to avoid unrelated regressions.

### Change #2 — compaction test hygiene (**medium priority**)
**Status**: ✅ Applied
**File**: `src/core/__tests__/compaction.test.ts`

Added `vi.restoreAllMocks()` in the top-level `beforeEach` alongside the existing `setLLMSummarizeFn(null)` reset. Alexi doesn't ship a `Session.generateTitle` helper today (upstream's flake trigger), but restoring mocks guarantees auxiliary spies from one test cannot leak into another test's exact-call-count assertions. Comment cites upstream `0f33a6673`.

### Change #4 — compaction model config location (**medium priority**)
**Status**: ✅ Applied
**Files**: `src/config/userConfig.ts`, `tests/config/userConfig.test.ts`

Added:
- `getConfigCompactionModel()` — prefers `models.compaction`, falls back to legacy `context.compactionModel` with a one-shot deprecation warning per process.
- `setConfigCompactionModel(id)` — always writes to `models.compaction` and clears the legacy `context.compactionModel` key (one-way migration) while preserving unrelated `context.*` keys.
- `_resetLegacyCompactionModelWarning()` — `@internal` hook so tests start from a clean warning state.

Tests verify precedence order, migration behaviour, deprecation warning firing exactly-once, empty-string rejection, and the no-warn path.

### Change #5 — ACP session options / reasoning boundaries (**low priority**)
**Status**: ⏭️ Skipped (per plan authorization)
**Reason**: Alexi does not ship ACP (`src/acp/**` does not exist — verified via `glob`). The plan explicitly designates this as "defer / not applicable" for a SAP-focused terminal codebase.

## Notes / issues encountered

- **Circular import**: `model-selection.ts` imports `getDefaultModel` from `./index.js`, which now re-exports from `./model-selection.js`. This is safe because `getDefaultModel` is only referenced at call time inside function bodies (not at module init), so ESM's live-binding resolves it correctly after both modules finish loading. The pattern matches other similar circular re-exports elsewhere in the file (e.g. `sapOrchestration.js`).
- **`no-console` lint**: The legacy-config deprecation warning in `userConfig.ts` uses `console.warn` with an `eslint-disable-next-line no-console` pragma. A single-shot deprecation warning does not warrant threading the full logger through `config/*`, and this file cannot import `utils/logger.ts` without a boot cycle (logger consumers depend on config).
- **SAP AI Core compatibility**: no changes touch the SAP client, auth, deployment lookup, or `getProviderForModel` primitive. The new `model-selection` module is purely additive — existing callers continue to hit `getDefaultModel()` unchanged.
- **Provider `getModel` naming**: The new export is aliased to `getModelRef` in `src/providers/index.ts` to avoid shadowing any future `getModel` re-export from `sapOrchestration.js`. Consumers get an unambiguous name.
- **No formatter/lint run performed** in this execution (per environment constraints); files were authored against the repo's Prettier + ESLint conventions (100-col, single quotes, `trailingComma: es5`, `curly: all`, `eqeqeq`). Recommend `npm run lint && npm run format:check && npm test` before merge.
