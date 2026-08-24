# Changes Summary

Generated: 2026-08-24
Update plan basis: upstream commits 4161695, 7bbfe42, f2a1d54, b1ce938, 63a883a, b3bad6b, dd3f915, fa11755, 17b4730, 3d31e4b, 32c3637, 9d466cd, dc13c6b

## Files Modified

**None.** No source files required changes in this update window.

## Executed Plan Items

The update plan contained 2 medium-priority items, both explicitly conditional on Alexi
having a stats/telemetry model-normalization utility equivalent to opencode's
`packages/stats/core/src/domain/model-normalization.ts` (`normalizeInferenceModel`).

### 1. Lowercase model names before suffix stripping (stats normalization) — SKIPPED (condition not met)

- **Plan condition**: "Only apply if Alexi has a stats/telemetry normalization utility."
- **Investigation performed**:
  - `glob src/stats/**/*.ts` → no matches (Alexi has no `src/stats/` directory).
  - `grep normalizeInferenceModel|model-normalization|normalizeModel` across `src/` → 0 matches.
  - `grep normalizeInference|normaliseModel|normalizeModelName` across `src/` → 0 matches.
  - `grep '(-free|:free|:global)'` across `src/` → matches only relate to
    `src/providers/sapOrchestration.ts` free-tier 429 classification (an
    unrelated heuristic that already uses case-insensitive matching on the
    `-free` suffix — see `isFreeModel`). No suffix-stripping normalizer
    exists.
  - `src/core/stats.ts` inspected: aggregates sessions/costs/memories but
    stores model identifiers verbatim (see `sessionsByModel: Record<string, number>`);
    no canonicalization step exists that could gain a `.toLowerCase()` call.
- **Result**: The utility this fix targets does not exist in Alexi, so there
  is nothing to patch. Creating a new normalizer just to receive this fix
  would be scope creep (no consumers).

### 2. Add test case for uppercase model normalization — SKIPPED (condition not met)

- **Plan condition**: "Only add if the utility above exists in Alexi."
- **Result**: The utility does not exist (see item 1), so no test file was created.

## Changes Explicitly NOT Ported (per plan)

The plan already enumerated these upstream commits as non-applicable:

| Upstream Commit | Reason |
|---|---|
| `17b4730` unblock workspace action | Console admin UI/API — not part of Alexi CLI |
| `b1ce938` DeepSeek weekend pricing | opencode Zen cloud proxy — Alexi uses SAP AI Core |
| `32c3637`, `3d31e4b`, `fa11755`, `dd3f915`, `b3bad6b`, `63a883a`, `f2a1d54` | Zen request body streaming — no equivalent in Alexi |
| `dc13c6b` reduce zen request memory | Zen internals — N/A |
| `7bbfe42` always allow ox alpha in go | Support/release tooling — N/A |
| `03bba46`, `ca10088`, `c11c41b`, `bb72277`, `e3bd6e0` | Auto-generated console artifacts — N/A |

## Issues Encountered

None. The plan itself flagged both actionable items as conditional; the
condition (existence of a `normalizeInferenceModel`-style utility in Alexi)
evaluated to false after direct inspection of `src/`, so both items were
correctly no-ops.

## SAP AI Core Compatibility

Untouched. No provider code, routing config, or model-id handling was
modified in this run.

## Testing Recommendations

None triggered by this run (no code changes). If a future patch introduces
an Alexi-side model normalizer, revisit this plan and apply the lowercase
fix + regression test at that time.
